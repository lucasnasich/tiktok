# Tecnología

**Snapshot:** 2026-09-10  
**Fuente:** documentación de arquitectura y specs del core.

Captura la arquitectura actual **sin exponer secretos operativos**. La deuda técnica es **interna**: no convertirla automáticamente en contenido público.

## Arquitectura general

SaaS **multi-tenant** con backoffice y storefront separados, organizados por dominios de producto.

Tesis: un modelo coherente del negocio operable por interfaz y, cada vez más, por automatización y agentes (`empresa.md`).

## Frontend

Next.js, React y TypeScript constituyen la base principal de las aplicaciones web actuales.

## Backend

La lógica de servidor vive en el stack Next.js y en módulos de dominio, con rutas/actions y acceso server-side a datos.

## Base de datos

PostgreSQL con **Drizzle ORM** es la base del modelo de datos relacional.

## Autenticación y storage

**Supabase** participa en autenticación y almacenamiento, con controles de acceso y políticas RLS donde corresponde.

## IA

Gateway/capa de modelos y proveedores como **Gemini** para operaciones de producto. Detalle de producto: `inteligencia-artificial.md`.

## Integraciones de pagos

Mercado Pago y otros medios/configuraciones se habilitan de acuerdo con mercado, moneda y reglas de rollout. GoCuotas: Argentina. Ver `mercados-internacionalizacion.md`.

## Deploy

Admin y storefront tienen estrategias de despliegue/caching diferenciadas, reflejando necesidades distintas de frescura y rendimiento.

## Seguridad

Autenticación server-side, verificaciones de acceso por tenant/store y RLS en datos donde aplica. El cliente web **no debe convertirse en fuente de autoridad**.

No usar seguridad o controles internos como material público salvo decisión explícita.

## Multi-tenancy

Varias tiendas aisladas y acceso contextual por store. Un usuario puede tener múltiples tiendas.

## Imágenes

Se almacenan por tienda y forman parte de pipelines de compresión/procesamiento y, en ciertos flujos, mejora por IA.

## Importadores

Desde WhatsApp Business, planillas y flujos asistidos por IA.

## Performance

Server-first, caching del storefront, invalidación por tags y separación de deploys para mantener rendimiento y consistencia. UI/UX y velocidad son no negociables (`filosofia.md`).

## Áreas de dominio propio

Importación de catálogo con IA, edición de imágenes, actualización masiva de precios, motor de mercados y monedas, multi-tenancy, RBAC, catálogo de planes/ofertas, lógica de growth/billing.

## Deuda técnica documentada

**Alcance:** internal  
**Fuente:** `docs/tech-debt/tech-debt-tracker.md` en el core.

El core mantiene un tracker formal. Entre los temas abiertos:

- rate limiting en ciertas rutas de IA de onboarding;
- trazabilidad de origen de descuentos;
- optimización de contexto/acceso por tienda;
- restos de modelos legacy de billing;
- un workaround temporal de deploy;
- controles antifraude cruzados entre programas de growth;
- una definición más robusta de elegibilidad financiera de comisiones de Partners.

Debe servir para priorización y memoria institucional, no para copy público.

## Autoría

Prácticamente toda la infraestructura y el código fueron construidos y pensados técnicamente por **Carla**. Lucas lidera producto/UX. Ver `fundadores.md`.

## Ver también

- `inteligencia-artificial.md`
- `roadmap.md`
- `aprendizajes-limitaciones.md`
