# Local Build & EC2 Production Deployment Guide

This guide shows how to build your Angular application locally and deploy only the production files to EC2, eliminating the need for resource-intensive builds on the server.

## 🎯 **Why Build Locally?**

### **Benefits:**
- ✅ **Faster deployments**: No build process on EC2
- ✅ **Lower resource usage**: EC2 only runs the application
- ✅ **More reliable**: Your local machine has more resources for building
- ✅ **Faster startup**: Production containers start in seconds
- ✅ **Cost effective**: Can use smaller EC2 instances

### **Trade-offs:**
- ❌ Need to build locally before each deployment
- ❌ Local environment must match production Node.js version
- ❌ Manual deployment process (can be automated with CI/CD)

## 🚀 **Quick Start**

### **1. Build and Deploy in One Command**
```bash
# Update your key path in deploy-to-ec2.sh first
./deploy-to-ec2.sh
```

### **2. Manual Step-by-Step**
```bash
# Build locally
npm run build:ssr

# Deploy to EC2 (updates deploy-to-ec2.sh with your key path)
npm run build-and-deploy
```

## 📁 **What Gets Deployed**

### **Files Sent to EC2:**
- `dist/` - Built Angular application
- `package.json` & `package-lock.json` - For production dependencies
- `Dockerfile.prod` - Production-only Docker configuration
- `docker-compose.prod.yml` - Optimized compose file
- `nginx.conf` - Nginx configuration
- `ssl/` - SSL certificates directory

### **Files NOT Sent:**
- `src/` - Source code
- `node_modules/` - Dependencies (installed on server)
- Development configuration files
- Build tools and Angular CLI

## ⚙️ **Setup Instructions**

### **1. Configure Deployment Script**

Edit `deploy-to-ec2.sh` and update:
```bash
KEY_PATH="~/.ssh/your-actual-key.pem"  # Your EC2 key path
```

### **2. Ensure EC2 is Ready**

Your EC2 instance should have:
- Docker and Docker Compose installed
- Port 22 (SSH) open for deployment
- Ports 80, 443, 4000 open for web traffic

### **3. First-Time Setup on EC2**

```bash
# SSH to EC2 and run initial setup (one time only)
ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
curl -sSL https://raw.githubusercontent.com/rheddi02/my-portfolio/main/aws/setup-ec2.sh | bash
# Logout and login again for Docker group changes
```

## 🔄 **Deployment Process**

### **What Happens During Deployment:**

1. **Local Build**
   - Cleans previous build
   - Installs dependencies
   - Builds Angular SSR application
   - Verifies build success

2. **Package Creation**
   - Copies only production files
   - Creates compressed archive
   - Excludes source code and dev files

3. **Upload to EC2**
   - Tests SSH connection
   - Uploads package via SCP
   - Minimal bandwidth usage (only changed files effectively)

4. **EC2 Deployment**
   - Stops existing services
   - Backs up current deployment
   - Extracts new package
   - Starts services with Docker Compose
   - Verifies health

## 📊 **Performance Comparison**

### **Traditional Docker Build on EC2:**
```
Time: 5-15 minutes
Memory: High (1GB+ during build)
CPU: High during build
Network: Downloads all dependencies
Reliability: Can fail due to resource limits
```

### **Local Build + Production Deploy:**
```
Time: 2-3 minutes total (30s local build + 1-2 min deploy)
Memory: Low on EC2 (<256MB)
CPU: Low on EC2
Network: Only uploads build artifacts (~10-50MB)
Reliability: High (build happens on powerful local machine)
```

## 🛠️ **Development Workflow**

### **Daily Development:**
```bash
# 1. Make your changes locally
# 2. Test locally
npm start

# 3. When ready to deploy
./deploy-to-ec2.sh
```

### **Local Testing:**
```bash
# Test the production build locally
npm run build:ssr
npm run start:prod

# Test with production Docker setup
docker-compose -f docker-compose.prod.yml up
```

## 🔧 **Customization**

### **Modify Deployment Script:**

You can customize `deploy-to-ec2.sh` for your needs:

```bash
# Change remote directory
REMOTE_PATH="/home/ec2-user/custom-path"

# Add pre-deployment hooks
# Custom build commands
npm run custom-build-command

# Add post-deployment hooks
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "custom-command"
```

### **Different Environments:**

Create environment-specific scripts:
- `deploy-to-staging.sh`
- `deploy-to-production.sh`

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **SSH Connection Failed**
   ```bash
   # Check key permissions
   chmod 600 ~/.ssh/your-key.pem
   
   # Verify key path in script
   # Check EC2 security group allows SSH from your IP
   ```

2. **Build Fails Locally**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build:ssr
   ```

3. **Deployment Package Too Large**
   ```bash
   # Check what's being included
   tar -tzf deploy-*.tar.gz | head -20
   
   # Exclude additional files in deploy script
   ```

4. **Service Won't Start on EC2**
   ```bash
   # SSH to EC2 and check logs
   ssh -i ~/.ssh/your-key.pem ec2-user@13.239.20.18
   cd my-angular-portfolio
   docker-compose logs
   ```

## 🔄 **CI/CD Integration**

### **GitHub Actions Example:**

```yaml
name: Build and Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build:ssr
    
    - name: Deploy to EC2
      run: |
        # Configure SSH key
        echo "${{ secrets.EC2_SSH_KEY }}" > key.pem
        chmod 600 key.pem
        
        # Run deployment
        ./deploy-to-ec2.sh
```

## 📈 **Benefits Summary**

- **Faster**: 3x faster than building on EC2
- **Reliable**: No more out-of-memory build failures
- **Efficient**: Minimal EC2 resource usage
- **Scalable**: Easy to deploy to multiple servers
- **Cost-effective**: Can use smaller EC2 instances

This approach is ideal for production deployments where you want maximum reliability and performance with minimal server resources.
