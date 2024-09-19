<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$vehiculo = new stdClass();
$vehiculo->id = $_POST['id'];
$vehiculo->placa_vehiculo = $_POST['placa_vehiculo'];
$vehiculo->tipo_vehiculo = $_POST['tipo_vehiculo'];
$vehiculo->n_serie_vehiculo = $_POST['n_serie_vehiculo'];
$vehiculo->soat_vehiculo = $_POST['soat_vehiculo'];
$vehiculo->vigencia_desde_vehiculo = $_POST['vigencia_desde_vehiculo'];
$vehiculo->vigencia_hasta_vehiculo = $_POST['vigencia_hasta_vehiculo'];
$vehiculo->ultima_revision_vehiculo = $_POST['ultima_revision_vehiculo'];
$vehiculo->vencimiento_vehiculo = $_POST['vencimiento_vehiculo'];
$vehiculo->tarjeta_propiedad_vehiculo = $_POST['tarjeta_propiedad_vehiculo'];

$resultado = actualizarVehiculo($vehiculo);
echo json_encode($resultado);

