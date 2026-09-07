import React, { useState } from 'react';
import { 
 Zap, 
 ArrowRight, 
 Flame, 
 Boxes, 
 History, 
 Search, 
 Filter, 
 RotateCcw, 
 CheckCircle2, 
 Clock, 
 MapPin, 
 Building2, 
 QrCode, 
 Sparkles,
 ChevronRight,
 TrendingUp,
 ShieldCheck,
 Radio,
 FileCheck,
 Check,
 AlertCircle
} from 'lucide-react';
import { 
 MOCK_STOCK_ITEMS, 
 MOCK_INVENTORY_MOVEMENTS,
 InventoryMovement 
} from '../../data/mockInventoryData';
import { 
 RearrangementAnalysisModal, 
 RearrangementSuggestionItem 
} from './RearrangementAnalysisModal';
import { 
 ExecuteRearrangementModal, 
 RearrangementOrderRecord 
} from './ExecuteRearrangementModal';
import { StatusBadge } from '../common/StatusBadge';

import { getRearrangementSuggestions, RearrangementSuggestion } from '../../data/mockReorderSuggestions';

// Initial Mock Suggestions from central Layout Optimizer
const INITIAL_SUGGESTIONS: RearrangementSuggestionItem[] = getRearrangementSuggestions('wh-mty-norte').suggestions;


// Initial Mock Active Orders
const INITIAL_ACTIVE_ORDERS: RearrangementOrderRecord[] = [
 {
 id: 'ord-101',
 folio: 'RA-2026-0017',
 uid: 'SC-UID-2026-000150',
 sku: 'SC-SPA-REC-IND',
 productName: 'Spring Air Colchón Record Individual',
 brand: 'Spring Air',
 size: 'Individual',
 warehouseId: 'wh-mty-norte',
 warehouseName: 'CEDIS Monterrey Norte',
 originLocation: 'D-B-02',
 destinationLocation: 'B-B-03',
 reasonType: 'CONSOLIDACIÓN',
 status: 'Pendiente',
 createdAt: '27 Ago 2026',
 },
 {
 id: 'ord-100',
 folio: 'RA-2026-0016',
 uid: 'SC-UID-2026-000122',
 sku: 'SC-RES-ORT-MAT',
 productName: 'Restonic Colchón Ortopedic Matrimonial',
 brand: 'Restonic',
 size: 'Matrimonial',
 warehouseId: 'wh-mty-norte',
 warehouseName: 'CEDIS Monterrey Norte',
 originLocation: 'C-A-05',
 destinationLocation: 'A-A-07',
 reasonType: 'ALTA ROTACIÓN',
 status: 'En ejecución',
 createdAt: '27 Ago 2026',
 },
];

// Initial Mock History
const INITIAL_HISTORY: Array<{
 id: string;
 timestamp: string;
 folio: string;
 uid: string;
 productName: string;
 sku: string;
 origin: string;
 destination: string;
 reason: string;
 executedBy: string;
}> = [
 {
 id: 'hist-01',
 timestamp: '27 Ago 2026 16:30',
 folio: 'RA-2026-0015',
 uid: 'SC-UID-2026-000110',
 productName: 'Spring Air Colchón Record Individual',
 sku: 'SC-SPA-REC-IND',
 origin: 'E-A-02',
 destination: 'B-A-04',
 reason: 'Optimización por alta rotación',
 executedBy: 'Admin Demo (Terminal RF-02)',
 },
 {
 id: 'hist-02',
 timestamp: '26 Ago 2026 14:12',
 folio: 'RA-2026-0014',
 uid: 'SC-UID-2026-000165',
 productName: 'Nayt Colchón Flow Basic White Matrimonial',
 sku: 'SC-NAYT-FLOW-MAT',
 origin: 'D-C-01',
 destination: 'A-B-05',
 reason: 'Consolidación con lote W34',
 executedBy: 'Operador Juan Garza',
 },
 {
 id: 'hist-03',
 timestamp: '25 Ago 2026 11:45',
 folio: 'RA-2026-0013',
 uid: 'SC-UID-2026-000092',
 productName: 'Restonic Colchón Ortopedic Matrimonial',
 sku: 'SC-RES-ORT-MAT',
 origin: 'C-B-08',
 destination: 'A-C-06',
 reason: 'Cumplimiento de rotación FIFO',
 executedBy: 'Supervisor Almacén',
 },
];

interface RearrangementsTabProps {
 onShowToast?: (msg: string) => void;
}

export const RearrangementsTab: React.FC<RearrangementsTabProps> = ({ onShowToast }) => {
 // Subtabs: 'suggestions' (default) | 'active-orders' | 'history'
 const [activeSubtab, setActiveSubtab] = useState<'suggestions' | 'active-orders' | 'history'>('suggestions');

 // State Lists
 const [suggestions, setSuggestions] = useState<RearrangementSuggestionItem[]>(INITIAL_SUGGESTIONS);
 const [activeOrders, setActiveOrders] = useState<RearrangementOrderRecord[]>(INITIAL_ACTIVE_ORDERS);
 const [historyList, setHistoryList] = useState(INITIAL_HISTORY);

 // Filters & Search
 const [searchTerm, setSearchTerm] = useState('');
 const [filterReason, setFilterReason] = useState('all');
 const [filterWarehouse, setFilterWarehouse] = useState('all');

 // Modals state
 const [selectedAnalysisSuggestion, setSelectedAnalysisSuggestion] = useState<RearrangementSuggestionItem | null>(null);
 const [selectedOrderToExecute, setSelectedOrderToExecute] = useState<RearrangementOrderRecord | null>(null);

 // Handler: Generate Order from Suggestion
 const handleGenerateOrder = (sug: RearrangementSuggestionItem) => {
 // Generate new order folio
 const nextFolioNumber = 18 + activeOrders.length;
 const newFolio = `RA-2026-00${nextFolioNumber}`;

 const newOrder: RearrangementOrderRecord = {
 id: `ord-${Date.now()}`,
 folio: newFolio,
 uid: sug.uid,
 sku: sug.sku,
 productName: sug.productName,
 brand: sug.brand,
 size: sug.size,
 warehouseId: sug.warehouseId,
 warehouseName: sug.warehouseName,
 originLocation: sug.currentLocation,
 destinationLocation: sug.suggestedLocation,
 reasonType: sug.reasonType,
 status: 'Pendiente',
 createdAt: '27 Ago 2026',
 };

 // Remove from suggestions
 setSuggestions(prev => prev.filter(s => s.id !== sug.id));
 // Add to active orders
 setActiveOrders(prev => [newOrder, ...prev]);

 // Close analysis modal if open
 setSelectedAnalysisSuggestion(null);

 // Switch to active orders tab
 setActiveSubtab('active-orders');

 if (onShowToast) {
 onShowToast(`Orden ${newFolio} generada con éxito para ${sug.uid}`);
 }
 };

 // Handler: Confirm Executed Rearrangement
 const handleConfirmSuccess = (completedOrder: RearrangementOrderRecord) => {
 // 1. Update active orders (remove completed)
 setActiveOrders(prev => prev.filter(o => o.id !== completedOrder.id && o.folio !== completedOrder.folio));

 // 2. Add to history
 const historyEntry = {
 id: `hist-${Date.now()}`,
 timestamp: '27 Ago 2026 18:55',
 folio: completedOrder.folio,
 uid: completedOrder.uid,
 productName: completedOrder.productName,
 sku: completedOrder.sku,
 origin: completedOrder.originLocation,
 destination: completedOrder.destinationLocation,
 reason: completedOrder.reasonType,
 executedBy: completedOrder.executedBy || 'Admin Demo (Terminal RF-04)',
 };
 setHistoryList(prev => [historyEntry, ...prev]);

 // 3. MUTATE MOCK_STOCK_ITEMS in-place for global live reactivity
 const stockItem = MOCK_STOCK_ITEMS.find(i => i.uid === completedOrder.uid);
 if (stockItem) {
 stockItem.location = completedOrder.destinationLocation;
 }

 // 4. PREPEND TO MOCK_INVENTORY_MOVEMENTS (Kardex)
 const newMovement: InventoryMovement = {
 id: `mov-${Date.now()}`,
 timestamp: '27 Ago 18:55',
 uid: completedOrder.uid,
 sku: completedOrder.sku,
 productName: completedOrder.productName,
 movementType: 'ACOMODO',
 origin: completedOrder.originLocation,
 destination: completedOrder.destinationLocation,
 user: 'Admin Demo (Terminal RF-04)',
 notes: `Reacomodo interno completado bajo Folio ${completedOrder.folio} (${completedOrder.reasonType})`,
 };
 MOCK_INVENTORY_MOVEMENTS.unshift(newMovement);

 if (onShowToast) {
 onShowToast(`Reacomodo ${completedOrder.folio} confirmado: ${completedOrder.uid} ahora en ${completedOrder.destinationLocation}`);
 }
 };

 // Filtered Suggestions
 const filteredSuggestions = suggestions.filter((s) => {
 const q = searchTerm.toLowerCase().trim();
 const matchesSearch = 
 !q ||
 s.uid.toLowerCase().includes(q) ||
 s.sku.toLowerCase().includes(q) ||
 s.productName.toLowerCase().includes(q) ||
 s.currentLocation.toLowerCase().includes(q) ||
 s.suggestedLocation.toLowerCase().includes(q);

 const matchesReason = filterReason === 'all' || s.reasonType === filterReason;
 const matchesWarehouse = filterWarehouse === 'all' || s.warehouseId === filterWarehouse;

 return matchesSearch && matchesReason && matchesWarehouse;
 });

 // Filtered Active Orders
 const filteredActiveOrders = activeOrders.filter((o) => {
 const q = searchTerm.toLowerCase().trim();
 const matchesSearch = 
 !q ||
 o.folio.toLowerCase().includes(q) ||
 o.uid.toLowerCase().includes(q) ||
 o.sku.toLowerCase().includes(q) ||
 o.productName.toLowerCase().includes(q) ||
 o.originLocation.toLowerCase().includes(q) ||
 o.destinationLocation.toLowerCase().includes(q);

 const matchesWarehouse = filterWarehouse === 'all' || o.warehouseId === filterWarehouse;

 return matchesSearch && matchesWarehouse;
 });

 // Filtered History
 const filteredHistory = historyList.filter((h) => {
 const q = searchTerm.toLowerCase().trim();
 return (
 !q ||
 h.folio.toLowerCase().includes(q) ||
 h.uid.toLowerCase().includes(q) ||
 h.sku.toLowerCase().includes(q) ||
 h.productName.toLowerCase().includes(q) ||
 h.origin.toLowerCase().includes(q) ||
 h.destination.toLowerCase().includes(q) ||
 h.executedBy.toLowerCase().includes(q)
 );
 });

 const getReasonBadge = (type: string) => {
 switch (type) {
 case 'ALTA ROTACIÓN':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'CONSOLIDACIÓN':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'LIBERACIÓN DE ESPACIO':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'ANTIGÜEDAD / FIFO':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'BAJA ROTACIÓN':
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full">
 
 {/* ========================================================================= */}
 {/* HEADER & SUBTABS: [ 1. Sugerencias ] [ 2. Órdenes activas ] [ 3. Historial ] */}
 {/* ========================================================================= */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-subtle">
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle w-fit">
 <button
 onClick={() => setActiveSubtab('suggestions')}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'suggestions'
 ? 'bg-theme-primary text-white shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <Zap className="w-4 h-4" />
 <span>Sugerencias Inteligentes</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
 activeSubtab === 'suggestions' ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {suggestions.length}
 </span>
 </button>

 <button
 onClick={() => setActiveSubtab('active-orders')}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'active-orders'
 ? 'bg-theme-primary text-white shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <Radio className="w-4 h-4" />
 <span>Órdenes Activas</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
 activeSubtab === 'active-orders' ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {activeOrders.length}
 </span>
 </button>

 <button
 onClick={() => setActiveSubtab('history')}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'history'
 ? 'bg-theme-primary text-white shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <History className="w-4 h-4" />
 <span>Historial</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
 activeSubtab === 'history' ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {historyList.length}
 </span>
 </button>
 </div>

 {/* Global Summary Chips */}
 <div className="flex items-center gap-2 text-xs flex-wrap">
 <span className="px-3 py-1 rounded-xl bg-white border border-purple-500 shadow-2xs text-zinc-900">
 Recomendaciones: <strong className="font-mono">{suggestions.length}</strong>
 </span>
 <span className="px-3 py-1 rounded-xl bg-white border border-blue-500 shadow-2xs text-zinc-900">
 En Cola: <strong className="font-mono">{activeOrders.length}</strong>
 </span>
 <span className="px-3 py-1 rounded-xl bg-white border border-emerald-600 shadow-2xs text-zinc-900">
 Completados: <strong className="font-mono">{historyList.length}</strong>
 </span>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* TOOLBAR: BUSCADOR & FILTROS */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
 
 {/* Search */}
 <div className="relative w-full md:w-80">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Buscar por UID, SKU, colchón o ubicación..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-10 pr-3 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>

 {/* Filters */}
 <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
 <div className="flex items-center gap-1 text-theme-muted mr-1 hidden sm:flex">
 <Filter className="w-3.5 h-3.5" />
 <span>Filtros:</span>
 </div>

 {/* Almacén */}
 <select
 value={filterWarehouse}
 onChange={(e) => setFilterWarehouse(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los CEDIS</option>
 <option value="wh-mty-norte">CEDIS Monterrey Norte</option>
 <option value="wh-mty-sur">CEDIS Monterrey Sur</option>
 </select>

 {/* Motivo (en Sugerencias) */}
 {activeSubtab === 'suggestions' && (
 <select
 value={filterReason}
 onChange={(e) => setFilterReason(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los motivos</option>
 <option value="ALTA ROTACIÓN">Alta Rotación</option>
 <option value="CONSOLIDACIÓN">Consolidación</option>
 <option value="LIBERACIÓN DE ESPACIO">Liberación de Espacio</option>
 <option value="ANTIGÜEDAD / FIFO">Antigüedad / FIFO</option>
 <option value="BAJA ROTACIÓN">Baja Rotación</option>
 </select>
 )}

 {/* Reset */}
 <button
 onClick={() => {
 setSearchTerm('');
 setFilterReason('all');
 setFilterWarehouse('all');
 }}
 className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
 title="Restablecer filtros"
 >
 <RotateCcw className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* VISTA 1: SUBTAB SUGERENCIAS INTELIGENTES (DEFAULT) */}
 {/* ========================================================================= */}
 {activeSubtab === 'suggestions' && (
 <div className="space-y-4">
 {filteredSuggestions.length === 0 ? (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl p-12 text-center text-theme-muted text-xs">
 No hay sugerencias de reacomodo pendientes que coincidan con los filtros.
 </div>
 ) : (
 <div className="grid grid-cols-1 gap-4">
 {filteredSuggestions.map((sug) => (
 <div
 key={sug.id}
 className="bg-theme-surface border border-theme-subtle rounded-2xl p-5 shadow-xs hover:border-theme-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
 >
 {/* Left: Mattress & Warehouse info */}
 <div className="space-y-2 max-w-lg">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono text-xs font-black text-theme-primary flex items-center gap-1">
 <QrCode className="w-3.5 h-3.5" />
 <span>{sug.uid}</span>
 </span>
 <span className="font-mono text-[11px] font-bold text-theme-muted">{sug.sku}</span>
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getReasonBadge(sug.reasonType)}`}>
 {sug.reasonType}
 </span>
 {sug.isHeatmapBased && (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs flex items-center gap-1">
 <Flame className="w-3 h-3 text-amber-600 shrink-0" />
 <span>Basado en mapa de calor</span>
 </span>
 )}
 </div>

 <div>
 <h3 className="text-sm font-bold text-theme-main">
 {sug.productName}
 </h3>
 <p className="text-xs text-theme-muted mt-0.5">
 {sug.size} &middot; Marca {sug.brand} &middot; <strong className="text-theme-main">{sug.warehouseName}</strong>
 </p>
 </div>

 <p className="text-xs text-theme-muted leading-relaxed">
 {sug.primaryReason}
 </p>
 </div>

 {/* Middle: Movement visualization */}
 <div className="flex items-center gap-4 bg-theme-muted/40 p-3.5 rounded-2xl border border-theme-subtle shrink-0">
 <div className="text-center">
 <span className="text-[9px] uppercase font-bold text-rose-600 block">Actual</span>
 <span className="font-mono text-sm font-black text-theme-main block mt-0.5">{sug.currentLocation}</span>
 <span className="text-[10px] text-theme-muted">{sug.analysis.currentDistanceMeters}m</span>
 </div>

 <div className="flex flex-col items-center">
 <ArrowRight className="w-4 h-4 text-purple-600" />
 <span className="text-[9px] font-mono font-bold text-purple-600 mt-0.5">
 {sug.analysis.distanceReductionPercent > 0 ? `-${sug.analysis.distanceReductionPercent}%` : 'Optimiza'}
 </span>
 </div>

 <div className="text-center">
 <span className="text-[9px] uppercase font-bold text-emerald-600 block">Sugerida</span>
 <span className="font-mono text-sm font-black text-emerald-600 block mt-0.5">{sug.suggestedLocation}</span>
 <span className="text-[10px] text-theme-muted">{sug.analysis.suggestedDistanceMeters}m</span>
 </div>
 </div>

 {/* Right: Actions */}
 <div className="flex items-center gap-2 shrink-0 lg:flex-col lg:items-end">
 <button
 onClick={() => setSelectedAnalysisSuggestion(sug)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-colors border border-theme-subtle cursor-pointer whitespace-nowrap"
 >
 Ver análisis
 </button>
 <button
 onClick={() => handleGenerateOrder(sug)}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
 >
 <span>Generar orden</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISTA 2: SUBTAB ÓRDENES ACTIVAS */}
 {/* ========================================================================= */}
 {activeSubtab === 'active-orders' && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-xs overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[950px]">
 <thead>
 <tr className="border-b border-theme-subtle bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-4">UID / Serie</th>
 <th className="py-3 px-4">Artículo</th>
 <th className="py-3 px-3 text-center">Origen</th>
 <th className="py-3 px-3 text-center">Destino</th>
 <th className="py-3 px-3">Motivo</th>
 <th className="py-3 px-3">CEDIS</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-3">Fecha</th>
 <th className="py-3 px-4 text-center">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredActiveOrders.length === 0 ? (
 <tr>
 <td colSpan={10} className="py-12 text-center text-theme-muted">
 No hay órdenes de reacomodo activas en este momento.
 </td>
 </tr>
 ) : (
 filteredActiveOrders.map((ord) => (
 <tr key={ord.id} className="hover:bg-theme-muted/40 transition-colors">
 {/* Folio */}
 <td className="py-3 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {ord.folio}
 </td>

 {/* UID */}
 <td className="py-3 px-4 font-mono font-bold text-theme-main whitespace-nowrap">
 {ord.uid}
 </td>

 {/* Artículo */}
 <td className="py-3 px-4 font-semibold text-theme-main">
 <div>{ord.productName}</div>
 <span className="font-mono text-[10px] text-theme-muted">{ord.sku}</span>
 </td>

 {/* Origen */}
 <td className="py-3 px-3 text-center font-mono font-bold text-rose-600 whitespace-nowrap">
 {ord.originLocation}
 </td>

 {/* Destino */}
 <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">
 {ord.destinationLocation}
 </td>

 {/* Motivo */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getReasonBadge(ord.reasonType)}`}>
 {ord.reasonType}
 </span>
 </td>

 {/* CEDIS */}
 <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
 {ord.warehouseName}
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={ord.status === 'En ejecución' ? 'info' : 'warning'}
 label={ord.status}
 size="sm"
 />
 </td>

 {/* Fecha */}
 <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
 {ord.createdAt}
 </td>

 {/* Acción */}
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <button
 onClick={() => setSelectedOrderToExecute(ord)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 mx-auto cursor-pointer"
 >
 <Radio className="w-3.5 h-3.5" />
 <span>Ejecutar</span>
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISTA 3: SUBTAB HISTORIAL DE REACOMODOS */}
 {/* ========================================================================= */}
 {activeSubtab === 'history' && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-xs overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[900px]">
 <thead>
 <tr className="border-b border-theme-subtle bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 <th className="py-3 px-4">Fecha / Hora</th>
 <th className="py-3 px-4">Folio</th>
 <th className="py-3 px-4">UID / Serie</th>
 <th className="py-3 px-4">Artículo</th>
 <th className="py-3 px-3 text-center">Origen</th>
 <th className="py-3 px-3 text-center">Destino</th>
 <th className="py-3 px-3">Motivo</th>
 <th className="py-3 px-4">Ejecutado por</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredHistory.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-12 text-center text-theme-muted">
 No hay registros en el historial de reacomodos.
 </td>
 </tr>
 ) : (
 filteredHistory.map((hist) => (
 <tr key={hist.id} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-3 px-4 text-theme-muted whitespace-nowrap">
 {hist.timestamp}
 </td>
 <td className="py-3 px-4 font-mono font-bold text-theme-primary whitespace-nowrap">
 {hist.folio}
 </td>
 <td className="py-3 px-4 font-mono font-bold text-theme-main whitespace-nowrap">
 {hist.uid}
 </td>
 <td className="py-3 px-4 font-semibold text-theme-main">
 {hist.productName}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-rose-600 whitespace-nowrap">
 {hist.origin}
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">
 {hist.destination}
 </td>
 <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
 {hist.reason}
 </td>
 <td className="py-3 px-4 font-medium text-theme-main whitespace-nowrap">
 {hist.executedBy}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* MODAL DE ANÁLISIS DE REACOMODO */}
 {/* ========================================================================= */}
 <RearrangementAnalysisModal
 suggestion={selectedAnalysisSuggestion}
 onClose={() => setSelectedAnalysisSuggestion(null)}
 onGenerateOrder={(sug) => handleGenerateOrder(sug)}
 />

 {/* ========================================================================= */}
 {/* MODAL DE ESCANEO & EJECUCIÓN (TERMINAL RF) */}
 {/* ========================================================================= */}
 <ExecuteRearrangementModal
 order={selectedOrderToExecute}
 onClose={() => setSelectedOrderToExecute(null)}
 onConfirmSuccess={(completedOrder) => handleConfirmSuccess(completedOrder)}
 />
 </div>
 );
};
