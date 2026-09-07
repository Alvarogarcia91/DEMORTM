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
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Layers2
} from 'lucide-react';
import { 
  MOCK_STOCK_ITEMS, 
  MOCK_WAREHOUSES_LIST,
  MOCK_INVENTORY_MOVEMENTS,
  RTM_INDUSTRIAL_ITEMS,
  StockItemRecord, 
  PositionSerializedItem 
} from '../../data/mockInventoryData';
import { ArticleStockDrawer, ArticleStockSummary, ArticleLotBreakdown } from './ArticleStockDrawer';
import { UnitDetailModal } from './UnitDetailModal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';

interface AutocompleteSuggestion {
  id: string;
  type: 'article' | 'unit' | 'location' | 'lot';
  title: string;
  subtitle: string;
  sku?: string;
  uid?: string;
  location?: string;
  lotNumber?: string;
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterQaStatus, setFilterQaStatus] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'in-stock', 'out-of-stock'

  // Pagination
  const [currentPageArticle, setCurrentPageArticle] = useState(1);
  const [currentPageUnit, setCurrentPageUnit] = useState(1);
  const pageSize = 10;

  // Modals state
  const [selectedArticleSummary, setSelectedArticleSummary] = useState<ArticleStockSummary | null>(null);
  const [selectedUnitDetail, setSelectedUnitDetail] = useState<PositionSerializedItem | null>(null);
  const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedItem | null>(null);
  const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedItem | null>(null);

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
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesQa = filterQaStatus === 'all' || item.qaStatus === filterQaStatus;

      return matchesSearch && matchesWarehouse && matchesCategory && matchesQa;
    });
  }, [searchTerm, filterWarehouse, filterCategory, filterQaStatus]);

  // Aggregated Stock by Material (SKU)
  const aggregatedArticles = useMemo<ArticleStockSummary[]>(() => {
    return RTM_INDUSTRIAL_ITEMS.map((itemDef) => {
      // Find all physical units for this SKU
      const units = MOCK_STOCK_ITEMS.filter(u => u.sku === itemDef.sku);
      const recentMovs = MOCK_INVENTORY_MOVEMENTS.filter(m => m.sku === itemDef.sku);

      // Build lot breakdown
      const lotMap = new Map<string, ArticleLotBreakdown>();
      
      // Default lot
      lotMap.set(itemDef.defaultLot, {
        lotNumber: itemDef.defaultLot,
        qaStatus: itemDef.qaBlocked > 0 && itemDef.sku === 'MP-SBS-240' ? 'Cuarentena' : 'Liberado',
        physicalQuantity: itemDef.totalPhysical - (itemDef.sku === 'MP-BOP-WHT' ? itemDef.qaBlocked : 0),
        reservedQuantity: itemDef.reserved,
        qaBlockedQuantity: itemDef.sku === 'MP-SBS-240' ? itemDef.qaBlocked : 0,
        availableQuantity: itemDef.sku === 'MP-SBS-240' ? itemDef.available : (itemDef.totalPhysical - itemDef.reserved - (itemDef.sku === 'MP-BOP-WHT' ? itemDef.qaBlocked : 0)),
        location: itemDef.mainLocation,
        entryDate: '26 Ago 2026',
        notes: itemDef.relatedOp ? `Material comprometido para ${itemDef.relatedOp}` : undefined,
      });

      // Special QA lot for BOPP Blanco (Caso B)
      if (itemDef.sku === 'MP-BOP-WHT' && itemDef.qaBlocked > 0) {
        lotMap.set('RTM-MP-260906-091', {
          lotNumber: 'RTM-MP-260906-091',
          qaStatus: 'Cuarentena',
          physicalQuantity: itemDef.qaBlocked,
          reservedQuantity: 0,
          qaBlockedQuantity: itemDef.qaBlocked,
          availableQuantity: 0, // Regla de negocio: Disponible = 0
          location: 'RET-QA',
          entryDate: '26 Ago 2026',
          notes: 'Retenido en inspección QA por tensión irregular en bobina de proveedor (Caso B demo)',
        });
      }

      // Also incorporate any unit lots
      units.forEach(u => {
        if (!lotMap.has(u.lotNumber)) {
          lotMap.set(u.lotNumber, {
            lotNumber: u.lotNumber,
            qaStatus: u.qaStatus,
            physicalQuantity: u.physicalQuantity,
            reservedQuantity: u.reservedQuantity,
            qaBlockedQuantity: u.qaBlockedQuantity,
            availableQuantity: u.availableQuantity,
            location: u.location,
            entryDate: u.entryDate,
          });
        }
      });

      const lots = Array.from(lotMap.values());
      const locations = Array.from(new Set(units.map(u => u.location))).map(loc => ({
        locationCode: loc,
        quantity: units.filter(u => u.location === loc).reduce((acc, curr) => acc + curr.physicalQuantity, 0),
      }));

      return {
        sku: itemDef.sku,
        productName: itemDef.name,
        brand: itemDef.brand,
        size: itemDef.size,
        category: itemDef.category,
        uom: itemDef.uom,
        mainLocation: itemDef.mainLocation,
        defaultLot: itemDef.defaultLot,
        relatedOp: itemDef.relatedOp,
        totalPhysical: itemDef.totalPhysical,
        availableQuantity: itemDef.available,
        reservedQuantity: itemDef.reserved,
        qaBlockedQuantity: itemDef.qaBlocked,
        lots,
        locations: locations.length > 0 ? locations : [{ locationCode: itemDef.mainLocation, quantity: itemDef.totalPhysical }],
        allUnits: units,
        recentMovements: recentMovs,
      };
    }).filter((art) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        art.sku.toLowerCase().includes(q) ||
        art.productName.toLowerCase().includes(q) ||
        art.brand.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.mainLocation.toLowerCase().includes(q) ||
        art.defaultLot.toLowerCase().includes(q) ||
        art.lots.some(l => l.lotNumber.toLowerCase().includes(q));

      const matchesCategory = filterCategory === 'all' || art.category === filterCategory;
      const matchesQa = filterQaStatus === 'all' || art.lots.some(l => l.qaStatus === filterQaStatus);

      let matchesAvail = true;
      if (filterAvailability === 'in-stock') matchesAvail = art.availableQuantity > 0;
      else if (filterAvailability === 'out-of-stock') matchesAvail = art.availableQuantity === 0;

      return matchesSearch && matchesCategory && matchesQa && matchesAvail;
    });
  }, [searchTerm, filterCategory, filterQaStatus, filterAvailability]);

  // Autocomplete suggestions generator
  const autocompleteSuggestions = useMemo<AutocompleteSuggestion[]>(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 1) return [];
    const q = searchTerm.toLowerCase().trim();
    const results: AutocompleteSuggestion[] = [];
    const seenKeys = new Set<string>();

    // 1. Articles (SKU or Name)
    RTM_INDUSTRIAL_ITEMS.forEach((item) => {
      if (item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q)) {
        const key = `art-${item.sku}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            id: key,
            type: 'article',
            title: item.sku,
            subtitle: `${item.name} · ${item.totalPhysical.toLocaleString()} ${item.uom}s`,
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
            subtitle: `${item.productName} · ${item.location}`,
            uid: item.uid,
          });
        }
      }
    });

    // 3. Lots
    MOCK_STOCK_ITEMS.forEach((item) => {
      if (item.lotNumber.toLowerCase().includes(q)) {
        const key = `lot-${item.lotNumber}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            id: key,
            type: 'lot',
            title: item.lotNumber,
            subtitle: `Lote de ${item.productName} (${item.qaStatus})`,
            lotNumber: item.lotNumber,
          });
        }
      }
    });

    // 4. Locations
    MOCK_STOCK_ITEMS.forEach((item) => {
      if (item.location.toLowerCase().includes(q)) {
        const key = `loc-${item.location}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            id: key,
            type: 'location',
            title: item.location,
            subtitle: `Posición en almacén (${item.sku})`,
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
    } else if (s.type === 'lot' || s.type === 'location') {
      setSearchTerm(s.title);
      setHighlightedItemKey(s.title);
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
    setFilterCategory('all');
    setFilterQaStatus('all');
    setFilterAvailability('all');
    setCurrentPageArticle(1);
    setCurrentPageUnit(1);
  };

  // Convert StockItemRecord to PositionSerializedItem for modal view
  const toSerializedItem = (item: StockItemRecord): PositionSerializedItem => {
    const locParts = item.location.split('-');
    const levelCode = (locParts[1] === 'C' || locParts[1] === 'B' || locParts[1] === 'A') ? locParts[1] : 'A';

    return {
      uid: item.uid,
      sku: item.sku,
      productName: item.productName,
      brand: item.brand,
      size: item.size,
      category: item.category,
      uom: item.uom,
      levelCode: levelCode as 'C' | 'B' | 'A',
      locationCode: item.location,
      lotNumber: item.lotNumber,
      entryDate: item.entryDate,
      ageDays: item.ageDays,
      status: item.status,
      qaStatus: item.qaStatus,
      physicalQuantity: item.physicalQuantity,
      reservedQuantity: item.reservedQuantity,
      qaBlockedQuantity: item.qaBlockedQuantity,
      availableQuantity: item.availableQuantity,
      relatedOp: item.relatedOp,
      classification: item.category,
      notes: `Registro verificado en ${item.warehouseName}.`,
    };
  };

  // Paginators
  const totalPagesArticle = Math.ceil(aggregatedArticles.length / pageSize) || 1;
  const paginatedArticles = aggregatedArticles.slice((currentPageArticle - 1) * pageSize, currentPageArticle * pageSize);

  const totalPagesUnit = Math.ceil(filteredUnitItems.length / pageSize) || 1;
  const paginatedUnits = filteredUnitItems.slice((currentPageUnit - 1) * pageSize, currentPageUnit * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full">
      
      {/* ========================================================================= */}
      {/* SUBTABS PRINCIPALES: [ Por material/artículo ] & [ Por unidad / tarima ] */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-subtle">
        <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle w-fit">
          <button
            onClick={() => setActiveSubtab('by-article')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubtab === 'by-article'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Por Material / Artículo ({aggregatedArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveSubtab('by-unit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubtab === 'by-unit'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Por Unidad Física / Tarima ({filteredUnitItems.length})</span>
          </button>
        </div>

        {/* Global Stock Formula Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-theme-muted/40 border border-theme-subtle text-theme-muted">
          <span>Regla de Disponibilidad:</span>
          <span className="font-mono text-theme-main font-bold">Físico - Reservado - Bloqueado QA = Disponible</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BUSCADOR MULTI-CRITERIO CON AUTOCOMPLETADO & FILTROS */}
      {/* ========================================================================= */}
      <div className="bg-theme-surface p-4 sm:p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          
          {/* Autocomplete Input */}
          <div ref={searchContainerRef} className="relative w-full lg:w-[480px]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Buscar por código (MP-COU-090), lote, ubicación (PAP-A-03), UID..."
                className="w-full bg-theme-muted border border-theme-subtle rounded-2xl pl-10 pr-9 py-2.5 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary transition-all"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 p-1 text-theme-muted hover:text-theme-main cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {isDropdownOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-surface border border-theme-subtle rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-theme-subtle text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                {autocompleteSuggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSuggestion(s)}
                    className="p-3 hover:bg-theme-muted/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-theme-primary">{s.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-theme-muted text-theme-muted border border-theme-subtle">
                          {s.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-muted truncate mt-0.5">{s.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-theme-muted shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Warehouse Filter */}
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
            >
              <option value="all">Almacén: Todos</option>
              <option value="wh-alm-rtm">Almacén Principal RTM (ALM-RTM)</option>
              <option value="wh-alm-virtual">Almacén Virtual / Control (ALM-VIRTUAL)</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
            >
              <option value="all">Categoría: Todas</option>
              <option value="Papel Offset">Papel Offset</option>
              <option value="Sustratos Flexo">Sustratos Flexo</option>
              <option value="Tintas & Consumibles">Tintas & Consumibles</option>
              <option value="Producto Terminado">Producto Terminado</option>
            </select>

            {/* QA Status Filter */}
            <select
              value={filterQaStatus}
              onChange={(e) => setFilterQaStatus(e.target.value)}
              className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
            >
              <option value="all">Estado QA: Todos</option>
              <option value="Liberado">Liberado</option>
              <option value="Pendiente QA">Pendiente QA</option>
              <option value="Cuarentena">Cuarentena (Bloqueado)</option>
              <option value="Rechazado">Rechazado</option>
            </select>

            {/* Availability Filter */}
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer"
            >
              <option value="all">Disponibilidad: Todos</option>
              <option value="in-stock">Con disponible &gt; 0</option>
              <option value="out-of-stock">Sin disponible (0)</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors cursor-pointer border border-theme-subtle"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: POR ARTÍCULO / MATERIAL (TABLA PRINCIPAL RTM) */}
      {/* ========================================================================= */}
      {activeSubtab === 'by-article' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[980px]">
              <thead>
                <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Material / Descripción</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">UOM</th>
                  <th className="py-3 px-3 text-right">Físico</th>
                  <th className="py-3 px-3 text-right">Reservado</th>
                  <th className="py-3 px-3 text-right">Bloqueado QA</th>
                  <th className="py-3 px-3 text-right font-bold text-theme-primary">Disponible</th>
                  <th className="py-3 px-3">Lote Principal</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {paginatedArticles.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-theme-muted">
                      No se encontraron materiales que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedArticles.map((art) => {
                    const isHighlighted = highlightedItemKey === art.sku;

                    return (
                      <tr 
                        key={art.sku}
                        className={`transition-colors hover:bg-theme-muted/30 ${
                          isHighlighted ? 'bg-theme-primary/10 font-bold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
                          {art.sku}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-extrabold text-theme-main block">{art.productName}</span>
                          <span className="text-[11px] text-theme-muted">{art.brand} &middot; {art.size}</span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
                            {art.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                          {art.uom}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-theme-main whitespace-nowrap">
                          {art.totalPhysical.toLocaleString()}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {art.reservedQuantity > 0 ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {art.reservedQuantity.toLocaleString()}
                              {art.relatedOp && <span className="text-[9px] text-amber-600 font-sans">({art.relatedOp})</span>}
                            </span>
                          ) : (
                            <span className="font-mono text-theme-muted">0</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {art.qaBlockedQuantity > 0 ? (
                            <span className="font-mono font-black text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              {art.qaBlockedQuantity.toLocaleString()}
                            </span>
                          ) : (
                            <span className="font-mono text-theme-muted">0</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-black text-emerald-700 whitespace-nowrap">
                          <span className="bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                            {art.availableQuantity.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                          {art.defaultLot}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-theme-primary" />
                            <span>{art.mainLocation}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedArticleSummary(art)}
                            className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-primary hover:text-white text-theme-main font-bold transition-all cursor-pointer border border-theme-subtle flex items-center gap-1.5 ml-auto text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Detalle</span>
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
          <div className="p-4 border-t border-theme-subtle flex items-center justify-between text-xs text-theme-muted">
            <span>
              Mostrando {paginatedArticles.length} de {aggregatedArticles.length} materiales
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPageArticle(p => Math.max(1, p - 1))}
                disabled={currentPageArticle === 1}
                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-theme-main">
                Pág. {currentPageArticle} de {totalPagesArticle}
              </span>
              <button
                onClick={() => setCurrentPageArticle(p => Math.min(totalPagesArticle, p + 1))}
                disabled={currentPageArticle === totalPagesArticle}
                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: POR UNIDAD FÍSICA / TARIMA / BOBINA */}
      {/* ========================================================================= */}
      {activeSubtab === 'by-unit' && (
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">UID / Serie</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-3">Lote</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Estado QA</th>
                  <th className="py-3 px-3 text-right">Cant. Física</th>
                  <th className="py-3 px-3">Almacén</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {paginatedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-theme-muted">
                      No se encontraron unidades con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  paginatedUnits.map((item) => {
                    const serialized = toSerializedItem(item);
                    return (
                      <tr key={item.uid} className="hover:bg-theme-muted/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-theme-main flex items-center gap-1.5 whitespace-nowrap">
                          <QrCode className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                          <span>{item.uid}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-theme-main block">{item.productName}</span>
                          <span className="font-mono text-[10px] text-theme-muted">{item.sku}</span>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
                          {item.location}
                        </td>

                        <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
                          {item.lotNumber}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.status === 'Disponible'
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                              : item.status === 'Comprometido'
                              ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                              : item.status === 'Cuarentena'
                              ? 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                              : 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.qaStatus === 'Liberado'
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-700 border-rose-500/30'
                          }`}>
                            {item.qaStatus}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-theme-main whitespace-nowrap">
                          {item.physicalQuantity.toLocaleString()} {item.uom}s
                        </td>

                        <td className="py-3 px-3 text-theme-muted whitespace-nowrap">
                          {item.warehouseName}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUnitDetail(serialized)}
                              className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer border border-theme-subtle"
                              title="Ver detalle"
                            >
                              <Eye className="w-3.5 h-3.5 text-theme-muted" />
                            </button>
                            <button
                              onClick={() => setSelectedQrUnit(serialized)}
                              className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-purple-600 transition-colors cursor-pointer border border-purple-200/40"
                              title="Ver QR"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedPrintUnit(serialized)}
                              className="p-1.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white transition-colors cursor-pointer shadow-xs"
                              title="Imprimir etiqueta"
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
          <div className="p-4 border-t border-theme-subtle flex items-center justify-between text-xs text-theme-muted">
            <span>
              Mostrando {paginatedUnits.length} de {filteredUnitItems.length} unidades
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPageUnit(p => Math.max(1, p - 1))}
                disabled={currentPageUnit === 1}
                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-theme-main">
                Pág. {currentPageUnit} de {totalPagesUnit}
              </span>
              <button
                onClick={() => setCurrentPageUnit(p => Math.min(totalPagesUnit, p + 1))}
                disabled={currentPageUnit === totalPagesUnit}
                className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER & MODALES */}
      {/* ========================================================================= */}
      <ArticleStockDrawer
        article={selectedArticleSummary}
        onClose={() => setSelectedArticleSummary(null)}
        onOpenUnitDetail={(unit) => setSelectedUnitDetail(unit)}
        onOpenQr={(unit) => setSelectedQrUnit(unit)}
        onPrintQr={(unit) => setSelectedPrintUnit(unit)}
      />

      <UnitDetailModal
        unit={selectedUnitDetail}
        warehouseName={selectedUnitDetail ? 'Almacén Principal RTM' : ''}
        onClose={() => setSelectedUnitDetail(null)}
        onOpenQr={(u) => setSelectedQrUnit(u)}
        onPrintQr={(u) => setSelectedPrintUnit(u)}
      />

      <QrModal
        unit={selectedQrUnit}
        warehouseName={selectedQrUnit ? 'Almacén Principal RTM' : ''}
        onClose={() => setSelectedQrUnit(null)}
        onPrint={(u) => {
          setSelectedPrintUnit(u);
          setSelectedQrUnit(null);
        }}
      />

      <PrintQrModal
        unit={selectedPrintUnit}
        warehouseName={selectedPrintUnit ? 'Almacén Principal RTM' : ''}
        onClose={() => setSelectedPrintUnit(null)}
      />
    </div>
  );
};
