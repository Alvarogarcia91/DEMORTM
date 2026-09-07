import React, { useState } from 'react';
import {
 X,
 Building2,
 Calendar,
 User,
 DollarSign,
 Clock,
 FileText,
 Truck,
 Plus,
 Edit3,
 Trash2,
 CheckCircle2,
 AlertTriangle,
 History,
 ShieldCheck,
 Star,
 Search,
 Check,
 PowerOff,
 Power,
 MapPin,
 Mail,
 Phone,
 FileCheck2,
 Layers,
 ArrowRight
} from 'lucide-react';
import {
 SupplierMaster,
 SupplierContact,
 SupplierAddress,
 SupplierArticleRelation,
 SupplierDocument,
 SupplierTimelineEntry,
 getSupplierArticleActivePrice
} from '../../../data/mockSuppliersData';
import { MOCK_MASTER_ARTICLES, MasterArticle } from '../../../data/mockArticlesData';
import { SupplierStatusBadge } from './SupplierStatusBadge';
import { PriceListsTab } from './PriceListsTab';
import { ModalPortal } from '../../common/ModalPortal';
import { StatusBadge } from '../../common/StatusBadge';

interface SupplierDetailModalProps {
 supplier: SupplierMaster;
 initialTab?: 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial';
 onClose: () => void;
 onUpdateSupplier: (updated: SupplierMaster) => void;
 onOpenEditForm: (sup: SupplierMaster) => void;
}

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
 supplier,
 initialTab = 'resumen',
 onClose,
 onUpdateSupplier,
 onOpenEditForm,
}) => {
 const [activeTab, setActiveTab] = useState(initialTab);

 // Sub-modal states
 const [contactModalOpen, setContactModalOpen] = useState(false);
 const [newContactName, setNewContactName] = useState('');
 const [newContactPosition, setNewContactPosition] = useState('');
 const [newContactEmail, setNewContactEmail] = useState('');
 const [newContactPhone, setNewContactPhone] = useState('');
 const [newContactIsPrimary, setNewContactIsPrimary] = useState(false);

 const [addressModalOpen, setAddressModalOpen] = useState(false);
 const [newAddrType, setNewAddrType] = useState<'Fiscal' | 'Planta' | 'Entrega' | 'Oficina'>('Fiscal');
 const [newAddrStreet, setNewAddrStreet] = useState('');
 const [newAddrExt, setNewAddrExt] = useState('');
 const [newAddrInt, setNewAddrInt] = useState('');
 const [newAddrCol, setNewAddrCol] = useState('');
 const [newAddrCity, setNewAddrCity] = useState('');
 const [newAddrState, setNewAddrState] = useState('');
 const [newAddrCp, setNewAddrCp] = useState('');

 const [articleModalOpen, setArticleModalOpen] = useState(false);
 const [articleSearchQuery, setArticleSearchQuery] = useState('');
 const [selectedCatalogArticle, setSelectedCatalogArticle] = useState<MasterArticle | null>(null);
 const [newRelSupplierSku, setNewRelSupplierSku] = useState('');
 const [newRelSupplierName, setNewRelSupplierName] = useState('');
 const [newRelPrice, setNewRelPrice] = useState<number>(4500);
 const [newRelLeadDays, setNewRelLeadDays] = useState<number>(supplier.estimatedLeadDays || 4);
 const [newRelIsPreferred, setNewRelIsPreferred] = useState(true);

 const [docModalOpen, setDocModalOpen] = useState(false);
 const [newDocName, setNewDocName] = useState('');
 const [newDocType, setNewDocType] = useState<'Constancia Fiscal' | 'Datos Bancarios' | 'Convenio Comercial' | 'Certificación' | 'Identificación' | 'Otro'>('Constancia Fiscal');
 const [newDocExpires, setNewDocExpires] = useState('');

 // Deactivate/Activate Confirmation modal
 const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);

 const primaryContact = supplier.contacts.find((c) => c.isPrimary) || supplier.contacts[0];

 // =========================================================================
 // HANDLERS FOR SUB-RESOURCES
 // =========================================================================

 // Add Contact
 const handleSaveContact = () => {
 if (!newContactName.trim()) return;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 let updatedContacts = [...supplier.contacts];
 if (newContactIsPrimary) {
 updatedContacts = updatedContacts.map((c) => ({ ...c, isPrimary: false }));
 }

 const newContact: SupplierContact = {
 id: `c-${Date.now()}`,
 name: newContactName.trim(),
 position: newContactPosition.trim() || 'Contacto Comercial',
 email: newContactEmail.trim(),
 phone: newContactPhone.trim(),
 isPrimary: newContactIsPrimary || updatedContacts.length === 0,
 status: 'Activo',
 };

 updatedContacts.push(newContact);

 const timelineEntry: SupplierTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: `Agregó nuevo contacto: ${newContact.name}`,
 type: 'contact_updated',
 };

 const updated: SupplierMaster = {
 ...supplier,
 contacts: updatedContacts,
 timeline: [timelineEntry, ...supplier.timeline],
 };

 onUpdateSupplier(updated);
 setContactModalOpen(false);
 setNewContactName('');
 setNewContactPosition('');
 setNewContactEmail('');
 setNewContactPhone('');
 setNewContactIsPrimary(false);
 };

 // Add Address
 const handleSaveAddress = () => {
 if (!newAddrStreet.trim()) return;

 const newAddr: SupplierAddress = {
 id: `a-${Date.now()}`,
 type: newAddrType,
 street: newAddrStreet.trim(),
 extNumber: newAddrExt.trim() || 'S/N',
 intNumber: newAddrInt.trim() || undefined,
 neighborhood: newAddrCol.trim() || 'Centro',
 city: newAddrCity.trim() || 'Monterrey',
 state: newAddrState.trim() || 'Nuevo León',
 postalCode: newAddrCp.trim() || '64000',
 country: 'México',
 };

 const updated: SupplierMaster = {
 ...supplier,
 addresses: [...supplier.addresses, newAddr],
 };

 onUpdateSupplier(updated);
 setAddressModalOpen(false);
 setNewAddrStreet('');
 setNewAddrExt('');
 setNewAddrInt('');
 setNewAddrCol('');
 setNewAddrCity('');
 setNewAddrState('');
 setNewAddrCp('');
 };

 // Add Article Relationship
 const handleSaveArticleRelation = () => {
 if (!selectedCatalogArticle) return;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 const newRelation: SupplierArticleRelation = {
 id: `ar-${Date.now()}`,
 articleSku: selectedCatalogArticle.sku,
 articleName: selectedCatalogArticle.name,
 brand: selectedCatalogArticle.brand,
 size: selectedCatalogArticle.size,
 supplierSku: newRelSupplierSku.trim() || selectedCatalogArticle.sku,
 supplierArticleName: newRelSupplierName.trim() || selectedCatalogArticle.name,
 purchaseUnit: selectedCatalogArticle.baseUnit || 'Colchón',
 referencePrice: newRelPrice,
 estimatedLeadDays: newRelLeadDays,
 isPreferred: newRelIsPreferred,
 status: 'Activo',
 };

 const timelineEntry: SupplierTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: `Relacionó artículo ${selectedCatalogArticle.sku} con precio de referencia $${newRelPrice}`,
 type: 'article_linked',
 };

 const updated: SupplierMaster = {
 ...supplier,
 articles: [...supplier.articles, newRelation],
 timeline: [timelineEntry, ...supplier.timeline],
 };

 onUpdateSupplier(updated);
 setArticleModalOpen(false);
 setSelectedCatalogArticle(null);
 setArticleSearchQuery('');
 setNewRelSupplierSku('');
 setNewRelSupplierName('');
 };

 // Add Document
 const handleSaveDocument = () => {
 if (!newDocName.trim()) return;
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 const newDoc: SupplierDocument = {
 id: `doc-${Date.now()}`,
 name: newDocName.trim(),
 type: newDocType,
 uploadedAt: '27 Ago 2026',
 expiresAt: newDocExpires.trim() || undefined,
 status: 'Vigente',
 };

 const timelineEntry: SupplierTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Comprador',
 action: `Subió documento: ${newDoc.name}`,
 type: 'doc_uploaded',
 };

 const updated: SupplierMaster = {
 ...supplier,
 documents: [...supplier.documents, newDoc],
 timeline: [timelineEntry, ...supplier.timeline],
 };

 onUpdateSupplier(updated);
 setDocModalOpen(false);
 setNewDocName('');
 setNewDocExpires('');
 };

 // Toggle Supplier Status (Activo / Inactivo)
 const handleToggleSupplierStatus = () => {
 const targetStatus = supplier.status === 'Activo' ? 'Inactivo' : 'Activo';
 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

 const timelineEntry: SupplierTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Gerencia de Compras',
 action: targetStatus === 'Inactivo'
 ? 'Desactivó al proveedor del catálogo maestro'
 : 'Reactivó al proveedor en el catálogo maestro',
 type: 'status_changed',
 };

 const updated: SupplierMaster = {
 ...supplier,
 status: targetStatus,
 timeline: [timelineEntry, ...supplier.timeline],
 };

 onUpdateSupplier(updated);
 setStatusConfirmOpen(false);
 };

 const tabs = [
 { id: 'resumen' as const, label: 'Resumen' },
 { id: 'contactos' as const, label: `Contactos (${supplier.contacts.length})` },
 { id: 'direcciones' as const, label: `Direcciones (${supplier.addresses.length})` },
 { id: 'articulos' as const, label: `Artículos (${supplier.articles.length})` },
 { id: 'listas_precios' as const, label: `Listas de Precios (${supplier.priceLists?.length || 0})` },
 { id: 'condiciones' as const, label: 'Condiciones Comerciales' },
 { id: 'documentos' as const, label: `Documentos (${supplier.documents.length})` },
 { id: 'historial' as const, label: `Historial (${supplier.timeline.length})` },
 ];

 return (
 <>
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-5xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-theme-primary border border-theme-primary shadow-2xs flex items-center justify-center font-bold text-sm shrink-0">
 <Building2 className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5 flex-wrap">
 <h2 className="text-base font-black text-theme-main">
 {supplier.tradeName}
 </h2>
 <SupplierStatusBadge status={supplier.status} size="md" />
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-muted">
 {supplier.type} &bull; {supplier.preferredCurrency}
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5 font-mono">
 RFC: <strong className="text-theme-main">{supplier.rfc}</strong> &bull; Entrega estimada: <strong className="text-theme-main">{supplier.estimatedLeadDays} días</strong>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => {
 onClose();
 onOpenEditForm(supplier);
 }}
 className="px-3 py-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1.5 cursor-pointer"
 >
 <Edit3 className="w-3.5 h-3.5" />
 <span>Editar</span>
 </button>

 <button
 onClick={onClose}
 className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Sub-Tabs Switcher */}
 <div className="px-6 py-2 bg-theme-muted/40 border-b border-theme-subtle flex items-center gap-1.5 overflow-x-auto">
 {tabs.map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => setActiveTab(t.id)}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
 activeTab === t.id
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted/80'
 }`}
 >
 {t.label}
 </button>
 ))}
 </div>

 {/* Modal Content Body */}
 <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
 
 {/* ========================================================================= */}
 {/* TAB 1: RESUMEN */}
 {/* ========================================================================= */}
 {activeTab === 'resumen' && (
 <div className="space-y-6 animate-in fade-in duration-150">
 
 {/* Notice if inactive */}
 {supplier.status === 'Inactivo' && (
 <div className="p-4 rounded-2xl bg-zinc-500/10 border border-zinc-500/30 flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
 <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
 <span>Este proveedor se encuentra <strong>Inactivo</strong>. No aparecerá como sugerido para nuevas requisiciones u órdenes de compra.</span>
 </div>
 )}

 {/* Grid General & Fiscal */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Razón Social</span>
 <strong className="text-xs font-bold text-theme-main block truncate" title={supplier.legalName}>
 {supplier.legalName}
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">RFC / ID Fiscal</span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {supplier.rfc}
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Condición de Pago</span>
 <strong className="text-xs font-bold text-theme-main block">
 {supplier.paymentCondition} ({supplier.creditDays}d)
 </strong>
 </div>

 <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Tiempo de Entrega</span>
 <strong className="text-xs font-mono font-bold text-theme-main block">
 {supplier.estimatedLeadDays} días hábiles
 </strong>
 </div>
 </div>

 {/* Contact & Commercial Notes */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
 <span className="text-[10px] uppercase font-black tracking-wider text-theme-muted flex items-center gap-1.5">
 <User className="w-3.5 h-3.5 text-theme-primary" />
 Contacto Principal
 </span>
 {primaryContact ? (
 <div className="space-y-1">
 <strong className="text-sm font-bold text-theme-main block">{primaryContact.name}</strong>
 <span className="text-xs text-theme-muted block">{primaryContact.position}</span>
 <div className="pt-1 flex flex-col gap-0.5 text-theme-muted">
 <span className="flex items-center gap-1.5 font-mono">
 <Mail className="w-3 h-3 text-theme-primary" />
 {primaryContact.email}
 </span>
 <span className="flex items-center gap-1.5 font-mono">
 <Phone className="w-3 h-3 text-theme-primary" />
 {primaryContact.phone}
 </span>
 </div>
 </div>
 ) : (
 <div className="p-3 bg-white border border-amber-500 rounded-xl text-zinc-900 shadow-2xs">
 <span>Sin contacto principal registrado.</span>
 <button
 type="button"
 onClick={() => setActiveTab('contactos')}
 className="text-xs font-bold text-theme-primary underline block mt-1 cursor-pointer"
 >
 + Agregar contacto ahora
 </button>
 </div>
 )}
 </div>

 <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
 <span className="text-[10px] uppercase font-black tracking-wider text-theme-muted flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5 text-theme-primary" />
 Acuerdos & Notas Comerciales
 </span>
 <p className="text-theme-main italic leading-relaxed">
 {supplier.commercialNotes || 'Sin notas comerciales registradas.'}
 </p>
 <span className="text-[10px] text-theme-muted block pt-1 border-t border-theme-subtle font-mono">
 Monto mínimo de pedido: ${supplier.minimumOrderAmount.toLocaleString('es-MX')} MXN &bull; Actualizado: {supplier.lastUpdatedTerms}
 </span>
 </div>
 </div>

 {/* Quick Articles Preview */}
 <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-black tracking-wider text-theme-muted flex items-center gap-1.5">
 <Layers className="w-3.5 h-3.5 text-theme-primary" />
 Artículos Surtidos por este Proveedor ({supplier.articles.length})
 </span>
 <button
 type="button"
 onClick={() => setActiveTab('articulos')}
 className="text-theme-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
 >
 <span>Gestionar artículos</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 <div className="flex items-center gap-2 flex-wrap pt-1">
 {supplier.articles.map((art) => (
 <span key={art.id} className="px-2.5 py-1 rounded-xl bg-theme-surface border border-theme-subtle text-[11px] font-semibold text-theme-main flex items-center gap-1.5">
 <span className="font-mono text-theme-primary">{art.articleSku}</span>
 {art.isPreferred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
 </span>
 ))}
 </div>
 </div>

 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 2: CONTACTOS */}
 {/* ========================================================================= */}
 {activeTab === 'contactos' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main">
 Directorio de Contactos ({supplier.contacts.length})
 </span>
 <button
 type="button"
 onClick={() => setContactModalOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Agregar contacto</span>
 </button>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Nombre</th>
 <th className="py-2.5 px-3">Puesto</th>
 <th className="py-2.5 px-3">Correo</th>
 <th className="py-2.5 px-3">Teléfono</th>
 <th className="py-2.5 px-3 text-center">Principal</th>
 <th className="py-2.5 px-3 text-center">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {supplier.contacts.map((c) => (
 <tr key={c.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-3 font-bold text-theme-main">{c.name}</td>
 <td className="py-3 px-3 text-theme-muted">{c.position}</td>
 <td className="py-3 px-3 font-mono text-theme-main">{c.email}</td>
 <td className="py-3 px-3 font-mono text-theme-muted">{c.phone}</td>
 <td className="py-3 px-3 text-center">
 {c.isPrimary ? (
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs inline-flex items-center gap-1">
 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
 Principal
 </span>
 ) : (
 <button
 type="button"
 onClick={() => {
 const updated = supplier.contacts.map((item) => ({
 ...item,
 isPrimary: item.id === c.id,
 }));
 onUpdateSupplier({ ...supplier, contacts: updated });
 }}
 className="text-[10px] text-theme-muted hover:text-theme-primary underline cursor-pointer"
 >
 Marcar principal
 </button>
 )}
 </td>
 <td className="py-3 px-3 text-center">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
 {c.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 3: DIRECCIONES */}
 {/* ========================================================================= */}
 {activeTab === 'direcciones' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main">
 Direcciones y Plantas ({supplier.addresses.length})
 </span>
 <button
 type="button"
 onClick={() => setAddressModalOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Agregar dirección</span>
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {supplier.addresses.map((addr) => (
 <div key={addr.id} className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5">
 <div className="flex items-center justify-between">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-muted">
 {addr.type}
 </span>
 <span className="text-[10px] font-mono text-theme-muted">CP {addr.postalCode}</span>
 </div>
 <strong className="text-xs font-bold text-theme-main block">
 {addr.street} #{addr.extNumber} {addr.intNumber ? `Int. ${addr.intNumber}` : ''}
 </strong>
 <p className="text-theme-muted">
 Col. {addr.neighborhood}, {addr.city}, {addr.state}, {addr.country}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 4: ARTÍCULOS */}
 {/* ========================================================================= */}
 {activeTab === 'articulos' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <div className="space-y-0.5">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
 Catálogo de Artículos Surtidos por el Proveedor
 </span>
 <span className="text-[11px] text-theme-muted block">
 Define los SKUs que este proveedor puede surtir y sus precios vigentes derivados de listas de precios activas.
 </span>
 </div>

 <button
 type="button"
 onClick={() => setArticleModalOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Relacionar artículo</span>
 </button>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">SKU Interno</th>
 <th className="py-2.5 px-3">Artículo Impresos RTM</th>
 <th className="py-2.5 px-3">SKU Proveedor</th>
 <th className="py-2.5 px-3 text-center">Unidad</th>
 <th className="py-2.5 px-3 text-right">Precio Vigente</th>
 <th className="py-2.5 px-3">Lista de Precios</th>
 <th className="py-2.5 px-3 text-center">Entrega</th>
 <th className="py-2.5 px-3 text-center">Preferido</th>
 <th className="py-2.5 px-3 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {supplier.articles.length === 0 ? (
 <tr>
 <td colSpan={9} className="py-8 text-center text-theme-muted text-xs">
 No hay artículos relacionados para este proveedor.
 </td>
 </tr>
 ) : (
 supplier.articles.map((art) => {
 const activePriceInfo = getSupplierArticleActivePrice(supplier, art.articleSku);
 return (
 <tr key={art.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {art.articleSku}
 </td>
 <td className="py-3 px-3">
 <div className="space-y-0.5">
 <strong className="text-theme-main font-bold block text-xs">{art.articleName}</strong>
 <span className="text-[10px] text-theme-muted">{art.brand} &bull; {art.size}</span>
 </div>
 </td>
 <td className="py-3 px-3 font-mono text-theme-muted whitespace-nowrap">
 {art.supplierSku}
 </td>
 <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
 {art.purchaseUnit || 'pza'}
 </td>
 <td className="py-3 px-3 text-right font-mono font-black text-theme-main whitespace-nowrap">
 {activePriceInfo ? (
 <span>
 ${activePriceInfo.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {supplier.preferredCurrency}
 </span>
 ) : (
 <span className="text-theme-muted font-normal italic">Sin precio vigente</span>
 )}
 </td>
 <td className="py-3 px-3 whitespace-nowrap">
 {activePriceInfo && activePriceInfo.hasActivePrice ? (
 <span className="px-2 py-0.5 rounded-full bg-white text-zinc-900 font-bold text-[10px] border border-emerald-600 shadow-2xs">
 {activePriceInfo.priceListName}
 </span>
 ) : (
 <span className="text-[10px] text-theme-muted">
 {activePriceInfo ? activePriceInfo.priceListName : 'Sin lista'}
 </span>
 )}
 </td>
 <td className="py-3 px-3 text-center font-mono text-theme-muted whitespace-nowrap">
 {art.estimatedLeadDays}d
 </td>
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <button
 type="button"
 onClick={() => {
 const updated = supplier.articles.map((a) =>
 a.id === art.id ? { ...a, isPreferred: !a.isPreferred } : a
 );
 onUpdateSupplier({ ...supplier, articles: updated });
 }}
 className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
 art.isPreferred
 ? 'bg-white text-zinc-900 border border-amber-500 shadow-2xs'
 : 'bg-theme-muted text-theme-muted hover:text-theme-main border border-transparent'
 }`}
 >
 {art.isPreferred ? '★ Preferido' : 'Alterno'}
 </button>
 </td>
 <td className="py-3 px-3 text-right whitespace-nowrap">
 <button
 type="button"
 onClick={() => {
 const updated = supplier.articles.filter((a) => a.id !== art.id);
 onUpdateSupplier({ ...supplier, articles: updated });
 }}
 className="p-1 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-primary-light cursor-pointer"
 title="Eliminar relación"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 5: LISTAS DE PRECIOS */}
 {/* ========================================================================= */}
 {activeTab === 'listas_precios' && (
 <PriceListsTab supplier={supplier} onUpdateSupplier={onUpdateSupplier} />
 )}

 {/* ========================================================================= */}
 {/* TAB 5: CONDICIONES COMERCIALES */}
 {/* ========================================================================= */}
 {activeTab === 'condiciones' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="p-5 rounded-3xl bg-theme-muted/30 border border-theme-subtle space-y-4">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Moneda de Facturación</span>
 <strong className="text-sm font-bold text-theme-main block">{supplier.preferredCurrency}</strong>
 </div>

 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Condición de Pago</span>
 <strong className="text-sm font-bold text-theme-main block">{supplier.paymentCondition}</strong>
 </div>

 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Días de Crédito</span>
 <strong className="text-sm font-mono font-bold text-theme-main block">{supplier.creditDays} días</strong>
 </div>

 <div className="space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Tiempo de Entrega</span>
 <strong className="text-sm font-mono font-bold text-theme-main block">{supplier.estimatedLeadDays} días</strong>
 </div>
 </div>

 <div className="pt-2 border-t border-theme-subtle space-y-1">
 <span className="text-[10px] uppercase font-bold text-theme-muted block">Notas Comerciales</span>
 <p className="text-theme-main italic leading-relaxed">
 {supplier.commercialNotes || 'Sin acuerdos especiales registrados.'}
 </p>
 </div>
 </div>
 </div>
 )}

 {/* ========================================================================= */}
 {/* TAB 6: DOCUMENTOS */}
 {/* ========================================================================= */}
 {activeTab === 'documentos' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main">
 Expediente Digital del Proveedor ({supplier.documents.length})
 </span>
 <button
 type="button"
 onClick={() => setDocModalOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 <span>Agregar documento</span>
 </button>
 </div>

 <div className="border border-theme-subtle rounded-2xl overflow-hidden shadow-xs">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-2.5 px-3">Documento</th>
 <th className="py-2.5 px-3">Tipo</th>
 <th className="py-2.5 px-3">Fecha de Carga</th>
 <th className="py-2.5 px-3">Vencimiento</th>
 <th className="py-2.5 px-3 text-center">Estado</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {supplier.documents.length === 0 ? (
 <tr>
 <td colSpan={5} className="py-8 text-center text-theme-muted text-xs">
 No hay documentos cargados.
 </td>
 </tr>
 ) : (
 supplier.documents.map((doc) => (
 <tr key={doc.id} className="hover:bg-theme-muted/30 transition-colors">
 <td className="py-3 px-3 font-bold text-theme-main">{doc.name}</td>
 <td className="py-3 px-3 text-theme-muted">{doc.type}</td>
 <td className="py-3 px-3 font-mono text-theme-muted">{doc.uploadedAt}</td>
 <td className="py-3 px-3 font-mono text-theme-main">{doc.expiresAt || 'Indefinido'}</td>
 <td className="py-3 px-3 text-center">
 <StatusBadge
 variant={
 doc.status === 'Vigente'
 ? 'success'
 : doc.status === 'Por vencer'
 ? 'warning'
 : 'danger'
 }
 label={doc.status}
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
 {/* TAB 7: HISTORIAL */}
 {/* ========================================================================= */}
 {activeTab === 'historial' && (
 <div className="space-y-4 animate-in fade-in duration-150">
 <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
 <History className="w-3.5 h-3.5 text-theme-primary" />
 Bitácora de Eventos & Auditoría
 </span>

 <div className="space-y-2.5">
 {supplier.timeline.map((entry) => (
 <div
 key={entry.id}
 className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
 >
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <strong className="text-theme-main font-bold">{entry.actor}</strong>
 <span className="text-[10px] text-theme-muted px-1.5 py-0.2 rounded bg-theme-muted">
 {entry.role}
 </span>
 </div>
 <p className="text-theme-main">{entry.action}</p>
 </div>

 <span className="text-[10px] font-mono text-theme-muted shrink-0">
 {entry.occurredAt}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}

 </div>

 {/* Footer Controls */}
 <div className="px-6 py-4 border-t border-theme-subtle bg-theme-muted/40 flex items-center justify-between text-xs">
 <button
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer border border-theme-subtle"
 >
 Cerrar
 </button>

 <button
 type="button"
 onClick={() => setStatusConfirmOpen(true)}
 className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
 supplier.status === 'Activo'
 ? 'bg-white hover:bg-theme-muted text-zinc-900 border border-theme-primary'
 : 'bg-emerald-600 hover:bg-emerald-700 text-white'
 }`}
 >
 {supplier.status === 'Activo' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
 <span>{supplier.status === 'Activo' ? 'Desactivar proveedor' : 'Reactivar proveedor'}</span>
 </button>
 </div>

 </div>
 </ModalPortal>

 {/* Submodal: Add Contact */}
 {contactModalOpen && (
 <ModalPortal onClose={() => setContactModalOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4 text-xs">
 <div className="flex items-center gap-2 text-theme-primary">
 <User className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Agregar Contacto</h3>
 </div>

 <div className="space-y-3">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Nombre Completo *</label>
 <input
 type="text"
 value={newContactName}
 onChange={(e) => setNewContactName(e.target.value)}
 placeholder="Ej. Carlos Martínez"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main focus:outline-none"
 />
 </div>

 <div>
 <label className="font-bold text-theme-muted block mb-1">Puesto / Cargo</label>
 <input
 type="text"
 value={newContactPosition}
 onChange={(e) => setNewContactPosition(e.target.value)}
 placeholder="Ej. Gerente de Ventas"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main focus:outline-none"
 />
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Email</label>
 <input
 type="email"
 value={newContactEmail}
 onChange={(e) => setNewContactEmail(e.target.value)}
 placeholder="contacto@demo.mx"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main focus:outline-none"
 />
 </div>
 <div>
 <label className="font-bold text-theme-muted block mb-1">Teléfono</label>
 <input
 type="tel"
 value={newContactPhone}
 onChange={(e) => setNewContactPhone(e.target.value)}
 placeholder="+52 81 0000 0000"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main focus:outline-none"
 />
 </div>
 </div>

 <label className="flex items-center gap-2 cursor-pointer pt-1">
 <input
 type="checkbox"
 checked={newContactIsPrimary}
 onChange={(e) => setNewContactIsPrimary(e.target.checked)}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 <span className="font-bold text-theme-main">Definir como contacto principal de compras</span>
 </label>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setContactModalOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleSaveContact}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Guardar contacto
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Submodal: Add Address */}
 {addressModalOpen && (
 <ModalPortal onClose={() => setAddressModalOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4 text-xs">
 <div className="flex items-center gap-2 text-theme-primary">
 <MapPin className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Agregar Dirección</h3>
 </div>

 <div className="space-y-2.5">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Tipo de Dirección</label>
 <select
 value={newAddrType}
 onChange={(e) => setNewAddrType(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 >
 <option value="Fiscal">Fiscal</option>
 <option value="Planta">Planta de Fabricación</option>
 <option value="Entrega">Centro de Entrega</option>
 <option value="Oficina">Oficina Comercial</option>
 </select>
 </div>

 <div>
 <label className="font-bold text-theme-muted block mb-1">Calle *</label>
 <input
 type="text"
 value={newAddrStreet}
 onChange={(e) => setNewAddrStreet(e.target.value)}
 placeholder="Ej. Av. Industrial"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Núm. Exterior</label>
 <input
 type="text"
 value={newAddrExt}
 onChange={(e) => setNewAddrExt(e.target.value)}
 placeholder="100"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>
 <div>
 <label className="font-bold text-theme-muted block mb-1">Colonia</label>
 <input
 type="text"
 value={newAddrCol}
 onChange={(e) => setNewAddrCol(e.target.value)}
 placeholder="Industrial"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Ciudad</label>
 <input
 type="text"
 value={newAddrCity}
 onChange={(e) => setNewAddrCity(e.target.value)}
 placeholder="Monterrey"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>
 <div>
 <label className="font-bold text-theme-muted block mb-1">Código Postal</label>
 <input
 type="text"
 value={newAddrCp}
 onChange={(e) => setNewAddrCp(e.target.value)}
 placeholder="64000"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>
 </div>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setAddressModalOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleSaveAddress}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Guardar dirección
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Submodal: Relate Article */}
 {articleModalOpen && (
 <ModalPortal onClose={() => setArticleModalOpen(false)}>
 <div className="w-full max-w-lg bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4 text-xs">
 <div className="flex items-center gap-2 text-theme-primary">
 <Layers className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Relacionar Artículo de Catálogo</h3>
 </div>

 <div className="space-y-3">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Buscar en Catálogo Maestro:</label>
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-muted" />
 <input
 type="text"
 value={articleSearchQuery}
 onChange={(e) => setArticleSearchQuery(e.target.value)}
 placeholder="Buscar por SKU, modelo o marca..."
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl pl-9 pr-3 py-2 text-theme-main focus:outline-none"
 />
 </div>

 {articleSearchQuery.trim() && (
 <div className="bg-theme-surface border border-theme-subtle rounded-xl shadow-lg mt-1 max-h-36 overflow-y-auto divide-y divide-theme-subtle">
 {MOCK_MASTER_ARTICLES.filter((a) =>
 a.name.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
 a.sku.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
 a.brand.toLowerCase().includes(articleSearchQuery.toLowerCase())
 ).map((art) => (
 <div
 key={art.id}
 onClick={() => {
 setSelectedCatalogArticle(art);
 setNewRelSupplierName(art.name);
 setNewRelSupplierSku(art.sku);
 setArticleSearchQuery(art.name);
 }}
 className="p-2 hover:bg-theme-muted/50 cursor-pointer"
 >
 <strong className="font-bold text-theme-main block">{art.name}</strong>
 <span className="text-[10px] font-mono text-theme-muted">{art.sku} &bull; {art.brand}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 {selectedCatalogArticle && (
 <div className="p-3 bg-white border border-theme-primary/40 rounded-xl space-y-2 shadow-2xs">
 <div>
 <span className="text-[10px] font-mono text-theme-primary font-bold">{selectedCatalogArticle.sku}</span>
 <strong className="text-xs font-bold text-theme-main block">{selectedCatalogArticle.name}</strong>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="text-[10px] font-bold text-theme-muted block">Precio Referencia (MXN):</label>
 <input
 type="number"
 value={newRelPrice}
 onChange={(e) => setNewRelPrice(parseFloat(e.target.value) || 0)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-lg px-2 py-1 font-mono font-bold"
 />
 </div>

 <div>
 <label className="text-[10px] font-bold text-theme-muted block">Tiempo Entrega (días):</label>
 <input
 type="number"
 value={newRelLeadDays}
 onChange={(e) => setNewRelLeadDays(parseInt(e.target.value) || 1)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-lg px-2 py-1 font-mono font-bold"
 />
 </div>
 </div>

 <label className="flex items-center gap-2 cursor-pointer pt-1">
 <input
 type="checkbox"
 checked={newRelIsPreferred}
 onChange={(e) => setNewRelIsPreferred(e.target.checked)}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 <span className="font-bold text-theme-main">Marcar como proveedor preferido para este SKU</span>
 </label>
 </div>
 )}
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setArticleModalOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 disabled={!selectedCatalogArticle}
 onClick={handleSaveArticleRelation}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer disabled:opacity-50"
 >
 Relacionar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Submodal: Add Document */}
 {docModalOpen && (
 <ModalPortal onClose={() => setDocModalOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4 text-xs">
 <div className="flex items-center gap-2 text-theme-primary">
 <FileCheck2 className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">Registrar Documento</h3>
 </div>

 <div className="space-y-3">
 <div>
 <label className="font-bold text-theme-muted block mb-1">Nombre del Documento *</label>
 <input
 type="text"
 value={newDocName}
 onChange={(e) => setNewDocName(e.target.value)}
 placeholder="Ej. Constancia de Situación Fiscal 2026"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 />
 </div>

 <div>
 <label className="font-bold text-theme-muted block mb-1">Tipo de Documento</label>
 <select
 value={newDocType}
 onChange={(e) => setNewDocType(e.target.value as any)}
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 text-theme-main"
 >
 <option value="Constancia Fiscal">Constancia Fiscal</option>
 <option value="Datos Bancarios">Datos Bancarios</option>
 <option value="Convenio Comercial">Convenio Comercial</option>
 <option value="Certificación">Certificación de Calidad</option>
 <option value="Identificación">Identificación Oficial</option>
 <option value="Otro">Otro</option>
 </select>
 </div>

 <div>
 <label className="font-bold text-theme-muted block mb-1">Fecha de Vencimiento (Opcional):</label>
 <input
 type="text"
 value={newDocExpires}
 onChange={(e) => setNewDocExpires(e.target.value)}
 placeholder="Ej. 31 Dic 2026"
 className="w-full bg-theme-muted border border-theme-subtle rounded-xl p-2 font-mono text-theme-main"
 />
 </div>
 </div>

 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setDocModalOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleSaveDocument}
 className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold cursor-pointer"
 >
 Registrar documento
 </button>
 </div>
 </div>
 </ModalPortal>
 )}

 {/* Confirmation Modal: Toggle Status */}
 {statusConfirmOpen && (
 <ModalPortal onClose={() => setStatusConfirmOpen(false)}>
 <div className="w-full max-w-md bg-theme-surface rounded-3xl p-6 shadow-2xl border border-theme-subtle space-y-4 text-xs">
 <div className="flex items-center gap-2 text-amber-600">
 <AlertTriangle className="w-5 h-5" />
 <h3 className="text-sm font-black text-theme-main">
 {supplier.status === 'Activo' ? '¿Desactivar Proveedor?' : '¿Reactivar Proveedor?'}
 </h3>
 </div>
 <p className="text-theme-muted leading-relaxed">
 {supplier.status === 'Activo'
 ? `El proveedor "${supplier.tradeName}" dejará de sugerirse para nuevas compras y órdenes. Su historial y registros se conservarán intactos.`
 : `El proveedor "${supplier.tradeName}" volverá a estar disponible como opción activa para compras y requisiciones.`}
 </p>
 <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme-subtle">
 <button
 onClick={() => setStatusConfirmOpen(false)}
 className="px-3.5 py-2 rounded-xl bg-theme-muted text-theme-main font-semibold cursor-pointer"
 >
 Cancelar
 </button>
 <button
 onClick={handleToggleSupplierStatus}
 className={`px-4 py-2 rounded-xl font-bold cursor-pointer text-white ${
 supplier.status === 'Activo' ? 'bg-emerald-600' : 'bg-theme-muted'
 }`}
 >
 Confirmar
 </button>
 </div>
 </div>
 </ModalPortal>
 )}
 </>
 );
};
