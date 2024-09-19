<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$conductores = obtenerConductores();
echo json_encode($conductores);
