import React, { useState } from 'react';
import { 
 Search, 
 Filter, 
 Building2, 
 Calendar, 
 Truck, 
 Boxes, 
 CheckCircle2, 
 AlertTriangle, 
 Eye, 
 FileText, 
 X,
 Store,
 Clock,
 Tag,
 User,
 QrCode
} from 'lucide-react';
import { InboundReceiptOrder, ReceivedUnitRecord } from '../../../data/mockInboundData';
import { ReceiptStickerModal } from './ReceiptStickerModal';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface CompletedReceiptOrdersListProps {
 orders: InboundReceiptOrder[];
 onOpenOrderReceiving: (order: InboundReceiptOrder) => void;
}

export const CompletedReceiptOrdersList: React.FC<CompletedReceiptOrdersListProps> = ({
 orders,
 onOpenOrderReceiving,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedOrderDetail, setSelectedOrderDetail] = useState<InboundReceiptOrder | null>(null);
 const [selectedUnitForSticker, setSelectedUnitForSticker] = useState<ReceivedUnitRecord | null>(null);

 const filteredOrders = orders.filter((order) => {
 const q = searchQuery.toLowerCase().trim();
 return (
 !q ||
 order.folio.toLowerCase().includes(q) ||
 order.originName.toLowerCase().includes(q) ||
 order.referenceFolio.toLowerCase().includes(q) ||
 order.lines.some(l => l.sku.toLowerCase().includes(q) || l.productName.toLowerCase().includes(q))
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
 placeholder="Buscar en historial de órdenes de entrada por folio, proveedor o artículo..."
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
 <th className="py-3 px-3">Origen</th>
 <th className="py-3 px-3">Destino</th>
 <th className="py-3 px-3 text-center">Esperadas</th>
 <th className="py-3 px-3 text-center">Recibidas</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredOrders.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-8 text-center text-theme-muted">
 No se encontraron órdenes registradas.
 </td>
 </tr>
 ) : (
 filteredOrders.map((order) => {
 const totalExpected = order.lines.reduce((s, l) => s + l.expectedQuantity, 0);
 const totalReceived = order.lines.reduce((s, l) => s + l.receivedQuantity, 0);

 return (
 <tr key={order.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {order.folio}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-extrabold text-theme-main block">{order.originName}</span>
 <span className="text-[10px] text-theme-muted font-mono">{order.referenceFolio}</span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-bold text-theme-main block">{order.destinationWarehouseName}</span>
 <span className="text-[10px] text-rose-600 font-mono font-bold">{order.receivingAreaCode}</span>
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {totalExpected} u.
 </td>
 <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
 {totalReceived} u.
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 order.status === 'Completa'
 ? 'success'
 : order.status === 'En recepción'
 ? 'info'
 : order.status === 'Parcial'
 ? 'correction'
 : 'neutral'
 }
 label={order.status}
 size="sm"
 />
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {order.completedAt || order.expectedDate}
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setSelectedOrderDetail(order)}
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

 {/* Modal: Full Order Audit Detail */}
 {selectedOrderDetail && (
 <ModalPortal onClose={() => setSelectedOrderDetail(null)}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-base font-black text-rose-600">
 {selectedOrderDetail.folio}
 </span>
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 selectedOrderDetail.status === 'Completa'
 ? 'border-emerald-600 '
 : 'border-blue-500'
 }`}>
 {selectedOrderDetail.status}
 </span>
 </div>
 <h3 className="text-xs font-bold text-theme-muted">
 {selectedOrderDetail.originName} &bull; {selectedOrderDetail.referenceFolio}
 </h3>
 </div>
 </div>

 <button
 onClick={() => setSelectedOrderDetail(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Summary Stats Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Destino</span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {selectedOrderDetail.destinationWarehouseName}
 </strong>
 <span className="text-[10px] text-rose-600 font-mono font-bold">
 {selectedOrderDetail.receivingAreaCode}
 </span>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidades Esperadas</span>
 <strong className="text-sm font-mono font-black text-theme-main block">
 {selectedOrderDetail.lines.reduce((s, l) => s + l.expectedQuantity, 0)} u.
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidades Recibidas</span>
 <strong className="text-sm font-mono font-black text-emerald-600 block">
 {selectedOrderDetail.lines.reduce((s, l) => s + l.receivedQuantity, 0)} u.
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Operador Mesa</span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {selectedOrderDetail.operatorAssigned || 'Supervisor General'}
 </strong>
 </div>
 </div>

 {/* Articles & Serialized UIDs section */}
 <div className="space-y-4">
 <h4 className="text-xs font-black text-theme-main uppercase tracking-wider">
 Partidas y Unidades Serializadas ({selectedOrderDetail.lines.reduce((s, l) => s + l.receivedUnits.length, 0)} UIDs)
 </h4>

 {selectedOrderDetail.lines.map((line) => (
 <div key={line.id} className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{line.sku}</span>
 <span className="text-[10px] text-theme-muted font-bold">{line.brand} &bull; {line.size}</span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">{line.productName}</h5>
 </div>

 <div className="flex items-center gap-3 text-xs font-mono">
 <span>Esperadas: <strong>{line.expectedQuantity}</strong></span>
 <span>Recibidas: <strong className="text-emerald-600">{line.receivedQuantity}</strong></span>
 </div>
 </div>

 {/* UIDs Grid - Clickable */}
 {line.receivedUnits.length > 0 ? (
 <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
 <span className="text-[10px] font-bold uppercase text-theme-muted block">
 UIDs generados (Haz click en cualquier UID para ver o imprimir su sticker QR):
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
 {line.receivedUnits.map((unit) => (
 <button
 key={unit.uid}
 type="button"
 onClick={() => setSelectedUnitForSticker(unit)}
 className="p-2.5 rounded-xl bg-theme-surface hover:bg-theme-subtle border border-theme-subtle flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs group"
 >
 <div className="min-w-0 space-y-0.5">
 <span className="font-mono font-black text-xs text-rose-600 group-hover:underline block truncate">
 {unit.uid}
 </span>
 <span className="text-[10px] text-theme-muted font-mono block">
 {unit.lotNumber} &bull; {unit.locationCode}
 </span>
 </div>
 <QrCode className="w-4 h-4 text-theme-muted group-hover:text-theme-primary shrink-0" />
 </button>
 ))}
 </div>
 </div>
 ) : (
 <div className="text-[11px] text-theme-muted italic">
 {line.serialization === 'No serializado'
 ? 'Artículo sin serialización individual (recepción por cantidad).'
 : 'No se han recibido unidades en esta partida.'}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <span className="text-theme-muted">
 Auditado en Mesa de Verificación
 </span>

 <div className="flex items-center gap-2">
 {selectedOrderDetail.status !== 'Completa' && (
 <button
 onClick={() => {
 const ord = selectedOrderDetail;
 setSelectedOrderDetail(null);
 onOpenOrderReceiving(ord);
 }}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md cursor-pointer"
 >
 Continuar recepción
 </button>
 )}
 <button
 onClick={() => setSelectedOrderDetail(null)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Embedded Sticker Modal */}
 {selectedUnitForSticker && selectedOrderDetail && (
 <ReceiptStickerModal
 unit={selectedUnitForSticker}
 warehouseName={selectedOrderDetail.destinationWarehouseName}
 onClose={() => setSelectedUnitForSticker(null)}
 />
 )}
 </div>
 );
};
