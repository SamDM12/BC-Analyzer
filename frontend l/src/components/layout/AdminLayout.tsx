import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Shield, KeyRound, BarChart3, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavigation = [
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: Shield },
];

export function AdminLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50 shadow-md">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/upload"
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Volver al Dashboard</span>
                            </Link>
                            <div className="h-6 w-px bg-border" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
                                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">Panel Admin</h1>
                                    <p className="text-xs text-muted-foreground">Gestión de Usuarios y Roles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-[calc(100vh-4rem)] bg-card border-r border-border p-4 hidden md:block">
                    <nav className="space-y-2">
                        {adminNavigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-base",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Mobile Navigation */}
                <div className="md:hidden border-b border-border w-full bg-card sticky top-16 z-40">
                    <div className="flex gap-1 p-2 overflow-x-auto">
                        {adminNavigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-base",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
