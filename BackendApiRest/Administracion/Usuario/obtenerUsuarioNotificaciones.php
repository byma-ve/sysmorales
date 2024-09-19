<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$usuarios = obtenerUsuariosNotificaciones();
echo json_encode($usuarios);
