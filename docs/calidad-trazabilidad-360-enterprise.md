# Trazabilidad 360 Enterprise · RTM

## Contexto

Este refinamiento corresponde al siguiente bloque del demo RTM después de Control Documental, Quejas/RMA, Calidad de Proveedores y Costeo de OP.

**Objetivo:** convertir la pestaña existente `Calidad > Trazabilidad` en una experiencia protagonista y visualmente premium que permita reconstruir, de forma entendible, la genealogía completa de un producto/lote desde cliente y pedido hasta fabricación, calidad, embarque y eventual queja/RMA.

No crear otro módulo duplicado. Ya existe una vista de `Trazabilidad` dentro de `CalidadPage`; debe evolucionarse y modularizarse.

La narrativa principal del demo debe ser:

> Cliente / pedido → OP → revisión vigente → materiales y lotes → routing / máquinas / operadores → controles QA → bache PT → liberación → embarque → factura → queja/RMA si aplica.

La pantalla debe responder rápido a la pregunta: **“¿Qué pasó con este lote, quién lo tocó, con qué material se fabricó, qué aprobó Calidad y a qué cliente se envió?”**

---

## 1. Principio UX

Trazabilidad 360 NO debe verse como una tabla técnica gigante ni como una lista de logs.

Debe sentirse como una mezcla entre:

- expediente ejecutivo;
- timeline industrial;
- genealogía de materiales;
- mapa del proceso;
- explorador de relaciones.

Referencia visual obligatoria:

- `docs/design-system.md`
- Inventario Dashboard/Analytics
- Requisiciones
- CRM enterprise
- Piso QA

Usar cards blancas/theme-surface, bordes discretos, `rounded-2xl/3xl`, tipografía jerárquica, IDs en mono, mucho aire y semántica visual consistente.

No llenar de degradados ni fondos saturados. El acento morado se reserva principalmente para inteligencia/sugerencias del sistema.

---

## 2. Header protagonista + búsqueda universal

La parte superior debe ser muy limpia:

```text
TRAZABILIDAD 360 · RTM

Reconstruye la genealogía completa de una orden, lote o embarque.

[ Buscar OP, lote, parte, pedido, remisión, factura o RMA...          ] [ Buscar ]

Búsquedas recientes:
OP-2026-95250   BCH-44951   526412 | G |   RMA-2026-0018
```

La búsqueda debe aceptar, como mínimo:

- OP;
- pedido;
- número de parte;
- revisión;
- lote de materia prima;
- lote/bache de PT;
- etiqueta/identificador;
- remisión/orden de salida;
- factura;
- queja/RMA si el módulo ya fue implementado.

Para demo puede usar datos mock, pero las relaciones deben vivir en una fuente central y consistente. No crear resultados diferentes para el mismo folio en varios componentes.

Si hay varias coincidencias, mostrar un selector elegante de resultados en vez de elegir arbitrariamente.

---

## 3. Hero del expediente

Al resolver una búsqueda, mostrar primero un hero compacto:

```text
OP-2026-95250                                   LIBERADA ✓
PANASONIC · 526412 | G | · Rev G

Pedido          PED-RTM-2026-86153
Área            Flexografía
Máquina         Mark Andy Scout 10”
Cantidad        1,000
Bache PT        BCH-44951
Auditor final   Alicia Ramírez
Destino         Cliente / embarque vinculado

[ Abrir OP ] [ Ver liberación QA ] [ Exportar expediente ]
```

A la derecha incluir un resumen visual de salud de trazabilidad:

- Documentación vigente ✓
- Lotes identificados ✓
- Ruta completa ✓
- Gates QA completos ✓
- Embarque identificado ✓

Si algo falta, marcarlo claramente como `Dato no disponible en demo` o `Relación pendiente`; nunca inventar silenciosamente.

---

## 4. Cadena visual de extremo a extremo

Debajo del hero, construir el elemento visual principal de la pantalla.

Debe ser una cadena/stepper horizontal en desktop y vertical en mobile:

```text
CLIENTE
  ↓
PEDIDO
  ↓
ORDEN DE PRODUCCIÓN
  ↓
MATERIALES / LOTES
  ↓
PROCESOS / MÁQUINAS
  ↓
CALIDAD
  ↓
BACHE PT
  ↓
EMBARQUE
  ↓
FACTURA
  ↓
QUEJA / RMA (si existe)
```

Cada nodo debe tener:

- icono;
- folio principal;
- estado;
- fecha/hora resumida;
- 1–2 datos clave;
- CTA `Ver detalle`.

No debe parecer diagrama amateur con líneas atravesadas. Preferir un stepper bien alineado, tarjetas compactas y conectores discretos.

Click en un nodo desplaza/focaliza la sección correspondiente del expediente.

---

## 5. Secciones del expediente

Usar tabs o navegación secundaria sticky:

`Resumen | Materiales | Proceso | Calidad | Embarque | Documentos | Incidencias | Historial`

### 5.1 Resumen

- snapshot ejecutivo;
- cadena end-to-end;
- alertas/reincidencias;
- principales documentos;
- resultado QA;
- destino de producto.

### 5.2 Materiales / genealogía

Mostrar materiales realmente asociados a la OP:

```text
MATERIA PRIMA UTILIZADA

BOPP Blanco Brillante       LOT-PPBC-260721
Requerido 1,240 m           Consumido 1,198 m
Proveedor / recepción       vínculo disponible si existe
Incoming QA                 Conforme ✓

Tinta PMS 186 C             LOT-INK-260904
3.2 kg utilizados

Barniz UV                   LOT-VAR-260902
2.1 kg utilizados
```

Para cada material:

- nombre/SKU;
- lote;
- cantidad requerida/entregada/consumida cuando exista;
- proveedor;
- OC/recepción si está disponible;
- resultado incoming;
- remanente generado si aplica.

Debe permitir genealogía hacia atrás: producto terminado → lote de materia prima.

### 5.3 Proceso / routing ejecutado

Mostrar ruta autorizada vs ruta ejecutada.

Cada etapa:

- proceso;
- máquina;
- operador;
- inicio / fin;
- entrada;
- buenas;
- scrap;
- tiempo estándar vs real;
- primera pieza si aplica;
- incidencias/paros;
- status.

Visual sugerido: timeline vertical industrial con bloques por proceso.

Destacar cualquier cambio de máquina, salto de secuencia o reprogramación.

### 5.4 Calidad

Concentrar:

- preimpresión;
- primera pieza;
- auditorías por operación;
- control >2h;
- cambio de bobina/turno/ajuste cuando exista;
- auditoría final;
- baches/muestras;
- liberaciones;
- HOLD/MNC;
- desviaciones 4M;
- ICAR;
- etiquetas generadas.

Cada auditoría muestra dictamen, auditor, hora y principales mediciones, con CTA al expediente original.

### 5.5 Embarque

Mostrar sólo datos que el demo pueda vincular coherentemente:

- bache/lote PT;
- orden de salida/remisión;
- cantidad enviada;
- cliente;
- staging/andén;
- salida;
- entrega;
- estado.

Si todavía no hay relación compartida real con Embarques, centralizar la relación en un dataset de trazabilidad demo claramente tipado y documentado. No duplicar órdenes de producción ni inventar otra versión del mismo embarque.

### 5.6 Documentos

Agrupar documentos relevantes:

- revisión vigente del artículo;
- dibujo / especificación;
- Plan de Control;
- hoja OP;
- checklist / auditoría;
- COA si aplica;
- liberación final;
- etiqueta PT;
- remisión;
- CFDI/factura si está vinculada;
- expediente RMA si existe.

Mostrar `Vigente`, `Obsoleto`, `Aprobado`, `Emitido`, etc. con semántica correcta.

### 5.7 Incidencias

Unificar eventos importantes:

- paros;
- scrap;
- desviaciones de material;
- sustituciones autorizadas;
- reprogramaciones;
- MNC/HOLD;
- retrabajo;
- quejas/RMA.

No es un dump de logs: debe explicar el impacto.

### 5.8 Historial

Timeline cronológica inmutable de la OP/lote.

Ejemplo:

```text
09:12  Planeación
       OP liberada a piso

09:34  Almacén MP
       Material surtido a Mark Andy Scout

09:52  Calidad
       Primera pieza aprobada · Alicia Ramírez

12:18  Operador
       Tiraje completado · 1,000 buenas · 24 scrap

12:32  Calidad
       Auditoría final aprobada

13:05  Almacén PT
       BCH-44951 ingresado a staging
```

Filtros: Todos / Producción / Calidad / Almacén / Comercial / Sistema.

---

## 6. Investigación desde Quejas & RMA

Este punto es importantísimo.

Si `Quejas & RMA` ya existe, el botón `Ver trazabilidad` de una queja debe abrir esta misma experiencia ya enfocada en el lote/embarque asociado.

Agregar un modo contextual:

```text
INVESTIGACIÓN DE QUEJA
RMA-2026-0018 · PANASONIC

Lote afectado: BCH-44951
OP origen: OP-2026-95250

⚠ 3 eventos relevantes encontrados
```

Resaltar en la cadena y timeline eventos que podrían ser relevantes para la investigación, SIN afirmar causalidad automática.

Ejemplo de sugerencia:

```text
✨ SUGERENCIA DEL SISTEMA

Se detectó un ajuste de rasqueta durante esta OP y existen
2 incidencias de variación de tono en productos similares del periodo.

Esto no determina la causa raíz.
Recomendamos revisar las auditorías de color y el análisis 4M.

[ Ver auditorías ] [ Abrir análisis 4M ]
```

Nunca escribir `la causa fue` salvo que exista una ICAR cerrada con esa causa.

---

## 7. Sugerencias del sistema

Usar cards moradas con `Sparkles`, pocas y de alto valor.

Ejemplos:

### Trazabilidad incompleta

> Falta vínculo de lote de tinta para una operación de impresión. Revisa el registro de consumo antes de cerrar expediente.

### Reincidencia

> Esta parte registra 3 no conformidades de color en 60 días. Revisar Plan de Control y acciones correctivas abiertas.

### Ruta ejecutada diferente

> La operación de impresión se ejecutó en máquina alternativa. La autorización existe; revisa el cambio antes de responder al cliente.

### Documento

> La OP fue ejecutada con revisión vigente, pero existe una nueva revisión aprobada posterior al lote. No afecta retrospectivamente este embarque.

Todas las sugerencias deben explicar `por qué aparece` y tener CTA real.

---

## 8. Exportar expediente

Agregar CTA `Exportar expediente`.

En demo puede mostrar banner/toast de exportación simulada, pero el preview debe ser convincente:

- encabezado RTM;
- cliente;
- parte/revisión;
- OP;
- materiales/lotes;
- ruta;
- auditorías;
- liberación;
- embarque;
- incidencias;
- evidencia documental.

Nombre sugerido:

`Trazabilidad_OP-2026-95250_526412-G.pdf`

Marcar como funcionalidad demo si no se genera archivo real.

---

## 9. Arquitectura / datos

### No duplicar

No crear copias de:

- `ProductionOrder`;
- `QualityAuditItem`;
- `NonConformance`;
- `QualityRelease`;
- materiales de OP;
- ventas/embarques existentes.

### Reusar

Fuentes existentes principales:

- estado compartido de `productionOrders` en `DashboardShell`;
- `ProductionOrder.traceability`;
- `ProductionOrder.materials`;
- `ProductionOrder.routing`;
- Quality audits/releases/nonconformances/deviations;
- Sales order / invoice cuando haya relación disponible;
- shipping data existente;
- complaints/RMA si ya fue implementado.

### Fuente central de relaciones demo

Si ciertos módulos todavía no comparten estado directo, crear una única capa de relación, por ejemplo:

`src/data/mockTraceabilityData.ts`

con referencias por IDs/folios, no copias completas de entidades.

Ejemplo conceptual:

```ts
{
  opFolio: 'OP-2026-95250',
  orderFolio: 'PED-RTM-2026-86153',
  finishedBatch: 'BCH-44951',
  shippingFolio: 'REM-2026-XXXX',
  invoiceFolio: 'FAC-RTM-2026-XXXX',
  complaintId: 'RMA-2026-0018'
}
```

Los folios deben ser coherentes con los mocks que ya existan; no inventar uno distinto si ya hay una relación disponible.

### Componentización sugerida

No seguir creciendo `CalidadPage.tsx` con cientos de líneas.

Crear, si conviene:

- `Traceability360Workspace.tsx`
- `TraceabilitySearch.tsx`
- `TraceabilityChain.tsx`
- `TraceabilityOverview.tsx`
- `TraceabilityMaterials.tsx`
- `TraceabilityProcess.tsx`
- `TraceabilityQuality.tsx`
- `TraceabilityDocuments.tsx`
- `TraceabilityTimeline.tsx`

Mantener componentes razonables, no microfragmentar sin necesidad.

---

## 10. Integraciones / navegación

Debe existir navegación coherente:

- Trazabilidad → abrir OP en Producción.
- Trazabilidad → abrir auditoría/liberación en Calidad.
- Trazabilidad → abrir MNC/ICAR.
- Trazabilidad → abrir queja/RMA.
- Trazabilidad → abrir documento controlado.
- Trazabilidad → abrir proveedor/Incoming cuando aplique.
- Trazabilidad → abrir pedido/factura si existe integración.

Si una navegación cross-module no puede implementarse de forma segura en esta iteración, el CTA debe mostrar feedback demo explícito y no ser un botón muerto.

---

## 11. Demo seed protagonista

Preparar al menos 3 expedientes visualmente completos:

1. **Panasonic · 526412 | G |**
   - Flexografía.
   - OP completa.
   - materiales con lotes.
   - primera pieza.
   - auditoría final.
   - BCH-44951.
   - ideal para conectarse con una queja/RMA demo si ya existe.

2. **BLACK & DECKER · NA472050**
   - Offset.
   - routing multioperación.
   - formas/paginación.
   - bache con hallazgo/no conformidad para enseñar contraste.

3. **TYCO · IS-2420**
   - Flexografía.
   - control >2h o desviación.
   - mostrar timeline industrial y análisis 4M.

Datos adicionales pueden ser demo, pero deben estar etiquetados de forma honesta y ser internamente consistentes.

---

## 12. P0 / P1 / P2

### P0 · Debe quedar en esta iteración

- refinar la tab existente `Trazabilidad`, no duplicarla;
- buscador universal;
- 3 expedientes demo coherentes;
- hero del expediente;
- cadena end-to-end;
- tabs Resumen / Materiales / Proceso / Calidad / Embarque / Documentos / Incidencias / Historial;
- timeline;
- genealogía de materiales;
- routing autorizado/ejecutado;
- gates QA;
- vínculo a baches/liberaciones;
- sugerencias moradas;
- navegación a OP y elementos QA;
- responsive y visual premium.

### P1

- integración directa con Quejas/RMA;
- navegación a pedido/factura/embarque real cuando el estado lo permita;
- filtros avanzados de timeline;
- preview de exportación.

### P2

- trazabilidad inversa por lote de materia prima: qué OPs/productos/clientes consumieron ese lote;
- búsqueda multiresultado avanzada;
- comparación de revisiones;
- análisis de recurrencia entre lotes.

---

## 13. Definition of Done

La implementación no está terminada sólo porque aparezca una pantalla nueva.

Debe cumplirse:

- visualmente premium y coherente con el resto del ERP;
- ninguna tabla gigante como pantalla principal;
- no botones muertos;
- no entidades duplicadas;
- misma OP/lote mantiene los mismos datos en todo el expediente;
- al menos 3 casos demo completos;
- búsqueda funciona;
- nodos/CTAs principales funcionan;
- responsive desktop/tablet;
- `npm run build` exitoso;
- `npm run sync:frontend` exitoso.

El resultado debe ser una de las pantallas más impresionantes del demo RTM, porque materializa la promesa de trazabilidad completa de planta y permite contar la historia del producto de extremo a extremo.
