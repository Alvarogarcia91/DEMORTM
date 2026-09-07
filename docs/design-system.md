# Super Colchones — Design System (Reglas Enterprise)

Guía central de estilos y componentes para la plataforma Super Colchones.

---

## 1. Reglas Maestras de Diseño

1. **Superficies (Surface = White):**
   - Todas las tarjetas, paneles, modales y tablas usan fondo blanco (\g-white dark:bg-zinc-900\ / \g-theme-surface\).
   - Quedan estrictamente prohibidos los fondos pastel saturados completos (verde, amarillo, naranja, rosa, morado, azul).

2. **Tipografía (Text = Dark):**
   - Texto principal: Negro / slate-900 (\	ext-zinc-900 dark:text-zinc-100\).
   - Texto secundario: Gris oscuro (\	ext-zinc-700 dark:text-zinc-300 font-medium\ o \	ext-theme-muted\).
   - Prohibido texto claro o pálido sobre superficies blancas.

3. **Semántica Visual (Semantic color = Border / Icon / Dot):**
   - El color semántico actúa como señal:
     - **Borde semántico:** 1px en reposo, 2px en activo/seleccionado.
     - **Dot:** Punto circular sólido de color.
     - **Icono:** En color semántico legible.
   - El texto dentro del badge/pill siempre se mantiene negro/oscuro.

4. **Pills / Badges / Chips:**
   - \[● ACTIVO]\ &rarr; Fondo blanco + Borde verde + Texto negro + Dot verde.
   - \[● PENDIENTE]\ &rarr; Fondo blanco + Borde ámbar + Texto negro + Dot ámbar.
   - \[● RECHAZADA]\ &rarr; Fondo blanco + Borde rojo + Texto negro + Dot rojo.
   - \[● EN TRÁNSITO]\ &rarr; Fondo blanco + Borde azul + Texto negro + Dot azul.
   - \[● SUGERENCIA]\ &rarr; Fondo blanco + Borde morado + Texto negro + Dot morado.

5. **Strategy & Option Cards (Traspasos & Picking):**
   - Inactiva: Fondo blanco + borde sutil gris (\order-theme-subtle\) + texto negro.
   - Seleccionada (\isSelected\): Fondo blanco (\g-white\) + borde de 2px color primario (\order-2 border-theme-primary\) + check/acento rojo + texto negro.
   - Prohibido fondos rosa o lavanda en cards seleccionadas.

6. **KPI & Metric Cards:**
   - Fondo blanco + borde sutil semántico + cifra grande en negro/mono + link con flecha.

7. **Alertas & Avisos (SemanticAlert):**
   - Superficie blanca o crema casi imperceptible + borde semántico + icono semántico + texto oscuro.
   - Prohibido texto amarillo sobre fondo amarillo.

8. **Botón de Acción Primario (CTA):**
   - Rojo corporativo Super Colchones (\g-theme-primary hover:bg-theme-primary-hover text-white\).

---

## 2. Primitivos Compartidos (\src/components/common\)

- **\SemanticBadge\ / \StatusBadge\**: Renderizado unificado de estados y prioridades.
- **\SemanticCard\**: Tarjetas métricas, de KPI o resumen.
- **\StrategyCard\**: Tarjetas de opción/estrategia con borde rojo cuando están activas.
- **\AttentionCard\**: Tarjetas de atención requerida y alertas operativas.
- **\SectionCard\**: Paneles de sección con encabezado y estructura limpia.
- **\SemanticAlert\**: Banners informativos y de advertencia.
- **\EmptyState\**: Estados vacíos consistentes.
- **\ModalPortal\**: Contenedor modal con control de scroll y z-index.
