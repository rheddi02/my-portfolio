#!/bin/bash

# EC2 Performance Optimization Script
# Run this to optimize your EC2 instance for Docker workloads

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

echo -e "${GREEN}⚡ Optimizing EC2 for Docker Performance${NC}"

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

# 1. Optimize swap (important for t3.micro)
print_status "Setting up swap space..."
if ! swapon --show | grep -q "/swapfile"; then
    print_status "Creating 2GB swap file..."
    $SUDO fallocate -l 2G /swapfile
    $SUDO chmod 600 /swapfile
    $SUDO mkswap /swapfile
    $SUDO swapon /swapfile
    
    # Make swap permanent
    echo '/swapfile none swap sw 0 0' | $SUDO tee -a /etc/fstab
    
    # Optimize swap usage
    echo 'vm.swappiness=10' | $SUDO tee -a /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' | $SUDO tee -a /etc/sysctl.conf
    
    print_status "✅ Swap configured"
else
    print_status "✅ Swap already configured"
fi

# 2. Optimize Docker daemon
print_status "Optimizing Docker daemon..."
$SUDO mkdir -p /etc/docker

cat << 'EOF' | $SUDO tee /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    },
    "nofile": {
      "Hard": 65536,
      "Name": "nofile",
      "Soft": 65536
    }
  },
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 3
}
EOF

# 3. System optimizations
print_status "Applying system optimizations..."

# Increase file descriptor limits
echo '* soft nofile 65536' | $SUDO tee -a /etc/security/limits.conf
echo '* hard nofile 65536' | $SUDO tee -a /etc/security/limits.conf

# Network optimizations
cat << 'EOF' | $SUDO tee -a /etc/sysctl.conf
# Network optimizations for Docker
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.core.netdev_max_backlog = 5000
EOF

# 4. Enable Docker BuildKit globally
print_status "Enabling Docker BuildKit..."
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
echo 'export COMPOSE_DOCKER_CLI_BUILD=1' >> ~/.bashrc

# 5. Restart Docker with new configuration
print_status "Restarting Docker with optimizations..."
$SUDO systemctl restart docker

# Wait for Docker to start
sleep 5

# 6. Set up Docker cleanup cron job
print_status "Setting up automatic Docker cleanup..."
(crontab -l 2>/dev/null; echo "0 2 * * * docker system prune -f --volumes") | crontab -

# 7. Create monitoring script
print_status "Creating monitoring script..."
cat << 'EOF' > ~/monitor-resources.sh
#!/bin/bash
echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h /
echo ""
echo "Swap Usage:"
swapon --show
echo ""
echo "Docker Stats:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
echo ""
echo "Docker System Info:"
docker system df
EOF

chmod +x ~/monitor-resources.sh

# 8. Display current status
print_status "✅ Optimization completed!"
echo ""
print_status "Current system status:"
echo "Memory: $(free -h | awk '/^Mem:/ {print $2 " total, " $7 " available"}')"
echo "Swap: $(free -h | awk '/^Swap:/ {print $2 " total, " $4 " free"}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $4 " available"}')"

echo ""
print_warning "Recommended actions:"
print_warning "  1. Reboot the instance to apply all optimizations: sudo reboot"
print_warning "  2. Use the fast-deploy.sh script for optimized deployments"
print_warning "  3. Monitor resources with: ./monitor-resources.sh"
print_warning "  4. Consider upgrading to t3.small if still experiencing issues"

echo ""
print_status "BuildKit and optimizations will be active after reboot."
print_status "You can now use the fast deployment script for better performance."
