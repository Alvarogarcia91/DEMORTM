# RTM Demo — Módulo de Producción v2

> Branch objetivo: `alvaro01`
>
> Este documento es la guía de implementación para mejorar el módulo de Producción YA existente. No rehacer desde cero. No crear ramas nuevas.

## 0. Objetivo

Convertir el módulo actual de Producción de un demo genérico a un demo reconocible por RTM, basado en la operación explicada por Iván, Mariana, Alicia y los archivos entregados por RTM.

El demo debe contar claramente este flujo:

```text
Pedido
→ OP
→ Validación de stock/materiales/herramental
→ Planeación por capacidad real de máquina
→ Preparación
→ Producción en piso
→ Primera pieza / liberaciones de calidad
→ Incidencias y tiempos perdidos
→ Siguiente operación del routing
→ Auditoría final
→ Empaque / producto terminado
→ Trazabilidad
```

Debe diferenciar de verdad OFFSET y FLEXOGRAFÍA.

---

# 1. Estado actual del repo

Producción ya existe en `alvaro01` y debe mejorarse sobre lo implementado.

Archivos actuales relevantes:

```text
src/components/Produccion/ProduccionPage.tsx
src/data/mockProduccionData.ts
src/components/Sidebar.tsx
src/components/DashboardShell.tsx
src/context/NavigationModulesContext.tsx
```

Problemas actuales a corregir:

- `ProduccionPage.tsx` concentra demasiado código.
- la ejecución en Piso todavía es muy genérica.
- las OP no modelan suficientemente materiales, herramientas, etapas y eventos reales.
- Offset y Flexo todavía se sienten demasiado parecidos.
- el planeador actual es visual, pero no representa completamente capacidad, setup, corrida y restricciones.
- falta integrar el concepto real de paginación/imposición de Offset.
- faltan datos del reporte diario del operador.
- falta mayor trazabilidad por operación.

No crear un mini ERP aislado. Producción debe seguir el patrón existente del repo y convivir con Pedidos, Inventario, Mantenimiento, Calidad y Salidas.

---

# 2. Flujo real de RTM que debe representar el demo

## 2.1 Offset

Iván describió para trabajos tipo manual una ruta real de varias máquinas.

Ejemplo principal para demo:

```text
PEDIDO
  ↓
OP
  ↓
PREIMPRESIÓN / PLACAS LIBERADAS
  ↓
IMPRESIÓN
  ↓
GUILLOTINA
  ↓
DOBLADO
  ↓
GRAPADO / ALZADO
  ↓
CALIDAD FINAL
  ↓
EMPAQUE
```

No todas las OP Offset deben usar todas las operaciones.

Crear al menos dos familias demo:

### Manual Black & Decker

```text
Preimpresión
→ Impresión
→ Guillotina
→ Doblado
→ Grapado
→ Calidad
→ Empaque
```

### Instructivo sencillo

```text
Preimpresión
→ Impresión
→ Guillotina
→ Calidad
→ Empaque
```

Cada operación del routing debe almacenar visualmente:

- estación/proceso
- máquina planeada
- máquina alternativa compatible
- fecha/hora planeada
- inicio real
- fin real
- operador
- cantidad de entrada
- cantidad buena
- scrap/merma
- estatus
- primera pieza liberada sí/no
- observaciones

### Máquinas Offset documentadas

El repo/demo puede usar máquinas RTM reales ya conocidas, por ejemplo:

- Conserver 1–2
- Conserver 3–4
- Conserver DiDDE 860
- Conserver 8 Colores
- Ryobi 1–2
- Heidelberg Speedmaster
- Guillotinas
- Dobladoras
- Stahl
- Muller Martini

Cuando haya una capacidad documentada en los archivos de RTM, preferir ese dato sobre números inventados.

---

## 2.2 Flexografía

Flexografía NO debe dibujarse como si cada acabado fuera una estación separada.

En RTM una misma prensa puede ejecutar varias capacidades en línea dependiendo del equipo y artículo.

Ejemplo visual:

```text
MARK ANDY
├── Impresión
├── Barniz
├── Laminado
├── Troquelado
├── Precorte
└── otras capacidades según artículo/máquina
        ↓
REBOBINADO / INSPECCIÓN
        ↓
CALIDAD
        ↓
EMPAQUE
```

Crear al menos estos tipos de OP demo:

### Etiqueta impresa con acabado en línea

```text
Sustrato liberado
→ Mark Andy [impresión + barniz + troquelado]
→ Rotoflex / rebobinado
→ Calidad
→ Empaque
```

### Etiqueta blanca / trabajo sin impresión

```text
Sustrato liberado
→ Troquelado
→ Rebobinado
→ Calidad
→ Empaque
```

Mostrar en el detalle de la OP un bloque de capacidades requeridas:

```text
Capacidades del trabajo
[✓ Impresión]
[✓ Troquelado]
[✓ Barniz]
[— Laminado]
[— Corona]
[✓ Rebobinado]
```

Y un bloque de compatibilidad:

```text
Máquina sugerida: Mark Andy 830 10"
Compatibilidad: 100%
Carga semanal: 82%
Material: disponible
Herramental: liberado
Alternativa: Mark Andy Scout 10"
```

La recomendación de máquina es DEMO, pero debe ser coherente con capacidades y carga.

---

# 3. Piso de Producción — digitalizar el reporte real del operador

RTM entregó un formato físico llamado **Reporte de producción diaria**.

La pantalla Piso debe sentirse como la digitalización directa de ese formato.

## 3.1 Encabezado

Capturar/mostrar:

- Fecha
- Turno
- Nombre del operador
- Área / Máquina

## 3.2 Renglones de actividad

Cada registro de actividad debe tener:

- Hora inicio
- Hora fin
- Código
- Número de orden / OP
- Cliente
- Número de parte
- Tipo de acabado
- Cantidad
- Comentarios

## 3.3 Códigos visibles en el formato RTM

Usar como catálogo demo:

```text
100 = Inicio de turno
200 = Problemas mecánicos
300 = No hay trabajo
400 = Junta o entrenamiento
```

Además pueden existir actividades productivas demo con códigos internos claramente marcados como demostrativos, pero NO reemplazar los cuatro códigos documentados.

## 3.4 UX de Piso

Debe ser sencilla para tablet/pantalla de planta.

Acciones grandes:

```text
[Iniciar preparación]
[Iniciar producción]
[Registrar producción]
[Pausar]
[Reanudar]
[Registrar actividad / paro]
[Solicitar material adicional]
[Terminar operación]
```

Cuando una operación está activa mostrar:

```text
OP
Máquina
Operador
Turno
Hora inicio
Tiempo transcurrido
Tiempo estándar
Objetivo
Cantidad buena
Scrap
Avance
```

Agregar cronómetro visual demo.

Al terminar una operación debe quedar un registro inmutable visualmente en el timeline de trazabilidad.

---

# 4. Materiales e insumos por OP

Iván explicó que uno de sus problemas principales es que Planeación no tiene certeza de cuánto material realmente existe o cuánto ya se entregó a una OP.

También explicó el problema de pedir material adicional bajo la misma OP sin que Planeación se entere inmediatamente.

El demo debe hacerlo evidente.

## 4.1 Pestaña “Preparación e insumos”

Tabla:

```text
INSUMO | REQUERIDO | RESERVADO | ENTREGADO | DISPONIBLE | LOTE | ESTADO
```

Estados:

```text
✓ Disponible
⚠ Parcial
✕ Insuficiente
```

## 4.2 Insumos Offset

Dependiendo del artículo:

- papel
- pliego
- bobina
- tinta
- placas / negativos / herramental de impresión
- material de empaque

## 4.3 Insumos Flexografía

Dependiendo del artículo:

- sustrato / bobina
- tintas
- grabado
- suaje
- barniz si aplica
- laminado si aplica
- material de empaque

Los lotes de tintas y materias primas deben poder verse desde la OP para fines de trazabilidad.

## 4.4 Material adicional

Agregar acción:

`Solicitar material adicional`

Si la OP ya recibió material y el operador solicita más, abrir modal:

```text
Esta OP ya recibió 1,000 pliegos.
Está solicitando 1,000 adicionales.

Cantidad adicional: ______
Motivo: __________________
Categoría 4M: [Máquina | Material | Mano de obra | Método]
Comentario: ______________
```

Al confirmar en demo:

- registrar evento
- generar incidencia si aplica
- actualizar material entregado
- reflejar alerta en Dashboard
- incrementar scrap/merma cuando el motivo corresponda

Todo local/mock. Sin backend.

---

# 5. Planeación real — capacidad, cola y fechas

El planner debe dejar de ser solamente un calendario bonito.

Iván explicó que quiere saber por semana:

- cuántas horas ya están cargadas
- cuántas horas quedan disponibles
- si cabe un trabajo nuevo
- si puede adelantar un trabajo
- si la máquina ya está saturada

## 5.1 Por máquina mostrar

```text
Capacidad semanal
Horas disponibles
Horas planeadas
Utilización %
Setup estimado
Tiempo de corrida estimado
Mantenimiento/bloqueo si aplica
```

## 5.2 Por OP mostrar

```text
Fecha solicitada por cliente
Fecha interna de producción
Fecha estimada por el sistema
Setup
Corrida
Máquina planeada
Máquina alternativa
Estado de materiales
Estado de herramental
```

## 5.3 Alertas

- Sin material
- Material parcial
- Máquina saturada
- Fecha cliente en riesgo
- Herramental pendiente
- OP atrasada
- Máquina detenida

## 5.4 Reprogramación

Quitar el concepto simplista `Mover +1 día` como acción principal.

Agregar modal:

```text
Reprogramar OP
Nueva máquina: __________
Nueva fecha: _____________
Motivo: __________________

Impacto:
Carga máquina origen: 94% → 81%
Carga máquina destino: 58% → 72%
Fecha estimada: 10 Sep → 11 Sep
```

Todo puede ser simulado localmente.

## 5.5 Recomendación de alternativa

Cuando una máquina se detiene o se satura, mostrar recomendación demo de otra máquina compatible.

Ejemplo:

```text
Máquina planeada no disponible.
Alternativa sugerida: Mark Andy Scout 10"
Compatibilidad: cumple capacidades requeridas
Carga estimada: 68%
```

---

# 6. Optimizador de Paginación — Offset

Este feature es importante para la demo porque RTM entregó un Excel llamado **Master Paginacion** y Mariana/Iván explicaron que hoy el cálculo consume tiempo y conocimiento del planner/diseño.

NO inventar la lógica desde cero.

Tomar como referencia conceptual la hoja `PAGINAS` y las hojas visuales:

```text
FRENTE 32'S
ATRAS 32'S
FRENTE 16'S
ATRAS 16'S
FRENTE 12'S
ATRAS 12'S
FRENTE 8'S
ATRAS 8'S
```

## 6.1 Datos reales observados en `PAGINAS`

La tabla maneja combinaciones de formas de:

```text
8 páginas
12 páginas
16 páginas
32 páginas
```

También contiene:

- hojas
- formas 1..n
- tamaño de pliego
- porcentaje a imprimir por forma

Ejemplos documentados del Excel:

```text
8 páginas  → 1 forma de 8
12 páginas → 1 forma de 12
16 páginas → 1 forma de 16
20 páginas → 8 + 12
24 páginas → 12 + 12
28 páginas → 12 + 16
32 páginas → 32
40 páginas → 8 + 32
44 páginas → 12 + 32
48 páginas → 16 + 32
56 páginas → 12 + 12 + 32
60 páginas → 12 + 16 + 32
64 páginas → 32 + 32
72 páginas → 8 + 32 + 32
80 páginas → 16 + 32 + 32
96 páginas → 32 + 32 + 32
```

IMPORTANTE: no reemplazar estas combinaciones por reglas inventadas cuando el número está cubierto por la tabla del Excel.

## 6.2 UI propuesta

Dentro de una OP Offset agregar tab o drawer:

`Optimización de paginación`

Inputs demo:

- número de páginas
- cantidad de libros
- máquina
- tamaño final

Resultado:

```text
Paginación recomendada

Forma 1 · 32 páginas
Pliego: 23.875 x 35.500
% a imprimir: 100%

Forma 2 · 16 páginas
Pliego: 23.875 x 35.500
% a imprimir: 50%
```

Mostrar además:

- número de hojas
- combinación recomendada
- tamaño de pliego asociado
- porcentaje a imprimir
- total estimado de pliegos para la OP, si puede calcularse coherentemente

Botones:

```text
[Usar recomendación]
[Ajustar manualmente]
```

El planner siempre debe confirmar la recomendación.

## 6.3 Vista de imposición

Mostrar una representación visual sencilla inspirada en las hojas FRENTE/ATRÁS del Excel.

No es necesario replicar Excel pixel por pixel.

Sí debe comunicar:

```text
FRENTE
┌────┬────┬────┬────┐
│ 1  │ 16 │ 5  │ 12 │
├────┼────┼────┼────┤
│ ... páginas ...    │
└────────────────────┘

REVERSO
┌────┬────┬────┬────┐
│ ... páginas ...    │
└────────────────────┘
```

La visualización puede ser mock coherente para demo; la combinación de formas debe respetar la tabla documentada.

---

# 7. Detalle de OP

Reorganizar el detalle actual en tabs claras:

```text
Resumen
Routing
Preparación e insumos
Ejecución
Calidad
Trazabilidad
```

Para Offset agregar:

```text
Optimización de paginación
```

## 7.1 Resumen

- OP
- pedido origen
- cliente
- número de parte
- revisión
- cantidad solicitada
- stock PT comprometido
- cantidad a producir
- prioridad
- fecha compromiso
- área
- máquina principal
- avance

## 7.2 Routing

Mostrar operaciones reales, no una lista genérica.

Cada etapa debe ser clickeable y mostrar:

- planeado
- real
- máquina
- operador
- cantidades
- calidad
- tiempos
- incidencias

## 7.3 Ejecución

Mostrar los registros provenientes de Piso en formato tipo bitácora:

```text
07:30  100  Inicio de turno
07:30  OP-99466  Doblado manual iniciado
08:10  ...
09:15  OP-99466  Producción registrada · 9,600
```

Usar datos demo coherentes inspirados en el formato real; no copiar datos personales del documento fuente.

---

# 8. Calidad integrada al routing

Producción NO debe duplicar el módulo de Calidad.

Sí debe mostrar sus gates/bloqueos.

RTM necesita primera pieza y liberaciones asociadas al proceso.

En la OP mostrar estados como:

```text
Preimpresión: liberada
Primera pieza impresión: aprobada
Primera pieza doblado: aprobada
Auditoría final: pendiente
Producto terminado: bloqueado hasta liberar
```

Eventos que pueden provocar nueva liberación deben representarse visualmente si ya existen en mocks de Calidad, por ejemplo cambio relevante de operación o reanudación después de un evento; mantener demo simple y no duplicar reglas completas del módulo QA.

---

# 9. Incidencias y 4M

Categorías principales:

```text
Máquina
Material
Mano de obra
Método
```

Campos:

- categoría
- tipo
- descripción
- OP
- máquina
- operador
- hora inicio
- hora fin
- minutos perdidos
- cantidad afectada
- evidencia demo opcional

Las incidencias deben alimentar:

- Dashboard
- OP
- Piso
- Analítica

---

# 10. Dashboard de Producción

Mantener lo que ya funciona y enriquecerlo.

KPIs:

- OP activas
- En proceso
- Detenidas
- Atrasadas
- Cumplimiento del plan
- Scrap
- Horas perdidas
- Material insuficiente

## Tráfico de planta

Agregar una vista compacta:

```text
OFFSET
Impresión        6 OP
Guillotina       4 OP
Doblado          3 OP
Grapado          2 OP
Calidad          2 OP

FLEXOGRAFÍA
En prensa         5 OP
Rebobinado        2 OP
Calidad           1 OP
```

## Pareto 4M

Gráfica simple con:

- Máquina
- Material
- Mano de obra
- Método

---

# 11. Analítica

Agregar o preparar visualmente:

- plan vs real
- utilización por máquina
- capacidad semanal
- tiempo de setup
- tiempo de corrida
- scrap por área
- tiempo perdido por 4M
- órdenes a tiempo vs retrasadas
- producción Offset vs Flexografía
- Pareto de incidencias

Selector de periodo y Exportar Excel pueden ser demo con toast/banner.

---

# 12. Mocks mínimos para una demo convincente

Mantener al menos:

- 20 OP
- mezcla Offset / Flexografía / Acabados
- 8 clientes RTM reconocibles
- varias etapas de routing
- OP con materiales completos
- OP con material parcial
- OP detenida por máquina
- OP con solicitud de material adicional
- OP pendiente de calidad
- OP terminada
- incidencias 4M

Incluir dos OP “hero” muy cuidadas:

## HERO OFFSET

Cliente: Black & Decker
Producto: manual
Ruta completa:

```text
Preimpresión
→ Impresión
→ Guillotina
→ Doblado
→ Grapado
→ Calidad
→ Empaque
```

Debe tener optimización de paginación visible.

## HERO FLEXO

Cliente industrial existente en mocks RTM.
Producto: etiqueta.

```text
Sustrato
→ Mark Andy [impresión + barniz + troquelado]
→ Rotoflex
→ Calidad
→ Empaque
```

Debe mostrar lote de sustrato, tintas, grabado/suaje y capacidades en línea.

---

# 13. Arquitectura recomendada

Sin sobrearquitecturar, separar `ProduccionPage.tsx`.

```text
src/components/Produccion/
├── ProduccionPage.tsx
├── ProductionDashboard.tsx
├── ProductionPlanner.tsx
├── ProductionOrders.tsx
├── ProductionFloor.tsx
├── ProductionOrderDetail.tsx
├── ProductionPaginationOptimizer.tsx
├── ProductionMaterials.tsx
├── ProductionTraceability.tsx
├── ProductionIncidentModal.tsx
└── productionTypes.ts            (si conviene)
```

Mocks:

```text
src/data/mockProduccionData.ts
```

Puede dividirse solamente si mejora legibilidad.

Eliminar `@ts-nocheck` del módulo Producción si es razonablemente posible sin desestabilizar el repo.

---

# 14. Design system

NO inventar otro diseño.

Reutilizar:

- `bg-theme-surface`
- `text-theme-main`
- `text-theme-muted`
- `border-theme-subtle`
- `bg-theme-primary`
- cards existentes
- tablas existentes
- ModalPortal
- spacing actual
- badges/chips actuales
- tipografía actual

La vista Piso sí puede tener controles más grandes por usabilidad, pero debe seguir siendo el mismo ERP.

---

# 15. Restricciones

- trabajar SOLO en branch `alvaro01`
- NO crear ramas
- NO hacer push a `main`
- frontend/demo solamente
- sin backend
- sin APIs nuevas
- sin migraciones
- no romper otros módulos
- no duplicar Mantenimiento
- no duplicar Calidad
- no inventar datos técnicos cuando existe dato documentado en los archivos RTM
- si existe inconsistencia entre fuentes, mantener el dato actual del repo o dejarlo como demo, sin afirmar precisión técnica falsa

---

# 16. Orden de implementación

1. auditar implementación actual de Producción
2. separar componentes sin romper comportamiento
3. enriquecer tipos/mocks
4. mejorar Piso según Reporte de producción diaria
5. hacer routing real Offset/Flexo
6. agregar Preparación e insumos
7. mejorar Planeación y reprogramación
8. agregar Optimizador de Paginación
9. agregar Trazabilidad
10. enriquecer Dashboard/Analítica
11. build/typecheck
12. corregir errores

---

# 17. Historia de demo esperada

## Demo Offset

```text
Abrir OP Black & Decker
→ ver pedido y revisión
→ abrir optimizador de paginación
→ sistema recomienda formas basadas en Master Paginación
→ planner acepta
→ validar materiales y placas
→ ver programación Heidelberg/Conserver
→ abrir Piso
→ iniciar operación
→ registrar cantidad
→ avanzar a guillotina/doblado/grapado
→ ver primera pieza aprobada
→ trazabilidad completa
```

## Demo Flexografía

```text
Abrir OP de etiqueta
→ mostrar capacidades requeridas
→ sistema recomienda Mark Andy compatible
→ revisar bobina, tinta, grabado y suaje
→ iniciar preparación
→ iniciar corrida
→ registrar paro/material adicional
→ Dashboard refleja incidencia
→ reanudar
→ pasar a Rotoflex/rebobinado
→ calidad final
→ trazabilidad completa
```

El cliente debe sentir que el sistema reemplaza la dependencia actual de Excel, memoria del planner, formatos físicos separados y búsquedas manuales para saber dónde está una orden.