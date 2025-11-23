import type { OrderStatus } from "../types/pedido.types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "CREADO":
      return "bg-blue-100 text-blue-800";
    case "EN_PREPARACION":
      return "bg-yellow-100 text-yellow-800";
    case "EN_CAMINO":
      return "bg-purple-100 text-purple-800";
    case "ENTREGADO":
      return "bg-green-100 text-green-800";
    case "CANCELADO":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
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
      return status;
  }
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
        status
      )} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}