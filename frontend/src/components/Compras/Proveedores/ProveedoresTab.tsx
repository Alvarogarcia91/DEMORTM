import React, { useState } from 'react';
import {
 LayoutDashboard,
 Building2,
 Plus
} from 'lucide-react';
import {
 SupplierMaster,
 INITIAL_MOCK_SUPPLIERS
} from '../../../data/mockSuppliersData';
import { SuppliersDashboard } from './SuppliersDashboard';
import { SuppliersList } from './SuppliersList';
import { SupplierFormModal } from './SupplierFormModal';
import { SupplierDetailModal } from './SupplierDetailModal';

export type ProveedoresSubTab = 'resumen' | 'proveedores';

interface ProveedoresTabProps {
 suppliers?: SupplierMaster[];
 onSetSuppliers?: React.Dispatch<React.SetStateAction<SupplierMaster[]>>;
}

export const ProveedoresTab: React.FC<ProveedoresTabProps> = ({
 suppliers: externalSuppliers,
 onSetSuppliers: externalSetSuppliers,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<ProveedoresSubTab>('resumen');
 
 const [localSuppliers, setLocalSuppliers] = useState<SupplierMaster[]>(INITIAL_MOCK_SUPPLIERS);
 const suppliers = externalSuppliers || localSuppliers;
 const setSuppliers = externalSetSuppliers || setLocalSuppliers;

 // Modal states
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingSupplier, setEditingSupplier] = useState<SupplierMaster | null>(null);
 const [selectedSupplier, setSelectedSupplier] = useState<SupplierMaster | null>(null);
 const [selectedInitialTab, setSelectedInitialTab] = useState<
 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial'
 >('resumen');

 // Handlers
 const handleOpenCreateNew = () => {
 setEditingSupplier(null);
 setIsFormOpen(true);
 };

 const handleOpenEdit = (sup: SupplierMaster) => {
 setEditingSupplier(sup);
 setIsFormOpen(true);
 };

 const handleSelectSupplierWithTab = (
 sup: SupplierMaster,
 tab: 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial'
 ) => {
 setSelectedSupplier(sup);
 setSelectedInitialTab(tab);
 };

 const handleSaveSupplier = (savedSupplier: SupplierMaster) => {
 setSuppliers((prev) => {
 const exists = prev.some((s) => s.id === savedSupplier.id);
 if (exists) {
 return prev.map((s) => (s.id === savedSupplier.id ? savedSupplier : s));
 }
 return [savedSupplier, ...prev];
 });

 if (selectedSupplier && selectedSupplier.id === savedSupplier.id) {
 setSelectedSupplier(savedSupplier);
 }
 };

 const handleUpdateSupplier = (updated: SupplierMaster) => {
 setSuppliers((prev) =>
 prev.map((s) => (s.id === updated.id ? updated : s))
 );
 setSelectedSupplier(updated);
 };

 const subTabs = [
 { id: 'resumen' as const, label: 'Resumen', icon: LayoutDashboard },
 {
 id: 'proveedores' as const,
 label: 'Proveedores',
 icon: Building2,
 count: suppliers.length,
 },
 ];

 return (
 <div className="space-y-6">
 
 {/* Sub-Navigation Tabs */}
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3 gap-3 flex-wrap">
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle">
 {subTabs.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeSubTab === tab.id;

 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveSubTab(tab.id)}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
 isActive
 ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
 }`}
 >
 <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`} />
 <span>{tab.label}</span>
 {tab.count !== undefined && (
 <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
 isActive ? 'bg-theme-primary/10 text-theme-primary' : 'bg-theme-muted text-theme-muted'
 }`}>
 {tab.count}
 </span>
 )}
 </button>
 );
 })}
 </div>

 <button
 type="button"
 onClick={handleOpenCreateNew}
 className="px-4 py-2 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
 >
 <Plus className="w-4 h-4" />
 <span>Nuevo proveedor</span>
 </button>
 </div>

 {/* Subview Content */}
 {activeSubTab === 'resumen' && (
 <SuppliersDashboard
 suppliers={suppliers}
 onOpenCreateModal={handleOpenCreateNew}
 onSelectSupplierWithTab={handleSelectSupplierWithTab}
 onNavigateSubTab={(tab) => setActiveSubTab(tab)}
 />
 )}

 {activeSubTab === 'proveedores' && (
 <SuppliersList
 suppliers={suppliers}
 onOpenCreateModal={handleOpenCreateNew}
 onSelectSupplier={(sup) => handleSelectSupplierWithTab(sup, 'resumen')}
 onOpenEditModal={handleOpenEdit}
 />
 )}

 {/* Form Modal (Create / Edit) */}
 {isFormOpen && (
 <SupplierFormModal
 initialSupplier={editingSupplier}
 onClose={() => {
 setIsFormOpen(false);
 setEditingSupplier(null);
 }}
 onSave={handleSaveSupplier}
 />
 )}

 {/* Detail Modal (7 Tabs) */}
 {selectedSupplier && (
 <SupplierDetailModal
 supplier={selectedSupplier}
 initialTab={selectedInitialTab}
 onClose={() => setSelectedSupplier(null)}
 onUpdateSupplier={handleUpdateSupplier}
 onOpenEditForm={handleOpenEdit}
 />
 )}

 </div>
 );
};
