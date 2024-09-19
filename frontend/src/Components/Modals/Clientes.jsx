import { useState, useEffect } from "react";
export const Clientes = ({
  modalClientes,
  setModalClientes,
  clienteData,
  setClienteData,
  setUsuarios,
}) => {
  // Estado para almacenar los clientes seleccionados
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  // Estado para marcar todos los clientes
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);

  const [clientesData, setClientesData] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtenerUsuarioNotificaciones.php"
      );
      const data = await response.json();
      setClientesData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    // Verificar si todos los clientes están seleccionados
    const todosClientes = clientesData.map(
      (cliente) => cliente.colaborador_usuario
    );
    const todosClientesSeleccionados =
      clientesSeleccionados.length === todosClientes.length;
    setSeleccionarTodos(todosClientesSeleccionados);
  }, [clientesSeleccionados, clientesData]);

  // Funcion que detecta el cambio en el checkbox
  const handleCheckboxChange = (cliente) => {
    if (clientesSeleccionados.includes(cliente)) {
      // Desmarcar cliente individual
      setClientesSeleccionados(
        clientesSeleccionados.filter((c) => c !== cliente)
      );
      setSeleccionarTodos(false); // Desmarcar "Seleccionar Todos"
    } else {
      // Marcar cliente individual
      setClientesSeleccionados([...clientesSeleccionados, cliente]);
    }
  };

  // Funcion para elegir a todos los clientes
  const handleSeleccionarTodos = () => {
    if (seleccionarTodos) {
      // Desmarcar todos los clientes
      setClientesSeleccionados([]);
    } else {
      // Marcar todos los clientes
      setClientesSeleccionados(
        clientesData.map((cliente) => cliente.colaborador_usuario)
      );
    }
    setSeleccionarTodos(!seleccionarTodos);
  };

  // Funcion para ocultar el Modal de Clientes
  const ocultarmodalClientes = () => {
    setModalClientes(false);
    setClientesSeleccionados([]);
    setSeleccionarTodos(false);
  };

  // Funcion para guardar los clientes seleccionados
  const handleGuardarClick = () => {
    const clientesFiltrados = clientesData.filter((cliente) =>
      clientesSeleccionados.includes(cliente.colaborador_usuario)
    );

    const nombresClientes = clientesFiltrados
      .map((cliente) => cliente.colaborador_usuario)
      .join(", ");

    const idClientes = clientesFiltrados
      .map((cliente) => cliente.id)
      .join(", ");

    setClienteData({
      ...clienteData,
      usuarios: nombresClientes,
      id_receptor: idClientes,
    });

    setUsuarios(nombresClientes);
    setClientesSeleccionados([]);
    ocultarmodalClientes();
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClientes = clientesData.filter((cliente) =>
    cliente.colaborador_usuario
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div
        className={`side-panel-container ${
          modalClientes ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-[99999999] flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalClientes ? "translate-y-[00%]" : "translate-y-[200%]"
          } w-[750px] block absolute transition-transform duration-500 `}
        >
          <div className="side-panel-content-container p-4 ">
            <div className="side-panel-iframe h-full   ">
              <div className="side-panel bg-white  h-full w-auto m-0 rounded-md  ">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2 rounded-t-md  bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo flex w-full  ">
                    <h1 className="side-txt mr-9 w-[75%]">
                      Seleccionar Clientes
                    </h1>
                  </div>
                </div>
                <div className="section-crm pb-4 px-6 ">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="cont-txt text-slate-800 text-xl font-light relative">
                      <input
                        className="  text-sm text-slate-800 h-7 rounded-lg border  items-center  bg-white
                                      focus:bg-gray-50 outline-none px-2   w-[250%] "
                        type="text"
                        placeholder="Buscar Datos "
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    <div className="mr-[24px]">
                      <input
                        type="checkbox"
                        id="seleccionar_todos_checkbox"
                        checked={seleccionarTodos}
                        onChange={handleSeleccionarTodos}
                        className="mr-2 ms-2 "
                      />
                      <label
                        htmlFor="seleccionar_todos_checkbox"
                        className="text-black "
                      >
                        Seleccionar Todos
                      </label>
                    </div>
                  </div>
                  <form className="grid grid-cols-[1fr,1fr,1fr] justify-between gap-5 ScrollTable overflow-y-auto max-h-72 ">
                    {filteredClientes.map((cliente, index) => (
                      <div key={index} className="mb-3 flex items-center">
                        <img
                          src={`https://images.weserv.nl/?url=${cliente.foto_usuario}`}
                          alt={`${cliente.colaborador_usuario} Photo`}
                          className="mr-2 rounded-full w-8 h-8"
                        />
                        <input
                          type="checkbox"
                          id={`cliente_checkbox_${index}`}
                          checked={clientesSeleccionados.includes(
                            cliente.colaborador_usuario
                          )}
                          onChange={() =>
                            handleCheckboxChange(cliente.colaborador_usuario)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`cliente_checkbox_${index}`}
                          className="text-black"
                        >
                          {cliente.colaborador_usuario}
                        </label>
                      </div>
                    ))}
                  </form>

                  <div className="flex items-center justify-end mt-6">
                    <button
                      onClick={handleGuardarClick}
                      type="button"
                      className="text-white mr-4 bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={ocultarmodalClientes}
                      type="button"
                      className="text-white  bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
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
    </>
  );
};
