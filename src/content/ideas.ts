export type IdeaStatus = "captura" | "en-copy" | "lista";

export type Idea = {
  id: string;
  sourceId: string;
  signal: string;
  angulo: string;
  publico: string;
  formato: string;
  hook: string;
  status: IdeaStatus;
};

export const ideas: Idea[] = [
  {
    id: "impuesto-del-crecimiento",
    sourceId: "cliente",
    signal: "Vendieron más pero siguen más cansados operando el negocio.",
    angulo: "dolor",
    publico: "dueños de negocio",
    formato: "carrusel",
    hook: "El impuesto del crecimiento",
    status: "en-copy",
  },
  {
    id: "sistema-unico",
    sourceId: "ideacion",
    signal: "Tienen ventas, stock y mensajes repartidos en lugares distintos.",
    angulo: "oportunidad",
    publico: "dueños de negocio",
    formato: "carrusel",
    hook: "Un sistema. Menos trabajo.",
    status: "captura",
  },
];
