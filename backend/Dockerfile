# Backend Dockerfile for DrinkAdvisor
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for nodemon in dev mode)
RUN npm ci && npm cache clean --force

# Copy application files
COPY . .

# Expose port
EXPOSE 8080

# For development - this will be overridden by docker-compose command
CMD ["npm", "run", "dev"]
