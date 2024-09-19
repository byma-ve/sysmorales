<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$id_transportista = $_GET['id_transportista'];

$tarifa_courrier_transportista = obtenerTarifarioCourrierTransportista($id_transportista);
echo json_encode($tarifa_courrier_transportista);
