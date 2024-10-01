<?php

function exportarCarga($id_transportista)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_maximo_tarifario_transportista_carga as 'KG Maximo',
    t.kg_base_adicional_tarifario_transportista_carga as 'KG Base',
    t.paquete_tarifario_transportista_carga as 'Paquete',
    t.tmin_tarifario_transportista_carga as 'T.Min Entrega',
    t.tmax_tarifario_transportista_carga as 'T.Max Entrega'
    FROM
    tarifarios_transportistas_cargas t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_transportista_carga = u.UBIGEO
    INNER JOIN
    proveedores prov ON t.id_transportista_tarifario_transportista_carga = prov.id
    WHERE id_transportista_tarifario_transportista_carga = :id_transportista_tarifario_transportista_carga
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_transportista_tarifario_transportista_carga', $id_transportista);
    $consulta->execute();
    $tarifa_carga_transportista = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_carga_transportista;
}

function exportarCourrier($id_transportista)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_tarifario_transportista_courrier as 'KG',
    t.kg_adicional_tarifario_transportista_courrier as 'KG Adicional',
    t.tmin_tarifario_transportista_courrier as 'T.Min Entrega',
    t.tmax_tarifario_transportista_courrier as 'T.Max Entrega'
    FROM
    tarifarios_transportistas_courriers t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_transportista_courrier = u.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_transportista_tarifario_transportista_courrier = prov.id
    WHERE id_transportista_tarifario_transportista_courrier = :id_transportista_tarifario_transportista_courrier
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_transportista_tarifario_transportista_courrier', $id_transportista);
    $consulta->execute();
    $tarifa_courrier_transportista = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_transportista;
}

function verificarUbigeo($departamento, $provincia, $distrito, $bd)
{
    $consulta = $bd->prepare("SELECT COUNT(*) FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
    $consulta->bindParam(':departamento', $departamento);
    $consulta->bindParam(':provincia', $provincia);
    $consulta->bindParam(':distrito', $distrito);

    $consulta->execute();

    return $consulta->fetchColumn() > 0;
}

function guardarCarga($id_transportista, $datos, $id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (is_array($datos) && count($datos) > 0) {
        if (count($datos) > 0) {
            $uniqueLocations = [];
            foreach ($datos as $fila => $dato) {
                $ubicacion = $dato['Departamento'] . '-' . $dato['Provincia'] . '-' . $dato['Distrito'];

                if (in_array($ubicacion, $uniqueLocations)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo se repite en la fila - ' . ($fila + 2) . '.'];
                } else {
                    $uniqueLocations[] = $ubicacion;
                }

                if (!verificarUbigeo($dato['Departamento'], $dato['Provincia'], $dato['Distrito'], $bd)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo en la fila ' . ($fila + 2) . ' No Existe.'];
                }

                if (!is_numeric($dato['KG Maximo']) || !is_numeric($dato['KG Base']) || !is_numeric($dato['Paquete']) || !is_numeric($dato['T.Max Entrega']) || !is_numeric($dato['T.Min Entrega'])) {
                    return ['success' => false, 'message' => 'Error: El valor tiene que ser númerico en la fila ' . ($fila + 2) . '.'];
                }
            }
        }

        // Eliminar todos los registros del tarifario
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_transportistas_cargas WHERE id_transportista_tarifario_transportista_carga = :id_transportista");
        $stmtDelete->bindParam(':id_transportista', $id_transportista);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_transportistas_cargas (id_transportista_tarifario_transportista_carga, ubigeo_tarifario_transportista_carga, kg_maximo_tarifario_transportista_carga, kg_base_adicional_tarifario_transportista_carga, paquete_tarifario_transportista_carga, tmin_tarifario_transportista_carga, tmax_tarifario_transportista_carga, id_creador_tarifario_transportista_carga, fecha_creado) VALUES (:id_transportista, :ubigeo, :kg_maximo, :kg_base, :paquete, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_transportista', $id_transportista);
            $stmt->bindParam(':ubigeo', $codigoUbigeo);
            $stmt->bindParam(':kg_maximo', $dato['KG Maximo']);
            $stmt->bindParam(':kg_base', $dato['KG Base']);
            $stmt->bindParam(':paquete', $dato['Paquete']);
            $stmt->bindParam(':tmin', $dato['T.Min Entrega']);
            $stmt->bindParam(':tmax', $dato['T.Max Entrega']);
            $stmt->bindParam(':id_creador', $id_usuario);
            $stmt->bindParam(':fecha_actual', $fecha_actual);
            $stmt->execute();
        }

        return ['success' => true, 'message' => 'Carga guardado correctamente.'];
    } else {
        return ['success' => false, 'message' => 'Debe tener al menos 1 registro para guardar.'];
    }
}

function guardarCourrier($id_transportista, $datos, $id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (is_array($datos) && count($datos) > 0) {
        if (count($datos) > 0) {
            $uniqueLocations = [];
            foreach ($datos as $fila => $dato) {
                $ubicacion = $dato['Departamento'] . '-' . $dato['Provincia'] . '-' . $dato['Distrito'];

                if (in_array($ubicacion, $uniqueLocations)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo se repite en la fila - ' . ($fila + 2) . '.'];
                } else {
                    $uniqueLocations[] = $ubicacion;
                }

                if (!verificarUbigeo($dato['Departamento'], $dato['Provincia'], $dato['Distrito'], $bd)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo en la fila ' . ($fila + 2) . ' No Existe.'];
                }

                if (!is_numeric($dato['KG']) || !is_numeric($dato['KG Adicional']) || !is_numeric($dato['T.Max Entrega']) || !is_numeric($dato['T.Min Entrega'])) {
                    return ['success' => false, 'message' => 'Error: El valor tiene que ser númerico en la fila ' . ($fila + 2) . '.'];
                }
            }
        }

        // Eliminar todos los registros del tarifario
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_transportistas_courriers WHERE id_transportista_tarifario_transportista_courrier = :id_transportista");
        $stmtDelete->bindParam(':id_transportista', $id_transportista);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_transportistas_courriers (id_transportista_tarifario_transportista_courrier, ubigeo_tarifario_transportista_courrier, kg_tarifario_transportista_courrier, kg_adicional_tarifario_transportista_courrier, tmin_tarifario_transportista_courrier, tmax_tarifario_transportista_courrier, id_creador_tarifario_transportista_courrier, fecha_creado) VALUES (:id_transportista, :ubigeo, :kg, :kg_adicional, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_transportista', $id_transportista);
            $stmt->bindParam(':ubigeo', $codigoUbigeo);
            $stmt->bindParam(':kg', $dato['KG']);
            $stmt->bindParam(':kg_adicional', $dato['KG Adicional']);
            $stmt->bindParam(':tmin', $dato['T.Min Entrega']);
            $stmt->bindParam(':tmax', $dato['T.Max Entrega']);
            $stmt->bindParam(':id_creador', $id_usuario);
            $stmt->bindParam(':fecha_actual', $fecha_actual);
            $stmt->execute();
        }

        return ['success' => true, 'message' => 'Courrier guardado correctamente.'];
    } else {
        return ['success' => false, 'message' => 'Debe tener al menos 1 registro para guardar.'];
    }
}

function obtenerTarifarioCargaTransportista($id_transportista)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
	t.id_transportista_tarifario_transportista_carga,
    prov.razon_social_proveedor,
    t.ubigeo_tarifario_transportista_carga,
    ub.UBIGEO as 'ubigeo',
	ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
	t.kg_maximo_tarifario_transportista_carga,
    t.kg_base_adicional_tarifario_transportista_carga,
	t.paquete_tarifario_transportista_carga,
    t.tmin_tarifario_transportista_carga,
    t.tmax_tarifario_transportista_carga,
    t.id_creador_tarifario_transportista_carga,
    t.fecha_creado
    FROM tarifarios_transportistas_cargas t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_transportista_carga = ub.UBIGEO
	INNER JOIN 
    proveedores prov ON t.id_transportista_tarifario_transportista_carga = prov.id
    WHERE id_transportista_tarifario_transportista_carga = :id_transportista_tarifario_transportista_carga
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_transportista_tarifario_transportista_carga', $id_transportista);
    $consulta->execute();
    $tarifa_carga_transportista = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_carga_transportista;
}


function obtenerTarifarioCourrierTransportista($id_transportista)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
    t.id_transportista_tarifario_transportista_courrier,
    prov.razon_social_proveedor,
    t.ubigeo_tarifario_transportista_courrier,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
    t.kg_tarifario_transportista_courrier,
    t.kg_adicional_tarifario_transportista_courrier,
    t.tmin_tarifario_transportista_courrier,
    t.tmax_tarifario_transportista_courrier,
    t.id_creador_tarifario_transportista_courrier,
    t.fecha_creado
    FROM tarifarios_transportistas_courriers t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_transportista_courrier = ub.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_transportista_tarifario_transportista_courrier = prov.id
    WHERE id_transportista_tarifario_transportista_courrier = :id_transportista_tarifario_transportista_courrier
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_transportista_tarifario_transportista_courrier', $id_transportista);
    $consulta->execute();
    $tarifa_courrier_transportista = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_transportista;
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
