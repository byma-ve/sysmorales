<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$vehiculos = exportarVehiculos();
echo json_encode($vehiculos);
