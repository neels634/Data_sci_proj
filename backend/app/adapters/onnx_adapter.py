import logging
import os
from typing import Any, Dict, List, Tuple
import numpy as np
from .base import BaseModelAdapter

logger = logging.getLogger(__name__)


class ONNXAdapter(BaseModelAdapter):
    """Adapter for ONNX plant disease models."""

    def __init__(self, model_path: str = "models/plant_disease_model.onnx", labels_path: str = None):
        super().__init__(model_path, labels_path)
        self.session = None
        self.input_name = None
        self.output_name = None
        self.input_shape = (224, 224, 3)
        self.model_type = "onnx"

    def load_model(self) -> None:
        """Load ONNX model with path resolution and output dimension validation."""
        try:
            import onnxruntime as ort

            # Resolve model path across potential execution directories
            resolved_path = self.model_path
            if not resolved_path or not os.path.exists(resolved_path):
                current_dir = os.path.dirname(os.path.abspath(__file__))
                backend_dir = os.path.dirname(os.path.dirname(current_dir))
                candidate = os.path.join(backend_dir, self.model_path) if self.model_path else None
                if candidate and os.path.exists(candidate):
                    resolved_path = candidate
                else:
                    alt = os.path.join(backend_dir, "models", "plant_disease_model.onnx")
                    if os.path.exists(alt):
                        resolved_path = alt

            if not resolved_path or not os.path.exists(resolved_path):
                raise FileNotFoundError(
                    f"ONNX model file not found at '{self.model_path}'. "
                    "Ensure the artifact exists in 'backend/models/plant_disease_model.onnx' or configure MODEL_PATH."
                )

            logger.info("Loading ONNX model from: %s", resolved_path)

            # Load labels
            self.labels = self.load_labels()

            # Create ONNX Runtime session
            providers = ["CPUExecutionProvider"]
            self.session = ort.InferenceSession(resolved_path, providers=providers)

            # Extract inputs and outputs
            self.input_name = self.session.get_inputs()[0].name
            self.output_name = self.session.get_outputs()[0].name
            self.input_shape = (224, 224, 3)

            # Validate output dimension against class count
            output_shape = self.session.get_outputs()[0].shape
            if len(output_shape) > 1 and output_shape[1] is not None:
                if self.labels and output_shape[1] != len(self.labels):
                    raise ValueError(
                        f"ONNX model output shape {output_shape} does not match label count ({len(self.labels)})."
                    )

            logger.info(
                "ONNX model loaded successfully: input=%s, output=%s, classes=%d",
                self.input_name, self.output_name, len(self.labels)
            )

        except Exception as e:
            logger.error("Failed to load ONNX model: %s", e, exc_info=True)
            self.session = None
            raise

    def preprocess_image(self, image) -> np.ndarray:
        """Preprocess image for MobileNetV2 ONNX model (224x224, RGB, [-1, 1], NCHW)."""
        target_size = (224, 224)
        image = image.resize(target_size)
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Convert to numpy array and normalize to [-1, 1] as expected by MobileNetV2
        image_array = (np.array(image, dtype=np.float32) / 255.0 - 0.5) / 0.5

        # Transpose HWC -> CHW (1, 3, 224, 224)
        image_array = np.transpose(image_array, (2, 0, 1))
        image_array = np.expand_dims(image_array, axis=0)
        return image_array

    def predict(self, image_array: np.ndarray) -> np.ndarray:
        """Run ONNX model and return softmax probabilities."""
        if self.session is None:
            raise RuntimeError("ONNX model is not loaded; cannot run inference.")

        try:
            outputs = self.session.run([self.output_name], {self.input_name: image_array})
            logits = outputs[0]

            # Apply numerically stable softmax
            exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
            probabilities = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
            return probabilities

        except Exception as e:
            logger.error("Error during ONNX prediction: %s", e, exc_info=True)
            raise RuntimeError(f"ONNX prediction failed: {e}")

    def get_model_info(self) -> Dict[str, Any]:
        """Get model information without leaking server filesystem paths."""
        if self.session is None:
            return {
                "framework": "onnx",
                "status": "not_loaded",
                "num_classes": 0,
            }

        return {
            "framework": "onnx",
            "status": "loaded",
            "input_name": self.input_name,
            "output_name": self.output_name,
            "input_shape": list(self.input_shape),
            "num_classes": len(self.labels),
        }
