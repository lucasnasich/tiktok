# Funcionalidades

**Snapshot:** 2026-09-10  
**Estado de este inventario:** `live`, salvo donde se marque lo contrario.  
**Fuentes:** core Mercantis, Help Center, matriz de capacidades y specs de producto.

Inventario de capacidades que ya pueden considerarse parte del producto actual. **No incluye** features marcadas solamente como roadmap o visión.

Si una capacidad existe parcialmente en código o entitlements pero no está liberada: **no comunicarla**. Ver `roadmap.md`.

---

## Tiendas y storefront

**Estado:** live

Mercantis permite crear y publicar una tienda pública, configurar su operación comercial y ofrecer un flujo de compra. El storefront no es una pieza aislada: consume el catálogo y la configuración de la tienda administrada desde el backoffice.

## Productos y servicios

**Estado:** live

El catálogo admite productos físicos y también **servicios**. Esto amplía el mercado potencial más allá de comercios tradicionales y permite modelar ofertas que no dependen exclusivamente de inventario físico.

## Catálogo e importaciones

**Estado:** live

Gestión de catálogo manual y masiva. Flujos de importación por planillas y capacidades de importación asistida por IA, pensadas para reducir el costo inicial de digitalizar muchos productos.

## Categorías

**Estado:** live

Las categorías forman parte del catálogo y pueden apoyarse en automatización/IA para acelerar la organización de productos importados o cargados en volumen.

## Variantes

**Estado:** live

Los productos pueden manejar variantes —por ejemplo talle, color, material o capacidad— con información operativa propia como stock, precio y SKU cuando corresponde.

## Imágenes de producto

**Estado:** live

Mercantis almacena imágenes asociadas a productos y dispone de funciones de IA para mejorar activos visuales. Las imágenes forman parte del flujo de catálogo y **no son un generador separado del producto**.

## Precios y actualización masiva

**Estado:** live

Administrar precios y actualizaciones masivas. También contempla precio anterior/compare-at en el modelo de actualización comercial.

## Mayoristas

**Estado:** live (superficie comercial)

Existe una superficie de mayoristas incluida en la propuesta de planes superiores. Distinguir de capacidades B2B futuras más profundas; lo confirmado es que el dominio mayorista ya existe en el producto comercial.

## Stock

**Estado:** live

Stock ligado al catálogo y sus variantes. El inventario se conecta con ventas y pedidos para evitar que la disponibilidad sea una información completamente separada.

## Pedidos

**Estado:** live

El backoffice permite ver y gestionar pedidos y también crear pedidos manualmente. El pedido es una **entidad operacional**, no solamente una notificación enviada a un chat.

## Clientes (CRM operativo)

**Estado:** live

Existe una sección de clientes y el modelo de permisos contempla acceso específico a esa información. Los clientes forman parte de la operación y pueden ser consultados por los roles autorizados.

## WhatsApp

**Estado:** live (canal central)

WhatsApp es un canal central del modelo comercial. La plataforma no intenta reemplazar la conversación; busca estructurar la información y hacer que el catálogo, el pedido y la operación alrededor de esa conversación sean más eficientes.

## Importación desde WhatsApp

**Estado:** live

Flujo de importación relacionado con el catálogo de **WhatsApp Business**, lo que reduce el costo de migración para negocios que ya tienen productos cargados allí.

Para la propuesta general, el negocio puede trabajar con WhatsApp personal o Business. Algunas capacidades específicas (p. ej. esa importación) sí pueden depender del tipo de fuente.

## Importación por Excel/planilla

**Estado:** live

Importación de catálogo mediante planillas, útil para negocios que ya trabajan con información tabular y para cargas masivas.

## IA (catálogo)

**Estado:** live — detalle en `inteligencia-artificial.md`

- IA para importar productos (ingestión y estructuración).
- IA para títulos y descripciones.
- IA para categorización.
- IA para mejora de imágenes (uno de los wow moments más visibles).

## Mercado Pago

**Estado:** live, condicionado por país/moneda/rollout

Contemplado como proveedor local en **Argentina, Chile, Colombia, México, Perú y Uruguay**, condicionado por la combinación país/moneda y por reglas de rollout del proveedor.

No generalizar a los 16 mercados.

## Transferencia bancaria

**Estado:** live en todos los mercados soportados

La transferencia bancaria del comercio está disponible como medio de pago configurable.

## Efectivo

**Estado:** live en los mercados soportados

Configurable como medio de pago.

## Medios de pago personalizados

**Estado:** live

El comercio puede ofrecer métodos de pago personalizados además de proveedores integrados.

## GoCuotas

**Estado:** live  
**Mercado:** Argentina únicamente.  
**Uso público:** sí, con alcance Argentina. No inferir disponibilidad internacional.

Confirmación directa del fundador, 2026-09-10. No debe figurar como “futuro” o “por confirmar”.

## Entrega y retiro

**Estado:** live (capa básica)

Configurar opciones de entrega/retiro y reglas de costo, incluyendo escenarios como envío gratis a partir de un monto.

Tracking avanzado, múltiples carriers y logística más profunda: **roadmap**. No mezclar con lo disponible hoy.

## Equipo

**Estado:** live

Las tiendas pueden tener varios miembros y administrar invitaciones desde el backoffice.

## Roles y permisos

**Estado:** live

Roles diferenciados: **Dueño, Administrador, Manager, Soporte, Vendedor, Visualizador y Publicista**, con permisos por secciones/acciones.

## Múltiples tiendas por usuario

**Estado:** live

Un mismo usuario puede trabajar con más de una tienda. Cada tienda conserva su propio contexto operativo, catálogo, configuración y estado comercial.

## Métricas generales

**Estado:** live (superficie actual)

La sección Métricas muestra ingresos, cantidad de pedidos, clientes nuevos y visitas/visitantes dentro de rangos temporales configurables.

Métricas financieras más profundas (costos, ganancia, salud financiera): **no live**. Ver `roadmap.md`.

## Personalización de tienda

**Estado:** live (alcance actual)

La tienda puede configurarse visualmente con elementos como identidad/colores y diseño básico, dentro del alcance actual de personalización.

Churn cualitativo: algunos usuarios avanzados se van porque necesitan personalización de storefront similar a ecosistemas de templates maduros. Ver `competidores.md`.

## Dominio personalizado

**Estado:** live en planes comerciales

Los planes comerciales contemplan dominio personalizado como parte de la propuesta.

## Mercados y monedas

**Estado:** live (capacidad técnica)

El core soporta selección de país y moneda operacional de acuerdo con el mercado, con locales y zonas horarias iniciales definidas por país. Detalle: `mercados-internacionalizacion.md`.

Capacidad técnica ≠ tracción comercial en esos países.

## Referencia USD en Argentina

**Estado:** live (flujo específico AR)

Para tiendas argentinas en ARS existe un flujo específico de protección/referencia de precios en USD, separado de una conversión FX general del sistema.

## Programa de Embajadores

**Estado:** live (producto implementado)  
**Canal de crecimiento:** todavía no demostrado. Ver `growth-distribucion.md`.

Portal y flujo: activación, enlace de referido, tiendas referidas, métricas y perfil de cobro.

## Programa de Partners

**Estado:** live (producto implementado)  
**Canal de crecimiento:** todavía no demostrado.

Aplicación, organización, equipo, cartera de tiendas, métricas y lógica de relación comercial. Comisión recurrente del 20% en relaciones elegibles según reglas vigentes; hay deuda para formalizar mejor elegibilidad. Ver `pricing-modelo-negocio.md`.

---

## Explicitamente NO live (no usar en contenido como disponibles)

- API pública para clientes
- MCP público
- webhooks públicos
- caja / POS
- sucursales (modelo completo)
- facturación
- Meta Pixel
- Argo como agente general
- motor fiscal internacional / facturación fiscal global / envíos internacionales / FX global

Ver `claims.md` y `roadmap.md`.
