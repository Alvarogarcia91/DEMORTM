import React, { useState, useMemo } from 'react';
import { 
 Search, 
 Filter, 
 Sparkles, 
 ArrowRightLeft, 
 Building2, 
 Calendar, 
 Layers, 
 CheckSquare, 
 Square, 
 Clock, 
 Tag, 
 X, 
 Eye,
 CheckCircle2,
 Boxes
} from 'lucide-react';
import { PendingPutawayUnit, PutawayOrder } from '../../../data/mockPutawayData';
import { PutawaySuggestionAnalysisModal } from './PutawaySuggestionAnalysisModal';
import { PutawayOrderCreateModal } from './PutawayOrderCreateModal';

interface PutawayPendingPoolProps {
 units: PendingPutawayUnit[];
 onOrderCreated: (newOrder: PutawayOrder) => void;
}

export const PutawayPendingPool: React.FC<PutawayPendingPoolProps> = ({
 units,
 onOrderCreated,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
 const [selectedBrand, setSelectedBrand] = useState('ALL');
 const [selectedSize, setSelectedSize] = useState('ALL');
 const [selectedStatus, setSelectedStatus] = useState('ALL');

 // Selected Unit UIDs for batch order generation
 const [selectedUids, setSelectedUids] = useState<string[]>([]);

 // Modals state
 const [analysisUnit, setAnalysisUnit] = useState<PendingPutawayUnit | null>(null);
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

 // Filtered dataset
 const filteredUnits = useMemo(() => {
 return units.filter((u) => {
 const q = searchQuery.toLowerCase().trim();
 const matchesSearch =
 !q ||
 u.uid.toLowerCase().includes(q) ||
 u.sku.toLowerCase().includes(q) ||
 u.productName.toLowerCase().includes(q) ||
 u.lotNumber.toLowerCase().includes(q);

 const matchesWarehouse = selectedWarehouse === 'ALL' || u.warehouseId === selectedWarehouse;
 const matchesBrand = selectedBrand === 'ALL' || u.brand === selectedBrand;
 const matchesSize = selectedSize === 'ALL' || u.size === selectedSize;
 const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

 return matchesSearch && matchesWarehouse && matchesBrand && matchesSize && matchesStatus;
 });
 }, [units, searchQuery, selectedWarehouse, selectedBrand, selectedSize, selectedStatus]);

 // Selection handlers
 const handleToggleSelectAll = () => {
 if (selectedUids.length === filteredUnits.length) {
 setSelectedUids([]);
 } else {
 setSelectedUids(filteredUnits.map((u) => u.uid));
 }
 };

 const handleToggleSelectOne = (uid: string) => {
 setSelectedUids((prev) =>
 prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
 );
 };

 const selectedUnitsObjects = useMemo(() => {
 return units.filter((u) => selectedUids.includes(u.uid));
 }, [units, selectedUids]);

 const activeWarehouseName = selectedUnitsObjects[0]?.warehouseName || 'Almacén Materia Prima';
 const activeWarehouseId = selectedUnitsObjects[0]?.warehouseId || 'alm-rtm-mp';

 return (
 <div className="space-y-4">
 
 {/* Search Bar & Filters */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center gap-3">
 
 {/* Search Box */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar UID, SKU, artículo o lote..."
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
 <select
 value={selectedWarehouse}
 onChange={(e) => setSelectedWarehouse(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las ubicaciones</option>
 <option value="alm-rtm-mp">Almacén Materia Prima</option>
 <option value="alm-rtm-pt">Almacén Producto Terminado</option>
 <option value="wh-suc-valle-oriente">Almacén Auxiliar Reynosa</option>
 </select>

 <select
 value={selectedBrand}
 onChange={(e) => setSelectedBrand(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las marcas</option>
 <option value="Sun Chemical">Sun Chemical</option>
 <option value="Bio-Pappel">Bio-Pappel</option>
 <option value="Avery Dennison">Avery Dennison</option>
 <option value="WestRock">WestRock</option>
 </select>

 <select
 value={selectedSize}
 onChange={(e) => setSelectedSize(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las medidas</option>
 <option value="Pliegos 70x100">Pliegos 70x100</option>
 <option value="Bobina 2,500m">Bobina 2,500m</option>
 <option value="Tarima PT">Tarima PT</option>
 <option value="Cubeta 20kg">Cubeta 20kg</option>
 </select>

 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Pendiente">Pendiente</option>
 <option value="En orden">En orden</option>
 </select>
 </div>
 </div>

 {/* Selected Floating Action Bar */}
 {selectedUids.length > 0 && (
 <div className="p-3 bg-theme-primary-light border border-theme-primary/30 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-theme-primary" />
 <span className="font-bold text-theme-main">
 {selectedUids.length} {selectedUids.length === 1 ? 'unidad seleccionada' : 'unidades seleccionadas'}
 </span>
 </div>

 <button
 onClick={() => setIsCreateModalOpen(true)}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <ArrowRightLeft className="w-3.5 h-3.5" />
 <span>Generar orden de acomodo</span>
 </button>
 </div>
 )}
 </div>

 {/* Pending Units Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-3 w-8 text-center">
 <button
 onClick={handleToggleSelectAll}
 className="p-1 rounded text-theme-muted hover:text-theme-main cursor-pointer"
 >
 {selectedUids.length === filteredUnits.length && filteredUnits.length > 0 ? (
 <CheckSquare className="w-4 h-4 text-theme-primary" />
 ) : (
 <Square className="w-4 h-4" />
 )}
 </button>
 </th>
 <th className="py-3 px-3">UID / Serie</th>
 <th className="py-3 px-3">Artículo / SKU</th>
 <th className="py-3 px-3">Marca & Medida</th>
 <th className="py-3 px-3">Lote</th>
 <th className="py-3 px-3">Origen Actual</th>
 <th className="py-3 px-3">Tiempo en Recepción</th>
 <th className="py-3 px-3">Ubicación Sugerida</th>
 <th className="py-3 px-3">Motivo</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Análisis</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredUnits.length === 0 ? (
 <tr>
 <td colSpan={11} className="py-8 text-center text-theme-muted">
 No hay unidades pendientes de acomodo con los filtros seleccionados.
 </td>
 </tr>
 ) : (
 filteredUnits.map((unit) => {
 const isSelected = selectedUids.includes(unit.uid);

 return (
 <tr
 key={unit.uid}
 className={`hover:bg-theme-muted/30 transition-colors ${
 isSelected ? 'bg-theme-primary-light/50' : ''
 }`}
 >
 <td className="py-3.5 px-3 text-center">
 <button
 onClick={() => handleToggleSelectOne(unit.uid)}
 className="p-1 rounded text-theme-muted hover:text-theme-main cursor-pointer"
 >
 {isSelected ? (
 <CheckSquare className="w-4 h-4 text-theme-primary" />
 ) : (
 <Square className="w-4 h-4" />
 )}
 </button>
 </td>
 <td className="py-3.5 px-3 font-mono font-black text-theme-primary whitespace-nowrap">
 {unit.uid}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-extrabold text-theme-main block">{unit.productName}</span>
 <span className="font-mono text-[10px] text-theme-primary">{unit.sku}</span>
 </td>
 <td className="py-3.5 px-3 text-[11px] text-theme-muted whitespace-nowrap">
 <span className="font-semibold text-theme-main">{unit.brand}</span> &bull; {unit.size}
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {unit.lotNumber}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-theme-muted text-theme-primary border border-theme-subtle">
 {unit.sourceLocation}
 </span>
 <span className="text-[9px] text-theme-muted block truncate mt-0.5">{unit.warehouseName}</span>
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 <span className="flex items-center gap-1">
 <Clock className="w-3 h-3 text-amber-500" />
 <span>{unit.timeInReceiving}</span>
 </span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-black bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {unit.suggestedLocation}
 </span>
 </td>
 <td className="py-3.5 px-3 text-[11px] text-theme-muted max-w-[200px] truncate">
 {unit.suggestionReason}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {unit.status}
 </span>
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setAnalysisUnit(unit)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-[11px] font-bold border border-theme-subtle transition-all cursor-pointer inline-flex items-center gap-1"
 >
 <Sparkles className="w-3 h-3 text-amber-500" />
 <span>Ver sugerencia</span>
 </button>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Modal: Suggestion Analysis */}
 {analysisUnit && (
 <PutawaySuggestionAnalysisModal
 unit={analysisUnit}
 onClose={() => setAnalysisUnit(null)}
 />
 )}

 {/* Modal: Create Putaway Order */}
 {isCreateModalOpen && (
 <PutawayOrderCreateModal
 selectedUnits={selectedUnitsObjects}
 warehouseName={activeWarehouseName}
 warehouseId={activeWarehouseId}
 onClose={() => setIsCreateModalOpen(false)}
 onCreateOrder={(newOrder) => {
 setIsCreateModalOpen(false);
 setSelectedUids([]);
 onOrderCreated(newOrder);
 }}
 />
 )}
 </div>
 );
};
