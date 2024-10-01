<?php
function obtenerDatosPdf($id_cotizacion)
{
    $bd = obtenerConexion();
    $stmt_cotizacion_cliente = $bd->prepare("SELECT cli.* ,c.*, u.*
        FROM cotizaciones c 
        LEFT JOIN clientes cli ON cli.id = c.id_cliente_cotizacion
        LEFT JOIN ubigeo u ON u.UBIGEO = cli.ubigeo_cliente  
        WHERE c.id_cotizacion = :id_cotizacion;
    ");
    $stmt_cotizacion_cliente->bindParam(':id_cotizacion', $id_cotizacion);
    $stmt_cotizacion_cliente->execute();
    $cotizacion_cliente_data = $stmt_cotizacion_cliente->fetch(PDO::FETCH_ASSOC);
    $stmt_cotizacion_destinos = $bd->prepare(" SELECT * FROM cotizaciones_destinos cd 
    LEFT JOIN ubigeo u ON u.UBIGEO = cd.ubigeo_cotizacion_destino 
    WHERE cd.id_cotizacion_cotizacion_destino = :id_cotizacion;
    ");
    $stmt_cotizacion_destinos->bindParam(':id_cotizacion', $id_cotizacion);
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
    c.*,
    cli.razon_social_cliente,
    cli.representante_cliente,
    cli.telefono_cliente,
    cli.email_cliente,
    CASE
        WHEN c.validacion_cotizacion = 0 THEN 'Falta validar'
        WHEN c.validacion_cotizacion = 1 THEN 'Enviado a validar'
        ELSE 'Estado desconocido'
    END AS validacion_cotizacion
FROM
    cotizaciones c
INNER JOIN
    clientes cli ON c.id_cliente_cotizacion = cli.id
INNER JOIN
    areas ar ON c.id_area_cotizacion = ar.id
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

        $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
        $consultaID->execute();
        $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
        $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'];
        if (empty($identificadorCotizacion)) {
            return ['success' => false, 'mensaje' => 'Debe configurar la guía!.'];
        }

        $stmt = $bd->prepare("SELECT MAX(id_cotizacion) AS max_id FROM cotizaciones WHERE id_cotizacion LIKE '$identificadorCotizacion-%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $id_cotizacion = $identificadorCotizacion . '-0000001';
        } else {
            $numeric_part = substr($max_id_cotizacion, strlen($identificadorCotizacion) + 1) + 1;
            $id_cotizacion = $identificadorCotizacion . '-' . str_pad($numeric_part, 7, '0', STR_PAD_LEFT);
        }

        $sql = "SELECT count(*)
        FROM cotizaciones_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_cotizacion_destino = c.id
        INNER JOIN areas a ON cd.id_area_cotizacion_destino = a.id
        WHERE cd.id_cotizacion_cotizacion_destino = '$identificadorCotizacion-0000000'
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
                    $sql_upt_ = "UPDATE cotizaciones_destinos SET id_cotizacion_cotizacion_destino = :id_cotizacion  WHERE id_cotizacion_cotizacion_destino = '$identificadorCotizacion-0000000'  
                    AND id_cliente_cotizacion_destino = :id_cliente
                    AND id_area_cotizacion_destino = :id_area;";
                    $stmt = $bd->prepare($sql_upt_);
                    $stmt->bindParam(':id_cotizacion', $id_cotizacion);
                    $stmt->bindParam(':id_cliente', $id_cliente);
                    $stmt->bindParam(':id_area', $id_area);
                    $stmt->execute();

                    $sql = "INSERT INTO cotizaciones(id_cotizacion, id_cliente_cotizacion, id_area_cotizacion, cantidad_destinos_cotizacion, recibo_cotizacion, sub_total_cotizacion, igv_cotizacion, precio_total_cotizacion, id_creador_cotizacion,fecha_creado) 
                    VALUES (:id_cotizacion, :id_cliente_cotizacion, :id_area_cotizacion, :cantidad_destinos_cotizacion, :recibo_cotizacion, :sub_total_cotizacion, :igv_cotizacion, :precio_total_cotizacion, :id_creador_cotizacion,:fecha_creado)";
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

                    return ['success' => true, 'mensaje' => '¡Cotizacion Guardado Correctamente!', 'datosGuardados' => $datos];
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
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'] ?? '';
    $stmt = $bd->prepare("
            SELECT 
                SUM(cd.total_tarifa_cotizacion_destino) AS total_costo_envio, 
                SUM(cd.total_adicional_cotizacion_destino) AS total_costo_adicional
            FROM 
                cotizaciones_destinos cd
            INNER JOIN 
                clientes c ON cd.id_cliente_cotizacion_destino = c.id
            INNER JOIN 
                areas a ON cd.id_area_cotizacion_destino = a.id
            WHERE 
                cd.id_cliente_cotizacion_destino = :id_cliente 
                AND cd.id_area_cotizacion_destino = :id_area 
                AND cd.id_cotizacion_cotizacion_destino = '$identificadorCotizacion-0000000'
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
    $stmt = $bd->prepare('SELECT cd.*, dep.id AS departamento_id,
	prov.id AS provincia_id FROM cotizaciones_destinos cd
INNER JOIN 
    distritos dis ON cd.ubigeo_cotizacion_destino = dis.ubigeo
INNER JOIN 
    provincias prov ON dis.provincia_id = prov.id
INNER JOIN 
    departamentos dep ON prov.departamento_id = dep.id                                                
WHERE cd.id = ?;');
    $stmt->execute([$id_destino_cotizacion]);
    $data = $stmt->fetch();
    return $data;
}

function eliminarDestino($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("DELETE FROM cotizaciones_destinos WHERE id = ?");
    return $sentencia->execute([
        $id
    ]);
}

function obtenerListaDestinos($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'] ?? '';
    $consulta = $bd->prepare("SELECT cd.id_cotizacion_cotizacion_destino, cd.ubigeo_cotizacion_destino, cd.id as 'id_cotizacion_destino', ub.DESTINO as 'destino' FROM cotizaciones_destinos as cd
    INNER JOIN ubigeo as ub on ub.UBIGEO = cd.ubigeo_cotizacion_destino
    INNER JOIN clientes as cli on cli.id = cd.id_cliente_cotizacion_destino
    INNER JOIN areas as ar on ar.id = cd.id_area_cotizacion_destino
    WHERE cd.id_cliente_cotizacion_destino = :id_cliente
    AND cd.id_area_cotizacion_destino = :id_area AND cd.id_cotizacion_cotizacion_destino = '$identificadorCotizacion-0000000' ORDER BY cd.id DESC;");
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
                "id_cliente_cotizacion_destino" => $datos['id_cliente'],
                "id_area_cotizacion_destino" => $datos['id_area'],
                "consignado_cotizacion_destino" => $datos['consignado_cotizacion_destino'],
                "dni_ruc_cotizacion_destino" => $datos['dni_ruc_cotizacion_destino'],
                "telefono_cotizacion_destino" => $datos['telefono_cotizacion_destino'],
                "telefono_exc_cotizacion_destino" => $datos['telefono_exc_cotizacion_destino'],
                "direccion_cotizacion_destino" => $datos['direccion_cotizacion_destino'],
                "referencias_cotizacion_destino" => $datos['referencias_cotizacion_destino'],
                "tarifario_cotizacion_destino" => $datos['tarifario_cotizacion_destino'],
                "ubigeo_cotizacion_destino" => $datos['ubigeo_cotizacion_destino'],
                "tmin_entrega_cotizacion_destino" => $datos['tmin_entrega_cotizacion_destino'],
                "tmax_entrega_cotizacion_destino" => $datos['tmax_entrega_cotizacion_destino'],
                "tipo_envio_cotizacion_destino" => $datos['tipo_envio_cotizacion_destino'],
                "contenido_mercancia_cotizacion_destino" => $datos['contenido_mercancia_cotizacion_destino'],
                "peso_mercancia_cotizacion_destino" => $datos['peso_mercancia_cotizacion_destino'],
                "total_metros_cubicos_cotizacion_destino" => $datos['total_metros_cubicos_cotizacion_destino'],
                "total_tarifa_cotizacion_destino" => $datos['total_tarifa_cotizacion_destino'],
                "tipo_logistica_cotizacion_destino" => $datos['tipo_logistica_cotizacion_destino'],
                "cantidad_mercancia_cotizacion_destino" => $datos['cantidad_mercancia_cotizacion_destino'],
                "largo_cotizacion_destino" => empty($datos['largo_cotizacion_destino']) ? $datos['largo_cotizacion_destino'] : 0,
                "ancho_cotizacion_destino" => empty($datos['ancho_cotizacion_destino']) ? $datos['ancho_cotizacion_destino'] : 0,
                "alto_cotizacion_destino" => empty($datos['alto_cotizacion_destino']) ? $datos['alto_cotizacion_destino'] : 0,
                "total_peso_volumen_cotizacion_destino" => $datos['total_peso_volumen_cotizacion_destino'],
                "valor_mercancia_cotizacion_destino" => $datos['valor_mercancia_cotizacion_destino'],
                "packing_cotizacion_destino" => empty($datos['packing_cotizacion_destino']) ? $datos['packing_cotizacion_destino'] : 0,
                "seguro_cotizacion_destino" => $datos['seguro_cotizacion_destino'],
                "monta_carga_cotizacion_destino" => empty($datos['monta_carga_cotizacion_destino']) ? $datos['monta_carga_cotizacion_destino'] : 0,
                "total_adicional_cotizacion_destino" => $datos['total_adicional_cotizacion_destino'],
                "retorno_cotizacion_destino" => empty($datos['retorno_cotizacion_destino']) ? $datos['retorno_cotizacion_destino'] : 0,
                "estiba_desestiba_cotizacion_destino" => empty($datos['estiba_desestiba_cotizacion_destino']) ? $datos['estiba_desestiba_cotizacion_destino'] : 0,
                "transporte_extra_cotizacion_destino" => empty($datos['transporte_extra_cotizacion_destino']) ? $datos['transporte_extra_cotizacion_destino'] : 0,
                "id_creador_cotizacion_destino" => $datos['id_creador'],
                "id_destino_cotizacion" => $datos['id_destino_cotizacion']
            );

            $sqlUpdate = "UPDATE cotizaciones_destinos SET
                id_cliente_cotizacion_destino = :id_cliente_cotizacion_destino,
                id_area_cotizacion_destino = :id_area_cotizacion_destino,
                consignado_cotizacion_destino = :consignado_cotizacion_destino,
                dni_ruc_cotizacion_destino = :dni_ruc_cotizacion_destino,
                telefono_cotizacion_destino = :telefono_cotizacion_destino,
                telefono_exc_cotizacion_destino = :telefono_exc_cotizacion_destino,
                direccion_cotizacion_destino = :direccion_cotizacion_destino,
                referencias_cotizacion_destino = :referencias_cotizacion_destino,
                tarifario_cotizacion_destino = :tarifario_cotizacion_destino,
                ubigeo_cotizacion_destino = :ubigeo_cotizacion_destino,
                tmin_entrega_cotizacion_destino = :tmin_entrega_cotizacion_destino,
                tmax_entrega_cotizacion_destino = :tmax_entrega_cotizacion_destino,
                tipo_envio_cotizacion_destino = :tipo_envio_cotizacion_destino,
                contenido_mercancia_cotizacion_destino = :contenido_mercancia_cotizacion_destino,
                peso_mercancia_cotizacion_destino = :peso_mercancia_cotizacion_destino,
                total_metros_cubicos_cotizacion_destino = :total_metros_cubicos_cotizacion_destino,
                total_tarifa_cotizacion_destino = :total_tarifa_cotizacion_destino,
                tipo_logistica_cotizacion_destino = :tipo_logistica_cotizacion_destino,
                cantidad_mercancia_cotizacion_destino = :cantidad_mercancia_cotizacion_destino,
                largo_cotizacion_destino = :largo_cotizacion_destino,
                ancho_cotizacion_destino = :ancho_cotizacion_destino,
                alto_cotizacion_destino = :alto_cotizacion_destino,
                total_peso_volumen_cotizacion_destino = :total_peso_volumen_cotizacion_destino,
                valor_mercancia_cotizacion_destino = :valor_mercancia_cotizacion_destino,
                packing_cotizacion_destino = :packing_cotizacion_destino,
                seguro_cotizacion_destino = :seguro_cotizacion_destino,
                monta_carga_cotizacion_destino = :monta_carga_cotizacion_destino,
                total_adicional_cotizacion_destino = :total_adicional_cotizacion_destino,
                retorno_cotizacion_destino = :retorno_cotizacion_destino,
                estiba_desestiba_cotizacion_destino = :estiba_desestiba_cotizacion_destino,
                transporte_extra_cotizacion_destino = :transporte_extra_cotizacion_destino,
                id_creador_cotizacion_destino = :id_creador_cotizacion_destino
              WHERE id = :id_destino_cotizacion";

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
        $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
        $consultaID->execute();
        $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
        $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'];
        if (empty($identificadorCotizacion)) {
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
                "id_cotizacion_cotizacion_destino" => "$identificadorCotizacion-0000000",
                "id_cliente_cotizacion_destino" => $datos['id_cliente'],
                "id_area_cotizacion_destino" => $datos['id_area'],
                "consignado_cotizacion_destino" => $datos['consignado_cotizacion_destino'],
                "dni_ruc_cotizacion_destino" => $datos['dni_ruc_cotizacion_destino'],
                "telefono_cotizacion_destino" => $datos['telefono_cotizacion_destino'],
                "telefono_exc_cotizacion_destino" => $datos['telefono_exc_cotizacion_destino'],
                "direccion_cotizacion_destino" => $datos['direccion_cotizacion_destino'],
                "referencias_cotizacion_destino" => $datos['referencias_cotizacion_destino'],
                "tarifario_cotizacion_destino" => $datos['tarifario_cotizacion_destino'],
                "ubigeo_cotizacion_destino" => $datos['ubigeo_cotizacion_destino'],
                "tmin_entrega_cotizacion_destino" => $datos['tmin_entrega_cotizacion_destino'],
                "tmax_entrega_cotizacion_destino" => $datos['tmax_entrega_cotizacion_destino'],
                "tipo_envio_cotizacion_destino" => $datos['tipo_envio_cotizacion_destino'],
                "contenido_mercancia_cotizacion_destino" => $datos['contenido_mercancia_cotizacion_destino'],
                "peso_mercancia_cotizacion_destino" => $datos['peso_mercancia_cotizacion_destino'],
                "total_metros_cubicos_cotizacion_destino" => $datos['total_metros_cubicos_cotizacion_destino'],
                "total_tarifa_cotizacion_destino" => $datos['total_tarifa_cotizacion_destino'],
                "tipo_logistica_cotizacion_destino" => $datos['tipo_logistica_cotizacion_destino'],
                "cantidad_mercancia_cotizacion_destino" => $datos['cantidad_mercancia_cotizacion_destino'],
                "largo_cotizacion_destino" => empty($datos['largo_cotizacion_destino']) ? 0 : $datos['largo_cotizacion_destino'],
                "ancho_cotizacion_destino" => empty($datos['ancho_cotizacion_destino']) ? 0 : $datos['ancho_cotizacion_destino'],
                "alto_cotizacion_destino" => empty($datos['alto_cotizacion_destino']) ? 0 : $datos['alto_cotizacion_destino'],
                "total_peso_volumen_cotizacion_destino" => $datos['total_peso_volumen_cotizacion_destino'],
                "valor_mercancia_cotizacion_destino" => $datos['valor_mercancia_cotizacion_destino'],
                "packing_cotizacion_destino" => empty($datos['packing_cotizacion_destino']) ? 0 : $datos['packing_cotizacion_destino'],
                "seguro_cotizacion_destino" => $datos['seguro_cotizacion_destino'],
                "monta_carga_cotizacion_destino" => empty($datos['monta_carga_cotizacion_destino']) ? 0 : $datos['monta_carga_cotizacion_destino'],
                "total_adicional_cotizacion_destino" => $datos['total_adicional_cotizacion_destino'],
                "retorno_cotizacion_destino" => empty($datos['retorno_cotizacion_destino']) ? $datos['retorno_cotizacion_destino'] : 0,
                "estiba_desestiba_cotizacion_destino" => empty($datos['estiba_desestiba_cotizacion_destino']) ? 0 : $datos['estiba_desestiba_cotizacion_destino'],
                "transporte_extra_cotizacion_destino" => empty($datos['transporte_extra_cotizacion_destino']) ? 0 : $datos['transporte_extra_cotizacion_destino'],
                "id_creador_cotizacion_destino" => $datos['id_creador'],
                "fecha_creado" => $fecha_actual
            );

            $sqlGuadar = "INSERT INTO cotizaciones_destinos (
                    id_cotizacion_cotizacion_destino, id_cliente_cotizacion_destino, id_area_cotizacion_destino, consignado_cotizacion_destino, dni_ruc_cotizacion_destino, 
                    telefono_cotizacion_destino, telefono_exc_cotizacion_destino, direccion_cotizacion_destino, 
                    referencias_cotizacion_destino, tarifario_cotizacion_destino, ubigeo_cotizacion_destino, 
                    tmin_entrega_cotizacion_destino, tmax_entrega_cotizacion_destino, tipo_envio_cotizacion_destino, 
                    contenido_mercancia_cotizacion_destino, peso_mercancia_cotizacion_destino, 
                    total_metros_cubicos_cotizacion_destino, total_tarifa_cotizacion_destino, 
                    tipo_logistica_cotizacion_destino, cantidad_mercancia_cotizacion_destino, 
                    largo_cotizacion_destino, ancho_cotizacion_destino, alto_cotizacion_destino, 
                    total_peso_volumen_cotizacion_destino, valor_mercancia_cotizacion_destino, 
                    packing_cotizacion_destino, seguro_cotizacion_destino, monta_carga_cotizacion_destino, 
                    total_adicional_cotizacion_destino, retorno_cotizacion_destino, 
                    estiba_desestiba_cotizacion_destino, transporte_extra_cotizacion_destino,id_creador_cotizacion_destino,fecha_creado
                ) VALUES (
                    :id_cotizacion_cotizacion_destino, :id_cliente_cotizacion_destino, :id_area_cotizacion_destino, :consignado_cotizacion_destino, :dni_ruc_cotizacion_destino, 
                    :telefono_cotizacion_destino, :telefono_exc_cotizacion_destino, :direccion_cotizacion_destino, 
                    :referencias_cotizacion_destino, :tarifario_cotizacion_destino, :ubigeo_cotizacion_destino, 
                    :tmin_entrega_cotizacion_destino, :tmax_entrega_cotizacion_destino, :tipo_envio_cotizacion_destino, 
                    :contenido_mercancia_cotizacion_destino, :peso_mercancia_cotizacion_destino, 
                    :total_metros_cubicos_cotizacion_destino, :total_tarifa_cotizacion_destino, 
                    :tipo_logistica_cotizacion_destino, :cantidad_mercancia_cotizacion_destino, 
                    :largo_cotizacion_destino, :ancho_cotizacion_destino, :alto_cotizacion_destino, 
                    :total_peso_volumen_cotizacion_destino, :valor_mercancia_cotizacion_destino, 
                    :packing_cotizacion_destino, :seguro_cotizacion_destino, :monta_carga_cotizacion_destino, 
                    :total_adicional_cotizacion_destino, :retorno_cotizacion_destino, 
                    :estiba_desestiba_cotizacion_destino, :transporte_extra_cotizacion_destino,:id_creador_cotizacion_destino,:fecha_creado
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
