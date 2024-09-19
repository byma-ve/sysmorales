<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$opcionSeleccionada = $_GET['valorSeleccionado'];
$guia = eliminarGuia($opcionSeleccionada);
echo json_encode($guia);
