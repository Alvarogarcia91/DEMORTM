<<<<<<< HEAD
# Ventas (Básico) — Especificación funcional del demo Super Colchones

## 1. Objetivo

Construir un módulo comercial básico, visualmente potente y conectado con el catálogo/inventario existente.

Flujo principal:

**Cotización → autorización → aceptación → solicitud de pedido → autorización de pedido → pedido generado**

El módulo debe demostrar:

- cotizaciones;
- cotizador con listas de precios de venta;
- reglas comerciales y descuentos;
- autorización de cotizaciones;
- pedidos pendientes de autorización;
- generación de pedidos;
- clientes;
- dashboards comerciales por producto, sucursal y showroom;
- productos más/menos vendidos, tendencia y margen;
- relación entre exhibición física y desempeño comercial.

Es frontend demo. No backend, DB, CFDI, cobranza ni comisiones.

---

# 2. Navegación

Sidebar:

## VENTAS [BÁSICO]

- Cotizaciones
- Pedidos
- Clientes

Cada item navega directo a su vista.

---

# 3. Design system

Ventas debe obedecer el design system compartido:

- superficies blancas;
- texto principal negro/slate oscuro;
- rojo Super Colchones para CTA principal/activo;
- color semántico en borde/icono/acento;
- pills con fondo blanco, texto oscuro y outline semántico;
- evitar superficies pastel completas;
- reutilizar primitives comunes.

---

# 4. Cotizaciones

## 4.1 Subtabs

1. Dashboard
2. Cotizaciones

Default: Dashboard.

## 4.2 Dashboard de Cotizaciones

Debe responder:

- cotizaciones abiertas;
- monto cotizado;
- pendientes de autorización;
- aceptadas;
- conversión cotización → pedido;
- productos más cotizados;
- clientes más cotizados;
- actividad por sucursal;
- cotizaciones próximas a vencer.

KPIs sugeridos:

- Cotizaciones abiertas
- Pendientes de autorización
- Cotizaciones aceptadas
- Conversión a pedido
- Monto cotizado del periodo
- Ticket promedio cotizado

Visualizaciones:

- cotizaciones por semana;
- cotizaciones por estado;
- top artículos cotizados;
- top clientes;
- actividad por sucursal;
- próximas a vencer.

Filtros:

- Hoy / 7 días / 30 días / 90 días
- Sucursal
- Cliente
- Estado

Datos históricos pueden ser simulados con helper discreto de modo demo.

## 4.3 Listado de Cotizaciones

Columnas:

- Folio
- Fecha
- Cliente
- Sucursal
- Artículos
- Unidades
- Total
- Vigencia
- Vendedor
- Estado
- Acción

Folios mock: COT-2026-0101, COT-2026-0102, COT-2026-0103.

Estados:

- Borrador
- Pendiente de autorización
- Autorizada
- Enviada al cliente
- Aceptada
- Rechazada
- Vencida
- Convertida en pedido

---

# 5. Cotizador comercial

La creación/edición de cotización debe incluir un **Cotizador** realista de demo.

## 5.1 Fuente de precios

Los precios NO deben inventarse en cada cotización.

Crear concepto frontend compartido de **Listas de precios de venta**.

Ejemplos:

- Lista General Retail 2026
- Lista Sucursales Norte 2026
- Lista Promoción Agosto
- Lista Mayoreo / Convenio

Cada lista puede tener:

- nombre;
- moneda;
- vigencia inicio/fin;
- estado: Vigente / Programada / Vencida / Inactiva;
- artículos y precios;
- opcionalmente escalas por volumen.

Para demo soportar MXN y, si no complica, USD.

La cotización debe mostrar claramente:

- lista aplicada;
- precio de lista;
- precio cotizado;
- descuento aplicado;
- subtotal.

## 5.2 Selección automática de lista

Al seleccionar cliente y sucursal, sugerir una lista vigente.

Ejemplo:

Cliente público general → Lista General Retail 2026
Cliente convenio → Lista Convenio Empresas
Promoción vigente → Lista Promoción Agosto

El usuario puede cambiar la lista si las reglas mock lo permiten.

## 5.3 Lista por cliente

El cliente puede tener:

- Lista preferida
- Condición comercial
- Descuento base autorizado

Ejemplo:

Hoteles Monterrey Demo
Lista: Convenio Empresas 2026
Descuento base: 8%

No implementar contratos reales.

## 5.4 Precio por partida

Cada partida debe mostrar:

- SKU
- Artículo
- Cantidad
- Precio lista
- Descuento
- Precio neto
- Subtotal
- Existencia local

Ejemplo:

SC-NAYT-FLOW-IND
Nayt Flow Basic Individual
2 pzas
Precio lista: $7,499
Descuento: 5%
Precio neto: $7,124.05
Subtotal: $14,248.10

## 5.5 Reglas de descuento

Crear reglas comerciales demo, centralizadas y configurables en mocks.

Ejemplo inicial:

- 0–5%: permitido sin autorización adicional;
- >5% y hasta 10%: requiere autorización comercial;
- >10%: requiere autorización especial / gerencia;
- descuento máximo absoluto demo: 15%;
- algunos artículos/promociones pueden tener descuento máximo propio;
- productos ya en promoción pueden bloquear descuento adicional o limitarlo.

No hardcodear la regla dentro de cada componente; centralizarla.

## 5.6 Tipos de descuento

Permitir demo:

- descuento por partida (%);
- descuento general de cotización (%);
- precio manual excepcional.

El precio manual debe mostrar comparación contra precio lista y requerir motivo.

## 5.7 Validación y autorización

El cotizador debe evaluar la cotización y mostrar:

`Dentro de política`

o

`Requiere autorización`

Ejemplos:

- descuento máximo aplicado 4% → Dentro de política;
- partida con 8% → Requiere autorización comercial;
- precio manual 12% debajo de lista → Requiere autorización especial.

Mostrar motivo de forma clara.

## 5.8 Margen estimado

Para fines demo, los artículos pueden tener un costo mock compartido.

Mostrar internamente en el cotizador:

- Venta estimada
- Costo estimado
- Margen estimado $
- Margen estimado %

Esto sirve para autorización y dashboards.

No afirmar que es margen contable real.

Ejemplo:

Venta: $14,248
Costo: $9,200
Margen estimado: $5,048
Margen: 35.4%

## 5.9 Regla por margen

Agregar regla mock opcional:

- margen >= 30% → Normal
- margen 20–29.99% → Atención
- margen <20% → requiere autorización especial

La autorización debe explicar si se disparó por descuento, margen o precio manual.

## 5.10 Escalas de volumen

Si la lista lo incluye, sugerir precios por cantidad.

Ejemplo:

1–4 pzas: $7,499
5–9 pzas: $7,249
10+ pzas: $6,999

Al cambiar cantidad, actualizar precio sugerido automáticamente.

## 5.11 Promociones

Permitir promociones mock:

- descuento de campaña;
- precio promocional vigente;
- bundle simple si existe.

No sobreimplementar motor promocional.

## 5.12 Resumen del cotizador

Mostrar panel lateral o superior:

- Lista aplicada
- Subtotal lista
- Descuentos
- Subtotal neto
- IVA
- Total
- Margen estimado
- Estado de política

CTA:

- Guardar borrador
- Enviar a autorización

---

# 6. Nueva Cotización

Wizard sugerido:

1. Cliente
2. Sucursal
3. Artículos / Cotizador
4. Condiciones
5. Resumen

### Cliente
Autocomplete por nombre, razón social, RFC demo, teléfono o correo.

Acción opcional: `Nuevo cliente rápido`.

### Sucursal
- Valle Oriente
- Cumbres

### Artículos / Cotizador
Autocomplete sobre catálogo existente por SKU, nombre, marca, medida y categoría.

Mostrar existencia local y contexto de otras instalaciones.

### Condiciones
- vigencia;
- forma de pago mock;
- entrega;
- notas;
- descuento general si aplica.

### Resumen
Cliente, sucursal, lista de precios, partidas, subtotal, descuentos, IVA, total, margen estimado, vigencia y estado de política.

---

# 7. Autorización de Cotización

La cotización no genera pedido directamente.

Flujo:

Borrador → Pendiente de autorización → Autorizada → Enviada → Aceptada → Generar pedido

Acciones en pendiente:

- Autorizar
- Solicitar ajuste
- Rechazar

El detalle debe mostrar las razones de autorización:

- descuento;
- margen;
- precio manual;
- política comercial.

---

# 8. Generar Pedido

`Generar pedido` solo aparece cuando cotización está Autorizada + Aceptada.

Al pulsarlo, crear solicitud de pedido:

PED-2026-0201
Origen: COT-2026-0101
Estado: `Pendiente de autorización`

Mostrar: `Pedido generado y enviado a autorización.`

La cotización conserva referencia al pedido.

---

# 9. Pedidos

## 9.1 Subtabs

1. Dashboard
2. Pendientes de autorización
3. Pedidos

Default: Dashboard.

## 9.2 Pendientes de autorización

Mostrar pedidos generados desde cotizaciones aceptadas que aún requieren aprobación.

Columnas:

- Pedido
- Cotización origen
- Cliente
- Sucursal
- Artículos
- Unidades
- Total
- Margen estimado
- Fecha
- Estado
- Acción

Detalle con:

- resumen de cotización;
- lista/precios utilizados;
- descuentos;
- margen;
- disponibilidad;
- acciones Autorizar / Solicitar ajuste / Rechazar.

Al autorizar:

Estado → `Pedido generado` / `Pendiente de surtido`.

No implementar todavía logística completa desde Ventas; dejar preparado enlace futuro a Recolección/Embarques.

---

# 10. Dashboard de Pedidos

Debe ser uno de los dashboards más fuertes del demo.

Filtros globales:

- Hoy / 7 días / 30 días / 90 días / 6 meses
- Todas / Valle Oriente / Cumbres
- Marca
- Categoría / Medida

KPIs:

- Pedidos del periodo
- Unidades vendidas
- Venta estimada
- Margen estimado
- Ticket promedio
- Pendientes de autorización

## 10.1 Más vendido

Card destacada con artículo, SKU, unidades, venta y margen.

Ejemplo demo: Nayt Flow Basic Individual como uno de los líderes.

## 10.2 Menor movimiento

Artículo con menor venta dentro del catálogo activo, mostrando unidades y días desde última venta.

## 10.3 En tendencia

Artículo con crecimiento reciente vs periodo anterior.

Mostrar crecimiento porcentual mock y sparklines si la librería actual lo permite.

## 10.4 Mayor margen

Ranking de artículos con mejor margen estimado.

Mostrar:

- Venta
- Costo mock
- Margen $
- Margen %

## 10.5 Ventas por sucursal

Comparar Valle Oriente y Cumbres:

- pedidos;
- unidades;
- venta;
- margen;
- ticket promedio.

## 10.6 Showroom — efectividad de exhibición

El dashboard debe aprovechar las ubicaciones SHOW-01…SHOW-06 ya existentes.

Crear indicador demo de **Efectividad de showroom**.

Objetivo: mostrar si exhibir cierto colchón en sucursal parece correlacionarse con mejores ventas.

Ejemplo:

Nayt Flow Basic Individual
Sucursal Valle Oriente
SHOW-02

Antes de exhibición: 8 uds/30d
Después de exhibición: 14 uds/30d
Variación: +75%

Etiqueta: `Exhibición con impacto positivo`

Otro ejemplo puede tener impacto neutral o negativo.

No afirmar causalidad real; usar copy `desempeño observado` / `impacto demo`.

## 10.7 Ranking showroom

Tabla:

- Sucursal
- Bahía
- Artículo exhibido
- Ventas 30d
- Variación vs periodo previo
- Margen
- Estado

Estados:

- Alto impacto
- Impacto positivo
- Neutral
- Bajo impacto

## 10.8 Productos con buena venta y baja existencia

Cruzar mocks comerciales con inventario compartido.

Mostrar artículo, sucursal, venta reciente, disponible y cobertura.

CTA opcional: `Crear requisición` navegando a Compras/Requisiciones con contexto precargado.

## 10.9 Visualizaciones

Agregar de forma equilibrada:

- tendencia de pedidos/venta;
- top artículos;
- ventas por sucursal;
- margen por producto/marca;
- mix de medidas;
- ranking showroom;
- pedidos por estado.

No saturar ni duplicar Inventario Analítica.

## 10.10 Insights

Bloque `Observaciones del periodo` con frases demo:

- Nayt Flow Individual lidera unidades vendidas;
- Valle Oriente registra mayor ticket promedio;
- SHOW-02 presenta aumento de ventas del artículo exhibido;
- X artículo tiene buena demanda pero baja existencia;
- Y artículo concentra mayor margen estimado.

---

# 11. Clientes

## 11.1 Subtabs

1. Dashboard
2. Clientes

Default: Dashboard.

## 11.2 Dashboard de Clientes

KPIs:

- Clientes activos
- Clientes nuevos del periodo
- Clientes con cotización abierta
- Clientes con pedido
- Ticket promedio
- Recompra estimada

Visualizaciones:

- clientes por sucursal;
- nuevos vs recurrentes;
- top clientes por venta;
- top por margen;
- frecuencia de compra;
- últimas altas.

## 11.3 Listado Clientes

Columnas:

- Cliente
- Tipo
- Contacto
- Sucursal preferida
- Lista de precios
- Cotizaciones
- Pedidos
- Última compra
- Estado
- Acción

Tipos demo:

- Persona
- Empresa
- Convenio

## 11.4 Detalle Cliente

Tabs sugeridos:

- Resumen
- Contactos
- Direcciones
- Cotizaciones
- Pedidos
- Condiciones comerciales
- Historial

Mostrar lista de precios preferida y descuento base autorizado.

No implementar cobranza.

---

# 12. Datos compartidos y consistencia

Reutilizar:

- catálogo de Artículos;
- SKUs;
- inventario por instalación;
- sucursales;
- showroom;
- listas de precios de venta creadas para Ventas;
- clientes;
- cotizaciones;
- pedidos.

No crear otro catálogo de artículos ni inventario paralelo.

Los precios de venta son mocks del demo y deben estar claramente separados de costos/precios de compra de Proveedores.

---

# 13. Wording

Usar:

- Cotización
- Cotizador
- Lista de precios
- Precio de lista
- Precio neto
- Descuento
- Margen estimado
- Pendiente de autorización
- Pedido
- Cliente
- Sucursal
- Showroom / Exhibición cuando corresponda

Evitar:

- Quote
- Sales Order
- CRM como nombre principal
- Pricing Engine
- WMS
- Nodo
- Procurement

---

# 14. Fuera de alcance

No implementar:

- backend;
- base de datos;
- CFDI;
- cobranza;
- cuentas por cobrar;
- comisiones;
- devoluciones comerciales complejas;
- facturación;
- pagos;
- promociones avanzadas;
- motor real de optimización comercial.

---

# 15. Validación de demo

Escenario de punta a punta:

1. Abrir Cotizaciones Dashboard.
2. Crear cotización para cliente demo en Valle Oriente.
3. Aplicar lista de precios vigente.
4. Agregar Nayt Flow Individual.
5. Cambiar cantidad y demostrar escala de volumen.
6. Aplicar descuento dentro de política.
7. Mostrar margen estimado.
8. Enviar a autorización.
9. Autorizar.
10. Marcar aceptada por cliente.
11. Generar pedido.
12. Pedido aparece en Pendientes de autorización.
13. Autorizar pedido.
14. Pedido pasa a listado de Pedidos.
15. Dashboard refleja venta/unidades/margen.
16. Filtrar Valle Oriente/Cumbres.
17. Mostrar más vendido, menos vendido, tendencia y mayor margen.
18. Mostrar efectividad demo de showroom.
19. Abrir Clientes y navegar su dashboard/listado.

Todo debe compilar mediante Docker y permanecer únicamente en `alvaro01` hasta autorización de merge.
=======
﻿# Documento Funcional: Módulo de Ventas [Básico] - Demo Super Colchones

## 1. Visión General
El módulo **Ventas [Básico]** proporciona la infraestructura comercial para la prospección, cotización, autorización de políticas de precio/margen, conversión a pedidos y gestión de clientes en las sucursales y CEDIS de Super Colchones.

## 2. Estructura de Navegación
- **Cotizaciones**: Dashboard analítico y gestión de propuestas comerciales con cotizador por partida, listas de precios de venta, descuentos y evaluación de margen.
- **Pedidos**: Dashboard comercial integral, bandeja de autorización de pedidos y seguimiento de surtido.
- **Clientes**: Directorio comercial maestro, condiciones preferenciales, histórico de compras y expediente.

## 3. Reglas Comerciales y Políticas de Autorización
### Descuentos:
- **0% – 5%**: Dentro de política (Autorización automática).
- **> 5% – 10%**: Requiere Autorización Comercial.
- **> 10% – 15%**: Requiere Autorización Especial / Gerencia.
- **Precios Manuales**: Requieren motivo justificado y autorización.

### Margen Comercial Estimado:
- **>= 30%**: Normal (verde/borde esmeralda).
- **20% – 29.99%**: Atención (ámbar).
- **< 20%**: Requiere autorización especial (rojo/borde rosa).

## 4. Flujo Operativo de Cotización a Pedido
1. Creación de Cotización (Wizard 5 Pasos: Cliente, Sucursal, Cotizador, Condiciones, Resumen).
2. Evaluación automática de políticas comerciales.
3. Si requiere autorización -> Pasa a estado *Pendiente de autorización*.
4. Al ser autorizada y aceptada por el cliente -> Botón *Generar pedido*.
5. Se crea el pedido con folio PED-2026-XXXX en estado *Pendiente de autorización*.
6. La gerencia autoriza el pedido -> Pasa a *Pendiente de surtido* para la cadena logística.
>>>>>>> 0a4aafd (feat: complete executive operations command center in Inicio and logistics module in Embarques & Entregas)
