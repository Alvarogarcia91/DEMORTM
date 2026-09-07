import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { 
  MachineEquipment, 
  MaintenanceWorkOrder, 
  WorkOrderType, 
  WorkOrderPriority,
  MOCK_TECHNICIANS 
} from '../../data/mockMaintenanceData';

interface OrdenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: MachineEquipment[];
  preselectedMachineId?: string;
  onSaveOrder: (newOrder: Partial<MaintenanceWorkOrder>) => void;
}

export const OrdenFormModal: React.FC<OrdenFormModalProps> = ({
  isOpen,
  onClose,
  machines,
  preselectedMachineId,
  onSaveOrder
}) => {
  const [machineId, setMachineId] = useState(preselectedMachineId || (machines[0]?.id ?? ''));
  const [type, setType] = useState<WorkOrderType>('Correctivo');
  const [priority, setPriority] = useState<WorkOrderPriority>('Alta');
  const [issueDescription, setIssueDescription] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState(MOCK_TECHNICIANS[0]);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDowntime, setEstimatedDowntime] = useState('2.5');
  const [requiresDowntime, setRequiresDowntime] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim() || !machineId) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const selectedMachine = machines.find(m => m.id === machineId);

    const newOrderData: Partial<MaintenanceWorkOrder> = {
      machineId,
      machineCode: selectedMachine?.code || '',
      machineName: selectedMachine?.name || '',
      area: selectedMachine?.area || 'Flexografía',
      type,
      priority,
      status: 'Solicitada',
      isMachineDown: requiresDowntime,
      requestedBy: 'Operador en turno',
      assignedTechnician,
      openedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      scheduledDate,
      issueDescription: issueDescription.trim(),
      downtimeHours: requiresDowntime ? parseFloat(estimatedDowntime) || 0 : 0,
      spareParts: [],
      timeline: [
        {
          id: `time-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: 'Operador en turno',
          role: 'Operador de Planta',
          type: 'created',
          message: 'Orden de trabajo registrada en el sistema de Mantenimiento.'
        }
      ]
    };

    onSaveOrder(newOrderData);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-theme-subtle bg-theme-surface flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-theme-main">Nueva Orden de Trabajo (OT)</h2>
                <p className="text-xs text-theme-muted">Registrar orden correctiva, preventiva o inspección técnica</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-subtle/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Machine selector */}
            <div>
              <label className="font-semibold text-theme-main block mb-1.5">
                Máquina / Equipo Destino *
              </label>
              <select
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    [{m.code}] {m.name} - {m.area} ({m.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Type & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-theme-main block mb-1.5">
                  Tipo de Mantenimiento *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as WorkOrderType)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                >
                  <option value="Correctivo">Correctivo (Falla o paro)</option>
                  <option value="Preventivo">Preventivo (Programado)</option>
                  <option value="Inspección">Inspección / Calibración</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-theme-main block mb-1.5">
                  Nivel de Prioridad *
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as WorkOrderPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                >
                  <option value="Urgente">Urgente (Línea detenida / Riesgo crítico)</option>
                  <option value="Alta">Alta (Riesgo inminente de paro)</option>
                  <option value="Normal">Normal (Falla no limitante)</option>
                  <option value="Baja">Baja (Mantenimiento menor)</option>
                </select>
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <label className="font-semibold text-theme-main block mb-1.5">
                Descripción del Síntoma / Falla Detectada *
              </label>
              <textarea
                value={issueDescription}
                onChange={e => setIssueDescription(e.target.value)}
                rows={3}
                placeholder="Describa ruido anormal, vibración, fuga de lubricante, código de error en panel o motivo de la intervención..."
                required
                className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none resize-none"
              />
            </div>

            {/* Technician & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-theme-main block mb-1.5">
                  Técnico Asignado
                </label>
                <select
                  value={assignedTechnician}
                  onChange={e => setAssignedTechnician(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                >
                  {MOCK_TECHNICIANS.map((t: string) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-theme-main block mb-1.5">
                  Fecha Programada
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
                />
              </div>
            </div>

            {/* Downtime toggle */}
            <div className="p-3.5 rounded-xl border border-theme-subtle bg-theme-subtle/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-theme-main block">¿Requiere Detención de Máquina?</span>
                  <span className="text-[10px] text-theme-muted">
                    Marcar si la máquina debe pasar a Fuera de Servicio durante la intervención
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requiresDowntime}
                  onChange={e => setRequiresDowntime(e.target.checked)}
                  className="w-4 h-4 rounded text-theme-primary focus:ring-theme-primary border-theme-subtle"
                />
              </div>

              {requiresDowntime && (
                <div className="pt-2 border-t border-theme-subtle flex items-center gap-3">
                  <label className="text-theme-muted text-[11px] whitespace-nowrap">
                    Estimación de Tiempo Muerto (Horas):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={estimatedDowntime}
                    onChange={e => setEstimatedDowntime(e.target.value)}
                    className="w-24 px-2.5 py-1 rounded-lg border border-theme-subtle bg-theme-surface text-theme-main text-xs font-mono focus:border-theme-primary outline-none"
                  />
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-theme-subtle flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-subtle text-theme-main hover:bg-theme-subtle/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registrar Orden de Trabajo
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
