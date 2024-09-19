<?php
include_once "../../services/cors.php";
include_once "funciones.php";

header('Content-Type: application/json');

// Obtener los datos desde el formulario enviado
$data = [
    'identificador_configuracion_guia' => $_POST['identificador_configuracion_guia'] ?? null,
    'nombre_configuracion_guia' => $_POST['nombre_configuracion_guia'] ?? null,
];


$resultado = guardarAjuste($data);

echo json_encode($resultado);
