<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$lista = obtenerSeguimiento();
echo json_encode($lista);
