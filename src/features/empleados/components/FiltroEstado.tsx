import type { FiltroEstado as FiltroEstadoType } from "../types/empleado.types";
import { FILTROS } from "../types/empleado.types";

interface FiltroEstadoProps {
  filtroActual: FiltroEstadoType;
  onChange: (filtro: FiltroEstadoType) => void;
}

const getFiltroLabel = (filtro: FiltroEstadoType): string => {
  switch (filtro) {
    case "activos":
      return "Activos";
    case "inactivos":
      return "Inactivos";
    case "ambos":
      return "Todos";
    default:
      return filtro;
  }
};

export default function FiltroEstado({ filtroActual, onChange }: FiltroEstadoProps) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow px-2 py-1">
      <span className="text-sm font-medium text-gray-600 px-2">Mostrar:</span>
      {FILTROS.map((filtro) => (
        <button
          key={filtro}
          onClick={() => onChange(filtro)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filtroActual === filtro
              ? "bg-blue-800 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {getFiltroLabel(filtro)}
        </button>
      ))}
    </div>
  );
}
