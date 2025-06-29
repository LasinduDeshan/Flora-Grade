from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

def create_test_users():
    db = SessionLocal()
    try:
        # Create seller user
        seller = db.query(User).filter(User.email == "seller@floragrade.com").first()
        if not seller:
            seller_user = User(
                email="seller@floragrade.com",
                username="seller",
                full_name="Test Seller",
                hashed_password=get_password_hash("password123"),
                role=UserRole.SELLER,
                is_active=True
            )
            db.add(seller_user)
            print("✅ Seller user created successfully!")
            print("Email: seller@floragrade.com")
            print("Password: password123")
        else:
            print("ℹ️  Seller user already exists!")
        
        # Create customer user
        customer = db.query(User).filter(User.email == "customer@floragrade.com").first()
        if not customer:
            customer_user = User(
                email="customer@floragrade.com",
                username="customer",
                full_name="Test Customer",
                hashed_password=get_password_hash("password123"),
                role=UserRole.CUSTOMER,
                is_active=True
            )
            db.add(customer_user)
            print("✅ Customer user created successfully!")
            print("Email: customer@floragrade.com")
            print("Password: password123")
        else:
            print("ℹ️  Customer user already exists!")
        
        db.commit()
        
        print("\n🎉 Test users setup completed!")
        print("\n📋 Test credentials:")
        print("- Admin: admin@floragrade.com / admin123")
        print("- Seller: seller@floragrade.com / password123")
        print("- Customer: customer@floragrade.com / password123")
        
    except Exception as e:
        print(f"❌ Error creating test users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users() 