export const PILLAR_SIGNAL_PRESETS: Record<
  string,
  Array<{ id: string; label: string; signal: string }>
> = {
  "ventas-atencion": [
    { id: "dolor", label: "Dolor", signal: "El negocio vive en WhatsApp y las consultas se escapan." },
    { id: "comparacion", label: "Comparación", signal: "Chat suelto vs. un sistema que no pierde consultas." },
  ],
  "inventario-stock": [
    { id: "dolor", label: "Dolor", signal: "El stock está en la cabeza, en Excel y en el local." },
    { id: "comparacion", label: "Comparación", signal: "Adivinar faltantes vs. ver el inventario en un solo lugar." },
  ],
  "operacion-gestion": [
    { id: "dolor", label: "Dolor", signal: "El día se va en planillas, copiar y pegar, y apagar incendios." },
    { id: "storytelling", label: "Storytelling", signal: "La escena de todos los días operando el negocio a mano." },
  ],
  "producto-mercantis": [
    { id: "dolor", label: "Dolor", signal: "Mercantis tiene que verse como sistema, no como otra tienda." },
    { id: "comparacion", label: "Comparación", signal: "Otra app más vs. un sistema para operar el negocio." },
  ],
};

export function signalPresetsForPillar(pillarId: string) {
  return (
    PILLAR_SIGNAL_PRESETS[pillarId] ?? [
      {
        id: "dolor",
        label: "Dolor",
        signal: "El dueño opera el negocio a mano.",
      },
      {
        id: "comparacion",
        label: "Comparación",
        signal: "Trabajar fragmentado vs. un solo sistema.",
      },
    ]
  );
}
