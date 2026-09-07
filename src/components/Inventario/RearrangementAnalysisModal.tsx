import React from 'react';
import { 
 X, 
 ArrowRight, 
 Flame, 
 TrendingUp, 
 Compass, 
 Clock, 
 MapPin, 
 Boxes, 
 CheckCircle2, 
 Zap,
 Layers,
 Sparkles,
 ChevronRight,
 ShieldCheck,
 Percent,
 Gauge
} from 'lucide-react';
import { RearrangementSuggestion } from '../../data/mockReorderSuggestions';
import { ModalPortal } from '../common/ModalPortal';

export type RearrangementSuggestionItem = RearrangementSuggestion;

interface RearrangementAnalysisModalProps {
 suggestion: RearrangementSuggestion | null;
 onClose: () => void;
 onGenerateOrder: (suggestion: RearrangementSuggestion) => void;
}

export const RearrangementAnalysisModal: React.FC<RearrangementAnalysisModalProps> = ({
 suggestion,
 onClose,
 onGenerateOrder,
}) => {
 if (!suggestion) return null;

 const { analysis } = suggestion;

 const getReasonBadge = (type: string) => {
 switch (type) {
 case 'ALTA ROTACIÓN':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'CONSOLIDACIÓN':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'LIBERACIÓN DE ESPACIO':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'ANTIGÜEDAD / FIFO':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'BAJA ROTACIÓN':
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 const distanceSaved = analysis.currentDistanceMeters - analysis.suggestedDistanceMeters;
 const isPositiveSaving = distanceSaved > 0;

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-500 shadow-2xs shrink-0">
 <Zap className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">{suggestion.sku}</span>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getReasonBadge(suggestion.reasonType)}`}>
 {suggestion.reasonType}
 </span>
 {suggestion.isHeatmapBased && (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs flex items-center gap-1">
 <Flame className="w-3 h-3 text-amber-600" />
 <span>Basado en mapa de calor</span>
 </span>
 )}
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Análisis de Optimización de Layout & Slotting
 </h2>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* Ficha de Unidad & Información del Artículo */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div>
 <span className="text-[9px] font-mono text-theme-muted uppercase block">Unidad / Serie Afectada</span>
 <strong className="text-xs font-mono font-black text-theme-primary">{suggestion.uid}</strong>
 {suggestion.unitsLabel && (
 <span className="text-[10px] text-theme-muted block font-semibold">{suggestion.unitsLabel}</span>
 )}
 </div>
 <div className="text-right">
 <span className="text-[9px] font-semibold text-theme-muted uppercase block">Almacén / CEDIS</span>
 <span className="text-xs font-bold text-theme-main">{suggestion.warehouseName}</span>
 </div>
 </div>

 <div className="text-xs font-extrabold text-theme-main pt-1 border-t border-theme-subtle">
 {suggestion.productName} &middot; <span className="text-theme-muted font-normal">{suggestion.size} ({suggestion.brand})</span>
 </div>
 </div>

 {/* ================================================================= */}
 {/* COMPARATIVA DETALLADA: ACTUAL vs SUGERIDA vs AHORRO */}
 {/* ================================================================= */}
 <div>
 <span className="text-[11px] uppercase font-black text-theme-muted tracking-wider block mb-2.5">
 Comparativa de Rendimiento de Slotting
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 
 {/* Columna 1: ACTUAL */}
 <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 text-center">
 <span className="text-[9px] uppercase font-black text-rose-700 tracking-wider block">
 Ubicación Actual
 </span>
 <strong className="font-mono text-lg font-black text-theme-main block">
 {suggestion.currentLocation}
 </strong>
 <div className="space-y-1 text-[11px] text-theme-muted pt-1 border-t border-rose-500/15">
 <div className="flex justify-between">
 <span>Distancia:</span>
 <strong className="font-mono text-theme-main">{analysis.currentDistanceMeters} m a embarque</strong>
 </div>
 <div className="flex justify-between">
 <span>Frecuencia:</span>
 <strong className="font-mono text-theme-main">{analysis.pickingsPerWeek || Math.round(analysis.pickingsLast30Days / 4)} recolecciones/sem</strong>
 </div>
 <div className="flex justify-between">
 <span>Actividad zona:</span>
 <span className="font-semibold text-rose-700">{analysis.currentZoneActivity || 'Baja / Perimetral'}</span>
 </div>
 </div>
 </div>

 {/* Columna 2: SUGERIDA */}
 <div className="p-4 rounded-2xl bg-white border border-emerald-600 shadow-2xs space-y-2 text-center">
 <span className="text-[9px] uppercase font-black text-emerald-700 dark:text-emerald-400 tracking-wider block">
 Ubicación Sugerida
 </span>
 <strong className="font-mono text-lg font-black text-zinc-900 block">
 {suggestion.suggestedLocation}
 </strong>
 <div className="space-y-1 text-[11px] text-theme-muted pt-1 border-t border-theme-subtle">
 <div className="flex justify-between">
 <span>Distancia:</span>
 <strong className="font-mono text-zinc-900">{analysis.suggestedDistanceMeters} m a embarque</strong>
 </div>
 <div className="flex justify-between">
 <span>Zona destino:</span>
 <span className="font-semibold text-emerald-700">{analysis.destinationZoneActivity} actividad</span>
 </div>
 <div className="flex justify-between">
 <span>Concentración:</span>
 <span className="font-semibold text-theme-main truncate max-w-[110px]">{analysis.skuConcentration}</span>
 </div>
 </div>
 </div>

 {/* Columna 3: AHORRO / BENEFICIO */}
 <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-2 text-center">
 <span className="text-[9px] uppercase font-black text-purple-700 dark:text-purple-300 tracking-wider block">
 Ahorro & Beneficio
 </span>
 <strong className="font-mono text-lg font-black text-purple-700 dark:text-purple-300 block">
 {isPositiveSaving ? `${distanceSaved} m / recolección` : 'Liberación'}
 </strong>
 <div className="space-y-1 text-[11px] text-theme-muted pt-1 border-t border-purple-500/20">
 <div className="flex justify-between">
 <span>Ahorro relativo:</span>
 <strong className="font-mono text-purple-700 dark:text-purple-300">
 {analysis.distanceReductionPercent > 0 ? `-${analysis.distanceReductionPercent}% recorrido` : 'Espacio frontal'}
 </strong>
 </div>
 <div className="flex justify-between">
 <span>Impacto 30d:</span>
 <strong className="font-mono text-purple-700 dark:text-purple-300">
 {isPositiveSaving ? `~${Math.abs(distanceSaved * analysis.pickingsLast30Days)} m ahorrados` : 'Acceso Top'}
 </strong>
 </div>
 <div className="flex justify-between">
 <span>Tipo optimización:</span>
 <span className="font-semibold text-purple-700 dark:text-purple-300">{suggestion.reasonType}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Grid de Variables Consideradas */}
 <div>
 <span className="text-[11px] uppercase font-black text-theme-muted tracking-wider block mb-2.5">
 Variables Analíticas Operativas (Últimos 30 días)
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <div className="flex items-center gap-1.5 text-theme-muted mb-1">
 <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
 <span className="text-[10px] font-semibold uppercase">Rotación</span>
 </div>
 <strong className="text-sm font-mono font-black text-theme-main block">{analysis.rotation30Days}</strong>
 <span className="text-[10px] text-theme-muted">{analysis.pickingsLast30Days} recolecciones en 30d</span>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <div className="flex items-center gap-1.5 text-theme-muted mb-1">
 <Compass className="w-3.5 h-3.5 text-blue-600" />
 <span className="text-[10px] font-semibold uppercase">Distancia</span>
 </div>
 <strong className="text-sm font-mono font-black text-emerald-600 block">
 {analysis.distanceReductionPercent > 0 ? `-${analysis.distanceReductionPercent}%` : `${analysis.suggestedDistanceMeters}m`}
 </strong>
 <span className="text-[10px] text-theme-muted">De {analysis.currentDistanceMeters}m a {analysis.suggestedDistanceMeters}m</span>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <div className="flex items-center gap-1.5 text-theme-muted mb-1">
 <Flame className="w-3.5 h-3.5 text-amber-600" />
 <span className="text-[10px] font-semibold uppercase">Actividad Destino</span>
 </div>
 <strong className="text-sm font-mono font-black text-theme-main block">{analysis.destinationZoneActivity}</strong>
 <span className="text-[10px] text-theme-muted">Bahía de alta fluidez</span>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <div className="flex items-center gap-1.5 text-theme-muted mb-1">
 <Boxes className="w-3.5 h-3.5 text-emerald-600" />
 <span className="text-[10px] font-semibold uppercase">Concentración SKU</span>
 </div>
 <strong className="text-xs font-bold text-theme-main block mt-0.5 truncate">{analysis.skuConcentration}</strong>
 <span className="text-[10px] text-theme-muted">Surtido consolidado</span>
 </div>
 </div>
 </div>

 {/* Conclusión / Diagnóstico del Sistema */}
 <div className="p-4 rounded-2xl bg-purple-600/5 border border-purple-500/20 space-y-1.5">
 <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
 <Sparkles className="w-4 h-4" />
 <span>Diagnóstico del Optimizador de Layout</span>
 </div>
 <p className="text-xs text-theme-main leading-relaxed">
 {analysis.explanation}
 </p>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>

 <button
 onClick={() => onGenerateOrder(suggestion)}
 className="px-4.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Zap className="w-4 h-4" />
 <span>Generar Reacomodo</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};

