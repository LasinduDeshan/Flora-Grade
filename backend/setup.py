#!/usr/bin/env python3
"""
FloraGrade E-Commerce Platform Setup Script
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def main():
    print("🚀 FloraGrade E-Commerce Platform Setup")
    print("=" * 50)
    
    # Check if we're in the backend directory
    if not os.path.exists("main.py"):
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists("venv"):
        print("📦 Creating virtual environment...")
        if not run_command("python -m venv venv", "Creating virtual environment"):
            sys.exit(1)
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/Mac
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    # Install requirements
    if os.path.exists("requirements.txt"):
        if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies"):
            sys.exit(1)
    
    # Create database tables
    print("🗄️  Setting up database...")
    try:
        from database import engine
        from models import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        sys.exit(1)
    
    # Create admin user
    print("👤 Creating admin user...")
    try:
        from create_admin import create_default_admin
        create_default_admin()
        print("✅ Admin user created successfully")
    except Exception as e:
        print(f"❌ Admin user creation failed: {e}")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server: python main.py")
    print("2. In another terminal, start the frontend: cd ../frontend && npm run dev")
    print("3. Access the application at: http://localhost:5173")
    print("4. Admin login: admin@floragrade.com / admin123")
    
    print("\n🔧 Default credentials:")
    print("- Admin: admin@floragrade.com / admin123")
    print("- Seller: seller / password123")
    print("- Customer: customer / password123")

if __name__ == "__main__":
    main() 