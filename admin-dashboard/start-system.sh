#!/bin/bash

# ================================
# NAVIGI SBARO - System Startup Script
# ================================

echo "🚀 Starting NAVIGI SBARO Admin Dashboard & Bot Control System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 16.0.0"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down NAVIGI system..."
    kill $API_PID 2>/dev/null
    kill $DASHBOARD_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start API Server
echo "🔌 Starting API Server on port 3001..."
node api-server.js &
API_PID=$!

# Wait a moment for API server to start
sleep 3

# Check if API server started successfully
if ! kill -0 $API_PID 2>/dev/null; then
    echo "❌ Failed to start API server"
    exit 1
fi

echo "✅ API Server started successfully (PID: $API_PID)"

# Start Dashboard (Simple HTTP Server)
echo "🌐 Starting Dashboard on port 8000..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000 &
    DASHBOARD_PID=$!
elif command -v python &> /dev/null; then
    python -m http.server 8000 &
    DASHBOARD_PID=$!
else
    echo "⚠️  Python not found. Please start dashboard manually:"
    echo "   python -m http.server 8000"
    echo "   or"
    echo "   python3 -m http.server 8000"
    DASHBOARD_PID=""
fi

if [ ! -z "$DASHBOARD_PID" ]; then
    echo "✅ Dashboard started successfully (PID: $DASHBOARD_PID)"
fi

echo ""
echo "🎉 NAVIGI SBARO System is running!"
echo ""
echo "📊 Dashboard: http://localhost:8000"
echo "🔌 API Server: http://localhost:3001"
echo "📋 API Status: http://localhost:3001/api/bot-status"
echo ""
echo "Press Ctrl+C to stop the system"
echo ""

# Wait for processes
wait