# RTM Demo — Calidad v4 · Cierre de la “cartita de Santa” de Alicia

## Objetivo

Cerrar los huecos que todavía existen entre la implementación actual de **Calidad** y lo que Alicia Ramírez pidió durante la reunión de exploración, complementado con lo que Jorge Márquez mostró en Access y con los documentos entregados por RTM.

La narrativa de demo debe ser operativa y clara:

> **Calidad ve qué tiene pendiente, genera o abre una auditoría/captura, inspecciona o mide, emite un dictamen y ese resultado afecta Producción, Inventario, Producto Terminado, HOLD, trazabilidad y acciones correctivas.**

Este documento es un **refinamiento incremental** sobre:

- `docs/calidad-demo.md`
- `docs/calidad-demo-v3-refinamiento.md`
- implementación actual en `alvaro01`

No rehacer el módulo desde cero.

---

# 1. Fuentes funcionales

Este cierre se basa en:

- reunión de Calidad con Alicia Ramírez y Jorge Márquez;
- bases Access entregadas por RTM;
- `Modulos QA.docx`;
- `Registro Auditoria Producto Terminado (2).pptx`;
- `Registro Inspección de Preimpresión.pptx`;
- operación de Producción ya implementada en el repo.

Nota: Alicia mencionó durante la reunión que había compartido una lista de aproximadamente 40 puntos básicos. No se encontró en los archivos disponibles un documento separado inequívocamente identificable como esa lista. No afirmar que `Modulos QA.docx` sea exactamente esa lista; usar únicamente lo confirmado por los materiales disponibles.

---

# 2. Qué ya está bien y se conserva

La implementación actual ya cubre una base importante:

- módulo Calidad integrado al Sidebar;
- Dashboard QA;
- Centro de Liberaciones;
- primera pieza;
- auditoría final demo;
- Material No Conforme / HOLD;
- trazabilidad;
- preimpresión / herramentales;
- etiquetas demo;
- historial;
- relación con OP, pedido, cliente, artículo, revisión, línea y lote;
- eventos de QA por cambio de bobina, turno, ajuste y producción > 2 horas;
- Producción con routing, incidencias 4M y tiempos;
- Design System actual.

No duplicar ni sustituir esto; **refinarlo**.

---

# 3. P0 — Producción NO puede auto-liberarse por Calidad

Este punto es obligatorio.

Hoy Producción todavía permite acciones equivalentes a:

- `Liberar 1ra Pieza`;
- `Liberar por Calidad y Pasar a Producto Terminado`.

Eso rompe la narrativa y el control que Alicia pidió.

## Producción puede

- `Solicitar auditoría QA`;
- `Confirmar pieza lista para revisión`;
- `Ver auditoría`;
- `Ver estatus QA`.

## Solo Calidad puede

- aprobar primera pieza;
- rechazar primera pieza;
- aprobar auditoría de proceso;
- liberar producto terminado;
- mandar a HOLD;
- liberar Material No Conforme después de reinspección cuando aplique.

## Estado compartido obligatorio

```text
Calidad aprueba Primera Pieza
→ Producción cambia a En proceso

Calidad rechaza
→ Producción queda bloqueada / HOLD

Calidad libera auditoría final
→ OP Liberada
→ Producto Terminado disponible

Calidad rechaza auditoría final
→ MNC + HOLD
→ PT no disponible
```

No mantener estados contradictorios entre Producción y Calidad.

---

# 4. P0 — Dashboard de Calidad debe contestar “¿qué tengo que hacer?”

El Dashboard debe ser accionable, no solamente analítico.

## KPIs

- Auditorías pendientes.
- Capturas pendientes hoy.
- Capturas vencidas.
- Primeras piezas pendientes.
- Auditorías de proceso pendientes.
- Auditorías finales pendientes.
- Material en HOLD.
- Desviaciones activas.

## Bloque principal: `Pendiente de mi atención`

Ejemplo:

```text
10:00  Temperatura cuarto adhesivos       VENCIDA      [Capturar]
10:15  OP-95250 · Primera pieza Flexo     PENDIENTE    [Auditar]
10:40  OP-95252 · Control > 2 horas       PENDIENTE    [Auditar]
11:00  Incoming · Bobina Avery            PENDIENTE    [Inspeccionar]
11:30  Herramental · Placa B&D            PENDIENTE    [Auditar]
11:45  OP-95254 · Ruta fuera de secuencia ALERTA        [Revisar]
```

Cada fila debe tener CTA real.

---

# 5. Captura — controles periódicos y mediciones

Mantener el módulo `Captura` del v3 y hacerlo visible como herramienta diaria.

## Controles demo

- temperatura de cuarto/material con adhesivo;
- humedad de almacenamiento sensible;
- validación de remanente antes de reutilizar;
- controles periódicos configurables.

RTM sí confirmó monitoreo manual de temperatura de material/área controlada. El intervalo exacto no fue confirmado. Cualquier frecuencia concreta debe indicar **Demo configurable**.

## Modal de captura

- control;
- ubicación;
- fecha/hora;
- responsable;
- valor;
- unidad;
- rango mínimo/máximo;
- instrumento;
- calibración vigente;
- observación;
- evidencia demo.

Resultado automático:

- Conforme.
- Fuera de rango.

Fuera de rango debe ofrecer:

- `Guardar y generar alerta`;
- `Abrir desviación`.

---

# 6. Auditorías — workspace operativo

Debe existir CTA global:

`+ Nueva auditoría`

## Tipos

- Primera pieza.
- Proceso / operación.
- Producto terminado.
- Incoming / materia prima.
- Preimpresión / herramental.
- Material / remanente.
- Auditoría interna SGC.

## Flujo

```text
Nueva auditoría
→ seleccionar tipo/origen
→ cargar contexto
→ cargar checklist
→ capturar resultados
→ dictamen
→ liberar / HOLD / MNC / ICAR
```

Permitir `Guardar borrador`.

---

# 7. Auditoría por operación REAL, no por área genérica

La implementación actual usa checklists por `Offset`, `Flexografía` y `Acabados`.

Debe refinarse para resolver por operación/routing.

## Impresión

- número de parte;
- revisión;
- texto;
- color;
- registro;
- manchas;
- diseño vs aprobado;
- lote de tinta.

## Corte

- ancho;
- largo;
- escuadra;
- orientación;
- tolerancia;
- cantidad.

## Doblado

- paginado;
- secuencia;
- orientación;
- medida final;
- doblez;
- páginas completas.

## Intercalado / Grapado

- orden de páginas/signaturas;
- posición de grapa;
- número de grapas;
- firmeza;
- presentación.

## Impresión + Troquel

- registro impresión/troquel;
- dimensiones;
- tipo de corte;
- liner;
- repetición;
- defectos visibles.

## Conteo / Rebobinado

- cantidad;
- orientación;
- presentación/tensión;
- identificación;
- rollo/caja.

El routing de la OP decide qué checklist aparece.

---

# 8. Incoming / inspección de entrada

El Access real incluye auditoría Incoming; debe ser ejecutable.

Campos:

- proveedor;
- OC / recepción;
- material;
- lote proveedor;
- lote RTM;
- cantidad ordenada;
- cantidad recibida;
- certificado/documento proveedor;
- apariencia;
- especificación;
- auditor;
- resultado.

Acciones:

- `Liberar material`;
- `Rechazar / HOLD`;
- `Adjuntar certificado`;
- `Crear no conformidad a proveedor` demo.

---

# 9. Remanentes — dictamen de Calidad

Agregar auditoría `Validación de remanente`.

Campos:

- material;
- lote;
- OP origen;
- dimensiones remanentes;
- fecha/hora;
- ubicación;
- condición visual;
- temperatura cuando aplique;
- requisito de cliente cuando aplique;
- destino propuesto.

Dictamen:

- `Apto para reutilizar`;
- `No apto / Scrap`;
- `Mantener en cuarentena`.

Manufactura/Inventario administra el remanente. Calidad solamente dicta aptitud.

---

# 10. Auditoría Final — completar con criterios reales

La vista actual es demasiado resumida.

Checklist final debe incluir según aplique:

- número de parte;
- revisión;
- identificación;
- material base;
- impresión;
- colores;
- manchas;
- refilado;
- corte;
- doblado;
- grapado;
- embobinado;
- troquel;
- empaque;
- cantidad.

Además mostrar:

- bache;
- cantidad producida;
- cantidad inspeccionada;
- liberada;
- rechazada;
- paquetes;
- rollos;
- cajas;
- parcial;
- lotes de insumo;
- muestra demo.

Acciones:

- `Aprobar y liberar`;
- `No Conforme`;
- `Agregar bache`;
- `Auditar muestra`;
- `Imprimir etiquetas`.

---

# 11. Baches / muestras como entidades visibles

Ejemplo:

```text
Bache     Cantidad    Parcial    Muestra    Resultado
44947     145         145        3          Conforme
44948     220         0          5          Pendiente
```

Acciones:

- `Auditar muestra`;
- `Ver bache`;
- `Imprimir etiqueta`.

No afirmar un estándar AQL normativo no confirmado; usar `Plan de muestreo configurado RTM · Demo`.

---

# 12. Etiquetas — preview térmico realista

No limitarse a toast.

Preview debe mostrar:

- auditor;
- número de control;
- cliente;
- resultado;
- número de parte;
- revisión;
- cantidad;
- lote/bache;
- fecha;
- hora;
- nomenclatura.

Tipos:

- Identificación;
- Bache;
- Parcial;
- Muestra;
- Caja;
- Primera Pieza.

Botón:

`Enviar a Zebra QA-02 · Demo`.

---

# 13. P1 — Desviaciones automáticas solicitadas por Alicia

Este es uno de los huecos principales de la cartita.

El sistema demo debe detectar visualmente:

- orden detenida demasiado tiempo;
- orden sin movimiento;
- orden fuera de secuencia;
- operación que debía avanzar y no avanzó;
- ruta esperada vs ruta ejecutada;
- estación inesperada;
- retraso vs tiempo estándar cuando aplique.

## Vista `Desviaciones activas`

```text
OP-95254
Tipo: Ruta fuera de secuencia
Esperado: Impresión → Corte → Doblado
Ejecutado: Impresión → Doblado
Tiempo detenido: 37 min
Severidad: Alta
[Analizar 4M]
```

Estas alertas deben aparecer en Dashboard de Calidad y enlazar con Producción.

---

# 14. P1 — Cerrar el ciclo 4M → acción correctiva

Producción ya registra 4M y minutos perdidos. Calidad debe explotar esos datos.

Flujo:

```text
Incidencia / desviación
→ Máquina / Material / Mano de obra / Método
→ minutos perdidos
→ responsable/área
→ contención
→ causa raíz
→ acción correctiva / ICAR
→ verificación de eficacia
```

## Drawer/modal `Analizar desviación`

Mostrar:

- OP;
- estación/máquina;
- tiempo perdido;
- categoría 4M;
- comentario del operador;
- responsable sugerido;
- contención inmediata;
- acción correctiva;
- evidencia.

Acción:

`Abrir ICAR`.

No construir un sistema CAPA completo si no es necesario, pero sí permitir abrir un ICAR convincente.

---

# 15. P1 — Dashboard mensual SGC

Alicia dijo que mensualmente revisan el estado del Sistema de Gestión de Calidad y hoy la captura manual dificulta esa junta.

Agregar dentro de `Gestión SGC` una vista `Revisión mensual`.

## KPIs / gráficos

- liberaciones conformes vs no conformes;
- defectos por proceso;
- Pareto de defectos;
- desviaciones por 4M;
- minutos perdidos por 4M;
- acciones correctivas abiertas/cerradas/vencidas;
- auditorías internas;
- calibraciones próximas a vencer;
- quejas/RMA abiertas;
- cumplimiento de requisitos de cliente;
- cumplimiento de mantenimiento preventivo (consulta transversal);
- capacitación pendiente/completada (consulta transversal).

Selector de periodo y Exportar siguiendo Requisiciones.

---

# 16. P1 — Requisitos específicos del cliente accionables

No dejarlos como lista decorativa.

## Ficha de cliente

```text
Panasonic
Requisito                    Dueño        Estado
Trazabilidad de lotes        Calidad      Cumple
Primera pieza                Calidad      Cumple
PPAP nuevo producto          Calidad      Pendiente
Dimensionales                Calidad      Cumple
Retención de registros       Calidad      Cumple
```

## Efecto en una OP

Cuando una OP tenga requisitos específicos:

> `Esta orden tiene 4 requisitos específicos de cliente aplicables.`

Botón:

`Ver requisitos aplicables`.

Estos requisitos pueden activar checklists/evidencias adicionales en la auditoría.

---

# 17. P1 — Plan de Control visible

Alicia mencionó Core Tools y el Access contiene conceptos vinculados a Plan de Control.

No implementar PPAP/SPC/MSA/PFMEA completos.

Sí crear una vista demo `Plan de Control` por artículo/revisión.

Tabla:

- característica;
- proceso/operación;
- especificación/tolerancia;
- método de inspección;
- frecuencia;
- instrumento;
- reacción si falla;
- requisito cliente relacionado.

Ejemplo:

```text
Registro color
Operación: Impresión Flexo
Frecuencia: Primera pieza + cambio bobina + >2h
Método: Comparación muestra aprobada
Instrumento: Pantone / densitómetro
Reacción: HOLD + nueva liberación
```

El Plan de Control debe explicar **por qué** una auditoría aparece automáticamente.

---

# 18. P2 — Audit trail maestro / control de cambios

Alicia pidió integridad de información y control de cambios.

Debe existir una vista auditable con:

- módulo;
- registro;
- campo;
- valor anterior;
- valor nuevo;
- usuario;
- fecha/hora;
- motivo;
- aprobador;
- versión/revisión.

Esto debe cubrir no solo OP, sino cambios relevantes de configuración del sistema demo.

Ejemplo:

```text
Módulo: Calidad
Registro: Plan de Control PN-48201 Rev C
Cambio: Frecuencia “Cada turno” → “Cada cambio de bobina”
Solicitó: Alicia Ramírez
Aplicó: Admin Nexora
Fecha: 07 Sep 2026 15:04
Motivo: actualización de requisito cliente
```

---

# 19. P2 — Usuarios / permisos visibles

Alicia pidió niveles distintos de acceso.

No construir RBAC completo si no existe.

Sí demostrar perfiles:

- Operador: registra movimiento / solicita revisión.
- Planeador: consulta/actualiza planeación.
- Supervisor: valida/corrige ciertos datos.
- Calidad: audita/libera/rechaza.
- Administrador: configura sistema.

En acciones sensibles mostrar texto/tooltip:

`Disponible para rol Calidad / Supervisor autorizado`.

Producción nunca debe mostrar CTA de liberación QA para operador.

---

# 20. P2 — Respaldo / recuperación / integridad

Alicia pidió respaldo y recuperación como parte auditable.

No implementar infraestructura real.

Agregar en Gestión SGC / Sistema una card demo:

```text
Integridad y respaldo
Último respaldo: Hoy 02:00
Estado: Correcto
Última verificación: 06:00
Retención demo: Configurada
[Ver bitácora]
```

Bitácora demo con respaldo, restauración de prueba y resultado.

---

# 21. P2 — Control documental

No construir DMS completo.

Agregar `Documentos relacionados` en auditoría/Plan de Control:

- WI / instructivo;
- formato;
- dibujo del cliente;
- PFMEA;
- Plan de Control;
- BOM;
- PFD;
- certificado;
- evidencia.

Mostrar revisión vigente, propietario y fecha.

---

# 22. Integraciones transversales sin duplicar módulos

## RH / Capacitación

Calidad debe poder consultar:

- capacitación requerida;
- calendarizada;
- realizada;
- asistencia;
- evaluación posterior;
- competencia vigente.

No duplicar RH.

## Proveedores

Calidad debe consultar evaluación de proveedor y poder abrir una no conformidad de proveedor desde Incoming.

## Mantenimiento

Calidad debe consultar cumplimiento de preventivos/correctivos cuando forme parte de la revisión mensual SGC.

---

# 23. Cobertura de planta

No diseñar Calidad únicamente para Flexografía.

El demo debe representar:

- Flexografía;
- Offset;
- Acabados;
- Serigrafía al menos como proceso disponible/mocks coherentes.

Alicia explicó que el alcance termina afectando toda la planta por recursos y procesos compartidos.

---

# 24. Navegación final sugerida

```text
CALIDAD
│
├── Dashboard
├── Captura
├── Auditorías
├── Liberaciones
├── Trazabilidad
├── No conformes
└── Gestión SGC
    ├── Revisión mensual
    ├── Desviaciones / 4M
    ├── ICAR
    ├── Requisitos cliente
    ├── Plan de Control
    ├── Auditorías internas
    ├── Metrología
    ├── Control de cambios
    ├── Documentos
    └── Integridad / respaldos
```

No es obligatorio que todo sea tab de primer nivel; mantener UX compacta estilo Requisiciones.

---

# 25. Design System — obligatorio

Seguir:

- `docs/design-system.md`;
- `frontend/src/components/Compras/Requisiciones/RequisicionesTab.tsx`;
- `frontend/src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`;
- `frontend/src/components/Compras/Requisiciones/RequisitionDetailModal.tsx`;
- `src/components/common/`.

Reglas:

- mismas tabs compactas;
- headers ejecutivos;
- KPIs blancos;
- semántica en borde/dot/icono;
- modales amplios tipo workspace;
- tablas densas y limpias;
- `font-mono` en folios/lotes/métricas;
- toasts demo coherentes;
- responsive;
- theme tokens existentes.

Prohibido:

- otro design system;
- apariencia tipo Access;
- fondos pastel saturados;
- botones muertos;
- duplicar componentes existentes.

---

# 26. Reglas técnicas del repo

- Trabajar exclusivamente en `alvaro01`.
- `src/` es la fuente canónica.
- No editar manualmente `src/` y `frontend/src/` como dos códigos independientes.
- Frontend demo solamente.
- Sin backend/API/migraciones.
- Reusar estado/modelos actuales cuando sea posible.
- Unificar Producción ↔ Calidad en estado demo compartido.
- No romper módulos existentes.

Al terminar:

```bash
npm run build
npm run sync:frontend
```

Corregir todos los errores antes de cerrar.

---

# 27. Criterio de éxito del demo

En menos de 5 minutos debe poder contarse:

```text
Calidad entra
→ ve pendientes
→ captura temperatura
→ abre primera pieza
→ audita checklist contextual
→ aprueba
→ Producción continúa
→ pasan >2h / cambio bobina
→ nueva auditoría automática
→ aparece desviación de ruta
→ analiza 4M
→ abre ICAR
→ auditoría final
→ bache / muestra
→ etiqueta
→ lote liberado
→ trazabilidad completa
```

Y segundo caso:

```text
Incoming de material
→ auditoría falla
→ HOLD
→ no conformidad proveedor
→ material no disponible
```

Y tercer mini caso:

```text
OP Panasonic
→ requisitos específicos cliente
→ Plan de Control explica frecuencia y evidencia requerida
```

La percepción final debe ser:

> **RTM deja de tener Calidad fragmentada entre Access, hojas y memoria operativa; ahora Calidad captura, audita, libera, bloquea, analiza y demuestra trazabilidad en el mismo ERP.**
