# Dockerfile para BackendApiRest
FROM php:8.2-fpm

# Instalar librerías y dependencias necesarias para PHP y GD
RUN apt-get update && apt-get install -y \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Instalar otras herramientas necesarias
RUN apt-get update && apt-get install -y \
    lsb-release \
    apt-transport-https \
    ca-certificates \
    procps \
    iputils-ping \
    net-tools \
    curl \
    zip \
    unzip

# Modificar la configuración de PHP-FPM para escuchar en todas las interfaces
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Establecer el directorio de trabajo
WORKDIR /var/www/BackendApiRest

# Copiar código fuente de la API
COPY . /var/www/BackendApiRest

# Configurar permisos correctos para los archivos
RUN chmod -R 755 /var/www/BackendApiRest \
    && chown -R www-data:www-data /var/www/BackendApiRest

# Copiar script de inicialización para Google Credentials
COPY init-google-credentials.sh /usr/local/bin/init-google-credentials.sh
RUN chmod +x /usr/local/bin/init-google-credentials.sh

# Exponer el puerto 9000
EXPOSE 9000

# Iniciar PHP-FPM y ejecutar script de credenciales
CMD ["/bin/sh", "-c", "/usr/local/bin/init-google-credentials.sh && php-fpm"]

