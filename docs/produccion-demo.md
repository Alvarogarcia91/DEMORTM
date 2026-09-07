# RTM Demo — Módulo de Producción

## Objetivo
Crear un módulo demo de Producción integrado al ERP existente de RTM, siguiendo la arquitectura y lenguaje visual actual del repo. El módulo debe demostrar planeación, routing, ejecución en piso, incidencias, capacidad y trazabilidad sin crear backend real.

## Auditoría del repo
Actualmente Producción no existe como módulo propio. Para integrarlo correctamente se debe extender:

- `src/components/Sidebar.tsx`
  - agregar `produccion` a `NavItemKey`
  - crear sección `PRODUCCIÓN`
- `src/context/NavigationModulesContext.tsx`
  - agregar Producción a `MODULE_DEFINITIONS`
  - agregarlo a `DEFAULT_VISIBILITY`
- `src/components/DashboardShell.tsx`
  - montar `ProduccionPage`
  - mantener el patrón actual de estado compartido y navegación transversal
- `src/data/`
  - crear mocks dedicados de producción

No crear un mini-ERP aislado dentro del módulo. Producción debe consumir y enlazar conceptos existentes de Pedidos, Inventario, Mantenimiento, Calidad y Órdenes de Salida.

## Navegación propuesta

```text
RTM ERP
│
├── INICIO
├── INVENTARIO Y OPERACIONES
│   ├── Artículos
│   ├── Inventario
│   ├── Operaciones de Almacén
│   └── Órdenes de Salida
│
├── PRODUCCIÓN
│   └── Producción
│       ├── Dashboard
│       ├── Planeación
│       ├── Órdenes
│       ├── Piso
│       ├── Máquinas
│       └── Analítica
│
├── MANTENIMIENTO
├── COMPRAS
├── COMERCIAL
├── VENTAS BÁSICO
├── FINANZAS
├── NÓMINA & RH
└── SISTEMA
```

## Arquitectura de componentes

```text
src/
├── components/
│   ├── Produccion/
│   │   ├── ProduccionPage.tsx
│   │   ├── DashboardProduccion.tsx
│   │   ├── PlaneacionProduccion.tsx
│   │   ├── OrdenesProduccion.tsx
│   │   ├── OrdenProduccionDetail.tsx
│   │   ├── PisoProduccion.tsx
│   │   ├── MaquinasCapacidad.tsx
│   │   ├── AnaliticaProduccion.tsx
│   │   └── ReportarIncidenciaModal.tsx
│   ├── Sidebar.tsx
│   └── DashboardShell.tsx
│
└── data/
    └── mockProduccionData.ts
```

## Flujo transversal

```text
PEDIDO
   │
   ▼
ORDEN DE PRODUCCIÓN
   │
   ├── verifica stock PT
   ├── reserva materiales ──────────────► INVENTARIO
   ├── valida disponibilidad máquina ───► MANTENIMIENTO
   │
   ▼
PLANEACIÓN
   │
   ▼
PISO DE PRODUCCIÓN
   │
   ├── preparación
   ├── producción
   ├── incidencias
   ├── scrap
   └── tiempos
   │
   ▼
CALIDAD / LIBERACIÓN
   │
   ▼
PRODUCTO TERMINADO
   │
   ▼
INVENTARIO PT
   │
   ▼
ORDEN DE SALIDA
```

## 1. Dashboard
Debe mostrar en demo:

- OP activas
- OP en proceso
- OP detenidas
- cumplimiento del plan
- carga de planta por área
- alertas de material insuficiente
- órdenes detenidas
- máquinas próximas a saturación
- tabla de órdenes activas

Ejemplo:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ PRODUCCIÓN · Dashboard                         Hoy | Semana | Mes          │
│                                                                            │
│ 27 OP activas   8 En proceso   3 Detenidas   92.4% Cumplimiento          │
│                                                                            │
│ CARGA DE PLANTA                 ATENCIÓN REQUERIDA                         │
│ Offset       ████████ 82%       🔴 OP-95250 material insuficiente         │
│ Flexografía  ██████   67%       🟠 OP-95281 detenida 47 min               │
│ Acabados     █████████ 91%      🟠 Mark Andy 10 al 96%                    │
└────────────────────────────────────────────────────────────────────────────┘
```

## 2. Planeación
Vista tipo calendario/Gantt por máquina y semana.

Debe permitir visualmente:

- filtrar Offset / Flexografía / Todas
- ver ocupación semanal
- detectar sobrecarga
- mover órdenes en demo
- mostrar capacidad porcentual
- marcar órdenes sin material

Máquinas demo sugeridas:

### Offset
- Heidelberg Speedmaster
- Conserver 1–2
- Conserver 3–4
- DiDDE 860
- Conserver 8 colores
- Ryobi 1–2
- Guillotinas
- Dobladoras
- Muller Martini

### Flexografía
- Mark Andy 830 7"
- Mark Andy 830 10"
- Mark Andy Scout 10"
- Mark Andy 4120 17"
- Allied Gear
- BGM 1–4
- Rotoflex I / II

## 3. Órdenes de Producción
Tabla principal con:

- OP
- Pedido
- Cliente
- Artículo / número de parte
- Revisión
- Área
- Fecha compromiso
- Estado
- Avance

Estados demo:

- Planeada
- Lista para producir
- En preparación
- En proceso
- Detenida
- Pendiente de calidad
- Liberada
- Terminada

## 4. Detalle de OP
Es el corazón del módulo.

Debe mostrar:

- pedido origen
- cliente
- número de parte
- revisión
- cantidad solicitada
- stock PT comprometido
- cantidad a producir
- fecha compromiso
- prioridad
- routing completo
- materiales requeridos
- incidencias
- liberaciones de calidad
- historial

### Routing Offset demo

```text
IMPRESIÓN
   ↓
GUILLOTINA
   ↓
DOBLADO
   ↓
GRAPADO
   ↓
CALIDAD
   ↓
EMPAQUE
```

Ejemplo visual:

```text
✓ IMPRESIÓN       ✓ GUILLOTINA       ● DOBLADO       ○ GRAPADO
  Heidelberg        Guillotina 2       Stahl 2          Muller Martini
  08:13–09:42       10:02–10:37       En proceso
```

### Routing Flexo demo
En Flexografía varias operaciones pueden suceder dentro de una misma prensa.

```text
MARK ANDY SCOUT
 ├─ impresión
 ├─ barniz
 ├─ laminado
 └─ troquelado
        ↓
INSPECCIÓN / ROTOFLEX
        ↓
CALIDAD
        ↓
EMPAQUE
```

## 5. Materiales
En el detalle de OP mostrar:

```text
Material        Requerido     Reservado     Disponible     Estado
Papel 60 g      142 kg        142 kg        330 kg         ✓
Tinta negra     3.4 kg        3.4 kg        18 kg          ✓
Barniz UV       2.1 kg        0 kg          0.8 kg         ⚠ Falta
```

Reglas visuales demo:

- verde: suficiente
- amarillo: riesgo
- rojo: insuficiente
- mostrar posible sustituto autorizado de forma mock

## 6. Piso de Producción
Vista simplificada para tablet/operador.

Debe mostrar:

- máquina/estación
- operador
- turno
- siguiente trabajo
- cola de trabajos
- cantidad objetivo
- materiales
- herramental
- calidad inicial

Acciones grandes:

- Iniciar preparación
- Iniciar producción
- Pausar
- Reportar incidencia
- Terminar operación

Durante producción:

```text
Objetivo           2,850
Buenas             1,420
Scrap                 32
Tiempo estándar    01:30
Transcurrido       00:47
```

## 7. Incidencias y 4M
Modal rápido desde Piso:

- Máquina
- Material
- Mano de obra
- Método

Campos:

- categoría
- tipo de incidencia
- comentario
- inicio
- fin
- minutos perdidos
- detener tiempo productivo: sí/no

Todo es demo local, pero debe reflejarse inmediatamente en Dashboard y Analítica.

## 8. Máquinas y capacidad
No duplicar Mantenimiento.

Producción solo consume datos operativos:

- capacidad
- velocidad
- setup estándar
- compatibilidad
- carga semanal
- estado operativo
- próxima OP

Mantenimiento sigue administrando OT, preventivos, refacciones y fallas.

## 9. Analítica
Gráficas demo:

- cumplimiento plan vs real
- utilización por máquina
- capacidad por semana
- scrap por área
- tiempo perdido por 4M
- OP a tiempo vs retrasadas
- producción Offset vs Flexografía
- Pareto de incidencias

Incluir selector de periodo y botón Exportar a Excel. En demo ambos pueden mostrar banner/toast simulado.

## Mocks mínimos
Crear al menos:

- 16 máquinas/equipos
- 20 OP
- 8 clientes
- mezcla de Offset y Flexografía
- 4 OP detenidas o con alertas
- 5 incidencias 4M
- 3 OP terminadas
- 3 OP pendientes de calidad

Clientes demo sugeridos usando contexto RTM:

- Black & Decker
- TYCO
- Panasonic
- ILSCO
- Fresenius
- Pentair
- Entail Engine
- TRW

## Restricciones

- frontend/demo solamente
- no backend
- no API
- no migraciones
- no inventar un segundo design system
- reutilizar componentes, spacing, cards, badges, tablas y tokens existentes
- responsive
- no romper módulos existentes
- mantener navegación configurable actual

## Primera entrega recomendada
Implementar primero:

1. integración Sidebar + NavigationModulesContext + DashboardShell
2. `ProduccionPage`
3. Dashboard
4. Planeación
5. Órdenes
6. detalle de OP
7. Piso de Producción
8. mocks

Máquinas y Analítica pueden quedar funcionales visualmente dentro de la misma primera entrega si no comprometen estabilidad.

## Criterio de éxito del demo
En menos de 3 minutos debe poder contarse esta historia:

```text
Pedido recibido
→ OP generada
→ sistema valida materiales
→ planner programa máquina
→ operador ejecuta
→ surge incidencia
→ se registra tiempo perdido
→ continúa producción
→ calidad libera
→ trazabilidad completa visible
```

La experiencia debe hacer evidente que RTM deja de depender de Excel, memoria del planner y consultas manuales para saber dónde está una orden.