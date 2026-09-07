# Impresos RTM — Design System (Reglas Enterprise)

Guía central de estilos y componentes para la plataforma Impresos RTM.

---

## 1. Reglas Maestras de Diseño

1. **Superficies (Surface = White / Dynamic Theme Surface):**
   - Todas las tarjetas, paneles, modales y tablas usan fondo blanco (`bg-white dark:bg-zinc-900` / `bg-theme-surface`).
   - Quedan estrictamente prohibidos los fondos pastel saturados completos (verde, amarillo, naranja, rosa, morado, azul).

2. **Tipografía (Text = Dark):**
   - Texto principal: Negro / slate-900 (`text-zinc-900 dark:text-zinc-100`).
   - Texto secundario: Gris oscuro (`text-zinc-700 dark:text-zinc-300 font-medium` o `text-theme-muted`).
   - Prohibido texto claro o pálido sobre superficies blancas.

3. **Semántica Visual (Semantic color = Border / Icon / Dot):**
   - El color semántico actúa como señal:
     - **Borde semántico:** 1px en reposo, 2px en activo/seleccionado.
     - **Dot:** Punto circular sólido de color.
     - **Icono:** En color semántico legible.
   - El texto dentro del badge/pill siempre se mantiene negro/oscuro.

4. **Pills / Badges / Chips:**
   - [● ACTIVO] &rarr; Fondo blanco + Borde verde + Texto negro + Dot verde.
   - [● PENDIENTE] &rarr; Fondo blanco + Borde ámbar + Texto negro + Dot ámbar.
   - [● RECHAZADA / INCIDENCIA] &rarr; Fondo blanco + Borde rojo + Texto negro + Dot rojo.
   - [● EN TRÁNSITO / ABIERTA] &rarr; Fondo blanco + Borde azul + Texto negro + Dot azul.
   - [● SUGERENCIA / SMART] &rarr; Fondo blanco + Borde morado + Texto negro + Dot morado.

5. **Strategy & Option Cards (Traspasos & Picking):**
   - Inactiva: Fondo blanco + borde sutil gris (`border-theme-subtle`) + texto negro.
   - Seleccionada (`isSelected`): Fondo blanco (`bg-white`) + borde de 2px color primario (`border-2 border-theme-primary`) + check/acento en color primario dinámico + texto negro.
   - Prohibido fondos pastel saturados en cards seleccionadas.

6. **KPI & Metric Cards:**
   - Fondo blanco + borde sutil semántico + cifra grande en negro/mono + link con flecha.

7. **Alertas & Avisos (SemanticAlert):**
   - Superficie blanca o crema casi imperceptible + borde semántico + icono semántico + texto oscuro.
   - Prohibido texto amarillo sobre fondo amarillo.

8. **Botón de Acción Primario (CTA):**
   - El CTA primario utiliza el color activo del theme dinámico (`bg-theme-primary hover:bg-theme-primary-hover text-white`).
   - Botones destructivos (Eliminar, Rechazar, Cancelar orden): Conservan rojo semántico (`bg-rose-600 hover:bg-rose-700 text-white`).

---

## 2. Primitivos Compartidos (`src/components/common`)

- **`SemanticBadge` / `StatusBadge`**: Renderizado unificado de estados y prioridades.
- **`SemanticCard`**: Tarjetas métricas, de KPI o resumen.
- **`StrategyCard`**: Tarjetas de opción/estrategia con borde y acento del theme primario activo.
- **`AttentionCard`**: Tarjetas de atención requerida y alertas operativas.
- **`SectionCard`**: Paneles de sección con encabezado y estructura limpia.
- **`SemanticAlert`**: Banners informativos y de advertencia.
- **`EmptyState`**: Estados vacíos consistentes.
- **`ModalPortal`**: Contenedor modal con control de scroll y z-index.
