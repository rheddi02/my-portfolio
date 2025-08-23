#!/bin/bash

# Local Build and Deploy Script
# Build locally and deploy only production files to EC2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
EC2_HOST="ec2-13-239-20-18.ap-southeast-2.compute.amazonaws.com"
EC2_USER="ubuntu"
KEY_PATH="~/.ssh/aws-key.pem"  # Update this
REMOTE_PATH="/home/ubuntu/"

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

echo -e "${GREEN}🚀 Local Build & EC2 Deploy${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Clean and build locally
print_step "Building application locally..."
print_status "Cleaning previous build..."
rm -rf dist/

print_status "Installing dependencies..."
npm install --legacy-peer-deps

print_status "Building for production..."
npm run build:ssr

# Verify build
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_status "✅ Local build completed successfully"

# Step 2: Prepare deployment files
print_step "Preparing deployment files..."

# Create temporary deployment directory
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy only necessary files
print_status "Copying production files..."
# Create dist directory and copy contents to maintain structure
mkdir -p $DEPLOY_DIR/dist/
cp -r dist/* $DEPLOY_DIR/dist/
cp package*.json $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/Dockerfile  # Copy as Dockerfile for docker-compose
cp docker-compose.yml $DEPLOY_DIR/docker-compose.yml  # Copy as docker-compose.yml
cp nginx.conf $DEPLOY_DIR/

# Note: SSL certificates are no longer packaged or stored in the repo.
# Nginx now reads certificates directly from /etc/letsencrypt on the host via bind mounts.

# Create deployment archive
print_status "Creating deployment archive..."
tar -czf ${DEPLOY_DIR}.tar.gz -C $DEPLOY_DIR .
rm -rf $DEPLOY_DIR

print_status "✅ Deployment package created: ${DEPLOY_DIR}.tar.gz"

# Step 3: Upload to EC2
print_step "Uploading to EC2..."

# Check if we can connect to EC2
if ! ssh -i $KEY_PATH -o ConnectTimeout=10 $EC2_USER@$EC2_HOST "echo 'Connection test'" > /dev/null 2>&1; then
    print_error "Cannot connect to EC2. Please check:"
    print_error "  - Key path: $KEY_PATH"
    print_error "  - EC2 host: $EC2_HOST"
    print_error "  - Security group allows SSH from your IP"
    exit 1
fi

print_status "Uploading deployment package..."
scp -i $KEY_PATH ${DEPLOY_DIR}.tar.gz $EC2_USER@$EC2_HOST:/tmp/

# Step 4: Deploy on EC2
print_step "Deploying on EC2..."

ssh -i $KEY_PATH $EC2_USER@$EC2_HOST << 'EOF'
set -e

echo "🔄 Starting deployment on EC2..."

# Stop existing services
echo "Stopping existing services..."
cd /home/ubuntu/my-portfolio 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Clean up old containers and images to prevent caching issues
echo "Cleaning up old containers and images..."
docker container prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true

# Backup current deployment (if exists)
if [ -d "/home/ubuntu/my-portfolio" ]; then
    echo "Backing up current deployment..."
    rm -rf /home/ubuntu/my-portfolio
    # mv /home/ubuntu/my-portfolio /home/ubuntu/my-portfolio-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi

# Extract new deployment
echo "Extracting new deployment..."
mkdir -p /home/ubuntu/my-portfolio
cd /home/ubuntu/my-portfolio
tar -xzf /tmp/deploy-*.tar.gz
rm /tmp/deploy-*.tar.gz

# Start services
echo "Starting services..."
docker-compose build --no-cache angular-portfolio
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 20

# Check health
echo "Checking service health..."
if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
    
    # Verify new deployment is serving
    echo "Verifying deployment version..."
    NEW_BUNDLE=$(ls dist/my-angular-portfolio/browser/main-*.js 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "unknown")
    echo "Expected bundle: $NEW_BUNDLE"
    
    SERVED_BUNDLE=$(curl -s http://localhost:4000 | grep -o 'main-[A-Z0-9]*\.js' | head -1 2>/dev/null || echo "unknown")
    echo "Served bundle: $SERVED_BUNDLE"
    
    if [ "$NEW_BUNDLE" = "$SERVED_BUNDLE" ]; then
        echo "✅ New deployment is being served correctly!"
    else
        echo "⚠️  Bundle mismatch - forcing container restart..."
        docker-compose restart angular-portfolio
        sleep 10
    fi
else
    echo "⚠️  Health check failed, checking logs..."
    docker-compose logs --tail=20
fi

echo "✅ Deployment completed on EC2!"
EOF

# Cleanup local files
rm -f ${DEPLOY_DIR}.tar.gz

print_step "Verifying deployment..."

# Test the deployment
if curl -f http://$EC2_HOST:4000/health > /dev/null 2>&1; then
    print_status "✅ Remote health check successful!"
else
    print_warning "⚠️  Remote health check failed (might be security group blocking port 4000)"
fi

echo ""
print_status "🎉 Deployment completed successfully!"
print_status "Your application is running at:"
print_status "  - https://itsmealfred.site (SSL enabled)"
print_status "  - http://$EC2_HOST:4000 (direct access if port 4000 is open)"

echo ""
print_warning "Next steps:"
print_warning "  1. Monitor logs: ssh -i $KEY_PATH $EC2_USER@$EC2_HOST 'cd my-portfolio && docker-compose logs -f'"
print_warning "  2. Certificate will auto-renew before Oct 26, 2025"

echo ""
print_status "To update later, just run this script again!"
