# Use official Puppeteer image with Chrome pre-installed
FROM ghcr.io/puppeteer/puppeteer:22.0.0

# Set working directory
WORKDIR /usr/src/app

# Switch to root to install dependencies
USER root

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy application files
COPY . .

# Build the frontend
RUN npm run build

# Switch back to pptruser for security
USER pptruser

# Expose port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
