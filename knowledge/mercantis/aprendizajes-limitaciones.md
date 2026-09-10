# Aprendizajes y limitaciones

**Snapshot:** 2026-09-10  
**Fuente:** fundador + tech-debt tracker del core.

Una base útil registra lo que Mercantis aprendió y las limitaciones que no deben esconderse. Memoria institucional, no propaganda.

## Hipótesis estratégica ya corregida

La importancia relativa de los **templates/storefront** como principal diferenciador fue **sobreestimada**. La evolución mostró que la ventaja más interesante está en el backoffice, la operación y la automatización. La tienda pública sigue importando, pero dejó de ser el centro exclusivo de la tesis.

Construyeron el storefront **demasiado temprano** (atención antes de madurar capas operativas). No necesitan competir por cantidad de templates.

## Qué construyeron demasiado tarde

Caja, facturación, sucursales, métricas avanzadas (costos, ganancia, salud financiera). El equipo está acelerando. **No live.**

## Error más caro

**No distribuir desde el día uno.** Costo acumulativo. Producto y distribución deben avanzar en paralelo. Ver `historia.md` y `growth-distribucion.md`.

El perfeccionismo y el miedo a la reacción externa de Lucas postergaron lanzamientos y distribución (`fundadores.md`).

## Error que más enseñó

**No construir una feature sólo porque un lead promete convertirse si existe.** Varias veces construyeron para cerrar una venta y el prospecto no se suscribió.

Regla: señal real de pago o suficiente validación antes de comprometer desarrollo específico. Aplica también a Enterprise custom.

## Outbound vs. inbound

Exceso de visitas/outbound consumió mucho tiempo; retorno bajo. Outbound puede seguir siendo táctica puntual de supervivencia/caja. **No** es el motor estratégico deseado. Hipótesis: inbound > cold outreach, no ley universal.

## Partners / Embajadores

Implementados. **No demostraron tracción.** No maquillar.

## Curbal

~5.000 usuarios y ~USD 200/mes. Alcance sin modelo económico. No pasar demasiado tiempo optimizando sin evidencia de conversión. Entrenamiento conjunto (y fracaso económico) de Lucas y Carla antes de Mercantis.

## Limitación de fit: storefront avanzado

Churn cualitativo de usuarios que necesitan personalización de templates al nivel de Shopify/Tiendanube. Caso extremo: alguien que se construyó su propio sistema con IA — no es el cliente ideal.

## Limitación de comunicación

Amplitud difícil de explicar. “Más fácil/rápido/intuitivo” es genuino pero no diferencia. Hay que demostrar, no declarar. El mercado puede leer “otra tienda online”.

## Limitación de evidencia

- No hay atribución cuantitativa limpia de canales de adquisición.
- No hay objeción comercial dominante verbalizada.
- No hay promedio estable de productos/pedidos.
- No hay % mobile/desktop.
- Cifras de usuarios/tiendas/pagos son orales y aproximadas.
- Pro/Max como mejor valor mutuo es cualitativo, no churn analizado.
- Verticales “ganadores” son señales tempranas, no ranking.
- Migraciones desde Tiendanube/Empretienda: cualitativas.

## Limitación de distribución

El producto no fue rechazado a gran escala: **todavía no se expuso lo suficiente**. Convencimiento ≠ evidencia de “acá hay algo grande”.

## Limitación regional

16 mercados técnicos ≠ 16 mercados con tracción. Sin traducciones, fiscal global, shipping internacional ni FX de reporting.

## Limitación de producto vs. visión

Caja, sucursales, facturación, API, MCP, webhooks, Meta Pixel, Argo, métricas financieras profundas: no live. Ver `roadmap.md` y `claims.md`.

## Deuda técnica

Interna. Rate limiting en ciertas rutas de IA de onboarding; trazabilidad de descuentos; contexto/acceso por tienda; billing legacy; workaround de deploy; antifraude entre programas de growth; elegibilidad de comisiones de Partners. Fuente: tech-debt tracker del core. **No contenido público automático.** Ver `tecnologia.md`.

## Qué hacen mejor algunos competidores

Shopify y Tiendanube: templates, ecosistema, integraciones maduras. Shopify es el competidor que más respeta Lucas. Treinta, Pedix y La Pyme preocupan por cercanía/potencial. Ver `competidores.md`.

## Presión financiera persistente

No hay un día de abandono; hay agua al cuello persistente. Decisión actual: seguir apostando. Internal. No usar en marketing emocional sin permiso.

## Cómo actualizar este Brain

La entrevista intensiva de fundador se considera **cerrada en esta versión** (2026-09-10). No quedan preguntas abstractas obligatorias para Lucas.

Las lagunas futuras se completan **sólo cuando exista nueva evidencia natural**:

- una feature se lance;
- aparezcan nuevos datos cuantitativos;
- exista un caso de cliente documentado;
- cambie pricing/mercados;
- surja una decisión de producto;
- una campaña o canal produzca aprendizaje;
- se obtenga información nueva sobre competencia.

Regla: **actualizar por eventos reales, no seguir interrogando por completitud teórica**.

## Familias de fuentes canónicas (fuera de este repo)

- `docs/product-specs/stores/regional-markets.md` — países, monedas, providers, límites regionales.
- `docs/product-specs/growth/socios-program-overview.md` y specs relacionadas — Partners y Embajadores.
- `docs/tech-debt/tech-debt-tracker.md` — deuda técnica interna.
- Help Center `apps/help-center/documentacion/**` — comportamiento explicado al usuario.
- Docs/specs de catálogo e IA.
- Configuración de pricing/capabilities de landing/core.
- Landings por rubro.
- Documentación de arquitectura del core.

Este Content Studio **no** es el core ni la landing. No modificar esos repositorios desde aquí.

## Ver también

- `historia.md`
- `growth-distribucion.md`
- `claims.md`
- `MASTER.md`
