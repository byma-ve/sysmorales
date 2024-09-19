import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import SearchAdmin from "../Usuario/Components/SearchAdmin";
import NavBarContenido from "../Usuario/Components/NavBarContenido";
//MODALES
import ModalCrearProveedor from "./Modals/CrearProveedor";
import ModalEditarProveedor from "./Modals/EditarProveedor";
import VistasEncabezadoProveedor from "./Modals/EncabezadoProveedor";
import { Table } from "./Components/Table";

const CrearProveedor = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // Visibilidad del Modal Nuevo Proveedor
  const [modalNuevo, setModalNuevo] = useState(false);
  // Visibilidad del Modal Editar Proveedor
  const [modalEditar, setModalEditar] = useState(false);
  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalEncabezados, setModalEncabezados] = useState(false);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    "DNI/RUC": true,
    "Razon Social": true,
    Representante: true,
    Clave: true,
    "Tipo Proveedor": true,
    "Tipo Servicio": true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    Direccion: true,
    Referencias: true,
    Contacto: true,
    Telefono: true,
    Email: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedProveedorData, setSelectedProveedorData] = useState(null); //Seleccionar Proveedor

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);

    const selectedProveedor = proveedores.find(
      (proveedor) => proveedor.id === id
    );
    setSelectedProveedorData(selectedProveedor);
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

  const exportarProveedores = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/exportar_proveedores.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Estado y efecto para obtener datos de la API
  const [proveedores, setProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_proveedores.php"
      );
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    exportarProveedores();
    cargarTabla();
  }, []);

  // Maneja la búsqueda de proveedores
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra proveedores según el término de búsqueda
  const filteredProveedores = proveedores.filter((proveedor) =>
    Object.values(proveedor).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProveedores.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredProveedores.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredProveedores.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Cliente

  const eliminarProveedor = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/eliminar_proveedor.php?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        cargarTabla();
        Swal.fire({
          icon: "success",
          title: "Proveedor eliminado con éxito",
        });
      } else {
        console.error("Error al eliminar el proveedor");
        Swal.fire({
          icon: "error",
          title: "Error al eliminar el proveedor",
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

  const handleEliminarProveedor = (id) => {
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
        eliminarProveedor(id);
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
            <ModalCrearProveedor
              modalNuevo={modalNuevo}
              setModalNuevo={setModalNuevo}
              actualizarTabla={actualizarTabla}
            />

            <ModalEditarProveedor
              modalEditar={modalEditar}
              setModalEditar={setModalEditar}
              selectedProveedorData={selectedProveedorData}
              actualizarTabla={actualizarTabla}
            />

            <VistasEncabezadoProveedor
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />

            <NavBarContenido />

            <SearchAdmin
              titlle={"Crear Proveedor"}
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
              handleEliminarProveedor={handleEliminarProveedor} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              proveedoresActuales={currentItems} // Pasar datos a la tabla
              proveedoresFiltrados={filteredProveedores} // Pasar datos a la tabla
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

export default CrearProveedor;
