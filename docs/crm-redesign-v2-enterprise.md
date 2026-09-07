# RTM Demo — CRM Comercial v2 · Rediseño Enterprise

## Objetivo

Rehacer visual y funcionalmente el CRM actual para que se sienta como parte nativa de la plataforma RTM y tenga el mismo nivel de madurez visual/operativa que Inventario y Requisiciones.

La implementación actual tiene conceptos valiosos, pero hoy se percibe como un bloque aislado: `CrmPage.tsx` es monolítico, usa `@ts-nocheck`, mezcla vistas y lógica en un solo archivo, contiene métricas/hardcodes que no responden realmente a filtros y su shell visual no replica el patrón fuerte de Inventario.

El rediseño debe conservar las capacidades existentes útiles y reorganizarlas con una UX mucho más ejecutiva, operativa, analítica y accionable.

---

# 1. Auditoría del CRM actual

## Lo bueno que ya existe y debe conservarse

- Mi Día.
- Dashboard.
- Prospectos.
- Oportunidades.
- Pipeline.
- Actividades.
- Cuenta 360.
- Forecast.
- Analítica.
- Integración con Cotizaciones, Pedidos y Clientes.
- Calificar prospecto y generar oportunidad.
- Crear cotización desde oportunidad.
- Riesgo, probabilidad, monto y días en etapa.
- Actividades comerciales.
- Win/Loss.
- Gráficas de pipeline/forecast/origen/actividad.

## Problemas actuales

### P0 — No parece el mismo producto que Inventario

Inventario usa:

- ancho máximo centralizado (`max-w-[1520px]`);
- header limpio con icono + título + descripción;
- tabs con iconos;
- tab activa con `bg-theme-primary text-white`;
- cards `rounded-3xl`;
- jerarquía clara entre operación, alertas y analítica;
- toasts consistentes;
- bloques SMART con `Sparkles` y semántica morada.

CRM usa un shell diferente:

- encabezado con icono grande dentro de bloque primario;
- tabs dentro de una píldora gris;
- demasiadas vistas inline;
- menor consistencia de spacing y jerarquía;
- menos señal de “plataforma”.

### P0 — `CrmPage.tsx` es monolítico

Actualmente concentra tipos, seeds, helpers, dashboard, Mi Día, prospectos, oportunidades, pipeline, cuentas, analítica y modales en un solo archivo grande.

Debe dividirse por responsabilidades.

### P0 — datos hardcodeados / filtros incompletos

Ejemplos a corregir:

- Top cuentas por pipeline está hardcodeado.
- Conversión por vendedor está hardcodeada.
- Win rate / ciclo / velocity / conversión contienen valores fijos.
- El selector de periodo del dashboard no recalcula realmente datasets temporales.
- Varias gráficas son decorativas y no comparten una única fuente de datos.

El demo puede usar mocks, pero debe sentirse coherente: un filtro debe cambiar todos los bloques que dependen de él.

### P1 — señales comerciales demasiado simples

Actualmente existen señales como:

- relación enfriándose;
- expansión;
- CxC vencida.

La dirección es correcta, pero deben evolucionar a un verdadero bloque **Sugerencias del sistema** con el patrón SMART morado de la plataforma.

### P1 — creación de prospecto no se siente completa

El CTA `Nuevo prospecto` hoy navega a la tab, pero el flujo debe abrir un modal/formulario real de demo y crear un prospecto en estado local.

### P1 — Cuenta 360 todavía no es 360

Debe consolidar:

- contactos;
- oportunidades;
- actividades;
- cotizaciones;
- pedidos;
- histórico facturado;
- riesgo comercial;
- CxC / crédito demo;
- calidad/servicio cuando aplique;
- siguiente mejor acción.

---

# 2. Principio visual obligatorio

CRM debe usar exactamente el mismo lenguaje visual de Inventario/Requisiciones.

Referencias directas:

- `docs/design-system.md`
- `src/components/Inventario/InventoryPage.tsx`
- `src/components/Inventario/DashboardTab.tsx`
- `src/components/Inventario/AnalyticsTab.tsx`
- `src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`
- `src/components/common/`

## Shell del módulo

```text
[ icono discreto ] CRM Comercial
Gestión de cuentas, oportunidades, actividades y forecast B2B.

[ Dashboard ] [ Mi Día ] [ Prospectos ] [ Oportunidades ] [ Pipeline ]
[ Cuentas 360 ] [ Actividades ] [ Analítica ]
```

Usar:

- `max-w-[1520px] w-full mx-auto pb-16`;
- header con borde inferior;
- tabs con iconos;
- activa `bg-theme-primary text-white`;
- inactiva `text-theme-muted hover:bg-theme-muted`;
- `rounded-3xl` para secciones mayores;
- `rounded-2xl` para componentes internos;
- `font-mono` en montos, folios y métricas;
- toast fijo inferior como Inventario.

No inventar otro design system.

---

# 3. Navegación propuesta

Reducir duplicación conceptual.

```text
CRM
│
├── Dashboard
├── Mi Día
├── Prospectos
├── Oportunidades
├── Pipeline
├── Cuentas 360
├── Actividades
└── Analítica
```

`Forecast` deja de ser una tab aislada y se integra en:

- Dashboard como forecast ejecutivo;
- Analítica como forecast detallado.

Esto evita una navegación excesiva.

---

# 4. Dashboard CRM — nuevo protagonista

El dashboard debe responder cuatro preguntas:

1. ¿Cuánto negocio tengo vivo?
2. ¿Qué puedo cerrar?
3. ¿Qué está en riesgo?
4. ¿Qué me recomienda hacer el sistema?

## 4.1 Header analítico

Card superior estilo Inventario Analítica.

Controles:

- periodo: Hoy / 7 días / 30 días / 60 días / 90 días / 6 meses;
- vendedor;
- línea: Offset / Flexografía / Serigrafía / Acabados / Todas;
- comparar contra periodo anterior;
- Exportar demo.

Default: `30 días`.

Los filtros deben afectar los KPIs y gráficos relevantes.

## 4.2 KPIs principales

Máximo 6–7 tarjetas:

- Pipeline abierto.
- Pipeline ponderado.
- Forecast del periodo.
- Ganado.
- Win rate.
- Oportunidades en riesgo.
- Actividades vencidas.

Mostrar variación vs periodo anterior cuando aplique.

## 4.3 Atención requerida

Bloque visible similar a Inventario.

Ejemplo:

```text
ATENCIÓN COMERCIAL

TYCO · OPP-2026-0041
$210,000 · Negociación · 12 días en etapa
Seguimiento vencido
[Ver oportunidad]

TRICO · COT-2026-0096
Cotización sin respuesta · 6 días
Cierre esperado en 9 días
[Registrar seguimiento]

Panasonic
Oportunidad perdida por precio hace 10 días
[Reactivar]
```

Semántica:

- rojo = riesgo real;
- ámbar = atención;
- morado = sugerencia inteligente;
- verde = oportunidad favorable.

---

# 5. Sugerencias del sistema — SMART morado

Este bloque es obligatorio y debe usar el patrón visual morado existente en la plataforma.

No llamarlo “IA” si no existe una IA real. Usar:

`Sugerencias del sistema`

Icono `Sparkles` morado.

Cada sugerencia debe responder:

- qué detectó;
- por qué importa;
- qué recomienda;
- CTA directo.

## Ejemplos demo

### Recuperación de oportunidad

```text
✦ Sugerencia
TYCO · OPP-2026-0041

$210,000 en Negociación.
12 días en etapa y seguimiento vencido.

Recomendación:
Contactar hoy y confirmar objeción comercial.

[Registrar seguimiento] [Ver oportunidad]
```

### Reenganche de oportunidad perdida

```text
✦ Recuperación potencial
Panasonic perdió una oportunidad por precio.
No hay seguimiento posterior registrado.

[Crear actividad de reactivación]
```

### Cross-sell

```text
✦ Expansión de cuenta
BLACK & DECKER compra actualmente Offset.
Existe actividad reciente y pipeline activo.

Sugerencia demo:
Explorar etiquetas Flexografía para empaque.

[Crear oportunidad]
```

### Cotización envejecida

```text
✦ Cotización requiere seguimiento
COT-2026-0096 lleva 6 días sin actividad.
Fecha estimada de cierre: 20 Sep.

[Registrar llamada] [Abrir cotización]
```

### Riesgo financiero

Cuando se disponga de contexto CxC:

```text
✦ Validación recomendada
Cuenta con saldo vencido y nueva oportunidad de alto monto.
Revisar condiciones de crédito antes de comprometer términos.

[Ver cuenta 360]
```

### Gap de forecast

```text
✦ Objetivo comercial
Forecast actual cubre 82% del objetivo demo.
Cerrar TYCO + TRICO cubriría 97%.

[Ver oportunidades prioritarias]
```

### Balance de vendedor

```text
✦ Cadencia comercial
Andrea Peña concentra 3 oportunidades en riesgo y 4 actividades vencidas.

[Ver agenda de Andrea]
```

Las sugerencias deben generarse desde reglas sobre mocks actuales, no como textos completamente desconectados.

---

# 6. Dashboard — bloques analíticos

## Embudo comercial

Mantener y mejorar:

- cantidad por etapa;
- monto por etapa;
- conversión vs etapa anterior;
- aging promedio;
- click filtra/navega al pipeline.

## Forecast vs objetivo

Mostrar:

- ganado;
- commit;
- best case;
- pipeline adicional;
- objetivo demo.

Debe derivarse de oportunidades, no ser una gráfica fija sin relación.

## Top cuentas

Calcular desde dataset filtrado.

Mostrar:

- cuenta;
- pipeline;
- oportunidades;
- salud promedio;
- siguiente acción.

## Desempeño por vendedor

Derivar:

- pipeline;
- win rate;
- ticket promedio;
- actividades vencidas;
- ciclo promedio.

## Pipeline por línea productiva

- Offset;
- Flexografía;
- Serigrafía;
- Acabados.

Esto conecta Comercial con la operación real de RTM.

---

# 7. Mi Día — convertirlo en consola operativa

No eliminar el concepto actual. Mejorarlo.

Debe mostrar:

## Mi agenda

- llamadas;
- visitas;
- reuniones;
- correos;
- seguimientos;
- vencidos.

Acciones rápidas:

- Completar.
- Reprogramar.
- Abrir cuenta.
- Abrir oportunidad.
- Registrar nota.

## Mi foco

Ordenar oportunidades por un score de prioridad basado en:

- monto;
- etapa;
- probabilidad;
- días sin actividad;
- cercanía al cierre;
- actividad vencida;
- riesgo.

Mostrar claramente el motivo del score.

## Siguiente mejor acción

Ejemplo:

```text
TYCO
Siguiente mejor acción: llamada de seguimiento
Motivo: $210k · Negociación · 12 días en etapa · actividad vencida
[Registrar llamada]
```

---

# 8. Prospectos — flujo completo

## Nueva alta

CTA global `+ Nuevo prospecto` abre modal real.

Campos:

- empresa;
- contacto;
- email;
- teléfono demo;
- industria;
- origen;
- interés;
- línea potencial;
- vendedor;
- notas.

Guardar debe insertar en lista local.

## Lead score

Mantener score, pero mostrar razones:

```text
86 / 100
+ cliente industrial objetivo
+ contacto válido
+ interés definido
+ actividad reciente
```

## Sugerencia por prospecto

- contactar;
- calificar;
- descartar;
- convertir en oportunidad.

---

# 9. Oportunidades — workspace serio

Tabla debe incluir:

- folio;
- cuenta;
- oportunidad;
- línea;
- etapa;
- monto;
- probabilidad;
- salud;
- días en etapa;
- fecha estimada cierre;
- siguiente actividad;
- vendedor;
- riesgo.

Filtros:

- búsqueda;
- etapa;
- vendedor;
- línea;
- riesgo;
- sin actividad;
- periodo de cierre.

## Detalle de oportunidad

Modal amplio tipo Requisiciones con tabs:

```text
[ Resumen ] [ Actividad ] [ Cotización ] [ Pedido ] [ Historial ]
```

Resumen:

- cuenta;
- contacto;
- monto;
- etapa;
- probabilidad;
- salud;
- fecha cierre;
- vendedor;
- siguiente acción;
- línea productiva;
- notas.

Acciones:

- Registrar actividad.
- Crear cotización.
- Abrir cotización.
- Cambiar etapa.
- Marcar ganada.
- Marcar perdida.

Si se marca perdida, pedir motivo:

- precio;
- competencia;
- proyecto detenido;
- sin presupuesto;
- tiempo de entrega;
- requisito técnico;
- otro.

Esto alimenta la Analítica Win/Loss.

---

# 10. Pipeline — Kanban de verdad para demo

Mantener columnas:

- Calificado.
- Levantamiento.
- Cotización.
- Negociación.
- Ganada.

No mezclar Perdidas dentro del kanban activo; mostrarlas como filtro/historial.

Cada card debe mostrar:

- cuenta;
- título;
- monto;
- probabilidad;
- salud;
- aging;
- próxima acción;
- vendedor.

Semántica por borde/dot, no fondos saturados.

Permitir mover etapa con selector/acción clara.

Al mover a Ganada:

- actualizar probabilidad 100%;
- sugerir generar/abrir pedido si ya existe cotización.

---

# 11. Cuenta 360 — uno de los WOW

Debe ser una ficha empresarial real.

Header:

```text
BLACK & DECKER
Manufactura industrial
Cuenta activa · Cliente estratégico
Contacto principal: ...
```

KPIs:

- Facturación histórica.
- Pipeline abierto.
- Cotizaciones abiertas.
- Pedidos activos.
- Win rate de cuenta.
- Actividades últimos 30d.
- CxC pendiente demo/integrada cuando esté disponible.

Tabs internas:

- Resumen.
- Contactos.
- Oportunidades.
- Actividad.
- Cotizaciones.
- Pedidos.
- Historial.

## Resumen de relación

Mostrar timeline:

```text
02 Sep · Cotización enviada
04 Sep · Pedido autorizado
06 Sep · Visita comercial
07 Sep · Seguimiento a nueva necesidad
```

## Salud de la cuenta

Score demo basado en:

- actividad reciente;
- oportunidades abiertas;
- éxito histórico;
- CxC;
- proyectos perdidos;
- recurrencia.

No presentar como modelo predictivo real; usar `Score comercial demo`.

## Sugerencias de expansión

Bloque morado dentro de Cuenta 360.

---

# 12. Actividades

Mejorar con:

- vista Hoy / Vencidas / Próximas / Completadas;
- filtros por vendedor/tipo;
- agenda cronológica;
- CTA `+ Nueva actividad`;
- reprogramación demo;
- completar actividad actualiza métricas del dashboard.

Tipos:

- llamada;
- correo;
- reunión;
- visita;
- seguimiento;
- tarea interna.

---

# 13. Analítica CRM — nueva versión

Debe usar el lenguaje de `Inventario/AnalyticsTab.tsx`.

Header card:

```text
INTELIGENCIA COMERCIAL · CRM
Analítica Comercial
Tendencias, conversión, velocidad y salud del pipeline.

[Vendedor] [Línea] [Periodo] [Exportar Excel]
```

Periodos:

- 7 días;
- 30 días;
- 60 días;
- 90 días;
- 6 meses;
- 12 meses.

## KPIs

- Win rate.
- Ciclo promedio.
- Ticket promedio.
- Pipeline velocity.
- Conversión lead → oportunidad.
- Conversión oportunidad → ganada.
- Oportunidades estancadas.

Todos deben derivarse del dataset filtrado.

## Gráficas

1. Tendencia de pipeline.
2. Ganadas vs perdidas por periodo.
3. Conversión por etapa.
4. Tiempo promedio por etapa.
5. Origen de prospectos vs conversión.
6. Pipeline por línea productiva.
7. Desempeño por vendedor.
8. Top cuentas por pipeline.
9. Aging de oportunidades.
10. Motivos de pérdida.
11. Actividad comercial vs cierres.
12. Forecast accuracy demo.

## Smart Insights

Al final de Analítica agregar `Sugerencias del sistema` en morado.

Ejemplos:

- Negociación tarda 38% más que el promedio.
- Prospección referida convierte mejor que sitio web.
- Offset tiene ticket promedio mayor, Flexografía mayor velocidad.
- Andrea tiene más pipeline en riesgo.
- Precio representa la principal causa de pérdida.

No afirmar causalidad; presentar como `Lectura demo del periodo`.

---

# 14. Datos y coherencia

Crear `src/data/mockCrmData.ts` y mover ahí:

- prospects;
- opportunities;
- activities;
- targets;
- historical snapshots;
- sales suggestions rules/config;
- loss reasons;
- account health mock inputs.

No mantener seeds gigantes dentro de `CrmPage.tsx`.

## Filtros

Crear helpers/selectores para:

- periodo;
- vendedor;
- línea;
- etapa;
- riesgo.

Dashboard y Analítica deben reutilizar las mismas funciones.

No tener números contradictorios entre vistas.

---

# 15. Arquitectura sugerida

```text
src/components/Comercial/CRM/
├── CrmPage.tsx
├── CrmDashboard.tsx
├── CrmMyDay.tsx
├── CrmProspects.tsx
├── CrmOpportunities.tsx
├── CrmPipeline.tsx
├── CrmAccounts360.tsx
├── CrmActivities.tsx
├── CrmAnalytics.tsx
├── OpportunityDetailModal.tsx
├── ProspectFormModal.tsx
├── ActivityFormModal.tsx
├── SmartCommercialSuggestions.tsx
├── crmSelectors.ts
└── CrmCharts.tsx

src/data/
└── mockCrmData.ts
```

El archivo actual `src/components/Comercial/CrmPage.tsx` puede quedar como wrapper/import temporal para no romper rutas, pero no debe seguir conteniendo toda la implementación.

Eliminar `@ts-nocheck` una vez dividido y tipado.

---

# 16. Integración transversal con ERP

Mantener y mejorar conexiones existentes:

```text
PROSPECTO
→ OPORTUNIDAD
→ COTIZACIÓN
→ PEDIDO
→ PRODUCCIÓN / ENTREGA
→ FACTURACIÓN / CxC
```

CRM debe permitir navegar a:

- Cliente.
- Cotización.
- Pedido.

Cuando sea viable con la arquitectura actual, Cuenta 360 puede mostrar una señal financiera de CxC sin duplicar Finanzas.

No crear datos duplicados de Clientes, Cotizaciones o Pedidos si ya vienen por props/estado compartido.

---

# 17. Prioridad de implementación

## P0

- shell visual idéntico a Inventario;
- modularizar `CrmPage`;
- Dashboard nuevo;
- Smart suggestions moradas;
- filtros realmente coherentes;
- Analítica nueva;
- Nuevo Prospecto funcional;
- quitar hardcodes principales.

## P1

- Opportunity detail pro;
- Cuenta 360 enriquecida;
- Win/Loss reasons;
- pipeline mejorado;
- actividad/reprogramación;
- smart suggestions por cuenta/oportunidad.

## P2

- contexto CxC más profundo;
- score comercial enriquecido;
- forecast accuracy;
- señales de capacidad productiva cuando se integre un estado compartido real con Producción.

---

# 18. Criterio de éxito del demo

En menos de 4 minutos debe poder mostrarse:

```text
Dashboard CRM
→ sistema detecta oportunidad prioritaria
→ sugerencia morada explica por qué
→ abrir oportunidad
→ registrar seguimiento
→ crear/abrir cotización
→ mover pipeline
→ revisar Cuenta 360
→ abrir Analítica
→ filtrar 30/60/90 días
→ ver conversión, aging, vendedores y motivos de pérdida
```

El cliente debe sentir que el CRM no es una agenda glorificada, sino un **centro de inteligencia comercial conectado al ERP**.

---

# 19. Reglas visuales obligatorias

- seguir `docs/design-system.md`;
- usar Inventario y Requisiciones como referencia;
- SMART/sugerencia = morado en borde/icono/dot, fondo blanco;
- no fondos morados completos;
- no cards pastel saturadas;
- acciones importantes deben funcionar en demo;
- nada de botones muertos;
- responsive real;
- `src/` es la fuente canónica;
- no mantener manualmente dos árboles de código.

Al finalizar:

```bash
npm run build
npm run sync:frontend
```

Corregir errores antes de terminar.
