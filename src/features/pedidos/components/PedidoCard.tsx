import { Package, MapPin, DollarSign, Calendar } from "lucide-react";
import type { Pedido } from "../types/pedido.types";
import StatusBadge from "./StatusBadge";

interface PedidoCardProps {
  pedido: Pedido;
  onClick: () => void;
}

export default function PedidoCard({ pedido, onClick }: PedidoCardProps) {
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
    if (!pedido.delivery_address) return "Sin dirección";

    const { street, district, city } = pedido.delivery_address;
    const parts = [street, district, city].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Sin dirección";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-800 p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">PEDIDO</p>
          <p className="text-lg font-bold text-gray-900">
            #{pedido.order_id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      {/* Items */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 text-gray-700 mb-1">
          <Package size={16} className="text-gray-400" />
          <p className="text-sm font-medium">Items:</p>
        </div>
        <div className="ml-6 space-y-1">
          {pedido.items.map((item, index) => (
            <p key={index} className="text-sm text-gray-600">
              {item.quantity}x Producto #{item.product_id?.slice(0, 6) || 'N/A'}
            </p>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center space-x-2 text-gray-700 mb-3">
        <DollarSign size={16} className="text-gray-400" />
        <p className="text-sm">
          <span className="font-medium">Total:</span>{" "}
          <span className="font-bold text-blue-800">S/ {pedido.total.toFixed(2)}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start space-x-2 text-gray-700 mb-3">
        <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-0.5">Dirección:</p>
          <p className="text-sm text-gray-600 truncate">{formatAddress()}</p>
          {pedido.delivery_address?.reference && (
            <p className="text-xs text-gray-500 mt-0.5">
              Ref: {pedido.delivery_address.reference}
            </p>
          )}
        </div>
      </div>

      {/* Created At */}
      <div className="flex items-center space-x-2 text-gray-500 text-xs pt-2 border-t">
        <Calendar size={14} />
        <span>{formatDate(pedido.createdAt)}</span>
      </div>
    </div>
  );
}