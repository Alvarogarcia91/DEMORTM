# RTM — OCULTAR ACTIVOS FIJOS DEL DEMO SIN BORRAR CÓDIGO

## 0. Reglas

- Trabajar **solo en `alvaro01`**.
- Hacer pull antes de modificar.
- No tocar `main`.
- No merge ni PR.
- Auditar primero navegación, `NavigationModulesContext`, `DashboardShell` y Finanzas actual.
- Si existen `frontend/src` y `src`, identificar árbol canónico y usar `sync:frontend` solo si aplica.
- No romper Dashboard Financiero, Facturación, CxC, CxP, Tesorería, Contabilidad, Presupuestos ni Reportes.

---

# 1. Decisión de producto para el demo

**Activos Fijos no debe aparecer en el demo principal de RTM.**

La razón no es que el concepto sea incorrecto en un ERP, sino que en el demo actual agrega ruido y no aporta suficiente valor comparado con los módulos financieros prioritarios.

Para esta demo queremos que FINANZAS se concentre en:

```text
FINANZAS
├─ Dashboard Financiero
├─ Facturación
├─ Cuentas por Cobrar
├─ Cuentas por Pagar
├─ Tesorería & Bancos
├─ Contabilidad General
├─ Presupuestos
└─ Reportes Financieros
```

`Activos Fijos` queda fuera de navegación visible.

---

# 2. NO borrar funcionalidad de forma destructiva

No eliminar componentes, mocks, tipos ni rutas internas de Activos Fijos si ya existen y no generan deuda técnica grave.

La intención es **ocultarlo del demo**, no destruirlo.

Esto permite reactivarlo después si el cliente pregunta por:

- control patrimonial;
- maquinaria capitalizable;
- depreciación;
- altas/bajas de activos;
- vínculo contable con Mantenimiento.

---

# 3. Cambios obligatorios de navegación

## Sidebar

Eliminar `Activos Fijos` de la sección visible FINANZAS.

Antes:

```text
Dashboard Financiero
Facturación
CxC
CxP
Tesorería & Bancos
Contabilidad General
Presupuestos
Activos Fijos
Reportes Financieros
```

Después:

```text
Dashboard Financiero
Facturación
CxC
CxP
Tesorería & Bancos
Contabilidad General
Presupuestos
Reportes Financieros
```

No dejar huecos, separadores raros ni iconos residuales.

## Configuración → Módulos & Navegación

Si `activos-fijos` aparece como módulo configurable visible para usuario demo, ocultarlo también de esa UI.

No queremos que durante demo alguien active un módulo que decidimos sacar de alcance visual.

## NavigationModulesContext

Mantener la key interna si ya la usa código existente, pero:

- no mostrarla como opción visible;
- default visibility debe ser `false` si la estructura actual lo requiere;
- no romper serialización/configuración existente.

---

# 4. Dashboard Financiero

Revisar que no existan CTAs o cards que lleven a `Activos Fijos`.

Si hay:

- “Ver activos”;
- “Activos fijos”;
- “Depreciación”;
- “Valor en libros”;

quitarlos del dashboard del demo o reemplazarlos por métricas que sí pertenecen al alcance actual, por ejemplo:

- posición de caja;
- CxC vencida;
- CxP próxima;
- flujo proyectado;
- presupuesto vs real;
- resultado operativo.

No dejar botones muertos.

---

# 5. Reportes Financieros

Si existe alguna referencia directa a un reporte específico de Activos Fijos dentro del centro de reportes, ocultarla del menú principal del demo.

No eliminar la lógica subyacente si ya existe.

---

# 6. Mantenimiento

No mezclar Mantenimiento con Activos Fijos en esta corrección.

Las máquinas de Mantenimiento deben seguir funcionando con su catálogo actual.

No borrar máquinas, historial, OT, preventivos ni datos operativos.

`Activos Fijos` y `Mantenimiento` son conceptos distintos aunque en una implementación futura puedan vincularse.

---

# 7. Limpieza visual

Buscar globalmente referencias visibles a:

- `Activos Fijos`
- `Activo fijo`
- `Depreciación`
- `Valor en libros`

Clasificar cada resultado:

1. si es parte exclusiva de la UI del módulo oculto → puede permanecer en código no visible;
2. si aparece en navegación/dashboard/reportes principales → ocultar/remover de la experiencia demo;
3. si forma parte de contabilidad genérica → conservar solo si tiene sentido contable fuera del módulo.

No hacer reemplazos ciegos.

---

# 8. Criterios de aceptación

- `Activos Fijos` ya no aparece en Sidebar.
- `Activos Fijos` ya no aparece en Configuración → Módulos & Navegación del demo.
- Ningún CTA principal lleva al módulo oculto.
- Finanzas sigue mostrando correctamente:
  - Dashboard Financiero
  - Facturación
  - CxC
  - CxP
  - Tesorería & Bancos
  - Contabilidad General
  - Presupuestos
  - Reportes Financieros
- Mantenimiento no se rompe.
- Código de Activos Fijos no se borra destructivamente salvo residuos claramente inútiles y no referenciados.
- Build sin errores.

---

# 9. Validación final

1. auditar navegación actual;
2. ocultar Activos Fijos del demo;
3. revisar Configuración;
4. revisar Dashboard Financiero;
5. revisar Reportes Financieros;
6. buscar referencias visibles residuales;
7. ejecutar `sync:frontend` si aplica;
8. ejecutar `npm run build`;
9. corregir errores.

---

# 10. Reporte final

Entregar breve:

- archivos modificados;
- lugares donde se ocultó Activos Fijos;
- confirmación de que no se borró funcionalidad de forma destructiva;
- resultado del build.
