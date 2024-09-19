import { jsPDF } from "jspdf";
import "jspdf-autotable";
import qrcode from "qrcode";

export const printPDF = (datosPdfActuales) => {
  

  const datosCliente = {
    RucEmpresa: 20610314644,
    UbicacionEmpresa: "Av.Primavera Mz. H Lote. 106d A. V. los",
    cliente:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.razon_social_cliente
        ? datosPdfActuales.cotizacion_cliente.razon_social_cliente
        : "",
    rucCliente:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.dni_cliente
        ? datosPdfActuales.cotizacion_cliente.dni_cliente
        : "",
    direccionCliente:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.direccion_cliente
        ? datosPdfActuales.cotizacion_cliente.direccion_cliente
        : "",
  };

  const datosCotizacion = {
    fechaEmision:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.fecha_creado
        ? datosPdfActuales.cotizacion_cliente.fecha_creado
        : "",
    id_punto_venta:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.id_punto_venta
        ? datosPdfActuales.cotizacion_cliente.id_punto_venta
        : "",
  };

  const importes = {
    sub_total_punto_venta:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.sub_total_punto_venta
        ? datosPdfActuales.cotizacion_cliente.sub_total_punto_venta
        : "",
    igv_punto_venta:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.igv_punto_venta
        ? datosPdfActuales.cotizacion_cliente.igv_punto_venta
        : "",
    precio_total_punto_venta:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.precio_total_punto_venta
        ? datosPdfActuales.cotizacion_cliente.precio_total_punto_venta
        : "",
  };


  let h = 12;
  const data = [
    ['Cant', '                            Descripción envio ', 'Costo envio', 'Costo extra', 'Valor Total'],
    ...datosPdfActuales.cotizacion_destinos.map((destino) => [
      `${destino.cantidad_mercancia_punto_venta_destino}`,`${destino.DEPARTAMENTO}, ${destino.PROVINCIA}, ${destino.DESTINO}`,`S/.${parseFloat(destino.total_tarifa_punto_venta_destino).toFixed(2)}`,
      `S/.${parseFloat(destino.total_adicional_punto_venta_destino).toFixed(2)}`,
      `S/.${(parseFloat(destino.total_tarifa_punto_venta_destino) + parseFloat(destino.total_adicional_punto_venta_destino)).toFixed(2)}`]),
  ];


  const startX = 0.3;
  const startY = 5;
  const cellWidth = [0.5, 3.0, 0.7, 0.7, 0.7];
  const cellHeight = 0.5;

  function calcularAltura(data, h) {
    if (data.length > 3) {
        h += 0.4 * (data.length - 3);
    }
    else if(data.length>1)
        h += 0.2*(data.length-1);
    return h;
}
function generarTabla(data, startX, startY, cellWidth, cellHeight, doc) {
  let ultimaY = startY; // Variable para almacenar la última coordenada Y

  for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
          const x = startX + cellWidth.slice(0, j).reduce((a, b) => a + b, 0);
          const y = startY + i * cellHeight;
          doc.text(x, y, data[i][j].toString());
          ultimaY = y; // Actualizamos la última coordenada Y
      }
  }

  return { doc, ultimaY }; // Retornamos el objeto doc y la última coordenada Y
}


const nuevoH = calcularAltura(data, h);

const docFinal = new jsPDF({
  unit: 'cm',
  format: [nuevoH, 6]
});

  docFinal.setTextColor(28, 65, 124);
  docFinal.setFontSize(3);
  docFinal.setFont("helvetica", "bold");

  docFinal.setLineWidth(0.02);
  docFinal.line(0.25, 5.2, 5.8, 5.2);

  const { doc: docConTabla, ultimaY } = generarTabla(data, startX, startY, cellWidth, cellHeight, docFinal);
 


  const pie = [
    [
      { content: "", styles: { cellWidth: 2.3, lineWidth: 0 } },
      { content: "IMPORTE" },
      {
        content: `S/.${parseFloat(importes.sub_total_punto_venta).toFixed(2)}`,
      },
    ],
    [
      { content: "", styles: { cellWidth: 2.3, lineWidth: 0 } },
      "IGV(18%)",
      `S/.${parseFloat(importes.igv_punto_venta).toFixed(2)}`,
    ],
    [
      { content: "", styles: { cellWidth: 2.3, lineWidth: 0 } },
      "TOTAL",
      `S/.${parseFloat(importes.precio_total_punto_venta).toFixed(2)}`,
    ],
  ];


  docFinal.autoTable({
    startY: ultimaY + 0.5,
    head: pie,
    theme: "plain",
    styles: {
      halign: "center",
      textColor: [28, 65, 124],
      fontSize: 4,
      cellHeight: 0.1,
      cellWidth: 1,
      lineColor: [0, 0, 0],
      lineWidth: { left: 0.01, right: 0.01, top: 0, button: 0 },
    },
  });
 

  docFinal.setTextColor(28, 65, 124);
  docFinal.setFont("Arial");
  docFinal.setFontSize(7);

  // Título
  docFinal.text("Transportes Mr Logistik S.A.C", 1.5, 1);

  // // Información de empresa
  docFinal.setFontSize(5);
  docFinal.text(`Ruc: ${datosCliente.RucEmpresa}`, 2.5, 1.5);
  docFinal.text(`Direccion: ${datosCliente.UbicacionEmpresa}`, 1.2, 1.8);
  docFinal.text(`Gramadales`, 2.5, 2.1);
  docFinal.text(`Punto Venta`, 2.5, 2.4);
  docFinal.text(`Electronica`, 2.5, 2.7);
  docFinal.text(`No: ${datosCotizacion.id_punto_venta}`, 2.5, 3.0);
  //cliente
  docFinal.text(`Cliente: ${datosCliente.cliente}`, 0.5, 3.6);
  docFinal.text(`Ruc: ${datosCliente.rucCliente}`, 0.5, 3.9);
  docFinal.text(`Direccion: ${datosCliente.direccionCliente}`, 0.5, 4.2);
  docFinal.text(`Fecha emisión: ${datosCotizacion.fechaEmision}`, 0.5, 4.5);


  docFinal.setLineWidth(0.02);
  docFinal.line(0.3, ultimaY + 2.5, 5.8, ultimaY + 2.5);
  // Parte inferior
  qrcode.toDataURL(`${datosCotizacion.id_punto_venta}`, function (err, url) {
    if (err) return console.error(err);
    docFinal.addImage(url, "PNG",  3.4, ultimaY + 2.7, 2.3, 2.3);
  });
    docFinal.setTextColor(28, 65, 124);
  docFinal.setFontSize(4);
  docFinal.setFont("helvetica", "bold");
  docFinal.text(`Consulta en: http://logistkmr.com`, 0.5, ultimaY + 3.3);
  docFinal.text(`Nuestra experiencia en logística garantiza`, 0.25, ultimaY + 3.5);
  docFinal.text(`que tus entregas sean eficientes y`, 0.6, ultimaY + 3.7);
  docFinal.text(`confiable.`, 1.3, ultimaY + 3.9);
  docFinal.text(`mrlogistik@hotmail.com`,0.8, ultimaY + 4.3);
  docFinal.text(`(51) 976-037-013`, 1.0, ultimaY + 4.5);
  docFinal.save(`Reporte_${datosCotizacion.id_punto_venta}`);
  docConTabla.output('dataurlnewwindow');
};
