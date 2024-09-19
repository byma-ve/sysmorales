<?php
include_once "../../services/cors.php";
include_once "funciones.php";

// Obtén los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"));

$valorMercancia = isset($data->valorMercancia) && $data->valorMercancia !== '' ? floatval($data->valorMercancia) : 0;
$packing = isset($data->packing) && $data->packing !== '' ? floatval($data->packing) : 0;
$costoRetorno = isset($data->costoRetorno) && $data->costoRetorno !== '' ? floatval($data->costoRetorno) : 0;
$estibaDesestiba = isset($data->estibaDesestiba) && $data->estibaDesestiba !== '' ? floatval($data->estibaDesestiba) : 0;
$montaCarga = isset($data->montaCarga) && $data->montaCarga !== '' ? floatval($data->montaCarga) : 0;
$transporteExtra = isset($data->transporteExtra) && $data->transporteExtra !== '' ? floatval($data->transporteExtra) : 0;

$result = totalAdicionales($valorMercancia, $packing, $costoRetorno, $estibaDesestiba, $montaCarga, $transporteExtra);

echo json_encode($result);
