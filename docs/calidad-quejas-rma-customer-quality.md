# RTM Demo — Calidad · Quejas de Cliente & RMA / Customer Quality

## Objetivo

Agregar a **Calidad** un workspace operativo para administrar el problema desde que el cliente lo reporta hasta su resolución, conectándolo con la trazabilidad que ya existe en el ERP.

La narrativa de demo debe ser:

> **Cliente reporta un problema → se identifica el embarque/lote/parte → Calidad investiga la fabricación → se contiene el riesgo → se decide si procede RMA → se vincula acción correctiva cuando aplica → se registra disposición/reposición → se cierra con historial completo.**

Esto responde directamente a la prioridad expresada por Alicia: controlar la trazabilidad del producto **desde quejas de cliente hasta envíos**.

El requisito formal disponible en RTM para devolución está documentado como:

- **Módulo: Autorización de Devolución de Mercancías (RMA)**
- Proceso: Atención a Clientes
- Documento base: **WI-QA-049 Rev.0**
- Formato relacionado: **FM-QA-106**

No inventar reglas normativas que no estén confirmadas.

---

# 1. Decisión de arquitectura

Agregar una nueva tab principal dentro de **Calidad**:

```text
Dashboard
Piso QA
Captura
Auditorías
Liberaciones
Trazabilidad
No conformes
Quejas & RMA   ← NUEVA
Gestión SGC
```

No crear otro módulo de Sidebar.

No sustituir `No conformes`: una no conformidad es un hallazgo/control interno; una **Queja/RMA** nace del cliente o del proceso de atención al cliente y puede relacionarse con una MNC, desviación o ICAR.

---

# 2. Diferencia conceptual: Queja vs RMA

Para que el demo sea claro:

## Queja de Cliente

Expediente de Customer Quality que inicia con un reclamo del cliente.

Puede resolverse sin devolución física, por ejemplo mediante investigación, respuesta técnica o acción correctiva.

## RMA

Cuando la resolución requiere alguna de las opciones formales confirmadas por RTM:

- Retorno.
- Reinspección.
- Reparación.
- Reemplazo.

Entonces el caso debe tener un **folio RMA** y seguir el flujo de aprobación correspondiente.

Esto permite que la interfaz se llame `Quejas & RMA`, pero mantiene la semántica formal de RMA.

---

# 3. Dashboard Customer Quality

La landing debe sentirse como Inventario/Requisiciones: ejecutiva, densa, accionable y con sugerencias del sistema.

## Filtros globales

```text
Periodo: [7 días] [30 días] [60 días] [90 días]
Cliente: [Todos ▾]
Estado: [Todos ▾]
Tipo: [Quejas + RMA ▾]
Parte: [Todas ▾]
                                            [Exportar]
```

Default: **30 días**.

## KPIs

Máximo 6 cards:

- Casos abiertos.
- RMA recibidos.
- RMA aprobados.
- RMA rechazados.
- Tiempo promedio de resolución.
- Casos con acción correctiva abierta.

Los indicadores sugeridos formalmente por RTM incluyen solicitudes recibidas, aprobadas, rechazadas, RMA por cliente, RMA por parte, motivos, tiempo promedio de resolución, abiertos/cerrados, tendencia mensual y Pareto de defectos.

## Bloque principal: `Requieren atención`

Ejemplo demo:

```text
Q-2026-0018 · PANASONIC
Variación de tono · Lote BCH-44951
Alta · En investigación · 3 días abierto
[Continuar investigación]

RMA-2026-0007 · BLACK & DECKER
Producto incorrecto · 145 pzas
Pendiente de aprobación
[Revisar RMA]

Q-2026-0015 · TYCO
Defecto repetitivo de registro
ICAR abierto · evidencia pendiente
[Ver acción correctiva]
```

---

# 4. Sugerencias del sistema — bloque SMART morado

Agregar `Sparkles` con acento morado siguiendo el lenguaje visual de Inventario/Requisiciones.

No presentarlo como IA real. Usar:

`Sugerencia del sistema · Reglas demo`

Ejemplos:

```text
✨ REINCIDENCIA DETECTADA

Variación de color aparece en 3 casos del mismo proceso
Flexografía durante los últimos 60 días.

2 casos involucran la misma familia de parte.

Recomendación:
Revisar Plan de Control y relacionar los casos con ICAR.

[Ver reincidencias] [Abrir ICAR]
```

```text
✨ POSIBLE RELACIÓN CON EMBARQUE

La parte 526412 | G | aparece en un solo embarque reciente
con el mismo lote reportado por Panasonic.

[Ver trazabilidad del lote]
```

```text
✨ RMA PENDIENTE DE RESOLUCIÓN

El expediente ya contiene inspección y evidencia,
pero todavía no tiene resolución registrada.

[Completar resolución]
```

Las sugerencias deben explicar **por qué** aparecen y llevar a una acción real.

---

# 5. Lista principal de Quejas & RMA

Tabla compacta:

```text
Folio | Cliente | Parte | Lote/Embarque | Motivo | Cantidad | Estado | Responsable | Antigüedad | Acción
```

Estados sugeridos para el demo:

- Nueva.
- En investigación.
- Contención activa.
- Evaluación QA.
- Pendiente aprobación RMA.
- RMA aprobado.
- RMA rechazado.
- En devolución / reposición.
- Pendiente verificación.
- Cerrado.

No inventar SLA contractual. Mostrar `días abierto` como dato informativo.

Filtros rápidos:

- Abiertas.
- En investigación.
- Pendientes aprobación.
- Con ICAR.
- Cerradas.

Buscador por:

- folio;
- cliente;
- número de parte;
- lote;
- OP;
- remisión/embarque;
- factura.

---

# 6. `+ Nueva queja`

CTA global:

`+ Nueva queja`

Wizard corto:

## Paso 1 — Cliente y origen

- Cliente.
- Contacto.
- Correo.
- Teléfono.
- Fecha de reporte.
- Canal demo: correo / llamada / portal / comercial.

## Paso 2 — Producto y documento

- Número de parte.
- Descripción.
- Cantidad afectada.
- Lote.
- Fecha de fabricación cuando esté disponible.
- Orden de compra del cliente.
- Factura.
- Remisión / guía de embarque.

Debe permitir buscar datos existentes del demo para evitar escribir todo manualmente.

## Paso 3 — Problema

Motivos confirmados por RTM/RMA:

- Producto defectuoso.
- Daño durante transporte.
- Producto incorrecto.
- Error de envío.
- Reclamo de garantía.
- Solicitud de reemplazo.
- Solicitud de reparación.
- Otro cubierto por política.

Campos:

- descripción del defecto;
- severidad demo;
- evidencia;
- responsable de revisión.

## Paso 4 — Evidencias

Permitir adjuntar visualmente:

- fotografías del producto;
- fotografías del defecto;
- factura;
- orden de compra;
- guía de embarque;
- correo del cliente;
- evidencia de inspección;
- documentos adicionales.

En demo pueden ser archivos simulados/preexistentes con badges `Adjunto`.

## Paso 5 — Crear expediente

Resultado:

```text
Q-2026-0018 creada
Cliente: Panasonic
Parte: 526412 | G |
Estado: Nueva

[Iniciar investigación]
```

---

# 7. Expediente 360 de Queja / RMA

Este debe ser el corazón del módulo.

Modal amplio o vista de detalle, NO un modal pequeño.

Header:

```text
Q-2026-0018
PANASONIC
Variación de tono en etiquetas

Alta · En investigación
Parte 526412 | G | · Rev G
Lote BCH-44951 · 1,000 pzas embarcadas
```

Tabs internas:

```text
[Resumen]
[Trazabilidad]
[Evaluación QA]
[RMA]
[Acciones]
[Evidencias]
[Historial]
```

---

# 8. Tab `Resumen`

Mostrar:

- cliente/contacto;
- motivo;
- descripción;
- cantidad afectada;
- parte/revisión;
- lote;
- factura;
- OC cliente;
- remisión/embarque;
- responsable;
- estado;
- fecha apertura;
- días abierto.

Lateral `Próxima acción`:

```text
Siguiente paso recomendado
Completar evaluación de Calidad

[Iniciar evaluación]
```

---

# 9. Tab `Trazabilidad`

Este caso debe aprovechar la información ya existente, no inventar un segundo universo de datos.

Mostrar cadena:

```text
Cliente
Panasonic
  ↓
Factura / pedido
  ↓
Remisión / embarque
  ↓
Bache PT BCH-44951
  ↓
OP-2026-95250
  ↓
Proceso / máquina / operador
  ↓
Auditorías QA
  ↓
Lotes de material/tinta
```

CTA:

`Abrir Trazabilidad completa`

Para este módulo basta una vista contextual; la futura pantalla #4 `Trazabilidad 360` será la experiencia maestra reutilizable.

Mostrar banderas si existen:

- desviación 4M relacionada;
- MNC;
- auditoría rechazada;
- cambio de bobina;
- ajuste de máquina;
- ICAR;
- producto liberado.

---

# 10. Tab `Evaluación QA`

Campos formales confirmados:

- Resultado de inspección.
- Defecto identificado.
- Tipo de defecto.
- Causa preliminar.
- Observaciones.
- Recomendación.
- Resultado.

UI:

```text
EVALUACIÓN DE CALIDAD

Defecto identificado     Variación de tono
Tipo                      Apariencia / impresión
Causa preliminar          Pendiente análisis 4M
Resultado inspección      No Conforme
Recomendación             Reinspección + contención

[Guardar evaluación]
```

Acciones:

- Crear/ligar MNC.
- Analizar 4M.
- Abrir ICAR.
- Determinar si requiere RMA.

---

# 11. Tab `RMA`

No todos los casos necesitan RMA.

Si todavía no se requiere:

```text
Este caso aún no requiere devolución física.

[Crear solicitud RMA]
```

Al crear RMA:

Folio automático:

`RMA-2026-0007`

## Tipo de solicitud

- Retorno.
- Reinspección.
- Reparación.
- Reemplazo.

## Información general formal

- Fecha solicitud.
- Cliente.
- Contacto.
- Correo.
- Teléfono.
- OC.
- Factura.
- Parte.
- Cantidad.
- Tipo de devolución.
- Motivo.
- Descripción defecto.
- Responsable revisión.
- Estatus.

## Aprobaciones

Confirmado por documento RTM:

- Supervisor de Calidad.
- Gerente de Calidad cuando aplique.

Demo:

```text
APROBACIONES

✓ Evaluación QA completada
✓ Supervisor Calidad · Alicia Ramírez
○ Gerencia Calidad · Pendiente cuando aplica

[Aprobar RMA]
[Rechazar]
```

Si se rechaza, el motivo es obligatorio.

---

# 12. Reglas de negocio obligatorias

Implementar visualmente estas reglas confirmadas:

1. Ninguna devolución se procesa sin folio RMA.
2. El expediente conserva evidencia fotográfica cuando aplique.
3. No puede cerrarse sin resolución registrada.
4. Debe conservar historial completo de aprobaciones y cambios de estado.
5. RMA rechazado exige motivo de rechazo.
6. Las aprobaciones correspondientes deben quedar visibles en el expediente.

No inventar tiempos máximos de resolución para RMA.

---

# 13. Tab `Acciones`

Unificar acciones relacionadas sin construir otro CAPA.

Mostrar:

- Contención inmediata.
- MNC relacionada.
- Desviación 4M.
- ICAR relacionado.
- Reposición/reparación/reinspección.
- Responsable.
- Fecha compromiso demo.
- Estado.

Ejemplo:

```text
CONTENCIÓN
Bloquear lote hermano BCH-44952
Responsable: Calidad / PT
Estado: Ejecutada

ICAR-2026-031
Variación recurrente de color
Estado: Abierto
[Ver ICAR]
```

---

# 14. Resolución y cierre

Resoluciones demo:

- Procede retorno.
- Procede reemplazo.
- Procede reparación.
- Procede reinspección.
- Crédito/reposición demo cuando aplique.
- No procede RMA.
- Queja cerrada sin retorno.

Antes de cerrar validar:

```text
✓ Evaluación QA registrada
✓ Resolución registrada
✓ Evidencias requeridas
✓ RMA resuelto/rechazado cuando existe
✓ Acción correctiva ligada cuando aplica
✓ Historial completo

[Cerrar expediente]
```

Después:

```text
Q-2026-0018 · CERRADA
Resolución: Reemplazo aprobado
RMA-2026-0007
Cerrado por: Alicia Ramírez
```

---

# 15. Analítica de Customer Quality

Debajo del dashboard o subtab `Analítica` dentro del workspace.

Agregar:

- RMA por cliente.
- RMA por número de parte.
- Motivos de devolución.
- Casos abiertos/cerrados.
- Tiempo promedio de resolución.
- Tendencia mensual.
- Pareto de defectos.
- Reincidencias.
- Top clientes por casos.
- Top partes por casos.

Filtros 7/30/60/90 días.

No llenar la landing con 20 gráficas: separar `Operación` de `Analítica`.

---

# 16. Casos demo recomendados

Crear 6–8 expedientes coherentes.

## Caso protagonista

### Panasonic — Variación de tono

```text
Q-2026-0018
Cliente: Panasonic
Parte: 526412 | G |
Rev: G
Lote: BCH-44951
OP: OP-2026-95250
Motivo: Producto defectuoso
Estado: En investigación
Cantidad afectada: 400 pzas
```

Debe permitir:

Queja → trazabilidad → QA → detectar reincidencia → 4M/ICAR → crear RMA → aprobar reemplazo → cerrar.

## Otros casos

- BLACK & DECKER — producto incorrecto → RMA pendiente de aprobación.
- TYCO — registro fuera de tolerancia → queja con ICAR, sin retorno todavía.
- BISSELL — daño de transporte → investigación Logística / RMA.
- ILSCO — defecto visual menor → RMA rechazado con motivo.
- INVACARE — reinspección solicitada.

Usar datos demo claramente ficticios/coherentes; no afirmar hechos reales de esos clientes.

---

# 17. Integraciones obligatorias

## Con Calidad

- Auditorías.
- MNC / HOLD.
- Desviaciones 4M.
- ICAR.
- Plan de Control.

## Con Producción

- OP.
- Máquina.
- Operador.
- Routing.
- Eventos de trazabilidad.

## Con Ventas / Comercial

- Cliente.
- Pedido cuando esté disponible.
- Contacto.

## Con Embarques

- remisión/embarque;
- lote PT;
- fecha salida;
- entrega.

## Con Finanzas

- factura como documento de referencia.

No es necesario construir devoluciones contables reales en este demo.

---

# 18. UX / Design System

Seguir:

- `docs/design-system.md`.
- Inventario Dashboard/Analítica.
- Requisiciones.
- Calidad Dashboard/Piso QA.

Visual:

- cards blancas/theme-surface;
- `rounded-2xl` / `rounded-3xl` consistente;
- tabs compactas;
- tablas densas;
- mono para folios/lotes;
- colores semánticos por borde/icono/badge;
- morado únicamente para SMART/sugerencias;
- acciones primarias con theme-primary;
- evitar fondos pastel saturados.

No copiar Access visualmente.

---

# 19. Componentización sugerida

No meter todo en `CalidadPage.tsx`.

Sugerencia:

```text
src/components/Calidad/CustomerQuality/
  CustomerQualityWorkspace.tsx
  CustomerQualityDashboard.tsx
  ComplaintsList.tsx
  ComplaintDetailModal.tsx
  NewComplaintWizard.tsx
  RmaPanel.tsx
  CustomerQualityAnalytics.tsx
  SmartCustomerQualitySuggestions.tsx
```

Datos demo en `mockCalidadData.ts` o archivo dedicado si crece demasiado, evitando duplicar entidades de OP/cliente/embarque.

`src/` es la fuente canónica.

---

# 20. Estado demo / persistencia en sesión

Durante la sesión debe funcionar:

- crear queja;
- cambiar estado;
- guardar evaluación;
- crear RMA;
- aprobar/rechazar RMA;
- abrir/ligar ICAR;
- registrar resolución;
- cerrar expediente;
- actualizar KPIs/listas de la vista.

No backend real necesario.

No botones muertos.

---

# 21. Historia de demo recomendada (<4 min)

```text
1. Entrar a Calidad → Quejas & RMA.
2. Dashboard muestra 3 casos que requieren atención.
3. Abrir Q-2026-0018 Panasonic.
4. Mostrar factura/embarque/lote/OP ligados.
5. Abrir Trazabilidad y llegar hasta OP-2026-95250.
6. Evaluación QA identifica variación de tono.
7. Sugerencia morada detecta reincidencia.
8. Abrir/ligar ICAR.
9. Crear RMA tipo Reemplazo.
10. Supervisor aprueba.
11. Registrar resolución.
12. Cerrar expediente.
```

Percepción buscada:

> **RTM no solamente registra quejas: conecta lo que el cliente reportó con lo que realmente ocurrió en fabricación, calidad y embarque, y deja evidencia de cómo se resolvió.**

---

# 22. Criterio de terminado

El módulo está listo para demo cuando:

- existe tab `Quejas & RMA` en Calidad;
- dashboard y lista son accionables;
- se puede crear una queja;
- el expediente tiene las 7 tabs definidas;
- puede ligarse con OP/lote/embarque/factura;
- evaluación QA funciona;
- RMA permite Retorno/Reinspección/Reparación/Reemplazo;
- aprobar/rechazar funciona y rechazo exige motivo;
- cierre exige resolución;
- historial conserva cambios;
- sugerencias moradas son explicables y accionables;
- analítica responde a los expedientes mock;
- no se duplica estado existente;
- build y sync terminan correctamente.
