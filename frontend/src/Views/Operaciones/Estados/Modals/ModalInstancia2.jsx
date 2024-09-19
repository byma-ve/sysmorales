import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
export function ModalInstancia2({
  modalInstancia2,
  setModalInstancia2,
  datosIntento2,
  num_guia,
  setDatosIntento1,
  setDatosIntento2,
  setDatosIntento3,
  setOpcionRecojoSeleccionadoGuia,
  setDatosSelectGuias,
  cargarSelectGuia,
}) {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRef4 = useRef(null);
  const fileInputRef5 = useRef(null);
  const fileInputRef6 = useRef(null);

  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);
  const [imagen3, setImagen3] = useState(null);
  const [imagen4, setImagen4] = useState(null);
  const [imagen5, setImagen5] = useState(null);
  const [imagen6, setImagen6] = useState(null);

  const ocultarModalInstancia2 = () => {
    setModalInstancia2(false);
    fileInputRef1.current.value = "";
    fileInputRef2.current.value = "";
    fileInputRef3.current.value = "";
    fileInputRef4.current.value = "";
    fileInputRef5.current.value = "";
    fileInputRef6.current.value = "";
    setImagen1(null);
    setImagen2(null);
    setImagen3(null);
    setImagen4(null);
    setImagen5(null);
    setImagen6(null);
  };

  const [formValues, setFormValues] = useState({
    id_num_guia_estado_guia: num_guia,
    num_intento_estado_guia: "intento 2",
    proceso_estado_guia: "",
    estado_mercancia_estado_guia: "",
    fecha_proceso_estado_guia: "",
    comentario_estado_guia: "",
  });

  useEffect(() => {
    setFormValues({
      id_num_guia_estado_guia: num_guia,
      num_intento_estado_guia:
        datosIntento2?.num_intento_estado_guia || "intento 2",
      proceso_estado_guia: datosIntento2?.proceso_estado_guia || "",
      estado_mercancia_estado_guia:
        datosIntento2?.estado_mercancia_estado_guia || "",
      fecha_proceso_estado_guia: datosIntento2?.fecha_proceso_estado_guia || "",
      comentario_estado_guia: datosIntento2?.comentario_estado_guia || "",
    });
  }, [datosIntento2, modalInstancia2]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "imagen_1_estado_guia") {
      const file = e.target.files[0];
      setImagen1(file);
    } else if (name === "imagen_2_estado_guia") {
      const file = e.target.files[0];
      setImagen2(file);
    } else if (name === "imagen_3_estado_guia") {
      const file = e.target.files[0];
      setImagen3(file);
    } else if (name === "imagen_4_estado_guia") {
      const file = e.target.files[0];
      setImagen4(file);
    } else if (name === "imagen_5_estado_guia") {
      const file = e.target.files[0];
      setImagen5(file);
    } else if (name === "imagen_6_estado_guia") {
      const file = e.target.files[0];
      setImagen6(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append(
      "id_num_guia_estado_guia",
      formValues.id_num_guia_estado_guia
    );
    formDataWithImage.append(
      "num_intento_estado_guia",
      formValues.num_intento_estado_guia
    );
    formDataWithImage.append(
      "proceso_estado_guia",
      formValues.proceso_estado_guia
    );
    if (formValues.proceso_estado_guia === "entregado") {
      formDataWithImage.append(
        "estado_mercancia_estado_guia",
        "entrega exitosa"
      );
    } else {
      formDataWithImage.append(
        "estado_mercancia_estado_guia",
        formValues.estado_mercancia_estado_guia
      );
    }
    formDataWithImage.append(
      "fecha_proceso_estado_guia",
      formValues.fecha_proceso_estado_guia
    );
    formDataWithImage.append(
      "comentario_estado_guia",
      formValues.comentario_estado_guia
    );
    formDataWithImage.append("imagen_1_estado_guia", imagen1);
    formDataWithImage.append("imagen_2_estado_guia", imagen2);
    formDataWithImage.append("imagen_3_estado_guia", imagen3);
    formDataWithImage.append("imagen_4_estado_guia", imagen4);
    formDataWithImage.append("imagen_5_estado_guia", imagen5);
    formDataWithImage.append("imagen_6_estado_guia", imagen6);
    formDataWithImage.append(
      "id_creador_estado_guia",
      localStorage.getItem("id_usuario")
    );

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
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/EstadoGuias/guardarIntento2.php",
        {
          method: "POST",
          body: formDataWithImage,
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        setDatosSelectGuias([]);
        setOpcionRecojoSeleccionadoGuia(null);
        setDatosIntento1("");
        setDatosIntento2("");
        setDatosIntento3("");
        ocultarModalInstancia2();
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      cargarSelectGuia();
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalInstancia2 ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalInstancia2 ? "translate-y-0" : "translate-y-[600%]"
          } w-[600px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4   ">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                <div className="side-cont-titulo mb-4 text-xl px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt uppercase">Instancia 2 </h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <h1 className="side-cont-titulo mb-2 text-base  text-black">
                    Datos de Colaboradores
                  </h1>
                  <form
                    className="mb-1 text-black"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    <div className=" card-container">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-center">
                          <label htmlFor="proceso" className="text-black">
                            Proceso
                          </label>
                          <select
                            name="proceso_estado_guia"
                            id="proceso_estado_guia"
                            className="w-[100%] text-center border bg-gray-100 px-1 border-gray-300 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                            value={formValues.proceso_estado_guia}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Elegir Proceso...</option>
                            <option value="motivado">Motivo</option>
                            <option value="entregado">Entrega</option>
                          </select>
                        </div>
                        <div className="text-center">
                          <label
                            htmlFor="estadoMercancia"
                            className="text-black"
                          >
                            Estado Mercancia
                          </label>
                          <br />
                          <select
                            name="estado_mercancia_estado_guia"
                            id="estado_mercancia_estado_guia"
                            className="w-[100%] text-center border bg-gray-100 px-1 border-gray-300 rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                            value={formValues.estado_mercancia_estado_guia}
                            onChange={handleChange}
                            disabled={!formValues.proceso_estado_guia}
                            required
                          >
                            {formValues.proceso_estado_guia === "motivado" && (
                              <>
                                <option value="">Elegir Estado...</option>
                                <option value="direccion incorrecta">
                                  Direccion Incorrecta
                                </option>
                                <option value="telefono apagado">
                                  Telefono Apagado
                                </option>
                                <option value="zona no accesible">
                                  Zona no Accesible
                                </option>
                                <option value="cliente de viaje">
                                  Cliente de Viaje
                                </option>
                              </>
                            )}
                            {formValues.proceso_estado_guia === "entregado" && (
                              <option value="entrega exitosa">
                                Entrega Exitosa
                              </option>
                            )}
                          </select>
                        </div>
                        <div className="text-center">
                          <label htmlFor="fechaproceso" className="">
                            Fecha Proceso
                          </label>
                          <input
                            type="date"
                            id="fecha_proceso_estado_guia"
                            name="fecha_proceso_estado_guia"
                            placeholder="Recojo"
                            value={formValues.fecha_proceso_estado_guia}
                            onChange={handleChange}
                            required
                            className="w-[100%] text-center border bg-gray-100 px-3 border-gray-300 rounded-sm-sm   focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="py-2">
                          <div>
                            <label htmlFor="comentario" className="">
                              Comentario
                            </label>
                            <textarea
                              type="text"
                              name="comentario_estado_guia"
                              id="comentario_estado_guia"
                              value={formValues.comentario_estado_guia}
                              onChange={handleChange}
                              required
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              className="uppercase w-[305%] px-1 border rounded-sm max-h-[200px] min-h-[25px] overflow-sr-only focus:outline-none focus:ring-2 ring-1 focus:border-blue-500  "
                            />
                          </div>

                          {/* <div>
                            <div className="grid grid-cols-2 gap-2 ">
                              <div className="">
                                <input
                                  name="imagen_1_estado_guia"
                                  id="imagen_1_estado_guia"
                                  type="file"
                                  ref={fileInputRef1}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.5rem] text-xs bg-white"
                                />
                              </div>
                              <div className="ml-44">
                                <input
                                  name="imagen_2_estado_guia"
                                  id="imagen_2_estado_guia"
                                  type="file"
                                  ref={fileInputRef2}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.2rem] text-xs bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 ">
                              <div className="">
                                <input
                                  name="imagen_3_estado_guia"
                                  id="imagen_3_estado_guia"
                                  type="file"
                                  ref={fileInputRef3}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.5rem] text-xs bg-white"
                                />
                              </div>
                             
                              <div className="ml-44">
                                <input
                                  name="imagen_4_estado_guia"
                                  id="imagen_4_estado_guia"
                                  type="file"
                                  ref={fileInputRef4}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.2rem] text-xs bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 ">
                              <div className="">
                                <input
                                  name="imagen_5_estado_guia"
                                  id="imagen_5_estado_guia"
                                  type="file"
                                  ref={fileInputRef5}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.5rem] text-xs bg-white"
                                />
                              </div>
                              <div className="ml-44">
                                <input
                                  name="imagen_6_estado_guia"
                                  id="imagen_6_estado_guia"
                                  type="file"
                                  ref={fileInputRef6}
                                  onChange={handleChange}
                                  accept="image/*"
                                  className="my-1 rounded-sm w-[15.2rem] text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 ">
                        <div className="w-full ">
                          <label
                            htmlFor=""
                            className="block font-semibold mb-2 text-gray-700"
                          >
                            Imágenes
                          </label>
                          <div className="">
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_1_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                {" "}
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen1
                                    ? imagen1.name
                                    : "Seleccionar Imagen 1"}{" "}
                                </span>
                                {/* Mostrar el nombre del archivo */}
                              </label>
                              <input
                                name="imagen_1_estado_guia"
                                id="imagen_1_estado_guia"
                                type="file"
                                ref={fileInputRef1}
                                onChange={handleChange}
                                accept="image/*"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_2_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen2
                                    ? imagen2.name
                                    : "Seleccionar Imagen 2"}{" "}
                                </span>
                                {/* Mostrar el nombre del archivo */}
                              </label>
                              <input
                                name="imagen_2_estado_guia"
                                id="imagen_2_estado_guia"
                                type="file"
                                ref={fileInputRef2}
                                onChange={handleChange}
                                accept="image/*"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_3_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen3
                                    ? imagen3.name
                                    : "Seleccionar Imagen 3"}{" "}
                                  {/* Mostrar el nombre del archivo */}
                                </span>
                              </label>
                              <input
                                name="imagen_3_estado_guia"
                                id="imagen_3_estado_guia"
                                type="file"
                                ref={fileInputRef3}
                                onChange={handleChange}
                                accept="image/*"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                          </div>
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="block font-semibold mb-2 text-gray-700"
                          >
                            Cargos
                          </label>
                          <div>
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_4_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen4
                                    ? imagen4.name
                                    : "Seleccionar PDF Global"}{" "}
                                </span>
                                {/* Mostrar el nombre del archivo */}
                              </label>
                              <input
                                name="imagen_4_estado_guia"
                                id="imagen_4_estado_guia"
                                type="file"
                                ref={fileInputRef4}
                                onChange={handleChange}
                                accept="application/pdf"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_5_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen5
                                    ? imagen5.name
                                    : "Seleccionar PDF Remitente"}{" "}
                                </span>
                                {/* Mostrar el nombre del archivo */}
                              </label>
                              <input
                                name="imagen_5_estado_guia"
                                id="imagen_5_estado_guia"
                                type="file"
                                ref={fileInputRef5}
                                onChange={handleChange}
                                accept="application/pdf"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                            <div className="my-1 relative ">
                              <label
                                htmlFor="imagen_6_estado_guia"
                                className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex  hover:bg-blue-500"
                              >
                                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                  {imagen6
                                    ? imagen6.name
                                    : "Seleccionar PDF S. Factura"}{" "}
                                </span>
                                {/* Mostrar el nombre del archivo */}
                              </label>
                              <input
                                name="imagen_6_estado_guia"
                                id="imagen_6_estado_guia"
                                type="file"
                                ref={fileInputRef6}
                                onChange={handleChange}
                                accept="application/pdf"
                                className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-8 h-4">
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={ocultarModalInstancia2}
                          type="button"
                          className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
