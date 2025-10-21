import { useState } from "react";
import { Download, Filter, Save, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Datos de ejemplo
const mockData = [
  { id: 1, age: 56, job: "housemaid", marital: "married", education: "basic.4y", contact: "telephone", month: "may", y: "no" },
  { id: 2, age: 57, job: "services", marital: "married", education: "high.school", contact: "telephone", month: "may", y: "no" },
  { id: 3, age: 37, job: "services", marital: "married", education: "high.school", contact: "telephone", month: "may", y: "yes" },
  { id: 4, age: 40, job: "admin.", marital: "married", education: "basic.6y", contact: "telephone", month: "may", y: "no" },
  { id: 5, age: 56, job: "services", marital: "married", education: "high.school", contact: "telephone", month: "may", y: "no" },
  { id: 6, age: 45, job: "services", marital: "married", education: "basic.9y", contact: "telephone", month: "may", y: "no" },
  { id: 7, age: 59, job: "admin.", marital: "married", education: "professional.course", contact: "telephone", month: "may", y: "no" },
  { id: 8, age: 41, job: "blue-collar", marital: "married", education: "unknown", contact: "telephone", month: "may", y: "no" },
];

export default function DataView() {
  const [data] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    ageMin: "",
    ageMax: "",
    job: "all",
    education: "all",
    contact: "all",
    y: "all",
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleApplyFilters = () => {
    toast.success("Filtros aplicados correctamente");
  };

  const handleSaveFilter = () => {
    toast.success("Filtro guardado exitosamente");
  };

  const handleExport = (format: "csv" | "excel") => {
    toast.success(`Exportando datos en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar de Filtros */}
        <aside className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="sticky top-0 bg-card p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Filtros Interactivos</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Edad */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Edad</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={selectedFilters.ageMin}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, ageMin: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={selectedFilters.ageMax}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, ageMax: e.target.value })}
                />
              </div>
            </div>

            {/* Ocupación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Ocupación</label>
              <Select value={selectedFilters.job} onValueChange={(value) => setSelectedFilters({ ...selectedFilters, job: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="admin.">Administrativo</SelectItem>
                  <SelectItem value="blue-collar">Operario</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="housemaid">Empleada doméstica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Educación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Educación</label>
              <Select value={selectedFilters.education} onValueChange={(value) => setSelectedFilters({ ...selectedFilters, education: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="basic.4y">Básica 4 años</SelectItem>
                  <SelectItem value="basic.6y">Básica 6 años</SelectItem>
                  <SelectItem value="basic.9y">Básica 9 años</SelectItem>
                  <SelectItem value="high.school">Secundaria</SelectItem>
                  <SelectItem value="professional.course">Profesional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Canal de Contacto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Canal de Contacto</label>
              <Select value={selectedFilters.contact} onValueChange={(value) => setSelectedFilters({ ...selectedFilters, contact: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="telephone">Teléfono</SelectItem>
                  <SelectItem value="cellular">Celular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Variable Objetivo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">¿Suscribió?</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all" checked={selectedFilters.y === "all"} onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: "all" })} />
                  <label htmlFor="all" className="text-sm text-foreground">Todos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="yes" checked={selectedFilters.y === "yes"} onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: "yes" })} />
                  <label htmlFor="yes" className="text-sm text-foreground">Sí</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="no" checked={selectedFilters.y === "no"} onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: "no" })} />
                  <label htmlFor="no" className="text-sm text-foreground">No</label>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Button onClick={handleApplyFilters} className="w-full" size="lg">
                Aplicar Filtros
              </Button>
              <Button onClick={handleSaveFilter} variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Filtro
              </Button>
              <Button variant="outline" className="w-full">
                <FolderOpen className="mr-2 h-4 w-4" />
                Cargar Filtro
              </Button>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Explorador de Datos</h1>
              <p className="text-muted-foreground">41,188 registros totales</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleExport("csv")} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
              <Button onClick={() => handleExport("excel")} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Ocupación</TableHead>
                    <TableHead>Estado Civil</TableHead>
                    <TableHead>Educación</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Mes</TableHead>
                    <TableHead>Suscribió</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.job}</TableCell>
                      <TableCell>{row.marital}</TableCell>
                      <TableCell>{row.education}</TableCell>
                      <TableCell>{row.contact}</TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          row.y === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {row.y === "yes" ? "Sí" : "No"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, data.length)} de {data.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
