import axios from "axios";
import type { LoginCredentials, LoginResponse, JWTPayload } from "../types/auth.types";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        AUTH_API_URL,
        credentials
      );

      // Guardar token y datos del usuario
      this.saveToken(response.data.token);
      this.saveUserData({
        email: credentials.email,
        session_id: response.data.session_id,
        tenant_id: credentials.tenant_id,
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Errores del backend
        const status = error.response.status;
        const message = error.response.data?.body || error.response.data;

        if (status === 401) {
          throw new Error("Credenciales inválidas");
        } else if (status === 403) {
          throw new Error("Cuenta desactivada");
        } else if (status === 404) {
          throw new Error("Usuario no encontrado");
        } else {
          throw new Error(message || "Error al iniciar sesión");
        }
      }
      throw new Error("Error de conexión. Verifica tu red.");
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Guardar token
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Guardar datos del usuario
  saveUserData(user: { email: string; session_id: string; tenant_id: string }): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Obtener datos del usuario
  getUserData(): { email: string; session_id: string; tenant_id: string } | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Verificar si el token está expirado
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  },

  // Decodificar JWT (sin verificar firma)
  decodeToken(token: string): JWTPayload {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Token inválido");
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    // Añadir padding si es necesario
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  },

  // Verificar autenticación
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  },
};