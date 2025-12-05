import { Navigate } from "react-router-dom";

export function RequireRole({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;

  const user = JSON.parse(userData);

  if (!roles.includes(user.tipoUsuario)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}