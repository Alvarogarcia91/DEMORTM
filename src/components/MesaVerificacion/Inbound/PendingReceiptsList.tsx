import React, { useState, useMemo } from 'react';
import { 
 Search, 
 Building2, 
 Calendar, 
 Truck, 
 Boxes, 
 CheckCircle2, 
 AlertTriangle, 
 ArrowRight, 
 X,
 Clock,
 ExternalLink,
 Tag
} from 'lucide-react';
import { InboundReceiptOrder } from '../../../data/mockInboundData';
import { StatusBadge } from '../../common/StatusBadge';

interface PendingReceiptsListProps {
 orders: InboundReceiptOrder[];
 onSelectOrder: (order: InboundReceiptOrder) => void;
}

export const PendingReceiptsList: React.FC<PendingReceiptsListProps> = ({
 orders,
 onSelectOrder,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedStatus, setSelectedStatus] = useState('ALL');
 const [selectedSupplier, setSelectedSupplier] = useState('ALL');

 // Extract unique suppliers for filter
 const suppliersList = useMemo(() => {
 return Array.from(new Set(orders.map((o) => o.originName)));
 }, [orders]);

 // Filter and Sort orders
 const filteredAndSortedOrders = useMemo(() => {
 const filtered = orders.filter((order) => {
 // Search query
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase().trim();
 const matchesFolio = order.folio.toLowerCase().includes(q);
 const matchesOrigin = order.originName.toLowerCase().includes(q);
 const matchesRef = order.referenceFolio?.toLowerCase().includes(q);
 const matchesLine = order.lines.some(
 (l) => l.sku.toLowerCase().includes(q) || l.productName.toLowerCase().includes(q)
 );

 if (!matchesFolio && !matchesOrigin && !matchesRef && !matchesLine) {
 return false;
 }
 }

 // Status filter
 if (selectedStatus !== 'ALL') {
 if (selectedStatus === 'Atrasada' && !order.status.includes('Atrasada') && order.status !== 'Parcial') {
 return false;
 }
 if (selectedStatus !== 'Atrasada' && order.status !== selectedStatus) {
 return false;
 }
 }

 // Supplier filter
 if (selectedSupplier !== 'ALL' && order.originName !== selectedSupplier) {
 return false;
 }

 return true;
 });

 // Sorting: 1) Atrasadas, 2) Expected delivery date, 3) Others
 return filtered.sort((a, b) => {
 const isDelayedA = a.expectedDate.includes('25 Ago') || a.status === 'Parcial' && a.totalReceivedUnits === 0;
 const isDelayedB = b.expectedDate.includes('25 Ago') || b.status === 'Parcial' && b.totalReceivedUnits === 0;
 if (isDelayedA && !isDelayedB) return -1;
 if (!isDelayedA && isDelayedB) return 1;
 return a.expectedDate.localeCompare(b.expectedDate);
 });
 }, [orders, searchQuery, selectedStatus, selectedSupplier]);

 return (
 <div className="space-y-4 animate-in fade-in duration-150">
 
 {/* Top Banner Notice */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="space-y-0.5">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Truck className="w-4 h-4 text-rose-600" />
 <span>Compras por Recibir en CEDIS</span>
 </h3>
 <p className="text-xs text-theme-muted">
 Órdenes de compra emitidas y en tránsito listas para validación física, escaneo y serialización individual de unidades / bobinas al arribo.
 </p>
 </div>
 <div className="text-xs font-mono font-bold text-rose-600 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 self-start sm:self-auto whitespace-nowrap">
 {filteredAndSortedOrders.length} compras pendientes
 </div>
 </div>

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
 placeholder="Buscar por Orden de Compra (ej. OC-2026-0081), proveedor, artículo o SKU..."
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

 {/* Filters */}
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 {/* Supplier Filter */}
 <select
 value={selectedSupplier}
 onChange={(e) => setSelectedSupplier(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los proveedores</option>
 {suppliersList.map((sup) => (
 <option key={sup} value={sup}>
 {sup}
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
 <option value="En recepción">En recepción</option>
 <option value="Parcial">Parcial</option>
 <option value="Pendiente">Pendiente</option>
 <option value="Atrasada">Atrasadas</option>
 </select>
 </div>
 </div>
 </div>

 {/* Orders Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Orden de compra</th>
 <th className="py-3 px-3">Proveedor</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3">Fecha esperada</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3 text-center">Ordenadas</th>
 <th className="py-3 px-3 text-center">Recibidas</th>
 <th className="py-3 px-3 text-center">Pendientes</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredAndSortedOrders.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-12 text-center text-theme-muted text-xs">
 No hay órdenes de compra pendientes por recibir para este CEDIS.
 </td>
 </tr>
 ) : (
 filteredAndSortedOrders.map((order) => {
 const isDelayed = order.expectedDate.includes('25 Ago');

 return (
 <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Orden de compra Folio */}
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 <span className="block">{order.folio}</span>
 {order.referenceFolio && (
 <span className="text-[10px] text-theme-muted font-normal block font-sans">
 {order.referenceFolio}
 </span>
 )}
 </td>

 {/* Proveedor */}
 <td className="py-3.5 px-3 whitespace-nowrap">
 <strong className="font-extrabold text-theme-main block">
 {order.originName}
 </strong>
 {order.supplierRfc && (
 <span className="text-[10px] text-theme-muted font-mono block">
 {order.supplierRfc}
 </span>
 )}
 </td>

 {/* Destino */}
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-bold text-theme-main block">
 {order.destinationWarehouseName}
 </span>
 <span className="text-[10px] text-rose-600 font-mono font-bold">
 Rampa {order.receivingAreaCode}
 </span>
 </td>

 {/* Fecha esperada */}
 <td className="py-3.5 px-3 font-mono text-theme-muted whitespace-nowrap">
 <div className="flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5 text-theme-muted" />
 <span>{order.expectedDate}</span>
 </div>
 </td>

 {/* Artículos */}
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {order.lines.length} {order.lines.length === 1 ? 'artículo' : 'artículos'}
 </td>

 {/* Ordenadas */}
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {order.totalExpectedUnits} u.
 </td>

 {/* Recibidas */}
 <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">
 {order.totalReceivedUnits} u.
 </td>

 {/* Pendientes */}
 <td className="py-3.5 px-3 text-center font-mono font-black text-rose-600 whitespace-nowrap">
 {order.totalPendingUnits} u.
 </td>

 {/* Estado */}
 <td className="py-3.5 px-3 whitespace-nowrap">
 {isDelayed ? (
 <StatusBadge
 variant="danger"
 label="Atrasada · 2 días"
 icon={Clock}
 size="sm"
 />
 ) : (
 <StatusBadge
 variant={
 order.status === 'Completa'
 ? 'success'
 : order.status === 'En recepción'
 ? 'info'
 : order.status === 'Parcial'
 ? 'correction'
 : 'warning'
 }
 label={order.status === 'En recepción' ? 'En tránsito' : order.status}
 size="sm"
 />
 )}
 </td>

 {/* Acción */}
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 type="button"
 onClick={() => onSelectOrder(order)}
 className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <span>Abrir recepción</span>
 <ArrowRight className="w-3.5 h-3.5" />
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
