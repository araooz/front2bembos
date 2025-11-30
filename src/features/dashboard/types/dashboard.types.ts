import type { OrderStatus } from "../../pedidos/types/pedido.types";

export interface DashboardMetrics {
  // Totales generales
  totalPedidos: number;
  pedidosActivos: number;
  pedidosCompletados: number;
  pedidosCancelados: number;
  
  // Ingresos
  ingresosTotal: number;
  ingresosCompletados: number;
  
  // Por estado
  pedidosPorEstado: EstadoCount[];
  
  // Por hora (últimas 24h)
  pedidosPorHora: HourlyData[];
}

export interface EstadoCount {
  estado: OrderStatus;
  cantidad: number;
  porcentaje: number;
}

export interface HourlyData {
  hora: string;
  cantidad: number;
  ingresos: number;
}

export const ESTADO_COLORS: Record<OrderStatus, string> = {
  CREADO: "#3B82F6",           // blue-500
  EN_PREPARACION: "#EAB308",   // yellow-500
  EN_CAMINO: "#A855F7",        // purple-500
  ENTREGADO: "#22C55E",        // green-500
  CANCELADO: "#EF4444",        // red-500
};