<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$recojos = obtenerRecojos();
echo json_encode($recojos);
