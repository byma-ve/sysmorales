<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$recojos = obtenerGuias();
echo json_encode($recojos);
