<?php
function eliminarProgramacion($id)
{
    $bd = obtenerConexion();
    $validarAsignacion = $bd->prepare(
        "SELECT count(*) AS total FROM asignacion_recojos WHERE id_orden_servicio_recojo = :id_orden_servicio"
    );
    $validarAsignacion->bindParam(':id_orden_servicio', $id);
    $validarAsignacion->execute();
    $dataAsignacion = $validarAsignacion->fetch(PDO::FETCH_ASSOC);

    if ($dataAsignacion['total'] > 0) {
        return ['success' => false, 'message' => 'Error: ¡No se puede eliminar, ya fue asignado!'];
    } else {
        $sentencia = $bd->prepare("DELETE FROM programaciones WHERE id_orden_servicio = ?");
        $resultado = $sentencia->execute([$id]);
        if ($resultado) {
            return ['success' => true, 'message' => '¡Se anuló correctamente!'];
        } else {
            return ['success' => false, 'message' => 'Error: ¡Hubo un error y no se pudo eliminar!'];
        }
    }
}

function datosProgramacion($id_orden_servicio)
{
    $bd = obtenerConexion();
    $programacion = $bd->prepare(
        "SELECT p.*,c.razon_social_cliente,	dep.id AS departamento_id,
        prov.id AS provincia_id
     FROM programaciones p
            INNER JOIN clientes c
            ON p.id_cliente_programacion = c.id
            INNER JOIN 
        distritos dis ON p.ubigeo_programacion = dis.ubigeo
    INNER JOIN 
        provincias prov ON dis.provincia_id = prov.id
    INNER JOIN 
        departamentos dep ON prov.departamento_id = dep.id
    WHERE id_orden_servicio = :id_orden_servicio;
        "
    );
    $programacion->bindParam(':id_orden_servicio', $id_orden_servicio);
    $programacion->execute();
    $data = $programacion->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function obtenerProgramaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT p.*,c.razon_social_cliente FROM programaciones p
    INNER JOIN clientes c
    ON p.id_cliente_programacion = c.id
    ORDER BY p.id DESC;");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function guardarProgramacion($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (empty($data['area_programacion']) || empty($data['cantidad_bultos_programacion']) || empty($data['contacto_programacion']) || empty($data['correo_programacion']) || empty($data['descripcion_mercancia_programacion']) || empty($data['direccion_programacion']) || empty($data['fecha_programacion']) || empty($data['hora_programacion']) || empty($data['id_cliente']) || empty($data['id_creador']) || empty($data['id_orden_servicio']) || empty($data['metros_cubicos_programacion']) || empty($data['peso_mercancia_programacion']) || empty($data['peso_volumen_programacion']) || empty($data['referencias_programacion']) || empty($data['telefono_programacion']) || empty($data['ubigeo_programacion'])) {
        return ['success' => false, 'message' => 'Error: ¡Debe llenar todos los campos!', 'datos' => $data];
    }
    if (!is_numeric($data['telefono_programacion'])) {
        return ['success' => false, 'message' => 'Error: ¡El campo teléfono debe ser numerico!', 'datos' => $data];
    }
    if (!filter_var($data['correo_programacion'], FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Error: ¡El campo correo debe ser un correo electronico', 'datos' => $data];
    }

    if (isset($data['departamento_id']) || isset($data['provincia_id'])) {
        $sql = "UPDATE programaciones SET 
            id_cliente_programacion = :id_cliente_programacion, 
            area_programacion = :area_programacion, 
            ubigeo_programacion = :ubigeo_programacion, 
            direccion_programacion = :direccion_programacion, 
            referencias_programacion = :referencias_programacion, 
            contacto_programacion = :contacto_programacion, 
            telefono_programacion = :telefono_programacion, 
            correo_programacion = :correo_programacion, 
            descripcion_mercancia_programacion = :descripcion_mercancia_programacion, 
            cantidad_bultos_programacion = :cantidad_bultos_programacion, 
            peso_mercancia_programacion = :peso_mercancia_programacion, 
            peso_volumen_programacion = :peso_volumen_programacion, 
            metros_cubicos_programacion = :metros_cubicos_programacion, 
            fecha_programacion = :fecha_programacion, 
            hora_programacion = :hora_programacion
        WHERE id_orden_servicio = :id_orden_servicio";

        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_orden_servicio', $data['id_orden_servicio']);
        $stmt->bindParam(':id_cliente_programacion', $data['id_cliente']);
        $stmt->bindParam(':area_programacion', $data['area_programacion']);
        $stmt->bindParam(':ubigeo_programacion', $data['ubigeo_programacion']);
        $stmt->bindParam(':direccion_programacion', $data['direccion_programacion']);
        $stmt->bindParam(':referencias_programacion', $data['referencias_programacion']);
        $stmt->bindParam(':contacto_programacion', $data['contacto_programacion']);
        $stmt->bindParam(':telefono_programacion', $data['telefono_programacion']);
        $stmt->bindParam(':correo_programacion', $data['correo_programacion']);
        $stmt->bindParam(':descripcion_mercancia_programacion', $data['descripcion_mercancia_programacion']);
        $stmt->bindParam(':cantidad_bultos_programacion', $data['cantidad_bultos_programacion']);
        $stmt->bindParam(':peso_mercancia_programacion', $data['peso_mercancia_programacion']);
        $stmt->bindParam(':peso_volumen_programacion', $data['peso_volumen_programacion']);
        $stmt->bindParam(':metros_cubicos_programacion', $data['metros_cubicos_programacion']);
        $stmt->bindParam(':fecha_programacion', $data['fecha_programacion']);
        $stmt->bindParam(':hora_programacion', $data['hora_programacion']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Actualizado Correctamente', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $data];
        }
    } else {
        $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM programaciones WHERE id_orden_servicio = :id_orden_servicio");
        $stmt_verificar->bindParam(':id_orden_servicio', $data['id_orden_servicio']);
        $stmt_verificar->execute();
        $existe = $stmt_verificar->fetchColumn();

        if ($existe) {
            return ['success' => false, 'message' => 'Error: ¡La orden de servicio ya está programada!', 'datos' => $data];
        }

        $sql = "INSERT INTO programaciones(id_orden_servicio, id_cliente_programacion, area_programacion, ubigeo_programacion, direccion_programacion, referencias_programacion, contacto_programacion, telefono_programacion, correo_programacion, descripcion_mercancia_programacion, cantidad_bultos_programacion, peso_mercancia_programacion, peso_volumen_programacion, metros_cubicos_programacion, fecha_programacion, hora_programacion, id_creador_programacion, fecha_creado) 
    VALUES (:id_orden_servicio, :id_cliente_programacion, :area_programacion, :ubigeo_programacion, :direccion_programacion, :referencias_programacion, :contacto_programacion, :telefono_programacion, :correo_programacion, :descripcion_mercancia_programacion, :cantidad_bultos_programacion, :peso_mercancia_programacion, :peso_volumen_programacion, :metros_cubicos_programacion, :fecha_programacion, :hora_programacion, :id_creador_programacion, :fecha_creado)";

        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_orden_servicio', $data['id_orden_servicio']);
        $stmt->bindParam(':id_cliente_programacion', $data['id_cliente']);
        $stmt->bindParam(':area_programacion', $data['area_programacion']);
        $stmt->bindParam(':ubigeo_programacion', $data['ubigeo_programacion']);
        $stmt->bindParam(':direccion_programacion', $data['direccion_programacion']);
        $stmt->bindParam(':referencias_programacion', $data['referencias_programacion']);
        $stmt->bindParam(':contacto_programacion', $data['contacto_programacion']);
        $stmt->bindParam(':telefono_programacion', $data['telefono_programacion']);
        $stmt->bindParam(':correo_programacion', $data['correo_programacion']);
        $stmt->bindParam(':descripcion_mercancia_programacion', $data['descripcion_mercancia_programacion']);
        $stmt->bindParam(':cantidad_bultos_programacion', $data['cantidad_bultos_programacion']);
        $stmt->bindParam(':peso_mercancia_programacion', $data['peso_mercancia_programacion']);
        $stmt->bindParam(':peso_volumen_programacion', $data['peso_volumen_programacion']);
        $stmt->bindParam(':metros_cubicos_programacion', $data['metros_cubicos_programacion']);
        $stmt->bindParam(':fecha_programacion', $data['fecha_programacion']);
        $stmt->bindParam(':hora_programacion', $data['hora_programacion']);
        $stmt->bindParam(':id_creador_programacion', $data['id_creador']);
        $stmt->bindParam(':fecha_creado', $fecha_actual);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Programado Correctamente', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar!', 'datos' => $data];
        }
    }
}

function totalesProgramacion($id_orden_servicio)
{
    $bd = obtenerConexion();
    $totales = $bd->prepare(
        "SELECT 
        SUM(peso_mercancia) AS total_peso_mercancia, 
        SUM(cantidad_mercancia) AS total_bultos,  
        SUM(total_metros_cubicos) AS total_metros_cubicos, 
        SUM(total_peso_volumen) AS total_peso_volumen 
    FROM (
        SELECT id_punto_venta_destino AS id_orden_servicio, peso_mercancia_punto_venta_destino AS peso_mercancia, cantidad_mercancia_punto_venta_destino AS cantidad_mercancia, total_metros_cubicos_punto_venta_destino AS total_metros_cubicos, total_peso_volumen_punto_venta_destino AS total_peso_volumen FROM punto_ventas_destinos
        UNION ALL
        SELECT id_registro_envio_destino AS id_orden_servicio, peso_mercancia_registro_envio_destino AS peso_mercancia, cantidad_mercancia_registro_envio_destino AS cantidad_mercancia, total_metros_cubicos_registro_envio_destino AS total_metros_cubicos, total_peso_volumen_registro_envio_destino AS total_peso_volumen FROM registro_envio_destinos
        UNION ALL
        SELECT id_registro_masivo_destino AS id_orden_servicio, peso_mercancia_registro_masivo_destino AS peso_mercancia, cantidad_mercancia_registro_masivo_destino AS cantidad_mercancia, total_metros_cubicos_registro_masivo_destino AS total_metros_cubicos, total_peso_volumen_registro_masivo_destino AS total_peso_volumen FROM registro_masivo_destinos
        UNION ALL
        SELECT id_cotizacion_cotizacion_destino AS id_orden_servicio, peso_mercancia_cotizacion_destino AS peso_mercancia, cantidad_mercancia_cotizacion_destino AS cantidad_mercancia, total_metros_cubicos_cotizacion_destino AS total_metros_cubicos, total_peso_volumen_cotizacion_destino AS total_peso_volumen FROM cotizaciones_destinos
    ) AS unioned_tables
    WHERE id_orden_servicio = :id_orden_servicio;"
    );
    $totales->bindParam(':id_orden_servicio', $id_orden_servicio);
    $totales->execute();
    $totalesProgramacion = $totales->fetch(PDO::FETCH_ASSOC);

    $clientes = $bd->prepare(
        "WITH union_table AS (
            SELECT id_cliente_cotizacion AS id_cliente,id_cotizacion AS id_orden_servicio FROM cotizaciones
            UNION ALL
            SELECT id_cliente_punto_venta AS id_cliente,id_punto_venta AS id_orden_servicio FROM punto_ventas
            UNION ALL
            SELECT id_cliente_registro_envios AS id_cliente,id_registro_envios AS id_orden_servicio FROM registro_envios
            UNION ALL
            SELECT id_cliente_registro_masivo AS id_cliente,id_registro_masivo AS id_orden_servicio  FROM registro_masivos
        )
        SELECT clientes.id,clientes.razon_social_cliente,union_table.id_orden_servicio
        FROM union_table
        INNER JOIN clientes ON union_table.id_cliente = clientes.id
        WHERE union_table.id_orden_servicio = :id_orden_servicio
        ;"
    );
    $clientes->bindParam(':id_orden_servicio', $id_orden_servicio);
    $clientes->execute();
    $cliente = $clientes->fetch(PDO::FETCH_ASSOC);

    $result = array(
        "total_peso_mercancia" => number_format($totalesProgramacion["total_peso_mercancia"], 2, ".", ""),
        "total_bultos" => number_format($totalesProgramacion["total_bultos"], 2, ".", ""),
        "total_metros_cubicos" => number_format($totalesProgramacion["total_metros_cubicos"], 2, ".", ""),
        "total_peso_volumen" => number_format($totalesProgramacion["total_peso_volumen"], 2, ".", ""),
        "id_cliente" => $cliente["id"],
        "razon_social_cliente" => $cliente["razon_social_cliente"]
    );

    return $result;
}

function ordenServicios()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT v.id,v.id_orden_servicio_validacion
    FROM validaciones v
    LEFT JOIN programaciones p ON v.id_orden_servicio_validacion = p.id_orden_servicio
    WHERE p.id_orden_servicio IS NULL
    AND v.id_accion_validacion IS NOT NULL
    ORDER BY v.id DESC;
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
