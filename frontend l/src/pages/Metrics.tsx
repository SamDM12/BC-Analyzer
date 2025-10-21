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
import axios from "axios";
import { useEffect, useState } from "react";

// URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COLORS = ["hsl(174, 62%, 55%)", "hsl(27, 89%, 66%)", "hsl(215, 25%, 47%)", "hsl(142, 71%, 45%)"];

export default function Metrics() {
  // Estados para guardar los datos que vienen del backend
  const [conversionData, setConversionData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [jobConversion, setJobConversion] = useState([]);
  const [generalMetrics, setGeneralMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardKPIs, setDashboardKPIs] = useState({
    conversionRate: 0,
    totalContacts: 0,
    successfulCalls: 0,
    avgDuration: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Pedimos los datos a los endpoints del backend
        const [
          conversionRes,
          contactRes,
          educationRes,
          jobRes,
          generalRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/kpis/month`),
          axios.get(`${API_BASE_URL}/kpis/contact`),
          axios.get(`${API_BASE_URL}/kpis/education`),
          axios.get(`${API_BASE_URL}/kpis/job`),
          axios.get(`${API_BASE_URL}/kpis/general`),
        ]);

        // Guardamos en estado - extraemos el array de la propiedad 'data'
        setConversionData(conversionRes.data.data || []);
        setContactData(contactRes.data.data || []);
        setEducationData(educationRes.data.data || []);
        setJobConversion(jobRes.data.data || []);
        setGeneralMetrics(generalRes.data.data || null);
        // Guardamos en estado los KPI cards
        if (generalRes.data && generalRes.data.data) {
          const metrics = generalRes.data.data;
          setDashboardKPIs({
            conversionRate: metrics.conversionRate,
            totalContacts: metrics.totalClients,
            successfulCalls: metrics.totalConversions,
            avgDuration: metrics.avgDuration
          });
        }
        setError(null);
      } catch (error) {
        console.error("Error cargando métricas:", error);
        setError("Error al cargar los datos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard de KPIs</h1>
            <p className="mt-2 text-muted-foreground">
              Métricas clave y visualizaciones de las campañas bancarias
            </p>
          </div>

          {/* Mostrar loading o error */}
          {loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando datos...</p>
              </div>
          )}

          {error && (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
          )}

          {!loading && !error && (
              <>
                {/* KPI Cards */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard
                      title="Tasa de Conversión"
                      value={`${dashboardKPIs.conversionRate.toFixed(2)}%`}
                      icon={TrendingUp}
                      //trend={{ value: 2.3, label: "vs mes anterior" }}
                      variant="primary"
                  />
                  <KpiCard
                      title="Total Contactos"
                      value={dashboardKPIs.totalContacts.toLocaleString()}
                      icon={Users}
                      //trend={{ value: -1.2, label: "vs mes anterior" }}
                      variant="default"
                  />
                  <KpiCard
                      title="Llamadas Exitosas"
                      value={dashboardKPIs.successfulCalls.toLocaleString()}
                      icon={Phone}
                      //trend={{ value: 5.8, label: "vs mes anterior" }}
                      variant="secondary"
                  />
                  <KpiCard
                      title="Duración Media"
                      value={`${dashboardKPIs.avgDuration.toFixed(0)}s`}
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
                        <BarChart data={contactData.filter(item => item.channel !== 'unknown')}>
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
              </>
          )}
        </div>
      </div>
  );
}