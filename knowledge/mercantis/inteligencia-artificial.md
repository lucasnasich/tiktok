# Inteligencia artificial

**Snapshot:** 2026-09-10  
**Fuentes:** docs de AI Product Import, AI Image Editing, capacidades de catálogo, visión del fundador.

La IA debe documentarse como parte de **operaciones concretas del negocio**, no como una capa decorativa separada.

## Qué hace la IA hoy

**Estado:** live

La IA ya interviene en:

- importación de productos (ingestión y estructuración de catálogo);
- generación o refinamiento de títulos y descripciones;
- categorización;
- mejora de imágenes.

Todas estas funciones actúan sobre **objetos reales del catálogo** y buscan reducir tareas manuales de configuración.

Es uno de los usos más alineados con la tesis de IA operativa.

## Qué significa “IA en operaciones”

La inteligencia artificial trabaja sobre objetos y procesos reales del negocio —productos, categorías, imágenes, configuraciones y, progresivamente, stock, pedidos, métricas y finanzas— para reducir trabajo manual, detectar oportunidades y proponer acciones.

La dirección **no** es convertir Mercantis en un chat con funciones alrededor. La IA debe ser una capa transversal del sistema operativo: entiende contexto, propone la siguiente acción útil y, cuando una acción modifica el negocio, explica qué hará y solicita confirmación antes de ejecutarla.

A futuro puede encadenar procesos cada vez más complejos, pero el principio de control permanece: **sugerencia proactiva; acción con confirmación humana**.

## Principio de autonomía

**Estado:** filosofía de producto (aplica a live y a visión)

La IA puede ser proactiva para detectar problemas, oportunidades o configuraciones útiles y presentar recomendaciones sin que el usuario tenga que descubrirlas manualmente.

Para las acciones que modifican el negocio: **confirmación explícita**. El agente interpreta la intención, resume qué va a cambiar y espera la aprobación antes de ejecutar.

Esto combina proactividad con control y establece una regla de seguridad/producto para futuros agentes.

## Dirección de IA para mañana

**Estado:** vision / planned — no claims actuales

La dirección ya expresada incluye:

- procesamiento **batch** más potente;
- **matching automático de imágenes**;
- agentes capaces de operar sobre el negocio;
- a más largo plazo, interfaces más **generativas/contextuales**;
- capacidades futuras listadas alrededor de social, SEO, traducciones y automatización.

Separar de los claims actuales. Son visión y roadmap, no disponibilidad inmediata.

## Argo

**Estado:** vision / próximo  
**Uso público:** se puede hablar como visión **únicamente** si queda explícito que todavía no está disponible.  
**Alcance:** internal hasta que se decida el lanzamiento.

**Argo** será el nombre de la guía/agente de IA de Mercantis. Todavía no debe tratarse como una capacidad general disponible.

Función futura: acompañar al dueño de forma proactiva: observar contexto, sugerir mejoras, ayudar a configurar el sistema y ejecutar acciones cuando el usuario las apruebe.

Filosofía:

- Argo puede **analizar y sugerir proactivamente** sin que el usuario tenga que pedir cada insight.
- Antes de realizar una acción que cambie el negocio, debe **explicar/pasar en limpio lo que va a hacer y pedir confirmación**.
- El dueño conserva la decisión final.

Conecta con el simbolismo del barco inteligente (`marca.md`): Mercantis es el barco; Argo es la inteligencia que ayuda a navegar.

## Áreas técnicamente interesantes hoy

Entre las áreas con mayor contenido de dominio propio: importación de catálogo con IA, edición de imágenes, actualización masiva de precios, motor de mercados y monedas, multi-tenancy, RBAC, catálogo de planes/ofertas y la lógica de growth/billing.

La relevancia técnica no se mide solamente por complejidad de código, sino por cuánto **conocimiento de negocio** encapsula cada módulo. Mercantis está acumulando modelos específicos de comercio que luego pueden ser utilizados por automatizaciones y agentes.

## Créditos de IA

Cada plan incluye una cantidad de créditos/capacidad de IA. Si el cliente necesita superar ese límite, puede comprar **packs adicionales de créditos**. Ver `pricing-modelo-negocio.md`.

Cuando una operación de IA o una acción con efecto cobrable falla, el sistema debe manejar ese fallo de forma explícita y no presentar un éxito falso (`filosofia.md`).

## Gateway / proveedores

La arquitectura integra un gateway/capa de modelos y proveedores como **Gemini** para operaciones de producto. Detalle de stack: `tecnologia.md`.

**Alcance:** internal; no hace falta exponer proveedores en copy de comerciantes.

## Ver también

- `funcionalidades.md`
- `filosofia.md`
- `marca.md` (Argo como nombre)
- `roadmap.md`
- `claims.md`
