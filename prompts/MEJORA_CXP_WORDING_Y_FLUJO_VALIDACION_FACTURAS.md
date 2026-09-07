# MEJORA CxP RTM — WORDING Y FLUJO DE VALIDACIÓN DE FACTURAS

## Objetivo
Mejorar el módulo de Cuentas por Pagar para que se sienta natural, claro y profesional en demo RTM, evitando que la jerga técnica `3-Way Match` sea protagonista visible para el usuario.

## Regla principal
El concepto técnico puede mantenerse internamente, pero en UI visible debe comunicarse en español simple:

**Orden de Compra ↔ Recepción ↔ Factura proveedor**

La pantalla debe expresar si la factura fue validada correctamente o si presenta diferencias antes de autorizar el pago.

## Cambios obligatorios de wording
Reemplazar en UI visible:

- `Cuentas por Pagar (CxP) & 3-Way Match` → `Cuentas por Pagar (CxP)`
- subtítulo técnico actual → algo como `Control de facturas de proveedores, vencimientos, pagos y validación contra compras y recepciones.`
- `BLOQUEADAS (3-WAY MATCH)` → `Facturas bloqueadas`
- `Tablero de Discrepancias 3-Way Match` → `Facturas con discrepancias`
- `3-Way Match: Todos` → `Validación: Todas`
- columna `3-WAY MATCH` → `Validación`
- badge `CONCILIADO` → `Validada`
- badge `DISCREPANCIA` → `Con diferencia`
- cualquier texto tipo `3-Way Match` visible en badges, filtros, encabezados, tabs o tooltips debe desaparecer salvo que sea estrictamente técnico dentro de un detalle expandido y secundario.

## Tabs
La navegación superior debe quedar simple:

- `Todas las facturas (N)`
- `Facturas con discrepancias (N)`

No usar `Tablero` si no aporta una vista realmente distinta.

## Vista de discrepancias
En la pestaña `Facturas con discrepancias`, cada caso debe explicar claramente qué no coincide.

Ejemplo visual:

```text
Factura proveedor: FP-774910
Proveedor: Sun Chemical México

Orden de Compra
100 cubetas
$4,250.00 c/u

Recepción
95 cubetas

Factura proveedor
100 cubetas
$4,250.00 c/u

⚠ Diferencia detectada
5 cubetas facturadas no recibidas
```

También contemplar discrepancia de precio cuando aplique:

```text
Precio OC:       $1,250.00
Precio factura:  $1,310.00
Diferencia:      +$60.00 por unidad
```

## Acciones
Para una factura válida:

- `Aprobar para pago`
- `Registrar pago` / `Pagar` según el flujo actual

Para una factura con diferencia:

- `Solicitar corrección`
- `Autorizar excepción`

No inventar reglas reales de autorización ni tolerancias RTM.

## KPIs
Mantener KPIs útiles, pero con wording orientado a negocio:

- `Total por pagar`
- `Facturas bloqueadas`
- `Pagos programados`
- `Facturas validadas`

Evitar que el KPI principal hable de `3-Way Match`.

## Tabla principal
Conservar columnas útiles:

- Factura proveedor
- Proveedor / RFC
- OC / Recepción
- Vencimiento
- Total factura
- Saldo pendiente
- Validación
- Estado de pago
- Acciones

La trazabilidad OC/recepción puede mantenerse porque sí aporta valor.

## Detalle de factura proveedor
Dentro del detalle debe mostrarse la relación documental completa:

```text
Proveedor
Factura proveedor
Orden de Compra
Recepción de almacén
Estado de validación
Estado de pago
```

Si todo coincide:

```text
✓ Factura validada
OC, recepción y factura coinciden en cantidades y precios.
```

Si existen diferencias:

```text
⚠ Factura con diferencias
Requiere revisión antes de liberar el pago.
```

## Regla de negocio demo
Mantener el concepto:

`OC → Recepción → Factura proveedor → Validación → CxP → Pago`

No eliminar la validación ni la trazabilidad. Solo simplificar la experiencia visual y el lenguaje.

## No hacer
- No eliminar CxP.
- No borrar funcionalidad de validación.
- No convertir esto en contabilidad general.
- No agregar tolerancias reales o reglas de aprobación no documentadas.
- No introducir más jerga inglesa innecesaria.
- No rehacer todo Finanzas; limitarse a CxP y componentes compartidos estrictamente necesarios.

## Auditoría de implementación
Antes de editar, revisar y reutilizar lo existente en:

- `frontend/src/components/Finanzas/CxpPage.tsx`
- `frontend/src/components/Finanzas/CxpDetailModal.tsx`
- `frontend/src/components/Finanzas/ThreeWayMatchModal.tsx`
- `frontend/src/components/Finanzas/RegistrarFacturaProveedorModal.tsx`
- `frontend/src/components/Finanzas/RegistrarPagoProveedorModal.tsx`
- `frontend/src/data/mockFinanzasData.ts`

También revisar el árbol canónico/sincronizado si existen duplicados `src/` y `frontend/src/`, siguiendo la convención actual del repo.

## Criterios de aceptación
- Cero `3-Way Match` como título, KPI, tab, filtro o columna principal visible.
- La validación OC/Recepción/Factura sigue funcionando visualmente.
- La discrepancia se entiende en menos de 5 segundos al abrirla.
- Casos correctos muestran `Validada`.
- Casos con diferencia muestran `Con diferencia`.
- Se preservan pagos parciales/totales y estados actuales de CxP.
- UI consistente con theme RTM.
- `npm run build` sin errores.
