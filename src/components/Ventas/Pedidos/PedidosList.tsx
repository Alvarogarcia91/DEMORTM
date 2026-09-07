import React, { useState } from 'react';
import {
 Search,
 Eye,
 ShoppingBag,
 Truck,
 CheckCircle2,
 FileText
} from 'lucide-react';
import { SalesOrder } from '../../../data/mockSalesData';
import { SemanticBadge } from '../../common/SemanticBadge';
import { formatCurrencyMXN, formatDateMX } from '../../../utils/formatters';

interface PedidosListProps {
 orders: SalesOrder[];
 onOpenDetail: (order: SalesOrder) => void;
}

export const PedidosList: React.FC<PedidosListProps> = ({
 orders,
 onOpenDetail,
}) => {
 const [searchTerm, setSearchTerm] = useState('');
 const [filterBranch, setFilterBranch] = useState('all');
 const [filterStatus, setFilterStatus] = useState('all');

 const filteredOrders = orders.filter((o) => {
 const matchSearch =
 o.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
 o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (o.originQuoteFolio && o.originQuoteFolio.toLowerCase().includes(searchTerm.toLowerCase()));
 const matchBranch = filterBranch === 'all' || o.branchId === filterBranch;
 const matchStatus = filterStatus === 'all' || o.status === filterStatus;
 return matchSearch && matchBranch && matchStatus;
 });

 const getSemanticTone = (status: SalesOrder['status']) => {
  switch (status) {
    case 'Pendiente de autorización':
      return 'warning';
    case 'Autorizado':
      return 'info';
    case 'Pendiente de surtido':
      return 'smart';
    case 'En preparación':
      return 'smart';
    case 'Surtido parcial':
      return 'warning';
    case 'Surtido completo':
      return 'success';
    case 'En verificación de salida':
      return 'info';
    case 'Lista para carga':
      return 'success';
    case 'En ruta':
      return 'info';
    case 'Entregado':
      return 'success';
    case 'Entrega parcial':
      return 'warning';
    case 'Con incidencia':
    case 'Cancelado':
      return 'danger';
    default:
      return 'neutral';
  }
 };

 return (
 <div className="space-y-4">
 {/* Filters Bar */}
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
 <div className="flex items-center gap-3 w-full md:w-auto flex-1">
 <div className="relative flex-1 max-w-md">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por folio de pedido, cotización o cliente..."
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

 <select
 value={filterStatus}
 onChange={(e) => setFilterStatus(e.target.value)}
 className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
 >
 <option value="all">Todos los estados</option>
 <option value="Pendiente de autorización">Pendientes de autorización</option>
 <option value="Autorizado">Autorizados</option>
 <option value="Pendiente de surtido">Pendientes de surtido</option>
 <option value="En preparación">En preparación</option>
 <option value="Surtido parcial">Surtido parcial</option>
 <option value="Surtido completo">Surtidos completos</option>
 <option value="En verificación de salida">En verificación de salida</option>
 <option value="Lista para carga">Listas para carga</option>
 <option value="En ruta">En ruta</option>
 <option value="Entregado">Entregados</option>
 <option value="Entrega parcial">Entrega parcial</option>
 <option value="Con incidencia">Con incidencia</option>
 <option value="Cancelado">Cancelados</option>
 </select>
 </div>

 <span className="text-xs font-bold text-zinc-500">
 Total: {filteredOrders.length} pedidos
 </span>
 </div>

 {/* Orders Table */}
 <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[950px]">
 <thead>
 <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">
 <th className="py-3.5 px-4">Pedido</th>
 <th className="py-3.5 px-3">Cotización</th>
 <th className="py-3.5 px-4">Cliente</th>
 <th className="py-3.5 px-3">Sucursal</th>
 <th className="py-3.5 px-2 text-center">Artículos</th>
 <th className="py-3.5 px-2 text-center">Unidades</th>
 <th className="py-3.5 px-3 text-right">Total</th>
 <th className="py-3.5 px-3">Fecha Entrega</th>
 <th className="py-3.5 px-3 text-center">Estado</th>
 <th className="py-3.5 px-4 text-center">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200">
 {filteredOrders.map((ord) => {
 const totalUnits = ord.items.reduce((a, b) => a + b.quantity, 0);

 return (
 <tr key={ord.id} className="hover:bg-zinc-50/60 transition-colors">
 <td className="py-3 px-4 font-mono font-bold text-theme-primary whitespace-nowrap">
 {ord.folio}
 </td>
 <td className="py-3 px-3 font-mono font-semibold text-zinc-500 whitespace-nowrap">
 {ord.originQuoteFolio || '-'}
 </td>
 <td className="py-3 px-4">
 <strong className="text-zinc-900 block">{ord.customerName}</strong>
 <span className="text-[10px] text-zinc-500 font-mono">{ord.customerRfc}</span>
 </td>
 <td className="py-3 px-3 text-zinc-600 whitespace-nowrap">
 {ord.branchName}
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
 <td className="py-3 px-3 text-zinc-500 text-[11px] whitespace-nowrap">
 {formatDateMX(ord.targetDeliveryDate)}
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <SemanticBadge
 tone={getSemanticTone(ord.status) as any}
 label={ord.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <button
 type="button"
 onClick={() => onOpenDetail(ord)}
 className="px-2.5 py-1 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
 >
 <Eye className="w-3.5 h-3.5 text-zinc-600" />
 <span>Detalle</span>
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
