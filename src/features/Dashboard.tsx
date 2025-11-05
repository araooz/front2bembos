import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState<{ etapa: string; cantidad: number }[]>([]);

  useEffect(() => {
    axios.get<{ etapa: string; cantidad: number }[]>("https://api-gateway-url/dashboard").then((res) => setData(res.data));
  }, []);

  const colors = ["#004AAD", "#FCD34D", "#22C55E", "#EF4444", "#6366F1"];

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex flex-col items-center">Dashboard</h1>
      <div className="bg-white rounded shadow p-6 min-h-screen min-w-screen">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="cantidad"
              nameKey="etapa"
              label
              outerRadius="80%"
              cx="50%"
              cy="50%"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
