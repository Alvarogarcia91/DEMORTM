import React, { useState } from 'react';
import {
 Search,
 X,
 Filter,
 Sparkles,
 Building2,
 PackagePlus,
 ArrowRight,
 Eye,
 AlertTriangle,
 Boxes,
 Truck
} from 'lucide-react';
import {
 ReorderSuggestion,
 ReorderSuggestionStatus,
 DESTINATION_WAREHOUSES
} from '../../../data/mockRequisitionsData';
import { RequisitionStatusBadge } from './RequisitionStatusBadge';
import { ReorderSuggestionDetailModal } from './ReorderSuggestionDetailModal';

interface ReorderSuggestionsListProps {
 suggestions: ReorderSuggestion[];
 onCreateRequisitionFromSuggestion: (suggestion: ReorderSuggestion) => void;
}

export const ReorderSuggestionsList: React.FC<ReorderSuggestionsListProps> = ({
 suggestions,
 onCreateRequisitionFromSuggestion,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
 const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
 const [selectedSuggestion, setSelectedSuggestion] = useState<ReorderSuggestion | null>(null);

 // Filtered suggestions
 const filteredSuggestions = suggestions.filter((sug) => {
 // Search query
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const matchText = (
 sug.productName.toLowerCase().includes(q) ||
 sug.sku.toLowerCase().includes(q) ||
 sug.brand.toLowerCase().includes(q) ||
 sug.suggestedSupplier.toLowerCase().includes(q) ||
 sug.targetWarehouseName.toLowerCase().includes(q)
 );
 if (!matchText) return false;
 }

 // Warehouse filter
 if (selectedWarehouse !== 'ALL' && sug.targetWarehouseId !== selectedWarehouse) {
 return false;
 }

 // Status filter
 if (selectedStatus !== 'ALL' && sug.status !== selectedStatus) {
 return false;
 }

 return true;
 });

 const urgentCount = suggestions.filter((s) => s.status === 'Reorden urgente').length;
 const insufficientCount = suggestions.filter((s) => s.status === 'Cobertura insuficiente').length;

 return (
 <div className="space-y-4">
 
 {/* Top Banner / Explanatory Card */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-500 shadow-2xs">
 <Sparkles className="w-4 h-4" />
 </div>
 <h3 className="text-sm font-black text-theme-main">
 Sugerencias de Reorden de Compra
 </h3>
 </div>
 <p className="text-xs text-theme-muted">
 Diagnóstico de reabasto automático para CEDIS y Sucursales basado en inventario disponible, cobertura y ritmo de consumo mensual.
 </p>
 </div>

 <div className="flex items-center gap-2 flex-wrap text-xs">
 <span className="px-3 py-1.5 rounded-full font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs">
 {urgentCount} reordenes urgentes
 </span>
 <span className="px-3 py-1.5 rounded-full font-bold bg-theme-surface text-amber-950 dark:text-amber-200 border border-amber-500/35 shadow-2xs">
 {insufficientCount} cobertura insuficiente
 </span>
 </div>
 </div>

 {/* Toolbar & Filters */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center gap-3">
 
 {/* Search */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar artículo, SKU, marca, proveedor o almacén destino..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 {/* Quick Selectors */}
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 {/* Destino Filter */}
 <select
 value={selectedWarehouse}
 onChange={(e) => setSelectedWarehouse(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los destinos</option>
 {DESTINATION_WAREHOUSES.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name}
 </option>
 ))}
 </select>

 {/* Status Filter */}
 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Reorden urgente">Reorden urgente</option>
 <option value="Cobertura insuficiente">Cobertura insuficiente</option>
 <option value="Próximo a mínimo">Próximo a mínimo</option>
 <option value="Normal">Normal</option>
 </select>
 </div>
 </div>
 </div>

 {/* Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Artículo</th>
 <th className="py-3 px-3">SKU</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3 text-center">Disponible</th>
 <th className="py-3 px-3 text-center">En Tránsito</th>
 <th className="py-3 px-3 text-center">Consumo</th>
 <th className="py-3 px-3 text-center">Cobertura</th>
 <th className="py-3 px-3 text-center">Sugerencia</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredSuggestions.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron sugerencias con los filtros seleccionados.
 </td>
 </tr>
 ) : (
 filteredSuggestions.map((sug) => (
 <tr key={sug.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Articulo */}
 <td className="py-3 px-4 min-w-[220px]">
 <div className="space-y-0.5">
 <strong className="text-theme-main font-bold text-xs block">
 {sug.productName}
 </strong>
 <span className="text-[10px] text-theme-muted">
 {sug.brand} &bull; {sug.size}
 </span>
 </div>
 </td>

 {/* SKU */}
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {sug.sku}
 </td>

 {/* Destino */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="text-xs font-semibold text-theme-main block">
 {sug.targetWarehouseName}
 </span>
 <span className="text-[10px] text-theme-muted block truncate max-w-[140px]" title={sug.suggestedSupplier}>
 {sug.suggestedSupplier}
 </span>
 </td>

 {/* Disponible */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold">
 <span className={sug.availableStock <= 2 ? 'text-rose-600' : 'text-emerald-600'}>
 {sug.availableStock} pzas
 </span>
 </td>

 {/* En Transito */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-blue-600 font-bold">
 {sug.inTransitStock}
 </td>

 {/* Consumo */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-purple-600 font-bold">
 {sug.monthlyConsumption} / mes
 </td>

 {/* Cobertura */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
 ~{sug.coverageMonths} meses
 </td>

 {/* Sugerencia */}
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className="font-mono font-black text-rose-600 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
 +{sug.suggestedQuantity} u
 </span>
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <RequisitionStatusBadge status={sug.status} size="sm" />
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 type="button"
 onClick={() => setSelectedSuggestion(sug)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Ver</span>
 </button>

 <button
 type="button"
 onClick={() => onCreateRequisitionFromSuggestion(sug)}
 className="px-3 py-1 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
 >
 <PackagePlus className="w-3.5 h-3.5" />
 <span>Requisición</span>
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Modal Detail */}
 {selectedSuggestion && (
 <ReorderSuggestionDetailModal
 suggestion={selectedSuggestion}
 onClose={() => setSelectedSuggestion(null)}
 onCreateRequisitionFromSuggestion={onCreateRequisitionFromSuggestion}
 />
 )}

 </div>
 );
};
