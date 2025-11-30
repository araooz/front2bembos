import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { useEmpleados } from "../hooks/useEmpleados";
import type { Empleado, EmpleadoFormData } from "../types/empleado.types";
import EmpleadoCard from "../components/EmpleadoCard";
import EmpleadoModal from "../components/EmpleadoModal";
import FiltroEstado from "../components/FiltroEstado";

export default function EmpleadosPage() {
  const {
    empleadosFiltrados,
    loading,
    error,
    filtro,
    setFiltro,
    refetch,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
  } = useEmpleados();

  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (empleado?: Empleado) => {
    if (empleado) {
      setSelectedEmpleado(empleado);
    } else {
      setSelectedEmpleado(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmpleado(null);
  };

  const handleSave = async (data: EmpleadoFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedEmpleado) {
        // Actualizar empleado existente
        await updateEmpleado(selectedEmpleado.staff_id, data);
      } else {
        // Crear nuevo empleado
        await createEmpleado(data);
      }

      handleCloseModal();
    } catch (err) {
      // Error manejado en el hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (staffId: string) => {
    try {
      setIsSubmitting(true);
      await deleteEmpleado(staffId);
      handleCloseModal();
    } catch (err) {
      // Error manejado en el hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            Gestión de Empleados
          </h1>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <FiltroEstado filtroActual={filtro} onChange={setFiltro} />
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white text-blue-800 px-3 py-2 rounded-lg shadow hover:bg-gray-100 flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw size={40} className="animate-spin text-blue-800 mx-auto mb-4" />
              <p className="text-gray-600">Cargando empleados...</p>
            </div>
          </div>
        ) : empleadosFiltrados.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay empleados {filtro === "activos" ? "activos" : filtro === "inactivos" ? "inactivos" : ""}
              </h3>
              <p className="text-gray-500 mb-4">
                {filtro === "activos" 
                  ? "No hay empleados activos registrados en esta sucursal"
                  : filtro === "inactivos"
                  ? "No hay empleados inactivos en esta sucursal"
                  : "No hay empleados registrados en esta sucursal"}
              </p>
              {filtro !== "ambos" && (
                <button
                  onClick={() => setFiltro("ambos")}
                  className="text-blue-800 hover:text-blue-900 font-medium"
                >
                  Ver todos los empleados
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Empleados Grid */
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {empleadosFiltrados.length} empleado{empleadosFiltrados.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empleadosFiltrados.map((empleado) => (
                <EmpleadoCard
                  key={empleado.staff_id}
                  empleado={empleado}
                  onClick={() => handleOpenModal(empleado)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <EmpleadoModal
          empleado={selectedEmpleado}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={selectedEmpleado ? handleDelete : undefined}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
