<?php
function exportarListaRecojos($fechaDesde, $fechaHasta)
{
    $bd = obtenerConexion();
    $stmt = $bd->prepare("SELECT
    CASE 
        WHEN e.comentario_estado_recojo IS NULL AND e.imagen_estado_recojo IS NULL THEN 'Falta recoger' 
        ELSE 'Recogido' 
    END AS estado_recojo,
    a.id_orden_servicio_recojo,
    p.fecha_programacion,
    p.hora_programacion, 
    c.razon_social_cliente,
    c.area_cliente,
    CONCAT(u.DEPARTAMENTO, ', ', u.PROVINCIA, ', ', u.DESTINO) AS destino_recojo,
    e.comentario_estado_recojo,
    areas.nombre_area,
    (
        SELECT
            id_area_cotizacion
        FROM cotizaciones
        WHERE id_cotizacion = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_punto_venta
        FROM punto_ventas
        WHERE id_punto_venta = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_envios
        FROM registro_envios
        WHERE id_registro_envios = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_masivo
        FROM registro_masivos
        WHERE id_registro_masivo = a.id_orden_servicio_recojo
    ) AS id_area
FROM asignacion_recojos a
LEFT JOIN estados_recojos e ON e.id_orden_servicio_estado_recojo = a.id_orden_servicio_recojo
LEFT JOIN programaciones p ON p.id_orden_servicio = a.id_orden_servicio_recojo
LEFT JOIN clientes c ON c.id = p.id_cliente_programacion
LEFT JOIN ubigeo u ON u.UBIGEO = p.ubigeo_programacion
INNER JOIN areas ON areas.id = (
        SELECT
            id_area_cotizacion
        FROM cotizaciones
        WHERE id_cotizacion = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_punto_venta
        FROM punto_ventas
        WHERE id_punto_venta = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_envios
        FROM registro_envios
        WHERE id_registro_envios = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_masivo
        FROM registro_masivos
        WHERE id_registro_masivo = a.id_orden_servicio_recojo
)
WHERE a.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
ORDER BY a.id DESC
;");
    $stmt->bindParam(':fechaDesde', $fechaDesde);
    $stmt->bindParam(':fechaHasta', $fechaHasta);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function obtenerListaRecojos()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT
    CASE 
        WHEN e.comentario_estado_recojo IS NULL AND e.imagen_estado_recojo IS NULL THEN 'Falta recoger' 
        ELSE 'Recogido' 
    END AS estado_recojo,
    a.id_orden_servicio_recojo,
    p.fecha_programacion,
    p.hora_programacion, 
    c.razon_social_cliente,
    c.area_cliente,
    u.DEPARTAMENTO,
    u.PROVINCIA,
    u.DESTINO,
    e.comentario_estado_recojo,
    e.imagen_estado_recojo,
    areas.nombre_area,
    (
        SELECT
            id_area_cotizacion
        FROM cotizaciones
        WHERE id_cotizacion = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_punto_venta
        FROM punto_ventas
        WHERE id_punto_venta = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_envios
        FROM registro_envios
        WHERE id_registro_envios = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_masivo
        FROM registro_masivos
        WHERE id_registro_masivo = a.id_orden_servicio_recojo
    ) AS id_area
FROM asignacion_recojos a
LEFT JOIN estados_recojos e ON e.id_orden_servicio_estado_recojo = a.id_orden_servicio_recojo
LEFT JOIN programaciones p ON p.id_orden_servicio = a.id_orden_servicio_recojo
LEFT JOIN clientes c ON c.id = p.id_cliente_programacion
LEFT JOIN ubigeo u ON u.UBIGEO = p.ubigeo_programacion
INNER JOIN areas ON areas.id = (
        SELECT
            id_area_cotizacion
        FROM cotizaciones
        WHERE id_cotizacion = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_punto_venta
        FROM punto_ventas
        WHERE id_punto_venta = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_envios
        FROM registro_envios
        WHERE id_registro_envios = a.id_orden_servicio_recojo
        UNION ALL
        SELECT
            id_area_registro_masivo
        FROM registro_masivos
        WHERE id_registro_masivo = a.id_orden_servicio_recojo
)
ORDER BY a.id DESC;");
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
