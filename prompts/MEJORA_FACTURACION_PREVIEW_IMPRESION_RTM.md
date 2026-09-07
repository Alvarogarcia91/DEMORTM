# MEJORA — FACTURACIÓN RTM: PREVIEW DE IMPRESIÓN / PDF

## Objetivo
Mejorar el módulo demo de Facturación de Clientes sin rehacerlo ni tocar el flujo fiscal ya implementado. El foco es convertir la acción actual de impresión en una experiencia de demo profesional: abrir una vista previa realista de la representación impresa del CFDI antes de imprimir.

## Reglas de ejecución
- Trabajar únicamente en `alvaro01`.
- Hacer pull antes de modificar.
- Auditar y reutilizar `FacturacionPage`, `FacturaDetailModal`, `mockFinanzasData`, primitives, theme y navegación existentes.
- No tocar `main`, no merge, no PR.
- No cambiar reglas de timbrado, CxC, remisiones ni estados salvo lo estrictamente necesario para el preview.
- Esto sigue siendo DEMO: no SAT/PAC real, no PDF fiscal real, no XML real.

## Problema actual
`FacturaDetailModal` ya se presenta como `Representación Impresa CFDI 4.0 (Demo)` pero el botón `Imprimir` ejecuta directamente `window.print()` sobre la aplicación completa. Eso no se siente como un ERP terminado y puede imprimir sidebar/topbar/modal/backdrop.

## Resultado esperado
Al presionar imprimir desde una factura debe abrirse un **Preview de impresión** dedicado antes del diálogo nativo del navegador.

Flujo:

`Facturación -> Ver factura -> Vista previa -> Imprimir`

También permitir acceso directo desde la tabla cuando la factura sea visible mediante una acción con icono de impresora si cabe sin ensuciar la tabla.

---

## 1. Nuevo preview dedicado
Crear un componente reutilizable, por ejemplo:

`frontend/src/components/Finanzas/FacturaPrintPreviewModal.tsx`

No es obligatorio ese nombre si la arquitectura actual sugiere otro, pero debe quedar separado del detail modal.

### Layout
Modal fullscreen/large, fondo neutro de aplicación y al centro una hoja blanca A4 visual.

Header del modal fuera de la hoja:
- `Vista previa de impresión`
- folio de factura
- botón `Cerrar`
- botón primario `Imprimir`
- botón secundario `Descargar PDF` DEMO

`Descargar PDF` no genera PDF fiscal real. Puede mostrar toast/banner: `PDF generado en modo demostración` o equivalente coherente con el resto del demo.

### Hoja A4
Debe parecer una representación impresa profesional, NO otra card del ERP.

Incluir dentro de la hoja:

#### Encabezado
- Logo RTM existente (`/assets/logo-rtm.svg`)
- `IMPRESOS RTM`
- texto `Representación impresa CFDI 4.0 · DEMO`
- Tipo de comprobante: `I - Ingreso`
- Serie / folio de la factura actual
- Fecha de emisión
- Lugar de expedición

No inventar dirección fiscal nueva. Si los mocks actuales ya tienen emisor demo, reutilizar esos valores. Si algún dato es claramente demo, no ocultarlo como dato confirmado de RTM.

#### Emisor / Receptor
Dos columnas claras:

**Emisor**
- razón social demo actual
- RFC actual
- régimen fiscal actual

**Receptor**
- cliente
- RFC
- régimen fiscal
- CP
- uso CFDI

#### Datos comerciales / trazabilidad
Bloque compacto:
- Pedido origen, si existe
- Remisión origen, si existe
- método de pago PUE/PPD
- forma de pago
- moneda

Debe reforzar visualmente el flujo RTM:
`Pedido -> Remisión -> Factura`

#### Conceptos
Tabla imprimible con:
- clave SAT
- SKU / número de parte
- descripción
- cantidad
- unidad
- precio unitario
- importe
- IVA

Usar los `invoice.items` existentes; no inventar conceptos adicionales.

#### Totales
Alineados a la derecha:
- Subtotal
- IVA
- Total
- Moneda

Agregar una línea `Total con letra` únicamente si se puede producir localmente de forma simple y coherente; si requiere una implementación desproporcionada, omitirla en esta fase.

#### Datos fiscales
Para factura timbrada:
- UUID
- fecha/hora de timbrado
- certificado demo actual, si ya existe
- cadena/sello demo en tipografía pequeña
- QR visual de demostración

IMPORTANTE: si actualmente el QR es únicamente un icono de Lucide, mejorar el preview con un **QR visual convincente de demo** generado localmente si ya existe librería/utilidad; no agregar dependencia pesada solo por esto. Si no existe, un placeholder cuadriculado claramente demo es aceptable.

Para borrador/lista para timbrar:
- no fingir UUID
- marca diagonal o badge visible `BORRADOR · SIN VALIDEZ FISCAL`

#### Pie
- `Este documento es una representación impresa de demostración del flujo CFDI 4.0 del ERP RTM.`
- número de página `1 / 1`

---

## 2. Comportamiento de impresión
El botón `Imprimir` del preview debe imprimir **solo la hoja de factura**.

Implementar estilos `@media print` o una estrategia equivalente simple:
- ocultar sidebar/topbar/backdrop/acciones
- imprimir fondo blanco
- tamaño A4
- márgenes apropiados
- evitar cortes feos en tablas
- preservar legibilidad en escala de grises

NO abrir una ruta nueva si no hace falta.

NO usar screenshots para imprimir.

---

## 3. Integración con `FacturaDetailModal`
Reemplazar el `window.print()` directo actual.

Botón actual:
`Imprimir`

debe abrir:
`FacturaPrintPreviewModal`

El detail modal debe seguir mostrando información operativa/fiscal y conservar sus acciones actuales.

No duplicar lógica de negocio; el preview recibe el objeto `SalesInvoice`.

---

## 4. Acción desde tabla
Auditar `FacturacionPage`.

Si la columna Acciones tiene espacio suficiente:
- ojo = detalle
- impresora = preview
- timbrar = cuando aplique

Usar tooltip claro `Vista previa / Imprimir`.

Si agregar otro icono empeora la densidad, mantenerlo únicamente dentro del detalle.

---

## 5. Calidad visual
El preview debe sentirse distinto al resto del ERP:
- hoja blanca A4
- tipografía pequeña y precisa
- bordes finos
- información fiscal compacta
- logo RTM
- mucho menos radio de esquina dentro del documento
- números alineados
- `font-mono` en RFC, UUID, folios y importes cuando ayude

No usar tarjetas enormes dentro de la factura.
No usar colores llamativos innecesarios.
Semánticos únicamente para estado fuera de la hoja.

---

## 6. Casos demo obligatorios
Validar al menos:

### Caso A — Factura timbrada PPD
- UUID visible
- origen por remisión
- saldo/cobranza no tiene que aparecer en la representación fiscal salvo que el diseño lo trate como referencia no fiscal
- impresión funciona

### Caso B — Factura timbrada PUE
- estado timbrada
- forma de pago visible
- impresión funciona

### Caso C — Lista para timbrar / borrador
- sin UUID falso
- watermark/leyenda `BORRADOR · SIN VALIDEZ FISCAL`
- preview imprimible

---

## 7. No alcance
No implementar en esta mejora:
- PAC real
- SAT real
- XML CFDI real
- cancelación SAT
- complemento de pago real
- envío de correo real
- almacenamiento real de PDF/XML
- cambios grandes a CxC
- rediseño completo de Facturación

---

## 8. Validación final
Antes de terminar:
1. Abrir factura timbrada -> preview.
2. Abrir factura borrador -> preview.
3. Comprobar que el preview usa datos de la factura seleccionada.
4. Verificar que `Imprimir` no imprime sidebar/topbar.
5. Verificar responsive: en pantalla chica la hoja puede escalar/scroll horizontal sin romper contenido.
6. Ejecutar `npm run build` en el frontend canónico y corregir errores.
7. Si existe proceso `sync:frontend`, respetar la arquitectura actual del repo y no dejar los dos árboles divergentes.

## Criterio de aceptación
La demo debe permitir enseñar esta secuencia sin explicar trucos:

`Factura -> Ver detalle -> Vista previa de representación impresa -> Imprimir`

El usuario debe percibir un documento fiscal demo listo para entregar/imprimir, no la UI del ERP mandada directamente al navegador.