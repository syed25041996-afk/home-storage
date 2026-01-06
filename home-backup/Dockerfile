FROM node

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]