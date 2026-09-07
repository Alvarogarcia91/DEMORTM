# Impresos RTM — Ajustes UX finales del módulo de Nómina

## Objetivo

Corregir la experiencia actual del módulo de Nómina sin rehacer su lógica ni sus mocks.

El módulo ya implementado tiene buena cobertura funcional, pero la jerarquía visual actual genera confusión: el bloque superior de etapas se percibe como un segundo navbar y compite con las tabs reales del módulo.

La historia del demo debe ser muy clara:

**Importar checadas → revisar incidencias → validar pre-nómina → autorizar/cerrar → timbrar CFDI → preparar pago**

---

## 1. Problema actual

Actualmente existe un bloque grande de 5 etapas:

1. Checadas
2. Incidencias
3. Pre-nómina
4. Autorización
5. Timbrado

Y debajo existen tabs reales:

- Resumen
- Personal
- Asistencia
- Incidencias
- Pre-nómina
- Timbrado CFDI
- Historial

Visualmente se sienten como **dos navegaciones simultáneas**.

El stepper debe ser un **resumen del estado del periodo**, no una segunda barra de navegación dominante.

---

## 2. Nueva jerarquía visual requerida

### Navegación principal

Las tabs del módulo son la navegación principal y deben permanecer:

- Resumen
- Personal
- Asistencia
- Incidencias
- Pre-nómina
- Timbrado CFDI
- Historial

Estas deben ser el único elemento que se perciba como navegación interna.

### Stepper / Asistente de cierre

El stepper debe:

- dejar de ser sticky;
- dejar de sentirse como navbar;
- ser más compacto;
- mostrarse como tarjeta de progreso del periodo;
- vivir preferentemente dentro de `Resumen` o como tarjeta superior discreta;
- mantener estados y links `Ir`, pero como accesos contextuales, no como navegación primaria;
- ocupar menos alto vertical;
- reducir padding y separación entre pasos;
- poder colapsarse visualmente en pantallas menores.

No eliminar la lógica de estado del stepper.

---

## 3. Flujo funcional que debe entenderse en demo

### Paso 1 — Asistencia

El usuario entra a **Asistencia**.

Acción principal:

**Importar checadas**

Es una simulación frontend de un archivo proveniente del reloj checador.

El modal debe explicar claramente que acepta demo:

- Excel `.xlsx`
- CSV
- exportación de reloj checador

Resultado esperado demo:

`1,284 checadas procesadas`

`1,279 válidas`

`5 requieren revisión`

Después se muestra la matriz semanal de 30 empleados.

### Paso 2 — Incidencias

Las anomalías de asistencia generan incidencias:

- retardo;
- falta;
- checada incompleta;
- horas adicionales;
- permiso;
- vacaciones;
- incapacidad;
- permiso con reposición.

RH revisa, autoriza o rechaza.

### Paso 3 — Conciliación con Producción

Para operadores se puede comparar:

- horas del reloj;
- horas registradas en producción;
- máquina;
- orden de producción;
- diferencia.

Esto es una **alerta de validación**, no una deducción automática.

Ejemplo:

`Reloj: 9.10 h`

`Producción: 6.75 h`

`Diferencia: 2.35 h`

`Estado: Revisar`

### Paso 4 — Pre-nómina

La pre-nómina toma la asistencia e incidencias ya revisadas.

Debe mostrar:

- sueldo;
- días;
- horas ordinarias;
- horas adicionales;
- percepciones;
- deducciones;
- ISR mock;
- IMSS mock;
- neto;
- validaciones;
- estado.

El objetivo visual es dejar claro:

`27 listos · 2 requieren revisión · 1 bloqueado`

### Paso 5 — Autorización y cierre

Una vez resueltos los pendientes:

**Borrador → En revisión → Autorizada → Cerrada**

Al cerrar, mostrar checklist y candado.

Los cambios posteriores requieren reapertura con motivo.

### Paso 6 — Timbrado CFDI

En `Timbrado CFDI`:

- ejecutar simulación de PAC;
- mostrar progreso;
- terminar inicialmente con 28 correctos / 2 errores;
- permitir corregir/reintentar;
- terminar 30/30.

### Paso 7 — Preparar pago

Después del timbrado:

- Generar layout bancario
- Exportar resumen contable
- Descargar recibos ZIP
- Enviar recibos

Todo simulado con feedback visual.

---

## 4. Wording que debe quedar claro

Evitar wording ambiguo.

Preferir:

- `Importar checadas`
- `Archivo del reloj checador`
- `Revisar incidencias`
- `Validar pre-nómina`
- `Cerrar nómina`
- `Timbrar CFDI`
- `Preparar pago`

El usuario debe entender sin explicación externa qué sucede en cada etapa.

---

## 5. Resumen / Dashboard

En `Resumen`, agregar o reforzar un bloque tipo:

### Flujo del periodo

`1. Checadas importadas`  ✓

`2. Incidencias por revisar`  2

`3. Pre-nómina por validar`  3

`4. Autorización`  Pendiente

`5. Timbrado`  Pendiente

Esto sustituye visualmente el stepper gigante.

También mantener:

- KPIs del periodo;
- `Requiere tu atención`;
- accesos rápidos.

---

## 6. Revisión de integración del módulo

Verificar en la app canónica que Nómina esté completamente integrada a:

- `Sidebar`;
- `DashboardShell`;
- `NavigationModulesContext`;
- `ConfiguracionView > Módulos & Navegación`;
- iconos del configurador;
- categorías visibles `Finanzas` y `Nómina & RH`.

El toggle de `Nómina & Asistencia` debe ocultar/mostrar el módulo inmediatamente en Sidebar y persistir como el resto de módulos.

No mantener implementaciones duplicadas entre `src/` y `frontend/src/`.

Auditar cuál es la aplicación canónica y trabajar solo sobre ella.

---

## 7. No cambiar

No rehacer:

- mocks de 30 empleados;
- incidencias existentes;
- conciliación reloj vs producción;
- pre-nómina;
- timbrado demo;
- historial;
- flujo de estados;
- imports/exports fake.

El cambio solicitado es principalmente de:

- jerarquía UX;
- integración de navegación;
- claridad de flujo;
- wording;
- consistencia visual.

---

## 8. Definition of Done

1. Ya no hay un stepper grande/sticky que parezca segundo navbar.
2. Las tabs son claramente la navegación principal.
3. El flujo `Importar checadas → Incidencias → Pre-nómina → Cierre → Timbrado` se entiende sin explicación.
4. `Importar checadas` deja claro que simula Excel/CSV del reloj.
5. Nómina aparece en `Configuración > Módulos & Navegación`.
6. Se puede ocultar y mostrar desde Configuración.
7. Finanzas y Nómina aparecen con categoría e icono correctos en Configuración.
8. No existen dos implementaciones activas del frontend.
9. `npm run build` pasa sin errores.
10. No se rompe la lógica ya implementada del módulo.
