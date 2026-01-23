# Backend Dockerfile for DrinkAdvisor
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# For development - this will be overridden by docker-compose command
CMD ["npm", "run", "dev"]
