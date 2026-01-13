# =========================
# Étape 1 : Build (Composer)
# =========================
FROM composer:2.7 AS build
WORKDIR /app

# Copier le projet
COPY . .

# Ne jamais embarquer .env dans l'image (Cloud Run gère les env vars)
RUN rm -f .env

# Installer les dépendances PHP sans les dev
RUN composer install --no-dev --optimize-autoloader --no-interaction


# =========================
# Étape 2 : Runtime (PHP CLI)
# =========================
FROM php:8.3-cli

# Dépendances système + extensions PHP (MySQL + PostgreSQL)
# ✅ Fix Cloud Build : mbstring nécessite Oniguruma => libonig-dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    git \
    libzip-dev \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        zip \
        gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copier l'app buildée (code + vendor)
COPY --from=build /app ./

# Permissions Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Cloud Run écoute sur 8080
ENV PORT=8080
EXPOSE 8080

# Healthcheck (suppose que /health existe côté routes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

# Optionnel mais propre : exécuter en non-root
USER www-data

# Lancement via serveur PHP (plus simple que "artisan serve")
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT} -t public public/index.php"]