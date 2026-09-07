# RTM Demo — 5/5 Bitácora Global & Trazabilidad de Cambios

## Objetivo

Cerrar el bloque de refinamiento del demo con una vista transversal, humana y elegante para responder:

- ¿qué pasó?
- ¿quién lo hizo?
- ¿cuándo ocurrió?
- ¿en qué módulo?
- ¿sobre qué documento, orden, lote, empleado o proveedor?
- ¿qué cambió exactamente?
- ¿por qué se cambió?
- ¿de dónde viene y a dónde puedo ir para revisarlo?

No se busca construir un backend de ciberseguridad ni un visor técnico de logs. En el demo debe sentirse como una **Bitácora del sistema para supervisores, calidad, finanzas y administración**.

## Ubicación propuesta

No crear otro módulo operativo grande. Agregar acceso en **Sistema** como:

**Bitácora & cambios**

Nombre visible recomendado en pantalla:

> **Bitácora del sistema**
> Consulta cambios importantes, aprobaciones y movimientos realizados en la plataforma.

Evitar wording técnico tipo:
- event_id
- payload
- mutation
- diff JSON
- actor_id
- request log

## Reutilizar lo que ya existe

El demo ya guarda trazabilidad local en varios módulos. No duplicar ni inventar una segunda realidad.

Fuentes a reutilizar/normalizar visualmente:

- Producción: `ProductionOrder.traceability`
- Nómina: `PayrollAuditEntry`
- Proveedores: `SupplierTimelineEntry`
- Calidad/SGC: audit trail y eventos de liberación, desviación, ICAR, control documental, RMA cuando estén disponibles
- Compras/Requisiciones: cambios de estado, autorizaciones y generación de OC
- Ventas/CRM: actividades, cambio de etapa, cotización, pedido y autorizaciones
- Finanzas: timbrado demo, pagos, cierre y reapertura cuando existan eventos reales en estado
- Mantenimiento: creación/cambio/cierre de OT y consumo de refacciones

Para el demo se puede crear un **selector/normalizador de eventos** que lea estas colecciones y produzca una vista común, pero sin duplicar los objetos de negocio.

## Pantalla principal

### Header

**Bitácora del sistema**

Texto:

> Historial de cambios, aprobaciones y movimientos relevantes realizados en RTM.

Filtros superiores:

- Hoy
- 7 días
- 30 días
- 90 días
- Usuario
- Área / módulo
- Tipo de acción
- Buscar por folio, OP, documento, cliente, proveedor o empleado

Botón secundario:

- `Exportar bitácora` → demo honesto con toast si no existe exportación real

## KPIs superiores

Máximo 5, discretos:

- Movimientos registrados
- Aprobaciones
- Cambios de estado
- Ajustes con motivo
- Eventos que requieren atención

No usar números gigantes sin contexto.

## Vista principal — Timeline premium

La vista por defecto debe ser un timeline cronológico, no una tabla fea.

Ejemplo:

```text
09:36
Alicia Ramírez · Calidad
Liberó primera pieza
OP-2026-95250 · Panasonic · 526412 Rev G
Producción autorizada para continuar
[ Ver OP ] [ Ver auditoría ]

09:18
Planner RTM · Producción
Reprogramó una orden
OP-2026-95252
Mark Andy 830 10” → Mark Andy Scout 10”
Motivo: nivelación de carga en planta
[ Ver orden ]

08:54
Paola Jiménez · Nómina
Reabrió periodo de nómina
SEM-2026-36
Motivo: corrección de horas adicionales
[ Ver periodo ]
```

Cada evento debe mostrar:

- hora/fecha
- persona
- área
- acción en lenguaje natural
- referencia principal
- resumen del cambio
- motivo, si existe
- CTA al origen, si el módulo lo permite

## Vista alterna — Por módulo

Toggle:

- `Cronología`
- `Por módulo`

Agrupar por:

- Producción
- Calidad
- Inventario / Almacén
- Compras
- Comercial / Ventas
- Finanzas
- Nómina / RH
- Mantenimiento
- Sistema

Mostrar conteo y últimos movimientos.

## Detalle de evento

Al hacer clic en un evento abrir drawer/modal elegante:

### Encabezado

- acción
- persona
- fecha/hora
- módulo
- referencia

### Qué cambió

Cuando exista estado anterior/nuevo, mostrar comparación humana:

```text
Estado de la OP
Antes: Pendiente de calidad
Ahora: Liberada
```

```text
Máquina asignada
Antes: Mark Andy 830 10”
Ahora: Mark Andy Scout 10”
```

No mostrar JSON.

### Motivo

Mostrar motivo cuando exista y destacarlo especialmente en:

- rechazos
- reaperturas
- cancelaciones
- reprogramaciones
- cambios de revisión
- HOLD / liberación
- ajustes manuales

### Relacionado con

Chips/tarjetas compactas:

- OP
- Pedido
- Auditoría
- RMA
- OC
- Requisición
- Factura
- Empleado
- OT mantenimiento

Sólo si existe una relación real en el demo.

## Eventos que vale la pena incluir

### Producción
- OP creada
- OP reprogramada
- material surtido
- hoja de OP impresa/reimpresa
- inicio de producción
- incidencia/parada
- operación completada
- solicitud de auditoría final

### Calidad
- primera pieza solicitada
- primera pieza liberada/rechazada
- auditoría final
- HOLD
- MNC
- ICAR
- RMA
- cambio documental/revisión
- PPAP actualizado/aprobado

### Inventario / almacén
- recepción
- acomodo
- surtido
- transferencia
- conteo/ajuste
- devolución/remanente
- reimpresión de etiqueta

### Compras
- requisición creada/enviada/autorizada
- OC creada
- OC actualizada
- entrega parcial/recepción

### CRM / Ventas
- prospecto creado
- oportunidad cambia de etapa
- actividad comercial
- cotización creada
- cotización convertida a pedido
- pedido autorizado/rechazado

### Finanzas
- factura timbrada demo
- CxC creada
- pago registrado
- periodo/cierre contable actualizado

### Nómina
- horas capturadas
- incidencia autorizada/rechazada
- periodo cerrado
- periodo reabierto
- timbrado demo
- vacaciones/préstamos cuando exista evento real

### Mantenimiento
- OT creada
- máquina detenida
- refacción solicitada/consumida
- OT terminada
- máquina regresa a operativo

## Bloque morado — Sugerencias del sistema

No debe ser protagonista ni parecer IA mágica.

Ejemplos:

**Sugerencia del sistema**

> Se registraron 4 reprogramaciones de órdenes en la misma máquina durante los últimos 7 días. Puede valer la pena revisar la carga de Mark Andy 830 10”.

CTA:
- `Ver movimientos relacionados`

Otro:

> Dos periodos de nómina fueron reabiertos después del cierre este mes. Revisa los motivos para identificar si existe un patrón de captura tardía.

Siempre explicar el porqué de la sugerencia.

## Diseño / UX

Debe sentirse como una pantalla enterprise premium:

- `max-w-[1520px]`
- tarjetas blancas/theme-surface
- `rounded-3xl`
- jerarquía visual clara
- íconos por módulo
- colores semánticos en bordes, dots e iconos, no fondos saturados
- referencias/folios en `font-mono`
- timeline limpio con mucho aire
- filtros compactos
- responsive móvil/tablet

Referencias visuales directas:

- Inventario Dashboard / Analítica
- Requisiciones
- CRM enterprise
- Piso QA
- `docs/design-system.md`

## Arquitectura sugerida

```text
src/components/System/
├── SystemAuditTrailPage.tsx
├── AuditTimeline.tsx
├── AuditEventDetailDrawer.tsx
├── AuditTrailFilters.tsx
├── AuditModuleSummary.tsx
└── auditTrailSelectors.ts
```

Si la arquitectura actual de Sistema/Configuración sugiere otra ubicación, respetarla.

Crear un normalizador único, por ejemplo:

```ts
interface GlobalAuditEvent {
  id: string;
  occurredAt: string;
  user: string;
  module: string;
  action: string;
  reference?: string;
  description: string;
  reason?: string;
  severity?: 'info' | 'success' | 'warning' | 'danger';
  before?: { label: string; value: string }[];
  after?: { label: string; value: string }[];
  related?: { type: string; id: string; label: string }[];
}
```

Este tipo es sólo para presentación agregada. No reemplazar los modelos originales.

## No hacer

- no crear un “Security Log” técnico
- no mostrar IPs, tokens, payloads o JSON
- no inventar autenticaciones que no existen
- no fingir persistencia backend
- no duplicar los timelines locales
- no meter 200 eventos sin jerarquía
- no usar una tabla gigante como vista principal
- no agregar botones que no hagan nada
- no decir “IA detectó” para reglas demo

## Demo de 90 segundos

1. Abrir Bitácora del sistema.
2. Filtrar `Calidad`.
3. Mostrar liberación de primera pieza.
4. Abrir detalle y enseñar antes/ahora + motivo + OP relacionada.
5. Cambiar a `Nómina` y mostrar reapertura con justificación.
6. Mostrar sugerencia morada de patrón.
7. Ir al documento origen.

Mensaje comercial:

> “No sólo vemos el estado actual; también podemos saber quién hizo qué, cuándo y por qué, y regresar al documento que originó el cambio.”

## Progreso del bloque

- 1/5 Trazabilidad 360 — encolado/implementación
- 2/5 MRP / Planeación de Materiales — encolado/implementación
- 3/5 PPAP / Core Tools — encolado/implementación
- 4/5 Competencias & Capacitación — encolado/implementación
- **5/5 Bitácora Global & Trazabilidad de Cambios — este documento**

Con esto queda cerrado el bloque de cinco refinamientos adicionales planeados para el demo.
