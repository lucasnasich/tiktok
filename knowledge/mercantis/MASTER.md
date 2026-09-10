# Mercantis Brain — MASTER

**Rol:** fuente maestra integral (backup semántico) del Mercantis Brain.

**Snapshot:** 10 de septiembre de 2026

**Uso:** este archivo conserva la radiografía confirmada completa. Los documentos de dominio en esta carpeta fragmentan el mismo conocimiento para consulta selectiva. Si un documento de dominio y MASTER entran en conflicto, prevalece la información **más reciente explícitamente marcada**. Si no hay fecha posterior, prevalece MASTER.

**Origen:** `Mercantis_Base_de_Conocimiento_Confirmada_2026-09-10.md`

**Consulta selectiva:** empezar por `README.md`. Abrir MASTER sólo cuando se necesite contexto transversal, haya ambigüedad, o se deba verificar que no se perdió detalle.

---

# Mercantis — Base de conocimiento confirmada

**Snapshot:** 10 de septiembre de 2026

**Propósito:** conservar en un documento estable todo lo que quedó suficientemente respondido después del barrido del core de Mercantis, su landing y las entrevistas directas con el fundador. Este archivo registra producto, arquitectura, historia, fundadores, posicionamiento, visión, aprendizajes y criterios de decisión que ya pueden tratarse como contexto de trabajo, con condiciones cuando corresponden.

> Regla de lectura: “confirmado” significa suficientemente respaldado por repositorios y/o definición explícita del fundador al momento del snapshot. Pricing, disponibilidad por país, programas e integraciones siguen siendo datos versionables y deben revalidarse antes de reutilizarlos mucho tiempo después.


## Fuentes de alto nivel
- **Core:** `carlapalmieri/mercantis` — `master`. Arquitectura, specs de producto, Help Center, mercados, billing, growth, RBAC, IA y tech debt.
- **Landing:** `carlapalmieri/mercantis-landing` — `rama principal analizada`. Posicionamiento, pricing, verticales, copy, Socios y claims públicos.


# 1. Identidad, categoría y problema que resuelve

Este bloque fija la definición más completa disponible de Mercantis a partir del producto actual, los repositorios y la explicación directa del fundador. Conviene conservar dos niveles de lenguaje en paralelo: la **puerta de entrada comercial**, que debe ser fácil de entender, y la **categoría estratégica**, que expresa hacia dónde está evolucionando el producto.


## ¿Qué es Mercantis en una oración?

Mercantis es el sistema operativo moderno de un negocio: una plataforma que busca concentrar en un solo lugar catálogo, tienda online, stock, pedidos, clientes, cobros, entregas, equipo, métricas y automatización, usando inteligencia artificial para que digitalizar y operar una PyME sea rápido, intuitivo y requiera la menor cantidad posible de trabajo manual.

La formulación “sistema operativo” es deliberadamente más amplia que “tienda online”. La tienda es una de las puertas de entrada más fáciles de comprender y sigue siendo una parte importante del producto, pero no define por sí sola la ambición de Mercantis.

**Trazabilidad:** repositorios de Mercantis y landing; definición estratégica del fundador, 2026-09-10.


## ¿Cómo se explica Mercantis en 30 segundos?

Mercantis es una solución todo en uno para digitalizar y gestionar un negocio. Permite crear un catálogo o tienda online, administrar stock y pedidos, configurar formas de pago y entrega, trabajar con distintos miembros del equipo y consultar métricas. A eso suma una capa de IA que ya acelera tareas como importar productos, categorizarlos, generar o mejorar textos y editar imágenes.

La visión es seguir incorporando capacidades que normalmente quedarían repartidas entre un ecommerce, un ERP, un CRM, herramientas de marketing y sistemas administrativos, pero sin trasladar esa complejidad al usuario. La interfaz debe mostrar sólo lo que cada negocio necesita y, a futuro, un agente debería entender el rubro y el contexto del comercio para ayudar a configurar y operar el sistema.

Al snapshot actual, Mercantis está técnicamente preparado para operar tiendas en 16 mercados de Latinoamérica. La base de clientes actual, sin embargo, sigue concentrada en Argentina. Esa diferencia entre **capacidad técnica** y **tracción comercial real** debe conservarse siempre.

**Trazabilidad:** producto actual, mercados regionales y explicación del fundador.


## ¿Qué es Mercantis técnicamente?

Mercantis combina características de ecommerce, ERP y CRM, con componentes de marketing y automatización. Técnicamente es un SaaS multi-tenant con backoffice administrativo y storefront separados, construido alrededor de entidades operativas reales: tiendas, productos, variantes, stock, pedidos, clientes, medios de pago, medios de entrega, miembros de equipo, permisos, métricas, suscripciones y mercados.

Su stack principal incluye Next.js, React y TypeScript; PostgreSQL con Drizzle ORM; Supabase para autenticación y almacenamiento; y una capa de IA integrada a distintas operaciones del producto.

La tesis técnica no es construir una colección de herramientas independientes, sino un modelo coherente del negocio que pueda ser operado tanto mediante interfaz como, cada vez más, mediante automatización y agentes.

**Trazabilidad:** documentación de arquitectura y product specs del core.


## ¿Qué quiere ser Mercantis en 3 a 5 años?

La ambición es que Mercantis sea el sistema operativo predeterminado para gestionar un negocio moderno y AI-native, con alcance global. Debe poder servir tanto a una persona que recién empieza a vender como a una empresa grande con equipo, varias sucursales y operaciones complejas.

La referencia negativa explícita es el software corporativo gigantesco y pesado: Mercantis no quiere convertirse en un SAP para PyMEs. La referencia aspiracional es una experiencia comparable filosóficamente con Apple: tecnología muy potente debajo, una interfaz pulida y minimalista arriba, y la sensación de que usarla coloca al negocio a la vanguardia.

La visión de IA incluye que el sistema pueda conocer el negocio, adaptar configuraciones y superficies según el caso de uso y asistir conversacionalmente al usuario. A mediano plazo también existe una apuesta por interfaces de tienda más generativas: que el usuario pueda describir o pedir cambios y que el sistema los construya sin depender de una biblioteca infinita de plantillas.

**Trazabilidad:** visión del fundador, 2026-09-10.


## ¿Qué NO es Mercantis?

Mercantis no es solamente una tienda online, un catálogo virtual ni un sistema de stock. Tampoco quiere ser un ERP corporativo tradicional ni una colección de módulos que obligue al usuario a aprender un manual para empezar.

No debe convertirse en un software corporativo aburrido, visualmente anticuado o cargado de opciones por el simple hecho de tener más funcionalidades. El crecimiento del producto sólo es válido si la experiencia sigue ayudando al dueño del negocio a ganar claridad.

El fundador expresó además una frontera de marca concreta: **Mercantis jamás debería terminar sintiéndose como Tiendanube en términos de complejidad de configuración y curva de aprendizaje**. Esta afirmación se registra como principio interno de producto, no como claim comparativo objetivo sin benchmark.

**Trazabilidad:** visión del fundador y principios de UX/copy.


## ¿Cuál es el problema fundamental que resuelve?

La formulación más completa, a partir del producto y del relato del fundador, es la siguiente:

**Mercantis combate el costo de operar un negocio con información fragmentada, procesos manuales y software que obliga al comerciante a adaptarse a la herramienta en vez de adaptar la herramienta al negocio.**

El problema no es sólo “no tener una tienda”. Un comercio puede vender y aun así vivir atrapado entre WhatsApp, Excel, memoria, sistemas parciales, cobros dispersos, stock poco confiable y tareas repetitivas. Eso consume tiempo, dificulta delegar, vuelve borrosa la situación financiera y hace que el crecimiento agregue caos en vez de capacidad.

Mercantis busca transformar esa operación en un sistema legible: que el dueño pueda saber qué tiene, qué vendió, qué tiene que entregar, quién compró, cuánto ingresó, cómo está el stock y, progresivamente, cómo está la salud financiera del negocio.

**Trazabilidad:** síntesis derivada del producto actual + definición explícita del fundador. Esta formulación reemplaza la necesidad de pedirle al fundador una frase abstracta adicional.


## ¿Cuál es el problema superficial que cree tener el cliente?

El problema suele aparecer primero como una necesidad concreta: “quiero una tienda”, “quiero ordenar el stock”, “necesito ofrecer más medios de pago”, “quiero dejar de responder lo mismo por WhatsApp” o “digitalizar mi negocio parece demasiado complicado o caro”.

Mercantis utiliza esas necesidades como puerta de entrada. La oportunidad más grande aparece después: mostrar que detrás de cada una existe una operación completa que puede simplificarse y conectarse.

**Trazabilidad:** landing, onboarding y explicación del fundador.


## ¿Cuál es el problema profundo que muchas veces el cliente todavía no ve?

El cliente muchas veces no dimensiona dos costos de oportunidad.

El primero es **no estar online**: un negocio exclusivamente físico deja sin explotar un canal adicional de ventas y obliga a que muchas consultas y decisiones dependan de conversación manual.

El segundo es **operar de forma manual lo que podría delegarse a software**: responder consultas repetitivas, revisar stock, cargar y editar productos, organizar pedidos, controlar cobros y reconstruir números. Es tiempo y energía del dueño que podrían utilizarse para pensar productos, servicio, marketing, expansión o decisiones de mayor nivel.

Una parte difícil de la venta de Mercantis es, por lo tanto, educativa: algunos prospectos todavía no buscan una solución porque no identificaron el costo del sistema informal con el que ya trabajan. Los leads que ya utilizaron un ecommerce, un ERP o un POS suelen comprender más rápido la categoría y pueden comparar la experiencia con mayor facilidad.

**Trazabilidad:** relato del fundador.


## ¿Qué usaría un cliente si Mercantis no existiera?

El stack alternativo real no es único. Los reemplazos más frecuentes pueden agruparse así:

- **WhatsApp + Excel/Google Sheets:** operación informal basada en chats y planillas.
- **Tienda online establecida:** Tiendanube, Shopify, Empretienda u otra plataforma local.
- **ERP o sistema de gestión:** para negocios que ya formalizaron parte de la operación.
- **POS:** cuando la prioridad principal es la venta física y caja.
- **Software enlatado/local:** herramientas instaladas por técnicos o sistemas comprados como solución puntual para stock y administración.
- **Combinación de varias de las anteriores:** algo para vender, otra cosa para stock, otra para cobrar y WhatsApp como capa de conversación.

Mercantis compite, por tanto, tanto contra productos específicos como contra el “stack accidental” del comerciante.

**Trazabilidad:** explicación del fundador y alcance funcional del producto.


## ¿Cuál es el momento en que un comerciante empieza a buscar una solución como Mercantis?

El disparador más claro es el **ahogo operativo**. El dueño siente que ya no le alcanza el tiempo para responder mensajes, revisar stock, cargar información, organizar pedidos, cobrar y ejecutar tareas repetitivas.

Otro disparador es el deseo concreto de abrir un canal online y descubrir que las alternativas percibidas son caras, complejas o requieren demasiada preparación.

Mercantis aparece especialmente bien posicionado cuando el comerciante ya reconoce que necesita delegar parte de la operación a un sistema. El reto más difícil está en quienes todavía normalizan el caos y no perciben su costo.

**Trazabilidad:** definición del fundador.


## ¿Cuál es el “aha moment” actual más potente?

El momento de mayor demostración de valor ocurre durante la digitalización del catálogo. El flujo descrito por el fundador es:

1. importar productos desde información disponible en distintos formatos;
2. usar IA para estructurar los datos y quitar gran parte del trabajo manual;
3. incorporar las imágenes de producto y asociarlas;
4. categorizar automáticamente productos con IA, incluyendo categorías y subcategorías;
5. generar o mejorar títulos, descripciones, categorías e imágenes por producto.

La dirección próxima incluye matching automático de imágenes por IA y operaciones batch para aplicar transformaciones a muchos productos a la vez.

Este conjunto produce el “wow” porque actividades que normalmente implicarían horas o días de carga pueden concentrarse en pocos minutos.

**Trazabilidad:** capacidades actuales + roadmap próximo explicado por el fundador.


## ¿Qué capacidad sorprende más hoy?

La edición y generación/mejora de imágenes con IA es una de las capacidades que más sorpresa produce. El fundador observa que los usuarios reaccionan especialmente bien cuando una foto simple de producto se transforma en una imagen visualmente profesional conservando la esencia del producto.

Este efecto es importante para contenido y demos porque el antes/después puede entenderse instantáneamente. Sin embargo, el valor sostenido de Mercantis no se reduce a la imagen: la mejora está conectada al catálogo y a la operación.

**Trazabilidad:** producto actual y feedback cualitativo del fundador.


## ¿Qué es lo más difícil de explicar de Mercantis?

La amplitud. Mercantis sirve a múltiples rubros y resuelve demasiados problemas para resumirlo con una sola feature. Enumerar todo produce una lista poco memorable; reducirlo a “tienda online” deja afuera gran parte de la propuesta.

El fundador identifica además un problema comunicacional: expresiones como “más fácil”, “más rápido” o “más intuitivo” describen de manera genuina el producto, pero están tan gastadas en SaaS que por sí solas no diferencian.

La solución estratégica es demostrar esas propiedades en vez de declararlas y apoyarse en una categoría más profunda: **un sistema operativo de negocio que elimina complejidad y trabajo manual**.

**Trazabilidad:** fundador + posicionamiento actual.


## ¿Qué feature perdió importancia estratégica?

Al inicio se sobrevaloró la estética del storefront y la necesidad de competir mediante cantidad de plantillas. La conclusión posterior fue que competir frontalmente con ecosistemas como Shopify o Tiendanube por volumen de templates es una batalla poco eficiente.

La diferenciación debería concentrarse más en “lo que está debajo del capó”: backoffice, lógica operacional, automatización, stock, pedidos, equipo, métricas y gestión.

A futuro, el fundador considera que la IA puede reducir todavía más la relevancia de las bibliotecas de plantillas mediante storefronts generativos, editables conversacionalmente.

**Trazabilidad:** evolución estratégica del fundador.


## ¿Qué capacidades que parecían secundarias ganaron importancia?

Caja, sucursales, métricas y rentabilidad se volvieron mucho más importantes a medida que Mercantis evolucionó desde tienda online hacia sistema operativo.

El objetivo es que el dueño no conozca sólo cuánto vende, sino también costos, ganancia, dinero en caja, performance por canal/sucursal y otros indicadores de salud del negocio. Caja se encuentra en desarrollo; sucursales y métricas financieras más profundas pertenecen al desarrollo/roadmap y no deben anunciarse como completamente disponibles hasta que corresponda.

**Trazabilidad:** fundador + estado del producto.


## Si hubiera que eliminar el 80% del producto, ¿qué debería sobrevivir?

El núcleo irreducible definido por el fundador incluye:

- manejo de stock;
- catálogo;
- recepción/flujo de pedidos por WhatsApp;
- métodos de pago;
- la capa de ahorro de tiempo mediante IA, especialmente importación de productos, categorización y edición/mejora de imágenes.

La interpretación estratégica es que Mercantis debe conservar siempre dos capacidades simultáneas: **una base operativa confiable** y **un mecanismo que reduzca drásticamente el trabajo necesario para mantenerla**.

**Trazabilidad:** fundador, 2026-09-10.


## ¿Qué tendría que pasar por Mercantis para merecer llamarse “sistema operativo”?

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

No implica que todas esas áreas estén live hoy. El concepto de sistema operativo describe **la dirección de integración del negocio**, no una promesa de que el producto ya cubre toda la administración empresarial.

**Trazabilidad:** visión del fundador.


## ¿Qué transformación debería experimentar un dueño después de seis meses?

La transformación deseada combina tres resultados:

1. **Ahorro de tiempo:** menos horas gastadas en procesos manuales y repetitivos.
2. **Orden y claridad:** operación centralizada, métricas claras y mejor conocimiento de stock, pedidos, clientes e ingresos.
3. **Ampliación del canal comercial:** además de las ventas físicas que ya existían, el negocio debería haber incorporado ventas online.

El resultado humano buscado es que el dueño sienta que está conduciendo el negocio con información y un sistema, no sobreviviendo a una sucesión de tareas.

**Trazabilidad:** fundador.


## ¿Cómo se ve un martes antes y después de Mercantis?

### Antes

El comercio opera con sensación de caos. El dueño no tiene una dirección clara ni números fácilmente disponibles. Puede desconocer cuáles son los productos más vendidos, qué stock real queda, qué pedidos tiene pendientes, qué clientes compran más o cómo viene la facturación.

Cobrar y ofrecer alternativas de pago puede requerir coordinación manual. La información está repartida y cada pregunta obliga a buscar, recordar o reconstruir.

### Después

El objetivo de Mercantis es que el mismo comerciante tenga stock, catálogo, pedidos, clientes, cobros y métricas visibles en un sistema coherente. Debe poder consultar qué está ocurriendo, qué necesita atención y qué acciones puede delegar.

A medida que se incorporen caja, facturación, sucursales y métricas más profundas, esa diferencia debe abarcar también la salud financiera y administrativa del negocio.

**Trazabilidad:** descripción del fundador; “después” expresa objetivo de producto y debe distinguir capacidades live de roadmap.


## ¿Cuál es la filosofía de IA y autonomía?

La IA debe ser **proactiva para observar y sugerir, pero conservadora para ejecutar**.

Puede analizar el estado del negocio y presentar sugerencias por iniciativa propia. Sin embargo, cuando una acción modifica información, configuración u operación, debe:

1. interpretar el pedido;
2. explicarlo o “pasarlo en limpio”;
3. mostrar qué acción propone realizar;
4. solicitar confirmación;
5. ejecutar sólo después de esa confirmación.

La visión no es un agente que opere silenciosamente sin control, sino un asistente muy inteligente que reduce carga cognitiva y trabajo, manteniendo al dueño como autoridad final.

**Trazabilidad:** filosofía explícita del fundador.


## ¿Qué principios de Apple quiere trasladar Mercantis?

La referencia a Apple no consiste en copiar una estética superficial. El fundador busca trasladar varios principios:

- **Vanguardia:** usar Mercantis debería sentirse como operar un negocio con herramientas del futuro y estar preparado para la era de IA.
- **Deseabilidad:** Mercantis debería convertirse en la forma “cheta”, moderna y aspiracional de llevar un negocio.
- **Minimalismo:** la interfaz evita ruido y complejidad innecesaria.
- **Pulido:** cada flujo debe sentirse cuidado, consistente y profesional.
- **Complejidad oculta:** mucha capacidad técnica debajo sin obligar al usuario a convivir con ella.
- **Placer de uso:** gestionar una empresa debería sentirse más claro, estimulante y hasta disfrutable gracias a la herramienta.

**Trazabilidad:** fundador.


## ¿Qué límites duros no debería cruzar Mercantis?

Aunque el fundador no quiso convertirlos en una lista abstracta de reglas, de su respuesta quedan confirmadas fronteras claras:

- no convertirse en software corporativo aburrido;
- no aumentar la complejidad cotidiana del emprendedor;
- no exigir estudio innecesario para comprender interfaces;
- no multiplicar clics, pasos o lectura si el mismo objetivo puede resolverse de forma más directa;
- no construir potencia a costa de claridad;
- no perder el propósito de asistir al dueño y darle lucidez sobre su negocio.

**Trazabilidad:** fundador.


## ¿Contra qué pelea Mercantis?

La postura de marca puede formularse así:

**Mercantis pelea contra el desorden, la desorganización, las tareas repetitivas y el software viejo que convierte operar un negocio en una experiencia innecesariamente compleja.**

También pelea contra la falta de orientación: administrar una empresa sin saber con claridad qué vendió, qué tiene, qué debe hacer a continuación o hacia dónde se está moviendo.

La aspiración opuesta es fuerte: **hacer que manejar una empresa se sienta claro, intuitivo, placentero y motivador**, incluso cuando emprender siga siendo una tarea difícil.

**Trazabilidad:** formulación directa del fundador.


## ¿Qué evidencia cualitativa existe de migraciones desde otras herramientas?

El fundador reporta varios clientes provenientes de Tiendanube y Empretienda, además de negocios sin una plataforma moderna que utilizaban software enlatado instalado localmente por técnicos o adquirido como solución puntual.

El patrón de feedback que más se repite en esas migraciones es la sorpresa por la facilidad y velocidad con la que pueden hacer tareas dentro de Mercantis. También aparece valoración por el ritmo de mejora del producto: clientes que destacan que la plataforma continúa incorporando capacidades en vez de quedar estancada.

Existen relatos de usuarios que pasaron meses pagando otras plataformas sin terminar de dejar lista su tienda por la curva de aprendizaje. Por ahora deben tratarse como **historias cualitativas individuales**, no como una afirmación estadística general sobre esos competidores, hasta documentar casos, capturas y tiempos concretos.

**Trazabilidad:** fundador; evidencia cualitativa interna.


## ¿Cuál debería ser una demo de cinco minutos?

La demo más representativa hoy consiste en partir de información de productos desordenada y mostrar cómo Mercantis la convierte en una base utilizable:

1. importar productos;
2. dejar que la IA estructure la información;
3. asociar y mejorar imágenes;
4. categorizar productos;
5. generar/refinar contenido del catálogo;
6. mostrar cómo ese catálogo ya alimenta stock, pedidos y tienda.

La demo funciona porque hace visible el principio central de Mercantis: **el sistema hace trabajo real por el comerciante y lo deja más cerca de vender en minutos, no sólo le ofrece más pantallas para configurar**.

**Trazabilidad:** producto actual + criterio del fundador.

# 2. Origen e historia de Mercantis

Este bloque registra la historia del origen contada directamente por Lucas Nasich. Es memoria institucional interna y debe conservar el contexto humano, económico y de aprendizaje; no convertirla en una cronología corporativa pulida que elimine las dificultades reales.


## Contexto anterior: del empleo a emprender

Antes de Mercantis, Lucas trabajaba como ingeniero de datos en Naranja X. Carla Palmieri trabajaba como software engineer en Conexia para un cliente colombiano.

Lucas dejó Naranja X por una desvinculación vinculada a cuestiones personales. En vez de tomar ese episodio únicamente como un retroceso, decidió utilizarlo como oportunidad para emprender.

En ese momento Lucas y Carla vivían juntos en una casa en barrio Marqués de Sobremonte, Córdoba Capital. Ambos tenían buenos ingresos y contaban con runway para intentar construir un producto propio.

**Trazabilidad:** relato de Lucas Nasich, 2026-09-10.


## La primera startup conjunta: Curbal

El primer proyecto de startup de Lucas fue **Curbal**, una plataforma educativa basada en inteligencia artificial. Su propuesta era actuar como copiloto para estudiantes y ayudar a retener mejor información mediante técnicas como repaso espaciado, generación de flashcards, resúmenes y otras herramientas de estudio.

Lucas comenzó construyendo el proyecto y Carla se entusiasmó con la idea. Carla dejó su empleo para sumarse y fue la primera vez que emprendieron formalmente juntos.

Trabajaron aproximadamente un año. Curbal alcanzó alrededor de **5.000 usuarios registrados** pero sólo aproximadamente **USD 200 de facturación mensual**. El producto tenía plan gratuito y consiguió alcance, pero la conversión a pago fue muy baja.

Ese resultado dejó una enseñanza estructural: una startup puede obtener usuarios y atención sin haber encontrado un modelo económico suficiente. También aprendieron que no conviene pasar demasiado tiempo construyendo y optimizando una propuesta cuando la evidencia de conversión sigue siendo débil.

Probaron distintas alternativas para mejorar la monetización, pero no lograron encontrar una palanca suficientemente fuerte. Finalmente el runway se agotó y decidieron cerrar/matar el proyecto.

**Trazabilidad:** relato del fundador. Cifras aproximadas, internas.


## Etapa freelance y problema que dio origen a Mercantis

Después de Curbal, Lucas y Carla realizaron trabajos freelance para volver a generar ingresos.

Durante esa etapa empezaron a aparecer consultas de amigos y conocidos que preguntaban cuánto costaría construirles una página o tienda a medida. Cuando Lucas preparaba presupuestos de desarrollo personalizado, muchos potenciales clientes los consideraban inalcanzables.

Ese patrón disparó la idea central: **si muchos comercios pequeños necesitan prácticamente la misma base —catálogo, stock sencillo y una forma de mostrar/vender productos—, ¿por qué obligarlos a pagar el costo de un desarrollo a medida?**

La oportunidad era productizar esa necesidad y convertirla en una suscripción accesible.

**Trazabilidad:** relato del fundador.


## Cuándo comenzó Mercantis

El fundador sitúa el comienzo de Mercantis alrededor de **febrero de 2026**.

A diferencia de Curbal, el enfoque inicial buscó validar más rápido. Antes y durante la construcción fueron preguntando a potenciales usuarios qué necesitaban y desarrollaron un MVP alrededor de necesidades muy concretas.

La primera propuesta se concentró en una tienda/catalogación simple, stock y herramientas básicas que se repetían entre comercios.

**Trazabilidad:** relato del fundador; fecha aproximada.


## Primera validación comercial

La primera validación no fue sólo conseguir registros, sino conseguir clientes dispuestos a pagar una suscripción anual.

En la etapa inicial consiguieron aproximadamente **cinco o seis clientes** que abonaron un plan anual promocional de **ARS 60.000**. El precio se ofrecía como condición temprana y quedaba congelado para esos primeros clientes.

Para Lucas y Carla ese cobro tenía un valor mucho mayor que el monto aislado: era la prueba inicial de que alguien estaba dispuesto a pagar por el nuevo producto.

**Trazabilidad:** relato del fundador. Cantidades aproximadas.


## Primer cliente pago: Francisco de Matera

El primer cliente pago identificado fue **Francisco**, de **Matera**, una tienda de mates ubicada en Villa de Soto.

Francisco pagó **ARS 60.000 por un año completo** dentro de la promoción inicial.

Usó Mercantis para cargar sus productos, gestionar stock, consultar cuánto llevaba facturado y disponer de una tienda donde ofrecer sus productos.

Lucas recuerda el primer pago como un momento muy emocionante porque representaba el primer acercamiento concreto a validar Mercantis con dinero real.

**Trazabilidad:** relato del fundador. Cliente identificable; antes de usar públicamente su historia debe confirmarse permiso.


## Evolución: de tienda online a all-in-one / sistema operativo

Mercantis no atravesó hasta ahora un pivot radical hacia un mercado completamente distinto. La evolución fue más bien una expansión de la tesis inicial.

Comenzó con mayor énfasis en tienda online y catálogo. Después el equipo comprendió que el valor más grande podía estar en convertir Mercantis en un **all-in-one operacional**, y finalmente en la idea más ambiciosa de **sistema operativo para negocios**.

La tienda sigue siendo parte central de la experiencia, pero el roadmap ahora incorpora áreas propias de gestión: caja, facturación, sucursales, métricas financieras, proveedores y automatización cada vez más profunda.

**Trazabilidad:** fundador + evolución observada en producto.


## Situación personal y nivel de compromiso durante la construcción

La historia de Mercantis está atravesada por una restricción financiera fuerte.

Después de agotar el runway de Curbal, hacer freelance y volver a apostar por un producto propio que todavía no generaba ingresos suficientes, Lucas y Carla decidieron bajar su costo de vida. Se mudaron desde Córdoba Capital a **Villa de Soto**, en el interior de Córdoba, y pasaron a vivir en la casa de los padres de Carla.

Durante esta etapa recibieron ayuda económica de sus familias para afrontar gastos y los dos quedaron fuertemente expuestos al mismo proyecto, sin una fuente de ingresos estable separada de Mercantis.

Lucas describe la situación como “quemar las naves”: producto, ventas, distribución, llamados, contenido y soporte ocurren al mismo tiempo, con recursos limitados y necesidad concreta de llevar el negocio a un nivel que al menos permita volver a pagarse un sueldo básico y alquilar nuevamente un lugar propio.

Este contexto es importante porque explica tanto la velocidad de ejecución buscada como la presión por mejorar distribución y rentabilidad. No debe utilizarse como recurso emocional de marketing público sin decisión explícita de los fundadores.

**Trazabilidad:** relato del fundador; información interna/personal.


## Señales de tracción disponibles al 10 de septiembre de 2026

El fundador reporta aproximadamente:

- **130 usuarios registrados**;
- **60 y pico de tiendas creadas**;
- alrededor de **30 tiendas suscriptas/pagas**.

Sobre las tiendas efectivamente creadas, Lucas calcula una conversión a suscripción cercana al **50%**. Considera esa tasa una señal muy prometedora de product-market fit temprano, aunque reconoce que probablemente baje a medida que aumente la adquisición y entren públicos menos calificados.

Estas cifras son aproximadas y expresadas oralmente. Antes de publicarlas como claim deben reemplazarse por un snapshot extraído de base de datos con definición exacta de usuario, tienda, trial y cliente pago.

El principal vacío actual no es que el producto haya sido expuesto masivamente y rechazado, sino que **todavía no tuvo suficiente distribución** como para conocer su potencial a gran escala.

**Trazabilidad:** fundador; cifras internas aproximadas al 2026-09-10.


## ¿Hubo momentos de querer abandonar?

No existe un episodio único registrado como “el día que decidimos abandonar”. La presión es más persistente: financieramente el equipo trabaja frecuentemente con muy poco margen y con el agua al cuello.

La dificultad proviene de sostener simultáneamente construcción de producto, adquisición, ventas, soporte y distribución mientras ambos fundadores dependen del mismo proyecto y viven en un contexto personal de costos mínimos.

A pesar de esa presión, la decisión actual es seguir apostando agresivamente por Mercantis.

**Trazabilidad:** fundador.


## ¿Hubo un momento claro de “acá hay algo grande”?

Todavía no hay una señal de distribución masiva que permita afirmarlo con seguridad.

Sí hubo momentos de entusiasmo por la magnitud potencial de distintas ideas del producto y por métricas tempranas como la conversión de tiendas creadas a suscripción. Para Lucas, la verdadera validación de “acá hay algo grande” llegará cuando Mercantis logre exponerse mucho más y sostenga interés/conversión a mayor escala.

Esta distinción es importante culturalmente: la ambición es enorme, pero el fundador no quiere confundir convicción con evidencia.

**Trazabilidad:** fundador.


## Error más caro: no distribuir desde el día uno

El fundador identifica como uno de los errores más costosos **no haber trabajado distribución desde el primer día**.

Eso incluye no haber construido en público, no mostrar sistemáticamente el día a día de la empresa y no haber desarrollado antes una máquina constante de contenido/distribución.

La consecuencia percibida es que Mercantis podría tener hoy mucha más visibilidad y, potencialmente, más clientes si producto y distribución hubieran avanzado en paralelo desde el comienzo.

Ésta es una de las razones por las que en septiembre de 2026 existe una prioridad fuerte por orgánico, redes, contenido y sistemas de producción de creativos.

**Trazabilidad:** fundador.


## Error que más enseñó: no construir para un lead que todavía no pagó

Otro aprendizaje explícito es **no desarrollar una feature solamente porque un lead promete convertirse si existe**.

En varias oportunidades el equipo tomó feedback de prospectos, construyó algo para cerrar la venta y luego el prospecto no se suscribió. Eso dejó al equipo absorbiendo el costo de desarrollo sin que existiera validación económica.

La regla aprendida es más estricta: feedback de clientes y leads importa, pero antes de comprometer desarrollo específico debe existir una señal real de pago o suficiente validación.

**Trazabilidad:** fundador.


## Aprendizaje de adquisición: outbound vs. inbound

La experiencia inicial del fundador sugiere que visitas en frío y llamados en frío pueden consumir mucho esfuerzo para un rendimiento limitado.

Lucas considera que un buen sistema de inbound, apoyado en contenido y distribución orgánica, puede ser más productivo. Esta conclusión sigue siendo una hipótesis operativa de Mercantis basada en experiencia temprana, no una verdad universal sobre adquisición.

**Trazabilidad:** fundador.


## ¿Qué construyeron demasiado temprano?

El foco excesivo en el storefront y en hacer que la tienda pública se viera especialmente bien consumió atención antes de que otras capas operativas estuvieran suficientemente maduras.

La conclusión actual es que el storefront debe ser bueno y pulido, pero no necesita competir por cantidad de templates. La ventaja estratégica debería venir del backoffice y de la capacidad de operar el negocio.

**Trazabilidad:** fundador.


## ¿Qué construyeron demasiado tarde?

El fundador identifica como áreas que deberían haber llegado antes:

- caja;
- facturación;
- sucursales;
- métricas más avanzadas, incluyendo costos, ganancia y salud financiera.

Actualmente el equipo está intentando acelerar estas áreas.

**Trazabilidad:** fundador.

# 3. Fundadores

Mercantis fue construido hasta el snapshot actual esencialmente por **dos personas: Lucas Nasich y Carla Palmieri**. No existe otro integrante que los fundadores identifiquen como fundamental en la historia del proyecto hasta este momento.


## Lucas Nasich

### Rol real

Lucas es cofundador y CEO, pero su rol cotidiano es deliberadamente generalista. Participa en producto, UX, definición de funcionalidades, priorización, ventas, distribución, contenido y conversaciones con clientes.

Describe su trabajo actual como “ser un pulpo”: existen demasiados frentes simultáneos y todavía no hay una división perfectamente ordenada del día. Normalmente piensa propuestas y direcciones, las conversa con Carla y juntos convierten esas conversaciones en tareas y prioridades.

Además del rol ejecutivo, Lucas considera que su responsabilidad como CEO incluye recordar que Mercantis no sólo debe construirse: también debe venderse y distribuirse.

**Trazabilidad:** relato de Lucas.

### Edad y formación

Al 10 de septiembre de 2026, Lucas tiene **29 años**.

Su formación es predominantemente técnica:

- colegio técnico, con especialización como **técnico automotor**;
- estudios universitarios de **Ingeniería Mecánica**, carrera que no terminó; llegó a cursar materias correspondientes aproximadamente a tercero, cuarto y quinto año;
- **Diplomatura en Ciencia de Datos**.

A esa base técnica suma un interés personal fuerte por dibujo, diseño de interfaces, UI y UX. No se define como especialista máximo en una única disciplina, sino como un generalista con capacidad suficiente en áreas muy distintas para conectar producto, tecnología, diseño y negocio.

**Trazabilidad:** relato de Lucas.

### Historia laboral anterior

El recorrido laboral relatado por Lucas incluye:

1. trabajo técnico en telecomunicaciones dentro de la empresa de su padre;
2. experiencia como mecánico en **Centro Motor Toyota**, vinculada a pasantías de su formación técnica;
3. estudios de Ingeniería Mecánica;
4. transición hacia datos mediante una Diplomatura en Ciencia de Datos;
5. trabajo como ingeniero de datos en **Core BI**;
6. trabajo como ingeniero de datos en **Naranja X**;
7. etapa de emprendimiento con Curbal;
8. trabajos freelance;
9. creación de Mercantis.

Esta trayectoria explica parte del perfil transversal del fundador: ingeniería, software/datos, diseño de producto, ventas y experiencia emprendiendo.

**Trazabilidad:** relato de Lucas.

### Experiencia emprendedora previa

Mercantis no fue el primer intento emprendedor de Lucas.

Antes había probado, entre otras cosas:

- venta de celulares;
- relaciones públicas en boliches;
- organización de eventos;
- numerosos proyectos personales que no llegaron a desarrollarse por completo, muchas veces por falta de presupuesto para contratar desarrollo.

Curbal fue la experiencia de startup más estructurada inmediatamente anterior a Mercantis y la primera que construyó en profundidad junto con Carla.

Para Lucas, emprender no es una actividad circunstancial sino una forma de vida y el tipo de trabajo que más le apasiona.

**Trazabilidad:** relato de Lucas.

### Fortalezas declaradas

Lucas destaca especialmente:

- intensidad y compromiso con sus objetivos;
- capacidad de sostener esperanza y energía en contextos difíciles;
- velocidad/celeridad para impulsar ideas;
- perfil generalista que conecta producto, tecnología, diseño y negocio;
- pasión por construir producto;
- sensibilidad visual y de UX.

En la dinámica con Carla, Lucas suele aportar entusiasmo y empuje cuando el contexto económico o la incertidumbre pesan más.

**Trazabilidad:** autoevaluación del fundador.

### Debilidades y riesgos personales reconocidos

Lucas identifica dos riesgos principales:

- **perfeccionismo**, que puede hacer que una idea tarde más de lo necesario en salir;
- **síndrome de impostor / preocupación por la reacción externa**, que en ocasiones lo llevó a postergar lanzamientos o distribución por sentir que algo todavía no era suficientemente bueno.

El propio fundador considera que esa tendencia tuvo un costo concreto en distribución y está trabajando para corregirla.

**Trazabilidad:** autoevaluación del fundador.

### Obsesión de producto

La obsesión principal de Lucas puede resumirse así:

> llevar al usuario del punto A al punto B con la menor cantidad de pasos posible, lo más rápido posible y haciendo que el proceso se sienta mágico.

Esto explica el énfasis permanente en UX, cantidad de clics, claridad, velocidad y automatización.

**Trazabilidad:** formulación del fundador.

### Aprendizajes principales como fundador

Entre los aprendizajes que Lucas ya identifica:

- nada es tan fácil ni tan rápido como parece desde afuera;
- construir un producto lleva tiempo;
- hay que lanzar más rápido;
- no conviene esperar a que algo sea perfecto para hablar de ello públicamente;
- producto y distribución deben construirse en paralelo;
- conviene validar funcionalidades con señales reales antes de invertir demasiado;
- los MVPs deben servir para aprender rápido, no para esconderse construyendo;
- todavía tiene mucho por aprender y considera su trayectoria emprendedora relativamente joven.

**Trazabilidad:** fundador.


## Carla Palmieri

### Rol real

Carla es cofundadora y CTO de Mercantis.

Su responsabilidad principal es la arquitectura y construcción técnica de la plataforma. Según Lucas, prácticamente toda la infraestructura y el código de Mercantis fueron construidos y pensados técnicamente por Carla.

Tiene autoridad sobre las decisiones de arquitectura, stack y viabilidad técnica. A nivel producto participa y opina, aunque la mayor parte de la ideación de funcionalidades y UX es liderada por Lucas.

**Trazabilidad:** relato de Lucas + perfil canónico de Mercantis.

### Formación y cambio de carrera

Carla cursó un secundario tradicional y luego comenzó la carrera de **Medicina**.

Completó aproximadamente los dos primeros años y decidió abandonar Medicina para aprender programación y entrar al mundo del software.

Ese cambio de trayectoria es parte importante de su historia: no siguió una formación universitaria informática convencional, sino que cambió deliberadamente de campo y construyó su carrera profesional en software.

**Trazabilidad:** relato de Lucas.

### Trayectoria laboral

Según el relato actual, su recorrido profesional incluye:

1. primer trabajo en **Biologic**;
2. paso a **Conexia**;
3. etapa emprendiendo junto con Lucas en **Curbal**;
4. experiencia posterior en **Mercado Libre**;
5. Mercantis como proyecto actual.

Las fechas exactas de cada transición no son necesarias para la radiografía actual salvo que en el futuro se quiera producir una cronología pública detallada.

**Trazabilidad:** relato de Lucas.

### Qué aporta Carla que Lucas no aporta

Carla cumple un rol de contrapeso estratégico y técnico.

Cuando Lucas llega muy impulsado por una nueva idea o por la posibilidad de seguir desarrollando producto, Carla suele introducir preguntas de secuencia y viabilidad:

- “esto todavía no”;
- “primero hay que hacer otra cosa”;
- “esto no es viable ahora”;
- “hay que dejar de construir tanto y hacer distribución”;
- “hay que vender/publicitar antes de sumar más producto”.

Esa capacidad ayuda a compensar la tendencia de Lucas a entusiasmarse con la construcción. Carla funciona como recordatorio de que el CEO también tiene que vender y distribuir.

Al mismo tiempo, Carla aporta la profundidad técnica que Lucas no concentra: arquitectura, stack, implementación, estabilidad y escalabilidad.

**Trazabilidad:** relato de Lucas.


## Cómo se conocieron Lucas y Carla

Lucas y Carla son pareja.

Se conocieron a través de contactos en común: un amigo de Lucas tenía una hermana que era muy amiga de Carla. Finalmente se cruzaron casualmente en el departamento de un amigo y allí comenzaron a conocerse.

La relación personal es anterior a Mercantis y ambos atravesaron juntos las etapas de Curbal, freelance y Mercantis.

**Trazabilidad:** relato de Lucas.


## Primera experiencia trabajando juntos

La primera vez que emprendieron juntos fue en Curbal.

Lucas comenzó el proyecto y Carla se fue involucrando hasta entusiasmarse lo suficiente como para dejar su trabajo y sumarse. Esa experiencia funcionó como entrenamiento conjunto de producto, tecnología, startup, adquisición y fracaso económico antes de Mercantis.

**Trazabilidad:** relato del fundador.


## Cómo reparten decisiones

Las decisiones relevantes se toman entre los dos.

El patrón habitual es que Lucas genere o lleve una propuesta y luego la discuta con Carla. Suelen coincidir con relativa rapidez en gran parte de las decisiones; cuando no coinciden, discuten hasta encontrar un punto común.

La separación natural de dominios es:

- **Lucas:** producto, UX, funcionalidad, estrategia, ventas/distribución y dirección general;
- **Carla:** arquitectura, stack, implementación técnica, viabilidad y disciplina/priorización;
- **ambos:** decisiones importantes de empresa y prioridades generales.

**Trazabilidad:** relato de Lucas.


## Autoría complementaria del producto

Según Lucas, la infraestructura y el código de Mercantis fueron principalmente construidos y diseñados técnicamente por Carla.

La experiencia de producto, los flujos, la UX y gran parte de las funcionalidades fueron principalmente pensadas por Lucas.

Esta división no significa que trabajen de forma aislada: ambos participan en las decisiones y se corrigen mutuamente, pero explica la complementariedad de sus perfiles.

**Trazabilidad:** fundador.


## Cómo impacta ser pareja y cofundadores

Los dos fundadores están expuestos simultáneamente al mismo riesgo económico y trabajan en el mismo proyecto. Eso hace que los momentos de presión financiera sean especialmente exigentes: no existe hoy un segundo ingreso estable que amortigüe el riesgo de Mercantis.

Lucas suele intentar aportar esperanza y paciencia en esos períodos; Carla aporta freno, priorización y recordatorio de que no todo se resuelve construyendo más software.

Este contexto es relevante para comprender la cultura de ejecución del equipo, pero es información interna/personal y no debe usarse públicamente sin decisión explícita.

**Trazabilidad:** relato de Lucas.


## ¿Hay otras personas fundamentales en la historia de Mercantis?

No hasta el snapshot actual.

Lucas es explícito en que Mercantis, hasta ahora, es esencialmente la historia de ellos dos. Familias y clientes fueron importantes como apoyo o validación, pero no hay un tercer integrante del equipo que deba documentarse como figura fundacional.

**Trazabilidad:** fundador.

# 4. Marca, personalidad y comunicación confirmada

La marca ya tiene reglas claras de sensación, tono y lenguaje. Este bloque captura únicamente lo que ya está suficientemente definido.



## ¿Por qué se llama Mercantis?

El nombre **Mercantis** fue elegido por Lucas en una etapa en la que necesitaban tomar una decisión rápida de identidad y diferenciarse de nombres demasiado literales del sector. La intención era evitar fórmulas del tipo “tienda”, “catálogo”, “cobrando” u otros nombres que describieran una feature puntual y quedaran atados a una categoría demasiado estrecha.

“Mercantis” nace semánticamente de **mercader / mercante / comercio**. El nombre busca remitir al acto de comerciar y a la figura del mercader sin sonar como una herramienta específica de ecommerce.

Lucas ideó el nombre y el logo el mismo día. Aunque el proceso fue rápido y no surgió de meses de branding formal, la identidad resultante terminó abriendo un universo simbólico que hoy sirve como base para profundizar toda la marca.

**Trazabilidad:** relato directo de Lucas, 2026-09-10.


## ¿Cuál es la relación de Mercantis con La Odisea?

La referencia principal es **La Odisea de Ulises**. Lucas interpreta el camino de un emprendedor o comerciante como una odisea propia: iniciar un negocio implica partir desde un punto de origen y atravesar incertidumbre, obstáculos, esfuerzo y riesgo hasta llegar a un objetivo como la rentabilidad, el punto de equilibrio, la estabilidad o el crecimiento.

En esa analogía:

- el **emprendedor/comerciante** es el navegante;
- el **negocio** es el viaje que tiene que sostener;
- las dificultades de emprender son el mar, las tormentas y los obstáculos;
- el **éxito sostenible** es el destino;
- **Mercantis es el barco/herramienta que ayuda a atravesar ese recorrido**.

La marca no plantea que Mercantis elimine la dificultad de emprender. La propuesta simbólica es acompañar al comerciante con una herramienta que le dé orden, claridad, información y capacidad durante un viaje que seguirá siendo exigente.

**Trazabilidad:** relato directo de Lucas.


## ¿Cómo se conectan La Odisea y los Argonautas?

El universo de marca mezcla deliberadamente referencias de **La Odisea** con la historia de **los Argonautas**. No se busca una reconstrucción mitológica académicamente pura, sino un lenguaje simbólico coherente alrededor de navegación, comercio, viaje, inteligencia y acompañamiento.

La referencia a los Argonautas es especialmente importante por **Argo**, el barco. En la interpretación de marca de Mercantis, Argo inspira el nombre del futuro agente inteligente del producto.

La lógica narrativa es:

**Mercantis es el barco que acompaña al negocio durante su odisea; Argo es la inteligencia que ayuda a navegar.**

**Trazabilidad:** definición de fundador.


## ¿Qué es Argo dentro de la visión de Mercantis?

**Argo** será el nombre de la guía/agente de IA de Mercantis. Todavía no debe tratarse como una capacidad general disponible.

Su función futura es acompañar al dueño de forma proactiva: observar contexto, sugerir mejoras, ayudar a configurar el sistema y ejecutar acciones cuando el usuario las apruebe.

La filosofía de autonomía ya definida es clara:

- Argo puede **analizar y sugerir proactivamente** sin que el usuario tenga que pedir cada insight.
- Antes de realizar una acción que cambie el negocio, debe **explicar/pasar en limpio lo que va a hacer y pedir confirmación**.
- El dueño conserva la decisión final sobre las acciones.

Este principio conecta el producto con el simbolismo del barco inteligente que ayuda a navegar en condiciones difíciles.

**Estado:** visión / próximo desarrollo; no publicitar como agente general ya disponible.

**Trazabilidad:** definición de fundador.


## ¿Qué representa el logo?

El logo fue concebido por Lucas junto con el nombre y combina tres símbolos en una única marca:

1. **Barco:** representa el vehículo que atraviesa la odisea del emprendimiento.
2. **Ancla:** refuerza el universo marítimo y la idea de estabilidad.
3. **Balanza/comercio:** conecta la identidad con el intercambio comercial y la actividad del mercader.

La intención desde el inicio fue obtener una identidad reconocible y distinta dentro de una categoría llena de naming y marcas demasiado literales.

**Trazabilidad:** relato directo de Lucas.


## ¿Qué lenguaje visual rodea a esta identidad?

La dirección buscada combina:

- composición **editorial**;
- **minimalismo**;
- superficies y UI muy pulidas;
- referencias visuales al **mar, océano, navegación y viaje**;
- sensación de vanguardia;
- tecnología preparada para la era de IA;
- una identidad suficientemente propia como para no parecer otra “tienda online” genérica.

El universo mitológico no obliga a llenar la comunicación de barcos o referencias explícitas. Funciona como una capa conceptual desde la cual construir metáforas, narrativa, dirección artística y nombres de producto.

**Trazabilidad:** definición de fundador y dirección creativa actual.

## ¿Qué debería sentir una persona al usar o conocer Mercantis?

La sensación principal buscada es confianza: que el usuario perciba que puede digitalizar y operar su venta sin ansiedad técnica, sin miedo a romper algo y sin necesitar una capacitación extensa.

La confianza no debe construirse con solemnidad corporativa sino con claridad, velocidad, lenguaje entendible y una interfaz que muestre qué hacer a continuación.

**Trazabilidad:** Fuentes: brief de marca y pautas de UX/copy.


## ¿Cuáles son tres adjetivos centrales de la marca?

Los tres adjetivos ya definidos son clara, confiable y operativa.

“Clara” implica lenguaje comprensible, jerarquía visual y pocas decisiones innecesarias. “Confiable” implica estabilidad, transparencia y evitar promesas que el producto no puede cumplir. “Operativa” significa que la comunicación tiene que ayudar a hacer cosas concretas: vender, cargar, ordenar, cobrar, entregar y entender el negocio.

**Trazabilidad:** Fuente: brief de marca de la landing.


## ¿Mercantis debe sentirse cercana?

Sí. La voz está diseñada para ser directa, comercial y cercana al lenguaje del comerciante, evitando jerga técnica e institucional innecesaria. En Argentina, la comunicación actual usa naturalmente el “vos”.

La cercanía no significa hablar con exceso de slang ni sacrificar precisión. La prioridad sigue siendo que el usuario entienda rápidamente el beneficio y la acción.

**Trazabilidad:** Fuentes: guías de copy y landing.


## ¿Mercantis debe sentirse ambiciosa?

Sí. La ambición es parte de la visión: construir una plataforma capaz de convertirse en el sistema operativo de referencia para negocios de distintos tamaños. Esa ambición, sin embargo, debe expresarse mediante producto y ejecución, no mediante claims grandilocuentes sin evidencia.

**Trazabilidad:** Fuente: visión estratégica del fundador.


## Vanguardia como parte de la marca

Mercantis no quiere comunicar solamente eficiencia. Debe transmitir que utilizarlo coloca al negocio a la vanguardia de una nueva forma de operar, especialmente frente a la transición hacia herramientas AI-native.

La aspiración es que Mercantis se vuelva una elección deseable y aspiracional para un comerciante: una señal de que su negocio está actualizado, ordenado y preparado para el futuro.

Eso no significa elitismo. “Premium” en Mercantis debe significar **experiencia pulida, tecnología avanzada y claridad**, no exclusión ni complejidad.

**Trazabilidad:** fundador.


## Placer de uso como objetivo

La experiencia de gestionar una empresa no puede dejar de ser exigente, pero Mercantis sí puede cambiar la experiencia del software que la acompaña.

El fundador quiere que organizar y llevar el negocio dentro de Mercantis genere claridad, entusiasmo y motivación. Los flujos deben sentirse naturales y, cuando sea posible, producir una sensación de “magia” al resolver en pocos pasos algo que antes era tedioso.

**Trazabilidad:** fundador.


## Postura de marca contra el software viejo

La postura más clara es anti-desorden y anti-complejidad innecesaria.

Mercantis se opone a interfaces antiguas que exigen demasiados clics, pasos, lectura o capacitación para resolver tareas simples. El usuario debería encontrar las cosas donde espera encontrarlas y comprender el recorrido sin estudiar el sistema.

La tecnología debe adaptarse al comerciante, no al revés.

**Trazabilidad:** fundador.



## Referencias de marca, estética y comunicación

Las referencias declaradas por el fundador no deben copiarse literalmente. Funcionan como brújula para entender qué tipo de calidad, actitud y comunicación resultan atractivas para Mercantis.

### Apple
Es la referencia visual y de producto más fuerte. Mercantis admira:
- minimalismo;
- interfaces y superficies extremadamente pulidas;
- sensación de producto premium sin necesidad de complejidad visible;
- consistencia;
- confianza;
- una marca que convierte usar su producto en una señal de estar a la vanguardia.

Para la cuenta oficial, “onda Apple” también significa evitar que la comunicación se vuelva un feed de memes o una marca poco seria.

### Perplexity
Es una referencia especialmente positiva en **comunicación**. Al fundador le gusta cómo explica su producto, cómo construye presencia pública y cómo comunica innovación sin depender sólo de lenguaje corporativo tradicional.

### Vercel
Es una referencia estética parcial. Hay elementos de su dirección visual que resultan atractivos para Mercantis, aunque no se la toma como molde total de marca.

### Mercado Libre
Es una referencia de **comunicación y campañas**. El fundador valora que una empresa masiva y consolidada siga produciendo campañas innovadoras, con ideas creativas reconocibles y no únicamente comunicación funcional.

### OpenAI
Parte de su estética, sistema visual y forma de presentar tecnología avanzada resulta atractiva como referencia para Mercantis.

### Anthropic
También funciona como referencia parcial de estética y presentación de una compañía AI-native: sobriedad, criterio editorial y capacidad de hacer que tecnología compleja se sienta entendible.

### Regla
Estas empresas forman un **mapa de afinidades**, no una receta de diseño. Mercantis debe mantener su universo propio: comercio + viaje + mar + Odisea/Argonautas + editorial + minimalismo + sistema operativo AI-native.

**Trazabilidad:** preferencias explícitas del fundador, 2026-09-10.

# 5. Inventario de producto confirmado

Esta sección funciona como inventario de capacidades que ya pueden considerarse parte del producto actual. No incluye features marcadas solamente como roadmap o visión.


## Tiendas y storefront

Mercantis permite crear y publicar una tienda pública, configurar su operación comercial y ofrecer un flujo de compra. El storefront no es una pieza aislada: consume el catálogo y la configuración de la tienda administrada desde el backoffice.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Productos y servicios

El catálogo admite productos físicos y también servicios. Esto amplía el mercado potencial más allá de comercios tradicionales y permite modelar ofertas que no dependen exclusivamente de inventario físico.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Catálogo e importaciones

La gestión de catálogo está disponible de forma manual y masiva. Existen flujos de importación por planillas y capacidades de importación asistida por IA, pensadas para reducir el costo inicial de digitalizar muchos productos.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Categorías

Las categorías forman parte del catálogo y pueden apoyarse en automatización/IA para acelerar la organización de productos importados o cargados en volumen.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Variantes

Los productos pueden manejar variantes —por ejemplo talle, color, material o capacidad— con información operativa propia como stock, precio y SKU cuando corresponde.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Imágenes de producto

Mercantis almacena imágenes asociadas a productos y dispone de funciones de IA para mejorar activos visuales. Las imágenes forman parte del flujo de catálogo y no son un generador separado del producto.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Precios y actualización masiva

El sistema permite administrar precios y realizar actualizaciones masivas. También contempla precio anterior/compare-at en el modelo de actualización comercial.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Mayoristas

Existe una superficie de mayoristas incluida en la propuesta de planes superiores. Debe distinguirse de capacidades B2B futuras más profundas; lo confirmado es que el dominio mayorista ya existe en el producto comercial.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Stock

Mercantis administra stock ligado al catálogo y sus variantes. El inventario se conecta con ventas y pedidos para evitar que la disponibilidad sea una información completamente separada.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Pedidos

El backoffice permite ver y gestionar pedidos y también crear pedidos manualmente. El pedido es una entidad operacional, no solamente una notificación enviada a un chat.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Clientes

Existe una sección de clientes y el modelo de permisos contempla acceso específico a esa información. Los clientes forman parte de la operación y pueden ser consultados por los roles autorizados.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## WhatsApp

WhatsApp es un canal central del modelo comercial de Mercantis. La plataforma no intenta reemplazar la conversación; busca estructurar la información y hacer que el catálogo, el pedido y la operación alrededor de esa conversación sean más eficientes.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Importación desde WhatsApp

Mercantis dispone de un flujo de importación relacionado con el catálogo de WhatsApp Business, lo que reduce el costo de migración para negocios que ya tienen productos cargados allí.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Importación por Excel/planilla

Existe importación de catálogo mediante planillas, útil para negocios que ya trabajan con información tabular y para cargas masivas.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## IA para importar productos

La IA puede intervenir en la ingestión y estructuración de catálogo, uno de los usos más alineados con la tesis de IA operativa.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## IA para títulos y descripciones

La plataforma puede generar o refinar contenido textual de productos, reduciendo trabajo repetitivo de redacción.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## IA para categorización

La IA puede ayudar a ubicar productos en categorías, especialmente valioso durante importaciones masivas.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## IA para mejora de imágenes

La mejora de imágenes asistida por IA está disponible como capacidad de producto y constituye uno de los “wow moments” más visibles.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Mercado Pago

Mercado Pago está contemplado como proveedor local en Argentina, Chile, Colombia, México, Perú y Uruguay, condicionado por la combinación país/moneda y por reglas de rollout del proveedor.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Transferencia bancaria

La transferencia bancaria del comercio está disponible como medio de pago configurable en todos los mercados soportados.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Efectivo

El efectivo puede configurarse como medio de pago en los mercados soportados.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Medios de pago personalizados

El comercio puede ofrecer métodos de pago personalizados además de proveedores integrados.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Entrega y retiro

La plataforma permite configurar opciones de entrega/retiro y reglas de costo, incluyendo escenarios como envío gratis a partir de un monto.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Equipo

Las tiendas pueden tener varios miembros y administrar invitaciones desde el backoffice.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Roles y permisos

El sistema implementa roles diferenciados —Dueño, Administrador, Manager, Soporte, Vendedor, Visualizador y Publicista— y permisos por secciones/acciones.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Múltiples tiendas por usuario

Un mismo usuario puede trabajar con más de una tienda. Cada tienda conserva su propio contexto operativo, catálogo, configuración y estado comercial.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Métricas generales

La sección Métricas muestra ingresos, cantidad de pedidos, clientes nuevos y visitas/visitantes dentro de rangos temporales configurables.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Personalización de tienda

La tienda puede configurarse visualmente con elementos como identidad/colores y diseño básico, dentro del alcance actual de personalización.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Dominio personalizado

Los planes comerciales contemplan dominio personalizado como parte de la propuesta.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Mercados y monedas

El core soporta selección de país y moneda operacional de acuerdo con el mercado, con locales y zonas horarias iniciales definidas por país.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Referencia USD en Argentina

Para tiendas argentinas en ARS existe un flujo específico de protección/referencia de precios en USD, separado de una conversión FX general del sistema.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.



## GoCuotas

**GoCuotas está disponible actualmente en Mercantis para Argentina.** No debe seguir figurando como “futuro” o “por confirmar” en la base de conocimiento.

Su disponibilidad actual debe describirse con el alcance confirmado: **Argentina**. Esto no implica que opere mediante Mercantis en otros mercados.

**Estado:** live en Argentina.

**Trazabilidad:** confirmación directa del fundador, 2026-09-10.

## Programa de Embajadores

El portal y flujo de Embajadores está implementado: activación, enlace de referido, tiendas referidas, métricas y perfil de cobro.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.


## Programa de Partners

El programa de Partners está implementado con aplicación, organización, equipo, cartera de tiendas, métricas y lógica de relación comercial.

**Trazabilidad:** Fuentes: core Mercantis, Help Center, matriz de capacidades y specs de producto.



## Regla de contenido sobre funcionalidades futuras

API, MCP, webhooks, caja/POS, sucursales y facturación **no deben generar contenido comercial como funcionalidades disponibles mientras no estén efectivamente lanzadas**.

El alcance exacto de sus primeras versiones se documentará cuando cada feature exista de verdad. Hasta ese momento:

- pueden figurar internamente como roadmap/próximo;
- no deben usarse para briefs de adquisición como si fueran capacidades actuales;
- no deben aparecer en comparaciones competitivas como ventajas ya entregadas;
- un agente debe consultar el estado vigente antes de hablar de ellas.

La misma regla aplica a cualquier capacidad futura que aparezca en código, specs o planificación antes de estar liberada.

**Trazabilidad:** decisión explícita del fundador, 2026-09-10.


## Meta Pixel

Al snapshot actual, la integración con **Meta Pixel** no está disponible. Existe evidencia comercial concreta de que esta ausencia hizo perder al menos un lead importante que necesitaba conectar la tienda con Meta para medición/publicidad.

Por eso Meta Pixel queda identificado como una necesidad de producto relevante para adquisición y ecommerce, pero **no debe comunicarse como feature disponible hasta su implementación**.

**Estado:** faltante / candidato próximo.

**Trazabilidad:** caso comercial relatado por el fundador.

# 6. IA y capacidades técnicamente diferenciales

La IA debe documentarse como parte de operaciones concretas del negocio, no como una capa decorativa separada.


## ¿Qué partes del producto son técnicamente interesantes hoy?

Entre las áreas con mayor contenido de dominio propio están la importación de catálogo con IA, edición de imágenes, actualización masiva de precios, motor de mercados y monedas, multi-tenancy, RBAC, catálogo de planes/ofertas y la lógica de growth/billing.

La relevancia técnica no se mide solamente por complejidad de código, sino por cuánto conocimiento de negocio encapsula cada módulo. Mercantis está acumulando modelos específicos de comercio que luego pueden ser utilizados por automatizaciones y agentes.

**Trazabilidad:** Fuentes: arquitectura, specs de catálogo/IA/stores/billing/growth.


## ¿Qué hace la IA hoy?

La IA ya interviene en importación de productos, generación o refinamiento de títulos y descripciones, categorización y mejora de imágenes. Todas estas funciones actúan sobre objetos reales del catálogo y buscan reducir tareas manuales de configuración.

**Trazabilidad:** Fuentes: docs de AI Product Import, AI Image Editing y capacidades de catálogo.


## ¿Qué dirección de IA está definida para mañana?

La dirección ya expresada incluye procesamiento batch más potente, matching automático de imágenes, agentes capaces de operar sobre el negocio y, a más largo plazo, interfaces más generativas/contextuales. También existen capacidades futuras listadas alrededor de social, SEO, traducciones y automatización.

Estas funciones futuras deben mantenerse separadas de los claims actuales. Son visión y roadmap, no promesas de disponibilidad inmediata.

**Trazabilidad:** Fuentes: matriz de capacidades/roadmap y visión del fundador.


## Principio de autonomía de agentes

La IA puede ser proactiva para detectar problemas, oportunidades o configuraciones útiles y presentar recomendaciones sin que el usuario tenga que descubrirlas manualmente.

Para las acciones que modifican el negocio, la política deseada es **confirmación explícita**. El agente interpreta la intención, resume qué va a cambiar y espera la aprobación antes de ejecutar.

Esto permite combinar proactividad con control y establece una regla de seguridad/producto para futuros agentes de Mercantis.

**Trazabilidad:** fundador.



## Capacidades diferenciadoras hoy — síntesis operativa

A partir del producto existente, el feedback cualitativo de migraciones y la definición del fundador, las capacidades diferenciadoras actuales pueden priorizarse así:

1. **Facilidad y velocidad reales de puesta en marcha y operación.** No se trata sólo de una preferencia estética: la UX busca reducir pasos, clics, lectura y capacitación en tareas centrales.
2. **IA aplicada a trabajo operativo concreto.** Importar, estructurar y categorizar productos, generar/refinar contenido y mejorar imágenes son acciones sobre el negocio real, no una capa de chat decorativa.
3. **Integración de piezas que normalmente viven separadas.** Catálogo, stock, pedidos, clientes, pagos, entregas, tienda y equipo comparten un mismo contexto operacional.
4. **Compatibilidad con la forma en que muchos comercios ya venden.** WhatsApp no se trata como enemigo ni como canal que deba reemplazarse; Mercantis busca ordenar la operación alrededor de él y sumar un canal online.
5. **Evolución continua del producto.** En el feedback cualitativo reportado por Lucas aparece como valor que Mercantis siga incorporando mejoras y no quede congelado como un sistema enlatado.

Estas ventajas no deben transformarse automáticamente en claims superlativos del tipo “somos los más rápidos” sin benchmark. Son ventajas de producto y patrones cualitativos confirmados internamente.

**Trazabilidad:** síntesis de producto + entrevista del fundador, 2026-09-10.


## Qué es table stakes y qué intenta ir más allá

Para competir en la categoría, Mercantis necesita como base catálogo/tienda, stock, pedidos, clientes, pagos, entregas, dominio y administración de equipo. Estas capacidades son necesarias, pero por sí solas no constituyen una diferenciación sostenible.

La apuesta de Mercantis está un nivel más arriba: **hacer que todas esas primitives formen un sistema coherente y reducir el costo cognitivo de operarlas mediante UX e IA**. El objetivo no es ganar porque exista un botón que nadie más tenga, sino porque tareas que en otras combinaciones de herramientas requieren más aprendizaje, pasos o coordinación puedan resolverse de forma más directa.

**Trazabilidad:** síntesis de arquitectura/producto + criterio del fundador.


## Qué significa “IA en operaciones”

“IA en operaciones” significa que la inteligencia artificial trabaja sobre objetos y procesos reales del negocio —productos, categorías, imágenes, configuraciones y, progresivamente, stock, pedidos, métricas y finanzas— para reducir trabajo manual, detectar oportunidades y proponer acciones.

La dirección no es convertir Mercantis en un chat con funciones alrededor. La IA debe ser una capa transversal del sistema operativo: entiende contexto, propone la siguiente acción útil y, cuando una acción modifica el negocio, explica qué hará y solicita confirmación antes de ejecutarla.

A futuro puede encadenar procesos cada vez más complejos, pero el principio de control permanece: **sugerencia proactiva; acción con confirmación humana**.

**Trazabilidad:** filosofía explícita del fundador + capacidades de IA existentes.


## ¿Qué es realmente difícil de copiar?

La postura del fundador es deliberadamente realista: **en la era de la IA prácticamente cualquier feature de software puede copiarse**. Por eso Mercantis no debe construir su defensibilidad alrededor de la fantasía de que una funcionalidad aislada sea un moat permanente.

Hay diferencias de dificultad:

- una feature o modelo de negocio puede copiarse relativamente rápido;
- una **UI/UX realmente buena** es más difícil de reproducir con la misma calidad, coherencia y criterio, aunque tampoco es una defensa suficiente por sí sola;
- la verdadera defensibilidad que Mercantis quiere construir está fuera de una lista de features: **distribución, comunidad y marca**.

La prioridad estratégica es, por lo tanto, construir una audiencia y una identidad que no puedan clonarse copiando código. El producto debe seguir siendo excelente, pero el moat esperado es la combinación entre producto, distribución, comunidad, confianza y marca.

**Trazabilidad:** definición directa del fundador.


## ¿La UI/UX es un moat?

No se la considera un moat definitivo, pero sí una capacidad relativamente difícil de copiar bien. La diferencia no está en reproducir componentes visuales aislados, sino en sostener criterio de producto, jerarquías, consistencia, velocidad y recorridos de usuario simples a medida que la plataforma crece.

Mercantis quiere usar esa capacidad como ventaja de ejecución mientras construye defensas más duraderas en marca, comunidad y distribución.

**Trazabilidad:** fundador.

# 7. Usuario, roles y forma de uso confirmada

El repositorio permite afirmar quién puede crear, administrar y utilizar una tienda, aunque todavía no reemplaza los datos reales de ICP o comportamiento de clientes.


## ¿Quién crea normalmente una cuenta?

El flujo principal está diseñado para que un comerciante o emprendedor cree su cuenta y su tienda mediante onboarding self-service. La experiencia busca llevarlo desde el registro hasta una tienda operativa sin necesidad de programación.

**Trazabilidad:** Fuente: onboarding y Help Center.


## ¿Quién puede usar Mercantis diariamente?

El uso diario no está limitado al dueño. El sistema contempla Dueño, Administrador, Manager, Soporte, Vendedor, Visualizador y Publicista. Cada rol tiene acceso diferente a catálogo, pedidos, clientes, stock, métricas, configuración y otras superficies.

Esto confirma que Mercantis está diseñado tanto para negocios operados por una sola persona como para equipos con delegación.

**Trazabilidad:** Fuente: documentación de Equipo/RBAC.


## ¿Mercantis sirve para una persona sola o para un equipo?

Para ambos. Los planes incluyen distintos límites de miembros y el modelo de permisos permite separar responsabilidades. El producto puede comenzar en una operación unipersonal y acompañar la incorporación de equipo sin cambiar de herramienta.

**Trazabilidad:** Fuentes: pricing y RBAC.



## ¿Quién paga y quién decide la compra?

En la práctica, **el dueño del negocio es quien paga y quien tiene la decisión final**.

En negocios chicos, el propio dueño suele descubrir, evaluar y comprar Mercantis. En organizaciones más grandes puede existir un encargado, gerente u otro stakeholder que detecta la necesidad y recomienda la herramienta, pero normalmente tiene que convencer o elevar la decisión al dueño, que es quien termina autorizando el gasto.

Por lo tanto, incluso cuando el usuario operativo no es el dueño, la comunicación comercial debe poder justificar Mercantis frente a la persona que controla presupuesto y riesgo.

**Trazabilidad:** fundador.


## ¿Existe una edad típica de comprador?

No se observa una edad útil como segmentación central. Mercantis ya tuvo usuarios/clientes desde aproximadamente **18 años hasta más de 70 años**.

La amplitud de edades refuerza el principio de UX: el producto no puede depender de familiaridad con software complejo ni diseñarse sólo para usuarios jóvenes o muy tecnológicos.

**Trazabilidad:** observación directa del fundador.


## ¿Cuál es el nivel tecnológico típico?

Es heterogéneo y, en términos generales, normal. Existen personas con soltura tecnológica y también usuarios mayores o con dificultades digitales que pudieron operar Mercantis con algo de ayuda inicial.

La conclusión de producto no es que el público sea “poco tecnológico”, sino que **Mercantis debe funcionar sin exigir sofisticación tecnológica previa**.

**Trazabilidad:** fundador.


## ¿Se usa más móvil o desktop?

Se usan ambos, con funciones distintas:

- **desktop** es la superficie principal para trabajar de forma sostenida, especialmente cuando hay que administrar catálogo, configuración u operación;
- **mobile** se usa con frecuencia para consultas rápidas, revisar métricas o resolver algo cuando la persona está fuera de su escritorio.

No existe todavía un porcentaje cuantitativo confiable de reparto mobile/desktop.

**Trazabilidad:** fundador.


## ¿Importa si el negocio usa WhatsApp personal o WhatsApp Business?

Para la propuesta general de Mercantis, actualmente no es un criterio de fit: el negocio puede trabajar con cualquiera de los dos.

Algunas capacidades específicas —por ejemplo importaciones vinculadas a catálogos de WhatsApp Business— sí pueden depender del tipo de fuente, pero Mercantis no segmenta al cliente general según tenga WhatsApp personal o Business.

**Trazabilidad:** fundador.


## ¿Qué otros canales usan los clientes actuales?

Dentro de la muestra actual, **Instagram y Mercado Libre no aparecen todavía como canales dominantes** entre los clientes de Mercantis. El fundador considera que esa foto puede cambiar sustancialmente a medida que haya más distribución e integraciones —especialmente cuando exista una integración profunda con Mercado Libre—.

Por lo tanto, no debe extrapolarse el comportamiento de la base inicial al mercado objetivo futuro.

**Trazabilidad:** fundador.


## ¿Los clientes actuales siguen usando papel/cuaderno?

Según la observación del fundador, **ninguno de los clientes actuales conocidos opera principalmente así**, aunque sigue existiendo una cantidad importante de comercios en el mercado que utiliza papel/cuaderno o procesos manuales equivalentes.

Esto sirve como insight de mercado, no como estadística representativa sin investigación adicional.

**Trazabilidad:** fundador.


## ¿Existe una cantidad típica de productos o pedidos?

No hay un promedio suficientemente estable que valga la pena convertir en “cliente típico”.

La cantidad de productos varía en función del negocio y el plan. La base actual tiene principalmente clientes Lite, con algunos Pro y Max. Del mismo modo, el volumen de ventas es extremadamente desigual: hay negocios con pocas ventas y otros con un nivel de operación mucho mayor.

La segmentación comercial de Mercantis **no se construye hoy por facturación o cantidad de pedidos**, sino principalmente por capacidad de producto, catálogo, IA, equipo y necesidades funcionales.

**Trazabilidad:** fundador.


## ¿Cuál es el tamaño típico del equipo que usa Mercantis?

Aunque una empresa pueda tener más empleados, normalmente **una, dos o tres personas** terminan accediendo activamente a Mercantis para operar o consultar información.

Ese patrón no implica que Mercantis deba diseñarse sólo para equipos pequeños: sucursales, roles y organizaciones mayores forman parte del crecimiento previsto.

**Trazabilidad:** fundador.


## ¿Cuántas sucursales tienen hoy los clientes?

La base actual opera esencialmente con **una sucursal por negocio** porque el modelo de sucursales todavía no está implementado como capacidad completa.

La intención futura es apuntar también a empresas con muchas sucursales, ya que representan mayor valor económico y una necesidad operacional más compleja.

**Trazabilidad:** fundador.


## ¿Mercantis segmenta por facturación?

No. Hoy no existe una regla del tipo “si facturás X te corresponde determinado plan”.

Los planes se segmentan principalmente por **cantidad de productos y capacidades/límites del sistema**, no por ingresos del cliente. Por eso no debe inventarse una facturación mínima o máxima para Lite, Pro, Max o Ultra.

**Trazabilidad:** fundador.


## ¿Cuál es el perfil de cliente ideal, en términos prácticos?

Sin usar jerga de “ICP”, la síntesis más útil es:

Mercantis tiene especial potencial en **dueños de negocios y PyMEs que ya sienten dolor operativo suficiente como para querer ordenar o digitalizar catálogo, stock, pedidos, cobros y trabajo de equipo**, y que valoran ahorrar tiempo sin adoptar un sistema corporativo pesado.

El negocio puede ser pequeño o grande; la variable más importante no es facturación sino **la intensidad del problema y cuánto valor obtiene al centralizar/automatizar la operación**.

Comercialmente, Pro y Max son perfiles especialmente atractivos porque combinan mayor valor para el cliente con una relación más interesante para Mercantis.

Esta formulación es una síntesis operativa basada en comportamiento y estrategia actuales; no debe confundirse con una segmentación estadística ya validada a gran escala.

**Trazabilidad:** fundador + estructura del producto.


## ¿Qué cliente no conviene atraer?

El anti-perfil más claro es un **cliente de ticket bajo, especialmente Lite, extremadamente demandante y que requiere una cantidad desproporcionada de soporte personalizado**.

Lite está pensado como una oferta más masiva y con mayor grado de autogestión. Mercantis brinda soporte, pero no puede dedicar al cliente de menor ticket la misma intensidad de atención que a planes de mayor valor.

Esto no significa tratar peor a Lite: significa diseñar onboarding, documentación y automatización para que pueda resolver más cosas sin depender del tiempo humano del equipo.

**Trazabilidad:** fundador.


## ¿Qué planes justifican más soporte humano?

Max y, por diseño, Ultra son los planes donde existe mayor expectativa de soporte y acompañamiento. Aunque todavía no había clientes Ultra al momento de esta entrevista, el posicionamiento del plan superior justifica un nivel de atención mayor.

Mercantis intenta reducir soporte evitable corrigiendo problemas de producto y automatizando tareas repetitivas, para reservar tiempo humano para necesidades donde realmente agrega valor.

**Trazabilidad:** fundador.


## ¿Qué perfiles parecen generar más valor mutuo y retención?

La observación cualitativa actual del fundador apunta a **Pro y Max** como perfiles con muy buen valor mutuo. Lite aporta volumen y feedback, pero económicamente requiere más autogestión.

Esta observación todavía no reemplaza un análisis cuantitativo de churn/retención por plan.

**Trazabilidad:** fundador.

# 8. Verticales y rubros confirmados

La landing ya reconoce un conjunto amplio de verticales. La existencia de una landing o taxonomía por rubro confirma intención comercial, no necesariamente tamaño de mercado ni desempeño real.


## ¿Qué rubros reconoce explícitamente Mercantis?

La landing contempla al menos 21 verticales: Indumentaria, Bazar/Regalería, Perfumes/Cosmética, Ferretería, Calzado, Tecnología, Librería, Hogar/Deco, Pet Shop, Juguetería, Deportes/Fitness, Almacén/Alimentos, Bebés/Niños, Repuestos, Construcción, Electricidad, Artística, Papelería, Muebles, Electrodomésticos y Heladerías.

Esto demuestra que la propuesta no está pensada para un único tipo de comercio y que el catálogo/stock/pedidos se consideran primitives reutilizables en múltiples industrias.

**Trazabilidad:** Fuente: landings y taxonomía de rubros del repositorio de landing.


## ¿Indumentaria es un vertical con fit explícito?

Sí. La propuesta para indumentaria se apoya naturalmente en variantes como talle y color, disponibilidad de stock, catálogo visual y reducción de consultas repetitivas por WhatsApp/Instagram. Es uno de los casos donde la combinación catálogo + variantes + stock + autoservicio tiene una relación directa con el dolor del negocio.

**Trazabilidad:** Fuente: landing vertical de indumentaria y capacidades de variantes/stock.


## ¿Servicios profesionales están contemplados?

Sí. El modelo de catálogo admite productos de tipo servicio, por lo que Mercantis no está restringido conceptualmente a inventario físico. La estrategia de cuáles verticales de servicios priorizar todavía debe definirse con investigación comercial.

**Trazabilidad:** Fuente: spec de service products.



## ¿Cuáles parecen funcionar mejor en la muestra inicial?

Todavía **no existe suficiente distribución para elegir con rigor 5–10 verticales ganadores**. El equipo no quiere nichar Mercantis prematuramente porque la base inicial es pequeña y está muy fragmentada entre rubros.

Sí aparecen señales tempranas positivas en:

- tiendas de mates;
- distribuidoras;
- heladerías;
- perfumes/cosmética;
- hogar y decoración;
- bazar/regalería.

Estas señales deben tratarse como **observaciones tempranas**, no como ranking definitivo de verticales.

La estrategia correcta es aumentar distribución, medir adquisición/conversión/retención por rubro y recién entonces decidir dónde concentrar inversión.

**Trazabilidad:** fundador.


## ¿Debe cada vertical tener un plan específico?

No. Los planes no están diseñados por rubro sino por escala/capacidad funcional. Dos negocios del mismo vertical pueden necesitar planes distintos según catálogo, IA, equipo y operación.

Por lo tanto, contenido y landing pueden hablar de problemas específicos de cada rubro sin convertir el pricing en una matriz vertical rígida.

**Trazabilidad:** fundador.

# 9. Dolores confirmados por diseño de producto

Aquí se conservan dolores suficientemente respaldados por decisiones explícitas de producto. No se convierten en citas textuales de clientes hasta contar con evidencia cualitativa.


## ¿Dónde busca Mercantis ahorrar tiempo?

La plataforma ataca tareas repetitivas que normalmente requieren intervención manual: carga y edición de catálogo, categorización, redacción de productos, mejora de imágenes, actualización masiva de precios, comprobación de stock, organización de pedidos y administración de información distribuida.

La existencia de funciones masivas y de IA demuestra que reducir tiempo operativo es una intención de diseño, no solamente una promesa publicitaria.

**Trazabilidad:** Fuentes: importadores, bulk actions, AI tools y gestión de pedidos.


## ¿Qué ansiedad intenta eliminar la experiencia?

Mercantis intenta reducir la ansiedad técnica asociada a “poner un negocio online” o configurar software empresarial. La experiencia se diseña para que una persona pueda avanzar sin saber programar ni comprender términos internos de arquitectura.

La confianza se construye con pasos claros, lenguaje de negocio, defaults y feedback explícito sobre lo que el sistema hizo.

**Trazabilidad:** Fuentes: brief de marca, onboarding y reglas de UX/copy.



## ¿Qué feedback positivo aparece con mayor frecuencia?

El comentario que más se repite cualitativamente es que **Mercantis es fácil y rápido de configurar y mantener**.

La parte importante no es solamente la primera configuración. Los clientes valoran que la plataforma no se convierta luego en un “bodrio” administrativo y que el equipo continúe agregando mejoras en vez de dejar el producto estático.

Esto refuerza dos posibles pruebas de valor para contenido:

- demostrar tareas completas con pocos pasos;
- mostrar la evolución continua del producto con ejemplos concretos.

**Trazabilidad:** feedback cualitativo recopilado por el fundador.


## ¿Qué dolores aparecen al comparar con otras plataformas?

Entre las quejas y experiencias escuchadas aparecen:

- tener que pasar por **capacitaciones o cursos** para poder configurar y operar una tienda;
- demorar semanas o meses en llegar a una implementación útil;
- interfaces con demasiadas opciones y pasos;
- **comisiones adicionales** además de la suscripción;
- fuertes restricciones entre planes;
- tener que pagar integraciones o complementos para resolver necesidades relativamente básicas;
- sistemas instalados localmente o “enlatados” con experiencia anticuada y mantenimiento incómodo.

No todos estos dolores aplican a todos los competidores ni deben convertirse automáticamente en claims comparativos generales. Son **señales cualitativas provenientes de casos y conversaciones**.

**Trazabilidad:** fundador.


## ¿Existe hoy una objeción comercial dominante?

No hay una objeción única que el equipo escuche de manera sistemática. De hecho, muchos prospectos que no avanzan simplemente dejan de responder o no realizan la prueba, sin verbalizar una razón concreta.

Por lo tanto, la ausencia de conversión no debe interpretarse automáticamente como objeción de precio, producto o confianza. Hace falta instrumentar mejor los motivos de no avance antes de construir una narrativa rígida sobre objeciones.

**Trazabilidad:** fundador.


## Lenguaje cualitativo ya escuchado en clientes

La base ya dispone de material suficiente para trabajar creativamente sin seguir forzando entrevistas abstractas al fundador.

Entre los comentarios y patrones relatados aparecen expresiones como:

- que Mercantis es **“muy fácil y rápido”** de configurar;
- que **“está muy buena la plataforma”**;
- sorpresa por poder mantener el negocio sin que el sistema se convierta en un bodrio;
- valoración de que Mercantis **“siempre está agregando cosas”** y mejora continuamente;
- frustración previa con herramientas para las que tuvieron que capacitarse o pagar durante meses antes de tener algo operativo.

Estas frases son evidencia cualitativa y material de inspiración. Para convertir una cita textual en una pieza pública atribuida a un cliente específico debe utilizarse la versión/documentación real disponible en landing, chat o material autorizado.

**Trazabilidad:** conversaciones con clientes relatadas por el fundador.

# 10. Posicionamiento confirmado

Este bloque diferencia claims que ya pueden sostenerse de hipótesis competitivas que todavía requieren investigación específica.


## ¿Por qué elegir Mercantis?

La propuesta combina rapidez de puesta en marcha, operación integrada, ausencia de comisión de plataforma por venta, soporte a WhatsApp y automatización/IA. El valor no depende de una sola de esas ventajas sino de que conviven dentro del mismo sistema.

Para un comercio que hoy usa varias herramientas parciales, Mercantis busca ofrecer una ruta más corta desde “tengo productos y vendo por distintos canales” hasta “tengo información estructurada y una operación administrable”.

**Trazabilidad:** Fuentes: landing, pricing y capacidades del core.


## ¿Dónde está todavía verde el producto?

La visión completa incluye áreas que todavía están en desarrollo o roadmap, como caja/POS más profundo, sucursales completas, facturación integrada, métricas avanzadas/rentabilidad, más integraciones y superficies de marketing. Estas áreas no deben presentarse como si estuvieran terminadas.

Registrar explícitamente esas fronteras es clave para que el Brain no convierta una intención de roadmap en un claim comercial.

**Trazabilidad:** Fuentes: roadmap/matriz de capabilities y estado del core.


## ¿“Tienda online” alcanza para definir Mercantis?

No. “Tienda online” funciona como puerta de entrada porque es una categoría conocida, pero deja afuera la mayor parte del valor operacional: stock, pedidos, clientes, equipo, pagos, métricas y automatización.

**Trazabilidad:** Fuente: mapa funcional y visión de producto.


## ¿Qué categoría quiere dominar Mercantis?

La categoría estratégica es gestión integral/sistema operativo para negocios: una capa que conecte venta, operación y administración sin exigir la complejidad típica de un ERP tradicional.

**Trazabilidad:** Fuente: posicionamiento estratégico del fundador.


## ¿Cómo se puede nombrar hoy esa categoría?

El candidato más claro es “sistema operativo para negocios”. Sirve como norte interno porque expresa amplitud y centralidad. Comercialmente puede necesitar una bajada concreta que aterrice el concepto en tareas entendibles para PyMEs y comercios.

**Trazabilidad:** Fuente: definición estratégica del fundador.


## Evidencia cualitativa de migraciones

Ya existen migraciones desde Tiendanube, Empretienda y sistemas locales/enlatados usados para resolver stock u operaciones puntuales.

El patrón de feedback que Lucas identifica como más recurrente es que los clientes destacan **lo fácil y rápido que se hacen las cosas en Mercantis**. También valoran que el producto continúe evolucionando y sumando capacidades.

Estas observaciones son evidencia cualitativa interna y deben preservarse. Para transformarlas en claims comparativos públicos conviene documentar cada caso con herramienta anterior, tiempo de migración, resultados, capturas y autorización del cliente.

**Trazabilidad:** fundador.



## ¿Por qué Mercantis frente a Tiendanube?

La razón principal no debe formularse como “porque Mercantis es más lindo”. La tesis es que Mercantis busca una **curva de puesta en marcha y operación mucho más corta**, con menos configuración y una capa de backoffice/automatización cada vez más profunda.

Lucas reporta clientes que llegaron desde Tiendanube frustrados por la cantidad de aprendizaje y tiempo necesarios para dejar su operación lista. Es evidencia cualitativa, no un benchmark estadístico. Mercantis intenta competir haciendo que catálogo, stock, pedidos y automatización sean plug-and-play en comparación con experiencias que el usuario percibe como más pesadas.

**Trazabilidad:** migraciones relatadas por el fundador + visión de producto.


## ¿Por qué Mercantis frente a Shopify?

Shopify posee una ventaja muy grande en ecosistema, templates e integraciones maduras. Mercantis no intenta ganar copiando esa amplitud uno a uno.

La apuesta es distinta: concentrar la ventaja en **backoffice, contexto regional, simplicidad operacional e IA aplicada al negocio**, y más adelante utilizar interfaces generativas para reducir la dependencia de competir mediante bibliotecas gigantes de templates.

Para un cliente que prioriza un ecosistema global enorme y personalización storefront muy madura, Shopify puede seguir siendo objetivamente más fuerte hoy. Para el perfil que valora rapidez, operación integrada y menor carga cognitiva, Mercantis intenta ofrecer una experiencia más directa.

**Trazabilidad:** visión del fundador + estado comparativo del producto.


## ¿Por qué Mercantis frente a un ERP tradicional?

Un ERP puede cubrir una enorme cantidad de procesos, pero la referencia negativa de Mercantis es justamente la complejidad corporativa. Mercantis quiere absorber progresivamente funciones de gestión —caja, facturación, sucursales, finanzas, proveedores— sin obligar a un comerciante pequeño a aprender un software pensado como sistema administrativo pesado.

La diferencia buscada es **capacidad de ERP con experiencia de producto de consumo moderno**.

**Trazabilidad:** visión “sistema operativo” del fundador.


## ¿Por qué Mercantis frente a Excel/Sheets?

Una planilla puede registrar datos, pero no conecta por sí sola catálogo público, stock, pedidos, clientes, pagos, entregas, permisos de equipo y automatizaciones. Mercantis busca reemplazar la necesidad de mantener manualmente esas relaciones y evitar que la operación dependa de que una persona recuerde actualizar múltiples lugares.

**Trazabilidad:** modelo operacional de Mercantis + stack alternativo identificado por el fundador.


## ¿Por qué Mercantis frente a WhatsApp solo?

WhatsApp es excelente como canal de conversación y venta, pero no es una base operacional completa. El problema aparece cuando catálogo, precios, stock, pedidos, clientes y seguimiento quedan encerrados en chats y dependen de trabajo manual.

Mercantis no busca sacar al comerciante de WhatsApp. Busca que **WhatsApp sea un canal conectado a una operación estructurada**, y que el negocio además pueda vender mediante un catálogo/tienda online sin responder cada consulta desde cero.

**Trazabilidad:** producto actual + filosofía WhatsApp de Mercantis.


## ¿Cuál es el wedge actual?

El wedge más coherente con toda la información disponible es: **digitalizar y ordenar un negocio extraordinariamente rápido, empezando por catálogo + stock + pedidos + WhatsApp, y usando IA para eliminar la carga inicial y repetitiva**.

La tienda online es una puerta de entrada fácil de entender. El objetivo estratégico es que, una vez dentro, el cliente descubra que Mercantis puede convertirse progresivamente en el sistema operativo de toda su gestión.

**Trazabilidad:** síntesis estratégica de producto e historia de origen.


## ¿Qué ventaja todavía cuesta comunicar?

El mercado puede interpretar Mercantis como “otra tienda online”. La ventaja que el fundador quiere volver visible es que **el verdadero producto está debajo del storefront**: un backoffice y un modelo operativo que pretende conectar cada vez más partes del negocio y usar IA para reducir tareas.

Esta dificultad explica por qué “más rápido”, “más simple” o “más intuitivo” se sienten insuficientes como slogans: son atributos reales buscados por el equipo, pero están demasiado usados en SaaS como para explicar por sí solos la diferencia.

**Trazabilidad:** fundador.


## Tesis de moat futuro

La postura del fundador es que **en la era de la inteligencia artificial prácticamente todo lo que vive solamente en el producto es copiable**. Features, workflows e incluso buena parte del modelo de negocio pueden ser replicados con suficiente tiempo y capacidad.

La UI/UX es más difícil de copiar bien porque exige criterio sostenido, coherencia, velocidad y obsesión por los detalles, pero tampoco se considera una defensa definitiva.

El moat que Mercantis quiere construir deliberadamente es:

**distribución + comunidad + marca.**

La tesis es que un competidor puede copiar una feature; es mucho más difícil copiar:
- una comunidad que confía en Mercantis;
- una marca reconocible;
- una narrativa propia;
- una audiencia acumulada;
- una red orgánica de recomendación;
- una presencia dominante en los canales donde los comerciantes descubren software;
- el criterio de producto que se acumula detrás de la experiencia.

El producto sigue siendo el centro del valor entregado, pero la **defensibilidad empresarial** no debe descansar en la fantasía de una feature incopiable.

**Estado:** tesis estratégica interna, todavía en construcción.

**Trazabilidad:** definición explícita del fundador, 2026-09-10.


## ¿Qué competidor respeta más el fundador?

**Shopify.** Lucas expresa respeto y admiración por lo que construyeron y por la calidad general con la que operan como compañía/producto.

Esto importa porque Mercantis no necesita construir una narrativa de “todos los incumbentes son malos”. Puede reconocer ejecución excelente de competidores y diferenciarse por su propia tesis.

**Trazabilidad:** fundador.


## ¿Qué competidores generan más preocupación?

Lucas menciona especialmente a **Treinta** y **Pedix** como competidores que le preocupan por cercanía o potencial dentro del espacio de gestión/comercio para PyMEs.

La preocupación estratégica no equivale a afirmar que sean hoy los líderes de mercado ni los más parecidos en todas las dimensiones. Para eso deben mantenerse rankings/battlecards objetivos separados.

**Trazabilidad:** fundador.


## La Pyme como competidor cercano

El competidor al que Lucas se refería como “la PyME” es **La Pyme**, en `lapyme.com.ar`.

Al snapshot actual su posicionamiento público se presenta como **“sistema de gestión para pymes argentinas”** y combina ventas, stock, facturación, tesorería, contabilidad, integraciones y asistentes de IA. Por alcance conceptual, es uno de los jugadores que más se acerca a la ambición de Mercantis de convertirse en una capa integral de operación del negocio.

Lucas valora especialmente que detrás del producto parece existir una fuerte obsesión de fundador/producto. Al mismo tiempo, percibe que La Pyme todavía tiene una oportunidad de distribución sin explotar, algo que Mercantis también reconoce como su propia debilidad histórica.

La lectura competitiva interna es clara: Mercantis quiere ganar esa carrera mediante una ejecución mucho más agresiva en **distribución, marca y comunidad**, además de producto.

No convertir expresiones competitivas internas agresivas en copy público. La comparación externa debe basarse en capacidades verificadas.

**Trazabilidad:** identificación del fundador + verificación pública de `lapyme.com.ar`, 2026-09-10.


## Qué enseña el churn sobre el fit actual

Existe un patrón cualitativo importante: algunos usuarios avanzados abandonan Mercantis porque necesitan un nivel de **personalización del storefront** similar al que encuentran en plataformas con ecosistemas de templates mucho más maduros.

Eso no significa que el producto principal falle. Marca un límite de fit actual: quien necesita control visual extremadamente profundo y prioriza personalización del storefront por encima de simplicidad operacional puede estar mejor atendido por otra solución hoy.

Un caso extremo fue un usuario con suficiente capacidad técnica para terminar construyendo su propio sistema con herramientas de IA. Ese perfil claramente no representa al cliente ideal de Mercantis: si una persona quiere y puede construir su propia plataforma, el valor de una solución estandarizada disminuye.

**Trazabilidad:** casos de churn relatados por el fundador.


## Cliente de mayor tamaño / caso atípico actual

El cliente que el fundador identifica actualmente como más grande y también como uno de los más atípicos es **Empac**, un negocio orientado a packaging y venta mayorista de cajas y productos relacionados.

Este caso es relevante porque muestra que Mercantis no debe imaginar su uso solamente alrededor de tiendas pequeñas de consumo final. También puede tener fit con operaciones mayoristas y catálogos orientados a abastecimiento de otros negocios.

Antes de publicar detalles comerciales, métricas o resultados específicos de Empac se debe usar únicamente la evidencia y permisos efectivamente disponibles.

**Trazabilidad:** fundador.

# 11. Modelo económico confirmado

Los precios y condiciones son datos dinámicos: deben leerse como snapshot al 10 de septiembre de 2026 y revalidarse antes de publicarlos meses después.


## ¿Mercantis cobra comisión por venta?

No cobra comisión de plataforma por las ventas. El modelo principal es de suscripción. Esto no significa que un proveedor externo de pagos no pueda cobrar sus propias tasas; la promesa se refiere a la comisión de Mercantis sobre la venta.

**Trazabilidad:** Fuente: landing y pricing.


## ¿Cuáles son los planes vigentes en Argentina?

Al snapshot analizado existen cuatro escalones: Lite, Pro, Max y Ultra. Los valores mensuales en Argentina son ARS 16.000, 32.000, 64.000 y 128.000 respectivamente. La opción anual aplica una reducción equivalente al 50% sobre el costo mensual de referencia.

Estos precios son dinámicos y deben almacenarse con fecha de vigencia.

**Trazabilidad:** Fuente: configuración de pricing de landing/core al 2026-09-10.


## ¿Cuál es el plan de entrada?

Lite es el plan de entrada. Está diseñado para negocios con menor catálogo y equipo y conserva la propuesta central de Mercantis: tienda, operación básica, IA y soporte dentro de límites inferiores.

**Trazabilidad:** Fuente: pricing.


## ¿Qué límites principales diferencian los planes?

Los límites confirmados por plan incluyen cantidad de productos, créditos/capacidad de IA, cantidad de imágenes y miembros de equipo. En el snapshot actual: Lite 250 productos, 3.000 de IA, 5 imágenes y 3 miembros; Pro 1.000, 6.000, 8 y 5; Max 3.000, 18.000, 11 y 8; Ultra 10.000, 36.000, 15 y 12.

Además existen diferencias funcionales y de soporte. Los límites deben tratarse como configuración comercial versionada, no como verdades eternas.

**Trazabilidad:** Fuente: pricing y catálogo de planes.



## ¿Por qué Mercantis eligió suscripción?

La lógica es que Mercantis funciona como **la herramienta que el negocio alquila para operar mes a mes**. El cliente paga por utilizar el sistema y por la capacidad que éste le proporciona.

La suscripción alinea el modelo con una relación continua: Mercantis mantiene, mejora y amplía el producto mientras el negocio lo usa permanentemente para gestionar su operación.

**Trazabilidad:** fundador.


## ¿Por qué no cobra comisión por venta?

Es tanto una decisión comercial como una postura de justicia percibida por el fundador.

La tesis es: **Mercantis proporciona la herramienta; el resultado que el comerciante obtiene con esa herramienta le pertenece al comerciante.** Por eso Mercantis no considera correcto apropiarse de un porcentaje adicional de cada venta sólo porque esa venta pasó por el sistema.

La empresa monetiza el acceso al software, no el éxito comercial del usuario mediante una comisión de plataforma.

Los costos de proveedores externos de pagos siguen siendo independientes y no contradicen este principio.

**Trazabilidad:** fundador.


## ¿Cómo está pensada la arquitectura de precios?

La estructura parte de un precio base competitivo para Lite y utiliza una progresión simple en la que **cada plan duplica el precio del anterior**:

- Lite: ARS 16.000/mes;
- Pro: ARS 32.000/mes;
- Max: ARS 64.000/mes;
- Ultra: ARS 128.000/mes.

La lógica privilegia precios fáciles de entender y recordar. No surge todavía de un modelo estadístico sofisticado de willingness-to-pay; combina psicología de precios, comparación competitiva y simplicidad comercial.

**Trazabilidad:** fundador; snapshot 2026-09-10.


## ¿Por qué existe un descuento anual del 50%?

En la etapa actual, el descuento anual es una decisión deliberadamente agresiva.

Mercantis cede aproximadamente seis meses de valor nominal respecto del mensual para obtener:

- caja por adelantado;
- compromiso del cliente durante 12 meses;
- más tiempo real para que el negocio incorpore la herramienta;
- una relación más larga de feedback y aprendizaje;
- menor presión de churn mensual durante una etapa inicial del producto.

La estrategia puede cambiar cuando Mercantis madure; no debe tratarse como una regla económica eterna.

**Trazabilidad:** fundador.


## ¿Qué plan quiere vender más Mercantis?

El plan **Max** es actualmente el plan estrella que Mercantis quiere impulsar con mayor fuerza.

El objetivo comercial también incluye Ultra, pero Max representa hoy el punto que mejor combina precio alto con acceso al conjunto más completo de capacidades actuales.

**Trazabilidad:** fundador.


## ¿Qué plan representa hoy el producto completo?

**Max.** Al snapshot actual, Max ya contiene esencialmente el conjunto completo de funcionalidades comerciales relevantes.

Ultra se diferencia principalmente por elevar límites —especialmente cantidad de productos— y tiene espacio para recibir beneficios exclusivos adicionales a medida que el producto madure.

**Trazabilidad:** fundador.


## ¿Qué plan tiene mayor margen?

Cualitativamente, **Ultra**, seguido por Max, Pro y Lite.

La razón es que gran parte del costo base de mantener la plataforma no escala linealmente con el precio del plan. Los créditos/consumo de IA sí agregan costo variable, pero Mercantis diseña los límites y packs para conservar margen.

Esta conclusión es lógica económica declarada por el fundador, no un cálculo contable auditado de margen bruto por cohort.

**Trazabilidad:** fundador.


## ¿Cómo funciona el trial?

Los **cuatro planes —Lite, Pro, Max y Ultra— tienen 10 días de prueba gratis**.

La prueba:

- no requiere tarjeta de crédito;
- comienza cuando el usuario crea la tienda;
- permite probar la plataforma antes de pagar.

Esto resuelve la contradicción previa de fuentes: para esta base, la confirmación directa del fundador al 2026-09-10 es la referencia vigente, hasta que una configuración posterior del producto la reemplace.

**Trazabilidad:** fundador; snapshot 2026-09-10.


## ¿Cómo se monetiza el uso extra de IA?

Cada plan incluye una cantidad de créditos/capacidad de IA. Si el cliente necesita superar ese límite, puede comprar **packs adicionales de créditos**.

Los packs son una línea de monetización complementaria a la suscripción y permiten que usuarios intensivos de IA amplíen consumo sin obligar necesariamente a cambiar toda la estructura del plan sólo por uso puntual.

**Trazabilidad:** fundador + sistema de créditos del core.


## ¿Cómo se planea cobrar sucursales adicionales?

La lógica definida es sumar aproximadamente **50% del precio del plan base por cada sucursal adicional**.

Las sucursales pertenecen a una misma organización y, según la visión definida, **comparten el catálogo**, mientras pueden separar aspectos operativos propios conforme se implemente el modelo completo.

La feature de sucursales todavía no está live y la lógica comercial debe revalidarse cuando se publique.

**Estado:** pricing/visión de producto definida; feature aún próxima.

**Trazabilidad:** fundador.


## ¿Mercantis está abierto a trabajos Enterprise o necesidades custom?

Sí, pero **no existe hoy un plan Enterprise estandarizado con precio y paquete público**.

Si aparece un cliente con una necesidad fuera de los planes normales, el proceso es:

1. reunión para entender el caso;
2. evaluación de qué necesita;
3. evaluación de viabilidad técnica y comercial;
4. cotización específica para ese proyecto/cliente;
5. ejecución sólo si tiene sentido para ambas partes.

La lógica es completamente custom y se decide caso por caso. No debe inventarse un “Enterprise” fijo ni comunicar capacidades a medida como si estuvieran incluidas por defecto.

Además se mantiene el aprendizaje central: Mercantis no debería construir desarrollo relevante solamente porque un lead dice que lo necesita; debe existir compromiso comercial real.

**Trazabilidad:** fundador.


## ¿Existe una segmentación económica por facturación?

No. Mercantis no fija el plan según cuánto factura el negocio. Los escalones se construyen sobre límites y capacidades de producto.

Esto evita inventar umbrales de ingresos que hoy no existen en la política comercial.

**Trazabilidad:** fundador.

## ¿Existe un programa de Partners?

Sí. El programa está implementado en el core. Un Partner trabaja mediante una organización, puede administrar equipo y cartera de tiendas y accede a métricas y datos comerciales del programa. La documentación actual describe una comisión recurrente del 20% en relaciones de cliente transferido que resultan elegibles según las reglas vigentes.

La elegibilidad financiera final no debe reducirse a una sola bandera técnica; el propio repositorio registra deuda pendiente para formalizar mejor esas reglas.

**Trazabilidad:** Fuentes: socios-program-overview, partner specs y tech debt.


## ¿Existe un programa de Embajadores/referidos?

Sí. El programa de Embajadores está implementado y puede activarse desde el ecosistema de Mercantis. El embajador dispone de enlace de referido, tiendas referidas, métricas y perfil de cobro.

La documentación vigente del programa describe beneficios para la audiencia referida y una recompensa al embajador vinculada a las primeras mensualidades de la suscripción activada. Como todo incentivo, sus números deben leerse con fecha de vigencia.

**Trazabilidad:** Fuentes: socios-program-overview y referral/billing specs.


# 12. Go-to-market confirmado

Este bloque conserva tanto los canales existentes como los aprendizajes reales de adquisición hasta el snapshot actual.


## ¿De dónde llegaron los clientes pagos hasta ahora?

La base actual llegó por una mezcla de fuentes:

- conocidos;
- referidos/boca en boca;
- recomendaciones espontáneas;
- visitas en frío;
- contactos comerciales directos;
- personas que llegaron por iniciativa propia.

Todavía no existe una atribución cuantitativa suficientemente prolija para afirmar qué porcentaje corresponde a cada canal.

**Trazabilidad:** fundador.


## ¿Qué pasó con Partners y Embajadores?

Los programas existen en producto, pero **hasta ahora no demostraron adquisición efectiva para Mercantis**.

La evaluación interna del fundador es negativa en esta etapa: Partners y Embajadores actuales no generaron clientes relevantes porque los participantes no mostraron suficiente compromiso o capacidad de distribución.

La hipótesis es que estos programas pueden volverse más interesantes cuando Mercantis sea una marca más consolidada, con demanda y reconocimiento que faciliten la recomendación.

Por lo tanto debe separarse:

- **programa implementado:** sí;
- **canal probado de crecimiento:** todavía no.

**Trazabilidad:** fundador + existencia de los programas en core.


## ¿Qué aprendió Mercantis sobre outbound?

El equipo considera que dedicó **demasiado tiempo a visitar negocios en frío** y que el retorno sobre ese esfuerzo fue bajo.

Las visitas implican desplazamiento, conversación individual y mucho tiempo por oportunidad. Pueden cerrar clientes, pero son difíciles de escalar y alejan tiempo de producto y distribución.

El objetivo estratégico es **reducir progresivamente outbound**.

En el corto plazo, la presión de caja puede obligar a Lucas a seguir usando llamadas o prospección directa para cerrar uno o dos clientes puntuales. Debe entenderse como una táctica de supervivencia/ventas inmediatas, no como el motor de crecimiento deseado.

**Trazabilidad:** fundador.


## ¿Cuál debería ser el motor de crecimiento?

La visión es construir una **bola de nieve de inbound y boca en boca**.

La rueda inicial debe acelerarse mediante presencia constante en:

- Instagram;
- TikTok;
- SEO;
- Google;
- contenido orgánico;
- resultados y recomendaciones dentro de ChatGPT y otros asistentes de IA;
- cualquier superficie donde un dueño de negocio busque cómo resolver un problema operativo.

El **boca en boca** es visto como el resultado más poderoso a largo plazo, pero necesita suficiente base instalada y notoriedad para empezar a girar con fuerza.

La prioridad actual es construir **distribución, comunidad y marca** alrededor de un producto que ya muestra señales tempranas fuertes de conversión.

**Trazabilidad:** fundador.


## ¿El producto es principalmente self-service?

Sí. El onboarding está diseñado para que un usuario cree su cuenta y tienda, configure los elementos principales y pueda avanzar hacia la publicación sin programación. El modelo puede complementarse con soporte y migración asistida en planes/casos específicos, pero la base del producto no depende de una implementación manual por parte de Mercantis.

El objetivo futuro es profundizar todavía más esa autogestión con IA.

**Trazabilidad:** onboarding, Help Center y fundador.


# 13. Voz de marca y reglas de contenido confirmadas

Estas reglas son especialmente importantes para agentes generativos: deben orientar tono y vocabulario sin forzar que todas las piezas suenen iguales.


## ¿Mercantis como marca debe tener voz propia?

Sí. La marca puede hablar directamente de producto, dolores de negocio, educación y operación. Su voz debe ser clara, útil y cercana, no una suma de frases de marketing genéricas.

**Trazabilidad:** Fuente: landing y guías de contenido.


## ¿Lucas puede ser una voz editorial?

Sí. Su rol de CEO y participación directa en producto/UX lo vuelve una voz legítima para visión, negocio, aprendizajes, decisiones de producto y conversaciones con comerciantes.

**Trazabilidad:** Fuente: perfil público de fundador.


## ¿Carla puede ser una voz editorial?

Sí. Su rol de CTO y responsabilidad sobre arquitectura/desarrollo la vuelven una voz legítima para ingeniería, escalabilidad, rendimiento y construcción técnica de Mercantis.

**Trazabilidad:** Fuente: perfil público de fundadora.


## ¿Cuándo debe ser técnica la comunicación?

La comunicación puede ser técnica cuando el público y el tema lo requieren —por ejemplo contenidos para desarrolladores, arquitectura o construcción del producto—. Hacia comerciantes, la jerga interna debe desaparecer salvo que sea necesaria para tomar una decisión.

**Trazabilidad:** Fuente: reglas de UX/copy.


## ¿La voz puede ser informal?

Sí. La voz actual es directa y cercana, especialmente en Argentina, pero mantiene precisión y profesionalismo. La informalidad es un medio para reducir distancia, no una obligación de usar modismos constantemente.

**Trazabilidad:** Fuente: landing y brand brief.


## ¿Qué vocabulario se prefiere?

Se priorizan palabras del mundo real del usuario: tienda, cliente, negocio, pedido, producto, stock y venta. El lenguaje debe describir la tarea o el resultado, no la arquitectura interna.

**Trazabilidad:** Fuente: pautas de contenido/UX.


## ¿Qué lenguaje se evita?

Se evita jerga técnica innecesaria, nombres internos de arquitectura, identificadores de implementación y hype genérico. Un usuario no debería necesitar entender cómo está construido Mercantis para saber qué puede hacer.

**Trazabilidad:** Fuente: reglas internas de producto/copy.


## ¿Qué claims centrales ya forman parte de la comunicación?

Los claims más claros hoy son: sin comisión de plataforma por venta; puesta en marcha rápida; tienda y operación conectadas; integración natural con WhatsApp; y uso de IA para reducir trabajo de catálogo.

Cada claim cuantitativo o de disponibilidad debe conservar condición y fecha de vigencia.

**Trazabilidad:** Fuentes: landing, Help Center y producto.



## ¿Quiénes son las voces principales?

Las voces humanas principales serán **Lucas y Carla**, en formatos y temas diferentes según su rol.

- **Lucas:** producto, UX, visión, negocio, emprendimiento, decisiones, aprendizajes y postura de fundador.
- **Carla:** tecnología, construcción, arquitectura y perspectiva de CTO.
- **Clientes:** pueden aparecer mediante testimonios/casos como evidencia, pero no son la voz cotidiana principal.

La marca Mercantis también conserva su propia voz institucional.

**Trazabilidad:** fundador.


## ¿Cuál es la función de las cuentas satélite?

Las cuentas satélite existen principalmente para **multiplicar alcance y aumentar la probabilidad de producir piezas con potencial viral**.

No tienen que comportarse como clones de la cuenta oficial. Pueden experimentar con formatos, hooks, humor, polémica y estilos de publicación con mucha más libertad.

Su misión principal es distribución/alcance; cualquier contribución a comunidad o educación es secundaria frente a ese objetivo.

**Trazabilidad:** fundador.


## Humor: oficial vs. satélites

En la **cuenta oficial de Mercantis**, el humor no debe convertirse en el tono dominante. La marca quiere conservar una presencia seria, respetable y muy cuidada, con una referencia aspiracional cercana a Apple.

Las **cuentas satélite** sí pueden usar humor con mucha más libertad si eso mejora alcance y afinidad.

**Trazabilidad:** fundador.


## Provocación y polémica

En cuentas satélite y cuentas personales de los fundadores existe margen amplio para ser provocador o polémico.

El límite explícito es **ético**: no vale generar alcance mediante daño, engaño o conductas incompatibles con la marca.

La cuenta oficial debe mantener mayor criterio institucional aunque pueda defender posturas fuertes sobre producto, tecnología, negocios o industria.

**Trazabilidad:** fundador.


## Lenguaje para LATAM

Mercantis **no planea neutralizar completamente su identidad argentina** para comunicar a Latinoamérica.

Puede conservar voseo, cadencia y una personalidad argentinizada, siempre que el mensaje siga siendo entendible para audiencias de otros países.

La expansión regional no debe transformar la marca en un español corporativo neutro sin personalidad.

**Trazabilidad:** fundador.


## Política y temas ajenos al negocio

La cuenta oficial de Mercantis **no debe meterse en política partidaria ni discusiones públicas irrelevantes para su misión**.

Lucas, en su carácter personal/fundador, puede expresar opiniones propias. Debe distinguirse claramente la voz individual de la posición institucional de Mercantis.

**Trazabilidad:** fundador.


## Casos y testimonios de la landing

Los casos/testimonios actualmente publicados en la landing de Mercantis son **casos reales** y pueden tratarse como fuente primaria de evidencia para briefs y contenido, respetando exactamente lo que esté documentado allí.

Un agente puede usarlos para:
- prueba social;
- storytelling;
- ejemplos por rubro;
- objeciones;
- migraciones;
- beneficios observados.

No debe inventar métricas o resultados adicionales que la landing no documente.

**Trazabilidad:** confirmación explícita del fundador.

# 14. Objeciones que el producto ya puede responder

Estas respuestas son descriptivas del producto. No sustituyen battlecards competitivas ni evidencia de ROI, que todavía deben construirse.


## “Es complicado.”

La respuesta del producto es una experiencia diseñada para reducir pasos y conocimiento técnico: onboarding guiado, gestión centralizada, importadores y automatización. La promesa no es que un negocio sea simple, sino que el software no agregue complejidad innecesaria.

**Trazabilidad:** Fuentes: onboarding y principios de UX.


## “No soy técnico.”

Mercantis está construido para que una persona pueda crear y operar una tienda sin programar. La terminología visible debe hablar del negocio, no de infraestructura.

**Trazabilidad:** Fuentes: onboarding y copy.


## “No quiero pagar comisión por cada venta.”

Mercantis no cobra comisión de plataforma sobre la venta; monetiza principalmente mediante suscripción. Deben distinguirse las comisiones que eventualmente cobre un proveedor de pagos.

**Trazabilidad:** Fuentes: pricing/landing.


## “Mis clientes compran por WhatsApp.”

Mercantis no exige abandonar WhatsApp. El canal puede seguir siendo parte de la relación con el cliente mientras el catálogo, el pedido, el stock y la administración se estructuran en Mercantis.

**Trazabilidad:** Fuentes: propuesta de WhatsApp y producto.


## “Ya cobro por efectivo o transferencia.”

Es compatible. Efectivo, transferencia bancaria del comercio y medios personalizados están contemplados como métodos configurables en los mercados soportados.

**Trazabilidad:** Fuente: regional-markets spec.


## “Tengo muchísimos productos.”

El producto incorpora importación masiva, acciones en lote y tiers que elevan la capacidad de productos hasta 10.000 en el snapshot actual. Esto permite atacar el costo de migración y mantenimiento de catálogos grandes dentro del rango soportado.

**Trazabilidad:** Fuentes: pricing e importadores.


## “Tengo empleados.”

Mercantis dispone de equipo, invitaciones, roles y permisos. El dueño puede delegar tareas sin otorgar necesariamente control total de la tienda.

**Trazabilidad:** Fuente: Equipo/RBAC.


# 15. Principios de producto confirmados

Estos principios son más duraderos que una feature específica y deberían vivir como reglas de diseño y decisión.


## Simplicidad visible antes que flexibilidad visible

Mercantis favorece una interfaz simple aunque el sistema por debajo sea capaz de modelar situaciones complejas. La potencia no debería expresarse como cientos de controles simultáneos.

La consecuencia práctica es priorizar defaults, progresive disclosure, lenguaje de negocio y acciones contextuales.

**Trazabilidad:** Fuentes: UX, diseño y visión del fundador.


## Configuración mínima

El sistema busca reducir la cantidad de decisiones necesarias para empezar. El onboarding y las automatizaciones existen para evitar que cada usuario tenga que configurar desde cero toda la lógica del producto.

**Trazabilidad:** Fuentes: onboarding y automatización.


## Automatización como principio central

La automatización no es un add-on. Aparece en importaciones, bulk actions e IA y forma parte de la visión futura de agentes que actúen sobre el negocio.

**Trazabilidad:** Fuentes: producto actual y visión.


## Sin comisión como principio comercial actual

La monetización por suscripción evita que la plataforma cobre un porcentaje de cada venta. Este principio debe conservarse separado de tasas de terceros.

**Trazabilidad:** Fuente: pricing/landing.


## Onboarding rápido

El Help Center comunica una referencia de aproximadamente 10 minutos para tener una tienda lista cuando el usuario ya cuenta con fotos y precios. La condición es importante: no debe transformarse en una promesa universal sin contexto.

Más allá del número, el principio es reducir el tiempo entre registro y primer valor.

**Trazabilidad:** Fuente: Help Center de onboarding.


## No exigir programación ni capacitación técnica

El usuario objetivo no debería necesitar aprender desarrollo web ni arquitectura de software. La interfaz debe traducir la capacidad técnica a conceptos del negocio.

**Trazabilidad:** Fuentes: landing y onboarding.


## No negociable: UI/UX y velocidad

La visión del producto considera la experiencia y el rendimiento como parte central del valor. Mercantis no debería crecer en features a costa de convertirse en un panel lento o difícil de entender.

**Trazabilidad:** Fuente: visión del fundador y decisiones de arquitectura.


## Una operación no debe fingir éxito

La documentación técnica establece un principio útil para cultura de producto: cuando una operación de IA o una acción con efecto cobrable falla, el sistema debe manejar ese fallo de forma explícita y no presentar un éxito falso.

Este principio es extrapolable a otras áreas: integridad y confianza son más importantes que aparentar fluidez.

**Trazabilidad:** Fuente: documentación técnica de operaciones de IA/créditos.


## El sistema debe darle lucidez al dueño

Cada nueva capacidad debería responder una pregunta sencilla: ¿ayuda al dueño a entender mejor su negocio o a operar con menos esfuerzo?

La potencia de Mercantis no tiene valor si sólo agrega pantallas. El producto debe convertir datos y procesos en claridad sobre stock, pedidos, clientes, ingresos y acciones pendientes.

**Trazabilidad:** fundador.


## Vanguardia sin carga cognitiva

Mercantis quiere ser una herramienta preparada para la era de IA y percibida como moderna/aspiracional, pero esa sofisticación debe sentirse en lo que el sistema resuelve, no en una interfaz llena de controles avanzados.

**Trazabilidad:** fundador.


## Proactividad con confirmación

Los agentes futuros pueden sugerir de forma autónoma, pero las acciones deben confirmar intención antes de modificar el negocio. El dueño conserva control final.

**Trazabilidad:** fundador.



## Saber decir que no a una feature

Mercantis no implementa automáticamente todo lo que pide un cliente.

Una petición debe rechazarse cuando **desvirtúa la dinámica de trabajo del producto, complica de forma desproporcionada la experiencia del resto de los usuarios o empuja el sistema hacia una excepción difícil de sostener**.

Escuchar mucho al cliente no equivale a delegarle la dirección del producto.

**Trazabilidad:** fundador.


## Clientes que compiten entre sí

Mercantis no aplica exclusividad por rubro. Dos negocios competidores —por ejemplo dos heladerías— pueden utilizar la misma plataforma y beneficiarse de las mismas funcionalidades.

Una mejora general del producto puede servirle a ambos. La relación competitiva entre los clientes no altera la neutralidad del software.

**Trazabilidad:** fundador.

# 16. Tecnología confirmada

Este bloque captura la arquitectura actual sin exponer secretos operativos ni convertir deuda técnica en material público automáticamente.


## Arquitectura general

SaaS multi-tenant con backoffice y storefront separados, organizados por dominios de producto.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Frontend

Next.js, React y TypeScript constituyen la base principal de las aplicaciones web actuales.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Backend

La lógica de servidor vive en el stack Next.js y en módulos de dominio, con rutas/actions y acceso server-side a datos.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Base de datos

PostgreSQL con Drizzle ORM es la base del modelo de datos relacional.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Autenticación y storage

Supabase participa en autenticación y almacenamiento, con controles de acceso y políticas RLS donde corresponde.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## IA

La arquitectura integra un gateway/capa de modelos y proveedores como Gemini para operaciones de producto.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Integraciones de pagos

Mercado Pago y otros medios/configuraciones se habilitan de acuerdo con mercado, moneda y reglas de rollout.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Deploy

Admin y storefront tienen estrategias de despliegue/caching diferenciadas, reflejando necesidades distintas de frescura y rendimiento.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Seguridad

La arquitectura usa autenticación server-side, verificaciones de acceso por tenant/store y RLS en datos donde aplica. El cliente web no debe convertirse en fuente de autoridad.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Multi-tenancy

El modelo permite varias tiendas aisladas y acceso contextual por store.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Imágenes

Las imágenes se almacenan por tienda y forman parte de pipelines de compresión/procesamiento y, en ciertos flujos, mejora por IA.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Importadores

Existen importadores desde WhatsApp Business, planillas y flujos asistidos por IA.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


## Optimizaciones de performance

La arquitectura documenta server-first, caching del storefront, invalidación por tags y separación de deploys como decisiones para mantener rendimiento y consistencia.

**Trazabilidad:** Fuente: documentación de arquitectura y specs del core.


# 17. Visión y roadmap que ya están suficientemente definidos

Sólo se incluyen direcciones que ya fueron expresadas de forma clara. Las fechas concretas siguen requiriendo un roadmap versionado.


## ¿Cuál es la visión a tres años?

Mercantis debe evolucionar hacia un sistema operativo AI-native para negocios, capaz de centralizar cada vez más áreas de la operación y hacerlas accesibles mediante una experiencia simple y automatizada.

**Trazabilidad:** Fuente: visión del fundador.


## ¿La automatización ya existe o es sólo futura?

Existe hoy en importaciones, acciones masivas e IA aplicada a catálogo, y al mismo tiempo es una línea de expansión futura hacia agentes y operaciones más autónomas. Por lo tanto debe hablarse de “automatización existente y creciente”, no de un agente general ya terminado.

**Trazabilidad:** Fuentes: producto actual y roadmap.


## ¿La logística existe hoy?

Existe una capa básica de entrega/retiro y reglas comerciales de envío. Tracking avanzado, múltiples carriers y otras capacidades logísticas más profundas pertenecen al roadmap y no deben mezclarse con lo disponible hoy.

**Trazabilidad:** Fuentes: configuración de entrega y matriz de capabilities.



## ¿Qué capacidades importantes todavía NO están disponibles?

Al snapshot del 10 de septiembre de 2026, el fundador confirma como **no disponibles todavía, pero próximas**:

- API pública para clientes;
- MCP público;
- webhooks públicos;
- caja/POS;
- sucursales;
- facturación.

Estas capacidades pueden existir parcialmente en código, specs, entitlements o planificación, pero la regla de comunicación es simple: **no presentarlas como funcionalidades live hasta que el producto las libere formalmente**.

**Trazabilidad:** fundador.


## ¿Qué prioridad tiene caja, sucursales y facturación?

Son parte del siguiente tramo importante de producto. El propio equipo considera que caja, sucursales, facturación y métricas más avanzadas deberían haber llegado antes y está acelerando su desarrollo.

La razón es estratégica: estas capacidades empujan a Mercantis desde “herramienta para vender online” hacia “sistema operativo del negocio”.

**Trazabilidad:** fundador.

## ¿La expansión global forma parte de la visión?

Sí. El core ya avanzó desde un supuesto Argentina-only hacia un modelo explícito de mercados, monedas, locale, timezone y disponibilidad de proveedores por país. La expansión fuera de LATAM todavía requiere producto y estrategia adicional.

**Trazabilidad:** Fuente: regional-markets spec y visión.


## ¿Cómo se ve el éxito máximo?

El resultado ambicionado es que Mercantis se convierta en el sistema operativo predeterminado para gestionar un negocio: una plataforma que acompañe desde el inicio hasta operaciones con equipo, sucursales y mayor complejidad sin obligar a migrar a un sistema corporativo pesado.

**Trazabilidad:** Fuente: visión estratégica.



## Filosofía de roadmap temporal

Mercantis opera hoy con una dinámica muy cercana al **día a día**. El equipo tiene dirección clara de producto, pero no pretende documentar fechas artificiales de 3, 6 o 12 meses que no pueda garantizar.

Por lo tanto:

- la base puede registrar **prioridades, próximo, roadmap y visión**;
- no debe inventar fechas;
- una feature sólo pasa a “live” cuando efectivamente está disponible;
- el contenido comercial debe basarse en lo que existe hoy;
- cuando API, MCP, webhooks, caja/POS, sucursales, facturación u otras features salgan, la documentación se actualiza con su alcance real.

Esto evita que la presión por tener un roadmap prolijo se convierta en promesas falsas.

**Trazabilidad:** fundador.

# 18. Internacionalización confirmada

El modelo regional del core está documentado con suficiente precisión para considerarlo fuente de verdad técnica al snapshot analizado.


## ¿Cómo funciona una tienda respecto de país y moneda?

Cada tienda opera en un país seleccionado y una moneda operacional confirmada. El país determina locale, formato de direcciones y teléfonos, timezone inicial y disponibilidad de capacidades. La moneda determina cómo se expresan productos, pedidos y comportamiento de ciertos proveedores de pago.

Una tienda no mezcla libremente países como si fuera un sistema global de shipping. El fulfillment actual es doméstico al país de la tienda y no existe un motor global de conversión FX para sumar métricas de monedas distintas.

**Trazabilidad:** Fuente: docs/product-specs/stores/regional-markets.md.


## ¿Qué medios de pago básicos están disponibles regionalmente?

Efectivo, transferencia bancaria del comercio y métodos personalizados están disponibles en todos los mercados soportados. Mercado Pago tiene defaults locales en Argentina, Chile, Colombia, México, Perú y Uruguay, sujeto a reglas de país/moneda y overrides de rollout.

**Trazabilidad:** Fuente: regional-markets spec.


## ¿Qué límites regionales existen hoy?

El MVP regional no incluye traducciones multilingües, motor fiscal internacional, facturación fiscal global, envíos internacionales ni conversión FX para reporting global. Esos límites deben ser explícitos para evitar inferir capacidades por el simple hecho de que el país sea seleccionable.

**Trazabilidad:** Fuente: regional-markets spec.


## Mercados soportados y configuración base

Para evitar ambigüedad entre “mercado soportado” y “proveedor de pago local”, se registra cada país por separado:

- **Argentina (AR):** moneda default ARS; seleccionables ARS y USD; locale `es-AR`; timezone `America/Argentina/Buenos_Aires`; Mercado Pago disponible en moneda local según rollout.
- **Bolivia (BO):** moneda default BOB; seleccionables BOB y USD; locale `es-BO`; timezone `America/La_Paz`; sin Mercado Pago por default.
- **Chile (CL):** moneda default CLP; seleccionables CLP y USD; locale `es-CL`; timezone `America/Santiago`; Mercado Pago disponible en moneda local según rollout.
- **Colombia (CO):** moneda default COP; seleccionables COP y USD; locale `es-CO`; timezone `America/Bogota`; Mercado Pago disponible en moneda local según rollout.
- **Costa Rica (CR):** moneda default CRC; seleccionables CRC y USD; locale `es-CR`; timezone `America/Costa_Rica`; sin Mercado Pago por default.
- **Ecuador (EC):** moneda default USD; seleccionable USD; locale `es-EC`; timezone `America/Guayaquil`; sin Mercado Pago por default.
- **El Salvador (SV):** moneda default USD; seleccionable USD; locale `es-SV`; timezone `America/El_Salvador`; sin Mercado Pago por default.
- **Guatemala (GT):** moneda default GTQ; seleccionables GTQ y USD; locale `es-GT`; timezone `America/Guatemala`; sin Mercado Pago por default.
- **Honduras (HN):** moneda default HNL; seleccionables HNL y USD; locale `es-HN`; timezone `America/Tegucigalpa`; sin Mercado Pago por default.
- **México (MX):** moneda default MXN; seleccionables MXN y USD; locale `es-MX`; timezone `America/Mexico_City`; Mercado Pago disponible en moneda local según rollout.
- **Panamá (PA):** moneda default USD; seleccionable USD; locale `es-PA`; timezone `America/Panama`; sin Mercado Pago por default.
- **Paraguay (PY):** moneda default PYG; seleccionables PYG y USD; locale `es-PY`; timezone `America/Asuncion`; sin Mercado Pago por default.
- **Perú (PE):** moneda default PEN; seleccionables PEN y USD; locale `es-PE`; timezone `America/Lima`; Mercado Pago disponible en moneda local según rollout.
- **Puerto Rico (PR):** moneda default USD; seleccionable USD; locale `es-PR`; timezone `America/Puerto_Rico`; sin Mercado Pago por default.
- **República Dominicana (DO):** moneda default DOP; seleccionables DOP y USD; locale `es-DO`; timezone `America/Santo_Domingo`; sin Mercado Pago por default.
- **Uruguay (UY):** moneda default UYU; seleccionables UYU y USD; locale `es-UY`; timezone `America/Montevideo`; Mercado Pago disponible en moneda local según rollout.

**Trazabilidad:** Fuente: `docs/product-specs/stores/regional-markets.md`.


# 19. Claims defendibles al snapshot actual

Todo claim cuantitativo o de disponibilidad debe conservar fecha y condición. Esta sección registra los que ya cuentan con soporte suficiente.


## “0% comisión por venta.”

Defendible como claim de plataforma: Mercantis no cobra una comisión porcentual sobre cada venta. No incluye las tasas que pueda cobrar un proveedor externo de pagos.

**Trazabilidad:** Fuentes: landing/pricing.


## “10 días gratis.”

La duración de 10 días aparece de forma consistente como trial. Sin embargo, la elegibilidad exacta por plan debe mantenerse versionada porque se detectaron diferencias entre fuentes sobre qué planes entran en la prueba.

**Trazabilidad:** Fuentes: landing/pricing; caveat de consistencia.


## “Podés tener tu tienda lista en aproximadamente 10 minutos.”

Es defendible únicamente con condición: el Help Center lo presenta como referencia aproximada cuando el usuario ya tiene fotos y precios preparados. No debe convertirse en garantía universal.

**Trazabilidad:** Fuente: Help Center de onboarding.


## “No necesitás saber programar.”

Defendible. El onboarding y la experiencia están construidos para usuarios no técnicos y no requieren desarrollo web para crear y operar una tienda.

**Trazabilidad:** Fuentes: onboarding/landing.


## “Mercantis soporta 16 mercados de LATAM.”

Defendible en sentido técnico del modelo regional: los 16 países están definidos como mercados soportados/seleccionables. No equivale a afirmar que Mercantis tenga clientes activos o facturación relevante en los 16.

**Trazabilidad:** Fuente: regional-markets spec.


## “Mercado Pago está contemplado en AR, CL, CO, MX, PE y UY.”

Defendible con condición de país/moneda/rollout. No debe generalizarse a todos los mercados.

**Trazabilidad:** Fuente: regional-markets spec.


## “Efectivo, transferencia y métodos personalizados funcionan en todos los mercados soportados.”

Defendible según el contrato regional actual.

**Trazabilidad:** Fuente: regional-markets spec.


## “IA para importar catálogo.”

Defendible: existe como capacidad del producto.

**Trazabilidad:** Fuente: AI Product Import.


## “IA para generar o mejorar títulos y descripciones.”

Defendible: la IA participa en contenido textual del catálogo.

**Trazabilidad:** Fuente: capacidades de IA/catálogo.


## “IA para categorizar productos.”

Defendible: la categorización asistida forma parte del flujo actual.

**Trazabilidad:** Fuente: capacidades de IA/catálogo.


## “IA para mejorar imágenes.”

Defendible: la edición/mejora de imágenes asistida por IA está implementada.

**Trazabilidad:** Fuente: AI Image Editing.



## “Los cuatro planes tienen 10 días gratis sin tarjeta.”

Defendible al snapshot actual. Lite, Pro, Max y Ultra tienen 10 días de prueba sin tarjeta y el período comienza al crear la tienda.

**Trazabilidad:** confirmación directa del fundador, 2026-09-10.


## “GoCuotas está disponible en Mercantis.”

Defendible **sólo con alcance Argentina** al snapshot actual. No debe inferirse disponibilidad internacional.

**Trazabilidad:** confirmación directa del fundador, 2026-09-10.

# 20. Aprendizajes y límites confirmados

Una base de conocimiento útil también necesita registrar aquello que Mercantis aprendió y las limitaciones que no deben esconderse.


## ¿Qué hipótesis estratégica ya fue corregida?

La importancia relativa de los templates/storefront como principal diferenciador fue sobreestimada. La evolución del producto mostró que la ventaja más interesante está en el backoffice, la operación y la automatización. La tienda pública sigue importando, pero dejó de ser el centro exclusivo de la tesis.

**Trazabilidad:** Fuente: evolución estratégica del fundador.


## ¿Qué hacen mejor algunos competidores?

Jugadores maduros como Shopify y Tiendanube tienen ventajas en amplitud de templates, ecosistema e integraciones desarrolladas durante muchos años. Reconocerlo evita construir un posicionamiento basado en negar fortalezas reales del mercado.

**Trazabilidad:** Fuente: análisis competitivo y criterio del fundador.


## ¿Existe deuda técnica documentada?

Sí. El core mantiene un tracker formal de deuda técnica. Entre los temas abiertos aparecen rate limiting en ciertas rutas de IA de onboarding, trazabilidad de origen de descuentos, optimización de contexto/acceso por tienda, restos de modelos legacy de billing, un workaround temporal de deploy, controles antifraude cruzados entre programas de growth y una definición más robusta de elegibilidad financiera de comisiones de Partners.

Esta información es interna. Debe servir para priorización y memoria institucional, no para que un agente la convierta automáticamente en contenido público.

**Trazabilidad:** Fuente: docs/tech-debt/tech-debt-tracker.md.


## ¿Qué aprendizaje comercial cambió la forma de construir?

El equipo aprendió que no debe comprometer desarrollo específico sólo para convencer a un lead que todavía no pagó. Un pedido puede ser interesante, pero la intención verbal no reemplaza una señal económica real.

También aprendió que construir sin distribuir tiene un costo acumulativo. Producto y distribución deben avanzar en paralelo desde etapas tempranas.

**Trazabilidad:** fundador.


## ¿Cuál es hoy el cuello de botella percibido?

El fundador considera que Mercantis todavía no se expuso suficientemente al mercado como para medir su potencial real. Las métricas tempranas de conversión son alentadoras, pero el gran desafío actual es generar distribución y adquisición a una escala que permita validar la tesis con una muestra mayor.

**Trazabilidad:** fundador; interpretación interna al 2026-09-10.


# Apéndice A — Reglas de uso de esta base

1. No transformar roadmap en feature disponible.
2. No transformar soporte técnico en claim comercial sin revalidación.
3. Guardar fecha de vigencia en pricing, trials, comisiones, países, monedas e integraciones.
4. Distinguir siempre entre capacidad técnica de un mercado y evidencia de clientes/ventas reales en ese mercado.
5. Distinguir la definición pública de “tienda online” de la visión estratégica de “sistema operativo para negocios”.
6. No usar deuda técnica, seguridad o controles internos como material público salvo decisión explícita.
7. Cuando exista conflicto entre landing, Help Center y spec del core, resolver una única fuente canónica antes de publicar el dato.
8. Para el snapshot 2026-09-10 quedan resueltas dos contradicciones anteriores por confirmación directa del fundador: **GoCuotas está live sólo en Argentina** y **los cuatro planes tienen 10 días gratis sin tarjeta desde la creación de la tienda**.


# Apéndice B — Familias de fuentes canónicas

- `docs/product-specs/stores/regional-markets.md` — países, monedas, providers, límites regionales.
- `docs/product-specs/growth/socios-program-overview.md` y specs relacionadas — Partners y Embajadores.
- `docs/tech-debt/tech-debt-tracker.md` — deuda técnica interna.
- Help Center dentro de `apps/help-center/documentacion/**` — comportamiento explicado al usuario (onboarding, equipo, métricas, pedidos, etc.).
- Docs/specs de catálogo e IA — importación, edición de imágenes, productos, variantes y servicios.
- Configuración de pricing/capabilities de landing/core — planes, límites y claims dinámicos.
- Landings por rubro — taxonomía y mensajes verticales.
- Documentación de arquitectura del core — stack, multi-tenancy, seguridad, caching y separación admin/storefront.

# Apéndice C — Estado de cierre de esta radiografía

La entrevista intensiva de fundador se considera **cerrada en esta versión**.

No quedan preguntas abstractas obligatorias para Lucas. La base contiene suficiente contexto para empezar a operar como memoria institucional y como fuente del Content Studio.

Las lagunas futuras se completarán únicamente cuando exista nueva evidencia natural:

- una feature se lance;
- aparezcan nuevos datos cuantitativos;
- exista un caso de cliente documentado;
- cambie pricing/mercados;
- surja una decisión de producto;
- una campaña o canal produzca aprendizaje;
- se obtenga información nueva sobre competencia.

La regla a partir de ahora es **actualizar por eventos reales, no seguir interrogando por completitud teórica**.

**Cierre:** 10 de septiembre de 2026.
