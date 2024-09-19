<?php
include_once "../../services/cors.php";
if (!isset($_GET["id"])) {
    echo json_encode(null);
    exit;
}
$id = $_GET["id"];
include_once "funciones.php";
$resultado = eliminarDestino($id);
echo json_encode($resultado);

