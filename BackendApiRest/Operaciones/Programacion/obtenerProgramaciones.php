<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$programaciones = obtenerProgramaciones();
echo json_encode($programaciones);
