from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models import User, FlowerGrade as FlowerGradeModel
from schemas import FlowerGradeCreate, FlowerGradeResponse, FlowerGradingResponse
from auth import get_current_active_user
import json
import os
from PIL import Image
import io
import uuid
from datetime import datetime

router = APIRouter(prefix="/flower-grading", tags=["flower-grading"])

# Import the existing grading functions
from flower_grader_api import (
    preprocess_image, color_vibrancy, symmetry_score, 
    damage_score, shape_uniformity, grade_flower_logic, predict_grade_cnn
)

@router.post("/grade", response_model=FlowerGradingResponse)
async def grade_flower(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        # Read the file content once
        contents = await file.read()
        
        # Save the uploaded image
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1] if file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save the file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Process the image using the same content
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        np_img = preprocess_image(image)
        
        # Extract features
        vibrancy = color_vibrancy(np_img)
        symmetry = symmetry_score(np_img)
        edge_density, brown_ratio = damage_score(np_img)
        circularity = shape_uniformity(np_img)
        
        # Grade the flower using CNN
        from flower_grader_api import cnn_model
        if cnn_model is None:
            raise HTTPException(status_code=500, detail="CNN model not loaded")
        
        grade = predict_grade_cnn(image)
        explanation = grade_flower_logic(vibrancy, symmetry, edge_density, brown_ratio, circularity)[1]
        
        # Prepare metrics
        metrics = {
            "color_vibrancy": vibrancy,
            "symmetry": symmetry,
            "edge_density": edge_density,
            "brown_ratio": brown_ratio,
            "circularity": circularity
        }
        
        # Save grading result to database
        flower_grade = FlowerGradeModel(
            grade=grade,
            image_url=file_path,
            metrics=json.dumps(metrics),
            explanation=explanation,
            user_id=current_user.id
        )
        db.add(flower_grade)
        db.commit()
        db.refresh(flower_grade)
        
        return FlowerGradingResponse(
            grade=grade,
            explanation=explanation,
            metrics=metrics,
            image_url=file_path
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flower grading failed: {str(e)}")

@router.get("/history", response_model=list[FlowerGradeResponse])
async def get_grading_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's flower grading history"""
    grades = db.query(FlowerGradeModel).filter(
        FlowerGradeModel.user_id == current_user.id
    ).order_by(FlowerGradeModel.created_at.desc()).all()
    
    return grades

@router.get("/{grade_id}", response_model=FlowerGradeResponse)
async def get_grade_details(
    grade_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific grade details"""
    grade = db.query(FlowerGradeModel).filter(
        FlowerGradeModel.id == grade_id,
        FlowerGradeModel.user_id == current_user.id
    ).first()
    
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    
    return grade 