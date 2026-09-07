import React, { useState } from 'react';
import { X, Search, CheckCircle2, PlusCircle, AlertCircle, Link2, Sparkles, Box } from 'lucide-react';
import { RequisitionItem } from '../../../data/mockRequisitionsData';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../../data/mockArticlesData';
import { ModalPortal } from '../../common/ModalPortal';

interface ProductReviewModalProps {
 item: RequisitionItem;
 onClose: () => void;
 onResolveItem: (
 itemId: string,
 action: 'LINK' | 'PREPARE_NEW',
 linkedArticle?: MasterArticle
 ) => void;
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
 item,
 onClose,
 onResolveItem,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedMatch, setSelectedMatch] = useState<MasterArticle | null>(null);

 // Filter or suggest matches from master catalog based on description and search query
 const unreg = item.unregisteredDetails;
 const matchKeywords = (unreg?.description || item.name).toLowerCase().split(' ');

 const simulatedMatches = MOCK_MASTER_ARTICLES.filter((art) => {
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 return (
 art.name.toLowerCase().includes(q) ||
 art.sku.toLowerCase().includes(q) ||
 art.brand.toLowerCase().includes(q) ||
 art.size.toLowerCase().includes(q)
 );
 }
 // Default similarity search based on brand or keywords
 const matchesBrand = unreg?.suggestedBrand && art.brand.toLowerCase().includes(unreg.suggestedBrand.toLowerCase());
 const matchesSize = unreg?.sizeOrPresentation && art.size.toLowerCase().includes(unreg.sizeOrPresentation.toLowerCase());
 return matchesBrand || matchesSize || matchKeywords.some((kw) => kw.length > 3 && art.name.toLowerCase().includes(kw));
 }).slice(0, 5);

 const handleLinkExisting = (art: MasterArticle) => {
 onResolveItem(item.id, 'LINK', art);
 onClose();
 };

 const handlePrepareAsNew = () => {
 onResolveItem(item.id, 'PREPARE_NEW');
 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-3xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[92vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500 shadow-2xs shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h2 className="text-sm font-black text-theme-main">
 Revisión de Producto no Registrado
 </h2>
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs inline-flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span>Pendiente de Homologación</span>
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Valida si este producto corresponde a un SKU existente en el catálogo o si se preparará para su alta como nuevo artículo.
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

 {/* Content */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1">
 
 {/* Card: Solicitud Original */}
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3 shadow-xs text-zinc-900">
 <span className="text-[10px] uppercase font-bold tracking-wider text-theme-muted block">
 Detalle del Producto Solicitado
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
 <div>
 <span className="text-theme-muted block text-[11px]">Descripción solicitada:</span>
 <strong className="text-theme-main block font-bold text-sm">{unreg?.description || item.name}</strong>
 </div>
 <div>
 <span className="text-theme-muted block text-[11px]">Cantidad requerida:</span>
 <strong className="text-theme-main block font-mono font-bold text-sm">{item.quantity} {item.unit}</strong>
 </div>
 <div>
 <span className="text-theme-muted block text-[11px]">Marca sugerida:</span>
 <span className="text-theme-main font-semibold">{unreg?.suggestedBrand || item.brand || 'No especificada'}</span>
 </div>
 <div>
 <span className="text-theme-muted block text-[11px]">Medida / Presentación:</span>
 <span className="text-theme-main font-semibold">{unreg?.sizeOrPresentation || item.size || 'No especificada'}</span>
 </div>
 {unreg?.specifications && (
 <div className="sm:col-span-2 pt-1 border-t border-amber-500/15">
 <span className="text-theme-muted block text-[11px]">Especificaciones técnicas:</span>
 <p className="text-theme-main text-xs italic">{unreg.specifications}</p>
 </div>
 )}
 </div>
 </div>

 {/* Section: Coincidencias sugeridas en catálogo */}
 <div className="space-y-3">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
 <div>
 <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
 Posibles Coincidencias en Catálogo Maestro
 </h3>
 <p className="text-[11px] text-theme-muted">
 Selecciona un artículo si coincide con la solicitud para evitar duplicados.
 </p>
 </div>

 {/* Search input inside modal */}
 <div className="relative w-full sm:w-64">
 <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar en catálogo..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-xl pl-8 pr-3 py-1.5 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/20"
 />
 </div>
 </div>

 {simulatedMatches.length === 0 ? (
 <div className="p-6 text-center bg-theme-muted/30 border border-theme-subtle rounded-2xl text-xs text-theme-muted">
 No se encontraron artículos similares con ese criterio de búsqueda.
 </div>
 ) : (
 <div className="space-y-2">
 {simulatedMatches.map((art, index) => {
 const similarity = Math.max(65, 92 - index * 8);
 const isSelected = selectedMatch?.id === art.id;

 return (
 <div
 key={art.id}
 onClick={() => setSelectedMatch(art)}
 className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
 isSelected
 ? 'bg-blue-500/10 border-blue-500/40 shadow-xs'
 : 'bg-theme-surface hover:bg-theme-muted/40 border-theme-subtle'
 }`}
 >
 <div className="space-y-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-mono font-bold text-xs text-theme-primary">{art.sku}</span>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-theme-muted text-theme-muted">
 {art.brand} &middot; {art.size}
 </span>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-emerald-600 shadow-2xs font-mono">
 {similarity}% coincidencia
 </span>
 </div>
 <h4 className="text-xs font-bold text-theme-main">{art.name}</h4>
 <span className="text-[11px] text-theme-muted">
 Línea: {art.category} &bull; Unidad: {art.baseUnit}
 </span>
 </div>

 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleLinkExisting(art);
 }}
 className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
 >
 <Link2 className="w-3.5 h-3.5" />
 <span>Vincular existente</span>
 </button>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
 <div className="flex items-center gap-2 text-theme-muted">
 <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
 <span>Al resolver este artículo se desbloqueará la autorización final de compra.</span>
 </div>

 <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold transition-colors cursor-pointer border border-theme-subtle"
 >
 Mantener pendiente
 </button>

 <button
 onClick={handlePrepareAsNew}
 className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
 >
 <PlusCircle className="w-4 h-4" />
 <span>Crear como nuevo (Preparar alta)</span>
 </button>
 </div>
 </div>

 </div>
 </ModalPortal>
 );
};
