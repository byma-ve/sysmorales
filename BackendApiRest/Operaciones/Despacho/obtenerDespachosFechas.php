<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$despachos = obtenerDespachosFechas($fechaDesde, $fechaHasta);
echo json_encode($despachos);
