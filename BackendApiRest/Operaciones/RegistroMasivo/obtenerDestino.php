<?php
include_once "../../services/cors.php";
include_once "funciones.php";
header("Content-Type: application/json");
$id_destino_cotizacion = $_GET['id_destino_cotizacion'];

$destino = obtenerDestino($id_destino_cotizacion);
echo json_encode($destino);
?>