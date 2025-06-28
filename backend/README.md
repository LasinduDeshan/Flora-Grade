# Flower Grader API (Backend)

## Setup

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn flower_grader_api:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

- `POST /grade-flower` — Upload a flower image (JPEG/PNG), receive grade, explanation, and metrics.
  - **Returns:**
    - `grade`: A, B, or C
    - `explanation`: Reasoning for the grade
    - `metrics`: { color_vibrancy, symmetry, edge_density, brown_ratio, circularity }

- `POST /download-report` — Upload a flower image, receive a PDF report with the image, metrics, and grade.

## Next Steps
- Improve feature extraction and grading logic.
- (Optional) Add deep learning model for higher accuracy. 