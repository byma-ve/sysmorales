<?php
function desaprobarValidacion($id, $id_usuario)
{
    $bd = obtenerConexion();

    $stmt = $bd->prepare("SELECT id_accion_validacion 
    FROM validaciones 
    WHERE id_orden_servicio_validacion = :id_cot
    AND estado_validacion = 0
    AND id_accion_validacion IS NULL");
    $stmt->execute([':id_cot' => $id]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado !== false) {

        $stmt_cre = $bd->prepare("UPDATE validaciones SET estado_validacion = 0, id_accion_validacion = :id_usuario WHERE id_orden_servicio_validacion=:id_cot");
        $stmt_cre->execute([':id_usuario' => $id_usuario, ':id_cot' => $id]);

        if ($stmt_cre->rowCount() == 0) {
            return ['success' => false, 'mensaje' => 'No se pudo actualizar la validación'];
        }

        return ['success' => true, 'mensaje' => '!Cotización desaprobada Correctamente!'];
    } else {
        return ['success' => false, 'mensaje' => '!Está cotización ya se cambió'];
    }
}

function aprobarValidacion($id, $id_usuario)
{
    $bd = obtenerConexion();

    $stmt = $bd->prepare("SELECT id_accion_validacion 
    FROM validaciones 
    WHERE id_orden_servicio_validacion = :id_cot 
    AND estado_validacion = 0
    AND id_accion_validacion IS NULL");
    $stmt->execute([':id_cot' => $id]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado !== false) {

        $stmt_bus = $bd->prepare("SELECT * FROM cotizaciones where id_cotizacion=:id_cot");
        $stmt_bus->execute([':id_cot' => $id]);
        $mostrar_cotizacion = $stmt_bus->fetch();

        if ($stmt_bus->rowCount() == 0) {
            return ['success' => false, 'mensaje' => 'No se encontró la cotización'];
        }

        $id_cliente = $mostrar_cotizacion->id_cliente_cotizacion;
        $precio_total = $mostrar_cotizacion->precio_total_cotizacion;

        $stmt_cli = $bd->prepare("SELECT * FROM clientes where id=:id_cliente");
        $stmt_cli->execute([':id_cliente' => $id_cliente]);
        $mostrar_cliente = $stmt_cli->fetch();

        if ($stmt_cli->rowCount() == 0) {
            return ['success' => false, 'mensaje' => 'No se encontró el cliente'];
        }

        $limite_credito = $mostrar_cliente->limite_credito_cliente;
        $cliente_credito = $mostrar_cliente->alerta_credito_cliente;
        $suma_credito = $cliente_credito + $precio_total;

        $success = $suma_credito <= $limite_credito;
        if ($success) {
            $stmt_cre = $bd->prepare("UPDATE clientes SET alerta_credito_cliente=:suma_credito WHERE id=:id_cliente");
            $stmt_cre->execute([':suma_credito' => $suma_credito, ':id_cliente' => $id_cliente]);

            if ($stmt_cre->rowCount() == 0) {
                return ['success' => false, 'mensaje' => 'No se pudo actualizar el crédito del cliente'];
            }
        } else {
            return ['success' => false, 'mensaje' => '¡La cotización sobrepasa el limite de credito asignado!'];
        }

        $stmt_cre = $bd->prepare("UPDATE validaciones SET estado_validacion = 1, id_accion_validacion = :id_usuario WHERE id_orden_servicio_validacion=:id_cot");
        $stmt_cre->execute([':id_usuario' => $id_usuario, ':id_cot' => $id]);

        if ($stmt_cre->rowCount() == 0) {
            return ['success' => false, 'mensaje' => 'No se pudo actualizar la validación'];
        }

        return ['success' => true, 'mensaje' => '!Cotización aprobada Correctamente!'];
    } else {
        return ['success' => false, 'mensaje' => '!Está cotización ya se cambió'];
    }
}

function exportarValidaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT
    v.fecha_creado,
    u.colaborador_usuario,
	v.id_orden_servicio_validacion,
	cli.razon_social_cliente,
    SUM(cd.cantidad_mercancia_cotizacion_destino) AS total_bultos,
    cot.cantidad_destinos_cotizacion,
	SUM(cd.total_tarifa_cotizacion_destino) AS total_costo_envio,
	SUM(cd.total_adicional_cotizacion_destino) AS total_costo_adicional,
    cot.recibo_cotizacion,
    cot.precio_total_cotizacion
FROM
    validaciones v
INNER JOIN
    cotizaciones cot ON cot.id_cotizacion = v.id_orden_servicio_validacion
INNER JOIN 
    cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = v.id_orden_servicio_validacion
INNER JOIN
    clientes cli ON cot.id_cliente_cotizacion = cli.id
LEFT JOIN
    usuarios u ON u.id = v.id_accion_validacion
GROUP BY 
    v.id_orden_servicio_validacion
ORDER BY v.id DESC;");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function obtenerValidaciones()
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicio FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicio';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicio = $campoConsultaID['identificadorOrdenServicio'] ?? '';

    $stmt = $bd->query("SELECT 
	validaciones.id,
	validaciones.fecha_creado,
	usuarios.colaborador_usuario,
	validaciones.id_orden_servicio_validacion,
	clientes.razon_social_cliente,
	SUM(COALESCE(cotizaciones_destinos.cantidad_mercancia_cotizacion_destino, 0) + COALESCE(punto_ventas_destinos.cantidad_mercancia_punto_venta_destino, 0)) AS total_bultos,
    COALESCE(cotizaciones.cantidad_destinos_cotizacion, 0) + COALESCE(punto_ventas.cantidad_destinos_punto_venta, 0) AS cantidad_destinos_cotizacion,
	SUM(COALESCE(cotizaciones_destinos.total_tarifa_cotizacion_destino, 0) + COALESCE(punto_ventas_destinos.total_tarifa_punto_venta_destino, 0)) AS total_costo_envio,
	SUM(COALESCE(cotizaciones_destinos.total_adicional_cotizacion_destino, 0) + COALESCE(punto_ventas_destinos.total_adicional_punto_venta_destino, 0)) AS total_costo_adicional,
    CASE
        WHEN cotizaciones.recibo_cotizacion IS NOT NULL AND punto_ventas.recibo_punto_venta IS NOT NULL THEN CONCAT(cotizaciones.recibo_cotizacion, ', ', punto_ventas.recibo_punto_venta)
        WHEN cotizaciones.recibo_cotizacion IS NOT NULL THEN cotizaciones.recibo_cotizacion
        WHEN punto_ventas.recibo_punto_venta IS NOT NULL THEN punto_ventas.recibo_punto_venta
        ELSE NULL
    END AS recibo_cotizacion,
	COALESCE(cotizaciones.precio_total_cotizacion, 0) + COALESCE(punto_ventas.precio_total_punto_venta, 0) AS precio_total_cotizacion,
	validaciones.estado_validacion
FROM validaciones
LEFT JOIN cotizaciones ON validaciones.id_orden_servicio_validacion = cotizaciones.id_cotizacion
LEFT JOIN cotizaciones_destinos ON cotizaciones.id_cotizacion = cotizaciones_destinos.id_cotizacion_cotizacion_destino
LEFT JOIN punto_ventas ON validaciones.id_orden_servicio_validacion = punto_ventas.id_punto_venta
LEFT JOIN punto_ventas_destinos ON punto_ventas.id_punto_venta = punto_ventas_destinos.id_punto_venta_destino
LEFT JOIN usuarios ON validaciones.id_accion_validacion = usuarios.id
LEFT JOIN clientes ON (cotizaciones.id_cliente_cotizacion = clientes.id OR punto_ventas.id_cliente_punto_venta = clientes.id)
WHERE id_orden_servicio_validacion NOT LIKE '$identificadorOrdenServicioMasivo%'
AND id_orden_servicio_validacion NOT LIKE '$identificadorOrdenServicio%'
GROUP BY 
    validaciones.id_orden_servicio_validacion,
    clientes.razon_social_cliente,
    usuarios.colaborador_usuario,
    cantidad_destinos_cotizacion,
	recibo_cotizacion,
    precio_total_cotizacion
ORDER BY validaciones.id DESC
");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function enviarValidacion($id, $id_creador)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT * FROM validaciones WHERE id_orden_servicio_validacion = :id AND estado=1");
    $consulta->bindParam(':id', $id);
    $consulta->execute();

    if ($consulta->rowCount() > 0) {
        return ['success' => false, 'mensaje' => '¡La Cotización ya fue enviada, No se puede enviar otra vez!'];
    } else {
        $insercion = $bd->prepare("INSERT INTO validaciones (id_orden_servicio_validacion,id_creador_enviar_validacion,fecha_creado) VALUES (:id,:id_creador,:fecha_creado)");
        $insercion->bindParam(':id', $id);
        $insercion->bindParam(':id_creador', $id_creador);
        $insercion->bindParam(':fecha_creado', $fecha_actual);
        $insercion->execute();

        $actualizacion = $bd->prepare("UPDATE cotizaciones SET validacion_cotizacion = 1 WHERE id_cotizacion = :id AND estado=1");
        $actualizacion->bindParam(':id', $id);
        $actualizacion->execute();

        return ['success' => true, 'mensaje' => 'Cotizacion enviada Correctamente!'];
    }
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
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
