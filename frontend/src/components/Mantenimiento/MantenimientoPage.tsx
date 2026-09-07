import React, { useState } from 'react';
import { 
  Wrench, HardDrive, Calendar, Clock, Activity, 
  Plus, Layers, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { 
  INITIAL_MACHINES, 
  INITIAL_WORK_ORDERS, 
  INITIAL_PREVENTIVE_PLANS,
  MachineEquipment,
  MaintenanceWorkOrder,
  PreventivePlan
} from '../../data/mockMaintenanceData';
import { MantenimientoDashboardTab } from './MantenimientoDashboardTab';
import { MaquinasTab } from './MaquinasTab';
import { MaquinaDetailModal } from './MaquinaDetailModal';
import { OrdenesTab } from './OrdenesTab';
import { OrdenFormModal } from './OrdenFormModal';
import { OrdenDetailModal } from './OrdenDetailModal';
import { PreventivosTab } from './PreventivosTab';
import { HistorialTab } from './HistorialTab';

export type MantenimientoTabKey = 'dashboard' | 'maquinas' | 'ordenes' | 'preventivos' | 'historial';

interface MantenimientoPageProps {
  onNavigateToRequisitions?: (prefilledItem: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    targetWarehouseId?: string;
    note?: string;
  }) => void;
}

export const MantenimientoPage: React.FC<MantenimientoPageProps> = ({
  onNavigateToRequisitions
}) => {
  const [activeTab, setActiveTab] = useState<MantenimientoTabKey>('dashboard');

  // Master States
  const [machines, setMachines] = useState<MachineEquipment[]>(INITIAL_MACHINES);
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [preventivePlans, setPreventivePlans] = useState<PreventivePlan[]>(INITIAL_PREVENTIVE_PLANS);

  // Modal States
  const [selectedMachineForDetail, setSelectedMachineForDetail] = useState<MachineEquipment | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<MaintenanceWorkOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [preselectedMachineIdForNewOrder, setPreselectedMachineIdForNewOrder] = useState<string | undefined>(undefined);

  // Open New Order Modal with optional machine preselection
  const handleOpenNewOrder = (machineId?: string) => {
    setPreselectedMachineIdForNewOrder(machineId);
    setIsNewOrderModalOpen(true);
  };

  // Create new work order handler
  const handleSaveNewOrder = (newOrderData: Partial<MaintenanceWorkOrder>) => {
    const year = 2026;
    const nextSeq = (workOrders.length + 1).toString().padStart(4, '0');
    const folio = `OT-MTTO-${year}-${nextSeq}`;

    const newOrder: MaintenanceWorkOrder = {
      id: `ot-${Date.now()}`,
      folio,
      machineId: newOrderData.machineId || '',
      machineCode: newOrderData.machineCode || '',
      machineName: newOrderData.machineName || '',
      area: newOrderData.area || 'Flexografía',
      type: newOrderData.type || 'Correctivo',
      priority: newOrderData.priority || 'Alta',
      status: 'Solicitada',
      isMachineDown: !!newOrderData.isMachineDown,
      downtimeHours: newOrderData.downtimeHours || 0,
      requestedBy: newOrderData.requestedBy || 'Operador en turno',
      assignedTechnician: newOrderData.assignedTechnician || 'Téc. Héctor Domínguez',
      openedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      scheduledDate: newOrderData.scheduledDate,
      issueDescription: newOrderData.issueDescription || '',
      spareParts: [],
      timeline: newOrderData.timeline || [
        {
          id: `time-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: newOrderData.requestedBy || 'Operador en turno',
          role: 'Operador de Planta',
          type: 'created',
          message: 'Orden de trabajo registrada.'
        }
      ]
    };

    setWorkOrders(prev => [newOrder, ...prev]);

    // If downtime > 0, update machine status to 'Fuera de servicio' or 'Mantenimiento programado'
    if (newOrder.downtimeHours > 0) {
      setMachines(prev => prev.map(m => {
        if (m.id === newOrder.machineId) {
          return {
            ...m,
            status: newOrder.type === 'Correctivo' ? 'Fuera de servicio' : 'Mantenimiento programado',
            activeWorkOrdersCount: m.activeWorkOrdersCount + 1
          };
        }
        return m;
      }));
    }
  };

  // Update existing order (e.g. status transition, parts consumed, termination)
  const handleUpdateOrder = (updatedOrder: MaintenanceWorkOrder) => {
    setWorkOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));

    // If order was terminated, check if machine can be set back to 'Operativo'
    if (updatedOrder.status === 'Terminada') {
      const otherActiveOrders = workOrders.filter(
        o => o.machineId === updatedOrder.machineId && o.id !== updatedOrder.id && !['Terminada', 'Cancelada'].includes(o.status)
      );

      if (otherActiveOrders.length === 0) {
        setMachines(prev => prev.map(m => {
          if (m.id === updatedOrder.machineId) {
            return {
              ...m,
              status: 'Operativo',
              lastMaintenanceDate: updatedOrder.completedAt?.substring(0, 11) || new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
              activeWorkOrdersCount: Math.max(0, m.activeWorkOrdersCount - 1)
            };
          }
          return m;
        }));
      }
    }
  };

  // Generate OT from preventive plan
  const handleGenerateOrderFromPlan = (plan: PreventivePlan) => {
    const targetMachine = machines.find(m => m.id === plan.machineId);

    const checklistSummary = plan.checklist.map((c, i) => `${i + 1}. ${c}`).join('\n');

    handleSaveNewOrder({
      machineId: plan.machineId,
      machineCode: plan.machineCode,
      machineName: plan.machineName,
      area: targetMachine?.area || 'Acabado y Corte',
      type: 'Preventivo',
      priority: plan.status === 'Próximo' || plan.status === 'Vencido' ? 'Alta' : 'Normal',
      isMachineDown: true,
      requestedBy: 'Sistema Preventivo RTM',
      assignedTechnician: 'Téc. Fernando Lozano',
      issueDescription: `Ejecución programada de mantenimiento preventivo (${plan.frequencyLabel}):\n${checklistSummary}`,
      downtimeHours: plan.estimatedDurationHours,
      scheduledDate: plan.nextDueDate
    });

    // Update plan status to 'Vigente'
    setPreventivePlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'Vigente', lastExecutedDate: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) } : p));

    setActiveTab('ordenes');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
              <Wrench className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-primary">
              Control Industrial & Planta
            </span>
          </div>
          <h1 className="text-2xl font-black text-theme-main tracking-tight">
            Mantenimiento de Máquinas & Equipos
          </h1>
          <p className="text-xs text-theme-muted mt-0.5">
            Gestión técnica de activos, órdenes de trabajo (OT), consumos de refacciones y planes preventivos RTM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenNewOrder()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-theme-primary text-theme-primary-contrast hover:opacity-90 shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva Orden de Trabajo (OT)
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-theme-surface border border-theme-subtle overflow-x-auto shadow-sm">
        {[
          { key: 'dashboard', label: 'Tablero General', icon: Activity },
          { key: 'maquinas', label: `Máquinas & Equipos (${machines.length})`, icon: HardDrive },
          { 
            key: 'ordenes', 
            label: `Órdenes de Trabajo (${workOrders.filter(o => !['Terminada', 'Cancelada'].includes(o.status)).length} activas)`, 
            icon: Wrench 
          },
          { key: 'preventivos', label: `Planes Preventivos (${preventivePlans.length})`, icon: Calendar },
          { key: 'historial', label: 'Historial & MTTR/MTBF', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as MantenimientoTabKey)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-theme-primary text-theme-primary-contrast font-bold shadow-sm'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-subtle/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Render */}
      {activeTab === 'dashboard' && (
        <MantenimientoDashboardTab
          machines={machines}
          workOrders={workOrders}
          preventivePlans={preventivePlans}
          onSelectMachine={m => setSelectedMachineForDetail(m)}
          onSelectOrder={o => setSelectedOrderForDetail(o)}
          onNewOrder={mId => handleOpenNewOrder(mId)}
          onNavigateTab={tab => setActiveTab(tab)}
        />
      )}

      {activeTab === 'maquinas' && (
        <MaquinasTab
          machines={machines}
          onSelectMachine={m => setSelectedMachineForDetail(m)}
          onNewOrderForMachine={mId => handleOpenNewOrder(mId)}
        />
      )}

      {activeTab === 'ordenes' && (
        <OrdenesTab
          workOrders={workOrders}
          onSelectOrder={o => setSelectedOrderForDetail(o)}
          onNewOrder={() => handleOpenNewOrder()}
        />
      )}

      {activeTab === 'preventivos' && (
        <PreventivosTab
          preventivePlans={preventivePlans}
          onGenerateOrderFromPlan={p => handleGenerateOrderFromPlan(p)}
        />
      )}

      {activeTab === 'historial' && (
        <HistorialTab
          workOrders={workOrders}
          onSelectOrder={o => setSelectedOrderForDetail(o)}
        />
      )}

      {/* Machine Detail Modal */}
      <MaquinaDetailModal
        isOpen={!!selectedMachineForDetail}
        onClose={() => setSelectedMachineForDetail(null)}
        machine={selectedMachineForDetail}
        workOrders={workOrders}
        preventivePlans={preventivePlans}
        onNewWorkOrder={mId => {
          setSelectedMachineForDetail(null);
          handleOpenNewOrder(mId);
        }}
        onViewWorkOrder={ot => {
          setSelectedMachineForDetail(null);
          setSelectedOrderForDetail(ot);
        }}
      />

      {/* New Work Order Form Modal */}
      <OrdenFormModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        machines={machines}
        preselectedMachineId={preselectedMachineIdForNewOrder}
        onSaveOrder={handleSaveNewOrder}
      />

      {/* Work Order Detail / Execution Modal */}
      <OrdenDetailModal
        isOpen={!!selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
        order={selectedOrderForDetail}
        onUpdateOrder={handleUpdateOrder}
        onNavigateToRequisitions={onNavigateToRequisitions}
      />
    </div>
  );
};
