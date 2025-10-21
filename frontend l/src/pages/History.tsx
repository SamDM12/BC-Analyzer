import { useState } from "react";
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

const mockQueries: Query[] = [
  {
    id: 1,
    date: "2024-01-15",
    time: "14:30",
    filters: {
      age: "30-45",
      job: "admin.",
      education: "university.degree",
    },
    results: 3245,
    summary: "Clientes administrativos con educación universitaria entre 30 y 45 años",
  },
  {
    id: 2,
    date: "2024-01-14",
    time: "10:15",
    filters: {
      contact: "cellular",
      job: "services",
    },
    results: 5621,
    summary: "Contactos por celular en el sector servicios",
  },
  {
    id: 3,
    date: "2024-01-13",
    time: "16:45",
    filters: {
      age: "50+",
      education: "basic.9y",
    },
    results: 2134,
    summary: "Clientes mayores de 50 años con educación básica",
  },
];

export default function History() {
  const navigate = useNavigate();
  const [queries] = useState<Query[]>(mockQueries);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (query: Query) => {
    setSelectedQuery(query);
    setIsDialogOpen(true);
  };

  const handleReplicateQuery = (query: Query) => {
    toast.success("Replicando consulta...");
    // Aquí se aplicarían los filtros en el estado global o localStorage
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
