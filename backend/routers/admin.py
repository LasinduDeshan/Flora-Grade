from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from database import get_db
from models import User, Product, Order, UserRole, FlowerGrade as FlowerGradeModel, FlowerGrade as GradeEnum
from schemas import UserUpdate, ProductUpdate, OrderUpdate, User as UserSchema, Product as ProductSchema, Order as OrderSchema
from auth import require_role

router = APIRouter(prefix="/admin", tags=["admin"])

# Admin-only endpoints
@router.get("/users", response_model=List[UserSchema])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role_filter: Optional[str] = Query(None, description="Filter by role: customer, seller, admin"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all users with optional role filtering (admin only)"""
    query = db.query(User)
    
    if role_filter:
        query = query.filter(User.role == role_filter)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update user (admin only)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/users/{user_id}/toggle-status")
async def toggle_user_status(
    user_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Toggle user active status (admin only)"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_active = not db_user.is_active
    db.commit()
    
    return {
        "message": f"User {'activated' if db_user.is_active else 'deactivated'} successfully",
        "is_active": db_user.is_active
    }

@router.get("/products", response_model=List[ProductSchema])
async def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    approved_only: Optional[bool] = Query(None),
    grade_filter: Optional[str] = Query(None, description="Filter by grade: A, B, or C"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all products with filtering options (admin only)"""
    query = db.query(Product)
    
    if approved_only is not None:
        query = query.filter(Product.is_approved == approved_only)
    
    if grade_filter:
        query = query.join(FlowerGradeModel).filter(FlowerGradeModel.grade == grade_filter)
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/products/pending", response_model=List[ProductSchema])
async def get_pending_products(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get products pending approval (admin only)"""
    products = db.query(Product).filter(
        Product.is_approved == False,
        Product.is_active == True
    ).all()
    return products

@router.post("/products/{product_id}/approve")
async def approve_product(
    product_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Approve a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.is_approved:
        raise HTTPException(status_code=400, detail="Product is already approved")
    
    # Check if product has a valid flower grade (A or B)
    if product.flower_grade_id:
        grade = db.query(FlowerGradeModel).filter(FlowerGradeModel.id == product.flower_grade_id).first()
        if grade and grade.grade not in ["A", "B"]:
            raise HTTPException(status_code=400, detail="Only Grade A and B flowers can be approved")
    
    product.is_approved = True
    db.commit()
    return {"message": "Product approved successfully"}

@router.post("/products/{product_id}/reject")
async def reject_product(
    product_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Reject a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.is_approved:
        raise HTTPException(status_code=400, detail="Cannot reject an approved product")
    
    product.is_active = False
    db.commit()
    return {"message": "Product rejected successfully"}

@router.delete("/products/{product_id}")
async def delete_product_admin(
    product_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@router.get("/flower-grades", response_model=List[dict])
async def get_all_flower_grades(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    grade_filter: Optional[str] = Query(None, description="Filter by grade: A, B, or C"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all flower grades with user and product info (admin only)"""
    query = db.query(FlowerGradeModel)
    
    if grade_filter:
        query = query.filter(FlowerGradeModel.grade == grade_filter)
    
    grades = query.offset(skip).limit(limit).all()
    
    result = []
    for grade in grades:
        user = db.query(User).filter(User.id == grade.user_id).first()
        product = db.query(Product).filter(Product.flower_grade_id == grade.id).first()
        
        result.append({
            "id": grade.id,
            "grade": grade.grade,
            "image_url": grade.image_url,
            "metrics": grade.metrics,
            "explanation": grade.explanation,
            "created_at": grade.created_at,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            } if user else None,
            "product": {
                "id": product.id,
                "name": product.name,
                "is_approved": product.is_approved
            } if product else None
        })
    
    return result

@router.get("/orders", response_model=List[OrderSchema])
async def get_all_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status_filter: Optional[str] = Query(None, description="Filter by order status"),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all orders with optional status filtering (admin only)"""
    query = db.query(Order)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    orders = query.offset(skip).limit(limit).all()
    return orders

@router.put("/orders/{order_id}", response_model=OrderSchema)
async def update_order_admin(
    order_id: int,
    order_update: OrderUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update order (admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update fields
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    return order

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard statistics (admin only)"""
    # Basic counts
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    pending_products = db.query(Product).filter(Product.is_approved == False).count()
    total_orders = db.query(Order).count()
    
    # Revenue calculation
    completed_orders = db.query(Order).filter(Order.status == "delivered").all()
    total_revenue = sum(order.total_amount for order in completed_orders)
    
    # User role distribution
    customers = db.query(User).filter(User.role == UserRole.CUSTOMER).count()
    sellers = db.query(User).filter(User.role == UserRole.SELLER).count()
    admins = db.query(User).filter(User.role == UserRole.ADMIN).count()
    
    # Flower grade distribution
    grade_a_count = db.query(FlowerGradeModel).filter(FlowerGradeModel.grade == GradeEnum.A).count()
    grade_b_count = db.query(FlowerGradeModel).filter(FlowerGradeModel.grade == GradeEnum.B).count()
    grade_c_count = db.query(FlowerGradeModel).filter(FlowerGradeModel.grade == GradeEnum.C).count()
    
    # Order status distribution
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    approved_orders = db.query(Order).filter(Order.status == "approved").count()
    shipped_orders = db.query(Order).filter(Order.status == "shipped").count()
    delivered_orders = db.query(Order).filter(Order.status == "delivered").count()
    
    # Recent activity (last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.now() - timedelta(days=7)
    
    recent_users = db.query(User).filter(User.created_at >= week_ago).count()
    recent_products = db.query(Product).filter(Product.created_at >= week_ago).count()
    recent_orders = db.query(Order).filter(Order.created_at >= week_ago).count()
    
    return {
        "total_users": total_users,
        "total_products": total_products,
        "pending_products": pending_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "user_distribution": {
            "customers": customers,
            "sellers": sellers,
            "admins": admins
        },
        "flower_grade_distribution": {
            "grade_a": grade_a_count,
            "grade_b": grade_b_count,
            "grade_c": grade_c_count
        },
        "order_status_distribution": {
            "pending": pending_orders,
            "approved": approved_orders,
            "shipped": shipped_orders,
            "delivered": delivered_orders
        },
        "recent_activity": {
            "new_users": recent_users,
            "new_products": recent_products,
            "new_orders": recent_orders
        }
    }

@router.get("/dashboard/top-sellers")
async def get_top_sellers(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get top selling products (admin only)"""
    # Get products with their order counts
    top_products = db.query(
        Product.id,
        Product.name,
        Product.price,
        func.count(Order.id).label('order_count')
    ).outerjoin(Order).group_by(Product.id).order_by(desc('order_count')).limit(limit).all()
    
    return [
        {
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "order_count": product.order_count
        }
        for product in top_products
    ]

@router.get("/dashboard/revenue-chart")
async def get_revenue_chart(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get revenue data for chart (admin only)"""
    from datetime import datetime, timedelta
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get daily revenue
    daily_revenue = db.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('revenue')
    ).filter(
        Order.created_at >= start_date,
        Order.status == "delivered"
    ).group_by(func.date(Order.created_at)).all()
    
    return [
        {
            "date": str(revenue.date),
            "revenue": float(revenue.revenue) if revenue.revenue else 0
        }
        for revenue in daily_revenue
    ] 