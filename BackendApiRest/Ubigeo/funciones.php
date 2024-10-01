<?php

function exportarUbigeo()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    DEPARTAMENTO as 'Departamento',
    PROVINCIA as 'Provincia',
    DESTINO as 'Distrito'
    FROM ubigeo");
    return $sentencia->fetchAll();
}

function selectUbigeo($accion, $id = null)
{
    $bd = obtenerConexion();
    $data = [];

    switch ($accion) {
        case 'departamentos':
            $stmt = $bd->query("SELECT id, nombre_dep,ubigeo FROM departamentos");
            break;
        case 'provincias':
            if (isset($id)) {
                $stmt = $bd->prepare("SELECT id, nombre_prov,ubigeo FROM provincias WHERE departamento_id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
            }
            break;
        case 'distritos':
            if (isset($id)) {
                $stmt = $bd->prepare("SELECT id, nombre_dist,ubigeo FROM distritos WHERE provincia_id = :id");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
            }
            break;
        default:
            // Puedes dejar esto vacío o definir un comportamiento predeterminado.
            return $data;
    }

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function obtenerVariableDelEntorno($key)
{
    if (defined("_ENV_CACHE")) {
        $vars = _ENV_CACHE;
    } else {
        $file = "../services/env.php";
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
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
