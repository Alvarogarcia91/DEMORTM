import React, { useState } from 'react';
import { 
 Search, 
 PackageSearch, 
 Calendar, 
 Building2, 
 Eye, 
 CheckCircle2, 
 X,
 Compass,
 ArrowRight
} from 'lucide-react';
import { PickOrder } from '../../../data/mockPickingData';
import { StatusBadge } from '../../common/StatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';

interface PickOrderListProps {
 orders: PickOrder[];
 onSelectOrder: (order: PickOrder) => void;
}

export const PickOrderList: React.FC<PickOrderListProps> = ({
 orders,
 onSelectOrder,
}) => {
 const [searchQuery, setSearchQuery] = useState('');

 const filteredOrders = orders.filter((o) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 o.folio.toLowerCase().includes(q) ||
 o.referenceFolio.toLowerCase().includes(q) ||
 o.warehouseName.toLowerCase().includes(q) ||
 o.destinationName.toLowerCase().includes(q) ||
 o.operatorAssigned.toLowerCase().includes(q) ||
 o.stops.some((st) => st.uid.toLowerCase().includes(q) || st.sku.toLowerCase().includes(q))
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
 placeholder="Buscar orden de recolección por folio, referencia, destino o UID..."
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
 </div>

 {/* Orders Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Referencia</th>
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3">Estrategia</th>
 <th className="py-3 px-3 text-center">Unidades</th>
 <th className="py-3 px-3 text-center">Progreso</th>
 <th className="py-3 px-3">Prioridad</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-8 text-center text-theme-muted">
 No se encontraron órdenes de recolección registradas.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order) => {
 return (
 <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {order.folio}
 </td>
 <td className="py-3.5 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {order.referenceFolio}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap font-bold text-theme-main">
 {order.warehouseName}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap font-extrabold text-theme-main">
 {order.destinationName}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <StatusBadge variant="smart" label={order.strategyName} size="sm" />
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {order.totalUnits} u.
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
 {order.pickedUnits} / {order.totalUnits}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <PriorityBadge priority={order.priority} size="sm" />
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
