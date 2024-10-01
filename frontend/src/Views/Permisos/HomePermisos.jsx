import { useState, useEffect } from "react";
import Home from "../../Layout/Home";
import SearchSeguimiento from "./Components/SearchSeguimiento";
import { Table } from "./Components/Table";

const HomePermisos = () => {
  // Estados para controlar la visibilidad del modal para cada usuario
  const [modalVisible, setModalVisible] = useState(false);
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    DNI: true,
    Colaborador: true,
    "Correo Electronico": true,
    Area: true,
    Cargo: true,
  });

  // Función para mostrar el modal para un usuario específico
  const mostrarModal = () => {
    setModalVisible(!modalVisible);
  };

  // Función para ocultar el modal para un usuario específico
  const ocultarModal = () => {
    setModalVisible(false);
  };

  // BACKEND
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch('https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/obtener_usuarios.php');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    cargarTabla();
  }, []);

  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

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
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);

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
  return (
    <>
      <Home
        children1={
          <>
            <SearchSeguimiento onSearch={handleSearch}/>
          </>
        }
        children2={
          <>
            <Table
              totalItems={totalItems} //Paginacion
              itemsPerPage={itemsPerPage} //Paginacion
              currentPage={currentPage} //Paginacion 
              handlePageChange={handlePageChange} //Paginacion
              usuariosActuales={currentItems} // Pasar datos a la tabla
              usuariosFiltrados={filteredUsuarios} // Pasar datos a la tabla
              columnasVisibles={columnasVisibles}
              modalVisible={modalVisible}
              mostrarModal={mostrarModal}
              setModalVisible={setModalVisible}
            />
          </>
        }
      ></Home>
    </>
  );
};

export default HomePermisos;
