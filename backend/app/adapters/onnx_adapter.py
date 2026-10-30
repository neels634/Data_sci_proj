import numpy as np
import os
from pathlib import Path
from typing import List, Tuple, Dict, Any
from .base import BaseModelAdapter


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
        """Load ONNX model with path resolution."""
        try:
            import onnxruntime as ort
            
            # Resolve model path
            resolved_path = self.model_path
            if not os.path.exists(resolved_path):
                # Try relative to backend directory
                current_dir = os.path.dirname(os.path.abspath(__file__))
                backend_dir = os.path.dirname(os.path.dirname(current_dir))
                candidate = os.path.join(backend_dir, self.model_path)
                if os.path.exists(candidate):
                    resolved_path = candidate
                else:
                    alt = os.path.join(backend_dir, "models", "plant_disease_model.onnx")
                    if os.path.exists(alt):
                        resolved_path = alt
                        
            print(f"[ONNX] Loading model from: {resolved_path}")
            
            # Load labels
            self.labels = self.load_labels()
            
            # Create ONNX Runtime session
            providers = ['CPUExecutionProvider']
            self.session = ort.InferenceSession(resolved_path, providers=providers)
            
            # Get input and output names
            self.input_name = self.session.get_inputs()[0].name
            self.output_name = self.session.get_outputs()[0].name
            self.input_shape = (224, 224, 3)
            
            print(f"ONNX model loaded successfully: {resolved_path}")
            print(f"Input: {self.input_name}, Output: {self.output_name}")
            print(f"Number of classes: {len(self.labels)}")
            
        except Exception as e:
            print(f"Error loading ONNX model: {e}")
            raise
    
    def preprocess_image(self, image) -> np.ndarray:
        """Preprocess image for MobileNetV2 ONNX model (224x224, RGB, [-1, 1], NCHW)."""
        from PIL import Image
        
        target_size = (224, 224)
        image = image.resize(target_size)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array and normalize to [-1, 1] as expected by MobileNetV2
        image_array = (np.array(image, dtype=np.float32) / 255.0 - 0.5) / 0.5
        
        # Transpose HWC -> CHW (1, 3, 224, 224)
        image_array = np.transpose(image_array, (2, 0, 1))
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    
    def predict(self, image_array: np.ndarray) -> np.ndarray:
        """Run ONNX model and return softmax probabilities."""
        try:
            if self.session is None:
                raise ValueError("Model not loaded")
            
            outputs = self.session.run([self.output_name], {self.input_name: image_array})
            logits = outputs[0]
            
            # Apply numerically stable softmax
            exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
            probabilities = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
            
            return probabilities
            
        except Exception as e:
            print(f"Error during ONNX prediction: {e}")
            raise