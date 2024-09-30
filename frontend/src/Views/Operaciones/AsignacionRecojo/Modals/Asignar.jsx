import TrabajadoresExternos from "./TrabExternos";
import TrabajadoresPropios from "./TrabPropios";
import CheckBox from "../Components/CheckBox";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
function Asignar({ modalAsignar, setModalAsignar, datosAsignacion, actualizarTabla }) {
  // Capturamos la pcion Seleccionada
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("externos");

  // Funcion Ocultar Modal
  const ocultarModalAsignar = () => {
    setModalAsignar(false);
  };

  // Funcion que captura el cambio en el estado de la opcion
  const handleCheckboxChange = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const [formValues, setFormValues] = useState({
    id_orden_servicio_recojo: '',
    id_proveedor_recojo: '',
    dni_conductor_recojo: '',
    nombre_conductor_recojo: '',
    dni_auxiliar_recojo: '',
    nombre_auxiliar_recojo: '',
    id_conductor_recojo: '',
    id_auxiliar_recojo: '',
    id_vehiculo_recojo: '',
    opcionSeleccionada: opcionSeleccionada
  });

  useEffect(() => {
    setFormValues({
      id_orden_servicio_recojo: datosAsignacion?.id_orden_servicio || '',
      id_proveedor_recojo: datosAsignacion?.id_proveedor_recojo || '',
      dni_conductor_recojo: datosAsignacion?.dni_conductor_recojo || '',
      nombre_conductor_recojo: datosAsignacion?.nombre_conductor_recojo || '',
      dni_auxiliar_recojo: datosAsignacion?.dni_auxiliar_recojo || '',
      nombre_auxiliar_recojo: datosAsignacion?.nombre_auxiliar_recojo || '',
      id_conductor_recojo: datosAsignacion?.id_conductor_recojo || '',
      id_auxiliar_recojo: datosAsignacion?.id_auxiliar_recojo || '',
      id_vehiculo_recojo: datosAsignacion?.id_vehiculo_recojo || '',
      opcionSeleccionada: opcionSeleccionada
    });
  }, [datosAsignacion, modalAsignar, opcionSeleccionada]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

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
      const response = await fetch("https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/AsignacionRecojos/guardarAsignacion.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: responseData.message,
        });
        console.log(responseData.datos);
        ocultarModalAsignar();
      } else {
        Swal.fire({
          icon: 'error',
          title: responseData.message,
        });
        console.log(responseData.datos);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de Red',
      });
      console.log(error);
    }
    actualizarTabla();
  };

  
  return (
    <>
      <div
        className={`side-panel-container ${modalAsignar ? "visible" : "invisible"
          } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${modalAsignar ? "translate-y-0" : "translate-y-[600%]"
            } w-[800px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                {/* <div className="side-panel bg-slate-100 p-8 h-full w-auto m-0 bg-gray-100 px-1  rounded-sm-md"> */}
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Asignar</h1>
                  </div>
                </div>
                <CheckBox
                  onCheckboxChange={handleCheckboxChange}
                  opcionSeleccionada={opcionSeleccionada}
                />
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container text-black">
                    {opcionSeleccionada === "externos" ? (
                      <TrabajadoresExternos formValues={formValues} handleChange={handleChange} />
                    ) : opcionSeleccionada === "propios" ? (
                      <TrabajadoresPropios formValues={formValues} handleChange={handleChange} />
                    ) : null}
                    <div className="flex items-center justify-end mt-8 h-4">
                      <button
                        onClick={handleFormSubmit}
                        type="button"
                        className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={ocultarModalAsignar}
                        type="button"
                        className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Cancelar
                      </button>
                    </div>
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

export default Asignar;
