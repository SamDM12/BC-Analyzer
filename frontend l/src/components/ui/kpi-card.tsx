import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function KpiCard({ title, value, icon: Icon, trend, variant = "default", className }: KpiCardProps) {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/20 bg-primary/5",
    secondary: "border-secondary/20 bg-secondary/5",
  };

  const iconBgStyles = {
    default: "bg-muted",
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
  };

  const iconColorStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  return (
    <Card className={cn("p-6 transition-smooth hover:shadow-lg", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={cn("rounded-xl p-3", iconBgStyles[variant])}>
          <Icon className={cn("h-6 w-6", iconColorStyles[variant])} />
        </div>
      </div>
    </Card>
  );
}
