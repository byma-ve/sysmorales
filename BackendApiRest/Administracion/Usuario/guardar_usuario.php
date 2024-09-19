<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$usuario = new stdClass();
$usuario->id_creador_usuario = $_POST['id_creador_usuario'];
$usuario->dni_usuario = $_POST['dni_usuario'];
$usuario->clave_usuario = $_POST['clave_usuario'];
$usuario->colaborador_usuario = $_POST['colaborador_usuario'];
$usuario->brevete_usuario = $_POST['brevete_usuario'];
$usuario->telefono_usuario = $_POST['telefono_usuario'];
$usuario->email_usuario = $_POST['email_usuario'];
$usuario->area_usuario = $_POST['area_usuario'];
$usuario->cargo_usuario = $_POST['cargo_usuario'];
$usuario->foto_usuario = isset($_FILES['foto_usuario']) ? $_FILES['foto_usuario'] : null;

$resultado = guardarUsuario($usuario);

if ($resultado === "El usuario ya existe en la Base de Datos") {
    http_response_code(400); // Código de respuesta HTTP 400 Bad Request
    // Enviar respuesta JSON con el mensaje de error
    echo json_encode(array("success" => false, "error" => $resultado));
} else {
    // Enviar respuesta JSON exitosa
    echo json_encode(array("success" => true, "message" => "Usuario guardado correctamente"));
}
?>