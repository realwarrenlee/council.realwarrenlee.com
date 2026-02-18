@echo off
REM LLM Council Startup Script for Windows
REM This script starts both backend and frontend

echo =========================================
echo   LLM Council Startup
echo =========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: backend directory not found
    exit /b 1
)
if not exist "frontend" (
    echo Error: frontend directory not found
    exit /b 1
)

echo Starting backend on port 8000...
start "LLM Council Backend" cmd /k "cd backend && python main.py"
timeout /t 3 /nobreak >nul

echo Waiting for backend to be ready...
:wait_backend
timeout /t 1 /nobreak >nul
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 goto wait_backend
echo Backend is ready!

echo.
echo Starting frontend on port 3000...
start "LLM Council Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo   LLM Council is starting!
echo =========================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo.
echo Two terminal windows have been opened.
echo Close them to stop the services.
echo.
pause
