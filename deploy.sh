#!/bin/bash

# 🚀 AlgoNest Production Deployment Script
# Usage: ./deploy.sh [frontend|backend|compiler|all]

set -e

echo "🚀 Starting AlgoNest Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
COMPILER_DIR="compiler"
BUILD_DIR="dist"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to deploy frontend
deploy_frontend() {
    print_status "Building frontend for production..."
    cd $FRONTEND_DIR
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Build for production
    print_status "Running production build..."
    npm run build
    
    if [ -d "$BUILD_DIR" ]; then
        print_status "Frontend built successfully in $BUILD_DIR/"
        print_status "Ready to deploy to Netlify!"
        print_warning "Remember to set environment variables in Netlify:"
        echo "  VITE_SERVER=https://your-ec2-domain.com"
        echo "  VITE_COMPILER=https://your-ec2-domain.com/compiler"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Function to prepare backend for deployment
prepare_backend() {
    print_status "Preparing backend for production..."
    cd $BACKEND_DIR
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Create production .env template if it doesn't exist
    if [ ! -f ".env.production" ]; then
        print_status "Creating production .env template..."
        cat > .env.production << EOF
# Production Environment Variables for AlgoNest Backend
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/algonest
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here-change-this
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
NODE_ENV=production
CORS_ORIGIN=https://your-netlify-app.netlify.app
EOF
        print_warning "Please update .env.production with your actual values!"
    fi
    
    print_status "Backend ready for deployment to EC2!"
    cd ..
}

# Function to prepare compiler for deployment
prepare_compiler() {
    print_status "Preparing compiler for production..."
    cd $COMPILER_DIR
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing compiler dependencies..."
        npm install
    fi
    
    # Create production .env template if it doesn't exist
    if [ ! -f ".env.production" ]; then
        print_status "Creating production .env template..."
        cat > .env.production << EOF
# Production Environment Variables for AlgoNest Compiler
NODE_ENV=production
PORT=9000
CORS_ORIGIN=https://your-netlify-app.netlify.app
EOF
        print_warning "Please update .env.production with your actual values!"
    fi
    
    print_status "Compiler ready for deployment to EC2!"
    cd ..
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    if [ -d "$FRONTEND_DIR/$BUILD_DIR" ]; then
        echo -e "${GREEN}✅ Frontend${NC}: Built and ready for Netlify"
    else
        echo -e "${RED}❌ Frontend${NC}: Not built"
    fi
    
    if [ -f "$BACKEND_DIR/.env.production" ]; then
        echo -e "${GREEN}✅ Backend${NC}: Ready for EC2 deployment"
    else
        echo -e "${RED}❌ Backend${NC}: Not prepared"
    fi
    
    if [ -f "$COMPILER_DIR/.env.production" ]; then
        echo -e "${GREEN}✅ Compiler${NC}: Ready for EC2 deployment"
    else
        echo -e "${RED}❌ Compiler${NC}: Not prepared"
    fi
}

# Main deployment logic
case "${1:-all}" in
    "frontend")
        deploy_frontend
        ;;
    "backend")
        prepare_backend
        ;;
    "compiler")
        prepare_compiler
        ;;
    "all")
        deploy_frontend
        prepare_backend
        prepare_compiler
        ;;
    *)
        print_error "Invalid option. Use: frontend, backend, compiler, or all"
        exit 1
        ;;
esac

echo ""
show_status
echo ""
print_status "Deployment preparation completed!"
print_warning "Next steps:"
echo "1. Deploy frontend to Netlify (drag & drop $FRONTEND_DIR/$BUILD_DIR/)"
echo "2. Deploy backend & compiler to EC2 (follow DEPLOYMENT_GUIDE.md)"
echo "3. Set up MongoDB Atlas or local MongoDB on EC2"
echo "4. Configure environment variables"
echo "5. Test your production deployment!"
