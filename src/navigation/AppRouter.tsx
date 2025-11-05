import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../features/login/page/LoginPage.tsx";
import Dashboard from "../features/Dashboard";
import Pedidos from "../features/Pedidos";
import Empleados from "../features/empleados/Empleados.tsx";
import Navbar from "./NavBar.tsx";

export default function AppRouter() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LoginPage/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/empleados" element={<Empleados />} />
            </Routes>
        </Router>
    );
}