@echo off
chcp 65001 >nul
echo 🚀 CodeVM Online Judge - Setup and Test Script
echo ================================================
echo.

echo 📋 Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check MongoDB
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not installed or not in PATH
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    pause
    exit /b 1
) else (
    echo ✅ MongoDB is installed
)

echo.
echo 🛠️ Installing dependencies...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
cd ..

REM Install compiler dependencies
echo Installing compiler dependencies...
cd compiler
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install compiler dependencies
        pause
        exit /b 1
    )
) else (
    echo Compiler dependencies already installed
)
cd ..

echo.
echo ⚙️ Creating environment files...
echo.

REM Create backend .env file
if not exist "backend\.env" (
    echo Creating backend .env file...
    (
        echo MONGO_URI=mongodb://localhost:27017/online_judge
        echo JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
        echo PORT=5000
        echo COMPILER_URL=http://localhost:9000
        echo GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
    ) > backend\.env
    echo ✅ Backend .env file created
) else (
    echo Backend .env file already exists
)

REM Create frontend .env file
if not exist "frontend\.env" (
    echo Creating frontend .env file...
    (
        echo VITE_SERVER=http://localhost:5000
        echo VITE_COMPILER=http://localhost:9000
    ) > frontend\.env
    echo ✅ Frontend .env file created
) else (
    echo Frontend .env file already exists
)

echo.
echo 🗄️ Starting MongoDB...
echo.

REM Check if MongoDB is already running
netstat -an | find "27017" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is already running
) else (
    echo Starting MongoDB...
    start "MongoDB" cmd /k "mongod"
    echo Waiting for MongoDB to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo 🔧 Setting up sample data...
echo.

REM Run the setup script
node setup-sample-data.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup sample data
    echo Make sure MongoDB is running
    pause
    exit /b 1
)

echo.
echo 🚀 Starting services...
echo.

REM Start backend server
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start compiler service
echo Starting compiler service...
start "Compiler Service" cmd /k "cd compiler && npm start"

REM Wait a moment for compiler to start
timeout /t 3 /nobreak >nul

REM Start frontend (optional)
echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 🧪 Running functionality tests...
echo.

REM Wait a moment for all services to start
timeout /t 5 /nobreak >nul

REM Run the test script
node test-functionality.js

echo.
echo 🎉 Setup and testing completed!
echo.
echo 📋 Summary:
echo ✅ Dependencies installed
echo ✅ Environment files created
echo ✅ MongoDB started
echo ✅ Sample data created
echo ✅ All services started
echo ✅ Functionality tests completed
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5000
echo    Compiler Service: http://localhost:9000
echo.
echo 🔑 Login Credentials:
echo    Admin: admin@codevm.com / admin123
echo    Test User: test@example.com / test123
echo.
echo Press any key to close this window...
pause >nul
