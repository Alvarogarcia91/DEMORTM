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
 CheckCircle2,
 AlertCircle
} from 'lucide-react';
import {
 SupplierMaster,
 SupplierType,
 SupplierStatus,
 PaymentCondition,
 SupplierContact,
 SupplierTimelineEntry
} from '../../../data/mockSuppliersData';
import { ModalPortal } from '../../common/ModalPortal';

interface SupplierFormModalProps {
 initialSupplier?: SupplierMaster | null;
 onClose: () => void;
 onSave: (savedSupplier: SupplierMaster) => void;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
 initialSupplier,
 onClose,
 onSave,
}) => {
 // General Info
 const [tradeName, setTradeName] = useState(initialSupplier?.tradeName || '');
 const [legalName, setLegalName] = useState(initialSupplier?.legalName || '');
 const [rfc, setRfc] = useState(initialSupplier?.rfc || '');
 const [type, setType] = useState<SupplierType>(initialSupplier?.type || 'Nacional');
 const [status, setStatus] = useState<SupplierStatus>(initialSupplier?.status || 'Activo');
 const [preferredCurrency, setPreferredCurrency] = useState<'MXN' | 'USD'>(
 initialSupplier?.preferredCurrency || 'MXN'
 );

 // Commercial Conditions
 const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>(
 initialSupplier?.paymentCondition || 'Crédito'
 );
 const [creditDays, setCreditDays] = useState<number>(initialSupplier?.creditDays ?? 30);
 const [estimatedLeadDays, setEstimatedLeadDays] = useState<number>(
 initialSupplier?.estimatedLeadDays ?? 4
 );
 const [minimumOrderAmount, setMinimumOrderAmount] = useState<number>(
 initialSupplier?.minimumOrderAmount ?? 20000
 );
 const [commercialNotes, setCommercialNotes] = useState(
 initialSupplier?.commercialNotes || ''
 );

 // Primary Contact (if creating or editing primary)
 const primaryContact = initialSupplier?.contacts.find((c) => c.isPrimary);
 const [contactName, setContactName] = useState(primaryContact?.name || '');
 const [contactPosition, setContactPosition] = useState(primaryContact?.position || 'Ejecutivo de Cuenta');
 const [contactEmail, setContactEmail] = useState(primaryContact?.email || '');
 const [contactPhone, setContactPhone] = useState(primaryContact?.phone || '');

 const [errorMessage, setErrorMessage] = useState('');

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!tradeName.trim()) {
 setErrorMessage('El nombre comercial es obligatorio.');
 return;
 }

 const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
 const isEdit = Boolean(initialSupplier);

 // Prepare contacts array
 let updatedContacts: SupplierContact[] = initialSupplier?.contacts ? [...initialSupplier.contacts] : [];
 if (contactName.trim()) {
 if (primaryContact) {
 updatedContacts = updatedContacts.map((c) =>
 c.id === primaryContact.id
 ? {
 ...c,
 name: contactName.trim(),
 position: contactPosition.trim(),
 email: contactEmail.trim(),
 phone: contactPhone.trim(),
 }
 : c
 );
 } else {
 const newContact: SupplierContact = {
 id: `c-${Date.now()}`,
 name: contactName.trim(),
 position: contactPosition.trim() || 'Contacto Comercial',
 email: contactEmail.trim(),
 phone: contactPhone.trim(),
 isPrimary: true,
 status: 'Activo',
 };
 updatedContacts.push(newContact);
 }
 }

 const generatedRfc = rfc.trim() || `DEMO-${tradeName.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

 const timelineEntry: SupplierTimelineEntry = {
 id: `t-${Date.now()}`,
 occurredAt: `27 Ago ${now}`,
 actor: 'Admin Demo',
 role: 'Gerencia de Compras',
 action: isEdit ? 'Actualizó datos del proveedor' : 'Alta de nuevo proveedor en catálogo maestro',
 type: isEdit ? 'terms_updated' : 'created',
 };

 const supplierData: SupplierMaster = {
 id: initialSupplier?.id || `sup-${Date.now()}`,
 tradeName: tradeName.trim(),
 legalName: legalName.trim() || `${tradeName.trim()} S.A. de C.V. (Demo)`,
 rfc: generatedRfc,
 type,
 status,
 preferredCurrency,
 paymentCondition,
 creditDays: paymentCondition === 'Crédito' ? creditDays : 0,
 estimatedLeadDays: Math.max(1, estimatedLeadDays),
 minimumOrderAmount: Math.max(0, minimumOrderAmount),
 commercialNotes: commercialNotes.trim() || undefined,
 lastUpdatedTerms: '27 Ago 2026',
 contacts: updatedContacts,
 addresses: initialSupplier?.addresses || [],
 articles: initialSupplier?.articles || [],
 priceLists: initialSupplier?.priceLists || [],
 documents: initialSupplier?.documents || [],
 timeline: [timelineEntry, ...(initialSupplier?.timeline || [])],
 };

 onSave(supplierData);
 onClose();
 };

 return (
 <ModalPortal onClose={onClose}>
 <div className="w-full max-w-4xl bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh]">
 
 {/* Header */}
 <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center font-bold text-sm border border-rose-500 shadow-2xs shrink-0">
 <Truck className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2.5">
 <h2 className="text-base font-black text-theme-main">
 {initialSupplier ? `Editar Proveedor: ${initialSupplier.tradeName}` : 'Nuevo Proveedor'}
 </h2>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-900 border border-rose-500 shadow-2xs">
 Catálogo Maestro
 </span>
 </div>
 <p className="text-xs text-theme-muted mt-0.5">
 Registra la información general, condiciones comerciales y contacto del proveedor.
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
 <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
 
 {errorMessage && (
 <div className="p-3.5 rounded-2xl bg-white border border-rose-500 shadow-2xs flex items-center gap-2 text-zinc-900 font-bold">
 <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
 <span>{errorMessage}</span>
 </div>
 )}

 {/* SECTION 1: DATOS GENERALES */}
 <div className="bg-theme-muted/30 p-5 border border-theme-subtle rounded-3xl space-y-4">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
 <Building2 className="w-3.5 h-3.5 text-theme-primary" />
 Datos Generales & Fiscales
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
 
 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Nombre Comercial *</label>
 <input
 type="text"
 required
 value={tradeName}
 onChange={(e) => setTradeName(e.target.value)}
 placeholder="Ej. Nayt México"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Razón Social</label>
 <input
 type="text"
 value={legalName}
 onChange={(e) => setLegalName(e.target.value)}
 placeholder="Ej. Distribuidora Nayt S.A. de C.V."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">RFC / Identificador Fiscal (Mock)</label>
 <input
 type="text"
 value={rfc}
 onChange={(e) => setRfc(e.target.value)}
 placeholder="Ej. DEMO-NAYT-001"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/30"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Tipo de Proveedor</label>
 <select
 value={type}
 onChange={(e) => setType(e.target.value as SupplierType)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="Nacional">Nacional</option>
 <option value="Extranjero">Extranjero</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Moneda Preferida</label>
 <select
 value={preferredCurrency}
 onChange={(e) => setPreferredCurrency(e.target.value as any)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="MXN">MXN (Pesos Mexicanos)</option>
 <option value="USD">USD (Dólares Americanos)</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Estado en Sistema</label>
 <select
 value={status}
 onChange={(e) => setStatus(e.target.value as SupplierStatus)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="Activo">Activo</option>
 <option value="Inactivo">Inactivo</option>
 </select>
 </div>

 </div>
 </div>

 {/* SECTION 2: CONDICIONES COMERCIALES */}
 <div className="bg-theme-muted/30 p-5 border border-theme-subtle rounded-3xl space-y-4">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
 <DollarSign className="w-3.5 h-3.5 text-theme-primary" />
 Condiciones Comerciales & Logísticas
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
 
 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Condición de Pago</label>
 <select
 value={paymentCondition}
 onChange={(e) => setPaymentCondition(e.target.value as PaymentCondition)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-bold text-theme-main cursor-pointer"
 >
 <option value="Crédito">Crédito Comercial</option>
 <option value="Contado">Contado</option>
 <option value="Contra entrega">Contra entrega</option>
 <option value="Anticipo">Anticipo</option>
 <option value="Otra">Otra</option>
 </select>
 </div>

 {paymentCondition === 'Crédito' && (
 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Días de Crédito</label>
 <input
 type="number"
 min="0"
 value={creditDays}
 onChange={(e) => setCreditDays(parseInt(e.target.value) || 0)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main"
 />
 </div>
 )}

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Tiempo Estimado de Entrega (Días)</label>
 <input
 type="number"
 min="1"
 value={estimatedLeadDays}
 onChange={(e) => setEstimatedLeadDays(parseInt(e.target.value) || 1)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Monto Mínimo de Pedido (MXN)</label>
 <input
 type="number"
 min="0"
 step="1000"
 value={minimumOrderAmount}
 onChange={(e) => setMinimumOrderAmount(parseFloat(e.target.value) || 0)}
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono font-bold text-theme-main"
 />
 </div>

 </div>

 <div className="space-y-1 pt-1 border-t border-theme-subtle">
 <label className="font-bold text-theme-muted">Notas Comerciales / Acuerdos</label>
 <textarea
 rows={2}
 value={commercialNotes}
 onChange={(e) => setCommercialNotes(e.target.value)}
 placeholder="Ej. Descuento del 3% por pronto pago o entrega consolidada en CEDIS..."
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl p-3 text-xs text-theme-main focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
 />
 </div>
 </div>

 {/* SECTION 3: CONTACTO PRINCIPAL */}
 <div className="bg-theme-muted/30 p-5 border border-theme-subtle rounded-3xl space-y-4">
 <span className="text-[10px] font-black uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
 <User className="w-3.5 h-3.5 text-theme-primary" />
 Contacto Principal de Cuenta
 </span>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Nombre Completo</label>
 <input
 type="text"
 value={contactName}
 onChange={(e) => setContactName(e.target.value)}
 placeholder="Ej. Laura Martínez"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-semibold text-theme-main"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Puesto / Cargo</label>
 <input
 type="text"
 value={contactPosition}
 onChange={(e) => setContactPosition(e.target.value)}
 placeholder="Ej. Ejecutiva de Cuenta"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs text-theme-main"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Correo Electrónico</label>
 <input
 type="email"
 value={contactEmail}
 onChange={(e) => setContactEmail(e.target.value)}
 placeholder="ejemplo@proveedor.mx"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main"
 />
 </div>

 <div className="space-y-1">
 <label className="font-bold text-theme-muted">Teléfono de Contacto</label>
 <input
 type="tel"
 value={contactPhone}
 onChange={(e) => setContactPhone(e.target.value)}
 placeholder="+52 81 0000 0000"
 className="w-full bg-theme-surface border border-theme-subtle rounded-xl px-3 py-2 text-xs font-mono text-theme-main"
 />
 </div>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="pt-2 flex items-center justify-between border-t border-theme-subtle">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-semibold cursor-pointer border border-theme-subtle"
 >
 Cancelar
 </button>

 <button
 type="submit"
 className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
 >
 <CheckCircle2 className="w-4 h-4" />
 <span>{initialSupplier ? 'Guardar Cambios' : 'Guardar Proveedor'}</span>
 </button>
 </div>

 </form>

 </div>
 </ModalPortal>
 );
};
