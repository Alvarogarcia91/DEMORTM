import React, { useState, useEffect } from 'react';
import {
 X,
 Plus,
 Trash2,
 Search,
 CheckCircle2,
 AlertCircle,
 Sparkles,
 Building2,
 Calendar,
 User,
 Truck,
 FileText,
 AlertTriangle,
 Info,
 PackagePlus,
 Box,
 Layers
} from 'lucide-react';
import {
 Requisition,
 RequisitionItem,
 RequisitionPriority,
 RequisitionStatus,
 DESTINATION_WAREHOUSES,
 SUPPLIERS_LIST,
 getAssistedCaptureMetrics
} from '../../../data/mockRequisitionsData';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../../data/mockArticlesData';
import { INITIAL_MOCK_SUPPLIERS, getPreferredSupplierForSku } from '../../../data/mockSuppliersData';
import { ModalPortal } from '../../common/ModalPortal';

interface RequisitionFormModalProps {
 initialRequisition?: Requisition | null;
 prefilledItem?: {
 sku: string;
 productName: string;
 brand: string;
 size?: string;
 category?: string;
 quantity: number;
 targetWarehouseId: string;
 suggestedSupplier?: string;
 note?: string;
 } | null;
 onClose: () => void;
 onSaveRequisition: (requisition: Requisition) => void;
}

export const RequisitionFormModal: React.FC<RequisitionFormModalProps> = ({
 initialRequisition,
 prefilledItem,
 onClose,
 onSaveRequisition,
}) => {
 // General Info States
 const [requester] = useState('Admin Demo');
 const [targetWarehouseId, setTargetWarehouseId] = useState(
 initialRequisition?.targetWarehouseId || prefilledItem?.targetWarehouseId || 'wh-mty-norte'
 );
 const [requiredDate, setRequiredDate] = useState(
 initialRequisition?.requiredDate || '30 Ago 2026'
 );
 const [priority, setPriority] = useState<RequisitionPriority>(
 initialRequisition?.priority || 'Normal'
 );
 const [suggestedSupplier, setSuggestedSupplier] = useState(
 initialRequisition?.suggestedSupplier || prefilledItem?.suggestedSupplier || ''
 );
 const [notes, setNotes] = useState(
 initialRequisition?.notes || prefilledItem?.note || ''
 );

 // Items List
 const [items, setItems] = useState<RequisitionItem[]>(
 initialRequisition?.items || []
 );

 // Active Item Input Mode: 'CATALOG' | 'UNREGISTERED' | 'CONSUMABLE'
 const [inputMode, setInputMode] = useState<'CATALOG' | 'UNREGISTERED' | 'CONSUMABLE'>('CATALOG');

 // Catalog search state
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedArticle, setSelectedArticle] = useState<MasterArticle | null>(null);
 const [catalogQty, setCatalogQty] = useState<number>(1);
 const [catalogComments, setCatalogComments] = useState('');

 // Unregistered Product Form state
 const [unregDesc, setUnregDesc] = useState('');
 const [unregBrand, setUnregBrand] = useState('');
 const [unregSize, setUnregSize] = useState('');
 const [unregSpecs, setUnregSpecs] = useState('');
 const [unregQty, setUnregQty] = useState<number>(1);
 const [unregUnit, setUnregUnit] = useState('Colchón');
 const [unregComments, setUnregComments] = useState('');

 // Duplicate Warning Modal/State
 const [duplicateWarning, setDuplicateWarning] = useState<{
 existingItem: RequisitionItem;
 incomingQty: number;
 } | null>(null);

 // Confirmation Modal for Sending to Authorization
 const [confirmSendOpen, setConfirmSendOpen] = useState(false);

 // Error validation notice
 const [errorMessage, setErrorMessage] = useState('');

 // Handle prefilled item if supplied
 useEffect(() => {
 if (prefilledItem && (!initialRequisition || initialRequisition.items.length === 0)) {
 const metrics = getAssistedCaptureMetrics(prefilledItem.sku, prefilledItem.targetWarehouseId);
 const newItem: RequisitionItem = {
 id: `it-${Date.now()}`,
 sku: prefilledItem.sku,
 name: prefilledItem.productName,
 brand: prefilledItem.brand,
 size: prefilledItem.size || 'Individual',
 category: prefilledItem.category || 'Colchones',
 quantity: prefilledItem.quantity,
 unit: 'Colchón',
 comments: prefilledItem.note || 'Sugerencia automática de reorden',
 ...metrics,
 };
 setItems([newItem]);
 }
 }, [prefilledItem, initialRequisition]);

 // Autocomplete filtered list
 const filteredArticles = MOCK_MASTER_ARTICLES.filter((art) => {
 if (!searchQuery.trim()) return false;
 const q = searchQuery.toLowerCase();
 return (
 art.name.toLowerCase().includes(q) ||
 art.sku.toLowerCase().includes(q) ||
 art.brand.toLowerCase().includes(q) ||
 art.size.toLowerCase().includes(q) ||
 art.category.toLowerCase().includes(q)
 );
 }).slice(0, 6);

 // Metrics for currently selected article
 const currentArticleMetrics = selectedArticle
 ? getAssistedCaptureMetrics(selectedArticle.sku, targetWarehouseId)
 : null;

 // Add Item from Catalog
 const handleAddCatalogItem = () => {
 if (!selectedArticle) return;
 if (catalogQty <= 0) {
 setErrorMessage('La cantidad debe ser mayor a 0');
 return;
 }

 // Check duplicate
 const existing = items.find((i) => i.sku === selectedArticle.sku);
 if (existing) {
 setDuplicateWarning({
 existingItem: existing,
 incomingQty: catalogQty,
 });
 return;
 }

 const metrics = getAssistedCaptureMetrics(selectedArticle.sku, targetWarehouseId);

 const newItem: RequisitionItem = {
 id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
 sku: selectedArticle.sku,
 name: selectedArticle.name,
 brand: selectedArticle.brand,
 size: selectedArticle.size,
 category: selectedArticle.category,
 quantity: catalogQty,
 unit: selectedArticle.baseUnit || 'Colchón',
 comments: catalogComments.trim(),
 ...metrics,
 };

 setItems((prev) => [...prev, newItem]);

 if (!suggestedSupplier) {
 const preferredSup = getPreferredSupplierForSku(selectedArticle.sku, INITIAL_MOCK_SUPPLIERS);
 if (preferredSup) {
 setSuggestedSupplier(preferredSup.tradeName);
 }
 }

 // Reset selection
 setSelectedArticle(null);
 setSearchQuery('');
 setCatalogQty(1);
 setCatalogComments('');
 setErrorMessage('');
 };

 // Merge duplicate quantity
 const handleMergeDuplicate = () => {
 if (!duplicateWarning) return;
 setItems((prev) =>
 prev.map((it) =>
 it.id === duplicateWarning.existingItem.id
 ? { ...it, quantity: it.quantity + duplicateWarning.incomingQty }
 : it
 )
 );
 setDuplicateWarning(null);
 setSelectedArticle(null);
 setSearchQuery('');
 setCatalogQty(1);
 setCatalogComments('');
 };

 // Add Unregistered Product Item
 const handleAddUnregisteredItem = () => {
 if (!unregDesc.trim()) {
 setErrorMessage('Debes ingresar la descripción del producto');
 return;
 }
 if (unregQty <= 0) {
 setErrorMessage('La cantidad debe ser mayor a 0');
 return;
 }

 const newItem: RequisitionItem = {
 id: `unreg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
 sku: 'PROD-PEND-REV',
 name: unregDesc.trim(),
 brand: unregBrand.trim() || 'Por asignar',
 size: unregSize.trim() || 'No especificada',
 category: 'Producto no registrado',
 quantity: unregQty,
 unit: unregUnit,
 comments: unregComments.trim(),
 isUnregisteredProduct: true,
 unregisteredDetails: {
 description: unregDesc.trim(),
 suggestedBrand: unregBrand.trim(),
 sizeOrPresentation: unregSize.trim(),
 specifications: unregSpecs.trim(),
 },
 reviewStatus: 'PENDING',
 currentStock: 0,
 availableStock: 0,
 inTransitStock: 0,
 monthlyConsumption: 0,
 coverageMonths: 0,
 };

 setItems((prev) => [...prev, newItem]);
 // Reset fields
 setUnregDesc('');
 setUnregBrand('');
 setUnregSize('');
 setUnregSpecs('');
 setUnregQty(1);
 setUnregComments('');
 setErrorMessage('');
 };

 // Add Operational Consumable preset
 const handleAddConsumablePreset = (name: string, sku: string, unit: string, defaultQty: number) => {
 const newItem: RequisitionItem = {
 id: `ins-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
 sku,
 name,
 brand: 'Insumos Almacén',
 category: 'Insumo Interno',
 quantity: defaultQty,
 unit,
 comments: 'Consumible operativo de almacén',
 currentStock: 5,
 availableStock: 5,
 inTransitStock: 0,
 monthlyConsumption: 10,
 coverageMonths: 0.5,
 };
 setItems((prev) => [...prev, newItem]);
 };

 // Remove Item
 const handleRemoveItem = (id: string) => {
 setItems((prev) => prev.filter((i) => i.id !== id));
 };

 // Validate and submit
 const handleSave = (targetStatus: 'Borrador' | 'Pendiente de autorización') => {
 if (items.length === 0) {
 setErrorMessage('Debes agregar al menos una partida a la requisición');
 return;
 }

 const warehouseObj = DESTINATION_WAREHOUSES.find((w) => w.id === targetWarehouseId);
 const hasUnreg = items.some((i) => i.isUnregisteredProduct && (!i.reviewStatus || i.reviewStatus === 'PENDING'));
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 const folio = initialRequisition?.folio || `REQ-2026-00${Math.floor(51 + Math.random() * 40)}`;

 const requisitionData: Requisition = {
 id: initialRequisition?.id || `req-${Date.now()}`,
 folio,
 createdAt: initialRequisition?.createdAt || '27 Ago 2026',
 requester,
 targetWarehouseId,
 targetWarehouseName: warehouseObj?.name || 'CEDIS Monterrey Norte',
 requiredDate,
 priority,
 suggestedSupplier: suggestedSupplier.trim() || undefined,
 notes: notes.trim() || undefined,
 items,
 status: targetStatus,
 hasPendingProductReview: hasUnreg,
 timeline: initialRequisition?.timeline || [
 {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: requester,
 role: 'Solicitante',
 action: targetStatus === 'Borrador'
 ? 'Guardó borrador de requisición'
 : 'Creó y envió la requisición a autorización',
 type: targetStatus === 'Borrador' ? 'created' : 'submitted',
 },
 ],
 };

 onSaveRequisition(requisitionData);
 onClose();
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-5xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <PackagePlus className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5">
 <h2 className="text-base font-black text-theme-main">
 {initialRequisition ? `Editar Requisición ${initialRequisition.folio}` : 'Nueva Requisición de Compra'}
 </h2>
 <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-theme-primary/25">
 Reabasto Interno
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Registra la necesidad de mercancía o insumos para CEDIS o Sucursales de Impresos RTM.
 </p>
 </div>
 </div>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Form Body */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1">
 
 {errorMessage && (
 <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-theme-primary/30 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold animate-in fade-in duration-150">
 <AlertCircle className="w-4 h-4 shrink-0" />
 <span>{errorMessage}</span>
 </div>
 )}

 {/* SECCIÓN 1: DATOS GENERALES */}
 <div className="bg-theme-muted/30 p-5 border border-theme-subtle rounded-3xl space-y-4">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5 text-theme-primary" />
 Datos Generales de la Solicitud
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
 
 {/* Solicitante */}
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted flex items-center gap-1">
 <User className="w-3 h-3 text-theme-primary" />
 Solicitante
 </label>
 <input
 type="text"
 value={requester}
 readOnly
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-not-allowed opacity-80"
 />
 </div>

 {/* Destino (CEDIS o Sucursal) */}
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted flex items-center gap-1">
 <Building2 className="w-3 h-3 text-blue-600" />
 Destino / Almacén
 </label>
 <select
 value={targetWarehouseId}
 onChange={(e) => setTargetWarehouseId(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30 cursor-pointer"
 >
 {DESTINATION_WAREHOUSES.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name} ({wh.type})
 </option>
 ))}
 </select>
 </div>

 {/* Fecha Requerida */}
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted flex items-center gap-1">
 <Calendar className="w-3 h-3 text-purple-600" />
 Fecha Requerida
 </label>
 <input
 type="text"
 value={requiredDate}
 onChange={(e) => setRequiredDate(e.target.value)}
 placeholder="Ej. 30 Ago 2026"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>

 {/* Prioridad */}
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted flex items-center gap-1">
 <AlertTriangle className="w-3 h-3 text-amber-600" />
 Prioridad
 </label>
 <select
 value={priority}
 onChange={(e) => setPriority(e.target.value as RequisitionPriority)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30 cursor-pointer"
 >
 <option value="Normal">Normal</option>
 <option value="Alta">Alta</option>
 <option value="Urgente">Urgente</option>
 </select>
 </div>
 </div>

 {/* Proveedor Sugerido y Notas */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-theme-subtle">
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted flex items-center gap-1">
 <Truck className="w-3 h-3 text-theme-primary" />
 Proveedor sugerido (Opcional)
 </label>
 <input
 type="text"
 list="suppliers-datalist"
 value={suggestedSupplier}
 onChange={(e) => setSuggestedSupplier(e.target.value)}
 placeholder="Selecciona o escribe el proveedor sugerido..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 <datalist id="suppliers-datalist">
 {SUPPLIERS_LIST.map((sup, idx) => (
 <option key={idx} value={sup} />
 ))}
 </datalist>
 </div>

 <div className="space-y-1">
 <label className="text-[11px] font-bold text-theme-muted">
 Notas o Justificación de la Compra
 </label>
 <input
 type="text"
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Ej. Reabasto para cubrir demanda proyectada..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>
 </div>
 </div>

 {/* SECCIÓN 2: CAPTURA DE PARTIDAS */}
 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Layers className="w-4 h-4 text-theme-primary" />
 Agregar Partidas a la Requisición
 </h3>

 {/* Sub-modes toggles */}
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 border border-theme-subtle rounded-2xl">
 <button
 type="button"
 onClick={() => setInputMode('CATALOG')}
 className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 inputMode === 'CATALOG'
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Catálogo Activo
 </button>

 <button
 type="button"
 onClick={() => setInputMode('UNREGISTERED')}
 className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
 inputMode === 'UNREGISTERED'
 ? 'bg-white text-zinc-900 border border-amber-500 shadow-2xs font-bold'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 <Sparkles className="w-3 h-3" />
 <span>Producto no registrado</span>
 </button>

 <button
 type="button"
 onClick={() => setInputMode('CONSUMABLE')}
 className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 inputMode === 'CONSUMABLE'
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 Insumos Internos
 </button>
 </div>
 </div>

 {/* MODE A: CATALOG AUTOCOMPLETE */}
 {inputMode === 'CATALOG' && (
 <div className="p-4.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
 <div className="space-y-1.5">
 <label className="text-[11px] font-bold text-theme-muted">
 Buscar artículo en catálogo maestro (SKU, nombre, marca o medida):
 </label>
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Escribe 'Flow', 'Record', 'SC-NAYT' o nombre del artículo..."
 className="w-full bg-theme-muted/40 border border-theme-subtle rounded-2xl pl-10 pr-4 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>

 {/* Autocomplete Dropdown */}
 {searchQuery.trim() && filteredArticles.length > 0 && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-xl overflow-hidden mt-1 max-h-56 overflow-y-auto divide-y divide-theme-subtle z-20">
 {filteredArticles.map((art) => (
 <div
 key={art.id}
 onClick={() => {
 setSelectedArticle(art);
 setSearchQuery(art.name);
 // Auto suggest supplier if empty
 if (!suggestedSupplier && art.brand) {
 const matchedSup = SUPPLIERS_LIST.find((s) => s.toLowerCase().includes(art.brand.toLowerCase()));
 if (matchedSup) setSuggestedSupplier(matchedSup);
 }
 }}
 className="p-3 hover:bg-theme-muted/50 cursor-pointer flex items-center justify-between transition-colors text-xs"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono font-bold text-theme-primary">{art.sku}</span>
 <span className="font-bold text-theme-main">{art.name}</span>
 </div>
 <span className="text-[10px] text-theme-muted">
 {art.brand} &bull; {art.size} &bull; Línea: {art.category}
 </span>
 </div>
 <span className="text-[10px] font-mono text-theme-muted px-2 py-0.5 rounded bg-theme-muted">
 {art.baseUnit}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Selected Article Preview & Assisted Capture */}
 {selectedArticle && currentArticleMetrics && (
 <div className="p-4 rounded-2xl bg-rose-500/5 border border-theme-primary/20 space-y-3 animate-in fade-in duration-150">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div>
 <div className="flex items-center gap-2">
 <span className="font-mono font-black text-xs text-theme-primary">{selectedArticle.sku}</span>
 <span className="font-bold text-theme-main text-xs">{selectedArticle.name}</span>
 </div>
 <span className="text-[11px] text-theme-muted">
 {selectedArticle.brand} &bull; {selectedArticle.size} &bull; {selectedArticle.category}
 </span>
 </div>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-theme-muted text-theme-muted">
 Unidad: {selectedArticle.baseUnit}
 </span>
 </div>

 {/* Assisted Capture Indicator Block */}
 <div className="p-3 rounded-xl bg-theme-surface border border-theme-subtle space-y-1">
 <span className="text-[9px] uppercase font-black tracking-wider text-theme-muted flex items-center gap-1">
 <Info className="w-3 h-3 text-blue-600" />
 Captura Asistida &middot; Estado de Inventario en Destino
 </span>
 <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono pt-1">
 <div>
 <span className="text-theme-muted text-[10px] block">Inv. Actual:</span>
 <strong className="text-theme-main font-black">{currentArticleMetrics.currentStock}</strong>
 </div>
 <div>
 <span className="text-theme-muted text-[10px] block">Disponible:</span>
 <strong className="text-emerald-600 font-black">{currentArticleMetrics.availableStock}</strong>
 </div>
 <div>
 <span className="text-theme-muted text-[10px] block">En Tránsito:</span>
 <strong className="text-blue-600 font-black">{currentArticleMetrics.inTransitStock}</strong>
 </div>
 <div>
 <span className="text-theme-muted text-[10px] block">Consumo prom:</span>
 <strong className="text-purple-600 font-black">{currentArticleMetrics.monthlyConsumption} / mes</strong>
 </div>
 <div>
 <span className="text-theme-muted text-[10px] block">Cobertura est:</span>
 <strong className="text-theme-main font-black">~{currentArticleMetrics.coverageMonths} meses</strong>
 </div>
 </div>
 </div>

 {/* Quantity & Comments Form */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
 <div>
 <label className="text-[11px] font-bold text-theme-muted block mb-1">
 Cantidad requerida:
 </label>
 <input
 type="number"
 min="1"
 value={catalogQty}
 onChange={(e) => setCatalogQty(Math.max(1, parseInt(e.target.value) || 1))}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-black text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>

 <div>
 <label className="text-[11px] font-bold text-theme-muted block mb-1">
 Comentario de partida (Opcional):
 </label>
 <input
 type="text"
 value={catalogComments}
 onChange={(e) => setCatalogComments(e.target.value)}
 placeholder="Ej. Resurtido de fin de mes..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>

 <button
 type="button"
 onClick={handleAddCatalogItem}
 className="w-full py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar partida</span>
 </button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* MODE B: UNREGISTERED PRODUCT */}
 {inputMode === 'UNREGISTERED' && (
 <div className="p-4.5 rounded-3xl bg-theme-surface border border-amber-500 shadow-2xs space-y-4 text-zinc-900">
 <div className="flex items-center gap-2 text-zinc-900">
 <Sparkles className="w-4 h-4 text-amber-600" />
 <span className="text-xs font-black uppercase tracking-wider">
 Solicitud de Producto no Registrado (Homologación Pendiente)
 </span>
 </div>
 <p className="text-[11px] text-theme-muted">
 Utiliza este formulario si el producto solicitado no existe aún en el catálogo maestro. La requisición quedará marcada para revisión y homologación por el área de compras.
 </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
 <div className="sm:col-span-2 space-y-1">
 <label className="font-bold text-theme-muted">Descripción del Producto *</label>
 <input
 type="text"
 value={unregDesc}
 onChange={(e) => setUnregDesc(e.target.value)}
 placeholder="Ej. Colchón Spring Air Especial Hotelero Queen..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Marca sugerida</label>
 <input
 type="text"
 value={unregBrand}
 onChange={(e) => setUnregBrand(e.target.value)}
 placeholder="Ej. Spring Air, Nayt..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Medida / Presentación</label>
 <input
 type="text"
 value={unregSize}
 onChange={(e) => setUnregSize(e.target.value)}
 placeholder="Ej. Individual, Queen Size..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Cantidad *</label>
 <input
 type="number"
 min="1"
 value={unregQty}
 onChange={(e) => setUnregQty(Math.max(1, parseInt(e.target.value) || 1))}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-black text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Unidad</label>
 <input
 type="text"
 value={unregUnit}
 onChange={(e) => setUnregUnit(e.target.value)}
 placeholder="Ej. Colchón, Pza, Lote..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="sm:col-span-3 space-y-1">
 <label className="font-bold text-theme-muted">Especificaciones técnicas / Características especiales</label>
 <input
 type="text"
 value={unregSpecs}
 onChange={(e) => setUnregSpecs(e.target.value)}
 placeholder="Ej. Doble colchoneta memory foam con refuerzo perimetral ignífugo..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="sm:col-span-2 space-y-1">
 <label className="font-bold text-theme-muted">Comentarios / Justificación</label>
 <input
 type="text"
 value={unregComments}
 onChange={(e) => setUnregComments(e.target.value)}
 placeholder="Ej. Solicitado para proyecto hotelero..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-amber-500/30"
 />
 </div>

 <div className="flex items-end">
 <button
 type="button"
 onClick={handleAddUnregisteredItem}
 className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Agregar producto no registrado</span>
 </button>
 </div>
 </div>
 </div>
 )}

 {/* MODE C: CONSUMABLES PRESETS */}
 {inputMode === 'CONSUMABLE' && (
 <div className="p-4.5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Insumos Operativos Frecuentes de Almacén
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <button
 type="button"
 onClick={() => handleAddConsumablePreset('Rollo de Etiquetas Térmicas Zebra 100mm x 75mm (1000 stickers)', 'INS-ETIQ-ZEBRA-100X75', 'Rollo', 10)}
 className="p-3 rounded-2xl bg-theme-muted/40 hover:bg-theme-muted border border-theme-subtle text-left space-y-1 transition-all cursor-pointer"
 >
 <span className="font-mono font-bold text-[10px] text-theme-primary block">INS-ETIQ-ZEBRA</span>
 <strong className="text-xs font-bold text-theme-main block">Etiquetas Térmicas Zebra (10 rollos)</strong>
 <span className="text-[10px] text-theme-muted block">Para recepción física y stickers QR</span>
 </button>

 <button
 type="button"
 onClick={() => handleAddConsumablePreset('Cinta Canela de Empaque Industrial 48mm x 150m', 'INS-CINTA-EMPAQUE-48MM', 'Pieza', 24)}
 className="p-3 rounded-2xl bg-theme-muted/40 hover:bg-theme-muted border border-theme-subtle text-left space-y-1 transition-all cursor-pointer"
 >
 <span className="font-mono font-bold text-[10px] text-theme-primary block">INS-CINTA-48MM</span>
 <strong className="text-xs font-bold text-theme-main block">Cinta Canela de Empaque (24 pzas)</strong>
 <span className="text-[10px] text-theme-muted block">Flejado y embalaje de colchones</span>
 </button>

 <button
 type="button"
 onClick={() => handleAddConsumablePreset('Bolsa Protectora de Polietileno Calibre 400 King Size', 'INS-BOLSA-POLI-KS', 'Pieza', 50)}
 className="p-3 rounded-2xl bg-theme-muted/40 hover:bg-theme-muted border border-theme-subtle text-left space-y-1 transition-all cursor-pointer"
 >
 <span className="font-mono font-bold text-[10px] text-theme-primary block">INS-BOLSA-KS</span>
 <strong className="text-xs font-bold text-theme-main block">Bolsa Protectora King Size (50 pzas)</strong>
 <span className="text-[10px] text-theme-muted block">Protección de colchones contra polvo</span>
 </button>
 </div>
 </div>
 )}

 {/* Items List Table */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-black uppercase tracking-wider text-theme-main">
 Partidas en esta requisición ({items.length})
 </span>
 <span className="text-[11px] font-mono text-theme-muted font-bold">
 Total: {items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0)} unidades
 </span>
 </div>

 {items.length === 0 ? (
 <div className="p-8 text-center bg-theme-muted/20 border border-dashed border-theme-subtle rounded-3xl text-xs text-theme-muted space-y-1">
 <Box className="w-6 h-6 mx-auto text-theme-muted opacity-60 mb-1" />
 <p className="font-semibold text-theme-main">No hay partidas agregadas a la requisición.</p>
 <p>Utiliza el buscador superior para agregar artículos del catálogo o productos no registrados.</p>
 </div>
 ) : (
 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo</th>
 <th className="py-2.5 px-3 text-center">Cantidad</th>
 <th className="py-2.5 px-3">Unidad</th>
 <th className="py-2.5 px-3">Estado / Tipo</th>
 <th className="py-2.5 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {items.map((item, idx) => (
 <tr key={item.id || idx} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {item.sku}
 </td>
 <td className="py-2.5 px-3">
 <div className="space-y-0.5">
 <span className="font-bold text-theme-main block text-xs">{item.name}</span>
 <span className="text-[10px] text-theme-muted block">
 {item.brand} {item.size ? `&bull; ${item.size}` : ''}
 </span>
 {item.comments && (
 <span className="text-[10px] text-theme-muted italic block">
 Nota: {item.comments}
 </span>
 )}
 </div>
 </td>
 <td className="py-2.5 px-3 text-center whitespace-nowrap">
 <input
 type="number"
 min="1"
 value={item.quantity}
 onChange={(e) => {
 const val = Math.max(1, parseInt(e.target.value) || 1);
 setItems((prev) =>
 prev.map((it) => (it.id === item.id ? { ...it, quantity: val } : it))
 );
 }}
 className="w-16 bg-theme-muted border border-theme-subtle rounded-lg px-2 py-1 text-center font-mono font-bold text-xs text-theme-main focus:outline-none"
 />
 </td>
 <td className="py-2.5 px-3 text-theme-muted font-medium whitespace-nowrap">
 {item.unit}
 </td>
 <td className="py-2.5 px-3 whitespace-nowrap">
 {item.isUnregisteredProduct ? (
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
 No Registrado
 </span>
 ) : (
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
 Catálogo
 </span>
 )}
 </td>
 <td className="py-2.5 px-3 text-right whitespace-nowrap">
 <button
 type="button"
 onClick={() => handleRemoveItem(item.id)}
 className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-rose-500/10 transition-colors cursor-pointer"
 title="Eliminar partida"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>

 </div>

 {/* Footer Controls */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle w-full sm:w-auto"
 >
 Cancelar
 </button>

 <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
 <button
 type="button"
 onClick={() => handleSave('Borrador')}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold transition-colors cursor-pointer border border-theme-subtle"
 >
 Guardar borrador
 </button>

 <button
 type="button"
 onClick={() => setConfirmSendOpen(true)}
 className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>Enviar a autorización</span>
 </button>
 </div>
 </div>

 </div>
 </ModalPortal>

 {/* Duplicate Warning Modal */}
 {duplicateWarning && (
 <ModalPortal onClose={() => setDuplicateWarning(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center gap-2 text-amber-600">
 <AlertTriangle className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Artículo ya incluido</h3>
 </div>
 <p className="text-xs text-theme-muted">
 El artículo <strong>{duplicateWarning.existingItem.name}</strong> ya se encuentra en las partidas de esta requisición (actualmente con {duplicateWarning.existingItem.quantity} {duplicateWarning.existingItem.unit}).
 </p>
 <p className="text-xs text-theme-main font-semibold">
 ¿Deseas sumar las <strong>+{duplicateWarning.incomingQty}</strong> unidades a la partida existente?
 </p>
 <div className="flex items-center justify-end gap-2 text-xs pt-2">
 <button
 onClick={() => setDuplicateWarning(null)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleMergeDuplicate}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Sumar a partida (+{duplicateWarning.incomingQty})
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Confirmation Modal: Send to Authorization */}
 {confirmSendOpen && (
 <ModalPortal onClose={() => setConfirmSendOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center gap-2 text-theme-primary">
 <CheckCircle2 className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Confirmar Envío</h3>
 </div>
 <p className="text-xs text-theme-muted leading-relaxed">
 La requisición será enviada formalmente para revisión y autorización de compra con <strong>{items.length} partidas</strong>.
 </p>
 <div className="flex items-center justify-end gap-2 text-xs pt-2">
 <button
 onClick={() => setConfirmSendOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Volver a revisar
 </button>
 <button
 onClick={() => {
 setConfirmSendOpen(false);
 handleSave('Pendiente de autorización');
 }}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Confirmar y enviar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </>
 );
};
