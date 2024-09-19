<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$id_agente = $_GET['id_agente'];

$tarifa_courrier_cliente = obtenerTarifarioAereoAgente($id_agente);
echo json_encode($tarifa_courrier_cliente);
