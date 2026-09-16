import type { ContentRoleId } from "@/content/content-roles";
import { formats, type Format } from "@/content/formats";

export type PlanningSetupStepId =
  | "profile"
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
    id: "roles",
    label: "Roles",
    title: "Roles del contenido",
    intro:
      "El rol es el mundo editorial de la pieza: educación, producto, evidencia, proceso, marca, comunidad o conversión. No es un objetivo genérico. Alcance y valor no son roles: cualquier pieza debería tener ambos.",
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
    id: "educacion",
    cuandoUsar:
      "Cuando el trabajo de la pieza es enseñar algo aplicable: un tip, un framework, un error común o una explicación. El producto no es el protagonista.",
    ejemplo:
      "“3 formas de organizar los pedidos que te llegan por WhatsApp.”",
    tip: "Si mostrás la interfaz o un cliente real, ya no es educación: es producto o evidencia. El alcance se gana con el hook, no con este rol.",
  },
  {
    id: "producto",
    cuandoUsar:
      "Cuando el trabajo es mostrar Mercantis en acción: una feature, un workflow, una pantalla, un antes/después del producto o un caso de uso.",
    ejemplo:
      "Mostrar cómo entra un pedido y se descuenta automáticamente el stock.",
    tip: "Distinto de evidencia: acá habla el producto, no el cliente. Distinto de educación: acá se ve Mercantis, no un consejo genérico.",
  },
  {
    id: "evidencia",
    cuandoUsar:
      "Cuando el trabajo es una señal externa de que Mercantis funciona: testimonio, resultado, métrica, caso o adopción real.",
    ejemplo:
      "“Este negocio cargó 800 productos en Mercantis y dejó de manejar el stock en Excel.”",
    tip: "No inventar clientes ni números. Si la pieza es un tour de la interfaz sin voz de cliente, es producto, no evidencia.",
  },
  {
    id: "build-in-public",
    cuandoUsar:
      "Cuando el trabajo es el detrás de escena de construir Mercantis: avances, reuniones, lanzamientos, métricas internas, errores y aprendizajes. Sirve para contenido serializado.",
    ejemplo:
      "“Hoy terminamos esta feature.” / “Esta semana tuvimos X registros.” / “Esto salió mal y lo vamos a cambiar.”",
    tip: "La audiencia sigue la evolución de la empresa, no un tutorial ni una demo. Si no hay proceso real, no fuerces este rol.",
  },
  {
    id: "marca",
    cuandoUsar:
      "Cuando queremos instalar una visión, postura o filosofía, incluso sin enseñar ni mostrar producto.",
    ejemplo:
      "“Tu negocio no necesita más herramientas. Necesita un sistema.”",
    tip: "No es un pitch de features ni un caso de cliente. Si enseña un método, es educación; si pide registrarse, es conversión.",
  },
  {
    id: "comunidad",
    cuandoUsar:
      "Cuando el trabajo es abrir conversación: una pregunta, una opinión o una experiencia para que la audiencia participe.",
    ejemplo:
      "“¿Qué parte de manejar tu negocio te consume más tiempo?”",
    tip: "Priorizá preguntas abiertas. Si cerrás en CTA de registro, ya es conversión.",
  },
  {
    id: "conversion",
    cuandoUsar:
      "Cuando pedís una acción concreta: probar Mercantis, registrarse, agendar demo o visitar el producto. Usalo con moderación.",
    ejemplo:
      "“Probá Mercantis gratis esta semana” con CTA claro — después de haber educado, mostrado producto o dado evidencia.",
    tip: "Si el target queda en 0%, el motor no la programa. Una pieza manual igual puede usarla de forma excepcional.",
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

/** Límites internos del motor — no se configuran en el wizard orgánico. */
