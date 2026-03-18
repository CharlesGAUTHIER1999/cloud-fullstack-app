# =========================
# Étape 1 : Build Composer
# =========================
FROM composer:2.7 AS build

WORKDIR /app

# Copier seulement les fichiers Composer d'abord
COPY composer.json composer.lock ./

# Installer les dépendances prod sans scripts
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts

# Copier ensuite le reste du projet
COPY . .

# Ne jamais embarquer .env
RUN rm -f .env

# Regénérer l'autoload proprement
RUN composer dump-autoload --optimize --no-dev


# =========================
# Étape 2 : Runtime PHP
# =========================
FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    git \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=build /app ./

RUN php artisan config:clear \
 && php artisan cache:clear \
 && php artisan route:clear \
 && php artisan config:cache

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

USER www-data

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT} -t public public/index.php"]