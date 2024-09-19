<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$recojo = new stdClass();
$recojo->orden_servicio_liquidacion_cliente = $_POST['orden_servicio_liquidacion_cliente'];
$recojo->num_documento_liquidacion_cliente = $_POST['num_documento_liquidacion_cliente'];
$recojo->estado_documento_liquidacion_cliente = $_POST['estado_documento_liquidacion_cliente'];
$recojo->pdf_liquidacion_cliente = isset($_FILES['pdf_liquidacion_cliente']) ? $_FILES['pdf_liquidacion_cliente'] : null;

$resultado = guardarLiquidacion($recojo);

echo json_encode($resultado);
?>