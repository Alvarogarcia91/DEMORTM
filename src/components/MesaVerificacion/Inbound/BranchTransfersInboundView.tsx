import React, { useState } from 'react';
import { 
 Truck, 
 ArrowDownLeft, 
 Search, 
 CheckCircle2, 
 AlertTriangle, 
 Clock, 
 ArrowRight, 
 Scan, 
 Building2, 
 Boxes, 
 Layers, 
 Check, 
 Sparkles,
 QrCode,
 RotateCcw
} from 'lucide-react';
import { InventoryTransferOrder, MOCK_TRANSFERS } from '../../../data/mockInventoryData';
import { OperatingFacilityOption } from '../../../context/VerificationDeskContext';
import { BranchTransferScanStationModal } from './BranchTransferScanStationModal';

interface BranchTransfersInboundViewProps {
 facility: OperatingFacilityOption;
 onNavigateToPutaway?: () => void;
 onShowToast?: (msg: string) => void;
}

export const BranchTransfersInboundView: React.FC<BranchTransfersInboundViewProps> = ({
 facility,
 onNavigateToPutaway,
 onShowToast,
}) => {
 const [transfers, setTransfers] = useState<InventoryTransferOrder[]>(MOCK_TRANSFERS);
 const [activeSubtab, setActiveSubtab] = useState<'pending' | 'completed'>('pending');
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedTransferForScanning, setSelectedTransferForScanning] = useState<InventoryTransferOrder | null>(null);

 // Filter transfers for active branch
 const branchTransfers = transfers.filter(
 (t) => t.destinationWarehouseId === facility.id || t.destinationWarehouseName.toLowerCase().includes(facility.name.toLowerCase())
 );

 const pendingTransfers = branchTransfers.filter(
 (t) => t.status === 'En tránsito' || t.status === 'Parcial' || t.status === 'Listo para salida'
 );

 const completedTransfers = branchTransfers.filter(
 (t) => t.status === 'Recibido'
 );

 const currentList = (activeSubtab === 'pending' ? pendingTransfers : completedTransfers).filter((t) => {
 if (!searchQuery.trim()) return true;
 const q = searchQuery.toLowerCase();
 return (
 t.folio.toLowerCase().includes(q) ||
 t.sourceWarehouseName.toLowerCase().includes(q) ||
 (t.driver && t.driver.toLowerCase().includes(q)) ||
 (t.truckPlates && t.truckPlates.toLowerCase().includes(q)) ||
 t.items.some((it) => it.productName.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
 );
 });

 // Calculate totals
 const totalPendingUnits = pendingTransfers.reduce((acc, t) => {
 const received = t.receivedUnits || 0;
 return acc + (t.totalUnits - received);
 }, 0);

 const totalReceivedUnitsToday = branchTransfers.reduce((acc, t) => {
 return acc + (t.receivedUnits || 0);
 }, 0);

 // Handle transfer reception update from scanning modal
 const handleConfirmReception = (updatedTransfer: InventoryTransferOrder, newlyReceivedSerials: string[]) => {
 setTransfers((prev) => prev.map((t) => (t.id === updatedTransfer.id ? updatedTransfer : t)));
 setSelectedTransferForScanning(null);
 };

 return (
 <div className="space-y-5">
 
 {/* Top Banner: Branch Mode Summary & KPIs */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl p-5 shadow-xs space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
 Flujo Sucursal
 </span>
 <span className="font-mono text-xs text-theme-muted">
 {facility.name} &bull; Recepción de Traspasos desde CEDIS
 </span>
 </div>
 <h2 className="text-base font-extrabold text-theme-main tracking-tight mt-1">
 Traspasos por Recibir
 </h2>
 <p className="text-xs text-theme-muted mt-0.5">
 Validación física de colchones serializados arribando de CEDIS. No se generan nuevos UIDs.
 </p>
 </div>

 {/* Quick Metrics */}
 <div className="flex items-center gap-3">
 <div className="px-4 py-2 rounded-2xl bg-theme-muted/50 border border-theme-subtle text-right">
 <span className="text-[10px] font-bold uppercase text-theme-muted block">
 Traspasos Activos
 </span>
 <span className="font-mono text-base font-black text-theme-main">
 {pendingTransfers.length}
 </span>
 </div>

 <div className="px-4 py-2 rounded-2xl bg-theme-muted/50 border border-theme-subtle text-right">
 <span className="text-[10px] font-bold uppercase text-theme-muted block">
 Unidades Pendientes
 </span>
 <span className="font-mono text-base font-black text-rose-600">
 {totalPendingUnits} u.
 </span>
 </div>
 </div>
 </div>

 {/* Informative Rule Callout */}
 <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-center justify-between gap-3">
 <div className="flex items-center gap-2 text-purple-950 dark:text-purple-200">
 <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
 <span>
 <strong>Regla Operativa:</strong> Las unidades que llegan por traspaso ya cuentan con su sticker y UID creado en CEDIS. Al recibir en sucursal solo se valida el código existente y pasan a <strong>Pendiente de acomodo</strong> en <code className="font-mono font-bold bg-purple-500/20 px-1 py-0.5 rounded">{facility.tempReceivingLocation}</code>.
 </span>
 </div>

 {onNavigateToPutaway && (
 <button
 onClick={onNavigateToPutaway}
 className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-xs shrink-0 cursor-pointer"
 >
 Ir a Acomodo &rarr;
 </button>
 )}
 </div>
 </div>

 {/* Subtabs and Search Toolbar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <button
 onClick={() => setActiveSubtab('pending')}
 className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
 activeSubtab === 'pending'
 ? 'bg-rose-600 text-white shadow-sm'
 : 'bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main'
 }`}
 >
 <Truck className="w-3.5 h-3.5" />
 <span>Por recibir / En tránsito</span>
 <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
 {pendingTransfers.length}
 </span>
 </button>

 <button
 onClick={() => setActiveSubtab('completed')}
 className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
 activeSubtab === 'completed'
 ? 'bg-rose-600 text-white shadow-sm'
 : 'bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main'
 }`}
 >
 <CheckCircle2 className="w-3.5 h-3.5" />
 <span>Traspasos recibidos</span>
 <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
 {completedTransfers.length}
 </span>
 </button>
 </div>

 {/* Search */}
 <div className="relative w-full sm:w-72">
 <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar por folio, CEDIS o SKU..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-9 pr-3 py-1.5 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500"
 />
 </div>
 </div>

 {/* Transfers Cards / List */}
 {currentList.length === 0 ? (
 <div className="p-12 text-center bg-theme-surface border border-theme-subtle rounded-3xl space-y-3">
 <Truck className="w-10 h-10 mx-auto text-theme-muted/50" />
 <h3 className="text-sm font-bold text-theme-main">
 {activeSubtab === 'pending' ? 'No hay traspasos pendientes de recibir' : 'No hay historial de traspasos recibidos'}
 </h3>
 <p className="text-xs text-theme-muted max-w-md mx-auto">
 {activeSubtab === 'pending'
 ? `Todos los traspasos dirigidos a ${facility.name} han sido recibidos e ingresados a piso.`
 : 'Los traspasos completados aparecerán listados aquí con su historial de auditoría.'}
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4">
 {currentList.map((transfer) => {
 const receivedCount = transfer.receivedUnits || (transfer.receivedSerials ? transfer.receivedSerials.length : 0);
 const pendingCount = transfer.totalUnits - receivedCount;
 const isComplete = transfer.status === 'Recibido' || receivedCount === transfer.totalUnits;
 const isPartial = transfer.status === 'Parcial' || (receivedCount > 0 && !isComplete);
 const progressPercent = Math.round((receivedCount / (transfer.totalUnits || 1)) * 100);

 return (
 <div 
 key={transfer.id}
 className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/40 transition-all shadow-xs space-y-4"
 >
 {/* Card Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-theme-muted flex items-center justify-center font-bold text-sm text-theme-main shrink-0 border border-theme-subtle">
 <Truck className="w-5 h-5 text-theme-primary" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-sm font-black text-theme-main">
 {transfer.folio}
 </span>
 
 {isComplete ? (
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs flex items-center gap-1">
 <CheckCircle2 className="w-3 h-3 text-emerald-600" />
 Recibido
 </span>
 ) : isPartial ? (
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs flex items-center gap-1">
 <AlertTriangle className="w-3 h-3 text-amber-600" />
 Parcial ({receivedCount} de {transfer.totalUnits})
 </span>
 ) : (
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs flex items-center gap-1">
 <Clock className="w-3 h-3 text-blue-600" />
 En tránsito
 </span>
 )}
 </div>

 <p className="text-[11px] text-theme-muted mt-0.5 flex items-center gap-2">
 <span>Origen: <strong>{transfer.sourceWarehouseName}</strong></span>
 <ArrowRight className="w-3 h-3 inline text-theme-muted" />
 <span>Destino: <strong>{facility.name}</strong></span>
 </p>
 </div>
 </div>

 {/* Driver & Arrival Info */}
 <div className="text-right text-xs">
 <span className="font-bold text-theme-main block">
 {transfer.driver || 'Chofer Asignado'}
 </span>
 <span className="text-[10px] font-mono text-theme-muted block">
 Placas: {transfer.truckPlates || 'S/D'} &bull; Arribo: {transfer.arrivalDate || transfer.plannedDate}
 </span>
 </div>
 </div>

 {/* Progress bar and statistics */}
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Total Esperado</span>
 <strong className="text-sm font-mono text-theme-main">{transfer.totalUnits} unidades</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Recibidas en Sucursal</span>
 <strong className="text-sm font-mono text-emerald-600">{receivedCount} unidades</strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Pendientes de Arribo</span>
 <strong className={`text-sm font-mono ${pendingCount > 0 ? 'text-rose-600' : 'text-theme-muted'}`}>
 {pendingCount} unidades
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle flex flex-col justify-between">
 <div className="flex justify-between items-center text-[10px] uppercase font-bold text-theme-muted">
 <span>Avance</span>
 <span className="font-mono text-theme-main">{progressPercent}%</span>
 </div>
 <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
 <div 
 className={`h-full transition-all duration-300 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-rose-600'}`}
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>
 </div>

 {/* SKUs List preview */}
 <div className="space-y-1.5 pt-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Partidas del Traspaso ({transfer.items.length}):
 </span>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
 {transfer.items.map((it, itIdx) => {
 const itReceived = it.serials.filter((s) => (transfer.receivedSerials || []).includes(s)).length;
 return (
 <div key={itIdx} className="p-2.5 rounded-xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between text-xs">
 <div className="min-w-0 pr-2">
 <span className="font-mono text-[10px] font-bold text-rose-600 block">{it.sku}</span>
 <span className="truncate font-semibold text-theme-main block">{it.productName}</span>
 </div>
 <span className="font-mono text-[11px] font-bold text-theme-muted shrink-0">
 {itReceived} / {it.quantity} u.
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Actions Footer */}
 <div className="pt-3 border-t border-theme-subtle flex items-center justify-between">
 <span className="text-[11px] text-theme-muted font-mono">
 Ubicación destino: <strong className="text-theme-main">{facility.tempReceivingLocation}</strong>
 </span>

 <button
 onClick={() => setSelectedTransferForScanning(transfer)}
 className={`px-5 py-2 rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer ${
 isComplete
 ? 'bg-theme-muted hover:bg-theme-subtle text-theme-main border border-theme-subtle'
 : isPartial
 ? 'bg-amber-500 hover:bg-amber-600 text-white'
 : 'bg-rose-600 hover:bg-rose-700 text-white'
 }`}
 >
 <Scan className="w-4 h-4" />
 <span>
 {isComplete ? 'Ver detalle de UIDs' : isPartial ? 'Continuar recepción' : 'Iniciar recepción'}
 </span>
 </button>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* Modal: Branch Transfer Scan Station */}
 {selectedTransferForScanning && (
 <BranchTransferScanStationModal
 transfer={selectedTransferForScanning}
 facility={facility}
 onClose={() => setSelectedTransferForScanning(null)}
 onConfirmReception={handleConfirmReception}
 onShowToast={onShowToast}
 />
 )}

 </div>
 );
};
