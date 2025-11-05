import { Link, useLocation } from "react-router-dom";
import { Hamburger, TicketPercent, Store, PhoneCall, UserCircle } from "lucide-react";
import bembosLogo from "../assets/bembos-logo.png";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-white text-blue-800 p-2 w-full flex justify-between items-center">
            <div>
                <Link to="/">
                    <img src={bembosLogo} alt="Bembos logo" className="w-28" />
                </Link>
            </div>

            <div className="flex space-x-8 items-center text-base font-bold">
                <Link
                    to="/menu/"
                    className={`flex items-center space-x-2 hover:text-blue-600 ${
                        location.pathname === "/menu/"
                            ? "underline decoration-yellow-400 decoration-2"
                            : ""
                    }`}
                >
                    <Hamburger size={20}/>
                    <span>MENÚ</span>
                </Link>

                <Link
                    to="/menu/promociones/"
                    className={`flex items-center space-x-2 hover:text-blue-600 ${
                        location.pathname === "/menu/promociones/"
                            ? "underline decoration-yellow-400 decoration-2"
                            : ""
                    }`}
                >
                    <TicketPercent size={20}/>
                    <span>PROMOS EXCLUSIVAS</span>
                </Link>

                <Link
                    to="/locales/"
                    className={`flex items-center space-x-2 hover:text-blue-600 ${
                        location.pathname === "/locales/"
                            ? "underline decoration-yellow-400 decoration-2"
                            : ""
                    }`}
                >
                    <Store size={20}/>
                    <span>LOCALES</span>
                </Link>
            </div>

            <div className="flex items-center space-x-8 font-bold">
                <div className="flex items-center space-x-2">
                    <PhoneCall size={20} className="text-yellow-400"/>
                    <div className="leading-tight">
                        <span className="block text-sm">Llámanos</span>
                        <div className="flex flex-row items-center">
                            <p className="text-blue-800">01419</p>
                            <p className="text-red-500">-</p>
                            <p className="text-blue-800">1919</p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/login/"
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition flex items-center space-x-2"
                >
                    <UserCircle className="text-white" size={20}/>
                    <span className="text-white">Iniciar sesión</span>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
