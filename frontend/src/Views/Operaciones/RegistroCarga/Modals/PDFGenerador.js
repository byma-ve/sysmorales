import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import qrcode from "qrcode";
import LogoHorizontal from "../../../../Static/Img_Pred/LogoOscuro.webp";

const obtenerDatosSticker = async (id) => {
  try {
    const response = await fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Consultas/obtenerConsulta.php?id_num_guia=${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos del sticker:", error);
    return null;
  }
};

export const sticker = async (cantidadStickers = 1, id, fechaSeleccionada) => {
  const datosSticker = await obtenerDatosSticker(id);
  const doc = new jsPDF({
    unit: "cm",
    format: [10, 7.5],
    orientation: "landscape",
  });
  for (let i = 0; i < cantidadStickers; i++) {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, id, {
      format: "CODE128",
      displayValue: false,
      fontSize: 12,
      margin: 10,
    });
    const barcodeImage = canvas.toDataURL("image/png");
    //empresa
    doc.setFontSize(12);
    doc.setTextColor(28, 65, 124);
    doc.text(`${datosSticker.departamento_destino}`, 5, 0.7);
    doc.text(`TRACKING:${id}`, 1.1, 2.7);
    doc.text(`(${i + 1}/${cantidadStickers})`, 7, 2.7);
    doc.setFontSize(6);
    doc.setTextColor(28, 65, 124);
    doc.text(`Transportes Mr Logistik S.A.C`, 0.5, 0.5);
    doc.text(`ENVIA: ${datosSticker.razon_social_cliente}`, 0.5, 1);
    doc.text(`${fechaSeleccionada}`, 3.5, 0.5);
    doc.text(`(ubigeo)`, 8.7, 0.5);
    doc.text(`${datosSticker.ubigeo}`, 8.7, 0.8);
    //barra en pdf
    doc.addImage(barcodeImage, "PNG", 1.55, 1.1, 7, 1.2);
    //cliente
    doc.text(`RECIBE:${datosSticker.consignado}`, 0.5, 3.1);
    doc.text(`DIRECCION:${datosSticker.direccion} `, 0.5, 3.4);
    doc.text(`${datosSticker.guia_remision}`, 0.5, 4.0);
    doc.text(
      `${datosSticker.departamento_destino}/${datosSticker.provincia_destino}/${datosSticker.distrito_destino}`,
      0.5,
      4.3
    );
    //cuadrados letras
    doc.text("NOMBRES:", 0.5, 4.8);
    doc.text("TITULAR", 0.9, 6.425);
    doc.text("EMPLEADO", 0.9, 7.025);
    doc.text("FAMILIAR", 2.9, 6.425);
    doc.text("VIGILANTE", 2.9, 7.025);
    doc.text("D.I:", 0.5, 5.8);
    doc.text("FEC:_ _ _/_ _ _/ _ _ _", 4.5, 6.425);
    doc.text("HOR:_ _ _ _ : _ _ _ _", 4.5, 7.025);
    doc.text("Firma Y/O SELLO", 7.6, 7.025);
    //cuadrados
    doc.setDrawColor(28, 65, 124);
    doc.setLineWidth(0.02);
    doc.rect(0.5, 6.2, 0.3, 0.3);
    doc.rect(0.5, 6.8, 0.3, 0.3);
    //familiar y vigilante
    doc.rect(2.5, 6.2, 0.3, 0.3);
    doc.rect(2.5, 6.8, 0.3, 0.3);
    //lineas
    doc.setLineWidth(0.01);
    doc.setLineDash([0.25]);
    //nombre
    doc.line(1.7, 4.8, 7, 4.8);
    //linea sola
    doc.line(0.5, 5.2, 7, 5.2);
    //linea d.i
    doc.line(0.9, 5.8, 3, 5.8);
    //firma
    doc.setLineDash([0.1]);
    doc.line(7, 6.7, 9.8, 6.7);
    if (i < cantidadStickers - 1) {
      doc.addPage();
    }
  }
  doc.save(`Reporte_${id}`);
};

export const pdf9x21 = async (cantidadPdf9x21 = 1, id, fechaSeleccionada) => {
  const datosPdf9x21 = await obtenerDatosSticker(id);
  const doc = new jsPDF({
    unit: "cm",
    format: [21, 9.9],
    orientation: "landscape",
  });
  for (let i = 0; i < cantidadPdf9x21; i++) {
    doc.addImage(LogoHorizontal, "PNG", 1, 0.2, 3.5, 1.5);

    doc.setFontSize(6);
    doc.text(`Fecha: ${fechaSeleccionada}`, 12.1, 1.5);
    doc.setFontSize(8);
    doc.setFont("calibri");
    doc.text(`RUC: 20547297157 `, 9.3, 0.7);
    doc.text("Av.Primavera MZA. H Lote . 106d AV.los Gramadales", 5.35, 1);
    doc.text("www.logistikmr.com", 9.2, 1.3);
    doc.text(`Servicio al cliente: (51)976037013`, 7.7, 1.6);
    //cuadros remitente
    doc.setLineWidth(0.02);
    doc.setFontSize(9);
    doc.text(`Orden Servicio: ${datosPdf9x21.id_orden_servicio}`, 0.9, 2.3);
    doc.rect(0.8, 2, 10.86, 0.5);
    doc.text(`Nombre:  ${datosPdf9x21.razon_social_cliente}`, 1.48, 2.8);
    doc.text(`RUC/DNI: ${datosPdf9x21.dni_cliente}`, 7.8, 2.8);
    doc.text(`Direccion: ${datosPdf9x21.direccion_cliente}`, 1.48, 3.5);
    doc.text(`Teléfono: ${datosPdf9x21.telefono_cliente}`, 1.48, 4.2);
    doc.text(`Correo: ${datosPdf9x21.email_cliente}`, 1.48, 5);
    doc.rect(1.41, 2.5, 10.25, 3);
    doc.text("REMITENTE", 1.2, 5, null, 90);
    doc.rect(0.8, 2.5, 0.6, 3);
    doc.setFontSize(7.5);
    doc.text(`Causal de devolución`, 1.5, 5.8);
    doc.rect(0.8, 5.5, 3.8, 0.4);

    const m4 = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 24 24"><path fill="none" stroke="#000000" stroke-linecap="round" stroke-width="1.5" d="M21.984 10c-.037-1.311-.161-2.147-.581-2.86c-.598-1.015-1.674-1.58-3.825-2.708l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-2 1.05C4.271 5.56 3.195 6.125 2.597 7.14C2 8.154 2 9.417 2 11.942v.117c0 2.524 0 3.787.597 4.801c.598 1.015 1.674 1.58 3.825 2.709l2 1.049C10.178 21.539 11.056 22 12 22s1.822-.46 3.578-1.382l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.42-.713.544-1.549.581-2.86M21 7.5l-4 2M12 12L3 7.5m9 4.5v9.5m0-9.5l4.5-2.25l.5-.25m0 0V13m0-3.5l-9.5-5"/></svg>`;
    const svgToDataURL = (svg) => {
      return new Promise((resolve) => {
        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = url;
      });
    };

    const caja2_despacho = await svgToDataURL(m4);

    doc.addImage("/caja1_despacho.png", "PNG", 9.3, 3.8, 1.5, 1.5);
    doc.setFontSize(8);
    doc.text("  1       2       3", 0.9, 6.4);
    //cuadros destino
    doc.setLineWidth(0.02);
    doc.addImage(caja2_despacho, "PNG", 12.75, 2, 1, 1);

    doc.setLineWidth(0.02);
    doc.setFillColor(75, 75, 75);
    doc.rect(12.1, 0.49, 2.7, 0.7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Canal Operaciones", 12.4, 0.9);

    doc.setTextColor(0, 0, 0);
    doc.rect(12.45, 2, 1.5, 1);
    doc.text(`Destino: ${datosPdf9x21.departamento_destino}`, 14.4, 2.35);
    doc.rect(13.95, 2, 6.3, 0.5);
    doc.text(`Provincia: ${datosPdf9x21.provincia_destino}`, 14.4, 2.85);
    doc.rect(13.95, 2.5, 6.3, 0.5);
    doc.text(`Nombre: ${datosPdf9x21.consignado}`, 12.75, 3.5);
    doc.setFontSize(7);
    doc.text(`Direcccion: ${datosPdf9x21.direccion}`, 12.75, 4.35);
    doc.setFontSize(8);
    doc.text(`Teléfono: ${datosPdf9x21.telefono}`, 12.75, 5.1);
    doc.text(`RUC/DNI: ${datosPdf9x21.dni_ruc}`, 12.75, 5.8);
    doc.rect(12.45, 3, 7.8, 3.1);
    doc.text("DESTINATARIO", 12.2, 5.2, null, 90);
    doc.rect(11.8, 2, 0.65, 4.1);
    doc.setFontSize(6.5);
    doc.text(`Caracteristicas fisicas de envio`, 12, 6.45);
    doc.rect(11.8, 6.1, 3.2, 0.5);
    doc.setFontSize(8);
    doc.text(`Contenido de mercancia`, 16.8, 6.45);
    doc.rect(16, 6.1, 4.25, 0.5);

    doc.rect(16, 6.6, 4.25, 1);
    doc.text(`Cantidad:     ${datosPdf9x21.cantidad_mercancia}`, 11.98, 7);
    doc.text(
      `Peso(Kg):    ${parseFloat(datosPdf9x21.peso_mercancia).toFixed(2)}`,
      11.98,
      7.4
    );
    doc.text(
      `Peso(Vol):   ${parseFloat(datosPdf9x21.total_peso_volumen).toFixed(2)}`,
      11.98,
      7.8
    );
    //firma izquierda
    doc.line(0.8, 9, 6.15, 9);
    //cuadrados tiempo
    doc.rect(6.4, 8.5, 1.2, 0.5);
    doc.rect(7.6, 8.5, 1.2, 0.5);
    doc.rect(8.8, 8.5, 1.2, 0.5);
    doc.rect(10, 8.5, 1.2, 0.5);
    doc.setTextColor(210, 210, 210);
    doc.setFontSize(8);
    doc.text("Dia", 6.8, 8.85);
    doc.text("Mes", 8, 8.85);
    doc.text("Año", 9.2, 8.85);
    doc.text("Hora", 10.3, 8.85);
    doc.setTextColor(0);
    //linea derecha
    doc.setLineWidth(0.01);
    doc.setLineDash([0.25]);
    doc.line(11.2, 8.4, 20, 8.4);
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    };
    qrcode.toDataURL(`${id}`, opts, function (err, url) {
      if (err) return console.error(err);
      doc.addImage(url, "PNG", 8, 5.55, 1.5, 1.5);
    });
    const canvas = document.createElement("canvas");
    const canvas2 = document.createElement("canvas");
    JsBarcode(canvas, id, {
      format: "CODE128B",
      displayValue: true,
      textAlign: "center",
      fontSize: 20,
      textMargin: 3,
      fontOptions: "bold",
    });
    JsBarcode(canvas2, id, {
      format: "CODE128B",
      displayValue: true,
      fontSize: 30,
      font: "sans-serif",
      fontOptions: "bold",
      textAlign: "right",
      textMargin: 4,
    });
    const barcodeImage = canvas.toDataURL("image/png");
    const barcodeImage2 = canvas2.toDataURL("image/png");
    doc.addImage(barcodeImage, "PNG", 6.3, 7.15, 5, 1.35);
    doc.addImage(barcodeImage2, "PNG", 15, 0.2, 5.2, 1.4);
    doc.setFontSize(6);
    doc.text("CODIGO DE ", 15.5, 1.45);
    doc.text("TRACKING N° ", 15.4, 1.65);
    //causal de devolucion
    doc.setLineWidth(0.01);
    doc.setLineDash([0.45]);
    doc.setFontSize(7);
    doc.line(0.8, 6.9, 3, 6.9);
    doc.line(0.8, 7.3, 3, 7.3);
    doc.line(0.8, 7.7, 3, 7.7);
    doc.line(0.8, 8.1, 3, 8.1);
    doc.text(" Direccion incorrecta", 3.5, 6.9);
    doc.text(" Telefono apagado", 3.5, 7.3);
    doc.text(" Zona no accesible", 3.5, 7.7);
    doc.text(" Cliente de viaje", 3.5, 8.1);
    doc.setFontSize(7);
    doc.text("Recepcion de envio, nombre,firma,sello", 1.5, 9.3);
    if (i < cantidadPdf9x21 - 1) {
      doc.addPage();
    }
  }
  doc.save(`Reporte_${id}.pdf`);
};
