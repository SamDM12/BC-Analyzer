export interface FilterParams {
  ageMin?: number;
  ageMax?: number;
  job?: string;
  education?: string;
  contact?: string;
  y?: "yes" | "no";
  [key: string]: any; // para cualquier otro filtro adicional
}

export const generateSummary = (filters: FilterParams): string => {
  const parts: string[] = [];

  // Edad
  if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
    parts.push(`personas entre ${filters.ageMin} y ${filters.ageMax} años`);
  } else if (filters.ageMin !== undefined) {
    parts.push(`personas mayores de ${filters.ageMin} años`);
  } else if (filters.ageMax !== undefined) {
    parts.push(`personas menores de ${filters.ageMax} años`);
  }

  // Ocupación
  if (filters.job) {
    parts.push(`con ocupación "${filters.job}"`);
  }

  // Educación
  if (filters.education) {
    parts.push(`con nivel educativo "${filters.education}"`);
  }

  // Canal de contacto
  if (filters.contact) {
    parts.push(`contactadas por ${filters.contact.toLowerCase()}`);
  }

  // Resultado (y)
  if (filters.y === "yes") {
    parts.push("que se suscribieron");
  } else if (filters.y === "no") {
    parts.push("que no se suscribieron");
  }

  // Resultado final
  if (parts.length === 0) return "Sin filtros aplicados";

  const summary =
    parts.length === 1
      ? parts[0]
      : parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1];

  // Primera letra en mayúscula y punto final
  return summary.charAt(0).toUpperCase() + summary.slice(1) + ".";
};