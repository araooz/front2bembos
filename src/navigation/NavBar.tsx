import { Link, useLocation, useNavigate } from "react-router-dom";
import { TicketPercent, Home, User, LogOut } from "lucide-react";
import bembosLogo from "../assets/bembos-logo.png";
import { useAuth } from "../features/auth/hooks/useAuth";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white text-blue-800 p-2 w-full flex justify-between items-center shadow-sm">
            <div>
                <Link to="/dashboard">
                    <img src={bembosLogo} alt="Bembos logo" className="w-28" />
                </Link>
            </div>

            {/* Navigation Links - Solo mostrar si está autenticado */}
            {isAuthenticated && (
                <div className="flex space-x-8 items-center text-base font-bold">
                    <Link
                        to="/dashboard"
                        className={`flex items-center space-x-2 hover:text-blue-900 ${
                            location.pathname === "/dashboard" ||
                            location.pathname === "/dashboard/"
                                ? "underline decoration-yellow-400 decoration-2"
                                : ""
                        }`}
                    >
                        <Home size={20} className={'text-blue-800'}/>
                        <span className={'text-blue-800'}>Dashboard</span>
                    </Link>

                    <Link
                        to="/pedidos"
                        className={`flex items-center space-x-2 hover:text-blue-900 ${
                            location.pathname === "/pedidos" ||
                            location.pathname === "/pedidos/"
                                ? "underline decoration-yellow-400 decoration-2"
                                : ""
                        }`}
                    >
                        <TicketPercent size={20} className={'text-blue-800'}/>
                        <span className={'text-blue-800'}>Pedidos</span>
                    </Link>

                    <Link
                        to="/empleados"
                        className={`flex items-center space-x-2 hover:text-blue-900 ${
                            location.pathname === "/empleados" ||
                            location.pathname === "/empleados/"
                                ? "underline decoration-yellow-400 decoration-2"
                                : ""
                        }`}
                    >
                        <User size={20} className={'text-blue-800'}/>
                        <span className={'text-blue-800'}>Empleados</span>
                    </Link>
                </div>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4 font-bold">
                {isAuthenticated ? (
                    <>
                        {/* User Email */}
                        <div className="text-sm text-gray-600">
                            <p className="font-medium">{user?.email}</p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition flex items-center space-x-2"
                        >
                            <LogOut className="text-white" size={20}/>
                            <span className="text-white">Cerrar Sesión</span>
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 font-medium transition flex items-center space-x-2"
                    >
                        <User className="text-white" size={20}/>
                        <span className="text-white">Iniciar sesión</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;