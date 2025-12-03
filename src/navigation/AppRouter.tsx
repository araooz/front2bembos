import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import LoginPage from "../features/login/page/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import PedidosPage from "../features/pedidos/page/PedidosPage";
import EmpleadosPage from "../features/empleados/page/EmpleadosPage";
import Navbar from "./NavBar";
import { useAuth } from "../features/auth/hooks/useAuth";

function AppRouter() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* Navbar solo se muestra si está autenticado */}
            {isAuthenticated && <Navbar />}

            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rutas protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pedidos"
                    element={
                        <ProtectedRoute>
                            <PedidosPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/empleados"
                    element={
                        <ProtectedRoute>
                            <EmpleadosPage />
                        </ProtectedRoute>
                    }
                />

                {/* Redirección por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    );
}

export default AppRouter;