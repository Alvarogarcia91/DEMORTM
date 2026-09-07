import React, { useState } from 'react';
import { 
 ArrowLeft, 
 Package, 
 QrCode, 
 Layers, 
 MapPin, 
 Building2, 
 Calendar, 
 Edit2, 
 Power, 
 CheckCircle2, 
 AlertCircle, 
 ShieldCheck, 
 Truck,
 Boxes,
 FileText,
 Sliders,
 Sparkles,
 Barcode,
 Clock,
 User,
 ExternalLink,
 DollarSign,
 ShoppingCart,
 Image as ImageIcon,
 Check,
 Eye,
 Download,
 Share2,
 FolderOpen
} from 'lucide-react';
import { MasterArticle } from '../../data/mockArticlesData';
import { ModalPortal } from '../common/ModalPortal';
import { SemanticBadge } from '../common/SemanticBadge';

interface ArticuloDetailViewProps {
 article: MasterArticle;
 onBack: () => void;
 onEdit: (article: MasterArticle) => void;
 onToggleActive: (articleId: string) => void;
 onSelectRelatedArticle?: (sku: string) => void;
}

type TabType = 
 | 'summary'
 | 'characteristics'
 | 'inventory'
 | 'presentations'
 | 'traceability'
 | 'purchases'
 | 'commercial'
 | 'images'
 | 'documents';

export const ArticuloDetailView: React.FC<ArticuloDetailViewProps> = ({
 article,
 onBack,
 onEdit,
 onToggleActive,
 onSelectRelatedArticle,
}) => {
 const [activeTab, setActiveTab] = useState<TabType>('summary');
 const [previewImage, setPreviewImage] = useState<string | null>(null);
 const [toastMessage, setToastMessage] = useState<string | null>(null);

 const showToast = (msg: string) => {
 setToastMessage(msg);
 setTimeout(() => setToastMessage(null), 3000);
 };

 const tabs: { key: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
 { key: 'summary', label: 'Resumen', icon: FileText },
 { key: 'characteristics', label: 'Características', icon: Sliders },
 { key: 'inventory', label: 'Inventario', icon: Boxes, badge: `${article.inventory.totalPhysical}` },
 { key: 'presentations', label: 'Presentaciones', icon: Layers },
 { key: 'traceability', label: 'Serialización & Trazabilidad', icon: QrCode },
 { key: 'purchases', label: 'Compras / Proveedores', icon: Truck },
 { key: 'commercial', label: 'Comercial', icon: ShoppingCart },
 { key: 'images', label: 'Imágenes', icon: ImageIcon, badge: `${article.images?.length || 1}` },
 { key: 'documents', label: 'Documentos', icon: FolderOpen, badge: `${article.documents?.length || 3}` },
 ];

 return (
 <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
 
 {/* Toast Notification */}
 {toastMessage && (
 <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
 <span>{toastMessage}</span>
 </div>
 )}

 {/* HEADER PRINCIPAL (ERP FICHA MAESTRA) */}
 <div className="bg-theme-surface p-5 border border-theme-subtle rounded-2xl shadow-xs space-y-4">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 
 <div className="flex items-start gap-3.5">
 <button
 onClick={onBack}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer shrink-0 mt-0.5 border border-theme-subtle shadow-xs"
 title="Volver a la lista de artículos"
 >
 <ArrowLeft className="w-5 h-5" />
 </button>

 <div className="space-y-1.5">
 {/* Classification Breadcrumb & Status */}
 <div className="flex flex-wrap items-center gap-2">
 <span className="font-mono text-xs font-bold text-zinc-900 bg-white px-2.5 py-0.5 rounded-md border border-zinc-300 shadow-2xs">
 {article.sku}
 </span>

 <SemanticBadge
 tone={article.isActive ? 'success' : 'neutral'}
 label={article.isActive ? 'Activo' : 'Inactivo'}
 size="sm"
 />

 <SemanticBadge
 tone={article.serialization === 'Por unidad' ? 'success' : 'neutral'}
 label={article.serialization === 'Por unidad' ? 'Serializado (UID/QR)' : 'Control x Lote'}
 size="sm"
 />

 <span className="text-[10px] text-theme-muted font-semibold uppercase tracking-wider hidden sm:inline-block">
 Clasificación: <strong className="text-theme-main">{article.classCode} ({article.className})</strong> &gt; <strong className="text-theme-main">{article.groupCode} ({article.groupName})</strong>
 </span>
 </div>

 {/* Product Title */}
 <h1 className="text-xl sm:text-2xl font-extrabold text-theme-main tracking-tight">
 {article.name}
 </h1>

 <p className="text-xs text-theme-muted">
 Marca: <strong className="text-theme-main font-semibold">{article.brand}</strong> &middot; Categoría: <strong className="text-theme-main font-semibold">{article.category}</strong> &middot; Medida: <strong className="text-theme-main font-semibold">{article.size}</strong> &middot; Unidad: <strong className="text-theme-main font-semibold">{article.baseUnit}</strong>
 </p>
 </div>
 </div>

 {/* Header Action Buttons */}
 <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
 <button
 onClick={() => onEdit(article)}
 className="px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
 >
 <Edit2 className="w-3.5 h-3.5 text-theme-muted" />
 <span>Editar datos generales</span>
 </button>

 <button
 onClick={() => onToggleActive(article.id)}
 className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${
 article.isActive 
 ? 'bg-white text-zinc-900 border-rose-500 hover:bg-zinc-50'
 : 'bg-white text-zinc-900 border-emerald-600 hover:bg-zinc-50'
 }`}
 >
 <Power className={`w-3.5 h-3.5 ${article.isActive ? 'text-rose-600' : 'text-emerald-600'}`} />
 <span>{article.isActive ? 'Desactivar' : 'Activar'}</span>
 </button>
 </div>
 </div>

 {/* 9 TABS CON FLEX-WRAP (DISTRIBUCIÓN EN 2 RENGLONES SIN SCROLL HORIZONTAL) */}
 <div className="flex flex-wrap items-center gap-1.5 border-t border-theme-subtle pt-3 text-xs font-semibold">
 {tabs.map((tab) => {
 const Icon = tab.icon;
 const isTabActive = activeTab === tab.key;
 return (
 <button
 key={tab.key}
 onClick={() => setActiveTab(tab.key)}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
 isTabActive
 ? 'bg-theme-primary text-white font-bold shadow-xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
 }`}
 >
 <Icon className="w-3.5 h-3.5" />
 <span>{tab.label}</span>
 {tab.badge && (
 <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
 isTabActive ? 'bg-white/20 text-white' : 'bg-theme-muted text-theme-main'
 }`}>
 {tab.badge}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* ========================================================================= */}
 {/* TAB 1: RESUMEN */}
 {/* ========================================================================= */}
 {activeTab === 'summary' && (
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 {/* Card 1: INFORMACIÓN GENERAL */}
 <div className="bg-theme-surface p-5 rounded-2xl border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center gap-2 pb-2 border-b border-theme-subtle">
 <FileText className="w-4 h-4 text-theme-primary" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">
 Información General
 </h3>
 </div>

 <div className="space-y-2.5 text-xs">
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">SKU</span>
 <span className="font-mono font-bold text-theme-main">{article.sku}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Nombre Interno</span>
 <span className="font-semibold text-theme-main text-right">{article.name}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Marca</span>
 <span className="font-semibold text-theme-main">{article.brand}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Categoría</span>
 <span className="font-semibold text-theme-main">{article.category}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Medida</span>
 <span className="font-semibold text-theme-main">{article.size}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Unidad Principal</span>
 <span className="font-semibold text-theme-main">{article.baseUnit}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Estado Operacional</span>
 <span className="font-bold text-emerald-600">Alta Confirmada</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Tipo de Artículo</span>
 <span className="font-semibold text-theme-main">Producto Terminado</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Requiere Serialización</span>
 <span className="font-bold text-theme-primary">{article.serialization === 'Por unidad' ? 'Sí (Individual)' : 'No (Lote)'}</span>
 </div>
 <div className="flex justify-between py-1.5">
 <span className="text-theme-muted">Requiere QR</span>
 <span className="font-bold text-theme-main">{article.logisticControl.requiresQr ? 'Sí' : 'No'}</span>
 </div>
 </div>
 </div>

 {/* Card 2: TAXONOMÍA Y DESCRIPCIONES */}
 <div className="bg-theme-surface p-5 rounded-2xl border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center gap-2 pb-2 border-b border-theme-subtle">
 <Layers className="w-4 h-4 text-blue-600" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">
 Taxonomía y Descripciones
 </h3>
 </div>

 <div className="space-y-2.5 text-xs">
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Clase</span>
 <span className="font-mono font-bold text-theme-main">{article.classCode} &middot; {article.className}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Grupo</span>
 <span className="font-semibold text-theme-main">{article.groupCode} &middot; {article.groupName}</span>
 </div>
 {article.subgroupCode && (
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Subgrupo</span>
 <span className="font-semibold text-theme-main">{article.subgroupCode} &middot; {article.subgroupName}</span>
 </div>
 )}
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Clave SAT</span>
 <span className="font-mono font-bold text-theme-main">{article.satCode}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Código de Barras</span>
 <span className="font-mono font-bold text-theme-main">{article.barcode}</span>
 </div>

 <div className="pt-2 space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Descripción Interna</span>
 <p className="p-2 rounded-xl bg-theme-muted/50 text-[11px] text-theme-main leading-relaxed">
 {article.descriptions?.internal}
 </p>
 </div>

 <div className="space-y-1.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Descripción Comercial</span>
 <p className="p-2 rounded-xl bg-theme-muted/50 text-[11px] text-theme-main leading-relaxed">
 {article.descriptions?.commercial}
 </p>
 </div>
 </div>
 </div>

 {/* Card 3: CONTROL LOGÍSTICO */}
 <div className="bg-theme-surface p-5 rounded-2xl border border-theme-subtle shadow-xs space-y-4">
 <div className="flex items-center gap-2 pb-2 border-b border-theme-subtle">
 <QrCode className="w-4 h-4 text-emerald-600" />
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main">
 Control Logístico y de Almacén
 </h3>
 </div>

 <div className="space-y-2.5 text-xs">
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Estrategia de Rotación</span>
 <span className="font-bold text-theme-main">{article.logisticControl.rotationStrategy} (FIFO)</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">FEFO Habilitado</span>
 <span className="font-semibold text-theme-main">{article.logisticControl.fefoEnabled ? 'Sí' : 'No'}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Días Máx. Inventario</span>
 <span className="font-mono font-bold text-theme-main">{article.logisticControl.maxDaysInWarehouse} días</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Manejo Individual</span>
 <span className="font-bold text-emerald-600">Sí (Pieza x Pieza)</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Tipo Identificación</span>
 <span className="font-semibold text-theme-main">UID / Código QR Único</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Ubicación Física Obligatoria</span>
 <span className="font-semibold text-theme-main">Sí (Rack / Posición Bahía)</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Nivel de Inspección</span>
 <span className="font-semibold text-theme-main text-right">{article.logisticControl.inspectionLevel}</span>
 </div>
 <div className="flex justify-between py-1.5 border-b border-theme-subtle">
 <span className="text-theme-muted">Peso Unitario</span>
 <span className="font-mono font-bold text-theme-main">{article.logisticControl.weightKg} Kg</span>
 </div>
 <div className="flex justify-between py-1.5">
 <span className="text-theme-muted">Dimensiones (An x L x Al)</span>
 <span className="font-mono font-semibold text-theme-main">
 {article.logisticControl.dimensionsCm.width} x {article.logisticControl.dimensionsCm.length} x {article.logisticControl.dimensionsCm.height} cm
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 2: CARACTERÍSTICAS TÉCNICAS */}
 {/* ========================================================================= */}
 {activeTab === 'characteristics' && (
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-6">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Sliders className="w-4 h-4 text-theme-primary" />
 Atributos Dinámicos de Producto
 </h3>
 <p className="text-xs text-theme-muted mt-1">
 Especificaciones de confort, soporte y manufactura del artículo.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Marca & Línea</span>
 <p className="text-xs font-bold text-theme-main">{article.brand} &middot; {article.characteristics?.line}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Tipo de Colchón</span>
 <p className="text-xs font-bold text-theme-main">{article.characteristics?.mattressType}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Nivel de Firmeza</span>
 <p className="text-xs font-bold text-theme-primary">{article.characteristics?.firmness}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Altura Total</span>
 <p className="text-xs font-mono font-bold text-theme-main">{article.characteristics?.heightCm} cm</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Tecnología de Soporte</span>
 <p className="text-xs font-semibold text-theme-main">{article.characteristics?.supportTechnology}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Tipo de Empaque</span>
 <p className="text-xs font-semibold text-theme-main">{article.characteristics?.packagingType}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Colchón en Caja (Roll-Pack)</span>
 <p className="text-xs font-bold text-theme-main">{article.characteristics?.isBoxed ? 'Sí' : 'No'}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Reversible</span>
 <p className="text-xs font-bold text-theme-main">{article.characteristics?.isReversible ? 'Sí (Doble Cara)' : 'No (Never Turn)'}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Peso Máximo Soportado</span>
 <p className="text-xs font-mono font-bold text-theme-main">{article.characteristics?.maxWeightPerPersonKg} Kg / persona</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1 lg:col-span-2">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Composición de Tela y Acolchado</span>
 <p className="text-xs font-medium text-theme-main">{article.characteristics?.fabricComposition}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Garantía de Fábrica</span>
 <p className="text-xs font-bold text-emerald-600">{article.characteristics?.warrantyYears} Años de Garantía</p>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 3: INVENTARIO (TAB MUY IMPORTANTE) */}
 {/* ========================================================================= */}
 {activeTab === 'inventory' && (
 <div className="space-y-6">
 
 {/* KPI Cards */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stock Físico Total</span>
 <span className="text-2xl font-black text-zinc-900 font-mono">{article.inventory.totalPhysical}</span>
 <span className="text-[10px] text-zinc-500 block">Unidades en red CEDIS</span>
 </div>
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-zinc-500 block">Disponible para Surtido</span>
 <span className="text-2xl font-black text-zinc-900 font-mono">{article.inventory.available}</span>
 <span className="text-[10px] text-emerald-700 font-medium block">Listos para embarque</span>
 </div>
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-zinc-500 block">Comprometido</span>
 <span className="text-2xl font-black text-zinc-900 font-mono">{article.inventory.committed}</span>
 <span className="text-[10px] text-amber-700 font-medium block">En órdenes de venta</span>
 </div>
 <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
 <span className="text-[10px] uppercase font-bold text-zinc-500 block">En Tránsito / Recepción</span>
 <span className="text-2xl font-black text-zinc-900 font-mono">{article.inventory.inInspection}</span>
 <span className="text-[10px] text-blue-700 font-medium block">En rampa de inspección</span>
 </div>
 </div>

 {/* Tabla 1: Inventario Resumido por Instalación */}
 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
 <Building2 className="w-4 h-4 text-zinc-500" />
 Inventario por Centro de Distribución y Sucursal
 </h3>
 </div>
 <span className="text-[11px] text-zinc-500 font-mono">{article.inventory.byWarehouse.length} instalaciones</span>
 </div>

 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
 <th className="py-3 px-4">Instalación</th>
 <th className="py-3 px-4">Ubicación / Bahía</th>
 <th className="py-3 px-4 text-right">Disponible</th>
 <th className="py-3 px-4 text-right">Comprometido</th>
 <th className="py-3 px-4 text-right">En Tránsito</th>
 <th className="py-3 px-4 text-right">Total Físico</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100">
 {article.inventory.byWarehouse.map((w, idx) => (
 <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
 <td className="py-3 px-4 font-bold text-zinc-900 flex items-center gap-2">
 <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
 <span>{w.warehouseName}</span>
 </td>
 <td className="py-3 px-4 font-mono font-semibold text-zinc-700">
 {w.location}
 </td>
 <td className="py-3 px-4 font-mono font-bold text-zinc-900 text-right">
 {w.available}
 </td>
 <td className="py-3 px-4 font-mono font-medium text-zinc-600 text-right">
 {w.committed}
 </td>
 <td className="py-3 px-4 font-mono font-medium text-zinc-600 text-right">
 {w.inTransit}
 </td>
 <td className="py-3 px-4 font-mono font-extrabold text-zinc-900 text-right">
 {w.stock}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Tabla 2: Últimas unidades serializadas (Relacionado a Mesa de Verificación) */}
 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs">
 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
 <QrCode className="w-4 h-4 text-emerald-600" />
 Últimas Unidades Serializadas (Trazabilidad por Pieza)
 </h3>
 <p className="text-[11px] text-zinc-500 mt-0.5">
 Registro individual de números de serie escaneados en la Mesa de Verificación.
 </p>
 </div>
 <SemanticBadge
 tone="success"
 label="Enlace Mesa de Verificación Activo"
 size="sm"
 />
 </div>

 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
 <th className="py-3 px-4">UID / Serie</th>
 <th className="py-3 px-4">Lote</th>
 <th className="py-3 px-4">Instalación</th>
 <th className="py-3 px-4">Ubicación</th>
 <th className="py-3 px-4">Fecha de Entrada</th>
 <th className="py-3 px-4">Antigüedad</th>
 <th className="py-3 px-4 text-right">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100">
 {article.inventory.recentSerializedUnits?.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-8 text-center text-zinc-500 text-xs">
 Este artículo no requiere serialización por pieza o no tiene unidades recientes.
 </td>
 </tr>
 ) : (
 article.inventory.recentSerializedUnits?.map((unit, idx) => (
 <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
 <td className="py-3 px-4 font-mono font-bold text-zinc-900 flex items-center gap-1.5">
 <QrCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
 <span>{unit.uid}</span>
 </td>
 <td className="py-3 px-4 font-mono text-zinc-500">
 {unit.lotNumber}
 </td>
 <td className="py-3 px-4 font-semibold text-zinc-900">
 {unit.warehouseName}
 </td>
 <td className="py-3 px-4 font-mono font-medium text-zinc-700">
 {unit.location}
 </td>
 <td className="py-3 px-4 text-zinc-700">
 {unit.entryDate}
 </td>
 <td className="py-3 px-4 font-mono text-zinc-500">
 {unit.ageDays} días
 </td>
 <td className="py-3 px-4 text-right">
 <SemanticBadge
 tone={unit.status === 'Disponible' ? 'success' : unit.status === 'En inspección' ? 'warning' : 'info'}
 label={unit.status}
 size="sm"
 />
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 4: PRESENTACIONES Y VARIANTES */}
 {/* ========================================================================= */}
 {activeTab === 'presentations' && (
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-theme-subtle">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Layers className="w-4 h-4 text-theme-primary" />
 Unidad Principal & Variantes Relacionadas
 </h3>
 <p className="text-xs text-theme-muted mt-1">
 Catálogo de medidas disponibles para la misma línea de producto.
 </p>
 </div>
 <div className="text-xs bg-theme-muted/50 px-3 py-1.5 rounded-xl border border-theme-subtle font-mono">
 Unidad Base: <strong className="text-theme-main">Pieza (PZA)</strong>
 </div>
 </div>

 <div className="space-y-3">
 <span className="text-[10px] uppercase font-bold text-theme-muted block tracking-wider">
 Variantes Relacionadas por Medida
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {article.relatedVariants?.map((variant, idx) => {
 const isCurrent = variant.sku === article.sku;
 return (
 <div
 key={idx}
 className={`p-4 rounded-xl border transition-all space-y-2 ${
 isCurrent
 ? 'border-theme-primary bg-theme-primary/5 ring-2 ring-theme-primary/20 shadow-xs'
 : 'border-theme-subtle bg-theme-surface hover:border-theme-strong'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="font-mono text-xs font-bold text-theme-primary">
 {variant.sku}
 </span>
 {isCurrent ? (
 <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-rose-600 shadow-2xs">
 Actual
 </span>
 ) : (
 <SemanticBadge
 tone={variant.status === 'Activo' ? 'success' : 'neutral'}
 label={variant.status}
 size="xs"
 />
 )}
 </div>

 <p className="text-xs font-bold text-theme-main">{variant.name}</p>
 <p className="text-[11px] text-theme-muted font-medium">Medida: <strong className="text-theme-main">{variant.size}</strong></p>

 {!isCurrent && (
 <button
 onClick={() => {
 if (onSelectRelatedArticle) onSelectRelatedArticle(variant.sku);
 showToast(`Cargando ficha de ${variant.sku}...`);
 }}
 className="w-full mt-2 py-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-[11px] font-semibold text-theme-main transition-colors flex items-center justify-center gap-1 cursor-pointer"
 >
 <ExternalLink className="w-3 h-3" />
 <span>Ver Ficha</span>
 </button>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 5: SERIALIZACIÓN Y TRAZABILIDAD */}
 {/* ========================================================================= */}
 {activeTab === 'traceability' && (
 <div className="space-y-6">
 
 {/* Configuración de Serialización */}
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-4">
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <QrCode className="w-4 h-4 text-theme-primary" />
 Configuración de Serialización y Trazabilidad
 </h3>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Serialización</span>
 <p className="font-bold text-theme-main">{article.serialization}</p>
 <p className="text-[10px] text-theme-muted">Cada colchón posee identificador irrepetible</p>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Tipo de Identificador</span>
 <p className="font-mono font-bold text-theme-main">UID (Universal ID)</p>
 <p className="text-[10px] text-theme-muted">Formato estándar: SC-UID-AAAA-XXXXXX</p>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Código de Lectura</span>
 <p className="font-bold text-theme-main">Código QR 2D + Código EAN-13</p>
 <p className="text-[10px] text-theme-muted">Lectura rápida con terminal Zebra/Handheld</p>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Momento de Generación</span>
 <p className="font-bold text-emerald-600">Al finalizar recepción / Mesa de Verificación</p>
 <p className="text-[10px] text-theme-muted">Impresión inmediata de sticker térmico</p>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Regla FIFO Obligatoria</span>
 <p className="font-bold text-theme-main">Sí (Surtido por antigüedad de serie)</p>
 <p className="text-[10px] text-theme-muted">Evita sobrealmacenamiento en bahías</p>
 </div>

 <div className="p-3.5 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">FEFO</span>
 <p className="font-semibold text-theme-main">Configurable por lote</p>
 <p className="text-[10px] text-theme-muted">Monitoreo de tiempo en empaque Roll-Pack</p>
 </div>
 </div>
 </div>

 {/* Timeline / Tabla de Trazabilidad Reciente */}
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="px-6 py-4 border-b border-theme-subtle">
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Clock className="w-4 h-4 text-blue-600" />
 Historial de Trazabilidad Reciente (Movimientos de Almacén)
 </h3>
 <p className="text-[11px] text-theme-muted mt-0.5">
 Auditabilidad completa: sabemos exactamente qué operador, fecha y posición procesó el artículo.
 </p>
 </div>

 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/50 border-b border-theme-subtle text-theme-muted font-bold uppercase text-[10px]">
 <th className="py-3 px-4">Fecha / Hora</th>
 <th className="py-3 px-4">Evento</th>
 <th className="py-3 px-4">CEDIS</th>
 <th className="py-3 px-4">Ubicación</th>
 <th className="py-3 px-4">Usuario / Operador</th>
 <th className="py-3 px-4">Detalles</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {article.traceabilityEvents?.map((event, idx) => (
 <tr key={idx} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-3 px-4 font-mono font-semibold text-theme-main">
 {event.timestamp}
 </td>
 <td className="py-3 px-4">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs">
 {event.event}
 </span>
 </td>
 <td className="py-3 px-4 font-semibold text-theme-main">
 {event.warehouseName}
 </td>
 <td className="py-3 px-4 font-mono font-bold text-theme-primary">
 {event.location}
 </td>
 <td className="py-3 px-4 font-medium text-theme-muted flex items-center gap-1.5">
 <User className="w-3 h-3" />
 <span>{event.user}</span>
 </td>
 <td className="py-3 px-4 text-theme-muted text-[11px]">
 {event.details}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 6: COMPRAS / PROVEEDORES */}
 {/* ========================================================================= */}
 {activeTab === 'purchases' && (
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-6">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <Truck className="w-4 h-4 text-theme-primary" />
 Parámetros de Abastecimiento & Compras
 </h3>
 <p className="text-xs text-theme-muted mt-1">
 Control de proveedores, costos de reposición y tiempos de entrega.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Proveedor Principal</span>
 <p className="text-xs font-bold text-theme-main">{article.purchasing?.primarySupplier}</p>
 <p className="text-[10px] text-theme-muted font-mono">{article.purchasing?.supplierCode}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Última Recepción</span>
 <p className="text-xs font-bold text-theme-main">{article.purchasing?.lastReceptionDate}</p>
 <p className="text-[10px] text-theme-muted">Lote: <strong className="font-mono">{article.purchasing?.lastReceivedLot}</strong></p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Lead Time Estimado</span>
 <p className="text-xs font-mono font-bold text-theme-main">{article.purchasing?.estimatedLeadTimeDays} días hábiles</p>
 <p className="text-[10px] text-theme-muted">Tiempo desde OC hasta rampa</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Costo Referencia Interno</span>
 <p className="text-xs font-mono font-extrabold text-theme-main">
 ${article.purchasing?.internalReferenceCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
 </p>
 <p className="text-[10px] text-theme-muted">Costo promedio de compra</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Punto de Reorden Sugerido</span>
 <p className="text-xs font-mono font-bold text-amber-600">{article.purchasing?.reorderPoint} unidades</p>
 <p className="text-[10px] text-theme-muted">Activa orden de reposición automática</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Lote Económico de Compra (EOQ)</span>
 <p className="text-xs font-mono font-bold text-theme-main">{article.purchasing?.economicOrderQuantity} unidades</p>
 <p className="text-[10px] text-theme-muted">Optimización por flete de tráiler</p>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 7: COMERCIAL */}
 {/* ========================================================================= */}
 {activeTab === 'commercial' && (
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-6">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <ShoppingCart className="w-4 h-4 text-theme-primary" />
 Información Comercial Interna
 </h3>
 <p className="text-xs text-theme-muted mt-1">
 Parámetros de catálogo comercial, canales de venta y vigencia.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Estatus Comercial</span>
 <p className="text-xs font-bold text-emerald-600">{article.commercial?.commercialStatus}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Canal de Distribución</span>
 <p className="text-xs font-bold text-theme-main">{article.commercial?.salesChannel}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Temporada / Año Modelo</span>
 <p className="text-xs font-bold text-theme-main">{article.commercial?.season} ({article.commercial?.modelYear})</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Fecha de Introducción</span>
 <p className="text-xs font-bold text-theme-main">{article.commercial?.introductionDate}</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Precio Lista Referencia</span>
 <p className="text-xs font-mono font-bold text-theme-main">
 ${article.commercial?.referenceListPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
 </p>
 <p className="text-[10px] text-theme-muted">Uso administrativo interno</p>
 </div>

 <div className="p-4 rounded-xl bg-theme-muted/40 border border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted">Disponibilidad en Tiendas</span>
 <p className="text-xs font-bold text-emerald-600">Nivel Nacional</p>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 8: IMÁGENES (GESTOR DE ASSETS DEL ERP) */}
 {/* ========================================================================= */}
 {activeTab === 'images' && (
 <div className="bg-theme-surface p-6 rounded-2xl border border-theme-subtle shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <ImageIcon className="w-4 h-4 text-theme-primary" />
 Gestor de Assets de Imagen
 </h3>
 <p className="text-xs text-theme-muted mt-1">
 Fotografías de producto oficiales de Impresos RTM vinculadas al SKU.
 </p>
 </div>

 <button
 onClick={() => showToast('Asset cargado en servidor demo.')}
 className="px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
 >
 <Download className="w-3.5 h-3.5 rotate-180 text-theme-muted" />
 <span>Cargar nuevo asset</span>
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {article.images?.map((img) => (
 <div
 key={img.id}
 className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface space-y-3 shadow-xs group"
 >
 {/* Image Box */}
 <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-theme-subtle p-2">
 <img
 src={img.url}
 alt={img.caption}
 className="max-h-full max-w-full object-contain"
 />
 {img.isPrimary && (
 <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-theme-primary text-white shadow-xs">
 Principal
 </span>
 )}
 </div>

 <div className="space-y-1">
 <p className="text-xs font-bold text-theme-main truncate">{img.caption}</p>
 <p className="text-[10px] text-theme-muted font-mono">{img.resolution}</p>
 </div>

 <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
 <button
 onClick={() => setPreviewImage(img.url)}
 className="flex-1 py-1.5 rounded-lg bg-theme-muted hover:bg-theme-subtle text-[11px] font-semibold text-theme-main transition-colors flex items-center justify-center gap-1 cursor-pointer"
 >
 <Eye className="w-3 h-3" />
 <span>Ver</span>
 </button>

 {!img.isPrimary && (
 <button
 onClick={() => showToast('Marcada como imagen principal')}
 className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 Hacer principal
 </button>
 )}
 </div>
 </div>
 ))}
 </div>

 {/* Modal Preview Image */}
 {previewImage && (
 <ModalPortal onClose={() => setPreviewImage(null)}>
 <div className="bg-theme-surface p-4 rounded-2xl max-w-2xl w-full border border-theme-subtle shadow-2xl space-y-3">
 <div className="flex justify-between items-center pb-2 border-b border-theme-subtle">
 <span className="text-xs font-bold text-theme-main">{article.name}</span>
 <button onClick={() => setPreviewImage(null)} className="text-theme-muted hover:text-theme-main text-xs font-bold cursor-pointer">
 Cerrar
 </button>
 </div>
 <div className="bg-white p-6 rounded-xl flex items-center justify-center">
 <img src={previewImage} alt="Preview" className="max-h-[60vh] object-contain" />
 </div>
 </div>
 </ModalPortal>
 )}
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 9: DOCUMENTOS */}
 {/* ========================================================================= */}
 {activeTab === 'documents' && (
 <div className="bg-theme-surface border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main flex items-center gap-2">
 <FolderOpen className="w-4 h-4 text-theme-primary" />
 Documentos Técnicos y Certificaciones
 </h3>
 <p className="text-[11px] text-theme-muted mt-0.5">
 Archivos PDF de especificaciones, pólizas de garantía y manuales de operación.
 </p>
 </div>
 <button
 onClick={() => showToast('Subida de documentos habilitada en demo')}
 className="px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-subtle hover:bg-theme-muted text-xs font-semibold text-theme-main transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
 >
 <Download className="w-3.5 h-3.5 rotate-180 text-theme-muted" />
 <span>Adjuntar documento</span>
 </button>
 </div>

 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/50 border-b border-theme-subtle text-theme-muted font-bold uppercase text-[10px]">
 <th className="py-3 px-4">Documento</th>
 <th className="py-3 px-4">Tipo</th>
 <th className="py-3 px-4">Formato</th>
 <th className="py-3 px-4">Versión</th>
 <th className="py-3 px-4">Fecha</th>
 <th className="py-3 px-4">Tamaño</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle">
 {article.documents?.map((doc) => (
 <tr key={doc.id} className="hover:bg-theme-muted/40 transition-colors">
 <td className="py-3 px-4 font-bold text-theme-main flex items-center gap-2">
 <FileText className="w-4 h-4 text-rose-600 shrink-0" />
 <span>{doc.title}</span>
 </td>
 <td className="py-3 px-4 text-theme-main font-medium">
 {doc.type}
 </td>
 <td className="py-3 px-4">
 <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
 {doc.format}
 </span>
 </td>
 <td className="py-3 px-4 font-mono text-theme-muted">
 {doc.version}
 </td>
 <td className="py-3 px-4 text-theme-muted">
 {doc.date}
 </td>
 <td className="py-3 px-4 font-mono text-theme-muted">
 {doc.sizeKb} KB
 </td>
 <td className="py-3 px-4 text-right">
 <button
 onClick={() => showToast(`Abriendo ${doc.title}...`)}
 className="px-2.5 py-1 rounded-lg bg-theme-muted hover:bg-theme-subtle text-[11px] font-semibold text-theme-main transition-colors cursor-pointer inline-flex items-center gap-1"
 >
 <Eye className="w-3 h-3 text-theme-muted" />
 <span>Ver</span>
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
};
