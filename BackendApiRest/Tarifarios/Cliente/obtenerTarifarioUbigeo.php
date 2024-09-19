<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$id_cliente = $_GET['id_cliente'];
$id_area = $_GET['id_area'];
$ubigeo = $_GET['ubigeo'];
$tarifario = $_GET['tarifario'];

$tarifa_ubigeo = obtenerTarifarioUbigeo($id_cliente, $id_area, $ubigeo, $tarifario);
echo json_encode($tarifa_ubigeo);
