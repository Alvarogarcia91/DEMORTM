import React, { useState, useMemo } from 'react';
import {
  Calendar, CheckCircle2, Clock, AlertTriangle, Phone,
  Mail, Users, FileText, Plus, Search, Filter, RefreshCw
} from 'lucide-react';
import { CrmActivity } from '../../../data/mockCrmData';

interface CrmActivitiesProps {
  activities: CrmActivity[];
  onOpenNewActivity: () => void;
  onCompleteActivity: (id: string) => void;
}

export const CrmActivities: React.FC<CrmActivitiesProps> = ({
  activities,
  onOpenNewActivity,
  onCompleteActivity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Todas' | 'Hoy' | 'Vencidas' | 'Próximas' | 'Completadas'>('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedSeller, setSelectedSeller] = useState('Todos');

  const todayStr = '2026-09-07';

  // Filters
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchSearch =
        act.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (act.opportunityFolio && act.opportunityFolio.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchStatus = true;
      const scheduled = act.scheduledDate || act.when || '';
      if (selectedStatus === 'Hoy') {
        matchStatus = act.status === 'Hoy' || (scheduled.includes(todayStr) && act.status === 'Pendiente');
      } else if (selectedStatus === 'Vencidas') {
        matchStatus = act.status === 'Vencida' || (act.scheduledDate ? act.scheduledDate < todayStr && act.status === 'Pendiente' : false);
      } else if (selectedStatus === 'Próximas') {
        matchStatus = act.status === 'Próxima' || (act.scheduledDate ? act.scheduledDate > todayStr && act.status === 'Pendiente' : false);
      } else if (selectedStatus === 'Completadas') {
        matchStatus = act.status === 'Completada';
      }

      const matchType = selectedType === 'Todos' || act.type === selectedType;
      const matchSeller = selectedSeller === 'Todos' || (act.seller || act.owner) === selectedSeller;

      return matchSearch && matchStatus && matchType && matchSeller;
    });
  }, [activities, searchTerm, selectedStatus, selectedType, selectedSeller, todayStr]);

  // Sellers
  const sellers = useMemo(() => {
    return Array.from(new Set(activities.map((a) => a.seller || a.owner))).filter(Boolean);
  }, [activities]);

  const counts = useMemo(() => {
    return {
      total: activities.length,
      hoy: activities.filter((a) => a.status === 'Hoy' || (a.scheduledDate ? a.scheduledDate === todayStr && a.status === 'Pendiente' : false)).length,
      vencidas: activities.filter((a) => a.status === 'Vencida' || (a.scheduledDate ? a.scheduledDate < todayStr && a.status === 'Pendiente' : false)).length,
      proximas: activities.filter((a) => a.status === 'Próxima' || (a.scheduledDate ? a.scheduledDate > todayStr && a.status === 'Pendiente' : false)).length,
      completadas: activities.filter((a) => a.status === 'Completada').length,
    };
  }, [activities, todayStr]);

  const getTypeIcon = (type: CrmActivity['type']) => {
    switch (type) {
      case 'Llamada':
        return <Phone className="w-3.5 h-3.5 text-blue-500" />;
      case 'Reunión / Visita técnica':
        return <Users className="w-3.5 h-3.5 text-purple-500" />;
      case 'Correo':
        return <Mail className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Levantamiento':
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
      case 'Seguimiento de cotización':
        return <Clock className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedStatus('Todas')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === 'Todas'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500'
              : 'bg-theme-card border-theme-subtle hover:bg-theme-base'
          }`}
        >
          <span className="text-[11px] text-theme-muted block font-medium">Todas</span>
          <span className="text-xl font-bold text-theme-primary font-mono mt-0.5">{counts.total}</span>
        </button>

        <button
          onClick={() => setSelectedStatus('Hoy')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === 'Hoy'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500'
              : 'bg-theme-card border-theme-subtle hover:bg-theme-base'
          }`}
        >
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">Agenda Hoy</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">{counts.hoy}</span>
        </button>

        <button
          onClick={() => setSelectedStatus('Vencidas')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === 'Vencidas'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500'
              : 'bg-theme-card border-theme-subtle hover:bg-theme-base'
          }`}
        >
          <span className="text-[11px] text-rose-600 dark:text-rose-400 block font-medium">Vencidas</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">{counts.vencidas}</span>
        </button>

        <button
          onClick={() => setSelectedStatus('Próximas')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === 'Próximas'
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500'
              : 'bg-theme-card border-theme-subtle hover:bg-theme-base'
          }`}
        >
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Próximas</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{counts.proximas}</span>
        </button>

        <button
          onClick={() => setSelectedStatus('Completadas')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedStatus === 'Completadas'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
              : 'bg-theme-card border-theme-subtle hover:bg-theme-base'
          }`}
        >
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Completadas</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{counts.completadas}</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
            <input
              type="text"
              placeholder="Buscar actividad o cuenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Llamada">Llamadas</option>
            <option value="Reunión / Visita técnica">Reunión / Visita</option>
            <option value="Correo">Correo</option>
            <option value="Levantamiento">Levantamiento</option>
            <option value="Seguimiento de cotización">Seguimiento</option>
          </select>

          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todos">Todos los vendedores</option>
            {sellers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onOpenNewActivity}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agendar actividad</span>
        </button>
      </div>

      {/* Activities List */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-theme-subtle">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center text-theme-muted">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-xs">No hay actividades para el filtro seleccionado</p>
            </div>
          ) : (
            filteredActivities.map((act) => {
              const isOverdue = act.status === 'Vencida' || (act.scheduledDate ? act.scheduledDate < todayStr && act.status === 'Pendiente' : false);
              const isToday = act.status === 'Hoy' || (act.scheduledDate ? act.scheduledDate === todayStr && act.status === 'Pendiente' : false);

              return (
                <div
                  key={act.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-theme-base/50 transition-colors text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-theme-base border border-theme-subtle shrink-0 mt-0.5">
                      {getTypeIcon(act.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-theme-primary text-xs">{act.subject}</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">· {act.account}</span>
                        {act.opportunityFolio && (
                          <span className="text-[10px] text-theme-muted font-mono bg-theme-base px-1.5 py-0.5 rounded border border-theme-subtle">
                            {act.opportunityFolio}
                          </span>
                        )}
                        {isOverdue && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Vencida
                          </span>
                        )}
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Hoy
                          </span>
                        )}
                      </div>
                      <p className="text-theme-muted text-[11px] mt-1 leading-relaxed">{act.notes}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-theme-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {act.scheduledDate || act.when} {act.time || ''}
                        </span>
                        <span>Vendedor: {act.seller || act.owner}</span>
                        <span className={`font-semibold ${
                          act.priority === 'Alta' ? 'text-rose-600' : act.priority === 'Media' ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          Prioridad {act.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {act.status === 'Pendiente' ? (
                      <button
                        onClick={() => onCompleteActivity(act.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completar</span>
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completada</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
