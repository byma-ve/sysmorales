import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
export function ModalDatosColaboradores({
  modalDatos,
  setModalDatos,
  datosOrdenServicio,
  cargarSelect,
  setDatosOrdenServicio,
  setOpcionRecojoSeleccionado,
  setDatosSelect,
}) {
  const fileInputRef = useRef(null);

  const ocultarModalAgregar = () => {
    setModalDatos(false);
    fileInputRef.current.value = "";
  };

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    return `${fechaActual.getFullYear()}-${mes}-${dia}`;
  };

  const [formValues, setFormValues] = useState({
    id_orden_servicio_estado_recojo: "",
    proceso_estado_recojo: "",
    estado_mercancia_estado_recojo: "",
    comentario_estado_recojo: "",
    imagen_estado_recojo: "",
    fecha_creado: "",
  });
  const [imagenCliente, setImagenCliente] = useState(null);

  useEffect(() => {
    setFormValues({
      id_orden_servicio_estado_recojo:
        datosOrdenServicio?.id_orden_servicio_recojo || "",
      proceso_estado_recojo:
        datosOrdenServicio?.proceso_estado_recojo || "Recojo",
      estado_mercancia_estado_recojo:
        datosOrdenServicio?.estado_mercancia_estado_recojo || "Exitoso",
      comentario_estado_recojo:
        datosOrdenServicio?.comentario_estado_recojo || "",
      imagen_estado_recojo: datosOrdenServicio?.imagen_estado_recojo || "",
      fecha_creado: datosOrdenServicio?.fecha_creado || obtenerFechaActual(),
    });
  }, [datosOrdenServicio, modalDatos]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setImagenCliente(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append(
      "id_orden_servicio_estado_recojo",
      formValues.id_orden_servicio_estado_recojo
    );
    formDataWithImage.append(
      "proceso_estado_recojo",
      formValues.proceso_estado_recojo
    );
    formDataWithImage.append(
      "estado_mercancia_estado_recojo",
      formValues.estado_mercancia_estado_recojo
    );
    formDataWithImage.append(
      "comentario_estado_recojo",
      formValues.comentario_estado_recojo
    );
    formDataWithImage.append("fecha_creado", formValues.fecha_creado);
    formDataWithImage.append("imagen_estado_recojo", imagenCliente);
    formDataWithImage.append(
      "id_creador_estado_recojo",
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
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/EstadoRecojos/guardarRecojo.php",
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
        setDatosSelect([]);
        setOpcionRecojoSeleccionado(null);
        setDatosOrdenServicio("");
        ocultarModalAgregar();
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      console.log(responseData.datos);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
    cargarSelect();
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalDatos ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalDatos ? "translate-y-0" : "translate-y-[600%]"
          } w-[600px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4   ">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                {/* <div className="side-panel bg-slate-100 p-8 h-full w-auto m-0 bg-gray-100 px-1  rounded-sm-md"> */}
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">
                      Instancia - {formValues.id_orden_servicio_estado_recojo}
                    </h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container text-black">
                    <form
                      className="mb-1 text-black"
                      onSubmit={handleSubmit}
                      encType="multipart/form-data"
                    >
                      {/* DATOS DE DESTINATARIO */}
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-center">
                          <label htmlFor="">Proceso</label>
                          <input
                            type="text"
                            name="proceso_estado_recojo"
                            id="proceso_estado_recojo"
                            readOnly
                            value={formValues.proceso_estado_recojo}
                            onChange={handleChange}
                            className="w-[100%] border border-gray-300 bg-gray-100 px-1 text-center rounded-sm h-6  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md my-2 placeholder:text-black"
                          />
                        </div>
                        <div className="text-center">
                          <label htmlFor="">Estado Mercancia</label>
                          <br />
                          <select
                            name="estado_mercancia_estado_recojo"
                            id="estado_mercancia_estado_recojo"
                            value={formValues.estado_mercancia_estado_recojo}
                            onChange={handleChange}
                            className="w-[100%] border bg-gray-100 px-1 border-gray-300 text-center rounded-sm   h-6 focus:outline-none my-2"
                          >
                            <option value="Exitoso">Exitoso</option>
                          </select>
                        </div>
                        <div className="text-center">
                          <label htmlFor="">Fecha Proceso</label>
                          <input
                            type="date"
                            name="fecha_creado"
                            id="fecha_creado"
                            readOnly
                            value={formValues.fecha_creado}
                            onChange={handleChange}
                            className="w-[100%] placeholder:text-black border border-gray-300 bg-gray-100 px-1 text-center rounded-sm   h-6 focus:outline-none my-2 "
                          />
                        </div>
                        <div className="py-2">
                          <div>
                            <label htmlFor="">Comentario</label>
                            <textarea
                              name="comentario_estado_recojo"
                              id="comentario_estado_recojo"
                              type="text"
                              value={formValues.comentario_estado_recojo}
                              onChange={handleChange}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              className="uppercase w-[305%] rounded-sm my-2 max-h-[200px] min-h-[25px] overflow-hidden bg-gray-100 px-1 border border-gray-300 focus:outline-none   focus:border-blue-600"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <label
                        htmlFor="
                        "
                        className="block  font-medium text-gray-700"
                      >
                        Imagen
                      </label>
                      <div className="my-1 flex ">
                        <label
                          htmlFor="imagen_estado_recojo"
                          className="cursor-pointer bg-blue-400 w-[50%] text-center text-white  px-4 rounded hover:bg-blue-500"
                        >
                          Seleccionar Imagen{" "}
                        </label>
                        <input
                          className="sr-only"
                          id="imagen_estado_recojo"
                          name="imagen_estado_recojo"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleChange}
                          accept="image/*"
                        />
                      </div>
                      <div className="my-1 relative ">
                        <label
                          htmlFor="imagen_estado_recojo"
                          className="cursor-pointer bg-blue-400 w-full z-0  text-white px-4 rounded flex items-center  hover:bg-blue-500"
                        >
                          <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {imagenCliente ? imagenCliente.name : "Seleccionar Imagen"}{" "}
                          </span>
                        </label>
                        <input
                          id="imagen_estado_recojo"
                          name="imagen_estado_recojo"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleChange}
                          accept="image/*"
                          className="opacity-0 absolute top-0 w-[15.8rem] z-10 "
                        />
                      </div>
                      <div className="flex items-center justify-end mt-8 h-4">
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={ocultarModalAgregar}
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
