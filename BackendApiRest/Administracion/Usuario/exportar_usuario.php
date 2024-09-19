<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$usuarios = exportarUsuarios();
echo json_encode($usuarios);
