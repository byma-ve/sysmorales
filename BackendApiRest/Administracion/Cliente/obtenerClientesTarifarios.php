<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$clientes = obtenerClientesTarifarios();
echo json_encode($clientes);
