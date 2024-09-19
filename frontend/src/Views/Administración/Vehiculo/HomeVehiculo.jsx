import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import SearchAdmin from "../Usuario/Components/SearchAdmin";
import NavBarContenido from "../Usuario/Components/NavBarContenido";
//MODALES
import ModalCrearVehiculo from "./Modals/CrearVehiculo";
import ModalEditarVehiculo from "./Modals/EditarVehiculo";
import VistasEncabezadoVehiculo from "./Modals/EncabezadoVehiculo";
import { Table } from "./Components/Table";

const CrearVehiculo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Visibilidad del Modal Editar Usuario
  const [modalEditar, setModalEditar] = useState(false);
  // Visibilidad del Modal Nuevo Usuario
  const [modalNuevo, setModalNuevo] = useState(false);
  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalEncabezados, setModalEncabezados] = useState(false);
  // Capturar los datos de la Api
  // const [data, setData] = useState([]);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    Placa: true,
    Tipo: true,
    "N° Serie": true,
    Soat: true,
    "Vigencia Desde": true,
    "Vigencia Hasta": true,
    "Ultima Revision": true,
    Vencimiento: true,
    "Tarjeta Propiedad": true,
    Valido: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedVehiculoData, setSelectedVehiculoData] = useState(null); //Seleccionar Cliente

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);

    const selectedVehiculo = vehiculos.find((vehiculo) => vehiculo.id === id);
    setSelectedVehiculoData(selectedVehiculo);
  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  //MODALES

  // Funcionalidad Nuevo Usuario
  const mostrarModalNuevo = () => {
    setModalNuevo(true);
  };

  // Funcionalidad Editar usuario
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

  const exportarVehiculos = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/exportar_vehiculos.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Estado y efecto para obtener datos de la API
  const [vehiculos, setVehiculos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/obtener_vehiculos.php"
      );
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    exportarVehiculos();
    cargarTabla();
  }, []);

  // Maneja la búsqueda de vehiculos
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra vehiculos según el término de búsqueda
  const filteredVehiculos = vehiculos.filter((vehiculo) =>
    Object.values(vehiculo).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehiculos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredVehiculos.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredVehiculos.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Cliente

  const eliminarVehiculo = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/eliminar_vehiculo.php?id=${id}`,
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

  const handleEliminarVehiculo = (id) => {
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
        eliminarVehiculo(id);
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
            <ModalCrearVehiculo
              modalNuevo={modalNuevo}
              setModalNuevo={setModalNuevo}
              actualizarTabla={actualizarTabla}
            />

            <ModalEditarVehiculo
              modalEditar={modalEditar}
              setModalEditar={setModalEditar}
              selectedVehiculoData={selectedVehiculoData}
              actualizarTabla={actualizarTabla}
            />

            <VistasEncabezadoVehiculo
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />

            <NavBarContenido />
            <SearchAdmin
              titlle={"Crear Vehiculo"}
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
              handleEliminarVehiculo={handleEliminarVehiculo} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              vehiculosActuales={currentItems} // Pasar datos a la tabla
              vehiculosFiltrados={filteredVehiculos} // Pasar datos a la tabla
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

export default CrearVehiculo;
