# Third-Party Notices & Licensing Status

*Document Status: Verified against repository state as of November 2026. Licensing items marked as UNVERIFIED or UNRESOLVED must not be assumed open-source.*

---

## 1. Repository Source Code License
- **Status:** **License Not Yet Selected**
- **Details:** The repository root, `frontend/`, and `crop-check/` directories do not contain a `LICENSE` file. `package.json` in all three packages is marked `"private": true` without a license field. No license has been formally selected by repository contributors.
- **Redistribution Rights:** Unresolved. Code must be treated as proprietary to project contributors until a permissive or copyleft license is formally assigned.

---

## 2. Model Assets & Weights Provenance

### A. Active ONNX Model (`backend/models/plant_disease_model.onnx`)
- **Format:** ONNX format (runtime engine: `onnxruntime` CPUExecutionProvider)
- **Producer / Origin:** PyTorch export (`meta.producer_name == 'pytorch'`)
- **Classes:** 38 plant disease classes across 14 crops (matching `labels.json`)
- **Input Resolution & Normalization:** `(1, 3, 224, 224)`, RGB, scaled `(x/255.0 - 0.5) / 0.5`, NCHW
- **Training Dataset:** Class names correspond to the PlantVillage 38-class taxonomy
- **Pretrained Weights & Training Split Provenance:** **UNRESOLVED / UNVERIFIED**. The exact upstream training script, random seed, training split, and original base weights (e.g. torchvision MobileNetV2 vs custom weights) are not checked into the repository.
- **Redistribution Rights:** **UNRESOLVED**. Redistribution rights cannot be verified without confirmed training dataset licensing and base weight provenance.

### B. Legacy Keras Model (`backend/models/plant_disease_model_improved.keras`)
- **Format:** Keras 3.15.1 archive (`model.weights.h5` + `config.json`)
- **Architecture:** Custom Sequential CNN (Conv2D, BatchNormalization, MaxPooling2D, Dropout, Dense)
- **Input Resolution:** `(null, 128, 128, 3)`
- **Output Classes:** 30 units (softmax)
- **Status:** Inactive. Not wired to the active ONNX inference pipeline.

---

## 3. Training Datasets (Context & Licensing Checks)

### A. PlantVillage Dataset
- **Upstream GitHub Repository:** `spMohanty/PlantVillage-Dataset`
- **Declared License Status:** The upstream GitHub README describes the collection as "open access" but does not contain a standard root LICENSE file.
- **Third-Party Mirrors (e.g. Hugging Face):** Some mirrors specify Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0).
- **Implication:** Under CC BY-SA 3.0, any derivative work (including trained model weights derived directly from the dataset) may be subject to share-alike provisions requiring redistribution under the same or compatible license. Until the exact training source is verified, redistribution rights remain **UNRESOLVED**.
- **Grouping Notice:** When splitting for model evaluation, random image splitting leaks data because multiple images exist from the same leaf. Evaluation must split strictly by `leaf_id`.

### B. PlantDoc Dataset
- **Source:** Cropped classification dataset repository vs separate object detection repository.
- **Declared License:** The cropped classification repository specifies CC BY 4.0. Note that this notice applies strictly to the cropped classification repository and cannot be transferred to the separate detection dataset without independent verification.

---

## 4. Demo Images (`public/demo-images/`)
- `farm-overview-1.jpg`, `farm-overview-2.jpg`, `maize-leaf-disease.jpg`, `tomato-leaf-disease.jpg`
- **Origin:** Prototyping sample images in `public/demo-images/` are demo illustrations created during hackathon interface testing; they are not confirmed field photographs.
- **Usage:** Demo and testing illustrations only; not real field photography.

---

## 5. Key Software Dependencies & Framework Licenses

| Package / Library | Ecosystem | Declared License | Verified Role |
|---|---|---|---|
| `next` | Node.js | MIT | Root application framework |
| `react`, `react-dom` | Node.js | MIT | UI component engine |
| `fastapi` | Python | MIT | REST API server |
| `uvicorn` | Python | BSD-3-Clause | ASGI web server |
| `onnxruntime` | Python | MIT | ONNX inference execution provider |
| `pillow` (PIL) | Python | HPND | Image parsing and validation |
| `numpy` | Python | BSD-3-Clause | Numerical arrays and softmax scoring |
| `slowapi` | Python | MIT | Rate-limiting middleware |
| `pydantic`, `pydantic-settings` | Python | MIT | Settings & schema validation |
| `lucide-react` | Node.js | ISC | UI iconography |
| `tailwindcss` | Node.js | MIT | Utility-first CSS styling |
| `vite` | Node.js | MIT | Build tool for sub-packages |
