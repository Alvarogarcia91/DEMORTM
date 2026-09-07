# 2/5 — MRP / Planeación de Materiales Enterprise

## Progreso del cierre del demo

Este documento corresponde al bloque **2 de 5** del cierre funcional del demo RTM.

1. ✅ Trazabilidad 360 Enterprise
2. 🔵 MRP / Planeación de Materiales — este documento
3. ⏳ PPAP / Core Tools
4. ⏳ Competencias & Capacitación RH
5. ⏳ Audit Trail Global

---

# Objetivo

Crear una experiencia de **Planeación de Materiales / MRP ligero** que conecte demanda de producción, existencias, materiales comprometidos, órdenes de compra abiertas, lead times y requisiciones, sin intentar simular un MRP industrial completo.

Debe verse como una herramienta moderna de planeación y no como una tabla genérica de faltantes.

La pregunta que debe contestar la pantalla es:

> ¿Tenemos material suficiente para cumplir las OP próximas, cuándo nos vamos a quedar cortos y qué acción recomienda el sistema?

La narrativa de demo debe ser:

**Pedido / OP → demanda futura → inventario útil → OC abierta → fecha requerida → gap → recomendación → requisición / compra**.

---

# Ubicación propuesta

No crear otro módulo lateral enorme si no es necesario.

Agregar una nueva tab dentro de **Producción**:

`Dashboard | Planeación | Órdenes | Piso | Procesos | Máquinas | Scrap y pérdidas | Costeo | Materiales MRP | Analítica`

Nombre recomendado de tab:

**Materiales MRP**

Subtítulo:

> Cobertura de materiales, demanda de producción y abastecimiento preventivo.

La funcionalidad debe reutilizar datos ya existentes de:

- `ProductionOrder.materials`
- `ProductionOrder.due`
- `ProductionOrder.routing`
- inventario disponible / comprometido
- Requisiciones
- Órdenes de Compra
- proveedores y lead time
- materiales estándar de recetas maestras

No duplicar entidades.

---

# 1. Header premium

Usar el mismo lenguaje visual de Inventario, Requisiciones y CRM enterprise.

Header:

**Planeación de Materiales · MRP**

Subtexto:

> Demanda próxima, cobertura, órdenes abiertas y riesgo de suministro para las órdenes de producción RTM.

Controles superiores:

- Horizonte: `7 días | 14 días | 30 días | 60 días | 90 días`
- Área: `Todas | Offset | Flexografía | Acabados`
- Estado: `Todos | Riesgo | Faltante | Cubierto | Sobreinventario`
- Material / SKU
- `[Actualizar planeación]`
- `[Exportar]` demo

Default: **30 días**.

Los filtros deben afectar realmente los datos mostrados.

---

# 2. KPIs ejecutivos

Fila superior de máximo 6 cards:

1. **Materiales con riesgo**
   - cantidad de SKUs con cobertura insuficiente

2. **Faltantes confirmados**
   - materiales cuya demanda supera inventario útil + entradas confirmadas

3. **Órdenes en riesgo**
   - OPs afectadas por un faltante

4. **Valor de compra sugerido**
   - suma demo de necesidades calculadas con precio de referencia

5. **Cobertura promedio**
   - días de cobertura ponderados

6. **Compras abiertas relacionadas**
   - OCs abiertas que cubren demanda futura

Cada card debe tener contexto y tendencia, no sólo número.

Ejemplo:

`8 materiales con riesgo · 3 nuevos vs semana pasada`

---

# 3. Bloque protagonista — Riesgos de suministro

Este debe ser el primer bloque operativo, tipo `Requiere tu atención`.

Cards amplias, no tabla seca.

Ejemplo:

## BOPP Blanco Brillante 50 micras

- SKU: MP-BOPP-050
- Inventario físico: 4,800 m
- Comprometido: 3,900 m
- Inventario útil: 900 m
- Demanda 14 días: 6,200 m
- OC abierta: 4,000 m
- Fecha llegada: 13 Sep
- Primera necesidad: 11 Sep
- Gap temporal: 2 días
- OPs afectadas: OP-95250, OP-95258

Estado: **Riesgo alto**

CTA:
- `Ver cálculo`
- `Crear requisición`
- `Ver OPs afectadas`
- `Ver OC abierta`

---

# 4. Sugerencias del sistema — moradito SMART

Obligatorio mantener el lenguaje visual de sugerencias del sistema usado en Inventario/Requisiciones/CRM.

No decir IA si no lo es.

Título:

**Sugerencias del sistema**

Ejemplos:

### Sugerencia 1

> ✨ BOPP Blanco quedará por debajo de cobertura mínima en 6 días.
> La OC-2026-0089 llega 2 días después de la primera OP que lo requiere.
>
> Recomendación: adelantar entrega o generar compra complementaria.

Botones:

`Ver detalle` · `Crear requisición`

### Sugerencia 2

> ✨ Papel Bond 60 g tiene 41 días de cobertura y no hay demanda significativa después del 20 Sep.
>
> Recomendación: posponer la próxima compra para reducir sobreinventario.

Botón:

`Ver cobertura`

### Sugerencia 3

> ✨ Tres OP de Flexografía consumen el mismo material en la misma semana.
> Consolidar la compra podría reducir urgencias y movimientos internos.

Botones:

`Ver OPs` · `Preparar requisición consolidada`

### Sugerencia 4

> ✨ Existe remanente compatible antes de comprar material nuevo.
>
> REM-075-014 · BOPP Blanco · 2,450 ft · Calidad: apto para reutilizar.

Botones:

`Evaluar remanente` · `Ver en Calidad`

---

# 5. Vista de cobertura por material

Crear una tabla premium / data-grid compacta con buena jerarquía visual.

Columnas:

- Material / SKU
- Existencia física
- Comprometido
- Inventario útil
- Demanda horizonte
- OC abierta
- Entrada confirmada
- Cobertura días
- Gap
- Estado
- Acción

Estados semánticos:

- `Cubierto`
- `Próximo a mínimo`
- `Cobertura insuficiente`
- `Faltante`
- `Sobreinventario`

No usar fondos pastel saturados; seguir design-system.

Cada fila debe abrir detalle.

---

# 6. Detalle del material — drawer/modal 360

Al abrir un material mostrar tabs:

`Resumen | Demanda | Existencias | Compras abiertas | Proveedores | Historial`

## Resumen

- SKU
- Material
- Unidad
- inventario físico
- comprometido
- disponible útil
- cobertura
- lead time
- proveedor preferente
- precio referencia
- consumo promedio
- próxima necesidad

## Demanda

Mostrar las OP que consumen ese material:

| OP | Cliente | Parte | Fecha requerida | Cantidad material | Estado |

También debe mostrar acumulado de demanda por día/semana.

## Existencias

- Almacén
- ubicación
- lote
- cantidad
- estado
- reservado
- calidad / HOLD si aplica

## Compras abiertas

- OC
- proveedor
- cantidad
- pendiente
- fecha prometida
- estado
- cubre qué OPs

## Proveedores

- proveedor preferente
- lead time
- precio referencia
- score calidad si el nuevo módulo de Calidad de Proveedores ya está implementado
- disponibilidad documental

## Historial

Timeline:

- demanda creada por OP
- material reservado
- requisición creada
- OC emitida
- recepción parcial
- ajuste / hold
- surtido a producción

---

# 7. Timeline visual de demanda y suministro

Esta debe ser una de las partes visuales más bonitas.

Por cada material crítico mostrar una línea temporal horizontal:

`Hoy → Primera necesidad → Llegada OC → Segunda necesidad → Cobertura agotada`

Ejemplo:

```text
07 Sep        11 Sep        13 Sep        15 Sep
  ●-------------●--------------●-------------●
  Hoy         OP-95250       OC-0089       OP-95258
              necesita        llega
              2,800 m         4,000 m

              ⚠ gap 2 días
```

El gap debe resaltarse con semántica de riesgo.

---

# 8. Matriz OP × Material

Agregar una vista opcional poderosa:

`[ Cobertura ] [ OP × Material ]`

Matriz:

| OP | Papel | BOPP | Tinta | Barniz | Empaque |

Estados visuales:

- ✓ Cubierto
- ◐ Parcial
- ! Faltante
- ○ No requerido

Click en celda abre el detalle de la relación OP-material.

Esto ayuda a responder:

> ¿Qué está bloqueando exactamente a esta orden?

---

# 9. Riesgo por OP

Agregar una tarjeta/tabla secundaria:

**Órdenes con riesgo de material**

Cada OP mostrar:

- folio
- cliente
- parte
- fecha compromiso
- materiales críticos
- fecha estimada de cobertura
- impacto esperado
- prioridad

Ejemplo:

`OP-2026-95250 · Panasonic`

- BOPP Blanco: riesgo
- Barniz UV: cubierto
- Tinta PMS: cubierto
- fecha requerida: 11 Sep
- cobertura completa estimada: 13 Sep

CTA:

`Abrir OP`

---

# 10. Cálculo de inventario útil

Usar una lógica coherente, visible y reutilizable.

Concepto base:

`inventario útil = max(0, físico - comprometido - HOLD)`

Luego:

`cobertura proyectada = inventario útil + entradas confirmadas - demanda futura`

No considerar una OC abierta como disponible inmediatamente: debe entrar según su fecha prometida.

Mostrar tooltip `¿Cómo se calculó?`.

---

# 11. Demanda temporal

La demanda debe derivarse de OPs dentro del horizonte seleccionado.

Usar:

- cantidad de OP
- receta / materiales estándar
- materiales explícitos de la OP
- fecha requerida
- estado de la OP

Para demo, si una OP ya tiene `materials`, usar esos datos antes de inventar cálculo adicional.

No contar como demanda futura una OP terminada/liberada cuando ya no corresponda.

---

# 12. Integración con Requisiciones

Esta integración es P0.

Desde un faltante:

`Crear requisición`

Debe abrir Requisiciones con:

- SKU precargado
- nombre
- cantidad sugerida
- almacén destino
- nota

Nota ejemplo:

`Generada desde MRP por cobertura insuficiente. Demanda acumulada 30 días: 6,200 m; inventario útil: 900 m; OC abierta: 4,000 m.`

Reutilizar el mecanismo de `targetRequisitionPrefilledItem` ya existente en DashboardShell si es posible.

No duplicar flujo.

---

# 13. Integración con Compras

Si ya existe una OC relacionada:

- mostrar OC
- proveedor
- fecha prometida
- cantidad pendiente
- recepción parcial

CTA:

`Ver orden de compra`

Debe navegar a la OC actual, no crear modal duplicado.

---

# 14. Integración con Proveedores

Al mostrar proveedor preferente o alternativo, incluir:

- lead time
- precio actual
- MOQ
- score de calidad si ya existe
- entregas recientes

CTA:

`Ver proveedor`

No inventar disponibilidad en tiempo real.

---

# 15. Integración con Calidad / HOLD

Un lote en HOLD no debe contar como inventario útil.

Mostrar en detalle:

`3,200 m retenidos por Calidad`

CTA:

`Ver no conformidad`

Si existe remanente liberado y compatible, el sistema puede sugerirlo como alternativa.

---

# 16. Integración con Producción

Desde Materiales MRP:

- abrir OP
- abrir tab Materiales del detalle
- mostrar material crítico

Dentro de la OP, si existe riesgo MRP, incluir pequeño banner:

> ⚠ Riesgo de suministro detectado para 1 material. Cobertura completa estimada 13 Sep.

CTA:

`Ver planeación de materiales`

---

# 17. Analítica MRP

No hacer 20 gráficas.

Agregar una sección inferior clara con:

- materiales con riesgo por semana
- valor de compra sugerido
- cobertura promedio
- top materiales por consumo
- compras urgentes vs planificadas
- faltantes evitados por OC abierta

Periodo debe responder al filtro global.

---

# 18. Datos demo

Preparar suficientes datos para que la experiencia tenga profundidad:

- 18–25 materiales
- Offset
- Flexografía
- Acabados / empaque
- varios proveedores
- algunos cubiertos
- algunos próximos a mínimo
- 3–4 faltantes/riesgos
- 2 sobreinventarios
- 2 OCs abiertas que llegan a tiempo
- 1 OC que llega tarde
- 1 remanente que puede evitar compra
- 1 material en HOLD

Usar materiales ya presentes en repo antes de inventar nuevos.

Cuando se invente algo para demo, marcarlo claramente como dato demostrativo.

---

# 19. UX / diseño obligatorio

Debe verse premium.

Referencias directas:

- `src/components/Inventario/DashboardTab.tsx`
- `src/components/Inventario/AnalyticsTab.tsx`
- `src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`
- CRM enterprise
- `docs/design-system.md`

Requisitos:

- cards blancas/theme-surface
- `rounded-2xl/3xl`
- spacing amplio
- tipografía compacta pero legible
- números tabulares / mono donde ayude
- semantic colors sólo para riesgo/estado
- morado reservado para SMART/system suggestion
- no llenar todo de degradados
- no tablas gigantes sin jerarquía
- responsive correcto

---

# 20. P0 / P1 / P2

## P0

- tab Materiales MRP dentro de Producción
- filtros horizonte/área/estado
- KPIs
- riesgos de suministro
- sugerencias SMART
- cobertura por material
- detalle 360 de material
- demanda por OP
- compras abiertas
- inventario útil
- integración Crear Requisición
- navegación OP / OC
- HOLD fuera de inventario útil

## P1

- timeline demanda vs suministro
- matriz OP × Material
- proveedor scorecard
- remanentes sugeridos
- analítica MRP

## P2

- escenarios `¿qué pasa si?`
- consolidación de compras
- simulación de adelantar/atrasar OC
- sugerencias de lote alternativo

---

# 21. No hacer

- no construir un MRP industrial completo
- no inventar algoritmos APS
- no fingir stock en tiempo real
- no duplicar Inventario
- no duplicar Requisiciones
- no duplicar Compras
- no duplicar Proveedores
- no crear otro sidebar si puede vivir en Producción
- no usar datos incoherentes entre detalle y dashboard
- no crear botones muertos
- no usar una tabla seca como pantalla principal

---

# 22. Historia demo recomendada

1. Entrar a Producción → Materiales MRP.
2. Mostrar que casi todo está cubierto.
3. El sistema detecta BOPP Blanco en riesgo.
4. Abrir cálculo.
5. Mostrar que inventario útil + OC sí alcanzan, pero la OC llega 2 días tarde.
6. Ver las dos OP afectadas.
7. Mostrar sugerencia morada.
8. Crear requisición complementaria precargada.
9. Volver al MRP.
10. Mostrar otro caso donde un remanente liberado evita comprar material nuevo.

La impresión para el cliente debe ser:

> “El sistema no sólo me dice cuánto tengo; me anticipa si una orden futura se va a quedar sin material y me lleva directamente a la acción.”

---

# 23. Validación técnica final

Antes de implementar:

- validar estado actual de `alvaro01`
- no sobreescribir cambios de otros agentes
- reutilizar estado compartido existente
- centralizar selectores/cálculos MRP
- no mantener dos fuentes de verdad

Después:

```bash
npm run build
npm run sync:frontend
```
