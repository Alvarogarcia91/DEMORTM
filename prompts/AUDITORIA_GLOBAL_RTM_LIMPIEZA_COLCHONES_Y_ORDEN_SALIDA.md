# RTM DEMO — AUDITORÍA GLOBAL DE DOMINIO + LIMPIEZA DE HERENCIA SUPER COLCHONES
## Enfoque: que TODO lo visible se sienta RTM y simplificar Logística a Orden de Salida

Trabaja sobre:

- Repo: `Alvarogarcia91/DEMORTM`
- Rama: `alvaro01`

> Esta tarea NO agrega módulos nuevos grandes. Es una auditoría/limpieza transversal del demo actual para eliminar residuos visibles de Super Colchones y ajustar la navegación a lo que sí queremos enseñar de RTM.

---

# 1. OBJETIVO

El demo actual todavía tiene componentes, mocks y modelos heredados de Super Colchones.

El objetivo es que al navegar cualquier módulo visible por default NO aparezcan conceptos como:

- colchones
- almohadas
- bases/somieres
- showroom
- sucursales retail
- CEDIS Monterrey
- Nayt
- Restonic
- Spring Air
- Sealy
- SC-UID
- clientes/vehículos/rutas de Monterrey heredados
- branding `SC`

La plataforma debe sentirse consistentemente como Impresos RTM.

IMPORTANTE:

No borrar módulos ni componentes completos por gusto.
Si un módulo no es prioritario para RTM, mantenerlo en código y ocultarlo por default con `NavigationModulesContext`.

---

# 2. DECISIÓN DE ALCANCE SOBRE EMBARQUES / LOGÍSTICA

No eliminar el código existente de Embarques.

RTM sí maneja producto terminado y salida a cliente, pero para este demo NO necesitamos enseñar un TMS/ruteador complejo.

La experiencia principal debe simplificarse a:

`Producto Terminado liberado → Orden de salida → validación/carga → salida confirmada`

No hacer protagonista:

- optimización de rutas
- múltiples paradas
- estrategia LIFO de carga
- dashboard de flota complejo
- rutas retail
- sucursales
- exposiciones

## Recomendación de navegación

Cambiar el label visible del módulo `logistica` a:

`Órdenes de Salida`

Mantener el key interno `logistica` para no romper navegación.

Por DEFAULT este módulo debe quedar OCULTO, ya que para la demo principal queremos priorizar:

- Inicio
- Inventario
- Operaciones de Almacén
- Configuración

El usuario puede activarlo desde:

`Configuración → Módulos & Navegación`

Si se activa, la vista debe abrir en la subvista `Órdenes de salida` y no en un dashboard de logística/rutas.

---

# 3. FUENTE FUNCIONAL PARA SALIDA

En la exploración de RTM se mencionó que el producto terminado pasa a un área de producto terminado y posteriormente sale a clientes de forma frecuente.

Para el demo, representar solamente el control operativo mínimo:

- folio de Orden de Salida
- cliente
- pedido/remisión origen
- producto terminado
- número de parte
- revisión
- lote PT
- cantidad
- unidad
- estado QA
- ubicación/staging
- fecha requerida
- responsable
- transportista/chofer como campo opcional demo
- estado de salida

Estados sugeridos:

- Pendiente
- Lista para salida
- En preparación
- Cargada
- Salida confirmada
- Cancelada

No modelar todavía tracking GPS ni optimización de rutas.

---

# 4. AUDITORÍA GLOBAL OBLIGATORIA

Antes de tocar código ejecutar búsquedas locales en TODO `frontend/src`:

```bash
rg -n -i "colch[oó]n|colchones|almohad|somier|showroom|nayt|restonic|spring air|sealy|super colchones|supercolchones|SC-UID|SC-|cedis monterrey|valle oriente|cumbres|sucursal" frontend/src
```

También revisar:

```bash
rg -n -i "mattress|firmness|box spring|sleep|retail|exposici[oó]n" frontend/src
```

NO hacer replace ciego.

Clasificar cada coincidencia:

1. visible en módulo default;
2. visible solo si se activa módulo oculto;
3. estructura técnica heredada pero no visible;
4. comentario/documentación;
5. asset no utilizado.

Prioridad máxima: 1 y 2.

---

# 5. HALLAZGOS YA CONFIRMADOS

## `frontend/src/data/mockArticlesData.ts`

Actualmente todavía conserva fuertemente dominio de colchones:

- categorías `Colchones`, `Bases`, `Almohadas`, `Protectores`
- `mattressType`
- `firmness`
- `heightCm`
- `supportTechnology`
- `warrantyYears`
- clases `COL`, `BAS`, `ALM`, `PRO`
- grupos como `Colchón en Caja / Espuma`
- variantes por tamaño de colchón

Esto debe corregirse o aislarse.

No es aceptable que al activar Artículos aparezca un catálogo de colchones.

### Acción

Adaptar el mock maestro y la taxonomía visible a RTM, aunque el maestro definitivo se refine después.

Usar categorías demo simples:

- Producto Terminado
- Sustratos / Papel
- Películas / Flexo
- Tintas & Barnices
- Empaque
- Consumibles

Para producto terminado usar ejemplos ya presentes en el proyecto:

- Manual instructivo 24 páginas
- Manual instructivo 48 páginas
- Blister Card
- Etiqueta Autoadherible en Rollo
- Tag impreso

Eliminar de interfaces visibles/campos de UI conceptos de colchón.

Si cambiar toda la interfaz de `MasterArticle` implica demasiado riesgo, crear campos genéricos/industriales y dejar deprecated los viejos internamente sin mostrarlos.

---

# 6. ARTÍCULOS — MÍNIMO RTM ACEPTABLE

Si se activa el módulo Artículos, debe mostrar como mínimo:

- SKU / número de parte
- nombre
- cliente cuando aplique
- categoría
- revisión
- tecnología: Offset / Flexografía / Serigrafía / N/A
- unidad base
- activo/inactivo
- descripción interna
- descripción comercial
- especificación resumida

Filtros:

- búsqueda
- categoría
- tecnología
- estado

NO mostrar filtros de:

- marca de colchón
- tamaño Individual/Matrimonial/Queen/King
- firmeza
- altura de colchón

Si todavía existen campos heredados en la estructura técnica, deben permanecer ocultos de la UI.

---

# 7. SIDEBAR / CONFIGURACIÓN

Revisar `Sidebar.tsx` y `NavigationModulesContext.tsx`.

## Defaults recomendados

Visible por default:

- Inicio
- Inventario
- Operaciones de Almacén
- Configuración

Oculto por default:

- Artículos
- Órdenes de Salida (`logistica`)
- Showroom & Expos
- Requisiciones
- Compras
- Proveedores
- Cotizaciones
- Pedidos
- Clientes

Todos deben seguir disponibles vía toggle excepto los locked.

## Wording

Cambiar:

`Producto Terminado & Embarques`

por:

`Órdenes de Salida`

No borrar key `logistica`.

`Showroom & Expos` se mantiene oculto y NO se adapta en esta tarea salvo residuos compartidos.

---

# 8. LIMPIEZA DEL SIDEBAR

Hay residuos visibles heredados.

Revisar:

- avatar con texto `SC`
- cualquier label de Super Colchones
- wording retail

Cambiar avatar textual a:

`RTM`

o usar `rtm-mark.svg` si es consistente con el diseño.

Cerrar sesión puede conservar rojo semántico porque es una acción de sesión/destructiva, no branding.

---

# 9. ÓRDENES DE SALIDA — REUTILIZAR EMBARQUES SIN HACER TMS

Reutilizar componentes existentes dentro de:

`frontend/src/components/Embarques`

pero simplificar la experiencia visible cuando `logistica` se activa.

## Default interno

Abrir directamente:

`Órdenes de salida`

No `Dashboard`.

## Tabs visibles recomendadas

- Órdenes de salida
- Historial

Opcional:

- En ruta, SOLO si ya funciona sin esfuerzo y está limpio de retail.

Ocultar internamente durante esta fase:

- dashboard de logística complejo
- rutas optimizadas
- estrategias de ruta
- planeación multi-stop

No borrar componentes; simplemente no mostrarlos en el flujo principal.

---

# 10. MOCK SHIPPING — LIMPIEZA

Revisar `frontend/src/data/mockShippingData.ts` y archivos relacionados.

Actualmente todavía contiene conceptos heredados como:

- `Traspaso`
- `Exposición`
- múltiples rutas/paradas
- zonas Valle Oriente / Cumbres
- vehículos con placas NL
- warehouses `wh-mty-norte` / `wh-mty-sur`
- estrategias de ruta retail
- color accents heredados

### Acción

Para la experiencia visible de RTM, reducir el dataset a órdenes de salida industriales simples.

Usar:

Origen:
`Almacén Principal RTM`

Zona de staging:
`EMB-01`

Destino:
cliente industrial

Ejemplos de producto:

- Manual instructivo 24 páginas
- Etiqueta Autoadherible en Rollo
- Blister Card

Usar estados de Orden de Salida.

No es necesario borrar interfaces de route optimization si otros componentes dependen de ellas; simplemente no exponerlas.

---

# 11. INVENTARIO / OPERACIONES DE ALMACÉN

Auditar específicamente que NO queden visibles:

- CEDIS
- sucursales
- colchones
- marcas retail
- SC-UID
- showroom

La estructura visible debe hablar de:

- Almacén Principal RTM
- Almacén Virtual / lógico si ya existe
- ubicaciones
- lotes
- bobinas
- rollos
- tarimas
- pliegos
- cajas
- remanentes
- cuarentena QA
- staging producción
- staging salida `EMB-01`

No ampliar el mapa.

Mantenerlo simple.

---

# 12. COMPRAS / VENTAS / CLIENTES / PEDIDOS

Estos módulos ya fueron adaptados recientemente.

NO rehacerlos.

Solo hacer auditoría de residuos.

Buscar y corregir cualquier referencia visible a:

- colchón
- showroom
- sucursal retail
- marca retail
- Super Colchones
- Monterrey retail

Conservar los flujos industriales ya implementados.

---

# 13. DATOS Y REFERENCIAS COHERENTES

No crear clientes/materiales nuevos distintos en cada módulo.

Reutilizar los mismos ejemplos RTM que ya existen en Fase 2/3/4.

Preferir:

- Black & Decker
- clientes industriales demo ya presentes
- Manual instructivo
- Blister Card
- Etiqueta en rollo
- Papel Couché
- BOPP
- Tintas

No agregar marcas de colchones.

---

# 14. THEME

Toda acción normal debe usar theme dinámico.

NO volver a introducir rojo de Super Colchones.

Theme:

- CTA
- selección
- tabs activas
- focus
- iconos principales

Semántica fija:

- error = rojo
- success = verde
- warning = ámbar
- info = azul
- smart = morado

---

# 15. VALIDACIÓN OBLIGATORIA

Antes de terminar:

1. `npm run build`
2. corregir todos los errores TypeScript
3. ejecutar nuevamente búsquedas `rg`
4. revisar TODO módulo visible por default
5. activar manualmente cada módulo oculto desde Configuración y revisar que no aparezca Super Colchones/colchones en la primera vista
6. comprobar que `Órdenes de Salida` está oculto por default
7. activarlo y comprobar que abre directamente en órdenes, no en dashboard de rutas
8. comprobar que Artículos, si se activa, ya no muestra categorías/tamaños de colchones
9. comprobar avatar/sidebar RTM
10. comprobar theme RTM/Graphite/Emerald en componentes tocados

---

# 16. REPORTE FINAL

Reportar corto:

- archivos modificados
- residuos de Super Colchones eliminados
- residuos que permanecen solo internamente y por qué
- módulos visibles por default
- módulos ocultos por default
- estado de Artículos
- estado de Órdenes de Salida
- resultado de build

No hacer merge.
No abrir PR.
No trabajar en `main`.
