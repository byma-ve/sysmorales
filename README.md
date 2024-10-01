# sysmorales


## Índice

1. [Configuracion Ruta Api Rest](#configuracion-ruta-api-rest)
2. [Configuracion de Host MySQL](#configuracion-de-host-mysql)
2. [Configuracion de Carpetas en Google Drive](#configuracion-de-host-mysql)

## Configuracion Ruta Api Rest

   - Se tiene que reemplazar la ruta de desarrollo por la ruta del dominio `https://sistema.transportesmorales-logistik.com/BackendApiRest/`

## Configuracion de Host MySQL

   - Se tiene que reemplazar el host de mysql `mysql:host=161.132.42.146` - La IP del servidor donde esta la base de datos
   - Entrar a la carpeta services y al archivo `env.php` del backend, y cambiar las credenciales de la base de datos.

## Configuracion de Carpetas en Google Drive

   - Accede a la carpeta principal de Google Drive
   - Copia el ID de la carpeta.
   - Entrar a la carpeta services y al archivo `env.php` del backend, y pegar el ID en la variable `ID_CARPETA_PADRE_DRIVE`.
   - Asegúrate de compartir la carpeta con la cuenta de correo asociada a las credenciales.
   - Activa el acceso para que cualquier persona con el enlace pueda visualizar la carpeta.
