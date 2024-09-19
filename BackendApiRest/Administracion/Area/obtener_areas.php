<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$areas = obtenerAreas();
echo json_encode($areas);
