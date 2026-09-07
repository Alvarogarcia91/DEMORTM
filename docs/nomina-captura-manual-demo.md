# RTM Nómina — Mejora de Captura Manual de Horas (Demo)

## Objetivo

La opción **Captura manual de horas en piso** del wizard de Nuevo Ciclo no debe limitarse a seleccionar una fuente y después saltar al resumen.

Como es un demo, necesitamos que el usuario **vea cómo sería realmente capturar las horas de los colaboradores** antes de crear el ciclo.

La experiencia esperada debe sentirse como una mini prenómina operativa: nombres reales del mock, horas esperadas, horas capturadas y extras visibles.

---

## Problema actual

En `NuevoCicloWizardModal.tsx`, el paso 3 únicamente permite seleccionar:

- Importar checadas del reloj biométrico
- Captura manual de horas en piso
- Usar checadas precargadas de demostración

Pero elegir **Captura manual** no abre ninguna tabla ni permite visualizar los empleados seleccionados con sus horas.

Eso hace que el demo no explique cómo trabajaría RH si no cuenta con archivo/reloj o si necesita corregir/capturar manualmente.

---

# Cambio requerido

Cuando el usuario seleccione:

**Captura manual de horas en piso**

el mismo Paso 3 debe expandirse y mostrar una tabla de captura para los colaboradores seleccionados en el Paso 2.

No abrir otra página. Mantenerlo dentro del wizard para que la narrativa sea inmediata.

Aumentar `max-w` del modal si hace falta para que la tabla sea usable.

---

# Tabla de captura manual

Para ciclo semanal usar columnas:

| No. | Colaborador | Puesto | Lun | Mar | Mié | Jue | Vie | Sáb | Ordinarias | Extra | Total |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|

Ejemplo visual:

| RTM-001 | Carlos Mendoza Ruiz | Operador Mark Andy | 8.0 | 8.0 | 8.0 | 8.0 | 8.0 | 4.0 | 44.0 | 1.5 | 45.5 |
| RTM-002 | José Luis Herrera Soto | Operador Mark Andy | 8.0 | 8.0 | 7.5 | 8.0 | 8.0 | 4.0 | 43.5 | 0.0 | 43.5 |
| RTM-003 | Miguel Ángel Treviño | Operador Scout | 8.0 | 8.0 | 8.0 | 9.0 | 8.0 | 4.0 | 44.0 | 1.0 | 45.0 |

No usar exactamente estos valores para todos. Generar variedad coherente.

Para ciclo quincenal no intentar mostrar 15 días completos en una tabla enorme. Usar una vista compacta por colaborador con:

- Días trabajados
- Horas ordinarias
- Horas extra/adicionales
- Horas ausentes
- Incidencias

---

# Interacción demo

Cada celda diaria semanal debe ser un input numérico simple, con incrementos de 0.5 h.

El usuario debe poder cambiar por ejemplo:

`8.0 → 9.5`

Y la fila debe recalcular visualmente:

- total horas capturadas;
- ordinarias;
- extra/adicionales.

No implementar motor legal real.

Usar una regla visual de demo sencilla:

- jornada esperada del ciclo según mock;
- horas por encima de la jornada esperada se muestran en columna Extra/Adicional;
- horas por debajo pueden mostrar una diferencia/alerta visual.

No afirmar que el cálculo de horas extra es fiscal o legalmente definitivo.

---

# Acciones rápidas

Sobre la tabla agregar controles demo:

- **Aplicar jornada estándar a todos**
- **Copiar semana anterior**
- **Limpiar captura**

Al ejecutar:

- actualizar la tabla local;
- mostrar toast/banner.

Ejemplo:

`Jornada estándar aplicada a 24 colaboradores`

`Horas de la semana anterior copiadas correctamente`

---

# Resumen visible

Arriba o abajo de la tabla mostrar KPIs compactos:

- Colaboradores: 24
- Horas ordinarias: 1,056.0 h
- Horas extra/adicionales: 18.5 h
- Horas faltantes: 6.0 h
- Empleados con diferencia: 3

Los totales deben recalcularse al editar inputs.

---

# Casos demo intencionales

Para que la tabla no se vea falsa, incluir algunos casos con variedad:

- Carlos Mendoza: 1.5 h adicionales
- José Herrera: 0.5 h faltante
- Miguel Treviño: 2.0 h adicionales
- Jesús Peña: un día con 6.0 h por permiso
- Ricardo Salinas: una fila con alerta por captura incompleta

No meter incidencias complejas aquí; solo indicadores y enlace visual a Incidencias después de crear el ciclo.

---

# Resumen del Paso 4

Si la fuente elegida fue manual, el Paso 4 debe mostrar:

**Fuente de horas: Captura manual**

Y resumen:

- 24 colaboradores
- 1,056.0 h ordinarias
- 18.5 h adicionales
- 3 registros requieren revisión

CTA:

**Crear ciclo con horas capturadas**

Al crear:

`Ciclo creado con captura manual de horas`

---

# Restricciones

- Frontend demo solamente.
- No backend.
- No persistencia real.
- No cálculo fiscal/legal real.
- No duplicar un nuevo módulo.
- Reutilizar los empleados seleccionados en Paso 2.
- Mantener datos en estado local del wizard o helpers/mocks del módulo.
- Respetar `docs/design-system.md`.
- No romper la opción de importación ni la opción de checadas precargadas.

---

# Definition of Done

1. Seleccionar Captura manual en Paso 3 muestra inmediatamente la tabla de empleados.
2. La tabla usa únicamente los colaboradores seleccionados en Paso 2.
3. Las horas pueden editarse visualmente.
4. Ordinarias/extra/total se recalculan localmente.
5. Existen acciones rápidas de jornada estándar, copiar semana y limpiar.
6. Hay resumen de totales del ciclo.
7. Paso 4 refleja que la fuente fue manual y muestra los totales capturados.
8. Crear ciclo conserva la narrativa visual y muestra feedback.
9. Importar reloj y demo precargado siguen funcionando.
10. `npm run build` pasa sin errores.
