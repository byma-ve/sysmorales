<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$vehiculos = obtenerVehiculos();
echo json_encode($vehiculos);
