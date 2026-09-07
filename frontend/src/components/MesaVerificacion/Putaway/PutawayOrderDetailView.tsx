import React, { useState } from 'react';
import { 
 ArrowLeft, 
 Building2, 
 Calendar, 
 CheckCircle2, 
 Clock, 
 Layers, 
 MapPin, 
 Scan, 
 Tag, 
 PackageCheck, 
 User,
 ArrowRight,
 Sparkles
} from 'lucide-react';
import { PutawayOrder, PutawayOrderItem } from '../../../data/mockPutawayData';
import { PutawayScanStationModal } from './PutawayScanStationModal';

interface PutawayOrderDetailViewProps {
 order: PutawayOrder;
 onBack: () => void;
 onUpdateOrder: (updatedOrder: PutawayOrder) => void;
 onShowToast?: (msg: string) => void;
}

export const PutawayOrderDetailView: React.FC<PutawayOrderDetailViewProps> = ({
 order,
 onBack,
 onUpdateOrder,
 onShowToast,
}) => {
 const [activeItemForScanning, setActiveItemForScanning] = useState<PutawayOrderItem | null>(null);

 const completedCount = order.items.filter((i) => i.status === 'Acomodado').length;
 const pendingCount = order.items.length - completedCount;
 const isOrderFullyComplete = pendingCount === 0;

 const handleConfirmItemPutaway = (completedItem: PutawayOrderItem) => {
 const updatedItems = order.items.map((it) =>
 it.id === completedItem.id ? completedItem : it
 );
 const newCompletedCount = updatedItems.filter((i) => i.status === 'Acomodado').length;
 const newPendingCount = updatedItems.length - newCompletedCount;

 const newStatus: PutawayOrder['status'] =
 newPendingCount === 0
 ? 'Completa'
 : newCompletedCount > 0
 ? 'En proceso'
 : 'Pendiente';

 const updatedOrder: PutawayOrder = {
 ...order,
 status: newStatus,
 completedUnits: newCompletedCount,
 pendingUnits: newPendingCount,
 completedAt: newPendingCount === 0 ? '27 Ago 2026, 22:15' : undefined,
 items: updatedItems,
 };

 onUpdateOrder(updatedOrder);
 setActiveItemForScanning(null);
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Header with Back Button */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <button
 onClick={onBack}
 className="p-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-colors cursor-pointer"
 title="Volver a lista"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>

 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-base font-black text-rose-600">
 {order.folio}
 </span>
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 order.status === 'Completa'
 ? 'border-emerald-600 '
 : order.status === 'En proceso'
 ? 'border-blue-500'
 : 'border-zinc-400 '
 }`}>
 {order.status}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 {order.warehouseName} &bull; Orden de Acomodo
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2 text-xs font-mono text-theme-muted">
 <span>Operador: <strong className="text-theme-main">{order.operatorAssigned}</strong></span>
 </div>
 </div>

 {/* Metadata Strip */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
 <div>
 <span className="text-[10px] uppercase font-bold block">Instalación:</span>
 <strong className="text-theme-main font-semibold">{order.warehouseName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Fecha de Creación:</span>
 <strong className="text-theme-main font-mono">{order.createdAt}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Progreso Global:</span>
 <strong className="text-emerald-600 font-mono font-bold">
 {completedCount} / {order.items.length} piezas
 </strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Pendientes:</span>
 <strong className={pendingCount === 0 ? 'text-emerald-600' : 'text-rose-600 font-mono font-bold'}>
 {pendingCount} piezas
 </strong>
 </div>
 </div>
 </div>

 {/* Completion Banner */}
 {isOrderFullyComplete && (
 <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-2xl bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center font-bold shrink-0 shadow-sm">
 <PackageCheck className="w-6 h-6" />
 </div>
 <div className="space-y-0.5">
 <strong className="text-sm font-black text-emerald-950 dark:text-emerald-300 block">
 ✓ Orden de Acomodo Completada al 100%
 </strong>
 <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
 {order.items.length} / {order.items.length} unidades ubicadas físicamente en sus racks asignados. Estado: Disponible.
 </p>
 </div>
 </div>
 </div>
 )}

 {/* Items Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
 <h3 className="text-xs font-black text-theme-main uppercase tracking-wider">
 Unidades en la Orden ({order.items.length})
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">
 {completedCount} acomodadas &bull; {pendingCount} pendientes
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">UID / Serie</th>
 <th className="py-3 px-3">Artículo / SKU</th>
 <th className="py-3 px-3">Lote</th>
 <th className="py-3 px-3 text-center">Origen</th>
 <th className="py-3 px-3 text-center">Destino Asignado</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {order.items.map((it) => {
 const isItemDone = it.status === 'Acomodado';

 return (
 <tr key={it.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-4 font-mono font-black text-rose-600 whitespace-nowrap">
 {it.uid}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-extrabold text-theme-main block">{it.productName}</span>
 <span className="font-mono text-[10px] text-theme-primary">{it.sku}</span>
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {it.lotNumber}
 </td>
 <td className="py-3.5 px-3 text-center whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-theme-muted text-rose-600 border border-theme-subtle">
 {it.sourceLocation}
 </span>
 </td>
 <td className="py-3.5 px-3 text-center whitespace-nowrap">
 <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 {it.targetLocation}
 </span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 isItemDone
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {isItemDone ? 'Acomodado' : 'Pendiente'}
 </span>
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 {isItemDone ? (
 <span className="px-3 py-1.5 rounded-xl bg-white text-emerald-600 border border-emerald-600 shadow-2xs font-bold text-xs inline-flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>Verificado</span>
 </span>
 ) : (
 <button
 onClick={() => setActiveItemForScanning(it)}
 className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Scan className="w-3.5 h-3.5" />
 <span>Ejecutar acomodo</span>
 </button>
 )}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* Modal: Putaway Scan Station */}
 {activeItemForScanning && (
 <PutawayScanStationModal
 order={order}
 item={activeItemForScanning}
 onClose={() => setActiveItemForScanning(null)}
 onConfirmPutaway={handleConfirmItemPutaway}
 onShowToast={onShowToast}
 />
 )}
 </div>
 );
};
