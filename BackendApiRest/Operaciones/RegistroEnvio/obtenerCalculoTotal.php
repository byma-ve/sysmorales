<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_cliente = $_GET['id_cliente'];
$id_area = $_GET['id_area'];
$calculo = obtenerCalculoTotal($id_cliente, $id_area);
echo json_encode($calculo);
