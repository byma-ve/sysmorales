<?php
include_once "../services/cors.php";
include_once "funciones.php";

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$user = $dData['user'];
$pass = $dData['pass'];

$resultado =  logueo($user, $pass);

echo json_encode($resultado);
