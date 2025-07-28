#!/bin/bash

# EC2 Instance Setup Script
# Run this script on a fresh Amazon Linux 2 EC2 instance

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

echo -e "${GREEN}🔧 Setting up EC2 instance for Docker deployment${NC}"

# Update system packages
print_status "Updating system packages..."
sudo yum update -y

# Install essential packages
print_status "Installing essential packages..."
sudo yum install -y git curl wget htop

# Install Docker
print_status "Installing Docker..."
sudo yum install -y docker

# Start and enable Docker
print_status "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
print_status "Adding ec2-user to docker group..."
sudo usermod -a -G docker ec2-user

# Install Docker Compose
print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for debugging if needed)
print_status "Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

# Configure firewall (if iptables is used)
print_status "Configuring firewall rules..."
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 4000 -j ACCEPT

# Create application directory
print_status "Creating application directory..."
mkdir -p ~/apps
cd ~/apps

# Create SSL directory for certificates
print_status "Creating SSL directory..."
mkdir -p ~/apps/ssl

# Set up log rotation for Docker
print_status "Setting up Docker log rotation..."
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker to apply logging configuration
sudo systemctl restart docker

# Create a simple health check script
print_status "Creating health check script..."
cat > ~/apps/health-check.sh << 'EOF'
#!/bin/bash
APP_URL="http://localhost:4000/health"
NGINX_URL="http://localhost:80"

echo "Checking application health..."
if curl -f $APP_URL > /dev/null 2>&1; then
    echo "✅ Application is healthy"
else
    echo "❌ Application health check failed"
fi

if curl -f $NGINX_URL > /dev/null 2>&1; then
    echo "✅ Nginx is healthy"
else
    echo "❌ Nginx health check failed"
fi
EOF

chmod +x ~/apps/health-check.sh

# Create a monitoring script
print_status "Creating monitoring script..."
cat > ~/apps/monitor.sh << 'EOF'
#!/bin/bash
echo "=== Docker Containers ==="
docker ps

echo ""
echo "=== Docker Images ==="
docker images

echo ""
echo "=== System Resources ==="
free -h
df -h

echo ""
echo "=== Docker Logs (last 10 lines) ==="
docker-compose logs --tail=10
EOF

chmod +x ~/apps/monitor.sh

# Display completion message
echo ""
print_status "✅ EC2 instance setup completed!"
echo ""
print_warning "⚠️  IMPORTANT: You need to log out and log back in for Docker group changes to take effect."
echo ""
print_status "Next steps:"
print_status "  1. Log out and log back in: exit"
print_status "  2. Navigate to apps directory: cd ~/apps"
print_status "  3. Run the deployment script: ./deploy.sh"
echo ""
print_status "Useful commands:"
print_status "  - Check health: ./health-check.sh"
print_status "  - Monitor system: ./monitor.sh"
print_status "  - View logs: docker-compose logs -f"
print_status "  - Restart services: docker-compose restart"
