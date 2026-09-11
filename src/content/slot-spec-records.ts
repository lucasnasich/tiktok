import type { SlotSpecRecord } from "@/content/slot-specs";

/**
 * Registros de slot persistidos en repo (descripciones editoriales, etc.).
 * Se fusionan con localStorage en `useSlotSpecs`.
 */
export const slotSpecRecordSeeds: SlotSpecRecord[] = [
  {
    slotId:
      "gen-generation:1789151132908-account:1789142522146--tiktok+account:1789142522146--instagram-2026-09-11-1300",
    directionKind: "manual",
    status: "draft",
    editorialDescription:
      "Esta pieza tiene que enseñar algo útil sobre cómo cuidar la relación con los clientes y buscar recompra, con criterio claro y sin poner al producto en el centro. El pilar apunta a experiencia, postventa y servicio en el día a día de un negocio, no a prometer resultados que no podemos respaldar. El formato tier list ordena prácticas o errores de mayor a menor impacto y funciona mejor si los criterios del ranking quedan explícitos. La producción sin cámara se resuelve con placas, texto, capturas o B-roll, con voz en off solo si suma claridad.",
  },
  {
    slotId:
      "gen-generation:1789151132908-account:1789142522146--tiktok+account:1789142522146--instagram-2026-09-11-1100",
    directionKind: "manual",
    status: "draft",
    editorialDescription:
      "Esta pieza tiene que frenar el scroll con un gancho de última hora sobre un problema cotidiano de inventario, como desfases, faltantes o stock repartido en varios lados, sin convertirse en venta directa. El pilar pide hablar del mundo real del stock y sus variantes, desde la frustración de no saber qué queda disponible hasta la necesidad de que ventas y pedidos no vivan desconectados. El formato última hora le da ese titular urgente de apertura; la producción sin cámara se resuelve con placa, texto, capturas de pantalla o B-roll, y voz en off solo si aporta claridad.",
  },
  {
    slotId:
      "gen-generation:1789151132908-account:1789142522146--tiktok+account:1789142522146--instagram-2026-09-13-2100",
    directionKind: "manual",
    status: "draft",
    editorialDescription:
      "Esta pieza tiene que hacer ver, de un modo simple y creíble, cómo Mercantis funciona en la práctica: mostrar algo concreto del producto sin apelar a slogans ni inventar resultados. El formato pizarra encaja porque permite explicar un flujo o una capacidad a mano alzada, educativo y fácil de seguir en el feed. Como es contenido de prueba y va sin cámara, todo pasa por pantalla, texto, capturas o B-roll, con voz en off si suma, pero sin nadie hablando a cámara.",
  },
];
