import React, { useState } from 'react';
import { 
  Store, 
  LayoutDashboard, 
  Boxes, 
  Scan, 
  Truck, 
  Plus, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { 
  MOCK_SHOWROOM_BAYS, 
  MOCK_EXPOS, 
  MOCK_SHOWROOM_PICK_ORDERS,
  ShowroomBayRecord,
  ExpoRecord,
  ShowroomPickOrder
} from '../../data/mockShowroomExposData';
import { ShowroomExposDashboard } from './Dashboard/ShowroomExposDashboard';
import { ShowroomsList } from './Showrooms/ShowroomsList';
import { ShowroomDetailModal } from './Showrooms/ShowroomDetailModal';
import { MountShowroomWizardModal } from './Showrooms/MountShowroomWizardModal';
import { WithdrawShowroomModal } from './Showrooms/WithdrawShowroomModal';
import { ShowroomQrModal } from './Showrooms/ShowroomQrModal';
import { ShowroomPickingList } from './Recolecciones/ShowroomPickingList';
import { ShowroomPickingExecutionModal } from './Recolecciones/ShowroomPickingExecutionModal';
import { ExposList } from './Expos/ExposList';
import { ExpoDetailModal } from './Expos/ExpoDetailModal';
import { CreateExpoWizardModal } from './Expos/CreateExpoWizardModal';
import { ExpoQrModal } from './Expos/ExpoQrModal';
import { ExpoMountingScanModal } from './Expos/ExpoMountingScanModal';
import { ExpoReturnModal } from './Expos/ExpoReturnModal';

export type ShowroomExposTabKey = 'dashboard' | 'showrooms' | 'recolecciones' | 'expos';

export const ShowroomExposPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShowroomExposTabKey>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Datasets State
  const [bays, setBays] = useState<ShowroomBayRecord[]>(MOCK_SHOWROOM_BAYS);
  const [expos, setExpos] = useState<ExpoRecord[]>(MOCK_EXPOS);
  const [pickOrders, setPickOrders] = useState<ShowroomPickOrder[]>(MOCK_SHOWROOM_PICK_ORDERS);

  // Modals state for Showrooms
  const [selectedBayDetail, setSelectedBayDetail] = useState<ShowroomBayRecord | null>(null);
  const [bayToMount, setBayToMount] = useState<ShowroomBayRecord | null>(null);
  const [bayToWithdraw, setBayToWithdraw] = useState<ShowroomBayRecord | null>(null);
  const [bayForQr, setBayForQr] = useState<ShowroomBayRecord | null>(null);

  // Modals state for Recolecciones
  const [orderToExecute, setOrderToExecute] = useState<ShowroomPickOrder | null>(null);

  // Modals state for Expos
  const [selectedExpoDetail, setSelectedExpoDetail] = useState<ExpoRecord | null>(null);
  const [isCreateExpoOpen, setIsCreateExpoOpen] = useState<boolean>(false);
  const [expoForQr, setExpoForQr] = useState<ExpoRecord | null>(null);
  const [expoToMountScan, setExpoToMountScan] = useState<ExpoRecord | null>(null);
  const [expoToReturn, setExpoToReturn] = useState<ExpoRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers for Showroom
  const handleConfirmMount = (bayId: string, sku: string, uid: string, operatorName: string) => {
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          return {
            ...b,
            status: 'En exhibición',
            currentArticle: {
              sku,
              productName: sku.includes('NAYT') ? 'Nayt Colchón Flow Basic White Individual' : 'Restonic Colchón Moon Cool Queen Size',
              brand: sku.includes('NAYT') ? 'Nayt' : 'Restonic',
              size: sku.includes('IND') ? 'Individual' : 'Queen Size',
              category: 'Colchones',
              priceMxn: 7499,
              rotationTier: 'Alta',
            },
            currentUnit: {
              uid,
              lotNumber: 'LT-2026-N99',
              mountedAt: '28 Ago 2026',
              daysInExhibition: 0,
              originLocation: 'Almacén Sucursal',
              mountedBy: operatorName,
              condition: 'Excelente',
            },
            history: [
              {
                id: `hist-${Date.now()}`,
                action: 'MONTAJE',
                uid,
                sku,
                productName: 'Nayt Colchón Flow Basic White Individual',
                timestamp: '28 Ago 2026 · Ahora',
                user: operatorName,
                originOrDestinationLocation: 'Almacén Sucursal',
                conditionNotes: 'Montaje exitoso con validación QR.',
              },
              ...b.history,
            ],
          };
        }
        return b;
      })
    );
    setBayToMount(null);
  };

  const handleConfirmWithdrawal = (bayId: string, returnLocation: string, condition: 'Excelente' | 'Bueno' | 'Observado', notes?: string) => {
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          return {
            ...b,
            status: 'Disponible',
            currentArticle: undefined,
            currentUnit: undefined,
            history: [
              {
                id: `hist-${Date.now()}`,
                action: 'RETIRO',
                uid: b.currentUnit?.uid || 'SC-UID-...',
                sku: b.currentArticle?.sku || 'SC-...',
                productName: b.currentArticle?.productName || 'Artículo',
                timestamp: '28 Ago 2026 · Ahora',
                user: 'Operador de piso',
                originOrDestinationLocation: returnLocation,
                conditionNotes: notes || `Retirado en condición: ${condition}`,
              },
              ...b.history,
            ],
          };
        }
        return b;
      })
    );
    setBayToWithdraw(null);
  };

  // Handlers for Recolecciones
  const handleConfirmCompleteOrder = (orderId: string) => {
    setPickOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'Completa', completedUnits: o.totalUnits } : o))
    );
    setOrderToExecute(null);
  };

  // Handlers for Expos
  const handleCreateExpo = (newExpo: ExpoRecord) => {
    setExpos(prev => [newExpo, ...prev]);
  };

  const handleConfirmExpoMounting = (expoId: string) => {
    setExpos(prev =>
      prev.map(e => (e.id === expoId ? { ...e, status: 'En exposición externa' } : e))
    );
    setExpoToMountScan(null);
  };

  const handleConfirmExpoReturn = (expoId: string, returnResults: any[]) => {
    setExpos(prev =>
      prev.map(e => (e.id === expoId ? { ...e, status: 'Cerrada' } : e))
    );
    setExpoToReturn(null);
  };

  const tabsConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'showrooms', label: 'Showrooms', icon: Store },
    { id: 'recolecciones', label: 'Recolecciones', icon: Scan },
    { id: 'expos', label: 'Expos', icon: Truck },
  ];

  return (
    <div className="space-y-6 max-w-[1520px] w-full mx-auto pb-16 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <Store className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-theme-main tracking-tight">
              Showroom & Expos
            </h1>
          </div>
          <p className="text-xs text-theme-muted">
            Gestión operativa de exhibiciones internas por sucursal y exposiciones comerciales externas con control físico de UIDs y QR.
          </p>
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-theme-subtle pb-3 text-xs font-semibold">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-theme-primary text-white font-bold shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <ShowroomExposDashboard
          bays={bays}
          expos={expos}
          pickOrders={pickOrders}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenMountWizardForSuggestion={(bay) => setBayToMount(bay)}
        />
      )}

      {activeTab === 'showrooms' && (
        <ShowroomsList
          bays={bays}
          onSelectBay={(bay) => setSelectedBayDetail(bay)}
          onOpenMountWizard={(bay) => setBayToMount(bay)}
          onOpenWithdrawModal={(bay) => setBayToWithdraw(bay)}
          onOpenQrModal={(bay) => setBayForQr(bay)}
        />
      )}

      {activeTab === 'recolecciones' && (
        <ShowroomPickingList
          orders={pickOrders}
          onExecuteOrder={(ord) => setOrderToExecute(ord)}
        />
      )}

      {activeTab === 'expos' && (
        <ExposList
          expos={expos}
          onSelectExpo={(expo) => setSelectedExpoDetail(expo)}
          onOpenCreateWizard={() => setIsCreateExpoOpen(true)}
          onOpenQrModal={(expo) => setExpoForQr(expo)}
          onOpenMountScanModal={(expo) => setExpoToMountScan(expo)}
          onOpenReturnModal={(expo) => setExpoToReturn(expo)}
        />
      )}

      {/* MODALS */}
      {selectedBayDetail && (
        <ShowroomDetailModal
          bay={selectedBayDetail}
          onClose={() => setSelectedBayDetail(null)}
          onOpenMountWizard={(bay) => setBayToMount(bay)}
          onOpenWithdrawModal={(bay) => setBayToWithdraw(bay)}
          onOpenQrModal={(bay) => setBayForQr(bay)}
          onShowToast={showToast}
        />
      )}

      {bayToMount && (
        <MountShowroomWizardModal
          bay={bayToMount}
          onClose={() => setBayToMount(null)}
          onConfirmMount={handleConfirmMount}
          onShowToast={showToast}
        />
      )}

      {bayToWithdraw && (
        <WithdrawShowroomModal
          bay={bayToWithdraw}
          onClose={() => setBayToWithdraw(null)}
          onConfirmWithdrawal={handleConfirmWithdrawal}
          onShowToast={showToast}
        />
      )}

      {bayForQr && (
        <ShowroomQrModal
          bay={bayForQr}
          onClose={() => setBayForQr(null)}
          onShowToast={showToast}
        />
      )}

      {orderToExecute && (
        <ShowroomPickingExecutionModal
          order={orderToExecute}
          onClose={() => setOrderToExecute(null)}
          onConfirmComplete={handleConfirmCompleteOrder}
          onShowToast={showToast}
        />
      )}

      {selectedExpoDetail && (
        <ExpoDetailModal
          expo={selectedExpoDetail}
          onClose={() => setSelectedExpoDetail(null)}
          onOpenQrModal={(expo) => setExpoForQr(expo)}
          onOpenMountScanModal={(expo) => setExpoToMountScan(expo)}
          onOpenReturnModal={(expo) => setExpoToReturn(expo)}
        />
      )}

      {isCreateExpoOpen && (
        <CreateExpoWizardModal
          onClose={() => setIsCreateExpoOpen(false)}
          onCreateExpo={handleCreateExpo}
          onShowToast={showToast}
        />
      )}

      {expoForQr && (
        <ExpoQrModal
          expo={expoForQr}
          onClose={() => setExpoForQr(null)}
          onShowToast={showToast}
        />
      )}

      {expoToMountScan && (
        <ExpoMountingScanModal
          expo={expoToMountScan}
          onClose={() => setExpoToMountScan(null)}
          onConfirmMounting={handleConfirmExpoMounting}
          onShowToast={showToast}
        />
      )}

      {expoToReturn && (
        <ExpoReturnModal
          expo={expoToReturn}
          onClose={() => setExpoToReturn(null)}
          onConfirmReturn={handleConfirmExpoReturn}
          onShowToast={showToast}
        />
      )}

    </div>
  );
};
