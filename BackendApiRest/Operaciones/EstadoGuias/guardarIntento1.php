<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$recojo = new stdClass();
$recojo->id_num_guia_estado_guia = $_POST['id_num_guia_estado_guia'];
$recojo->num_intento_estado_guia = $_POST['num_intento_estado_guia'];
$recojo->proceso_estado_guia = $_POST['proceso_estado_guia'];
$recojo->estado_mercancia_estado_guia = $_POST['estado_mercancia_estado_guia'];
$recojo->fecha_proceso_estado_guia = $_POST['fecha_proceso_estado_guia'];
$recojo->comentario_estado_guia = $_POST['comentario_estado_guia'];
$recojo->id_creador_estado_guia = $_POST['id_creador_estado_guia'];
$recojo->imagen_1_estado_guia = isset($_FILES['imagen_1_estado_guia']) ? $_FILES['imagen_1_estado_guia'] : '';
$recojo->imagen_2_estado_guia = isset($_FILES['imagen_2_estado_guia']) ? $_FILES['imagen_2_estado_guia'] : '';
$recojo->imagen_3_estado_guia = isset($_FILES['imagen_3_estado_guia']) ? $_FILES['imagen_3_estado_guia'] : '';
$recojo->imagen_4_estado_guia = isset($_FILES['imagen_4_estado_guia']) ? $_FILES['imagen_4_estado_guia'] : '';
$recojo->imagen_5_estado_guia = isset($_FILES['imagen_5_estado_guia']) ? $_FILES['imagen_5_estado_guia'] : '';
$recojo->imagen_6_estado_guia = isset($_FILES['imagen_6_estado_guia']) ? $_FILES['imagen_6_estado_guia'] : '';

$resultado = guardarIntento1($recojo);

echo json_encode($resultado);
?>