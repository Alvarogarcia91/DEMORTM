import React from 'react';
import {
 X,
 Sparkles,
 Building2,
 Truck,
 TrendingDown,
 Calendar,
 AlertTriangle,
 ArrowRight,
 PackagePlus,
 Boxes,
 Clock,
 ShieldAlert
} from 'lucide-react';
import { ReorderSuggestion } from '../../../data/mockRequisitionsData';
import { RequisitionStatusBadge } from './RequisitionStatusBadge';
import { ModalPortal } from '../../common/ModalPortal';

interface ReorderSuggestionDetailModalProps {
 suggestion: ReorderSuggestion;
 onClose: () => void;
 onCreateRequisitionFromSuggestion: (suggestion: ReorderSuggestion) => void;
}

export const ReorderSuggestionDetailModal: React.FC<ReorderSuggestionDetailModalProps> = ({
 suggestion,
 onClose,
 onCreateRequisitionFromSuggestion,
}) => {
 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-500 shadow-2xs shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5">
 <h2 className="text-sm font-black text-theme-main">
 Sugerencia de Reorden de Compra
 </h2>
 <RequisitionStatusBadge status={suggestion.status} size="sm" />
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Cálculo de reabasto automático para <strong>{suggestion.targetWarehouseName}</strong>
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1">
 
 {/* Article Info Header */}
 <div className="p-4.5 rounded-3xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono font-black text-xs text-theme-primary">{suggestion.sku}</span>
 <span className="text-[11px] font-bold text-theme-muted">{suggestion.targetWarehouseName}</span>
 </div>
 <h3 className="text-base font-extrabold text-theme-main">{suggestion.productName}</h3>
 <span className="text-xs text-theme-muted">
 Marca: <strong>{suggestion.brand}</strong> &bull; Medida: <strong>{suggestion.size}</strong> &bull; Categoría: <strong>{suggestion.category}</strong>
 </span>
 </div>

 {/* Operational Metrics Cards */}
 <div>
 <span className="text-[10px] uppercase font-black text-theme-muted tracking-wider block mb-2.5">
 Estado de Inventario & Diagnóstico de Reabasto
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Disponible</span>
 <strong className={`text-xl font-mono font-black block ${
 suggestion.availableStock <= 2 ? 'text-rose-600' : 'text-emerald-600'
 }`}>
 {suggestion.availableStock} <span className="text-xs font-normal text-theme-muted">pzas</span>
 </strong>
 <span className="text-[10px] text-theme-muted block">Comprometido: {suggestion.committedStock}</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">En Tránsito</span>
 <strong className="text-xl font-mono font-black text-blue-600 block">
 {suggestion.inTransitStock} <span className="text-xs font-normal text-theme-muted">pzas</span>
 </strong>
 <span className="text-[10px] text-theme-muted block">Por recibir en destino</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Consumo Mensual</span>
 <strong className="text-xl font-mono font-black text-purple-600 block">
 {suggestion.monthlyConsumption} <span className="text-xs font-normal text-theme-muted">/ mes</span>
 </strong>
 <span className="text-[10px] text-theme-muted block">Cobertura: ~{suggestion.coverageMonths} meses</span>
 </div>

 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 shadow-xs space-y-1">
 <span className="text-[10px] text-rose-700 dark:text-rose-300 uppercase font-black block">Compra Sugerida</span>
 <strong className="text-2xl font-mono font-black text-rose-600 block">
 {suggestion.suggestedQuantity} <span className="text-xs font-normal text-theme-muted">unidades / millares</span>
 </strong>
 <span className="text-[10px] text-rose-700 font-bold block">Mínimo: {suggestion.minStock} pzas</span>
 </div>
 </div>
 </div>

 {/* Supplier & Reason Box */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1.5 text-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Truck className="w-3.5 h-3.5 text-theme-primary" />
 Proveedor Sugerido & Tiempo
 </span>
 <strong className="text-sm font-bold text-theme-main block">
 {suggestion.suggestedSupplier}
 </strong>
 <span className="text-[11px] text-theme-muted block">
 Tiempo de entrega proyectado: <strong className="font-mono text-theme-main">{suggestion.supplierLeadDays} días hábiles</strong>
 </span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1.5 text-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
 Motivo del Reorden
 </span>
 <p className="text-theme-main leading-relaxed">
 {suggestion.reason}
 </p>
 </div>
 </div>

 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>

 <button
 onClick={() => {
 onClose();
 onCreateRequisitionFromSuggestion(suggestion);
 }}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <PackagePlus className="w-4 h-4" />
 <span>Crear requisición ({suggestion.suggestedQuantity} unidades)</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>

 </div>
 </ModalPortal>
 );
};
