<?php
function exportarGuiasTotales()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT
    c.razon_social_cliente,
    COUNT(DISTINCT rc.id_orden_servicio_registro_carga) AS guias_madre,
    COUNT(rc.id_num_guia_registro_carga) AS guias_tracking
    FROM
        registros_cargas rc
        LEFT JOIN clientes c ON c.id = rc.id_cliente_registro_carga
    GROUP BY
        c.razon_social_cliente
    ORDER BY rc.id DESC; 
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function exportarGuias()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT 
    c.razon_social_cliente,
    rc.id_orden_servicio_registro_carga,
    rc.id_num_guia_registro_carga 
    FROM registros_cargas rc
    LEFT JOIN clientes c ON c.id = rc.id_cliente_registro_carga
    ORDER BY rc.id DESC
    ;  
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function obtenerConectados($id_usuario)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("SELECT * 
        FROM usuarios 
        WHERE id != :id_usuario
        AND estado = '1'
        ORDER BY conectado DESC;");
    $sentencia->bindParam(':id_usuario', $id_usuario);
    $sentencia->execute();
    $resultados = $sentencia->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
}

function porcentajeEstados($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH despachos AS (
            SELECT count(de.id_num_guia_despacho_envio) AS total_despachos
            FROM despachos_envios de
            LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
            LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
              WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND YEAR(de.fecha_creado) = :id_year AND eg.id_num_guia_estado_guia IS NULL
          ),
          entregados AS (
            SELECT count(*) AS total_entregado
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
          WHERE rg.id_cliente_registro_carga = :id_cliente2 AND rg.id_area_registro_carga = :id_area2 AND YEAR(estados_guias.fecha_creado) = :id_year2 AND proceso_estado_guia = 'entregado'
          ),
          motivados AS (
            SELECT COUNT(DISTINCT id_num_guia_estado_guia) AS total_motivados
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
            WHERE  rg.id_cliente_registro_carga = :id_cliente3 AND rg.id_area_registro_carga = :id_area3 AND YEAR(estados_guias.fecha_creado) = :id_year3 AND
            proceso_estado_guia = 'motivado'
            AND id_num_guia_estado_guia NOT IN (
              SELECT id_num_guia_estado_guia
              FROM estados_guias
              WHERE proceso_estado_guia = 'entregado'
            )
          )
          SELECT
            ROUND(1000.0 * total_despachos / (total_despachos + total_entregado + total_motivados)) AS porcentaje_despachos,
            ROUND(1000.0 * total_entregado / (total_despachos + total_entregado + total_motivados)) AS porcentaje_entregados,
            ROUND(1000.0 * total_motivados / (total_despachos + total_entregado + total_motivados)) AS porcentaje_motivados
          FROM despachos, entregados, motivados;
          ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
        $sentencia->bindParam(':id_cliente2', $id_cliente);
        $sentencia->bindParam(':id_area2', $id_area);
        $sentencia->bindParam(':id_year2', $id_year);
        $sentencia->bindParam(':id_cliente3', $id_cliente);
        $sentencia->bindParam(':id_area3', $id_area);
        $sentencia->bindParam(':id_year3', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH despachos AS (
            SELECT count(de.id_num_guia_despacho_envio) AS total_despachos
            FROM despachos_envios de
            LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
            LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
              WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND eg.id_num_guia_estado_guia IS NULL
          ),
          entregados AS (
            SELECT count(*) AS total_entregado
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
          WHERE rg.id_cliente_registro_carga = :id_cliente2 AND rg.id_area_registro_carga = :id_area2 AND proceso_estado_guia = 'entregado'
          ),
          motivados AS (
            SELECT COUNT(DISTINCT id_num_guia_estado_guia) AS total_motivados
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
            WHERE  rg.id_cliente_registro_carga = :id_cliente3 AND rg.id_area_registro_carga = :id_area3 AND
            proceso_estado_guia = 'motivado'
            AND id_num_guia_estado_guia NOT IN (
              SELECT id_num_guia_estado_guia
              FROM estados_guias
              WHERE proceso_estado_guia = 'entregado'
            )
          )
          SELECT
            ROUND(1000.0 * total_despachos / (total_despachos + total_entregado + total_motivados)) AS porcentaje_despachos,
            ROUND(1000.0 * total_entregado / (total_despachos + total_entregado + total_motivados)) AS porcentaje_entregados,
            ROUND(1000.0 * total_motivados / (total_despachos + total_entregado + total_motivados)) AS porcentaje_motivados
          FROM despachos, entregados, motivados;
          ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);

        $sentencia->bindParam(':id_cliente2', $id_cliente);
        $sentencia->bindParam(':id_area2', $id_area);

        $sentencia->bindParam(':id_cliente3', $id_cliente);
        $sentencia->bindParam(':id_area3', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH despachos AS (
            SELECT count(de.id_num_guia_despacho_envio) AS total_despachos
            FROM despachos_envios de
            LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
            LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
              WHERE YEAR(de.fecha_creado) = :id_year AND eg.id_num_guia_estado_guia IS NULL
          ),
          entregados AS (
            SELECT count(*) AS total_entregado
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
          WHERE YEAR(estados_guias.fecha_creado) = :id_year2 AND proceso_estado_guia = 'entregado'
          ),
          motivados AS (
            SELECT COUNT(DISTINCT id_num_guia_estado_guia) AS total_motivados
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
            WHERE YEAR(estados_guias.fecha_creado) = :id_year3 AND
            proceso_estado_guia = 'motivado'
            AND id_num_guia_estado_guia NOT IN (
              SELECT id_num_guia_estado_guia
              FROM estados_guias
              WHERE proceso_estado_guia = 'entregado'
            )
          )
          SELECT
            ROUND(1000.0 * total_despachos / (total_despachos + total_entregado + total_motivados)) AS porcentaje_despachos,
            ROUND(1000.0 * total_entregado / (total_despachos + total_entregado + total_motivados)) AS porcentaje_entregados,
            ROUND(1000.0 * total_motivados / (total_despachos + total_entregado + total_motivados)) AS porcentaje_motivados
          FROM despachos, entregados, motivados;
          ");
        $sentencia->bindParam(':id_year', $id_year);
        $sentencia->bindParam(':id_year2', $id_year);
        $sentencia->bindParam(':id_year3', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH despachos AS (
            SELECT count(de.id_num_guia_despacho_envio) AS total_despachos
            FROM despachos_envios de
            LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
            LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
              WHERE eg.id_num_guia_estado_guia IS NULL
          ),
          entregados AS (
            SELECT count(*) AS total_entregado
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
          WHERE proceso_estado_guia = 'entregado'
          ),
          motivados AS (
            SELECT COUNT(DISTINCT id_num_guia_estado_guia) AS total_motivados
            FROM estados_guias
            LEFT JOIN registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
            WHERE
            proceso_estado_guia = 'motivado'
            AND id_num_guia_estado_guia NOT IN (
              SELECT id_num_guia_estado_guia
              FROM estados_guias
              WHERE proceso_estado_guia = 'entregado'
            )
          )
          SELECT
            ROUND(1000.0 * total_despachos / (total_despachos + total_entregado + total_motivados)) AS porcentaje_despachos,
            ROUND(1000.0 * total_entregado / (total_despachos + total_entregado + total_motivados)) AS porcentaje_entregados,
            ROUND(1000.0 * total_motivados / (total_despachos + total_entregado + total_motivados)) AS porcentaje_motivados
          FROM despachos, entregados, motivados;
          ");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function totalEntregados($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT count(*) as total_entregado 
        FROM estados_guias
        LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
        WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND YEAR(estados_guias.fecha_creado) = :id_year AND proceso_estado_guia = 'entregado';
        ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT count(*) as total_entregado 
        FROM estados_guias
        LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
        WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND proceso_estado_guia = 'entregado';
        ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT count(*) as total_entregado 
        FROM estados_guias
        LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
        WHERE YEAR(estados_guias.fecha_creado) = :id_year AND proceso_estado_guia = 'entregado';
        ");

        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT count(*) as total_entregado 
        FROM estados_guias
        LEFT JOIN registros_cargas rg ON estados_guias.id_num_guia_estado_guia = rg.id_num_guia_registro_carga
        WHERE proceso_estado_guia = 'entregado';
        ");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function totalMotivados($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT COUNT(DISTINCT id_num_guia_estado_guia) as total FROM estados_guias
        LEFT JOIN  registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
          WHERE 
          rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND YEAR(estados_guias.fecha_creado) = :id_year 
          AND proceso_estado_guia = 'motivado' AND id_num_guia_estado_guia NOT IN (SELECT id_num_guia_estado_guia FROM estados_guias WHERE proceso_estado_guia = 'entregado');");

        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT COUNT(DISTINCT id_num_guia_estado_guia) as total FROM estados_guias
        LEFT JOIN  registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
          WHERE 
          rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area 
          AND proceso_estado_guia = 'motivado' AND id_num_guia_estado_guia NOT IN (SELECT id_num_guia_estado_guia FROM estados_guias WHERE proceso_estado_guia = 'entregado');");

        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {

        $sentencia = $bd->prepare("SELECT COUNT(DISTINCT id_num_guia_estado_guia) as total FROM estados_guias
        LEFT JOIN  registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
          WHERE 
          YEAR(estados_guias.fecha_creado) = :id_year 
          AND proceso_estado_guia = 'motivado' AND id_num_guia_estado_guia NOT IN (SELECT id_num_guia_estado_guia FROM estados_guias WHERE proceso_estado_guia = 'entregado');");

        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT COUNT(DISTINCT id_num_guia_estado_guia) as total FROM estados_guias
        LEFT JOIN  registros_cargas rg ON rg.id_num_guia_registro_carga = estados_guias.id_num_guia_estado_guia
        WHERE 
        proceso_estado_guia = 'motivado' AND id_num_guia_estado_guia NOT IN (SELECT id_num_guia_estado_guia FROM estados_guias WHERE proceso_estado_guia = 'entregado');");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function totalDespachos($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        count(de.id_num_guia_despacho_envio) AS total_despachos
        FROM 
            despachos_envios de
        LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
        LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
        WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND YEAR(de.fecha_creado) = :id_year AND eg.id_num_guia_estado_guia IS NULL;
        ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        count(de.id_num_guia_despacho_envio) AS total_despachos
        FROM 
            despachos_envios de
        LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
        LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
        WHERE rg.id_cliente_registro_carga = :id_cliente AND rg.id_area_registro_carga = :id_area AND eg.id_num_guia_estado_guia IS NULL;
        ");

        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        count(de.id_num_guia_despacho_envio) AS total_despachos
        FROM 
            despachos_envios de
        LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
        LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
        WHERE YEAR(de.fecha_creado) = :id_year AND eg.id_num_guia_estado_guia IS NULL;
        ");
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        count(de.id_num_guia_despacho_envio) AS total_despachos
        FROM 
            despachos_envios de
        LEFT JOIN estados_guias eg ON de.id_num_guia_despacho_envio = eg.id_num_guia_estado_guia
        LEFT JOIN registros_cargas rg ON de.id_num_guia_despacho_envio = rg.id_num_guia_registro_carga
        WHERE eg.id_num_guia_estado_guia IS NULL;
        ");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function totalGuias($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(*) as total_guias
        FROM registros_cargas
        WHERE id_cliente_registro_carga = :id_cliente AND id_area_registro_carga = :id_area AND YEAR(fecha_creado) = :id_year;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(*) as total_guias
        FROM registros_cargas
        WHERE id_cliente_registro_carga = :id_cliente AND id_area_registro_carga = :id_area;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(*) as total_guias
        FROM registros_cargas
        WHERE YEAR(fecha_creado) = :id_year;");
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(*) as total_guias
        FROM registros_cargas;");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function totalRecojos($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(id_orden_servicio) AS cantidad_ordenes
        FROM (
            SELECT id_punto_venta AS id_orden_servicio, id_cliente_punto_venta AS id_cliente, id_area_punto_venta AS id_area, fecha_creado AS id_fecha  FROM punto_ventas
            UNION ALL
            SELECT id_registro_envios AS id_orden_servicio,id_cliente_registro_envios AS id_cliente, id_area_registro_envios AS id_area, fecha_creado AS id_fecha  FROM registro_envios
            UNION ALL
            SELECT id_registro_masivo AS id_orden_servicio,id_cliente_registro_masivo AS id_cliente, id_area_registro_masivo AS id_area, fecha_creado AS id_fecha  FROM registro_masivos
            UNION ALL
            SELECT id_cotizacion AS id_orden_servicio,id_cliente_cotizacion AS id_cliente, id_area_cotizacion AS id_area, fecha_creado AS id_fecha   FROM cotizaciones
        ) AS unioned_tables
        JOIN estados_recojos ON unioned_tables.id_orden_servicio = estados_recojos.id_orden_servicio_estado_recojo
        WHERE unioned_tables.id_cliente = :id_cliente AND unioned_tables.id_area = :id_area AND YEAR(estados_recojos.fecha_creado) = :id_year;
        ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(id_orden_servicio) AS cantidad_ordenes
        FROM (
            SELECT id_punto_venta AS id_orden_servicio, id_cliente_punto_venta AS id_cliente, id_area_punto_venta AS id_area, fecha_creado AS id_fecha  FROM punto_ventas
            UNION ALL
            SELECT id_registro_envios AS id_orden_servicio,id_cliente_registro_envios AS id_cliente, id_area_registro_envios AS id_area, fecha_creado AS id_fecha  FROM registro_envios
            UNION ALL
            SELECT id_registro_masivo AS id_orden_servicio,id_cliente_registro_masivo AS id_cliente, id_area_registro_masivo AS id_area, fecha_creado AS id_fecha  FROM registro_masivos
            UNION ALL
            SELECT id_cotizacion AS id_orden_servicio,id_cliente_cotizacion AS id_cliente, id_area_cotizacion AS id_area, fecha_creado AS id_fecha   FROM cotizaciones
        ) AS unioned_tables
        JOIN estados_recojos ON unioned_tables.id_orden_servicio = estados_recojos.id_orden_servicio_estado_recojo
        WHERE unioned_tables.id_cliente = :id_cliente AND unioned_tables.id_area = :id_area;
        ");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(id_orden_servicio) AS cantidad_ordenes
        FROM (
            SELECT id_punto_venta AS id_orden_servicio, id_cliente_punto_venta AS id_cliente, id_area_punto_venta AS id_area, fecha_creado AS id_fecha  FROM punto_ventas
            UNION ALL
            SELECT id_registro_envios AS id_orden_servicio,id_cliente_registro_envios AS id_cliente, id_area_registro_envios AS id_area, fecha_creado AS id_fecha  FROM registro_envios
            UNION ALL
            SELECT id_registro_masivo AS id_orden_servicio,id_cliente_registro_masivo AS id_cliente, id_area_registro_masivo AS id_area, fecha_creado AS id_fecha  FROM registro_masivos
            UNION ALL
            SELECT id_cotizacion AS id_orden_servicio,id_cliente_cotizacion AS id_cliente, id_area_cotizacion AS id_area, fecha_creado AS id_fecha   FROM cotizaciones
        ) AS unioned_tables
        JOIN estados_recojos ON unioned_tables.id_orden_servicio = estados_recojos.id_orden_servicio_estado_recojo
        WHERE YEAR(estados_recojos.fecha_creado) = :id_year;
        ");
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("SELECT 
        COUNT(id_orden_servicio) AS cantidad_ordenes
        FROM (
            SELECT id_punto_venta AS id_orden_servicio, id_cliente_punto_venta AS id_cliente, id_area_punto_venta AS id_area, fecha_creado AS id_fecha  FROM punto_ventas
            UNION ALL
            SELECT id_registro_envios AS id_orden_servicio,id_cliente_registro_envios AS id_cliente, id_area_registro_envios AS id_area, fecha_creado AS id_fecha  FROM registro_envios
            UNION ALL
            SELECT id_registro_masivo AS id_orden_servicio,id_cliente_registro_masivo AS id_cliente, id_area_registro_masivo AS id_area, fecha_creado AS id_fecha  FROM registro_masivos
            UNION ALL
            SELECT id_cotizacion AS id_orden_servicio,id_cliente_cotizacion AS id_cliente, id_area_cotizacion AS id_area, fecha_creado AS id_fecha   FROM cotizaciones
        ) AS unioned_tables
        JOIN estados_recojos ON unioned_tables.id_orden_servicio = estados_recojos.id_orden_servicio_estado_recojo;
        ");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetch(PDO::FETCH_ASSOC);
    return $resultados;
}

function topDestinos($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE rc.id_cliente_registro_carga = :id_cliente AND rc.id_area_registro_carga = :id_area AND YEAR(rc.fecha_creado) = :id_year
        ),total_registros AS (
    SELECT COUNT(*) AS total
    FROM registros
)
        SELECT
            u.UBIGEO,  
            u.DEPARTAMENTO,
            u.PROVINCIA,
            u.DESTINO, 
            COUNT(r.ubigeo) AS Income,
            ROUND(COUNT(r.ubigeo) * 100.0 / (SELECT total FROM total_registros), 0) AS Percentage
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.UBIGEO
        HAVING COUNT(r.ubigeo) > 0
        ORDER BY Income DESC
        LIMIT 10;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE rc.id_cliente_registro_carga = :id_cliente AND rc.id_area_registro_carga = :id_area
        ),total_registros AS (
    SELECT COUNT(*) AS total
    FROM registros
)
        SELECT 
            u.UBIGEO, 
            u.DEPARTAMENTO,
            u.PROVINCIA,
            u.DESTINO, 
            COUNT(r.ubigeo) AS Income,
            ROUND(COUNT(r.ubigeo) * 100.0 / (SELECT total FROM total_registros), 0) AS Percentage
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.UBIGEO
        HAVING COUNT(r.ubigeo) > 0
        ORDER BY Income DESC
        LIMIT 10;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE YEAR(rc.fecha_creado) = :id_year
        ),total_registros AS (
    SELECT COUNT(*) AS total
    FROM registros
)
        SELECT
            u.UBIGEO,  
            u.DEPARTAMENTO,
            u.PROVINCIA,
            u.DESTINO, 
            COUNT(r.ubigeo) AS Income,
            ROUND(COUNT(r.ubigeo) * 100.0 / (SELECT total FROM total_registros), 0) AS Percentage
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.UBIGEO
        HAVING COUNT(r.ubigeo) > 0
        ORDER BY Income DESC
        LIMIT 10;");
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
        ),total_registros AS (
    SELECT COUNT(*) AS total
    FROM registros
)
        SELECT
            u.UBIGEO,  
            u.DEPARTAMENTO,
            u.PROVINCIA,
            u.DESTINO, 
            COUNT(r.ubigeo) AS Income,
            ROUND(COUNT(r.ubigeo) * 100.0 / (SELECT total FROM total_registros), 0) AS Percentage
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.UBIGEO
        HAVING COUNT(r.ubigeo) > 0
        ORDER BY Income DESC
        LIMIT 10;");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
}

function frecuenciaDepartamentos($id_cliente, $id_area, $id_year)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE rc.id_cliente_registro_carga = :id_cliente AND rc.id_area_registro_carga = :id_area AND YEAR(rc.fecha_creado) = :id_year
        )
        SELECT 
            CASE 
                WHEN u.DEPARTAMENTO = 'HUANCAVELICA' THEN 'HUV'
                WHEN u.DEPARTAMENTO = 'HUANUCO' THEN 'HUC'
                ELSE SUBSTRING(u.DEPARTAMENTO, 1, 3)
            END as name , 
            COUNT(r.ubigeo) AS Income
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.DEPARTAMENTO
        ;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente != '' && $id_area != '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE rc.id_cliente_registro_carga = :id_cliente AND rc.id_area_registro_carga = :id_area
        )
        SELECT 
            CASE 
                WHEN u.DEPARTAMENTO = 'HUANCAVELICA' THEN 'HUV'
                WHEN u.DEPARTAMENTO = 'HUANUCO' THEN 'HUC'
                ELSE SUBSTRING(u.DEPARTAMENTO, 1, 3)
            END as name , 
            COUNT(r.ubigeo) AS Income
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.DEPARTAMENTO
        ;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year != '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
            WHERE YEAR(rc.fecha_creado) = :id_year
        )
        SELECT 
            CASE 
                WHEN u.DEPARTAMENTO = 'HUANCAVELICA' THEN 'HUV'
                WHEN u.DEPARTAMENTO = 'HUANUCO' THEN 'HUC'
                ELSE SUBSTRING(u.DEPARTAMENTO, 1, 3)
            END as name , 
            COUNT(r.ubigeo) AS Income
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.DEPARTAMENTO
        ;");
        $sentencia->bindParam(':id_year', $id_year);
    }
    if ($id_cliente == '' && $id_area == '' && $id_year == '') {
        $sentencia = $bd->prepare("WITH registros AS (
            SELECT rc.*, 
                   COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) as ubigeo
            FROM registros_cargas rc
            LEFT JOIN cotizaciones_destinos cd ON rc.id_destino_registro_carga = cd.id AND rc.id_orden_servicio_registro_carga = cd.id_cotizacion_cotizacion_destino
            LEFT JOIN punto_ventas_destinos pvd ON rc.id_destino_registro_carga = pvd.id AND rc.id_orden_servicio_registro_carga = pvd.id_punto_venta_destino
            LEFT JOIN registro_envio_destinos red ON rc.id_destino_registro_carga = red.id AND rc.id_orden_servicio_registro_carga = red.id_registro_envio_destino
            LEFT JOIN registro_masivo_destinos rmd ON rc.id_destino_registro_carga = rmd.id AND rc.id_orden_servicio_registro_carga = rmd.id_registro_masivo_destino
        )
        SELECT 
            CASE 
                WHEN u.DEPARTAMENTO = 'HUANCAVELICA' THEN 'HUV'
                WHEN u.DEPARTAMENTO = 'HUANUCO' THEN 'HUC'
                ELSE SUBSTRING(u.DEPARTAMENTO, 1, 3)
            END as name , 
            COUNT(r.ubigeo) AS Income
        FROM 
            ubigeo u
        LEFT JOIN registros r ON u.UBIGEO = r.ubigeo
        GROUP BY u.DEPARTAMENTO
        ;");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetchAll(PDO::FETCH_ASSOC);
    return $resultados;
}

function selectYear($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    if ($id_cliente != '' && $id_area != '') {
        $sentencia = $bd->prepare("SELECT DISTINCT EXTRACT(YEAR FROM fecha_creado) AS nombre_year
        FROM registros_cargas WHERE id_cliente_registro_carga = :id_cliente AND id_area_registro_carga = :id_area
        ;");
        $sentencia->bindParam(':id_cliente', $id_cliente);
        $sentencia->bindParam(':id_area', $id_area);
    } else {
        $sentencia = $bd->prepare("SELECT DISTINCT EXTRACT(YEAR FROM fecha_creado) AS nombre_year
        FROM registros_cargas;  
        ;");
    }
    $sentencia->execute();
    $resultados = $sentencia->fetchAll(PDO::FETCH_ASSOC);
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
