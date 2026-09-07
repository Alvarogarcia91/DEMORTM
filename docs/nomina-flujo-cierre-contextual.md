# Nómina RTM — Corrección de UX del Flujo de Cierre

## Problema actual

`PayrollCloseStepper` se renderiza en casi todas las tabs de Nómina mediante una condición global en `NominaPage.tsx`.

Hoy aparece en:

- Resumen
- Personal
- Asistencia
- Incidencias
- Vacaciones
- Préstamos
- Pre-nómina
- Timbrado CFDI

Esto provoca ruido visual y un error conceptual: el flujo de cierre pertenece al **ciclo de nómina**, no a todas las funciones de RH.

Especialmente en Vacaciones, Préstamos y Personal se siente fuera de contexto.

---

# Objetivo

Hacer que el flujo:

**Checadas → Incidencias → Pre-nómina → Autorización → Timbrado**

se muestre únicamente donde ayuda a entender o ejecutar el ciclo de nómina.

No debe funcionar como un segundo navbar ni seguir al usuario por todo el módulo.

---

# Regla de visibilidad

## Mostrar `PayrollCloseStepper` completo SOLO en:

### 1. Resumen

Es el lugar principal.

Aquí debe funcionar como:

**Estado actual del ciclo seleccionado**

Debe mostrar:

- periodo/ciclo activo;
- etapa actual;
- pendientes;
- qué bloquea el cierre;
- acciones contextualizadas `Ver` / `Revisar`.

### 2. Pre-nómina

Puede mostrarse una versión **compacta**, porque aquí el usuario realmente prepara el cierre.

No repetir toda la tarjeta grande si genera ruido.

Preferencia:

- mini progress row;
- estado del ciclo;
- `3 empleados por revisar`;
- `2 incidencias abiertas`;
- CTA `Ir a cierre` o `Validar ciclo`.

### 3. Timbrado CFDI

NO mostrar el stepper completo.

Mostrar únicamente un indicador contextual pequeño, por ejemplo:

`Ciclo SEM-2026-36 · Cerrado · Listo para timbrar`

Si no está cerrado:

`El ciclo debe cerrarse antes de timbrar`

con CTA:

`Ir a Pre-nómina`

---

# Ocultar completamente en

El flujo de cierre NO debe aparecer en:

- Ciclos
- Personal
- Asistencia
- Incidencias
- Vacaciones
- Préstamos
- Historial

Estas pantallas deben tener su propio contexto y dashboard.

Ejemplo:

### Vacaciones

Debe empezar directamente con:

`Vacaciones`

KPIs, solicitudes, saldos y tabla.

Nada de "1 Checadas / 2 Incidencias / 3 Pre-nómina" encima.

### Préstamos

Debe empezar directamente con:

`Préstamos`

KPIs, saldo por recuperar, descuentos del próximo ciclo, tabla y detalle.

### Asistencia

Ya tiene su propia relación con el ciclo mediante el selector global de ciclo. No necesita repetir todo el flujo.

### Incidencias

Puede mostrar una leyenda pequeña del ciclo activo, pero no el stepper.

---

# Cambio técnico esperado

Actualmente existe una condición parecida a:

```tsx
activeTab !== 'ciclos' && activeTab !== 'historial'
```

Esto es demasiado amplio.

Cambiar la lógica para que el componente completo solo se renderice explícitamente en `resumen`.

Ejemplo conceptual:

```tsx
{activeTab === 'resumen' && (
  <PayrollCloseStepper ... />
)}
```

Para `prenomina` y `timbrado`, crear o reutilizar una representación compacta contextual, sin duplicar el componente grande.

NO resolver esto con CSS ocultando cosas después de renderizarlas. La regla debe estar en la lógica de composición de la página.

---

# Jerarquía final de Nómina

La navegación superior del módulo ya sirve como navegación real:

- Ciclos
- Resumen
- Personal
- Asistencia
- Incidencias
- Vacaciones
- Préstamos
- Pre-nómina
- Timbrado CFDI
- Historial

El usuario NO necesita otro menú debajo.

El flujo de cierre es información de proceso, no navegación primaria.

---

# Resumen — layout esperado

En `Resumen`:

```text
Header Nómina
Selector ciclo + Nuevo ciclo + Bitácora + Recalcular
Tabs del módulo

[ Flujo de cierre del ciclo ]

[ KPIs ]
[ Requiere atención ]
[ Tendencias / costos ]
```

---

# Vacaciones — layout esperado

```text
Header Nómina
Selector ciclo + acciones globales
Tabs del módulo

Vacaciones                     [Plantilla] [+ Nueva solicitud]
Control de saldos...

[KPIs Vacaciones]
[Saldos por empleado | Solicitudes]
[Tabla]
```

Sin stepper.

---

# Préstamos — layout esperado

```text
Header Nómina
Selector ciclo + acciones globales
Tabs del módulo

Préstamos                      [+ Registrar préstamo]
Control de préstamos...

[KPIs Préstamos]
[Tabla]
```

Sin stepper.

---

# Pre-nómina — layout esperado

```text
Pre-nómina
Ciclo SEM-2026-36 · En revisión

[barra compacta de progreso]
3 empleados requieren revisión · 2 incidencias pendientes

[tabla pre-nómina]
```

No renderizar la tarjeta completa del flujo de cierre.

---

# Timbrado — layout esperado

```text
Timbrado CFDI
Ciclo SEM-2026-36

[● Cerrado · listo para timbrar]

[KPIs]
[tabla CFDI]
[TIMBRAR NÓMINA]
```

---

# Restricciones

- No rehacer el módulo.
- No cambiar la navegación principal salvo que sea necesario para esta corrección.
- No romper Ciclos, Vacaciones, Préstamos, Pre-nómina ni Timbrado.
- Mantener selector de ciclo global.
- Respetar `docs/design-system.md`.
- No agregar sticky nuevo.
- No crear otra barra de navegación.
- No duplicar `PayrollCloseStepper`.
- Todo debe seguir siendo frontend demo.

---

# Definition of Done

1. `PayrollCloseStepper` completo aparece únicamente en `Resumen`.
2. Vacaciones abre directamente con su dashboard, sin flujo de cierre arriba.
3. Préstamos abre directamente con su dashboard, sin flujo de cierre arriba.
4. Personal, Asistencia e Incidencias ya no muestran el stepper.
5. Pre-nómina muestra solo un resumen compacto del progreso del ciclo.
6. Timbrado muestra solo estado contextual del ciclo.
7. Historial y Ciclos no muestran stepper.
8. No existe ningún segundo navbar visual compitiendo con los tabs principales.
9. `npm run build` termina sin errores.
