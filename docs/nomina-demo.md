# Impresos RTM — Módulo de Nómina (Demo)

## 1. Objetivo

Construir un módulo de **Nómina + Asistencia + Timbrado** visualmente fuerte, creíble para una empresa manufacturera mexicana y claramente conectado con la operación de RTM.

El demo debe contar una historia completa:

**Checadas → incidencias → validación → pre-nómina → autorización → cierre → timbrado CFDI → recibos / dispersión**

No se implementará backend, PAC real, cálculo fiscal real, SAT real, banca real ni integración real con reloj checador. Todo debe operar con mocks frontend coherentes y feedback visual profesional.

El objetivo no es clonar CONTPAQi Nóminas, Aspel NOI o Microsip, sino tomar los conceptos maduros que un usuario mexicano espera ver en un ERP serio y aterrizarlos a RTM.

---

## 2. Contexto confirmado de RTM

Fuente principal: reunión de exploración Nexora / Impresos RTM del 10-jul-2026.

RTM comentó que:

- actualmente lleva nómina en un sistema separado tipo Compaq / CONTPAQi;
- obtiene asistencias desde reloj y después pasa la información al sistema de nómina;
- maneja reglas de horas particulares y no está satisfecha con la rigidez del sistema actual;
- existen casos donde un permiso puede ser sin goce y posteriormente el colaborador repone horas;
- desea integrar RH, operación y administración en una misma plataforma;
- la empresa tiene aproximadamente 100–120 colaboradores y la mayoría son operativos;
- producción ya registra operador, máquina, fecha y horas en reportes físicos, por lo que en el futuro se puede conciliar asistencia contra actividad real de piso.

Para este demo se mostrará una **muestra representativa de 30 empleados**, no la plantilla real completa.

IMPORTANTE: las reglas especiales de horas de RTM son reglas de negocio demo. No presentarlas como interpretación legal. El cálculo fiscal/laboral real se validaría durante implementación.

---

# 3. Navegación

Agregar módulo principal:

## NÓMINA

Subvistas sugeridas:

1. **Resumen**
2. **Personal**
3. **Asistencia**
4. **Incidencias**
5. **Pre-nómina**
6. **Timbrado CFDI**
7. **Historial**

No saturar el sidebar con demasiados subitems si el layout actual trabaja mejor con tabs internas. Antigravity debe auditar primero la navegación existente y reutilizar el patrón real del repo.

---

# 4. Concepto visual principal: “Asistente de cierre de nómina”

En la parte superior del módulo mostrar un stepper compacto de 5 pasos:

1. **Checadas**
2. **Incidencias**
3. **Pre-nómina**
4. **Autorización**
5. **Timbrado**

Cada paso debe mostrar estado:

- Completo
- Requiere atención
- Pendiente
- Cerrado

Ejemplo del periodo demo:

**Nómina semanal · 31 ago – 06 sep 2026 · Planta Reynosa**

Estado general:

`3 incidencias requieren revisión antes de cerrar la nómina`

La idea es que el usuario entienda inmediatamente qué falta para poder timbrar.

---

# 5. Dashboard / Resumen

## 5.1 KPIs

Mostrar KPIs útiles, no decorativos:

- Empleados en periodo
- Nómina neta estimada
- Horas extra
- Incidencias abiertas
- Empleados listos para timbrar
- CFDI timbrados

Ejemplo demo:

- 30 empleados
- $128,460.35 neto estimado
- 41.5 h extra
- 5 incidencias
- 27 listos para timbrar
- 0/30 timbrados al inicio

## 5.2 Centro de atención

Tarjeta amplia “Requiere tu atención” con filas clicables:

- 2 empleados con checada incompleta
- 1 permiso pendiente de autorizar
- 1 diferencia entre horas de asistencia y horas reportadas en producción
- 1 empleado con dato fiscal pendiente de validar

Cada fila debe llevar al detalle correspondiente.

## 5.3 Visualizaciones

Agregar visualizaciones ligeras con datos mock:

- Costo de nómina por departamento
- Horas extra por área
- Incidencias por tipo
- Tendencia de costo de últimas 8 semanas

No instalar una librería pesada si el repo ya resuelve gráficas con CSS/SVG. Si es necesario usar una librería, justificarla y mantener el bundle razonable.

---

# 6. Personal

## 6.1 Toolbar

Acciones visibles:

- **Nuevo empleado**
- **Descargar plantilla**
- **Importar plantilla**
- **Exportar empleados**

Como es demo:

### Descargar plantilla
No necesita generar un Excel real. Mostrar toast/banner:

`Plantilla de empleados descargada correctamente`

Opcional: simular nombre de archivo:

`RTM_Plantilla_Empleados_2026.xlsx`

### Importar plantilla
Abrir modal profesional con drag & drop falso:

- Descargar formato
- Arrastra aquí tu archivo .xlsx
- Validaciones a realizar
- Vista previa de 5 registros

Al confirmar:

`Importación completada · 30 registros procesados · 30 correctos · 0 rechazados`

No persistir archivos reales.

## 6.2 Tabla de empleados

Columnas:

- No. empleado
- Nombre
- Puesto
- Departamento
- Turno
- Tipo de nómina
- Estatus
- Estado fiscal
- Acción

Filtros:

- Buscar por nombre / número
- Departamento
- Puesto
- Turno
- Tipo de nómina
- Estatus

## 6.3 Perfil de empleado

Abrir drawer o modal amplio con tabs:

1. General
2. Laboral
3. Fiscal
4. Asistencia
5. Nómina
6. Historial

Campos demo:

- No. empleado
- Nombre
- Puesto
- Departamento
- Fecha de ingreso
- Turno
- Tipo de nómina
- Salario diario
- Cuenta / banco mock
- RFC mock
- CURP mock
- NSS mock
- Código postal fiscal mock
- Régimen / tipo de contrato demo

Nunca usar RFC/CURP/NSS de personas reales. Generar valores claramente mock.

---

# 7. Seed de 30 empleados demo

Todos los nombres y datos son ficticios.

| ID | Nombre | Puesto | Departamento | Turno | Nómina |
|---|---|---|---|---|---|
| RTM-001 | Carlos Mendoza Ruiz | Operador Mark Andy 830 7” | Flexografía | 1 | Semanal |
| RTM-002 | José Luis Herrera Soto | Operador Mark Andy 830 10” | Flexografía | 1 | Semanal |
| RTM-003 | Miguel Ángel Treviño | Operador Mark Andy Scout | Flexografía | 2 | Semanal |
| RTM-004 | Ricardo Salinas Garza | Operador Mark Andy 4120 | Flexografía | 2 | Semanal |
| RTM-005 | Jesús Alberto Peña | Operador BGM | Flexografía | 1 | Semanal |
| RTM-006 | Juan Pablo Castillo | Operador BGM | Flexografía | 2 | Semanal |
| RTM-007 | Héctor Ramírez Luna | Operador Rotoflex | Flexografía | 1 | Semanal |
| RTM-008 | Eduardo Villarreal Cruz | Ayudante de Flexografía | Flexografía | 2 | Semanal |
| RTM-009 | Martín González Leal | Operador Conserver C1 | Offset | 1 | Semanal |
| RTM-010 | Jorge Alberto Flores | Operador Conserver C4 | Offset | 1 | Semanal |
| RTM-011 | Óscar Daniel Rocha | Operador DiDDE 860 | Offset | 2 | Semanal |
| RTM-012 | Luis Fernando Meza | Operador Conserver C8 | Offset | 2 | Semanal |
| RTM-013 | Andrés Escobedo Vela | Operador Ryobi | Offset | 1 | Semanal |
| RTM-014 | Mario Hernández Silva | Operador Heidelberg | Offset | 1 | Semanal |
| RTM-015 | Raúl Martínez Cantú | Ayudante de Prensa | Offset | 2 | Semanal |
| RTM-016 | Sergio Zamora Reyes | Operador Guillotina | Acabado | 1 | Semanal |
| RTM-017 | Ernesto Aguilar Mora | Operador Dobladora | Acabado | 1 | Semanal |
| RTM-018 | Pedro Garza Ríos | Operador Muller Martini | Acabado | 2 | Semanal |
| RTM-019 | Víctor Manuel Lozano | Operador Jianguo | Acabado | 2 | Semanal |
| RTM-020 | Daniel Cárdenas Ortiz | Ayudante de Acabado | Acabado | 1 | Semanal |
| RTM-021 | Marco Antonio Tovar | Operador de Serigrafía | Serigrafía | 1 | Semanal |
| RTM-022 | Alan Rodríguez Soto | Operador Lawson Screen | Serigrafía | 1 | Semanal |
| RTM-023 | Alberto Navarro Díaz | Montacarguista / Almacén | Almacén | 1 | Semanal |
| RTM-024 | Fernando Rangel Ibarra | Técnico de Mantenimiento | Mantenimiento | Mixto | Semanal |
| RTM-025 | Gabriela Torres Lozano | Auditora de Calidad | Calidad | 1 | Quincenal |
| RTM-026 | Daniela Flores Garza | Auditora de Calidad | Calidad | 2 | Quincenal |
| RTM-027 | Iván Morales Cantú | Planeador de Producción | Planeación | Administrativo | Quincenal |
| RTM-028 | Roberto Castillo Peña | Supervisor de Producción | Manufactura | Mixto | Quincenal |
| RTM-029 | Andrea Salazar Ruiz | Analista de Recursos Humanos | RH | Administrativo | Quincenal |
| RTM-030 | Paola Jiménez Lara | Analista de Nómina | RH | Administrativo | Quincenal |

Mayoría operativa intencional: **24 de 30** perfiles están directamente ligados a piso, almacén o mantenimiento.

---

# 8. Asistencia

## 8.1 Vista principal

Vista semanal tipo matriz:

`Empleado | Lun | Mar | Mié | Jue | Vie | Sáb | Horas | Incidencias | Estado`

Cada celda puede mostrar:

- entrada / salida
- horas trabajadas
- indicador de retardo
- falta
- permiso
- vacaciones
- incapacidad
- checada incompleta

Ejemplo:

`07:29 → 16:31 · 8:02 h`

## 8.2 Toolbar de asistencia

Acciones:

- **Importar checadas**
- **Descargar plantilla**
- **Recalcular semana**
- **Exportar asistencia**

### Importar checadas
Modal fake con:

- Reloj checador / archivo Excel / CSV
- fecha desde / hasta
- arrastrar archivo
- preview
- validaciones

Resultado simulado:

`1,284 checadas procesadas · 1,279 válidas · 5 requieren revisión`

### Recalcular semana
Simular procesamiento de 1–2 segundos y mostrar:

`Asistencia recalculada · 30 empleados · 5 incidencias detectadas`

## 8.3 Detalle diario

Drawer con línea de tiempo:

- 07:29 Entrada
- 12:35 Salida comida
- 13:05 Regreso
- 16:31 Salida

Resumen:

- Jornada programada
- Horas reloj
- Horas ordinarias
- Horas adicionales
- Incidencia aplicada

---

# 9. Conciliación RTM: Asistencia vs Producción

Este es un diferenciador importante del demo.

Crear una sección / drawer llamado:

## Conciliación de horas

Comparar, de manera mock:

- horas registradas por reloj;
- horas capturadas en reportes de producción;
- máquina / orden de producción relacionada;
- diferencia.

Ejemplo:

**Carlos Mendoza Ruiz**

- Reloj: 8.25 h
- Producción: 7.90 h
- Diferencia: 0.35 h
- Actividad: Setup Mark Andy 830 + OP-95842
- Estado: Dentro de tolerancia

Otro caso:

**Miguel Ángel Treviño**

- Reloj: 9.10 h
- Producción: 6.75 h
- Diferencia: 2.35 h
- Estado: Revisar

Mostrar banner:

`Diferencia superior a la tolerancia configurada. Verifica paro, capacitación, tiempo no productivo o captura faltante.`

No convertir automáticamente esta diferencia en descuento de nómina. Solo es una validación operativa.

---

# 10. Incidencias

## 10.1 Tipos demo

- Falta
- Retardo
- Hora adicional / hora extra
- Permiso con goce
- Permiso sin goce
- Permiso con reposición de horas
- Vacaciones
- Incapacidad
- Bono
- Descuento autorizado
- Ajuste manual
- Checada incompleta

## 10.2 Regla particular RTM

Incluir concepto visible:

**Permiso con reposición**

Ejemplo:

`Permiso: 2.0 h · Sin pago inmediato · Reposición programada: 09-sep · Saldo por reponer: 2.0 h`

La reposición debe poder verse como mini historial:

- 04-sep: permiso 2.0 h
- 09-sep: repuso 1.0 h
- 10-sep: repuso 1.0 h
- saldo: 0 h

Esto es visual/demo; no construir un motor laboral real.

## 10.3 Flujo de autorización

Estados:

- Detectada
- Pendiente de revisión
- Autorizada
- Rechazada
- Aplicada a nómina

Al autorizar mostrar quién autorizó y timestamp mock.

---

# 11. Datos interesantes del periodo demo

Configurar al menos estos casos entre los 30 empleados para que el módulo se sienta vivo:

- 19 empleados sin incidencias
- 3 con horas adicionales
- 2 con retardos
- 1 con permiso con reposición
- 1 de vacaciones
- 1 con incapacidad
- 1 con checada de salida faltante
- 1 con diferencia reloj vs producción
- 1 con dato fiscal pendiente de validar

Los mismos empleados pueden compartir más de una situación si hace falta, pero mantener el escenario fácil de explicar en demo.

---

# 12. Pre-nómina

Esta debe ser una de las mejores vistas del módulo.

## 12.1 Tabla

Columnas:

- Empleado
- Departamento
- Días
- Horas ordinarias
- Horas adicionales
- Percepciones
- Deducciones
- ISR mock
- IMSS mock
- Neto
- Validaciones
- Estado

Valores monetarios deben verse realistas y coherentes entre sí, pero son demo.

## 12.2 Panel de validaciones automáticas

Mostrar un resumen arriba:

- 27 listos
- 2 requieren revisión
- 1 bloqueado

Validaciones demo:

- Checadas completas
- Incidencias autorizadas
- Neto no negativo
- Datos fiscales completos
- Cuenta bancaria presente
- Periodo correcto

No llamar “IA” a esto. Son validaciones automáticas basadas en reglas.

## 12.3 Detalle de cálculo

Al abrir empleado:

### Percepciones
- Sueldo
- Horas adicionales
- Bono puntualidad
- Prima / concepto demo si aplica

### Deducciones
- ISR mock
- IMSS mock
- Falta / permiso sin goce demo
- Otros ajustes

Agregar explicación de origen:

`Hora adicional · 03-sep · 1.5 h · autorizó Supervisor de Producción`

## 12.4 Acciones

- **Descargar plantilla de pre-nómina**
- **Importar ajustes**
- **Exportar pre-nómina**
- **Validar pre-nómina**
- **Enviar a autorización**

Todas las acciones de archivos pueden ser simuladas con modal + toast.

---

# 13. Cierre y autorización

Usar estados claros:

**Borrador → En revisión → Autorizada → Cerrada → Timbrada**

Al cerrar nómina:

Modal de confirmación:

`Estás por cerrar la nómina semanal 31 ago – 06 sep 2026.`

Checklist:

- 30 empleados incluidos
- 30 asistencias revisadas
- 5 incidencias resueltas
- 30 cálculos validados
- 30 datos fiscales completos

CTA:

**Cerrar nómina**

Después del cierre mostrar icono de candado y leyenda:

`Nómina cerrada. Los cambios posteriores requieren reapertura y quedarán registrados en el historial.`

Crear acción demo **Solicitar reapertura** con motivo obligatorio.

---

# 14. Timbrado CFDI

## 14.1 Centro de timbrado

Vista tipo consola administrativa limpia.

KPIs:

- Pendientes
- Timbrados
- Con error
- Cancelados

Tabla:

- Empleado
- RFC mock
- Neto
- Estado fiscal
- Estado CFDI
- UUID mock
- Fecha de timbrado
- Acción

## 14.2 Botón principal

**Timbrar nómina**

Al hacer clic:

1. abrir modal de resumen;
2. mostrar “Conexión con PAC” como simulación;
3. ejecutar barra de progreso breve;
4. actualizar estados de tabla.

Escenario inicial sugerido:

- 30 empleados
- 28 timbrados correctamente
- 2 con error

Errores demo:

- Código postal fiscal pendiente
- RFC / datos fiscales requieren validación

Botones:

- Reintentar pendientes
- Ver detalle
- Descargar XML
- Descargar PDF
- Descargar recibos ZIP

Todo simulado.

Toast final:

`Timbrado demo completado · 28 correctos · 2 requieren atención`

Después de corregir los 2 errores y reintentar:

`30 de 30 CFDI timbrados correctamente`

## 14.3 Recibo individual

Modal visual de recibo con:

- empleado
- periodo
- percepciones
- deducciones
- neto
- UUID mock
- fecha de timbrado
- sello / QR puramente visual demo

No intentar generar CFDI válido.

---

# 15. Dispersión y entregables

Agregar sección compacta posterior al timbrado:

## Preparar pago

Acciones:

- **Generar layout bancario**
- **Exportar resumen contable**
- **Descargar recibos ZIP**
- **Enviar recibos**

Son acciones visuales demo.

Mensajes:

`Layout bancario generado · 30 empleados · $128,460.35`

`Resumen contable exportado correctamente`

`30 recibos preparados para envío`

---

# 16. Historial de nóminas

Tabla de periodos:

- Periodo
- Tipo
- Empleados
- Percepciones
- Deducciones
- Neto
- Estado
- Fecha de cierre
- Fecha de timbrado

Ejemplos:

- Semanal 24–30 ago 2026 · Timbrada
- Semanal 17–23 ago 2026 · Timbrada
- Semanal 10–16 ago 2026 · Timbrada
- Quincenal 16–31 ago 2026 · Timbrada

Detalle de periodo con tabs:

- Resumen
- Empleados
- Incidencias
- Timbrado
- Historial de cambios

---

# 17. Auditoría y trazabilidad

RTM ha pedido trazabilidad fuerte en otros módulos por su trabajo de calidad/IATF. Nómina debe seguir el mismo lenguaje del producto.

Registrar de forma mock:

- quién creó una incidencia;
- quién la autorizó;
- quién modificó un cálculo;
- valor anterior / valor nuevo;
- motivo;
- fecha y hora;
- cierre / reapertura del periodo;
- timbrado / reintento / cancelación demo.

Crear un drawer **Historial de cambios**.

Ejemplo:

`06-sep 14:32 · Paola Jiménez · Ajustó incidencia de 1.0 h a 1.5 h · Motivo: corrección de captura autorizada por supervisor.`

---

# 18. UX de archivos e interacciones falsas

El módulo es demo, pero no debe sentirse muerto.

Todas estas acciones deben reaccionar:

- Descargar plantilla
- Importar plantilla
- Exportar empleados
- Importar checadas
- Descargar plantilla de checadas
- Recalcular asistencia
- Exportar asistencia
- Descargar plantilla de incidencias
- Importar incidencias
- Exportar pre-nómina
- Importar ajustes
- Generar layout bancario
- Descargar XML
- Descargar PDF
- Descargar recibos ZIP
- Enviar recibos
- Timbrar nómina
- Reintentar timbrado

Patrón recomendado:

1. botón clickeable;
2. loading de 300–900 ms;
3. toast/banner claro;
4. opcionalmente modal con resultado;
5. actualizar estado local cuando mejore la narrativa del demo.

Nunca dejar botones “muertos”.

---

# 19. Design system obligatorio

Respetar `docs/design-system.md`.

Reglas:

- superficies blancas / theme surface;
- texto oscuro y legible;
- semántica en borde, icono y dot;
- evitar cards pastel saturadas;
- CTA primario usa theme dinámico;
- badges con fondo blanco + borde semántico;
- reutilizar primitives existentes en `src/components/common` cuando existan;
- mantener compatibilidad con dark mode y selector de tema existente;
- no crear un segundo sistema visual dentro del ERP.

La nómina debe sentirse como parte del mismo producto, no como una landing separada.

---

# 20. Arquitectura frontend esperada

Antes de escribir código, auditar el repo y aprovechar patrones existentes.

Sugerencia, no obligación si la arquitectura real ya tiene otra convención:

```text
src/
  components/
    payroll/
      PayrollDashboard.tsx
      EmployeesTable.tsx
      EmployeeDrawer.tsx
      AttendanceGrid.tsx
      AttendanceDetailDrawer.tsx
      IncidentCenter.tsx
      PayrollReviewTable.tsx
      PayrollCloseStepper.tsx
      StampCenter.tsx
      PayrollHistory.tsx
  data/
    payrollMock.ts
  utils/
    payrollDemo.ts
```

Centralizar mocks y helpers; no hardcodear los mismos empleados en múltiples componentes.

---

# 21. Restricciones del demo

NO implementar:

- backend;
- base de datos;
- PAC real;
- SAT real;
- CSD real;
- CFDI fiscalmente válido;
- cálculo legal real de ISR/IMSS;
- conexión bancaria;
- envío real de correo;
- reloj checador real;
- biométricos;
- SUA/IDSE reales;
- subida persistente de Excel.

Sí implementar:

- interacción visual completa;
- datos mock consistentes;
- cambios de estado locales;
- filtros;
- tablas;
- modales/drawers;
- banners/toasts;
- stepper de cierre;
- simulación creíble de importación/exportación/timbrado.

---

# 22. Definition of Done

El módulo se considera listo para demo cuando:

1. Nómina aparece integrada a la navegación real del ERP.
2. Existen 30 empleados mock con mayoría operativa y puestos coherentes con RTM.
3. Dashboard tiene KPIs, atención requerida y visualizaciones.
4. Personal permite buscar, filtrar y abrir detalle.
5. Asistencia muestra matriz semanal usable.
6. Importar checadas funciona visualmente.
7. Existen incidencias variadas, incluyendo permiso con reposición.
8. Existe conciliación reloj vs producción.
9. Pre-nómina permite abrir detalle por empleado y validar el periodo.
10. Existe flujo Borrador → Revisión → Autorizada → Cerrada → Timbrada.
11. Timbrado demo empieza con errores parciales y termina 30/30 después de reintentar.
12. Descargas/importaciones principales responden con feedback visual.
13. Historial de cambios muestra trazabilidad.
14. Build TypeScript/Vite pasa sin errores.
15. No se rompe ningún módulo existente.
16. El diseño respeta `docs/design-system.md` y el theme actual.

---

# 23. Historia recomendada para presentar el demo

1. Entrar a **Nómina > Resumen** y mostrar que hay 5 temas por revisar.
2. Abrir **Asistencia**, importar checadas y mostrar la matriz semanal.
3. Enseñar una checada incompleta y una diferencia reloj vs producción.
4. Abrir **Incidencias** y enseñar el caso de permiso con reposición.
5. Entrar a **Pre-nómina**, mostrar 27 listos y 3 por revisar.
6. Resolver los pendientes y cerrar la nómina.
7. Entrar a **Timbrado CFDI** y ejecutar timbrado demo.
8. Mostrar 28 correctos / 2 errores.
9. Corregir visualmente los 2 errores y reintentar.
10. Terminar con **30/30 timbrados**, descargar recibos ZIP y generar layout bancario.

La sensación final debe ser: **RTM pasa de reloj + Excel + sistema separado a un flujo controlado, trazable y conectado con la operación de planta.**
