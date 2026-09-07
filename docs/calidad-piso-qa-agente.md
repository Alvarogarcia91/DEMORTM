# RTM Demo — Piso QA / Consola del Auditor de Calidad

## Objetivo

Agregar al módulo de Calidad una vista operativa equivalente a `Piso de Producción`, pero enfocada al auditor de Calidad.

La narrativa debe ser:

> **El auditor inicia su turno, el sistema le dice qué debe revisar, dónde, por qué, qué checklist aplica y qué operación/lote se desbloquea cuando termina.**

No sustituir `Auditorías`, `Captura`, `Liberaciones` ni `Dashboard`. Esta vista es complementaria y debe funcionar como la consola diaria del agente de Calidad en planta.

---

# 1. Navegación

Agregar tab principal:

```text
CALIDAD

Dashboard
Piso QA            ★ NUEVO
Captura
Auditorías
Liberaciones
Trazabilidad
No conformes
Gestión SGC
```

`Piso QA` debe ser la vista más operativa del módulo.

---

# 2. Header de Piso QA

Mantener el design system actual de RTM e inspirarse directamente en `PisoProduccion.tsx`, Inventario y Requisiciones.

Ejemplo:

```text
PISO QA · TURNO A
Alicia Ramírez · Aseguramiento de Calidad

[ 8 pendientes ] [ 2 vencidas ] [ 3 bloquean producción ]
[ 1 captura ambiental ] [ 2 auditorías finales ]

Área:
[ Toda planta ] [ Flexo ] [ Offset ] [ Acabados ] [ Serigrafía ]
```

Agregar selector de auditor/rol demo si ya existe en Calidad.

---

# 3. Mi ruta de auditoría

El bloque protagonista debe contestar:

> **¿A dónde debo ir ahorita?**

No usar una tabla como vista principal. Usar cards operativas grandes, claras y accionables.

Priorizar automáticamente por:

1. Bloquea producción.
2. Vencida.
3. Auditoría final que bloquea PT/embarque.
4. Evento automático de proceso.
5. Captura periódica próxima a vencer.
6. Incoming / remanentes / herramental.

## Ejemplo — Primera pieza

```text
PRIORIDAD 1 · Esperando 18 min
PRIMERA PIEZA

OP-2026-95250 · PANASONIC
526412 | G | · Rev G

Flexografía · Mark Andy Scout 10"
Operador: María Ríos · Turno A

Motivo:
Inicio de corrida · PRODUCCIÓN BLOQUEADA

Debes revisar:
Registro · Color · Texto · Troquel · Dimensiones

[ Ir a auditar → ]
```

## Ejemplo — Control en proceso

```text
PRIORIDAD 2 · Esperando 9 min
CONTROL EN PROCESO

OP-2026-95252 · TYCO
Mark Andy 830 10"

Generada automáticamente por:
Producción continua > 2 horas

[ Auditar ]
```

## Ejemplo — Captura programada

```text
RONDA PROGRAMADA · Vence 10:02
TEMPERATURA · CUARTO DE ADHESIVOS

Última lectura: 22.1 °C
Rango esperado: 20–24 °C
Frecuencia: Demo configurable
Instrumento: QA-HG-004 · Calibración vigente

[ Capturar medición ]
```

La misma cola puede contener:

- Primera pieza.
- Control >2h.
- Cambio de bobina.
- Cambio de turno.
- Ajuste de máquina.
- Corte eléctrico.
- Auditoría por operación.
- Auditoría final.
- Bache / muestra.
- Incoming.
- Preimpresión / herramental.
- Validación de remanente.
- Captura de temperatura/humedad.

---

# 4. Sugerencia del sistema — ruta inteligente

Agregar un bloque visual SMART con `Sparkles` y acento morado siguiendo el patrón visual existente en Inventario.

No llamarlo IA. Usar:

`Sugerencia del sistema`

Ejemplo:

```text
✨ RUTA SUGERIDA

El sistema recomienda atender primero:

1. OP-95250 · Primera Pieza · Mark Andy Scout
   Bloquea producción · 18 min esperando

2. OP-95252 · Control >2h · Mark Andy 830
   Auditoría automática pendiente

3. Cuarto Adhesivos
   Captura vence en 12 min

4. BCH-44948 · TYCO
   Muestra pendiente para liberación

[ Iniciar ruta sugerida ]
```

Al completar una actividad:

```text
✓ 1 de 4 completadas

Siguiente recomendación:
Mark Andy 830 · OP-95252

[ Continuar ruta → ]
```

Las sugerencias deben explicar el motivo: bloqueo, vencimiento, tiempo esperando, criticidad o requisito de cliente.

---

# 5. Vista por área / radar de planta

Agregar toggle:

`Mi ruta` | `Vista por área`

Ejemplo:

```text
FLEXOGRAFÍA
Mark Andy Scout     🔴 Primera pieza
Mark Andy 830       🟠 Control >2h
Mark Andy 4120      ✓ Sin pendientes

OFFSET
Heidelberg          🟡 Auditoría en proceso
Conserver 3–4       ✓ Sin pendientes
Ryobi               🔴 Primera pieza

ACABADOS
Guillotina 2        🟡 Medición pendiente
Muller Martini      ✓ Sin pendientes
```

Debe sentirse como un radar visual de pendientes QA de toda la planta.

Click en estación/máquina abre la auditoría correspondiente.

---

# 6. Experiencia de auditoría en piso

Al presionar `Ir a auditar`, abrir modal/workspace amplio optimizado para tablet y escritorio.

Header:

```text
AUDITORÍA EN PISO

OP-2026-95250
Panasonic · 526412 | G | · Rev G
Mark Andy Scout 10"
Operador: María Ríos

PRIMERA PIEZA
```

Banda de contexto:

```text
Origen: Primera pieza
Generada: 09:18
Producción esperando: 18 min
Plan de Control: PC-526412-G
```

---

# 7. Checklist grande y táctil

No usar una tabla pequeña como experiencia principal.

Cada criterio debe ser una tarjeta/sección grande.

Ejemplo:

```text
1. Número de parte / revisión

Esperado:
526412 | G | · Rev G

[ ✓ Conforme ] [ ✕ No Conforme ] [ N/A ]
```

Medición:

```text
2. Registro de impresión

Tolerancia: ± 0.010 in
Valor: [ 0.006 ] in

Resultado automático:
✓ DENTRO DE TOLERANCIA

Instrumento:
Comparador QA-012 · Calibración vigente
```

Criterio visual:

```text
3. Color / tono
Referencia: PMS aprobado cliente

[ ✓ Conforme ] [ ✕ No Conforme ]
[ + Adjuntar evidencia ]
```

Permitir por criterio:

- Conforme.
- No Conforme.
- N/A.
- Valor medido.
- Observación.
- Defecto.
- Cantidad detectada.
- Evidencia/foto demo.
- Instrumento cuando aplique.

---

# 8. Checklist contextual por operación

El checklist debe depender de la operación real del routing, no sólo del área.

Ejemplos:

- Impresión.
- Corte.
- Doblado.
- Grapado / Intercalado.
- Impresión + Troquel.
- Troquel.
- Conteo / Rebobinado.
- Primera pieza.
- Auditoría final.
- Incoming.
- Herramental.
- Remanente.

Reutilizar las plantillas/configuración ya implementadas en Calidad; no duplicar conceptos.

---

# 9. Dictamen

Mostrar progreso visible:

```text
5 / 5 criterios revisados
```

Si todos conformes:

`LIBERAR PRIMERA PIEZA`

Si existe una falla:

```text
1 NO CONFORMIDAD DETECTADA

Registro impresión
Resultado: 0.018 in
Máximo: 0.010 in

[ Rechazar ]
[ Mandar a HOLD ]
[ Adjuntar evidencia ]
```

El dictamen debe afectar el estado compartido actual de Producción ↔ Calidad.

Primera pieza conforme:

```text
Calidad aprueba
→ Producción puede continuar
```

No conforme:

```text
Calidad rechaza
→ OP bloqueada / HOLD
→ MNC cuando aplique
```

---

# 10. Flujo post-auditoría

Al finalizar:

```text
✓ Auditoría QA-260907-081 cerrada

OP-95250 autorizada para continuar
Auditor: Alicia Ramírez
09:36

Siguiente auditoría recomendada:
Mark Andy 830 · OP-95252

[ Continuar ruta ]
```

La experiencia debe llevar al auditor naturalmente de una tarea a la siguiente.

---

# 11. Auditoría final dentro de Piso QA

Cuando la tarea sea final, el mismo shell cambia de contenido.

Ejemplo:

```text
AUDITORÍA FINAL

OP-95249 · BLACK & DECKER
Bache BCH-44947

Producidas           145
Muestra requerida      3
Inspeccionadas         3

[ Auditar muestra ]
```

Checklist final según aplique:

- Parte.
- Revisión.
- Identificación.
- Material.
- Impresión.
- Color.
- Corte.
- Doblado.
- Grapado.
- Troquel.
- Embobinado.
- Empaque.
- Cantidad.

Resultado conforme:

```text
145 piezas liberadas
5 paquetes
BCH-44947

[ Liberar bache ]
[ Imprimir etiqueta Zebra ]
```

Resultado no conforme:

```text
Defecto: Revisión incorrecta
Cantidad afectada: 145

[ Crear MNC + HOLD ]
```

---

# 12. Relación con Auditorías existente

`Piso QA` NO reemplaza `Auditorías`.

## Piso QA

- Trabajo actual.
- Ruta.
- Prioridades.
- Ejecución rápida.
- Tablet/piso.

## Auditorías

- Buscar.
- Filtrar.
- Consultar historial.
- Baches.
- Incoming.
- Remanentes.
- Dictámenes cerrados.

Ambos deben utilizar el mismo estado/dataset.

---

# 13. UI / UX obligatoria

Seguir:

- `docs/design-system.md`.
- `PisoProduccion.tsx` como referencia funcional.
- Inventario `DashboardTab.tsx` para cards operativas y sugerencias SMART.
- Requisiciones para modales/workspaces.

Usar:

- `max-w-[1520px]` cuando aplique.
- cards `rounded-2xl/3xl`.
- theme tokens.
- semántica por borde/icono/dot.
- `font-mono` para OP, folios, lotes y mediciones.
- `Sparkles` + morado para sugerencias del sistema.
- responsive real.

No copiar visualmente Access.
No crear otro design system.
No usar colores saturados como fondo completo de cada card.

---

# 14. Restricciones técnicas

- Trabajar sólo en `alvaro01`.
- `src/` es fuente canónica.
- Frontend demo.
- Reutilizar estado compartido Producción ↔ Calidad existente.
- No duplicar datasets ni estados de OP.
- No romper `AuditoriasWorkspace` ni `CapturasWorkspace`.
- No botones muertos.
- Acciones demo deben producir cambio de estado, modal o toast.

---

# 15. Criterio de éxito para demo

En menos de 2 minutos debe poder mostrarse:

```text
Alicia entra a Piso QA
→ ve 8 pendientes
→ sistema recomienda ruta
→ abre primera pieza Panasonic
→ revisa checklist
→ libera
→ Producción se desbloquea
→ sistema la manda a siguiente auditoría >2h
→ después abre bache final
→ libera / etiqueta o crea HOLD
```

El cliente debe sentir que el auditor ya no depende de una lista manual ni de preguntar en piso qué sigue: **el ERP dirige su jornada de Calidad y conserva toda la trazabilidad.**
