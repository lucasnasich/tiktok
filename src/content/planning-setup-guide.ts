import type { ContentRoleId } from "@/content/content-roles";
import { formats, type Format } from "@/content/formats";

export type PlanningSetupStepId =
  | "profile"
  | "rhythm"
  | "roles"
  | "pillars"
  | "formats";

export type PlanningSetupStep = {
  id: PlanningSetupStepId;
  label: string;
  title: string;
  intro: string;
};

export const PLANNING_SETUP_STEPS: PlanningSetupStep[] = [
  {
    id: "profile",
    label: "Perfil",
    title: "Perfil editorial",
    intro:
      "Solo el nombre del mix editorial. Oficial o satélite lo define cada cuenta; las cuentas se eligen al generar el calendario.",
  },
  {
    id: "rhythm",
    label: "Ritmo",
    title: "Ritmo de publicación",
    intro:
      "Acá definís cuánto publicás y cuándo. El motor usa esto para llenar huecos en el calendario sin pisar piezas que ya armaste manualmente.",
  },
  {
    id: "roles",
    label: "Roles",
    title: "Roles del contenido",
    intro:
      "El rol responde para qué publicamos — por encima del pilar, el ángulo y el formato. No mezcles capas: Rol ≠ Pilar ≠ Ángulo ≠ Formato.",
  },
  {
    id: "pillars",
    label: "Pilares",
    title: "Pilares editoriales",
    intro:
      "El pilar responde de qué hablamos — el tema editorial recurrente. Sirve para detectar saturación o huecos en la semana.",
  },
  {
    id: "formats",
    label: "Formatos",
    title: "Formatos creativos",
    intro:
      "El formato es la envoltura visual del post (pizarra, captura de chat, tier list…). Elegí los que querés priorizar y, abajo, cuánto puede repetirse cada uno en la semana.",
  },
];

export type RoleGuide = {
  id: ContentRoleId;
  cuandoUsar: string;
  ejemplo: string;
  tip: string;
};

export const ROLE_GUIDES: RoleGuide[] = [
  {
    id: "alcance",
    cuandoUsar:
      "Cuando querés llegar a gente que todavía no conoce Mercantis. Hooks fuertes, tendencias, dolores universales del emprendedor.",
    ejemplo:
      "“3 señales de que tu negocio de WhatsApp está perdiendo ventas” — no menciona producto, pero atrae al público correcto.",
    tip: "En satélites suele ser el 60–70% del mix. En la oficial, equilibralo con valor y prueba.",
  },
  {
    id: "valor",
    cuandoUsar:
      "Cuando enseñás algo útil: tips, frameworks, errores comunes. Genera autoridad y guardados.",
    ejemplo:
      "“Cómo organizar pedidos de WhatsApp sin planillas” — educa y posiciona a Mercantis como quien entiende el problema.",
    tip: "Es el rol más sostenible a largo plazo. Si dudás, subí valor antes que conversión.",
  },
  {
    id: "prueba",
    cuandoUsar:
      "Cuando mostrás evidencia: demo del producto, caso de cliente, antes/después, pantalla real.",
    ejemplo:
      "Screen recording de un pedido entrando por WhatsApp y quedando registrado en Mercantis.",
    tip: "En satélites también entra: evidencia, demos y casos. El mix semanal del perfil decide cuánto.",
  },
  {
    id: "conversion",
    cuandoUsar:
      "Cuando pedís una acción concreta: probar Mercantis, registrarse, agendar demo. Usalo con moderación.",
    ejemplo:
      "“Probá Mercantis gratis esta semana” con CTA claro — después de haber dado valor o prueba en posts anteriores.",
    tip: "Si el target queda en 0%, el motor no la programa. Una pieza manual igual puede usarla de forma excepcional.",
  },
  {
    id: "marca",
    cuandoUsar:
      "Cuando queremos que Mercantis se asocie a una idea, postura o filosofía, incluso sin vender directamente.",
    ejemplo:
      "“Tu negocio no necesita más herramientas. Necesita un sistema.”",
    tip: "Instala visión de marca. No compite con valor ni prueba — ocupa otro lugar en el mix.",
  },
  {
    id: "comunidad",
    cuandoUsar:
      "Cuando queremos abrir conversación con dueños de negocio, hacerlos opinar o compartir experiencias.",
    ejemplo:
      "“¿Qué parte de manejar tu negocio te consume más tiempo?”",
    tip: "Priorizá preguntas abiertas y hooks que inviten a comentar o guardar para debatir.",
  },
];

export type PillarPriority = "alta" | "media" | "baja" | "no";

export const PILLAR_PRIORITY_WEIGHT: Record<PillarPriority, number> = {
  alta: 30,
  media: 15,
  baja: 5,
  no: 0,
};

/** Todos los formatos creativos del estudio — source of truth: `formats.ts`. */
export function getSetupFormats(): Format[] {
  return formats;
}

export const RHYTHM_COPY = {
  postsPerDay:
    "Cuántas piezas únicas por día. Una pieza puede salir en TikTok + IG a la vez — no cuenta doble.",
  activeDays: "Días en que la cuenta publica. Podés dejar domingo libre si el público no está activo.",
  timeSlots:
    "Horarios editoriales posibles. Si elegís más horarios que piezas por día, el motor rota cuál queda fuera cada día para que todos se usen a lo largo de la semana. No es la hora exacta de Buffer, pero sí la estructura del día.",
};

/** Límites internos del motor — no se configuran en el wizard orgánico. */
