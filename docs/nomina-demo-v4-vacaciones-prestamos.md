# Impresos RTM — Nómina Demo V4

## Vacaciones y Préstamos como módulos separados + expediente 360 del empleado

## 1. Objetivo

Mejorar el módulo actual de Nómina sin rehacerlo desde cero.

El problema actual es claro: **Préstamos y vacaciones están combinados dentro de una sola tab (`RhBenefitsTab`)**, lo que hace que ambas funciones se sientan accesorias. Para un ERP serio de RH/Nómina deben tener identidad propia, dashboards propios, detalle por empleado e impacto visible en el ciclo de nómina.

Esta V4 debe lograr que el cliente entienda:

- cuánto saldo de vacaciones tiene cada colaborador;
- cuántos días ha generado, disfrutado, programado y le quedan;
- qué solicitudes están pendientes de autorización;
- qué préstamos tiene cada empleado;
- cuánto pidió, cuánto ha pagado, cuánto debe y cuánto se le descontará en el próximo ciclo;
- cómo vacaciones y préstamos impactan asistencia, incidencias y pre-nómina;
- todo esto desde el expediente individual del empleado.

No implementar backend, API ni cálculo legal/productivo real. Todo es demo frontend con mocks consistentes.

---

# 2. Hallazgos del repo actual

Antes de programar, auditar y reutilizar:

- `src/components/Nomina/NominaPage.tsx`
- `src/components/Nomina/RhBenefitsTab.tsx`
- `src/components/Nomina/EmployeeDrawer.tsx`
- `src/components/Nomina/EmployeesTable.tsx`
- `src/components/Nomina/IncidentCenter.tsx`
- `src/components/Nomina/PayrollReviewTable.tsx`
- `src/components/Nomina/CiclosNominaTab.tsx`
- `src/components/Nomina/PayrollAuditDrawer.tsx`
- `src/data/mockNominaData.ts`
- `docs/design-system.md`

Actualmente:

- `NominaPage` tiene una tab `rh` llamada **Préstamos y vacaciones**.
- `RhBenefitsTab` ya contiene mocks de préstamos y vacaciones, KPIs básicos, alta de préstamo y solicitud de vacaciones.
- las vacaciones autorizadas ya pueden generar una incidencia visual;
- los préstamos ya manejan importe, saldo, retención y progreso;
- `EmployeeDrawer` todavía NO muestra vacaciones ni préstamos como parte del expediente;
- los datos de préstamos/vacaciones viven dentro del componente y no están centralizados como mocks maestros.

No duplicar lógica. Evolucionarla.

---

# 3. Nueva navegación del módulo de Nómina

Separar la tab actual:

`Préstamos y vacaciones`

por dos tabs independientes:

- **Vacaciones**
- **Préstamos**

La navegación propuesta queda:

1. Ciclos
2. Resumen
3. Personal
4. Asistencia
5. Incidencias
6. Vacaciones
7. Préstamos
8. Pre-nómina
9. Timbrado CFDI
10. Historial

No crear navbar extra ni sticky nuevo.

Mantener el header del módulo dentro del flujo normal de la página.

---

# 4. Vacaciones — nueva experiencia completa

Crear componente dedicado sugerido:

`VacacionesTab.tsx`

Puede extraerse de `RhBenefitsTab`, pero debe crecer sustancialmente.

## 4.1 Dashboard de vacaciones

Header:

**Vacaciones**

Subtítulo:

`Control de saldos, solicitudes, programación y ausencias del personal.`

CTA:

**+ Nueva solicitud**

Acciones secundarias demo:

- Descargar plantilla
- Importar saldos
- Exportar reporte

Todo con feedback visual.

## 4.2 KPIs

Mostrar 5 KPIs compactos:

- **Solicitudes pendientes**
- **Personas de vacaciones hoy**
- **Días programados este mes**
- **Saldo promedio disponible**
- **Empleados con saldo bajo / por revisar**

Ejemplo demo:

- 3 solicitudes pendientes
- 2 personas de vacaciones
- 18 días programados
- 9.4 días promedio disponibles
- 4 saldos por revisar

## 4.3 Dos vistas internas

Tabs internas:

### Saldos por empleado

Tabla:

- No. empleado
- Empleado
- Puesto
- Departamento
- Fecha de ingreso
- Antigüedad
- Días generados / asignados
- Días disfrutados
- Días programados
- Saldo disponible
- Próxima ausencia
- Estado
- Acción

Ejemplo:

**Héctor Ramírez Luna · Operador Rotoflex**

- Ingreso: 18-jun-2019
- Antigüedad demo: 7 años
- Días disponibles: 16
- Disfrutados: 6
- Programados: 2
- Saldo restante: 8
- Próxima ausencia: 22–23 sep

No pretender que el cálculo sea legal/fiscal definitivo. Para demo usar datos coherentes y etiquetar internamente como mocks.

### Solicitudes

Tabla:

- Folio
- Empleado
- Solicitado el
- Desde
- Hasta
- Días
- Regreso
- Saldo antes
- Saldo después
- Estado
- Autoriza
- Acción

Estados:

- Pendiente
- Autorizada
- Rechazada
- Cancelada
- Disfrutada

## 4.4 Drawer de detalle de vacaciones del empleado

Al hacer clic en un empleado abrir drawer ancho con:

Header:

- nombre
- número empleado
- puesto
- departamento
- fecha de ingreso

### Tarjetas principales

- Días disponibles
- Días disfrutados
- Días programados
- Días restantes después de solicitudes pendientes

### Historial anual

Timeline o tabla:

- periodo / solicitud
- fechas
- días
- tipo
- estado
- autorizado por

Ejemplo:

- VAC-0042 · 31 ago – 05 sep · 6 días · Disfrutada
- VAC-0048 · 21 – 22 sep · 2 días · Autorizada
- VAC-0051 · 16 – 18 oct · 3 días · Pendiente

### Próximas vacaciones

Mostrar calendario/lista simple con fechas.

### Impacto en nómina

Bloque:

`Esta solicitud impactará el ciclo SEM-2026-38 como incidencia de vacaciones.`

CTA:

**Ver incidencia relacionada**

## 4.5 Nueva solicitud

Modal profesional:

- empleado
- saldo actual
- fecha inicio
- fecha fin
- días solicitados
- fecha de regreso
- comentario
- supervisor / autorizador demo

Preview en vivo:

`Saldo actual: 12 días`

`Solicitud: 3 días`

`Saldo estimado después de autorizar: 9 días`

Al guardar:

- crear solicitud local;
- estado Pendiente;
- toast;
- auditoría.

Al autorizar:

- cambiar estado;
- actualizar programados/saldo;
- crear incidencia de vacaciones;
- reflejar en Asistencia/Incidencias;
- reflejar en preparación del ciclo;
- registrar auditoría.

---

# 5. Préstamos — nueva experiencia completa

Crear componente dedicado sugerido:

`PrestamosTab.tsx`

Extraer la lógica actual de `RhBenefitsTab` y enriquecerla.

## 5.1 Dashboard de préstamos

Header:

**Préstamos y descuentos**

Subtítulo:

`Control de préstamos internos, adelantos y descuentos recurrentes vinculados a nómina.`

CTA:

**+ Registrar préstamo**

Acciones demo:

- Importar préstamos
- Descargar plantilla
- Exportar cartera

## 5.2 KPIs

Mostrar 5 KPIs:

- Préstamos activos
- Saldo total por recuperar
- Retención programada próximo ciclo
- Próximos a liquidarse
- Préstamos pausados / con atención

Ejemplo:

- 8 activos
- $64,350.00 saldo
- $6,250.00 a retener
- 2 próximos a liquidarse
- 1 pausado

## 5.3 Tabla principal

Columnas:

- Folio
- Empleado
- Puesto / departamento
- Concepto
- Fecha inicial
- Importe original
- Saldo actual
- Retención por periodo
- Pagos realizados
- Progreso
- Próximo descuento
- Estado
- Acción

Conceptos demo:

- Préstamo empresa
- Adelanto de nómina
- Descuento de equipo
- Apoyo extraordinario
- Otro descuento autorizado

Estados:

- Activo
- Pausado
- Liquidado

## 5.4 Drawer de detalle de préstamo

Al abrir préstamo:

Header:

- empleado
- folio
- concepto
- estado

Resumen:

- importe original
- saldo actual
- monto pagado
- retención semanal/quincenal
- número total estimado de pagos
- pagos realizados
- pagos restantes
- fecha estimada de liquidación

Mostrar barra de progreso grande.

Ejemplo:

`14 de 24 pagos · 58% liquidado`

### Calendario / plan de pagos

Tabla:

- Ciclo
- Fecha pago
- Descuento programado
- Descuento aplicado
- Saldo posterior
- Estado

Estados:

- Aplicado
- Programado
- Pausado

### Historial de movimientos

- préstamo registrado
- descuento aplicado
- retención ajustada
- descuento pausado
- descuento reanudado
- liquidación

Con usuario y timestamp mock.

### Impacto en próximo ciclo

Bloque fuerte:

`Próximo descuento: $750.00`

`Ciclo: SEM-2026-37`

`Neto estimado antes del préstamo: $5,820.00`

`Neto estimado después del préstamo: $5,070.00`

CTA:

**Ver en pre-nómina**

## 5.5 Registrar préstamo

Modal más completo que el actual:

- empleado
- concepto
- importe original
- fecha de inicio
- frecuencia: semanal/quincenal
- descuento por periodo
- número estimado de pagos
- primer ciclo de aplicación
- observaciones

Preview:

`$18,000 / $750 = 24 pagos estimados`

Al guardar:

- crear mock local;
- registrarlo en auditoría;
- hacerlo visible en empleado;
- marcar el próximo ciclo como afectado.

## 5.6 Acciones demo

- Pausar descuento
- Reanudar
- Ajustar retención
- Registrar abono extraordinario
- Liquidar saldo

Todas deben:

1. abrir modal de confirmación / motivo;
2. modificar estado local;
3. generar toast;
4. generar auditoría.

---

# 6. Expediente 360 del empleado

Este es uno de los cambios más importantes.

`EmployeeDrawer.tsx` actualmente tiene General, Laboral, Fiscal, Asistencia, Nómina e Historial.

Agregar dos tabs claras:

- **Vacaciones**
- **Préstamos**

No meter la información escondida dentro de Historial.

## 6.1 Tab Vacaciones del empleado

Arriba mostrar:

- Disponible
- Disfrutado
- Programado
- Pendiente de autorizar

Ejemplo:

`Disponible: 8 días`

`Disfrutado: 6 días`

`Programado: 2 días`

`Pendiente: 3 días`

Luego:

### Solicitudes recientes

- folio
- fechas
- días
- estado

### Historial anual

### Próxima ausencia

CTA:

**Nueva solicitud**

CTA secundario:

**Ver módulo de vacaciones**

## 6.2 Tab Préstamos del empleado

Si tiene préstamos activos:

Mostrar cards:

- saldo total
- retención próxima
- préstamos activos
- fecha estimada de liquidación

Después lista de préstamos:

**PRE-101 · Préstamo empresa**

- Original: $18,000
- Saldo: $7,250
- Retención: $750 semanal
- Progreso: 14/24

CTA:

**Ver detalle**

Si no tiene préstamo:

Empty state profesional:

`Este colaborador no tiene préstamos o descuentos recurrentes activos.`

CTA:

**Registrar préstamo**

---

# 7. Integración con Pre-nómina

Préstamos y vacaciones no deben ser pantallas aisladas.

## Vacaciones

Si un empleado tiene vacaciones dentro del periodo:

- mostrar indicador en su fila;
- mostrar origen de incidencia;
- permitir abrir detalle;
- mostrar días/horas que impactan el ciclo.

## Préstamos

Agregar columna o concepto visible:

**Préstamos / descuentos recurrentes**

En drawer de cálculo:

`Préstamo PRE-101 · -$750.00`

Origen:

`Descuento recurrente programado · Ciclo SEM-2026-37`

No sumar/restar de forma fiscal perfecta si complica el demo; sí mantener los importes consistentes visualmente.

---

# 8. Integración con Ciclos

En `CiclosNominaTab` y/o preparación del ciclo mostrar:

- Vacaciones aplicables: `3 colaboradores`
- Préstamos a descontar: `7 colaboradores · $5,250.00`

Cada fila debe tener acción:

**Ver vacaciones**

**Ver préstamos**

Al navegar, mantener el ciclo activo.

---

# 9. Dashboard / Resumen principal de Nómina

Agregar bloque **RH que impacta este ciclo** con dos cards compactas:

### Vacaciones

- 3 empleados con vacaciones
- 1 solicitud pendiente
- 8 días aplicables al periodo

CTA: **Revisar vacaciones**

### Préstamos

- 7 empleados con descuento
- $5,250 a retener
- 1 préstamo pausado

CTA: **Revisar préstamos**

Esto hace que desde Resumen se entienda por qué estas funciones importan para Nómina.

---

# 10. Mocks maestros

Mover préstamos y vacaciones fuera de `RhBenefitsTab`.

Centralizarlos en `src/data/mockNominaData.ts` o en archivo dedicado coherente con el repo:

- `VacationBalance`
- `VacationRequest`
- `EmployeeLoan`
- `LoanPayment`

Evitar estado inicial generado con `employees.slice()` dentro de componentes.

Cada uno de los 30 empleados debe tener saldo de vacaciones demo coherente, aunque solo algunos tengan solicitudes.

Distribución sugerida:

- 30 empleados con saldo de vacaciones
- 6 con vacaciones disfrutadas recientes
- 4 con vacaciones programadas
- 3 solicitudes pendientes
- 8 con préstamos activos
- 1 préstamo pausado
- 2 próximos a liquidarse
- 1 préstamo liquidado histórico

Mantener consistencia con empleados existentes de RTM.

---

# 11. Auditoría

Toda acción relevante debe enviar entrada al `PayrollAuditDrawer` actual.

Eventos:

- nueva solicitud de vacaciones
- autorización
- rechazo
- cancelación
- préstamo registrado
- cambio de retención
- pausa/reanudación
- abono extraordinario
- liquidación

Ejemplo:

`07-sep 12:18 · Andrea Salazar Ruiz · Autorizó VAC-0051 · 3 días para Héctor Ramírez Luna.`

`07-sep 12:41 · Paola Jiménez Lara · Ajustó PRE-104 · Retención $500 → $750 · Motivo: convenio actualizado.`

---

# 12. Design System

Obligatorio respetar `docs/design-system.md`.

- no cards pastel gigantes;
- superficies del theme;
- semántica con borde/icono/dot;
- CTA con `bg-theme-primary`;
- usar `SemanticBadge`, `SemanticCard`, `SectionCard`, `SemanticAlert`, `ModalPortal` si ya aplican;
- dark mode / theme dinámico no deben romperse;
- tablas compactas y legibles;
- montos con fuente mono/tabular donde ya se use.

---

# 13. No hacer

- No crear backend.
- No crear API.
- No meter cálculo legal de vacaciones definitivo.
- No meter amortización financiera compleja.
- No duplicar `EmployeeDrawer`.
- No mantener `RhBenefitsTab` como wrapper innecesario después de separar las vistas, salvo que técnicamente tenga un propósito real.
- No crear otro sistema de navegación.
- No dejar botones muertos.
- No usar `alert()`.

---

# 14. Definition of Done

1. `Préstamos y vacaciones` ya NO aparece como tab combinada.
2. Existe tab principal `Vacaciones`.
3. Existe tab principal `Préstamos`.
4. Vacaciones tiene dashboard, saldos por empleado, solicitudes y detalle.
5. Préstamos tiene dashboard, cartera, progreso, detalle y plan de pagos.
6. `EmployeeDrawer` tiene tabs Vacaciones y Préstamos.
7. Desde el empleado se pueden ver saldos reales mock y préstamos relacionados.
8. Vacaciones autorizadas generan incidencia visual.
9. Préstamos aparecen como deducción/origen en pre-nómina.
10. Ciclo actual muestra resumen de vacaciones y préstamos aplicables.
11. Dashboard de Nómina tiene bloque RH que impacta el ciclo.
12. Auditoría registra las acciones nuevas.
13. Mocks están centralizados, no generados dentro del componente.
14. Todos los botones principales reaccionan.
15. `npm run build` pasa sin errores.
16. No se rompe navegación, theme ni módulos existentes.

---

# 15. Historia ideal para presentar el demo

1. Abrir **Vacaciones**.
2. Mostrar dashboard y saldos de los 30 empleados.
3. Abrir Héctor Ramírez Luna y enseñar ingreso, antigüedad, días asignados/disfrutados/programados/restantes.
4. Crear una solicitud de 3 días.
5. Autorizarla y mostrar cómo aparece en incidencias del ciclo.
6. Abrir **Préstamos**.
7. Mostrar cartera total y descuentos próximos.
8. Abrir un operador con PRE-101, enseñar saldo, 14/24 pagos y próximo descuento.
9. Ir al expediente del empleado y enseñar que Vacaciones y Préstamos viven dentro de su historial 360.
10. Ir a Pre-nómina y mostrar el préstamo como deducción y las vacaciones como incidencia origen.

La sensación final debe ser:

**“No solo calculamos nómina: administramos la relación laboral que impacta cada pago.”**
