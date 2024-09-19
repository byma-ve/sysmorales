<?php
function guardarAjuste($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();

    if (!empty($data['identificador_configuracion_guia']) && !empty($data['nombre_configuracion_guia'])) {
            // Verificar si el identificador ya existe en la base de datos
            $sql = "SELECT COUNT(*) FROM configuracion_guias WHERE identificador_configuracion_guia = :identificador_configuracion_guia";
            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':identificador_configuracion_guia', $data['identificador_configuracion_guia']);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            if ($count > 0) {
                return ['success' => false, 'message' => 'Error: ¡Ya fue Asignado!', 'data' => $data];
            }

            $sql = "SELECT COUNT(*) FROM configuracion_guias WHERE nombre_configuracion_guia = :nombre_configuracion_guia";
            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':nombre_configuracion_guia', $data['nombre_configuracion_guia']);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            if ($count > 0) {
                return ['success' => false, 'message' => 'Error: ¡Ya fue Asignado!', 'data' => $data];
            }

            // Insertar en la base de datos
            $sql = "INSERT INTO configuracion_guias(nombre_configuracion_guia, identificador_configuracion_guia, fecha_creado) 
            VALUES (:nombre_configuracion_guia, :identificador_configuracion_guia, :fecha_creado)";

            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':nombre_configuracion_guia', $data['nombre_configuracion_guia']);
            $stmt->bindParam(':identificador_configuracion_guia', $data['identificador_configuracion_guia']);
            $stmt->bindParam(':fecha_creado', $fecha_actual);

            if (!$stmt->execute()) {
                // Si ocurre un error durante la inserción, puedes optar por devolver un mensaje de error o manejarlo de otra manera
                return ['success' => false, 'message' => 'Error: ¡No se pudo Asignar!', 'data' => $data];
            }
        

        return ['success' => true, 'message' => 'Datos insertados correctamente', 'data' => $data];
    } else {
        return ['success' => false, 'message' => 'Error: ¡Sin Datos Enviados!', 'data' => $data];
    }
}

function obtenerAjustes()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT identificador_configuracion_guia AS 'identificador' , nombre_configuracion_guia AS 'nombre' FROM configuracion_guias;");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
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
