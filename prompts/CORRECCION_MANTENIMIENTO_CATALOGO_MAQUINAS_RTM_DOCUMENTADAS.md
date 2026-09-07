# CORRECCIÓN — MANTENIMIENTO RTM: CATÁLOGO DE MÁQUINAS BASADO EN DOCUMENTOS REALES

## Objetivo
Corregir el módulo de **Mantenimiento** para que el catálogo de máquinas/equipos mostrado en el demo corresponda a equipos realmente mencionados en la documentación y conversaciones de Impresos RTM.

**NO rediseñar el módulo.**
**NO borrar Mantenimiento.**
**NO cambiar la estructura Dashboard / Máquinas / Órdenes / Preventivos / Historial.**

El trabajo es principalmente de **saneamiento del catálogo y coherencia de mocks/UI**.

---

## Regla crítica
Actualmente `mockMaintenanceData.ts` contiene modelos inventados para demo como Nilpeter, Komori, Bobst Novacut, Polar, Agfa, etc.

Esos modelos deben eliminarse o sustituirse cuando no estén soportados por los documentos proporcionados por RTM.

No inventar marcas/modelos específicos si RTM no los proporcionó.

Cuando falte un dato como:
- número de serie,
- año de instalación,
- horas de uso,
- responsable técnico,
- costo,
- fecha exacta de último mantenimiento,
- periodicidad preventiva,
- capacidad técnica,

puede mantenerse un valor **DEMO** únicamente si la UI lo identifica claramente como dato demo, o preferentemente usar un valor neutro/no disponible.

Nunca presentar esos datos como información real de RTM.

---

# 1. Fuentes RTM que deben prevalecer
Antes de modificar el catálogo, revisar nuevamente los archivos/documentos del proyecto relacionados con maquinaria, especialmente:

- `CAPACIDAD DE MAQUINAS.pptx`
- `Repaso- Impresion y Acabado RTM.pptx`
- `Programacion Master OFFSET.FLEXO.xls (1).xlsx`
- `Flexo_Offset.xlsx`
- `Hoja_Especificacion_rotativo.pdf`
- `Calculo_de_Suajes_RTM_14.07.26(1).xlsx`
- `GRABADOS GUIA.xlsx`
- `PLOTTER  PE.xlsx`
- `Registro Inspección de Preimpresión.pptx`
- `documentos y transcripts/transcript_extracted.txt`

Si un nombre aparece en una fuente de RTM, conservar esa terminología.

Si existen diferencias entre documentos, no inventar una reconciliación técnica: usar el nombre más claramente soportado y dejar el catálogo demo sin sobreespecificar.

---

# 2. Catálogo base documentado por RTM
El catálogo demo debe construirse principalmente con los siguientes equipos/nombres soportados por fuentes de RTM.

## Offset
Usar equipos/nombres documentados como:

- Heidelberg Speedmaster
- Prensa Harris
- Prensa DiDDiE / DiDDE
- Conserver Press
- Conserver 1-2
- Conserver 3-4
- Conserver DiDDE 860
- Conserver 8 Colores
- Rioby / Ryobi 1-2, únicamente usando la escritura encontrada en la fuente más clara

No asumir modelo exacto, formato, velocidad o número de colores salvo cuando el documento lo indique explícitamente.

## Flexografía
Usar equipos/nombres documentados como:

- Mark Andy 830 de 7"
- Mark Andy 830 de 10"
- Mark Andy Scout 7C de 10"
- Mark Andy 4120
- Aquaflex
- Allied Gear
- Rotoflex I
- Rotoflex II
- BGM 1
- BGM 2
- BGM 3
- BGM 4

En conversaciones también se usan referencias operativas como `830`, `4120` y `Aquaflex/Aquaflexia`; conservar nomenclatura coherente con la documentación y no crear modelos adicionales.

## Serigrafía
Usar únicamente equipos soportados por las fuentes, por ejemplo:

- Pulpo 4 tintas
- Foliadora
- Troqueladora manual
- Lawson Screen gran formato

Si alguno de estos pertenece funcionalmente a acabado en la documentación, respetar el área documentada y no forzar clasificación.

## Acabado / Conversión
Usar nombres documentados como:

- Guillotina recta
- Dobladora
- Grapadora
- Dobladora Stahl / Sthal según aparezca en la fuente
- Grapadora Muller Martini
- Jianguo rebobinador

No inventar `Polar`, `Bobst`, `Nordson`, etc. si no están sustentados.

---

# 3. Qué hacer con `INITIAL_MACHINES`
Auditar `frontend/src/data/mockMaintenanceData.ts` y su copia canónica si existe en `src/data/`.

Reemplazar el catálogo actual de activos por un conjunto coherente de aproximadamente **12 a 18 activos** tomados de la lista documentada.

No es obligatorio meter absolutamente todas las máquinas de una sola vez. Priorizar una muestra representativa:

- 3–4 Offset
- 5–7 Flexografía
- 2–3 Acabado
- 1–2 Serigrafía

El objetivo es que el demo se vea real para RTM, no inflar artificialmente el catálogo.

Ejemplo de nombres válidos:

```text
OFF-01   Heidelberg Speedmaster          Offset
OFF-02   Prensa Harris                   Offset
OFF-03   Conserver DiDDE 860             Offset
FLX-01   Mark Andy 830 7"                Flexografía
FLX-02   Mark Andy 830 10"               Flexografía
FLX-03   Mark Andy Scout 7C 10"          Flexografía
FLX-04   Mark Andy 4120                   Flexografía
FLX-05   Aquaflex                        Flexografía
FLX-06   Allied Gear                     Flexografía
ACB-01   Dobladora Stahl                 Acabado y Corte
ACB-02   Grapadora Muller Martini        Acabado y Corte
SER-01   Pulpo 4 tintas                  Serigrafía
```

Los códigos internos (`OFF-01`, `FLX-01`, etc.) pueden ser demo porque son identifiers del sistema, pero no deben insinuar que son códigos oficiales RTM.

---

# 4. Campos de máquina
Conservar la estructura actual de `MachineEquipment` si no rompe nada, pero ajustar presentación:

## Datos que sí pueden existir como demo
- estado
- criticidad
- última fecha de mantenimiento
- próximo preventivo
- OT abiertas
- tiempo de paro acumulado

Estos datos sirven para enseñar el módulo.

## Datos que NO deben parecer reales
- número de serie
- año de instalación
- horas exactas acumuladas
- modelo exacto no documentado
- especificaciones técnicas no documentadas
- responsable nominal inventado

Para estos campos:

### Opción preferida
Mostrar:
- `Dato demo`
- `No disponible en fuente`
- `Pendiente de catálogo técnico`

### Opción aceptable
Mantener valores ficticios pero agregar una señal visual consistente:

`DEMO`

No esconder que son simulados.

---

# 5. Marca / modelo
Actualmente existe `brandModelDemo`.

Reutilizarlo, pero con esta regla:

- Si RTM proporcionó marca/modelo: mostrar ese nombre sin agregar variantes inventadas.
- Si solo proporcionó familia/nombre: usar exactamente esa familia/nombre.
- Si no hay modelo: NO completar con conocimiento externo.

Ejemplo:

```text
Heidelberg Speedmaster
```

NO:

```text
Heidelberg Speedmaster SM 74 4-Colores
```

salvo que `SM 74` y `4 colores` aparezcan efectivamente en una fuente RTM.

---

# 6. Áreas válidas
Ajustar `MachineArea` si es necesario para que soporte como mínimo:

- Flexografía
- Offset
- Serigrafía
- Acabado y Corte
- Preprensa
- Servicios de Planta

No crear equipos de Servicios de Planta solo por rellenar el catálogo si RTM no los documentó.

Preprensa puede permanecer disponible para integración futura, pero tampoco debe poblarse con CTP inventados.

---

# 7. Dashboard de Mantenimiento
No rehacer el dashboard.

Solo asegurar que:

- los nombres de equipos que aparecen en alertas coincidan con el nuevo catálogo;
- no sobrevivan nombres como Nilpeter, Komori, Polar, Bobst, Agfa u otros no soportados;
- OT y preventivos referencien máquinas existentes;
- no haya IDs huérfanos;
- filtros por área funcionen con Offset/Flexografía/Serigrafía/Acabado;
- números/KPIs demo continúen coherentes.

---

# 8. Órdenes de mantenimiento
Conservar la funcionalidad actual.

Actualizar todos los mocks de OT para que usen máquinas del catálogo RTM.

Casos demo recomendados:

### Correctivo
`Mark Andy 830 10"`
- falla mecánica genérica
- máquina detenida
- OT de prioridad alta

No inventar una falla extremadamente específica de un componente que no sepamos que tiene esa máquina.

### Preventivo
`Heidelberg Speedmaster`
- inspección / limpieza / lubricación preventiva

### En espera de refacción
`Mark Andy 4120`
- componente genérico pendiente
- mantener integración con requisiciones

### Inspección
`Dobladora Stahl`
- revisión programada

---

# 9. Planes preventivos
Conservar la pantalla actual.

Actualizar los planes para máquinas documentadas.

No afirmar que RTM realmente usa frecuencias específicas.

Usar textos como:

- `Frecuencia demo: mensual`
- `Frecuencia demo: cada 250 h`

si la periodicidad no proviene de la documentación.

Los preventivos deben demostrar capacidad del ERP, no convertirse en falsos procedimientos oficiales RTM.

---

# 10. Historial y MTTR / MTBF
Mantener MTTR/MTBF como indicadores demo.

Agregar o conservar una leyenda discreta donde aplique:

`Indicadores calculados sobre datos simulados del demo.`

El historial debe referenciar exclusivamente máquinas que existen en el nuevo catálogo.

---

# 11. Refacciones
No cambiar el flujo:

```text
OT -> refacción requerida -> inventario -> faltante -> requisición
```

Pero revisar que las refacciones no estén atadas a marcas/modelos eliminados.

Preferir refacciones industriales genéricas:

- rodamiento
- banda
- grasa industrial
- aceite
- sensor
- rodillo
- cuchilla

No usar números de parte OEM inventados.

---

# 12. Coherencia con futura Producción
Este trabajo NO implementa Producción.

Pero los nombres de máquinas usados aquí deben convertirse en la fuente de referencia para el futuro módulo de Producción.

No crear un segundo catálogo distinto más adelante.

Idealmente `mockMaintenanceData.ts` debe poder ser reutilizado o servir como catálogo común de equipo para Planeación/Producción.

---

# 13. Doble árbol de frontend
El repositorio ha tenido `frontend/src/...` y `src/...`.

Antes de editar:

1. identificar cuál es el frontend canónico actual;
2. revisar `scripts/sync-frontend.js` y `package.json`;
3. no dejar una copia desincronizada;
4. si el proyecto requiere sincronización, usar el mecanismo actual del repo en vez de editar dos implementaciones manualmente de forma inconsistente.

---

# 14. Auditoría obligatoria de términos inventados
Al terminar, ejecutar búsqueda global en runtime con `rg` para detectar al menos:

```text
Nilpeter
Komori
Novacut
Polar 115
Polar 92
Agfa Avalon
Bobst Ambition
SM 74
Lithrone
```

Un match solo puede permanecer si:

- está en documentación/prompts históricos, o
- está demostrado por una fuente real de RTM.

No debe quedar visible en el demo por accidente.

También buscar los nuevos nombres para confirmar su uso consistente:

```text
Mark Andy
Aquaflex
Allied Gear
Rotoflex
Conserver
Harris
DiDDE
Speedmaster
Muller Martini
Stahl
Lawson
```

---

# 15. No tocar
No modificar innecesariamente:

- Finanzas
- Nómina
- Inventario
- Compras
- Ventas
- Órdenes de Salida
- Theme system

No agregar Producción ni Calidad en esta corrección.

---

# 16. Casos de aceptación
La corrección se considera terminada cuando:

- [ ] Máquinas & Equipos muestra equipos documentados por RTM.
- [ ] Ya no aparecen modelos genéricos inventados del primer mock.
- [ ] Dashboard referencia el nuevo catálogo.
- [ ] OT referencia el nuevo catálogo.
- [ ] Preventivos referencia el nuevo catálogo.
- [ ] Historial referencia el nuevo catálogo.
- [ ] No hay machine IDs huérfanos.
- [ ] No se presentan seriales/especificaciones inventadas como reales.
- [ ] Los datos simulados están identificados como DEMO cuando corresponda.
- [ ] Se conserva la integración demo de refacciones/requisiciones.
- [ ] El módulo compila.
- [ ] La copia canónica del frontend queda sincronizada.

---

# 17. Validación final
Ejecutar como mínimo:

```bash
npm run build
```

en el frontend correcto.

Si existe script de sincronización requerido por el repo, ejecutarlo en el orden correcto y volver a validar build.

Hacer una revisión visual básica de:

1. Mantenimiento > Dashboard
2. Mantenimiento > Máquinas & Equipos
3. Detalle de una Offset
4. Detalle de una Flexo
5. Nueva OT
6. Preventivos
7. Historial

---

# 18. Reporte final de Anti
Responder breve con:

- catálogo sustituido;
- principales máquinas RTM utilizadas;
- archivos modificados;
- términos inventados eliminados;
- resultado de `npm run build`;
- cualquier dato que no pudo verificarse contra documentos.

No dar una explicación kilométrica.
