# RTM Producción — Auditoría V4 contra la operación explicada por Iván

> Branch objetivo: `alvaro01`
>
> Este documento parte de la implementación V3 ya existente. **No rehacer Producción desde cero.** La meta es corregir los últimos huecos entre el demo actual y el flujo que Iván explicó en la exploración de RTM.

## 1. Estado actual: qué quedó bien

La entrega V3 ya resolvió correctamente varios puntos importantes:

- `Nueva OP` ya abre un wizard real; dejó de ser un banner.
- existen configuradores separados para Offset y Flexografía.
- Offset ya tiene especificaciones, paginación, selección de máquina, routing, insumos y herramental.
- Flexo ya modela operaciones en línea dentro de una misma prensa.
- existen grabados y suajes en el configurador Flexo.
- la OP creada entra al estado local del módulo y aparece en Planeación/Piso.
- existe planeador semanal y modal de reprogramación.
- Piso ya permite iniciar, pausar, terminar, reportar paro 4M y solicitar material adicional.
- existe primera pieza, auditoría/liberación demo y trazabilidad.
- existe captura visual del Reporte Diario de Operador.
- el código fue separado en componentes y mejoró mucho respecto al monolito inicial.

La base visual y narrativa del demo ya es buena. **Esta V4 es una pasada de precisión funcional y fidelidad al proceso de Iván.**

---

# 2. Corrección conceptual más importante: Configuración Maestra ≠ Nueva OP

Iván explicó que hoy le molesta volver a capturar línea/máquina/ruta al generar cada orden cuando esa información ya debería venir ligada al artículo.

Su lógica objetivo es:

```text
ARTÍCULO / REVISIÓN
   ↓
CONFIGURACIÓN MAESTRA DE FABRICACIÓN
   ├─ área: Offset / Flexo
   ├─ especificaciones
   ├─ routing
   ├─ máquinas compatibles
   ├─ insumos estándar
   ├─ herramental
   ├─ acabado
   ├─ setup estándar
   └─ merma estándar
   ↓
GUARDAR RECETA / PROCESO
   ↓
PEDIDO
   ↓
NUEVA OP
   ↓
HEREDA AUTOMÁTICAMENTE LA CONFIGURACIÓN
```

## 2.1 Qué hacer en el demo

Agregar dentro de Producción una pestaña interna o workspace:

`Procesos / Configuración de fabricación`

Debe permitir tener al menos cuatro recetas demo:

### Offset
1. Black & Decker — Manual grapado tipo libro.
2. Instructivo sencillo sin grapado.

### Flexo
3. Etiqueta impresa con acabado en línea.
4. Etiqueta blanca / sin impresión.

Cada receta debe guardar:

- cliente
- número de parte
- revisión
- área
- specs
- routing
- máquinas compatibles
- insumos estándar
- herramental
- setup estándar
- scrap/merma estándar demo

## 2.2 Nueva OP después de esta mejora

El wizard de `Nueva OP` NO debe obligar a reconstruir todo desde cero cada vez.

Paso inicial recomendado:

```text
Pedido origen: PED-...
Artículo: NA472050
Revisión: 08/23

✓ Proceso configurado
Área: Offset
Ruta: 7 operaciones
Máquina sugerida: Heidelberg Speedmaster

[Usar configuración maestra]
[Editar para esta OP]
```

`Editar para esta OP` conserva el wizard técnico V3 actual para la demo, pero la historia principal debe demostrar que la información se hereda.

---

# 3. Pedido origen y gate antes de crear OP

Iván explicó que Servicio al Cliente captura el pedido y que el sistema debería advertir desde ese momento si no hay material.

Actualmente V3 permite crear la OP y solamente marca `materialAlert`.

Eso debe mejorarse.

## 3.1 Integración demo con Pedidos

Preferencia: reutilizar `salesOrders`/Pedidos ya existentes en `DashboardShell` y pasar una selección simple a Producción.

Si la integración transversal complica demasiado el demo, usar mocks coherentes, pero visualmente debe parecer un pedido real ya existente, no un formulario libre desconectado.

## 3.2 Gate de material

Si un insumo crítico tiene disponible = 0 o `Insuficiente`, mostrar:

```text
OP BLOQUEADA PARA LIBERAR A PISO

Papel requerido: 22,000 pliegos
Disponible: 2,500
Faltante: 19,500

[Generar alerta a Compras]
[Evaluar sustituto]
[Guardar como bloqueada]
```

La OP puede existir como borrador/planeada con riesgo para demo, pero NO debe aparecer como `Lista para producir`.

Estados sugeridos:

```text
Borrador
Planeada
Bloqueada por material
Por surtir
Material surtido
Lista para producir
En preparación
En proceso
Detenida
Pendiente de calidad
Liberada
Terminada
```

---

# 4. Sustitutos requieren desviación

Actualmente `ProductionMaterials` muestra `Sustituto autorizado`, pero no existe el flujo de desviación que Iván mencionó.

Cuando el usuario quiera usar otro material:

```text
EVALUAR SUSTITUTO

Material original: BOND_75_P4
Disponible: 0
Sustituto: BOND_70_P2

⚠ Requiere desviación de proceso/material

Motivo:
Responsable:
Observaciones:

[Cancelar]
[Crear desviación demo]
```

Después mostrar:

`Desviación DV-2026-018 · Pendiente / Aprobada`

No implementar el módulo real de desviaciones aquí. Solo registrar el vínculo demo y bloquear liberación hasta estado aprobado.

---

# 5. Lead time y viabilidad de fecha

Iván se quejó de pedidos con 1–2 días de entrega que físicamente no caben en producción.

Actualmente `deliveryRisk` se crea fijo como `Bajo` y el modal de reprogramación también muestra riesgo bajo de manera estática.

Corregir.

## 5.1 Cálculo demo

Usar al menos:

```text
Tiempo total estimado = Σ setupMinutes + Σ runMinutes
```

Compararlo contra:

- fecha requerida cliente
- fecha interna
- cola/carga de máquina

Mostrar:

```text
Fecha solicitada cliente: 10 Sep
Fecha interna posible:     12 Sep
Tiempo estimado ruta:      9 h 40 min

RIESGO: ALTO
⚠ La fecha solicitada no es viable con la carga actual.
```

No hace falta APS real. El cálculo debe ser coherente y no hardcoded.

---

# 6. Planeación: múltiples OP por máquina y horas reales

El planeador actual solo toma la primera OP de una máquina y coloca la tarjeta según índice de fila; esto se ve bien, pero no representa realmente la cola que Iván pidió.

Mejorar para que cada máquina pueda mostrar múltiples OP.

Encabezado por máquina:

```text
Mark Andy 10"
Capacidad semanal: 40 h
Planeadas: 31.5 h
Disponibles: 8.5 h
Utilización: 78.8%
```

Cada tarjeta debe sumar:

```text
setupMinutes + runMinutes
```

El impacto al reprogramar debe recalcular valores mock reales en vez de mostrar siempre `<85%` y `Riesgo Bajo`.

---

# 7. Programa de surtido a 24 horas

Iván dijo explícitamente que prepara el programa con 24 horas de anticipación y que Almacén debería saber lo que debe entregar para que la máquina no amanezca parada.

Agregar en Planeación un bloque:

`Surtido próximas 24 h`

Ejemplo:

```text
MAÑANA · 07:30
OP-95320 · Mark Andy 10"
Sustrato PPBC2.3AP_B16
Requerido: 1,622 ft
Estado: ✓ preparado

MAÑANA · 09:30
OP-95325 · Heidelberg
BOND_75_P4
Requerido: 13,000 pliegos
Estado: ⚠ pendiente de surtir
```

Acción demo:

`[Marcar material surtido]`

Esto cambia estado:

```text
Por surtir → Material surtido → Lista para producir
```

---

# 8. Remanentes / sobrantes de bobina

Este punto todavía no existe en V3 y fue una dolencia concreta de Iván.

En Flexo, antes de reservar una bobina nueva, mostrar:

```text
REMANTENTES COMPATIBLES

Bobina REM-075-014
Ancho: 75 mm
Restante: 2,450 ft
Lote: PPBC-260721

✓ Puede cubrir 68% de la OP

[Usar remanente primero]
```

También mostrar un caso de corte:

```text
Bobina madre: 13"
Uso para trabajo: 9"
Sobrante: 4"

[Registrar remanente 4"]
```

Todo mock/local. La intención es demostrar que el sistema conserva el sobrante y lo propone para trabajos futuros.

---

# 9. Estado “Impresa” de la hoja de OP

Iván pidió saber si ya imprimió o no la orden de producción que baja a piso.

Agregar en Órdenes:

```text
HOJA DE OP
No impresa
```

Acciones:

```text
[Imprimir hoja de OP]
[Reimprimir]
```

Después de la acción:

```text
Impresa ✓
07 Sep 08:42 · Planner RTM
```

La impresión puede ser simulada con preview/modal/toast; lo importante es guardar estado local y evento de trazabilidad.

---

# 10. Offset: completar variantes de routing

La V3 tiene dos presets útiles, pero el demo debe reconocer más de un acabado real.

Agregar presets/recetas sin sobrecargar UI:

## 10.1 Manual grapado tipo libro

```text
Preimpresión
→ Impresión
→ Guillotina
→ Doblado
→ Intercalado / Alzado
→ Grapado
→ Empaque
```

## 10.2 Grapado en esquina/frontal

```text
Preimpresión
→ Impresión
→ Guillotina
→ Intercalado
→ Grapado
→ Empaque
```

## 10.3 Instructivo sencillo

```text
Preimpresión
→ Impresión
→ Guillotina
→ Empaque
```

## 10.4 Trabajo pegado

```text
Preimpresión
→ Impresión
→ Guillotina
→ Doblado
→ Intercalado
→ Pegado
→ Trimeado
→ Empaque
```

Calidad debe mostrarse como gate/liberación asociada a las operaciones, no necesariamente como si fuera una máquina productiva más.

---

# 11. Paginación: corregir conflicto Ivan vs Master Paginación

IMPORTANTE: hay una diferencia entre fuentes que no debe ocultarse.

En la conversación Iván da explícitamente este ejemplo:

```text
24 páginas → forma de 16 + forma de 8
```

La implementación V3 actualmente usa:

```text
24 páginas → 12 + 12
```

porque se basó en una combinación del `Master Paginacion`.

Para el demo orientado a Iván:

- cuando la máquina seleccionada tenga capacidad máxima de forma de 16 páginas, usar `16 + 8` para 24 páginas.
- no presentar `12 + 12` como “lo que explicó Iván”.
- conservar otras reglas del Master cuando sean coherentes con la máquina elegida.
- agregar a `ProductionMachine` un campo como `maxFormPages?: 16 | 32` para Offset.

Ejemplo:

```text
Máquina A · máx 16 páginas/forma
24 páginas → 16 + 8

Máquina B · máx 32 páginas/forma
el optimizador puede usar la regla configurada del Master
```

Además, si la cantidad de páginas no está en tabla, NO usar como fallback simplemente `ceil(pages/2)` / `floor(pages/2)` porque puede generar formas que RTM no usa.

Fallback demo correcto:

- descomponer únicamente con formas permitidas 32 / 16 / 12 / 8 según capacidad de máquina.
- si queda residuo no representable, mostrar `Ajuste manual requerido`.

---

# 12. Flexo: compatibilidad incompleta

El configurador V3 valida:

- tintas
- troquel
- barniz
- laminado

Pero todavía no valida completamente:

- tratamiento corona
- precorte
- ancho máximo soportado
- rebobinado cuando corresponda

Agregar checks reales del propio mock `features`.

También corregir capacidades documentadas usadas en demo:

```text
Mark Andy 830 7"  → 2 tintas
Mark Andy 830 10" → 3 tintas
```

No usar 3 y 4 respectivamente.

Para Scout/4120 existe documentación entregada con capacidades diferentes según fuente; evitar afirmar más precisión de la necesaria. Mantener el demo coherente con las capacidades que se decida mostrar y documentarlas en el mock.

Cambiar `Heidelberg Speedmaster XL 75` por `Heidelberg Speedmaster` salvo que exista otra fuente de RTM que documente específicamente el modelo XL 75.

---

# 13. Piso: corregir acciones que hoy son solo visuales

## 13.1 Cronómetro

`activeTimers` existe en `PisoProduccion` pero actualmente no se usa para mostrar un cronómetro real.

Implementar timer local visible mientras la OP está en proceso, o eliminar el estado muerto si se decide simular con elapsedMinutes.

Preferencia: timer visual demo.

## 13.2 Reporte Diario del Operador

El modal existe, pero `onSaveReport` actualmente solo cierra el modal.

Debe guardar el registro en estado local:

- dentro de la OP (`operatorReports`) o en estado compartido de Producción.
- agregar evento a trazabilidad.
- reflejar cantidad producida/comentario cuando aplique.

## 13.3 Material adicional

Actualmente solicitar material adicional incrementa siempre el scrap en +150.

Corregir:

- si motivo = merma/rechazo, sí incrementar scrap según cantidad demo coherente.
- si motivo = faltante de surtido / material no entregado / ajuste de cantidad, NO incrementar scrap automáticamente.
- siempre crear evento/incidencia correspondiente.

## 13.4 Primera pieza

El botón hoy permite “Liberar 1ra Pieza” directamente desde Piso.

Para que el rol quede claro:

```text
[Solicitar liberación de primera pieza]
```

Después mostrar una acción demo con badge `Calidad` o un modal que simula la aprobación por Alicia/QA.

No debe parecer que el operador se auto-libera.

---

# 14. Código de barras / surtido rápido — mejora wow opcional

Iván mencionó como idea ligar el número de parte/OP a un código de barras para que Almacén escanee y dé de baja material.

Como demo opcional y sin tocar Inventario real:

Agregar en detalle de OP:

```text
[Surtir con código de barras]
```

Mostrar modal visual de escaneo y luego:

```text
Material surtido ✓
Lote: PPBC-260721
Cantidad entregada: 1,622 ft
```

Puede reutilizar visualmente patrones QR/scan existentes del ERP si ya existen. No crear backend.

---

# 15. Qué NO tocar

- no crear branch nueva
- trabajar únicamente en `alvaro01`
- no rehacer design system
- no crear backend/API/migraciones
- no duplicar Inventario, Calidad ni Mantenimiento
- no eliminar lo que ya funciona de V3
- no convertir esta mejora en un refactor general del ERP

---

# 16. Prioridad de implementación

## P0 — antes del demo

1. Configuración Maestra/receta de artículo + herencia en Nueva OP.
2. Gate de material y estados `Por surtir / Material surtido / Lista para producir`.
3. Paginación dependiente de máquina y corregir 24 páginas = 16 + 8 para máquina máx. 16.
4. Flexo: compatibilidad corona/precut/ancho + corregir 830 7" y 10".
5. Planeador con múltiples OP por máquina y horas disponibles/planeadas reales.
6. Lead time/riesgo calculado, no hardcoded.
7. Persistir Reporte Diario de Operador.
8. Material adicional sin scrap fijo.

## P1 — muy recomendable

9. Programa de surtido próximas 24 h.
10. Remanentes/sobrantes de bobina.
11. Estado OP impresa sí/no.
12. Routing Offset con Intercalado/Pegado/Trimeado.
13. Sustituto → desviación demo.

## P2 — wow opcional

14. Escaneo código de barras para surtido demo.

---

# 17. Historia final de demo esperada

## OFFSET

```text
Procesos / Configuración
→ abrir Black & Decker NA472050 Rev 08/23
→ mostrar receta Offset heredada
→ mostrar grapado/routing
→ mostrar paginación según máquina
→ Pedido genera OP heredando configuración
→ validar material/herramental
→ Planeación calcula capacidad y fecha
→ surtido 24 h
→ OP lista para producir
→ Piso: preparación / primera pieza / producción
→ reportar scrap o paro
→ terminar etapa y avanzar routing
→ liberación QA
→ trazabilidad
```

## FLEXO

```text
Procesos / Configuración
→ abrir etiqueta Flexo
→ sustrato + tintas + grabado + suaje
→ seleccionar operaciones inline
→ matriz de máquinas compatibles
→ mostrar remanente de bobina sugerido
→ Pedido genera OP heredando configuración
→ Planeación
→ surtido
→ Mark Andy ejecuta operaciones inline
→ rebobinado/Rotoflex
→ calidad
→ empaque
→ trazabilidad
```

El objetivo es que Iván reconozca su forma de trabajar, pero vea que el ERP elimina las capturas repetidas, Excel, memoria del planner y las llamadas a Almacén.