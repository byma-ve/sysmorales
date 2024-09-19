<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$id_orden_servicio = $_GET['id_orden_servicio'];
$totalesProgramaciones = datosProgramacion($id_orden_servicio);
echo json_encode($totalesProgramaciones);
