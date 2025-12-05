import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, RotateCcw, UserCheck, UserX, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, AppRole } from '@/contexts/AuthContext';

interface User {
    id: string;
    name: string;
    email: string;
    role: AppRole;
    isActive: boolean;
    createdAt: string;
}

interface Role {
    id: string;
    name: string;
}

const userSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']),
});

type UserFormData = z.infer<typeof userSchema>;

// Mock data for demonstration
const mockUsers: User[] = [
    { id: '1', name: 'Admin Usuario', email: 'admin@bcanalyzer.com', role: 'ADMIN', isActive: true, createdAt: '2024-01-15' },
    { id: '2', name: 'Ana García', email: 'ana.garcia@bcanalyzer.com', role: 'ANALYST', isActive: true, createdAt: '2024-02-20' },
    { id: '3', name: 'Carlos López', email: 'carlos.lopez@bcanalyzer.com', role: 'VIEWER', isActive: true, createdAt: '2024-03-10' },
    { id: '4', name: 'María Rodríguez', email: 'maria.rodriguez@bcanalyzer.com', role: 'ANALYST', isActive: false, createdAt: '2024-01-25' },
];

const mockRoles: Role[] = [
    { id: '1', name: 'ADMIN' },
    { id: '2', name: 'ANALYST' },
    { id: '3', name: 'VIEWER' },
];

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [roles] = useState<Role[]>(mockRoles);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'VIEWER',
        },
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (editingUser) {
            setValue('name', editingUser.name);
            setValue('email', editingUser.email);
            setValue('role', editingUser.role);
            setValue('password', '');
        } else {
            reset();
        }
    }, [editingUser, setValue, reset]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreateDialog = () => {
        setEditingUser(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setDeletingUser(user);
        setIsDeleteDialogOpen(true);
    };

    const onSubmit = async (data: UserFormData) => {
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            if (editingUser) {
                setUsers(prev => prev.map(u =>
                    u.id === editingUser.id
                        ? { ...u, name: data.name, email: data.email, role: data.role }
                        : u
                ));
                toast.success('Usuario actualizado correctamente');
            } else {
                const newUser: User = {
                    id: Date.now().toString(),
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    isActive: true,
                    createdAt: new Date().toISOString().split('T')[0],
                };
                setUsers(prev => [...prev, newUser]);
                toast.success('Usuario creado correctamente');
            }

            setIsDialogOpen(false);
            setEditingUser(null);
            reset();
        } catch (error) {
            toast.error('Error al guardar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
            toast.success('Usuario eliminado correctamente');
            setIsDeleteDialogOpen(false);
            setDeletingUser(null);
        } catch (error) {
            toast.error('Error al eliminar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUserStatus = async (user: User) => {
        setUsers(prev => prev.map(u =>
            u.id === user.id ? { ...u, isActive: !u.isActive } : u
        ));
        toast.success(user.isActive ? 'Usuario desactivado' : 'Usuario activado');
    };

    const handleResetPassword = async (user: User) => {
        toast.success(`Se enviará un correo de restablecimiento a ${user.email}`);
    };

    const getRoleBadgeVariant = (role: AppRole) => {
        switch (role) {
            case 'ADMIN': return 'default';
            case 'ANALYST': return 'secondary';
            case 'VIEWER': return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground">Administra los usuarios del sistema</p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuarios..."
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Creación</TableHead>
                                    <TableHead className="w-[70px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No se encontraron usuarios
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.isActive ? 'default' : 'secondary'} className={user.isActive ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground'}>
                                                    {user.isActive ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{user.createdAt}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                                                            {user.isActive ? (
                                                                <>
                                                                    <UserX className="h-4 w-4 mr-2" />
                                                                    Desactivar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                                    Activar
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                                            <RotateCcw className="h-4 w-4 mr-2" />
                                                            Reset Password
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteDialog(user)}
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

            {/* Create/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Modifica los datos del usuario' : 'Ingresa los datos del nuevo usuario'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>

                        {!editingUser && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select value={selectedRole} onValueChange={(value) => setValue('role', value as AppRole)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar Usuario</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar a <strong>{deletingUser?.name}</strong>? Esta acción no se puede deshacer.
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
