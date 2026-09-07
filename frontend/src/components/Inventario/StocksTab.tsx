import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
 Search, 
 Filter, 
 QrCode, 
 Boxes, 
 Building2, 
 RotateCcw, 
 ChevronLeft, 
 ChevronRight,
 Sparkles,
 Calendar,
 Clock,
 Package,
 Layers,
 Eye,
 Printer,
 X,
 Tag,
 MapPin,
 CheckCircle2
} from 'lucide-react';
import { 
 MOCK_STOCK_ITEMS, 
 MOCK_WAREHOUSES_LIST,
 StockItemRecord, 
 PositionSerializedMattress 
} from '../../data/mockInventoryData';
import { MOCK_MASTER_ARTICLES } from '../../data/mockArticlesData';
import { ArticleStockDrawer, ArticleStockSummary } from './ArticleStockDrawer';
import { UnitDetailModal } from './UnitDetailModal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';

interface AutocompleteSuggestion {
 id: string;
 type: 'article' | 'unit' | 'location';
 title: string;
 subtitle: string;
 sku?: string;
 uid?: string;
 location?: string;
}

export const StocksTab: React.FC = () => {
 // Main Subtab: 'by-article' (default) vs 'by-unit'
 const [activeSubtab, setActiveSubtab] = useState<'by-article' | 'by-unit'>('by-article');

 // Search & Autocomplete
 const [searchTerm, setSearchTerm] = useState('');
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [highlightedItemKey, setHighlightedItemKey] = useState<string | null>(null);

 // Filters
 const [filterWarehouse, setFilterWarehouse] = useState('all');
 const [filterBrand, setFilterBrand] = useState('all');
 const [filterSize, setFilterSize] = useState('all');
 const [filterStatus, setFilterStatus] = useState('all');
 const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'in-stock', 'out-of-stock'

 // Pagination
 const [currentPageArticle, setCurrentPageArticle] = useState(1);
 const [currentPageUnit, setCurrentPageUnit] = useState(1);
 const pageSize = 10;

 // Modals state
 const [selectedArticleSummary, setSelectedArticleSummary] = useState<ArticleStockSummary | null>(null);
 const [selectedUnitDetail, setSelectedUnitDetail] = useState<PositionSerializedMattress | null>(null);
 const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedMattress | null>(null);
 const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedMattress | null>(null);

 const searchContainerRef = useRef<HTMLDivElement>(null);

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

 // Filtered serialized units dataset
 const filteredUnitItems = useMemo(() => {
 return MOCK_STOCK_ITEMS.filter((item) => {
 const q = searchTerm.toLowerCase().trim();
 const matchesSearch = 
 !q ||
 item.uid.toLowerCase().includes(q) ||
 item.sku.toLowerCase().includes(q) ||
 item.productName.toLowerCase().includes(q) ||
 item.brand.toLowerCase().includes(q) ||
 item.location.toLowerCase().includes(q) ||
 item.lotNumber.toLowerCase().includes(q);

 const matchesWarehouse = filterWarehouse === 'all' || item.warehouseId === filterWarehouse;
 const matchesBrand = filterBrand === 'all' || item.brand === filterBrand;
 const matchesSize = filterSize === 'all' || item.size === filterSize;
 const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

 return matchesSearch && matchesWarehouse && matchesBrand && matchesSize && matchesStatus;
 });
 }, [searchTerm, filterWarehouse, filterBrand, filterSize, filterStatus]);

 // Aggregated Stock by Article (SKU)
 const aggregatedArticles = useMemo<ArticleStockSummary[]>(() => {
 const articleMap = new Map<string, ArticleStockSummary>();

 // Seed from all units matching current base filters
 filteredUnitItems.forEach((unit) => {
 let entry = articleMap.get(unit.sku);
 if (!entry) {
 entry = {
 sku: unit.sku,
 productName: unit.productName,
 brand: unit.brand,
 size: unit.size,
 totalUnits: 0,
 availableUnits: 0,
 committedUnits: 0,
 stagingUnits: 0,
 shippingUnits: 0,
 reworkUnits: 0,
 inTransitUnits: 0,
 warehouses: [],
 allUnits: [],
 };
 articleMap.set(unit.sku, entry);
 }

 entry.totalUnits++;
 entry.allUnits.push(unit);

 if (unit.status === 'Disponible') entry.availableUnits++;
 else if (unit.status === 'Comprometido') entry.committedUnits++;
 else if (unit.status === 'En acomodo') entry.stagingUnits++;
 else if (unit.status === 'En embarque') entry.shippingUnits++;
 else if (unit.status === 'En retrabajo') entry.reworkUnits++;
 else if (unit.status === 'En tránsito') entry.inTransitUnits++;

 // Update per-warehouse breakdown
 let whEntry = entry.warehouses.find(w => w.id === unit.warehouseId);
 if (!whEntry) {
 const matchingWh = MOCK_WAREHOUSES_LIST.find(w => w.id === unit.warehouseId);
 whEntry = {
 id: unit.warehouseId,
 name: unit.warehouseName,
 code: matchingWh?.code || (unit.warehouseId === 'wh-mty-norte' ? 'MTY-N' : 'MTY-S'),
 total: 0,
 available: 0,
 committed: 0,
 staging: 0,
 shipping: 0,
 rework: 0,
 inTransit: 0,
 units: [],
 };
 entry.warehouses.push(whEntry);
 }

 whEntry.total++;
 whEntry.units.push(unit);
 if (unit.status === 'Disponible') whEntry.available++;
 else if (unit.status === 'Comprometido') whEntry.committed++;
 else if (unit.status === 'En acomodo') whEntry.staging++;
 else if (unit.status === 'En embarque') whEntry.shipping++;
 else if (unit.status === 'En retrabajo') whEntry.rework++;
 else if (unit.status === 'En tránsito') whEntry.inTransit++;
 });

 let list = Array.from(articleMap.values());

 if (filterAvailability === 'in-stock') {
 list = list.filter(a => a.totalUnits > 0);
 } else if (filterAvailability === 'out-of-stock') {
 list = list.filter(a => a.totalUnits === 0);
 }

 return list;
 }, [filteredUnitItems, filterAvailability]);

 // Autocomplete suggestions generator
 const autocompleteSuggestions = useMemo<AutocompleteSuggestion[]>(() => {
 if (!searchTerm.trim() || searchTerm.trim().length < 1) return [];
 const q = searchTerm.toLowerCase().trim();
 const results: AutocompleteSuggestion[] = [];
 const seenKeys = new Set<string>();

 // 1. Articles (SKU or Name)
 MOCK_STOCK_ITEMS.forEach((item) => {
 if (item.sku.toLowerCase().includes(q) || item.productName.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q)) {
 const key = `art-${item.sku}`;
 if (!seenKeys.has(key)) {
 seenKeys.add(key);
 const count = MOCK_STOCK_ITEMS.filter(i => i.sku === item.sku).length;
 results.push({
 id: key,
 type: 'article',
 title: item.sku,
 subtitle: `${item.productName} &middot; ${count} piezas`,
 sku: item.sku,
 });
 }
 }
 });

 // 2. Units (UID)
 MOCK_STOCK_ITEMS.forEach((item) => {
 if (item.uid.toLowerCase().includes(q)) {
 const key = `unit-${item.uid}`;
 if (!seenKeys.has(key)) {
 seenKeys.add(key);
 results.push({
 id: key,
 type: 'unit',
 title: item.uid,
 subtitle: `${item.productName} &middot; ${item.location} &middot; ${item.warehouseName}`,
 uid: item.uid,
 });
 }
 }
 });

 // 3. Locations
 MOCK_STOCK_ITEMS.forEach((item) => {
 if (item.location.toLowerCase().includes(q)) {
 const key = `loc-${item.location}`;
 if (!seenKeys.has(key)) {
 seenKeys.add(key);
 const count = MOCK_STOCK_ITEMS.filter(i => i.location === item.location).length;
 results.push({
 id: key,
 type: 'location',
 title: item.location,
 subtitle: `${count} ${count === 1 ? 'unidad almacenada' : 'unidades almacenadas'} &middot; ${item.warehouseName}`,
 location: item.location,
 });
 }
 }
 });

 return results.slice(0, 8);
 }, [searchTerm]);

 const handleSelectSuggestion = (s: AutocompleteSuggestion) => {
 setIsDropdownOpen(false);

 if (s.type === 'article') {
 setActiveSubtab('by-article');
 setSearchTerm(s.title);
 setHighlightedItemKey(s.sku || s.title);
 } else if (s.type === 'unit') {
 setActiveSubtab('by-unit');
 setSearchTerm(s.title);
 setHighlightedItemKey(s.uid || s.title);
 } else if (s.type === 'location') {
 setActiveSubtab('by-unit');
 setSearchTerm(s.title);
 setHighlightedItemKey(s.location || s.title);
 }
 };

 const handleClearSearch = () => {
 setSearchTerm('');
 setHighlightedItemKey(null);
 setIsDropdownOpen(false);
 };

 const handleResetFilters = () => {
 setSearchTerm('');
 setHighlightedItemKey(null);
 setFilterWarehouse('all');
 setFilterBrand('all');
 setFilterSize('all');
 setFilterStatus('all');
 setFilterAvailability('all');
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 };

 // Convert StockItemRecord to PositionSerializedMattress for modal view
 const toSerializedMattress = (item: StockItemRecord): PositionSerializedMattress => {
 const locParts = item.location.split('-');
 const levelCode = (locParts[1] === 'C' || locParts[1] === 'B' || locParts[1] === 'A') ? locParts[1] : 'A';

 return {
 uid: item.uid,
 sku: item.sku,
 productName: item.productName,
 brand: item.brand,
 size: item.size,
 levelCode: levelCode as 'C' | 'B' | 'A',
 locationCode: item.location,
 lotNumber: item.lotNumber,
 entryDate: item.entryDate,
 ageDays: item.ageDays,
 status: item.status as any,
 classification: 'Colchón Terminado / Calidad A',
 notes: `Registro verificado en ${item.warehouseName}.`,
 };
 };

 const getStatusBadge = (status: string) => {
 switch (status) {
 case 'Disponible':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'Comprometido':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'En acomodo':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'En retrabajo':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 case 'En embarque':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'En exhibición':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'En tránsito':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 // Paginator for articles
 const totalPagesArticle = Math.ceil(aggregatedArticles.length / pageSize) || 1;
 const paginatedArticles = aggregatedArticles.slice((currentPageArticle - 1) * pageSize, currentPageArticle * pageSize);

 // Paginator for units
 const totalPagesUnit = Math.ceil(filteredUnitItems.length / pageSize) || 1;
 const paginatedUnits = filteredUnitItems.slice((currentPageUnit - 1) * pageSize, currentPageUnit * pageSize);

 // Global KPIs from active units
 const totalActivePhysical = filteredUnitItems.length;
 const totalActiveAvailable = filteredUnitItems.filter(u => u.status === 'Disponible').length;
 const totalActiveCommitted = filteredUnitItems.filter(u => u.status === 'Comprometido').length;
 const totalActiveOperations = filteredUnitItems.filter(u => u.status !== 'Disponible' && u.status !== 'Comprometido').length;

 return (
 <div className="space-y-6 animate-in fade-in duration-200 w-full">
 
 {/* ========================================================================= */}
 {/* SUBTABS PRINCIPALES: [ Por artículo ] & [ Por unidad ] */}
 {/* ========================================================================= */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-subtle">
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle w-fit">
 <button
 onClick={() => setActiveSubtab('by-article')}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'by-article'
 ? 'bg-theme-primary text-white shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <Boxes className="w-4 h-4" />
 <span>Por artículo</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
 activeSubtab === 'by-article' ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {aggregatedArticles.length}
 </span>
 </button>

 <button
 onClick={() => setActiveSubtab('by-unit')}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
 activeSubtab === 'by-unit'
 ? 'bg-theme-primary text-white shadow-xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <QrCode className="w-4 h-4" />
 <span>Por unidad</span>
 <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
 activeSubtab === 'by-unit' ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {filteredUnitItems.length}
 </span>
 </button>
 </div>

 {/* Global Summary Chips */}
 <div className="flex items-center gap-2 text-xs flex-wrap">
 <span className="px-3 py-1 rounded-xl bg-theme-surface border border-theme-subtle text-theme-muted">
 Total en Red: <strong className="text-theme-main font-mono">{totalActivePhysical} pzas</strong>
 </span>
 <span className="px-3 py-1 rounded-xl bg-white border border-emerald-600 text-zinc-900 shadow-2xs">
 Disponibles: <strong className="font-mono">{totalActiveAvailable}</strong>
 </span>
 <span className="px-3 py-1 rounded-xl bg-white border border-amber-500 text-zinc-900 shadow-2xs">
 Comprometidas: <strong className="font-mono">{totalActiveCommitted}</strong>
 </span>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* TOOLBAR: BUSCADOR CON AUTOCOMPLETE & FILTROS MULTI-VARIABLE */}
 {/* ========================================================================= */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
 
 {/* Buscador con Autocomplete */}
 <div ref={searchContainerRef} className="relative w-full md:w-96">
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onFocus={() => {
 if (searchTerm.trim().length > 0) setIsDropdownOpen(true);
 }}
 onChange={(e) => {
 setSearchTerm(e.target.value);
 setIsDropdownOpen(true);
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 }}
 placeholder="Buscar artículo, SKU, UID/Serie, marca o ubicación..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-10 pr-9 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all font-medium"
 />

 {searchTerm && (
 <button
 onClick={handleClearSearch}
 className="absolute right-2.5 top-2.5 p-1 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-subtle transition-colors cursor-pointer"
 title="Limpiar búsqueda"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 {/* AUTOCOMPLETE DROPDOWN */}
 {isDropdownOpen && searchTerm.trim().length > 0 && (
 <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-150">
 <div className="p-2 border-b border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-[11px] text-theme-muted">
 <span className="font-semibold">Coincidencias en Existencias</span>
 <span className="font-mono text-[10px]">{autocompleteSuggestions.length} sugerencias</span>
 </div>

 <div className="max-h-72 overflow-y-auto divide-y divide-theme-subtle">
 {autocompleteSuggestions.length === 0 ? (
 <div className="p-4 text-center text-xs text-theme-muted">
 No se encontraron coincidencias para &ldquo;<strong className="text-theme-main">{searchTerm}</strong>&rdquo;
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
 {item.type === 'article' && <Boxes className="w-4 h-4 text-blue-600 shrink-0" />}
 {item.type === 'location' && <MapPin className="w-4 h-4 text-amber-600 shrink-0" />}

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
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white text-zinc-900 border shadow-2xs ${
 item.type === 'unit'
 ? 'border-purple-500'
 : item.type === 'article'
 ? 'border-blue-500'
 : 'border-amber-500'
 }`}>
 {item.type === 'unit' ? 'Unidad' : item.type === 'article' ? 'Artículo' : 'Ubicación'}
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

 {/* Filtros Selectores */}
 <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
 <div className="flex items-center gap-1 text-theme-muted mr-1 hidden sm:flex">
 <Filter className="w-3.5 h-3.5" />
 <span>Filtros:</span>
 </div>

 {/* Almacén */}
 <select
 value={filterWarehouse}
 onChange={(e) => {
 setFilterWarehouse(e.target.value);
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los almacenes / sucursales</option>
 {MOCK_WAREHOUSES_LIST.map((w) => (
 <option key={w.id} value={w.id}>
 {w.name} ({w.code})
 </option>
 ))}
 </select>

 {/* Marca */}
 <select
 value={filterBrand}
 onChange={(e) => {
 setFilterBrand(e.target.value);
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todas las marcas</option>
 <option value="Nayt">Nayt</option>
 <option value="Spring Air">Spring Air</option>
 <option value="Restonic">Restonic</option>
 <option value="América">América</option>
 <option value="Sealy">Sealy</option>
 </select>

 {/* Medida */}
 <select
 value={filterSize}
 onChange={(e) => {
 setFilterSize(e.target.value);
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todas las medidas</option>
 <option value="Individual">Individual</option>
 <option value="Matrimonial">Matrimonial</option>
 <option value="Queen Size">Queen Size</option>
 <option value="King Size">King Size</option>
 </select>

 {/* Estado */}
 <select
 value={filterStatus}
 onChange={(e) => {
 setFilterStatus(e.target.value);
 setCurrentPageArticle(1);
 setCurrentPageUnit(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos los estados</option>
 <option value="Disponible">Disponible</option>
 <option value="Comprometido">Comprometido</option>
 <option value="En exhibición">En exhibición</option>
 <option value="En acomodo">En acomodo</option>
 <option value="En embarque">En embarque</option>
 <option value="En retrabajo">En retrabajo</option>
 <option value="En tránsito">En tránsito</option>
 </select>

 {/* Con existencia (Opcional en Por Artículo) */}
 {activeSubtab === 'by-article' && (
 <select
 value={filterAvailability}
 onChange={(e) => {
 setFilterAvailability(e.target.value);
 setCurrentPageArticle(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 <option value="all">Todos (Stock)</option>
 <option value="in-stock">Con existencia</option>
 <option value="out-of-stock">Sin existencia</option>
 </select>
 )}

 {/* Reset Filters */}
 <button
 onClick={handleResetFilters}
 className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
 title="Restablecer filtros"
 >
 <RotateCcw className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Banner de Coincidencia Morada cuando viene de búsqueda */}
 {highlightedItemKey && (
 <div className="p-3.5 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-between text-xs shadow-xs animate-in fade-in duration-150">
 <div className="flex items-center gap-2.5">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <span className="font-bold text-purple-950 dark:text-purple-300">
 Coincidencia encontrada para: <strong className="font-mono">{highlightedItemKey}</strong>
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
 Resaltada en Morado
 </span>
 </div>

 <button
 onClick={() => setHighlightedItemKey(null)}
 className="text-purple-700 hover:underline font-bold text-xs cursor-pointer"
 >
 Limpiar resaltado
 </button>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISTA 1: TABLA RESUMIDA "POR ARTÍCULO" (DEFAULT) */}
 {/* ========================================================================= */}
 {activeSubtab === 'by-article' && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-xs overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[1360px]">
 <thead>
 <tr className="border-b border-theme-subtle bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 <th className="py-3 px-4 whitespace-nowrap min-w-[150px]">SKU</th>
 <th className="py-3 px-4 min-w-[260px]">Artículo</th>
 <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">Marca</th>
 <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">Medida</th>
 <th className="py-3 px-3 text-right whitespace-nowrap min-w-[90px]">Existencia Total</th>
 <th className="py-3 px-3 text-right text-emerald-600 whitespace-nowrap min-w-[85px]">Disponible</th>
 <th className="py-3 px-3 text-right text-amber-600 whitespace-nowrap min-w-[95px]">Comprometido</th>
 <th className="py-3 px-3 text-right text-blue-600 whitespace-nowrap min-w-[85px]">En Acomodo</th>
 <th className="py-3 px-3 text-right text-purple-600 whitespace-nowrap min-w-[90px]">En Embarque</th>
 <th className="py-3 px-3 text-right text-rose-600 whitespace-nowrap min-w-[90px]">En Retrabajo</th>
 <th className="py-3 px-3 text-right text-zinc-600 whitespace-nowrap min-w-[85px]">En Tránsito</th>
 <th className="py-3 px-3 text-center whitespace-nowrap min-w-[95px]">CEDIS</th>
 <th className="py-3 px-4 text-center whitespace-nowrap min-w-[145px]">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {paginatedArticles.length === 0 ? (
 <tr>
 <td colSpan={13} className="py-12 text-center text-theme-muted">
 No se encontraron artículos que coincidan con los filtros aplicados.
 </td>
 </tr>
 ) : (
 paginatedArticles.map((art) => {
 const isHighlighted = highlightedItemKey && (
 art.sku.toLowerCase() === highlightedItemKey.toLowerCase() ||
 art.productName.toLowerCase().includes(highlightedItemKey.toLowerCase())
 );

 return (
 <tr
 key={art.sku}
 className={`transition-colors ${
 isHighlighted
 ? 'bg-purple-600/10 ring-2 ring-purple-400/50'
 : 'hover:bg-theme-muted/40'
 }`}
 >
 {/* SKU */}
 <td className="py-3 px-4 font-mono font-bold text-theme-primary whitespace-nowrap min-w-[150px]">
 {art.sku}
 </td>

 {/* Nombre del Artículo */}
 <td className="py-3 px-4 font-bold text-theme-main min-w-[260px]">
 {art.productName}
 </td>

 {/* Marca */}
 <td className="py-3 px-3 whitespace-nowrap min-w-[110px]">
 <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle whitespace-nowrap inline-block">
 {art.brand}
 </span>
 </td>

 {/* Medida */}
 <td className="py-3 px-3 text-theme-muted font-medium whitespace-nowrap min-w-[110px]">
 {art.size}
 </td>

 {/* Existencia Total */}
 <td className="py-3 px-3 text-right font-mono font-black text-sm text-theme-main whitespace-nowrap">
 {art.totalUnits}
 </td>

 {/* Disponible */}
 <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
 {art.availableUnits}
 </td>

 {/* Comprometido */}
 <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 whitespace-nowrap">
 {art.committedUnits}
 </td>

 {/* En Acomodo */}
 <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 whitespace-nowrap">
 {art.stagingUnits}
 </td>

 {/* En Embarque */}
 <td className="py-3 px-3 text-right font-mono font-bold text-purple-600 whitespace-nowrap">
 {art.shippingUnits}
 </td>

 {/* En Retrabajo */}
 <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
 {art.reworkUnits}
 </td>

 {/* En Tránsito */}
 <td className="py-3 px-3 text-right font-mono font-bold text-zinc-600 whitespace-nowrap">
 {art.inTransitUnits}
 </td>

 {/* CEDIS */}
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <div className="flex items-center justify-center gap-1">
 {art.warehouses.length > 1 ? (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle whitespace-nowrap">
 {art.warehouses.length} CEDIS
 </span>
 ) : (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle whitespace-nowrap">
 {art.warehouses[0]?.code || '1 CEDIS'}
 </span>
 )}
 </div>
 </td>

 {/* Acción */}
 <td className="py-3 px-4 text-center whitespace-nowrap">
 <button
 onClick={() => setSelectedArticleSummary(art)}
 className="px-3 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
 >
 <span>Ver existencias</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="p-4 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-theme-muted">
 <div>
 Mostrando <strong className="text-theme-main">{paginatedArticles.length}</strong> de <strong className="text-theme-main">{aggregatedArticles.length}</strong> artículos agrupados
 </div>

 <div className="flex items-center gap-2">
 <button
 disabled={currentPageArticle === 1}
 onClick={() => setCurrentPageArticle((p) => p - 1)}
 className="p-1.5 rounded-lg border border-theme-subtle disabled:opacity-30 hover:bg-theme-muted text-theme-main cursor-pointer"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <span className="font-mono font-bold text-theme-main">
 {currentPageArticle} / {totalPagesArticle}
 </span>
 <button
 disabled={currentPageArticle === totalPagesArticle}
 onClick={() => setCurrentPageArticle((p) => p + 1)}
 className="p-1.5 rounded-lg border border-theme-subtle disabled:opacity-30 hover:bg-theme-muted text-theme-main cursor-pointer"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* VISTA 2: TABLA INDIVIDUAL "POR UNIDAD" (SERIALIZADA) */}
 {/* ========================================================================= */}
 {activeSubtab === 'by-unit' && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-xs overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
 <thead>
 <tr className="border-b border-theme-subtle bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
 <th className="py-3 px-4 whitespace-nowrap">UID / Serie</th>
 <th className="py-3 px-3 whitespace-nowrap">SKU</th>
 <th className="py-3 px-4">Artículo</th>
 <th className="py-3 px-3 whitespace-nowrap">Marca</th>
 <th className="py-3 px-3 whitespace-nowrap">Medida</th>
 <th className="py-3 px-3 whitespace-nowrap">CEDIS</th>
 <th className="py-3 px-3 whitespace-nowrap">Ubicación</th>
 <th className="py-3 px-3 whitespace-nowrap">Lote</th>
 <th className="py-3 px-3 whitespace-nowrap">Fecha Entrada</th>
 <th className="py-3 px-3 whitespace-nowrap">Antigüedad</th>
 <th className="py-3 px-3 whitespace-nowrap">Estado</th>
 <th className="py-3 px-4 whitespace-nowrap text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {paginatedUnits.length === 0 ? (
 <tr>
 <td colSpan={12} className="py-12 text-center text-theme-muted">
 No se encontraron unidades serializadas que coincidan con los filtros.
 </td>
 </tr>
 ) : (
 paginatedUnits.map((item) => {
 const isHighlighted = highlightedItemKey && (
 item.uid.toLowerCase() === highlightedItemKey.toLowerCase() ||
 item.location.toLowerCase() === highlightedItemKey.toLowerCase() ||
 item.sku.toLowerCase() === highlightedItemKey.toLowerCase()
 );

 const serialized = toSerializedMattress(item);

 return (
 <tr
 key={item.uid}
 className={`transition-colors ${
 isHighlighted
 ? 'bg-purple-600/10 ring-2 ring-purple-400/50'
 : 'hover:bg-theme-muted/40'
 }`}
 >
 {/* UID */}
 <td className="py-3 px-4 font-mono font-bold text-theme-main flex items-center gap-1.5 whitespace-nowrap">
 <QrCode className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 <span>{item.uid}</span>
 </td>

 {/* SKU */}
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {item.sku}
 </td>

 {/* Artículo */}
 <td className="py-3 px-4 font-bold text-theme-main">
 {item.productName}
 </td>

 {/* Marca */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {item.brand}
 </span>
 </td>

 {/* Medida */}
 <td className="py-3 px-3 text-theme-muted font-medium whitespace-nowrap">
 {item.size}
 </td>

 {/* CEDIS */}
 <td className="py-3 px-3 whitespace-nowrap">
 <div className="flex items-center gap-1 text-theme-main font-medium">
 <Building2 className="w-3 h-3 text-theme-muted shrink-0" />
 <span>{item.warehouseName}</span>
 </div>
 </td>

 {/* Ubicación */}
 <td className="py-3 px-3 font-mono font-black text-theme-primary whitespace-nowrap">
 {item.location}
 </td>

 {/* Lote */}
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {item.lotNumber}
 </td>

 {/* Fecha Entrada */}
 <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
 <div className="flex items-center gap-1">
 <Calendar className="w-3 h-3 text-theme-muted shrink-0" />
 <span>{item.entryDate}</span>
 </div>
 </td>

 {/* Antigüedad */}
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 <div className="flex items-center gap-1">
 <Clock className="w-3 h-3 text-theme-muted shrink-0" />
 <span>{item.ageDays} días</span>
 </div>
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
 {item.status}
 </span>
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => setSelectedUnitDetail(serialized)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer border border-theme-subtle"
 title="Ver ficha individual"
 >
 <Eye className="w-3.5 h-3.5 text-theme-muted" />
 </button>
 <button
 onClick={() => setSelectedQrUnit(serialized)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-purple-600 transition-colors cursor-pointer border border-purple-200/40"
 title="Ver código QR"
 >
 <QrCode className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => setSelectedPrintUnit(serialized)}
 className="p-1.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white transition-colors cursor-pointer shadow-xs"
 title="Imprimir etiqueta térmica"
 >
 <Printer className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="p-4 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-theme-muted">
 <div>
 Mostrando <strong className="text-theme-main">{paginatedUnits.length}</strong> de <strong className="text-theme-main">{filteredUnitItems.length}</strong> unidades serializadas
 </div>

 <div className="flex items-center gap-2">
 <button
 disabled={currentPageUnit === 1}
 onClick={() => setCurrentPageUnit((p) => p - 1)}
 className="p-1.5 rounded-lg border border-theme-subtle disabled:opacity-30 hover:bg-theme-muted text-theme-main cursor-pointer"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <span className="font-mono font-bold text-theme-main">
 {currentPageUnit} / {totalPagesUnit}
 </span>
 <button
 disabled={currentPageUnit === totalPagesUnit}
 onClick={() => setCurrentPageUnit((p) => p + 1)}
 className="p-1.5 rounded-lg border border-theme-subtle disabled:opacity-30 hover:bg-theme-muted text-theme-main cursor-pointer"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* DRAWER / MODAL DE DESGLOSE DE EXISTENCIAS POR ARTÍCULO */}
 {/* ========================================================================= */}
 <ArticleStockDrawer
 article={selectedArticleSummary}
 onClose={() => setSelectedArticleSummary(null)}
 onOpenUnitDetail={(unit) => setSelectedUnitDetail(unit)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* MODAL DE FICHA INDIVIDUAL DE COLCHÓN */}
 {/* ========================================================================= */}
 <UnitDetailModal
 unit={selectedUnitDetail}
 warehouseName={selectedUnitDetail?.locationCode ? "CEDIS Monterrey" : "CEDIS Monterrey Norte"}
 onClose={() => setSelectedUnitDetail(null)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* MODAL DE VISUALIZACIÓN DE QR */}
 {/* ========================================================================= */}
 <QrModal
 unit={selectedQrUnit}
 warehouseName="CEDIS Monterrey"
 onClose={() => setSelectedQrUnit(null)}
 onPrint={(unit) => setSelectedPrintUnit(unit)}
 />

 {/* ========================================================================= */}
 {/* MODAL DE IMPRESIÓN DE ETIQUETA TÉRMICA */}
 {/* ========================================================================= */}
 <PrintQrModal
 unit={selectedPrintUnit}
 warehouseName="CEDIS Monterrey"
 onClose={() => setSelectedPrintUnit(null)}
 />
 </div>
 );
};
