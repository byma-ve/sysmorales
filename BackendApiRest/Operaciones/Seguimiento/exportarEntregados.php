<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$lista = exportarEntregados();
echo json_encode($lista);
