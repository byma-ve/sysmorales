<?php
include_once "../../services/cors.php";
include_once "funciones.php";

// Obtén los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"));

$cantidadMerc = isset($data->cantidadMerc) && $data->cantidadMerc !== '' ? intval($data->cantidadMerc) : 0;
$pesoMerc = isset($data->pesoMerc) && $data->pesoMerc !== '' ? intval($data->pesoMerc) : 0;
$largo = isset($data->largo) && $data->largo !== '' ? floatval($data->largo) : 0;
$ancho = isset($data->ancho) && $data->ancho !== '' ? floatval($data->ancho) : 0;
$alto = isset($data->alto) && $data->alto !== '' ? floatval($data->alto) : 0;
$ubigeo = isset($data->distritoSeleccionada) && $data->distritoSeleccionada !== '' ? $data->distritoSeleccionada : '';
$id_cliente = isset($data->id_cliente) && $data->id_cliente !== '' ? $data->id_cliente : '';
$id_area = isset($data->id_area) && $data->id_area !== '' ? $data->id_area : '';
$tipoTarifario = isset($data->tipoTarifario) && $data->tipoTarifario !== '' ? $data->tipoTarifario : '';
$valorSeleccionado = isset($data->valorSeleccionado) && $data->valorSeleccionado !== '' ? $data->valorSeleccionado : '';

$result = totalTarifa($cantidadMerc, $pesoMerc, $largo, $ancho, $alto, $ubigeo, $id_cliente, $id_area, $tipoTarifario, $valorSeleccionado);

echo json_encode($result);
