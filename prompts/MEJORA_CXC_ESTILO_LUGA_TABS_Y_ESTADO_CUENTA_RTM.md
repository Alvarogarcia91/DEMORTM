# RTM — MEJORA CxC ESTILO LUGA

## Objetivo
Reestructurar Cuentas por Cobrar para que se sienta como módulo financiero completo, usando la estructura de navegación de Luga pero adaptada a RTM.

## Reglas
- Solo `alvaro01`.
- Pull primero.
- Reutilizar lógica actual de CxC, pagos, aging, facturas y saldos.
- No borrar funcionalidad existente.
- No crear módulos nuevos en Sidebar.
- Mantener theme/design system RTM.

## Tabs internas
1. Dashboard
2. Cobrar
3. Historial de Cobros
4. Estado de Cuenta

## Dashboard
KPIs:
- Cartera pendiente
- Cartera vigente
- Cartera vencida
- Cobrado del mes
- Próximos vencimientos
- Clientes con saldo vencido

Conservar aging:
- Vigente
- 1–30
- 31–60
- 61–90
- +90

Bloques:
- Atención requerida
- Próximos vencimientos
- Top clientes por saldo
- Cobros recientes

## Cobrar
Vista operativa principal.

Tabla:
- Factura
- Cliente / RFC
- Fecha
- Vencimiento
- Total
- Pagado
- Saldo
- Estado
- Aging
- Acciones

Acciones:
- Ver detalle
- Registrar cobro
- Ver factura
- Aplicar pago parcial
- Liquidar

Filtros:
- Cliente
- Estado
- Aging
- Fecha
- Solo vencidas
- Próximas a vencer

## Historial de Cobros
Tabla:
- Fecha
- Cliente
- Referencia
- Método
- Facturas aplicadas
- Importe
- Usuario
- Observaciones

KPIs:
- Cobrado hoy
- Cobrado este mes
- Pagos parciales
- Facturas liquidadas

## Estado de Cuenta
Inspirarse visualmente en la vista de Luga, pero sin viajes/rutas.

Filtros:
- Cliente
- Fecha inicio
- Fecha fin
- Estado
- Buscar por factura/referencia

Acciones:
- Consultar
- Limpiar
- Exportar Excel demo
- Exportar CSV demo
- Imprimir estado de cuenta

Encabezado cliente:
- Nombre / razón social
- RFC
- Contacto
- Teléfono
- Email

KPIs:
- Total facturado
- Total pagado
- Saldo pendiente
- Saldo vencido
- Facturas pendientes
- Facturas parciales
- Facturas pagadas

Tabla del periodo:
- Fecha
- Factura
- Pedido / Remisión origen cuando aplique
- Vencimiento
- Estado
- Importe
- Pagado
- Saldo

Agregar historial/timeline de cobros del cliente debajo cuando haya datos.

## Datos
Usar clientes y facturas coherentes con los datos maestros RTM actuales. No introducir clientes ficticios nuevos.

## No hacer
- No meter CRM nuevo
- No meter bancos o conciliación bancaria
- No crear tabs como módulos Sidebar
- No borrar aging actual
- No eliminar pagos parciales

## Validación final
- Probar las 4 tabs
- Probar registro de pago parcial y total
- Validar Estado de Cuenta con cliente demo con movimientos
- No dejar pantallas vacías en el caso demo principal
- `npm run build`
- corregir errores
