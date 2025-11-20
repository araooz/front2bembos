import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DashboardData {
  etapa: string;
  cantidad: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<DashboardData[]>("https://api-gateway-url/dashboard");
        setData(res.data);
      } catch (err) {
        setError("Error al cargar los datos del dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = ["#004AAD", "#FCD34D", "#22C55E", "#EF4444", "#6366F1"];

  const total = data.reduce((sum, item) => sum + item.cantidad, 0);

  const renderLabel = (props: any) => {
    const { etapa, cantidad } = props;
    const percentage = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0;
    return `${etapa}: ${cantidad} (${percentage}%)`;
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-gray-600 text-center">No hay datos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Gráfico de Pie */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Distribución por Etapa
              </h2>
              <div className="w-full" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data as any}
                      dataKey="cantidad"
                      nameKey="etapa"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={renderLabel}
                    >
                      {data.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resumen de Estadísticas */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Resumen de Estadísticas
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800">{total}</p>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  {data.map((item, index) => (
                    <div
                      key={item.etapa}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg border"
                      style={{ borderLeftColor: colors[index % colors.length], borderLeftWidth: 4 }}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{item.etapa}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-base sm:text-lg font-bold text-gray-800">{item.cantidad}</p>
                        <p className="text-xs text-gray-500">
                          {total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
