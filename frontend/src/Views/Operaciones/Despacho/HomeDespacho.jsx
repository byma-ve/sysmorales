import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Home from "../../../Layout/Home";
import SearchDespacho from "./Components/SearchDespacho";
import SearchTabla from "./Components/SearchTabla";
import ModalAgregarEnvio from "./Modals/ModalAgregarEnvio";
import ModalAgregarMasivo from "./Modals/ModalAgregarMasivo";
import { EncabezadoDespacho } from "./Modals/EncabezadoDespacho";
import { ModalAgente } from "./Modals/ModalAgente";
import { Table } from "./Components/Table";
import { AgregarGuia } from "./Components/AgregarGuia";
import { DatosManifiesto } from "./Components/DatosManifiesto";

function HomeDespacho() {
  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    return `${fechaActual.getFullYear()}-${mes}-${dia}`;
  };
  // Visibilidad del Modal Agregar
  const [modalAgregarEnvio, setModalAgregarEnvios] = useState(false);
  // Visibilidad del Modal Masivo
  const [modalAgregarMasivo, setModalAgregarMasivo] = useState(false);
  // Encabezados
  const [modalEncabezados, setModalEncabezados] = useState(false);
  const [modalAgente, setModalAgente] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // FUNCIONALIDAD DE LAS COLUMNAS
  const [columnasVisibles, setColumnasVisibles] = useState({
    // Fecha: true,
    "N° Manifiesto": true,
    "Documento de salida": true,
    "Asignación de proceso": true,
    "Destino de salida": true,
    "Bultos consolidados": true,
    "Cantidad de guías": true,
    Agentes: true,
  });

  const handleGuardarColumnas = (columnas) => {
    setColumnasVisibles(columnas);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcionalidad  Modal Agregarr
  const mostrarModalAgregarEnvio = () => {
    handleCloseModal();
    setModalAgregarEnvios(true);
  };

  // Funcionalidad Modal Masivo
  const mostrarModalAgregarMasivo = () => {
    handleCloseModal();
    setModalAgregarMasivo(true);
  };

  // Mostrar Modal
  const mostrarModalEncabezados = () => {
    handleCloseModal();
    setModalEncabezados(true);
  };

  // Mostrar Modal Agente
  const mostrarModalAgente = () => {
    handleCloseModal();
    setModalAgente(true);
  };

  const [selectedDespacho, setSelectedDespacho] = useState(null);

  const handleIconHover = (e, id_num_manifiesto_despacho) => {
    setShowModal(true);
    setSelectedRow(id_num_manifiesto_despacho);

    const selectedUser = datosDespachos.find(
      (despacho) =>
        despacho.id_num_manifiesto_despacho === id_num_manifiesto_despacho
    );
    setSelectedDespacho(selectedUser.id_num_manifiesto_despacho);
  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const [datosAgentesModal, setDatosAgentesModal] = useState([]);

  useEffect(() => {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerAgentesManifiesto.php?num_manifiesto=${selectedDespacho}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de agentes de modal recibidos:", data);
        setDatosAgentesModal(data);
      })
      .catch((error) =>
        console.error("Error fetching agentes de modal:", error)
      );
  }, [selectedDespacho]);

  //BACKEND

  // UBIGEO
  // Departamento - Provincia - Distrito / Select
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  useEffect(() => {
    // Obtener departamentos
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=departamentos"
    )
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) => console.error("Error fetching departamentos:", error));
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      // Obtener provincias por departamento
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=provincias&id=${departamentoSeleccionado}`
      )
        .then((response) => response.json())
        .then((data) => setProvincias(data))
        .catch((error) => console.error("Error fetching provincias:", error));
    }
  }, [departamentoSeleccionado]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      // Obtener distritos por provincia
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=distritos&id=${provinciaSeleccionada}`
      )
        .then((response) => response.json())
        .then((data) => setDistritos(data))
        .catch((error) => console.error("Error fetching distritos:", error));
    }
  }, [provinciaSeleccionada]);

  const handleDepartamentoChange = (event) => {
    setDepartamentoSeleccionado(event.target.value);
    setProvinciaSeleccionada("");
    setDistritos([]);
  };

  const handleProvinciaChange = (event) => {
    setProvinciaSeleccionada(event.target.value);
  };
  // UBIGEO
  const [selectConductores, setSelectConductores] = useState([]);

  const cargarConductores = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtenerConductores.php"
      );
      const data = await response.json();
      setSelectConductores(data);
    } catch (error) {
      console.error("Error fetching data conductores:", error);
    }
  };

  const [selectAuxiliares, setSelectAuxiliares] = useState([]);

  const cargarAuxiliares = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtenerAuxiliares.php"
      );
      const data = await response.json();
      setSelectAuxiliares(data);
    } catch (error) {
      console.error("Error fetching data auxiliares:", error);
    }
  };

  const [selectTransportistas, setSelectTransportistas] = useState([]);

  const cargarTransportistas = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_transportistas.php"
      );
      const data = await response.json();
      setSelectTransportistas(data);
    } catch (error) {
      console.error("Error fetching transportistas:", error);
    }
  };

  const [selectVehiculos, setSelectVehiculos] = useState([]);

  const cargarVehiculos = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/obtener_vehiculos.php"
      );
      const data = await response.json();
      setSelectVehiculos(data);
    } catch (error) {
      console.error("Error fetching transportistas:", error);
    }
  };

  const [datosVehiculo, setDatosVehiculo] = useState([]);

  const cargarDatosVehiculo = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/obtenerVehiculo.php?id=${value}`
      );
      const data = await response.json();
      setDatosVehiculo(data);
    } catch (error) {
      console.error("Error cargar datos vehiculo:", error);
    }
  };

  const handleSelectVehiculo = (event) => {
    cargarDatosVehiculo(event.target.value);
  };

  // CARGAR GUÍAS UNITARIO

  const [selectGuiasUnitario, setSelectGuiasUnitario] = useState([]);

  const cargarGuiasUnitario = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerGuiasUnitarias.php"
      );
      const data = await response.json();
      setSelectGuiasUnitario(data);
    } catch (error) {
      console.error("Error fetching guias unitario:", error);
    }
  };

  const [datosGuiaUnitaria, setDatosGuiaUnitaria] = useState([]);

  const cargarDatosGuiaUnitaria = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerGuiaUnitaria.php?id_num_guia_registro_carga=${value}`
      );
      const data = await response.json();
      setDatosGuiaUnitaria(data);
    } catch (error) {
      console.error("Error cargar datos vehiculo:", error);
    }
  };

  const [selectedGuiaUnitaria, setSelectedGuiaUnitaria] = useState("");

  const handleSelectGuiaUnitaria = (datosSelect) => {
    setSelectedGuiaUnitaria(datosSelect.id_num_guia_registro_carga);
    cargarDatosGuiaUnitaria(datosSelect.id_num_guia_registro_carga);
  };

  // CARGAR AGENTES UNITARIO Y MASIVO

  const [selectAgentes, setSelectAgentes] = useState([]);

  const cargarAgentes = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_agentes.php"
      );
      const data = await response.json();
      setSelectAgentes(data);
    } catch (error) {
      console.error("Error fetching agentes:", error);
    }
  };

  const [datosAgente, setDatosAgente] = useState([]);

  const cargarDatosAgente = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_datos_proveedor.php?id=${value}`
      );
      const data = await response.json();
      setDatosAgente(data);
    } catch (error) {
      console.error("Error cargar datos agentes:", error);
    }
  };

  const [selectedAgente, setSelectedAgente] = useState("");

  const handleSelectAgente = (datosAgenteSelect) => {
    setSelectedAgente(datosAgenteSelect.id);
    cargarDatosAgente(datosAgenteSelect.id);
  };

  // CARGAR GUIAS MASIVAS
  const [selectGuiasMasivas, setSelectGuiasMasivas] = useState([]);

  const cargarGuiasMasivas = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerGuiasMasivas.php"
      );
      const data = await response.json();
      setSelectGuiasMasivas(data);
    } catch (error) {
      console.error("Error fetching agentes:", error);
    }
  };

  const [selectedGuiaMasiva, setSelectedGuiaMasiva] = useState("");

  const handleSelectGuiaMasiva = (datosGuiasMasivas) => {
    setSelectedGuiaMasiva(datosGuiasMasivas.id_orden_servicio_registro_carga);
  };

  // TENER DATO DEL TRANSPORTISTA

  const [selectedTransportista, setSelectedTransportista] = useState("");

  const handleSelectTransportista = (event) => {
    setSelectedTransportista(event.target.value);
  };

  // LISTA ENVIOS SIN TRANSPORTISTA
  const [selectListaEnvios, setSelectListaEnvios] = useState([]);

  const cargarListaEnvios = async (valorExtra) => {
    try {
      let url;
      if (valorExtra) {
        url = `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerListaTransportista.php?id=${valorExtra}`;
      } else {
        url =
          "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerListaEnvios.php";
      }
      const response = await fetch(url);
      const data = await response.json();

      setSelectListaEnvios(data);
    } catch (error) {
      console.error("Error fetching lista envios sin transportista:", error);
    }
  };

  // CARGAR TABLA DESPACHOS

  const [datosDespachos, setDatosDespachos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const cargarDespachos = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerDespachos.php"
      );
      const data = await response.json();
      setDatosDespachos(data);
    } catch (error) {
      console.error("Error fetching agentes:", error);
    }
  };

  // Maneja la búsqueda de datosDespachos
  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  // Filtra datosDespachos según el término de búsqueda
  const filteredDespachos = datosDespachos.filter((datosDespacho) =>
    Object.values(datosDespacho).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDespachos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula números de páginas para la paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredDespachos.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // Maneja el cambio de página en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalItems = filteredDespachos.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [formDespachoValues, setFormDespachoValues] = useState({
    id_transportista_despacho: "",
    guia_transportista_despacho: "",
    conductor_despacho: "",
    id_conductor_despacho: "",
    auxiliar_despacho: "",
    id_auxiliar_despacho: "",
    ubigeo_despacho: "",
    placa_despacho: "",
    tipo_vehiculo_despacho: "",
    id_vehiculo_despacho: "",
    cantidad_bultos_despacho: "",
    peso_total_despacho: "",
    fecha_creado: obtenerFechaActual(),
    id_creador_despacho: localStorage.getItem("id_usuario"),
  });

  const resetFormDespacho = {
    id_transportista_despacho: "",
    guia_transportista_despacho: "",
    conductor_despacho: "",
    id_conductor_despacho: "",
    auxiliar_despacho: "",
    id_auxiliar_despacho: "",
    ubigeo_despacho: "",
    placa_despacho: "",
    tipo_vehiculo_despacho: "",
    id_vehiculo_despacho: "",
    cantidad_bultos_despacho: "",
    peso_total_despacho: "",
    fecha_creado: obtenerFechaActual(),
    id_creador_despacho: localStorage.getItem("id_usuario"),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_transportista_despacho") {
      if (value.trim() === "") {
        setFormDespachoValues({
          ...formDespachoValues,
          [name]: value,
          auxiliar_despacho: "",
          placa_despacho: "",
          tipo_vehiculo_despacho: "",
          conductor_despacho: "",
        });
      } else {
        cargarDatosVehiculo(0);
        setFormDespachoValues({
          ...formDespachoValues,
          [name]: value,
          id_auxiliar_despacho: "",
          id_conductor_despacho: "",
          id_vehiculo_despacho: "",
        });
      }
    } else {
      setFormDespachoValues({
        ...formDespachoValues,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    cargarDespachos();
    cargarGuiasMasivas();
    cargarAgentes();
    cargarGuiasUnitario();
    cargarVehiculos();
    cargarTransportistas();
    cargarConductores();
    cargarAuxiliares();
  }, []);

  // useEffect(() => {
  //   console.log(formDespachoValues);
  // }, [formDespachoValues]);

  useEffect(() => {
    if (selectedTransportista != "") {
      cargarListaEnvios(selectedTransportista);
    } else {
      cargarListaEnvios();
    }
  }, [selectedTransportista]);

  const handleSubmitDespacho = async (event) => {
    event.preventDefault();

    const confirmacion = await Swal.fire({
      title: "¿Está seguro de que desea guardar los datos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirmacion.isConfirmed) {
      // ESTILOS DE PRECARGADO
      Swal.fire({
        allowOutsideClick: false,
        showConfirmButton: false,
        background: "transparent",
        html: `
      <div class="papapa"> 
        <div class="loader1"> 
        <h1 class="guardado" >Guardando...</h1>
        </div>
      
        <div class="loader2">
          <div class="justify-content-center jimu-primary-loading"></div>
        </div>
      </div>
    `,
        onBeforeOpen: () => {
          // Función que se ejecuta antes de que se abra la ventana modal
          Swal.showLoading(); // Muestra una animación de carga dentro de la ventana modal
        },
      });

      try {
        const response = await fetch(
          "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/guardarDespacho.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formDespachoValues),
          }
        );
        const responseData = await response.json();
        if (responseData.success) {
          Swal.fire({
            icon: "success",
            title: responseData.message,
          });
          cargarDespachos();
          setDatosVehiculo([]);
          cargarConductores();
          cargarAuxiliares();
          cargarTransportistas();
          cargarVehiculos();
          setDepartamentoSeleccionado("");
          setProvinciaSeleccionada("");
          setDistritos([]);
          setProvincias([]);
          setFormDespachoValues(resetFormDespacho);
          setSelectedTransportista("");
          cargarListaEnvios(selectedTransportista);
        } else {
          Swal.fire({
            icon: "error",
            title: responseData.message,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud de Red",
        });
        console.log(error);
      }
    }
  };

  return (
    <Home
      children1={
        <>
          <SearchDespacho
            handleSubmitDespacho={handleSubmitDespacho}
            formDespachoValues={formDespachoValues}
            titlle={"Despachos"}
            btntittle={"Crear Manifiesto"}
          />
          <ModalAgregarEnvio
            cargarListaEnvios={cargarListaEnvios}
            cargarGuiasUnitario={cargarGuiasUnitario}
            selectedTransportista={selectedTransportista}
            setSelectedAgente={setSelectedAgente}
            setDatosAgente={setDatosAgente}
            selectedAgente={selectedAgente}
            datosAgente={datosAgente}
            selectAgentes={selectAgentes}
            handleSelectAgente={handleSelectAgente}
            setDatosGuiaUnitaria={setDatosGuiaUnitaria}
            setSelectedGuiaUnitaria={setSelectedGuiaUnitaria}
            selectedGuiaUnitaria={selectedGuiaUnitaria}
            datosGuiaUnitaria={datosGuiaUnitaria}
            handleSelectGuiaUnitaria={handleSelectGuiaUnitaria}
            selectGuiasUnitario={selectGuiasUnitario}
            modalAgregarEnvio={modalAgregarEnvio}
            setModalAgregarEnvios={setModalAgregarEnvios}
          />
          <ModalAgregarMasivo
            cargarListaEnvios={cargarListaEnvios}
            cargarGuiasMasivas={cargarGuiasMasivas}
            selectedTransportista={selectedTransportista}
            setSelectedGuiaMasiva={setSelectedGuiaMasiva}
            selectedGuiaMasiva={selectedGuiaMasiva}
            handleSelectGuiaMasiva={handleSelectGuiaMasiva}
            selectGuiasMasivas={selectGuiasMasivas}
            setSelectedAgente={setSelectedAgente}
            setDatosAgente={setDatosAgente}
            selectedAgente={selectedAgente}
            datosAgente={datosAgente}
            selectAgentes={selectAgentes}
            handleSelectAgente={handleSelectAgente}
            modalAgregarMasivo={modalAgregarMasivo}
            setModalAgregarMasivo={setModalAgregarMasivo}
          />
          <EncabezadoDespacho
            modalEncabezados={modalEncabezados}
            onGuardarColumnas={handleGuardarColumnas}
            setModalEncabezados={setModalEncabezados}
          />
          <ModalAgente
            datosAgentesModal={datosAgentesModal}
            modalAgente={modalAgente}
            setModalAgente={setModalAgente}
          />
        </>
      }
      children2={
        <>
          <div className=" grid grid-cols-[3fr,18rem] ">
            <div className="Contenedores">
              <div className="1 grid grid-row-2">
                <DatosManifiesto
                  distritos={distritos}
                  provinciaSeleccionada={provinciaSeleccionada}
                  provincias={provincias}
                  departamentoSeleccionado={departamentoSeleccionado}
                  handleProvinciaChange={handleProvinciaChange}
                  departamentos={departamentos}
                  handleDepartamentoChange={handleDepartamentoChange}
                  selectedTransportista={selectedTransportista}
                  handleSelectTransportista={handleSelectTransportista}
                  datosVehiculo={datosVehiculo}
                  handleSelectVehiculo={handleSelectVehiculo}
                  selectVehiculos={selectVehiculos}
                  selectTransportistas={selectTransportistas}
                  selectAuxiliares={selectAuxiliares}
                  selectConductores={selectConductores}
                  handleChange={handleChange}
                  fechaActual={obtenerFechaActual}
                  formDespachoValues={formDespachoValues}
                />
                <SearchTabla onSearch={handleSearch} />
                <div className="Table1 rounded-lg">
                  <Table
                    totalItems={totalItems} //Paginacion
                    itemsPerPage={itemsPerPage} //Paginacion
                    currentPage={currentPage} //Paginacion
                    handlePageChange={handlePageChange} //Paginacion
                    despachosActuales={currentItems} // Pasar datos a la tabla
                    despachosFiltrados={filteredDespachos} // Pasar datos a la tabla
                    columnasVisibles={columnasVisibles}
                    mostrarModalEncabezados={mostrarModalEncabezados}
                    mostrarModalAgente={mostrarModalAgente}
                    handleIconHoverAgentes={handleIconHover}
                    handleIconHoverExitAgentes={handleIconHoverExit}
                  />
                </div>
              </div>
            </div>
            <AgregarGuia
              cargarGuiasMasivas={cargarGuiasMasivas}
              cargarGuiasUnitario={cargarGuiasUnitario}
              selectedTransportista={selectedTransportista}
              cargarListaEnvios={cargarListaEnvios}
              selectListaEnvios={selectListaEnvios}
              formDespachoValues={formDespachoValues}
              mostrarModalAgregarEnvio={mostrarModalAgregarEnvio}
              mostrarModalAgregarMasivo={mostrarModalAgregarMasivo}
            />
          </div>
        </>
      }
    />
  );
}

export default HomeDespacho;
