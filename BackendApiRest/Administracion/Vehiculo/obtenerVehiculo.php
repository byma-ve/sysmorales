<?php 
include_once "../../services/cors.php";
include_once "funciones.php";

$id = $_GET['id'];
$vehiculo = obtenerVehiculo($id);
echo json_encode($vehiculo);

?>