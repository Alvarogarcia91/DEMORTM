import React, { useState } from 'react';
import {
 Search,
 X,
 Plus,
 Filter,
 FileText,
 Building2,
 Calendar,
 User,
 Eye,
 Edit3,
 CheckCircle2,
 AlertTriangle,
 Boxes,
 Truck
} from 'lucide-react';
import {
 Requisition,
 RequisitionStatus,
 DESTINATION_WAREHOUSES
} from '../../../data/mockRequisitionsData';
import { RequisitionStatusBadge } from './RequisitionStatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';

interface RequisitionsListProps {
 requisitions: Requisition[];
 onOpenCreate: () => void;
 onSelectRequisition: (req: Requisition) => void;
 onEditRequisition: (req: Requisition) => void;
}

export const RequisitionsList: React.FC<RequisitionsListProps> = ({
 requisitions,
 onOpenCreate,
 onSelectRequisition,
 onEditRequisition,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
 const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
 const [selectedRequester, setSelectedRequester] = useState<string>('ALL');
 const [showAuthorizedOnly, setShowAuthorizedOnly] = useState(false);
 const [showReadyForPurchaseOnly, setShowReadyForPurchaseOnly] = useState(false);

 // Extract unique requesters
 const requestersList = Array.from(new Set(requisitions.map((r) => r.requester)));

 // Filter requisitions
 const filteredRequisitions = requisitions.filter((req) => {
 // Search query
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

 // Status filter
 if (selectedStatus !== 'ALL' && req.status !== selectedStatus) {
 return false;
 }

 // Warehouse filter
 if (selectedWarehouse !== 'ALL' && req.targetWarehouseId !== selectedWarehouse) {
 return false;
 }

 // Requester filter
 if (selectedRequester !== 'ALL' && req.requester !== selectedRequester) {
 return false;
 }

 // Checkbox: Solo listas para compra
 if (showReadyForPurchaseOnly && req.status !== 'Lista para compra') {
 return false;
 }

 // Checkbox: Mostrar autorizadas
 if (showAuthorizedOnly && req.status !== 'Autorizada' && req.status !== 'Lista para compra') {
 return false;
 }

 return true;
 });

 return (
 <div className="space-y-4">
 
 {/* Search & Filters Toolbar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
 
 {/* Search Box */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar folio, solicitante, artículo, SKU o proveedor..."
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

 {/* Quick Filter Selects */}
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 
 {/* Estado */}
 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Pendiente de autorización">Pendiente de autorización</option>
 <option value="Lista para compra">Lista para compra</option>
 <option value="Convertida en compra">Convertida en compra</option>
 <option value="Autorizada">Autorizada</option>
 <option value="Requiere corrección">Requiere corrección</option>
 <option value="Borrador">Borrador</option>
 <option value="Rechazada">Rechazada</option>
 <option value="Cancelada">Cancelada</option>
 </select>

 {/* Destino */}
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

 {/* Solicitante */}
 <select
 value={selectedRequester}
 onChange={(e) => setSelectedRequester(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los solicitantes</option>
 {requestersList.map((reqName, idx) => (
 <option key={idx} value={reqName}>
 {reqName}
 </option>
 ))}
 </select>

 {/* Button New Requisition */}
 <button
 type="button"
 onClick={onOpenCreate}
 className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto lg:ml-0"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva requisición</span>
 </button>
 </div>
 </div>

 {/* Checkbox Fast Filters */}
 <div className="flex items-center gap-4 pt-2 border-t border-theme-subtle text-xs text-theme-muted flex-wrap">
 <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-theme-main select-none">
 <input
 type="checkbox"
 checked={showAuthorizedOnly}
 onChange={(e) => {
 setShowAuthorizedOnly(e.target.checked);
 if (e.target.checked) setShowReadyForPurchaseOnly(false);
 }}
 className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 <span>Mostrar autorizadas</span>
 </label>

 <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-theme-main select-none">
 <input
 type="checkbox"
 checked={showReadyForPurchaseOnly}
 onChange={(e) => {
 setShowReadyForPurchaseOnly(e.target.checked);
 if (e.target.checked) setShowAuthorizedOnly(false);
 }}
 className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 <span>Solo listas para compra</span>
 </label>

 <span className="text-[11px] text-theme-muted ml-auto font-mono">
 {filteredRequisitions.length} de {requisitions.length} requisiciones
 </span>
 </div>
 </div>

 {/* Requisitions Main Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-3">Solicitante</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3">Fecha Requerida</th>
 <th className="py-3 px-3">Proveedor Sugerido</th>
 <th className="py-3 px-3">Prioridad</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredRequisitions.length === 0 ? (
 <tr>
 <td colSpan={11} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron requisiciones con los criterios seleccionados.
 </td>
 </tr>
 ) : (
 filteredRequisitions.map((req) => {
 const totalUnits = req.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0);
 const isEditable = req.status === 'Borrador' || req.status === 'Requiere corrección';

 return (
 <tr key={req.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Folio */}
 <td className="py-3 px-4 font-mono font-black text-theme-main whitespace-nowrap">
 <div className="flex items-center gap-1.5">
 <span className="hover:underline text-theme-primary cursor-pointer" onClick={() => onSelectRequisition(req)}>
 {req.folio}
 </span>
 {req.hasPendingProductReview && (
 <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Producto no registrado pendiente de revisión" />
 )}
 </div>
 </td>

 {/* Fecha */}
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {req.createdAt}
 </td>

 {/* Solicitante */}
 <td className="py-3 px-3 whitespace-nowrap font-medium text-theme-main">
 {req.requester}
 </td>

 {/* Destino */}
 <td className="py-3 px-3 whitespace-nowrap font-semibold text-theme-main">
 {req.targetWarehouseName}
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
 <td className="py-3 px-3 whitespace-nowrap text-theme-muted max-w-[150px] truncate" title={req.suggestedSupplier || 'Sin asignar'}>
 {req.suggestedSupplier || '—'}
 </td>

 {/* Prioridad */}
 <td className="py-3 px-3 whitespace-nowrap">
 <PriorityBadge priority={req.priority} size="sm" />
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <RequisitionStatusBadge status={req.status} size="sm" />
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 {isEditable && (
 <button
 type="button"
 onClick={() => onEditRequisition(req)}
 className="p-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
 title="Editar requisición"
 >
 <Edit3 className="w-3.5 h-3.5" />
 </button>
 )}

 <button
 type="button"
 onClick={() => onSelectRequisition(req)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Detalle</span>
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

 </div>
 );
};
