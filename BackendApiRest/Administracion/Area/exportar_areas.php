<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$areas = exportarAreas();
echo json_encode($areas);