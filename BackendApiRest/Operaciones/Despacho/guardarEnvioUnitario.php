<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$data = json_decode(file_get_contents('php://input'), true);

header('Content-Type: application/json');

$resultado = guardarEnvioUnitario($data);

echo json_encode($resultado);
?>
