import logging
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..model_service import model_service, SUPPORTED_CROPS
from ..config import settings

logger = logging.getLogger(__name__)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


def validate_image_metadata(file: UploadFile) -> None:
    """Validate uploaded image MIME type."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: jpeg, png, webp.",
        )


@router.get("/crops")
async def list_supported_crops():
    """Return the list of crops supported in this demo."""
    # Deduplicate crops by canonical label while presenting clean options
    seen_prefixes = set()
    unique_crops = []
    for key, meta in sorted(SUPPORTED_CROPS.items()):
        prefix = meta.get("prefix")
        if prefix and prefix in seen_prefixes:
            continue
        if prefix:
            seen_prefixes.add(prefix)
        unique_crops.append(
            {
                "key": key,
                "label": meta["label"],
                "label_mr": meta["label_mr"],
                "emoji": meta["emoji"],
                "has_ai_model": prefix is not None,
            }
        )

    return {"crops": unique_crops}


@router.post("/predict")
@limiter.limit(f"{settings.rate_limit_requests}/{settings.rate_limit_window}second")
async def predict_disease(
    request: Request,
    image: UploadFile = File(..., description="Plant leaf image"),
    crop: Optional[str] = Form(None, description="Optional crop key (e.g. tomato, maize, grape, onion)"),
):
    """Predict plant disease from an uploaded image, optionally filtered/validated by crop."""
    try:
        # 503 when model unavailable (unless onion symptom guide)
        if not model_service.is_healthy() and (not crop or crop.lower().strip() != "onion"):
            raise HTTPException(
                status_code=503,
                detail="Model service is temporarily unavailable. Please try again in a moment.",
                headers={"Retry-After": "30"},
            )

        validate_image_metadata(image)

        # Enforce image size limits against actual uploaded bytes in chunks
        contents = bytearray()
        max_bytes = settings.max_image_size_bytes
        chunk_size = 64 * 1024

        while True:
            chunk = await image.read(chunk_size)
            if not chunk:
                break
            contents.extend(chunk)
            if len(contents) > max_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum: {max_bytes / (1024 * 1024):.1f} MB",
                )

        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file received.")

        image_bytes = bytes(contents)
        result = model_service.predict(image_bytes, crop=crop)
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except ValueError as e:
        logger.warning("Validation rejection during prediction: %s", e)
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        logger.error("Model runtime error: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Model service is temporarily unavailable. Please try again.",
            headers={"Retry-After": "30"},
        )
    except Exception as e:
        logger.error("Unexpected prediction error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred during prediction.")
    finally:
        if hasattr(image, 'close'):
            await image.close()
