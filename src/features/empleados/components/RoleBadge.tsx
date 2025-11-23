import type { EmpleadoRole } from "../types/empleado.types";

interface RoleBadgeProps {
  role: EmpleadoRole;
  className?: string;
}

const getRoleColor = (role: EmpleadoRole): string => {
  switch (role) {
    case "manager":
      return "bg-purple-100 text-purple-800";
    case "cocinero":
      return "bg-orange-100 text-orange-800";
    case "repartidor":
      return "bg-blue-100 text-blue-800";
    case "despachador":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleLabel = (role: EmpleadoRole): string => {
  switch (role) {
    case "manager":
      return "Manager";
    case "cocinero":
      return "Cocinero";
    case "repartidor":
      return "Repartidor";
    case "despachador":
      return "Despachador";
    default:
      return role;
  }
};

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(
        role
      )} ${className}`}
    >
      {getRoleLabel(role)}
    </span>
  );
}
