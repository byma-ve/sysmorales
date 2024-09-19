<?php
include_once "../services/cors.php";
include_once "funciones.php";

$accion = isset($_GET['action']) ? $_GET['action'] : null;
$id = isset($_GET['id']) ? $_GET['id'] : null;

$ubigeo = selectUbigeo($accion, $id);  // Cambié selectUbigeo a obtenerUbigeo
header('Content-Type: application/json');
echo json_encode($ubigeo);
?>
