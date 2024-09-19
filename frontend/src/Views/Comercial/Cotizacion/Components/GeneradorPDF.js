import LogoLogis from "../../../../Static/Img_Pred/LogoOscuro.webp";

import jsPDF from "jspdf";

export const printPDF = (datosPdfActuales) => {
  const idprincipal = {
    id_cotizacion:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.id_cotizacion
        ? datosPdfActuales.cotizacion_cliente.id_cotizacion
        : "",
    dni_cliente:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.dni_cliente
        ? datosPdfActuales.cotizacion_cliente.dni_cliente
        : "",
    cliente:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.razon_social_cliente
        ? datosPdfActuales.cotizacion_cliente.razon_social_cliente
        : "",
    contacto:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.contacto_cliente
        ? datosPdfActuales.cotizacion_cliente.contacto_cliente
        : "",
    ciudad:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.DEPARTAMENTO
        ? datosPdfActuales.cotizacion_cliente.DEPARTAMENTO
        : "",
    telefono:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.telefono_cliente
        ? datosPdfActuales.cotizacion_cliente.telefono_cliente
        : "",
    direccion: {
      ciudad:
        datosPdfActuales.cotizacion_cliente &&
        datosPdfActuales.cotizacion_cliente.direccion_cliente
          ? datosPdfActuales.cotizacion_cliente.direccion_cliente
          : "",
    },
    email:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.email_cliente
        ? datosPdfActuales.cotizacion_cliente.email_cliente
        : "",
    fecha:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.fecha_creado
        ? datosPdfActuales.cotizacion_cliente.fecha_creado
        : "",
    pago: (datosPdfActuales.cotizacion_cliente &&
    datosPdfActuales.cotizacion_cliente.recibo_cotizacion
      ? datosPdfActuales.cotizacion_cliente.recibo_cotizacion
      : ""
    ).toUpperCase(),
  };

  const importes = {
    sub_total_cotizacion:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.sub_total_cotizacion
        ? datosPdfActuales.cotizacion_cliente.sub_total_cotizacion
        : "",
    igv_cotizacion:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.igv_cotizacion
        ? datosPdfActuales.cotizacion_cliente.igv_cotizacion
        : "",
    precio_total_cotizacion:
      datosPdfActuales.cotizacion_cliente &&
      datosPdfActuales.cotizacion_cliente.precio_total_cotizacion
        ? datosPdfActuales.cotizacion_cliente.precio_total_cotizacion
        : "",
  };

  const doc = new jsPDF();
  const contxt = [
    { content: "", styles: { cellWidth: 150, fillColor: [255, 255, 255] } },
    {
      content: "N° Cotizacion",
      styles: { cellWidth: 30},
    },
  ];

  let conteo = [
    { content: "", styles: { cellWidth: 150, fillColor: [255, 255, 255] } },
    {
      content: idprincipal.id_cotizacion,
      style: { cellWidth: 30},
    },
  ];
  const addContentToFirstPage = (doc, data) => {
    if (data.pageCount === 1) {
      doc.addImage(LogoLogis, "PNG", 10, 7, 35, 20);
      doc.setTextColor(0, 102, 153);
      doc.setFont("Arial");
      doc.setFontSize(18);
      doc.text("Transportes Mr Logistik S.A.C", 65, 20);
      doc.setFont("Arial");
      doc.setTextColor(0, 102, 153);
      doc.setFontSize(10);
      doc.text(
        "Nuestra experiencia en logistica garantiza que tus entregas sean eficientes y",
        50,
        38
      );
      doc.text("confiable.", 100, 43);
    }
  };
  const titul0 = ["Ruc/DNI", "Cliente", "Contacto", "Ciudad"];
  const line0 = [
    [
      `${idprincipal.dni_cliente}`,
      `${idprincipal.cliente}`,
      `${idprincipal.contacto}`,
      `${idprincipal.ciudad}`,
    ],
  ];

  const titul1 = ["Teléfono", "Direccion", "Email", "Fecha", "Forma de pago"];
  const line1 = [
    [
      `${idprincipal.telefono}`,
      `${idprincipal.direccion.ciudad}`,
      `${idprincipal.email}`,
      `${idprincipal.fecha}`,
      `${idprincipal.pago}`,
    ],
  ];

  const titul2 = [
    "Item",
    "Destino de entrega",
    "Cant",
    "Peso",
    "Peso vol",
    "Costo envio",
    "Costo extra",
    "Valor Total",
  ];

  const line2 = datosPdfActuales.cotizacion_destinos.map((destino, index) => [
    { content: `${index + 1}`, styles: { fillColor: [192, 192, 192] } },
    `${destino.DEPARTAMENTO}, ${destino.PROVINCIA}, ${destino.DESTINO}`,
    `${destino.cantidad_mercancia_cotizacion_destino}`,
    `${parseFloat(destino.peso_mercancia_cotizacion_destino).toFixed(2)}`,
    `${parseFloat(destino.total_peso_volumen_cotizacion_destino).toFixed(2)}`,
    `S/.${parseFloat(destino.total_tarifa_cotizacion_destino).toFixed(2)}`,
    `S/.${parseFloat(destino.total_adicional_cotizacion_destino).toFixed(2)}`,
    {
      content: `S/.${(
        parseFloat(destino.total_tarifa_cotizacion_destino) +
        parseFloat(destino.total_adicional_cotizacion_destino)
      ).toFixed(2)}`,
      styles: { fillColor: [192, 192, 192] },
    },
  ]);

  const pie = [
    [
      {
        content: "Observaciones:",
        styles: { cellWidth:130, lineColor: [128, 128, 128], lineWidth: 0.1 },
      },
      {
        content: "Importe",
        styles: {
          cellWidth: 10,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
      {
        content: parseFloat(importes.sub_total_cotizacion).toFixed(2),
        styles: {
          fillColor: [192, 192, 192],
          halign: "center",
          cellWidth: 21.19,
          textColor: [0, 0, 0],
          theme: "grid",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
    ],
    [
      { content: "", styles: { cellWidth: 130, fillColor: [240, 248, 255] } },
      {
        content: "IGV(18%)",
        styles: {
          cellWidth: 22,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
      {
        content: parseFloat(importes.igv_cotizacion).toFixed(2),
        styles: {
          fillColor: [192, 192, 192],
          cellWidth: 19.8,
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
          halign: "center",
          textColor: [0, 0, 0],
        },
      },
    ],
    [
      { content: "", styles: { cellWidth: 137.7, fillColor: [240, 248, 255] } },
      {
        content: "TOTAL",
        styles: {
          cellWidth: 22.9,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
      {
        content: parseFloat(importes.precio_total_cotizacion).toFixed(2),
        styles: {
          cellWidth: 20,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
    ],
  ];
  doc.autoTable({
    startY: 5,
    head: [contxt],
    styles: {
      halign: "center",
    },
    body: [conteo],
  });

  doc.autoTable({
    startY: 50,
    head: [titul0],
    headStyles: {
      fillColor: [93, 182, 251],
    },
    body: line0,
    bodyStyles: {
      fillColor: [243, 247, 246],
    },
    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
    afterPageContent: (data) => addContentToFirstPage(doc, data),
  });
  doc.autoTable({
    startY: doc.autoTable.previous.finalY,
    head: [titul1],
    headStyles: {
      fillColor: [93, 182, 251],
    },
    body: line1,
    bodyStyles: {
      fillColor: [243, 247, 246],
    },
    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
  });
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    head: [titul2],
    headStyles: {
      fillColor: [25, 81, 144],
    },
    body: line2,

    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
  });
  doc.autoTable({
    startY: doc.autoTable.previous.finalY,
    head: pie,
    theme: "grid",
    styles: {
      fillColor: [25, 81, 144],
    },
  });
  doc.save(`Reporte_${idprincipal.id_cotizacion}`);
  doc.output('dataurlnewwindow');
};
