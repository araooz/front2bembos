import { useState, useEffect } from "react";
import axios from "axios";
import type { Pedido, OrderStatus } from "../types/pedido.types";

const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

interface UsePedidosReturn {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

export function usePedidos(): UsePedidosReturn {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${ORDERS_API_URL}${TENANT_ID}`
      );
      
      // El backend devuelve { "active_orders": [...] }
      const pedidosData = response.data.active_orders || [];
      
      // Filtrar solo pedidos activos (no ENTREGADO ni CANCELADO)
      const activePedidos = pedidosData.filter(
        (pedido: Pedido) => pedido.status !== "ENTREGADO" && pedido.status !== "CANCELADO"
      );
      
      setPedidos(activePedidos);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setError(null);
      
      await axios.put(
        `${ORDERS_API_URL}${TENANT_ID}/${orderId}/updateStatus`,
        { status: newStatus }
      );
      
      // Actualizar el estado local
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.order_id === orderId
            ? { ...pedido, status: newStatus, updatedAt: new Date().toISOString() }
            : pedido
        ).filter((pedido) => pedido.status !== "ENTREGADO" && pedido.status !== "CANCELADO")
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error al actualizar el estado del pedido");
      throw err;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      setError(null);
      
      await axios.post(
        `${ORDERS_API_URL}${TENANT_ID}/${orderId}/cancel`
      );
      
      // Remover el pedido de la lista (ya que está cancelado)
      setPedidos((prev) => prev.filter((pedido) => pedido.order_id !== orderId));
    } catch (err) {
      console.error("Error canceling order:", err);
      setError("Error al cancelar el pedido");
      throw err;
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return {
    pedidos,
    loading,
    error,
    refetch: fetchPedidos,
    updateStatus,
    cancelOrder,
  };
}