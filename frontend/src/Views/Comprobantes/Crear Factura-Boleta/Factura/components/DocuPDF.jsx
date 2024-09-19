import React from "react";
import {
  Document,
  Image,
  Text,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import QR from "../../../../../Static/Img_Pred/QR.png";
import Logo from "../../../../../Static/Img_Pred/Logopdf.png";
const styles = StyleSheet.create({
  page: {
    padding: "20px 20px",
    alignItems: "center",
    rowGap: "7px",
    paddingBottom: "60px", // Espacio para el pie de página
    // color: "#5D5D5A",
    color: "#40403E",
    position: "relative",
  },
  footer: {
    position: "absolute",
    bottom: "15px", // Puedes ajustar este valor según sea necesario
    left: 0,
    right: 0,
    textAlign: "right",
    fontSize: 7,
  },
  footerpage: {
    position: "absolute",
    bottom: "15px", // Puedes ajustar este valor según sea necesario
    left: 0,
    right: 30,
    textAlign: "right",
    fontSize: 7,
  },
  table: {
    width: "100%",
    fontSize: "10px",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    flexDirection: "column",
  },
  tableContainer: {
    width: "100%",
  },
});
const DocuPDF = ({ pilares, onClose }) => {
  return (
    <Document
      author="Danfer"
      title="Factura Electronica"
      subject="Asunto del PDF"
      keywords="react, pdf, ejemplo"
    >
      {/* Configurar el formato del PDF en tipo TICKET */}

      <Page size={"A4"} style={styles.page}>
        {/* HEADER  */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignContent: "center",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <View style={{ width: "20%" }}>
            <Image src={Logo}  />
          </View>
          <View
            style={{
              width: "35%",
              fontSize: "9px",
              textAlign: "left",
              lineHeight: "1.5px",
            }}
          >
            <Text
              style={{
                color: "black",
              }}
            >
              Byma-ve Innovation
            </Text>
            <Text>CAL.LAS LIMAS NRO. 421 URB. NARANJAL</Text>
            <Text>LIMA - LIMA - LOS OLIVOS</Text>
          </View>
          <View
            style={{
              width: "45%",
              borderRadius: "10px",
              border: "1px solid gray",
              paddingVertical: "10px",
              textAlign: "center",
              display: "flex",
            }}
          >
            <View>
              <Text style={{ fontSize: "12px" }}>Ruc: 206110314644</Text>
            </View>
            <View style={{ paddingVertical: "5px" }}>
              <Text
                style={{
                  backgroundColor: "#2990e6",
                  fontWeight: "ultrabold",
                  paddingVertical: "2px",
                  fontSize: "14px",
                  color: "white",
                }}
              >
                FACTURA ELECTRONICA
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "12px", fontStyle: "italic" }}>
                Nro. F001-00003803
              </Text>
            </View>
          </View>
        </View>
        {/* DATOS CLIENTES */}
        <View
          style={{
            width: "100%",
            paddingHorizontal: "10px",
            paddingVertical: "5px",
            borderRadius: "10px",
            border: "1px solid gray",
            textAlign: "left",
            lineHeight: "1.5",
            fontSize: "7px",
            rowGap: "5px",
          }}
        >
          {/* Fila */}
          <View
            style={{
              fontWeight: "ultrabold",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View style={{ width: "20%" }}>
                {" "}
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  Cliente:
                </Text>
              </View>
              <View style={{ width: "80%" }}>
                {" "}
                <Text style={{ textTransform: "uppercase" }}>
                  SCHARFF Logistica INTEGRADA S.A.
                </Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View
                style={{
                  width: "50%",
                  flexDirection: "row",
                }}
              >
                {" "}
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    Moneda:
                  </Text>
                </View>
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <Text style={{ textTransform: "uppercase" }}>SOLES</Text>
                </View>
              </View>
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "black",
                    }}
                  >
                    IGV:
                  </Text>
                </View>
                <View>
                  <Text style={{ textTransform: "uppercase" }}>18%</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Fila */}
          <View
            style={{
              fontWeight: "ultrabold",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View style={{ width: "20%" }}>
                {" "}
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  RUC:
                </Text>
              </View>
              <View style={{ width: "80%" }}>
                {" "}
                <Text style={{ textTransform: "uppercase" }}>20463958590</Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View style={{ width: "50%" }}>
                {" "}
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  Condición de Pago:
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                {" "}
                <Text style={{ textTransform: "uppercase" }}>DEPOSITO</Text>
              </View>
            </View>
          </View>
          {/* Fila */}
          <View
            style={{
              fontWeight: "ultrabold",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View style={{ width: "20%" }}>
                {" "}
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  Dirección:
                </Text>
              </View>
              <View style={{ width: "80%" }}>
                {" "}
                <Text style={{ textTransform: "uppercase" }}>
                  CAL. LOS CEDROS NRO. 143 FND. BOCANEGRA
                </Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}></View>
          </View>
          {/* Fila */}
          <View
            style={{
              fontWeight: "ultrabold",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              {" "}
              <View style={{ width: "20%" }}>
                {" "}
                <Text
                  style={{
                    color: "black",
                  }}
                >
                  Ciudad:
                </Text>
              </View>
              <View style={{ width: "80%" }}>
                {" "}
                <Text style={{ textTransform: "uppercase" }}>
                  CALLAO - CALLAO - CALLAO
                </Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "row" }}></View>
          </View>
        </View>
        {/* DATOS DE FECHAS */}
        <View
          style={{
            width: "100%",
            borderRadius: "10px",
            border: "1px solid gray",
            textAlign: "left",
            lineHeight: "1.5",
            fontSize: "7px",
            rowGap: "5px",
            flexDirection: "row",
          }}
        >
          {/* Columna */}
          <View
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: "1px solid gray",
              padding: "10px",
            }}
          >
            <View>
              {" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                Fecha de Emisión:
              </Text>
            </View>
            <View>
              {" "}
              <Text style={{}}>27-ago-2024</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: "1px solid gray",
              padding: "10px",
            }}
          >
            <View>
              {" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                Forma de Pago:
              </Text>
            </View>
            <View>
              {" "}
              <Text style={{}}>Credito</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: "1px solid gray",
              padding: "10px",
            }}
          >
            <View>
              {" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                Orden de Compra:
              </Text>
            </View>
            <View>
              {" "}
              <Text style={{}}></Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: "1px solid gray",
              padding: "10px",
            }}
          >
            <View>
              {" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                Fecha de Vencimiento:
              </Text>
            </View>
            <View>
              {" "}
              <Text style={{}}>31-ago-2024</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              textAlign: "center",

              padding: "10px",
            }}
          >
            <View>
              {" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                FN° Guía de Remisión:
              </Text>
            </View>
            <View>
              {" "}
              <Text style={{}}></Text>
            </View>
          </View>
          {/* Columna */}
        </View>
        {/* TABLA DETALLE DE FACTURA */}
        <View style={styles.tableContainer}>
          <View
            style={{
              ...styles.table,
              borderTop: "1px solid gray",
              borderRight: "1px solid gray",
              borderLeft: "1px solid gray",
              fontSize: "7px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#2990e6",
                borderBottom: "1px solid gray",
              }}
            >
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>Codigo</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>Cant.</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>Unid.</Text>
              </View>
              <View
                style={{
                  width: "40%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>Descripcion</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>V.Unit.</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  borderRight: "1px solid gray",
                  padding: "3px",
                }}
              >
                <Text>Dscto.</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "white",
                  padding: "3px",
                }}
              >
                <Text>V.Venta</Text>
              </View>
            </View>
            {pilares.map((el, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottom: "1px solid gray",
                  color: "#40403E",
                  display: "flex",
                  alignContent: "center",
                }}
                minPresenceAhead={100} // Establece un umbral mínimo para evitar que se recorte
                wrap={false}
              >
                <View
                  style={{
                    width: "10%",
                    whiteSpace: "nowrap",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{el.id}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>1</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Und</Text>
                </View>
                <View
                  style={{
                    width: "40%",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>
                    Servicio de Transporte Terrestre de carga de Lima a Barranca
                    del 19 al 24 de Agosto
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "right" }}>794.16</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRight: "1px solid gray",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "right" }}>0.00</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    padding: "3px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "right" }}>794.16</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* OBERSVACIONES Y OPERACIONES */}
        <View style={{ width: "100%", rowGap: "5px" }} wrap={false}>
          <View
            style={{
              width: "100%",
              fontSize: "7px",
              rowGap: "5px",
            }}
            wrap={false}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {/* OBSERVACIONES */}

              <View style={{ width: "65%" }}>
                <View style={{ height: "70px", rowGap: "3px" }}>
                  <View>
                    <Text style={{ fontSize: "9px", color: "black" }}>
                      OBSERVACIONES:
                    </Text>
                  </View>
                  <View>
                    <Text>
                      Abonar a la cuenta corriente del banco de credito
                      191-1998685-0-35 Moneda Soles
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: "10px",
                    border: "1px solid gray",
                  }}
                >
                  <View style={{ padding: "5px", rowGap: "3px" }}>
                    <View>
                      <Text style={{ color: "black" }}>
                        Dirección detallada del origen:
                      </Text>
                    </View>
                    <View>
                      <Text>
                        CAL. LOS CEDROS NRO. 143 FND. BOCANEGRA CALLAO - CALLAO
                        - CALLAO
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderTop: "1px solid gray",
                      borderBottom: "1px solid gray",
                      padding: "5px",
                      rowGap: "3px",
                    }}
                  >
                    <View>
                      <Text style={{ color: "black" }}>
                        Dirección detallada del destino:
                      </Text>
                    </View>
                    <View>
                      <Text>BARRANCA BARRANCA - BARRANCA - LIMA</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottom: "1px solid gray",
                      columnGap: "5px",
                    }}
                  >
                    {" "}
                    <View
                      style={{
                        borderRight: "1px solid gray",
                        width: "50%",
                        padding: "5px",
                        rowGap: "3px",
                      }}
                    >
                      <View>
                        <Text style={{ color: "black" }}>
                          Detalle del Viaje:
                        </Text>
                      </View>
                      <View>
                        <Text>LIMA, HUARAL, HUACHO, BARRANCA</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        padding: "5px",
                        rowGap: "3px",
                      }}
                    >
                      <View>
                        <Text style={{ color: "black" }}>
                          Valor Referencial del servicio de
                        </Text>
                      </View>
                      <View>
                        <Text>PEN 937.11</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: "5px",
                    }}
                  >
                    {" "}
                    <View
                      style={{
                        borderRight: "1px solid gray",
                        width: "50%",
                        padding: "5px",
                        rowGap: "3px",
                      }}
                    >
                      <View>
                        <Text style={{ color: "black" }}>
                          Valor Referencial sobre la carga efectiva:
                        </Text>
                      </View>
                      <View>
                        <Text>PEN 937.11</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        padding: "5px",
                        rowGap: "3px",
                      }}
                    >
                      <View>
                        <Text style={{ color: "black" }}>
                          Valor Referencial sobre la carga útil
                        </Text>
                      </View>
                      <View>
                        <Text>PEN 937.11</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ padding: "10px", rowGap: "2px" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: "10px",
                    }}
                  >
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>Cta. Cte. Banco de la nacion</Text>
                    </View>
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>00-031-027829</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", columnGap: "10px" }}>
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>Detraccion (4%)</Text>
                    </View>
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>S/ 37.48</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", columnGap: "10px" }}>
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>Bien o Servicio</Text>
                    </View>
                    <View style={{ color: "black", width: "50'%" }}>
                      {" "}
                      <Text>027 - Servicio de transporte de carga</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: "10px",
                    paddingHorizontal: "10px",
                  }}
                >
                  <View style={{ color: "black", width: "50'%" }}>
                    {" "}
                    <Text>Neto a Pagar</Text>
                  </View>
                  <View style={{ color: "black", width: "50'%" }}>
                    {" "}
                    <Text>S/ 899.63</Text>
                  </View>
                </View>
              </View>

              {/* OPERACIONES  */}
              <View style={{ width: "35%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    columnGap: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "45%",
                      rowGap: "3px",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>OP. GRAVADAS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>OP. INAFECTAS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>OP. EXONERADAS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>OP. EXPORTACION</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>TOTAL OP. GRATUITAS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>DSCTOS. TOTALES</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>ANTICIPOS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>SUB TOTAL</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>ICBPER</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>ISC</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>IGV</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        borderRadius: "5px",
                        border: "1px solid #bbbbbb",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>OTROS CARGOS</Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#2990e6",
                        borderRadius: "5px",
                        border: "1px solid #2990e6",
                        color: "white",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <Text>TOTAL</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "45%",
                      rowGap: "3px",
                    }}
                  >
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",
                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid #2990e6",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 794.16</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* NOTAS Y N° CUOTAS */}
          <View
            style={{
              width: "100%",
              fontSize: "7px",
              rowGap: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
            wrap={false}
          >
            {/* NOTA */}
            <View
              style={{
                width: "100%",
                fontSize: "7px",
                border: "1px solid gray",
                paddingHorizontal: "5px",
                paddingVertical: "3px",
                rowGap: "5px",
              }}
            >
              <Text>SON: NOVECIENTOS TREINTA Y SIETE Y 11/100 SOLES</Text>
              <Text>
                OPERACIÓN SUJETA AL SISTEMA DE PAGO DE OBLIGACIONES TRIBUTARIAS
                CON EL GOBIERNO CENTRAL
              </Text>
            </View>
            {/* N° CUOTAS */}

            <View
              style={{
                width: "80%",
                fontSize: "7px",

                border: "1px solid gray",

                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, textAlign: "center" }}>
                <View
                  style={{
                    backgroundColor: "#2990e6",
                    color: "white",
                    padding: "3px",
                  }}
                >
                  <Text>N° DE CUOTA</Text>
                </View>
                <View style={{ padding: "3px" }}>
                  <Text>Cuota001</Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderRight: "1px solid gray",
                  borderLeft: "1px solid gray",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#2990e6",
                    color: "white",
                    padding: "3px",
                  }}
                >
                  <Text>IMPORTE</Text>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    padding: "3px",
                  }}
                >
                  <Text>S/ 899.63</Text>
                </View>
              </View>
              <View style={{ flex: 1, textAlign: "center" }}>
                <View
                  style={{
                    backgroundColor: "#2990e6",
                    color: "white",
                    padding: "3px",
                  }}
                >
                  <Text>FECHA DE PAGO</Text>
                </View>
                <View style={{ padding: "3px" }}>
                  <Text>31-ago-2024</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Pie de página con la paginación */}
        <View style={{ ...styles.footer }}>
          <View
            style={{
              width: "100%",
              fontSize: "7px",
              flexDirection: "row",
              columnGap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image src={QR} style={{ width: "70%" }} />
            </View>
            <View
              style={{
                flex: 2,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                rowGap: "25px",
              }}
            >
              <View style={{ width: "50%", rowGap: "3px" }}>
                <Text>Operador de Servicios Electrónicos</Text>
                <Text>según Resolución N° 034-005-0008776 </Text>
              </View>
              <View style={{ rowGap: "3px" }}>
                <Text>
                  Representación impresa de la factura electrónica, consulte en
                  www.efact.pe
                </Text>
                <Text>
                  Autorizado mediante la Resolución de intendencia N°
                  0340050004177/SUNAT
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              <Image
                src={Logo}
                style={{
                  width: "50%",
                  justifyContent: "center",
                }}
              ></Image>
            </View>
          </View>
        </View>

        {/* </Paginacion> */}
        <Text
          style={styles.footerpage}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
    //
  );
};
export default DocuPDF;
