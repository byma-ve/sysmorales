import { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import {
  IconoCamion,
  IconoCamionVerde,
  IconoBox,
  IconoBoxRed,
  IconoBoxGreen,
  IconoRecojos,
} from "../../../Iconos/Iconos-NavBar";
import { ModalDatosColaboradores } from "./Modals/ModalDatosColaboradores";
import { ModalInstancia } from "./Modals/ModalInstancia";
import { ModalInstancia2 } from "./Modals/ModalInstancia2";
import { ModalInstancia3 } from "./Modals/ModalInstancia3";
import ModalImagenes from "./Modals/ModalImagenes";
import ModalImagen from "./Modals/ModalImagen";
import ModalCargos from "./Modals/ModalCargos";
const EncabEstado1 = [
  "Guía Madre",
  "Proceso",
  "Estado Mercancia",
  "Fecha Estado",
  "Comentario",
];

const EncabEstado2 = [
  "Instancia",
  "Proceso",
  "Estado Mercancia",
  "Fecha Estado",
];

function HomeEstados() {
  const [showModal, setShowModal] = useState(false);
  // Visibilidad del Modal Datos Colaboradores(IconoCamion)
  const [modalDatos, setModalDatos] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  // Funcionalidad Modal Datos Colaboradores(IconoCamion)
  const mostrarModal3 = () => {
    handleCloseModal();
    setModalDatos(true);
  };

  // Visibilidad del Modal Datos Instancia(IconoCajita)
  const [modalInstancia, setModalInstancia] = useState(false);

  // Funcionalidad Modal Datos Colaboradores(IconoCamion)
  const mostrarModalInstancia = () => {
    handleCloseModal();
    setModalInstancia(true);
  };
  // Visibilidad del Modal Datos Instancia(IconoCajita)
  const [modalInstancia2, setModalInstancia2] = useState(false);

  // Funcionalidad Modal Datos Colaboradores(IconoCamion)
  const mostrarModalInstancia2 = () => {
    handleCloseModal();
    setModalInstancia2(true);
  };
  // Visibilidad del Modal Datos Instancia(IconoCajita)
  const [modalInstancia3, setModalInstancia3] = useState(false);

  // Funcionalidad Modal Datos Colaboradores(IconoCamion)
  const mostrarModalInstancia3 = () => {
    handleCloseModal();
    setModalInstancia3(true);
  };

  // BACKEND ESTADO RECOJOS
  const [datosSelect, setDatosSelect] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [opcionRecojoSeleccionado, setOpcionRecojoSeleccionado] =
    useState(null);
  const [datosOrdenServicio, setDatosOrdenServicio] = useState("");

  const cargarSelect = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoRecojos/obtenerRecojos.php"
      );
      const data = await response.json();
      setDatosSelect(data);
    } catch (error) {
      console.error("Error fetching datos del select:", error);
    }
  };

  useEffect(() => {
    cargarSelect();
    cargarSelectGuia();
  }, []);

  const handleBuscadorChange = (event) => {
    setFiltro(event.target.value);
  };

  useEffect(() => {
    if (opcionRecojoSeleccionado) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoRecojos/obtenerRecojo.php?id_orden_servicio=${opcionRecojoSeleccionado}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDatosOrdenServicio(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [opcionRecojoSeleccionado]);

  // BACKEND ESTADO GUIAS

  const [datosSelectGuias, setDatosSelectGuias] = useState([]);
  const [filtroGuias, setFiltroGuias] = useState("");
  const [opcionRecojoSeleccionadoGuia, setOpcionRecojoSeleccionadoGuia] =
    useState(null);
  const [datosIntento1, setDatosIntento1] = useState("");
  const [datosIntento2, setDatosIntento2] = useState("");
  const [datosIntento3, setDatosIntento3] = useState("");

  const cargarSelectGuia = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoGuias/obtenerGuias.php"
      );
      const data = await response.json();
      setDatosSelectGuias(data);
    } catch (error) {
      console.error("Error fetching datos del select guias:", error);
    }
  };

  const handleBuscadorChangeGuia = (event) => {
    setFiltroGuias(event.target.value);
  };

  // DATOS INTENTO 1
  useEffect(() => {
    if (opcionRecojoSeleccionadoGuia) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoGuias/obtenerIntento1.php?id_registro_carga=${opcionRecojoSeleccionadoGuia}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDatosIntento1(data);
        })
        .catch((error) => console.error("Error fetching data guias:", error));
    }
  }, [opcionRecojoSeleccionadoGuia]);

  // DATOS INTENTO 2
  useEffect(() => {
    if (opcionRecojoSeleccionadoGuia) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoGuias/obtenerIntento2.php?id_registro_carga=${opcionRecojoSeleccionadoGuia}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDatosIntento2(data);
        })
        .catch((error) => console.error("Error fetching data guias:", error));
    }
  }, [opcionRecojoSeleccionadoGuia]);

  // DATOS INTENTO 3
  useEffect(() => {
    if (opcionRecojoSeleccionadoGuia) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoGuias/obtenerIntento3.php?id_registro_carga=${opcionRecojoSeleccionadoGuia}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDatosIntento3(data);
        })
        .catch((error) => console.error("Error fetching data guias:", error));
    }
  }, [opcionRecojoSeleccionadoGuia]);

  return (
    <Home
      children1={
        <>
          <ModalDatosColaboradores
            setDatosOrdenServicio={setDatosOrdenServicio}
            setOpcionRecojoSeleccionado={setOpcionRecojoSeleccionado}
            setDatosSelect={setDatosSelect}
            cargarSelect={cargarSelect}
            datosOrdenServicio={datosOrdenServicio}
            modalDatos={modalDatos}
            setModalDatos={setModalDatos}
          />
          <ModalInstancia
            cargarSelectGuia={cargarSelectGuia}
            setDatosSelectGuias={setDatosSelectGuias}
            setOpcionRecojoSeleccionadoGuia={setOpcionRecojoSeleccionadoGuia}
            setDatosIntento1={setDatosIntento1}
            setDatosIntento2={setDatosIntento2}
            setDatosIntento3={setDatosIntento3}
            datosIntento1={datosIntento1}
            num_guia={opcionRecojoSeleccionadoGuia}
            modalInstancia={modalInstancia}
            setModalInstancia={setModalInstancia}
          />
          <ModalInstancia2
            cargarSelectGuia={cargarSelectGuia}
            setDatosSelectGuias={setDatosSelectGuias}
            setOpcionRecojoSeleccionadoGuia={setOpcionRecojoSeleccionadoGuia}
            setDatosIntento1={setDatosIntento1}
            setDatosIntento2={setDatosIntento2}
            setDatosIntento3={setDatosIntento3}
            datosIntento2={datosIntento2}
            num_guia={opcionRecojoSeleccionadoGuia}
            modalInstancia2={modalInstancia2}
            setModalInstancia2={setModalInstancia2}
          />
          <ModalInstancia3
            cargarSelectGuia={cargarSelectGuia}
            setDatosSelectGuias={setDatosSelectGuias}
            setOpcionRecojoSeleccionadoGuia={setOpcionRecojoSeleccionadoGuia}
            setDatosIntento1={setDatosIntento1}
            setDatosIntento2={setDatosIntento2}
            setDatosIntento3={setDatosIntento3}
            datosIntento3={datosIntento3}
            num_guia={opcionRecojoSeleccionadoGuia}
            modalInstancia3={modalInstancia3}
            setModalInstancia3={setModalInstancia3}
          />

          <h1 className="-mt-[18px] text-white text-3xl font-semibold py-2">
            Estados
          </h1>
        </>
      }
      children2={
        <>
          <div className="">
            {/* ESTADO RECOJOS */}
            <div className="grid grid-cols-[20%,3fr]">
              <div className="Guia Madre  mr-4">
                <div className="side-panel-iframe  mb-2 ">
                  <div className="side-panel-iframe  rounded-md  ">
                    <div className="side-panel bg-[#fff]     rounded-lg  ">
                      <div className="side-cont-titulo uppercase py-2 pl-5 pr-4 mb-2 font-semibold  bg-blue-400 rounded-t-lg text-white">
                        <div className="side-titulo flex justify-between">
                          <h1 className="side-txt ">Guía Madre</h1>
                          <button
                            className={`flex text-2xl ${
                              !(
                                opcionRecojoSeleccionado &&
                                opcionRecojoSeleccionado
                              )
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                            onClick={mostrarModal3}
                            disabled={!opcionRecojoSeleccionado}
                          >
                            {datosOrdenServicio.estado_mercancia_estado_recojo ===
                            "Exitoso" ? (
                              <IconoCamionVerde />
                            ) : (
                              <IconoCamion />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="section-crm mx-5 w-[90%]  ">
                        <input
                          className="w-[95%] pl-1 text-gray-400  text-sm  border rounded-sm  focus:outline-none focus:ring-2 ring-1 focus:border-blue-500  "
                          placeholder="Buscar Guía Madre"
                          value={filtro}
                          onChange={handleBuscadorChange}
                        />
                        <select
                          multiple
                          id="select_recojos"
                          name="select_recojos"
                          onChange={(e) =>
                            setOpcionRecojoSeleccionado(e.target.value)
                          }
                          className="bg-white pl-1 border mx-auto my-3 focus:outline-none focus:ring-2 h-[20vh] w-[95%] overflow-y ScrollTable overflow-ellipsis text-sm ring-1  text-gray-400  "
                        >
                          {datosSelect
                            .filter((recojo) =>
                              recojo.id_orden_servicio_recojo.includes(filtro)
                            )
                            .map((recojo) => (
                              <option
                                key={recojo.id_orden_servicio_recojo}
                                value={recojo.id_orden_servicio_recojo}
                              >
                                {recojo.id_orden_servicio_recojo}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Table1 mb-2 rounded-lg">
                <div className="w-[full] overflow-x-auto bg-[#fff] ScrollTable rounded-lg overflow-y-hidden">
                  <table className="w-[100%]  table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 whitespace-nowrap ">
                    <thead
                      className=" text-xs border-b border-gray-300 text-white uppercase
                      bg-blue-400"
                    >
                      <tr>
                        {EncabEstado1.map((header, index) => (
                          <th key={index} scope="col" className="px-6 py-3">
                            {header}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center">Imagen</th>
                      </tr>
                    </thead>
                    <tbody className=" text-[#535c69]">
                      <tr className="bg-[#fff] border-b border-gray-300  ">
                        <td className="px-6 py-3">
                          {datosOrdenServicio?.id_orden_servicio_estado_recojo ||
                            ""}
                        </td>
                        <td className="px-6 py-3">
                          {(
                            datosOrdenServicio?.proceso_estado_recojo || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {(
                            datosOrdenServicio?.estado_mercancia_estado_recojo ||
                            ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {datosOrdenServicio?.fecha_creado || ""}
                        </td>
                        <td className="px-6 py-3">
                          {datosOrdenServicio?.comentario_estado_recojo || ""}
                        </td>
                        <td className="px-11  text-center ">
                          {datosOrdenServicio?.imagen_estado_recojo ? (
                            // <a
                            //   href={datosOrdenServicio.imagen_estado_recojo}
                            //   target="_blank"
                            // >
                            <ModalImagen datos={datosOrdenServicio} />
                          ) : // </a>
                          null}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* ESTADO GUÍAS */}
            <div className="grid grid-cols-[20%,3fr]">
              <div className="Lista Envios2  mr-4">
                <div className="side-panel-iframe   ">
                  <div className="side-panel-iframe  rounded-md  ">
                    <div className="side-panel bg-[#fff]     rounded-lg  ">
                      <div className="side-cont-titulo  uppercase font-semibold text-white">
                        <div className="side-titulo py-2 px-5 mb-2 bg-blue-400 rounded-t-lg flex justify-between">
                          <h1 className="side-txt ">Tracking</h1>
                          <div className="flex">
                            {opcionRecojoSeleccionadoGuia &&
                            opcionRecojoSeleccionadoGuia ? (
                              datosIntento1.proceso_estado_guia ===
                              "entregado" ? (
                                <IconoBoxGreen
                                  className="cursor-pointer"
                                  onClick={mostrarModalInstancia}
                                />
                              ) : datosIntento1.proceso_estado_guia ===
                                "motivado" ? (
                                <IconoBoxRed className="cursor-not-allowed" />
                              ) : (
                                <IconoBox
                                  className="cursor-pointer"
                                  onClick={mostrarModalInstancia}
                                />
                              )
                            ) : (
                              <IconoBox className="cursor-not-allowed" />
                            )}

                            {opcionRecojoSeleccionadoGuia &&
                            opcionRecojoSeleccionadoGuia ? (
                              datosIntento1.proceso_estado_guia ===
                              "entregado" ? (
                                <IconoBox className="mx-1 cursor-not-allowed" />
                              ) : !datosIntento1.proceso_estado_guia ? (
                                <IconoBox className="mx-1 cursor-not-allowed" />
                              ) : datosIntento2.proceso_estado_guia ===
                                "entregado" ? (
                                <IconoBoxGreen
                                  className="mx-1 cursor-pointer"
                                  onClick={mostrarModalInstancia2}
                                />
                              ) : datosIntento2.proceso_estado_guia ===
                                "motivado" ? (
                                <IconoBoxRed className="mx-1 cursor-not-allowed" />
                              ) : (
                                <IconoBox
                                  className="mx-1 cursor-pointer"
                                  onClick={mostrarModalInstancia2}
                                />
                              )
                            ) : (
                              <IconoBox className="mx-1 cursor-not-allowed" />
                            )}

                            {opcionRecojoSeleccionadoGuia &&
                            opcionRecojoSeleccionadoGuia ? (
                              datosIntento1.proceso_estado_guia ===
                              "entregado" ? (
                                <IconoBox className="cursor-not-allowed" />
                              ) : !datosIntento1.proceso_estado_guia ? (
                                <IconoBox className="cursor-not-allowed" />
                              ) : datosIntento2.proceso_estado_guia ===
                                "entregado" ? (
                                <IconoBox className="cursor-not-allowed" />
                              ) : !datosIntento2.proceso_estado_guia ? (
                                <IconoBox className="cursor-not-allowed" />
                              ) : datosIntento3.proceso_estado_guia ===
                                "entregado" ? (
                                <IconoBoxGreen
                                  className="cursor-pointer"
                                  onClick={mostrarModalInstancia3}
                                />
                              ) : datosIntento3.proceso_estado_guia ===
                                "motivado" ? (
                                <IconoBoxRed
                                  className="cursor-pointer"
                                  onClick={mostrarModalInstancia3}
                                />
                              ) : (
                                <IconoBox
                                  className="cursor-pointer"
                                  onClick={mostrarModalInstancia3}
                                />
                              )
                            ) : (
                              <IconoBox className="cursor-not-allowed" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="section-crm mx-5 w-[90%]  ">
                        <input
                          className="w-[95%] pl-1 text-gray-400  text-sm  border rounded-sm  focus:outline-none focus:ring-2 ring-1 focus:border-blue-500  "
                          placeholder="Buscar N° Guia"
                          value={filtroGuias}
                          onChange={handleBuscadorChangeGuia}
                        />
                        <select
                          multiple
                          id="select_guias"
                          onChange={(e) => {
                            setOpcionRecojoSeleccionadoGuia(e.target.value);
                          }}
                          className="bg-white pl-1 border mx-auto my-3 focus:outline-none focus:ring-2 h-[20vh] w-[95%] overflow-y ScrollTable overflow-ellipsis text-sm ring-1  text-gray-400  "
                        >
                          {datosSelectGuias
                            .filter((guia) =>
                              guia.id_num_guia_despacho_envio.includes(
                                filtroGuias
                              )
                            )
                            .map((guia) => (
                              <option
                                key={guia.id_num_guia_despacho_envio}
                                value={guia.id_num_guia_despacho_envio}
                              >
                                {guia.id_num_guia_despacho_envio}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Table2 rounded-lg ">
                <div className="w-[full] overflow-x-auto bg-[#fff] ScrollTable rounded-lg overflow-y-hidden">
                  <table className="w-[100%] table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  ">
                    <thead className="bg-blue-400  text-xs border-b border-gray-300 text-white uppercase whitespace-nowrap ">
                      <tr>
                        {EncabEstado2.map((header, index) => (
                          <th key={index} scope="col" className="px-6 py-3 ">
                            {header}
                          </th>
                        ))}

                        <th className="px-6 py-3 text-center">Imagenes</th>
                        <th className="px-6 py-3 text-center">Cargos</th>
                      </tr>
                    </thead>
                    <tbody className="  text-[#535c69]">
                      <tr className="bg-[#fff] border-b border-gray-300  ">
                        <td className="px-6 py-3">Intento 1</td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento1?.proceso_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento1?.estado_mercancia_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {datosIntento1?.fecha_proceso_estado_guia || ""}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {(datosIntento1?.imagen_1_estado_guia ||
                            datosIntento1?.imagen_2_estado_guia ||
                            datosIntento1?.imagen_3_estado_guia) && (
                            <ModalImagenes datos={datosIntento1} />
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {(datosIntento1?.imagen_4_estado_guia ||
                            datosIntento1?.imagen_5_estado_guia ||
                            datosIntento1?.imagen_6_estado_guia) && (
                            <ModalCargos datos={datosIntento1} />
                          )}
                        </td>
                      </tr>
                      <tr className="bg-[#fff] border-b border-gray-300  ">
                        <td className="px-6 py-3">Intento 2</td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento2?.proceso_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento2?.estado_mercancia_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {datosIntento2?.fecha_proceso_estado_guia || ""}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {(datosIntento2?.imagen_1_estado_guia ||
                            datosIntento2?.imagen_2_estado_guia ||
                            datosIntento2?.imagen_3_estado_guia) && (
                            <ModalImagenes datos={datosIntento2} />
                          )}
                        </td>
                        <td className="px-6 py-3 gap-x-1 flex  justify-center">
                          {(datosIntento2?.imagen_4_estado_guia ||
                            datosIntento2?.imagen_5_estado_guia ||
                            datosIntento2?.imagen_6_estado_guia) && (
                            <ModalCargos datos={datosIntento2} />
                          )}
                        </td>
                      </tr>
                      <tr className="bg-[#fff] border-b border-gray-300  ">
                        <td className="px-6 py-3">Intento 3</td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento3?.proceso_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {(
                            datosIntento3?.estado_mercancia_estado_guia || ""
                          ).toUpperCase()}
                        </td>
                        <td className="px-6 py-3">
                          {datosIntento3?.fecha_proceso_estado_guia || ""}
                        </td>
                        <td className="px-6 py-3  flex  justify-center">
                          {(datosIntento3?.imagen_1_estado_guia ||
                            datosIntento3?.imagen_2_estado_guia ||
                            datosIntento3?.imagen_3_estado_guia) && (
                            <ModalImagenes datos={datosIntento3} />
                          )}
                        </td>
                        <td className="px-6 py-3  flex  justify-center">
                          {(datosIntento3?.imagen_4_estado_guia ||
                            datosIntento3?.imagen_5_estado_guia ||
                            datosIntento3?.imagen_6_estado_guia) && (
                            <ModalCargos datos={datosIntento3} />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

export default HomeEstados;
