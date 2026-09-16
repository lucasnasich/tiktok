import type { ContentRoleId } from "@/content/content-roles";
import { formats, type Format } from "@/content/formats";

export type PlanningSetupStepId =
  | "profile"
  | "roles"
  | "pillars"
  | "publication";

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
      "El rol es el mundo editorial de la pieza: proceso, educación, producto, marca, evidencia o comunidad. Un CTA puede aparecer en cualquiera; no define el rol.",
  },
  {
    id: "pillars",
    label: "Pilares",
    title: "Pilares editoriales",
    intro:
      "El pilar responde de qué hablamos — el tema editorial recurrente. Sirve para detectar saturación o huecos en la semana.",
  },
  {
    id: "publication",
    label: "Producción",
    title: "Tipos de publicación y restricciones",
    intro:
      "El tipo de publicación es la pieza nativa (imagen, carrusel, reel o story). El formato creativo se decide después, al desarrollar cada pieza. La restricción de cámara limita cómo se puede producir, no si hay video.",
  },
];

export type RoleGuide = {
  cuandoUsar: string;
  ejemplo: string;
  tip: string;
};

export const ROLE_GUIDES: Record<ContentRoleId, RoleGuide> = {
  build_in_public: {
    cuandoUsar:
      "Cuando el trabajo es el detrás de escena de construir Mercantis: avances, problemas, decisiones, lanzamientos, reuniones, features, métricas, errores y aprendizajes. Sirve para contenido serializado.",
    ejemplo:
      "“Nos pidieron esto tres clientes y decidimos construirlo.” / “Esta feature nos llevó tres semanas y hoy finalmente salió.” / “Hoy entraron X tiendas nuevas.”",
    tip: "Siempre tiene que haber avance, tensión, decisión, aprendizaje o cambio. No lo conviertas en lifestyle vacío.",
  },
  educacion: {
    cuandoUsar:
      "Cuando enseñás algo útil que un dueño de negocio o emprendedor pueda aplicar. Temas universales de LATAM: stock, conversión, tráfico, organización, catálogo, métricas, procesos y ventas.",
    ejemplo:
      "“3 formas de reducir errores cuando manejás stock en varios canales.”",
    tip: "Evitá temas demasiado locales (facturación, impuestos, medios de pago de un solo país). Si mostrás la interfaz, ya es producto.",
  },
  producto: {
    cuandoUsar:
      "Cuando el trabajo es mostrar Mercantis funcionando de forma explícita: features, workflows, pantallas, demos, antes/después, automatizaciones o casos de uso.",
    ejemplo:
      "Mostrar cómo entra un pedido y se actualiza automáticamente el stock.",
    tip: "Acá se ve el producto. Distinto de evidencia (habla un cliente o un resultado externo) y de educación (un consejo sin demo).",
  },
  marca: {
    cuandoUsar:
      "Cuando instalás una postura, filosofía o visión. Mercantis no debe sonar neutral ni tibio sobre cómo deberían funcionar los negocios y el software para comercios.",
    ejemplo:
      "“Tu negocio no necesita más herramientas aisladas. Necesita un sistema.”",
    tip: "No es un tutorial ni un tour de features. Si enseña un método, es educación; si muestra la app, es producto.",
  },
  evidencia: {
    cuandoUsar:
      "Cuando el trabajo es una señal externa de que Mercantis funciona: clientes, testimonios, citas, resultados, métricas, pedidos reales, historias o feedback.",
    ejemplo:
      "Contar cómo un cliente pidió una mejora, la implementamos y qué resultado tuvo.",
    tip: "No hace falta video del cliente. Sirven citas escritas, capturas e historias contadas por Mercantis. No inventar números ni casos.",
  },
  comunidad: {
    cuandoUsar:
      "Cuando el trabajo es abrir conversación: una pregunta, una opinión o una situación reconocible para dueños de negocio. También cuando alguien te pregunta algo sobre la empresa y lo respondés en un video para abrir el tema.",
    ejemplo:
      "“¿Qué parte de manejar tu negocio te consume más tiempo?” / “Me preguntaron por qué Mercantis no cobra comisión por venta y lo respondí en un video.”",
    tip: "Priorizá identificación y participación. Si respondés una pregunta sobre la empresa, que sea apertura de conversación — no un pitch. Un CTA natural puede existir, pero no conviertas la pieza en un aviso.",
  },
};

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
