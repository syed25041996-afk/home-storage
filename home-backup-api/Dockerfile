FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up dev dependencies (optional)
RUN npm prune --production

# Set working directory to dist
WORKDIR /app/dist

EXPOSE 3000

CMD ["node", "server.js"]