# AJUSTE — CRM COMERCIAL + VENTAS BÁSICO RTM

## Objetivo

Aclarar y fijar la arquitectura de navegación comercial del demo RTM.

**CRM Comercial y Ventas Básico son dos capacidades distintas y ambas deben conservarse.**

La intención del demo es poder mostrar dos escenarios comerciales:

1. Cliente que sí desea CRM completo → usa **COMERCIAL > CRM**.
2. Cliente que no desea CRM → puede seguir usando únicamente **VENTAS BÁSICO** con Cotizaciones, Pedidos y Clientes.

No fusionar, reemplazar ni eliminar el módulo actual de Ventas.

---

# 1. Navegación obligatoria

En el Sidebar colocar **COMERCIAL** inmediatamente arriba de **VENTAS BÁSICO**.

La estructura visible debe quedar conceptualmente así:

```text
...
COMERCIAL
└─ CRM

VENTAS BÁSICO
├─ Cotizaciones
├─ Pedidos
└─ Clientes
...
```

No usar `CRM` como título de sección y `CRM Comercial` como opción redundante.

Preferencia de wording visible:

- sección: `COMERCIAL`
- opción: `CRM`

El contenido de `CRM` sigue siendo el Sales Hub definido en:

`prompts/FASE_10_CRM_COMERCIAL_RTM_PIPELINE_FORECAST_ANALITICA.md`

---

# 2. CRM debe ser un módulo opcional independiente

Crear/mantener una `NavItemKey` independiente para CRM, por ejemplo:

`crm`

Debe integrarse al sistema actual de visibilidad de módulos:

- `Sidebar`
- `NavigationModulesContext`
- Configuración → Módulos & Navegación
- `DashboardShell`
- `Topbar`

Debe existir toggle independiente para poder ocultar **CRM** sin ocultar Ventas Básico.

Caso esperado:

```text
CRM OFF
VENTAS BÁSICO ON

Resultado:
Cotizaciones, Pedidos y Clientes siguen disponibles normalmente.
```

Y también:

```text
CRM ON
VENTAS BÁSICO ON

Resultado:
Se muestran ambos grupos y CRM puede reutilizar/navegar a Clientes, Cotizaciones y Pedidos.
```

---

# 3. Ventas Básico NO se reemplaza

Conservar completos los módulos actuales:

- Cotizaciones
- Pedidos
- Clientes

No moverlos dentro de CRM.
No borrarlos.
No convertirlos en tabs internas de CRM.
No hacer que dependan de que CRM esté activo.

El grupo debe llamarse visualmente **VENTAS BÁSICO** para comunicar que funciona como alternativa comercial simple cuando el cliente no contrata/necesita CRM.

Si actualmente el Sidebar dice solamente `VENTAS`, cambiar únicamente el encabezado visual a:

`VENTAS BÁSICO`

Sin alterar rutas, keys ni lógica interna innecesariamente.

---

# 4. Relación entre CRM y Ventas Básico

CRM **reutiliza** Ventas Básico; no lo duplica.

Flujo esperado:

```text
CRM
Prospecto
  ↓
Oportunidad
  ↓
Crear cotización
  ↓
VENTAS BÁSICO / Cotizaciones
  ↓
Pedido
  ↓
VENTAS BÁSICO / Pedidos
```

Clientes/cuentas deben usar el mismo maestro actual de `Clientes`.

Una oportunidad puede:

- abrir cliente existente;
- crear/abrir cotización mediante el flujo actual;
- mostrar pedido generado;
- volver al CRM sin duplicar documentos.

No crear:

- `crmCustomers` separado;
- segundo motor de cotizaciones;
- segundo motor de pedidos.

---

# 5. Configuración → Módulos & Navegación

La configuración debe reflejar claramente la separación.

Ejemplo conceptual:

```text
COMERCIAL
[ ON ] CRM

VENTAS BÁSICO
[ ON ] Cotizaciones
[ ON ] Pedidos
[ ON ] Clientes
```

Si el sistema actual maneja toggles individuales para Cotizaciones/Pedidos/Clientes, conservarlos.

CRM debe tener su propio toggle.

No hacer que apagar CRM apague automáticamente Ventas Básico.
No hacer que apagar Ventas Básico borre o rompa CRM; en ese caso, los CTA hacia Cotizaciones/Pedidos pueden mostrar un aviso demo indicando que el módulo correspondiente está oculto/no habilitado.

---

# 6. Orden visual del Sidebar

La prioridad es que **COMERCIAL aparezca justo antes de VENTAS BÁSICO**.

No importa si otros grupos arriba cambian por fases posteriores; entre estos dos grupos el orden debe ser siempre:

```text
COMERCIAL
VENTAS BÁSICO
```

Nunca:

```text
VENTAS BÁSICO
COMERCIAL
```

ni mezclarlos bajo un solo encabezado.

---

# 7. Tabs internas de CRM

Dentro de `COMERCIAL > CRM` conservar las tabs definidas para el CRM completo:

```text
Dashboard | Prospectos | Oportunidades | Pipeline | Actividades | Forecast
```

Estas tabs pertenecen al CRM y NO deben aparecer como módulos separados del Sidebar.

---

# 8. Criterios de aceptación

- Existe grupo `COMERCIAL` en Sidebar.
- Dentro de COMERCIAL existe opción `CRM`.
- COMERCIAL está inmediatamente arriba de `VENTAS BÁSICO`.
- VENTAS BÁSICO conserva `Cotizaciones`, `Pedidos`, `Clientes`.
- CRM puede ocultarse de forma independiente.
- Ocultar CRM no afecta Ventas Básico.
- CRM reutiliza Clientes/Cotizaciones/Pedidos actuales.
- No existen duplicados de maestros ni documentos comerciales.
- Configuración permite controlar CRM independientemente.
- Topbar/breadcrumb muestra `CRM` de forma coherente.
- `npm run build` finaliza sin errores.

---

# 9. No hacer

NO:

- borrar Ventas Básico;
- renombrar Cotizaciones/Pedidos/Clientes como funciones CRM;
- meter las tres páginas dentro del CRM;
- crear duplicados de Clientes/Cotizaciones/Pedidos;
- hacer CRM obligatorio para vender/cotizar;
- crear backend nuevo;
- tocar main, hacer merge o PR.

Este archivo complementa y tiene prioridad sobre cualquier wording de navegación contradictorio en `FASE_10_CRM_COMERCIAL_RTM_PIPELINE_FORECAST_ANALITICA.md`.