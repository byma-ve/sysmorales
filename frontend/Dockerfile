# Fase de construcción
FROM node:18 AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos necesarios y las dependencias de Node.js
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos el resto del código fuente del frontend
COPY . .

# Ejecutamos el build de la aplicación con Vite
RUN npm run build

# Exponemos el build generado
EXPOSE 3000
