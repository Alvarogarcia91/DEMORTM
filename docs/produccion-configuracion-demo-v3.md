# RTM Demo — Producción v3: Configuración + Planeación + Ejecución

> Branch obligatoria: `alvaro01`
>
> Objetivo: que el demo no empiece en una OP ya inventada. Debe demostrar **cómo RTM configura cómo se fabrica un artículo Offset o Flexo**, cómo el sistema propone máquina/routing/materiales, cómo el planner lo programa y cómo el operador lo ejecuta en piso.
>
> Frontend/demo solamente. Sin backend, APIs ni migraciones.

---

# 1. Problema actual del repo

El módulo Producción ya existe, pero el botón `Nueva OP` actualmente solo muestra un aviso/demo y no permite construir una orden de producción realista.

La mejora debe convertir ese botón en el inicio de un flujo visible y convincente:

```text
NUEVA OP
  ↓
Seleccionar Pedido / Cliente / Artículo
  ↓
Seleccionar o configurar cómo se fabrica
  ↓
OFFSET o FLEXOGRAFÍA
  ↓
Validar especificaciones
  ↓
Calcular / sugerir routing
  ↓
Validar máquina compatible
  ↓
Validar materiales + herramental
  ↓
Confirmar paginación si es Offset
  ↓
Confirmar operaciones en línea si es Flexo
  ↓
Guardar OP
  ↓
Mandar a Planeación
  ↓
Ejecutar en Piso
  ↓
Calidad
  ↓
Producto terminado
```

El usuario debe poder contar en demo dos historias completas:

1. `Configuro y fabrico un manual Offset`.
2. `Configuro y fabrico una etiqueta Flexo`.

---

# 2. Fuente funcional del demo

Esta propuesta se basa en los materiales entregados por RTM y en la explicación de Iván sobre:

- routing real de Offset;
- capacidades de máquinas;
- cálculo de páginas/formas;
- restricciones de materiales;
- configuración de acabados;
- flexografía con varias operaciones dentro de una misma prensa;
- rebobinado posterior;
- reporte diario del operador;
- control de incidencias y tiempos;
- necesidad de ver capacidad semanal;
- necesidad de saber si el material realmente alcanza antes de producir.

No inventar procesos alternos cuando el documento ya define el concepto.

---

# 3. Nueva OP — convertir el banner en un wizard real

Al presionar `Nueva OP`, NO mostrar solamente toast/banner.

Abrir un modal/drawer amplio tipo wizard:

```text
Nueva Orden de Producción

1. Origen
2. Producto
3. Proceso
4. Materiales
5. Planeación
6. Confirmación
```

Debe ser perfectamente utilizable en demo aunque todo viva en estado local.

---

# 4. Paso 1 — Origen

Mostrar:

- Pedido
- Cliente
- Número de parte
- Revisión
- Cantidad pedida
- Stock de producto terminado disponible
- Cantidad a producir
- Fecha solicitada por cliente
- Prioridad

Permitir dos opciones:

```text
[Usar artículo configurado]
[Configurar proceso para este artículo]
```

Para demo, usar artículos y clientes RTM ya presentes en mocks/documentos.

Ejemplos recomendados:

- Black & Decker — Manual Offset
- Fresenius / TYCO / Panasonic — Etiqueta Flexo

---

# 5. Paso 2 — Producto / especificaciones

## 5.1 Offset

Para un manual/instructivo mostrar campos configurables como:

- familia de producto
- ancho final
- largo final
- número de páginas
- gramaje
- tipo de papel/sustrato
- número de tintas
- frente / vuelta
- doblado sí/no
- grapado sí/no
- tipo de grapado
- cantidad por paquete
- archivo / dibujo del cliente como referencia visual demo

Catálogo demo de grapado/acabado:

- Sin grapa
- Grapado al lomo / tipo libro
- Grapado en esquina
- Grapado frontal

No presentar este catálogo como catálogo oficial exhaustivo de RTM; es un catálogo demo configurable inspirado en las capacidades documentadas.

## 5.2 Flexografía

Mostrar:

- familia de producto
- ancho
- largo
- sustrato / bobina
- cantidad por rollo
- número de tintas
- CMYK / Pantone como datos visuales demo
- requiere impresión sí/no
- requiere troquelado sí/no
- requiere barniz sí/no
- requiere laminado sí/no
- requiere tratamiento corona sí/no
- requiere precorte sí/no
- requiere rebobinado sí/no

Además:

- grabado requerido
- suaje requerido
- tipo de suaje si aplica
- observaciones técnicas

---

# 6. Paso 3 — Configurador de proceso

Este es el corazón del demo.

El sistema debe traducir las especificaciones del artículo a un **routing propuesto** y a una lista de **máquinas compatibles**.

El usuario/planner SIEMPRE confirma la propuesta.

---

# 7. Configuración Offset

Ejemplo principal: Manual Black & Decker.

```text
PREIMPRESIÓN
  ↓
IMPRESIÓN
  ↓
GUILLOTINA
  ↓
DOBLADO
  ↓
GRAPADO / ALZADO
  ↓
CALIDAD FINAL
  ↓
EMPAQUE
```

No todas las OP Offset deben llevar todas las etapas.

Crear al menos dos plantillas demo:

### Manual completo

```text
Preimpresión
→ Impresión
→ Guillotina
→ Doblado
→ Grapado
→ Calidad
→ Empaque
```

### Instructivo sencillo

```text
Preimpresión
→ Impresión
→ Guillotina
→ Calidad
→ Empaque
```

Para cada etapa permitir ver/editar:

- proceso
- máquina principal
- máquina alternativa compatible
- setup estimado
- velocidad/capacidad
- tiempo estimado de corrida
- orden de la etapa
- requiere primera pieza de calidad sí/no

Máquinas Offset conocidas para demo:

- Conserver 1–2
- Conserver 3–4
- Conserver DiDDE 860
- Conserver 8 Colores
- Ryobi 1–2
- Heidelberg Speedmaster
- Guillotinas
- Dobladoras
- Stahl
- Muller Martini

Cuando exista una capacidad conocida/documentada, usarla en vez de inventar otra.

---

# 8. Optimizador de paginación Offset

Debe aparecer durante la configuración de un artículo/OP Offset con páginas.

Título visible:

`Optimización de paginación`

Inputs:

- páginas del manual
- cantidad de libros
- máquina propuesta
- tamaño final

La recomendación se basa conceptualmente en `Master Paginacion`.

Usar combinaciones documentadas de formas de:

- 8 páginas
- 12 páginas
- 16 páginas
- 32 páginas

Ejemplos conocidos que deben respetarse cuando se usen:

```text
8  → 8
12 → 12
16 → 16
20 → 8 + 12
24 → 12 + 12
28 → 12 + 16
32 → 32
40 → 8 + 32
44 → 12 + 32
48 → 16 + 32
56 → 12 + 12 + 32
60 → 12 + 16 + 32
64 → 32 + 32
72 → 8 + 32 + 32
80 → 16 + 32 + 32
96 → 32 + 32 + 32
```

Mostrar como resultado:

```text
Paginación recomendada

Forma 1 · 32 páginas
Forma 2 · 32 páginas

Total páginas: 64
Número de formas: 2
Tamaño de pliego: ...
% a imprimir: ...
Pliegos estimados: ...
```

Botones:

```text
[Usar recomendación]
[Ajustar manualmente]
```

Agregar mini vista visual Frente / Reverso inspirada en el Excel, sin pretender ser un RIP ni InDesign.

La recomendación nunca debe guardarse automáticamente sin confirmación del planner.

---

# 9. Configuración Flexografía

Flexo NO se representa como una cadena separada de barniz → laminado → troquelado cuando esas capacidades suceden dentro de la misma prensa.

Debe verse así:

```text
MARK ANDY / PRENSA SELECCIONADA
│
├─ Impresión
├─ Troquelado
├─ Barniz
├─ Laminado
├─ Corona
└─ Precorte
       ↓
REBOBINADO / INSPECCIÓN
       ↓
CALIDAD
       ↓
EMPAQUE
```

Mostrar las operaciones requeridas dentro de la misma tarjeta de máquina:

```text
Mark Andy Scout 10"

Operaciones del trabajo
✓ Impresión
✓ Troquelado
✓ Barniz
— Laminado
— Corona
— Precorte
```

---

# 10. Compatibilidad de máquinas Flexo

El sistema debe mostrar máquinas compatibles según capacidades requeridas.

Ejemplo visual:

```text
Máquinas compatibles

✓ Mark Andy Scout 10"
  Cumple tintas requeridas
  Cumple troquelado
  Cumple barniz
  Carga semanal 74%

✓ Mark Andy 4120
  Cumple capacidades
  Carga semanal 68%

✕ Mark Andy 830
  No cumple número de tintas / capacidad requerida
```

No hacer recomendación random.

La lógica demo debe considerar:

- número de tintas
- ancho/formato cuando esté disponible en mocks
- troquelado
- barniz
- laminado
- corona
- precorte
- carga semanal
- estado operativo

El planner puede seleccionar una alternativa compatible.

---

# 11. Suaje y grabado en Flexo

Dentro de la configuración Flexo mostrar un bloque `Herramental`.

Campos demo:

```text
Grabado
Estado: Liberado / Pendiente
Cantidad
Dientes / referencia cuando aplique

Suaje
Tipo: sólido / flexible
Tipo de corte
Repeat
Dientes
Ancho útil
Carriles / salidas
Estado: Disponible / Pendiente
```

No es necesario recrear toda la calculadora de suajes en esta entrega.

Sí debe existir vínculo visual con los conceptos documentados en la hoja de especificación de suaje rotativo.

Si el herramental está pendiente, la OP puede guardarse pero debe quedar con alerta y no mostrarse como `Lista para producir`.

---

# 12. Paso 4 — Materiales / insumos

Antes de mandar a Planeación, mostrar materiales calculados/requeridos.

Tabla:

```text
INSUMO | REQUERIDO | RESERVADO | ENTREGADO | DISPONIBLE | LOTE | ESTADO
```

## Offset

Puede incluir:

- papel / pliego / bobina
- tintas
- placas / negativos
- material de empaque

## Flexo

Puede incluir:

- sustrato / bobina
- tintas
- grabado
- suaje
- barniz si aplica
- laminado si aplica
- material de empaque

Estados:

```text
✓ Disponible
⚠ Parcial
✕ Insuficiente
```

Si algo falta, mostrar alerta clara antes de confirmar la OP.

---

# 13. Paso 5 — Planeación

Después de configurar el proceso, calcular visualmente:

- setup estimado
- corrida estimada
- tiempo total
- máquina seleccionada
- carga semanal
- fecha interna de producción
- fecha estimada de finalización
- fecha requerida por cliente
- riesgo de entrega

Ejemplo:

```text
Fecha cliente:     11 Sep
Fecha interna:      9 Sep
Fecha estimada:     9 Sep

Setup:              00:35
Corrida:            02:48
Total:              03:23

Material:           Completo
Herramental:        Liberado
Capacidad:          Disponible
Riesgo de entrega:  Bajo
```

Botón final:

`Crear OP y enviar a Planeación`

Al confirmar, la nueva OP debe aparecer inmediatamente en:

- Órdenes
- Planeación
- Dashboard

Todo local/mock.

---

# 14. Planeador — debe consumir la configuración

La OP creada ya debe traer:

- routing
- máquina propuesta
- máquinas alternativas
- materiales
- paginación Offset si aplica
- operaciones Flexo si aplica
- setup
- corrida
- fecha cliente
- fecha interna

El planeador no debe volver a inventar esos datos.

Debe permitir reprogramar con modal:

```text
Nueva máquina
Nueva fecha
Motivo
Impacto en carga
Impacto en fecha estimada
```

---

# 15. Ejecución en Piso

La OP configurada llega a la estación correspondiente.

El operador debe ver:

- OP
- cliente
- número de parte
- revisión
- proceso actual
- máquina
- materiales listos
- herramental listo
- objetivo
- primera pieza requerida

Acciones:

```text
[Iniciar preparación]
[Iniciar producción]
[Registrar producción]
[Pausar]
[Registrar paro]
[Solicitar material adicional]
[Terminar operación]
```

---

# 16. Reporte diario del operador

Digitalizar el formato entregado por RTM.

Mostrar/capturar:

- Fecha
- Turno
- Operador
- Área / máquina
- Hora inicio
- Hora fin
- Código
- OP
- Cliente
- Número de parte
- Tipo de acabado
- Cantidad
- Comentarios

Códigos RTM documentados para demo:

```text
100 Inicio de turno
200 Problemas mecánicos
300 No hay trabajo
400 Junta / entrenamiento
```

Cuando la operación está activa mostrar cronómetro.

---

# 17. Material adicional / merma

Agregar botón visible en Piso:

`Solicitar material adicional`

Si la OP ya recibió material:

```text
Esta OP ya recibió 1,000 pliegos.
Está solicitando 1,000 adicionales.
```

Pedir:

- cantidad
- motivo
- categoría 4M
- comentario

Al confirmar:

- registrar evento
- actualizar material entregado
- crear incidencia si aplica
- reflejar alerta
- incrementar scrap/merma cuando el motivo corresponda

---

# 18. Avance por operación

Cada etapa del routing debe registrar:

- cantidad de entrada
- cantidad buena
- scrap
- hora inicio
- hora fin
- operador
- estado
- observación

Cuando termina:

```text
Impresión ✓
10,800 entrada
10,550 buenas
250 scrap
09:18 → 12:34
```

La siguiente operación queda habilitada visualmente.

---

# 19. Calidad dentro del flujo

No duplicar el módulo de Calidad.

Producción solo debe mostrar gates/estados:

- Preimpresión liberada
- Primera pieza pendiente / liberada
- Auditoría final pendiente / aprobada

Ejemplo:

```text
Primera pieza
✓ Liberada por Calidad
09:27 · Alicia Ramírez
```

Si está pendiente, mostrar bloqueo visual para continuar cuando corresponda en el demo.

---

# 20. Trazabilidad completa

Cada OP debe contar la historia completa:

```text
Pedido recibido
↓
OP creada
↓
Proceso configurado
↓
Paginación confirmada / capacidades Flexo confirmadas
↓
Material reservado
↓
Herramental liberado
↓
Planeación confirmada
↓
Inicio preparación
↓
Primera pieza
↓
Inicio producción
↓
Incidencias / material adicional
↓
Fin operación
↓
Siguiente etapa
↓
Calidad final
↓
Empaque
↓
Producto terminado
```

Cada evento debe mostrar:

- fecha/hora
- usuario/operador
- estación
- evento
- observación cuando aplique

---

# 21. Dos historias obligatorias para demo

## Historia A — Offset

```text
Pedido Black & Decker
→ Nueva OP
→ Manual Offset
→ Configurar tamaño/papel/tintas/páginas/grapado
→ Optimizar paginación
→ Elegir máquina compatible
→ Confirmar routing
→ Validar papel/tinta/placas
→ Crear OP
→ Programar
→ Operador inicia impresión
→ Primera pieza liberada
→ Registrar cantidad/scrap
→ Terminar impresión
→ Guillotina
→ Doblado
→ Grapado
→ Calidad
→ Empaque
```

## Historia B — Flexo

```text
Pedido etiqueta
→ Nueva OP
→ Flexografía
→ Configurar sustrato/tintas/acabados
→ Seleccionar grabado y suaje
→ Sistema filtra máquinas compatibles
→ Elegir Mark Andy
→ Mostrar impresión + barniz + troquelado en la misma prensa
→ Validar bobina/tintas/herramental
→ Crear OP
→ Programar
→ Operador ejecuta
→ Registrar incidencia o material extra
→ Terminar prensa
→ Rotoflex / rebobinado
→ Calidad
→ Empaque
```

---

# 22. UX del botón Nueva OP

El botón `Nueva OP` debe sentirse como uno de los puntos fuertes del demo.

NO debe:

- mostrar solo banner;
- crear una OP random sin configuración;
- pedir campos irrelevantes sin contexto;
- mostrar el mismo formulario para Offset y Flexo.

SÍ debe:

- guiar al usuario;
- cambiar campos según Offset/Flexo;
- mostrar recomendaciones;
- permitir editar la recomendación;
- validar visualmente materiales/herramental;
- terminar con una OP visible en el resto del módulo.

---

# 23. Arquitectura recomendada

Evitar seguir creciendo un único `ProduccionPage.tsx`.

Separar razonablemente:

```text
src/components/Produccion/
├── ProduccionPage.tsx
├── ProductionDashboard.tsx
├── ProductionPlanner.tsx
├── ProductionOrders.tsx
├── ProductionFloor.tsx
├── ProductionOrderDetail.tsx
├── NewProductionOrderWizard.tsx
├── OffsetProcessConfigurator.tsx
├── FlexoProcessConfigurator.tsx
├── ProductionPaginationOptimizer.tsx
├── ProductionMaterials.tsx
├── ProductionRouting.tsx
├── ProductionTraceability.tsx
└── ProductionIncidentModal.tsx
```

No sobrearquitecturar si algunos componentes pequeños pueden combinarse.

En `mockProduccionData.ts` enriquecer tipos/mocks para soportar:

- specifications
- routing
- materials
- tooling
- machineRequirements
- pagination
- executionEvents
- qualityGates
- traceability

Quitar `@ts-nocheck` si es razonablemente posible y tipar Producción.

---

# 24. Restricciones

- trabajar SOLO en `alvaro01`;
- no crear ramas nuevas;
- no tocar `main`;
- frontend/demo;
- sin backend;
- sin APIs;
- sin migraciones;
- no romper otros módulos;
- reutilizar design system actual;
- no duplicar Inventario, Calidad o Mantenimiento;
- usar datos locales/mocks;
- mantener responsive;
- correr build/typecheck disponibles al finalizar.

---

# 25. Criterio de éxito

El demo es exitoso si una persona de RTM puede ver claramente:

1. cómo se configura cómo se fabrica un producto;
2. por qué una máquina sí o no es compatible;
3. qué materiales/herramental necesita;
4. cómo se calcula/propone paginación en Offset;
5. cómo Flexo agrupa varias operaciones dentro de una prensa;
6. cómo esa configuración se convierte en una OP;
7. cómo la OP llega al planeador;
8. cómo el operador la ejecuta;
9. cómo se registran tiempos, scrap e incidencias;
10. cómo queda la trazabilidad hasta producto terminado.

La historia no debe depender de banners simulados para acciones principales. Los banners/toasts pueden acompañar acciones, pero la configuración y ejecución principal deben existir visualmente.