export type PlanningPillar = {
  id: string;
  label: string;
};

/** Temas editoriales recurrentes — para detectar saturación en el calendario. */
export const planningPillars: PlanningPillar[] = [
  { id: "whatsapp", label: "WhatsApp y atención" },
  { id: "inventario", label: "Inventario y stock" },
  { id: "pagos", label: "Pagos y cobros" },
  { id: "producto", label: "Producto Mercantis" },
  { id: "operacion", label: "Operación diaria" },
  { id: "emprendimiento", label: "Emprendimiento" },
  { id: "estudiantes", label: "Estudiantes / studytok" },
  { id: "tendencias", label: "Tendencias del sector" },
];

const pillarById = new Map(planningPillars.map((pillar) => [pillar.id, pillar]));

export function getPlanningPillarLabel(id: string): string {
  return pillarById.get(id)?.label ?? id;
}
