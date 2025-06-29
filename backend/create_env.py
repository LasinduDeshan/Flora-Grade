with open('.env', 'w', encoding='utf-8') as f:
    f.write("DATABASE_URL=sqlite:///./floragrade.db\n")
    f.write("SECRET_KEY=your-secret-key-here-make-it-long-and-secure-for-production\n")
    f.write("ALGORITHM=HS256\n")
    f.write("ACCESS_TOKEN_EXPIRE_MINUTES=30\n")
 
print("Environment file created successfully!") 