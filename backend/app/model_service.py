import time
import uuid
import numpy as np
from datetime import datetime
from typing import List, Tuple, Optional, Dict, Any
from PIL import Image
import io
import logging

from .adapters import TensorFlowAdapter, PyTorchAdapter, ONNXAdapter
from .config import settings
from .config_manager import config_manager
from .models import PredictionResult, PredictionResponse, TreatmentInfo
from .plant_validator import validate_plant_image

# ── Demo mode: 4 supported crops (Maharashtra hackathon scope) ──────────────
# Maps user-facing crop name → ONNX class prefix
SUPPORTED_CROPS: Dict[str, Dict] = {
    "tomato": {
        "label": "Tomato",
        "label_mr": "टोमॅटो",
        "prefix": "Tomato___",
        "emoji": "🍅",
    },
    "maize": {
        "label": "Maize / Corn",
        "label_mr": "मका",
        "prefix": "Corn_(maize)___",
        "emoji": "🌽",
    },
    "grape": {
        "label": "Grape",
        "label_mr": "द्राक्ष",
        "prefix": "Grape___",
        "emoji": "🍇",
    },
    "onion": {
        "label": "Onion",
        "label_mr": "कांदा",
        "prefix": None,          # Not in 38-class model → symptom guide only
        "emoji": "🧅",
    },
}

logger = logging.getLogger(__name__)

# Onion symptom guide (crop not in 38-class ONNX model)
ONION_SYMPTOM_GUIDE = {
    "diseases": [
        {
            "name": "Purple Blotch (Alternaria porri)",
            "name_mr": "जांभळा डाग रोग",
            "symptoms": [
                "Small white spots with purple margins on leaves",
                "Spots enlarge and turn brown with concentric rings",
                "Severe cases cause leaf tip dieback",
            ],
            "symptoms_mr": [
                "पानांवर जांभळ्या कडांचे पांढरे डाग",
                "डाग मोठे होऊन तपकिरी रंगाचे होतात",
                "तीव्र प्रादुर्भावात पानांचे टोक सुकतात",
            ],
            "ipm": "Remove and destroy infected leaves. Avoid overhead irrigation. Ensure good air circulation.",
            "ipm_mr": "संक्रमित पाने काढून नष्ट करा. वरून पाणी देणे टाळा. हवा खेळती ठेवा.",
        },
        {
            "name": "Stemphylium Blight",
            "name_mr": "स्टेम्फिलियम करपा",
            "symptoms": [
                "Water-soaked lesions on leaves that turn tan/brown",
                "Tip dieback and blighting in humid conditions",
                "Yellow halo around lesions",
            ],
            "symptoms_mr": [
                "पानांवर पाण्याने भिजलेले दिसणारे डाग",
                "ओलसर वातावरणात पानांचे टोक जळतात",
                "डागांभोवती पिवळी झळाळी",
            ],
            "ipm": "Use disease-free planting material. Apply copper-based fungicide spray if severe. Avoid waterlogging.",
            "ipm_mr": "रोगमुक्त बियाणे वापरा. तीव्र असल्यास तांब्याचे बुरशीनाशक फवारा. पाण्याचा निचरा योग्य ठेवा.",
        },
        {
            "name": "Downy Mildew (Peronospora destructor)",
            "name_mr": "केवडा रोग",
            "symptoms": [
                "Pale green to yellow patches on leaf surface",
                "Grey-purple fuzzy growth on underside",
                "Leaves collapse in cool, wet weather",
            ],
            "symptoms_mr": [
                "पानावर फिक्या हिरव्या ते पिवळ्या रंगाचे डाग",
                "पानाच्या खाली राखाडी-जांभळी बुरशी",
                "थंड, ओल्या हवामानात पाने खाली पडतात",
            ],
            "ipm": "Rotate crops. Avoid overhead irrigation. Destroy crop debris after harvest.",
            "ipm_mr": "पीक फेरबदल करा. वरून पाणी देणे टाळा. काढणीनंतर पीक अवशेष नष्ट करा.",
        },
    ],
    "expert_note": "Onion disease identification requires an expert or lab test. AI diagnosis for onion is not available in this demo.",
    "expert_note_mr": "कांद्याच्या रोगाचे निदान तज्ञ किंवा प्रयोगशाळेत करणे आवश्यक आहे. या डेमोमध्ये कांद्यासाठी AI निदान उपलब्ध नाही.",
}


class ModelService:
    """Service for managing model loading and inference."""
    
    def __init__(self):
        self.adapter = None
        self.model_loaded = False
        self.model_info = {}
        self.config = config_manager
        
    def load_model(self) -> None:
        """Load the appropriate model based on configuration."""
        try:
            model_type = settings.model_type.lower()
            
            if model_type == "tensorflow":
                self.adapter = TensorFlowAdapter(
                    model_path=settings.model_path,
                    labels_path=getattr(settings, 'model_labels_path', None),
                    model_json_path=getattr(settings, 'model_json_path', None)
                )
            elif model_type == "pytorch":
                self.adapter = PyTorchAdapter(
                    model_path=settings.model_path,
                    labels_path=getattr(settings, 'model_labels_path', None)
                )
            elif model_type == "onnx":
                self.adapter = ONNXAdapter(
                    model_path=settings.model_path,
                    labels_path=getattr(settings, 'model_labels_path', None)
                )
            else:
                raise ValueError(f"Unsupported model type: {model_type}")
            
            self.adapter.load_model()
            self.model_loaded = True
            self.model_info = self.adapter.get_model_info()
            
            print(f"Model loaded successfully: {model_type}")
            print(f"Classes loaded: {len(self.config.get_class_names())}")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model_loaded = False
            raise
    
    def get_supported_crops(self) -> Dict[str, Dict]:
        """Return the supported crop list for the demo."""
        return SUPPORTED_CROPS

    def get_onion_guide(self) -> Dict:
        """Return the onion symptom guide (not in 38-class model)."""
        return ONION_SYMPTOM_GUIDE

    def predict(self, image_bytes: bytes, crop: Optional[str] = None) -> Dict[str, Any]:
        """Make prediction on image bytes with plant validation and optional crop filtering.

        Args:
            image_bytes: Raw bytes of the uploaded image.
            crop: Optional crop key (e.g. 'tomato', 'maize', 'grape'). When given,
                  predictions are filtered to classes belonging to that crop.
                  'onion' triggers the symptom guide path, not inference.
        """
        if not self.model_loaded or not self.adapter:
            raise RuntimeError("Model service unavailable. Please try again later.")
        
        # ── Onion: symptom guide path (not in 38-class model) ──────────────────
        if crop and crop.lower() == "onion":
            return {
                "mode": "symptom_guide",
                "crop": "onion",
                "crop_mr": "कांदा",
                "guide": ONION_SYMPTOM_GUIDE,
                "predictions": [],
                "top_prediction": None,
                "confidence_level": "N/A",
                "model_info": {"name": "Symptom Guide (no AI model for onion)", "version": "1.0", "framework": "rules"},
                "inference_ms": 0,
                "timestamp": datetime.utcnow().isoformat(),
                "uncertainty_detected": False,
                "max_confidence": 0.0,
            }

        start_time = time.time()

        # ── Validate selected crop is supported ──────────────────────────────
        crop_key = crop.lower() if crop else None
        crop_meta = SUPPORTED_CROPS.get(crop_key) if crop_key else None
        class_prefix = crop_meta.get("prefix") if crop_meta else None

        # If an unknown crop key was sent, reject early
        if crop_key and crop_key not in SUPPORTED_CROPS:
            supported = ", ".join(SUPPORTED_CROPS.keys())
            raise ValueError(
                f"Crop '{crop}' is not supported in this demo. "
                f"Supported crops: {supported}."
            )

        # 1. Load image from bytes
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise ValueError(f"Invalid or corrupted image file: {e}")

        # 2. Pre-inference botanical foliage validation
        is_plant, reason, metrics = validate_plant_image(image)
        if not is_plant:
            logger.warning(f"Image rejected by plant validator: {reason} (metrics: {metrics})")
            raise ValueError(reason or "The uploaded image does not appear to be a plant leaf.")

        # 3. Preprocess and run model inference
        processed_image = self.adapter.preprocess_image(image)
        predictions = self.adapter.predict(processed_image)

        # Normalize prediction array shape
        if len(predictions.shape) > 1 and predictions.shape[0] == 1:
            raw_probs = predictions[0]
        else:
            raw_probs = predictions

        # 4. Crop-filter: if a crop is selected, zero out other crops' classes
        if class_prefix:
            all_labels = self.config.get_class_names()
            for idx, label in enumerate(all_labels):
                if not label.startswith(class_prefix):
                    raw_probs[idx] = 0.0
            # Re-normalise after masking
            total = float(np.sum(raw_probs))
            if total > 0:
                raw_probs = raw_probs / total
            predictions = raw_probs[np.newaxis, :]

        max_confidence = float(np.max(raw_probs))

        # 5. Post-inference OOD check
        is_valid, reason, metrics = validate_plant_image(image, top_confidence=max_confidence)
        if not is_valid:
            logger.warning(f"Image rejected after inference: {reason} (confidence={max_confidence:.2%})")
            raise ValueError(reason or "The uploaded image does not match any known plant leaf diseases.")

        # 6. Extract top-3 predictions
        results = self.adapter.postprocess_predictions(
            predictions if class_prefix else self.adapter.predict(self.adapter.preprocess_image(image)),
            top_k=3,
        )
        print(f"[DEBUG] Raw top-3 predictions: {results}")

        inference_ms = int((time.time() - start_time) * 1000)
        uncertainty_threshold = 0.35

        # 7. Build detailed prediction objects
        detailed_predictions = []
        for label, confidence in results:
            disease_class = self.config.get_class_by_id(label)
            if disease_class:
                severity_info = self.config.get_severity_for_class(disease_class.id)
                prediction_result = PredictionResult(
                    label=label,
                    confidence=confidence,
                    class_name=disease_class.name,
                    plant=disease_class.plant,
                    disease=disease_class.disease,
                    severity=disease_class.severity,
                    severity_level=severity_info.level if severity_info else 0,
                    severity_color=severity_info.color if severity_info else "#10B981",
                    treatment=TreatmentInfo(
                        chemical=disease_class.treatment.chemical,
                        cultural=disease_class.treatment.cultural,
                        preventive=disease_class.treatment.preventive,
                    ),
                    symptoms=disease_class.symptoms or [],
                    causes=disease_class.causes or "",
                    urgency=disease_class.urgency or "",
                    economic_impact=disease_class.economic_impact or "",
                )
                detailed_predictions.append(prediction_result)

        # 8. Uncertain advisory if below threshold
        if max_confidence < uncertainty_threshold:
            print(f"[DEBUG] Uncertain prediction (max confidence: {max_confidence:.2%})")
            uncertain_result = PredictionResult(
                label="uncertain",
                confidence=max_confidence,
                class_name="Uncertain Diagnosis",
                plant=crop_meta["label"] if crop_meta else "Unknown",
                disease="Uncertain Condition",
                severity="none",
                severity_level=0,
                severity_color="#6B7280",
                treatment=TreatmentInfo(
                    chemical="Do not apply any chemicals. Consult your local KVK or Krishi Sevak for a proper diagnosis.",
                    cultural="Ensure proper watering, sunlight, and air circulation. Check for physical pests under leaves.",
                    preventive="Take another photo in bright, natural lighting — centre the image on a single leaf showing symptoms.",
                ),
                symptoms=[
                    "Model confidence is below the threshold for a definitive diagnosis",
                    "The leaf may be healthy, in an early stress stage, or a species outside the demo scope",
                    "Image quality or lighting may have reduced classification accuracy",
                ],
                causes="Visual pattern does not match any single disease with sufficient certainty",
                urgency="Monitor the plant over 3–5 days and re-evaluate",
                economic_impact="Avoid unnecessary treatments until a diagnosis is confirmed by an expert",
            )
            detailed_predictions.insert(0, uncertain_result)

        top_prediction = detailed_predictions[0] if detailed_predictions else None
        confidence_level = self.config.get_confidence_level(
            top_prediction.confidence if top_prediction else 0.0
        )

        return {
            "mode": "ai_prediction",
            "crop": crop_key or "auto",
            "predictions": [pred.dict() for pred in detailed_predictions],
            "top_prediction": top_prediction.dict() if top_prediction else None,
            "confidence_level": confidence_level,
            "model_info": {
                "name": self.model_info.get("name", "Plant Disease MobileNetV2"),
                "version": self.model_info.get("version", "2.0.0"),
                "framework": self.model_info.get("framework", "onnx"),
            },
            "inference_ms": inference_ms,
            "timestamp": datetime.utcnow().isoformat(),
            "uncertainty_detected": max_confidence < uncertainty_threshold,
            "max_confidence": float(max_confidence),
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        if not self.model_loaded:
            return {"error": "Model not loaded"}
        
        model_config = self.config.model_config
        return {
            "name": model_config.name,
            "version": model_config.version,
            "description": model_config.description,
            "framework": model_config.framework,
            "input_shape": model_config.input_shape,
            "classes": self.config.get_class_names(),
            "total_classes": len(self.config.get_class_names()),
            "supported_formats": model_config.supported_formats,
            "severity_levels": len(self.config.severity_levels),
            "treatment_types": list(self.config.treatment_types.keys())
        }
    
    def is_healthy(self) -> bool:
        """Check if the model service is healthy."""
        try:
            return (self.model_loaded and 
                    self.adapter is not None and 
                    self.config is not None and
                    len(self.config.get_class_names()) > 0)
        except Exception:
            return False


# Global model service instance
model_service = ModelService()