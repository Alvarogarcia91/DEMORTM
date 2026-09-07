import React, { useState } from 'react';
import { 
 X, 
 Sparkles, 
 MapPin, 
 Check, 
 Building2, 
 Layers, 
 ArrowRight, 
 ShieldCheck 
} from 'lucide-react';
import { 
 PendingOutboundPickOrder, 
 OutboundVerificationOrder, 
 CEDIS_STAGING_LANES, 
 StagingLane 
} from '../../../data/mockOutboundVerificationData';
import { ModalPortal } from '../../common/ModalPortal';

interface OutboundVerificationCreateModalProps {
 pendingPickOrder: PendingOutboundPickOrder;
 onClose: () => void;
 onCreateOrder: (newOrder: OutboundVerificationOrder) => void;
}

export const OutboundVerificationCreateModal: React.FC<OutboundVerificationCreateModalProps> = ({
 pendingPickOrder,
 onClose,
 onCreateOrder,
}) => {
 const lanes = CEDIS_STAGING_LANES[pendingPickOrder.warehouseId] || CEDIS_STAGING_LANES['wh-mty-norte'];
 const defaultLane = lanes.find((l) => l.isSuggested && l.status === 'Disponible')?.code || 'EMB-03';
 const [selectedLaneCode, setSelectedLaneCode] = useState<string>(defaultLane);
 const [operator, setOperator] = useState('Verificador Mesa 01 (Roberto Garza)');

 const selectedLane = lanes.find((l) => l.code === selectedLaneCode) || lanes[0];

 const handleConfirmCreate = () => {
 const newFolioNum = Math.floor(42 + Math.random() * 20);
 const newFolio = `VS-2026-00${newFolioNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const articleSummaries = pendingPickOrder.itemsSummary.map((it) => ({
 sku: it.sku,
 productName: it.productName,
 brand: it.brand,
 size: it.size,
 expectedUnits: it.quantity,
 validatedUnits: 0,
 }));

 const items = pendingPickOrder.expectedUids.map((u, idx) => ({
 id: `v-gen-${idx + 1}`,
 uid: u.uid,
 sku: u.sku,
 productName: u.productName,
 brand: u.brand,
 size: u.size,
 lotNumber: u.lotNumber,
 isValidated: false,
 }));

 const newOrder: OutboundVerificationOrder = {
 id: `vs-${Date.now()}`,
 folio: newFolio,
 pickOrderFolio: pendingPickOrder.folio,
 referenceFolio: pendingPickOrder.referenceFolio,
 type: pendingPickOrder.type,
 warehouseId: pendingPickOrder.warehouseId,
 warehouseName: pendingPickOrder.warehouseName,
 destinationName: pendingPickOrder.destinationName,
 assignedLane: selectedLaneCode,
 priority: pendingPickOrder.priority,
 status: 'En validación',
 createdAt: dateStr,
 operatorAssigned: operator,
 totalUnits: pendingPickOrder.totalUnits,
 validatedUnits: 0,
 stagingLocation: pendingPickOrder.stagingLocation,
 articleSummaries,
 items,
 };

 onCreateOrder(newOrder);
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary">
 {pendingPickOrder.folio}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 Ref: {pendingPickOrder.referenceFolio}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Preparar Verificación y Asignar Carril
 </h2>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Pick Order Summary Card */}
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2 text-xs">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Instalación Origen:</span>
 <strong className="text-theme-main font-semibold block">{pendingPickOrder.warehouseName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Destino de Salida:</span>
 <strong className="text-theme-main font-extrabold block">{pendingPickOrder.destinationName}</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Artículos:</span>
 <strong className="text-theme-main font-bold block">{pendingPickOrder.articlesCount} artículos</strong>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidades a Validar:</span>
 <strong className="text-theme-primary font-mono font-black text-sm block">{pendingPickOrder.totalUnits} piezas</strong>
 </div>
 </div>
 </div>

 {/* Staging Lane Selection */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 Selecciona el Carril de Embarque en CEDIS:
 </span>
 <span className="text-[10px] text-theme-muted font-mono">
 {lanes.filter((l) => l.status === 'Disponible').length} carriles disponibles
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
 {lanes.map((lane) => {
 const isSelected = selectedLaneCode === lane.code;
 const isAvailable = lane.status === 'Disponible';

 return (
 <div
 key={lane.code}
 onClick={() => isAvailable && setSelectedLaneCode(lane.code)}
 className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
 !isAvailable
 ? 'opacity-50 cursor-not-allowed bg-theme-muted/20 border-theme-subtle'
 : isSelected
 ? 'bg-theme-primary-light border-theme-primary text-theme-primary ring-2 ring-theme-primary/30 cursor-pointer'
 : 'bg-theme-muted/30 border-theme-subtle hover:bg-theme-muted cursor-pointer text-theme-main'
 }`}
 >
 <div className="flex items-center justify-between">
 <strong className="text-sm font-mono font-black">{lane.code}</strong>
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 lane.status === 'Disponible'
 ? 'border-emerald-600 '
 : lane.status === 'Ocupado'
 ? 'border-theme-primary'
 : 'border-amber-500'
 }`}>
 {lane.status}
 </span>
 </div>

 <span className="text-[10px] text-theme-muted block">{lane.name}</span>

 {lane.isSuggested && (
 <div className="flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 pt-1">
 <Sparkles className="w-3 h-3" />
 <span>Sugerido por sistema</span>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Lane Explanation Box */}
 {selectedLane.isSuggested && (
 <div className="p-3.5 rounded-2xl bg-white border border-amber-500 text-zinc-900 shadow-2xs text-xs space-y-1">
 <strong className="text-xs font-bold block text-zinc-900">
 Motivo de Asignación Sugerida ({selectedLane.code}):
 </strong>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
 {selectedLane.suggestionReason}
 </p>
 </div>
 )}

 {/* Operator Assignment */}
 <div className="pt-2 border-t border-theme-subtle space-y-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Verificador Responsable:
 </label>
 <select
 value={operator}
 onChange={(e) => setOperator(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Verificador Mesa 01 (Roberto Garza)">Verificador Mesa 01 (Roberto Garza)</option>
 <option value="Verificador Mesa 02 (Alejandro Ríos)">Verificador Mesa 02 (Alejandro Ríos)</option>
 <option value="Supervisor Mesa Sur (Mario Cantú)">Supervisor Mesa Sur (Mario Cantú)</option>
 </select>
 </div>
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold border border-theme-subtle transition-colors cursor-pointer"
 >
 Cancelar
 </button>

 <button
 onClick={handleConfirmCreate}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Crear orden de verificación ({selectedLaneCode})</span>
 </button>
 </div>
 </div>
 </ModalPortal>
 );
};
