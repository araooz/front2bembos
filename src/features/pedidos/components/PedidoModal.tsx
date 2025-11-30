import { X, AlertCircle, ArrowRight, Ban } from "lucide-react";
import type { Pedido, OrderStatus} from "../types/pedido.types";
import {ORDER_STATUS_FLOW } from "../types/pedido.types";
import StatusBadge from "./StatusBadge";

interface PedidoModalProps {
  pedido: Pedido;
  onClose: () => void;
  onUpdateStatus: (newStatus: OrderStatus) => Promise<void>;
  onCancel: () => Promise<void>;
  isUpdating: boolean;
}

export default function PedidoModal({
  pedido,
  onClose,
  onUpdateStatus,
  onCancel,
  isUpdating,
}: PedidoModalProps) {
  const getNextStatus = (): OrderStatus | null => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(pedido.status);
    if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
      return null;
    }
    return ORDER_STATUS_FLOW[currentIndex + 1];
  };

  const canCancel = pedido.status !== "ENTREGADO" && pedido.status !== "CANCELADO";
  const nextStatus = getNextStatus();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (): string => {
    if (!pedido.delivery_address) return "Sin dirección especificada";
    
    const { street, district, city, reference } = pedido.delivery_address;
    const parts = [street, district, city].filter(Boolean);
    const address = parts.length > 0 ? parts.join(", ") : "Sin dirección";
    
    return reference ? `${address} (Ref: ${reference})` : address;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Pedido #{pedido.order_id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Creado: {formatDate(pedido.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUpdating}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado Actual</h3>
            <div className="flex items-center justify-between">
              <StatusBadge status={pedido.status} className="text-base px-4 py-2" />
              {pedido.status === "CANCELADO" && (
                <span className="text-sm text-red-600 font-medium">
                  Este pedido ha sido cancelado
                </span>
              )}
              {pedido.status === "ENTREGADO" && (
                <span className="text-sm text-green-600 font-medium">
                  Este pedido ha sido entregado
                </span>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Cliente</h3>
            <p className="text-gray-900">ID: {pedido.customer_id}</p>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Productos</h3>
            <div className="space-y-2">
              {pedido.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Producto #{item.product_id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  {item.price && (
                    <p className="font-semibold text-gray-900">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-800">
                S/ {pedido.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Dirección de Entrega
            </h3>
            <p className="text-gray-900">{formatAddress()}</p>
            {pedido.delivery_address?.lat && pedido.delivery_address?.lng && (
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {pedido.delivery_address.lat}, {pedido.delivery_address.lng}
              </p>
            )}
          </div>

          {/* Estimated Time */}
          {pedido.estimated_time && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Tiempo Estimado
              </h3>
              <p className="text-gray-900">{pedido.estimated_time}</p>
            </div>
          )}

          {/* Warning for completed/cancelled orders */}
          {(pedido.status === "ENTREGADO" || pedido.status === "CANCELADO") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                {pedido.status === "ENTREGADO"
                  ? "Este pedido ya fue entregado y no puede ser modificado."
                  : "Este pedido fue cancelado y no puede ser modificado."}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {(nextStatus || canCancel) && (
          <div className="p-6 border-t bg-gray-50 space-y-3">
            {nextStatus && (
              <button
                onClick={() => onUpdateStatus(nextStatus)}
                disabled={isUpdating}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900 text-white"
                }`}
              >
                {isUpdating ? (
                  <span>Actualizando...</span>
                ) : (
                  <>
                    <span>Avanzar a: {nextStatus.replace("_", " ")}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            )}

            {canCancel && (
              <button
                onClick={onCancel}
                disabled={isUpdating}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isUpdating ? (
                  <span>Cancelando...</span>
                ) : (
                  <>
                    <Ban size={20} />
                    <span>Cancelar Pedido</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}