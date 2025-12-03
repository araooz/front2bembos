import { useState, useEffect } from "react";
import axios from "axios";
import type { Pedido, OrderStatus } from "../../pedidos/types/pedido.types";
import type { DashboardMetrics, EstadoCount, HourlyData } from "../types/dashboard.types";

const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

interface UseDashboardReturn {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const getHourFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getHours();
};

const calculateMetrics = (pedidos: Pedido[]): DashboardMetrics => {
  // Filtrar solo pedidos de hoy
  const pedidosHoy = pedidos.filter((p) => isToday(p.createdAt));

  // Totales
  const totalPedidos = pedidosHoy.length;
  const pedidosActivos = pedidosHoy.filter(
    (p) => p.status !== "ENTREGADO" && p.status !== "CANCELADO"
  ).length;
  const pedidosCompletados = pedidosHoy.filter((p) => p.status === "ENTREGADO").length;
  const pedidosCancelados = pedidosHoy.filter((p) => p.status === "CANCELADO").length;

  // Ingresos
  const ingresosTotal = pedidosHoy.reduce((sum, p) => sum + p.total, 0);
  const ingresosCompletados = pedidosHoy
    .filter((p) => p.status === "ENTREGADO")
    .reduce((sum, p) => sum + p.total, 0);

  // Contar por estado
  const estadosCount: Record<OrderStatus, number> = {
    CREADO: 0,
    EN_PREPARACION: 0,
    EN_CAMINO: 0,
    ENTREGADO: 0,
    CANCELADO: 0,
  };

  pedidosHoy.forEach((p) => {
    estadosCount[p.status]++;
  });

  const pedidosPorEstado: EstadoCount[] = (
    Object.entries(estadosCount) as [OrderStatus, number][]
  )
    .filter(([_, cantidad]) => cantidad > 0)
    .map(([estado, cantidad]) => ({
      estado,
      cantidad,
      porcentaje: (cantidad / totalPedidos) * 100,
    }));

  // Agrupar por hora
  const hoursData: Record<number, { cantidad: number; ingresos: number }> = {};

  for (let i = 0; i < 24; i++) {
    hoursData[i] = { cantidad: 0, ingresos: 0 };
  }

  pedidosHoy.forEach((p) => {
    const hour = getHourFromDate(p.createdAt);
    hoursData[hour].cantidad++;
    hoursData[hour].ingresos += p.total;
  });

  const pedidosPorHora: HourlyData[] = Object.entries(hoursData)
    .filter(([_, data]) => data.cantidad > 0) // Solo mostrar horas con pedidos
    .map(([hour, data]) => ({
      hora: `${hour.padStart(2, "0")}:00`,
      cantidad: data.cantidad,
      ingresos: data.ingresos,
    }));

  return {
    totalPedidos,
    pedidosActivos,
    pedidosCompletados,
    pedidosCancelados,
    ingresosTotal,
    ingresosCompletados,
    pedidosPorEstado,
    pedidosPorHora,
  };
};

export function useDashboard(): UseDashboardReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los pedidos
      const response = await axios.get(
        `${ORDERS_API_URL}${TENANT_ID}`
      );

      let pedidos: Pedido[] = [];

      // El backend devuelve { "active_orders": [...] }
      if (response.data && response.data.active_orders && Array.isArray(response.data.active_orders)) {
        pedidos = response.data.active_orders;
      } else if (Array.isArray(response.data)) {
        // Por si acaso devuelve array directo
        pedidos = response.data;
      }

      // Calcular métricas
      const calculatedMetrics = calculateMetrics(pedidos);
      setMetrics(calculatedMetrics);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}