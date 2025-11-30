import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HourlyData } from "../types/dashboard.types";

interface IngresosChartProps {
  data: HourlyData[];
}

export default function IngresosChart({ data }: IngresosChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold text-gray-900">{payload[0].payload.hora}</p>
          <p className="text-sm text-blue-800">
            Pedidos: {payload[0].value}
          </p>
          <p className="text-sm text-green-600">
            Ingresos: S/ {payload[1].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="cantidad"
            fill="#3B82F6"
            name="Pedidos"
          />
          <Bar
            yAxisId="right"
            dataKey="ingresos"
            fill="#22C55E"
            name="Ingresos (S/)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
