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

## 2. Planeación
Vista tipo calendario/Gantt por máquina y semana.

Debe permitir visualmente:

- filtrar Offset / Flexografía / Todas
- ver ocupación semanal
- detectar sobrecarga
- mover órdenes en demo
- mostrar capacidad porcentual
- marcar órdenes sin material

## 3. Órdenes de Producción
Tabla principal con OP, pedido, cliente, artículo/número de parte, revisión, área, fecha compromiso, estado y avance.

## 4. Detalle de OP
Es el corazón del módulo. Debe mostrar pedido origen, cliente, número de parte, revisión, cantidad solicitada, stock PT comprometido, cantidad a producir, fecha compromiso, prioridad, routing completo, materiales requeridos, incidencias, liberaciones de calidad e historial.

## 5. Materiales
Mostrar requerido, reservado, disponible y estado. Verde suficiente, amarillo riesgo, rojo insuficiente; posible sustituto autorizado en demo.

## 6. Piso de Producción
Vista simplificada para tablet/operador con máquina/estación, operador, turno, trabajo actual, cola, cantidad objetivo, materiales, herramental y calidad inicial. Acciones: Iniciar preparación, Iniciar producción, Pausar, Reportar incidencia, Terminar operación.

## 7. Incidencias y 4M
Categorías Máquina, Material, Mano de obra y Método; capturar tipo, comentario, inicio, fin y minutos perdidos.

## 8. Máquinas y capacidad
Producción consume capacidad, velocidad, setup estándar, compatibilidad, carga semanal, estado operativo y próxima OP. Mantenimiento sigue administrando OT, preventivos, refacciones y fallas.

## 9. Analítica
Cumplimiento plan vs real, utilización por máquina, capacidad por semana, scrap por área, tiempo perdido por 4M, OP a tiempo vs retrasadas, producción Offset vs Flexografía y Pareto de incidencias.

## Restricciones
- frontend/demo solamente
- no backend
- no API
- no migraciones
- reutilizar design system y patrones actuales
- responsive
- no romper módulos existentes
- mantener navegación configurable actual

## Criterio de éxito del demo
En menos de 3 minutos: Pedido recibido → OP generada → sistema valida materiales → planner programa máquina → operador ejecuta → surge incidencia → se registra tiempo perdido → continúa producción → calidad libera → trazabilidad completa visible.
