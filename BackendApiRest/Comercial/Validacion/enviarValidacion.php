<?php
include_once "../../services/cors.php";
if (!isset($_GET["id_cotizacion"]) || !isset($_GET["id_creador"])) {
    echo json_encode(null);
    exit;
}
$id = $_GET["id_cotizacion"];
$id_creador = $_GET["id_creador"];

include_once "funciones.php";
$resultado = enviarValidacion($id, $id_creador);
echo json_encode($resultado);
