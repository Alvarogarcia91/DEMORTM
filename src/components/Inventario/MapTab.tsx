import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
 Building2, 
 Search, 
 Layers, 
 Boxes, 
 CheckCircle2, 
 AlertTriangle, 
 Truck, 
 RotateCcw, 
 ShieldAlert, 
 Package, 
 Sparkles, 
 Info, 
 MapPin,
 QrCode,
 Tag,
 ExternalLink,
 ChevronRight,
 X,
 Printer,
 Eye
} from 'lucide-react';
import { 
 MOCK_WAREHOUSES_LIST, 
 WarehouseLayout, 
 PositionRack, 
 SpecialAreaSlot, 
 PositionSerializedMattress, 
 MOCK_STOCK_ITEMS, 
 ShowroomBay 
} from '../../data/mockInventoryData';
import { PositionDetailModal } from './PositionDetailModal';
import { UnitDetailModal } from './UnitDetailModal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';
import { ReworkModal } from './ReworkModal';
import { LocationQrModal, PhysicalLocationMeta } from './LocationQrModal';
import { PrintLocationQrModal } from './PrintLocationQrModal';
import { ShowroomBayModal } from './ShowroomBayModal';
import { StatusBadge } from '../common/StatusBadge';

interface MapTabProps {
 onShowToast: (message: string) => void;
}

interface AutocompleteItem {
 id: string;
 type: 'article' | 'unit' | 'location' | 'lot';
 title: string;
 subtitle: string;
 positionId: string; // e.g. "A-01"
 locationCode?: string;
 sku?: string;
 uid?: string;
 productName?: string;
 status?: string;
 lotNumber?: string;
}

export const MapTab: React.FC<MapTabProps> = ({ onShowToast }) => {
 const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-mty-norte');
 const [searchQuery, setSearchQuery] = useState<string>('');
 const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
 const [selectedMatchInfo, setSelectedMatchInfo] = useState<AutocompleteItem | null>(null);

 // Modals state
 const [selectedPosition, setSelectedPosition] = useState<PositionRack | null>(null);
 const [selectedUnitDetail, setSelectedUnitDetail] = useState<PositionSerializedMattress | null>(null);
 const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedReworkZone, setSelectedReworkZone] = useState<SpecialAreaSlot | null>(null);

 // Location QR Modals state
 const [selectedLocationQr, setSelectedLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedPrintLocationQr, setSelectedPrintLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedShowroomBay, setSelectedShowroomBay] = useState<ShowroomBay | null>(null);

 const searchContainerRef = useRef<HTMLDivElement>(null);

 // Active warehouse layout
 const currentWarehouse: WarehouseLayout = useMemo(() => {
 return MOCK_WAREHOUSES_LIST.find(w => w.id === selectedWarehouseId) || MOCK_WAREHOUSES_LIST[0];
 }, [selectedWarehouseId]);

 // Click outside to close autocomplete dropdown
 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
 setIsDropdownOpen(false);
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 // Build Autocomplete Suggestions dynamically from current warehouse
 const autocompleteSuggestions = useMemo<AutocompleteItem[]>(() => {
 if (!searchQuery.trim() || searchQuery.trim().length < 1) return [];
 const q = searchQuery.toLowerCase().trim();
 const results: AutocompleteItem[] = [];
 const seenIds = new Set<string>();

 currentWarehouse.aisles.forEach((aisle) => {
 aisle.positions.forEach((pos) => {
 const posText = `${aisle.aisleCode} Posición ${pos.positionNumber}`.toLowerCase();
 if (pos.positionId.toLowerCase().includes(q) || posText.includes(q)) {
 const itemKey = `loc-${pos.positionId}`;
 if (!seenIds.has(itemKey)) {
 seenIds.add(itemKey);
 results.push({
 id: itemKey,
 type: 'location',
 title: `Posición ${pos.positionId}`,
 subtitle: `${aisle.aisleCode} &middot; Ocupación: ${pos.currentUnitsCount}/7 colchones`,
 positionId: pos.positionId,
 });
 }
 }

 pos.units.forEach((u) => {
 if (u.uid.toLowerCase().includes(q)) {
 const uidKey = `uid-${u.uid}`;
 if (!seenIds.has(uidKey)) {
 seenIds.add(uidKey);
 results.push({
 id: uidKey,
 type: 'unit',
 title: u.uid,
 subtitle: `${u.productName} &middot; Ubicación ${u.locationCode}`,
 positionId: pos.positionId,
 locationCode: u.locationCode,
 sku: u.sku,
 uid: u.uid,
 productName: u.productName,
 status: u.status,
 lotNumber: u.lotNumber,
 });
 }
 }

 if (u.sku.toLowerCase().includes(q) || u.productName.toLowerCase().includes(q)) {
 const skuKey = `sku-${u.sku}-${pos.positionId}`;
 if (!seenIds.has(skuKey)) {
 seenIds.add(skuKey);
 results.push({
 id: skuKey,
 type: 'article',
 title: u.sku,
 subtitle: `${u.productName} (en Posición ${pos.positionId})`,
 positionId: pos.positionId,
 sku: u.sku,
 productName: u.productName,
 });
 }
 }

 if (u.lotNumber.toLowerCase().includes(q)) {
 const lotKey = `lot-${u.lotNumber}-${pos.positionId}`;
 if (!seenIds.has(lotKey)) {
 seenIds.add(lotKey);
 results.push({
 id: lotKey,
 type: 'lot',
 title: u.lotNumber,
 subtitle: `Lote en Posición ${pos.positionId} &middot; ${u.productName}`,
 positionId: pos.positionId,
 lotNumber: u.lotNumber,
 productName: u.productName,
 });
 }
 }
 });
 });
 });

 // Showroom bays scan
 if (currentWarehouse.showroomBays) {
 currentWarehouse.showroomBays.forEach((bay) => {
 const bayMatch = bay.code.toLowerCase().includes(q) || bay.name.toLowerCase().includes(q) || 'showroom'.includes(q) || 'exhibicion'.includes(q);
 if (bayMatch) {
 const itemKey = `bay-${bay.code}`;
 if (!seenIds.has(itemKey)) {
 seenIds.add(itemKey);
 results.push({
 id: itemKey,
 type: 'location',
 title: `${bay.code} · ${bay.name}`,
 subtitle: bay.status === 'Ocupada' && bay.mattress ? `Exhibición: ${bay.mattress.productName}` : 'Bahía Libre de Showroom',
 positionId: '',
 locationCode: bay.code,
 });
 }
 }

 if (bay.mattress) {
 const m = bay.mattress;
 if (m.uid.toLowerCase().includes(q)) {
 const uidKey = `uid-${m.uid}`;
 if (!seenIds.has(uidKey)) {
 seenIds.add(uidKey);
 results.push({
 id: uidKey,
 type: 'unit',
 title: m.uid,
 subtitle: `${m.productName} (Showroom ${bay.code})`,
 positionId: '',
 locationCode: bay.code,
 sku: m.sku,
 uid: m.uid,
 productName: m.productName,
 status: m.status,
 lotNumber: m.lotNumber,
 });
 }
 }

 if (m.sku.toLowerCase().includes(q) || m.productName.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)) {
 const skuKey = `sku-${m.sku}-${bay.code}`;
 if (!seenIds.has(skuKey)) {
 seenIds.add(skuKey);
 results.push({
 id: skuKey,
 type: 'article',
 title: m.sku,
 subtitle: `${m.productName} · Showroom ${bay.code}`,
 positionId: '',
 sku: m.sku,
 productName: m.productName,
 });
 }
 }
 }
 });
 }

 return results.slice(0, 8);
 }, [searchQuery, currentWarehouse]);

 // Set of positionIds that match current search query
 const matchingPositions = useMemo(() => {
 if (!searchQuery.trim()) return new Set<string>();
 const query = searchQuery.toLowerCase().trim();
 const matches = new Set<string>();

 currentWarehouse.aisles.forEach(aisle => {
 aisle.positions.forEach(pos => {
 if (pos.positionId.toLowerCase().includes(query)) {
 matches.add(pos.positionId);
 }
 pos.units.forEach(u => {
 if (
 u.uid.toLowerCase().includes(query) ||
 u.sku.toLowerCase().includes(query) ||
 u.productName.toLowerCase().includes(query) ||
 u.lotNumber.toLowerCase().includes(query) ||
 u.locationCode.toLowerCase().includes(query)
 ) {
 matches.add(pos.positionId);
 }
 });
 });
 });

 return matches;
 }, [searchQuery, currentWarehouse]);

 const handleSelectSuggestion = (item: AutocompleteItem) => {
 setSearchQuery(item.title);
 setSelectedMatchInfo(item);
 setIsDropdownOpen(false);

 if (item.positionId) {
 setTimeout(() => {
 const el = document.getElementById(`rack-pos-${item.positionId}`);
 if (el) {
 el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
 }
 }, 100);
 }
 };

 const handleWarehouseChange = (whId: string) => {
 setSelectedWarehouseId(whId);
 setSearchQuery('');
 setSelectedMatchInfo(null);
 const wh = MOCK_WAREHOUSES_LIST.find(w => w.id === whId);
 if (wh) {
 onShowToast(`Almacén cambiado a ${wh.name}`);
 }
 };

 const handleClearSearch = () => {
 setSearchQuery('');
 setSelectedMatchInfo(null);
 setIsDropdownOpen(false);
 };

 const getSuggestionTypeBadge = (type: string) => {
 switch (type) {
 case 'article':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'unit':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'location':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'lot':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full">
 
 {/* ========================================================================= */}
 {/* TOP TOOLBAR: SELECTOR DE ALMACÉN & BUSCADOR CON AUTOCOMPLETADO */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 sm:p-5 border border-theme-subtle rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
 
 {/* Selector Almacén */}
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center shrink-0 border border-theme-primary/20">
 <Building2 className="w-5 h-5" />
 </div>
 <div className="space-y-0.5">
 <label className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">
 Almacén / Sucursal Activa
 </label>
 <select
 value={selectedWarehouseId}
 onChange={(e) => handleWarehouseChange(e.target.value)}
 className="bg-theme-muted border border-theme-subtle text-xs font-bold text-theme-main py-1.5 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <optgroup label="Centros de Distribución">
 <option value="wh-mty-norte">CEDIS Monterrey Norte (MTY-N)</option>
 <option value="wh-mty-sur">CEDIS Monterrey Sur (MTY-S)</option>
 </optgroup>
 <optgroup label="Sucursales Retail">
 <option value="wh-suc-valle-oriente">Sucursal Valle Oriente (SUC-VO)</option>
 <option value="wh-suc-cumbres">Sucursal Cumbres (SUC-CUM)</option>
 </optgroup>
 </select>
 </div>
 </div>

 {/* Buscador Localizador con Autocomplete */}
 <div ref={searchContainerRef} className="relative w-full md:w-[480px]">
 <div className="relative flex items-center gap-2">
 <div className="relative flex-1">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onFocus={() => {
 if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
 }}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setIsDropdownOpen(true);
 if (!e.target.value.trim()) setSelectedMatchInfo(null);
 }}
 placeholder="Buscar artículo, SKU, UID/Serie o ubicación..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-10 pr-9 py-2.5 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all font-medium"
 />

 {searchQuery && (
 <button
 onClick={handleClearSearch}
 className="absolute right-2.5 top-2.5 p-1 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-subtle transition-colors cursor-pointer"
 title="Limpiar búsqueda"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 </div>

 {/* AUTOCOMPLETE DROPDOWN */}
 {isDropdownOpen && searchQuery.trim().length > 0 && (
 <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-150">
 <div className="p-2 border-b border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-[11px] text-theme-muted">
 <span className="font-semibold">Coincidencias en {currentWarehouse.name}</span>
 <span className="font-mono text-[10px]">{autocompleteSuggestions.length} sugerencias</span>
 </div>

 <div className="max-h-72 overflow-y-auto divide-y divide-theme-subtle">
 {autocompleteSuggestions.length === 0 ? (
 <div className="p-4 text-center text-xs text-theme-muted">
 No se encontraron coincidencias para &ldquo;<strong className="text-theme-main">{searchQuery}</strong>&rdquo;
 </div>
 ) : (
 autocompleteSuggestions.map((item) => (
 <button
 key={item.id}
 onClick={() => handleSelectSuggestion(item)}
 className="w-full p-3 text-left hover:bg-purple-500/10 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
 >
 <div className="flex items-center gap-2.5 min-w-0">
 {item.type === 'unit' && <QrCode className="w-4 h-4 text-purple-600 shrink-0" />}
 {item.type === 'article' && <Package className="w-4 h-4 text-blue-600 shrink-0" />}
 {item.type === 'location' && <MapPin className="w-4 h-4 text-amber-600 shrink-0" />}
 {item.type === 'lot' && <Tag className="w-4 h-4 text-emerald-600 shrink-0" />}

 <div className="min-w-0">
 <p className="text-xs font-bold text-theme-main group-hover:text-purple-700 transition-colors truncate">
 {item.title}
 </p>
 <p className="text-[11px] text-theme-muted truncate">
 {item.subtitle}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getSuggestionTypeBadge(item.type)}`}>
 {item.type === 'unit' ? 'Unidad' : item.type === 'article' ? 'Artículo' : item.type === 'location' ? 'Ubicación' : 'Lote'}
 </span>
 <ChevronRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-purple-600 transition-colors" />
 </div>
 </button>
 ))
 )}
 </div>
 </div>
 )}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* KPIS COMPACTOS DEL ALMACÉN ACTIVO */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Racks Totales</span>
 <span className="text-xl font-extrabold text-theme-main font-mono">{currentWarehouse.kpis.totalLocations}</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Racks en Uso</span>
 <span className="text-xl font-extrabold text-theme-primary font-mono">{currentWarehouse.kpis.usedLocations}</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Racks Libres</span>
 <span className="text-xl font-extrabold text-emerald-600 font-mono">{currentWarehouse.kpis.freeLocations}</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Ocupación Almacén</span>
 <span className="text-xl font-extrabold text-theme-main font-mono">{currentWarehouse.kpis.occupancyPercentage}%</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs col-span-2 sm:col-span-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Colchones Físicos</span>
 <span className="text-xl font-extrabold text-theme-main font-mono">{currentWarehouse.kpis.physicalUnits} pzas</span>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* BANNER DE COINCIDENCIA MORADO (PURPLE MATCH BAR) */}
 {/* ========================================================================= */}
 {searchQuery && (
 <div className="p-4 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-150">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shrink-0 shadow-xs">
 <Sparkles className="w-4 h-4" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-purple-950 dark:text-purple-300">
 {matchingPositions.size} {matchingPositions.size === 1 ? 'ubicación coincidente' : 'ubicaciones coincidentes'} encontrada(s)
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs">
 Resaltada en Morado
 </span>
 </div>

 {selectedMatchInfo && (
 <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80 mt-0.5">
 <strong>{selectedMatchInfo.title}</strong> &middot; {selectedMatchInfo.subtitle}
 </p>
 )}
 </div>
 </div>

 {selectedMatchInfo?.positionId && (
 <button
 onClick={() => {
 const pos = currentWarehouse.aisles
 .flatMap(a => a.positions)
 .find(p => p.positionId === selectedMatchInfo.positionId);
 if (pos) setSelectedPosition(pos);
 }}
 className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
 >
 <span>Ver colchones del rack</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* MAPA PRINCIPAL DEL CEDIS (EXPANDIDO Y CON CAPACIDAD 7 VISIBLE) */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-6 sm:p-8 rounded-2xl border border-theme-subtle shadow-xs space-y-8 w-full">
 
 {/* SECCIÓN 1: ZONA DE RACKS */}
 <div className="space-y-5">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-theme-subtle gap-2">
 <div className="flex items-center gap-2.5">
 <Layers className="w-5 h-5 text-theme-primary" />
 <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-theme-main">
 Zona de Racks de Almacenamiento ({currentWarehouse.aisles.length} Pasillos)
 </h3>
 </div>
 
 {/* Leyenda de Estados */}
 <div className="flex items-center gap-3.5 text-xs text-theme-muted flex-wrap">
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
 <span>Libre</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
 <span>1-2 pzas</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded bg-theme-primary/20 border border-theme-primary/50" />
 <span>3-5 pzas</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded bg-theme-primary/40 border border-theme-primary/70" />
 <span>6+ pzas</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-3 h-3 rounded bg-purple-600 border border-purple-600 shadow-xs" />
 <span className="font-bold text-purple-700 dark:text-purple-400">Coincidencia</span>
 </div>
 </div>
 </div>

 {/* Racks Canvas Grid (Con celdas amplias mostrando cantidad) */}
 <div className="space-y-4 overflow-x-auto pb-4 pt-1">
 {currentWarehouse.aisles.map((aisle) => (
 <div key={aisle.aisleCode} className="space-y-2">
 <div className="flex items-center gap-2">
 <span className="text-xs font-extrabold text-theme-main font-mono bg-theme-muted px-3 py-1 rounded-xl border border-theme-subtle">
 {aisle.aisleCode}
 </span>
 <span className="text-[11px] text-theme-muted font-mono">
 {aisle.positions.length} posiciones
 </span>
 </div>

 {/* Positions Row (Celdas: min-w-[68px] sm:min-w-[76px] h-15) */}
 <div className="flex items-center gap-2">
 {aisle.positions.map((pos) => {
 const isMatch = matchingPositions.has(pos.positionId);
 const isEmpty = pos.currentUnitsCount === 0;
 const isLow = pos.currentUnitsCount > 0 && pos.currentUnitsCount <= 2;
 const isMed = pos.currentUnitsCount >= 3 && pos.currentUnitsCount <= 5;
 const isHigh = pos.currentUnitsCount >= 6;

 return (
 <button
 key={pos.positionId}
 id={`rack-pos-${pos.positionId}`}
 onClick={() => setSelectedPosition(pos)}
 className={`min-w-[68px] sm:min-w-[76px] h-15 rounded-xl border text-center p-1.5 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
 isMatch
 ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 ring-4 ring-purple-300/80 shadow-lg scale-105 z-20 font-black'
 : isEmpty
 ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-700 font-semibold'
 : isLow
 ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-900 font-bold'
 : isMed
 ? 'bg-theme-primary/15 hover:bg-theme-primary/25 border-theme-primary/40 text-theme-main font-bold'
 : 'bg-theme-primary/25 hover:bg-theme-primary/35 border-theme-primary/60 text-theme-main font-black'
 }`}
 title={`${aisle.aisleCode} Pos ${pos.positionNumber} (${pos.currentUnitsCount} colchones almacenados)`}
 >
 {/* Position Code */}
 <div className="flex items-center justify-between w-full px-0.5">
 <span className="font-mono text-[11px] font-bold block leading-none">
 {pos.positionNumber}
 </span>
 <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded ${
 isMatch
 ? 'bg-white/20 text-white'
 : isEmpty
 ? 'text-emerald-600'
 : 'text-theme-muted'
 }`}>
 {pos.currentUnitsCount > 0 ? `${pos.currentUnitsCount} pzas` : 'Libre'}
 </span>
 </div>

 {/* Quantity Indicator */}
 <div className="flex items-center justify-between w-full pt-1">
 <span className={`text-[11px] font-mono font-black tracking-tight ${
 isMatch ? 'text-white' : 'text-theme-main'
 }`}>
 {pos.currentUnitsCount} <span className="text-[8px] font-normal opacity-80">{pos.currentUnitsCount === 1 ? 'colchón' : 'colchones'}</span>
 </span>

 {/* Level Dots */}
 <div className="flex items-center gap-0.5">
 {['C', 'B', 'A'].map((lvlCode) => {
 const lvl = pos.levels.find(l => l.levelCode === lvlCode);
 const hasUnits = lvl && lvl.count > 0;
 return (
 <span
 key={lvlCode}
 className={`w-1.5 h-1.5 rounded-full ${
 isMatch
 ? hasUnits ? 'bg-white' : 'bg-purple-300'
 : hasUnits ? 'bg-theme-primary' : 'bg-emerald-500/40'
 }`}
 title={`Nivel ${lvlCode}: ${lvl?.count || 0} pzas`}
 />
 );
 })}
 </div>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* SECCIÓN 2: ZONAS ESPECIALES */}
 <div className="pt-6 border-t border-theme-subtle space-y-4">
 <div className="flex items-center justify-between pb-1">
 <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Boxes className="w-5 h-5 text-amber-600" />
 Zonas Especiales de Piso & Operación
 </h3>
 <span className="text-xs text-theme-muted font-mono">3 Áreas operativas con QR</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
 {/* Recepción */}
 <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col justify-between h-full min-h-[210px] space-y-3 transition-all hover:border-theme-primary/40">
 {/* HEADER */}
 <div className="flex items-start justify-between gap-2 min-w-0">
 <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted flex items-center gap-1.5 shrink-0">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
 Área de Recepción
 </span>
 <StatusBadge variant="success" label="Rampas de Entrada" size="sm" />
 </div>

 {/* BODY */}
 <div className="space-y-1.5 flex-1 min-w-0">
 <h4 className="text-sm font-bold text-theme-main leading-snug line-clamp-2">
 {currentWarehouse.receptionAreas.map(r => r.name).join(' & ')}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed line-clamp-2">
 Punto de descarga inicial para ingreso a la Mesa de Verificación.
 </p>
 <div className="pt-1 text-[11px] font-mono text-theme-muted">
 <span>Capacidad: <strong className="text-theme-main font-bold">{currentWarehouse.receptionAreas[0]?.capacity || 10} pzas</strong></span>
 </div>
 </div>

 {/* FOOTER */}
 <div className="mt-auto pt-3 border-t border-theme-subtle flex items-center justify-end gap-2 text-xs">
 <button
 onClick={() => {
 const rec = currentWarehouse.receptionAreas[0];
 setSelectedLocationQr({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Ver QR de Ubicación"
 >
 <QrCode className="w-3.5 h-3.5 text-theme-primary" />
 <span>QR Ubicación</span>
 </button>
 <button
 onClick={() => {
 const rec = currentWarehouse.receptionAreas[0];
 setSelectedPrintLocationQr({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Imprimir etiqueta"
 >
 <Printer className="w-3.5 h-3.5 text-theme-muted" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>

 {/* Acomodo Temporal */}
 <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col justify-between h-full min-h-[210px] space-y-3 transition-all hover:border-theme-primary/40">
 {/* HEADER */}
 <div className="flex items-start justify-between gap-2 min-w-0">
 <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted flex items-center gap-1.5 shrink-0">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
 Acomodo Temporal
 </span>
 <StatusBadge variant="info" label="Staging Racks" size="sm" />
 </div>

 {/* BODY */}
 <div className="space-y-1.5 flex-1 min-w-0">
 <h4 className="text-sm font-bold text-theme-main leading-snug line-clamp-2">
 {currentWarehouse.stagingAreas.map(s => s.name).join(' & ')}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed line-clamp-2">
 Colchones serializados pendientes de asignación de pasillo definitivo.
 </p>
 <div className="pt-1 text-[11px] font-mono text-theme-muted">
 <span>Ocupación: <strong className="text-theme-main font-bold">{currentWarehouse.stagingAreas.reduce((a, s) => a + s.currentUnits, 0)} pzas en staging</strong></span>
 </div>
 </div>

 {/* FOOTER */}
 <div className="mt-auto pt-3 border-t border-theme-subtle flex items-center justify-end gap-2 text-xs">
 <button
 onClick={() => {
 const stg = currentWarehouse.stagingAreas[0];
 setSelectedLocationQr({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Ver QR de Ubicación"
 >
 <QrCode className="w-3.5 h-3.5 text-theme-primary" />
 <span>QR Ubicación</span>
 </button>
 <button
 onClick={() => {
 const stg = currentWarehouse.stagingAreas[0];
 setSelectedPrintLocationQr({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Imprimir etiqueta"
 >
 <Printer className="w-3.5 h-3.5 text-theme-muted" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>

 {/* Retrabajo */}
 <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col justify-between h-full min-h-[210px] space-y-3 transition-all hover:border-theme-primary/40">
 {/* HEADER */}
 <div className="flex items-start justify-between gap-2 min-w-0">
 <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted flex items-center gap-1.5 shrink-0">
 <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
 Retrabajo & Calidad
 </span>
 <StatusBadge variant="warning" label="Zona Especial" size="sm" />
 </div>

 {/* BODY */}
 <div className="space-y-1.5 flex-1 min-w-0">
 <h4 className="text-sm font-bold text-theme-main leading-snug line-clamp-2">
 {currentWarehouse.reworkZone.name}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed line-clamp-2">
 Colchones en observación técnica, empaque o revisión de garantía.
 </p>
 <div className="pt-1 text-[11px] font-mono text-theme-muted">
 <span>Capacidad: <strong className="text-zinc-900 font-bold">{currentWarehouse.reworkZone.currentUnits} / {currentWarehouse.reworkZone.capacity} pzas</strong></span>
 </div>
 </div>

 {/* FOOTER */}
 <div className="mt-auto pt-3 border-t border-theme-subtle flex items-center justify-between gap-2 text-xs">
 <button
 onClick={() => setSelectedReworkZone(currentWarehouse.reworkZone)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Ver detalle de unidades en retrabajo"
 >
 <Eye className="w-3.5 h-3.5 text-theme-primary" />
 <span>Detalle</span>
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 const ret = currentWarehouse.reworkZone;
 setSelectedLocationQr({
 code: ret.code,
 name: ret.name,
 type: 'RETRABAJO',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: ret.capacity,
 currentUnits: ret.currentUnits,
 status: ret.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Ver QR de ubicación"
 >
 <QrCode className="w-3.5 h-3.5 text-theme-primary" />
 <span>QR</span>
 </button>
 <button
 onClick={() => {
 const ret = currentWarehouse.reworkZone;
 setSelectedPrintLocationQr({
 code: ret.code,
 name: ret.name,
 type: 'RETRABAJO',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: ret.capacity,
 currentUnits: ret.currentUnits,
 status: ret.status,
 });
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Imprimir etiqueta"
 >
 <Printer className="w-3.5 h-3.5 text-theme-muted" />
 <span>Imprimir</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* SECCIÓN 3: SHOWROOM & EXHIBICIÓN RETAIL (SI APLICA A SUCURSAL) */}
 {currentWarehouse.showroomBays && currentWarehouse.showroomBays.length > 0 && (
 <div className="pt-6 border-t border-theme-subtle space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center border border-purple-500 shadow-2xs shrink-0">
 <Sparkles className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-theme-main flex items-center gap-2">
 Zona Showroom & Exhibición Retail (6 Bahías)
 </h3>
 <p className="text-[11px] text-theme-muted">
 Espacio físico de exhibición y prueba de confort en piso de venta ({currentWarehouse.name}).
 </p>
 </div>
 </div>

 <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 self-start sm:self-auto">
 {currentWarehouse.showroomBays.filter(b => b.status === 'Ocupada').length} de {currentWarehouse.showroomBays.length} Bahías Exhibidas
 </span>
 </div>

 {/* Grid de 6 Bahías */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
 {currentWarehouse.showroomBays.map((bay) => {
 const isOccupied = bay.status === 'Ocupada' && !!bay.mattress;
 const mat = bay.mattress;

 return (
 <div
 key={bay.code}
 onClick={() => setSelectedShowroomBay(bay)}
 className="p-4.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col justify-between h-full min-h-[195px] space-y-3 transition-all hover:border-purple-500/40 cursor-pointer group"
 >
 <div className="space-y-2">
 <div className="flex items-center justify-between gap-2 min-w-0">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/25">
 {bay.code}
 </span>
 <span className="text-[10px] uppercase font-bold text-theme-muted">
 Showroom
 </span>
 </div>

 <StatusBadge
 variant={isOccupied ? 'smart' : 'neutral'}
 label={isOccupied ? 'En exhibición' : 'Libre'}
 size="sm"
 />
 </div>

 {isOccupied && mat ? (
 <div className="space-y-1.5 pt-1">
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-600 text-white shadow-2xs">
 {mat.brand}
 </span>
 <span className="text-[10px] font-bold text-theme-muted bg-theme-muted/60 px-2 py-0.5 rounded border border-theme-subtle">
 {mat.size}
 </span>
 </div>
 <h5 className="text-xs font-black text-theme-main group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
 {mat.productName}
 </h5>
 <div className="flex items-center justify-between text-[10px] font-mono text-theme-muted pt-1 border-t border-theme-subtle">
 <span>{mat.sku}</span>
 <span className="font-bold text-theme-main">{mat.uid}</span>
 </div>
 </div>
 ) : (
 <div className="py-3 text-center text-theme-muted space-y-0.5">
 <span className="text-xs font-bold block text-theme-muted">Bahía Libre</span>
 <span className="text-[10px]">Disponible para montaje de exhibición</span>
 </div>
 )}
 </div>

 <div className="mt-auto pt-2.5 border-t border-theme-subtle flex items-center justify-between text-xs">
 <span className="font-semibold text-purple-700 dark:text-purple-300 group-hover:underline flex items-center gap-1">
 <span>Ver detalle & QRs</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </span>
 <span className="text-[10px] text-theme-muted font-mono flex items-center gap-1">
 <QrCode className="w-3.5 h-3.5 text-purple-600" />
 <span>QR Bahía</span>
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* SECCIÓN 4: CARRILES DE EMBARQUE */}
 <div className="pt-6 border-t border-theme-subtle space-y-4">
 <div className="flex items-center justify-between pb-1">
 <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Truck className="w-5 h-5 text-blue-600" />
 Carriles de Entrega / Embarque ({currentWarehouse.shippingLanes.length} {currentWarehouse.shippingLanes.length === 1 ? 'Carril' : 'Carriles'})
 </h3>
 <span className="text-xs text-theme-muted font-mono">Frente de Salida & Reparto</span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 items-stretch">
 {currentWarehouse.shippingLanes.map((lane) => (
 <div
 key={lane.code}
 className="p-4.5 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs flex flex-col justify-between h-full min-h-[185px] space-y-2.5 transition-all hover:border-blue-500/40"
 >
 {/* HEADER */}
 <div className="flex items-center justify-between gap-2 min-w-0">
 <span className="font-mono text-xs font-black text-theme-primary px-2.5 py-0.5 rounded-lg bg-theme-primary/10 border border-theme-primary/20 shrink-0">
 {lane.code}
 </span>
 <StatusBadge
 variant={lane.currentUnits > 0 ? 'info' : 'neutral'}
 label={lane.currentUnits > 0 ? `${lane.currentUnits} pzas` : 'Libre'}
 size="sm"
 />
 </div>

 {/* BODY */}
 <div className="space-y-1 py-1 flex-1 min-w-0">
 <h4 className="text-xs font-bold text-theme-main leading-tight line-clamp-1">
 {lane.name}
 </h4>
 <p className="text-[11px] text-theme-muted leading-relaxed line-clamp-2">
 {lane.status}
 </p>
 </div>

 {/* FOOTER */}
 <div className="mt-auto pt-2.5 border-t border-theme-subtle flex items-center justify-between gap-2 text-xs">
 <button
 onClick={() => {
 setSelectedLocationQr({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 });
 }}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Ver QR del Carril"
 >
 <QrCode className="w-3.5 h-3.5 text-blue-600" />
 <span>QR</span>
 </button>

 <button
 onClick={() => {
 setSelectedPrintLocationQr({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: currentWarehouse.name,
 warehouseCode: currentWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 });
 }}
 className="px-2.5 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
 title="Imprimir etiqueta del Carril"
 >
 <Printer className="w-3.5 h-3.5 text-theme-muted" />
 <span>Imprimir</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 1. MODAL DE DESGLOSE DE POSICIÓN (CAPACIDAD 7 Y LISTA DE UNIDADES) */}
 {/* ========================================================================= */}
 <PositionDetailModal
 position={selectedPosition}
 warehouseName={currentWarehouse.name}
 onClose={() => setSelectedPosition(null)}
 onOpenUnitDetail={(unit) => setSelectedUnitDetail(unit)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* 2. MODAL DE FICHA INDIVIDUAL DE COLCHÓN */}
 {/* ========================================================================= */}
 <UnitDetailModal
 unit={selectedUnitDetail}
 warehouseName={currentWarehouse.name}
 onClose={() => setSelectedUnitDetail(null)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* 3. MODAL DE VISUALIZACIÓN DE QR DE UNIDAD (COLCHÓN) */}
 {/* ========================================================================= */}
 <QrModal
 unit={selectedQrUnit}
 warehouseName={currentWarehouse.name}
 onClose={() => setSelectedQrUnit(null)}
 onPrint={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* 4. MODAL DE IMPRESIÓN DE ETIQUETA TÉRMICA DE UNIDAD */}
 {/* ========================================================================= */}
 <PrintQrModal
 unit={selectedPrintUnit}
 warehouseName={currentWarehouse.name}
 onClose={() => setSelectedPrintUnit(null)}
 />

 {/* ========================================================================= */}
 {/* 5. MODAL DE VISUALIZACIÓN DE QR DE UBICACIÓN FÍSICA */}
 {/* ========================================================================= */}
 <LocationQrModal
 location={selectedLocationQr}
 onClose={() => setSelectedLocationQr(null)}
 onPrint={(loc) => setSelectedPrintLocationQr(loc)}
 />

 {/* ========================================================================= */}
 {/* 6. MODAL DE IMPRESIÓN DE ETIQUETA TÉRMICA DE UBICACIÓN FÍSICA */}
 {/* ========================================================================= */}
 <PrintLocationQrModal
 location={selectedPrintLocationQr}
 onClose={() => setSelectedPrintLocationQr(null)}
 />

 {/* ========================================================================= */}
 {/* 7. MODAL DE BAHÍA DE SHOWROOM */}
 {/* ========================================================================= */}
 <ShowroomBayModal
 bay={selectedShowroomBay}
 warehouseName={currentWarehouse.name}
 warehouseCode={currentWarehouse.code}
 onClose={() => setSelectedShowroomBay(null)}
 />

 {/* ========================================================================= */}
 {/* MODAL DE ZONA DE RETRABAJO */}
 {/* ========================================================================= */}
 <ReworkModal
 reworkZone={selectedReworkZone}
 warehouseName={currentWarehouse.name}
 onClose={() => setSelectedReworkZone(null)}
 />
 </div>
 );
};
