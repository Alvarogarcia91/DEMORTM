# PROMPT MAESTRO — MÓDULO DE INVENTARIOS RTM (DEMO)

> **Repo objetivo:** `Alvarogarcia91/DEMORTM`
>
> **Rama objetivo:** `alvaro01`
>
> **Objetivo de este documento:** servir como especificación/prompt de implementación para construir un módulo de **Inventarios** convincente, coherente con la operación real de Impresos RTM y visualmente integrado al demo actual.
>
> **IMPORTANTE:** esto es un **demo funcional/convincente**, no una migración completa de ERP ni un WMS productivo terminado. La prioridad es demostrar que Nexora entendió la operación de RTM y que el concepto puede crecer a un sistema integral.

---

# 0. INSTRUCCIÓN GENERAL PARA EL AGENTE / DESARROLLADOR

Antes de tocar código:

1. **Audita primero el repo actual de RTM.**
   - No asumas arquitectura.
   - Revisa `frontend/src/App.tsx`.
   - Revisa `frontend/src/components/Sidebar.tsx`.
   - Revisa `frontend/src/components/HomeView.tsx`, `ProduccionView.tsx`, `CalidadView.tsx`, `SuajesView.tsx`, `DisenoView.tsx`, `ReporteOperadorModal.tsx`.
   - Revisa `frontend/src/index.css` para reutilizar el lenguaje visual ya existente.
   - Revisa `frontend/src/services/api.ts` y `frontend/src/types.ts`.
   - Revisa `backend/main.py` para entender cómo se están sirviendo mocks y endpoints del demo.

2. **No refactorices todo el proyecto.**
   - Este trabajo debe integrarse al patrón actual del demo.
   - Evita introducir React Router, Redux, un ORM, una base de datos real o una arquitectura nueva salvo que sea estrictamente necesario.
   - El demo actual usa navegación por `activeTab`; mantén ese enfoque.
   - El backend actual es FastAPI con estado/mocks en memoria. Para esta fase, es perfectamente válido extender ese patrón.

3. **No copies literalmente ADS ni Super Colchones.**
   - Usa esos proyectos como inspiración de UX, trazabilidad y flujo de almacén.
   - El resultado final debe sentirse diseñado **para una imprenta industrial con Offset + Flexografía**, no para una empresa química ni para un distribuidor de colchones.

4. **No inventes procesos que contradigan RTM.**
   - Distingue siempre entre:
     - lo que RTM confirmó en las reuniones;
     - lo que se propone como mejora del nuevo sistema;
     - datos mock usados exclusivamente para demo.

5. **La navegación, wording y ejemplos deben estar en español.**
   - El usuario final es personal operativo/administrativo de RTM.
   - Evita anglicismos innecesarios en UI cuando haya una palabra natural en español.
   - `Kardex`, `FIFO`, `FEFO`, `QR`, `QA` y `OP` sí pueden conservarse porque forman parte del vocabulario de operación.

---

# 1. CONTEXTO DEL PROBLEMA EN RTM

RTM hoy tiene una ruptura clara entre planeación, producción, inventarios y calidad.

Los requerimientos que sí fueron expresados durante las sesiones de exploración y deben orientar el demo son:

- El inventario del sistema actual puede no coincidir con el inventario físico.
- Iván mostró un caso donde el sistema indicaba aproximadamente **22,000 pliegos**, pero físicamente quedaban alrededor de **2,500**.
- Los consumos de producción no siempre se descargan en tiempo real.
- Un operador puede volver a almacén por material adicional bajo la misma orden sin que la planeación quede enterada inmediatamente.
- Si hubo 1,000 pliegos de scrap/merma y se solicitan otros 1,000, hoy falta un control claro que diga:
  - cuánto se planeó;
  - cuánto se surtió originalmente;
  - cuánto se pidió adicional;
  - por qué;
  - quién lo autorizó;
  - qué ocurrió con el material perdido.
- Iván pidió explícitamente alertas cuando el material disponible no alcance para fabricar una orden.
- La alerta ideal debe aparecer **antes de arrancar producción**, no cuando el operador ya está esperando material.
- También se habló de mínimos/máximos y posibles materiales sustitutos, pero cualquier sustitución debe quedar controlada y trazable.
- Mariana explicó que RTM necesita conocer y rastrear los lotes de materia prima, especialmente papel/sustratos y tintas.
- En Flexografía algunas materias primas tienen caducidad, por lo que el manejo FIFO/FEFO es relevante.
- El producto terminado también debe manejar lote y trazabilidad.
- Si ya existe producto terminado disponible, ese inventario debe poder comprometerse/reservarse contra un pedido antes de mandar fabricar todo nuevamente.
- Puede existir un mínimo económico de producción, por lo que la cantidad a fabricar no siempre será exactamente igual al faltante.
- Las unidades de medida varían según el material y el proceso:
  - pliegos;
  - hojas;
  - kilogramos;
  - rollos;
  - metros lineales;
  - piezas;
  - cajas/paquetes;
  - eventualmente litros o kilos para ciertos consumibles.
- El scrap no debe forzarse a una sola unidad. Mariana explicó, por ejemplo, que cierto scrap de papel debe medirse por kg.
- La operación busca trazabilidad para IATF: orden, producto, lote, máquina/proceso, usuario, entradas/salidas, cambios y evidencia.
- Calidad hoy está separada en Access, por lo que una de las ventajas del nuevo sistema debe ser unir inventario + OP + QA + lote.

El módulo de Inventarios debe convertir esas dolencias en una historia visual muy clara durante la demo.

---

# 2. INSPIRACIÓN DE ADS — QUÉ SÍ DEBEMOS APROVECHAR

El repo de ADS tiene un módulo de inventario mucho más profundo que el demo de RTM. No se debe copiar entero, pero sí usarlo como referencia conceptual.

## 2.1 Estructura física que vale la pena adaptar

ADS maneja conceptos equivalentes a:

- `Warehouse`
- `WarehouseZone`
- `WarehouseLocation`
- `InventoryUnit`
- `InventoryUnitContent`
- `InventoryUnitLocation`
- `Lot`
- `InventoryMovement`
- `InventoryMovementLine`

Y en frontend tiene ideas útiles como:

- `InventoryPage.jsx`
- `StocksTab.jsx`
- `WarehousesLocationsTab.jsx`
- `MapTab.jsx`
- `HeatmapTab.jsx`
- `KardexTab.jsx`
- `PhysicalStockFormModal.jsx`
- `PhysicalStockDetailDrawer.jsx`
- `RearrangementsTab.jsx`
- `RepackTab.jsx`
- `LocationQrModal.jsx`

Además, ADS separa operaciones de almacén en un flujo tipo:

- resumen;
- entradas;
- acomodos;
- recolección/picking;
- verificación de salidas;
- incidencias;
- reimpresión de etiquetas.

## 2.2 Principios que SÍ debemos heredar

- **Ubicación física granular:** almacén → zona → ubicación.
- **Código único de ubicación.**
- **QR de ubicación.**
- **Unidad física manipulable:** rollo, caja, tarima, paquete, etc.
- **Lote por artículo.**
- **Historial de ubicación.**
- **Kardex inmutable como explicación de por qué existe una existencia.**
- **Estados operativos:** disponible, reservado, cuarentena, surtido, etc.
- **Conteos físicos y conciliación.**
- **Reubicaciones trazables.**
- **Recepción y acomodo como eventos distintos.**
- **Surtido/picking separado de la simple existencia.**
- **Bloqueos de material no conforme o en cuarentena.**
- **Búsqueda rápida por código, artículo, lote, ubicación o QR.**
- **Persistencia de filtros/tabs cuando sea sencillo conservarla.**

## 2.3 Qué NO copiar de ADS

- No usar vocabulario químico.
- No usar sacos/cubetas como foco principal solo porque existen en ADS.
- No copiar su complejidad de permisos completa.
- No implementar todos los invariantes productivos del ERP ADS.
- No duplicar todos los flujos de Mesa de Verificación.
- No convertir este demo en un WMS de cientos de pantallas.

---

# 3. INSPIRACIÓN DE SUPER COLCHONES — QUÉ SÍ DEBEMOS APROVECHAR

En las conversaciones del proyecto de Super Colchones se trabajaron ideas útiles para operación física de almacén:

- recibir mercancía contra un documento/origen;
- identificar unidades físicamente con UID/QR cuando tenga sentido;
- acomodo dirigido escaneando artículo/unidad + ubicación;
- pasillos, posiciones y niveles;
- trazabilidad entre almacenes/sucursales;
- transferencias controladas;
- FIFO/FEFO;
- picking/surtido sugerido;
- bloqueo de errores de surtido;
- armado de carga y entrega mediante escaneo.

## Qué se adapta a RTM

En RTM no queremos serializar cada hoja ni cada pliego individual.

Se debe serializar o identificar a un nivel físicamente útil, por ejemplo:

- una bobina;
- un rollo de sustrato;
- una tarima de papel;
- una caja de insumos;
- un tambor/cubeta de tinta si aplica;
- un paquete/caja de producto terminado;
- un rollo terminado;
- un lote/bache de producto terminado.

La idea de Super Colchones es útil principalmente para visualizar el recorrido físico:

**recibir → identificar → acomodar → reservar → surtir → producir → regresar sobrante / registrar merma → recibir producto terminado → liberar QA → reservar para pedido → preparar embarque.**

---

# 4. DÓNDE DEBE APARECER EN LA NAVEGACIÓN RTM

Actualmente `frontend/src/components/Sidebar.tsx` ya muestra:

- Inicio
- Producción (Offset & Flexo)
- Ingeniería de Suajes 2D
- Control de Calidad (QA)
- Diseño & Muestras PE
- Cotizaciones & Costos
- Órdenes de Trabajo (OP)
- Sustratos & Tintas
- Remisiones & Embarque
- Facturación
- Cuentas por cobrar
- Racks de Herramentales
- Pasaporte Lote & QR
- Reportes de Turno
- Configuración Planta

## Cambio requerido

Agregar en el sidebar una entrada principal:

**Inventarios**

Sugerencia:

- `id`: `inventarios`
- label: `Inventarios`
- icono: `Warehouse`, `PackageSearch` o un ícono equivalente de `lucide-react`.

## Ubicación recomendada

Colocarlo **después de `Sustratos & Tintas` y antes de `Remisiones & Embarque`**.

Razón:

- `Sustratos & Tintas` representa el catálogo/especificación de materiales.
- `Inventarios` representa dónde están, cuánto hay, en qué lote y qué movimientos han tenido.
- `Remisiones & Embarque` representa la salida comercial/logística posterior.

## MUY IMPORTANTE — no duplicar módulos existentes

### `Sustratos & Tintas`
No eliminarlo.

Debe seguir siendo la vista de catálogo / datos maestros del material.

Inventarios debe **consumir/referenciar** esos artículos, no intentar reemplazar el catálogo.

### `Racks de Herramentales`
No eliminarlo.

Los suajes, placas, grabados y demás herramentales tienen lógica propia y deben seguir viviendo en su módulo especializado.

Inventarios puede mostrar una referencia de disponibilidad/ubicación de herramental cuando sea útil, pero **no debe duplicar el módulo de Herramentales**.

### `Pasaporte Lote & QR`
No eliminarlo.

Inventarios alimenta el historial físico y el pasaporte de lote. El Pasaporte puede seguir siendo una vista transversal de trazabilidad.

---

# 5. PROPUESTA DE ARQUITECTURA DE UI DEL MÓDULO

Crear una vista principal, por ejemplo:

`frontend/src/components/InventariosView.tsx`

Debe respetar el diseño actual del demo RTM:

- fondo gris/azul muy claro;
- cards blancas;
- azul RTM/Nexora;
- tipografía, radios, sombras y espaciados existentes;
- tablas compactas y limpias;
- badges/chips de estado;
- iconografía Lucide;
- sensación moderna y de ERP industrial;
- nada de interfaz genérica de ecommerce.

## Tabs sugeridas para el demo

No todas necesitan backend real. Lo importante es que el recorrido completo sea demostrable.

1. **Resumen**
2. **Existencias**
3. **Almacenes & Ubicaciones**
4. **Entradas**
5. **Surtido a Producción**
6. **Movimientos / Kardex**
7. **Conteo Físico**
8. **Producto Terminado**
9. **Scrap & Remanentes**
10. **Alertas**

Si 10 tabs se sienten excesivas horizontalmente, agrupar visualmente sin perder funcionalidad. Ejemplo:

- Operación: Existencias, Entradas, Surtido, Producto Terminado
- Control: Kardex, Conteos, Alertas
- Configuración física: Almacenes & Ubicaciones
- Recuperación: Scrap & Remanentes

Para el demo es preferible **tener 7–9 tabs excelentes** que 14 mediocres.

---

# 6. TAB “RESUMEN” — DASHBOARD DE INVENTARIOS

La pantalla inicial debe contar una historia en menos de 15 segundos.

## KPIs propuestos

Usar datos mock realistas y coherentes con RTM, por ejemplo:

- Exactitud inventario: `97.8%`
- Material reservado a OP: `68,450 pliegos`
- Bobinas disponibles: `27`
- Lotes en cuarentena QA: `4`
- Alertas por faltante: `3`
- Material próximo a caducar: `2 lotes`
- Producto terminado reservado: `18,500 pzas`
- Merma / scrap del mes: `2.85%`

Los valores deben ser consistentes entre las distintas tabs.

## Secciones de dashboard

### A. “Disponibilidad para producción”
Mostrar OP próximas con semáforo:

- Verde: material completo y liberado.
- Amarillo: material parcial.
- Rojo: faltante o bloqueado.

Ejemplo demo:

- `OP-2026-882` — Etiqueta BOPP — Material completo.
- `OP-2026-891` — Manual Black & Decker — faltan 4,200 pliegos.
- `OP-2026-895` — Etiqueta farmacéutica — tinta disponible pero lote próximo a caducar.

### B. “Radar de inventario”
Alertas relevantes:

- diferencia físico vs sistema;
- lote bloqueado por QA;
- material insuficiente para OP;
- lote próximo a caducar;
- exceso de surtido contra BOM/consumo esperado;
- ubicación bloqueada;
- inventario de revisión obsoleta.

### C. “Inventario por estado”
Barra o gráfica:

- Disponible
- Reservado
- En cuarentena
- En proceso
- No conforme

### D. “Movimientos de hoy”
Timeline corta:

- recepción;
- acomodo;
- surtido OP;
- devolución de sobrante;
- liberación producto terminado;
- transferencia/reubicación.

---

# 7. TAB “EXISTENCIAS”

Esta debe ser una de las pantallas más sólidas del demo.

## Objetivo

Responder inmediatamente:

> “¿Qué tengo, cuánto tengo, en qué lote, en qué unidad, dónde está y qué parte está comprometida?”

## Buscador principal

Debe buscar por:

- código de artículo;
- descripción;
- lote proveedor;
- lote interno;
- código de unidad física;
- ubicación;
- orden de producción relacionada;
- QR simulado.

Placeholder sugerido:

`Buscar artículo, lote, rollo, ubicación, OP...`

## Filtros

- Almacén
- Zona
- Tipo de material
- Estado
- Tecnología asociada: Offset / Flexo / General
- Artículo
- Lote
- Unidad de medida
- Con caducidad / sin caducidad
- Solo faltantes / solo reservados / solo cuarentena

## Columnas de tabla sugeridas

- Artículo
- Descripción
- Revisión (cuando aplique)
- Tipo
- Lote proveedor
- Lote interno
- Presentación / unidad física
- Existencia física
- Reservado
- Disponible real
- Unidad
- Ubicación
- Estado QA
- Caducidad
- Último movimiento

## Ejemplos de artículos RTM para mocks

### Offset
- Papel bond 75 g — pliegos
- Papel couché 90 g — pliegos
- Cartulina SBS — pliegos
- Papel en bobina — kg / rollo según catálogo

### Flexografía
- BOPP blanco — rollo / metros lineales
- BOPP transparente — rollo / metros
- Papel térmico — rollo
- Liner siliconado — rollo
- Laminado — rollo
- Adhesivo — kg/litro si aplica
- Tinta PMS — kg/litro según presentación
- Barniz UV / acuoso — kg/litro

### Empaque / consumibles
- Cajas
- Centros / cores
- Tarimas
- Stretch film

No asumir que todos estos materiales existen en el catálogo actual: son **datos demo sugeridos** para mostrar variedad de unidades y flujos. Mantener nombres genéricos si no se encuentra el maestro exacto.

## Drawer / modal de detalle

Al abrir una existencia, mostrar:

### Identidad
- artículo;
- descripción;
- revisión;
- lote proveedor;
- lote RTM;
- unidad física / QR;
- estado.

### Cantidades
- recibido;
- consumido;
- reservado;
- disponible;
- remanente.

### Ubicación
- almacén;
- zona;
- pasillo/rack/nivel/posición;
- historial de ubicaciones.

### Trazabilidad
Timeline:

`Recepción → QA entrada → Acomodo → Reserva OP → Surtido → Devolución sobrante / consumo → cierre`

### Documentos relacionados
- recepción;
- OP;
- QA;
- movimiento Kardex.

---

# 8. MODELO DE UBICACIONES FÍSICAS PARA RTM

Inspirado en ADS, pero simplificado para demo.

## Jerarquía

**Almacén → Zona → Ubicación**

Ejemplo de ubicación:

`ALM-MP / PAPEL / P02-R03-N02-P04`

## Almacenes demo sugeridos

- `ALM-MP` — Almacén de Materia Prima
- `ALM-PT` — Almacén de Producto Terminado

Si el layout real de RTM maneja un solo almacén físico, estos pueden presentarse como áreas lógicas del mismo almacén y no como edificios distintos.

## Zonas demo sugeridas

- Papel Offset
- Bobinas Flexo
- Tintas & Barnices
- Empaque
- Cuarentena QA
- Staging Producción
- Producto Terminado
- Staging Embarque
- Scrap / Remanentes

## Tipos de ubicación

- Rack
- Piso
- Tarima
- Área temporal
- Cuarentena
- Staging

## Atributos visuales

- código;
- nombre;
- zona;
- pasillo;
- rack;
- nivel;
- posición;
- capacidad estimada;
- ocupación actual;
- activa/bloqueada;
- motivo de bloqueo;
- QR.

## QR

Cada ubicación puede mostrar un QR mock con una animación/lector similar al patrón visual usado en otros demos.

El QR debe representar un identificador **inmutable de ubicación**.

No usar el texto visible como única identidad interna.

---

# 9. MAPA VISUAL DEL ALMACÉN

Tomar como inspiración el `MapTab` de ADS, pero hacer una versión más compacta y demo-friendly.

Objetivo:

- que el usuario vea rápidamente qué zonas están llenas, libres, bloqueadas o en cuarentena;
- que pueda dar click en una zona y filtrar existencias.

## Vista propuesta

Bloques de almacén con porcentaje de ocupación:

- Papel Offset 78%
- Bobinas Flexo 64%
- Tintas 52%
- Cuarentena 21%
- Producto Terminado 71%

Estados visuales:

- normal;
- alta ocupación;
- bloqueada;
- alerta QA.

No se requiere un CAD real del edificio. Es un mapa lógico/operativo.

---

# 10. TAB “ENTRADAS” — RECEPCIÓN DE MATERIA PRIMA

## Flujo demo

### Paso 1 — Identificar recepción

Seleccionar:

- proveedor;
- OC / referencia;
- factura/remisión;
- fecha;
- material esperado.

### Paso 2 — Capturar material físico

Por línea:

- artículo;
- descripción;
- cantidad esperada;
- cantidad recibida;
- unidad;
- lote proveedor;
- fecha de fabricación;
- caducidad si aplica;
- presentación;
- número de unidades físicas.

### Paso 3 — Generar lote interno RTM

Ejemplo:

`RTM-MP-260906-018`

Esto debe quedar vinculado al lote del proveedor.

### Paso 4 — Estado de QA de entrada

Posibles estados:

- Pendiente de inspección
- Liberado
- Liberado condicionado
- Cuarentena
- Rechazado

No inventar reglas de inspección en Inventarios; enlazar conceptualmente con Control de Calidad.

### Paso 5 — Generar unidades físicas

Ejemplo:

- Bobina: `ROL-260906-001`
- Tarima papel: `TAR-260906-014`
- Caja tinta: `CJ-260906-051`

### Paso 6 — Acomodo

Sugerir ubicación y simular escaneo:

`Escanea unidad → Escanea ubicación → Confirmar acomodo`

## Demo importante

Mostrar que una recepción **no se vuelve disponible automáticamente** si QA no la libera.

---

# 11. RESERVA DE INVENTARIO PARA PEDIDOS / OP

Este punto es crítico para RTM.

Cuando existe un pedido u OP, el sistema debe poder mostrar:

- requerido;
- disponible;
- reservado para otras órdenes;
- faltante;
- lote sugerido;
- fecha de caducidad;
- sustituto posible;
- estado QA.

## Regla principal

**No confundir físico con disponible.**

Ejemplo:

- Físico: 22,000 pliegos
- Reservado otras OP: 8,000
- Bloqueado QA: 2,000
- Disponible real: 12,000
- Requerido nueva OP: 16,000
- Faltante: 4,000

El demo debe hacer visible esta diferencia porque responde directamente al dolor expuesto por Iván.

## Estado de cobertura

- Completa
- Parcial
- Sin cobertura
- Bloqueada por QA
- Riesgo por caducidad

---

# 12. TAB “SURTIDO A PRODUCCIÓN”

Esta pantalla debe ser una de las estrellas del demo.

## Objetivo

Resolver el problema:

> “La OP necesitaba X, pero producción volvió por más material y nadie se enteró por qué.”

## Vista de órdenes pendientes de surtido

Tabla/card por OP:

- OP
- Cliente
- Producto
- Tecnología
- Máquina
- Fecha requerida
- Materiales completos / pendientes
- Estado de surtido

## Detalle de OP

Para cada material:

- planeado;
- reservado;
- surtido acumulado;
- consumido reportado;
- devuelto;
- scrap reportado;
- saldo teórico.

## Flujo normal

1. Abrir OP.
2. Ver materiales requeridos.
3. Sistema propone lote FIFO/FEFO.
4. Operador escanea unidad/QR.
5. Sistema valida artículo + lote + estado QA.
6. Confirmar cantidad surtida.
7. Registrar movimiento de almacén a staging/producción.

## Solicitud EXTRA de material

Si una OP ya recibió su cantidad planeada y se solicita material adicional:

Mostrar modal obligatorio:

### “Material adicional para OP”

Campos:

- material;
- cantidad adicional;
- unidad;
- motivo;
- proceso donde ocurrió;
- máquina;
- observación;
- evidencia/foto mock opcional;
- solicitante;
- autorizador.

Motivos sugeridos:

- Merma de impresión
- Ajuste / puesta a punto
- Error de corte
- Error de doblado
- Daño de material
- Rechazo QA
- Ajuste de registro/color
- Cambio de bobina
- Otro

Al confirmar:

- registrar incidencia;
- crear movimiento adicional;
- incrementar consumo/surtido de la OP;
- alimentar KPI de desviación de consumo.

Esta historia debe mostrarse claramente porque fue una necesidad explícita de Iván.

---

# 13. DEVOLUCIÓN DE SOBRANTE DE PRODUCCIÓN

No todo material surtido debe considerarse consumido.

Permitir flujo:

`OP → devolver sobrante → inspeccionar estado → reingresar ubicación`

Campos:

- OP;
- material;
- lote;
- cantidad devuelta;
- unidad;
- estado;
- ubicación destino;
- observaciones.

Si se trata de rollo/bobina parcialmente consumido:

- marcar como **remanente**;
- conservar mismo lote;
- actualizar cantidad real;
- generar/reimprimir etiqueta de remanente si aplica.

---

# 14. SCRAP & REMANENTES

Separar conceptualmente:

## Scrap
Material perdido/no recuperable.

Debe guardar:

- OP;
- artículo;
- lote;
- cantidad;
- unidad;
- etapa/proceso;
- máquina;
- causa;
- usuario;
- fecha/hora.

## Remanente
Material utilizable que quedó después de una operación.

Ejemplo:

- Bobina original: 2,500 m
- Consumido: 1,820 m
- Remanente: 680 m

El remanente regresa a almacén con:

- identidad física;
- lote original;
- cantidad real;
- ubicación;
- estado QA cuando aplique.

## MUY IMPORTANTE

No asumir una sola UOM para scrap.

Mostrar ejemplos en:

- kg;
- pliegos;
- metros;
- piezas.

---

# 15. PRODUCTO TERMINADO

Conectar conceptualmente con el Access de Calidad actual y con el futuro módulo unificado.

## Flujo

1. Producción termina una corrida/bache.
2. Se declara cantidad producida.
3. Se crea lote/bache de producto terminado.
4. Estado inicial: **Pendiente QA**.
5. QA realiza auditoría final.
6. Si aprueba:
   - cambia a Liberado;
   - se generan etiquetas;
   - se vuelve disponible para reserva/embarque.
7. Si rechaza:
   - bloquear lote;
   - mandar a cuarentena / material no conforme.

## Campos a mostrar

- Lote PT
- OP
- Pedido
- Artículo
- Revisión
- Cliente
- Tecnología
- Máquina
- Cantidad producida
- Cantidad liberada
- Unidad de empaque
- Piezas por paquete/rollo
- Cajas/paquetes
- Estado QA
- Ubicación
- Fecha de producción

## Reserva de PT

Caso clave:

Pedido: 30 rollos

Existencia PT liberada: 15 rollos

El sistema debe:

- reservar 15 existentes al pedido;
- calcular que faltan 15;
- planeación decide cantidad real a fabricar según mínimo económico.

Mostrar visualmente:

`Pedido 30 → Reservado PT 15 → Faltante 15 → Producción sugerida 20 (mínimo económico)`

El “20” es un ejemplo de demo, no una regla universal.

---

# 16. KARDEX / MOVIMIENTOS

El Kardex debe ser **append-only conceptualmente**.

No presentar la idea de editar movimientos históricos libremente.

## Tipos de movimiento sugeridos

- RECEPCIÓN
- LIBERACIÓN QA
- ACOMODO
- REUBICACIÓN
- RESERVA
- LIBERACIÓN DE RESERVA
- SURTIDO A OP
- SURTIDO EXTRA A OP
- DEVOLUCIÓN DE PRODUCCIÓN
- SCRAP
- AJUSTE POSITIVO
- AJUSTE NEGATIVO
- ALTA PRODUCTO TERMINADO
- CUARENTENA
- LIBERACIÓN DE CUARENTENA
- PICKING EMBARQUE
- SALIDA EMBARQUE

## Tabla

- Folio movimiento
- Fecha/hora
- Tipo
- Artículo
- Lote
- Unidad física
- Cantidad
- UOM
- Origen
- Destino
- OP / Pedido
- Usuario
- Motivo

## Drawer de detalle

Mostrar antes/después:

- ubicación anterior;
- ubicación nueva;
- cantidad anterior;
- cantidad nueva;
- estado anterior;
- estado nuevo;
- documento origen;
- usuario;
- hora.

---

# 17. CONTEO FÍSICO

Inspirarse en la conversación previa donde se quería un módulo de conteo de stock simple, entendible y con QR.

## Objetivo

Contar lo que físicamente existe sin alterar directamente el saldo del sistema durante la captura.

## Flujo demo

1. Crear conteo.
2. Seleccionar alcance:
   - almacén;
   - zona;
   - ubicación;
   - familia de artículos.
3. Congelar snapshot teórico del conteo.
4. Escanear ubicación.
5. Escanear unidad / buscar material.
6. Capturar cantidad física.
7. Mostrar diferencia.
8. Enviar a revisión.
9. Autorizar ajuste.
10. Generar movimiento de ajuste.

## Estados

- Borrador
- En conteo
- En revisión
- Conciliado
- Cerrado
- Cancelado

## Tabla de diferencias

- artículo;
- lote;
- sistema;
- físico;
- diferencia;
- porcentaje;
- observación;
- acción.

## KPI

**Exactitud de inventario**

`1 - (diferencia absoluta / inventario teórico)`

Para demo basta mostrar una métrica coherente sin pretender certificar la fórmula contable final.

---

# 18. ALERTAS DE INVENTARIO

Crear una tab/lista de alertas accionables.

Tipos:

1. **Stock insuficiente para OP**
2. **Stock por debajo de mínimo**
3. **Lote próximo a caducar**
4. **Lote caducado**
5. **Material bloqueado por QA**
6. **Diferencia físico vs sistema**
7. **Surtido extra fuera de tolerancia**
8. **Material sin movimiento / envejecido**
9. **Inventario ligado a revisión obsoleta**
10. **Ubicación saturada o bloqueada**
11. **PT sin liberar QA**
12. **Material reservado para orden retrasada**

Cada alerta debe tener:

- severidad;
- entidad;
- descripción;
- fecha;
- responsable sugerido;
- acción rápida.

---

# 19. FIFO / FEFO

RTM indicó que algunos materiales, especialmente en Flexografía, tienen caducidad.

## Regla propuesta

- Material sin caducidad: FIFO.
- Material con caducidad: FEFO.

## UI

Cuando se surte una OP:

Mostrar:

`Lote recomendado: RTM-MP-260701-004 · Caduca 2027-07-01 · FEFO`

Si el usuario intenta escoger otro lote:

Mostrar advertencia:

> “Existe un lote con vencimiento anterior disponible. Si deseas omitir la sugerencia FEFO, registra motivo.”

Para demo puede ser una validación visual sin permisos complejos.

---

# 20. SUSTITUCIÓN DE MATERIAL

Iván mencionó que cuando un material no está disponible, sería útil ver posibles alternativas.

Esto **NO debe convertirse en sustitución libre**.

## Flujo propuesto

1. OP detecta faltante.
2. Mostrar sustitutos previamente compatibles/autorizados.
3. Usuario solicita sustitución.
4. Requiere motivo.
5. QA/Ingeniería/Planeación aprueban según demo.
6. Se registra desviación/control de cambio.
7. Se surte sustituto.

## UI demo

Card:

`Material requerido: BOPP BLANCO 2mil 10"`

`Disponible: 0 m`

`Alternativa compatible: BOPP BLANCO 2mil 10.5" — 8,400 m`

Botón:

`Solicitar sustitución`

No usar botón “Usar de todos modos”.

---

# 21. REVISIONES DE ARTÍCULO Y OBSOLESCENCIA

RTM maneja revisiones de artículo y requiere conservar historial.

Inventarios debe poder diferenciar:

- Número de parte
- Revisión vigente
- Revisión obsoleta

## Al activar una nueva revisión

El demo debe ser capaz de mostrar una alerta si queda inventario de revisión anterior.

Ejemplo:

`Parte 71-4455 Rev. B activa`

`Quedan 420 piezas de Rev. A en PT`

Acciones:

- Bloquear
- Segregar
- Solicitar disposición
- Registrar destrucción

No eliminar histórico.

---

# 22. TRAZABILIDAD END-TO-END

Esta es la historia principal para IATF.

El sistema debería poder responder:

> “Este rollo/caja que entregué al cliente, ¿de qué materia prima salió, qué lote usó, en qué OP se fabricó y qué QA lo liberó?”

## Cadena visual propuesta

**Proveedor**
↓
**Lote proveedor**
↓
**Recepción RTM**
↓
**Lote interno RTM**
↓
**Ubicación**
↓
**Reserva OP**
↓
**Surtido a Producción**
↓
**Máquina / proceso**
↓
**Consumo / scrap / devolución**
↓
**Lote de Producto Terminado**
↓
**Auditoría QA**
↓
**Paquete / caja / rollo**
↓
**Pedido / Remisión**
↓
**Cliente**

Crear en demo una visualización tipo timeline/stepper cuando se abre un lote.

---

# 23. ESTADOS DE INVENTARIO PROPUESTOS

No usar 30 estados en demo. Mantener set claro:

- Disponible
- Reservado
- Pendiente de acomodo
- Pendiente QA
- En cuarentena
- En Producción / Surtido
- Remanente
- No conforme
- Bloqueado
- Consumido
- Embarcado

Los estados “Consumido” y “Embarcado” pueden existir únicamente en historial y no como saldo activo.

---

# 24. UNIDADES DE MEDIDA

La arquitectura debe permitir UOM por artículo.

## Ejemplos RTM

- Pliego
- Hoja
- Pieza
- Rollo
- Metro lineal
- Kilogramo
- Litro
- Caja
- Paquete
- Tarima

## Conversiones

Cuando una captura se haga en una unidad distinta a la base, conservar conceptualmente:

- cantidad capturada;
- UOM capturada;
- factor utilizado;
- cantidad base resultante.

Esto evita que una conversión histórica cambie si el catálogo se modifica después.

Para demo no es necesario implementar motor universal de conversiones, pero el modelo/UI debe verse preparado para ello.

---

# 25. MODELO DE DATOS PROPUESTO PARA EL DEMO

Si se decide ampliar FastAPI, mantenerlo simple.

Se pueden definir mocks/Pydantic equivalentes a:

## Warehouse
- id
- code
- name
- description
- active

## WarehouseZone
- id
- warehouse_id
- code
- name
- purpose

## WarehouseLocation
- id
- zone_id
- code
- aisle
- rack
- level
- position
- purpose
- blocked
- block_reason
- occupancy_pct
- qr_code

## InventoryLot
- id
- article_code
- article_revision
- supplier_lot
- internal_lot
- received_date
- expiration_date
- qa_status

## InventoryUnit
- id
- code
- type
- lot_id
- current_location_id
- quantity
- uom
- state
- is_remnant
- qr_code

## InventoryReservation
- id
- order_id
- article_code
- lot_id
- quantity
- uom
- status

## InventoryMovement
- id
- folio
- movement_type
- timestamp
- article
- lot
- unit
- quantity
- uom
- from_location
- to_location
- order_id
- user
- reason

## ProductionIssue
- id
- order_id
- article
- planned_qty
- issued_qty
- extra_qty
- returned_qty
- scrap_qty
- uom
- coverage_status

## PhysicalCount
- id
- code
- scope
- status
- created_at
- counted_at
- differences

## FinishedGoodsLot
- id
- lot_code
- order_id
- customer_order
- article
- revision
- produced_qty
- released_qty
- reserved_qty
- available_qty
- qa_status
- location

No es obligatorio crear una base de datos real para esta fase.

---

# 26. ENDPOINTS DEMO PROPUESTOS

Solo implementarlos si ayudan a mantener consistencia de datos entre pantallas.

Sugeridos:

- `GET /api/inventory/summary`
- `GET /api/inventory/stocks`
- `GET /api/inventory/stocks/{id}`
- `GET /api/inventory/warehouses`
- `GET /api/inventory/locations`
- `GET /api/inventory/movements`
- `GET /api/inventory/production-issues`
- `POST /api/inventory/production-issues/{op}/issue`
- `POST /api/inventory/production-issues/{op}/extra`
- `POST /api/inventory/production-issues/{op}/return`
- `GET /api/inventory/receipts`
- `POST /api/inventory/receipts`
- `GET /api/inventory/finished-goods`
- `GET /api/inventory/counts`
- `POST /api/inventory/counts`
- `GET /api/inventory/alerts`

Si el tiempo del demo es corto, frontend mocks centralizados son aceptables, pero evitar que cada componente tenga datos contradictorios independientes.

---

# 27. DATOS MOCK — ESCENARIOS QUE DEBEN EXISTIR

Crear escenarios narrativos, no solo filas random.

## Escenario A — OP con cobertura completa

- OP: `OP-2026-882`
- Tecnología: Flexo
- Producto: Etiqueta BOPP
- Material principal disponible
- Lote liberado QA
- FEFO correcto
- Estado: Listo para surtir

## Escenario B — faltante antes de producción

- OP: `OP-2026-891`
- Tecnología: Offset
- Cliente: Black & Decker
- Requerido: 18,000 pliegos
- Disponible real: 13,800
- Faltante: 4,200
- Alerta roja
- Acción: “Generar solicitud / revisar sustituto”

## Escenario C — material extra por merma

- OP: `OP-2026-884`
- Planeado: 12,000 pliegos
- Surtido original: 12,000
- Solicitud extra: 800
- Motivo: Ajuste de registro
- Autorizado por Supervisor
- Mostrar impacto en merma.

## Escenario D — lote próximo a caducar

- Tinta PMS 186 C
- Lote proveedor visible
- Caduca en 18 días
- Sugerencia FEFO

## Escenario E — producto terminado existente

- Pedido: 30 rollos
- PT liberado disponible: 15
- Reservar 15
- Faltante: 15
- Producción sugerida: 20 por mínimo económico (ejemplo demo)

## Escenario F — diferencia física

- Sistema: 22,000 pliegos
- Conteo físico: 2,500
- Diferencia: -19,500

Este escenario debe existir porque conecta exactamente con la dolencia relatada por Iván. No presentarlo como dato histórico real de hoy; es una recreación demo del tipo de problema que relató.

## Escenario G — cuarentena QA

- Bobina recibida
- Lote proveedor capturado
- Pendiente/liberación condicionada
- Stock físico existe, pero `Disponible = 0` hasta QA.

---

# 28. UX DE ESCANEO QR

Crear una experiencia visual de escaneo reutilizable.

No hace falta acceso real a cámara para el demo.

## Estados de animación

1. “Listo para escanear”
2. línea/laser animado
3. “Código detectado”
4. card del elemento
5. confirmación

## Usos

- escanear ubicación;
- escanear rollo/bobina;
- surtir OP;
- devolver remanente;
- contar inventario;
- preparar salida.

Debe existir una forma manual de búsqueda por si no se usa QR durante la demo.

---

# 29. INTEGRACIÓN CON PRODUCCIÓN

Inventarios no puede ser isla.

## Desde una OP

Mostrar botón o sección:

**Disponibilidad de materiales**

Resumen:

- 5 materiales completos
- 1 faltante
- 1 lote bloqueado

## Desde Inventarios

Al abrir una reserva/surtido, mostrar enlace visual a:

- OP
- máquina
- cliente
- fecha requerida

## Consumo

El reporte del operador actualmente registra producción, buenos, merma y tiempos. A futuro debe alimentar consumos reales.

Para demo, bastará con conectar conceptualmente:

`Reporte Operador → merma → inventario / OP`

No duplicar campos de reporte en Inventarios.

---

# 30. INTEGRACIÓN CON QA

QA decide si cierto inventario está operativo.

Casos:

### Materia prima
- Pendiente QA → no disponible
- Aprobada → disponible
- Rechazada → cuarentena/no conforme

### Producto terminado
- Pendiente QA → no embarcable
- Liberado → disponible para reserva/embarque
- Rechazado → cuarentena

La UI de Inventarios debe mostrar claramente el badge QA.

No implementar en Inventarios el checklist completo de auditoría; eso pertenece a `Control de Calidad (QA)`.

---

# 31. INTEGRACIÓN CON REMISIONES & EMBARQUE

Inventarios prepara el material; Embarques confirma la salida.

Flujo propuesto:

1. Pedido listo.
2. PT reservado.
3. Picking / staging.
4. Verificación de lote/cantidad.
5. Transferencia a `Staging Embarque`.
6. `Remisiones & Embarque` toma control.
7. Confirmación de salida crea movimiento final.

Evitar duplicar todo el módulo de embarque dentro de Inventarios.

---

# 32. INTEGRACIÓN CON PASAPORTE LOTE & QR

El Pasaporte debe poder consultar el historial generado por Inventarios.

Un lote debe mostrar:

- origen proveedor;
- recepción;
- QA;
- ubicaciones;
- OP donde se consumió;
- máquina/proceso;
- PT generado;
- liberación QA;
- pedido/remisión.

Inventarios genera eventos; Pasaporte los presenta transversalmente.

---

# 33. INTEGRACIÓN CON RACKS DE HERRAMENTALES

No mezclar inventario de materia prima con inventario técnico de suajes/placas/grabados.

Pero permitir relaciones:

OP necesita:

- materia prima X;
- tinta Y;
- suaje Z;

En cobertura de OP puede aparecer:

- Materiales: completos
- Herramental: disponible
- Suaje: en taller / listo / bloqueado

El estado del suaje debe venir del módulo existente, no duplicarse.

---

# 34. REGLAS DE NEGOCIO MÍNIMAS A REPRESENTAR

Aunque sea demo, estas reglas deben sentirse reales:

1. No permitir existencia negativa.
2. Material en cuarentena no cuenta como disponible.
3. Material rechazado no se puede surtir.
4. Lote caducado no se debe sugerir.
5. Reserva reduce disponible, no físico.
6. Surtido reduce almacén y mueve material a staging/producción.
7. Surtido extra requiere motivo.
8. Devolución de sobrante requiere cantidad real.
9. Scrap debe tener causa.
10. Ajuste físico debe venir de conteo/revisión, no editar saldo manualmente.
11. Cambio de ubicación genera movimiento/historial.
12. Lote proveedor y lote interno deben conservar vínculo.
13. PT no liberado por QA no se puede embarcar.
14. Revisión obsoleta debe poder bloquear inventario relacionado.
15. Toda acción crítica debe mostrar usuario + fecha/hora.
16. Los movimientos históricos no deben “desaparecer”.

---

# 35. WORDING

Usar lenguaje natural para RTM.

Preferir:

- Existencias
- Reservado
- Disponible
- Surtido a Producción
- Acomodo
- Reubicación
- Conteo físico
- Cuarentena
- Producto terminado
- Lote proveedor
- Lote RTM
- Remanente
- Material adicional
- Merma
- Ubicación

Evitar wording de otros clientes como:

- “despacho” si realmente significa salida/embarque;
- “fulfillment”;
- “inventory unit” visible al usuario;
- “bin”;
- “warehouse op”.

---

# 36. DISEÑO VISUAL

Seguir estrictamente el look del demo RTM existente.

## Características

- sidebar navy;
- azul Nexora como primary;
- cards blancas;
- fondos neutros;
- bordes muy suaves;
- sombras discretas;
- números grandes en KPIs;
- badges de estado legibles;
- tablas densas, pero no saturadas;
- hover states;
- drawers/modales amplios;
- iconos Lucide.

## Colores de estado sugeridos

- Verde: disponible/liberado
- Azul: reservado/en proceso
- Amarillo: parcial/por vencer
- Rojo: faltante/rechazado
- Morado: cuarentena/QA
- Gris: inactivo/histórico

No hacer un rainbow exagerado; mantener estética corporativa.

---

# 37. RESPONSIVE

El demo probablemente se mostrará en desktop, pero:

- tablas deben scrollar horizontalmente cuando sea necesario;
- filtros deben wrappear;
- drawers/modales no deben salirse del viewport;
- cards deben bajar de columnas de manera razonable.

Prioridad de diseño: 1366–1920 px de ancho.

---

# 38. RENDIMIENTO / IMPLEMENTACIÓN DEMO

No sobreingeniería.

- Reusar componentes.
- Centralizar mocks.
- No meter librerías pesadas sin necesidad.
- Evitar cientos de líneas duplicadas por cada tab si se puede crear helpers simples.
- Mantener TypeScript coherente con repo.
- Mantener FastAPI ligero.

Si se agregan endpoints, que la información cruzada sea consistente.

Ejemplo: si una OP tiene 4,200 pliegos faltantes en Resumen, debe decir lo mismo en Existencias, Surtido y Alertas.

---

# 39. FASES DE IMPLEMENTACIÓN

## FASE 1 — imprescindible para el demo

- entrada `Inventarios` en sidebar;
- `InventariosView`;
- Resumen;
- Existencias;
- Almacenes & Ubicaciones;
- Surtido a Producción;
- Kardex;
- Producto Terminado;
- Alertas;
- mocks consistentes;
- modal/drawer de detalle;
- experiencia QR simulada en al menos un flujo;
- escenario de faltante;
- escenario de surtido extra;
- escenario QA cuarentena;
- escenario reserva de PT.

## FASE 2 — muy deseable

- Entradas;
- acomodo dirigido;
- conteo físico;
- scrap & remanentes;
- FEFO visual;
- sustitución controlada.

## FASE 3 — posterior / implementación real

- integración completa con compras;
- integración real con OP/BOM;
- integración con QA real;
- transacciones/locks;
- permisos;
- auditoría inmutable;
- impresoras/labels reales;
- escaneo cámara/handheld;
- inventario multi-almacén productivo;
- migración de datos desde Zafiro/Access/Excel.

---

# 40. CRITERIOS DE ACEPTACIÓN DEL DEMO

El módulo se considera listo cuando se pueden demostrar de forma clara los siguientes recorridos:

## Caso 1 — “¿Cuánto material tengo?”

En menos de 3 clicks:

- buscar artículo;
- ver físico;
- ver reservado;
- ver disponible;
- ver lote;
- ver ubicación;
- ver QA.

## Caso 2 — “¿Tengo material para esta OP?”

Abrir OP y mostrar cobertura:

- completa/parcial/faltante;
- lote sugerido;
- faltante exacto;
- alerta.

## Caso 3 — “Producción pidió material de más”

- abrir surtido OP;
- registrar extra;
- exigir motivo;
- mostrar nuevo movimiento;
- actualizar desviación/alerta.

## Caso 4 — “¿Dónde está esta bobina?”

- buscar código o QR;
- ver ubicación actual;
- historial de ubicaciones;
- lote;
- cantidad remanente.

## Caso 5 — “QA bloqueó un lote”

- stock físico sigue visible;
- disponible = 0;
- badge cuarentena;
- no permitir/sugerir surtido.

## Caso 6 — “Ya tengo producto terminado”

- pedido requiere 30;
- existen 15;
- reservar 15;
- producir faltante/mínimo económico.

## Caso 7 — “Auditor pregunta de dónde salió este producto”

- abrir lote PT;
- timeline proveedor → MP → OP → máquina → QA → PT → pedido.

## Caso 8 — “El sistema decía una cosa y físicamente hay otra”

- conteo muestra sistema vs físico;
- diferencia;
- revisión;
- ajuste trazable.

---

# 41. DEMO SCRIPT SUGERIDO

El módulo debe quedar construido pensando en este pitch:

### 1. Entrada

> “Iván, aquí ya no tienes que ir a preguntarle a almacén cuánto material queda. El sistema te separa existencia física, comprometida y disponible.”

### 2. Faltante

Abrir OP con faltante.

> “Antes de programar la máquina, ya sabes que te faltan 4,200 pliegos.”

### 3. Surtido

Mostrar lote sugerido.

> “Almacén sabe exactamente qué lote surtir y dónde está.”

### 4. Exceso

Solicitar material extra.

> “Si producción vuelve por otros 800 pliegos, ya no es una llave abierta. Tiene que quedar el motivo y quién lo pidió.”

### 5. QA

Mostrar cuarentena.

> “El material físicamente existe, pero Calidad lo tiene bloqueado, entonces Planeación no lo considera disponible.”

### 6. Producto terminado

Mostrar reserva de PT.

> “Antes de fabricar todo, comprometemos lo que ya tenemos liberado en almacén.”

### 7. Trazabilidad

Abrir timeline.

> “Y cuando venga auditoría, desde el producto terminado puedes regresar hasta el lote de materia prima y la orden que lo consumió.”

---

# 42. COSAS QUE NO DEBEN OCURRIR

- NO serializar cada pliego/hoja individual.
- NO crear un ecommerce de existencias.
- NO copiar nombres de CEDIS de Super Colchones.
- NO copiar materiales químicos de ADS como si fueran RTM.
- NO duplicar Control de Calidad.
- NO duplicar Racks de Herramentales.
- NO eliminar Sustratos & Tintas.
- NO mostrar físico = disponible como si fueran lo mismo.
- NO permitir ajustes de saldo sin trazabilidad.
- NO esconder lotes.
- NO asumir que todo se mide en piezas.
- NO asumir que toda materia prima caduca.
- NO hacer sustitución automática sin aprobación.
- NO meter 25 tabs en el primer nivel.
- NO romper el dashboard ni la navegación actual.
- NO cambiar toda la arquitectura del demo solo para este módulo.

---

# 43. ARCHIVOS QUE PROBABLEMENTE HABRÁ QUE TOCAR

Después de auditar la rama actual, como mínimo probablemente:

- `frontend/src/components/Sidebar.tsx`
- `frontend/src/App.tsx`
- `frontend/src/components/InventariosView.tsx` (nuevo)
- `frontend/src/index.css`
- `frontend/src/types.ts`
- `frontend/src/services/api.ts`
- `backend/main.py` si se decide soportar los mocks desde API

Opcionalmente crear subcomponentes:

- `frontend/src/components/inventarios/InventorySummary.tsx`
- `.../InventoryStocks.tsx`
- `.../InventoryLocations.tsx`
- `.../InventoryReceipts.tsx`
- `.../ProductionSupply.tsx`
- `.../InventoryKardex.tsx`
- `.../PhysicalCounts.tsx`
- `.../FinishedGoods.tsx`
- `.../InventoryAlerts.tsx`
- `.../InventoryQrScanner.tsx`
- `.../InventoryDetailDrawer.tsx`

No es obligatorio seguir exactamente esos nombres. Priorizar coherencia con el repo.

---

# 44. REFERENCIAS PARA EL IMPLEMENTADOR

## RTM

Repo actual:

`Alvarogarcia91/DEMORTM`

Puntos importantes a revisar:

- `frontend/src/components/Sidebar.tsx`
- `frontend/src/App.tsx`
- `backend/main.py`

## ADS — inspiración técnica

Repo:

`Alvarogarcia91/Ads`

Referencias útiles:

- `frontend/src/features/inventory/pages/InventoryPage.jsx`
- `frontend/src/features/inventory/components/StocksTab.jsx`
- `frontend/src/features/inventory/components/WarehousesLocationsTab.jsx`
- `frontend/src/features/inventory/components/MapTab.jsx`
- `frontend/src/features/inventory/components/KardexTab.jsx`
- `frontend/src/features/inventory/components/PhysicalStockFormModal.jsx`
- `frontend/src/features/warehouseOps/pages/VerificationDeskPage.jsx`
- `backend/apps/inventory/models.py`
- `backend/apps/inventory/services.py`
- `backend/apps/warehouse_ops/models.py`
- `backend/apps/warehouse_ops/services.py`

Usar como patrón conceptual, no como copy-paste.

---

# 45. RESULTADO FINAL ESPERADO

Cuando este módulo quede terminado, el cliente debe sentir que Inventarios no es “otra tablita”, sino el pegamento operacional entre:

**Compras / Materia Prima → Calidad → Almacén → Planeación → OP → Producción → Scrap/Remanentes → Producto Terminado → Calidad Final → Embarques → Trazabilidad.**

La demo debe comunicar especialmente tres mejoras sobre la situación actual de RTM:

1. **Confiabilidad:** saber qué hay realmente y qué está disponible.
2. **Control:** saber quién pidió, movió, consumió o perdió material.
3. **Trazabilidad:** poder reconstruir el camino del lote desde proveedor hasta cliente.

Ese es el criterio principal de diseño.

---

# 46. INSTRUCCIÓN DE ENTREGA PARA EL AGENTE QUE IMPLEMENTE

Antes de declarar terminado:

1. Ejecuta build del frontend.
2. Valida que no existan errores TypeScript.
3. Valida que las tabs existentes sigan funcionando.
4. Confirma que `Inventarios` aparezca en el sidebar en el lugar solicitado.
5. Prueba todos los recorridos de demo de la sección 40.
6. Revisa wording completo.
7. Verifica consistencia numérica entre pantallas.
8. No hagas push/merge a `main` sin instrucción explícita.
9. Deja el trabajo en la rama correspondiente y reporta:
   - archivos creados;
   - archivos modificados;
   - flujos implementados;
   - mocks/endpoints agregados;
   - pendientes conocidos.

**La prioridad es una demo coherente, visualmente premium y operativamente creíble para RTM.**
