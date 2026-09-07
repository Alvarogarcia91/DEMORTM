import React, { useState } from 'react';
import {
 Search,
 X,
 Building2,
 Calendar,
 User,
 Truck,
 Plus,
 FileText,
 AlertTriangle,
 Eye,
 ShoppingBag,
 ArrowRight,
 Boxes,
 CheckCircle2
} from 'lucide-react';
import { Requisition, DESTINATION_WAREHOUSES } from '../../../data/mockRequisitionsData';
import { RequisitionDetailModal } from '../Requisiciones/RequisitionDetailModal';
import { PriorityBadge } from '../../common/PriorityBadge';

interface PorComprarListProps {
 requisitions: Requisition[];
 onOpenCreateOrderWizard: (req: Requisition, selectedItemIds?: string[]) => void;
 onUpdateRequisition?: (updated: Requisition) => void;
}

export const PorComprarList: React.FC<PorComprarListProps> = ({
 requisitions,
 onOpenCreateOrderWizard,
 onUpdateRequisition,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
 const [detailedRequisition, setDetailedRequisition] = useState<Requisition | null>(null);

 // Filter only requisitions with status "Lista para compra"
 const readyRequisitions = requisitions.filter((r) => r.status === 'Lista para compra');

 const filteredRequisitions = readyRequisitions.filter((req) => {
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const matchFolio = req.folio.toLowerCase().includes(q);
 const matchRequester = req.requester.toLowerCase().includes(q);
 const matchSupplier = req.suggestedSupplier?.toLowerCase().includes(q);
 const matchTarget = req.targetWarehouseName.toLowerCase().includes(q);
 const matchItem = req.items.some(
 (it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
 );

 if (!matchFolio && !matchRequester && !matchSupplier && !matchTarget && !matchItem) {
 return false;
 }
 }

 if (selectedWarehouse !== 'ALL' && req.targetWarehouseId !== selectedWarehouse) {
 return false;
 }

 return true;
 });

 const totalPendingUnits = readyRequisitions.reduce(
 (acc, r) => acc + r.items.reduce((sub, i) => sub + (Number(i.quantity) || 0), 0),
 0
 );

 return (
 <div className="space-y-4">
 
 {/* Informative Banner */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 dark:text-emerald-400 border border-emerald-600 shadow-2xs flex items-center justify-center font-bold text-xs">
 <CheckCircle2 className="w-4 h-4" />
 </div>
 <h3 className="text-sm font-black text-theme-main">
 Requisiciones Listas para Compra
 </h3>
 </div>
 <p className="text-xs text-theme-muted">
 Solicitudes internas que han sido formalmente autorizadas y están listas para consolidarse en Órdenes de Compra.
 </p>
 </div>

 <div className="flex items-center gap-2 text-xs">
 <span className="px-3.5 py-1.5 rounded-xl font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 {readyRequisitions.length} requisiciones pendientes de compra
 </span>
 <span className="px-3.5 py-1.5 rounded-xl font-mono font-bold bg-theme-muted text-theme-muted">
 {totalPendingUnits} unidades en espera
 </span>
 </div>
 </div>

 {/* Search & Filter Toolbar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar por folio, solicitante, artículo, SKU, proveedor sugerido..."
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

 <select
 value={selectedWarehouse}
 onChange={(e) => setSelectedWarehouse(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer w-full sm:w-auto"
 >
 <option value="ALL">Todos los destinos</option>
 {DESTINATION_WAREHOUSES.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name}
 </option>
 ))}
 </select>
 </div>

 {/* Main Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Requisición</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3">Solicitante</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3">Fecha Requerida</th>
 <th className="py-3 px-3">Proveedor Sugerido</th>
 <th className="py-3 px-3">Prioridad</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredRequisitions.length === 0 ? (
 <tr>
 <td colSpan={9} className="py-12 text-center text-theme-muted">
 <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40 text-theme-muted" />
 <p className="font-semibold text-xs text-theme-main">No hay requisiciones pendientes de compra.</p>
 <p className="text-[11px]">Todas las solicitudes autorizadas han sido consolidadas o no coinciden con los filtros.</p>
 </td>
 </tr>
 ) : (
 filteredRequisitions.map((req) => {
 const totalUnits = req.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0);

 return (
 <tr key={req.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Requisicion */}
 <td className="py-3 px-4 font-mono font-black text-theme-main whitespace-nowrap">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setDetailedRequisition(req)}
 className="hover:underline text-rose-600 font-mono text-left cursor-pointer"
 >
 {req.folio}
 </button>
 {req.purchaseOrderCoverage && (
 <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {req.purchaseOrderCoverage.coveredItems}/{req.purchaseOrderCoverage.totalItems} atendidas
 </span>
 )}
 </div>
 </td>

 {/* Destino */}
 <td className="py-3 px-3 whitespace-nowrap font-semibold text-theme-main">
 {req.targetWarehouseName}
 </td>

 {/* Solicitante */}
 <td className="py-3 px-3 whitespace-nowrap text-theme-main">
 {req.requester}
 </td>

 {/* Articulos */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
 {req.items.length}
 </td>

 {/* Unidades */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-black text-rose-600">
 {totalUnits}
 </td>

 {/* Fecha requerida */}
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {req.requiredDate}
 </td>

 {/* Proveedor sugerido */}
 <td className="py-3 px-3 whitespace-nowrap text-theme-muted truncate max-w-[150px]" title={req.suggestedSupplier || 'Sin asignar'}>
 {req.suggestedSupplier || '—'}
 </td>

 {/* Prioridad */}
 <td className="py-3 px-3 whitespace-nowrap">
 <PriorityBadge priority={req.priority} size="sm" />
 </td>

 {/* Accion */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 type="button"
 onClick={() => setDetailedRequisition(req)}
 className="p-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
 title="Ver detalle completo de requisición"
 >
 <Eye className="w-3.5 h-3.5" />
 </button>

 <button
 type="button"
 onClick={() => setDetailedRequisition(req)}
 className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <ShoppingBag className="w-3.5 h-3.5" />
 <span>Atender requisición</span>
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Requisition Detailed Decision-Making Modal */}
 {detailedRequisition && (
 <RequisitionDetailModal
 requisition={detailedRequisition}
 onClose={() => setDetailedRequisition(null)}
 onUpdateRequisition={(updated) => {
 if (onUpdateRequisition) onUpdateRequisition(updated);
 setDetailedRequisition(updated);
 }}
 onCreatePurchaseOrder={(req, selectedItemIds) => {
 setDetailedRequisition(null);
 onOpenCreateOrderWizard(req, selectedItemIds);
 }}
 />
 )}

 </div>
 );
};
