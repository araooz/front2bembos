import axios from "axios";
import { authService } from "../features/auth/services/authService";

// Crear instancia de axios
export const api = axios.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🚀 Request to: ${config.url}`, {
            method: config.method,
            headers: config.headers,
        });

        return config;
    },
    (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from: ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error("❌ Response error:", error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            // Token expirado o inválido
            console.warn("🔒 Token inválido o expirado, redirigiendo a login...");
            authService.logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;