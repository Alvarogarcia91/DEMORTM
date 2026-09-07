# RTM DEMO — FASE 4
## Ventas RTM: Clientes + Cotizaciones + Pedidos

Trabaja sobre:

- Repo: `Alvarogarcia91/DEMORTM`
- Rama: `alvaro01`

> Antes de tocar código, audita el estado actual. Fase 3 ya adaptó parcialmente Compras, Cotizaciones y Pedidos a RTM. Esta fase NO rehace esos módulos: los termina de aterrizar y conecta bien el flujo comercial `Cliente → Cotización → Pedido`.

---

# 1. OBJETIVO

Dejar un módulo comercial coherente y presentable para Impresos RTM usando lo que ya existe.

Flujo objetivo:

`Cliente → Cotización → autorización → aceptación → convertir a Pedido → autorización de Pedido → disponibilidad / faltante`

No implementar Producción todavía.
No crear OP.
No agregar máquinas.
No inventar MES.

Cuando un pedido tenga faltante, únicamente mostrar el estado y los CTA/demo ya existentes como preparación futura para Producción o envío a Compras.

---

# 2. REGLA PRINCIPAL: REUTILIZAR

Ya existen y deben conservarse:

## Clientes
- `frontend/src/components/Ventas/ClientesPage.tsx`
- `ClientesDashboard`
- `ClientesList`
- `ClientDetailModal`
- `QuickClientFormModal`

## Cotizaciones
- `frontend/src/components/Ventas/CotizacionesPage.tsx`
- `CotizacionesDashboard`
- `CotizacionesList`
- `CreateQuoteWizardModal`
- `QuoteDetailModal`
- `QuoteAuthorizationModal`

## Pedidos
- `frontend/src/components/Ventas/PedidosPage.tsx`
- `PedidosDashboard`
- `PendingAuthorizationOrdersList`
- `PedidosList`
- `OrderDetailModal`
- `OrderAuthorizationModal`

## Datos
- `frontend/src/data/mockSalesData.ts`

NO rehacer módulos desde cero.
NO crear router nuevo.
NO duplicar estado que ya vive en `DashboardShell`.

---

# 3. ESTADO ACTUAL A RESPETAR

Fase 3 ya cambió bastante dominio retail por industrial:

- tarifas comerciales industriales;
- números de parte;
- revisiones;
- clientes industriales;
- productos impresos;
- tecnología Offset/Flexo en varios mocks;
- cobertura de PT/faltante en Pedidos;
- conexión a Compras/Requisiciones;
- theme dinámico en acciones principales.

Antes de modificar, revisar qué ya está hecho y evitar regresiones.

---

# 4. CLIENTES — TERMINAR ADAPTACIÓN RTM

Clientes debe sentirse B2B industrial, no retail.

## 4.1 Dashboard

Mantener estructura actual, pero mostrar métricas útiles para demo:

- Clientes activos
- Clientes con cotizaciones abiertas
- Clientes con pedidos abiertos
- Clientes con condiciones comerciales especiales
- Valor cotizado del periodo
- Pedidos del periodo

Eliminar referencias retail si aún existen:

- sucursal favorita
- showroom
- piso de venta
- consumidor final
- hotelería/retail de colchones

## 4.2 Listado

Campos recomendados:

- Cliente / razón social
- RFC si ya existe
- Contacto principal
- Correo
- Moneda
- Condición comercial
- Cotizaciones abiertas
- Pedidos abiertos
- Último movimiento

## 4.3 Detalle de Cliente

Aprovechar el modal existente y organizarlo para RTM:

### Resumen
- razón social
- RFC
- contacto
- correo
- teléfono
- moneda
- condición comercial
- tarifa/convenio asignado

### Actividad comercial
- últimas cotizaciones
- últimos pedidos

### Acciones
- `Nueva cotización`
- `Ver cotizaciones`
- `Ver pedidos`

Si existe navegación cruzada, reutilizarla.

## 4.4 Alta rápida

Mantener QuickClientFormModal.

Campos mínimos:
- razón social / nombre
- RFC opcional demo
- contacto
- correo
- teléfono
- moneda
- condición comercial

No convertirlo en CRM completo.

---

# 5. COTIZACIONES — REFINAR COTIZACIÓN INDUSTRIAL

Cotizaciones ya fue adaptado, pero validar que TODO el flujo sea industrial.

## 5.1 Estructura

Mantener:
- Dashboard
- Cotizaciones
- Nueva cotización
- detalle
- autorización

## 5.2 Cotización

Debe mostrar claramente:

- Folio
- Cliente
- Número de parte / artículo
- Revisión
- Tecnología: Offset / Flexografía
- Cantidad
- Unidad comercial
- Fecha requerida
- Tarifa / convenio comercial aplicado
- Precio unitario
- Descuento
- Subtotal
- Total
- Margen estimado
- Estado

## 5.3 Estimación industrial

Conservar el bloque de estimación demo si ya existe.

Debe quedar claro que NO es un motor productivo real.

Mostrar como máximo:
- materiales estimados
- proceso
- acabados
- setup
- merma estimada
- costo estimado
- margen
- precio propuesto

Leyenda discreta:

`Estimación demo. El costeo productivo definitivo será parametrizado con reglas, capacidades, materiales y tiempos RTM.`

## 5.4 Tarifas / priceLists

`mockSalesData.ts` ya transformó priceLists hacia tarifas/convenios industriales.

No volver a retail.

Usar wording:
- Tarifa comercial
- Convenio
- Condición comercial
- Tarifa base

Evitar:
- Lista General Retail
- Promoción de tienda
- Sucursal
- piso de venta

## 5.5 Autorización

Mantener flujo actual:
- Dentro de política
- Requiere autorización
- Autorizar
- Solicitar ajuste
- Rechazar

Los umbrales siguen siendo DEMO; no presentarlos como política real confirmada de RTM.

## 5.6 Estados

Mantener:
- Borrador
- Pendiente de autorización
- Autorizada
- Enviada al cliente
- Aceptada
- Rechazada
- Vencida
- Convertida en pedido

---

# 6. PEDIDOS — CERRAR BIEN EL PUENTE COMERCIAL

Pedidos es el módulo comercial más importante de esta fase.

## 6.1 Estructura

Mantener:
- Dashboard
- Pendientes de autorización
- Pedidos

## 6.2 Campos centrales

Mostrar consistentemente:

- Folio pedido interno
- PO / pedido cliente
- Cliente
- Artículo / número de parte
- Revisión
- Tecnología
- Cantidad
- Unidad
- Fecha requerida
- Cotización origen
- Estado

## 6.3 Disponibilidad

Conservar/refinar bloque de disponibilidad ya implementado.

Debe mostrar:

- Cantidad pedida
- PT disponible
- Cantidad reservable
- Faltante
- Estado de cobertura

Ejemplo demo:

Pedido: 30,000 pzas
PT disponible: 5,000
Reservable: 5,000
Faltante: 25,000

Mensaje:

`5,000 pzas pueden cubrirse desde producto terminado. Restan 25,000 pzas por producir.`

## 6.4 No crear Producción

MUY IMPORTANTE:

En esta fase NO crear OP ni módulo Producción.

Si existe CTA:

`Preparar para producción`

puede únicamente:
- mostrar modal/resumen demo;
- mostrar toast;
- marcar estado `Pendiente de planeación` si ya existe;

NO crear componentes nuevos de Producción.
NO agregar máquinas.
NO agregar OP.

## 6.5 Faltante de material

Conservar/refinar integración hacia Compras/Requisiciones.

Si el pedido muestra requerimiento estimado y falta material:

`Enviar a Compras`

→ navegar a Requisiciones / Por comprar usando infraestructura existente.

Wording obligatorio:

`Requerimiento estimado para demo.`

No fingir BOM real.

## 6.6 Revisión

Mostrar revisión claramente:

`BD-MAN-024 · Rev. B`

Si un mock usa revisión no vigente, mostrar warning semántico.

No implementar control documental completo.

---

# 7. NAVEGACIÓN CRUZADA

Validar que funcione:

## Cliente → Cotización
`Nueva cotización`
→ abre Cotizaciones con cliente precargado.

## Cotización → Pedido
`Convertir en pedido`
→ genera/navega al pedido.

## Pedido → Cotización
si tiene cotización origen, permitir verla.

## Pedido → Compras
si hay faltante material, reutilizar navegación a Requisiciones.

No agregar router.

---

# 8. MOCKS COHERENTES

Unificar el universo comercial.

No tener nombres/productos contradictorios entre Clientes, Cotizaciones y Pedidos.

Usar preferentemente el set ya introducido en Fase 3.

Ejemplos ya válidos:

- Black & Decker
- Cliente farmacéutico demo / Medifarma si ya existe en mocks
- Manual instructivo 24 páginas
- Manual instructivo 48 páginas
- Blister Card
- Etiqueta autoadherible en rollo
- Tag impreso

Ejemplo narrativo principal:

Cliente: Black & Decker
Cotización: `COT-RTM-2026-0108`
Artículo: `BD-MAN-024`
Revisión: B
Tecnología: Offset
Cantidad: 30,000 pzas
→ Pedido: `PED-RTM-2026-0142`
→ PT disponible: 5,000
→ Faltante: 25,000

No crear OP en esta fase.

---

# 9. DASHBOARDS

No sobrecargar.

## Clientes
- activos
- con cotizaciones abiertas
- con pedidos abiertos
- valor comercial del periodo

## Cotizaciones
- abiertas
- pendientes autorización
- aceptadas
- conversión a pedido
- valor cotizado

## Pedidos
- abiertos
- por autorizar
- con cobertura PT
- con faltante
- con alerta de material
- próximos a fecha requerida

Quitar cualquier analytics restante de:
- showroom
- sucursal
- marca de colchón
- tienda

---

# 10. THEME

Toda acción primaria debe usar theme dinámico.

- `bg-theme-primary`
- `hover:bg-theme-primary-hover`
- `text-theme-primary`
- `border-theme-primary`
- `ring-theme-primary`

Colores fijos solo para semántica:
- rojo error/rechazo
- verde success
- ámbar pendiente/riesgo
- azul info
- morado smart

No reintroducir rojo Super Colchones como branding.

---

# 11. LIMPIEZA RETAIL

Buscar en archivos de Ventas y mocks relacionados:

- Super Colchones
- colchón / colchones
- Nayt
- Restonic
- Spring Air
- Sealy
- showroom
- sucursal
- retail
- piso de venta
- hotel
- tienda
- SC-

No hacer replace ciego.

Eliminar solamente referencias visibles o de datos activamente usados en Ventas.

---

# 12. NO HACER

NO:
- crear Producción
- crear OP
- agregar máquinas
- crear Gantt
- crear MES
- crear backend
- crear CFDI
- crear CxC
- crear CRM completo
- rehacer Ventas desde cero
- borrar componentes existentes
- inventar políticas comerciales reales de RTM
- inventar motor de costeo real
- usar datos retail heredados

---

# 13. CRITERIOS DE ACEPTACIÓN

Debe poder demostrarse:

### Caso 1
Cliente → nueva cotización con cliente precargado.

### Caso 2
Cotización industrial → autorización → aceptación.

### Caso 3
Cotización aceptada → convertir a Pedido.

### Caso 4
Pedido → ver PT disponible / reservable / faltante.

### Caso 5
Pedido con faltante de material → navegar a Compras/Requisiciones.

### Caso 6
Pedido con faltante productivo → mostrar `Pendiente de planeación` / preparación demo SIN crear Producción.

---

# 14. VALIDACIÓN

Antes de terminar:

1. `npm run build`
2. corregir TypeScript
3. probar Cliente → Cotización
4. probar Cotización → Pedido
5. probar Pedido → Cotización origen
6. probar Pedido → Compras/Requisiciones
7. probar RTM / Graphite / Emerald en pantallas tocadas
8. buscar residuos retail visibles en Ventas

---

# 15. ENTREGA

Reportar corto:

- archivos modificados
- qué ya existía y se conservó
- qué se refinó
- navegación cruzada validada
- residuos retail eliminados
- build
- pendientes

No trabajar en `main`.
No hacer merge.
No abrir PR.
