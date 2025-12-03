import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { AuthContextType, LoginCredentials, AuthUser } from "../types/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar estado desde localStorage
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUserData();

    if (storedToken && storedUser && !authService.isTokenExpired()) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      // Token expirado, limpiar
      authService.logout();
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      const userData: AuthUser = {
        email: credentials.email,
        session_id: response.session_id,
        tenant_id: credentials.tenant_id,
      };

      setToken(response.token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const checkAuth = (): boolean => {
    return authService.isAuthenticated();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}