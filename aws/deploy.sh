#!/bin/bash

# AWS EC2 Docker Deployment Script for Angular Portfolio
# This script automates the deployment process on EC2

set -e

# Configuration
APP_NAME="angular-portfolio"
DOCKER_IMAGE_NAME="angular-portfolio"
DOCKER_CONTAINER_NAME="angular-portfolio-app"
GITHUB_REPO_URL="https://github.com/yourusername/my-angular-portfolio.git"
DOMAIN_NAME="itsmealfred.site"
AWS_IP="13.239.20.18"
APP_PORT="4000"
NGINX_PORT="80"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Angular Portfolio Deployment on AWS EC2${NC}"

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Installing Docker..."
    
    # Update system
    sudo yum update -y
    
    # Install Docker
    sudo yum install -y docker
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add ec2-user to docker group
    sudo usermod -a -G docker ec2-user
    
    print_status "Docker installed successfully. Please log out and log back in for group changes to take effect."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Installing..."
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_status "Docker Compose installed successfully."
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_warning "Git not found. Installing..."
    sudo yum install -y git
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true
docker stop $DOCKER_CONTAINER_NAME || true
docker rm $DOCKER_CONTAINER_NAME || true

# Clean up old images (optional)
print_status "Cleaning up old Docker images..."
docker image prune -f || true

# Clone or update repository
if [ -d "$APP_NAME" ]; then
    print_status "Updating existing repository..."
    cd $APP_NAME
    git pull origin main
else
    print_status "Cloning repository..."
    git clone $GITHUB_REPO_URL $APP_NAME
    cd $APP_NAME
fi

# Build Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE_NAME .

# Start services with Docker Compose
print_status "Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Deployment successful!"
    print_status "Application is running on:"
    print_status "  - HTTPS: https://$DOMAIN_NAME"
    print_status "  - HTTP: http://$DOMAIN_NAME"
    print_status "  - IP HTTPS: https://$AWS_IP"
    print_status "  - IP HTTP: http://$AWS_IP"
    print_status "  - Direct app: http://$AWS_IP:$APP_PORT"
    
    # Show running containers
    echo ""
    print_status "Running containers:"
    docker-compose ps
    
    # Show logs
    echo ""
    print_status "Recent logs:"
    docker-compose logs --tail=20
else
    print_error "❌ Deployment failed. Check logs:"
    docker-compose logs
    exit 1
fi

echo ""
print_status "🎉 Deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "  1. Configure DNS for itsmealfred.site to point to $AWS_IP"
print_warning "  2. Set up SSL certificates for itsmealfred.site in the ssl/ directory"
print_warning "  3. Configure security groups to allow HTTP (80) and HTTPS (443) traffic"
print_warning "  4. Consider using Let's Encrypt for free SSL certificates"
