import logging
import os
from typing import Optional, Dict, Any
import numpy as np
from .base import BaseModelAdapter

logger = logging.getLogger(__name__)


class TensorFlowAdapter(BaseModelAdapter):
    """TensorFlow/Keras model adapter for real trained models without mock fallbacks."""

    def __init__(self, model_path: Optional[str] = None, labels_path: Optional[str] = None, model_json_path: Optional[str] = None):
        super().__init__(model_path, labels_path)
        self.model = None
        self.model_type = "tensorflow"
        self.model_json_path = model_json_path

    def load_model(self, model_path: Optional[str] = None, model_config: Optional[dict] = None) -> bool:
        """Load a real TensorFlow/Keras model artifact. Fails if no valid model exists."""
        if model_path is None:
            model_path = self.model_path

        import tensorflow as tf
        from tensorflow import keras

        # Resolve candidate paths relative to configured path and backend directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(os.path.dirname(current_dir))

        candidate_paths = [
            model_path,
            os.path.join(backend_dir, model_path) if model_path else None,
            os.path.join(backend_dir, "models", "plant_disease_model_improved.keras"),
            os.path.join(backend_dir, "models", "plant_disease_model.keras"),
            os.path.join(backend_dir, "models", "best_model.h5"),
            os.path.join(backend_dir, "models", "plant_disease_model.h5"),
        ]

        resolved_path = None
        for path in candidate_paths:
            if path and os.path.exists(path):
                resolved_path = path
                break

        if not resolved_path:
            raise FileNotFoundError(
                f"No TensorFlow/Keras model artifact found at configured path '{model_path}'. "
                "Mock models are disabled; please provide a valid trained model file or switch to ONNX."
            )

        try:
            logger.info("Loading TensorFlow model from: %s", resolved_path)
            self.model = keras.models.load_model(resolved_path)
            self.labels = self.load_labels()

            # Verify that output dimension matches class label count
            if hasattr(self.model, "output_shape") and self.model.output_shape:
                out_dim = self.model.output_shape[-1]
                if self.labels and out_dim != len(self.labels):
                    raise ValueError(
                        f"Model output dimension ({out_dim}) does not match label count ({len(self.labels)})."
                    )

            logger.info("Successfully loaded TensorFlow model with %d labels", len(self.labels))
            return True

        except Exception as e:
            logger.error("Failed to load TensorFlow model: %s", e, exc_info=True)
            self.model = None
            raise

    def predict(self, image_array: np.ndarray) -> np.ndarray:
        """Make inference on preprocessed image array. Fails if model is unavailable."""
        if self.model is None:
            raise RuntimeError("TensorFlow model is not loaded; cannot run inference.")

        try:
            prediction = self.model.predict(image_array, verbose=0)
            if not isinstance(prediction, np.ndarray) or prediction.size == 0:
                raise ValueError("Model returned empty or non-array prediction output.")
            return prediction

        except Exception as e:
            logger.error("TensorFlow inference failed: %s", e, exc_info=True)
            raise RuntimeError(f"Model inference failed: {e}")

    def get_model_info(self) -> Dict[str, Any]:
        """Get model metadata without exposing absolute server filesystem paths."""
        if self.model is None:
            return {
                "framework": "tensorflow",
                "status": "not_loaded",
                "num_classes": 0,
            }

        return {
            "framework": "tensorflow",
            "status": "loaded",
            "input_shape": str(getattr(self.model, "input_shape", "unknown")),
            "output_shape": str(getattr(self.model, "output_shape", "unknown")),
            "total_params": self.model.count_params() if hasattr(self.model, "count_params") else 0,
            "num_classes": len(self.labels),
        }
