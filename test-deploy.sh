#!/bin/bash

# Test Deployment Package Script
# Verifies the deployment package contains all required files

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

echo -e "${GREEN}🧪 Testing Deployment Package${NC}"

# Step 1: Build locally
print_status "Building application locally..."
npm run build:ssr

# Step 2: Create test deployment package
print_status "Creating test deployment package..."

DEPLOY_DIR="test-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy files exactly as deployment script does
mkdir -p $DEPLOY_DIR/dist/
cp -r dist/* $DEPLOY_DIR/dist/
cp package*.json $DEPLOY_DIR/
cp Dockerfile.prod $DEPLOY_DIR/Dockerfile
cp docker-compose.prod.yml $DEPLOY_DIR/docker-compose.yml
cp nginx.conf $DEPLOY_DIR/
mkdir -p $DEPLOY_DIR/ssl

# Step 3: Test the package structure
print_status "Verifying package structure..."

cd $DEPLOY_DIR

# Check required files exist
REQUIRED_FILES=(
    "dist/my-angular-portfolio/server/server.mjs"
    "package.json"
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
)

ALL_GOOD=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        print_status "✅ Found: $file"
    else
        print_error "❌ Missing: $file"
        ALL_GOOD=false
    fi
done

# Step 4: Test Docker build
if [ "$ALL_GOOD" = true ]; then
    print_status "Testing Docker build..."
    
    if docker build -t test-angular-portfolio . --no-cache; then
        print_status "✅ Docker build successful!"
        
        # Test container start
        print_status "Testing container startup..."
        CONTAINER_ID=$(docker run -d -p 4001:4000 test-angular-portfolio)
        
        # Wait a moment
        sleep 10
        
        # Test health check
        if curl -f http://localhost:4001/health > /dev/null 2>&1; then
            print_status "✅ Container health check successful!"
        else
            print_warning "⚠️  Health check failed, checking logs..."
            docker logs $CONTAINER_ID
        fi
        
        # Cleanup
        docker stop $CONTAINER_ID > /dev/null
        docker rm $CONTAINER_ID > /dev/null
        docker rmi test-angular-portfolio > /dev/null
        
    else
        print_error "❌ Docker build failed!"
        ALL_GOOD=false
    fi
fi

# Step 5: Cleanup
cd ..
rm -rf $DEPLOY_DIR

# Results
echo ""
if [ "$ALL_GOOD" = true ]; then
    print_status "🎉 All tests passed! Deployment package is ready."
    print_status "You can now run: ./deploy-to-ec2.sh"
else
    print_error "❌ Tests failed. Please fix the issues above."
    exit 1
fi
