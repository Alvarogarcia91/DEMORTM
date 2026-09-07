# RTM Demo — Producción v10 · Analítica e Inteligencia Operativa

> Branch objetivo: `alvaro01`
>
> Este documento NO pide rehacer Producción. Pide elevar únicamente la pestaña **Analítica** para que quede al nivel visual y funcional de Inventario y aproveche toda la información que ya existe en Producción: OP, máquinas, operadores, tiempos estándar/reales, setup, scrap, incidencias 4M, lead time, recetas y capacidad.

## 0. Objetivo

La Analítica actual de Producción es demasiado pobre para el nivel del resto del ERP. Hoy muestra básicamente:

- Plan vs real por área con valores simulados simples;
- utilización por máquina;
- scrap total como número;
- un Pareto 4M básico.

Esto no cuenta una historia de mejora continua.

La nueva Analítica debe responder:

```text
¿Estamos produciendo mejor o peor que antes?
¿Qué máquinas consumen más horas?
¿Cuáles son más eficientes?
¿Qué máquinas concentran los paros?
¿Por qué se está perdiendo tiempo?
¿Dónde está creciendo el scrap?
¿Qué procesos se están saliendo del setup estándar?
¿Qué operadores requieren contexto/revisión?
¿Qué clientes consumen más capacidad productiva?
¿Qué OP se están entregando tarde y por qué?
¿Qué patrones detecta el sistema y qué recomienda hacer?
```

Dashboard = qué está pasando AHORITA.

Analítica = qué patrón estamos viendo y qué deberíamos mejorar.

---

# 1. Referencia visual y UX

Tomar como referencia el nivel de densidad, interacción y jerarquía de:

```text
src/components/Inventario/AnalyticsTab.tsx
src/components/Inventario/DashboardTab.tsx
```

No copiar contenido de Inventario, pero sí reutilizar su lenguaje visual:

- cards compactas;
- KPIs con variación vs periodo anterior;
- filtros globales;
- Top N;
- tablas con drill-down;
- bloques de recomendaciones;
- morado `smart` / `Sparkles` para sugerencias;
- exportación demo;
- layouts densos y legibles;
- sin grandes espacios vacíos.

Producción debe sentirse parte del mismo ERP.

---

# 2. Header de Analítica

Reemplazar header actual por uno más completo:

```text
ANALÍTICA DE PRODUCCIÓN
Inteligencia operativa · Manufactura RTM

[Últimos 30 días ▼]
[Todas las áreas ▼]
[Todas las máquinas ▼]
[Todos los turnos ▼]
[Comparar vs periodo anterior ✓]

[Exportar Excel]
```

Filtros demo:

- Hoy
- Últimos 7 días
- Últimos 30 días
- Últimos 90 días
- Mes actual
- Q3 2026

Área:

- Todas
- Offset
- Flexografía
- Acabados

Máquina:

- Todas
- máquinas del catálogo actual

Turno:

- Todos
- Turno A
- Turno B
- Turno C

Los filtros pueden cambiar snapshots mock coherentes. No hace falta histórico real.

---

# 3. Subvistas internas de Analítica

Agregar navegación interna ligera:

```text
[Resumen] [Máquinas] [Operadores] [Scrap y paros]
```

No crear rutas nuevas ni módulos paralelos.

Todo sigue siendo la pestaña `Analítica`.

---

# 4. KPIs analíticos globales

Primera fila de 5–6 KPIs compactos:

```text
CUMPLIMIENTO DEL PLAN
91.8%
↑ 3.1 pts vs periodo anterior

EFICIENCIA PRODUCTIVA
89.4%
↑ 1.7 pts

SCRAP / MERMA
3.4%
↓ 0.6 pts
Objetivo ≤5%

TIEMPO PERDIDO
18h 42m
↓ 2h 14m
31 incidencias

OP A TIEMPO
88%
44 de 50
↑ 4 pts

SETUP VS ESTÁNDAR
+7.8%
12 min promedio arriba
```

## 4.1 Reglas de consistencia

No usar porcentajes mágicos si pueden derivarse.

Preferir:

```text
Cumplimiento = producción real / producción planeada
Scrap % = scrap / (good + scrap)
Tiempo perdido = suma de incidencias / stopMinutes
Eficiencia = output real / output estándar
Variación setup = (setup real - setup estándar) / setup estándar
OP a tiempo = OP terminadas dentro de fecha / OP terminadas
```

Si falta un dato histórico, usar mock explícito y coherente.

---

# 5. Sugerencias del Sistema — protagonista morado

Agregar bloque visible inmediatamente después de KPIs.

Usar el mismo lenguaje visual inteligente de Inventario:

- `Sparkles`
- borde/acento morado
- `StatusBadge variant="smart"` si aplica
- CTA por sugerencia

Título:

`Sugerencias del sistema`

NO usar wording `IA powered`.

Ejemplos demo:

```text
✦ Mark Andy 830 concentra 31% de los minutos perdidos del periodo.
  Principal causa: ajustes de registro.
  [Analizar máquina]

✦ Stahl 2 lleva 3 turnos consecutivos debajo del estándar.
  Velocidad real 3,020/h vs estándar 3,500/h.
  [Ver desempeño]

✦ OP Fresenius 95321 y 95329 usan el mismo sustrato + troquel.
  Agruparlas podría reducir ~35 min de preparación (Demo configurable).
  [Ver secuencia]

✦ Scrap Flexo subió de 3.2% a 4.4% en las últimas 3 semanas.
  Principal contribución: registro / troquel.
  [Analizar scrap]
```

Las sugerencias deben salir de mocks/condiciones simples y ser accionables.

---

# 6. Producción Plan vs Real — tendencia

La analítica actual muestra barras simples por área. Sustituir por una visual de tendencia del periodo.

Puede usarse la librería de charts ya instalada si existe; NO agregar una dependencia nueva solo para esto.

Mostrar:

```text
PRODUCCIÓN · PLAN VS REAL

Plan acumulado   1,245,000
Real acumulado   1,143,000
Cumplimiento         91.8%
```

Series:

- Plan acumulado
- Real acumulado

Selector interno:

```text
[Total] [Offset] [Flexografía] [Acabados]
```

Para 30 días, mostrar al menos 4–6 puntos temporales coherentes.

---

# 7. Top 5 máquinas por horas productivas

Agregar ranking:

```text
TOP 5 MÁQUINAS · HORAS PRODUCTIVAS

1. Mark Andy Scout      176.4 h
2. Heidelberg           164.8 h
3. DiDDE 860            148.2 h
4. Stahl 2              132.7 h
5. Muller Martini       118.1 h
```

Derivar con datos demo coherentes del periodo.

La lectura debe dejar claro:

`más usada ≠ más eficiente`.

---

# 8. Eficiencia por máquina — estándar vs real

Tabla/ranking:

```text
MÁQUINA              ESTÁNDAR      REAL         EFICIENCIA
Mark Andy Scout      9,000 ft/h    8,240 ft/h      91.6%
Heidelberg           3,500 /h      3,380 /h        96.6%
DiDDE 860            8,500 /h      8,190 /h        96.4%
Stahl 2              3,500 /h      3,020 /h        86.3% ⚠
Muller Martini       3,500 /h      3,620 /h       103.4% ↑
```

Cuando un estándar no esté confirmado por RTM, marcar:

`Demo configurable`.

Agregar semáforo:

- ≥95% saludable
- 85–94% atención
- <85% crítico

Estos umbrales son DEMO configurable, no estándar oficial RTM.

---

# 9. Tiempo de paro por máquina

Agregar gráfica Top N horizontal:

```text
TIEMPO DE PARO POR MÁQUINA

Mark Andy 830      268 min
Stahl 2            174 min
Heidelberg         112 min
DiDDE 860           81 min
Muller Martini      49 min
```

Mostrar total del periodo.

Drill-down al hacer clic:

- cantidad de paros;
- minutos totales;
- duración promedio;
- principales causas;
- OP afectadas.

---

# 10. Causas de paro

Agregar ranking independiente de causas:

```text
PRINCIPALES CAUSAS DE PARO

Ajuste de registro         184 min
Material no surtido        146 min
Problema mecánico          121 min
Cambio de herramental       83 min
Esperando Calidad           51 min
No hay trabajo              42 min
```

Relacionar cuando aplique con 4M y códigos de actividad del operador.

---

# 11. Duración promedio por paro

Agregar tabla compacta:

```text
MÁQUINA             # PAROS   PROMEDIO/PARO   TOTAL
Mark Andy 830          9         29.8 min      268 min
Stahl 2                7         24.9 min      174 min
Heidelberg             4         28.0 min      112 min
```

No llamar MTTR globalmente porque no todos los paros son falla mecánica.

Si se filtra categoría `Máquina / problema mecánico`, sí puede mostrarse `MTTR demo`.

---

# 12. Scrap / Merma — análisis completo

Eliminar la idea de `Scrap registrado: 816` como bloque principal.

Mostrar:

```text
SCRAP / MERMA
Periodo actual        3.4%
Periodo anterior      4.0%
Objetivo              ≤5.0%
Tendencia             ↓ 0.6 pts
```

## 12.1 Tendencia por periodo

```text
S1  4.0%
S2  4.4%
S3  3.7%
S4  3.4%
```

Agregar línea objetivo 5% si la librería de chart lo permite.

## 12.2 Scrap por proceso

```text
Flexo impresión       4.4%
Offset impresión      3.3%
Doblado               2.7%
Guillotina            1.9%
Grapado               1.5%
Rebobinado            1.3%
```

## 12.3 Causas de scrap

```text
Registro fuera posición      28%
Ajuste de máquina            21%
Material                     18%
Troquel                      14%
Doblado                       9%
Otros                        10%
```

## 12.4 Top OP por scrap

```text
OP           CLIENTE      SCRAP      %
OP-95321     Fresenius     2,900      5.58% 🔴
OP-95344     B&D             920      3.88%
OP-95318     TYCO            840      3.52%
```

CTA: `Abrir OP`.

---

# 13. Setup estándar vs real

Agregar ranking por proceso/familia:

```text
PROCESO / FAMILIA             STD      REAL     VARIACIÓN
Flexo + barniz + troquel      45m      58m       +28.9%
Manual Offset 64 pág.         40m      46m       +15.0%
Doblado                       25m      28m       +12.0%
Rebobinado                    15m      14m        -6.7%
Grapado                       30m      27m       -10.0%
```

Usar las recetas/estándares construidos en V6.

Agregar sugerencia morada si hay patrón:

```text
✦ El 62% del sobretiempo de setup Flexo aparece cuando coinciden troquel + barniz.
  Revisar preparación previa de herramental.
  [Ver operaciones]
```

El 62% es Demo configurable si no se deriva de mocks reales.

---

# 14. Desempeño por operador

Agregar vista/ranking de operadores, pero evitar lenguaje punitivo.

Título:

`Desempeño por operador`

Comparar idealmente dentro del mismo proceso/máquina o al menos mostrar contexto.

Tabla demo:

```text
OPERADOR       MÁQUINA        EFIC.   SCRAP   TIEMPO PRODUCTIVO
M. Ríos        Scout 10"       96%     2.4%        91%
J. Salinas     Heidelberg      94%     2.7%        89%
C. Medina      DiDDE 860       92%     3.1%        88%
A. Torres      Stahl 2         87%     2.8%        83%
H. Vargas      Mark Andy 830   84%     4.6%        79%
```

Al abrir operador mostrar:

```text
Turnos
OP terminadas
Tiempo productivo
Setup vs estándar
Scrap
Paros reportados
```

## 14.1 Recomendaciones con contexto

Ejemplo:

```text
✦ El aumento de scrap coincide con 3 OP que usaron el mismo suaje.
  Antes de atribuirlo al operador, revisar herramental.
  [Ver suaje]
```

Esto es importante: no generar rankings que simplifiquen problemas de máquina/material como problema del operador.

---

# 15. Distribución del tiempo del operador

Usar los conceptos del Reporte Diario:

```text
Producción                71%
Setup                     14%
Problemas mecánicos        6%
Esperando material         4%
No hay trabajo             3%
Junta / entrenamiento      2%
```

Permitir filtrar por:

- operador;
- turno;
- máquina;
- área.

---

# 16. Capacidad consumida por cliente

Agregar dos Top 5 pequeños:

```text
VOLUMEN PRODUCIDO POR CLIENTE
Black & Decker
Fresenius
TYCO
Panasonic
ILSCO
```

Y más importante:

```text
HORAS DE PLANTA POR CLIENTE
Black & Decker       142 h
Fresenius            118 h
TYCO                   97 h
Panasonic              84 h
ILSCO                   68 h
```

Narrativa:

> no solo sabemos cuánto se produjo, también quién consumió capacidad productiva.

---

# 17. Lead time / cumplimiento de entrega

Agregar bloque:

```text
CUMPLIMIENTO DE ENTREGA
88% a tiempo

A tiempo           44 OP
1 día tarde         4 OP
2–3 días tarde      2 OP
>3 días tarde       0 OP
```

Agregar Top atrasos:

```text
OP-95321 · TYCO
Fecha cliente      09 Sep
Objetivo RTM       08 Sep
Real               10 Sep
Desviación         +2 días

Causas:
1h 48m paro máquina
material +1 día
setup +22 min
```

CTA: `Abrir trazabilidad`.

---

# 18. Heatmap máquina × día

Agregar mapa de desempeño tipo matriz:

```text
                 LUN   MAR   MIÉ   JUE   VIE
Mark Andy 830    84%   72%   91%   76%   88%
Scout 10"        96%   94%   89%   92%   95%
DiDDE             93%   97%   92%   96%   94%
Stahl             82%   79%   86%   84%   87%
```

Semántica:

- verde = dentro estándar;
- ámbar = atención;
- rojo = desviación fuerte.

Umbrales Demo configurable.

No usar gradientes decorativos innecesarios; puede ser tabla con celdas semánticas.

---

# 19. Pareto 4M + tendencia

Mantener Pareto 4M pero mejorarlo.

Resumen:

```text
Material        34%
Máquina         29%
Método          23%
Mano de obra    14%
```

Y tendencia semanal:

```text
             S1   S2   S3   S4
Material     72   85   61   48
Máquina      44   51   83   93
Método       39   33   30   37
Mano obra    28   22   19   21
```

Agregar sugerencia:

```text
✦ Máquina pasó de 44 a 93 min perdidos en cuatro semanas.
  Mayor contribución: Mark Andy 830.
  [Analizar tendencia]
```

---

# 20. Layout recomendado

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ ANALÍTICA DE PRODUCCIÓN                                                   │
│ [Periodo] [Área] [Máquina] [Turno] [Comparar]          [Exportar Excel]  │
├────────────────────────────────────────────────────────────────────────────┤
│ Cumplim. │ Eficiencia │ Scrap │ Tiempo perdido │ Setup │ OP a tiempo     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    ✦ SUGERENCIAS DEL SISTEMA                              │
│                                                                            │
├────────────────────────────────────┬───────────────────────────────────────┤
│ PRODUCCIÓN PLAN VS REAL           │ SCRAP · TENDENCIA                    │
├────────────────────────────────────┼───────────────────────────────────────┤
│ TOP MÁQUINAS · HORAS              │ EFICIENCIA POR MÁQUINA              │
├────────────────────────────────────┼───────────────────────────────────────┤
│ PAROS POR MÁQUINA                 │ PRINCIPALES CAUSAS                   │
├────────────────────────────────────┼───────────────────────────────────────┤
│ SETUP ESTÁNDAR VS REAL            │ ✦ OPORTUNIDAD DE MEJORA             │
├────────────────────────────────────┼───────────────────────────────────────┤
│ DESEMPEÑO POR OPERADOR            │ DISTRIBUCIÓN DEL TIEMPO             │
├────────────────────────────────────┼───────────────────────────────────────┤
│ SCRAP POR PROCESO / OP            │ PARETO 4M + TENDENCIA               │
├────────────────────────────────────┼───────────────────────────────────────┤
│ HORAS DE PLANTA POR CLIENTE       │ LEAD TIME / ENTREGA                 │
├────────────────────────────────────┴───────────────────────────────────────┤
│ MAPA DE DESEMPEÑO MÁQUINA × DÍA                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

# 21. Navegación y drill-down

La Analítica debe llevar al detalle, no ser un dashboard muerto.

Acciones sugeridas:

```text
Máquina → tab Máquinas / detalle de máquina
OP → detalle OP
Operador → drawer analítico del operador
Scrap → tab Scrap y pérdidas si existe
Paro → incidencia / trazabilidad OP
Setup → Procesos / receta
Lead time → Planeación / OP
Sugerencia de secuencia → Planeación
```

Reutilizar navegación actual siempre que sea posible.

---

# 22. Datos demo

Como es demo, se permite enriquecer mocks.

Reglas:

1. Números coherentes entre bloques.
2. No presentar valores inventados como mediciones oficiales RTM.
3. Si un estándar no está confirmado, mostrar `Demo configurable`.
4. Preferir máquinas, clientes y operadores ya presentes en el módulo.
5. Mantener suficientes eventos para que Pareto, scrap y tendencias se vean interesantes.
6. Crear al menos 4 semanas de snapshots para tendencias.
7. Crear al menos 5 operadores con métricas consistentes.
8. Crear al menos 5 máquinas con horas productivas/paros/eficiencia.

---

# 23. Arquitectura

Archivo actual:

```text
src/components/Produccion/AnaliticaProduccion.tsx
```

No mantener todo en una sola línea/componente gigante.

Separar razonablemente, por ejemplo:

```text
src/components/Produccion/analytics/
  ProductionAnalyticsKpis.tsx
  ProductionSmartInsights.tsx
  ProductionPlanVsActual.tsx
  ProductionMachineAnalytics.tsx
  ProductionDowntimeAnalytics.tsx
  ProductionScrapAnalytics.tsx
  ProductionSetupAnalytics.tsx
  ProductionOperatorAnalytics.tsx
  ProductionDeliveryAnalytics.tsx
  ProductionPerformanceHeatmap.tsx
```

No sobrearquitecturar si algunos componentes pueden agruparse.

Reutilizar:

- design system actual;
- `ProductionCard` si sigue siendo útil;
- tokens de tema;
- `StatusBadge` común cuando convenga;
- mocks de Producción actuales;
- estructuras de recetas/máquinas/incidencias.

---

# 24. Prioridad

## P0

- nuevo header/filtros;
- KPIs derivados/coherentes;
- bloque morado Sugerencias del sistema;
- Plan vs Real temporal;
- Top máquinas por horas;
- eficiencia por máquina;
- paros por máquina + causas;
- scrap tendencia + proceso + top OP;
- setup estándar vs real;
- Pareto 4M mejorado;
- layout al nivel de Inventario;
- eliminar hardcodes obvios actuales como `86%`.

## P1

- operadores;
- distribución de tiempo;
- horas de planta por cliente;
- lead time / entrega;
- heatmap máquina × día;
- tendencia 4M;
- drill-downs.

## P2

- comparador de periodos más sofisticado;
- subtab dedicadas si aportan claridad;
- exportación con distintos reportes demo.

---

# 25. Criterio de terminado

La vista debe sentirse claramente más completa que la analítica actual y al nivel de Inventario.

El usuario debe poder hacer esta demo:

```text
Analítica
→ veo si mejoramos vs periodo anterior
→ veo sugerencias del sistema
→ detecto máquina con más paro
→ veo causa principal
→ veo scrap creciendo en Flexo
→ veo setup fuera de estándar
→ veo operador con contexto
→ veo cliente que consume capacidad
→ veo entrega tardía y causas
→ navego al detalle correspondiente
```

Al terminar:

- correr build/typecheck disponible;
- corregir errores;
- mantener todo en `alvaro01`;
- no crear ramas;
- no backend;
- no APIs;
- no migraciones.
