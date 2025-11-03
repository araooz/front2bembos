import { useState } from "react";
import FormInput from "./FormInput.tsx";
import { Mail, LockKeyholeOpen } from 'lucide-react';
import type { FormEvent } from "react";

function LoginCard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });
    };

    return (
        <div className="bg-white flex flex-col items-center justify-center gap-4 p-6 rounded-xl w-[400px]">
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
                    className="mt-8 bg-blue-800 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition cursor-pointer"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default LoginCard;
