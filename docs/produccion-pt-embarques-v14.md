# Producción V14 — Cierre de Producto Terminado → Embarques

## EN EL QUE VAMOS: 5/5 — Cierre PT → Disponible para Embarques

## Objetivo

Cerrar la narrativa de manufactura RTM de forma creíble y visualmente fuerte:

**Producción termina → Calidad final libera → nace lote de Producto Terminado → se identifica/ubica → queda disponible para Embarques → aparece como orden de salida lista para preparar.**

Esto es un **demo frontend**, no un WMS/MES real. La meta no es construir backend ni inventarios perpetuos; la meta es que el cliente vea el flujo ERP completo y consistente entre módulos.

La experiencia debe sentirse al mismo nivel visual que Dashboard de Producción, Analítica, Inventario y Piso QA. No hacer una tarjeta genérica ni un toast perdido.

---

# 1. Estado actual del repo que debes respetar

Trabajar SOLO sobre `alvaro01`.

Archivos relevantes actuales:

- `src/components/DashboardShell.tsx`
  - ya contiene `productionOrders` como estado compartido Producción ↔ Calidad.
- `src/components/Produccion/ProduccionPage.tsx`
- `src/components/Produccion/OrdenProduccionDetail.tsx`
- `src/components/Produccion/PisoOperadorWorkspace.tsx`
- `src/components/Calidad/CalidadPage.tsx`
- `src/components/Calidad/LiberacionesWorkspace.tsx`
- `src/components/Calidad/PisoQaWorkspace.tsx`
- `src/components/Embarques/EmbarquesPage.tsx`
- `src/components/Embarques/ShippingOrdersTab.tsx`
- `src/data/mockShippingData.ts`
- `src/data/mockProduccionData.ts`

Estado actual importante:

- Calidad final ya puede cambiar una OP a `Liberada`.
- `CalidadPage` ya registra trazabilidad en Producción.
- Embarques hoy usa su propio listado mock de `ShippingOutboundOrder` y `ShippingOrdersTab` mantiene una copia local.
- El header de Embarques ya dice correctamente que trabaja con **producto terminado liberado por QA**.

NO reestructurar todo el módulo de Embarques.
NO meter backend.
NO crear ramas.
NO romper los mocks actuales.

---

# 2. Narrativa funcional final

La demo debe poder contar esto sin explicación adicional:

```text
OP EN PRODUCCIÓN
   ↓
Operación / Empaque terminado
   ↓
Pendiente Auditoría Final QA
   ↓
Alicia / Calidad inspecciona
   ↓
CONFORME
   ↓
Lote de Producto Terminado generado
   ↓
Identificación / etiqueta PT
   ↓
Ingreso lógico a Almacén Producto Terminado
   ↓
DISPONIBLE PARA EMBARQUES
   ↓
Orden de salida B2B lista para preparar
   ↓
Transporte / carga / remisión / ruta
```

Si Calidad rechaza:

```text
Auditoría Final
   ↓
NO CONFORME
   ↓
HOLD / MNC
   ↓
NO genera PT disponible
   ↓
NO aparece en Embarques
```

---

# 3. Nuevo concepto frontend: `FinishedGoodsRelease`

Agregar un tipo simple para representar el puente Producción → PT → Embarques.

Puede vivir en `mockProduccionData.ts`, `mockShippingData.ts` o un archivo pequeño dedicado si queda más limpio.

Ejemplo conceptual:

```ts
interface FinishedGoodsRelease {
  id: string;
  opId: string;
  opFolio: string;
  pedido: string;
  client: string;
  partNumber: string;
  revision: string;
  area: 'Offset' | 'Flexografía' | 'Acabados';
  finishedQty: number;
  lotNumber: string;
  packageCount?: number;
  unitsPerPackage?: number;
  warehouseId: 'alm-rtm-pt';
  warehouseName: 'Almacén Producto Terminado';
  location: string;
  qualityReleaseId?: string;
  releasedBy: string;
  releasedAt: string;
  status:
    | 'Pendiente de QA'
    | 'Liberado para PT'
    | 'Disponible para embarque'
    | 'Asignado a salida';
}
```

No sobre-modelar.

El punto es tener **una pieza de estado compartida** que permita demostrar que la liberación final no se queda como simple texto.

---

# 4. Estado compartido mínimo en `DashboardShell`

Actualmente `DashboardShell` ya guarda `productionOrders`.

Agregar estado demo compartido para PT, por ejemplo:

```ts
const [finishedGoods, setFinishedGoods] = useState<FinishedGoodsRelease[]>(INITIAL_FINISHED_GOODS);
```

Pasarlo únicamente a los módulos que lo necesiten:

- Calidad
- Producción si se quiere mostrar estado PT en el detalle de OP
- Embarques

No construir Context nuevo si no hace falta.

La demo debe conservar datos iniciales mock para que Embarques siga viéndose lleno aunque el usuario no recorra el flujo completo.

---

# 5. Qué pasa cuando Calidad aprueba Auditoría Final

En `CalidadPage`, donde hoy una auditoría final aprobada hace:

- OP → `Liberada`
- progress → 100
- `finalAuditApproved: true`
- evento de trazabilidad

AMPLIAR esa acción para crear un registro de PT.

## Regla demo

Al aprobar auditoría final:

1. tomar cantidad buena real de la OP;
2. NO reemplazarla automáticamente por `order.quantity` si ya existe `good` menor por scrap;
3. generar lote PT legible;
4. registrar quién liberó;
5. registrar fecha/hora;
6. asignar almacén PT;
7. dejar estado `Disponible para embarque`;
8. agregar trazabilidad a OP.

Ejemplo lote:

```text
PT-260907-042
```

No usar números completamente aleatorios cada render. Debe ser estable dentro de la sesión.

## Evento de trazabilidad sugerido

```text
Producto Terminado liberado
Lote: PT-260907-042
Cantidad buena: 49,100 etiquetas
Ubicación: PT-A-03
Liberó: Alicia Ramírez
Estado: Disponible para embarque
```

---

# 6. Momento visual “WOW” después de liberar QA

Al aprobar Auditoría Final, NO dejar únicamente toast.

Mostrar un modal/banner de éxito premium, tipo confirmación operativa.

## Diseño conceptual

```text
┌───────────────────────────────────────────────────────────────┐
│ ✓ PRODUCTO TERMINADO LIBERADO                               │
│                                                               │
│ OP-2026-95321 · FRESENIUS                                   │
│ Etiqueta BOPP 4x6 · Rev C                                   │
│                                                               │
│ LOTE PT                    CANTIDAD BUENA                     │
│ PT-260907-042              49,100 etiquetas                  │
│                                                               │
│ ALMACÉN                    UBICACIÓN                           │
│ Producto Terminado         PT-A-03                            │
│                                                               │
│ LIBERADO POR               HORA                               │
│ Alicia Ramírez             14:38                              │
│                                                               │
│ ✓ Disponible para Embarques                                  │
│                                                               │
│ [Ver lote PT]     [Ir a Embarques]                           │
└───────────────────────────────────────────────────────────────┘
```

Visual:

- verde solo para liberación;
- azul/theme-primary para navegación;
- tipografía compacta industrial;
- sin gradients innecesarios;
- no usar modal gigante vacío.

---

# 7. Ficha rápida de Producto Terminado

Agregar una vista pequeña reusable, drawer o modal:

```text
LOTE PT-260907-042

Estado                Disponible para embarque
OP origen              OP-2026-95321
Pedido                 PED-RTM-86153
Cliente                Fresenius
Parte                   ETQ-485-C
Revisión                C
Cantidad buena          49,100
Scrap acumulado         3.7%
Liberación QA           QA-260907-084
Almacén                 Producto Terminado
Ubicación               PT-A-03

Trazabilidad
✓ Producción terminada
✓ Auditoría final QA
✓ Lote PT generado
✓ Identificación PT
✓ Disponible para salida
```

Esta ficha debe poder abrirse:

- desde Calidad tras liberar;
- desde Producción detalle OP si la OP está liberada;
- opcionalmente desde Embarques.

No inventar un módulo nuevo “Producto Terminado” en sidebar. Para demo no hace falta.

---

# 8. Identificación / etiqueta de PT

Calidad ya tiene soporte visual de etiquetas Zebra.

Reusar el patrón actual.

Después de liberar PT debe poder verse una etiqueta demo con:

```text
IMPRESOS RTM
PRODUCTO TERMINADO

PT-260907-042
OP-2026-95321
PED-RTM-86153
FRESENIUS
ETQ-485-C · Rev C
49,100 pzas

LIBERADO QA
07 SEP 2026 · 14:38
```

Agregar QR visual solo si el patrón actual ya lo soporta/reutiliza. No construir un sistema de impresión real.

Botón:

`Imprimir etiqueta PT · Demo`

Debe mostrar toast/banner, no descargar archivo real si no existe.

---

# 9. Puente a Embarques

Esta es la parte más importante.

## Embarques actual

`EmbarquesPage` usa `ShippingOrdersTab`.

`ShippingOrdersTab` hoy inicia su estado desde `getShippingOrdersList()`.

Para esta V14, permitir que reciba órdenes dinámicas derivadas de PT liberado SIN romper los mocks existentes.

Ejemplo:

```ts
interface ShippingOrdersTabProps {
  onNavigateToInRoute?: () => void;
  releasedFinishedGoods?: FinishedGoodsRelease[];
}
```

Combinar:

```text
mock shipping orders existentes
+
órdenes de salida generadas desde PT liberado
```

Deduplicar por `opFolio` o `lotNumber`.

---

# 10. Conversión PT → ShippingOutboundOrder

Crear un helper claro, por ejemplo:

```ts
finishedGoodToShippingOrder(pt, index)
```

Debe producir algo compatible con la interfaz actual de Embarques.

## Datos sugeridos

```text
Folio salida           OS-PT-260907-042
Tipo                   Despacho B2B
Documento origen       PED-RTM-86153
Origen                 Almacén Producto Terminado
Cliente/destino        Fresenius
Producto               ETQ-485-C
Cantidad               49,100
Lote                    PT-260907-042
Estado                  Lista para carga
Remisión                Pendiente de generar / demo
Transporte              Sin asignar
Chofer                   Sin asignar
```

OJO:

`ShippingOutboundOrder.items[].quantity` actualmente parece operar como unidades logísticas/tarimas/cajas en varios mocks.

Para no romper el lenguaje de Embarques:

- si el PT es 49,100 piezas y empaque estándar es 1,000 por caja/rollo, mostrar algo como `50 unidades logísticas / 49,100 piezas`;
- si no hay `packageCount`, generar demo configurable razonable y etiquetarlo como **Demo**.

NO mandar 49,100 como “49,100 tarimas”.

---

# 11. Card protagonista en Embarques: “Recién liberado por Calidad”

En `Órdenes de salida`, antes de la tabla, mostrar una franja especial si hay PT reciente.

```text
┌───────────────────────────────────────────────────────────────────┐
│ ✓ RECIÉN LIBERADO POR CALIDAD                                  │
│                                                                   │
│ PT-260907-042 · OP-2026-95321 · Fresenius                      │
│ 49,100 etiquetas · Almacén Producto Terminado                   │
│                                                                   │
│ QA liberó 14:38    Ubicación PT-A-03    Pedido PED-RTM-86153    │
│                                                                   │
│ Estado: LISTO PARA PREPARAR SALIDA                               │
│                                               [Preparar salida]   │
└───────────────────────────────────────────────────────────────────┘
```

Esto es DEMO WOW.

Debe hacer evidente que **Producción/Calidad sí alimentaron Embarques**.

No usar morado aquí salvo que exista una sugerencia.

---

# 12. Sugerencias del sistema en el cierre PT

Usar patrón morado solo donde agregue inteligencia.

Ejemplos:

## En Calidad tras liberar

```text
✦ Sugerencia del sistema
El pedido PED-RTM-86153 tiene fecha de embarque hoy 17:00.
Producto Terminado ya está liberado.
Se recomienda priorizar preparación de salida.

[Ir a Embarques]
```

## En Embarques

```text
✦ Sugerencia del sistema
PT-260907-042 fue liberado hace 12 min y tiene ventana de entrega hoy.
Hay Unidad #04 disponible en Almacén PT.

[Preparar salida]
```

No llamarlo IA.
No meter sugerencias en cada card.

---

# 13. Estado de Producción después de QA

En detalle de la OP liberada, agregar bloque final:

```text
CIERRE DE MANUFACTURA

✓ Producción terminada
✓ Auditoría Final conforme
✓ Lote PT generado
✓ Disponible para Embarques

Lote       PT-260907-042
Cantidad   49,100
Ubicación  PT-A-03

[Ver lote PT]   [Ir a Embarques]
```

Una OP liberada NO debe sentirse simplemente “Terminada”.
Debe mostrar claramente dónde terminó el producto.

---

# 14. Calidad rechazo / HOLD

Si auditoría final es rechazada:

- NO crear `FinishedGoodsRelease` disponible;
- NO crear ShippingOutboundOrder;
- mantener MNC/HOLD actual;
- mostrar claramente:

```text
NO DISPONIBLE PARA EMBARQUE
Producto bloqueado por Calidad
MNC-XXXXXX
```

Esto debe ser visible en la OP.

---

# 15. Datos demo sugeridos

Agregar 2–3 `FinishedGoodsRelease` iniciales para llenar la experiencia:

### PT-260907-042
- OP-2026-95321
- Fresenius
- Flexografía
- 49,100 etiquetas
- PT-A-03
- Disponible para embarque
- liberado hoy 14:38

### PT-260907-038
- OP-2026-95318
- Black & Decker
- Offset
- 24,500 manuales
- PT-B-02
- Disponible para embarque

### PT-260906-031
- TYCO
- ya asignado a salida

Mantener coherencia con los clientes/OP que ya existen en los mocks actuales. Si folios exactos no coinciden, usar los actuales del repo; NO crear referencias huérfanas si se puede reutilizar una OP existente.

---

# 16. Wording obligatorio

Usar:

- Producto Terminado
- Liberado por Calidad
- Disponible para Embarques
- Almacén Producto Terminado
- Lote PT
- Orden de Salida
- Preparar salida
- Auditoría Final
- HOLD / No Conforme

Evitar:

- “despacho” como CTA principal si el resto del sistema usa “Órdenes de salida”;
- “finalizado exitosamente” genérico;
- “sincronización ERP” como texto técnico visible;
- “AI / IA”.

---

# 17. Jerarquía visual

Debe verse como una suite industrial premium.

### Verde
Solo para:
- QA conforme
- lote PT liberado
- disponible
- listo para carga

### Ámbar
- esperando QA
- ventana de entrega próxima
- preparación pendiente

### Rojo
- HOLD
- no conforme
- no disponible

### Morado
Solo `Sugerencia del sistema`.

### Azul/theme-primary
Navegación y CTAs principales.

No gradients decorativos salvo que ya exista el patrón del design system y realmente mejore la vista.

No gauges gigantes.
No cards vacías.
No iconos de colores arbitrarios.

---

# 18. Interacciones obligatorias

1. Aprobar Auditoría Final.
2. Ver confirmación PT liberado.
3. Abrir ficha lote PT.
4. Navegar a Embarques.
5. Ver el lote/OP como salida disponible.
6. Preparar/abrir esa orden de salida usando los componentes existentes.
7. Rechazar auditoría final → no debe aparecer disponible en Embarques.
8. Botón etiqueta PT demo.

Todos los botones deben hacer algo visible.

---

# 19. Prioridades

## P0

- Estado compartido `FinishedGoodsRelease`.
- QA Final → genera PT.
- cantidad buena correcta.
- lote PT visible.
- ubicación PT.
- estado “Disponible para Embarques”.
- Embarques recibe PT liberado.
- shipping order dinámica compatible con flujo actual.
- card “Recién liberado por Calidad”.
- rejection/HOLD no genera salida.
- navegación Calidad/Producción → Embarques.

## P1

- ficha modal/drawer de lote PT.
- etiqueta PT preview.
- sugerencia del sistema por ventana de entrega.
- bloque de cierre en detalle OP.

## P2

- empaques/logistic units más detallados.
- remisión demo preconstruida desde PT.
- indicador de minutos desde liberación.

---

# 20. No hacer

- No backend.
- No API.
- No migraciones.
- No crear módulo nuevo de almacén PT.
- No duplicar toda la lógica de Embarques.
- No reescribir `ShippingLoadWizardModal`.
- No borrar mocks actuales.
- No inventar una integración contable.
- No crear stock perpetuo real.
- No convertir cada pieza en UID individual.
- No crear ramas.

---

# 21. Criterios de aceptación de demo

La implementación queda lista cuando en 60–90 segundos se pueda enseñar esto:

```text
1. Abrir una OP terminada.
2. Mostrar que espera QA Final.
3. Ir a Calidad.
4. Aprobar Auditoría Final.
5. Ver modal “Producto Terminado Liberado”.
6. Mostrar lote PT, cantidad buena, ubicación y auditor.
7. Ir a Embarques.
8. Encontrar la misma OP/lote marcada “Recién liberado por Calidad”.
9. Abrir Preparar salida.
10. Mostrar que ya entra al flujo normal de carga/transporte/remisión.
```

Y si se hace el camino negativo:

```text
Auditoría final rechazada
→ HOLD
→ MNC
→ NO Producto Terminado disponible
→ NO orden de salida
```

---

# 22. Script corto para la demo

> “La orden ya terminó producción, pero todavía no existe como producto disponible para embarque. Calidad realiza la auditoría final y, al liberarla, el sistema genera el lote de Producto Terminado con su cantidad buena real, ubicación y trazabilidad. En ese momento se vuelve disponible para Órdenes de Salida. Embarques ya no tiene que preguntar por teléfono si Producción terminó o si Calidad liberó: el lote aparece directamente listo para preparar la salida.”

---

# 23. Instrucción final al agente

Implementar esta V14 SOBRE el repo actual.

Primero auditar cómo `DashboardShell`, `CalidadPage`, `EmbarquesPage`, `ShippingOrdersTab` y `mockShippingData` comparten o aíslan estado.

Hacer el **mínimo cambio estructural necesario** para que el flujo se sienta conectado en el demo.

La prioridad es experiencia y coherencia de negocio, no arquitectura enterprise.

Al terminar:

- ejecutar build/typecheck;
- corregir errores;
- reportar qué P0/P1 quedó implementado;
- no crear rama nueva;
- no dejar botones muertos.
