<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$guias = obtenerGuiasUnitarias();
echo json_encode($guias);
