from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from auth import authenticate_user, create_access_token
from config import settings
from datetime import timedelta

def check_user():
    db = SessionLocal()
    try:
        # Check if seller user exists
        seller = db.query(User).filter(User.username == "seller").first()
        if seller:
            print(f"✅ Seller user found:")
            print(f"   ID: {seller.id}")
            print(f"   Username: {seller.username}")
            print(f"   Email: {seller.email}")
            print(f"   Role: {seller.role}")
            print(f"   Active: {seller.is_active}")
            
            # Test authentication
            auth_result = authenticate_user(db, "seller", "password123")
            if auth_result:
                print(f"✅ Authentication successful")
                
                # Test token creation
                access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                access_token = create_access_token(
                    data={"sub": seller.username}, expires_delta=access_token_expires
                )
                print(f"✅ Token created successfully")
                print(f"   Token: {access_token[:50]}...")
                print(f"   Token length: {len(access_token)}")
                
            else:
                print(f"❌ Authentication failed")
        else:
            print(f"❌ Seller user not found")
            
        # Check all users
        all_users = db.query(User).all()
        print(f"\n📋 All users in database:")
        for user in all_users:
            print(f"   - {user.username} ({user.email}) - Role: {user.role}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user() 