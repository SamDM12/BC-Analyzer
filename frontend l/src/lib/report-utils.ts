import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export async function generatePDFReport(reportData: Record<string, any>, selectedMetrics: string[]) {
    const doc = new jsPDF();
    const title = "Reporte de Métricas";
    const date = new Date().toLocaleString();

    // Título general
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generado: ${date}`, 14, 28);

    let y = 40;

    // Recorremos las métricas seleccionadas
    for (const metricId of selectedMetrics) {
        doc.setFontSize(14);
        doc.text(getMetricLabel(metricId), 14, y);
        y += 6;

        const dataSection = getSectionForMetric(reportData, metricId);

        if (Array.isArray(dataSection)) {
            // Si la sección es un arreglo de objetos (por ejemplo, distribuciones)
            const keys = Object.keys(dataSection[0] || {});
            const table = dataSection.map((row) => keys.map((k) => String(row[k])));
            autoTable(doc, {
                startY: y,
                head: [keys],
                body: table,
                theme: "striped",
                styles: { fontSize: 8 },
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        } else if (typeof dataSection === "object" && dataSection && Object.keys(dataSection).length > 0) {
            // KPIs generales o insights
            const rows = Object.entries(dataSection).map(([k, v]) => [k, String(v)]);
            autoTable(doc, {
                startY: y,
                head: [[
                    { content: "Métrica", styles: { halign: "left", cellPadding: 4 } },
                    { content: "Valor",   styles: { halign: "right", cellPadding: 4 } }
                ]],
                body: rows,
                theme: "plain",
                styles: { fontSize: 10, cellPadding: 4 },
                columnStyles: {
                    0: { cellWidth: 110, halign: "left" },   // ancho/alineación para "Métrica"
                    1: { cellWidth: 60,  halign: "right" }   // ancho/alineación para "Valor"
                },
                headStyles: { fillColor: [245, 245, 245], textColor: 20, fontStyle: "bold" }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        }

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    }

    doc.save(`reporte-metricas-${Date.now()}.pdf`);
}

export async function generateExcelReport(reportData: Record<string, any>, selectedMetrics: string[]) {
    const wb = XLSX.utils.book_new();

    for (const metricId of selectedMetrics) {
        const dataSection = getSectionForMetric(reportData, metricId);
        const sheetName = getMetricLabel(metricId).substring(0, 30);

        let ws;
        if (Array.isArray(dataSection)) {
            ws = XLSX.utils.json_to_sheet(dataSection);
        } else if (typeof dataSection === "object" && dataSection) {
            const rows = Object.entries(dataSection).map(([k, v]) => ({ Métrica: k, Valor: v }));
            ws = XLSX.utils.json_to_sheet(rows);
        } else {
            ws = XLSX.utils.aoa_to_sheet([["Sin datos disponibles"]]);
        }

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, `reporte-metricas-${Date.now()}.xlsx`);
}

// Helpers
function getMetricLabel(id: string) {
    const labels: Record<string, string> = {
        conversionRate: "Tasa de Conversión",
        totalClients: "Total de Contactos",
        totalConversions: "Conversiones Exitosas",
        avgDuration: "Duración Media de Llamadas",
        avgBalance: "Balance Promedio",
        avgCampaign: "Campañas Promedio",
        avgPrevious: "Contactos Previos Promedio",
        monthTrend: "Tendencia de Conversión Mensual",
        contactDistribution: "Distribución por Canal de Contacto",
        educationDistribution: "Distribución por Educación",
        jobConversion: "Conversión por Ocupación",
        monthlyContacts: "Volumen de Contactos por Mes",
        insights: "Insights Clave",
    };
    return labels[id] || id;
}

function getSectionForMetric(reportData: Record<string, any>, metricId: string) {
    switch (metricId) {
        case "conversionRate":
        case "totalClients":
        case "totalConversions":
        case "avgDuration":
        case "avgBalance":
        case "avgCampaign":
        case "avgPrevious":
            return { [metricId]: reportData.general[metricId] };

        case "monthTrend":
        case "monthlyContacts":
            return reportData.monthly;

        case "contactDistribution":
            return reportData.channel;

        case "educationDistribution":
            return reportData.education;

        case "jobConversion":
            return reportData.occupation;

        case "insights":
            return reportData.insights;

        default:
            return null;
    }
}