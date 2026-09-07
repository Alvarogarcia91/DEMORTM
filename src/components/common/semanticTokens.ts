// ============================================================================
// IMPRESOS RTM — ENTERPRISE SEMANTIC TOKENS & SYSTEM
// ============================================================================
// Filosofía de Diseño:
// - Superficies neutras / blancas (bg-white / bg-theme-surface).
// - El color funciona como SEÑAL (borde, icono, número, pill, highlight lateral).
// - Prohibidas las grandes superficies de color pastel completo y pills oscuros.
// - Badges / Status Pills: fondo blanco, texto negro/zinc-900, borde semántico y dot.
// ============================================================================

export type SemanticVariant =
 | 'success' // Verde: Listo, autorizada, favorable, completado
 | 'warning' // Ámbar: Pendiente de autorización, atención requerida, espera
 | 'correction' // Naranja: Requiere corrección, observación, ajuste
 | 'danger' // Rojo: Urgente, crítico, atrasada, rechazada, incidencia
 | 'info' // Azul: Órdenes abiertas, en tránsito, programado, informativo
 | 'smart' // Lila/Púrpura: Sugerencias de reorden, IA, optimización de ruta
 | 'neutral'; // Slate/Gris: Borrador, cancelado, contexto regular

export interface SemanticStyleDef {
 // KPI / Summary Cards: 100% fondo blanco con borde e indicadores semánticos
 kpi: {
 card: string;
 border: string;
 borderHover: string;
 icon: string;
 value: string;
 title: string;
 subtext: string;
 link: string;
 };
 // Status Pill / Badge: Fondo blanco con borde semántico, texto negro/slate y dot de color
 pill: {
 base: string;
 text: string;
 border: string;
 dot: string;
 };
 // Alert / Highlight: Fondo crema/tintado muy sutil permitido
 alert: {
 container: string;
 border: string;
 icon: string;
 title: string;
 text: string;
 };
 // Attention / Item Card
 attentionCard: {
 borderLeft: string;
 border: string;
 icon: string;
 };
}

export const SEMANTIC_TOKENS: Record<SemanticVariant, SemanticStyleDef> = {
 success: {
 kpi: {
 card: 'bg-white border border-emerald-600/40 hover:border-emerald-600/70 shadow-2xs transition-all',
 border: 'border-emerald-600/40',
 borderHover: 'hover:border-emerald-600/70',
 icon: 'text-emerald-700',
 value: 'text-emerald-900 font-mono font-black',
 title: 'text-emerald-950 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-emerald-900 font-semibold',
 },
 pill: {
 base: 'bg-white border border-emerald-600 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-emerald-600',
 dot: 'bg-emerald-600',
 },
 alert: {
 container: 'bg-white border border-emerald-600 shadow-2xs',
 border: 'border-emerald-600',
 icon: 'text-emerald-700',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-emerald-600',
 border: 'border-emerald-600/30',
 icon: 'text-emerald-700',
 },
 },

 warning: {
 kpi: {
 card: 'bg-white border border-amber-600/40 hover:border-amber-600/70 shadow-2xs transition-all',
 border: 'border-amber-600/40',
 borderHover: 'hover:border-amber-600/70',
 icon: 'text-amber-700',
 value: 'text-zinc-900 font-mono font-black',
 title: 'text-zinc-900 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-zinc-900 font-semibold',
 },
 pill: {
 base: 'bg-white border border-amber-500 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-amber-500',
 dot: 'bg-amber-500',
 },
 alert: {
 container: 'bg-white border border-amber-500 shadow-2xs',
 border: 'border-amber-500',
 icon: 'text-amber-600',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-amber-500',
 border: 'border-amber-600/30',
 icon: 'text-amber-700',
 },
 },

 correction: {
 kpi: {
 card: 'bg-white border border-orange-600/40 hover:border-orange-600/70 shadow-2xs transition-all',
 border: 'border-orange-600/40',
 borderHover: 'hover:border-orange-600/70',
 icon: 'text-orange-700',
 value: 'text-zinc-900 font-mono font-black',
 title: 'text-zinc-900 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-zinc-900 font-semibold',
 },
 pill: {
 base: 'bg-white border border-orange-500 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-orange-500',
 dot: 'bg-orange-500',
 },
 alert: {
 container: 'bg-white border border-orange-500 shadow-2xs',
 border: 'border-orange-500',
 icon: 'text-orange-600',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-orange-500',
 border: 'border-orange-600/30',
 icon: 'text-orange-700',
 },
 },

 danger: {
 kpi: {
 card: 'bg-white border border-rose-600/40 hover:border-rose-600/70 shadow-2xs transition-all',
 border: 'border-rose-600/40',
 borderHover: 'hover:border-rose-600/70',
 icon: 'text-rose-700',
 value: 'text-rose-600 font-mono font-black',
 title: 'text-zinc-900 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-rose-600 font-semibold',
 },
 pill: {
 base: 'bg-white border border-rose-600 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-rose-600',
 dot: 'bg-rose-600',
 },
 alert: {
 container: 'bg-white border border-rose-500 shadow-2xs',
 border: 'border-rose-500',
 icon: 'text-rose-600',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-rose-600',
 border: 'border-rose-600/30',
 icon: 'text-rose-700',
 },
 },

 info: {
 kpi: {
 card: 'bg-white border border-blue-600/40 hover:border-blue-600/70 shadow-2xs transition-all',
 border: 'border-blue-600/40',
 borderHover: 'hover:border-blue-600/70',
 icon: 'text-blue-700',
 value: 'text-zinc-900 font-mono font-black',
 title: 'text-zinc-900 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-zinc-900 font-semibold',
 },
 pill: {
 base: 'bg-white border border-blue-600 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-blue-600',
 dot: 'bg-blue-600',
 },
 alert: {
 container: 'bg-white border border-blue-500 shadow-2xs',
 border: 'border-blue-500',
 icon: 'text-blue-600',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-blue-500',
 border: 'border-blue-600/30',
 icon: 'text-blue-700',
 },
 },

 smart: {
 kpi: {
 card: 'bg-white border border-purple-600/40 hover:border-purple-600/70 shadow-2xs transition-all',
 border: 'border-purple-600/40',
 borderHover: 'hover:border-purple-600/70',
 icon: 'text-purple-700',
 value: 'text-zinc-900 font-mono font-black',
 title: 'text-zinc-900 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-zinc-900 font-semibold',
 },
 pill: {
 base: 'bg-white border border-purple-600 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-purple-600',
 dot: 'bg-purple-600',
 },
 alert: {
 container: 'bg-white border border-purple-500 shadow-2xs',
 border: 'border-purple-500',
 icon: 'text-purple-600',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-700 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-purple-600',
 border: 'border-purple-600/30',
 icon: 'text-purple-700',
 },
 },

 neutral: {
 kpi: {
 card: 'bg-white border border-zinc-400/70 hover:border-zinc-500 shadow-2xs transition-all',
 border: 'border-zinc-400/70',
 borderHover: 'hover:border-zinc-500',
 icon: 'text-zinc-700',
 value: 'text-zinc-900 font-mono font-black',
 title: 'text-zinc-700 font-bold uppercase tracking-wider text-[11px]',
 subtext: 'text-theme-muted',
 link: 'text-zinc-800 font-semibold hover:text-theme-main',
 },
 pill: {
 base: 'bg-white border border-zinc-400 shadow-2xs',
 text: 'text-zinc-900 font-semibold tracking-wide',
 border: 'border-zinc-400',
 dot: 'bg-zinc-500',
 },
 alert: {
 container: 'bg-zinc-100 border border-zinc-300 shadow-2xs',
 border: 'border-zinc-300',
 icon: 'text-zinc-700',
 title: 'text-zinc-900 font-bold',
 text: 'text-zinc-800 leading-relaxed font-medium',
 },
 attentionCard: {
 borderLeft: 'border-l-4 border-l-zinc-500',
 border: 'border-zinc-300',
 icon: 'text-zinc-700',
 },
 },
};
