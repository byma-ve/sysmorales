<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id = $_GET['id'];
$listas = obtenerListaTransportista($id);
echo json_encode($listas);
