#!/bin/bash

# SSL Setup Script for itsmealfred.site
# Run this script on your EC2 instance to set up SSL certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN="itsmealfred.site"
WWW_DOMAIN="www.itsmealfred.site"
EMAIL="your-email@example.com"  # Update this with your email

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}🔒 Setting up SSL certificates for $DOMAIN${NC}"

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

# Install Certbot
print_status "Installing Certbot..."
$SUDO yum install -y python3-pip
$SUDO pip3 install certbot

# Stop existing containers to free up port 80
print_status "Stopping containers to free up port 80..."
docker-compose down || true

# Wait a moment for ports to be released
sleep 5

# Request SSL certificate
print_status "Requesting SSL certificate for $DOMAIN and $WWW_DOMAIN..."
$SUDO certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --domains $DOMAIN,$WWW_DOMAIN

# Create ssl directory if it doesn't exist
print_status "Creating SSL directory..."
mkdir -p ssl/

# Copy certificates to ssl directory
print_status "Copying certificates..."
$SUDO cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
$SUDO cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem

# Set proper permissions
$SUDO chown $USER:$USER ssl/cert.pem ssl/key.pem
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem

print_status "✅ SSL certificates installed successfully!"

# Start containers again
print_status "Starting containers with SSL..."
docker-compose up -d

# Wait for services to start
sleep 10

# Test SSL
print_status "Testing SSL configuration..."
if curl -k -s https://$DOMAIN/health > /dev/null; then
    print_status "✅ SSL is working correctly!"
else
    print_warning "⚠️  SSL test failed. Check container logs:"
    docker-compose logs nginx
fi

# Set up automatic renewal
print_status "Setting up automatic certificate renewal..."
echo "0 12 * * * /usr/local/bin/certbot renew --quiet && docker-compose restart nginx" | $SUDO crontab -

print_status "🎉 SSL setup completed!"
echo ""
print_status "Your site should now be available at:"
print_status "  - https://$DOMAIN"
print_status "  - https://$WWW_DOMAIN"
echo ""
print_warning "Certificate renewal is set up to run daily at noon."
print_warning "Certificates will auto-renew 30 days before expiry."

# Display certificate info
print_status "Certificate information:"
openssl x509 -in ssl/cert.pem -text -noout | grep -E "(Subject:|Not After)"
