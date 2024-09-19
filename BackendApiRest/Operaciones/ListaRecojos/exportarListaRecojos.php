<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$recojos = exportarListaRecojos($fechaDesde, $fechaHasta);
echo json_encode($recojos);
