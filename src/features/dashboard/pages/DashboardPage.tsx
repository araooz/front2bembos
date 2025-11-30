import { RefreshCw, ShoppingBag, CheckCircle, XCircle, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import MetricCard from "../components/MetricCard";
import EstadosChart from "../components/EstadosChart";
import IngresosChart from "../components/IngresosChart";

export default function DashboardPage() {
  const { metrics, loading, error, refetch } = useDashboard();

  const handleRefresh = async () => {
    await refetch();
  };

  const formatCurrency = (amount: number): string => {
    return `S/ ${amount.toFixed(2)}`;
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Métricas del día - {new Date().toLocaleDateString("es-PE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw size={40} className="animate-spin text-blue-800 mx-auto mb-4" />
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total de Pedidos"
                value={metrics.totalPedidos}
                icon={ShoppingBag}
                iconColor="text-blue-800"
                iconBgColor="bg-blue-100"
                subtitle="Pedidos de hoy"
              />
              
              <MetricCard
                title="Pedidos Activos"
                value={metrics.pedidosActivos}
                icon={Clock}
                iconColor="text-yellow-600"
                iconBgColor="bg-yellow-100"
                subtitle="En proceso"
              />

              <MetricCard
                title="Pedidos Completados"
                value={metrics.pedidosCompletados}
                icon={CheckCircle}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
                subtitle="Entregados hoy"
              />

              <MetricCard
                title="Pedidos Cancelados"
                value={metrics.pedidosCancelados}
                icon={XCircle}
                iconColor="text-red-600"
                iconBgColor="bg-red-100"
                subtitle="Cancelados hoy"
              />
            </div>

            {/* Ingresos Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                title="Ingresos Totales"
                value={formatCurrency(metrics.ingresosTotal)}
                icon={DollarSign}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
                subtitle="Todos los pedidos de hoy"
              />

              <MetricCard
                title="Ingresos Completados"
                value={formatCurrency(metrics.ingresosCompletados)}
                icon={TrendingUp}
                iconColor="text-emerald-600"
                iconBgColor="bg-emerald-100"
                subtitle="Solo pedidos entregados"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estados Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Distribución por Estado
                </h2>
                <EstadosChart data={metrics.pedidosPorEstado} />
              </div>

              {/* Ingresos por Hora Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Pedidos e Ingresos por Hora
                </h2>
                <IngresosChart data={metrics.pedidosPorHora} />
              </div>
            </div>

            {/* Summary Stats */}
            {metrics.totalPedidos > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumen del Día
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Ticket Promedio</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(metrics.ingresosTotal / metrics.totalPedidos)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tasa de Éxito</p>
                    <p className="text-xl font-bold text-green-600">
                      {((metrics.pedidosCompletados / metrics.totalPedidos) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tasa de Cancelación</p>
                    <p className="text-xl font-bold text-red-600">
                      {((metrics.pedidosCancelados / metrics.totalPedidos) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">En Proceso</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {((metrics.pedidosActivos / metrics.totalPedidos) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-500">
                No se encontraron pedidos para el día de hoy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}