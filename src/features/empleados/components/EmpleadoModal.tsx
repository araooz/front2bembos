import { X, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Empleado, EmpleadoFormData } from "../types/empleado.types";
import { ROLES, isValidEmail } from "../types/empleado.types";
import RoleBadge from "./RoleBadge";

interface EmpleadoModalProps {
  empleado: Empleado | null; // null = crear nuevo
  onClose: () => void;
  onSave: (data: EmpleadoFormData) => Promise<void>;
  onDelete?: (staffId: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function EmpleadoModal({
  empleado,
  onClose,
  onSave,
  onDelete,
  isSubmitting,
}: EmpleadoModalProps) {
  const [formData, setFormData] = useState<EmpleadoFormData>({
    email: empleado?.staff_id || "",
    name: empleado?.name || "",
    role: empleado?.role || "cocinero",
  });

  const [emailError, setEmailError] = useState<string>("");

  const isEditing = empleado !== null;

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email: email.toLowerCase() }));
    
    // Validar email en tiempo real
    if (email && !isValidEmail(email)) {
      setEmailError("Email inválido");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación final
    if (!formData.email.trim()) {
      setEmailError("El email es requerido");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setEmailError("Email inválido");
      return;
    }

    if (!formData.name.trim()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (err) {
      // Error manejado en el hook
    }
  };

  const handleDeleteClick = async () => {
    if (!empleado || !onDelete) return;

    if (!confirm(`¿Está seguro de que desea desactivar a ${empleado.name}?`)) {
      return;
    }

    try {
      await onDelete(empleado.staff_id);
    } catch (err) {
      // Error manejado en el hook
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Detalle de Empleado" : "Nuevo Empleado"}
            </h2>
            {isEditing && empleado && (
              <p className="text-sm text-gray-500 mt-1">
                Creado: {formatDate(empleado.createdAt)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Estado (solo si está editando) */}
          {isEditing && empleado && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Estado</h3>
              <div className="flex items-center justify-between">
                <RoleBadge role={empleado.role} />
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    empleado.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {empleado.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isEditing} // No se puede editar el email en modo edición
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              } ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="ejemplo@bembos.com"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                <AlertCircle size={12} />
                <span>{emailError}</span>
              </p>
            )}
            {isEditing && (
              <p className="text-gray-500 text-xs mt-1">
                El email no puede ser modificado
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value as any }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Warning si está inactivo */}
          {isEditing && empleado && !empleado.isActive && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Este empleado está inactivo y no puede ser modificado.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              {isEditing ? "Cerrar" : "Cancelar"}
            </button>

            {/* Botón de guardar solo si está creando o el empleado está activo */}
            {(!isEditing || (empleado && empleado.isActive)) && (
              <button
                type="submit"
                disabled={isSubmitting || !!emailError}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  isSubmitting || emailError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
            )}
          </div>

          {/* Botón de eliminar (solo si está editando y activo) */}
          {isEditing && empleado && empleado.isActive && onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <span>Desactivando...</span>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>Desactivar Empleado</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
