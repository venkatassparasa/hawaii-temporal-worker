FROM node:20-bullseye-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S temporal -u 1001

# Change ownership of the app directory
RUN chown -R temporal:nodejs /app
USER temporal

# Expose health check port (optional)
EXPOSE 8080

# Start the worker
CMD ["npm", "start"]
