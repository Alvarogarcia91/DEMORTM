# FASE 5 — FINANZAS RTM: FACTURACIÓN + CxC + CxP

> **Documento de ejecución para Anti.**
>
> Este MD es la fuente de verdad de esta fase. El prompt externo debe ser mínimo. Antes de tocar código, auditar el estado ACTUAL de `alvaro01`, porque otros cambios pueden haber sido empujados después de redactar este documento.

---

# 0. REGLAS DE EJECUCIÓN

- Trabajar **únicamente en `alvaro01`**.
- Hacer pull antes de modificar.
- No trabajar en `main`.
- No hacer merge.
- No abrir PR.
- No borrar módulos existentes que puedan reutilizarse.
- No crear una arquitectura paralela si ya existe un patrón equivalente.
- Reusar componentes, layouts, tablas, badges, modales, drawers, dashboard cards, navegación y theme actuales.
- Mantener esta fase **frontend/demo-first**. Si el repo actualmente es mock-driven, continuar así.
- No fingir integraciones externas reales.
- Todo nuevo mock debe ser industrial y coherente con RTM; cero colchones, showroom, sucursales retail o datos heredados de Super Colchones.
- Al terminar ejecutar `npm run build` dentro de `frontend` y corregir todos los errores.

---

# 1. OBJETIVO

Agregar un bloque financiero-operativo coherente sobre los flujos que DEMORTM ya tiene.

No construir contabilidad completa. El objetivo es demostrar que el ERP conecta la operación comercial y de compras con su consecuencia financiera sin recaptura innecesaria.

## Cadena de venta

```text
CLIENTE
  ↓
COTIZACIÓN
  ↓
PEDIDO
  ↓
ORDEN DE SALIDA
  ↓
REMISIÓN
  ↓
FACTURA DE VENTA BORRADOR
  ↓
LISTA PARA TIMBRAR
  ↓
TIMBRADO CFDI SIMULADO
  ↓
FACTURA TIMBRADA
  ↓
CUENTA POR COBRAR
  ↓
PAGO PARCIAL / TOTAL
```

## Cadena de compra

```text
PROVEEDOR
  ↓
REQUISICIÓN
  ↓
ORDEN DE COMPRA
  ↓
RECEPCIÓN
  ↓
FACTURA PROVEEDOR
  ↓
VALIDACIÓN 3-WAY MATCH
  ↓
CUENTA POR PAGAR
  ↓
PAGO PARCIAL / TOTAL
```

El bloque Finanzas debe sentirse como continuación natural de Ventas, Compras y Almacén, no como otra aplicación dentro del ERP.

---

# 2. CONCEPTO DOCUMENTAL CRÍTICO

No confundir documentos.

## Remisión

Documento operativo/comercial de entrega.

- Nace de una orden de salida o flujo equivalente existente.
- Puede contener cliente, pedido, PO del cliente, partidas, cantidades, precios y totales.
- Sirve como origen para facturar sin recaptura.
- **NO es CFDI.**
- **NO debe llamarse factura no timbrada.**

## Factura de venta borrador

Documento fiscal preparado pero todavía sin timbrar.

- Tiene serie/folio demo.
- Contiene datos fiscales básicos.
- Puede editarse mientras esté en borrador.
- Todavía no genera CxC definitiva.

## Factura de venta timbrada

CFDI de venta emitido en el contexto del demo.

- Para esta fase el timbrado es **simulado**.
- Debe visualizar UUID demo, fecha de timbrado, serie/folio y estado.
- Al timbrarse genera o activa la Cuenta por Cobrar asociada.

## Factura proveedor

Documento recibido del proveedor.

- Se registra y se relaciona con OC y recepción.
- No se “timbra” desde RTM.
- Se valida antes de aprobarla para pago.

---

# 3. NAVEGACIÓN Y CONFIGURACIÓN

Agregar o adaptar una agrupación **Finanzas** en la navegación sin convertir el Sidebar en una lista enorme.

Debe contener:

1. **Facturación**
2. **Cuentas por Cobrar**
3. **Cuentas por Pagar**

Integrar los tres al mecanismo existente de **Configuración → Módulos & Navegación**.

Requisitos:

- Poder mostrar/ocultar Finanzas o sus entradas según la arquitectura actual del repo.
- Respetar persistencia de visibilidad existente.
- No romper navegación heredada.
- Si el patrón actual agrupa módulos bajo una sola key, usar el patrón existente en vez de inventar uno nuevo.
- No agregar todavía Tesorería ni Contabilidad.

---

# 4. FACTURACIÓN DE VENTA

## 4.1 Pantalla principal

Construir/reutilizar el patrón del ERP: **dashboard compacto + tabs/filtros + tabla + detalle**.

### KPIs

Mostrar al menos:

- Pendientes por facturar
- Borradores
- Timbradas del mes
- Total facturado del mes

Opcional si encaja naturalmente:

- Facturas con saldo pendiente
- Ticket promedio

No saturar con KPIs innecesarios.

### Tabs

- Pendientes por facturar
- Borradores
- Timbradas
- Canceladas

### Pendientes por facturar

La unidad principal es la **remisión elegible**.

Columnas sugeridas:

- Remisión
- Cliente
- Pedido RTM
- PO cliente
- Fecha
- Moneda
- Total
- Estado
- Acción

CTA principal: **Generar factura**.

No mostrar “Crear factura desde cero” como flujo principal si ya existe remisión. El valor del demo es evitar recaptura.

---

# 5. GENERAR FACTURA DESDE REMISIÓN

Al seleccionar una remisión:

## Precargar automáticamente cuando la información exista

- Cliente
- Razón social
- RFC
- Pedido RTM
- PO / pedido del cliente
- Remisión
- Fecha
- Moneda
- Condiciones de pago
- Partidas
- Número de parte / SKU
- Revisión
- Descripción
- Cantidad
- UOM
- Precio unitario
- Importe
- Subtotal
- Impuestos
- Total

## Capturar o confirmar

- Uso CFDI
- Régimen fiscal receptor, si el demo ya maneja ese concepto
- Código postal fiscal, si existe en datos del cliente
- Método de pago
- Forma de pago
- Observaciones

No inventar validaciones fiscales complejas que no estén implementadas.

## UX esperada

Mostrar claramente la relación documental:

```text
Pedido PED-...
   ↓
Remisión REM-...
   ↓
Factura FAC-...
```

El usuario debe entender visualmente que la factura heredó las partidas de la entrega.

---

# 6. ESTADOS DE FACTURA

Estados mínimos:

- **Borrador**
- **Lista para timbrar**
- **Timbrada**
- **Cancelada**

Opcional:

- Error de timbrado demo, únicamente si ayuda a demostrar UX.

## Reglas de acciones

### Borrador

Puede:

- Editarse
- Guardarse
- Pasar a lista para timbrar

### Lista para timbrar

Puede:

- Revisarse
- Regresar a borrador si el patrón del repo lo permite
- Timbrarse

### Timbrada

- Ya no debe editarse como borrador.
- Debe mostrar UUID demo.
- Debe mostrar fecha/hora demo de timbrado.
- Debe enlazar a su CxC.

### Cancelada

Solo estado demostrativo. No implementar cancelación SAT real.

---

# 7. TIMBRADO CFDI SIMULADO

Debe existir CTA claro: **Timbrar CFDI**.

Antes de ejecutarlo, mostrar confirmación y una leyenda inequívoca:

> Timbrado simulado para demo. No se envía información al SAT ni a un PAC.

Al confirmar:

1. Cambiar factura a Timbrada.
2. Generar UUID mock con formato visual realista pero obviamente demo.
3. Registrar fecha/hora de timbrado.
4. Mantener serie/folio.
5. Agregar evento al timeline.
6. Crear/activar la CxC asociada.
7. Actualizar dashboards de Facturación y CxC.

No crear llamadas HTTP falsas a SAT/PAC.
No usar logos o mensajes que hagan creer que hubo comunicación real con SAT.

---

# 8. DETALLE DE FACTURA

El detalle debe mostrar en una sola vista o modal/drawer:

## Encabezado

- Serie / folio
- Estado
- Cliente
- RFC
- Fecha
- Moneda
- Método / forma de pago
- Condiciones de pago

## Origen

- Cotización, si aplica
- Pedido
- PO cliente
- Orden de salida, si existe la relación actual
- Remisión

## Partidas

- Artículo / número de parte
- Revisión
- Descripción
- Cantidad
- UOM
- Precio
- Importe

## Totales

- Subtotal
- Impuestos
- Total

## Fiscal demo

Si está timbrada:

- UUID demo
- Fecha de timbrado
- Estado CFDI demo

## Financiero

- Total factura
- Pagado
- Saldo
- Fecha vencimiento
- Estado CxC
- Link / CTA para abrir CxC

## Timeline

Ejemplo:

```text
Remisión generada
Factura borrador creada
Lista para timbrar
CFDI timbrado — demo
CxC generada
Pago parcial registrado
```

---

# 9. CUENTAS POR COBRAR — CxC

La pantalla debe contestar de inmediato:

- ¿Quién debe?
- ¿Cuánto debe?
- ¿Qué está vencido?
- ¿Qué vence pronto?
- ¿Qué se cobró este mes?
- ¿Qué facturas tienen pagos parciales?

La unidad financiera principal es la **factura de venta**.

## 9.1 KPIs

- Saldo total de cartera
- Saldo vencido
- Por vencer en próximos 7 días
- Cobrado en el mes

## 9.2 Aging

Mostrar:

- Vigente
- 1–30 días vencido
- 31–60
- 61–90
- +90

Calcularlo con fechas mock, no con valores escritos manualmente si es fácil derivarlo.

## 9.3 Tabs

- Cartera
- Facturas
- Pagos

## 9.4 Tabla principal

Columnas sugeridas:

- Cliente
- Factura
- Fecha factura
- Vencimiento
- Total
- Pagado
- Saldo
- Aging
- Estado

Estados:

- Vigente
- Próxima a vencer
- Vencida
- Parcial
- Pagada

Priorizar estados financieros sobre estados de pedido.

---

# 10. REGISTRAR PAGO DE CLIENTE

Crear/reusar modal o drawer.

Campos:

- Fecha
- Referencia
- Método
- Cuenta destino demo
- Monto recibido
- Observaciones

Mostrar la aplicación antes de confirmar:

```text
Saldo anterior      $23,200.00
Monto aplicado      $15,000.00
Saldo posterior      $8,200.00
```

## Reglas

- Soportar **pagos parciales** desde el inicio.
- No permitir aplicar monto negativo.
- No permitir aplicar más que el saldo sin una UX explícita de remanente; para esta fase, simplemente limitar al saldo.
- Si saldo posterior > 0 → estado Parcial.
- Si saldo posterior = 0 → estado Pagada.
- Registrar evento en historial.
- Actualizar KPIs y tabla inmediatamente.

No generar complemento de pago CFDI real.

---

# 11. DETALLE CxC

Mostrar:

- Cliente
- Factura
- Fecha factura
- Vencimiento
- Total
- Total pagado
- Saldo
- Aging
- Estado

## Trazabilidad hacia atrás

```text
Cliente
  ↓
Pedido
  ↓
Remisión
  ↓
Factura
  ↓
CxC
```

## Historial financiero

Por cada pago:

- Fecha
- Referencia
- Método
- Monto
- Saldo resultante

Debe existir CTA **Registrar pago** solo cuando exista saldo.

---

# 12. CUENTAS POR PAGAR — CxP

La pantalla debe contestar:

- ¿A qué proveedores debemos?
- ¿Cuánto debemos?
- ¿Qué está vencido?
- ¿Qué vence pronto?
- ¿Qué facturas aún no se validan?
- ¿Qué facturas tienen diferencias contra OC/recepción?
- ¿Qué se pagó este mes?

## KPIs

- Saldo total a proveedores
- Vencido
- Por vencer
- Pagado del mes

## Tabs

- Facturas proveedor
- Conciliación
- Pagos

## Tabla

- Proveedor
- Factura proveedor
- OC
- Recepción
- Fecha
- Vencimiento
- Total
- Pagado
- Saldo
- Estado

Estados:

- Pendiente de validar
- Con diferencia
- Aprobada para pago
- Parcial
- Pagada
- Vencida

---

# 13. REGISTRO DE FACTURA PROVEEDOR

Debe poder asociarse a información ya existente de compras y recepción.

Campos:

- Proveedor
- Folio factura proveedor
- Fecha factura
- Vencimiento
- Moneda
- Orden de compra
- Recepción
- Partidas
- Subtotal
- Impuestos
- Total

Evitar recapturar manualmente lo que ya pueda heredarse desde OC y recepción.

La factura proveedor debe entrar inicialmente como **Pendiente de validar**.

---

# 14. 3-WAY MATCH — OC ↔ RECEPCIÓN ↔ FACTURA PROVEEDOR

Esta pieza debe verse muy clara en demo porque conecta Compras + Almacén + Finanzas.

Comparar al menos:

- Artículo/material
- Cantidad ordenada
- Cantidad recibida
- Cantidad facturada
- Precio de OC
- Precio facturado

## Caso correcto

Ejemplo:

```text
Material          Papel Couché 90 g
OC                48,000 pliegos
Recibido          48,000 pliegos
Facturado         48,000 pliegos
Precio OC         $1.82
Precio factura    $1.82
```

Mostrar:

- ✓ Cantidad coincide con recepción
- ✓ Precio coincide con OC
- ✓ Sin diferencias detectadas

CTA: **Aprobar para pago**.

## Caso con diferencia

Ejemplo:

```text
OC                50,000 pliegos
Recibido          48,000 pliegos
Facturado         50,000 pliegos
Diferencia         2,000 pliegos
```

Mostrar diferencia con semántica de warning/error y acciones demo:

- **Solicitar corrección**
- **Autorizar excepción**

No inventar tolerancias porcentuales, jerarquías de autorización o políticas reales de RTM.

Si se muestra alguna tolerancia, etiquetarla explícitamente como **demo**.

---

# 15. REGISTRAR PAGO A PROVEEDOR

Modal/drawer espejo de CxC:

- Fecha
- Referencia
- Método
- Cuenta origen demo
- Monto
- Observaciones

Mostrar:

- Saldo anterior
- Monto aplicado
- Saldo posterior

Soportar pagos parciales.

Estados automáticos:

- Saldo > 0 → Parcial
- Saldo = 0 → Pagada

Actualizar dashboard, tabla e historial.

---

# 16. TRAZABILIDAD CRUZADA OBLIGATORIA

## Venta

```text
Cotización
  ↓
Pedido
  ↓
Orden de salida
  ↓
Remisión
  ↓
Factura
  ↓
CxC
  ↓
Pago(s)
```

Desde factura:

- abrir remisión
- abrir pedido
- abrir CxC

Desde CxC:

- abrir factura
- ver historial de pagos

Desde remisión:

- si ya fue facturada, mostrar factura asociada
- si no fue facturada, mostrar acción Generar factura

## Compra

```text
Requisición
  ↓
Orden de compra
  ↓
Recepción
  ↓
Factura proveedor
  ↓
CxP
  ↓
Pago(s)
```

Desde factura proveedor:

- abrir OC
- abrir recepción
- abrir CxP

Desde OC/recepción:

- mostrar factura proveedor relacionada cuando exista

No es necesario que todas las relaciones tengan rutas nuevas; pueden abrir modal/drawer existente si ese es el patrón del repo.

---

# 17. DATOS MOCK COHERENTES

No crear datasets aislados por pantalla.

Idealmente compartir IDs/referencias entre mocks para que las mismas entidades aparezcan en todo el flujo.

Ejemplo de cadena coherente:

```text
Cliente: Cliente Industrial Norte
Pedido: PED-RTM-2026-0142
Orden salida: OS-RTM-2026-0081
Remisión: REM-RTM-2026-0061
Factura: FAC-RTM-2026-0048
CxC: CXC-RTM-2026-0048
Pago: PAG-CLI-2026-0021
```

Compra:

```text
Proveedor: Proveedor Papel Norte
OC: OC-RTM-2026-0084
Recepción: REC-RTM-2026-0057
Factura proveedor: FP-883724
CxP: CXP-RTM-2026-0037
Pago: PAG-PROV-2026-0018
```

Materiales/partidas industriales permitidas:

- Papel Couché 90 g
- Papel / cartulina
- BOPP
- Papel térmico
- Tintas
- Adhesivos
- Material flexible
- Etiquetas / impresos industriales ya usados en mocks RTM

No introducir nuevamente:

- colchones
- bases
- almohadas
- showroom
- sucursales retail
- exposición
- ventas de piso
- CEDIS heredados sin relación con RTM

Si se usa una empresa real que ya existe en mocks previos, tratarla como dato demo y no afirmar que es cliente/proveedor real de RTM.

---

# 18. DASHBOARDS

Cada dashboard debe aportar decisiones, no solo números decorativos.

## Facturación

Responder:

- ¿Qué remisiones todavía no facturo?
- ¿Cuánto facturé este mes?
- ¿Qué está en borrador?
- ¿Qué está listo para timbrar?

## CxC

Responder:

- ¿Cuánto me deben?
- ¿Cuánto está vencido?
- ¿Qué vence esta semana?
- ¿Qué clientes concentran cartera?

Si agrega gráfica, una sola gráfica útil es mejor que cinco decorativas.

## CxP

Responder:

- ¿Cuánto debo?
- ¿Qué vence pronto?
- ¿Qué está vencido?
- ¿Qué facturas tienen diferencias?

No implementar dashboards gigantes.

---

# 19. FILTROS Y BÚSQUEDA

Reusar el patrón actual de filtros del repo.

Facturación:

- búsqueda por cliente, factura, remisión, pedido
- estado
- periodo

CxC:

- cliente
- factura
- estado
- vencimiento / aging
- periodo

CxP:

- proveedor
- factura
- OC
- estado
- vencimiento
- periodo

Si ya existe persistencia en query params en otros módulos y puede reutilizarse sin sobrecomplicar, usarla.

---

# 20. UI / THEME / SEMÁNTICA

Seguir el sistema visual actual de DEMORTM.

## Theme

Usar tokens existentes para:

- CTA
- selección
- tabs activos
- focus
- navegación
- branding

Ejemplos:

- `bg-theme-primary`
- `hover:bg-theme-primary-hover`
- `text-theme-primary`
- `border-theme-primary`
- `ring-theme-primary`

No hardcodear rose/red como color de marca.

## Semántica

- Rojo: vencido, rechazo, diferencia grave, error
- Ámbar: próximo vencimiento, pendiente, revisión
- Verde: pagado, validado, timbrado exitosamente en demo
- Azul/info: información neutral
- Theme primary: navegación/acción/selección

## Componentes

- Reusar ModalPortal/patrón modal actual.
- Reusar status badges.
- Tablas compactas.
- Números con `tabular-nums` si ya existe el patrón.
- Moneda y cantidades formateadas consistentemente.
- Responsive razonable; priorizar desktop demo.
- Verificar RTM, Navy, Graphite y Emerald.

---

# 21. REGLAS DE ESTADO Y CÁLCULO

Evitar mocks inconsistentes.

## CxC

```text
saldo = totalFactura - sumaPagosAplicados
```

- saldo = total → Vigente/Vencida según fecha
- 0 < saldo < total → Parcial o Vencida Parcial según fecha
- saldo = 0 → Pagada

## CxP

```text
saldo = totalFacturaProveedor - sumaPagosAplicados
```

La aprobación de factura y el estado financiero son conceptos diferentes:

- Pendiente de validar
- Aprobada para pago
- Parcial
- Pagada

Una factura con diferencia no debe aparecer como aprobada para pago salvo que se ejecute la acción demo Autorizar excepción.

## Vencimiento

Derivar con fecha de vencimiento, no hardcodear el badge si es viable.

---

# 22. NO CONSTRUIR EN ESTA FASE

NO implementar:

- Contabilidad general
- Catálogo de cuentas
- Pólizas
- Diario
- Mayor
- Balanza
- Estados financieros contables reales
- DIOT
- Tesorería avanzada
- Flujo de caja bancario real
- Bancos conectados
- SPEI
- Conciliación bancaria automática
- Integración SAT/PAC real
- XML fiscal real
- Sellos / CSD reales
- Cancelación CFDI real
- Complemento de pago real
- Declaraciones fiscales
- Portal de proveedores
- Portal de clientes

No agregar botones muertos para estas funciones salvo una referencia explícita de “futura integración” que realmente ayude al demo.

---

# 23. REUTILIZACIÓN OBLIGATORIA DEL REPO

Antes de crear componentes nuevos:

1. Auditar `DashboardShell.tsx` o shell equivalente actual.
2. Auditar navegación/Sidebar.
3. Auditar `NavigationModulesContext` o mecanismo equivalente actual.
4. Auditar componentes de Ventas: Clientes, Cotizaciones y Pedidos.
5. Auditar Compras: requisiciones/por comprar/OC.
6. Auditar Operaciones de Almacén/recepción.
7. Auditar Orden de Salida/Remisión existente.
8. Auditar primitives compartidos de dashboard, tabs, tables, badges, modal/drawer.
9. Auditar mocks actuales para compartir entidades y evitar duplicados.

Si algo ya está implementado, **adaptar/conectar**, no reconstruir.

Si el repo cambió desde la redacción de este MD, seguir la arquitectura actual siempre que preserve el objetivo funcional descrito aquí.

---

# 24. CASOS DEMO OBLIGATORIOS

Debe ser posible demostrar al menos estos casos manualmente:

## Caso A — Venta completa

1. Abrir remisión pendiente.
2. Generar factura.
3. Ver datos precargados.
4. Guardar borrador.
5. Pasar a Lista para timbrar.
6. Timbrar CFDI demo.
7. Ver UUID demo.
8. Abrir CxC generada.
9. Registrar pago parcial.
10. Ver saldo restante.
11. Registrar segundo pago.
12. Ver estado Pagada.

## Caso B — Cartera vencida

1. Abrir CxC.
2. Identificar factura vencida.
3. Ver aging.
4. Abrir detalle.
5. Ver historial y saldo.

## Caso C — Compra correcta

1. Abrir factura proveedor.
2. Ver OC y recepción relacionadas.
3. Ejecutar/visualizar 3-way match sin diferencias.
4. Aprobar para pago.
5. Registrar pago parcial.
6. Ver saldo restante.

## Caso D — Compra con diferencia

1. Abrir factura proveedor con cantidad/precio discrepante.
2. Ver diferencia claramente.
3. Usar Solicitar corrección o Autorizar excepción demo.
4. Ver timeline/estado actualizado.

---

# 25. CRITERIOS DE ACEPTACIÓN

La fase está terminada cuando:

- [ ] Finanzas aparece correctamente en navegación/configuración.
- [ ] Existen Facturación, CxC y CxP.
- [ ] Una remisión puede generar factura sin recaptura principal.
- [ ] Existe factura Borrador.
- [ ] Existe estado Lista para timbrar.
- [ ] Existe acción Timbrar CFDI simulada.
- [ ] Factura timbrada muestra UUID/fecha demo.
- [ ] Factura timbrada genera o enlaza CxC.
- [ ] CxC soporta pagos parciales.
- [ ] CxC recalcula saldo y estado.
- [ ] CxC tiene aging útil.
- [ ] CxP permite registrar factura proveedor.
- [ ] Factura proveedor se relaciona con OC/recepción.
- [ ] Existe 3-way match visible.
- [ ] Existe caso con discrepancia.
- [ ] CxP soporta pagos parciales.
- [ ] Existe trazabilidad navegable entre documentos.
- [ ] Dashboards se actualizan coherentemente con los mocks.
- [ ] No quedan residuos visibles de Super Colchones en lo tocado.
- [ ] Theme funciona en RTM/Navy/Graphite/Emerald.
- [ ] No se implementó producción por accidente.
- [ ] No se fingió integración SAT/PAC real.
- [ ] `npm run build` termina sin errores.

---

# 26. RESULTADO QUE DEBE REPORTAR ANTI

Al finalizar entregar un resumen corto con:

1. Archivos modificados/creados.
2. Componentes existentes reutilizados.
3. Flujos demo disponibles.
4. Qué partes son simuladas.
5. Qué quedó pendiente deliberadamente.
6. Resultado de `npm run build`.

No entregar una explicación gigante; el detalle ya vive en este MD.
