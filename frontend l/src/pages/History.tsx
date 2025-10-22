import { useEffect, useState } from "react";
import { Clock, Filter, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Query {
  id: number;
  date: string;
  time: string;
  filters: {
    age?: string;
    job?: string;
    education?: string;
    contact?: string;
  };
  results: number;
  summary: string;
}

function generateSummary(filters) {
  const parts = [];

  // Edad
  if (filters.ageMin && filters.ageMax)
    parts.push(`personas entre ${filters.ageMin} y ${filters.ageMax} años`);
  else if (filters.ageMin)
    parts.push(`personas mayores de ${filters.ageMin} años`);
  else if (filters.ageMax)
    parts.push(`personas menores de ${filters.ageMax} años`);

  // Ocupación
  if (filters.job)
    parts.push(`con ocupación "${filters.job}"`);

  // Educación
  if (filters.education)
    parts.push(`con nivel educativo "${filters.education}"`);

  // Canal de contacto
  if (filters.contact)
    parts.push(`contactadas por ${filters.contact.toLowerCase()}`);

  // Resultado (y)
  if (filters.y === "yes")
    parts.push("que se suscribieron");
  else if (filters.y === "no")
    parts.push("que no se suscribieron");

  // Resultado final
  if (parts.length === 0) return "Sin filtros aplicados";

  const summary =
    parts.length === 1
      ? parts[0]
      : parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1];

  return summary.charAt(0).toUpperCase() + summary.slice(1) + ".";
}

export default function History() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
  const savedFilters = JSON.parse(localStorage.getItem('historyQueries') || '[]');
  // Adaptamos el formato a tu interfaz Query
  const formatted = savedFilters.map((f: any) => ({
    id: f.id,
    date: new Date(f.date).toISOString().split('T')[0],
    time: new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    filters: f.filters,
    results: f.results,
    summary: generateSummary(f.filters),
  }));
  setQueries(formatted);
  }, []);

  const handleViewDetails = (query: Query) => {
    setSelectedQuery(query);
    setIsDialogOpen(true);
  };

  const handleReplicateQuery = (query: Query) => {
  toast.success("Replicando consulta...");
  localStorage.setItem('replicatedFilter', JSON.stringify(query.filters));
  setTimeout(() => {
    navigate("/data-view");
  }, 1000);
};

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Historial de Consultas</h1>
          <p className="mt-2 text-muted-foreground">
            Revisa y replica tus consultas anteriores
          </p>
        </div>

        {queries.length > 0 ? (
          <div className="space-y-4">
            {queries.map((query) => (
              <Card key={query.id} className="overflow-hidden transition-smooth hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{query.date}</span>
                          <span>•</span>
                          <span>{query.time}</span>
                        </div>
                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {query.summary}
                      </h3>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {Object.entries(query.filters).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            <Filter className="h-3 w-3" />
                            {key}: {value}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{query.results.toLocaleString()}</span> resultados encontrados
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <Button
                      onClick={() => handleViewDetails(query)}
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => handleReplicateQuery(query)}
                      variant="default"
                      size="sm"
                    >
                      Replicar Consulta
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No hay consultas realizadas anteriormente
            </h3>
            <p className="text-sm text-muted-foreground">
              Las consultas que realices aparecerán aquí
            </p>
          </Card>
        )}

        {/* Dialog de Detalles */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles de la Consulta</DialogTitle>
            </DialogHeader>

            {selectedQuery && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedQuery.date} a las {selectedQuery.time}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resumen</p>
                  <p className="text-foreground">{selectedQuery.summary}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Filtros Aplicados</p>
                  <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                    {Object.entries(selectedQuery.filters).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium capitalize text-foreground">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resultados</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedQuery.results.toLocaleString()}
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleReplicateQuery(selectedQuery);
                  }}
                  className="w-full"
                >
                  Replicar Esta Consulta
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
