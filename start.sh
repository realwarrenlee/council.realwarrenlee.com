#!/bin/bash

# LLM Council Startup Script
# This script starts both backend and frontend in separate terminal windows

echo "========================================="
echo "  LLM Council Startup"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: Must run from llm-council-main directory"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check if backend is already running
if check_port 8000; then
    echo "⚠️  Backend already running on port 8000"
else
    echo "Starting backend on port 8000..."
    cd backend
    python main.py &
    BACKEND_PID=$!
    cd ..
    echo "✓ Backend started (PID: $BACKEND_PID)"
fi

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "✗ Backend failed to start"
        exit 1
    fi
    sleep 1
done

# Check if frontend is already running
if check_port 5173; then
    echo "⚠️  Frontend already running on port 5173"
else
    echo "Starting frontend on port 5173..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "✓ Frontend started (PID: $FRONTEND_PID)"
fi

echo ""
echo "========================================="
echo "  LLM Council is running!"
echo "========================================="
echo ""
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
