<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$cliente = new stdClass();
$cliente->id_creador_cliente = $_POST['id_creador_cliente'];
$cliente->dni_cliente = $_POST['dni_cliente'];
$cliente->razon_social_cliente = $_POST['razon_social_cliente'];
$cliente->representante_cliente = $_POST['representante_cliente'];
$cliente->clave_cliente = $_POST['clave_cliente'];
$cliente->id_vendedor_usuario_cliente = $_POST['id_vendedor_usuario_cliente'];
$cliente->limite_credito_cliente = $_POST['limite_credito_cliente'];
$cliente->alerta_credito_cliente = $_POST['alerta_credito_cliente'];
$cliente->ubigeo_cliente = $_POST['ubigeo_cliente'];
$cliente->direccion_cliente = $_POST['direccion_cliente'];
$cliente->referencias_cliente = $_POST['referencias_cliente'];
$cliente->contacto_cliente = $_POST['contacto_cliente'];
$cliente->telefono_cliente = $_POST['telefono_cliente'];
$cliente->email_cliente = $_POST['email_cliente'];
$cliente->area_cliente = $_POST['area_cliente'];
$cliente->logo_cliente = isset($_FILES['logo_cliente']) ? $_FILES['logo_cliente'] : null;

$resultado = guardarCliente($cliente);

if ($resultado === "El cliente ya existe en la Base de Datos") {
    http_response_code(400); // Código de respuesta HTTP 400 Bad Request
    // Enviar respuesta JSON con el mensaje de error
    echo json_encode(array("success" => false, "error" => $resultado));
} else {
    // Enviar respuesta JSON exitosa
    echo json_encode(array("success" => true, "message" => "Cliente guardado correctamente"));
}
?>