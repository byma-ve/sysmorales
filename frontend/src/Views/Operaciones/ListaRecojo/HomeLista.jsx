import { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import Encabezado from "./Components/Encabezado";
import TablaListaEnvios from "./Components/Table";
import EncabezadosRecojo from "./Modals/EncabezadosRecojo";

function HomeLista() {
  const [modalEncabezados, setModalEncabezados] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Estado del modal por fila
  const [selectedRow, setSelectedRow] = useState(null);
  // FUNCIONALIDAD DE LAS COLUMNAS
  const [columnasVisibles, setColumnasVisibles] = useState({
    "Estado Recojo": true,
    "Guía Madre": true,
    "Fecha Recojo": true,
    "Hora Recojo": true,
    "Cliente": true,
    "Area de Cliente": true,
    "Destino de Recojo": true,
    "Comentario": true,
    "Imagen Recojo": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, item) => {
    setShowModal(true);
    setSelectedRow(item);
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

  // Estado y efecto para obtener datos de la API
  const [cotizaciones, setCotizaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarTabla = async () => {
    try {
      const response = await fetch('https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/ListaRecojos/obtenerListaRecojos.php');
      const data = await response.json();
      setCotizaciones(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    cargarTabla();
  }, []);

  // Maneja la búsqueda de cotizaciones
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra cotizaciones según el término de búsqueda
  const filteredCotizaciones = cotizaciones.filter((cotizacion) =>
    Object.values(cotizacion).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCotizaciones.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCotizaciones.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredCotizaciones.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Home
      children1={
        <>
          <Encabezado titlle={"Lista Recojo"} onSearch={handleSearch}/>
          <EncabezadosRecojo
            modalEncabezados={modalEncabezados}
            setModalEncabezados={setModalEncabezados}
            onGuardarColumnas={handleGuardarColumnas}
          />
        </>
      }
      children2={
        <>
          <TablaListaEnvios
            totalItems={totalItems} //Paginacion
            itemsPerPage={itemsPerPage} //Paginacion
            currentPage={currentPage} //Paginacion 
            handlePageChange={handlePageChange} //Paginacion
            cotizacionesActuales={currentItems} // Pasar datos a la tabla
            cotizacionesFiltrados={filteredCotizaciones} // Pasar datos a la tabla
            handleIconHover={handleIconHover}
            handleIconHoverExit={handleIconHoverExit}
            selectedRow={selectedRow}
            showModal={showModal}
            modalEncabezados={mostrarModalEncabezados}
            columnasVisibles={columnasVisibles}
          />
        </>
      }
    />
  );
}

export default HomeLista;
