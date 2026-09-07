# RTM Demo — Control Documental · Plan funcional y UX

## Objetivo

Agregar al demo de RTM un workspace de **Control Documental** dentro de `Calidad > Gestión SGC` que permita demostrar cómo la organización controla documentos, revisiones, liberaciones, cambios y obsolescencia sin convertir el demo en un DMS genérico.

La narrativa debe ser industrial y muy RTM:

> **Un documento vigente gobierna producto/proceso. Cuando cambia una revisión, el sistema controla qué cambia, quién aprueba, qué documentos quedan afectados, cuándo entra en vigor y qué versión anterior queda obsoleta.**

Este módulo debe reforzar IATF/SGC, trazabilidad y control de cambios, pero seguir siendo simple de demostrar.

---

# 1. Base confirmada por RTM

## 1.1 Control Documental sí es un proceso real de Calidad

En la reunión Jorge explicó que cuentan con infraestructura dedicada a Calidad y Control Documental, incluyendo un NAS/servidor utilizado específicamente para esa información.

## 1.2 El documento `Modulos QA.docx` asigna funciones explícitas a Control Documental

En Alertas de Calidad:

- Calidad crea y administra alertas.
- Supervisor aprueba.
- **Control Documental registra, controla y libera.**
- Área involucrada ejecuta acciones y seguimiento.
- Gerencia consulta indicadores.

## 1.3 Control de Cambios afecta documentos y no puede implementarse sin aprobación

El documento QA define cambios sobre:

- proveedor;
- materia prima;
- papel;
- proceso;
- maquinaria;
- software;
- documentación;
- cambios solicitados por cliente;
- desabasto.

Debe registrarse:

- folio;
- fecha;
- área solicitante;
- solicitante;
- tipo de cambio;
- cliente;
- número de parte;
- producto;
- justificación;
- riesgos;
- documentos afectados;
- evidencias;
- firmas electrónicas.

El análisis puede indicar documentos que requieren actualización como:

- PFMEA;
- Plan de Control;
- QCPC;
- PFD;
- BOM;
- WI;
- ERP;
- especificaciones.

Reglas confirmadas:

- ningún cambio se implementa sin aprobación;
- los documentos deben actualizarse antes de implementar;
- cuando aplica aprobación de cliente, el proceso debe bloquearse hasta recibirla;
- debe existir seguimiento al primer lote;
- cuando aplica, debe existir evidencia de destrucción antes del cierre.

## 1.4 Revisiones de producto / herramental

En exploración se explicó que al pasar de una revisión de producto a otra:

- se genera la nueva revisión;
- Calidad valida especificaciones;
- se revisa insumo/línea correspondientes;
- se activa la nueva revisión;
- la revisión anterior queda inactiva/obsoleta;
- cuando aplica deben destruirse placas, grabados, herramental o material obsoleto para evitar fabricar/embarcar una revisión incorrecta.

Esto debe ser una de las historias principales del demo.

---

# 2. Situación actual del repo

La implementación actual de `GestionSGCWorkspace.tsx` ya tiene:

- subtab `Integridad & Docs`;
- `CONTROLLED_DOCUMENTS`;
- una tabla básica de documentos controlados;
- backups/integridad;
- audit trail;
- Plan de Control;
- Requisitos Cliente.

**No crear un sistema duplicado.**

La nueva implementación debe extraer/refinar la parte documental en una experiencia real de trabajo.

Recomendación:

```text
Gestión SGC
├── Revisión mensual
├── Desviaciones & 4M
├── Plan de Control
├── Requisitos Cliente
├── Control Documental         ★ NUEVO / protagonista
├── Audit Trail & Roles
└── Integridad & Respaldos
```

Mover la tabla actual de `CONTROLLED_DOCUMENTS` desde `Integridad & Docs` al nuevo workspace y dejar en `Integridad & Respaldos` únicamente respaldo, integridad y consultas técnicas.

---

# 3. Narrativa de demo

El usuario debe entender tres historias en menos de 5 minutos.

## Historia A — Consultar documento vigente

```text
Control Documental
→ buscar WI-QA-146
→ abrir documento
→ ver revisión vigente
→ propietario
→ área
→ fecha efectiva
→ historial de revisiones
→ documentos / procesos relacionados
```

## Historia B — Crear una nueva revisión

```text
Documento Rev. A vigente
→ Nueva revisión
→ capturar motivo
→ Rev. B propuesta
→ indicar documentos afectados
→ enviar a aprobación
→ aprobar
→ liberar Rev. B
→ Rev. A pasa automáticamente a Obsoleta
→ queda trazabilidad completa
```

## Historia C — Cambio de revisión de producto

```text
Parte 526412 · Rev G
→ cambio de ingeniería / cliente
→ Rev H propuesta
→ Control de Cambios asociado
→ Calidad valida especificaciones
→ Plan de Control / BOM / WI afectados
→ aprobación
→ nueva revisión liberada
→ revisión anterior inactiva
→ evidencia de destrucción de placas/herramental cuando aplique
```

Esta tercera historia es la más importante porque conecta Artículos + Producción + Calidad + Control Documental.

---

# 4. Workspace principal

Header:

```text
CONTROL DOCUMENTAL · SGC
Documentos vigentes, revisiones, aprobaciones y obsolescencia

[ + Nueva revisión ]   [ Registrar documento ]
```

Subtabs internas:

```text
[ Biblioteca ] [ Revisiones & Cambios ] [ Aprobaciones ] [ Obsoletos ] [ Historial ]
```

No crear otro módulo en el Sidebar general. Debe vivir dentro de `Calidad > Gestión SGC`.

---

# 5. Resumen superior / KPIs

Antes de la tabla mostrar 5 o 6 KPIs compactos:

- Documentos vigentes.
- Revisiones pendientes de aprobación.
- Cambios documentales abiertos.
- Documentos obsoletos.
- Liberaciones este mes.
- Evidencias de destrucción pendientes.

Ejemplo demo:

```text
Vigentes                  126
Pendientes aprobación       4
Cambios abiertos             3
Obsoletos                   18
Liberados este mes           7
Destrucción pendiente        2
```

Los KPIs deben ser clickeables/filtros cuando tenga sentido.

---

# 6. Biblioteca documental

Tabla principal:

- Código.
- Documento.
- Tipo.
- Revisión vigente.
- Área.
- Propietario.
- Fecha efectiva.
- Estado.
- Relacionado con.
- Acción.

Tipos demo coherentes con RTM:

- WI — Work Instruction.
- FM — Formato.
- PC — Plan de Control.
- PFD — Diagrama de Flujo.
- PFMEA.
- BOM.
- Especificación Cliente.
- Procedimiento.

Ejemplos:

```text
WI-QA-146   Control de Cambios             Rev 0   Calidad       Vigente
WI-QA-099   Auditorías Internas SGC        Rev 2   Calidad       Vigente
FM-QA-267   Criticidad Auditorías          Rev 1   Calidad       Vigente
PC-526412   Plan de Control Panasonic      Rev G   Calidad       Vigente
BOM-526412  BOM 526412                     Rev G   Ingeniería    Vigente
WI-MFG-156  Material No Conforme           Rev 3   Manufactura   Vigente
```

Filtros:

- búsqueda;
- tipo;
- área;
- estado;
- cliente;
- propietario;
- revisión.

Estados:

- Borrador.
- En revisión.
- Pendiente aprobación.
- Vigente.
- Obsoleto.
- Bloqueado por aprobación cliente.

---

# 7. Detalle de documento

Abrir en drawer/modal amplio estilo Requisiciones.

Header:

```text
WI-QA-146
Control de Cambios
REV 0 · VIGENTE
```

Tabs:

```text
[ Resumen ] [ Revisiones ] [ Relaciones ] [ Evidencia ] [ Historial ]
```

## Resumen

- código;
- título;
- revisión;
- tipo;
- área;
- propietario;
- aprobadores;
- fecha emisión;
- fecha efectiva;
- estado;
- descripción;
- archivo demo;
- cliente cuando aplique.

## Relaciones

Mostrar vínculos como:

- artículo / número de parte;
- revisión de producto;
- Plan de Control;
- PFMEA;
- BOM;
- proceso;
- máquina;
- cliente;
- Control de Cambios;
- auditoría interna que lo revisó.

Esta relación cruzada es más importante que tener un simple repositorio de PDFs.

---

# 8. Flujo `+ Nueva revisión`

Modal/wizard amplio.

## Paso 1 — Documento origen

- buscar documento;
- revisión actual;
- propietario;
- área;
- estado actual.

## Paso 2 — Propuesta

- nueva revisión;
- motivo;
- descripción del cambio;
- fecha propuesta;
- solicitante;
- área solicitante.

## Paso 3 — Impacto

Checkboxes/documentos afectados:

- PFMEA;
- Plan de Control;
- QCPC;
- PFD;
- BOM;
- WI;
- ERP;
- especificaciones;
- herramental/placas;
- otros.

También:

- cliente afectado;
- parte/revisión;
- riesgo;
- requiere aprobación cliente Sí/No.

## Paso 4 — Aprobaciones

Mostrar circuito visual:

```text
Solicitante           ✓
Calidad               ✓
Ingeniería            Pendiente
Manufactura           Pendiente
Control Documental    Pendiente
Cliente               No aplica / Pendiente
```

No afirmar roles exactos obligatorios para todos los cambios; el equipo multidisciplinario depende del caso.

## Paso 5 — Liberación

Solo cuando estén cumplidas las aprobaciones aplicables:

`Liberar nueva revisión`

Resultado:

```text
Rev B → VIGENTE
Rev A → OBSOLETA
```

Generar entrada de audit trail con:

- quién;
- fecha/hora;
- antes;
- después;
- motivo;
- aprobadores.

---

# 9. Aprobaciones

Vista dedicada con tarjetas/tabla de pendientes:

```text
CC-2026-014
Cambio documental · Parte 526412
Rev G → Rev H
Panasonic

Pendiente: Ingeniería
Impacta: Plan de Control · BOM · WI-FLX-022
[ Revisar ]
```

Otro ejemplo:

```text
CC-2026-016
Cambio de proveedor de BOPP
Impacta: BOM · Plan de Control · Especificación
Cliente requiere aprobación

BLOQUEADO POR CLIENTE
[ Ver evidencia requerida ]
```

El sistema debe hacer visible por qué un cambio todavía no puede liberarse.

---

# 10. Obsoletos & destrucción

Esta vista debe ser muy RTM y no una papelera genérica.

Tabla:

- documento/revisión anterior;
- nueva revisión vigente;
- fecha de obsolescencia;
- producto/parte afectada;
- material/herramental relacionado;
- evidencia de disposición/destrucción;
- responsable;
- estado.

Ejemplo:

```text
PC-526412 Rev G
Nueva vigente: Rev H
Placas Flexo: 2
Grabados: 1 juego
Copia controlada en piso: 3

Estado: Destrucción pendiente
[ Registrar evidencia ]
```

Modal `Registrar evidencia de disposición`:

- elemento;
- cantidad;
- método;
- responsable;
- fecha/hora;
- observación;
- foto/archivo demo;
- referencia FM-QA-138 cuando aplique.

Acción final:

`Confirmar disposición`.

Nunca borrar físicamente el registro histórico del sistema.

---

# 11. Integración con Artículos

Esta es P0.

En `ArticuloDetailView` cuando existan revisiones, agregar bloque:

```text
CONTROL DE REVISIÓN
Parte: 526412
Actual: Rev G · Vigente
Anterior: Rev F · Obsoleta

[ Ver expediente documental ]
```

Si hay cambio pendiente:

```text
⚠ Rev H en aprobación documental
No disponible para Producción
```

No permitir que una nueva revisión de artículo se vea como liberada para Producción mientras el cambio documental demo esté pendiente.

Para demo frontend basta con estado compartido/mock coherente; no crear backend.

---

# 12. Integración con Producción

Cuando una OP usa una revisión vigente:

```text
Documentación aplicable
✓ Parte 526412 Rev G
✓ BOM Rev G
✓ Plan de Control Rev G
✓ WI Flexo vigente
```

Si existe una revisión nueva todavía no liberada:

```text
Rev H en proceso de aprobación documental
Esta OP continúa usando Rev G vigente
```

Si se intenta usar una revisión obsoleta, mostrar bloqueo demo:

```text
⚠ REVISIÓN OBSOLETA
La Rev F no puede programarse.
Vigente: Rev G
[ Ver control documental ]
```

---

# 13. Integración con Control de Cambios

No crear dos historias separadas.

El flujo debe permitir que una revisión nazca desde:

- Control Documental directamente;
- un registro de Control de Cambios;
- una revisión nueva de artículo/producto.

Mostrar vínculo:

```text
Documento: PC-526412 Rev H
Origen: CC-2026-014
Tipo: Cambio solicitado por cliente
```

Y en Control de Cambios:

```text
Documentos afectados
✓ Plan de Control Rev H · Liberado
✓ BOM Rev H · Liberado
⚠ WI-FLX-022 Rev 4 · Pendiente
```

El cambio NO debe aparecer como implementable mientras falte un documento obligatorio.

---

# 14. Sugerencias del sistema

Agregar bloque morado estilo plataforma, sin venderlo como IA real.

Título:

`✨ Sugerencias del sistema`

Ejemplos:

### Sugerencia 1

```text
La Rev H de 526412 afecta Plan de Control, BOM y WI de Flexografía.
2 de 3 documentos ya fueron actualizados.

Recomendación:
Completar WI-FLX-022 antes de liberar el cambio.

[ Abrir documento pendiente ]
```

### Sugerencia 2

```text
PC-526412 Rev G quedó obsoleto hace 3 días.
Aún existen 2 placas asociadas sin evidencia de disposición.

[ Registrar destrucción ]
```

### Sugerencia 3

```text
La especificación Panasonic Rev H requiere aprobación del cliente.
La implementación permanece bloqueada.

[ Ver aprobación pendiente ]
```

Las sugerencias deben explicar la regla que las dispara.

---

# 15. Dashboard / atención documental

Dentro de Control Documental agregar bloque `Requiere atención`:

```text
Rev H · 526412                    Pendiente Ingeniería      [Revisar]
CC-2026-016                       Aprobación cliente         [Ver]
WI-FLX-022 Rev 4                  Actualización pendiente    [Editar]
PC-526412 Rev G                   Destrucción pendiente      [Registrar]
FM-QA-267 Rev 1                   Liberación pendiente       [Liberar]
```

El dashboard debe sentirse operativo, no como catálogo de archivos.

---

# 16. Datos demo

Crear 15–25 documentos coherentes con RTM, no cientos.

Cubrir:

- Calidad;
- Flexografía;
- Offset;
- Acabados;
- Producción;
- Mantenimiento;
- Compras;
- cliente específico.

Crear por lo menos:

- 8 documentos vigentes;
- 3 revisiones en proceso;
- 3 obsoletos;
- 2 con destrucción pendiente;
- 1 bloqueado por aprobación cliente.

Usar clientes y partes que ya aparecen en el demo para mantener coherencia:

- Panasonic;
- BLACK & DECKER;
- TYCO;
- 526412;
- NA472050;
- IS-2420.

---

# 17. UI/UX

Seguir obligatoriamente:

- `docs/design-system.md`;
- Requisiciones como referencia de tablas, drawers y modales;
- Inventario como referencia de dashboard y sugerencias SMART;
- Calidad actual como lenguaje de negocio.

Visual:

- cards blancas/theme-surface;
- semantic border/icon/dot;
- morado solo para `Sugerencias del sistema`;
- estados con badges claros;
- tablas densas pero legibles;
- modales amplios;
- font-mono para códigos/revisiones;
- no saturar de fondos pastel;
- no crear otro design system.

---

# 18. Arquitectura / repo

- Trabajar SOLO en `alvaro01`.
- `src/` es fuente canónica.
- No duplicar estado/documentos si ya existe `CONTROLLED_DOCUMENTS`.
- Refactorizar `GestionSGCWorkspace.tsx` si conviene para extraer `ControlDocumentalWorkspace.tsx`.
- Mantener `Integridad & Respaldos` separado del nuevo Control Documental.
- Reusar `ModalPortal`, badges y componentes common existentes.
- No backend.
- No API real.
- Los archivos adjuntos son preview/demo/toast.

Al terminar:

```bash
npm run build
npm run sync:frontend
```

---

# 19. P0 / P1 / P2

## P0

- subtab Control Documental;
- Biblioteca;
- detalle de documento;
- Nueva revisión;
- flujo de aprobaciones;
- vigente → obsoleto;
- integración con Artículos;
- bloqueo visual de revisión obsoleta en Producción;
- audit trail;
- Obsoletos & destrucción;
- sugerencias del sistema.

## P1

- integración visual con Control de Cambios;
- documentos afectados;
- aprobación cliente bloqueante;
- relaciones Plan de Control / BOM / WI / PFMEA;
- dashboard de atención documental.

## P2

- exportar expediente;
- previews de archivos;
- búsqueda avanzada;
- métricas secundarias.

---

# 20. Criterio de éxito del demo

La pantalla debe permitir contar esta historia sin explicación técnica:

> “Panasonic pidió una nueva revisión. Se abrió el cambio, el sistema identificó Plan de Control, BOM y WI afectados, pidió las aprobaciones correspondientes y no dejó implementar mientras faltaba la autorización. Cuando Calidad y Control Documental liberaron la revisión nueva, la anterior quedó obsoleta y el sistema dejó pendiente la evidencia de destrucción de placas. Producción sólo puede usar la revisión vigente.”

Si esa historia se entiende visualmente y se puede recorrer con clicks, el módulo cumple su objetivo.