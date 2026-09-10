# Mercados e internacionalización

**Snapshot:** 2026-09-10  
**Fuente canónica técnica:** `docs/product-specs/stores/regional-markets.md` en el core de Mercantis (no en este repo).

Distinguir siempre:

- **capacidad técnica** de un mercado (país seleccionable);
- **evidencia de clientes/ventas reales** en ese mercado (hoy concentrada en Argentina).

## Cómo funciona una tienda respecto de país y moneda

Cada tienda opera en un **país seleccionado** y una **moneda operacional** confirmada.

El país determina locale, formato de direcciones y teléfonos, timezone inicial y disponibilidad de capacidades. La moneda determina cómo se expresan productos, pedidos y comportamiento de ciertos proveedores de pago.

Una tienda **no mezcla libremente países** como si fuera un sistema global de shipping. El fulfillment actual es **doméstico al país de la tienda** y no existe un motor global de conversión FX para sumar métricas de monedas distintas.

## Medios de pago básicos regionales

**Estado:** live según contrato regional

Efectivo, transferencia bancaria del comercio y métodos personalizados están disponibles en **todos los mercados soportados**.

**Mercado Pago** tiene defaults locales en Argentina, Chile, Colombia, México, Perú y Uruguay, sujeto a reglas de país/moneda y overrides de rollout.

**GoCuotas:** live **sólo en Argentina**. No inferir internacional.

## Límites regionales del MVP

El MVP regional **no incluye**:

- traducciones multilingües;
- motor fiscal internacional;
- facturación fiscal global;
- envíos internacionales;
- conversión FX para reporting global.

Esos límites deben ser explícitos para evitar inferir capacidades por el simple hecho de que el país sea seleccionable.

## Expansión global

**Estado:** vision / capacidad técnica LATAM live

El core ya avanzó desde un supuesto Argentina-only hacia un modelo explícito de mercados, monedas, locale, timezone y disponibilidad de proveedores por país. La expansión **fuera de LATAM** todavía requiere producto y estrategia adicional.

Comunicación LATAM: conservar identidad argentina/voseo (`contenido-comunicacion.md`).

## Los 16 mercados soportados

Para evitar ambigüedad entre “mercado soportado” y “proveedor de pago local”:

### Argentina (AR)

- moneda default ARS; seleccionables ARS y USD;
- locale `es-AR`; timezone `America/Argentina/Buenos_Aires`;
- Mercado Pago disponible en moneda local según rollout;
- **GoCuotas live**;
- flujo específico de referencia/protección de precios en USD para tiendas en ARS (no es FX global).

Base de clientes actual concentrada aquí.

### Bolivia (BO)

- default BOB; seleccionables BOB y USD; `es-BO`; `America/La_Paz`; sin Mercado Pago por default.

### Chile (CL)

- default CLP; CLP y USD; `es-CL`; `America/Santiago`; Mercado Pago en moneda local según rollout.

### Colombia (CO)

- default COP; COP y USD; `es-CO`; `America/Bogota`; Mercado Pago según rollout.

### Costa Rica (CR)

- default CRC; CRC y USD; `es-CR`; `America/Costa_Rica`; sin Mercado Pago por default.

### Ecuador (EC)

- default USD; seleccionable USD; `es-EC`; `America/Guayaquil`; sin Mercado Pago por default.

### El Salvador (SV)

- default USD; `es-SV`; `America/El_Salvador`; sin Mercado Pago por default.

### Guatemala (GT)

- default GTQ; GTQ y USD; `es-GT`; `America/Guatemala`; sin Mercado Pago por default.

### Honduras (HN)

- default HNL; HNL y USD; `es-HN`; `America/Tegucigalpa`; sin Mercado Pago por default.

### México (MX)

- default MXN; MXN y USD; `es-MX`; `America/Mexico_City`; Mercado Pago según rollout.

### Panamá (PA)

- default USD; `es-PA`; `America/Panama`; sin Mercado Pago por default.

### Paraguay (PY)

- default PYG; PYG y USD; `es-PY`; `America/Asuncion`; sin Mercado Pago por default.

### Perú (PE)

- default PEN; PEN y USD; `es-PE`; `America/Lima`; Mercado Pago según rollout.

### Puerto Rico (PR)

- default USD; `es-PR`; `America/Puerto_Rico`; sin Mercado Pago por default.

### República Dominicana (DO)

- default DOP; DOP y USD; `es-DO`; `America/Santo_Domingo`; sin Mercado Pago por default.

### Uruguay (UY)

- default UYU; UYU y USD; `es-UY`; `America/Montevideo`; Mercado Pago según rollout.

Claim defendible: “Mercantis soporta 16 mercados de LATAM” **en sentido técnico**. No equivale a afirmar clientes activos o facturación relevante en los 16.

## Ver también

- `funcionalidades.md`
- `claims.md`
- `contenido-comunicacion.md`
