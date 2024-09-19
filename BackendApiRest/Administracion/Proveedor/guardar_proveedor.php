<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$proveedor = new stdClass();
$proveedor->id_creador_proveedor = $_POST['id_creador_proveedor'];
$proveedor->dni_proveedor = $_POST['dni_proveedor'];
$proveedor->razon_social_proveedor = $_POST['razon_social_proveedor'];
$proveedor->representante_proveedor = $_POST['representante_proveedor'];
$proveedor->clave_proveedor = $_POST['clave_proveedor'];
$proveedor->tipo_proveedor = $_POST['tipo_proveedor'];
$proveedor->tipo_servicio_proveedor = $_POST['tipo_servicio_proveedor'];
$proveedor->ubigeo_proveedor = $_POST['ubigeo_proveedor'];
$proveedor->direccion_proveedor = $_POST['direccion_proveedor'];
$proveedor->referencias_proveedor = $_POST['referencias_proveedor'];
$proveedor->contacto_proveedor = $_POST['contacto_proveedor'];
$proveedor->telefono_proveedor = $_POST['telefono_proveedor'];
$proveedor->email_proveedor = $_POST['email_proveedor'];

$resultado = guardarProveedor($proveedor);

if ($resultado === "Ya existe un proveedor con el mismo DNI/RUC") {
    http_response_code(400); // Código de respuesta HTTP 400 Bad Request
    // Enviar respuesta JSON con el mensaje de error
    echo json_encode(array("success" => false, "error" => $resultado));
} else {
    // Enviar respuesta JSON exitosa
    echo json_encode(array("success" => true, "message" => "Proveedor guardado correctamente"));
}
?>