# FASE 8 — CENTRO DE ALERTAS TRANSVERSAL RTM

## Objetivo

Agregar al demo RTM un **Centro de Alertas transversal** que concentre eventos accionables provenientes de los módulos ya existentes.

La meta no es construir un motor de reglas real ni un sistema de notificaciones backend. Es una capa demo/frontend que haga que el ERP se perciba conectado, preventivo y orientado a excepciones.

Debe reutilizar navegación, mocks, estados y datos ya existentes en el repo.

---

## Reglas de ejecución

- Trabajar **solo en `alvaro01`**.
- Hacer pull/fetch antes de editar.
- No tocar `main`.
- No mergear ni abrir PR.
- Auditar primero el frontend actual y reutilizar componentes, theme, layout, badges, modales y navegación.
- No introducir backend, API, sockets, jobs, polling real ni persistencia nueva.
- Mantener el sistema de temas actual.
- No romper CxC, CxP, Facturación, Mantenimiento, Inventario, Compras, Nómina, Pedidos ni Órdenes de Salida.
- Si existen `frontend/src` y `src` duplicados, identificar cuál es el canónico y usar el mecanismo de sincronización existente del repo cuando aplique.

---

# 1. Concepto de producto

El usuario debe poder entrar al ERP y detectar rápidamente:

- qué requiere atención inmediata;
- qué vence hoy o pronto;
- qué está bloqueado;
- qué representa riesgo operativo/financiero;
- desde qué módulo nació la alerta;
- qué acción puede tomar.

No crear una lista de notificaciones sociales. Debe sentirse como un **centro operativo de excepciones**.

---

# 2. Entrada principal: campana en Topbar

Agregar una campana en `Topbar` antes del usuario.

Debe mostrar:

- icono `Bell`;
- badge con número de alertas activas no resueltas;
- hover/title `Alertas`;
- al hacer click, abrir un panel desplegable o drawer.

Ejemplo visual:

`🔔 7`

No debe desplazar ni romper Server Demo, fecha ni menú de usuario.

---

# 3. Panel rápido de alertas

Al hacer click en la campana abrir un panel compacto con las alertas más importantes.

## Cabecera

- `Centro de Alertas`
- contador de activas
- acción `Ver todas`

## Mostrar máximo 6–8 alertas

Cada alerta debe incluir:

- severidad;
- módulo origen;
- título corto;
- detalle de una línea;
- fecha/tiempo relativo demo;
- CTA.

Ejemplo:

**Crítica · Inventario**  
`NEWSPRINT_45 por debajo del mínimo`  
Disponible: 8,200 pliegos · cobertura demo 2.3 días  
`[Ver inventario] [Crear requisición]`

---

# 4. Página / vista completa Centro de Alertas

Crear una vista completa accesible desde `Ver todas`.

Preferencia: **NO agregar otro grupo pesado al sidebar si no hace falta**. Puede ser una vista transversal navegable desde la campana.

Si por arquitectura es más limpio usar `NavItemKey`, agregar una key interna como `alertas`, pero no debe convertirse en un módulo visual dominante del sidebar salvo que la implementación actual lo requiera.

## Tabs o filtros principales

- `Activas`
- `Críticas`
- `Próximas`
- `Resueltas`

Filtros secundarios:

- módulo;
- severidad;
- responsable;
- rango demo (`Hoy`, `7 días`, `30 días`).

Buscador por referencia/título.

---

# 5. Severidades

Usar máximo 4 niveles:

- `Crítica` — rojo
- `Alta` — ámbar/rojo suave
- `Media` — ámbar
- `Informativa` — azul

No inventar más escalas.

Estados:

- `Activa`
- `Atendida`
- `Resuelta`

En demo debe poder cambiar el estado localmente.

---

# 6. Alertas demo obligatorias por módulo

Crear un set coherente de aproximadamente 12–16 alertas totales, de las cuales 6–8 estén activas.

## Inventario

- material por debajo de mínimo;
- lote retenido / en inspección;
- conteo cíclico con diferencia relevante.

Usar artículos/materiales consistentes con los mocks RTM actuales; no inventar colchones ni retail.

## Compras

- requisición urgente pendiente;
- orden de compra con entrega parcial;
- material crítico sin disponibilidad suficiente.

## CxP

- factura proveedor vencida;
- factura con diferencia entre OC, recepción y factura;
- pago programado próximo.

No usar `3-Way Match` como wording protagonista.

## CxC

- factura cliente próxima a vencer;
- cartera vencida;
- cliente con pago parcial pendiente.

## Facturación

- factura lista para timbrar;
- borrador pendiente de completar.

Aclarar siempre que el timbrado es **simulado demo**.

## Mantenimiento

- máquina fuera de servicio;
- preventivo vence mañana / próximos días;
- OT esperando refacción.

Usar las máquinas RTM documentadas que ya existen en el catálogo corregido, por ejemplo Mark Andy 830 / 4120 / Heidelberg / Conserver, nunca modelos genéricos nuevos.

## Nómina & RH

- incidencias pendientes de revisar;
- prenómina con diferencias;
- timbrado demo pendiente.

## Ventas / Pedidos

- pedido con faltante de material;
- pedido próximo a fecha objetivo sin cobertura suficiente.

## Órdenes de Salida

- remisión lista para salida sin confirmación;
- salida pendiente en `EMB-01`.

No reintroducir TMS, rutas, flota ni multi-stop.

---

# 7. Modelo de datos sugerido

Crear un mock transversal, por ejemplo:

`frontend/src/data/mockAlertsData.ts`

Interface sugerida:

```ts
export interface RtmAlert {
  id: string;
  module: 'inventario' | 'compras' | 'cxp' | 'cxc' | 'facturacion' | 'mantenimiento' | 'nomina' | 'pedidos' | 'logistica';
  severity: 'critical' | 'high' | 'medium' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  title: string;
  description: string;
  reference?: string;
  createdAt: string;
  dueAt?: string;
  owner?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  targetTab?: NavItemKey;
  targetId?: string;
}
```

Adaptar al patrón real del repo; no forzar exactamente esta interface si rompe arquitectura.

---

# 8. Navegación contextual

Las CTAs deben navegar a módulos reales cuando sea posible.

Ejemplos:

- `Ver inventario` → Inventario
- `Crear requisición` → Requisiciones, con prefill si ya existe soporte
- `Ver factura` → CxC/CxP/Facturación
- `Ver máquina` → Mantenimiento
- `Ver pedido` → Pedidos
- `Ver salida` → Órdenes de Salida

Reutilizar `DashboardShell` y los estados target ya existentes.

No crear enlaces muertos.

Si una pantalla no soporta navegación a un registro concreto, navegar al módulo y mostrar toast/contexto demo en vez de inventar infraestructura.

---

# 9. Acciones demo

Acciones permitidas:

- `Marcar como atendida`
- `Resolver`
- `Reabrir`
- `Ir al módulo`

Para alertas operativas específicas:

- `Crear requisición`
- `Registrar pago`
- `Ver validación`
- `Generar OT`
- `Ver factura`

Solo usar acciones que ya existan o que puedan simularse de forma segura con estado local.

No desarrollar lógica de negocio nueva pesada para soportar una alerta.

---

# 10. Dashboard Inicio

Agregar un bloque compacto en el Dashboard Inicio:

## `Alertas que requieren atención`

Mostrar 4–5 alertas activas ordenadas por severidad.

Debe incluir:

- icono de módulo;
- severidad;
- referencia;
- descripción corta;
- CTA `Revisar`.

Incluir botón `Ver todas las alertas`.

No duplicar todo el Centro de Alertas en Inicio.

---

# 11. Reglas de coherencia

- Las referencias deben existir o ser coherentes con los mocks actuales.
- Reutilizar clientes, proveedores, números de parte y máquinas ya corregidos por la fase de Realismo RTM.
- No regresar a nombres Super Colchones.
- No inventar múltiples almacenes/sucursales fuera de la topología RTM acordada.
- Mantener `Almacén Principal RTM`, almacén virtual si ya existe y `EMB-01` donde corresponda.
- No inventar producción aún como módulo ejecutado; si una alerta de pedido menciona producción, mantenerla a nivel `faltante para pedido` / `cobertura insuficiente`.

---

# 12. UX / diseño

Mantener visual RTM:

- theme classes para selección/CTA;
- rojo danger;
- verde success;
- ámbar warning;
- azul info;
- radios y sombras actuales;
- densidad compacta tipo ERP.

La campana debe sentirse nativa del Topbar.

El drawer/panel debe ser usable en desktop y mobile.

---

# 13. Comportamiento demo

Las alertas pueden vivir 100% en frontend.

Al resolver una alerta:

- cambiar estado local;
- reducir contador de campana;
- moverla a `Resueltas`;
- mostrar toast `Alerta marcada como resuelta`.

Al recargar, no es obligatorio persistir si hacerlo implica arquitectura adicional. Si ya existe un patrón localStorage simple y seguro, se puede reutilizar.

---

# 14. No hacer

NO implementar:

- emails reales;
- SMS;
- WhatsApp;
- push notifications;
- sockets;
- cron jobs;
- polling backend;
- reglas configurables complejas;
- IA predictiva;
- machine learning;
- escalamiento automático;
- integración SAT/PAC real;
- integración bancaria real.

---

# 15. Casos demo obligatorios

## Caso A — Inventario

Alerta crítica de material bajo mínimo → `Crear requisición` / `Ver inventario`.

## Caso B — Mantenimiento

Preventivo próximo de una máquina RTM documentada → `Ver máquina` / `Generar OT` si ya existe flujo.

## Caso C — CxP

Factura con diferencia → `Ver validación`.

## Caso D — CxC

Factura vencida → `Registrar pago` o `Ver cuenta`.

## Caso E — Nómina

Incidencia pendiente → `Revisar nómina`.

## Caso F — Órdenes de Salida

Remisión lista en `EMB-01` → `Ver salida`.

---

# 16. Auditoría previa obligatoria

Antes de implementar revisar:

- `Topbar.tsx`
- `DashboardShell.tsx`
- `DashboardInicio.tsx`
- `Sidebar.tsx`
- `NavigationModulesContext.tsx`
- mocks de Inventario
- Compras / Requisiciones
- Finanzas (CxC/CxP/Facturación)
- Mantenimiento
- Nómina
- Pedidos
- Órdenes de Salida

Reutilizar targets de navegación existentes.

---

# 17. Validación final

Al terminar:

1. revisar todas las alertas y CTAs;
2. confirmar que ninguna acción rompe navegación;
3. probar abrir/cerrar campana;
4. probar marcar atendida/resuelta;
5. probar `Ver todas`;
6. revisar responsive;
7. revisar themes;
8. correr `rg` para residuos/strings incoherentes;
9. si aplica, correr `npm run sync:frontend` usando el script existente;
10. correr `npm run build` en el frontend canónico;
11. corregir todos los errores.

---

# 18. Reporte final de Anti

Entregar resumen breve con:

- archivos creados/modificados;
- campana implementada;
- alertas por módulo;
- navegación contextual agregada;
- build final;
- cualquier limitación demo encontrada.
