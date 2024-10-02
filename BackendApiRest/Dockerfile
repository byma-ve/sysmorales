# Dockerfile para BackendApiRest
FROM php:8.2-fpm

# Instalar las herramientas básicas y agregar repositorio de PHP
RUN apt-get update && apt-get install -y \
    software-properties-common \
    procps \
    iputils-ping \
    net-tools \
    && add-apt-repository ppa:ondrej/php \
    && apt-get update

# Instalar extensiones de PHP necesarias
RUN apt-get install -y \
    php8.2-mysql \
    php8.2-sqlite3 \
    php8.2-curl \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-xmlrpc \
    php8.2-zip \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev

# Configurar GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Modificar PHP-FPM para que escuche en todas las interfaces
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Configurar cgi.fix_pathinfo a 0 en php.ini
RUN sed -i 's/cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /usr/local/etc/php/php.ini

# Establecemos el directorio de trabajo
WORKDIR /var/www/BackendApiRest

# Copiamos el código de la API al contenedor (dentro de BackendApiRest)
COPY . /var/www/BackendApiRest

# Establecemos los permisos correctos para los archivos
RUN chmod -R 755 /var/www/BackendApiRest \
    && chown -R www-data:www-data /var/www/BackendApiRest

# Copiamos el script de inicialización para Google Credentials
COPY init-google-credentials.sh /usr/local/bin/init-google-credentials.sh
RUN chmod +x /usr/local/bin/init-google-credentials.sh

# Exponemos el puerto 9000
EXPOSE 9000

# Arrancamos PHP-FPM y ejecutamos el script para las credenciales de Google
CMD ["/bin/sh", "-c", "/usr/local/bin/init-google-credentials.sh && php-fpm"]


