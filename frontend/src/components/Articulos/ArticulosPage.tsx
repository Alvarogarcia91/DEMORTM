import React, { useState } from 'react';
import { 
 Package, 
 FolderTree, 
 Plus, 
 Search, 
 Filter, 
 Edit2, 
 Power, 
 CheckCircle2, 
 ExternalLink,
 ChevronLeft,
 ChevronRight,
 SlidersHorizontal,
 RotateCcw
} from 'lucide-react';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../data/mockArticlesData';
import { ArticuloDetailView } from './ArticuloDetailView';
import { ArticuloFormModal } from './ArticuloFormModal';
import { ClasificacionTab } from './ClasificacionTab';
import { SemanticBadge } from '../common/SemanticBadge';

export const ArticulosPage: React.FC = () => {
 const [activeTab, setActiveTab] = useState<'articles' | 'classification'>('articles');
 
 // Articles Data State
 const [articles, setArticles] = useState<MasterArticle[]>(MOCK_MASTER_ARTICLES);
 const [selectedArticle, setSelectedArticle] = useState<MasterArticle | null>(null);

 // Filters State
 const [searchTerm, setSearchTerm] = useState('');
 const [filterCategory, setFilterCategory] = useState<string>('all');
 const [filterBrand, setFilterBrand] = useState<string>('all');
 const [filterSize, setFilterSize] = useState<string>('all');
 const [filterActive, setFilterActive] = useState<string>('all');

 // Modals & Toast State
 const [isFormModalOpen, setIsFormModalOpen] = useState(false);
 const [editingArticle, setEditingArticle] = useState<MasterArticle | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 // Pagination State
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 10;

 const showToast = (message: string) => {
 setToastMessage(message);
 setTimeout(() => setToastMessage(null), 3000);
 };

 // Filter Logic
 const filteredArticles = articles.filter((art) => {
 const matchesSearch = 
 art.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
 art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 art.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (art.barcode && art.barcode.includes(searchTerm));

 const matchesCategory = filterCategory === 'all' || art.category === filterCategory;
 const matchesBrand = filterBrand === 'all' || art.brand === filterBrand;
 const matchesSize = filterSize === 'all' || art.size === filterSize;
 const matchesActive = 
 filterActive === 'all' || 
 (filterActive === 'active' && art.isActive) ||
 (filterActive === 'inactive' && !art.isActive);

 return matchesSearch && matchesCategory && matchesBrand && matchesSize && matchesActive;
 });

 const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;
 const paginatedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const handleSaveArticle = (savedArticle: MasterArticle) => {
 if (editingArticle) {
 setArticles(prev => prev.map(a => a.id === savedArticle.id ? savedArticle : a));
 if (selectedArticle && selectedArticle.id === savedArticle.id) {
 setSelectedArticle(savedArticle);
 }
 showToast(`Artículo "${savedArticle.sku}" actualizado correctamente.`);
 } else {
 setArticles(prev => [savedArticle, ...prev]);
 showToast(`Artículo "${savedArticle.sku}" dado de alta con éxito.`);
 }
 };

 const handleToggleActive = (articleId: string) => {
 setArticles(prev => prev.map(a => {
 if (a.id === articleId) {
 const nextState = !a.isActive;
 showToast(`Artículo ${a.sku} ${nextState ? 'activado' : 'desactivado'}.`);
 return { ...a, isActive: nextState };
 }
 return a;
 }));

 if (selectedArticle && selectedArticle.id === articleId) {
 setSelectedArticle(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
 }
 };

 const handleResetFilters = () => {
 setSearchTerm('');
 setFilterCategory('all');
 setFilterBrand('all');
 setFilterSize('all');
 setFilterActive('all');
 setCurrentPage(1);
 };

 // If viewing details of a specific article
 if (selectedArticle) {
 return (
 <ArticuloDetailView
 article={selectedArticle}
 onBack={() => setSelectedArticle(null)}
 onEdit={(art) => {
 setEditingArticle(art);
 setIsFormModalOpen(true);
 }}
 onToggleActive={handleToggleActive}
 onSelectRelatedArticle={(targetSku) => {
 const found = articles.find(a => a.sku === targetSku);
 if (found) {
 setSelectedArticle(found);
 }
 }}
 />
 );
 }

 return (
 <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
 
 {/* Module Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
 <div className="space-y-1">
 <div className="flex items-center gap-2.5">
 <Package className="w-5 h-5 text-theme-primary shrink-0" />
 <h1 className="text-xl sm:text-2xl font-extrabold text-theme-main tracking-tight">
 Artículos
 </h1>
 </div>
 <p className="text-xs text-theme-muted">
 Administra el catálogo maestro de productos de Impresos RTM.
 </p>
 </div>

 <div className="flex items-center gap-2">
 {activeTab === 'articles' && (
 <button
 onClick={() => {
 setEditingArticle(null);
 setIsFormModalOpen(true);
 }}
 className="px-4 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover active:scale-[0.99] text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-xs transition-all cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Nuevo artículo</span>
 </button>
 )}
 </div>
 </div>

 {/* Navigation Tabs (Level 1) */}
 <div className="flex border-b border-theme-subtle gap-6 text-xs font-semibold">
 <button
 onClick={() => setActiveTab('articles')}
 className={`pb-3 flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
 activeTab === 'articles'
 ? 'border-theme-primary text-theme-primary font-bold'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <Package className="w-4 h-4" />
 <span>Artículos Maestro</span>
 <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-theme-muted text-theme-main">
 {articles.length}
 </span>
 </button>

 <button
 onClick={() => setActiveTab('classification')}
 className={`pb-3 flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
 activeTab === 'classification'
 ? 'border-theme-primary text-theme-primary font-bold'
 : 'border-transparent text-theme-muted hover:text-theme-main'
 }`}
 >
 <FolderTree className="w-4 h-4" />
 <span>Clasificación (Clases / Grupos / Subgrupos)</span>
 </button>
 </div>

 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* TAB 1: ARTÍCULOS MAESTRO */}
 {activeTab === 'articles' && (
 <div className="space-y-4">
 
 {/* Toolbar / Filters (ADS ERP visual pattern) */}
 <div className="bg-theme-surface p-3.5 border border-theme-subtle rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
 
 {/* Search */}
 <div className="relative w-full md:w-80">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={searchTerm}
 onChange={(e) => {
 setSearchTerm(e.target.value);
 setCurrentPage(1);
 }}
 placeholder="Buscar por SKU, nombre, marca..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder-theme-muted focus:bg-theme-surface focus:outline-none focus:border-theme-primary"
 />
 </div>

 {/* Filter Selects */}
 <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
 <div className="flex items-center gap-1 text-theme-muted mr-1 hidden sm:flex">
 <Filter className="w-3.5 h-3.5" />
 <span>Filtros:</span>
 </div>

 {/* Categoría */}
 <select
 value={filterCategory}
 onChange={(e) => {
 setFilterCategory(e.target.value);
 setCurrentPage(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary"
 >
 <option value="all">Todas las Categorías</option>
 <option value="Colchones">Colchones</option>
 <option value="Bases">Bases y Somieres</option>
 <option value="Almohadas">Almohadas</option>
 <option value="Protectores">Protectores</option>
 </select>

 {/* Marca */}
 <select
 value={filterBrand}
 onChange={(e) => {
 setFilterBrand(e.target.value);
 setCurrentPage(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary"
 >
 <option value="all">Todas las Marcas</option>
 <option value="Nayt">Nayt</option>
 <option value="Spring Air">Spring Air</option>
 <option value="Restonic">Restonic</option>
 <option value="América">América</option>
 <option value="Sealy">Sealy</option>
 <option value="Therapedic">Therapedic</option>
 <option value="Sognare">Sognare</option>
 </select>

 {/* Medida */}
 <select
 value={filterSize}
 onChange={(e) => {
 setFilterSize(e.target.value);
 setCurrentPage(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary"
 >
 <option value="all">Todas las Medidas</option>
 <option value="Individual">Individual</option>
 <option value="Matrimonial">Matrimonial</option>
 <option value="Queen Size">Queen Size</option>
 <option value="King Size">King Size</option>
 <option value="Estándar">Estándar</option>
 </select>

 {/* Estado */}
 <select
 value={filterActive}
 onChange={(e) => {
 setFilterActive(e.target.value);
 setCurrentPage(1);
 }}
 className="bg-theme-muted border border-theme-subtle text-xs font-semibold text-theme-main py-2 px-3 rounded-xl focus:outline-none focus:border-theme-primary"
 >
 <option value="all">Todos los estados</option>
 <option value="active">Activos</option>
 <option value="inactive">Inactivos</option>
 </select>

 {(searchTerm || filterCategory !== 'all' || filterBrand !== 'all' || filterSize !== 'all' || filterActive !== 'all') && (
 <button
 onClick={handleResetFilters}
 className="p-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors"
 title="Restablecer filtros"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 </div>

 {/* Master ERP Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4 whitespace-nowrap">SKU</th>
 <th className="py-3 px-4 min-w-[220px]">Artículo</th>
 <th className="py-3 px-4 whitespace-nowrap">Marca</th>
 <th className="py-3 px-4 whitespace-nowrap">Categoría</th>
 <th className="py-3 px-4 whitespace-nowrap">Medida</th>
 <th className="py-3 px-4 whitespace-nowrap">Unidad</th>
 <th className="py-3 px-4 whitespace-nowrap">Serialización</th>
 <th className="py-3 px-4 whitespace-nowrap">Estado</th>
 <th className="py-3 px-4 whitespace-nowrap text-right">Acciones</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {paginatedArticles.length === 0 ? (
 <tr>
 <td colSpan={9} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron artículos con los filtros aplicados.
 </td>
 </tr>
 ) : (
 paginatedArticles.map((art) => (
 <tr key={art.id} className="hover:bg-theme-muted/40 transition-colors">
 
 {/* SKU */}
 <td className="py-3 px-4 font-mono font-bold text-theme-main whitespace-nowrap">
 <button
 onClick={() => setSelectedArticle(art)}
 className="hover:text-theme-primary transition-colors text-left cursor-pointer"
 >
 {art.sku}
 </button>
 </td>

 {/* Nombre */}
 <td className="py-3 px-4">
 <button
 onClick={() => setSelectedArticle(art)}
 className="font-bold text-theme-main hover:text-theme-primary transition-colors text-left block cursor-pointer"
 >
 {art.name}
 </button>
 <span className="text-[10px] text-theme-muted font-mono block mt-0.5 whitespace-nowrap">
 SAT: {art.satCode} &middot; Clave: {art.classCode}-{art.groupCode}
 </span>
 </td>

 {/* Marca */}
 <td className="py-3 px-4 whitespace-nowrap">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-muted text-theme-main border border-theme-subtle inline-block">
 {art.brand}
 </span>
 </td>

 {/* Categoría */}
 <td className="py-3 px-4 text-theme-main font-medium whitespace-nowrap">
 {art.category}
 </td>

 {/* Medida */}
 <td className="py-3 px-4 font-semibold text-theme-main whitespace-nowrap">
 {art.size}
 </td>

 {/* Unidad */}
 <td className="py-3 px-4 text-theme-muted whitespace-nowrap">
 {art.baseUnit}
 </td>

 {/* Serialización */}
 <td className="py-3 px-4 whitespace-nowrap">
 <SemanticBadge
 tone={art.serialization === 'Por unidad' ? 'success' : 'neutral'}
 label={art.serialization}
 size="sm"
 />
 </td>

 {/* Estado */}
 <td className="py-3 px-4 whitespace-nowrap">
 <SemanticBadge
 tone={art.isActive ? 'success' : 'neutral'}
 label={art.isActive ? 'Activo' : 'Inactivo'}
 size="sm"
 />
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 onClick={() => setSelectedArticle(art)}
 className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-muted transition-colors cursor-pointer"
 title="Ver detalle de artículo"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={() => {
 setEditingArticle(art);
 setIsFormModalOpen(true);
 }}
 className="p-1.5 rounded-lg text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 title="Editar artículo"
 >
 <Edit2 className="w-3.5 h-3.5" />
 </button>

 <button
 onClick={() => handleToggleActive(art.id)}
 className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
 art.isActive 
 ? 'text-theme-muted hover:text-rose-600 hover:bg-rose-50/10' 
 : 'text-theme-muted hover:text-emerald-600 hover:bg-emerald-50/10'
 }`}
 title={art.isActive ? 'Desactivar artículo' : 'Activar artículo'}
 >
 <Power className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination Controls */}
 <div className="px-5 py-3.5 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-theme-muted">
 <span>
 Mostrando <strong>{paginatedArticles.length}</strong> de <strong>{filteredArticles.length}</strong> artículos
 </span>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="p-1.5 rounded-lg border border-theme-subtle text-theme-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 
 <span className="font-mono text-theme-main font-semibold">
 Pág. {currentPage} de {totalPages}
 </span>

 <button
 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className="p-1.5 rounded-lg border border-theme-subtle text-theme-main disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TAB 2: CLASIFICACIÓN */}
 {activeTab === 'classification' && (
 <ClasificacionTab onShowToast={showToast} />
 )}

 {/* Modal Alta / Edición de Artículo */}
 <ArticuloFormModal
 isOpen={isFormModalOpen}
 onClose={() => {
 setIsFormModalOpen(false);
 setEditingArticle(null);
 }}
 onSave={handleSaveArticle}
 initialArticle={editingArticle}
 />
 </div>
 );
};
