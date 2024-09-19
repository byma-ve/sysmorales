<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$area = new stdClass();
$area->id_creador_area = $_POST['id_creador_area'];
$area->id_cliente_area = $_POST['id_cliente_area'];
$area->nombre_area = $_POST['nombre_area'];
$area->contacto_area = $_POST['contacto_area'];
$area->cargo_contacto_area = $_POST['cargo_contacto_area'];
$area->telefono_area = $_POST['telefono_area'];
$area->email_area = $_POST['email_area'];
$area->contacto_extra_area = $_POST['contacto_extra_area'];
$area->telefono_extra_area = $_POST['telefono_extra_area'];
$area->email_extra_area = $_POST['email_extra_area'];

$resultado = guardarArea($area);
echo json_encode($resultado);

