import React from 'react';
import { 
 X, 
 Sparkles, 
 MapPin, 
 Compass, 
 Layers, 
 CheckCircle2, 
 Zap, 
 Tag, 
 Building2, 
 TrendingUp 
} from 'lucide-react';
import { PendingPutawayUnit } from '../../../data/mockPutawayData';
import { ModalPortal } from '../../common/ModalPortal';

interface PutawaySuggestionAnalysisModalProps {
 unit: PendingPutawayUnit | null;
 onClose: () => void;
}

export const PutawaySuggestionAnalysisModal: React.FC<PutawaySuggestionAnalysisModalProps> = ({
 unit,
 onClose,
}) => {
 if (!unit) return null;

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Análisis de Slotting y Ubicación Sugerida
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {unit.uid} &bull; {unit.warehouseName}
 </span>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Unit Specs Card */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{unit.sku}</span>
 <span className="text-[10px] text-theme-muted font-bold">{unit.brand} &bull; {unit.size}</span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{unit.productName}</h4>
 <div className="flex items-center gap-3 pt-1 text-[10px] text-theme-muted font-mono">
 <span>Lote: <strong>{unit.lotNumber}</strong></span>
 <span>&bull;</span>
 <span>Ubicación actual: <strong className="text-rose-600">{unit.sourceLocation}</strong></span>
 <span>&bull;</span>
 <span>En recepción: <strong>{unit.timeInReceiving}</strong></span>
 </div>
 </div>

 {/* Suggested Position Highlight */}
 <div className="p-4 rounded-2xl bg-white border border-amber-500 shadow-2xs space-y-2 text-zinc-900">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 block">
 UBICACIÓN RECOMENDADA
 </span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs font-mono">
 Slotting Óptimo
 </span>
 </div>

 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-2xl bg-white border border-amber-500 flex items-center justify-center font-mono font-black text-base text-zinc-900 shadow-2xs">
 {unit.suggestedLocation}
 </div>
 <div className="space-y-0.5 min-w-0">
 <strong className="text-xs font-black block">{unit.suggestionReason}</strong>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-snug">
 {unit.suggestionDetails.explanation}
 </p>
 </div>
 </div>
 </div>

 {/* Slotting Criteria Metrics */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Variables y Factores de Decisión:
 </span>

 <div className="grid grid-cols-2 gap-2.5">
 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <div className="flex items-center gap-1.5 text-theme-muted text-[10px] font-bold">
 <Compass className="w-3.5 h-3.5 text-rose-600" />
 <span>Distancia a Embarque</span>
 </div>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {unit.suggestionDetails.distanceToShippingMeters} m
 </strong>
 <span className="text-[10px] text-emerald-600 font-semibold">Cercanía óptima</span>
 </div>

 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <div className="flex items-center gap-1.5 text-theme-muted text-[10px] font-bold">
 <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
 <span>Actividad de Zona</span>
 </div>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {unit.suggestionDetails.zoneActivity}
 </strong>
 <span className="text-[10px] text-theme-muted font-semibold">Rotación rápida</span>
 </div>

 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <div className="flex items-center gap-1.5 text-theme-muted text-[10px] font-bold">
 <Layers className="w-3.5 h-3.5 text-purple-600" />
 <span>Consolidación SKU</span>
 </div>
 <strong className="text-sm font-mono font-black text-purple-600 block">
 {unit.suggestionDetails.matchedSkuCount} unidades
 </strong>
 <span className="text-[10px] text-theme-muted font-semibold">Mismo artículo contiguo</span>
 </div>

 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-0.5">
 <div className="flex items-center gap-1.5 text-theme-muted text-[10px] font-bold">
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
 <span>Capacidad en Rack</span>
 </div>
 <strong className="text-sm font-mono font-black text-emerald-600 block">
 {unit.suggestionDetails.freeSlotsInRack} slots libres
 </strong>
 <span className="text-[10px] text-theme-muted font-semibold">Espacio garantizado</span>
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-end text-xs">
 <button
 onClick={onClose}
 className="px-5 py-2.5 rounded-xl bg-theme-main text-white dark:text-zinc-900 font-bold hover:opacity-90 transition-all cursor-pointer"
 >
 Entendido
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
