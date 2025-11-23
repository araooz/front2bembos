import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle, Trash2, Edit2, Plus, X } from "lucide-react";

export const empleadosMock: Empleado[] = [
  {
    staff_id: "STF-001",
    tenant_id: "TENANT-001",
    first_name: "Carlos",
    last_name: "Ramírez",
    email: "carlos.ramirez@empresa.com",
    phone: "987654321",
    role: "COCINERO",
    is_active: true,
    createdAt: "2024-11-10T14:32:00Z",
    updatedAt: "2024-11-10T14:32:00Z"
  },
  {
    staff_id: "STF-002",
    tenant_id: "TENANT-001",
    first_name: "María",
    last_name: "Torres",
    email: "maria.torres@empresa.com",
    phone: "912345678",
    role: "CAJERO",
    is_active: true,
    createdAt: "2024-11-11T09:12:00Z",
    updatedAt: "2024-11-11T09:12:00Z"
  },
  {
    staff_id: "STF-003",
    tenant_id: "TENANT-001",
    first_name: "Luis",
    last_name: "Santos",
    email: "luis.santos@empresa.com",
    phone: "902922331",
    role: "REPARTIDOR",
    is_active: false,
    createdAt: "2024-11-12T18:40:00Z",
    updatedAt: "2024-12-01T10:20:00Z"
  },
  {
    staff_id: "STF-004",
    tenant_id: "TENANT-001",
    first_name: "Ana",
    last_name: "Gutiérrez",
    email: "ana.gutierrez@empresa.com",
    phone: "955001122",
    role: "ADMIN",
    is_active: true,
    createdAt: "2024-10-20T12:00:00Z",
    updatedAt: "2024-12-05T16:22:00Z"
  },
  {
    staff_id: "STF-005",
    tenant_id: "TENANT-001",
    first_name: "Jorge",
    last_name: "Salinas",
    email: "jorge.salinas@empresa.com",
    phone: "999333444",
    role: "COCINERO",
    is_active: true,
    createdAt: "2024-09-15T08:15:00Z",
    updatedAt: "2024-11-29T14:45:00Z"
  }
];

interface Empleado {
  staff_id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: string; // e.g., "COCINERO", "CAJERO", "REPARTIDOR", "ADMIN"
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmpleadoFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

const ROLES = [
  { value: "ADMIN", label: "Administrador", color: "bg-purple-100 text-purple-800" },
  { value: "COCINERO", label: "Cocinero", color: "bg-orange-100 text-orange-800" },
  { value: "CAJERO", label: "Cajero", color: "bg-blue-100 text-blue-800" },
  { value: "REPARTIDOR", label: "Repartidor", color: "bg-green-100 text-green-800" },
];

const getRoleLabel = (role: string): string => {
  return ROLES.find(r => r.value === role)?.label || role;
};

const getRoleColor = (role: string): string => {
  return ROLES.find(r => r.value === role)?.color || "bg-gray-100 text-gray-800";
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const [formData, setFormData] = useState<EmpleadoFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "CAJERO",
  });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      setEmpleados(empleadosMock);
    } catch (err) {
      setError("Error al cargar los empleados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setEmpleadoSeleccionado(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "CAJERO",
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (empleado: Empleado) => {
    setModoEdicion(true);
    setEmpleadoSeleccionado(empleado);
    setFormData({
      first_name: empleado.first_name,
      last_name: empleado.last_name,
      email: empleado.email,
      phone: empleado.phone || "",
      role: empleado.role,
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setModoEdicion(false);
    setEmpleadoSeleccionado(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "CAJERO",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGuardando(true);
      if (modoEdicion && empleadoSeleccionado) {
        await axios.put(
          `https://api-gateway-url/empleados/${empleadoSeleccionado.staff_id}`,
          formData
        );
      } else {
        await axios.post("https://api-gateway-url/empleados", formData);
      }
      await fetchEmpleados();
      cerrarModal();
    } catch (err) {
      setError(modoEdicion ? "Error al actualizar empleado" : "Error al crear empleado");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarEmpleado = async (staff_id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      return;
    }
    try {
      setEliminando(staff_id);
      await axios.delete(`https://api-gateway-url/empleados/${staff_id}`);
      await fetchEmpleados();
    } catch (err) {
      setError("Error al eliminar empleado");
      console.error(err);
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            Gestión de Empleados
          </h1>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} />
            <span>Nuevo Empleado</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Cargando empleados...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={fetchEmpleados}
              className="mt-4 mx-auto block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        ) : empleados.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8">
            <p className="text-gray-600 text-center">No hay empleados registrados</p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para pantallas grandes */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {empleados.map((empleado) => (
                      <tr key={empleado.staff_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <UserCircle className="text-blue-600" size={32} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {empleado.first_name} {empleado.last_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {empleado.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {empleado.phone || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                              empleado.role
                            )}`}
                          >
                            {getRoleLabel(empleado.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              empleado.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {empleado.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => abrirModalEditar(empleado)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => eliminarEmpleado(empleado.staff_id)}
                              disabled={eliminando === empleado.staff_id}
                              className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                                eliminando === empleado.staff_id ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista de cards para pantallas pequeñas */}
            <div className="md:hidden space-y-4">
              {empleados.map((empleado) => (
                <div
                  key={empleado.staff_id}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <UserCircle className="text-blue-600" size={40} />
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          {empleado.first_name} {empleado.last_name}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            empleado.role
                          )}`}
                        >
                          {getRoleLabel(empleado.role)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        empleado.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {empleado.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{empleado.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-base text-gray-900">{empleado.phone || "-"}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => abrirModalEditar(empleado)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => eliminarEmpleado(empleado.staff_id)}
                      disabled={eliminando === empleado.staff_id}
                      className={`flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors ${
                        eliminando === empleado.staff_id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 size={16} />
                      <span>{eliminando === empleado.staff_id ? "Eliminando..." : "Eliminar"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal para crear/editar empleado */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {modoEdicion ? "Editar Empleado" : "Nuevo Empleado"}
                </h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="999 999 999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ROLES.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      guardando
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    {guardando ? "Guardando..." : modoEdicion ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
