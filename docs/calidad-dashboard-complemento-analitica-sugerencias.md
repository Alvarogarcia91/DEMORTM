# RTM Demo — Complemento del Dashboard de Calidad: Analítica + Sugerencias del Sistema

## Objetivo

**NO reemplazar ni rediseñar desde cero el Dashboard de Calidad actual.**

El dashboard actual ya funciona bien como consola operativa del día porque muestra:

- KPIs de trabajo pendiente;
- `Pendiente de mi atención`;
- capturas/rondas;
- primeras piezas;
- auditorías pendientes;
- eventos automáticos de Producción;
- desviaciones y análisis 4M.

Este refinamiento debe **complementarlo hacia abajo** con una capa de analítica gerencial y una zona de **Sugerencias del sistema** con semántica morada, siguiendo el patrón visual que ya existe en la plataforma para recomendaciones inteligentes.

La narrativa completa debe quedar:

```text
ARRIBA = ¿Qué tiene que hacer Calidad ahorita?

ABAJO = ¿Dónde estamos fallando, qué está empeorando y qué recomienda revisar el sistema?
```

---

# 1. Regla principal

Conservar la estructura y componentes actuales de `CalidadDashboard.tsx`.

No eliminar:

- KPIs actuales;
- `Pendiente de mi atención inmediata`;
- `Rondas y Próximas Capturas`;
- `Eventos Automáticos de Producción`;
- `Desviaciones de Ruta y Paros Detectados`.

Agregar la nueva analítica **después del bloque operativo actual**, de manera que el usuario pueda seguir usando el dashboard como cola de trabajo.

---

# 2. Filtros globales para la zona analítica

Agregar antes de la nueva sección analítica una barra compacta y sticky/local al bloque:

```text
ANALÍTICA DE CALIDAD

Periodo:
[ 7 días ] [ 30 días ] [ 60 días ] [ 90 días ] [ Personalizado ]

Área:     [ Todas ▾ ]
Proceso:  [ Todos ▾ ]
Cliente:  [ Todos ▾ ]

[ ] Comparar vs periodo anterior                         [ Exportar ]
```

## Comportamiento

- `30 días` seleccionado por default.
- Los filtros afectan todos los widgets de analítica inferiores.
- `Área`: Todas / Offset / Flexografía / Acabados / Serigrafía.
- `Proceso`: dinámico según área cuando aplique.
- `Cliente`: Panasonic, BLACK & DECKER, TYCO, Fresenius, Pentair, etc.
- `Personalizado` puede ser demo con modal/date range sencillo.
- `Exportar` muestra feedback demo consistente con Requisiciones.

No es necesario que los datos provengan de backend; pueden recalcularse con mocks coherentes.

---

# 3. KPIs gerenciales complementarios

Después de filtros, agregar máximo 6 tarjetas compactas.

Ejemplo 30 días:

```text
Cumplimiento auditorías     94.8%      ↑ 2.1 pts
Auditorías realizadas       184        173 conformes
No conformidades             11        ↓ 3 vs anterior
Material en HOLD              4        18,420 pzas
Desviaciones                  7        3 requieren acción
Tiempo prom. liberación      18 min     objetivo < 20 min
```

## Diseño

Seguir el Design System:

- superficie blanca/theme surface;
- número fuerte mono/tabular;
- color semántico por borde/icono/dot, no fondo saturado;
- comparativo pequeño contra periodo anterior;
- click en KPI aplica filtro o abre detalle cuando tenga sentido.

---

# 4. `Mayor incidencia` — TOP de problemas

Agregar un widget grande con tabs internas:

```text
MAYOR INCIDENCIA · 30 DÍAS

[ Clientes ] [ Partes ] [ Procesos ] [ Líneas ] [ Defectos ]
```

Ejemplo pestaña Clientes:

```text
#   Cliente               NC     % total    Tendencia
1   Panasonic             12       28%       ↑ 4
2   BLACK & DECKER         9       21%       ↓ 2
3   TYCO                    7       16%       →
4   Fresenius               5       12%       ↑ 1
5   Pentair                 4        9%       ↓ 1
```

## Interacción

Al seleccionar una fila:

- filtrar la analítica por esa entidad;
- o abrir un drawer compacto.

Ejemplo Panasonic:

```text
Panasonic · 12 NC

Principales defectos
Registro / color        5
Troquelado              3
Dimensional             2
Texto / revisión        2

Partes más afectadas
526412 | G |            6
PN-48201                4
...
```

No usar wording `Los peores`; usar `Mayor incidencia`, `Mayor recurrencia` o `Requiere atención`.

---

# 5. Pareto de defectos

Agregar Pareto realista y clickeable.

```text
PARETO DE DEFECTOS · 30 DÍAS

Registro / Color       31%
Revisión incorrecta    23%
Troquelado             17%
Dimensional            13%
Empaque                 9%
Otros                   7%
```

Debe mostrar:

- cantidad;
- porcentaje;
- acumulado opcional;
- comparación vs periodo anterior.

Click en un defecto → aplica filtro a widgets inferiores.

Esto responde directamente a los requerimientos de Calidad de visualizar Pareto y defectos por cliente, parte, línea y proceso.

---

# 6. Tendencia de Calidad

Agregar gráfica temporal.

## Métricas

- % de auditorías conformes;
- No Conformidades;
- opcional: tiempo promedio de liberación.

Granularidad:

- 7 días → por día;
- 30 días → por semana/día agrupado;
- 60/90 días → por semana;
- personalizado largo → por mes cuando aplique.

Ejemplo:

```text
Semana 1   92.1% conformidad   5 NC
Semana 2   94.0%               3 NC
Semana 3   95.8%               2 NC
Semana 4   96.4%               1 NC
```

Título sugerido:

`Tendencia de conformidad y hallazgos`

---

# 7. Desempeño por proceso

Agregar tabla comparativa accionable:

```text
PROCESO              AUDITORÍAS   CONFORMIDAD   NC   TIEMPO LIB.
Flexografía               68          96.2%      3      14 min
Offset                     55          91.8%      6      21 min
Acabados                   38          94.7%      2      17 min
Serigrafía                 23          95.6%      1      16 min
```

Click en proceso → filtra widgets analíticos.

Agregar indicadores pequeños:

- ↑ mejora;
- ↓ deterioro;
- sin cambio.

---

# 8. Matriz proceso × defecto

Agregar visual compacto tipo heatmap/lista matricial.

Ejemplo:

```text
                 Impresión  Corte  Doblado  Troquel  Rebobinado
Color                12       -       -       -          -
Dimensión              2       8       3       5          1
Revisión               6       1       -       2          -
Registro               9       -       -       4          -
Empaque                -       -       -       -          6
```

Objetivo:

que un gerente pueda detectar rápidamente dónde se concentra cada defecto.

No usar fondos saturados; usar intensidad discreta del theme/borde y valores legibles.

---

# 9. Reincidencias y problemas repetitivos

Agregar bloque `Reincidencias`.

Ejemplo:

```text
Registro de color
8 eventos · 4 OP · 3 clientes
ICAR-2026-031 abierto
[Ver análisis]

Revisión incorrecta
5 eventos · misma parte en 3 ocasiones
Tercera reincidencia
[Abrir ICAR]

Dimensión fuera de tolerancia
4 eventos · Guillotina 2
+37% vs periodo anterior
[Analizar]
```

Objetivo:

no sólo contar defectos, sino identificar recurrencia.

Debe conectar con ICAR/4M ya implementado.

---

# 10. Controles periódicos

Agregar widget de cumplimiento de capturas:

```text
CONTROLES PERIÓDICOS

Cumplimiento de capturas       97.4%

En tiempo          146
Vencidas             4
Fuera de rango        3
```

Y listado de últimos fuera de rango:

```text
Temperatura cuarto adhesivos    25.8 °C
Humedad almacén sensible        64 %RH
```

Botones:

- `Ver capturas`;
- `Capturar ahora` cuando aplique.

Reutilizar `PeriodicControl` y `CapturasWorkspace` actuales; no duplicar lógica.

---

# 11. Sugerencias del sistema — MORADO / Smart

Agregar un bloque visible pero sobrio:

```text
SUGERENCIAS DEL SISTEMA
```

Usar la semántica morada ya utilizada por la plataforma para `SMART / SUGERENCIA`:

- fondo blanco/theme surface;
- borde morado discreto;
- icono `Sparkles` morado;
- dot morado;
- texto principal oscuro;
- badge `Sugerencia` con borde morado;
- NO card completamente morada.

## Qué debe hacer

Las sugerencias deben salir de patrones visibles en los mocks actuales y sentirse útiles, no mágicas.

Ejemplos:

### Sugerencia 1 — Reincidencia

```text
✦ SUGERENCIA
Registro de color aumentó 37% en Flexografía durante los últimos 30 días.
4 de 7 casos ocurrieron después de cambio de bobina.

[Ver eventos] [Crear acción preventiva]
```

### Sugerencia 2 — Proceso

```text
✦ SUGERENCIA
Offset concentra 54% de las No Conformidades del periodo.
La mayor recurrencia está en revisión incorrecta y dimensiones de corte.

[Filtrar Offset] [Ver Pareto]
```

### Sugerencia 3 — Tiempo de liberación

```text
✦ SUGERENCIA
Las liberaciones de la línea Conserver 3–4 promedian 28 min,
10 min por encima del promedio de planta.

[Ver auditorías] [Analizar causa]
```

### Sugerencia 4 — Calibración / captura

```text
✦ SUGERENCIA
2 controles fuera de rango utilizaron el mismo higrómetro QA-HG-004.
Verifica vigencia y condición del instrumento antes de la próxima ronda.

[Ver instrumento] [Abrir Metrología]
```

### Sugerencia 5 — Cliente

```text
✦ SUGERENCIA
Panasonic presenta 3 reincidencias sobre la parte 526412 | G |.
Conviene revisar Plan de Control y evidencia de primera pieza.

[Ver parte] [Ver Plan de Control]
```

## Reglas UX

- mostrar máximo 3 sugerencias simultáneas en dashboard;
- ordenar por impacto/prioridad;
- cada sugerencia debe tener una razón clara;
- cada sugerencia debe tener acción clickeable;
- permitir `Descartar` demo;
- no usar frases de IA genéricas como `la inteligencia artificial detectó`;
- wording preferido: `El sistema detectó`, `Se observa`, `Se recomienda revisar`.

---

# 12. Diseño de la zona de sugerencias

Inspirarse en el comportamiento visual de las sugerencias/reorden de Requisiciones, no inventar otro patrón.

Ejemplo de card:

```text
┌──────────────────────────────────────────────────────────────┐
│ ✦  Sugerencia del sistema                         [● SMART]  │
│                                                              │
│ Offset concentra 54% de los hallazgos del periodo.          │
│ Revisión incorrecta aumentó 3 eventos vs periodo anterior.   │
│                                                              │
│ [Filtrar Offset]   [Ver Pareto]                    Descartar │
└──────────────────────────────────────────────────────────────┘
```

Semántica:

- `border-purple-500/40` o token equivalente;
- `Sparkles` morado;
- pills blancos con borde morado;
- selección/hover conforme a `design-system.md`.

---

# 13. Orden recomendado del Dashboard completo

```text
DASHBOARD CALIDAD
│
├── KPIs operativos actuales                         EXISTE
│
├── Pendiente de mi atención                         EXISTE
│   ├── capturas
│   ├── auditorías
│   └── desviaciones
│
├── Rondas / Eventos automáticos                    EXISTE
│
├── Desviaciones 4M                                 EXISTE
│
├── ───────────── ANALÍTICA ─────────────
│
├── Filtros 7d / 30d / 60d / 90d
│
├── KPIs gerenciales
│
├── Sugerencias del sistema                         NUEVO MORADO
│
├── Mayor incidencia                                NUEVO
│   └── Cliente / Parte / Proceso / Línea / Defecto
│
├── Pareto                                          NUEVO
│
├── Tendencia                                       NUEVO
│
├── Desempeño por proceso                           NUEVO
│
├── Heatmap proceso × defecto                       NUEVO
│
├── Reincidencias / ICAR                            NUEVO
│
└── Cumplimiento controles periódicos               NUEVO
```

---

# 14. Interacciones cruzadas

Para que el demo se sienta vivo:

- cambiar periodo recalcula todos los widgets;
- seleccionar cliente filtra todo;
- seleccionar proceso filtra todo;
- click en defecto filtra Pareto / ranking / tendencia;
- una sugerencia puede aplicar filtro automáticamente;
- `Ver auditorías` navega/abre Auditorías;
- `Ver Plan de Control` abre Gestión SGC / Plan de Control;
- `Abrir ICAR` usa el flujo ICAR existente;
- `Capturar ahora` abre `CapturaMedicionModal` existente;
- `Analizar 4M` reutiliza `AnalizarDesviacionModal`.

No crear botones muertos.

---

# 15. Mocks y consistencia

Crear suficientes eventos históricos para que los filtros tengan sentido.

Necesitamos al menos:

- 90 días de auditorías demo;
- hallazgos por fecha;
- cliente;
- parte;
- proceso;
- línea/máquina;
- defecto;
- resultado;
- tiempo de liberación;
- vínculo opcional a ICAR;
- capturas periódicas históricas.

No es necesario crear cientos de objetos manualmente; se puede generar dataset determinista en `mockCalidadData.ts`.

Los datos deben mantener coherencia con clientes, máquinas, partes y procesos ya existentes en RTM demo.

---

# 16. Design System obligatorio

Leer y respetar:

- `docs/design-system.md`;
- `src/components/Compras/Requisiciones/RequisicionesDashboard.tsx`;
- componentes compartidos en `src/components/common/`.

Conservar:

- `bg-theme-surface`;
- `border-theme-subtle`;
- `text-theme-main`;
- `text-theme-muted`;
- `bg-theme-primary`;
- `font-mono` / `tabular-nums` en métricas;
- cards limpias `rounded-2xl/3xl`;
- semántica por borde/icono/dot;
- responsive real.

Para SMART/Sugerencias:

- morado únicamente como acento;
- no usar fondo morado saturado;
- cards claras, enterprise y consistentes con la plataforma.

---

# 17. Restricciones

- No rehacer `CalidadDashboard`.
- No borrar los bloques operativos actuales.
- No romper Captura, Auditorías, Liberaciones, Trazabilidad o SGC.
- No duplicar componentes existentes.
- `src/` es fuente canónica.
- Demo frontend; no backend/API/migraciones.
- No botones muertos.
- Mantener buena performance aunque el dataset histórico crezca.

---

# 18. Criterio de éxito del demo

En el demo debe poder hacerse esto:

```text
Entrar a Calidad
→ ver pendientes de hoy
→ atender una auditoría/captura
→ bajar a Analítica
→ cambiar de 30 a 60 días
→ ver Mayor incidencia
→ seleccionar Offset
→ Pareto y tendencia se actualizan
→ el sistema muestra una sugerencia morada:
   "Offset concentra 54% de NC"
→ click Ver Pareto / Filtrar Offset
→ detectar reincidencia
→ abrir ICAR / análisis 4M
```

La sensación final debe ser:

> **El dashboard actual sigue siendo la consola operativa de Alicia, pero ahora también funciona como herramienta de análisis y le ayuda a priorizar dónde investigar.**
