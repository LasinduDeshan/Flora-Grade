from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import requests
from database import get_db
from models import User, Product, FlowerGrade as FlowerGradeModel, UserRole, FlowerGrade as GradeEnum, PendingProduct
from schemas import ProductCreate, ProductUpdate, Product as ProductSchema, ProductWithGrade
from auth import get_current_active_user, require_role
import random
import smtplib
from email.mime.text import MIMEText

router = APIRouter(prefix="/products", tags=["products"])

async def save_product_image(file: UploadFile) -> str:
    """Save uploaded product image and return the file path"""
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1] if file.filename else "jpg"
    unique_filename = f"product_{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save the file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return file_path

async def grade_flower_image(image_path: str) -> dict:
    """Grade flower image using the FloraGrade API"""
    try:
        with open(image_path, "rb") as f:
            files = {"file": f}
            response = requests.post("http://localhost:8000/flower-api/grade-flower", files=files)
            
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Flower grading failed: {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flower grading error: {str(e)}")

@router.post("/", status_code=201)
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock_quantity: int = Form(...),
    category: str = Form("roses"),
    image: UploadFile = File(...),
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    import os, uuid, traceback
    try:
        # Validate
        if not image or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=422, detail="A valid image is required.")

        # Save image
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        ext = image.filename.split(".")[-1]
        filename = f"product_{uuid.uuid4()}.{ext}"
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, "wb") as f:
            f.write(await image.read())

        # Create product with correct image URL
        product = Product(
            name=name,
            description=description,
            price=price,
            stock_quantity=stock_quantity,
            category=category,
            image_url=f"/uploads/{filename}",  # Use the URL path, not the file path
            seller_id=current_user.id,
            is_approved=True,  # Immediately approve new products
            is_active=True
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return {"id": product.id, "message": "Product created successfully!"}

    except Exception as e:
        print("PRODUCT CREATION ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")

@router.get("/", response_model=List[ProductWithGrade])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    approved_only: bool = Query(True),
    grade_filter: Optional[str] = Query(None, description="Filter by grade: A, B, or C"),
    db: Session = Depends(get_db)
):
    """Get all products with optional grade filtering"""
    query = db.query(Product).filter(Product.is_active == True)
    
    if approved_only:
        query = query.filter(Product.is_approved == True)
    
    # Apply grade filter if specified
    if grade_filter:
        query = query.join(FlowerGradeModel).filter(FlowerGradeModel.grade == grade_filter)
    
    # Order by latest first
    query = query.order_by(Product.id.desc())
    products = query.offset(skip).limit(limit).all()
    
    # Create ProductWithGrade objects
    result = []
    for product in products:
        flower_grade = None
        if product.flower_grade_id:
            flower_grade = db.query(FlowerGradeModel).filter(
                FlowerGradeModel.id == product.flower_grade_id
            ).first()
        
        seller = db.query(User).filter(User.id == product.seller_id).first()
        
        result.append(ProductWithGrade(
            product=product,
            flower_grade=flower_grade,
            seller=seller
        ))
    
    return result

@router.get("/{product_id}", response_model=ProductWithGrade)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific product"""
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    flower_grade = None
    if product.flower_grade_id:
        flower_grade = db.query(FlowerGradeModel).filter(
            FlowerGradeModel.id == product.flower_grade_id
        ).first()
    
    seller = db.query(User).filter(User.id == product.seller_id).first()
    
    return ProductWithGrade(
        product=product,
        flower_grade=flower_grade,
        seller=seller
    )

@router.put("/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a product (seller or admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and db_product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")
    
    # Update fields
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a product (seller or admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and db_product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

@router.get("/seller/my-products", response_model=List[ProductSchema])
async def get_my_products(
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    """Get current seller's products"""
    products = db.query(Product).filter(
        Product.seller_id == current_user.id,
        Product.is_active == True
    ).all()
    return products

@router.get("/seller/pending-approval", response_model=List[ProductWithGrade])
async def get_pending_approval_products(
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    """Get seller's products pending approval"""
    products = db.query(Product).filter(
        Product.seller_id == current_user.id,
        Product.is_approved == False,
        Product.is_active == True
    ).all()
    
    result = []
    for product in products:
        flower_grade = None
        if product.flower_grade_id:
            flower_grade = db.query(FlowerGradeModel).filter(
                FlowerGradeModel.id == product.flower_grade_id
            ).first()
        
        seller = db.query(User).filter(User.id == product.seller_id).first()
        
        result.append(ProductWithGrade(
            product=product,
            flower_grade=flower_grade,
            seller=seller
        ))
    
    return result

@router.post("/{product_id}/re-grade")
async def re_grade_product(
    product_id: int,
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    """Re-grade a product's flower image"""
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not product.image_url:
        raise HTTPException(status_code=400, detail="Product has no image to grade")
    
    try:
        # Re-grade the flower
        grading_result = await grade_flower_image(product.image_url)
        grade = grading_result["grade"]
        
        # Update or create flower grade record
        if product.flower_grade_id:
            flower_grade = db.query(FlowerGradeModel).filter(
                FlowerGradeModel.id == product.flower_grade_id
            ).first()
            if flower_grade:
                flower_grade.grade = GradeEnum(grade)
                flower_grade.metrics = str(grading_result["metrics"])
                flower_grade.explanation = grading_result["explanation"]
        else:
            flower_grade = FlowerGradeModel(
                grade=GradeEnum(grade),
                image_url=product.image_url,
                metrics=str(grading_result["metrics"]),
                explanation=grading_result["explanation"],
                user_id=current_user.id
            )
            db.add(flower_grade)
            db.flush()
            product.flower_grade_id = flower_grade.id
        
        # Update approval status
        product.is_approved = grade in ["A", "B"]
        
        db.commit()
        
        return {
            "message": f"Product re-graded successfully. Grade: {grade}",
            "grade": grade,
            "is_approved": product.is_approved
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Re-grading failed: {str(e)}")

@router.post("/{product_id}/link-grade/{grade_id}")
async def link_flower_grade(
    product_id: int,
    grade_id: int,
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    """Link an existing flower grade to a product"""
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.seller_id == current_user.id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    flower_grade = db.query(FlowerGradeModel).filter(
        FlowerGradeModel.id == grade_id,
        FlowerGradeModel.user_id == current_user.id
    ).first()
    
    if not flower_grade:
        raise HTTPException(status_code=404, detail="Flower grade not found")
    
    product.flower_grade_id = flower_grade.id
    product.is_approved = flower_grade.grade in ["A", "B"]
    
    db.commit()
    db.refresh(product)
    
    return {"message": "Flower grade linked successfully"}

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, otp):
    # Simple SMTP example, replace with your SMTP server details
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'luminasolar101@gmail.com'  # Replace with your email
    smtp_password = 'rnccqjuosxsduecc'      # Replace with your password
    msg = MIMEText(f'Your OTP for product addition is: {otp}')
    msg['Subject'] = 'FloraGrade Product Addition OTP'
    msg['From'] = smtp_user
    msg['To'] = to_email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, [to_email], msg.as_string())

@router.post("/initiate-add")
async def initiate_add_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock_quantity: int = Form(...),
    category: str = Form("roses"),
    image: UploadFile = File(...),
    current_user: User = Depends(require_role(UserRole.SELLER)),
    db: Session = Depends(get_db)
):
    import os, uuid, traceback
    try:
        # Save image
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        ext = image.filename.split(".")[-1]
        filename = f"product_{uuid.uuid4()}.{ext}"
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, "wb") as f:
            f.write(await image.read())
        # Generate OTP
        otp = generate_otp()
        # Save pending product
        pending = PendingProduct(
            name=name,
            description=description,
            price=price,
            stock_quantity=stock_quantity,
            category=category,
            image_url=f"/uploads/{filename}",
            seller_id=current_user.id,
            otp=otp,
            email=current_user.email
        )
        db.add(pending)
        db.commit()
        db.refresh(pending)
        # Send OTP email
        send_otp_email(current_user.email, otp)
        return {"pending_product_id": pending.id, "message": "OTP sent to your email."}
    except Exception as e:
        print("INITIATE PRODUCT ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to initiate product addition: {str(e)}")

@router.post("/verify-otp")
async def verify_otp_and_add_product(
    pending_product_id: int = Form(...),
    otp: str = Form(...),
    db: Session = Depends(get_db)
):
    pending = db.query(PendingProduct).filter(PendingProduct.id == pending_product_id).first()
    if not pending:
        raise HTTPException(status_code=404, detail="Pending product not found")
    if pending.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    # Create the actual product
    product = Product(
        name=pending.name,
        description=pending.description,
        price=pending.price,
        stock_quantity=pending.stock_quantity,
        category=pending.category,
        image_url=pending.image_url,
        seller_id=pending.seller_id,
        is_approved=True,
        is_active=True
    )
    db.add(product)
    db.delete(pending)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "message": "Product added successfully!"} 