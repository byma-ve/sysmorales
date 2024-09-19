<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_cliente = $_GET['id_cliente'];
$id_area = $_GET['id_area'];
$fechaDesde = $_GET['fechaDesde'];
$fechaHasta = $_GET['fechaHasta'];
$seguimiento = exportarSeguimiento($id_cliente, $id_area, $fechaDesde, $fechaHasta);
echo json_encode($seguimiento);
