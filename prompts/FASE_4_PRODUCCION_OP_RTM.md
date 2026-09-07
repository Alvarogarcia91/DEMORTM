# ⚠️ BORRADOR BLOQUEADO — NO EJECUTAR TODAVÍA

Este documento fue preparado antes de refinar Producción con el usuario.

**NO debe ejecutarse ni implementarse todavía.**

Antes de usarlo, Producción y Órdenes de Producción deben revisarse/refinarse en conversación y este archivo deberá actualizarse con el flujo confirmado.

---

# RTM DEMO — FASE 4
## Producción + Órdenes de Producción (OP)

Trabaja sobre:

- Repo: `Alvarogarcia91/DEMORTM`
- Rama: `alvaro01`

> Antes de modificar código, audita el estado actual de la rama. Inventario, Compras, Cotizaciones y Pedidos ya fueron adaptados y deben integrarse; no duplicar lógica ni datasets.

---

# 1. OBJETIVO

Crear el primer módulo realmente productivo del demo RTM.

La historia debe ser:

`Pedido → faltante por producir → OP → validación de materiales → asignación a proceso/máquina → liberación → ejecución → reporte operador → producto terminado`

El foco de esta fase es demostrar control operativo de impresión, no construir todavía un MES completo.

---

# 2. ALCANCE

Implementar:

1. módulo `Producción`
2. módulo/vista `Órdenes de Producción`
3. flujo Offset / Flexografía
4. cola de trabajo por máquina
5. validación simple de materiales desde Inventario
6. surtido visual hacia producción reutilizando Operaciones de Almacén cuando aplique
7. reporte de operador demo
8. generación conceptual de producto terminado al cerrar OP

NO implementar todavía:

- costeo real
- programación avanzada APS
- Gantt complejo
- mantenimiento preventivo
- OEE real
- calidad completa / IATF completa
- captura IoT automática
- tiempos reales desde PLC
- backend productivo

---

# 3. NAVEGACIÓN

Agregar una nueva sección de sidebar:

## PRODUCCIÓN

- Producción
- Órdenes de Producción

Usar keys nuevas claras, por ejemplo:

- `produccion`
- `ordenes-produccion`

Integrarlas también en `NavigationModulesContext` para que puedan ocultarse/mostrarse desde Configuración.

Por default deben quedar visibles.

No borrar ni reorganizar los módulos existentes.

---

# 4. PRODUCCIÓN — DASHBOARD

Crear una vista principal reutilizando el design system actual.

Debe responder rápido:

- OP activas
- OP pendientes de liberar
- OP bloqueadas por material
- OP atrasadas
- trabajos Offset
- trabajos Flexo
- máquinas ocupadas / disponibles
- producción del turno
- scrap/merma reportada

Filtros simples:

- Hoy
- 7 días
- Tecnología: Todas / Offset / Flexografía

No inventar analítica exagerada.

---

# 5. TECNOLOGÍAS

RTM trabaja principalmente:

- Offset
- Flexografía

La UI debe permitir filtrar y distinguir ambas.

No usar colores hardcodeados de marca; theme para selección/CTA y semánticos para estados.

---

# 6. MÁQUINAS DEMO

Usar máquinas demo coherentes con el material/documentación ya conocida de RTM.

Ejemplos aceptables si ya están presentes en datos/documentos del repo:

- Heidelberg Speedmaster — Offset
- Mark Andy — Flexografía

Si existen nombres/modelos más específicos en archivos actuales, reutilizarlos.

No inventar un catálogo enorme.

Para demo basta con 2–4 máquinas visibles.

Cada máquina debe mostrar:

- nombre
- tecnología
- estado
- OP actual
- siguiente OP
- avance
- tiempo estimado / turno demo

Estados:

- Disponible
- Preparando
- En producción
- Detenida
- Esperando material

---

# 7. ÓRDENES DE PRODUCCIÓN

Crear listado + detalle.

Campos mínimos:

- Folio OP
- Pedido origen
- Cliente
- Número de parte / artículo
- Revisión
- Tecnología
- Cantidad requerida
- Cantidad a producir
- Fecha requerida
- Máquina asignada
- Estado
- Avance
- materiales

Estados sugeridos:

- Borrador
- Pendiente de liberación
- Bloqueada por material
- Lista para producción
- En preparación
- En producción
- Pausada
- Terminada
- Cerrada
- Cancelada

---

# 8. CREACIÓN DE OP DESDE PEDIDO

Reutilizar el flujo ya creado en Pedidos.

Cuando un pedido tenga faltante por producir:

`Preparar para producción`

Debe poder crear una OP demo o navegar al módulo OP con datos precargados.

No duplicar pedido ni inventar otra fuente de verdad.

Ejemplo:

Pedido: 30,000 pzas
PT disponible/reservado: 5,000
Faltante: 25,000
Cantidad OP sugerida: 25,000 o mínimo económico demo si ya existe el concepto en el pedido.

Si se muestra mínimo económico, debe seguir marcado como demo, no como fórmula real de RTM.

---

# 9. VALIDACIÓN DE MATERIALES

En detalle de OP agregar bloque:

## Materiales requeridos

Mostrar por partida:

- material
- SKU
- UOM
- requerido estimado
- reservado/surtido
- disponible
- lote sugerido si ya existe
- estado

Estados:

- Disponible
- Parcial
- Faltante
- Bloqueado QA

IMPORTANTE:

No construir todavía BOM real.

Los requerimientos pueden ser mocks coherentes con inventario, con leyenda discreta:

`Requerimiento estimado para demo.`

Si hay faltante, permitir navegación a Compras/Requisiciones reutilizando el flujo existente.

---

# 10. SURTIDO A PRODUCCIÓN

No crear otra pantalla de picking desde cero.

Reutilizar `Operaciones de Almacén` / picking/surtido ya existente.

Desde OP:

`Preparar surtido`

→ navega a Operaciones de Almacén con OP/material precargado cuando la arquitectura actual lo permita.

Mostrar:

- OP
- material
- lote
- ubicación
- cantidad
- confirmación de surtido

---

# 11. MATERIAL ADICIONAL

Este caso es importante para RTM.

Durante una OP en producción permitir acción:

`Solicitar material adicional`

Modal demo con:

- OP
- material
- cantidad adicional
- UOM
- motivo obligatorio
- solicitante
- autorización / responsable

Motivos ejemplo:

- ajuste de máquina
- merma mayor a prevista
- daño de material
- reposición por defecto
- ajuste de registro

Registrar visualmente:

- cantidad planeada
- cantidad surtida inicial
- cantidad adicional
- total surtido

No permitir que el material extra desaparezca como si fuera consumo normal sin trazabilidad.

---

# 12. REPORTE DE OPERADOR

Crear una vista/modal simple reutilizando estilo actual.

Debe capturar demo:

- OP
- máquina
- operador
- inicio
- fin / pausa
- cantidad buena
- scrap/merma
- motivo de merma
- observaciones
- estado de máquina

Acciones:

- Iniciar trabajo
- Pausar
- Reanudar
- Reportar avance
- Terminar operación

No construir reloj industrial real.

---

# 13. FLUJO DE ESTADOS

Una OP debe contar una historia coherente:

`Pendiente liberación`
→ revisar materiales
→ `Lista para producción`
→ surtido
→ `En preparación`
→ `En producción`
→ reporte operador
→ `Terminada`
→ generar producto terminado demo
→ `Cerrada`

Si falta material:

`Bloqueada por material`

Si QA bloquea un lote de MP, la OP debe reflejarlo visualmente.

---

# 14. PRODUCTO TERMINADO

Al terminar OP, permitir acción demo:

`Generar producto terminado`

Crear/mostrar un resumen con:

- lote PT
- OP origen
- pedido origen
- artículo
- revisión
- cantidad buena
- scrap
- fecha
- estado QA: `Pendiente de liberación`

No liberar automáticamente a embarques si QA está pendiente.

Debe integrarse con el módulo `Producto Terminado & Embarques` ya existente.

---

# 15. DATOS MOCK COHERENTES

Reutilizar clientes, pedidos, artículos/materiales y folios existentes de Fase 2/3.

No crear universos paralelos.

Ejemplo narrativo permitido:

- Pedido: `PED-RTM-2026-0142`
- Cliente: Black & Decker
- artículo: Manual instructivo 24 páginas
- revisión: B
- tecnología: Offset
- faltante: 25,000 pzas
- OP: `OP-2026-0891`
- material principal: Papel Couché 90 g
- máquina: Heidelberg Speedmaster

Para Flexo usar un segundo caso con etiqueta autoadherible / BOPP ya presente en inventario.

---

# 16. UI / DESIGN SYSTEM

Seguir estrictamente el design system actual.

- theme dinámico para CTA/activo/focus
- semantic colors para estado
- no hardcodear rojo Super Colchones
- cards blancas
- tablas compactas
- badges semánticos
- modales con `ModalPortal`
- evitar pantallas gigantes pastel

---

# 17. CONFIGURACIÓN

Agregar los nuevos módulos a `NavigationModulesContext`.

Deben aparecer en `Configuración → Módulos & Navegación`.

Inicio y Configuración siguen locked.

Producción y OP pueden ocultarse, pero visibles por default en perfil RTM.

---

# 18. LIMPIEZA OPORTUNISTA

Si al tocar Sidebar o componentes relacionados encuentras residuos visibles heredados como:

- avatar `SC`
- Showroom en textos visibles
- Super Colchones
- colores de branding fijos

corrige únicamente los que estén en archivos tocados o que sean evidentes en la navegación principal.

No convertir esta fase en otra limpieza masiva.

---

# 19. CRITERIOS DE ACEPTACIÓN

Debe poder demostrarse:

### Caso 1 — Pedido a OP
Pedido con faltante → preparar producción → OP creada/precargada.

### Caso 2 — Falta material
OP detecta faltante → navegar a Compras/Requisición.

### Caso 3 — Surtido
OP lista → preparar surtido → Operaciones de Almacén.

### Caso 4 — Ejecución
Asignar máquina → iniciar → reportar avance → terminar.

### Caso 5 — Material adicional
Solicitar material extra con motivo y trazabilidad.

### Caso 6 — PT
Terminar OP → generar lote PT pendiente QA → visible para flujo posterior.

---

# 20. VALIDACIÓN

Antes de terminar:

1. `npm run build`
2. corregir TypeScript
3. probar theme RTM / Graphite / Emerald al menos en pantallas nuevas
4. probar navegación Pedido → OP
5. probar OP → Compras por faltante
6. probar OP → Operaciones de Almacén para surtido
7. probar cierre → PT
8. verificar que no aparezcan colchones/showroom/Super Colchones en Producción

---

# 21. ENTREGA

Reportar corto:

- archivos creados/modificados
- módulos agregados
- flujos conectados
- qué es mock/demo
- build
- pendientes para Calidad

No hacer merge, PR ni trabajar en `main`.
