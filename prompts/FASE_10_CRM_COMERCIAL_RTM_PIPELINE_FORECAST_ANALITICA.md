# FASE 10 — CRM COMERCIAL RTM

## Dashboard, Prospectos, Oportunidades, Pipeline, Actividades, Forecast y Analítica

## 0. Reglas de ejecución

- Trabajar **solo en `alvaro01`**.
- Hacer `pull` antes de modificar.
- No tocar `main`.
- No hacer merge ni PR.
- Auditar el repo actual antes de crear componentes nuevos.
- Reutilizar el design system, `DashboardShell`, `Sidebar`, `NavigationModulesContext`, modales, tablas, badges, cards, filtros y patrones existentes.
- Mantener frontend/demo-first. No backend nuevo.
- Si existen dos árboles `frontend/src` y `src`, identificar el canónico y usar `sync:frontend` únicamente si aplica al flujo actual del repo.
- No romper Clientes, Cotizaciones, Pedidos, Facturación, CxC, Alertas ni módulos existentes.
- CRM debe usar los mismos clientes/cuentas, cotizaciones, pedidos y datos maestros actuales; **no duplicar maestros**.
- Mantener theme dinámico RTM.
- Datos reales/documentados RTM tienen prioridad sobre mocks genéricos.
- No inventar clientes, políticas comerciales o metas como si fueran hechos de RTM. Si una cifra es demo, debe ser coherente y claramente parte del demo.

---

# 1. Objetivo

Construir un CRM B2B industrial visualmente fuerte y convincente para Impresos RTM.

No debe sentirse como un CRUD de contactos. Debe funcionar como un **Sales Hub** para responder:

- ¿Cuánto pipeline comercial tenemos?
- ¿Qué oportunidades pueden cerrar este mes?
- ¿Qué negocios están en riesgo?
- ¿Qué vendedor necesita seguimiento?
- ¿Qué cotizaciones llevan demasiado tiempo sin respuesta?
- ¿Qué clientes tienen más potencial?
- ¿De dónde llegan los prospectos?
- ¿Por qué se pierden oportunidades?
- ¿Cómo vamos contra la meta comercial?

Flujo conceptual:

```text
Prospecto
  ↓
Calificación
  ↓
Cuenta / Contacto
  ↓
Oportunidad
  ↓
Levantamiento / Requerimiento
  ↓
Cotización
  ↓
Negociación
  ↓
Ganada / Perdida
  ↓
Pedido
```

CRM no reemplaza Ventas. CRM alimenta y contextualiza Ventas.

---

# 2. Navegación

Agregar una sección **CRM** en sidebar, antes de VENTAS.

```text
CRM
└─ CRM Comercial

VENTAS
├─ Cotizaciones
├─ Pedidos
└─ Clientes
```

Crear una sola `NavItemKey` nueva, por ejemplo:

`crm`

Integrarla en:

- `Sidebar`
- `NavigationModulesContext`
- Configuración → Módulos & Navegación
- `DashboardShell`
- `Topbar`

Debe poder ocultarse/mostrarse mediante el sistema existente de módulos.

Dentro del módulo CRM usar tabs internas:

```text
Dashboard | Prospectos | Oportunidades | Pipeline | Actividades | Forecast
```

No crear seis módulos separados en sidebar.

---

# 3. Datos y realismo RTM

Reutilizar los clientes/documentación realista ya identificada en el ERP cuando existan:

- BLACK & DECKER
- BISSELL
- TYCO
- ENTAIL
- TRICO
- Panasonic
- ILSCO
- INVACARE
- otros clientes ya presentes y documentados en datos maestros actuales

No crear cuentas genéricas tipo `Acme Corp`.

Reutilizar productos/números de parte actuales del ERP cuando sea posible, por ejemplo trabajos de:

- manuales e instructivos
- etiquetas autoadheribles
- tags
- blister cards
- impresión Offset
- Flexografía
- Serigrafía

Una oportunidad debe poder indicar línea/interés:

- Offset
- Flexografía
- Serigrafía
- Acabados / conversión
- Mixto

No asumir que todos los clientes usan todas las tecnologías.

---

# 4. Modelo de datos demo

Crear o adaptar mocks coherentes con el resto del ERP.

## 4.1 Prospecto

Campos mínimos:

- id
- empresa
- contacto principal
- puesto
- teléfono
- email
- industria
- ciudad/estado
- fuente
- vendedor responsable
- fecha de alta
- última actividad
- próxima actividad
- estado
- score demo
- interés principal
- notas

Estados sugeridos:

- Nuevo
- Contactado
- En calificación
- Calificado
- No calificado

Fuentes sugeridas:

- Referido
- Sitio web
- Prospección
- Cliente existente / nueva necesidad
- Evento / feria
- Recomendación

## 4.2 Oportunidad

Campos mínimos:

- id
- folio
- cuenta/cliente
- contacto
- vendedor
- nombre de oportunidad
- línea de negocio
- descripción / requerimiento
- etapa
- monto estimado
- probabilidad
- monto ponderado
- fecha estimada de cierre
- fecha de creación
- días en etapa
- origen
- próxima actividad
- última actividad
- cotización vinculada
- pedido vinculado si fue ganada
- estado de riesgo
- motivo de pérdida opcional
- competidor opcional
- timeline

Etapas visibles:

```text
Prospecto / Descubrimiento
Calificado
Levantamiento / Requerimiento
Cotización
Negociación
Ganada
Perdida
```

Para oportunidades ya convertidas desde prospectos puede omitirse `Prospecto` y arrancar en `Calificado`.

## 4.3 Actividad

Tipos:

- Llamada
- Correo
- Reunión
- Seguimiento
- Visita
- Tarea
- Nota

Campos:

- fecha/hora
- tipo
- cuenta/oportunidad
- contacto
- responsable
- estado
- prioridad
- resultado
- próxima acción

Estados:

- Pendiente
- Hoy
- Vencida
- Completada

---

# 5. Tab Dashboard — debe ser la pantalla más fuerte visualmente

El dashboard debe sentirse como un CRM de nivel enterprise.

## 5.1 KPIs superiores

Mostrar 6–8 KPIs útiles, no cards decorativas.

Sugeridos:

- Pipeline total
- Pipeline ponderado
- Ganado este mes
- Forecast del mes
- Conversión de oportunidades
- Ticket promedio
- Oportunidades en riesgo
- Actividades vencidas

Todos los montos con `tabular-nums` / fuente monoespaciada donde aplique.

## 5.2 Gráficas obligatorias

Implementar varias gráficas con librería ya disponible; auditar dependencias antes de agregar otra.

### Gráfica A — Funnel de oportunidades

Etapas y cantidad + monto:

- Calificado
- Levantamiento
- Cotización
- Negociación
- Ganada

Debe mostrar claramente caída entre etapas.

### Gráfica B — Pipeline por etapa

Bar chart horizontal o vertical:

- monto total por etapa
- tooltip con cantidad de oportunidades

### Gráfica C — Ganadas vs Perdidas por mes

Serie últimos 6 meses.

Mostrar monto y cantidad si es viable.

### Gráfica D — Forecast vs Meta

Mes actual + próximos meses.

Series sugeridas:

- Meta demo
- Cerrado ganado
- Forecast

La meta debe presentarse como **objetivo demo**, no política real RTM.

### Gráfica E — Leads / prospectos por origen

Donut o barras:

- Referidos
- Web
- Prospección
- Evento
- Cliente existente

### Gráfica F — Top cuentas por pipeline

Top 5 cuentas por monto abierto.

### Gráfica G — Conversión por vendedor

Comparar:

- oportunidades
- ganadas
- conversión
- monto ganado

Usar 3–5 vendedores demo coherentes.

### Gráfica H — Tiempo promedio por etapa

Mostrar días promedio en:

- Calificado
- Levantamiento
- Cotización
- Negociación

### Gráfica I — Motivos de pérdida

Donut/bar:

- Precio
- Tiempo de entrega
- Sin presupuesto
- Proyecto detenido
- Competencia
- Otro

Estos son motivos demo; no afirmar que son estadísticas reales RTM.

### Gráfica J — Actividad comercial semanal

Llamadas / reuniones / seguimientos completados por día o semana.

## 5.3 Bloque “Atención comercial”

Crear una lista priorizada de oportunidades y actividades que requieren acción.

Ejemplos:

```text
CRÍTICA
TYCO · OPP-2026-0041
Sin actividad por 12 días
$210,000
[ Ver oportunidad ]
```

```text
ALTA
BLACK & DECKER
Cotización COT-2026-0098 vence mañana
[ Ver cotización ]
```

```text
MEDIA
BISSELL
Seguimiento vencido hace 2 días
[ Registrar actividad ]
```

Conectar visualmente con el Centro de Alertas si ya está implementado, pero no acoplar de forma frágil.

---

# 6. Tab Prospectos

## 6.1 Encabezado

Botón:

`+ Nuevo prospecto`

## 6.2 Tabla

Columnas:

- Empresa
- Contacto
- Industria
- Fuente
- Interés
- Vendedor
- Score
- Última actividad
- Próxima actividad
- Estado
- Acciones

## 6.3 Filtros

- búsqueda
- estado
- vendedor
- fuente
- industria
- score
- sin actividad reciente

## 6.4 Alta / edición

Modal o drawer reutilizando patrón existente.

No pedir 30 campos.

Campos principales:

- empresa
- contacto
- email
- teléfono
- industria
- fuente
- interés
- vendedor
- notas

## 6.5 Calificar prospecto

Acción principal:

`Calificar prospecto`

Al calificar, simular creación/vinculación de:

- cuenta/cliente potencial
- contacto
- oportunidad

Mostrar confirmación tipo:

```text
Prospecto calificado
Se creó la oportunidad OPP-2026-0048.
```

No duplicar un cliente existente si la cuenta ya existe.

---

# 7. Tab Oportunidades

Vista tipo tabla/lista potente.

## 7.1 KPIs compactos

- Abiertas
- Pipeline abierto
- Cierre este mes
- En riesgo
- Ganadas mes

## 7.2 Tabla

Columnas:

- Oportunidad
- Cuenta
- Línea
- Etapa
- Monto
- Probabilidad
- Ponderado
- Cierre estimado
- Días en etapa
- Próxima actividad
- Vendedor
- Riesgo
- Acciones

## 7.3 Filtros

- búsqueda
- etapa
- vendedor
- línea
- fecha cierre
- riesgo
- monto

## 7.4 Acciones

- Ver oportunidad
- Cambiar etapa
- Registrar actividad
- Crear / abrir cotización
- Marcar ganada
- Marcar perdida

---

# 8. Detalle de Oportunidad — pieza clave del demo

Abrir en drawer grande o modal full-height.

Header:

- folio
- nombre
- cuenta
- monto
- etapa
- probabilidad
- vendedor
- fecha estimada cierre
- riesgo

## Tabs internas

```text
Resumen | Actividad | Cotización | Historial
```

## Resumen

Mostrar:

- necesidad / requerimiento
- tecnología
- monto
- probabilidad
- monto ponderado
- contacto principal
- próxima actividad
- origen
- días en etapa

## Timeline 360

Ejemplo:

```text
02 Sep · Llamada
Cliente solicita cotización para nuevo instructivo.

03 Sep · Reunión
Se confirma tiraje estimado de 80,000 piezas.

04 Sep · Cotización
COT-2026-0098 enviada.

05 Sep · Seguimiento
Programado contacto de revisión.

07 Sep · Cotización aceptada
Oportunidad lista para convertir a Pedido.
```

Debe verse muy visual, con iconos y timestamps.

## Integración Cotizaciones

Si existe cotización vinculada:

- folio
- estado
- total
- fecha
- CTA `Ver cotización`

Si no existe:

CTA `Crear cotización`

Debe navegar al módulo actual de Cotizaciones con cliente/oportunidad preseleccionado cuando sea viable sin reescribir Ventas.

## Ganar oportunidad

Al marcar `Ganada`:

- probabilidad 100%
- registrar fecha cierre
- mantener vínculo con Cotización
- si ya existe pedido vinculado, mostrarlo
- si no, CTA `Generar / Ver Pedido` usando flujo actual cuando sea compatible

## Perder oportunidad

Solicitar motivo:

- Precio
- Tiempo de entrega
- Competencia
- Proyecto detenido
- Sin presupuesto
- Otro

Notas opcionales.

---

# 9. Tab Pipeline — Kanban

Crear board horizontal por etapas:

```text
CALIFICADO
LEVANTAMIENTO
COTIZACIÓN
NEGOCIACIÓN
GANADA
```

No mostrar Perdidas en board principal; ofrecer filtro opcional.

Cada columna muestra:

- cantidad
- monto total

Cada tarjeta:

- cuenta
- oportunidad
- monto
- probabilidad
- vendedor
- cierre estimado
- próxima actividad
- indicador de riesgo

Permitir mover tarjeta de etapa con drag/drop **solo si la librería/patrón existente lo hace simple y estable**. Si no, usar selector/cambio de etapa dentro de la tarjeta/modal; no introducir dependencia pesada únicamente por drag/drop.

Cuando se cambie etapa, actualizar estado local y métricas.

## Alertas visuales

- sin actividad > X días → riesgo demo
- fecha cierre vencida → crítica
- cotización próxima a vencer → alta

No presentar X como política real RTM; es regla demo.

---

# 10. Tab Actividades

## 10.1 Vista

Ofrecer switch simple:

```text
Agenda | Lista
```

Si calendario mensual/semanal requiere mucha complejidad, priorizar una agenda por fecha con agrupación.

## 10.2 KPIs

- Hoy
- Vencidas
- Próximos 7 días
- Completadas semana

## 10.3 Filtros

- tipo
- vendedor
- estado
- cuenta
- oportunidad
- fecha

## 10.4 Acciones

- Nueva actividad
- Completar
- Reprogramar
- Abrir oportunidad

## 10.5 Modal nueva actividad

Campos:

- tipo
- cuenta/oportunidad
- contacto
- fecha/hora
- responsable
- prioridad
- notas

Al completar, pedir resultado breve y próxima acción opcional.

---

# 11. Tab Forecast

Esta pantalla debe vender visión gerencial.

## 11.1 KPIs

Ejemplo demo:

- Meta del mes
- Cerrado ganado
- Commit
- Best case
- Pipeline restante
- Forecast total
- Cobertura de pipeline

No afirmar que categorías/valores son política comercial real RTM.

## 11.2 Definiciones demo

- `Cerrado ganado`: oportunidades ganadas
- `Commit`: oportunidades con alta probabilidad y cierre dentro del periodo
- `Best case`: oportunidades con probabilidad media/alta
- `Pipeline`: resto de oportunidades abiertas

## 11.3 Gráficas

- Meta vs Cerrado vs Forecast por mes
- Forecast por vendedor
- Forecast por línea Offset / Flexo / Serigrafía
- Cobertura de pipeline por mes

## 11.4 Tabla de forecast

Por vendedor:

- meta demo
- cerrado
- commit
- best case
- pipeline
- forecast
- % cumplimiento

---

# 12. Dashboard y analítica — calidad visual

Las gráficas deben:

- respetar tema RTM
- tener tooltips
- leyendas claras
- formato MXN correcto
- no usar colores aleatorios
- reutilizar paleta semántica del proyecto
- responder bien en laptop 1366/1440/1920
- evitar gráficas diminutas o ilegibles
- permitir periodos: `Mes actual`, `Últimos 3 meses`, `6 meses`, `Año`

Selector de periodo puede ser demo si los datos no cambian completamente, pero debe mostrar una notificación clara de demo cuando aplique.

No poner 10 gráficas apretadas en una sola fila. Diseñar jerarquía visual:

- KPIs
- 2 gráficas principales grandes
- 2–4 gráficas medianas
- tablas/listas de atención

---

# 13. Integración con módulos existentes

## Clientes

CRM usa el mismo maestro `SalesCustomer` o equivalente actual.

No crear `crmCustomers` separado.

## Cotizaciones

Una oportunidad puede crear / abrir una cotización.

Reutilizar flujo de `CotizacionesPage` y navegación cruzada existente.

## Pedidos

Oportunidad ganada puede mostrar pedido generado desde cotización.

No generar un segundo mecanismo de pedidos.

## Facturación / CxC

En detalle de cuenta/oportunidad ganada, puede mostrarse como información secundaria:

- facturado histórico
- saldo CxC

Solo si ya se puede obtener sin acoplamiento excesivo.

## Alertas

Las alertas comerciales pueden alimentar el Centro de Alertas:

- oportunidad estancada
- actividad vencida
- cotización por vencer
- fecha de cierre vencida

Si Centro de Alertas todavía no está implementado al ejecutar esta fase, dejar datos/adapter preparado sin romper CRM.

---

# 14. Mock data obligatorio

Crear suficientes datos para que todas las gráficas tengan sentido.

Mínimo recomendado:

- 10–15 prospectos
- 18–25 oportunidades
- 30–50 actividades
- 6 meses de histórico agregado para analítica
- 3–5 vendedores demo
- oportunidades distribuidas entre etapas
- al menos 4 ganadas
- al menos 4 perdidas
- al menos 3 en riesgo
- al menos 3 con cotización vinculada
- al menos 2 con pedido vinculado

Usar cuentas industriales coherentes con RTM.

Los montos deben ser razonables y consistentes entre detalle, pipeline, forecast y gráficas.

No usar nombres genéricos de empresas cuando ya existen cuentas documentadas.

---

# 15. Casos demo obligatorios

## Caso A — Prospecto a oportunidad

1. Abrir Prospectos
2. seleccionar prospecto
3. `Calificar prospecto`
4. crear oportunidad
5. abrir detalle

## Caso B — Oportunidad a cotización

1. Oportunidad de BLACK & DECKER
2. etapa `Levantamiento`
3. crear/abrir cotización
4. regresar al CRM
5. etapa `Cotización`

## Caso C — Negociación ganada

1. Oportunidad BISSELL
2. etapa Negociación
3. marcar Ganada
4. mostrar vínculo con cotización/pedido

## Caso D — Oportunidad perdida

1. abrir oportunidad
2. marcar Perdida
3. seleccionar motivo
4. actualizar gráfica de motivos de pérdida

## Caso E — Pipeline en riesgo

1. abrir Pipeline
2. identificar oportunidad sin actividad
3. abrir detalle
4. registrar seguimiento
5. actualizar próxima actividad

## Caso F — Forecast

1. abrir Forecast
2. revisar meta demo vs cerrado vs forecast
3. filtrar por vendedor o línea

---

# 16. UX / wording

Usar español empresarial claro.

Evitar wording SaaS innecesariamente anglosajón cuando existe equivalente natural.

Permitido:

- Pipeline
- Forecast
- Lead si internamente se usa, pero visible preferir `Prospecto`

Preferir visible:

- Prospectos
- Oportunidades
- Actividades
- Etapa
- Cierre estimado
- Monto ponderado
- Ganada / Perdida
- Motivo de pérdida
- Próxima actividad

No usar frases tipo “AI-powered” o “smart insights” porque no hay IA real.

---

# 17. No alcance

NO implementar:

- email real
- Gmail/Outlook
- WhatsApp real
- telefonía real
- campañas de marketing
- marketing automation
- scoring ML real
- IA predictiva
- enriquecimiento externo
- firma electrónica
- backend
- permisos avanzados
- territorio comercial complejo
- comisiones reales

Todo es frontend demo coherente.

---

# 18. Auditoría/reutilización obligatoria antes de construir

Antes de escribir componentes nuevos revisar:

- `frontend/src/components/Sidebar.tsx`
- `frontend/src/components/Topbar.tsx`
- `frontend/src/components/DashboardShell.tsx`
- `frontend/src/context/NavigationModulesContext.tsx`
- `frontend/src/components/Ventas/`
- `frontend/src/data/mockSalesData.ts`
- Clientes actuales
- Cotizaciones actuales
- Pedidos actuales
- Centro de Alertas si ya existe
- librerías de gráficas ya instaladas
- patrones de cards/tablas/modales/drawers

No duplicar componentes si ya hay equivalentes reutilizables.

---

# 19. Criterios de aceptación

- CRM visible y configurable en navegación.
- Tabs: Dashboard / Prospectos / Oportunidades / Pipeline / Actividades / Forecast.
- Dashboard con al menos 8 visualizaciones útiles entre KPIs/gráficas.
- Funnel funcional visualmente.
- Pipeline Kanban coherente.
- Prospecto puede convertirse a oportunidad demo.
- Oportunidad tiene detalle 360 con timeline.
- Cotización puede vincularse/navegarse.
- Ganada / Perdida actualizan estado local.
- Forecast coherente con oportunidades.
- Actividades permiten alta/completar/reprogramar demo.
- Datos usan clientes industriales coherentes con RTM.
- Responsive aceptable.
- Themes funcionan.
- No rompe Ventas/Finanzas/Alertas.
- `npm run build` termina sin errores.

---

# 20. Validación final

Al terminar:

1. correr búsqueda global de residuos/errores de dominio relevantes;
2. validar navegación CRM ↔ Clientes ↔ Cotizaciones ↔ Pedidos;
3. validar todas las tabs;
4. validar filtros;
5. validar modales/drawers;
6. validar métricas y montos consistentes;
7. correr `sync:frontend` solo si el repo actual lo requiere;
8. correr `npm run build`;
9. corregir todos los errores.

---

# 21. Reporte final de Anti

Entregar únicamente un reporte breve con:

- archivos agregados/modificados
- componentes principales
- gráficas implementadas
- integraciones reutilizadas
- resultado de build
- pendientes reales si los hubiera
