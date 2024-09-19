import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import SearchAdmin from "../Usuario/Components/SearchAdmin";
import NavBarContenido from "../Usuario/Components/NavBarContenido";
//MODALES
import ModalCrearArea from "./Modals/CrearArea";
import ModalEditarArea from "./Modals/EditarArea";
import VistasEncabezadoArea from "./Modals/EncabezadoArea";
//ICONOS
import { Table } from "./Components/Table";

const Area = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalEncabezados, setModalEncabezados] = useState(false);
  // Visibilidad del Modal Nuevo Cliente
  const [modalNuevo, setModalNuevo] = useState(false);
  // Visibilidad del Modal Editar Cliente
  const [modalEditar, setModalEditar] = useState(false);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    Cliente: true,
    Area: true,
    Contacto: true,
    "Cargo Contacto": true,
    Telefono: true,
    Email: true,
    "Contacto extra": true,
    "Telefono extra": true,
    "Email extra": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedAreaData, setSelectedAreaData] = useState(null); //Seleccionar Cliente

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);

    const selectedArea = areas.find((area) => area.id === id);
    setSelectedAreaData(selectedArea);
  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //MODALES
  // Funcionalidad Nuevo Cliente
  const mostrarModalNuevo = () => {
    setModalNuevo(true);
  };

  // Funcionalidad Editar Cliente
  const mostrarModalEditar = () => {
    handleCloseModal();
    setModalEditar(true);
  };

  // Funcionalidad VISTA DE ENCABEZADOS
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  // BACKEND
  //Exportar Tabla
  const [exportarData, setExportarData] = useState([]);

  const exportarAreas = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/exportar_areas.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Estado y efecto para obtener datos de la API
  const [areas, setAreas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/obtener_areas.php"
      );
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    exportarAreas();
    cargarTabla();
  }, []);

  // Maneja la búsqueda de areas
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra areas según el término de búsqueda
  const filteredAreas = areas.filter((area) =>
    Object.values(area).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAreas.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAreas.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredAreas.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Cliente

  const eliminarArea = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/eliminar_area.php?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        cargarTabla();
        Swal.fire({
          icon: "success",
          title: "Area eliminado con éxito",
        });
      } else {
        console.error("Error al eliminar el area");
        Swal.fire({
          icon: "error",
          title: "Error al eliminar el area",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de eliminación",
      });
    }
  };

  const handleEliminarArea = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarArea(id);
        handleCloseModal();
      }
    });
  };

  // Fin Eliminar Cliente

  return (
    <>
      <Home
        children1={
          <>
            <ModalCrearArea
              modalNuevo={modalNuevo}
              setModalNuevo={setModalNuevo}
              actualizarTabla={actualizarTabla}
            />

            <ModalEditarArea
              modalEditar={modalEditar}
              setModalEditar={setModalEditar}
              selectedAreaData={selectedAreaData}
              actualizarTabla={actualizarTabla}
            />

            <VistasEncabezadoArea
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />

            <NavBarContenido />

            <SearchAdmin
              titlle={"Crear Area"}
              btntittle={"Crear"}
              mostrarModalNuevo={mostrarModalNuevo}
              onSearch={handleSearch}
              apiData={exportarData}
            />
          </>
        }
        children2={
          <>
            <Table
              handleEliminarArea={handleEliminarArea} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              areasActuales={currentItems} // Pasar datos a la tabla
              areasFiltrados={filteredAreas} // Pasar datos a la tabla
              columnasVisibles={columnasVisibles}
              handleIconHover={handleIconHover}
              handleIconHoverExit={handleIconHoverExit}
              mostrarModalEditar={mostrarModalEditar}
              mostrarModalEncabezados={mostrarModalEncabezados}
              selectedRow={selectedRow}
              showModal={showModal}
            />
          </>
        }
      />
    </>
  );
};

export default Area;
