<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$datos = new stdClass();

$datos->nombre_agente = $_POST['nombre_agente'];
$datos->num_manifiesto_liquidacion_agente = $_POST['num_manifiesto_liquidacion_agente'];
$datos->id_agente_liquidacion_agente = $_POST['id_agente_liquidacion_agente'];
$datos->num_documento_liquidacion_agente = $_POST['num_documento_liquidacion_agente'];
$datos->tipo_documento_liquidacion_agente = $_POST['tipo_documento_liquidacion_agente'];
$datos->estado_documento_liquidacion_agente = $_POST['estado_documento_liquidacion_agente'];
$datos->pdf_liquidacion_agente = isset($_FILES['pdf_liquidacion_agente']) ? $_FILES['pdf_liquidacion_agente'] : null;

$resultado = guardarLiquidacionAgente($datos);

echo json_encode($resultado);
?>