# REALISMO RTM — DATOS MAESTROS Y COHERENCIA TRANSVERSAL

## Objetivo

Subir el nivel de realismo del demo RTM sin agregar funcionalidades nuevas. Esta fase debe sustituir datos genéricos/inventados por datos soportados por documentos y archivos entregados por RTM, y propagar esos datos de forma coherente entre módulos existentes.

La prioridad no es crear pantallas nuevas. La prioridad es que el ERP se sienta de RTM de verdad.

---

## Reglas de ejecución

1. Trabajar únicamente en la rama `alvaro01`.
2. Hacer pull antes de modificar.
3. No tocar `main`, no merge, no PR.
4. Auditar el repo actual antes de editar.
5. Reutilizar componentes y estructuras existentes.
6. No agregar features nuevas salvo ajustes mínimos necesarios para coherencia de datos.
7. No borrar módulos existentes.
8. No tocar Producción ni Calidad como módulos funcionales en esta fase.
9. Los documentos RTM son la fuente de verdad para nombres, clientes, números de parte, revisiones, máquinas, capacidades y materiales.
10. Cuando un dato no esté soportado por documentación RTM, no presentarlo como dato real. Usar alguna de estas opciones:
   - `Dato demo`
   - `No disponible`
   - dejarlo vacío/oculto si no aporta valor.
11. No inventar RFC reales, teléfonos, correos, direcciones, números de serie, responsables, contratos, precios históricos, condiciones comerciales ni relaciones proveedor-cliente.
12. Mantener el diseño visual actual y el sistema de temas RTM.

---

# 1. Fuentes RTM a revisar antes de tocar datos

Auditar primero estos archivos/documentos disponibles en el proyecto/repo y cualquier otra fuente RTM ya cargada:

- `CAPACIDAD DE MAQUINAS.pptx`
- `Repaso- Impresion y Acabado RTM.pptx`
- `Programacion Master OFFSET.FLEXO.xls (1).xlsx`
- `Flexo_Offset.xlsx`
- `Hoja_Especificacion_rotativo.pdf`
- `GRABADOS GUIA.xlsx`
- `PLOTTER PE.xlsx`
- `Calculo_de_Suajes_RTM_14.07.26(1).xlsx`
- `CONTROL DE MUESTRAS .xlsx`
- `REPORTE PRODUCTIVIDAD OCTUBRE PE ...xlsx`
- `Registro Inspección de Preimpresión.pptx`
- `Registro Auditoria Producto Terminado (2).pptx`
- `documentos y transcripts/Reunion previa a demo.docx`
- `documentos y transcripts/transcript_extracted.txt`

Si existe discrepancia entre un mock actual y un documento RTM, gana el documento RTM.

---

# 2. Principio de coherencia transversal

Un mismo cliente, número de parte, revisión, artículo, material o máquina debe conservar el mismo nombre/código en todos los módulos.

Ejemplo correcto:

```text
Cliente: BLACK & DECKER
Número de parte: NA472050
Revisión: 08/23
Descripción: Manual Cordless Recip Saw DCS382 NA
Tecnología: Offset
```

Si aparece en Artículos, Pedidos, Cotizaciones, Facturación, CxC, remisión, inventario o futuras vistas de Producción/Calidad, debe usar exactamente la misma identidad.

No crear duplicados semánticos como:

```text
BLACK & DECKER
Black and Decker México
Stanley Black & Decker Demo
SBD Industrial
```

si se refieren al mismo cliente dentro del demo.

---

# 3. Clientes RTM — reemplazar ficticios donde tengamos evidencia

## 3.1 Clientes soportados por documentación RTM

Priorizar clientes que aparezcan en programación, productividad, exploración o documentos entregados por RTM.

Usar como pool principal, sujeto a verificar en las fuentes:

- BLACK & DECKER
- Panasonic
- BISSELL INTERNATIONAL TRADING COMPANY B.V.
- TYCO
- ENTAIL ENGINE LLC
- ILSCO
- TRICO TECHNOLOGIES CORPORATION
- INVACARE
- JCI
- AFX

No es obligatorio usar todos. Elegir entre 6 y 10 con suficiente soporte documental y variedad de trabajos.

## 3.2 Qué sí puede usarse como real

- nombre de cliente si aparece en fuente RTM;
- números de parte relacionados;
- revisiones;
- descripciones de trabajo;
- tecnología Offset/Flexo cuando esté soportada;
- cantidades mostradas en programación/productividad, siempre que se presenten como ejemplo histórico/demo y no como dato vivo.

## 3.3 Qué NO asumir como real

No inventar ni afirmar como real:

- RFC;
- dirección fiscal;
- emails;
- teléfonos;
- nombre de comprador/contacto;
- límite de crédito;
- días de crédito;
- lista de precios contractual;
- descuentos;
- condiciones comerciales.

Para mantener funcionalidad del demo se pueden conservar valores simulados, pero deben estar claramente aislados como datos demo. Evitar datos que parezcan información fiscal real de una empresa conocida.

## 3.4 Propagación

Revisar y alinear al menos:

- `mockSalesData.ts`
- `mockFinanzasData.ts`
- `mockRemisionesData.ts`
- pedidos/cotizaciones/clientes
- Facturación
- CxC
- órdenes de salida/remisiones
- cualquier dashboard que nombre clientes

---

# 4. Artículos y números de parte — prioridad máxima

El catálogo actual ya está industrializado, pero todavía contiene SKUs inventados tipo `BD-MAN-024`, `PT-ETQ-001`, etc.

Usar números de parte/revisión reales encontrados en RTM para convertir el catálogo en algo reconocible.

## 4.1 Pool de números de parte documentados

Verificar en fuentes antes de usar. Ejemplos ya detectados:

```text
NA698298   Rev 09/24   BLACK & DECKER
NA384367   Rev JUL23   BLACK & DECKER
N696391    Rev 07-19   BLACK & DECKER
NA472050   Rev 08/23   BLACK & DECKER
NA768491   Rev .09/25  BLACK & DECKER
1641301    Rev .02/24  BISSELL
IS-2420    Rev I-01    TRICO
T-3209     Rev I-01    TRICO
A163833BHA Rev A       ENTAIL
02-814-556 Rev B       TYCO
```

## 4.2 Descripciones reales detectadas

Ejemplos a verificar y reutilizar:

- Manual Drill DCD777 NA
- Manual Cordless Polisher DCM849
- Manual Cordless Recip Saw DCS382 NA
- User Guide POWERFORCE HELIX
- Instructivo e-Force
- Slide-In Label
- etiquetas poliéster
- manuales impresos en bond

## 4.3 Modelo mínimo de artículo visible

Cada producto terminado realista debería poder mostrar:

```text
Cliente
Número de parte
Revisión
Descripción
Tecnología
Material principal
Unidad
Estado
```

No agregar funcionalidad compleja nueva si estos campos ya caben en el modelo actual.

## 4.4 Revisiones

La revisión es importante en RTM.

Mantener visible `revision` y evitar perderla en:

- Artículos
- detalle de artículo
- Cotizaciones
- Pedidos
- Remisiones
- Facturación cuando tenga sentido como referencia comercial

No inventar reglas de obsolescencia en esta fase.

## 4.5 Propagación

Actualizar coherentemente:

- `mockArticlesData.ts`
- `mockSalesData.ts`
- remisiones/salidas
- mocks de Finanzas
- dashboards
- cualquier mock de inventario que use los SKUs viejos

Si un SKU se reemplaza, localizar todas sus referencias con `rg` y migrarlas.

---

# 5. Materiales e insumos reales RTM

Reemplazar nombres excesivamente genéricos donde los documentos RTM sí den denominaciones reales.

Pool detectado para verificar:

```text
NEWSPRINT_45
NEWSPRINT_48
BOND_60
BOND_70
BOND_75
COUCHE_100
CARTULINA_180
SULFATADO_16
CB_BLANCO
CF_AMARILLO
CF_VERDE
3M 7850 HL
```

Usarlos en inventario, artículos de MP, requisiciones y compras cuando exista soporte suficiente.

No asumir que una marca/material implica una relación directa de proveedor.

Ejemplo:

`3M 7850 HL` puede ser un material usado por RTM; eso NO significa automáticamente que `3M México` deba ser registrado como proveedor directo.

---

# 6. Máquinas — nombres y capacidades documentadas

El catálogo de Mantenimiento ya fue corregido para usar máquinas de RTM. Esta fase debe mejorar la fidelidad técnica, no rediseñar el módulo.

## 6.1 Máquinas a conservar según fuentes RTM

Verificar catálogo existente y fuentes. Pool ya identificado:

### Offset
- Heidelberg Speedmaster
- Prensa Harris
- Conserver 1-2
- Conserver 3-4
- Conserver DiDDE 860
- Conserver 8 Colores
- Rioby 1-2

### Flexografía
- Mark Andy 830 7"
- Mark Andy 830 10"
- Mark Andy Scout 7C 10"
- Mark Andy 4120
- Aquaflex
- Allied Gear
- Rotoflex I
- Rotoflex II
- BGM 1-4

### Serigrafía / acabado
- Lawson Screen
- Pulpo 4 tintas
- Foliadora
- Troqueladora manual
- equipos de doblado/grapado/corte que estén explícitamente soportados

## 6.2 Capacidades documentadas a utilizar cuando la fuente las respalde

Ejemplos ya identificados; verificar contra documento antes de modificar:

- Heidelberg Speedmaster: ~3,500 pliegos/h; formatos/calibres según fuente.
- Harris: capacidades por formato documentadas.
- Conserver 1-2: ~12,000 pliegos/h.
- Conserver 3-4: ~10,000 pliegos/h.
- DiDDE 860: ~8,500 pliegos/h.
- Conserver 8 Colores: ~10,000 pliegos/h; plecado/foliado cuando esté documentado.
- Rioby 1-2: ~5,500 pliegos/h.
- Mark Andy 830 7": ~9,000.
- Mark Andy 830 10": ~9,500.
- Scout / 4120: capacidades según fuente y configuración.
- BGM: 4 unidades; capacidad según documento.
- Lawson Screen: formato 32×46 pulgadas, una tinta, si la fuente así lo indica.

No convertir una cifra de una fuente en capacidad universal si depende de formato/configuración.

## 6.3 Datos demo a limpiar

Auditar en `mockMaintenanceData.ts`:

- `installationYear`
- `totalOperatingHours`
- `responsibleTechnician`
- `lastMaintenanceDate`
- `nextPreventiveDate`
- `serialNumberDemo`
- documentos/manuales ficticios
- horas de paro acumuladas

Mantenerlos solo si son necesarios para el flujo del demo y señalarlos como demo. No dar apariencia de que RTM proporcionó esos valores.

## 6.4 Dashboard de Mantenimiento

No rediseñar completo en esta fase, pero revisar wording/indicadores para acercarlo a lo descrito por RTM en exploración:

- tendencia de costos por mes;
- refacciones;
- cumplimiento;
- máquinas con más paros;
- refacciones más utilizadas;
- inversión/costo acumulado;
- filtros por periodo;
- filtros por área;
- análisis por técnico;
- preventivo;
- correctivo;
- mantenimiento total;
- autónomo/puesta a punto si está soportado.

No inventar cifras reales históricas: mantener valores demo.

---

# 7. Proveedores — quitar afirmaciones no soportadas

Actualmente el repo contiene proveedores comerciales concretos y datos muy específicos, por ejemplo Sun Chemical, Bio-Pappel, Copamex, Avery Dennison, etc.

No asumir que esas relaciones son reales de RTM si no aparecen confirmadas en las fuentes.

## 7.1 Política

Para cada proveedor actual:

1. Buscar evidencia en docs/transcript.
2. Si está confirmado: puede conservar nombre.
3. Si no está confirmado:
   - preferir nombre genérico realista, por ejemplo `Proveedor de Papeles Gráficos — Demo`, o
   - conservar el nombre comercial solo con marca visual/textual clara `Proveedor demo · relación no confirmada por RTM`.

## 7.2 Datos que deben considerarse DEMO salvo evidencia

- RFC
- contactos
- correos
- teléfonos
- direcciones
- límites de crédito
- días de crédito
- precios
- MOQ
- lead time
- documentos fiscales
- historial comercial

No presentar datos inventados de terceros como si fueran datos reales.

## 7.3 No romper Compras/CxP

Conservar funcionalidad de:

- requisiciones
- OC
- recepciones
- factura proveedor
- validación OC ↔ Recepción ↔ Factura
- pagos

Solo modificar los datos maestros/labels necesarios.

---

# 8. Facturación y CxC — coherencia con datos reales

Facturación debe reutilizar clientes y artículos del catálogo realista.

No usar nombres de clientes ficticios si ya tenemos clientes RTM soportados.

Al menos las facturas demo principales deberían verse conectadas así:

```text
Cliente RTM documentado
↓
Pedido
↓
Remisión
↓
Factura
↓
CxC
```

Los datos fiscales del CFDI son DEMO salvo que estén explícitamente documentados.

No presentar RFC falsos de clientes reales como si fueran verdaderos. Para demo, preferir identificadores claramente simulados o señalar `RFC demo`.

---

# 9. CxP — coherencia con proveedores demo/confirmados

Las facturas de proveedor, OC y recepciones deben usar exactamente el mismo proveedor y artículo/material.

Si se sustituyen proveedores no confirmados, actualizar:

- CxP
- Compras
- OC
- recepción
- requisiciones
- mocks de inventario

La validación de facturas debe seguir funcionando.

No volver a poner `3-Way Match` como wording protagonista. Mantener wording en español acordado:

- Validación
- Validada
- Con diferencia
- Facturas con discrepancias

---

# 10. Inventario y operaciones de almacén

Alinear artículos/materiales con el catálogo realista.

Mantener restricciones ya definidas para el demo:

- una topología simple;
- no inventar múltiples CEDIS/tiendas;
- manejo por bobina/tarima/paquete/caja/remanente;
- físico ≠ disponible;
- lotes/revisiones donde aplique.

Eliminar cualquier dato restante que contradiga la realidad RTM documentada.

---

# 11. Órdenes de Salida y Remisiones

Usar clientes/números de parte del catálogo realista.

No reintroducir TMS, showroom, rutas multi-stop, flota inventada o sucursales heredadas.

Flujo demo permanece:

```text
Producto terminado liberado
→ Orden de salida
→ Validación/carga
→ Salida confirmada
→ Remisión
```

---

# 12. Nómina

No cambiar lógica ni empleados salvo inconsistencias obvias con naming RTM.

Los empleados siguen siendo datos demo. No intentar convertirlos en personas reales de RTM a partir de nombres encontrados en documentos.

No usar nombres reales de colaboradores del cliente para simular datos laborales sensibles.

---

# 13. Calidad y Producción — NO implementar en esta fase

No crear estos módulos ahora.

Solo dejar los datos maestros preparados para que posteriormente puedan reutilizar:

- número de parte;
- revisión;
- cliente;
- tecnología;
- máquina;
- material;
- cantidad;
- lote.

No inventar OP, rutas de proceso, parámetros de calidad o tolerancias nuevas.

---

# 14. Auditoría obligatoria de mocks

Revisar al menos:

```text
frontend/src/data/mockArticlesData.ts
frontend/src/data/mockSalesData.ts
frontend/src/data/mockSuppliersData.ts
frontend/src/data/mockFinanzasData.ts
frontend/src/data/mockMaintenanceData.ts
frontend/src/data/mockRemisionesData.ts
frontend/src/data/mockShippingData.ts
frontend/src/data/mockInventoryData.ts
frontend/src/data/mockInboundData.ts
frontend/src/data/mockPickingData.ts
frontend/src/data/mockPutawayData.ts
frontend/src/data/mockSummaryData.ts
```

Y sus equivalentes en `src/` si el repo mantiene árbol espejo/canónico.

Respetar el mecanismo `sync:frontend` existente. Determinar cuál árbol es fuente canónica antes de modificar y sincronizar correctamente.

---

# 15. Auditoría global de términos y duplicados

Usar `rg` para localizar:

- clientes ficticios viejos;
- SKUs sustituidos;
- proveedores no confirmados;
- nombres de máquinas inventados;
- capacidades contradictorias;
- `wh-mty-*`, sucursales/CEDIS heredados donde ya no correspondan;
- residuos Super Colchones;
- nombres de marcas retail no RTM;
- datos maestros duplicados con spelling distinto.

No hacer reemplazos ciegos globales. Revisar contexto antes de modificar.

---

# 16. Casos demo obligatorios después de la mejora

## Caso A — cliente / artículo realista

Debe existir al menos un flujo visible como:

```text
BLACK & DECKER
→ número de parte documentado
→ revisión documentada
→ artículo
→ pedido
→ remisión
→ factura
→ CxC
```

Los importes pueden ser demo.

## Caso B — otro cliente

Un segundo flujo con cliente distinto, por ejemplo BISSELL/TRICO/TYCO, usando número de parte documentado si existe soporte.

## Caso C — inventario/material

Un material con nombre tomado de fuente RTM debe aparecer coherentemente en:

```text
Artículo MP
→ Inventario
→ Requisición/Compra
→ Recepción
```

## Caso D — máquina

Una máquina documentada debe aparecer en Mantenimiento con:

- nombre correcto;
- área correcta;
- capacidad técnica documentada cuando exista;
- OT/preventivo demo.

No afirmar como real el historial de mantenimiento inventado.

---

# 17. Criterios de aceptación

La fase se considera terminada solo si:

- [ ] Los clientes principales visibles provienen de fuentes RTM o están marcados claramente como demo.
- [ ] Los productos terminados principales usan números de parte/revisiones documentados.
- [ ] Los materiales principales usan nomenclatura encontrada en RTM cuando existe.
- [ ] Las máquinas visibles corresponden al catálogo RTM documentado.
- [ ] Las capacidades técnicas mostradas no contradicen fuentes RTM.
- [ ] Los proveedores no confirmados no parecen relaciones reales afirmadas.
- [ ] Facturación/CxC reutilizan clientes y artículos coherentes.
- [ ] Compras/CxP reutilizan proveedores/materiales coherentes.
- [ ] Remisiones/Órdenes de Salida usan los mismos clientes/artículos.
- [ ] No se agregaron funciones nuevas innecesarias.
- [ ] No se implementó Producción ni Calidad.
- [ ] No se rompieron toggles de módulos.
- [ ] No se reintrodujo Showroom/Expos.
- [ ] No se reintrodujo TMS viejo.
- [ ] `npm run build` termina sin errores.
- [ ] Si aplica, `npm run sync:frontend` deja los dos árboles sincronizados.

---

# 18. Reporte final de Anti

Al terminar reportar brevemente:

1. archivos modificados;
2. clientes reales/documentados incorporados;
3. números de parte/revisiones incorporados;
4. materiales RTM incorporados;
5. máquinas/capacidades corregidas;
6. proveedores que quedaron como demo/no confirmados;
7. resultado de `rg`;
8. resultado de `npm run build`;
9. confirmación de que no se tocó main/merge/PR.
