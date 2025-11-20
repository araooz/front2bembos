import { useEffect, useState } from "react";
import axios from "axios";

interface DeliveryAddress {
  street?: string | null;     //body
  city?: string | null;       //body
  district?: string | null;   //body
  reference?: string | null;  //body
  lat?: number | null;        //body
  lng?: number | null;        //body
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price?: number;
  [key: string]: any;
}

interface Pedido {
  tenant_id: string;
  order_id: string;
  customer_id: string;  //body
  items: OrderItem[];   //body   
  total: number;        //body
  status: string; // e.g. "CREADO"
  delivery_address?: DeliveryAddress | null;  //body
  estimated_time?: string | number | null;    
  staff_id?: string | null; 
  isActive: boolean; //por default true
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Definir el flujo de etapas del pedido
const ETAPAS = ["recibido", "cocinando", "listo", "entregado"];

const getSiguienteEtapa = (etapaActual: string): string | null => {
  const index = ETAPAS.indexOf(etapaActual.toLowerCase());
  if (index === -1 || index === ETAPAS.length - 1) {
    return null; // No hay siguiente etapa
  }
  return ETAPAS[index + 1];
};

const getColorEtapa = (etapa: string): string => {
  const etapaLower = etapa.toLowerCase();
  switch (etapaLower) {
    case "recibido":
      return "bg-blue-100 text-blue-800";
    case "cocinando":
      return "bg-yellow-100 text-yellow-800";
    case "listo":
      return "bg-green-100 text-green-800";
    case "entregado":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cambiandoId, setCambiandoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<Pedido[]>("https://api-gateway-url/pedidos/pendientes");
        setPedidos(res.data);
      } catch (err) {
        setError("Error al cargar los pedidos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const cambiarEtapa = async (id: string, etapaActual: string) => {
    const siguienteEtapa = getSiguienteEtapa(etapaActual);
    if (!siguienteEtapa) {
      return; // Ya está en la última etapa
    }

    try {
      setCambiandoId(id);
      await axios.patch(`https://api-gateway-url/pedidos/${id}/etapa`, { etapa: siguienteEtapa });
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, etapa: siguienteEtapa } : p))
      );
    } catch (err) {
      setError("Error al cambiar la etapa del pedido");
      console.error(err);
    } finally {
      setCambiandoId(null);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">
          Pedidos Activos
        </h1>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-gray-600 text-center">No hay pedidos activos</p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Etapa
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pedidos.map((p) => {
                      const siguienteEtapa = getSiguienteEtapa(p.etapa);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {p.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {p.cliente}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {p.estado}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getColorEtapa(
                                p.etapa
                              )}`}
                            >
                              {p.etapa}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {siguienteEtapa ? (
                              <button
                                onClick={() => cambiarEtapa(p.id, p.etapa)}
                                disabled={cambiandoId === p.id}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                  cambiandoId === p.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } text-white transition-colors`}
                              >
                                {cambiandoId === p.id ? "Cambiando..." : `→ ${siguienteEtapa}`}
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">Completado</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista de cards para pantallas pequeñas */}
            <div className="md:hidden space-y-4">
              {pedidos.map((p) => {
                const siguienteEtapa = getSiguienteEtapa(p.etapa);
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID</p>
                        <p className="text-base font-semibold text-gray-900">{p.id}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getColorEtapa(
                          p.etapa
                        )}`}
                      >
                        {p.etapa}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-500">Cliente</p>
                      <p className="text-base text-gray-900">{p.cliente}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="text-base text-gray-900">{p.estado}</p>
                    </div>
                    {siguienteEtapa && (
                      <button
                        onClick={() => cambiarEtapa(p.id, p.etapa)}
                        disabled={cambiandoId === p.id}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                          cambiandoId === p.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white transition-colors`}
                      >
                        {cambiandoId === p.id ? "Cambiando..." : `Avanzar a: ${siguienteEtapa}`}
                      </button>
                    )}
                    {!siguienteEtapa && (
                      <div className="text-center text-gray-400 text-sm py-2">
                        Pedido completado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
