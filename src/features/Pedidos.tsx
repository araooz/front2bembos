import { useEffect, useState } from "react";
import axios from "axios";

interface Pedido {
  id: string;
  cliente: string;
  estado: string;
  etapa: string;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    axios.get<Pedido[]>("https://api-gateway-url/pedidos/pendientes").then((res) => setPedidos(res.data));
  }, []);

  const cambiarEtapa = (id: string, etapa: string) => {
    axios.patch(`https://api-gateway-url/pedidos/${id}/etapa`, { etapa }).then(() =>
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, etapa } : p))
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Pedidos Activos</h2>
      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Etapa</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id} className="border-b">
              <td>{p.id}</td>
              <td>{p.cliente}</td>
              <td>{p.etapa}</td>
              <td>
                <button
                  onClick={() => cambiarEtapa(p.id, "cocinando")}
                  className="px-3 py-1 bg-bembos text-white rounded"
                >
                  Siguiente etapa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
