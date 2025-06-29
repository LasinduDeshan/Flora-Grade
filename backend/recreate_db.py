import os
from database import engine
from models import Base

def recreate_database():
    """Recreate the database with the updated schema"""
    try:
        # Drop all tables
        print("Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)
        
        # Create all tables with new schema
        print("Creating tables with updated schema...")
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database recreated successfully!")
        print("📝 Note: You'll need to recreate test users after this.")
        
    except Exception as e:
        print(f"❌ Error recreating database: {e}")

if __name__ == "__main__":
    recreate_database() 