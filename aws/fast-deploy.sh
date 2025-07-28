#!/bin/bash

# Fast Deployment Script for EC2
# Optimized for performance on smaller EC2 instances

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN_NAME="itsmealfred.site"
AWS_IP="13.239.20.18"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo -e "${GREEN}⚡ Fast Docker Deployment for EC2${NC}"

# Check available resources
print_step "Checking system resources..."
echo "Memory: $(free -h | awk '/^Mem:/ {print $2 " total, " $7 " available"}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $4 " available"}')"

# Clean up to free resources
print_step "Cleaning up to free resources..."
docker system prune -f --volumes 2>/dev/null || true
docker image prune -f 2>/dev/null || true

# Stop any running containers
print_step "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build with optimizations
print_step "Building with performance optimizations..."

# Set Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build only the app first (nginx uses pre-built image)
print_status "Building Angular application (this may take a few minutes)..."
docker-compose build angular-portfolio --no-cache --parallel || {
    print_error "Build failed, trying with reduced memory usage..."
    # If build fails, try with memory limits
    docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
    docker-compose build angular-portfolio --memory=1g --no-cache
}

# Start services strategically
print_step "Starting services..."

# Start app first
print_status "Starting Angular application..."
docker-compose up -d angular-portfolio

# Wait for app to be healthy before starting nginx
print_status "Waiting for application to be ready..."
timeout=180  # 3 minutes timeout
counter=0

while [ $counter -lt $timeout ]; do
    if docker-compose ps | grep -q "angular-portfolio.*Up.*healthy"; then
        print_status "✅ Application is healthy!"
        break
    elif docker-compose ps | grep -q "angular-portfolio.*Up"; then
        echo -n "."
        sleep 5
        counter=$((counter + 5))
    else
        print_error "Application failed to start. Checking logs..."
        docker-compose logs angular-portfolio
        exit 1
    fi
done

if [ $counter -ge $timeout ]; then
    print_error "Application health check timed out. Checking logs..."
    docker-compose logs angular-portfolio
    exit 1
fi

# Now start nginx
print_status "Starting Nginx proxy..."
docker-compose up -d nginx

# Final verification
print_step "Verifying deployment..."
sleep 10

# Check services
print_status "Service status:"
docker-compose ps

# Test endpoints
print_status "Testing endpoints..."
if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    print_status "✅ App health check: PASS"
else
    print_warning "⚠️  App health check: FAIL"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    print_status "✅ Nginx proxy: PASS"
else
    print_warning "⚠️  Nginx proxy: FAIL (might need SSL setup)"
fi

# Show resource usage
print_step "Current resource usage:"
echo "Docker containers:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
print_status "🎉 Fast deployment completed!"
print_status "Application is running on:"
print_status "  - HTTPS: https://$DOMAIN_NAME (after SSL setup)"
print_status "  - HTTP: http://$DOMAIN_NAME"
print_status "  - Direct: http://$AWS_IP:4000"

echo ""
print_warning "Performance tips for t3.micro instances:"
print_warning "  - Monitor memory usage: docker stats"
print_warning "  - Clean up regularly: docker system prune"
print_warning "  - Consider upgrading to t3.small for better performance"

# Show logs (last 10 lines)
echo ""
print_status "Recent logs:"
docker-compose logs --tail=10
