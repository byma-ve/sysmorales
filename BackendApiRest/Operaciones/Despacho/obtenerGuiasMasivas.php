<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$guias = obtenerGuiasMasivas();
echo json_encode($guias);
