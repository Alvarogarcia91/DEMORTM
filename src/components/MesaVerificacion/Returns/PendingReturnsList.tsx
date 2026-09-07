import React, { useState } from 'react';
import { 
 Search, 
 Plus, 
 RotateCcw, 
 Filter, 
 Clock, 
 ArrowRight, 
 PackageCheck, 
 CheckCircle2, 
 AlertTriangle, 
 Building2, 
 FileText 
} from 'lucide-react';
import { 
 ReturnOrder, 
 ReturnSourceType, 
 ReturnReason 
} from '../../../data/mockReturnsData';

interface PendingReturnsListProps {
 orders: ReturnOrder[];
 onSelectOrder: (order: ReturnOrder) => void;
 onOpenCreateModal: () => void;
 onOpenReceiveStation: (order: ReturnOrder) => void;
}

export const PendingReturnsList: React.FC<PendingReturnsListProps> = ({
 orders,
 onSelectOrder,
 onOpenCreateModal,
 onOpenReceiveStation,
}) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [sourceFilter, setSourceFilter] = useState<string>('all');
 const [reasonFilter, setReasonFilter] = useState<string>('all');
 const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

 // Filter pending / active returns
 const pendingOrders = orders.filter(
 (o) => o.status === 'Pendiente' || o.status === 'En recepción' || o.status === 'Parcial'
 );

 const filteredOrders = pendingOrders.filter((o) => {
 const matchSearch =
 !searchTerm ||
 o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.originClientOrBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.items.some((i) =>
 i.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.sku.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const matchSource = sourceFilter === 'all' || o.sourceType === sourceFilter;
 const matchReason = reasonFilter === 'all' || o.reason === reasonFilter;
 const matchWh = warehouseFilter === 'all' || o.warehouseId === warehouseFilter;

 return matchSearch && matchSource && matchReason && matchWh;
 });

 return (
 <div className="space-y-4">
 
 {/* Search & Actions Toolbar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
 
 {/* Search bar */}
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar folio, UID, artículo, referencia u origen..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-2xl pl-10 pr-4 py-2 text-xs text-theme-main font-semibold focus:outline-none"
 />
 </div>

 {/* Filters & Create Button */}
 <div className="flex flex-wrap items-center gap-2">
 {/* Origin Source Filter */}
 <select
 value={sourceFilter}
 onChange={(e) => setSourceFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="all">Todos los orígenes</option>
 <option value="Cliente">Cliente</option>
 <option value="Sucursal">Sucursal</option>
 <option value="Entrega rechazada">Entrega rechazada</option>
 <option value="Interna">Interna</option>
 </select>

 {/* Warehouse Filter */}
 <select
 value={warehouseFilter}
 onChange={(e) => setWarehouseFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="all">Todos los CEDIS</option>
 <option value="wh-mty-norte">Almacén Materia Prima</option>
 <option value="wh-mty-sur">Almacén Producto Terminado</option>
 </select>

 {/* Reason Filter */}
 <select
 value={reasonFilter}
 onChange={(e) => setReasonFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="all">Todos los motivos</option>
 <option value="Empaque dañado">Empaque dañado</option>
 <option value="Daño visible">Daño visible</option>
 <option value="Producto incorrecto">Producto incorrecto</option>
 <option value="Entrega rechazada">Entrega rechazada</option>
 <option value="Cambio solicitado">Cambio solicitado</option>
 </select>

 {/* Create New Return */}
 <button
 type="button"
 onClick={onOpenCreateModal}
 className="px-4 py-2 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva devolución</span>
 </button>
 </div>
 </div>
 </div>

 {/* Table of Pending Returns */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-xs overflow-hidden">
 <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Clock className="w-4 h-4 text-amber-500" />
 <h3 className="text-sm font-extrabold text-theme-main">
 Devoluciones Pendientes por Recibir
 </h3>
 </div>
 <span className="text-xs font-mono font-bold text-theme-muted">
 {filteredOrders.length} orden(es)
 </span>
 </div>

 {filteredOrders.length === 0 ? (
 <div className="p-12 text-center text-xs text-theme-muted space-y-1">
 <RotateCcw className="w-8 h-8 mx-auto opacity-30 text-theme-primary mb-2" />
 <p className="font-bold text-theme-main">No hay devoluciones pendientes con los filtros aplicados</p>
 <p>Puedes registrar una nueva solicitud con el botón superior.</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[9px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Referencia</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-2 text-center">Unidades</th>
 <th className="py-3 px-3">Motivo</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-2 text-center">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.map((order) => {
 const pendingUnits = order.items.filter((i) => i.status === 'Pendiente').length;
 return (
 <tr
 key={order.id}
 className="hover:bg-theme-muted/30 transition-colors cursor-pointer"
 onClick={() => onSelectOrder(order)}
 >
 {/* Folio */}
 <td className="py-3.5 px-4">
 <strong className="font-mono text-theme-primary block text-xs font-bold">
 {order.folio}
 </strong>
 <span className="text-[10px] text-theme-muted truncate block max-w-xs">
 {order.originClientOrBranch}
 </span>
 </td>

 {/* Origen */}
 <td className="py-3.5 px-3">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {order.sourceType}
 </span>
 </td>

 {/* Referencia */}
 <td className="py-3.5 px-3 font-mono font-bold text-theme-main text-xs">
 {order.reference}
 </td>

 {/* Destino */}
 <td className="py-3.5 px-3 text-theme-muted text-xs">
 {order.warehouseName}
 </td>

 {/* Unidades */}
 <td className="py-3.5 px-2 text-center font-mono font-bold text-xs text-theme-main">
 {order.items.length} {order.items.length === 1 ? 'unidad' : 'unidades'}
 </td>

 {/* Motivo */}
 <td className="py-3.5 px-3">
 <span className="text-xs font-semibold text-theme-primary">
 {order.reason}
 </span>
 </td>

 {/* Fecha */}
 <td className="py-3.5 px-3 text-theme-muted font-mono text-[11px]">
 {order.createdAt}
 </td>

 {/* Estado */}
 <td className="py-3.5 px-2 text-center">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {order.status}
 </span>
 </td>

 {/* Acción */}
 <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
 <button
 type="button"
 onClick={() => onOpenReceiveStation(order)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
 >
 <PackageCheck className="w-3.5 h-3.5" />
 <span>Recibir</span>
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>

 </div>
 );
};
