# RTM Demo — Producción v11 · Catálogo de Máquinas y Capacidades

> Branch objetivo: `alvaro01`
>
> Alcance: mejorar únicamente la experiencia de **Producción > Máquinas**. No rehacer Producción, Planeación, Piso, Calidad ni Mantenimiento.

## 0. Objetivo

La pestaña actual `Máquinas` es demasiado pobre para el nivel que ya alcanzó el resto del demo. Hoy muestra básicamente nombre, área, carga, estado y un texto genérico de setup.

La nueva experiencia debe demostrar que el ERP entiende **qué puede hacer físicamente cada máquina, qué trabajos acepta, a qué velocidad trabaja, cuánto tarda en prepararse y qué alternativa puede usarse si está saturada o detenida**.

La historia que debe contar en demo es:

```text
Catálogo de máquina
→ capacidades técnicas
→ estándares de setup / velocidad
→ operaciones compatibles
→ artículos / recetas compatibles
→ carga semanal actual
→ alternativa sugerida
→ impacto directo en Planeación y Nueva OP
```

No queremos una lista decorativa. Queremos un **catálogo industrial accionable**.

---

# 1. Base funcional confirmada en exploración RTM

Durante las sesiones con Mariana e Iván se habló de que la planeación depende de conocer:

- qué máquinas existen;
- qué capacidades tiene cada una;
- qué formatos / materiales puede aceptar;
- cuántas tintas / colores maneja;
- qué operaciones puede hacer;
- velocidad o rendimiento estándar;
- tiempo de setup / ajuste;
- tiempos auxiliares;
- carga actual y capacidad disponible;
- máquina alternativa compatible;
- diferencias entre Offset y Flexografía.

En Flexografía, el setup debe reflejar que montar únicamente impresión no toma lo mismo que montar impresión + troquel + barniz + laminado + corona / precorte.

En Offset, la capacidad de la máquina también afecta la paginación, por ejemplo prensas con límite de 16 o 32 páginas por forma.

No presentar como dato oficial RTM ningún valor que no esté confirmado en los mocks/documentos actuales. Cuando un valor sea ilustrativo, etiquetar claramente:

`Demo configurable`

---

# 2. Problema actual

Archivo actual:

```text
src/components/Produccion/MaquinasCapacidad.tsx
```

La vista actual no aprovecha la información que ya existe en `PRODUCTION_MACHINES` ni la lógica de recetas / routing.

Problemas actuales:

1. No hay buscador ni filtros útiles.
2. No se ven capacidades técnicas.
3. No se ve velocidad / rendimiento estándar.
4. No se ve setup base.
5. No se ve eficiencia objetivo.
6. No se ve capacidad semanal en horas.
7. No se ven operaciones compatibles.
8. No se ven recetas/artículos relacionados.
9. No se ve máquina alternativa.
10. No hay recomendaciones del sistema.
11. No existe un detalle de máquina digno del resto del ERP.

---

# 3. Nueva estructura visual

Mantener la tab principal `Máquinas`, pero convertirla en un workspace completo.

```text
MÁQUINAS Y CAPACIDAD

[ Buscar máquina... ] [ Todas las áreas ▼ ] [ Operativas ▼ ]

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Máquinas │ Operativas│ Atención │ Saturadas│ Horas disp.│
│    17    │    15     │    2     │    2     │  86.4 h   │
└──────────┴──────────┴──────────┴──────────┴──────────┘

✦ SUGERENCIAS DEL SISTEMA
...

CATÁLOGO
[Cards / tabla rica]
```

Usar el mismo nivel visual de Inventario:

- cards compactas;
- bordes sutiles;
- radios consistentes;
- estados con verde/ámbar/rojo;
- morado exclusivamente para `Sugerencias del sistema`;
- densidad de información alta pero limpia;
- evitar cards gigantes vacías;
- no gradients innecesarios.

---

# 4. KPIs superiores

Agregar una fila compacta de KPIs derivados de catálogo/carga actual.

```text
TOTAL MÁQUINAS          17
OPERATIVAS              15
REQUIEREN ATENCIÓN       2
SATURADAS >90%           2
HORAS DISPONIBLES       86.4 h
```

Si el dato de horas se deriva de una capacidad estándar demo de 40h/semana, mostrar en tooltip/nota:

`Capacidad semanal demo configurable`

---

# 5. Sugerencias del sistema

Agregar bloque morado con `Sparkles`, consistente con Inventario y Analítica.

Ejemplos demo:

```text
✦ SUGERENCIA DEL SISTEMA
Mark Andy 830 10” está al 96% de carga.
Mark Andy Scout 10” es compatible con 3 de sus próximas 4 OP y tiene capacidad disponible.
[Ver compatibilidad] [Ir a Planeación]
```

```text
✦ SUGERENCIA DEL SISTEMA
Stahl 2 lleva 3 turnos debajo de su velocidad estándar.
Revisar condición de máquina / setup antes de aumentar carga.
[Ver desempeño]
```

```text
✦ SUGERENCIA DEL SISTEMA
La OP de 24 páginas puede ejecutarse en DiDDE 860 con paginación 16 + 8.
[Ver receta]
```

No usar frases tipo “IA”. Wording oficial:

`Sugerencia del sistema`

---

# 6. Vista de catálogo

Preferir cards compactas en grid para primera vista y detalle en drawer/modal amplio.

Cada máquina debe mostrar:

```text
┌──────────────────────────────────────────────┐
│ MARK ANDY SCOUT 10”              ● Operativa│
│ Flexografía                                 │
│                                              │
│ Carga semanal       84%                     │
│ █████████████████░░                         │
│                                              │
│ Máx. tintas          6                      │
│ Banda útil           10”                    │
│ Velocidad estándar   6,000 ft/h             │
│ Setup base           30 min                 │
│                                              │
│ ✓ Impresión                                  │
│ ✓ Troquel                                    │
│ ✓ Barniz                                     │
│ ✓ Laminado                                   │
│ ✓ Corona                                     │
│ ✓ Precorte                                   │
│                                              │
│ Próxima OP          OP-2026-95249            │
│                                              │
│                     [Ver ficha completa →]   │
└──────────────────────────────────────────────┘
```

Para Offset:

```text
┌──────────────────────────────────────────────┐
│ DIDDE 860                         ● Operativa│
│ Offset                                       │
│                                              │
│ Carga semanal       58%                     │
│ Máx. tintas          4                      │
│ Capacidad forma      16 páginas             │
│ Rendimiento std.     8,500 / h              │
│ Setup base           20 min                 │
│                                              │
│ Paginación ligada a capacidad:               │
│ 24 páginas → 16 + 8                          │
│                                              │
│                     [Ver ficha completa →]   │
└──────────────────────────────────────────────┘
```

Los valores anteriores deben salir de datos actuales/documentados. Si algún valor no existe de forma segura en el modelo, agregarlo como mock explícitamente marcado `Demo configurable`.

---

# 7. Ficha completa de máquina

Al abrir una máquina, usar drawer ancho o modal grande. No navegar a una pantalla vacía.

Header:

```text
MARK ANDY SCOUT 10”
FLX-03 · Flexografía
● OPERATIVA

Carga semana 84% · Próxima OP 95249

[General] [Capacidades] [Estándares] [Compatibilidad] [Desempeño]
```

## 7.1 General

Mostrar:

- código interno;
- nombre;
- área;
- estado;
- próxima OP;
- carga actual;
- horas planeadas;
- horas disponibles;
- eficiencia demo;
- última incidencia;
- próxima ventana de mantenimiento, únicamente como referencia/navegación.

No duplicar el módulo Mantenimiento.

CTA:

`Ver en Mantenimiento`

si existe navegación limpia; de lo contrario toast demo.

## 7.2 Capacidades

Flexo:

```text
CAPACIDADES TÉCNICAS

Banda / ancho máximo      10”
Tintas máximas             6

OPERACIONES INLINE
✓ Impresión
✓ Troquelado
✓ Barniz
✓ Laminado
✓ Tratamiento corona
✓ Precorte
○ Rebobinado offline
```

Offset:

```text
CAPACIDADES TÉCNICAS

Tintas máximas             4
Máximo páginas / forma    16
Tipo                       Offset

PAGINACIÓN
8   ✓
12  ✓
16  ✓
32  ✕
```

Acabados:

mostrar especialidad:

- Guillotina → corte;
- Stahl → doblado;
- Muller Martini → grapado / alzado;
- Rotoflex → rebobinado / inspección.

No inventar capacidades que no estén soportadas por los datos actuales.

---

# 8. Estándares

Esta tab debe vender la idea de que Planeación no usa tiempos mágicos.

Mostrar:

```text
ESTÁNDARES OPERATIVOS

Setup base               30 min
Velocidad estándar       6,000 ft/h
Unidad                    ft/h
Eficiencia objetivo      75%          Demo configurable
Capacidad semana         40 h         Demo configurable
```

## Flexo — Setup compuesto

Muy importante.

Mostrar cómo se construye el setup:

```text
SETUP COMPUESTO · EJEMPLO DE CORRIDA

Preparación base                 20 min
Montaje impresión                +10 min
Montaje troquel                  +15 min
Barniz UV                        +10 min
Laminado                         +15 min
Corona                            +5 min
────────────────────────────────────────
Setup estimado total             75 min
```

Los componentes de tiempo que no estén confirmados deben llevar badge:

`Demo configurable`

La interacción puede permitir activar/desactivar operaciones y recalcular el setup visualmente.

No tiene que guardar a backend.

Esto debe verse muy bien en demo.

---

# 9. Compatibilidad

Mostrar dos bloques:

## 9.1 Recetas / artículos compatibles

Ejemplo:

```text
RECETAS COMPATIBLES

✓ Etiqueta impresa / barniz / troquel
  FRESENIUS · 70-1525
  3 tintas · 10” · suaje rotativo

✓ Etiqueta laminada
  TYCO · 104-882
  4 tintas · laminado

⚠ Etiqueta 8 colores
  No compatible por número de tintas
```

Usar `MASTER_RECIPES` y las specs existentes.

No crear otro catálogo paralelo.

## 9.2 Máquinas alternativas

Mostrar:

```text
ALTERNATIVAS COMPATIBLES

Mark Andy Scout 10”
Compatibilidad      100%
Carga                84%
Disponible           6.4 h

Mark Andy 4120 17”
Compatibilidad       92%
Carga                62%
Disponible          15.2 h
```

Explicar por qué una alternativa NO sirve:

```text
Mark Andy 830 10”
✕ No compatible
Motivo: requiere 6 tintas y esta estación admite 3.
```

Ese motivo visible es más importante que un simple porcentaje.

---

# 10. Desempeño

No convertir esto en Analítica completa; sólo contexto de la máquina.

Mostrar:

```text
DESEMPEÑO · ÚLTIMOS TURNOS

Eficiencia             91.6%
Setup real promedio     34 min
Setup estándar          30 min
Variación               +13.3%
Tiempo perdido           47 min
Scrap asociado           3.8%
```

Mini tendencia / barras simples.

CTA:

`Abrir Analítica de esta máquina`

Debe navegar a Analítica con filtro si es sencillo; si no, usar estado local/toast demo.

---

# 11. Relación con Planeación

Desde la ficha debe ser evidente que estos datos alimentan Planeación.

Agregar bloque pequeño:

```text
IMPACTO EN PLANEACIÓN

Capacidad semanal       40 h
Comprometidas           33.6 h
Disponibles              6.4 h

Próximas OP              4
Riesgo de saturación     Medio

[Ver Planeación]
```

No duplicar el Gantt.

---

# 12. Relación con Nueva OP / receta

Cuando una receta usa esta máquina, debe existir trazabilidad visual:

```text
RECETA MAESTRA
→ exige: 4 tintas + barniz + troquel
→ máquina A cumple
→ máquina B no cumple
→ sistema sugiere máquina A
```

No es necesario cambiar el wizard si ya funciona; sólo asegurar que el catálogo muestra la misma lógica y datos.

---

# 13. Modelo de datos

Reutilizar `ProductionMachine` actual y enriquecerlo razonablemente si hace falta.

Campos útiles opcionales:

```ts
code?: string
standardSpeed?: number
speedUnit?: 'pliegos/h' | 'ft/h' | 'pzas/h' | 'rollos/h'
baseSetupMinutes?: number
efficiencyTargetPct?: number
weeklyCapacityHours?: number
specialty?: string
```

NO crear un segundo catálogo duplicado.

Seguir usando:

- `PRODUCTION_MACHINES`
- `MASTER_RECIPES`
- `RoutingStep`
- datos de Planeación actuales

Derivar compatibilidad de specs/capacidades cuando sea posible.

---

# 14. Datos RTM vs datos Demo

Regla obligatoria:

- Si el dato ya existe/documentado en mocks/archivos RTM → usarlo.
- Si hace falta para completar visualmente el demo pero no está confirmado → usar valor razonable y badge `Demo configurable`.
- No presentar un supuesto como especificación oficial de RTM.

---

# 15. Diseño visual

Debe verse al mismo nivel o mejor que Inventario.

Requisitos:

- header claro;
- KPIs compactos;
- filtros;
- catálogo con densidad útil;
- drawer/modal amplio con tabs;
- estados claros;
- `Sparkles` morado para sugerencias;
- badges de capacidades;
- barras de carga discretas;
- tipografía actual del ERP;
- sin gradients innecesarios;
- sin glassmorphism;
- sin widgets enormes vacíos;
- sin colores arbitrarios fuera del design system;
- responsive desktop primero, sin romper móvil.

No hacer una tabla aburrida de Excel.

No hacer una cuadrícula de cards gigantes.

Buscar equilibrio entre catálogo industrial + visual ejecutivo.

---

# 16. Demo story obligatoria

La pantalla debe permitir contar en 60 segundos:

```text
1. Abro Máquinas.
2. Veo que Mark Andy 830 está casi saturada.
3. Abro su ficha.
4. Enseño tintas/ancho/operaciones permitidas.
5. Enseño setup y velocidad estándar.
6. Enseño qué recetas puede fabricar.
7. Enseño por qué otra receta NO cabe.
8. El sistema propone Scout como alternativa.
9. Abro Planeación y muestro la capacidad disponible.
10. Cambio a DiDDE y enseño que su límite de 16 páginas afecta la paginación Offset.
```

Ese es el objetivo de negocio de esta mejora.

---

# 17. P0

Implementar obligatoriamente:

1. Rediseño completo de `Máquinas`.
2. Filtros y KPIs superiores.
3. Cards/tabla rica con capacidades visibles.
4. Ficha completa en drawer/modal.
5. Tabs General / Capacidades / Estándares / Compatibilidad / Desempeño.
6. Velocidad + setup + capacidad semanal.
7. Flexo inline capabilities.
8. Offset `maxFormPages` visible.
9. Recetas compatibles e incompatibles con motivo.
10. Máquinas alternativas con motivo de compatibilidad.
11. Sugerencias del sistema moradas.
12. CTA a Planeación / Analítica donde tenga sentido.

---

# 18. P1

Si no compromete estabilidad:

- setup compuesto interactivo Flexo;
- filtro por estado/capacidad;
- pequeño ranking de máquinas críticas;
- deep-link con filtro hacia Analítica;
- tooltip de origen de estándar `RTM` / `Demo configurable`.

---

# 19. Restricciones

- SOLO branch `alvaro01`.
- No crear ramas.
- Frontend/demo solamente.
- Sin backend.
- Sin APIs.
- Sin migraciones.
- No rehacer Producción completa.
- No duplicar Mantenimiento.
- No duplicar Analítica.
- Reutilizar design system y mocks actuales.
- Mantener comportamiento existente de Nueva OP, Planeación, Piso y Calidad.
- Correr build/typecheck al terminar.

---

# 20. Criterio de aceptación

La mejora está lista cuando alguien de RTM pueda responder visualmente desde `Máquinas`:

```text
¿Qué puede hacer esta máquina?
¿Qué no puede hacer?
¿Cuánto tarda en prepararse?
¿A qué velocidad debería trabajar?
¿Cuánta capacidad le queda?
¿Qué recetas puede producir?
¿Por qué esta OP sí/no cabe aquí?
¿Qué otra máquina puedo usar?
¿Cómo afecta esto a Planeación?
```

Si la pantalla no responde eso sin abrir código ni mocks, todavía no está terminada.
