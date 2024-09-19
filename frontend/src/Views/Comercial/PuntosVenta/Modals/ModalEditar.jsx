import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

function ModalEditar({
  modalCotizacion,
  setModalCotizacion,
  id_destino_cotizacion,
  id_cliente,
  id_area,
  cargarListaEnvios,
  datos,
  obtenerValoresDestino,
  onFetchData,
}) {
  // Estado para guardar el tipo de tarifario
  const [tipoTarifario, setTipoTarifario] = useState("");

  // Manejamos el cambio en el tipo de tarifario
  const handleTipoTarifarioChange = (e) => {
    const nuevoTipoTarifario = e.target.value;
    setTipoTarifario(nuevoTipoTarifario);
  };

  // Funcion Ocultar Modal
  const ocultarModal3 = () => {
    setModalCotizacion(false);
  };

  //BACKEND

  // Departamento - Provincia - Distrito / Select
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [distritoSeleccionada, setDistritoSeleccionada] = useState("");

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

  const handleDistritoChange = (event) => {
    const distritoSeleccionado = event.target.value;
    setDistritoSeleccionada(distritoSeleccionado);
  };

  // Tmin - Tmax Entrega
  const [datosTarifario, setDatosTarifario] = useState("");

  useEffect(() => {
    setDatosTarifario("");
    setValorSeleccionado("");
    if (distritoSeleccionada || tipoTarifario) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtenerTarifarioUbigeo.php?id_cliente=${id_cliente}&id_area=${id_area}&ubigeo=${distritoSeleccionada}&tarifario=${tipoTarifario}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDatosTarifario(data);
        });
    }
  }, [distritoSeleccionada, tipoTarifario]);

  // Total Tarifa

  const [cantidadMerc, setCantidadMerc] = useState("");
  const [pesoMerc, setPesoMerc] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [totalTarifa, setTotalTarifa] = useState("");
  const [pesoVolumen, setPesoVolumen] = useState("");
  const [metrosCubicos, setMetrosCubicos] = useState("");
  const [valorSeleccionado, setValorSeleccionado] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://sysdemo.byma-ve.com/BackendApiRest/Comercial/PuntoVenta/totalTarifa.php`,
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
        setTotalTarifa(data.result);
        setPesoVolumen(data.pesoVolumen);
        setMetrosCubicos(data.metrosCubicos);
      } catch (error) {
        console.error("Error al hacer la solicitud a la API:", error);
      }
    };

    if (cantidadMerc !== "" && pesoMerc !== "" && id_destino_cotizacion) {
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

  // Cargos Adicionales
  const [valorMercancia, setValorMercancia] = useState("");
  const [packing, setPacking] = useState("");
  const [costoRetorno, setCostoRetorno] = useState("");
  const [estibaDesestiba, setEstibaDesestiba] = useState("");
  const [montaCarga, setMontaCarga] = useState("");
  const [transporteExtra, setTransporteExtra] = useState("");
  const [totalAdicional, setTotalAdicional] = useState("");
  const [seguroAdicional, setSeguroAdicional] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://sysdemo.byma-ve.com/BackendApiRest/Comercial/PuntoVenta/cargosAdicionales.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              valorMercancia,
              packing,
              costoRetorno,
              estibaDesestiba,
              montaCarga,
              transporteExtra,
            }),
          }
        );

        const data = await response.json();
        setTotalAdicional(data.result);
        setSeguroAdicional(data.seguroAdicional);
      } catch (error) {
        console.error("Error al hacer la solicitud a la API:", error);
      }
    };

    if (valorMercancia !== "") {
      fetchData();
    }
  }, [
    valorMercancia,
    packing,
    costoRetorno,
    estibaDesestiba,
    montaCarga,
    transporteExtra,
  ]);

  // Peso Merc * Cant Merc

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

  // Cargos Adicionales

  const handleValorMercanciaChange = (event) => {
    let valorMercanciaValue = event.target.value;
    if (valorMercanciaValue === "") {
      valorMercanciaValue = 0;
    }
    setValorMercancia(valorMercanciaValue);
  };

  const handlePackingChange = (event) => {
    let packingValue = event.target.value;
    if (packingValue === "") {
      packingValue = 0;
    }
    setPacking(packingValue);
  };

  const handleCostoRetornoChange = (event) => {
    let costoRetornoValue = event.target.value;
    if (costoRetornoValue === "") {
      costoRetornoValue = 0;
    }
    setCostoRetorno(costoRetornoValue);
  };

  const handleEstibaDesestibaChange = (event) => {
    let estibaDesestibaValue = event.target.value;
    if (estibaDesestibaValue === "") {
      estibaDesestibaValue = 0;
    }
    setEstibaDesestiba(estibaDesestibaValue);
  };

  const handleMontaCargaChange = (event) => {
    let montaCargaVAlue = event.target.value;
    if (montaCargaVAlue === "") {
      montaCargaVAlue = 0;
    }
    setMontaCarga(montaCargaVAlue);
  };

  const handleTransporteExtraChange = (event) => {
    let transporteExtraValue = event.target.value;
    if (transporteExtraValue === "") {
      transporteExtraValue = 0;
    }
    setTransporteExtra(transporteExtraValue);
  };

  //Cargar Select de Valorizado

  const [datosValorizado, setDatosValorizado] = useState([]);
  const [optionsValorizado, setOptionsValorizado] = useState([]);


  useEffect(() => {
    if (tipoTarifario === "Valorizada") {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/obtenerTarifarioUbigeo.php?id_cliente=${id_cliente}&id_area=${id_area}&ubigeo=${distritoSeleccionada}&tarifario=${tipoTarifario}`
      )
        .then((response) => response.json())
        // .then((data) => setDatosValorizado(data));
        .then((data) => {
          const formattedOptions = data.map((option) => ({
            value: option.producto_tarifario_cliente_valorizado,
            label: option.producto_tarifario_cliente_valorizado,
          }));
          setOptionsValorizado(formattedOptions);
        });
    }
  }, [tipoTarifario, distritoSeleccionada]);

  // GUARDAR

  const [formulario, setFormulario] = useState({
    consignado_cotizacion_destino: "",
    dni_ruc_cotizacion_destino: "",
    telefono_cotizacion_destino: "",
    telefono_exc_cotizacion_destino: "",
    direccion_cotizacion_destino: "",
    referencias_cotizacion_destino: "",
    tarifario_cotizacion_destino: "",
    ubigeo_cotizacion_destino: "",
    tmin_entrega_cotizacion_destino: 0,
    tmax_entrega_cotizacion_destino: 0,
    tipo_envio_cotizacion_destino: "",
    contenido_mercancia_cotizacion_destino: "",
    peso_mercancia_cotizacion_destino: 0.0,
    total_metros_cubicos_cotizacion_destino: 0.0,
    total_tarifa_cotizacion_destino: 0.0,
    tipo_logistica_cotizacion_destino: "",
    cantidad_mercancia_cotizacion_destino: 0,
    largo_cotizacion_destino: 0.0,
    ancho_cotizacion_destino: 0.0,
    alto_cotizacion_destino: 0.0,
    total_peso_volumen_cotizacion_destino: 0.0,
    valor_mercancia_cotizacion_destino: 0.0,
    packing_cotizacion_destino: 0.0,
    seguro_cotizacion_destino: 0.0,
    monta_carga_cotizacion_destino: 0.0,
    total_adicional_cotizacion_destino: 0.0,
    retorno_cotizacion_destino: 0.0,
    estiba_desestiba_cotizacion_destino: 0.0,
    transporte_extra_cotizacion_destino: 0.0,
    id_creador: localStorage.getItem("id_usuario"),
  });

  useEffect(() => {
    setFormulario({
      consignado_cotizacion_destino: datos?.consignado_cotizacion_destino || "",
      dni_ruc_cotizacion_destino: datos?.dni_ruc_cotizacion_destino || "",
      telefono_cotizacion_destino: datos?.telefono_cotizacion_destino || "",
      telefono_exc_cotizacion_destino:
        datos?.telefono_exc_cotizacion_destino || "",
      direccion_cotizacion_destino: datos?.direccion_cotizacion_destino || "",
      referencias_cotizacion_destino:
        datos?.referencias_cotizacion_destino || "",
      tarifario_cotizacion_destino: datos?.tarifario_cotizacion_destino || "",
      ubigeo_cotizacion_destino: datos?.ubigeo_cotizacion_destino || "",
      tmin_entrega_cotizacion_destino:
        datos?.tmin_entrega_cotizacion_destino || 0,
      tmax_entrega_cotizacion_destino:
        datos?.tmax_entrega_cotizacion_destino || 0,
      tipo_envio_cotizacion_destino: datos?.tipo_envio_cotizacion_destino || "",
      contenido_mercancia_cotizacion_destino:
        datos?.contenido_mercancia_cotizacion_destino || "",
      peso_mercancia_cotizacion_destino:
        datos?.peso_mercancia_cotizacion_destino || 0.0,
      total_metros_cubicos_cotizacion_destino:
        datos?.total_metros_cubicos_cotizacion_destino || 0.0,
      total_tarifa_cotizacion_destino:
        datos?.total_tarifa_cotizacion_destino || 0.0,
      tipo_logistica_cotizacion_destino:
        datos?.tipo_logistica_cotizacion_destino || "",
      cantidad_mercancia_cotizacion_destino:
        datos?.cantidad_mercancia_cotizacion_destino || 0,
      largo_cotizacion_destino: datos?.largo_cotizacion_destino || 0.0,
      ancho_cotizacion_destino: datos?.ancho_cotizacion_destino || 0.0,
      alto_cotizacion_destino: datos?.alto_cotizacion_destino || 0.0,
      total_peso_volumen_cotizacion_destino:
        datos?.total_peso_volumen_cotizacion_destino || 0.0,
      valor_mercancia_cotizacion_destino:
        datos?.valor_mercancia_cotizacion_destino || 0.0,
      packing_cotizacion_destino: datos?.packing_cotizacion_destino || 0.0,
      seguro_cotizacion_destino: datos?.seguro_cotizacion_destino || 0.0,
      monta_carga_cotizacion_destino:
        datos?.monta_carga_cotizacion_destino || 0.0,
      total_adicional_cotizacion_destino:
        datos?.total_adicional_cotizacion_destino || 0.0,
      retorno_cotizacion_destino: datos?.retorno_cotizacion_destino || 0.0,
      estiba_desestiba_cotizacion_destino:
        datos?.estiba_desestiba_cotizacion_destino || 0.0,
      transporte_extra_cotizacion_destino:
        datos?.transporte_extra_cotizacion_destino || 0.0,
      id_creador: localStorage.getItem("id_usuario"),
    });

    const opcionContenidoMercancia = {
      value: datos?.contenido_mercancia_cotizacion_destino,
      label: datos?.contenido_mercancia_cotizacion_destino,
    };

    setDepartamentoSeleccionado(datos?.departamento_id || "");
    setProvinciaSeleccionada(datos?.provincia_id || "");
    setDistritoSeleccionada(datos?.ubigeo_cotizacion_destino || "");
    setTipoTarifario(datos?.tarifario_cotizacion_destino || "");

    setOptionSelect(opcionContenidoMercancia);

    setValorSeleccionado(datos?.contenido_mercancia_cotizacion_destino || "");
    setPesoVolumen(datos?.total_peso_volumen_cotizacion_destino || 0.0);
    setMetrosCubicos(datos?.total_metros_cubicos_cotizacion_destino || 0.0);
    setTotalTarifa(datos?.total_tarifa_cotizacion_destino || 0.0);
    setSeguroAdicional(datos?.seguro_cotizacion_destino || 0.0);
    setTotalAdicional(datos?.total_adicional_cotizacion_destino || 0.0);
    setCantidadMerc(datos?.cantidad_mercancia_cotizacion_destino || 0);
    setPesoMerc(datos?.peso_mercancia_cotizacion_destino || 0.0);
    setLargo(datos?.largo_cotizacion_destino || 0.0);
    setAncho(datos?.ancho_cotizacion_destino || 0.0);
    setAlto(datos?.alto_cotizacion_destino || 0.0);
    setValorMercancia(datos?.valor_mercancia_cotizacion_destino || 0.0);
    setPacking(datos?.packing_cotizacion_destino || 0.0);
    setCostoRetorno(datos?.retorno_cotizacion_destino || 0.0);
    setEstibaDesestiba(datos?.estiba_desestiba_cotizacion_destino || 0.0);
    setMontaCarga(datos?.monta_carga_cotizacion_destino || 0.0);
    setTransporteExtra(datos?.transporte_extra_cotizacion_destino || 0.0);
  }, [datos, modalCotizacion]);

  useEffect(() => {
    if (datosTarifario.length > 0) {
      setFormulario((formularioPrevio) => ({
        ...formularioPrevio,
        tmin_entrega_cotizacion_destino: datosTarifario[0].tmin,
        tmax_entrega_cotizacion_destino: datosTarifario[0].tmax,
        total_peso_volumen_cotizacion_destino: pesoVolumen,
        total_metros_cubicos_cotizacion_destino: metrosCubicos,
        total_tarifa_cotizacion_destino: totalTarifa,
        seguro_cotizacion_destino: seguroAdicional,
        total_adicional_cotizacion_destino: totalAdicional,
      }));
    }
  }, [
    distritoSeleccionada,
    tipoTarifario,
    datosTarifario,
    pesoVolumen,
    metrosCubicos,
    totalTarifa,
    seguroAdicional,
    totalAdicional,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id_cliente && id_area && id_destino_cotizacion) {
      try {
        const response = await fetch(
          "https://sysdemo.byma-ve.com/BackendApiRest/Comercial/PuntoVenta/editarDestino.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formulario,
              id_cliente,
              id_area,
              id_destino_cotizacion,
            }),
          }
        );

        const responseData = await response.json();
        if (responseData.success) {
          Swal.fire({
            icon: "success",
            title: responseData.mensaje,
          });
          onFetchData();
          obtenerValoresDestino(id_destino_cotizacion);
          cargarListaEnvios();
          ocultarModal3();
        } else {
          Swal.fire({
            icon: "error",
            title: responseData.mensaje,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud de Red",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Importar",
      });
    }
  };

  // FUNCION SELECT

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      maxHeight: "23px",
      minHeight: "20px",
      height: "2px",
      fontSize: "12px",
      borderRadius: "5px",
      backgroundColor: "transparent",
      border: "none",
      marginTop: "0",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
      fontSize: "14px",
      margin: "6px 0",
      padding: "2px 0px",
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: "5px",
      padding: "4px 12px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 20px 1px 2px",
      marginTop: "-2px",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta el indicador
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta la barrita al lado del indicador
    }),
  };

  const [optionSelect, setOptionSelect] = useState("");

  const handleSelectChange = (selectedOption) => {
    setOptionSelect(selectedOption);
    setValorSeleccionado(selectedOption.value);
    setFormulario({
      ...formulario,
      contenido_mercancia_cotizacion_destino: selectedOption
        ? selectedOption.value
        : "",
    });
  };

  const handleContMercSelect = (selectedOption) => {
    setValorSeleccionado(selectedOption.value);
    handleSelectChange(selectedOption);
  };

 const customStyles3 = {
   control: (provided, state) => ({
     ...provided,
     maxHeight: "23px",
     minHeight: "20px",
     height: "2px",
     fontSize: "12px",
     borderRadius: "5px",
     backgroundColor: "transparent",
     border: "none",
     marginTop: "0",
   }),
   menuList: (provided) => ({
     ...provided,
     maxHeight: "200px",
     overflowY: "auto",
   }),
   menu: (provided) => ({
     ...provided,
     borderRadius: "5px",
     fontSize: "12px",
     margin: "6px 0",
     padding: "2px 0px",
   }),
   option: (provided, state) => ({
     ...provided,
     borderRadius: "5px",
     padding: "4px 4px",
     maxHeight: "20px",
   }),
   valueContainer: (provided) => ({
     ...provided,
     padding: "0px 20px 1px 2px",
     marginTop: "-2px",
   }),

   dropdownIndicator: (provided, state) => ({
     ...provided,
     display: "none", // Oculta el indicador
   }),
   indicatorSeparator: (provided, state) => ({
     ...provided,
     display: "none", // Oculta la barrita al lado del indicador
   }),
 };
  return (
    <>
      <div
        className={`side-panel-container ${
          modalCotizacion ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex 
        justify-center items-center `}
      >
        <div
          className={`side-panel-cont-container ${
            modalCotizacion ? "translate-y-0" : "translate-y-[600%]"
          } w-[600px] block absolute transition-transform duration-500 -translate-x-10 `}
        >
          <div className="side-panel-content-container p-4">
            <div className="side-panel-iframe h-full w-[655px]">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2 rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Editar</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container text-black">
                    {/* Datos de Destinatario */}
                    <form className="mb-1 text-black" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2   px-4  mr-2  gap-2 mb-2">
                        <h1 className="text-black text-sm  ">
                          Datos de Destinatario
                        </h1>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className=" text-xs ">Consignación</label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            id="consignado_cotizacion_destino"
                            name="consignado_cotizacion_destino"
                            onChange={handleChange}
                            value={formulario.consignado_cotizacion_destino}
                            required
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                            className="uppercase w-[100%]  text-xs  px-1 rounded-sm-sm border h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Tipo-Envio
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <select
                            name="tarifario_cotizacion_destino"
                            id="tarifario_cotizacion_destino"
                            value={formulario.tarifario_cotizacion_destino}
                            onChange={(e) => {
                              handleChange(e);
                              handleTipoTarifarioChange(e);
                            }}
                            required
                            className="w-[100%] text-xs h-5 border  px-1 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                          >
                            <option value="">Elegir Envio</option>
                            <option value="Courrier">Courrier</option>
                            <option value="Aerea">Aerea</option>
                            <option value="Carga">Carga</option>
                            <option value="Valorizada">Valorizada</option>
                          </select>
                        </div>
                        <div className="">
                          <label className="text-black text-xs">RUC/DNI</label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            name="dni_ruc_cotizacion_destino"
                            id="dni_ruc_cotizacion_destino"
                            pattern="^[0-9]+$"
                            onChange={handleChange}
                            value={formulario.dni_ruc_cotizacion_destino}
                            maxLength={11}
                            required
                            className="w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Departamento
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px] border mt-1">
                          <Select
                            styles={customStyles3}
                            className="text-xs ScrollTableVertical "
                            placeholder="Elegir Departamento"
                            options={departamentos.map((departamento) => ({
                              value: departamento.id,
                              label: departamento.nombre_dep,
                            }))}
                            onChange={(selectedOption) =>
                              handleDepartamentoChange({
                                target: {
                                  name: "departamento",
                                  value: selectedOption.value,
                                },
                              })
                            }
                            required
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">Teléfono</label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            id="telefono_cotizacion_destino"
                            name="telefono_cotizacion_destino"
                            required
                            value={formulario.telefono_cotizacion_destino}
                            pattern="^[0-9]+$"
                            onChange={handleChange}
                            maxLength={9}
                            className="w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Provincia
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <select
                            className="w-[100%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                            name="provincia"
                            id="provincia"
                            value={provinciaSeleccionada}
                            onChange={handleProvinciaChange}
                            disabled={!departamentoSeleccionado}
                            required
                          >
                            <option value="">Elegir Provincia</option>
                            {provincias.map((provincia) => (
                              <option
                                className="bg-gray-200"
                                key={provincia.id}
                                value={provincia.id}
                              >
                                {provincia.nombre_prov}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Telefono-Exc
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            required
                            pattern="^[0-9]+$"
                            maxLength={9}
                            onChange={handleChange}
                            value={formulario.telefono_exc_cotizacion_destino}
                            name="telefono_exc_cotizacion_destino"
                            id="telefono_exc_cotizacion_destino"
                            className="w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">Distrito</label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <select
                            className="w-[100%] text-xs h-5 border  px-1 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                            name="ubigeo_cotizacion_destino"
                            id="ubigeo_cotizacion_destino"
                            value={formulario.ubigeo_cotizacion_destino}
                            disabled={!provinciaSeleccionada}
                            onChange={(e) => {
                              handleChange(e);
                              handleDistritoChange(e);
                            }}
                            required
                          >
                            <option value="">Elegir Distrito</option>
                            {distritos.map((distrito) => (
                              <option
                                className="bg-gray-200"
                                key={distrito.id}
                                value={distrito.ubigeo}
                              >
                                {distrito.nombre_dist}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Dirección
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            id="direccion_cotizacion_destino"
                            name="direccion_cotizacion_destino"
                            onChange={handleChange}
                            value={formulario.direccion_cotizacion_destino}
                            required
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                            className="uppercase w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Tmin-Extrega
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            id="tmin_entrega_cotizacion_destino"
                            name="tmin_entrega_cotizacion_destino"
                            onChange={handleChange}
                            readOnly
                            value={
                              datosTarifario.length > 0
                                ? datosTarifario[0].tmin
                                : "No existe Tarifario"
                            }
                            className="w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Referencias
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            type="text"
                            id="referencias_cotizacion_destino"
                            name="referencias_cotizacion_destino"
                            onChange={handleChange}
                            value={formulario.referencias_cotizacion_destino}
                            required
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                            className="uppercase w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Tmax-Extrega
                          </label>
                        </div>
                        <div className="ml-[-25px] mr-[20px]">
                          <input
                            readOnly
                            value={
                              datosTarifario.length > 0
                                ? datosTarifario[0].tmax
                                : "No existe Tarifario"
                            }
                            type="text"
                            onChange={handleChange}
                            id="tmax_entrega_cotizacion_destino"
                            name="tmax_entrega_cotizacion_destino"
                            className="w-[100%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                      </div>

                      {/* Datos de Mercancia */}
                      <div className="grid grid-cols-2   px-4  mr-2  gap-2 mb-2">
                        <label className="text-black text-sm  ">
                          Datos de Mercancia
                        </label>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className="text-black text-xs ">
                            Tipo-Movimiento
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <select
                            name="tipo_envio_cotizacion_destino"
                            id="tipo_envio_cotizacion_destino"
                            required
                            value={formulario.tipo_envio_cotizacion_destino}
                            onChange={handleChange}
                            className="w-[90%] h-5 text-xs border border-gray-300  px-1 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                          >
                            <option value="">Elegir...</option>
                            <option value="Terrestre">Terrestre</option>
                            <option value="Aereo">Aereo</option>
                            <option value="Fluvial">Fluvial</option>
                          </select>
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Tipo-Logística
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <select
                            value={formulario.tipo_logistica_cotizacion_destino}
                            name="tipo_logistica_cotizacion_destino"
                            id="tipo_logistica_cotizacion_destino"
                            required
                            onChange={handleChange}
                            className="w-[90%] h-5 text-xs border border-gray-300  px-1 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                          >
                            <option value="">Elegir...</option>
                            <option value="Nacional">Nacional</option>
                            <option value="Local">Local</option>
                            <option value="Inversa">Inversa</option>
                            <option value="Transito">Transito</option>
                          </select>
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Contenido-Merc
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          {tipoTarifario === "Valorizada" ? (
                            <Select
                              name="contenido_mercancia_cotizacion_destino"
                              id="contenido_mercancia_cotizacion_destino"
                              value={optionSelect}
                              styles={customStyles}
                              className="w-[90%] react-select-container border   rounded-sm mt-[2px] focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                              classNamePrefix="react-select"
                              options={optionsValorizado}
                              onChange={handleContMercSelect}
                              required
                            />
                          ) : (
                            <input
                              type="text"
                              required
                              value={
                                formulario.contenido_mercancia_cotizacion_destino
                              }
                              onChange={handleChange}
                              name="contenido_mercancia_cotizacion_destino"
                              id="contenido_mercancia_cotizacion_destino"
                              className="uppercase w-[90%] border  px-1 rounded-sm text-xs h-5 focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                            />
                          )}
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Cant-Merc
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            name="cantidad_mercancia_cotizacion_destino"
                            id="cantidad_mercancia_cotizacion_destino"
                            value={
                              formulario.cantidad_mercancia_cotizacion_destino
                            }
                            onChange={(e) => {
                              handleChange(e);
                              handleCantMercChange(e);
                            }}
                            required
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Peso-Merc:
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            step="0.0001"
                            value={formulario.peso_mercancia_cotizacion_destino}
                            name="peso_mercancia_cotizacion_destino"
                            id="peso_mercancia_cotizacion_destino"
                            required
                            onChange={(e) => {
                              handleChange(e);
                              handlePesoMercChange(e);
                            }}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            placeholder="P-U"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Total P-Vol:
                          </label>
                        </div>
                        <div className="ml-[-25px]  flex w-[105%] ">
                          <input
                            type="number"
                            value={formulario.largo_cotizacion_destino}
                            id="largo_cotizacion_destino"
                            name="largo_cotizacion_destino"
                            onChange={(e) => {
                              handleChange(e);
                              handleLargoChange(e);
                            }}
                            placeholder="L"
                            step="0.0001"
                            className="w-[90%] mt-1 border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                          <input
                            type="number"
                            value={formulario.ancho_cotizacion_destino}
                            id="ancho_cotizacion_destino"
                            name="ancho_cotizacion_destino"
                            onChange={(e) => {
                              handleChange(e);
                              handleAnchoChange(e);
                            }}
                            placeholder="An"
                            step="0.0001"
                            className="w-[90%] mt-1 border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                          <input
                            type="number"
                            onChange={(e) => {
                              handleChange(e);
                              handleAltoChange(e);
                            }}
                            value={formulario.alto_cotizacion_destino}
                            id="alto_cotizacion_destino"
                            placeholder="Al"
                            step="0.0001"
                            name="alto_cotizacion_destino"
                            className="w-[90%] mt-1 border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                          <input
                            type="text"
                            onChange={handleChange}
                            id="total_peso_volumen_cotizacion_destino"
                            placeholder="Total"
                            name="total_peso_volumen_cotizacion_destino"
                            value={pesoVolumen}
                            readOnly
                            className="w-[90%] mt-1 border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Total M3:
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="text"
                            onChange={handleChange}
                            id="total_metros_cubicos_cotizacion_destino"
                            name="total_metros_cubicos_cotizacion_destino"
                            value={metrosCubicos}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Valor-Mercancía
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="valor_mercancia_cotizacion_destino"
                            required
                            value={
                              formulario.valor_mercancia_cotizacion_destino
                            }
                            onChange={(e) => {
                              handleChange(e);
                              handleValorMercanciaChange(e);
                            }}
                            name="valor_mercancia_cotizacion_destino"
                            step="0.0001"
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            placeholder="S/."
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Total Tarifa
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="text"
                            onChange={handleChange}
                            id="total_tarifa_cotizacion_destino"
                            value={totalTarifa}
                            name="total_tarifa_cotizacion_destino"
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            placeholder="S/."
                            readOnly
                          />
                        </div>
                      </div>

                      {/* CARGOS ADICIONALES */}
                      <div className="grid grid-cols-2   px-4  mr-2  gap-2 my-2">
                        <h1 className="text-black text-sm  ">
                          Cargos Adicionales
                        </h1>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className="text-black text-xs ">Packing</label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="packing_cotizacion_destino"
                            name="packing_cotizacion_destino"
                            step="0.0001"
                            value={formulario.packing_cotizacion_destino}
                            onChange={(e) => {
                              handleChange(e);
                              handlePackingChange(e);
                            }}
                            className="w-[90%]  text-xs  border  px-1  rounded-sm  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Costo-Retorno
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="retorno_cotizacion_destino"
                            name="retorno_cotizacion_destino"
                            step="0.0001"
                            value={formulario.retorno_cotizacion_destino}
                            onChange={(e) => {
                              handleChange(e);
                              handleCostoRetornoChange(e);
                            }}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Seguro 0.1%
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            readOnly
                            type="text"
                            id="seguro_cotizacion_destino"
                            name="seguro_cotizacion_destino"
                            value={seguroAdicional}
                            onChange={handleChange}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Estiba/Destiba
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="estiba_desestiba_cotizacion_destino"
                            name="estiba_desestiba_cotizacion_destino"
                            step="0.0001"
                            value={
                              formulario.estiba_desestiba_cotizacion_destino
                            }
                            onChange={(e) => {
                              handleChange(e);
                              handleEstibaDesestibaChange(e);
                            }}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Monta Carga
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="monta_carga_cotizacion_destino"
                            name="monta_carga_cotizacion_destino"
                            value={formulario.monta_carga_cotizacion_destino}
                            step="0.0001"
                            onChange={(e) => {
                              handleChange(e);
                              handleMontaCargaChange(e);
                            }}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Transporte Extra
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            type="number"
                            id="transporte_extra_cotizacion_destino"
                            name="transporte_extra_cotizacion_destino"
                            step="0.0001"
                            value={
                              formulario.transporte_extra_cotizacion_destino
                            }
                            onChange={(e) => {
                              handleChange(e);
                              handleTransporteExtraChange(e);
                            }}
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className="text-black text-xs">
                            Total Adicionales
                          </label>
                        </div>
                        <div className="ml-[-25px]">
                          <input
                            readOnly
                            value={totalAdicional}
                            type="text"
                            onChange={handleChange}
                            id="total_adicional_cotizacion_destino"
                            name="total_adicional_cotizacion_destino"
                            className="w-[90%] border  px-1  rounded-sm text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-6 h-5">
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            ocultarModal3();
                          }}
                          type="button"
                          className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ModalEditar;
