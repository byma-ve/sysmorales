import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import Home from "../../../Layout/Home";
import Encabezado from "./Components/Encabezado";
import EncabezadosEnvio from "./Modals/EncabezadosEnvio";
import DatosRemitente from "./Components/DatosRemitente";
import ListaDestinos from "./Components/ListaDestinos";
import TablaEnvios from "./Components/Table";

function HomeEnvio() {
  const [modalEncabezados, setModalEncabezados] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Estado de cliente elegido en false
  const [clienteElegido, setClienteElegido] = useState(false);
  // Estado del area elegida en false
  const [areaElegida, setAreaElegida] = useState(false);
  // Estado del modal por fila
  const [selectedRow, setSelectedRow] = useState(null);
  // FUNCIONALIDAD DE LAS COLUMNAS
  const [columnasVisibles, setColumnasVisibles] = useState({
  
    "Orden Servicio": true,
    "Cantidad Destinos": true,
    Cliente: true,
    "Contacto Repre": true,
    Telefono: true,
    "Correo Electronico": true,
    Validacion: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const [selectedClienteData, setSelectedClienteData] = useState(null); //Seleccionar Cliente

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, id) => {
    setShowModal(true);
    setSelectedRow(id);
    const selectedCliente = cotizaciones.find(cotizacion => cotizacion.id === id);
    setSelectedClienteData(selectedCliente);
  };
  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [opcionesSelect, setOpcionesSelect] = useState([]);

  const cargarListaEnvios = async () => {
    try {
      const response = await fetch(`https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/RegistroEnvio/obtenerListaDestinos.php?id_cliente=${clienteElegido}&id_area=${areaElegida}`);
      const data = await response.json();
      setOpcionesSelect(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [tipoComprobante, setTipoComprobante] = useState('');

  // Estado y efecto para obtener datos de la API
  const [cotizaciones, setCotizaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const actualizarTabla = () => {
    cargarTabla();
  };

  const cargarTabla = async () => {
    try {
      const response = await fetch('https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/RegistroEnvio/obtenerCotizaciones.php');
      const data = await response.json();
      setCotizaciones(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
  const currentItems = filteredCotizaciones.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCotizaciones.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredCotizaciones.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const eliminarCotizacion = async (id) => {
    try {
      const response = await fetch(`https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/RegistroEnvio/eliminarCotizacion.php?id_cotizacion=${id}`, {
        method: 'GET',
      });

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: responseData.mensaje,
        });
      } else {
        console.error('Error al eliminar la Cotizacion');
        Swal.fire({
          icon: 'error',
          title: responseData.mensaje,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de eliminación',
      });
      console.log(error);
    }
    cargarTabla();
  };

  const handleEliminarCotizacion = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarCotizacion(id);
      }
    });
  };

  // Mostrar Modal
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  return (
    <Home
      children1={
        <>
          <Encabezado
            titlle={"Orden de Servicio Unitario"}
            btntittle={"Generar"}
            clienteElegido={clienteElegido}
            areaElegida={areaElegida}
            cargarListaEnvios={cargarListaEnvios}
            onSearch={handleSearch}
            actualizarTabla={actualizarTabla}
          />
          <EncabezadosEnvio
            modalEncabezados={modalEncabezados}
            setModalEncabezados={setModalEncabezados}
            onGuardarColumnas={handleGuardarColumnas}
          />
        </>
      }
      children2={
        <>
          <div className="flex">
            <div className="tabla-envios w-[74%] xl:w-[76%] mr-4">
              <TablaEnvios
                handleEliminarCotizacion={handleEliminarCotizacion}
                totalItems={totalItems} //Paginacion
                itemsPerPage={itemsPerPage} //Paginacion
                currentPage={currentPage} //Paginacion 
                handlePageChange={handlePageChange} //Paginacion
                cotizacionesActuales={currentItems} // Pasar datos a la tabla
                cotizacionesFiltrados={filteredCotizaciones} // Pasar datos a la tabla
                handleIconHover={handleIconHover}
                handleIconHoverExit={handleIconHoverExit}
                selectedRow={selectedRow}
                showModal={showModal}
                modalEncabezados={mostrarModalEncabezados}
                columnasVisibles={columnasVisibles}
              />
            </div>
            <div className="datos-remitente  w-[32%] xl:w-[24%]">
              {/* Envio el cliente elegido al padre */}
              <DatosRemitente
                onClienteElegido={setClienteElegido}
                onAreaElegida={setAreaElegida}
              />
              {/* El padre le manda a lista de destinos el cliente */}
              <ListaDestinos
                clienteElegido={clienteElegido}
                areaElegida={areaElegida}
                cargarListaEnvios={cargarListaEnvios}
                opcionesSelect={opcionesSelect}
              />
            </div>
          </div>
        </>
      }
    />
  );
}

export default HomeEnvio;
