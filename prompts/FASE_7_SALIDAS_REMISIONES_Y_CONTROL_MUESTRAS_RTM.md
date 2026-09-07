# FASE 7 — RTM: SALIDAS / REMISIONES + CONTROL DE MUESTRAS

## Objetivo

Adaptar dos módulos heredados que todavía conservan conceptos ajenos a Impresos RTM:

1. **Producto Terminado & Embarques** → convertirlo a un flujo RTM simple de **Salidas & Remisiones**.
2. **Showroom & Expos** → convertirlo a **Control de Muestras**, alineado a los procesos reales observados para Offset, Flexografía y Serigrafía.

La prioridad es **reutilizar la base actual** y eliminar el dominio retail/logístico heredado. NO construir un TMS, NO inventar flota, NO inventar sucursales, NO inventar showroom comercial y NO implementar Producción en esta fase.

---

# 0. REGLAS CRÍTICAS

Antes de modificar:

1. Trabajar únicamente en `alvaro01`.
2. Hacer pull y auditar el estado ACTUAL de la rama.
3. Revisar componentes, mocks, navegación y dependencias existentes antes de crear archivos nuevos.
4. Reusar la estructura actual siempre que sea razonable.
5. No tocar `main`.
6. No hacer merge ni PR.
7. No ejecutar ni implementar el brief bloqueado de Producción.
8. No afirmar reglas o infraestructura RTM que no estén confirmadas.
9. Todo dato inventado para demo debe ser razonable y no presentarse como política real de RTM.
10. Mantener compatibilidad con themes RTM / Navy / Graphite / Emerald.

---

# PARTE A — PRODUCTO TERMINADO & EMBARQUES → SALIDAS & REMISIONES

## 1. Decisión funcional

Para el demo RTM NO necesitamos un módulo complejo de logística, rutas y flota.

El flujo que debe mostrarse es:

```text
PEDIDO
   ↓
PRODUCTO TERMINADO DISPONIBLE / LIBERADO
   ↓
ORDEN DE SALIDA
   ↓
PREPARACIÓN / STAGING
   ↓
REMISIÓN
   ↓
SALIDA CONFIRMADA
   ↓
FACTURACIÓN
```

La unidad operativa principal es la **Orden de Salida** y su documento asociado de **Remisión**.

La remisión NO se timbra.
La factura de venta sí se genera/timbra desde Finanzas.

---

## 2. Navegación

Conservar el `NavItemKey` interno `logistica` si cambiarlo rompe demasiado código, pero cambiar el wording visible.

Sidebar:

**Antes**

`Producto Terminado & Embarques`

**Después**

`Salidas & Remisiones`

Configuración → Módulos & Navegación:

- Label: `Salidas & Remisiones`
- Descripción sugerida: `Preparación de producto terminado, órdenes de salida, remisiones y confirmación de entrega/salida a cliente.`

Debe seguir siendo encendible/apagable por toggle.

Preferencia para el demo: **oculto por default**, salvo que el estado actual del proyecto ya haya definido otra cosa de manera explícita.

---

## 3. Reutilización del módulo Embarques actual

Auditar primero:

- `frontend/src/components/Embarques/EmbarquesPage.tsx`
- `EmbarquesDashboard.tsx`
- `EnRutaTab.tsx`
- `HistorialTab.tsx`
- `ActiveRouteDetailModal.tsx`
- `AssignTransportModal.tsx`
- `RouteStopDetailModal.tsx`
- `ShippingHistoryDetailModal.tsx`
- `ShippingLoadStepModal.tsx`
- demás componentes dentro de `Embarques/`
- `frontend/src/data/mockShippingData.ts`
- `frontend/src/data/mockRemisionesData.ts`

NO borrar componentes a ciegas.

Si un componente se puede adaptar, reutilizarlo.
Si un componente solo sirve para TMS/rutas y deja de tener sentido, dejarlo sin ruta visible o simplificarlo; no mantener UI inútil solo porque existe.

---

## 4. Tabs objetivo

El módulo debe sentirse compacto.

Tabs sugeridos:

```text
Dashboard | Órdenes de salida | Remisiones | Historial
```

Eliminar del flujo visible tabs del tipo:

- En ruta
- Planeación de ruta
- Optimización
- Entregas multi-stop
- Flota
- Choferes

si actualmente existen.

No necesitamos route optimizer.

---

## 5. Dashboard de Salidas & Remisiones

Debe responder rápido:

- ¿Qué producto está listo para salir?
- ¿Qué órdenes de salida están pendientes?
- ¿Qué remisiones están listas?
- ¿Qué salidas se confirmaron hoy?
- ¿Hay alguna salida bloqueada?

KPIs sugeridos:

- `Órdenes pendientes`
- `Listas para salida`
- `Remisiones emitidas hoy`
- `Salidas confirmadas hoy`

Bloque `Requiere atención`:

Ejemplos demo:

- Pedido con PT incompleto.
- Remisión pendiente de confirmar.
- Orden detenida por revisión documental.
- Material preparado en `EMB-01` pendiente de salida.

No inventar varias rampas, múltiples CEDIS o red logística.

---

## 6. Orden de Salida

Modelo visual sugerido:

```text
OS-RTM-2026-0081

Cliente:          Cliente Industrial Demo
Pedido RTM:       PED-RTM-2026-0142
PO cliente:       PO-45001234
Fecha requerida:  09 Sep 2026
Estado:           Lista para preparar
Carril:           EMB-01

PARTIDAS
BD-MAN-024 Rev B     5,000 pzas
PT-ETQ-001          12,000 pzas

[ Preparar salida ]
```

Campos importantes:

- folio OS
- cliente
- pedido
- PO cliente
- fecha requerida
- artículo / número de parte
- revisión
- cantidad
- unidad
- lote / identificación logística cuando aplique
- ubicación origen
- carril `EMB-01`
- estado
- notas

Estados simples:

- Pendiente
- En preparación
- Lista para salida
- Salida confirmada
- Cancelada

No crear una máquina de estados innecesariamente grande.

---

## 7. Preparación / staging

Usar el concepto de staging sin inventar una red logística.

Flujo demo:

```text
Disponible PT
   ↓
Preparar salida
   ↓
Validar partidas
   ↓
Asignar a EMB-01
   ↓
Lista para remisión
```

Puede existir una interacción visual para confirmar cantidades preparadas.

NO usar QR por pieza de manera obligatoria.

Las unidades logísticas deben ser coherentes con RTM:

- tarima
- bobina / rollo
- paquete
- caja
- lote

---

## 8. Remisión

Una remisión debe surgir de una Orden de Salida preparada.

Ejemplo:

```text
REM-RTM-2026-0061

Orden de salida: OS-RTM-2026-0081
Pedido:          PED-RTM-2026-0142
Cliente:         Cliente Industrial Demo
PO cliente:      PO-45001234
Fecha:           09 Sep 2026

Artículo                Rev     Cantidad
BD-MAN-024              B        5,000 pzas
PT-ETQ-001              A       12,000 pzas

Estado: Emitida

[ Confirmar salida ]
[ Ver pedido ]
[ Generar factura ]
```

`Generar factura` debe navegar o enlazar al módulo actual de Finanzas/Facturación si existe la integración disponible.

No recapturar lo que ya existe en pedido/orden de salida.

---

## 9. Regla fiscal/documental

Debe quedar clara esta secuencia:

```text
Remisión emitida
      ↓
Salida confirmada
      ↓
Factura de venta
      ↓
Timbrado CFDI
```

PROHIBIDO mostrar:

- `Remisión timbrada`
- UUID de remisión
- `Timbrar remisión`

El timbrado pertenece a la Factura de Venta del módulo Finanzas.

---

## 10. Eliminar TMS heredado del runtime visible

Buscar y retirar del UX visible de este módulo conceptos como:

- rutas multi-stop
- estrategia de ruta
- menor distancia
- ventana de entrega
- optimización de ruta
- camiones específicos inventados
- placas NL
- choferes inventados
- San Pedro / Valle Oriente / Cumbres
- Monterrey como red logística
- traspasos a sucursales
- exposiciones como tipo de envío
- `wh-mty-norte`
- `wh-mty-sur`
- múltiples CEDIS

Si algunos identificadores internos deben conservarse temporalmente por compatibilidad, no deben aparecer como narrativa visible al usuario.

---

# PARTE B — SHOWROOM & EXPOS → CONTROL DE MUESTRAS

## 11. Decisión funcional

El módulo heredado `Showroom & Expos` NO tiene sentido para RTM en su forma actual.

Debe aprovecharse la base existente y convertirse en:

# `Control de Muestras`

El propósito es seguir muestras/proofs desde SAC y Diseño hasta autorización, calidad, preparación técnica y, cuando aplique, impresión.

Este diseño está basado en el formato real de control de muestras RTM observado para:

- Offset
- Flexografía
- Serigrafía

No convertirlo en CRM ni en gestión de eventos comerciales.

---

## 12. Navegación

Conservar internamente `showroom-expos` como key si eso evita una migración innecesaria.

Visible en Sidebar / Configuración:

**Antes:** `Showroom & Expos`

**Después:** `Control de Muestras`

Icono sugerido: `ClipboardCheck`, `FlaskConical`, `FileCheck2` o equivalente ya disponible.

Descripción en Configuración:

`Seguimiento de muestras de impresión, proof, autorización, liberación de calidad y preparación técnica por proceso.`

Debe ser toggleable.

---

## 13. Tabs objetivo

Reutilizar la estructura de cuatro tabs del módulo actual, pero transformar el significado:

```text
Dashboard | Offset | Flexografía | Serigrafía
```

No deben quedar visibles:

- Showrooms
- Expos
- Recolecciones
- Montaje
- Bahías
- Exhibición
- QR de exhibición
- Retiro de showroom
- evento externo

---

## 14. Dashboard Control de Muestras

KPIs sugeridos:

- `Muestras activas`
- `Pendientes de autorización`
- `Pendientes de Calidad`
- `En preparación técnica`
- `Liberadas este mes`

Bloque de atención:

- proof rechazado / requiere modificación
- muestra esperando autorización de cliente
- grabado rechazado por calidad
- pendiente por falta de rodillo / insumo técnico
- muestra detenida en planeación

Gráfica compacta sugerida:

- muestras por tecnología: Offset / Flexo / Serigrafía
- o tiempo promedio por etapa, claramente marcado como demo si no se calcula de histórico real

No crear BI complejo.

---

# 15. CONTROL DE MUESTRAS OFFSET

## Flujo observado

```text
Ingreso a SAC
   ↓
Solicitud en sistema
   ↓
Diseño realiza Proof y envía a SAC
   ↓
Autorización Proof (SAC / Cliente)
   ↓
Impresión a tamaño real (Diseño)
   ↓
Liberación Calidad
   ↓
Envío de archivo a CTP
   ↓
Impresión de placa CTP
   ↓
Programación Planeación
   ↓
Impresión MFG
   ↓
Liberación Calidad
```

Campos/columnas que deben poder verse en detalle:

- No. parte
- Cliente
- Fecha ingreso SAC
- Fecha solicitud sistema
- Fecha realización Proof
- Fecha autorización Proof
- Fecha impresión tamaño real
- Fecha liberación Calidad previa
- Fecha envío archivo a CTP
- Tiempo Diseño
- Fecha impresión placa CTP
- Fecha programación
- Fecha impresión MFG
- Tiempo total impresión
- Fecha liberación Calidad final
- Tiempo total Calidad
- Tiempo total
- Días laborales
- observaciones / incidencias

No es obligatorio mostrar las 17 columnas simultáneamente en tabla.

Usar tabla compacta con columnas principales y detalle/modal para el timeline completo.

---

# 16. CONTROL DE MUESTRAS FLEXOGRAFÍA

## Flujo observado

```text
Ingreso a SAC
   ↓
Solicitud en sistema
   ↓
Proof Diseño
   ↓
Autorización Proof (SAC / Cliente)
   ↓
Envío de grabado
   ↓
Recepción de grabado en Almacén
   ↓
Recepción / validación en Diseño
   ↓
Liberación Calidad
   ↓
Programación Planeación
   ↓
Impresión MFG
   ↓
Liberación Calidad final
```

Campos importantes:

- No. parte
- Cliente
- ingreso SAC
- solicitud sistema
- realización proof
- autorización proof
- envío grabado
- recepción grabado almacén
- recepción grabado diseño
- liberación calidad
- tiempo diseño
- programación
- impresión MFG
- tiempo impresión
- liberación calidad final
- tiempo calidad
- tiempo total
- observaciones

Casos demo útiles, basados en comportamientos observados:

- `Proof pendiente de autorización`
- `Cliente solicitó modificaciones`
- `Grabado rechazado por rebaba / defecto`
- `Proveedor manda reposición de grabado`
- `No se corre por falta de rodillo`

Estos textos pueden aparecer como casos demo sin afirmar que son políticas universales.

---

# 17. CONTROL DE MUESTRAS SERIGRAFÍA

## Flujo observado

```text
Ingreso a SAC
   ↓
Solicitud en sistema
   ↓
Proof y envío a SAC
   ↓
Autorización Proof
   ↓
Impresión a tamaño real
   ↓
Liberación Calidad
   ↓
Entrega de positivo a Calidad
   ↓
Liberación y entrega de positivo a Serigrafía
   ↓
Programación
```

Campos principales:

- No. parte
- Cliente
- ingreso SAC
- solicitud sistema
- proof
- autorización proof
- impresión tamaño real
- liberación calidad
- entrega positivo a Calidad
- liberación/entrega positivo a Serigrafía
- tiempo en Diseño
- tiempo total
- fecha programación

El dataset real observado de Serigrafía es pequeño; no inventar volumen exagerado.

---

# 18. Modelo común de Muestra

Crear una estructura común que soporte las tres tecnologías sin duplicar toda la lógica.

Ejemplo conceptual:

```ts
SampleRecord {
  id
  folio
  partNumber
  customerName
  technology: 'Offset' | 'Flexografía' | 'Serigrafía'
  requestedAt
  currentStage
  status
  proofStatus
  qualityStatus
  assignedArea
  elapsedBusinessDays
  notes
  timeline[]
}
```

El timeline puede guardar etapas variables por tecnología.

Evitar crear tres modelos totalmente distintos si una estructura común + etapas específicas resuelve el caso.

---

# 19. Estados de muestra

Estados simples sugeridos:

- Nueva
- En Diseño
- Esperando autorización
- En preparación técnica
- En Calidad
- Programada
- Liberada
- Rechazada / Corrección requerida

No usar veinte estados si el timeline ya muestra la etapa exacta.

Semántica:

- verde = liberada / completada
- ámbar = esperando / pendiente sensible
- rojo = rechazo / bloqueo real
- theme primary = navegación / CTA / seleccionado

---

# 20. Pantalla de detalle de muestra

Ejemplo:

```text
MUESTRA MUE-RTM-2026-0048

No. Parte     NB427776
Cliente       Cliente Industrial Demo
Tecnología    Offset
Estado        En preparación técnica
Días          7 laborales

TIMELINE
✓ 25 May  Ingreso SAC
✓ 25 May  Solicitud en sistema
✓ 26 May  Proof realizado
✓ 12 Jun  Proof autorizado
✓ 15 Jun  Impresión tamaño real
✓ 21 Jun  Calidad liberó
● 21 Jun  Archivo enviado a CTP
○          Impresión de placa
○          Programación
○          Impresión muestra
○          Liberación final

Observaciones
[ ... ]
```

Acciones demo según etapa:

- Registrar proof
- Marcar autorizado
- Solicitar corrección
- Registrar recepción de grabado
- Liberar calidad
- Marcar programada
- Marcar liberada

Las acciones deben actualizar estado/timeline localmente para que el demo sea navegable.

---

# 21. Crear nueva muestra

Botón `Nueva muestra`.

Formulario corto:

- No. parte
- Cliente
- Tecnología
- Fecha ingreso SAC
- Solicitante
- Notas

Al guardar:

- genera folio `MUE-RTM-2026-XXXX`
- estado `Nueva`
- crea primer evento timeline
- aparece en Dashboard y tab de tecnología

No crear todo el proceso de artículo ni pedido desde este modal.

---

# 22. Reutilización del módulo ShowroomExpos existente

Auditar:

- `frontend/src/components/ShowroomExpos/ShowroomExposPage.tsx`
- `Dashboard/*`
- `Showrooms/*`
- `Recolecciones/*`
- `Expos/*`
- `frontend/src/data/mockShowroomExposData.ts`

La carpeta puede conservar temporalmente su nombre interno si renombrarla causa una refactorización grande.

PERO el runtime visible y los mocks activos deben quedar 100% RTM.

No dejar objetos activos con:

- colchones
- Nayt
- Restonic
- sucursales
- showroom
- bahías
- expos
- UIDs SC
- exhibición
- precio retail
- montaje/retiro de colchón

Si hay componentes imposibles de reutilizar con sentido, retirarlos del flujo activo y reemplazar únicamente lo necesario.

---

# 23. Coherencia entre módulos

### Salidas

Debe enlazar coherentemente con:

```text
Pedido → Orden de salida → Remisión → Facturación → CxC
```

### Muestras

Por ahora debe ser autosuficiente pero preparado para enlazarse posteriormente con:

```text
Cliente / No. parte
       ↓
Control de Muestras
       ↓
Preimpresión / Herramental
       ↓
Producción
```

NO implementar esos módulos futuros en esta fase.

---

# 24. Datos mock RTM

Mantener nombres industriales y documentos coherentes con el resto del demo.

Ejemplos de muestras:

### Offset

- `NB427776 · Cliente Industrial Demo`
- `16052 · Manitowoc` solo si ya se utiliza en mocks o se etiqueta claramente como dato demo/referencia; no presentar como cliente real confirmado de RTM.

### Flexografía

- `02-055502-006 · Cliente Industrial Demo`
- caso con grabado rechazado
- caso esperando reposición

### Serigrafía

- usar pocos registros demo.

No inventar contratos ni relaciones comerciales reales.

---

# 25. Limpieza transversal obligatoria

Antes de cerrar, buscar en los archivos tocados y dependencias directas:

```bash
rg -n -i "showroom|expos|exhibici[oó]n|colch[oó]n|nayt|restonic|spring air|sealy|queen size|king size|matrimonial|sucursal|valle oriente|cumbres|san pedro|route|multi-stop|placa NL|SC-UID|supercolchones" frontend/src
```

No hacer blind replace global.

Revisar cada match y decidir si:

- es runtime activo y debe corregirse;
- es código muerto que puede retirarse;
- es un nombre técnico interno temporal no visible y no vale la pena romper compatibilidad.

El criterio es: **ningún usuario del demo debe poder activar un módulo y encontrarse Super Colchones, retail o TMS heredado.**

---

# 26. Theme compliance

Todos los CTA principales:

- `bg-theme-primary`
- `hover:bg-theme-primary-hover`

Estados semánticos pueden usar:

- emerald success
- amber warning
- rose/red danger
- blue info
- purple solo cuando sea semántico y no branding hardcodeado

Probar mínimo:

- RTM
- Graphite
- Emerald

---

# 27. Criterios de aceptación — Salidas & Remisiones

Se considera terminado cuando:

1. Sidebar muestra `Salidas & Remisiones`.
2. Configuración muestra el mismo nombre y descripción RTM.
3. No aparece TMS complejo en el flujo principal.
4. Existen órdenes de salida RTM coherentes.
5. Se puede preparar una salida.
6. Se puede emitir una remisión.
7. Se puede confirmar salida.
8. La remisión NO se timbra.
9. Puede navegarse hacia Facturación cuando aplique.
10. No aparecen colchones/sucursales/rutas heredadas.

---

# 28. Criterios de aceptación — Control de Muestras

Se considera terminado cuando:

1. Sidebar muestra `Control de Muestras`.
2. No existe `Showroom & Expos` en runtime visible.
3. Tabs visibles: Dashboard / Offset / Flexografía / Serigrafía.
4. Dashboard muestra KPIs útiles de muestras.
5. Puede crearse una muestra demo.
6. Puede abrirse su detalle/timeline.
7. Offset sigue las etapas definidas.
8. Flexo sigue las etapas definidas.
9. Serigrafía sigue las etapas definidas.
10. Puede registrarse autorización/corrección/calidad/liberación visualmente.
11. No quedan colchones, showrooms, expos, bahías ni UIDs SC en runtime.

---

# 29. Smoke test obligatorio

Probar manualmente:

### Salidas

```text
Pedido existente
→ Orden de salida
→ Preparar
→ Remisión
→ Confirmar salida
→ Liga a Facturación
```

### Muestras Offset

```text
Nueva muestra
→ Proof
→ Autorizar
→ Calidad
→ CTP
→ Programar
→ Liberar
```

### Muestras Flexo

```text
Nueva muestra
→ Proof
→ Autorizar
→ Enviar grabado
→ Recepción grabado
→ Calidad
→ Programar
→ Liberar
```

### Muestras Serigrafía

```text
Nueva muestra
→ Proof
→ Autorizar
→ Tamaño real
→ Calidad
→ Positivo
→ Programar
```

---

# 30. Build

Al terminar:

```bash
cd frontend
npm run build
```

Corregir todos los errores TypeScript/build antes de dar por terminado.

---

# 31. Entrega esperada del agente

Al terminar reportar brevemente:

1. archivos modificados;
2. qué componentes se reutilizaron;
3. qué componentes heredados quedaron fuera del runtime;
4. flujo final de Salidas & Remisiones;
5. flujo final de Control de Muestras;
6. residuos detectados/corregidos;
7. resultado de `rg`;
8. resultado de `npm run build`.

---

# FUERA DE ALCANCE

NO implementar en esta fase:

- Producción
- Órdenes de Producción
- capacidad de máquinas
- Gantt
- MES
- Calidad completa como módulo independiente
- Preimpresión completa
- Herramentales completos
- costeo industrial
- TMS
- GPS
- optimización de rutas
- flota real
- timbrado de remisiones
- backend nuevo

Esta fase es únicamente una adaptación sólida de dos módulos heredados al contexto RTM.