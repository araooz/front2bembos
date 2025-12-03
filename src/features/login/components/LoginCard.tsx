// features/login/components/LoginCard.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput.tsx";
import { Mail, LockKeyholeOpen } from 'lucide-react';
import { useAuth } from "../../auth/hooks/useAuth";
import type { FormEvent } from "react";

const TENANT_ID = import.meta.env.VITE_TENANT_ID;

function LoginCard() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        // Validaciones básicas
        if (!email || !password) {
            setError("Por favor completa todos los campos");
            return;
        }

        if (!email.includes("@")) {
            setError("Por favor ingresa un email válido");
            return;
        }

        setLoading(true);

        try {
            await login({
                email: email,
                password: password,
                tenant_id: TENANT_ID,
            });

            // Redirigir al dashboard
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white flex flex-col items-center justify-center gap-4 p-6 rounded-xl w-[400px]">
            {/* Error Message */}
            {error && (
                <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <FormInput
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    placeholder=""
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} />}
                />

                <FormInput
                    label="Contraseña"
                    type="password"
                    value={password}
                    placeholder=""
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockKeyholeOpen size={18} />}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-8 bg-blue-800 text-white rounded-lg py-2 font-semibold hover:bg-blue-900 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Iniciando sesión...
                        </span>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </form>
        </div>
    );
}

export default LoginCard;