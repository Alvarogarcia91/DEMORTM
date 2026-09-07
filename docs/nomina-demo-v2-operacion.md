# Impresos RTM — Nómina Demo V2: operación completa y UX corregida

## 1. Objetivo de esta corrección

El módulo actual de Nómina ya tiene buenas piezas, pero la experiencia todavía no cuenta bien cómo trabaja una nómina real.

Esta V2 debe corregir dos cosas:

1. **UX**: eliminar la sensación de “menú flotando / sticky duplicado”.
2. **Operación**: pasar de un demo centrado en “importar checadas” a un demo de **gestión completa de ciclos de nómina**, donde RH crea periodos, captura/importa horas, revisa incidencias, valida pre-nómina, cierra y timbra.

La historia del demo debe ser clara incluso para alguien que nunca ha usado CONTPAQi Nóminas.

---

# 2. Primer problema: sticky / header flotante

Actualmente el header interno de Nómina y/o sus tabs se sienten pegados de forma rara y compiten visualmente con el sidebar/topbar general.

## Corrección obligatoria

- El módulo NO debe crear una segunda navegación sticky grande.
- El header de Nómina debe ser normal, dentro del flujo de la página.
- Los tabs internos pueden permanecer visibles al hacer scroll **solo si el patrón ya existe en el ERP y se siente natural**, pero no deben parecer una barra flotante independiente.
- El bloque de estado del ciclo de nómina NO debe ser sticky.
- Nada debe “flotar” por encima de contenido o crear un hueco visual raro.
- Revisar `position: sticky`, `top-*`, `z-index`, `backdrop`, contenedores con `overflow`, alturas fijas y shells internos.

Jerarquía recomendada:

```text
Sidebar global
Topbar global

Header de Nómina
Periodo/ciclo seleccionado
Tabs internos
Contenido de la tab
```

Nada más.

---

# 3. Concepto central correcto: CICLO DE NÓMINA

El usuario no debería entrar directo a una semana “mágicamente existente”.

La entidad principal del demo debe ser un **Ciclo de nómina** o **Periodo de nómina**.

Usar wording principal:

**Ciclo de nómina**

Cada ciclo representa una corrida que RH va a preparar, revisar, cerrar y timbrar.

Ejemplos:

- Semanal · 31 ago – 06 sep 2026
- Semanal · 07 – 13 sep 2026
- Quincenal · 01 – 15 sep 2026

Estados:

- Borrador
- Capturando incidencias
- En revisión
- Autorizada
- Cerrada
- Timbrada

---

# 4. Nueva vista: Ciclos de nómina

Agregar como primera tab o subvista funcional:

## Ciclos de nómina

Esta debe ser la puerta de entrada al módulo.

### Tabla

Columnas:

- Periodo
- Tipo
- Fecha inicio
- Fecha fin
- Fecha de pago
- Empleados incluidos
- Incidencias
- Neto estimado
- Estado
- Acción

Ejemplos:

| Periodo | Tipo | Empleados | Estado |
|---|---|---:|---|
| 31 ago – 06 sep 2026 | Semanal | 24 | En revisión |
| 07 – 13 sep 2026 | Semanal | 24 | Borrador |
| 01 – 15 sep 2026 | Quincenal | 6 | Borrador |
| 24 – 30 ago 2026 | Semanal | 24 | Timbrada |

### Acciones

- **Nuevo ciclo de nómina**
- Duplicar configuración anterior
- Abrir ciclo
- Cerrar ciclo
- Ver historial

---

# 5. Wizard: Nuevo ciclo de nómina

Botón principal:

**+ Nuevo ciclo de nómina**

Abrir modal/wizard de 4 pasos.

## Paso 1 — Tipo y fechas

Campos:

- Tipo de nómina: Semanal / Quincenal
- Fecha inicio
- Fecha fin
- Fecha de pago
- Planta: Reynosa
- Nombre interno opcional

## Paso 2 — Empleados incluidos

Mostrar selección por:

- frecuencia de pago;
- departamento;
- turno;
- estatus activo.

Ejemplo:

`24 colaboradores semanales seleccionados`

No incluir automáticamente empleados quincenales en ciclo semanal.

## Paso 3 — Fuente de horas

Opciones:

- Importar checadas del reloj
- Captura manual
- Usar checadas ya cargadas

Para demo, las tres son simuladas/locales.

## Paso 4 — Resumen

Mostrar:

- periodo;
- fecha de pago;
- 24 empleados;
- fuente de horas;
- estado inicial: Borrador.

CTA:

**Crear ciclo**

Toast:

`Ciclo semanal 07–13 sep 2026 creado correctamente`

---

# 6. Flujo real del demo

La narrativa principal debe ser:

```text
1. Crear ciclo
2. Cargar / capturar horas
3. Revisar asistencia
4. Registrar y autorizar incidencias
5. Calcular pre-nómina
6. Revisar empleado por empleado
7. Autorizar
8. Cerrar ciclo
9. Timbrar CFDI
10. Generar recibos / layout
```

Importar Excel es solamente UNA forma de cargar horas, no “el módulo”.

---

# 7. Asistencia: horas visibles por empleado

La vista actual debe evolucionar.

Además de la matriz por día, quiero que cada empleado tenga un resumen semanal MUY claro.

Tabla recomendada:

- Empleado
- Jornada esperada
- Horas reloj
- Horas ordinarias
- Horas extra/adicionales
- Horas ausentes
- Retardos
- Incidencias
- Estado
- Acción

Ejemplo:

| Empleado | Esperadas | Reloj | Ordinarias | Extra | Ausentes |
|---|---:|---:|---:|---:|---:|
| Carlos Mendoza | 48.0 h | 49.5 h | 48.0 h | 1.5 h | 0.0 h |
| José Herrera | 48.0 h | 47.3 h | 47.3 h | 0.0 h | 0.7 h |
| Miguel Treviño | 48.0 h | 50.1 h | 48.0 h | 2.1 h | 0.0 h |

## Importante

No esconder las horas solo en drawers.

El usuario debe poder contestar de un vistazo:

- ¿cuántas horas debía trabajar este empleado?
- ¿cuántas registró?
- ¿cuántas se van a pagar como ordinarias?
- ¿cuántas son extra?
- ¿cuántas faltan?

---

# 8. Captura manual de horas

Agregar botón:

**Capturar horas**

Debe permitir seleccionar un empleado y registrar por día:

- entrada;
- salida;
- horas ordinarias;
- horas adicionales;
- motivo;
- observación.

También debe existir modo rápido:

**Captura masiva semanal**

Tabla editable demo:

`Empleado | Lun | Mar | Mié | Jue | Vie | Sáb | Total`

Cada celda acepta horas.

Ejemplo:

`8.0 | 8.0 | 8.0 | 8.0 | 8.0 | 8.0 | 48.0`

Esto es importante porque si el reloj falla o RH recibe información manual, el demo sigue teniendo sentido.

---

# 9. Importar checadas / plantilla

Mantener las acciones existentes pero colocarlas como herramienta auxiliar.

Toolbar de Asistencia:

- Capturar horas
- Importar checadas
- Descargar plantilla
- Recalcular
- Exportar

Importación demo:

`1,284 checadas procesadas · 1,279 válidas · 5 requieren revisión`

Después de importar, actualizar el resumen semanal de horas.

---

# 10. Incidencias vinculadas a horas

Las incidencias deben impactar visualmente el resumen del empleado.

Ejemplos:

## Retardo

José Herrera

- Jornada: 48.0 h
- Reloj: 47.7 h
- Retardo: 18 min
- Estatus: Pendiente de revisión

## Permiso con reposición

Jesús Alberto Peña

- Horas esperadas: 48.0
- Horas trabajadas iniciales: 46.0
- Permiso: 2.0 h
- Reposición pendiente: 2.0 h

Después:

- 1.0 h repuesta 09-sep
- 1.0 h repuesta 10-sep
- saldo: 0.0 h

## Checada incompleta

Juan Pablo Castillo

- Entrada: 07:03
- Salida: Sin registro
- Horas: No calculables
- Estado: Bloquea pre-nómina hasta resolver

---

# 11. Conciliación Producción vs Asistencia

Mantener el diferenciador, pero integrarlo dentro del flujo.

Para operadores, mostrar:

- horas reloj;
- horas registradas en producción;
- diferencia;
- OP / máquina;
- motivo si existe paro.

Ejemplo:

Miguel Ángel Treviño

- Reloj: 9.10 h
- Producción: 6.75 h
- Diferencia: 2.35 h
- OP: OP-95839
- Máquina: Mark Andy Scout
- Paro reportado: 1.5 h
- Diferencia no explicada: 0.85 h

Estado:

**Revisar**

No modificar pago automáticamente.

---

# 12. Pre-nómina: convertir horas en dinero

La pre-nómina debe explicar de dónde sale el dinero.

Tabla:

- Empleado
- Horas ordinarias
- Horas adicionales
- Días pagados
- Percepciones
- Deducciones
- Neto
- Validaciones
- Estado

Al abrir empleado mostrar:

## Horas

- Jornada esperada: 48.0 h
- Horas ordinarias: 48.0 h
- Horas adicionales autorizadas: 1.5 h
- Ausencias: 0 h

## Percepciones

- Sueldo base: $X
- Horas adicionales: $X
- Bono puntualidad: $X

## Deducciones

- ISR mock
- IMSS mock
- Incidencias autorizadas

## Neto

`$4,218.36`

No hace falta cálculo fiscal real, pero los números deben ser internamente coherentes.

---

# 13. Recalcular nómina

El botón **Recalcular** debe tener una función narrativa clara.

Cuando cambia:

- una checada;
- una incidencia;
- una hora adicional;
- una reposición;
- un ajuste manual;

la nómina queda marcada:

`Cambios pendientes de recalcular`

Botón:

**Recalcular pre-nómina**

Simular procesamiento y actualizar importes.

Toast:

`Pre-nómina recalculada · 24 empleados · 2 observaciones pendientes`

---

# 14. Resumen del ciclo

En Resumen, arriba deben verse datos del ciclo actual, no solo gráficas.

Tarjeta principal:

**Semanal · 31 ago – 06 sep 2026**

- Estado: En revisión
- Fecha de pago: 07 sep 2026
- 24 empleados
- 1,153.3 h ordinarias
- 33.8 h adicionales
- 6.7 h ausentes
- 5 incidencias
- Neto estimado: $128,460.35

Acciones:

- Revisar asistencia
- Recalcular pre-nómina
- Enviar a autorización

---

# 15. Eliminar el stepper gigante como navegación

El stepper de 5 pasos puede existir, pero solo como **indicador compacto** dentro de Resumen o cabecera del ciclo.

No debe competir con los tabs.

Formato recomendado:

`Checadas ✓  ·  Incidencias 2  ·  Pre-nómina 3  ·  Autorización pendiente  ·  Timbrado pendiente`

Una sola línea o card compacta.

No 5 cards gigantes.

No sticky.

---

# 16. Tabs recomendados finales

Orden sugerido:

1. **Ciclos**
2. **Resumen**
3. **Personal**
4. **Asistencia**
5. **Incidencias**
6. **Pre-nómina**
7. **Timbrado CFDI**
8. **Historial**

Si demasiados tabs afectan el diseño, “Ciclos” puede ser selector superior y no tab, pero debe existir funcionalmente.

---

# 17. Selector de ciclo

En header de Nómina agregar selector:

`Ciclo: Semanal · 31 ago – 06 sep 2026 ▾`

Dropdown demo:

- Semanal · 31 ago – 06 sep · En revisión
- Semanal · 07 – 13 sep · Borrador
- Quincenal · 01 – 15 sep · Borrador
- Semanal · 24 – 30 ago · Timbrada

Botón junto a selector:

**+ Nuevo ciclo**

Esto hace que el módulo se sienta mucho más ERP.

---

# 18. Qué debe lucir en la demo

La mejor historia para presentar:

1. Entrar a Nómina.
2. Mostrar historial de ciclos.
3. Crear un nuevo ciclo semanal.
4. Seleccionar 24 empleados operativos.
5. Importar checadas.
6. Mostrar horas esperadas vs registradas por cada operador.
7. Corregir una checada faltante manualmente.
8. Autorizar una hora adicional.
9. Mostrar permiso con reposición.
10. Abrir conciliación de un operador contra producción.
11. Recalcular pre-nómina.
12. Mostrar cómo las horas se convirtieron en percepciones/deducciones.
13. Autorizar y cerrar.
14. Timbrar CFDI demo.
15. Mostrar 2 errores fiscales, corregir y reintentar.
16. Terminar con 30/30 o el total del ciclo timbrado.
17. Generar layout bancario y recibos.

Esto vende un ERP completo, no un importador de Excel.

---

# 19. Datos mock a reforzar

Para los 24 empleados semanales, cada uno debe tener al menos:

- jornada semanal esperada;
- horas reloj;
- horas ordinarias;
- horas adicionales;
- horas ausentes;
- retardos;
- días trabajados;
- salario diario mock;
- percepción base;
- percepción por extras;
- deducciones mock;
- neto;
- estado de validación.

Los 6 quincenales deben existir en Personal, pero no entrar al ciclo semanal.

---

# 20. Criterios de calidad UX

- No sticky raro.
- No doble navbar.
- No headers gigantes ocupando media pantalla.
- No cards sin función.
- Horas visibles en tablas principales.
- Wording mexicano de nómina entendible.
- Botones con acción real demo.
- Cualquier cambio importante debe reflejarse en el estado del ciclo.
- Mantener diseño y componentes del ERP existente.
- No romper dark mode, temas ni configuración de módulos.

---

# 21. Definition of Done V2

1. Se corrigió completamente el comportamiento sticky/flotante.
2. Existe concepto visible y funcional de **Ciclo de nómina**.
3. Se puede crear un ciclo nuevo mediante wizard demo.
4. Se pueden seleccionar empleados según frecuencia.
5. Se pueden importar checadas.
6. Se pueden capturar horas manualmente.
7. Cada empleado muestra horas esperadas, reloj, ordinarias, adicionales y ausentes.
8. Las incidencias están relacionadas con esas horas.
9. Existe conciliación contra producción para operadores.
10. Pre-nómina muestra el origen de horas y cómo afectan importes.
11. Recalcular tiene sentido y actualiza estados locales.
12. Se puede autorizar, cerrar y timbrar el ciclo.
13. Historial conserva ciclos anteriores.
14. La configuración de módulos sigue funcionando con Nómina.
15. `npm run build` pasa sin errores.
16. No se mantiene lógica duplicada innecesaria.
