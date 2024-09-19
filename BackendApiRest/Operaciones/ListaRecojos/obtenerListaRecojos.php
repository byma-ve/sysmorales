<?php
include_once "../../services/cors.php";
include_once "funciones.php";
$listaRecojos = obtenerListaRecojos();
echo json_encode($listaRecojos);
