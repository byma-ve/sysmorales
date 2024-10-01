<?php

function exportarAereo($id_agente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_tarifario_agente_aereo as 'KG',
    t.kg_adicional_tarifario_agente_aereo as 'KG Adicional',
    t.tmin_tarifario_agente_aereo as 'T.Min Entrega',
    t.tmax_tarifario_agente_aereo as 'T.Max Entrega'
    FROM
    tarifarios_agentes_aereos t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_agente_aereo = u.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_agente_tarifario_agente_aereo = prov.id
    WHERE id_agente_tarifario_agente_aereo = :id_agente_tarifario_agente_aereo
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_agente_tarifario_agente_aereo', $id_agente);
    $consulta->execute();
    $tarifa_aereo_agente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_aereo_agente;
}


function exportarCourrier($id_agente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_tarifario_agente_courrier as 'KG',
    t.kg_adicional_tarifario_agente_courrier as 'KG Adicional',
    t.tmin_tarifario_agente_courrier as 'T.Min Entrega',
    t.tmax_tarifario_agente_courrier as 'T.Max Entrega'
    FROM
    tarifarios_agentes_courriers t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_agente_courrier = u.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_agente_tarifario_agente_courrier = prov.id
    WHERE id_agente_tarifario_agente_courrier = :id_agente_tarifario_agente_courrier
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_agente_tarifario_agente_courrier', $id_agente);
    $consulta->execute();
    $tarifa_courrier_agente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_agente;
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

function guardarAereo($id_agente, $datos, $id_usuario)
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
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_agentes_aereos WHERE id_agente_tarifario_agente_aereo = :id_agente");
        $stmtDelete->bindParam(':id_agente', $id_agente);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_agentes_aereos (id_agente_tarifario_agente_aereo, ubigeo_tarifario_agente_aereo, kg_tarifario_agente_aereo, kg_adicional_tarifario_agente_aereo, tmin_tarifario_agente_aereo, tmax_tarifario_agente_aereo, id_creador_tarifario_agente_aereo, fecha_creado) VALUES (:id_agente, :ubigeo, :kg, :kg_adicional, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_agente', $id_agente);
            $stmt->bindParam(':ubigeo', $codigoUbigeo);
            $stmt->bindParam(':kg', $dato['KG']);
            $stmt->bindParam(':kg_adicional', $dato['KG Adicional']);
            $stmt->bindParam(':tmin', $dato['T.Min Entrega']);
            $stmt->bindParam(':tmax', $dato['T.Max Entrega']);
            $stmt->bindParam(':id_creador', $id_usuario);
            $stmt->bindParam(':fecha_actual', $fecha_actual);
            $stmt->execute();
        }

        return ['success' => true, 'message' => 'Aereo guardado correctamente.'];
    } else {
        return ['success' => false, 'message' => 'Debe tener al menos 1 registro para guardar.'];
    }
}

function guardarCourrier($id_agente, $datos, $id_usuario)
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
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_agentes_courriers WHERE id_agente_tarifario_agente_courrier = :id_agente");
        $stmtDelete->bindParam(':id_agente', $id_agente);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_agentes_courriers (id_agente_tarifario_agente_courrier, ubigeo_tarifario_agente_courrier, kg_tarifario_agente_courrier, kg_adicional_tarifario_agente_courrier, tmin_tarifario_agente_courrier, tmax_tarifario_agente_courrier, id_creador_tarifario_agente_courrier, fecha_creado) VALUES (:id_agente, :ubigeo, :kg, :kg_adicional, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_agente', $id_agente);
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

function obtenerTarifarioAereoAgente($id_agente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
    t.id_agente_tarifario_agente_aereo,
    prov.razon_social_proveedor,
    t.ubigeo_tarifario_agente_aereo,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
    t.kg_tarifario_agente_aereo,
    t.kg_adicional_tarifario_agente_aereo,
    t.tmin_tarifario_agente_aereo,
    t.tmax_tarifario_agente_aereo,
    t.id_creador_tarifario_agente_aereo,
    t.fecha_creado
    FROM tarifarios_agentes_aereos t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_agente_aereo = ub.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_agente_tarifario_agente_aereo = prov.id
    WHERE id_agente_tarifario_agente_aereo = :id_agente_tarifario_agente_aereo
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_agente_tarifario_agente_aereo', $id_agente);
    $consulta->execute();
    $tarifa_aereo_agente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_aereo_agente;
}

function obtenerTarifarioCourrierAgente($id_agente)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
    t.id_agente_tarifario_agente_courrier,
    prov.razon_social_proveedor,
    t.ubigeo_tarifario_agente_courrier,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
    t.kg_tarifario_agente_courrier,
    t.kg_adicional_tarifario_agente_courrier,
    t.tmin_tarifario_agente_courrier,
    t.tmax_tarifario_agente_courrier,
    t.id_creador_tarifario_agente_courrier,
    t.fecha_creado
    FROM tarifarios_agentes_courriers t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_agente_courrier = ub.UBIGEO
    INNER JOIN 
    proveedores prov ON t.id_agente_tarifario_agente_courrier = prov.id
    WHERE id_agente_tarifario_agente_courrier = :id_agente_tarifario_agente_courrier
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_agente_tarifario_agente_courrier', $id_agente);
    $consulta->execute();
    $tarifa_courrier_agente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_agente;
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
