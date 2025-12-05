import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: AppRole;
    requiredPermission?: string;
}

export function PrivateRoute({ children, requiredRole, requiredPermission }: PrivateRouteProps) {
    const { isAuthenticated, hasRole, hasPermission, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-muted-foreground">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/access-denied" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/access-denied" replace />;
    }

    return <>{children}</>;
}
