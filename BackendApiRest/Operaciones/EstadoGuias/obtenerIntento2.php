<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_registro_carga = $_GET['id_registro_carga'];
$guia = obtenerIntento2($id_registro_carga);
echo json_encode($guia);
