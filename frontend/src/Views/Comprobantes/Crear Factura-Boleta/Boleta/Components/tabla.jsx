import React, { useState } from "react";
import { IconoAgregar, IconoCerrar } from "../../../../../Iconos/Iconos-NavBar";
import Swal from "sweetalert2";
const Tabla = () => {
  const [filas, setFilas] = useState([
    {
      id: 1,
      codigo: "",
      cantidad: "",
      unidad: "",
      descripcion: "",
      valorUnitario: "",
      precioUnitario: "",
    },
  ]);

  const [nextId, setNextId] = useState(2);

  const agregarFila = () => {
    //condicionar si estan los inputs llenos se agrega fila
    const ultimaFila = filas[filas.length - 1];
    if (Object.values(ultimaFila).every((valor) => valor !== "")) {
      setFilas([
        ...filas,
        {
          id: nextId,
          codigo: "",
          cantidad: "",
          unidad: "",
          descripcion: "",
          valorUnitario: "",
          precioUnitario: "",
        },
      ]);
      setNextId(nextId + 1);
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        
        timer: 2000,
        timerProgressBar: true,

        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "warning", // Cambiado a warning ya que se trata de una advertencia
        title:
          "Por favor, complete todos los campos antes de agregar una nueva fila.",
      });
    }
  };

  const eliminarFila = (id) => {
    if (filas.length > 1) {
      setFilas(filas.filter((fila) => fila.id !== id));
    }
  };

  const actualizarFila = (id, campo, valor) => {
    setFilas(
      filas.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila))
    );
  };

  return (
    <div className="mt-6 border border-gray-400 p-4 rounded-xl">
      <div className="w-full border-b-2 pb-10">
        <table className="w-full bg-white border-collapse">
          <thead className="font-medium text-sm text-gray-600">
            <tr>
              <th className="py-2 align-top w-[2%] text-start">
                <h1>Item</h1>
                <p className="text-xs"></p>
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">Cód.</th>
              <th className="px-4 py-2 align-top w-1/12 text-start">Cant.*</th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                Unidad *
              </th>
              <th className="px-4 py-2 align-top w-1/6 text-start">
                Descripcion*
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                <h1>Valor Unitario*</h1>
                <p className="text-xs">(sin impuesto)</p>
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                <h1>Precio Unitario</h1>
                <p className="text-xs ">(con impuesto)</p>
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-center">
                <h1>Importe Total</h1>
                <p className="text-xs ">(con impuesto)</p>
              </th>
              <th className="px-4 py-2 align-top w-[1%] text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id} className="items-center">
                <td className="py-1 align-top w-[2%] text-start">{fila.id}</td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.codigo}
                    onChange={(e) =>
                      actualizarFila(fila.id, "codigo", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.cantidad}
                    onChange={(e) =>
                      actualizarFila(fila.id, "cantidad", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.unidad}
                    onChange={(e) =>
                      actualizarFila(fila.id, "unidad", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.descripcion}
                    onChange={(e) =>
                      actualizarFila(fila.id, "descripcion", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.valorUnitario}
                    onChange={(e) =>
                      actualizarFila(fila.id, "valorUnitario", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-1">
                  <input
                    type="text"
                    value={fila.precioUnitario}
                    onChange={(e) =>
                      actualizarFila(fila.id, "precioUnitario", e.target.value)
                    }
                    className="w-full px-2 bg-gray-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500/80"
                  />
                </td>
                <td className="px-4 py-2 text-center">0.00</td>
                <td className="px-4 py-2 text-start text-2xl flex">
                  <button onClick={agregarFila} className="text-red-500 mr-2">
                    <IconoAgregar />
                  </button>
                  {filas.length > 1 && (
                    <button
                      onClick={() => eliminarFila(fila.id)}
                      className="text-red-500"
                    >
                      <IconoCerrar />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="INFORMARCION">
        <h1 className="my-4">Mas Informacion</h1>
        <textarea
          name=""
          id=""
          className="p-2 w-full bg-gray-200 min-h-10 overflow-hidden max-h-32 rounded-md  focus:ring-1 outline-none"
        ></textarea>
      </div>
    </div>
  );
};

export default Tabla;
