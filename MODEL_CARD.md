# Model Card: Plant Disease Pathology Classifier (Baseline)

*Document Version: 1.0 — November 2026*  
*Deployment Context: Shet Samruddhi / Plant Disease Detection Prototype*

---

## 1. Model Details

- **Model Name:** MobileNetV2 Plant Disease Classifier (Baseline ONNX)
- **Artifact Path:** `backend/models/plant_disease_model.onnx`
- **Model Architecture:** MobileNetV2 backbone (PyTorch export to ONNX)
- **Runtime Engine:** `onnxruntime` (CPU Execution Provider)
- **Input Dimensions:** `1 x 3 x 224 x 224` (RGB, Normalized: `(pixel / 255.0 - 0.5) / 0.5`, NCHW format)
- **Output:** Logits transformed via numerically stable Softmax to 38 class probabilities
- **Supported Crops (14 species):** Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Pepper (Bell), Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.
- **Educational Guidance Only (No AI Model):** Onion (provides educational agronomy symptom reference for common conditions, no AI classifier).

---

## 2. Intended Use & Safety Disclaimers

### Intended Use
- **Advisory Prototype Only:** Provides early visual pattern screening on leaf photos for smallholder farmers and Krishi Mitras.
- **Record-Keeping Evidence:** Helps record observations to discuss with agricultural extension workers.

### Out-of-Scope & Prohibited Uses
- **NOT a Definitive Diagnosis:** Classifier predictions must NEVER be treated as confirmed plant pathology diagnoses or agricultural prescriptions.
- **NOT Insurance Evidence:** Must NEVER be used as proof of crop damage for PMFBY or government compensation claims. Coarse or automated image classifications do not guarantee claim payouts.
- **NO Automatic Pesticide / Chemical Application:** High-toxicity inputs must never be applied solely on model output without physical inspection by a certified Krishi Sevak or KVK officer.

---

## 3. Provenance & Training Data Status

- **Taxonomy:** 38 classes matching the laboratory PlantVillage classification benchmark.
- **Controlled-Background Limitation:** The majority of PlantVillage imagery consists of single leaves detached on uniform gray/black paper backgrounds under laboratory lighting.
- **Dataset Shift & Field Performance:** **UNVALIDATED IN FIELD CONDITIONS**. Real-world field images contain complex backgrounds, soil, multiple overlapping leaves, insect shadows, dew, and dust. Accuracy on controlled laboratory datasets does NOT generalize to Maharashtra field conditions.
- **Training Provenance:** **UNRESOLVED**. The exact training random seed, data splits, and base pretrained checkpoint weights are not checked into the repository. Therefore, this model must be treated as an unvalidated baseline prototype.

---

## 4. Inference & Crop-Filtering Behavior (Verified in Code)

1. **Single Inference Execution:** Each prediction request preprocesses and runs ONNX inference exactly once.
2. **Original Probability Vectors:** The model's 38-class probability vector is preserved in full. Predictions are NEVER mutated or renormalized in place.
3. **Honest Crop Mismatch Detection:**
   - When a farmer specifies a crop (e.g. Tomato), the system checks whether the top predicted class belongs to that crop.
   - If the model detects a different crop (e.g. Corn), it flags an explicit `crop_mismatch`, asks the farmer to confirm the crop or retake the photo, and abstains from showing a confident diagnosis. It does NOT zero out other crops to force an artificial 100% confidence.
4. **Uncertainty & Abstention Threshold:** If top confidence is below 40% (0.40), the system returns an explicit "Uncertain / Inconclusive" advisory recommending daylight retake or consultation with a Krishi Mitra.
5. **Separate Onion Guidance:** Onion requests are handled via a rule-based educational guide (`mode: "symptom_guide"`), returning zero AI confidence and explicitly indicating that lab confirmation is required.

---

## 5. Proposed Model Evaluation Protocol (Phase 3 Planning)

*Note: No datasets or weights have been downloaded. Evaluation requires explicit approval.*

### Candidates to Compare
1. **Baseline:** Current checked-in MobileNetV2 ONNX model (`plant_disease_model.onnx`).
2. **Lightweight Candidate:** MobileNetV3-Large (low-latency mobile candidate).
3. **Accuracy-Oriented Candidate:** EfficientNetV2-S.

### Protocol Requirements
- **Data Splitting:** When using Hugging Face PlantVillage, split strictly by `leaf_id` grouping to prevent data leakage across train/validation/test sets.
- **Domain Split:** Separate controlled-background laboratory test images from natural field-domain images (e.g. PlantDoc cropped classification dataset, CC BY 4.0).
- **Regional Field Validation:** Consented, expert-verified field images from Maharashtra must be evaluated before claiming regional field readiness.
- **Metrics to Report:** Per-class precision, recall, and F1; macro-averaged F1; expected calibration error (ECE); confusion matrix; abstention coverage at selected operating thresholds; model file size; and inference latency on named hardware (e.g. CPU vs mobile).
- **Principle:** Architecture changes alone do not solve dataset shift; robust field evaluation is required before claiming diagnostic utility.
