<?php
function guardarPDFDrive($pdf, $nombreArchivo, $cliente, $fechaCreado, $Intento)

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
    $IdCarpeta = crearEstructuraCarpetas($service, $idCarpetaPadre, $anioActual, $mesActual, $cliente, $Intento, 'PDF');
    reemplazarArchivoSiExiste($service, $IdCarpeta, $nombreArchivo);
    $file_path = $pdf['tmp_name'];
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

function crearEstructuraCarpetas($servicio, $idCarpetaRaiz, $anio, $mes, $cliente, $Intento, $tipo)
{
    $nombreCarpetaAnio = $anio;

    $idCarpetaAnio = crearCarpetaSinoExiste($servicio, $idCarpetaRaiz, $nombreCarpetaAnio);

    $idCarpetaCliente = crearCarpetaSinoExiste($servicio, $idCarpetaAnio, $cliente);

    $idCarpetaMes = crearCarpetaSinoExiste($servicio, $idCarpetaCliente, obtenerNombreMes($mes));

    $idCarpetaImagenes = crearCarpetaSinoExiste($servicio, $idCarpetaMes, "Estados Guías");

    $idCarpetaIntento = crearCarpetaSinoExiste($servicio, $idCarpetaImagenes, $Intento);

    if ($tipo == 'PDF') {
        $idCarpetaGuia = crearCarpetaSinoExiste($servicio, $idCarpetaIntento, 'Cargos');
    } else {
        $idCarpetaGuia = crearCarpetaSinoExiste($servicio, $idCarpetaIntento, 'Imágenes');
    }

    return $idCarpetaGuia;
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
    // Buscar archivos existentes con el mismo nombre en la carpeta
    $archivosExistentes = $service->files->listFiles(array(
        'q' => "name='{$nombreArchivo}' and '{$idCarpeta}' in parents and trashed=false",
        'fields' => 'files(id, name)'
    ))->getFiles();

    // Si existe un archivo con el mismo nombre, lo eliminamos
    if (count($archivosExistentes) > 0) {
        foreach ($archivosExistentes as $archivo) {
            $service->files->delete($archivo->getId());
        }
    }
}

function guardarImagen($imagen_guia, $id_num_guia, $cliente, $numeroImagen, $fechaCreado, $Intento)
{
    require_once('../../services/api_google_drive/api-google/vendor/autoload.php');
    putenv('GOOGLE_APPLICATION_CREDENTIALS=../../services/api_google_drive/bymavearchivos-f8c2d3d5790f.json');
    $idCarpetaPadre = obtenerVariableDelEntorno("ID_CARPETA_PADRE_DRIVE");
    $imagen_temporal = $imagen_guia['tmp_name'];
    $imagen = imagecreatefromstring(file_get_contents($imagen_temporal));
    $imagen_nueva = imagecreatetruecolor(500, 500);
    imagecopyresampled($imagen_nueva, $imagen, 0, 0, 0, 0, 500, 500, imagesx($imagen), imagesy($imagen));
    $ruta_imagen = $id_num_guia . '_' . $cliente . '.jpg';
    imagejpeg($imagen_nueva, $ruta_imagen, 100);
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->SetScopes(['https://www.googleapis.com/auth/drive.file']);
    $service = new Google_Service_Drive($client);
    $timestamp = strtotime($fechaCreado);
    $anioActual = date('Y', $timestamp);
    $mesActual = date('n', $timestamp);
    $IdCarpeta = crearEstructuraCarpetas($service, $idCarpetaPadre, $anioActual, $mesActual, $cliente, $Intento, 'Imagenes');
    $nombreArchivo = "$id_num_guia / $numeroImagen";
    reemplazarArchivoSiExiste($service, $IdCarpeta, $nombreArchivo);
    $file = new Google_Service_Drive_DriveFile();
    $file->setName($nombreArchivo); // Nombre del Archivo
    $file->setParents(array($IdCarpeta)); #Aca hay que cambiar el ID de la carpeta
    $file->setDescription("Imagen de guia cargada del Cliente : " . $cliente);
    $file->setMimeType('image/jpeg');
    $resultado = $service->files->create(
        $file,
        array(
            'data' => file_get_contents($ruta_imagen),
            'uploadType' => 'media'
        )
    );
    $ruta = 'https://drive.google.com/uc?id=' . $resultado->id;
    unlink($ruta_imagen);
    return $ruta;
}

function guardarIntento3($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();

    $cliente_db = $bd->prepare("SELECT c.razon_social_cliente FROM registros_cargas r
    INNER JOIN clientes c
    ON c.id = r.id_cliente_registro_carga WHERE id_num_guia_registro_carga = ?;");
    $cliente_db->execute([$data->id_num_guia_estado_guia]);
    $cliente = $cliente_db->fetch(PDO::FETCH_ASSOC)['razon_social_cliente'];

    $validacion_db = $bd->prepare("SELECT COUNT(*) as total FROM estados_guias WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 3'");
    $validacion_db->execute([$data->id_num_guia_estado_guia]);
    $validacion_db = $validacion_db->fetch(PDO::FETCH_ASSOC);
    if ($validacion_db['total'] > 0) {
        $sql = "UPDATE estados_guias SET proceso_estado_guia = ?, estado_mercancia_estado_guia = ?, fecha_proceso_estado_guia = ?, comentario_estado_guia = ?";
        $params = [
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
        ];

        // Verificar cada imagen antes de agregarla a la consulta
        if (!empty($data->imagen_1_estado_guia)) {
            $sql .= ", imagen_1_estado_guia = ?";
            $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
            $params[] = $imagen1;
        }

        if (!empty($data->imagen_2_estado_guia)) {
            $sql .= ", imagen_2_estado_guia = ?";
            $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
            $params[] = $imagen2;
        }

        if (!empty($data->imagen_3_estado_guia)) {
            $sql .= ", imagen_3_estado_guia = ?";
            $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
            $params[] = $imagen3;
        }

        if (!empty($data->imagen_4_estado_guia)) {
            $sql .= ", imagen_4_estado_guia = ?";
            $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;
            $params[] = $imagen4;
        }

        if (!empty($data->imagen_5_estado_guia)) {
            $sql .= ", imagen_5_estado_guia = ?";
            $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;
            $params[] = $imagen5;
        }

        if (!empty($data->imagen_6_estado_guia)) {
            $sql .= ", imagen_6_estado_guia = ?";
            $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;
            $params[] = $imagen6;
        }

        $sql .= " WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 3'";
        $params[] = $data->id_num_guia_estado_guia;
        $sentencia = $bd->prepare($sql);

        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se actualizó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar el estado!', 'datos' => $data];
        }
    } else {
        $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
        $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
        $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, 'Tercer Intento') : null;
        $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, 4, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;
        $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, 5, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;
        $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, 6, $data->fecha_proceso_estado_guia, "Tercer Intento") : null;

        $sql = "INSERT INTO estados_guias (id_num_guia_estado_guia, num_intento_estado_guia, proceso_estado_guia, estado_mercancia_estado_guia, fecha_proceso_estado_guia, comentario_estado_guia, imagen_1_estado_guia, imagen_2_estado_guia, imagen_3_estado_guia, imagen_4_estado_guia, imagen_5_estado_guia, imagen_6_estado_guia, id_creador_estado_guia, fecha_creado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data->id_num_guia_estado_guia,
            $data->num_intento_estado_guia,
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
            $imagen1,
            $imagen2,
            $imagen3,
            $imagen4,
            $imagen5,
            $imagen6,
            $data->id_creador_estado_guia,
            $fecha_actual
        ];
        $sentencia = $bd->prepare($sql);
        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se guardó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar el estado!', 'datos' => $data];
        }
    }
}

function guardarIntento2($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();

    $cliente_db = $bd->prepare("SELECT c.razon_social_cliente FROM registros_cargas r
    INNER JOIN clientes c
    ON c.id = r.id_cliente_registro_carga WHERE id_num_guia_registro_carga = ?;");
    $cliente_db->execute([$data->id_num_guia_estado_guia]);
    $cliente = $cliente_db->fetch(PDO::FETCH_ASSOC)['razon_social_cliente'];

    $validacion_db = $bd->prepare("SELECT COUNT(*) as total FROM estados_guias WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 2'");
    $validacion_db->execute([$data->id_num_guia_estado_guia]);
    $validacion_db = $validacion_db->fetch(PDO::FETCH_ASSOC);
    if ($validacion_db['total'] > 0) {
        $sql = "UPDATE estados_guias SET proceso_estado_guia = ?, estado_mercancia_estado_guia = ?, fecha_proceso_estado_guia = ?, comentario_estado_guia = ?";
        $params = [
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
        ];

        // Verificar cada imagen antes de agregarla a la consulta
        if (!empty($data->imagen_1_estado_guia)) {
            $sql .= ", imagen_1_estado_guia = ?";
            $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen1;
        }

        if (!empty($data->imagen_2_estado_guia)) {
            $sql .= ", imagen_2_estado_guia = ?";
            $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen2;
        }

        if (!empty($data->imagen_3_estado_guia)) {
            $sql .= ", imagen_3_estado_guia = ?";
            $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen3;
        }

        if (!empty($data->imagen_4_estado_guia)) {
            $sql .= ", imagen_4_estado_guia = ?";
            $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen4;
        }

        if (!empty($data->imagen_5_estado_guia)) {
            $sql .= ", imagen_5_estado_guia = ?";
            $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen5;
        }

        if (!empty($data->imagen_6_estado_guia)) {
            $sql .= ", imagen_6_estado_guia = ?";
            $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
            $params[] = $imagen6;
        }

        $sql .= " WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 2'";
        $params[] = $data->id_num_guia_estado_guia;
        $sentencia = $bd->prepare($sql);

        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se actualizó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar el estado!', 'datos' => $data];
        }
    } else {
        $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
        $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
        $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
        $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, 4, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
        $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, 5, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;
        $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, 6, $data->fecha_proceso_estado_guia, "Segundo Intento") : null;

        $sql = "INSERT INTO estados_guias (id_num_guia_estado_guia, num_intento_estado_guia, proceso_estado_guia, estado_mercancia_estado_guia, fecha_proceso_estado_guia, comentario_estado_guia, imagen_1_estado_guia, imagen_2_estado_guia, imagen_3_estado_guia, imagen_4_estado_guia, imagen_5_estado_guia, imagen_6_estado_guia, id_creador_estado_guia, fecha_creado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data->id_num_guia_estado_guia,
            $data->num_intento_estado_guia,
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
            $imagen1,
            $imagen2,
            $imagen3,
            $imagen4,
            $imagen5,
            $imagen6,
            $data->id_creador_estado_guia,
            $fecha_actual
        ];
        $sentencia = $bd->prepare($sql);
        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se guardó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar el estado!', 'datos' => $data];
        }
    }
}

function guardarIntento1($data)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();

    $cliente_db = $bd->prepare("SELECT c.razon_social_cliente FROM registros_cargas r
    INNER JOIN clientes c
    ON c.id = r.id_cliente_registro_carga WHERE id_num_guia_registro_carga = ?;");
    $cliente_db->execute([$data->id_num_guia_estado_guia]);
    $cliente = $cliente_db->fetch(PDO::FETCH_ASSOC)['razon_social_cliente'];

    $validacion_db = $bd->prepare("SELECT COUNT(*) as total FROM estados_guias WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 1'");
    $validacion_db->execute([$data->id_num_guia_estado_guia]);
    $validacion_db = $validacion_db->fetch(PDO::FETCH_ASSOC);
    if ($validacion_db['total'] > 0) {
        $sql = "UPDATE estados_guias SET proceso_estado_guia = ?, estado_mercancia_estado_guia = ?, fecha_proceso_estado_guia = ?, comentario_estado_guia = ?";
        $params = [
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
        ];

        // Verificar cada imagen antes de agregarla a la consulta
        if (!empty($data->imagen_1_estado_guia)) {
            $sql .= ", imagen_1_estado_guia = ?";
            $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen1;
        }

        if (!empty($data->imagen_2_estado_guia)) {
            $sql .= ", imagen_2_estado_guia = ?";
            $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen2;
        }

        if (!empty($data->imagen_3_estado_guia)) {
            $sql .= ", imagen_3_estado_guia = ?";
            $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen3;
        }

        if (!empty($data->imagen_4_estado_guia)) {
            $sql .= ", imagen_4_estado_guia = ?";
            $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen4;
        }

        if (!empty($data->imagen_5_estado_guia)) {
            $sql .= ", imagen_5_estado_guia = ?";
            $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen5;
        }

        if (!empty($data->imagen_6_estado_guia)) {
            $sql .= ", imagen_6_estado_guia = ?";
            $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
            $params[] = $imagen6;
        }

        $sql .= " WHERE id_num_guia_estado_guia = ? AND num_intento_estado_guia = 'intento 1'";
        $params[] = $data->id_num_guia_estado_guia;
        $sentencia = $bd->prepare($sql);

        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se actualizó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo actualizar el estado!', 'datos' => $data];
        }
    } else {
        $imagen1 = !empty($data->imagen_1_estado_guia) ? guardarImagen($data->imagen_1_estado_guia, $data->id_num_guia_estado_guia, $cliente, 1, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
        $imagen2 = !empty($data->imagen_2_estado_guia) ? guardarImagen($data->imagen_2_estado_guia, $data->id_num_guia_estado_guia, $cliente, 2, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
        $imagen3 = !empty($data->imagen_3_estado_guia) ? guardarImagen($data->imagen_3_estado_guia, $data->id_num_guia_estado_guia, $cliente, 3, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
        $imagen4 = !empty($data->imagen_4_estado_guia) ? guardarPDFDrive($data->imagen_4_estado_guia, "$data->id_num_guia_estado_guia / Global", $cliente, 4, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
        $imagen5 = !empty($data->imagen_5_estado_guia) ? guardarPDFDrive($data->imagen_5_estado_guia, "$data->id_num_guia_estado_guia / Remitente", $cliente, 5, $data->fecha_proceso_estado_guia, "Primer Intento") : null;
        $imagen6 = !empty($data->imagen_6_estado_guia) ? guardarPDFDrive($data->imagen_6_estado_guia, "$data->id_num_guia_estado_guia / Factura", $cliente, 6, $data->fecha_proceso_estado_guia, "Primer Intento") : null;

        $sql = "INSERT INTO estados_guias (id_num_guia_estado_guia, num_intento_estado_guia, proceso_estado_guia, estado_mercancia_estado_guia, fecha_proceso_estado_guia, comentario_estado_guia, imagen_1_estado_guia, imagen_2_estado_guia, imagen_3_estado_guia, imagen_4_estado_guia, imagen_5_estado_guia, imagen_6_estado_guia, id_creador_estado_guia, fecha_creado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data->id_num_guia_estado_guia,
            $data->num_intento_estado_guia,
            $data->proceso_estado_guia,
            $data->estado_mercancia_estado_guia,
            $data->fecha_proceso_estado_guia,
            $data->comentario_estado_guia,
            $imagen1,
            $imagen2,
            $imagen3,
            $imagen4,
            $imagen5,
            $imagen6,
            $data->id_creador_estado_guia,
            $fecha_actual
        ];
        $sentencia = $bd->prepare($sql);
        if ($sentencia->execute($params)) {
            return ['success' => true, 'message' => 'Se guardó correctamente el estado', 'datos' => $data];
        } else {
            return ['success' => false, 'message' => 'Error: ¡No se pudo insertar el estado!', 'datos' => $data];
        }
    }
}

function obtenerIntento3($id_registro_carga)
{
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT * FROM estados_guias WHERE id_num_guia_estado_guia = :id_registro_carga AND num_intento_estado_guia = 'intento 3' ORDER BY num_intento_estado_guia DESC
        LIMIT 1"
    );
    $recojo->bindParam(':id_registro_carga', $id_registro_carga);
    $recojo->execute();
    $result = $recojo->fetch(PDO::FETCH_ASSOC);
    return $result;
}
function obtenerIntento2($id_registro_carga)
{
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT * FROM estados_guias WHERE id_num_guia_estado_guia = :id_registro_carga AND num_intento_estado_guia = 'intento 2' ORDER BY num_intento_estado_guia DESC
        LIMIT 1"
    );
    $recojo->bindParam(':id_registro_carga', $id_registro_carga);
    $recojo->execute();
    $result = $recojo->fetch(PDO::FETCH_ASSOC);
    return $result;
}
function obtenerIntento1($id_registro_carga)
{
    $bd = obtenerConexion();
    $recojo = $bd->prepare(
        "SELECT * FROM estados_guias WHERE id_num_guia_estado_guia = :id_registro_carga AND num_intento_estado_guia = 'intento 1' ORDER BY num_intento_estado_guia DESC
        LIMIT 1"
    );
    $recojo->bindParam(':id_registro_carga', $id_registro_carga);
    $recojo->execute();
    $result = $recojo->fetch(PDO::FETCH_ASSOC);
    return $result;
}

function obtenerGuias()
{
    $bd = obtenerConexion();
    $stmt = $bd->query("SELECT * FROM despachos_envios WHERE id_num_manifiesto_despacho_envio != '0' ORDER BY id DESC;");
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
