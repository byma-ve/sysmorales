<?php

function obtenerAreaTarifario($id_cliente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT areas.id, areas.nombre_area
    FROM areas
    WHERE areas.estado = '1' AND areas.id IN (
        SELECT id_area_tarifario_cliente_courrier AS id_area FROM tarifarios_clientes_courriers WHERE id_cliente_tarifario_cliente_courrier = :id_cliente_area1
        UNION
        SELECT id_area_tarifario_cliente_aereo AS id_area FROM tarifarios_clientes_aereos WHERE id_cliente_tarifario_cliente_aereo = :id_cliente_area2
        UNION
        SELECT id_area_tarifario_cliente_valorizado AS id_area FROM tarifarios_clientes_valorizados WHERE id_cliente_tarifario_cliente_valorizado = :id_cliente_area3
        UNION
        SELECT id_area_tarifario_cliente_carga AS id_area FROM tarifarios_clientes_cargas WHERE id_cliente_tarifario_cliente_carga = :id_cliente_area4
    ) ORDER BY areas.id DESC");
    $consulta->bindParam(':id_cliente_area1', $id_cliente);
    $consulta->bindParam(':id_cliente_area2', $id_cliente);
    $consulta->bindParam(':id_cliente_area3', $id_cliente);
    $consulta->bindParam(':id_cliente_area4', $id_cliente);
    $consulta->execute();
    $area = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $area;
}


function obtenerArea($id_cliente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    a.id,
    a.id_cliente_area,
    cli.razon_social_cliente,
    a.nombre_area,
    a.contacto_area,
    a.cargo_contacto_area,
    a.telefono_area,
    a.email_area,
    a.contacto_extra_area,
    a.telefono_extra_area,
    a.email_extra_area,
    a.id_creador_area,
    a.estado,
    a.fecha_creado,
    a.fecha_actualizado
    FROM areas a
    INNER JOIN 
    clientes cli ON a.id_cliente_area = cli.id
    WHERE id_cliente_area = :id_cliente_area AND a.estado = '1' ORDER BY a.id DESC"
    );
    $consulta->bindParam(':id_cliente_area', $id_cliente);
    $consulta->execute();
    $area = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $area;
}

function eliminarArea($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE areas SET estado = '0' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function actualizarArea($area)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s");

    $bd = obtenerConexion();

    $sentencia = $bd->prepare("UPDATE areas SET 
    id_cliente_area = ?,
    nombre_area = ?,
    contacto_area = ?,
    cargo_contacto_area = ?,
    telefono_area = ?,
    email_area = ?,
    contacto_extra_area = ?,
    telefono_extra_area = ?,
    email_extra_area = ?,
    fecha_actualizado = ?
    WHERE id = ?;");

    return $sentencia->execute([
        $area->id_cliente_area,
        $area->nombre_area,
        $area->contacto_area,
        $area->cargo_contacto_area,
        $area->telefono_area,
        $area->email_area,
        $area->contacto_extra_area,
        $area->telefono_extra_area,
        $area->email_extra_area,
        $fecha_dia_hora,
        $area->id
    ]);
}

function exportarAreas()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    cli.razon_social_cliente,
    a.nombre_area,
    a.contacto_area,
    a.cargo_contacto_area,
    a.telefono_area,
    a.email_area,
    a.contacto_extra_area,
    a.telefono_extra_area,
    a.email_extra_area
FROM areas a
INNER JOIN 
    clientes cli ON a.id_cliente_area = cli.id
WHERE a.estado = '1'
ORDER BY a.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerAreas()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    a.id,
    a.id_cliente_area,
    cli.razon_social_cliente,
    a.nombre_area,
    a.contacto_area,
    a.cargo_contacto_area,
    a.telefono_area,
    a.email_area,
    a.contacto_extra_area,
    a.telefono_extra_area,
    a.email_extra_area,
    a.id_creador_area,
    a.estado,
    a.fecha_creado,
    a.fecha_actualizado
FROM areas a
INNER JOIN 
    clientes cli ON a.id_cliente_area = cli.id
WHERE a.estado = '1'
ORDER BY a.id DESC ;");
    return $sentencia->fetchAll();
}

function guardarArea($area)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();

    $sentencia = $bd->prepare("INSERT INTO areas(id_creador_area,id_cliente_area, nombre_area, contacto_area, cargo_contacto_area, telefono_area, email_area, contacto_extra_area, telefono_extra_area, email_extra_area, fecha_creado) 
    VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");

    return $sentencia->execute([
        $area->id_creador_area,
        $area->id_cliente_area,
        $area->nombre_area,
        $area->contacto_area,
        $area->cargo_contacto_area,
        $area->telefono_area,
        $area->email_area,
        $area->contacto_extra_area,
        $area->telefono_extra_area,
        $area->email_extra_area,
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
