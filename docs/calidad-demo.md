# RTM Demo — Módulo de Calidad v2 (incluye Access real)

## Objetivo
Crear un módulo demo de **Calidad** integrado al ERP existente de RTM, enfocado en trazabilidad, liberaciones de primera pieza, auditorías por operación, auditoría final, material no conforme, evidencias, etiquetas, control de cambios y consulta en tiempo real.

El demo debe sentirse como parte natural de la plataforma actual. **No debe parecer un sistema independiente ni replicar visualmente Microsoft Access.** Debe consumir el lenguaje visual, componentes, navegación y theme del ERP actual.

## Fuentes funcionales usadas
Este plan se basa en los materiales reales entregados por RTM:

- Reunión de Calidad con Alicia Ramírez y Jorge Márquez (22-ago-2026).
- Reuniones previas con Mariana e Iván sobre producción, routing, lotes y trazabilidad.
- `Registro Auditoria Producto Terminado (2).pptx`.
- `Registro Inspección de Preimpresión.pptx`.
- `Modulos QA.docx`.
- Bases Access entregadas por RTM, usadas hoy para controles de Calidad/inspección.

## Hallazgos clave del Access real
El Access confirma que Calidad no es solamente una auditoría final. Existen controles separados y conceptos operativos que el demo debe representar:

- Auditoría final de producto terminado.
- Auditoría de muestras.
- Auditoría en proceso por tipo de operación.
- Controles específicos para:
  - corte;
  - doblado;
  - impresión;
  - impresión + troquel;
  - troquel;
  - intercalado/grapado;
  - conteo.
- Inspección de entrada / incoming.
- Herramentales y preimpresión.
- Movimiento y trazabilidad de lotes de insumos/tintas.
- Etiquetas de Bache, Parcial, Muestra y Caja.
- Etiquetas/estados de manufactura de Puesta a Punto, Conforme y No Conforme.
- Criterios de inspección distintos según proceso.
- Conceptos vinculados con Plan de Control.

### Regla de diseño funcional derivada
**No construir una auditoría genérica única.**

El sistema debe resolver el checklist de Calidad en función de la operación actual de la ruta de producción.

Ejemplo Offset:

```text
OP
│
├─ Preimpresión / Herramental
│
├─ Primera pieza
│
├─ Impresión
│    └─ Checklist QA de impresión
│
├─ Corte
│    └─ Checklist QA de corte
│
├─ Doblado
│    └─ Checklist QA de doblado
│
├─ Grapado / Intercalado
│    └─ Checklist QA de grapado
│
└─ Auditoría Final
     ├─ Bache / lote PT
     ├─ Muestreo
     └─ Etiquetas
```

Ejemplo Flexografía:

```text
OP
│
├─ Preimpresión / Herramental
├─ Primera pieza
├─ Impresión
├─ Impresión + Troquel       (cuando aplique)
├─ Troquel                   (cuando aplique)
├─ Rebobinado / acabado      (según routing)
└─ Auditoría Final
```

La ruta real de la OP decide qué gates/checklists aparecen.

---

# 1. Principio maestro de integración

Calidad debe funcionar como una **capa transversal sobre Producción**, no como un módulo desconectado.

```text
PEDIDO
  ↓
OP
  ↓
PREIMPRESIÓN / HERRAMENTAL
  ↓ QA
PRODUCCIÓN
  ├─ operación 1 → gate QA si aplica
  ├─ operación 2 → gate QA si aplica
  ├─ operación 3 → gate QA si aplica
  ↓
AUDITORÍA FINAL
  ↓
LOTE LIBERADO / HOLD
  ↓
INVENTARIO PT
  ↓
EMBARQUE
```

Cada evento debe conservar OP, pedido, cliente, artículo, revisión, máquina/estación, operador, auditor, fecha/hora, resultado, evidencia y lotes relacionados.

---

# 2. Navegación propuesta

```text
CALIDAD
│
├── Dashboard
├── Liberaciones
│   ├── Primera pieza
│   ├── En proceso
│   └── Auditoría final
├── Preimpresión / Herramentales
├── Material No Conforme
├── Trazabilidad 360°
├── Alertas y Desviaciones
├── Acciones Correctivas / ICAR
├── Control de Cambios
├── Requisitos de Cliente
├── Auditorías Internas
└── Metrología / Calibraciones
```

Para el demo, el flujo principal debe estar altamente pulido y los submódulos secundarios pueden usar mocks ricos.

---

# 3. Dashboard de Calidad

Debe ser accionable, no genérico.

KPIs principales:

- Pendientes QA.
- Primeras piezas pendientes.
- Auditorías en proceso pendientes.
- Auditorías finales pendientes.
- Material en Hold.
- Liberaciones conformes %.

Tabla `Requieren atención`:

- prioridad;
- OP;
- cliente;
- número de parte;
- revisión;
- línea;
- operación/evento;
- máquina;
- tiempo esperando;
- acción rápida.

Analítica:

- Pareto de defectos.
- Defectos por proceso.
- Defectos por cliente.
- Defectos por número de parte.
- Tendencia mensual.
- Liberaciones conformes vs rechazadas.
- Tiempo promedio de liberación.
- Material no conforme abierto.

Selector demo de periodo + botón Exportar siguiendo el mismo patrón visual de Requisiciones.

---

# 4. Centro de Liberaciones

Debe mostrar eventos QA disparados desde Producción.

Ejemplo:

```text
OP-95621 · Panasonic · PN-48201 Rev C
Flexografía · Mark Andy Scout 10"

✓ Preimpresión liberada
✓ Primera pieza
✓ Control > 2 horas
● Cambio de bobina        PENDIENTE QA
○ Auditoría final
```

Eventos que pueden provocar una nueva liberación:

- inicio de OP;
- primera pieza;
- cambio de placa;
- cambio de bobina;
- ajuste de máquina;
- corte eléctrico;
- cambio de turno;
- producción > 2 horas;
- evento configurado en Plan de Control/routing.

El evento siempre queda vinculado con la OP original.

---

# 5. Auditoría contextual por operación

Esta es una ampliación importante derivada de los Access reales.

Crear un motor demo de plantillas/checklists por operación.

## Impresión
Ejemplos de criterios:

- número de parte correcto;
- revisión correcta;
- texto legible/completo;
- colores conformes a OP;
- registro de impresión;
- manchas/defectos visibles;
- diseño coincide con aprobado;
- lote de tinta registrado.

## Corte

- ancho;
- largo;
- escuadra;
- tolerancias;
- orientación;
- identificación del material;
- cantidad.

## Doblado

- secuencia/paginado;
- orientación;
- medida final;
- doblez correcto;
- páginas completas;
- tolerancias.

## Grapado / Intercalado

- orden de páginas/signaturas;
- posición del grapado;
- número de grapas;
- firmeza;
- presentación final.

## Troquel / Impresión + Troquel

- número de parte/revisión;
- alineación impresión-troquel;
- tipo de corte;
- dimensiones;
- desprendimiento/liner;
- defectos visibles;
- repetición/repeat si aplica.

El demo debe mostrar que la UI cambia de checklist sin cambiar de sistema.

Estados por criterio:

- Sí / Conforme.
- No / No conforme.
- N/A.

Permitir:

- observación;
- evidencia/fotografía demo;
- defecto;
- cantidad detectada;
- responsable.

---

# 6. Primera pieza

Debe ser un gate visible de Producción.

Datos automáticos:

- OP;
- pedido;
- cliente;
- parte;
- revisión;
- proceso;
- máquina;
- operador;
- turno;
- lotes de materia prima/tintas;
- especificaciones aplicables.

Mostrar especificaciones con esperado, tolerancia y valor capturado.

Acciones:

- `Liberar primera pieza`.
- `Rechazar`.
- `Adjuntar evidencia` demo.
- `Registrar observación`.

Si no está liberada:

> Producción pendiente de liberación de Calidad.

No simular que la corrida masiva continúa sin ese gate.

---

# 7. Preimpresión / Herramentales

Modernizar funcionalmente lo que hoy existe en Access.

Datos:

- artículo;
- revisión;
- cliente;
- área;
- línea;
- tipo de herramienta;
- ubicación;
- dueño;
- estado.

Checklist basado en los controles reales mostrados por RTM:

- variables de medición dentro de tolerancia;
- paginado correcto;
- consecutivo de texto / idiomas;
- impresión legible;
- impresión completa;
- diseño coincide con archivo del cliente;
- texto coincide con herramienta;
- colores conforme a OP;
- revisión correcta;
- negativo/pantallas según aplique.

Agregar tabs estilo Requisiciones:

- Especificaciones.
- Registro de operación.
- Auditorías.
- Historial.

Acción principal: `Liberar herramental`.

---

# 8. Auditoría Final + Baches

No pedir al usuario recapturar datos que ya existen en OP.

Mostrar automáticamente:

- línea de producción;
- artículo;
- revisión;
- descripción;
- pedido;
- OP;
- cantidad pedida;
- cantidad producida;
- unidad de paquete;
- piezas por paquete;
- piezas por caja;
- total de cajas;
- lotes de insumo;
- origen del material/bache;
- stock vs pedido si aplica.

## Bache

El concepto de `Bache` del Access debe conservarse en demo como lote/sub-lote de producto terminado cuando aplique.

Cada bache:

- folio;
- cantidad;
- paquetes;
- parcial;
- origen;
- muestra calculada;
- auditor;
- estado;
- defectos.

---

# 9. Muestreo / AQL

El sistema demo debe calcular automáticamente el muestreo.

Mostrar:

- tamaño de lote;
- plan de muestreo;
- muestra requerida;
- piezas inspeccionadas;
- aceptación;
- rechazo.

No afirmar un estándar/tabla específica que RTM no haya confirmado en el demo; se puede mostrar como `Plan de muestreo configurado RTM (Demo)`.

Resultado final:

- Conforme.
- No Conforme.

---

# 10. Etiquetas

Al liberar, mostrar generación de etiquetas según contexto.

Tipos confirmados por su operación/Access:

- Bache.
- Parcial.
- Muestra.
- Caja.
- Identificación.

También representar estados de manufactura/calidad como Puesta a Punto, Conforme y No Conforme cuando aplique.

Botones demo:

- `Imprimir etiqueta Bache`.
- `Imprimir etiqueta Parcial`.
- `Imprimir etiqueta Caja`.
- `Imprimir etiqueta Muestra`.

Click → preview modal → toast:

> Etiqueta enviada a Zebra QA-02 · Demo

No implementar integración física de impresora.

---

# 11. Material No Conforme / HOLD

Si cualquier auditoría crítica resulta No Conforme:

```text
LOTE / BACHE EN HOLD
```

Debe quedar bloqueado visualmente para:

- liberación;
- inventario PT disponible;
- embarque.

Mostrar:

- folio MNC;
- OP;
- proceso donde se detectó;
- máquina;
- defecto;
- cantidad afectada;
- lote/bache;
- fotografías/evidencia demo;
- responsable;
- disposición.

Acciones demo:

- Reinspeccionar.
- Retrabajo.
- Scrap.
- Abrir acción correctiva.

---

# 12. Trazabilidad 360°

Debe ser uno de los principales momentos WOW.

Búsqueda por:

- OP;
- pedido;
- lote PT;
- bache;
- número de parte;
- lote de materia prima.

Visualizar árbol/timeline:

```text
LOTE PT-260907-00381
│
├── Cliente / Parte / Revisión
├── Pedido
├── OP
├── Routing ejecutado
│   ├── estación
│   ├── máquina
│   ├── operador
│   ├── entrada
│   └── salida
├── Insumos / lotes
├── Auditorías
│   ├── preimpresión
│   ├── primera pieza
│   ├── impresión
│   ├── corte/doblado/etc.
│   └── final
├── Baches / empaque
└── Liberación final
```

Botón demo: `Exportar expediente de trazabilidad`.

---

# 13. Control de cambios / Audit trail

Los registros aprobados no deben parecer editables sin historial.

Mostrar:

- antes;
- después;
- usuario;
- fecha/hora;
- motivo;
- aprobador;
- versión/revisión.

Ejemplo:

```text
Cantidad caja
20 → 24

Modificó: Jorge Márquez
Motivo: corrección de captura
Autorizó: Alicia Ramírez
```

---

# 14. Requisitos específicos de cliente

Ficha por cliente con requisitos QA aplicables.

Ejemplo demo Panasonic:

- trazabilidad de lotes;
- evidencia dimensional;
- primera pieza;
- retención de registros;
- PPAP para nuevo producto;
- requisitos adicionales configurados.

Cuando la OP tenga esos requisitos, mostrar:

> Esta orden tiene requisitos específicos de cliente aplicables.

---

# 15. Submódulos secundarios para demo

Deben existir navegables con data mock, sin construir backend completo:

- Alertas de Calidad.
- Desviaciones de Proceso.
- Acciones Correctivas / ICAR.
- Control de Cambios.
- Auditorías Internas.
- Metrología / Calibraciones.
- RMA / Quejas y devoluciones.

La prioridad sigue siendo el flujo de producto y trazabilidad.

---

# 16. Dos historias obligatorias del demo

## Caso A — Flexografía / Panasonic

```text
Pedido
→ OP Flexo
→ Preimpresión
→ Primera pieza
→ Impresión
→ Cambio de bobina genera nueva liberación
→ Auditoría en proceso contextual
→ Auditoría final / AQL
→ Bache conforme
→ Etiquetas
→ Lote PT
→ Trazabilidad 360°
```

Resultado: Conforme.

## Caso B — Offset / Black & Decker

```text
Pedido
→ OP Offset
→ Herramental / placa
→ Primera pieza
→ Impresión
→ Corte
→ Doblado
→ Grapado
→ QA detecta revisión incorrecta
→ No Conforme
→ HOLD
→ Material No Conforme
→ Acción correctiva demo
```

Resultado: No Conforme / bloqueado.

---

# 17. Arquitectura sugerida

```text
frontend/src/
├── components/
│   ├── Calidad/
│   │   ├── CalidadPage.tsx
│   │   ├── CalidadDashboard.tsx
│   │   ├── LiberacionesCalidad.tsx
│   │   ├── AuditoriaContextualModal.tsx
│   │   ├── PrimeraPiezaModal.tsx
│   │   ├── AuditoriaFinalModal.tsx
│   │   ├── PreimpresionHerramentales.tsx
│   │   ├── MaterialNoConforme.tsx
│   │   ├── TrazabilidadCalidad.tsx
│   │   ├── CalidadSecundarios.tsx
│   │   └── EtiquetaPreviewModal.tsx
│   ├── Sidebar.tsx
│   └── DashboardShell.tsx
│
└── data/
    └── mockCalidadData.ts
```

Puede ajustar nombres a la arquitectura real del repo después de auditarlo; no crear duplicados si ya hay componentes equivalentes.

---

# 18. Integración obligatoria con el repo

Antes de implementar:

1. Auditar `alvaro01`.
2. Leer `docs/design-system.md` completo.
3. Auditar Requisiciones como referencia UI/UX.
4. Revisar Producción actual para conectar OP/routing/calidad sin duplicar conceptos.
5. Revisar componentes comunes existentes antes de crear nuevos.

Integraciones probables:

- `Sidebar.tsx`: agregar sección/módulo Calidad.
- `NavigationModulesContext.tsx`: registrar Calidad, categoría y visibilidad.
- `DashboardShell.tsx`: montar `CalidadPage`.
- Producción: enlazar visualmente liberaciones/estados QA.

No romper navegación configurable existente.

---

# 19. Design System — OBLIGATORIO

**Calidad debe verse como Requisiciones.**

Referencia directa:

- `docs/design-system.md`.
- `frontend/src/components/Compras/Requisiciones/RequisicionesTab.tsx`.
- `frontend/src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`.
- `frontend/src/components/Compras/Requisiciones/RequisitionDetailModal.tsx`.
- `frontend/src/components/common/`.

Usar el mismo lenguaje:

- `bg-theme-surface`.
- `border-theme-subtle`.
- `text-theme-main`.
- `text-theme-muted`.
- `bg-theme-primary`.
- tabs compactas dentro de contenedor redondeado;
- cards `rounded-2xl/3xl`;
- headers ejecutivos;
- KPIs blancos con semántica por borde/icono;
- tablas limpias y densas;
- modales amplios tipo workspace;
- `font-mono` para OP, folios, lotes, métricas;
- toasts demo siguiendo el patrón de Requisiciones;
- responsive real.

### Prohibido

- inventar otro design system;
- copiar la apariencia del Access;
- fondos pastel saturados;
- cards completas verde/amarillo/rojo;
- botones gigantes sin jerarquía;
- módulos visualmente aislados;
- colores hardcodeados cuando existe token theme equivalente.

La semántica debe ir principalmente en borde, dot, icono y estado, conforme a `design-system.md`.

---

# 20. Restricciones técnicas del demo

- Frontend únicamente.
- Sin backend.
- Sin APIs nuevas.
- Sin migraciones.
- Datos mock coherentes con RTM.
- Estado local suficiente para interacciones demo.
- Todos los botones importantes deben responder.
- Acciones que no sean reales deben mostrar feedback demo; nunca botones muertos.
- No alterar módulos existentes innecesariamente.
- No crear otra rama: trabajar exclusivamente sobre `alvaro01`.

---

# 21. Criterio de éxito

En menos de 4 minutos debe poder demostrarse:

```text
OP activa
→ primera pieza pendiente
→ auditor libera
→ routing avanza
→ checklist cambia según operación
→ ocurre evento QA adicional
→ auditoría final calcula muestra
→ lote conforme genera bache + etiquetas
→ trazabilidad muestra todo el historial
```

Y luego abrir una segunda OP:

```text
Auditoría detecta defecto
→ No Conforme
→ HOLD
→ bloqueo de liberación
→ Material No Conforme
→ evidencia + trazabilidad
```

El cliente debe entender visualmente que el ERP reemplaza la fragmentación actual entre Producción, Access y controles manuales, conservando mayor granularidad y trazabilidad que el sistema actual.
