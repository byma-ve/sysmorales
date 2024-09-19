<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_cotizacion = $_GET['id_cotizacion'];
$datosPdf = obtenerDatosPdf($id_cotizacion);
echo json_encode($datosPdf);
