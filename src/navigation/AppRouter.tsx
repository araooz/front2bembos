import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../features/login/page/LoginPage.tsx";
import Dashboard from "../features/Dashboard";
import Navbar from "./NavBar.tsx";
import PedidosPage from "../features/pedidos/page/PedidosPage";
import EmpleadosPage from "../features/empleados/page/EmpleadosPage.tsx";

export default function AppRouter() {
    return (
        <Router>
            <div className="w-full min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 w-full">
                    <Routes>
                        <Route path="/" element={<LoginPage/>} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pedidos" element={<PedidosPage />} />
                        <Route path="/empleados" element={<EmpleadosPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}