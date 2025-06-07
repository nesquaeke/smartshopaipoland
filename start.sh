#!/bin/bash

# 🛒 SmartShopAI Poland - Auto Startup Script
# Automatically sets up and runs the complete application

echo "🚀 Starting SmartShopAI Poland..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(process.version.substring(1).split('.').map(Number).some((v,i) => v > '${REQUIRED_VERSION}'.split('.')[i] || (v === '${REQUIRED_VERSION}'.split('.')[i] && i === 2)) ? 0 : 1)"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Kill any existing processes on required ports
echo "🔄 Cleaning up any existing processes..."
lsof -ti:3535 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

sleep 2

echo "🎯 Starting backend server..."
cd backend && node src/simple-server.js &
BACKEND_PID=$!

sleep 3

echo "🎨 Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

sleep 5

echo ""
echo "🎉 SmartShopAI Poland is now running!"
echo "======================================"
echo "🎨 Frontend: http://localhost:3000"
echo "⚙️  Backend:  http://localhost:3535"
echo "❤️  Health:   http://localhost:3535/health"
echo ""
echo "📊 Features:"
echo "   • 111 Products across 68 stores"
echo "   • AI-powered price comparison"
echo "   • Smart shopping recommendations"
echo "   • Real Polish pricing data"
echo ""
echo "🌐 Opening browser..."
sleep 2

# Open browser
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v start &> /dev/null; then
    start http://localhost:3000
fi

echo ""
echo "✋ Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ""; echo "👋 SmartShopAI stopped. Thank you!"; exit' INT

wait 