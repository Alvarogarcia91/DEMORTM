# RTM Demo — Producción 3/5 · Disparadores QA visibles

> Branch objetivo: `alvaro01`
>
> Este documento refina únicamente la experiencia demo entre Producción y Calidad. No pide backend, automatizaciones reales ni rehacer los módulos.

## Objetivo

Hacer visible que durante la fabricación hay eventos que **obligan una revisión de Calidad** y que el operador/supervisor entiende por qué la orden está esperando, qué revisión toca y qué pasa después.

La narrativa demo debe ser:

```text
Producción avanza
→ ocurre un evento de control
→ el sistema muestra el disparador QA
→ se solicita revisión
→ Calidad inspecciona
→ se libera / rechaza
→ Producción continúa o queda en HOLD
```

El demo debe sentirse industrial y coherente con RTM, no como botones aislados.

---

# 1. Disparadores QA que deben verse en la demo

Usar los tipos que ya existen en `mockCalidadData` y la lógica actual de Producción/Calidad.

Como mínimo mostrar estos eventos:

1. **Primera pieza**
2. **Cambio de bobina**
3. **Ajuste de máquina**
4. **Control por corrida > 2 horas**
5. **Cambio de turno**
6. **Corte eléctrico / reinicio de proceso**
7. **Auditoría final**

No todos deben ejecutarse realmente en la misma OP durante la demo, pero todos deben ser visibles como reglas de control.

---

# 2. Nueva sección visible en detalle de OP

En `OrdenProduccionDetail` agregar un bloque/tab compacto:

```text
CONTROLES QA DEL PROCESO

✓ Preimpresión liberada
✓ Primera pieza liberada
○ Control de corrida >2h      Próximo en 38 min
○ Cambio de bobina            Se dispara al registrar cambio
○ Ajuste de máquina           Se dispara si hay ajuste relevante
○ Cambio de turno             14:00
○ Auditoría final             Al finalizar producción
```

Cada fila debe mostrar:

- evento;
- estado;
- cuándo se dispara;
- si bloquea o no producción;
- auditor/área responsable si aplica.

Estados demo:

- `Pendiente`
- `Solicitada`
- `En revisión`
- `Liberada`
- `No conforme / HOLD`

---

# 3. Timeline de QA dentro de la OP

Agregar dentro de Trazabilidad una separación clara de eventos de Calidad.

Ejemplo:

```text
07:42 · PRODUCCIÓN
Setup terminado

07:45 · QA TRIGGER
Primera pieza requerida
Producción bloqueada hasta dictamen

07:51 · CALIDAD
Primera pieza en inspección

07:56 · CALIDAD
Primera pieza liberada · Alicia Ramírez

10:03 · QA TRIGGER
Control periódico >2h generado

10:09 · CALIDAD
Control conforme · Producción continúa
```

Usar iconografía/badges diferentes para `Producción`, `QA trigger` y `Calidad`.

---

# 4. Piso de Producción / Operador

En `PisoOperadorWorkspace` agregar un bloque siempre visible llamado:

`Estado de Calidad`

Ejemplo:

```text
ESTADO DE CALIDAD

Primera pieza       ✓ Liberada 07:56
Control >2h         ● Próximo en 38 min
Cambio de bobina    ○ No requerido todavía
Auditoría final     ○ Pendiente
```

Cuando un evento sea requerido debe cambiar a un banner destacado:

```text
⚠ REVISIÓN QA REQUERIDA

Motivo: Cambio de bobina
OP-95321 · Mark Andy Scout

La corrida queda en espera de validación.

[Solicitar revisión QA]
```

No hacer una pantalla nueva para cada trigger.

---

# 5. Primera pieza

Mantener el flujo actual pero hacerlo más narrativo:

```text
Setup terminado
→ Tiraje de prueba
→ Primera pieza lista
→ Solicitar QA
→ Esperando dictamen
→ Liberada / Rechazada
```

Mientras está pendiente:

```text
⏳ ESPERANDO CALIDAD
Primera pieza
12 min esperando
Producción bloqueada
```

Al aprobar:

```text
✓ LIBERADA
Alicia Ramírez · 07:56
Autorizado iniciar tiraje
```

---

# 6. Control por corrida >2 horas

Agregar un contador visual demo.

Ejemplo:

```text
CONTROL PERIÓDICO QA
Próximo control: 10:05
Faltan 18 min
```

Cuando se cumpla el umbral demo:

```text
⚠ CONTROL QA VENCIDO
La corrida supera 2 horas desde la última validación.

[Solicitar control]
```

Para estabilidad del demo puede existir un botón:

`Simular +2h de corrida`

SOLO si se etiqueta claramente como herramienta de demo y no queda como CTA principal de usuario final.

---

# 7. Cambio de bobina

En Flexo, cuando el operador registre cambio de bobina, mostrar:

```text
CAMBIO DE BOBINA REGISTRADO

Bobina anterior: LOT-BOPP-260721-A
Nueva bobina:    LOT-BOPP-260721-B

⚠ Requiere validación QA de arranque

[Solicitar inspección]
```

El evento debe aparecer en trazabilidad.

No es necesario implementar un inventario real nuevo.

---

# 8. Ajuste de máquina

Cuando se registre una incidencia/ajuste relevante, ofrecer:

```text
¿El ajuste afecta registro, color, corte o dimensiones?

[ Sí · Solicitar revisión QA ]
[ No · Continuar ]
```

Si sí:

```text
QA TRIGGER · AJUSTE DE MÁQUINA
Producción detenida hasta validar nueva muestra.
```

---

# 9. Cambio de turno

En Piso Operador mostrar un evento demo cuando se acerque fin de turno:

```text
CAMBIO DE TURNO · 14:00

La OP continuará en Turno B.
Requiere validación de continuidad del proceso.

[Entregar turno]
```

Al confirmar:

- guardar evento en trazabilidad;
- mostrar QA trigger de cambio de turno;
- conservar cantidades y scrap acumulado.

---

# 10. Corte eléctrico / reinicio

No crear simulación complicada.

Agregar en Reportar Incidencia una opción:

`Corte eléctrico / reinicio de máquina`

Después del reinicio:

```text
⚠ QA requerida antes de continuar
Motivo: Reinicio de proceso después de corte eléctrico
```

---

# 11. Auditoría final

Al terminar la última operación productiva:

```text
PRODUCCIÓN COMPLETADA

Buenas: 49,100
Scrap: 1,900

Pendiente obligatoria:
AUDITORÍA FINAL QA

[Solicitar liberación final]
```

Después:

```text
⏳ Esperando Calidad
```

Y al liberar:

```text
✓ LOTE LIBERADO PARA PRODUCTO TERMINADO
```

No dejar que el flujo parezca que termina con solo presionar `Terminar operación`.

---

# 12. Calidad / Piso QA

La cola de `PisoQaWorkspace` ya existe y debe aprovechar estos triggers.

Hacer que visualmente la cola distinga el origen:

```text
1 · PRIMERA PIEZA        BLOQUEA PRODUCCIÓN
2 · CONTROL >2H          VENCIDO
3 · CAMBIO DE BOBINA     NUEVO
4 · AJUSTE DE MÁQUINA    NUEVO
5 · AUDITORÍA FINAL      LIBERACIÓN PT
```

Mantener la ruta sugerida morada.

Prioridad recomendada:

1. Primera pieza que bloquea arranque.
2. Revisión vencida.
3. Auditoría final esperando liberación.
4. Cambio de bobina / ajuste.
5. Cambio de turno.

---

# 13. Sugerencias del sistema

Usar patrón morado `Sparkles` ya existente.

Ejemplos:

```text
✦ SUGERENCIA DEL SISTEMA
La Mark Andy Scout lleva 1h 52m desde el último control QA.
Programa la revisión antes de llegar a las 2h para evitar paro.

[Solicitar ahora]
```

```text
✦ SUGERENCIA DEL SISTEMA
La OP-95321 cambió de bobina y aún no registra validación de arranque.

[Ver pendiente QA]
```

```text
✦ SUGERENCIA DEL SISTEMA
La auditoría final de OP-95344 está pendiente y bloquea la liberación a PT.

[Ir a Calidad]
```

No decir `IA`.

---

# 14. Qué NO hacer

- No crear backend.
- No crear workflow engine real.
- No crear permisos nuevos.
- No duplicar Calidad.
- No hacer modales enormes para cada evento.
- No inventar otra versión de `QualityAuditItem`.
- No crear diez botones demo sin relación entre sí.

Usar el estado compartido actual de OP cuando sea sencillo y mocks locales cuando sea suficiente.

---

# 15. Resultado esperado para demo

La historia debe poder enseñarse así:

```text
OP FLEXO
↓
Setup
↓
Primera pieza
↓
QA libera
↓
Producción 2h
↓
Control QA periódico
↓
Cambio de bobina
↓
Nueva revisión QA
↓
Continuar producción
↓
Terminar
↓
Auditoría final
↓
Liberación PT
```

Y para Offset:

```text
Preimpresión
↓
Primera pieza impresión
↓
QA
↓
Impresión
↓
Doblado / Grapado
↓
Control por operación si aplica
↓
Auditoría final
↓
PT
```

El objetivo es que el cliente vea que **Calidad acompaña la fabricación en puntos de control específicos**, no que solamente aparece al final.
