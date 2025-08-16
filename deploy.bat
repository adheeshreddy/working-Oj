@echo off
echo 🚀 Starting AlgoNest Production Deployment...
echo.

set FRONTEND_DIR=frontend
set BACKEND_DIR=backend
set COMPILER_DIR=compiler
set BUILD_DIR=dist

echo 📋 Step 1: Building Frontend for Production...
cd %FRONTEND_DIR%

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo Running production build...
call npm run build

if exist "%BUILD_DIR%" (
    echo ✅ Frontend built successfully in %BUILD_DIR%/
    echo Ready to deploy to Netlify!
    echo.
    echo ⚠️  Remember to set environment variables in Netlify:
    echo   VITE_SERVER=https://your-ec2-domain.com
    echo   VITE_COMPILER=https://your-ec2-domain.com/compiler
) else (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

cd ..

echo.
echo 📋 Step 2: Preparing Backend for Production...
cd %BACKEND_DIR%

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo ✅ Backend ready for deployment to EC2!
cd ..

echo.
echo 📋 Step 3: Preparing Compiler for Production...
cd %COMPILER_DIR%

if not exist "node_modules" (
    echo Installing compiler dependencies...
    call npm install
)

echo ✅ Compiler ready for deployment to EC2!
cd ..

echo.
echo 🎉 Deployment preparation completed!
echo.
echo 📋 Next steps:
echo 1. Deploy frontend to Netlify (drag ^& drop %FRONTEND_DIR%\%BUILD_DIR%/)
echo 2. Deploy backend ^& compiler to EC2 (follow DEPLOYMENT_GUIDE.md)
echo 3. Set up MongoDB Atlas or local MongoDB on EC2
echo 4. Configure environment variables
echo 5. Test your production deployment!
echo.
pause
