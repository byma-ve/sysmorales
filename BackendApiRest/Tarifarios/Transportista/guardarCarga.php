<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id_transportista = $data['id_transportista'];
$id_usuario = $data['id_usuario'];
$datos = $data['data'];

$resultado = guardarCarga($id_transportista, $datos, $id_usuario);
echo json_encode($resultado);
