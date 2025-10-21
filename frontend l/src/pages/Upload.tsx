import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { uploadData } from "@/lib/api";

interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  errors: string[];
  warnings: string[];
}

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setValidationResult(null);
      toast.success(`Archivo "${uploadedFile.name}" seleccionado`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Llamada REAL a la API
      const result = await uploadData(file);
      
      clearInterval(interval);
      setProgress(100);

      // Mapear respuesta real
      const validationResult: ValidationResult = {
        isValid: result.success,
        totalRows: result.data.reporteCalidad.totalRegistros,
        validRows: result.data.reporteCalidad.registrosValidos,
        errors: result.data.reporteCalidad.errores || [],
        warnings: result.data.reporteCalidad.camposConNulos ? 
          [`Campos con valores nulos: ${Object.keys(result.data.reporteCalidad.camposConNulos).join(', ')}`] : 
          [],
      };

      setValidationResult(validationResult);

      if (validationResult.isValid) {
        toast.success("¡Archivo cargado y validado exitosamente!");
      } else {
        toast.error("El archivo tiene errores críticos de validación");
      }
    } catch (error: any) {
      clearInterval(interval);
      toast.error(error.response?.data?.message || "Error al cargar el archivo. Intente nuevamente.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    navigate("/data-view");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Carga de Datos</h1>
          <p className="mt-2 text-muted-foreground">
            Sube tu archivo CSV o Excel para comenzar el análisis de campañas bancarias
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-6 overflow-hidden">
          <div
            {...getRootProps()}
            className={`cursor-pointer border-2 border-dashed p-12 text-center transition-smooth ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              {file ? (
                <>
                  <FileSpreadsheet className="mb-4 h-16 w-16 text-primary" />
                  <p className="text-lg font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <UploadIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground">
                    {isDragActive ? "Suelta el archivo aquí" : "Arrastra y suelta tu archivo"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    o haz clic para seleccionar
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Formatos soportados: CSV, XLS, XLSX (máx. 50MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {file && !validationResult && (
            <div className="bg-muted/30 p-6">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? "Validando archivo..." : "Cargar y Validar"}
              </Button>
            </div>
          )}

          {uploading && (
            <div className="bg-muted/30 p-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Procesando...</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </Card>

        {/* Validation Results */}
        {validationResult && (
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
              <h2 className="text-xl font-bold text-foreground">Reporte de Calidad de Datos</h2>
            </div>

            <div className="p-6">
              {/* Summary Stats */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Total de Registros</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {validationResult.totalRows.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Registros Válidos</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {validationResult.validRows.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Tasa de Validez</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {((validationResult.validRows / validationResult.totalRows) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">Errores Detectados</h3>
                  </div>
                  <ul className="space-y-2 rounded-lg bg-destructive/5 p-4">
                    {validationResult.errors.map((error, idx) => (
                      <li key={idx} className="text-sm text-destructive">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold text-foreground">Advertencias</h3>
                  </div>
                  <ul className="space-y-2 rounded-lg bg-secondary/5 p-4">
                    {validationResult.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-secondary-foreground">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Indicator */}
              {validationResult.isValid && (
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-600">
                    El archivo pasó las validaciones. Puedes continuar con el análisis.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleContinue}
                  disabled={!validationResult.isValid}
                  className="flex-1"
                  size="lg"
                >
                  Continuar al Explorador de Datos
                </Button>
                <Button
                  onClick={() => {
                    setFile(null);
                    setValidationResult(null);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Cargar Otro Archivo
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
