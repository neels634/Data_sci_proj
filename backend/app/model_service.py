import io
import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
from PIL import Image

from .adapters import ONNXAdapter, PyTorchAdapter, TensorFlowAdapter
from .config import settings
from .config_manager import config_manager
from .models import PredictionResult, TreatmentInfo
from .plant_validator import validate_plant_image

logger = logging.getLogger(__name__)

# Set safe pixel decompression ceiling (mitigates decompression bombs)
Image.MAX_IMAGE_PIXELS = 25_000_000

# ── Supported crops: 14 model crops + Onion (educational symptom guidance) ──────
# Maps user-facing crop key → model class prefix and metadata
SUPPORTED_CROPS: Dict[str, Dict[str, Any]] = {
    "tomato": {
        "label": "Tomato",
        "label_mr": "टोमॅटो",
        "prefix": "Tomato___",
        "emoji": "🍅",
        "aliases": ["tomato"],
    },
    "maize": {
        "label": "Maize / Corn",
        "label_mr": "मका",
        "prefix": "Corn___",
        "emoji": "🌽",
        "aliases": ["maize", "corn"],
    },
    "corn": {
        "label": "Corn / Maize",
        "label_mr": "मका",
        "prefix": "Corn___",
        "emoji": "🌽",
        "aliases": ["corn", "maize"],
    },
    "grape": {
        "label": "Grape",
        "label_mr": "द्राक्ष",
        "prefix": "Grape___",
        "emoji": "🍇",
        "aliases": ["grape"],
    },
    "apple": {
        "label": "Apple",
        "label_mr": "सफरचंद",
        "prefix": "Apple___",
        "emoji": "🍎",
        "aliases": ["apple"],
    },
    "potato": {
        "label": "Potato",
        "label_mr": "बटाटा",
        "prefix": "Potato___",
        "emoji": "🥔",
        "aliases": ["potato"],
    },
    "pepper": {
        "label": "Bell Pepper / Chilli",
        "label_mr": "ढोबळी मिरची",
        "prefix": "Pepper,_bell___",
        "emoji": "🫑",
        "aliases": ["pepper", "bell pepper", "chilli"],
    },
    "soybean": {
        "label": "Soybean",
        "label_mr": "सोयाबीन",
        "prefix": "Soybean___",
        "emoji": "🌱",
        "aliases": ["soybean"],
    },
    "strawberry": {
        "label": "Strawberry",
        "label_mr": "स्ट्रॉबेरी",
        "prefix": "Strawberry___",
        "emoji": "🍓",
        "aliases": ["strawberry"],
    },
    "squash": {
        "label": "Squash / Pumpkin",
        "label_mr": "भोपळा",
        "prefix": "Squash___",
        "emoji": "🎃",
        "aliases": ["squash", "pumpkin"],
    },
    "cherry": {
        "label": "Cherry",
        "label_mr": "चेरी",
        "prefix": "Cherry___",
        "emoji": "🍒",
        "aliases": ["cherry"],
    },
    "peach": {
        "label": "Peach",
        "label_mr": "पीच",
        "prefix": "Peach___",
        "emoji": "🍑",
        "aliases": ["peach"],
    },
    "orange": {
        "label": "Orange / Citrus",
        "label_mr": "संत्री",
        "prefix": "Orange___",
        "emoji": "🍊",
        "aliases": ["orange", "citrus"],
    },
    "blueberry": {
        "label": "Blueberry",
        "label_mr": "ब्लूबेरी",
        "prefix": "Blueberry___",
        "emoji": "🫐",
        "aliases": ["blueberry"],
    },
    "raspberry": {
        "label": "Raspberry",
        "label_mr": "रास्पबेरी",
        "prefix": "Raspberry___",
        "emoji": "🍇",
        "aliases": ["raspberry"],
    },
    "onion": {
        "label": "Onion",
        "label_mr": "कांदा",
        "prefix": None,          # Not in 38-class ONNX model → symptom guidance only
        "emoji": "🧅",
        "aliases": ["onion"],
    },
}

# Onion symptom guide (educational agronomy reference only — not an AI prediction)
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
    "expert_note": "Onion disease identification requires field inspection by a local agriculture officer or laboratory testing. Automated AI diagnosis is not available for onion.",
    "expert_note_mr": "कांद्याच्या रोगाचे निदान तज्ञ किंवा प्रयोगशाळेत करणे आवश्यक आहे. या ॲपमध्ये कांद्यासाठी AI निदान उपलब्ध नाही.",
}


class ModelService:
    """Service for managing model loading, validation, and inference."""

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
                    labels_path=getattr(settings, "model_labels_path", None),
                    model_json_path=getattr(settings, "model_json_path", None),
                )
            elif model_type == "pytorch":
                self.adapter = PyTorchAdapter(
                    model_path=settings.model_path,
                    labels_path=getattr(settings, "model_labels_path", None),
                )
            elif model_type == "onnx":
                self.adapter = ONNXAdapter(
                    model_path=settings.model_path,
                    labels_path=getattr(settings, "model_labels_path", None),
                )
            else:
                raise ValueError(f"Unsupported model type: {model_type}")

            self.adapter.load_model()
            self.model_loaded = True
            self.model_info = self.adapter.get_model_info()

            logger.info("Model loaded successfully: %s", model_type)
            logger.info("Classes loaded: %d", len(self.config.get_class_names()))

        except Exception as e:
            logger.error("Error loading model: %s", e, exc_info=True)
            self.model_loaded = False
            raise

    def get_supported_crops(self) -> Dict[str, Dict]:
        """Return the supported crop list."""
        return SUPPORTED_CROPS

    def get_onion_guide(self) -> Dict:
        """Return the onion symptom guide (educational agronomy reference)."""
        return ONION_SYMPTOM_GUIDE

    def predict(self, image_bytes: bytes, crop: Optional[str] = None) -> Dict[str, Any]:
        """Make prediction on image bytes with plant validation and optional crop checking.

        Args:
            image_bytes: Raw bytes of the uploaded image.
            crop: Optional crop key (e.g. 'tomato', 'maize', 'grape').
                  When provided, validates whether the model prediction matches the
                  selected crop. Does NOT mutate or renormalize probabilities.
                  'onion' routes to the educational symptom guide, not AI inference.
        """
        # ── Onion: Explicit educational symptom guide path (no model inference) ──
        if crop and crop.lower().strip() == "onion":
            return {
                "mode": "symptom_guide",
                "crop": "onion",
                "crop_mr": "कांदा",
                "guide": ONION_SYMPTOM_GUIDE,
                "predictions": [],
                "top_prediction": None,
                "confidence_level": "N/A",
                "model_info": {
                    "name": "Educational Symptom Guide (No AI Model for Onion)",
                    "version": "1.0",
                    "framework": "expert_guidance",
                },
                "inference_ms": 0,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "uncertainty_detected": False,
                "max_confidence": 0.0,
                "disclaimer": "Onion guidance is an agronomy reference and not an automated AI diagnosis.",
            }

        if not self.model_loaded or not self.adapter:
            raise RuntimeError("Model service unavailable. Please try again later.")

        start_time = time.time()

        # ── Validate selected crop key if provided ──────────────────────────
        crop_key = crop.lower().strip() if crop else None
        crop_meta = None
        if crop_key:
            for key, meta in SUPPORTED_CROPS.items():
                if crop_key == key or crop_key in meta.get("aliases", []):
                    crop_meta = meta
                    crop_key = key
                    break

            if not crop_meta:
                supported_list = ", ".join(sorted(SUPPORTED_CROPS.keys()))
                raise ValueError(
                    f"Crop '{crop}' is not supported in this demo. Supported crops: {supported_list}."
                )

        class_prefix = crop_meta.get("prefix") if crop_meta else None

        # ── 1. Safely decode and validate image content ─────────────────────
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            # Reopen after verify() to allow actual pixel processing
            image = Image.open(io.BytesIO(image_bytes))
            image.load()
            if image.width > 5000 or image.height > 5000:
                raise ValueError("Image dimensions too large (maximum 5000x5000 pixels).")
        except Exception as e:
            raise ValueError(f"Invalid or corrupted image file: {e}")

        # ── 2. Pre-inference botanical foliage validation ───────────────────
        is_plant, reason, metrics = validate_plant_image(image)
        if not is_plant:
            logger.warning("Image rejected by plant validator: %s (metrics: %s)", reason, metrics)
            raise ValueError(reason or "The uploaded image does not appear to be a plant leaf.")

        # ── 3. Run model inference ONCE ──────────────────────────────────────
        processed_image = self.adapter.preprocess_image(image)
        raw_output = self.adapter.predict(processed_image)

        # Preserve the original probability vector; NEVER mutate or renormalize in place
        if len(raw_output.shape) > 1 and raw_output.shape[0] == 1:
            original_probs = np.array(raw_output[0], dtype=np.float32).copy()
        else:
            original_probs = np.array(raw_output, dtype=np.float32).copy()

        all_labels = self.config.get_class_names()
        if len(original_probs) != len(all_labels):
            raise RuntimeError(
                f"Model output dimension ({len(original_probs)}) does not match label count ({len(all_labels)})."
            )

        # Global top prediction across all 38 classes
        global_top_idx = int(np.argmax(original_probs))
        global_top_prob = float(original_probs[global_top_idx])
        global_top_label = all_labels[global_top_idx]

        global_class_obj = self.config.get_class_by_id(global_top_label)
        detected_plant = global_class_obj.plant if global_class_obj else global_top_label.split("___")[0]

        # ── 4. Post-inference OOD validation with unmasked top confidence ────
        is_valid, post_reason, post_metrics = validate_plant_image(image, top_confidence=global_top_prob)
        if not is_valid:
            logger.warning("Image rejected after inference: %s (confidence=%.2f)", post_reason, global_top_prob)
            raise ValueError(post_reason or "The uploaded image does not match any known plant leaf diseases.")

        inference_ms = int((time.time() - start_time) * 1000)
        uncertainty_threshold = 0.40

        # ── 5. Check for Crop Mismatch ───────────────────────────────────────
        # If user explicitly selected a crop, verify whether model output aligns
        if class_prefix:
            # Check if global top class belongs to selected crop prefix
            if not global_top_label.startswith(class_prefix):
                # The model sees a different crop. Do NOT zero out and renormalize to fake 100%!
                logger.info(
                    "Crop mismatch: user selected '%s', model top was '%s' (p=%.2f)",
                    crop_meta["label"], global_top_label, global_top_prob,
                )

                mismatch_result = PredictionResult(
                    label="crop_mismatch",
                    confidence=global_top_prob,
                    class_name="Crop Mismatch / Uncertain",
                    plant=crop_meta["label"],
                    disease="Selected crop does not match image",
                    severity="none",
                    severity_level=0,
                    severity_color="#F59E0B",
                    treatment=TreatmentInfo(
                        chemical=None,
                        cultural="Please confirm the crop species. Do not apply chemical treatments until crop and disease identity are verified.",
                        preventive="Retake the photo in daylight, focusing on a single representative leaf.",
                    ),
                    symptoms=[
                        f"Selected crop: {crop_meta['label']}",
                        f"Visual features closely resemble: {detected_plant} ({global_class_obj.name if global_class_obj else global_top_label})",
                        "The classifier cannot provide a reliable diagnosis when crop species conflicts.",
                    ],
                    causes="Visual pattern conflicts with the selected crop category",
                    urgency="Confirm crop identity with a Krishi Mitra before taking any action",
                    economic_impact="Avoid applying inputs formulated for the wrong crop species",
                )

                return {
                    "mode": "ai_prediction",
                    "crop": crop_key,
                    "crop_mismatch": True,
                    "detected_crop": detected_plant,
                    "selected_crop": crop_meta["label"],
                    "predictions": [mismatch_result.dict()],
                    "top_prediction": mismatch_result.dict(),
                    "confidence_level": "Uncertain",
                    "scoring_basis": "original_softmax_probability",
                    "model_info": {
                        "name": self.model_info.get("name", "Plant Disease MobileNetV2"),
                        "version": self.model_info.get("version", "2.0.0"),
                        "framework": self.model_info.get("framework", "onnx"),
                    },
                    "inference_ms": inference_ms,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "uncertainty_detected": True,
                    "max_confidence": float(global_top_prob),
                    "disclaimer": "Classifier results are advisory only and must not be treated as a definitive diagnosis or insurance claim proof.",
                }

        # ── 6. Extract Top Predictions using ORIGINAL probabilities ──────────
        # Rank classes by original model probabilities without renormalization
        sorted_indices = np.argsort(original_probs)[::-1]
        if class_prefix:
            filtered_indices = [idx for idx in sorted_indices if all_labels[idx].startswith(class_prefix)]
        else:
            filtered_indices = list(sorted_indices)

        top_indices = filtered_indices[:3]
        results = [(all_labels[idx], float(original_probs[idx])) for idx in top_indices]

        # ── 7. Build detailed prediction objects ─────────────────────────────
        detailed_predictions = []
        for label, confidence in results:
            disease_class = self.config.get_class_by_id(label)
            if disease_class:
                severity_info = self.config.get_severity_for_class(disease_class.id)
                # Ensure treatment is sourced or empty
                treatment = TreatmentInfo(
                    chemical=disease_class.treatment.chemical if disease_class.treatment else None,
                    cultural=disease_class.treatment.cultural if disease_class.treatment else None,
                    preventive=disease_class.treatment.preventive if disease_class.treatment else None,
                )
                prediction_result = PredictionResult(
                    label=label,
                    confidence=confidence,  # Actual original probability
                    class_name=disease_class.name,
                    plant=disease_class.plant,
                    disease=disease_class.disease,
                    severity=disease_class.severity,
                    severity_level=severity_info.level if severity_info else 0,
                    severity_color=severity_info.color if severity_info else "#10B981",
                    treatment=treatment,
                    symptoms=disease_class.symptoms or [],
                    causes=disease_class.causes or "",
                    urgency=disease_class.urgency or "",
                    economic_impact=disease_class.economic_impact or "",
                )
                detailed_predictions.append(prediction_result)

        top_confidence = results[0][1] if results else 0.0
        is_uncertain = top_confidence < uncertainty_threshold

        # ── 8. Return explicit abstain/uncertain state when confidence is low ─
        if is_uncertain:
            logger.info("Low-confidence prediction (top probability: %.2f)", top_confidence)
            uncertain_result = PredictionResult(
                label="uncertain",
                confidence=top_confidence,
                class_name="Uncertain / Inconclusive Diagnosis",
                plant=crop_meta["label"] if crop_meta else detected_plant,
                disease="Inconclusive condition",
                severity="none",
                severity_level=0,
                severity_color="#6B7280",
                treatment=TreatmentInfo(
                    chemical=None,
                    cultural="Ensure proper watering, sunlight, and air circulation. Check under leaves for physical pests.",
                    preventive="Take another photo in bright natural daylight, centering on a single symptomatic leaf.",
                ),
                symptoms=[
                    "Model confidence is below the threshold for a reliable visual match",
                    "The leaf may be healthy, in an early stage of stress, or affected by multiple conditions",
                    "Image quality, glare, or background clutter may have reduced classification clarity",
                ],
                causes="Visual pattern does not match any known disease class with sufficient certainty",
                urgency="Monitor the crop over 2–3 days and consult your local Krishi Mitra if symptoms advance",
                economic_impact="Avoid unnecessary or unverified chemical applications",
            )
            detailed_predictions.insert(0, uncertain_result)

        top_prediction = detailed_predictions[0] if detailed_predictions else None
        confidence_level = self.config.get_confidence_level(top_confidence) if not is_uncertain else "Low"

        return {
            "mode": "ai_prediction",
            "crop": crop_key or "auto",
            "crop_mismatch": False,
            "predictions": [pred.dict() for pred in detailed_predictions],
            "top_prediction": top_prediction.dict() if top_prediction else None,
            "confidence_level": confidence_level,
            "scoring_basis": "original_softmax_probability",
            "model_info": {
                "name": self.model_info.get("name", "Plant Disease MobileNetV2"),
                "version": self.model_info.get("version", "2.0.0"),
                "framework": self.model_info.get("framework", "onnx"),
            },
            "inference_ms": inference_ms,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "uncertainty_detected": is_uncertain,
            "max_confidence": float(top_confidence),
            "disclaimer": "Classifier results are advisory only and must not be treated as a definitive diagnosis or insurance claim proof.",
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
            "treatment_types": list(self.config.treatment_types.keys()),
        }

    def is_healthy(self) -> bool:
        """Check if the model service is loaded and ready."""
        try:
            return (
                self.model_loaded
                and self.adapter is not None
                and self.config is not None
                and len(self.config.get_class_names()) > 0
            )
        except Exception:
            return False


# Global model service instance
model_service = ModelService()
