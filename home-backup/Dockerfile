FROM node

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start"]