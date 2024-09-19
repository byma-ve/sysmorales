<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$clientes = exportarClientes();
echo json_encode($clientes);
