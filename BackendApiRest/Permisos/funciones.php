<?php

function editarPermisos($data)
{
    $bd = obtenerConexion();
    foreach ($data as $key => $value) {
        if (is_bool($value)) {
            $data[$key] = $value ? 1 : 0;
        }
    }
    $stmt = $bd->prepare("UPDATE permisos
        SET comercial_cotizacion_permiso = :comercial_cotizacion_permiso,
            comercial_punto_venta_permiso = :comercial_punto_venta_permiso,
            comercial_validacion_permiso = :comercial_validacion_permiso,
            operaciones_ajustar_guias_permiso = :operaciones_ajustar_guias_permiso,
            operaciones_registro_envio_permiso = :operaciones_registro_envio_permiso,
            operaciones_registro_masivo_permiso = :operaciones_registro_masivo_permiso,
            operaciones_programacion_permiso = :operaciones_programacion_permiso,
            operaciones_asignacion_recojo_permiso = :operaciones_asignacion_recojo_permiso,
            operaciones_lista_recojo_permiso = :operaciones_lista_recojo_permiso,
            operaciones_registro_carga_permiso = :operaciones_registro_carga_permiso,
            operaciones_estado_permiso = :operaciones_estado_permiso,
            operaciones_despacho_permiso = :operaciones_despacho_permiso,
            operaciones_consultas_permiso = :operaciones_consultas_permiso,
            operaciones_seguimiento_permiso = :operaciones_seguimiento_permiso,
            comprobantes_panel_permiso = :comprobantes_panel_permiso ,
            comprobantes_crear_factura_boleta_permiso = :comprobantes_crear_factura_boleta_permiso ,
            comprobantes_crear_guia_remision_permiso = :comprobantes_crear_guia_remision_permiso ,
            comprobantes_crear_n_debito_permiso = :comprobantes_crear_n_debito_permiso ,
            comprobantes_documento_baja_permiso = :comprobantes_documento_baja_permiso ,
            comprobantes_reportes_permiso = :comprobantes_reportes_permiso ,
            liquidacion_permiso = :liquidacion_permiso,
            administracion_usuario_permiso = :administracion_usuario_permiso,
            administracion_cliente_permiso = :administracion_cliente_permiso,
            administracion_proveedor_permiso = :administracion_proveedor_permiso,
            administracion_vehiculo_permiso = :administracion_vehiculo_permiso,
            administracion_area_permiso = :administracion_area_permiso,
            tarifarios_permiso = :tarifarios_permiso,
            ajustes_permiso = :ajustes_permiso
        WHERE id_usuario_permiso = :id_usuario_permiso");

    $stmt->bindParam(':comercial_cotizacion_permiso', $data['cotizacion']);
    $stmt->bindParam(':comercial_punto_venta_permiso', $data['puntoDeVenta']);
    $stmt->bindParam(':comercial_validacion_permiso', $data['validacion']);
    $stmt->bindParam(':operaciones_ajustar_guias_permiso', $data['AjustedeGuias']);
    $stmt->bindParam(':operaciones_registro_envio_permiso', $data['renvio']);
    $stmt->bindParam(':operaciones_registro_masivo_permiso', $data['Rmasivo']);
    $stmt->bindParam(':operaciones_programacion_permiso', $data['Programacion']);
    $stmt->bindParam(':operaciones_asignacion_recojo_permiso', $data['Asignacion']);
    $stmt->bindParam(':operaciones_lista_recojo_permiso', $data['Listacarga']);
    $stmt->bindParam(':operaciones_registro_carga_permiso', $data['RegistroCarga']);
    $stmt->bindParam(':operaciones_estado_permiso', $data['Estados']);
    $stmt->bindParam(':operaciones_despacho_permiso', $data['Despacho']);
    $stmt->bindParam(':operaciones_consultas_permiso', $data['Consultas']);
    $stmt->bindParam(':operaciones_seguimiento_permiso', $data['Seguimiento']);

    $stmt->bindParam('comprobantes_panel_permiso', $data['Panel']);
    $stmt->bindParam('comprobantes_crear_factura_boleta_permiso', $data['FacturaBoleta']);
    $stmt->bindParam('comprobantes_crear_guia_remision_permiso', $data['GuiaRemision']);
    $stmt->bindParam('comprobantes_crear_n_debito_permiso', $data['DebitoCredito']);
    $stmt->bindParam('comprobantes_documento_baja_permiso', $data['Documentodebaja']);
    $stmt->bindParam('comprobantes_reportes_permiso', $data['Reportes']);

    $stmt->bindParam(':liquidacion_permiso', $data['liquidacion']);
    $stmt->bindParam(':administracion_usuario_permiso', $data['Cusuario']);
    $stmt->bindParam(':administracion_cliente_permiso', $data['Ccliente']);
    $stmt->bindParam(':administracion_proveedor_permiso', $data['Cproveedor']);
    $stmt->bindParam(':administracion_vehiculo_permiso', $data['Cvehiculo']);
    $stmt->bindParam(':administracion_area_permiso', $data['Carea']);
    $stmt->bindParam(':tarifarios_permiso', $data['tarifarios']);
    $stmt->bindParam(':ajustes_permiso', $data['ajustes']);
    $stmt->bindParam(':id_usuario_permiso', $data['dni_usuario']);
    
    if ($stmt->execute()) {
        return ['success' => true, 'message' => '¡Se guardó correctamente!', 'datos' => $data];
    } else {
        return ['success' => false, 'message' => 'Error: ¡No se pudo guardar!', 'datos' => $data];
    }
}


function obtenerPermisos($dni_usuario)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("SELECT * FROM permisos WHERE id_usuario_permiso = :dni;");
    $sentencia->bindParam(':dni', $dni_usuario);
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function obtenerVariableDelEntorno($key)
{
    if (defined("_ENV_CACHE")) {
        $vars = _ENV_CACHE;
    } else {
        $file = "../services/env.php";
        if (!file_exists($file)) {
            throw new Exception("El archivo de las variables de entorno ($file) no existe. Favor de crearlo");
        }
        $vars = parse_ini_file($file);
        define("_ENV_CACHE", $vars);
    }
    if (isset($vars[$key])) {
        return $vars[$key];
    } else {
        throw new Exception("La clave especificada (" . $key . ") no existe en el archivo de las variables de entorno");
    }
}

function obtenerConexion()
{
    $password = obtenerVariableDelEntorno("MYSQL_PASSWORD");
    $user = obtenerVariableDelEntorno("MYSQL_USER");
    $dbName = obtenerVariableDelEntorno("MYSQL_DATABASE_NAME");
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
