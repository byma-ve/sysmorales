import React, { useContext } from "react";
import {
  Document,
  Image,
  Text,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import QR from "../../../../Static/Img_Pred/QR.png";
import Logo from "../../../../Static/Img_Pred/Logopdf.png";

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
const DocuPDFFactura = ({ pilares, onClose, color }) => {
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
          <View style={{ width: "23%" }}>
            <Image src={Logo} />
          </View>
          <View
            style={{
              width: "46%",
              fontSize: "9px",
              textAlign: "left",
              lineHeight: "1.5px",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: "8px",
              }}
            >
              Byma-ve Innovation
            </Text>
            <Text>
              AV. AV. GERARDO UNGER PRIMERA UNIDAD - PRIMER PISO NRO. 6226 URB.
              SANTA LUZMILA (AV. METROPOLITANA-NO 6226 LOTE 21) LIMA - LIMA -
              COMAS
            </Text>
          </View>
          <View
            style={{
              width: "31%",
              borderRadius: "10px",
              border: "1px solid gray",
              paddingVertical: "10px",
              textAlign: "center",
              display: "flex",
            }}
          >
            <View>
              <Text style={{ fontSize: "11px" }}>Ruc: 206110314644</Text>
            </View>
            <View style={{ paddingVertical: "5px" }}>
              <Text
                style={{
                  backgroundColor: color,
                  fontWeight: "ultrabold",
                  paddingVertical: "2px",
                  fontSize: "12px",
                  color: "white",
                }}
              >
                FACTURA ELECTRONICA
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "11px", fontStyle: "italic" }}>
                Nro. F001-00003803
              </Text>
            </View>
          </View>
        </View>
        {/* DATOS DE CLIENTE Y FECHAS */}
        <View style={{ width: "100%", rowGap: "5px" }} wrap={false}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              rowGap: "5px",
              columnGap: "10px",
            }}
          >
            {/* DATOS CLIENTES */}

            <View
              style={{
                width: "70%",
                paddingHorizontal: "10px",
                paddingVertical: "5px",
                // borderRadius: "10px",
                // border: "1px solid gray",
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
                  <View style={{ width: "25%" }}>
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Cliente:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    {" "}
                    <Text style={{ textTransform: "uppercase" }}>
                      SCHARFF Logistica INTEGRADA S.A.
                    </Text>
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
                  <View style={{ width: "25%" }}>
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      RUC:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    {" "}
                    <Text style={{ textTransform: "uppercase" }}>
                      20463958590
                    </Text>
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
                  <View style={{ width: "25%" }}>
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Dirección:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    {" "}
                    <Text style={{ textTransform: "uppercase" }}>
                      AV. AV. GERARDO UNGER PRIMERA UNIDAD - PRIMER PISO NRO.
                      6226 URB. SANTA LUZMILA (AV. METROPOLITANA-NO 6226 LOTE
                      21) LIMA - LIMA - COMAS
                    </Text>
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
                  <View style={{ width: "25%" }}>
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Ciudad:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    {" "}
                    <Text style={{ textTransform: "uppercase" }}>
                      CALLAO - CALLAO - CALLAO
                    </Text>
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
                  <View
                    style={{
                      width: "25%",
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
                      width: "75%",
                    }}
                  >
                    <Text style={{ textTransform: "uppercase" }}>SOLES</Text>
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
                  <View
                    style={{
                      width: "25%",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      IGV:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    <Text style={{ textTransform: "uppercase" }}>18%</Text>
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
                  <View style={{ width: "25%" }}>
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Condición de Pago:
                    </Text>
                  </View>
                  <View style={{ width: "75%" }}>
                    {" "}
                    <Text style={{ textTransform: "uppercase" }}>DEPOSITO</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* DATOS DE FECHAS */}
            <View
              style={{
                width: "30%",
                // paddingHorizontal: "10px",
                // paddingVertical: "5px",
                // borderRadius: "10px",
                // border: "1px solid gray",
                textAlign: "left",
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Fecha de Emisión:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}>27-ago-2024</Text>
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Forma de Pago:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}>Credito</Text>
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Orden de Compra:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}></Text>
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      Fecha de Vencimiento:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}>31-ago-2024</Text>
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
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      FN° Guía de Remisión:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}></Text>
                  </View>
                </View>
              </View>{" "}
              {/* Fila */}
              <View
                style={{
                  fontWeight: "ultrabold",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderRight: "1px solid gray",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      N° Orden de Servicio:
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: "2px",
                      alignContent: "center",
                      padding: "3px",
                    }}
                  >
                    {" "}
                    <Text style={{}}></Text>
                  </View>
                </View>
              </View>{" "}
            </View>
          </View>{" "}
        </View>{" "}
        {/* TABLA DETALLE DE FACTURA */}
        <View style={styles.tableContainer}>
          <View
            style={{
              ...styles.table,
              borderTop: "1px solid gray",
              borderRight: "1px solid gray",
              borderLeft: "1px solid gray",
              borderRadius: "5px",
              fontSize: "7px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: color,
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
                <Text>V. Unit.</Text>
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
                <Text>V. Venta</Text>
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

              <View style={{ width: "65%", justifyContent: "space-between" }}>
                <View>
                  <View style={{ paddingHorizontal: "10px", rowGap: "3px" }}>
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
                    <Image src={QR} style={{ width: "20%" }} />
                  </View>

                  <View style={{ paddingHorizontal: "10px", rowGap: "2px" }}>
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
                    <View style={{ flexDirection: "row", columnGap: "10px" }}>
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
                </View>
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
                      borderRadius: "5px",
                      paddingHorizontal: "5px",
                      paddingVertical: "3px",
                      rowGap: "5px",
                      marginTop: "19px",
                    }}
                  >
                    <Text>SON: NOVECIENTOS TREINTA Y SIETE Y 11/100 SOLES</Text>
                    <Text>
                      OPERACIÓN SUJETA AL SISTEMA DE PAGO DE OBLIGACIONES
                      TRIBUTARIAS CON EL GOBIERNO CENTRAL
                    </Text>
                  </View>
                  {/* N° CUOTAS */}

                  <View
                    style={{
                      width: "100%",
                      fontSize: "7px",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: 1, textAlign: "center" }}>
                      <View
                        style={{
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                          backgroundColor: color,
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
                        backgroundColor: color,
                        borderRadius: "5px",
                        border: `1px solid ${color}`,
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
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
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
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 142.95</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: "1px solid gray",

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 0.00</Text>
                    </View>
                    <View
                      style={{
                        borderRadius: "5px",
                        border: `1px solid ${color}`,

                        alignItems: "flex-end",
                        padding: "2px",
                      }}
                    >
                      <Text>S/ 937.11</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* NOTAS Y N° CUOTAS */}
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
export default DocuPDFFactura;
