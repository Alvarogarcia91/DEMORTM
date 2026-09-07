# RTM Demo — 4/5 Competencias & Capacitación de Planta

## Estado de la serie

Vamos en **4/5** del cierre de bloques enterprise del demo:

1. ✅ Trazabilidad 360
2. ✅ MRP / Planeación de Materiales
3. ✅ PPAP / Core Tools
4. **▶ Competencias & Capacitación de Planta**
5. ⏳ Audit Trail Global

---

# 1. Objetivo

Agregar dentro de **Nómina & RH** una experiencia visual para que RH, Producción y supervisores puedan responder preguntas humanas y operativas como:

- ¿Quién puede operar esta máquina hoy?
- ¿Quién está todavía en entrenamiento?
- ¿Qué habilidad le falta a un operador para cubrir otra línea?
- ¿Qué turno está demasiado dependiente de una sola persona?
- ¿Qué capacitaciones están próximas a vencer o requieren renovación interna?
- ¿Quién puede apoyar como respaldo si falta un operador?
- ¿Qué capacitación conviene programar primero?

No queremos construir un LMS genérico ni un módulo burocrático de recursos humanos.

La historia debe sentirse como **gestión de competencias de una planta de impresión**, conectada con las personas que ya existen en Nómina y con las máquinas/procesos que ya existen en Producción.

---

# 2. Punto de partida real del repo

Actualmente `NominaPage` ya administra el estado compartido de los empleados y cuenta con navegación para:

- Ciclos
- Resumen
- Personal
- Asistencia
- Incidencias
- Prenómina
- Timbrado
- Historial
- Vacaciones
- Préstamos

`mockNominaData.ts` ya contiene **30 empleados demo**, principalmente operativos, con:

- número de empleado
- nombre
- puesto
- departamento
- turno
- estatus
- fecha de ingreso
- información laboral/fiscal

Producción ya tiene un catálogo de máquinas y procesos para Offset, Flexografía y Acabados.

Por lo tanto:

> **NO crear un segundo catálogo de empleados ni un segundo catálogo de máquinas.**

El nuevo módulo debe relacionar esos datos existentes.

---

# 3. Dónde vive

No crear otro módulo en el sidebar.

Debe vivir dentro de:

`Nómina & RH → Competencias`

Agregar una nueva opción visible junto con la navegación actual de RH.

Nombre recomendado en UI:

**Competencias & Capacitación**

Subtítulo:

> Habilidades de planta, cobertura por turno y seguimiento de capacitación del personal.

Evitar wording técnico como:

- skill entities
- competency records
- resource matrix
- capability objects
- employee skill mapping

Esto lo utilizan personas.

---

# 4. Navegación interna

Dentro de Competencias usar cuatro vistas:

```text
[ Resumen ] [ Matriz de habilidades ] [ Cobertura de planta ] [ Capacitación ]
```

No hacer nueve tabs.

La experiencia debe ser compacta, clara y bonita.

---

# 5. Vista 1 — Resumen

Debe ser el dashboard principal.

## Header

```text
COMPETENCIAS & CAPACITACIÓN · RTM

Cobertura de habilidades de planta
Conoce quién está preparado para cada proceso y dónde conviene reforzar capacitación.

[ Toda la planta ] [ Turno 1 ] [ Turno 2 ] [ Mixto ]
[ Todas las áreas ▼ ]
```

## KPIs

Máximo 6 tarjetas:

- Personal operativo activo
- Personal autorizado en su proceso principal
- En entrenamiento
- Necesidades de capacitación abiertas
- Coberturas críticas por turno
- Renovaciones próximas

No saturar con números que no sirven.

---

# 6. Bloque protagonista — Cobertura que requiere atención

Inspirado visualmente en `Requiere tu atención` de otros módulos.

Ejemplos demo:

```text
COBERTURA QUE REQUIERE ATENCIÓN

🔴 Turno 2 · Mark Andy Scout 10”
Solo hay 1 operador autorizado disponible.
La ausencia de esa persona dejaría la máquina sin respaldo preparado.

[ Ver cobertura ]
```

```text
🟠 Offset · Heidelberg Speedmaster
2 operadores pueden ejecutar la impresión, pero solo 1 tiene autorización interna vigente para ajustes de arranque.

[ Ver equipo ]
```

```text
🟡 Calidad · Primera pieza Flexo
Hay 2 inspectores habilitados y uno tiene renovación de entrenamiento próxima.

[ Revisar capacitación ]
```

## Regla de wording

No decir:

> “recurso humano insuficiente”

Decir:

> “cobertura limitada”

No decir:

> “empleado no competente”

Decir:

> “en entrenamiento” o “aún no autorizado para esta actividad”.

---

# 7. Sugerencias del sistema — bloque morado

Este es obligatorio.

Visual:

- superficie blanca
- borde/acento morado
- `Sparkles`
- explicación breve
- CTA

Título:

**Sugerencias del sistema**

Ejemplos:

### Capacitación cruzada

> El Turno 2 depende de una sola persona autorizada para Mark Andy Scout 10”.
>
> Capacitar a un operador de Mark Andy 830 mejoraría la cobertura del turno.

`[ Ver candidatos ]`

### Respaldo de proceso

> Carlos Mendoza ya domina impresión flexográfica y tiene experiencia en máquinas de la misma familia. Puede ser candidato para entrenamiento de Scout 10”.

`[ Ver perfil ]` `[ Programar capacitación ]`

### Renovación próxima

> El entrenamiento interno de inspección de primera pieza de Jorge Márquez requiere revisión este mes.

`[ Revisar capacitación ]`

### Balance entre turnos

> Turno 1 concentra 60% del personal autorizado para rebobinado. Turno 2 tiene cobertura limitada.

`[ Comparar turnos ]`

No utilizar la palabra “IA” si son reglas del demo.

---

# 8. Vista 2 — Matriz de habilidades

Esta debe ser visualmente impresionante pero fácil de leer.

## Estructura

Filas = personas.

Columnas = habilidades/procesos relevantes.

Ejemplo:

```text
                    Mark Andy   Scout    Rotoflex   Ajuste    Primera pieza
Carlos Mendoza         ●          ◐         ○          ●            ○
María Ríos             ●          ●         ◐          ●            ○
Jorge Pérez            ◐          ○         ○          ◐            ○
```

## Leyenda humana

- **Autorizado** — puede realizar la actividad de manera autónoma.
- **Competente** — domina la actividad; autorización interna según proceso.
- **En entrenamiento** — capacitación en curso.
- **Sin entrenamiento registrado** — todavía no se ha preparado para esa actividad.
- **Instructor** — puede acompañar/capacitar a otros.

Colores deben ser semánticos pero sobrios.

No llenar las celdas con texto.

Al hover/click mostrar tooltip:

```text
Mark Andy Scout 10”
Autorizado
Última evaluación: 18 Jul 2026
Responsable: Supervisor Flexografía
```

## Filtros

- Área
- Turno
- Estado de habilidad
- Buscar empleado

CTA:

`[ Ver perfil ]`

---

# 9. Perfil de competencias del empleado

Al abrir una persona usar drawer/modal premium, no otra página perdida.

Header:

```text
RTM-001 · Carlos Mendoza Ruiz
Operador Mark Andy 830 7”
Flexografía · Turno 1

Cobertura principal: Flexografía
```

Tabs:

```text
[ Resumen ] [ Habilidades ] [ Capacitación ] [ Historial ]
```

## Resumen

Mostrar:

- proceso principal
- máquinas autorizadas
- procesos donde puede apoyar
- entrenamientos en curso
- próxima renovación/revisión
- instructor asignado

## Habilidades

Cards pequeñas:

```text
Mark Andy 830 7”
AUTORIZADO

Última evaluación: 12 Ago
Experiencia interna demo: 18 meses
```

```text
Mark Andy Scout 10”
EN ENTRENAMIENTO

Avance: 2 de 4 actividades
Instructor: María Ríos
```

No usar porcentajes falsos de habilidad tipo `83% competente`.

---

# 10. Vista 3 — Cobertura de Planta

Esta vista responde:

> “Tengo una máquina/proceso. ¿Quién puede cubrirla?”

## Cards por máquina/proceso

Ejemplo:

```text
MARK ANDY SCOUT 10”
Flexografía

Turno 1       3 autorizados   ✓ Cobertura suficiente
Turno 2       1 autorizado    ⚠ Cobertura limitada
Mixto         1 competente

[ Ver personal disponible ]
```

Otro:

```text
HEIDELBERG SPEEDMASTER
Offset

Turno 1       2 autorizados
Turno 2       2 autorizados
Mixto         1 instructor

✓ Respaldo disponible en ambos turnos
```

## Detalle de cobertura

Al abrir:

- operadores autorizados
- personas competentes
- personas en entrenamiento
- instructor(es)
- ausencias demo si puede derivarse de estado del empleado
- sugerencia de capacitación

### Importante

No inventar disponibilidad horaria precisa si el sistema no la tiene.

Puede decir:

> “Según turno y estatus actual del personal”.

No decir:

> “Disponible en este minuto”.

---

# 11. Vista 4 — Capacitación

Debe sentirse como un calendario/plan de desarrollo de planta, no como escuela online.

Tres bloques:

### Pendientes

```text
CAP-2026-018
Operación Mark Andy Scout 10”
Carlos Mendoza
Instructor: María Ríos
Estado: En curso
Próxima actividad: Práctica supervisada
```

### Próximas revisiones

Mostrar entrenamientos que necesitan revisión interna.

### Completadas recientemente

Historial de capacitaciones terminadas.

---

# 12. Flujo — Programar capacitación

CTA desde sugerencias, empleado o máquina:

`Programar capacitación`

Modal sencillo:

```text
Nueva capacitación

Persona            Carlos Mendoza Ruiz
Área               Flexografía
Habilidad           Mark Andy Scout 10”
Instructor          María Ríos
Objetivo             Operación autónoma
Fecha estimada       14 Sep 2026

Actividades
✓ Seguridad y preparación
○ Setup supervisado
○ Corrida supervisada
○ Evaluación práctica

Notas
[________________________________]

[ Cancelar ] [ Programar capacitación ]
```

Al guardar:

- agregar capacitación al estado local
- persona queda `En entrenamiento` para esa habilidad
- agregar evento al historial
- toast

No backend fake.

---

# 13. Flujo — Completar capacitación

Desde un entrenamiento:

`Registrar avance`

Permitir marcar actividades.

Cuando todas estén completas:

```text
Capacitación completada

Resultado:
[ Competente ] [ Autorizado ]

Evaluado por:
Supervisor / Instructor

Observaciones:
[________________________________]

[ Guardar resultado ]
```

Evitar aprobar automáticamente a alguien solo porque terminó un checklist.

Debe quedar explícito que el resultado lo registra una persona responsable.

---

# 14. Niveles de habilidad demo

Usar este catálogo humano:

```ts
type CompetencyLevel =
  | 'Sin entrenamiento registrado'
  | 'En entrenamiento'
  | 'Competente'
  | 'Autorizado'
  | 'Instructor';
```

Semántica:

- Sin entrenamiento registrado: gris
- En entrenamiento: ámbar
- Competente: azul o theme primary sutil
- Autorizado: verde
- Instructor: morado

No usar rojos para personas salvo alertas de cobertura/vencimiento, porque no queremos etiquetar al empleado como “malo”.

---

# 15. Datos demo

Crear un archivo dedicado, por ejemplo:

`src/data/mockCompetenciasData.ts`

Debe referenciar `Employee.id` y nombres/códigos de máquinas existentes.

No duplicar datos completos del empleado.

## Volumen recomendado

Sobre los 30 empleados actuales:

- 18–22 con habilidades operativas detalladas
- mayoría Producción
- algunos Calidad, Mantenimiento y Almacén
- 8–12 capacitaciones
- 3–5 coberturas que requieran atención

Debe sentirse realista pero no exagerado.

---

# 16. Habilidades sugeridas para demo

Usar procesos/máquinas que ya existen en RTM demo.

## Flexografía

- Mark Andy 830 7”
- Mark Andy 830 10”
- Mark Andy Scout 10”
- Mark Andy 4120 17”
- Allied Gear
- Rotoflex I
- BGM 2
- Setup Flexografía
- Cambio de bobina
- Ajuste de registro

## Offset

- Heidelberg Speedmaster
- Conserver
- Ryobi
- Preparación Offset
- Ajuste de registro
- Paginación / validación de forma

## Acabados

- Guillotina
- Stahl
- Muller Martini
- Doblado
- Grapado / alzado

## Calidad

- Primera pieza Flexo
- Primera pieza Offset
- Auditoría final
- Muestreo / baches
- Incoming

## Almacén

- Recepción
- Putaway
- Surtido a Producción
- Manejo de remanentes

No es obligatorio cubrirlas todas si la UI se vuelve pesada.

---

# 17. Integración con Producción

Esta es una parte que puede vender mucho el demo.

## Desde detalle de máquina / planeación

Cuando sea posible mostrar:

```text
Personal preparado para esta máquina
3 autorizados · 1 en entrenamiento
[ Ver cobertura ]
```

## Desde una OP

En operador asignado, si es posible mostrar una pequeña señal:

`✓ Autorizado para esta máquina`

Si el operador demo no tiene autorización:

`⚠ Capacitación no registrada para esta máquina`

Pero **NO bloquear una OP existente** en esta fase si eso puede romper Producción.

Primero hacerlo informativo.

---

# 18. Integración con Calidad

Puede utilizarse para procesos de QA:

```text
Primera pieza Flexo
Inspectores autorizados: 2
1 renovación próxima
```

Si una auditoría muestra auditor asignado y existe competencia:

`✓ Habilitado para Primera Pieza Flexo`

Esto debe ser sutil, no llenar Calidad de badges.

---

# 19. Analítica ligera

No crear una Analítica separada enorme.

En Resumen basta con:

- cobertura por área
- cobertura por turno
- personas en entrenamiento
- habilidades con menor respaldo
- capacitaciones completadas por mes

Visuales recomendados:

- barras horizontales
- heatmap pequeño área × turno
- ranking de habilidades con menor cobertura

Nada de 15 gráficas.

---

# 20. Wording obligatorio

Preferir:

- `Personal preparado`
- `Autorizado para operar`
- `En entrenamiento`
- `Cobertura limitada`
- `Necesita respaldo adicional`
- `Próxima revisión`
- `Capacitación programada`
- `Instructor`
- `Evaluación práctica`

Evitar:

- `Recurso no apto`
- `Empleado incompetente`
- `Skill object`
- `Certification record`
- `Capability status`
- `Resource shortage`
- `Operador inválido`

El sistema habla con personas de planta.

---

# 21. Diseño visual

Este módulo debe quedar **hermoso**, no como un CRUD de RH.

Referencias directas del repo:

1. `Inventario/DashboardTab.tsx`
2. `Inventario/AnalyticsTab.tsx`
3. `Compras/Requisiciones/RequisicionesDashboard.tsx`
4. CRM enterprise
5. Piso QA
6. `docs/design-system.md`

## Reglas

- `max-w-[1520px]`
- cards `rounded-3xl`
- superficies claras
- bordes sutiles
- números en mono cuando aplique
- semantic color solo en estados
- espacios generosos
- no pastel saturado
- no tablas grises estilo ERP viejo
- responsive real

La matriz sí puede usar estructura tabular, pero debe sentirse moderna.

---

# 22. Arquitectura sugerida

```text
src/components/Nomina/Competencias/
├── CompetenciasWorkspace.tsx
├── CompetenciasDashboard.tsx
├── SkillsMatrix.tsx
├── PlantCoverage.tsx
├── TrainingWorkspace.tsx
├── EmployeeCompetencyDrawer.tsx
├── TrainingFormModal.tsx
├── TrainingProgressModal.tsx
└── SystemTrainingSuggestions.tsx

src/data/mockCompetenciasData.ts
```

No es obligatorio copiar exactamente estos nombres si el repo pide otra estructura.

---

# 23. Flujo demo de 3 minutos

1. Entrar a `Nómina & RH → Competencias`.
2. Mostrar que Turno 2 tiene cobertura limitada en Mark Andy Scout.
3. Abrir `Sugerencias del sistema`.
4. Seleccionar candidato para capacitación cruzada.
5. Abrir perfil del operador.
6. Mostrar habilidades autorizadas y entrenamiento de Scout.
7. Programar capacitación.
8. Ir a Cobertura de Planta y mostrar cómo se vería el respaldo futuro.
9. Abrir matriz para demostrar visión global de la planta.

Mensaje comercial:

> “No solo sabemos quién trabaja hoy. También podemos saber quién está preparado para cada proceso y dónde conviene formar respaldo antes de que una ausencia se convierta en un problema de producción.”

---

# 24. P0

1. Nueva tab `Competencias` dentro de Nómina/RH.
2. Dashboard premium.
3. Matriz de habilidades.
4. Cobertura por máquina/proceso y turno.
5. Perfil de competencias por empleado.
6. Capacitación: programar + registrar avance.
7. Sugerencias del sistema moradas.
8. Datos ligados a empleados y máquinas existentes.
9. Wording humano.
10. Responsive.

---

# 25. P1

- Indicadores sutiles desde Producción.
- Indicadores sutiles desde Calidad.
- filtros más ricos.
- historial de evaluaciones.
- detalle de instructor.

---

# 26. No hacer

- no crear empleados duplicados
- no crear máquinas duplicadas
- no crear sidebar nuevo
- no convertirlo en LMS genérico
- no crear certificados legales falsos
- no decir que una autorización demo sustituye requisitos legales/seguridad
- no bloquear Producción de forma agresiva en esta fase
- no llenar la UI con scores arbitrarios
- no usar términos deshumanizantes
- no botones muertos

---

# 27. Criterio de terminado

El bloque está listo cuando durante la demo se puede demostrar coherentemente:

```text
Empleado RTM
    ↓
Habilidades registradas
    ↓
Máquinas / procesos que puede cubrir
    ↓
Cobertura por turno
    ↓
Necesidad detectada
    ↓
Capacitación programada
    ↓
Avance
    ↓
Evaluación humana
    ↓
Competente / Autorizado
```

Y todo se siente como una sola plataforma RTM, no como una pantalla adicional pegada al ERP.
