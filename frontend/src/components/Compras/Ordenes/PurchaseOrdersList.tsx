import React, { useState } from 'react';
import {
 Search,
 X,
 Building2,
 Calendar,
 Truck,
 Eye,
 DollarSign,
 AlertTriangle,
 Boxes,
 Clock,
 CheckCircle2,
 FileText
} from 'lucide-react';
import {
 PurchaseOrder,
 PurchaseOrderStatus,
 MOCK_SUPPLIERS
} from '../../../data/mockPurchasesOrdersData';
import { DESTINATION_WAREHOUSES } from '../../../data/mockRequisitionsData';
import { PurchaseOrderStatusBadge } from './PurchaseOrderStatusBadge';

interface PurchaseOrdersListProps {
 orders: PurchaseOrder[];
 onSelectOrder: (order: PurchaseOrder) => void;
}

export const PurchaseOrdersList: React.FC<PurchaseOrdersListProps> = ({
 orders,
 onSelectOrder,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
 const [selectedSupplier, setSelectedSupplier] = useState<string>('ALL');
 const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
 const [showPendingOnly, setShowPendingOnly] = useState(false);
 const [showDelayedOnly, setShowDelayedOnly] = useState(false);

 // Filter Purchase Orders
 const filteredOrders = orders.filter((order) => {
 // Search query
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const matchFolio = order.folio.toLowerCase().includes(q);
 const matchSupplier = order.supplierName.toLowerCase().includes(q) || order.supplierTradeName.toLowerCase().includes(q);
 const matchTarget = order.targetWarehouseName.toLowerCase().includes(q);
 const matchReq = order.requisitionFolio?.toLowerCase().includes(q);
 const matchItem = order.items.some(
 (it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q)
 );

 if (!matchFolio && !matchSupplier && !matchTarget && !matchReq && !matchItem) {
 return false;
 }
 }

 // Status filter
 if (selectedStatus !== 'ALL' && order.status !== selectedStatus) {
 return false;
 }

 // Supplier filter
 if (selectedSupplier !== 'ALL' && order.supplierId !== selectedSupplier) {
 return false;
 }

 // Destination filter
 if (selectedWarehouse !== 'ALL' && order.targetWarehouseId !== selectedWarehouse) {
 return false;
 }

 // Checkbox: Solo pendientes de recibir
 if (showPendingOnly) {
 const isPending =
 order.status === 'Emitida' ||
 order.status === 'Confirmada por proveedor' ||
 order.status === 'En tránsito' ||
 order.status === 'Parcialmente recibida' ||
 order.status === 'Atrasada';
 if (!isPending) return false;
 }

 // Checkbox: Solo atrasadas
 if (showDelayedOnly && order.status !== 'Atrasada') {
 return false;
 }

 return true;
 });

 return (
 <div className="space-y-4">
 
 {/* Search & Filter Toolbar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
 
 {/* Search Box */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar OC, proveedor, artículo, SKU o destino..."
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
 
 {/* Estado */}
 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Borrador">Borrador</option>
 <option value="Emitida">Emitida</option>
 <option value="Confirmada por proveedor">Confirmada por proveedor</option>
 <option value="En tránsito">En tránsito</option>
 <option value="Parcialmente recibida">Parcialmente recibida</option>
 <option value="Recibida">Recibida</option>
 <option value="Atrasada">Atrasada</option>
 <option value="Cancelada">Cancelada</option>
 </select>

 {/* Proveedor */}
 <select
 value={selectedSupplier}
 onChange={(e) => setSelectedSupplier(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los proveedores</option>
 {MOCK_SUPPLIERS.map((sup) => (
 <option key={sup.id} value={sup.id}>
 {sup.tradeName}
 </option>
 ))}
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
 </div>
 </div>

 {/* Checkbox Fast Filters */}
 <div className="flex items-center gap-4 pt-2 border-t border-theme-subtle text-xs text-theme-muted flex-wrap">
 <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-theme-main select-none">
 <input
 type="checkbox"
 checked={showPendingOnly}
 onChange={(e) => {
 setShowPendingOnly(e.target.checked);
 if (e.target.checked) setShowDelayedOnly(false);
 }}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 <span>Solo pendientes de recibir</span>
 </label>

 <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-theme-main select-none">
 <input
 type="checkbox"
 checked={showDelayedOnly}
 onChange={(e) => {
 setShowDelayedOnly(e.target.checked);
 if (e.target.checked) setShowPendingOnly(false);
 }}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 <span>Solo atrasadas</span>
 </label>

 <span className="text-[11px] text-theme-muted ml-auto font-mono">
 {filteredOrders.length} de {orders.length} órdenes de compra
 </span>
 </div>
 </div>

 {/* Main Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-3">Proveedor</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3">Total (MXN)</th>
 <th className="py-3 px-3">Fecha Emisión</th>
 <th className="py-3 px-3">Fecha Esperada</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-3 text-center">Recepción</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron órdenes de compra con los filtros seleccionados.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order) => {
 const totalOrdered = order.items.reduce((acc, i) => acc + i.orderedQuantity, 0);
 const totalReceived = order.items.reduce((acc, i) => acc + i.receivedQuantity, 0);

 return (
 <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Folio */}
 <td className="py-3 px-4 font-mono font-black text-theme-main whitespace-nowrap">
 <button
 type="button"
 onClick={() => onSelectOrder(order)}
 className="hover:underline text-theme-primary font-mono text-left cursor-pointer"
 >
 {order.folio}
 </button>
 </td>

 {/* Proveedor */}
 <td className="py-3 px-3 whitespace-nowrap">
 <strong className="text-xs font-bold text-theme-main block">
 {order.supplierTradeName}
 </strong>
 <span className="text-[10px] text-theme-muted font-mono block">
 {order.supplierRfc}
 </span>
 </td>

 {/* Destino */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="font-semibold text-theme-main block">
 {order.targetWarehouseName}
 </span>
 <span className="text-[10px] text-theme-muted block">
 ({order.targetWarehouseType})
 </span>
 </td>

 {/* Artículos */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
 {order.items.length}
 </td>

 {/* Total */}
 <td className="py-3 px-3 whitespace-nowrap font-mono font-black text-theme-main">
 ${order.total.toLocaleString('es-MX')}
 </td>

 {/* Fecha Emisión */}
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {order.emissionDate || 'Borrador'}
 </td>

 {/* Fecha Esperada */}
 <td className="py-3 px-3 font-mono text-theme-main font-semibold whitespace-nowrap">
 {order.expectedDeliveryDate}
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <PurchaseOrderStatusBadge status={order.status} delayDays={order.delayDays} size="sm" />
 </td>

 {/* Recepción */}
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
 totalReceived === totalOrdered && totalOrdered > 0
 ? 'bg-theme-surface text-emerald-950 dark:text-emerald-200 border-emerald-500/35'
 : totalReceived > 0
 ? 'bg-theme-surface text-orange-950 dark:text-orange-200 border-orange-500/35'
 : 'bg-theme-surface text-theme-muted border-theme-subtle'
 }`}>
 {totalReceived} / {totalOrdered}
 </span>
 </td>

 {/* Acción */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <button
 type="button"
 onClick={() => onSelectOrder(order)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1 cursor-pointer ml-auto"
 >
 <Eye className="w-3.5 h-3.5" />
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
