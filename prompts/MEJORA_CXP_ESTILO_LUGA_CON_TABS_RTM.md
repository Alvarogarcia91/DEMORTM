# RTM — MEJORA CxP ESTILO LUGA

## Objetivo
Reestructurar el módulo de Cuentas por Pagar para que se sienta como un módulo financiero completo, claro y demostrable, tomando como referencia la navegación de Luga pero adaptado a RTM.

## Reglas
- Solo `alvaro01`.
- Pull primero.
- Reutilizar lógica actual de facturas proveedor, pagos, saldos y validación OC/Recepción/Factura.
- No borrar lógica existente.
- No crear módulos nuevos en Sidebar.
- No usar `3-Way Match` como wording protagonista.
- Mantener theme/design system RTM.

## Tabs internas
1. Dashboard
2. Cuentas por Pagar
3. Historial de Pagos
4. Recurrentes
5. Estado de Cuenta

## Dashboard
KPIs:
- Total por pagar
- Vencido
- Próximos 7 días
- Pagos programados
- Facturas con diferencia
- Pagado del mes

Bloques:
- Atención requerida
- Próximos vencimientos
- Facturas con diferencia
- Top proveedores por saldo

## Cuentas por Pagar
Tabla:
- Factura proveedor
- Proveedor / RFC
- Fecha
- Vencimiento
- OC relacionada
- Recepción relacionada
- Total
- Pagado
- Saldo
- Validación
- Estado de pago
- Acciones

Wording visible:
- `3-Way Match` -> `Validación`
- `Conciliado` -> `Validada`
- `Discrepancia` -> `Con diferencia`

Acciones:
- Ver detalle
- Registrar pago
- Programar pago
- Ver validación
- Solicitar corrección
- Autorizar excepción

## Historial de Pagos
Tabla:
- Fecha
- Proveedor
- Referencia
- Método
- Facturas aplicadas
- Total aplicado
- Usuario
- Observaciones

## Recurrentes
Casos demo:
- renta
- internet
- telefonía
- limpieza
- seguridad
- seguros
- mantenimiento contratado
- licencias

Campos:
- Concepto
- Proveedor
- Frecuencia
- Próxima fecha
- Importe estimado
- Estado

Acciones:
- Ver detalle
- Generar cuenta por pagar
- Editar
- Pausar

## Estado de Cuenta
Selector de proveedor y vista consolidada.

Encabezado:
- Proveedor
- Razón social
- RFC
- Contacto
- Teléfono
- Email

KPIs:
- Total facturado
- Total abonado
- Saldo pendiente
- Saldo vencido

Tabla facturas:
- Fecha
- Referencia
- Vencimiento
- Estado
- Importe
- Pagado
- Saldo

Acciones:
- Exportar Excel demo
- Imprimir estado de cuenta
- Registrar pago
- Ver factura

## Validación OC / Recepción / Factura
Conservar la lógica, pero bajarla de protagonismo.

Ejemplo visual:
- OC: 100 cajas
- Recibido: 95 cajas
- Facturado: 100 cajas
- Resultado: Con diferencia

## CTA superior
Preferir:
- `+ Registrar factura proveedor`
- opcional `+ Registrar gasto`

## No hacer
- No borrar lógica existente
- No meter Contabilidad General
- No meter Tesorería
- No meter bancos
- No crear tabs como módulos Sidebar
- No convertir CxP en una sola tabla

## Validación final
- Probar las 5 tabs
- Validar pagos parciales/totales
- Validar detalle de factura
- Validar Estado de Cuenta
- `npm run build`
- corregir errores
