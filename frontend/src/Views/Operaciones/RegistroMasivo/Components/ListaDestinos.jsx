import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import AgregarMasivo from "../Modals/AgregarMasivo";
import EditarEnvio from "../Modals/ModalEditar";
import { IconoPencil, IconoCerrar } from "../../../../Iconos/Iconos-NavBar";
import { IconoAgregar } from "../../../../Iconos/Iconos-NavBar";

function ListaDestinos({ clienteElegido, areaElegida, opcionesSelect, cargarListaEnvios }) {
  const [modalMasivo, setModalMasivo] = useState(false);
  const [modalEnvio2, setModalEnvio2] = useState(false);

  const handleOpenModal = () => {
    setModalMasivo(true);
  };

  const handleOpenModal2 = () => {
    setModalEnvio2(true);
  };

  useEffect(() => {
    cargarListaEnvios();
    setDestinoSeleccionado(null);
    setDatos({});
  }, [clienteElegido, areaElegida]);

  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const handleSeleccionarDestinoChange = (event) => {
    setDestinoSeleccionado(event.target.value);
    obtenerValoresDestino(event.target.value)
  };

  // ELIMINAR DESTINO

  const eliminarDestino = async (id) => {
    try {
      const response = await fetch(`https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroMasivo/eliminarDestino.php?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        cargarListaEnvios();
        setDestinoSeleccionado(null);
        Swal.fire({
          icon: 'success',
          title: 'Destino eliminado con éxito',
        });
      } else {
        console.error('Error al eliminar el destino');
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar el destino',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de eliminación',
      });
    }
  };

  const handleEliminarDestino = (id) => {
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
        eliminarDestino(id);
      }
    });
  };

  const [datos, setDatos] = useState({});
  const obtenerValoresDestino = async (destinoSeleccionado) => {
    try {
      const response = await fetch(`https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroMasivo/obtenerDestino.php?id_destino_cotizacion=${destinoSeleccionado}`);
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = opcionesSelect.filter(
    opcion => opcion.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="side-panel-iframe rounded-md mt-4 ">
        <div className="side-panel bg-[#fff] rounded-xl  ">
          <div className="side-cont-titulo flex text-[18px] font-semibold text-[#535c69] bg-blue-400 rounded-t-xl ">
          <div className="side-titulo w-[91%] ">
              <h1 className="side-txt whitespace-nowrap text-white py-2  px-5">
                Lista de Destinos
              </h1>
            </div>
            <div className="side-boton w-[40%] py-2">
              <button
                onClick={handleOpenModal}
                className={`btn-side-panel text-white text-2xl border-gray-200  ${!(clienteElegido && areaElegida) ? "cursor-not-allowed" : ""
                  }`}
                disabled={!(clienteElegido && areaElegida)}
              >
                <IconoAgregar />
              </button>

              <button
                onClick={handleOpenModal2}
                className={`btn-side-panel text-white text-2xl border-gray-200 mx-1 ${!(clienteElegido && areaElegida && destinoSeleccionado) ? "cursor-not-allowed" : ""
                  }`}
                disabled={!(clienteElegido && areaElegida && destinoSeleccionado)}
              >
                <IconoPencil />
              </button>

              <button
                onClick={() => handleEliminarDestino(destinoSeleccionado)}
                className={`btn-side-panel text-white text-2xl border-gray-200  ${!(clienteElegido && areaElegida && destinoSeleccionado) ? "cursor-not-allowed" : ""
                  }`}
                disabled={!(clienteElegido && areaElegida && destinoSeleccionado)}
              >
                <IconoCerrar />
              </button>
            </div>
          </div>
          <div className="section-crm ">
            <div className="card-container">
              <div>
                <div className="flex flex-col p-4">
                  <input
                    className="w-full text-black text-sm border rounded-sm focus:outline-none focus:ring-2 ring-1 focus:border-blue-500 mb-3 pl-1"
                    placeholder="Buscar..."
                    onChange={event => setSearchTerm(event.target.value)}
                  />
                  <select
                    name="lista_envios"
                    id="lista_envios"
                    size="16 "
                    className="ScrollTableVertical pl-1 pt-1 text-black border rounded text-xs h-[13rem] focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                    onChange={handleSeleccionarDestinoChange}
                  >
                    {filteredOptions.map((opcion, index) => (
                      <option key={index} value={opcion.id_cotizacion_destino}>{opcion.destino}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AgregarMasivo
        modalMasivo={modalMasivo}
        setModalMasivo={setModalMasivo}
        id_cliente={clienteElegido}
        id_area={areaElegida}
        cargarListaEnvios={cargarListaEnvios}
      />
      <EditarEnvio
        modalEnvio={modalEnvio2}
        setModalEnvio={setModalEnvio2}
        id_destino_cotizacion={destinoSeleccionado}
        id_cliente={clienteElegido}
        id_area={areaElegida}
        cargarListaEnvios={cargarListaEnvios}
        datos={datos} // Aquí estás pasando los datos al componente ModalEditar
        obtenerValoresDestino={obtenerValoresDestino}
      />
    </>
  );
}

export default ListaDestinos;
