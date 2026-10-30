from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import Optional
import uuid

from ..models import ErrorResponse
from ..model_service import model_service, SUPPORTED_CROPS
from ..config import settings


# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file type and size."""
    if hasattr(file, 'size') and file.size and file.size > settings.max_image_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File size too large. Maximum: {settings.max_image_size_bytes / (1024*1024):.1f} MB",
        )
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: jpeg, png, webp.",
        )


@router.get("/crops")
async def list_supported_crops():
    """Return the list of crops supported in this demo."""
    return {
        "crops": [
            {
                "key": key,
                "label": meta["label"],
                "label_mr": meta["label_mr"],
                "emoji": meta["emoji"],
                "has_ai_model": meta["prefix"] is not None,
            }
            for key, meta in SUPPORTED_CROPS.items()
        ]
    }


@router.post("/predict")
async def predict_disease(
    image: UploadFile = File(..., description="Plant leaf image"),
    crop: Optional[str] = Form(None, description="Crop key: tomato | maize | grape | onion"),
):
    """Predict plant disease from an uploaded image, optionally filtered by crop."""
    # UUID safe filename — never use original filename on disk (P0 safety fix)
    _safe_name = str(uuid.uuid4())
    try:
        print(f"[DEBUG] predict: file={image.filename!r} crop={crop!r} content_type={image.content_type}")

        # 503 when model unavailable (P0 fix — not a fake 200)
        if not model_service.is_healthy() and (not crop or crop.lower() != "onion"):
            raise HTTPException(
                status_code=503,
                detail="Model service is temporarily unavailable. Please try again in a moment.",
                headers={"Retry-After": "30"},
            )

        validate_image_file(image)

        image_bytes = await image.read()

        if len(image_bytes) > settings.max_image_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum: {settings.max_image_size_bytes / (1024*1024):.1f} MB",
            )
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file received.")

        result = model_service.predict(image_bytes, crop=crop)

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except ValueError as e:
        print(f"[WARN] Validation rejection: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        print(f"[ERROR] Model runtime error: {e}")
        raise HTTPException(
            status_code=503,
            detail="Model service is temporarily unavailable. Please try again.",
            headers={"Retry-After": "30"},
        )
    except Exception as e:
        print(f"[ERROR] Unexpected prediction error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during prediction.")
    finally:
        if hasattr(image, 'close'):
            await image.close()
