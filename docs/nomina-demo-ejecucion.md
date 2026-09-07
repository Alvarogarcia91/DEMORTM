# Impresos RTM — Nómina Demo · Reglas de ejecución

Este documento complementa `docs/nomina-demo.md` y concentra las instrucciones de implementación para Antigravity.

## Regla maestra

Antes de programar, auditar el repo completo y entender navegación, layout, theme dinámico, dark mode, tablas, drawers/modales, toasts/banners, componentes compartidos, mocks y patrones existentes.

Leer completos:

- `docs/nomina-demo.md`
- `docs/design-system.md`

La especificación funcional es `docs/nomina-demo.md`. No simplificarla ni convertir Nómina en una página genérica de RH.

## Alcance técnico

Es un demo frontend.

NO implementar:

- backend;
- DB;
- API real;
- PAC real;
- SAT real;
- CFDI fiscalmente válido;
- cálculo fiscal real;
- Excel real;
- reloj checador real;
- banca real;
- correo real.

SÍ implementar:

- flujo visual completo;
- estados locales;
- mocks consistentes;
- filtros y búsquedas;
- tablas;
- modales/drawers;
- stepper de cierre;
- toasts/banners;
- imports/exports simulados;
- timbrado simulado;
- errores parciales y reintento;
- historial de cambios;
- dark mode y theme actual.

## Interacciones demo

Ningún botón importante puede quedar muerto.

Para acciones fake usar el patrón:

1. clic;
2. loading 300–900 ms;
3. toast/banner;
4. modal de resultado cuando aporte valor;
5. actualizar estado local si mejora la narrativa del demo.

No usar `alert()` del navegador.

Esto aplica especialmente a:

- Descargar plantilla;
- Importar plantilla;
- Exportar empleados;
- Importar checadas;
- Descargar plantilla de checadas;
- Recalcular asistencia;
- Exportar asistencia;
- Importar incidencias;
- Importar ajustes;
- Exportar pre-nómina;
- Validar pre-nómina;
- Cerrar nómina;
- Solicitar reapertura;
- Timbrar nómina;
- Reintentar pendientes;
- Descargar XML/PDF;
- Descargar recibos ZIP;
- Generar layout bancario;
- Exportar resumen contable;
- Enviar recibos.

## UX obligatoria que debe lucir

### Asistente de cierre

Mostrar claramente:

`Checadas → Incidencias → Pre-nómina → Autorización → Timbrado`

con estados Completo / Requiere atención / Pendiente / Cerrado.

### Centro de atención

El dashboard no debe ser solo KPIs. Debe tener pendientes clicables y llevar al usuario al detalle.

### Personal

`Descargar plantilla`, `Importar plantilla` y `Exportar empleados` deben reaccionar visualmente.

Importar plantilla debe incluir drag & drop fake, preview y resultado como:

`30 registros procesados · 30 correctos · 0 rechazados`.

### Asistencia

Importar checadas debe simular:

`1,284 procesadas · 1,279 válidas · 5 requieren revisión`.

Recalcular semana debe mostrar proceso y resultado.

### Conciliación RTM

Es uno de los puntos más importantes del módulo.

Comparar horas de reloj contra horas registradas en producción, mostrando OP/máquina y diferencia. Una diferencia alta genera alerta operativa, pero NO modifica automáticamente la nómina.

### Incidencias

Debe lucir especialmente `Permiso con reposición`, con saldo por reponer e historial de reposiciones.

### Pre-nómina

Debe ser una de las vistas principales del demo. Mostrar estados de validación, detalle de percepciones/deducciones y origen de cada concepto.

### Cierre

Flujo:

`Borrador → En revisión → Autorizada → Cerrada → Timbrada`

Cerrar nómina requiere checklist. Después debe mostrarse bloqueada con candado y opción demo de `Solicitar reapertura` con motivo.

### Timbrado

Debe sentirse como una consola administrativa realista.

Flujo demo:

1. Timbrar 30 empleados.
2. Terminar inicialmente con 28 correctos y 2 con error.
3. Mostrar errores fiscales mock creíbles.
4. Permitir corrección visual.
5. Reintentar pendientes.
6. Terminar `30 de 30 CFDI timbrados correctamente`.

No generar XML/PDF fiscal real.

### Preparar pago

Después del timbrado mostrar acciones demo de layout bancario, resumen contable, recibos ZIP y envío de recibos.

## Datos

Usar los 30 empleados definidos en `docs/nomina-demo.md`.

No crear otra plantilla distinta ni convertir la mayoría en administrativos.

Centralizar empleados, periodos, checadas, incidencias, cálculos, timbrado e historial en mocks/helpers dedicados. No repetir arrays gigantes dentro de componentes.

## Diseño

Obedecer `docs/design-system.md` y reutilizar primitives actuales.

No crear un segundo design system.

Mantener:

- superficies del theme;
- texto legible;
- borders/dots semánticos;
- CTA del theme;
- dark mode;
- selector de color;
- tablas y modales consistentes con el ERP.

Evitar cards pastel gigantes y UI tipo landing.

## Arquitectura

Auditar antes de crear carpetas nuevas. Si el repo ya tiene un patrón, seguirlo.

No hacer refactors globales innecesarios.

No romper módulos existentes.

## Validación final obligatoria

Al terminar:

1. ejecutar `npm run build`;
2. corregir todos los errores TypeScript/Vite;
3. revisar desktop, tablas, modales, drawers y overflow;
4. revisar dark mode/theme;
5. verificar que ningún botón principal esté muerto;
6. entregar resumen de archivos creados/modificados, componentes reutilizados, interacciones fake y resultado del build.

Trabajar únicamente en la branch `alvaro01`. No hacer push a `main`.
