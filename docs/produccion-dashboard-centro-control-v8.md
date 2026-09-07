# RTM Demo — Producción v8 · Centro de Control de Manufactura

> Branch objetivo: `alvaro01`
>
> Este documento contiene TODO el alcance de implementación. El prompt externo debe ser corto: leer este MD, auditar lo actual e implementarlo. No crear ramas nuevas.

## 0. Objetivo

El Dashboard actual de Producción es limpio pero demasiado administrativo. No debe sentirse como una colección de cards con `OP activas`, `En proceso` y un porcentaje de carga genérico.

Debe convertirse en el **Centro de Control de Manufactura de RTM**.

La narrativa que se quiere demostrar es la que Iván describió en exploración: al iniciar el día debe poder abrir una sola pantalla y saber qué estaba planeado, qué realmente ocurrió, dónde está atorada la planta, qué máquina está afectando la producción, cuánto tiempo/desperdicio se perdió, qué pedidos están en riesgo y qué material debe estar listo para los siguientes arranques.

Concepto del demo:

```text
"EL CAFÉ DE LA MAÑANA DE IVÁN"

PLAN
 ↓
EJECUCIÓN DE PLANTA
 ↓
TRÁFICO / WIP
 ↓
EXCEPCIONES
 ↓
PLAN VS REAL
 ↓
CAPACIDAD
 ↓
MERMA + TIEMPO PERDIDO
 ↓
RIESGO DE ENTREGA
 ↓
ACCIÓN
```

El Dashboard NO sustituye Planeación, Piso, Procesos/Máquinas o Analítica.

```text
Dashboard   = ¿qué está pasando y dónde intervengo?
Planeación  = ¿cómo programo/reprogramo?
Piso        = ¿cómo ejecuto/capturo?
Procesos    = ¿cuáles son mis estándares y recetas?
Máquinas    = ¿qué puede hacer cada equipo?
Analítica   = ¿qué pasó históricamente y cuáles son las tendencias?
```

---

# 1. Estado actual que debe auditarse antes de tocar código

Revisar como mínimo:

```text
src/components/Produccion/DashboardProduccion.tsx
src/components/Produccion/ProduccionPage.tsx
src/components/Produccion/PlaneacionProduccion.tsx
src/components/Produccion/PisoProduccion.tsx
src/components/Produccion/ProcesosProduccion.tsx (si existe)
src/components/Produccion/MaquinasCapacidad.tsx
src/components/Produccion/AnaliticaProduccion.tsx
src/data/mockProduccionData.ts
```

Conservar toda la lógica útil ya implementada en V4/V5/V6/V7:

- recetas maestras;
- routing;
- `setupMinutes`;
- `standardMinutes`;
- tiempos reales si ya existen;
- `stopMinutes`;
- materiales;
- remanentes;
- desviaciones;
- riesgo de entrega;
- máquinas y capacidades;
- estados de OP;
- programa de surtido 24 h;
- trazabilidad;
- incidencias 4M;
- scrap;
- calidad gates.

NO crear un segundo universo de mocks si los datos pueden derivarse de lo existente.

---

# 2. Principio rector: ningún número importante debe ser mágico

El Dashboard actual llegó a mostrar valores como `92.4%` hardcodeados. Eso se debe eliminar.

Los números visibles deben cuadrar matemáticamente entre sí.

Ejemplos:

```text
plan total = suma del plan de Offset + Flexo + Acabados
real total = suma de producción buena considerada para el periodo
cumplimiento = real total / plan total * 100

tiempo perdido total = suma de minutos perdidos 4M
merma = scrap / (good + scrap) * 100

horas de una OP = setup + corrida estándar
horas planeadas máquina = suma de horas de OP activas asignadas
horas disponibles = capacidad semanal - horas planeadas
utilización = horas planeadas / capacidad semanal
```

Si para demo hace falta un dato base que todavía no existe (ej. plan objetivo diario), crear un snapshot mock centralizado y claramente coherente, no números regados dentro del JSX.

Cualquier valor que RTM no confirmó debe poder aparecer como:

`Demo configurable`

---

# 3. Header del Centro de Control

Mantener título de Producción, pero elevar el contexto.

```text
PRODUCCIÓN · CENTRO DE CONTROL
Plan, tráfico de planta, capacidad y excepciones operativas.

[ Hoy ▼ ] [ Todas las áreas ▼ ] [ Todos los turnos ▼ ]

● Planta operando · Actualizado 05:27
                                              [+ Nueva OP]
```

Filtros globales:

- periodo: Hoy / Ayer / Semana actual / Últimos 7 días / Mes actual;
- área: Todas / Offset / Flexografía / Acabados;
- turno: Todos / A / B / C.

No se requiere histórico real. Los filtros pueden cambiar snapshots demo consistentes.

---

# 4. Primera fila — KPIs ejecutivos

La primera fila debe contestar preguntas reales de Manufactura.

## KPI 1 — Cumplimiento del plan

```text
CUMPLIMIENTO DEL PLAN
89.9%
184,250 real / 205,000 plan
↓ 2.5 pts vs referencia demo
```

Debe derivarse de plan vs real.

## KPI 2 — Producción buena

```text
PRODUCCIÓN BUENA
184,250
piezas / etiquetas buenas
Plan 205,000
```

## KPI 3 — Tiempo perdido

```text
TIEMPO PERDIDO
3h 29m
5 incidencias
Principal: Máquina · 93 min
```

Derivar de incidencias / `stopMinutes`.

## KPI 4 — Merma

```text
MERMA
3.1%
6,140 unidades
Objetivo ≤ 5.0%
```

Objetivo 5% como estándar/demo configurable.

## KPI 5 — Entregas en riesgo

```text
ENTREGAS EN RIESGO
4 OP
2 críticas
[Ver]
```

Derivar de `deliveryRisk`, fechas y estados.

## KPI 6 — Máquinas críticas

Si el ancho lo permite:

```text
MÁQUINAS CRÍTICAS
2
1 detenida · 1 saturada
```

Una máquina crítica puede ser:

- detenida;
- carga > 90%;
- cola que excede capacidad;
- afecta OP de riesgo alto.

---

# 5. Resumen del turno — “Café de Iván”

Debajo de KPIs agregar un bloque compacto y extremadamente accionable.

```text
RESUMEN DEL TURNO

✓ 8 operaciones dentro del estándar
⚠ 3 operaciones con desviación
🔴 1 máquina detenida
⚠ 2 OP comprometen fecha cliente
✓ Material listo para 7 de 9 próximos arranques
```

Cada línea debe navegar o abrir detalle relevante.

No convertirlo en otra colección de cards grandes.

---

# 6. Tráfico de Planta — protagonista visual

Este es el bloque principal del Dashboard.

Debe mostrar WIP / cola por etapa sin pretender ser el planner completo.

## 6.1 Offset

```text
OFFSET

IMPRESIÓN
4 OP · 1 detenida
     →
GUILLOTINA
3 OP
     →
DOBLADO
5 OP · ⚠ cola
     →
INTERCALADO
2 OP
     →
GRAPADO
3 OP
     →
EMPAQUE
2 OP
```

No todas las OP necesitan pasar por todos los pasos. Es un resumen agregado de las operaciones que actualmente existen en sus routings.

Cada nodo debe indicar:

- cantidad de OP;
- trabajo actual;
- cola;
- estado;
- atraso/desviación si aplica.

## 6.2 Flexografía

NO dibujar barniz, corona, laminado o troquel como máquinas independientes cuando suceden inline.

```text
FLEXOGRAFÍA

PRENSA FLEXO
5 OP · 1 atraso
inline: impresión · barniz · troquel · etc.
        →
REBOBINADO / INSPECCIÓN
3 OP
        →
EMPAQUE
2 OP
```

## 6.3 Drill-down de tráfico

Nodo clicable.

Ejemplo `DOBLADO`:

```text
DOBLADO

Máquina activa       Stahl 2
OP actual            OP-95318 · BLACK & DECKER
Inicio               09:14
Fin estimado         11:32
Avance               68%
Estándar              85 min
Real / estimado      102 min
Desviación           +17 min

COLA
1. OP-95324
2. OP-95331
3. OP-95337

Capacidad restante hoy  1h 42m

[Ver en Planeación]
```

Puede ser drawer o modal compacto usando componentes existentes.

---

# 7. Plan vs Real

Debe explicar el KPI de cumplimiento.

```text
PLAN VS REAL · HOY

Área          Plan       Real       Cumplimiento
Offset        98,000     91,400       93.3%
Flexografía   72,000     59,800       83.1% ⚠
Acabados      35,000     33,050       94.4%
------------------------------------------------
TOTAL        205,000    184,250       89.9%
```

Si el repo ya tiene librería de gráficas, agregar producción acumulada por hora:

```text
Plan acumulado vs Real acumulado
07:00 → 17:00
```

NO agregar dependencia nueva solo por una gráfica.

---

# 8. Capacidad semanal por máquina

La pantalla actual muestra porcentaje promedio por área; eso no basta.

Mostrar las máquinas que requieren atención o son estratégicas:

```text
CAPACIDAD SEMANAL

Máquina                 Planeado   Disponible   Utilización
Mark Andy 830 10"        38.5 h      1.5 h        96% 🔴
Heidelberg                32.8 h      7.2 h        82%
DiDDE 860                 27.4 h     12.6 h        69%
Stahl 2                   35.2 h      4.8 h        88% ⚠
Muller Martini            24.1 h     15.9 h        60%
```

Cálculo:

```text
planned = Σ(setupMinutes + standardMinutes) / 60
available = weeklyCapacityHours - planned
utilization = planned / weeklyCapacityHours
```

Mientras no haya calendario laboral formal:

`Capacidad base: 40 h/semana · Demo configurable`

CTA:

`Ver Planeación completa`

---

# 9. Riesgo de Entrega

Debe contestar “¿qué pedido no va a llegar y por qué?”.

```text
RIESGO DE ENTREGA

OP        Cliente          RTM      Cliente    Estimada   Riesgo
95321     TYCO             08 Sep   09 Sep     10 Sep     ALTO
95344     BLACK & DECKER   09 Sep   10 Sep     09 Sep     BAJO
95351     FRESENIUS        10 Sep   11 Sep     11 Sep     MEDIO
95362     PANASONIC        11 Sep   12 Sep     13 Sep     ALTO
```

Cada registro debe tener una causa:

```text
Mark Andy 830 saturada + 2.3 h de atraso acumulado
```

O:

- material por surtir;
- herramental pendiente;
- máquina detenida;
- cola mayor a capacidad;
- desviación real acumulada.

CTA por fila:

`[Abrir OP] [Reprogramar]`

No repetir todo Planeación dentro del Dashboard.

---

# 10. Action Center — Requiere tu atención

Sustituir la lista plana actual.

Debe ordenar excepciones por impacto.

```text
REQUIERE TU ATENCIÓN

🔴 OP-95321 · TYCO
Fecha cliente en riesgo · +1 día estimado
[Reprogramar] [Abrir OP]

🔴 Mark Andy 830 10"
Detenida 47 min · Problema mecánico
Afecta 3 OP
[Ver impacto]

🟠 OP-95333 · FRESENIUS
Solicitud de +1,000 ft de sustrato
Merma acumulada 4.6%
[Revisar]

🟠 OP-95342 · BLACK & DECKER
Material por surtir · arranque mañana 07:30
[Ver surtido]
```

Orden de prioridad:

1. riesgo alto de entrega;
2. máquina detenida con impacto;
3. material/herramental bloqueando arranque;
4. merma cerca/sobre límite;
5. operación significativamente fuera del estándar.

---

# 11. Tiempo perdido / 4M

Mostrar el concepto que Iván utiliza para juntas de manufactura.

```text
PÉRDIDAS · 4M · HOY

Máquina        93 min  █████████████
Material       58 min  ████████
Método         37 min  █████
Mano de obra   21 min  ███

TOTAL          3h 29m

Principal incidencia
Ajuste de registro Mark Andy · 47 min
```

El total de las categorías debe ser igual al tiempo perdido del KPI.

CTA: `Ver incidencias`.

---

# 12. Merma / Desperdicio

Bloque hermano del 4M.

```text
MERMA / DESPERDICIO

Real hoy       3.1%
Objetivo       ≤ 5.0%

Offset         2.4%
Flexografía    4.2% ⚠
Acabados       1.1%

Mayor contribución
OP-95333 · 1,240 etiquetas
```

Calcular con datos visibles.

Si alguna OP supera 5%, elevarla automáticamente al Action Center.

---

# 13. Estándar vs Real

Esta sección debe conectar Dashboard con los catálogos de Procesos/Máquinas de V6.

```text
DESEMPEÑO CONTRA ESTÁNDAR

Máquina / Proceso      Estándar     Real       Eficiencia
Mark Andy Scout        9,000 ft/h   7,840 ft/h    87% ↓
DiDDE 860              8,500 /h     8,190 /h      96% →
Stahl 2                3,500 /h     3,020 /h      86% ↓
Muller Martini         3,500 /h     3,620 /h     103% ↑
```

O, cuando el estándar se modele mejor por tiempo:

```text
Operación          Std          Real       Desviación
Setup prensa       30 min       44 min       +14 min
Corrida            180 min      211 min      +31 min
```

No inventar datos como oficiales. Etiquetar valores no confirmados como `Demo configurable`.

Reglas útiles:

```text
eficiencia = realOutput / standardOutput

desviación tiempo = actualMinutes - standardMinutes
```

Si desviación es fuerte, ofrecer:

`Analizar causa 4M`

---

# 14. Trabajos Completados

Iván también usa trabajos completados como lectura de desempeño.

Mantener compacto:

```text
TRABAJOS COMPLETADOS

HOY
12 OP
184,250 buenas

SEMANA
52 OP terminadas
91% a tiempo
6 atrasadas
3 adelantadas
```

No usar esta sección como protagonista.

---

# 15. Arranques Próximas 24 h

No duplicar el programa completo de surtido que vive en Planeación.

Solo resumen ejecutivo:

```text
ARRANQUES PRÓXIMAS 24 H
9 programados
7 material listo
2 pendientes de surtir
1 herramental pendiente

[Ver programa de surtido]
```

Si algún arranque próximo no está listo, debe alimentar Action Center.

---

# 16. Layout objetivo

Evitar cards gigantes con mucho aire vacío.

Desktop aproximado:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PRODUCCIÓN · CENTRO DE CONTROL                                              │
│ [Hoy] [Todas] [Turnos]                                         [+ Nueva OP]│
├──────────────────────────────────────────────────────────────────────────────┤
│ PLAN │ PROD. BUENA │ TIEMPO PERDIDO │ MERMA │ RIESGO │ MÁQ. CRÍTICAS       │
├──────────────────────────────────────────────────────────────────────────────┤
│ RESUMEN DEL TURNO / CAFÉ DE IVÁN                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                         TRÁFICO DE PLANTA                                   │
│ OFFSET: Impresión → Corte → Doblado → Intercalado → Grapado → Empaque      │
│ FLEXO:  Prensa → Rebobinado/Inspección → Empaque                            │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ PLAN VS REAL                         │ REQUIERE TU ATENCIÓN                 │
├───────────────────────────────────────┼──────────────────────────────────────┤
│ CAPACIDAD SEMANAL                    │ RIESGO DE ENTREGA                    │
├───────────────────────────────────────┼──────────────────────────────────────┤
│ PÉRDIDAS 4M                          │ MERMA                               │
├───────────────────────────────────────┴──────────────────────────────────────┤
│ DESEMPEÑO CONTRA ESTÁNDAR                                                   │
├───────────────────────────────────────┬──────────────────────────────────────┤
│ TRABAJOS COMPLETADOS                 │ ARRANQUES PRÓXIMAS 24 H             │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

Responsive:

- no romper en laptop;
- en móvil/tablet apilar bloques;
- permitir scroll horizontal solo en tablas donde sea razonable;
- mantener KPIs legibles.

---

# 17. Interacciones demo obligatorias

No queremos una captura estática.

Como mínimo:

### A. Click en Tráfico de Planta

Nodo → detalle → CTA a Planeación.

### B. Click en OP de riesgo

Abre detalle OP o flujo existente.

### C. Reprogramar desde Action Center

Reutilizar modal/acción de Planeación si arquitectónicamente es sencillo; de lo contrario navegar a Planeación con contexto.

### D. Ver surtido

Lleva a Planeación / bloque 24 h.

### E. Ver incidencias

Lleva a Analítica/Piso/incidencias según patrón existente.

### F. Filtros

Periodo/área/turno deben cambiar las métricas o al menos el snapshot demo de forma coherente.

---

# 18. Estados y semáforos

Usar colores solo con significado:

```text
Verde  = dentro de estándar / listo / sano
Ámbar  = atención / riesgo moderado / cercano a límite
Rojo   = bloqueo / atraso / saturación / riesgo alto
Azul   = información / plan / selección
```

No usar gradients decorativos.
No llenar todo de colores.
No usar gauges innecesarios.
No usar tarjetas con números sin explicación.

---

# 19. Wording

Preferir lenguaje de planta:

```text
Cumplimiento del plan
Producción buena
Tiempo perdido
Merma
Tráfico de planta
Capacidad semanal
Horas planeadas
Horas disponibles
Riesgo de entrega
Por surtir
Material listo
Detenida
Fuera de estándar
Desviación
```

Evitar wording genérico/tech:

```text
AI insights
Smart manufacturing
Predictive engine
Operational intelligence powered by...
```

Es demo RTM, no landing SaaS.

---

# 20. Arquitectura recomendada

No es obligatorio exactamente este split, pero evitar volver a hacer un componente monolítico enorme.

```text
src/components/Produccion/dashboard/
├── ProductionExecutiveKpis.tsx
├── ProductionShiftSummary.tsx
├── PlantTraffic.tsx
├── PlanVsActual.tsx
├── WeeklyCapacity.tsx
├── DeliveryRisk.tsx
├── ProductionActionCenter.tsx
├── Losses4M.tsx
├── ScrapSummary.tsx
├── StandardVsActual.tsx
├── CompletedJobsSummary.tsx
└── NextStartsSummary.tsx
```

Puede conservarse `DashboardProduccion.tsx` como orquestador.

No crear componentes si solo van a envolver 4 líneas; mantener balance razonable.

---

# 21. Datos demo / selectores

Preferir funciones selectoras derivadas de `ProductionOrder[]` y catálogos actuales.

Ejemplos conceptuales:

```text
getActiveOrders()
getLostMinutesBy4M()
getScrapRate()
getWeeklyMachineCapacity()
getDeliveryRiskOrders()
getPlantTrafficByOperation()
getStandardVsActual()
getNext24hReadiness()
```

No tienen que llamarse así.

Evitar lógica matemática larga incrustada directamente en JSX.

Si hace falta crear snapshots históricos de Hoy/Ayer/Semana, ponerlos en `mockProduccionData.ts` o archivo de datos dedicado, no adentro del componente.

---

# 22. Coherencia con los catálogos V6

El Dashboard debe demostrar que los catálogos tienen una razón de existir.

Narrativa:

```text
CATÁLOGO MÁQUINA
velocidad + capacidad + setup
          ↓
CATÁLOGO OPERACIÓN
estándar de proceso
          ↓
RECETA DEL ARTÍCULO
ruta + máquina + setup + corrida
          ↓
OP
cantidad
          ↓
PLANEACIÓN
horas comprometidas
          ↓
PISO
tiempo/output real
          ↓
DASHBOARD
real vs estándar + capacidad + excepciones
```

No mostrar datos de estándares desconectados del Dashboard.

---

# 23. Qué NO hacer

NO:

- rehacer Producción completa;
- meter backend;
- crear APIs;
- crear migraciones;
- crear rama nueva;
- duplicar Planeación;
- duplicar Analítica;
- duplicar el programa de surtido completo;
- poner 20 gráficas;
- usar porcentajes random;
- dejar `92.4%` hardcodeado;
- convertir Dashboard en una tabla gigante;
- inventar capacidades RTM como si fueran confirmadas;
- alterar módulos ajenos sin necesidad.

---

# 24. Orden de implementación

## P0 — obligatorio

1. KPIs calculados y consistentes.
2. Resumen del turno.
3. Tráfico de Planta Offset/Flexo con drill-down.
4. Plan vs Real.
5. Capacidad semanal en horas por máquina.
6. Riesgo de entrega.
7. Action Center.
8. Pérdidas 4M.
9. Merma.
10. Navegación/acciones desde los bloques.

## P1 — muy deseable

11. Estándar vs Real.
12. Trabajos completados.
13. Arranques próximas 24 h.
14. Filtros globales con snapshots coherentes.
15. Tendencias vs referencia demo.

## P2 — solo si queda limpio

16. Mini gráfica acumulada Plan vs Real.
17. Animaciones discretas de actualización/estado.
18. Exportar resumen demo si ya existe patrón reutilizable.

---

# 25. Criterios de aceptación

Antes de terminar verificar:

```text
[ ] No existe cumplimiento hardcodeado
[ ] Plan y real cuadran
[ ] Merma se calcula
[ ] 4M suma exactamente tiempo perdido
[ ] Capacidad usa horas de las OP
[ ] Existen múltiples máquinas en capacidad
[ ] Tráfico Offset respeta routing real
[ ] Flexo no separa operaciones inline incorrectamente
[ ] Riesgo de entrega tiene causa
[ ] Action Center tiene acciones
[ ] Arranques 24h muestran readiness
[ ] Estándar vs Real usa datos coherentes
[ ] No se duplicó Planeación/Analítica
[ ] Desktop se ve denso pero limpio
[ ] Responsive no se rompe
[ ] Build/typecheck pasa
```

---

# 26. Guion esperado de demo — 60 a 90 segundos

La UI debe permitir contar esta historia sin navegar cinco módulos.

```text
1. Abrimos Producción.

"Esta es la pantalla que sustituye el Excel que Iván revisa cada mañana."

2. Señalamos Cumplimiento / Producción / Tiempo perdido / Merma.

"Hoy el plan lleva X%, pero Flexo está abajo del objetivo."

3. Tráfico de Planta.

"Aquí veo dónde está el WIP: tenemos una cola en Doblado y una prensa Flexo con atraso."

4. Click en nodo.

"La Stahl trae tres órdenes en cola y la actual ya está +17 minutos fuera de estándar."

5. Action Center.

"Y eso ya se traduce en impacto: esta OP de TYCO está comprometiendo fecha."

6. Capacidad.

"La Mark Andy está al 96%; el sistema ya sabe sus horas porque la receta de cada artículo trae setup y corrida."

7. 4M / Merma.

"Hoy perdimos 3h29; la principal causa fue máquina y Flexo trae 4.2% de merma contra el límite de 5%."

8. Estándar vs Real.

"Además ya no dependemos de una tabla vieja: vemos cuándo las máquinas dejan de cumplir el estándar que tenemos configurado."

9. Próximas 24 h.

"Y antes de mañana ya sabemos que 2 arranques todavía no tienen material listo."
```

La sensación final debe ser:

> **RTM ya no administra Producción por reacción. Tiene una vista viva de plan, ejecución, capacidad, pérdidas y riesgo.**

---

# 27. Instrucción final para el agente

Implementar este documento sobre el código ACTUAL de `alvaro01`.

Primero auditar qué partes ya existen y reutilizarlas.

No rehacer el módulo.

No crear ramas.

No agregar backend.

No usar datos mágicos cuando pueden derivarse.

Al terminar:

1. correr build/typecheck disponibles;
2. corregir errores;
3. entregar resumen corto;
4. listar archivos modificados;
5. marcar P0/P1 completados;
6. explicar el flujo exacto de 60–90 segundos para enseñar el Dashboard.
