# RTM Demo — Producción v5 · Cierre Carta de Santa de Iván

> Branch objetivo: `alvaro01`
>
> Este documento es el refinamiento final del módulo Producción contra la lista de deseos / “Carta de Santa” explicada por Iván en la reunión de exploración. No rehacer el módulo. No crear ramas nuevas.

## Objetivo

Cerrar los últimos huecos del demo para poder enseñar, con fidelidad operativa, cómo RTM:

```text
Configura un artículo / receta
→ recibe un pedido
→ valida material + herramental + fecha
→ genera OP heredando configuración
→ optimiza paginación / máquina
→ planea capacidad
→ surte a 24 h
→ imprime hoja de OP
→ produce en piso
→ registra paros / material adicional
→ pasa por Calidad
→ termina y deja trazabilidad
```

La implementación actual V4 ya cubre gran parte de la Carta de Santa y debe conservarse.

---

# 1. Lo que YA está bien y NO se debe rehacer

Conservar:

- Recetas maestras de fabricación.
- Herencia automática de línea, máquina, routing, materiales y herramental.
- Offset y Flexografía diferenciados.
- Routing editable.
- Compatibilidad de prensas Flexo.
- Suaje / grabado / herramental.
- Remanentes de bobina.
- Desviaciones de material.
- Gate de material bloqueado.
- Planeación con múltiples OP por máquina.
- Horas planeadas / disponibles / utilización.
- Programa de surtido a 24 horas.
- Piso de Producción.
- Cronómetro visual.
- Reporte Diario del Operador.
- Solicitud de material adicional.
- Paros 4M.
- Primera pieza / integración visual con Calidad.
- Estado físico de hoja de OP impresa / no impresa.
- Trazabilidad.

El trabajo de V5 es CORREGIR y CERRAR, no agregar otro rediseño.

---

# 2. P0 — Paginación Offset debe respetar máquina y ejemplo de Iván

Este es el punto más delicado del demo.

Actualmente el optimizador usa una tabla fija y todavía contiene:

```text
24 páginas → 12 + 12
```

Pero Iván explicó verbalmente el caso:

```text
24 páginas
→ máquina con máximo 16 páginas por forma
→ 16 + 8
```

La V5 debe hacer que la recomendación dependa de la capacidad de la máquina.

Ya existe en `ProductionMachine`:

```ts
maxFormPages?: 16 | 32
```

Usarlo realmente.

## Comportamiento requerido

### Máquina de 16 páginas por forma

Ejemplos:

```text
8  → 8
12 → 12
16 → 16
20 → 12 + 8
24 → 16 + 8
28 → 16 + 12
32 → 16 + 16
40 → 16 + 16 + 8
48 → 16 + 16 + 16
64 → 16 + 16 + 16 + 16
```

### Máquina de 32 páginas por forma

Puede aprovechar formas de 32 cuando corresponda.

Ejemplos coherentes:

```text
32 → 32
40 → 32 + 8
44 → 32 + 12
48 → 32 + 16
64 → 32 + 32
```

## UI

Dentro de `ProductionPaginationOptimizer` mostrar explícitamente:

```text
Máquina seleccionada: Heidelberg Speedmaster
Capacidad por forma: 32 páginas

Recomendación:
32 + 32
```

Si cambia a una máquina de 16:

```text
Capacidad por forma: 16 páginas
Recomendación recalculada:
16 + 16 + 16 + 16
```

El planner debe notar visualmente que la recomendación cambió.

Mantener botón:

```text
[Usar recomendación]
[Ajustar manualmente]
```

No hacer un motor de imposición real; es demo. Pero la lógica debe ser coherente con la capacidad de máquina.

---

# 3. P0 — Lead time debe ser gate, no solo semáforo

Hoy la V4 calcula `Bajo / Medio / Alto`, pero Iván pidió evitar promesas imposibles.

Agregar comportamiento:

## Riesgo Bajo

```text
✓ Fecha viable
[Continuar]
```

## Riesgo Medio

```text
⚠ Fecha comprometida
Puede continuar, pero debe quedar alerta visible.
```

## Riesgo Alto

No permitir pasar silenciosamente a OP normal.

Mostrar:

```text
FECHA NO VIABLE

Tiempo requerido: 14.5 h
Capacidad disponible: 6.0 h
Fecha cliente: 10 Sep
Fecha estimada sistema: 12 Sep

[Corregir fecha]
[Solicitar expeditar · Demo]
```

### Expeditar demo

Al elegir `Solicitar expeditar` abrir modal sencillo:

- motivo;
- autorización requerida;
- horas extra / turno adicional demo;
- impacto estimado;
- comentario.

Al confirmar:

- dejar evento en trazabilidad;
- marcar la OP con badge `Expeditada` o flag equivalente;
- permitir continuar.

No implementar costo financiero real.

---

# 4. P0 — Terminar flujo “Hoja OP impresa”

La tabla de Órdenes ya muestra:

```text
No impresa
Impresa ✓
```

Pero el flujo debe cerrar completamente.

## Acción

En `OrdenesProduccion`:

```text
[🖨 Imprimir hoja OP]
```

Al hacer clic:

1. abrir vista previa / modal demo;
2. mostrar datos principales de OP;
3. botones `Imprimir` y `Cancelar`;
4. al confirmar, actualizar:

```text
sheetPrintedStatus.isPrinted = true
sheetPrintedStatus.printedAt = fecha/hora demo
sheetPrintedStatus.printedBy = 'Planner RTM'
```

Si vuelve a imprimir:

```text
reprintCount += 1
```

Agregar trazabilidad:

```text
Hoja física OP impresa para piso
Usuario: Planner RTM
```

Esto debe estar conectado desde `ProduccionPage`, no dejar `onPrintSheet` sin callback.

---

# 5. P0 — Validación temprana desde Pedido / origen

Iván quiere detectar problemas antes de que Producción descubra que no puede fabricar.

No necesitamos construir backend ni rehacer Ventas.

Pero en Paso 1 del wizard, después de seleccionar Pedido + Receta Maestra, mostrar un bloque:

```text
VALIDACIÓN PREVIA DEL PEDIDO

Receta maestra        ✓ Encontrada
Stock PT              3,000
Cantidad a producir   22,000
Material crítico      ⚠ Parcial / ✓ Completo
Herramental           ✓ Disponible
Capacidad              ✓ / ⚠
Lead time              ✓ / ✕

Resultado:
LIBERABLE / CON RIESGO / NO LIBERABLE
```

Si no es liberable, ofrecer acciones coherentes:

```text
[Corregir fecha]
[Evaluar desviación]
[Enviar requisición de material · Demo]
```

No hacer navegación falsa a módulos que no esté conectada. Si es demo, usar banner/modal y dejar trazabilidad local.

---

# 6. P1 — Plan de recuperación de OP atrasada / máquina detenida

Iván quiere saber no solo que hay atraso, sino qué puede hacer.

Agregar en Planeación o detalle de OP un bloque simple:

```text
PLAN DE RECUPERACIÓN

Problema:
Mark Andy 830 detenida 47 min

Opciones:
1. Reprogramar a Mark Andy Scout 10”
   Compatibilidad: 100%
   Capacidad disponible: 8.2 h
   Nueva fecha estimada: 11 Sep

2. Mantener máquina actual
   Nueva fecha estimada: 12 Sep

[Aplicar alternativa]
```

Todo puede ser cálculo demo coherente basado en carga y compatibilidad existentes.

---

# 7. P1 — Estado de surtido y piso

Mantener la secuencia visible:

```text
Planeada
→ Por surtir
→ Material surtido
→ Lista para producir
→ En preparación
→ En proceso
→ Pendiente de calidad
→ Liberada
→ Terminada
```

Una OP con material bloqueado NO debe aparecer como lista para iniciar producción.

En Piso, filtrar correctamente estados bloqueados.

---

# 8. P1 — Material adicional debe modificar el material correcto

Hoy material adicional ya no debe sumar scrap arbitrariamente.

Terminar el comportamiento:

- elegir material;
- cantidad adicional;
- motivo;
- categoría 4M;
- comentario;
- actualizar `delivered` / entrega acumulada del material cuando sea posible;
- registrar trazabilidad;
- solo sumar scrap si el motivo indica desperdicio / defecto / merma.

Ejemplo:

```text
Requerido:   1,000
Entregado:   1,000
Extra:       500
Acumulado:   1,500
```

Si motivo = `faltante de almacén`, NO sumar scrap.

---

# 9. P1 — Reporte diario debe persistir en estado demo

El modal ya existe.

Al guardar:

- conservar el `OperatorDailyReportEntry` en estado local compartido de Producción;
- mostrar `Últimos reportes` o historial desde Piso/Detalle;
- no cerrar y desechar silenciosamente el registro.

Campos documentados:

```text
Fecha
Turno
Operador
Área / máquina
Hora inicio
Hora fin
Código
OP
Cliente
Número de parte
Tipo de acabado
Cantidad
Comentarios
```

Códigos RTM visibles:

```text
100 Inicio de turno
200 Problemas mecánicos
300 No hay trabajo
400 Junta / entrenamiento
```

---

# 10. P1 — Calidad no debe aprobarse desde Producción

Producción puede:

```text
Solicitar liberación de primera pieza
Ver estado QA
Solicitar auditoría final
```

Pero no debe tener un botón que simule que el mismo operador de Producción aprueba QA.

Si existe `✓ Aprobar QA` directamente dentro de Piso, quitarlo o transformarlo en:

```text
[Solicitar liberación a Calidad]
```

Y dejar estado:

```text
Pendiente de Calidad
```

La aprobación real/demo debe venir del módulo Calidad compartido cuando la integración ya esté disponible.

No duplicar lógica.

---

# 11. P2 — Serigrafía

Iván menciona otras líneas de producción además de Offset/Flexo.

Para ESTE demo acordado con RTM el foco es:

```text
OFFSET + FLEXOGRAFÍA
```

No implementar Serigrafía ahora salvo que ya exista infraestructura trivial.

Si aparece en algún filtro general, puede quedar `Próximamente / fuera del alcance del demo`.

---

# 12. Criterio de cierre

La Carta de Santa puede considerarse demostrada si podemos ejecutar estas dos historias sin explicar huecos manualmente.

## Historia Offset

```text
Nueva OP
→ seleccionar Pedido Black & Decker
→ receta maestra heredada
→ validación previa
→ ver paginación
→ cambiar máquina 32 → 16 páginas y observar recalculo
→ confirmar routing
→ revisar material/herramental
→ revisar lead time
→ crear OP
→ verla en Planeación
→ marcar material surtido
→ imprimir hoja OP
→ ir a Piso
→ iniciar preparación
→ solicitar liberación de primera pieza
→ producir
→ reportar paro / material extra
→ terminar operación
→ revisar trazabilidad
```

## Historia Flexo

```text
Nueva OP
→ seleccionar receta Flexo
→ heredar sustrato/tintas/suaje/grabado
→ activar operaciones inline
→ ver compatibilidad de máquinas
→ seleccionar remanente compatible
→ revisar material y desviación si aplica
→ revisar lead time
→ crear OP
→ verla en programa 24 h
→ surtir
→ imprimir hoja OP
→ iniciar en piso
→ reporte operador
→ paro / material extra
→ QA
→ trazabilidad
```

---

# 13. Restricciones

- Trabajar SOLO en `alvaro01`.
- NO crear ramas nuevas.
- Frontend/demo únicamente.
- Sin backend.
- Sin APIs.
- Sin migraciones.
- No romper Producción V4.
- No rehacer componentes que ya funcionan.
- Reutilizar design system actual.
- No inventar datos RTM cuando haya un dato documentado.
- Si un dato exacto no está confirmado, etiquetarlo como `Demo` / `Demo configurable`.

---

# 14. Orden de implementación

## P0 obligatorio

1. Paginación dependiente de máquina + 24 = 16 + 8 en máquina de 16.
2. Gate real de lead time / expeditar demo.
3. Terminar impresión física de hoja OP.
4. Validación temprana desde Pedido / origen.
5. Producción no auto-aprueba QA.

## P1 recomendado

6. Plan de recuperación.
7. Secuencia completa de surtido/piso.
8. Material adicional actualiza entrega acumulada.
9. Persistencia de Reporte Diario.

## P2 opcional

10. Referencia visual a Serigrafía como fuera de alcance del demo.

---

# 15. Validación técnica final

Antes de terminar:

- correr build;
- correr typecheck si existe;
- corregir errores;
- verificar que `Nueva OP` Offset funcione completo;
- verificar que `Nueva OP` Flexo funcione completo;
- verificar que una OP bloqueada no pueda iniciar en Piso;
- verificar que cambio de máquina recalcula paginación;
- verificar que impresión de hoja cambia estado;
- verificar que riesgo alto requiere corrección o expeditar;
- verificar que Reporte Diario quede guardado;
- verificar que Producción solo solicite QA y no se auto-libere.
