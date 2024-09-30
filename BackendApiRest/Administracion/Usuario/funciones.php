<?php
function desconectado($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE usuarios SET conectado = '0' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function conectado($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE usuarios SET conectado = '1' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function obtenerUsuariosNotificaciones()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT * FROM usuarios WHERE cargo_usuario != 'conductor' AND cargo_usuario != 'auxiliar' AND estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function datosConductor($id)
{
    $bd = obtenerConexion();
    $usuario = $bd->prepare(
        "SELECT * FROM usuarios
        WHERE id = :id;
        "
    );
    $usuario->bindParam(':id', $id);
    $usuario->execute();
    $data = $usuario->fetch(PDO::FETCH_ASSOC);

    return $data;
}
function datosAuxiliar($id)
{
    $bd = obtenerConexion();
    $usuario = $bd->prepare(
        "SELECT * FROM usuarios
        WHERE id = :id;
        "
    );
    $usuario->bindParam(':id', $id);
    $usuario->execute();
    $data = $usuario->fetch(PDO::FETCH_ASSOC);

    return $data;
}
function obtenerConductores()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT * FROM usuarios WHERE cargo_usuario = 'conductor' AND estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function obtenerAuxiliares()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT * FROM usuarios WHERE cargo_usuario = 'auxiliar' AND estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function obtenerUsuario($dni_usuario)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare(
        "SELECT id,dni_usuario,brevete_usuario,telefono_usuario,email_usuario,
    CONCAT(UCASE(SUBSTRING(colaborador_usuario, 1, 1)), LCASE(SUBSTRING(colaborador_usuario, 2))) AS colaborador_usuario,
    CONCAT(UCASE(SUBSTRING(area_usuario, 1, 1)), LCASE(SUBSTRING(area_usuario, 2))) AS area_usuario,
	CONCAT(UCASE(SUBSTRING(cargo_usuario, 1, 1)), LCASE(SUBSTRING(cargo_usuario, 2))) AS cargo_usuario,
    foto_usuario 
    FROM usuarios WHERE dni_usuario = :nombreUsuario"
    );
    $consulta->bindParam(':nombreUsuario', $dni_usuario);
    $consulta->execute();
    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);
    return $usuario;
}

function eliminarUsuario($id)
{
    $bd = obtenerConexion();
    $validarVendedor = $bd->prepare("SELECT COUNT(*) as total FROM clientes
    WHERE id_vendedor_usuario_cliente = ?");
    $validarVendedor->execute([$id]);
    $resultadoVendedor = $validarVendedor->fetch(PDO::FETCH_ASSOC);

    if ($resultadoVendedor['total'] > 0) {
        return ['success' => false, 'message' => '¡Se tiene que cambiar de vendedor del Cliente que tiene asignado!'];
    }

    $sentencia = $bd->prepare("UPDATE usuarios SET estado = '0' WHERE id = ?");
    $result = $sentencia->execute([$id]);

    if ($result) {
        return ['success' => true, 'message' => 'Eliminado Correctamente!'];
    } else {
        return ['success' => false, 'message' => '¡No se pudo eliminar!'];
    }

}

function actualizarUsuario($usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s");

    $bd = obtenerConexion();

    $validarVendedor = $bd->prepare("SELECT COUNT(*) as total FROM clientes
    WHERE id_vendedor_usuario_cliente = ?");
    $validarVendedor->execute([$usuario->id]);
    $resultadoVendedor = $validarVendedor->fetch(PDO::FETCH_ASSOC);

    if ($resultadoVendedor['total'] > 0 && $usuario->cargo_usuario != 'vendedor') {
        return ['success' => false, 'message' => '¡Se tiene que cambiar de vendedor del Cliente que tiene asignado!'];
    }

    if (!empty($usuario->foto_usuario)) {
        $rutaDB = guardarImagen($usuario->foto_usuario, $usuario->colaborador_usuario, $usuario->dni_usuario);
        $sentencia = 'foto_usuario = ?,';
    } else {
        $sentencia = '';
        $rutaDB = '';
    }

    $sentencia = $bd->prepare("UPDATE usuarios SET clave_usuario = ?, colaborador_usuario = ?, brevete_usuario = ?, telefono_usuario = ?, email_usuario = ?, area_usuario = ?, cargo_usuario = ?, $sentencia fecha_actualizado = ? WHERE id = ?");


    if ($rutaDB != '') {
        $result = $sentencia->execute([
            $usuario->clave_usuario,
            $usuario->colaborador_usuario,
            $usuario->brevete_usuario,
            $usuario->telefono_usuario,
            $usuario->email_usuario,
            $usuario->area_usuario,
            $usuario->cargo_usuario,
            $rutaDB,
            $fecha_dia_hora,
            $usuario->id
        ]);
        if ($result) {
            return ['success' => true, 'message' => '¡Actualizado Correctamente!'];
        } else {
            return ['success' => false, 'message' => '¡No se pudo actualizar!'];
        }
    } else {
        $result = $sentencia->execute([
            $usuario->clave_usuario,
            $usuario->colaborador_usuario,
            $usuario->brevete_usuario,
            $usuario->telefono_usuario,
            $usuario->email_usuario,
            $usuario->area_usuario,
            $usuario->cargo_usuario,
            $fecha_dia_hora,
            $usuario->id
        ]);
        if ($result) {
            return ['success' => true, 'message' => '¡Actualizado Correctamente!'];
        } else {
            return ['success' => false, 'message' => '¡No se pudo actualizar!'];
        }
    }
}

function exportarUsuarios()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT dni_usuario, clave_usuario, colaborador_usuario,brevete_usuario,telefono_usuario,email_usuario,area_usuario
    ,cargo_usuario FROM usuarios WHERE estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function obtenerUsuarios()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT id, dni_usuario, clave_usuario, colaborador_usuario,brevete_usuario,telefono_usuario,email_usuario,area_usuario
    ,cargo_usuario,foto_usuario,fecha_creado,fecha_actualizado FROM usuarios WHERE estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function obtenerVendedores()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT id, dni_usuario, clave_usuario, colaborador_usuario,brevete_usuario,telefono_usuario,email_usuario,area_usuario
    ,cargo_usuario,foto_usuario,fecha_creado,fecha_actualizado FROM usuarios WHERE cargo_usuario = 'vendedor' AND estado = '1' ORDER BY id DESC");
    return $sentencia->fetchAll();
}

function crearCarpetaSinoExiste($service, $idCarpetaPadre, $nombreCarpeta) {
    $carpetasExistentes = $service->files->listFiles(array(
        'q' => "name='" . $nombreCarpeta . "' and '" . $idCarpetaPadre . "' in parents",
        'fields' => 'files(id, name)'
    ))->getFiles();
    if (count($carpetasExistentes) > 0) {
        return $carpetasExistentes[0]->getId();
    } else {
        $carpeta = new Google_Service_Drive_DriveFile();
        $carpeta->setName($nombreCarpeta);
        $carpeta->setMimeType('application/vnd.google-apps.folder');
        $carpeta->setParents(array($idCarpetaPadre));

        $carpetaCreada = $service->files->create($carpeta, array(
            'fields' => 'id'
        ));
        return $carpetaCreada->id;
    }
}

function reemplazarArchivoSiExiste($service, $idCarpeta, $nombreArchivo) {
    // Buscar archivos existentes con el mismo nombre en la carpeta
    $archivosExistentes = $service->files->listFiles(array(
        'q' => "name='{$nombreArchivo}' and '{$idCarpeta}' in parents and trashed=false",
        'fields' => 'files(id, name)'
    ))->getFiles();

    // Si existe un archivo con el mismo nombre, lo eliminamos
    if (count($archivosExistentes) > 0) {
        foreach ($archivosExistentes as $archivo) {
            $service->files->delete($archivo->getId());
        }
    }
}

function guardarImagen($foto_usuario, $nombreColaborador, $dniUsuario)
{
    require_once('../../services/api_google_drive/api-google/vendor/autoload.php');
    putenv('GOOGLE_APPLICATION_CREDENTIALS=/etc/google/bymavearchivos-79d38d06a262.json');
    $imagen_temporal = $foto_usuario['tmp_name'];
    $imagen = imagecreatefromstring(file_get_contents($imagen_temporal));
    $imagen_nueva = imagecreatetruecolor(180, 180); // Cambio aquí
    imagecopyresampled($imagen_nueva, $imagen, 0, 0, 0, 0, 180, 180, imagesx($imagen), imagesy($imagen)); // Y aquí
    $ruta_imagen = $dniUsuario . '_' . $nombreColaborador . '.jpg';
    imagejpeg($imagen_nueva, $ruta_imagen, 100);
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->SetScopes(['https://www.googleapis.com/auth/drive.file']);
    $service = new Google_Service_Drive($client);
    $idCarpetaPadre = obtenerVariableDelEntorno("ID_CARPETA_PADRE_DRIVE");
    $IdCarpeta = crearCarpetaSinoExiste($service, $idCarpetaPadre, 'Imágenes Usuarios');
    $nombreArchivo = "$dniUsuario / $nombreColaborador";
    reemplazarArchivoSiExiste($service, $IdCarpeta, $nombreArchivo);
    $file = new Google_Service_Drive_DriveFile();
    $file->setName($nombreArchivo);
    $file->setParents([$IdCarpeta]);
    $file->setDescription("USUARIO : $nombreColaborador");
    $file->setMimeType('image/jpeg');
    $resultado = $service->files->create(
        $file,
        array(
            'data' => file_get_contents($ruta_imagen),
            'uploadType' => 'media'
        )
    );
    $ruta = 'https://drive.google.com/uc?id=' . $resultado->id;
    unlink($ruta_imagen);
    return $ruta;
}


function guardarUsuario($usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();

    // Verificar si el usuario ya existe por el dni_usuario
    $consultaExistencia = $bd->prepare("SELECT estado FROM usuarios WHERE dni_usuario = ?");
    $consultaExistencia->execute([$usuario->dni_usuario]);
    $resultadoExistencia = $consultaExistencia->fetch(PDO::FETCH_ASSOC);

    if ($resultadoExistencia) {
        if ($resultadoExistencia['estado'] == '0') {
            if (!empty($usuario->foto_usuario)) {
                $rutaDB = guardarImagen($usuario->foto_usuario, $usuario->colaborador_usuario, $usuario->dni_usuario);
            } else {
                // Si no hay imagen, establece una imagen por defecto
                $rutaDB = 'https://sysdemo.byma-ve.com/BackendApiRest/img/Predeterminado/predeterminado.webp';
            }
            $sentencia = $bd->prepare("UPDATE usuarios SET id_creador_usuario = ?, clave_usuario = ?, colaborador_usuario = ?, brevete_usuario = ?, telefono_usuario = ?, email_usuario = ?, area_usuario = ?, foto_usuario = ?, fecha_creado = ?, estado = '1' WHERE dni_usuario = ?");

            return $sentencia->execute([
                $usuario->id_creador_usuario,
                $usuario->clave_usuario,
                $usuario->colaborador_usuario,
                $usuario->brevete_usuario,
                $usuario->telefono_usuario,
                $usuario->email_usuario,
                $usuario->area_usuario,
                $rutaDB,
                $fecha_actual,
                $usuario->dni_usuario
            ]);
        }
        return "El usuario ya existe en la Base de Datos";
    }

    if (!empty($usuario->foto_usuario)) {
        $rutaDB = guardarImagen($usuario->foto_usuario, $usuario->colaborador_usuario, $usuario->dni_usuario);
    } else {
        // Si no hay imagen, establece una imagen por defecto
        $rutaDB = 'https://sysdemo.byma-ve.com/BackendApiRest/img/Predeterminado/predeterminado.webp';
    }

    $sentenciaPermiso = $bd->prepare("INSERT INTO permisos(id_usuario_permiso, fecha_creado) VALUES (?, ?)");
    $sentenciaPermiso->execute([$usuario->dni_usuario, $fecha_actual]);

    $sentencia = $bd->prepare("INSERT INTO usuarios(id_creador_usuario,dni_usuario, clave_usuario, colaborador_usuario, brevete_usuario, telefono_usuario, email_usuario, area_usuario, cargo_usuario, foto_usuario, fecha_creado) VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    return $sentencia->execute([
        $usuario->id_creador_usuario,
        $usuario->dni_usuario,
        $usuario->clave_usuario,
        $usuario->colaborador_usuario,
        $usuario->brevete_usuario,
        $usuario->telefono_usuario,
        $usuario->email_usuario,
        $usuario->area_usuario,
        $usuario->cargo_usuario,
        $rutaDB,
        $fecha_actual
    ]);
}

function obtenerVariableDelEntorno($key)
{
    if (defined("_ENV_CACHE")) {
        $vars = _ENV_CACHE;
    } else {
        $file = "../../services/env.php";
        if (!file_exists($file)) {
            throw new Exception("El archivo de las variables de entorno ($file) no existe. Favor de crearlo");
        }
        $vars = parse_ini_file($file);
        define("_ENV_CACHE", $vars);
    }
    if (isset($vars[$key])) {
        return $vars[$key];
    } else {
        throw new Exception("La clave especificada (" . $key . ") no existe en el archivo de las variables de entorno");
    }
}

function obtenerConexion()
{
    $password = obtenerVariableDelEntorno("MYSQL_PASSWORD");
    $user = obtenerVariableDelEntorno("MYSQL_USER");
    $dbName = obtenerVariableDelEntorno("MYSQL_DATABASE_NAME");
    $database = new PDO('mysql:host=161.132.42.146;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
