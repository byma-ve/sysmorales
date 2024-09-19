<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$validaciones = exportarValidaciones();
echo json_encode($validaciones);