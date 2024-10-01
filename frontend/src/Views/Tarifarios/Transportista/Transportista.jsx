import { useState, useEffect } from "react";

// Importamos el Layout
import Home from "../../../Layout/Home";

//Importamos Componentes
import NavBarTarifario from "../Cliente/Components/NavBarTarifario";
import SearchTarifario from "./Components/SearchTarifario";
import { TablaCarga } from "./Components/TablaCarga";
import { EncabezadosCarga } from "./Modals/VistasEncabCarga";
//MODALES
const HomeFiltrarTransportista = () => {
  const [showModal, setShowModal] = useState(true);

  //Elegir Tarifario
  const [selectedOption, setSelectedOption] = useState("Carga");
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  //Elegir Cliente
  const [selectedAgente, setSelectedAgente] = useState(0);
  const handleOptionAgente = (option) => {
    setSelectedAgente(option);
  };

  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);

  // Tabla Currier
  // Funcionalidad de las columnas
  const [columnasVisibles, setColumnasVisibles] = useState({
    Ubigeo: true,
    Zona: true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    KG: true,
    "KG Adicional": true,
    "T.Min Entrega": true,
    "T.Max Entrega": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  // Tabla Aereo
  // Funcionalidad de las columnas
  const [columnasVisibles2, setColumnasVisibles2] = useState({
    Ubigeo: true,
    Zona: true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    KG: true,
    "KG Adicional": true,
    "T.Min Entrega": true,
    "T.Max Entrega": true,
  });

  const handleGuardarColumnas2 = (columnas) => {
    setColumnasVisibles2(columnas);
  };

  // Tabla Valorizado
  // Funcionalidad de las columnas
  const [columnasVisibles3, setColumnasVisibles3] = useState({
    Ubigeo: true,
    Zona: true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    Producto: true,
    "S/ Producto": true,
    "T.Min Entrega": true,
    "T.Max Entrega": true,
  });

  const handleGuardarColumnas3 = (columnas) => {
    setColumnasVisibles3(columnas);
  };

  // Tabla Carga
  // Funcionalidad de las columnas
  const [columnasVisibles4, setColumnasVisibles4] = useState({
    Ubigeo: true,
    Zona: true,
    Departamento: true,
    Provincia: true,
    Distrito: true,
    "KG Maximo": true,
    "KG Base": true,
    Paquete: true,
    "T.Min Entrega": true,
    "T.Max Entrega": true,
  });

  const handleGuardarColumnas4 = (columnas) => {
    setColumnasVisibles4(columnas);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // Funcionalidad VISTA DE ENCABEZADOS
  const mostrarModal1 = () => {
    handleCloseModal();
    setModalVisible1(true);
  };
  const mostrarModal2 = () => {
    handleCloseModal();
    setModalVisible2(true);
  };
  const mostrarModal3 = () => {
    handleCloseModal();
    setModalVisible3(true);
  };
  const mostrarModal4 = () => {
    handleCloseModal();
    setModalVisible4(true);
  };
  //COURRIER
  // Estado y efecto para obtener datos de la API
  const [courriers, setcourriers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      let apiUrl;
      if (selectedOption === "Courier") {
        apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Tarifarios/Transportista/obtenerCourrier.php?id_transportista=${encodeURIComponent(
          selectedAgente
        )}`;
      }
      if (selectedOption === "Carga") {
        apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Tarifarios/Transportista/obtenerCarga.php?id_transportista=${encodeURIComponent(
          selectedAgente
        )}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setcourriers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedAgente && selectedOption) {
      cargarTabla();
    }
  }, [selectedAgente, selectedOption]);

  // Maneja la búsqueda de courriers
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra courriers según el término de búsqueda
  const filteredCourriers = courriers.filter((courrier) =>
    Object.values(courrier).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourriers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCourriers.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredCourriers.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //COURRIER

  let selectedTable;
  switch (selectedOption) {
    case "Courier":
      selectedTable = (
        <TablaCourier
          totalItems={totalItems} //Paginacion
          itemsPerPage={itemsPerPage} //Paginacion
          currentPage={currentPage} //Paginacion
          handlePageChange={handlePageChange} //Paginacion
          courriersActuales={currentItems} // Pasar datos a la tabla
          courriersFiltrados={filteredCourriers} // Pasar datos a la tabla
          mostrarModal={mostrarModal1}
          columnasVisibles={columnasVisibles}
        />
      );
      break;
    case "Carga":
      selectedTable = (
        <TablaCarga
          totalItems={totalItems} //Paginacion
          itemsPerPage={itemsPerPage} //Paginacion
          currentPage={currentPage} //Paginacion
          handlePageChange={handlePageChange} //Paginacion
          courriersActuales={currentItems} // Pasar datos a la tabla
          courriersFiltrados={filteredCourriers} // Pasar datos a la tabla
          mostrarModal={mostrarModal4}
          columnasVisibles={columnasVisibles4}
        />
      );
      break;
    default:
      selectedTable = null;
  }

  return (
    <>
      <Home
        children1={
          <>
            <NavBarTarifario />
            <SearchTarifario
              onOptionChange={handleOptionChange}
              onOptionCliente={handleOptionAgente}
              onSearch={handleSearch}
              actualizarTabla={actualizarTabla}
            />

            <EncabezadosCarga
              modalVisible1={modalVisible4}
              setModalVisible1={setModalVisible4}
              onGuardarColumnas={handleGuardarColumnas4}
            />
          </>
        }
        children2={<>{selectedTable}</>}
      ></Home>
    </>
  );
};

export default HomeFiltrarTransportista;
