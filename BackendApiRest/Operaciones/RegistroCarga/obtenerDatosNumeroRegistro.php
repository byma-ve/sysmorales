<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_orden_servicio_id_destino = $_GET['id_orden_servicio_id_destino'];
$registro = obtenerDatosNumeroRegistro($id_orden_servicio_id_destino);
echo json_encode($registro);
