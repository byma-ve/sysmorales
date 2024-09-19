<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_num_guia = $_GET['id_num_guia'];
$consulta = obtenerConsulta($id_num_guia);
echo json_encode($consulta);
