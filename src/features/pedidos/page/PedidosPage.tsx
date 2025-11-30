// features/pedidos/page/PedidosPage.tsx

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types/pedido.types";
import PedidoCard from "../components/PedidoCard";
import PedidoModal  from "../components/PedidoModal";

export default function PedidosPage() {
  const { pedidos, loading, error, refetch, updateStatus, cancelOrder } = usePedidos();
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: any) => {
    if (!selectedPedido) return;

    try {
      setIsUpdating(true);
      await updateStatus(selectedPedido.order_id, newStatus);
      setSelectedPedido(null);
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedPedido) return;

    if (!confirm("¿Está seguro de que desea cancelar este pedido?")) {
      return;
    }

    try {
      setIsUpdating(true);
      await cancelOrder(selectedPedido.order_id);
      setSelectedPedido(null);
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            Pedidos Activos
          </h1>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw size={40} className="animate-spin text-blue-800 mx-auto mb-4" />
              <p className="text-gray-600">Cargando pedidos...</p>
            </div>
          </div>
        ) : pedidos.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay pedidos activos
              </h3>
              <p className="text-gray-500">
                Los pedidos aparecerán aquí cuando los clientes realicen órdenes
              </p>
            </div>
          </div>
        ) : (
          /* Pedidos Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.order_id}
                pedido={pedido}
                onClick={() => setSelectedPedido(pedido)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPedido && (
        <PedidoModal
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onUpdateStatus={handleUpdateStatus}
          onCancel={handleCancelOrder}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
