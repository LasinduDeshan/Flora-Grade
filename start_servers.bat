@echo off
echo Starting FloraGrade AI E-commerce Platform...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python main.py"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8001/docs
echo.
echo Default Admin Login:
echo Email: admin@floragrade.com
echo Password: admin123
echo.
pause 