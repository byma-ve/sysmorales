<?php
function exportarLiquidacionCliente($id_cliente, $id_area, $fechaDesde, $fechaHasta)
{
    $bd = obtenerConexion();
    if ($id_cliente == '') {
        $stmt = $bd->prepare("SELECT 
        lq.estado_documento_liquidacion_cliente AS estado_documento,
        COALESCE(c.recibo_cotizacion, p.recibo_punto_venta, re.recibo_registro_envios, rm.recibo_registro_masivo) AS tipo_documento,
        lq.num_documento_liquidacion_cliente AS num_documento,
        COALESCE(cd.fecha_creado, pvd.fecha_creado, red.fecha_creado, rmd.fecha_creado) AS fecha_orden,
        r.id_orden_servicio_registro_carga AS orden_servicio,
        CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_entrega,
        r.id_num_guia_registro_carga AS guia_tracking,
        (SELECT count(*) FROM estados_guias WHERE id_num_guia_estado_guia = r.id_num_guia_registro_carga) AS num_intentos,
        CASE 
            WHEN de.id_num_guia_despacho_envio IS NULL THEN ''
            WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
            WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
            WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
            ELSE ''
        END AS estado_ultimo_intento,
        COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) AS costo_envio,
        COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino) AS costo_adicionales,
        COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)
        AS sub_total,
        ROUND(((COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)) * 1.18) - (COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)),2) as igv,
        ROUND(((COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)) * 1.18),2) AS precio_total
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
    LEFT JOIN liquidaciones_clientes lq ON lq.orden_servicio_liquidacion_cliente = r.id_orden_servicio_registro_carga
    LEFT JOIN cotizaciones c ON c.id_cotizacion = r.id_orden_servicio_registro_carga
    LEFT JOIN punto_ventas p ON p.id_punto_venta = r.id_orden_servicio_registro_carga
    LEFT JOIN registro_envios re ON re.id_registro_envios = r.id_orden_servicio_registro_carga
    LEFT JOIN registro_masivos rm ON rm.id_registro_masivo = r.id_orden_servicio_registro_carga
    WHERE COALESCE(cd.fecha_creado, pvd.fecha_creado, red.fecha_creado, rmd.fecha_creado) BETWEEN :fechaDesde AND :fechaHasta
    ORDER BY r.id DESC
    ;");
    } else {
        $stmt = $bd->prepare("SELECT 
        lq.estado_documento_liquidacion_cliente AS estado_documento,
        COALESCE(c.recibo_cotizacion, p.recibo_punto_venta, re.recibo_registro_envios, rm.recibo_registro_masivo) AS tipo_documento,
        lq.num_documento_liquidacion_cliente AS num_documento,
        COALESCE(cd.fecha_creado, pvd.fecha_creado, red.fecha_creado, rmd.fecha_creado) AS fecha_orden,
        r.id_orden_servicio_registro_carga AS orden_servicio,
        CONCAT(ub_destino.DEPARTAMENTO, ', ', ub_destino.PROVINCIA, ', ', ub_destino.DESTINO) AS destino_entrega,
        r.id_num_guia_registro_carga AS guia_tracking,
        (SELECT count(*) FROM estados_guias WHERE id_num_guia_estado_guia = r.id_num_guia_registro_carga) AS num_intentos,
        CASE 
            WHEN de.id_num_guia_despacho_envio IS NULL THEN ''
            WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
            WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
            WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
            ELSE ''
        END AS estado_ultimo_intento,
        COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) AS costo_envio,
        COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino) AS costo_adicionales,
        COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)
        AS sub_total,
        ROUND(((COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)) * 1.18) - (COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)),2) as igv,
        ROUND(((COALESCE(cd.total_tarifa_cotizacion_destino, pvd.total_tarifa_punto_venta_destino, red.total_tarifa_registro_envio_destino, rmd.total_tarifa_registro_masivo_destino) 
        + COALESCE(cd.total_adicional_cotizacion_destino, pvd.total_adicional_punto_venta_destino, red.total_adicional_registro_envio_destino, rmd.total_adicional_registro_masivo_destino)) * 1.18),2) AS precio_total
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
    LEFT JOIN liquidaciones_clientes lq ON lq.orden_servicio_liquidacion_cliente = r.id_orden_servicio_registro_carga
    LEFT JOIN cotizaciones c ON c.id_cotizacion = r.id_orden_servicio_registro_carga
    LEFT JOIN punto_ventas p ON p.id_punto_venta = r.id_orden_servicio_registro_carga
    LEFT JOIN registro_envios re ON re.id_registro_envios = r.id_orden_servicio_registro_carga
    LEFT JOIN registro_masivos rm ON rm.id_registro_masivo = r.id_orden_servicio_registro_carga
    WHERE r.id_cliente_registro_carga = :id_cliente AND r.id_area_registro_carga = :id_area AND COALESCE(cd.fecha_creado, pvd.fecha_creado, red.fecha_creado, rmd.fecha_creado) BETWEEN :fechaDesde AND :fechaHasta
    ORDER BY r.id DESC
    ;");
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->bindParam(':id_area', $id_area);
    }
    $stmt->bindParam(':fechaDesde', $fechaDesde);
    $stmt->bindParam(':fechaHasta', $fechaHasta);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function crearEstructuraCarpetasMensual($servicio, $idCarpetaRaiz, $anio, $mes, $cliente)
{
    $nombreCarpetaAnio = $anio;
    $idCarpetaAnio = crearCarpetaSinoExiste($servicio, $idCarpetaRaiz, $nombreCarpetaAnio);
    $idCarpetaCliente = crearCarpetaSinoExiste($servicio, $idCarpetaAnio, $cliente);
    $idCarpetaMes = crearCarpetaSinoExiste($servicio, $idCarpetaCliente, obtenerNombreMes($mes));
    $idCarpetaDocCliente = crearCarpetaSinoExiste($servicio, $idCarpetaMes, "Doc. Cliente");

    return $idCarpetaDocCliente;
}

function obtenerNombreMes($numeroMes)
{
    $meses = array(
        1 => 'Enero',
        2 => 'Febrero',
        3 => 'Marzo',
        4 => 'Abril',
        5 => 'Mayo',
        6 => 'Junio',
        7 => 'Julio',
        8 => 'Agosto',
        9 => 'Septiembre',
        10 => 'Octubre',
        11 => 'Noviembre',
        12 => 'Diciembre'
    );

    return $meses[$numeroMes];
}

function crearCarpetaSinoExiste($service, $idCarpetaPadre, $nombreCarpeta)
{
    $carpetasExistentes = $service->files->listFiles(array(
        'q' => "name='" . $nombreCarpeta . "' and '" . $idCarpetaPadre . "' in parents",
        'fields' => 'files(id, name)'
    ))->getFiles();
    if (count($carpetasExistentes) > 0) {
        return $carpetasExistentes[0]->getId();
    } else {
        $carpeta = new Google_Service_Drive_DriveFile();
        $carpeta->setName($nombreCarpeta);
        $carpeta->setMimeType('application/vnd.google-apps.folder');
        $carpeta->setParents(array($idCarpetaPadre));

        $carpetaCreada = $service->files->create($carpeta, array(
            'fields' => 'id'
        ));
        return $carpetaCreada->id;
    }
}

function reemplazarArchivoSiExiste($service, $idCarpeta, $nombreArchivo) {
    $archivosExistentes = $service->files->listFiles(array(
        'q' => "name='{$nombreArchivo}' and '{$idCarpeta}' in parents and trashed=false",
        'fields' => 'files(id, name)'
    ))->getFiles();
    if (count($archivosExistentes) > 0) {
        foreach ($archivosExistentes as $archivo) {
            $service->files->delete($archivo->getId());
        }
    }
}

function guardarImagen($pdf_liquidacion_cliente, $nombreArchivo, $cliente, $fechaCreado)
{
    require_once('../../services/api_google_drive/api-google/vendor/autoload.php');
    putenv('GOOGLE_APPLICATION_CREDENTIALS=../../services/api_google_drive/bymavearchivos-f8c2d3d5790f.json');
    $idCarpetaPadre = obtenerVariableDelEntorno("ID_CARPETA_PADRE_DRIVE");
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->SetScopes(['https://www.googleapis.com/auth/drive.file']);
    $service = new Google_Service_Drive($client);
    $timestamp = strtotime($fechaCreado);
    $anioActual = date('Y', $timestamp);
    $mesActual = date('n', $timestamp);
    $IdCarpeta = crearEstructuraCarpetasMensual($service, $idCarpetaPadre, $anioActual, $mesActual, $cliente);
    reemplazarArchivoSiExiste($service, $IdCarpeta, $nombreArchivo);
    $file_path = $pdf_liquidacion_cliente['tmp_name'];
    $file = new Google_Service_Drive_DriveFile();
    $file->setName($nombreArchivo);
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file_path);

    $file->setParents(array($IdCarpeta));
    $file->setMimeType($mime_type);
    $resultado = $service->files->create(
        $file,
        array(
            'data' => file_get_contents($file_path),
            'mimeType' => $mime_type,
            'uploadType' => 'media'
        )
    );
    $ruta = 'https://drive.google.com/uc?id=' . $resultado->id;

    return $ruta;
}


function guardarLiquidacion($datos)
{
    date_default_timezone_set('America/Lima');
    $bd = obtenerConexion();
    
    $fechaPdf = $bd->prepare("SELECT fecha_creado FROM validaciones
    WHERE id_orden_servicio_validacion = ?");
    $fechaPdf->execute([$datos->orden_servicio_liquidacion_cliente]);
    $fecha_actual = $fechaPdf->fetch(PDO::FETCH_ASSOC)['fecha_creado'];
    
    $validacion_db = $bd->prepare("SELECT COUNT(*) as total FROM liquidaciones_clientes WHERE orden_servicio_liquidacion_cliente = ?");
    $validacion_db->execute([$datos->orden_servicio_liquidacion_cliente]);
    $validacion_db = $validacion_db->fetch(PDO::FETCH_ASSOC);
    $cliente_db = $bd->prepare("WITH union_table AS (
            SELECT id_cliente_cotizacion AS id_cliente,id_cotizacion AS id_orden_servicio FROM cotizaciones
            UNION ALL
            SELECT id_cliente_punto_venta AS id_cliente,id_punto_venta AS id_orden_servicio FROM punto_ventas
            UNION ALL
            SELECT id_cliente_registro_envios AS id_cliente,id_registro_envios AS id_orden_servicio FROM registro_envios
            UNION ALL
            SELECT id_cliente_registro_masivo AS id_cliente,id_registro_masivo AS id_orden_servicio  FROM registro_masivos
        )
        SELECT clientes.id,clientes.razon_social_cliente,union_table.id_orden_servicio
        FROM union_table
        INNER JOIN clientes ON union_table.id_cliente = clientes.id
        WHERE union_table.id_orden_servicio = ?");
    $cliente_db->execute([$datos->orden_servicio_liquidacion_cliente]);
    $cliente = $cliente_db->fetch(PDO::FETCH_ASSOC)['razon_social_cliente'];

    if ($validacion_db['total'] > 0) {
        if (!empty($datos->pdf_liquidacion_cliente)) {
            $rutaDB = guardarImagen($datos->pdf_liquidacion_cliente, "$datos->orden_servicio_liquidacion_cliente / $cliente / $datos->num_documento_liquidacion_cliente" , $cliente, $fecha_actual);
            $sentencia = $bd->prepare("UPDATE liquidaciones_clientes SET num_documento_liquidacion_cliente = ?, estado_documento_liquidacion_cliente = ? , pdf_liquidacion_cliente = ? WHERE orden_servicio_liquidacion_cliente = ?");
            if ($sentencia->execute([
                $datos->num_documento_liquidacion_cliente,
                $datos->estado_documento_liquidacion_cliente,
                $rutaDB,
                $datos->orden_servicio_liquidacion_cliente
            ])) {
                return ['success' => true, 'message' => 'Se actualizó correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $datos];
            }
        } else {
            $sentencia = $bd->prepare("UPDATE liquidaciones_clientes SET num_documento_liquidacion_cliente = ?, estado_documento_liquidacion_cliente = ? WHERE orden_servicio_liquidacion_cliente = ?");
            if ($sentencia->execute([
                $datos->num_documento_liquidacion_cliente,
                $datos->estado_documento_liquidacion_cliente,
                $datos->orden_servicio_liquidacion_cliente
            ])) {
                return ['success' => true, 'message' => 'Se actualizó correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $datos];
            }
        }
    } else {
        if (!empty($datos->pdf_liquidacion_cliente)) {
            $rutaDB = guardarImagen($datos->pdf_liquidacion_cliente, "$datos->orden_servicio_liquidacion_cliente / $cliente / $datos->num_documento_liquidacion_cliente" , $cliente, $fecha_actual);

            $sentencia = $bd->prepare("INSERT INTO liquidaciones_clientes(orden_servicio_liquidacion_cliente,num_documento_liquidacion_cliente, estado_documento_liquidacion_cliente, pdf_liquidacion_cliente, fecha_creado) VALUES (? ,?, ?, ?, ?)");
            if ($sentencia->execute([
                $datos->orden_servicio_liquidacion_cliente,
                $datos->num_documento_liquidacion_cliente,
                $datos->estado_documento_liquidacion_cliente,
                $rutaDB,
                $fecha_actual
            ])) {
                return ['success' => true, 'message' => 'Se registró correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo registrar!', 'datos' => $datos];
            }
        } else {
            $sentencia = $bd->prepare("INSERT INTO liquidaciones_clientes(orden_servicio_liquidacion_cliente,num_documento_liquidacion_cliente, estado_documento_liquidacion_cliente, fecha_creado) VALUES (? ,?, ?, ?)");
            if ($sentencia->execute([
                $datos->orden_servicio_liquidacion_cliente,
                $datos->num_documento_liquidacion_cliente,
                $datos->estado_documento_liquidacion_cliente,
                $fecha_actual
            ])) {
                return ['success' => true, 'message' => 'Se registró correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo registrar!', 'datos' => $datos];
            }
        }
    }
}

function ObtenerLiquidaciones()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT
    lc.estado_documento_liquidacion_cliente AS estado_documento,
    COALESCE(c.recibo_cotizacion, pv.recibo_punto_venta, re.recibo_registro_envios, rm.recibo_registro_masivo) AS tipo_documento,
    lc.num_documento_liquidacion_cliente AS numero_documento,
    v.fecha_creado AS fecha_orden, 
    v.id_orden_servicio_validacion,
    cli.razon_social_cliente,
    ar.nombre_area,
    (SELECT COUNT(*) FROM registros_cargas WHERE id_orden_servicio_registro_carga = v.id_orden_servicio_validacion) AS cantidad_guias,
    (SELECT COUNT(*) AS total_count
    FROM registros_cargas rc 
    WHERE rc.id_orden_servicio_registro_carga = v.id_orden_servicio_validacion 
    AND rc.id_num_guia_registro_carga NOT IN (
        SELECT eg.id_num_guia_estado_guia
        FROM estados_guias eg
        WHERE eg.proceso_estado_guia = 'entregado'
        OR eg.num_intento_estado_guia = 'intento 3'
    )) AS guias_proceso,
    SUM(COALESCE(cd.total_tarifa_cotizacion_destino, 0) + COALESCE(pvd.total_tarifa_punto_venta_destino, 0) + COALESCE(red.total_tarifa_registro_envio_destino, 0) + COALESCE(rmv.total_tarifa_registro_masivo_destino, 0)) AS costos_envios,
    SUM(COALESCE(cd.total_adicional_cotizacion_destino, 0) + COALESCE(pvd.total_adicional_punto_venta_destino, 0) + COALESCE(red.total_adicional_registro_envio_destino, 0) + COALESCE(rmv.total_adicional_registro_masivo_destino, 0)) AS costos_adicionales,
    COALESCE(c.sub_total_cotizacion, 0) + COALESCE(pv.sub_total_punto_venta, 0) + COALESCE(re.sub_total_registro_envios, 0) + COALESCE(rm.sub_total_registro_masivo, 0) AS sub_total,
    COALESCE(c.igv_cotizacion, 0) + COALESCE(pv.igv_punto_venta, 0) + COALESCE(re.igv_registro_envios, 0) + COALESCE(rm.igv_registro_masivo, 0) AS igv,
    COALESCE(c.precio_total_cotizacion, 0) + COALESCE(pv.precio_total_punto_venta, 0) + COALESCE(re.precio_total_registro_envios, 0) + COALESCE(rm.precio_total_masivo, 0) AS precio_total,
    lc.pdf_liquidacion_cliente
    FROM validaciones v
    LEFT JOIN 
        cotizaciones c ON c.id_cotizacion = v.id_orden_servicio_validacion
    LEFT JOIN 
        cotizaciones_destinos cd ON cd.id_cotizacion_cotizacion_destino = v.id_orden_servicio_validacion
    LEFT JOIN 
        punto_ventas pv ON pv.id_punto_venta = v.id_orden_servicio_validacion
    LEFT JOIN 
        punto_ventas_destinos pvd ON pvd.id_punto_venta_destino = v.id_orden_servicio_validacion
    LEFT JOIN 
        registro_envios re ON re.id_registro_envios = v.id_orden_servicio_validacion
    LEFT JOIN 
        registro_envio_destinos red ON red.id_registro_envio_destino = v.id_orden_servicio_validacion
    LEFT JOIN 
        registro_masivos rm ON rm.id_registro_masivo = v.id_orden_servicio_validacion
    LEFT JOIN 
        registro_masivo_destinos rmv ON rmv.id_registro_masivo_destino = v.id_orden_servicio_validacion
    LEFT JOIN 
        clientes cli ON cli.id = COALESCE(c.id_cliente_cotizacion, pv.id_cliente_punto_venta, re.id_cliente_registro_envios, rm.id_cliente_registro_masivo)
    LEFT JOIN 
        areas ar ON ar.id = COALESCE(c.id_area_cotizacion, pv.id_area_punto_venta, re.id_area_registro_envios, rm.id_area_registro_masivo)
    LEFT JOIN 
        liquidaciones_clientes lc ON lc.orden_servicio_liquidacion_cliente = v.id_orden_servicio_validacion
    GROUP BY 
        v.id_orden_servicio_validacion
    ORDER BY v.id DESC
    ;
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
