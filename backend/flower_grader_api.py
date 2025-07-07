from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import cv2
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import torch
from torchvision import transforms, models
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CNN model at startup
try:
    device = torch.device('cpu')
    cnn_model = models.mobilenet_v2(pretrained=False)
    cnn_model.classifier[1] = torch.nn.Linear(cnn_model.last_channel, 3)
    cnn_model.load_state_dict(torch.load('flower_cnn.pth', map_location=device))
    cnn_model.eval()
    logger.info("CNN model loaded successfully")
except Exception as e:
    logger.error(f"Error loading CNN model: {e}")
    cnn_model = None

# --- Image Preprocessing and Feature Extraction ---
def preprocess_image(image: Image.Image):
    # Resize and convert to numpy array
    image = image.resize((256, 256))
    np_img = np.array(image)
    return np_img

def color_vibrancy(np_img):
    hsv = cv2.cvtColor(np_img, cv2.COLOR_RGB2HSV)
    saturation = hsv[:, :, 1]
    avg_saturation = np.mean(saturation) / 255.0  # Normalize
    return avg_saturation

def symmetry_score(np_img):
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    flipped = np.fliplr(gray)
    score = 1.0 - np.mean(np.abs(gray - flipped)) / 255.0
    return score

def damage_score(np_img):
    # Simple edge detection and brown/black pixel ratio
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / edges.size
    # Browning: count dark pixels
    brown_mask = (np_img[:, :, 0] < 100) & (np_img[:, :, 1] < 80) & (np_img[:, :, 2] < 80)
    brown_ratio = np.sum(brown_mask) / np_img.size
    return edge_density, brown_ratio

def shape_uniformity(np_img):
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        cnt = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(cnt)
        perimeter = cv2.arcLength(cnt, True)
        circularity = 4 * np.pi * area / (perimeter ** 2 + 1e-6)
        return circularity
    return 0

def grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity):
    # Simple rule-based grading
    if vibrancy > 0.5 and symmetry > 0.8 and edge_density < 0.05 and brown_ratio < 0.01 and circularity > 0.7:
        return "A", f"Symmetry: {symmetry:.2f}, Color: {vibrancy:.2f}, Damage: None, Shape: {circularity:.2f} → Grade A"
    elif vibrancy > 0.35 and symmetry > 0.6 and edge_density < 0.1 and brown_ratio < 0.03 and circularity > 0.5:
        return "B", f"Symmetry: {symmetry:.2f}, Color: {vibrancy:.2f}, Minor Damage, Shape: {circularity:.2f} → Grade B"
    else:
        return "C", f"Symmetry: {symmetry:.2f}, Color: {vibrancy:.2f}, Damage: Detected, Shape: {circularity:.2f} → Grade C"

def predict_grade_cnn(image: Image.Image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        output = cnn_model(img_tensor)
        pred = output.argmax(dim=1).item()
    grade_map = {0: 'A', 1: 'B', 2: 'C', 3: 'not_flower'}
    return grade_map[pred]

@app.post("/grade-flower")
async def grade_flower(file: UploadFile = File(...)):
    try:
        logger.info(f"Starting flower grading for file: {file.filename}")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        np_img = preprocess_image(image)
        
        vibrancy = color_vibrancy(np_img)
        symmetry = symmetry_score(np_img)
        edge_density, brown_ratio = damage_score(np_img)
        circularity = shape_uniformity(np_img)
        
        # Use CNN for grading
        if cnn_model is None:
            raise HTTPException(status_code=500, detail="CNN model not loaded")
            
        grade = predict_grade_cnn(image)
        if grade == "not_flower":
            raise HTTPException(status_code=400, detail="The uploaded image does not appear to be a flower.")
        explanation = grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity)[1]
        
        logger.info(f"Grading completed: Grade {grade}")
        
        return JSONResponse({
            "grade": grade,
            "explanation": explanation,
            "metrics": {
                "color_vibrancy": vibrancy,
                "symmetry": symmetry,
                "edge_density": edge_density,
                "brown_ratio": brown_ratio,
                "circularity": circularity
            }
        })
        
    except Exception as e:
        logger.error(f"Error in flower grading: {e}")
        raise HTTPException(status_code=500, detail=f"Flower grading failed: {str(e)}")

@app.post("/download-report")
async def download_report(file: UploadFile = File(...)):
    try:
        logger.info(f"Starting PDF generation for file: {file.filename}")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        np_img = preprocess_image(image)
        
        logger.info("Image preprocessing completed")
        
        vibrancy = color_vibrancy(np_img)
        symmetry = symmetry_score(np_img)
        edge_density, brown_ratio = damage_score(np_img)
        circularity = shape_uniformity(np_img)
        
        logger.info("Feature extraction completed")
        
        # Use CNN for grading (same as the grade-flower endpoint)
        if cnn_model is None:
            raise HTTPException(status_code=500, detail="CNN model not loaded")
            
        grade = predict_grade_cnn(image)
        explanation = grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity)[1]
        
        logger.info(f"Grading completed: Grade {grade}")

        # Generate PDF with improved layout
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        
        # Header
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, height - 80, "FloraGrade")
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 110, "AI Flower Quality Assessment Report")
        
        # Grade section
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 150, f"Overall Grade: {grade}")
        
        # Explanation
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 180, "Analysis Summary:")
        c.setFont("Helvetica", 10)
        
        # Wrap text for explanation
        explanation_lines = []
        words = explanation.split()
        current_line = ""
        for word in words:
            if len(current_line + " " + word) < 60:
                current_line += " " + word if current_line else word
            else:
                explanation_lines.append(current_line)
                current_line = word
        if current_line:
            explanation_lines.append(current_line)
        
        y_position = height - 200
        for line in explanation_lines:
            c.drawString(50, y_position, line)
            y_position -= 15
        
        # Metrics section
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position - 30, "Detailed Metrics:")
        c.setFont("Helvetica", 10)
        
        metrics = [
            f"Color Vibrancy: {vibrancy:.3f}",
            f"Symmetry Score: {symmetry:.3f}",
            f"Edge Density: {edge_density:.4f}",
            f"Brown Ratio: {brown_ratio:.4f}",
            f"Circularity: {circularity:.3f}"
        ]
        
        y_position -= 50
        for metric in metrics:
            c.drawString(50, y_position, metric)
            y_position -= 15
        
        # Add image on the right side
        try:
            img_buffer = io.BytesIO()
            image.save(img_buffer, format="PNG")
            img_buffer.seek(0)
            c.drawInlineImage(img_buffer, 350, height - 350, width=200, height=200)
            
            # Add image caption
            c.setFont("Helvetica-Bold", 10)
            c.drawString(350, height - 360, "Analyzed Flower Image")
            logger.info("Image added to PDF successfully")
        except Exception as e:
            logger.error(f"Error adding image to PDF: {e}")
            c.drawString(350, height - 200, f"Image processing error: {str(e)}")
        
        # Footer
        c.setFont("Helvetica", 8)
        c.drawString(50, 50, "Generated by FloraGrade AI System")
        c.drawString(50, 35, "Powered by Computer Vision and Machine Learning")
        
        c.showPage()
        c.save()
        buffer.seek(0)
        
        logger.info("PDF generation completed successfully")
        
        return StreamingResponse(
            buffer, 
            media_type="application/pdf", 
            headers={"Content-Disposition": "attachment; filename=flower_report.pdf"}
        )
        
    except Exception as e:
        logger.error(f"Error in PDF generation: {e}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}") 