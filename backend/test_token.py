import requests
import json

def test_auth():
    # Test login
    login_data = {
        'username': 'seller',
        'password': 'password123'
    }
    
    try:
        # Login to get token
        response = requests.post(
            'http://localhost:8001/auth/token',
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data['access_token']
            print(f"✅ Login successful")
            print(f"Token: {token[:50]}...")
            
            # Test /auth/me endpoint
            me_response = requests.get(
                'http://localhost:8001/auth/me',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print(f"✅ /auth/me successful")
                print(f"User: {user_data}")
            else:
                print(f"❌ /auth/me failed: {me_response.status_code}")
                print(f"Response: {me_response.text}")
            
            # Test products endpoint
            products_response = requests.get(
                'http://localhost:8001/products/',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if products_response.status_code == 200:
                print(f"✅ /products/ successful")
            else:
                print(f"❌ /products/ failed: {products_response.status_code}")
                print(f"Response: {products_response.text}")
                
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_auth() 