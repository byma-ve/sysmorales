<?php
function obtenerAgentesManifiesto($num_manifiesto){
    $bd = obtenerConexion();
    $lista = $bd->prepare(
        "SELECT de.*, prov.razon_social_proveedor FROM despachos_envios de
        LEFT JOIN proveedores prov ON prov.id = de.id_agente_despacho_envio
        WHERE id_agente_despacho_envio 
        IS NOT NULL 
        AND id_num_manifiesto_despacho_envio = :id
        ORDER BY de.id DESC;
        "
    );
    $lista->bindParam(':id', $num_manifiesto);
    $lista->execute();
    $data = $lista->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}


function obtenerDespachosFechas($fechaDesde, $fechaHasta)
{
    $bd = obtenerConexion();
    $despachos = $bd->prepare(
        "SELECT 
        d.fecha_creado,
        d.id_num_manifiesto_despacho,
        d.guia_transportista_despacho, 
        COALESCE(p.razon_social_proveedor, 'Trabajadores Internos') AS id_transportista_despacho,
        CONCAT(ub.DEPARTAMENTO, ', ', ub.PROVINCIA, ', ', ub.DESTINO) AS destino,
        COALESCE(v.tipo_vehiculo, d.tipo_vehiculo_despacho) AS vehiculo_asignado,
        COALESCE(v.placa_vehiculo, d.placa_despacho) AS placa_vehiculo,
        COALESCE(u_conductor.colaborador_usuario, d.conductor_despacho) AS conductor,
        COALESCE(u_auxiliar.colaborador_usuario, d.auxiliar_despacho) AS auxiliar,
        d.cantidad_bultos_despacho, 
        COUNT(de.id_num_manifiesto_despacho_envio) AS total_guias
    FROM 
        despachos d
    JOIN 
        despachos_envios de ON d.id_num_manifiesto_despacho = de.id_num_manifiesto_despacho_envio 
    LEFT JOIN 
        proveedores p ON d.id_transportista_despacho = p.id
    LEFT JOIN 
        ubigeo ub ON ub.UBIGEO = d.ubigeo_despacho
    LEFT JOIN 
        vehiculos v ON v.id = d.id_vehiculo_despacho
    LEFT JOIN 
        usuarios u_conductor ON u_conductor.id = d.id_conductor_despacho
    LEFT JOIN 
        usuarios u_auxiliar ON u_auxiliar.id = d.id_auxiliar_despacho
    WHERE 
        d.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
    GROUP BY 
        d.id_num_manifiesto_despacho
    ORDER BY d.id DESC;"
    );
    $despachos->bindParam(':fechaDesde', $fechaDesde);
    $despachos->bindParam(':fechaHasta', $fechaHasta);
    $despachos->execute();
    $data = $despachos->fetchAll(PDO::FETCH_ASSOC);

    return $data;
}

function eliminarGuia($opcionSeleccionada)
{
    $bd = obtenerConexion();
    $sql = "DELETE FROM despachos_envios WHERE id_num_guia_despacho_envio = :id";
    $stmt = $bd->prepare($sql);
    $stmt->bindParam(':id', $opcionSeleccionada);

    if ($stmt->execute()) {
        return ['success' => true, 'message' => '¡Envio eliminado correctamente!', 'datos' => $opcionSeleccionada];
    } else {
        return ['success' => false, 'message' => 'Error: ¡No se pudo eliminar!', 'datos' => $opcionSeleccionada];
    }
}


function obtenerDespachos()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    d.fecha_creado,
    d.id_num_manifiesto_despacho,
    d.guia_transportista_despacho, 
    COALESCE(p.razon_social_proveedor, 'Trabajadores Internos') AS id_transportista_despacho,
    CONCAT(ub.DEPARTAMENTO, ', ', ub.PROVINCIA, ', ', ub.DESTINO) AS destino,
    d.cantidad_bultos_despacho, 
    COUNT(de.id_num_manifiesto_despacho_envio) AS total_guias
FROM 
    despachos d
JOIN 
    despachos_envios de ON d.id_num_manifiesto_despacho = de.id_num_manifiesto_despacho_envio 
LEFT JOIN 
    proveedores p ON d.id_transportista_despacho = p.id
LEFT JOIN 
    ubigeo ub ON ub.UBIGEO = d.ubigeo_despacho
GROUP BY 
    d.id_num_manifiesto_despacho
ORDER BY d.id DESC;
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function guardarDespacho($data)
{
    $year = date("Y");
    $bd = obtenerConexion();

    $stmt = $bd->prepare("SELECT MAX(id_num_manifiesto_despacho) AS max_id FROM despachos WHERE id_num_manifiesto_despacho LIKE 'M%'");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $max_id_cotizacion = $row['max_id'];
    if ($max_id_cotizacion === NULL) {
        $num_manifiesto = "M1-$year";
    } else {
        $aumento_manifiesto = substr($max_id_cotizacion, 1, strpos($max_id_cotizacion, "-") - 1);
        $aumento_manifiesto = $aumento_manifiesto + 1;
        $num_manifiesto = "M" . $aumento_manifiesto . '-' . $year;
    }

    if ($data['id_transportista_despacho'] != '') {
        $stmt_verificar = $bd->prepare("SELECT count(*) as total FROM despachos_envios WHERE id_transportista_despacho_envio = :id_transportista_despacho AND id_num_manifiesto_despacho_envio = '0'");
        $stmt_verificar->bindParam(':id_transportista_despacho', $data['id_transportista_despacho']);
        $stmt_verificar->execute();
        $resultado = $stmt_verificar->fetch(PDO::FETCH_ASSOC);
        if ($resultado['total'] == 0) {
            return ['success' => false, 'message' => 'Error: ¡Debe tener al menos 1 envío!', 'datos' => $data];
        }
    } else {
        $stmt_verificar = $bd->prepare("SELECT count(*) as total FROM despachos_envios WHERE id_num_manifiesto_despacho_envio = '0' AND id_transportista_despacho_envio IS NULL");
        $stmt_verificar->execute();
        $resultado = $stmt_verificar->fetch(PDO::FETCH_ASSOC);
        if ($resultado['total'] == 0) {
            return ['success' => false, 'message' => 'Error: ¡Debe tener al menos 1 envío!', 'datos' => $data];
        }
    }

    if ($data['auxiliar_despacho'] == '' && $data['conductor_despacho'] == '' && $data['id_transportista_despacho'] == '' && $data['placa_despacho'] == '' && $data['tipo_vehiculo_despacho'] == '') {

        $despachos_sql = "INSERT INTO despachos (id_num_manifiesto_despacho, guia_transportista_despacho, id_conductor_despacho, id_auxiliar_despacho, ubigeo_despacho, id_vehiculo_despacho, cantidad_bultos_despacho, fecha_creado, id_creador_despacho, peso_total_despacho) 
            VALUES (:id_num_manifiesto_despacho, :guia_transportista_despacho, :id_conductor_despacho, :id_auxiliar_despacho, :ubigeo_despacho, :id_vehiculo_despacho, :cantidad_bultos_despacho, :fecha_creado, :id_creador_despacho, :peso_total_despacho)";
        $insertarDespacho = $bd->prepare($despachos_sql);
        $insertarDespacho->bindParam(':id_num_manifiesto_despacho', $num_manifiesto);
        $insertarDespacho->bindParam(':guia_transportista_despacho', $data['guia_transportista_despacho']);
        $insertarDespacho->bindParam(':id_conductor_despacho', $data['id_conductor_despacho']);
        $insertarDespacho->bindParam(':id_auxiliar_despacho', $data['id_auxiliar_despacho']);
        $insertarDespacho->bindParam(':ubigeo_despacho', $data['ubigeo_despacho']);
        $insertarDespacho->bindParam(':id_vehiculo_despacho', $data['id_vehiculo_despacho']);
        $insertarDespacho->bindParam(':cantidad_bultos_despacho', $data['cantidad_bultos_despacho']);
        $insertarDespacho->bindParam(':fecha_creado', $data['fecha_creado']);
        $insertarDespacho->bindParam(':id_creador_despacho', $data['id_creador_despacho']);
        $insertarDespacho->bindParam(':peso_total_despacho', $data['peso_total_despacho']);

        $envios_sql = "UPDATE despachos_envios 
        SET id_num_manifiesto_despacho_envio = :id_num_manifiesto_despacho_envio
        WHERE id_num_manifiesto_despacho_envio = '0' AND id_transportista_despacho_envio IS NULL";
        $actualizarEnvios = $bd->prepare($envios_sql);
        $actualizarEnvios->bindParam(':id_num_manifiesto_despacho_envio', $num_manifiesto);

        if ($insertarDespacho->execute() && $actualizarEnvios->execute()) {
            return ['success' => true, 'message' => '¡Despacho interno guardado correctamente!', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar!', 'datos' => $data];
        }
    } else if ($data['id_auxiliar_despacho'] == '' && $data['id_conductor_despacho'] == '' && $data['id_vehiculo_despacho'] == '') {

        $despachos_sql = "INSERT INTO despachos (id_num_manifiesto_despacho, id_transportista_despacho, guia_transportista_despacho, conductor_despacho, auxiliar_despacho, ubigeo_despacho, placa_despacho, tipo_vehiculo_despacho, cantidad_bultos_despacho, fecha_creado, id_creador_despacho, peso_total_despacho) 
            VALUES (:id_num_manifiesto_despacho, :id_transportista_despacho, :guia_transportista_despacho, :conductor_despacho, :auxiliar_despacho, :ubigeo_despacho, :placa_despacho, :tipo_vehiculo_despacho, :cantidad_bultos_despacho, :fecha_creado, :id_creador_despacho, :peso_total_despacho)";
        $insertarDespacho = $bd->prepare($despachos_sql);
        $insertarDespacho->bindParam(':id_num_manifiesto_despacho', $num_manifiesto);
        $insertarDespacho->bindParam(':id_transportista_despacho', $data['id_transportista_despacho']);
        $insertarDespacho->bindParam(':guia_transportista_despacho', $data['guia_transportista_despacho']);
        $insertarDespacho->bindParam(':conductor_despacho', $data['conductor_despacho']);
        $insertarDespacho->bindParam(':auxiliar_despacho', $data['auxiliar_despacho']);
        $insertarDespacho->bindParam(':ubigeo_despacho', $data['ubigeo_despacho']);
        $insertarDespacho->bindParam(':placa_despacho', $data['placa_despacho']);
        $insertarDespacho->bindParam(':tipo_vehiculo_despacho', $data['tipo_vehiculo_despacho']);
        $insertarDespacho->bindParam(':cantidad_bultos_despacho', $data['cantidad_bultos_despacho']);
        $insertarDespacho->bindParam(':fecha_creado', $data['fecha_creado']);
        $insertarDespacho->bindParam(':id_creador_despacho', $data['id_creador_despacho']);
        $insertarDespacho->bindParam(':peso_total_despacho', $data['peso_total_despacho']);

        $envios_sql = "UPDATE despachos_envios 
        SET id_num_manifiesto_despacho_envio = :id_num_manifiesto_despacho_envio
        WHERE id_num_manifiesto_despacho_envio = '0' AND id_transportista_despacho_envio = :id_transportista_despacho_envio";
        $actualizarEnvios = $bd->prepare($envios_sql);
        $actualizarEnvios->bindParam(':id_num_manifiesto_despacho_envio', $num_manifiesto);
        $actualizarEnvios->bindParam(':id_transportista_despacho_envio', $data['id_transportista_despacho']);

        if ($insertarDespacho->execute() && $actualizarEnvios->execute()) {
            return ['success' => true, 'message' => '¡Despacho externo guardado correctamente!', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar!', 'datos' => $data];
        }
    }
}

function guardarEnvioMasivo($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if ($data['id_num_guia_despacho_envio'] == '') {
        return ['success' => false, 'message' => 'Error: ¡Debe llenar todos los campos solicitados!', 'datos' => $data];
    }

    $stmt_verificar = $bd->prepare("SELECT r.id_orden_servicio_registro_carga
    FROM registros_cargas r
    JOIN despachos_envios d ON r.id_num_guia_registro_carga = d.id_num_guia_despacho_envio
    WHERE r.id_orden_servicio_registro_carga = :id_orden_servicio_registro_carga
    ");
    $stmt_verificar->bindParam(':id_orden_servicio_registro_carga', $data['id_num_guia_despacho_envio']);
    $stmt_verificar->execute();

    if ($stmt_verificar->rowCount() > 0) {
        return ['success' => false, 'message' => 'Error: ¡Algunos de los registros ya fueron guardados!', 'datos' => $data];
    }

    $datosRegistros = $bd->prepare("SELECT r.id_orden_servicio_registro_carga, r.id_num_guia_registro_carga
    FROM registros_cargas r
    WHERE r.id_orden_servicio_registro_carga = :id_orden_servicio_registro_carga
    ");
    $datosRegistros->bindParam(':id_orden_servicio_registro_carga', $data['id_num_guia_despacho_envio']);
    $datosRegistros->execute();

    $concatenated = '';

    $registros = $datosRegistros->fetchAll(PDO::FETCH_ASSOC);
    foreach ($registros as $registro) {
        $sql = "INSERT INTO despachos_envios (";
        $campos = array();
        $valores = array();
        $params = array();
        if (!empty($data['id_transportista_despacho_envio'])) {
            $campos[] = "id_transportista_despacho_envio";
            $valores[] = ":id_transportista_despacho_envio";
            $params[':id_transportista_despacho_envio'] = $data['id_transportista_despacho_envio'];
        }

        if (!empty($registro['id_num_guia_registro_carga'])) {
            $campos[] = "id_num_guia_despacho_envio";
            $valores[] = ":id_num_guia_despacho_envio";
            $params[':id_num_guia_despacho_envio'] = $registro['id_num_guia_registro_carga'];
        }

        if (!empty($data['id_agente_despacho_envio'])) {
            $campos[] = "id_agente_despacho_envio";
            $valores[] = ":id_agente_despacho_envio";
            $params[':id_agente_despacho_envio'] = $data['id_agente_despacho_envio'];
        }

        $campos[] = "id_num_manifiesto_despacho_envio";
        $valores[] = ":id_num_manifiesto_despacho_envio";
        $params[':id_num_manifiesto_despacho_envio'] = 0;

        $campos[] = "fecha_creado";
        $valores[] = ":fecha_creado";
        $params[':fecha_creado'] = $fecha_actual;

        $campos[] = "id_creador_despacho";
        $valores[] = ":id_creador_despacho";
        $params[':id_creador_despacho'] = $data['id_creador'];
        $sql .= implode(", ", $campos) . ") VALUES (" . implode(", ", $valores) . ")";
        $stmt = $bd->prepare($sql);
        foreach ($params as $key => &$value) {
            $stmt->bindParam($key, $value);
        }
        $stmt->execute();
    }
    return ['success' => true, 'message' => '¡Guardado Correctamente!', 'datos' => $concatenated];
}
function obtenerListaTransportista($id)
{
    $bd = obtenerConexion();
    $lista = $bd->prepare(
        "SELECT * 
        FROM despachos_envios
        WHERE id_transportista_despacho_envio = :id AND id_num_manifiesto_despacho_envio = '0'
        ORDER BY id DESC"
    );
    $lista->bindParam(':id', $id);
    $lista->execute();
    $data = $lista->fetchAll(PDO::FETCH_ASSOC);

    return $data;
}
function obtenerListaEnvios()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT * 
    FROM despachos_envios 
    WHERE id_num_manifiesto_despacho_envio = '0' AND id_transportista_despacho_envio IS NULL OR id_transportista_despacho_envio = ''
    ORDER BY id DESC;
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function guardarEnvioUnitario($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if ($data['id_num_guia_despacho_envio'] == '') {
        return ['success' => false, 'message' => 'Error: ¡Debe llenar todos los campos solicitados!', 'datos' => $data];
    }
    $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM despachos_envios WHERE id_num_guia_despacho_envio = :id_num_guia_despacho_envio");
    $stmt_verificar->bindParam(':id_num_guia_despacho_envio', $data['id_num_guia_despacho_envio']);
    $stmt_verificar->execute();
    $existe = $stmt_verificar->fetchColumn();

    if ($existe) {
        return ['success' => false, 'message' => 'Error: ¡Ya está registrado!', 'datos' => $data];
    }

    $sql = "INSERT INTO despachos_envios (";
    $campos = array();
    $valores = array();
    $params = array();
    if (!empty($data['id_transportista_despacho_envio'])) {
        $campos[] = "id_transportista_despacho_envio";
        $valores[] = ":id_transportista_despacho_envio";
        $params[':id_transportista_despacho_envio'] = $data['id_transportista_despacho_envio'];
    }

    if (!empty($data['id_num_guia_despacho_envio'])) {
        $campos[] = "id_num_guia_despacho_envio";
        $valores[] = ":id_num_guia_despacho_envio";
        $params[':id_num_guia_despacho_envio'] = $data['id_num_guia_despacho_envio'];
    }

    if (!empty($data['id_agente_despacho_envio'])) {
        $campos[] = "id_agente_despacho_envio";
        $valores[] = ":id_agente_despacho_envio";
        $params[':id_agente_despacho_envio'] = $data['id_agente_despacho_envio'];
    }

    $campos[] = "id_num_manifiesto_despacho_envio";
    $valores[] = ":id_num_manifiesto_despacho_envio";
    $params[':id_num_manifiesto_despacho_envio'] = 0;

    $campos[] = "fecha_creado";
    $valores[] = ":fecha_creado";
    $params[':fecha_creado'] = $fecha_actual;

    $campos[] = "id_creador_despacho";
    $valores[] = ":id_creador_despacho";
    $params[':id_creador_despacho'] = $data['id_creador'];
    $sql .= implode(", ", $campos) . ") VALUES (" . implode(", ", $valores) . ")";
    $stmt = $bd->prepare($sql);
    foreach ($params as $key => &$value) {
        $stmt->bindParam($key, $value);
    }
    if ($stmt->execute()) {
        return ['success' => true, 'message' => '¡Guardado Correctamente!', 'datos' => $data];
    } else {
        return ['success' => false, 'message' => 'Error: ¡No se pudo insertar!', 'datos' => $data];
    }
}

function obtenerGuiasMasivas()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT rc.id_orden_servicio_registro_carga
    FROM registros_cargas rc
    LEFT JOIN despachos_envios d ON rc.id_num_guia_registro_carga = d.id_num_guia_despacho_envio
    WHERE d.id_num_guia_despacho_envio IS NULL
    GROUP BY rc.id_orden_servicio_registro_carga
    HAVING COUNT(*) > 5
    ORDER BY rc.id DESC;
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function obtenerGuiaUnitaria($id_num_guia_registro_carga)
{
    $bd = obtenerConexion();
    $guia = $bd->prepare(
        "SELECT 
        COALESCE(cd.id, pvd.id, red.id, rmd.id) AS id_destino,
        r.id_num_guia_registro_carga,
        COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS consignado_destino,
        COALESCE(cd.dni_ruc_cotizacion_destino, pvd.dni_ruc_punto_venta_destino, red.dni_ruc_registro_envio_destino, rmd.dni_ruc_registro_masivo_destino) AS dni_ruc_destino,
        COALESCE(cd.telefono_cotizacion_destino, pvd.telefono_punto_venta_destino, red.telefono_registro_envio_destino, rmd.telefono_registro_masivo_destino) AS telefono_destino,
        COALESCE(cd.telefono_exc_cotizacion_destino, pvd.telefono_exc_punto_venta_destino, red.telefono_exc_registro_envio_destino, rmd.telefono_exc_registro_masivo_destino) AS telefono_extra_destino,
        COALESCE(cd.referencias_cotizacion_destino, pvd.referencias_punto_venta_destino, red.referencias_registro_envio_destino, rmd.referencias_registro_masivo_destino) AS referencia_destino,
        COALESCE(cd.tarifario_cotizacion_destino, pvd.tarifario_punto_venta_destino, red.tarifario_registro_envio_destino, rmd.tarifario_registro_masivo_destino) AS tarifario_destino,
        u.DEPARTAMENTO,
        u.PROVINCIA,
        u.DESTINO,
        COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_destino
        FROM 
            registros_cargas r
        LEFT JOIN 
            cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = r.id_orden_servicio_registro_carga AND r.id_destino_registro_carga = cd.id
        LEFT JOIN 
            punto_ventas_destinos pvd ON pvd.id_punto_venta_destino = r.id_orden_servicio_registro_carga AND r.id_destino_registro_carga =  pvd.id
        LEFT JOIN 
            registro_envio_destinos red ON red.id_registro_envio_destino = r.id_orden_servicio_registro_carga AND r.id_destino_registro_carga = red.id
        LEFT JOIN 
            registro_masivo_destinos rmd ON rmd.id_registro_masivo_destino = r.id_orden_servicio_registro_carga AND r.id_destino_registro_carga =  rmd.id
        LEFT JOIN
            ubigeo u ON u.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
        WHERE r.id_num_guia_registro_carga = :id_num_guia_registro_carga
        "
    );
    $guia->bindParam(':id_num_guia_registro_carga', $id_num_guia_registro_carga);
    $guia->execute();
    $data = $guia->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function obtenerGuiasUnitarias()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT rc.*
    FROM registros_cargas rc
    LEFT JOIN despachos_envios de ON rc.id_num_guia_registro_carga = de.id_num_guia_despacho_envio
    WHERE de.id_num_guia_despacho_envio IS NULL
    ORDER BY rc.id DESC;
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
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
