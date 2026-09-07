# Impresos RTM — Nómina Demo V3

## RH operativo + ciclos + vacaciones + préstamos + auditoría

> **Objetivo:** convertir el módulo actual de Nómina en una experiencia de ERP mexicano completa, coherente y vendible para demo, sin rehacer lo que ya existe y sin implementar backend real ni timbrado fiscal productivo.

---

# 1. Principio de esta V3

El módulo actual ya tiene buenas piezas: empleados, asistencia, incidencias, ciclos, revisión, cierre, histórico, timbrado y componentes de auditoría.

La V3 **no debe reemplazar el módulo ni crear una segunda experiencia paralela**.

Debe hacer tres cosas:

1. **Ordenar lo que ya existe alrededor del ciclo de nómina.**
2. **Agregar funciones de RH que hoy hacen falta visualmente: vacaciones y préstamos.**
3. **Conectar todo para que el usuario entienda por qué una persona cobra cierta cantidad y quién modificó cada dato.**

La sensación buscada es:

> “Aquí puedo controlar empleados, horas, incidencias, vacaciones, préstamos, preparar la nómina, revisarla, cerrarla, timbrarla y auditarla.”

No queremos una colección de pantallas aisladas.

---

# 2. Alcance demo

## Sí hacer

- Frontend funcional con datos mock/locales.
- Reutilizar componentes y estilos existentes.
- Mantener los empleados demo actuales y enriquecerlos.
- Mantener el flujo actual de ciclos de nómina y hacerlo más visible.
- Agregar vacaciones.
- Agregar préstamos/descuentos recurrentes.
- Exponer auditoría de forma útil.
- Mejorar el expediente del empleado.
- Conectar visualmente asistencia/incidencias con pre-nómina.
- Simular importaciones, exportaciones, aprobaciones y timbrado con feedback visual.
- Persistencia local si el patrón ya existe en el demo.

## No hacer

- Backend nuevo.
- Migraciones.
- API real.
- PAC real.
- Timbrado fiscal real.
- Cálculo legal/fiscal completo de producción.
- Integración real con reloj biométrico.
- Integración bancaria real.

Todo lo que parezca una acción externa debe funcionar como **demo controlado**: modal, progreso, toast/banner y cambio local de estado.

---

# 3. Arquitectura UX del módulo

Evitar llenar el módulo con 10–15 tabs principales.

La navegación debe quedar agrupada en **6 áreas principales**:

1. **Resumen**
2. **Empleados**
3. **Asistencia e incidencias**
4. **Ciclos de nómina**
5. **Préstamos y vacaciones**
6. **Histórico y auditoría**

El **ciclo de nómina** sigue siendo el centro operativo del proceso.

Al abrir un ciclo, mostrar su propio flujo interno:

```text
Preparación → Revisión → Validación → Cierre → Timbrado
```

No crear otra barra sticky invasiva. Respetar el shell y jerarquía visual actual del ERP.

---

# 4. Resumen de Nómina

La pantalla de entrada debe contestar en menos de 10 segundos:

- ¿qué ciclo estamos trabajando?
- ¿cuántos empleados entran?
- ¿qué incidencias están pendientes?
- ¿hay vacaciones o préstamos afectando el periodo?
- ¿cuánto se estima pagar?
- ¿qué falta para cerrar/timbrar?

## Header

Título:

**Nómina**

Subtítulo:

`Control de asistencia, incidencias, ciclos, pagos y timbrado`

CTA principal contextual:

- si no hay ciclo activo: **Nuevo ciclo**
- si hay ciclo activo: **Abrir ciclo actual**

CTA secundario:

**Importar información**

Menú:

- Descargar plantilla
- Importar plantilla
- Exportar resumen

Todas las acciones de import/export pueden ser simuladas.

## KPIs superiores

Usar 5 cards compactas:

- **Ciclo actual** — Semanal · 07–13 sep
- **Empleados** — 30 incluidos
- **Incidencias pendientes** — 4
- **Neto estimado** — $186,420
- **Timbrado** — 0 / 30

## Bloques de atención

### Requieren revisión

Ejemplos:

- 2 horas extra pendientes de autorización
- 1 falta sin justificar
- 1 solicitud de vacaciones que impacta el ciclo
- 1 préstamo con ajuste manual

Cada elemento debe navegar o abrir el detalle correspondiente.

### Próximos eventos

- Fecha de pago
- Vacaciones próximas
- Cierre estimado
- Empleados con aniversario/alta reciente si ya existe dato mock

---

# 5. Empleados — convertirlo en expediente real

No basta una tabla plana.

Mantener la tabla actual pero enriquecer el drawer/modal de cada empleado como un **Expediente de nómina**.

## Tabla principal

Columnas sugeridas:

- Empleado
- Número
- Puesto
- Departamento
- Turno
- Frecuencia de pago
- Sueldo base
- Estatus
- Acción

Mantener alrededor de **30 empleados demo**, predominantemente operadores y con puestos coherentes con RTM:

- Operador Flexografía
- Operador Offset
- Operador Serigrafía
- Ayudante de producción
- Inspector de calidad
- Montacarguista
- Almacenista
- Planeador
- Supervisor de producción
- Mantenimiento
- Administrativo
- RH

## Drawer de empleado

Header con:

- Nombre
- Número de empleado
- Puesto
- Departamento
- Turno
- Estatus

Tabs internas:

### General

- fecha de ingreso
- frecuencia de pago
- sueldo base
- jornada
- turno
- jefe/supervisor
- RFC demo
- CURP demo
- NSS demo
- banco/CLABE enmascarada

No usar datos reales de personas.

### Asistencia

Resumen del periodo:

- horas esperadas
- horas registradas
- ordinarias
- extra
- retardos
- faltas

### Incidencias

Historial reciente:

- horas extra
- faltas
- retardos
- permisos
- incapacidades
- vacaciones

### Vacaciones

- saldo actual
- disfrutados
- programados
- solicitudes recientes

### Préstamos

- préstamos activos
- saldo
- descuento por periodo
- progreso

### Nómina

Últimos recibos/ciclos:

- periodo
- percepciones
- deducciones
- neto
- estado

CTA:

**Ver detalle del ciclo**

---

# 6. Asistencia e incidencias

Conservar lo bueno del demo actual y hacer más clara la relación entre horas e incidencias.

## Resumen por empleado

Columnas:

- Empleado
- Jornada esperada
- Horas registradas
- Ordinarias
- Extra
- Ausentes
- Retardos
- Incidencias
- Estado
- Acción

Estados:

- Correcto
- Requiere revisión
- Pendiente autorización
- Validado

## Filtros

- ciclo
- departamento
- turno
- empleado
- estado

## Acciones

- Capturar horas
- Importar checadas
- Registrar incidencia
- Autorizar seleccionadas
- Exportar

## Incidencias soportadas visualmente

- Hora extra
- Retardo
- Falta
- Falta justificada
- Permiso con goce
- Permiso sin goce
- Incapacidad
- Vacaciones
- Bono
- Descuento
- Ajuste manual

## Regla UX importante

Una incidencia debe mostrar si **afecta la nómina del ciclo**.

Ejemplo:

`2.0 h extra · +$428.60 estimado`

`1 falta injustificada · -$612.00 estimado`

No hace falta un motor fiscal perfecto: usar importes mock consistentes.

---

# 7. Ciclos de nómina — hacerlo protagonista

Ya existe esta funcionalidad. No duplicarla.

Mejorar su presentación y navegación para que sea la columna vertebral del módulo.

## Tabla de ciclos

Columnas:

- Periodo
- Tipo
- Fecha de pago
- Empleados
- Incidencias
- Percepciones
- Deducciones
- Neto
- Estado
- Acción

Estados:

- Borrador
- Capturando incidencias
- En revisión
- Autorizada
- Cerrada
- Timbrada

## Cards superiores

- Ciclo actual
- Último timbrado
- Próximo periodo
- Pendientes de cierre

## Al abrir un ciclo

Header:

**Nómina semanal · 07–13 sep 2026**

Chips:

`30 empleados` · `4 incidencias pendientes` · `$186,420 neto estimado`

Stepper:

```text
1 Preparación
2 Revisión
3 Validación
4 Cierre
5 Timbrado
```

---

# 8. Preparación del ciclo

Mostrar checklist de preparación:

- Empleados incluidos
- Checadas cargadas
- Incidencias generadas
- Vacaciones aplicables
- Préstamos aplicables
- Datos faltantes

Cada renglón debe tener:

- estado
- contador
- acción

Ejemplo:

`Checadas cargadas · 30/30 · Completo`

`Incidencias · 4 por revisar · Revisar`

`Préstamos · 7 descuentos programados · Ver`

`Vacaciones · 3 empleados con vacaciones · Ver`

---

# 9. Revisión / Pre-nómina

Esta debe ser una de las pantallas más fuertes visualmente.

Tabla:

- Empleado
- Sueldo / ordinario
- Horas extra
- Bonos
- Otros ingresos
- ISR demo
- IMSS demo
- Préstamos
- Otras deducciones
- Neto
- Estado
- Acción

## Drawer de revisión individual

Secciones:

### Percepciones

- sueldo ordinario
- horas extra
- bonos
- prima/vacaciones si aplica

### Deducciones

- ISR demo
- IMSS demo
- préstamo
- faltas/descuentos
- otras deducciones

### Incidencias origen

Mostrar exactamente qué incidencias produjeron modificaciones.

### Comparativo

`Periodo anterior` vs `Periodo actual`

Ejemplo:

- Neto anterior: $5,820
- Neto actual: $6,430
- Variación: +10.5%

CTA:

**Marcar como revisado**

---

# 10. NUEVO — Préstamos y descuentos recurrentes

Agregar dentro de la agrupación **Préstamos y vacaciones** una subvista **Préstamos**.

Debe sentirse como una función de nómina real, no como una simple lista.

## KPIs

- Préstamos activos
- Saldo por recuperar
- Retención del próximo ciclo
- Próximos a liquidarse

Ejemplo:

`8 activos · $64,350 saldo · $6,250 a retener este ciclo`

## Tabla

Columnas:

- Empleado
- Concepto
- Fecha inicial
- Importe original
- Saldo actual
- Retención por periodo
- Pagos realizados
- Próximo descuento
- Estado
- Acción

Conceptos mock:

- Préstamo empresa
- Adelanto de nómina
- Descuento de equipo
- Otro descuento acordado

Estados:

- Activo
- Pausado
- Liquidado

## Ejemplo visual

**Juan Martínez · Operador Flexo**

- Importe original: $18,000
- Saldo actual: $7,250
- Retención semanal: $750
- Progreso: 14 / 24 pagos
- Próximo descuento: Ciclo 36

Mostrar barra de progreso.

## Drawer de préstamo

Secciones:

- Resumen
- Calendario de pagos
- Historial de descuentos
- Auditoría

Historial ejemplo:

| Ciclo | Fecha | Descuento | Saldo |
|---|---|---:|---:|
| 35 | 04 sep | $750 | $7,250 |
| 34 | 28 ago | $750 | $8,000 |
| 33 | 21 ago | $750 | $8,750 |

## Nuevo préstamo

Botón:

**+ Registrar préstamo**

Modal:

- empleado
- concepto
- importe
- fecha de inicio
- frecuencia
- descuento por periodo
- número estimado de pagos
- observaciones

Al guardar:

- crear mock local
- toast
- hacerlo visible en empleado
- reflejarlo en el siguiente ciclo abierto si corresponde

## Acciones demo

- Pausar descuento
- Reanudar
- Ajustar retención
- Liquidar saldo

Todas deben generar registro de auditoría local.

---

# 11. NUEVO — Vacaciones

Agregar subvista **Vacaciones** dentro de **Préstamos y vacaciones**.

Debe permitir entender inmediatamente saldos y solicitudes.

## KPIs

- Solicitudes pendientes
- Personas de vacaciones hoy
- Días programados este mes
- Próximos a vencer / revisar

## Tabla de saldos

Columnas:

- Empleado
- Antigüedad
- Días disponibles
- Disfrutados
- Programados
- Saldo restante
- Próxima ausencia
- Acción

No intentar construir cálculo legal perfecto. Para demo usar saldos mock coherentes.

## Solicitudes

Tab secundaria:

**Solicitudes**

Columnas:

- Folio
- Empleado
- Fecha solicitud
- Desde
- Hasta
- Días
- Regreso
- Estado
- Autoriza
- Acción

Estados:

- Pendiente
- Autorizada
- Rechazada
- Cancelada
- Disfrutada

## Nueva solicitud

Botón:

**+ Solicitud de vacaciones**

Modal:

- empleado
- saldo disponible
- fecha inicio
- fecha fin
- días solicitados
- fecha estimada de regreso
- comentario

Mostrar preview:

`Saldo actual: 12 días`

`Solicitud: 3 días`

`Saldo después de autorizar: 9 días`

## Autorización

Drawer/modal con:

- empleado
- puesto
- departamento
- saldo
- fechas
- comentario
- posible impacto en ciclo de nómina

Acciones:

**Autorizar**

**Rechazar**

Al autorizar:

1. Cambiar estado local.
2. Actualizar saldo/programados.
3. Crear incidencia visual de tipo `Vacaciones`.
4. Mostrarla en asistencia/incidencias.
5. Reflejarla en preparación/revisión del ciclo correspondiente.
6. Generar evento de auditoría.

Ésta es una conexión importante del demo.

---

# 12. Histórico y auditoría

Agrupar ambas funciones en una sola área principal, con tabs internas:

- **Histórico de nómina**
- **Auditoría**

## Histórico

Filtros:

- periodo
- tipo de nómina
- empleado
- departamento
- estado

Tabla:

- periodo
- empleado
- percepciones
- deducciones
- neto
- UUID demo / estado CFDI
- acción

Acciones:

- Ver recibo
- Ver detalle
- Descargar PDF demo
- Descargar XML demo

## Auditoría

La auditoría no debe ser un log técnico aburrido.

Debe ser entendible para RH/Administración.

### Filtros

- ciclo
- empleado
- usuario
- módulo
- tipo de movimiento
- fecha

### Timeline / tabla de eventos

Ejemplos:

**10:42 · María López**

`Modificó horas extra de Roberto García`

`2.0 h → 5.0 h`

---

**10:51 · Carlos Méndez**

`Autorizó incidencia INC-0291`

`Falta → Falta justificada`

---

**11:03 · María López**

`Ajustó descuento de préstamo de Juan Martínez`

`$500 → $750`

---

**11:18 · Ana Torres**

`Autorizó vacaciones VAC-0041`

`3 días · 16–18 sep 2026`

### Drawer de evento

Mostrar:

- fecha/hora
- usuario
- empleado afectado
- ciclo
- módulo
- acción
- valor anterior
- valor nuevo
- comentario/motivo

Reutilizar `PayrollAuditDrawer` si ya resuelve parte de esta experiencia; enriquecerlo, no duplicarlo.

---

# 13. Cierre y timbrado

Mantener las piezas existentes.

El cambio principal es que ahora cierre/timbrado se entiende como la parte final del ciclo.

## Validaciones antes de cerrar

Checklist:

- todos los empleados revisados
- incidencias autorizadas
- vacaciones aplicadas
- préstamos aplicados
- netos calculados
- sin empleados bloqueados

Si falta algo:

Banner:

`Este ciclo todavía tiene 3 elementos que requieren atención antes de cerrarse.`

CTA:

**Ver pendientes**

## Timbrado

Mantener experiencia demo con:

- progreso por empleado
- Pendiente
- Timbrado
- Error
- Reintento
- Cancelado demo si ya existe patrón

Ejemplo:

`28 de 30 CFDI procesados`

`1 pendiente · 1 con error`

Error demo:

`Código postal fiscal no coincide con la información registrada.`

Acciones:

- Ver detalle
- Corregir demo
- Reintentar

No realizar PAC real.

---

# 14. Importar / descargar plantilla

Debe seguir siendo una función visible porque comunica facilidad operativa.

En Resumen y/o Asistencia:

**Importar información**

Dropdown:

- Descargar plantilla de checadas
- Importar checadas
- Descargar plantilla de incidencias
- Importar incidencias

## Descargar plantilla

Mostrar toast:

`Plantilla preparada correctamente · Demo`

No hace falta generar archivo real si el patrón actual no lo hace.

## Importar

Modal de 3 estados:

1. Seleccionar archivo
2. Validando información
3. Resultado

Resultado ejemplo:

- 30 empleados detectados
- 28 sin observaciones
- 2 requieren revisión

CTA:

**Aplicar importación**

Al aplicar, actualizar datos locales de asistencia/incidencias.

---

# 15. Exportaciones demo

Agregar acciones coherentes:

- Exportar pre-nómina
- Exportar histórico
- Exportar préstamos
- Exportar vacaciones
- Exportar auditoría
- Descargar recibos

Feedback:

`Reporte generado correctamente · Función demostrativa`

Evitar botones muertos.

---

# 16. Datos mock RTM

Mantener alrededor de **30 empleados**.

Distribución sugerida:

- 10 Operadores Flexografía
- 6 Operadores Offset
- 3 Operadores Serigrafía
- 2 Ayudantes de producción
- 2 Calidad
- 2 Almacén
- 1 Mantenimiento
- 1 Planeación
- 1 Supervisor de producción
- 1 RH
- 1 Administrativo

Generar variedad realista:

- 20–24 semanales
- 6–10 quincenales
- turnos Día / Tarde / Noche cuando tenga sentido
- algunos sin incidencias
- algunos con horas extra
- faltas/retardos puntuales
- 6–8 préstamos activos
- 8–12 empleados con saldo de vacaciones
- 3–5 solicitudes recientes
- al menos 1 solicitud pendiente
- al menos 1 préstamo próximo a liquidarse
- al menos 1 error de timbrado demo

No usar nombres de personas reales del cliente salvo que ya formen parte explícita de mocks aprobados. Preferir nombres ficticios.

---

# 17. Conexiones entre features

La V3 se debe sentir integrada.

## Caso 1 — Vacaciones

```text
Solicitud
→ autorización
→ incidencia de vacaciones
→ asistencia del periodo
→ preparación del ciclo
→ revisión de empleado
→ histórico
→ auditoría
```

## Caso 2 — Préstamo

```text
Préstamo activo
→ descuento programado
→ preparación del ciclo
→ deducción en pre-nómina
→ cierre
→ histórico de préstamo
→ auditoría
```

## Caso 3 — Hora extra

```text
Checada
→ detección/captura de hora extra
→ autorización
→ incidencia
→ percepción estimada
→ revisión
→ cierre
→ auditoría
```

Estas conexiones son más importantes que tener muchas pantallas.

---

# 18. Wording

Usar lenguaje empresarial mexicano simple.

Preferir:

- Empleado / Colaborador según patrón actual; no mezclar ambos sin razón.
- Ciclo de nómina
- Periodo
- Asistencia
- Incidencia
- Horas extra
- Vacaciones
- Préstamo
- Descuento por periodo
- Pre-nómina
- Revisión
- Cierre
- Timbrado
- Recibo de nómina
- Auditoría

Evitar wording técnico de desarrollo:

- mock
- payload
- state
- record
- object
- fake

Dentro de la UI decir **Demo** o **Función demostrativa** cuando sea necesario.

---

# 19. Reglas visuales

- Respetar `docs/design-system.md` y componentes existentes.
- No introducir un segundo design system.
- No rediseñar sidebar/topbar global.
- No abusar de gradientes.
- No usar cards gigantes cuando una tabla compacta funciona mejor.
- Cantidades monetarias alineadas y fáciles de comparar.
- Horas con formato consistente.
- Chips de estado reutilizables.
- Drawers amplios para detalles densos.
- Modales para acciones puntuales.
- Skeleton/loading solo si ya existe patrón.
- Toast/banner después de acciones demo.
- Evitar botones sin respuesta visual.

---

# 20. Reutilización obligatoria

Antes de programar:

1. Auditar el módulo actual de Nómina en la rama `alvaro01`.
2. Identificar qué ya existe y reutilizarlo.
3. En especial revisar y aprovechar componentes existentes como:
   - `CiclosNominaTab.tsx`
   - `NuevoCicloWizardModal.tsx`
   - `PayrollAuditDrawer.tsx`
   - componentes actuales de empleados
   - asistencia
   - incidencias
   - revisión
   - cierre
   - histórico
   - timbrado
4. No crear versiones `V2`, `New`, `Temp` de componentes si se puede evolucionar el actual.
5. No dejar código muerto del flujo anterior.

---

# 21. Orden recomendado de implementación

## Fase A — Auditoría y navegación

- revisar estructura actual
- mapear componentes reutilizables
- agrupar navegación en 6 áreas
- asegurar que Ciclos sea protagonista

## Fase B — Empleado 360

- enriquecer drawer de empleado
- agregar tabs vacaciones/préstamos/nómina
- conectar datos existentes

## Fase C — Vacaciones

- saldos
- solicitudes
- autorización demo
- conexión con incidencias/ciclo/auditoría

## Fase D — Préstamos

- listado
- nuevo préstamo
- progreso/historial
- conexión con deducción del ciclo

## Fase E — Auditoría

- vista general
- filtros
- timeline/tabla
- reutilizar/enriquecer `PayrollAuditDrawer`

## Fase F — Integración del ciclo

- checklist de preparación
- indicadores de vacaciones/préstamos
- revisión individual enriquecida
- validaciones antes de cierre

## Fase G — Pulido demo

- import/export simulados
- toasts/banners
- datos mock consistentes
- responsive
- eliminar botones muertos
- revisar copy

---

# 22. Demo story sugerida

El flujo de presentación debe poder hacerse en 5–8 minutos.

### Escena 1 — Resumen

Mostrar ciclo actual, 30 empleados, neto estimado y pendientes.

### Escena 2 — Asistencia

Abrir un operador con horas extra pendientes.

Autorizar incidencia.

### Escena 3 — Vacaciones

Abrir solicitud pendiente de otro empleado.

Autorizarla y mostrar que ahora aparece como incidencia del periodo.

### Escena 4 — Préstamo

Abrir un préstamo activo.

Mostrar saldo, pagos y próxima retención.

### Escena 5 — Ciclo

Abrir ciclo actual y mostrar checklist completo.

Entrar a revisión y abrir el empleado con préstamo.

Mostrar la deducción originada automáticamente.

### Escena 6 — Auditoría

Mostrar los movimientos realizados durante el demo.

### Escena 7 — Cierre / Timbrado

Cerrar ciclo demo y ejecutar timbrado simulado.

Mostrar 1 CFDI con error y reintento exitoso.

Final:

`30 / 30 recibos procesados`

Esta historia demuestra control, integración y trazabilidad sin tener que explicar arquitectura técnica.

---

# 23. Criterios de aceptación

La implementación se considera terminada cuando:

- [ ] El módulo se siente como una sola experiencia y no como tabs desconectadas.
- [ ] Ciclos de nómina es claramente el eje operativo.
- [ ] Vacaciones tiene saldos, solicitudes y autorización demo.
- [ ] Una vacación autorizada genera incidencia visible.
- [ ] Préstamos tiene saldo, progreso, historial y descuento por periodo.
- [ ] Un préstamo activo se refleja visualmente en la revisión del ciclo.
- [ ] El expediente del empleado muestra asistencia, incidencias, vacaciones, préstamos e histórico.
- [ ] Auditoría está accesible y registra cambios entendibles.
- [ ] Las acciones importantes generan feedback visual.
- [ ] Timbrado sigue siendo demo/simulado.
- [ ] Import/export sigue siendo demo/simulado.
- [ ] No se agregó backend ni API.
- [ ] No se duplicaron componentes que ya existían.
- [ ] No se rompió el design system actual.
- [ ] No quedan botones importantes muertos.
- [ ] La demo completa puede recorrerse en menos de 8 minutos.

---

# 24. Resultado esperado

El módulo debe comunicar visualmente:

> RTM puede controlar la vida operativa de la nómina desde las horas trabajadas hasta el recibo timbrado, incluyendo incidencias, vacaciones, préstamos, revisiones, autorizaciones e historial auditable.

La prioridad no es simular un SAT perfecto.

La prioridad es que el cliente vea **control, trazabilidad, facilidad operativa e integración**.
