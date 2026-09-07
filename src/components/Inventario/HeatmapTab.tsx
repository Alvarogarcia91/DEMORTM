import React, { useState, useMemo } from 'react';
import { 
 Flame, 
 Building2, 
 Clock, 
 Activity, 
 Layers, 
 TrendingUp, 
 PieChart, 
 MapPin, 
 X,
 Truck,
 ShieldAlert,
 Boxes,
 RotateCcw,
 Sparkles,
 AlertTriangle,
 ChevronRight,
 Eye,
 Info,
 Zap,
 ArrowRight,
 Check,
 Compass,
 LayoutGrid
} from 'lucide-react';
import { MOCK_WAREHOUSES_LIST, WarehouseLayout } from '../../data/mockInventoryData';
import { getRearrangementSuggestions, RearrangementSuggestion } from '../../data/mockReorderSuggestions';
import { RearrangementAnalysisModal } from './RearrangementAnalysisModal';
import { ExecuteRearrangementModal, RearrangementOrderRecord } from './ExecuteRearrangementModal';
import { ModalPortal } from '../common/ModalPortal';

interface PositionActivityLevel {
 levelCode: 'C' | 'B' | 'A';
 locationCode: string;
 touches: number;
 entries: number;
 exits: number;
 transfers: number;
}

interface PositionActivity {
 aisle: string;
 positionNumber: string;
 positionId: string;
 totalTouches: number;
 entries: number;
 exits: number;
 transfers: number;
 levels: PositionActivityLevel[];
}

interface SpecialAreaActivity {
 code: string;
 name: string;
 type: string;
 touches: number;
}

// =========================================================================
// DETERMINISTIC REALISTIC HEATMAP ACTIVITY GENERATOR
// =========================================================================
function generateWarehouseActivity(warehouse: WarehouseLayout, periodDays: number): {
 aislesActivity: Record<string, Record<string, PositionActivity>>;
 specialAreasActivity: SpecialAreaActivity[];
 totalTouches: number;
 activeLocationsCount: number;
 totalLocationsCount: number;
 maxCellTouches: number;
} {
 const multiplier = periodDays === 7 ? 0.35 : periodDays === 90 ? 2.8 : 1.0;
 const aislesActivity: Record<string, Record<string, PositionActivity>> = {};
 let totalTouches = 0;
 let activeLocationsCount = 0;
 let totalLocationsCount = 0;
 let maxCellTouches = 0;

 warehouse.aisles.forEach((aisle) => {
 const aisleLetter = aisle.aisleCode.replace('Pasillo ', '').trim();
 aislesActivity[aisleLetter] = {};

 let aisleFactor = 1.0;
 if (aisleLetter === 'A') aisleFactor = 1.6;
 else if (aisleLetter === 'B') aisleFactor = 1.35;
 else if (aisleLetter === 'C') aisleFactor = 1.0;
 else if (aisleLetter === 'D') aisleFactor = 0.7;
 else if (aisleLetter === 'E') aisleFactor = 0.45;

 aisle.positions.forEach((pos) => {
 const posNum = parseInt(pos.positionNumber, 10);
 let posFactor = 1.0;
 if (posNum <= 3) posFactor = 1.7;
 else if (posNum <= 6) posFactor = 1.2;
 else if (posNum <= 9) posFactor = 0.75;
 else posFactor = 0.35;

 const pseudoSeed = (aisleLetter.charCodeAt(0) * 17 + posNum * 31) % 10;
 const variation = (pseudoSeed - 4.5) * 0.15;

 const baseColumn = Math.max(0, Math.round((10 * aisleFactor * posFactor + variation * 8) * multiplier));

 const levelAMoves = Math.round(baseColumn * 0.52);
 const levelBMoves = Math.round(baseColumn * 0.33);
 const levelCMoves = Math.max(0, baseColumn - levelAMoves - levelBMoves);
 const computedTotal = levelAMoves + levelBMoves + levelCMoves;

 if (computedTotal > maxCellTouches) {
 maxCellTouches = computedTotal;
 }

 totalTouches += computedTotal;

 const levels: PositionActivityLevel[] = [
 {
 levelCode: 'C',
 locationCode: `${aisleLetter}-C-${pos.positionNumber}`,
 touches: levelCMoves,
 entries: Math.round(levelCMoves * 0.3),
 exits: Math.round(levelCMoves * 0.4),
 transfers: Math.max(0, levelCMoves - Math.round(levelCMoves * 0.3) - Math.round(levelCMoves * 0.4)),
 },
 {
 levelCode: 'B',
 locationCode: `${aisleLetter}-B-${pos.positionNumber}`,
 touches: levelBMoves,
 entries: Math.round(levelBMoves * 0.35),
 exits: Math.round(levelBMoves * 0.4),
 transfers: Math.max(0, levelBMoves - Math.round(levelBMoves * 0.35) - Math.round(levelBMoves * 0.4)),
 },
 {
 levelCode: 'A',
 locationCode: `${aisleLetter}-A-${pos.positionNumber}`,
 touches: levelAMoves,
 entries: Math.round(levelAMoves * 0.4),
 exits: Math.round(levelAMoves * 0.45),
 transfers: Math.max(0, levelAMoves - Math.round(levelAMoves * 0.4) - Math.round(levelAMoves * 0.45)),
 },
 ];

 levels.forEach(l => {
 totalLocationsCount++;
 if (l.touches > 0) activeLocationsCount++;
 });

 const entries = levels.reduce((acc, l) => acc + l.entries, 0);
 const exits = levels.reduce((acc, l) => acc + l.exits, 0);
 const transfers = levels.reduce((acc, l) => acc + l.transfers, 0);

 aislesActivity[aisleLetter][pos.positionNumber] = {
 aisle: aisleLetter,
 positionNumber: pos.positionNumber,
 positionId: `${aisleLetter}-${pos.positionNumber}`,
 totalTouches: computedTotal,
 entries,
 exits,
 transfers,
 levels,
 };
 });
 });

 const specialAreasActivity: SpecialAreaActivity[] = [
 {
 code: 'REC',
 name: 'Recepción & Rampas',
 type: 'Recepción',
 touches: Math.round((warehouse.code === 'ALM-RTM' ? 52 : 36) * multiplier),
 },
 {
 code: 'RET',
 name: warehouse.reworkZone.name,
 type: 'Retrabajo',
 touches: Math.round((warehouse.code === 'ALM-RTM' ? 14 : 9) * multiplier),
 },
 ...warehouse.shippingLanes.map((lane, idx) => ({
 code: lane.code,
 name: lane.name,
 type: 'Embarque',
 touches: Math.round((idx === 0 ? 38 : idx === 1 ? 44 : idx === 3 ? 24 : 12) * multiplier),
 })),
 ];

 return {
 aislesActivity,
 specialAreasActivity,
 totalTouches,
 activeLocationsCount,
 totalLocationsCount,
 maxCellTouches: Math.max(1, maxCellTouches),
 };
}

// =========================================================================
// HEATMAP COLOR SCALE (IMPRESOS RTM PALETTE: 0 -> Baja -> Media -> Alta -> Muy Alta)
// =========================================================================
function getHeatColorClass(touches: number): {
 bg: string;
 border: string;
 text: string;
 badge: string;
} {
 if (touches === 0) {
 return {
 bg: 'bg-theme-muted/50 hover:bg-theme-muted',
 border: 'border-theme-subtle',
 text: 'text-theme-muted',
 badge: 'bg-theme-muted text-theme-muted border-theme-subtle',
 };
 }
 if (touches <= 3) {
 return {
 bg: 'bg-emerald-500/15 hover:bg-emerald-500/25',
 border: 'border-emerald-500/30',
 text: 'text-emerald-700 font-semibold',
 badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
 };
 }
 if (touches <= 6) {
 return {
 bg: 'bg-amber-400/25 hover:bg-amber-400/35',
 border: 'border-amber-400/40',
 text: 'text-amber-800 font-bold',
 badge: 'bg-amber-400/20 text-amber-800 border-amber-400/40',
 };
 }
 if (touches <= 10) {
 return {
 bg: 'bg-orange-500/30 hover:bg-orange-500/40',
 border: 'border-orange-500/50',
 text: 'text-orange-900 font-extrabold',
 badge: 'bg-orange-500/20 text-orange-900 border-orange-500/40',
 };
 }
 return {
 bg: 'bg-theme-primary text-white hover:bg-theme-primary-hover shadow-xs',
 border: 'border-theme-primary ring-1 ring-theme-primary/30',
 text: 'text-white font-black',
 badge: 'bg-theme-primary text-white border-theme-primary',
 };
}

export const HeatmapTab: React.FC = () => {
 const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-alm-rtm');
 const [periodDays, setPeriodDays] = useState<number>(30);
 
 // Drill-down Modals
 const [selectedPositionModal, setSelectedPositionModal] = useState<PositionActivity | null>(null);
 const [selectedRearrangementAnalysis, setSelectedRearrangementAnalysis] = useState<RearrangementSuggestion | null>(null);
 const [selectedOrderToExecute, setSelectedOrderToExecute] = useState<RearrangementOrderRecord | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Active warehouse
 const currentWarehouse: WarehouseLayout = useMemo(() => {
 return MOCK_WAREHOUSES_LIST.find(w => w.id === selectedWarehouseId) || MOCK_WAREHOUSES_LIST[0];
 }, [selectedWarehouseId]);

 // Compute Heatmap Activity Data
 const heatmapData = useMemo(() => {
 return generateWarehouseActivity(currentWarehouse, periodDays);
 }, [currentWarehouse, periodDays]);

 // Compute Intelligent Rearrangement Suggestions Data
 const rearrangementData = useMemo(() => {
 return getRearrangementSuggestions(selectedWarehouseId);
 }, [selectedWarehouseId]);

 // Handler: Generate Rearrangement Order
 const handleGenerateRearrangement = (sug: RearrangementSuggestion) => {
 const nextFolio = `RA-2026-0019`;

 const newOrder: RearrangementOrderRecord = {
 id: `ord-${Date.now()}`,
 folio: nextFolio,
 uid: sug.uid.includes('(') ? sug.uid.split('(')[0].trim() : sug.uid,
 sku: sug.sku,
 productName: sug.productName,
 brand: sug.brand,
 size: sug.size,
 warehouseId: sug.warehouseId,
 warehouseName: sug.warehouseName,
 originLocation: sug.currentLocation.includes('/') ? sug.currentLocation.split('/')[0].trim() : sug.currentLocation,
 destinationLocation: sug.suggestedLocation.includes('/') ? sug.suggestedLocation.split('/')[0].trim() : sug.suggestedLocation,
 reasonType: sug.reasonType,
 status: 'Pendiente',
 createdAt: '27 Ago 2026',
 };

 setSelectedRearrangementAnalysis(null);
 setSelectedOrderToExecute(newOrder);
 };

 // Handler: Confirm Successful Execution
 const handleConfirmSuccess = (completedOrder: RearrangementOrderRecord) => {
 setSelectedOrderToExecute(null);
 setToastMessage(`Orden ${completedOrder.folio} ejecutada con éxito: ${completedOrder.uid} movido a ${completedOrder.destinationLocation}`);
 setTimeout(() => setToastMessage(null), 4000);
 };

 // Sorted Aisles from top to bottom (e.g. E -> D -> C -> B -> A)
 const sortedAisles = useMemo(() => {
 return [...currentWarehouse.aisles].reverse();
 }, [currentWarehouse]);

 // Max positions across aisles
 const maxPositions = useMemo(() => {
 let max = 0;
 currentWarehouse.aisles.forEach(a => {
 if (a.positions.length > max) max = a.positions.length;
 });
 const nums: string[] = [];
 for (let i = 1; i <= max; i++) {
 nums.push(i < 10 ? `0${i}` : `${i}`);
 }
 return nums;
 }, [currentWarehouse]);

 const rotationAverage = useMemo(() => {
 if (heatmapData.activeLocationsCount === 0) return '0.0';
 return (heatmapData.totalTouches / heatmapData.activeLocationsCount).toFixed(1);
 }, [heatmapData]);

 const getUrgencyBadge = (urgency: string) => {
 switch (urgency) {
 case 'Crítico':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 case 'Alto':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'Medio':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 }
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-200">
 
 {/* ========================================================================= */}
 {/* HEADER + TOOLBAR (SELECTORES DE ALMACÉN Y PERIODO) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-2.5">
 <Flame className="w-5 h-5 text-theme-primary shrink-0 animate-pulse" />
 <h2 className="text-sm sm:text-base font-bold text-theme-main tracking-tight">
 Mapa de Calor de Actividad Operativa
 </h2>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Actividad acumulada por ubicación física del almacén. La intensidad representa la cantidad de movimientos registrados.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
 
 {/* Selector de Almacén */}
 <div className="flex items-center gap-2 bg-theme-muted p-1.5 px-3 rounded-xl border border-theme-subtle">
 <Building2 className="w-4 h-4 text-theme-muted shrink-0" />
 <select
 value={selectedWarehouseId}
 onChange={(e) => setSelectedWarehouseId(e.target.value)}
 className="bg-transparent text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 {MOCK_WAREHOUSES_LIST.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name} ({wh.code})
 </option>
 ))}
 </select>
 </div>

 {/* Selector de Periodo (7, 30, 90 días) */}
 <div className="flex items-center gap-2 bg-theme-muted p-1.5 px-3 rounded-xl border border-theme-subtle">
 <Clock className="w-4 h-4 text-theme-muted shrink-0" />
 <select
 value={periodDays}
 onChange={(e) => setPeriodDays(Number(e.target.value))}
 className="bg-transparent text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value={7}>Últimos 7 días</option>
 <option value={30}>Últimos 30 días</option>
 <option value={90}>Últimos 90 días</option>
 </select>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 4 KPIS COMPACTOS INSPIRADOS EN ADS ERP */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
 
 {/* KPI 1: Actividad Total */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-4 shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
 Actividad Total
 </span>
 <span className="text-xl sm:text-2xl font-extrabold text-theme-main tracking-tight font-mono">
 {heatmapData.totalTouches.toLocaleString()} <span className="text-xs font-semibold text-theme-muted">movs</span>
 </span>
 </div>
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
 <Activity className="w-5 h-5" />
 </div>
 </div>

 {/* KPI 2: Ubicaciones Activas */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-4 shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
 Ubicaciones Activas
 </span>
 <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 tracking-tight font-mono">
 {heatmapData.activeLocationsCount} <span className="text-xs font-semibold text-theme-muted">/ {heatmapData.totalLocationsCount}</span>
 </span>
 </div>
 <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 border border-emerald-600 shadow-2xs flex items-center justify-center">
 <Layers className="w-5 h-5" />
 </div>
 </div>

 {/* KPI 3: Pico Máximo por Posición */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-4 shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
 Pico Máx. por Posición
 </span>
 <span className="text-xl sm:text-2xl font-extrabold text-theme-primary tracking-tight font-mono">
 {heatmapData.maxCellTouches} <span className="text-xs font-semibold text-theme-muted">movs</span>
 </span>
 </div>
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20">
 <TrendingUp className="w-5 h-5" />
 </div>
 </div>

 {/* KPI 4: Rotación Promedio */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-4 shadow-xs flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block">
 Rotación Promedio
 </span>
 <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 tracking-tight font-mono">
 {rotationAverage} <span className="text-xs font-semibold text-theme-muted">movs/ub</span>
 </span>
 </div>
 <div className="w-10 h-10 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center">
 <PieChart className="w-5 h-5" />
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* MATRIZ DE MAPA DE CALOR: EJE Y = PASILLOS, EJE X = POSICIONES */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-6">
 
 {/* Leyenda de Densidad Térmica */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-theme-subtle gap-3">
 <div className="flex items-center gap-2">
 <MapPin className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">
 Matriz de Racks (Eje Y: Pasillos · Eje X: Posiciones)
 </h3>
 </div>

 {/* Escala Visual de Densidad */}
 <div className="flex items-center gap-2 text-xs bg-theme-muted/60 px-3 py-1.5 rounded-xl border border-theme-subtle">
 <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">Densidad:</span>
 <div className="flex items-center gap-1.5 text-[11px] font-semibold text-theme-main">
 <span>0</span>
 <div className="w-3.5 h-3.5 bg-theme-muted border border-theme-subtle rounded" title="0 movimientos" />
 <span className="text-theme-muted">&rarr;</span>
 <span>Baja (1-3)</span>
 <div className="w-3.5 h-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded" title="1-3 movimientos" />
 <span>Media (4-6)</span>
 <div className="w-3.5 h-3.5 bg-amber-400/30 border border-amber-400/50 rounded" title="4-6 movimientos" />
 <span>Alta (7-10)</span>
 <div className="w-3.5 h-3.5 bg-orange-500/30 border border-orange-500/50 rounded" title="7-10 movimientos" />
 <span>Muy Alta (11+)</span>
 <div className="w-3.5 h-3.5 bg-theme-primary border border-theme-primary rounded shadow-xs" title="11+ movimientos" />
 </div>
 </div>
 </div>

 {/* Canvas Matriz con Scroll Horizontal Responsivo */}
 <div className="overflow-x-auto pb-4 pt-1">
 <div className="min-w-[760px] space-y-2">
 
 {/* Cabecera Eje X: Números de Posición */}
 <div className="flex items-center gap-1.5 pl-28 pr-2 mb-2">
 <div className="text-[10px] font-bold text-theme-muted font-mono tracking-wider mr-2 w-14">
 POS &rarr;
 </div>
 {maxPositions.map((posNum) => (
 <div
 key={posNum}
 className="w-11 text-center text-[11px] font-mono font-bold text-theme-muted shrink-0"
 >
 {posNum}
 </div>
 ))}
 </div>

 {/* Filas Eje Y: Pasillos (De arriba hacia abajo: E, D, C, B, A) */}
 {sortedAisles.map((aisle) => {
 const aisleLetter = aisle.aisleCode.replace('Pasillo ', '').trim();
 const aisleActivity = heatmapData.aislesActivity[aisleLetter] || {};

 return (
 <div
 key={aisle.aisleCode}
 className="flex items-center gap-1.5 py-1 px-1 rounded-xl hover:bg-theme-muted/30 transition-colors"
 >
 {/* Botón / Etiqueta del Pasillo */}
 <div className="w-28 text-left text-xs font-bold font-mono px-3 py-2 rounded-xl bg-theme-muted text-theme-main border border-theme-subtle shrink-0 flex items-center justify-between shadow-xs">
 <span>{aisle.aisleCode}</span>
 </div>

 {/* Celdas de Posición con color térmico e indicador de toques */}
 <div className="flex items-center gap-1.5 flex-1">
 {maxPositions.map((posNum) => {
 const posData = aisleActivity[posNum];

 if (!posData) {
 return (
 <div
 key={posNum}
 className="w-11 h-11 rounded-xl bg-theme-muted/20 border border-dashed border-theme-subtle/40 shrink-0 opacity-25"
 title={`Posición no existente en ${aisle.aisleCode}`}
 />
 );
 }

 const style = getHeatColorClass(posData.totalTouches);

 return (
 <button
 key={posNum}
 type="button"
 onClick={() => setSelectedPositionModal(posData)}
 className={`w-11 h-11 rounded-xl border shrink-0 flex flex-col items-center justify-center transition-all duration-150 font-mono text-xs cursor-pointer hover:scale-110 hover:z-20 hover:ring-2 hover:ring-theme-primary ${style.bg} ${style.border} ${style.text}`}
 title={`${aisle.aisleCode} · Posición ${posNum}\nMovimientos acumulados: ${posData.totalTouches}\nEntradas: ${posData.entries} | Salidas: ${posData.exits} | Traslados: ${posData.transfers}\nClic para ver desglose por niveles`}
 >
 <span className="leading-none">{posData.totalTouches}</span>
 </button>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Zonas Operativas Especiales */}
 <div className="pt-5 border-t border-theme-subtle space-y-3">
 <div className="flex items-center justify-between pb-1">
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Boxes className="w-4 h-4 text-theme-primary" />
 Actividad en Zonas Operativas & Carriles de Embarque
 </h3>
 <span className="text-[11px] text-theme-muted font-mono">Movimientos registrados en el periodo</span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
 {heatmapData.specialAreasActivity.map((area) => {
 const style = getHeatColorClass(area.touches);
 return (
 <div
 key={area.code}
 className="p-3 rounded-xl border border-theme-subtle bg-theme-surface space-y-1.5 shadow-xs"
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-theme-muted text-theme-muted">
 {area.code}
 </span>
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.badge}`}>
 {area.touches} movs
 </span>
 </div>

 <p className="text-[11px] font-bold text-theme-main truncate" title={area.name}>
 {area.name}
 </p>
 <p className="text-[10px] text-theme-muted font-medium">
 {area.type}
 </p>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* SECCIÓN ANALÍTICA PREMIUM: SUGERENCIAS INTELIGENTES DE REACOMODO */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-6 shadow-xs space-y-6">
 
 {/* Section Header */}
 <div className="space-y-2">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shrink-0">
 <Zap className="w-4.5 h-4.5" />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-theme-main tracking-tight flex items-center gap-2">
 Sugerencias Inteligentes de Reacomodo
 <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
 OPTIMIZACIÓN DE LAYOUT
 </span>
 </h3>
 <p className="text-xs text-theme-muted">
 Recomendaciones automáticas para mejorar la ubicación física de los artículos con base en rotación, recolección, recorridos y actividad operativa.
 </p>
 </div>
 </div>

 <span className="text-[11px] font-mono text-theme-muted font-semibold bg-theme-muted px-2.5 py-1 rounded-xl border border-theme-subtle">
 Almacén Activo: <strong className="text-theme-main">{currentWarehouse.name}</strong>
 </span>
 </div>

 {/* Explanatory Help Block */}
 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-xs text-theme-muted flex items-start gap-2.5">
 <Info className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
 <p className="leading-relaxed">
 El sistema analiza movimientos históricos, frecuencia de recolección, zonas de mayor movimiento, antigüedad y distancia hacia embarques para sugerir mejores ubicaciones dentro del almacén.
 </p>
 </div>
 </div>

 {/* A) RESUMEN EJECUTIVO (4 INDICADORES DE OPTIMIZACIÓN DE LAYOUT) */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
 
 <div className="p-3.5 rounded-xl bg-white border border-purple-500 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block flex items-center gap-1">
 <Zap className="w-3.5 h-3.5" />
 Movimientos Sugeridos
 </span>
 <span className="text-xl font-extrabold text-zinc-900 font-mono block">
 {rearrangementData.suggestedMovesCount} <span className="text-xs font-semibold text-theme-muted">reubicaciones</span>
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-white border border-emerald-600 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
 <Compass className="w-3.5 h-3.5" />
 Ahorro Estimado de Recorrido
 </span>
 <span className="text-xl font-extrabold text-zinc-900 font-mono block">
 {rearrangementData.estimatedMetersSavedPerDay} <span className="text-xs font-semibold text-theme-muted">m / día</span>
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-white border border-amber-500 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block flex items-center gap-1">
 <AlertTriangle className="w-3.5 h-3.5" />
 Alta Rotación Mal Ubicada
 </span>
 <span className="text-xl font-extrabold text-zinc-900 font-mono block">
 {rearrangementData.highRotationMisplacedCount} <span className="text-xs font-semibold text-theme-muted">SKUs</span>
 </span>
 </div>

 <div className="p-3.5 rounded-xl bg-white border border-blue-500 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block flex items-center gap-1">
 <Boxes className="w-3.5 h-3.5" />
 Liberación de Frente Picking
 </span>
 <span className="text-xl font-extrabold text-zinc-900 font-mono block">
 {rearrangementData.possibleConsolidationZonesCount} <span className="text-xs font-semibold text-theme-muted">Zonas</span>
 </span>
 </div>
 </div>

 {/* B) TABLA ADMINISTRATIVA DE SUGERENCIAS DE REACOMODO */}
 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4 min-w-[200px]">Artículo</th>
 <th className="py-3 px-4 whitespace-nowrap">SKU</th>
 <th className="py-3 px-4 whitespace-nowrap">UID / Unidades</th>
 <th className="py-3 px-4 whitespace-nowrap">Ubicación Actual</th>
 <th className="py-3 px-4 whitespace-nowrap">Ubicación Sugerida</th>
 <th className="py-3 px-4 text-center whitespace-nowrap">Rotación</th>
 <th className="py-3 px-4 text-center whitespace-nowrap">Recolección 30d</th>
 <th className="py-3 px-4 text-center whitespace-nowrap">Dist. Actual</th>
 <th className="py-3 px-4 text-center whitespace-nowrap">Dist. Sugerida</th>
 <th className="py-3 px-4 min-w-[180px]">Beneficio Estimado</th>
 <th className="py-3 px-4 min-w-[220px]">Motivo Operativo</th>
 <th className="py-3 px-4 text-right whitespace-nowrap">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {rearrangementData.suggestions.map((sug) => {
 const isPositive = sug.currentDistanceMeters > sug.suggestedDistanceMeters;
 return (
 <tr key={sug.id} className="hover:bg-theme-muted/40 transition-colors">
 
 {/* Artículo */}
 <td className="py-3 px-4 font-bold text-theme-main">
 <div className="space-y-0.5">
 <span className="block font-black text-theme-main">{sug.productName}</span>
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className="text-[10px] text-theme-muted font-medium">{sug.brand} &middot; {sug.size}</span>
 {sug.isHeatmapBased && (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs flex items-center gap-1">
 <Flame className="w-3 h-3 text-amber-600 shrink-0" />
 <span>Basado en mapa de calor</span>
 </span>
 )}
 </div>
 </div>
 </td>

 {/* SKU */}
 <td className="py-3 px-4 font-mono font-semibold text-theme-primary whitespace-nowrap">
 {sug.sku}
 </td>

 {/* UID / Unidades */}
 <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
 <span className="px-2 py-0.5 rounded bg-theme-muted/70 text-theme-main font-bold border border-theme-subtle">
 {sug.uid}
 </span>
 {sug.unitsLabel && (
 <span className="block text-[9px] text-theme-muted font-sans font-semibold mt-0.5">
 {sug.unitsLabel}
 </span>
 )}
 </td>

 {/* Ubicación Actual */}
 <td className="py-3 px-4 whitespace-nowrap">
 <div className="space-y-1">
 <span className="font-mono text-xs font-black text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block">
 {sug.currentLocation}
 </span>
 {sug.isSuboptimal && (
 <span className="block text-[9px] font-bold text-rose-600">
 Ubicación subóptima
 </span>
 )}
 </div>
 </td>

 {/* Ubicación Sugerida */}
 <td className="py-3 px-4 whitespace-nowrap">
 <div className="space-y-1">
 <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
 {sug.suggestedLocation}
 </span>
 {sug.isHotZone && (
 <span className="block text-[9px] font-bold text-orange-600 flex items-center gap-0.5">
 <Flame className="w-2.5 h-2.5" />
 Zona caliente
 </span>
 )}
 </div>
 </td>

 {/* Rotación */}
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
 sug.rotation === 'Alta'
 ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
 : sug.rotation === 'Media'
 ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
 : 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30'
 }`}>
 {sug.rotation}
 </span>
 </td>

 {/* Picking 30d */}
 <td className="py-3 px-4 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {sug.pickings30d} recolecciones
 </td>

 {/* Distancia Actual */}
 <td className="py-3 px-4 text-center font-mono text-theme-muted whitespace-nowrap">
 {sug.currentDistanceMeters} m
 </td>

 {/* Distancia Sugerida */}
 <td className="py-3 px-4 text-center font-mono font-black text-emerald-600 whitespace-nowrap">
 {sug.suggestedDistanceMeters} m
 </td>

 {/* Beneficio Estimado */}
 <td className="py-3 px-4 whitespace-nowrap">
 <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 inline-block">
 {sug.benefit}
 </span>
 </td>

 {/* Motivo Operativo */}
 <td className="py-3 px-4 text-theme-main text-[11px] leading-tight">
 {sug.primaryReason}
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => setSelectedRearrangementAnalysis(sug)}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-all border border-theme-subtle inline-flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Ver análisis</span>
 </button>

 <button
 onClick={() => handleGenerateRearrangement(sug)}
 className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
 >
 <Zap className="w-3.5 h-3.5" />
 <span>Generar reacomodo</span>
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* MODAL DRILL-DOWN: DESGLOSE POR NIVELES FÍSICOS */}
 {/* ========================================================================= */}
 {selectedPositionModal && (
 <ModalPortal onClose={() => setSelectedPositionModal(null)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[90vh]">
 
 {/* Modal Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center border border-theme-primary/20 font-mono font-bold text-sm">
 {selectedPositionModal.aisle}-{selectedPositionModal.positionNumber}
 </div>
 <div>
 <h3 className="text-sm font-bold text-theme-main">
 Pasillo {selectedPositionModal.aisle} &middot; Posición {selectedPositionModal.positionNumber}
 </h3>
 <p className="text-[11px] text-theme-muted">
 Desglose de actividad histórica por niveles físicos ({currentWarehouse.name} &middot; {periodDays} días)
 </p>
 </div>
 </div>

 <button
 onClick={() => setSelectedPositionModal(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* Resumen Acumulado de la Columna */}
 <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-center font-mono">
 <div>
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Total Movs</span>
 <span className="text-base font-extrabold text-theme-main">{selectedPositionModal.totalTouches}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-emerald-600 block">Entradas</span>
 <span className="text-base font-extrabold text-emerald-600">{selectedPositionModal.entries}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-amber-600 block">Salidas</span>
 <span className="text-base font-extrabold text-amber-600">{selectedPositionModal.exits}</span>
 </div>
 <div>
 <span className="text-[10px] uppercase font-bold text-indigo-600 block">Traslados</span>
 <span className="text-base font-extrabold text-indigo-600">{selectedPositionModal.transfers}</span>
 </div>
 </div>

 {/* Visualización de Niveles Físicos */}
 <div className="space-y-3">
 <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Actividad por Nivel Físico Vertical (De Arriba hacia Abajo)
 </span>

 <div className="space-y-2.5">
 {selectedPositionModal.levels.map((lvl) => {
 const levelStyle = getHeatColorClass(lvl.touches);
 return (
 <div
 key={lvl.levelCode}
 className="p-3.5 rounded-xl border border-theme-subtle bg-theme-surface flex items-center justify-between shadow-xs"
 >
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-theme-muted border border-theme-subtle flex items-center justify-center font-mono font-bold text-xs text-theme-main">
 {lvl.levelCode}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-theme-main">Nivel {lvl.levelCode}</span>
 <span className="font-mono text-[10px] text-theme-muted">{lvl.locationCode}</span>
 </div>
 <p className="text-[11px] text-theme-muted">
 Entradas: {lvl.entries} &middot; Salidas: {lvl.exits} &middot; Traslados: {lvl.transfers}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${levelStyle.badge}`}>
 {lvl.touches} movs
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Modal Footer */}
 <div className="px-6 py-3.5 border-t border-theme-subtle flex items-center justify-between bg-theme-muted/40 text-[11px] text-theme-muted">
 <span>Representa actividad física acumulada</span>
 <button
 onClick={() => setSelectedPositionModal(null)}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs font-bold">
 <Check className="w-5 h-5 text-white shrink-0" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* Modal Drill-Down: Análisis de Reacomodo Inteligente */}
 <RearrangementAnalysisModal
 suggestion={selectedRearrangementAnalysis}
 onClose={() => setSelectedRearrangementAnalysis(null)}
 onGenerateOrder={(sug) => handleGenerateRearrangement(sug)}
 />

 {/* Modal de Ejecución de Reacomodo */}
 <ExecuteRearrangementModal
 order={selectedOrderToExecute}
 onClose={() => setSelectedOrderToExecute(null)}
 onConfirmSuccess={(completedOrder) => handleConfirmSuccess(completedOrder)}
 />
 </div>
 );
};

