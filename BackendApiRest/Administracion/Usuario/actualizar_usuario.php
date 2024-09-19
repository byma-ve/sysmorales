<?php
include_once "../../services/cors.php";
include_once "funciones.php";

$usuario = new stdClass();
$usuario->id = $_POST['id'];
$usuario->dni_usuario = $_POST['dni_usuario'];
$usuario->clave_usuario = $_POST['clave_usuario'];
$usuario->colaborador_usuario = $_POST['colaborador_usuario'];
$usuario->brevete_usuario = $_POST['brevete_usuario'];
$usuario->telefono_usuario = $_POST['telefono_usuario'];
$usuario->email_usuario = $_POST['email_usuario'];
$usuario->area_usuario = $_POST['area_usuario'];
$usuario->cargo_usuario = $_POST['cargo_usuario'];
$usuario->foto_usuario = isset($_FILES['foto_usuario']) ? $_FILES['foto_usuario'] : null;


$resultado = actualizarUsuario($usuario);
echo json_encode($resultado);

