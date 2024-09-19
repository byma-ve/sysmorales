<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$validaciones = obtenerValidaciones();
echo json_encode($validaciones);
