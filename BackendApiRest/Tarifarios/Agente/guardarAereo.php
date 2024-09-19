<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$id_agente = $data['id_agente'];
$id_usuario = $data['id_usuario'];
$datos = $data['data'];

$resultado = guardarAereo($id_agente, $datos, $id_usuario);
echo json_encode($resultado);
