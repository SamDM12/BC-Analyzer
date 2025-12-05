import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import axios from 'axios';

// Types
export type AppRole = 'Gerencia' | 'Ejecutivo de cuentas';

export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: AppRole;
    permissions: string[];
    isActive: boolean;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: AppRole) => boolean;
    clearError: () => void;
}

// Lee del localStorage al inicializar
const getInitialState = (): AuthState => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
        try {
            return {
                user: JSON.parse(savedUser),
                token: savedToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };
};

const initialState: AuthState = getInitialState();



function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
            // Guarda en localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload,
            };
        case 'LOGOUT':
            // Limpia localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return initialState;
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios interceptor for auth token
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Update axios interceptor when token changes
    useMemo(() => {
        api.interceptors.request.use(
            (config) => {
                if (state.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }, [state.token]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            return true;
        } catch (error) {
            let errorMessage = 'Error de conexión con el servidor';

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    errorMessage = 'Credenciales inválidas';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }

            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' });
    }, []);

    const hasPermission = useCallback((permission: string): boolean => {
        if (!state.user) return false;
        if (state.user.role === 'Gerencia') return true;
        return state.user.permissions.includes(permission);
    }, [state.user]);

    const hasRole = useCallback((role: AppRole): boolean => {
        if (!state.user) return false;
        // Gerencia tiene acceso a todo
        if (state.user.role === 'Gerencia') return true;
        // Para otros roles, verificar coincidencia exacta
        return state.user.role === role;
    }, [state.user]);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const value = useMemo(() => ({
        ...state,
        login,
        logout,
        hasPermission,
        hasRole,
        clearError,
    }), [state, login, logout, hasPermission, hasRole, clearError]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { api };
