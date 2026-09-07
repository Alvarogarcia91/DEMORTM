import React, { useState } from 'react';
import { 
  Calendar, Wrench, Clock, CheckCircle2, AlertTriangle, 
  Search, Filter, ChevronDown, ChevronUp, Check, Plus, Layers
} from 'lucide-react';
import { PreventivePlan } from '../../data/mockMaintenanceData';

interface PreventivosTabProps {
  preventivePlans: PreventivePlan[];
  onGenerateOrderFromPlan: (plan: PreventivePlan) => void;
}

export const PreventivosTab: React.FC<PreventivosTabProps> = ({
  preventivePlans,
  onGenerateOrderFromPlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(preventivePlans[0]?.id ?? null);

  const filteredPlans = preventivePlans.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.machineCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PreventivePlan['status']) => {
    switch (status) {
      case 'Próximo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Próximo a vencer
          </span>
        );
      case 'Vencido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Vencido
          </span>
        );
      case 'Pausado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            Pausado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Vigente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, plan, máquina..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-main text-xs focus:border-theme-primary outline-none"
            >
              <option value="all">Estado (Todos)</option>
              <option value="Vigente">Vigente</option>
              <option value="Próximo">Próximo a vencer</option>
              <option value="Vencido">Vencido</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-theme-muted pt-2 border-t border-theme-subtle">
          <span>
            Mostrando <strong className="text-theme-main">{filteredPlans.length}</strong> planes de mantenimiento preventivo
          </span>
          {(searchTerm || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}
              className="text-theme-primary font-semibold hover:underline"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {filteredPlans.map(plan => {
          const isExpanded = expandedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className="rounded-2xl bg-theme-surface border border-theme-subtle shadow-sm overflow-hidden transition-all hover:border-theme-primary/30"
            >
              {/* Header card */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded">
                        {plan.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-theme-subtle text-theme-muted">
                        Frecuencia: {plan.frequencyLabel}
                      </span>
                      {getStatusBadge(plan.status)}
                    </div>

                    <h3 className="text-sm font-bold text-theme-main mt-1">
                      {plan.planName}
                    </h3>

                    <p className="text-xs text-theme-muted mt-0.5">
                      Máquina destino: <strong className="text-theme-main font-mono">[{plan.machineCode}]</strong> {plan.machineName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-between md:justify-end">
                  <div className="text-xs space-y-0.5 text-right font-mono">
                    <span className="text-theme-muted block text-[10px]">Próxima fecha:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {plan.nextDueDate}
                    </span>
                    <span className="text-[10px] text-theme-muted block">
                      Duración: {plan.estimatedDurationHours} hrs
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGenerateOrderFromPlan(plan)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-theme-primary text-theme-primary-contrast hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Generar OT
                    </button>

                    <button
                      onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                      className="p-2 rounded-xl bg-theme-subtle text-theme-muted hover:text-theme-main transition-colors"
                      title={isExpanded ? 'Contraer checklist' : 'Ver checklist'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Inspection Checklist */}
              {isExpanded && (
                <div className="p-5 border-t border-theme-subtle bg-theme-subtle/10 space-y-4 animate-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-theme-main flex items-center gap-2">
                      <Layers className="w-4 h-4 text-theme-primary" />
                      Puntos de Inspección y Tareas del Plan ({plan.checklist.length} tareas)
                    </h4>
                    <span className="text-[11px] text-theme-muted">
                      Última ejecución técnica: <strong className="font-mono text-theme-main">{plan.lastExecutedDate}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {plan.checklist.map((taskText, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-theme-subtle bg-theme-surface flex items-start gap-2.5"
                      >
                        <div className="w-4 h-4 rounded-full bg-theme-primary/10 text-theme-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-theme-main font-medium">{taskText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
