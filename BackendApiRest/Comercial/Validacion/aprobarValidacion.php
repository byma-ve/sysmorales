<?php
include_once "../../services/cors.php";
if (!isset($_GET["id_cotizacion"]) || !isset($_GET["id_usuario"])) {
    echo json_encode(null);
    exit;
}
$id = $_GET["id_cotizacion"];
$id_usuario = $_GET["id_usuario"];

include_once "funciones.php";
$resultado = aprobarValidacion($id, $id_usuario);
echo json_encode($resultado);
