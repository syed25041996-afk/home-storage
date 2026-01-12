# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build -- --configuration production

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Copy Angular build to Nginx
COPY --from=builder /app/dist/home-backup /usr/share/nginx/html

# Optional custom Nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
