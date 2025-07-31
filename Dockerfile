# Production-only Dockerfile (no build stage)
# Use this when you've already built the application locally

FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S angular -u 1001

# Copy pre-built application and package files
COPY --chown=angular:nodejs ./dist ./dist
COPY --chown=angular:nodejs ./package*.json ./

# Install only production dependencies (no devDependencies needed)
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Switch to non-root user
USER angular

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/my-angular-portfolio/server/server.mjs"]
