<?php

function datosProveedor($id)
{
    $bd = obtenerConexion();
    $proveedor = $bd->prepare(
        "SELECT p.*,u.DEPARTAMENTO,u.PROVINCIA,u.DESTINO FROM proveedores p
        INNER JOIN ubigeo u
        ON p.ubigeo_proveedor = u.UBIGEO
        WHERE p.id = :id;
        "
    );
    $proveedor->bindParam(':id', $id);
    $proveedor->execute();
    $data = $proveedor->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function eliminarProveedor($id)
{

    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE proveedores SET estado = '0' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function actualizarProveedor($proveedor)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s");

    $bd = obtenerConexion();

    $sentencia = $bd->prepare("UPDATE proveedores SET 
    razon_social_proveedor = ?,
    representante_proveedor = ?,
    clave_proveedor = ?,
    tipo_proveedor = ?,
    tipo_servicio_proveedor = ?,
    ubigeo_proveedor = ?,
    direccion_proveedor = ?,
    referencias_proveedor = ?,
    contacto_proveedor = ?,
    telefono_proveedor = ?,
    email_proveedor = ?,
    fecha_actualizado = ?
    WHERE id = ?;");

    return $sentencia->execute([
        $proveedor->razon_social_proveedor,
        $proveedor->representante_proveedor,
        $proveedor->clave_proveedor,
        $proveedor->tipo_proveedor,
        $proveedor->tipo_servicio_proveedor,
        $proveedor->ubigeo_proveedor,
        $proveedor->direccion_proveedor,
        $proveedor->referencias_proveedor,
        $proveedor->contacto_proveedor,
        $proveedor->telefono_proveedor,
        $proveedor->email_proveedor,
        $fecha_dia_hora,
        $proveedor->id
    ]);
}

function exportarProveedores()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    p.dni_proveedor, 
    p.razon_social_proveedor, 
    p.representante_proveedor, 
    p.clave_proveedor, 
    p.tipo_proveedor,
    p.tipo_servicio_proveedor,
    dep.nombre_dep AS departamento,
    prov.nombre_prov AS provincia,
    dis.nombre_dist AS distrito,
    p.direccion_proveedor, 
    p.referencias_proveedor, 
    p.contacto_proveedor, 
    p.telefono_proveedor, 
    p.email_proveedor
FROM 
    proveedores p
INNER JOIN 
    distritos dis ON p.ubigeo_proveedor = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE p.estado = '1'
ORDER BY p.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerProveedores()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    p.id, 
    p.dni_proveedor, 
    p.razon_social_proveedor, 
    p.representante_proveedor, 
    p.clave_proveedor, 
    p.tipo_proveedor,
    p.tipo_servicio_proveedor,
	dep.id AS departamento_id,
    dep.nombre_dep AS departamento,
	prov.id AS provincia_id, 
    prov.nombre_prov AS provincia,
	p.ubigeo_proveedor,   
    dis.nombre_dist AS distrito,
    p.direccion_proveedor, 
    p.referencias_proveedor, 
    p.contacto_proveedor, 
    p.telefono_proveedor, 
    p.email_proveedor, 
    p.id_creador_proveedor, 
    p.estado, 
    p.fecha_creado, 
    p.fecha_actualizado
FROM 
    proveedores p
INNER JOIN 
    distritos dis ON p.ubigeo_proveedor = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE p.estado = '1'
ORDER BY p.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerTransportistas()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    p.id, 
    p.dni_proveedor, 
    p.razon_social_proveedor, 
    p.representante_proveedor, 
    p.clave_proveedor, 
    p.tipo_proveedor,
    p.tipo_servicio_proveedor,
	dep.id AS departamento_id,
    dep.nombre_dep AS departamento,
	prov.id AS provincia_id, 
    prov.nombre_prov AS provincia,
	p.ubigeo_proveedor,   
    dis.nombre_dist AS distrito,
    p.direccion_proveedor, 
    p.referencias_proveedor, 
    p.contacto_proveedor, 
    p.telefono_proveedor, 
    p.email_proveedor, 
    p.id_creador_proveedor, 
    p.estado, 
    p.fecha_creado, 
    p.fecha_actualizado
FROM 
    proveedores p
INNER JOIN 
    distritos dis ON p.ubigeo_proveedor = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE p.tipo_proveedor = 'transportista' AND p.estado = '1' ORDER BY p.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerAgentes()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    p.id, 
    p.dni_proveedor, 
    p.razon_social_proveedor, 
    p.representante_proveedor, 
    p.clave_proveedor, 
    p.tipo_proveedor,
    p.tipo_servicio_proveedor,
	dep.id AS departamento_id,
    dep.nombre_dep AS departamento,
	prov.id AS provincia_id, 
    prov.nombre_prov AS provincia,
	p.ubigeo_proveedor,   
    dis.nombre_dist AS distrito,
    p.direccion_proveedor, 
    p.referencias_proveedor, 
    p.contacto_proveedor, 
    p.telefono_proveedor, 
    p.email_proveedor, 
    p.id_creador_proveedor, 
    p.estado, 
    p.fecha_creado, 
    p.fecha_actualizado
FROM 
    proveedores p
INNER JOIN 
    distritos dis ON p.ubigeo_proveedor = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE p.tipo_proveedor = 'agente' AND p.estado = '1' ORDER BY p.id DESC;");
    return $sentencia->fetchAll();
}

function guardarProveedor($proveedor)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();

    $consultaExistencia = $bd->prepare("SELECT estado FROM proveedores WHERE dni_proveedor = ?");
    $consultaExistencia->execute([$proveedor->dni_proveedor]);
    $resultadoExistencia = $consultaExistencia->fetch(PDO::FETCH_ASSOC);

    if ($resultadoExistencia) {
        if ($resultadoExistencia['estado'] == 0) {
            $sentencia = $bd->prepare("UPDATE proveedores SET id_creador_proveedor = ?, razon_social_proveedor = ?, representante_proveedor = ?, clave_proveedor = ?, tipo_proveedor = ?, tipo_servicio_proveedor = ?, ubigeo_proveedor = ?, direccion_proveedor = ?, referencias_proveedor = ?, contacto_proveedor = ?, telefono_proveedor = ?, email_proveedor = ?, fecha_creado = ?, estado = '1' WHERE dni_proveedor = ?");

            return $sentencia->execute([
                $proveedor->id_creador_proveedor,
                $proveedor->razon_social_proveedor,
                $proveedor->representante_proveedor,
                $proveedor->clave_proveedor,
                $proveedor->tipo_proveedor,
                $proveedor->tipo_servicio_proveedor,
                $proveedor->ubigeo_proveedor,
                $proveedor->direccion_proveedor,
                $proveedor->referencias_proveedor,
                $proveedor->contacto_proveedor,
                $proveedor->telefono_proveedor,
                $proveedor->email_proveedor,
                $fecha_actual,
                $proveedor->dni_proveedor
            ]);
        }
        return "Ya existe un proveedor con el mismo DNI/RUC";
    }


    $sentencia = $bd->prepare("INSERT INTO proveedores(id_creador_proveedor,dni_proveedor, razon_social_proveedor, representante_proveedor, clave_proveedor, tipo_proveedor, tipo_servicio_proveedor, ubigeo_proveedor, direccion_proveedor, referencias_proveedor, contacto_proveedor, telefono_proveedor, email_proveedor, fecha_creado) 
    VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");

    return $sentencia->execute([
        $proveedor->id_creador_proveedor,
        $proveedor->dni_proveedor,
        $proveedor->razon_social_proveedor,
        $proveedor->representante_proveedor,
        $proveedor->clave_proveedor,
        $proveedor->tipo_proveedor,
        $proveedor->tipo_servicio_proveedor,
        $proveedor->ubigeo_proveedor,
        $proveedor->direccion_proveedor,
        $proveedor->referencias_proveedor,
        $proveedor->contacto_proveedor,
        $proveedor->telefono_proveedor,
        $proveedor->email_proveedor,
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
