import React, { useState, useMemo } from 'react';
import { 
 Search, 
 Filter, 
 Compass, 
 ArrowRight, 
 Calendar, 
 Building2, 
 AlertCircle, 
 X, 
 Layers, 
 CheckCircle2,
 Clock
} from 'lucide-react';
import { PendingPickingDemand, PickOrder } from '../../../data/mockPickingData';
import { PickPlanningWizardModal } from './PickPlanningWizardModal';
import { StatusBadge } from '../../common/StatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';

interface PendingPickDemandsListProps {
 demands: PendingPickingDemand[];
 onOrderCreated: (newOrder: PickOrder) => void;
}

export const PendingPickDemandsList: React.FC<PendingPickDemandsListProps> = ({
 demands,
 onOrderCreated,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
 const [selectedType, setSelectedType] = useState('ALL');
 const [selectedPriority, setSelectedPriority] = useState('ALL');

 // Selected demand for planning modal
 const [planningDemand, setPlanningDemand] = useState<PendingPickingDemand | null>(null);

 const filteredDemands = useMemo(() => {
 return demands.filter((d) => {
 const q = searchQuery.toLowerCase().trim();
 const matchesSearch =
 !q ||
 d.referenceFolio.toLowerCase().includes(q) ||
 d.destinationName.toLowerCase().includes(q) ||
 d.itemsSummary.some(
 (it) => it.sku.toLowerCase().includes(q) || it.productName.toLowerCase().includes(q)
 );

 const matchesWarehouse = selectedWarehouse === 'ALL' || d.warehouseId === selectedWarehouse;
 const matchesType = selectedType === 'ALL' || d.type === selectedType;
 const matchesPriority = selectedPriority === 'ALL' || d.priority === selectedPriority;

 return matchesSearch && matchesWarehouse && matchesType && matchesPriority;
 });
 }, [demands, searchQuery, selectedWarehouse, selectedType, selectedPriority]);

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
 placeholder="Buscar folio, artículo, SKU o destino..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
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
 <option value="ALL">Todos los orígenes</option>
 <option value="wh-mty-norte">CEDIS Monterrey Norte</option>
 <option value="wh-mty-sur">CEDIS Monterrey Sur</option>
 </select>

 <select
 value={selectedType}
 onChange={(e) => setSelectedType(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los tipos</option>
 <option value="Orden de Traspaso">Orden de Traspaso</option>
 <option value="Pedido de Cliente">Pedido de Cliente</option>
 <option value="Surtido Interno">Surtido Interno</option>
 </select>

 <select
 value={selectedPriority}
 onChange={(e) => setSelectedPriority(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las prioridades</option>
 <option value="Alta">Alta</option>
 <option value="Urgente">Urgente</option>
 <option value="Normal">Normal</option>
 </select>
 </div>
 </div>
 </div>

 {/* Demands Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Referencia</th>
 <th className="py-3 px-3">Tipo</th>
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3">Artículos</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3">Prioridad</th>
 <th className="py-3 px-3">Fecha Requerida</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredDemands.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-8 text-center text-theme-muted">
 No hay necesidades pendientes de planeación con los filtros actuales.
 </td>
 </tr>
 ) : (
 filteredDemands.map((demand) => {
 return (
 <tr key={demand.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {demand.referenceFolio}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {demand.type}
 </span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap font-bold text-theme-main">
 {demand.warehouseName}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-extrabold text-theme-main block">{demand.destinationName}</span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-semibold text-theme-main">{demand.articlesCount} artículos</span>
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {demand.totalUnits} u.
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <PriorityBadge priority={demand.priority} size="sm" />
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {demand.requiredDate}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <StatusBadge variant="warning" label={demand.status} size="sm" />
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setPlanningDemand(demand)}
 className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Compass className="w-3.5 h-3.5" />
 <span>Planear recolección</span>
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

 {/* Modal: Planning Wizard */}
 {planningDemand && (
 <PickPlanningWizardModal
 demand={planningDemand}
 onClose={() => setPlanningDemand(null)}
 onCreateOrder={(newOrder) => {
 setPlanningDemand(null);
 onOrderCreated(newOrder);
 }}
 />
 )}
 </div>
 );
};
