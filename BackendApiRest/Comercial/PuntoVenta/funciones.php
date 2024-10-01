<?php
function obtenerDatosPdf($id_cotizacion)
{
    $bd = obtenerConexion();
    $stmt_cotizacion_cliente = $bd->prepare("SELECT cli.* ,c.*, u.*
        FROM punto_ventas c 
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_punto_venta
        LEFT JOIN ubigeo u ON u.UBIGEO = cli.ubigeo_cliente  
        WHERE c.id_punto_venta = :id_punto_venta;
    ");
    $stmt_cotizacion_cliente->bindParam(':id_punto_venta', $id_cotizacion);
    $stmt_cotizacion_cliente->execute();
    $cotizacion_cliente_data = $stmt_cotizacion_cliente->fetch(PDO::FETCH_ASSOC);
    $stmt_cotizacion_destinos = $bd->prepare(" SELECT * FROM punto_ventas_destinos cd 
    LEFT JOIN ubigeo u ON u.UBIGEO = cd.ubigeo_punto_venta_destino 
    WHERE cd.id_punto_venta_destino = :id_punto_venta;
    ");
    $stmt_cotizacion_destinos->bindParam(':id_punto_venta', $id_cotizacion);
    $stmt_cotizacion_destinos->execute();
    $cotizacion_destinos_data = $stmt_cotizacion_destinos->fetchAll(PDO::FETCH_ASSOC);
    $data = array(
        'cotizacion_cliente' => $cotizacion_cliente_data,
        'cotizacion_destinos' => $cotizacion_destinos_data
    );
    return $data;
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
    c.id_punto_venta as 'id_cotizacion',
    c.id_cliente_punto_venta as 'id_cliente_cotizacion',
    c.id_area_punto_venta as 'id_area_cotizacion',
    c.cantidad_destinos_punto_venta as 'cantidad_destinos_cotizacion',
    c.recibo_punto_venta as 'recibo_cotizacion', 
    c.sub_total_punto_venta as 'sub_total_cotizacion',
    c.igv_punto_venta as 'igv_cotizacion',
    c.precio_total_punto_venta as 'precio_total_cotizacion',
    c.validacion_punto_venta as 'validacion_cotizacion',
    c.id_creador_punto_venta as 'id_creador_cotizacion',
    c.estado,
    c.fecha_creado,
    c.fecha_actualizado,
    cli.razon_social_cliente,
    cli.representante_cliente,
    cli.telefono_cliente,
    cli.email_cliente,
    CASE
        WHEN c.validacion_punto_venta = 0 THEN 'Falta validar'
        WHEN c.validacion_punto_venta = 1 THEN 'Enviado a validar'
        ELSE 'Estado desconocido'
    END AS validacion_cotizacion
FROM
punto_ventas c
INNER JOIN
    clientes cli ON c.id_cliente_punto_venta = cli.id
INNER JOIN
    areas ar ON c.id_area_punto_venta = ar.id
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
        !empty($datos['tipoComprobante']) &&
        !empty($datos['id_creador'])
    ) {
        $id_creador = $datos['id_creador'];
        $id_cliente = $datos['clienteElegido'];
        $id_area = $datos['areaElegida'];
        $calculoTotal = obtenerCalculoTotal($id_cliente, $id_area);
        $recibo_cotizacion = $datos['tipoComprobante'];
        $sub_total_cotizacion = $calculoTotal['sub_total'];
        $igv_cotizacion = $calculoTotal['igv_1_18'];
        $precio_total_cotizacion = $calculoTotal['total_calculo'];

        $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
        $consultaID->execute();
        $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
        $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'];
        if (empty($identificadorPuntoVenta)) {
            return ['success' => false, 'mensaje' => 'Debe configurar la guía!.'];
        }

        $stmt = $bd->prepare("SELECT MAX(id_punto_venta) AS max_id FROM punto_ventas WHERE id_punto_venta LIKE '$identificadorPuntoVenta-%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $id_cotizacion = $identificadorPuntoVenta . '-0000001';
        } else {
            $numeric_part = substr($max_id_cotizacion, strlen($identificadorPuntoVenta) + 1) + 1;
            $id_cotizacion = $identificadorPuntoVenta . '-' . str_pad($numeric_part, 7, '0', STR_PAD_LEFT);
        }

        $sql = "SELECT count(*)
        FROM punto_ventas_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_punto_venta_destino = c.id
        INNER JOIN areas a ON cd.id_area_punto_venta_destino = a.id
        WHERE cd.id_punto_venta_destino = '$identificadorPuntoVenta-0000000'
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

                    $sql_upt_ = "UPDATE punto_ventas_destinos SET id_punto_venta_destino = :id_cotizacion  WHERE id_punto_venta_destino = '$identificadorPuntoVenta-0000000' 
                    AND id_cliente_punto_venta_destino = :id_cliente
                    AND id_area_punto_venta_destino = :id_area;";
                    $stmt = $bd->prepare($sql_upt_);
                    $stmt->bindParam(':id_cotizacion', $id_cotizacion);
                    $stmt->bindParam(':id_cliente', $id_cliente);
                    $stmt->bindParam(':id_area', $id_area);
                    $stmt->execute();

                    $sql = "INSERT INTO punto_ventas(id_punto_venta, id_cliente_punto_venta, id_area_punto_venta, cantidad_destinos_punto_venta, recibo_punto_venta, sub_total_punto_venta, igv_punto_venta, precio_total_punto_venta, id_creador_punto_venta, validacion_punto_venta,fecha_creado) 
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

                    return ['success' => true, 'mensaje' => '¡Punto de Venta Guardado Correctamente!', 'datosGuardados' => $datos];
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
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'] ?? '';
    $stmt = $bd->prepare("
            SELECT 
                SUM(cd.total_tarifa_punto_venta_destino) AS total_costo_envio, 
                SUM(cd.total_adicional_punto_venta_destino) AS total_costo_adicional
            FROM 
                punto_ventas_destinos cd
            INNER JOIN 
                clientes c ON cd.id_cliente_punto_venta_destino = c.id
            INNER JOIN 
                areas a ON cd.id_area_punto_venta_destino = a.id
            WHERE 
                cd.id_cliente_punto_venta_destino = :id_cliente 
                AND cd.id_area_punto_venta_destino = :id_area 
                AND cd.id_punto_venta_destino = '$identificadorPuntoVenta-0000000'
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
        cd.id_punto_venta_destino AS id_cotizacion_cotizacion_destino,
        cd.id_cliente_punto_venta_destino AS id_cliente_cotizacion_destino,
        cd.id_area_punto_venta_destino AS id_area_cotizacion_destino,
        cd.consignado_punto_venta_destino AS consignado_cotizacion_destino,
        cd.dni_ruc_punto_venta_destino AS dni_ruc_cotizacion_destino,
        cd.telefono_punto_venta_destino AS telefono_cotizacion_destino,
        cd.telefono_exc_punto_venta_destino AS telefono_exc_cotizacion_destino,
        cd.direccion_punto_venta_destino AS direccion_cotizacion_destino,
        cd.referencias_punto_venta_destino AS referencias_cotizacion_destino,
        cd.tarifario_punto_venta_destino AS tarifario_cotizacion_destino,
        cd.ubigeo_punto_venta_destino AS ubigeo_cotizacion_destino,
        cd.tmin_entrega_punto_venta_destino AS tmin_entrega_cotizacion_destino,
        cd.tmax_entrega_punto_venta_destino AS tmax_entrega_cotizacion_destino,
        cd.tipo_envio_punto_venta_destino AS tipo_envio_cotizacion_destino,
        cd.contenido_mercancia_punto_venta_destino AS contenido_mercancia_cotizacion_destino,
        cd.peso_mercancia_punto_venta_destino AS peso_mercancia_cotizacion_destino,
        cd.total_metros_cubicos_punto_venta_destino AS total_metros_cubicos_cotizacion_destino,
        cd.total_tarifa_punto_venta_destino AS total_tarifa_cotizacion_destino,
        cd.tipo_logistica_punto_venta_destino AS tipo_logistica_cotizacion_destino,
        cd.cantidad_mercancia_punto_venta_destino AS cantidad_mercancia_cotizacion_destino,
        cd.largo_punto_venta_destino AS largo_cotizacion_destino,
        cd.ancho_punto_venta_destino AS ancho_cotizacion_destino,
        cd.alto_punto_venta_destino AS alto_cotizacion_destino,
        cd.total_peso_volumen_punto_venta_destino AS total_peso_volumen_cotizacion_destino,
        cd.valor_mercancia_punto_venta_destino AS valor_mercancia_cotizacion_destino,
        cd.packing_punto_venta_destino AS packing_cotizacion_destino,
        cd.seguro_punto_venta_destino AS seguro_cotizacion_destino,
        cd.monta_carga_punto_venta_destino AS monta_carga_cotizacion_destino,
        cd.total_adicional_punto_venta_destino AS total_adicional_cotizacion_destino,
        cd.retorno_punto_venta_destino AS retorno_cotizacion_destino,
        cd.estiba_desestiba_punto_venta_destino AS estiba_desestiba_cotizacion_destino,
        cd.transporte_extra_punto_venta_destino AS transporte_extra_cotizacion_destino,
        cd.guia_transportista_punto_venta_destino AS guia_transportista_cotizacion_destino,
        cd.guia_remision_punto_venta_destino AS guia_remision_cotizacion_destino,
        cd.documento_1_punto_venta_destino AS documento_1_cotizacion_destino,
        cd.documento_2_punto_venta_destino AS documento_2_cotizacion_destino,
        cd.id_creador_punto_venta_destino AS id_creador_cotizacion_destino,
        cd.estado AS estado,
        fecha_creado AS fecha_creado,
        fecha_actualizado AS fecha_actualizado, 
        dep.id AS departamento_id,
        prov.id AS provincia_id
    FROM 
        punto_ventas_destinos cd
    INNER JOIN 
        distritos dis ON cd.ubigeo_punto_venta_destino = dis.ubigeo
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
    $sentencia = $bd->prepare("DELETE FROM punto_ventas_destinos WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function obtenerListaDestinos($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'] ?? '';
    $consulta = $bd->prepare("SELECT cd.id_punto_venta_destino, cd.ubigeo_punto_venta_destino, cd.id as 'id_cotizacion_destino', ub.DESTINO as 'destino' FROM punto_ventas_destinos as cd
    INNER JOIN ubigeo as ub on ub.UBIGEO = cd.ubigeo_punto_venta_destino
    INNER JOIN clientes as cli on cli.id = cd.id_cliente_punto_venta_destino
    INNER JOIN areas as ar on ar.id = cd.id_area_punto_venta_destino
    WHERE cd.id_cliente_punto_venta_destino = :id_cliente
    AND cd.id_area_punto_venta_destino = :id_area AND cd.id_punto_venta_destino = '$identificadorPuntoVenta-0000000' ORDER BY cd.id DESC;");
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
                "id_cliente_punto_venta_destino" => $datos['id_cliente'],
                "id_area_punto_venta_destino" => $datos['id_area'],
                "consignado_punto_venta_destino" => $datos['consignado_cotizacion_destino'],
                "dni_ruc_punto_venta_destino" => $datos['dni_ruc_cotizacion_destino'],
                "telefono_punto_venta_destino" => $datos['telefono_cotizacion_destino'],
                "telefono_exc_punto_venta_destino" => $datos['telefono_exc_cotizacion_destino'],
                "direccion_punto_venta_destino" => $datos['direccion_cotizacion_destino'],
                "referencias_punto_venta_destino" => $datos['referencias_cotizacion_destino'],
                "tarifario_punto_venta_destino" => $datos['tarifario_cotizacion_destino'],
                "ubigeo_punto_venta_destino" => $datos['ubigeo_cotizacion_destino'],
                "tmin_entrega_punto_venta_destino" => $datos['tmin_entrega_cotizacion_destino'],
                "tmax_entrega_punto_venta_destino" => $datos['tmax_entrega_cotizacion_destino'],
                "tipo_envio_punto_venta_destino" => $datos['tipo_envio_cotizacion_destino'],
                "contenido_mercancia_punto_venta_destino" => $datos['contenido_mercancia_cotizacion_destino'],
                "peso_mercancia_punto_venta_destino" => $datos['peso_mercancia_cotizacion_destino'],
                "total_metros_cubicos_punto_venta_destino" => $datos['total_metros_cubicos_cotizacion_destino'],
                "total_tarifa_punto_venta_destino" => $datos['total_tarifa_cotizacion_destino'],
                "tipo_logistica_punto_venta_destino" => $datos['tipo_logistica_cotizacion_destino'],
                "cantidad_mercancia_punto_venta_destino" => $datos['cantidad_mercancia_cotizacion_destino'],
                "largo_punto_venta_destino" => empty($datos['largo_cotizacion_destino']) ? $datos['largo_cotizacion_destino'] : 0,
                "ancho_punto_venta_destino" => empty($datos['ancho_cotizacion_destino']) ? $datos['ancho_cotizacion_destino'] : 0,
                "alto_punto_venta_destino" => empty($datos['alto_cotizacion_destino']) ? $datos['alto_cotizacion_destino'] : 0,
                "total_peso_volumen_punto_venta_destino" => $datos['total_peso_volumen_cotizacion_destino'],
                "valor_mercancia_punto_venta_destino" => $datos['valor_mercancia_cotizacion_destino'],
                "packing_punto_venta_destino" => empty($datos['packing_cotizacion_destino']) ? $datos['packing_cotizacion_destino'] : 0,
                "seguro_punto_venta_destino" => $datos['seguro_cotizacion_destino'],
                "monta_carga_punto_venta_destino" => empty($datos['monta_carga_cotizacion_destino']) ? $datos['monta_carga_cotizacion_destino'] : 0,
                "total_adicional_punto_venta_destino" => $datos['total_adicional_cotizacion_destino'],
                "retorno_punto_venta_destino" => empty($datos['retorno_cotizacion_destino']) ? $datos['retorno_cotizacion_destino'] : 0,
                "estiba_desestiba_punto_venta_destino" => empty($datos['estiba_desestiba_cotizacion_destino']) ? $datos['estiba_desestiba_cotizacion_destino'] : 0,
                "transporte_extra_punto_venta_destino" => empty($datos['transporte_extra_cotizacion_destino']) ? $datos['transporte_extra_cotizacion_destino'] : 0,
                "id_creador_punto_venta_destino" => $datos['id_creador'],
                "id_punto_venta_destino" => $datos['id_destino_cotizacion']
            );

            $sqlUpdate = "UPDATE punto_ventas_destinos SET
            id_cliente_punto_venta_destino = :id_cliente_punto_venta_destino,
            id_area_punto_venta_destino = :id_area_punto_venta_destino,
            consignado_punto_venta_destino = :consignado_punto_venta_destino,
            dni_ruc_punto_venta_destino = :dni_ruc_punto_venta_destino,
            telefono_punto_venta_destino = :telefono_punto_venta_destino,
            telefono_exc_punto_venta_destino = :telefono_exc_punto_venta_destino,
            direccion_punto_venta_destino = :direccion_punto_venta_destino,
            referencias_punto_venta_destino = :referencias_punto_venta_destino,
            tarifario_punto_venta_destino = :tarifario_punto_venta_destino,
            ubigeo_punto_venta_destino = :ubigeo_punto_venta_destino,
            tmin_entrega_punto_venta_destino = :tmin_entrega_punto_venta_destino,
            tmax_entrega_punto_venta_destino = :tmax_entrega_punto_venta_destino,
            tipo_envio_punto_venta_destino = :tipo_envio_punto_venta_destino,
            contenido_mercancia_punto_venta_destino = :contenido_mercancia_punto_venta_destino,
            peso_mercancia_punto_venta_destino = :peso_mercancia_punto_venta_destino,
            total_metros_cubicos_punto_venta_destino = :total_metros_cubicos_punto_venta_destino,
            total_tarifa_punto_venta_destino = :total_tarifa_punto_venta_destino,
            tipo_logistica_punto_venta_destino = :tipo_logistica_punto_venta_destino,
            cantidad_mercancia_punto_venta_destino = :cantidad_mercancia_punto_venta_destino,
            largo_punto_venta_destino = :largo_punto_venta_destino,
            ancho_punto_venta_destino = :ancho_punto_venta_destino,
            alto_punto_venta_destino = :alto_punto_venta_destino,
            total_peso_volumen_punto_venta_destino = :total_peso_volumen_punto_venta_destino,
            valor_mercancia_punto_venta_destino = :valor_mercancia_punto_venta_destino,
            packing_punto_venta_destino = :packing_punto_venta_destino,
            seguro_punto_venta_destino = :seguro_punto_venta_destino,
            monta_carga_punto_venta_destino = :monta_carga_punto_venta_destino,
            total_adicional_punto_venta_destino = :total_adicional_punto_venta_destino,
            retorno_punto_venta_destino = :retorno_punto_venta_destino,
            estiba_desestiba_punto_venta_destino = :estiba_desestiba_punto_venta_destino,
            transporte_extra_punto_venta_destino = :transporte_extra_punto_venta_destino,
            id_creador_punto_venta_destino = :id_creador_punto_venta_destino
        WHERE id = :id_punto_venta_destino";

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

function guardarDestino($datos)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (
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
        //!empty($datos['valor_mercancia_cotizacion_destino']) &&
        !empty($datos['seguro_cotizacion_destino']) &&
        !empty($datos['total_adicional_cotizacion_destino'])
    ) {
        $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
        $consultaID->execute();
        $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
        $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'];
        if (empty($identificadorPuntoVenta)) {
            return ['success' => false, 'mensaje' => 'Debe configurar la guía!.'];
        }
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
                "id_punto_venta_destino" => "$identificadorPuntoVenta-0000000",
                "id_cliente_punto_venta_destino" => $datos['id_cliente'],
                "id_area_punto_venta_destino" => $datos['id_area'],
                "consignado_punto_venta_destino" => $datos['consignado_cotizacion_destino'],
                "dni_ruc_punto_venta_destino" => $datos['dni_ruc_cotizacion_destino'],
                "telefono_punto_venta_destino" => $datos['telefono_cotizacion_destino'],
                "telefono_exc_punto_venta_destino" => $datos['telefono_exc_cotizacion_destino'],
                "direccion_punto_venta_destino" => $datos['direccion_cotizacion_destino'],
                "referencias_punto_venta_destino" => $datos['referencias_cotizacion_destino'],
                "tarifario_punto_venta_destino" => $datos['tarifario_cotizacion_destino'],
                "ubigeo_punto_venta_destino" => $datos['ubigeo_cotizacion_destino'],
                "tmin_entrega_punto_venta_destino" => $datos['tmin_entrega_cotizacion_destino'],
                "tmax_entrega_punto_venta_destino" => $datos['tmax_entrega_cotizacion_destino'],
                "tipo_envio_punto_venta_destino" => $datos['tipo_envio_cotizacion_destino'],
                "contenido_mercancia_punto_venta_destino" => $datos['contenido_mercancia_cotizacion_destino'],
                "peso_mercancia_punto_venta_destino" => $datos['peso_mercancia_cotizacion_destino'],
                "total_metros_cubicos_punto_venta_destino" => $datos['total_metros_cubicos_cotizacion_destino'],
                "total_tarifa_punto_venta_destino" => $datos['total_tarifa_cotizacion_destino'],
                "tipo_logistica_punto_venta_destino" => $datos['tipo_logistica_cotizacion_destino'],
                "cantidad_mercancia_punto_venta_destino" => $datos['cantidad_mercancia_cotizacion_destino'],

                "largo_punto_venta_destino" => empty($datos['largo_cotizacion_destino']) ? 0 : $datos['largo_cotizacion_destino'],
                "ancho_punto_venta_destino" => empty($datos['ancho_cotizacion_destino']) ? 0 : $datos['ancho_cotizacion_destino'],
                "alto_punto_venta_destino" => empty($datos['alto_cotizacion_destino']) ? 0 : $datos['alto_cotizacion_destino'],
                "total_peso_volumen_punto_venta_destino" => $datos['total_peso_volumen_cotizacion_destino'],
                "valor_mercancia_punto_venta_destino" => $datos['valor_mercancia_cotizacion_destino'],
                "packing_punto_venta_destino" => empty($datos['packing_cotizacion_destino']) ? 0 : $datos['packing_cotizacion_destino'],
                "seguro_punto_venta_destino" => $datos['seguro_cotizacion_destino'],
                "monta_carga_punto_venta_destino" => empty($datos['monta_carga_cotizacion_destino']) ? 0 : $datos['monta_carga_cotizacion_destino'],
                "total_adicional_punto_venta_destino" => $datos['total_adicional_cotizacion_destino'],
                "retorno_punto_venta_destino" => empty($datos['retorno_cotizacion_destino']) ? 0 : $datos['retorno_cotizacion_destino'],
                "estiba_desestiba_punto_venta_destino" => empty($datos['estiba_desestiba_cotizacion_destino']) ? 0 : $datos['estiba_desestiba_cotizacion_destino'],
                "transporte_extra_punto_venta_destino" => empty($datos['transporte_extra_cotizacion_destino']) ? 0 : $datos['transporte_extra_cotizacion_destino'],

                "id_creador_punto_venta_destino" => $datos['id_creador'],
                "fecha_creado" => $fecha_actual
            );

            $sqlGuadar = "INSERT INTO punto_ventas_destinos (
                id_punto_venta_destino, id_cliente_punto_venta_destino, id_area_punto_venta_destino, consignado_punto_venta_destino, dni_ruc_punto_venta_destino, 
                telefono_punto_venta_destino, telefono_exc_punto_venta_destino, direccion_punto_venta_destino, 
                referencias_punto_venta_destino, tarifario_punto_venta_destino, ubigeo_punto_venta_destino, 
                tmin_entrega_punto_venta_destino, tmax_entrega_punto_venta_destino, tipo_envio_punto_venta_destino, 
                contenido_mercancia_punto_venta_destino, peso_mercancia_punto_venta_destino, 
                total_metros_cubicos_punto_venta_destino, total_tarifa_punto_venta_destino, 
                tipo_logistica_punto_venta_destino, cantidad_mercancia_punto_venta_destino, 
                largo_punto_venta_destino, ancho_punto_venta_destino, alto_punto_venta_destino, 
                total_peso_volumen_punto_venta_destino, valor_mercancia_punto_venta_destino, 
                packing_punto_venta_destino, seguro_punto_venta_destino, monta_carga_punto_venta_destino, 
                total_adicional_punto_venta_destino, retorno_punto_venta_destino, 
                estiba_desestiba_punto_venta_destino, transporte_extra_punto_venta_destino, id_creador_punto_venta_destino,fecha_creado
            ) VALUES (
                :id_punto_venta_destino, :id_cliente_punto_venta_destino, :id_area_punto_venta_destino, :consignado_punto_venta_destino, :dni_ruc_punto_venta_destino, 
                :telefono_punto_venta_destino, :telefono_exc_punto_venta_destino, :direccion_punto_venta_destino, 
                :referencias_punto_venta_destino, :tarifario_punto_venta_destino, :ubigeo_punto_venta_destino, 
                :tmin_entrega_punto_venta_destino, :tmax_entrega_punto_venta_destino, :tipo_envio_punto_venta_destino, 
                :contenido_mercancia_punto_venta_destino, :peso_mercancia_punto_venta_destino, 
                :total_metros_cubicos_punto_venta_destino, :total_tarifa_punto_venta_destino, 
                :tipo_logistica_punto_venta_destino, :cantidad_mercancia_punto_venta_destino, 
                :largo_punto_venta_destino, :ancho_punto_venta_destino, :alto_punto_venta_destino, 
                :total_peso_volumen_punto_venta_destino, :valor_mercancia_punto_venta_destino, 
                :packing_punto_venta_destino, :seguro_punto_venta_destino, :monta_carga_punto_venta_destino, 
                :total_adicional_punto_venta_destino, :retorno_punto_venta_destino, 
                :estiba_desestiba_punto_venta_destino, :transporte_extra_punto_venta_destino, :id_creador_punto_venta_destino,:fecha_creado
            )";

            $stmt = $bd->prepare($sqlGuadar);
            if ($stmt === false) {
                return ['success' => false, 'mensaje' => 'Error al insertar los datos'];
            }
            $Ejecucion = $stmt->execute($data);
            if ($Ejecucion) {
                return ['success' => true, 'mensaje' => '¡Destino guardado correctamente!', 'datosGuardados' => $datos];
            } else {
                return ['success' => false, 'mensaje' => 'Error al guardar el Destino'];
            }
        } else {
            return ['success' => false, 'mensaje' => '¡El Destino no tiene tarifario!.'];
        }
    } else {
        return ['success' => false, 'mensaje' => 'Debe completar todos los campos!.'];
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
    if ($tipoTarifario == 'Courrier') {
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
    } else if ($tipoTarifario == 'Aerea') {
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
    } else if ($tipoTarifario == 'Carga') {
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
    } else if ($tipoTarifario == 'Valorizada') {
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

    if ($resultado && $tipoTarifario == 'Courrier' || $tipoTarifario == 'Aerea') {
        $kg = !empty($resultado['kg']) ? $resultado['kg'] : 0;
        $kg_adicional = !empty($resultado['kg_adicional']) ? $resultado['kg_adicional'] : 0;

        if ($totalPesoMerc > $pesoVolumen || $totalPesoMerc == $pesoVolumen) {
            $totalTarifa = floatval($kg + ($totalPesoMerc - 1) * $kg_adicional);
        } else {
            $totalTarifa = floatval($kg + ($pesoVolumen - 1) * $kg_adicional);
        }
    } else if ($resultado && $tipoTarifario == 'Carga') {
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
    } else if ($resultado && $tipoTarifario == 'Valorizada') {
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
    $database = new PDO('mysql:host=161.132.42.147;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}
