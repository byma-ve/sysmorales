# Utilizamos PHP 8.2 con FPM (FastCGI Process Manager) como imagen base
FROM php:8.2-fpm

# Instalamos las extensiones de PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /var/www/html

# Copiamos los archivos del backend al contenedor
COPY . /var/www/html

# Exponemos el puerto 9000, donde PHP-FPM estará escuchando
EXPOSE 9000

# Arrancamos PHP-FPM
CMD ["php-fpm"]


