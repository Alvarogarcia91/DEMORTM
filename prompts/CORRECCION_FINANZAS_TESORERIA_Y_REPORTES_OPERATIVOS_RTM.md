# CORRECCIÓN FINANZAS RTM — TESORERÍA OPERATIVA + REPORTES FINANCIEROS REALES

## 0. Reglas de ejecución

- Trabajar **solo en `alvaro01`**.
- Hacer `pull` antes de modificar.
- No tocar `main`.
- No hacer merge ni PR.
- Auditar primero la implementación financiera actual antes de crear componentes nuevos.
- Reutilizar Facturación, CxC, CxP, Nómina, Contabilidad y navegación actuales.
- Mantener frontend/demo-first. No backend nuevo.
- Si el repo mantiene `frontend/src` y `src`, identificar el árbol canónico y usar `sync:frontend` solo si aplica.
- Mantener theme RTM y design system existente.
- No fingir bancos reales, SAT real, conciliación real ni contabilidad fiscal productiva.
- Todos los datos bancarios, referencias, movimientos y estados pueden ser demo, pero deben ser coherentes.

---

# 1. Objetivo

Corregir dos áreas que hoy se sienten como vistas estáticas y poco operativas:

1. **Tesorería & Bancos**
2. **Reportes Financieros**

La meta es que ambas se comporten como partes reales de un ERP:

- Tesorería debe permitir operar pagos, movimientos, cuentas y conciliación.
- Reportes Financieros debe mostrar estados financieros con jerarquía, comparativos, subtotales y drill-down.

No basta con mostrar tablas simples o montos sueltos.

---

# 2. TESORERÍA & BANCOS — ARQUITECTURA FINAL

Mantener estas tabs internas:

```text
Posición | Movimientos | Pagos Programados | Conciliación | Flujo de Caja
```

Cada tab debe ser operativa y tener acciones claras.

---

# 3. Tab Posición

Debe responder:

- ¿Cuánto efectivo hay?
- ¿En qué cuentas está?
- ¿Cuánto está comprometido?
- ¿Cuánto queda disponible?
- ¿Cuál es el saldo proyectado?

## Cards por cuenta bancaria

Cada cuenta debe mostrar:

- nombre cuenta
- banco demo
- moneda
- saldo contable
- saldo disponible
- comprometido
- saldo proyectado
- última conciliación

Ejemplo:

```text
Cuenta Operativa MXN · Demo
Saldo contable     $486,200
Comprometido       $179,260
Disponible         $306,940
Proyectado 30 días $522,400
```

## Acciones

Header:

- `+ Nueva cuenta bancaria`
- `Transferencia entre cuentas`
- `Exportar`

Click en cualquier cuenta debe abrir drawer/modal de detalle con:

- últimos movimientos
- pagos pendientes
- conciliación reciente
- saldo contable vs disponible
- origen de movimientos

---

# 4. Tab Movimientos

Debe dejar de ser solo histórico.

## Command bar

```text
[ + Registrar movimiento ] [ Transferencia ] [ Importar movimientos demo ] [ Exportar ]
```

## Tipos de movimiento demo

- Cobro cliente
- Pago proveedor
- Nómina
- Transferencia entre cuentas
- Comisión bancaria
- Depósito
- Retiro
- Ajuste
- Servicio recurrente

## Tabla

Columnas:

- Fecha
- Tipo
- Cuenta
- Referencia
- Beneficiario / Origen
- Documento origen
- Entrada
- Salida
- Saldo posterior
- Estado conciliación
- Acciones

## Click en fila

Abrir detalle con trazabilidad:

```text
Origen operativo
CxP → FP-662190

Pago
PAG-2026-0084

Cuenta
Cuenta Operativa MXN

Conciliación
Pendiente
```

Cuando el movimiento provenga de otro módulo, mostrar CTA:

- `Ver factura proveedor`
- `Ver CxP`
- `Ver CxC`
- `Ver nómina`

No dejar folios como texto muerto.

---

# 5. Tab Pagos Programados

La vista actual debe volverse realmente operativa.

## Command bar obligatoria

```text
[ + Programar pago ] [ Autorizar seleccionados ] [ Reprogramar ] [ Exportar ]
```

## Origen correcto del pago

Normalmente un pago debe nacer de una obligación existente:

```text
Factura proveedor
→ CxP
→ autorizada para pago
→ Tesorería
→ programar pago
→ seleccionar cuenta
→ autorizar
→ liberar
→ aplicar
→ conciliar
```

No crear una segunda CxP dentro de Tesorería.

## Tabla

Columnas:

- Fecha programada
- Beneficiario
- Factura / documento
- Origen
- Cuenta de pago
- Método
- Importe
- Prioridad
- Estado
- Acciones

Estados demo:

- Por autorizar
- Autorizado
- Programado
- Liberado
- Aplicado
- Conciliado
- Reprogramado
- Cancelado

## Acciones por registro

- Ver detalle
- Autorizar
- Liberar pago
- Reprogramar
- Cancelar
- Marcar aplicado
- Ver origen

## Detalle del pago

Mostrar:

- proveedor / beneficiario
- factura
- CxP
- OC
- recepción relacionada
- vencimiento
- importe
- cuenta origen
- método
- referencia bancaria demo
- autorizado por
- fecha autorización
- timeline del pago

Timeline ejemplo:

```text
05 Sep · Factura validada
06 Sep · Programada para pago
07 Sep · Autorizada
08 Sep · Liberada
09 Sep · Aplicada
10 Sep · Conciliada
```

---

# 6. Programar pago

Agregar modal/drawer `Programar pago`.

Debe permitir:

- seleccionar obligación CxP pendiente
- proveedor
- factura
- saldo
- fecha vencimiento
- monto a pagar
- pago total / parcial
- fecha programada
- cuenta bancaria origen
- método de pago
- prioridad
- notas

Al guardar:

- crear pago programado demo
- actualizar estado local
- mostrar confirmación

No duplicar la factura.

---

# 7. Conciliación bancaria

La pantalla debe parecer una herramienta real de conciliación.

## Header

- Cuenta bancaria
- Periodo
- `Importar estado de cuenta`
- `Conciliar seleccionados`
- `Exportar`

## Layout recomendado

Dos columnas:

```text
BANCO / ESTADO DE CUENTA        ERP
────────────────────────        ────────────────────────
08 Sep +$30,000                 FAC-0045 +$30,000
08 Sep -$50,800                 FP-662190 -$50,800
09 Sep -$39,800                 Servicio planta -$39,800
```

Mostrar sugerencias de coincidencia por:

- importe
- fecha
- referencia
- beneficiario

## Estados

- Coincidencia sugerida
- Conciliado
- Pendiente
- Diferencia
- Sin movimiento ERP

## Acciones

- Conciliar
- Desconciliar
- Marcar diferencia
- Crear movimiento faltante demo
- Ignorar

## KPIs

- Movimientos banco
- Movimientos ERP
- Conciliados
- Pendientes
- Diferencias
- Diferencia neta

---

# 8. Flujo de Caja

Debe ser una de las vistas más fuertes de Tesorería.

## Filtros

- 7 días
- 30 días
- 60 días
- 90 días
- Mes actual

## KPIs

- Saldo inicial
- Entradas esperadas
- Salidas programadas
- Nómina
- Gastos recurrentes
- Saldo proyectado
- Peor día de caja demo

## Gráfica principal

Gráfica real y legible con:

- saldo proyectado
- entradas
- salidas

## Drill-down

Click en una barra/punto/periodo debe mostrar:

- facturas CxC que generan entradas
- facturas CxP que generan salidas
- pagos programados
- nómina
- recurrentes

No mostrar cifras sin origen.

---

# 9. REPORTES FINANCIEROS — PROBLEMA ACTUAL

Eliminar la experiencia de tres tablas simplificadas donde:

- Estado de Resultados tiene 3 filas
- Balance solo muestra Activo/Pasivo/Capital
- columnas dicen `Fecha`, `Documento / origen`, `Importe`, `Estado`
- `Vista previa` aparece como si fuera importe

Eso no representa correctamente un estado financiero.

---

# 10. Reportes Financieros — arquitectura final

La pantalla debe funcionar como un centro de reportes.

Header global:

- Reporte
- Periodo
- Comparar contra
- Centro de costo / dimensión
- Moneda
- `Actualizar`
- `Exportar Excel`
- `Exportar PDF`
- `Imprimir`

Selector principal de reporte:

```text
Estado de Resultados
Estado de Situación Financiera
Flujo de Efectivo
Balanza de Comprobación
Mayor / Auxiliares
Antigüedad CxC
Antigüedad CxP
Presupuesto vs Real
```

---

# 11. Estado de Resultados

Debe mostrarse como estado financiero jerárquico.

Ejemplo visual:

```text
INGRESOS
  Ventas nacionales                     $447,180
  Otros ingresos                          $12,400
TOTAL INGRESOS                           $459,580

COSTO DE VENTAS
  Materiales                             $120,086
  Mano de obra directa                    $68,000
  Otros costos                            $22,500
TOTAL COSTO DE VENTAS                    $210,586

UTILIDAD BRUTA                           $248,994

GASTOS OPERATIVOS
  Administración                         $74,300
  Mantenimiento                           $31,200
  Servicios                               $19,963
TOTAL GASTOS OPERATIVOS                  $125,463

UTILIDAD OPERATIVA                       $123,531
```

## Columnas comparativas

Permitir:

- Mes actual
- Mes anterior
- Variación $
- Variación %
- Presupuesto
- Real vs presupuesto

## Interacción

- expandir / colapsar grupos
- click en cuenta → auxiliar
- click en subtotal → drill-down de cuentas

---

# 12. Estado de Situación Financiera / Balance General

Debe mantener ecuación:

```text
Activo = Pasivo + Capital
```

Estructura:

```text
ACTIVO
  Activo circulante
    Bancos
    Clientes
    Inventarios
    IVA acreditable
  Activo no circulante
    Maquinaria y equipo
    Depreciación acumulada
TOTAL ACTIVO

PASIVO
  Proveedores
  Nómina por pagar
  Impuestos por pagar
  Otros pasivos
TOTAL PASIVO

CAPITAL
  Capital social demo
  Resultados acumulados
  Resultado del periodo
TOTAL CAPITAL

TOTAL PASIVO + CAPITAL
```

Mostrar indicador visible:

`Balance cuadrado`

o

`Diferencia detectada`

No usar `Cuadrado demo` como simple estado de fila.

---

# 13. Flujo de Efectivo

Mostrar:

- Actividades de operación
- Actividades de inversión
- Actividades de financiamiento
- Incremento/disminución de efectivo
- Efectivo inicial
- Efectivo final

Comparativo por periodo.

Click en rubro → movimientos bancarios origen.

---

# 14. Balanza de Comprobación

Tabla real:

- Cuenta
- Nombre
- Saldo inicial
- Cargos
- Abonos
- Saldo final deudor
- Saldo final acreedor

Footer:

```text
Total cargos = Total abonos
```

Si no cuadra, mostrar diferencia claramente.

Filtros:

- periodo
- nivel de cuenta
- centro de costo
- solo con movimientos

---

# 15. Mayor / Auxiliares

Permitir seleccionar cuenta.

Ejemplo:

`1101 · Bancos`

Tabla:

- Fecha
- Póliza
- Concepto
- Documento origen
- Cargo
- Abono
- Saldo

Click en póliza/documento → detalle.

---

# 16. Antigüedad CxC y CxP

No deben ser solo totales.

Buckets:

- Vigente
- 1–30
- 31–60
- 61–90
- +90

Mostrar:

- total por bucket
- gráfica
- tabla por cliente/proveedor
- drill-down a documentos

---

# 17. Presupuesto vs Real

Tabla por centro de costo / rubro:

- Presupuesto
- Real
- Variación $
- Variación %
- Estado

Gráfica de variación.

Montos y presupuestos son demo, no política real RTM.

---

# 18. Drill-down transversal obligatorio

Toda cifra importante debe poder explicarse.

Ejemplos:

```text
Ventas netas
→ cuentas contables
→ pólizas
→ facturas
```

```text
Proveedores
→ cuentas contables
→ pólizas
→ CxP
→ factura proveedor
```

```text
Bancos
→ cuenta bancaria
→ movimientos
→ conciliación
```

No dejar montos grandes sin trazabilidad.

---

# 19. UX / diseño

- Mantener layout limpio y enterprise.
- No llenar la pantalla de cards decorativas.
- Reportes deben priorizar tablas financieras jerárquicas.
- Tesorería sí puede usar KPIs y gráficas operativas.
- Sticky headers donde ayude.
- Totales y subtotales visualmente diferenciados.
- Montos alineados a la derecha.
- `tabular-nums` para cifras.
- MXN consistente.
- Theme dinámico.
- Responsive 1366/1440/1920.

---

# 20. No alcance

NO implementar:

- conexión bancaria real
- SPEI real
- archivos bancarios reales
- SAT real
- contabilidad electrónica real
- DIOT real
- pólizas productivas oficiales
- cierres fiscales reales
- backend

Todo sigue siendo demo frontend coherente.

---

# 21. Casos demo obligatorios

## Caso A — Pago proveedor

1. abrir CxP
2. seleccionar factura validada
3. programar pago
4. elegir cuenta bancaria
5. autorizar
6. liberar
7. marcar aplicado
8. conciliar

## Caso B — Cobro cliente

1. CxC registra cobro
2. aparece movimiento en Tesorería
3. conciliar contra banco demo

## Caso C — Drill-down Estado de Resultados

1. abrir Reportes
2. Estado de Resultados
3. click Ventas netas
4. ver cuentas
5. ver pólizas/facturas origen

## Caso D — Balanza

1. abrir Balanza
2. confirmar cargos = abonos
3. abrir auxiliar de Bancos

## Caso E — Flujo de Caja

1. abrir 30 días
2. seleccionar semana con saldo bajo
3. ver cobros y pagos que forman el saldo

---

# 22. Auditoría técnica obligatoria

Antes de editar revisar al menos:

- `frontend/src/components/Finanzas/`
- `FinanceHub` o reemplazo actual
- `CxcPage`
- `CxpPage`
- `FacturacionPage`
- `DashboardShell`
- `Sidebar`
- `mockFinanzasData`
- integración con Nómina
- integración con Cotizaciones/Pedidos si aplica
- librerías de gráficas disponibles después de cambios recientes

No crear una segunda arquitectura financiera paralela.

---

# 23. Criterios de aceptación

- Tesorería permite crear/operar movimientos y pagos demo.
- Todas las filas clave abren detalle.
- Pagos programados tienen flujo completo.
- Conciliación compara Banco vs ERP.
- Flujo de caja tiene gráfica + drill-down.
- Reportes Financieros ya no son 3 tablas simplonas.
- Estado de Resultados es jerárquico y comparativo.
- Balance muestra Activo, Pasivo y Capital desglosados.
- Flujo de Efectivo funciona como reporte independiente.
- Balanza incluye cargos, abonos y saldos.
- Mayor/Auxiliar permite drill-down.
- CxC/CxP aging tiene buckets y detalle.
- Reportes exportables en demo.
- Todos los montos principales tienen trazabilidad.
- Build sin errores.

---

# 24. Validación final

1. validar navegación de Finanzas;
2. validar todas las acciones de Tesorería;
3. validar modales/drawers;
4. validar conciliación demo;
5. validar reportes y subtotales;
6. validar ecuación Activo = Pasivo + Capital;
7. validar Balanza cargos = abonos;
8. validar drill-down;
9. correr `sync:frontend` si aplica;
10. correr `npm run build`;
11. corregir todos los errores.

---

# 25. Reporte final

Entregar breve:

- archivos modificados
- funciones operativas agregadas
- reportes corregidos
- integraciones reutilizadas
- resultado del build
- pendientes reales si existen
