import React, { useState, useMemo } from 'react';
import {
 DollarSign,
 Plus,
 Search,
 X,
 Calendar,
 Layers,
 ArrowRight,
 TrendingUp,
 TrendingDown,
 Percent,
 Copy,
 PowerOff,
 Power,
 Edit3,
 Trash2,
 CheckCircle2,
 AlertTriangle,
 FileText,
 Upload,
 ArrowLeft,
 Boxes,
 Sparkles,
 Info,
 Check,
 Building2,
 PackageCheck
} from 'lucide-react';
import {
 SupplierMaster,
 SupplierPriceList,
 PriceListItem,
 PriceListTier,
 PriceListStatus,
 PriceListCurrency,
 getSupplierActivePriceList
} from '../../../data/mockSuppliersData';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface PriceListsTabProps {
 supplier: SupplierMaster;
 onUpdateSupplier: (updated: SupplierMaster) => void;
}

export const PriceListsTab: React.FC<PriceListsTabProps> = ({
 supplier,
 onUpdateSupplier,
}) => {
 const [selectedListId, setSelectedListId] = useState<string | null>(null);

 // Filter & Search states
 const [searchQuery, setSearchQuery] = useState('');
 const [variationFilter, setVariationFilter] = useState<'ALL' | 'INCREASE' | 'DECREASE' | 'NO_CHANGE'>('ALL');

 // Sub-modal states
 const [createListModalOpen, setCreateListModalOpen] = useState(false);
 const [newListName, setNewListName] = useState('');
 const [newListCurrency, setNewListCurrency] = useState<PriceListCurrency>('MXN');
 const [newListStartDate, setNewListStartDate] = useState('01 Sep 2026');
 const [newListEndDate, setNewListEndDate] = useState('31 Dic 2026');
 const [newListStatus, setNewListStatus] = useState<PriceListStatus>('Vigente');
 const [newListDescription, setNewListDescription] = useState('');

 const [addItemModalOpen, setAddItemModalOpen] = useState(false);
 const [selectedArticleSku, setSelectedArticleSku] = useState('');
 const [newItemPrice, setNewItemPrice] = useState<number>(4850);
 const [newItemPrevPrice, setNewItemPrevPrice] = useState<number>(4790);
 const [newItemMinQty, setNewItemMinQty] = useState<number>(1);
 const [newItemNotes, setNewItemNotes] = useState('');
 const [enableTiers, setEnableTiers] = useState(false);

 const [editingItem, setEditingItem] = useState<PriceListItem | null>(null);
 const [editPrice, setEditPrice] = useState<number>(0);
 const [editPrevPrice, setEditPrevPrice] = useState<number>(0);
 const [editMinQty, setEditMinQty] = useState<number>(1);
 const [editNotes, setEditNotes] = useState('');

 const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
 const [duplicateTargetList, setDuplicateTargetList] = useState<SupplierPriceList | null>(null);
 const [duplicateName, setDuplicateName] = useState('');
 const [duplicateStartDate, setDuplicateStartDate] = useState('01 Ene 2027');
 const [duplicateEndDate, setDuplicateEndDate] = useState('31 Dic 2027');
 const [duplicateStatus, setDuplicateStatus] = useState<PriceListStatus>('Programada');

 const [importModalOpen, setImportModalOpen] = useState(false);

 const priceLists = supplier.priceLists || [];
 const selectedList = priceLists.find((pl) => pl.id === selectedListId) || null;

 // Active Price List Warning check (multiple overlapping active lists for same currency)
 const activeListsByCurrency = useMemo(() => {
 const map = new Map<string, SupplierPriceList[]>();
 priceLists.filter((pl) => pl.status === 'Vigente').forEach((pl) => {
 const arr = map.get(pl.currency) || [];
 arr.push(pl);
 map.set(pl.currency, arr);
 });
 return map;
 }, [priceLists]);

 const hasOverlappingActiveLists = Array.from(activeListsByCurrency.values()).some((arr) => arr.length > 1);

 // Available articles for this supplier that can be added to price list
 const availableArticlesToAdd = useMemo(() => {
 if (!selectedList) return [];
 const currentSkus = new Set(selectedList.items.map((it) => it.articleSku));
 return supplier.articles.filter((a) => !currentSkus.has(a.articleSku));
 }, [supplier.articles, selectedList]);

 // Filtered items in selected list
 const filteredItems = useMemo(() => {
 if (!selectedList) return [];
 return selectedList.items.filter((item) => {
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const matchSku = item.articleSku.toLowerCase().includes(q);
 const matchName = item.articleName.toLowerCase().includes(q);
 const matchSupSku = item.supplierSku.toLowerCase().includes(q);
 if (!matchSku && !matchName && !matchSupSku) return false;
 }

 const variation = item.variationPercent || 0;
 if (variationFilter === 'INCREASE' && variation <= 0) return false;
 if (variationFilter === 'DECREASE' && variation >= 0) return false;
 if (variationFilter === 'NO_CHANGE' && variation !== 0) return false;

 return true;
 });
 }, [selectedList, searchQuery, variationFilter]);

 // =========================================================================
 // HANDLERS
 // =========================================================================

 // Create New Price List
 const handleCreateList = () => {
 if (!newListName.trim()) return;

 const newList: SupplierPriceList = {
 id: `pl-${Date.now()}`,
 supplierId: supplier.id,
 name: newListName.trim(),
 currency: newListCurrency,
 startDate: newListStartDate.trim(),
 endDate: newListEndDate.trim(),
 status: newListStatus,
 description: newListDescription.trim(),
 createdAt: '27 Ago 2026',
 updatedAt: '27 Ago 2026',
 items: [],
 };

 const updatedLists = [newList, ...priceLists];
 const updatedSupplier: SupplierMaster = {
 ...supplier,
 priceLists: updatedLists,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: '27 Ago 2026 12:00',
 actor: 'Admin Demo',
 role: 'Compras',
 action: `Creó lista de precios: ${newList.name}`,
 type: 'price_list_updated',
 },
 ...supplier.timeline,
 ],
 };

 onUpdateSupplier(updatedSupplier);
 setCreateListModalOpen(false);
 setSelectedListId(newList.id);
 };

 // Duplicate Price List
 const handleConfirmDuplicate = () => {
 if (!duplicateTargetList || !duplicateName.trim()) return;

 const clonedItems: PriceListItem[] = duplicateTargetList.items.map((it) => ({
 ...it,
 id: `pli-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
 previousPrice: it.currentPrice,
 lastUpdatedAt: '27 Ago 2026',
 }));

 const duplicatedList: SupplierPriceList = {
 id: `pl-${Date.now()}`,
 supplierId: supplier.id,
 name: duplicateName.trim(),
 currency: duplicateTargetList.currency,
 startDate: duplicateStartDate.trim(),
 endDate: duplicateEndDate.trim(),
 status: duplicateStatus,
 description: `Copia duplicada a partir de ${duplicateTargetList.name}.`,
 createdAt: '27 Ago 2026',
 updatedAt: '27 Ago 2026',
 items: clonedItems,
 };

 const updatedLists = [duplicatedList, ...priceLists];
 const updatedSupplier: SupplierMaster = {
 ...supplier,
 priceLists: updatedLists,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: '27 Ago 2026 12:00',
 actor: 'Admin Demo',
 role: 'Compras',
 action: `Duplicó lista de precios ${duplicateTargetList.name} como ${duplicatedList.name}`,
 type: 'price_list_updated',
 },
 ...supplier.timeline,
 ],
 };

 onUpdateSupplier(updatedSupplier);
 setDuplicateModalOpen(false);
 setSelectedListId(duplicatedList.id);
 };

 // Toggle List Status (Deactivate / Reactivate)
 const handleToggleListStatus = (list: SupplierPriceList) => {
 const newStatus: PriceListStatus = list.status === 'Inactiva' ? 'Vigente' : 'Inactiva';
 const updatedLists = priceLists.map((pl) => (pl.id === list.id ? { ...pl, status: newStatus } : pl));

 const updatedSupplier: SupplierMaster = {
 ...supplier,
 priceLists: updatedLists,
 timeline: [
 {
 id: `t-${Date.now()}`,
 occurredAt: '27 Ago 2026 12:00',
 actor: 'Admin Demo',
 role: 'Compras',
 action: `Cambió estado de lista ${list.name} a ${newStatus}`,
 type: 'price_list_updated',
 },
 ...supplier.timeline,
 ],
 };

 onUpdateSupplier(updatedSupplier);
 };

 // Add Item to Price List
 const handleAddItemToList = () => {
 if (!selectedList || !selectedArticleSku) return;

 const articleRel = supplier.articles.find((a) => a.articleSku === selectedArticleSku);
 if (!articleRel) return;

 const variation = newItemPrevPrice
 ? +(((newItemPrice - newItemPrevPrice) / newItemPrevPrice) * 100).toFixed(2)
 : 0;

 const tiers: PriceListTier[] | undefined = enableTiers
 ? [
 { minQuantity: 1, maxQuantity: 9, unitPrice: newItemPrice },
 { minQuantity: 10, maxQuantity: 19, unitPrice: Math.round(newItemPrice * 0.97) },
 { minQuantity: 20, unitPrice: Math.round(newItemPrice * 0.95) },
 ]
 : undefined;

 const newItem: PriceListItem = {
 id: `pli-${Date.now()}`,
 articleSku: articleRel.articleSku,
 articleName: articleRel.articleName,
 supplierSku: articleRel.supplierSku,
 unit: articleRel.purchaseUnit || 'pza',
 currentPrice: newItemPrice,
 previousPrice: newItemPrevPrice,
 variationPercent: variation,
 minQuantity: newItemMinQty,
 status: 'Activo',
 tiers,
 notes: newItemNotes.trim(),
 lastUpdatedAt: '27 Ago 2026',
 };

 const updatedItems = [...selectedList.items, newItem];
 const updatedList = { ...selectedList, items: updatedItems, updatedAt: '27 Ago 2026' };
 const updatedLists = priceLists.map((pl) => (pl.id === selectedList.id ? updatedList : pl));

 onUpdateSupplier({
 ...supplier,
 priceLists: updatedLists,
 });

 setAddItemModalOpen(false);
 setSelectedArticleSku('');
 };

 // Edit Item Price in List
 const handleSaveEditItem = () => {
 if (!selectedList || !editingItem) return;

 const variation = editPrevPrice
 ? +(((editPrice - editPrevPrice) / editPrevPrice) * 100).toFixed(2)
 : 0;

 const updatedItems = selectedList.items.map((it) => {
 if (it.id !== editingItem.id) return it;
 return {
 ...it,
 currentPrice: editPrice,
 previousPrice: editPrevPrice,
 variationPercent: variation,
 minQuantity: editMinQty,
 notes: editNotes.trim(),
 lastUpdatedAt: '27 Ago 2026',
 };
 });

 const updatedList = { ...selectedList, items: updatedItems, updatedAt: '27 Ago 2026' };
 const updatedLists = priceLists.map((pl) => (pl.id === selectedList.id ? updatedList : pl));

 onUpdateSupplier({
 ...supplier,
 priceLists: updatedLists,
 });

 setEditingItem(null);
 };

 // Remove Item from Price List
 const handleRemoveItem = (itemId: string) => {
 if (!selectedList) return;
 const updatedItems = selectedList.items.filter((it) => it.id !== itemId);
 const updatedList = { ...selectedList, items: updatedItems, updatedAt: '27 Ago 2026' };
 const updatedLists = priceLists.map((pl) => (pl.id === selectedList.id ? updatedList : pl));

 onUpdateSupplier({
 ...supplier,
 priceLists: updatedLists,
 });
 };

 // =========================================================================
 // VIEW: DETAIL OF A SPECIFIC PRICE LIST
 // =========================================================================
 if (selectedList) {
 return (
 <div className="space-y-5 animate-in fade-in duration-150">
 
 {/* Navigation & Actions Topbar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs">
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
 setSelectedListId(null);
 setSearchQuery('');
 }}
 className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
 title="Volver al listado de listas"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Volver a Listas de Precios</span>
 </button>

 <div className="h-4 w-px bg-theme-subtle hidden sm:block" />

 <div className="flex items-center gap-2 flex-wrap">
 <h3 className="text-sm font-black text-theme-main">{selectedList.name}</h3>
 <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-theme-muted text-theme-main border border-theme-subtle">
 {selectedList.currency}
 </span>
 <StatusBadge
 variant={
 selectedList.status === 'Vigente'
 ? 'success'
 : selectedList.status === 'Programada'
 ? 'info'
 : selectedList.status === 'Vencida'
 ? 'warning'
 : 'neutral'
 }
 label={selectedList.status}
 size="sm"
 />
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => {
 setDuplicateTargetList(selectedList);
 setDuplicateName(`${selectedList.name} (Copia 2027)`);
 setDuplicateModalOpen(true);
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle transition-colors flex items-center gap-1.5 cursor-pointer"
 >
 <Copy className="w-3.5 h-3.5" />
 <span>Duplicar</span>
 </button>

 <button
 onClick={() => handleToggleListStatus(selectedList)}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
 selectedList.status === 'Inactiva'
 ? 'bg-white text-zinc-900 border border-emerald-600 shadow-2xs hover:bg-theme-muted'
 : 'bg-white text-zinc-900 border border-rose-500 shadow-2xs hover:bg-theme-muted'
 }`}
 >
 <Power className="w-3.5 h-3.5" />
 <span>{selectedList.status === 'Inactiva' ? 'Reactivar lista' : 'Desactivar'}</span>
 </button>

 <button
 onClick={() => {
 if (availableArticlesToAdd.length > 0) {
 setSelectedArticleSku(availableArticlesToAdd[0].articleSku);
 setNewItemPrice(availableArticlesToAdd[0].referencePrice || 4850);
 setNewItemPrevPrice(availableArticlesToAdd[0].referencePrice || 4850);
 }
 setAddItemModalOpen(true);
 }}
 className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Agregar artículo</span>
 </button>
 </div>
 </div>

 {/* Metadata Strip */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Building2 className="w-3 h-3 text-rose-600" />
 Proveedor
 </span>
 <strong className="text-xs font-bold text-theme-main block truncate">
 {supplier.tradeName}
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <Calendar className="w-3 h-3 text-blue-600" />
 Periodo de Vigencia
 </span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {selectedList.startDate} &rarr; {selectedList.endDate}
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <PackageCheck className="w-3 h-3 text-emerald-600" />
 Artículos en Lista
 </span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {selectedList.items.length} artículos configurados
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1">
 <DollarSign className="w-3 h-3 text-purple-600" />
 Moneda de Facturación
 </span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {selectedList.currency} ({selectedList.currency === 'MXN' ? 'Pesos Mexicanos' : 'Dólares Americanos'})
 </strong>
 </div>
 </div>

 {/* Search & Variation Filters */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar SKU o artículo en esta lista..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-3 text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>

 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/60 rounded-2xl border border-theme-subtle text-xs">
 {(
 [
 { id: 'ALL', label: 'Todos' },
 { id: 'INCREASE', label: 'Con aumento' },
 { id: 'DECREASE', label: 'Con disminución' },
 { id: 'NO_CHANGE', label: 'Sin cambio' },
 ] as const
 ).map((f) => (
 <button
 key={f.id}
 onClick={() => setVariationFilter(f.id)}
 className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
 variationFilter === f.id
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main'
 }`}
 >
 {f.label}
 </button>
 ))}
 </div>
 </div>

 {/* Articles Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">SKU Interno</th>
 <th className="py-3 px-3">Artículo</th>
 <th className="py-3 px-3">SKU Proveedor</th>
 <th className="py-3 px-3 text-center">Unidad</th>
 <th className="py-3 px-3 text-right">Precio Vigente</th>
 <th className="py-3 px-3 text-right">Precio Anterior</th>
 <th className="py-3 px-3 text-center">Variación</th>
 <th className="py-3 px-3 text-center">Mínimo</th>
 <th className="py-3 px-3">Escalas / Notas</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredItems.length === 0 ? (
 <tr>
 <td colSpan={11} className="py-12 text-center text-theme-muted">
 <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40 text-theme-muted" />
 <p className="font-semibold text-xs text-theme-main">No hay artículos en esta lista de precios.</p>
 <p className="text-[11px]">Haz click en &quot;Agregar artículo&quot; para vincular productos del proveedor.</p>
 </td>
 </tr>
 ) : (
 filteredItems.map((item) => {
 const varPct = item.variationPercent || 0;
 return (
 <tr key={item.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
 {item.articleSku}
 </td>
 <td className="py-3 px-3">
 <strong className="text-theme-main font-bold block text-xs">{item.articleName}</strong>
 </td>
 <td className="py-3 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {item.supplierSku || '—'}
 </td>
 <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
 {item.unit}
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 ${item.currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {selectedList.currency}
 </td>
 <td className="py-3 px-3 text-right font-mono text-theme-muted whitespace-nowrap">
 {item.previousPrice ? `$${item.previousPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '—'}
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-zinc-900 border shadow-2xs ${
 varPct > 0
 ? 'border-amber-500'
 : varPct < 0
 ? 'border-emerald-600 '
 : 'border-zinc-300 '
 }`}>
 {varPct > 0 ? `+${varPct}%` : varPct < 0 ? `${varPct}%` : '0.0%'}
 </span>
 </td>
 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {item.minQuantity} {item.unit}
 </td>
 <td className="py-3 px-3 max-w-[200px]">
 {item.tiers && item.tiers.length > 0 ? (
 <div className="text-[10px] font-mono text-theme-muted space-y-0.5">
 {item.tiers.map((t, idx) => (
 <div key={idx}>
 {t.minQuantity}{t.maxQuantity ? `-${t.maxQuantity}` : '+'} pzas: <strong>${t.unitPrice}</strong>
 </div>
 ))}
 </div>
 ) : (
 <span className="text-[11px] text-theme-muted truncate block">{item.notes || 'Precio único'}</span>
 )}
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={item.status === 'Activo' ? 'success' : 'neutral'}
 label={item.status}
 size="sm"
 />
 </td>
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => {
 setEditingItem(item);
 setEditPrice(item.currentPrice);
 setEditPrevPrice(item.previousPrice || item.currentPrice);
 setEditMinQty(item.minQuantity || 1);
 setEditNotes(item.notes || '');
 }}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
 title="Editar precio y condiciones"
 >
 <Edit3 className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => handleRemoveItem(item.id)}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-rose-500/10 text-theme-muted hover:text-rose-600 transition-colors cursor-pointer"
 title="Remover de esta lista"
 >
 <Trash2 className="w-3.5 h-3.5" />
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
 </div>

 {/* Modal: Edit Item Price */}
 {editingItem && (
 <ModalPortal onClose={() => setEditingItem(null)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <Edit3 className="w-5 h-5 text-theme-primary" />
 <h4 className="text-sm font-black text-theme-main">Editar Precio de Artículo</h4>
 </div>
 <button
 onClick={() => setEditingItem(null)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="space-y-1">
 <span className="font-mono font-bold text-xs text-rose-600">{editingItem.articleSku}</span>
 <p className="text-xs font-bold text-theme-main">{editingItem.articleName}</p>
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Precio Vigente ({selectedList.currency}):</label>
 <input
 type="number"
 value={editPrice}
 onChange={(e) => setEditPrice(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Precio Anterior:</label>
 <input
 type="number"
 value={editPrevPrice}
 onChange={(e) => setEditPrevPrice(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Cantidad Mínima de Pedido ({editingItem.unit}):</label>
 <input
 type="number"
 min="1"
 value={editMinQty}
 onChange={(e) => setEditMinQty(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Notas / Justificación:</label>
 <input
 type="text"
 value={editNotes}
 onChange={(e) => setEditNotes(e.target.value)}
 placeholder="ej. Precio pactado con descuento volumen..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none"
 />
 </div>

 <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setEditingItem(null)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleSaveEditItem}
 className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
 >
 Guardar cambios
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Modal: Add Article to Price List */}
 {addItemModalOpen && (
 <ModalPortal onClose={() => setAddItemModalOpen(false)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <Plus className="w-5 h-5 text-rose-600" />
 <h4 className="text-sm font-black text-theme-main">Agregar Artículo a Lista de Precios</h4>
 </div>
 <button
 onClick={() => setAddItemModalOpen(false)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {availableArticlesToAdd.length === 0 ? (
 <div className="p-4 rounded-2xl bg-white border border-amber-500 text-xs text-zinc-900 shadow-2xs leading-relaxed">
 Todos los artículos relacionados con este proveedor ya se encuentran en esta lista de precios. Para agregar nuevos artículos, vincúlalos primero en la pestaña <strong>Artículos</strong> del proveedor.
 </div>
 ) : (
 <>
 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Seleccionar Artículo del Proveedor:</label>
 <select
 value={selectedArticleSku}
 onChange={(e) => {
 setSelectedArticleSku(e.target.value);
 const match = supplier.articles.find((a) => a.articleSku === e.target.value);
 if (match) {
 setNewItemPrice(match.referencePrice || 4850);
 setNewItemPrevPrice(match.referencePrice || 4850);
 }
 }}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 {availableArticlesToAdd.map((art) => (
 <option key={art.articleSku} value={art.articleSku}>
 {art.articleSku} &bull; {art.articleName}
 </option>
 ))}
 </select>
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Precio Vigente ({selectedList.currency}):</label>
 <input
 type="number"
 value={newItemPrice}
 onChange={(e) => setNewItemPrice(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Precio Anterior:</label>
 <input
 type="number"
 value={newItemPrevPrice}
 onChange={(e) => setNewItemPrevPrice(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Cantidad Mínima de Pedido (pza):</label>
 <input
 type="number"
 min="1"
 value={newItemMinQty}
 onChange={(e) => setNewItemMinQty(Number(e.target.value))}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="flex items-center gap-2 pt-1 text-xs">
 <input
 type="checkbox"
 id="enableTiersCheck"
 checked={enableTiers}
 onChange={(e) => setEnableTiers(e.target.checked)}
 className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
 />
 <label htmlFor="enableTiersCheck" className="text-theme-main font-semibold cursor-pointer">
 Habilitar escalas de precio por volumen demo (1-9, 10-19, 20+ pzas)
 </label>
 </div>

 <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setAddItemModalOpen(false)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleAddItemToList}
 className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
 >
 Agregar a lista
 </button>
 </div>
 </>
 )}
 </div>
 </ModalPortal>
 )}

 </div>
 );
 }

 // =========================================================================
 // VIEW: LIST OF ALL PRICE LISTS FOR THIS SUPPLIER
 // =========================================================================
 return (
 <div className="space-y-5 animate-in fade-in duration-150">
 
 {/* Top Banner & Main Actions */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-xl bg-white text-rose-600 border border-rose-500 shadow-2xs flex items-center justify-center font-bold text-xs">
 <DollarSign className="w-4 h-4" />
 </div>
 <h3 className="text-sm font-black text-theme-main">
 Listas de Precios de {supplier.tradeName}
 </h3>
 </div>
 <p className="text-xs text-theme-muted">
 Tarifarios pactados, vigencias comerciales y escalas de precios por volumen para compras de abastecimiento.
 </p>
 </div>

 <div className="flex items-center gap-2 flex-wrap">
 <button
 type="button"
 onClick={() => setImportModalOpen(true)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
 >
 <Upload className="w-3.5 h-3.5" />
 <span>Importar lista</span>
 </button>

 <button
 type="button"
 onClick={() => {
 setNewListName(`Lista General ${supplier.tradeName} 2026`);
 setCreateListModalOpen(true);
 }}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Nueva lista de precios</span>
 </button>
 </div>
 </div>

 {/* Overlapping Active Lists Warning Banner */}
 {hasOverlappingActiveLists && (
 <div className="p-4 rounded-2xl bg-white border border-amber-500 flex items-center gap-3 text-xs text-zinc-900 shadow-2xs">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span className="leading-relaxed">
 <strong>Aviso de vigencia:</strong> Existen múltiples listas con estado <strong>Vigente</strong> para la misma moneda. Al generar una Orden de Compra, el sistema utilizará prioritariamente la lista general activa más reciente.
 </span>
 </div>
 )}

 {/* Price Lists Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Nombre de Lista</th>
 <th className="py-3 px-3 text-center">Moneda</th>
 <th className="py-3 px-3">Vigencia</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-3">Última Actualización</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {priceLists.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-12 text-center text-theme-muted">
 <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-40 text-theme-muted" />
 <p className="font-semibold text-xs text-theme-main">Este proveedor no tiene listas de precios registradas.</p>
 <p className="text-[11px]">Haz click en &quot;Nueva lista de precios&quot; para crear la primera tarifa comercial.</p>
 </td>
 </tr>
 ) : (
 priceLists.map((pl) => (
 <tr key={pl.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-4 font-bold text-theme-main">
 <div className="space-y-0.5">
 <span className="block">{pl.name}</span>
 {pl.description && (
 <span className="text-[10px] text-theme-muted font-normal block truncate max-w-[280px]">
 {pl.description}
 </span>
 )}
 </div>
 </td>

 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 <span className="px-2 py-0.5 rounded bg-theme-muted text-[11px] border border-theme-subtle">
 {pl.currency}
 </span>
 </td>

 <td className="py-3 px-3 font-mono text-[11px] text-theme-main whitespace-nowrap">
 {pl.startDate} &rarr; {pl.endDate}
 </td>

 <td className="py-3 px-3 text-center font-mono font-bold text-theme-main whitespace-nowrap">
 {pl.items.length} artículos
 </td>

 <td className="py-3 px-3 whitespace-nowrap">
 <StatusBadge
 variant={
 pl.status === 'Vigente'
 ? 'success'
 : pl.status === 'Programada'
 ? 'info'
 : pl.status === 'Vencida'
 ? 'warning'
 : 'neutral'
 }
 label={pl.status}
 size="sm"
 />
 </td>

 <td className="py-3 px-3 font-mono text-[11px] text-theme-muted whitespace-nowrap">
 {pl.updatedAt}
 </td>

 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => {
 setDuplicateTargetList(pl);
 setDuplicateName(`${pl.name} (Copia)`);
 setDuplicateModalOpen(true);
 }}
 className="p-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
 title="Duplicar lista"
 >
 <Copy className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={() => setSelectedListId(pl.id)}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-theme-subtle"
 >
 <span>Detalle</span>
 <ArrowRight className="w-3 h-3" />
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

 {/* Modal: Create New Price List */}
 {createListModalOpen && (
 <ModalPortal onClose={() => setCreateListModalOpen(false)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <Plus className="w-5 h-5 text-rose-600" />
 <h4 className="text-sm font-black text-theme-main">Nueva Lista de Precios</h4>
 </div>
 <button
 onClick={() => setCreateListModalOpen(false)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Nombre de Lista:</label>
 <input
 type="text"
 value={newListName}
 onChange={(e) => setNewListName(e.target.value)}
 placeholder="ej. Lista General 2026, Tarifario Q4..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Moneda:</label>
 <select
 value={newListCurrency}
 onChange={(e) => setNewListCurrency(e.target.value as PriceListCurrency)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="MXN">MXN (Pesos Mexicanos)</option>
 <option value="USD">USD (Dólares)</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Estado Inicial:</label>
 <select
 value={newListStatus}
 onChange={(e) => setNewListStatus(e.target.value as PriceListStatus)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Vigente">Vigente</option>
 <option value="Programada">Programada</option>
 <option value="Inactiva">Inactiva</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Fecha Inicio:</label>
 <input
 type="text"
 value={newListStartDate}
 onChange={(e) => setNewListStartDate(e.target.value)}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main focus:outline-none"
 />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Fecha Fin:</label>
 <input
 type="text"
 value={newListEndDate}
 onChange={(e) => setNewListEndDate(e.target.value)}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main focus:outline-none"
 />
 </div>
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Descripción / Notas Comerciales:</label>
 <textarea
 value={newListDescription}
 onChange={(e) => setNewListDescription(e.target.value)}
 placeholder="ej. Lista pactada según addendum de volumen semestral..."
 rows={2}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl p-2.5 text-xs text-theme-main focus:outline-none"
 />
 </div>

 <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setCreateListModalOpen(false)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleCreateList}
 className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
 >
 Crear lista de precios
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Modal: Duplicate Price List */}
 {duplicateModalOpen && duplicateTargetList && (
 <ModalPortal onClose={() => setDuplicateModalOpen(false)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <Copy className="w-5 h-5 text-theme-primary" />
 <h4 className="text-sm font-black text-theme-main">Duplicar Lista de Precios</h4>
 </div>
 <button
 onClick={() => setDuplicateModalOpen(false)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <p className="text-xs text-theme-muted">
 Se copiarán los <strong>{duplicateTargetList.items.length} artículos</strong> y precios actuales a una nueva lista para su ajuste y programación.
 </p>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Nombre de la Nueva Lista:</label>
 <input
 type="text"
 value={duplicateName}
 onChange={(e) => setDuplicateName(e.target.value)}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none"
 />
 </div>

 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Nueva Fecha Inicio:</label>
 <input
 type="text"
 value={duplicateStartDate}
 onChange={(e) => setDuplicateStartDate(e.target.value)}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main focus:outline-none"
 />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Nueva Fecha Fin:</label>
 <input
 type="text"
 value={duplicateEndDate}
 onChange={(e) => setDuplicateEndDate(e.target.value)}
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main focus:outline-none"
 />
 </div>
 </div>

 <div className="space-y-1 text-xs">
 <label className="text-[10px] font-bold text-theme-muted uppercase">Estado Inicial:</label>
 <select
 value={duplicateStatus}
 onChange={(e) => setDuplicateStatus(e.target.value as PriceListStatus)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="Programada">Programada</option>
 <option value="Vigente">Vigente</option>
 <option value="Inactiva">Inactiva</option>
 </select>
 </div>

 <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setDuplicateModalOpen(false)}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleConfirmDuplicate}
 className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
 >
 Crear copia
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Modal: Import Demo Modal */}
 {importModalOpen && (
 <ModalPortal onClose={() => setImportModalOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4">
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
 <div className="flex items-center gap-2">
 <Upload className="w-5 h-5 text-theme-primary" />
 <h4 className="text-sm font-black text-theme-main">Importar Lista de Precios</h4>
 </div>
 <button
 onClick={() => setImportModalOpen(false)}
 className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="border-2 border-dashed border-theme-subtle rounded-2xl p-6 text-center space-y-2">
 <Upload className="w-8 h-8 mx-auto text-theme-muted" />
 <p className="text-xs font-bold text-theme-main">Arrastra tu archivo Excel / CSV</p>
 <p className="text-[10px] text-theme-muted">Formatos compatibles: .xlsx, .csv (SKU, Precio, Vigencia)</p>
 </div>

 <div className="p-3.5 rounded-2xl bg-white border border-blue-500 shadow-2xs text-xs text-zinc-900">
 <Info className="w-4 h-4 inline-block mr-1.5 text-blue-600" />
 <span>Importación masiva automatizada disponible en implementación productiva.</span>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle text-xs">
 <button
 onClick={() => setImportModalOpen(false)}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
 >
 Entendido
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 </div>
 );
};
