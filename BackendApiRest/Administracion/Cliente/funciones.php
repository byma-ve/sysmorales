<?php

function eliminarCliente($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE clientes SET estado = '0' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function actualizarCliente($cliente)
{
    date_default_timezone_set('America/Lima');
    $fecha_dia_hora = date("Y-m-d H:i:s");

    $bd = obtenerConexion();

    if ($cliente->alerta_credito_cliente > $cliente->limite_credito_cliente) {
        return ['success' => false, 'message' => '¡El limite de credito tiene que ser mayor!'];
    }

    if (!empty($cliente->logo_cliente)) {
        $rutaDB = guardarImagen($cliente->logo_cliente, $cliente->razon_social_cliente, $cliente->dni_cliente);
        $sentencia = 'logo_cliente = ?,';
    } else {
        $sentencia = '';
        $rutaDB = '';
    }

    $sentencia = $bd->prepare("UPDATE clientes SET razon_social_cliente=?, representante_cliente=?, clave_cliente=?, id_vendedor_usuario_cliente=?, limite_credito_cliente=?, alerta_credito_cliente=?, ubigeo_cliente=?, direccion_cliente=?, referencias_cliente=?, contacto_cliente=?, telefono_cliente=?, email_cliente=?, area_cliente=?, $sentencia fecha_actualizado = ? WHERE id = ?");

    if ($rutaDB != '') {
        $result = $sentencia->execute([
            $cliente->razon_social_cliente,
            $cliente->representante_cliente,
            $cliente->clave_cliente,
            $cliente->id_vendedor_usuario_cliente,
            $cliente->limite_credito_cliente,
            $cliente->alerta_credito_cliente,
            $cliente->ubigeo_cliente,
            $cliente->direccion_cliente,
            $cliente->referencias_cliente,
            $cliente->contacto_cliente,
            $cliente->telefono_cliente,
            $cliente->email_cliente,
            $cliente->area_cliente,
            $rutaDB,
            $fecha_dia_hora,
            $cliente->id
        ]);
        if ($result) {
            return ['success' => true, 'message' => '¡Cliente Actualizado!'];
        } else {
            return ['success' => false, 'message' => '¡No se pudo actualizar!'];
        }
    } else {
        $result = $sentencia->execute([
            $cliente->razon_social_cliente,
            $cliente->representante_cliente,
            $cliente->clave_cliente,
            $cliente->id_vendedor_usuario_cliente,
            $cliente->limite_credito_cliente,
            $cliente->alerta_credito_cliente,
            $cliente->ubigeo_cliente,
            $cliente->direccion_cliente,
            $cliente->referencias_cliente,
            $cliente->contacto_cliente,
            $cliente->telefono_cliente,
            $cliente->email_cliente,
            $cliente->area_cliente,
            $fecha_dia_hora,
            $cliente->id
        ]);
        if ($result) {
            return ['success' => true, 'message' => '¡Cliente Actualizado!'];
        } else {
            return ['success' => false, 'message' => '¡No se pudo actualizar!'];
        }
    }
}

function exportarClientes()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    c.dni_cliente, 
    c.razon_social_cliente, 
    c.representante_cliente, 
    c.clave_cliente, 
    usuario.colaborador_usuario,
    c.limite_credito_cliente, 
    c.alerta_credito_cliente, 
    dep.nombre_dep AS departamento,
    prov.nombre_prov AS provincia,
    dis.nombre_dist AS distrito,
    c.direccion_cliente, 
    c.referencias_cliente, 
    c.contacto_cliente, 
    c.telefono_cliente, 
    c.email_cliente, 
    c.area_cliente
FROM 
    clientes c
INNER JOIN 
    usuarios usuario ON usuario.id = c.id_vendedor_usuario_cliente
INNER JOIN 
    distritos dis ON c.ubigeo_cliente = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE c.estado = '1'
ORDER BY c.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerClientesTarifarios()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT clientes.id, clientes.razon_social_cliente
    FROM clientes
    WHERE clientes.estado = '1' AND clientes.id IN (
        SELECT id_cliente_tarifario_cliente_courrier AS id_cliente FROM tarifarios_clientes_courriers
        UNION
        SELECT id_cliente_tarifario_cliente_aereo AS id_cliente FROM tarifarios_clientes_aereos
        UNION
        SELECT id_cliente_tarifario_cliente_valorizado AS id_cliente FROM tarifarios_clientes_valorizados
        UNION
        SELECT id_cliente_tarifario_cliente_carga AS id_cliente FROM tarifarios_clientes_cargas
    ) ORDER BY clientes.id DESC;");
    return $sentencia->fetchAll();
}

function obtenerClientes()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT 
    c.id, 
    c.dni_cliente, 
    c.razon_social_cliente, 
    c.representante_cliente, 
    c.clave_cliente, 
    usuario.colaborador_usuario,
	usuario.id AS 'id_vendedor_usuario_cliente',  
    c.limite_credito_cliente, 
    c.alerta_credito_cliente, 
	dep.id AS departamento_id,
    dep.nombre_dep AS departamento,
	prov.id AS provincia_id, 
    prov.nombre_prov AS provincia,
	c.ubigeo_cliente,   
    dis.nombre_dist AS distrito,
    c.direccion_cliente, 
    c.referencias_cliente, 
    c.contacto_cliente, 
    c.telefono_cliente, 
    c.email_cliente, 
    c.area_cliente, 
    c.logo_cliente, 
    c.id_creador_cliente, 
    c.estado, 
    c.fecha_creado, 
    c.fecha_actualizado
FROM 
    clientes c
INNER JOIN 
    usuarios usuario ON usuario.id = c.id_vendedor_usuario_cliente
INNER JOIN 
    distritos dis ON c.ubigeo_cliente = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id
WHERE c.estado = '1'
ORDER BY c.id DESC;");
    return $sentencia->fetchAll();
}

function guardarImagen($logo_cliente, $razonSocial, $dniCliente)
{
    $nombreDestino = "$dniCliente-$razonSocial.webp";
    $rutaDestino = "../img/Clientes/" . $nombreDestino;
    if (!move_uploaded_file($logo_cliente['tmp_name'], $rutaDestino)) {
        return "Hubo un error al intentar guardar la imagen.";
    }
    $imagen = imagecreatefromstring(file_get_contents($rutaDestino));
    $imagen_redimensionada = imagescale($imagen, 180, 180);
    imagewebp($imagen_redimensionada, $rutaDestino, 80);
    imagedestroy($imagen);
    imagedestroy($imagen_redimensionada);
    return "https://bytransload.byma-ve.com/BackendApiRest/img/Clientes/" . $nombreDestino;
}

function guardarCliente($cliente)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();

    $consultaExistencia = $bd->prepare("SELECT estado FROM clientes WHERE dni_cliente = ?");
    $consultaExistencia->execute([$cliente->dni_cliente]);
    $resultadoExistencia = $consultaExistencia->fetch(PDO::FETCH_ASSOC);

    if ($resultadoExistencia) {
        if ($resultadoExistencia['estado'] == 0) {
            if (!empty($cliente->logo_cliente)) {
                $rutaDB = guardarImagen($cliente->logo_cliente, $cliente->razon_social_cliente, $cliente->dni_cliente);
            } else {
                $rutaDB = 'https://bytransload.byma-ve.com/BackendApiRest/img/Predeterminado/predeterminado.webp';
            }

            $sentencia = $bd->prepare("UPDATE clientes SET id_creador_cliente = ?, razon_social_cliente = ?, representante_cliente = ?, clave_cliente = ?, id_vendedor_usuario_cliente = ?, ubigeo_cliente = ?, direccion_cliente = ?, referencias_cliente = ?, contacto_cliente = ?, telefono_cliente = ?, email_cliente = ?, area_cliente = ?, logo_cliente = ?, fecha_creado = ?, estado = '1' WHERE dni_cliente = ?");

            return $sentencia->execute([
                $cliente->id_creador_cliente,
                $cliente->razon_social_cliente,
                $cliente->representante_cliente,
                $cliente->clave_cliente,
                $cliente->id_vendedor_usuario_cliente,
                $cliente->ubigeo_cliente,
                $cliente->direccion_cliente,
                $cliente->referencias_cliente,
                $cliente->contacto_cliente,
                $cliente->telefono_cliente,
                $cliente->email_cliente,
                $cliente->area_cliente,
                $rutaDB,
                $fecha_actual,
                $cliente->dni_cliente
            ]);
        }
        return "El cliente ya existe en la Base de Datos";
    }

    if (!empty($cliente->logo_cliente)) {
        $rutaDB = guardarImagen($cliente->logo_cliente, $cliente->razon_social_cliente, $cliente->dni_cliente);
    } else {
        // Si no hay imagen, establece una imagen por defecto
        $rutaDB = 'https://bytransload.byma-ve.com/BackendApiRest/img/Predeterminado/predeterminado.webp';
    }

    $sentencia = $bd->prepare("INSERT INTO clientes(id_creador_cliente,dni_cliente, razon_social_cliente, representante_cliente, clave_cliente, id_vendedor_usuario_cliente, limite_credito_cliente, alerta_credito_cliente, ubigeo_cliente, direccion_cliente, referencias_cliente,contacto_cliente,telefono_cliente,email_cliente,area_cliente,logo_cliente,fecha_creado) VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    return $sentencia->execute([
        $cliente->id_creador_cliente,
        $cliente->dni_cliente,
        $cliente->razon_social_cliente,
        $cliente->representante_cliente,
        $cliente->clave_cliente,
        $cliente->id_vendedor_usuario_cliente,
        $cliente->limite_credito_cliente,
        $cliente->alerta_credito_cliente,
        $cliente->ubigeo_cliente,
        $cliente->direccion_cliente,
        $cliente->referencias_cliente,
        $cliente->contacto_cliente,
        $cliente->telefono_cliente,
        $cliente->email_cliente,
        $cliente->area_cliente,
        $rutaDB,
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
