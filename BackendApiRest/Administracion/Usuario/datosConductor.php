<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id = $_GET['id'];
$datosConductor = datosConductor($id);
echo json_encode($datosConductor);
