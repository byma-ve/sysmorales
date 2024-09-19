<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$lista = exportarDespachos();
echo json_encode($lista);
