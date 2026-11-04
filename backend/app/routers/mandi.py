"""
Mandi prices from AGMARKNET via data.gov.in ("Current Daily Price of Various Commodities from
Various Markets (Mandi)").

GET /api/mandi/prices?commodity=Onion&state=Maharashtra[&district=&market=&variety=&date=YYYY-MM-DD]

The key (DATA_GOV_IN_API_KEY, or AGMARKNET_API_KEY) stays on the server. Without a key the
endpoint answers 503 instead of stopping the whole API from starting. Answers are kept in memory
for MANDI_CACHE_TTL seconds (3 hours by default, like the Next.js /api/mandi-prices route).
"""
import datetime
import json
import logging
import os
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Tuple

from fastapi import APIRouter, HTTPException, Query, Request

from ..config import settings
from ..models import MandiPrice, MandiPricesResponse
from .predict import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mandi")

BASE_URL = os.getenv(
    "AGMARKNET_BASE_URL",
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
)
PAGE = 1000
MAX_PAGES = 5
TIMEOUT_S = 15
CACHE_TTL_S = int(os.getenv("MANDI_CACHE_TTL", str(3 * 60 * 60)))
CACHE_MAX = 500

_cache: Dict[Tuple, Tuple[float, MandiPricesResponse]] = {}
_cache_lock = threading.Lock()


def _api_key() -> Optional[str]:
    # read per request so a key added to the environment works without code changes
    return os.getenv("DATA_GOV_IN_API_KEY") or os.getenv("AGMARKNET_API_KEY")


def _iso_date(value: str) -> Optional[str]:
    """data.gov.in sends DD/MM/YYYY; also accept YYYY-MM-DD."""
    value = (value or "").strip()
    m = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", value)
    if m:
        d, mo, y = m.groups()
        try:
            return datetime.date(int(y), int(mo), int(d)).isoformat()
        except ValueError:
            return None
    try:
        return datetime.date.fromisoformat(value).isoformat()
    except ValueError:
        return None


def _price(value) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _normalise(rec: dict) -> Optional[MandiPrice]:
    modal = _price(rec.get("modal_price"))
    market = (rec.get("market") or "").strip()
    arrival = _iso_date(rec.get("arrival_date", ""))
    if not market or modal <= 0 or not arrival:
        return None  # skip malformed rows
    low = _price(rec.get("min_price"))
    high = _price(rec.get("max_price"))
    return MandiPrice(
        commodity=(rec.get("commodity") or "").strip(),
        state=(rec.get("state") or "").strip(),
        district=(rec.get("district") or "").strip(),
        market=market,
        variety=(rec.get("variety") or "").strip(),
        grade=(rec.get("grade") or "").strip(),
        arrival_date=arrival,
        price_min=low if low > 0 else modal,
        price_max=high if high > 0 else modal,
        price_modal=modal,
    )


def _fetch_records(key: str, filters: Dict[str, str]) -> List[dict]:
    out: List[dict] = []
    for page in range(MAX_PAGES):
        params = {"api-key": key, "format": "json", "limit": PAGE, "offset": page * PAGE}
        params.update({f"filters[{k}]": v for k, v in filters.items()})
        url = f"{BASE_URL}?{urllib.parse.urlencode(params)}"
        with urllib.request.urlopen(url, timeout=TIMEOUT_S) as resp:
            data = json.load(resp)
        records = data.get("records") or []
        out.extend(records)
        if len(records) < PAGE:
            break
    return out


@router.get("/prices", response_model=MandiPricesResponse)
@limiter.limit(f"{settings.rate_limit_requests}/{settings.rate_limit_window}second")
def get_prices(
    request: Request,
    commodity: str = Query(..., min_length=1, max_length=60, description="Crop name as AGMARKNET spells it, e.g. Onion"),
    state: str = Query("Maharashtra", max_length=60),
    district: Optional[str] = Query(None, max_length=60),
    market: Optional[str] = Query(None, max_length=80),
    variety: Optional[str] = Query(None, max_length=80),
    date: Optional[str] = Query(None, description="Arrival date YYYY-MM-DD"),
):
    """Today's (or a given day's) mandi prices, newest first."""
    key = _api_key()
    if not key:
        raise HTTPException(status_code=503, detail="Mandi price service is not configured (DATA_GOV_IN_API_KEY is not set)")

    filters = {"commodity": commodity.strip(), "state": state.strip()}
    for name, value in (("district", district), ("market", market), ("variety", variety)):
        if value and value.strip():
            filters[name] = value.strip()
    if date:
        iso = _iso_date(date)
        if not iso:
            raise HTTPException(status_code=400, detail="Invalid date, use YYYY-MM-DD")
        y, m, d = iso.split("-")
        filters["arrival_date"] = f"{d}/{m}/{y}"  # the dataset's own format

    cache_key = tuple(sorted((k, v.lower()) for k, v in filters.items()))
    now = time.time()
    with _cache_lock:
        hit = _cache.get(cache_key)
    if hit and now - hit[0] < CACHE_TTL_S:
        return hit[1].model_copy(update={"source": "cache"})

    try:
        raw = _fetch_records(key, filters)
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        # never echo the URL: it carries the API key
        logger.warning("AGMARKNET request failed: %s", type(exc).__name__)
        if hit:
            return hit[1].model_copy(update={"source": "cache"})  # stale beats nothing
        raise HTTPException(status_code=502, detail="Mandi price service is unreachable, try again later")

    rows = [r for r in (_normalise(rec) for rec in raw) if r]
    if not rows:
        raise HTTPException(status_code=404, detail="No price records found")
    rows.sort(key=lambda r: (r.arrival_date, r.price_modal), reverse=True)

    body = MandiPricesResponse(
        source="live",
        retrieved_at=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        count=len(rows),
        records=rows,
    )
    with _cache_lock:
        if len(_cache) >= CACHE_MAX:
            _cache.clear()
        _cache[cache_key] = (now, body)
    return body
