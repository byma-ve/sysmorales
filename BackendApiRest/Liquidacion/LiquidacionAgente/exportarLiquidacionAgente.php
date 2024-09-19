<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_agente = $_GET['id_agente'];
$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$liquidaciones = exportarLiquidacionAgente($id_agente, $fechaDesde, $fechaHasta);
echo json_encode($liquidaciones);
