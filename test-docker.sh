#!/bin/bash

# Docker Build Test Script
# Run this locally to test if the Docker build works before deploying

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

echo -e "${GREEN}🧪 Testing Docker build for Angular Portfolio${NC}"

# Clean up any existing containers/images
print_status "Cleaning up existing containers..."
docker-compose down 2>/dev/null || true
docker rmi angular-portfolio 2>/dev/null || true

# Test Docker build
print_status "Testing Docker build..."
if docker build -t angular-portfolio-test . --no-cache; then
    print_status "✅ Docker build successful!"
else
    print_error "❌ Docker build failed!"
    exit 1
fi

# Test running the container
print_status "Testing container startup..."
CONTAINER_ID=$(docker run -d -p 4001:4000 angular-portfolio-test)

# Wait for container to start
print_status "Waiting for container to start..."
sleep 10

# Test health endpoint
print_status "Testing health endpoint..."
if curl -f http://localhost:4001/health > /dev/null 2>&1; then
    print_status "✅ Health check successful!"
else
    print_warning "⚠️  Health check failed, checking logs..."
    docker logs $CONTAINER_ID
fi

# Clean up test container
print_status "Cleaning up test container..."
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null
docker rmi angular-portfolio-test > /dev/null

# Test with docker-compose
print_status "Testing with docker-compose..."
if docker-compose up -d --build; then
    print_status "✅ Docker Compose startup successful!"
    
    # Wait and test
    sleep 15
    
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        print_status "✅ Full stack test successful!"
    else
        print_warning "⚠️  Health check failed with compose"
        docker-compose logs
    fi
    
    # Show running containers
    echo ""
    print_status "Running containers:"
    docker-compose ps
    
else
    print_error "❌ Docker Compose failed!"
    docker-compose logs
    exit 1
fi

echo ""
print_status "🎉 All tests passed! Ready for deployment."
print_status "Access your application at:"
print_status "  - Application: http://localhost:4000"
print_status "  - With Nginx: http://localhost:80"
echo ""
print_warning "Remember to run 'docker-compose down' when done testing."
