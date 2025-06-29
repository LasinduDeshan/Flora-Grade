from main import app

print("Available routes:")
for route in app.routes:
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        print(f"{route.methods} {route.path}")
    elif hasattr(route, 'path'):
        print(f"Mount: {route.path}")
    else:
        print(f"Route: {type(route)}")

print("\nChecking for auth routes specifically:")
for route in app.routes:
    if hasattr(route, 'path') and 'auth' in str(route.path):
        print(f"Auth route found: {route.path}") 