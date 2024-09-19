<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$liquidaciones = ObtenerLiquidaciones();
echo json_encode($liquidaciones);
