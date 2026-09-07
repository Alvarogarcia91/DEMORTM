# RTM DEMO — FASE 2: INVENTARIO CORE

> Repo: `Alvarogarcia91/DEMORTM`
>
> Rama obligatoria: `alvaro01`
>
> Objetivo: convertir el módulo de Inventario existente en una experiencia coherente con Impresos RTM, reutilizando al máximo el demo actual y evitando complejidad innecesaria.

---

# 0. INSTRUCCIÓN DE ARRANQUE

Antes de modificar código:

1. Cambiar a la rama `alvaro01`.
2. Hacer pull de la rama remota.
3. Auditar el estado actual del repo porque ya existen cambios recientes de rebrand, inventario, picking, devoluciones y acomodo.
4. Leer este archivo completo antes de programar.
5. No rehacer componentes que ya funcionan bien.
6. No borrar módulos heredados; si algo no aplica a RTM, ocultarlo o dejarlo fuera del flujo visible.
7. No trabajar en `main`.
8. No crear PR ni mergear sin instrucción explícita.

Comandos esperados al iniciar:

```bash
git checkout alvaro01
git pull origin alvaro01
```

---

# 1. PRINCIPIO DE ESTA FASE

No queremos construir un WMS productivo completo.

Queremos que Inventario sea una de las partes más fuertes del demo RTM y que se sienta diseñado para una imprenta industrial.

La prioridad es:

- coherencia de datos;
- buena UX;
- trazabilidad visual;
- lotes;
- disponibilidad real;
- ubicaciones;
- movimientos;
- conteos;
- conexión conceptual con Producción y QA.

No necesitamos agregar complejidad física que RTM no confirmó.

---

# 2. MAPA / ALMACENES — MANTENER SIMPLE

Para esta demo usar solamente esta estructura lógica:

## 2.1 Almacén Principal RTM

Nombre visible sugerido:

`Almacén Principal RTM`

Código sugerido:

`ALM-RTM`

Es el único almacén físico principal del demo.

Dentro pueden existir zonas / áreas lógicas, por ejemplo:

- Recepción
- Papel & Sustratos Offset
- Bobinas & Sustratos Flexo
- Tintas & Consumibles
- Cuarentena QA
- Staging Producción
- Producto Terminado
- Embarques

No inventar múltiples CEDIS, sucursales o edificios.

## 2.2 Almacén Virtual

Crear/mantener un almacén lógico/virtual para representar material que no debe mostrarse como disponible físico inmediato.

Nombre visible sugerido:

`Almacén Virtual / Control`

Código:

`ALM-VIRTUAL`

Puede usarse para escenarios mock como:

- material en investigación;
- pendiente de conciliación;
- ajustes administrativos;
- inventario temporal lógico;
- reservas o movimientos no físicamente acomodados cuando sea útil para la demo.

IMPORTANTE:

No vender este almacén virtual como una estructura real confirmada de RTM. Es una simplificación de demo.

## 2.3 Embarques

Dentro del almacén físico principal agregar una zona sencilla:

`Embarques`

Y SOLO un carril:

`Carril de Embarque 01`

Código sugerido:

`EMB-01`

No crear múltiples andenes/carriles/rutas si no son necesarios.

---

# 3. MAPA ACTUAL

El mapa actual del demo funciona visualmente bien.

NO rehacerlo desde cero.

NO hacer un CAD.

NO crear un mapa gigantesco.

Reutilizar la UI existente y simplificarla a:

- 1 Almacén Principal RTM;
- sus zonas lógicas;
- racks/posiciones suficientes para demostrar búsqueda;
- 1 zona de recepción;
- 1 zona de cuarentena;
- 1 staging de producción;
- 1 zona de Producto Terminado;
- 1 zona de Embarques;
- 1 Carril de Embarque 01.

El Almacén Virtual no necesita mapa físico detallado. Puede aparecer en selectores/listados con iconografía distinta o como nodo lógico.

## El mapa debe permitir demostrar:

1. buscar un artículo/material;
2. buscar un lote;
3. buscar una unidad física si aplica;
4. buscar una ubicación;
5. resaltar la posición encontrada;
6. abrir el detalle;
7. ver QR de ubicación;
8. imprimir QR si ya existe esa UX.

---

# 4. MODELO DE INVENTARIO RTM PARA DEMO

La regla principal:

> Existencia física != existencia disponible.

La pantalla debe diferenciar claramente:

- Físico
- Reservado
- Bloqueado / QA
- Disponible

Ejemplo visual:

```text
Físico:      18,000 pliegos
Reservado:    4,200 pliegos
Bloqueado QA: 2,000 pliegos
Disponible:  11,800 pliegos
```

No usar una sola columna genérica de stock si se pierde esta distinción.

---

# 5. MATERIALES MOCK RTM

Centralizar datos mock para evitar inconsistencias.

Usar ejemplos industriales, claramente demo, como:

## Papel / Offset

- Papel Couché 90 g
- Papel Couché 150 g
- Papel Bond 75 g
- Cartulina SBS
- Papel adhesivo

UOM:

- pliego
- hoja
- kg
- tarima

## Flexografía

- BOPP Blanco
- BOPP Transparente
- Papel Térmico Autoadherible
- Liner Siliconado
- Material autoadherible

UOM:

- rollo
- bobina
- metro lineal
- kg

## Tintas / consumibles

- Tinta Process Black
- Tinta PMS 186 C
- Barniz UV
- Barniz Acuoso
- Adhesivo
- Cajas
- Stretch film
- cores

UOM según aplique:

- kg
- litro
- cubeta
- caja
- pieza

## Producto Terminado

Ejemplos:

- rollos de etiquetas
- cajas de etiquetas terminadas
- impresos terminados
- paquetes

No afirmar que estos SKUs son catálogo real RTM.

---

# 6. LOTES

El lote debe ser protagonista.

Cada existencia relevante debe poder mostrar:

- lote proveedor;
- lote interno RTM si aplica;
- artículo/material;
- fecha de recepción;
- caducidad cuando aplique;
- estado QA;
- ubicación;
- cantidad física;
- cantidad reservada;
- cantidad disponible;
- historial.

Estados QA sugeridos:

- Pendiente QA
- Liberado
- Cuarentena
- Rechazado

Regla demo:

Material en `Cuarentena` o `Rechazado` no suma a Disponible.

---

# 7. UNIDAD FÍSICA

No serializar cada hoja/pliego.

La identificación física debe existir solo donde tenga sentido.

Ejemplos:

- Bobina
- Rollo
- Tarima
- Caja
- Paquete
- Cubeta
- Remanente

IDs demo sugeridos:

- `BOB-RTM-0001`
- `ROL-RTM-0014`
- `TAR-RTM-0006`
- `CJ-RTM-0032`
- `REM-RTM-0041`

No usar `SC-UID-*` en flujos visibles RTM.

---

# 8. EXISTENCIAS — PRIORIDAD ALTA

Esta pantalla debe quedar muy bien.

Reutilizar la UX actual, pero convertirla a RTM.

Debe permitir:

- buscar por código;
- nombre;
- lote;
- unidad física;
- ubicación;
- estado QA;
- categoría;
- UOM;
- almacén.

## Vista por artículo/material

Mostrar como mínimo:

- código
- material
- categoría
- UOM
- físico
- reservado
- bloqueado QA
- disponible
- lotes
- ubicación principal
- estado

## Drawer / detalle

Al abrir un material mostrar:

- resumen total;
- desglose por lote;
- desglose por ubicación;
- cantidades;
- QA;
- fechas;
- unidades físicas asociadas;
- movimientos recientes.

No duplicar información innecesaria.

---

# 9. ALMACENES & ÁREAS

Renombrar cualquier wording heredado tipo:

`Almacenes & Sucursales`

por:

`Almacenes & Áreas`

Mostrar solo:

## Almacén Principal RTM

con sus zonas.

## Almacén Virtual / Control

como nodo lógico.

No mostrar:

- CEDIS Monterrey Norte
- CEDIS Monterrey Sur
- Valle Oriente
- Cumbres
- Showroom

---

# 10. MOVIMIENTOS / KARDEX

Conservar el componente actual y adaptarlo.

Tipos sugeridos:

- RECEPCIÓN
- ACOMODO
- REUBICACIÓN
- RESERVA
- LIBERACIÓN DE RESERVA
- SURTIDO A OP
- DEVOLUCIÓN DE PRODUCCIÓN
- REMANENTE
- SCRAP
- AJUSTE +
- AJUSTE -
- CUARENTENA QA
- LIBERACIÓN QA
- PRODUCTO TERMINADO
- EMBARQUE

Mostrar:

- fecha/hora;
- material;
- lote;
- cantidad;
- UOM;
- origen;
- destino;
- usuario;
- referencia (OP, recepción, conteo, etc.);
- observación.

Conceptualmente append-only.

No borrar movimientos desde UI.

---

# 11. CONTEOS

Conservar el módulo actual y adaptarlo a RTM.

Mantener:

- Plan de conteo
- Tareas
- Conteo ciego
- Escaneo de ubicación
- Captura/escaneo de unidades cuando aplique
- Diferencias
- Recuento
- Investigación

Caso estrella del demo:

```text
Material: Papel Couché 90 g
Sistema: 22,000 pliegos
Físico: 2,500 pliegos
Diferencia: -19,500 pliegos
```

Mostrar claramente que es un escenario DEMO inspirado en una problemática descrita durante exploración, no un saldo real actual.

El flujo debe permitir:

Conteo
→ Diferencia
→ Recuento
→ Investigación
→ Ajuste trazable

---

# 12. REACOMODOS

Mantener la UX existente, simplificada.

Sugerencias RTM:

- consolidar lotes iguales;
- mover material de alta rotación cerca de staging;
- liberar espacio;
- agrupar remanentes;
- priorizar FEFO cuando aplique;
- reducir recorridos.

No hacer un optimizador complejo nuevo.

---

# 13. MAPA DE CALOR

Mantenerlo si ya funciona.

Adaptar únicamente datos y wording.

Puede mostrar:

- posiciones con más movimientos;
- zonas con mayor actividad;
- concentración de picking/surtido;
- ubicaciones subutilizadas.

No gastar tiempo en perfeccionarlo antes que Existencias/Kardex/Conteos.

---

# 14. ANALÍTICA

Mantener el tab actual, pero adaptarlo a RTM.

KPIs/gráficas útiles:

- movimientos del periodo;
- exactitud inventario;
- ocupación;
- inventario por estado;
- lotes bloqueados QA;
- lotes próximos a caducar;
- diferencias de conteo;
- materiales más movidos;
- materiales sin movimiento;
- remanentes;
- inventario reservado.

Mantener selector de periodo y `Exportar Excel` demo si ya existe.

---

# 15. COHERENCIA DE DATOS

Esto es obligatorio.

No quiero que cada pantalla invente sus propios datos.

El mismo material debe conservar:

- mismo código;
- mismo lote;
- misma UOM;
- misma cantidad;
- misma ubicación;
- mismo estado QA;
- mismas reservas;

entre:

- Dashboard
- Existencias
- Mapa
- Kardex
- Conteos
- Operaciones de Almacén

Centralizar mocks todo lo posible.

Ejemplo central:

```text
Código: MP-COU-090
Material: Papel Couché 90 g
Lote: RTM-MP-260901-004
Físico: 18,000 pliegos
Reservado: 4,200
QA bloqueado: 0
Disponible: 13,800
Ubicación: PAP-A-03
Relacionado con: OP-2026-0891
```

Ese registro debe verse consistente en todas partes.

---

# 16. CONEXIÓN CON PRODUCCIÓN — SOLO CONCEPTUAL

Todavía NO construir el módulo completo de Producción.

Sí permitir referencias como:

- `OP-2026-0882`
- `OP-2026-0891`

para demostrar:

- material reservado;
- material surtido;
- material requerido;
- devolución/remanente.

Pero no desarrollar en esta fase:

- Gantt;
- máquinas;
- capacidad;
- rutas completas;
- reporte operador productivo;
- BOM real.

---

# 17. EMBARQUES — SOLO SOPORTE DE INVENTARIO

En esta fase no rehacer todo Embarques.

Solo asegurar que Inventario pueda representar:

- Producto Terminado en stock;
- PT reservado;
- PT en staging;
- PT en `EMB-01`;
- PT embarcado.

La zona de embarques visible en mapa debe tener:

`Carril de Embarque 01 (EMB-01)`

Nada más por ahora.

---

# 18. THEME

Toda UI nueva/modificada debe respetar el sistema de themes.

No hardcodear colores de marca.

Branding/interacción:

- `bg-theme-primary`
- `text-theme-primary`
- `border-theme-primary`
- `ring-theme-primary`

Colores semánticos sí pueden permanecer:

- rojo = error/crítico
- verde = éxito/liberado
- ámbar = pendiente/atención
- azul = info
- morado = sugerencia/optimización

No introducir más `rose-*` para botones normales.

---

# 19. QUÉ NO HACER

NO:

- múltiples CEDIS;
- múltiples sucursales;
- showroom;
- mapa CAD;
- múltiples almacenes físicos inventados;
- 10 carriles de embarque;
- serializar pliego por pliego;
- crear backend productivo complejo;
- base de datos real;
- permisos avanzados;
- Producción completa;
- QA completo;
- compras completas;
- reemplazar componentes buenos del clon sin necesidad.

---

# 20. ORDEN DE IMPLEMENTACIÓN

Implementar en este orden:

## Paso 1
Auditar mocks/componentes actuales y decidir qué reutilizar.

## Paso 2
Centralizar/adaptar dataset RTM.

## Paso 3
Existencias + detalle.

## Paso 4
Almacenes & Áreas.

## Paso 5
Mapa simple.

## Paso 6
Kardex/Movimientos.

## Paso 7
Conteos.

## Paso 8
Reacomodos/heatmap/analítica como pulido.

No invertir el orden.

---

# 21. CRITERIOS DE ACEPTACIÓN

La fase queda bien cuando puedo demostrar:

### Caso A — Buscar material

Buscar `Papel Couché 90 g`
→ ver físico/reservado/disponible
→ abrir lote
→ ver ubicación
→ abrir mapa
→ localizar posición.

### Caso B — QA

Abrir un lote en Cuarentena
→ físico existe
→ disponible = 0 para esa cantidad bloqueada.

### Caso C — Kardex

Abrir material
→ ver recepción
→ acomodo
→ reserva OP
→ surtido
→ devolución/remanente.

### Caso D — Conteo

Abrir conteo Couché
→ sistema 22,000
→ físico 2,500
→ diferencia -19,500
→ generar recuento/investigación.

### Caso E — Producto Terminado

Abrir PT
→ ver lote
→ reservado
→ staging
→ Carril `EMB-01`.

---

# 22. VALIDACIÓN

Antes de terminar:

1. Ejecutar `npm run build`.
2. Corregir errores TypeScript.
3. Validar navegación Inventario completa.
4. Validar mapa.
5. Validar búsqueda/autocomplete.
6. Validar drawers/modales.
7. Validar themes RTM/Navy/Graphite/Emerald.
8. Confirmar que no aparecen colchones/SC-UID/CEDIS/sucursales en flujos visibles de Inventario.
9. Confirmar que los datos son consistentes entre tabs.
10. No tocar `main`.

---

# 23. ENTREGA

Al terminar reportar corto:

- archivos modificados;
- mocks centralizados;
- tabs adaptadas;
- estructura final del almacén;
- mapa final;
- caso de conteo implementado;
- build status;
- pendientes para la siguiente fase.

No entregar una explicación enorme.

Primero audita.
Después implementa.
Al final resume.
