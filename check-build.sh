#!/bin/bash

# Pre-deployment build check
# Ensures the application is built locally before Docker operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}🔍 Checking build requirements...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if dist folder exists and has content
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    print_warning "No build found. Building application locally..."
    
    # Clean any partial builds
    rm -rf dist/
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm ci
    fi
    
    # Build the application
    print_status "Building for production..."
    npm run build:ssr
    
    # Verify build succeeded
    if [ ! -d "dist/my-angular-portfolio" ]; then
        print_error "Build failed - expected dist/my-angular-portfolio directory not found"
        exit 1
    fi
    
    print_status "✅ Build completed successfully"
else
    print_status "✅ Build already exists"
fi

# Verify the build contains required files
if [ ! -f "dist/my-angular-portfolio/server/server.mjs" ]; then
    print_error "Build is incomplete - server.mjs not found"
    print_warning "Try running: npm run build:ssr"
    exit 1
fi

print_status "✅ All build requirements satisfied"
echo ""
echo "You can now run:"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo "  OR"
echo "  ./deploy-to-ec2.sh"
