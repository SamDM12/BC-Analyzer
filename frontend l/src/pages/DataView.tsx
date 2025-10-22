import { useState, useEffect } from "react";
import { Download, Filter, Save, FolderOpen, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { generateSummary } from "@/utils/filterUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getData, getFilterOptions, type ClienteData, type FilterParams } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DataView() {
  const [data, setData] = useState<ClienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [savedFiltersList, setSavedFiltersList] = useState<any[]>([]);
  const itemsPerPage = 50;

  // Filtros
  const [selectedFilters, setSelectedFilters] = useState<FilterParams>({
    ageMin: undefined,
    ageMax: undefined,
    job: undefined,
    education: undefined,
    contact: undefined,
    y: undefined,
    page: 1,
    limit: itemsPerPage,
    sortBy: 'age',
    sortOrder: 'asc'
  });

  // Opciones de filtros (valores únicos del backend)
  const [jobOptions, setJobOptions] = useState<string[]>([]);
  const [educationOptions, setEducationOptions] = useState<string[]>([]);
  const [contactOptions, setContactOptions] = useState<string[]>([]);

  useEffect(() => {
    const replicated = localStorage.getItem('replicatedFilter');
    if (replicated) {
      try {
        const parsed = JSON.parse(replicated);
        setSelectedFilters((prev) => ({
          ...prev,
          ...parsed,
          page: 1
        }));
        toast.success("Filtro replicado desde historial");
        localStorage.removeItem('replicatedFilter');
      } catch {
        console.error("Error al cargar filtro replicado");
      }
    }
  }, []);

  // Cargar opciones de filtros al montar
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Cargar datos cuando cambien los filtros o la página
  useEffect(() => {
    loadData();
  }, [selectedFilters, currentPage]);

  const loadFilterOptions = async () => {
    try {
      const [jobs, education, contact] = await Promise.all([
        getFilterOptions('job'),
        getFilterOptions('education'),
        getFilterOptions('contact'),
      ]);
      
      setJobOptions(jobs.data.values);
      setEducationOptions(education.data.values);
      setContactOptions(contact.data.values);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        ...selectedFilters,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await getData(params);
      
      setData(response.data.registros);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPaginas);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al cargar datos");
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
  setCurrentPage(1);
  await loadData();
  toast.success("Filtros aplicados correctamente");

  try {
    const history = JSON.parse(localStorage.getItem("historyQueries") || "[]");

    const newEntry = {
      id: Date.now(),
      filters: selectedFilters,
      date: new Date().toISOString(),
      results: total,
    };

    history.push(newEntry);
    localStorage.setItem("historyQueries", JSON.stringify(history));
  } catch (error) {
    console.error("Error al guardar en historial:", error);
  }
};

  const handleClearFilters = () => {
    setSelectedFilters({
      ageMin: undefined,
      ageMax: undefined,
      job: undefined,
      education: undefined,
      contact: undefined,
      y: undefined,
      page: 1,
      limit: itemsPerPage,
      sortBy: 'age',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
    toast.success("Filtros limpiados");
  };

  const loadSavedFilters = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      setSavedFiltersList(saved);
      setIsLoadDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar filtros guardados:', error);
      toast.error('No se pudieron cargar los filtros guardados');
    }
  };

  const handleLoadFilter = (filters: FilterParams) => {
    setSelectedFilters({ ...selectedFilters, ...filters, page: 1 });
    setIsLoadDialogOpen(false);
    toast.success("Filtro cargado correctamente");
  };


  const handleSaveFilter = () => {
    try {
      const savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '[]');

      const exists = savedFilters.some(
        (f) => JSON.stringify(f.filters) === JSON.stringify(selectedFilters)
      );

      if (exists) {
        toast.info("Este filtro ya está guardado en tus filtros favoritos");
        return;
      }

      const newFilter = {
        id: Date.now(),
        name: `Filtro ${savedFilters.length + 1}`,
        filters: selectedFilters,
        date: new Date().toISOString(),
        results: total,
      };

      savedFilters.push(newFilter);
      localStorage.setItem('savedFilters', JSON.stringify(savedFilters));

      toast.success("Filtro guardado en tus favoritos");
    } catch (error) {
      console.error("Error al guardar filtro:", error);
      toast.error("No se pudo guardar el filtro");
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      // Por ahora solo descarga los datos actuales
      // TODO: Implementar exportación real desde el backend
      const dataStr = format === 'csv' 
        ? convertToCSV(data)
        : JSON.stringify(data, null, 2);
      
      const blob = new Blob([dataStr], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `datos-${new Date().toISOString()}.${format}`;
      link.click();
      
      toast.success(`Datos exportados en formato ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Error al exportar datos");
    }
  };

  const convertToCSV = (data: ClienteData[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).filter(key => key !== '_id').join(',');
    const rows = data.map(row => 
      Object.entries(row)
        .filter(([key]) => key !== '_id')
        .map(([, value]) => value)
        .join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const handleSort = (field: string) => {
    const newOrder = selectedFilters.sortBy === field && selectedFilters.sortOrder === 'asc' 
      ? 'desc' 
      : 'asc';
    
    setSelectedFilters({
      ...selectedFilters,
      sortBy: field,
      sortOrder: newOrder as 'asc' | 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar de Filtros */}
        <aside className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="sticky top-0 bg-card p-6 border-b border-border z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Filtros Interactivos</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4" />
              </Button>
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
                  value={selectedFilters.ageMin || ''}
                  onChange={(e) => setSelectedFilters({ 
                    ...selectedFilters, 
                    ageMin: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={selectedFilters.ageMax || ''}
                  onChange={(e) => setSelectedFilters({ 
                    ...selectedFilters, 
                    ageMax: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>

            {/* Ocupación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Ocupación</label>
              <Select 
                value={selectedFilters.job || 'all'} 
                onValueChange={(value) => setSelectedFilters({ 
                  ...selectedFilters, 
                  job: value === 'all' ? undefined : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {jobOptions.map(job => (
                    <SelectItem key={job} value={job}>{job}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Educación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Educación</label>
              <Select 
                value={selectedFilters.education || 'all'} 
                onValueChange={(value) => setSelectedFilters({ 
                  ...selectedFilters, 
                  education: value === 'all' ? undefined : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {educationOptions.map(edu => (
                    <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Canal de Contacto */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Canal de Contacto</label>
              <Select 
                value={selectedFilters.contact || 'all'} 
                onValueChange={(value) => setSelectedFilters({ 
                  ...selectedFilters, 
                  contact: value === 'all' ? undefined : value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {contactOptions.map(contact => (
                    <SelectItem key={contact} value={contact}>{contact}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Variable Objetivo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">¿Suscribió?</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="all" 
                    checked={!selectedFilters.y} 
                    onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: undefined })} 
                  />
                  <label htmlFor="all" className="text-sm text-foreground">Todos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="yes" 
                    checked={selectedFilters.y === 'yes'} 
                    onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: 'yes' })} 
                  />
                  <label htmlFor="yes" className="text-sm text-foreground">Sí</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="no" 
                    checked={selectedFilters.y === 'no'} 
                    onCheckedChange={() => setSelectedFilters({ ...selectedFilters, y: 'no' })} 
                  />
                  <label htmlFor="no" className="text-sm text-foreground">No</label>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Button onClick={handleApplyFilters} className="w-full" size="lg" disabled={loading}>
                {loading ? "Aplicando..." : "Aplicar Filtros"}
              </Button>
              <Button onClick={handleSaveFilter} variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Guardar Filtro
              </Button>
              <Button variant="outline" className="w-full" onClick={loadSavedFilters}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Cargar Filtro
              </Button>
            </div>
          </div>
        </aside>
        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filtros Guardados</DialogTitle>
            </DialogHeader>

            {savedFiltersList.length > 0 ? (
              <div className="space-y-3">
                {savedFiltersList.map((f) => (
                  <Card
                    key={f.id}
                    className="p-4 hover:bg-muted/50 transition cursor-pointer"
                    onClick={() => handleLoadFilter(f.filters)}
                  >
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(f.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {generateSummary(f.filters)}
                    </p>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {f.results?.toLocaleString() ?? 0} resultados
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay filtros guardados.
              </p>
            )}
          </DialogContent>
        </Dialog>

        {/* Contenido Principal */}
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Explorador de Datos</h1>
              <p className="text-muted-foreground">{total.toLocaleString()} registros totales</p>
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
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('age')}
                    >
                      Edad {selectedFilters.sortBy === 'age' && (selectedFilters.sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('job')}
                    >
                      Ocupación {selectedFilters.sortBy === 'job' && (selectedFilters.sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Estado Civil</TableHead>
                    <TableHead>Educación</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('balance')}
                    >
                      Balance {selectedFilters.sortBy === 'balance' && (selectedFilters.sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Mes</TableHead>
                    <TableHead>Suscribió</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Cargando datos...
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell className="font-medium">{row.age}</TableCell>
                        <TableCell>{row.job}</TableCell>
                        <TableCell>{row.marital}</TableCell>
                        <TableCell>{row.education}</TableCell>
                        <TableCell>${row.balance.toLocaleString()}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} de {total.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
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