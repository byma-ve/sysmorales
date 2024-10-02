# Dockerfile para BackendApiRest
FROM php:8.2-fpm

# Instalamos las extensiones de PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Establecemos el directorio de trabajo
WORKDIR /var/www/BackendApiRest

# Copiamos el código de la API al contenedor (dentro de BackendApiRest)
COPY . /var/www/BackendApiRest

# Copiamos el script de inicialización para Google Credentials
COPY init-google-credentials.sh /usr/local/bin/init-google-credentials.sh
RUN chmod +x /usr/local/bin/init-google-credentials.sh

# Exponemos el puerto 9000
EXPOSE 9000

# Arrancamos PHP-FPM y ejecutamos el script para las credenciales de Google
CMD ["/bin/sh", "-c", "/usr/local/bin/init-google-credentials.sh && php-fpm"]

