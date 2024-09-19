<?php

include_once "../../services/cors.php";
include_once "funciones.php";

$dni_usuario = $_GET['usuario'];

$usuario = obtenerUsuario($dni_usuario);
echo json_encode($usuario);
