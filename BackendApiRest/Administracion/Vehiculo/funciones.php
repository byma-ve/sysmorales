<?php
function obtenerVehiculo($id)
{
    $bd = obtenerConexion();
    $vehiculo = $bd->prepare(
        "SELECT * FROM vehiculos WHERE id = :id"
    );
    $vehiculo->bindParam(':id', $id);
    $vehiculo->execute();
    $data = $vehiculo->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function eliminarVehiculo($id)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s"); // Formato con fecha y hora

    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE vehiculos SET estado = '0' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function actualizarVehiculo($proveedor)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s");

    $bd = obtenerConexion();

    $sentencia = $bd->prepare("UPDATE vehiculos SET 
    tipo_vehiculo = ?,
    n_serie_vehiculo = ?,
    soat_vehiculo = ?,
    vigencia_desde_vehiculo = ?,
    vigencia_hasta_vehiculo = ?,
    ultima_revision_vehiculo = ?,
    vencimiento_vehiculo = ?,
    tarjeta_propiedad_vehiculo = ?,
    fecha_actualizado = ?
    WHERE id = ?;");

    return $sentencia->execute([
        $proveedor->tipo_vehiculo,
        $proveedor->n_serie_vehiculo,
        $proveedor->soat_vehiculo,
        $proveedor->vigencia_desde_vehiculo,
        $proveedor->vigencia_hasta_vehiculo,
        $proveedor->ultima_revision_vehiculo,
        $proveedor->vencimiento_vehiculo,
        $proveedor->tarjeta_propiedad_vehiculo,
        $fecha_dia_hora,
        $proveedor->id
    ]);
}

function exportarVehiculos()
{
    $bd = obtenerConexion();
    $bd->exec("UPDATE vehiculos SET validado_vehiculo = '0' WHERE CURDATE() > vigencia_hasta_vehiculo ");
    $sentencia = $bd->query(
        "SELECT 
    placa_vehiculo, 
    tipo_vehiculo, 
    n_serie_vehiculo, 
    soat_vehiculo, 
    vigencia_desde_vehiculo, 
    vigencia_hasta_vehiculo, 
    ultima_revision_vehiculo, 
    vencimiento_vehiculo, 
    tarjeta_propiedad_vehiculo, 
    CASE 
        WHEN validado_vehiculo = 1 THEN 'Válido' 
        WHEN validado_vehiculo = 0 THEN 'No Válido' 
        ELSE 'estado no reconocido'
    END AS validado_vehiculo
    FROM vehiculos WHERE estado = '1' ORDER BY id DESC;"
    );
    return $sentencia->fetchAll();
}

function obtenerVehiculos()
{
    $bd = obtenerConexion();
    $bd->exec("UPDATE vehiculos SET validado_vehiculo = '0' WHERE CURDATE() > vigencia_hasta_vehiculo ");
    $sentencia = $bd->query("SELECT 
    id, 
    placa_vehiculo, 
    tipo_vehiculo, 
    n_serie_vehiculo, 
    soat_vehiculo, 
    vigencia_desde_vehiculo, 
    vigencia_hasta_vehiculo, 
    ultima_revision_vehiculo, 
    vencimiento_vehiculo, 
    tarjeta_propiedad_vehiculo, 
    CASE 
        WHEN validado_vehiculo = 1 THEN 'Válido' 
        WHEN validado_vehiculo = 0 THEN 'No Válido' 
        ELSE 'estado no reconocido'
    END AS validado_vehiculo,
    id_creador_vehiculo, 
    estado, 
    fecha_creado, 
    fecha_actualizado 
    FROM vehiculos WHERE estado = '1' ORDER BY id DESC;");
    return $sentencia->fetchAll();
}

function guardarVehiculo($vehiculo)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();

    $consultaExistencia = $bd->prepare("SELECT estado FROM vehiculos WHERE placa_vehiculo = ?");
    $consultaExistencia->execute([$vehiculo->placa_vehiculo]);
    $resultadoExistencia = $consultaExistencia->fetch(PDO::FETCH_ASSOC);

    if ($resultadoExistencia) {
        if ($resultadoExistencia['estado'] == 0) {
            $sentencia = $bd->prepare("UPDATE vehiculos SET id_creador_vehiculo = ?, tipo_vehiculo = ?, n_serie_vehiculo = ?, soat_vehiculo = ?, vigencia_desde_vehiculo = ?, vigencia_hasta_vehiculo = ?, ultima_revision_vehiculo = ?, vencimiento_vehiculo = ?, tarjeta_propiedad_vehiculo = ?, fecha_creado = ?, estado = '1' WHERE placa_vehiculo = ?");

            return $sentencia->execute([
                $vehiculo->id_creador_vehiculo,
                $vehiculo->tipo_vehiculo,
                $vehiculo->n_serie_vehiculo,
                $vehiculo->soat_vehiculo,
                $vehiculo->vigencia_desde_vehiculo,
                $vehiculo->vigencia_hasta_vehiculo,
                $vehiculo->ultima_revision_vehiculo,
                $vehiculo->vencimiento_vehiculo,
                $vehiculo->tarjeta_propiedad_vehiculo,
                $fecha_actual,
                $vehiculo->placa_vehiculo
            ]);
        }
        return "Ya existe un vehiculo con la misma placa";
    }


    $sentencia = $bd->prepare("INSERT INTO vehiculos(id_creador_vehiculo,placa_vehiculo, tipo_vehiculo, n_serie_vehiculo, soat_vehiculo, vigencia_desde_vehiculo, vigencia_hasta_vehiculo, ultima_revision_vehiculo, vencimiento_vehiculo, tarjeta_propiedad_vehiculo, fecha_creado) 
    VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");

    return $sentencia->execute([
        $vehiculo->id_creador_vehiculo,
        $vehiculo->placa_vehiculo,
        $vehiculo->tipo_vehiculo,
        $vehiculo->n_serie_vehiculo,
        $vehiculo->soat_vehiculo,
        $vehiculo->vigencia_desde_vehiculo,
        $vehiculo->vigencia_hasta_vehiculo,
        $vehiculo->ultima_revision_vehiculo,
        $vehiculo->vencimiento_vehiculo,
        $vehiculo->tarjeta_propiedad_vehiculo,
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
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
