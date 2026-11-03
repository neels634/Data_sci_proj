"""Satellite farm analysis service for Crop Check (Sentinel-2 via Google Earth Engine).

This is separate from the disease model in ``app/main.py`` and needs none of its heavy
dependencies. Run it from this folder:

    pip install -r requirements-satellite.txt
    uvicorn main:app --reload --port 8001

Earth Engine credentials come from ``earthengine authenticate``.
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta, timezone
from typing import Any

import ee
import geojson
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logger = logging.getLogger("satellite")

GEE_PROJECT = os.getenv("GEE_PROJECT", "neat-vent-307406")
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("SATELLITE_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]

S2_COLLECTION = "COPERNICUS/S2_SR_HARMONIZED"
CLOUD_SCORE_COLLECTION = "GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED"
LOOKBACK_DAYS = 90
CS_CDF_THRESHOLD = 0.60
MASKED_SCL_CLASSES = (3, 8, 9, 10)  # cloud shadow, medium and high cloud, cirrus
DATE_CLOUD_LIMIT = 60

INDEX_NAMES = ["ndvi", "evi", "savi", "ndmi", "ndwi", "gndvi", "cvi"]
MAX_SAMPLE_POINTS = 5000
MAX_VERTICES = 500
SAMPLE_SCALES_M = (10, 20)


class AnalysisError(HTTPException):
    """A refusal with a stable code; the app shows it in the farmer's language."""

    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})


class AnalyzeRequest(BaseModel):
    geometry: dict[str, Any]
    field_name: str = Field(default="Field 1", max_length=80)


class DatesRequest(BaseModel):
    geometry: dict[str, Any]


def _init_earth_engine() -> None:
    ee.Initialize(project=GEE_PROJECT)


_ee_ready = False


def _ensure_earth_engine() -> None:
    """Connect once; if it failed at startup, try again so a restart isn't needed."""
    global _ee_ready
    if _ee_ready:
        return
    try:
        _init_earth_engine()
        _ee_ready = True
    except Exception as exc:
        logger.exception("Earth Engine initialisation failed")
        raise AnalysisError(503, "earth_engine_unavailable", "Couldn't connect to Earth Engine.") from exc


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        _ensure_earth_engine()
    except AnalysisError:
        logger.warning("Starting without Earth Engine; will retry on the first request")
    yield


app = FastAPI(title="Shet Samruddhi satellite analysis", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])


# ---- geometry validation ----------------------------------------------------


def _segments_cross(a, b, c, d) -> bool:
    def side(p, q, r):
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])

    d1, d2, d3, d4 = side(c, d, a), side(c, d, b), side(a, b, c), side(a, b, d)
    return d1 * d2 < 0 and d3 * d4 < 0


def _ring_crosses_itself(ring: list) -> bool:
    n = len(ring) - 1
    for i in range(n):
        for j in range(i + 2, n):
            if i == 0 and j == n - 1:
                continue  # these two edges share the closing vertex
            if _segments_cross(ring[i], ring[i + 1], ring[j], ring[j + 1]):
                return True
    return False


def validate_polygon(geometry: dict[str, Any]) -> dict[str, Any]:
    """Return a clean GeoJSON Polygon with closed rings, or refuse it with a clear reason."""
    if geometry.get("type") != "Polygon":
        raise AnalysisError(422, "not_polygon", "The field boundary must be a single polygon.")
    rings = geometry.get("coordinates")
    if not isinstance(rings, list) or not rings:
        raise AnalysisError(422, "invalid_polygon", "The field boundary has no coordinates.")

    clean_rings = []
    for raw in rings:
        try:
            ring = [[float(p[0]), float(p[1])] for p in raw]
        except (TypeError, ValueError, IndexError) as exc:
            raise AnalysisError(422, "invalid_polygon", "The field boundary has invalid coordinates.") from exc
        if any(not (-180 <= x <= 180 and -90 <= y <= 90) for x, y in ring):
            raise AnalysisError(422, "invalid_polygon", "The field boundary has coordinates outside the map.")
        if ring and ring[0] != ring[-1]:
            ring.append(ring[0])
        if len(ring) < 4:
            raise AnalysisError(422, "invalid_polygon", "A field boundary needs at least 3 points.")
        if len(ring) > MAX_VERTICES:
            raise AnalysisError(422, "too_many_vertices", f"A field boundary can have at most {MAX_VERTICES} points.")
        clean_rings.append(ring)

    polygon = geojson.Polygon(clean_rings)
    if not polygon.is_valid or _ring_crosses_itself(clean_rings[0]):
        raise AnalysisError(422, "self_intersecting", "The field boundary crosses itself. Draw it again.")
    return {"type": "Polygon", "coordinates": clean_rings}


def to_ee_geometry(polygon: dict[str, Any]) -> ee.Geometry:
    # planar edges, so the area analysed matches the straight lines drawn on the map
    return ee.Geometry(polygon, opt_geodesic=False)


# ---- Earth Engine pipeline ---------------------------------------------------


def _date_window() -> tuple[str, str]:
    today = datetime.now(timezone.utc).date()
    # filterDate's end is exclusive, so go one day past today to include it
    return (today - timedelta(days=LOOKBACK_DAYS)).isoformat(), (today + timedelta(days=1)).isoformat()


def _scenes(region: ee.Geometry) -> ee.ImageCollection:
    start, end = _date_window()
    return ee.ImageCollection(S2_COLLECTION).filterBounds(region).filterDate(start, end)


def _mask_clouds(image: ee.Image) -> ee.Image:
    scl = image.select("SCL")
    clear = scl.neq(MASKED_SCL_CLASSES[0])
    for value in MASKED_SCL_CLASSES[1:]:
        clear = clear.And(scl.neq(value))
    confident = image.select("cs_cdf").gte(CS_CDF_THRESHOLD)
    # bands are stored as reflectance x 10000; EVI and SAVI constants need true reflectance
    return image.select(["B2", "B3", "B4", "B8", "B11"]).divide(10000).updateMask(clear).updateMask(confident)


def build_composite(scenes: ee.ImageCollection) -> ee.Image:
    linked = scenes.linkCollection(ee.ImageCollection(CLOUD_SCORE_COLLECTION), ["cs_cdf"])
    return linked.map(_mask_clouds).median()


def add_indices(composite: ee.Image) -> ee.Image:
    bands = {name: composite.select(name) for name in ("B2", "B3", "B4", "B8", "B11")}
    ndvi = composite.expression("(B8 - B4) / (B8 + B4)", bands).rename("ndvi")
    evi = composite.expression("2.5 * (B8 - B4) / (B8 + 6 * B4 - 7.5 * B2 + 1)", bands).rename("evi")
    savi = composite.expression("((B8 - B4) / (B8 + B4 + 0.5)) * 1.5", bands).rename("savi")
    ndmi = composite.expression("(B8 - B11) / (B8 + B11)", bands).rename("ndmi")
    ndwi = composite.expression("(B3 - B8) / (B3 + B8)", bands).rename("ndwi")
    gndvi = composite.expression("(B8 - B3) / (B8 + B3)", bands).rename("gndvi")
    cvi = ndvi.multiply(0.70).add(evi.multiply(0.10)).add(savi.multiply(0.05)).add(ndmi.multiply(0.10)).add(gndvi.multiply(0.05)).rename("cvi")
    return ee.Image.cat([ndvi, evi, savi, ndmi, ndwi, gndvi, cvi]).toFloat()


def choose_scale(area_m2: float) -> int:
    """Finest allowed sampling that stays within the point limit, or refuse an oversized field."""
    for scale in SAMPLE_SCALES_M:
        if area_m2 / (scale * scale) <= MAX_SAMPLE_POINTS:
            return scale
    max_ha = MAX_SAMPLE_POINTS * SAMPLE_SCALES_M[-1] ** 2 / 10_000
    raise AnalysisError(422, "field_too_large", f"This field is too large. Draw an area under {max_ha:.0f} hectares.")


def summarise(indices: ee.Image, region: ee.Geometry, scale: int) -> dict[str, dict[str, float | None]]:
    reducer = ee.Reducer.minMax().combine(ee.Reducer.mean(), sharedInputs=True).combine(ee.Reducer.stdDev(), sharedInputs=True)
    stats = indices.reduceRegion(reducer=reducer, geometry=region, scale=scale, maxPixels=int(1e8), bestEffort=False).getInfo()

    def value(name: str, stat: str) -> float | None:
        v = stats.get(f"{name}_{stat}")
        return round(v, 4) if v is not None else None

    return {name: {"min": value(name, "min"), "max": value(name, "max"), "mean": value(name, "mean"), "std": value(name, "stdDev")} for name in INDEX_NAMES}


def _clean_feature(feature: dict[str, Any]) -> dict[str, Any]:
    lon, lat = feature["geometry"]["coordinates"]
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [round(lon, 6), round(lat, 6)]},
        "properties": {name: round(feature["properties"][name], 4) for name in INDEX_NAMES if feature["properties"].get(name) is not None},
    }


def _earth_engine_failure(exc: Exception) -> AnalysisError:
    logger.exception("Earth Engine request failed")
    return AnalysisError(502, "earth_engine_error", "Earth Engine couldn't complete this request. Try again.")


# ---- routes ------------------------------------------------------------------


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "earth_engine": _ee_ready, "project": GEE_PROJECT}


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest) -> dict[str, Any]:
    polygon = validate_polygon(request.geometry)
    _ensure_earth_engine()
    region = to_ee_geometry(polygon)

    try:
        area_m2 = region.area(maxError=1).getInfo()
        scale = choose_scale(area_m2)

        scenes = _scenes(region)
        scene_count = scenes.size().getInfo()
        if scene_count == 0:
            raise AnalysisError(404, "no_imagery", f"No Sentinel-2 images of this field in the last {LOOKBACK_DAYS} days.")

        indices = add_indices(build_composite(scenes))
        # dropNulls (the default) leaves out pixels that were cloudy in every scene
        samples = indices.sample(region=region, scale=scale, geometries=True).limit(MAX_SAMPLE_POINTS).getInfo()
        features = [_clean_feature(f) for f in samples.get("features", [])]
        if not features:
            raise AnalysisError(404, "no_clear_pixels", f"This field had no cloud-free view in the last {LOOKBACK_DAYS} days, or it's too small to measure.")

        stats = summarise(indices, region, scale)
    except AnalysisError:
        raise
    except Exception as exc:
        raise _earth_engine_failure(exc) from exc

    start, end = _date_window()
    return {
        "type": "FeatureCollection",
        "features": features,
        "farm_summary": {
            "field_name": request.field_name,
            "area_hectares": round(area_m2 / 10_000, 3),
            "sample_count": len(features),
            "sample_scale_m": scale,
            "scene_count": scene_count,
            "date_from": start,
            "date_to": (date.fromisoformat(end) - timedelta(days=1)).isoformat(),
            "indices": stats,
        },
        "farm_boundary": polygon,
    }


@app.post("/api/analyze-dates")
def analyze_dates(request: DatesRequest) -> dict[str, Any]:
    polygon = validate_polygon(request.geometry)
    _ensure_earth_engine()
    region = to_ee_geometry(polygon)

    try:
        scenes = _scenes(region).filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", DATE_CLOUD_LIMIT))
        times = scenes.aggregate_array("system:time_start").getInfo()
        clouds = scenes.aggregate_array("CLOUDY_PIXEL_PERCENTAGE").getInfo()
    except Exception as exc:
        raise _earth_engine_failure(exc) from exc

    # a field can fall in several tiles on one day; keep that day's clearest figure
    by_date: dict[str, float] = {}
    for millis, cloud in zip(times, clouds):
        day = datetime.fromtimestamp(millis / 1000, tz=timezone.utc).date().isoformat()
        by_date[day] = min(cloud, by_date.get(day, cloud))

    return {"dates": [{"date": day, "cloud_cover": round(by_date[day], 1)} for day in sorted(by_date, reverse=True)]}
