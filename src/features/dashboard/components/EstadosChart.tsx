// features/dashboard/components/EstadosChart.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { EstadoCount } from "../types/dashboard.types";
import { ESTADO_COLORS } from "../types/dashboard.types";

interface EstadosChartProps {
  data: EstadoCount[];
}

const getEstadoLabel = (estado: string): string => {
  switch (estado) {
    case "CREADO":
      return "Creado";
    case "EN_PREPARACION":
      return "En Preparación";
    case "EN_CAMINO":
      return "En Camino";
    case "ENTREGADO":
      return "Entregado";
    case "CANCELADO":
      return "Cancelado";
    default:
      return estado;
  }
};

export default function EstadosChart({ data }: EstadosChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: getEstadoLabel(item.estado),
    value: item.cantidad,
    porcentaje: item.porcentaje,
    estado: item.estado,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Cantidad: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600">
            Porcentaje: {payload[0].payload.porcentaje.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, porcentaje } = props;
              return `${name}: ${porcentaje.toFixed(1)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ESTADO_COLORS[data[index].estado]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}