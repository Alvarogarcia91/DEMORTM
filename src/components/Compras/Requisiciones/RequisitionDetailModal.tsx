import React, { useState, useMemo } from 'react';
import {
 X,
 Calendar,
 User,
 Building2,
 AlertTriangle,
 CheckCircle2,
 Clock,
 FileText,
 Truck,
 Edit3,
 Check,
 AlertCircle,
 XCircle,
 Sparkles,
 ArrowRight,
 History,
 ShieldCheck,
 PackageCheck,
 ShoppingCart,
 ShoppingBag,
 DollarSign,
 Boxes,
 Layers,
 CheckSquare,
 Square
} from 'lucide-react';
import {
 Requisition,
 RequisitionStatus,
 RequisitionTimelineEntry,
 RequisitionItem
} from '../../../data/mockRequisitionsData';
import { RequisitionStatusBadge } from './RequisitionStatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';
import { ProductReviewModal } from './ProductReviewModal';
import { MasterArticle } from '../../../data/mockArticlesData';
import { getMockArticlePrice, MOCK_SUPPLIERS } from '../../../data/mockPurchasesOrdersData';
import { INITIAL_MOCK_SUPPLIERS } from '../../../data/mockSuppliersData';
import { ModalPortal } from '../../common/ModalPortal';

interface RequisitionDetailModalProps {
 requisition: Requisition;
 onClose: () => void;
 onUpdateRequisition: (updated: Requisition) => void;
 onEditRequisition?: (req: Requisition) => void;
 onNavigateToPurchases?: () => void;
 onCreatePurchaseOrder?: (requisition: Requisition, selectedItemIds: string[]) => void;
}

export const RequisitionDetailModal: React.FC<RequisitionDetailModalProps> = ({
 requisition,
 onClose,
 onUpdateRequisition,
 onEditRequisition,
 onNavigateToPurchases,
 onCreatePurchaseOrder,
}) => {
 const [reviewingItem, setReviewingItem] = useState<RequisitionItem | null>(null);
 const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
 const [correctionText, setCorrectionText] = useState('');
 const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
 const [rejectionText, setRejectionText] = useState('');
 const [showAuthorizedBanner, setShowAuthorizedBanner] = useState(false);

 // Selected items for purchase order generation (default: all items selected)
 const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() =>
 requisition.items.map((i) => i.id)
 );

 const toggleSelectItem = (id: string) => {
 setSelectedItemIds((prev) =>
 prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
 );
 };

 const toggleSelectAll = () => {
 if (selectedItemIds.length === requisition.items.length) {
 setSelectedItemIds([]);
 } else {
 setSelectedItemIds(requisition.items.map((i) => i.id));
 }
 };

 const pendingUnregisteredItems = requisition.items.filter(
 (i) => i.isUnregisteredProduct && (!i.reviewStatus || i.reviewStatus === 'PENDING')
 );

 const totalUnits = requisition.items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0);

 // Calculate pricing & totals
 const itemsWithPricing = useMemo(() => {
 return requisition.items.map((it) => {
 const { unitPrice } = getMockArticlePrice(it.sku);
 const subtotal = unitPrice * it.quantity;
 return {
 ...it,
 unitPrice,
 subtotal,
 };
 });
 }, [requisition.items]);

 const estimatedTotalMxn = itemsWithPricing.reduce((sum, it) => sum + it.subtotal, 0);

 // Supplier context lookup
 const suggestedSupplierInfo = useMemo(() => {
 const supName = requisition.suggestedSupplier || 'Nayt México';
 const found = INITIAL_MOCK_SUPPLIERS.find(
 (s) =>
 s.tradeName.toLowerCase().includes(supName.toLowerCase()) ||
 s.legalName.toLowerCase().includes(supName.toLowerCase())
 ) || INITIAL_MOCK_SUPPLIERS[0];
 return found;
 }, [requisition.suggestedSupplier]);

 const coveredArticlesCount = useMemo(() => {
 if (!suggestedSupplierInfo) return requisition.items.length;
 const covered = requisition.items.filter((it) =>
 suggestedSupplierInfo.articles.some((a) => a.articleSku === it.sku)
 ).length;
 return covered > 0 ? covered : requisition.items.length;
 }, [requisition.items, suggestedSupplierInfo]);

 // Authorization Action
 const handleAuthorize = () => {
 const hasPendingReview = pendingUnregisteredItems.length > 0;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 
 const newStatus: RequisitionStatus = hasPendingReview ? 'Autorizada' : 'Lista para compra';
 
 const timelineEntry: RequisitionTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo (Gerencia)',
 role: 'Autorizador de Compras',
 action: hasPendingReview
 ? 'Autorizó la requisición (pendiente resolución de artículo no registrado).'
 : 'Autorizó la requisición. Quedó lista para emisión de compra.',
 type: 'authorized',
 };

 const updated: Requisition = {
 ...requisition,
 status: newStatus,
 timeline: [timelineEntry, ...requisition.timeline],
 };

 onUpdateRequisition(updated);
 if (!hasPendingReview) {
 setShowAuthorizedBanner(true);
 }
 };

 // Request Correction Action
 const handleConfirmCorrection = () => {
 if (!correctionText.trim()) return;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 
 const timelineEntry: RequisitionTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo (Gerencia)',
 role: 'Autorizador de Compras',
 action: 'Solicitó corrección de la requisición',
 comment: correctionText.trim(),
 type: 'correction_requested',
 };

 const updated: Requisition = {
 ...requisition,
 status: 'Requiere corrección',
 correctionReason: correctionText.trim(),
 timeline: [timelineEntry, ...requisition.timeline],
 };

 onUpdateRequisition(updated);
 setCorrectionModalOpen(false);
 };

 // Reject Action
 const handleConfirmRejection = () => {
 if (!rejectionText.trim()) return;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 
 const timelineEntry: RequisitionTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo (Gerencia)',
 role: 'Autorizador de Compras',
 action: 'Rechazó la requisición',
 comment: rejectionText.trim(),
 type: 'rejected',
 };

 const updated: Requisition = {
 ...requisition,
 status: 'Rechazada',
 rejectionReason: rejectionText.trim(),
 timeline: [timelineEntry, ...requisition.timeline],
 };

 onUpdateRequisition(updated);
 setRejectionModalOpen(false);
 };

 // Cancel Requisition Action
 const handleCancelRequisition = () => {
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 
 const timelineEntry: RequisitionTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Solicitante',
 action: 'Canceló la requisición',
 type: 'cancelled',
 };

 const updated: Requisition = {
 ...requisition,
 status: 'Cancelada',
 timeline: [timelineEntry, ...requisition.timeline],
 };

 onUpdateRequisition(updated);
 };

 // Resolve Unregistered Product
 const handleResolveItem = (
 itemId: string,
 action: 'LINK' | 'PREPARE_NEW',
 linkedArticle?: MasterArticle
 ) => {
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 
 const updatedItems = requisition.items.map((it) => {
 if (it.id !== itemId) return it;
 if (action === 'LINK' && linkedArticle) {
 return {
 ...it,
 sku: linkedArticle.sku,
 name: linkedArticle.name,
 brand: linkedArticle.brand,
 size: linkedArticle.size,
 category: linkedArticle.category,
 unit: linkedArticle.baseUnit || 'pza',
 reviewStatus: 'LINKED' as const,
 linkedArticleSku: linkedArticle.sku,
 };
 } else {
 return {
 ...it,
 reviewStatus: 'PREPARED_AS_NEW' as const,
 };
 }
 });

 const stillPending = updatedItems.filter(
 (i) => i.isUnregisteredProduct && (!i.reviewStatus || i.reviewStatus === 'PENDING')
 ).length > 0;

 const timelineEntry: RequisitionTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Revisor de Catálogo',
 action: action === 'LINK'
 ? `Vinculó producto con SKU existente: ${linkedArticle?.sku}`
 : 'Preparó producto no registrado para alta en catálogo',
 type: 'product_reviewed',
 };

 let finalStatus = requisition.status;
 if (requisition.status === 'Autorizada' && !stillPending) {
 finalStatus = 'Lista para compra';
 }

 const updated: Requisition = {
 ...requisition,
 items: updatedItems,
 hasPendingProductReview: stillPending,
 status: finalStatus,
 timeline: [timelineEntry, ...requisition.timeline],
 };

 onUpdateRequisition(updated);
 };

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5 flex-wrap">
 <h2 className="text-base font-black text-theme-main font-mono">
 Detalle de Requisición {requisition.folio}
 </h2>
 <RequisitionStatusBadge status={requisition.status} size="md" />
 <PriorityBadge priority={requisition.priority} size="md" />
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Ficha de decisión de compra para abastecimiento interno.
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

 {/* Success Banner if Authorized */}
 {showAuthorizedBanner && (
 <div className="px-6 py-3 bg-white border-b border-emerald-600 shadow-2xs flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
 <div className="flex items-center gap-2 text-zinc-900 text-xs font-bold">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>✓ Requisición autorizada exitosamente. Lista para compra.</span>
 </div>
 {onNavigateToPurchases && (
 <button
 onClick={() => {
 onClose();
 onNavigateToPurchases();
 }}
 className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
 >
 <span>Continuar a Compras</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 )}

 {/* Body Content */}
 <div className="p-6 overflow-y-auto space-y-5 flex-1">
 
 {/* ========================================================================= */}
 {/* 1. DATOS GENERALES GRID */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Building2 className="w-3 h-3 text-rose-600" />
 Destino
 </span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {requisition.targetWarehouseName}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <User className="w-3 h-3 text-theme-primary" />
 Solicitante
 </span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {requisition.requester}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Truck className="w-3 h-3 text-purple-600" />
 Proveedor Sugerido
 </span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {requisition.suggestedSupplier || 'Nayt México'}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Calendar className="w-3 h-3 text-blue-600" />
 Fecha Requerida
 </span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {requisition.requiredDate}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Clock className="w-3 h-3 text-amber-600" />
 Fecha Solicitud
 </span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {requisition.createdAt || '27 Ago 2026'}
 </strong>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* 2. RESUMEN EJECUTIVO (4 INDICADORES COMPACTOS) */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Artículos</span>
 <strong className="text-lg font-black font-mono text-theme-main block">
 {requisition.items.length}
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Unidades Solicitadas</span>
 <strong className="text-lg font-black font-mono text-rose-600 block">
 {totalUnits} <span className="text-xs font-normal text-theme-muted">pzas</span>
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Monto Estimado</span>
 <strong className="text-lg font-black font-mono text-theme-main block">
 ${estimatedTotalMxn.toLocaleString('es-MX')}{' '}
 <span className="text-xs font-normal text-theme-muted">MXN</span>
 </strong>
 </div>

 <div className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle shadow-2xs space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Cobertura Proveedor</span>
 <strong className="text-lg font-black font-mono text-emerald-600 block">
 {coveredArticlesCount} / {requisition.items.length} artículos
 </strong>
 </div>
 </div>

 {/* Generated Purchase Order Link Banner */}
 {(requisition.generatedPurchaseOrderFolio || requisition.status === 'Convertida en compra') && (
 <div className="p-4 rounded-2xl bg-white border border-purple-500 shadow-2xs flex items-center justify-between flex-wrap gap-3">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-white text-purple-600 border border-purple-500 shadow-2xs flex items-center justify-center shrink-0">
 <ShoppingCart className="w-4 h-4" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <strong className="text-xs font-bold text-theme-main">
 Orden de Compra Generada:
 </strong>
 <span className="font-mono font-bold text-xs text-zinc-900 px-2 py-0.5 rounded-full bg-white border border-purple-500 shadow-2xs">
 {requisition.generatedPurchaseOrderFolio || 'Atendida en Compras'}
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 {requisition.purchaseOrderCoverage
 ? `${requisition.purchaseOrderCoverage.coveredItems} de ${requisition.purchaseOrderCoverage.totalItems} partidas atendidas en la orden de compra.`
 : 'Esta solicitud ya cuenta con orden de compra emitida al proveedor.'}
 </p>
 </div>
 </div>

 {onNavigateToPurchases && (
 <button
 onClick={() => {
 onClose();
 onNavigateToPurchases();
 }}
 className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <span>Ver en Compras</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* 3. TABLA DE PARTIDAS ENRIQUECIDA CON SELECCIÓN */}
 {/* ========================================================================= */}
 <div className="space-y-2.5">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Partidas de la Requisición
 </h3>
 <span className="text-[11px] font-mono text-theme-muted">
 ({selectedItemIds.length} de {requisition.items.length} partidas seleccionadas)
 </span>
 </div>

 <button
 type="button"
 onClick={toggleSelectAll}
 className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
 >
 {selectedItemIds.length === requisition.items.length
 ? 'Deseleccionar todas'
 : 'Seleccionar todas'}
 </button>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3 text-center w-10">
 <input
 type="checkbox"
 checked={selectedItemIds.length === requisition.items.length}
 onChange={toggleSelectAll}
 className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 </th>
 <th className="py-2.5 px-3">SKU</th>
 <th className="py-2.5 px-3">Artículo</th>
 <th className="py-2.5 px-3 text-center">Cantidad</th>
 <th className="py-2.5 px-3 text-center">Disponible</th>
 <th className="py-2.5 px-3 text-center">En Tránsito</th>
 <th className="py-2.5 px-3 text-center">Unidad</th>
 <th className="py-2.5 px-3 text-right">Precio Ref.</th>
 <th className="py-2.5 px-3 text-right">Subtotal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {itemsWithPricing.map((item) => {
 const isSelected = selectedItemIds.includes(item.id);
 return (
 <tr
 key={item.id}
 onClick={() => toggleSelectItem(item.id)}
 className={`cursor-pointer transition-colors ${
 isSelected ? 'bg-rose-500/5 hover:bg-rose-500/10' : 'hover:bg-theme-muted/30 opacity-70'
 }`}
 >
 {/* Checkbox */}
 <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => toggleSelectItem(item.id)}
 className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 </td>

 {/* SKU */}
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {item.sku}
 </td>

 {/* Artículo */}
 <td className="py-3 px-3">
 <strong className="text-theme-main font-bold block text-xs">
 {item.name}
 </strong>
 <span className="text-[10px] text-theme-muted">
 {item.brand} &bull; {item.size}
 </span>
 </td>

 {/* Cantidad */}
 <td className="py-3 px-3 text-center font-mono font-black text-theme-main whitespace-nowrap">
 {item.quantity}
 </td>

 {/* Disponible */}
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {item.availableStock !== undefined ? item.availableStock : 8}
 </td>

 {/* En Tránsito */}
 <td className="py-3 px-3 text-center font-mono font-bold text-purple-600 whitespace-nowrap">
 {item.inTransitStock !== undefined ? item.inTransitStock : 4}
 </td>

 {/* Unidad */}
 <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
 pza
 </td>

 {/* Precio Ref */}
 <td className="py-3 px-3 text-right font-mono text-theme-muted whitespace-nowrap">
 ${item.unitPrice.toLocaleString('es-MX')}
 </td>

 {/* Subtotal */}
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 ${item.subtotal.toLocaleString('es-MX')}
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
 {/* 4. CONTEXTO DE COMPRA & OBSERVACIONES */}
 {/* ========================================================================= */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Contexto de Compra Panel */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Contexto de Compra Pactado
 </span>
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div>
 <span className="text-[10px] text-theme-muted block">Proveedor sugerido:</span>
 <strong className="text-theme-main font-bold">{suggestedSupplierInfo.tradeName}</strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Condición comercial:</span>
 <strong className="text-theme-main font-bold">
 {suggestedSupplierInfo.paymentCondition} &bull; {suggestedSupplierInfo.creditDays}d
 </strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Tiempo estimado (Lead):</span>
 <strong className="text-theme-main font-bold">{suggestedSupplierInfo.estimatedLeadDays} días</strong>
 </div>
 <div>
 <span className="text-[10px] text-theme-muted block">Cobertura de catálogo:</span>
 <strong className="text-emerald-600 font-bold">
 {coveredArticlesCount} de {requisition.items.length} partidas
 </strong>
 </div>
 </div>
 </div>

 {/* Observaciones */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted block">
 Observaciones / Justificación
 </span>
 <p className="text-xs text-theme-main italic leading-relaxed">
 {requisition.notes ? requisition.notes : 'Sin observaciones adicionales registradas.'}
 </p>
 </div>

 </div>

 {/* ========================================================================= */}
 {/* 5. TRAZABILIDAD (LÍNEA INFERIOR COMPACTA) */}
 {/* ========================================================================= */}
 <div className="p-3 rounded-xl bg-theme-muted/20 border border-theme-subtle flex items-center justify-between text-[11px] text-theme-muted font-mono flex-wrap gap-2">
 <span>Creada: <strong>{requisition.createdAt || '27 Ago 2026 · 18:42'}</strong></span>
 <span>Autorizada: <strong>27 Ago 2026 · 20:14</strong></span>
 <span>Autorizó: <strong className="text-theme-main">Admin Demo (Gerencia)</strong></span>
 </div>

 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle w-full sm:w-auto"
 >
 Cerrar
 </button>

 <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
 {/* If in approval state */}
 {requisition.status === 'Pendiente de autorización' && (
 <>
 <button
 type="button"
 onClick={() => setRejectionModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-bold border border-rose-500 shadow-2xs flex items-center gap-1.5 cursor-pointer"
 >
 <XCircle className="w-3.5 h-3.5 text-rose-600" />
 <span>Rechazar</span>
 </button>
 <button
 type="button"
 onClick={() => setCorrectionModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-white hover:bg-theme-muted text-zinc-900 font-bold border border-amber-500 shadow-2xs flex items-center gap-1.5 cursor-pointer"
 >
 <Edit3 className="w-3.5 h-3.5 text-amber-600" />
 <span>Solicitar corrección</span>
 </button>
 <button
 type="button"
 onClick={handleAuthorize}
 className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Check className="w-4 h-4" />
 <span>Autorizar requisición</span>
 </button>
 </>
 )}

 {/* If ready for purchase order creation */}
 {(requisition.status === 'Lista para compra' || onCreatePurchaseOrder) && (
 <button
 type="button"
 disabled={selectedItemIds.length === 0}
 onClick={() => {
 if (onCreatePurchaseOrder) {
 onClose();
 onCreatePurchaseOrder(requisition, selectedItemIds);
 }
 }}
 className={`px-5 py-2 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer ${
 selectedItemIds.length > 0
 ? 'bg-theme-primary hover:bg-theme-primary-hover text-white'
 : 'bg-theme-muted text-theme-muted cursor-not-allowed opacity-50'
 }`}
 >
 <ShoppingBag className="w-4 h-4" />
 <span>Crear orden de compra ({selectedItemIds.length})</span>
 </button>
 )}
 </div>
 </div>
 </div>
 </ModalPortal>
 </>
 );
};
