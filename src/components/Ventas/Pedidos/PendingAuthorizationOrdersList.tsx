import React, { useState } from 'react';
import {
 Search,
 Eye,
 CheckCircle2,
 AlertTriangle,
 XCircle,
 FileText,
 ShoppingBag,
 UserCheck
} from 'lucide-react';
import { SalesOrder } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import {
  formatCurrencyMXN,
  formatPercentage,
  formatDateMX,
} from '../../../utils/formatters';

interface PendingAuthorizationOrdersListProps {
 orders: SalesOrder[];
 onOpenDetail: (order: SalesOrder) => void;
 onOpenAuthorizationModal: (order: SalesOrder) => void;
 onAuthorizeOrder: (orderId: string) => void;
}

export const PendingAuthorizationOrdersList: React.FC<PendingAuthorizationOrdersListProps> = ({
 orders,
 onOpenDetail,
 onOpenAuthorizationModal,
 onAuthorizeOrder,
}) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [filterBranch, setFilterBranch] = useState('all');

 const pendingOrders = orders.filter((o) => o.status === 'Pendiente de autorización');

 const filteredOrders = pendingOrders.filter((o) => {
 const matchSearch =
 o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (o.originQuoteFolio && o.originQuoteFolio.toLowerCase().includes(searchTerm.toLowerCase()));
 const matchBranch = filterBranch === 'all' || o.branchId === filterBranch;
 return matchSearch && matchBranch;
 });

 return (
 <div className="space-y-4">
 {/* Top Filter Bar */}
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
 <div className="flex items-center gap-3 w-full md:w-auto flex-1">
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por pedido, cotización origen o cliente..."
 className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs focus:outline-none focus:border-theme-primary shadow-2xs"
 />
 </div>

 <select
 value={filterBranch}
 onChange={(e) => setFilterBranch(e.target.value)}
 className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
 >
 <option value="all">Todas las sucursales</option>
 <option value="wh-suc-valle-oriente">Sucursal Valle Oriente</option>
 <option value="wh-suc-cumbres">Sucursal Cumbres</option>
 </select>
 </div>

 <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido pendiente' : 'pedidos pendientes'} de autorización
 </span>
 </div>

 {/* Orders Table */}
 <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs">
 {filteredOrders.length === 0 ? (
 <div className="p-12 text-center text-zinc-500 space-y-2">
 <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 opacity-60" />
 <p className="font-bold text-zinc-900">No hay pedidos pendientes de autorización</p>
 <p className="text-xs">Todos los pedidos comerciales han sido dictaminados.</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[950px]">
 <thead>
 <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
 <th className="py-3.5 px-4">Pedido</th>
 <th className="py-3.5 px-3">Cotización Origen</th>
 <th className="py-3.5 px-4">Cliente</th>
 <th className="py-3.5 px-3">Sucursal</th>
 <th className="py-3.5 px-4">Motivo de Autorización</th>
 <th className="py-3.5 px-2 text-center">Artículos</th>
 <th className="py-3.5 px-2 text-center">Unidades</th>
 <th className="py-3.5 px-3 text-right">Total</th>
 <th className="py-3.5 px-2 text-center">Margen Est.</th>
 <th className="py-3.5 px-3">Fecha</th>
 <th className="py-3.5 px-3 text-center">Estado</th>
 <th className="py-3.5 px-4 text-center">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200">
 {filteredOrders.map((ord) => {
 const totalUnits = ord.items.reduce((a, b) => a + b.quantity, 0);
 const reason = ord.authorizationLog?.policyReason || ord.notes || 'Requiere revisión comercial';

 return (
 <tr key={ord.id} className="hover:bg-zinc-50/60 transition-colors">
 <td className="py-3 px-4 font-mono font-bold text-theme-primary whitespace-nowrap">
 {ord.folio}
 </td>
 <td className="py-3 px-3 font-mono font-semibold text-purple-700 whitespace-nowrap">
 {ord.originQuoteFolio || 'Directo'}
 </td>
 <td className="py-3 px-4">
 <strong className="text-zinc-900 block">{ord.customerName}</strong>
 <span className="text-[10px] text-zinc-500 font-mono">{ord.customerRfc}</span>
 </td>
 <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
 {ord.branchName}
 </td>
 <td className="py-3 px-4 max-w-xs">
 <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-medium bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-lg">
 <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
 <span className="truncate" title={reason}>{reason}</span>
 </div>
 </td>
 <td className="py-3 px-2 text-center font-bold text-zinc-900">
 {ord.items.length}
 </td>
 <td className="py-3 px-2 text-center font-mono font-bold text-zinc-900">
 {totalUnits}
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-zinc-900 whitespace-nowrap">
 {formatCurrencyMXN(ord.financials.total)}
 </td>
 <td className="py-3 px-2 text-center font-mono font-bold text-emerald-700">
 {formatPercentage(ord.financials.estimatedMarginPct, 1)}
 </td>
 <td className="py-3 px-3 text-zinc-500 text-[11px] whitespace-nowrap">
 {formatDateMX(ord.createdAt)}
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <SemanticBadge
 tone="warning"
 label={ord.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <div className="flex items-center justify-center gap-1.5">
 <button
 type="button"
 onClick={() => onOpenDetail(ord)}
 className="px-2.5 py-1 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
 >
 <Eye className="w-3.5 h-3.5 text-zinc-600" />
 <span>Detalle</span>
 </button>

 <button
 type="button"
 onClick={() => onOpenAuthorizationModal(ord)}
 className="px-2.5 py-1 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-[11px] shadow-xs cursor-pointer inline-flex items-center gap-1"
 >
 <UserCheck className="w-3.5 h-3.5" />
 <span>Autorizar</span>
 </button>
 </div>
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
