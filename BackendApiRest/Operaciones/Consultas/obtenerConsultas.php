<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$lista = obtenerConsultas();
echo json_encode($lista);
