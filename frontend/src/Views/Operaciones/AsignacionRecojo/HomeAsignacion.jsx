import { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import Table from "./Components/Table";
import Encabezado from "./Components/Encabezado";
import EncabezadoAsignacion from "./Modals/EncabezadoAsignación";

function HomeAsignacion() {
  const [modalEncabezados, setModalEncabezados] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Estado del modal por fila
  const [selectedRow, setSelectedRow] = useState(null);
  // FUNCIONALIDAD DE LAS COLUMNAS
  const [columnasVisibles, setColumnasVisibles] = useState({
    "Guía Madre": true,
    "Fecha Recojo": true,
    "Hora Recojo": true,
    Cliente: true,
    "Contacto Recojo": true,
    "Destino Recojo": true,
    "Asignación de proceso": true,
    "Conductor asignado": true,
    "Auxiliar asignado": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedClienteData, setSelectedClienteData] = useState(null); //Seleccionar Cliente

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id_orden_servicio) => {
    setShowModal(true);
    setSelectedRow(id_orden_servicio);
    const selectedCliente = asignaciones.find(
      (asignacion) => asignacion.id_orden_servicio === id_orden_servicio
    );
    setSelectedClienteData(selectedCliente);

  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  // Cerrar Modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Mostrar Modal
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  // BACKEND

  // Estado y efecto para obtener datos de la API
  const [asignaciones, setAsignaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/AsignacionRecojos/obtenerAsignaciones.php"
      );
      const data = await response.json();
      setAsignaciones(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarTabla();
  }, []);

  // Maneja la búsqueda de asignaciones
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra asignaciones según el término de búsqueda
  const filteredAsignaciones = asignaciones.filter((asignacion) =>
    Object.values(asignacion).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAsignaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredAsignaciones.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredAsignaciones.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Home
      children1={
        <>
          <Encabezado titlle={"Asignación Recojo"} onSearch={handleSearch} />
          <EncabezadoAsignacion
            modalEncabezados={modalEncabezados}
            setModalEncabezados={setModalEncabezados}
            onGuardarColumnas={handleGuardarColumnas}
          />
        </>
      }
      children2={
        <>
          <Table
            actualizarTabla={actualizarTabla}
            datosAsignacion={selectedClienteData}
            totalItems={totalItems} //Paginacion
            itemsPerPage={itemsPerPage} //Paginacion
            currentPage={currentPage} //Paginacion
            handlePageChange={handlePageChange} //Paginacion
            asignacionesActuales={currentItems} // Pasar datos a la tabla
            asignacionesFiltrados={filteredAsignaciones} // Pasar datos a la tabla
            handleIconHover={handleIconHover}
            handleIconHoverExit={handleIconHoverExit}
            selectedRow={selectedRow}
            showModal={showModal}
            mostrarModalEncabezados={mostrarModalEncabezados}
            columnasVisibles={columnasVisibles}
          />
        </>
      }
    />
  );
}

export default HomeAsignacion;
