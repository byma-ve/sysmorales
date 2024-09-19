<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$proveedores = obtenerProveedores();
echo json_encode($proveedores);
