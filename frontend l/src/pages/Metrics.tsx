import { TrendingUp, Users, Phone, Clock } from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos de ejemplo
const conversionData = [
  { month: "Ene", conversion: 11.2 },
  { month: "Feb", conversion: 10.8 },
  { month: "Mar", conversion: 12.1 },
  { month: "Abr", conversion: 11.5 },
  { month: "May", conversion: 13.2 },
  { month: "Jun", conversion: 12.8 },
];

const contactData = [
  { channel: "Teléfono", count: 25123 },
  { channel: "Celular", count: 16065 },
];

const educationData = [
  { name: "Básica", value: 15234 },
  { name: "Secundaria", value: 12456 },
  { name: "Universidad", value: 9821 },
  { name: "Profesional", value: 3677 },
];

const jobConversion = [
  { job: "Admin", rate: 14.2 },
  { job: "Operario", rate: 9.8 },
  { job: "Técnico", rate: 12.5 },
  { job: "Servicios", rate: 10.3 },
  { job: "Gerencia", rate: 15.7 },
];

const COLORS = ["hsl(174, 62%, 55%)", "hsl(27, 89%, 66%)", "hsl(215, 25%, 47%)", "hsl(142, 71%, 45%)"];

export default function Metrics() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard de KPIs</h1>
          <p className="mt-2 text-muted-foreground">
            Métricas clave y visualizaciones de las campañas bancarias
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Tasa de Conversión"
            value="11.7%"
            icon={TrendingUp}
            trend={{ value: 2.3, label: "vs mes anterior" }}
            variant="primary"
          />
          <KpiCard
            title="Total Contactos"
            value="41,188"
            icon={Users}
            trend={{ value: -1.2, label: "vs mes anterior" }}
            variant="default"
          />
          <KpiCard
            title="Llamadas Exitosas"
            value="4,814"
            icon={Phone}
            trend={{ value: 5.8, label: "vs mes anterior" }}
            variant="secondary"
          />
          <KpiCard
            title="Duración Media"
            value="258s"
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tendencia de Conversión */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Conversión Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Conversión (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Canales de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Canal de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" name="Contactos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribución por Educación */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Clientes por Educación</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={educationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversión por Ocupación */}
          <Card>
            <CardHeader>
              <CardTitle>Tasa de Conversión por Ocupación</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobConversion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="job" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" name="Conversión (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
