<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id = $_GET['id'];
$datosAuxiliar = datosAuxiliar($id);
echo json_encode($datosAuxiliar);
