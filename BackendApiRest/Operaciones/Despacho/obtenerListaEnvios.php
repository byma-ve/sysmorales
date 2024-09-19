<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$envios = obtenerListaEnvios();
echo json_encode($envios);
