import React, { useState, useEffect } from 'react';
import {
 X,
 ArrowRight,
 ArrowLeft,
 CheckCircle2,
 Building2,
 Calendar,
 User,
 Truck,
 FileText,
 AlertTriangle,
 Info,
 DollarSign,
 ShieldCheck,
 Search,
 Layers,
 Sparkles,
 ShoppingBag,
 Check
} from 'lucide-react';
import { Requisition, DESTINATION_WAREHOUSES } from '../../../data/mockRequisitionsData';
import {
 PurchaseOrder,
 PurchaseOrderItem,
 SupplierInfo,
 MOCK_SUPPLIERS,
 getMockArticlePrice
} from '../../../data/mockPurchasesOrdersData';
import { ModalPortal } from '../../common/ModalPortal';

interface PurchaseOrderCreateWizardModalProps {
 requisition: Requisition;
 initialSelectedItemIds?: string[];
 onClose: () => void;
 onSuccess: (createdOrder: PurchaseOrder, updatedRequisition: Requisition) => void;
}

export const PurchaseOrderCreateWizardModal: React.FC<PurchaseOrderCreateWizardModalProps> = ({
 requisition,
 initialSelectedItemIds,
 onClose,
 onSuccess,
}) => {
 const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

 // STEP 2: Supplier Selection
 const [supplierSearch, setSupplierSearch] = useState('');
 const [selectedSupplier, setSelectedSupplier] = useState<SupplierInfo | null>(() => {
 if (requisition.suggestedSupplier) {
 const match = MOCK_SUPPLIERS.find(
 (s) =>
 s.tradeName.toLowerCase().includes(requisition.suggestedSupplier!.toLowerCase()) ||
 s.name.toLowerCase().includes(requisition.suggestedSupplier!.toLowerCase())
 );
 if (match) return match;
 }
 return MOCK_SUPPLIERS[0]; // Default to Nayt
 });

 // STEP 3: Items Table Configuration
 interface EditableItemState extends PurchaseOrderItem {
 selectedForOrder: boolean;
 quantityWarning?: string;
 }

 const [orderItems, setOrderItems] = useState<EditableItemState[]>(() => {
 return requisition.items.map((it) => {
 const { unitPrice, lastPrice } = getMockArticlePrice(it.sku, selectedSupplier?.id);
 const isSelected = initialSelectedItemIds ? initialSelectedItemIds.includes(it.id) : true;
 return {
 id: `poi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
 sku: it.sku,
 name: it.name,
 brand: it.brand || 'Impresos RTM',
 size: it.size || 'Individual',
 requestedQuantity: it.quantity,
 orderedQuantity: it.quantity,
 receivedQuantity: 0,
 pendingQuantity: it.quantity,
 unit: it.unit || 'pza',
 unitPrice,
 lastPrice,
 subtotal: unitPrice * it.quantity,
 selectedForOrder: isSelected,
 };
 });
 });

 // Global Discount %
 const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);

 // STEP 4: Delivery & Commercial Conditions
 const [targetWarehouseId, setTargetWarehouseId] = useState(
 requisition.targetWarehouseId || 'wh-mty-norte'
 );
 
 // Calculate default delivery date based on current supplier lead time
 const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(() => {
 const lead = selectedSupplier?.leadTimeDays || 4;
 return `${27 + lead > 31 ? (27 + lead) - 31 : 27 + lead} ${27 + lead > 31 ? 'Sep' : 'Ago'} 2026`;
 });

 const [paymentCondition, setPaymentCondition] = useState<
 'Crédito' | 'Contado' | 'Contra entrega' | 'Anticipo' | 'Otra'
 >(selectedSupplier?.paymentCondition || 'Crédito');
 const [creditDays, setCreditDays] = useState<number>(
 selectedSupplier?.creditDays || 30
 );
 const [notes, setNotes] = useState('');

 // Update expected date & conditions when supplier changes
 useEffect(() => {
 if (selectedSupplier) {
 const lead = selectedSupplier.leadTimeDays;
 const day = 27 + lead;
 setExpectedDeliveryDate(`${day > 31 ? day - 31 : day} ${day > 31 ? 'Sep' : 'Ago'} 2026`);
 setPaymentCondition(selectedSupplier.paymentCondition);
 setCreditDays(selectedSupplier.creditDays);

 // Re-sync unit prices with selected supplier reference pricing
 setOrderItems((prev) =>
 prev.map((item) => {
 const { unitPrice, lastPrice } = getMockArticlePrice(item.sku, selectedSupplier.id);
 return {
 ...item,
 unitPrice,
 lastPrice,
 subtotal: unitPrice * item.orderedQuantity,
 };
 })
 );
 }
 }, [selectedSupplier]);

 // Recalculate Subtotal, Tax and Total
 const selectedItems = orderItems.filter((i) => i.selectedForOrder);
 const rawSubtotal = selectedItems.reduce((acc, i) => acc + (i.orderedQuantity * i.unitPrice), 0);
 const discountAmount = (rawSubtotal * (globalDiscountPercent || 0)) / 100;
 const subtotal = Math.max(0, rawSubtotal - discountAmount);
 const tax = Math.round(subtotal * 0.16); // 16% IVA
 const total = subtotal + tax;

 // Destination Warehouse Object
 const selectedWarehouse = DESTINATION_WAREHOUSES.find((w) => w.id === targetWarehouseId);
 const isCedisDestination = selectedWarehouse?.type === 'CEDIS';

 // Check supplier-item brand compatibility
 const unmatchingBrands = selectedSupplier
 ? selectedItems.filter(
 (it) =>
 !selectedSupplier.associatedBrands.some((b) =>
 it.brand.toLowerCase().includes(b.toLowerCase())
 )
 )
 : [];

 // Filtered suppliers list
 const filteredSuppliers = MOCK_SUPPLIERS.filter((s) => {
 if (!supplierSearch.trim()) return true;
 const q = supplierSearch.toLowerCase();
 return (
 s.name.toLowerCase().includes(q) ||
 s.tradeName.toLowerCase().includes(q) ||
 s.rfc.toLowerCase().includes(q) ||
 s.associatedBrands.some((b) => b.toLowerCase().includes(q))
 );
 });

 // Handle Item Quantity & Price Changes
 const handleItemQuantityChange = (itemId: string, newQty: number) => {
 setOrderItems((prev) =>
 prev.map((item) => {
 if (item.id !== itemId) return item;
 const validQty = Math.max(1, newQty);
 let warning: string | undefined;
 if (validQty !== item.requestedQuantity) {
 warning = `La cantidad (${validQty}) difiere de la requisición original (${item.requestedQuantity}).`;
 }
 return {
 ...item,
 orderedQuantity: validQty,
 pendingQuantity: validQty,
 subtotal: validQty * item.unitPrice,
 quantityWarning: warning,
 };
 })
 );
 };

 const handleItemPriceChange = (itemId: string, newPrice: number) => {
 setOrderItems((prev) =>
 prev.map((item) => {
 if (item.id !== itemId) return item;
 const validPrice = Math.max(0, newPrice);
 return {
 ...item,
 unitPrice: validPrice,
 subtotal: item.orderedQuantity * validPrice,
 };
 })
 );
 };

 // Final Action: Generate Purchase Order
 const handleGeneratePurchaseOrder = () => {
 if (!selectedSupplier || selectedItems.length === 0) return;

 const folioNumber = Math.floor(84 + Math.random() * 40);
 const folio = `OC-2026-00${folioNumber}`;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 const newOrder: PurchaseOrder = {
 id: `oc-${Date.now()}`,
 folio,
 supplierId: selectedSupplier.id,
 supplierName: selectedSupplier.name,
 supplierTradeName: selectedSupplier.tradeName,
 supplierRfc: selectedSupplier.rfc,
 contactName: selectedSupplier.contactName,
 targetWarehouseId,
 targetWarehouseName: selectedWarehouse?.name || 'Almacén Principal RTM',
 targetWarehouseType: selectedWarehouse?.type || 'CEDIS',
 emissionDate: '27 Ago 2026',
 expectedDeliveryDate,
 requisitionFolio: requisition.folio,
 requisitionId: requisition.id,
 paymentCondition,
 creditDays,
 currency: 'MXN',
 subtotal,
 tax,
 total,
 status: 'Borrador',
 createdAt: '2026-08-27T10:00:00Z',
 updatedAt: '2026-08-27T10:00:00Z',
 notes: notes.trim() || undefined,
 items: selectedItems.map((it) => ({
 id: it.id,
 sku: it.sku,
 name: it.name,
 brand: it.brand,
 size: it.size,
 requestedQuantity: it.requestedQuantity,
 orderedQuantity: it.orderedQuantity,
 receivedQuantity: 0,
 pendingQuantity: it.orderedQuantity,
 unit: it.unit,
 unitPrice: it.unitPrice,
 lastPrice: it.lastPrice,
 subtotal: it.subtotal,
 })),
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: `Generó la Orden de Compra ${folio} a partir de ${requisition.folio}`,
 type: 'created',
 },
 ],
 };

 // Update originating requisition
 const isFullCoverage = selectedItems.length >= requisition.items.length;
 const updatedReqTimeline = [
 {
 id: `t-req-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: isFullCoverage
 ? `Convertida en Orden de Compra ${folio} (${selectedItems.length} partidas)`
 : `Atención parcial en Orden de Compra ${folio} (${selectedItems.length} de ${requisition.items.length} partidas)`,
 type: 'purchased' as const,
 },
 ...requisition.timeline,
 ];

 const updatedRequisition: Requisition = {
 ...requisition,
 status: isFullCoverage ? 'Convertida en compra' : 'Lista para compra',
 generatedPurchaseOrderFolio: folio,
 purchaseOrderCoverage: {
 coveredItems: selectedItems.length,
 totalItems: requisition.items.length,
 purchaseOrderFolios: [folio],
 },
 items: requisition.items.map((it) => {
 const matchingOrdered = selectedItems.find((so) => so.sku === it.sku);
 if (matchingOrdered) {
 return {
 ...it,
 orderedInPurchaseOrder: true,
 purchaseOrderFolio: folio,
 };
 }
 return it;
 }),
 timeline: updatedReqTimeline,
 };

 onSuccess(newOrder, updatedRequisition);
 };

 const stepsList = [
 { num: 1, label: 'Origen' },
 { num: 2, label: 'Proveedor' },
 { num: 3, label: 'Partidas' },
 { num: 4, label: 'Entrega' },
 { num: 5, label: 'Resumen' },
 ];

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-5xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <ShoppingBag className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5">
 <h2 className="text-base font-black text-theme-main">
 Crear Orden de Compra
 </h2>
 <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-theme-primary-light text-theme-primary border border-theme-primary/25">
 Desde {requisition.folio}
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Genera la orden formal de compra para abastecimiento de Impresos RTM.
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

 {/* Stepper Bar */}
 <div className="px-6 py-3 bg-theme-muted/30 border-b border-theme-subtle flex items-center justify-between overflow-x-auto gap-2">
 {stepsList.map((step, idx) => {
 const isCurrent = currentStep === step.num;
 const isCompleted = currentStep > step.num;

 return (
 <React.Fragment key={step.num}>
 <button
 type="button"
 onClick={() => {
 if (isCompleted) setCurrentStep(step.num as any);
 }}
 className={`flex items-center gap-2 text-xs font-bold transition-all ${
 isCurrent
 ? 'text-theme-primary font-black'
 : isCompleted
 ? 'text-theme-main hover:text-theme-primary cursor-pointer'
 : 'text-theme-muted opacity-50 cursor-not-allowed'
 }`}
 >
 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
 isCurrent
 ? 'bg-theme-primary text-white shadow-xs'
 : isCompleted
 ? 'bg-emerald-600 text-white'
 : 'bg-theme-muted text-theme-muted'
 }`}>
 {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.num}
 </span>
 <span className="whitespace-nowrap">{step.label}</span>
 </button>
 {idx < stepsList.length - 1 && (
 <div className={`flex-1 h-0.5 mx-2 min-w-[20px] rounded ${
 currentStep > step.num ? 'bg-emerald-600' : 'bg-theme-subtle'
 }`} />
 )}
 </React.Fragment>
 );
 })}
 </div>

 {/* Body Content by Step */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1">
 
 {/* ========================================================================= */}
 {/* PASO 1: ORIGEN / REQUISICIÓN */}
 {/* ========================================================================= */}
 {currentStep === 1 && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="space-y-1">
 <h3 className="text-sm font-black text-theme-main">
 Paso 1: Requisición de Origen
 </h3>
 <p className="text-xs text-theme-muted">
 Valida los datos generales y partidas solicitadas en la requisición autorizada.
 </p>
 </div>

 {/* Requisition Card */}
 <div className="p-5 rounded-3xl bg-theme-muted/30 border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="flex items-center gap-2">
 <span className="font-mono font-black text-sm text-theme-primary">
 {requisition.folio}
 </span>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 Lista para compra
 </span>
 </div>
 <span className="text-xs font-mono text-theme-muted">
 Creada: {requisition.createdAt}
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Building2 className="w-3 h-3 text-theme-primary" />
 Destino Solicitado
 </span>
 <strong className="text-theme-main font-bold block">{requisition.targetWarehouseName}</strong>
 </div>

 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <User className="w-3 h-3 text-blue-600" />
 Solicitante
 </span>
 <strong className="text-theme-main font-bold block">{requisition.requester}</strong>
 </div>

 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Calendar className="w-3 h-3 text-purple-600" />
 Fecha Requerida
 </span>
 <strong className="text-theme-main font-mono font-bold block">{requisition.requiredDate}</strong>
 </div>

 <div className="space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <AlertTriangle className="w-3 h-3 text-amber-600" />
 Prioridad
 </span>
 <strong className="text-theme-main font-bold block">{requisition.priority}</strong>
 </div>
 </div>

 {requisition.suggestedSupplier && (
 <div className="pt-2 border-t border-theme-subtle text-xs flex items-center gap-2">
 <Truck className="w-3.5 h-3.5 text-theme-primary" />
 <span className="text-theme-muted">Proveedor sugerido:</span>
 <strong className="text-theme-main font-bold">{requisition.suggestedSupplier}</strong>
 </div>
 )}
 </div>

 {/* Items Table Preview */}
 <div className="space-y-2">
 <span className="text-[11px] font-black uppercase tracking-wider text-theme-main">
 Partidas a Convertir ({requisition.items.length})
 </span>
 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo</th>
 <th className="py-2.5 px-3 text-center">Cantidad</th>
 <th className="py-2.5 px-3">Unidad</th>
 <th className="py-2.5 px-3">Marca / Medida</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {requisition.items.map((item) => (
 <tr key={item.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-2.5 px-3 font-mono font-bold text-theme-primary">{item.sku}</td>
 <td className="py-2.5 px-3 font-bold text-theme-main">{item.name}</td>
 <td className="py-2.5 px-3 text-center font-mono font-bold">{item.quantity}</td>
 <td className="py-2.5 px-3 text-theme-muted">{item.unit}</td>
 <td className="py-2.5 px-3 text-theme-muted">{item.brand} &bull; {item.size}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 2: SELECCIÓN DE PROVEEDOR */}
 {/* ========================================================================= */}
 {currentStep === 2 && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="space-y-1">
 <h3 className="text-sm font-black text-theme-main">
 Paso 2: Confirmación de Proveedor
 </h3>
 <p className="text-xs text-theme-muted">
 Selecciona el proveedor con el cual se emitirá la orden de compra y condiciones comerciales.
 </p>
 </div>

 {/* Search Supplier */}
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
 <input
 type="text"
 value={supplierSearch}
 onChange={(e) => setSupplierSearch(e.target.value)}
 placeholder="Buscar por nombre comercial, razón social, RFC o marca asociada..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-10 pr-4 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>

 {/* Suppliers Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {filteredSuppliers.map((sup) => {
 const isSelected = selectedSupplier?.id === sup.id;
 const matchesRequisition = requisition.suggestedSupplier &&
 (sup.tradeName.toLowerCase().includes(requisition.suggestedSupplier.toLowerCase()) ||
 sup.name.toLowerCase().includes(requisition.suggestedSupplier.toLowerCase()));

 return (
 <div
 key={sup.id}
 onClick={() => setSelectedSupplier(sup)}
 className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
 isSelected
 ? 'bg-white border-2 border-theme-primary shadow-xs'
 : 'bg-white hover:bg-theme-muted/40 border border-theme-subtle'
 }`}
 >
 <div className="space-y-1.5">
 <div className="flex items-center justify-between">
 <strong className="text-xs font-bold text-theme-main">{sup.tradeName}</strong>
 {matchesRequisition && (
 <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-zinc-900 border border-purple-500 shadow-2xs">
 Sugerido en REQ
 </span>
 )}
 </div>
 <p className="text-[11px] text-theme-muted">{sup.name}</p>
 <span className="font-mono text-[10px] text-theme-muted block">RFC: {sup.rfc}</span>
 </div>

 <div className="pt-2 border-t border-theme-subtle text-[10px] space-y-1 text-theme-muted">
 <div className="flex justify-between">
 <span>Entrega estimada:</span>
 <strong className="text-theme-main font-mono">{sup.leadTimeDays} días</strong>
 </div>
 <div className="flex justify-between">
 <span>Condición de pago:</span>
 <strong className="text-theme-main">{sup.paymentCondition} ({sup.creditDays}d)</strong>
 </div>
 <div className="flex justify-between">
 <span>Contacto:</span>
 <span className="text-theme-main truncate">{sup.contactName}</span>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Brand Association Warning / Notice */}
 {unmatchingBrands.length > 0 && selectedSupplier && (
 <div className="p-4 rounded-2xl bg-theme-surface border border-amber-500 shadow-2xs flex items-start gap-2.5 text-xs text-zinc-900">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
 <div className="space-y-0.5">
 <strong className="text-zinc-900">Aviso de compatibilidad de marca:</strong>
 <p className="text-theme-muted leading-relaxed">
 El proveedor seleccionado <strong>{selectedSupplier.tradeName}</strong> no tiene registrada relación directa con {unmatchingBrands.length} de los artículos seleccionados ({unmatchingBrands.map((i) => i.brand).join(', ')}). Puedes continuar si se trata de un distribuidor autorizado.
 </p>
 </div>
 </div>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 3: DEFINICIÓN DE PARTIDAS, PRECIOS Y CANTIDADES */}
 {/* ========================================================================= */}
 {currentStep === 3 && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="space-y-1">
 <h3 className="text-sm font-black text-theme-main">
 Paso 3: Cantidades y Precios de Compra
 </h3>
 <p className="text-xs text-theme-muted">
 Ajusta cantidades a ordenar, precios unitarios pactados con el proveedor y valida los subtotales.
 </p>
 </div>

 {/* Items Editable Table */}
 <div className="border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3 text-center">Incluir</th>
 <th className="py-2.5 px-3">SKU / Artículo</th>
 <th className="py-2.5 px-3 text-center">Cant. Solicitada</th>
 <th className="py-2.5 px-3 text-center">Cant. a Comprar</th>
 <th className="py-2.5 px-3">Precio Unitario</th>
 <th className="py-2.5 px-3">Último Precio</th>
 <th className="py-2.5 px-3 text-right">Subtotal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {orderItems.map((item) => {
 const priceDiff = item.unitPrice - item.lastPrice;
 const priceVarPercent = item.lastPrice > 0 ? ((priceDiff / item.lastPrice) * 100).toFixed(1) : '0.0';

 return (
 <tr key={item.id} className={`hover:bg-theme-muted/30 transition-colors ${
 !item.selectedForOrder ? 'opacity-40 bg-theme-muted/20' : ''
 }`}>
 {/* Checkbox */}
 <td className="py-3 px-3 text-center">
 <input
 type="checkbox"
 checked={item.selectedForOrder}
 onChange={(e) => {
 setOrderItems((prev) =>
 prev.map((it) =>
 it.id === item.id ? { ...it, selectedForOrder: e.target.checked } : it
 )
 );
 }}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 </td>

 {/* SKU / Articulo */}
 <td className="py-3 px-3">
 <div className="space-y-0.5">
 <div className="flex items-center gap-1.5">
 <span className="font-mono font-bold text-theme-primary">{item.sku}</span>
 <span className="text-[10px] text-theme-muted">({item.brand} &bull; {item.size})</span>
 </div>
 <span className="font-bold text-theme-main block text-xs">{item.name}</span>
 {item.quantityWarning && item.selectedForOrder && (
 <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1 pt-0.5">
 <AlertTriangle className="w-3 h-3" />
 {item.quantityWarning}
 </span>
 )}
 </div>
 </td>

 {/* Cantidad solicitada */}
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-muted">
 {item.requestedQuantity} {item.unit}
 </td>

 {/* Cantidad a comprar */}
 <td className="py-3 px-3 text-center">
 <input
 type="number"
 min="1"
 disabled={!item.selectedForOrder}
 value={item.orderedQuantity}
 onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 1)}
 className="w-16 bg-theme-muted/60 border border-theme-subtle rounded-xl px-2 py-1 text-center font-mono font-black text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </td>

 {/* Precio unitario */}
 <td className="py-3 px-3">
 <div className="space-y-0.5">
 <div className="flex items-center gap-1">
 <span className="text-theme-muted font-mono">$</span>
 <input
 type="number"
 min="0"
 step="50"
 disabled={!item.selectedForOrder}
 value={item.unitPrice}
 onChange={(e) => handleItemPriceChange(item.id, parseFloat(e.target.value) || 0)}
 className="w-24 bg-theme-muted/60 border border-theme-subtle rounded-xl px-2 py-1 font-mono font-bold text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>
 {(() => {
 const pInfo = getMockArticlePrice(item.sku, selectedSupplier?.id);
 if (pInfo.hasActivePriceList && pInfo.priceListName) {
 return (
 <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-medium block truncate max-w-[130px]" title={pInfo.priceListName}>
 Lista: {pInfo.priceListName}
 </span>
 );
 }
 return (
 <span className="text-[9px] text-amber-700 dark:text-amber-300 font-medium block">
 ⚠️ Sin precio vigente
 </span>
 );
 })()}
 </div>
 </td>

 {/* Ultimo precio & variacion */}
 <td className="py-3 px-3 whitespace-nowrap">
 <div className="space-y-0.5 text-[11px] font-mono">
 <span className="text-theme-muted block">${item.lastPrice.toLocaleString('es-MX')}</span>
 <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full inline-block bg-white text-zinc-900 border shadow-2xs ${
 +priceVarPercent > 0
 ? 'border-amber-500'
 : +priceVarPercent < 0
 ? 'border-emerald-600 '
 : 'border-zinc-300 '
 }`}>
 {+priceVarPercent > 0 ? `+${priceVarPercent}%` : `${priceVarPercent}%`}
 </span>
 </div>
 </td>

 {/* Subtotal */}
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 ${(item.orderedQuantity * item.unitPrice).toLocaleString('es-MX')}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* Totals Summary Box */}
 <div className="p-4.5 rounded-3xl bg-theme-muted/40 border border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="space-y-1 text-xs text-theme-muted">
 <span className="font-bold text-theme-main block">Moneda de compra: MXN (Pesos Mexicanos)</span>
 <span>{selectedItems.length} partidas seleccionadas para esta Orden de Compra.</span>
 </div>

 <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
 <div className="flex justify-between text-theme-muted">
 <span>Subtotal:</span>
 <strong className="text-theme-main">${subtotal.toLocaleString('es-MX')}</strong>
 </div>
 <div className="flex justify-between text-theme-muted">
 <span>IVA (16%):</span>
 <strong className="text-theme-main">${tax.toLocaleString('es-MX')}</strong>
 </div>
 <div className="flex justify-between text-sm font-black text-theme-main pt-1.5 border-t border-theme-subtle">
 <span>Total:</span>
 <strong className="text-theme-primary font-extrabold text-base">${total.toLocaleString('es-MX')} MXN</strong>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 4: ENTREGA & CONDICIONES COMERCIALES */}
 {/* ========================================================================= */}
 {currentStep === 4 && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="space-y-1">
 <h3 className="text-sm font-black text-theme-main">
 Paso 4: Destino de Entrega & Condiciones
 </h3>
 <p className="text-xs text-theme-muted">
 Define el almacén de recepción, fecha esperada de arribo y términos pactados.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Destino Selector */}
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-theme-muted flex items-center gap-1.5">
 <Building2 className="w-3.5 h-3.5 text-theme-primary" />
 Almacén Destino de Entrega:
 </label>
 <select
 value={targetWarehouseId}
 onChange={(e) => setTargetWarehouseId(e.target.value)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl px-3.5 py-2.5 text-xs font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30 cursor-pointer"
 >
 {DESTINATION_WAREHOUSES.map((wh) => (
 <option key={wh.id} value={wh.id}>
 {wh.name} ({wh.type})
 </option>
 ))}
 </select>

 {/* Operational Receipt Routing Logic */}
 <div className={`p-3.5 rounded-2xl border text-xs mt-2 space-y-1 bg-white shadow-2xs ${
 isCedisDestination
 ? 'border-emerald-600/40 /50 text-zinc-900'
 : 'border-blue-600/40 /50 text-zinc-900'
 }`}>
 {isCedisDestination ? (
 <>
 <strong className="block font-bold text-emerald-800 dark:text-emerald-300">✓ Enrutamiento a Mesa de Verificación (CEDIS)</strong>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
 Esta orden se registrará automáticamente en <strong>Mesa de Verificación &gt; Entradas</strong> para escaneo y serialización al arribo del camión.
 </p>
 </>
 ) : (
 <>
 <strong className="block font-bold text-blue-800 dark:text-blue-300">ℹ Entrega Directa a Sucursal</strong>
 <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
 El proveedor entregará directamente en piso de venta / sucursal. No se enruta a través de la Mesa de Verificación de los CEDIS.
 </p>
 </>
 )}
 </div>
 </div>

 {/* Fecha Esperada */}
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-theme-muted flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5 text-purple-600" />
 Fecha Esperada de Entrega:
 </label>
 <input
 type="text"
 value={expectedDeliveryDate}
 onChange={(e) => setExpectedDeliveryDate(e.target.value)}
 placeholder="Ej. 31 Ago 2026"
 className="w-full bg-theme-surface border border-theme-subtle rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 <span className="text-[10px] text-theme-muted block">
 Calculada automáticamente con base en el tiempo estimado del proveedor ({selectedSupplier?.leadTimeDays} días).
 </span>
 </div>
 </div>

 {/* Commercial Conditions */}
 <div className="p-5 rounded-3xl bg-theme-muted/30 border border-theme-subtle space-y-3">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Condiciones Comerciales Pactadas
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-theme-muted font-semibold">Condición de Pago</label>
 <select
 value={paymentCondition}
 onChange={(e) => setPaymentCondition(e.target.value as any)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="Crédito">Crédito Comercial</option>
 <option value="Contado">Contado</option>
 <option value="Contra entrega">Contra entrega</option>
 <option value="Anticipo">Anticipo</option>
 <option value="Otra">Otra</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-theme-muted font-semibold">Días de Crédito</label>
 <input
 type="number"
 value={creditDays}
 onChange={(e) => setCreditDays(parseInt(e.target.value) || 0)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main"
 />
 </div>

 <div className="space-y-1">
 <label className="text-theme-muted font-semibold">Contacto del Proveedor</label>
 <input
 type="text"
 readOnly
 value={selectedSupplier?.contactName || 'No especificado'}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main opacity-80 cursor-not-allowed"
 />
 </div>
 </div>

 <div className="space-y-1 pt-2 border-t border-theme-subtle">
 <label className="text-xs font-semibold text-theme-muted">Instrucciones Especiales / Notas:</label>
 <input
 type="text"
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Ej. Cargar en tarimas de 10 colchones con plástico protector..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
 />
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* PASO 5: RESUMEN Y GENERACIÓN FINAL */}
 {/* ========================================================================= */}
 {currentStep === 5 && (
 <div className="space-y-6 animate-in fade-in duration-150">
 <div className="space-y-1">
 <h3 className="text-sm font-black text-theme-main">
 Paso 5: Resumen y Emisión de Orden de Compra
 </h3>
 <p className="text-xs text-theme-muted">
 Revisa los datos finales antes de generar el folio de Orden de Compra.
 </p>
 </div>

 {/* Summary Cards Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 text-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Proveedor</span>
 <strong className="text-theme-main font-bold block">{selectedSupplier?.tradeName}</strong>
 <span className="text-[10px] font-mono text-theme-muted block">{selectedSupplier?.rfc}</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 text-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Destino de Entrega</span>
 <strong className="text-theme-main font-bold block">{selectedWarehouse?.name}</strong>
 <span className="text-[10px] text-theme-muted block">({selectedWarehouse?.type})</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-1 text-xs">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Fecha Promesa</span>
 <strong className="text-theme-main font-mono font-bold block">{expectedDeliveryDate}</strong>
 <span className="text-[10px] text-theme-muted block">Condición: {paymentCondition} ({creditDays}d)</span>
 </div>

 <div className="p-4 rounded-2xl bg-theme-primary-light border border-theme-primary/25 space-y-1 text-xs">
 <span className="text-[10px] uppercase font-black text-theme-primary">Total a Comprar</span>
 <strong className="text-theme-primary font-mono font-black text-base block">
 ${total.toLocaleString('es-MX')} MXN
 </strong>
 <span className="text-[10px] text-theme-muted block">
 {selectedItems.reduce((acc, i) => acc + i.orderedQuantity, 0)} unidades en {selectedItems.length} partidas
 </span>
 </div>
 </div>

 {/* Items List in Summary */}
 <div className="space-y-2">
 <span className="text-[11px] font-black uppercase tracking-wider text-theme-main">
 Partidas de la Orden
 </span>
 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo</th>
 <th className="py-2.5 px-3 text-center">Cantidad</th>
 <th className="py-2.5 px-3">Precio Unitario</th>
 <th className="py-2.5 px-3 text-right">Subtotal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {selectedItems.map((it) => (
 <tr key={it.id}>
 <td className="py-2 px-3 font-mono font-bold text-theme-primary">{it.sku}</td>
 <td className="py-2 px-3 font-bold text-theme-main">{it.name}</td>
 <td className="py-2 px-3 text-center font-mono font-bold">{it.orderedQuantity} {it.unit}</td>
 <td className="py-2 px-3 font-mono">${it.unitPrice.toLocaleString('es-MX')}</td>
 <td className="py-2 px-3 text-right font-mono font-bold">${(it.orderedQuantity * it.unitPrice).toLocaleString('es-MX')}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 </div>

 {/* Footer Navigation */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 {currentStep > 1 ? (
 <button
 type="button"
 onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle flex items-center gap-1.5"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Anterior</span>
 </button>
 ) : (
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Cancelar
 </button>
 )}

 <div className="flex items-center gap-2">
 {currentStep < 5 ? (
 <button
 type="button"
 onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
 disabled={currentStep === 2 && !selectedSupplier}
 className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 <span>Continuar</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 type="button"
 onClick={handleGeneratePurchaseOrder}
 className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>Generar Orden de Compra</span>
 </button>
 )}
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};
