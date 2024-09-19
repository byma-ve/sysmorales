<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$clientes = obtenerClientes();
echo json_encode($clientes);
