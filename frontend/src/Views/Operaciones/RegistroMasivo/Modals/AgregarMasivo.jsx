import React, { useState, useEffect } from 'react';
import ExcelJS from "exceljs";
import Swal from 'sweetalert2';
function AgregarMasivo({ modalMasivo, setModalMasivo, id_cliente, id_area, cargarListaEnvios }) {

  const [data, setData] = useState([]);

  const ocultarModalAgregar = () => {
    setModalMasivo(false);
    setData([]);
    const fileInput = document.getElementById("file_input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileUpload = async (e) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      try {
        const A1 = worksheet.getRow(1).getCell(1).value;
        if (String(A1).toUpperCase() !== "CONSIGNADO") {
          throw new Error('La columna A1 no contiene CONSIGNADO');
        }

        const B1 = worksheet.getRow(1).getCell(2).value;
        if (String(B1).toUpperCase() !== "RUC/DNI") {
          throw new Error('La columna B1 no contiene RUC/DNI');
        }

        const C1 = worksheet.getRow(1).getCell(3).value;
        if (String(C1).toUpperCase() !== "TELÉFONO") {
          throw new Error('La columna C1 no contiene TELÉFONO');
        }

        const D1 = worksheet.getRow(1).getCell(4).value;
        if (String(D1).toUpperCase() !== "TELÉFONO-EX") {
          throw new Error('La columna D1 no contiene TELÉFONO-EX');
        }

        const E1 = worksheet.getRow(1).getCell(5).value;
        if (String(E1).toUpperCase() !== "DIRECCIÓN") {
          throw new Error('La columna E1 no contiene DIRECCIÓN');
        }

        const F1 = worksheet.getRow(1).getCell(6).value;
        if (String(F1).toUpperCase() !== "REFERENCIAS") {
          throw new Error('La columna F1 no contiene REFERENCIAS');
        }

        const G1 = worksheet.getRow(1).getCell(7).value;
        if (String(G1).toUpperCase() !== "TIPO-ENVIO") {
          throw new Error('La columna G1 no contiene TIPO-ENVIO');
        }

        const H1 = worksheet.getRow(1).getCell(8).value;
        if (String(H1).toUpperCase() !== "DEPARTAMENTO") {
          throw new Error('La columna H1 no contiene DEPARTAMENTO');
        }

        const I1 = worksheet.getRow(1).getCell(9).value;
        if (String(I1).toUpperCase() !== "PROVINCIA") {
          throw new Error('La columna I1 no contiene PROVINCIA');
        }

        const J1 = worksheet.getRow(1).getCell(10).value;
        if (String(J1).toUpperCase() !== "DISTRITO") {
          throw new Error('La columna J1 no contiene DISTRITO');
        }

        const K1 = worksheet.getRow(1).getCell(11).value;
        if (String(K1).toUpperCase() !== "TIPO-MOVIMIENTO") {
          throw new Error('La columna K1 no contiene TIPO-MOVIMIENTO');
        }

        const L1 = worksheet.getRow(1).getCell(12).value;
        if (String(L1).toUpperCase() !== "TIPO-LOGISTICA") {
          throw new Error('La columna L1 no contiene TIPO-LOGISTICA');
        }

        const M1 = worksheet.getRow(1).getCell(13).value;
        if (String(M1).toUpperCase() !== "CONTENIDO-MERC") {
          throw new Error('La columna M1 no contiene CONTENIDO-MERC');
        }

        const N1 = worksheet.getRow(1).getCell(14).value;
        if (String(N1).toUpperCase() !== "PESO-MERC") {
          throw new Error('La columna N1 no contiene PESO-MERC');
        }

        const O1 = worksheet.getRow(1).getCell(15).value;
        if (String(O1).toUpperCase() !== "CANT-MERC") {
          throw new Error('La columna O1 no contiene CANT-MERC');
        }

        const P1 = worksheet.getRow(1).getCell(16).value;
        if (String(P1).toUpperCase() !== "LARGO") {
          throw new Error('La columna P1 no contiene LARGO');
        }

        const Q1 = worksheet.getRow(1).getCell(17).value;
        if (String(Q1).toUpperCase() !== "ANCHO") {
          throw new Error('La columna Q1 no contiene ANCHO');
        }

        const R1 = worksheet.getRow(1).getCell(18).value;
        if (String(R1).toUpperCase() !== "ALTO") {
          throw new Error('La columna R1 no contiene ALTO');
        }

        const S1 = worksheet.getRow(1).getCell(19).value;
        if (String(S1).toUpperCase() !== "VALOR-MERCANCÍA") {
          throw new Error('La columna S1 no contiene VALOR-MERCANCÍA');
        }

        const T1 = worksheet.getRow(1).getCell(20).value;
        if (String(T1).toUpperCase() !== "G-TRANSPORTISTA") {
          throw new Error('La columna T1 no contiene G-TRANSPORTISTA');
        }

        const U1 = worksheet.getRow(1).getCell(21).value;
        if (String(U1).toUpperCase() !== "G-REMISIÓN") {
          throw new Error('La columna U1 no contiene G-REMISIÓN');
        }

        const V1 = worksheet.getRow(1).getCell(22).value;
        if (String(V1).toUpperCase() !== "NRO. PEDIDO") {
          throw new Error('La columna V1 no contiene NRO. PEDIDO');
        }

        const W1 = worksheet.getRow(1).getCell(23).value;
        if (String(W1).toUpperCase() !== "DOC-ADICIONAL") {
          throw new Error('La columna W1 no contiene DOC-ADICIONAL');
        }

        const parsedData = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber !== 1) {
            const rowData = {};
            row.eachCell((cell, colNumber) => {
              rowData[worksheet.getRow(1).getCell(colNumber).value] = cell.value;
            });
            parsedData.push(rowData);
          }
        });
        setData(parsedData);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
        ocultarModalAgregar();
      }
    };
  };

  const enviarDatos = async () => {
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
      let apiUrl;
      apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/RegistroMasivo/guardarDestino.php`;
      const payload = {
        id_usuario: localStorage.getItem('id_usuario'),
        id_cliente,
        id_area,
        data: data,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: responseData.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: responseData.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de Importar',
      });
      console.log(error);
    }
    cargarListaEnvios();
    ocultarModalAgregar();
  };

  return (
    <>
      <div
        className={`side-panel-container ${modalMasivo ? "visible" : "invisible"
          } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${modalMasivo ? "translate-y-0" : "translate-y-[600%]"
            } w-[600px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Agregar </h1>
                  </div>
                </div>
                <div className="up-file px-6">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="file_input"
                  >
                    Subir Archivo:
                  </label>
                  <input
                    className="block w-full text-sm  border border-gray-300 rounded-lg cursor-pointer bg-gray-100 dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-400 dark:placeholder-gray-400 "
                    id="file_input"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    required
                  />
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container">
                    <div className="flex items-center justify-end mt-8 h-4">
                      <button
                        onClick={() => {
                          enviarDatos();
                        }}
                        type="button"
                        className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          ocultarModalAgregar();
                        }}
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

export default AgregarMasivo;
