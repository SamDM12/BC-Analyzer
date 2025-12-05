import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn, Mail, Lock } from "lucide-react";
import { login } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
        toast.error("Por favor complete todos los campos");
        return;
    }

    setLoading(true);

    try {
        const res = await login(email, password);

        if (!res.usuario.activo) {
        toast.error("Usuario inactivo. Contacte a la gerencia.");
        return;
        }

        // Guardar token y usuario completo
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.usuario));
        localStorage.setItem("rol", res.usuario.tipoUsuario); // opcional

        toast.success(`Bienvenido, ${res.usuario.nombre}`);

        // Redirección según tipo de usuario
        if (res.usuario.tipoUsuario === "GERENCIA") {
        navigate("/metrics");
        } else if (res.usuario.tipoUsuario === "EJECUTIVO") {
        navigate("/upload");
        } else {
        navigate("/upload"); // fallback
        }

    } catch (err: any) {
        toast.error(err.response?.data?.error || "Credenciales incorrectas");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md">

        <Card className="p-8 shadow-lg border border-border">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
            <p className="mt-2 text-muted-foreground">
              Accede al sistema de análisis bancario
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                className="pl-10"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                className="pl-10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Botón login */}
          <Button
            className="w-full py-6 text-lg"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Ingresando..." : (
              <div className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Entrar
              </div>
            )}
          </Button>

        </Card>
      </div>
    </div>
  );
}