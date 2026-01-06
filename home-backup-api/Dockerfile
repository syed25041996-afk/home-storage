FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy dist folder with server.js
COPY dist/ ./dist/

# Set working directory to dist if that's where server.js is
WORKDIR /app/dist

EXPOSE 3000

CMD ["node", "server.js"]
