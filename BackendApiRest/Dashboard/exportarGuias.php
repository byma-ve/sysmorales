<?php
include_once "../services/cors.php";
include_once "funciones.php";
$guias = exportarGuias();
echo json_encode($guias);
