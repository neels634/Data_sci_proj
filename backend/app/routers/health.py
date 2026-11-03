import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from ..models import HealthResponse
from ..model_service import model_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint reflecting actual model availability."""
    if not model_service.is_healthy():
        raise HTTPException(
            status_code=503,
            detail="Model service unavailable",
            headers={"Retry-After": "30"},
        )
    
    try:
        model_info = model_service.get_model_info()
        return HealthResponse(
            status="ok",
            model=model_info.get("name", "Unknown"),
            timestamp=datetime.now(timezone.utc).isoformat(),
            model_loaded=model_service.model_loaded,
            total_classes=model_info.get("total_classes", 0),
        )
    except Exception as e:
        logger.error("Health check error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Health check failed")


@router.get("/model/info")
async def get_model_info():
    """Get comprehensive information about the loaded model and configuration."""
    if not model_service.is_healthy():
        raise HTTPException(
            status_code=503,
            detail="Model service unavailable",
            headers={"Retry-After": "30"},
        )
    try:
        return model_service.get_model_info()
    except Exception as e:
        logger.error("Failed to get model info: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get model info")


@router.get("/model/classes")
async def get_model_classes():
    """Get all supported disease classes with detailed information."""
    if not model_service.is_healthy():
        raise HTTPException(
            status_code=503,
            detail="Model service unavailable",
            headers={"Retry-After": "30"},
        )
    
    try:
        from ..config_manager import config_manager
        
        classes_info = []
        for class_id, disease_class in config_manager.disease_classes.items():
            severity_info = config_manager.get_severity_for_class(class_id)
            
            class_info = {
                "id": disease_class.id,
                "name": disease_class.name,
                "plant": disease_class.plant,
                "disease": disease_class.disease,
                "severity": {
                    "level": disease_class.severity,
                    "numeric_level": severity_info.level if severity_info else 0,
                    "color": severity_info.color if severity_info else "#10B981",
                    "description": severity_info.description if severity_info else "Unknown"
                },
                "treatment": {
                    "chemical": disease_class.treatment.chemical,
                    "cultural": disease_class.treatment.cultural,
                    "preventive": disease_class.treatment.preventive
                }
            }
            classes_info.append(class_info)
        
        return {
            "classes": classes_info,
            "total_classes": len(classes_info),
            "severity_levels": {
                name: {
                    "level": level.level,
                    "color": level.color,
                    "description": level.description
                }
                for name, level in config_manager.severity_levels.items()
            },
            "treatment_types": {
                name: {
                    "name": treatment_type.name,
                    "description": treatment_type.description
                }
                for name, treatment_type in config_manager.treatment_types.items()
            }
        }
    except Exception as e:
        logger.error("Failed to get classes info: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get classes info")
