<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$agentes = obtenerAgentes();
echo json_encode($agentes);
