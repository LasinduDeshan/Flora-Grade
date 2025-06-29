#!/usr/bin/env python3
"""
FloraGrade E-Commerce Platform Setup Script
This script helps set up the development environment and database.
"""

import os
import sys
import subprocess
import sqlite3
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command and return the result."""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def setup_backend():
    """Set up the backend environment."""
    print("\n🔧 Setting up backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    # Create virtual environment
    print("Creating virtual environment...")
    if not run_command("python -m venv venv", cwd=backend_dir):
        return False
    
    # Install dependencies
    print("Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt", cwd=backend_dir):
        return False
    
    # Create uploads directory
    uploads_dir = backend_dir / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    print("✅ Backend setup complete")
    return True

def setup_frontend():
    """Set up the frontend environment."""
    print("\n🎨 Setting up frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    # Install Node.js dependencies
    print("Installing Node.js dependencies...")
    if not run_command("npm install", cwd=frontend_dir):
        return False
    
    print("✅ Frontend setup complete")
    return True

def setup_database():
    """Set up the database."""
    print("\n🗄️ Setting up database...")
    
    backend_dir = Path("backend")
    
    # Create SQLite database for development
    db_path = backend_dir / "floragrade.db"
    
    try:
        # Import database models
        sys.path.append(str(backend_dir))
        from database import engine
        from models import Base
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
        
        # Create admin user
        from sqlalchemy.orm import Session
        from models import User
        from auth import get_password_hash
        
        db = Session(engine)
        
        # Check if admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin_user = User(
                email="admin@floragrade.com",
                username="admin",
                full_name="System Administrator",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("✅ Admin user created (username: admin, password: admin123)")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def create_env_file():
    """Create environment configuration file."""
    print("\n⚙️ Creating environment configuration...")
    
    backend_dir = Path("backend")
    env_content = """# FloraGrade Environment Configuration
DATABASE_URL=sqlite:///./floragrade.db
SECRET_KEY=your-secret-key-here-make-it-long-and-secure-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
"""
    
    env_file = backend_dir / ".env"
    if not env_file.exists():
        with open(env_file, "w") as f:
            f.write(env_content)
        print("✅ Environment file created")
    else:
        print("ℹ️ Environment file already exists")
    
    return True

def main():
    """Main setup function."""
    print("🌸 FloraGrade E-Commerce Platform Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed")
        sys.exit(1)
    
    # Create environment file
    if not create_env_file():
        print("❌ Environment setup failed")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("❌ Database setup failed")
        sys.exit(1)
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Start the backend server:")
    print("   cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print("\n2. Start the frontend server:")
    print("   cd frontend && npm run dev")
    print("\n3. Access the application:")
    print("   Frontend: http://localhost:5173")
    print("   Backend API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("\n4. Login with admin account:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n⚠️ Remember to change the admin password in production!")

if __name__ == "__main__":
    main() 