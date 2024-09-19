import { useState, useEffect } from "react";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import NavBarContenido from "./Components/NavBarContenido";
import SearchAdmin from "./Components/SearchAdmin";
//MODALES
import ModalCrearUsuario from "./Modals/CrearUsuario";
import ModalEditarUsuario from "./Modals/editarusuario";
import VistasEncabezado from "./Modals/EncabezadoUsuario";
import { Table } from "./Components/Table";
import Swal from "sweetalert2";

const CrearUsuario = () => {
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
    Foto: true,
    DNI: true,
    Clave: true,
    Colaborador: true,
    Brevete: true,
    Telefono: true,
    Email: true,
    Area: true,
    Cargo: true,
  });

  const [selectedUsuarioData, setSelectedUsuarioData] = useState(null); //Seleccionar Usuario

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);

    const selectedUser = usuarios.find((usuario) => usuario.id === id);
    setSelectedUsuarioData(selectedUser);
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
  // Exportar Usuarios
  const [exportarData, setExportarData] = useState([]);

  const exportarUsuarios = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/exportar_usuario.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtener_usuarios.php"
      );
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarTabla();
    exportarUsuarios();
  }, []);

  // Maneja la búsqueda de usuarios
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) =>
    Object.values(usuario).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsuarios.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredUsuarios.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Usuario

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/eliminar_usuario.php?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        cargarTabla();
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
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

  const handleEliminarUsuario = (id) => {
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
        eliminarUsuario(id);
        handleCloseModal();
      }
    });
  };

  // Fin Eliminar Usuario

  return (
    <>
      <Home
        children1={
          <>
            <ModalCrearUsuario
              modalNuevo={modalNuevo}
              setModalNuevo={setModalNuevo}
              actualizarTabla={actualizarTabla}
            />

            <ModalEditarUsuario
              modalEditar={modalEditar}
              setModalEditar={setModalEditar}
              selectedUserData={selectedUsuarioData} // Pasar los datos del usuario al modal
              actualizarTabla={actualizarTabla}
            />

            <VistasEncabezado
              modalEncabezados={modalEncabezados}
              setModalEncabezados={setModalEncabezados}
              onGuardarColumnas={handleGuardarColumnas}
            />

            <NavBarContenido />
            <SearchAdmin
              titlle={"Crear Usuario"}
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
              handleEliminarUsuario={handleEliminarUsuario} //Eliminar Usuario
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion
              handlePageChange={handlePageChange} //Paginacion
              usuariosActuales={currentItems} // Pasar datos a la tabla
              usuariosFiltrados={filteredUsuarios} // Pasar datos a la tabla
              columnasVisibles={columnasVisibles}
              handleIconHover={handleIconHover}
              handleIconHoverExit={handleIconHoverExit}
              selectedRow={selectedRow}
              showModal={showModal}
              mostrarModalEncabezados={mostrarModalEncabezados}
              mostrarModalEditar={mostrarModalEditar}
            />
          </>
        }
      />
    </>
  );
};

export default CrearUsuario;
