import React, { useState } from 'react';
import { 
 Search, 
 RotateCcw, 
 Eye, 
 Clock, 
 CheckCircle2, 
 AlertTriangle, 
 Filter 
} from 'lucide-react';
import { ReturnOrder } from '../../../data/mockReturnsData';
import { StatusBadge } from '../../common/StatusBadge';

interface ReturnOrdersListProps {
 orders: ReturnOrder[];
 onSelectOrder: (order: ReturnOrder) => void;
}

export const ReturnOrdersList: React.FC<ReturnOrdersListProps> = ({
 orders,
 onSelectOrder,
}) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [statusFilter, setStatusFilter] = useState<string>('all');
 const [warehouseFilter, setWarehouseFilter] = useState<string>('all');

 const filteredOrders = orders.filter((o) => {
 const matchSearch =
 !searchTerm ||
 o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.originClientOrBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.items.some((i) =>
 i.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.productName.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const matchStatus = statusFilter === 'all' || o.status === statusFilter;
 const matchWh = warehouseFilter === 'all' || o.warehouseId === warehouseFilter;

 return matchSearch && matchStatus && matchWh;
 });

 const getStatusBadge = (status: ReturnOrder['status']) => {
 switch (status) {
 case 'Completa':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'En recepción':
 case 'Parcial':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'Cancelada':
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 case 'Con incidencia':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 }
 };

 return (
 <div className="space-y-4">
 
 {/* Search & Filters */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por folio, UID, cliente, sucursal..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-2xl pl-10 pr-4 py-2 text-xs text-theme-main font-semibold focus:outline-none"
 />
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="all">Todos los estados</option>
 <option value="Pendiente">Pendiente</option>
 <option value="Parcial">Parcial</option>
 <option value="Completa">Completa</option>
 <option value="Cancelada">Cancelada</option>
 </select>

 <select
 value={warehouseFilter}
 onChange={(e) => setWarehouseFilter(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="all">Todos los CEDIS</option>
 <option value="wh-mty-norte">CEDIS Monterrey Norte</option>
 <option value="wh-mty-sur">CEDIS Monterrey Sur</option>
 </select>
 </div>
 </div>
 </div>

 {/* Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-xs overflow-hidden">
 <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
 <h3 className="text-sm font-extrabold text-theme-main">
 Histórico Consolidado de Devoluciones
 </h3>
 <span className="text-xs font-mono font-bold text-theme-muted">
 {filteredOrders.length} registros
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[9px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Referencia</th>
 <th className="py-3 px-2 text-center">Unidades</th>
 <th className="py-3 px-3">Condición</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-2 text-center">Estado</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.map((order) => {
 const mainCondition = order.items[0]?.condition || 'Pendiente de evaluación';
 const mainDest = order.items[0]?.confirmedDestination || order.items[0]?.suggestedDestination || '—';

 return (
 <tr
 key={order.id}
 className="hover:bg-theme-muted/30 transition-colors cursor-pointer"
 onClick={() => onSelectOrder(order)}
 >
 <td className="py-3.5 px-4">
 <strong className="font-mono text-rose-600 block text-xs font-bold">
 {order.folio}
 </strong>
 <span className="text-[10px] text-theme-muted truncate block max-w-xs">
 {order.originClientOrBranch}
 </span>
 </td>

 <td className="py-3.5 px-3">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {order.sourceType}
 </span>
 </td>

 <td className="py-3.5 px-3 font-mono font-bold text-theme-main text-xs">
 {order.reference}
 </td>

 <td className="py-3.5 px-2 text-center font-mono font-bold text-xs text-theme-main">
 {order.items.length}
 </td>

 <td className="py-3.5 px-3 text-xs font-medium text-theme-main">
 {mainCondition}
 </td>

 <td className="py-3.5 px-3 font-mono font-bold text-xs text-theme-main">
 {mainDest}
 </td>

 <td className="py-3.5 px-2 text-center">
 <StatusBadge
 variant={
 order.status === 'Completa'
 ? 'success'
 : order.status === 'Parcial'
 ? 'correction'
 : order.status === 'Con incidencia'
 ? 'danger'
 : order.status === 'Cancelada'
 ? 'neutral'
 : 'warning'
 }
 label={order.status}
 size="sm"
 />
 </td>

 <td className="py-3.5 px-3 text-theme-muted font-mono text-[11px]">
 {order.createdAt}
 </td>

 <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
 <button
 type="button"
 onClick={() => onSelectOrder(order)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer inline-flex items-center gap-1"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Ver</span>
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 );
};
