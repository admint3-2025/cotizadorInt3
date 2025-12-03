# Use Debian base with Node.js
FROM node:20-bookworm

# Install Chromium dependencies (not Chromium itself, Puppeteer will download it)
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies and Puppeteer Chrome
RUN npm ci && \
    npx puppeteer browsers install chrome && \
    npm cache clean --force

# Copy application files
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
