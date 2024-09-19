<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_transportista = $_GET['id_transportista'];
$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$liquidaciones = exportarLiquidacionTransportista($id_transportista, $fechaDesde, $fechaHasta);
echo json_encode($liquidaciones);
