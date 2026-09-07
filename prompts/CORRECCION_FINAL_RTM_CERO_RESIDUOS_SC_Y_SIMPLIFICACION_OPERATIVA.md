# CORRECCIÓN FINAL RTM — CERO RESIDUOS SUPER COLCHONES + SIMPLIFICACIÓN OPERATIVA

## Objetivo

Hacer una última pasada quirúrgica sobre la rama `alvaro01` para dejar el demo de Impresos RTM libre de residuos visibles o funcionales heredados de Super Colchones / retail, y corregir módulos que todavía muestran estructuras no confirmadas para RTM.

Esta fase NO agrega Producción, Calidad, Preimpresión, Finanzas ni Nómina. Esta fase únicamente sanea y deja consistente la base existente.

La prioridad es que cualquier módulo que pueda abrirse desde la navegación o activarse desde Configuración se vea y se comporte como RTM industrial.

---

# 1. Regla de oro

Después de esta fase, un usuario debe poder:

- entrar al sistema;
- activar todos los módulos opcionales desde Configuración;
- navegar por cada pantalla;
- abrir tablas, detalles, modales y dashboards;

sin encontrar ninguna referencia visible a:

- Super Colchones
- colchones
- almohadas
- bases / somieres
- protectores / cubrecolchones / toppers
- matrimonial / individual / queen / king
- Nayt
- Spring Air
- Restonic
- Sealy
- Therapedic
- Sognare
- memory foam
- resortes
- roll-pack de colchón
- SC / SC-UID / logos SC
- showroom / expos
- rutas retail
- San Pedro / Valle Oriente / Cumbres
- sucursales retail
- CEDIS múltiples heredados
- placas NL heredadas
- vehículos/choferes/rutas inventadas si no son necesarias para Orden de Salida

No basta con ocultar strings. La estructura de datos y la UI visible deben ser coherentes con RTM.

---

# 2. Auditoría obligatoria antes de programar

Antes de modificar código:

1. `git checkout alvaro01`
2. `git pull origin alvaro01`
3. Revisar el estado actual real.
4. Ejecutar búsqueda global en `frontend/src`, `frontend/public`, `docs` y archivos mock.

Usar `rg` o equivalente con, al menos:

```text
Super Colchones
supercolchones
colchón
colchones
almohada
almohadas
somier
somieres
cubrecolchón
cubrecolchones
topper
toppers
Matrimonial
Individual
Queen Size
King Size
Nayt
Spring Air
Restonic
Sealy
Therapedic
Sognare
memory foam
resortes
roll-pack
SC-UID
SC-
showroom
exposición
expos
Valle Oriente
Cumbres
San Pedro
wh-mty
```

No asumir que una coincidencia es inocua. Revisar si:

- se renderiza;
- alimenta filtros;
- alimenta tablas;
- alimenta modales;
- alimenta dashboards;
- es parte de interfaces/tipos que condicionan la UI;
- es un asset todavía referenciado.

---

# 3. Artículos Maestro — prioridad crítica

Archivos a auditar como mínimo:

- `frontend/src/data/mockArticlesData.ts`
- `frontend/src/components/Articulos/ArticulosPage.tsx`
- `frontend/src/components/Articulos/ArticuloFormModal.tsx`
- `frontend/src/components/Articulos/ArticuloDetailView.tsx`
- `frontend/src/components/Articulos/ClasificacionTab.tsx`

## Problema actual

La estructura de `MasterArticle` todavía conserva categorías, medidas y atributos de colchones.

Esto debe eliminarse o refactorizarse para que el modelo represente artículos gráficos/industriales.

## Taxonomía sugerida para RTM

Usar una estructura demo industrial como:

### Clases

- Producto Terminado
- Materia Prima
- Tintas y Químicos
- Empaque
- Herramental / Auxiliar

### Grupos de Producto Terminado

- Etiquetas
- Manuales / Insertos
- Cajas / Empaque Impreso
- Tarjetas / Blister Cards
- Tags / Colgantes
- Material Promocional

### Grupos de Materia Prima

- Papel / Cartulina
- Películas / BOPP
- Autoadheribles
- Tintas
- Barnices / Solventes
- Adhesivos

No afirmar que esta taxonomía es la oficial de RTM; es estructura demo coherente.

## Campos que deben desaparecer del runtime

Eliminar de interfaces, mocks, formularios, filtros y detalle cuando sean herencia sin uso:

- `mattressType`
- `firmness`
- `heightCm` cuando represente altura de colchón
- `supportTechnology` con wording de descanso
- `isBoxed` como colchón en caja
- `isReversible`
- `maxWeightPerPersonKg`
- `fabricComposition`
- `warrantyYears` como garantía de colchón

No dejar campos zombis que sigan obligando a crear valores falsos.

## Características técnicas RTM sugeridas

El modelo puede usar campos como:

- technology: Offset | Flexografía | Serigrafía | N/A
- substrate
- grammageOrCaliper
- width
- height
- format
- colors
- pantones
- finishes
- packagingType
- revision
- customerPartNumber
- baseUnit
- lotControlled
- expiryControlled
- serializationLevel: Ninguna | Tarima | Bobina | Paquete | Caja

No meter especificaciones que no estén sustentadas en documentación real; mantenerlas genéricas cuando sea necesario.

## Filtros de Artículos

Los filtros actuales NO deben mostrar:

- Colchones
- Bases
- Almohadas
- Protectores
- Nayt
- Spring Air
- Restonic
- América
- Sealy
- Therapedic
- Sognare
- Individual / Matrimonial / Queen / King

Sustituir por filtros RTM:

- Clase
- Grupo
- Tecnología
- Unidad base
- Estado

Opcionalmente Cliente / Número de parte si ya existe soporte.

---

# 4. Clasificación

`ClasificacionTab` debe usar la nueva taxonomía industrial.

Criterios:

- cero códigos `COL`, `BAS`, `ALM`, etc. heredados;
- cero descripciones de descanso;
- datos industriales coherentes con los artículos mock;
- cantidades por clase/grupo deben ser consistentes con el dataset mostrado.

---

# 5. Logística / Orden de Salida — simplificación fuerte

Archivos a auditar como mínimo:

- `frontend/src/data/mockShippingData.ts`
- `frontend/src/data/mockRemisionesData.ts`
- `frontend/src/components/Embarques/**`
- cualquier componente de rutas, choferes, vehículos y estrategias.

## Regla funcional

Para el demo RTM, el módulo debe contar una historia sencilla:

```text
Pedido
→ Producto Terminado disponible / reservado
→ Orden de Salida
→ Preparación / carga
→ Remisión
→ Salida confirmada
```

No necesitamos un TMS complejo.

## Eliminar o desacoplar de la experiencia visible

- tipos `Traspaso` y `Exposición` si solo existen por herencia;
- multi-stop;
- optimización de rutas;
- estrategias `SHORTEST_DISTANCE`, `PRIORITY_WINDOW`, etc.;
- loading zones LIFO para varias paradas;
- choferes y flotilla inventada como eje principal;
- placas NL heredadas;
- zonas San Pedro / Valle Oriente / Cumbres;
- sucursales Monterrey heredadas;
- `wh-mty-*` visibles;
- referencias a showroom/expo.

No es obligatorio borrar código muerto si hacerlo rompe mucho, pero debe quedar completamente desacoplado y no renderizable desde el demo.

## Módulo visible

Renombrar el concepto visible a:

**Órdenes de Salida**

o, si se conserva un encabezado más amplio:

**Producto Terminado / Órdenes de Salida**

Evitar “Producto Terminado & Embarques” si eso abre un TMS completo.

## Datos sugeridos

Mostrar:

- folio OS
- cliente
- pedido
- remisión
- fecha
- cantidad
- UOM
- estado
- staging / andén `EMB-01`
- observaciones

Estados simples sugeridos:

- Pendiente
- Lista para carga
- En carga
- Salida confirmada
- Cancelada

---

# 6. Sidebar

Archivo mínimo:

- `frontend/src/components/Sidebar.tsx`

Corregir:

- `Producto Terminado & Embarques` → `Órdenes de Salida` o nombre definido arriba;
- quitar `Showroom & Expos` de la navegación del demo;
- quitar badge `BÁSICO` si ya no aporta valor;
- avatar con iniciales `SC` → `RTM` o iniciales neutrales;
- cero labels heredados.

No borrar la infraestructura de toggles.

---

# 7. Configuración → Módulos & Navegación

Archivo mínimo:

- `frontend/src/context/NavigationModulesContext.tsx`
- `frontend/src/components/ConfiguracionView.tsx`

Corregir:

- eliminar `Showroom & Expos` de `MODULE_DEFINITIONS` o dejarlo totalmente fuera del demo;
- logística debe llamarse igual que en Sidebar;
- dejar Órdenes de Salida opcional si ese era el comportamiento definido para demo;
- mantener Inicio y Configuración locked;
- revisar defaults.

## Default recomendado

Mantener por default solo los módulos necesarios para la historia principal del demo.

No forzar visible un módulo heredado solo porque existe código.

---

# 8. Dashboard Inicio — limpiar invenciones y mantenerlo neutral

Archivo mínimo:

- `frontend/src/components/DashboardInicio.tsx`

## Problemas a evitar

No mostrar como hechos confirmados:

- Nave 1 / Nave 2 si no están confirmadas;
- dirección inventada;
- Mark Andy;
- Heidelberg Speedmaster;
- Bobst;
- nombres de operadores;
- cantidad de rutas;
- flotilla;
- producción programada;
- OPs;
- capacidades de máquinas;
- layouts de planta no confirmados.

Producción todavía no está refinada en esta fase.

## Dashboard permitido

Puede mostrar información ya soportada por módulos existentes:

- inventario físico / disponible;
- materiales retenidos QA;
- recepciones pendientes;
- requisiciones / compras;
- pedidos;
- producto terminado reservado;
- órdenes de salida;
- remisiones;
- alertas de stock.

Usar wording genérico:

- `Almacén Principal RTM`
- `Almacén Virtual` cuando corresponda
- `Andén EMB-01`

No inventar una topología de múltiples almacenes físicos.

## Corrección conceptual obligatoria

Nunca mostrar:

`Remisión timbrada`

La remisión se emite/genera/confirma.

La factura es la que se timbra.

---

# 9. Dashboard de módulos

Auditar todos los dashboards disponibles, incluso módulos ocultos:

- Inventario
- Operaciones de Almacén
- Compras
- Requisiciones
- Proveedores
- Cotizaciones
- Pedidos
- Clientes
- Órdenes de Salida
- cualquier dashboard compartido

Buscar:

- top productos heredados;
- colchones;
- marcas retail;
- sucursales;
- rutas;
- CEDIS múltiples;
- métricas en unidades que no correspondan;
- wording de tiendas/showroom;
- colores hardcodeados usados como branding.

---

# 10. Mocks cruzados — coherencia obligatoria

Un mismo SKU/cliente/proveedor debe mantener identidad coherente entre módulos.

Ejemplo:

- `BD-MAN-024` debe representar el mismo artículo en Artículos, Ventas, Inventario y Orden de Salida.
- `PT-ETQ-001` debe mantener misma descripción/UOM.

No permitir que un SKU industrial apunte a nombre de colchón en otro mock.

Auditar dependencias entre:

- `mockArticlesData.ts`
- `mockSalesData.ts`
- `mockInventoryData.ts` y equivalentes
- `mockShippingData.ts`
- `mockRemisionesData.ts`
- mocks de compras / recepción

---

# 11. Assets heredados

Auditar:

- `frontend/public/assets/logo-supercolchones.png`
- `frontend/public/assets/logo-supercolchones-hd.png`
- `frontend/public/assets/logo-sc2024.png`
- `frontend/public/assets/logo-store.png`
- `frontend/public/assets/sc-mark.png`

Primero verificar referencias.

Si no se usan y su eliminación no rompe nada, eliminarlos.

Si se conservan por compatibilidad, deben quedar sin ninguna referencia runtime.

No borrar assets a ciegas si existe referencia necesaria.

---

# 12. No tocar en esta fase

NO implementar ni ampliar:

- Producción
- OPs
- Planeación de máquinas
- Calidad como módulo nuevo
- Preimpresión
- Herramentales
- Nómina
- Finanzas
- Facturación
- CxC
- CxP

Si alguno ya está siendo trabajado por otra tarea, no interferir.

Esta fase es saneamiento transversal, no feature development.

---

# 13. Theme compliance

Mantener el sistema de themes existente.

- CTA → `bg-theme-primary`
- hover → token del theme
- selected/active → theme
- rojo solo para error/peligro/vencido
- verde éxito
- ámbar warning

No introducir colores de marca Super Colchones.

Validar RTM / Navy / Graphite / Emerald.

---

# 14. Criterios de aceptación

La fase NO está completa hasta cumplir TODO:

1. `ArticulosPage` no muestra filtros de colchones/retail.
2. `mockArticlesData.ts` ya no depende de atributos de colchón para construir artículos.
3. Clasificación es industrial RTM.
4. No existen productos de colchón visibles en ningún módulo.
5. Sidebar no muestra Showroom & Expos.
6. Sidebar no muestra avatar `SC`.
7. El módulo visible de salida se llama Órdenes de Salida o equivalente aprobado.
8. No se muestra TMS multi-stop como flujo principal.
9. No aparecen Valle Oriente, Cumbres, San Pedro ni sucursales retail.
10. No aparece `Remisión timbrada`.
11. Dashboard Inicio no afirma máquinas/producción todavía no refinadas.
12. No aparecen marcas Nayt, Spring Air, Restonic, Sealy, Therapedic, Sognare.
13. No aparecen Queen / King / Matrimonial / Individual en producto gráfico.
14. No hay referencias visibles a Super Colchones.
15. Activar TODOS los módulos opcionales no revela residuos.
16. Build exitoso.

---

# 15. Verificación final obligatoria

Al terminar:

## A. Ejecutar búsqueda global nuevamente

Repetir el `rg` con todos los términos de la sección 2.

Para cada coincidencia restante explicar si:

- es documentación histórica;
- es código muerto no accesible;
- es compatibilidad técnica;
- o debe corregirse.

No declarar “cero residuos” si quedan coincidencias runtime.

## B. Smoke test manual

Abrir:

- Inicio
- Artículos
- Inventario
- Operaciones de Almacén
- Compras
- Proveedores
- Cotizaciones
- Pedidos
- Clientes
- Órdenes de Salida
- Configuración

Activar todos los módulos opcionales y revisar cada pantalla.

## C. Build

```bash
cd frontend
npm run build
```

Corregir todos los errores antes de cerrar.

---

# 16. Entrega esperada del agente

Al terminar responder con:

1. resumen breve;
2. archivos modificados;
3. residuos encontrados y corregidos;
4. coincidencias `rg` restantes y por qué son aceptables;
5. módulos probados;
6. resultado de `npm run build`;
7. cualquier punto que no pudo corregirse sin riesgo.

No decir “cero residuos” sin evidencia de la búsqueda final.

---

# Restricciones Git

- trabajar únicamente en `alvaro01`;
- no tocar `main`;
- no merge;
- no PR;
- no revertir trabajo ajeno de Finanzas o Nómina;
- si hay cambios concurrentes, hacer pull/rebase seguro antes de modificar y preservar trabajo existente.
