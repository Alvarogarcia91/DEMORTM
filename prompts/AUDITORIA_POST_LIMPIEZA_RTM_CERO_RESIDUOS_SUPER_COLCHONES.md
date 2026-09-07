# AUDITORÍA POST-LIMPIEZA RTM — CERO RESIDUOS SUPER COLCHONES

## Objetivo

Corregir la limpieza transversal de DEMORTM para que el runtime visible y los mocks usados por módulos activables se sientan 100% Impresos RTM y no reutilicen conceptos, datos, taxonomías, assets o flujos heredados de Super Colchones.

Esta tarea NO es una nueva fase funcional. Es una auditoría y saneamiento del estado actual de `alvaro01`.

## Regla principal

Antes de modificar:

1. Haz `git checkout alvaro01` y `git pull origin alvaro01`.
2. Audita el código ACTUAL, no asumas que los prompts previos quedaron implementados correctamente.
3. Ejecuta búsquedas globales con `rg` sobre `frontend/src`, `frontend/public`, mocks y componentes para detectar residuos.
4. Reutiliza y corrige; no reconstruyas módulos completos innecesariamente.
5. No implementes Producción ni funcionalidades nuevas fuera de esta auditoría.

---

# 1. Hallazgos confirmados en la auditoría previa

Los siguientes problemas existen en el estado auditado y deben corregirse, además de cualquier otro que encuentres.

## A. `frontend/src/data/mockArticlesData.ts` sigue siendo mayormente Super Colchones

Actualmente conserva, entre otros:

- categorías `Colchones`, `Bases`, `Almohadas`, `Protectores`;
- medidas `Individual`, `Matrimonial`, `Queen Size`, `King Size`;
- atributos `mattressType`, `firmness`, `supportTechnology`, `isBoxed`, `isReversible`, `maxWeightPerPersonKg`, `fabricComposition`, `warrantyYears`;
- clases `COL`, `BAS`, `ALM`, `PRO`;
- grupos `COL-ESP`, `COL-RES`, etc.;
- marcas Nayt, Spring Air, Restonic, América, Sealy, Therapedic, Sognare;
- URLs de `supercolchones.com.mx`;
- textos de descanso, resortes, memory foam, colchón en caja, cubrecolchones, toppers;
- helpers orientados a colchones;
- wording `CEDIS` heredado.

Esto debe eliminarse del modelo/mocks de runtime y sustituirse por un catálogo industrial coherente con RTM.

### Modelo de artículo RTM esperado

No hace falta construir un PLM completo, pero el modelo visible debe hablar de:

- SKU / número de parte;
- revisión;
- nombre / descripción;
- cliente si aplica;
- familia / categoría industrial;
- tecnología: Offset / Flexografía / Serigrafía / N/A;
- sustrato;
- gramaje / calibre;
- dimensiones / formato;
- colores / tintas;
- acabados;
- unidad base;
- presentación logística: tarima / bobina / paquete / caja / rollo;
- lote / trazabilidad cuando aplique;
- proveedor principal para MP si aplica;
- datos de inventario.

Usar categorías coherentes, por ejemplo:

- Materia Prima
- Sustratos
- Tintas y Químicos
- Empaque
- Producto Terminado
- Insumos de Producción

No introducir reglas de ingeniería o QA no refinadas con el cliente.

## B. `frontend/src/components/Articulos/ArticulosPage.tsx` conserva filtros retail

Actualmente ofrece filtros visibles como:

- Colchones
- Bases y Somieres
- Almohadas
- Protectores
- Nayt
- Spring Air
- Restonic
- América
- Sealy
- Therapedic
- Sognare
- Individual
- Matrimonial
- Queen Size
- King Size

Eliminar esos filtros y derivar opciones desde datos RTM o usar filtros industriales:

- categoría/familia;
- tecnología;
- cliente o marca comercial solo si aporta;
- unidad / presentación;
- estado.

Cambiar `Medida` por un concepto industrial apropiado como `Formato / Presentación` cuando sea necesario.

## C. `frontend/src/data/mockShippingData.ts` sigue siendo un TMS de Super Colchones

Actualmente conserva:

- tipos `Traspaso` y `Exposición`;
- vehículos y choferes de Monterrey;
- almacenes `wh-mty-norte` / `wh-mty-sur`;
- placas NL;
- rutas metropolitanas;
- San Pedro, Valle Oriente, Cumbres;
- multi-stop;
- optimización de ruta;
- LIFO de carga por paradas;
- nombres de productos como `RTM Packaging Colchón...`;
- tamaños Matrimonial / Individual / King Size;
- IDs y UIDs heredados.

El demo RTM NO necesita un TMS completo en esta fase.

Simplificar el runtime a **Orden de Salida**:

Producto terminado liberado → Orden de salida → preparación/carga → salida confirmada → remisión asociada.

Mantener solo los datos necesarios para esa historia:

- folio de orden de salida;
- pedido / remisión origen;
- cliente;
- destino;
- fecha programada;
- artículo / revisión;
- lote / tarima / bobina / caja si aplica;
- cantidad;
- carril `EMB-01` si ya forma parte del demo;
- estado;
- evidencia / confirmación demo de salida.

No mostrar como pieza central:

- route optimizer;
- rutas multi-stop;
- showroom/exposición;
- traspasos entre sucursales;
- CEDIS Monterrey;
- estrategia de tráfico;
- mapa de rutas;
- flota compleja.

Si componentes heredados necesitan mantenerse para evitar roturas, deben quedar fuera del flujo visible y sin datos Super Colchones.

## D. Sidebar y navegación siguen exponiendo conceptos heredados

En `Sidebar.tsx` todavía existen:

- `Producto Terminado & Embarques` como label de `logistica`;
- `Showroom & Expos`;
- avatar con iniciales `SC`.

Corregir:

- `logistica` debe presentarse como **Órdenes de Salida** o nombre equivalente corto;
- `showroom-expos` debe permanecer oculto por default y no debe mostrarse como capacidad RTM; si se conserva por compatibilidad técnica, renombrar internamente/neutralizar o mantenerlo completamente fuera de navegación/configuración visible del demo;
- avatar demo debe usar `RTM`, `AD` o iniciales neutrales, nunca `SC`.

## E. `NavigationModulesContext.tsx`

Actualmente:

- `logistica` sigue etiquetado `Producto Terminado & Embarques`;
- `Showroom & Expos` sigue listado en Configuración;
- `logistica` está visible por default.

Aplicar el criterio del demo:

- mantener Inicio, Inventario, Operaciones de Almacén y Configuración como núcleo;
- módulos comerciales/financieros pueden quedar disponibles por toggle según lo ya implementado;
- **Órdenes de Salida** puede existir como módulo activable, preferiblemente oculto por default si esa es la configuración vigente del demo;
- no mostrar `Showroom & Expos` como módulo funcional de RTM.

IMPORTANTE: si el usuario ya tiene `localStorage` viejo, implementar migración/reset seguro de claves o defaults de visibilidad cuando haga falta, para que una configuración anterior no siga mostrando módulos heredados después del cambio.

## F. `DashboardInicio.tsx` está sobre-adaptado y contiene supuestos no refinados

Aunque ya no habla directamente de colchones, conserva una narrativa demasiado grande que no corresponde a lo que se ha refinado:

- dos naves / dos almacenes como si fueran topología confirmada;
- múltiples rutas activas;
- choferes/camiones;
- despacho a ruta;
- referencias a Producción/OP y máquinas específicas;
- `Remisión B2B timbrada` (incorrecto: la remisión no se timbra; la factura sí);
- detalles de producción que aún no han sido refinados con el usuario.

Ajustar dashboard a lo que sí está soportado por el demo actual:

- inventario físico/disponible/reservado/QA;
- recepción y operaciones de almacén;
- compras/requisiciones si el módulo está activo;
- pedidos/cotizaciones/clientes si están activos;
- órdenes de salida si están activas;
- facturación/CxC/CxP solo si ya fueron implementados en la rama al ejecutar esta auditoría.

No presentar Producción como una funcionalidad terminada hasta que se refine e implemente formalmente.

Corregir expresamente cualquier texto `Remisión timbrada` a una semántica correcta: remisión emitida / salida confirmada / factura timbrada según corresponda.

Mantener la topología demo simple: un almacén físico principal, un almacén virtual cuando sea útil y `EMB-01` como staging/carril de salida; no inventar múltiples CEDIS o sucursales.

---

# 2. Barrido global obligatorio

Ejecutar búsquedas case-insensitive, incluyendo variantes con y sin acentos, al menos sobre `frontend/src` y `frontend/public`.

Buscar términos como:

```bash
rg -ni "super ?colchones|colch[oó]n|colchones|mattress|nayt|spring air|restonic|sealy|therapedic|sognare|somier|almohad|protector|cubrecolch|topper|memory foam|queen size|king size|matrimonial|individual|bed in a box|roll-pack|showroom|expo|exposici[oó]n|cedis|mty|monterrey|valle oriente|cumbres|san pedro|SC-|sc-mark|logo-sc|supercolchones\.com" frontend/src frontend/public
```

También buscar residuos semánticos aunque no contengan la palabra colchón:

```bash
rg -ni "sucursal|inter-sucursal|traspaso|ruta metropolitana|route strategy|multi-stop|menor distancia|tr[aá]fico|flota|chofer|camión|placa|exhibici[oó]n" frontend/src
```

### Clasificación de hallazgos

Cada match debe clasificarse como:

1. **Runtime visible** → debe corregirse obligatoriamente.
2. **Runtime oculto pero activable/importado** → debe corregirse o desacoplarse.
3. **Asset legacy no utilizado** → eliminar si es seguro, o verificar que ninguna referencia runtime lo use.
4. **Documento histórico / prompt viejo** → no es necesario reescribirlo salvo que pueda confundirse como fuente vigente; no debe afectar runtime.
5. **Coincidencia legítima** → justificar solo si realmente pertenece a RTM.

El objetivo de aceptación es **cero matches de dominio Super Colchones dentro del runtime visible/activable**.

---

# 3. Coherencia transversal de mocks

No basta con cambiar labels.

Los siguientes módulos deben compartir entidades industriales coherentes:

- Artículos
- Inventario
- Compras
- Proveedores
- Clientes
- Cotizaciones
- Pedidos
- Operaciones de Almacén
- Órdenes de Salida
- Finanzas si ya existe

Ejemplo de SKUs válidos para demo:

- `BD-MAN-024`
- `BD-MAN-048`
- `BLI-CRD-001`
- `PT-ETQ-001`
- `TAG-IMP-002`
- materiales como Couché, Caple, BOPP, papel térmico, tintas, adhesivos.

Evitar que un mismo SKU cambie de significado entre módulos.

No presentar marcas/clientes inventados como relaciones confirmadas de RTM. Si se usan nombres empresariales existentes, mantener carácter demo.

---

# 4. Revisión de dashboards

Auditar explícitamente:

- DashboardInicio
- Inventario dashboard / analítica
- Compras dashboard
- Requisiciones dashboard
- Proveedores si tiene resumen
- Clientes dashboard
- Cotizaciones dashboard
- Pedidos dashboard
- Operaciones de Almacén
- Órdenes de Salida / logística
- Finanzas/CxC/CxP si ya están implementados

En cada dashboard buscar:

- colchones/productos retail;
- sucursales/showroom;
- rutas/flota heredada;
- marcas Super Colchones;
- cifras o top-products incoherentes;
- nombres de almacenes antiguos;
- colores hardcodeados de branding rose/SC;
- CTAs que apunten a módulos apagados o inexistentes.

Si un módulo está oculto por Configuración, el Dashboard principal no debe forzar un CTA hacia ese módulo sin comprobar visibilidad.

---

# 5. Theme compliance

Durante la limpieza:

- branding, CTA, selección, tabs, focus y acciones primarias deben usar tokens theme;
- rojo solo danger/error/vencido/rechazo;
- verde success;
- ámbar warning;
- azul/info neutral cuando sea semántico;
- no usar `rose` como identidad heredada;
- verificar RTM/Navy/Graphite/Emerald.

---

# 6. No hacer

NO:

- implementar Producción;
- inventar OP nuevas;
- construir QA nuevo;
- inventar topología física no confirmada;
- crear TMS completo;
- crear sucursales/CEDIS ficticios;
- rehacer Ventas/Compras/Finanzas si ya funcionan;
- tocar `main`;
- hacer merge;
- abrir PR.

---

# 7. Criterios de aceptación

La auditoría se considera terminada cuando:

1. `Artículos` no muestra ningún colchón, marca de colchones, talla de cama ni atributo de descanso.
2. `mockArticlesData.ts` ya no modela colchones como dominio principal.
3. Ningún módulo visible/activable importa datos de Super Colchones.
4. Sidebar no muestra `Showroom & Expos` como capacidad RTM y no contiene avatar `SC`.
5. `logistica` se presenta como Orden/Órdenes de Salida y no como TMS de rutas.
6. `mockShippingData.ts` deja de tener productos colchón y datos metropolitanos heredados en el flujo runtime.
7. DashboardInicio no presenta remisiones como documentos timbrados y no vende Producción como implementada.
8. Los dashboards internos revisados no contienen residuos retail.
9. La topología visible es simple y coherente con el demo actual.
10. Los mocks principales usan SKUs/clientes/materiales consistentes.
11. El barrido `rg` final no arroja residuos de Super Colchones en runtime visible/activable; si queda algún match técnico legítimo, documentarlo en el resumen final.
12. `npm run build` termina sin errores.

---

# 8. Entrega final de Anti

Al finalizar responder solamente con resumen útil y corto:

- archivos modificados;
- residuos eliminados;
- matches `rg` restantes y por qué son legítimos;
- módulos/dashboards auditados;
- resultado de `npm run build`.

No entregar una explicación kilométrica.
