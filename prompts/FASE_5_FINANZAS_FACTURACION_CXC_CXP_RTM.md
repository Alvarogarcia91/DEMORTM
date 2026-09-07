# FASE 5 — FINANZAS RTM: FACTURACIÓN + CxC + CxP

## Objetivo

Adaptar el demo RTM para incorporar un bloque financiero-operativo coherente con los flujos que ya existen en ventas, almacén y compras. La meta NO es construir contabilidad completa ni integración fiscal real todavía. La meta es que el demo muestre una cadena empresarial sólida y trazable:

**Ventas / salida:**

Cotización → Pedido → Orden de salida → Remisión → Factura de venta → Cuenta por cobrar → Pago.

**Compras / entrada:**

Requisición → Orden de compra → Recepción → Factura de proveedor → Validación / conciliación → Cuenta por pagar → Pago.

El módulo debe sentirse como una continuación natural del ERP, no como una isla nueva.

---

## Regla crítica de diseño

La **remisión NO es una factura fiscal**.

Para RTM en este demo debe distinguirse claramente:

- **Remisión:** documento operativo/comercial que respalda la entrega al cliente.
- **Factura borrador:** documento fiscal aún no timbrado.
- **Factura timbrada:** CFDI de venta ya emitido fiscalmente.

La remisión sí debe ser la principal fuente de datos para generar la factura de venta, evitando recaptura.

No utilizar wording como “factura no timbrada” para referirse a una remisión.

---

# 1. Arquitectura de navegación

Crear o adaptar una agrupación visual de **Finanzas** con tres módulos principales:

1. **Facturación**
2. **Cuentas por Cobrar**
3. **Cuentas por Pagar**

Estos módulos deben integrarse al mecanismo existente de visibilidad de navegación / Configuración → Módulos & Navegación.

No eliminar módulos heredados si se requiere preservar compatibilidad; ocultar o adaptar cuando convenga.

No agregar todavía Tesorería, Contabilidad, Pólizas, Balanza, DIOT ni Conciliación Bancaria como módulos completos.

---

# 2. FACTURACIÓN DE VENTA

## Flujo principal

```text
PEDIDO
  ↓
ORDEN DE SALIDA
  ↓
REMISIÓN
  ↓
GENERAR FACTURA
  ↓
FACTURA BORRADOR
  ↓
VALIDACIÓN FISCAL / COMERCIAL
  ↓
LISTA PARA TIMBRAR
  ↓
TIMBRADO DEMO
  ↓
FACTURA TIMBRADA
  ↓
CUENTA POR COBRAR
```

La factura debe originarse preferentemente desde una remisión ya generada. No duplicar la captura de cliente, pedido, partidas o cantidades si esa información ya existe.

## Datos precargados desde Remisión / Pedido

La pantalla o modal de generación debe precargar, donde exista:

- Cliente
- RFC
- Razón social
- Pedido RTM
- Pedido / PO del cliente
- Remisión
- Fecha
- Moneda
- Condiciones de pago
- Partidas
- Número de parte / artículo
- Revisión
- Descripción
- Cantidad
- UOM
- Precio unitario
- Importe
- Subtotal
- Impuestos
- Total

Además, permitir capturar o confirmar:

- Uso CFDI
- Régimen fiscal receptor si se decide mostrar en demo
- Código postal fiscal si se decide mostrar en demo
- Método de pago
- Forma de pago
- Observaciones

No inventar reglas fiscales avanzadas que no estén soportadas por el proyecto.

## Estados sugeridos de factura

- Borrador
- Lista para timbrar
- Timbrada
- Cancelada

Puede existir un estado visual de error de timbrado solo para demo si aporta UX, pero no implementar una integración PAC/SAT falsa.

## Timbrado demo

Debe existir acción visible **Timbrar CFDI** o equivalente.

Como aún no existe integración fiscal real confirmada, el demo debe mostrar claramente una leyenda tipo:

> Timbrado simulado para demo. No se envía información al SAT.

Después de la acción, cambiar el estado a Timbrada y generar datos mock coherentes, por ejemplo:

- UUID demo
- Fecha de timbrado
- Serie / folio
- Estado CFDI

No afirmar que existe conexión PAC o SAT real.

## Pantalla principal de Facturación

Debe tener una experiencia similar al resto del ERP: dashboard compacto + tabs + tabla + detalle.

KPIs sugeridos:

- Pendientes por facturar
- Borradores
- Timbradas del mes
- Total facturado del mes

Tabs sugeridos:

- Pendientes por facturar
- Borradores
- Timbradas
- Canceladas

La tabla de pendientes por facturar debe mostrar remisiones elegibles con columnas como:

- Remisión
- Cliente
- Pedido
- Fecha
- Total
- Estado
- Acción

La acción principal debe ser **Generar factura**.

## Detalle de factura

Mostrar:

- Encabezado y estado
- Cliente
- Origen comercial
- Pedido
- Remisión
- Datos fiscales básicos
- Partidas
- Totales
- Historial / timeline
- Acciones de acuerdo al estado

En factura timbrada mostrar referencia a CxC asociada.

---

# 3. CUENTAS POR COBRAR — CxC

## Propósito funcional

La pantalla debe responder rápidamente:

- ¿Quién nos debe?
- ¿Cuánto nos debe?
- ¿Qué está vencido?
- ¿Qué vence pronto?
- ¿Qué pagos se han recibido?
- ¿Qué saldo queda por factura?

No convertir CxC en una pantalla de pedidos. Su unidad financiera principal es la factura de venta / documento por cobrar.

## Flujo

```text
FACTURA TIMBRADA
      ↓
CUENTA POR COBRAR
      ↓
 ┌────┴────┐
 ↓         ↓
PAGO     PAGO
PARCIAL  TOTAL
 ↓         ↓
SALDO    PAGADA
RESTANTE
```

## Regla crítica

Soportar desde el demo **pagos parciales**.

Nunca asumir que una factura solo puede pagarse completa en una sola operación.

## KPIs sugeridos

- Saldo total de cartera
- Saldo vencido
- Saldo por vencer próximos 7 días
- Cobrado en el mes

## Aging / antigüedad

Mostrar visualmente rangos:

- Vigente
- 1–30 días
- 31–60 días
- 61–90 días
- +90 días

Estos rangos pueden ser calculados sobre datos mock.

## Tabs sugeridos

- Cartera
- Facturas
- Pagos

## Tabla de cartera

Columnas sugeridas:

- Cliente
- Factura
- Fecha factura
- Vencimiento
- Total
- Pagado
- Saldo
- Estado

Estados sugeridos:

- Vigente
- Próxima a vencer
- Vencida
- Parcial
- Pagada

Semántica visual:

- Rojo solo para vencido / error real
- Ámbar para próximo vencimiento
- Verde para pagado
- Theme primary para navegación, selección, CTA y branding

## Registro de pago

Crear modal o drawer para **Registrar pago**.

Campos demo:

- Fecha
- Referencia
- Método
- Cuenta destino o referencia bancaria demo
- Monto recibido
- Observaciones

Mostrar aplicación a la factura:

- Saldo anterior
- Monto aplicado
- Saldo posterior

Permitir pago parcial.

Después de registrar pago:

- Actualizar total pagado
- Actualizar saldo
- Cambiar estado automáticamente
- Agregar evento al historial

No simular CFDI de complemento de pago todavía salvo que se marque explícitamente como futura funcionalidad.

## Detalle CxC

Debe mostrar trazabilidad hacia atrás:

Factura → Remisión → Pedido → Cliente

Y trazabilidad financiera:

- Total
- Pagado
- Saldo
- Fecha vencimiento
- Aging
- Historial de pagos

---

# 4. CUENTAS POR PAGAR — CxP

## Propósito funcional

La pantalla debe responder:

- ¿A qué proveedores debemos?
- ¿Cuánto debemos?
- ¿Qué vence pronto?
- ¿Qué está vencido?
- ¿Qué facturas ya fueron validadas?
- ¿Qué factura no coincide con OC o recepción?
- ¿Qué pagos se han hecho?

## Flujo

```text
REQUISICIÓN
    ↓
ORDEN DE COMPRA
    ↓
RECEPCIÓN
    ↓
FACTURA PROVEEDOR
    ↓
VALIDACIÓN / CONCILIACIÓN
    ↓
CUENTA POR PAGAR
    ↓
PAGO PARCIAL O TOTAL
    ↓
PAGADA
```

## Factura de proveedor

Permitir registrar una factura proveedor asociándola a:

- Proveedor
- Número / folio factura proveedor
- Fecha factura
- Vencimiento
- Moneda
- Orden de compra
- Recepción
- Partidas
- Subtotal
- Impuestos
- Total

No intentar timbrar facturas de proveedor; son documentos recibidos.

---

# 5. CONCILIACIÓN OC vs RECEPCIÓN vs FACTURA

Esta es una pieza importante del demo porque conecta Compras, Almacén y Finanzas.

Mostrar una validación tipo 3-way match simplificada:

**Orden de Compra ↔ Recepción ↔ Factura Proveedor**

Comparar al menos:

- Material / artículo
- Cantidad ordenada
- Cantidad recibida
- Cantidad facturada
- Precio OC
- Precio factura

## Caso correcto

Ejemplo:

- OC: 48,000 pliegos
- Recibido: 48,000
- Facturado: 48,000
- Precio OC = Precio factura

Mostrar:

- ✓ Cantidad coincide con recepción
- ✓ Precio coincide con OC
- ✓ Sin diferencias detectadas

Acción:

**Aprobar para pago**

## Caso con diferencia

Ejemplo:

- OC: 50,000 pliegos
- Recibido: 48,000
- Facturado: 50,000

Mostrar diferencia visible:

- Diferencia de 2,000 pliegos

Acciones demo:

- Solicitar corrección
- Autorizar excepción

No inventar reglas reales de tolerancia, porcentajes o autorizadores RTM. Si se requiere mostrar tolerancia, etiquetarla claramente como demo.

---

# 6. Dashboard CxP

KPIs sugeridos:

- Saldo total proveedor
- Por vencer
- Vencido
- Pagado del mes

Tabs sugeridos:

- Facturas proveedor
- Conciliación
- Pagos

Tabla principal:

- Proveedor
- Factura
- OC
- Recepción
- Vencimiento
- Total
- Pagado
- Saldo
- Estado

Estados sugeridos:

- Pendiente de validar
- Con diferencia
- Aprobada para pago
- Parcial
- Pagada
- Vencida

## Registro de pago proveedor

Modal / drawer similar al de CxC:

- Fecha
- Referencia
- Método
- Cuenta origen demo
- Monto
- Observaciones

Mostrar saldo anterior y posterior.

Permitir pagos parciales.

---

# 7. Trazabilidad cruzada

El demo debe permitir navegar entre documentos relacionados.

## Venta

Cotización → Pedido → Orden de salida → Remisión → Factura → CxC → Pago

Desde una factura debe poder abrirse su remisión y pedido.

Desde CxC debe poder abrirse la factura.

Desde la remisión, si ya fue facturada, mostrar liga a la factura.

## Compra

Requisición → OC → Recepción → Factura proveedor → CxP → Pago

Desde factura proveedor mostrar OC y recepción.

Desde OC, si existe factura proveedor, mostrar referencia.

Desde recepción mostrar factura proveedor relacionada cuando exista.

---

# 8. Datos demo sugeridos

Usar datos industriales coherentes con RTM, evitando cualquier rastro del dominio de colchones / retail.

Ejemplos de clientes demo:

- Cliente Industrial Norte
- Black & Decker (solo si ya existe en mocks actuales del proyecto; no introducirlo como cliente real confirmado de RTM si no existe)
- Cliente Automotriz Demo

Ejemplos de proveedores demo:

- Proveedor Papel Norte
- Proveedor Tintas Industrial
- Proveedor Películas Flexibles

Ejemplos de materiales:

- Papel Couché 90 g
- BOPP
- Papel térmico
- Tinta negra
- Adhesivo

Ejemplos de documentos:

- PED-RTM-2026-0142
- OS-RTM-2026-0081
- REM-RTM-2026-0061
- FAC-RTM-2026-0048
- OC-RTM-2026-0084
- REC-RTM-2026-0057

No presentar empresas mock como relaciones comerciales reales de RTM.

---

# 9. Diseño UI / Theme compliance

Seguir el sistema visual ya establecido en DEMORTM.

Reglas:

- CTA y branding usan tokens del theme.
- No hardcodear rojo / rose para botones principales.
- Rojo solo para error, rechazo, vencido o riesgo real.
- Verde para éxito / pagado / validado.
- Ámbar para warning / próximo vencimiento / pendiente sensible.
- Azul o semantic info para información neutral.
- Cards blancas, sombras discretas, radios y espaciado consistentes con el proyecto.
- Reusar primitives compartidos existentes antes de crear nuevos.
- Modales deben respetar ModalPortal / patrones ya usados.
- Tablas compactas, legibles y con números tabulares.
- Todo debe verse correctamente en themes RTM, Navy, Graphite y Emerald.

---

# 10. No construir en esta fase

NO implementar todavía:

- Contabilidad general
- Catálogo contable
- Pólizas
- Balanza
- Diario / mayor
- DIOT
- Conciliación bancaria automática
- Tesorería avanzada
- Flujo bancario real
- SPEI real
- Integración bancaria
- Timbrado SAT/PAC real
- Cancelación CFDI real
- Complemento de pago real
- XML fiscal real
- Declaraciones fiscales

Si algún elemento aparece en UI, debe marcarse como demo / futura integración y no fingir funcionalidad real.

---

# 11. Reutilización obligatoria

Antes de programar:

1. Auditar completamente el estado actual de `alvaro01`.
2. Revisar si ya existen componentes de ventas, facturación, pagos, compras, recepción o documentos reutilizables.
3. Reusar patrones existentes de dashboard, tabs, table, status badges, modals, drawers y details.
4. No duplicar componentes si existe un primitive o patrón equivalente.
5. No rehacer Compras, Pedidos, Remisiones ni Recepciones: conectarlos.

Si un documento actual usa campos heredados del dominio Super Colchones, adaptar el wording y mocks a RTM sin romper el flujo existente.

---

# 12. Criterios de aceptación funcional

La fase se considera completa cuando, en demo frontend:

1. Existe navegación visible a Facturación, CxC y CxP.
2. Una remisión pendiente puede generar una factura de venta borrador.
3. La factura puede pasar a lista para timbrar y luego a Timbrada mediante simulación claramente identificada.
4. Una factura timbrada genera o muestra su CxC.
5. CxC soporta registrar pagos parciales y totales.
6. La cartera actualiza saldo y estado después de cada pago.
7. Una factura de proveedor puede asociarse con OC y recepción.
8. Existe una vista de conciliación OC vs Recepción vs Factura.
9. Una factura proveedor aprobada aparece en CxP.
10. CxP soporta pagos parciales y totales.
11. Existe trazabilidad navegable entre documentos relacionados.
12. No existe branding Super Colchones visible en estas pantallas.
13. No existen CTA de branding hardcodeados en rose/red.
14. `npm run build` termina correctamente.

---

# 13. Criterios de demo / UX

El usuario debe poder demostrar en pocos minutos la historia completa:

## Escenario A — Venta

1. Abrir remisión entregada.
2. Generar factura.
3. Revisar datos fiscales/comerciales.
4. Guardar borrador.
5. Timbrar en modo demo.
6. Abrir CxC generada.
7. Registrar pago parcial.
8. Ver saldo actualizado.
9. Registrar pago final.
10. Ver estado Pagada.

## Escenario B — Compra

1. Abrir factura proveedor.
2. Ver OC y recepción ligadas.
3. Mostrar conciliación correcta o diferencia.
4. Aprobar para pago.
5. Abrir CxP.
6. Registrar pago parcial o total.
7. Ver saldo actualizado.

La demo debe comunicar que el sistema evita recaptura y mantiene trazabilidad de punta a punta.

---

# 14. Entrega técnica

Trabajar **ÚNICAMENTE en la rama `alvaro01`**.

No trabajar en `main`.

No hacer merge.

No abrir PR.

Antes de tocar código:

```bash
git checkout alvaro01
git pull origin alvaro01
```

Después:

- Leer este archivo completo.
- Auditar el repo y documentar brevemente qué componentes se reutilizarán.
- Implementar incrementalmente.
- Ejecutar build.
- Corregir errores.
- Reportar archivos modificados y decisiones importantes.

Validación final mínima:

```bash
cd frontend
npm install
npm run build
```

Si el proyecto ya tiene dependencias instaladas, evitar reinstalaciones innecesarias.

---

# 15. Resultado esperado

El módulo financiero de RTM debe sentirse como una extensión natural del ERP y dejar clara esta narrativa:

> RTM no solo controla pedidos, producción, inventario y embarques; también convierte la entrega en factura, la factura en cartera y el abastecimiento en obligaciones a proveedor, manteniendo trazabilidad documental de punta a punta.

No sobreconstruir. La prioridad es una demo empresarial coherente, visualmente sólida y funcional.