<?php
include_once "../services/cors.php";
include_once "funciones.php";
$dni_usuario = $_GET['dni_usuario'];
$permisos = obtenerPermisos($dni_usuario);
echo json_encode($permisos);
