# RTM DEMO — FASE 3
## Compras + Cotizaciones + Pedidos

Trabaja SOLO en `Alvarogarcia91/DEMORTM`, rama `alvaro01`.

## Objetivo
Adaptar los módulos YA EXISTENTES de Compras, Cotizaciones y Pedidos al dominio realista de Impresos RTM, sin rehacer el shell ni crear backend nuevo.

Flujos demo objetivo:

`Cotización → autorización/aceptación → Pedido → disponibilidad PT → faltante por producir`

`Necesidad de material → Por comprar/Requisición → Orden de compra → Recepción en Operaciones de Almacén`

## Auditoría actual confirmada

### Compras ya existe
Reutilizar:
- `frontend/src/components/Compras/Ordenes/ComprasDashboard.tsx`
- `ComprasTab.tsx`
- `PorComprarList.tsx`
- `PurchaseOrderCreateWizardModal.tsx`
- `PurchaseOrderDetailModal.tsx`
- `PurchaseOrdersList.tsx`
- Requisiciones y Proveedores existentes.

La navegación actual `Dashboard / Por comprar / Órdenes de compra` se conserva.

### Cotizaciones ya existe
Reutilizar:
- `frontend/src/components/Ventas/CotizacionesPage.tsx`
- dashboard, listado, wizard, detalle y autorización existentes.

### Pedidos ya existe
Reutilizar:
- `frontend/src/components/Ventas/PedidosPage.tsx`
- dashboard, pendientes de autorización, listado, detalle y autorización existentes.

### Problema importante detectado
`frontend/src/data/mockSalesData.ts` sigue fuertemente heredado de Super Colchones: listas retail, sucursales, promociones, SKUs `SC-*`, Nayt/Restonic/etc.
Debe adaptarse de forma centralizada antes de maquillar pantallas aisladas.

También existen restos retail visibles como `showroom` en wording de Pedidos. Eliminarlos.

## Reglas de implementación
- NO borrar módulos.
- NO rehacer componentes que ya funcionan.
- NO crear router nuevo.
- NO meter backend/DB.
- NO presentar cálculos demo como reglas reales confirmadas de RTM.
- Mantener theme dinámico: branding/CTA/selección/focus usa `theme-primary`; rojo/verde/ámbar solo semántica.
- Mantener mocks consistentes entre Cotizaciones, Pedidos, Compras, Inventario y Recepción.

# 1. Datos comerciales RTM primero

Adaptar `mockSalesData.ts` y datos relacionados para eliminar del flujo visible:
- colchones
- showroom
- sucursales retail
- promociones de tienda
- SKUs `SC-*`
- Nayt / Spring Air / Restonic / América
- stock local por sucursal

No es necesario destruir interfaces compartidas si hacerlo rompe demasiado. Se pueden conservar nombres internos temporalmente, pero la UI/mocks visibles deben ser RTM.

Usar ejemplos industriales demo coherentes:
- Cliente Industrial Demo
- Black & Decker solo si ya está soportado por información del proyecto
- Manual instructivo 24 páginas
- Manual instructivo 48 páginas
- Blister card
- Etiqueta autoadherible en rollo
- Tag impreso

Tecnología:
- Offset
- Flexografía

Campos comerciales relevantes:
- cliente
- PO/pedido cliente
- número de parte / artículo
- revisión
- cantidad
- unidad
- tecnología
- fecha requerida

# 2. Cotizaciones

Conservar `Dashboard / Cotizaciones / Nueva cotización / detalle / autorización`.

Adaptar el cotizador retail a una cotización industrial SIMPLE.

Mostrar:
- Cliente
- Artículo/número de parte o descripción de trabajo
- Revisión
- Tecnología Offset/Flexo
- Cantidad
- Unidad comercial
- Fecha requerida
- Especificación resumida

## Costeo
NO construir motor real de costeo.

Mostrar un `Resumen estimado` MOCK:
- Materiales
- Proceso/máquina
- Acabados
- Setup
- Merma estimada
- Costo estimado
- Margen
- Precio propuesto

Agregar leyenda discreta de demo cuando aplique.

La infraestructura actual de `priceLists` puede conservarse técnicamente si es necesaria, pero reinterpretarla como condición/tarifa/convenio comercial. No dejar `Lista General Retail`, `Lista Promoción Agosto`, sucursales, etc.

Mantener autorización y estados:
- Borrador
- Pendiente de autorización
- Autorizada
- Enviada al cliente
- Aceptada
- Rechazada
- Vencida
- Convertida en pedido

`Convertir en pedido` debe seguir usando el flujo existente y navegar al pedido generado.

# 3. Pedidos

Es el puente comercial hacia Producción.

Conservar tabs:
- Dashboard
- Pendientes de autorización
- Pedidos

Eliminar wording retail/showroom.

En detalle mostrar:
- Folio interno
- PO/pedido cliente
- Cliente
- Número de parte / artículo
- Revisión
- Tecnología
- Cantidad pedida
- Unidad
- Fecha requerida
- Estado
- Cotización origen si aplica

## Disponibilidad
Agregar/afinar bloque de disponibilidad usando datos mock coherentes con Inventario:
- Cantidad pedida
- PT disponible
- Cantidad reservable
- Faltante por producir

Ejemplo demo:
`Pedido 30,000 pzas / PT disponible 5,000 / faltan 25,000 por producir`.

No generar todavía OP real.
CTA permitido: `Preparar para producción` con toast/modal demo, claramente sin backend.

## Material insuficiente
Si el caso mock tiene faltante de material, mostrar alerta y permitir navegar a Requisiciones/Por comprar usando la navegación existente.

Wording: `Requerimiento estimado para demo` si todavía no existe BOM real.

No fingir cálculo exacto de materiales.

## Revisión
Mostrar revisión claramente y warning semántico si el mock usa una revisión obsoleta.

# 4. Compras

Conservar:
- Dashboard
- Por comprar
- Órdenes de compra

## Dashboard
Adaptar KPIs a RTM:
- Por comprar
- OC abiertas
- OC atrasadas
- Entregas esperadas
- Recepciones parciales
- Materiales críticos

## Por comprar
Cada necesidad debe mostrar, si ya cabe en la arquitectura actual:
- material
- clave/SKU
- UOM
- cantidad requerida
- disponible
- faltante
- fecha requerida
- origen
- prioridad

Origen demo:
- stock mínimo
- pedido cliente
- OP/planeación futura
- reposición manual

## Orden de compra
Adaptar wizard/detail existentes.

Campos visibles mínimos:
- Folio OC
- Proveedor
- Fecha
- Fecha requerida
- Moneda
- Condiciones
- Almacén destino: `Almacén Principal RTM`
- Partidas
- UOM
- Precio unitario
- Subtotal
- Total
- Notas

Estados:
- Borrador
- Pendiente de autorización
- Emitida
- Parcialmente recibida
- Recibida
- Cerrada
- Cancelada

Mantener navegación existente hacia Recepción/Operaciones de Almacén.

Caso demo útil:
`16 cubetas solicitadas / 12 recibidas / 4 pendientes`.

# 5. Clientes

No desarrollar CRM.
Adaptar solo lo que usan Cotizaciones/Pedidos:
- razón social/nombre
- RFC si ya existe
- contacto
- correo
- teléfono
- moneda
- condición comercial

Quitar sucursal favorita/showroom y atributos retail visibles.

# 6. Mocks coherentes

Usar UNA narrativa reutilizable entre módulos.

Ejemplo sugerido:
- Cotización `COT-RTM-2026-0108`
- Pedido `PED-RTM-2026-0142`
- Artículo `Manual instructivo 24 páginas`
- Parte `BD-MAN-024`
- Rev `B`
- Tecnología `Offset`
- Cantidad `30,000 pzas`
- PT disponible `5,000`
- Faltante `25,000`
- Material crítico `Papel Couché 90 g`
- Necesidad/OC relacionada
- Recepción en `Almacén Principal RTM`

No es obligatorio usar exactamente esos folios si ya existen mocks RTM equivalentes; priorizar consistencia con la rama actual.

# 7. Theme compliance

Auditar TODO lo tocado.

CTA normal:
- `bg-theme-primary`
- `hover:bg-theme-primary-hover`
- `text-theme-primary`
- `border-theme-primary`
- `ring-theme-primary`

No dejar colores de marca hardcodeados.

Ejemplo detectado en Compras: `Atender Requisiciones` usa verde fijo. Si es CTA principal normal, debe usar theme; verde solo si representa éxito semántico.

# 8. Documentación vieja

`docs/ventas-basico-demo.md` contiene especificación heredada de Super Colchones y además aparecen marcadores de conflicto (`<<<<<<< HEAD`).
No usarla como fuente de verdad para implementar RTM.
No gastar tiempo reescribiéndola completa salvo que sea necesario para dejar el repo limpio; la fuente de esta fase es ESTE archivo.

# 9. No hacer

NO implementar todavía:
- OP real
- producción completa
- BOM definitiva
- motor exacto de costeo
- CFDI
- CxC/CxP
- pagos
- CRM completo
- pricing real parametrizado

# 10. Validación

Al terminar:
1. `npm run build`
2. Corregir TypeScript.
3. Probar Cotización → Pedido.
4. Probar Pedido → Requisición/Por comprar cuando aplique.
5. Probar OC → Recepción.
6. Probar theme dinámico en pantallas modificadas.
7. Buscar rastros visibles de Super Colchones/retail en estos módulos.
8. No hacer merge ni PR.

## Entrega
Resumen corto:
- archivos modificados
- qué se reutilizó
- qué se adaptó
- flujo funcional logrado
- build
- pendientes reales
