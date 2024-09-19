<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$recojo = new stdClass();
$recojo->id_orden_servicio_estado_recojo = $_POST['id_orden_servicio_estado_recojo'];
$recojo->proceso_estado_recojo = $_POST['proceso_estado_recojo'];
$recojo->estado_mercancia_estado_recojo = $_POST['estado_mercancia_estado_recojo'];
$recojo->comentario_estado_recojo = $_POST['comentario_estado_recojo'];
$recojo->fecha_creado = $_POST['fecha_creado'];
$recojo->id_creador_estado_recojo = $_POST['id_creador_estado_recojo'];
$recojo->imagen_estado_recojo = isset($_FILES['imagen_estado_recojo']) ? $_FILES['imagen_estado_recojo'] : null;

$resultado = guardarRecojo($recojo);

echo json_encode($resultado);
?>