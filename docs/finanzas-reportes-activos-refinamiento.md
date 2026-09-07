# RTM Demo — Refinamiento de Reportes Financieros y Activos Fijos

## Objetivo

Refinar **Reportes Financieros** y **Activos Fijos** para que se sientan como un mismo ecosistema financiero, sin mezclar responsabilidades.

La referencia visual principal para la entrada de Reportes es el demo compartido por Álvaro: una **biblioteca de reportes por tarjetas**, limpia, rápida y visualmente ligera.

La propuesta NO es meter Activos dentro de Reportes como si fueran lo mismo. La propuesta es:

- mantener **Activos Fijos** como workspace operativo;
- convertir **Reportes Financieros** en una biblioteca moderna de reportes;
- unir ambos dentro de un workspace mayor de **Contabilidad & Reportes**;
- usar una sola fuente de datos para evitar contradicciones entre Activos, Contabilidad y Estados Financieros.

---

# 1. Hallazgos de auditoría del repo actual

## 1.1 Reportes Financieros

Actualmente `FinancialReports.tsx` ya incluye:

- Estado de Resultados;
- Situación Financiera;
- Flujo de Efectivo;
- Balanza de Comprobación;
- Mayor / Auxiliares;
- Antigüedad CxC;
- Antigüedad CxP;
- Presupuesto vs Real.

Tiene filtros, exportar Excel/PDF, imprimir y drill-down.

### Problemas detectados

1. La entrada actual depende de un dropdown de `Reporte` y se siente más como formulario que como módulo ejecutivo.
2. El comparativo anterior se genera con lógica demo simplificada (`actual * .94`) y variación fija aproximada.
3. Los buckets de antigüedad dentro de Reportes no usan la misma lógica real que Dashboard/CxC/CxP.
4. El drill-down termina mostrando información demasiado genérica y no siempre relacionada con el rubro seleccionado.
5. El selector de periodo de `FinanceWorkspace` y el selector interno de Reportes duplican contexto.

---

## 1.2 Activos Fijos

Actualmente `AssetsWorkspace.tsx` ya incluye:

- Inventario;
- Depreciación;
- Movimientos;
- costo histórico;
- depreciación acumulada;
- valor neto;
- depreciación mensual;
- relación conceptual con OC, póliza y mantenimiento.

### Problemas detectados

1. Sólo existen pocos activos mock para una planta como RTM.
2. `+ Activo` no ejecuta un flujo completo.
3. El detalle del activo es muy corto para un ERP.
4. Se mezcla estado contable con estado operativo.
5. Faltan documentos, ubicación, centro de costo, responsable, cuentas contables y trazabilidad realista.
6. `AssetsWorkspace` puede recibir un `toast` vacío desde `FinanceWorkspace`, dejando acciones sin feedback.
7. No existe una conexión navegable fuerte con Mantenimiento.

---

## 1.3 Inconsistencia financiera importante

Los mocks actuales no comparten una sola verdad contable.

Ejemplo actual:

```text
Activos Fijos
Costo histórico             $3,515,000
Depreciación acumulada      $1,259,000
Valor neto                  $2,256,000
```

pero el Estado de Situación Financiera usa un valor de activo no circulante mucho menor.

Esto debe corregirse.

### Regla

**Estados Financieros, Contabilidad, Activos, Presupuestos, CxC, CxP y Tesorería deben derivar de un mismo modelo demo.**

No crear números independientes sólo para llenar pantallas.

---

# 2. Arquitectura propuesta del Sidebar

Reducir ruido en Finanzas.

```text
FINANZAS

Facturación
Dashboard Financiero
Cuentas por Cobrar
Cuentas por Pagar
Tesorería & Bancos

Contabilidad & Reportes        ★ workspace unificado
  ├── Resumen
  ├── Contabilidad
  ├── Activos Fijos
  ├── Reportes
  └── Cierre

Presupuestos
```

La intención es retirar del Sidebar como entradas independientes:

- Contabilidad General;
- Activos Fijos;
- Reportes Financieros.

Y reemplazarlas por:

`Contabilidad & Reportes`.

No borrar sus componentes actuales; reutilizarlos dentro del workspace.

---

# 3. UI de Reportes — Inspiración del demo compartido

La landing de Reportes debe parecerse conceptualmente a la referencia compartida:

- título simple arriba;
- subtítulo corto;
- grid de 3 columnas en desktop;
- cards blancas amplias;
- icono pequeño dentro de círculo suave;
- título del reporte;
- descripción de una línea;
- CTA pequeño `Ver reporte →`;
- mucho espacio en blanco;
- nada de dashboard pesado al entrar.

### Ejemplo

```text
Reportes
Informes operativos y financieros

[ icon ]
Ventas por período
Facturación mensual comparativa vs año anterior
Ver reporte →
```

### Diseño

Usar el Design System RTM:

- `bg-theme-surface`;
- `border-theme-subtle`;
- `text-theme-main`;
- `text-theme-muted`;
- semántica por icono/borde, no fondo pastel completo;
- `rounded-2xl/3xl`;
- cards de altura consistente;
- hover sutil;
- responsive 1 / 2 / 3 columnas.

No copiar literalmente colores del screenshot; adaptarlo al theme dinámico RTM.

---

# 4. Biblioteca propuesta de Reportes

La landing debe agrupar reportes por categoría.

## 4.1 Comercial / Ventas

### Ventas por período
Facturación mensual, tendencia y comparativo vs periodo anterior.

### Rentabilidad por cliente
Ventas, costo estimado y margen por cliente.

### Rentabilidad por artículo / familia
Ventas, costo y margen por producto o familia.

### Facturas pendientes
Documentos sin timbrar, enviados, pendientes o con excepción.

---

## 4.2 Finanzas

### Estado de Resultados
Ingresos, costo de ventas, utilidad bruta, gastos y utilidad operativa.

### Situación Financiera
Activo, pasivo, capital y composición.

### Flujo de Efectivo
Operación, inversión y financiamiento.

### Antigüedad de cartera
CxC por bucket real.

### Antigüedad de proveedores
CxP por bucket real.

### Presupuesto vs Real
Consumo, compromiso y variación por centro de costo.

---

## 4.3 Compras / Abastecimiento

### Órdenes de compra abiertas
OC pendientes de recepción, parciales o vencidas.

### Compras por proveedor
Monto, frecuencia, lead time y concentración.

### Facturas de proveedor con excepción
Bloqueadas por diferencias o 3-way match.

---

## 4.4 Inventario / Operaciones

### Ajustes de inventario
Movimientos, diferencias de conteo y motivo.

### Valuación de inventario
Valor por almacén, familia y tipo.

### Rotación / inventario lento
Material sin movimiento o sobreinventario.

### Ciclo de vida de documentos
Pedido → OP → producción → liberación → embarque → factura → cobro.

---

## 4.5 Activos / CAPEX

### Activos por área
Costo, valor neto y distribución por planta/área.

### Depreciación del período
Depreciación mensual y acumulada.

### Altas / bajas / transferencias
Movimientos de activos.

### CAPEX vs Presupuesto
Inversión aprobada, ejercida y comprometida.

### Mantenimiento por activo
Costo de OT / mantenimiento relacionado por activo.

---

# 5. Abrir un reporte

Al seleccionar `Ver reporte →`, abrir un workspace de reporte, no un modal pequeño.

Header:

```text
← Reportes
Estado de Resultados
Septiembre 2026

[ Periodo ] [ Comparar contra ] [ Filtros ] [ Exportar ▾ ]
```

El periodo debe ser compartido con `Contabilidad & Reportes`.

### Layout

1. Contexto / KPIs pequeños cuando aporten valor.
2. Visual principal.
3. Tabla detallada.
4. Drill-down.

No llenar todas las vistas con 8 KPIs por obligación.

---

# 6. Drill-down financiero realista

La navegación debe seguir el origen de los datos.

```text
Estado Financiero
  ↓
Rubro
  ↓
Cuenta contable
  ↓
Movimientos / auxiliar
  ↓
Póliza
  ↓
Documento origen
```

Ejemplo:

```text
Activo no circulante
$2,256,000

├─ Maquinaria Offset
├─ Maquinaria Flexo
├─ Equipo TI
└─ Otros activos
```

Click `Maquinaria Offset`:

```text
1501-01 · Maquinaria Offset

AF-0008 · Heidelberg Speedmaster XL 75
AF-0015 · Conserver 8 colores
...
```

Click `AF-0008`:

→ abrir ficha del activo.

El drill-down no debe mostrar siempre la misma póliza genérica.

---

# 7. Activos Fijos — nuevo alcance UI/UX

## 7.1 Tabs

```text
[ Resumen ] [ Inventario ] [ Depreciación ] [ Movimientos ] [ CAPEX ]
```

## 7.2 Mocks

Subir a aproximadamente 18–25 activos coherentes con RTM.

Ejemplos:

### Offset
- Heidelberg Speedmaster XL 75
- Conserver 1–2
- Conserver 3–4
- Conserver 8 colores
- DiDDE 860
- Ryobi

### Flexografía
- Mark Andy 830 7"
- Mark Andy 830 10"
- Mark Andy Scout 10"
- Mark Andy 4120 17"
- Allied Gear
- Rotoflex I
- BGM 2

### Acabados / Servicios
- Guillotina
- Stahl
- Muller Martini
- Compresor Kaeser
- Montacargas
- Servidor de planta
- UPS

No afirmar que todos son activos reales confirmados; son mocks demo coherentes con máquinas ya usadas en el repo.

---

# 8. Ficha de Activo

Usar modal/workspace amplio con tabs:

```text
[ General ]
[ Depreciación ]
[ Documentos ]
[ Movimientos ]
[ Mantenimiento ]
[ Contabilidad ]
```

## General

- clave activo;
- nombre;
- categoría;
- marca/modelo;
- número de serie demo;
- área;
- ubicación;
- centro de costo;
- responsable;
- fecha de adquisición;
- proveedor;
- OC;
- factura;
- costo.

## Estado

Separar:

```text
Estado contable
● Activo
● En proceso de baja
● Baja

Estado operativo
● Operativo
● Mantenimiento
● Fuera de servicio
```

## Depreciación

- método;
- vida útil;
- fecha inicio;
- depreciación mensual;
- acumulada;
- valor en libros;
- meses restantes.

## Contabilidad

- cuenta activo;
- cuenta depreciación acumulada;
- cuenta gasto depreciación;
- póliza de alta;
- última póliza depreciación.

## Documentos

- OC;
- factura proveedor;
- póliza alta;
- comprobante;
- baja/transferencia cuando aplique.

## Mantenimiento

Consulta transversal:

- último preventivo;
- próximo preventivo;
- horas acumuladas demo;
- OT abiertas;
- costo mantenimiento YTD.

CTA:

`Ver equipo en Mantenimiento`.

No duplicar la administración de mantenimiento.

---

# 9. Alta de Activo — funcional en demo

`+ Nuevo activo` debe abrir wizard/modal.

Pasos:

1. Identificación.
2. Compra / documento origen.
3. Ubicación / responsable.
4. Clasificación contable.
5. Depreciación.
6. Confirmación.

Guardar debe:

- agregar activo a la tabla;
- actualizar KPIs;
- generar movimiento de alta;
- reflejarse en Reporte de Activos;
- mostrar toast demo.

---

# 10. Integración CAPEX / Presupuestos

Activos no debe administrar Presupuestos, pero sí mostrar origen CAPEX.

Ejemplo:

```text
Proyecto CAPEX
Modernización Flexografía 2026

Presupuesto aprobado      $2.8 M
Ejercido                   $1.9 M
Comprometido               $0.4 M
Disponible                 $0.5 M
```

Un activo puede mostrar:

`Origen: CAPEX Producción 2026`.

---

# 11. Una sola fuente de verdad financiera — P0

Crear/refactorizar mocks/helpers para que:

- Activos Fijos netos;
- Balance;
- Depreciación;
- Flujo de inversión;
- Presupuesto CAPEX;
- pólizas de alta/depreciación;

usen datos consistentes.

Igualmente:

- Aging CxC en Dashboard y Reportes debe usar los mismos buckets.
- Aging CxP debe usar la misma lógica.
- comparativos deben venir de mocks del periodo anterior, no multiplicadores arbitrarios.

No es necesario backend; sí coherencia interna.

---

# 12. Contabilidad & Reportes — Workspace unificado

Crear un contenedor superior con tabs:

```text
CONTABILIDAD & REPORTES

[ Resumen ] [ Contabilidad ] [ Activos Fijos ] [ Reportes ] [ Cierre ]
```

## Resumen

Vista ejecutiva corta:

- activo total;
- pasivo total;
- capital;
- activo fijo neto;
- depreciación mes;
- resultado operativo;
- estado de cierre;
- alertas.

## Contabilidad

Reutilizar `AccountingGeneral`.

## Activos Fijos

Reutilizar/refinar `AssetsWorkspace`.

## Reportes

Nueva biblioteca de cards.

## Cierre

Checklist demo:

- conciliaciones;
- provisiones;
- depreciación contabilizada;
- CxC/CxP revisadas;
- inventario contabilizado;
- documentos pendientes;
- balanza cuadrada.

---

# 13. Navegación cruzada

El demo debe permitir:

```text
Reporte financiero
→ cuenta
→ póliza
→ documento origen
```

```text
Activo fijo
→ OC / factura
→ CxP
```

```text
Activo fijo
→ Mantenimiento
→ OT
```

```text
Presupuesto CAPEX
→ activo generado
```

No tiene que existir backend real; la navegación demo sí debe reaccionar.

---

# 14. Design System

Seguir `docs/design-system.md` y usar Requisiciones como referencia de consistencia.

La landing de Reportes toma inspiración de la imagen compartida, pero adaptada a RTM:

- cards simples;
- icono semántico discreto;
- título + descripción + CTA;
- superficies blancas;
- poco ruido;
- sin gigantes bloques de color;
- hover sutil;
- espaciado generoso.

Dentro de cada reporte sí pueden existir tablas, gráficas, filtros y drill-down.

---

# 15. Prioridad de implementación

## P0

- validar estado actual antes de tocar código;
- una sola fuente de verdad financiera;
- corregir inconsistencias Activos vs Balance;
- corregir Aging y comparativos;
- hacer funcional el alta de activo;
- feedback real de botones.

## P1

- `Contabilidad & Reportes` unificado;
- landing de Reportes por cards inspirada en referencia;
- agregar nuevos reportes útiles;
- drill-down financiero realista;
- ficha de activo completa;
- navegación cruzada Activos ↔ Mantenimiento ↔ Contabilidad.

## P2

- CAPEX;
- cierre mensual;
- reportes de costo de mantenimiento por activo;
- rentabilidad por cliente/producto;
- ciclo de vida de documentos.

---

# 16. Regla de ejecución

Antes de implementar:

1. validar el estado actual de `alvaro01`;
2. revisar si Codex/Anti ya cambió alguno de estos módulos;
3. auditar `FinanceWorkspace`, `FinancialReports`, `AssetsWorkspace`, `AccountingGeneral`, `BudgetWorkspace`, `DashboardShell` y navegación;
4. implementar sólo lo faltante/parcial;
5. no duplicar componentes;
6. mantener `src/` como fuente canónica;
7. ejecutar build y sincronización al final.

---

# 17. Criterio de éxito del demo

En menos de 3 minutos debe poder mostrarse:

```text
Reportes
→ abrir Estado de Situación Financiera
→ drill-down Activo no circulante
→ Maquinaria Offset
→ AF-0008 Heidelberg
→ ver depreciación/documentos
→ saltar a Mantenimiento
```

Y después:

```text
+ Nuevo activo
→ alta demo
→ aparece en inventario de activos
→ actualiza valor neto
→ aparece en reporte de activos
→ movimiento/póliza de alta visible
```

El resultado debe sentirse como un ERP financiero integrado, no como pantallas aisladas con números independientes.