<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$asignaciones = obtenerAsignaciones();
echo json_encode($asignaciones);
