# RTM DEMO — FASE 3
## Compras + Cotizaciones + Pedidos adaptados a Impresos RTM

Trabaja sobre:

- Repo: `Alvarogarcia91/DEMORTM`
- Rama: `alvaro01`

> Este documento es un prompt de implementación. Antes de tocar código, hacer auditoría del estado actual de la rama porque Compras, Cotizaciones y Pedidos ya existen y deben ADAPTARSE, no rehacerse desde cero.

---

# 1. OBJETIVO

Convertir los módulos heredados del demo de Super Colchones en un flujo comercial/abastecimiento coherente para Impresos RTM.

No buscamos implementar todavía ERP financiero completo, CFDI, CxC, CxP ni producción completa.

Queremos que el demo pueda contar estas dos historias:

## Flujo comercial

`Cotización → aceptación/autorización → Pedido → validación de disponibilidad → reserva de PT / faltante → futura OP`

## Flujo de abastecimiento

`Necesidad de material → Requisición / Por comprar → Orden de compra → Recepción en Operaciones de Almacén`

El sistema debe sentirse industrial y hecho para una imprenta, no retail.

---

# 2. REGLA PRINCIPAL: REUTILIZAR

Ya existen componentes muy desarrollados.

NO eliminar ni rehacer por gusto:

## Compras

- `frontend/src/components/Compras/Ordenes/ComprasDashboard.tsx`
- `ComprasTab.tsx`
- `PorComprarList.tsx`
- `PurchaseOrderCreateWizardModal.tsx`
- `PurchaseOrderDetailModal.tsx`
- `PurchaseOrdersList.tsx`
- requisiciones y proveedores existentes

## Cotizaciones

- `frontend/src/components/Ventas/CotizacionesPage.tsx`
- Dashboard
- listado
- wizard de creación
- detalle
- autorización
- alta rápida de cliente

## Pedidos

- `frontend/src/components/Ventas/PedidosPage.tsx`
- Dashboard
- pendientes de autorización
- listado
- detalle
- autorización

Usar el shell, modales, design system, theme dinámico y estado compartido actual.

---

# 3. CONTEXTO RTM A RESPETAR

RTM no es una comercializadora; es una empresa de producción gráfica.

En exploración se confirmó:

- Servicio al Cliente captura los pedidos.
- El pedido contiene normalmente número de pedido, cliente y artículo/número de parte.
- Pedido → posteriormente Orden de Producción.
- Los artículos pueden tener revisión y esa revisión importa para producción y trazabilidad.
- Al capturar un pedido debería poder detectarse desde temprano si falta material.
- Si no hay material, el sistema debería alertar y disparar necesidad hacia Compras.
- Producto terminado existente debe poder comprometerse/reservarse al pedido antes de producir el faltante.
- La cantidad a producir puede ser mayor al faltante por mínimo económico de producción.
- RTM trabaja principalmente Offset y Flexografía.
- El costo depende de materiales, mano de obra/proceso y características técnicas; no tratar el negocio como venta retail de SKU con precio fijo universal.

Por lo tanto:

> NO conservar conceptos retail de sucursal, showroom, colchones, promociones de tienda o stock local por sucursal.

---

# 4. ALCANCE DE ESTA FASE

Esta fase adapta:

1. Compras
2. Cotizaciones
3. Pedidos
4. conexión visual entre ellos e Inventario

NO implementar todavía:

- motor real de costeo de impresión
- BOM productiva definitiva
- generación real de OP
- planeación de máquinas
- CFDI
- cuentas por cobrar
- cuentas por pagar
- pagos
- proveedores fiscales complejos
- portal cliente
- CRM completo

Cuando algo dependa de Producción futura, mostrarlo como estado/demo y no inventar backend.

---

# 5. COMPRAS — ADAPTAR LO EXISTENTE

La estructura actual de Compras ya sirve:

- Dashboard
- Por comprar
- Órdenes de compra

Mantener esos tres tabs.

## 5.1 Dashboard de Compras

Debe responder:

- materiales por comprar
- órdenes abiertas
- órdenes atrasadas
- entregas esperadas
- monto comprometido
- recepciones parciales
- materiales críticos por cobertura
- compras relacionadas a faltantes de pedidos/OP

Eliminar métricas retail.

Ejemplos RTM:

- Papel Couché 90 g
- BOPP Blanco 50 micras
- Papel térmico autoadherible
- Tinta Process Black
- Tinta PMS 186 C
- Barniz UV
- Cajas corrugadas
- Cores

## 5.2 Por comprar

Mantener el concepto de requisiciones listas para compra.

Cada necesidad debe poder mostrar:

- material
- SKU / clave interna
- UOM
- cantidad requerida
- existencia disponible
- cantidad faltante
- fecha requerida
- motivo
- origen
- prioridad

Origen demo posible:

- Stock mínimo
- Pedido de cliente
- OP / planeación
- Reposición manual
- Mantenimiento / insumo interno

No inventar integración real si aún no existe.

## 5.3 Orden de compra

Adaptar wizard actual.

Campos mínimos visibles:

- Folio OC
- Proveedor
- Fecha
- Fecha requerida
- Moneda
- Condiciones
- Almacén destino: `Almacén Principal RTM`
- partidas
- UOM
- precio unitario
- subtotal
- impuestos si ya existe cálculo mock
- total
- notas

Estados demo sugeridos:

- Borrador
- Pendiente de autorización
- Emitida
- Parcialmente recibida
- Recibida
- Cerrada
- Cancelada

Conservar navegación existente hacia recepción de almacén.

La acción `Recibir` / `Ver recepción` debe llevar a `Operaciones de Almacén` usando la navegación ya existente.

## 5.4 Recepción parcial

Debe poder verse en detalle:

Ejemplo:

OC: 16 cubetas de tinta
Recibido: 12
Pendiente: 4
Estado: `Parcialmente recibida`

No crear lógica compleja adicional si ya existe el concepto; adaptar mocks y wording.

---

# 6. COTIZACIONES — CAMBIO DE DOMINIO IMPORTANTE

El módulo actual funciona como cotizador retail con listas de precios por producto.

Eso NO representa correctamente a RTM.

No borrarlo: adaptar la experiencia para que funcione como una cotización industrial simplificada.

## 6.1 Estructura

Mantener:

- Dashboard
- Cotizaciones
- Nueva cotización
- detalle
- autorización

## 6.2 Qué se cotiza

Una cotización RTM debe estar ligada a:

- Cliente
- Número de parte / artículo existente, o descripción de trabajo
- Revisión cuando aplique
- Tecnología: Offset / Flexografía
- Cantidad solicitada
- Unidad comercial
- Fecha requerida
- especificación resumida

Ejemplos de producto terminado demo:

- Manual instructivo 24 páginas
- Manual instructivo 48 páginas
- Blister card
- Etiqueta autoadherible en rollo
- Tag impreso

## 6.3 NO construir todavía el motor real de costeo

Muy importante:

No fingir que ya existe un algoritmo preciso de costo de impresión.

Para demo, mostrar un `Resumen estimado` compuesto por:

- Materiales estimados
- Proceso / máquina
- Acabados
- Setup
- Merma estimada
- Costo estimado
- Margen
- Precio propuesto

Los valores son MOCK.

Agregar leyenda discreta:

`Estimación demo. El motor de costeo productivo será parametrizado con capacidades, materiales, tiempos y reglas RTM.`

## 6.4 Listas de precios existentes

No eliminar infraestructura si está compartida.

Pero no hacer de `lista de precios retail` el centro del flujo.

Puede reinterpretarse como:

- Lista / condición comercial del cliente
- tarifa base
- convenio comercial
- moneda

Si el componente actual depende demasiado de priceLists, conservar técnicamente el objeto pero cambiar labels y mocks para RTM.

## 6.5 Descuentos y autorización

Mantener la UX actual de autorización.

Mostrar:

- precio propuesto
- margen estimado
- descuento comercial
- requiere autorización sí/no
- motivo

Los umbrales actuales pueden seguir siendo demo, siempre que estén centralizados y no se presenten como política real confirmada de RTM.

## 6.6 Estados

Mantener/adaptar:

- Borrador
- Pendiente de autorización
- Autorizada
- Enviada al cliente
- Aceptada
- Rechazada
- Vencida
- Convertida en pedido

---

# 7. PEDIDOS — EL MÓDULO MÁS IMPORTANTE DE LOS TRES

Servicio al Cliente captura el pedido y este es el puente comercial hacia producción.

El módulo debe dejar de hablar de showroom o retail.

## 7.1 Mantener tabs

- Dashboard
- Pendientes de autorización
- Pedidos

## 7.2 Campos centrales del pedido

Mostrar como mínimo:

- Folio pedido interno
- Pedido / PO cliente
- Cliente
- Número de parte / artículo
- Revisión
- Tecnología
- Cantidad pedida
- Unidad
- Fecha requerida
- Estado
- Cotización origen si aplica

## 7.3 Disponibilidad desde el pedido

Esta es una pieza crítica para RTM.

En detalle de pedido mostrar bloque:

### Disponibilidad

- Cantidad pedida
- Producto terminado disponible
- Cantidad reservable
- Cantidad faltante
- Materiales críticos / alerta general

Ejemplo:

Pedido: 30 rollos
PT disponible: 15
Reservar: 15
Faltante: 15

Mostrar claramente:

`15 unidades pueden cubrirse desde producto terminado. Restan 15 por producir.`

NO generar todavía una OP real si el módulo Producción aún no está implementado.

Agregar CTA demo:

`Preparar para producción`

que puede mostrar modal/resumen y toast:

`Solicitud preparada para planeación (demo)`

sin crear backend falso.

## 7.4 Mínimo económico de producción

Mostrar en el resumen cuando aplique:

Faltante pedido: 15
Mínimo sugerido de producción: 20
Excedente estimado: 5

Esto debe ser informativo/demo por ahora.

No inventar fórmula real.

## 7.5 Alerta de materiales desde Pedido

Si el mock de inventario indica faltante de material, mostrar:

`Material insuficiente`

con detalle ejemplo:

Requerido: 25,000 pliegos
Disponible: 18,000
Faltante: 7,000

CTA:

`Enviar a Compras`

Si ya existe navegación a requisiciones, reutilizarla.

Debe abrir/preparar una requisición demo con el material relacionado.

No permitir que el usuario piense que el sistema ya calculó una BOM real si aún no existe.

Usar wording:

`Requerimiento estimado para demo`

## 7.6 Revisión del artículo

Mostrar claramente revisión en pedido.

Ejemplos:

`BD-10482 · Rev. B`

Si el pedido refiere a revisión obsoleta, mostrar warning semántico:

`Revisión no vigente`

No desarrollar todavía workflow completo de obsolescencia; solo respetar el concepto en mocks y UI.

---

# 8. CLIENTES

No es foco de esta fase, pero Cotizaciones y Pedidos dependen del catálogo actual.

Adaptar solo lo necesario para eliminar retail:

- quitar sucursal favorita / showroom
- conservar razón social / nombre
- RFC si ya existe
- contacto
- correo
- teléfono
- moneda
- condiciones comerciales
- crédito como dato demo si ya existe

No desarrollar CRM.

---

# 9. DATOS MOCK COHERENTES

No usar clientes inventados diferentes en cada pantalla.

Crear un set coherente de demo reutilizable.

Clientes posibles ya mencionados en exploración / operación:

- Black & Decker
- Medifarma / cliente farmacéutico demo si ya está en mocks

Si un nombre real no está suficientemente soportado por los datos actuales del repo, usar `Cliente Industrial Demo`.

Ejemplo de cadena:

Cotización:
`COT-RTM-2026-0108`

Cliente:
`Black & Decker`

Artículo:
`Manual instructivo 24 páginas`

Número de parte:
`BD-MAN-024`

Revisión:
`B`

Cantidad:
`30,000 pzas`

Tecnología:
`Offset`

→ Pedido:
`PED-RTM-2026-0142`

→ disponibilidad PT:
`5,000 pzas`

→ faltante producción:
`25,000 pzas`

→ material estimado insuficiente:
`Papel Couché 90 g`

→ requisición demo

→ OC a proveedor

→ recepción en Almacén Principal RTM

La información debe permanecer consistente entre pantallas.

---

# 10. DASHBOARDS

No sobrecargar.

## Compras

KPIs sugeridos:

- Por comprar
- OC abiertas
- Entregas esta semana
- OC atrasadas
- Recepciones parciales

## Cotizaciones

- Abiertas
- Pendientes autorización
- Aceptadas
- Conversión a pedido
- Valor cotizado

## Pedidos

- Pedidos abiertos
- Por autorizar
- Con cobertura PT
- Con faltante por producir
- Con alerta de material
- Próximos a fecha requerida

Eliminar analytics retail como:

- showroom
- sucursal
- marca de colchón
- vendedor retail por tienda

---

# 11. THEME

Toda acción primaria debe obedecer theme dinámico:

- `bg-theme-primary`
- `hover:bg-theme-primary-hover`
- `text-theme-primary`
- `border-theme-primary`
- `ring-theme-primary`

Color fijo únicamente para semántica:

- rojo = error/crítico/rechazo
- verde = success
- ámbar = pendiente/riesgo
- azul = info
- morado = smart/recomendación

No volver a introducir rojo Super Colchones como branding.

---

# 12. NAVEGACIÓN CRUZADA

Conservar y fortalecer navegación ya existente.

Debe ser posible:

### Cotización

`Convertir en pedido`

→ abre/navega a Pedido generado.

### Pedido

`Enviar faltante a Compras`

→ Requisiciones / Por comprar.

### Orden de compra

`Ver recepción`

→ Operaciones de Almacén / Entradas.

No crear router nuevo.

Usar el estado de navegación existente en `DashboardShell`.

---

# 13. NO HACER

NO:

- borrar módulos porque estén ocultos
- meter backend real
- crear motor de pricing falso presentado como definitivo
- crear cálculo de consumo productivo complejo sin Producción/BOM
- convertir Cotizaciones en tienda retail
- usar sucursales/showroom
- hardcodear azul o rojo de branding
- tocar `main`
- hacer merge
- abrir PR

Trabajar únicamente en `alvaro01`.

---

# 14. ORDEN DE IMPLEMENTACIÓN

1. Auditoría real de los tres módulos en `alvaro01`.
2. Adaptar mocks compartidos de ventas/compras.
3. Cotizaciones: quitar retail y convertir a cotización industrial simplificada.
4. Pedidos: adaptar dominio y agregar disponibilidad/reserva/faltante visual.
5. Compras: adaptar materiales, OC y conexión a recepción.
6. Navegación cruzada.
7. Dashboards.
8. Barrido de Super Colchones / showroom / sucursal / colchones.
9. Validación theme.
10. `npm run build`.

---

# 15. CRITERIOS DE ACEPTACIÓN

La fase está lista si puede demostrarse:

## Caso A

Cotización industrial
→ autorización
→ aceptación
→ convertir a pedido.

## Caso B

Pedido
→ ver cobertura de PT
→ reservar disponible conceptualmente
→ detectar faltante.

## Caso C

Pedido con material insuficiente
→ alerta
→ mandar requerimiento a Compras.

## Caso D

Compras
→ requisición lista
→ crear OC
→ emitir
→ navegar a recepción.

## Caso E

Cambiar theme
→ todos los CTAs normales cambian con theme
→ estados semánticos conservan su color.

---

# 16. ENTREGA

Al terminar reportar únicamente:

- archivos modificados
- qué se reutilizó
- qué conceptos retail fueron eliminados
- flujo Cotización → Pedido validado
- flujo Pedido → Compras validado
- flujo OC → Recepción validado
- resultado de `npm run build`
- pendientes para Producción/Costeo real
