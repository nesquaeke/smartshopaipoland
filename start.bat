@echo off
echo 🚀 Starting SmartShopAI Poland...
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo 🔄 Cleaning up any existing processes...
taskkill /f /im node.exe >nul 2>&1

timeout /t 2 >nul

echo 🎯 Starting backend server...
start /b cmd /c "cd backend && node src/simple-server.js"

timeout /t 3 >nul

echo 🎨 Starting frontend server...
start /b cmd /c "cd frontend && npm run dev"

timeout /t 5 >nul

echo.
echo 🎉 SmartShopAI Poland is now running!
echo ======================================
echo 🎨 Frontend: http://localhost:3000
echo ⚙️  Backend:  http://localhost:3535
echo ❤️  Health:   http://localhost:3535/health
echo.
echo 📊 Features:
echo    • 111 Products across 68 stores
echo    • AI-powered price comparison
echo    • Smart shopping recommendations
echo    • Real Polish pricing data
echo.
echo 🌐 Opening browser...
timeout /t 2 >nul

start http://localhost:3000

echo.
echo ✋ Press any key to stop servers and exit
pause >nul

echo 🛑 Stopping servers...
taskkill /f /im node.exe >nul 2>&1
echo 👋 SmartShopAI stopped. Thank you! 