import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/upload" replace />;
    }

    return <LoginForm />;
}