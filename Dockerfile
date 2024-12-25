# Use the latest Node.js image as the base image
FROM node:latest

# Set npm to use the official registry and clear the npm cache
RUN npm config set registry https://registry.npmjs.org/ \
  && npm cache clean --force

# Install necessary dependencies for running Xvfb, Puppeteer, and Chrome
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  apt-transport-https \
  xvfb \
  libnss3 \
  libxss1 \
  libasound2 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libxrandr2 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libpango1.0-0 \
  libfontconfig1 \
  libgbm1 \
  libx11-xcb1 \
  libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to download Chromium (not use system-installed Chrome)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# Set up the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies (forces Puppeteer to cache Chromium)
RUN npm install --force

# Check if Chromium is present in Puppeteer cache
RUN if [ ! -f /root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome ]; then \
  echo "Chromium not found!"; exit 1; \
  fi

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start Xvfb and the Node.js app
CMD ["sh", "-c", "Xvfb :99 -screen 0 1920x1080x24 & sleep 5 && npm run start"]
