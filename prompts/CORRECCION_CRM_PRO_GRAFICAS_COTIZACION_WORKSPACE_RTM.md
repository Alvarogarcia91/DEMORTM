# CORRECCIÓN CRM PRO RTM — GRÁFICAS REALES, LEAD → COTIZACIÓN Y SALES WORKSPACE

## 0. Contexto y objetivo

Esta especificación CORRIGE y MEJORA la implementación actual del CRM ya existente en `alvaro01`.

NO reconstruir el CRM desde cero.

El CRM actual ya tiene:

- Mi Día
- Dashboard
- Prospectos
- Oportunidades
- Pipeline
- Actividades
- Cuentas 360
- Forecast
- Analítica
- salud de oportunidad
- datos demo

Pero la implementación visible tiene problemas importantes:

1. varias visualizaciones parecen placeholders o cajas grises;
2. Forecast, Origen y Actividad se ven prácticamente vacíos;
3. el embudo no comunica visualmente las etapas;
4. no hay una integración correcta Lead/Oportunidad → Cotización;
5. el detalle comercial necesita acciones más parecidas a un CRM enterprise;
6. falta una vista de pipeline con información accionable y drill-down;
7. el CRM se siente como un dashboard bonito, pero todavía no como una herramienta completa de ventas.

Objetivo final:

> Convertir el CRM actual en un Sales Workspace B2B industrial convincente para demo, con visualizaciones reales y legibles, pipeline accionable, lead qualification, opportunity workspace, Cuenta 360 y conexión nativa con el módulo existente de Cotizaciones.

Mantener:

```text
COMERCIAL
└─ CRM

VENTAS BÁSICO
├─ Cotizaciones
├─ Pedidos
└─ Clientes
```

CRM NO reemplaza Ventas Básico.

---

# 1. Reglas de ejecución

- Trabajar SOLO en `alvaro01`.
- Hacer pull antes de cualquier cambio.
- No tocar `main`.
- No merge.
- No PR.
- Auditar la implementación actual antes de editar.
- No borrar funcionalidad ya útil del CRM.
- Reutilizar `SalesCustomer`, `SalesQuote`, `SalesOrder` y estados compartidos de `DashboardShell`.
- NO crear un segundo motor de cotizaciones dentro del CRM.
- La cotización comercial debe seguir viviendo en `VENTAS BÁSICO > Cotizaciones`.
- Mantener el CRM opcional: si se oculta/desactiva CRM, Ventas Básico debe seguir operando sin cambios.
- Mantener theme dinámico RTM.
- No fingir IA.
- Health score, señales y prioridades deben ser reglas demo transparentes.
- No agregar backend.
- No agregar integraciones reales de email, WhatsApp, telefonía o calendario.
- Si existen `frontend/src` y `src`, identificar árbol canónico y ejecutar `sync:frontend` si aplica.

---

# 2. Auditoría obligatoria del estado actual

Antes de implementar revisar al menos:

- `frontend/src/components/Comercial/CrmPage.tsx`
- `frontend/src/components/DashboardShell.tsx`
- `frontend/src/components/Ventas/CotizacionesPage.tsx`
- `frontend/src/components/Ventas/Cotizaciones/CreateQuoteWizardModal.tsx`
- `frontend/src/data/mockSalesData.ts`
- `frontend/package.json`
- sistema de themes
- Centro de Alertas

Hallazgos actuales que deben corregirse:

## 2.1 Gráficas

El `package.json` actual no contiene librería de gráficas.

No seguir simulando charts mediante cajas grises, barras sin contraste o espacios vacíos.

### Regla

Preferencia:

1. instalar y usar `recharts` para charts estándares;
2. custom SVG solo para una visualización específica cuando realmente convenga;
3. NO inventar pseudo-gráficas con divs vacíos.

Si se instala `recharts`, hacerlo únicamente en el árbol/package real que usa el proyecto.

---

# 3. Referencias funcionales de CRM enterprise

Tomar inspiración funcional —no copiar UI— de patrones comunes de Dynamics 365 Sales / Salesforce / HubSpot:

- lead qualification;
- opportunity pipeline view;
- métricas clicables con drill-down;
- funnel;
- bubble chart;
- Kanban por etapa;
- opportunity side panel / workspace;
- sales worklist / Mi Día;
- próximas actividades;
- cuenta 360;
- forecast;
- quote asociada a oportunidad;
- ganada/perdida con razón de cierre.

El CRM debe responder dos preguntas todo el tiempo:

1. ¿qué debo atender ahora?
2. ¿qué debo hacer para avanzar esta oportunidad?

---

# 4. DASHBOARD — REDISEÑO VISUAL REAL

El Dashboard debe ser gerencial y visual.

NO debe tener tarjetas grandes vacías ni gráficas sin datos visibles.

## 4.1 Header / filtros globales

Agregar filtros compactos arriba:

- periodo: Mes actual / 3 meses / 6 meses / Año;
- vendedor;
- línea: Offset / Flexografía / Serigrafía / Acabados / Todas;
- etapa.

Los filtros deben afectar visualmente KPIs y gráficas cuando sea razonable en demo.

Si alguna métrica usa serie histórica mock, debe permanecer coherente.

---

# 5. KPIs del Dashboard

Mantener y mejorar:

- Pipeline total
- Pipeline ponderado
- Ganado este mes
- Forecast del mes
- Win rate
- Ticket promedio
- En riesgo
- Actividades vencidas

### Interacción

Los KPIs importantes deben ser clicables.

Ejemplo:

`Atención comercial: 10`

al hacer click:

→ abrir/filtrar oportunidades y actividades que forman ese número.

No usar KPIs muertos.

---

# 6. GRÁFICAS OBLIGATORIAS — DEBEN VERSE

## 6.1 Funnel real de oportunidades

Reemplazar el embudo gris actual.

Debe mostrar visualmente:

- Calificado
- Levantamiento
- Cotización
- Negociación
- Ganada

Cada nivel:

- color claramente diferenciable;
- cantidad;
- monto;
- porcentaje vs etapa anterior cuando sea viable.

Tooltip:

- etapa
- oportunidades
- monto
- conversión

No usar gris claro como color principal de datos.

---

## 6.2 Pipeline por etapa

Bar chart real.

Mostrar:

- monto por etapa;
- cantidad en tooltip;
- pipeline ponderado opcional.

Click en barra → filtrar Oportunidades a esa etapa.

---

## 6.3 Forecast vs Objetivo

Actualmente se ve prácticamente vacío.

Crear gráfica real tipo `ComposedChart` / line + bars:

- objetivo demo;
- cerrado ganado;
- commit;
- best case;
- forecast total.

Mostrar 6 meses, no solo tres etiquetas flotando.

Tooltip en MXN.

La meta debe marcarse explícitamente como `Objetivo demo`.

---

## 6.4 Prospectos por origen

Donut real con:

- Referido
- Sitio web
- Prospección
- Evento / feria
- Cliente existente

Centro del donut:

- total prospectos.

Leyenda + porcentaje.

Click en segmento → abre Prospectos filtrados por origen.

---

## 6.5 Actividad comercial semanal

Grouped bar chart:

- llamadas
- reuniones
- seguimientos
- visitas

Lunes a domingo o últimos 7 días.

Debe tener datos visibles; no solo letras de los días.

---

## 6.6 Ganadas vs Perdidas

Agregar gráfica últimos 6 meses:

- cantidad;
- monto ganado;
- monto perdido.

Puede ser stacked bars o bars + line.

---

## 6.7 Top cuentas por pipeline

Mantener pero hacerlo interactivo.

Click en cuenta → `Cuenta 360`.

Mostrar top 5 con:

- pipeline;
- oportunidades abiertas;
- salud/riesgo agregado.

---

## 6.8 Opportunity Bubble Chart

En `Analítica` o `Pipeline`, no necesariamente en Dashboard principal.

Ejes:

- X = probabilidad
- Y = fecha estimada de cierre o días en etapa
- tamaño = monto
- color = etapa o riesgo

Tooltip completo.

Esto debe permitir detectar oportunidades grandes y en riesgo visualmente.

---

# 7. REGLAS VISUALES DE CHARTS

CRÍTICO.

- Nunca chart-on-gray casi invisible.
- Nunca texto gris sobre gris.
- `bg-theme-muted` puede servir como fondo secundario, NO como serie principal.
- acciones/serie primaria: colores derivados de theme.
- success: green.
- warning: amber.
- danger: red/rose.
- info: blue.
- smart/recommendation: purple solo cuando corresponda.
- tooltips con fondo `bg-theme-surface` y borde.
- labels legibles en light/dark.
- `ResponsiveContainer` si se usa Recharts.
- altura mínima útil 240–300px.
- evitar cards de chart enormes con 70% espacio vacío.
- responsive 1366 / 1440 / 1920.
- validar `rtm`, `navy`, `graphite`, `emerald`.

---

# 8. PROSPECTO / LEAD — FLUJO CORRECTO

En un CRM fuerte un prospecto NO debe ser un registro muerto.

Crear un drawer/modal de detalle de prospecto.

## Header

- empresa
- contacto
- fuente
- score
- responsable
- estado
- interés

## Acciones rápidas

- Registrar actividad
- Calificar prospecto
- Descalificar
- Crear seguimiento

## Cuando el prospecto ya está calificado

Mostrar:

- oportunidad creada;
- cuenta/cliente asociado;
- CTA `Abrir oportunidad`.

### Acción premium

Si cumple condición de calificación:

`Calificar y cotizar`

Flujo:

```text
Prospecto
→ Calificar
→ vincular/crear Cuenta
→ crear Oportunidad
→ abrir Cotizaciones con cliente preseleccionado
```

NO crear cotización contra un prospecto no calificado sin cuenta/cliente relacionado.

---

# 9. OPORTUNIDAD — COMMAND BAR ENTERPRISE

El detalle de oportunidad debe ser la pieza central del CRM.

En header poner command bar clara:

- `Registrar actividad`
- `Crear cotización` o `Ver cotización`
- `Cambiar etapa`
- `Marcar ganada`
- `Marcar perdida`
- menú `Más`

### Regla de CTA

Si NO hay cotización:

`+ Crear cotización`

Si hay cotización:

`Ver cotización COT-...`

Si está ganada y existe pedido:

`Ver pedido PED-...`

---

# 10. INTEGRACIÓN CRM → COTIZACIÓN — OBLIGATORIA

Este es el gap principal actual.

Ya existe en Ventas Básico:

- `CotizacionesPage`
- `CreateQuoteWizardModal`
- `initialPreselectedCustomerId`
- navegación cruzada desde `DashboardShell`

REUTILIZAR ESO.

## 10.1 Desde oportunidad existente con customerId

Al pulsar `Crear cotización`:

1. guardar oportunidad CRM seleccionada como contexto local;
2. setear `targetQuoteCustomerId` con `customerId`;
3. navegar a `cotizaciones`;
4. abrir automáticamente `CreateQuoteWizardModal` con cliente preseleccionado.

No crear wizard nuevo.

## 10.2 Contexto de oportunidad

Extender de manera mínima y limpia la relación entre CRM y Quote.

Idealmente agregar opcional a `SalesQuote`:

- `crmOpportunityId?`
- `crmOpportunityFolio?`

O usar un adapter/local mapping si tocar el tipo central genera demasiado riesgo.

Cuando se guarda una cotización originada desde CRM:

- vincular folio al Opportunity;
- mover etapa a `Cotización` si estaba antes;
- agregar evento timeline `Cotización COT-... creada`;
- mostrar CTA `Ver cotización`.

## 10.3 Regreso / apertura de cotización

`Ver cotización` desde CRM debe usar:

- `targetQuoteFolio`
- navegación a `cotizaciones`
- abrir el detail existente automáticamente.

## 10.4 Prospecto sin Customer

Si el prospecto no tiene `customerId`:

- primero calificar;
- buscar coincidencia en maestro `SalesCustomer` por cuenta/nombre;
- si ya existe, vincularlo;
- si no existe, crear cliente potencial mediante flujo compatible con el maestro actual;
- NO duplicar BLACK & DECKER / TYCO / etc.

Para demo, el flujo puede pedir confirmación:

`Esta acción convertirá el prospecto en cuenta y abrirá una nueva cotización.`

Botón:

`Calificar y cotizar`

---

# 11. PIPELINE VIEW TIPO CRM ENTERPRISE

No limitar Pipeline a un Kanban.

Agregar switch:

```text
Kanban | Pipeline analítico
```

## Kanban

- monto total por columna;
- cantidad;
- cards con monto, probabilidad, vendedor, salud, siguiente acción;
- mover etapa si actual implementation lo soporta estable;
- perdida fuera del board principal.

## Pipeline analítico

Layout inspirado en enterprise CRM:

1. KPIs clicables arriba;
2. funnel/bar/bubble chart;
3. tabla editable/accionable abajo;
4. detail drawer al seleccionar oportunidad.

Tabla:

- Cuenta
- Oportunidad
- Etapa
- Monto
- Probabilidad
- Ponderado
- Salud
- Cierre
- Días en etapa
- Próxima actividad
- Vendedor

Acciones rápidas por fila:

- abrir
- actividad
- cotización
- cambio etapa

---

# 12. VISTAS GUARDADAS / FILTROS RÁPIDOS

Agregar chips de vistas demo:

- Mis oportunidades
- Cierre este mes
- En riesgo
- Sin actividad
- Con cotización
- Sin cotización
- Ganadas recientemente

No necesitan persistencia backend.

Deben filtrar realmente los datos locales.

---

# 13. CUENTA 360 — HACERLA MÁS CRM

Mantener Cuenta 360 y agregar:

## Resumen comercial

- pipeline abierto
- oportunidades
- cotizaciones activas
- pedidos activos
- facturado histórico si existe
- CxC si existe

## Stakeholders B2B

Para una cuenta/oportunidad permitir contactos demo con roles:

- Compras
- Ingeniería
- Calidad
- Decisor
- Usuario / solicitante

No afirmar nombres como contactos reales de RTM; usar nombres demo.

## Timeline unificado

Mostrar:

- llamada
- reunión
- oportunidad
- cotización
- pedido
- factura / CxC como eventos secundarios si ya existen

Cada documento debe navegar a su módulo real.

---

# 14. MI DÍA / SALES WORKLIST

Mantener `Mi Día`, pero hacerlo más accionable.

Agrupar:

## Requiere atención

- actividad vencida
- oportunidad sin actividad
- cotización por vencer
- cierre vencido
- cuenta con CxC vencida

## Próximas actividades

Agenda del día.

## Siguiente acción sugerida

Rule-based.

Ejemplo:

```text
BLACK & DECKER · OPP-2026-0042
$385,000 · Levantamiento

Siguiente acción: completar levantamiento y preparar cotización.
Motivo: visita programada mañana y no existe cotización.

[ Registrar actividad ] [ Crear cotización ]
```

---

# 15. FORECAST — HACERLO GERENCIAL

Forecast debe tener:

- objetivo demo;
- ganado;
- commit;
- best case;
- pipeline restante;
- forecast total;
- cobertura.

Tabla por vendedor con drill-down.

Click en cualquier monto → oportunidades que lo forman.

Agregar forecast por:

- vendedor;
- línea productiva;
- mes.

No mostrar una gráfica vacía.

---

# 16. ANALÍTICA — NO SATURAR DASHBOARD

La tab Analítica debe contener análisis profundo:

- win rate;
- ciclo promedio;
- pipeline velocity demo;
- conversión por etapa;
- aging por etapa;
- motivos de pérdida;
- actividad vs resultado;
- pipeline por línea;
- pipeline por cuenta;
- bubble chart;
- forecast histórico;
- nuevos vs recurrentes.

Dashboard principal: máximo 5–7 bloques visuales fuertes.

Analítica: profundidad.

---

# 17. DETALLE OPORTUNIDAD 360

Tabs internas:

```text
Resumen | Actividad | Stakeholders | Cadencia | Cotización | Historial
```

## Resumen

- etapa
- monto
- probabilidad
- monto ponderado
- salud
- riesgo
- fecha cierre
- días etapa
- siguiente actividad
- línea productiva
- necesidad/requerimiento

## Cotización

Sin cotización:

`+ Crear cotización`

Con cotización:

- folio
- total
- estado
- fecha
- CTA abrir

## Historial

Timeline comercial realista.

---

# 18. DATOS DEMO Y COHERENCIA

Mantener volumen actual y mejorar series históricas.

Necesario para charts:

- 6 meses de won/lost;
- forecast 6 meses;
- actividades por día/semana;
- orígenes distribuidos;
- oportunidades en todas las etapas;
- oportunidades con/sin quote;
- 3 vendedores;
- distintas líneas productivas.

Usar cuentas documentadas ya existentes cuando aplique:

- BLACK & DECKER
- BISSELL
- TYCO
- TRICO
- Panasonic
- ENTAIL
- ILSCO
- INVACARE

No inventar datos fiscales/contactos reales como hechos.

---

# 19. ARQUITECTURA DE COMPONENTES

`CrmPage.tsx` ya está creciendo demasiado.

No seguir metiendo toda la implementación en un solo archivo gigante.

Separar si ayuda, por ejemplo:

```text
Comercial/CRM/
  CrmDashboard.tsx
  CrmMyDay.tsx
  CrmProspects.tsx
  CrmOpportunities.tsx
  CrmPipeline.tsx
  CrmOpportunityDrawer.tsx
  CrmAccount360.tsx
  CrmForecast.tsx
  CrmAnalytics.tsx
  charts/
```

Mantener `CrmPage.tsx` como orquestador.

No sobrefragmentar componentes pequeños sin beneficio.

---

# 20. LIBRERÍA DE GRÁFICAS

El proyecto actual NO tiene chart library.

Se autoriza instalar `recharts` para esta corrección.

Usarlo para:

- BarChart
- LineChart
- AreaChart
- PieChart
- ComposedChart
- ScatterChart
- ResponsiveContainer
- Tooltip
- Legend

Para Funnel:

- usar `FunnelChart` de Recharts si es estable en la versión instalada;
- o custom SVG claro si no.

NO agregar una segunda librería de gráficas.

---

# 21. INTERACCIONES DEMO OBLIGATORIAS

## Caso 1 — Lead → Cotización

1. Prospectos
2. abrir prospecto
3. Calificar y cotizar
4. oportunidad creada/vinculada
5. navegar a Cotizaciones
6. wizard abierto con cliente
7. guardar cotización
8. regresar/abrir CRM
9. oportunidad muestra folio vinculado

## Caso 2 — Oportunidad → Cotización

1. abrir BLACK & DECKER sin quote
2. click `Crear cotización`
3. abrir wizard existente con cliente
4. guardar
5. oportunidad pasa a Cotización

## Caso 3 — Pipeline

1. abrir Pipeline
2. filtrar `En riesgo`
3. abrir oportunidad
4. registrar actividad
5. crear/ver cotización

## Caso 4 — Dashboard

1. click segmento Funnel
2. abre Oportunidades filtrado
3. click Top Cuenta
4. abre Cuenta 360

## Caso 5 — Forecast

1. click vendedor
2. drill-down a oportunidades
3. abrir una oportunidad

---

# 22. NO HACER

NO:

- reemplazar Ventas Básico;
- duplicar Cotizaciones;
- crear quote wizard dentro del CRM;
- agregar un segundo catálogo de clientes;
- meter IA falsa;
- meter marketing automation;
- instalar varias chart libs;
- dejar charts con placeholders;
- usar data hardcoded incoherente entre KPI/chart/detail;
- romper themes;
- crear backend;
- implementar Producción o Calidad.

---

# 23. CRITERIOS DE ACEPTACIÓN VISUAL

El Dashboard debe pasar esta revisión:

- a simple vista hay gráficas reales;
- ningún chart parece vacío;
- ningún dato importante está gris sobre gris;
- barras/funnel tienen contraste;
- tooltips funcionan;
- leyendas son legibles;
- los charts ocupan bien el espacio;
- la pantalla se ve profesional en 1440p;
- light/dark/themes mantienen contraste;
- no hay overflow horizontal extraño salvo Kanban donde aplique.

---

# 24. CRITERIOS DE ACEPTACIÓN FUNCIONAL

- Prospecto tiene detail y acciones.
- `Calificar` crea/vincula oportunidad.
- `Calificar y cotizar` funciona.
- Oportunidad sin quote muestra `Crear cotización`.
- Oportunidad con quote muestra `Ver cotización`.
- Se reutiliza `CreateQuoteWizardModal` existente.
- Cliente se preselecciona correctamente.
- Cotización creada se vincula a oportunidad.
- Pipeline tiene Kanban + vista analítica.
- Dashboard charts permiten drill-down donde se pide.
- Cuenta 360 navega a documentos existentes.
- Forecast tiene datos visibles.
- Analítica tiene charts visibles.
- CRM desactivado no afecta Ventas Básico.

---

# 25. VALIDACIÓN FINAL

1. `git pull` en `alvaro01`.
2. revisar dependencia `recharts` y package lock correspondiente.
3. implementar en árbol canónico.
4. validar lead → oportunidad → cotización.
5. validar oportunidad → cotización existente.
6. validar todas las gráficas.
7. validar filtros/drill-down.
8. validar `rtm`, `navy`, `graphite`, `emerald`.
9. validar desktop 1366/1440/1920.
10. correr `sync:frontend` si aplica.
11. correr `npm run build`.
12. corregir todos los errores.
13. revisar que no existan dos implementaciones CRM divergentes.

---

# 26. REPORTE FINAL

Anti debe reportar breve:

- archivos cambiados;
- componentes CRM separados/creados;
- librería de charts instalada;
- gráficas implementadas;
- flujo Lead/Oportunidad → Cotización;
- navegación reutilizada;
- resultado de `sync:frontend` si aplica;
- resultado de build;
- pendientes reales.
