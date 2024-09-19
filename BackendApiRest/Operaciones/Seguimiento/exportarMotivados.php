<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$lista = exportarMotivados();
echo json_encode($lista);
