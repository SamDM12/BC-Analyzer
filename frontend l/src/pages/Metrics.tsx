import { useState, useEffect } from "react";
import { TrendingUp, Users, Phone, Clock, RefreshCw } from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { 
  getAllKPIs, 
  getGeneralMetrics,
  getMonthDistribution,
  getContactDistribution,
  getEducationDistribution,
  getJobDistribution,
  type KPIMetrics 
} from "@/lib/api";

const COLORS = ["hsl(174, 62%, 55%)", "hsl(27, 89%, 66%)", "hsl(215, 25%, 47%)", "hsl(142, 71%, 45%)", "hsl(280, 65%, 60%)", "hsl(45, 93%, 58%)"];

export default function Metrics() {
  const [loading, setLoading] = useState(true);
  const [generalMetrics, setGeneralMetrics] = useState<KPIMetrics | null>(null);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [jobData, setJobData] = useState<any[]>([]);

  useEffect(() => {
    loadAllMetrics();
  }, []);

  const loadAllMetrics = async () => {
    setLoading(true);
    try {
      // Cargar todas las métricas en paralelo
      const [general, months, contacts, education, jobs] = await Promise.all([
        getGeneralMetrics(),
        getMonthDistribution(),
        getContactDistribution(),
        getEducationDistribution(),
        getJobDistribution(),
      ]);

      setGeneralMetrics(general.data);
      
      // Transformar datos para los gráficos
      setMonthData(months.data.map((m: any) => ({
        month: m.month.charAt(0).toUpperCase() + m.month.slice(1),
        conversion: m.conversionRate,
        count: m.count
      })));

      setContactData(contacts.data.map((c: any) => ({
        channel: c.channel,
        count: c.count,
        conversionRate: c.conversionRate
      })));

      setEducationData(education.data.map((e: any) => ({
        name: e.education,
        value: e.count,
        percent: (e.count / general.data.totalClients * 100).toFixed(1)
      })));

      setJobData(jobs.data.slice(0, 8).map((j: any) => ({
        job: j.job,
        rate: j.conversionRate
      })));

      toast.success("Métricas cargadas exitosamente");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al cargar métricas");
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAllMetrics();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (!generalMetrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">No hay datos disponibles</p>
          <Button onClick={handleRefresh}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de KPIs</h1>
            <p className="mt-2 text-muted-foreground">
              Métricas clave y visualizaciones de las campañas bancarias
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Tasa de Conversión"
            value={`${generalMetrics.conversionRate}%`}
            icon={TrendingUp}
            variant="primary"
          />
          <KpiCard
            title="Total Contactos"
            value={generalMetrics.totalClients.toLocaleString()}
            icon={Users}
            variant="default"
          />
          <KpiCard
            title="Conversiones Exitosas"
            value={generalMetrics.totalConversions.toLocaleString()}
            icon={Phone}
            variant="secondary"
          />
          <KpiCard
            title="Duración Media"
            value={`${generalMetrics.avgDuration}s`}
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Métricas adicionales */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Balance Promedio</p>
                <p className="text-3xl font-bold text-foreground">
                  ${generalMetrics.avgBalance.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Campañas Promedio</p>
                <p className="text-3xl font-bold text-foreground">
                  {generalMetrics.avgCampaign.toFixed(1)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Contactos Previos Promedio</p>
                <p className="text-3xl font-bold text-foreground">
                  {generalMetrics.avgPrevious.toFixed(1)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tendencia de Conversión Mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Conversión Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [`${value}%`, 'Conversión']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Conversión (%)"
                    dot={{ fill: 'hsl(var(--primary))' }}
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
                  <XAxis 
                    dataKey="channel" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--secondary))" 
                    name="Contactos"
                    radius={[8, 8, 0, 0]}
                  />
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
                    data={educationData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percent}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {educationData.slice(0, 6).map((entry, index) => (
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
              <CardTitle>Tasa de Conversión por Ocupación (Top 8)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="job" 
                    stroke="hsl(var(--muted-foreground))"
                    width={100}
                    style={{ fontSize: '11px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [`${value}%`, 'Conversión']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="rate" 
                    fill="hsl(var(--primary))" 
                    name="Conversión (%)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Contactos por Mes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Volumen de Contactos por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(174, 62%, 55%)" 
                    name="Número de Contactos"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Insights Clave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm font-medium text-primary mb-2">📊 Total de Llamadas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(generalMetrics.totalDuration / 60).toLocaleString()} minutos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tiempo total invertido en campañas
                  </p>
                </div>
                
                <div className="rounded-lg bg-secondary/10 p-4">
                  <p className="text-sm font-medium text-secondary mb-2">🎯 Mejor Canal</p>
                  <p className="text-2xl font-bold text-foreground">
                    {contactData.length > 0 && contactData.reduce((prev, curr) => 
                      prev.conversionRate > curr.conversionRate ? prev : curr
                    ).channel}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mayor tasa de conversión
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
                  <p className="text-sm font-medium text-green-600 mb-2">💰 Balance Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(generalMetrics.avgBalance * generalMetrics.totalClients / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Balance acumulado de clientes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}