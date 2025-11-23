import { useState } from "react";

interface FormProps {
  onSubmit: (empleado: { nombre: string; rol: string }) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const [nuevo, setNuevo] = useState({ nombre: "", rol: "cocinero" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevo.nombre.trim()) {
      onSubmit(nuevo);
      setNuevo({ nombre: "", rol: "cocinero" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-4 max-w-md"
    >
      <h2 className="text-lg font-semibold text-gray-800">Agregar Empleado</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          placeholder="Ingrese el nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Rol</label>
        <select
          value={nuevo.rol}
          onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="cocinero">Cocinero</option>
          <option value="despachador">Despachador</option>
          <option value="repartidor">Repartidor</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Agregar
      </button>
    </form>
  );
}
