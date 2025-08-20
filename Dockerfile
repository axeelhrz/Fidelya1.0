# Multi-stage build para ambos proyectos
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontendd/package*.json ./
RUN npm ci
COPY frontendd/ ./
RUN npm run build

FROM php:8.2-fpm-alpine AS backend-build
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app/backend
COPY backendd/composer*.json ./
RUN composer install --no-dev --optimize-autoloader

COPY backendd/ ./
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Final stage
FROM nginx:alpine
RUN apk add --no-cache php82 php82-fpm php82-pdo php82-pdo_mysql php82-mbstring php82-xml php82-tokenizer php82-fileinfo

# Copy frontend build
COPY --from=frontend-build /app/frontend/.next /var/www/html/frontend
COPY --from=frontend-build /app/frontend/public /var/www/html/frontend/public

# Copy backend
COPY --from=backend-build /app/backend /var/www/html/backend

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
