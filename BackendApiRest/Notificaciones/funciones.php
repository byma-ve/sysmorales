<?php
function mostrarNotificacionesEnviados($id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT 
        n.*,
        u_emisor.colaborador_usuario AS emisor,
        u_emisor.foto_usuario AS foto_emisor,
        (SELECT GROUP_CONCAT(u_receptor_sub.colaborador_usuario SEPARATOR ', ')
        FROM notificaciones noti_sub
        LEFT JOIN usuarios u_receptor_sub ON u_receptor_sub.id = noti_sub.id_usuario_receptor_notificacion
        WHERE noti_sub.id_grupal_notificacion = n.id_grupal_notificacion
        GROUP BY n.id_grupal_notificacion
        ) AS colaboradores_receptores
        FROM notificaciones n
        LEFT JOIN usuarios u_receptor ON u_receptor.id = n.id_usuario_receptor_notificacion
        LEFT JOIN usuarios u_emisor ON u_emisor.id = n.id_usuario_emisor_notificacion
        WHERE n.id_usuario_emisor_notificacion = :id_usuario_receptor
        AND n.fecha_vigencia_notificacion >= :fecha
        GROUP BY n.id_grupal_notificacion
        ORDER BY n.id DESC;         
        "
    );
    $recojo->bindParam(':id_usuario_receptor', $id_usuario);
    $recojo->bindParam(':fecha', $fecha_actual);
    $recojo->execute();
    $result = $recojo->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function obtenerConteoNotificaciones($id){
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT 
        COUNT(DISTINCT(id_grupal_notificacion)) AS conteo_notis
        FROM notificaciones
        WHERE id_usuario_receptor_notificacion = :id_usuario_receptor AND visto_notificacion = 0
        AND fecha_vigencia_notificacion >= :fecha
        ;        
        "
    );
    $recojo->bindParam(':id_usuario_receptor', $id);
    $recojo->bindParam(':fecha', $fecha_actual);
    $recojo->execute();
    $result = $recojo->fetch(PDO::FETCH_ASSOC);
    return $result;
}
function actualizarVisto($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("UPDATE notificaciones SET visto_notificacion = '1' WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}


function mostrarNotificaciones($id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT 
        n.*,
        u_emisor.colaborador_usuario AS emisor,
        u_emisor.foto_usuario AS foto_emisor,
        (SELECT GROUP_CONCAT(u_receptor_sub.colaborador_usuario SEPARATOR ', ')
        FROM notificaciones noti_sub
        LEFT JOIN usuarios u_receptor_sub ON u_receptor_sub.id = noti_sub.id_usuario_receptor_notificacion
        WHERE noti_sub.id_grupal_notificacion = n.id_grupal_notificacion
        GROUP BY n.id_grupal_notificacion
        ) AS colaboradores_receptores
        FROM notificaciones n
        LEFT JOIN usuarios u_receptor ON u_receptor.id = n.id_usuario_receptor_notificacion
        LEFT JOIN usuarios u_emisor ON u_emisor.id = n.id_usuario_emisor_notificacion
        WHERE n.id_usuario_receptor_notificacion = :id_usuario_receptor
        AND n.fecha_vigencia_notificacion >= :fecha
        GROUP BY n.id_grupal_notificacion
        ORDER BY n.id DESC;        
        "
    );
    $recojo->bindParam(':id_usuario_receptor', $id_usuario);
    $recojo->bindParam(':fecha', $fecha_actual);
    $recojo->execute();
    $result = $recojo->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function guardarNofiticacion($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();

    $stmt = $bd->prepare("SELECT MAX(CAST(SUBSTRING(id_grupal_notificacion, 4) AS UNSIGNED)) AS max_id
    FROM notificaciones
    WHERE id_grupal_notificacion LIKE 'NT-%';");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $max_id_notificacion = $row['max_id'];
    if ($max_id_notificacion === NULL) {
        $id_notificacion = 'NT-1';
    } else {
        $numeric_part = $max_id_notificacion + 1;
        $id_notificacion = 'NT-' . $numeric_part;
    }

    if (strpos($data['id_receptor'], ',') === false) {
        $sql = "INSERT INTO notificaciones(id_grupal_notificacion,id_usuario_receptor_notificacion,id_usuario_emisor_notificacion,titulo_notificacion,mensaje_notificacion,fecha_vigencia_notificacion, fecha_creado) 
        VALUES (:id_grupal_notificacion,:id_usuario_receptor_notificacion, :id_usuario_emisor_notificacion, :titulo_notificacion, :mensaje_notificacion, :fecha_vigencia_notificacion, :fecha_creado)";
        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_grupal_notificacion', $id_notificacion);
        $stmt->bindParam(':id_usuario_receptor_notificacion', $data['id_receptor']);
        $stmt->bindParam(':id_usuario_emisor_notificacion', $data['id_emisor']);
        $stmt->bindParam(':titulo_notificacion', $data['tituloNotificacion']);
        $stmt->bindParam(':mensaje_notificacion', $data['mensaje']);
        $stmt->bindParam(':fecha_vigencia_notificacion', $data['fechaVigente']);
        $stmt->bindParam(':fecha_creado', $fecha_actual);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => '¡Enviado con Éxito!', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo Enviar!', 'datos' => $data];
        }
    } else {
        $receptores = explode(',', $data['id_receptor']);
        foreach ($receptores as $receptor) {
            $sql = "INSERT INTO notificaciones(id_grupal_notificacion,id_usuario_receptor_notificacion,id_usuario_emisor_notificacion,titulo_notificacion,mensaje_notificacion,fecha_vigencia_notificacion, fecha_creado) 
            VALUES (:id_grupal_notificacion,:id_usuario_receptor_notificacion, :id_usuario_emisor_notificacion, :titulo_notificacion, :mensaje_notificacion, :fecha_vigencia_notificacion, :fecha_creado)";
            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':id_grupal_notificacion', $id_notificacion);
            $stmt->bindParam(':id_usuario_receptor_notificacion', $receptor);
            $stmt->bindParam(':id_usuario_emisor_notificacion', $data['id_emisor']);
            $stmt->bindParam(':titulo_notificacion', $data['tituloNotificacion']);
            $stmt->bindParam(':mensaje_notificacion', $data['mensaje']);
            $stmt->bindParam(':fecha_vigencia_notificacion', $data['fechaVigente']);
            $stmt->bindParam(':fecha_creado', $fecha_actual);
            $stmt->execute();
        }
        return ['success' => true, 'message' => '¡Enviado con Éxito!', 'datos' => $data];
    }
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
