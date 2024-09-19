<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
$registros = obtenerRegistrosImprimir($fecha);
echo json_encode($registros);
