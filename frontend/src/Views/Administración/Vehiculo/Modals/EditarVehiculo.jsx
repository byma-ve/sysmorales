import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
function ModalEditarVehiculo({ modalEditar, setModalEditar, selectedVehiculoData, actualizarTabla }) {
  const ocultarModal2 = () => {
    setModalEditar(false);
  };

  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    id: '',
    placa_vehiculo: '',
    tipo_vehiculo: '',
    n_serie_vehiculo: '',
    soat_vehiculo: '',
    vigencia_desde_vehiculo: '',
    vigencia_hasta_vehiculo: '',
    ultima_revision_vehiculo: '',
    vencimiento_vehiculo: '',
    tarjeta_propiedad_vehiculo: '',
  });
  const [imagenCliente, setImagenCliente] = useState(null);

  useEffect(() => {
    setFormValues({
      id: selectedVehiculoData?.id || '',
      placa_vehiculo: selectedVehiculoData?.placa_vehiculo || '',
      tipo_vehiculo: selectedVehiculoData?.tipo_vehiculo || '',
      n_serie_vehiculo: selectedVehiculoData?.n_serie_vehiculo || '',
      soat_vehiculo: selectedVehiculoData?.soat_vehiculo || '',
      vigencia_desde_vehiculo: selectedVehiculoData?.vigencia_desde_vehiculo || '',
      vigencia_hasta_vehiculo: selectedVehiculoData?.vigencia_hasta_vehiculo || '',
      ultima_revision_vehiculo: selectedVehiculoData?.ultima_revision_vehiculo || '',
      vencimiento_vehiculo: selectedVehiculoData?.vencimiento_vehiculo || '',
      tarjeta_propiedad_vehiculo: selectedVehiculoData?.tarjeta_propiedad_vehiculo || ''
    });
  }, [selectedVehiculoData, modalEditar]);

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
    formDataWithImage.append("id", formValues.id);
    formDataWithImage.append("tipo_vehiculo", formValues.tipo_vehiculo);
    formDataWithImage.append("n_serie_vehiculo", formValues.n_serie_vehiculo);
    formDataWithImage.append("soat_vehiculo", formValues.soat_vehiculo);
    formDataWithImage.append("vigencia_desde_vehiculo", formValues.vigencia_desde_vehiculo);
    formDataWithImage.append("vigencia_hasta_vehiculo", formValues.vigencia_hasta_vehiculo);
    formDataWithImage.append("ultima_revision_vehiculo", formValues.ultima_revision_vehiculo);
    formDataWithImage.append("vencimiento_vehiculo", formValues.vencimiento_vehiculo);
    formDataWithImage.append("tarjeta_propiedad_vehiculo", formValues.tarjeta_propiedad_vehiculo);

    try {
      const response = await fetch('https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Vehiculo/actualizar_vehiculo.php', {
        method: 'POST',
        body: formDataWithImage,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'Los datos se han actualizado correctamente.',
        });
        actualizarTabla();
        ocultarModal2();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el vehiculo.',
        });
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'Hubo un problema de red al intentar actualizar los datos.',
      });
    }
  };

  // Estado para almacenar la fecha
  const [fecha, setFecha] = useState('');

  // Función para manejar cambios en la fecha
  const handleFechaChange = (event) => {
    setFecha(event.target.value);
  };

  // Obtener la fecha actual en el formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    return `${fechaActual.getFullYear()}-${mes}-${dia}`;
  };

  return (
    <>
      {/* cuando le de a cancelar display: none */}
      <div
        className={`side-panel-container ${modalEditar ? "visible" : "invisible"
          } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10`}
      >
        {/* cuando le de a cancelar translate-x-[100%] */}
        <div
          className={`side-panel-cont-container ${modalEditar ? "translate-x-[0%]" : "translate-x-[100%]"
            } w-[500px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 `}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 mb-6">
            <div className="side-panel-iframe relative w-full h-full overflow-y-auto ScrollTableVertical ">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-2 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Editar Vehiculo</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form className="text-black" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="placa_vehiculo"
                            id="placa_vehiculo"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            disabled
                            onChange={handleChange}
                            value={formValues.placa_vehiculo}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Placa *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="tipo_vehiculo"
                            id="tipo_vehiculo"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.tipo_vehiculo}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="n_serie_vehiculo"
                            id="n_serie_vehiculo"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.n_serie_vehiculo}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            N° Serie *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="soat_vehiculo"
                            id="soat_vehiculo"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.soat_vehiculo}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Soat *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="date"
                            name="vigencia_desde_vehiculo"
                            id="vigencia_desde_vehiculo"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            max={obtenerFechaActual()}
                            value={formValues.vigencia_desde_vehiculo}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Vigencia Desde *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="date"
                            name="vigencia_hasta_vehiculo"
                            id="vigencia_hasta_vehiculo"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            min={obtenerFechaActual()}
                            value={formValues.vigencia_hasta_vehiculo}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Vigencia Hasta *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="date"
                            name="ultima_revision_vehiculo"
                            id="ultima_revision_vehiculo"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            max={obtenerFechaActual()}
                            value={formValues.ultima_revision_vehiculo}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Ultima Revision *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="date"
                            name="vencimiento_vehiculo"
                            id="vencimiento_vehiculo"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            min={obtenerFechaActual()}
                            value={formValues.vencimiento_vehiculo}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Vencimiento *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="tarjeta_propiedad_vehiculo"
                            id="tarjeta_propiedad_vehiculo"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.tarjeta_propiedad_vehiculo}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tarjeta Propiedad *
                          </label>
                        </div>
                        <div className="flex items-center justify-end rounded-b mt-7">
                          <button
                            type="submit"
                            className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={ocultarModal2}
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
      </div>
    </>
  );
}

export default ModalEditarVehiculo;
