# MEJORA PRESUPUESTOS FINANZAS RTM — CONTROL POR CENTRO, VARIACIONES Y TRAZABILIDAD

## 0. Reglas

- Trabajar solo en `alvaro01`.
- Hacer pull antes de editar.
- No tocar `main`.
- No hacer merge ni PR.
- Auditar primero la implementación actual de `BudgetWorkspace` y `FinanceWorkspace`.
- Reutilizar la lógica y componentes financieros actuales.
- Mantener demo/frontend-first, sin backend nuevo.
- No inventar políticas presupuestales reales de RTM.
- No afirmar montos, responsables o límites como datos reales de RTM; son demo.
- Mantener theme RTM, responsive y design system actual.
- Si existen `frontend/src` y `src`, identificar árbol canónico y ejecutar `sync:frontend` solo si aplica.

---

# 1. Problema actual

La pantalla de Presupuestos se siente incompleta cuando solo muestra KPIs.

Debe responder de forma clara:

- cuánto presupuesto existe;
- cuánto se ha ejercido;
- cuánto está comprometido;
- cuánto queda disponible;
- qué centro de costo está cerca de agotarse;
- qué documentos explican el gasto;
- dónde existe variación contra plan;
- qué puede hacer el usuario desde esta pantalla.

Presupuestos debe sentirse como un módulo operativo de control financiero, no como una tarjeta resumen.

---

# 2. Arquitectura final

Mantener una sola entrada `Presupuestos` dentro de FINANZAS.

Tabs internas:

```text
Resumen | Presupuestos | Presupuesto vs Real | Centros de Costo | Compromisos
```

No crear nuevos módulos en sidebar.

---

# 3. RESUMEN

## KPIs superiores

Mostrar:

- Presupuesto anual
- Ejercido
- Comprometido
- Disponible
- Variación vs plan
- % de ejecución

Los KPIs deben reaccionar al periodo y al filtro de centro de costo cuando aplique.

## Gráfica principal

`Presupuesto vs Real · mensual`

Debe mostrar por mes:

- presupuesto
- gasto real
- comprometido

Usar una gráfica real y legible. Si Recharts ya existe en el repo, reutilizarlo. No volver a hacer pseudo-gráficas con divs si ya hay librería instalada.

Agregar tooltip con:

- mes
- presupuesto
- ejercido
- comprometido
- variación

## Atención presupuestal

Bloque de alertas con centros que requieran atención.

Ejemplos demo:

- Mantenimiento · 92% consumido
- Flexografía · 87% comprometido
- Administración · desviación favorable
- Offset · excedido

Estados semánticos:

- Dentro de presupuesto
- Atención
- Excedido
- Sin presupuesto asignado

---

# 4. TAB PRESUPUESTOS

Crear tabla operativa de presupuestos.

Columnas:

- Presupuesto / folio
- Centro de costo
- Responsable
- Periodo
- Presupuesto aprobado
- Ejercido
- Comprometido
- Disponible
- Variación
- % ejecución
- Estado
- Acciones

Acciones:

- Ver detalle
- Ajustar presupuesto
- Transferir presupuesto
- Cerrar periodo
- Exportar

Botón principal:

`+ Nuevo presupuesto`

El flujo de nuevo presupuesto puede ser demo/local, pero debe abrir modal o wizard real, no solo banner.

Campos sugeridos:

- nombre / concepto
- periodo
- centro de costo
- responsable
- monto aprobado
- notas

No inventar aprobaciones complejas.

---

# 5. PRESUPUESTO VS REAL

Crear vista comparativa fuerte.

## Gráficas

1. Presupuesto vs Real mensual
2. Variación mensual
3. % ejecución acumulado
4. Top centros con mayor desviación

## Tabla comparativa

Columnas:

- Centro de costo
- Presupuesto
- Real
- Comprometido
- Proyección
- Variación $
- Variación %
- Estado

Permitir seleccionar un centro y abrir su detalle.

---

# 6. CENTROS DE COSTO

Usar centros demo coherentes con RTM, por ejemplo:

- Offset
- Flexografía
- Serigrafía / Acabados
- Mantenimiento
- Calidad
- Compras
- Administración

No afirmar estructura contable oficial de RTM.

Cada centro debe mostrar:

- presupuesto
- ejercido
- comprometido
- disponible
- % ejecución
- tendencia
- responsable demo
- documentos relacionados

Al abrir un centro, mostrar detalle con:

```text
Resumen | Partidas | Compromisos | Movimientos | Historial
```

---

# 7. DETALLE DEL CENTRO DE COSTO

## Resumen

KPIs:

- presupuesto aprobado
- ejercido
- comprometido
- disponible
- variación

## Partidas

Mostrar partidas demo como:

- materiales
- servicios
- mantenimiento
- fletes
- nómina indirecta
- gastos administrativos

Cada partida debe tener:

- presupuesto
- real
- comprometido
- disponible
- estado

## Compromisos

Vincular visualmente a documentos existentes cuando sea posible:

- OC
- factura proveedor
- CxP
- nómina
- gasto recurrente

## Movimientos

Timeline de consumos y ajustes.

## Historial

Cambios demo:

- presupuesto creado
- ajuste registrado
- transferencia recibida/enviada
- cierre de periodo

---

# 8. COMPROMISOS

La tab `Compromisos` debe explicar qué parte del presupuesto ya está apartada aunque todavía no se haya ejercido.

Mostrar:

- documento origen
- proveedor / concepto
- centro de costo
- monto
- fecha esperada
- estado
- impacto presupuestal

Estados sugeridos:

- Pendiente
- Autorizado
- Facturado
- Aplicado
- Cancelado

Incluir drill-down al documento de origen cuando sea viable.

---

# 9. AJUSTES Y TRANSFERENCIAS

Agregar flujo demo de:

## Ajustar presupuesto

- monto actual
- ajuste + / -
- motivo
- nuevo total

## Transferir presupuesto

- centro origen
- centro destino
- monto
- motivo

Debe actualizar visualmente los saldos en estado local.

No crear contabilidad real ni pólizas automáticas si no existen ya.

---

# 10. CIERRE DE PERIODO

Agregar acción `Cerrar periodo`.

Para demo:

- confirmación
- resumen de presupuesto / ejercido / comprometido / variación
- aviso de que es función demostrativa
- estado `Cerrado`

No implementar bloqueo contable real.

---

# 11. DRILL-DOWN Y TRAZABILIDAD

Toda cifra importante debe ser clickeable cuando tenga sentido.

Ejemplo:

```text
Centro: Mantenimiento
Presupuesto: $380,000
Ejercido: $312,000
Comprometido: $42,000

→ OC-RTM-2026-0081
→ FP-662190
→ OT-MAN-2026-014
```

El usuario debe entender qué documentos explican el consumo.

No dejar folios o montos como texto muerto si existe una vista relacionada reutilizable.

---

# 12. UX

- Mantener la cabecera actual de Finanzas.
- Incluir filtro de periodo.
- Incluir filtro por centro de costo.
- Botón `+ Nuevo presupuesto` visible.
- Exportar visible.
- Estados con colores semánticos.
- Evitar espacios enormes vacíos.
- Evitar tarjetas sin acción.
- Evitar tablas sin drill-down.
- Mantener lectura ejecutiva arriba y operación abajo.

---

# 13. DATOS DEMO

Crear suficiente volumen para que las vistas luzcan:

- 6–8 centros de costo
- 10–15 presupuestos / partidas
- 15–25 movimientos
- 8–12 compromisos
- histórico de al menos 6–9 meses

Mantener coherencia con Compras, CxP, Nómina y Mantenimiento existentes.

No usar nombres de personas reales de RTM como responsables simulados.

---

# 14. NO HACER

NO:

- eliminar el módulo de Presupuestos;
- crear otro módulo paralelo;
- meter backend;
- meter aprobación multinivel compleja;
- inventar reglas presupuestales reales de RTM;
- fingir integración bancaria;
- meter Activos Fijos aquí;
- romper Tesorería, Contabilidad o Reportes;
- dejar solo 5 KPIs sin operación.

---

# 15. CRITERIOS DE ACEPTACIÓN

- Presupuestos deja de verse como una pantalla vacía de KPIs.
- Tiene tabs internas claras.
- Existe `+ Nuevo presupuesto` con modal/wizard demo.
- Existe tabla de control por centro de costo.
- Existe Presupuesto vs Real con gráficas reales.
- Existe atención presupuestal.
- Existe detalle por centro con partidas, compromisos y movimientos.
- Ajuste y transferencia funcionan en estado local.
- Los compromisos explican qué documentos reservan presupuesto.
- Drill-down funciona donde sea viable.
- Filtros de periodo y centro afectan la vista.
- No se rompe el resto de Finanzas.
- Responsive correcto.
- Build sin errores.

---

# 16. VALIDACIÓN FINAL

1. pull de `alvaro01`;
2. auditar `BudgetWorkspace` actual;
3. reutilizar componentes actuales antes de crear otros;
4. implementar mejoras;
5. verificar que no se toque `main`;
6. correr `sync:frontend` si aplica;
7. correr `npm run build`;
8. corregir errores;
9. reportar archivos modificados, funciones agregadas y resultado del build.
