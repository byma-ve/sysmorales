import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Home from "../../../Layout/Home";
import { SearchOperaciones } from "./Components/SearchOperaciones";
import { DatosRemitente } from "./Components/DatosRemitente";
import { DatosMercancia } from "./Components/DatosMercancia";
import { DatosDestinatarios } from "./Components/DatosDestinatarios";
import { Documento } from "./Components/Documento";
import { ListaEnvios } from "./Components/ListaEnvios";
function HomeCarga() {
  const [opcionesBuscadas, setOpcionesBuscadas] = useState([]);

  const [opcionesRegistro, setOpcionesRegistro] = useState([]);

  const cargarOpciones = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/obtenerRegistrosCarga.php"
      );
      const data = await response.json();
      setOpcionesRegistro(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarOpciones();
  }, []);

  const [datosRegistro, setDatosRegistro] = useState([]);

  const cargarDatosRegistro = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/obtenerRegistro.php?id_orden_servicio_id_destino=${value}`
      );
      const data = await response.json();
      setDatosRegistro(data);
    } catch (error) {
      console.error("Error cargar datos registro:", error);
    }
  };

  const [datosNumeroRegistro, setDatosNumeroRegistro] = useState([]);

  const cargarDatosNumeroRegistro = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/obtenerDatosNumeroRegistro.php?id_orden_servicio_id_destino=${value}`
      );
      const data = await response.json();
      setDatosNumeroRegistro(data);
    } catch (error) {
      console.error("Error cargar datos registro fecha y numero:", error);
    }
  };

  const [opcionSeleccionado, setOpcionSeleccionado] = useState("");

  const handleSelectRegistro = (event) => {
    cargarDatosRegistro(event.target.value);
    cargarDatosNumeroRegistro(event.target.value);
    setOpcionSeleccionado(event.target.value);
  };

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    return `${fechaActual.getFullYear()}-${mes}-${dia}`;
  };

  const [formValues, setFormValues] = useState({
    id_orden_servicio_registro_carga: "",
    id_cliente_registro_carga: "",
    id_area_registro_carga: "",
    id_destino_registro_carga: "",
    peso_mercancia: "",
    cantidad_mercancia: "",
    largo: "",
    ancho: "",
    alto: "",
    total_peso_volumen: "",
    total_metros_cubicos: "",
    total_tarifa: "",
    valor_mercancia: "",
    guia_transportista: "",
    guia_remision: "",
    documento_1: "",
    documento_2: "",
    tarifario: "",
    id_creador_registro_carga: localStorage.getItem("id_usuario"),
    fecha_creado: "",
  });

  useEffect(() => {
    setFormValues({
      id_orden_servicio_registro_carga: datosRegistro?.id_orden_servicio || "",
      id_cliente_registro_carga: datosRegistro?.id_cliente || "",
      id_area_registro_carga: datosRegistro?.id_area || "",
      id_destino_registro_carga: datosRegistro?.id || "",
      peso_mercancia: datosRegistro?.peso_mercancia || "",
      cantidad_mercancia: datosRegistro?.cantidad_mercancia || "",
      largo: datosRegistro?.largo || "",
      ancho: datosRegistro?.ancho || "",
      alto: datosRegistro?.alto || "",
      total_peso_volumen: datosRegistro?.total_peso_volumen || "",
      total_metros_cubicos: datosRegistro?.total_metros_cubicos || "",
      total_tarifa: datosRegistro?.total_tarifa || "",
      valor_mercancia: datosRegistro?.valor_mercancia || "",
      guia_transportista: datosRegistro?.guia_transportista || "",
      guia_remision: datosRegistro?.guia_remision || "",
      documento_1: datosRegistro?.documento_1 || "",
      documento_2: datosRegistro?.documento_2 || "",
      tarifario: datosRegistro?.tarifario || "",
      id_creador_registro_carga: localStorage.getItem("id_usuario"),
      fecha_creado: datosNumeroRegistro?.fecha_creado || obtenerFechaActual(),
    });
    setValorSeleccionado(datosRegistro?.contenido_mercancia || "");
    setTipoTarifario(datosRegistro?.tarifario || "");
    setDistritoSeleccionada(datosRegistro?.ubigeo || "");
    setId_Cliente(datosRegistro?.id_cliente || "");
    setId_Area(datosRegistro?.id_area || "");
    setCantidadMerc(datosRegistro?.cantidad_mercancia || "");
    setPesoMerc(datosRegistro?.peso_mercancia || "");
    setLargo(datosRegistro?.largo || "");
    setAncho(datosRegistro?.ancho || "");
    setAlto(datosRegistro?.alto || "");
  }, [datosRegistro, datosNumeroRegistro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // OPERACIONES

  const [cantidadMerc, setCantidadMerc] = useState("");
  const [pesoMerc, setPesoMerc] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [pesoVolumen, setPesoVolumen] = useState("");
  const [metrosCubicos, setMetrosCubicos] = useState("");
  const [valorSeleccionado, setValorSeleccionado] = useState(""); //Producto por si es valorizado
  const [tipoTarifario, setTipoTarifario] = useState("");
  const [distritoSeleccionada, setDistritoSeleccionada] = useState("");
  const [id_area, setId_Area] = useState("");
  const [id_cliente, setId_Cliente] = useState(""); //Seleccionar Cliente
  const [totalTarifa, setTotalTarifa] = useState("");

  useEffect(() => {
    setFormValues((formularioPrevio) => ({
      ...formularioPrevio,
      total_peso_volumen: pesoVolumen,
      total_metros_cubicos: metrosCubicos,
      total_tarifa: totalTarifa,
    }));
  }, [distritoSeleccionada, tipoTarifario, pesoVolumen, metrosCubicos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroEnvio/totalTarifa.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cantidadMerc,
              pesoMerc,
              largo,
              ancho,
              alto,
              distritoSeleccionada,
              id_cliente,
              id_area,
              tipoTarifario,
              valorSeleccionado,
            }),
          }
        );

        const data = await response.json();
        setPesoVolumen(data.pesoVolumen);
        setMetrosCubicos(data.metrosCubicos);
        setTotalTarifa(data.result);
      } catch (error) {
        console.error("Error al hacer la solicitud a la API:", error);
      }
    };

    if (cantidadMerc !== "" && pesoMerc !== "") {
      fetchData();
    }
  }, [
    cantidadMerc,
    pesoMerc,
    largo,
    ancho,
    alto,
    distritoSeleccionada,
    tipoTarifario,
    valorSeleccionado,
  ]);

  const handleCantMercChange = (event) => {
    let cantidadMercancia = event.target.value;
    if (cantidadMercancia === "") {
      cantidadMercancia = 0;
    }
    setCantidadMerc(cantidadMercancia);
  };

  const handlePesoMercChange = (event) => {
    let pesoMercancia = event.target.value;
    if (pesoMercancia === "") {
      pesoMercancia = 0;
    }
    setPesoMerc(pesoMercancia);
  };

  // METRO CUBICOS

  const handleLargoChange = (event) => {
    let largoValue = event.target.value;
    if (largoValue === "") {
      largoValue = 0;
    }
    setLargo(largoValue);
  };

  const handleAnchoChange = (event) => {
    let anchoValue = event.target.value;
    if (anchoValue === "") {
      anchoValue = 0;
    }
    setAncho(anchoValue);
  };

  const handleAltoChange = (event) => {
    let altoValue = event.target.value;
    if (altoValue === "") {
      altoValue = 0;
    }
    setAlto(altoValue);
  };

  const resetFormData = () => {
    setFormValues({
      id_orden_servicio_registro_carga: "",
      id_cliente_registro_carga: "",
      id_area_registro_carga: "",
      id_destino_registro_carga: "",
      peso_mercancia: "",
      cantidad_mercancia: "",
      largo: "",
      ancho: "",
      alto: "",
      total_peso_volumen: "",
      total_metros_cubicos: "",
      valor_mercancia: "",
      guia_transportista: "",
      guia_remision: "",
      documento_1: "",
      documento_2: "",
      tarifario: "",
      id_creador_registro_carga: localStorage.getItem("id_usuario"),
      fecha_creado: "",
    });
    setPesoVolumen("");
    setMetrosCubicos("");
    setValorSeleccionado("");
    setTipoTarifario("");
    setDistritoSeleccionada("");
    setId_Cliente("");
    setId_Area("");
    setCantidadMerc("");
    setPesoMerc("");
    setLargo("");
    setAncho("");
    setAlto("");
    setTotalTarifa("");
  };

  //Guardar
  const handleFormSubmit = async (event) => {
    event.preventDefault();
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
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/guardarRegistro.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        resetFormData();
        setDatosRegistro([]);
        setDatosNumeroRegistro([]);
        setOpcionSeleccionado("");
        setOpcionesRegistro([]);
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
    cargarOpciones();
  };

  //Guardar MASIVO
  const handleFormSubmitMasivo = async (event) => {
    event.preventDefault();
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
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/guardarRegistrosMasivo.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(opcionesBuscadas),
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        resetFormData();
        setDatosRegistro([]);
        setDatosNumeroRegistro([]);
        setOpcionSeleccionado("");
        setOpcionesRegistro([]);
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      console.log(responseData.datos);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Red",
      });
      console.log(error);
    }
    cargarOpciones();
  };

  return (
    <Home
      children1={
        <>
          <SearchOperaciones
            handleFormSubmitMasivo={handleFormSubmitMasivo}
            opcionesBuscadas={opcionesBuscadas}
            opcionSeleccionado={opcionSeleccionado}
            titlle={"Registro de Guias"}
            handleFormSubmit={handleFormSubmit}
          />
        </>
      }
      children2={
        <>
          <div className="flex ">
            <div className="w-[76%] ">
              <div className="Contenedores rounded-xl mr-4 bg-white ">
                <div className="1 grid grid-row-2    ">
                  <DatosRemitente
                    datosRegistro={datosRegistro}
                    formValues={formValues}
                  />
                  <DatosMercancia
                    metrosCubicos={metrosCubicos}
                    pesoVolumen={pesoVolumen}
                    handleAltoChange={handleAltoChange}
                    handleAnchoChange={handleAnchoChange}
                    handleLargoChange={handleLargoChange}
                    handlePesoMercChange={handlePesoMercChange}
                    handleCantMercChange={handleCantMercChange}
                    handleChange={handleChange}
                    datosRegistro={datosRegistro}
                    formValues={formValues}
                  />
                </div>
                <div className="2 grid grid-row-2">
                  <DatosDestinatarios
                    datosRegistro={datosRegistro}
                    formValues={formValues}
                  />
                  <Documento
                    handleChange={handleChange}
                    datosRegistro={datosRegistro}
                    formValues={formValues}
                  />
                </div>
              </div>
            </div>
            <div className="w-[24%]">
              <ListaEnvios
                setOpcionesBuscadas={setOpcionesBuscadas}
                opcionesRegistro={opcionesRegistro}
                onSelectChange={handleSelectRegistro}
              />
            </div>
          </div>
        </>
      }
    />
  );
}

export default HomeCarga;
