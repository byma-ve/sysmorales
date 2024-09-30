import { useState, useEffect } from "react";
// Importamos el Layout
import Home from "../../../Layout/Home";
//Importamos Componentes
import NavBarTarifario from "./Components/NavBarTarifario";
import SearchTarifario from "./Components/SearchTarifario";
import { TableCourier } from "./Components/TablaCourier";
import { TableAereo } from "./Components/TablaAereo";
import { TableValorizado } from "./Components/TablaValorizado";
import { TablaCarga } from "./Components/TablaCarga";
import { EncabezadosCarga } from "./Modals/VistasEncabCarga";
import { EncabezadosAereo } from "./Modals/VistasEncabAereo";
import { EncabezadosCourier } from "./Modals/VistasEncabCourier";
import { EncabezadosValorizado } from "./Modals/VistasEncabValorizado";

const HomeFiltrarCliente = () => {
  // ------------ CLIENTE -----------------
  //Elegir Tarifario
  const [selectedOption, setSelectedOption] = useState("Courier");
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  //Elegir Cliente
  const [selectedCliente, setSelectedCliente] = useState(1);
  const handleOptionCliente = (option) => {
    setSelectedCliente(option);
    setSelectedArea("");
  };

  //Elegir Area
  const [selectedArea, setSelectedArea] = useState(1);
  const handleOptionArea = (option) => {
    setSelectedArea(option);
  };

  // ------------ FIN DE CLIENTE -----------------

  const [showModal, setShowModal] = useState(true);

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

  // Tabla Valorizado
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
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtener_tarifario_courrier.php?id_cliente=${encodeURIComponent(
          selectedCliente
        )}&id_area=${encodeURIComponent(selectedArea)}`;
      }
      if (selectedOption === "Aereo") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtener_tarifario_aereo.php?id_cliente=${encodeURIComponent(
          selectedCliente
        )}&id_area=${encodeURIComponent(selectedArea)}`;
      }
      if (selectedOption === "Valorizado") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtener_tarifario_valorizado.php?id_cliente=${encodeURIComponent(
          selectedCliente
        )}&id_area=${encodeURIComponent(selectedArea)}`;
      }
      if (selectedOption === "Carga") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtener_tarifario_carga.php?id_cliente=${encodeURIComponent(
          selectedCliente
        )}&id_area=${encodeURIComponent(selectedArea)}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setcourriers(data);
      console.log("se mando");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedCliente && selectedArea && selectedOption) {
      cargarTabla();
    }
  }, [selectedCliente, selectedArea, selectedOption]);

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
        <TableCourier
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
    case "Aereo":
      selectedTable = (
        <TableAereo
          totalItems={totalItems} //Paginacion
          itemsPerPage={itemsPerPage} //Paginacion
          currentPage={currentPage} //Paginacion
          handlePageChange={handlePageChange} //Paginacion
          courriersActuales={currentItems} // Pasar datos a la tabla
          courriersFiltrados={filteredCourriers} // Pasar datos a la tabla
          mostrarModal={mostrarModal2}
          columnasVisibles={columnasVisibles2}
        />
      );
      break;
    case "Valorizado":
      selectedTable = (
        <TableValorizado
          totalItems={totalItems} //Paginacion
          itemsPerPage={itemsPerPage} //Paginacion
          currentPage={currentPage} //Paginacion
          handlePageChange={handlePageChange} //Paginacion
          courriersActuales={currentItems} // Pasar datos a la tabla
          courriersFiltrados={filteredCourriers} // Pasar datos a la tabla
          mostrarModal={mostrarModal3}
          columnasVisibles={columnasVisibles3}
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
              setcourriers={setcourriers}
              onOptionChange={handleOptionChange}
              onOptionCliente={handleOptionCliente}
              onOptionArea={handleOptionArea}
              onSearch={handleSearch}
              actualizarTabla={actualizarTabla}
            />

            <EncabezadosCourier
              modalVisible1={modalVisible1}
              setModalVisible1={setModalVisible1}
              onGuardarColumnas={handleGuardarColumnas}
            />
            <EncabezadosAereo
              modalVisible2={modalVisible2}
              setModalVisible2={setModalVisible2}
              onGuardarColumnas={handleGuardarColumnas2}
            />
            <EncabezadosValorizado
              modalVisible3={modalVisible3}
              setModalVisible3={setModalVisible3}
              onGuardarColumnas={handleGuardarColumnas3}
            />
            <EncabezadosCarga
              modalVisible4={modalVisible4}
              setModalVisible4={setModalVisible4}
              onGuardarColumnas={handleGuardarColumnas4}
            />
          </>
        }
        children2={<>{selectedTable}</>}
      ></Home>
    </>
  );
};

export default HomeFiltrarCliente;
