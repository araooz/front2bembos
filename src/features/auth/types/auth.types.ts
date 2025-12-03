// features/auth/types/auth.types.ts

export interface LoginCredentials {
  email: string;
  password: string;
  tenant_id: string;
}

export interface LoginResponse {
  token: string;
  session_id: string;
}

export interface AuthUser {
  email: string;
  session_id: string;
  tenant_id: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Payload del JWT (según tu backend)
export interface JWTPayload {
  sub: string; // staff_id (email)
  session_id: string;
  iat: number;
  exp: number;
}