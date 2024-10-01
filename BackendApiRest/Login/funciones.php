<?php

function logueo($user, $pass)
{
    $bd = obtenerConexion();
    $result = "";

    if ($user != "" and $pass != "") {
        $stmt = $bd->prepare("SELECT * FROM usuarios WHERE dni_usuario=:user AND estado = '1' AND cargo_usuario NOT IN ('conductor', 'auxiliar')");
        $stmt->execute([':user' => $user]);

        if ($stmt->rowCount() != 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($pass != $row['clave_usuario']) {
                $result = "Contraseña Invalido!";
            } else {
                $result = ['message' => '¡Inicio sesión exitosamente! Redirigiendo...', 'user' => ['id_usuario' => $row['id']]];
            }
        } else {
            $result = ['error' => 'DNI/RUC Invalido!'];
        }
    } else {
        $result = ['error' => ''];
    }
    return $result;
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
