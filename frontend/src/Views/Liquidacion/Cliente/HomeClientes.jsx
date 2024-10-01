import { useState, useEffect } from "react";
// Importamos el Layout
import Home from "../../../Layout/Home";
// El Navbar
import Navegacion from "./Components/Navegacion";
// El buscador
import Filtrado from "./Components/Filtrado";
// El Modal de Crear Cliente
import CCliente from "./Modals/CompletarCliente";
// Modal de Encabezados
import EncabezadosClientes from "./Modals/EncabezadosCliente";
// Tabla
import { Table } from "./Components/Table";

function Clientes() {
  // Visibilidad del Modal Insertar Cliente
  const [modalVisible, setModalVisible] = useState(false);
  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalEncabezados, setModalEncabezados] = useState(false);
  // Menu Hamburguesa
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    "Estado de documento": true,
    "Tipo documento": true,
    "Nro. documento": true,
    "Fecha Creación": true,
    "Guía Madre": true,
    "Cliente": true,
    "Área": true,
    "Cantidad de guías": true,
    "Guías en Proceso": true,
    "Costos de envíos": true,
    "Costo adicionales": true,
    "Sub Total": true,
    "IGV 1.8%": true,
    "Precio Total": true,
    "PDF": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedData, setSelectedData] = useState(null);

  const handleIconHover = (e, id_orden_servicio_validacion) => {
    setShowModal(true);
    setSelectedRow(id_orden_servicio_validacion);

    const selectedUser = liquidaciones.find(liqudacion => liqudacion.id_orden_servicio_validacion === id_orden_servicio_validacion);
    setSelectedData(selectedUser);
  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcionalidad Insertar Cliente
  const mostrarModalCompletar = () => {
    setModalVisible(true);
  };

  // Funcionalidad VISTA DE ENCABEZADOS
  // Mostrar Modal
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  //BACKEND
  // Estado y efecto para obtener datos de la API
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch('https://sistema.transportesmorales-logistik.com/BackendApiRest/Liquidacion/LiquidacionCliente/obtenerLiquidaciones.php');
      const data = await response.json();
      setLiquidaciones(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    cargarTabla();
  }, []);

  // Maneja la búsqueda de liquidaciones
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra liquidaciones según el término de búsqueda
  const filteredLiquidaciones = liquidaciones.filter((asignacion) =>
    Object.values(asignacion).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLiquidaciones.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredLiquidaciones.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredLiquidaciones.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Home
        children1={
          <>
            <CCliente
              selectedData={selectedData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              actualizarTabla={actualizarTabla}
            />
            <div className="cont-up-part no-imprimir">
              <Navegacion />
              <Filtrado onSearch={handleSearch} />
            </div>
            <EncabezadosClientes
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />
          </>
        }
        children2={
          <>
            <Table
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion 
              handlePageChange={handlePageChange} //Paginacion
              liquidacionesActuales={currentItems} // Pasar datos a la tabla
              liquidacionesFiltrados={filteredLiquidaciones} // Pasar datos a la tabla
              handleIconHover={handleIconHover}
              handleIconHoverExit={handleIconHoverExit}
              mostrarModalCompletar={mostrarModalCompletar}
              mostrarModalEncabezados={mostrarModalEncabezados}
              selectedRow={selectedRow}
              showModal={showModal}
              columnasVisibles={columnasVisibles}
            />
          </>
        }
      />
    </>
  );
}

export default Clientes;
