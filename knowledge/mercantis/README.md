# Mercantis Brain

**Snapshot canónico:** 10 de septiembre de 2026

El Mercantis Brain es la **fuente de verdad** sobre Mercantis para humanos y agentes del Content Studio. No es un brand brief. No es documentación del Studio. Es memoria institucional: producto, historia, fundadores, marca, pricing, clientes, estrategia, límites y contradicciones resueltas.

## Para qué existe

Para que un agente pueda generar ideas, hooks, copy, briefs, claims, comparaciones y decisiones editoriales **basadas en información real**, sin inventar features, pricing, mercados, clientes, métricas, historia ni roadmap.

También para que Mercantis no pierda contexto con el tiempo: razones, errores, números aproximados, matices y decisiones.

## Dónde vive cada cosa

| Capa | Qué es | Dónde |
|------|--------|--------|
| Studio | Cómo funciona este Content Studio | `docs/` |
| Mercantis | Hechos y conocimiento real de la empresa | `knowledge/mercantis/` |
| Operación editorial | Planificación, taxonomías, piezas, inspiración | `src/content/` |

No mezclar esas capas.

## Cómo consultar (agentes)

No hace falta leer 3.000 líneas para una consulta puntual.

1. Identificar qué información hace falta.
2. Abrir esta tabla.
3. Leer **sólo** los documentos relevantes.
4. Abrir `MASTER.md` cuando:
   - la pregunta cruza varios dominios;
   - hay ambigüedad entre documentos;
   - se necesita verificar que no se perdió detalle;
   - el dato es sensible (pricing, trial, GoCuotas, claims, roadmap).

Si algo **no está** en el Brain: marcarlo como **desconocido**. No inventar. No completar huecos.

## Qué NO debe inventarse

Nunca inventar:

- features disponibles;
- pricing, trial, comisiones, packs de IA;
- mercados, monedas, integraciones de pago;
- clientes, métricas, resultados, ROI;
- historia de fundadores o de la empresa;
- fechas de roadmap;
- API, MCP, webhooks, caja/POS, sucursales, facturación, Meta Pixel, Argo como producto live.

## Estados de verdad

Usar estos estados cuando exista riesgo de confundir presente con futuro:

| Estado | Significa |
|--------|-----------|
| `live` | Disponible hoy en producto. Se puede comunicar con las condiciones del claim. |
| `in-development` | Se está construyendo. **No anunciar como disponible.** |
| `planned` / `próximo` | Prioridad definida, no live. Sin fechas inventadas. |
| `vision` | Dirección a 3–5 años o concepto (p. ej. Argo, sistema operativo completo). |
| `historical` | Pasó. No es el estado actual. |
| `hypothesis` | Tesis, observación cualitativa o hipótesis operativa. No es estadística. |

Cuando importe para contenido:

| Alcance | Significa |
|---------|-----------|
| `public` | Puede usarse en comunicación si el claim lo permite. |
| `internal` | Memoria institucional. No usar en copy público sin decisión explícita. |

## Si necesitás saber sobre...

| Si necesitás saber sobre... | Consultá |
|---|---|
| Qué es Mercantis, el problema, la categoría | `empresa.md` |
| Origen, Curval, primera venta, presión financiera | `historia.md` |
| Lucas y Carla, roles, cómo se conocieron | `fundadores.md` |
| Nombre, Odisea, Argonautas, logo, estética, referencias | `marca.md` |
| Filosofía de producto, Apple, límites, autonomía de IA | `filosofia.md` |
| Qué es el producto hoy, aha moment, demo, núcleo irreducible | `producto.md` |
| Features disponibles (inventario live) | `funcionalidades.md` |
| IA actual, batch, matching, Argo | `inteligencia-artificial.md` |
| Quién compra, roles, uso diario, anti-perfil | `usuarios-clientes.md` |
| Rubros / verticales | `verticales.md` |
| Dolores, JTBD, objeciones, lenguaje de clientes | `dolores-jtbd.md` |
| Sistema operativo, wedge, moat, vs. alternativas | `posicionamiento.md` |
| Shopify, Treinta, Pedix, La Pyme, churn de templates | `competidores.md` |
| Planes, precios, trial, 0% comisión, Partners | `pricing-modelo-negocio.md` |
| Inbound, outbound, satélites como GTM, Partners sin tracción | `growth-distribucion.md` |
| Voz oficial vs. satélites, humor, política, LATAM | `contenido-comunicacion.md` |
| Matera/Francisco, Empac, migraciones, testimonios landing | `clientes-casos.md` |
| 16 mercados, monedas, Mercado Pago, límites regionales | `mercados-internacionalizacion.md` |
| Stack, multi-tenancy, deuda técnica | `tecnologia.md` |
| Live vs. en desarrollo vs. próximo vs. visión | `roadmap.md` |
| Qué se puede / no se puede afirmar | `claims.md` |
| Errores, límites, tech debt, reglas de uso | `aprendizajes-limitaciones.md` |
| Radiografía integral (backup) | `MASTER.md` |

## Contradicciones ya resueltas (snapshot 2026-09-10)

Por confirmación directa del fundador:

1. **GoCuotas está live sólo en Argentina.** No es futuro. No es internacional.
2. **Los cuatro planes (Lite, Pro, Max, Ultra) tienen 10 días gratis sin tarjeta**, desde la creación de la tienda.

Si landing, Help Center y spec del core discrepan en otro dato: no publicar hasta resolver una única fuente canónica.

## Datos que caducan

Revalidar antes de usar si pasó tiempo razonable desde el snapshot:

- pricing y descuento anual;
- trial;
- cantidad de clientes / tiendas / conversión;
- mercados e integraciones;
- programas Partners/Embajadores;
- disponibilidad de features.

**Trazabilidad de esta carpeta:** radiografía confirmada 2026-09-10 (core `carlapalmieri/mercantis`, landing `carlapalmieri/mercantis-landing`, entrevista con Lucas Nasich).
