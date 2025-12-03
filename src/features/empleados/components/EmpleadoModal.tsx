import { X, Trash2, AlertCircle, User, Mail, Briefcase, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
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

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (empleado) {
      setFormData({
        email: empleado.staff_id,
        name: empleado.name,
        role: empleado.role,
      });
    } else {
      setFormData({
        email: "",
        name: "",
        role: "cocinero",
      });
    }
    setEmailError("");
  }, [empleado]);

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email: email.toLowerCase() }));

    // Validar email en tiempo real
    if (email && !isValidEmail(email)) {
      setEmailError("Formato de email inválido");
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

    // Validar contraseña solo al crear
    if (!isEditing) {
      if (!formData.password || formData.password.length < 6) {
        // Aunque el input tiene minLength, validamos aquí también por seguridad
        return;
      }
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
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {isEditing ? (
                <>
                  <User className="w-5 h-5 text-blue-200" />
                  Editar Empleado
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-blue-200" />
                  Nuevo Empleado
                </>
              )}
            </h2>
            <p className="text-blue-200 text-xs mt-1">
              {isEditing
                ? "Actualice la información del empleado"
                : "Complete los datos para registrar un nuevo empleado"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Status Banner (Editing Mode) */}
          {isEditing && empleado && (
            <div className={`rounded-xl p-4 border ${empleado.isActive
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100"
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${empleado.isActive ? "bg-green-100" : "bg-red-100"
                    }`}>
                    {empleado.isActive
                      ? <CheckCircle2 size={18} className="text-green-600" />
                      : <AlertCircle size={18} className="text-red-600" />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${empleado.isActive ? "text-green-800" : "text-red-800"
                      }`}>
                      {empleado.isActive ? "Empleado Activo" : "Empleado Inactivo"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Registrado el {formatDate(empleado.createdAt)}
                    </p>
                  </div>
                </div>
                <RoleBadge role={empleado.role} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={isEditing}
                  required
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${emailError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300"
                    } ${isEditing ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "text-gray-900"}`}
                  placeholder="ejemplo@bembos.com"
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 ml-1">
                  <AlertCircle size={14} />
                  {emailError}
                </p>
              )}
              {isEditing && (
                <p className="mt-1.5 text-xs text-gray-500 ml-1">
                  El ID de usuario (email) no se puede modificar.
                </p>
              )}
            </div>

            {/* Rol */}
            <div className="group">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                Rol Asignado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value as any }))
                  }
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white transition-all"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password (Solo crear) */}
            {!isEditing && (
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required={!isEditing}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 ml-1">
                  Mínimo 6 caracteres.
                </p>
              </div>
            )}
          </div>

          {/* Warning Inactivo */}
          {isEditing && empleado && !empleado.isActive && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
              <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Cuenta desactivada</p>
                <p className="mt-0.5 opacity-90">Este empleado no tiene acceso al sistema actualmente.</p>
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-100 mt-2">

            {/* Delete Button (Left aligned on desktop) */}
            {isEditing && empleado && empleado.isActive && onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isSubmitting}
                className="sm:mr-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Trash2 size={18} />
                <span className="sm:hidden">Desactivar</span>
                <span className="hidden sm:inline">Desactivar Cuenta</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm"
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            {(!isEditing || (empleado && empleado.isActive)) && (
              <button
                type="submit"
                disabled={isSubmitting || !!emailError}
                className="px-6 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-blue-900/20 bg-blue-900 hover:bg-blue-800 hover:shadow-blue-900/30 active:scale-95 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  isEditing ? "Guardar Cambios" : "Crear Empleado"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
