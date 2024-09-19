<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$num_manifiesto = $_GET['num_manifiesto'];
$despachos = obtenerAgentesManifiesto($num_manifiesto);
echo json_encode($despachos);
