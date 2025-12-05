import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <Card className="w-full max-w-md shadow-xl border-border/50 text-center">
                <CardContent className="pt-8 pb-8 space-y-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldX className="h-10 w-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">Acceso Denegado</h1>
                        <p className="text-muted-foreground">
                            No tienes permisos para acceder a este módulo.
                            Contacta al administrador si crees que esto es un error.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                        <Button
                            onClick={() => navigate('/upload')}
                            className="gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Ir al Inicio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
