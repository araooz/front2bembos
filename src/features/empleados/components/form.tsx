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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Nombre"
        value={nuevo.nombre}
        onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
        className="border p-2 rounded"
        required
      />
      <select
        value={nuevo.rol}
        onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="cocinero">Cocinero</option>
        <option value="despachador">Despachador</option>
        <option value="repartidor">Repartidor</option>
      </select>
      <button type="submit" className="bg-bembos text-white px-4 rounded">
        Agregar
      </button>
    </form>
  );
}

