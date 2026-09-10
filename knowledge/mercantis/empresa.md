# Empresa

**Snapshot:** 2026-09-10  
**Fuentes:** repositorios de Mercantis y landing; definición estratégica del fundador.

Este documento fija qué es Mercantis, qué problema resuelve y qué no es. Conserva dos niveles de lenguaje en paralelo: la **puerta de entrada comercial** (fácil de entender) y la **categoría estratégica** (hacia dónde evoluciona el producto).

## En una oración

Mercantis es el sistema operativo moderno de un negocio: una plataforma que busca concentrar en un solo lugar catálogo, tienda online, stock, pedidos, clientes, cobros, entregas, equipo, métricas y automatización, usando inteligencia artificial para que digitalizar y operar una PyME sea rápido, intuitivo y requiera la menor cantidad posible de trabajo manual.

La formulación “sistema operativo” es deliberadamente más amplia que “tienda online”. La tienda es una de las puertas de entrada más fáciles de comprender y sigue siendo una parte importante del producto, pero no define por sí sola la ambición de Mercantis.

## En 30 segundos

Mercantis es una solución todo en uno para digitalizar y gestionar un negocio. Permite crear un catálogo o tienda online, administrar stock y pedidos, configurar formas de pago y entrega, trabajar con distintos miembros del equipo y consultar métricas. A eso suma una capa de IA que ya acelera tareas como importar productos, categorizarlos, generar o mejorar textos y editar imágenes.

La visión es seguir incorporando capacidades que normalmente quedarían repartidas entre un ecommerce, un ERP, un CRM, herramientas de marketing y sistemas administrativos, **pero sin trasladar esa complejidad al usuario**. La interfaz debe mostrar sólo lo que cada negocio necesita y, a futuro, un agente debería entender el rubro y el contexto del comercio para ayudar a configurar y operar el sistema.

Al snapshot actual, Mercantis está técnicamente preparado para operar tiendas en **16 mercados de Latinoamérica**. La base de clientes actual, sin embargo, **sigue concentrada en Argentina**. Esa diferencia entre **capacidad técnica** y **tracción comercial real** debe conservarse siempre.

## Qué es técnicamente

Mercantis combina características de ecommerce, ERP y CRM, con componentes de marketing y automatización. Es un **SaaS multi-tenant** con backoffice administrativo y storefront separados, construido alrededor de entidades operativas reales: tiendas, productos, variantes, stock, pedidos, clientes, medios de pago, medios de entrega, miembros de equipo, permisos, métricas, suscripciones y mercados.

Stack principal: Next.js, React y TypeScript; PostgreSQL con Drizzle ORM; Supabase para autenticación y almacenamiento; capa de IA integrada a distintas operaciones del producto.

La tesis técnica no es construir una colección de herramientas independientes, sino un **modelo coherente del negocio** que pueda ser operado tanto mediante interfaz como, cada vez más, mediante automatización y agentes.

**Trazabilidad:** documentación de arquitectura y product specs del core.

## Qué quiere ser en 3 a 5 años

**Estado:** vision

La ambición es que Mercantis sea el sistema operativo predeterminado para gestionar un negocio moderno y AI-native, con alcance global. Debe poder servir tanto a una persona que recién empieza a vender como a una empresa grande con equipo, varias sucursales y operaciones complejas.

La referencia negativa explícita es el software corporativo gigantesco y pesado: Mercantis **no quiere convertirse en un SAP para PyMEs**. La referencia aspiracional es una experiencia comparable filosóficamente con Apple: tecnología muy potente debajo, una interfaz pulida y minimalista arriba, y la sensación de que usarla coloca al negocio a la vanguardia.

La visión de IA incluye que el sistema pueda conocer el negocio, adaptar configuraciones y superficies según el caso de uso y asistir conversacionalmente al usuario. A mediano plazo también existe una apuesta por interfaces de tienda más generativas: que el usuario pueda describir o pedir cambios y que el sistema los construya sin depender de una biblioteca infinita de plantillas.

## Qué NO es Mercantis

Mercantis no es solamente una tienda online, un catálogo virtual ni un sistema de stock. Tampoco quiere ser un ERP corporativo tradicional ni una colección de módulos que obligue al usuario a aprender un manual para empezar.

No debe convertirse en un software corporativo aburrido, visualmente anticuado o cargado de opciones por el simple hecho de tener más funcionalidades. El crecimiento del producto sólo es válido si la experiencia sigue ayudando al dueño del negocio a ganar claridad.

El fundador expresó una frontera de marca concreta: **Mercantis jamás debería terminar sintiéndose como Tiendanube en términos de complejidad de configuración y curva de aprendizaje**. Esto se registra como **principio interno de producto**, no como claim comparativo objetivo sin benchmark.

## El problema fundamental

**Mercantis combate el costo de operar un negocio con información fragmentada, procesos manuales y software que obliga al comerciante a adaptarse a la herramienta en vez de adaptar la herramienta al negocio.**

El problema no es sólo “no tener una tienda”. Un comercio puede vender y aun así vivir atrapado entre WhatsApp, Excel, memoria, sistemas parciales, cobros dispersos, stock poco confiable y tareas repetitivas. Eso consume tiempo, dificulta delegar, vuelve borrosa la situación financiera y hace que el crecimiento agregue caos en vez de capacidad.

Mercantis busca transformar esa operación en un sistema legible: que el dueño pueda saber qué tiene, qué vendió, qué tiene que entregar, quién compró, cuánto ingresó, cómo está el stock y, progresivamente, cómo está la salud financiera del negocio.

Esta formulación reemplaza la necesidad de pedirle al fundador una frase abstracta adicional.

## El problema superficial que cree tener el cliente

Suele aparecer primero como una necesidad concreta: “quiero una tienda”, “quiero ordenar el stock”, “necesito ofrecer más medios de pago”, “quiero dejar de responder lo mismo por WhatsApp” o “digitalizar mi negocio parece demasiado complicado o caro”.

Mercantis utiliza esas necesidades como puerta de entrada. La oportunidad más grande aparece después: mostrar que detrás de cada una existe una operación completa que puede simplificarse y conectarse.

## El problema profundo que muchas veces el cliente todavía no ve

El cliente muchas veces no dimensiona dos costos de oportunidad.

1. **No estar online:** un negocio exclusivamente físico deja sin explotar un canal adicional de ventas y obliga a que muchas consultas y decisiones dependan de conversación manual.
2. **Operar de forma manual lo que podría delegarse a software:** responder consultas repetitivas, revisar stock, cargar y editar productos, organizar pedidos, controlar cobros y reconstruir números. Es tiempo y energía del dueño que podrían utilizarse para pensar productos, servicio, marketing, expansión o decisiones de mayor nivel.

Una parte difícil de la venta de Mercantis es educativa: algunos prospectos todavía no buscan una solución porque no identificaron el costo del sistema informal con el que ya trabajan. Los leads que ya utilizaron un ecommerce, un ERP o un POS suelen comprender más rápido la categoría y pueden comparar la experiencia con mayor facilidad.

## Qué usaría un cliente si Mercantis no existiera

El stack alternativo real no es único:

- **WhatsApp + Excel/Google Sheets:** operación informal basada en chats y planillas.
- **Tienda online establecida:** Tiendanube, Shopify, Empretienda u otra plataforma local.
- **ERP o sistema de gestión:** para negocios que ya formalizaron parte de la operación.
- **POS:** cuando la prioridad principal es la venta física y caja.
- **Software enlatado/local:** herramientas instaladas por técnicos o sistemas comprados como solución puntual para stock y administración.
- **Combinación de varias de las anteriores:** algo para vender, otra cosa para stock, otra para cobrar y WhatsApp como capa de conversación.

Mercantis compite tanto contra productos específicos como contra el **“stack accidental”** del comerciante.

## Cuándo empieza a buscar una solución como Mercantis

El disparador más claro es el **ahogo operativo**. El dueño siente que ya no le alcanza el tiempo para responder mensajes, revisar stock, cargar información, organizar pedidos, cobrar y ejecutar tareas repetitivas.

Otro disparador es el deseo concreto de abrir un canal online y descubrir que las alternativas percibidas son caras, complejas o requieren demasiada preparación.

Mercantis aparece especialmente bien posicionado cuando el comerciante ya reconoce que necesita delegar parte de la operación a un sistema. El reto más difícil está en quienes todavía normalizan el caos y no perciben su costo.

## Qué tendría que pasar para merecer llamarse “sistema operativo”

**Estado:** vision — describe dirección de integración, no cobertura actual.

El alcance futuro excede ecommerce. El fundador espera que Mercantis pueda concentrar progresivamente:

- catálogo, stock, pedidos y clientes;
- cobros y medios de pago;
- caja;
- facturación;
- métricas y salud financiera;
- parte de la contabilidad;
- proveedores;
- sucursales y equipos;
- otros módulos de gestión que hoy suelen asociarse a un ERP.

No implica que todas esas áreas estén live hoy.

## Transformación deseada a seis meses

**Estado:** objetivo de producto (mezcla live + roadmap)

1. **Ahorro de tiempo:** menos horas gastadas en procesos manuales y repetitivos.
2. **Orden y claridad:** operación centralizada, métricas claras y mejor conocimiento de stock, pedidos, clientes e ingresos.
3. **Ampliación del canal comercial:** además de las ventas físicas que ya existían, el negocio debería haber incorporado ventas online.

El resultado humano buscado es que el dueño sienta que está conduciendo el negocio con información y un sistema, no sobreviviendo a una sucesión de tareas.

No convertir “ahorrás X horas” o “aumentás X% las ventas” en claim sin evidencia. Ver `claims.md`.

## Un martes antes y después

### Antes

El comercio opera con sensación de caos. El dueño no tiene una dirección clara ni números fácilmente disponibles. Puede desconocer cuáles son los productos más vendidos, qué stock real queda, qué pedidos tiene pendientes, qué clientes compran más o cómo viene la facturación. Cobrar y ofrecer alternativas de pago puede requerir coordinación manual. La información está repartida y cada pregunta obliga a buscar, recordar o reconstruir.

### Después

El objetivo es que el mismo comerciante tenga stock, catálogo, pedidos, clientes, cobros y métricas visibles en un sistema coherente. Debe poder consultar qué está ocurriendo, qué necesita atención y qué acciones puede delegar.

A medida que se incorporen caja, facturación, sucursales y métricas más profundas, esa diferencia debe abarcar también la salud financiera y administrativa. El “después” expresa objetivo de producto: distinguir capacidades live de roadmap.

## Ver también

- `posicionamiento.md` — categoría y moat
- `producto.md` — aha moment, núcleo, demo
- `roadmap.md` — qué falta para ser “sistema operativo”
- `filosofia.md` — contra qué pelea y límites duros
