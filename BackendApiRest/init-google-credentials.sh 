#!/bin/sh

# Ruta de destino para las credenciales de Google
CREDENTIALS_PATH="/etc/google/bymavearchivos-79d38d06a262.json"

# Verificar si la carpeta /etc/google/ existe, si no, crearla
if [ ! -d "/etc/google" ]; then
  echo "Creando el directorio /etc/google/"
  mkdir -p /etc/google
fi

# Verificar si el archivo de credenciales ya existe
if [ ! -f "$CREDENTIALS_PATH" ]; then
  echo "El archivo de credenciales no existe, creándolo..."
  echo "$GOOGLE_CREDENTIALS" > "$CREDENTIALS_PATH"
  chmod 600 "$CREDENTIALS_PATH"
  chown www-data:www-data "$CREDENTIALS_PATH"
else
  echo "El archivo de credenciales ya existe, omitiendo creación."
fi

# Continuar con el resto de los procesos del contenedor
exec "$@"
