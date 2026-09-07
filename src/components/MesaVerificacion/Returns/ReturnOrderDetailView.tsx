import React from 'react';
import { 
 ArrowLeft, 
 RotateCcw, 
 Clock, 
 MapPin, 
 User, 
 AlertTriangle, 
 CheckCircle2, 
 Boxes, 
 Layers, 
 Sparkles, 
 Building2, 
 Tag, 
 FileText, 
 XOctagon, 
 PackageCheck 
} from 'lucide-react';
import { 
 ReturnOrder, 
 ReturnItemRecord 
} from '../../../data/mockReturnsData';
import { StatusBadge } from '../../common/StatusBadge';

interface ReturnOrderDetailViewProps {
 order: ReturnOrder;
 onBack: () => void;
 onOpenReceiveStation: (item: ReturnItemRecord) => void;
 onOpenCancelModal: () => void;
 onReportIncident: (item: ReturnItemRecord) => void;
}

export const ReturnOrderDetailView: React.FC<ReturnOrderDetailViewProps> = ({
 order,
 onBack,
 onOpenReceiveStation,
 onOpenCancelModal,
 onReportIncident,
}) => {
 const pendingCount = order.items.filter((i) => i.status === 'Pendiente').length;
 const receivedCount = order.items.filter((i) => i.status !== 'Pendiente' && i.status !== 'Cancelada').length;

 return (
 <div className="space-y-6 animate-in fade-in">
 
 {/* Top Bar with Back button */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs">
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={onBack}
 className="p-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle transition-all cursor-pointer"
 >
 <ArrowLeft className="w-4 h-4" />
 </button>

 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-base font-black text-theme-primary">{order.folio}</span>
 <StatusBadge
 variant={
 order.status === 'Completa'
 ? 'success'
 : order.status === 'Parcial' || order.status === 'En recepción'
 ? 'info'
 : order.status === 'Con incidencia'
 ? 'danger'
 : order.status === 'Cancelada'
 ? 'neutral'
 : 'warning'
 }
 label={order.status}
 size="sm"
 />
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Origen: <strong className="text-theme-main">{order.sourceType}</strong> &bull; Ref: <span className="font-mono text-theme-main">{order.reference}</span>
 </p>
 </div>
 </div>

 {order.status !== 'Completa' && order.status !== 'Cancelada' && (
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={onOpenCancelModal}
 className="px-3.5 py-2 rounded-2xl bg-theme-muted hover:bg-theme-primary-light hover:text-theme-primary text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center gap-1.5"
 >
 <XOctagon className="w-4 h-4" />
 <span>Cancelar orden</span>
 </button>
 </div>
 )}
 </div>

 {/* General Information Grid */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Almacén Destino</span>
 <strong className="text-xs font-bold text-theme-main block">{order.warehouseName}</strong>
 <span className="text-[10px] text-theme-muted">Recepción en CEDIS</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Cliente / Sucursal</span>
 <strong className="text-xs font-bold text-theme-main block truncate">{order.originClientOrBranch}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{order.reference}</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Motivo</span>
 <strong className="text-xs font-bold text-rose-600 block">{order.reason}</strong>
 <span className="text-[10px] text-theme-muted">{order.createdAt}</span>
 </div>

 <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Progreso de Retorno</span>
 <strong className="text-xs font-mono font-black text-theme-main block">
 {receivedCount} / {order.items.length} unidades
 </strong>
 <span className="text-[10px] text-emerald-600 font-bold">
 {receivedCount === order.items.length ? '100% procesado' : `${pendingCount} pendiente(s)`}
 </span>
 </div>
 </div>

 {/* Notes banner */}
 {order.notes && (
 <div className="p-4 rounded-3xl bg-theme-muted/30 border border-theme-subtle text-xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Observaciones:</span>
 <p className="text-theme-main leading-relaxed font-medium">{order.notes}</p>
 </div>
 )}

 {/* Units Table */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-extrabold text-theme-main">
 Partidas Físicas Serializadas (Sustratos / Bobinas)
 </h3>
 <p className="text-xs text-theme-muted">
 Cada unidad conserva su UID original para trazabilidad de ciclo de vida.
 </p>
 </div>
 <span className="text-xs font-mono text-theme-muted">
 Total: {order.items.length} piezas
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="border-b border-theme-subtle text-theme-muted uppercase font-bold text-[9px]">
 <th className="py-3 px-3">UID / Serie</th>
 <th className="py-3 px-3">Artículo / SKU</th>
 <th className="py-3 px-2 text-center">Ingreso Orig.</th>
 <th className="py-3 px-2 text-center">Condición</th>
 <th className="py-3 px-2 text-center">Ubicación Destino</th>
 <th className="py-3 px-2 text-center">Estado</th>
 <th className="py-3 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {order.items.map((item) => (
 <tr key={item.id} className="hover:bg-theme-muted/30 transition-colors">
 
 {/* UID */}
 <td className="py-3.5 px-3">
 <strong className="font-mono text-theme-primary block text-xs">{item.uid}</strong>
 <span className="text-[10px] font-mono text-theme-muted">Lote: {item.lotNumber}</span>
 </td>

 {/* Product */}
 <td className="py-3.5 px-3">
 <strong className="text-theme-main block text-xs">{item.productName}</strong>
 <span className="text-[10px] text-theme-muted">{item.brand} &bull; {item.size} ({item.sku})</span>
 </td>

 {/* Original Entry Date (Never reset) */}
 <td className="py-3.5 px-2 text-center font-mono text-theme-muted text-[11px]">
 {item.originalEntryDate}
 </td>

 {/* Condition */}
 <td className="py-3.5 px-2 text-center">
 {item.condition ? (
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border shadow-2xs ${
 item.condition === 'En buen estado'
 ? 'border-emerald-600 '
 : 'border-amber-500'
 }`}>
 {item.condition}
 </span>
 ) : (
 <span className="text-[10px] text-theme-muted font-mono">Por evaluar</span>
 )}
 </td>

 {/* Destination */}
 <td className="py-3.5 px-2 text-center">
 <span className="font-mono font-bold text-xs text-theme-main">
 {item.confirmedDestination || item.suggestedDestination}
 </span>
 </td>

 {/* Status */}
 <td className="py-3.5 px-2 text-center">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border shadow-2xs ${
 item.status === 'Pendiente'
 ? 'border-amber-500'
 : item.status === 'Pendiente de acomodo'
 ? 'border-blue-500'
 : 'border-emerald-600 '
 }`}>
 {item.status}
 </span>
 </td>

 {/* Actions */}
 <td className="py-3.5 px-3 text-right">
 {item.status === 'Pendiente' ? (
 <button
 type="button"
 onClick={() => onOpenReceiveStation(item)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
 >
 <PackageCheck className="w-3.5 h-3.5" />
 <span>Recibir</span>
 </button>
 ) : (
 <div className="flex items-center justify-end gap-1.5">
 <button
 type="button"
 onClick={() => onReportIncident(item)}
 className="p-1.5 rounded-lg text-theme-muted hover:text-rose-600 hover:bg-theme-muted transition-colors cursor-pointer"
 title="Registrar incidencia"
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 </button>
 <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>Asentado</span>
 </span>
 </div>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Timeline Section */}
 <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <h3 className="text-sm font-extrabold text-theme-main">
 Bitácora de Trazabilidad del Retorno
 </h3>
 <div className="space-y-2">
 {order.timeline.map((entry) => (
 <div
 key={entry.id}
 className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-start gap-3 text-xs"
 >
 <span className="font-mono text-[10px] text-theme-muted font-bold shrink-0 mt-0.5">
 {entry.occurredAt}
 </span>
 <div className="space-y-0.5 min-w-0">
 <span className="font-bold text-theme-main block">{entry.actor}</span>
 <p className="text-[11px] text-theme-muted font-medium leading-tight">{entry.message}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 );
};
