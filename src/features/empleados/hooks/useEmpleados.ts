import { useState, useEffect } from "react";
import axios from "axios";
import type { Empleado, EmpleadoFormData, FiltroEstado } from "../types/empleado.types";

const API_BASE_URL = import.meta.env.VITE_STAFF_API_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

interface UseEmpleadosReturn {
  empleados: Empleado[];
  empleadosFiltrados: Empleado[];
  loading: boolean;
  error: string | null;
  filtro: FiltroEstado;
  setFiltro: (filtro: FiltroEstado) => void;
  refetch: () => Promise<void>;
  createEmpleado: (data: EmpleadoFormData) => Promise<void>;
  updateEmpleado: (staffId: string, data: EmpleadoFormData) => Promise<void>;
  deleteEmpleado: (staffId: string) => Promise<void>;
  getEmpleado: (staffId: string) => Promise<Empleado | null>;
}

export function useEmpleados(): UseEmpleadosReturn {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroEstado>("activos");

  // Filtrar empleados según el estado seleccionado
  const empleadosFiltrados = empleados.filter((empleado) => {
    if (filtro === "activos") return empleado.isActive;
    if (filtro === "inactivos") return !empleado.isActive;
    return true; // "ambos"
  });

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Empleado[]>(
        `${API_BASE_URL}/staff/${TENANT_ID}/all/members`
      );

      setEmpleados(response.data);
    } catch (err) {
      console.error("Error fetching empleados:", err);
      setError("Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  const createEmpleado = async (data: EmpleadoFormData) => {
    try {
      setError(null);

      await axios.post(
        `${API_BASE_URL}/staff/${TENANT_ID}/new/members`,
        {
          email: data.email,
          name: data.name,
          role: data.role,
        }
      );

      await fetchEmpleados();
    } catch (err) {
      console.error("Error creating empleado:", err);
      setError("Error al crear el empleado");
      throw err;
    }
  };

  const updateEmpleado = async (staffId: string, data: EmpleadoFormData) => {
    try {
      setError(null);

      await axios.put(
        `${API_BASE_URL}/staff/${TENANT_ID}/members/${staffId}`,
        {
          name: data.name,
          role: data.role,
        }
      );

      // Actualizar el estado local
      setEmpleados((prev) =>
        prev.map((empleado) =>
          empleado.staff_id === staffId
            ? { ...empleado, name: data.name, role: data.role, updatedAt: new Date().toISOString() }
            : empleado
        )
      );
    } catch (err) {
      console.error("Error updating empleado:", err);
      setError("Error al actualizar el empleado");
      throw err;
    }
  };

  const deleteEmpleado = async (staffId: string) => {
    try {
      setError(null);

      await axios.post(
        `${API_BASE_URL}/staff/${TENANT_ID}/members/${staffId}/delete`
      );

      // Actualizar el estado local (soft delete)
      setEmpleados((prev) =>
        prev.map((empleado) =>
          empleado.staff_id === staffId
            ? { ...empleado, isActive: false, updatedAt: new Date().toISOString() }
            : empleado
        )
      );
    } catch (err) {
      console.error("Error deleting empleado:", err);
      setError("Error al desactivar el empleado");
      throw err;
    }
  };

  const getEmpleado = async (staffId: string): Promise<Empleado | null> => {
    try {
      setError(null);

      const response = await axios.get<Empleado>(
        `${API_BASE_URL}/staff/${TENANT_ID}/members/${staffId}`
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching empleado:", err);
      setError("Error al obtener el empleado");
      return null;
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return {
    empleados,
    empleadosFiltrados,
    loading,
    error,
    filtro,
    setFiltro,
    refetch: fetchEmpleados,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getEmpleado,
  };
}
