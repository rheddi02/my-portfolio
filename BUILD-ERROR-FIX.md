# Build Context Error Fix

## 🔍 **The Problem**

The error `COPY failed: file not found in build context or excluded by .dockerignore: stat dist: file does not exist` occurs when:

1. **Using production Dockerfile** (`Dockerfile.prod`) without building locally first
2. **Missing dist folder** that contains the built Angular application
3. **Running wrong Docker command** for your current setup

## ✅ **Solution Options**

### **Option 1: Local Build + Production Deploy (Recommended)**

This is the fastest and most efficient approach:

```bash
# Step 1: Build locally first
npm run build:ssr

# Step 2: Verify build exists
npm run check-build

# Step 3: Deploy with production Docker setup
npm run docker:prod-only

# OR deploy to EC2
npm run build-and-deploy
```

### **Option 2: Use Development Docker (Builds on Container)**

If you want Docker to handle the build process:

```bash
# Use the original docker-compose (builds from source)
docker-compose up -d --build
```

### **Option 3: Automated Check and Build**

The smart way - automatically builds if needed:

```bash
# This will build if needed, then start production containers
npm run docker:prod-only
```

## 🚀 **Quick Fix Commands**

### **If you're getting the build error right now:**

```bash
# Clean and rebuild
rm -rf dist/
npm run build:ssr

# Verify build worked
ls -la dist/my-angular-portfolio/

# Now try Docker again
docker-compose -f docker-compose.prod.yml up -d
```

### **For EC2 deployment:**

```bash
# The deploy script handles building automatically
./deploy-to-ec2.sh
```

## 📋 **Understanding the Two Approaches**

### **Approach 1: Build in Docker (Original)**
- **File**: `Dockerfile` + `docker-compose.yml`
- **Process**: Docker downloads dependencies and builds Angular
- **Time**: 5-15 minutes on EC2
- **Memory**: High (1GB+)
- **Use when**: You want everything in containers

```bash
# Use this approach
docker-compose up -d --build
```

### **Approach 2: Build Locally (New/Recommended)**
- **File**: `Dockerfile.prod` + `docker-compose.prod.yml`
- **Process**: Build locally, Docker only runs the app
- **Time**: 2-3 minutes total
- **Memory**: Low (<256MB)
- **Use when**: You want fast, efficient deployments

```bash
# Use this approach
npm run build:ssr  # Build locally first
npm run docker:prod-only  # Then deploy
```

## 🔧 **File Structure After Build**

When you run `npm run build:ssr`, you should see:

```
dist/
└── my-angular-portfolio/
    ├── browser/          # Client-side files
    ├── server/           # Server-side files
    │   └── server.mjs    # Main server file
    └── ...
```

## 🛠️ **Troubleshooting**

### **Build fails locally:**
```bash
# Clear everything and start fresh
rm -rf node_modules dist .angular
npm install
npm run build:ssr
```

### **Docker build still fails:**
```bash
# Make sure you're using the right Dockerfile
docker build -f Dockerfile.prod -t angular-portfolio .

# Check if dist folder exists
ls -la dist/
```

### **Want to use original Docker build:**
```bash
# Use the original approach (builds in Docker)
docker-compose -f docker-compose.yml up -d --build
```

## 📝 **Scripts Summary**

| Command | What it does |
|---------|-------------|
| `npm run build:ssr` | Build Angular app locally |
| `npm run check-build` | Verify build exists, build if needed |
| `npm run docker:prod-only` | Run production containers (needs local build) |
| `npm run build-and-deploy` | Build locally + deploy to EC2 |
| `docker-compose up -d --build` | Build everything in Docker (slower) |

## 💡 **Best Practice**

For production deployments, especially on resource-limited EC2 instances:

1. **Build locally** with `npm run build:ssr`
2. **Deploy with** `npm run docker:prod-only` or `./deploy-to-ec2.sh`
3. **Use the check script** to avoid build context errors

This approach is faster, more reliable, and uses fewer server resources.
