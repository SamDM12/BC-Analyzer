import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, KeyRound, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Permission {
    id: string;
    name: string;
    description: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: string;
}

const roleSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').transform(val => val.toUpperCase()),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
});

type RoleFormData = z.infer<typeof roleSchema>;

// Mock data
const mockPermissions: Permission[] = [
    { id: '1', name: 'VIEW_DASHBOARD', description: 'Ver dashboard principal' },
    { id: '2', name: 'UPLOAD_DATA', description: 'Cargar archivos de datos' },
    { id: '3', name: 'VIEW_METRICS', description: 'Ver métricas y KPIs' },
    { id: '4', name: 'GENERATE_REPORTS', description: 'Generar reportes' },
    { id: '5', name: 'MANAGE_USERS', description: 'Gestionar usuarios' },
    { id: '6', name: 'MANAGE_ROLES', description: 'Gestionar roles' },
    { id: '7', name: 'VIEW_HISTORY', description: 'Ver historial de consultas' },
    { id: '8', name: 'EXPORT_DATA', description: 'Exportar datos' },
];

const mockRoles: Role[] = [
    { id: '1', name: 'ADMIN', description: 'Acceso total al sistema', permissions: mockPermissions.map(p => p.id), createdAt: '2024-01-01' },
    { id: '2', name: 'ANALYST', description: 'Puede analizar datos y generar reportes', permissions: ['1', '2', '3', '4', '7', '8'], createdAt: '2024-01-15' },
    { id: '3', name: 'VIEWER', description: 'Solo puede ver datos, sin modificaciones', permissions: ['1', '3', '7'], createdAt: '2024-02-01' },
];

export default function AdminRoles() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [permissions] = useState<Permission[]>(mockPermissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
    });

    useEffect(() => {
        if (editingRole) {
            setValue('name', editingRole.name);
            setValue('description', editingRole.description);
            setSelectedPermissions(editingRole.permissions);
        } else {
            reset();
            setSelectedPermissions([]);
        }
    }, [editingRole, setValue, reset]);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateDialog = () => {
        setEditingRole(null);
        reset();
        setSelectedPermissions([]);
        setIsDialogOpen(true);
    };

    const openEditDialog = (role: Role) => {
        setEditingRole(role);
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (role: Role) => {
        setDeletingRole(role);
        setIsDeleteDialogOpen(true);
    };

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const onSubmit = async (data: RoleFormData) => {
        // Check if role name already exists (for new roles only)
        if (!editingRole && roles.some(r => r.name === data.name)) {
            toast.error('El nombre del rol ya existe');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (editingRole) {
                setRoles(prev => prev.map(r =>
                    r.id === editingRole.id
                        ? { ...r, name: data.name, description: data.description, permissions: selectedPermissions }
                        : r
                ));
                toast.success('Rol actualizado correctamente');
            } else {
                const newRole: Role = {
                    id: Date.now().toString(),
                    name: data.name,
                    description: data.description,
                    permissions: selectedPermissions,
                    createdAt: new Date().toISOString().split('T')[0],
                };
                setRoles(prev => [...prev, newRole]);
                toast.success('Rol creado correctamente');
            }

            setIsDialogOpen(false);
            setEditingRole(null);
            reset();
            setSelectedPermissions([]);
        } catch (error) {
            toast.error('No se pudo crear el rol');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingRole) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setRoles(prev => prev.filter(r => r.id !== deletingRole.id));
            toast.success('Rol eliminado correctamente');
            setIsDeleteDialogOpen(false);
            setDeletingRole(null);
        } catch (error) {
            toast.error('Error al eliminar el rol');
        } finally {
            setIsLoading(false);
        }
    };

    const getPermissionCount = (role: Role) => {
        return role.permissions.length;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Gestión de Roles</h2>
                    <p className="text-muted-foreground">Administra los roles y permisos del sistema</p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Rol
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Permisos</TableHead>
                                    <TableHead>Fecha Creación</TableHead>
                                    <TableHead className="w-[70px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No se encontraron roles
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRoles.map((role) => (
                                        <TableRow key={role.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">{role.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{role.description}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getPermissionCount(role)} permisos
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{role.createdAt}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(role)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/roles/${role.id}/permissions`)}>
                                                            <KeyRound className="h-4 w-4 mr-2" />
                                                            Gestionar Permisos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteDialog(role)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Role Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Editar Rol' : 'Crear Rol'}</DialogTitle>
                        <DialogDescription>
                            {editingRole ? 'Modifica los datos del rol' : 'Ingresa los datos del nuevo rol'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Rol</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                className={`uppercase ${errors.name ? 'border-destructive' : ''}`}
                                placeholder="Ej: MANAGER"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                className={errors.description ? 'border-destructive' : ''}
                                placeholder="Describe las responsabilidades de este rol..."
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label>Permisos</Label>
                            <div className="border border-border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                                {permissions.map(permission => (
                                    <div key={permission.id} className="flex items-start gap-3">
                                        <Checkbox
                                            id={permission.id}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => togglePermission(permission.id)}
                                        />
                                        <div className="grid gap-1">
                                            <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                                {permission.name}
                                            </label>
                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Guardando...' : editingRole ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar Rol</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el rol <strong>{deletingRole?.name}</strong>? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
