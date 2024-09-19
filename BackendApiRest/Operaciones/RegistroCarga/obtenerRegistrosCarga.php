<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$registrosCargas = registrosCargas();
echo json_encode($registrosCargas);
