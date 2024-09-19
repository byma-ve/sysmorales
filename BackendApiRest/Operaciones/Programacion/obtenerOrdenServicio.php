<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$ordenServicios = ordenServicios();
echo json_encode($ordenServicios);
