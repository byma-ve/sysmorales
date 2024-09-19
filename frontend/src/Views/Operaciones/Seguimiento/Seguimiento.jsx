import { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import SearchSeguimiento from "./Components/SearchSeguimiento";
import { EncabezadosSeguimiento } from "./Components/EncabezadosSeguimiento";
import { Table } from "./Components/Table";
function Seguimiento() {
  const [showModal, setShowModal] = useState(false);
  // Estados para la visibilidad del modal de encabezados
  const [modalEncabezados, setModalEncabezados] = useState(false);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    "": true,
    "Estado OP": true,
    "Fecha OP": true,
    "Hora OP": true,
    "Guía Madre": true,
    "Nro. de tracking": true,
    Cliente: true,
    Área: true,
    "Destino de partida": true,
    "Nombre de consignado": true,
    "Destino de llegada": true,
    "Contenido de envío": true,
    Cantidad: true,
    "Peso masa": true,
    "Peso volumen": true,
    "Lead time": true,
    "Tiempo OP": true,
    Target: true,
    "Estado de Cargo": true,
    "Fecha Cargo": true,
    Observacion: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcionalidad de la vista de encabezados
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  const [cotizaciones, setCotizaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Seguimiento/obtenerSeguimiento.php"
      );
      const data = await response.json();
      setCotizaciones(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const actualizarTabla = () => {
    cargarTabla();
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
  const currentItems = filteredCotizaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCotizaciones.length / itemsPerPage);
    i++
  ) {
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
          <SearchSeguimiento
            titlle={"Seguimiento"}
            btntittle={"Elegir cliente"}
            onSearch={handleSearch}
          />
          <EncabezadosSeguimiento
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
            cotizacionesActuales={currentItems} // Pasar datos a la tabla
            cotizacionesFiltrados={filteredCotizaciones} // Pasar datos a la tabla
            columnasVisibles={columnasVisibles}
            mostrarModalEncabezados={mostrarModalEncabezados}
            actualizarTabla={actualizarTabla}
          />
        </>
      }
    />
  );
}

export default Seguimiento;
