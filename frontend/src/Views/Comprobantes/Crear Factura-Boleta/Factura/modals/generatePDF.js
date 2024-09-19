import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = () => {
  const doc = new jsPDF();

  // Helper function to add content to the first page
  const addContentToFirstPage = (doc, data) => {
    if (data.pageCount === 1) {
      // Add logo (replace with actual logo import)

      // Add company name
      doc.setTextColor(0, 102, 153);
      doc.setFont("Arial");
      doc.setFontSize(18);
      doc.text("Your Company Name", 65, 20);

      // Add company slogan
      doc.setFont("Arial");
      doc.setTextColor(0, 102, 153);
      doc.setFontSize(10);
      doc.text("Your company slogan goes here", 50, 38);
      doc.text("Additional slogan text", 100, 43);
    }
  };

  // Header with quotation number
  const headerContent = [
    { content: "", styles: { cellWidth: 150, fillColor: [255, 255, 255] } },
    { content: "N° Quotation", styles: { cellWidth: 30 } },
  ];

  const headerData = [
    { content: "", styles: { cellWidth: 150, fillColor: [255, 255, 255] } },
    { content: "QUO-001", style: { cellWidth: 30 } },
  ];

  doc.autoTable({
    startY: 5,
    head: [headerContent],
    body: [headerData],
    styles: { halign: "center" },
  });

  // Customer information
  const customerHeaders = ["RUC/DNI", "Client", "Contact", "City"];
  const customerData = [
    ["12345678901", "Sample Client", "John Doe", "Sample City"],
  ];

  doc.autoTable({
    startY: 50,
    head: [customerHeaders],
    body: customerData,
    headStyles: { fillColor: [93, 182, 251] },
    bodyStyles: { fillColor: [243, 247, 246] },
    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
    afterPageContent: (data) => addContentToFirstPage(doc, data),
  });

  // Additional customer information
  const additionalHeaders = [
    "Phone",
    "Address",
    "Email",
    "Date",
    "Payment Method",
  ];
  const additionalData = [
    ["123-456-7890", "123 Sample St", "sample@email.com", "2024-08-27", "CASH"],
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY,
    head: [additionalHeaders],
    body: additionalData,
    headStyles: { fillColor: [93, 182, 251] },
    bodyStyles: { fillColor: [243, 247, 246] },
    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
  });

  // Quotation details
  const quoteHeaders = [
    "Item",
    "Delivery Destination",
    "Qty",
    "Weight",
    "Vol Weight",
    "Shipping Cost",
    "Extra Cost",
    "Total Value",
  ];

  const quoteData = [
    [
      { content: "1", styles: { fillColor: [192, 192, 192] } },
      "City A, Province B, Destination C",
      "5",
      "10.00",
      "12.50",
      "S/.100.00",
      "S/.20.00",
      { content: "S/.120.00", styles: { fillColor: [192, 192, 192] } },
    ],
    // Add more rows as needed
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    head: [quoteHeaders],
    body: quoteData,
    headStyles: { fillColor: [25, 81, 144] },
    theme: "grid",
    styles: {
      halign: "center",
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
    },
  });

  // Footer with totals
  const footerData = [
    [
      {
        content: "Observations:",
        styles: { cellWidth: 130, lineColor: [128, 128, 128], lineWidth: 0.1 },
      },
      {
        content: "Subtotal",
        styles: {
          cellWidth: 10,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
      {
        content: "100.00",
        styles: {
          fillColor: [192, 192, 192],
          halign: "center",
          cellWidth: 21.19,
          textColor: [0, 0, 0],
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
    ],
    [
      { content: "", styles: { cellWidth: 130, fillColor: [240, 248, 255] } },
      {
        content: "VAT (18%)",
        styles: {
          cellWidth: 22,
          halign: "center",
          lineColor: [128, 128, 128],
          lineWidth: 0.1,
        },
      },
      {
        content: "18.00",
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
        content: "118.00",
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
    startY: doc.autoTable.previous.finalY,
    body: footerData,
    theme: "grid",
    styles: {
      fillColor: [25, 81, 144],
    },
  });

  // Save and open the PDF
  doc.save("Sample_Quotation.pdf");
  doc.output("dataurlnewwindow");
};
