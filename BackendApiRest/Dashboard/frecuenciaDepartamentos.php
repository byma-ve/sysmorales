<?php
include_once "../services/cors.php";
include_once "funciones.php";
$id_cliente = $_GET['id_cliente'];
$id_area = $_GET['id_area'];
$id_year = $_GET['id_year'];
$departamento = frecuenciaDepartamentos($id_cliente, $id_area, $id_year);
echo json_encode($departamento);
