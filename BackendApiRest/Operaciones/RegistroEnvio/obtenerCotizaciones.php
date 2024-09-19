<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$cotizaciones = obtenerCotizaciones();
echo json_encode($cotizaciones);
