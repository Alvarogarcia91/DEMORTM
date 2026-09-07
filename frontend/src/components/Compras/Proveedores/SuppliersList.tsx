import React, { useState } from 'react';
import {
 Search,
 X,
 Building2,
 Calendar,
 User,
 Truck,
 Eye,
 Edit3,
 DollarSign,
 Clock,
 Layers,
 AlertTriangle,
 Mail,
 Phone
} from 'lucide-react';
import {
 SupplierMaster,
 SupplierType,
 SupplierStatus,
 PaymentCondition
} from '../../../data/mockSuppliersData';
import { SupplierStatusBadge } from './SupplierStatusBadge';

interface SuppliersListProps {
 suppliers: SupplierMaster[];
 onOpenCreateModal?: () => void;
 onSelectSupplier: (supplier: SupplierMaster) => void;
 onOpenEditModal: (supplier: SupplierMaster) => void;
}

export const SuppliersList: React.FC<SuppliersListProps> = ({
 suppliers,
 onOpenCreateModal,
 onSelectSupplier,
 onOpenEditModal,
}) => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedType, setSelectedType] = useState<string>('ALL');
 const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
 const [selectedPaymentCondition, setSelectedPaymentCondition] = useState<string>('ALL');
 const [showInactive, setShowInactive] = useState(false);

 // Filter suppliers
 const filteredSuppliers = suppliers.filter((sup) => {
 // Search query
 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 const matchTrade = sup.tradeName.toLowerCase().includes(q);
 const matchLegal = sup.legalName.toLowerCase().includes(q);
 const matchRfc = sup.rfc.toLowerCase().includes(q);
 const matchContact = sup.contacts.some(
 (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
 );
    const matchArticle = sup.articles.some(
      (a) =>
        (a.articleName || '').toLowerCase().includes(q) ||
        a.articleSku.toLowerCase().includes(q) ||
        a.supplierSku.toLowerCase().includes(q)
    );

 if (!matchTrade && !matchLegal && !matchRfc && !matchContact && !matchArticle) {
 return false;
 }
 }

 // Type filter
 if (selectedType !== 'ALL' && sup.type !== selectedType) {
 return false;
 }

 // Status filter
 if (selectedStatus !== 'ALL' && sup.status !== selectedStatus) {
 return false;
 }

 // Payment condition filter
 if (selectedPaymentCondition !== 'ALL' && sup.paymentCondition !== selectedPaymentCondition) {
 return false;
 }

 // Inactive filter checkbox
 if (!showInactive && selectedStatus === 'ALL' && sup.status === 'Inactivo') {
 return false;
 }

 return true;
 });

 return (
 <div className="space-y-4">
 
 {/* Search & Filter Toolbar */}
 <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
 <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
 
 {/* Search Box */}
 <div className="relative flex-1 w-full">
 <Search className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Buscar proveedor, contacto, artículo o RFC..."
 className="w-full bg-theme-muted/50 border border-theme-subtle rounded-2xl pl-9 pr-8 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
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

 {/* Quick Filter Selects */}
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 
 {/* Tipo */}
 <select
 value={selectedType}
 onChange={(e) => setSelectedType(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los tipos</option>
 <option value="Nacional">Nacionales</option>
 <option value="Extranjero">Extranjeros</option>
 </select>

 {/* Condición */}
 <select
 value={selectedPaymentCondition}
 onChange={(e) => setSelectedPaymentCondition(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todas las condiciones</option>
 <option value="Crédito">Crédito</option>
 <option value="Contado">Contado</option>
 <option value="Contra entrega">Contra entrega</option>
 <option value="Anticipo">Anticipo</option>
 </select>

 {/* Estado */}
 <select
 value={selectedStatus}
 onChange={(e) => setSelectedStatus(e.target.value)}
 className="bg-theme-muted border border-theme-subtle rounded-2xl px-3 py-2 text-xs font-semibold text-theme-main focus:outline-none cursor-pointer"
 >
 <option value="ALL">Todos los estados</option>
 <option value="Activo">Activos</option>
 <option value="Inactivo">Inactivos</option>
 </select>
 </div>
 </div>

 {/* Checkbox Fast Filter */}
 <div className="flex items-center justify-between pt-2 border-t border-theme-subtle text-xs text-theme-muted">
 <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-theme-main select-none">
 <input
 type="checkbox"
 checked={showInactive}
 onChange={(e) => setShowInactive(e.target.checked)}
 className="rounded text-theme-primary focus:ring-theme-primary cursor-pointer"
 />
 <span>Mostrar proveedores inactivos</span>
 </label>

 <span className="text-[11px] font-mono">
 {filteredSuppliers.length} de {suppliers.length} proveedores registrados
 </span>
 </div>
 </div>

 {/* Main Table */}
 <div className="bg-theme-surface border border-theme-subtle rounded-3xl overflow-hidden shadow-xs">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs border-collapse">
 <thead>
 <tr className="bg-theme-muted/60 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
 <th className="py-3 px-4">Proveedor</th>
 <th className="py-3 px-3">RFC / ID Fiscal</th>
 <th className="py-3 px-3">Tipo</th>
 <th className="py-3 px-3">Moneda</th>
 <th className="py-3 px-3">Condición</th>
 <th className="py-3 px-3 text-center">Crédito</th>
 <th className="py-3 px-3 text-center">Tiempo Entrega</th>
 <th className="py-3 px-3">Contacto Principal</th>
 <th className="py-3 px-3 text-center">Artículos</th>
 <th className="py-3 px-3">Estado</th>
 <th className="py-3 px-4 text-right">Acción</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-theme-subtle font-sans">
 {filteredSuppliers.length === 0 ? (
 <tr>
 <td colSpan={11} className="py-12 text-center text-theme-muted text-xs">
 No se encontraron proveedores con los filtros seleccionados.
 </td>
 </tr>
 ) : (
 filteredSuppliers.map((sup) => {
 const primaryContact = sup.contacts.find((c) => c.isPrimary) || sup.contacts[0];

 return (
 <tr key={sup.id} className="hover:bg-theme-muted/30 transition-colors">
 {/* Proveedor */}
 <td className="py-3 px-4 whitespace-nowrap min-w-[200px]">
 <div className="space-y-0.5">
 <button
 type="button"
 onClick={() => onSelectSupplier(sup)}
 className="font-bold text-theme-main hover:underline text-left block text-xs cursor-pointer"
 >
 {sup.tradeName}
 </button>
 <span className="text-[10px] text-theme-muted block truncate max-w-[200px]" title={sup.legalName}>
 {sup.legalName}
 </span>
 </div>
 </td>

 {/* RFC */}
 <td className="py-3 px-3 font-mono font-bold text-theme-primary whitespace-nowrap">
 {sup.rfc}
 </td>

 {/* Tipo */}
 <td className="py-3 px-3 whitespace-nowrap">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted text-theme-muted">
 {sup.type}
 </span>
 </td>

 {/* Moneda */}
 <td className="py-3 px-3 font-mono font-bold text-theme-main whitespace-nowrap">
 {sup.preferredCurrency}
 </td>

 {/* Condición */}
 <td className="py-3 px-3 whitespace-nowrap font-semibold text-theme-main">
 {sup.paymentCondition}
 </td>

 {/* Crédito */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
 {sup.creditDays > 0 ? `${sup.creditDays}d` : '—'}
 </td>

 {/* Tiempo Entrega */}
 <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold text-theme-main">
 {sup.estimatedLeadDays} días
 </td>

 {/* Contacto Principal */}
 <td className="py-3 px-3 whitespace-nowrap">
 {primaryContact ? (
 <div className="space-y-0.5">
 <span className="font-semibold text-theme-main block">{primaryContact.name}</span>
 <span className="text-[10px] font-mono text-theme-muted block">{primaryContact.phone}</span>
 </div>
 ) : (
 <span className="text-amber-600 text-[10px] italic">Sin contacto</span>
 )}
 </td>

 {/* Artículos */}
 <td className="py-3 px-3 text-center whitespace-nowrap">
 <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-white text-zinc-900 border border-theme-subtle shadow-2xs">
 {sup.articles.length}
 </span>
 </td>

 {/* Estado */}
 <td className="py-3 px-3 whitespace-nowrap">
 <SupplierStatusBadge status={sup.status} size="sm" />
 </td>

 {/* Acciones */}
 <td className="py-3 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1.5">
 <button
 type="button"
 onClick={() => onOpenEditModal(sup)}
 className="p-1.5 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main transition-colors cursor-pointer"
 title="Editar proveedor"
 >
 <Edit3 className="w-3.5 h-3.5" />
 </button>

 <button
 type="button"
 onClick={() => onSelectSupplier(sup)}
 className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-xs font-bold border border-theme-subtle flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 <span>Detalle</span>
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

 </div>
 );
};
