import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Plus,
  ShieldCheck
} from 'lucide-react';
import {
  SupplierMaster,
  INITIAL_MOCK_SUPPLIERS
} from '../../../data/mockSuppliersData';
import {
  INITIAL_INCOMING_INSPECTIONS,
  INITIAL_SUPPLIER_CORRECTIVE_ACTIONS,
  SupplierCorrectiveAction
} from '../../../data/mockSupplierQualityData';
import { IncomingInspection } from '../../../data/mockCalidadData';
import { SuppliersDashboard } from './SuppliersDashboard';
import { SuppliersList } from './SuppliersList';
import { SupplierFormModal } from './SupplierFormModal';
import { SupplierDetailModal } from './SupplierDetailModal';
import { CalidadEvaluacionWorkspace } from './CalidadEvaluacion/CalidadEvaluacionWorkspace';

export type ProveedoresSubTab = 'resumen' | 'proveedores' | 'calidad_evaluacion';

interface ProveedoresTabProps {
  suppliers?: SupplierMaster[];
  onSetSuppliers?: React.Dispatch<React.SetStateAction<SupplierMaster[]>>;
  incomings?: IncomingInspection[];
  correctiveActions?: SupplierCorrectiveAction[];
  onAddCorrectiveAction?: (action: Omit<SupplierCorrectiveAction, 'id'>) => void;
  onUpdateCorrectiveAction?: (action: SupplierCorrectiveAction) => void;
  onNavigateToPurchases?: (supplierName?: string) => void;
  onNavigateToIncoming?: (folio?: string) => void;
  initialSubTab?: ProveedoresSubTab;
  targetSupplierForQuality?: string | null;
  onClearTargetSupplierForQuality?: () => void;
}

export const ProveedoresTab: React.FC<ProveedoresTabProps> = ({
  suppliers: externalSuppliers,
  onSetSuppliers: externalSetSuppliers,
  incomings: externalIncomings,
  correctiveActions: externalCorrectiveActions,
  onAddCorrectiveAction: externalAddCorrectiveAction,
  onUpdateCorrectiveAction: externalUpdateCorrectiveAction,
  onNavigateToPurchases,
  onNavigateToIncoming,
  initialSubTab = 'resumen',
  targetSupplierForQuality,
  onClearTargetSupplierForQuality,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProveedoresSubTab>(initialSubTab);
  
  const [localSuppliers, setLocalSuppliers] = useState<SupplierMaster[]>(INITIAL_MOCK_SUPPLIERS);
  const suppliers = externalSuppliers || localSuppliers;
  const setSuppliers = externalSetSuppliers || setLocalSuppliers;

  const [localIncomings, setLocalIncomings] = useState<IncomingInspection[]>(INITIAL_INCOMING_INSPECTIONS);
  const incomings = externalIncomings || localIncomings;

  const [localCorrectiveActions, setLocalCorrectiveActions] = useState<SupplierCorrectiveAction[]>(INITIAL_SUPPLIER_CORRECTIVE_ACTIONS);
  const correctiveActions = externalCorrectiveActions || localCorrectiveActions;

  const handleAddCorrectiveAction = (action: Omit<SupplierCorrectiveAction, 'id'>) => {
    if (externalAddCorrectiveAction) {
      externalAddCorrectiveAction(action);
    } else {
      const newAction: SupplierCorrectiveAction = {
        ...action,
        id: `ACP-2026-000${localCorrectiveActions.length + 9}`,
      };
      setLocalCorrectiveActions((prev) => [newAction, ...prev]);
    }
  };

  const handleUpdateCorrectiveAction = (action: SupplierCorrectiveAction) => {
    if (externalUpdateCorrectiveAction) {
      externalUpdateCorrectiveAction(action);
    } else {
      setLocalCorrectiveActions((prev) =>
        prev.map((a) => (a.id === action.id ? action : a))
      );
    }
  };

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierMaster | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierMaster | null>(null);
  const [selectedInitialTab, setSelectedInitialTab] = useState<
    'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial' | 'calidad'
  >('resumen');

  // Handle external navigation target
  useEffect(() => {
    if (targetSupplierForQuality) {
      const found = suppliers.find(
        (s) =>
          s.id === targetSupplierForQuality ||
          s.tradeName.toLowerCase() === targetSupplierForQuality.toLowerCase() ||
          s.legalName.toLowerCase() === targetSupplierForQuality.toLowerCase()
      );
      if (found) {
        setSelectedSupplier(found);
        setSelectedInitialTab('calidad');
      }
      onClearTargetSupplierForQuality?.();
    }
  }, [targetSupplierForQuality, suppliers, onClearTargetSupplierForQuality]);

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
    tab: 'resumen' | 'contactos' | 'direcciones' | 'articulos' | 'listas_precios' | 'condiciones' | 'documentos' | 'historial' | 'calidad'
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
    {
      id: 'calidad_evaluacion' as const,
      label: 'Calidad & Evaluación',
      icon: ShieldCheck,
      badge: 'Scorecard',
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
                {tab.badge && (
                  <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                      : 'bg-theme-muted text-theme-muted'
                  }`}>
                    {tab.badge}
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

      {activeSubTab === 'calidad_evaluacion' && (
        <CalidadEvaluacionWorkspace
          suppliers={suppliers}
          incomings={incomings}
          correctiveActions={correctiveActions}
          onAddCorrectiveAction={handleAddCorrectiveAction}
          onSelectSupplierForQuality={(supplier) => {
            handleSelectSupplierWithTab(supplier, 'calidad');
          }}
          onNavigateToPurchases={onNavigateToPurchases}
          onNavigateToIncoming={onNavigateToIncoming}
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

      {/* Detail Modal (9 Tabs including Calidad) */}
      {selectedSupplier && (
        <SupplierDetailModal
          supplier={selectedSupplier}
          initialTab={selectedInitialTab}
          onClose={() => setSelectedSupplier(null)}
          onUpdateSupplier={handleUpdateSupplier}
          onOpenEditForm={handleOpenEdit}
          incomings={incomings}
          correctiveActions={correctiveActions}
          onAddCorrectiveAction={handleAddCorrectiveAction}
          onUpdateCorrectiveAction={handleUpdateCorrectiveAction}
          onNavigateToIncoming={onNavigateToIncoming}
        />
      )}

    </div>
  );
};
