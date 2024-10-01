import { useState, useEffect } from "react";
import {
  IconoExcel,
  IconoRecojos,
  IconoGuias,
  IconoDespachos,
  IconoMotivados,
  IconoEntregados,
} from "../../../Iconos/Iconos-NavBar";
import ExcelJS from "exceljs";

export default function DashboardStatsGrid({ idArea, idCliente, idYear }) {
  const [totalRecojos, setTotalRecojos] = useState([]);
  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/totalRecojos.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setTotalRecojos(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  const [totalGuias, setTotalGuias] = useState([]);
  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/totalGuias.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setTotalGuias(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  const [totalDespachos, setTotalDespachos] = useState([]);
  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/totalDespachos.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setTotalDespachos(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  const [totalMotivados, setTotalMotivados] = useState([]);
  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/totalMotivados.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setTotalMotivados(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  const [totalEntregados, setTotalEntregados] = useState([]);
  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/totalEntregados.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setTotalEntregados(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  async function descargarExcelGuias() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/guias_dashboard.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/exportarGuias.php`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 9 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value =
            rowData.id_orden_servicio_registro_carga;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value =
            rowData.id_num_guia_registro_carga;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
        }
      }

      const apiUrl2 = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/exportarGuiasTotales.php`;
      const apiResponse2 = await fetch(apiUrl2, {
        method: "GET",
      });
      const apiData2 = await apiResponse2.json();

      if (Array.isArray(apiData2)) {
        for (let i = 0; i < apiData2.length; i++) {
          const rowData = apiData2[i];
          const rowNumber = 9 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`I${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.guias_madre;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.guias_tracking;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Guias.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  async function descargarExcelRecojos() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/lista_recojos.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("B7").value = "";

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/ListaRecojos/obtenerListaRecojos.php`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 11 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_recojo;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value =
            rowData.id_orden_servicio_recojo;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.fecha_programacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.hora_programacion;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(
            `H${rowNumber}`
          ).value = `${rowData.DEPARTAMENTO}, ${rowData.PROVINCIA}, ${rowData.DESTINO}`;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value =
            rowData.comentario_estado_recojo;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lista_recojos.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  async function descargarExcelDespachos() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/seguimiento.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("B7").value = "";
      worksheet.getCell("B8").value = "";
      worksheet.getCell("B9").value = "";

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/Seguimiento/exportarDespachos.php`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 13 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_operacion;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.fecha_operacion;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.hora_operacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.orden_servicio;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.destino_partida;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.nombre_consignado;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.destino_llegada;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.direccion_envio;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.contenido_envio;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.cantidad_envio;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
          worksheet.getCell(`O${rowNumber}`).value = rowData.peso_masa_envio;
          worksheet.getCell(`O${rowNumber}`).style = cellStyle;
          worksheet.getCell(`P${rowNumber}`).value = rowData.peso_volumen_envio;
          worksheet.getCell(`P${rowNumber}`).style = cellStyle;
          worksheet.getCell(`Q${rowNumber}`).value = rowData.lead_time;
          worksheet.getCell(`Q${rowNumber}`).style = cellStyle;
          worksheet.getCell(`R${rowNumber}`).value = rowData.tiempo_entrega;
          worksheet.getCell(`R${rowNumber}`).style = cellStyle;
          worksheet.getCell(`S${rowNumber}`).value = rowData.entrega_status;
          worksheet.getCell(`S${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `despachos.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  async function descargarExcelMotivados() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/seguimiento.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("B7").value = "";
      worksheet.getCell("B8").value = "";
      worksheet.getCell("B9").value = "";

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/Seguimiento/exportarMotivados.php`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 13 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_operacion;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.fecha_operacion;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.hora_operacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.orden_servicio;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.destino_partida;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.nombre_consignado;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.destino_llegada;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.direccion_envio;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.contenido_envio;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.cantidad_envio;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
          worksheet.getCell(`O${rowNumber}`).value = rowData.peso_masa_envio;
          worksheet.getCell(`O${rowNumber}`).style = cellStyle;
          worksheet.getCell(`P${rowNumber}`).value = rowData.peso_volumen_envio;
          worksheet.getCell(`P${rowNumber}`).style = cellStyle;
          worksheet.getCell(`Q${rowNumber}`).value = rowData.lead_time;
          worksheet.getCell(`Q${rowNumber}`).style = cellStyle;
          worksheet.getCell(`R${rowNumber}`).value = rowData.tiempo_entrega;
          worksheet.getCell(`R${rowNumber}`).style = cellStyle;
          worksheet.getCell(`S${rowNumber}`).value = rowData.entrega_status;
          worksheet.getCell(`S${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `motivados.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  async function descargarExcelEntregados() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/seguimiento.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("B7").value = "";
      worksheet.getCell("B8").value = "";
      worksheet.getCell("B9").value = "";

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/Seguimiento/exportarEntregados.php`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 13 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_operacion;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.fecha_operacion;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.hora_operacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.orden_servicio;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.destino_partida;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.nombre_consignado;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.destino_llegada;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.direccion_envio;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.contenido_envio;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.cantidad_envio;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
          worksheet.getCell(`O${rowNumber}`).value = rowData.peso_masa_envio;
          worksheet.getCell(`O${rowNumber}`).style = cellStyle;
          worksheet.getCell(`P${rowNumber}`).value = rowData.peso_volumen_envio;
          worksheet.getCell(`P${rowNumber}`).style = cellStyle;
          worksheet.getCell(`Q${rowNumber}`).value = rowData.lead_time;
          worksheet.getCell(`Q${rowNumber}`).style = cellStyle;
          worksheet.getCell(`R${rowNumber}`).value = rowData.tiempo_entrega;
          worksheet.getCell(`R${rowNumber}`).style = cellStyle;
          worksheet.getCell(`S${rowNumber}`).value = rowData.entrega_status;
          worksheet.getCell(`S${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `entregados.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  return (
    <div className="flex gap-4">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-gray-600">
          <IconoGuias className="text-3xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Guías</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalGuias.total_guias}
            </strong>
            <span className="text-sm text-green-500 pl-2"></span>
          </div>
        </div>
        <button
          className="text-xl text-green-500  relative -top-3 ml-2"
          onClick={descargarExcelGuias}
        >
          <IconoExcel />
        </button>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-cyan-500">
          <IconoRecojos className="text-3xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Recojos</span>

          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalRecojos.cantidad_ordenes}
            </strong>
          </div>
        </div>
        <button
          className="text-xl text-green-500  relative -top-3 ml-2"
          onClick={descargarExcelRecojos}
        >
          <IconoExcel />
        </button>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center  bg-blue-500">
          <IconoDespachos className="text-3xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Despachos</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalDespachos.total_despachos}
            </strong>
          </div>
        </div>
        <button
          className="text-xl text-green-500  relative -top-3 ml-2"
          onClick={descargarExcelDespachos}
        >
          <IconoExcel />
        </button>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-500">
          <IconoMotivados className="text-3xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Motivados</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalMotivados.total}
            </strong>
            <span className="text-sm text-red-500 pl-2"></span>
          </div>
        </div>
        <button
          className="text-xl text-green-500  relative -top-3 ml-2"
          onClick={descargarExcelMotivados}
        >
          <IconoExcel />
        </button>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500">
          <IconoEntregados className="text-3xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Entregados</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {totalEntregados.total_entregado}
            </strong>
            <span className="text-sm text-red-500 pl-2"></span>
          </div>
        </div>
        <button
          className="text-xl text-green-500  relative -top-3 ml-2"
          onClick={descargarExcelEntregados}
        >
          <IconoExcel />
        </button>
      </BoxWrapper>
    </div>
  );
}

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-xl p-4 flex-1 border border-gray-200 flex items-center mb-4">
      {children}
    </div>
  );
}
