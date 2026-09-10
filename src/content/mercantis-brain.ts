/** Índice del Mercantis Brain para la UI del Studio. El conocimiento vive en `knowledge/mercantis/`. */

export type MercantisBrainDoc = {
  id: string;
  file: string;
  label: string;
};

export const MERCANTIS_BRAIN_DOCS: MercantisBrainDoc[] = [
  { id: "readme", file: "README.md", label: "Índice" },
  { id: "empresa", file: "empresa.md", label: "Empresa" },
  { id: "historia", file: "historia.md", label: "Historia" },
  { id: "fundadores", file: "fundadores.md", label: "Fundadores" },
  { id: "marca", file: "marca.md", label: "Marca" },
  { id: "filosofia", file: "filosofia.md", label: "Filosofía" },
  { id: "producto", file: "producto.md", label: "Producto" },
  { id: "funcionalidades", file: "funcionalidades.md", label: "Funcionalidades" },
  { id: "inteligencia-artificial", file: "inteligencia-artificial.md", label: "IA" },
  { id: "usuarios-clientes", file: "usuarios-clientes.md", label: "Usuarios" },
  { id: "verticales", file: "verticales.md", label: "Verticales" },
  { id: "dolores-jtbd", file: "dolores-jtbd.md", label: "Dolores" },
  { id: "posicionamiento", file: "posicionamiento.md", label: "Posicionamiento" },
  { id: "competidores", file: "competidores.md", label: "Competidores" },
  { id: "pricing-modelo-negocio", file: "pricing-modelo-negocio.md", label: "Pricing" },
  { id: "growth-distribucion", file: "growth-distribucion.md", label: "Growth" },
  { id: "contenido-comunicacion", file: "contenido-comunicacion.md", label: "Contenido" },
  { id: "clientes-casos", file: "clientes-casos.md", label: "Clientes" },
  { id: "mercados-internacionalizacion", file: "mercados-internacionalizacion.md", label: "Mercados" },
  { id: "tecnologia", file: "tecnologia.md", label: "Tecnología" },
  { id: "roadmap", file: "roadmap.md", label: "Roadmap" },
  { id: "claims", file: "claims.md", label: "Claims" },
  { id: "aprendizajes-limitaciones", file: "aprendizajes-limitaciones.md", label: "Aprendizajes" },
  { id: "master", file: "MASTER.md", label: "MASTER" },
];
