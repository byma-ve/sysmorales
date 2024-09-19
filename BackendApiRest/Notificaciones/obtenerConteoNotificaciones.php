<?php
include_once "../services/cors.php";
include_once "funciones.php";

$id_usuario = $_GET['id_usuario'];
$notificaciones = obtenerConteoNotificaciones($id_usuario);
echo json_encode($notificaciones);
