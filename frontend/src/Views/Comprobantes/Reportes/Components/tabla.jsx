import React, { useState } from "react";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";
import Swal from "sweetalert2";
import {
  IconoPDFTable,
  IconoExcel,
  IconoXML,
} from "../../../../Iconos/Iconos-NavBar";
const comprobantes = [
  {
    cliente: "Byma-ve Innovation S.A.C.",
    ruc: "20101403320",
    tipo: "Factura",
    numComprobante: "F001-00003827",
    fEmision: "2024-08-27",
    fVencimiento: "2024-09-03",
    estado: "VALIDADO",
    monto: "S/ 1,165.75",
  },
  {
    cliente: "Byma-ve Innovation S.A.C.",
    ruc: "20101403320",
    tipo: "Factura",
    numComprobante: "F001-00003827",
    fEmision: "2024-08-27",
    fVencimiento: "2024-09-03",
    estado: "VALIDADO",
    monto: "S/ 1,165.75",
  },
  {
    cliente: "Byma-ve Innovation S.A.C.",
    ruc: "20101403320",
    tipo: "Factura",
    numComprobante: "F001-00003827",
    fEmision: "2024-08-27",
    fVencimiento: "2024-09-03",
    estado: "VALIDADO",
    monto: "S/ 1,165.75",
  },
  {
    cliente: "Byma-ve Innovation S.A.C.",
    ruc: "20604354087",
    tipo: "Guía Transportista",
    numComprobante: "V001-00003499",
    fEmision: "2024-08-27",
    fVencimiento: "-",
    estado: "VALIDADO",
    monto: "0.00",
  },
];
const Tabla = () => {
  return (
    <div className="mt-6    rounded-xl">
      <div className="w-full  ">
        <table className="w-full  bg-white border-collapse">
          <thead className="font-medium text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 align-top w-1/12 text-start">Cliente</th>
              <th className="px-4 py-2 align-top w-1/12 text-start">Tipo</th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                N° Comprobante
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                F. Emisión
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">
                F. Vencimiento
              </th>
              <th className="px-4 py-2 align-top w-1/12 text-start">Estado</th>
              <th className="px-4 py-2 align-top w-1/12 text-center">Monto</th>
              <th className="px-4 py-2 align-top w-1/12 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="">
            {comprobantes.map((comprobante, index) => (
              <tr
                key={index.id}
                className="items-center border-b border-gray-300  whitespace-nowrap hover:bg-gray-200 px-4"
              >
                <td className="py-3 px-4  w-1/12 text-start">
                  {comprobante.cliente}
                </td>
                <td className="px-4 py-3 w-1/12">
                  <span className="text-sm">{comprobante.tipo}</span>
                </td>

                <td className="px-4 py-3 w-1/12">
                  <span className="text-sm">{comprobante.numComprobante}</span>
                </td>
                <td className="px-4 py-3 w-1/12">
                  <span className="text-sm">{comprobante.fEmision}</span>
                </td>
                <td className="px-4 py-3 w-1/12">
                  <span className="text-sm">{comprobante.fVencimiento}</span>
                </td>

                <td className="px-4 py-3 w-1/12 ">
                  <span className="text-sm text-blue-400 font-semibold">
                    {comprobante.estado}
                  </span>
                </td>
                <td className="px-4 py-2 text-center w-1/12">0.00</td>
                <td className="px-4 py-2 text-center w-1/12">
                  <div className="flex gap-x-4  justify-center text-2xl ">
                    <div className="text-red-600">
                      <button>
                        <IconoPDFTable />
                      </button>
                    </div>
                    <div className="text-green-600">
                      <button>
                        <IconoXML />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-start">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Tabla;
