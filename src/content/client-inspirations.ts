export type ClienteInspirationType =
  | "dolor"
  | "objecion"
  | "error"
  | "pregunta-frecuente"
  | "comentario"
  | "ventas-soporte";

export type ClienteInspiration = {
  id: string;
  type: ClienteInspirationType;
  text: string;
  context?: string;
};

export const CLIENTE_INSPIRATION_TYPE_LABELS: Record<ClienteInspirationType, string> = {
  dolor: "Dolor",
  objecion: "Objeción",
  error: "Error",
  "pregunta-frecuente": "Pregunta frecuente",
  comentario: "Comentario",
  "ventas-soporte": "Ventas y soporte",
};

export const clientInspirations: ClienteInspiration[] = [];
