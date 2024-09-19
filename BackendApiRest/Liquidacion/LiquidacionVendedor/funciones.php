<?php
function exportarLiquidacionVendedor($id_usuario, $fechaDesde, $fechaHasta)
{
    $bd = obtenerConexion();
    if ($id_usuario == '') {
        $stmt = $bd->prepare("SELECT 
        c.fecha_creado,
        c.id_cotizacion,
        cli.razon_social_cliente AS cliente,
        u.colaborador_usuario AS vendedor,
        SUM(cd.total_tarifa_cotizacion_destino) AS costo_envio,
        SUM(cd.total_adicional_cotizacion_destino) AS costo_adicional,
        c.sub_total_cotizacion AS venta,
        ROUND((c.sub_total_cotizacion * 0.03),2) AS comision
        FROM cotizaciones c
        LEFT JOIN cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = c.id_cotizacion
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_cotizacion
        LEFT JOIN usuarios u ON u.id = cli.id_vendedor_usuario_cliente
        WHERE c.fecha_creado BETWEEN :fechaDesde AND :fechaHasta 
        GROUP BY
        c.id_cotizacion
        ORDER BY c.id DESC 
        ;
        ");
    } else {
        $stmt = $bd->prepare("SELECT 
        c.fecha_creado,
        c.id_cotizacion,
        cli.razon_social_cliente AS cliente,
        u.colaborador_usuario AS vendedor,
        SUM(cd.total_tarifa_cotizacion_destino) AS costo_envio,
        SUM(cd.total_adicional_cotizacion_destino) AS costo_adicional,
        c.sub_total_cotizacion AS venta,
        ROUND((c.sub_total_cotizacion * 0.03),2) AS comision
        FROM cotizaciones c
        LEFT JOIN cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = c.id_cotizacion
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_cotizacion
        LEFT JOIN usuarios u ON u.id = cli.id_vendedor_usuario_cliente
        WHERE u.id = :id_usuario AND c.fecha_creado BETWEEN :fechaDesde AND :fechaHasta 
        GROUP BY
        c.id_cotizacion
        ORDER BY c.id DESC 
        ;
        ");
        $stmt->bindParam(':id_usuario', $id_usuario);
    }
    $stmt->bindParam(':fechaDesde', $fechaDesde);
    $stmt->bindParam(':fechaHasta', $fechaHasta);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function ObtenerLiquidaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    c.fecha_creado,
    c.id_cotizacion,
    cli.razon_social_cliente AS cliente,
    u.colaborador_usuario AS vendedor,
    SUM(cd.total_tarifa_cotizacion_destino) AS costo_envio,
    SUM(cd.total_adicional_cotizacion_destino) AS costo_adicional,
    c.sub_total_cotizacion AS venta,
    ROUND((c.sub_total_cotizacion * 0.03),2) AS comision
    FROM cotizaciones c
    LEFT JOIN cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = c.id_cotizacion
    LEFT JOIN clientes cli ON cli.id = c.id_cliente_cotizacion
    LEFT JOIN usuarios u ON u.id = cli.id_vendedor_usuario_cliente
    GROUP BY
    c.id_cotizacion
    ORDER BY c.id DESC 
    ;
    ");
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
