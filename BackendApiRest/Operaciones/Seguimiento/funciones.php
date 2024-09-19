<?php
function exportarEntregados()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    CASE 
        WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
        WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
        WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
        WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
        ELSE 'En Despacho'
    END AS estado_operacion,
    CASE 
        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
        ELSE de.fecha_creado
    END AS fecha_operacion,
    CASE 
        WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
        WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
        WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
        WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
        ELSE TIME(de.fecha_actualizado)
    END AS hora_operacion,
    r.id_orden_servicio_registro_carga AS orden_servicio,
    r.id_num_guia_registro_carga AS guia_tracking, 
    cli.razon_social_cliente,
    ar.nombre_area,
    CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
    COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
    CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
    COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_envio,
    COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
    COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
    COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
    COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
    DATEDIFF( 
                 CASE 
                     WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                     WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                     WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                 END, de.fecha_creado) AS lead_time,
    COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
    CASE 
        WHEN DATEDIFF( 
                      CASE 
                          WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                          WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                          WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                      END, de.fecha_creado) IS NULL THEN NULL
        WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                CASE 
                                                    WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                    WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                    WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                    WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                    ELSE de.fecha_creado
                                                END, de.fecha_creado) THEN 'A tiempo'
        ELSE 'Tarde'
    END AS entrega_status
    FROM registros_cargas r
    LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
    LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
    LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
    LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
    LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
    LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
    LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
    LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
    LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
    LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
    LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
    LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
    LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
    WHERE    
CASE 
    WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
    WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
    WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
    WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
    ELSE 'En Despacho'
END = 'Entregado'
ORDER BY r.id DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function exportarMotivados()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    CASE 
        WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
        WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
        WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
        WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
        ELSE 'En Despacho'
    END AS estado_operacion,
    CASE 
        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
        ELSE de.fecha_creado
    END AS fecha_operacion,
    CASE 
        WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
        WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
        WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
        WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
        ELSE TIME(de.fecha_actualizado)
    END AS hora_operacion,
    r.id_orden_servicio_registro_carga AS orden_servicio,
    r.id_num_guia_registro_carga AS guia_tracking, 
    cli.razon_social_cliente,
    ar.nombre_area,
    CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
    COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
    CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
    COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_envio,
    COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
    COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
    COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
    COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
    DATEDIFF( 
                 CASE 
                     WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                     WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                     WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                 END, de.fecha_creado) AS lead_time,
    COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
    CASE 
        WHEN DATEDIFF( 
                      CASE 
                          WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                          WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                          WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                      END, de.fecha_creado) IS NULL THEN NULL
        WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                CASE 
                                                    WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                    WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                    WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                    WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                    ELSE de.fecha_creado
                                                END, de.fecha_creado) THEN 'A tiempo'
        ELSE 'Tarde'
    END AS entrega_status
    FROM registros_cargas r
    LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
    LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
    LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
    LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
    LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
    LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
    LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
    LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
    LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
    LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
    LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
    LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
    LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
    WHERE    
CASE 
    WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
    WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
    WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
    WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
    ELSE 'En Despacho'
END = 'Motivado'
ORDER BY r.id DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function exportarDespachos()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    CASE 
        WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
        WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
        WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
        WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
        ELSE 'En Despacho'
    END AS estado_operacion,
    CASE 
        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
        ELSE de.fecha_creado
    END AS fecha_operacion,
    CASE 
        WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
        WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
        WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
        WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
        ELSE TIME(de.fecha_actualizado)
    END AS hora_operacion,
    r.id_orden_servicio_registro_carga AS orden_servicio,
    r.id_num_guia_registro_carga AS guia_tracking, 
    cli.razon_social_cliente,
    ar.nombre_area,
    CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
    COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
    CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
    COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_envio,
    COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
    COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
    COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
    COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
    DATEDIFF( 
                 CASE 
                     WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                     WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                     WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                 END, de.fecha_creado) AS lead_time,
    COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
    CASE 
        WHEN DATEDIFF( 
                      CASE 
                          WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                          WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                          WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                      END, de.fecha_creado) IS NULL THEN NULL
        WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                CASE 
                                                    WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                    WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                    WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                    WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                    ELSE de.fecha_creado
                                                END, de.fecha_creado) THEN 'A tiempo'
        ELSE 'Tarde'
    END AS entrega_status
    FROM registros_cargas r
    LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
    LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
    LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
    LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
    LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
    LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
    LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
    LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
    LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
    LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
    LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
    LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
    LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
    WHERE    
CASE 
    WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
    WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
    WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
    WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
    ELSE 'En Despacho'
END = 'En Despacho'
ORDER BY r.id DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function exportarSeguimiento($id_cliente, $id_area, $fechaDesde, $fechaHasta)
{
    $bd = obtenerConexion();
    if ($id_cliente == '') {
        $stmt = $bd->prepare("SELECT 
        CASE 
            WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
            WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
            WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
            WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
            ELSE 'En Despacho'
        END AS estado_operacion,
        CASE 
            WHEN de.fecha_creado IS NULL THEN r.fecha_creado
            WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
            WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
            WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
            ELSE de.fecha_creado
        END AS fecha_operacion,
        CASE 
            WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
            WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
            WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
            WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
            ELSE TIME(de.fecha_actualizado)
        END AS hora_operacion,
        r.id_orden_servicio_registro_carga AS orden_servicio,
        r.id_num_guia_registro_carga AS guia_tracking, 
        cli.razon_social_cliente,
        ar.nombre_area,
        CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
        COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
        CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
        COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_envio,
        COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
        COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
        COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
        COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
        DATEDIFF( 
                     CASE 
                         WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                         WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                         WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                     END, de.fecha_creado) AS lead_time,
        COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
        CASE 
            WHEN DATEDIFF( 
                          CASE 
                              WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                              WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                              WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                          END, de.fecha_creado) IS NULL THEN NULL
            WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                    CASE 
                                                        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                        ELSE de.fecha_creado
                                                    END, de.fecha_creado) THEN 'A tiempo'
            ELSE 'Tarde'
        END AS entrega_status
        FROM registros_cargas r
        LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
        LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
        LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
        LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
        LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
        LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
        LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
        LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
        LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
        LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
        LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
        LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
        LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
        WHERE r.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
        ORDER BY r.id DESC
        ;");
    } else {
        $stmt = $bd->prepare("SELECT 
    CASE 
        WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
        WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
        WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
        WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
        ELSE 'En Despacho'
    END AS estado_operacion,
    CASE 
        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
        ELSE de.fecha_creado
    END AS fecha_operacion,
    CASE 
        WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
        WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
        WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
        WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
        ELSE TIME(de.fecha_actualizado)
    END AS hora_operacion,
    r.id_orden_servicio_registro_carga AS orden_servicio,
    r.id_num_guia_registro_carga AS guia_tracking, 
    cli.razon_social_cliente,
    ar.nombre_area,
    CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
    COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
    CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
	COALESCE(cd.direccion_cotizacion_destino, pvd.direccion_punto_venta_destino, red.direccion_registro_envio_destino, rmd.direccion_registro_masivo_destino) AS direccion_envio,
    COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
    COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
    COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
    COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
    DATEDIFF( 
                 CASE 
                     WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                     WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                     WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                 END, de.fecha_creado) AS lead_time,
    COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
    CASE 
        WHEN DATEDIFF( 
                      CASE 
                          WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                          WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                          WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                      END, de.fecha_creado) IS NULL THEN NULL
        WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                CASE 
                                                    WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                    WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                    WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                    WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                    ELSE de.fecha_creado
                                                END, de.fecha_creado) THEN 'A tiempo'
        ELSE 'Tarde'
    END AS entrega_status
    FROM registros_cargas r
    LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
    LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
    LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
    LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
    LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
    LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
    LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
    LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
    LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
    LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
    LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
    LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
    LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
    WHERE r.id_cliente_registro_carga = :id_cliente AND r.id_area_registro_carga = :id_area AND r.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
    ORDER BY r.id DESC;");
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->bindParam(':id_area', $id_area);
    }
    $stmt->bindParam(':fechaDesde', $fechaDesde);
    $stmt->bindParam(':fechaHasta', $fechaHasta);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}


function obtenerSeguimiento()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    CASE 
        WHEN de.id_num_guia_despacho_envio IS NULL THEN 'En registro'
        WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
        WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
        WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
        ELSE 'En Despacho'
    END AS estado_operacion,
    CASE 
        WHEN de.fecha_creado IS NULL THEN r.fecha_creado
        WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
        WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
        WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
        ELSE de.fecha_creado
    END AS fecha_operacion,
    CASE 
        WHEN de.fecha_actualizado IS NULL THEN TIME(r.fecha_actualizado)
        WHEN eg3.fecha_actualizado IS NOT NULL THEN TIME(eg3.fecha_actualizado)
        WHEN eg2.fecha_actualizado IS NOT NULL THEN TIME(eg2.fecha_actualizado)
        WHEN eg1.fecha_actualizado IS NOT NULL THEN TIME(eg1.fecha_actualizado)
        ELSE TIME(de.fecha_actualizado)
    END AS hora_operacion,
    r.id_orden_servicio_registro_carga AS orden_servicio,
    r.id_num_guia_registro_carga AS guia_tracking, 
    cli.razon_social_cliente,
    ar.nombre_area,
    CONCAT(ub_partida.DEPARTAMENTO, ', ', ub_partida.PROVINCIA, ', ', ub_partida.DESTINO) AS destino_partida,
    COALESCE(cd.consignado_cotizacion_destino, pvd.consignado_punto_venta_destino, red.consignado_registro_envio_destino, rmd.consignado_registro_masivo_destino) AS nombre_consignado,
    CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_llegada,
    COALESCE(cd.contenido_mercancia_cotizacion_destino, pvd.contenido_mercancia_punto_venta_destino, red.contenido_mercancia_registro_envio_destino, rmd.contenido_mercancia_registro_masivo_destino) AS contenido_envio,
    COALESCE(cd.cantidad_mercancia_cotizacion_destino, pvd.cantidad_mercancia_punto_venta_destino, red.cantidad_mercancia_registro_envio_destino, rmd.cantidad_mercancia_registro_masivo_destino) AS cantidad_envio,
    COALESCE(cd.peso_mercancia_cotizacion_destino, pvd.peso_mercancia_punto_venta_destino, red.peso_mercancia_registro_envio_destino, rmd.peso_mercancia_registro_masivo_destino) AS peso_masa_envio,
    COALESCE(cd.total_peso_volumen_cotizacion_destino, pvd.total_peso_volumen_punto_venta_destino, red.total_peso_volumen_registro_envio_destino, rmd.total_peso_volumen_registro_masivo_destino) AS peso_volumen_envio,
    DATEDIFF( 
                 CASE 
                     WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                     WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                     WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                 END, de.fecha_creado) AS lead_time,
    COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) AS tiempo_entrega,
    CASE 
        WHEN DATEDIFF( 
                      CASE 
                          WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                          WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                          WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                      END, de.fecha_creado) IS NULL THEN NULL
        WHEN COALESCE(cd.tmax_entrega_cotizacion_destino, pvd.tmax_entrega_punto_venta_destino, red.tmax_entrega_registro_envio_destino, rmd.tmax_entrega_registro_masivo_destino) > DATEDIFF(
                                                CASE 
                                                    WHEN de.fecha_creado IS NULL THEN r.fecha_creado
                                                    WHEN eg3.fecha_proceso_estado_guia IS NOT NULL THEN eg3.fecha_proceso_estado_guia
                                                    WHEN eg2.fecha_proceso_estado_guia IS NOT NULL THEN eg2.fecha_proceso_estado_guia
                                                    WHEN eg1.fecha_proceso_estado_guia IS NOT NULL THEN eg1.fecha_proceso_estado_guia
                                                    ELSE de.fecha_creado
                                                END, de.fecha_creado) THEN 'A tiempo'
        ELSE 'Tarde'
    END AS entrega_status,
    r.observaciones_registro_carga,
    r.fecha_referencia_registro_carga,
    r.tipo_cargo_registro_carga
FROM registros_cargas r
LEFT JOIN despachos_envios de ON de.id_num_guia_despacho_envio = r.id_num_guia_registro_carga AND de.id_num_manifiesto_despacho_envio != '0'
LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = r.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3'
LEFT JOIN clientes cli ON cli.id = r.id_cliente_registro_carga
LEFT JOIN areas ar ON ar.id = r.id_area_registro_carga
LEFT JOIN cotizaciones_destinos cd ON cd.id = r.id_destino_registro_carga
LEFT JOIN punto_ventas_destinos pvd ON pvd.id = r.id_destino_registro_carga
LEFT JOIN registro_envio_destinos red ON red.id = r.id_destino_registro_carga
LEFT JOIN registro_masivo_destinos rmd ON rmd.id = r.id_destino_registro_carga
LEFT JOIN ubigeo ub_destino ON ub_destino.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
LEFT JOIN programaciones prog ON prog.id_orden_servicio = r.id_orden_servicio_registro_carga
LEFT JOIN ubigeo ub_partida ON ub_partida.UBIGEO = prog.ubigeo_programacion
ORDER BY r.id DESC;");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function guardarSeguimiento($data)
{
    $bd = obtenerConexion();

    if(empty($data['tipo_cargo']) || empty($data['fecha_referencia']) || empty($data['guia_tracking'])){
        return ['success' => false, 'message' => 'Error: ¡Tiene que completar los campos!', 'datos' => $data];
    }

    $sql = "UPDATE registros_cargas 
    SET tipo_cargo_registro_carga = :tipo_cargo_registro_carga,
        fecha_referencia_registro_carga = :fecha_referencia_registro_carga, 
        observaciones_registro_carga = :observaciones_registro_carga
    WHERE id_num_guia_registro_carga = :id_num_guia_registro_carga";
    $stmt = $bd->prepare($sql);
    $stmt->bindParam(':tipo_cargo_registro_carga', $data['tipo_cargo']);
    $stmt->bindParam(':fecha_referencia_registro_carga', $data['fecha_referencia']);
    $stmt->bindParam(':observaciones_registro_carga', $data['observaciones']);
    $stmt->bindParam(':id_num_guia_registro_carga', $data['guia_tracking']);

    if ($stmt->execute()) {
        return ['success' => true, 'message' => '¡Completado con Exito!', 'datos' => $data];
    } else {
        return ['success' => false, 'message' => 'Error: ¡No se pudo Completar!', 'datos' => $data];
    }
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
