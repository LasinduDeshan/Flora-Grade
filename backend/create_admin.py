from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

def create_default_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@floragrade.com").first()
        if admin:
            print("Admin user already exists!")
            return
        
        # Create default admin user
        admin_user = User(
            email="admin@floragrade.com",
            username="admin",
            full_name="FloraGrade Administrator",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("Default admin user created successfully!")
        print("Email: admin@floragrade.com")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_default_admin() 