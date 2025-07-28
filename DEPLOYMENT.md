# Angular Portfolio - Docker & AWS EC2 Deployment

This guide provides complete instructions for deploying your Angular portfolio application using Docker on AWS EC2.

## 🏗️ Architecture Overview

The deployment consists of:
- **Angular SSR Application** (Node.js/Express server)
- **Nginx Reverse Proxy** (SSL termination, static file serving)
- **Docker & Docker Compose** (Containerization)
- **AWS EC2** (Hosting infrastructure)

## 📋 Prerequisites

### Local Development
- Docker Desktop installed
- Node.js 18+ installed
- Git installed

### AWS Deployment
- AWS Account with appropriate permissions
- EC2 Key Pair created
- Domain name (optional, for SSL)

## 🚀 Quick Start - itsmealfred.site

### Server Details
- **Domain**: itsmealfred.site
- **AWS IP**: 13.239.20.18
- **Region**: ap-southeast-2 (Sydney)

### 1. Local Development with Docker

```bash
# Clone the repository
git clone <your-repo-url>
cd my-angular-portfolio

# Build and run with Docker Compose
npm run docker:dev

# Or run individual Docker commands
npm run docker:build
npm run docker:run
```

Access your application at:
- Application: http://localhost:4000
- With Nginx: http://localhost:80

### 2. AWS EC2 Deployment

#### Option A: Automated Deployment

1. **Launch EC2 Instance**
   ```bash
   # Use Terraform (recommended)
   cd aws/
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   terraform init
   terraform plan
   terraform apply
   ```

2. **Connect and Deploy**
   ```bash
   # SSH to your instance
   ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
   
   # Run setup script
   curl -sSL https://raw.githubusercontent.com/yourusername/my-angular-portfolio/main/aws/setup-ec2.sh | bash
   
   # Log out and back in, then deploy
   exit
   ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
   cd ~/apps
   curl -sSL https://raw.githubusercontent.com/yourusername/my-angular-portfolio/main/aws/deploy.sh | bash
   
   # Set up SSL for itsmealfred.site
   curl -sSL https://raw.githubusercontent.com/yourusername/my-angular-portfolio/main/aws/setup-ssl.sh | bash
   ```

#### Option B: Manual Deployment

1. **Launch EC2 Instance**
   - AMI: Amazon Linux 2
   - Instance Type: t3.micro (free tier) or larger
   - Security Group: Allow ports 22, 80, 443, 4000
   - Key Pair: Your existing key pair

2. **Connect to Instance**
   ```bash
   ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
   ```

3. **Setup Environment**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Docker
   sudo yum install -y docker git
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Log out and back in
   exit
   ```

4. **Deploy Application**
   ```bash
   # SSH back in
   ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
   
   # Clone repository
   git clone <your-repo-url>
   cd my-angular-portfolio
   
   # Deploy
   docker-compose up -d
   
   # Set up SSL for itsmealfred.site (after DNS is configured)
   ./aws/setup-ssl.sh
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production:

```env
NODE_ENV=production
PORT=4000
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

### SSL Configuration

1. **Generate SSL Certificate for itsmealfred.site**
   ```bash
   # Using Let's Encrypt (recommended for production)
   # Run the automated SSL setup script
   ./aws/setup-ssl.sh
   
   # Or manually with certbot
   sudo yum install -y python3-pip
   sudo pip3 install certbot
   sudo certbot certonly --standalone -d itsmealfred.site -d www.itsmealfred.site
   
   # Copy certificates
   mkdir ssl
   sudo cp /etc/letsencrypt/live/itsmealfred.site/fullchain.pem ssl/cert.pem
   sudo cp /etc/letsencrypt/live/itsmealfred.site/privkey.pem ssl/key.pem
   sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
   ```

2. **Update nginx.conf**
   - Server name is already configured for itsmealfred.site
   - SSL certificate paths are pre-configured
   - No manual changes needed if using the setup script

### Security Group Configuration

Configure your EC2 Security Group:

| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 22   | TCP      | Your IP | SSH Access |
| 80   | TCP      | 0.0.0.0/0 | HTTP |
| 443  | TCP      | 0.0.0.0/0 | HTTPS |
| 4000 | TCP      | 0.0.0.0/0 | App (optional) |

## 📊 Monitoring & Management

### Health Checks

```bash
# Check application health
curl http://localhost:4000/health

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### Useful Commands

```bash
# Restart services
docker-compose restart

# Update application
git pull origin main
docker-compose up -d --build

# View resource usage
docker stats

# Clean up unused images
docker image prune -f
```

### Monitoring Scripts

The deployment includes monitoring scripts:

```bash
# Health check
./health-check.sh

# System monitoring
./monitor.sh

# View application logs
docker-compose logs -f angular-portfolio
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo netstat -tlnp | grep :80
   sudo kill -9 <process-id>
   ```

2. **Docker Permission Denied**
   ```bash
   sudo usermod -a -G docker $USER
   # Log out and back in
   ```

3. **Application Not Starting**
   ```bash
   # Check logs
   docker-compose logs angular-portfolio
   
   # Check if build was successful
   docker images
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in ssl/cert.pem -text -noout
   
   # Test SSL connection
   openssl s_client -connect your-domain.com:443
   ```

### Log Locations

- Application logs: `docker-compose logs angular-portfolio`
- Nginx logs: `docker-compose logs nginx`
- System logs: `/var/log/messages`

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ec2-user
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd my-angular-portfolio
          git pull origin main
          docker-compose up -d --build
```

## 📈 Performance Optimization

### Production Optimizations

1. **Enable Gzip Compression** (configured in nginx.conf)
2. **Static File Caching** (configured in nginx.conf)
3. **Docker Image Optimization** (multi-stage build)
4. **Log Rotation** (configured in daemon.json)

### Scaling Considerations

- Use Application Load Balancer for multiple instances
- Consider Amazon ECS or EKS for container orchestration
- Implement CloudWatch monitoring
- Use CloudFront CDN for static assets

## 🛡️ Security Best Practices

- ✅ Non-root user in Docker container
- ✅ Security headers in Nginx
- ✅ SSL/TLS encryption
- ✅ Minimal attack surface
- ✅ Regular security updates

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review application logs
3. Verify security group settings
4. Ensure all prerequisites are met

## 📄 License

This deployment configuration is provided as-is for educational and development purposes.
