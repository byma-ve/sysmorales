<?php
function guardarAsignacion($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if ($data['opcionSeleccionada'] == "externos") {

        if (
            empty($data['dni_auxiliar_recojo']) || empty($data['dni_conductor_recojo']) || empty($data['id_orden_servicio_recojo'])
            || empty($data['id_proveedor_recojo']) || empty($data['nombre_auxiliar_recojo']) || empty($data['nombre_conductor_recojo'])
        ) {
            return ['success' => false, 'message' => 'Error: ¡Debe llenar todos los campos!', 'datos' => $data];
        }
        if (!is_numeric($data['dni_auxiliar_recojo']) || !is_numeric($data['dni_conductor_recojo'])) {
            return ['success' => false, 'message' => 'Error: ¡Los campos DNI debe ser numerico!', 'datos' => $data];
        }

        $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM asignacion_recojos WHERE id_orden_servicio_recojo = :id_orden_servicio_recojo");
        $stmt_verificar->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
        $stmt_verificar->execute();
        $existe = $stmt_verificar->fetchColumn();

        if (!$existe) {
            $sql = "INSERT INTO asignacion_recojos(fecha_creado, id_orden_servicio_recojo, id_proveedor_recojo, dni_conductor_recojo, nombre_conductor_recojo, dni_auxiliar_recojo, nombre_auxiliar_recojo) 
            VALUES (:fecha_creado, :id_orden_servicio_recojo, :id_proveedor_recojo, :dni_conductor_recojo, :nombre_conductor_recojo, :dni_auxiliar_recojo, :nombre_auxiliar_recojo)";

            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':fecha_creado', $fecha_actual);
            $stmt->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
            $stmt->bindParam(':id_proveedor_recojo', $data['id_proveedor_recojo']);
            $stmt->bindParam(':dni_conductor_recojo', $data['dni_conductor_recojo']);
            $stmt->bindParam(':nombre_conductor_recojo', $data['nombre_conductor_recojo']);
            $stmt->bindParam(':dni_auxiliar_recojo', $data['dni_auxiliar_recojo']);
            $stmt->bindParam(':nombre_auxiliar_recojo', $data['nombre_auxiliar_recojo']);
            if ($stmt->execute()) {
                return ['success' => true, 'message' => '¡Asignado Correctamente!', 'datos' => $data];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo Asignar!', 'datos' => $data];
            }
        } else {
            $sql = "UPDATE asignacion_recojos 
            SET 
                id_proveedor_recojo = :id_proveedor_recojo,
                dni_conductor_recojo = :dni_conductor_recojo,
                nombre_conductor_recojo = :nombre_conductor_recojo,
                dni_auxiliar_recojo = :dni_auxiliar_recojo,
                nombre_auxiliar_recojo = :nombre_auxiliar_recojo,
                id_conductor_recojo = null,
                id_auxiliar_recojo = null
            WHERE id_orden_servicio_recojo = :id_orden_servicio_recojo";

            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
            $stmt->bindParam(':id_proveedor_recojo', $data['id_proveedor_recojo']);
            $stmt->bindParam(':dni_conductor_recojo', $data['dni_conductor_recojo']);
            $stmt->bindParam(':nombre_conductor_recojo', $data['nombre_conductor_recojo']);
            $stmt->bindParam(':dni_auxiliar_recojo', $data['dni_auxiliar_recojo']);
            $stmt->bindParam(':nombre_auxiliar_recojo', $data['nombre_auxiliar_recojo']);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => '¡Actualizado Correctamente!', 'datos' => $data];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo Actualizar!', 'datos' => $data];
            }
        }
    } else {
        if (
            empty($data['id_conductor_recojo']) || empty($data['id_auxiliar_recojo']) || empty($data['id_orden_servicio_recojo'])
        ) {
            return ['success' => false, 'message' => 'Error: ¡Debe llenar todos los campos!', 'datos' => $data];
        }

        $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM asignacion_recojos WHERE id_orden_servicio_recojo = :id_orden_servicio_recojo");
        $stmt_verificar->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
        $stmt_verificar->execute();
        $existe = $stmt_verificar->fetchColumn();

        if (!$existe) {

            $sql = "INSERT INTO asignacion_recojos(fecha_creado, id_orden_servicio_recojo, id_conductor_recojo, id_auxiliar_recojo) 
            VALUES (:fecha_creado, :id_orden_servicio_recojo, :id_conductor_recojo, :id_auxiliar_recojo)";

            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':fecha_creado', $fecha_actual);
            $stmt->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
            $stmt->bindParam(':id_conductor_recojo', $data['id_conductor_recojo']);
            $stmt->bindParam(':id_auxiliar_recojo', $data['id_auxiliar_recojo']);
            if ($stmt->execute()) {
                return ['success' => true, 'message' => '¡Asignado Correctamente!', 'datos' => $data];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo Asignar!', 'datos' => $data];
            }
        } else {
            $sql = "UPDATE asignacion_recojos 
            SET 
                id_proveedor_recojo = null,
                dni_conductor_recojo = null,
                nombre_conductor_recojo = null,
                dni_auxiliar_recojo = null,
                nombre_auxiliar_recojo = null,
                id_conductor_recojo = :id_conductor_recojo,
                id_auxiliar_recojo = :id_auxiliar_recojo
            WHERE id_orden_servicio_recojo = :id_orden_servicio_recojo";

            $stmt = $bd->prepare($sql);
            $stmt->bindParam(':id_orden_servicio_recojo', $data['id_orden_servicio_recojo']);
            $stmt->bindParam(':id_conductor_recojo', $data['id_conductor_recojo']);
            $stmt->bindParam(':id_auxiliar_recojo', $data['id_auxiliar_recojo']);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => '¡Actualizado Correctamente!', 'datos' => $data];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo Actualizar!', 'datos' => $data];
            }
        }
    }
}

function obtenerAsignaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    p.*, a.*, c.razon_social_cliente, u.DEPARTAMENTO AS departamento, u.PROVINCIA AS provincia, u.DESTINO AS distrito,
    usu_conductor.colaborador_usuario AS nombre_conductor, usu_auxiliar.colaborador_usuario AS nombre_auxiliar
FROM 
    programaciones p
LEFT JOIN 
    asignacion_recojos a ON a.id_orden_servicio_recojo = p.id_orden_servicio
INNER JOIN 
    clientes c ON c.id = p.id_cliente_programacion
INNER JOIN 
    ubigeo u ON u.UBIGEO = p.ubigeo_programacion
LEFT JOIN 
    usuarios usu_conductor ON usu_conductor.id = a.id_conductor_recojo
LEFT JOIN 
    usuarios usu_auxiliar ON usu_auxiliar.id = a.id_auxiliar_recojo
    ORDER BY p.id DESC;
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
