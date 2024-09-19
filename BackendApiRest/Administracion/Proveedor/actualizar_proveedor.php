<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$proveedor = new stdClass();
$proveedor->id = ($_POST['id']);
$proveedor->dni_proveedor = ($_POST['dni_proveedor']);
$proveedor->razon_social_proveedor = strtoupper($_POST['razon_social_proveedor']);
$proveedor->representante_proveedor = strtoupper($_POST['representante_proveedor']);
$proveedor->clave_proveedor = ($_POST['clave_proveedor']);
$proveedor->tipo_proveedor = ($_POST['tipo_proveedor']);
$proveedor->tipo_servicio_proveedor = ($_POST['tipo_servicio_proveedor']);
$proveedor->ubigeo_proveedor = ($_POST['ubigeo_proveedor']);
$proveedor->direccion_proveedor = strtoupper($_POST['direccion_proveedor']);
$proveedor->referencias_proveedor = strtoupper($_POST['referencias_proveedor']);
$proveedor->contacto_proveedor = strtoupper($_POST['contacto_proveedor']);
$proveedor->telefono_proveedor = strtoupper($_POST['telefono_proveedor']);
$proveedor->email_proveedor = strtoupper($_POST['email_proveedor']);

$resultado = actualizarProveedor($proveedor);
if ($resultado === "Ya existe un proveedor con el mismo destino") {
    http_response_code(400); // Código de respuesta HTTP 400 Bad Request
    // Enviar respuesta JSON con el mensaje de error
    echo json_encode(array("success" => false, "error" => $resultado));
} else {
    // Enviar respuesta JSON exitosa
    echo json_encode(array("success" => true, "message" => "Proveedor actualizado correctamente"));
}
?>