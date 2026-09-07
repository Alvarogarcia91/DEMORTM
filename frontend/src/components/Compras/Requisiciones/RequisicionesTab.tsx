import React, { useState } from 'react';
import {
 LayoutDashboard,
 FileText,
 Sparkles,
 Plus,
 ArrowRight
} from 'lucide-react';
import {
 Requisition,
 ReorderSuggestion,
 INITIAL_MOCK_REQUISITIONS,
 INITIAL_MOCK_REORDER_SUGGESTIONS
} from '../../../data/mockRequisitionsData';
import { RequisicionesDashboard } from './RequisicionesDashboard';
import { RequisitionsList } from './RequisitionsList';
import { ReorderSuggestionsList } from './ReorderSuggestionsList';
import { RequisitionFormModal } from './RequisitionFormModal';
import { RequisitionDetailModal } from './RequisitionDetailModal';

export type RequisitionSubTab = 'dashboard' | 'resumen' | 'requisiciones' | 'sugerencias';

interface RequisicionesTabProps {
 onNavigateToPurchasesTab?: () => void;
 requisitions?: Requisition[];
 onSetRequisitions?: React.Dispatch<React.SetStateAction<Requisition[]>>;
}

export const RequisicionesTab: React.FC<RequisicionesTabProps> = ({
 onNavigateToPurchasesTab,
 requisitions: externalRequisitions,
 onSetRequisitions: externalSetRequisitions,
}) => {
 const [activeSubTab, setActiveSubTab] = useState<RequisitionSubTab>('dashboard');
 
 // State for requisitions and suggestions
 const [localRequisitions, setLocalRequisitions] = useState<Requisition[]>(INITIAL_MOCK_REQUISITIONS);
 const requisitions = externalRequisitions || localRequisitions;
 const setRequisitions = externalSetRequisitions || setLocalRequisitions;

 const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>(INITIAL_MOCK_REORDER_SUGGESTIONS);

 // Modals state
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingRequisition, setEditingRequisition] = useState<Requisition | null>(null);
 const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
 const [prefilledItem, setPrefilledItem] = useState<{
 sku: string;
 productName: string;
 brand: string;
 size?: string;
 category?: string;
 quantity: number;
 targetWarehouseId: string;
 suggestedSupplier?: string;
 note?: string;
 } | null>(null);

 // Handlers
 const handleOpenCreateNew = () => {
 setEditingRequisition(null);
 setPrefilledItem(null);
 setIsFormOpen(true);
 };

 const handleOpenEdit = (req: Requisition) => {
 setEditingRequisition(req);
 setPrefilledItem(null);
 setIsFormOpen(true);
 };

 const handleCreateFromSuggestion = (sug: ReorderSuggestion) => {
 setEditingRequisition(null);
 setPrefilledItem({
 sku: sug.sku,
 productName: sug.productName,
 brand: sug.brand,
 size: sug.size,
 category: sug.category,
 quantity: sug.suggestedQuantity,
 targetWarehouseId: sug.targetWarehouseId,
 suggestedSupplier: sug.suggestedSupplier,
 note: `Generada desde sugerencia de reorden (${sug.status}).`,
 });
 setIsFormOpen(true);
 };

 const handleSaveRequisition = (savedReq: Requisition) => {
 setRequisitions((prev) => {
 const exists = prev.some((r) => r.id === savedReq.id);
 if (exists) {
 return prev.map((r) => (r.id === savedReq.id ? savedReq : r));
 }
 return [savedReq, ...prev];
 });
 // If we were viewing detail, update it
 if (selectedRequisition && selectedRequisition.id === savedReq.id) {
 setSelectedRequisition(savedReq);
 }
 };

 const handleUpdateRequisition = (updatedReq: Requisition) => {
 setRequisitions((prev) =>
 prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
 );
 setSelectedRequisition(updatedReq);
 };

 const subTabOptions = [
 { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
 { id: 'requisiciones' as const, label: 'Requisiciones', icon: FileText, count: requisitions.length },
 { id: 'sugerencias' as const, label: 'Sugerencias de reorden', icon: Sparkles, count: suggestions.length },
 ];

 return (
 <div className="space-y-6">
 
 {/* Sub-Navigation Tabs */}
 <div className="flex items-center justify-between border-b border-theme-subtle pb-3 gap-3 flex-wrap">
 <div className="flex items-center gap-1.5 p-1 bg-theme-muted/50 rounded-2xl border border-theme-subtle">
 {subTabOptions.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeSubTab === tab.id || (tab.id === 'dashboard' && activeSubTab === 'resumen');

 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveSubTab(tab.id)}
 className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
 isActive
 ? 'bg-theme-surface text-theme-main shadow-2xs'
 : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
 }`}
 >
 <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`} />
 <span>{tab.label}</span>
 {tab.count !== undefined && (
 <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
 isActive ? 'bg-theme-primary-light text-theme-primary' : 'bg-theme-muted text-theme-muted'
 }`}>
 {tab.count}
 </span>
 )}
 </button>
 );
 })}
 </div>

 {/* Quick Action */}
 <button
 type="button"
 onClick={handleOpenCreateNew}
 className="px-4 py-2 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
 >
 <Plus className="w-4 h-4" />
 <span>Nueva requisición</span>
 </button>
 </div>

 {/* Active Sub-Tab View */}
 {(activeSubTab === 'dashboard' || activeSubTab === 'resumen') && (
 <RequisicionesDashboard
 requisitions={requisitions}
 suggestions={suggestions}
 onOpenCreate={handleOpenCreateNew}
 onSelectRequisition={(req) => setSelectedRequisition(req)}
 onNavigateSubTab={(tab) => setActiveSubTab(tab as RequisitionSubTab)}
 />
 )}

 {activeSubTab === 'requisiciones' && (
 <RequisitionsList
 requisitions={requisitions}
 onOpenCreate={handleOpenCreateNew}
 onSelectRequisition={(req) => setSelectedRequisition(req)}
 onEditRequisition={handleOpenEdit}
 />
 )}

 {activeSubTab === 'sugerencias' && (
 <ReorderSuggestionsList
 suggestions={suggestions}
 onCreateRequisitionFromSuggestion={handleCreateFromSuggestion}
 />
 )}

 {/* Form Modal (Create / Edit) */}
 {isFormOpen && (
 <RequisitionFormModal
 initialRequisition={editingRequisition}
 prefilledItem={prefilledItem}
 onClose={() => {
 setIsFormOpen(false);
 setEditingRequisition(null);
 setPrefilledItem(null);
 }}
 onSaveRequisition={handleSaveRequisition}
 />
 )}

 {/* Detail Modal */}
 {selectedRequisition && (
 <RequisitionDetailModal
 requisition={selectedRequisition}
 onClose={() => setSelectedRequisition(null)}
 onUpdateRequisition={handleUpdateRequisition}
 onEditRequisition={handleOpenEdit}
 onNavigateToPurchases={onNavigateToPurchasesTab}
 />
 )}

 </div>
 );
};
