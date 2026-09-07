# RTM Demo — Producción v9 · Piso de Producción, Operador y Scrap

> Branch objetivo: `alvaro01`
>
> Este documento NO pide rehacer Producción. Define la experiencia faltante del operador de planta y eleva Scrap/Pérdidas a un flujo protagonista del módulo.

## 0. Objetivo

Producción ya tiene buena base de planeación, órdenes, recetas, máquinas, materiales, calidad y analítica. El hueco principal es la experiencia diaria del operador.

RTM explicó que el operador debe trabajar desde una terminal/tablet asociada a la máquina, identificarse, recibir la cola priorizada, iniciar y terminar actividades, registrar tiempos, scrap, paros, material adicional y solicitar liberaciones de Calidad.

El demo debe separar claramente dos experiencias:

```text
PRODUCCIÓN
├── Producción                 Supervisor / Planeación / Ingeniería
└── Piso de Producción         Operador
```

Ambas comparten exactamente las mismas OP y el mismo estado demo.

No crear dos sistemas independientes.

---

# 1. Navegación objetivo

En Sidebar, dentro del grupo PRODUCCIÓN:

```text
PRODUCCIÓN
│
├── Producción
│   ├── Dashboard
│   ├── Planeación
│   ├── Órdenes
│   ├── Procesos / Recetas
│   ├── Máquinas
│   ├── Scrap y pérdidas
│   └── Analítica
│
└── Piso de Producción
    ├── Mi trabajo
    ├── Mi cola
    ├── Historial
    └── Mi desempeño
```

`Piso de Producción` debe ser un `NavItemKey` propio, no una tab escondida dentro del workspace supervisor.

La tab `Piso` actual de Producción puede quitarse de la navegación interna o quedar solo como acceso secundario, pero el protagonista operativo debe ser el módulo dedicado.

---

# 2. Narrativa funcional del operador

```text
TERMINAL DE MÁQUINA
      ↓
OPERADOR SE IDENTIFICA
      ↓
VE SU COLA PRIORIZADA
      ↓
PREPARA OP
      ↓
VALIDA MATERIAL / HERRAMENTAL / REVISIÓN
      ↓
INICIA SETUP
      ↓
CAPTURA PAROS / INCIDENCIAS SI OCURREN
      ↓
TERMINA SETUP
      ↓
PREPARA PRIMERA PIEZA
      ↓
SOLICITA QA
      ↓
CALIDAD LIBERA
      ↓
INICIA PRODUCCIÓN
      ↓
REGISTRA BUENAS + SCRAP
      ↓
SOLICITA MATERIAL EXTRA SI APLICA
      ↓
REPORTA PAROS 4M
      ↓
CIERRA OPERACIÓN
      ↓
GENERA REMANENTE SI APLICA
      ↓
MANDA WIP A SIGUIENTE ETAPA
      ↓
CALIDAD FINAL
      ↓
PRODUCTO TERMINADO
```

---

# 3. Pantalla inicial de Piso

La terminal representa una máquina física.

Ejemplo:

```text
PISO DE PRODUCCIÓN · RTM

Terminal: MARK ANDY SCOUT 10"
Área: Flexografía
Estado máquina: Operativa

Número de empleado
[ 0174____________ ]

[ INICIAR TURNO ]
```

En demo el operador puede venir precargado, pero debe sentirse como login de planta.

Después de iniciar turno:

```text
HERÓN V. · TURNO A
MARK ANDY SCOUT 10"

Tiempo productivo      03:42
Tiempo perdido         00:28
Buenas hoy             18,450
Scrap hoy              2.7%

[Mi trabajo] [Mi cola] [Historial] [Mi desempeño]
```

---

# 4. Sugerencias del sistema — patrón morado del ERP

Producción debe adoptar el mismo lenguaje visual que Inventario usa para recomendaciones inteligentes.

Usar:

- `Sparkles`;
- acentos morados;
- badge tipo `smart` si existe;
- wording `Sugerencia del sistema`;
- nunca `AI Powered`.

Ejemplo en Piso:

```text
✦ SUGERENCIA DEL SISTEMA

La siguiente OP usa el mismo sustrato y las mismas tintas.
Mantenerla después de OP-95321 puede evitar aproximadamente 25 min de setup.

[Ver sugerencia]
```

Ejemplos de sugerencias válidas:

```text
PLANEACIÓN
✦ Mark Andy 830 quedaría en 104% de carga.
  Mark Andy Scout es compatible y quedaría en 76%.
  [Reprogramar]

NUEVA OP
✦ Existe remanente REM-075-014 compatible.
  Puede cubrir ~68% del material requerido.
  [Usar remanente]

PISO
✦ Las siguientes dos OP usan el mismo sustrato y tintas.
  Mantener la secuencia reduce cambios de setup.
  [Ver cola]

SCRAP
✦ OP-95321 pasó de 2.8% a 4.6% después del último ajuste.
  [Ver incidencia]

ANALÍTICA
✦ Stahl 2 lleva 3 turnos debajo del estándar.
  Revisar setup, operador o condición de máquina.
  [Analizar]
```

Las sugerencias son determinísticas/mock; no agregar servicio de IA.

---

# 5. Mi Cola — secuencia impuesta por Planeación

El operador no debe escoger libremente cualquier OP.

Mostrar únicamente las OP compatibles/asignadas a la terminal actual, ordenadas por prioridad.

Ejemplo:

```text
MI COLA · MARK ANDY SCOUT 10"

1 · PRIORIDAD ALTA
OP-95321 · FRESENIUS
Etiqueta autoadherible
50,000 etiquetas · 50 rollos
Material      ✓ Surtido
Suaje         ✓ Disponible
Grabados      ✓ Liberados
Fecha         Hoy · 11:30
[PREPARAR OP]

2
OP-95326 · TYCO
Lista para producir
Inicio estimado 11:40

3
OP-95331 · PANASONIC
⚠ Material pendiente
```

Si una OP está bloqueada por material/herramental, debe verse pero no poder iniciar.

---

# 6. Preparar OP

Al abrir una OP mostrar claramente la receta heredada.

## Flexografía

```text
OP-95321 · FRESENIUS
MARK ANDY SCOUT 10"

RECETA
Etiqueta impresa / Barniz / Troquel

CORRIDA INLINE
✓ Impresión · 4 tintas
✓ Barniz UV
✓ Troquel
○ Laminado
○ Corona
○ Precorte

HERRAMENTAL / MATERIAL
✓ Grabado GRA-26098
✓ Suaje SR-084 · 84 dientes
✓ Bobina BOPP · lote PPBC-260721
✓ Tintas · lotes visibles
```

## Offset

```text
OP-95344 · BLACK & DECKER
HEIDELBERG SPEEDMASTER

RECETA
Manual grapado tipo libro

PAGINACIÓN
32 + 32

RUTA
Impresión
→ Guillotina
→ Doblado
→ Intercalado
→ Grapado
→ Empaque
```

---

# 7. Checklist de arranque

Antes de iniciar setup:

```text
CHECKLIST DE ARRANQUE

✓ OP y revisión correctas
✓ Material surtido
✓ Lotes verificados
✓ Herramental correcto
✓ Máquina disponible
✓ Hoja de OP / instrucciones visibles

Setup estándar                45 min
Merma de arranque estándar    Demo configurable

[ INICIAR SETUP ]
```

No poner valores como oficiales RTM si no están confirmados; usar `Demo configurable`.

---

# 8. Setup activo

El setup es una fase separada de la corrida.

```text
● SETUP EN CURSO

OP-95321
Inicio             07:14
Transcurrido       00:31:44
Estándar           00:45:00

[PAUSAR]
[REPORTAR INCIDENCIA]
[SETUP TERMINADO]
```

Registrar inicio/fin real.

Al terminar:

```text
SETUP COMPLETADO

Real         48 min
Estándar     45 min
Variación    +3 min
```

Este dato alimenta `Estándar vs Real`.

---

# 9. Incidencias / paros

Acción disponible durante setup y producción:

`Reportar incidencia`

Modal:

```text
INCIDENCIA

Categoría 4M
[Máquina | Material | Mano de obra | Método]

Motivo
[Ajuste de registro ▼]

Código de actividad
[200 · Problema mecánico ▼]

Comentario
[________________________]

[ INICIAR PARO ]
```

Durante paro:

```text
⏸ OP DETENIDA

Motivo: Problema mecánico
Tiempo perdido: 00:17:32

[ REANUDAR ]
```

Al reanudar registrar duración y alimentar 4M.

Mantener códigos RTM documentados:

```text
100 Inicio de turno
200 Problemas mecánicos
300 No hay trabajo
400 Junta o entrenamiento
```

---

# 10. Primera pieza / Calidad

Producción no se autoaprueba.

Flujo:

```text
SETUP COMPLETADO
      ↓
[GENERAR PRIMERA PIEZA]
      ↓
Primera pieza lista
      ↓
[SOLICITAR LIBERACIÓN QA]
      ↓
ESPERANDO CALIDAD
      ↓
CALIDAD APRUEBA
      ↓
[INICIAR PRODUCCIÓN]
```

Estado mientras espera:

```text
⏳ ESPERANDO CALIDAD
Auditoría QA-26091
Alicia Ramírez
Producción bloqueada hasta dictamen.
```

Después:

```text
✓ PRIMERA PIEZA LIBERADA
Alicia Ramírez · 07:58
[INICIAR PRODUCCIÓN]
```

La aprobación debe venir del estado compartido con Calidad.

---

# 11. Pantalla principal de Producción activa

Esta es la pantalla protagonista del operador.

```text
● PRODUCIENDO                                      01:48:32

OP-95321 · FRESENIUS
MARK ANDY SCOUT 10"

OBJETIVO      BUENAS       SCRAP       AVANCE
50,000        31,420       1,140       65%

VELOCIDAD REAL          ESTÁNDAR
7,840 ft/h              9,000 ft/h
▼ 12.9%

SCRAP ACUMULADO
3.5%
█████████████████░░░░░░
Límite OP: 5.0%
Restante: 1.5 pts

[+ PRODUCCIÓN]
[REPORTAR SCRAP]
[PAUSAR]
[MATERIAL EXTRA]
[INCIDENCIA]
[TERMINAR OPERACIÓN]
```

El scrap debe ser visible TODO el tiempo durante la corrida.

---

# 12. Scrap / Merma — protagonista del módulo

Actualmente Scrap no debe quedar reducido a un contador de Analítica.

RTM necesita visualizar scrap por:

- OP;
- etapa;
- proceso;
- máquina;
- operador/turno;
- causa 4M;
- material;
- acumulado del routing.

Objetivo demo visible:

```text
Límite OP: 5.0%
```

Manejar como estándar configurable si no existe setting formal.

## 12.1 Registrar Scrap

Modal:

```text
REGISTRAR SCRAP / MERMA

Cantidad
[350]

Unidad
[Etiquetas ▼]

Etapa
[Impresión / Corrida ▼]

Tipo
[Merma de proceso ▼]

Causa 4M
[Método ▼]

Motivo
[Registro fuera de posición ▼]

Comentario
[________________________]

Scrap OP antes       3.5%
Scrap después        4.2%
Límite               5.0%

[ REGISTRAR ]
```

Al confirmar:

- incrementar scrap de la OP;
- incrementar scrap de la operación/routing;
- guardar timestamp/operador/máquina;
- agregar evento de trazabilidad;
- alimentar Dashboard/Analítica/Scrap y pérdidas;
- actualizar porcentaje automáticamente.

## 12.2 Alerta por límite

Si cruza 5%:

```text
🔴 SCRAP FUERA DE ESTÁNDAR
5.4%

Requiere atención de supervisor.

[SOLICITAR REVISIÓN]
```

Agregar sugerencia morada contextual:

```text
✦ SUGERENCIA DEL SISTEMA
El scrap aumentó 1.9 pts después del último ajuste.
Principal causa registrada: Registro fuera de posición.
Se recomienda revisar setup antes de continuar.

[Ver historial] [Solicitar QA]
```

---

# 13. Scrap acumulado por routing

Para Offset es especialmente importante mostrar cómo se acumula entre procesos.

Ejemplo:

```text
SCRAP ACUMULADO · OP-95344

Impresión        1.8%
Guillotina       +0.3%
Doblado          +0.7%
Grapado          +0.6%
──────────────────────
TOTAL            3.4%
LÍMITE           5.0%
```

Cada operación debe recibir la cantidad buena de la etapa anterior.

Ejemplo:

```text
Impresión
Entrada 10,800
Buenas 10,550
Scrap 250
    ↓
Guillotina
Entrada 10,550
Buenas 10,480
Scrap 70
    ↓
Doblado
...
```

---

# 14. Material adicional

Acción:

`Material extra`

Modal:

```text
Material originalmente entregado
12,000 ft

Solicitado adicional
1,000 ft

Motivo
○ Merma
○ Faltante de almacén
○ Cambio autorizado
○ Otro

Causa 4M
[Material ▼]

[ SOLICITAR ]
```

Reglas demo:

### Si es Merma / Defecto

- actualizar material entregado;
- registrar scrap si corresponde;
- crear trazabilidad;
- alertar supervisor.

### Si es Faltante de almacén

- actualizar material entregado;
- generar incidencia de surtido;
- NO incrementar scrap.

### Si es Cambio autorizado

- vincular desviación si aplica.

---

# 15. Registrar producción buena

Acción `+ Producción`.

Modal pequeño:

```text
REGISTRAR PRODUCCIÓN

Cantidad buena
[5,000]

Rollo / lote / paquete
[opcional demo]

Comentario
[________________]

[REGISTRAR]
```

Actualizar:

- buenas;
- avance;
- velocidad real si hay tiempo transcurrido;
- output del turno;
- timeline.

---

# 16. Cerrar operación

Al terminar:

```text
CERRAR OPERACIÓN

Entrada              52,000
Buenas               49,100
Scrap                 1,900

Scrap operación       3.7%
Scrap acumulado OP    4.1%
Límite                5.0% ✓

Setup real            48 min
Setup estándar        45 min

Corrida real          05h 42m
Corrida estándar      05h 18m

Paros                 00h 17m

[ CONFIRMAR CIERRE ]
```

No permitir cerrar si faltan campos mínimos de producción/scrap.

Al confirmar:

- cerrar routing step actual;
- registrar good/scrap/start/end;
- poner siguiente routing step como lista;
- generar trazabilidad.

---

# 17. Remanentes Flexo

Al cerrar una operación Flexo preguntar:

```text
¿Quedó material reutilizable?
[Sí] [No]

Longitud restante
[2,450 ft]

[GENERAR REMANENTE]
```

Si se genera:

- crear remanente demo;
- guardar sustrato;
- ancho;
- lote;
- cantidad/longitud;
- origen OP;
- ubicación;
- trazabilidad.

Debe aparecer después como opción `Usar remanente primero` en futuras OP.

---

# 18. Transferencia a siguiente operación

El WIP no debe desaparecer al cerrar una etapa.

Ejemplo Flexo:

```text
✓ PRENSA FLEXO COMPLETADA
49,100 buenas
1,900 scrap

Siguiente operación:
ROTOFLEX I · Rebobinado / Inspección

[ ENVIAR A SIGUIENTE ETAPA ]
```

Ejemplo Offset:

```text
✓ IMPRESIÓN COMPLETADA
10,550 pliegos buenos

Siguiente:
GUILLOTINA 2

[ ENVIAR A GUILLOTINA ]
```

El routing visual cambia:

```text
PRENSA        ✓
REBOBINADO    ● Lista
EMPAQUE       ○ Pendiente
QA FINAL      ○ Pendiente
```

---

# 19. Calidad final

Cuando la última operación productiva termina:

```text
PRODUCCIÓN TERMINADA

Pendiente:
AUDITORÍA FINAL QA

⏳ Esperando liberación
```

El operador/supervisor puede ver auditoría, pero no aprobarla desde Producción.

Cuando Calidad aprueba:

```text
✓ PRODUCTO LIBERADO
49,100 piezas buenas
Lote PT-260907-042

Liberado por Alicia Ramírez
14:38
```

Después queda disponible para PT / embarques.

---

# 20. Historial del operador

Debe sentirse como digitalización del Reporte Diario RTM.

```text
MI HISTORIAL · HOY

07:00  100 · Inicio de turno
07:14  Inicio setup · OP-95321
07:46  200 · Problema mecánico
08:03  Producción reanudada
08:12  Primera pieza solicitada
08:18  QA liberada
08:19  Inicio producción
09:24  Scrap · 350 etiquetas
10:11  Material adicional · 1,000 ft
13:58  Operación terminada
14:06  OP enviada a Rotoflex
```

Conservar también tabla de reportes diarios ya existente, pero `Historial` debe ser la experiencia natural del operador.

---

# 21. Mi Desempeño

Vista simple, no RH.

```text
MI DESEMPEÑO · TURNO ACTUAL

Tiempo productivo        6h 03m    84%
Tiempo perdido           42m
Operaciones terminadas   3
Producción buena         67,840
Scrap                    2.8%      Objetivo ≤5% ✓

SETUP
Estándar promedio        42 min
Real                     46 min
Variación                +9.5%

VELOCIDAD
Estándar                 9,000 ft/h
Real                     8,240 ft/h
Cumplimiento             91.6%
```

Agregar sugerencia:

```text
✦ SUGERENCIA DEL SISTEMA
Tus últimas dos corridas tuvieron +8 min de setup,
principalmente en montaje de troquel.

[Ver detalle]
```

No usar lenguaje punitivo contra el operador.

---

# 22. Supervisor — nueva tab `Scrap y pérdidas`

Agregar en Producción administrativa:

```text
Dashboard
Planeación
Órdenes
Procesos
Máquinas
Scrap y pérdidas
Analítica
```

Vista:

```text
SCRAP Y PÉRDIDAS · HOY

Scrap global         3.4%
Objetivo             ≤5.0%
Unidades scrap       6,142
OP fuera límite      2
Material extra       3 solicitudes
```

## 22.1 Scrap por proceso

```text
Flexo impresión      4.2%
Offset impresión     3.1%
Doblado              2.2%
Grapado              1.6%
Rebobinado           1.3%
```

## 22.2 Scrap por causa

```text
Registro             32%
Ajuste               24%
Material             18%
Operador              14%
Otros                 12%
```

## 22.3 OP con mayor merma

```text
OP       Cliente      Proceso       Buenas      Scrap      %
95321    Fresenius    Flexo          49,100      2,900      5.58 🔴
95344    B&D          Offset         22,800        920      3.88
```

Click abre detalle de scrap de la OP.

---

# 23. Analítica — elevarla al nivel de Inventario

La actual no debe seguir siendo cuatro tarjetas enormes.

Estructura recomendada:

```text
ANALÍTICA DE PRODUCCIÓN

[Periodo] [Área] [Máquina] [Turno]

Cumplimiento | Eficiencia | Scrap | Setup vs std | OP a tiempo

PLAN VS REAL                 ✦ SUGERENCIAS DEL SISTEMA

EFICIENCIA POR MÁQUINA       SETUP ESTÁNDAR VS REAL

SCRAP / TENDENCIA            PARETO 4M

ENTREGA / LEAD TIME
```

Debe permitir análisis por:

- área;
- máquina;
- turno;
- proceso;
- OP;
- periodo.

No usar porcentajes hardcodeados si ya pueden derivarse.

---

# 24. Consistencia visual con Inventario

Producción debe usar el mismo lenguaje premium del resto del ERP:

- cards `rounded-3xl` donde corresponda;
- densidad útil;
- CTA claros;
- `StatusBadge` compartido cuando sea viable;
- morado para `smart/recommendation`;
- azul RTM como acción primaria;
- verde/ámbar/rojo solo como semántica de estado;
- tablas compactas;
- drawers/modal para detalle;
- sin gradientes innecesarios;
- sin cards gigantes vacías.

Inventario es referencia visual de densidad y recomendaciones, NO copiar conceptos ajenos a Producción.

---

# 25. Estado compartido obligatorio

`Piso de Producción` y `Producción` deben compartir los mismos datos.

Una acción en Piso debe reflejarse inmediatamente en:

```text
Dashboard
Planeación
Órdenes
Scrap y pérdidas
Analítica
Calidad / gates cuando aplique
```

No inicializar otro `PRODUCTION_ORDERS` independiente dentro del módulo de operador.

El estado debe vivir en un nivel común (`DashboardShell`, contexto o solución equivalente coherente con repo).

---

# 26. Mocks adicionales sugeridos

Sin backend, crear estructuras coherentes para:

```text
ProductionExecutionEvent
ProductionScrapEvent
ProductionShift
OperatorPerformanceSnapshot
ProductionSuggestion
WipTransfer
```

Ejemplo conceptual:

```ts
ProductionScrapEvent {
  id
  opId
  routingStep
  machine
  operator
  timestamp
  quantity
  unit
  type
  category4M
  reason
  comment
}
```

No sobrearquitecturar.

---

# 27. Criterios de éxito

El flujo demo debe permitir sin refresh:

```text
1. Entrar a Piso de Producción.
2. Identificar operador.
3. Ver cola priorizada de máquina.
4. Abrir primera OP.
5. Validar materiales/herramental.
6. Iniciar setup.
7. Registrar paro.
8. Reanudar.
9. Terminar setup.
10. Solicitar primera pieza a Calidad.
11. Ver estado QA.
12. Iniciar corrida.
13. Registrar producción buena.
14. Registrar scrap con causa.
15. Ver aumentar scrap acumulado.
16. Solicitar material extra.
17. Terminar operación.
18. Generar remanente si Flexo.
19. Mandar WIP a siguiente operación.
20. Ver historial del turno.
21. Ver desempeño del operador.
22. Entrar como supervisor a Scrap y pérdidas y encontrar esos eventos.
```

---

# 28. Prioridad de implementación

## P0

- NavItem `Piso de Producción` separado.
- Estado compartido con Producción.
- Terminal/máquina + operador.
- Mi Cola.
- Preparar OP.
- Setup con timer.
- Paro/reanudar.
- Solicitud QA primera pieza.
- Producción activa.
- Registrar buenas.
- Registrar scrap.
- Scrap acumulado y límite 5%.
- Material extra.
- Cierre de operación.
- Transferencia a siguiente routing step.
- Historial.
- Tab supervisor `Scrap y pérdidas`.
- Sugerencias moradas contextuales.

## P1

- Mi Desempeño.
- Remanente al cerrar Flexo.
- Drilldown de scrap por etapa.
- Mejorar Analítica.
- Comparación estándar vs real completa.

## P2

- Mejor polish de animaciones.
- Snapshots por turno/periodo.
- Más sugerencias determinísticas.

---

# 29. Restricciones

- trabajar solo en `alvaro01`;
- no crear ramas;
- frontend/demo solamente;
- sin backend;
- sin APIs;
- sin migraciones;
- no duplicar Calidad;
- no permitir que Producción apruebe QA;
- no crear inventario paralelo;
- reutilizar componentes y estilos actuales;
- correr build/typecheck al terminar.

---

# 30. Narrativa final de demo

```text
SUPERVISOR
Configura receta
→ planea
→ sistema sugiere
→ manda OP a piso

OPERADOR
Se identifica
→ recibe cola priorizada
→ prepara
→ inicia setup
→ reporta tiempos/paros
→ solicita QA
→ produce
→ captura buenas
→ captura scrap
→ pide material adicional
→ termina operación
→ manda WIP a siguiente etapa

CALIDAD
Audita / libera

SUPERVISOR
Ve inmediatamente:
plan vs real
scrap
pérdidas 4M
estándar vs real
riesgo de entrega
performance
sugerencias
```

El objetivo es que Producción deje de sentirse como un conjunto de pantallas administrativas y se sienta como un sistema que realmente opera la planta.