<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$proveedores = exportarProveedores();
echo json_encode($proveedores);
