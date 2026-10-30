"""
Plant and Leaf Image Validator
Validates whether an uploaded image contains genuine plant leaf tissue
before and after running disease classification, rejecting false/non-plant photos.
"""
import numpy as np
from PIL import Image
from typing import Tuple, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


def validate_plant_image(image: Image.Image, top_confidence: Optional[float] = None) -> Tuple[bool, Optional[str], Dict[str, Any]]:
    """
    Validate whether the input image is a legitimate plant leaf image.
    
    Args:
        image: PIL Image object
        top_confidence: Optional model prediction confidence (0.0 to 1.0)
        
    Returns:
        (is_valid_plant, rejection_reason, diagnostic_metrics)
    """
    try:
        # Resize for consistent, fast visual analysis
        sample = image.convert("RGB").resize((160, 160))
        arr = np.array(sample, dtype=np.float32) / 255.0
        
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        
        # 1. Check for flat / blank / solid color images
        channel_stds = [float(np.std(r)), float(np.std(g)), float(np.std(b))]
        overall_std = float(np.mean(channel_stds))
        if overall_std < 0.04:
            return (
                False,
                "Image appears to be blank, solid-colored, or lacks sufficient visual detail. Please upload a clear, focused photo of a plant leaf.",
                {"reason": "low_variance", "std": overall_std}
            )
            
        # 2. HSV Color Analysis
        hsv = np.array(sample.convert("HSV"), dtype=np.float32)
        h = hsv[:, :, 0] * (360.0 / 255.0)  # 0 to 360 degrees
        s = hsv[:, :, 1] / 255.0            # 0 to 1
        v = hsv[:, :, 2] / 255.0            # 0 to 1
        
        # Botanical Foliage Colors:
        # - Chlorophyll Green: Hue 32° to 120°, moderate saturation and brightness
        green_foliage = (h >= 32) & (h <= 120) & (s >= 0.12) & (v >= 0.10)
        
        # - Excess Green Index (ExG = 2G - R - B)
        exg = 2.0 * g - r - b
        exg_green = (exg > 0.04) & (g > 0.14) & (g > r * 0.88)
        green_mask = green_foliage | exg_green
        green_ratio = float(np.mean(green_mask))
        
        # - Chlorotic / Yellow Leaf Tissue: Hue 20° to 35°, saturated
        chlorotic_yellow = (h >= 20) & (h < 32) & (s >= 0.22) & (v >= 0.20)
        
        # - Necrotic Brown / Leaf Spot / Rust Tissue: Hue 10° to 24°, brown/tan
        necrotic_brown = (h >= 10) & (h < 24) & (s >= 0.18) & (v >= 0.08) & (v <= 0.70) & (r > b * 1.15)
        
        # Total plant tissue mask
        plant_mask = green_mask | chlorotic_yellow | necrotic_brown
        plant_ratio = float(np.mean(plant_mask))
        
        # 3. Unnatural Non-Foliage Colors
        # High blue/cyan (skies, blue clothing, cars, monitors)
        blue_mask = (h >= 185) & (h <= 265) & (s >= 0.25) & (v >= 0.18)
        blue_ratio = float(np.mean(blue_mask))
        
        # Magenta/Purple (artificial graphics, icons)
        purple_mask = (h >= 275) & (h <= 345) & (s >= 0.25) & (v >= 0.18)
        purple_ratio = float(np.mean(purple_mask))
        
        metrics = {
            "green_pixel_ratio": round(green_ratio, 4),
            "plant_pixel_ratio": round(plant_ratio, 4),
            "blue_ratio": round(blue_ratio, 4),
            "purple_ratio": round(purple_ratio, 4),
            "image_std": round(overall_std, 4),
            "top_confidence": round(top_confidence, 4) if top_confidence is not None else None
        }
        
        # Rule 1: No chlorophyll or green foliage at all (and model isn't overwhelmingly certain)
        if green_ratio < 0.04 and (top_confidence is None or top_confidence < 0.65):
            logger.info(f"Rejected non-plant photo: green_ratio={green_ratio:.2%}")
            return (
                False,
                "No plant foliage or leaf tissue detected in this photo. Please upload a clear photo of a crop leaf (e.g. Tomato, Potato, Apple, Corn, Grape, Bell Pepper).",
                metrics
            )
            
        # Rule 2: Severe lack of overall plant color
        if plant_ratio < 0.10:
            logger.info(f"Rejected non-plant photo: plant_ratio={plant_ratio:.2%}")
            return (
                False,
                "The image does not contain recognizable plant foliage. Please upload a clear photo of a crop leaf.",
                metrics
            )
            
        # Rule 3: Dominated by unnatural non-plant colors (screens, cars, skies, clothes)
        if (blue_ratio > 0.35 or purple_ratio > 0.25) and plant_ratio < 0.20:
            logger.info(f"Rejected artificial/non-plant image: blue={blue_ratio:.2%}, purple={purple_ratio:.2%}")
            return (
                False,
                "This image contains colors and elements that do not match a plant leaf. Please upload a photo focused directly on a plant leaf.",
                metrics
            )
            
        # Rule 4: Post-inference confidence threshold check
        # For a 38-class model, out-of-distribution (false) images have low confidence (< 48%)
        if top_confidence is not None and top_confidence < 0.48:
            logger.info(f"Rejected low confidence prediction ({top_confidence:.2%}) as non-plant/out-of-distribution")
            return (
                False,
                "The AI model could not recognize a supported plant leaf disease in this photo (confidence too low). Please ensure the photo clearly shows a plant leaf from a supported crop.",
                metrics
            )
                
        return True, None, metrics
        
    except Exception as e:
        logger.warning(f"Error during plant validation: {e}")
        return True, None, {"error": str(e)}
