import React, { useState, useMemo } from 'react';
import { 
 Building2, 
 MapPin, 
 Layers, 
 Truck, 
 ShieldAlert, 
 CheckCircle2, 
 Eye, 
 Boxes, 
 ExternalLink,
 X,
 Store,
 QrCode,
 Printer,
 Search,
 Filter,
 ChevronLeft,
 ChevronRight,
 Sparkles,
 Tag,
 Info,
 Package,
 Calendar,
 Clock,
 LayoutGrid,
 ClipboardList,
 Flame,
 ArrowRight,
 Radio
} from 'lucide-react';
import { 
 MOCK_WAREHOUSES_LIST, 
 WarehouseLayout, 
 PositionRack, 
 PositionSerializedItem,
 MOCK_STOCK_ITEMS,
 StockItemRecord,
 SpecialAreaSlot,
 ShowroomBay
} from '../../data/mockInventoryData';
import { LocationQrModal, PhysicalLocationMeta } from './LocationQrModal';
import { PrintLocationQrModal } from './PrintLocationQrModal';
import { PositionDetailModal } from './PositionDetailModal';
import { UnitDetailModal } from './UnitDetailModal';
import { ModalPortal } from '../common/ModalPortal';
import { QrModal } from './QrModal';
import { PrintQrModal } from './PrintQrModal';
import { ShowroomBayModal } from './ShowroomBayModal';
import { LocationBatchPrintModal } from './LocationBatchPrintModal';

export const WarehousesTab: React.FC = () => {
 const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLayout | null>(null);
 const [nodeDetailTab, setNodeDetailTab] = useState<'summary' | 'layout' | 'locations' | 'inventory' | 'zones' | 'qrs'>('summary');

 // Sub-modal states for warehouse detail interactivity
 const [selectedPosition, setSelectedPosition] = useState<PositionRack | null>(null);
 const [selectedUnitDetail, setSelectedUnitDetail] = useState<PositionSerializedItem | null>(null);
 const [selectedQrUnit, setSelectedQrUnit] = useState<PositionSerializedItem | null>(null);
 const [selectedPrintUnit, setSelectedPrintUnit] = useState<PositionSerializedItem | null>(null);
 const [selectedShowroomBay, setSelectedShowroomBay] = useState<ShowroomBay | null>(null);
 const [isBatchPrintOpen, setIsBatchPrintOpen] = useState<boolean>(false);

 // Location QR Modals
 const [selectedLocationQr, setSelectedLocationQr] = useState<PhysicalLocationMeta | null>(null);
 const [selectedPrintLocationQr, setSelectedPrintLocationQr] = useState<PhysicalLocationMeta | null>(null);

 // Filters within node detail tabs
 const [locSearch, setLocSearch] = useState('');
 const [locTypeFilter, setLocTypeFilter] = useState('all');
 const [invSearch, setInvSearch] = useState('');
 const [invStatusFilter, setInvStatusFilter] = useState('all');

 const physicalWarehouses = MOCK_WAREHOUSES_LIST.filter(w => w.code === 'ALM-RTM' || w.id === 'wh-alm-rtm');
  const virtualWarehouses = MOCK_WAREHOUSES_LIST.filter(w => w.code === 'ALM-VIRTUAL' || w.id === 'wh-alm-virtual');

 // Handler to open warehouse detail
 const handleOpenWarehouseDetail = (wh: WarehouseLayout, initialTab: 'summary' | 'layout' | 'locations' | 'inventory' | 'zones' | 'qrs' = 'summary') => {
 setSelectedWarehouse(wh);
 setNodeDetailTab(initialTab);
 setLocSearch('');
 setLocTypeFilter('all');
 setInvSearch('');
 setInvStatusFilter('all');
 };

 // Build locations catalog for the selected warehouse
 const currentWarehouseLocations = useMemo<PhysicalLocationMeta[]>(() => {
 if (!selectedWarehouse) return [];
 const list: PhysicalLocationMeta[] = [];

 // 1. Racks (Levels C, B, A per position)
 selectedWarehouse.aisles.forEach((aisle) => {
 aisle.positions.forEach((pos) => {
 ['C', 'B', 'A'].forEach((lvlCode) => {
 const lvl = pos.levels?.find(l => l.levelCode === lvlCode);
 const locCode = lvl?.locationCode || `${pos.aisle}-${lvlCode}-${pos.positionNumber}`;
 const unitsCount = lvl?.units ? lvl.units.length : (lvl?.count || 0);

 list.push({
 code: locCode,
 name: `Nivel ${lvlCode} (${lvlCode === 'C' ? 'Superior' : lvlCode === 'B' ? 'Medio' : 'Piso'}) · Posición ${pos.positionNumber} · ${aisle.aisleCode}`,
 type: selectedWarehouse.type.includes('Sucursal') ? 'SUCURSAL' : 'RACK',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 aisle: aisle.aisleCode,
 level: lvlCode,
 positionNumber: pos.positionNumber,
 capacity: 7,
 currentUnits: unitsCount,
 status: 'Activa · Operativa',
 description: `Posición de rack en ${selectedWarehouse.name} (${aisle.aisleCode}).`,
 });
 });
 });
 });

 // 2. Reception
 selectedWarehouse.receptionAreas.forEach((rec) => {
 list.push({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 description: `Área de recepción y descarga en ${selectedWarehouse.name}.`,
 });
 });

 // 3. Staging / Acomodo / Reserva / Entrega
 selectedWarehouse.stagingAreas.forEach((stg) => {
 list.push({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 description: `Zona operativa de acomodo / entrega en ${selectedWarehouse.name}.`,
 });
 });

 // 4. Rework / Incidencias
 if (selectedWarehouse.reworkZone) {
 list.push({
 code: selectedWarehouse.reworkZone.code,
 name: selectedWarehouse.reworkZone.name,
 type: 'RETRABAJO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: selectedWarehouse.reworkZone.capacity,
 currentUnits: selectedWarehouse.reworkZone.currentUnits,
 status: selectedWarehouse.reworkZone.status,
 description: `Zona de aislamiento y control de calidad en ${selectedWarehouse.name}.`,
 });
 }

 // 5. Shipping Lanes
 selectedWarehouse.shippingLanes.forEach((lane) => {
 list.push({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 description: `Carril de despacho / entrega en ${selectedWarehouse.name}.`,
 });
 });

 // 6. Showroom Bays (Exhibición Retail)
 if (selectedWarehouse.showroomBays) {
 selectedWarehouse.showroomBays.forEach((bay) => {
 list.push({
 code: bay.code,
 name: `${bay.name} · Showroom`,
 type: 'SHOWROOM',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: 1,
 currentUnits: bay.status === 'Ocupada' && bay.mattress ? 1 : 0,
 status: bay.status === 'Ocupada' ? 'Ocupada · En exhibición' : 'Libre para montaje',
 description: `Bahía de exhibición retail en piso de venta (${selectedWarehouse.name}).`,
 });
 });
 }

 return list;
 }, [selectedWarehouse]);

 // Filtered locations inside detail modal
 const filteredNodeLocations = useMemo(() => {
 return currentWarehouseLocations.filter((loc) => {
 const q = locSearch.toLowerCase().trim();
 const matchesSearch = !q || loc.code.toLowerCase().includes(q) || loc.name.toLowerCase().includes(q);
 const matchesType = locTypeFilter === 'all' || loc.type === locTypeFilter;
 return matchesSearch && matchesType;
 });
 }, [currentWarehouseLocations, locSearch, locTypeFilter]);

 // Inventory items of the selected warehouse
 const nodeInventoryItems = useMemo(() => {
 if (!selectedWarehouse) return [];
 return MOCK_STOCK_ITEMS.filter(item => item.warehouseId === selectedWarehouse.id);
 }, [selectedWarehouse]);

 // Filtered inventory items
 const filteredNodeInventory = useMemo(() => {
 return nodeInventoryItems.filter((item) => {
 const q = invSearch.toLowerCase().trim();
 const matchesSearch = 
 !q ||
 item.sku.toLowerCase().includes(q) ||
 item.productName.toLowerCase().includes(q) ||
 item.uid.toLowerCase().includes(q) ||
 item.location.toLowerCase().includes(q);
 const matchesStatus = invStatusFilter === 'all' || item.status === invStatusFilter;
 return matchesSearch && matchesStatus;
 });
 }, [nodeInventoryItems, invSearch, invStatusFilter]);

 // Stock inventory metrics for selected warehouse
 const nodeStockMetrics = useMemo(() => {
 if (!selectedWarehouse) return { total: 0, available: 0, committed: 0, inTransit: 0, rework: 0, showroom: 0 };
 const items = nodeInventoryItems;
 return {
 total: items.length || selectedWarehouse.kpis.physicalUnits,
 available: items.filter(i => i.status === 'Disponible').length,
 committed: items.filter(i => i.status === 'Comprometido').length,
 inTransit: items.filter(i => i.status === 'En tránsito' || i.status === 'En acomodo' || i.status === 'En embarque').length,
 rework: items.filter(i => i.status === 'En retrabajo').length,
 showroom: items.filter(i => i.status === 'En exhibición').length,
 };
 }, [selectedWarehouse, nodeInventoryItems]);

 const getTypeBadge = (type: string) => {
 switch (type) {
 case 'RACK':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'RECEPCION':
 return 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs';
 case 'ACOMODO':
 return 'bg-white text-zinc-900 border border-blue-500 shadow-2xs';
 case 'RETRABAJO':
 return 'bg-white text-zinc-900 border border-rose-500 shadow-2xs';
 case 'EMBARQUE':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 case 'SUCURSAL':
 return 'bg-white text-zinc-900 border border-amber-500 shadow-2xs';
 case 'SHOWROOM':
 return 'bg-white text-zinc-900 border border-purple-500 shadow-2xs';
 default:
 return 'bg-white text-zinc-900 border border-zinc-400 shadow-2xs';
 }
 };

 const renderWarehouseCard = (wh: WarehouseLayout) => {
    const isVirtual = wh.code === 'ALM-VIRTUAL';
    const unitsCount = wh.kpis.physicalUnits;
    const positionsCount = wh.kpis.totalLocations;
    const aislesCount = wh.aisles.length;
    const lanesCount = wh.shippingLanes.length;

    return (
      <div
        key={wh.id}
        className="bg-theme-surface border border-theme-subtle rounded-3xl p-6 shadow-xs hover:border-theme-primary/50 transition-all flex flex-col justify-between space-y-5 group"
      >
        <div className="space-y-4">
          {/* Top Title & Code Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isVirtual 
                  ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 group-hover:scale-105' 
                  : 'bg-theme-primary/10 text-theme-primary border-theme-primary/20 group-hover:scale-105'
              }`}>
                {isVirtual ? <ShieldAlert className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-theme-main">{wh.name}</h3>
                  <span className="font-mono text-xs font-black text-theme-primary bg-theme-primary/10 px-2.5 py-0.5 rounded-lg border border-theme-primary/20">
                    {wh.code}
                  </span>
                </div>
                <span className="text-xs text-theme-muted font-medium block mt-0.5">
                  {isVirtual ? 'Control Administrativo y Conciliación Lógica' : 'Almacén Central Industrial & Producción'}
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isVirtual 
                ? 'bg-purple-500/10 text-purple-700 border-purple-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            }`}>
              {isVirtual ? 'Control Lógico' : 'Activo · Operativo'}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-xs text-theme-muted bg-theme-muted/40 p-3 rounded-2xl border border-theme-subtle">
            <MapPin className="w-4 h-4 text-theme-muted shrink-0 mt-0.5" />
            <span className="line-clamp-2">{wh.address}</span>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-theme-muted/50 border border-theme-subtle">
              <span className="text-[9px] uppercase font-bold text-theme-muted block">
                {isVirtual ? 'Registros Lógicos' : 'Inventario Físico'}
              </span>
              <strong className="text-sm sm:text-base font-extrabold text-theme-primary font-mono block mt-0.5">
                {unitsCount} {isVirtual ? 'reg' : 'pzas'}
              </strong>
              <span className="text-[10px] text-theme-muted">{isVirtual ? 'en investigación' : 'tarimas / bobinas'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-theme-muted/50 border border-theme-subtle">
              <span className="text-[9px] uppercase font-bold text-theme-muted block">Posiciones</span>
              <strong className="text-sm sm:text-base font-extrabold text-theme-main font-mono block mt-0.5">
                {isVirtual ? 'Virtuales' : positionsCount}
              </strong>
              <span className="text-[10px] text-theme-muted">{isVirtual ? 'sin rack físico' : 'racks en planta'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-theme-muted/50 border border-theme-subtle">
              <span className="text-[9px] uppercase font-bold text-theme-muted block">Zonas Operativas</span>
              <strong className="text-sm sm:text-base font-extrabold text-theme-main font-mono block mt-0.5">
                {isVirtual ? 'Control' : `${aislesCount} pasillos`}
              </strong>
              <span className="text-[10px] text-theme-muted">{isVirtual ? 'conciliación' : 'Offset / Flexo / Tintas'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-theme-muted/50 border border-theme-subtle">
              <span className="text-[9px] uppercase font-bold text-theme-muted block">
                Embarques
              </span>
              <strong className="text-sm sm:text-base font-extrabold text-blue-600 font-mono block mt-0.5">
                {isVirtual ? 'N/A' : 'Carril 01'}
              </strong>
              <span className="text-[10px] text-theme-muted">{isVirtual ? 'sin rampa física' : 'EMB-01'}</span>
            </div>
          </div>

          {/* Occupancy Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-theme-muted font-medium">Nivel de Ocupación</span>
              <strong className="font-mono font-bold text-theme-main">{wh.kpis.occupancyPercentage}%</strong>
            </div>
            <div className="w-full bg-theme-muted h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  wh.kpis.occupancyPercentage > 80 ? 'bg-amber-500' : 'bg-theme-primary'
                }`}
                style={{ width: `${Math.min(100, wh.kpis.occupancyPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleOpenWarehouseDetail(wh, 'summary')}
          className="w-full py-3 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
        >
          <span>{isVirtual ? 'Ver control lógico y auditoría' : 'Ver detalle de la planta y zonas'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

 return (
 <div className="space-y-8 animate-in fade-in duration-200">
 
 {/* Top Banner with Logistics Network Overview */}
      <div className="bg-theme-surface p-6 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-theme-main">Almacenes & Áreas de Planta</h2>
          </div>
          <p className="text-xs text-theme-muted">
            Estructura operativa de Impresos RTM: Almacén Principal físico con sus zonas de producción y Almacén Virtual para control y conciliación.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-theme-muted text-theme-main border border-theme-subtle">
            🏭 1 Almacén Físico Principal (ALM-RTM)
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-700 border border-purple-500/20">
            🧠 1 Almacén Virtual / Control (ALM-VIRTUAL)
          </span>
          <button
            onClick={() => setIsBatchPrintOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir etiquetas por columna</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRUPO 1: ALMACÉN PRINCIPAL RTM (ÚNICO ALMACÉN FÍSICO) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-theme-subtle">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-theme-primary" />
            <h3 className="text-sm font-black uppercase tracking-wider text-theme-main">
              Almacén Físico Principal (Planta Reynosa)
            </h3>
          </div>
          <span className="text-xs text-theme-muted font-mono">5 Zonas Operativas · 1 Carril de Embarque (EMB-01)</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {physicalWarehouses.map(wh => renderWarehouseCard(wh))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRUPO 2: ALMACÉN VIRTUAL / CONTROL (NODO LÓGICO) */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-theme-subtle">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-black uppercase tracking-wider text-theme-main">
              Almacén Virtual / Control Lógico
            </h3>
          </div>
          <span className="text-xs text-theme-muted font-mono">Control Administrativo · Auditoría & Conciliación Demo</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {virtualWarehouses.map(wh => renderWarehouseCard(wh))}
        </div>
      </div>

 {/* ========================================================================= */}
 {/* MODAL COMPLETO DE DETALLE DEL NODO LOGÍSTICO (6 SUBTABS) */}
 {/* ========================================================================= */}
 {selectedWarehouse && (
 <ModalPortal onClose={() => setSelectedWarehouse(null)}>
 <div className="w-full max-w-5xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[95vh]">
 
 {/* Modal Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3.5">
 <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
 selectedWarehouse.type.includes('Sucursal') 
 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
 : 'bg-theme-primary/10 text-theme-primary border-theme-primary/20'
 }`}>
 {selectedWarehouse.type.includes('Sucursal') ? <Store className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <h2 className="text-base font-black text-theme-main">{selectedWarehouse.name}</h2>
 <span className="font-mono text-xs font-black text-theme-primary bg-theme-primary/10 px-2.5 py-0.5 rounded-lg border border-theme-primary/20">
 {selectedWarehouse.code}
 </span>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
 {selectedWarehouse.type}
 </span>
 </div>
 <p className="text-[11px] text-theme-muted mt-0.5 flex items-center gap-1">
 <MapPin className="w-3 h-3 text-theme-muted" />
 <span>{selectedWarehouse.address}</span>
 </p>
 </div>
 </div>

 <button
 onClick={() => setSelectedWarehouse(null)}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Navigation Tabs (6 Subtabs) */}
 <div className="px-6 border-b border-theme-subtle bg-theme-muted/20 flex items-center gap-1.5 overflow-x-auto text-xs py-2">
 <button
 onClick={() => setNodeDetailTab('summary')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'summary'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <Info className="w-3.5 h-3.5" />
 <span>1. Resumen</span>
 </button>

 <button
 onClick={() => setNodeDetailTab('layout')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'layout'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <LayoutGrid className="w-3.5 h-3.5" />
 <span>2. Layout</span>
 </button>

 <button
 onClick={() => setNodeDetailTab('locations')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'locations'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <Layers className="w-3.5 h-3.5" />
 <span>3. Ubicaciones ({currentWarehouseLocations.length})</span>
 </button>

 <button
 onClick={() => setNodeDetailTab('inventory')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'inventory'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <Boxes className="w-3.5 h-3.5" />
 <span>4. Inventario ({nodeStockMetrics.total} pzas)</span>
 </button>

 <button
 onClick={() => setNodeDetailTab('zones')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'zones'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <Truck className="w-3.5 h-3.5" />
 <span>5. Zonas Operativas ({selectedWarehouse.shippingLanes.length + selectedWarehouse.receptionAreas.length + selectedWarehouse.stagingAreas.length + 1})</span>
 </button>

 <button
 onClick={() => setNodeDetailTab('qrs')}
 className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
 nodeDetailTab === 'qrs'
 ? 'bg-theme-primary text-white shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/50'
 }`}
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>6. QRs Físicos</span>
 </button>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
 
 {/* ================================================================= */}
 {/* TAB 1: RESUMEN DEL NODO */}
 {/* ================================================================= */}
 {nodeDetailTab === 'summary' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* Primary KPIs Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Inventario Total</span>
 <strong className="text-xl font-black text-theme-primary font-mono block">
 {nodeStockMetrics.total} pzas
 </strong>
 <span className="text-[10px] text-theme-muted">Sustratos / Bobinas físicos</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-emerald-600 block">Disponibles</span>
 <strong className="text-xl font-black text-emerald-600 font-mono block">
 {nodeStockMetrics.available} pzas
 </strong>
 <span className="text-[10px] text-theme-muted">Listos para entrega</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-amber-600 block">Comprometidos</span>
 <strong className="text-xl font-black text-amber-600 font-mono block">
 {nodeStockMetrics.committed} pzas
 </strong>
 <span className="text-[10px] text-theme-muted">Apartados en pedido</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-blue-600 block">En Tránsito / Acomodo</span>
 <strong className="text-xl font-black text-blue-600 font-mono block">
 {nodeStockMetrics.inTransit} pzas
 </strong>
 <span className="text-[10px] text-theme-muted">Traspasos / staging</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-indigo-600 block">Ocupación Almacén</span>
 <strong className="text-xl font-black text-indigo-600 font-mono block">
 {selectedWarehouse.kpis.occupancyPercentage}%
 </strong>
 <span className="text-[10px] text-theme-muted">{selectedWarehouse.kpis.usedLocations} de {selectedWarehouse.kpis.totalLocations} racks</span>
 </div>

 {/* Showroom Metric for Retail Branches */}
 {selectedWarehouse.showroomBays && selectedWarehouse.showroomBays.length > 0 && (
 <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1 col-span-2 sm:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shadow-xs shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <span className="text-[10px] uppercase font-black text-purple-700 dark:text-purple-300 tracking-wider block">
 Showroom & Exhibición en Piso de Venta
 </span>
 <span className="text-xs text-theme-muted">
 Espacio para demostración directa a clientes en tienda
 </span>
 </div>
 </div>

 <div className="flex items-center gap-4 text-left sm:text-right">
 <div>
 <span className="text-[9px] uppercase font-bold text-theme-muted block">Bahías Totales</span>
 <strong className="text-sm font-black text-theme-main font-mono">{selectedWarehouse.showroomBays.length} bahías</strong>
 </div>
 <div className="border-l border-purple-500/20 pl-4">
 <span className="text-[9px] uppercase font-bold text-purple-700 block">En Exhibición</span>
 <strong className="text-sm font-black text-purple-700 font-mono">
 {selectedWarehouse.showroomBays.filter(b => b.status === 'Ocupada').length} unidades / bobinas
 </strong>
 </div>
 <div className="border-l border-purple-500/20 pl-4">
 <span className="text-[9px] uppercase font-bold text-emerald-600 block">Bahías Libres</span>
 <strong className="text-sm font-black text-emerald-600 font-mono">
 {selectedWarehouse.showroomBays.filter(b => b.status === 'Libre').length} espacios
 </strong>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Structural Overview */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-3">
 <h4 className="font-extrabold text-theme-main text-xs uppercase tracking-wider flex items-center gap-2">
 <Layers className="w-4 h-4 text-theme-primary" />
 Capacidad de Almacenamiento & Pasillos
 </h4>

 <div className="space-y-2 text-xs">
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Pasillos de Almacenaje:</span>
 <strong className="text-theme-main font-mono">{selectedWarehouse.aisles.length} pasillos ({selectedWarehouse.aisles.map(a => a.aisleCode).join(', ')})</strong>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Posiciones Rack:</span>
 <strong className="text-theme-main font-mono">{selectedWarehouse.kpis.totalLocations} posiciones</strong>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Niveles Físicos Verticales:</span>
 <strong className="text-theme-main font-mono">3 niveles por posición (C, B, A)</strong>
 </div>
 <div className="flex justify-between py-1.5">
 <span className="text-theme-muted">Ubicaciones Totales con QR:</span>
 <strong className="text-theme-primary font-mono">{currentWarehouseLocations.length} códigos generados</strong>
 </div>
 </div>
 </div>

 <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-3">
 <h4 className="font-extrabold text-theme-main text-xs uppercase tracking-wider flex items-center gap-2">
 <Truck className="w-4 h-4 text-blue-600" />
 Frente de Salida & Zonas Especiales
 </h4>

 <div className="space-y-2 text-xs">
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Carriles de Embarque / Entrega:</span>
 <strong className="text-blue-600 font-mono">{selectedWarehouse.shippingLanes.length} {selectedWarehouse.shippingLanes.length === 1 ? 'carril' : 'carriles'} ({selectedWarehouse.shippingLanes.map(l => l.code).join(', ')})</strong>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Áreas de Recepción:</span>
 <strong className="text-theme-main font-mono">{selectedWarehouse.receptionAreas.map(r => r.name).join(' & ')}</strong>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Áreas de Acomodo / Entrega:</span>
 <strong className="text-theme-main font-mono">{selectedWarehouse.stagingAreas.map(s => s.name).join(' & ')}</strong>
 </div>
 <div className="flex justify-between py-1.5">
 <span className="text-theme-muted">Zona de Calidad / Incidencias:</span>
 <strong className="text-amber-700 font-mono">{selectedWarehouse.reworkZone.name}</strong>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ================================================================= */}
 {/* TAB 2: LAYOUT FÍSICO INTERACTIVO */}
 {/* ================================================================= */}
 {nodeDetailTab === 'layout' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
 <div>
 <h4 className="font-extrabold text-theme-main text-xs uppercase tracking-wider flex items-center gap-2">
 <LayoutGrid className="w-4 h-4 text-theme-primary" />
 Plano Operativo de Racks & Pasillos
 </h4>
 <p className="text-[11px] text-theme-muted">
 Haz click sobre cualquier rack para inspeccionar sus 3 niveles físicos (C, B, A) y unidades almacenadas.
 </p>
 </div>
 </div>

 {/* Aisles & Positions Grid (Identical layout structure to MapTab) */}
 <div className="space-y-6">
 {selectedWarehouse.aisles.map((aisle) => (
 <div key={aisle.aisleCode} className="space-y-3 p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-theme-primary px-2.5 py-1 rounded-lg bg-theme-primary/10 border border-theme-primary/20">
 {aisle.aisleCode} &middot; {aisle.positions.length} Posiciones
 </span>
 <span className="text-[11px] font-mono text-theme-muted">
 {aisle.positions.reduce((acc, p) => acc + p.currentUnitsCount, 0)} unidades / bobinas almacenados
 </span>
 </div>

 <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
 {aisle.positions.map((pos) => {
 const isOccupied = pos.currentUnitsCount > 0;
 return (
 <button
 key={pos.positionId}
 onClick={() => setSelectedPosition(pos)}
 className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 hover:scale-102 hover:shadow-md ${
 isOccupied
 ? 'bg-theme-surface border-theme-subtle hover:border-theme-primary'
 : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50'
 }`}
 >
 <span className="font-mono text-xs font-black text-theme-main">
 {pos.positionId}
 </span>
 
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
 pos.currentUnitsCount === 0
 ? 'bg-emerald-500/15 text-emerald-700'
 : 'bg-theme-primary/10 text-theme-primary'
 }`}>
 {pos.currentUnitsCount === 0 ? 'Libre' : `${pos.currentUnitsCount} pzas`}
 </span>

 <div className="flex items-center gap-0.5 text-[8px] font-mono text-theme-muted">
 <span>C:{pos.levelsDistribution?.levelC || 0}</span>
 <span>B:{pos.levelsDistribution?.levelB || 0}</span>
 <span>A:{pos.levelsDistribution?.levelA || 0}</span>
 </div>
 </button>
 );
 })}
 </div>
 </div>
 ))}
 </div>

 {/* Showroom Section in Layout if Retail Branch */}
 {selectedWarehouse.showroomBays && selectedWarehouse.showroomBays.length > 0 && (
 <div className="pt-6 border-t border-theme-subtle space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-purple-600" />
 <h4 className="font-extrabold text-theme-main text-xs uppercase tracking-wider">
 Zona Showroom & Exhibición Retail (6 Bahías)
 </h4>
 </div>
 <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
 Piso de Venta en Tienda
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
 {selectedWarehouse.showroomBays.map((bay) => {
 const isOcc = bay.status === 'Ocupada' && !!bay.mattress;
 const m = bay.mattress;

 return (
 <div
 key={bay.code}
 onClick={() => setSelectedShowroomBay(bay)}
 className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-md hover:scale-[1.01] ${
 isOcc
 ? 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-theme-surface border-purple-500/30 hover:border-purple-500/60'
 : 'bg-theme-muted/30 border-dashed border-theme-subtle hover:border-emerald-500/50'
 }`}
 >
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/25">
 {bay.code}
 </span>
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
 isOcc
 ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
 : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
 }`}>
 {isOcc ? 'En exhibición' : 'Libre'}
 </span>
 </div>

 {isOcc && m ? (
 <div className="space-y-1 pt-0.5">
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-600 text-white shadow-2xs">
 {m.brand}
 </span>
 <span className="text-[10px] font-mono text-theme-muted">
 {m.size}
 </span>
 </div>
 <h5 className="text-xs font-black text-theme-main group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors leading-tight">
 {m.productName}
 </h5>
 <p className="text-[10px] font-mono text-theme-muted">{m.sku} &bull; {m.uid}</p>
 </div>
 ) : (
 <div className="py-2.5 text-center text-theme-muted space-y-0.5">
 <span className="text-xs font-bold block text-theme-muted">Bahía Libre</span>
 <span className="text-[10px]">Lista para montaje</span>
 </div>
 )}
 </div>

 <div className="flex items-center justify-between pt-2 border-t border-purple-500/15 text-[10px]">
 <span className="font-semibold text-purple-700 dark:text-purple-300 group-hover:underline flex items-center gap-1">
 <span>Ver detalle & QRs</span>
 <ArrowRight className="w-3 h-3" />
 </span>
 <span className="text-theme-muted font-mono">
 QR Bahía
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>
 )}

 {/* ================================================================= */}
 {/* TAB 3: UBICACIONES FÍSICAS DE ESTE NODO */}
 {/* ================================================================= */}
 {nodeDetailTab === 'locations' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 {/* Toolbar */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-muted/40 p-3 rounded-2xl border border-theme-subtle">
 <div className="relative w-full sm:w-80">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={locSearch}
 onChange={(e) => setLocSearch(e.target.value)}
 placeholder="Filtrar código de ubicación (ej. A-C-01)..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>

 <div className="flex items-center gap-2 w-full sm:w-auto">
 <select
 value={locTypeFilter}
 onChange={(e) => setLocTypeFilter(e.target.value)}
 className="bg-theme-surface border border-theme-subtle text-xs font-semibold text-theme-main py-1.5 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer w-full sm:w-auto"
 >
 <option value="all">Todos los tipos ({currentWarehouseLocations.length})</option>
 <option value="RACK">Racks</option>
 <option value="SUCURSAL">Racks Sucursal</option>
 <option value="SHOWROOM">Muestras / Exhibición Técnica</option>
 <option value="RECEPCION">Recepción</option>
 <option value="ACOMODO">Acomodo / Entrega</option>
 <option value="RETRABAJO">Retrabajo / Incidencias</option>
 <option value="EMBARQUE">Embarque / Despacho</option>
 </select>

 <button
 onClick={() => setIsBatchPrintOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Imprimir por columna</span>
 </button>
 </div>
 </div>

 {/* Locations Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-4">Código</th>
 <th className="py-2.5 px-4">Tipo</th>
 <th className="py-2.5 px-4">Espacio Físico / Descripción</th>
 <th className="py-2.5 px-3 text-center">Sustratos / Bobinas Actuales</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-4 text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredNodeLocations.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-8 text-center text-theme-muted text-xs">
 No se encontraron ubicaciones con ese filtro.
 </td>
 </tr>
 ) : (
 filteredNodeLocations.map((loc) => (
 <tr key={loc.code} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-2.5 px-4 font-mono font-black text-theme-primary whitespace-nowrap">
 {loc.code}
 </td>
 <td className="py-2.5 px-4 whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeBadge(loc.type)}`}>
 {loc.type}
 </span>
 </td>
 <td className="py-2.5 px-4 text-theme-main font-medium">
 {loc.name}
 </td>
 <td className="py-2.5 px-3 font-mono font-bold text-theme-main text-center whitespace-nowrap">
 {loc.currentUnits !== undefined ? `${loc.currentUnits} pzas` : '—'}
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
 Activa
 </span>
 </td>
 <td className="py-2.5 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => setSelectedLocationQr(loc)}
 className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3 h-3" />
 <span>Ver QR</span>
 </button>
 <button
 onClick={() => setSelectedPrintLocationQr(loc)}
 className="px-2 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3 h-3" />
 <span>Imprimir</span>
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ================================================================= */}
 {/* TAB 4: INVENTARIO SERIALIZADO DE ESTE NODO */}
 {/* ================================================================= */}
 {nodeDetailTab === 'inventory' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 {/* Toolbar */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-theme-muted/40 p-3 rounded-2xl border border-theme-subtle">
 <div className="relative w-full sm:w-80">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={invSearch}
 onChange={(e) => setInvSearch(e.target.value)}
 placeholder="Buscar por SKU, producto, UID o serie..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>

 <select
 value={invStatusFilter}
 onChange={(e) => setInvStatusFilter(e.target.value)}
 className="bg-theme-surface border border-theme-subtle text-xs font-semibold text-theme-main py-1.5 px-3 rounded-xl focus:outline-none focus:border-theme-primary cursor-pointer w-full sm:w-auto"
 >
 <option value="all">Todos los estados ({nodeInventoryItems.length})</option>
 <option value="Disponible">Disponible</option>
 <option value="Comprometido">Comprometido</option>
 <option value="En exhibición">En exhibición</option>
 <option value="En acomodo">En acomodo</option>
 <option value="En retrabajo">En retrabajo</option>
 <option value="En tránsito">En tránsito</option>
 </select>
 </div>

 {/* Stock Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-4">UID / Serie</th>
 <th className="py-2.5 px-4">SKU & Artículo</th>
 <th className="py-2.5 px-3">Marca / Medida</th>
 <th className="py-2.5 px-3">Ubicación Física</th>
 <th className="py-2.5 px-3">Lote</th>
 <th className="py-2.5 px-3">Estado</th>
 <th className="py-2.5 px-4 text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredNodeInventory.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-8 text-center text-theme-muted text-xs">
 No hay piezas registradas con ese criterio en este almacén.
 </td>
 </tr>
 ) : (
 filteredNodeInventory.slice(0, 50).map((item) => (
 <tr key={item.uid} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-2.5 px-4 font-mono font-bold text-theme-main whitespace-nowrap">
 {item.uid}
 </td>
 <td className="py-2.5 px-4">
 <div className="space-y-0.5">
 <span className="font-mono text-[10px] font-black text-theme-primary block">{item.sku}</span>
 <span className="text-theme-main font-semibold block">{item.productName}</span>
 </div>
 </td>
 <td className="py-2.5 px-3 text-theme-muted whitespace-nowrap">
 <span>{item.brand} &middot; {item.size}</span>
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <span className="font-mono text-xs font-black text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded border border-theme-primary/20">
 {item.location}
 </span>
 </td>
 <td className="py-2.5 px-3 font-mono text-theme-muted whitespace-nowrap">
 {item.lotNumber}
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white text-zinc-900 ${
 item.status === 'Disponible'
 ? 'border-emerald-600 '
 : item.status === 'En exhibición'
 ? 'border-purple-500'
 : 'border-amber-500'
 }`}>
 {item.status}
 </span>
 </td>
 <td className="py-2.5 px-4 text-right whitespace-nowrap">
 <button
 onClick={() => setSelectedQrUnit({
 uid: item.uid,
 sku: item.sku,
 productName: item.productName,
 brand: item.brand,
 size: item.size,
 levelCode: 'A',
 locationCode: item.location,
 lotNumber: item.lotNumber,
 entryDate: item.entryDate,
 ageDays: item.ageDays,
 status: item.status as any,
 classification: item.status === 'En exhibición' ? 'Exhibición Retail' : 'Línea Regular'
 })}
 className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer ml-auto"
 >
 <QrCode className="w-3 h-3" />
 <span>QR Unidad</span>
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

 {/* ================================================================= */}
 {/* TAB 5: ZONAS OPERATIVAS DETALLADAS */}
 {/* ================================================================= */}
 {nodeDetailTab === 'zones' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
 <h4 className="font-extrabold text-theme-main text-xs uppercase tracking-wider flex items-center gap-2">
 <Boxes className="w-4 h-4 text-theme-primary" />
 Zonas Operativas de Piso, Recibo & Despacho
 </h4>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {/* Showroom Retail Zone Card */}
 {selectedWarehouse.showroomBays && selectedWarehouse.showroomBays.length > 0 && (
 <div className="p-4.5 rounded-3xl bg-purple-500/10 border border-purple-500/30 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
 <Sparkles className="w-3.5 h-3.5" />
 Piso de Venta & Showroom
 </span>
 <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
 6 Bahías
 </span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">Showroom de Exhibición Retail</h5>
 <p className="text-[11px] text-theme-muted">
 {selectedWarehouse.showroomBays.filter(b => b.status === 'Ocupada').length} unidades / bobinas en exhibición activa &bull; {selectedWarehouse.showroomBays.filter(b => b.status === 'Libre').length} bahías disponibles para prueba de confort.
 </p>
 <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-purple-500/20">
 <button
 onClick={() => setNodeDetailTab('layout')}
 className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
 >
 <Store className="w-3.5 h-3.5" />
 <span>Ver en Plano</span>
 </button>
 </div>
 </div>
 )}

 {/* Recepción */}
 {selectedWarehouse.receptionAreas.map((rec) => (
 <div key={rec.code} className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Recepción & Descarga</span>
 <span className="font-mono text-xs font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
 {rec.code}
 </span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">{rec.name}</h5>
 <p className="text-[11px] text-theme-muted">
 Capacidad de rampa: <strong className="font-mono text-theme-main">{rec.capacity} unidades / bobinas</strong> &bull; Estado: <span className="text-emerald-600 font-semibold">{rec.status}</span>
 </p>
 <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setSelectedLocationQr({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>Ver QR</span>
 </button>
 <button
 onClick={() => setSelectedPrintLocationQr({
 code: rec.code,
 name: rec.name,
 type: 'RECEPCION',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: rec.capacity,
 currentUnits: rec.currentUnits,
 status: rec.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>
 ))}

 {/* Staging / Acomodo / Entrega */}
 {selectedWarehouse.stagingAreas.map((stg) => (
 <div key={stg.code} className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Acomodo / Entrega</span>
 <span className="font-mono text-xs font-bold text-zinc-900 px-2 py-0.5 rounded-full bg-white border border-blue-500 shadow-2xs">
 {stg.code}
 </span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">{stg.name}</h5>
 <p className="text-[11px] text-theme-muted">
 Capacidad: <strong className="font-mono text-theme-main">{stg.capacity} unidades / bobinas</strong> &bull; Estado: <span className="text-blue-600 font-semibold">{stg.status}</span>
 </p>
 <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setSelectedLocationQr({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>Ver QR</span>
 </button>
 <button
 onClick={() => setSelectedPrintLocationQr({
 code: stg.code,
 name: stg.name,
 type: 'ACOMODO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: stg.capacity,
 currentUnits: stg.currentUnits,
 status: stg.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>
 ))}

 {/* Incidencias / Retrabajo */}
 {selectedWarehouse.reworkZone && (
 <div className="p-4.5 rounded-3xl bg-white border border-amber-500 shadow-2xs space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
 <ShieldAlert className="w-3 h-3" />
 Incidencias & Calidad
 </span>
 <span className="font-mono text-xs font-bold text-zinc-900 px-2 py-0.5 rounded-full bg-white border border-amber-500 shadow-2xs">
 {selectedWarehouse.reworkZone.code}
 </span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">{selectedWarehouse.reworkZone.name}</h5>
 <p className="text-[11px] text-theme-muted">
 Capacidad de aislamiento: <strong className="font-mono text-zinc-900">{selectedWarehouse.reworkZone.capacity} piezas</strong>
 </p>
 <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setSelectedLocationQr({
 code: selectedWarehouse.reworkZone.code,
 name: selectedWarehouse.reworkZone.name,
 type: 'RETRABAJO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: selectedWarehouse.reworkZone.capacity,
 currentUnits: selectedWarehouse.reworkZone.currentUnits,
 status: selectedWarehouse.reworkZone.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 text-xs font-bold border border-amber-500 shadow-2xs flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3.5 h-3.5 text-amber-600" />
 <span>Ver QR</span>
 </button>
 <button
 onClick={() => setSelectedPrintLocationQr({
 code: selectedWarehouse.reworkZone.code,
 name: selectedWarehouse.reworkZone.name,
 type: 'RETRABAJO',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: selectedWarehouse.reworkZone.capacity,
 currentUnits: selectedWarehouse.reworkZone.currentUnits,
 status: selectedWarehouse.reworkZone.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>
 )}

 {/* Carriles de Embarque / Entrega */}
 {selectedWarehouse.shippingLanes.map((lane) => (
 <div key={lane.code} className="p-4.5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold text-theme-muted">
 {selectedWarehouse.type.includes('Sucursal') ? 'Carril de Entrega Local' : 'Carril de Embarque'}
 </span>
 <span className="font-mono text-xs font-bold text-zinc-900 px-2 py-0.5 rounded-full bg-white border border-blue-500 shadow-2xs">
 {lane.code}
 </span>
 </div>
 <h5 className="text-xs font-bold text-theme-main">{lane.name}</h5>
 <p className="text-[11px] text-theme-muted">
 {lane.status}
 </p>
 <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setSelectedLocationQr({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3.5 h-3.5" />
 <span>Ver QR</span>
 </button>
 <button
 onClick={() => setSelectedPrintLocationQr({
 code: lane.code,
 name: lane.name,
 type: 'EMBARQUE',
 warehouseName: selectedWarehouse.name,
 warehouseCode: selectedWarehouse.code,
 capacity: lane.capacity,
 currentUnits: lane.currentUnits,
 status: lane.status,
 })}
 className="px-2.5 py-1 rounded-xl bg-theme-surface hover:bg-theme-muted text-theme-main text-xs font-semibold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3.5 h-3.5" />
 <span>Etiqueta</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ================================================================= */}
 {/* TAB 6: CATÁLOGO DE QRs FÍSICOS DE ESTE NODO */}
 {/* ================================================================= */}
 {nodeDetailTab === 'qrs' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-4.5 rounded-3xl bg-purple-500/10 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-950 dark:text-purple-300">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shrink-0 shadow-xs">
 <QrCode className="w-5 h-5" />
 </div>
 <div>
 <strong className="text-sm font-extrabold block text-theme-main">
 Catálogo de QRs Físicos ({selectedWarehouse.name})
 </strong>
 <p className="text-[11px] text-theme-muted">
 Señalización física para escaneo óptico / RF: Racks, niveles, showroom y zonas operativas.
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setIsBatchPrintOpen(true)}
 className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
 >
 <Printer className="w-4 h-4" />
 <span>Imprimir por columna</span>
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
 {currentWarehouseLocations.map((loc) => (
 <div
 key={loc.code}
 className="p-3.5 rounded-2xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/50 transition-all space-y-2 flex flex-col justify-between"
 >
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-theme-primary">
 {loc.code}
 </span>
 <span className={`px-2 py-0.2 rounded text-[9px] font-bold border ${getTypeBadge(loc.type)}`}>
 {loc.type}
 </span>
 </div>
 <p className="text-[11px] font-bold text-theme-main line-clamp-1">
 {loc.name}
 </p>
 </div>

 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle text-[10px]">
 <button
 onClick={() => setSelectedLocationQr(loc)}
 className="text-purple-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
 >
 <QrCode className="w-3 h-3" />
 <span>Ver QR</span>
 </button>

 <button
 onClick={() => setSelectedPrintLocationQr(loc)}
 className="text-theme-muted hover:text-theme-main font-semibold flex items-center gap-1 cursor-pointer"
 >
 <Printer className="w-3 h-3" />
 <span>Imprimir</span>
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Modal Footer */}
 <div className="px-6 py-3 border-t border-theme-subtle flex justify-end bg-theme-muted/30">
 <button
 onClick={() => setSelectedWarehouse(null)}
 className="px-5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Sub-modals for drilling down from the warehouse detail view */}
 <PositionDetailModal
 position={selectedPosition}
 warehouseName={selectedWarehouse?.name || 'Impresos RTM'}
 onClose={() => setSelectedPosition(null)}
 onOpenUnitDetail={(unit) => setSelectedUnitDetail(unit)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 <UnitDetailModal
 unit={selectedUnitDetail}
 warehouseName={selectedWarehouse?.name || 'Impresos RTM'}
 onClose={() => setSelectedUnitDetail(null)}
 onOpenQr={(unit) => setSelectedQrUnit(unit)}
 onPrintQr={(unit) => setSelectedPrintUnit(unit)}
 />

 <QrModal
 unit={selectedQrUnit}
 warehouseName={selectedWarehouse?.name || 'Impresos RTM'}
 onClose={() => setSelectedQrUnit(null)}
 onPrint={(unit) => setSelectedPrintUnit(unit)}
 />

 <PrintQrModal
 unit={selectedPrintUnit}
 warehouseName={selectedWarehouse?.name || 'Impresos RTM'}
 onClose={() => setSelectedPrintUnit(null)}
 />

 <LocationQrModal
 location={selectedLocationQr}
 onClose={() => setSelectedLocationQr(null)}
 onPrint={(loc) => setSelectedPrintLocationQr(loc)}
 />

 <PrintLocationQrModal
 location={selectedPrintLocationQr}
 onClose={() => setSelectedPrintLocationQr(null)}
 />

 {/* Showroom Bay Modal */}
 <ShowroomBayModal
 bay={selectedShowroomBay}
 warehouseName={selectedWarehouse?.name || 'Impresos RTM'}
 warehouseCode={selectedWarehouse?.code || 'SUC'}
 onClose={() => setSelectedShowroomBay(null)}
 />

 {/* Location Batch & Column Print Modal */}
 <LocationBatchPrintModal
 isOpen={isBatchPrintOpen}
 onClose={() => setIsBatchPrintOpen(false)}
 initialWarehouseId={selectedWarehouse?.id || 'wh-mty-norte'}
 />
 </div>
 );
};
