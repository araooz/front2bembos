export type EmpleadoRole = "manager" | "repartidor" | "cocinero" | "despachador";

export type FiltroEstado = "activos" | "inactivos" | "ambos";

export interface Empleado {
  tenant_id: string;
  staff_id: string; // Este es el email
  name: string;
  role: EmpleadoRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmpleadoFormData {
  email: string; // Se convertirá en staff_id
  name: string;
  role: EmpleadoRole;
  password?: string;
}

export const ROLES: EmpleadoRole[] = ["manager", "repartidor", "cocinero", "despachador"];

export const FILTROS: FiltroEstado[] = ["activos", "inactivos", "ambos"];

// Validación de email con regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
