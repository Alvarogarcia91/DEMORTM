# RTM — CENTRO DE ALERTAS TRANSVERSAL PARA DEMO

## Objetivo

Agregar una capa transversal de alertas al ERP demo de Impresos RTM para que el sistema no solo muestre información, sino que también destaque eventos que requieren atención y permita navegar directamente al módulo origen.

Este trabajo es DEMO-FIRST.

NO crear un motor de reglas empresarial real.
NO integrar correo, WhatsApp, SMS ni push reales.
NO crear backend nuevo si no hace falta.
NO inventar políticas reales de RTM.

La intención es demostrar una experiencia tipo ERP moderno con alertas accionables construidas sobre los datos/mock y módulos ya existentes.

---

# 1. AUDITORÍA OBLIGATORIA ANTES DE IMPLEMENTAR

Trabajar solamente en `alvaro01`.

Antes de tocar código:

- hacer pull;
- revisar `frontend/src/components/Topbar.tsx`;
- revisar `frontend/src/components/DashboardShell.tsx`;
- revisar `frontend/src/components/Sidebar.tsx`;
- revisar `NavigationModulesContext`;
- revisar los módulos y mocks actuales de:
  - Inventario;
  - Compras / Requisiciones;
  - Pedidos;
  - Órdenes de Salida;
  - Facturación;
  - CxC;
  - CxP;
  - Nómina;
  - Mantenimiento.

Reutilizar componentes, estados y patrones visuales existentes.

Si existe duplicidad entre `frontend/src` y `src`, respetar el flujo de sincronización vigente del repo y ejecutar `sync:frontend` si aplica.

---

# 2. EXPERIENCIA PRINCIPAL

Agregar una campana de alertas en la Topbar, antes del usuario.

La campana debe mostrar un contador visible cuando existan alertas pendientes.

Ejemplo:

`🔔 8`

Al hacer clic debe abrir un panel lateral / dropdown amplio con las alertas más relevantes.

No saturar la Topbar.

El panel rápido debe mostrar aproximadamente 5–8 alertas y un CTA:

`Ver todas las alertas`

---

# 3. CENTRO DE ALERTAS

Crear una vista completa `Centro de Alertas`.

Puede abrirse desde:

- la campana de Topbar;
- `Ver todas las alertas`;
- opcionalmente desde Inicio si queda natural.

No es obligatorio agregarlo como módulo grande en Sidebar.

Preferencia: campana + vista dedicada, evitando ensuciar navegación.

## Tabs

Usar tabs simples:

1. `Pendientes`
2. `Hoy`
3. `Próximas`
4. `Resueltas`

Puede agregarse filtro por módulo y prioridad.

---

# 4. MODELO DEMO DE ALERTA

Cada alerta debe tener como mínimo:

- id;
- módulo origen;
- referencia;
- título;
- descripción corta;
- prioridad;
- fecha/hora;
- estado;
- responsable opcional;
- CTA principal;
- destino de navegación.

Prioridades visibles:

- Crítica
- Alta
- Media
- Informativa

Estados:

- Pendiente
- Atendida
- Resuelta

No crear workflows de aprobación complejos.

---

# 5. ALERTAS DEMO QUE DEBEN EXISTIR

Crear ejemplos coherentes con los datos reales/documentados que ya usa el demo.

## Inventario

Ejemplo:

**CRÍTICA · INVENTARIO**

`NEWSPRINT_45 por debajo del mínimo`

- disponible: cantidad mock coherente;
- cobertura demo;
- CTA: `Ver inventario`;
- CTA secundario opcional: `Crear requisición`.

También puede existir:

- material retenido por QA;
- lote próximo a agotarse;
- diferencia de conteo;
- material comprometido por arriba de disponible.

## Compras / Requisiciones

- requisición urgente pendiente;
- material crítico sin cobertura;
- orden de compra próxima a vencer/recibir;
- factura proveedor pendiente de corrección.

## Pedidos / Ventas

- pedido con faltante de material;
- pedido próximo a fecha compromiso;
- pedido pendiente de autorización.

NO inventar reglas comerciales reales de descuento o margen como si fueran RTM.

## Órdenes de Salida

- remisión / salida pendiente de confirmar;
- producto terminado listo para salida;
- orden de salida pendiente de carga.

NO reintroducir rutas, TMS, flota o multi-stop.

## Facturación

- factura lista para timbrar;
- borrador pendiente;
- factura timbrada sin CxC ligada si existe un caso demo.

## Cuentas por Cobrar

- factura próxima a vencer;
- factura vencida;
- pago parcial con saldo;
- cliente con saldo vencido alto.

CTA:

- `Ver cuenta`
- `Registrar pago`

## Cuentas por Pagar

- factura proveedor próxima a vencer;
- factura con diferencia entre OC / recepción / factura;
- pago programado para hoy;
- saldo vencido.

Wording visible:

- `Validación`
- `Con diferencia`

NO usar `3-Way Match` como texto protagonista.

## Mantenimiento

Usar máquinas documentadas RTM.

Ejemplos:

- `Mark Andy 830 10" — mantenimiento preventivo vence mañana`;
- `Conserver DiDDE 860 — OT correctiva abierta`;
- máquina fuera de servicio;
- preventivo vencido.

CTA:

- `Ver máquina`
- `Ver OT`
- `Generar OT` si el flujo existente lo soporta.

## Nómina / RH

- incidencias sin resolver;
- checadas incompletas;
- prenómina pendiente de revisar;
- empleados con incidencia antes del cierre.

NO crear alertas sensibles o alarmistas.

---

# 6. PANEL RÁPIDO DE TOPBAR

Diseño sugerido:

Header:

`Alertas`

contador total pendiente.

Filtros rápidos opcionales:

- Todas
- Críticas
- Finanzas
- Operación

Cada item debe verse compacto:

- icono por módulo;
- badge prioridad;
- título;
- referencia;
- fecha relativa;
- CTA implícito al hacer click.

Ejemplo:

`CRÍTICA · INVENTARIO`

`NEWSPRINT_45 por debajo del mínimo`

`Disponible: 8,200 pliegos · cobertura demo 2.3 días`

`Hace 18 min`

Al hacer click debe navegar al módulo correspondiente.

---

# 7. CENTRO DE ALERTAS — DASHBOARD

En la vista completa mostrar KPIs superiores:

- Pendientes
- Críticas
- Vencen hoy
- Resueltas hoy

Agregar resumen por módulo:

- Operaciones
- Compras
- Ventas
- Finanzas
- Mantenimiento
- Nómina

No hacer gráficas complejas si no aportan.

Puede usarse una barra simple o cards de conteo.

---

# 8. TAB PENDIENTES

Tabla/lista principal:

- Prioridad
- Módulo
- Alerta
- Referencia
- Fecha
- Responsable
- Estado
- Acción

Filtros:

- búsqueda;
- módulo;
- prioridad;
- estado;
- periodo.

Acciones demo:

- Ver origen
- Marcar atendida
- Marcar resuelta

Cambiar estado debe actualizar contador de campana localmente.

---

# 9. HOY / PRÓXIMAS / RESUELTAS

## Hoy

Alertas cuyo evento corresponde al día demo actual.

## Próximas

Eventos próximos como:

- vencimientos;
- preventivos;
- pagos programados;
- fechas compromiso.

## Resueltas

Mostrar historial demo:

- quién la resolvió;
- cuándo;
- módulo;
- referencia;
- acción realizada.

---

# 10. NAVEGACIÓN TRANSVERSAL

Este es el punto más importante del módulo.

Las alertas deben llevar a una pantalla útil.

Ejemplos:

- alerta CxC → abrir CxC y, si es viable, el registro/factura correspondiente;
- alerta CxP → abrir CxP y factura proveedor;
- alerta Mantenimiento → abrir máquina u OT;
- alerta Inventario → abrir existencias/artículo;
- alerta Requisición → abrir requisición;
- alerta Pedido → abrir pedido;
- alerta Facturación → abrir factura;
- alerta Nómina → abrir incidencia o vista correspondiente.

Reutilizar los mecanismos de targeted navigation que ya existan en `DashboardShell`.

Si algún destino profundo requiere demasiado refactor, navegar al módulo correcto y destacar el registro mediante filtro/búsqueda prellenada.

NO romper módulos por perseguir deep links perfectos.

---

# 11. DATOS Y REALISMO RTM

Usar los datos más recientes del repo y respetar el MD transversal de realismo RTM.

Preferir:

- números de parte reales/documentados;
- materiales reales/documentados;
- clientes documentados;
- máquinas documentadas RTM.

No reintroducir:

- Super Colchones;
- showroom;
- CEDIS ficticios;
- rutas Monterrey;
- flota inventada;
- máquinas no documentadas.

Si una cifra no está confirmada y solo se requiere para demo, usar una cantidad razonable pero no presentarla como política o dato oficial RTM.

---

# 12. UI / THEME

Respetar el design system existente.

Usar clases theme para:

- fondo;
- botones principales;
- tabs;
- focus;
- active states.

Semánticos:

- rojo = crítico/peligro;
- amber = warning;
- verde = resuelto/success;
- azul = info;
- purple = smart/recomendación si aplica.

Evitar colores hardcodeados salvo semánticos.

La campana debe verse bien en todos los themes actuales.

---

# 13. COMPORTAMIENTO DEMO

Todo puede vivir en memoria/local state.

Se debe poder:

- abrir alerta;
- navegar al módulo;
- marcar atendida;
- marcar resuelta;
- ver que el contador disminuye;
- revisar alertas resueltas.

No hace falta persistencia backend.

Si ya existe localStorage como patrón en el repo, puede usarse opcionalmente para mantener alertas resueltas durante la demo.

---

# 14. CASOS DEMO MÍNIMOS

Debe quedar al menos un caso fuerte por dominio:

1. Inventario bajo mínimo → Ver inventario / Crear requisición.
2. CxC vencida → Ver cuenta / Registrar pago.
3. CxP con diferencia → Ver validación.
4. Mantenimiento preventivo próximo → Ver máquina / OT.
5. Pedido con faltante → Ver pedido.
6. Factura lista para timbrar → Ver factura.
7. Nómina con incidencia pendiente → Ver incidencia.
8. Orden de salida pendiente → Ver salida.

---

# 15. NO HACER

NO:

- crear backend;
- crear motor real de notificaciones;
- agregar cron jobs;
- enviar emails;
- mandar SMS;
- meter WhatsApp;
- agregar IA generativa;
- crear permisos complejos;
- crear un módulo nuevo gigantesco en Sidebar si la campana + vista dedicada resuelve;
- duplicar estados que ya existen en módulos;
- cambiar reglas de negocio actuales;
- tocar Producción o Calidad todavía.

---

# 16. ACCEPTANCE CHECKLIST

Antes de terminar validar:

- campana visible en Topbar;
- contador correcto;
- panel rápido abre/cierra;
- `Ver todas las alertas` abre Centro de Alertas;
- tabs Pendientes / Hoy / Próximas / Resueltas;
- filtros funcionan localmente;
- marcar atendida/resuelta funciona;
- contador cambia;
- al menos 8 alertas demo coherentes;
- navegación a módulos funciona;
- no hay residuos Super Colchones;
- no hay TMS/showroom reintroducido;
- máquinas corresponden al catálogo RTM documentado;
- responsive aceptable;
- themes siguen funcionando;
- `npm run build` pasa.

Si aplica el flujo duplicado del repo, ejecutar también `npm run sync:frontend` antes del build final y verificar ambos árboles.

---

# 17. REPORTE FINAL DE ANTI

Al terminar responder breve con:

- archivos creados/modificados;
- alertas demo creadas;
- destinos de navegación implementados;
- si usó localStorage o state;
- resultado de build;
- cualquier limitación restante.
