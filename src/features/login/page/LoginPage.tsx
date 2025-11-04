import "./loginpage.css";
import LoginCard from "../components/LoginCard.tsx";
import bembosLogo from "../../../assets/bembos-empleados.png";

function LoginPage() {
    return (
        <div className="login-page">
            <div className="design-side">
                <div className="cell-0-0"></div>
                <div className="cell-0-1"></div>
                <div className="cell-1-0"></div>
                <div className="cell-1-1"></div>
                <div className="cell-2-0"></div>
                <div className="cell-2-1"></div>
            </div>

            <div className="login-side flex flex-col items-center justify-center gap-6">
                <img
                    src={bembosLogo}
                    alt="Bembos logo"
                    className="w-40 sm:w-48 md:w-56 object-contain select-none"
                />

                <LoginCard />
            </div>
        </div>
    );
}

export default LoginPage;
