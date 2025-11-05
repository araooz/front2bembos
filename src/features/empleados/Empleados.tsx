import { useEffect, useState } from "react";
import axios from "axios";
import Form from "./components/form";

interface Empleado {
  id: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  useEffect(() => {
    axios.get("https://api-gateway-url/empleado").then((res) => setEmpleados(res.data));
  }, []);

  const agregarEmpleado = async (empleado: { nombre: string; rol: string }) => {
    const res = await axios.post("https://api-gateway-url/empleado", empleado);
    setEmpleados([...empleados, res.data]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Empleados</h2>
      <Form onSubmit={agregarEmpleado} />
      <ul className="bg-white rounded shadow divide-y">
        {empleados.map((e) => (
          <li key={e.id} className="p-3 flex justify-between">
            <span>{e.nombre} ({e.rol})</span>
            <span className={e.activo ? "text-green-600" : "text-red-600"}>
              {e.activo ? "Activo" : "Inactivo"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
