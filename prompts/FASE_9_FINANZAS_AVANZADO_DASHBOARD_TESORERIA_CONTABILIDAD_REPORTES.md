# FASE 9 — FINANZAS AVANZADO RTM

## Objetivo

Elevar el bloque de Finanzas del demo RTM de una capa operativa (Facturación + CxC + CxP) a una experiencia de ERP financiero más completa, sin intentar construir una contabilidad fiscal real ni un motor bancario.

La prioridad es que el demo se sienta como un ERP serio y conectado, con visibilidad ejecutiva, tesorería, contabilidad general y reportes financieros simulados coherentes con los datos ya existentes.

## Reglas de ejecución

- Trabajar únicamente en `alvaro01`.
- Hacer pull antes de tocar archivos.
- No tocar `main`.
- No hacer merge ni PR.
- Auditar y reutilizar primero la arquitectura actual de Finanzas, navegación, themes, mocks y componentes comunes.
- No romper Facturación, CxC ni CxP.
- No crear backend, PAC, bancos reales, XML fiscal real ni integraciones externas.
- Todo cálculo contable/financiero debe quedar claramente como demo cuando no derive de datos existentes.
- No inventar políticas contables propias de RTM como si fueran reales.
- No duplicar componentes si ya existen patrones reutilizables en el repo.

---

# 1. Estructura esperada de FINANZAS

Mantener en el sidebar el grupo `FINANZAS`, pero ampliarlo a:

- Dashboard Financiero
- Facturación
- Cuentas por Cobrar
- Cuentas por Pagar
- Tesorería
- Contabilidad
- Reportes Financieros

No crear submódulos absurdamente fragmentados en el sidebar.

La navegación debe seguir usando `NavigationModulesContext` y el sistema de visibilidad existente.

Si el repo actual ya trae rutas/tabs internas, reutilizarlas.

---

# 2. DASHBOARD FINANCIERO

Crear una vista ejecutiva que responda en menos de 10 segundos:

- ¿Cuánto vendimos?
- ¿Cuánto hemos cobrado?
- ¿Cuánto debemos?
- ¿Qué está vencido?
- ¿Cuánto efectivo tenemos disponible?
- ¿Qué pagos vienen esta semana?
- ¿Cómo va el resultado del mes?

## KPIs principales

Usar 6–8 tarjetas máximo:

- Ventas facturadas del mes
- Cobranza del mes
- CxC pendiente
- CxC vencida
- CxP pendiente
- Pagos próximos 7 días
- Posición de efectivo demo
- Resultado operativo demo

## Visuales

Agregar 2–4 bloques útiles, no gráficas decorativas:

### Flujo de caja 30 días

Entradas esperadas vs salidas programadas.

### Cartera por antigüedad

Reutilizar aging ya existente en CxC.

### Próximos compromisos

Lista corta de:

- cobros esperados
- pagos proveedor
- nómina
- gastos recurrentes

### Resultado mensual

Ingresos vs costo/gastos demo por mes.

## Filtros

- Hoy
- Mes actual
- Últimos 3 meses
- Año actual

En demo pueden ser visuales/locales, pero deben responder de forma coherente.

---

# 3. TESORERÍA

Crear un módulo/tabs internas orientadas a caja y bancos.

## Tabs sugeridas

- Posición de Caja
- Movimientos
- Pagos Programados
- Conciliación

## Posición de Caja

Mostrar cuentas bancarias DEMO:

- Banco / cuenta
- moneda
- saldo disponible
- saldo comprometido
- saldo proyectado

NO usar números de cuenta reales.

Usar nombres como:

- Cuenta Operativa MXN — Demo
- Cuenta Nómina MXN — Demo
- Cuenta USD — Demo

## Movimientos

Tabla con:

- fecha
- tipo: entrada / salida
- concepto
- referencia
- origen módulo
- importe
- cuenta
- estado

Ejemplos vinculados:

- cobro de CxC
- pago de CxP
- nómina
- gasto recurrente
- transferencia interna demo

## Pagos Programados

Consolidar:

- pagos a proveedores
- nómina próxima
- gastos recurrentes

Con estados:

- Pendiente
- Programado
- Ejecutado
- Cancelado

## Conciliación bancaria demo

No implementar conexión bancaria.

Vista con:

- movimientos ERP
- movimientos banco demo
- conciliados
- pendientes
- diferencias

Acciones simuladas:

- Conciliar
- Marcar como diferencia
- Crear movimiento faltante

Mostrar banner claro: `Conciliación bancaria simulada — Demo`.

---

# 4. CONTABILIDAD GENERAL

Crear una capa de contabilidad demo orientada a explicar cómo el ERP centraliza operaciones.

## Tabs internas

- Catálogo de Cuentas
- Pólizas
- Balanza
- Periodos

## Catálogo de Cuentas

Usar catálogo demo razonable para manufactura mexicana.

Ejemplo de estructura:

### Activo
- Bancos
- Clientes
- IVA acreditable
- Inventarios
- Activo fijo

### Pasivo
- Proveedores
- IVA trasladado / impuestos por pagar
- Nómina por pagar

### Capital
- Capital social
- Resultado acumulado

### Ingresos
- Ventas nacionales
- Ventas exportación

### Costos
- Materia prima
- Mano de obra
- Costos indirectos

### Gastos
- Administración
- Ventas
- Mantenimiento
- Servicios

No afirmar que este es el catálogo real de RTM. Etiquetarlo `Catálogo demo`.

Campos:

- cuenta
- nombre
- tipo
- naturaleza
- nivel
- estado

## Pólizas / Asientos

Mostrar pólizas demo generadas desde módulos existentes.

Ejemplos:

### Factura de venta timbrada
- Clientes — Debe
- Ventas — Haber
- IVA trasladado — Haber

### Cobro cliente
- Bancos — Debe
- Clientes — Haber

### Factura proveedor
- Inventario/Gasto — Debe
- IVA acreditable — Debe
- Proveedores — Haber

### Pago proveedor
- Proveedores — Debe
- Bancos — Haber

### Nómina
- Sueldos y salarios — Debe
- Nómina por pagar — Haber

No construir un motor contable completo.

El objetivo es demostrar trazabilidad:

`Documento origen → póliza → movimientos contables`.

## Detalle de póliza

Mostrar:

- folio
- fecha
- tipo
- concepto
- documento origen
- usuario
- cuenta
- debe
- haber
- totales

Debe cumplir visualmente:

`Total Debe = Total Haber`.

## Periodos

Vista simple:

- Ago 2026 — Cerrado demo
- Sep 2026 — Abierto
- Oct 2026 — Futuro

Acciones de cierre deben ser simuladas y claramente marcadas como demo.

---

# 5. BALANZA DE COMPROBACIÓN

Debe ser una vista fuerte del demo.

Filtros:

- periodo
- cuenta
- nivel

Columnas:

- Cuenta
- Nombre
- Saldo inicial
- Debe
- Haber
- Saldo final

Acciones:

- Exportar Excel
- Imprimir

En demo, exportar puede mostrar toast/banner de éxito si no existe una exportación real.

Debe cuadrar con los mocks contables.

---

# 6. REPORTES FINANCIEROS

Crear un módulo de reportes con tabs o selector:

- Estado de Resultados
- Balance General
- Flujo de Efectivo
- Reportes Contables

## Estado de Resultados

Mostrar estructura entendible:

- Ventas netas
- Costo de ventas
- Utilidad bruta
- Gastos operativos
- Utilidad operativa
- Otros ingresos/gastos demo
- Resultado antes de impuestos demo

Comparativos:

- mes actual
- mes anterior
- variación %

No mostrar EBITDA si no hay una explicación clara o datos coherentes.

## Balance General

Mostrar:

### Activo
- circulante
- no circulante

### Pasivo
- corto plazo
- largo plazo

### Capital

Debe respetar la ecuación visual:

`Activo = Pasivo + Capital`.

## Flujo de Efectivo

Secciones:

- Operación
- Inversión
- Financiamiento
- Variación neta de efectivo

Mantenerlo simple y coherente con Tesorería.

## Reportes Contables

Accesos rápidos:

- Balanza de comprobación
- Auxiliar de cuenta
- Libro diario
- Libro mayor
- Movimientos por periodo

Pueden ser vistas demo si el alcance se vuelve grande, pero al menos `Balanza` y `Auxiliar de cuenta` deben estar bien construidos.

---

# 7. CENTROS DE COSTO / DIMENSIONES

Agregar soporte visual demo para clasificación por área.

Usar dimensiones coherentes con RTM, sin afirmar estructura contable real:

- Offset
- Flexografía
- Serigrafía
- Calidad
- Mantenimiento
- Almacén
- Administración

Permitir filtrar algunos reportes por centro de costo.

No construir costeo industrial real aquí.

---

# 8. PRESUPUESTOS — ALCANCE LIGERO

Agregar una vista simple dentro de Finanzas o Reportes, solo si encaja sin inflar demasiado.

Mostrar:

- presupuesto mensual
- real
- variación
- porcentaje consumido

Categorías demo:

- Materia prima
- Mantenimiento
- Nómina
- Servicios
- Administración

No construir workflow de aprobación presupuestaria.

Si compromete demasiado la fase, dejarlo como tarjeta/vista secundaria y priorizar Tesorería + Contabilidad + Reportes.

---

# 9. ACTIVOS FIJOS — NO IMPLEMENTAR COMPLETO EN ESTA FASE

No construir depreciación fiscal/contable real.

Solo preparar enlace futuro entre:

`Máquinas de Mantenimiento → Activos Fijos`.

Si se muestra algo, limitarse a un bloque informativo demo:

- código activo
- máquina/equipo
- valor de adquisición demo
- fecha demo
- estado

No desarrollar depreciaciones automáticas en esta fase.

---

# 10. INTEGRACIÓN TRANSVERSAL

La fase debe sentirse conectada con lo ya existente.

## Facturación

Factura timbrada demo debe poder mostrar enlace a póliza demo.

## CxC

Pago registrado debe reflejarse en Tesorería y en una póliza demo.

## CxP

Factura proveedor y pago deben reflejarse en Tesorería/Contabilidad.

## Nómina

Mostrar compromiso/pago de nómina en Tesorería y asiento demo.

## Mantenimiento

Gastos/refacciones pueden alimentar gastos por centro de costo demo si es sencillo.

No romper ninguna lógica actual para lograr estas conexiones.

---

# 11. DATOS Y COHERENCIA

Reutilizar los datos maestros que ya existen en:

- `mockFinanzasData`
- Ventas
- Compras
- Nómina
- Mantenimiento

No crear datasets paralelos contradictorios.

Ejemplo:

Si una factura en CxP vale $109,504, el movimiento/pago/póliza asociado debe usar ese mismo importe cuando corresponda.

Si un pago parcial existe, no tratar la factura como totalmente pagada.

Mantener MXN/USD coherentes.

---

# 12. UX / DESIGN SYSTEM

Mantener el look actual RTM:

- theme classes
- cards compactas
- tablas limpias
- tabular nums / mono donde aplica
- semantic colors
- botones primarios en theme
- verde = éxito
- rojo = error/vencido
- amber = pendiente/advertencia
- azul = info

Evitar pantallas gigantes con puro whitespace.

Usar tabs internas donde tenga sentido.

Todos los módulos nuevos deben sentirse parte del mismo ERP, no micrositios separados.

---

# 13. CASOS DEMO OBLIGATORIOS

## Caso A — Venta y cobro

Factura timbrada
→ CxC
→ pago parcial
→ movimiento de Tesorería
→ póliza demo

## Caso B — Compra y pago

Factura proveedor validada
→ CxP
→ pago proveedor
→ movimiento de Tesorería
→ póliza demo

## Caso C — Balanza

Mostrar cuentas con movimientos y saldo final coherente.

## Caso D — Estado de Resultados

Mostrar ventas, costo/gastos y resultado del mes.

## Caso E — Flujo de caja

Mostrar próximos cobros vs pagos y saldo proyectado.

## Caso F — Conciliación

Movimiento ERP conciliado con movimiento bancario demo.

---

# 14. NO IMPLEMENTAR

NO:

- conexión bancaria real
- SPEI real
- PAC/SAT real
- XML contable real
- contabilidad electrónica real
- DIOT real
- cierre fiscal real
- depreciación fiscal real
- activos fijos completos
- impuestos avanzados
- declaraciones
- pólizas fiscales certificadas
- backend nuevo

---

# 15. AUDITORÍA PREVIA OBLIGATORIA

Antes de programar, revisar al menos:

- `Sidebar.tsx`
- `DashboardShell.tsx`
- `NavigationModulesContext.tsx`
- `FacturacionPage.tsx`
- `CxcPage.tsx`
- `CxpPage.tsx`
- `mockFinanzasData.ts`
- módulo de Nómina
- módulo de Mantenimiento
- componentes comunes / modales / tablas
- sistema theme

Detectar primero qué se puede reutilizar.

---

# 16. VALIDACIÓN FINAL

Al terminar:

1. correr `sync:frontend` si aplica al esquema actual del repo;
2. correr `npm run build`;
3. corregir todos los errores;
4. probar navegación de Finanzas;
5. comprobar que Facturación/CxC/CxP sigan funcionando;
6. comprobar que pólizas demo cuadren Debe/Haber;
7. comprobar que Balance General cuadre;
8. comprobar que flujo de efectivo y Tesorería sean coherentes;
9. revisar theme y responsive;
10. reportar archivos modificados y pendientes.

## Prioridad de implementación

Si el alcance resulta demasiado grande, priorizar en este orden:

1. Dashboard Financiero
2. Tesorería
3. Contabilidad — catálogo + pólizas + balanza
4. Reportes — Estado de Resultados + Balance General + Flujo de Efectivo
5. Centros de costo
6. Presupuesto ligero

No sacrificar calidad para intentar implementar features secundarias.
