# 3/5 — PPAP / Core Tools · Demo RTM

## Objetivo
Agregar a Calidad una experiencia visual y entendible para dar seguimiento a expedientes de aprobación de parte de producción (PPAP) y a los elementos principales de Core Tools, sin convertir el demo en una pantalla técnica difícil de leer.

La intención del demo es que cualquier persona de Calidad, Producción o Dirección entienda rápidamente:

- qué parte está en proceso de aprobación,
- con qué cliente,
- qué revisión aplica,
- qué documentos/evidencias ya están completos,
- qué falta,
- quién es responsable,
- qué está bloqueando la aprobación,
- y si el expediente está listo para enviar/cerrar.

## Principio clave de UX y wording
Este módulo es para humanos, no para backend.

Evitar etiquetas frías o técnicas cuando una frase humana explica mejor la acción.

Preferir:
- `Listo para revisión`
- `Pendiente de evidencia`
- `Requiere actualización`
- `En revisión con Calidad`
- `Aprobación del cliente pendiente`
- `Expediente completo`
- `Abrir documento`
- `Agregar evidencia`
- `Marcar como revisado`

Evitar wording tipo:
- `status_code`
- `validation_state`
- `document_type_id`
- `entity relation`
- `workflow step`
- `hard gate`

Los acrónimos pueden mostrarse, pero siempre acompañados de una explicación humana.
Ejemplo:

`PFMEA · Análisis de riesgos del proceso`

no solamente:

`PFMEA`

## Ubicación propuesta
Dentro de Calidad.

No crear un módulo aislado en Sidebar.

Agregar una nueva tab principal:

`PPAP & Core Tools`

Navegación de Calidad sugerida:

`Dashboard | Piso QA | Captura | Auditorías | Liberaciones | Trazabilidad | No conformes | Quejas & RMA | PPAP & Core Tools | Gestión SGC`

Si la navegación ya fue refinada por otro agente, respetar la jerarquía actual y agregar esta experiencia sin romperla.

---

# 1. Landing / Dashboard PPAP

## Encabezado

Título:
`PPAP & Core Tools`

Subtítulo humano:
`Seguimiento de expedientes de aprobación de parte, evidencias de proceso y documentación de calidad por cliente.`

CTA:
`+ Nuevo expediente PPAP`

## KPIs
Máximo 5 o 6, fáciles de entender:

- Expedientes activos
- Listos para revisión
- Pendientes del cliente
- Con información faltante
- Aprobados este periodo
- Requieren atención

No llenar la pantalla de métricas innecesarias.

## Bloque "Requieren atención"
Usar la misma lógica visual premium de Inventario/Requisiciones/Calidad.

Ejemplos:

### Panasonic · 526412 · Rev H
`PFMEA requiere actualización antes de completar el expediente.`

CTA: `Revisar expediente`

### TRICO · IS-2420 · Rev I-01
`Falta evidencia dimensional de la corrida inicial.`

CTA: `Agregar resultados`

### BLACK & DECKER · NA472050 · Rev 08/23
`Expediente completo. Pendiente de revisión final.`

CTA: `Revisar para envío`

## Sugerencias del sistema
Bloque blanco con borde/icono/dot morado y Sparkles.

No decir IA.

Ejemplo:

`Sugerencia del sistema`

`La revisión H de 526412 ya tiene dibujo, Plan de Control y resultados dimensionales actualizados, pero el PFMEA sigue ligado a la revisión anterior.`

`Recomendación: actualizar el análisis de riesgos antes de marcar el expediente como completo.`

CTA: `Revisar documentos relacionados`

---

# 2. Lista de expedientes

Tabla/lista limpia y muy visual.

Columnas:
- Cliente
- Parte / revisión
- Tipo de presentación
- Avance
- Estado
- Responsable
- Última actualización
- Acción

Estados humanos:
- En preparación
- En revisión
- Pendiente de información
- Pendiente del cliente
- Aprobado
- Requiere actualización

Evitar estados técnicos.

Filtros:
- Cliente
- Estado
- Responsable
- Tipo de presentación
- Periodo
- Buscar parte / revisión / cliente

## Ejemplos demo
Mínimo 4 expedientes coherentes con datos ya existentes:

1. Panasonic · 526412 · Rev H
   - 78% completo
   - En preparación

2. TRICO · IS-2420 · Rev I-01
   - 92% completo
   - En revisión

3. BLACK & DECKER · NA472050 · Rev 08/23
   - 100% completo
   - Pendiente del cliente

4. Pentair · A163833BHA · Rev A
   - 65% completo
   - Pendiente de información

No afirmar que estos clientes realmente tienen un PPAP específico vigente con RTM si no está documentado. Presentarlos claramente como casos demo.

---

# 3. Expediente PPAP 360

Abrir en modal grande o vista dedicada premium.

Header:
- Cliente
- Parte
- Revisión
- Familia / proceso
- Responsable
- Avance total
- Estado
- Última actualización

Ejemplo:

`PANASONIC`
`526412 · Rev H`
`Flexografía · Etiqueta autoadherible`
`78% completado`
`En preparación`

## Tabs

`Resumen | Documentos | Resultados | Riesgos | Plan de Control | Muestras | Aprobaciones | Historial`

### Resumen
Mostrar checklist ejecutivo de los elementos del expediente.

Ejemplo:

- ✓ Dibujo / especificación del cliente
- ✓ Flujo del proceso
- ⚠ PFMEA · requiere actualización
- ✓ Plan de Control
- ✓ MSA / sistema de medición
- ✓ Resultados dimensionales
- ○ Estudios de capacidad
- ✓ Certificados de material
- ✓ Muestra inicial
- ○ PSW · pendiente firma

La UI debe decir claramente qué es cada elemento.

### Documentos
Cards por documento, no una tabla fea.

Cada card:
- nombre
- código/revisión
- estado
- responsable
- fecha
- `Abrir`
- `Actualizar`

Ejemplos:
- Dibujo del cliente
- Diagrama de flujo
- PFMEA
- Plan de Control
- Certificado de material
- Instrucción de trabajo

### Resultados
Secciones:
- Dimensionales
- Apariencia / impresión
- Color
- Pruebas funcionales si aplican
- Capacidad del proceso si aplica

Usar lenguaje humano:
`13 de 13 características dentro de especificación`

No mostrar solamente códigos.

### Riesgos
El encabezado puede decir:
`PFMEA · Riesgos del proceso`

Mostrar:
- proceso
- riesgo
- efecto
- controles actuales
- acción recomendada
- responsable
- estado

No intentar implementar un editor completo de PFMEA automotriz; demo visual y coherente.

### Plan de Control
Reutilizar el Plan de Control ya existente en Calidad cuando sea posible.

Mostrar:
- característica
- especificación
- método de medición
- frecuencia
- instrumento
- responsable
- reacción ante incumplimiento

No duplicar datos si ya existen.

### Muestras
Mostrar:
- corrida inicial
- OP origen
- lote/bache
- cantidad de muestra
- resultado
- evidencia
- liberación QA

Debe poder navegar a la OP / Trazabilidad si ya existe.

### Aprobaciones
Timeline sencillo:
- Preparado por
- Revisado por Calidad
- Revisado por Ingeniería/Producción
- Enviado al cliente
- Respuesta del cliente

Estados humanos:
- Pendiente
- Revisado
- Aprobado
- Requiere cambios

### Historial
Timeline del expediente:
- documento actualizado
- resultado agregado
- revisión cambiada
- evidencia adjuntada
- expediente enviado
- aprobación recibida

---

# 4. Nuevo expediente PPAP

Wizard corto, no burocrático.

Paso 1 · Parte y cliente
- Cliente
- Parte
- Revisión
- Proceso / área

Paso 2 · Alcance
- Nueva parte
- Cambio de revisión
- Cambio de proceso
- Cambio de material
- Revalidación
- Otro

Paso 3 · Elementos requeridos
Mostrar checklist sugerido y permitir activar/desactivar elementos para el demo.

Paso 4 · Responsable y fecha objetivo

CTA final:
`Crear expediente`

Después abrir directamente el expediente creado.

---

# 5. Core Tools en demo

No construir cinco módulos gigantes separados.

Dentro del expediente, cubrir visualmente:

## APQP
Mostrarlo como contexto del proyecto de calidad, no como ERP paralelo.

Wording:
`Planeación avanzada de calidad del producto`

Puede mostrarse como una mini ruta:

`Requisitos → Diseño/Proceso → Validación → PPAP → Producción`

## PFMEA
`Análisis de riesgos del proceso`

## MSA
`Validación del sistema de medición`

Mostrar instrumentos/equipos relacionados si existen en Calidad.

## SPC
`Seguimiento de estabilidad del proceso`

Para demo, una mini gráfica o resumen de capacidad sólo cuando tenga sentido.
No inventar Cp/Cpk como si fueran mediciones reales si no hay fuente.
Usar etiquetas como `Datos demostrativos`.

## Plan de Control
Reutilizar el módulo actual.

## PPAP
Es el expediente que reúne y presenta la evidencia.

---

# 6. Integraciones

## Artículos
Desde expediente:
`Ver artículo`

Mostrar parte/revisión vigentes.

## Producción
Relacionar corrida / OP usada para validación.

CTA:
`Ver orden de producción`

## Calidad
Relacionar:
- primera pieza
- auditorías
- dimensionales
- baches
- liberaciones

## Control Documental
Relacionar revisiones vigentes de:
- dibujo
- PFMEA
- Plan de Control
- instrucciones
- especificaciones

Si un documento está obsoleto, mostrar advertencia clara.

## Trazabilidad 360
CTA:
`Ver trazabilidad completa`

## Quejas/RMA
No mezclar automáticamente; sólo mostrar relación cuando exista una razón documentada/demo.

---

# 7. Reglas de demo

- No afirmar cumplimiento oficial de PPAP/IATF.
- No presentar expedientes demo como aprobaciones reales del cliente.
- No inventar niveles de PPAP específicos por cliente si no están documentados.
- Usar `Demo` / `Información demostrativa` cuando sea necesario.
- No inventar Cp/Cpk reales.
- No inventar firmas reales.
- No duplicar Plan de Control, OP, artículo ni documentos.

---

# 8. Diseño

Debe ser de las experiencias más bonitas de Calidad.

Referencias:
- `docs/design-system.md`
- Inventario Dashboard/Analítica
- Requisiciones
- CRM enterprise
- Piso QA
- Control Documental

Reglas visuales:
- max width coherente con plataforma
- tarjetas blancas/theme-surface
- rounded-3xl
- jerarquía clara
- tipografía humana
- chips pequeños
- progreso visual elegante
- semantic colors sólo donde aporten significado
- morado reservado para sugerencias del sistema
- nada de fondos pastel saturados
- nada de tablas interminables
- nada que parezca panel de administrador técnico
- responsive cuidado

---

# 9. Arquitectura sugerida

Revisar repo antes de decidir nombres exactos.

Posibles componentes:

```text
src/components/Calidad/PPAP/
├── PpapWorkspace.tsx
├── PpapDashboard.tsx
├── PpapCasesList.tsx
├── PpapCaseDetail.tsx
├── PpapCreateWizard.tsx
├── PpapDocuments.tsx
├── PpapResults.tsx
├── PpapRiskSummary.tsx
├── PpapApprovals.tsx
└── PpapSmartSuggestions.tsx
```

Datos demo compartidos:

```text
src/data/mockPpapData.ts
```

No meter todo en `CalidadPage.tsx`.

---

# 10. Historia de demo

1. Abrir `PPAP & Core Tools`.
2. Mostrar expedientes activos y los que requieren atención.
3. Abrir Panasonic 526412 Rev H.
4. Enseñar 78% completado.
5. Mostrar que el dibujo y Plan de Control están listos, pero PFMEA requiere actualización.
6. Abrir `Riesgos` y enseñar la acción pendiente.
7. Ir a `Resultados` y mostrar dimensionales conformes.
8. Ir a `Muestras` y abrir la OP de validación.
9. Mostrar `Sugerencia del sistema` morada.
10. Regresar a resumen y explicar que cuando todo esté completo el expediente queda listo para revisión/envío.

La narrativa debe sentirse como una herramienta que ayuda a Calidad a organizar el trabajo, no como un formulario técnico.

---

# 11. Prioridad de implementación

## P0
- nueva tab PPAP & Core Tools
- dashboard
- listado de expedientes
- detalle 360
- checklist de elementos
- documentos
- resultados
- riesgos/PFMEA resumen
- Plan de Control reutilizado
- muestras ligadas a OP
- aprobaciones
- progreso calculado
- sugerencias moradas

## P1
- wizard Nuevo expediente
- filtros
- historial
- enlaces cruzados
- mini resumen MSA/SPC demo cuando aplique

## P2
- comparativa de revisiones
- exportar paquete demo
- vista de readiness para envío

---

# Progreso del bloque final

- 1/5 Trazabilidad 360
- 2/5 MRP / Planeación de Materiales
- **3/5 PPAP / Core Tools ← actual**
- 4/5 Competencias RH
- 5/5 Audit Trail global

Después de este sigue: **4/5 Competencias RH**.
