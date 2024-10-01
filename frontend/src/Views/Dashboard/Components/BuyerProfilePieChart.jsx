import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#3B82F6", "#EF4444", "#22C55E"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent === 0) {
    return null; // Si el porcentaje es 0%, no mostrar el texto
  }
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function BuyerProfilePieChart({ idArea, idCliente, idYear }) {
  const [porcentajes, setPorcentajes] = useState([]);

  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/porcentajeEstados.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setPorcentajes(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = [
      {
        name: "Despachos",
        value: parseInt(porcentajes.porcentaje_despachos) || 0,
      },
      {
        name: "Motivados",
        value: parseInt(porcentajes.porcentaje_motivados) || 0,
      },
      {
        name: "Entregados",
        value: parseInt(porcentajes.porcentaje_entregados) || 0,
      },
    ];
    setData(newData);
  }, [porcentajes]);

  return (
    <div className="w-[20rem] h-[18rem] bg-white p-2 rounded-xl border border-gray-200 flex flex-col">
      <strong className="text-gray-700 font-medium">
        Porcentaje de Estados
      </strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={105}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
