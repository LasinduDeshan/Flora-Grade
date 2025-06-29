from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Order, OrderItem, Product, UserRole, OrderStatus
from schemas import OrderCreate, OrderUpdate, Order as OrderSchema
from auth import get_current_active_user, require_role

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderSchema)
async def create_order(
    order: OrderCreate,
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    # Validate products and calculate total
    total_amount = 0
    order_items = []
    
    for item in order.items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True,
            Product.is_approved == True
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found or not available")
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")
        
        total_amount += product.price * item.quantity
        order_items.append((product, item))
    
    # Create order
    db_order = Order(
        customer_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order.shipping_address,
        status=OrderStatus.PENDING
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items and update stock
    for product, item in order_items:
        order_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )
        db.add(order_item)
        
        # Update stock
        product.stock_quantity -= item.quantity
        db.add(product)
    
    db.commit()
    db.refresh(db_order)
    
    return db_order

@router.get("/", response_model=List[OrderSchema])
async def get_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's orders"""
    if current_user.role == UserRole.CUSTOMER:
        orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    elif current_user.role == UserRole.SELLER:
        # Get orders for seller's products
        orders = db.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == current_user.id
        ).distinct().all()
    else:  # Admin
        orders = db.query(Order).all()
    
    return orders

@router.get("/{order_id}", response_model=OrderSchema)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific order details"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check permissions
    if current_user.role == UserRole.CUSTOMER and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    if current_user.role == UserRole.SELLER:
        # Check if order contains seller's products
        seller_products = db.query(OrderItem).join(Product).filter(
            OrderItem.order_id == order_id,
            Product.seller_id == current_user.id
        ).first()
        if not seller_products:
            raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    return order

@router.put("/{order_id}", response_model=OrderSchema)
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update order status (admin or seller only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if user is admin or seller of products in this order
    if current_user.role == UserRole.CUSTOMER:
        raise HTTPException(status_code=403, detail="Customers cannot update orders")
    
    if current_user.role == UserRole.SELLER:
        # Check if order contains seller's products
        seller_products = db.query(OrderItem).join(Product).filter(
            OrderItem.order_id == order_id,
            Product.seller_id == current_user.id
        ).first()
        if not seller_products:
            raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    # Update fields
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    return order

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel an order (customer or admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check permissions
    if current_user.role == UserRole.CUSTOMER and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")
    
    if current_user.role == UserRole.SELLER:
        raise HTTPException(status_code=403, detail="Sellers cannot cancel orders")
    
    # Check if order can be cancelled
    if order.status not in [OrderStatus.PENDING, OrderStatus.APPROVED]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled in current status")
    
    # Update order status
    order.status = OrderStatus.CANCELLED
    
    # Restore stock
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    for item in order_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock_quantity += item.quantity
            db.add(product)
    
    db.commit()
    return {"message": "Order cancelled successfully"} 