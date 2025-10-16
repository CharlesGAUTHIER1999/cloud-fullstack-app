# Étape 1 : Builder avec Composer
FROM composer:2.7 AS build
WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Supprimer le .env local pour laisser Cloud Run gérer les variables d'environnement
RUN rm -f .env

# Installer les dépendances PHP sans les dev
RUN composer install --no-dev --optimize-autoloader

# Étape 2 : Runtime
FROM php:8.3-fpm

# Installer les dépendances système et extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev zip unzip git curl libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers depuis l’étape précédente
COPY --from=build /app ./

# Donner les bons droits
RUN chown -R www-data:www-data storage bootstrap/cache && chmod -R 775 storage bootstrap/cache

# Cloud Run doit écouter sur le port 8080
ENV PORT=8080

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
