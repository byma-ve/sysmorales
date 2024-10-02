# Dockerfile para BackendApiRest
FROM php:8.2-fpm

# Instalar herramientas necesarias, incluyendo software-properties-common
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

# Modificar la configuración de PHP-FPM para que escuche en todas las interfaces
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Modificar configuración de PHP (cgi.fix_pathinfo=0)
RUN sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /usr/local/etc/php/php.ini

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


