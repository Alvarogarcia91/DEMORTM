# RTM Demo — Calidad v3 · Refinamiento post implementación

## Objetivo

Refinar el módulo de **Calidad** ya implementado en `alvaro01` para que la narrativa principal sea muy clara durante el demo:

> **Calidad entra al sistema, ve qué tiene que auditar/capturar, inicia una auditoría, captura mediciones o hallazgos, emite un dictamen y ese resultado afecta la OP, el material o el proceso.**

No queremos un módulo pasivo de reportes. Debe sentirse como una **herramienta diaria de trabajo para el auditor de Calidad**.

Este refinamiento se basa en:

- reunión de Calidad con Alicia Ramírez y Jorge Márquez;
- Access reales entregados por RTM;
- `Modulos QA.docx`;
- `Registro Auditoria Producto Terminado (2).pptx`;
- `Registro Inspección de Preimpresión.pptx`;
- implementación actual de Calidad y Producción en `alvaro01`.

---

# 1. Lo actual que se conserva

La implementación actual ya tiene buena base y NO se debe rehacer:

- módulo Calidad en Sidebar;
- dashboard QA;
- centro de liberaciones;
- primera pieza;
- auditoría final demo;
- no conformes / HOLD;
- trazabilidad;
- preimpresión;
- etiquetas;
- historial;
- relación con OP, pedido, artículo, revisión, línea y lote;
- eventos de cambio de bobina, turno, ajuste y producción > 2 horas;
- Design System actual.

El trabajo de esta versión es **darle flujo operativo real de captura y auditoría**.

---

# 2. Navegación nueva de Calidad

La vista principal debe tener tabs claras, similares a Requisiciones:

```text
CALIDAD
│
├── Dashboard
├── Captura                  ★ NUEVO / protagonista
├── Auditorías               ★ NUEVO / protagonista
├── Liberaciones
├── Trazabilidad
├── No conformes
└── Gestión SGC
```

En el header siempre debe existir un CTA primario:

`+ Nueva auditoría`

Y como acción secundaria:

`Capturar medición`

El usuario debe poder iniciar trabajo desde Calidad, no solamente abrir registros preexistentes.

---

# 3. Dashboard orientado a trabajo pendiente

El dashboard actual debe evolucionar para contestar:

> **¿Qué tiene que hacer Calidad ahorita?**

KPIs:

- Auditorías pendientes.
- Capturas pendientes hoy.
- Capturas vencidas.
- Primeras piezas pendientes.
- Liberaciones finales pendientes.
- Material en HOLD.

Bloque principal `Pendiente de mi atención`:

```text
10:00  Temperatura cuarto adhesivos       VENCIDA      [Capturar]
10:15  OP-95250 · Primera pieza Flexo     PENDIENTE    [Auditar]
10:40  OP-95252 · Control > 2 horas       PENDIENTE    [Auditar]
11:00  Incoming · Bobina Avery            PENDIENTE    [Inspeccionar]
11:30  Herramental · Placa B&D            PENDIENTE    [Auditar]
```

Cada fila debe tener **botón de acción directo**.

Agregar `Próximas capturas / rondas` con horario y cuenta regresiva.

---

# 4. Módulo Captura — NUEVO

Este módulo representa controles periódicos y mediciones que hoy se llevan en hojas/manual.

La narrativa es:

```text
CONTROL CONFIGURADO
      ↓
EL SISTEMA GENERA UNA CAPTURA PENDIENTE
      ↓
CALIDAD CAPTURA EL VALOR
      ↓
COMPARA CONTRA RANGO
      ↓
CONFORME / FUERA DE RANGO
      ↓
HISTORIAL + ALERTA / ACCIÓN SI APLICA
```

## 4.1 Lista de capturas

Tabla:

- control;
- ubicación / proceso;
- frecuencia;
- última captura;
- próxima captura;
- responsable;
- rango esperado;
- estado;
- acción.

Ejemplos demo:

```text
Temperatura cuarto adhesivos
Ubicación: Cuarto controlado
Frecuencia: Cada 2 h (DEMO configurable)
Rango: 20–24 °C
Última: 08:02 · 22.1 °C
Próxima: 10:02
[Capturar]

Humedad área de almacenamiento sensible
Frecuencia: Cada 4 h (DEMO configurable)
Rango: 40–60 %RH
[Capturar]

Verificación visual de remanente adhesivo
Frecuencia: Al reutilizar remanente
[Capturar]
```

**IMPORTANTE:** RTM sí mencionó que mantiene materiales con adhesivo bajo temperatura controlada y que hoy ese monitoreo se lleva manualmente en una hoja. El intervalo exacto no fue confirmado; por eso cualquier frecuencia concreta debe aparecer como **Demo configurable**.

## 4.2 Modal `Capturar medición`

Header:

- control;
- ubicación;
- fecha/hora automática;
- responsable;
- instrumento utilizado.

Campos:

- valor;
- unidad;
- rango mínimo;
- rango máximo;
- observación;
- evidencia/fotografía demo;
- instrumento.

Ejemplo:

```text
Temperatura cuarto adhesivos
Esperado: 20–24 °C
Captura: [ 25.8 ] °C

Resultado automático:
⚠ FUERA DE RANGO
```

Acciones:

- `Guardar captura`.
- `Guardar y generar alerta` si está fuera de rango.

Debe registrar historial.

## 4.3 Instrumento y calibración

Cuando aplique mostrar:

```text
Instrumento: Higrómetro QA-HG-004
Calibración vigente: Sí
Vence: 18 Nov 2026
```

Esto enlaza visualmente con Metrología sin duplicarla.

---

# 5. Módulo Auditorías — NUEVO

Debe ser el workspace para crear y ejecutar auditorías.

Header:

`+ Nueva auditoría`

Filtros:

- Pendientes.
- En proceso.
- Completadas.
- Rechazadas.
- Tipo.
- Área.
- Fecha.

Tabla:

- folio;
- tipo;
- origen;
- OP / lote / proceso;
- área;
- auditor;
- fecha/hora;
- estado;
- acción `Auditar` / `Ver`.

---

# 6. Flujo `+ Nueva auditoría`

Al hacer clic debe abrir un modal/workspace amplio.

## Paso 1 — ¿Qué quieres auditar?

Cards de selección:

- Producto / OP.
- Primera pieza.
- Proceso / operación.
- Producto terminado.
- Incoming / materia prima.
- Preimpresión / herramental.
- Material / remanente.
- Auditoría interna SGC.

No todas necesitan lógica completa, pero todas deben reaccionar.

## Paso 2 — Seleccionar origen

Ejemplo Producto / OP:

- buscar OP;
- cliente;
- número de parte;
- revisión;
- routing actual;
- máquina;
- operador.

Ejemplo Incoming:

- recepción / OC;
- proveedor;
- material;
- lote proveedor;
- cantidad recibida.

Ejemplo proceso:

- seleccionar área;
- máquina;
- operación;
- OP relacionada opcional/obligatoria según tipo.

## Paso 3 — Cargar checklist automáticamente

El checklist debe depender de lo seleccionado.

## Paso 4 — Capturar

Por criterio:

- Sí / Conforme.
- No / No Conforme.
- N/A.
- valor cuando sea medición;
- defecto;
- cantidad encontrada;
- observación;
- fotografía/evidencia demo.

## Paso 5 — Dictamen

Acciones grandes y claras:

- `Aprobar auditoría`.
- `Rechazar / No Conforme`.
- `Guardar borrador`.

Si falla:

- crear HOLD cuando corresponda;
- generar MNC;
- ofrecer `Abrir ICAR`.

---

# 7. Auditorías automáticas generadas por eventos

No todas las auditorías deben ser creadas manualmente.

El documento QA confirma eventos que deben generar una nueva liberación/auditoría:

- inicio de OP;
- cambio de placas;
- cambio de bobina;
- ajuste de máquina;
- corte eléctrico;
- cambio de turno;
- producción mayor a 2 horas;
- auditoría final.

Narrativa:

```text
OP EN PRODUCCIÓN
    ↓
SE CUMPLEN 2 HORAS
    ↓
SISTEMA GENERA AUDITORÍA QA
    ↓
APARECE EN PENDIENTES
    ↓
[AUDITAR]
```

Este es un momento importante del demo.

No confundir esto con el ejemplo de temperatura. La **regla de >2 horas sí está confirmada para auditoría del producto**.

---

# 8. Checklist por operación, no por área genérica

La implementación actual maneja checklist por `Offset`, `Flexografía` y `Acabados`.

Debe refinarse para resolver por operación real.

## Impresión

- número de parte;
- revisión;
- texto;
- color;
- registro;
- manchas;
- lote tinta;
- diseño vs aprobado.

## Corte

- ancho;
- largo;
- escuadra;
- orientación;
- tolerancias;
- cantidad.

## Doblado

- paginado;
- secuencia;
- orientación;
- medida final;
- doblez;
- páginas completas.

## Intercalado / Grapado

- orden de páginas;
- cantidad de grapas;
- posición;
- firmeza;
- presentación.

## Impresión + Troquel

- registro impresión/troquel;
- dimensiones;
- tipo de corte;
- liner;
- repetición;
- defectos visibles.

## Conteo / Rebobinado

- cantidad;
- orientación;
- tensión/presentación;
- identificación;
- rollo/caja.

---

# 9. Incoming / Inspección de entrada

El Access real incluye Auditoría Incoming.

Debe existir una vista ejecutable, no solamente un nombre.

Campos:

- proveedor;
- OC / recepción;
- material;
- lote proveedor;
- lote RTM;
- cantidad ordenada;
- recibida;
- certificado/documento proveedor;
- apariencia;
- especificación;
- auditor;
- resultado.

Acciones:

- `Liberar material`.
- `Rechazar / HOLD`.
- `Adjuntar certificado`.
- `Crear no conformidad a proveedor` demo.

---

# 10. Remanentes / material reutilizable

Alicia confirmó que Calidad participa determinando si un remanente todavía es funcional.

Agregar auditoría tipo:

`Validación de remanente`.

Campos:

- material;
- lote;
- origen OP;
- dimensiones remanentes;
- fecha/hora en que quedó;
- ubicación;
- condición visual;
- temperatura registrada cuando aplique;
- requisito específico del cliente;
- destino propuesto.

Dictamen:

- `Apto para reutilizar`.
- `No apto / Scrap`.
- `Mantener en cuarentena`.

La propiedad/administración del remanente sigue siendo de Manufactura/Inventario; Calidad solamente emite el dictamen.

---

# 11. Producción no puede auto-liberarse por Calidad — P0

La implementación actual todavía permite que Producción tenga acciones como:

- `Liberar 1ra Pieza`;
- `Liberar por Calidad y Pasar a Producto Terminado`.

Eso debe corregirse.

Producción puede:

- `Solicitar auditoría QA`;
- `Ver auditoría`;
- `Confirmar primera pieza lista para revisión`.

Pero solo Calidad puede:

- aprobar primera pieza;
- aprobar auditoría en proceso;
- liberar lote/producto terminado;
- rechazar y mandar a HOLD.

Al aprobar desde Calidad, el estado compartido debe actualizar Producción inmediatamente.

---

# 12. Estado compartido Calidad ↔ Producción — P0

Hoy ambos módulos usan estado demo separado.

Unificar para que:

```text
Calidad aprueba Primera Pieza
→ Producción cambia a En proceso

Calidad rechaza
→ Producción queda bloqueada / HOLD

Calidad libera final
→ OP Liberada
→ PT disponible
```

No duplicar OP ni mantener dos versiones contradictorias.

---

# 13. Auditoría Final operativa

La vista actual es demasiado resumida.

Debe mostrar checklist final realista:

- número de parte;
- revisión;
- identificación;
- material base;
- impresión;
- colores;
- manchas;
- refilado;
- doblado;
- grapado;
- embobinado si aplica;
- empaque;
- cantidad.

Además:

- bache;
- cantidad producida;
- cantidad inspeccionada;
- liberada;
- rechazada;
- paquetes;
- rollos;
- cajas;
- parcial;
- lotes de insumo;
- muestra demo.

Acciones:

- `Aprobar y liberar`.
- `No Conforme`.
- `Agregar bache` demo.
- `Imprimir etiquetas`.

---

# 14. Baches / muestras

Hacer visibles como entidades.

Ejemplo:

```text
Bache     Cantidad    Parcial    Muestra    Resultado
44947     145         145        3          Conforme
44948     220         0          5          Pendiente
```

Acciones:

- `Auditar muestra`.
- `Ver bache`.
- `Imprimir etiqueta`.

---

# 15. Etiquetas con preview

No limitarse a un toast.

Preview estilo etiqueta térmica/Zebra con:

- auditor;
- número de control;
- cliente;
- resultado;
- número de parte;
- revisión;
- cantidad;
- lote/bache;
- fecha;
- hora;
- nomenclatura.

Tipos:

- Identificación.
- Bache.
- Parcial.
- Muestra.
- Caja.
- Primera Pieza.

Botón:

`Enviar a Zebra QA-02 · Demo`.

---

# 16. Gestión SGC — mantener secundaria

No convertir el demo principal en una lista de ISO/IATF.

Gestión SGC puede seguir secundaria con mocks ricos:

- ICAR / acciones correctivas;
- auditorías internas;
- metrología;
- control de cambios;
- alertas;
- requisitos cliente;
- RMA.

Pero el **demo principal debe ser captura + auditoría + dictamen + efecto operativo**.

---

# 17. Design System

Obligatorio seguir:

- `docs/design-system.md`;
- UX de Requisiciones;
- componentes de `src/components/common`.

Usar:

- header ejecutivo;
- tabs compactas;
- CTA primario claro;
- cards blancas;
- semántica por borde/icono/dot;
- modales amplios;
- tablas densas;
- `font-mono` para folios/OP/lotes;
- toasts demo;
- responsive.

No copiar Access visualmente.

---

# 18. Regla del repo

`src/` es la fuente canónica.

NO mantener manualmente dos implementaciones en `src/` y `frontend/src/`.

Después de cambios:

```bash
npm run build
npm run sync:frontend
```

Luego verificar que `frontend/src` sea reflejo del canónico.

---

# 19. Historia del demo final

## Historia 1 — Auditoría manual de una OP

```text
Calidad
→ + Nueva auditoría
→ Producto / OP
→ buscar OP-95250
→ seleccionar operación Impresión Flexo
→ sistema carga checklist
→ capturar criterios
→ Conforme
→ OP puede continuar
```

## Historia 2 — Auditoría automática por tiempo

```text
OP lleva >2 horas produciendo
→ sistema genera auditoría pendiente
→ Dashboard Calidad muestra [Auditar]
→ auditor captura
→ Conforme
→ evento queda en trazabilidad
```

## Historia 3 — Captura programada

```text
Temperatura cuarto adhesivos
→ próxima captura vencida
→ [Capturar]
→ 25.8 °C fuera de rango
→ Guardar y generar alerta
→ historial conserva captura
```

La frecuencia de temperatura usada en demo debe marcarse como configurable, ya que RTM confirmó el control manual de temperatura pero no un intervalo específico.

## Historia 4 — No Conforme

```text
Auditoría final
→ criterio falla
→ No Conforme
→ lote/bache HOLD
→ MNC generado
→ opción Abrir ICAR
```

## Historia 5 — Incoming

```text
Recepción de bobina
→ Calidad > Nueva auditoría > Incoming
→ revisar lote/documento/apariencia
→ Liberar material
→ Inventario recibe material conforme
```

---

# 20. Criterio de éxito

En menos de 5 minutos el cliente debe entender que Calidad puede:

1. **crear una auditoría**;
2. **recibir auditorías automáticas** por eventos de producción;
3. **capturar mediciones periódicas**;
4. **auditar una operación concreta** con checklist contextual;
5. **aprobar o rechazar**;
6. afectar realmente Producción/Inventario/HOLD;
7. conservar evidencia, historial y trazabilidad.

Si el módulo solo enseña dashboards y registros, el refinamiento no está terminado.