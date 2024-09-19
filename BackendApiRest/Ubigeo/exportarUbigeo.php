<?php
include_once "../services/cors.php";
include_once "funciones.php";
$ubigeo = exportarUbigeo();
echo json_encode($ubigeo);