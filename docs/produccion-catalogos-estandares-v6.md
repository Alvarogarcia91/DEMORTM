# RTM Demo — Producción v6 · Catálogos, capacidades, estándares y recetas

> Branch objetivo: `alvaro01`
>
> Este documento refina el módulo de Producción YA existente. No rehacer desde cero. No crear ramas nuevas.

## 0. Objetivo

Hacer visible en el demo una idea que Iván y Mariana explicaron varias veces y que hoy existe parcialmente en mocks/código, pero no se está contando bien en pantalla:

> Antes de poder planear una OP, el ERP debe conocer cómo funciona físicamente RTM: qué máquinas existen, qué puede hacer cada máquina, qué operaciones existen, cuánto tarda cada operación, cuánto tarda el setup/ajuste, qué rutas de fabricación tiene cada artículo y qué alternativas son compatibles.

La narrativa del demo debe ser:

```text
CATÁLOGO DE MÁQUINAS
        +
CATÁLOGO DE OPERACIONES / ESTÁNDARES
        +
RECETAS / RUTAS DE FABRICACIÓN
        ↓
ARTÍCULO / REVISIÓN
        ↓
PEDIDO
        ↓
OP HEREDA CONFIGURACIÓN
        ↓
PLANEACIÓN CON HORAS CALCULADAS
        ↓
PISO CAPTURA TIEMPO REAL
        ↓
REAL VS ESTÁNDAR
        ↓
4M / ANALÍTICA / MEJORA CONTINUA
```

No queremos que el planner vuelva a capturar manualmente máquina, ruta y tiempos cada vez.

---

# 1. Fundamento funcional explicado por RTM

En las sesiones de exploración se explicó que para poder planear correctamente se requiere conocer:

- qué procesos forman Offset y Flexografía;
- qué máquinas pueden ejecutar cada proceso;
- capacidades de cada máquina;
- velocidad productiva;
- tiempo de preparación/setup/ajuste;
- tiempos auxiliares cuando apliquen;
- restricciones por formato, tintas, ancho, paginación o acabado;
- mantenimiento/paros que reducen capacidad;
- insumos y herramentales requeridos;
- ruta estándar de cada artículo/revisión.

También se explicó que en Flexografía el setup cambia según lo que se monte en la corrida. No debe costar lo mismo preparar una corrida sencilla que una que incluya varias operaciones en línea como impresión + troquel + barniz + laminado + corona.

Iván comentó además que RTM ya tiene tablas históricas de tiempos y que algunos estándares cambian por condición de máquina, desgaste u operador. Por ello el sistema debe manejar ESTÁNDAR vs REAL, no asumir que el estándar es una verdad inmutable.

---

# 2. Hueco actual del demo

La implementación actual ya tiene conceptos valiosos:

- `ProductionMachine`;
- `RoutingStep.setupMinutes`;
- `RoutingStep.runMinutes`;
- `MasterManufacturingRecipe`;
- `compatibleMachines`;
- `standardSetupMinutes`;
- `standardScrapRatePercent`;
- recetas maestras heredadas por la nueva OP;
- planeación con horas;
- ejecución en Piso.

Pero la pestaña actual `Máquinas` es demasiado simple y no permite vender el concepto.

Hoy se ve básicamente:

```text
Máquina
Área
Estado
Carga
Setup estándar · compatible
```

Debe evolucionar a un workspace real de `Catálogos de Producción`.

---

# 3. Navegación propuesta

No agregar demasiadas tabs principales.

Renombrar o evolucionar la tab actual:

```text
Producción
├── Dashboard
├── Planeación
├── Órdenes
├── Piso
├── Catálogos          ← evolución de Máquinas
└── Analítica
```

Dentro de `Catálogos`:

```text
[ Máquinas ] [ Operaciones y estándares ] [ Recetas de fabricación ]
```

Si cambiar el nombre `Máquinas` rompe demasiada navegación, conservar la tab principal `Máquinas` y agregar dentro las tres subtabs. Lo importante es la narrativa, no el nombre exacto.

---

# 4. Catálogo de Máquinas

## 4.1 Lista

Tabla/card list con:

```text
MÁQUINA | ÁREA | CAPACIDAD PRINCIPAL | VELOCIDAD ESTÁNDAR | SETUP BASE | CARGA | ESTADO
```

Ejemplo visual:

```text
Heidelberg Speedmaster   Offset       hasta 32 pág/forma    3,500 pliegos/h   30 min   82%   Operativa
DiDDE 860                Offset       hasta 16 pág/forma    8,500 pliegos/h   20 min   58%   Operativa
Mark Andy 830 10"        Flexografía  3 tintas / 10"        9,000 ft/h         30 min   96%   Atención
Mark Andy Scout 10"      Flexografía  6+ tintas / 10"       6,000 ft/h         30 min   84%   Operativa
```

Los valores que provengan de documentos RTM deben usarse cuando estén claros. Cuando un dato no esté confirmado, etiquetarlo discretamente como:

`Demo configurable`

NO presentar un número inventado como estándar oficial RTM.

## 4.2 Detalle de máquina

Al abrir una máquina:

```text
MÁQUINA: MARK ANDY SCOUT 10"
Área: Flexografía
Estado: Operativa

[ General ] [ Capacidades ] [ Estándares ] [ Compatibilidad ]
```

### General

Mostrar:

- nombre;
- área;
- ancho/banda máxima;
- colores/tintas máximas cuando aplique;
- velocidad estándar;
- setup base;
- eficiencia si existe;
- capacidad semanal;
- carga actual;
- horas disponibles;
- estado operativo.

### Capacidades Flexo

Checklist visual:

```text
✓ Impresión
✓ Troquelado
✓ Barniz
✓ Laminado
✓ Tratamiento corona
✓ Precorte
○ Rebobinado inline / externo según equipo
```

La compatibilidad de una OP debe utilizar estas capacidades.

### Capacidades Offset

Ejemplo:

```text
Máximo por forma      16 o 32 páginas
Tintas máximas        X
Formato compatible    ...
Papeles / gramajes    configurable
Frente / vuelta       sí/no
```

La paginación debe leer `maxFormPages` de la máquina.

---

# 5. Datos demo recomendados para máquinas

Tomar los valores ya analizados de archivos RTM como base visual cuando estén disponibles.

## Offset

```text
Guillotina I                 10,000 pliegos/h    setup 10 min
DiDDE DGS 860 4 cartas        8,500 pliegos/h    setup 20 min
Conserver #1 2 cabezas       12,000 pliegos/h    setup 15 min
Conserver #3 4 cabezas       10,500 pliegos/h    setup 14 min
Ryobi 3302                    5,500 pliegos/h    setup 15 min
Speedmaster Heidelberg        3,500 pliegos/h    setup 30 min
Harris Press P2               8,500 pliegos/h    setup 60 min
Conserver 8 colores          10,000 pliegos/h    setup 30 min
Conserver 860 doble oficio    9,000 pliegos/h    setup 30 min
```

## Flexografía

```text
Mark Andy Scout 10"          ~6,000 ft/h         setup 30 min
Mark Andy 820 7"             ~9,000 ft/h         setup 15 min
Mark Andy 830 10"            ~9,000 ft/h         setup 30 min
Mark Andy 4120                ~7,000 ft/h
Aqua Flex                     ~6,000 ft/h
```

IMPORTANTE:

- estos datos son para demo y deben mantenerse fáciles de ajustar;
- no convertirlos en reglas duras de negocio;
- algunas capacidades/velocidades en archivos de trabajo pueden ser históricas o requerir confirmación;
- mostrar `Estándar configurable` cuando corresponda.

---

# 6. Catálogo de Operaciones y Estándares

Crear segunda subtab:

`Operaciones y estándares`

Lista:

```text
OPERACIÓN | ÁREA | UNIDAD | SETUP BASE | VELOCIDAD/RENDIMIENTO | QA | ESTADO
```

Ejemplos:

```text
Impresión Offset         Offset       pliegos/h      variable por máquina   variable por máquina   Sí
Guillotina               Acabados     pliegos/h      10 min                 10,000/h               No
Doblado                  Acabados     piezas/h       configurable            3,500/h                según producto
Intercalado              Acabados     piezas/h       configurable            configurable           según producto
Grapado / Alzado         Acabados     piezas/h       configurable            3,500/h                Sí
Pegado / Encuadernado    Acabados     piezas/h       configurable            configurable           Sí
Trimeado                 Acabados     piezas/h       configurable            configurable           No
Prensa Flexográfica      Flexografía  ft/h           variable                según prensa            Sí
Rebobinado               Flexografía  rollos/h       configurable            configurable           según producto
Empaque                   General      piezas/h       configurable            configurable           final
```

## 6.1 Detalle de operación

Ejemplo:

```text
OPERACIÓN: DOBLADO

Área                       Acabados
Unidad de producción       piezas/h
Setup estándar             15 min     Demo configurable
Velocidad estándar         3,500/h
Requiere operador          Sí
Quality Gate               Primera pieza / según receta

Máquinas compatibles
✓ Stahl 2
✓ Dobladora Digital

[ Guardar cambios demo ]
```

La pantalla debe comunicar que una operación define el estándar general y la máquina puede tener un override específico.

---

# 7. Modelo de tiempo estándar

El demo debe explicar claramente de dónde sale el tiempo de una OP.

## 7.1 Fórmula conceptual

```text
TIEMPO OPERACIÓN
=
SETUP / PREPARACIÓN
+
CORRIDA SEGÚN CANTIDAD Y VELOCIDAD
+
TIEMPOS AUXILIARES CONFIGURADOS
```

Ejemplo:

```text
Impresión Offset · DiDDE 860

Cantidad               17,000 pliegos
Velocidad estándar       8,500 pliegos/h
Setup                       20 min

Corrida                    120 min
Setup                       20 min
────────────────────────────────
Estándar operación         140 min
```

No es necesario crear un motor MRP/MES perfecto. Debe ser una simulación coherente y visible.

---

# 8. Setup compuesto en Flexografía

Este punto debe ser protagonista porque RTM explicó que el ajuste depende de lo que se monte.

Visual:

```text
SETUP ESTIMADO · MARK ANDY SCOUT

Preparación base                  20 min
Montaje impresión                  8 min
Montaje troquel                   12 min
Barniz                             8 min
Laminado                          12 min
Corona                             5 min
────────────────────────────────────────
Setup total estimado              65 min
```

Si el usuario desmarca operaciones:

```text
Impresión + Troquel
Setup: 40 min
```

vs

```text
Impresión + Troquel + Barniz + Laminado + Corona
Setup: 65 min
```

Los minutos exactos de cada incremento pueden ser `Demo configurable` si RTM no entregó desglose oficial.

El valor calculado debe alimentar:

- receta;
- OP;
- planeación;
- comparación estándar vs real.

---

# 9. Recetas / Rutas de Fabricación

Crear tercera subtab:

`Recetas de fabricación`

Ya existe `MASTER_RECIPES`; no duplicar concepto.

Debe convertirse en UI visible.

Lista:

```text
RECETA | CLIENTE | PARTE | REV | ÁREA | PASOS | TIEMPO EST. | SCRAP EST. | ESTADO
```

Ejemplos demo mínimos:

1. Manual grapado tipo libro Black & Decker — Offset.
2. Instructivo sencillo — Offset.
3. Etiqueta impresa + barniz + troquel — Flexo.
4. Etiqueta blanca / troquel + rebobinado — Flexo.

## 9.1 Detalle de receta

Ejemplo Offset:

```text
RECETA
Manual grapado tipo libro
BLACK & DECKER · NA472050 · Rev 08/23

Máquina principal: Heidelberg Speedmaster
Alternativas: Conserver 8 colores / otra compatible

RUTA

1. Preimpresión CTP
   Máquina: CTP Agfa
   Setup: 20 min
   Corrida: 30 min

2. Impresión Offset
   Máquina: Heidelberg Speedmaster
   Setup: 30–40 min
   Corrida: calculada según cantidad

3. Guillotina
   Máquina: Guillotina
   Setup: 10–15 min
   Corrida: calculada

4. Doblado
   Máquina: Stahl
   Setup: configurable
   Corrida: calculada

5. Intercalado
   ...

6. Grapado / Alzado
   Máquina: Muller Martini
   ...

7. Empaque
   ...
```

Resumen:

```text
Setup estándar total        2h 20m
Corrida estándar            4h 35m
Tiempo estándar total       6h 55m
Scrap estándar              2.2%
```

## 9.2 Receta Flexo

Mostrar una prensa con suboperaciones inline:

```text
Prensa Flexo · Mark Andy Scout

Inline:
✓ Impresión
✓ Barniz
✓ Troquelado
✓ Laminado
✓ Corona

Setup calculado según estaciones requeridas
Corrida según velocidad de prensa

Después:
Rebobinado
→ Empaque
```

No convertir las operaciones inline en estaciones físicas independientes si corren en la misma prensa.

---

# 10. Relación Artículo/Revisión ↔ Receta

Este es el punto clave de Iván.

Cuando un artículo/revisión está configurado:

```text
NA472050 · Rev 08/23
↓
Receta: Manual grapado tipo libro
↓
Área: Offset
↓
Máquina principal
↓
Alternativas
↓
Ruta
↓
Materiales
↓
Herramental
↓
Tiempos estándar
↓
Scrap estándar
```

La OP NO debe pedir al usuario que reconstruya toda esta información cada vez.

En `Nueva OP`, Paso 1:

```text
✓ RECETA ENCONTRADA

Manual grapado Black & Decker
Rev 08/23

Heredará automáticamente:
✓ Ruta
✓ Máquina principal
✓ Alternativas
✓ Materiales
✓ Herramental
✓ Setup estándar
✓ Scrap estándar
```

Debe existir opción demo:

`Ver receta heredada`

Y una acción secundaria:

`Editar solo para esta OP`

No alterar la receta maestra al editar una OP transaccional.

---

# 11. Planeación derivada de los catálogos

El planeador no debe usar horas mágicas.

Debe derivar carga de:

```text
SUMA DE
setup de cada operación
+
tiempo de corrida calculado
```

Ejemplo visual:

```text
HEIDELBERG

Capacidad semanal           40.0 h
Programado                  31.5 h
Nueva OP                     6.9 h
─────────────────────────────────
Carga proyectada            38.4 h
Disponible                   1.6 h

✓ CABE ESTA SEMANA
```

Otro caso:

```text
MARK ANDY 830

Capacidad                    40 h
Programado                   38 h
Nueva OP                      5 h
────────────────────────────────
Proyectado                   43 h

✕ NO CABE

Alternativa sugerida:
Mark Andy Scout
Disponible: 12 h

[Reprogramar en Scout]
```

La alternativa debe respetar las capacidades técnicas del catálogo de máquinas.

---

# 12. Ejecución real vs estándar

Después de ejecutar una operación en Piso, el detalle de OP debe mostrar:

```text
ESTÁNDAR VS REAL

                 ESTÁNDAR      REAL       VAR.
Setup              20 min       28 min     +8
Corrida            120 min      148 min    +28
Paros                0 min       18 min    +18
──────────────────────────────────────────────
Total              140 min      194 min    +54
```

Mostrar porcentaje:

`+38.6% sobre estándar`

Si la desviación supera un umbral demo, mostrar CTA:

`Analizar causa 4M`

Y reutilizar las categorías existentes:

- Máquina;
- Material;
- Mano de obra;
- Método.

No ajustar automáticamente el estándar maestro. Mostrar opcionalmente:

`Sugerir revisión de estándar`

como acción demo/no persistente.

---

# 13. Analítica de estándares

Agregar un bloque ligero a Analítica:

```text
CUMPLIMIENTO DE ESTÁNDARES

Operaciones dentro de estándar      82%
Setup promedio vs estándar          +7%
Corrida promedio vs estándar        +11%
Máquina con mayor desviación        Mark Andy 830
Proceso con mayor desviación        Grapado
```

Y una tabla pequeña:

```text
OPERACIÓN | ESTÁNDAR PROM. | REAL PROM. | VARIACIÓN | TENDENCIA
```

No hacer un módulo BI nuevo.

---

# 14. Datos y arquitectura

Aprovechar estructuras actuales y extenderlas razonablemente.

## 14.1 ProductionMachine

Agregar si hace falta:

```ts
speedValue?: number
speedUnit?: 'pliegos/h' | 'ft/h' | 'piezas/h' | 'rollos/h'
baseSetupMinutes?: number
efficiencyPercent?: number
weeklyCapacityHours?: number
sourceLabel?: 'RTM' | 'Demo configurable'
```

## 14.2 ProductionOperationStandard

Crear un catálogo mock nuevo si es necesario:

```ts
interface ProductionOperationStandard {
  id: string
  name: string
  area: ProductionArea
  unit: string
  baseSetupMinutes: number
  standardRate?: number
  rateUnit?: string
  compatibleMachineIds: string[]
  requiresQualityGate: boolean
  sourceLabel: 'RTM' | 'Demo configurable'
}
```

## 14.3 Recipe routing

Cada paso puede seguir usando `RoutingStep`, pero debe poder derivar o mostrar:

- operación catálogo;
- máquina;
- setup estándar;
- velocidad;
- corrida calculada;
- override de receta si aplica.

No sobrearquitecturar.

---

# 15. UX / demo

La historia que debemos enseñar en reunión es esta:

```text
1. Abrimos Catálogos > Máquinas
   "Aquí vive la capacidad física de RTM."

2. Abrimos Mark Andy Scout
   "El sistema sabe qué puede hacer esta prensa."

3. Abrimos Operaciones y estándares
   "Aquí definimos cuánto tarda cada proceso y su setup."

4. Abrimos Recetas
   "Aquí definimos cómo se fabrica cada artículo/revisión."

5. Abrimos receta Black & Decker
   "Esta receta encadena máquinas, operaciones y tiempos."

6. Nueva OP
   "Selecciono el pedido y el artículo hereda todo."

7. Planeación
   "Las horas salen de los estándares; no de números puestos a mano."

8. Piso
   "Capturamos cuánto tardó realmente."

9. Detalle / Analítica
   "Comparamos estándar vs real y sabemos dónde se perdió tiempo."
```

La frase conceptual del demo es:

> `El conocimiento de manufactura deja de vivir en la cabeza del planner y se convierte en configuración reusable del ERP.`

---

# 16. Criterios de aceptación

La mejora se considera lista cuando:

- la pestaña actual de Máquinas permite navegar claramente a catálogo de máquinas, operaciones y recetas;
- al abrir una máquina se ven capacidades técnicas y tiempos/velocidad estándar;
- existe una vista de catálogo de operaciones con setup y rendimiento;
- existen recetas visibles y editables en demo;
- la receta del artículo/revisión alimenta Nueva OP automáticamente;
- el tiempo estimado de la OP puede explicarse visualmente como setup + corrida por operación;
- el planner utiliza esos tiempos para mostrar carga;
- Flexo muestra setup compuesto según operaciones inline;
- Offset muestra la relación máquina ↔ capacidad de paginación;
- OP/Piso muestra estándar vs real;
- Analítica muestra al menos un resumen de cumplimiento de estándar;
- no se inventan como oficiales datos no confirmados: usar `Demo configurable`;
- frontend/demo solamente;
- no backend;
- no API;
- no migraciones;
- no crear ramas nuevas;
- todo queda en `alvaro01`.

---

# 17. Prioridad

## P0

- Catálogos visibles: Máquinas / Operaciones / Recetas.
- Detalle de máquina con capacidades, velocidad y setup.
- Catálogo de operaciones con estándar.
- Receta visible con routing + tiempos.
- Nueva OP hereda receta.
- Planeación usa tiempos de receta/operaciones.
- estándar vs real en OP/Piso.

## P1

- setup compuesto Flexo visual.
- analítica de cumplimiento de estándares.
- source label `RTM` vs `Demo configurable`.
- sugerencia de revisión de estándar.

## P2

- edición avanzada de catálogos.
- histórico de versiones de estándar.
- simulaciones más profundas de capacidad.

P2 no debe poner en riesgo la estabilidad del demo.