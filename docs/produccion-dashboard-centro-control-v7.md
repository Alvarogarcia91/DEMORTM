# RTM Demo — Producción v7 · Dashboard Centro de Control de Manufactura

> Branch objetivo: `alvaro01`
>
> Este documento NO pide rehacer el módulo de Producción. Pide elevar únicamente el Dashboard para que represente la visión que Iván explicó como su “café de todas las mañanas” y el concepto de “tráfico de planta”.

## 0. Objetivo

El Dashboard de Producción actual es demasiado administrativo y genérico. Hoy responde principalmente:

- cuántas OP están activas;
- cuántas están en proceso/detenidas;
- carga promedio por área;
- material en riesgo;
- lista de OP activas.

Eso no cuenta la historia que Iván pidió.

El nuevo dashboard debe ser un **Centro de Control de Manufactura** que responda en menos de 30 segundos:

```text
¿Qué debía producir hoy?
¿Qué sí produjo la planta?
¿Dónde está atorada?
¿Qué máquina está saturada o detenida?
¿Cuánto tiempo perdimos?
¿Cuánta merma llevamos?
¿Qué OP no va a llegar a tiempo?
¿Qué material falta para arrancar mañana?
¿Qué operación está fuera de su estándar?
¿Qué requiere acción ahorita?
```

La narrativa no es “dashboard de KPIs”.

La narrativa es:

> **Iván llega por la mañana, abre Producción y sustituye su Excel/café diario por una sola pantalla que le dice qué está pasando en planta y dónde debe intervenir.**

---

# 1. Base de negocio confirmada con Iván

Durante la exploración de Manufactura se discutieron explícitamente estos conceptos:

- dashboard de tráfico de planta;
- planeado contra resultado real;
- desperdicio / merma;
- tiempos perdidos;
- trabajos completados;
- capacidad semanal por máquina;
- horas disponibles contra horas comprometidas;
- saber si un trabajo cabe o no en la semana;
- detectar pedidos que no cumplirán fecha;
- ver por qué una máquina/orden está atrasada;
- material faltante o entregado tarde;
- comparar los tiempos estándar históricos contra ejecución real;
- usar incidencias 4M para entender las causas.

El Dashboard debe concentrar estos conceptos sin duplicar Planeación, Piso o Analítica.

Dashboard = **resumen accionable + navegación hacia el detalle**.

---

# 2. Problemas de la implementación actual

Archivo actual principal:

```text
src/components/Produccion/DashboardProduccion.tsx
```

Problemas:

1. `Cumplimiento = 92.4%` está hardcodeado.
2. Carga de planta usa un promedio simple de `machine.load` por área.
3. Las tarjetas superiores tienen poco contexto y poca capacidad de acción.
4. `Atención requerida` mezcla material y detenidas pero no explica impacto.
5. No existe tráfico visual de procesos Offset/Flexo.
6. No existe plan vs real visible.
7. No existe capacidad semanal por máquina con horas.
8. No existe resumen de merma real vs objetivo.
9. No existe Pareto/tiempo perdido 4M en Dashboard.
10. No existe riesgo de entrega por OP en la pantalla principal.
11. No existe estándar vs real por máquinas/procesos críticos.
12. No existe resumen del turno / “qué necesita saber Iván ahorita”.

No borrar componentes buenos existentes; aprovechar mocks enriquecidos de V4/V5/V6.

---

# 3. Filtros globales del Dashboard

Agregar controles superiores que afecten todos los bloques:

```text
Periodo: [Hoy ▼]
Área:    [Todas ▼]
Turno:   [Todos ▼]
```

Opciones demo de periodo:

- Hoy
- Ayer
- Semana actual
- Últimos 7 días
- Mes actual

No es necesario implementar históricos reales. Puede cambiar entre snapshots mock coherentes.

Header sugerido:

```text
PRODUCCIÓN · CENTRO DE CONTROL
Visión ejecutiva del plan, tráfico de planta y excepciones operativas.

[Hoy ▼] [Todas las áreas ▼] [Todos los turnos ▼]

● Planta operando · Última actualización 05:27
```

Mantener `+ Nueva OP`.

---

# 4. Primera fila — KPIs ejecutivos útiles

Reemplazar las tarjetas actuales por KPIs derivados de los datos del módulo.

## 4.1 Cumplimiento del plan

No hardcodear.

Ejemplo de cálculo demo:

```text
cumplimiento = producción buena real / producción buena planeada * 100
```

Mostrar:

```text
CUMPLIMIENTO DEL PLAN
89.9%
Real 184,250 / Plan 205,000
↓ 2.5 pts vs ayer
```

## 4.2 Producción buena

```text
PRODUCCIÓN HOY
184,250
piezas buenas
Plan 205,000
```

## 4.3 Tiempo perdido

Sumar `stopMinutes` + incidencias demo.

```text
TIEMPO PERDIDO
3h 29m
5 incidencias
Principal: Máquina · 93 min
```

## 4.4 Merma / desperdicio

Calcular:

```text
scrap total / (good + scrap) * 100
```

Mostrar objetivo visible:

```text
MERMA
3.1%
Objetivo ≤ 5.0%
6,140 unidades
```

El 5% es relevante para el demo de RTM; manejarlo como estándar/demo configurable si no existe como setting formal.

## 4.5 Riesgo de entrega

```text
ENTREGA EN RIESGO
4 OP
2 críticas
[Ver órdenes]
```

Derivar de `deliveryRisk`, fechas y estados.

## 4.6 Máquinas críticas

Opcional como sexto KPI si el layout lo permite:

```text
MÁQUINAS CRÍTICAS
2
1 detenida · 1 >90% carga
```

---

# 5. Resumen del turno — “el café de Iván”

Agregar un bloque compacto y muy visible bajo KPIs:

```text
RESUMEN DEL TURNO

✓ 8 operaciones dentro del estándar
⚠ 3 operaciones con desviación
🔴 1 máquina detenida
⚠ 2 OP comprometen fecha cliente
✓ Material listo para 7 de 9 arranques próximos
```

Cada fila debe ser clicable o tener acción secundaria.

Este bloque debe sintetizar el Dashboard completo.

---

# 6. Tráfico de Planta — protagonista del Dashboard

Agregar bloque ancho, visual y clicable.

## 6.1 Offset

Representar flujo por procesos reales:

```text
OFFSET

IMPRESIÓN
4 OP
1 detenida
   ↓
GUILLOTINA
3 OP
   ↓
DOBLADO
5 OP
⚠ cola
   ↓
INTERCALADO
2 OP
   ↓
GRAPADO
3 OP
   ↓
EMPAQUE
2 OP
```

No todas las OP deben recorrer todos los nodos; es un resumen de WIP por etapa.

Cada nodo debe mostrar como mínimo:

- OP actualmente en esa etapa;
- cantidad en cola;
- semáforo;
- minutos de atraso si aplica.

## 6.2 Flexografía

No dividir operaciones inline como máquinas independientes.

```text
FLEXOGRAFÍA

PRENSA FLEXO
5 OP
1 con atraso
   ↓
REBOBINADO / INSPECCIÓN
3 OP
   ↓
EMPAQUE
2 OP
```

Dentro de la prensa se puede mostrar pequeño texto:

```text
inline: impresión · barniz · troquel · etc.
```

## 6.3 Drill-down

Al hacer clic sobre una etapa abrir drawer/modal ligero:

```text
DOBLADO

Máquina activa: Stahl 2
OP actual: OP-95318 · BLACK & DECKER
Inicio: 09:14
Fin estimado: 11:32
Avance: 68%
Desviación: +17 min

Cola:
OP-95324
OP-95331
OP-95337

Capacidad restante hoy: 1h 42m

[Ver en Planeación]
```

---

# 7. Plan vs Real — KPI explicado, no número mágico

Agregar gráfica o bloque visual con datos calculados.

Tabla/summary:

```text
PLAN VS REAL · HOY

Área          Plan       Real       Cumplimiento
Offset        98,000     91,400       93.3%
Flexografía   72,000     59,800       83.1% ⚠
Acabados      35,000     33,050       94.4%
------------------------------------------------
TOTAL        205,000    184,250       89.9%
```

Agregar gráfica de producción acumulada por hora si es fácil con librería ya instalada.

No agregar nueva dependencia solo para esto si el repo ya tiene charting.

La gráfica debe comparar:

- línea/serie Plan acumulado;
- línea/serie Real acumulado.

---

# 8. Capacidad semanal — por máquina, con horas

Reemplazar el bloque actual de promedio por área como protagonista.

Mostrar top 5–7 máquinas críticas/relevantes:

```text
CAPACIDAD SEMANAL

Máquina                 Planeado     Disponible    Utilización
Mark Andy 830 10"        38.5 h        1.5 h        96% 🔴
Heidelberg                32.8 h        7.2 h        82%
DiDDE 860                 27.4 h       12.6 h        69%
Stahl 2                   35.2 h        4.8 h        88% ⚠
Muller Martini            24.1 h       15.9 h        60%
```

Derivar horas usando OP asignadas:

```text
horas OP = setupMinutes + standardMinutes
```

Capacidad semanal puede usar el estándar actual demo de 40h mientras no exista un calendario formal.

Mostrar `Demo configurable` al lado del supuesto 40 h.

CTA:

`Ver Planeación completa`.

---

# 9. Riesgo de entrega — fechas comparadas

Agregar tabla corta:

```text
RIESGO DE ENTREGA

OP        Cliente          Fecha RTM   Cliente   Estimada   Riesgo
95321     TYCO             08 Sep      09 Sep    10 Sep     ALTO
95344     BLACK & DECKER   09 Sep      10 Sep    09 Sep     BAJO
95351     FRESENIUS        10 Sep      11 Sep    11 Sep     MEDIO
95362     PANASONIC        11 Sep      12 Sep    13 Sep     ALTO
```

Para cada OP mostrar una causa breve:

- máquina saturada;
- material no surtido;
- atraso acumulado;
- herramental pendiente;
- incidencia activa.

CTA:

`Ver / Reprogramar`.

---

# 10. Requiere tu atención — Action Center

Reemplazar lista plana actual.

Debe priorizar excepciones y dar acción directa.

Ejemplo:

```text
🔴 OP-95321 · TYCO
Fecha cliente en riesgo · +1 día estimado
[Reprogramar] [Abrir OP]

🔴 Mark Andy 830 10"
Detenida 47 min · Problema mecánico
Afecta 3 OP
[Ver impacto]

🟠 OP-95333 · FRESENIUS
Solicitud material adicional +1,000 ft
Merma acumulada 4.6%
[Revisar]

🟠 OP-95342 · BLACK & DECKER
Material por surtir · arranque 07:30 mañana
[Ver surtido]
```

Prioridad visual:

1. Entrega en riesgo alto.
2. Máquina detenida.
3. Material/herramental bloqueando arranque.
4. Merma cercana/superior a límite.
5. Operación fuera de estándar.

---

# 11. 4M / tiempo perdido

Agregar bloque compacto con Pareto.

```text
PÉRDIDAS · 4M · HOY

Máquina        93 min
Material       58 min
Método         37 min
Mano de obra   21 min

Total          3h 29m
```

Puede ser bar chart horizontal o barras simples con CSS.

Mostrar principal causa:

```text
Principal incidencia
Ajuste de registro Mark Andy · 47 min
```

CTA: `Ver incidencias`.

---

# 12. Merma / desperdicio

Agregar bloque hermano de 4M:

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

Si una OP cruza 5% marcarla como excepción prioritaria.

---

# 13. Estándar vs Real

Aprovechar el trabajo de V6 de catálogos y estándares.

Mostrar top máquinas/procesos con desviación:

```text
DESEMPEÑO CONTRA ESTÁNDAR

Máquina             Estándar      Real        Eficiencia   Tendencia
Mark Andy Scout     9,000 ft/h    7,840 ft/h      87%         ↓
DiDDE 860           8,500 /h      8,190 /h        96%         →
Stahl 2             3,500 /h      3,020 /h        86%         ↓
Muller Martini      3,500 /h      3,620 /h       103%         ↑
```

Si no existe dato real confirmado para una máquina, usar valores mock coherentes y etiquetar `Demo configurable`.

El cálculo puede utilizar:

```text
eficiencia = output real / output estándar * 100
```

O si el modelo está en tiempo:

```text
desviación = tiempo real - tiempo estándar
```

No presentar números inventados como históricos oficiales RTM.

---

# 14. Trabajos completados

Agregar resumen diario/semanal compacto:

```text
TRABAJOS COMPLETADOS

Hoy
12 OP terminadas
184,250 piezas buenas
3,284 paquetes / rollos

Semana
52 OP terminadas
91% a tiempo
6 atrasadas
3 adelantadas
```

Esto puede ser pequeño; no debe competir con Tráfico de Planta.

---

# 15. Material listo para próximos arranques

No repetir entero el programa de surtido de Planeación.

Solo un resumen:

```text
ARRANQUES PRÓXIMAS 24 H
9 programados
7 listos
2 pendientes de surtir

[Ver programa de surtido]
```

Si hay faltante crítico mostrar la primera OP afectada.

---

# 16. Layout recomendado

Desktop:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PRODUCCIÓN · CENTRO DE CONTROL                                              │
│ [Hoy] [Área] [Turno]                                         [+ Nueva OP] │
├──────────────────────────────────────────────────────────────────────────────┤
│ CUMPL. │ PRODUCCIÓN │ TIEMPO PERD. │ MERMA │ ENTREGA RIESGO │ MÁQ. CRÍT. │
├──────────────────────────────────────────────────────────────────────────────┤
│ RESUMEN DEL TURNO                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                       TRÁFICO DE PLANTA                                     │
│ OFFSET / FLEXO                                                              │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ PLAN VS REAL                         │ REQUIERE TU ATENCIÓN                  │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ CAPACIDAD SEMANAL                    │ RIESGO DE ENTREGA                     │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ PÉRDIDAS 4M                          │ MERMA / DESPERDICIO                   │
├──────────────────────────────────────┴───────────────────────────────────────┤
│ DESEMPEÑO CONTRA ESTÁNDAR                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ TRABAJOS COMPLETADOS        │ ARRANQUES 24H                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

Responsive:

- KPIs 2 columnas en tablet/móvil.
- Tráfico de planta horizontal scroll si es necesario.
- Los bloques dobles pasan a una columna.
- No sacrificar legibilidad por meter todo arriba del fold.

---

# 17. Interacciones demo obligatorias

El Dashboard NO puede ser una captura estática.

Debe reaccionar al menos a:

### Acción 1 — abrir OP en riesgo

Desde Riesgo de Entrega / Action Center → detalle OP.

### Acción 2 — reprogramar

Desde excepción de entrega → abrir Planeación o modal existente de reprogramación.

### Acción 3 — máquina detenida

Desde Tráfico/Action Center → mostrar órdenes impactadas.

### Acción 4 — etapa de tráfico

Click en Doblado / Prensa / Rebobinado → mostrar cola y trabajo activo.

### Acción 5 — periodo/área

Filtro cambia los valores mock del dashboard de manera coherente.

No es necesario que cada métrica tenga backend real.

---

# 18. Datos y consistencia

Reutilizar como fuente principal:

- `orders` actuales del módulo;
- `PRODUCTION_MACHINES`;
- routing de las OP;
- `setupMinutes`;
- `standardMinutes`;
- `elapsedMinutes`;
- `stopMinutes`;
- `scrap`;
- `good`;
- `deliveryRisk`;
- `internalTargetDate`;
- `materials`;
- `qualityGates`;
- `traceability`.

Evitar valores hardcoded cuando ya pueden derivarse.

Crear snapshots mock adicionales solo donde sean necesarios para series por hora / histórico del día.

Todos los números de una misma pantalla deben cuadrar entre sí.

Ejemplo:

```text
Plan total = suma de Plan por área
Real total = suma de Real por área
Cumplimiento = Real / Plan
Tiempo perdido total = suma de 4M
Merma total = scrap / output total
```

---

# 19. No duplicar otras tabs

Dashboard:

- muestra resumen;
- muestra excepciones;
- permite drill-down.

Planeación:

- sigue siendo el workspace para mover/programar OP.

Piso:

- sigue siendo ejecución de operador.

Procesos/Máquinas:

- sigue siendo catálogo/estándares.

Analítica:

- sigue siendo análisis histórico profundo.

No convertir Dashboard en otro módulo completo.

---

# 20. Design System

Mantener exactamente el lenguaje visual actual del ERP:

- tokens `theme-*`;
- `ProductionCard`;
- tipografía actual;
- radios y spacing existentes;
- azul RTM como primario;
- rojo/ámbar/verde solo para estado;
- números en fuente monoespaciada cuando aplique.

Evitar:

- degradados innecesarios;
- cards gigantes con espacio vacío;
- gauges decorativos sin información;
- charts 3D;
- exceso de colores;
- textos tipo “AI powered”.

Debe verse industrial, ejecutivo y serio.

---

# 21. Prioridades

## P0

- KPIs derivados, sin `92.4%` hardcoded.
- Resumen del turno.
- Tráfico de planta Offset/Flexo.
- Plan vs Real.
- Capacidad semanal en horas por máquina.
- Riesgo de entrega.
- Action Center.
- 4M / tiempo perdido.
- Merma vs objetivo.

## P1

- Estándar vs Real.
- Trabajos completados.
- Arranques próximas 24h.
- drill-down por nodo de tráfico.
- filtros globales.

## P2

- gráfica acumulada por hora refinada;
- tendencias vs ayer/semana;
- microanimaciones discretas;
- export demo si ya existe patrón reusable.

---

# 22. Guion de demo esperado

El Dashboard debe permitir contar esta historia en ~90 segundos:

```text
“Esta es la pantalla con la que Manufactura empieza el día.”

1. Cumplimiento del plan
   → cuánto estaba planeado y cuánto salió realmente.

2. Tráfico de planta
   → vemos dónde están físicamente las órdenes.

3. Detectamos cuello en Doblado.
   → click y vemos qué OP está corriendo y cuál está esperando.

4. Atención requerida
   → Mark Andy lleva 47 min detenida y afecta 3 OP.

5. Riesgo de entrega
   → una TYCO ya no llega en la fecha prometida.

6. Capacidad semanal
   → Mark Andy está al 96%, pero Scout tiene disponibilidad.

7. Pérdidas y merma
   → sabemos cuánto tiempo y material se perdió y por qué 4M.

8. Estándar vs real
   → la prensa debería correr a X, pero hoy está abajo del estándar.

9. Vamos a Planeación
   → reprogramamos la OP a una máquina compatible.
```

La sensación final debe ser:

> **“Ya no necesito abrir seis Excels ni caminar la planta para entender el día.”**

---

# 23. Criterio de éxito

El Dashboard está listo cuando:

1. ninguno de los KPIs principales parece un número mágico;
2. el usuario puede explicar de dónde sale el cumplimiento;
3. se puede identificar visualmente un cuello de botella;
4. se puede identificar una máquina detenida y su impacto;
5. se puede ver si un pedido está en riesgo;
6. capacidad semanal se entiende en horas, no solo porcentaje;
7. merma y tiempo perdido están ligados a causas;
8. el Dashboard navega al detalle correcto para actuar;
9. Offset y Flexo se distinguen visualmente;
10. la pantalla se siente como un Centro de Control de Manufactura, no como una lista de tarjetas.
