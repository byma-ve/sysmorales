import React, { useState, useEffect } from "react";
import Home from "../../Layout/Home";
import TransactionChart from "./Components/TransactionChart";
import DashboardStatsGrid from "./Components/DashboardStatsGrid";
import BuyerProfilePieChart from "./Components/BuyerProfilePieChart";
import ListTop from "./Components/ListTop";
import SearchDashboard from "./Components/SearchDashboard";
import SearchDate from "./Components/SearchDate";
import PopularProducts from "./Components/PopularProducts";
import SearchArea from "./Components/SearchArea";

function DashBoard() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
    )
      .then((response) => response.json())
      .then((data) => setClientes(data));
  }, []);

  const [idCliente, setIdCliente] = useState("");
  const handleSelectCliente = (selectedCliente) => {
    if (selectedCliente) {
      setIdCliente(selectedCliente.id);
      setAreas([]);
      setIdArea("");
    } else {
      setIdCliente("");
      setAreas([]);
      setIdArea("");
    }
  };

  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (idCliente) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/obtenerAreasTarifario.php?id_cliente=${idCliente}`
      )
        .then((response) => response.json())
        .then((data) => setAreas(data));
    }
  }, [idCliente]);

  const [idArea, setIdArea] = useState("");
  const handleSelectArea = (selectedArea) => {
    if (selectedArea) {
      setIdArea(selectedArea.id);
    }
  };

  const [years, setYears] = useState([]);

  useEffect(() => {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Dashboard/selectYear.php?id_cliente=${idCliente}&id_area=${idArea}`
    )
      .then((response) => response.json())
      .then((data) => setYears(data));
  }, [idCliente, idArea]);

  const [idYear, setIdYear] = useState("");
  const handleSelectYear = (selectedYear) => {
    if (selectedYear) {
      setIdYear(selectedYear.nombre_year);
    } else {
      setIdYear("");
    }
  };

  const [isImageShown, setIsImageShown] = useState(false);
  useEffect(() => {
    if (!isImageShown) {
      setIsImageShown(true);
    }
  }, [isImageShown]);
  return (
    <>
      <Home
        children1={<></>}
        children2={
          <>
            <div className="flex gap-4 mb-4 items-center">
              <div className="flex">
                {" "}
                <SearchDashboard
                  clientes={clientes}
                  handleSelectCliente={handleSelectCliente}
                />
              </div>
              <div className="flex ">
                <SearchArea
                  areas={areas}
                  idCliente={idCliente}
                  handleSelectArea={handleSelectArea}
                />
              </div>
              <div className="flex ">
                <SearchDate years={years} handleSelectYear={handleSelectYear} />
              </div>
            </div>
            <div>
              <DashboardStatsGrid
                idArea={idArea}
                idCliente={idCliente}
                idYear={idYear}
              />
            </div>
            <div className="flex gap-4">
              <TransactionChart
                idArea={idArea}
                idCliente={idCliente}
                idYear={idYear}
              />
              <BuyerProfilePieChart
                idArea={idArea}
                idCliente={idCliente}
                idYear={idYear}
              />
            </div>
            <div className="flex gap-4 mt-4 max-h-[325px] ">
              <ListTop idArea={idArea} idCliente={idCliente} idYear={idYear} />
              <PopularProducts />
            </div>
          </>
        }
      />
    </>
  );
}

export default DashBoard;
