# Producción — Costeo Real de Orden de Producción (Demo Enterprise)

## 0. Objetivo

Agregar al demo RTM una experiencia de **Costeo Industrial por Orden de Producción** que conecte lo que ya existe en Ventas, Producción, Piso, Scrap y Finanzas.

La pantalla debe responder, en segundos:

1. ¿Cuánto esperábamos que costara esta orden?
2. ¿Cuánto está costando realmente?
3. ¿Dónde se está desviando el costo?
4. ¿Cuál es el costo unitario real?
5. ¿Qué margen se está erosionando?
6. ¿Qué debería revisar el responsable antes de que termine la orden?

La narrativa comercial del demo debe ser:

> **Cotización / Pedido → Costo estimado → OP → consumo y tiempo real → scrap / paros → costo real → margen real → impacto financiero.**

No es un módulo contable aislado. Es el puente entre **Comercial + Ventas + Producción + Finanzas**.

---

## 1. Auditoría previa obligatoria

Antes de implementar, revisar el estado ACTUAL de `alvaro01` porque hay trabajo de Codex/Anti ejecutándose en paralelo.

Revisar completos o al menos los bloques relevantes de:

- `src/components/Produccion/ProduccionPage.tsx`
- `src/components/Produccion/OrdenProduccionDetail.tsx`
- `src/components/Produccion/AnaliticaProduccion.tsx`
- `src/components/Produccion/ScrapPérdidasWorkspace.tsx`
- `src/components/Produccion/PisoOperadorWorkspace.tsx`
- `src/data/mockProduccionData.ts`
- `src/data/mockSalesData.ts`
- `src/components/DashboardShell.tsx`
- `src/components/Finanzas/FinanceWorkspace.tsx`
- `src/components/Finanzas/AccountingReportsWorkspace.tsx`
- `docs/design-system.md`

Validar específicamente:

- `ProductionOrder.pedido`
- `SalesOrder.folio`
- `SalesOrder.financials`
- costo/margen estimado de la cotización/pedido existente
- materiales y lotes de la OP
- minutos estándar vs transcurridos
- routing y setup/run minutes
- scrap real
- incidencias / paros
- máquinas compatibles / receta maestra

**No crear una segunda verdad financiera/comercial si ya existe información utilizable.**

---

# 2. Dónde vive

## No crear un módulo nuevo en Sidebar

Costeo es parte natural de Producción.

Agregar tab principal:

`Producción → Costeo`

Tabs propuestas:

```text
Dashboard | Planeación | Órdenes | Piso | Procesos | Máquinas | Scrap y pérdidas | Costeo | Analítica
```

Además, dentro del detalle de una OP agregar:

```text
Resumen | Routing | ... | Materiales | Herramental | Incidencias | Costeo | Trazabilidad
```

El tab `Costeo` general sirve para **analizar todas las órdenes**.

El tab `Costeo` de la OP sirve para **entender una orden específica**.

---

# 3. Principio de datos

## Tres columnas conceptuales

Todo costeo debe manejar:

### Cotizado
Lo que se usó comercialmente para dar precio al cliente.

Fuente preferida:

`Cotización / Pedido → financials.estimatedCost`

### Estándar
Lo que Producción esperaba consumir según receta, routing y tiempos estándar.

### Real / Proyectado
Lo que ya consumió la OP y lo que se proyecta al terminar.

Mientras la OP no termine, el sistema NO debe fingir que conoce el costo final.

Mostrar explícitamente:

- **Real acumulado**
- **Proyección al cierre**

Cuando la OP esté terminada/liberada, puede mostrarse como **Costo real final**.

---

# 4. Modelo de costo demo

Crear un único origen de configuración, por ejemplo:

`src/data/mockProductionCostData.ts`

No meter números sueltos repetidos en componentes.

Tipos sugeridos:

```ts
ProductionCostConfig
MachineCostRate
LaborCostRate
MaterialCostReference
ProductionOrderCostSnapshot
ProductionCostComponent
```

## Componentes del costo

### 1. Materia prima

- papel / bobina
- tintas
- barnices
- laminados
- empaque
- otros consumibles de la receta

Usar materiales reales de la OP.

Si hoy el material sólo tiene cantidad como string, enriquecer el modelo de demo con metadata de costo centralizada; no parsear textos de UI como fuente contable.

Debe poder mostrar:

- cantidad estándar
- cantidad real/entregada
- costo unitario referencia
- costo estándar
- costo real
- variación

### 2. Mano de obra directa

Basada en:

- tiempo reportado / tiempo transcurrido
- categoría de operación
- tarifa estándar de mano de obra demo configurable

NO utilizar salario neto de Nómina como costo industrial.

Etiqueta visible:

`Tarifa industrial demo configurable`

### 3. Hora máquina

Tarifa por máquina o grupo de máquina:

- Offset
- Flexografía
- Acabados
- Preprensa / otros

Usar minutos reales vs estándar.

Mostrar claramente:

`Tarifa máquina demo configurable`

### 4. Setup

Separar setup de corrida para poder explicar desviaciones.

Ejemplo:

```text
Setup estándar     40 min
Setup real         67 min
Variación          +27 min
Impacto costo      +$1,420
```

### 5. Scrap / Merma

Tomar `order.scrap` y los eventos disponibles en Scrap & Pérdidas.

Calcular costo de merma con una regla demo consistente.

Debe distinguir:

- scrap estándar esperado de receta
- scrap real
- exceso de scrap
- impacto monetario del exceso

### 6. Paros / incidencias

No sumar un costo ficticio doble si ya se está capturando como tiempo máquina/mano de obra.

Mostrarlo como **causa de variación de tiempo/costo**, no necesariamente como un componente adicional.

Ejemplo:

```text
Paro por ajuste de máquina
47 min
Impacto estimado en costo de conversión: $2,180
```

### 7. Carga fabril / indirectos

Para demo puede existir como una tasa configurable simple.

Debe etiquetarse:

`Carga fabril demo configurable`

No presentarla como regla real RTM si no está documentada.

---

# 5. Dashboard de Costeo

Debe verse **enterprise, limpio y espectacular**, al nivel visual de Inventario, Requisiciones y CRM nuevo.

## Header

```text
COSTEO INDUSTRIAL · RTM
Costeo de Órdenes de Producción

[ 7 días ] [ 30 días ] [ 60 días ] [ 90 días ]
Área [Todas ▾]   Cliente [Todos ▾]   Estado [Todos ▾]
                                             [ Exportar ]
```

Default: **30 días**.

Los filtros deben cambiar la información mostrada; no deben ser decoración muerta.

---

## 5.1 KPIs principales

Máximo 6 cards.

Propuesta:

1. **Costo acumulado del periodo**
2. **Variación vs estándar**
3. **Costo promedio / unidad**
4. **Scrap fuera de estándar**
5. **Margen proyectado**
6. **OPs con erosión de margen**

Cada KPI debe tener:

- valor principal
- comparación vs estándar / periodo anterior cuando aplique
- microcopy explicativa
- click si hay destino útil

---

# 6. Bloque protagonista — Control de margen

Este debe ser el bloque más fuerte del dashboard.

```text
CONTROL DE MARGEN · ÓRDENES ACTIVAS

OP                CLIENTE        VENTA       ESTÁNDAR     PROYECTADO    VAR.      MARGEN
95250             Panasonic      $67,500     $43,100      $48,920       +13.5%    27.5%
95249             Black&Decker   $94,200     $62,700      $71,400       +13.9%    24.2%
95252             TYCO           $52,800     $34,900      $35,600       +2.0%     32.6%
```

Semáforo por variación, no por colores de fondo saturados.

Click en una fila → abre OP directamente en tab `Costeo`.

---

# 7. Sugerencias del sistema — morado SMART

Debe existir un bloque premium con `Sparkles`.

Título:

**Sugerencias del sistema**

No llamarlo IA.

Reglas demo transparentes.

Ejemplos:

### Material

```text
✦ OP-2026-95250
El costo de materia prima está 11.8% arriba del estándar.

Principal causa:
BOPP utilizado por encima de consumo esperado.

[ Ver materiales ] [ Ver OP ]
```

### Setup

```text
✦ OP-2026-95249
Setup real: 67 min vs 40 min estándar.
Impacto estimado: +$1,420.

Recomendación:
Revisar incidencia de ajuste registrada en Heidelberg.

[ Ver incidencia ]
```

### Scrap

```text
✦ Flexografía
3 OPs presentan scrap por encima del estándar en 30 días.
Costo incremental estimado: $8,640.

[ Ver Scrap & pérdidas ]
```

### Margen

```text
✦ Riesgo de margen
OP-2026-95250 cerraría en 27.5% vs 36.1% estimado comercialmente.

La principal erosión viene de:
Material + Setup.

[ Analizar OP ]
```

Las sugerencias deben estar basadas en los mocks/cálculos visibles.

---

# 8. Anatomía del costo

Agregar una visual clara:

**Composición del costo de producción**

Por periodo o por OP:

```text
Materia prima             54%
Máquina                   20%
Mano de obra              12%
Setup                       6%
Carga fabril                5%
Scrap incremental           3%
```

Debe dejar claro qué porcentaje representa cada componente.

No usar una gráfica exageradamente colorida.

---

# 9. Variaciones — estándar vs real

Bloque:

**Principales variaciones del periodo**

Tabs:

```text
[ Material ] [ Tiempo ] [ Scrap ] [ Margen ]
```

Ejemplo Material:

```text
Artículo / Insumo        Estándar       Real       Variación      Impacto
BOPP Blanco              12,000 m       13,180 m   +9.8%          +$4,860
Tinta Process Black      18.0 kg        18.6 kg    +3.3%          +$420
Barniz UV                9.5 kg         8.9 kg     -6.3%          -$310
```

Ejemplo Tiempo:

```text
Máquina                 Estándar       Real        Variación
Heidelberg              210 min        264 min     +54 min
Mark Andy Scout         185 min        192 min      +7 min
Guillotina 2             60 min         58 min      -2 min
```

---

# 10. Top erosión / Top favorable

Dos cards compactas:

### Mayor erosión de margen

Top 5 OPs con mayor caída `margen estimado → margen proyectado`.

### Mejor desempeño vs estándar

Top 5 OPs que terminaron / proyectan por debajo del costo estándar.

Nunca usar wording `peores`.

---

# 11. Tendencia de costo unitario

Gráfica por semana o mes:

- costo unitario estándar
- costo unitario real/proyectado

Filtros por:

- cliente
- parte
- área
- máquina

Esto sirve para responder:

> ¿Estamos produciendo esta parte más cara cada vez?

---

# 12. Analítica por dimensión

Agregar cards/tablas útiles, no veinte gráficas.

### Por cliente

- venta
- costo
- margen
- variación

### Por parte / SKU

- costo unitario
- estándar
- última OP
- tendencia

### Por línea / área

- Offset
- Flexografía
- Acabados

### Por máquina

- horas
- costo conversión
- setup promedio
- variación

---

# 13. Costeo dentro de la OP

Agregar tab `Costeo` en `OrdenProduccionDetail`.

## Header de economía de la orden

```text
OP-2026-95250 · PANASONIC
526412 | G |

Venta pedido          $67,500
Costo cotizado        $43,100
Costo estándar        $44,200
Real acumulado        $37,840
Proyección cierre     $48,920
Margen proyectado       27.5%
```

Debajo, mostrar un badge:

`EN PROCESO · costo final aún no cerrado`

Si terminó:

`COSTO REAL FINAL`

---

# 14. Comparador Cotizado vs Estándar vs Real

Tabla protagonista:

```text
COMPONENTE             COTIZADO      ESTÁNDAR      REAL/PROY.      VAR.
Materiales             $24,800       $25,300       $28,900          +14.2%
Conversión máquina      $8,200        $8,500        $9,240           +8.7%
Mano de obra            $4,100        $4,200        $4,460           +6.2%
Setup                    $2,300        $2,400        $3,820          +59.2%
Carga fabril             $3,700        $3,800        $3,900           +2.6%
Scrap incremental            —              —        $2,600              —
```

Debajo:

```text
Costo unitario estándar     $0.442
Costo unitario proyectado   $0.489
Variación                   +10.6%
```

---

# 15. Drivers de variación

Card:

**¿Qué está moviendo el costo?**

Ordenar causas por impacto:

```text
1. Material adicional            +$3,600
2. Setup extendido               +$1,420
3. Scrap fuera del estándar      +$1,180
4. Tiempo máquina                +$740
5. Mano de obra                  +$260
```

Click en cada causa debe abrir el contexto existente:

- material → Materiales
- setup / tiempo → Routing / incidencias
- scrap → Scrap & pérdidas

---

# 16. Línea de costo durante la ejecución

Mostrar timeline compacto:

```text
08:05  Setup iniciado
       +$620 acumulado

08:42  Setup terminado · +17 min vs estándar
       $1,420 sobre estándar

09:10  Primera pieza liberada

10:35  Scrap reportado · 1,240 ejs
       +$1,180 impacto estimado

11:20  Producción acumulada 62%
       Costo proyectado: $48,920
```

Debe consumir eventos existentes cuando sea posible.

No duplicar una segunda bitácora manual si ya hay `traceability`.

---

# 17. Cotización / Pedido vinculado

La OP ya tiene `pedido`.

El sistema debe intentar encontrar el `SalesOrder` correspondiente.

Si existe:

```text
ORIGEN COMERCIAL

Pedido: PED-2026-0148
Cotización: COT-2026-0089
Venta: $67,500
Costo estimado comercial: $43,100
Margen estimado: 36.1%

[ Ver pedido ]
```

Si NO existe vínculo real en mocks:

- no inventar un enlace silencioso;
- normalizar los seeds del demo para 2–4 casos protagonistas;
- o mostrar claramente `Sin documento comercial vinculado`.

Para el demo principal sí conviene que al menos 3 OPs estén totalmente enlazadas.

---

# 18. Navegación cruzada

Idealmente desde Costeo:

- OP → Pedido
- OP → Cotización
- OP → Scrap
- OP → Incidencia
- OP → Materiales
- OP → Finanzas / Reportes (si aplica)

Y desde Pedido debería ser posible identificar la OP asociada si el modelo existente lo soporta sin romper arquitectura.

No crear loops raros ni navegación falsa.

---

# 19. Drilldown de materiales

Al abrir material:

```text
BOPP Blanco Brillante

Estándar       12,000 m
Entregado      13,200 m
Consumido      13,180 m
Variación      +1,180 m

Costo ref.     $4.12 / m
Impacto        +$4,861.60

Lote           PPBC-260721
Proveedor      [si la trazabilidad disponible lo permite]
```

No inventar proveedor si no se puede resolver desde datos existentes.

---

# 20. What-if demo — P2 opcional

Si hay tiempo, agregar un mini simulador desde una OP:

**Simular costo con máquina compatible**

Usar `compatibleMachines` de receta.

Ejemplo:

```text
Actual: Mark Andy 830 10”       $48,920
Simulado: Mark Andy Scout 10”   $46,740
Diferencia estimada             -$2,180
```

Debe decir explícitamente:

`Simulación demo basada en tarifas configuradas; no reprograma la OP.`

No modificar Planeación por correr la simulación.

---

# 21. Exportación

Botón:

`Exportar análisis`

Para demo puede mostrar banner/toast profesional y nombre de archivo:

`Costeo_OP-2026-95250_2026-09.xlsx`

No fingir que descargó un archivo si no se genera realmente.

Si exportación sigue siendo demo, mostrar:

`Demo: exportación preparada para integración.`

---

# 22. Diseño visual — requisito fuerte

Este módulo debe verse **hermoso y premium**.

No aceptar:

- tabla gris gigante sin jerarquía;
- 15 KPIs iguales;
- bloques pastel saturados;
- mini gráficas improvisadas con `div` si ya existen patrones mejores;
- cards sin acciones;
- números sin explicación;
- componentes desalineados con el ERP;
- fondos morados gigantes sólo porque las sugerencias son SMART.

Sí usar:

- `rounded-2xl / rounded-3xl`
- `bg-theme-surface`
- `border-theme-subtle`
- `shadow-xs / shadow-2xs`
- tipografía monoespaciada para importes y folios
- semántica de warning/danger/success contenida
- `Sparkles` + borde/acento morado para SMART
- mucho aire y jerarquía
- tablas compactas pero legibles
- tooltips/microcopy donde el concepto financiero no sea obvio

Inspiración directa:

1. Inventario Dashboard / Analytics
2. Requisiciones
3. CRM enterprise nuevo
4. Producción actual
5. Contabilidad & Reportes

El resultado debe sentirse como **una sola plataforma**, no un módulo comprado aparte.

---

# 23. Datos demo protagonistas

Tener mínimo 8–12 OPs costeables para que la analítica no se vea vacía.

Debe haber casos intencionales:

1. OP saludable / dentro del estándar
2. OP con setup alto
3. OP con scrap alto
4. OP con material caro
5. OP con paro de máquina
6. OP con ahorro vs estándar
7. OP terminada con costo final
8. OP en proceso con costo proyectado

Usar clientes/partes ya existentes de RTM.

No inventar afirmaciones de costos reales de RTM.

Toda tarifa/rate no soportada por fuente debe ser **dato demo configurable**.

---

# 24. Arquitectura recomendada

Evitar meter todo dentro de `ProduccionPage.tsx`.

Componentes sugeridos:

```text
src/components/Produccion/Costeo/
  ProductionCostWorkspace.tsx
  ProductionCostDashboard.tsx
  ProductionCostOrderTable.tsx
  ProductionCostSmartSuggestions.tsx
  ProductionCostVariancePanel.tsx
  ProductionOrderCostTab.tsx
  ProductionCostBreakdown.tsx
  ProductionCostTrend.tsx
```

Datos/selectores:

```text
src/data/mockProductionCostData.ts
```

Funciones puras sugeridas:

```ts
getProductionOrderCost(order, salesOrder, config)
getCostVariance(...)
getProjectedCost(...)
getMarginProjection(...)
getCostSmartSuggestions(...)
```

Los mismos selectores deben alimentar Dashboard y detalle para que los números cuadren.

---

# 25. Integración con DashboardShell

Producción hoy recibe estado compartido de OPs.

Para conectar origen comercial, pasar también los datos necesarios de Ventas a `ProduccionPage` en vez de importar seeds aislados dentro de cada componente.

Preferencia:

```text
DashboardShell
  → productionOrders
  → salesOrders
  → quotes (si hace falta para drilldown)
  → ProduccionPage
```

No duplicar `INITIAL_MOCK_SALES_ORDERS` dentro de Costeo si el shell ya tiene estado vivo.

---

# 26. Criterios de aceptación P0

Debe quedar funcionando:

- tab `Costeo` en Producción
- tab `Costeo` dentro de una OP
- datos centralizados
- vínculo Pedido ↔ OP para casos demo principales
- Cotizado / Estándar / Real o Proyectado
- desglose por componente
- costo unitario
- margen estimado vs proyectado/real
- variaciones
- drivers de costo
- dashboard filtrable
- ranking de erosión de margen
- sugerencias SMART moradas
- navegación hacia contexto operativo
- cifras consistentes entre dashboard y OP

---

# 27. P1

- tendencia por parte/cliente/máquina
- analítica dimensional completa
- exportación demo mejorada
- timeline económico enriquecido
- integración visual con Finanzas

---

# 28. P2

- simulador what-if de máquina compatible
- comparación de costo por receta / revisión
- escenario de volumen
- costo de remanentes vs material nuevo

---

# 29. Narrativa demo recomendada

Caso protagonista:

1. Abrir Producción → Costeo.
2. Mostrar margen general del periodo.
3. Sistema destaca OP Panasonic con erosión de margen.
4. Abrir OP.
5. Mostrar:
   - venta del Pedido;
   - costo comercial estimado;
   - costo estándar;
   - real acumulado;
   - proyección al cierre.
6. Abrir Drivers.
7. Sistema demuestra que Material + Setup explican casi toda la variación.
8. Click Material → lote/consumo.
9. Click Setup → routing/incidencia.
10. Mostrar cómo el margen cambió por lo ocurrido realmente en piso.

Frase demo:

> “Aquí ya no sólo sabemos cuánto producimos. Sabemos cuánto nos está costando producirlo, por qué se movió el costo y qué margen nos va a dejar antes de que termine la orden.”

---

# 30. Guardrails

- Demo frontend, no contabilidad de costos certificada.
- No presentar tarifas demo como tarifas reales de RTM.
- No usar salario neto de empleado para MOD.
- No duplicar SalesOrder/ProductionOrder state.
- No hardcodear un total en Dashboard y otro distinto en detalle.
- No fingir costo final para OPs activas: usar `Proyección al cierre`.
- No meter costos en `traceability` como fuente primaria; traceability sirve para explicar eventos.
- No romper Producción/Calidad/Piso existentes.
- No crear nueva rama.

---

# 31. Build obligatorio

Al finalizar:

```bash
npm run build
npm run sync:frontend
```

`src/` es la fuente canónica.
