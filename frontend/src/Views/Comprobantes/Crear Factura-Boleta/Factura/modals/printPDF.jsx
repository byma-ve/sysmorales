import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoLogis from "../../../../../Static/Img_Pred/LogoBlanco.webp";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  tableHeader: { backgroundColor: "#5DB6FB", color: "white" },
});

export const PDFDocument = ({ datosPdfActuales }) => {
  if (!datosPdfActuales || !datosPdfActuales.cotizacion_cliente) {
    return (
      <Document>
        <Page size="A4">
          <Text>No hay datos disponibles</Text>
        </Page>
      </Document>
    );
  }

  const { cotizacion_cliente, cotizacion_destinos } = datosPdfActuales;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={LogoLogis} style={{ width: 100 }} />
          <Text style={{ fontSize: 18, color: "#006699" }}>
            Transportes Mr Logistik S.A.C
          </Text>
          <Text style={{ fontSize: 10, color: "#006699" }}>
            Nuestra experiencia en logística garantiza que tus entregas sean
            eficientes y confiables.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            N° Cotización: {cotizacion_cliente.id_cotizacion || "N/A"}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Cabecera de la tabla de información del cliente */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ruc/DNI</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cliente</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Contacto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ciudad</Text>
            </View>
          </View>
          {/* Datos del cliente */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {cotizacion_cliente.dni_cliente || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {cotizacion_cliente.razon_social_cliente || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {cotizacion_cliente.contacto_cliente || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {cotizacion_cliente.DEPARTAMENTO || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabla de destinos */}
        {cotizacion_destinos && cotizacion_destinos.length > 0 ? (
          <View style={[styles.table, { marginTop: 20 }]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Item</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Destino</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Cant</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Peso</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Peso vol</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Costo envío</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Costo extra</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Valor Total</Text>
              </View>
            </View>
            {cotizacion_destinos.map((destino, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={styles.tableCell}
                  >{`${destino.DEPARTAMENTO}, ${destino.PROVINCIA}, ${destino.DESTINO}`}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {destino.cantidad_mercancia_cotizacion_destino}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseFloat(
                      destino.peso_mercancia_cotizacion_destino
                    ).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {parseFloat(
                      destino.total_peso_volumen_cotizacion_destino
                    ).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    S/.
                    {parseFloat(
                      destino.total_tarifa_cotizacion_destino
                    ).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    S/.
                    {parseFloat(
                      destino.total_adicional_cotizacion_destino
                    ).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    S/.
                    {(
                      parseFloat(destino.total_tarifa_cotizacion_destino) +
                      parseFloat(destino.total_adicional_cotizacion_destino)
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>No hay destinos disponibles</Text>
        )}

        {/* Sección de totales */}
        <View style={[styles.table, { marginTop: 20 }]}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "70%" }]}>
              <Text style={styles.tableCell}>Observaciones:</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>Importe</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {parseFloat(
                  cotizacion_cliente.sub_total_cotizacion || 0
                ).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "70%" }]}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>IGV(18%)</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {parseFloat(cotizacion_cliente.igv_cotizacion || 0).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "70%" }]}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>TOTAL</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>
                {parseFloat(
                  cotizacion_cliente.precio_total_cotizacion || 0
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const printPDF = (datosPdfActuales) => {
  return <PDFDocument datosPdfActuales={datosPdfActuales} />;
};
