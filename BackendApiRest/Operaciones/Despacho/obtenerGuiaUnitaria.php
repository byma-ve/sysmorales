<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_num_guia_registro_carga = $_GET['id_num_guia_registro_carga'];
$guia = obtenerGuiaUnitaria($id_num_guia_registro_carga);
echo json_encode($guia);
