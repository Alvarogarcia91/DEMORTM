import React, { useState } from 'react';
import { 
  X, Wrench, Calendar, AlertTriangle, CheckCircle, Clock, 
  FileText, Shield, Activity, HardDrive, Download, Plus,
  Layers, MapPin, Gauge
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { 
  MachineEquipment, 
  MaintenanceWorkOrder, 
  PreventivePlan, 
  CRITICALITY_LABELS, 
  STATUS_LABELS 
} from '../../data/mockMaintenanceData';

interface MaquinaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  machine: MachineEquipment | null;
  workOrders: MaintenanceWorkOrder[];
  preventivePlans: PreventivePlan[];
  onNewWorkOrder: (machineId: string) => void;
  onViewWorkOrder: (workOrder: MaintenanceWorkOrder) => void;
}

type TabKey = 'resumen' | 'preventivos' | 'ordenes' | 'historial' | 'documentos';

export const MaquinaDetailModal: React.FC<MaquinaDetailModalProps> = ({
  isOpen,
  onClose,
  machine,
  workOrders,
  preventivePlans,
  onNewWorkOrder,
  onViewWorkOrder
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');

  if (!isOpen || !machine) return null;

  const machineWorkOrders = workOrders.filter(ot => ot.machineId === machine.id);
  const activeOrders = machineWorkOrders.filter(ot => !['Terminada', 'Cancelada'].includes(ot.status));
  const pastOrders = machineWorkOrders.filter(ot => ['Terminada', 'Cancelada'].includes(ot.status));
  const machinePlans = preventivePlans.filter(p => p.machineId === machine.id);

  const getStatusBadge = (status: MachineEquipment['status']) => {
    switch (status) {
      case 'Operativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            {STATUS_LABELS[status]}
          </span>
        );
      case 'Fuera de servicio':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            {STATUS_LABELS[status]}
          </span>
        );
      case 'Mantenimiento programado':
      case 'En inspección':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {STATUS_LABELS[status]}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {STATUS_LABELS[status]}
          </span>
        );
    }
  };

  const getCriticalityBadge = (crit: MachineEquipment['criticality']) => {
    const meta = CRITICALITY_LABELS[crit];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium border ${meta.bgColor} ${meta.color} ${meta.borderColor}`}>
        <Shield className="w-3 h-3" />
        {meta.label}
      </span>
    );
  };

  const calculateOrderCost = (order: MaintenanceWorkOrder) => {
    const partsCost = order.spareParts.reduce((sum, sp) => sum + (sp.quantityUsed * sp.unitCostMxn), 0);
    const laborCost = order.downtimeHours * 350;
    return partsCost + laborCost;
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-theme-subtle bg-theme-surface flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary">
                <HardDrive className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-theme-primary bg-theme-primary/10 px-2.5 py-0.5 rounded border border-theme-primary/20">
                    {machine.code}
                  </span>
                  {getStatusBadge(machine.status)}
                  {getCriticalityBadge(machine.criticality)}
                </div>
                <h2 className="text-xl font-bold text-theme-main mt-1.5 flex items-center gap-2">
                  {machine.name}
                </h2>
                <p className="text-xs text-theme-muted flex items-center gap-2 mt-1">
                  <span>{machine.brandModelDemo}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {machine.area}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNewWorkOrder(machine.id)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 shadow-sm transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                Generar OT
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-subtle/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader / Tabs Navigation */}
          <div className="flex items-center gap-2 px-6 border-b border-theme-subtle bg-theme-surface">
            {[
              { key: 'resumen', label: 'Resumen', icon: Activity },
              { key: 'preventivos', label: `Preventivos (${machinePlans.length})`, icon: Calendar },
              { key: 'ordenes', label: `Órdenes (${activeOrders.length} activas)`, icon: Wrench },
              { key: 'historial', label: `Historial (${pastOrders.length})`, icon: Clock },
              { key: 'documentos', label: `Documentos (${machine.documents.length})`, icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`flex items-center gap-2 py-3 px-3 text-xs font-medium border-b-2 transition-all ${
                    isActive
                      ? 'border-theme-primary text-theme-primary font-semibold'
                      : 'border-transparent text-theme-muted hover:text-theme-main'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: RESUMEN */}
            {activeTab === 'resumen' && (
              <div className="space-y-6">
                {/* Metric Quick Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-theme-subtle/30 border border-theme-subtle">
                    <span className="text-xs text-theme-muted block font-medium">Horas Operativas</span>
                    <span className="text-xl font-bold text-theme-main font-mono mt-1 block">
                      {machine.totalOperatingHours.toLocaleString()} hrs
                    </span>
                    <span className="text-[10px] text-theme-muted mt-0.5 block flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-theme-primary" />
                      Horómetro de planta
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-theme-subtle/30 border border-theme-subtle">
                    <span className="text-xs text-theme-muted block font-medium">Paro Acumulado</span>
                    <span className="text-xl font-bold text-theme-main font-mono mt-1 block">
                      {machine.accumulatedDowntimeHours} hrs
                    </span>
                    <span className="text-[10px] text-theme-muted mt-0.5 block">Histórico anual</span>
                  </div>

                  <div className="p-4 rounded-xl bg-theme-subtle/30 border border-theme-subtle">
                    <span className="text-xs text-theme-muted block font-medium">Último Mantenimiento</span>
                    <span className="text-sm font-semibold text-theme-main mt-2 block font-mono">
                      {machine.lastMaintenanceDate}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      Ejecutado conforme
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-theme-subtle/30 border border-theme-subtle">
                    <span className="text-xs text-theme-muted block font-medium">Próximo Preventivo</span>
                    <span className="text-sm font-semibold text-theme-main mt-2 block font-mono">
                      {machine.nextPreventiveDate}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 block">
                      Programado en calendario
                    </span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="p-5 rounded-xl border border-theme-subtle bg-theme-surface space-y-4">
                  <h3 className="text-sm font-bold text-theme-main flex items-center gap-2">
                    <Layers className="w-4 h-4 text-theme-primary" />
                    Ficha Técnica y Datos de Fabricante
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-theme-muted block">Número de Serie</span>
                      <span className="font-mono font-medium text-theme-main">{machine.serialNumberDemo}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Año de Instalación</span>
                      <span className="font-medium text-theme-main">{machine.installationYear}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Categoría de Máquina</span>
                      <span className="font-medium text-theme-main">{machine.category}</span>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Técnico Responsable</span>
                      <span className="font-medium text-theme-main">{machine.responsibleTechnician}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-theme-muted block">Especificaciones Principales</span>
                      <span className="font-medium text-theme-main">{machine.specifications}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PREVENTIVOS */}
            {activeTab === 'preventivos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-theme-main">
                    Planes de Mantenimiento Preventivo Asignados
                  </h3>
                </div>

                {machinePlans.length === 0 ? (
                  <div className="p-8 text-center text-theme-muted text-xs border border-dashed border-theme-subtle rounded-xl">
                    No hay planes de mantenimiento preventivo configurados para este equipo.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {machinePlans.map(plan => (
                      <div
                        key={plan.id}
                        className="p-4 rounded-xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/40 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-theme-primary">
                                {plan.id}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-theme-subtle text-theme-muted">
                                {plan.frequencyLabel}
                              </span>
                              <span className="text-xs font-bold text-theme-main">
                                {plan.planName}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onNewWorkOrder(machine.id)}
                            className="text-xs font-medium text-theme-primary hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Generar OT de Plan
                          </button>
                        </div>

                        <div className="text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-theme-subtle">
                          <div>
                            <span className="text-theme-muted block text-[10px]">Última ejecución</span>
                            <span className="font-mono font-medium text-theme-main">{plan.lastExecutedDate}</span>
                          </div>
                          <div>
                            <span className="text-theme-muted block text-[10px]">Próxima fecha</span>
                            <span className="font-mono font-medium text-theme-main">{plan.nextDueDate}</span>
                          </div>
                          <div>
                            <span className="text-theme-muted block text-[10px]">Duración estimada</span>
                            <span className="font-medium text-theme-main">{plan.estimatedDurationHours} hrs</span>
                          </div>
                          <div>
                            <span className="text-theme-muted block text-[10px]">Tareas</span>
                            <span className="font-medium text-theme-main">{plan.checklist.length} puntos de inspección</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ÓRDENES */}
            {activeTab === 'ordenes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-theme-main">
                    Órdenes de Trabajo Activas ({activeOrders.length})
                  </h3>
                  <button
                    onClick={() => onNewWorkOrder(machine.id)}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nueva OT
                  </button>
                </div>

                {activeOrders.length === 0 ? (
                  <div className="p-8 text-center text-theme-muted text-xs border border-dashed border-theme-subtle rounded-xl">
                    No hay órdenes de trabajo activas en este momento para {machine.name}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeOrders.map(ot => (
                      <div
                        key={ot.id}
                        onClick={() => onViewWorkOrder(ot)}
                        className="p-4 rounded-xl border border-theme-subtle bg-theme-surface hover:border-theme-primary cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-theme-primary">
                              {ot.folio}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {ot.status}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-theme-subtle text-theme-muted">
                              {ot.type}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-theme-muted">
                            Reportada: {ot.openedAt}
                          </span>
                        </div>
                        <p className="text-xs text-theme-main font-semibold line-clamp-1">{ot.issueDescription}</p>

                        <div className="text-[10px] text-theme-muted flex items-center gap-4 pt-2 border-t border-theme-subtle">
                          <span>Asignado: <strong className="text-theme-main">{ot.assignedTechnician || 'Sin asignar'}</strong></span>
                          <span>Prioridad: <strong className="text-theme-main">{ot.priority}</strong></span>
                          {ot.downtimeHours > 0 && (
                            <span className="text-rose-500 font-bold">Tiempo muerto: {ot.downtimeHours} hrs</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HISTORIAL */}
            {activeTab === 'historial' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-theme-main">
                  Historial de Intervenciones Completadas ({pastOrders.length})
                </h3>

                {pastOrders.length === 0 ? (
                  <div className="p-8 text-center text-theme-muted text-xs border border-dashed border-theme-subtle rounded-xl">
                    No hay registros históricos cerrados para este equipo.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastOrders.map(ot => (
                      <div
                        key={ot.id}
                        onClick={() => onViewWorkOrder(ot)}
                        className="p-4 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-subtle/20 cursor-pointer transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-theme-primary">{ot.folio}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {ot.status}
                            </span>
                            <span className="text-theme-muted">{ot.type}</span>
                          </div>
                          <span className="text-[10px] font-mono text-theme-muted">
                            Finalizada: {ot.completedAt || ot.openedAt}
                          </span>
                        </div>
                        <p className="font-semibold text-theme-main">{ot.issueDescription}</p>
                        <p className="text-theme-muted line-clamp-2">{ot.workPerformed || ot.diagnosis}</p>

                        <div className="text-[10px] text-theme-muted flex items-center justify-between pt-2 border-t border-theme-subtle">
                          <span>Técnico: <strong className="text-theme-main">{ot.assignedTechnician || 'Sin asignar'}</strong></span>
                          <span>Costo Total: <strong className="text-theme-main">${calculateOrderCost(ot).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: DOCUMENTOS */}
            {activeTab === 'documentos' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-theme-main">
                  Manuales, Planos y Certificaciones Técnicas
                </h3>

                {machine.documents.length === 0 ? (
                  <div className="p-8 text-center text-theme-muted text-xs border border-dashed border-theme-subtle rounded-xl">
                    No se han cargado documentos para esta máquina.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {machine.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-theme-subtle bg-theme-surface hover:border-theme-primary/30 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-theme-subtle text-theme-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-theme-main block">{doc.title}</span>
                            <span className="text-[10px] text-theme-muted flex items-center gap-1.5 mt-0.5">
                              <span className="uppercase font-mono">{doc.type}</span>
                              <span>•</span>
                              <span>{doc.fileSize}</span>
                              <span>•</span>
                              <span>{doc.version}</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert(`Descargando ${doc.title} (${doc.fileSize})... Documento verificado.`)}
                          className="p-2 rounded-lg hover:bg-theme-subtle text-theme-muted hover:text-theme-primary transition-colors"
                          title="Descargar documento"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 px-6 border-t border-theme-subtle bg-theme-surface flex items-center justify-between">
            <span className="text-xs text-theme-muted">
              ID Registro: <code className="font-mono">{machine.id}</code>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
