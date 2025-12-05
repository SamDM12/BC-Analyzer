import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
}

// Mock data
const mockPermissions: Permission[] = [
    { id: '1', name: 'VIEW_DASHBOARD', description: 'Ver dashboard principal', category: 'Dashboard' },
    { id: '2', name: 'UPLOAD_DATA', description: 'Cargar archivos de datos', category: 'Datos' },
    { id: '3', name: 'VIEW_METRICS', description: 'Ver métricas y KPIs', category: 'Dashboard' },
    { id: '4', name: 'GENERATE_REPORTS', description: 'Generar reportes', category: 'Reportes' },
    { id: '5', name: 'MANAGE_USERS', description: 'Gestionar usuarios', category: 'Administración' },
    { id: '6', name: 'MANAGE_ROLES', description: 'Gestionar roles', category: 'Administración' },
    { id: '7', name: 'VIEW_HISTORY', description: 'Ver historial de consultas', category: 'Datos' },
    { id: '8', name: 'EXPORT_DATA', description: 'Exportar datos', category: 'Datos' },
    { id: '9', name: 'DELETE_DATA', description: 'Eliminar registros de datos', category: 'Datos' },
    { id: '10', name: 'MANAGE_SETTINGS', description: 'Configurar ajustes del sistema', category: 'Administración' },
];

const mockRoles: Role[] = [
    { id: '1', name: 'ADMIN', description: 'Acceso total al sistema', permissions: mockPermissions.map(p => p.id) },
    { id: '2', name: 'ANALYST', description: 'Puede analizar datos y generar reportes', permissions: ['1', '2', '3', '4', '7', '8'] },
    { id: '3', name: 'VIEWER', description: 'Solo puede ver datos, sin modificaciones', permissions: ['1', '3', '7'] },
];

export default function RolePermissions() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);
    const [permissions] = useState<Permission[]>(mockPermissions);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Simulate API fetch
        const foundRole = mockRoles.find(r => r.id === id);
        if (foundRole) {
            setRole(foundRole);
            setSelectedPermissions(foundRole.permissions);
        }
    }, [id]);

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions(prev => {
            const newPermissions = prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId];

            setHasChanges(true);
            return newPermissions;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success('Permisos actualizados correctamente');
            setHasChanges(false);
        } catch (error) {
            toast.error('Error al guardar los permisos');
        } finally {
            setIsSaving(false);
        }
    };

    const selectAllInCategory = (category: string) => {
        const categoryPermissions = permissions.filter(p => p.category === category);
        const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p.id));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.some(p => p.id === id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions.map(p => p.id)])]);
        }
        setHasChanges(true);
    };

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    if (!role) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Rol no encontrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/roles')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">{role.name}</h2>
                        </div>
                        <p className="text-muted-foreground">{role.description}</p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Guardar Cambios
                        </>
                    )}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permisos del Rol</CardTitle>
                    <CardDescription>
                        Selecciona los permisos que tendrá este rol. Los cambios se guardan al hacer clic en "Guardar Cambios".
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary">
                            {selectedPermissions.length} de {permissions.length} permisos seleccionados
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions], index) => {
                        const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p.id));
                        const someSelected = categoryPermissions.some(p => selectedPermissions.includes(p.id));

                        return (
                            <div key={category}>
                                {index > 0 && <Separator className="mb-6" />}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => selectAllInCategory(category)}
                                            className="text-xs"
                                        >
                                            {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {categoryPermissions.map(permission => (
                                            <div
                                                key={permission.id}
                                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                                                    selectedPermissions.includes(permission.id)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                }`}
                                                onClick={() => togglePermission(permission.id)}
                                            >
                                                <Checkbox
                                                    id={permission.id}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={() => togglePermission(permission.id)}
                                                    className="mt-0.5"
                                                />
                                                <div className="grid gap-1 flex-1">
                                                    <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                                        {permission.name}
                                                        {selectedPermissions.includes(permission.id) && (
                                                            <Check className="h-3 w-3 text-primary" />
                                                        )}
                                                    </label>
                                                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}