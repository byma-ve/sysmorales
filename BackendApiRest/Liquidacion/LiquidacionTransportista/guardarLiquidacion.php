<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$datos = new stdClass();

$datos->nombre_transportista = $_POST['nombre_transportista'];
$datos->num_manifiesto_liquidacion_transportista = $_POST['num_manifiesto_liquidacion_transportista'];
$datos->num_documento_liquidacion_transportista = $_POST['num_documento_liquidacion_transportista'];
$datos->tipo_documento_liquidacion_transportista = $_POST['tipo_documento_liquidacion_transportista'];
$datos->estado_documento_liquidacion_transportista = $_POST['estado_documento_liquidacion_transportista'];
$datos->pdf_liquidacion_transportista = isset($_FILES['pdf_liquidacion_transportista']) ? $_FILES['pdf_liquidacion_transportista'] : null;

$resultado = guardarLiquidacionTransportista($datos);

echo json_encode($resultado);
?>