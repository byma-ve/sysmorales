import { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import Table from "./Components/Table";
import SearchValidacion from "./Components/SearchValidacion";
import Swal from "sweetalert2";
import EncabezadoValidacion from "./Modals/EncabezadoValidacion";
function HomeValidacion() {
  const [showModal, setShowModal] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  // FUNCIONALIDAD DE LAS COLUMNAS
  const [columnasVisibles, setColumnasVisibles] = useState({
    "Fecha de validación": true,
    "Usuario de proceso": true,
    "Nro. de cotización": true,
    Cliente: true,
    "Cantidad de destinos": true,
    Documento: true,
    "Precio de cotización": true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedRow, setSelectedRow] = useState(null);
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
  // Funcionalidad VISTA DE ENCABEZADOS
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalVisible3(true);
  };

  // BACKEND
  // Exportar Validaciones
  const [exportarData, setExportarData] = useState([]);

  const exportarValidaciones = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Comercial/Validacion/exportarValidaciones.php"
      );
      const data = await response.json();
      setExportarData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [validaciones, setValidaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Comercial/Validacion/obtenerValidaciones.php"
      );
      const data = await response.json();
      setValidaciones(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarTabla();
    exportarValidaciones();
  }, []);

  // Maneja la búsqueda de validaciones
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra validaciones según el término de búsqueda
  const filteredValidaciones = validaciones.filter((validacion) =>
    Object.values(validacion).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredValidaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredValidaciones.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredValidaciones.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Eliminar Validacion

  const desaprobarValidacion = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Comercial/Validacion/desaprobarValidacion.php?id_cotizacion=${id}&id_usuario=${localStorage.getItem(
          "id_usuario"
        )}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.mensaje,
        });
      } else {
        console.error("Error al eliminar el validacion");
        Swal.fire({
          icon: "error",
          title: responseData.mensaje,
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de eliminación",
      });
    }
    cargarTabla();
  };

  const handleDesaprobarValidacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desaprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        desaprobarValidacion(id);
        handleCloseModal();
      }
    });
  };

  const aprobarValidacion = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Comercial/Validacion/aprobarValidacion.php?id_cotizacion=${id}&id_usuario=${localStorage.getItem(
          "id_usuario"
        )}`,
        {
          method: "GET",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.mensaje,
        });
      } else {
        console.error("Error al aprobar el validacion");
        Swal.fire({
          icon: "error",
          title: responseData.mensaje,
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de aprobar:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de aprobar",
      });
    }
    cargarTabla();
  };

  const handleAprobarValidacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        aprobarValidacion(id);
        handleCloseModal();
      }
    });
  };

  return (
    <Home
      children1={
        <>
          <SearchValidacion
            titlle={"Validacion"}
            btntittle={"Nuevo Validacion"}
            onSearch={handleSearch}
            apiData={exportarData}
          />

          <EncabezadoValidacion
            modalEncabezados={modalVisible3}
            setModalEncabezados={setModalVisible3}
            onGuardarColumnas={handleGuardarColumnas}
          />
        </>
      }
      children2={
        <Table
          handleDesaprobarValidacion={handleDesaprobarValidacion}
          handleAprobarValidacion={handleAprobarValidacion}
          totalItems={totalItems} //Paginacion
          itemsPerPage={itemsPerPage} //Paginacion
          currentPage={currentPage} //Paginacion
          handlePageChange={handlePageChange} //Paginacion
          validacionesActuales={currentItems} // Pasar datos a la tabla
          validacionesFiltrados={filteredValidaciones} // Pasar datos a la tabla
          mostrarModal={mostrarModalEncabezados}
          handleIconHover={handleIconHover}
          handleIconHoverExit={handleIconHoverExit}
          selectedRow={selectedRow}
          showModal={showModal}
          columnasVisibles={columnasVisibles}
        />
      }
    />
  );
}

export default HomeValidacion;
