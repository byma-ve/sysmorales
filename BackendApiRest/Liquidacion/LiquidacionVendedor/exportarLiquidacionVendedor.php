<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_usuario = $_GET['id_usuario'];
$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$liquidaciones = exportarLiquidacionVendedor($id_usuario, $fechaDesde, $fechaHasta);
echo json_encode($liquidaciones);
