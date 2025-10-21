import { Link, useLocation } from "react-router-dom";
import { BarChart3, Upload, Database, PieChart, FileText, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Cargar Datos", href: "/upload", icon: Upload },
  { name: "Explorar", href: "/data-view", icon: Database },
  { name: "Métricas", href: "/metrics", icon: PieChart },
  { name: "Reportes", href: "/report", icon: FileText },
  { name: "Historial", href: "/history", icon: History },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BC Analyzer</h1>
              <p className="text-xs text-muted-foreground">Dashboard Analítico</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-base",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <BarChart3 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-border md:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-base",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
