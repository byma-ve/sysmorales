<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$usuarios = obtenerVendedores();
echo json_encode($usuarios);
