<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$id_agente = $_GET['id_agente'];

$exportar = exportarCourrier($id_agente);
echo json_encode($exportar);
