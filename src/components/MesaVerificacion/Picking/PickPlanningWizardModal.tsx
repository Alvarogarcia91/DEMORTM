import React, { useState } from 'react';
import { 
 X, 
 Sparkles, 
 ArrowRightLeft, 
 MapPin, 
 TrendingDown, 
 Check, 
 Star, 
 Clock, 
 Tag, 
 ArrowRight, 
 Layers, 
 Building2, 
 ShieldCheck, 
 Calendar,
 Compass,
 RotateCcw
} from 'lucide-react';
import { 
 PendingPickingDemand, 
 PickingStrategyType, 
 PickOrder, 
 PickPlanStop, 
 STRATEGY_COMPARISONS,
 ORDERED_PICKING_STRATEGIES,
 calculateUnitsForStrategy
} from '../../../data/mockPickingData';
import { MOCK_STOCK_ITEMS } from '../../../data/mockInventoryData';
import { ModalPortal } from '../../common/ModalPortal';

interface PickPlanningWizardModalProps {
 demand: PendingPickingDemand;
 onClose: () => void;
 onCreateOrder: (newOrder: PickOrder) => void;
}

export const PickPlanningWizardModal: React.FC<PickPlanningWizardModalProps> = ({
 demand,
 onClose,
 onCreateOrder,
}) => {
 // Determine if this demand comes with an inherited plan from a transfer or prior planning
 const initialStrategy: PickingStrategyType = demand.plannedStrategy || (demand.referenceFolio.startsWith('OTP-') ? 'EMPTY_LOCATION' : 'RECOMMENDED');
 const [selectedStrategy, setSelectedStrategy] = useState<PickingStrategyType>(initialStrategy);
 const [isInheritedPlan, setIsInheritedPlan] = useState<boolean>(() => {
 return !!demand.plannedStrategy || demand.referenceFolio.startsWith('OTP-');
 });

 const [operator, setOperator] = useState('Operador Mesa 01 (Carlos Medina)');

 // Helper to generate stops based on demand items and strategy
 const generateStops = (strat: PickingStrategyType): PickPlanStop[] => {
 let allStops: PickPlanStop[] = [];
 let seq = 1;

 demand.itemsSummary.forEach((item) => {
 const calculated = calculateUnitsForStrategy(
 demand.warehouseId,
 item.sku,
 item.quantity,
 strat,
 MOCK_STOCK_ITEMS
 );

 calculated.forEach((calc) => {
 const aisle = calc.location.startsWith('A-') ? 'Pasillo A' : calc.location.startsWith('B-') ? 'Pasillo B' : calc.location.startsWith('C-') ? 'Pasillo C' : 'Área General';
 const level = calc.location.includes('-A-') || calc.location.endsWith('-A') ? 'Nivel A (Piso)' : calc.location.includes('-B-') || calc.location.endsWith('-B') ? 'Nivel B (Medio)' : 'Nivel C (Alto)';
 const pos = calc.location.split('-')[2] || '01';

 allStops.push({
 id: `stop-${calc.uid}-${seq}`,
 sequence: seq++,
 locationCode: calc.location,
 aisle,
 rackPosition: `Posición ${pos}`,
 level,
 uid: calc.uid,
 sku: calc.sku,
 productName: calc.productName,
 brand: calc.brand,
 size: calc.size,
 lotNumber: calc.lotNumber,
 ageDays: calc.ageDays,
 strategyReason: calc.strategyReason,
 strategyBadge: calc.strategyBadge,
 status: 'Pendiente',
 isLocationFreed: calc.isLocationFreed,
 });
 });
 });

 return allStops;
 };

 // Base generated stops based on strategy
 const [plannedStops, setPlannedStops] = useState<PickPlanStop[]>(() => generateStops(initialStrategy));

 // Modal to swap unit for a stop
 const [swappingStop, setSwappingStop] = useState<PickPlanStop | null>(null);

 const currentMetrics = STRATEGY_COMPARISONS[selectedStrategy] || STRATEGY_COMPARISONS['RECOMMENDED'];

 const handleSelectStrategy = (strat: PickingStrategyType) => {
 setSelectedStrategy(strat);
 setIsInheritedPlan(false);
 setPlannedStops(generateStops(strat));
 };

 const handleReplanify = () => {
 setIsInheritedPlan(false);
 setSelectedStrategy('RECOMMENDED');
 setPlannedStops(generateStops('RECOMMENDED'));
 };

 const handleGenerateOrder = () => {
 const newFolioNum = Math.floor(120 + Math.random() * 50);
 const newFolio = `OR-2026-0${newFolioNum}`;
 const now = new Date();
 const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
 const dateStr = `27 Ago 2026, ${timeStr}`;

 const newOrder: PickOrder = {
 id: `or-${Date.now()}`,
 folio: newFolio,
 referenceFolio: demand.referenceFolio,
 type: demand.type,
 strategyType: selectedStrategy,
 strategyName: currentMetrics.label,
 warehouseId: demand.warehouseId,
 warehouseName: demand.warehouseName,
 destinationName: demand.destinationName,
 tempStagingLocation: 'STG-OUT-01',
 priority: demand.priority,
 createdAt: dateStr,
 operatorAssigned: operator,
 status: 'Pendiente',
 totalUnits: plannedStops.length,
 pickedUnits: 0,
 pendingUnits: plannedStops.length,
 estimatedDistanceMeters: currentMetrics.estimatedDistanceMeters,
 traveledDistanceMeters: 0,
 stops: plannedStops,
 };

 onCreateOrder(newOrder);
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Compass className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-rose-600">{demand.referenceFolio}</span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {demand.type}
 </span>
 <span className="text-[10px] font-mono text-theme-muted">
 Destino: <strong className="text-theme-main">{demand.destinationName}</strong>
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Planificación y Estrategia de Recolección
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

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Inherited Plan Banner if applicable */}
 {isInheritedPlan && (
 <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between gap-3 text-xs shadow-2xs">
 <div className="flex items-center gap-2.5 text-purple-950 dark:text-purple-200">
 <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
 <div>
 <strong className="block font-bold">Plan heredado del traspaso ({demand.referenceFolio})</strong>
 <span className="text-[11px] text-purple-900/90 dark:text-purple-200/90">
 Estrategia planeada: <strong>{currentMetrics.label}</strong> &bull; Unidades físicas preasignadas en origen.
 </span>
 </div>
 </div>

 <button
 type="button"
 onClick={handleReplanify}
 className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span>Replanificar</span>
 </button>
 </div>
 )}

 {/* Strategy Selection Cards */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-muted block">
 1. Selecciona la Estrategia de Surtido:
 </span>

 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
 {ORDERED_PICKING_STRATEGIES.map((stType) => {
 const strat = STRATEGY_COMPARISONS[stType];
 const isSelected = selectedStrategy === stType;

 return (
 <div
 key={stType}
 onClick={() => handleSelectStrategy(stType)}
 className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 bg-theme-surface ${
 isSelected
 ? 'border-2 border-theme-primary ring-2 ring-theme-primary/20 text-zinc-900 shadow-xs'
 : 'border-theme-subtle hover:border-theme-primary/40 text-theme-main'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="text-xs font-black block truncate">{strat.label}</span>
 {stType === 'RECOMMENDED' || stType === 'SUGGESTED' ? (
 <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
 ) : (
 <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
 isSelected ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/30' : 'bg-theme-muted text-theme-muted'
 }`}>
 {strat.badge}
 </span>
 )}
 </div>

 <div className="text-[10px] text-theme-muted font-mono space-y-0.5">
 {stType === 'EMPTY_LOCATION' ? (
 <>
 <div className="text-zinc-900 font-bold">Libera: <strong>2 ubicaciones</strong></div>
 <div>Distancia: <strong>{strat.estimatedDistanceMeters} m</strong></div>
 </>
 ) : (
 <>
 <div>Distancia: <strong>{strat.estimatedDistanceMeters} m</strong></div>
 <div>FIFO: <strong>{strat.fifoCompliancePercentage}%</strong></div>
 </>
 )}
 </div>

 <div className="flex items-center text-rose-600 text-[10px]">
 {Array.from({ length: 5 }, (_, i) => (
 <span key={i} className={i < strat.ratingStars ? 'opacity-100' : 'opacity-25'}>
 ★
 </span>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Strategy Explanation & Performance Bar (Subtle & High Contrast) */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 text-zinc-900 shadow-xs">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="flex items-center gap-2">
 <Compass className="w-4 h-4 text-theme-primary shrink-0" />
 <strong className="text-xs font-black block">
 {currentMetrics.panelTitle || `${currentMetrics.label} — Análisis de recorrido`}
 </strong>
 </div>
 <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
 {currentMetrics.locationsFreedCount > 0 && `${currentMetrics.locationsFreedCount} ubicaciones se liberarán completamente · `}
 {plannedStops.length} unidades &bull; {currentMetrics.estimatedDistanceMeters} m estimados &bull; Cumplimiento FIFO {currentMetrics.fifoCompliancePercentage}%
 </span>
 </div>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 {currentMetrics.description}
 </p>
 </div>

 {/* Visual Sequence Route Strip */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between text-[10px] uppercase font-bold text-theme-muted">
 <span>Recorrido Optimizado en Almacén:</span>
 <span className="font-mono text-rose-600 font-bold">Ruta &rarr; {plannedStops.length} posiciones</span>
 </div>

 <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-mono">
 {plannedStops.map((stop, idx) => (
 <React.Fragment key={stop.id}>
 <div className="px-2.5 py-1 rounded-xl bg-theme-surface border border-theme-subtle flex items-center gap-1.5 shrink-0 shadow-2xs">
 <span className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[9px] flex items-center justify-center">
 {stop.sequence}
 </span>
 <strong className="text-theme-main">{stop.locationCode}</strong>
 </div>
 {idx < plannedStops.length - 1 && (
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted shrink-0 opacity-50" />
 )}
 </React.Fragment>
 ))}
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted shrink-0 opacity-50" />
 <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-bold shrink-0">
 STG-OUT-01 (Salida)
 </div>
 </div>
 </div>

 {/* Detailed Stops Table */}
 <div className="space-y-2">
 <span className="text-[10px] uppercase font-extrabold tracking-wider text-theme-main block">
 2. Paradas y UIDs Propuestos ({plannedStops.length} unidades):
 </span>

 <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
 {plannedStops.map((stop) => (
 <div
 key={stop.id}
 className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between gap-3 shadow-2xs text-xs"
 >
 <div className="flex items-center gap-3 min-w-0">
 <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
 #{stop.sequence}
 </span>

 <div className="min-w-0 space-y-0.5">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-rose-600">{stop.locationCode}</span>
 <span className="text-[10px] text-theme-muted">{stop.aisle} &bull; {stop.rackPosition} &bull; {stop.level}</span>
 <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs inline-flex items-center gap-1">
 <span className="w-1 h-1 rounded-full bg-purple-600 shrink-0" />
 <span>{stop.strategyBadge} &bull; {stop.ageDays} días</span>
 </span>
 {stop.isLocationFreed && (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white text-zinc-900 border border-emerald-600 shadow-2xs inline-flex items-center gap-1">
 <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
 <span>Ubicación liberada</span>
 </span>
 )}
 </div>
 <h4 className="text-xs font-bold text-theme-main truncate">{stop.productName}</h4>
 <p className="text-[10px] text-zinc-700 dark:text-zinc-300 font-mono"><strong className="text-zinc-900">{stop.uid}</strong> &bull; {stop.strategyReason}</p>
 </div>
 </div>

 <button
 onClick={() => setSwappingStop(stop)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-[10px] font-bold border border-theme-subtle transition-all cursor-pointer shrink-0"
 >
 Cambiar unidad
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Form Operator Assignment */}
 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-4">
 <div className="space-y-0.5 flex-1">
 <label className="text-[10px] uppercase font-bold text-theme-muted block">
 Operador Responsable de Recolección:
 </label>
 <select
 value={operator}
 onChange={(e) => setOperator(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Operador Mesa 01 (Carlos Medina)">Operador Mesa 01 (Carlos Medina)</option>
 <option value="Operador Mesa 02 (Luis Garza)">Operador Mesa 02 (Luis Garza)</option>
 <option value="Supervisor Mesa Sur (Eduardo Ruiz)">Supervisor Mesa Sur (Eduardo Ruiz)</option>
 </select>
 </div>

 <div className="text-right">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Rampa Temporal:</span>
 <strong className="text-emerald-600 font-mono text-sm">STG-OUT-01</strong>
 </div>
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
 onClick={handleGenerateOrder}
 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Generar orden de recolección ({plannedStops.length} unidades)</span>
 </button>
 </div>
 </div>
 </ModalPortal>

 {/* Mini Unit Swapping Modal */}
 {swappingStop && (
 <ModalPortal onClose={() => setSwappingStop(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle p-5 space-y-4 text-xs">
 <div className="flex items-center justify-between">
 <h3 className="font-extrabold text-theme-main">Cambiar Unidad para Parada #{swappingStop.sequence}</h3>
 <button onClick={() => setSwappingStop(null)} className="cursor-pointer">
 <X className="w-4 h-4 text-theme-muted" />
 </button>
 </div>

 <p className="text-[11px] text-theme-muted">
 Selecciona otra unidad física disponible del mismo SKU ({swappingStop.sku}) en el almacén:
 </p>

 <div className="space-y-2">
 {[
 { uid: 'SC-UID-2026-000109', loc: 'A-A-04', age: 26, dist: 12 },
 { uid: 'SC-UID-2026-000115', loc: 'A-B-02', age: 24, dist: 18 },
 { uid: 'SC-UID-2026-000119', loc: 'B-A-04', age: 20, dist: 35 },
 ].map((alt) => (
 <div
 key={alt.uid}
 onClick={() => {
 setPlannedStops((prev) =>
 prev.map((s) =>
 s.id === swappingStop.id
 ? { ...s, uid: alt.uid, locationCode: alt.loc, ageDays: alt.age }
 : s
 )
 );
 setSwappingStop(null);
 }}
 className="p-2.5 rounded-xl bg-theme-muted/40 hover:bg-rose-500/10 border border-theme-subtle flex items-center justify-between cursor-pointer transition-colors"
 >
 <div>
 <strong className="font-mono text-rose-600 block">{alt.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono">Ubicación: {alt.loc} &bull; Antigüedad: {alt.age} días</span>
 </div>
 <span className="text-[10px] text-emerald-600 font-bold">+{alt.dist} m</span>
 </div>
 ))}
 </div>
 </div>
 </ModalPortal>
 )}
 </>
 );
};
