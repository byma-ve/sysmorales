<?php
function obtenerRegistrosImprimir($fecha)
{
    $bd = obtenerConexion();

    if (empty($fecha)) {
        $stmt = $bd->query("SELECT * FROM registros_cargas ORDER BY id DESC;");
    } else {
        $stmt = $bd->prepare("SELECT * FROM registros_cargas WHERE fecha_creado = :fecha ORDER BY id DESC;");
        $stmt->bindParam(':fecha', $fecha);
        $stmt->execute();
    }
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function guardarRegistroMasivo($data)
{
    $bd = obtenerConexion();

    // ORDENES

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'] ?? '';
    if (empty($identificadorCotizacion)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'] ?? '';
    if (empty($identificadorPuntoVenta)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicio FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicio';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicio = $campoConsultaID['identificadorOrdenServicio'] ?? '';
    if (empty($identificadorOrdenServicio)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';
    if (empty($identificadorOrdenServicioMasivo)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    // GUIAS

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaCourrier FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaCourrier';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaCourrier = $campoConsultaID['identificadorGuiaCourrier'] ?? '';
    if (empty($identificadorGuiaCourrier)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaAereo FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaAereo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaAereo = $campoConsultaID['identificadorGuiaAereo'] ?? '';
    if (empty($identificadorGuiaAereo)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaValorizado FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaValorizado';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaValorizado = $campoConsultaID['identificadorGuiaValorizado'] ?? '';
    if (empty($identificadorGuiaValorizado)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaCarga FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaCarga';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaCarga = $campoConsultaID['identificadorGuiaCarga'] ?? '';
    if (empty($identificadorGuiaCarga)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");


    foreach ($data as $registro) {
        $id_destino = $registro['id_destino'];
        $id_num_guia_registro_carga = $registro['id_num_guia_registro_carga'];
        $id_orden_servicio_estado_recojo = $registro['id_orden_servicio_estado_recojo'];
        $prefijo = strtok($id_orden_servicio_estado_recojo, '-');

        $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM registros_cargas WHERE id_num_guia_registro_carga = :id_num_guia_registro_carga");
        $stmt_verificar->bindParam(':id_num_guia_registro_carga', $id_num_guia_registro_carga);
        $stmt_verificar->execute();
        $existe = $stmt_verificar->fetchColumn();

        if (!$existe) {
            if ($prefijo === $identificadorCotizacion) {
                $query = 'SELECT tarifario_cotizacion_destino AS tarifario, id_cliente_cotizacion_destino AS id_cliente, id_area_cotizacion_destino AS id_area, id FROM cotizaciones_destinos WHERE id_cotizacion_cotizacion_destino = :orden_servicio AND id = :id_destino';
            } elseif ($prefijo === $identificadorPuntoVenta) {
                $query = 'SELECT tarifario_punto_venta_destino AS tarifario, id_cliente_punto_venta_destino AS id_cliente, id_area_punto_venta_destino AS id_area, id FROM punto_ventas_destinos WHERE id_punto_venta_destino = :orden_servicio AND id = :id_destino';
            } elseif ($prefijo === $identificadorOrdenServicio) {
                $query = 'SELECT tarifario_registro_envio_destino AS tarifario, id_cliente_registro_envio_destino AS id_cliente, id_area_registro_envio_destino AS id_area, id FROM registro_envio_destinos WHERE id_registro_envio_destino = :orden_servicio AND id = :id_destino';
            } elseif ($prefijo === $identificadorOrdenServicioMasivo) {
                $query = 'SELECT tarifario_registro_masivo_destino AS tarifario, id_cliente_registro_masivo_destino AS id_cliente, id_area_registro_masivo_destino AS id_area, id, 
                guia_transportista_registro_masivo_destino,guia_remision_registro_masivo_destino,documento_1_registro_masivo_destino,documento_2_registro_masivo_destino
                FROM registro_masivo_destinos WHERE id_registro_masivo_destino = :orden_servicio AND id = :id_destino';
            }
            $obtenerOrden = $bd->prepare($query);
            $obtenerOrden->bindParam(':orden_servicio', $id_orden_servicio_estado_recojo);
            $obtenerOrden->bindParam(':id_destino', $id_destino);
            $obtenerOrden->execute();
            $dataOrdenServicio = $obtenerOrden->fetch(PDO::FETCH_ASSOC);
            $tarifario = $dataOrdenServicio['tarifario'];
            $id_cliente = $dataOrdenServicio['id_cliente'];
            $id_area = $dataOrdenServicio['id_area'];
            $id_destino = $dataOrdenServicio['id'];
            if ($prefijo === $identificadorOrdenServicioMasivo) {
                $guia_transportista = $dataOrdenServicio['guia_transportista_registro_masivo_destino'];
                $guia_remision = $dataOrdenServicio['guia_remision_registro_masivo_destino'];
                $documento_1 = $dataOrdenServicio['documento_1_registro_masivo_destino'];
                $documento_2 = $dataOrdenServicio['documento_2_registro_masivo_destino'];
            }

            if ($tarifario == 'Courrier') {
                $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaCourrier%'");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $max_id_cotizacion = $row['max_id'];

                if ($max_id_cotizacion === NULL) {
                    $num_guia = $identificadorGuiaCourrier . '0000000001';
                } else {
                    $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaCourrier))) + 1;
                    $num_guia = $identificadorGuiaCourrier . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
                }
            } else if ($tarifario == 'Aerea') {
                $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaAereo%'");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $max_id_cotizacion = $row['max_id'];
                if ($max_id_cotizacion === NULL) {
                    $num_guia = $identificadorGuiaAereo . '0000000001';
                } else {
                    $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaAereo))) + 1;
                    $num_guia = $identificadorGuiaAereo . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
                }
            } else if ($tarifario == 'Carga') {
                $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaCarga%'");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $max_id_cotizacion = $row['max_id'];
                if ($max_id_cotizacion === NULL) {
                    $num_guia = $identificadorGuiaCarga . '0000000001';
                } else {
                    $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaCarga))) + 1;
                    $num_guia = $identificadorGuiaCarga . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
                }
            } else if ($tarifario == 'Valorizada') {
                $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaValorizado%'");
                $stmt->execute();
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $max_id_cotizacion = $row['max_id'];
                if ($max_id_cotizacion === NULL) {
                    $num_guia = $identificadorGuiaValorizado . '0000000001';
                } else {
                    $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaValorizado))) + 1;
                    $num_guia = $identificadorGuiaValorizado . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
                }
            }
            if ($prefijo === $identificadorOrdenServicioMasivo) {
                $sql = "INSERT INTO registros_cargas (id_orden_servicio_registro_carga, id_cliente_registro_carga, id_area_registro_carga, id_destino_registro_carga, id_num_guia_registro_carga, fecha_creado, guia_transportista_registro_carga, guia_remision_registro_carga, documento_1_registro_carga, documento_2_registro_carga)  
                VALUES (:id_orden_servicio_registro_carga, :id_cliente_registro_carga, :id_area_registro_carga, :id_destino_registro_carga, :id_num_guia_registro_carga, :fecha_creado,:guia_transportista ,:guia_remision ,:documento_1 ,:documento_2 )";
                $stmt = $bd->prepare($sql);
                $stmt->bindParam(':id_orden_servicio_registro_carga', $id_orden_servicio_estado_recojo);
                $stmt->bindParam(':id_cliente_registro_carga', $id_cliente);
                $stmt->bindParam(':id_area_registro_carga', $id_area);
                $stmt->bindParam(':id_destino_registro_carga', $id_destino);
                $stmt->bindParam(':id_num_guia_registro_carga', $num_guia);
                $stmt->bindParam(':fecha_creado', $fecha_actual);
                $stmt->bindParam(':guia_transportista', $guia_transportista);
                $stmt->bindParam(':guia_remision', $guia_remision);
                $stmt->bindParam(':documento_1', $documento_1);
                $stmt->bindParam(':documento_2', $documento_2);
                $stmt->execute();
            } else {
                $sql = "INSERT INTO registros_cargas (id_orden_servicio_registro_carga, id_cliente_registro_carga, id_area_registro_carga, id_destino_registro_carga, id_num_guia_registro_carga, fecha_creado)  
                VALUES (:id_orden_servicio_registro_carga, :id_cliente_registro_carga, :id_area_registro_carga, :id_destino_registro_carga, :id_num_guia_registro_carga, :fecha_creado)";
                $stmt = $bd->prepare($sql);
                $stmt->bindParam(':id_orden_servicio_registro_carga', $id_orden_servicio_estado_recojo);
                $stmt->bindParam(':id_cliente_registro_carga', $id_cliente);
                $stmt->bindParam(':id_area_registro_carga', $id_area);
                $stmt->bindParam(':id_destino_registro_carga', $id_destino);
                $stmt->bindParam(':id_num_guia_registro_carga', $num_guia);
                $stmt->bindParam(':fecha_creado', $fecha_actual);
                $stmt->execute();
            }
        }
    }
    return ['success' => true, 'message' => 'Registros guardados exitosamente', 'datos' => $data];
}

function guardarRegistroCarga($data)
{
    $bd = obtenerConexion();

    // ORDENES

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'] ?? '';
    if (empty($identificadorCotizacion)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'] ?? '';
    if (empty($identificadorPuntoVenta)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicio FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicio';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicio = $campoConsultaID['identificadorOrdenServicio'] ?? '';
    if (empty($identificadorOrdenServicio)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';
    if (empty($identificadorOrdenServicioMasivo)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    // GUIAS

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaCourrier FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaCourrier';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaCourrier = $campoConsultaID['identificadorGuiaCourrier'] ?? '';
    if (empty($identificadorGuiaCourrier)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaAereo FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaAereo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaAereo = $campoConsultaID['identificadorGuiaAereo'] ?? '';
    if (empty($identificadorGuiaAereo)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaValorizado FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaValorizado';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaValorizado = $campoConsultaID['identificadorGuiaValorizado'] ?? '';
    if (empty($identificadorGuiaValorizado)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorGuiaCarga FROM configuracion_guias WHERE nombre_configuracion_guia = 'guiaCarga';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorGuiaCarga = $campoConsultaID['identificadorGuiaCarga'] ?? '';
    if (empty($identificadorGuiaCarga)) {
        return ['success' => false, 'message' => 'Debe configurar la guía!.', 'datos' => $data];
    }


    $stmt_verificar = $bd->prepare("SELECT COUNT(*) FROM registros_cargas WHERE id_orden_servicio_registro_carga = :id_orden_servicio_registro_carga AND id_destino_registro_carga = :id_destino_registro_carga");
    $stmt_verificar->bindParam(':id_orden_servicio_registro_carga', $data['id_orden_servicio_registro_carga']);
    $stmt_verificar->bindParam(':id_destino_registro_carga', $data['id_destino_registro_carga']);
    $stmt_verificar->execute();
    $existe = $stmt_verificar->fetchColumn();

    if ($data['tarifario'] == 'Courrier') {
        $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaCourrier%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];

        if ($max_id_cotizacion === NULL) {
            $num_guia = $identificadorGuiaCourrier . '0000000001';
        } else {
            $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaCourrier))) + 1;
            $num_guia = $identificadorGuiaCourrier . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
        }
    } else if ($data['tarifario'] == 'Aerea') {
        $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaAereo%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $num_guia = $identificadorGuiaAereo . '0000000001';
        } else {
            $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaAereo))) + 1;
            $num_guia = $identificadorGuiaAereo . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
        }
    } else if ($data['tarifario'] == 'Carga') {
        $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaCarga%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $num_guia = $identificadorGuiaCarga . '0000000001';
        } else {
            $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaCarga))) + 1;
            $num_guia = $identificadorGuiaCarga . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
        }
    } else if ($data['tarifario'] == 'Valorizada') {
        $stmt = $bd->prepare("SELECT MAX(id_num_guia_registro_carga) AS max_id FROM registros_cargas WHERE id_num_guia_registro_carga LIKE '$identificadorGuiaValorizado%'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $max_id_cotizacion = $row['max_id'];
        if ($max_id_cotizacion === NULL) {
            $num_guia = $identificadorGuiaValorizado . '0000000001';
        } else {
            $numeric_part = intval(substr($max_id_cotizacion, strlen($identificadorGuiaValorizado))) + 1;
            $num_guia = $identificadorGuiaValorizado . str_pad($numeric_part, 10, '0', STR_PAD_LEFT);
        }
    }

    // ACTUALIZAR DATOS DESTINOS
    $id_orden_servicio = $data['id_orden_servicio_registro_carga'];
    $prefijo = strtok($id_orden_servicio, '-');
    if ($prefijo === $identificadorCotizacion) {
        $query = 'SELECT total_adicional_cotizacion_destino AS total_adicional ,seguro_cotizacion_destino AS seguro_adicional FROM cotizaciones_destinos WHERE id_cotizacion_cotizacion_destino = :orden_servicio AND id = :id_destino';
    } elseif ($prefijo === $identificadorPuntoVenta) {
        $query = 'SELECT total_adicional_punto_venta_destino AS total_adicional ,seguro_punto_venta_destino AS seguro_adicional FROM punto_ventas_destinos WHERE id_punto_venta_destino = :orden_servicio AND id = :id_destino';
    } elseif ($prefijo === $identificadorOrdenServicio) {
        $query = 'SELECT total_adicional_registro_envio_destino AS total_adicional ,seguro_registro_envio_destino AS seguro_adicional FROM registro_envio_destinos WHERE id_registro_envio_destino = :orden_servicio AND id = :id_destino';
    } elseif ($prefijo === $identificadorOrdenServicioMasivo) {
        $query = 'SELECT total_adicional_registro_masivo_destino AS total_adicional ,seguro_registro_masivo_destino AS seguro_adicional FROM registro_masivo_destinos WHERE id_registro_masivo_destino = :orden_servicio AND id = :id_destino';
    }
    $obtenerOrden = $bd->prepare($query);
    $obtenerOrden->bindParam(':orden_servicio', $id_orden_servicio);
    $obtenerOrden->bindParam(':id_destino', $data['id_destino_registro_carga']);
    $obtenerOrden->execute();
    $dataOrdenServicio = $obtenerOrden->fetch(PDO::FETCH_ASSOC);
    $total_adicional_orden_servicio = $dataOrdenServicio['total_adicional'];
    $seguro_adicional_orden_servicio = $dataOrdenServicio['seguro_adicional'];
    $seguroAdicional = $data['valor_mercancia'] * 0.1;
    $totalAdicional =   $seguroAdicional + ($total_adicional_orden_servicio - $seguro_adicional_orden_servicio);

    $id_orden_servicio = $data['id_orden_servicio_registro_carga'];
    $prefijo = strtok($id_orden_servicio, '-');
    if ($prefijo === $identificadorCotizacion) {
        $actualizarOrdenServicio = "UPDATE cotizaciones_destinos
            SET
            peso_mercancia_cotizacion_destino = :total_Peso_Mercancia,
            total_metros_cubicos_cotizacion_destino = :metros_cubicos,
            total_tarifa_cotizacion_destino = :totalTarifa,
            cantidad_mercancia_cotizacion_destino = :merc_cantidad,
            largo_cotizacion_destino = :largo,
            ancho_cotizacion_destino = :ancho,
            alto_cotizacion_destino = :alto,
            total_peso_volumen_cotizacion_destino = :total_Peso_Volumen,
            valor_mercancia_cotizacion_destino = :mercancia_valor,
            seguro_cotizacion_destino = :seguro_adicional,
            total_adicional_cotizacion_destino = :totalAdicional,
            guia_transportista_cotizacion_destino = :guia_transportista,
            guia_remision_cotizacion_destino = :guia_remision,
            documento_1_cotizacion_destino = :documento_1,
            documento_2_cotizacion_destino = :documento_2
            WHERE id = :id_destino AND id_cotizacion_cotizacion_destino = :orden_servicio ";
    } elseif ($prefijo === $identificadorPuntoVenta) {
        $actualizarOrdenServicio = "UPDATE punto_ventas_destinos
        SET
        peso_mercancia_punto_venta_destino = :total_Peso_Mercancia,
        total_metros_cubicos_punto_venta_destino = :metros_cubicos,
        total_tarifa_punto_venta_destino = :totalTarifa,
        cantidad_mercancia_punto_venta_destino = :merc_cantidad,
        largo_punto_venta_destino = :largo,
        ancho_punto_venta_destino = :ancho,
        alto_punto_venta_destino = :alto,
        total_peso_volumen_punto_venta_destino = :total_Peso_Volumen,
        valor_mercancia_punto_venta_destino = :mercancia_valor,
        seguro_punto_venta_destino = :seguro_adicional,
        total_adicional_punto_venta_destino = :totalAdicional,
        guia_transportista_punto_venta_destino = :guia_transportista,
        guia_remision_punto_venta_destino = :guia_remision,
        documento_1_punto_venta_destino = :documento_1,
        documento_2_punto_venta_destino = :documento_2

        WHERE id = :id_destino AND id_punto_venta_destino = :orden_servicio ";
    } elseif ($prefijo === $identificadorOrdenServicio) {
        $actualizarOrdenServicio = "UPDATE registro_envio_destinos
        SET
        peso_mercancia_registro_envio_destino = :total_Peso_Mercancia,
        total_metros_cubicos_registro_envio_destino = :metros_cubicos,
        total_tarifa_registro_envio_destino = :totalTarifa,
        cantidad_mercancia_registro_envio_destino = :merc_cantidad,
        largo_registro_envio_destino = :largo,
        ancho_registro_envio_destino = :ancho,
        alto_registro_envio_destino = :alto,
        total_peso_volumen_registro_envio_destino = :total_Peso_Volumen,
        valor_mercancia_registro_envio_destino = :mercancia_valor,
        seguro_registro_envio_destino = :seguro_adicional,
        total_adicional_registro_envio_destino = :totalAdicional,
        guia_transportista_registro_envio_destino = :guia_transportista,
        guia_remision_registro_envio_destino = :guia_remision,
        documento_1_registro_envio_destino = :documento_1,
        documento_2_registro_envio_destino = :documento_2
        WHERE id = :id_destino AND id_registro_envio_destino = :orden_servicio ";
    } elseif ($prefijo=== $identificadorOrdenServicioMasivo) {
        $actualizarOrdenServicio = "UPDATE registro_masivo_destinos
        SET
        peso_mercancia_registro_masivo_destino = :total_Peso_Mercancia,
        total_metros_cubicos_registro_masivo_destino = :metros_cubicos,
        total_tarifa_registro_masivo_destino = :totalTarifa,
        cantidad_mercancia_registro_masivo_destino = :merc_cantidad,
        largo_registro_masivo_destino = :largo,
        ancho_registro_masivo_destino = :ancho,
        alto_registro_masivo_destino = :alto,
        total_peso_volumen_registro_masivo_destino = :total_Peso_Volumen,
        valor_mercancia_registro_masivo_destino = :mercancia_valor,
        seguro_registro_masivo_destino = :seguro_adicional,
        total_adicional_registro_masivo_destino = :totalAdicional,
        guia_transportista_registro_masivo_destino = :guia_transportista,
        guia_remision_registro_masivo_destino = :guia_remision,
        documento_1_registro_masivo_destino = :documento_1,
        documento_2_registro_masivo_destino = :documento_2
        WHERE id = :id_destino AND id_registro_masivo_destino = :orden_servicio ";
    }
    $actOrdenServicio = $bd->prepare($actualizarOrdenServicio);
    $actOrdenServicio->bindParam(':total_Peso_Mercancia', $data['peso_mercancia']);
    $actOrdenServicio->bindParam(':metros_cubicos', $data['total_metros_cubicos']);
    $actOrdenServicio->bindParam(':totalTarifa', $data['total_tarifa']);
    $actOrdenServicio->bindParam(':merc_cantidad', $data['cantidad_mercancia']);
    $actOrdenServicio->bindParam(':largo', $data['largo']);
    $actOrdenServicio->bindParam(':ancho', $data['ancho']);
    $actOrdenServicio->bindParam(':alto', $data['alto']);
    $actOrdenServicio->bindParam(':total_Peso_Volumen', $data['total_peso_volumen']);
    $actOrdenServicio->bindParam(':mercancia_valor', $data['valor_mercancia']);
    $actOrdenServicio->bindParam(':seguro_adicional', $seguroAdicional);
    $actOrdenServicio->bindParam(':totalAdicional', $totalAdicional);
    $actOrdenServicio->bindParam(':guia_transportista', $data['guia_transportista']);
    $actOrdenServicio->bindParam(':guia_remision', $data['guia_remision']);
    $actOrdenServicio->bindParam(':documento_1', $data['documento_1']);
    $actOrdenServicio->bindParam(':documento_2', $data['documento_2']);
    $actOrdenServicio->bindParam(':id_destino', $data['id_destino_registro_carga']);
    $actOrdenServicio->bindParam(':orden_servicio', $id_orden_servicio);
    $actOrdenServicio->execute();

    // ACTUALIZAR DATOS ORDENES SERVICIOS
    if ($prefijo === $identificadorCotizacion) {
        $stmt = $bd->prepare("SELECT 
            SUM(cd.total_tarifa_cotizacion_destino) AS total_costo_envio, 
            SUM(cd.total_adicional_cotizacion_destino) AS total_costo_adicional
        FROM 
            cotizaciones_destinos cd
        WHERE 
            cd.id_cotizacion_cotizacion_destino = :orden_servicio
        ");
    } elseif ($prefijo === $identificadorPuntoVenta) {
        $stmt = $bd->prepare("SELECT 
            SUM(cd.total_tarifa_punto_venta_destino) AS total_costo_envio, 
            SUM(cd.total_adicional_punto_venta_destino) AS total_costo_adicional
            FROM 
                punto_ventas_destinos cd
            WHERE 
                cd.id_punto_venta_destino = :orden_servicio
        ");
    } elseif ($prefijo === $identificadorOrdenServicio) {
        $stmt = $bd->prepare("SELECT 
        SUM(cd.total_tarifa_registro_envio_destino) AS total_costo_envio, 
        SUM(cd.total_adicional_registro_envio_destino) AS total_costo_adicional
            FROM 
                registro_envio_destinos cd
            WHERE 
                cd.id_registro_envio_destino = :orden_servicio
        ");
    } elseif ($prefijo === $identificadorOrdenServicioMasivo) {
        $stmt = $bd->prepare("SELECT 
            SUM(cd.total_tarifa_registro_masivo_destino) AS total_costo_envio, 
            SUM(cd.total_adicional_registro_masivo_destino) AS total_costo_adicional
        FROM 
            registro_masivo_destinos cd
        WHERE 
            cd.id_registro_masivo_destino = :orden_servicio
    ");
    }
    $stmt->bindParam(':orden_servicio', $id_orden_servicio);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $sub_total = $result["total_costo_envio"] + $result["total_costo_adicional"];
    $igv_1_18 = $sub_total * 1.18 - $sub_total;
    $total = $sub_total + $igv_1_18;

    if ($prefijo === $identificadorCotizacion) {
        $actualizarCotizacion = "UPDATE cotizaciones
        SET sub_total_cotizacion = :sub_total,
        igv_cotizacion = :igv_1_18,
        precio_total_cotizacion = :totalCalculo
        WHERE id_cotizacion = :orden_servicio";
    } elseif ($prefijo === $identificadorPuntoVenta) {
        $actualizarCotizacion = "UPDATE punto_ventas
        SET sub_total_punto_venta = :sub_total,
        igv_punto_venta = :igv_1_18,
        precio_total_punto_venta = :totalCalculo
        WHERE id_punto_venta = :orden_servicio";
    } elseif ($prefijo === $identificadorOrdenServicio) {
        $actualizarCotizacion = "UPDATE registro_envios
        SET sub_total_registro_envios = :sub_total,
        igv_registro_envios = :igv_1_18,
        precio_total_registro_envios = :totalCalculo
        WHERE id_registro_envios = :orden_servicio";
    } elseif ($prefijo === $identificadorOrdenServicioMasivo) {
        $actualizarCotizacion = "UPDATE registro_masivos
        SET sub_total_registro_masivo = :sub_total,
        igv_registro_masivo = :igv_1_18,
        precio_total_masivo = :totalCalculo
        WHERE id_registro_masivo = :orden_servicio";
    }
    $stmt = $bd->prepare($actualizarCotizacion);
    $stmt->bindParam(':sub_total', $sub_total);
    $stmt->bindParam(':igv_1_18', $igv_1_18);
    $stmt->bindParam(':totalCalculo', $total);
    $stmt->bindParam(':orden_servicio', $id_orden_servicio);
    $stmt->execute();

    // ACTUALIZAR DATOS PROGRAMACIONES
    $totales = $bd->prepare(
        "SELECT 
        SUM(peso_mercancia) AS total_peso_mercancia, 
        SUM(cantidad_mercancia) AS total_bultos,  
        SUM(total_metros_cubicos) AS total_metros_cubicos, 
        SUM(total_peso_volumen) AS total_peso_volumen 
    FROM (
        SELECT id_punto_venta_destino AS id_orden_servicio, peso_mercancia_punto_venta_destino AS peso_mercancia, cantidad_mercancia_punto_venta_destino AS cantidad_mercancia, total_metros_cubicos_punto_venta_destino AS total_metros_cubicos, total_peso_volumen_punto_venta_destino AS total_peso_volumen FROM punto_ventas_destinos
        UNION ALL
        SELECT id_registro_envio_destino AS id_orden_servicio, peso_mercancia_registro_envio_destino AS peso_mercancia, cantidad_mercancia_registro_envio_destino AS cantidad_mercancia, total_metros_cubicos_registro_envio_destino AS total_metros_cubicos, total_peso_volumen_registro_envio_destino AS total_peso_volumen FROM registro_envio_destinos
        UNION ALL
        SELECT id_registro_masivo_destino AS id_orden_servicio, peso_mercancia_registro_masivo_destino AS peso_mercancia, cantidad_mercancia_registro_masivo_destino AS cantidad_mercancia, total_metros_cubicos_registro_masivo_destino AS total_metros_cubicos, total_peso_volumen_registro_masivo_destino AS total_peso_volumen FROM registro_masivo_destinos
        UNION ALL
        SELECT id_cotizacion_cotizacion_destino AS id_orden_servicio, peso_mercancia_cotizacion_destino AS peso_mercancia, cantidad_mercancia_cotizacion_destino AS cantidad_mercancia, total_metros_cubicos_cotizacion_destino AS total_metros_cubicos, total_peso_volumen_cotizacion_destino AS total_peso_volumen FROM cotizaciones_destinos
    ) AS unioned_tables
    WHERE id_orden_servicio = :id_orden_servicio;"
    );
    $totales->bindParam(':id_orden_servicio', $id_orden_servicio);
    $totales->execute();
    $totalesProgramacion = $totales->fetch(PDO::FETCH_ASSOC);

    $actualizarCotizacion = "UPDATE programaciones
    SET cantidad_bultos_programacion = :cantidad_bultos,
    peso_mercancia_programacion = :peso_mercancia,
    peso_volumen_programacion = :peso_volumen,
    metros_cubicos_programacion = :metros_cubicos
    WHERE id_orden_servicio = :orden_servicio";

    $stmt = $bd->prepare($actualizarCotizacion);
    $stmt->bindParam(':cantidad_bultos', $totalesProgramacion["total_bultos"]);
    $stmt->bindParam(':peso_mercancia', $totalesProgramacion["total_peso_mercancia"]);
    $stmt->bindParam(':peso_volumen', $totalesProgramacion["total_peso_volumen"]);
    $stmt->bindParam(':metros_cubicos', $totalesProgramacion["total_metros_cubicos"]);
    $stmt->bindParam(':orden_servicio', $id_orden_servicio);
    $stmt->execute();

    //SI NO EXISTE EN REGISTRO DE CARGA

    if (!$existe) {
        $sql = "INSERT INTO registros_cargas (id_orden_servicio_registro_carga, id_cliente_registro_carga, id_area_registro_carga, id_destino_registro_carga, id_num_guia_registro_carga, id_creador_registro_carga, fecha_creado, guia_transportista_registro_carga, guia_remision_registro_carga, documento_1_registro_carga, documento_2_registro_carga)  
        VALUES (:id_orden_servicio_registro_carga, :id_cliente_registro_carga, :id_area_registro_carga, :id_destino_registro_carga, :id_num_guia_registro_carga, :id_creador_registro_carga, :fecha_creado,:guia_transportista ,:guia_remision ,:documento_1 ,:documento_2 )";
        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':id_orden_servicio_registro_carga', $data['id_orden_servicio_registro_carga']);
        $stmt->bindParam(':id_cliente_registro_carga', $data['id_cliente_registro_carga']);
        $stmt->bindParam(':id_area_registro_carga', $data['id_area_registro_carga']);
        $stmt->bindParam(':id_destino_registro_carga', $data['id_destino_registro_carga']);
        $stmt->bindParam(':id_num_guia_registro_carga', $num_guia);
        $stmt->bindParam(':id_creador_registro_carga', $data['id_creador_registro_carga']);
        $stmt->bindParam(':fecha_creado', $data['fecha_creado']);
        $stmt->bindParam(':guia_transportista', $data['guia_transportista']);
        $stmt->bindParam(':guia_remision', $data['guia_remision']);
        $stmt->bindParam(':documento_1', $data['documento_1']);
        $stmt->bindParam(':documento_2', $data['documento_2']);
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Guardado Correctamente!', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo Guardar!', 'datos' => $data];
        }
    } else {
        $sql = "UPDATE registros_cargas SET
        guia_transportista_registro_carga = :guia_transportista, 
        guia_remision_registro_carga = :guia_remision, 
        documento_1_registro_carga = :documento_1, 
        documento_2_registro_carga = :documento_2,
        id_creador_registro_carga = :id_creador_registro_carga 
        WHERE id_orden_servicio_registro_carga = :orden_servicio AND id_destino_registro_carga = :id_destino";

        $stmt = $bd->prepare($sql);
        $stmt->bindParam(':guia_transportista', $data['guia_transportista']);
        $stmt->bindParam(':guia_remision', $data['guia_remision']);
        $stmt->bindParam(':documento_1', $data['documento_1']);
        $stmt->bindParam(':documento_2', $data['documento_2']);
        $stmt->bindParam(':id_creador_registro_carga', $data['id_creador_registro_carga']);
        $stmt->bindParam(':orden_servicio', $id_orden_servicio);
        $stmt->bindParam(':id_destino', $data['id_destino_registro_carga']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Actualizado correctamente!', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $data];
        }
    }
}

function obtenerDatosNumeroRegistro($id_orden_servicio_id_destino)
{
    $bd = obtenerConexion();
    $partes = explode('/', $id_orden_servicio_id_destino);
    $orden_servicio = $partes[0];
    $id_destino = $partes[1];

    $datosOrden = $bd->prepare(
        "SELECT * FROM
        registros_cargas      
        WHERE id_orden_servicio_registro_carga = :orden_servicio AND id_destino_registro_carga = :id_destino"
    );

    $datosOrden->bindParam(':orden_servicio', $orden_servicio);
    $datosOrden->bindParam(':id_destino', $id_destino);
    $datosOrden->execute();
    $data = $datosOrden->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function obtenerRegistro($id_orden_servicio_id_destino)
{
    $bd = obtenerConexion();
    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorCotizacion FROM configuracion_guias WHERE nombre_configuracion_guia = 'cotizacion';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorCotizacion = $campoConsultaID['identificadorCotizacion'] ?? '';

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorPuntoVenta FROM configuracion_guias WHERE nombre_configuracion_guia = 'puntoVenta';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorPuntoVenta = $campoConsultaID['identificadorPuntoVenta'] ?? '';

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicio FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicio';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicio = $campoConsultaID['identificadorOrdenServicio'] ?? '';

    $consultaID = $bd->prepare("SELECT identificador_configuracion_guia AS identificadorOrdenServicioMasivo FROM configuracion_guias WHERE nombre_configuracion_guia = 'ordenServicioMasivo';");
    $consultaID->execute();
    $campoConsultaID = $consultaID->fetch(PDO::FETCH_ASSOC);
    $identificadorOrdenServicioMasivo = $campoConsultaID['identificadorOrdenServicioMasivo'] ?? '';

    $partes = explode('/', $id_orden_servicio_id_destino);
    $orden_servicio = $partes[0];
    $id_destino = $partes[1];
    $prefijo = strtok($orden_servicio, '-');

    if ($prefijo === $identificadorCotizacion) {
        $datosOrden = $bd->prepare(
            "SELECT 
            cd.id AS id,
            cd.id_cotizacion_cotizacion_destino AS id_orden_servicio,
            cd.id_cliente_cotizacion_destino AS id_cliente,
            cd.id_area_cotizacion_destino AS id_area,
            cd.consignado_cotizacion_destino AS consignado,
            cd.dni_ruc_cotizacion_destino AS dni_ruc,
            cd.telefono_cotizacion_destino AS telefono,
            cd.telefono_exc_cotizacion_destino AS telefono_exc,
            cd.direccion_cotizacion_destino AS direccion,
            cd.referencias_cotizacion_destino AS referencias,
            cd.tarifario_cotizacion_destino AS tarifario,
            cd.ubigeo_cotizacion_destino AS ubigeo,
            cd.tmin_entrega_cotizacion_destino AS tmin_entrega,
            cd.tmax_entrega_cotizacion_destino AS tmax_entrega,
            cd.tipo_envio_cotizacion_destino AS tipo_envio,
            cd.contenido_mercancia_cotizacion_destino AS contenido_mercancia,
            cd.peso_mercancia_cotizacion_destino AS peso_mercancia,
            cd.total_metros_cubicos_cotizacion_destino AS total_metros_cubicos,
            cd.total_tarifa_cotizacion_destino AS total_tarifa,
            cd.tipo_logistica_cotizacion_destino AS tipo_logistica,
            cd.cantidad_mercancia_cotizacion_destino AS cantidad_mercancia,
            cd.largo_cotizacion_destino AS largo,
            cd.ancho_cotizacion_destino AS ancho,
            cd.alto_cotizacion_destino AS alto,
            cd.total_peso_volumen_cotizacion_destino AS total_peso_volumen,
            cd.valor_mercancia_cotizacion_destino AS valor_mercancia,
            cd.packing_cotizacion_destino AS packing,
            cd.seguro_cotizacion_destino AS seguro,
            cd.monta_carga_cotizacion_destino AS monta_carga,
            cd.total_adicional_cotizacion_destino AS total_adicional,
            cd.retorno_cotizacion_destino AS retorno,
            cd.estiba_desestiba_cotizacion_destino AS estiba_desestiba,
            cd.transporte_extra_cotizacion_destino AS transporte_extra,
            cd.guia_transportista_cotizacion_destino AS guia_transportista,
            cd.guia_remision_cotizacion_destino AS guia_remision,
            cd.documento_1_cotizacion_destino AS documento_1,
            cd.documento_2_cotizacion_destino AS documento_2,
            cd.id_creador_cotizacion_destino AS id_creador,
            cd.estado AS estado,
            cd.fecha_creado AS fecha_creado,
            cd.fecha_actualizado AS fecha_actualizado,
            ar.nombre_area AS nombre_area,
            c.razon_social_cliente AS razon_social_cliente,
            c.dni_cliente, 
            c.contacto_cliente, 
            c.telefono_cliente, 
            c.email_cliente, 
            c.direccion_cliente AS direccion_cliente,
            ub.DEPARTAMENTO, 
            ub.PROVINCIA, 
            ub.DESTINO,
            ub_cd.DEPARTAMENTO AS 'departamento_destino',
            ub_cd.PROVINCIA AS 'provincia_destino',
            ub_cd.DESTINO AS 'distrito_destino'
        FROM cotizaciones_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_cotizacion_destino = c.id
        INNER JOIN ubigeo ub ON ub.UBIGEO = c.ubigeo_cliente
        INNER JOIN ubigeo ub_cd ON ub_cd.UBIGEO = cd.ubigeo_cotizacion_destino
        INNER JOIN areas ar ON cd.id_area_cotizacion_destino = ar.id        
        WHERE cd.id_cotizacion_cotizacion_destino = :orden_servicio AND cd.id = :id_destino"
        );
    } elseif ($prefijo === $identificadorPuntoVenta) {
        $datosOrden = $bd->prepare(
            "SELECT 
            cd.id AS id,
            cd.id_punto_venta_destino AS id_orden_servicio,
            cd.id_cliente_punto_venta_destino AS id_cliente,
            cd.id_area_punto_venta_destino AS id_area,
            cd.consignado_punto_venta_destino AS consignado,
            cd.dni_ruc_punto_venta_destino AS dni_ruc,
            cd.telefono_punto_venta_destino AS telefono,
            cd.telefono_exc_punto_venta_destino AS telefono_exc,
            cd.direccion_punto_venta_destino AS direccion,
            cd.referencias_punto_venta_destino AS referencias,
            cd.tarifario_punto_venta_destino AS tarifario,
            cd.ubigeo_punto_venta_destino AS ubigeo,
            cd.tmin_entrega_punto_venta_destino AS tmin_entrega,
            cd.tmax_entrega_punto_venta_destino AS tmax_entrega,
            cd.tipo_envio_punto_venta_destino AS tipo_envio,
            cd.contenido_mercancia_punto_venta_destino AS contenido_mercancia,
            cd.peso_mercancia_punto_venta_destino AS peso_mercancia,
            cd.total_metros_cubicos_punto_venta_destino AS total_metros_cubicos,
            cd.total_tarifa_punto_venta_destino AS total_tarifa,
            cd.tipo_logistica_punto_venta_destino AS tipo_logistica,
            cd.cantidad_mercancia_punto_venta_destino AS cantidad_mercancia,
            cd.largo_punto_venta_destino AS largo,
            cd.ancho_punto_venta_destino AS ancho,
            cd.alto_punto_venta_destino AS alto,
            cd.total_peso_volumen_punto_venta_destino AS total_peso_volumen,
            cd.valor_mercancia_punto_venta_destino AS valor_mercancia,
            cd.packing_punto_venta_destino AS packing,
            cd.seguro_punto_venta_destino AS seguro,
            cd.monta_carga_punto_venta_destino AS monta_carga,
            cd.total_adicional_punto_venta_destino AS total_adicional,
            cd.retorno_punto_venta_destino AS retorno,
            cd.estiba_desestiba_punto_venta_destino AS estiba_desestiba,
            cd.transporte_extra_punto_venta_destino AS transporte_extra,
            cd.guia_transportista_punto_venta_destino AS guia_transportista,
            cd.guia_remision_punto_venta_destino AS guia_remision,
            cd.documento_1_punto_venta_destino AS documento_1,
            cd.documento_2_punto_venta_destino AS documento_2,
            cd.id_creador_punto_venta_destino AS id_creador,
            cd.estado AS estado,
            cd.fecha_creado AS fecha_creado,
            cd.fecha_actualizado AS fecha_actualizado,
            ar.nombre_area AS nombre_area,
            c.razon_social_cliente AS razon_social_cliente,
            c.dni_cliente, 
            c.contacto_cliente, 
            c.telefono_cliente, 
            c.email_cliente, 
            c.direccion_cliente AS direccion_cliente,
            ub.DEPARTAMENTO, 
            ub.PROVINCIA, 
            ub.DESTINO,
            ub_cd.DEPARTAMENTO AS 'departamento_destino',
            ub_cd.PROVINCIA AS 'provincia_destino',
            ub_cd.DESTINO AS 'distrito_destino'
        FROM punto_ventas_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_punto_venta_destino = c.id
        INNER JOIN ubigeo ub ON ub.UBIGEO = c.ubigeo_cliente
        INNER JOIN ubigeo ub_cd ON ub_cd.UBIGEO = cd.ubigeo_punto_venta_destino
        INNER JOIN areas ar ON cd.id_area_punto_venta_destino = ar.id
        WHERE cd.id_punto_venta_destino = :orden_servicio AND cd.id = :id_destino"
        );
    } elseif ($prefijo === $identificadorOrdenServicio) {
        $datosOrden = $bd->prepare(
            "SELECT 
            cd.id AS id,
            cd.id_registro_envio_destino AS id_orden_servicio,
            cd.id_cliente_registro_envio_destino AS id_cliente,
            cd.id_area_registro_envio_destino AS id_area,
            cd.consignado_registro_envio_destino AS consignado,
            cd.dni_ruc_registro_envio_destino AS dni_ruc,
            cd.telefono_registro_envio_destino AS telefono,
            cd.telefono_exc_registro_envio_destino AS telefono_exc,
            cd.direccion_registro_envio_destino AS direccion,
            cd.referencias_registro_envio_destino AS referencias,
            cd.tarifario_registro_envio_destino AS tarifario,
            cd.ubigeo_registro_envio_destino AS ubigeo,
            cd.tmin_entrega_registro_envio_destino AS tmin_entrega,
            cd.tmax_entrega_registro_envio_destino AS tmax_entrega,
            cd.tipo_envio_registro_envio_destino AS tipo_envio,
            cd.contenido_mercancia_registro_envio_destino AS contenido_mercancia,
            cd.peso_mercancia_registro_envio_destino AS peso_mercancia,
            cd.total_metros_cubicos_registro_envio_destino AS total_metros_cubicos,
            cd.total_tarifa_registro_envio_destino AS total_tarifa,
            cd.tipo_logistica_registro_envio_destino AS tipo_logistica,
            cd.cantidad_mercancia_registro_envio_destino AS cantidad_mercancia,
            cd.largo_registro_envio_destino AS largo,
            cd.ancho_registro_envio_destino AS ancho,
            cd.alto_registro_envio_destino AS alto,
            cd.total_peso_volumen_registro_envio_destino AS total_peso_volumen,
            cd.valor_mercancia_registro_envio_destino AS valor_mercancia,
            cd.packing_registro_envio_destino AS packing,
            cd.seguro_registro_envio_destino AS seguro,
            cd.monta_carga_registro_envio_destino AS monta_carga,
            cd.total_adicional_registro_envio_destino AS total_adicional,
            cd.retorno_registro_envio_destino AS retorno,
            cd.estiba_desestiba_registro_envio_destino AS estiba_desestiba,
            cd.transporte_extra_registro_envio_destino AS transporte_extra,
            cd.guia_transportista_registro_envio_destino AS guia_transportista,
            cd.guia_remision_registro_envio_destino AS guia_remision,
            cd.documento_1_registro_envio_destino AS documento_1,
            cd.documento_2_registro_envio_destino AS documento_2,
            cd.id_creador_registro_envio_destino AS id_creador,
            cd.estado AS estado,
            cd.fecha_creado AS fecha_creado,
            cd.fecha_actualizado AS fecha_actualizado,
            ar.nombre_area AS nombre_area,
            c.razon_social_cliente AS razon_social_cliente,
            c.dni_cliente, 
            c.contacto_cliente, 
            c.telefono_cliente, 
            c.email_cliente, 
            c.direccion_cliente AS direccion_cliente,
            ub.DEPARTAMENTO, 
            ub.PROVINCIA, 
            ub.DESTINO,
            ub_cd.DEPARTAMENTO AS 'departamento_destino',
            ub_cd.PROVINCIA AS 'provincia_destino',
            ub_cd.DESTINO AS 'distrito_destino'
        FROM registro_envio_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_registro_envio_destino = c.id
        INNER JOIN ubigeo ub ON ub.UBIGEO = c.ubigeo_cliente
        INNER JOIN ubigeo ub_cd ON ub_cd.UBIGEO = cd.ubigeo_registro_envio_destino
        INNER JOIN areas ar ON cd.id_area_registro_envio_destino = ar.id
        WHERE cd.id_registro_envio_destino = :orden_servicio AND cd.id = :id_destino"
        );
    } elseif ($prefijo === $identificadorOrdenServicioMasivo) {
        $datosOrden = $bd->prepare(
            "SELECT 
            cd.id AS id,
            cd.id_registro_masivo_destino AS id_orden_servicio,
            cd.id_cliente_registro_masivo_destino AS id_cliente,
            cd.id_area_registro_masivo_destino AS id_area,
            cd.consignado_registro_masivo_destino AS consignado,
            cd.dni_ruc_registro_masivo_destino AS dni_ruc,
            cd.telefono_registro_masivo_destino AS telefono,
            cd.telefono_exc_registro_masivo_destino AS telefono_exc,
            cd.direccion_registro_masivo_destino AS direccion,
            cd.referencias_registro_masivo_destino AS referencias,
            cd.tarifario_registro_masivo_destino AS tarifario,
            cd.ubigeo_registro_masivo_destino AS ubigeo,
            cd.tmin_entrega_registro_masivo_destino AS tmin_entrega,
            cd.tmax_entrega_registro_masivo_destino AS tmax_entrega,
            cd.tipo_envio_registro_masivo_destino AS tipo_envio,
            cd.contenido_mercancia_registro_masivo_destino AS contenido_mercancia,
            cd.peso_mercancia_registro_masivo_destino AS peso_mercancia,
            cd.total_metros_cubicos_registro_masivo_destino AS total_metros_cubicos,
            cd.total_tarifa_registro_masivo_destino AS total_tarifa,
            cd.tipo_logistica_registro_masivo_destino AS tipo_logistica,
            cd.cantidad_mercancia_registro_masivo_destino AS cantidad_mercancia,
            cd.largo_registro_masivo_destino AS largo,
            cd.ancho_registro_masivo_destino AS ancho,
            cd.alto_registro_masivo_destino AS alto,
            cd.total_peso_volumen_registro_masivo_destino AS total_peso_volumen,
            cd.valor_mercancia_registro_masivo_destino AS valor_mercancia,
            cd.packing_registro_masivo_destino AS packing,
            cd.seguro_registro_masivo_destino AS seguro,
            cd.monta_carga_registro_masivo_destino AS monta_carga,
            cd.total_adicional_registro_masivo_destino AS total_adicional,
            cd.retorno_registro_masivo_destino AS retorno,
            cd.estiba_desestiba_registro_masivo_destino AS estiba_desestiba,
            cd.transporte_extra_registro_masivo_destino AS transporte_extra,
            cd.guia_transportista_registro_masivo_destino AS guia_transportista,
            cd.guia_remision_registro_masivo_destino AS guia_remision,
            cd.documento_1_registro_masivo_destino AS documento_1,
            cd.documento_2_registro_masivo_destino AS documento_2,
            cd.id_creador_registro_masivo_destino AS id_creador,
            cd.estado AS estado,
            cd.fecha_creado AS fecha_creado,
            cd.fecha_actualizado AS fecha_actualizado,
            ar.nombre_area AS nombre_area,
            c.razon_social_cliente AS razon_social_cliente,
            c.dni_cliente, 
            c.contacto_cliente, 
            c.telefono_cliente, 
            c.email_cliente, 
            c.direccion_cliente,
            ub.DEPARTAMENTO, 
            ub.PROVINCIA, 
            ub.DESTINO,
            ub_cd.DEPARTAMENTO AS 'departamento_destino',
            ub_cd.PROVINCIA AS 'provincia_destino',
            ub_cd.DESTINO AS 'distrito_destino'
        FROM registro_masivo_destinos cd
        INNER JOIN clientes c ON cd.id_cliente_registro_masivo_destino = c.id
        INNER JOIN ubigeo ub ON ub.UBIGEO = c.ubigeo_cliente
        INNER JOIN ubigeo ub_cd ON ub_cd.UBIGEO = cd.ubigeo_registro_masivo_destino
        INNER JOIN areas ar ON cd.id_area_registro_masivo_destino = ar.id        
        WHERE cd.id_registro_masivo_destino = :orden_servicio AND cd.id = :id_destino"
        );
    }
    $datosOrden->bindParam(':orden_servicio', $orden_servicio);
    $datosOrden->bindParam(':id_destino', $id_destino);
    $datosOrden->execute();
    $data = $datosOrden->fetch(PDO::FETCH_ASSOC);

    return $data;
}

function registrosCargas()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    COALESCE(cd.id, pvd.id, red.id, rmd.id) AS id_destino,
    e.id_orden_servicio_estado_recojo,
	u.DESTINO,
    r.id_num_guia_registro_carga
    FROM 
        estados_recojos e
    LEFT JOIN 
        cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = e.id_orden_servicio_estado_recojo
    LEFT JOIN 
        punto_ventas_destinos pvd ON pvd.id_punto_venta_destino = e.id_orden_servicio_estado_recojo
    LEFT JOIN 
        registro_envio_destinos red ON red.id_registro_envio_destino = e.id_orden_servicio_estado_recojo
    LEFT JOIN 
        registro_masivo_destinos rmd ON rmd.id_registro_masivo_destino = e.id_orden_servicio_estado_recojo
	LEFT JOIN 
        registros_cargas r ON r.id_orden_servicio_registro_carga = e.id_orden_servicio_estado_recojo AND r.id_destino_registro_carga = COALESCE(cd.id, pvd.id, red.id, rmd.id)
    LEFT JOIN
        ubigeo u ON u.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
        ORDER BY e.id DESC;
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
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
