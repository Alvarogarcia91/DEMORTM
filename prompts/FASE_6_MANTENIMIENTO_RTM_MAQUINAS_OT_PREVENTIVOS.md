# FASE 6 — MANTENIMIENTO RTM

## Objetivo

Incorporar al demo RTM un módulo de **Mantenimiento** industrial integrado al ERP existente, enfocado en:

- maestro de máquinas y equipos;
- órdenes de mantenimiento;
- correctivos;
- preventivos;
- historial por activo;
- tiempo detenido;
- consumo de refacciones;
- faltantes de refacción conectados con Requisiciones / Compras;
- indicadores operativos de mantenimiento.

La meta es construir un módulo convincente para demo industrial, NO un CMMS completo ni una implementación de mantenimiento predictivo.

El módulo debe reutilizar el diseño, navegación, tablas, modales, status badges, themes y patrones ya existentes en `alvaro01`.

---

# 0. Auditoría obligatoria antes de programar

Antes de crear componentes nuevos:

1. hacer pull de `alvaro01`;
2. auditar el estado actual del repo;
3. revisar `Sidebar`, `DashboardShell`, `NavigationModulesContext`, `ConfiguracionView` y los patrones actuales de módulos;
4. revisar componentes reutilizables de Inventario, Compras, Requisiciones y dashboards;
5. revisar los documentos RTM disponibles sobre máquinas/capacidad antes de poblar mocks;
6. no asumir que nombres/modelos de maquinaria vistos en mocks antiguos son reales;
7. no tocar Producción ni Calidad salvo enlaces o placeholders necesarios para dejar preparado el futuro flujo;
8. no rehacer navegación ni crear una arquitectura paralela.

Si el repo cambió desde la creación de este MD, prevalece el estado actual del repo siempre que no contradiga las reglas funcionales de este documento.

---

# 1. Navegación

Agregar **Mantenimiento** como módulo configurable dentro del sistema de navegación existente.

Debe poder prenderse/apagarse desde:

**Configuración → Módulos & Navegación**

No crear cinco entradas nuevas en el Sidebar.

El Sidebar debe mostrar solamente:

```text
Mantenimiento
```

Al entrar, usar navegación interna por tabs:

```text
Dashboard | Máquinas & Equipos | Órdenes | Preventivos | Historial
```

Si el sistema actual agrupa módulos por secciones, ubicar Mantenimiento en una sección coherente de Operaciones / Planta.

Default de visibilidad: puede quedar oculto por defecto si eso es consistente con la estrategia de demo modular actual.

---

# 2. Dashboard de Mantenimiento

El dashboard debe ser compacto y accionable.

Debe responder de inmediato:

- ¿qué equipo está detenido?
- ¿qué orden está abierta?
- ¿qué mantenimiento preventivo vence pronto?
- ¿qué activos tienen incidencias repetidas?
- ¿cuánto tiempo de paro se ha registrado?

## KPIs sugeridos

Mostrar 4–5 KPIs como máximo:

- Equipos operativos
- Equipos fuera de servicio
- OT abiertas
- Preventivos próximos 7 días
- Tiempo detenido del periodo

Opcional, si cabe bien visualmente:

- MTTR demo
- MTBF demo

Si se muestran MTTR/MTBF deben incluir leyenda discreta:

> Indicador calculado sobre datos demo.

No mostrar OEE todavía.

## Bloque “Requiere atención”

Ejemplos mock coherentes:

- equipo detenido por correctivo;
- preventivo próximo a vencer;
- OT en espera de refacción;
- inspección próxima;
- activo con repetición de fallas.

Cada tarjeta debe tener CTA real hacia el detalle correspondiente.

## Órdenes abiertas

Tabla compacta con:

- OT
- Equipo
- Tipo
- Prioridad
- Estado
- Tiempo abierto
- Responsable
- Acción

## Próximos preventivos

Mostrar:

- Equipo
- Plan
- Frecuencia
- Próxima fecha / contador
- Estado
- Acción `Generar OT`

---

# 3. Maestro de Máquinas & Equipos

Este submódulo es el catálogo central de activos mantenibles.

No crear un módulo separado llamado “Máquinas”. Debe vivir dentro de Mantenimiento.

## Tabla principal

Columnas sugeridas:

- Código
- Equipo
- Área
- Tipo
- Estado
- Criticidad
- Último mantenimiento
- Próximo preventivo
- OT abiertas
- Acción

## Estados de equipo

Usar un set pequeño y claro:

- Operativo
- Mantenimiento programado
- Fuera de servicio
- En inspección
- Inactivo

No usar colores arbitrarios:

- verde = operativo;
- ámbar = programado / inspección;
- rojo = fuera de servicio;
- neutral = inactivo.

## Datos del activo

El detalle puede incluir:

- código interno;
- nombre;
- categoría / tipo de equipo;
- área;
- fabricante/modelo SOLO si está soportado por fuente o se marca DEMO;
- número de serie SOLO demo / no real si se usa;
- criticidad;
- responsable;
- fecha alta;
- estado;
- contador de horas/ciclos si aplica;
- última intervención;
- siguiente preventivo;
- documentos/manuales;
- observaciones.

No inventar capacidades productivas, velocidades, formatos, marcas o modelos como si fueran confirmados por RTM.

---

# 4. Detalle de Máquina / Equipo

El detalle debe sentirse como una ficha de activo industrial.

Tabs sugeridos:

```text
Resumen | Preventivos | Órdenes | Historial | Documentos
```

## Resumen

Mostrar:

- Estado actual
- Área
- Criticidad
- Último mantenimiento
- Próximo preventivo
- OT abiertas
- Tiempo detenido acumulado demo

CTA principal:

**Crear orden de mantenimiento**

## Preventivos

Mostrar planes asociados al activo.

## Órdenes

Mostrar OT abiertas y cerradas asociadas.

## Historial

Timeline cronológico de intervenciones.

## Documentos

Mock visual de:

- manual;
- ficha técnica;
- checklist;
- procedimiento.

No subir documentos reales ni crear backend documental.

---

# 5. Órdenes de Mantenimiento

La OT es la unidad principal de trabajo del módulo.

## Tipos

- Correctivo
- Preventivo
- Inspección

No agregar predictivo todavía.

## Prioridades

- Baja
- Normal
- Alta
- Urgente

## Estados

Usar un flujo corto:

```text
Solicitada
→ Programada
→ En proceso
→ En espera de refacción
→ Terminada
```

También permitir:

- Cancelada

No crear 10–15 estados.

---

# 6. Crear Orden de Mantenimiento

CTA global:

**Nueva OT**

También debe poder abrirse desde el detalle de un equipo con equipo ya precargado.

## Campos mínimos

- Equipo
- Tipo
- Prioridad
- Falla / trabajo requerido
- Equipo detenido: sí/no
- Fecha detección
- Solicitado por
- Responsable / técnico opcional
- Fecha programada opcional
- Observaciones

Si `Equipo detenido = Sí`, el estado visual del activo debe poder reflejar `Fuera de servicio` mientras la OT esté activa, al menos dentro del estado local/mock del módulo.

No afectar todavía un planeador real de Producción.

## Folio demo

Ejemplo:

```text
OT-MTTO-2026-0042
```

---

# 7. Detalle de OT

La pantalla debe mostrar claramente:

- folio;
- equipo;
- tipo;
- prioridad;
- estado;
- solicitante;
- responsable;
- fecha apertura;
- fecha programada;
- si el equipo está detenido;
- tiempo de paro;
- descripción del problema / trabajo requerido.

## Secciones operativas

### Diagnóstico

Campo editable demo para registrar diagnóstico.

### Trabajo realizado

Campo editable demo.

### Refacciones / consumibles

Ver sección específica abajo.

### Tiempo

- Inicio trabajo
- Fin trabajo
- Tiempo total intervención
- Tiempo detenido

### Cierre

Al terminar pedir al menos:

- trabajo realizado;
- fecha/hora de cierre;
- estado final del equipo;
- observación de liberación.

CTA:

**Terminar orden**

## Timeline

Ejemplo:

```text
10:32  Falla reportada
10:40  OT creada
11:05  Técnico asignado
11:20  Trabajo iniciado
13:57  Equipo liberado
```

---

# 8. Mantenimiento Preventivo

Crear tab **Preventivos**.

Debe permitir planes simples asociados a equipos.

## Tipos de frecuencia

### Calendario

- cada X días;
- semanal;
- mensual;
- trimestral.

### Contador

- horas;
- ciclos.

No implementar IoT ni lectura automática de contadores.

Los contadores son datos mock/editables del demo.

## Tabla de planes

Columnas:

- Equipo
- Plan
- Frecuencia
- Última ejecución
- Próxima ejecución
- Estado
- Acción

## Estados

- Vigente
- Próximo
- Vencido
- Pausado

## Acción

**Generar OT**

Al usarla, crear una OT Preventiva precargada.

Puede existir un toast tipo:

> OT preventiva generada para demo.

No decir que existe scheduler backend real.

---

# 9. Historial

Crear tab global **Historial** y también historial por activo.

Tabla:

- Fecha
- OT
- Equipo
- Tipo
- Diagnóstico resumido
- Tiempo detenido
- Responsable
- Estado

Filtros:

- periodo;
- equipo;
- tipo;
- estado.

Agregar selector de periodo visual coherente con otros dashboards.

## Indicadores por equipo

En historial de máquina mostrar:

- número de OT;
- correctivos;
- preventivos;
- tiempo detenido;
- MTTR demo;
- MTBF demo.

No afirmar que estos KPIs son históricos reales de RTM.

---

# 10. Refacciones y consumibles

No crear un módulo separado de Refacciones.

Dentro de una OT debe existir una sección:

**Refacciones / consumibles utilizados**

Debe reutilizar, cuando sea posible, el catálogo / inventario actual.

## Flujo esperado

```text
OT
→ buscar artículo / insumo
→ seleccionar cantidad
→ validar existencia visual
→ agregar a OT
```

Ejemplos demo:

- rodamiento;
- lubricante;
- aceite;
- correa;
- filtro;
- fusible;
- consumible general.

No utilizar materiales de impresión como refacciones mecánicas salvo que tenga sentido.

## Si falta inventario

Mostrar:

```text
Existencia insuficiente
```

CTA:

**Crear requisición**

Debe navegar/reutilizar el flujo actual de Requisiciones, idealmente precargando:

- artículo;
- cantidad;
- referencia de OT;
- motivo: mantenimiento.

Si el flujo actual no soporta prefill, implementar una navegación/demo sencilla sin reescribir Requisiciones.

---

# 11. Relación con Inventario y Compras

La integración del demo debe contar esta historia:

```text
Máquina falla
→ OT correctiva
→ requiere refacción
→ no existe suficiente stock
→ Requisición
→ Compras
→ recepción
→ disponible para Mantenimiento
→ OT continúa
```

No implementar backend de reservas ni movimientos contables reales en esta fase.

Debe sentirse conectado mediante navegación, referencias y datos mock coherentes.

---

# 12. Preparación futura para Producción

Mantenimiento debe quedar preparado conceptualmente para que Producción pueda consultar disponibilidad de equipo en una fase futura.

Ejemplo futuro:

```text
Prensa X
Estado: Fuera de servicio
OT-MTTO-2026-0042
Bloqueada hasta: 07 Sep 16:00
```

PERO EN ESTA FASE:

- NO crear módulo Producción;
- NO crear OP;
- NO crear Gantt de producción;
- NO crear scheduler;
- NO bloquear capacidad productiva real;
- NO inventar integración automática.

Solo mantener campos/estado reutilizables para una conexión posterior.

---

# 13. Datos demo

Crear un set de activos industrialmente coherente con RTM.

Usar nombres genéricos cuando no haya fuente suficiente, por ejemplo:

- Prensa Offset 01
- Prensa Flexo 01
- Prensa Flexo 02
- Guillotina 01
- Troqueladora 01
- Equipo de Serigrafía 01
- Compresor Planta
- Montacargas 01

Si documentos actuales soportan nombres reales de activos, se pueden reutilizar.

No afirmar marcas/modelos reales sin fuente.

## Mínimo de datos

Crear aproximadamente:

- 10–15 activos;
- 8–12 OT históricas;
- 4–6 OT abiertas;
- 6–10 planes preventivos;
- varios casos con y sin paro;
- al menos un caso `En espera de refacción`;
- al menos un caso donde se pueda navegar a Requisiciones.

---

# 14. Caso demo principal

Preparar un caso fácil de enseñar:

```text
Prensa Flexo 02
→ reporta vibración anormal
→ equipo detenido
→ OT-MTTO-2026-0042
→ Correctivo / Alta
→ diagnóstico: rodamiento con juego
→ requiere rodamiento
→ stock insuficiente
→ Crear requisición
→ OT queda En espera de refacción
```

Y otro caso preventivo:

```text
Guillotina 01
→ Preventivo vence mañana
→ Generar OT
→ OT preventiva creada
→ Programada
```

Todo debe estar marcado como demo cuando sean datos inventados.

---

# 15. Diseño / UX

Seguir el design system existente.

- theme dinámico;
- CTA con `theme-primary`;
- semantic colors solamente para estados;
- cards compactas;
- números tabulares;
- tablas con búsqueda/filtros;
- modales/drawers existentes reutilizados;
- no introducir otra librería UI;
- responsive consistente con el resto del ERP;
- probar RTM / Graphite / Emerald y cualquier theme activo del proyecto.

No hardcodear color de branding.

---

# 16. Dashboard y naming

Usar wording industrial claro:

- Máquina
- Equipo
- Activo
- Orden de mantenimiento
- Correctivo
- Preventivo
- Inspección
- Fuera de servicio
- Tiempo detenido
- Refacción
- Liberación de equipo

Evitar wording automotriz tipo “unidad vehicular” salvo montacargas/equipo móvil cuando aplique.

---

# 17. No construir en esta fase

NO implementar:

- OEE real;
- TPM completo;
- mantenimiento autónomo;
- IoT;
- telemetría;
- sensores;
- mantenimiento predictivo con IA;
- SCADA;
- integración PLC;
- depreciación contable;
- activos fijos contables;
- costos contables reales;
- presupuesto de mantenimiento;
- almacén independiente de refacciones;
- compras automáticas;
- proveedores especializados de mantenimiento;
- Producción;
- Calidad;
- Gantt productivo;
- backend nuevo;
- APIs reales.

---

# 18. Criterios de aceptación

La fase queda aceptada cuando:

1. Mantenimiento existe como módulo configurable.
2. Tiene Dashboard, Máquinas & Equipos, Órdenes, Preventivos e Historial.
3. Existe maestro de equipos con estado y criticidad.
4. Puede abrirse detalle de equipo.
5. Puede crearse una OT desde el módulo.
6. Puede crearse una OT desde una máquina ya seleccionada.
7. Se soporta Correctivo, Preventivo e Inspección.
8. Una OT puede pasar a En proceso, En espera de refacción y Terminada.
9. Puede registrarse diagnóstico y trabajo realizado.
10. Puede registrarse tiempo detenido.
11. Puede agregarse una refacción desde datos de inventario/demo.
12. Falta de refacción ofrece CTA a Requisición.
13. Un preventivo puede generar una OT.
14. Existe historial global y por equipo.
15. Dashboard muestra casos accionables.
16. No se implementó Producción accidentalmente.
17. No se inventan marcas/modelos RTM como reales.
18. No aparecen residuos Super Colchones/retail.
19. Todos los themes siguen funcionando.
20. `npm run build` termina sin errores.

---

# 19. Smoke test manual obligatorio

Probar al menos:

### Caso A — Correctivo con paro

1. Abrir Mantenimiento.
2. Entrar a Prensa Flexo 02.
3. Crear OT correctiva.
4. Marcar equipo detenido.
5. Registrar diagnóstico.
6. Agregar refacción.
7. Simular faltante.
8. Navegar a Requisiciones.
9. Regresar a OT.
10. Cambiar a En espera de refacción.

### Caso B — Preventivo

1. Abrir Preventivos.
2. Seleccionar Guillotina 01.
3. Ver mantenimiento próximo.
4. Generar OT.
5. Ver OT programada.
6. Iniciar trabajo.
7. Terminar OT.
8. Confirmar actualización del historial.

### Caso C — Dashboard

1. Revisar KPIs.
2. Abrir una alerta de equipo detenido.
3. Abrir un preventivo próximo.
4. Validar filtros de periodo.

---

# 20. Validación técnica final

Antes de terminar:

```bash
cd frontend
npm run build
```

Corregir cualquier error TypeScript/build.

Además revisar:

- consola sin errores evidentes;
- imports muertos;
- botones sin acción;
- modales que no cierran;
- navegación rota;
- overflow de tablas;
- themes;
- datos mock incoherentes;
- residuos Super Colchones.

No trabajar en `main`.
No hacer merge.
No abrir PR.

Al finalizar reportar:

1. resumen de implementación;
2. archivos modificados;
3. componentes reutilizados;
4. flujos demo disponibles;
5. supuestos demo;
6. pendientes reales;
7. resultado de `npm run build`.
