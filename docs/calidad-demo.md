# RTM Demo — Módulo de Calidad

## Objetivo
Crear un módulo demo de **Calidad** integrado al ERP existente de RTM, enfocado en demostrar trazabilidad, liberaciones de primera pieza, auditorías durante proceso, auditoría final, material no conforme, evidencias, control de cambios y consulta en tiempo real.

El demo debe sentirse como parte natural de la plataforma actual, no como un mini-sistema aislado. Debe enlazar visualmente con Producción, Inventario, Mantenimiento, Pedidos y Producto Terminado.

## Base funcional utilizada
Este plan se basa en los materiales entregados por RTM y las reuniones de exploración, principalmente:

- reunión de Calidad con **Alicia Ramírez** y **Jorge Márquez** del 22-ago-2026;
- `Registro Auditoria Producto Terminado (2).pptx`;
- `Registro Inspección de Preimpresión.pptx`;
- `Modulos QA.docx`;
- reuniones previas con Mariana e Iván sobre producción, routing, lotes y trazabilidad.

Puntos confirmados por RTM que deben verse reflejados:

- Calidad hoy está separada del ERP principal y usa Access, provocando un quiebre de trazabilidad.
- RTM busca alinearse/certificarse bajo IATF 16949 y necesita trazabilidad de orden, estación, fechas, usuario, estados e historial.
- Los registros no deben poder modificarse sin dejar evidencia de antes/después, usuario, fecha, hora y motivo.
- La liberación de **primera pieza** debe formar parte sistemática del proceso, no hacerse al final de la corrida.
- Calidad participa en diseño/preimpresión, primera pieza, auditorías durante proceso y liberación de producto terminado.
- Producto no conforme debe quedar bloqueado y pasar a un área de no conforme.
- La aprobación final habilita la impresión de etiquetas de identificación, parcial, batch y primera pieza.
- Existen requerimientos específicos por cliente, especialmente automotriz/médico; Panasonic fue mencionado explícitamente.

---

# 1. Auditoría del repo

La rama de trabajo existente es **`alvaro01`**. No crear otra rama.

Actualmente el repo ya contiene:

- `docs/design-system.md` como regla maestra de UI;
- módulo de Producción;
- módulo de Requisiciones con un patrón visual y de navegación que debe ser la principal referencia para Calidad;
- navegación configurable mediante `NavigationModulesContext`;
- estado compartido y navegación transversal en `DashboardShell`.

Para integrar Calidad correctamente se debe extender, sin romper lo existente:

- `frontend/src/components/Sidebar.tsx`
  - agregar `calidad` a `NavItemKey`;
  - crear sección **CALIDAD**;
  - usar icono Lucide consistente, por ejemplo `ShieldCheck` o `ClipboardCheck`.

- `frontend/src/context/NavigationModulesContext.tsx`
  - agregar definición de módulo Calidad;
  - agregar categoría `calidad` al union de categorías, o integrarla de forma limpia sin hacks;
  - agregar a `DEFAULT_VISIBILITY` con `true` para que se vea en demo.

- `frontend/src/components/DashboardShell.tsx`
  - importar y montar `CalidadPage`;
  - conservar el patrón actual de navegación transversal.

- `frontend/src/components/Calidad/`
  - crear componentes dedicados del módulo.

- `frontend/src/data/mockCalidadData.ts`
  - crear mocks ricos y coherentes con RTM.

No crear backend, APIs, base de datos, migraciones ni servicios externos.

---

# 2. Regla visual obligatoria

**Calidad DEBE seguir el mismo sistema visual de la plataforma y tomar Requisiciones como referencia directa.**

Antes de implementar, leer obligatoriamente:

- `docs/design-system.md`
- `frontend/src/components/Compras/Requisiciones/RequisicionesTab.tsx`
- `frontend/src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`
- `frontend/src/components/Compras/Requisiciones/RequisitionDetailModal.tsx`
- componentes compartidos de `frontend/src/components/common/`

Patrones que deben replicarse:

- header ejecutivo limpio;
- selector de periodo demo;
- botón Exportar con toast demo;
- sub-tabs segmentadas;
- tarjetas blancas `bg-theme-surface`;
- `rounded-2xl / rounded-3xl`;
- bordes semánticos, no fondos pastel completos;
- theme tokens (`bg-theme-surface`, `text-theme-main`, `text-theme-muted`, `border-theme-subtle`, `bg-theme-primary`);
- KPIs en tarjetas compactas;
- tablas densas pero legibles;
- modales grandes para detalle;
- estados con dot/borde semántico;
- Lucide icons;
- números/folios con tipografía mono cuando aplique;
- responsive y usable en laptop/tablet.

**Prohibido** crear una estética distinta, otro design system, cards con colores pastel saturados o un dashboard que parezca una app separada.

---

# 3. Navegación propuesta del módulo

Mantener pocas tabs principales para no saturar la UI, igual que Requisiciones:

```text
CALIDAD
│
├── Dashboard
├── Liberaciones
├── Trazabilidad
├── No conformes
└── Gestión SGC
    ├── Preimpresión / Herramentales
    ├── Alertas de Calidad
    ├── Desviaciones de Proceso
    ├── Acciones Correctivas / ICAR
    ├── Control de Cambios
    ├── Requisitos de Cliente
    ├── Auditorías Internas
    └── Metrología / Calibración
```

Para el demo, construir con mayor profundidad:

1. Dashboard
2. Liberaciones
3. Preimpresión / Herramentales
4. Auditoría final
5. No conformes
6. Trazabilidad
7. Requisitos específicos de cliente

El resto puede tener vistas demo ricas y navegables, sin intentar implementar todos los procesos reales.

---

# 4. Arquitectura sugerida

```text
frontend/src/
├── components/
│   ├── Calidad/
│   │   ├── CalidadPage.tsx
│   │   ├── CalidadDashboard.tsx
│   │   ├── LiberacionesCalidad.tsx
│   │   ├── LiberacionDetailModal.tsx
│   │   ├── PrimeraPiezaModal.tsx
│   │   ├── AuditoriaFinalModal.tsx
│   │   ├── PreimpresionHerramentales.tsx
│   │   ├── NoConformes.tsx
│   │   ├── NoConformeDetailModal.tsx
│   │   ├── TrazabilidadCalidad.tsx
│   │   ├── RequisitosCliente.tsx
│   │   ├── GestionSgc.tsx
│   │   └── QualityStatusBadge.tsx
│   └── ...
│
└── data/
    └── mockCalidadData.ts
```

No es obligatorio usar exactamente estos nombres si la arquitectura actual recomienda otra cosa, pero conservar separación clara y reusable.

---

# 5. Dashboard de Calidad

El dashboard debe parecer hermano del `RequisicionesDashboard`.

## Header

Título sugerido:

**Dashboard de Calidad y Liberaciones**

Subtítulo:

> Seguimiento en tiempo real de liberaciones, auditorías, producto no conforme y trazabilidad de órdenes.

Controles:

- 7 días
- 4 semanas
- Mes actual
- Exportar

Exportar no necesita archivo real: mostrar toast tipo Requisiciones:

> Reporte de Calidad generado correctamente (Demo).

## KPIs principales

Ejemplo:

- Pendientes QA
- Primera pieza pendiente
- Auditorías finales pendientes
- Material en Hold

KPIs secundarios:

- % liberaciones conformes
- tiempo promedio de liberación
- auditorías realizadas hoy
- acciones vencidas

## Atención requerida

Tabla/card de órdenes:

- prioridad
- OP
- cliente
- número de parte
- revisión
- línea
- evento QA
- tiempo esperando
- responsable
- acción `Revisar`

## Analítica demo

- Pareto de defectos
- defectos por línea
- defectos por cliente
- auditorías aprobadas vs rechazadas
- tendencia mensual
- cumplimiento de liberaciones

Usar visualizaciones simples consistentes con Requisiciones; no introducir una librería nueva si no hace falta.

---

# 6. Centro de Liberaciones — corazón del módulo

La idea principal del demo es que Producción genere eventos de Calidad y Calidad funcione como **gate** de liberación.

Cada OP debe mostrar una ruta visual:

```text
Pedido
  ✓ Preimpresión
  ✓ Material surtido
  ● Primera pieza      <- Calidad requerida
  ○ Producción
  ○ Auditoría final
  ○ Producto liberado
  ○ Producto terminado
```

La ruta debe ser entendible de inmediato.

## Eventos que deben generar una liberación QA

Según los documentos de RTM:

- inicio de nueva OP;
- cambio de placas;
- cambio de bobina;
- corte de energía;
- ajuste de máquina;
- producción mayor a dos horas;
- cambio de turno;
- liberación de producto terminado;
- auditoría solicitada por Servicio al Cliente.

Para demo no es necesario que Producción realmente emita eventos; se pueden simular con mocks, pero deben estar ligados a la OP.

Ejemplo de historial:

```text
08:14  Primera pieza        Conforme
10:19  Control > 2 horas    Conforme
11:43  Cambio de bobina     Conforme
13:52  Cambio de turno      Pendiente
```

Estados sugeridos:

- Pendiente
- En inspección
- Conforme
- No conforme
- Liberado
- Hold

---

# 7. Primera pieza

Al abrir una liberación de primera pieza, el modal debe mostrar datos automáticos de la OP:

- OP
- pedido
- cliente
- artículo / número de parte
- revisión
- línea
- máquina
- operador
- turno
- lotes de insumos
- fecha/hora

Después mostrar especificaciones del artículo contra resultado medido.

Ejemplo visual:

```text
Ancho          Especificación 4.000 in ±0.010   Medido 4.003   ✓
Largo          Especificación 6.500 in ±0.010   Medido 6.497   ✓
Color          PMS esperado                        Conforme   ✓
Texto          Revisión vigente                    Conforme   ✓
Troquelado     Kiss-cut                            Conforme   ✓
```

Acciones:

- Conforme
- No conforme
- Agregar observación
- Adjuntar evidencia demo
- Tomar/agregar fotografía demo

Si está pendiente:

> La orden requiere liberación de primera pieza antes de continuar.

No se necesita bloqueo técnico real entre módulos; basta con mostrar el estado visual y simular la transición.

---

# 8. Preimpresión y Herramentales

RTM actualmente audita formas impresas/herramentales antes de producción.

Crear una vista de historial con:

- folio
- fecha
- número de parte
- revisión
- cliente
- área (Offset/Flexografía)
- localización
- tipo de herramienta
- dueño
- estado
- defecto

Al abrir el detalle, convertir el viejo formulario de Access en checklist moderno.

Criterios mostrados por RTM:

1. variables de medición dentro de tolerancia;
2. paginado correcto;
3. consecutivo de texto / idiomas correcto;
4. impresión legible;
5. impresión completa;
6. diseño del cliente coincide con herramienta;
7. texto del cliente coincide con herramienta;
8. colores conformes a la OP;
9. revisión correcta;
10. negativo 100% negro cuando aplique;
11. pantallas de imágenes adecuadas para impresión en placa cuando aplique.

Cada criterio puede marcarse:

- Sí
- No
- N/A

Agregar:

- tiempo invertido;
- auditor;
- fecha/hora;
- observaciones;
- estatus.

---

# 9. Auditoría Final

No pedir al usuario volver a capturar toda la OP. El valor del demo es que los datos ya vengan ligados.

Campos visibles:

- línea de producción
- número de parte / revisión
- descripción
- pedido
- OP
- cantidad pedida
- cantidad producida
- cantidad inspeccionada
- cantidad liberada
- cantidad rechazada
- unidad de empaque
- cantidad por paquete/rollo
- cantidad por caja
- lotes de insumos
- stock, cuando aplique

## Caso demo basado en pantalla real de RTM

Usar como uno de los ejemplos:

- Línea: Flexografía
- Artículo: `526412 | G |`
- Pedido: `86,153`
- OP: `95,250`
- Cantidad pedida: `150`
- Cantidad a producir: `145`
- Unidad: Rollos
- lote de papel: `RT031026-024-815`
- muestra mostrada por Access: `3`

No es necesario que todos los números sean idénticos en toda la plataforma si ya existe mock maestro, pero conservar la lógica y el vocabulario de RTM.

## Muestreo / AQL

Los documentos solicitan cálculo automático de:

- tamaño de muestra;
- cantidad a inspeccionar;
- criterio de aceptación/rechazo.

**Importante:** los materiales entregados no especifican la tabla/estándar exacto para calcular AQL. Por lo tanto:

- NO implementar ni afirmar un motor AQL normativo real;
- usar un cálculo/mapping demo claramente identificado como `Demo`;
- dejar la UI preparada para que una futura versión conecte las reglas reales;
- preferir el ejemplo confirmado de Access (145 -> muestra 3) para evitar inventar normatividad.

## Criterios de inspección

Registrar visualmente:

- defecto
- clasificación
- cantidad encontrada
- resultado
- observación
- evidencia/foto demo

Resultado final:

- Conforme
- No conforme

---

# 10. Liberación de lote y etiquetas

Cuando una auditoría final queda conforme:

```text
✓ Auditoría aprobada
✓ Lote de producto terminado liberado
✓ Disponible para Almacén de Producto Terminado
✓ Trazabilidad registrada
✓ Etiquetas disponibles
```

Mostrar botones:

- Identificación — FM-QA-153
- Parcial — FM-QA-154
- Batch — FM-QA-155
- Primera Pieza — FM-QA-172

No integrar impresora real.

Al presionar imprimir:

1. mostrar preview de etiqueta;
2. mostrar toast demo tipo:
   `Etiqueta enviada a impresión (Demo)`.

Jorge explicó que las etiquetas se imprimen al final una vez que Calidad libera el producto y se colocan en caja/paquete según aplique.

---

# 11. Material No Conforme

Si una auditoría falla:

- cambiar estado del lote a `Hold / No Conforme`;
- mostrar banner rojo semántico;
- impedir visualmente `Liberar producto`;
- crear un registro demo de material no conforme;
- relacionarlo con OP, lote, defecto y auditoría origen.

RTM indicó que cada área tiene físicamente un área de no conforme; el demo debe hacer visible esa ubicación lógica.

Detalle sugerido:

```text
MNC-000348
OP-95632
Área: Flexografía
Ubicación: No Conforme / Flexografía
Motivo: Revisión incorrecta
Cantidad afectada: 145 rollos
```

Acciones demo:

- Reinspeccionar
- Enviar a retrabajo
- Scrap
- Abrir Acción Correctiva

No es necesario ejecutar flujos reales externos.

---

# 12. Trazabilidad 360°

Este debe ser uno de los momentos WOW del demo.

Buscador por:

- OP
- lote PT
- pedido
- número de parte
- cliente

Resultado tipo árbol/timeline:

```text
LOTE PT-260907-00381
│
├── Cliente / parte / revisión
├── Pedido
├── OP
│
├── PRODUCCIÓN
│   ├── ruta
│   ├── máquina
│   ├── operador
│   └── entradas/salidas por estación
│
├── INSUMOS
│   ├── lote de papel/sustrato
│   ├── lote de tinta
│   └── otros lotes
│
├── CALIDAD
│   ├── preimpresión
│   ├── primera pieza
│   ├── controles durante proceso
│   └── auditoría final
│
├── EMPAQUE
│
└── LIBERACIÓN
    ├── auditor
    ├── fecha/hora
    └── resultado
```

Botón:

**Exportar expediente de trazabilidad**

Solo debe mostrar toast/banner demo, no hace falta generar archivo en esta fase.

La trazabilidad debe incluir orden, estación, entrada/salida, usuario, estado e historial, tal como pidió Alicia.

---

# 13. Changelog / integridad de registros

Un registro de Calidad ya liberado no debe parecer editable libremente.

Agregar historial tipo:

```text
14:48 Alicia Ramírez
Auditoría aprobada

15:02 Jorge Márquez
Solicitud de corrección
Cantidad caja: 20 -> 24
Motivo: Error de captura

15:04 Alicia Ramírez
Corrección autorizada
```

Cada corrección debe mostrar visualmente:

- campo anterior;
- valor nuevo;
- usuario;
- fecha/hora;
- motivo;
- aprobador cuando aplique.

No hace falta implementar permisos reales, pero el demo debe comunicar control y auditoría.

---

# 14. Requisitos específicos de cliente

Crear una vista demo porque Alicia pidió explícitamente poder saber por cliente:

- qué requisito existe;
- qué áreas son responsables;
- si se está cumpliendo;
- qué falta.

Ejemplo hero:

**Panasonic**

- trazabilidad de lotes;
- liberación de primera pieza;
- evidencia dimensional;
- retención de registros;
- PPAP / dimensionales para producto nuevo cuando aplique;
- responsables por área;
- estado de cumplimiento.

Al abrir una OP de un cliente con requisitos:

> Este pedido tiene requisitos específicos de cliente aplicables.

Mostrar checklist demo y evidencia ligada.

No convertir esto en una implementación formal de IATF/PPAP; el objetivo es demostrar control sistemático.

---

# 15. Gestión SGC — vistas demo navegables

Crear cards/entradas coherentes para mostrar amplitud del módulo:

## Alertas de Calidad
- activas
- vencidas
- próximas a vencer
- por cliente/proceso

## Desviaciones de Proceso
- interna/externa
- clasificación 4M
- 5 Porqués
- contención
- correctivas
- evidencias

## Acciones Correctivas / ICAR
- abierta
- contención
- causa raíz
- acción
- eficacia
- cierre

## Control de Cambios
- solicitud
- riesgos
- aprobaciones
- documentos afectados
- autorización cliente cuando aplique
- implementación
- primer lote

## Auditorías Internas
- calendario
- programadas
- ejecutadas
- hallazgos
- acciones

## Metrología
- equipos activos
- próximos a vencer
- vencidos
- certificados
- calendario

Estas vistas pueden usar mocks y modales; no intentar construir toda la lógica real para el demo.

---

# 16. Datos demo recomendados

Crear datos suficientemente ricos para que todas las vistas se vean vivas.

## Caso héroe A — Flexografía conforme

Basado en el caso mostrado por Jorge:

- Flexografía
- artículo `526412 | G |`
- pedido `86,153`
- OP `95,250`
- 145 rollos a producir
- lote de papel `RT031026-024-815`
- primera pieza conforme
- evento de control por cambio de bobina
- auditoría final conforme
- etiquetas disponibles
- trazabilidad completa

## Caso héroe B — Offset con hallazgo

Usar cliente/parte coherente con los datos entregados por RTM, por ejemplo:

- Black & Decker
- Offset
- preimpresión / placa
- revisión incorrecta o criterio de herramienta rechazado
- se genera No Conforme
- lote queda en Hold
- aparece acción correctiva demo

Además sembrar:

- 10-15 liberaciones;
- 4-6 auditorías finales;
- 3 no conformes;
- 6-8 eventos de trazabilidad por OP;
- varios defectos para Pareto;
- al menos 3 clientes (Panasonic, Black & Decker y otro de los datos existentes RTM).

---

# 17. Integración visual con Producción

Calidad no debe duplicar Producción.

Producción administra:

- planeación;
- routing;
- máquinas;
- ejecución;
- incidencias;
- cantidades;
- tiempos;
- scrap.

Calidad consume visualmente:

- OP;
- estación actual;
- evento QA;
- lote;
- especificación;
- operador;
- máquina;
- evidencia;
- resultado de liberación.

En el detalle de Calidad debe existir link/botón demo:

`Ver Orden de Producción`

Y en Producción puede existir estado:

`Esperando Calidad`

No hace falta compartir estado global real si complica el demo; el comportamiento puede ser mock coherente.

---

# 18. Restricciones técnicas del demo

- trabajar únicamente en **`alvaro01`**;
- no crear ramas nuevas;
- frontend/demo solamente;
- no backend;
- no APIs;
- no migraciones;
- no agregar dependencias innecesarias;
- no romper módulos existentes;
- conservar navegación configurable;
- usar datos mock dedicados;
- responsive;
- respetar theme dinámico;
- reutilizar primitives comunes cuando existan;
- no duplicar componentes que ya existen en `common`;
- no declarar cumplimiento normativo real de AQL/IATF que los documentos no definan con detalle.

---

# 19. Criterio de éxito del demo

En menos de 4 minutos debe poder mostrarse esta historia:

```text
OP de Flexografía
  -> aparece pendiente de Primera Pieza
  -> Calidad inspecciona y libera
  -> producción continúa
  -> se registra evento por cambio de bobina
  -> auditoría final
  -> lote conforme
  -> preview de etiquetas
  -> Trazabilidad 360°

OP de Offset
  -> preimpresión / herramental
  -> criterio falla
  -> Material No Conforme
  -> Hold
  -> no puede liberarse
  -> queda historial/changelog
```

El objetivo visual es que RTM vea inmediatamente la diferencia entre su Access actual y una plataforma integrada: **menos captura duplicada, gates claros, trazabilidad completa, historial auditable y datos de Calidad en tiempo real**.
