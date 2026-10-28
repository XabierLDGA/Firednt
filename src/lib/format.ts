const dateFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });

// "28 oct 2026"
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
