<?php
function verificarUbigeo($departamento, $provincia, $distrito, $bd)
{
    $consulta = $bd->prepare("SELECT COUNT(*) FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
    $consulta->bindParam(':departamento', $departamento);
    $consulta->bindParam(':provincia', $provincia);
    $consulta->bindParam(':distrito', $distrito);

    $consulta->execute();

    return $consulta->fetchColumn() > 0;
}

function eliminarCotizacion($id)
{
    $bd = obtenerConexion();

    $sentencia = $bd->prepare("SELECT validacion_cotizacion FROM cotizaciones WHERE id_cotizacion = ?");
    $sentencia->execute([$id]);
    $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);

    if ($resultado['validacion_cotizacion'] == 0) {
        $sentencia = $bd->prepare("DELETE FROM cotizaciones_destinos WHERE id_cotizacion_cotizacion_destino = ?");
        $sentencia->execute([$id]);

        $sentencia = $bd->prepare("DELETE FROM cotizaciones WHERE id_cotizacion = ?");
        $sentencia->execute([$id]);

        return ['success' => true, 'mensaje' => '!Cotización eliminada Correctamente!'];
    } else if ($resultado['validacion_cotizacion'] == 1) {
        $sentencia = $bd->prepare("SELECT estado_validacion FROM validaciones WHERE id_orden_servicio_validacion = ?");
        $sentencia->execute([$id]);
        $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
        if ($resultado['estado_validacion'] == 0) {

            $v = $bd->prepare("DELETE FROM validaciones WHERE id_orden_servicio_validacion = ?");
            $v->execute([$id]);

            $cd = $bd->prepare("DELETE FROM cotizaciones_destinos WHERE id_cotizacion_cotizacion_destino = ?");
            $cd->execute([$id]);

            $c = $bd->prepare("DELETE FROM cotizaciones WHERE id_cotizacion = ?");
            $c->execute([$id]);

            return ['success' => true, 'mensaje' => '!Cotización eliminada Correctamente!'];
        } else {
            return ['success' => false, 'mensaje' => '!No se pudo eliminar - Cotización Aprobada¡'];
        }
    }
}

function obtenerCotizaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT
    c.id,
    c.id_registro_masivo as 'id_cotizacion',
    c.id_cliente_registro_masivo as 'id_cliente_cotizacion',
    c.id_area_registro_masivo as 'id_area_cotizacion',
    c.cantidad_destinos_registro_masivo as 'cantidad_destinos_cotizacion',
    c.recibo_registro_masivo as 'recibo_cotizacion', 
    c.sub_total_registro_masivo as 'sub_total_cotizacion',
    c.igv_registro_masivo as 'igv_cotizacion',
    c.precio_total_masivo as 'precio_total_cotizacion',
    c.validacion_masivo as 'validacion_cotizacion',
    c.id_creador_masivo as 'id_creador_cotizacion',
    c.estado,
    c.fecha_creado,
    c.fecha_actualizado,
    cli.razon_social_cliente,
    cli.representante_cliente,
    cli.telefono_cliente,
    cli.email_cliente,
    CASE
        WHEN c.validacion_masivo = 0 THEN 'Falta validar'
        WHEN c.validacion_masivo = 1 THEN 'Enviado a validar'
        ELSE 'Estado desconocido'
    END AS validacion_cotizacion
FROM
registro_masivos c
INNER JOIN
    clientes cli ON c.id_cliente_registro_masivo = cli.id
INNER JOIN
    areas ar ON c.id_area_registro_masivo = ar.id
    ORDER BY c.id DESC;
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Cambiado de fetch a fetchAll
    return $data;
}

function guardarCotizacion($datos)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (
        !empty($datos['areaElegida']) &&
        !empty($datos['clienteElegido']) &&
        !empty($datos['id_creador'])
    ) {
        $id_creador = $datos['id_creador'];
        $id_cliente = $datos['clienteElegido'];
        $id_area = $datos['areaElegida'];
        $calculoTotal = obtenerCalculoTotal($id_cliente, $id_area);
        $recibo_cotizacion = '-';
        $sub_total_cotizacion = $calculoTotal['sub_total'];
        $igv_cotizacion = $calculoTotal['igv_1_18'];
        $precio_total_cotizacion = $calculoTotal['total_calculo'];

        $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
        $consultaID->execute();
        $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
        $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'];
        if (empty($identificadorOrdenServicioMasivo)) {
            return ['success' => false, 'mensaje' => 'Debe configurar la guía!.'];
        }

        $stmt = $bd->prepare("SELECT MAX(id_registro_masivo) AS max_id FROM registro_masivos WHERE id_registro_masivo LIKE '$identificadorOrdenServicioMasivo-%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $id_cotizacion = $identificadorOrdenServicioMasivo . '-0000001';
        } else {
            $numeric_part = substr($max_id_cotizacion, strlen($identificadorOrdenServicioMasivo) + 1) + 1;
            $id_cotizacion = $identificadorOrdenServicioMasivo . '-' . str_pad($numeric_part, 7, '0', STR_PAD_LEFT);
        }

        $sql = "SELECT count(*)
        FROM registro_masivo_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_registro_masivo_destino = c.id
        INNER JOIN areas a ON cd.id_area_registro_masivo_destino = a.id
        WHERE cd.id_registro_masivo_destino = '$identificadorOrdenServicioMasivo-0000000'
        AND c.id = :id_cliente
        AND a.id = :id_area
        ;";
        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->bindParam(':id_area', $id_area);
        $stmt->execute();
        $cant_destinos = $stmt->fetchColumn();

        if ($cant_destinos != 0) {

            $sql_cli = "SELECT * FROM clientes WHERE id = :id_cliente";
            $stmt = $bd->prepare($sql_cli);
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->execute();
            $mostrar_cli = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!empty($mostrar_cli['id_vendedor_usuario_cliente'])) {
                $cli_credito = $mostrar_cli['alerta_credito_cliente'];
                $cli_limite = $mostrar_cli['limite_credito_cliente'];
                $suma_credito = $cli_credito + $precio_total_cotizacion;
                $success = $suma_credito <= $cli_limite;
                if ($success) {
                    $stmt_cre = $bd->prepare("UPDATE clientes SET alerta_credito_cliente=:suma_credito WHERE id=:id_cliente");
                    $stmt_cre->execute([':suma_credito' => $suma_credito, ':id_cliente' => $id_cliente]);
                    
                    $sql_upt_ = "UPDATE registro_masivo_destinos SET id_registro_masivo_destino = :id_cotizacion  WHERE id_registro_masivo_destino = '$identificadorOrdenServicioMasivo-0000000' 
                    AND id_cliente_registro_masivo_destino = :id_cliente
                    AND id_area_registro_masivo_destino = :id_area;";
                    $stmt = $bd->prepare($sql_upt_);
                    $stmt->bindParam(':id_cotizacion', $id_cotizacion);
                    $stmt->bindParam(':id_cliente', $id_cliente);
                    $stmt->bindParam(':id_area', $id_area);
                    $stmt->execute();

                    $sql = "INSERT INTO registro_masivos(id_registro_masivo, id_cliente_registro_masivo, id_area_registro_masivo, cantidad_destinos_registro_masivo, recibo_registro_masivo, sub_total_registro_masivo, igv_registro_masivo, precio_total_masivo, id_creador_masivo, validacion_masivo,fecha_creado) 
                    VALUES (:id_cotizacion, :id_cliente_cotizacion, :id_area_cotizacion, :cantidad_destinos_cotizacion, :recibo_cotizacion, :sub_total_cotizacion, :igv_cotizacion, :precio_total_cotizacion, :id_creador_cotizacion, 1,:fecha_creado)";
                    $stmt = $bd->prepare($sql);
                    $stmt->bindParam(':id_cotizacion', $id_cotizacion);
                    $stmt->bindParam(':id_cliente_cotizacion', $id_cliente);
                    $stmt->bindParam(':id_area_cotizacion', $id_area);
                    $stmt->bindParam(':cantidad_destinos_cotizacion', $cant_destinos);
                    $stmt->bindParam(':recibo_cotizacion', $recibo_cotizacion);
                    $stmt->bindParam(':sub_total_cotizacion', $sub_total_cotizacion);
                    $stmt->bindParam(':igv_cotizacion', $igv_cotizacion);
                    $stmt->bindParam(':precio_total_cotizacion', $precio_total_cotizacion);
                    $stmt->bindParam(':id_creador_cotizacion', $id_creador);
                    $stmt->bindParam(':fecha_creado', $fecha_actual);
                    $stmt->execute();

                    $insercion = $bd->prepare("INSERT INTO validaciones (id_orden_servicio_validacion,id_creador_enviar_validacion,id_accion_validacion,estado_validacion,fecha_creado) VALUES (:id,:id_creador,:id_accion,1,:fecha_creado)");
                    $insercion->bindParam(':id', $id_cotizacion);
                    $insercion->bindParam(':id_creador', $id_creador);
                    $insercion->bindParam(':id_accion', $id_creador);
                    $insercion->bindParam(':fecha_creado', $fecha_actual);
                    $insercion->execute();

                    return ['success' => true, 'mensaje' => '¡Registro Masivo Guardado Correctamente!', 'datosGuardados' => $datos];
                } else {
                    return ['success' => false, 'mensaje' => '¡La cotización sobrepasa el limite de credito asignado!'];
                }
            } else {
                return ['success' => false, 'mensaje' => 'Hubo un error en el CLiente!.'];
            }
        } else {
            return ['success' => false, 'mensaje' => 'Debe tener al menos 1 destino para guardar!.'];
        }
    } else {
        return ['success' => false, 'mensaje' => 'Debe completar todos los campos!.'];
    }
}

function obtenerCalculoTotal($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';
    
    $stmt = $bd->prepare("
            SELECT 
                SUM(cd.total_tarifa_registro_masivo_destino) AS total_costo_envio, 
                SUM(cd.total_adicional_registro_masivo_destino) AS total_costo_adicional
            FROM 
                registro_masivo_destinos cd
            INNER JOIN 
                clientes c ON cd.id_cliente_registro_masivo_destino = c.id
            INNER JOIN 
                areas a ON cd.id_area_registro_masivo_destino = a.id
            WHERE 
                cd.id_cliente_registro_masivo_destino = :id_cliente 
                AND cd.id_area_registro_masivo_destino = :id_area 
                AND cd.id_registro_masivo_destino = '$identificadorOrdenServicioMasivo-0000000'
        ");
    $stmt->bindParam(':id_cliente', $id_cliente);
    $stmt->bindParam(':id_area', $id_area);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $sub_total = $result["total_costo_envio"] + $result["total_costo_adicional"];
    $igv_1_18 = $sub_total * 1.18 - $sub_total;
    $total = $sub_total + $igv_1_18;

    $result = array(
        "total_costo_envio" => number_format($result["total_costo_envio"], 2, ".", ""),
        "total_costo_adicional" => number_format($result["total_costo_adicional"], 2, ".", ""),
        "sub_total" => number_format($sub_total, 2, ".", ""),
        "igv_1_18" => number_format($igv_1_18, 2, ".", ""),
        "total_calculo" => number_format($total, 2, ".", "")
    );

    return $result;
}

function obtenerDestino($id_destino_cotizacion)
{
    $bd = obtenerConexion();
    $stmt = $bd->prepare('SELECT 
        cd.id AS id,
        cd.id_registro_masivo_destino AS id_cotizacion_cotizacion_destino,
        cd.id_cliente_registro_masivo_destino AS id_cliente_cotizacion_destino,
        cd.id_area_registro_masivo_destino AS id_area_cotizacion_destino,
        cd.consignado_registro_masivo_destino AS consignado_cotizacion_destino,
        cd.dni_ruc_registro_masivo_destino AS dni_ruc_cotizacion_destino,
        cd.telefono_registro_masivo_destino AS telefono_cotizacion_destino,
        cd.telefono_exc_registro_masivo_destino AS telefono_exc_cotizacion_destino,
        cd.direccion_registro_masivo_destino AS direccion_cotizacion_destino,
        cd.referencias_registro_masivo_destino AS referencias_cotizacion_destino,
        cd.tarifario_registro_masivo_destino AS tarifario_cotizacion_destino,
        cd.ubigeo_registro_masivo_destino AS ubigeo_cotizacion_destino,
        cd.tmin_entrega_registro_masivo_destino AS tmin_entrega_cotizacion_destino,
        cd.tmax_entrega_registro_masivo_destino AS tmax_entrega_cotizacion_destino,
        cd.tipo_envio_registro_masivo_destino AS tipo_envio_cotizacion_destino,
        cd.contenido_mercancia_registro_masivo_destino AS contenido_mercancia_cotizacion_destino,
        cd.peso_mercancia_registro_masivo_destino AS peso_mercancia_cotizacion_destino,
        cd.total_metros_cubicos_registro_masivo_destino AS total_metros_cubicos_cotizacion_destino,
        cd.total_tarifa_registro_masivo_destino AS total_tarifa_cotizacion_destino,
        cd.tipo_logistica_registro_masivo_destino AS tipo_logistica_cotizacion_destino,
        cd.cantidad_mercancia_registro_masivo_destino AS cantidad_mercancia_cotizacion_destino,
        cd.largo_registro_masivo_destino AS largo_cotizacion_destino,
        cd.ancho_registro_masivo_destino AS ancho_cotizacion_destino,
        cd.alto_registro_masivo_destino AS alto_cotizacion_destino,
        cd.total_peso_volumen_registro_masivo_destino AS total_peso_volumen_cotizacion_destino,
        cd.valor_mercancia_registro_masivo_destino AS valor_mercancia_cotizacion_destino,
        cd.packing_registro_masivo_destino AS packing_cotizacion_destino,
        cd.seguro_registro_masivo_destino AS seguro_cotizacion_destino,
        cd.monta_carga_registro_masivo_destino AS monta_carga_cotizacion_destino,
        cd.total_adicional_registro_masivo_destino AS total_adicional_cotizacion_destino,
        cd.retorno_registro_masivo_destino AS retorno_cotizacion_destino,
        cd.estiba_desestiba_registro_masivo_destino AS estiba_desestiba_cotizacion_destino,
        cd.transporte_extra_registro_masivo_destino AS transporte_extra_cotizacion_destino,
        cd.guia_transportista_registro_masivo_destino AS guia_transportista_cotizacion_destino,
        cd.guia_remision_registro_masivo_destino AS guia_remision_cotizacion_destino,
        cd.documento_1_registro_masivo_destino AS documento_1_cotizacion_destino,
        cd.documento_2_registro_masivo_destino AS documento_2_cotizacion_destino,
        cd.id_creador_registro_masivo_destino AS id_creador_cotizacion_destino,
        cd.estado AS estado,
        fecha_creado AS fecha_creado,
        fecha_actualizado AS fecha_actualizado, 
        dep.id AS departamento_id,
        prov.id AS provincia_id
    FROM 
        registro_masivo_destinos cd
    INNER JOIN 
        distritos dis ON cd.ubigeo_registro_masivo_destino = dis.ubigeo
    INNER JOIN 
        provincias prov ON dis.provincia_id = prov.id
    INNER JOIN 
        departamentos dep ON prov.departamento_id = dep.id                                                
    WHERE 
        cd.id = ?;
    ');
    $stmt->execute([$id_destino_cotizacion]);
    $data = $stmt->fetch();
    return $data;
}

function eliminarDestino($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("DELETE FROM registro_masivo_destinos WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function obtenerListaDestinos($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';
    $consulta = $bd->prepare("SELECT cd.id_registro_masivo_destino, cd.ubigeo_registro_masivo_destino, cd.id as 'id_cotizacion_destino', ub.DESTINO as 'destino' FROM registro_masivo_destinos as cd
    INNER JOIN ubigeo as ub on ub.UBIGEO = cd.ubigeo_registro_masivo_destino
    INNER JOIN clientes as cli on cli.id = cd.id_cliente_registro_masivo_destino
    INNER JOIN areas as ar on ar.id = cd.id_area_registro_masivo_destino
    WHERE cd.id_cliente_registro_masivo_destino = :id_cliente
    AND cd.id_area_registro_masivo_destino = :id_area AND cd.id_registro_masivo_destino = '$identificadorOrdenServicioMasivo-0000000' ORDER BY cd.id DESC;");
    $consulta->bindParam(':id_cliente', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $destinos = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $destinos;
}

function editarDestino($datos)
{
    $bd = obtenerConexion();
    if (
        !empty($datos['id_destino_cotizacion']) &&
        !empty($datos['id_creador']) &&
        !empty($datos['id_cliente']) &&
        !empty($datos['id_area']) &&
        !empty($datos['consignado_cotizacion_destino']) &&
        !empty($datos['dni_ruc_cotizacion_destino']) &&
        !empty($datos['telefono_cotizacion_destino']) &&
        !empty($datos['telefono_exc_cotizacion_destino']) &&
        !empty($datos['direccion_cotizacion_destino']) &&
        !empty($datos['referencias_cotizacion_destino']) &&
        !empty($datos['tarifario_cotizacion_destino']) &&
        !empty($datos['ubigeo_cotizacion_destino']) &&
        !empty($datos['tmin_entrega_cotizacion_destino']) &&
        !empty($datos['tmax_entrega_cotizacion_destino']) &&
        !empty($datos['tipo_envio_cotizacion_destino']) &&
        !empty($datos['contenido_mercancia_cotizacion_destino']) &&
        !empty($datos['peso_mercancia_cotizacion_destino']) &&
        !empty($datos['total_metros_cubicos_cotizacion_destino']) &&
        !empty($datos['total_tarifa_cotizacion_destino']) &&
        !empty($datos['tipo_logistica_cotizacion_destino']) &&
        !empty($datos['cantidad_mercancia_cotizacion_destino']) &&
        !empty($datos['total_peso_volumen_cotizacion_destino']) &&
        !empty($datos['valor_mercancia_cotizacion_destino']) &&
        !empty($datos['seguro_cotizacion_destino']) &&
        !empty($datos['total_adicional_cotizacion_destino'])
    ) {
        if ($datos['tarifario_cotizacion_destino'] == 'Courrier') {
            $sql = "SELECT
        tcc.tmin_tarifario_cliente_courrier AS 'tmin',
        tcc.tmax_tarifario_cliente_courrier AS 'tmax'
            FROM
        tarifarios_clientes_courriers tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_courrier = c.id
            WHERE
        tcc.ubigeo_tarifario_cliente_courrier = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_courrier = :id_cliente
            AND tcc.id_area_tarifario_cliente_courrier = :id_area;
            ";
        } else if ($datos['tarifario_cotizacion_destino'] == 'Aerea') {
            $sql = "SELECT
            tcc.tmin_tarifario_cliente_aereo AS 'tmin',
            tcc.tmax_tarifario_cliente_aereo AS 'tmax'
                FROM
            tarifarios_clientes_aereos tcc
                INNER JOIN
            clientes c ON tcc.id_cliente_tarifario_cliente_aereo = c.id
                WHERE
            tcc.ubigeo_tarifario_cliente_aereo = :ubigeo
                AND tcc.id_cliente_tarifario_cliente_aereo = :id_cliente
                AND tcc.id_area_tarifario_cliente_aereo = :id_area;
                ";
        } else if ($datos['tarifario_cotizacion_destino'] == 'Carga') {
            $sql = "SELECT
            tcc.tmin_tarifario_cliente_carga AS 'tmin',
            tcc.tmax_tarifario_cliente_carga AS 'tmax'
                FROM
            tarifarios_clientes_cargas tcc
                INNER JOIN
            clientes c ON tcc.id_cliente_tarifario_cliente_carga = c.id
                WHERE
            tcc.ubigeo_tarifario_cliente_carga = :ubigeo
                AND tcc.id_cliente_tarifario_cliente_carga = :id_cliente
                AND tcc.id_area_tarifario_cliente_carga = :id_area;
            ";
        } else if ($datos['tarifario_cotizacion_destino'] == 'Valorizada') {
            $sql = "SELECT
            producto_tarifario_cliente_valorizado,
            tcc.tmin_tarifario_cliente_valorizado AS 'tmin',
            tcc.tmax_tarifario_cliente_valorizado AS 'tmax'
                FROM
            tarifarios_clientes_valorizados tcc
                INNER JOIN
            clientes c ON tcc.id_cliente_tarifario_cliente_valorizado = c.id
                WHERE
            tcc.ubigeo_tarifario_cliente_valorizado = :ubigeo
                AND tcc.id_cliente_tarifario_cliente_valorizado = :id_cliente
                AND tcc.id_area_tarifario_cliente_valorizado = :id_area;
            ";
        }
        $stmt = $bd->prepare($sql);
        $stmt->execute(['ubigeo' => $datos['ubigeo_cotizacion_destino'], 'id_cliente' => $datos['id_cliente'], 'id_area' => $datos['id_area']]);
        $result = $stmt->fetch();
        if ($result) {
            $data = array(
                "id_cliente_registro_masivo_destino" => $datos['id_cliente'],
                "id_area_registro_masivo_destino" => $datos['id_area'],
                "consignado_registro_masivo_destino" => $datos['consignado_cotizacion_destino'],
                "dni_ruc_registro_masivo_destino" => $datos['dni_ruc_cotizacion_destino'],
                "telefono_registro_masivo_destino" => $datos['telefono_cotizacion_destino'],
                "telefono_exc_registro_masivo_destino" => $datos['telefono_exc_cotizacion_destino'],
                "direccion_registro_masivo_destino" => $datos['direccion_cotizacion_destino'],
                "referencias_registro_masivo_destino" => $datos['referencias_cotizacion_destino'],
                "tarifario_registro_masivo_destino" => $datos['tarifario_cotizacion_destino'],
                "ubigeo_registro_masivo_destino" => $datos['ubigeo_cotizacion_destino'],
                "tmin_entrega_registro_masivo_destino" => $datos['tmin_entrega_cotizacion_destino'],
                "tmax_entrega_registro_masivo_destino" => $datos['tmax_entrega_cotizacion_destino'],
                "tipo_envio_registro_masivo_destino" => $datos['tipo_envio_cotizacion_destino'],
                "contenido_mercancia_registro_masivo_destino" => $datos['contenido_mercancia_cotizacion_destino'],
                "peso_mercancia_registro_masivo_destino" => $datos['peso_mercancia_cotizacion_destino'],
                "total_metros_cubicos_registro_masivo_destino" => $datos['total_metros_cubicos_cotizacion_destino'],
                "total_tarifa_registro_masivo_destino" => $datos['total_tarifa_cotizacion_destino'],
                "tipo_logistica_registro_masivo_destino" => $datos['tipo_logistica_cotizacion_destino'],
                "cantidad_mercancia_registro_masivo_destino" => $datos['cantidad_mercancia_cotizacion_destino'],
                "largo_registro_masivo_destino" => empty($datos['largo_cotizacion_destino']) ? $datos['largo_cotizacion_destino'] : 0,
                "ancho_registro_masivo_destino" => empty($datos['ancho_cotizacion_destino']) ? $datos['ancho_cotizacion_destino'] : 0,
                "alto_registro_masivo_destino" => empty($datos['alto_cotizacion_destino']) ? $datos['alto_cotizacion_destino'] : 0,
                "total_peso_volumen_registro_masivo_destino" => $datos['total_peso_volumen_cotizacion_destino'],
                "valor_mercancia_registro_masivo_destino" => $datos['valor_mercancia_cotizacion_destino'],
                "packing_registro_masivo_destino" => empty($datos['packing_cotizacion_destino']) ? $datos['packing_cotizacion_destino'] : 0,
                "seguro_registro_masivo_destino" => $datos['seguro_cotizacion_destino'],
                "monta_carga_registro_masivo_destino" => empty($datos['monta_carga_cotizacion_destino']) ? $datos['monta_carga_cotizacion_destino'] : 0,
                "total_adicional_registro_masivo_destino" => $datos['total_adicional_cotizacion_destino'],
                "retorno_registro_masivo_destino" => empty($datos['retorno_cotizacion_destino']) ? $datos['retorno_cotizacion_destino'] : 0,
                "estiba_desestiba_registro_masivo_destino" => empty($datos['estiba_desestiba_cotizacion_destino']) ? $datos['estiba_desestiba_cotizacion_destino'] : 0,
                "transporte_extra_registro_masivo_destino" => empty($datos['transporte_extra_cotizacion_destino']) ? $datos['transporte_extra_cotizacion_destino'] : 0,
                "id_creador_registro_masivo_destino" => $datos['id_creador'],
                "id_registro_masivo_destino" => $datos['id_destino_cotizacion']
            );

            $sqlUpdate = 'UPDATE registro_masivo_destinos SET
                id_cliente_registro_masivo_destino = :id_cliente_registro_masivo_destino,
                id_area_registro_masivo_destino = :id_area_registro_masivo_destino,
                consignado_registro_masivo_destino = :consignado_registro_masivo_destino,
                dni_ruc_registro_masivo_destino = :dni_ruc_registro_masivo_destino,
                telefono_registro_masivo_destino = :telefono_registro_masivo_destino,
                telefono_exc_registro_masivo_destino = :telefono_exc_registro_masivo_destino,
                direccion_registro_masivo_destino = :direccion_registro_masivo_destino,
                referencias_registro_masivo_destino = :referencias_registro_masivo_destino,
                tarifario_registro_masivo_destino = :tarifario_registro_masivo_destino,
                ubigeo_registro_masivo_destino = :ubigeo_registro_masivo_destino,
                tmin_entrega_registro_masivo_destino = :tmin_entrega_registro_masivo_destino,
                tmax_entrega_registro_masivo_destino = :tmax_entrega_registro_masivo_destino,
                tipo_envio_registro_masivo_destino = :tipo_envio_registro_masivo_destino,
                contenido_mercancia_registro_masivo_destino = :contenido_mercancia_registro_masivo_destino,
                peso_mercancia_registro_masivo_destino = :peso_mercancia_registro_masivo_destino,
                total_metros_cubicos_registro_masivo_destino = :total_metros_cubicos_registro_masivo_destino,
                total_tarifa_registro_masivo_destino = :total_tarifa_registro_masivo_destino,
                tipo_logistica_registro_masivo_destino = :tipo_logistica_registro_masivo_destino,
                cantidad_mercancia_registro_masivo_destino = :cantidad_mercancia_registro_masivo_destino,
                largo_registro_masivo_destino = :largo_registro_masivo_destino,
                ancho_registro_masivo_destino = :ancho_registro_masivo_destino,
                alto_registro_masivo_destino = :alto_registro_masivo_destino,
                total_peso_volumen_registro_masivo_destino = :total_peso_volumen_registro_masivo_destino,
                valor_mercancia_registro_masivo_destino = :valor_mercancia_registro_masivo_destino,
                packing_registro_masivo_destino = :packing_registro_masivo_destino,
                seguro_registro_masivo_destino = :seguro_registro_masivo_destino,
                monta_carga_registro_masivo_destino = :monta_carga_registro_masivo_destino,
                total_adicional_registro_masivo_destino = :total_adicional_registro_masivo_destino,
                retorno_registro_masivo_destino = :retorno_registro_masivo_destino,
                estiba_desestiba_registro_masivo_destino = :estiba_desestiba_registro_masivo_destino,
                transporte_extra_registro_masivo_destino = :transporte_extra_registro_masivo_destino,
                id_creador_registro_masivo_destino = :id_creador_registro_masivo_destino
            WHERE id = :id_registro_masivo_destino;
            ';

            $stmt = $bd->prepare($sqlUpdate);
            if ($stmt === false) {
                return ['success' => false, 'mensaje' => 'Error al actualizar los datos'];
            }
            $Ejecucion = $stmt->execute($data);
            if ($Ejecucion) {
                return ['success' => true, 'mensaje' => '¡Destino actualizado correctamente!', 'datosGuardados' => $datos];
            } else {
                return ['success' => false, 'mensaje' => 'Error al actualizar el Destino'];
            }
        } else {
            return ['success' => false, 'mensaje' => '¡El Destino no tiene tarifario!.'];
        }
    } else {
        return ['success' => false, 'mensaje' => 'Debe completar todos los campos!.'];
    }
}

function guardarDestino($id_cliente, $id_area, $datos, $id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'];
    if (empty($identificadorOrdenServicioMasivo)) {
        return ['success' => false, 'mensaje' => 'Debe configurar la guía!.'];
    }

    if (is_array($datos) && count($datos) > 0) {
        if (count($datos) > 0) {
            foreach ($datos as $fila => $dato) {
                foreach ([
                    'CONSIGNADO', 'RUC/DNI', 'TELÉFONO', 'TELÉFONO-EX', 'DIRECCIÓN', 'REFERENCIAS', 'TIPO-ENVIO', 'DEPARTAMENTO', 'PROVINCIA', 'DISTRITO', 'TIPO-MOVIMIENTO', 'TIPO-LOGISTICA', 'CONTENIDO-MERC', 'PESO-MERC', 'CANT-MERC', 'LARGO', 'ANCHO', 'ALTO'
                ] as $campo) {
                    if (!isset($dato[$campo]) || empty($dato[$campo])) {
                        return ['success' => false, 'message' => 'Error: El campo ' . $campo . ' en la fila ' . ($fila + 2) . ' no existe o está vacío.'];
                    }
                }

                // VALIDAR LONGITUD
                $validarLongitud = [
                    'RUC/DNI' => 11,
                    'TELÉFONO' => 9,
                    'G-TRANSPORTISTA' => 11,
                    'G-REMISIÓN' => 11,
                    'NRO. PEDIDO' => 11,
                    'DOC-ADICIONAL' => 11,
                ];

                foreach ($validarLongitud as $campo => $longitudMaxima) {
                    if (isset($dato[$campo]) && strlen($dato[$campo]) > $longitudMaxima) {
                        return ['success' => false, 'message' => 'Error: El campo ' . $campo . ' en la fila ' . ($fila + 2) . ' debe tener ' . $longitudMaxima . ' dígitos o menos.'];
                    }
                }

                // VALIDAR CAMPOS NUMERICOS
                $camposNumericos = ['RUC/DNI', 'TELÉFONO', 'PESO-MERC', 'CANT-MERC', 'LARGO', 'ANCHO', 'ALTO'];

                foreach ($camposNumericos as $campo) {
                    if (!is_numeric($dato[$campo])) {
                        return ['success' => false, 'message' => 'Error: ' . $campo . ' tiene que ser numérico en la fila ' . ($fila + 2) . '.'];
                    }
                }

                // VALIDAR CONSISTENCIA DE DATOS

                $tipoValidaciones = [
                    'TIPO-ENVIO' => ['COURRIER', 'AEREO', 'VALORIZADO', 'CARGA'],
                    'TIPO-MOVIMIENTO' => ['TERRESTRE', 'AEREO', 'FLUVIAL'],
                    'TIPO-LOGISTICA' => ['NACIONAL', 'LOCAL', 'INVERSA', 'TRANSITO'],
                ];

                foreach ($tipoValidaciones as $campo => $tiposValidos) {
                    if (!in_array(strtoupper($dato[$campo]), $tiposValidos)) {
                        return ['success' => false, 'message' => 'Error: ' . $campo . ' en la fila ' . ($fila + 2) . ' tiene un valor no válido.'];
                    }
                }

                // VALIDAR UBIGEO
                if (!verificarUbigeo($dato['DEPARTAMENTO'], $dato['PROVINCIA'], $dato['DISTRITO'], $bd)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo en la fila ' . ($fila + 2) . ' no existe.'];
                }

                // VALIDAR VALORIZADO EL PRODUCTO

                if (strtoupper($dato['TIPO-ENVIO']) == 'VALORIZADO') {
                    $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
                    $stmtUbigeo->bindParam(':departamento', $dato['DEPARTAMENTO']);
                    $stmtUbigeo->bindParam(':provincia', $dato['PROVINCIA']);
                    $stmtUbigeo->bindParam(':distrito', $dato['DISTRITO']);
                    $stmtUbigeo->execute();
                    $codigoUbigeo = $stmtUbigeo->fetchColumn();

                    $stmt = $bd->prepare('SELECT COUNT(*) FROM tarifarios_clientes_valorizados 
                    WHERE ubigeo_tarifario_cliente_valorizado = :ubigeo
                    AND id_area_tarifario_cliente_valorizado = :id_area
                    AND id_cliente_tarifario_cliente_valorizado = :id_cliente
                    AND producto_tarifario_cliente_valorizado = :producto');

                    $stmt->bindParam(':ubigeo', $codigoUbigeo);
                    $stmt->bindParam(':id_area', $id_area);
                    $stmt->bindParam(':id_cliente', $id_cliente);
                    $stmt->bindParam(':producto', $dato['CONTENIDO-MERC']);
                    $stmt->execute();
                    $row_count = $stmt->fetchColumn();

                    if ($row_count == 0) {
                        return ['success' => false, 'message' => 'Error: No existe el valor de CONTENIDO-MERC en el Tarifario.'];
                    }
                }

                // VALIDAR SI EXISTE TARIFARIO
                $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
                $stmtUbigeo->bindParam(':departamento', $dato['DEPARTAMENTO']);
                $stmtUbigeo->bindParam(':provincia', $dato['PROVINCIA']);
                $stmtUbigeo->bindParam(':distrito', $dato['DISTRITO']);
                $stmtUbigeo->execute();
                $codigoUbigeo = $stmtUbigeo->fetchColumn();

                if (strtoupper($dato['TIPO-ENVIO']) == 'COURRIER') {
                    $sql = "SELECT
                tcc.tmin_tarifario_cliente_courrier AS 'tmin',
                tcc.tmax_tarifario_cliente_courrier AS 'tmax'
                    FROM
                tarifarios_clientes_courriers tcc
                    INNER JOIN
                clientes c ON tcc.id_cliente_tarifario_cliente_courrier = c.id
                    WHERE
                tcc.ubigeo_tarifario_cliente_courrier = :ubigeo
                    AND tcc.id_cliente_tarifario_cliente_courrier = :id_cliente
                    AND tcc.id_area_tarifario_cliente_courrier = :id_area;
                    ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'AEREO') {
                    $sql = "SELECT
                    tcc.tmin_tarifario_cliente_aereo AS 'tmin',
                    tcc.tmax_tarifario_cliente_aereo AS 'tmax'
                        FROM
                    tarifarios_clientes_aereos tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_aereo = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_aereo = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_aereo = :id_cliente
                        AND tcc.id_area_tarifario_cliente_aereo = :id_area;
                        ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'CARGA') {
                    $sql = "SELECT
                    tcc.tmin_tarifario_cliente_carga AS 'tmin',
                    tcc.tmax_tarifario_cliente_carga AS 'tmax'
                        FROM
                    tarifarios_clientes_cargas tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_carga = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_carga = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_carga = :id_cliente
                        AND tcc.id_area_tarifario_cliente_carga = :id_area;
                    ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'VALORIZADO') {
                    $sql = "SELECT
                    producto_tarifario_cliente_valorizado,
                    tcc.tmin_tarifario_cliente_valorizado AS 'tmin',
                    tcc.tmax_tarifario_cliente_valorizado AS 'tmax'
                        FROM
                    tarifarios_clientes_valorizados tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_valorizado = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_valorizado = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_valorizado = :id_cliente
                        AND tcc.id_area_tarifario_cliente_valorizado = :id_area;
                    ";
                }
                $stmt = $bd->prepare($sql);
                $stmt->execute(['ubigeo' => $codigoUbigeo, 'id_cliente' => $id_cliente, 'id_area' => $id_area]);
                $result_tarifario = $stmt->fetch();
                if (!$result_tarifario) {
                    return ['success' => false, 'message' => 'Error: El Destino no tiene Tarifario en la fila' . ($fila + 2) . '.'];
                }
            }


            foreach ($datos as $fila => $dato) {

                $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
                $stmtUbigeo->bindParam(':departamento', $dato['DEPARTAMENTO']);
                $stmtUbigeo->bindParam(':provincia', $dato['PROVINCIA']);
                $stmtUbigeo->bindParam(':distrito', $dato['DISTRITO']);
                $stmtUbigeo->execute();
                $codigoUbigeo = $stmtUbigeo->fetchColumn();

                if (strtoupper($dato['TIPO-ENVIO']) == 'COURRIER') {
                    $sql = "SELECT
                tcc.tmin_tarifario_cliente_courrier AS 'tmin',
                tcc.tmax_tarifario_cliente_courrier AS 'tmax'
                    FROM
                tarifarios_clientes_courriers tcc
                    INNER JOIN
                clientes c ON tcc.id_cliente_tarifario_cliente_courrier = c.id
                    WHERE
                tcc.ubigeo_tarifario_cliente_courrier = :ubigeo
                    AND tcc.id_cliente_tarifario_cliente_courrier = :id_cliente
                    AND tcc.id_area_tarifario_cliente_courrier = :id_area;
                    ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'AEREO') {
                    $sql = "SELECT
                    tcc.tmin_tarifario_cliente_aereo AS 'tmin',
                    tcc.tmax_tarifario_cliente_aereo AS 'tmax'
                        FROM
                    tarifarios_clientes_aereos tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_aereo = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_aereo = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_aereo = :id_cliente
                        AND tcc.id_area_tarifario_cliente_aereo = :id_area;
                        ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'CARGA') {
                    $sql = "SELECT
                    tcc.tmin_tarifario_cliente_carga AS 'tmin',
                    tcc.tmax_tarifario_cliente_carga AS 'tmax'
                        FROM
                    tarifarios_clientes_cargas tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_carga = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_carga = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_carga = :id_cliente
                        AND tcc.id_area_tarifario_cliente_carga = :id_area;
                    ";
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'VALORIZADO') {
                    $sql = "SELECT
                    producto_tarifario_cliente_valorizado,
                    tcc.tmin_tarifario_cliente_valorizado AS 'tmin',
                    tcc.tmax_tarifario_cliente_valorizado AS 'tmax'
                        FROM
                    tarifarios_clientes_valorizados tcc
                        INNER JOIN
                    clientes c ON tcc.id_cliente_tarifario_cliente_valorizado = c.id
                        WHERE
                    tcc.ubigeo_tarifario_cliente_valorizado = :ubigeo
                        AND tcc.id_cliente_tarifario_cliente_valorizado = :id_cliente
                        AND tcc.id_area_tarifario_cliente_valorizado = :id_area;
                    ";
                }
                $stmt = $bd->prepare($sql);
                $stmt->execute(['ubigeo' => $codigoUbigeo, 'id_cliente' => $id_cliente, 'id_area' => $id_area]);
                $result_tarifario = $stmt->fetch(PDO::FETCH_ASSOC);

                $tmin = $result_tarifario['tmin'];
                $tmax = $result_tarifario['tmax'];

                $resultadosTarifa = totalTarifa(intval($dato['CANT-MERC']), floatval($dato['PESO-MERC']), floatval($dato['LARGO']), floatval($dato['ANCHO']), floatval($dato['ALTO']), $codigoUbigeo, $id_cliente, $id_area, strtoupper($dato['TIPO-ENVIO']), $dato['CONTENIDO-MERC']);
                $totalTarifa = $resultadosTarifa['result'];
                $metrosCubicos = $resultadosTarifa['metrosCubicos'];
                $pesoVolumen = $resultadosTarifa['pesoVolumen'];

                $valorMercanciaDato = empty($dato['VALOR-MERCANCÍA']) ? $dato['VALOR-MERCANCÍA'] : 0;

                $resultadoAdicional = totalAdicionales(floatval($valorMercanciaDato), 0, 0, 0, 0, 0);
                $totalAdicional = $resultadoAdicional['result'];
                $seguroAdicional = $resultadoAdicional['seguroAdicional'];

                if (strtoupper($dato['TIPO-ENVIO']) == 'COURRIER') {
                    $tarifario = 'Courrier';
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'AEREO') {
                    $tarifario = 'Aerea';
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'CARGA') {
                    $tarifario = 'Carga';
                } else if (strtoupper($dato['TIPO-ENVIO']) == 'VALORIZADO') {
                    $tarifario = 'Valorizada';
                }

                if (strtoupper($dato['TIPO-MOVIMIENTO']) == 'TERRESTRE') {
                    $tipo_movimiento = 'Terrestre';
                } else if (strtoupper($dato['TIPO-MOVIMIENTO']) == 'AEREO') {
                    $tipo_movimiento = 'Aereo';
                } else if (strtoupper($dato['TIPO-MOVIMIENTO']) == 'FLUVIAL') {
                    $tipo_movimiento = 'Fluvial';
                }

                if (strtoupper($dato['TIPO-LOGISTICA']) == 'NACIONAL') {
                    $tipo_logistico = 'Nacional';
                } else if (strtoupper($dato['TIPO-LOGISTICA']) == 'LOCAL') {
                    $tipo_logistico = 'Local';
                } else if (strtoupper($dato['TIPO-LOGISTICA']) == 'INVERSA') {
                    $tipo_logistico = 'Inversa';
                } else if (strtoupper($dato['TIPO-LOGISTICA']) == 'TRANSITO') {
                    $tipo_logistico = 'Transito';
                }

                $data = array(
                    "id_registro_masivo_destino" => "$identificadorOrdenServicioMasivo-0000000",
                    "id_cliente_registro_masivo_destino" => $id_cliente,
                    "id_area_registro_masivo_destino" => $id_area,
                    "consignado_registro_masivo_destino" => $dato['CONSIGNADO'],
                    "dni_ruc_registro_masivo_destino" => $dato['RUC/DNI'],
                    "telefono_registro_masivo_destino" => $dato['TELÉFONO'],
                    "telefono_exc_registro_masivo_destino" => $dato['TELÉFONO-EX'],
                    "direccion_registro_masivo_destino" => $dato['DIRECCIÓN'],
                    "referencias_registro_masivo_destino" => $dato['REFERENCIAS'],
                    "tarifario_registro_masivo_destino" => $tarifario,
                    "ubigeo_registro_masivo_destino" => $codigoUbigeo,
                    "tmin_entrega_registro_masivo_destino" => $tmin,
                    "tmax_entrega_registro_masivo_destino" => $tmax,
                    "tipo_envio_registro_masivo_destino" => $tipo_movimiento,
                    "contenido_mercancia_registro_masivo_destino" => $dato['CONTENIDO-MERC'],
                    "peso_mercancia_registro_masivo_destino" => $dato['PESO-MERC'],
                    "total_metros_cubicos_registro_masivo_destino" => $metrosCubicos,
                    "total_tarifa_registro_masivo_destino" => $totalTarifa,
                    "tipo_logistica_registro_masivo_destino" => $tipo_logistico,
                    "cantidad_mercancia_registro_masivo_destino" => $dato['CANT-MERC'],
                    "largo_registro_masivo_destino" => empty($dato['LARGO']) ? 0 : $dato['LARGO'],
                    "ancho_registro_masivo_destino" => empty($dato['ANCHO']) ? 0 : $dato['ANCHO'],
                    "alto_registro_masivo_destino" => empty($dato['ALTO']) ? 0 : $dato['ALTO'],
                    "total_peso_volumen_registro_masivo_destino" => $pesoVolumen,
                    "valor_mercancia_registro_masivo_destino" => $valorMercanciaDato,
                    "packing_registro_masivo_destino" => 0,
                    "seguro_registro_masivo_destino" => $seguroAdicional,
                    "monta_carga_registro_masivo_destino" => 0,
                    "total_adicional_registro_masivo_destino" => $totalAdicional,
                    "retorno_registro_masivo_destino" => 0,
                    "estiba_desestiba_registro_masivo_destino" => 0,
                    "transporte_extra_registro_masivo_destino" => 0,
                    "guia_transportista_registro_masivo_destino" => empty($dato['G-TRANSPORTISTA']) ? '-' : $dato['G-TRANSPORTISTA'],
                    "guia_remision_registro_masivo_destino" => empty($dato['G-REMISIÓN']) ? '-' : $dato['G-REMISIÓN'],
                    "documento_1_registro_masivo_destino" => empty($dato['NRO. PEDIDO']) ? '-' : $dato['NRO. PEDIDO'],
                    "documento_2_registro_masivo_destino" => empty($dato['DOC-ADICIONAL']) ? '-' : $dato['DOC-ADICIONAL'],
                    "id_creador_registro_masivo_destino" => $id_usuario,
                    "fecha_creado" => $fecha_actual
                );

                $sqlGuadar = "INSERT INTO registro_masivo_destinos (
                    id_registro_masivo_destino, id_cliente_registro_masivo_destino, id_area_registro_masivo_destino, consignado_registro_masivo_destino, dni_ruc_registro_masivo_destino, 
                    telefono_registro_masivo_destino, telefono_exc_registro_masivo_destino, direccion_registro_masivo_destino, 
                    referencias_registro_masivo_destino, tarifario_registro_masivo_destino, ubigeo_registro_masivo_destino, 
                    tmin_entrega_registro_masivo_destino, tmax_entrega_registro_masivo_destino, tipo_envio_registro_masivo_destino, 
                    contenido_mercancia_registro_masivo_destino, peso_mercancia_registro_masivo_destino, 
                    total_metros_cubicos_registro_masivo_destino, total_tarifa_registro_masivo_destino, 
                    tipo_logistica_registro_masivo_destino, cantidad_mercancia_registro_masivo_destino, 
                    largo_registro_masivo_destino, ancho_registro_masivo_destino, alto_registro_masivo_destino, 
                    total_peso_volumen_registro_masivo_destino, valor_mercancia_registro_masivo_destino, 
                    packing_registro_masivo_destino, seguro_registro_masivo_destino, monta_carga_registro_masivo_destino, 
                    total_adicional_registro_masivo_destino, retorno_registro_masivo_destino, 
                    estiba_desestiba_registro_masivo_destino, transporte_extra_registro_masivo_destino, guia_transportista_registro_masivo_destino,
                    guia_remision_registro_masivo_destino, documento_1_registro_masivo_destino, documento_2_registro_masivo_destino,
                    id_creador_registro_masivo_destino, fecha_creado
                ) VALUES (
                    :id_registro_masivo_destino, :id_cliente_registro_masivo_destino, :id_area_registro_masivo_destino, UPPER(:consignado_registro_masivo_destino), :dni_ruc_registro_masivo_destino, 
                    :telefono_registro_masivo_destino, :telefono_exc_registro_masivo_destino, UPPER(:direccion_registro_masivo_destino), 
                    UPPER(:referencias_registro_masivo_destino), :tarifario_registro_masivo_destino, :ubigeo_registro_masivo_destino, 
                    :tmin_entrega_registro_masivo_destino, :tmax_entrega_registro_masivo_destino, :tipo_envio_registro_masivo_destino, 
                    UPPER(:contenido_mercancia_registro_masivo_destino), :peso_mercancia_registro_masivo_destino, 
                    :total_metros_cubicos_registro_masivo_destino, :total_tarifa_registro_masivo_destino, 
                    :tipo_logistica_registro_masivo_destino, :cantidad_mercancia_registro_masivo_destino, 
                    :largo_registro_masivo_destino, :ancho_registro_masivo_destino, :alto_registro_masivo_destino, 
                    :total_peso_volumen_registro_masivo_destino, :valor_mercancia_registro_masivo_destino, 
                    :packing_registro_masivo_destino, :seguro_registro_masivo_destino, :monta_carga_registro_masivo_destino, 
                    :total_adicional_registro_masivo_destino, :retorno_registro_masivo_destino, 
                    :estiba_desestiba_registro_masivo_destino, :transporte_extra_registro_masivo_destino, :guia_transportista_registro_masivo_destino,
                    :guia_remision_registro_masivo_destino, :documento_1_registro_masivo_destino, :documento_2_registro_masivo_destino,
                    :id_creador_registro_masivo_destino, :fecha_creado
                )";
                $stmt = $bd->prepare($sqlGuadar);
                $stmt->execute($data);
            }
            return ['success' => true, 'message' => '¡Destino guardado correctamente!'];
        }
    } else {
        return ['success' => false, 'message' => 'Debe tener al menos 1 registro para guardar.'];
    }
}


function totalAdicionales($valorMercancia, $packing, $costoRetorno, $estibaDesestiba, $montaCarga, $transporteExtra)
{
    $seguro = $valorMercancia * 0.1;

    $totalTarifa = 0;
    if (!empty($packing)) {
        $totalTarifa += $packing;
    }

    if (!empty($montaCarga)) {
        $totalTarifa += $montaCarga;
    }

    if (!empty($costoRetorno)) {
        $totalTarifa += $costoRetorno;
    }

    if (!empty($estibaDesestiba)) {
        $totalTarifa += $estibaDesestiba;
    }

    if (!empty($seguro)) {
        $totalTarifa += $seguro;
    }

    if (!empty($transporteExtra)) {
        $totalTarifa += $transporteExtra;
    }

    return (['result' => number_format($totalTarifa, 4, ".", ""), 'seguroAdicional' => number_format($seguro, 4, ".", "")]);
}

function totalTarifa($cantidadMerc, $pesoMerc, $largo, $ancho, $alto, $ubigeo, $id_cliente, $id_area, $tipoTarifario, $valorSeleccionado)
{
    $bd = obtenerConexion();
    if ($tipoTarifario == 'Courrier' || $tipoTarifario == 'COURRIER') {
        $consulta = $bd->prepare("SELECT
    tcc.kg_tarifario_cliente_courrier AS 'kg',
    tcc.kg_adicional_tarifario_cliente_courrier AS 'kg_adicional'
        FROM
    tarifarios_clientes_courriers tcc
        INNER JOIN
    clientes c ON tcc.id_cliente_tarifario_cliente_courrier = c.id
        WHERE
    tcc.ubigeo_tarifario_cliente_courrier = :ubigeo
        AND tcc.id_cliente_tarifario_cliente_courrier = :id_cliente
        AND tcc.id_area_tarifario_cliente_courrier = :id_area;
        ");
    } else if ($tipoTarifario == 'Aerea' || $tipoTarifario == 'AEREO') {
        $consulta = $bd->prepare("SELECT
        tcc.kg_tarifario_cliente_aereo AS 'kg',
        tcc.kg_adicional_tarifario_cliente_aereo AS 'kg_adicional'
            FROM
        tarifarios_clientes_aereos tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_aereo = c.id
            WHERE
        tcc.ubigeo_tarifario_cliente_aereo = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_aereo = :id_cliente
            AND tcc.id_area_tarifario_cliente_aereo = :id_area;
            ");
    } else if ($tipoTarifario == 'Carga' || $tipoTarifario == 'CARGA') {
        $consulta = $bd->prepare("SELECT
        tcc.kg_maximo_tarifario_cliente_carga AS 'kg_maximo',
        tcc.kg_base_adicional_tarifario_cliente_carga AS 'kg_base',
        tcc.paquete_tarifario_cliente_carga AS 'paquete'
            FROM
        tarifarios_clientes_cargas tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_carga = c.id
            WHERE
        tcc.ubigeo_tarifario_cliente_carga = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_carga = :id_cliente
            AND tcc.id_area_tarifario_cliente_carga = :id_area;
        ");
    } else if ($tipoTarifario == 'Valorizada' || $tipoTarifario == 'VALORIZADO') {
        $consulta = $bd->prepare("SELECT
        tcc.costo_producto_tarifario_cliente_valorizado AS 'costo_producto'
            FROM
        tarifarios_clientes_valorizados tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_valorizado = c.id
            WHERE tcc.producto_tarifario_cliente_valorizado = :producto
            AND tcc.ubigeo_tarifario_cliente_valorizado = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_valorizado = :id_cliente
            AND tcc.id_area_tarifario_cliente_valorizado = :id_area;
        ");
        $consulta->bindParam(':producto', $valorSeleccionado);
    }
    $consulta->bindParam(':ubigeo', $ubigeo);
    $consulta->bindParam(':id_cliente', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();

    $resultado = $consulta->fetch(PDO::FETCH_ASSOC);

    $totalPesoMerc = $pesoMerc;
    $metrosCubicos = ($largo * $ancho * $alto / 1000000) * $cantidadMerc;
    $pesoVolumen = ($largo * $ancho * $alto / 6000) * $cantidadMerc;

    if ($resultado && $tipoTarifario == 'Courrier' || $tipoTarifario == 'Aerea' || $tipoTarifario == 'COURRIER' || $tipoTarifario == 'AEREO') {
        $kg = !empty($resultado['kg']) ? $resultado['kg'] : 0;
        $kg_adicional = !empty($resultado['kg_adicional']) ? $resultado['kg_adicional'] : 0;

        if ($totalPesoMerc > $pesoVolumen || $totalPesoMerc == $pesoVolumen) {
            $totalTarifa = floatval($kg + ($totalPesoMerc - 1) * $kg_adicional);
        } else {
            $totalTarifa = floatval($kg + ($pesoVolumen - 1) * $kg_adicional);
        }
    } else if ($resultado && $tipoTarifario == 'Carga' || $tipoTarifario == 'CARGA') {
        $kg_maximo = !empty($resultado['kg_maximo']) ? $resultado['kg_maximo'] : 0;
        $kg_base = !empty($resultado['kg_base']) ? $resultado['kg_base'] : 0;
        $paquete = !empty($resultado['paquete']) ? $resultado['paquete'] : 0;
        if ($pesoMerc <= $kg_maximo) {
            $totalTarifa = $paquete * $cantidadMerc;
        } elseif ($pesoMerc > $kg_maximo) {
            if ($totalPesoMerc > $pesoVolumen || $totalPesoMerc == $pesoVolumen) {
                $totalTarifa = $totalPesoMerc * $kg_base;
            } elseif ($pesoVolumen > $totalPesoMerc) {
                $totalTarifa = $kg_base * $pesoVolumen;
            }
        }
    } else if ($resultado && $tipoTarifario == 'Valorizada' || $tipoTarifario == 'VALORIZADO') {
        $precio_valor = !empty($resultado['costo_producto']) ? $resultado['costo_producto'] : 0;
        $totalTarifa = $precio_valor * $cantidadMerc;
    } else {
        $totalTarifa = 0;
    }

    return (['result' => number_format($totalTarifa, 4, ".", ""), 'metrosCubicos' => number_format($metrosCubicos, 4, ".", ""), 'pesoVolumen' => number_format($pesoVolumen, 4, ".", "")]);
}


function obtenerVariableDelEntorno($key)
{
    if (defined("_ENV_CACHE")) {
        $vars = _ENV_CACHE;
    } else {
        $file = "../../services/env.php";
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
    $database = new PDO('mysql:host=161.132.42.146;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
