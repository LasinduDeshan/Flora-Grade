from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime
from models import UserRole, FlowerGrade, OrderStatus

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: Literal['customer', 'seller', 'admin'] = 'customer'

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock_quantity: int
    category: str = "roses"

class ProductCreate(ProductBase):
    image_url: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_approved: Optional[bool] = None
    is_active: Optional[bool] = None

class Product(ProductBase):
    id: int
    image_url: str
    flower_grade_id: Optional[int] = None
    seller_id: int
    is_approved: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Flower Grade schemas
class FlowerGradeBase(BaseModel):
    grade: Literal['A', 'B', 'C']
    explanation: str

class FlowerGradeCreate(FlowerGradeBase):
    image_url: str
    metrics: str

class FlowerGradeResponse(FlowerGradeBase):
    id: int
    image_url: str
    metrics: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_amount: float
    shipping_address: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[Literal['pending', 'approved', 'rejected', 'shipped', 'delivered', 'cancelled']] = None
    shipping_address: Optional[str] = None

class Order(OrderBase):
    id: int
    customer_id: int
    status: Literal['pending', 'approved', 'rejected', 'shipped', 'delivered', 'cancelled']
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# API Response schemas
class FlowerGradingResponse(BaseModel):
    grade: str
    explanation: str
    metrics: dict
    image_url: Optional[str] = None

class ProductWithGrade(BaseModel):
    product: Product
    flower_grade: Optional[FlowerGradeResponse] = None
    seller: User

    class Config:
        from_attributes = True 