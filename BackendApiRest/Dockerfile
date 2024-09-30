# Utilizamos PHP 8.2 con FPM (FastCGI Process Manager) como imagen base
FROM php:8.2-fpm

# Instalamos las extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    php8.2-mysql \
    php8.2-sqlite3 \
    php8.2-curl \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-xmlrpc \
    php8.2-zip \
    && docker-php-ext-install mysqli pdo pdo_mysql pdo_sqlite curl gd mbstring xml xmlrpc zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /var/www/html

# Copiamos los archivos del backend al contenedor
COPY . /var/www/html

# Exponemos el puerto 9000, donde PHP-FPM estará escuchando
EXPOSE 9000

# Arrancamos PHP-FPM
CMD ["php-fpm"]

