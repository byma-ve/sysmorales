import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function TransactionChart({ idCliente, idArea, idYear }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/frecuenciaDepartamentos.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  return (
    <div className="h-[18rem]  bg-white p-3 rounded-xl border border-gray-200 flex   flex-col flex-1">
      <div className="flex justify-between">
        <strong className="text-gray-700 font-medium items-center ">
          Frecuencia Por Departamentos{" "}
        </strong>
        <div className="inline-flex "></div>
      </div>
      <div className="mt-3 w-full flex-1 text-xs z-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 0,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Income" fill="#0ea5e9" />
            {/* <Bar dataKey="Expense" fill="#ea580c" />
            <Bar dataKey="Expense" fill="#ea580c" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
