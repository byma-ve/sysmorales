<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$transportistas = obtenerTransportistas();
echo json_encode($transportistas);
