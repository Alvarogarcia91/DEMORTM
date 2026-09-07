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
 Compass, 
 Send,
 Sparkles,
 TrendingDown
} from 'lucide-react';
import { PickOrder, PickPlanStop } from '../../../data/mockPickingData';
import { PickScanStationModal } from './PickScanStationModal';

interface PickOrderDetailViewProps {
 order: PickOrder;
 onBack: () => void;
 onUpdateOrder: (updatedOrder: PickOrder) => void;
 onNavigateToOutbound?: () => void;
 onShowToast?: (msg: string) => void;
}

export const PickOrderDetailView: React.FC<PickOrderDetailViewProps> = ({
 order,
 onBack,
 onUpdateOrder,
 onNavigateToOutbound,
 onShowToast,
}) => {
 const [isScanStationOpen, setIsScanStationOpen] = useState(false);
 const [activeStopIndex, setActiveStopIndex] = useState(0);

 const completedCount = order.stops.filter((s) => s.status === 'Recolectada').length;
 const pendingCount = order.stops.length - completedCount;
 const isOrderFullyComplete = pendingCount === 0;

 // Handle confirming a single stop from scanner
 const handleConfirmPickStop = (
 stopId: string,
 pickedUid: string,
 substitutionReason?: string
 ) => {
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

 const updatedStops = order.stops.map((s) => {
 if (s.id === stopId) {
 return {
 ...s,
 uid: pickedUid,
 status: 'Recolectada' as const,
 pickedAt: `27 Ago ${timeStr}`,
 substitutionReason,
 };
 }
 return s;
 });

 const newCompletedCount = updatedStops.filter((s) => s.status === 'Recolectada').length;
 const newPendingCount = updatedStops.length - newCompletedCount;

 const newStatus: PickOrder['status'] =
 newPendingCount === 0
 ? 'Completa'
 : newCompletedCount > 0
 ? 'En proceso'
 : 'Pendiente';

 const updatedOrder: PickOrder = {
 ...order,
 status: newStatus,
 pickedUnits: newCompletedCount,
 pendingUnits: newPendingCount,
 traveledDistanceMeters: Math.round(
 (newCompletedCount / updatedStops.length) * order.estimatedDistanceMeters
 ),
 completedAt: newPendingCount === 0 ? '27 Ago 2026, 12:15' : undefined,
 stops: updatedStops,
 };

 onUpdateOrder(updatedOrder);
 };

 const handleCompleteOrder = () => {
 setIsScanStationOpen(false);
 if (onShowToast) {
 onShowToast(
 `✓ Recolección ${order.folio} completada al 100%. Unidades transferidas a ${order.tempStagingLocation}.`
 );
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200">
 
 {/* Header with Back Button and Quick Actions */}
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
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {order.strategyName}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Ref: {order.referenceFolio} &rarr; {order.destinationName}
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2">
 {!isOrderFullyComplete ? (
 <button
 onClick={() => {
 const firstPending = order.stops.findIndex((s) => s.status !== 'Recolectada');
 setActiveStopIndex(firstPending !== -1 ? firstPending : 0);
 setIsScanStationOpen(true);
 }}
 className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Scan className="w-4 h-4" />
 <span>{completedCount === 0 ? 'Iniciar recolección' : 'Continuar recolección'}</span>
 </button>
 ) : (
 <button
 onClick={onNavigateToOutbound}
 className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <Send className="w-4 h-4" />
 <span>Ir a Verificación de Salida</span>
 </button>
 )}
 </div>
 </div>

 {/* Metadata Strip */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
 <div>
 <span className="text-[10px] uppercase font-bold block">Instalación Origen:</span>
 <strong className="text-theme-main font-semibold">{order.warehouseName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Progreso de Recolección:</span>
 <strong className="text-emerald-600 font-mono font-bold">
 {completedCount} / {order.stops.length} piezas ({Math.round((completedCount / order.stops.length) * 100)}%)
 </strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Distancia Estimada:</span>
 <strong className="text-theme-main font-mono font-bold">
 {order.traveledDistanceMeters} / {order.estimatedDistanceMeters} m
 </strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold block">Rampa de Salida:</span>
 <strong className="text-emerald-600 font-mono font-bold">{order.tempStagingLocation}</strong>
 </div>
 </div>
 </div>

 {/* Completion Banner */}
 {isOrderFullyComplete && (
 <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-2xl bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center font-bold shrink-0 shadow-sm">
 <PackageCheck className="w-6 h-6" />
 </div>
 <div className="space-y-0.5">
 <strong className="text-sm font-black text-emerald-950 dark:text-emerald-300 block">
 ✓ Recolección Completada al 100%
 </strong>
 <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
 {order.stops.length} / {order.stops.length} unidades recolectadas y ubicadas en {order.tempStagingLocation}. Listas para Verificación de Salida.
 </p>
 </div>
 </div>

 <button
 onClick={onNavigateToOutbound}
 className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
 >
 <Send className="w-4 h-4" />
 <span>Ir a Verificación de Salida</span>
 </button>
 </div>
 )}

 {/* Stops Sequence Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="p-4 border-b border-theme-subtle flex items-center justify-between">
 <h3 className="text-xs font-black text-theme-main uppercase tracking-wider">
 Secuencia de Recolección en Rack ({order.stops.length} paradas)
 </h3>
 <span className="text-[10px] text-theme-muted font-mono">
 Rampa de preparación: <strong>{order.tempStagingLocation}</strong>
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-3 w-12 text-center">#</th>
 <th className="py-3 px-3">Ubicación Rack</th>
 <th className="py-3 px-3">UID / Serie</th>
 <th className="py-3 px-3">Artículo / SKU</th>
 <th className="py-3 px-3">Criterio Estrategia</th>
 <th className="py-3 px-3">Lote & Antigüedad</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {order.stops.map((stop, idx) => {
 const isStopDone = stop.status === 'Recolectada';

 return (
 <tr key={stop.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3.5 px-3 text-center font-mono font-bold text-theme-muted">
 #{stop.sequence}
 </td>
 <td className="py-3.5 px-3 font-mono font-black text-rose-600 whitespace-nowrap">
 {stop.locationCode}
 </td>
 <td className="py-3.5 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
 {stop.uid}
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="font-extrabold text-theme-main block">{stop.productName}</span>
 <span className="font-mono text-[10px] text-theme-primary">{stop.sku}</span>
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {stop.strategyBadge}
 </span>
 <span className="text-[10px] text-theme-muted block truncate mt-0.5 max-w-[180px]">
 {stop.strategyReason}
 </span>
 </td>
 <td className="py-3.5 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {stop.lotNumber} &bull; {stop.ageDays} días
 </td>
 <td className="py-3.5 px-3 whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 isStopDone
 ? 'border-emerald-600 '
 : 'border-zinc-400 '
 }`}>
 {isStopDone ? 'Recolectada' : 'Pendiente'}
 </span>
 </td>
 <td className="py-3.5 px-4 text-right whitespace-nowrap">
 {isStopDone ? (
 <span className="px-3 py-1.5 rounded-xl bg-white text-emerald-600 border border-emerald-600 shadow-2xs font-bold text-xs inline-flex items-center gap-1">
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>Recolectado</span>
 </span>
 ) : (
 <button
 onClick={() => {
 setActiveStopIndex(idx);
 setIsScanStationOpen(true);
 }}
 className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-auto cursor-pointer"
 >
 <Scan className="w-3.5 h-3.5" />
 <span>Recolectar</span>
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

 {/* Modal: Pick Scan Station */}
 {isScanStationOpen && (
 <PickScanStationModal
 order={order}
 initialStopIndex={activeStopIndex}
 onClose={() => setIsScanStationOpen(false)}
 onConfirmPickStop={handleConfirmPickStop}
 onCompleteOrder={handleCompleteOrder}
 onShowToast={onShowToast}
 />
 )}
 </div>
 );
};
