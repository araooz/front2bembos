import { User, Mail, Calendar, CircleCheck, CircleX } from "lucide-react";
import type { Empleado } from "../types/empleado.types";
import RoleBadge from "./RoleBadge";

interface EmpleadoCardProps {
  empleado: Empleado;
  onClick: () => void;
}

export default function EmpleadoCard({ empleado, onClick }: EmpleadoCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 p-4 ${
        empleado.isActive ? "border-blue-800" : "border-gray-400"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <User size={20} className={empleado.isActive ? "text-blue-800" : "text-gray-400"} />
          <div>
            <p className="text-lg font-bold text-gray-900">{empleado.name}</p>
          </div>
        </div>
        <RoleBadge role={empleado.role} />
      </div>

      {/* Email (staff_id) */}
      <div className="flex items-center space-x-2 text-gray-700 mb-3">
        <Mail size={16} className="text-gray-400" />
        <p className="text-sm truncate">{empleado.staff_id}</p>
      </div>

      {/* Status y Fecha */}
      <div className="flex justify-between items-center pt-3 border-t">
        <div className="flex items-center space-x-2">
          {empleado.isActive ? (
            <>
              <CircleCheck size={16} className="text-green-500" />
              <span className="text-xs font-medium text-green-600">Activo</span>
            </>
          ) : (
            <>
              <CircleX size={16} className="text-red-500" />
              <span className="text-xs font-medium text-red-600">Inactivo</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1 text-gray-500 text-xs">
          <Calendar size={12} />
          <span>{formatDate(empleado.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
