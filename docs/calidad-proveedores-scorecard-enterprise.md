# RTM Demo — Calidad de Proveedores & Scorecard Enterprise

## Objetivo

Construir una experiencia de **Calidad de Proveedores** que conecte el maestro actual de Proveedores con Compras, Recepción/Incoming QA y Calidad, sin crear otro módulo aislado ni duplicar información.

La historia del demo debe ser simple y potente:

> "RTM no sólo sabe cuánto compra y a qué precio: también sabe qué proveedor entrega a tiempo, qué lotes llegan conformes, quién reincide, cuánto material se rechaza y cuándo conviene escalar una acción correctiva."

La experiencia debe sentirse tan cuidada como Inventario, Requisiciones, CRM nuevo y Calidad/Piso QA.

---

# 1. Arquitectura UX

NO agregar otra entrada al Sidebar.

La entrada principal debe vivir en:

`Compras > Proveedores`

Extender la navegación actual:

```text
PROVEEDORES
[ Resumen ] [ Proveedores ] [ Calidad & Evaluación ]
```

Y dentro del detalle de cada proveedor agregar una tab:

```text
Resumen | Contactos | Direcciones | Artículos | Listas de precios |
Condiciones | Documentos | Calidad | Historial
```

También debe existir navegación contextual desde:

`Calidad > Auditorías > Incoming / Materia Prima`

hacia:

`Proveedor > Calidad`

La vista de Calidad no debe administrar condiciones comerciales. La vista de Proveedores no debe duplicar la inspección Incoming. Cada módulo conserva su responsabilidad y comparte datos.

---

# 2. Estado actual a preservar

Ya existe:

- maestro `SupplierMaster`;
- contactos;
- direcciones;
- artículos relacionados;
- lead time;
- listas de precios;
- documentos / certificados;
- timeline del proveedor;
- dashboard de Proveedores;
- órdenes de compra;
- recepción física en almacén;
- `IncomingInspection` en Calidad;
- resultado Liberado / HOLD-Rechazado;
- lote proveedor;
- lote RTM;
- COA;
- inspección visual y especificación;
- medición de espesor;
- auditor / fecha / notas.

NO recrear estos datos en otra colección paralela.

## Integración técnica recomendada

Actualmente `IncomingInspection` vive como estado local dentro de `AuditoriasWorkspace`.

Para que el scorecard responda a inspecciones realizadas durante la sesión, elevar el estado de Incoming a un nivel compartido:

- preferentemente `DashboardShell` o un contexto pequeño de Calidad de Proveedores;
- inicializar con `INCOMING_INSPECTIONS`;
- pasar el mismo estado tanto a Calidad como a Proveedores.

No mantener una copia en Calidad y otra en Proveedores.

---

# 3. Nueva vista `Calidad & Evaluación`

Debe abrir como dashboard premium.

## Header

```text
CALIDAD DE PROVEEDORES · RTM

Desempeño, inspección de recibo y riesgo de suministro

Periodo: [ 30 días ▾ ]
Categoría: [ Todas ▾ ]
Proveedor: [ Todos ▾ ]

[ Exportar evaluación ]
```

Periodos:

- 30 días
- 60 días
- 90 días
- 6 meses
- 12 meses

Para el demo, 90 días puede ser default si mejora la densidad de información.

---

# 4. KPIs ejecutivos

Máximo 6 cards, limpias y comparables.

```text
Proveedores evaluados       8
Lotes inspeccionados       37
Aceptación Incoming       94.6%
Lotes rechazados             2
Entregas a tiempo         91.8%
Acciones abiertas             3
```

Agregar comparación vs periodo anterior cuando sea posible:

`↑ 2.4 pts vs periodo anterior`

No inventar cambios sin dataset; si son demo, derivarlos de datos mock diseñados específicamente para periodos.

---

# 5. Scorecard principal

La sección más importante debe ser un ranking de proveedores.

Columnas:

- Proveedor
- Categoría
- Calidad
- Entrega
- Documentación
- Respuesta
- Score total
- Tendencia
- Estado
- Acción

Ejemplo:

```text
Proveedor             Calidad  Entrega  Docs  Respuesta  Score   Estado
Bio-Pappel              97%      94%     100%    92%      96      Aprobado
Sun Chemical            92%      96%      98%    95%      94      Aprobado
Copamex                 89%      88%     100%    90%      91      Monitoreo
Proveedor Demo BOPP     74%      86%      80%    70%      77      Condicionado
```

## Score

No fingir una fórmula certificada de RTM.

Mostrar claramente:

`Score demo configurable`

Usar una fórmula razonable sólo para el demo, por ejemplo:

- Calidad: 40%
- Entrega: 25%
- Documentación: 15%
- Respuesta / acciones: 20%

La UI debe permitir abrir `¿Cómo se calcula?` y explicar los pesos.

Estados demo:

- Aprobado
- Monitoreo
- Condicionado
- Bloqueado

No bloquear compras reales en el demo salvo que se indique explícitamente como simulación.

---

# 6. Sugerencias del sistema — morado

Agregar una sección prominente, pero elegante:

```text
✦ SUGERENCIAS DEL SISTEMA
```

Ejemplos:

### A. Reincidencia de calidad

```text
Proveedor Demo BOPP
2 lotes rechazados en 60 días por espesor fuera de tolerancia.

Recomendación:
abrir acción correctiva de proveedor y aumentar frecuencia de inspección Incoming.

[ Abrir acción ] [ Ver lotes ]
```

### B. Documentación

```text
Sun Chemical
Certificado de calidad próximo a vencer.

[ Ver documento ]
```

### C. Riesgo de entrega

```text
Copamex
3 entregas tardías en las últimas 8 recepciones.
La próxima OC abastece una OP prioritaria.

[ Ver OCs ] [ Revisar proveedor ]
```

### D. Proveedor sobresaliente

```text
Bio-Pappel
12 lotes consecutivos conformes y 94% de entregas a tiempo.

Sugerencia:
considerar reducir intensidad de inspección para materiales de bajo riesgo.

[ Ver desempeño ]
```

Importante: estas son **Sugerencias del sistema**, no IA predictiva.

---

# 7. Analítica visual

No saturar la pantalla. Incluir máximo 4 visuales fuertes.

## 7.1 Pareto de rechazo por proveedor

Top proveedores por:

- lotes rechazados;
- cantidad afectada;
- incidencias Incoming.

## 7.2 Motivos de rechazo

Ejemplos:

- Espesor fuera de tolerancia
- Apariencia superficial
- COA faltante
- Dimensión / calibre
- Color / especificación
- Daño de transporte

## 7.3 Tendencia de aceptación

Línea por mes/semana:

`% lotes conformes`

## 7.4 Calidad vs Entrega

Scatter / matriz visual:

- eje X = entrega a tiempo
- eje Y = aceptación de calidad

Sirve para distinguir:

- excelente proveedor;
- bueno en calidad pero malo en entrega;
- puntual pero con defectos;
- proveedor crítico.

---

# 8. Detalle del proveedor — nueva tab `Calidad`

El modal actual de proveedor debe ganar una tab `Calidad`.

## Header de Calidad

```text
SUN CHEMICAL MÉXICO
PROV-RTM-001

Score 94 / 100
Aprobado

Calidad        92%
Entrega        96%
Documentos     98%
Respuesta      95%
```

## Sub-secciones

### 8.1 Incoming & lotes

Tabla:

- Fecha
- OC
- Material
- Lote proveedor
- Lote RTM
- Cantidad recibida
- COA
- Resultado
- Auditor

Click abre el expediente de Incoming existente, no un fake nuevo.

### 8.2 No conformidades de proveedor

Mostrar:

- folio
- material/lote
- defecto
- severidad
- cantidad
- contención
- estado
- responsable

### 8.3 Acciones correctivas

Flujo demo:

`Detectada → Enviada al proveedor → Respuesta recibida → Verificación → Cerrada`

Cada acción:

- folio SCAR/CAR demo;
- origen;
- responsable RTM;
- contacto proveedor;
- causa raíz;
- acción propuesta;
- evidencia;
- fecha compromiso;
- estado.

No afirmar que RTM usa formalmente el término SCAR si no está confirmado. En la UI puede llamarse `Acción correctiva de proveedor`.

### 8.4 Documentación de Calidad

Reutilizar `SupplierDocument`.

Mostrar especialmente:

- Certificado de calidad
- Ficha técnica
- Certificación
- COA de lotes recientes

No crear un repositorio documental separado.

### 8.5 Historial de desempeño

Timeline con:

- lote liberado;
- lote rechazado;
- acción correctiva abierta;
- respuesta del proveedor;
- documento actualizado;
- cambio de status de evaluación.

---

# 9. Flujo Incoming → Scorecard

Debe existir una historia funcional de demo:

1. llega `OC-2026-0082`;
2. Calidad hace Incoming;
3. registra resultado;
4. si `Liberado`, actualiza historial del proveedor;
5. si `HOLD / Rechazado`, incrementa defectos/rechazos;
6. scorecard recalcula;
7. si existe reincidencia, aparece sugerencia morada;
8. usuario puede abrir acción correctiva;
9. acción queda vinculada al proveedor y al lote.

No exigir refresh.

---

# 10. Integración con Compras

Desde el proveedor mostrar:

- OCs abiertas;
- entregas próximas;
- órdenes con incidencia;
- material comprado;
- gasto demo si ya está disponible.

Desde una sugerencia de riesgo:

`[ Ver órdenes abiertas ]`

Debe navegar al módulo actual de Compras si existe soporte de navegación dirigida. Si no existe, implementar navegación simple sin duplicar la tabla de OCs.

---

# 11. Integración con Calidad

Desde `Auditorías > Incoming`:

Agregar CTA contextual:

`Ver desempeño del proveedor`

Debe abrir:

`Proveedores > Calidad > [proveedor]`

Desde proveedor:

`Ver inspección Incoming`

Debe regresar al expediente específico de Calidad cuando sea posible.

---

# 12. Casos demo que deben existir

Crear mocks coherentes, sin afirmar relaciones reales de RTM con proveedores sugeridos.

## Caso 1 — Proveedor sobresaliente

**Bio-Pappel (Demo)**

- varios lotes conformes;
- documentación vigente;
- entrega alta;
- score ~95+.

## Caso 2 — Buen proveedor con alerta documental

**Sun Chemical México (Demo)**

- calidad buena;
- documento por vencer;
- sugerencia de renovación.

## Caso 3 — Proveedor en observación

**Copamex (Demo)**

- calidad aceptable;
- dos entregas tardías;
- score ~88–92.

## Caso 4 — Proveedor condicionado

Crear proveedor claramente marcado `Proveedor Demo BOPP` o usar uno ya existente si el repo lo tiene como demo.

- 2 rechazos de espesor;
- un lote en HOLD;
- acción correctiva abierta;
- score ~75–80.

No usar un proveedor real para hacerlo ver intencionalmente malo si la relación no está confirmada.

---

# 13. Nueva acción correctiva de proveedor

Modal/wizard pequeño pero pro.

## Paso 1 — Origen

- proveedor
- lote
- OC
- Incoming / MNC origen

## Paso 2 — Hallazgo

- defecto
- severidad
- cantidad afectada
- evidencia

## Paso 3 — Contención

- material en HOLD
- devolución
- reposición
- inspección reforzada

## Paso 4 — Seguimiento

- responsable RTM
- contacto proveedor
- fecha compromiso

## Paso 5 — Crear

Crear folio demo:

`ACP-2026-0012`

Mostrar toast y reflejarlo inmediatamente en scorecard y ficha del proveedor.

---

# 14. Estados y semántica

## Evaluación proveedor

- Aprobado → success
- Monitoreo → info/warning
- Condicionado → warning
- Bloqueado → danger

## Incoming

Preservar estados existentes:

- Pendiente
- Liberado
- HOLD / Rechazado

No crear sinónimos innecesarios.

---

# 15. Exportación demo

`Exportar evaluación`

Debe mostrar feedback convincente:

```text
Evaluación de proveedores preparada
Periodo: Últimos 90 días
8 proveedores · 37 lotes inspeccionados
Formato: Excel / PDF · Demo
```

No prometer descarga real si no existe.

---

# 16. Responsive / experiencia

- desktop: scorecard completo + analítica;
- tablet: cards y tabla con scroll horizontal sólo cuando sea necesario;
- mobile: ranking convertido a cards compactas;
- modales con `ModalPortal`;
- botones y CTAs con hit-area suficiente;
- sin fuentes minúsculas ilegibles;
- no usar 15 badges por fila.

---

# 17. Qué NO hacer

- no crear módulo nuevo en Sidebar;
- no copiar Incoming en otra tabla estática desvinculada;
- no duplicar SupplierMaster;
- no inventar certificaciones reales de RTM;
- no decir que un proveedor real es malo si la relación no está confirmada;
- no meter IA ficticia;
- no hacer scorecard con números arbitrarios desconectados del dataset;
- no crear botones muertos;
- no reemplazar el dashboard actual de Proveedores;
- no romper Compras, Calidad ni Incoming actuales.

---

# 18. Prioridad de implementación

## P0

1. elevar Incoming a estado compartido;
2. nueva subtab `Calidad & Evaluación` en Proveedores;
3. scorecard;
4. detalle de proveedor con tab Calidad;
5. Incoming → scorecard;
6. sugerencias moradas;
7. acción correctiva de proveedor;
8. filtros de periodo/proveedor/categoría;
9. navegación Calidad ↔ Proveedor.

## P1

1. analítica completa;
2. comparativo periodo anterior;
3. documentación de calidad;
4. timeline de desempeño;
5. OCs abiertas y riesgo de suministro;
6. exportación demo refinada.

---

# 19. Historia de demo de 2 minutos

1. Entrar a `Proveedores > Calidad & Evaluación`.
2. Mostrar ranking y explicar Score.
3. Abrir `Proveedor Demo BOPP`.
4. Mostrar dos rechazos recientes de espesor.
5. Abrir uno de los lotes Incoming.
6. Regresar y mostrar sugerencia morada por reincidencia.
7. Crear `Acción correctiva de proveedor`.
8. Mostrar que la acción aparece en la ficha y cambia el estado/atención del scorecard.
9. Abrir Bio-Pappel para contrastar con proveedor sano.
10. Cerrar con: "Compras ve precio y entrega; Calidad ve conformidad; el ERP junta ambos para decidir con información completa."

---

# 20. Criterios de aceptación

La implementación se considera lista cuando:

- `Calidad & Evaluación` parece parte nativa del ERP;
- Incoming y Proveedores usan el mismo estado de sesión;
- un rechazo cambia métricas visibles sin refresh;
- el score se deriva del dataset;
- las sugerencias explican el motivo;
- se puede abrir una acción correctiva desde una reincidencia;
- la ficha de proveedor muestra desempeño, lotes y acciones;
- existe navegación contextual entre Calidad y Proveedores;
- no se atribuyen datos negativos falsos a relaciones reales no confirmadas;
- toda acción tiene feedback;
- la UI tiene nivel visual comparable a Inventario/Requisiciones/CRM nuevo;
- no se rompe ninguna funcionalidad existente.

## Validación final

```bash
npm run build
npm run sync:frontend
```
