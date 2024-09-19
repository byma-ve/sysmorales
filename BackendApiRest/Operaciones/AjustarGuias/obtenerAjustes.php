<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$asignaciones = obtenerAjustes();
echo json_encode($asignaciones);