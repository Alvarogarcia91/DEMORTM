# MEJORA CRM ENTERPRISE RTM

## Mi Día, Cuenta 360, Salud de Oportunidad, Cadencias, Señales y Analítica

## 0. Reglas

- Trabajar solo en `alvaro01`.
- Hacer pull antes de editar.
- No tocar `main`.
- No merge ni PR.
- Ejecutar después de `FASE_10_CRM_COMERCIAL_RTM_PIPELINE_FORECAST_ANALITICA.md` y `AJUSTE_CRM_COMERCIAL_Y_VENTAS_BASICO_RTM.md`.
- Mantener la arquitectura:

```text
COMERCIAL
└─ CRM

VENTAS BÁSICO
├─ Cotizaciones
├─ Pedidos
└─ Clientes
```

- CRM no reemplaza Ventas Básico.
- Reutilizar clientes, cotizaciones, pedidos, CxC, facturación y alertas existentes.
- No crear backend ni integraciones reales.
- No fingir IA. Si existe scoring o priorización, debe ser por reglas demo visibles/coherentes.
- Mantener theme RTM y componentes existentes.
- Auditar antes de crear librerías/dependencias nuevas.

---

# 1. Objetivo

Llevar el CRM de RTM de un CRM clásico sólido a una experiencia tipo Sales Workspace / Sales Accelerator enterprise.

La idea central es que el vendedor no tenga que buscar qué hacer: el CRM debe priorizar trabajo, mostrar señales comerciales, contexto 360 y riesgo.

Tabs internas finales del CRM:

```text
Mi Día | Dashboard | Prospectos | Oportunidades | Pipeline | Actividades | Cuentas 360 | Forecast | Analítica
```

---

# 2. Mi Día

Debe ser la primera tab del CRM y la más operativa para vendedor.

## KPIs

- oportunidades que requieren atención
- seguimientos pendientes
- cotizaciones por vencer
- pipeline en riesgo
- actividades de hoy

## Bloque principal: Tu foco de hoy

Crear cards priorizadas por reglas demo:

- oportunidad sin actividad reciente
- cotización próxima a vencer
- fecha de cierre vencida
- seguimiento vencido
- oportunidad de alto monto sin próxima actividad

Ejemplo:

```text
BLACK & DECKER
OPP-2026-0048 · $420,000
Cotización enviada hace 6 días
Sin actividad desde entonces

[ Registrar llamada ] [ Ver oportunidad ]
```

## Agenda de hoy

Timeline compacto por hora con:

- llamadas
- reuniones
- visitas
- seguimientos
- tareas

Acciones rápidas:

- completar
- reprogramar
- abrir oportunidad

## Siguiente mejor acción

No llamarlo IA.

Usar reglas claras y mostrar por qué se sugiere:

- `Sin actividad 8 días`
- `Cotización vence mañana`
- `Cierre estimado esta semana`
- `Monto alto + probabilidad alta`

---

# 3. Salud de Oportunidad

Agregar un score visual 0–100 a oportunidades.

Nombre visible:

`Salud de oportunidad`

No usar wording tipo AI score.

Factores demo:

- recencia de actividad
- existencia de próxima actividad
- días en etapa
- cercanía de fecha de cierre
- existencia de cotización
- respuesta/avance comercial simulado
- probabilidad

Mostrar desglose transparente:

```text
Salud 82 · Buena

Relación       Alta
Actividad      Alta
Avance         Medio
Cierre         Alto
```

Estados:

- 80–100 Buena
- 60–79 Atención
- 0–59 Riesgo

Los umbrales son demo, no política RTM.

Mostrar salud en:

- tabla de oportunidades
- cards del pipeline
- detalle de oportunidad
- Mi Día

---

# 4. Cuenta 360

Agregar tab `Cuentas 360`.

No duplicar el maestro de Clientes.

Debe usar el mismo cliente/cuenta y consolidar información transversal.

## Encabezado

- cliente
- industria
- estatus
- contacto principal
- vendedor responsable

## KPIs 360

- facturado histórico
- pipeline abierto
- CxC pendiente
- oportunidades abiertas
- cotizaciones abiertas
- pedidos activos

## Secciones

### Contactos

Listado de contactos demo vinculados.

### Pipeline

Oportunidades activas con monto, etapa, salud y próxima actividad.

### Actividad reciente

Timeline de llamadas/reuniones/cotizaciones/seguimientos.

### Documentos relacionados

- cotizaciones
- pedidos
- facturas
- remisiones
- CxC

Cada bloque debe tener CTA de navegación al módulo correspondiente cuando sea viable.

## Señales de cuenta

Mostrar insights por reglas demo:

- `Actividad alta`
- `Relación enfriándose`
- `Nueva necesidad`
- `Expansión`
- `CxC vencida`

No afirmar que son señales externas reales.

---

# 5. Cadencias comerciales

Agregar una experiencia de seguimiento guiado.

Puede vivir dentro de oportunidad y/o como bloque en Actividades.

Nombre visible:

`Cadencia de seguimiento`

Ejemplo:

```text
Seguimiento de cotización

Día 0   Cotización enviada       ✓
Día 2   Llamada de seguimiento   ✓
Día 5   Recordatorio comercial   HOY
Día 8   Reunión                  Pendiente
Día 12  Cierre / razón pérdida   Pendiente
```

Cadencias demo sugeridas:

- Seguimiento de cotización
- Prospecto nuevo
- Reactivación de oportunidad
- Cierre de negociación

No enviar emails ni mensajes reales.

Las cadencias solo generan/organizan actividades en estado local.

---

# 6. Pipeline avanzado

Mantener Kanban existente y agregar analítica visual.

## Bubble chart de oportunidades

Crear una gráfica donde:

- eje X = probabilidad
- eje Y = monto
- tamaño burbuja = días sin actividad o monto, elegir lo más legible
- color semántico = salud/riesgo

Tooltip:

- cliente
- oportunidad
- monto
- probabilidad
- días sin actividad
- fecha cierre
- salud

## Aging por etapa

Mostrar distribución de días por etapa.

## Velocidad de pipeline

Mostrar indicador demo de avance/ciclo promedio.

## Deals estancados

Listado de oportunidades que superan tiempo demo en etapa.

---

# 7. Forecast avanzado

Mantener Forecast actual y hacerlo drill-down.

Tabla por vendedor:

- meta demo
- ganado
- commit
- best case
- pipeline
- forecast
- % cumplimiento

Al seleccionar un vendedor, mostrar las oportunidades que componen cada cifra.

Agregar:

- forecast por línea Offset / Flexografía / Serigrafía
- cobertura de pipeline
- riesgo contra meta
- tendencia mensual

No afirmar metas como reales RTM.

---

# 8. Analítica comercial

Mover análisis avanzado a una tab propia para evitar saturar Dashboard.

Tab: `Analítica`

## KPIs

- win rate
- ciclo promedio de venta
- pipeline velocity demo
- ticket promedio
- conversión por etapa
- oportunidades estancadas

## Gráficas

Implementar, priorizando legibilidad:

1. Funnel de conversión
2. Pipeline por etapa
3. Win/Loss por mes
4. Motivos de pérdida
5. Tiempo promedio por etapa
6. Actividad vs resultados
7. Pipeline por cliente
8. Pipeline por línea productiva
9. Forecast histórico
10. Clientes nuevos vs recurrentes
11. Conversión por vendedor
12. Bubble chart de oportunidades

## Pipeline por línea productiva

Debe tener especial protagonismo:

```text
OFFSET        $1.8 M
FLEXOGRAFÍA   $1.2 M
SERIGRAFÍA    $340 K
ACABADOS      $220 K
```

Usar datos demo coherentes con oportunidades existentes.

---

# 9. Señales comerciales

Agregar bloque de `Señales` en Mi Día, Dashboard y Cuenta 360.

Tipos demo:

- Actividad alta
- Relación enfriándose
- Nueva necesidad
- Expansión
- Cotización por vencer
- Cierre estimado próximo
- Oportunidad estancada
- CxC vencida

Ejemplos:

```text
↑ Actividad alta
BLACK & DECKER
3 interacciones esta semana
```

```text
⚠ Relación enfriándose
TYCO
18 días sin actividad
```

```text
$ Expansión
BISSELL
2 oportunidades nuevas en 30 días
```

Estas señales son inferencias demo basadas en mocks internos.

---

# 10. Detalle de Oportunidad v2

Ampliar el detalle existente.

Tabs internas:

```text
Resumen | Actividad | Cadencia | Cotización | Historial
```

Agregar en Resumen:

- Salud de oportunidad
- señales
- siguiente mejor acción
- días sin actividad
- días en etapa
- score de prioridad demo

Agregar bloque `Próximo paso recomendado` por reglas.

Ejemplo:

```text
Próximo paso recomendado
Registrar llamada de seguimiento hoy
Motivo: cotización enviada hace 6 días sin nueva actividad.
```

---

# 11. Integración con Centro de Alertas

Si Centro de Alertas existe:

alimentar/adaptar estas alertas:

- oportunidad estancada
- actividad vencida
- cotización por vencer
- fecha de cierre vencida
- cuenta con relación enfriándose

No duplicar alertas si ya existe una estructura central.

---

# 12. Datos demo

Expandir mocks actuales solo si hace falta.

Objetivo mínimo:

- 20–30 oportunidades
- 12–18 prospectos
- 50–70 actividades
- 8–10 cuentas con datos 360
- 3–5 vendedores demo
- 4 cadencias activas
- suficiente histórico para 6 meses de analítica

Mantener clientes RTM documentados ya usados en el ERP cuando corresponda.

No inventar RFC/telefonía/contactos reales de terceros como si fueran datos reales.

---

# 13. UX

- `Mi Día` debe ser primera tab.
- `Dashboard` gerencial, no operativo.
- `Analítica` concentra las gráficas profundas.
- evitar 15 charts en una sola pantalla.
- tooltips claros.
- MXN consistente.
- responsive en 1366/1440/1920.
- mantener palette/theme RTM.
- red danger, amber warning, green success, theme primary para acciones normales.

---

# 14. No alcance

NO implementar:

- IA real
- scoring ML
- email real
- Outlook/Gmail
- WhatsApp
- telefonía
- secuencias automáticas externas
- tracking de aperturas
- enrichment externo
- marketing automation
- backend

---

# 15. Criterios de aceptación

- `Mi Día` es primera tab del CRM.
- Cuenta 360 funciona con el mismo maestro de clientes.
- Salud de oportunidad visible y explicable.
- Cadencias demo operativas.
- Bubble chart funcional.
- Forecast con drill-down por vendedor.
- Analítica tiene gráficas fuertes y legibles.
- Señales comerciales aparecen con reglas demo.
- CRM sigue independiente de Ventas Básico.
- CRM apagado no rompe Cotizaciones/Pedidos/Clientes.
- navegación a módulos existentes funciona donde aplique.
- Centro de Alertas no se duplica innecesariamente.
- build sin errores.

---

# 16. Validación final

1. auditar primero implementación actual de FASE 10;
2. reutilizar componentes antes de crear nuevos;
3. validar `COMERCIAL > CRM` arriba de `VENTAS BÁSICO`;
4. validar todas las tabs;
5. validar Cuenta 360;
6. validar salud/score con datos consistentes;
7. validar gráficas y tooltips;
8. validar responsive/theme;
9. correr `sync:frontend` si aplica;
10. correr `npm run build`;
11. corregir todos los errores.

---

# 17. Reporte final

Entregar breve:

- archivos modificados
- tabs/funciones agregadas
- gráficas agregadas
- integraciones reutilizadas
- resultado build
- pendientes reales
