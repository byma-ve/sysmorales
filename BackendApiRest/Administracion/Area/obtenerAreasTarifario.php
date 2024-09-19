<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_cliente = $_GET['id_cliente'];

$area = obtenerAreaTarifario($id_cliente);
echo json_encode($area);
