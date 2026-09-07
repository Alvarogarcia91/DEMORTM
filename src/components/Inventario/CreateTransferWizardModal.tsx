import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
 X, 
 ArrowLeftRight, 
 Search, 
 Building2, 
 Truck, 
 Calendar, 
 CheckCircle2, 
 QrCode, 
 Sparkles, 
 ChevronRight, 
 ChevronLeft,
 Boxes,
 Clock,
 AlertCircle,
 Tag,
 Store,
 Layers,
 Plus,
 Trash2,
 PackageCheck,
 Check,
 Info,
 ShieldCheck,
 ArrowRight,
 Compass,
 TrendingDown,
 RotateCcw,
 SlidersHorizontal,
 MapPin,
 AlertTriangle
} from 'lucide-react';
import { 
 MOCK_WAREHOUSES_LIST, 
 MOCK_STOCK_ITEMS, 
 InventoryTransferOrder, 
 StockItemRecord 
} from '../../data/mockInventoryData';
import { 
 PickingStrategyType, 
 STRATEGY_COMPARISONS, 
 ORDERED_PICKING_STRATEGIES, 
 calculateUnitsForStrategy 
} from '../../data/mockPickingData';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../data/mockArticlesData';
import { ModalPortal } from '../common/ModalPortal';

export interface TransferDraftItem {
 id: string;
 sku: string;
 name: string;
 brand: string;
 category: string;
 size: string;
 quantity: number;
 serialization: 'Por unidad' | 'No serializado';
 availableInSource: number;
 serials: string[];
}

interface SuccessOrderData {
 transferFolio: string;
 collectionFolio: string;
 order: InventoryTransferOrder;
}

interface CreateTransferWizardModalProps {
 isOpen: boolean;
 onClose: () => void;
 onCreated: (order: InventoryTransferOrder) => void;
 onNavigateToCollection?: (collectionFolio: string) => void;
 prefillData?: {
 sourceId: string;
 destinationId: string;
 sku: string;
 quantity: number;
 } | null;
}

const getReadableStrategyReason = (strategyKey: string, u: StockItemRecord, isFreedLocation?: boolean) => {
 switch (strategyKey) {
 case 'FIFO':
 return {
 badge: 'FIFO',
 text: 'Unidad más antigua disponible'
 };
 case 'FEFO':
 return {
 badge: 'FEFO',
 text: 'Vigencia prioritaria'
 };
 case 'SHORTEST_PATH':
 return {
 badge: 'Menor recorrido',
 text: 'Cercana a la siguiente parada'
 };
 case 'EMPTY_LOCATION':
 return {
 badge: 'Vaciar ubicación',
 text: isFreedLocation ? `Completa la salida de ${u.location}` : `Completa lote en ${u.location}`
 };
 case 'SHOWROOM_PRIORITY':
 return {
 badge: 'Showroom',
 text: 'Prioridad de rotación en piso'
 };
 case 'MANUAL':
 return {
 badge: 'Manual',
 text: 'Selección manual'
 };
 case 'RECOMMENDED':
 case 'SUGGESTED':
 default:
 return {
 badge: 'Recomendada',
 text: `Unidad antigua y cercana al recorrido`
 };
 }
};

export const CreateTransferWizardModal: React.FC<CreateTransferWizardModalProps> = ({
 isOpen,
 onClose,
 onCreated,
 onNavigateToCollection,
 prefillData,
}) => {
 // 6-step wizard:
 // 1: Ruta, 2: Artículos, 3: Estrategia, 4: Unidades, 5: Transporte, 6: Resumen
 const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

 // Success State after order creation
 const [createdSuccessData, setCreatedSuccessData] = useState<SuccessOrderData | null>(null);

 // Step 1: Origin & Destination
 const [sourceWarehouseId, setSourceWarehouseId] = useState(prefillData?.sourceId || 'wh-mty-norte');
 const [destinationWarehouseId, setDestinationWarehouseId] = useState(prefillData?.destinationId || 'wh-suc-valle-oriente');

 // Step 1: Search, Selected Article / Unit & Origin Suggestion
 const [step1SearchQuery, setStep1SearchQuery] = useState('');
 const [isStep1SearchOpen, setIsStep1SearchOpen] = useState(false);
 const step1SearchContainerRef = useRef<HTMLDivElement>(null);

 const [selectedInitialArticle, setSelectedInitialArticle] = useState<MasterArticle | null>(() => {
 if (prefillData) {
 return MOCK_MASTER_ARTICLES.find(a => a.sku === prefillData.sku) || MOCK_MASTER_ARTICLES[0];
 }
 return MOCK_MASTER_ARTICLES[0];
 });
 const [selectedSpecificUnit, setSelectedSpecificUnit] = useState<StockItemRecord | null>(null);
 const [suggestedOrigin, setSuggestedOrigin] = useState<{
 warehouseId: string;
 warehouseName: string;
 reason: string;
 availableCount: number;
 } | null>(() => {
 return {
 warehouseId: 'wh-mty-norte',
 warehouseName: 'CEDIS Monterrey Norte',
 reason: 'Es la ubicación con mayor disponibilidad para este artículo.',
 availableCount: 24,
 };
 });

 // Step 2: Search, Autocomplete & Multiple Items
 const [searchQuery, setSearchQuery] = useState('');
 const [isSearchOpen, setIsSearchOpen] = useState(false);
 const searchContainerRef = useRef<HTMLDivElement>(null);

 const [activeArticleToConfigure, setActiveArticleToConfigure] = useState<MasterArticle | null>(null);
 const [activeItemQuantity, setActiveItemQuantity] = useState<number>(5);

 // Multiple Items List
 const [transferItems, setTransferItems] = useState<TransferDraftItem[]>([]);

 // Step 3: Surtido Strategy
 const [selectedStrategy, setSelectedStrategy] = useState<PickingStrategyType>('RECOMMENDED');

 // Unit Swap Modal state
 const [swappingTarget, setSwappingTarget] = useState<{
 itemId: string;
 currentUid: string;
 } | null>(null);

 // Step 5: Transportation
 const [plannedDate, setPlannedDate] = useState('28 Ago 2026');
 const [driver, setDriver] = useState('Roberto Garza (Unidad #08)');
 const [truckPlates, setTruckPlates] = useState('NL-8842-A');
 const [notes, setNotes] = useState('Entrega programada para resurtido semanal.');

 // Initialize transfer items on open or prefillData change
 useEffect(() => {
 if (isOpen) {
 setCreatedSuccessData(null);
 setStep(1);
 if (prefillData) {
 setSourceWarehouseId(prefillData.sourceId);
 setDestinationWarehouseId(prefillData.destinationId);
 
 const art = MOCK_MASTER_ARTICLES.find(a => a.sku === prefillData.sku) || MOCK_MASTER_ARTICLES[0];
 const avail = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === prefillData.sourceId && u.sku === art.sku && u.status === 'Disponible'
 ).length;

 const initialItem: TransferDraftItem = {
 id: `item-${Date.now()}-0`,
 sku: art.sku,
 name: art.name,
 brand: art.brand,
 category: art.category,
 size: art.size,
 quantity: prefillData.quantity || 5,
 serialization: art.serialization,
 availableInSource: avail,
 serials: [],
 };
 setTransferItems([initialItem]);
 setSelectedInitialArticle(art);
 setActiveArticleToConfigure(art);
 setActiveItemQuantity(prefillData.quantity || 5);
 } else {
 const defaultArt = MOCK_MASTER_ARTICLES[0];
 const avail = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === (sourceWarehouseId || 'wh-mty-norte') && u.sku === defaultArt.sku && u.status === 'Disponible'
 ).length;

 const initialItem: TransferDraftItem = {
 id: `item-${Date.now()}-0`,
 sku: defaultArt.sku,
 name: defaultArt.name,
 brand: defaultArt.brand,
 category: defaultArt.category,
 size: defaultArt.size,
 quantity: 5,
 serialization: defaultArt.serialization,
 availableInSource: avail,
 serials: [],
 };
 setTransferItems([initialItem]);
 setSelectedInitialArticle(defaultArt);
 setActiveArticleToConfigure(defaultArt);
 setActiveItemQuantity(5);
 }
 }
 }, [isOpen, prefillData]);

 // Click outside listener for search autocomplete
 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
 setIsSearchOpen(false);
 }
 if (step1SearchContainerRef.current && !step1SearchContainerRef.current.contains(event.target as Node)) {
 setIsStep1SearchOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 // Helper to auto-calculate preassigned serials based on strategy
 const calculateSerialsForStrategy = (items: TransferDraftItem[], strategy: PickingStrategyType) => {
 return items.map((item) => {
 if (item.serialization !== 'Por unidad') {
 return item;
 }

 const calculated = calculateUnitsForStrategy(
 sourceWarehouseId,
 item.sku,
 item.quantity,
 strategy,
 MOCK_STOCK_ITEMS
 );

 return {
 ...item,
 serials: calculated.map(u => u.uid),
 };
 });
 };

 // Step 1: Autocomplete matching articles
 const step1MatchingArticles = useMemo(() => {
 const q = step1SearchQuery.toLowerCase().trim();
 if (!q) return MOCK_MASTER_ARTICLES.slice(0, 5);

 return MOCK_MASTER_ARTICLES.filter(art => {
 const matchSku = art.sku.toLowerCase().includes(q);
 const matchName = art.name.toLowerCase().includes(q);
 const matchBrand = art.brand.toLowerCase().includes(q);
 const matchCategory = art.category.toLowerCase().includes(q);
 const matchSize = art.size.toLowerCase().includes(q);
 const matchDesc = (art.descriptions?.commercial || '').toLowerCase().includes(q);
 return matchSku || matchName || matchBrand || matchCategory || matchSize || matchDesc;
 });
 }, [step1SearchQuery]);

 // Step 1: Autocomplete matching serialized units
 const step1MatchingUnits = useMemo(() => {
 const q = step1SearchQuery.toLowerCase().trim();
 if (!q || q.length < 2) return [];

 return MOCK_STOCK_ITEMS.filter(u => {
 return (
 u.uid.toLowerCase().includes(q) ||
 u.sku.toLowerCase().includes(q) ||
 u.lotNumber.toLowerCase().includes(q) ||
 u.productName.toLowerCase().includes(q)
 );
 }).slice(0, 6);
 }, [step1SearchQuery]);

 // Step 1: Handle Selecting an Article
 const handleSelectArticleInStep1 = (art: MasterArticle) => {
 setSelectedInitialArticle(art);
 setSelectedSpecificUnit(null);
 setStep1SearchQuery('');
 setIsStep1SearchOpen(false);

 const availList = MOCK_WAREHOUSES_LIST.map(wh => {
 const count = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === wh.id && u.sku === art.sku && u.status === 'Disponible'
 ).length;
 return { warehouse: wh, count };
 });

 const best = [...availList].sort((a, b) => b.count - a.count)[0];
 if (best && best.count > 0) {
 setSourceWarehouseId(best.warehouse.id);
 setSuggestedOrigin({
 warehouseId: best.warehouse.id,
 warehouseName: best.warehouse.name,
 reason: 'Es la ubicación con mayor disponibilidad para este artículo.',
 availableCount: best.count,
 });
 }

 const chosenWarehouseId = best?.warehouse.id || sourceWarehouseId;
 const availInChosen = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === chosenWarehouseId && u.sku === art.sku && u.status === 'Disponible'
 ).length;

 const initialItem: TransferDraftItem = {
 id: `item-${Date.now()}-0`,
 sku: art.sku,
 name: art.name,
 brand: art.brand,
 category: art.category,
 size: art.size,
 quantity: Math.min(5, Math.max(1, availInChosen)),
 serialization: art.serialization,
 availableInSource: availInChosen,
 serials: [],
 };
 setTransferItems([initialItem]);
 setActiveArticleToConfigure(art);
 setActiveItemQuantity(Math.min(5, Math.max(1, availInChosen)));
 };

 // Step 1: Handle Selecting a Specific Unit
 const handleSelectUnitInStep1 = (unit: StockItemRecord) => {
 const matchingArt: MasterArticle = 
 MOCK_MASTER_ARTICLES.find(a => a.sku === unit.sku) || MOCK_MASTER_ARTICLES[0];

 setSelectedInitialArticle(matchingArt);
 setSelectedSpecificUnit(unit);
 setSourceWarehouseId(unit.warehouseId);
 setSuggestedOrigin(null);
 setStep1SearchQuery('');
 setIsStep1SearchOpen(false);

 const initialItem: TransferDraftItem = {
 id: `item-${Date.now()}-0`,
 sku: matchingArt.sku,
 name: matchingArt.name,
 brand: matchingArt.brand,
 category: matchingArt.category,
 size: matchingArt.size,
 quantity: 1,
 serialization: matchingArt.serialization,
 availableInSource: 1,
 serials: [unit.uid],
 };
 setTransferItems([initialItem]);
 setActiveArticleToConfigure(matchingArt);
 setActiveItemQuantity(1);
 };

 // Step 2: Matching articles for additional items
 const matchingArticles = useMemo(() => {
 const q = searchQuery.toLowerCase().trim();
 if (!q) return MOCK_MASTER_ARTICLES.slice(0, 6);

 return MOCK_MASTER_ARTICLES.filter(art => {
 const matchSku = art.sku.toLowerCase().includes(q);
 const matchName = art.name.toLowerCase().includes(q);
 const matchBrand = art.brand.toLowerCase().includes(q);
 const matchCategory = art.category.toLowerCase().includes(q);
 return matchSku || matchName || matchBrand || matchCategory;
 });
 }, [searchQuery]);

 const handleSelectArticleFromSearch = (art: MasterArticle) => {
 setActiveArticleToConfigure(art);
 const availableCount = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === art.sku && u.status === 'Disponible'
 ).length;
 setActiveItemQuantity(Math.min(5, Math.max(1, availableCount)));
 setIsSearchOpen(false);
 setSearchQuery('');
 };

 const handleAddActiveItemToDraft = () => {
 if (!activeArticleToConfigure) return;

 const availableCount = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === activeArticleToConfigure.sku && u.status === 'Disponible'
 ).length;

 const existingIndex = transferItems.findIndex(i => i.sku === activeArticleToConfigure.sku);

 if (existingIndex >= 0) {
 setTransferItems(prev => prev.map((item, idx) => {
 if (idx === existingIndex) {
 return {
 ...item,
 quantity: item.quantity + activeItemQuantity,
 };
 }
 return item;
 }));
 } else {
 const newItem: TransferDraftItem = {
 id: `item-${Date.now()}-${transferItems.length}`,
 sku: activeArticleToConfigure.sku,
 name: activeArticleToConfigure.name,
 brand: activeArticleToConfigure.brand,
 category: activeArticleToConfigure.category,
 size: activeArticleToConfigure.size,
 quantity: activeItemQuantity,
 serialization: activeArticleToConfigure.serialization,
 availableInSource: availableCount,
 serials: [],
 };
 setTransferItems(prev => [...prev, newItem]);
 }

 setActiveArticleToConfigure(null);
 };

 const handleRemoveDraftItem = (id: string) => {
 setTransferItems(prev => prev.filter(i => i.id !== id));
 };

 const handleUpdateItemQuantity = (id: string, newQty: number) => {
 setTransferItems(prev => prev.map(item => {
 if (item.id === id) {
 return {
 ...item,
 quantity: Math.max(1, newQty),
 serials: item.serials.slice(0, newQty),
 };
 }
 return item;
 }));
 };

 // Step 3 -> 4 Apply Strategy to assign serials
 const handleApplyStrategy = (newStrategy: PickingStrategyType) => {
 setSelectedStrategy(newStrategy);
 const updated = calculateSerialsForStrategy(transferItems, newStrategy);
 setTransferItems(updated);
 };

 const handleToggleSerialForItem = (itemId: string, serial: string) => {
 setTransferItems(prev => prev.map(item => {
 if (item.id === itemId) {
 const hasSerial = item.serials.includes(serial);
 let newSerials: string[];
 if (hasSerial) {
 newSerials = item.serials.filter(s => s !== serial);
 } else {
 if (item.serials.length < item.quantity) {
 newSerials = [...item.serials, serial];
 } else {
 newSerials = item.serials;
 }
 }
 return { ...item, serials: newSerials };
 }
 return item;
 }));
 };

 const handleSwapUnit = (itemId: string, oldUid: string, newUid: string) => {
 setTransferItems(prev => prev.map(item => {
 if (item.id === itemId) {
 const newSerials = item.serials.map(s => (s === oldUid ? newUid : s));
 return { ...item, serials: newSerials };
 }
 return item;
 }));
 setSwappingTarget(null);
 };

 // Node details
 const sourceNode = MOCK_WAREHOUSES_LIST.find(w => w.id === sourceWarehouseId) || MOCK_WAREHOUSES_LIST[0];
 const destinationNode = MOCK_WAREHOUSES_LIST.find(w => w.id === destinationWarehouseId) || MOCK_WAREHOUSES_LIST[1];
 const totalUnits = transferItems.reduce((acc, i) => acc + i.quantity, 0);

 const transferType = 
 sourceNode.type === 'CEDIS' && destinationNode.type === 'CEDIS'
 ? 'CEDIS a CEDIS'
 : sourceNode.type === 'CEDIS' && destinationNode.type === 'SUCURSAL'
 ? 'CEDIS a Sucursal'
 : sourceNode.type === 'SUCURSAL' && destinationNode.type === 'CEDIS'
 ? 'Sucursal a CEDIS'
 : 'Sucursal a Sucursal';

 // Compute preassigned UIDs & estimated picking route
 const allPreassignedUids = useMemo(() => {
 const list: string[] = [];
 transferItems.forEach(i => i.serials.forEach(s => list.push(s)));
 return list;
 }, [transferItems]);

 const estimatedRouteLocations = useMemo(() => {
 const locations = new Set<string>();
 allPreassignedUids.forEach(uid => {
 const u = MOCK_STOCK_ITEMS.find(item => item.uid === uid);
 if (u) locations.add(u.location);
 });
 return Array.from(locations).sort();
 }, [allPreassignedUids]);

 // Final Action: Generar orden de recolección
 const handleConfirmAndSendToCollection = () => {
 const newFolioNum = Math.floor(46 + Math.random() * 50);
 const transferFolio = `OTP-2026-00${newFolioNum}`;
 const collectionFolio = `OR-2026-01${newFolioNum}`;

 const newOrder: InventoryTransferOrder = {
 id: `trf-${Date.now()}`,
 folio: transferFolio,
 collectionFolio: collectionFolio,
 sourceWarehouseId,
 sourceWarehouseName: sourceNode.name,
 destinationWarehouseId,
 destinationWarehouseName: destinationNode.name,
 totalUnits,
 receivedUnits: 0,
 receivedSerials: [],
 status: 'Preparando',
 plannedDate,
 driver,
 truckPlates,
 items: transferItems.map(item => ({
 sku: item.sku,
 productName: item.name,
 quantity: item.quantity,
 serials: item.serials,
 receivedSerials: [],
 })),
 };

 setCreatedSuccessData({
 transferFolio,
 collectionFolio,
 order: newOrder,
 });
 };

 if (!isOpen) return null;

 // =========================================================================
 // RENDER: SUCCESS MODAL
 // =========================================================================
 if (createdSuccessData) {
 return (
 <ModalPortal onClose={() => {
 onCreated(createdSuccessData.order);
 onClose();
 }}>
 <div className="w-full max-w-xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-2xl bg-white text-emerald-600 flex items-center justify-center border border-emerald-600 shadow-2xs">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <div>
 <h2 className="text-sm font-extrabold text-theme-main">
 Orden Registrada con Éxito
 </h2>
 <span className="text-[10px] text-theme-muted font-mono">
 {createdSuccessData.transferFolio} &bull; {transferType}
 </span>
 </div>
 </div>

 <button
 onClick={() => {
 onCreated(createdSuccessData.order);
 onClose();
 }}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Body with Summary */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 <div className="text-center space-y-1">
 <h3 className="text-base font-black text-theme-main">
 ¡Orden de Traspaso y Plan de Recolección Generados!
 </h3>
 <p className="text-xs text-theme-muted max-w-sm mx-auto">
 La orden de movimiento ha sido emitida y enviada a la cola operativa de surtido de <strong>{sourceNode.name}</strong>.
 </p>
 </div>

 {/* Highlights Cards: Traspaso + Recolección */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
 
 {/* Card 1: Orden de Traspaso */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[9px] uppercase font-bold text-theme-muted">Orden de Traspaso</span>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 Preparando
 </span>
 </div>
 <strong className="font-mono text-base font-black text-theme-primary block">
 {createdSuccessData.transferFolio}
 </strong>
 <div className="text-[10px] text-theme-muted space-y-0.5 pt-1 border-t border-theme-subtle">
 <div>Ruta: <span className="font-bold text-theme-main">{sourceNode.name} &rarr; {destinationNode.name}</span></div>
 <div>Volumen: <span className="font-mono font-bold text-theme-main">{totalUnits} unidades</span> en {transferItems.length} artículos</div>
 </div>
 </div>

 {/* Card 2: Orden de Recolección */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[9px] uppercase font-bold text-theme-muted">Orden de Recolección</span>
 <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 Planeada ({STRATEGY_COMPARISONS[selectedStrategy]?.label})
 </span>
 </div>
 <strong className="font-mono text-base font-black text-purple-700 dark:text-purple-300 block">
 {createdSuccessData.collectionFolio}
 </strong>
 <div className="text-[10px] text-theme-muted space-y-0.5 pt-1 border-t border-theme-subtle">
 <div>Estrategia: <span className="font-bold text-theme-main">{STRATEGY_COMPARISONS[selectedStrategy]?.label}</span></div>
 <div>Paradas estimadas: <span className="font-mono font-bold text-theme-main">{estimatedRouteLocations.length} posiciones</span></div>
 </div>
 </div>
 </div>

 {/* Metodología & Responsabilidad Explicativa */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1.5 shadow-xs">
 <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs">
 <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
 <span>Estrategia aplicada: {STRATEGY_COMPARISONS[selectedStrategy]?.label}</span>
 </div>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 Las unidades preasignadas serán validadas físicamente mediante escaneo QR en el módulo de <strong>Mesa de Verificación &gt; Recolección</strong> antes de su embalaje y salida hacia <strong>{destinationNode.name}</strong>.
 </p>
 </div>

 {/* Item summary pill list */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Artículos incluidos en el traspaso ({transferItems.length}):
 </span>
 <div className="space-y-1 text-xs">
 {transferItems.map((item, idx) => (
 <div key={item.id} className="flex items-center justify-between text-[11px]">
 <span className="font-medium text-theme-main truncate max-w-[260px]">
 {idx + 1}. {item.name}
 </span>
 <span className="font-mono font-bold text-theme-primary">
 {item.quantity} unidades ({item.serials.length} UIDs)
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/30 flex items-center justify-between text-xs">
 <button
 onClick={() => {
 onCreated(createdSuccessData.order);
 onClose();
 }}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Ver orden de traspaso
 </button>

 <button
 onClick={() => {
 onCreated(createdSuccessData.order);
 if (onNavigateToCollection) {
 onNavigateToCollection(createdSuccessData.collectionFolio);
 }
 onClose();
 }}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <span>Ir a Recolección</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </ModalPortal>
 );
 }

 // =========================================================================
 // RENDER: WIZARD STEPS
 // =========================================================================
 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <ArrowLeftRight className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
 Asistente de Traspaso &middot; Paso {step} de 6
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {transferType}
 </span>
 </div>
 <h2 className="text-sm font-extrabold text-theme-main mt-0.5">
 Nueva Orden de Traspaso Logístico
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

 {/* Wizard Steps Bar (6 Steps) */}
 <div className="px-6 py-2.5 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between text-[11px] font-bold overflow-x-auto gap-2">
 {[
 '1. Ruta', 
 '2. Artículos', 
 '3. Estrategia', 
 '4. Unidades', 
 '5. Transporte', 
 '6. Resumen'
 ].map((label, idx) => {
 const stepNum = idx + 1;
 const isActive = step === stepNum;
 const isPassed = step > stepNum;

 return (
 <div
 key={label}
 className={`flex items-center gap-1.5 whitespace-nowrap ${
 isActive ? 'text-theme-primary font-black' : isPassed ? 'text-emerald-600' : 'text-theme-muted'
 }`}
 >
 <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
 isActive ? 'bg-theme-primary text-white' : isPassed ? 'bg-emerald-500 text-white' : 'bg-theme-muted text-theme-muted'
 }`}>
 {stepNum}
 </div>
 <span>{label}</span>
 </div>
 );
 })}
 </div>

 {/* Body Content */}
 <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
 
 {/* ========================================================================= */}
 {/* PASO 1: RUTA */}
 {/* ========================================================================= */}
 {step === 1 && (
 <div className="space-y-4">
 
 {/* Helper */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Definición de Ruta & Artículo</span>
 <p className="text-xs text-theme-main font-semibold">
 Busca el artículo que deseas transferir y selecciona el almacén o sucursal de origen y destino.
 </p>
 </div>

 {/* 1. ¿Qué quieres transferir? Buscador con Autocomplete */}
 <div className="space-y-1.5" ref={step1SearchContainerRef}>
 <label className="text-[11px] font-bold text-theme-muted uppercase flex items-center justify-between">
 <span className="flex items-center gap-1.5 text-theme-main font-extrabold">
 <Search className="w-3.5 h-3.5 text-theme-primary" />
 <span>¿Qué quieres transferir?</span>
 </span>
 <span className="text-[10px] font-normal text-theme-muted">
 Búsqueda por SKU, nombre, marca o UID
 </span>
 </label>

 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={step1SearchQuery}
 onFocus={() => setIsStep1SearchOpen(true)}
 onChange={(e) => {
 setStep1SearchQuery(e.target.value);
 setIsStep1SearchOpen(true);
 }}
 placeholder="Buscar artículo, SKU, UID/Serie o marca..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-9 pr-8 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 {step1SearchQuery && (
 <button
 type="button"
 onClick={() => setStep1SearchQuery('')}
 className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 )}

 {/* Autocomplete Dropdown */}
 {isStep1SearchOpen && (
 <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle max-h-72 overflow-y-auto z-50 divide-y divide-theme-subtle">
 {step1MatchingArticles.length === 0 && step1MatchingUnits.length === 0 ? (
 <div className="p-4 text-center text-theme-muted text-xs">
 Sin coincidencias
 </div>
 ) : (
 <>
 {/* GRUPO 1: ARTÍCULOS */}
 {step1MatchingArticles.length > 0 && (
 <div className="p-2 space-y-1">
 <span className="text-[9px] font-extrabold uppercase tracking-wider text-theme-muted px-2 py-0.5 block">
 [ARTÍCULO]
 </span>
 {step1MatchingArticles.map((art) => {
 const stockMtyN = MOCK_STOCK_ITEMS.filter(u => u.warehouseId === 'wh-mty-norte' && u.sku === art.sku && u.status === 'Disponible').length;
 const stockMtyS = MOCK_STOCK_ITEMS.filter(u => u.warehouseId === 'wh-mty-sur' && u.sku === art.sku && u.status === 'Disponible').length;
 const stockValle = MOCK_STOCK_ITEMS.filter(u => u.warehouseId === 'wh-suc-valle-oriente' && u.sku === art.sku && u.status === 'Disponible').length;

 return (
 <div
 key={art.sku}
 onClick={() => handleSelectArticleInStep1(art)}
 className="p-2.5 rounded-xl hover:bg-theme-muted/50 cursor-pointer transition-colors space-y-1 text-xs"
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-theme-primary">{art.sku}</span>
 <span className="text-[10px] text-theme-muted font-bold">{art.brand} &middot; {art.size}</span>
 </div>
 <h5 className="font-bold text-theme-main truncate">{art.name}</h5>
 
 <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-theme-muted">
 <span className="font-semibold text-theme-main">Disponible:</span>
 <span className="font-mono text-emerald-600 font-bold">CEDIS MTY Norte · {stockMtyN} pzas</span>
 <span className="font-mono text-purple-600 font-semibold">CEDIS MTY Sur · {stockMtyS} pzas</span>
 <span className="font-mono text-blue-600 font-semibold">Suc. Valle Ote · {stockValle} pzas</span>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* GRUPO 2: UNIDADES SERIALIZADAS */}
 {step1MatchingUnits.length > 0 && (
 <div className="p-2 space-y-1 bg-purple-500/5">
 <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-0.5 block">
 [UNIDAD SERIALIZADA]
 </span>
 {step1MatchingUnits.map((unit) => (
 <div
 key={unit.uid}
 onClick={() => handleSelectUnitInStep1(unit)}
 className="p-2.5 rounded-xl hover:bg-purple-500/15 cursor-pointer transition-colors space-y-1 text-xs"
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1">
 <QrCode className="w-3.5 h-3.5" />
 <span>{unit.uid}</span>
 </span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-purple-600 text-white">
 UID Específico
 </span>
 </div>
 <h5 className="font-bold text-theme-main truncate">{unit.productName}</h5>
 <div className="text-[10px] text-theme-muted font-mono">
 {unit.warehouseName} &middot; Ubicación: <strong className="text-theme-primary">{unit.location}</strong>
 </div>
 </div>
 ))}
 </div>
 )}
 </>
 )}
 </div>
 )}
 </div>
 </div>

 {/* 2. Artículo Seleccionado Card */}
 {selectedInitialArticle && (
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <span className="text-[9px] uppercase font-bold text-theme-muted tracking-wider block">
 ARTÍCULO SELECCIONADO
 </span>
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{selectedInitialArticle.sku}</span>
 <span className="text-[10px] text-theme-muted">{selectedInitialArticle.brand} &middot; {selectedInitialArticle.size}</span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{selectedInitialArticle.name}</h4>
 </div>

 <button
 type="button"
 onClick={() => {
 setStep1SearchQuery('');
 setIsStep1SearchOpen(true);
 }}
 className="text-[11px] font-bold text-theme-primary hover:underline cursor-pointer"
 >
 Cambiar artículo
 </button>
 </div>

 {/* Specific Unit Banner (if UID was selected) */}
 {selectedSpecificUnit ? (
 <div className="p-2.5 rounded-xl bg-white border border-purple-500 shadow-2xs text-xs text-zinc-900 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <QrCode className="w-4 h-4 text-purple-600" />
 <div>
 <strong>Esta unidad está actualmente en {sourceNode.name}.</strong>
 <span className="text-[10px] block text-theme-muted">UID: {selectedSpecificUnit.uid} &middot; Ubicación: {selectedSpecificUnit.location}</span>
 </div>
 </div>
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs font-mono">
 UID Asignada
 </span>
 </div>
 ) : (
 /* Existencias por ubicación */
 <div className="space-y-1.5 pt-1 border-t border-theme-subtle">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Existencias por ubicación:
 </span>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {MOCK_WAREHOUSES_LIST.map((wh) => {
 const count = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === wh.id && u.sku === selectedInitialArticle.sku && u.status === 'Disponible'
 ).length;
 const isSource = sourceWarehouseId === wh.id;

 return (
 <div
 key={wh.id}
 className={`p-2 rounded-xl border text-xs space-y-0.5 ${
 isSource
 ? 'bg-theme-primary-light border-theme-primary ring-1 ring-theme-primary/30 font-bold'
 : 'bg-theme-muted/30 border-theme-subtle'
 }`}
 >
 <span className="text-[10px] text-theme-muted block truncate">{wh.name.replace('CEDIS ', '').replace('Sucursal ', '')}</span>
 <span className="font-mono text-xs font-bold text-theme-main">{count} pzas</span>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* Origen Sugerido Badge */}
 {suggestedOrigin && !selectedSpecificUnit && (
 <div className="p-2.5 rounded-xl bg-white border border-emerald-600 shadow-2xs text-xs text-zinc-900 flex items-start gap-2">
 <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
 <div>
 <strong>Origen sugerido: {suggestedOrigin.warehouseName} ({suggestedOrigin.availableCount} pzas disponibles)</strong>
 <p className="text-[10px] text-zinc-600 dark:text-zinc-400">
 Motivo: {suggestedOrigin.reason}
 </p>
 </div>
 </div>
 )}
 </div>
 )}

 {/* 3 & 4. Origen y Destino del Traspaso */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* Origen */}
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-theme-muted uppercase flex items-center gap-1">
 <Building2 className="w-3.5 h-3.5 text-theme-primary" />
 <span>Origen del traspaso:</span>
 </label>
 <select
 value={sourceWarehouseId}
 onChange={(e) => {
 setSourceWarehouseId(e.target.value);
 setSuggestedOrigin(null);
 }}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 {MOCK_WAREHOUSES_LIST.map((w) => {
 const avail = selectedInitialArticle
 ? MOCK_STOCK_ITEMS.filter(u => u.warehouseId === w.id && u.sku === selectedInitialArticle.sku && u.status === 'Disponible').length
 : 0;

 return (
 <option key={w.id} value={w.id}>
 {w.name} · {avail} disponibles
 </option>
 );
 })}
 </select>
 </div>

 {/* Destino */}
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-theme-muted uppercase flex items-center gap-1">
 <Store className="w-3.5 h-3.5 text-emerald-600" />
 <span>Destino del traspaso:</span>
 </label>
 <select
 value={destinationWarehouseId}
 onChange={(e) => setDestinationWarehouseId(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-bold text-theme-main focus:outline-none focus:border-theme-primary cursor-pointer"
 >
 {MOCK_WAREHOUSES_LIST.map((w) => (
 <option key={w.id} value={w.id} disabled={w.id === sourceWarehouseId}>
 {w.name} ({w.code}) {w.id === sourceWarehouseId ? '(Mismo que origen)' : ''}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* Visual Route Preview */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between shadow-xs">
 <div className="space-y-0.5">
 <span className="text-[9px] uppercase font-bold text-theme-primary">ORIGEN</span>
 <div className="text-xs font-bold text-theme-main">{sourceNode.name}</div>
 <span className="text-[10px] text-theme-muted">{sourceNode.address}</span>
 </div>

 <div className="px-3 flex flex-col items-center">
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs mb-1">
 Tipo: {transferType}
 </span>
 <ArrowLeftRight className="w-4 h-4 text-purple-600" />
 </div>

 <div className="space-y-0.5 text-right">
 <span className="text-[9px] uppercase font-bold text-emerald-600">DESTINO</span>
 <div className="text-xs font-bold text-theme-main">{destinationNode.name}</div>
 <span className="text-[10px] text-theme-muted">{destinationNode.address}</span>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 2: ARTÍCULOS */}
 {/* ========================================================================= */}
 {step === 2 && (
 <div className="space-y-4">
 
 {/* Buscador con Autocompletado */}
 <div className="space-y-1.5" ref={searchContainerRef}>
 <label className="text-[11px] font-bold text-theme-muted uppercase block">
 Buscar y Seleccionar Artículos para Transferir:
 </label>

 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onFocus={() => setIsSearchOpen(true)}
 onChange={(e) => {
 setSearchQuery(e.target.value);
 setIsSearchOpen(true);
 }}
 placeholder="Buscar artículo, SKU, marca, categoría o descripción..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-9 pr-8 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 {searchQuery && (
 <button
 type="button"
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 )}

 {/* Dropdown de Sugerencias */}
 {isSearchOpen && (
 <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-surface rounded-2xl shadow-2xl border border-theme-subtle max-h-60 overflow-y-auto z-50 divide-y divide-theme-subtle">
 {matchingArticles.length === 0 ? (
 <div className="p-4 text-center text-theme-muted text-xs">
 No se encontraron artículos que coincidan con la búsqueda.
 </div>
 ) : (
 matchingArticles.map((art) => {
 const availableCount = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === art.sku && u.status === 'Disponible'
 ).length;

 return (
 <div
 key={art.sku}
 onClick={() => handleSelectArticleFromSearch(art)}
 className="p-3 hover:bg-theme-muted/50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
 >
 <div className="min-w-0 space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{art.sku}</span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {art.category}
 </span>
 <span className="text-[10px] text-theme-muted">{art.brand} &middot; {art.size}</span>
 </div>
 <h4 className="text-xs font-bold text-theme-main truncate">{art.name}</h4>
 </div>

 <div className="text-right shrink-0">
 <span className="text-[9px] text-theme-muted uppercase block font-semibold">En origen:</span>
 <strong className="text-xs font-mono font-bold text-emerald-600">
 {availableCount} unidades
 </strong>
 </div>
 </div>
 );
 })
 )}
 </div>
 )}
 </div>
 </div>

 {/* Artículo Activo Seleccionado para Configuración */}
 {activeArticleToConfigure && (
 <div className="p-4 rounded-2xl bg-white border border-theme-subtle shadow-xs space-y-3">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{activeArticleToConfigure.sku}</span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {activeArticleToConfigure.category}
 </span>
 <span className="text-[10px] text-theme-muted">{activeArticleToConfigure.size}</span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{activeArticleToConfigure.name}</h4>
 </div>

 <div className="text-right">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">Disponible en {sourceNode.name}:</span>
 <strong className="text-xs font-mono font-black text-emerald-600">
 {MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === activeArticleToConfigure.sku && u.status === 'Disponible'
 ).length} unidades
 </strong>
 </div>
 </div>

 {/* Quantity and Add Button */}
 <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold text-theme-main">Cantidad a transferir:</span>
 <input
 type="number"
 min={1}
 value={activeItemQuantity}
 onChange={(e) => setActiveItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
 className="w-20 bg-theme-surface border border-theme-subtle rounded-xl py-1.5 px-3 text-center text-xs font-mono font-black text-theme-main focus:outline-none focus:border-theme-primary"
 />
 <span className="text-xs text-theme-muted">unidades</span>
 </div>

 <button
 type="button"
 onClick={handleAddActiveItemToDraft}
 className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar al traspaso</span>
 </button>
 </div>
 </div>
 )}

 {/* Lista de Artículos Seleccionados para el Traspaso */}
 <div className="space-y-2 pt-1">
 <div className="flex items-center justify-between text-xs">
 <span className="font-extrabold text-theme-main">
 Artículos seleccionados ({transferItems.length}):
 </span>
 <span className="font-mono font-bold text-theme-primary">
 Total: {totalUnits} unidades a transferir
 </span>
 </div>

 {transferItems.length === 0 ? (
 <div className="p-6 rounded-2xl border-2 border-dashed border-theme-subtle text-center text-theme-muted text-xs">
 No has agregado ningún artículo al traspaso aún. Selecciona uno en el buscador arriba.
 </div>
 ) : (
 <div className="space-y-2 max-h-48 overflow-y-auto">
 {transferItems.map((item, index) => (
 <div
 key={item.id}
 className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between gap-3 shadow-xs"
 >
 <div className="min-w-0 space-y-0.5 flex-1">
 <div className="flex items-center gap-2">
 <span className="w-5 h-5 rounded-full bg-white text-zinc-900 border border-purple-500 shadow-2xs font-bold text-[10px] flex items-center justify-center shrink-0">
 {index + 1}
 </span>
 <span className="font-mono text-xs font-bold text-theme-primary">{item.sku}</span>
 <span className="text-[10px] text-theme-muted">{item.category} &middot; {item.size}</span>
 </div>
 <h5 className="text-xs font-bold text-theme-main truncate">{item.name}</h5>
 </div>

 <div className="flex items-center gap-3 shrink-0">
 <div className="flex items-center gap-1.5">
 <input
 type="number"
 min={1}
 value={item.quantity}
 onChange={(e) => handleUpdateItemQuantity(item.id, parseInt(e.target.value) || 1)}
 className="w-16 bg-theme-muted border border-theme-subtle rounded-xl py-1 px-2 text-center text-xs font-mono font-black text-theme-main"
 />
 <span className="text-[11px] text-theme-muted">u.</span>
 </div>

 <button
 type="button"
 onClick={() => handleRemoveDraftItem(item.id)}
 className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-primary-light rounded-xl transition-colors cursor-pointer"
 title="Quitar artículo"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 3: ESTRATEGIA (PLANIFICACIÓN Y ESTRATEGIA DE RECOLECCIÓN) */}
 {/* ========================================================================= */}
 {step === 3 && (
 <div className="space-y-4">
 
 {/* Header callout */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Planificación y Estrategia de Recolección
 </span>
 <p className="text-xs text-theme-main font-semibold">
 Selecciona el criterio para sugerir las unidades físicas que se recolectarán en <strong>{sourceNode.name}</strong>:
 </p>
 </div>

 {/* Strategy Selection Cards Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
 {ORDERED_PICKING_STRATEGIES.map((stKey) => {
 const strat = STRATEGY_COMPARISONS[stKey];
 const isSelected = selectedStrategy === stKey;

 return (
 <div
 key={stKey}
 onClick={() => handleApplyStrategy(stKey)}
 className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden bg-theme-surface ${
 isSelected
 ? 'border-2 border-theme-primary ring-2 ring-theme-primary/20 text-zinc-900 shadow-xs'
 : 'border-theme-subtle hover:border-theme-primary/40 text-theme-main'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="text-xs font-black truncate">{strat.label}</span>
 {stKey === 'RECOMMENDED' || stKey === 'SUGGESTED' ? (
 <Sparkles className="w-3.5 h-3.5 text-theme-primary shrink-0" />
 ) : (
 <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
 isSelected ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/30' : 'bg-theme-muted text-theme-muted'
 }`}>
 {strat.badge}
 </span>
 )}
 </div>

 <div className="text-[10px] text-theme-muted font-mono space-y-0.5">
 {stKey === 'EMPTY_LOCATION' ? (
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

 <div className="flex items-center text-theme-primary text-[10px]">
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

 {/* Explanatory Strategy Panel (Subtle & High Contrast) */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2 text-zinc-900 shadow-xs">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="flex items-center gap-2">
 <Compass className="w-4 h-4 text-theme-primary shrink-0" />
 <strong className="text-xs font-black">
 {STRATEGY_COMPARISONS[selectedStrategy]?.panelTitle || `${STRATEGY_COMPARISONS[selectedStrategy]?.label} — Justificación Operativa`}
 </strong>
 </div>
 <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
 {STRATEGY_COMPARISONS[selectedStrategy]?.locationsFreedCount > 0 && `${STRATEGY_COMPARISONS[selectedStrategy].locationsFreedCount} ubicaciones se liberarán completamente · `}
 {STRATEGY_COMPARISONS[selectedStrategy]?.estimatedDistanceMeters} m estimados &bull; FIFO {STRATEGY_COMPARISONS[selectedStrategy]?.fifoCompliancePercentage}%
 </span>
 </div>
 <p className="text-[11px] text-theme-muted leading-relaxed">
 {STRATEGY_COMPARISONS[selectedStrategy]?.description}
 </p>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 4: UNIDADES (PRE-ASIGNACIÓN, MOTIVO & RECORRIDO ESTIMADO) */}
 {/* ========================================================================= */}
 {step === 4 && (
 <div className="space-y-4">
 
 {/* Header & Quick Action Bar */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-2">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">
 Pre-asignación de Unidades en {sourceNode.name}
 </span>
 <h4 className="text-xs font-bold text-theme-main">
 Estrategia activa: <strong className="text-theme-primary">{STRATEGY_COMPARISONS[selectedStrategy]?.label}</strong>
 </h4>
 </div>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => handleApplyStrategy(selectedStrategy)}
 className="px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
 >
 <Sparkles className="w-3.5 h-3.5 text-purple-600" />
 <span>Aplicar estrategia ({totalUnits}/{totalUnits})</span>
 </button>
 </div>
 </div>
 </div>

 {/* Visual Sequence Route Strip */}
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between text-[10px] uppercase font-bold text-theme-muted">
 <span className="flex items-center gap-1.5 text-theme-main font-bold">
 <MapPin className="w-3.5 h-3.5 text-theme-primary" />
 <span>Recorrido Estimado en Origen:</span>
 </span>
 <span className="font-mono text-theme-primary font-bold">
 {estimatedRouteLocations.length} posiciones asignadas
 </span>
 </div>

 <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-mono">
 {estimatedRouteLocations.map((loc, idx) => (
 <React.Fragment key={loc}>
 <div className="px-2.5 py-1 rounded-xl bg-theme-surface border border-theme-subtle text-theme-main font-bold shrink-0 flex items-center gap-1">
 <span className="text-[9px] text-theme-muted">#{idx + 1}</span>
 <span>{loc}</span>
 </div>
 {idx < estimatedRouteLocations.length - 1 && (
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted shrink-0 opacity-60" />
 )}
 </React.Fragment>
 ))}
 <ArrowRight className="w-3.5 h-3.5 text-theme-muted shrink-0 opacity-60" />
 <div className="px-2.5 py-1 rounded-xl bg-white text-zinc-900 font-bold shrink-0 border border-purple-500 shadow-2xs">
 STG-OUT-01 (Salida)
 </div>
 </div>
 </div>

 {/* Items Breakdown with Details & Motivo de sugerencia */}
 <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
 {transferItems.map((item) => {
 const availableUnits = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === item.sku && u.status === 'Disponible'
 );
 const isSerialized = item.serialization === 'Por unidad';
 const preassignedUnits = availableUnits.filter(u => item.serials.includes(u.uid));
 const calculatedUnits = calculateUnitsForStrategy(
 sourceWarehouseId,
 item.sku,
 item.quantity,
 selectedStrategy,
 MOCK_STOCK_ITEMS
 );

 return (
 <div key={item.id} className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono text-xs font-black text-theme-primary">{item.sku}</span>
 <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {item.category}
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{item.name}</h4>
 </div>

 <div className="text-right">
 <span className="font-mono font-bold text-xs text-theme-main block">
 {item.quantity} unidades requeridas
 </span>
 <span className={`text-[10px] font-mono font-bold ${
 item.serials.length === item.quantity ? 'text-emerald-600' : 'text-amber-600'
 }`}>
 {isSerialized ? `${item.serials.length}/${item.quantity} pre-asignadas` : 'Inventario estándar'}
 </span>
 </div>
 </div>

 {/* Serialized UIDs Cards with Reason */}
 {isSerialized ? (
 <div className="space-y-2 pt-2 border-t border-theme-subtle">
 <span className="text-[10px] text-theme-muted uppercase font-bold block">
 Unidades seleccionadas para recolección:
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {preassignedUnits.map((unit) => {
 const calcInfo = calculatedUnits.find(c => c.uid === unit.uid);
 const isFreed = calcInfo?.isLocationFreed || selectedStrategy === 'EMPTY_LOCATION';
 const reasonObj = getReadableStrategyReason(selectedStrategy, unit, isFreed);

 return (
 <div
 key={unit.uid}
 className="p-3.5 rounded-2xl bg-white border border-purple-500/40 /50 flex flex-col justify-between gap-2.5 shadow-2xs transition-all hover:border-purple-500/70"
 >
 {/* Header: UID + Cambiar button */}
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-2 flex-wrap min-w-0">
 <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
 <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 tracking-tight">
 {unit.uid}
 </span>
 {isFreed && (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white text-zinc-900 border border-emerald-600 shadow-2xs inline-flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
 <span>Libera {unit.location}</span>
 </span>
 )}
 </div>

 <button
 type="button"
 onClick={() => setSwappingTarget({ itemId: item.id, currentUid: unit.uid })}
 className="px-2.5 py-1 rounded-xl bg-theme-surface hover:bg-theme-muted text-zinc-900 text-xs font-semibold transition-all border border-theme-subtle hover:border-purple-500/40 cursor-pointer shrink-0 shadow-2xs"
 title="Cambiar esta unidad por otra disponible"
 >
 Cambiar
 </button>
 </div>

 {/* Metadata: Ubicación · Lote · Antigüedad */}
 <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono flex-wrap">
 <span>Ubicación <strong className="text-zinc-900 font-semibold">{unit.location}</strong></span>
 <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
 <span>Lote <strong className="text-zinc-900 font-semibold">{unit.lotNumber}</strong></span>
 <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
 <span><strong className="text-zinc-900 font-semibold">{unit.ageDays}</strong> días</span>
 </div>

 {/* Reason Section */}
 <div className="pt-2 border-t border-theme-subtle/80 space-y-1">
 <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 block">
 Motivo de selección
 </span>
 <div className="flex items-center gap-2 text-xs text-zinc-900 font-medium flex-wrap">
 <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs inline-flex items-center gap-1 shrink-0">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
 <span>{reasonObj.badge}</span>
 </span>
 <span className="text-zinc-900">
 {reasonObj.text}
 </span>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 ) : (
 <div className="p-3 rounded-xl bg-theme-muted/40 border border-theme-subtle text-[11px] text-theme-muted flex items-center gap-2">
 <Info className="w-4 h-4 text-theme-primary shrink-0" />
 <span>Artículo no serializado. Se surtirá la cantidad requerida directamente del lote operativo.</span>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 5: TRANSPORTE Y OPERADOR */}
 {/* ========================================================================= */}
 {step === 5 && (
 <div className="space-y-4">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Logística de Transporte</span>
 <p className="text-xs text-theme-main font-semibold">
 Indica los datos del operador, unidad de traslado y fecha programada para el movimiento de unidades.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase text-theme-muted">Chofer / Operador de Transporte:</label>
 <input
 type="text"
 value={driver}
 onChange={(e) => setDriver(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-theme-muted uppercase block">
 Unidad / Placas del Camión:
 </label>
 <input
 type="text"
 value={truckPlates}
 onChange={(e) => setTruckPlates(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary font-mono"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-theme-muted uppercase block">
 Observaciones Operativas:
 </label>
 <input
 type="text"
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2.5 text-xs font-semibold text-theme-main focus:outline-none focus:border-theme-primary"
 />
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 6: RESUMEN Y GENERACIÓN DE ORDEN */}
 {/* ========================================================================= */}
 {step === 6 && (
 <div className="space-y-4">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3.5">
 <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
 <span className="text-[10px] font-bold uppercase text-theme-muted tracking-wider">
 Resumen de la Orden de Traspaso
 </span>
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 {transferType}
 </span>
 </div>

 {/* Ruta */}
 <div className="flex items-center justify-between text-xs">
 <div>
 <span className="text-[10px] text-theme-muted block">Origen:</span>
 <strong className="text-theme-main">{sourceNode.name}</strong>
 </div>
 <div className="text-purple-600 font-bold px-2">&rarr;</div>
 <div className="text-right">
 <span className="text-[10px] text-theme-muted block">Destino:</span>
 <strong className="text-theme-primary">{destinationNode.name}</strong>
 </div>
 </div>

 {/* Estrategia Seleccionada */}
 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-xs">
 <div>
 <span className="text-[10px] text-theme-muted block">Estrategia de Surtido:</span>
 <strong className="text-theme-main">{STRATEGY_COMPARISONS[selectedStrategy]?.label}</strong>
 </div>
 <div className="text-right">
 <span className="text-[10px] text-theme-muted block">Recorrido Estimado:</span>
 <strong className="font-mono text-purple-700 dark:text-purple-300">{estimatedRouteLocations.length} posiciones (~{STRATEGY_COMPARISONS[selectedStrategy]?.estimatedDistanceMeters} m)</strong>
 </div>
 </div>

 {/* Artículos Resumen */}
 <div className="pt-2 border-t border-theme-subtle space-y-2">
 <div className="flex items-center justify-between text-xs">
 <span className="font-extrabold text-theme-main">
 Artículos a transferir ({transferItems.length}):
 </span>
 <strong className="font-mono text-theme-primary text-sm">
 {totalUnits} unidades totales
 </strong>
 </div>

 <div className="space-y-1.5 max-h-32 overflow-y-auto">
 {transferItems.map((item, idx) => (
 <div key={item.id} className="p-2 rounded-xl bg-theme-muted/40 border border-theme-subtle flex items-center justify-between text-[11px]">
 <div className="min-w-0">
 <span className="font-bold text-theme-main truncate block">
 {idx + 1}. {item.name}
 </span>
 <span className="font-mono text-[10px] text-theme-muted">
 {item.sku} &bull; {item.category}
 </span>
 </div>
 <span className="font-mono font-bold text-theme-main shrink-0 ml-2">
 {item.quantity} unidades ({item.serials.length} UIDs)
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Logística */}
 <div className="pt-2 border-t border-theme-subtle grid grid-cols-2 gap-2 text-[11px] text-theme-muted">
 <div>
 <span>Chofer: </span>
 <strong className="text-theme-main">{driver}</strong>
 </div>
 <div className="text-right">
 <span>Unidad: </span>
 <strong className="font-mono text-theme-main">{truckPlates}</strong>
 </div>
 </div>

 {/* Explanatory Callout Box (Subtle & Elegant) */}
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle text-[11px] text-zinc-900 flex items-start gap-2 shadow-xs">
 <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
 <p className="leading-relaxed text-theme-muted">
 Al confirmar, se emitirá la <strong>Orden de Traspaso</strong> y su <strong>Orden de Recolección</strong> correspondiente en estado <em>Preparando</em>. El equipo de almacén en <strong>{sourceNode.name}</strong> recolectará físicamente los bultos en el recorrido planeado.
 </p>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Footer Navigation */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 {step > 1 ? (
 <button
 onClick={() => setStep((s) => (s - 1) as any)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle flex items-center gap-1"
 >
 <ChevronLeft className="w-4 h-4" />
 <span>Anterior</span>
 </button>
 ) : (
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cancelar
 </button>
 )}

 {step < 6 ? (
 <button
 disabled={step === 2 && transferItems.length === 0}
 onClick={() => {
 if (step === 3) {
 // Ensure serials are calculated when entering step 4
 handleApplyStrategy(selectedStrategy);
 }
 setStep((s) => (s + 1) as any);
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
 >
 <span>Siguiente</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 onClick={handleConfirmAndSendToCollection}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <PackageCheck className="w-4 h-4" />
 <span>Generar orden de recolección</span>
 </button>
 )}
 </div>
 </div>

 {/* Submodal: Unit Swap Modal */}
 {swappingTarget && (
 <ModalPortal onClose={() => setSwappingTarget(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-sm font-black text-theme-main">
 Cambiar Unidad Asignada
 </h4>
 <span className="text-[10px] text-theme-muted font-mono">
 Sustitución de {swappingTarget.currentUid}
 </span>
 </div>
 <button
 onClick={() => setSwappingTarget(null)}
 className="p-1 rounded-lg hover:bg-theme-muted text-theme-muted cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <p className="text-xs text-theme-muted">
 Selecciona una unidad alternativa disponible en <strong>{sourceNode.name}</strong> para este artículo:
 </p>

 <div className="space-y-1.5 max-h-48 overflow-y-auto">
 {(() => {
 const targetItem = transferItems.find(i => i.id === swappingTarget.itemId);
 if (!targetItem) return null;

 const availableInWh = MOCK_STOCK_ITEMS.filter(
 u => u.warehouseId === sourceWarehouseId && u.sku === targetItem.sku && u.status === 'Disponible' && !targetItem.serials.includes(u.uid)
 );

 if (availableInWh.length === 0) {
 return (
 <div className="p-4 text-center text-theme-muted text-xs">
 No hay otras unidades disponibles de este SKU en este almacén.
 </div>
 );
 }

 return availableInWh.map((u) => (
 <div
 key={u.uid}
 onClick={() => handleSwapUnit(swappingTarget.itemId, swappingTarget.currentUid, u.uid)}
 className="p-2.5 rounded-xl bg-theme-muted/30 hover:bg-purple-500/10 border border-theme-subtle hover:border-purple-500/30 transition-all cursor-pointer flex items-center justify-between text-xs"
 >
 <div>
 <strong className="font-mono text-theme-main block">{u.uid}</strong>
 <span className="text-[10px] text-theme-muted font-mono">{u.location} &bull; Lote: {u.lotNumber} ({u.ageDays}d)</span>
 </div>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white">
 Elegir
 </span>
 </div>
 ));
 })()}
 </div>

 <div className="pt-2 border-t border-theme-subtle flex justify-end">
 <button
 type="button"
 onClick={() => setSwappingTarget(null)}
 className="px-4 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold cursor-pointer"
 >
 Cancelar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </ModalPortal>
 );
};
