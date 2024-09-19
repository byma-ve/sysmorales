<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id_cliente = $data['id_cliente'];
$id_area = $data['id_area'];
$id_usuario = $data['id_usuario'];
$datos = $data['data'];

$resultado = guardarDestino($id_cliente, $id_area, $datos, $id_usuario);

echo json_encode($resultado);
?>
