# RTM — REDISEÑO DE FINANZAS ERP CORRECTO

## Corrección integral de Dashboard Financiero, Tesorería, Contabilidad, Presupuestos, Activos y Reportes

## 0. Reglas de ejecución

- Trabajar **solo en `alvaro01`**.
- Hacer `pull` antes de modificar.
- No tocar `main`.
- No hacer merge ni PR.
- Auditar el repo actual antes de crear o borrar componentes.
- No romper Facturación, CxC, CxP, Nómina, Compras, Ventas, Mantenimiento ni Centro de Alertas.
- Mantener frontend/demo-first. No backend real, bancos reales, SAT real ni pólizas fiscales reales.
- Reutilizar design system, theme dinámico, cards, tablas, modales, drawers y librería de gráficas existente.
- Si existen `frontend/src` y `src`, identificar árbol canónico y ejecutar `sync:frontend` solo si aplica.
- Toda cifra financiera simulada debe ser coherente entre vistas y claramente demo cuando no provenga de una transacción existente.

---

# 1. Hallazgo de auditoría actual

El módulo actual de Finanzas quedó conceptualmente mezclado.

Actualmente existe `FinanceHub.tsx` con cuatro tabs internas:

```text
Visión general | Tesorería | Contabilidad | Reportes
```

pero al mismo tiempo el Sidebar ya tiene módulos separados:

```text
Facturación
Dashboard
CxC
CxP
Tesorería
Contabilidad
Reportes Financieros
```

Esto genera una arquitectura redundante: los elementos de sidebar `finanzas`, `tesoreria`, `contabilidad` y `reportes-financieros` terminan renderizando el mismo `FinanceHub`, cuyo estado inicial siempre es `dashboard`.

Además el título visible `Control financiero` resulta demasiado genérico y no corresponde a una arquitectura ERP financiera clara.

El contenido actual de Contabilidad es muy superficial: catálogo de pocas cuentas + cuatro pólizas + balanza resumida. Tesorería es una lista de cuentas/movimientos y una conciliación muy básica. Reportes presenta pocos estados y no tiene navegación, comparativos, drill-down ni estructura contable suficientemente convincente.

## Corrección conceptual obligatoria

**Eliminar la duplicación Sidebar + tabs internas.**

Cada entrada del sidebar debe abrir su propia vista funcional.

No usar `Control financiero` como nombre del módulo.

---

# 2. Arquitectura correcta para demo RTM

Mantener la sección **FINANZAS** en sidebar y ordenarla así:

```text
FINANZAS
├─ Dashboard Financiero
├─ Facturación
├─ Cuentas por Cobrar
├─ Cuentas por Pagar
├─ Tesorería & Bancos
├─ Contabilidad General
├─ Presupuestos
├─ Activos Fijos
└─ Reportes Financieros
```

## NavItemKey sugeridas

Mantener las existentes cuando sea posible:

- `finanzas`
- `facturacion`
- `cxc`
- `cxp`
- `tesoreria`
- `contabilidad`
- `reportes-financieros`

Agregar:

- `presupuestos`
- `activos-fijos`

Todos deben integrarse en:

- `Sidebar`
- `DashboardShell`
- `NavigationModulesContext`
- Configuración → Módulos & Navegación
- `Topbar`

Cada módulo puede ocultarse de manera independiente.

---

# 3. Referencia funcional de ERPs enterprise

La estructura debe inspirarse en patrones comunes de Microsoft Dynamics 365 Finance, Oracle Fusion Financials, SAP S/4HANA Finance y prácticas mexicanas tipo CONTPAQi.

Los bloques funcionales que aparecen repetidamente en esos sistemas son:

- General Ledger / Contabilidad General
- Accounts Receivable
- Accounts Payable
- Cash & Bank Management
- Payments
- Budgeting / Budget Control
- Fixed Assets
- Cost Accounting / dimensiones
- Financial Reporting
- Period Close
- Reconciliations
- Tax / cumplimiento

Para RTM demo no se implementará profundidad fiscal/productiva completa, pero la UI debe reflejar correctamente esta separación.

---

# 4. Dashboard Financiero — pantalla ejecutiva

Esta debe ser la entrada principal a Finanzas.

Título:

`Dashboard Financiero`

Subtítulo sugerido:

`Liquidez, cartera, obligaciones, rentabilidad y desempeño financiero.`

NO usar `Control financiero`.

## 4.1 Selector de periodo

- Hoy
- Semana
- Mes actual
- Últimos 3 meses
- Año actual
- Personalizado demo

Si el selector no recalcula todo, mostrar banner discreto `Datos demostrativos`.

## 4.2 KPIs superiores

Mostrar 8 KPIs coherentes:

- Posición de efectivo
- Ingresos del periodo
- Egresos del periodo
- Flujo neto
- CxC pendiente
- CxC vencida
- CxP pendiente
- Utilidad operativa demo

Segunda línea opcional:

- Capital de trabajo
- Margen operativo
- Cobertura de compromisos
- Presupuesto consumido

No inventar ratios sin explicar que son demo o derivados de mocks.

## 4.3 Gráficas obligatorias

### A. Flujo de caja real/proyectado

Área o línea de 30/60/90 días:

- saldo inicial
- entradas esperadas
- salidas esperadas
- saldo proyectado

### B. Ingresos vs egresos

Barras mensuales últimos 6 meses.

### C. Estado de resultados resumido

Waterfall o barras:

- Ventas
- Costo
- Utilidad bruta
- Gastos operativos
- Utilidad operativa

### D. CxC vs CxP por vencimiento

Visual comparativo:

- Vigente
- 1–30
- 31–60
- 61–90
- +90

### E. Presupuesto vs real

Por centro de costo o categoría.

### F. Gastos por centro de costo

Donut/bar:

- Producción Offset
- Flexografía
- Serigrafía
- Calidad
- Mantenimiento
- Administración

Los centros de costo son demo si RTM no los confirmó explícitamente.

### G. Tendencia de margen

Últimos 6 meses.

### H. Liquidez / capital de trabajo

Visual pequeño pero útil con:

- Activo circulante
- Pasivo circulante
- Capital de trabajo

## 4.4 Atención financiera

Panel con CTA navegables:

- facturas vencidas por cobrar
- pagos a proveedor próximos
- diferencia bancaria sin conciliar
- pólizas pendientes de contabilizar demo
- presupuesto excedido demo
- cierre contable pendiente demo

Cada CTA debe abrir el módulo correspondiente.

---

# 5. Tesorería & Bancos

No debe ser una simple lista.

Debe responder:

- ¿Cuánto dinero tengo disponible?
- ¿En qué cuenta?
- ¿Qué entra y sale próximamente?
- ¿Qué pagos tengo que liberar?
- ¿Qué movimientos no están conciliados?

## Tabs internas permitidas

Estas tabs sí pertenecen al mismo dominio Tesorería:

```text
Posición | Movimientos | Pagos Programados | Conciliación | Flujo de Caja
```

## 5.1 Posición

Cards por cuenta demo:

- Cuenta Operativa MXN
- Cuenta Nómina MXN
- Cuenta USD

Por cuenta:

- saldo bancario
- saldo disponible
- comprometido
- moneda
- última conciliación

Agregar card consolidada:

- efectivo total
- comprometido
- disponible
- proyectado 30 días

## 5.2 Movimientos

Tabla:

- Fecha
- Cuenta
- Tipo
- Referencia
- Origen
- Beneficiario / cliente
- Cargo
- Abono
- Saldo
- Estado conciliación

Origen navegable:

- CxC
- CxP
- Nómina
- Transferencia
- Comisión bancaria demo

## 5.3 Pagos programados

Tabla:

- Fecha programada
- Beneficiario
- Documento
- Concepto
- Cuenta origen
- Importe
- Prioridad
- Estado

Estados:

- Por autorizar
- Programado
- Liberado
- Aplicado
- Cancelado

Acciones demo:

- Autorizar
- Programar
- Marcar aplicado
- Ver CxP

## 5.4 Conciliación bancaria

Diseñar una experiencia real de conciliación visual:

Dos columnas/listas:

```text
MOVIMIENTOS DEL ERP       ESTADO DE CUENTA
```

Estados:

- Coincidencia exacta
- Posible coincidencia
- Sin conciliar
- Diferencia

KPIs:

- movimientos banco
- movimientos ERP
- conciliados
- pendientes
- diferencia neta

Acciones demo:

- Conciliar
- Desconciliar
- Marcar diferencia
- Registrar comisión demo

Agregar un progreso de conciliación `%`.

## 5.5 Flujo de caja

Gráfica 30/60/90 días.

Tabla de eventos futuros:

- Cobros CxC
- Pagos CxP
- Nómina
- Servicios recurrentes
- otros compromisos demo

Permitir escenario visual:

`Base | Conservador | Optimista`

Solo si se puede hacer simple y estable; debe indicarse `Escenario demo`.

---

# 6. Contabilidad General

Este es el bloque que más necesita crecer.

Título:

`Contabilidad General`

Tabs internas:

```text
Resumen | Catálogo de Cuentas | Pólizas | Mayor & Auxiliares | Balanza | Periodos | Fiscal Demo
```

## 6.1 Resumen contable

KPIs:

- Periodo actual
- Pólizas del periodo
- Pólizas pendientes
- Debe
- Haber
- Diferencia
- Cuentas con movimiento
- Conciliaciones pendientes

Debe/Haber debe cuadrar en los mocks.

Agregar bloque de cierre:

- CxC conciliado con mayor
- CxP conciliado con mayor
- Bancos conciliados
- Nómina contabilizada
- periodo listo / con pendientes

## 6.2 Catálogo de Cuentas

Crear catálogo mucho más convincente y jerárquico.

Ejemplo demo:

```text
1000 ACTIVO
  1100 Activo circulante
    1101 Bancos
    1102 Clientes
    1103 IVA acreditable
    1104 Inventarios
  1200 Activo no circulante
    1201 Maquinaria y equipo
    1202 Depreciación acumulada

2000 PASIVO
  2101 Proveedores
  2102 IVA trasladado / impuestos por pagar demo
  2103 Nómina por pagar

3000 CAPITAL

4000 INGRESOS
  4101 Ventas nacionales

5000 COSTOS
  5101 Costo de ventas

6000 GASTOS
  6101 Nómina
  6102 Servicios
  6103 Administración
  6104 Mantenimiento
```

Campos:

- Cuenta
- Nombre
- Naturaleza
- Tipo
- Nivel
- Cuenta padre
- Moneda
- Estado
- Código agrupador SAT demo si aplica

No afirmar que este es el catálogo contable real de RTM.

## 6.3 Pólizas

Tabla completa:

- Folio
- Fecha
- Tipo
- Concepto
- Origen
- Debe
- Haber
- Estado
- Usuario

Tipos:

- Ingresos
- Egresos
- Diario

Estados:

- Borrador
- Contabilizada
- Cancelada

## Detalle de póliza

Mostrar partidas contables:

| Cuenta | Concepto | Centro de costo | Debe | Haber |

Totales al pie:

- Total debe
- Total haber
- Diferencia

Debe ser visualmente evidente que una póliza contabilizada cuadra.

Trazabilidad de origen:

- Factura
- Cobro
- Factura proveedor
- Pago proveedor
- Nómina
- Movimiento bancario

CTA `Ver documento origen`.

## 6.4 Mayor & Auxiliares

Permitir seleccionar cuenta y periodo.

Mostrar:

- saldo inicial
- cargos
- abonos
- saldo final

Tabla de movimientos con póliza y documento origen.

Botones demo:

- Exportar Excel
- Imprimir

## 6.5 Balanza de comprobación

Tabla correcta:

- Cuenta
- Nombre
- Saldo inicial deudor
- Saldo inicial acreedor
- Movimientos debe
- Movimientos haber
- Saldo final deudor
- Saldo final acreedor

Totales al pie.

Debe cuadrar.

Filtros:

- periodo
- nivel de cuenta
- cuentas con movimiento

## 6.6 Periodos y cierre

Vista anual con meses:

- Abierto
- En cierre
- Cerrado

Checklist cierre mensual demo:

- CxC conciliada
- CxP conciliada
- Bancos conciliados
- Nómina contabilizada
- Depreciación calculada demo
- Balanza cuadrada
- Estados financieros generados

Acción:

`Simular cierre de periodo`

Mostrar banner demo y no ejecutar lógica fiscal real.

## 6.7 Fiscal Demo México

Para que el ERP se sienta mexicano sin fingir cumplimiento real:

Cards:

- IVA trasladado
- IVA acreditable
- IVA neto demo
- CFDI emitidos
- CFDI recibidos demo

Bloque `Contabilidad electrónica · Demo`:

- Catálogo de cuentas
- Balanza mensual
- Pólizas / auxiliares
- XML demo

Botones:

- `Generar XML demo`
- `Vista previa`

Siempre mostrar:

`Demostración funcional. No genera archivos válidos para envío al SAT.`

No implementar DIOT real, Anexo 24 real ni validación SAT.

---

# 7. Presupuestos

Agregar módulo independiente `Presupuestos`.

Tabs internas:

```text
Resumen | Presupuesto | Real vs Presupuesto
```

## Resumen

KPIs:

- Presupuesto anual demo
- Ejercido
- Comprometido
- Disponible
- Variación

## Presupuesto

Tabla por centro de costo/cuenta:

- Área
- Cuenta
- Presupuesto mensual
- Presupuesto anual
- Ejercido
- Comprometido
- Disponible
- % consumo

## Real vs Presupuesto

Gráficas:

- mensual
- por centro de costo
- top desviaciones

Semáforo:

- Dentro de presupuesto
- Atención
- Excedido

No bloquear operaciones; frontend demo únicamente.

---

# 8. Activos Fijos

Agregar módulo independiente `Activos Fijos`.

Este módulo debe aprovechar la existencia de máquinas documentadas en Mantenimiento sin convertir mantenimiento en contabilidad.

## Regla

El activo financiero y la máquina de mantenimiento pueden estar vinculados, pero son conceptos distintos.

Ejemplo:

```text
Activo AF-0008
Heidelberg Speedmaster
Vinculado a máquina de Mantenimiento
```

No inventar como real:

- costo de adquisición
- fecha de compra
- valor fiscal
- vida útil
- depreciación acumulada

Usar valores explícitamente demo.

## Tabs internas

```text
Activos | Depreciación | Movimientos
```

## Activos

Campos:

- Folio
- Descripción
- Clase
- Área
- Máquina vinculada
- Fecha adquisición demo
- Costo demo
- Valor en libros demo
- Método depreciación demo
- Vida útil demo
- Estado

Clases:

- Maquinaria de producción
- Equipo de cómputo
- Mobiliario
- Vehículos demo

## Depreciación

Resumen:

- costo histórico demo
- depreciación acumulada demo
- valor neto demo
- depreciación del mes demo

Tabla mensual por activo.

## Movimientos

- Alta
- Transferencia
- Depreciación
- Baja demo

---

# 9. Reportes Financieros

No debe ser una card con cinco botones.

Crear una pantalla de reportes profesional.

Tabs/categorías:

```text
Estados Financieros | Contables | Tesorería | Cartera | Presupuesto
```

## 9.1 Estados Financieros

### Estado de Resultados

Estructura:

- Ingresos
- Costo de ventas
- Utilidad bruta
- Gastos de operación
- Utilidad operativa
- Otros resultados demo
- Resultado antes de impuestos demo

Comparativos:

- Mes actual
- Mes anterior
- Variación $
- Variación %

### Balance General / Estado de Situación Financiera

- Activo circulante
- Activo no circulante
- Total activo
- Pasivo corto plazo
- Pasivo largo plazo demo
- Capital
- Total pasivo + capital

Debe cumplir visualmente:

`Activo = Pasivo + Capital`

### Estado de Flujo de Efectivo

- Operación
- Inversión
- Financiamiento
- Cambio neto en efectivo
- Efectivo inicial
- Efectivo final

Demo, pero matemáticamente consistente.

## 9.2 Reportes Contables

- Balanza de comprobación
- Libro diario
- Libro mayor
- Auxiliar de cuenta
- Pólizas por periodo
- Movimientos por centro de costo

## 9.3 Tesorería

- Flujo de caja
- Movimientos bancarios
- Conciliación bancaria
- Pagos programados

## 9.4 Cartera

- Antigüedad CxC
- Antigüedad CxP
- Cobranza por cliente
- Pagos por proveedor

Reutilizar información real del módulo CxC/CxP; no duplicar lógica.

## 9.5 Presupuesto

- Real vs presupuesto
- Desviaciones
- Consumo por centro de costo

## Acciones comunes

- selector periodo
- selector moneda demo
- exportar Excel demo
- imprimir
- vista previa

---

# 10. Dimensiones financieras / Centros de costo

Agregar soporte visual transversal sin desarrollar un motor contable completo.

Dimensiones demo:

- Centro de costo
- Área
- Línea productiva

Posibles valores demo coherentes con RTM:

- Offset
- Flexografía
- Serigrafía
- Calidad
- Mantenimiento
- Administración

Usar estas dimensiones en:

- pólizas
- presupuesto
- gastos
- reportes

No inventar estructura organizacional formal de RTM; etiquetar como configuración demo.

---

# 11. Integración financiera transversal

La principal diferencia entre una pantalla bonita y un ERP es la trazabilidad.

## Facturación → Contabilidad

Factura timbrada demo debe poder mostrar su asiento:

```text
Clientes              Debe
Ventas                 Haber
IVA trasladado         Haber
```

No fijar importes manuales desconectados; derivarlos del documento cuando sea viable.

## CxC → Tesorería / Contabilidad

Pago cliente:

```text
Bancos                 Debe
Clientes                Haber
```

## CxP → Tesorería / Contabilidad

Factura proveedor:

```text
Gasto/Inventario        Debe
IVA acreditable         Debe
Proveedores             Haber
```

Pago:

```text
Proveedores             Debe
Bancos                  Haber
```

Estos asientos son ejemplos demo de trazabilidad; no afirmar que corresponden exactamente a la política contable real RTM.

## Nómina → Contabilidad

Crear referencia de póliza demo desde nómina cerrada/timbrada demo.

## Mantenimiento → Presupuesto / gasto

Solo si existe costo mock ya disponible.

No inventar integración compleja si no existe fuente de datos.

---

# 12. Calidad visual

Este rediseño debe verse al nivel del CRM nuevo.

Obligatorio:

- jerarquía visual clara
- charts con tooltips
- tablas limpias y densas
- drill-downs
- badges semánticos
- montos con `tabular-nums`
- MXN consistente
- dark/light/themes
- responsive laptop
- no 20 cards iguales
- no pantallas hechas únicamente de listas
- no textos tipo placeholder técnico

El Dashboard Financiero debe tener al menos 6 gráficas/visuales relevantes además de KPIs.

Contabilidad debe sentirse operativa, no decorativa.

Tesorería debe sentirse como una herramienta diaria.

Reportes debe sentirse como un centro de consulta profesional.

---

# 13. No alcance

NO implementar:

- conexión bancaria real
- SPEI real
- dispersión bancaria real
- SAT real
- DIOT real
- Anexo 24 real
- XML fiscal válido
- cálculo fiscal real
- depreciación fiscal real
- consolidación multiempresa real
- multi-GAAP / IFRS
- revaluación cambiaria real
- backend

Todo debe seguir siendo demo frontend.

---

# 14. Auditoría técnica previa obligatoria

Antes de implementar revisar al menos:

- `frontend/src/components/Finanzas/FinanceHub.tsx`
- `frontend/src/components/Finanzas/FacturacionPage.tsx`
- `frontend/src/components/Finanzas/CxcPage.tsx`
- `frontend/src/components/Finanzas/CxpPage.tsx`
- `frontend/src/data/mockFinanzasData.ts`
- `frontend/src/components/Sidebar.tsx`
- `frontend/src/components/DashboardShell.tsx`
- `frontend/src/components/Topbar.tsx`
- `frontend/src/context/NavigationModulesContext.tsx`
- Nómina
- Mantenimiento
- Centro de Alertas
- librería de charts instalada

Determinar qué partes de `FinanceHub` sirven y cuáles deben dividirse en páginas/componentes reutilizables.

No borrar lógica útil por comodidad.

---

# 15. Criterios de aceptación

- Ya no aparece `Control financiero` como nombre principal.
- Sidebar no duplica navegación con tabs globales dentro de `FinanceHub`.
- `Dashboard`, `Tesorería`, `Contabilidad`, `Presupuestos`, `Activos Fijos` y `Reportes` abren vistas correctas.
- Facturación, CxC y CxP permanecen funcionales e independientes.
- Dashboard tiene KPIs + al menos 6 visualizaciones financieras útiles.
- Tesorería incluye posición, movimientos, pagos programados, conciliación y flujo.
- Contabilidad incluye catálogo jerárquico, pólizas detalladas, mayor/auxiliares, balanza y periodos.
- Pólizas contabilizadas cuadran Debe = Haber.
- Balanza cuadra.
- Balance General cuadra Activo = Pasivo + Capital.
- Reportes tienen comparativos y drill-down visual.
- Presupuesto muestra real vs presupuesto.
- Activos Fijos puede vincular activos demo con máquinas documentadas sin inventar datos como reales.
- Existe trazabilidad visual Facturación/CxC/CxP/Nómina → Finanzas.
- Fiscal siempre está marcado como demo/no válido SAT.
- Navegación por configuración funciona.
- Themes funcionan.
- No rompe módulos actuales.
- `npm run build` termina sin errores.

---

# 16. Validación final

Al terminar:

1. buscar globalmente `Control financiero` y remover wording residual donde corresponda;
2. revisar que cada NavItemKey financiera abra la pantalla correcta;
3. validar Debe/Haber de mocks;
4. validar Balanza;
5. validar Balance General;
6. revisar trazabilidad entre módulos;
7. probar todos los botones demo;
8. ejecutar `sync:frontend` solo si aplica;
9. ejecutar `npm run build`;
10. corregir errores.

---

# 17. Reporte final de Anti

Entregar reporte corto con:

- arquitectura financiera final
- archivos agregados/modificados
- pantallas rediseñadas
- gráficas implementadas
- integraciones reutilizadas
- validaciones de cuadratura
- resultado de build
- pendientes reales si existen
