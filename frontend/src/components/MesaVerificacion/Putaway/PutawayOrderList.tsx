import React, { useState } from 'react';
import { 
 Search, 
 ArrowRightLeft, 
 Calendar, 
 Building2, 
 Eye, 
 CheckCircle2, 
 X,
 Layers,
 ArrowRight
} from 'lucide-react';
import { PutawayOrder } from '../../../data/mockPutawayData';
import { StatusBadge } from '../../common/StatusBadge';

interface PutawayOrderListProps {
 orders: PutawayOrder[];
 onSelectOrder: (order: PutawayOrder) => void;
}

export const PutawayOrderList: React.FC<PutawayOrderListProps> = ({
 orders,
 onSelectOrder,
}) => {
 const [searchQuery, setSearchQuery] = useState('');

 const filteredOrders = orders.filter((o) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 o.folio.toLowerCase().includes(q) ||
 o.warehouseName.toLowerCase().includes(q) ||
 o.operatorAssigned.toLowerCase().includes(q) ||
 o.items.some((it) => it.uid.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
 );
 });

 return (
 <div className="space-y-4">
 {/* Search Bar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs">
 <div className="relative w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar por folio de acomodo, CEDIS o UID..."
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
 </div>

 {/* Orders Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Instalación</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3 text-center">Completadas</th>
 <th className="py-3 px-3 text-center">Pendientes</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-8 text-center text-theme-muted">
 No se encontraron órdenes de acomodo registradas.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order) => {
 return (
 <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {order.folio}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-bold text-theme-main block">{order.warehouseName}</span>
 <span className="text-[10px] text-theme-muted">{order.operatorAssigned}</span>
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {order.totalUnits} u.
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
 {order.completedUnits} u.
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-bold whitespace-nowrap">
 <span className={order.pendingUnits === 0 ? 'text-emerald-600' : 'text-rose-600'}>
 {order.pendingUnits} u.
 </span>
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {order.createdAt}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 order.status === 'Completa'
 ? 'success'
 : order.status === 'En proceso'
 ? 'info'
 : 'neutral'
 }
 label={order.status}
 size="sm"
 />
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => onSelectOrder(order)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5 text-theme-primary" />
 <span>Detalle</span>
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
 </div>
 );
};
