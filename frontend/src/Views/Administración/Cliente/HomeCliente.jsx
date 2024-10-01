import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import SearchAdmin from "../Usuario/Components/SearchAdmin";
import NavBarContenido from "../Usuario/Components/NavBarContenido";
//MODALES
import ModalCrearCliente from "./Modals/CrearCliente";
import ModalEditarCliente from "./Modals/EditarCliente";
import VistasEncabezado from "./Modals/EncabezadoCliente";
import Table from "./Components/Table";

const CrearCliente = () => {
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
    DNI: true,
    "Razon Social": true,
    Representante: true,
    Clave: true,
    Vendedor: true,
    "Límite de Crédito": true,
    "Alerta Crédito": true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    Dirección: true,
    Referencias: true,
    Contacto: true,
    Teléfono: true,
    Email: true,
    Área: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };
  const [selectedClienteData, setSelectedClienteData] = useState(null); //Seleccionar Cliente

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);

    const selectedCliente = clientes.find((cliente) => cliente.id === id);
    setSelectedClienteData(selectedCliente);
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

  const exportarClientes = async () => {
    try {
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/exportar_clientes.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Estado y efecto para obtener datos de la API
  const [clientes, setClientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    exportarClientes();
    cargarTabla();
  }, []);

  // Maneja la búsqueda de clientes
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra clientes según el término de búsqueda
  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredClientes.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredClientes.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Cliente

  const eliminarCliente = async (id) => {
    try {
      const response = await fetch(
        `https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/eliminar_cliente.php?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        cargarTabla();
        Swal.fire({
          icon: "success",
          title: "Cliente eliminado con éxito",
        });
      } else {
        console.error("Error al eliminar el cliente");
        Swal.fire({
          icon: "error",
          title: "Error al eliminar el cliente",
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

  const handleEliminarCliente = (id) => {
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
        eliminarCliente(id);
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
            <ModalCrearCliente
              modalNuevo={modalNuevo}
              setModalNuevo={setModalNuevo}
              actualizarTabla={actualizarTabla}
            />

            <ModalEditarCliente
              modalEditar={modalEditar}
              setModalEditar={setModalEditar}
              selectedClienteData={selectedClienteData}
              actualizarTabla={actualizarTabla}
            />

            <VistasEncabezado
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />

            <NavBarContenido />

            <SearchAdmin
              titlle={"Crear Cliente"}
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
              handleEliminarCliente={handleEliminarCliente} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              clientesActuales={currentItems} // Pasar datos a la tabla
              clientesFiltrados={filteredClientes} // Pasar datos a la tabla
              columnasVisibles={columnasVisibles}
              handleIconHover={handleIconHover}
              handleIconHoverExit={handleIconHoverExit}
              mostrarModalEditar={mostrarModalEditar}
              mostrarModalEncabezados={mostrarModalEncabezados}
              selectedRow={selectedRow}
              showModal={showModal}
            />
            {/* <Table
              handleEliminarCliente={handleEliminarCliente} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              clientesActuales={currentItems} // Pasar datos a la tabla
              clientesFiltrados={filteredClientes} // Pasar datos a la tabla
              columnasVisibles={columnasVisibles}
              handleIconHover={handleIconHover}
              handleIconHoverExit={handleIconHoverExit}
              mostrarModalEditar={mostrarModalEditar}
              mostrarModalEncabezados={mostrarModalEncabezados}
              selectedRow={selectedRow}
              showModal={showModal}
            /> */}
          </>
        }
      />
    </>
  );
};

export default CrearCliente;
