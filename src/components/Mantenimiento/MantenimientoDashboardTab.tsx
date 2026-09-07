import React from 'react';
import { 
  Wrench, HardDrive, AlertTriangle, CheckCircle, Clock, 
  Calendar, ArrowUpRight, ShieldAlert, ArrowRight, Activity,
  ChevronRight, Sparkles
} from 'lucide-react';
import { 
  MachineEquipment, 
  MaintenanceWorkOrder, 
  PreventivePlan, 
  PRIORITY_LABELS,
  STATUS_LABELS 
} from '../../data/mockMaintenanceData';

interface MantenimientoDashboardTabProps {
  machines: MachineEquipment[];
  workOrders: MaintenanceWorkOrder[];
  preventivePlans: PreventivePlan[];
  onSelectMachine: (machine: MachineEquipment) => void;
  onSelectOrder: (order: MaintenanceWorkOrder) => void;
  onNewOrder: (machineId?: string) => void;
  onNavigateTab: (tabKey: 'maquinas' | 'ordenes' | 'preventivos' | 'historial') => void;
}

export const MantenimientoDashboardTab: React.FC<MantenimientoDashboardTabProps> = ({
  machines,
  workOrders,
  preventivePlans,
  onSelectMachine,
  onSelectOrder,
  onNewOrder,
  onNavigateTab
}) => {
  const activeOrders = workOrders.filter(o => !['Terminada', 'Cancelada'].includes(o.status));
  const operativeMachines = machines.filter(m => m.status === 'Operativo');
  const stoppedMachines = machines.filter(m => m.status === 'Fuera de servicio');
  const scheduledMachines = machines.filter(m => ['Mantenimiento programado', 'En inspección'].includes(m.status));

  const availabilityRate = ((operativeMachines.length / machines.length) * 100).toFixed(1);
  const totalDowntimeHours = activeOrders.reduce((sum, o) => sum + o.downtimeHours, 0);

  // Critical machines needing immediate attention (e.g. stopped or critical OT)
  const urgentOrders = activeOrders.filter(o => o.priority === 'Urgente' || o.priority === 'Alta');

  // Upcoming preventives due in September 2026
  const upcomingPlans = preventivePlans
    .filter(p => p.status === 'Próximo' || p.status === 'Vencido')
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Alerta de Equipos Fuera de Servicio si los hay */}
      {stoppedMachines.length > 0 && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Atención Inmediata de Mantenimiento
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                  {stoppedMachines.length} Máquina(s) Fuera de Servicio
                </span>
              </div>
              <p className="text-xs text-theme-main font-semibold mt-1">
                {stoppedMachines.map(m => `[${m.code}] ${m.name}`).join(' • ')}
              </p>
              <p className="text-xs text-theme-muted mt-0.5">
                Impacto directo en capacidad de planta. Revise las refacciones requeridas y el avance de las órdenes de trabajo activas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('ordenes')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              Ver Órdenes Críticas
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-medium">Parque de Máquinas</span>
            <HardDrive className="w-4 h-4 text-theme-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-theme-main">
            {machines.length}
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            Activos industriales RTM
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-medium">Disponibilidad Técnica</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {availabilityRate}%
          </div>
          <span className="text-[11px] text-emerald-600/80 block mt-1">
            {operativeMachines.length} de {machines.length} en operación
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-medium">OTs en Proceso</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {activeOrders.length}
          </div>
          <span className="text-[11px] text-theme-muted block mt-1">
            {urgentOrders.length} prioridad urgente/alta
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-medium">Planes Preventivos</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-theme-main">
            {preventivePlans.length}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-1">
            {upcomingPlans.length} por ejecutar pronto
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-xs font-medium">Tiempo Muerto Activo</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {totalDowntimeHours} hrs
          </div>
          <span className="text-[11px] text-rose-600/80 block mt-1">
            Acumulado en OTs abiertas
          </span>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Work Orders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-theme-main">
                Órdenes de Trabajo en Curso
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-theme-subtle text-theme-muted font-mono">
                {activeOrders.length}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('ordenes')}
              className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
            >
              Ver todas
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.map(order => {
              const pMeta = PRIORITY_LABELS[order.priority] || PRIORITY_LABELS['Normal'];
              return (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/50 cursor-pointer transition-all shadow-sm group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded">
                        {order.folio}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${pMeta.bgColor} ${pMeta.color} ${pMeta.borderColor}`}>
                        {pMeta.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-theme-muted">
                      {order.openedAt}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-theme-main group-hover:text-theme-primary transition-colors">
                      {order.issueDescription}
                    </h4>
                    <p className="text-xs text-theme-muted line-clamp-1 mt-0.5">
                      Máquina: <strong className="text-theme-main font-mono">[{order.machineCode}]</strong> {order.machineName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[11px] text-theme-muted">
                    <span>Técnico: <strong className="text-theme-main">{order.assignedTechnician || 'Sin asignar'}</strong></span>
                    {order.downtimeHours > 0 && (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        Paro: {order.downtimeHours} hrs
                      </span>
                    )}
                    <span className="text-theme-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Gestionar
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Preventives & Machine Status Overview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Preventives */}
          <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-theme-main flex items-center gap-2">
                <Calendar className="w-4 h-4 text-theme-primary" />
                Mantenimientos Preventivos Próximos
              </h3>
              <button
                onClick={() => onNavigateTab('preventivos')}
                className="text-xs font-semibold text-theme-primary hover:underline"
              >
                Plan Completo
              </button>
            </div>

            <div className="space-y-3">
              {upcomingPlans.map(plan => (
                <div
                  key={plan.id}
                  className="p-3.5 rounded-xl border border-theme-subtle bg-theme-subtle/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-theme-primary">
                      {plan.id}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Vence: {plan.nextDueDate}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-theme-main">{plan.planName}</h5>
                    <p className="text-[11px] text-theme-muted">{plan.machineName} ({plan.frequencyLabel})</p>
                  </div>
                  <div className="pt-2 border-t border-theme-subtle flex items-center justify-between">
                    <span className="text-[10px] text-theme-muted">
                      Est. {plan.estimatedDurationHours} hrs
                    </span>
                    <button
                      onClick={() => onNewOrder(plan.machineId)}
                      className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
                    >
                      <Wrench className="w-3 h-3" />
                      Generar OT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Machine Distribution by Status */}
          <div className="p-5 rounded-2xl border border-theme-subtle bg-theme-surface shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-theme-main">
              Estado Operativo del Parque
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Operativas en Producción
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {operativeMachines.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mantenimiento / Inspección
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {scheduledMachines.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Fuera de Servicio (Paro)
                </span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                  {stoppedMachines.length}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('maquinas')}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors text-center mt-2 block"
            >
              Ver Catálogo de Máquinas y Fichas Técnicas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
