<?php
include_once "../../services/cors.php";
if (!isset($_GET["id_cotizacion"])) {
    echo json_encode(null);
    exit;
}
$id = $_GET["id_cotizacion"];
include_once "funciones.php";
$resultado = eliminarCotizacion($id);
echo json_encode($resultado);

