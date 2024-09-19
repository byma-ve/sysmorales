<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$auxiliares = obtenerAuxiliares();
echo json_encode($auxiliares);
