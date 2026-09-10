export type Angle = {
  id: string;
  label: string;
  summary: string;
};

export const angles: Angle[] = [
  {
    id: "dolor",
    label: "Dolor",
    summary:
      "Mostrás el problema que ya sienten. Genera identificación rápida y frena el scroll.",
  },
  {
    id: "error",
    label: "Error",
    summary:
      "Señalás un error común que les cuesta plata, tiempo o tranquilidad sin que lo vean.",
  },
  {
    id: "oportunidad",
    label: "Oportunidad",
    summary:
      "Mostrás algo concreto que podrían ganar si cambian cómo operan hoy.",
  },
  {
    id: "comparacion",
    label: "Comparación",
    summary:
      "Antes vs después, manual vs automático, caos vs orden. El contraste hace el trabajo.",
  },
  {
    id: "polemico",
    label: "Polémico",
    summary:
      "Cuestionás una creencia que todos dan por sentada. Funciona si tenés argumento.",
  },
  {
    id: "storytelling",
    label: "Storytelling",
    summary:
      "Contás una situación real con inicio, tensión y giro. Menos pitch, más escena.",
  },
  {
    id: "educativo",
    label: "Educativo",
    summary:
      "Enseñás algo práctico que el público puede aplicar sin conocer Mercantis todavía.",
  },
  {
    id: "aspiracional",
    label: "Aspiracional",
    summary:
      "Mostrás la versión del negocio que quieren llegar a ser. El deseo hace el resto.",
  },
];

const angleById = new Map(angles.map((angle) => [angle.id, angle]));

export function getAngleLabel(id: string): string {
  return angleById.get(id)?.label ?? id;
}
