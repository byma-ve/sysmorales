<?php
function exportarLiquidacionAgente($id_agente, $fechaDesde, $fechaHasta)
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

    if ($id_agente == '') {
        $stmt = $bd->prepare("SELECT 
        la.estado_documento_liquidacion_agente AS estado_documento,
        la.tipo_documento_liquidacion_agente as tipo_documento,
        la.num_documento_liquidacion_agente as num_documento,
        id_num_manifiesto_despacho_envio AS num_manifiesto,
        de.fecha_creado as fecha_emision,
        CONCAT(ub.DEPARTAMENTO, ', ', ub.PROVINCIA, ', ', ub.DESTINO) AS destino_entrega,
        prov.razon_social_proveedor as agente,
        de.id_num_guia_despacho_envio as guia_tracking,
        (SELECT count(*) FROM estados_guias WHERE id_num_guia_estado_guia = de.id_num_guia_despacho_envio) AS num_intentos,
        CASE 
            WHEN de.id_num_guia_despacho_envio IS NULL THEN ''
            WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
            WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
            WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
            ELSE ''
        END AS estado_ultimo_intento,
        
        SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
        ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))) AS costos_envios,
        ROUND((
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
        ) * 1.18 - (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
        ), 2) AS igv,
                ROUND(
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
                +
                (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
            ) * 1.18 - (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
            )
                ,2) AS precio_total
        FROM despachos_envios de
        LEFT JOIN proveedores prov ON prov.id = de.id_agente_despacho_envio 
        LEFT JOIN registros_cargas rc ON rc.id_num_guia_registro_carga = de.id_num_guia_despacho_envio
        LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
        LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
        LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3' 
        LEFT JOIN cotizaciones_destinos cd ON cd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorCotizacion-%'
        LEFT JOIN punto_ventas_destinos pvd ON pvd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorPuntoVenta-%'
        LEFT JOIN registro_envio_destinos red ON red.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicio-%'
        LEFT JOIN registro_masivo_destinos rmd ON rmd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicioMasivo-%'
        LEFT JOIN ubigeo ub ON ub.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
        LEFT JOIN tarifarios_agentes_courriers tc ON prov.id = tc.id_agente_tarifario_agente_courrier AND tc.ubigeo_tarifario_agente_courrier = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'terrestre'
        LEFT JOIN tarifarios_agentes_aereos ta ON  prov.id = ta.id_agente_tarifario_agente_aereo AND ta.ubigeo_tarifario_agente_aereo = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'aereo'
        LEFT JOIN liquidaciones_agentes la ON la.id_agente_liquidacion_agente = prov.id AND num_manifiesto_liquidacion_agente = de.id_num_manifiesto_despacho_envio
        WHERE de.id_agente_despacho_envio IS NOT NULL AND de.id_num_manifiesto_despacho_envio <> '0' AND de.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
        GROUP BY de.id_num_guia_despacho_envio
        ORDER BY de.id_num_manifiesto_despacho_envio DESC
        ;");
    } else {
        $stmt = $bd->prepare("SELECT 
        la.estado_documento_liquidacion_agente AS estado_documento,
        la.tipo_documento_liquidacion_agente as tipo_documento,
        la.num_documento_liquidacion_agente as num_documento,
        id_num_manifiesto_despacho_envio AS num_manifiesto,
        de.fecha_creado as fecha_emision,
        CONCAT(ub.DEPARTAMENTO, ', ', ub.PROVINCIA, ', ', ub.DESTINO) AS destino_entrega,
        prov.razon_social_proveedor as agente,
        de.id_num_guia_despacho_envio as guia_tracking,
        (SELECT count(*) FROM estados_guias WHERE id_num_guia_estado_guia = de.id_num_guia_despacho_envio) AS num_intentos,
        CASE 
            WHEN de.id_num_guia_despacho_envio IS NULL THEN ''
            WHEN eg3.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg3.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg3.proceso_estado_guia, 2)))
            WHEN eg2.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg2.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg2.proceso_estado_guia, 2)))
            WHEN eg1.proceso_estado_guia IS NOT NULL THEN CONCAT(UPPER(LEFT(eg1.proceso_estado_guia, 1)), LOWER(SUBSTRING(eg1.proceso_estado_guia, 2)))
            ELSE ''
        END AS estado_ultimo_intento,
        
        SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
        ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))) AS costos_envios,
        ROUND((
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
        ) * 1.18 - (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
        ), 2) AS igv,
                ROUND(
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
                +
                (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
            ) * 1.18 - (
                SUM(COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
                    (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
                    COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
                    COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
                    COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
                    - 1
                ) * SUM(COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))
            )
                ,2) AS precio_total
        FROM despachos_envios de
        LEFT JOIN proveedores prov ON prov.id = de.id_agente_despacho_envio 
        LEFT JOIN registros_cargas rc ON rc.id_num_guia_registro_carga = de.id_num_guia_despacho_envio
        LEFT JOIN estados_guias eg1 ON eg1.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg1.num_intento_estado_guia = 'intento 1'
        LEFT JOIN estados_guias eg2 ON eg2.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg2.num_intento_estado_guia = 'intento 2'
        LEFT JOIN estados_guias eg3 ON eg3.id_num_guia_estado_guia = rc.id_num_guia_registro_carga AND eg3.num_intento_estado_guia = 'intento 3' 
        LEFT JOIN cotizaciones_destinos cd ON cd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorCotizacion-%'
        LEFT JOIN punto_ventas_destinos pvd ON pvd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorPuntoVenta-%'
        LEFT JOIN registro_envio_destinos red ON red.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicio-%'
        LEFT JOIN registro_masivo_destinos rmd ON rmd.id = rc.id_destino_registro_carga AND rc.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicioMasivo-%'
        LEFT JOIN ubigeo ub ON ub.UBIGEO = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino)
        LEFT JOIN tarifarios_agentes_courriers tc ON prov.id = tc.id_agente_tarifario_agente_courrier AND tc.ubigeo_tarifario_agente_courrier = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'terrestre'
        LEFT JOIN tarifarios_agentes_aereos ta ON  prov.id = ta.id_agente_tarifario_agente_aereo AND ta.ubigeo_tarifario_agente_aereo = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'aereo'
        LEFT JOIN liquidaciones_agentes la ON la.id_agente_liquidacion_agente = prov.id AND num_manifiesto_liquidacion_agente = de.id_num_manifiesto_despacho_envio
        WHERE de.id_agente_despacho_envio IS NOT NULL AND de.id_num_manifiesto_despacho_envio <> '0' AND de.id_agente_despacho_envio = :id_agente AND de.fecha_creado BETWEEN :fechaDesde AND :fechaHasta
        GROUP BY de.id_num_guia_despacho_envio
        ORDER BY de.id_num_manifiesto_despacho_envio DESC
        ;
        ");
        $stmt->bindParam(':id_agente', $id_agente);
    }
    $stmt->bindParam(':fechaDesde', $fechaDesde);
    $stmt->bindParam(':fechaHasta', $fechaHasta);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

function crearEstructuraCarpetasMensual($servicio, $idCarpetaRaiz, $anio, $mes, $cliente, $tipoArchivo)
{
    $nombreCarpetaAnio = $anio;
    $idCarpetaAnio = crearCarpetaSinoExiste($servicio, $idCarpetaRaiz, $nombreCarpetaAnio);
    $idCarpetaCliente = crearCarpetaSinoExiste($servicio, $idCarpetaAnio, $cliente);
    $idCarpetaMes = crearCarpetaSinoExiste($servicio, $idCarpetaCliente, obtenerNombreMes($mes));
    $idCarpetaDocCliente = crearCarpetaSinoExiste($servicio, $idCarpetaMes, "Doc. Agente");
    $idCarpetaArchivo = crearCarpetaSinoExiste($servicio, $idCarpetaDocCliente, "DOC. $tipoArchivo");

    return $idCarpetaArchivo;
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

function reemplazarArchivoSiExiste($service, $idCarpeta, $nombreArchivo)
{
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

function guardarImagen($pdf_liquidacion_agente, $nombreArchivo, $cliente, $fechaCreado, $tipoArchivo)
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
    $IdCarpeta = crearEstructuraCarpetasMensual($service, $idCarpetaPadre, $anioActual, $mesActual, $cliente, $tipoArchivo);
    reemplazarArchivoSiExiste($service, $IdCarpeta, $nombreArchivo);
    $file_path = $pdf_liquidacion_agente['tmp_name'];
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


function guardarLiquidacionAgente($datos)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");

    $bd = obtenerConexion();
    $validacion_db = $bd->prepare("SELECT COUNT(*) as total FROM liquidaciones_agentes WHERE num_manifiesto_liquidacion_agente = ? AND id_agente_liquidacion_agente = ?");
    $validacion_db->execute([$datos->num_manifiesto_liquidacion_agente, $datos->id_agente_liquidacion_agente]);
    $validacion_db = $validacion_db->fetch(PDO::FETCH_ASSOC);

    $fechaPdf = $bd->prepare("SELECT DISTINCT(fecha_creado) FROM despachos_envios
    WHERE id_num_manifiesto_despacho_envio = ?");
    $fechaPdf->execute([$datos->num_manifiesto_liquidacion_agente]);
    $fechaCreadoPdf = $fechaPdf->fetch(PDO::FETCH_ASSOC)['fecha_creado'];

    $cliente_db = $bd->prepare("SELECT DISTINCT(c.razon_social_cliente) FROM despachos_envios de
    LEFT JOIN registros_cargas rc ON
    de.id_num_guia_despacho_envio = rc.id_num_guia_registro_carga
    LEFT JOIN clientes c ON
    c.id = rc.id_cliente_registro_carga
    WHERE de.id_num_manifiesto_despacho_envio = ?");
    $cliente_db->execute([$datos->num_manifiesto_liquidacion_agente]);
    $cliente = $cliente_db->fetch(PDO::FETCH_ASSOC)['razon_social_cliente'];


    if ($validacion_db['total'] > 0) {
        if (!empty($datos->pdf_liquidacion_agente)) {
            $rutaDB = guardarImagen($datos->pdf_liquidacion_agente, "$datos->num_manifiesto_liquidacion_agente / $datos->nombre_agente / $datos->num_documento_liquidacion_agente", $cliente, $fechaCreadoPdf, $datos->tipo_documento_liquidacion_agente);
            $sentencia = $bd->prepare("UPDATE liquidaciones_agentes SET num_documento_liquidacion_agente = ?, tipo_documento_liquidacion_agente = ?, estado_documento_liquidacion_agente = ? , pdf_liquidacion_agente = ? WHERE num_manifiesto_liquidacion_agente = ? AND id_agente_liquidacion_agente = ?");
            if ($sentencia->execute([
                $datos->num_documento_liquidacion_agente,
                $datos->tipo_documento_liquidacion_agente,
                $datos->estado_documento_liquidacion_agente,
                $rutaDB,
                $datos->num_manifiesto_liquidacion_agente,
                $datos->id_agente_liquidacion_agente
            ])) {
                return ['success' => true, 'message' => 'Se actualizó correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $datos];
            }
        } else {
            $sentencia = $bd->prepare("UPDATE liquidaciones_agentes SET num_documento_liquidacion_agente = ?, tipo_documento_liquidacion_agente = ?, estado_documento_liquidacion_agente = ? WHERE num_manifiesto_liquidacion_agente = ? AND id_agente_liquidacion_agente = ?");
            if ($sentencia->execute([
                $datos->num_documento_liquidacion_agente,
                $datos->tipo_documento_liquidacion_agente,
                $datos->estado_documento_liquidacion_agente,
                $datos->num_manifiesto_liquidacion_agente,
                $datos->id_agente_liquidacion_agente
            ])) {
                return ['success' => true, 'message' => 'Se actualizó correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar!', 'datos' => $datos];
            }
        }
    } else {
        if (!empty($datos->pdf_liquidacion_agente)) {
            $rutaDB = guardarImagen($datos->pdf_liquidacion_agente, "$datos->num_manifiesto_liquidacion_agente / $datos->nombre_agente / $datos->num_documento_liquidacion_agente", $cliente, $fechaCreadoPdf, $datos->tipo_documento_liquidacion_agente);

            $sentencia = $bd->prepare("INSERT INTO liquidaciones_agentes(id_agente_liquidacion_agente,tipo_documento_liquidacion_agente, num_manifiesto_liquidacion_agente,num_documento_liquidacion_agente, estado_documento_liquidacion_agente, pdf_liquidacion_agente, fecha_creado) VALUES (?, ?, ? ,?, ?, ?, ?)");
            if ($sentencia->execute([
                $datos->id_agente_liquidacion_agente,
                $datos->tipo_documento_liquidacion_agente,
                $datos->num_manifiesto_liquidacion_agente,
                $datos->num_documento_liquidacion_agente,
                $datos->estado_documento_liquidacion_agente,
                $rutaDB,
                $fecha_actual
            ])) {
                return ['success' => true, 'message' => 'Se registró correctamente', 'datos' => $datos];
            } else {
                return ['success' => false, 'message' => 'Error: ¡No se pudo registrar!', 'datos' => $datos];
            }
        } else {
            $sentencia = $bd->prepare("INSERT INTO liquidaciones_agentes(id_agente_liquidacion_agente, tipo_documento_liquidacion_agente, num_manifiesto_liquidacion_agente,num_documento_liquidacion_agente, estado_documento_liquidacion_agente, fecha_creado) VALUES (?, ?, ? ,?, ?, ?)");
            if ($sentencia->execute([
                $datos->id_agente_liquidacion_agente,
                $datos->tipo_documento_liquidacion_agente,
                $datos->num_manifiesto_liquidacion_agente,
                $datos->num_documento_liquidacion_agente,
                $datos->estado_documento_liquidacion_agente,
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

    $stmt = $bd->query("SELECT 
    de.id,
    la.estado_documento_liquidacion_agente,
    la.tipo_documento_liquidacion_agente,
    la.num_documento_liquidacion_agente,
    de.fecha_creado AS fecha_emision,
    de.id_num_manifiesto_despacho_envio AS num_manifiesto, 
    prov.razon_social_proveedor AS agente,
    de.id_agente_despacho_envio,
    COALESCE(CONCAT(ub_transportista.DEPARTAMENTO, ', ', ub_transportista.PROVINCIA, ', ', ub_transportista.DESTINO), 'Lima, Lima, Lima') AS destino_origen,
    CONCAT(ub.DEPARTAMENTO, ', ', ub.PROVINCIA, ', ', ub.DESTINO) AS destino_agente,
    (SELECT COUNT(*) FROM despachos_envios WHERE id_num_manifiesto_despacho_envio = de.id_num_manifiesto_despacho_envio AND id_agente_despacho_envio = de.id_agente_despacho_envio) AS cantidad_guias,
    (SELECT COUNT(*) AS total_count
    FROM despachos_envios rc 
    WHERE rc.id_num_manifiesto_despacho_envio = de.id_num_manifiesto_despacho_envio AND rc.id_agente_despacho_envio = de.id_agente_despacho_envio
    AND rc.id_num_guia_despacho_envio NOT IN (
        SELECT eg.id_num_guia_estado_guia
        FROM estados_guias eg
        WHERE eg.proceso_estado_guia = 'entregado'
        OR eg.num_intento_estado_guia = 'intento 3'
    )) AS guias_proceso,
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0)))) AS costos_envios,
    
    ROUND((
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))))
    ) * 1.18 - (
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))))
    ), 2) AS igv,

        ROUND(
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))))
        +
        (
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))))
    ) * 1.18 - (
        SUM((COALESCE(tc.kg_tarifario_agente_courrier, 0) + COALESCE(ta.kg_tarifario_agente_aereo, 0)) + (
            (COALESCE(cd.peso_mercancia_cotizacion_destino, 0) +
            COALESCE(pvd.peso_mercancia_punto_venta_destino, 0) +
            COALESCE(red.peso_mercancia_registro_envio_destino, 0) +
            COALESCE(rmd.peso_mercancia_registro_masivo_destino, 0)
            - 1
        ) * (COALESCE(tc.kg_adicional_tarifario_agente_courrier, 0) + COALESCE(ta.kg_adicional_tarifario_agente_aereo, 0))))
    )
        ,2) AS precio_total,
    la.pdf_liquidacion_agente
    FROM despachos_envios de
    LEFT JOIN despachos desp ON desp.id_num_manifiesto_despacho = de.id_num_manifiesto_despacho_envio
    LEFT JOIN proveedores prov_transportista ON prov_transportista.id = desp.id_transportista_despacho
    LEFT JOIN ubigeo ub_transportista ON ub_transportista.UBIGEO = prov_transportista.ubigeo_proveedor
    LEFT JOIN registros_cargas rg ON rg.id_num_guia_registro_carga = de.id_num_guia_despacho_envio
    LEFT JOIN proveedores prov ON prov.id = de.id_agente_despacho_envio
    LEFT JOIN ubigeo ub ON ub.UBIGEO = prov.ubigeo_proveedor
    LEFT JOIN cotizaciones_destinos cd ON cd.id = rg.id_destino_registro_carga AND rg.id_orden_servicio_registro_carga LIKE '$identificadorCotizacion-%'
    LEFT JOIN punto_ventas_destinos pvd ON pvd.id = rg.id_destino_registro_carga AND rg.id_orden_servicio_registro_carga LIKE '$identificadorPuntoVenta-%'
    LEFT JOIN registro_envio_destinos red ON red.id = rg.id_destino_registro_carga AND rg.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicio-%'
    LEFT JOIN registro_masivo_destinos rmd ON rmd.id = rg.id_destino_registro_carga AND rg.id_orden_servicio_registro_carga LIKE '$identificadorOrdenServicioMasivo-%'
    LEFT JOIN liquidaciones_agentes la ON la.id_agente_liquidacion_agente = de.id_agente_despacho_envio AND la.num_manifiesto_liquidacion_agente = de.id_num_manifiesto_despacho_envio
    LEFT JOIN tarifarios_agentes_courriers tc ON prov.id = tc.id_agente_tarifario_agente_courrier AND tc.ubigeo_tarifario_agente_courrier = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'terrestre'
    LEFT JOIN tarifarios_agentes_aereos ta ON  prov.id = ta.id_agente_tarifario_agente_aereo AND ta.ubigeo_tarifario_agente_aereo = COALESCE(cd.ubigeo_cotizacion_destino, pvd.ubigeo_punto_venta_destino, red.ubigeo_registro_envio_destino, rmd.ubigeo_registro_masivo_destino) AND prov.tipo_servicio_proveedor = 'aereo'
    WHERE 
        de.id_agente_despacho_envio IS NOT NULL 
        AND de.id_agente_despacho_envio <> '' 
        AND de.id_num_manifiesto_despacho_envio IS NOT NULL 
        AND de.id_num_manifiesto_despacho_envio <> '0'
    GROUP BY 
        de.id_agente_despacho_envio, 
        de.id_num_manifiesto_despacho_envio    
    ORDER BY de.id DESC
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
