<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id = $_GET['id'];
$datosProveedor = datosProveedor($id);
echo json_encode($datosProveedor);
