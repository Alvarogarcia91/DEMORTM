# RTM Demo — Producción v12 · Scrap por unidad, etapa y acumulado de OP

> Branch objetivo: `alvaro01`
>
> Este refinamiento corresponde al **punto 2/5 del cierre de Producción**. No pide rehacer el módulo ni crear un sistema contable de merma. Pide hacer visible, consistente y demostrable el control de scrap que Mariana e Iván describieron.

## 0. Objetivo

Hoy Producción ya tiene captura de scrap, 4M, umbral de 5%, analítica y un workspace de Scrap y pérdidas. El problema es que el concepto principal de `scrap` todavía vive demasiado como un número genérico.

Para RTM esto debe sentirse como un **ledger operativo de merma** que explique:

```text
qué se perdió
cuánto se perdió
en qué unidad
qué operación lo generó
quién lo registró
qué causa 4M tuvo
cuánto aporta al acumulado de la OP
si la OP sigue dentro del límite
```

La narrativa de demo debe ser:

> Una OP puede pasar por varias etapas. Cada etapa genera su propia merma y el sistema conserva el detalle hasta mostrar el scrap acumulado total de la OP.

Mariana explicó que la merma debe poder cuadrarse entre etapas y que en ciertos materiales/casos se maneja incluso por peso. Para el demo no necesitamos conversiones industriales perfectas entre todas las UOM; sí necesitamos demostrar que el ERP entiende que **no todo scrap se mide en “piezas”**.

---

# 1. No romper lo que ya existe

Conservar y reutilizar:

- `PisoOperadorWorkspace.tsx`
- `ScrapPérdidasWorkspace.tsx`
- `OrdenProduccionDetail.tsx`
- `AnaliticaProduccion.tsx`
- `RoutingStep.scrapQuantity`
- eventos actuales de scrap
- causas 4M
- umbral demo de 5%
- sugerencias moradas
- trazabilidad actual

No crear una segunda lógica paralela de scrap.

---

# 2. Modelo demo de Scrap Event

Enriquecer el evento actual de scrap para soportar al menos:

```ts
unit: 'piezas' | 'pliegos' | 'kg' | 'm' | 'ft'
quantity: number
process: string
routingStepNumber?: number
machine: string
operator: string
category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método'
reason: string
comment?: string
recordedAt: string
scrapType:
  | 'Arranque / setup'
  | 'Proceso'
  | 'Cambio de ajuste'
  | 'Cambio de material'
  | 'Rechazo QA'
  | 'Otro'
```

Puede mantenerse el campo numérico global actual para compatibilidad visual, pero los nuevos componentes deben usar eventos detallados como fuente principal cuando estén disponibles.

---

# 3. UOM de scrap según contexto

No mostrar un dropdown absurdo con todas las unidades para cualquier proceso.

## Offset

Default según operación:

```text
Impresión       → pliegos
Guillotina      → pliegos / kg
Doblado         → piezas / pliegos
Intercalado     → piezas
Grapado         → piezas
Empaque         → piezas
```

## Flexografía

```text
Prensa Flexo    → m / ft / kg / etiquetas
Rebobinado      → m / ft / etiquetas / rollos
Empaque         → piezas / rollos
```

En demo, el componente puede proponer automáticamente la UOM más lógica y permitir cambiarla entre las compatibles del proceso.

Ejemplo:

```text
OP Flexo
Material principal: BOPP
Proceso: Impresión Flexográfica

Cantidad scrap   [ 185 ]
Unidad           [ m ▼ ]
```

Ejemplo Offset:

```text
Proceso: Impresión Offset
Cantidad scrap   [ 240 ]
Unidad           [ pliegos ▼ ]
```

---

# 4. Captura de Scrap desde Piso Operador

El modal `Registrar Scrap / Merma` debe sentirse industrial y muy claro.

Diseño objetivo:

```text
REGISTRAR SCRAP / MERMA

OP-95321 · FRESENIUS
Mark Andy Scout 10"
Impresión Flexográfica

Cantidad                  [ 185 ]
Unidad                    [ m ▼ ]
Tipo                      [ Merma de proceso ▼ ]
Causa 4M                  [ Máquina ▼ ]
Motivo                    [ Descalce de registro ▼ ]
Comentario                [ _______________________ ]

ANTES DEL EVENTO
Scrap acumulado OP         3.52%

DESPUÉS DEL EVENTO
Scrap acumulado OP         4.18%   ⚠
Límite configurado         5.00%
Margen restante            0.82 pts

                    [Registrar merma]
```

Si supera 5%:

```text
SCRAP FUERA DE ESTÁNDAR
5.34%

Esta OP superó el límite demo configurado de 5.0%.

[Registrar y notificar supervisor]
```

No bloquear forzosamente la demo; registrar el evento y hacerlo visible como excepción.

---

# 5. Diferenciar scrap de material adicional

Material adicional NO debe significar automáticamente scrap.

Mantener la lógica actual:

```text
Faltante de almacén
→ material adicional
→ incidencia de surtido
→ 0 scrap automático

Merma / desperdicio
→ material adicional
→ evento relacionado a scrap
→ impacto en OP
```

En UI dejarlo clarísimo.

---

# 6. Ledger de Scrap por etapa dentro de la OP

En `OrdenProduccionDetail` agregar/elevar una sección visible:

```text
SCRAP ACUMULADO POR OPERACIÓN

Etapa                 Cantidad          UOM        % contribución
Impresión Offset        240             pliegos       1.80%
Guillotina               42             pliegos       0.31%
Doblado                  95             piezas        0.71%
Intercalado              28             piezas        0.21%
Grapado                  54             piezas        0.40%
---------------------------------------------------------------
SCRAP ACUMULADO OP                                   3.43%
LÍMITE CONFIGURADO                                   5.00%
MARGEN RESTANTE                                      1.57 pts
```

IMPORTANTE:

No sumar físicamente `240 pliegos + 95 piezas` como si fueran la misma unidad.

El ledger debe mostrar cantidades por UOM, mientras que el porcentaje acumulado de OP se presenta como **indicador normalizado demo**.

Para el demo, si hace falta un denominador coherente por etapa, usar un `scrapPercentContribution` mock/configurable por evento o calcular contra la cantidad procesada de esa etapa cuando exista.

Nunca presentar una suma de unidades heterogéneas como cantidad total física.

---

# 7. Vista específica Offset

Usar un caso Black & Decker para demostrar que la merma ocurre a través de todo el routing.

Ejemplo narrativo:

```text
BLACK & DECKER · OP-95344

Impresión      1.8%
   ↓
Guillotina    +0.3%
   ↓
Doblado       +0.7%
   ↓
Intercalado   +0.2%
   ↓
Grapado       +0.4%
--------------------
Acumulado      3.4%
Límite         5.0%
```

Visualmente usar una barra acumulativa por etapa o steps compactos.

Debe quedar fácil explicar:

> “No solamente sé cuánto se perdió al final. Sé en qué estación se fue consumiendo el margen de merma.”

---

# 8. Vista específica Flexo

En Flexo distinguir como mínimo:

```text
Scrap arranque/setup
Scrap de corrida
Scrap por ajuste
Scrap de rebobinado
```

Ejemplo:

```text
FRESENIUS · OP-95321

ARRANQUE
85 m
0.72%

CORRIDA
190 m
1.61%

AJUSTE DE REGISTRO
120 m
1.02%

REBOBINADO
46 m
0.39%

TOTAL NORMALIZADO
3.74%
```

Mostrar también, cuando sea útil:

```text
Material principal: BOPP Blanco
Lote: PPBC-260721
```

---

# 9. Scrap en el routing

Cada `RoutingStep` debe mostrar una pequeña lectura de la merma registrada en esa etapa.

Ejemplo:

```text
2 · Impresión Offset
Heidelberg Speedmaster

Buenas         12,240
Scrap          240 pliegos
Aporte merma   1.80%
Estado         Completada
```

Si la etapa no tiene eventos:

```text
Scrap registrado: —
```

No inventar merma automáticamente para todas las etapas.

---

# 10. Workspace `Scrap y pérdidas`

Conservar lo bueno actual y elevar la lectura de UOM.

Agregar un switch o breakdown:

```text
[ % Normalizado ] [ Cantidades físicas ]
```

En `% Normalizado`:

```text
Flexografía  4.2%
Offset       3.1%
Acabados     1.8%
```

En `Cantidades físicas`:

```text
Pliegos       1,842
Piezas        3,104
Metros          885
Kg             126.4
Rollos            8
```

No convertir entre ellas si no existe un factor real.

Mostrar texto:

`Unidades físicas no sumables entre sí; cada UOM se presenta por separado.`

---

# 11. Pareto de Scrap

Mantener 4M, pero permitir responder dos preguntas distintas:

```text
¿Por qué perdemos?
→ 4M

¿Dónde perdemos?
→ Proceso / máquina
```

Ejemplo:

```text
CAUSA 4M
Máquina        34%
Método         27%
Material       25%
Mano de obra   14%
```

```text
PROCESO
Flexo impresión    31%
Offset impresión   24%
Doblado            16%
Rebobinado         12%
Grapado             9%
Otros               8%
```

---

# 12. Sugerencias moradas del sistema

Agregar sugerencias contextualizadas, no decorativas.

Ejemplo 1:

```text
✦ SUGERENCIA DEL SISTEMA

OP-95321 aumentó de 2.9% a 4.4% después del último ajuste de registro.
La mayor contribución ocurrió en Impresión Flexográfica.

[Ver historial de scrap]
```

Ejemplo 2:

```text
✦ SUGERENCIA DEL SISTEMA

El 61% de la merma de esta OP se concentra en el arranque/setup.
Revisar preparación de grabados y suaje antes de la siguiente corrida.

[Ver receta]
```

Ejemplo 3 Offset:

```text
✦ SUGERENCIA DEL SISTEMA

Doblado consumió 0.7 puntos del margen de merma.
Es 2.1× el promedio demo de esta receta.

[Ver operación]
```

Usar el patrón `Sparkles` morado ya existente en Inventario/Producción.

---

# 13. Analítica

No rehacer Analítica V10.

Solo asegurarse de que pueda consumir/enlazar las nuevas UOM/eventos para mostrar:

- scrap % tendencia;
- scrap por proceso;
- top OP;
- causas 4M;
- scrap por operador;
- cantidades físicas separadas por UOM.

Si la analítica usa snapshots demo, mantener coherencia visual con los nuevos eventos.

---

# 14. Demo Story obligatoria

## Offset

```text
Abrir OP Black & Decker
→ Routing
→ mostrar scrap acumulado por etapa
→ entrar a Piso Operador
→ registrar 80 pliegos de merma en impresión
→ regresar a OP
→ ver incremento del porcentaje acumulado
→ mostrar límite 5%
→ abrir Scrap y pérdidas
→ ver que la OP aparece en ranking
```

## Flexo

```text
Abrir OP Fresenius
→ Piso Operador
→ Registrar Scrap
→ 185 m
→ Ajuste de registro
→ Máquina
→ guardar
→ mostrar nuevo % acumulado
→ mostrar sugerencia morada
→ terminar operación
→ registrar remanente de bobina separado del scrap
```

La demo debe demostrar claramente que:

```text
REMANENTE ≠ SCRAP
MATERIAL EXTRA ≠ SCRAP NECESARIAMENTE
SCRAP FÍSICO TIENE UOM
SCRAP DE OP SE ACUMULA POR ETAPA
```

---

# 15. Reglas visuales

Mantener el diseño actual Nexora/RTM.

- tarjetas compactas;
- tipografía actual;
- `font-mono` para cantidades;
- verde dentro de estándar;
- ámbar cerca de límite;
- rojo >5%;
- morado únicamente para sugerencias del sistema;
- no gradients innecesarios;
- no dashboards gigantes dentro del modal de captura;
- tooltips/textos cortos;
- no usar “IA”.

El modal de captura tiene que ser cómodo para tablet/piso.

---

# 16. P0 obligatorio

1. Agregar UOM al evento de scrap.
2. UOM sugerida según operación/área.
3. Mejorar modal de captura en Piso Operador.
4. Mostrar % antes/después y límite 5%.
5. Ledger de scrap por etapa en detalle de OP.
6. Separar cantidades físicas por UOM en `Scrap y pérdidas`.
7. No sumar unidades heterogéneas.
8. Diferenciar claramente remanente, material adicional y scrap.
9. Mantener causa 4M y trazabilidad.
10. Sugerencias moradas basadas en eventos de scrap.

---

# 17. P1 si no compromete estabilidad

- mini gráfico acumulativo del consumo del margen 5% por etapa;
- filtro por UOM en Scrap y pérdidas;
- click en evento → abrir OP;
- drilldown `evento → operación → máquina → operador`;
- comparación receta estándar vs scrap real por etapa.

---

# 18. Fuera de alcance

No implementar:

- conversiones físicas exactas kg ↔ m ↔ ft ↔ piezas sin datos reales;
- contabilidad real del costo de merma;
- básculas o integración PLC;
- sensores/contador de máquina;
- backend;
- API;
- migraciones;
- permisos/login.

Si se muestran costos, mantenerlos como `Demo configurable`.

---

# 19. Criterio de éxito

Al terminar, durante la demo debe ser posible decir:

> “En esta OP sabemos que Impresión desperdició 240 pliegos, Doblado 95 piezas y Flexo puede registrar metros o kilos. No mezclamos las unidades físicas, pero sí podemos ver qué porcentaje del margen de merma total consumió cada etapa y cuándo nos acercamos al límite del 5%.”

Y demostrarlo haciendo clic, no solamente enseñando un mock estático.
