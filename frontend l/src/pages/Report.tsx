import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const availableMetrics = [
  { id: "conversion", label: "Tasa de Conversión" },
  { id: "contacts", label: "Número de Contactos" },
  { id: "distribution", label: "Distribución de Clientes" },
  { id: "duration", label: "Duración Media de Llamadas" },
  { id: "channel", label: "Análisis por Canal" },
  { id: "occupation", label: "Conversión por Ocupación" },
  { id: "education", label: "Distribución por Educación" },
  { id: "monthly", label: "Tendencia Mensual" },
];

export default function Report() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [generating, setGenerating] = useState(false);

  const handleToggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMetrics.length === availableMetrics.length) {
      setSelectedMetrics([]);
    } else {
      setSelectedMetrics(availableMetrics.map((m) => m.id));
    }
  };

  const handleGenerateReport = async () => {
    if (selectedMetrics.length === 0) {
      toast.error("Selecciona al menos un KPI para generar el reporte");
      return;
    }

    setGenerating(true);
    
    try {
      // Simulación de generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Reporte ${format.toUpperCase()} generado y descargado exitosamente`);
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Generador de Reportes</h1>
          <p className="mt-2 text-muted-foreground">
            Selecciona los KPIs y el formato para tu reporte personalizado
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Panel de Selección */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">KPIs y Gráficos Disponibles</h2>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedMetrics.length === availableMetrics.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                </Button>
              </div>

              <div className="space-y-4">
                {availableMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 transition-smooth hover:bg-muted/50"
                  >
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => handleToggleMetric(metric.id)}
                    />
                    <label
                      htmlFor={metric.id}
                      className="flex-1 cursor-pointer text-sm font-medium text-foreground"
                    >
                      {metric.label}
                    </label>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Panel de Configuración */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Configuración</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Formato de Salida
                  </label>
                  <Select value={format} onValueChange={(value: "pdf" | "excel") => setFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-foreground">Vista Previa</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selectedMetrics.length > 0
                      ? `${selectedMetrics.length} elemento${selectedMetrics.length > 1 ? "s" : ""} seleccionado${selectedMetrics.length > 1 ? "s" : ""}`
                      : "No hay elementos seleccionados"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Elementos Seleccionados</h2>
              
              {selectedMetrics.length > 0 ? (
                <ul className="space-y-2">
                  {selectedMetrics.map((id) => {
                    const metric = availableMetrics.find((m) => m.id === id);
                    return (
                      <li key={id} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {metric?.label}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selecciona elementos para generar el reporte
                </p>
              )}
            </Card>

            <Button
              onClick={handleGenerateReport}
              disabled={generating || selectedMetrics.length === 0}
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {generating ? "Generando..." : "Generar Reporte"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
