<?php

function exportarCarga($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_maximo_tarifario_cliente_carga as 'KG Maximo',
    t.kg_base_adicional_tarifario_cliente_carga as 'KG Base',
    t.paquete_tarifario_cliente_carga as 'Paquete',
    t.tmin_tarifario_cliente_carga as 'T.Min Entrega',
    t.tmax_tarifario_cliente_carga as 'T.Max Entrega'
    FROM
    tarifarios_clientes_cargas t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_cliente_carga = u.UBIGEO
    INNER JOIN
    areas ar ON t.id_area_tarifario_cliente_carga = ar.id
    INNER JOIN
    clientes cli ON t.id_cliente_tarifario_cliente_carga = cli.id 
    WHERE id_cliente_tarifario_cliente_carga = :id_cliente_tarifario_cliente_carga AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_carga', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_carga_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_carga_cliente;
}

function exportarValorizado($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.producto_tarifario_cliente_valorizado as 'Producto',
    t.costo_producto_tarifario_cliente_valorizado as 'S/ Producto',
    t.tmin_tarifario_cliente_valorizado as 'T.Min Entrega',
    t.tmax_tarifario_cliente_valorizado as 'T.Max Entrega'
    FROM
    tarifarios_clientes_valorizados t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_cliente_valorizado = u.UBIGEO
    INNER JOIN
    areas ar ON t.id_area_tarifario_cliente_valorizado = ar.id
    INNER JOIN
    clientes cli ON t.id_cliente_tarifario_cliente_valorizado = cli.id
    WHERE id_cliente_tarifario_cliente_valorizado = :id_cliente_tarifario_cliente_valorizado AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_valorizado', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_valorizado_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_valorizado_cliente;
}

function exportarAereo($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_tarifario_cliente_aereo as 'KG',
    t.kg_adicional_tarifario_cliente_aereo as 'KG Adicional',
    t.tmin_tarifario_cliente_aereo as 'T.Min Entrega',
    t.tmax_tarifario_cliente_aereo as 'T.Max Entrega'
    FROM
    tarifarios_clientes_aereos t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_cliente_aereo = u.UBIGEO
    INNER JOIN
    areas ar ON t.id_area_tarifario_cliente_aereo = ar.id
    INNER JOIN
    clientes cli ON t.id_cliente_tarifario_cliente_aereo = cli.id
    WHERE id_cliente_tarifario_cliente_aereo = :id_cliente_tarifario_cliente_aereo AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_aereo', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_aereo_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_aereo_cliente;
}


function exportarCourrier($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT
    u.DEPARTAMENTO as 'Departamento',
    u.PROVINCIA as 'Provincia',
    u.DESTINO as 'Distrito',
    t.kg_tarifario_cliente_courrier as 'KG',
    t.kg_adicional_tarifario_cliente_courrier as 'KG Adicional',
    t.tmin_tarifario_cliente_courrier as 'T.Min Entrega',
    t.tmax_tarifario_cliente_courrier as 'T.Max Entrega'
    FROM
    tarifarios_clientes_courriers t
    INNER JOIN
    ubigeo u ON t.ubigeo_tarifario_cliente_courrier = u.UBIGEO
    INNER JOIN
    areas ar ON t.id_area_tarifario_cliente_courrier = ar.id
    INNER JOIN
    clientes cli ON t.id_cliente_tarifario_cliente_courrier = cli.id
    WHERE id_cliente_tarifario_cliente_courrier = :id_cliente_tarifario_cliente_courrier AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_courrier', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_courrier_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_cliente;
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

function guardarCarga($id_cliente, $id_area, $datos, $id_usuario)
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
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_clientes_cargas WHERE id_cliente_tarifario_cliente_carga = :id_cliente AND id_area_tarifario_cliente_carga = :id_area");
        $stmtDelete->bindParam(':id_cliente', $id_cliente);
        $stmtDelete->bindParam(':id_area', $id_area);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_clientes_cargas (id_cliente_tarifario_cliente_carga, id_area_tarifario_cliente_carga, ubigeo_tarifario_cliente_carga, kg_maximo_tarifario_cliente_carga, kg_base_adicional_tarifario_cliente_carga, paquete_tarifario_cliente_carga, tmin_tarifario_cliente_carga, tmax_tarifario_cliente_carga, id_creador_tarifario_cliente_carga, fecha_creado) VALUES (:id_cliente, :id_area, :ubigeo, :kg_maximo, :kg_base, :paquete, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':id_area', $id_area);
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

function guardarValorizado($id_cliente, $id_area, $datos, $id_usuario)
{
    date_default_timezone_set('America/Lima');
    $fecha_actual = date("Y-m-d");
    $bd = obtenerConexion();
    if (is_array($datos) && count($datos) > 0) {
        if (count($datos) > 0) {
            $uniqueLocations = [];
            foreach ($datos as $fila => $dato) {
                $ubicacion = $dato['Departamento'] . '-' . $dato['Provincia'] . '-' . $dato['Distrito'] . '-' . $dato['Producto'];

                if (in_array($ubicacion, $uniqueLocations)) {
                    return ['success' => false, 'message' => 'Error: El Producto se repite en la fila - ' . ($fila + 2) . '.'];
                } else {
                    $uniqueLocations[] = $ubicacion;
                }

                if (!verificarUbigeo($dato['Departamento'], $dato['Provincia'], $dato['Distrito'], $bd)) {
                    return ['success' => false, 'message' => 'Error: El Ubigeo en la fila ' . ($fila + 2) . ' No Existe.'];
                }

                if (!is_numeric($dato['S/ Producto']) || !is_numeric($dato['T.Max Entrega']) || !is_numeric($dato['T.Min Entrega'])) {
                    return ['success' => false, 'message' => 'Error: El valor tiene que ser númerico en la fila ' . ($fila + 2) . '.'];
                }
            }
        }

        // Eliminar todos los registros del tarifario
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_clientes_valorizados WHERE id_cliente_tarifario_cliente_valorizado = :id_cliente AND id_area_tarifario_cliente_valorizado = :id_area");
        $stmtDelete->bindParam(':id_cliente', $id_cliente);
        $stmtDelete->bindParam(':id_area', $id_area);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_clientes_valorizados (id_cliente_tarifario_cliente_valorizado, id_area_tarifario_cliente_valorizado, ubigeo_tarifario_cliente_valorizado, producto_tarifario_cliente_valorizado, costo_producto_tarifario_cliente_valorizado, tmin_tarifario_cliente_valorizado, tmax_tarifario_cliente_valorizado, id_creador_tarifario_cliente_valorizado, fecha_creado) VALUES (:id_cliente, :id_area, :ubigeo, UPPER(:producto), :costo_producto, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':id_area', $id_area);
            $stmt->bindParam(':ubigeo', $codigoUbigeo);
            $stmt->bindParam(':producto', $dato['Producto']);
            $stmt->bindParam(':costo_producto', $dato['S/ Producto']);
            $stmt->bindParam(':tmin', $dato['T.Min Entrega']);
            $stmt->bindParam(':tmax', $dato['T.Max Entrega']);
            $stmt->bindParam(':id_creador', $id_usuario);
            $stmt->bindParam(':fecha_actual', $fecha_actual);
            $stmt->execute();
        }

        return ['success' => true, 'message' => 'Valorizado guardado correctamente.'];
    } else {
        return ['success' => false, 'message' => 'Debe tener al menos 1 registro para guardar.'];
    }
}

function guardarAereo($id_cliente, $id_area, $datos, $id_usuario)
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
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_clientes_aereos WHERE id_cliente_tarifario_cliente_aereo = :id_cliente AND id_area_tarifario_cliente_aereo = :id_area");
        $stmtDelete->bindParam(':id_cliente', $id_cliente);
        $stmtDelete->bindParam(':id_area', $id_area);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_clientes_aereos (id_cliente_tarifario_cliente_aereo, id_area_tarifario_cliente_aereo, ubigeo_tarifario_cliente_aereo, kg_tarifario_cliente_aereo, kg_adicional_tarifario_cliente_aereo, tmin_tarifario_cliente_aereo, tmax_tarifario_cliente_aereo, id_creador_tarifario_cliente_aereo, fecha_creado) VALUES (:id_cliente, :id_area, :ubigeo, :kg, :kg_adicional, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':id_area', $id_area);
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

function guardarCourrier($id_cliente, $id_area, $datos, $id_usuario)
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
        $stmtDelete = $bd->prepare("DELETE FROM tarifarios_clientes_courriers WHERE id_cliente_tarifario_cliente_courrier = :id_cliente AND id_area_tarifario_cliente_courrier = :id_area");
        $stmtDelete->bindParam(':id_cliente', $id_cliente);
        $stmtDelete->bindParam(':id_area', $id_area);
        $stmtDelete->execute();

        // Insertar los datos validados en el tarifario
        foreach ($datos as $dato) {
            $stmtUbigeo = $bd->prepare("SELECT UBIGEO FROM ubigeo WHERE DEPARTAMENTO = :departamento AND PROVINCIA = :provincia AND DESTINO = :distrito");
            $stmtUbigeo->bindParam(':departamento', $dato['Departamento']);
            $stmtUbigeo->bindParam(':provincia', $dato['Provincia']);
            $stmtUbigeo->bindParam(':distrito', $dato['Distrito']);
            $stmtUbigeo->execute();

            $codigoUbigeo = $stmtUbigeo->fetchColumn();

            $stmt = $bd->prepare("INSERT INTO tarifarios_clientes_courriers (id_cliente_tarifario_cliente_courrier, id_area_tarifario_cliente_courrier, ubigeo_tarifario_cliente_courrier, kg_tarifario_cliente_courrier, kg_adicional_tarifario_cliente_courrier, tmin_tarifario_cliente_courrier, tmax_tarifario_cliente_courrier, id_creador_tarifario_cliente_courrier, fecha_creado) VALUES (:id_cliente, :id_area, :ubigeo, :kg, :kg_adicional, :tmin, :tmax, :id_creador, :fecha_actual)");
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':id_area', $id_area);
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


function obtenerTarifarioUbigeo($id_cliente, $id_area, $ubigeo, $tarifario)
{
    $bd = obtenerConexion();
    if ($tarifario == 'Courrier') {
        $consulta = $bd->prepare("SELECT
    tcc.tmin_tarifario_cliente_courrier AS 'tmin',
    tcc.tmax_tarifario_cliente_courrier AS 'tmax'
        FROM
    tarifarios_clientes_courriers tcc
        INNER JOIN
    clientes c ON tcc.id_cliente_tarifario_cliente_courrier = c.id
        WHERE
    tcc.ubigeo_tarifario_cliente_courrier = :ubigeo
        AND tcc.id_cliente_tarifario_cliente_courrier = :id_cliente
        AND tcc.id_area_tarifario_cliente_courrier = :id_area
        ORDER BY tcc.id DESC;
        ");
    } else if ($tarifario == 'Aerea') {
        $consulta = $bd->prepare("SELECT
        tcc.tmin_tarifario_cliente_aereo AS 'tmin',
        tcc.tmax_tarifario_cliente_aereo AS 'tmax'
            FROM
        tarifarios_clientes_aereos tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_aereo = c.id
            WHERE
        tcc.ubigeo_tarifario_cliente_aereo = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_aereo = :id_cliente
            AND tcc.id_area_tarifario_cliente_aereo = :id_area
            ORDER BY tcc.id DESC;
            ");
    } else if ($tarifario == 'Carga') {
        $consulta = $bd->prepare("SELECT
        tcc.tmin_tarifario_cliente_carga AS 'tmin',
        tcc.tmax_tarifario_cliente_carga AS 'tmax'
            FROM
        tarifarios_clientes_cargas tcc
            INNER JOIN
        clientes c ON tcc.id_cliente_tarifario_cliente_carga = c.id
            WHERE
        tcc.ubigeo_tarifario_cliente_carga = :ubigeo
            AND tcc.id_cliente_tarifario_cliente_carga = :id_cliente
            AND tcc.id_area_tarifario_cliente_carga = :id_area
            ORDER BY tcc.id DESC;
        ");
    } else if ($tarifario == 'Valorizada') {
        $consulta = $bd->prepare("SELECT
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
            AND tcc.id_area_tarifario_cliente_valorizado = :id_area
            ORDER BY tcc.id DESC;
        ");
    }
    $consulta->bindParam(':ubigeo', $ubigeo);
    $consulta->bindParam(':id_cliente', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);

    return $tarifa_cliente;
}

function obtenerTarifarioCargaCliente($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
	t.id_cliente_tarifario_cliente_carga,
    cli.razon_social_cliente,
	t.id_area_tarifario_cliente_carga,
	ar.nombre_area,
    t.ubigeo_tarifario_cliente_carga,
    ub.UBIGEO as 'ubigeo',
	ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
	t.kg_maximo_tarifario_cliente_carga,
    t.kg_base_adicional_tarifario_cliente_carga,
	t.paquete_tarifario_cliente_carga,
    t.tmin_tarifario_cliente_carga,
    t.tmax_tarifario_cliente_carga,
    t.id_creador_tarifario_cliente_carga,
    t.fecha_creado
    FROM tarifarios_clientes_cargas t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_cliente_carga = ub.UBIGEO
	INNER JOIN 
    clientes cli ON t.id_cliente_tarifario_cliente_carga = cli.id
	INNER JOIN 
    areas ar ON t.id_area_tarifario_cliente_carga = ar.id
    WHERE id_cliente_tarifario_cliente_carga = :id_cliente_tarifario_cliente_carga AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_carga', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_carga_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_carga_cliente;
}

function obtenerTarifarioValorizadoCliente($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
	t.id_cliente_tarifario_cliente_valorizado,
    cli.razon_social_cliente,
	t.id_area_tarifario_cliente_valorizado,
	ar.nombre_area,
    t.ubigeo_tarifario_cliente_valorizado,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
	t.producto_tarifario_cliente_valorizado,
    t.costo_producto_tarifario_cliente_valorizado,
    t.tmin_tarifario_cliente_valorizado,
    t.tmax_tarifario_cliente_valorizado,
    t.id_creador_tarifario_cliente_valorizado,
    t.fecha_creado
    FROM tarifarios_clientes_valorizados t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_cliente_valorizado = ub.UBIGEO
	INNER JOIN 
    clientes cli ON t.id_cliente_tarifario_cliente_valorizado = cli.id
	INNER JOIN 
    areas ar ON t.id_area_tarifario_cliente_valorizado = ar.id
    WHERE id_cliente_tarifario_cliente_valorizado = :id_cliente_tarifario_cliente_valorizado AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_valorizado', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_valorizado_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_valorizado_cliente;
}


function obtenerTarifarioAereoCliente($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
	t.id_cliente_tarifario_cliente_aereo,
    cli.razon_social_cliente,
	t.id_area_tarifario_cliente_aereo,
	ar.nombre_area,
    t.ubigeo_tarifario_cliente_aereo,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
	t.kg_tarifario_cliente_aereo,
    t.kg_adicional_tarifario_cliente_aereo,
    t.tmin_tarifario_cliente_aereo,
    t.tmax_tarifario_cliente_aereo,
    t.id_creador_tarifario_cliente_aereo,
    t.fecha_creado
    FROM tarifarios_clientes_aereos t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_cliente_aereo = ub.UBIGEO
	INNER JOIN 
    clientes cli ON t.id_cliente_tarifario_cliente_aereo = cli.id
	INNER JOIN 
    areas ar ON t.id_area_tarifario_cliente_aereo = ar.id
    WHERE id_cliente_tarifario_cliente_aereo = :id_cliente_tarifario_cliente_aereo AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_aereo', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_aereo_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_aereo_cliente;
}

function obtenerTarifarioCourrierCliente($id_cliente, $id_area)
{
    $bd = obtenerConexion();
    $consulta = $bd->prepare("SELECT 
    t.id,
    t.id_cliente_tarifario_cliente_courrier,
    cli.razon_social_cliente,
    t.id_area_tarifario_cliente_courrier,
    ar.nombre_area,
    t.ubigeo_tarifario_cliente_courrier,
    ub.UBIGEO as 'ubigeo',
    ub.DEPARTAMENTO as 'departamento',
    ub.PROVINCIA as 'provincia',
    ub.DESTINO as 'distrito',
    ub.ZONA as 'zona',
    t.kg_tarifario_cliente_courrier,
    t.kg_adicional_tarifario_cliente_courrier,
    t.tmin_tarifario_cliente_courrier,
    t.tmax_tarifario_cliente_courrier,
    t.id_creador_tarifario_cliente_courrier,
    t.fecha_creado
    FROM tarifarios_clientes_courriers t
    INNER JOIN 
    ubigeo ub ON t.ubigeo_tarifario_cliente_courrier = ub.UBIGEO
    INNER JOIN 
    clientes cli ON t.id_cliente_tarifario_cliente_courrier = cli.id
    INNER JOIN 
    areas ar ON t.id_area_tarifario_cliente_courrier = ar.id
    WHERE id_cliente_tarifario_cliente_courrier = :id_cliente_tarifario_cliente_courrier AND ar.id = :id_area
    ORDER BY t.id DESC;
    ");
    $consulta->bindParam(':id_cliente_tarifario_cliente_courrier', $id_cliente);
    $consulta->bindParam(':id_area', $id_area);
    $consulta->execute();
    $tarifa_courrier_cliente = $consulta->fetchAll(PDO::FETCH_ASSOC);
    return $tarifa_courrier_cliente;
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
