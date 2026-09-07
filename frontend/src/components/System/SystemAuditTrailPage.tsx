import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  History,
  Layers,
  LayoutList,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import {
  AUDIT_SYSTEM_SUGGESTIONS,
  AuditModuleKey,
  AuditSystemSuggestion,
  GlobalAuditEvent,
  INITIAL_GLOBAL_AUDIT_EVENTS,
} from '../../data/mockAuditTrailData';
import { AuditTrailFilters } from './AuditTrailFilters';
import { AuditTimeline } from './AuditTimeline';
import { AuditModuleSummary } from './AuditModuleSummary';
import { AuditEventDetailDrawer } from './AuditEventDetailDrawer';

interface SystemAuditTrailPageProps {
  onNavigateToOrigin?: (module: string, query?: string) => void;
}

export const SystemAuditTrailPage: React.FC<SystemAuditTrailPageProps> = ({
  onNavigateToOrigin,
}) => {
  const [events, setEvents] = useState<GlobalAuditEvent[]>(INITIAL_GLOBAL_AUDIT_EVENTS);
  const [suggestions] = useState<AuditSystemSuggestion[]>(AUDIT_SYSTEM_SUGGESTIONS);

  // Estados de vista y filtros
  const [viewMode, setViewMode] = useState<'cronologia' | 'modulo'>('cronologia');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30 días');
  const [selectedModule, setSelectedModule] = useState<string>('Todos');
  const [selectedUser, setSelectedUser] = useState<string>('Todos');
  const [selectedActionType, setSelectedActionType] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawer de detalle
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<GlobalAuditEvent | null>(null);

  // Notificación toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Lista única de usuarios disponibles para el filtro
  const availableUsers = useMemo(() => {
    const set = new Set(events.map((e) => e.user));
    return Array.from(set).sort();
  }, [events]);

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchModule = selectedModule === 'Todos' || e.module === selectedModule;
      const matchUser = selectedUser === 'Todos' || e.user === selectedUser;

      let matchAction = true;
      if (selectedActionType === 'Aprobaciones') {
        matchAction = e.action.toLowerCase().includes('liber') || e.action.toLowerCase().includes('autoriz') || e.action.toLowerCase().includes('dictamin');
      } else if (selectedActionType === 'Cambios') {
        matchAction = e.changes !== undefined && e.changes.length > 0;
      } else if (selectedActionType === 'Ajustes') {
        matchAction = e.action.toLowerCase().includes('reabrió') || e.action.toLowerCase().includes('reprogramó') || e.action.toLowerCase().includes('ajuste');
      } else if (selectedActionType === 'ConMotivo') {
        matchAction = Boolean(e.reason && e.reason.trim().length > 0);
      }

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        e.action.toLowerCase().includes(query) ||
        e.reference.toLowerCase().includes(query) ||
        e.user.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        (e.reason && e.reason.toLowerCase().includes(query)) ||
        (e.related && e.related.some((r) => r.label.toLowerCase().includes(query)));

      return matchModule && matchUser && matchAction && matchSearch;
    });
  }, [events, selectedModule, selectedUser, selectedActionType, searchQuery]);

  // KPIs superiores discretos
  const totalMovements = events.length;
  const approvalsCount = events.filter((e) => e.action.toLowerCase().includes('liber') || e.action.toLowerCase().includes('autoriz') || e.action.toLowerCase().includes('ganó')).length;
  const stateChangesCount = events.filter((e) => e.changes && e.changes.length > 0).length;
  const withReasonCount = events.filter((e) => e.reason).length;
  const attentionCount = events.filter((e) => e.severity === 'warning' || e.severity === 'danger').length;

  const handleExport = () => {
    showToast(`✓ Bitácora oficial de auditoría exportada exitosamente (${filteredEvents.length} registros incluidos).`);
  };

  const handleResetFilters = () => {
    setSelectedPeriod('30 días');
    setSelectedModule('Todos');
    setSelectedUser('Todos');
    setSelectedActionType('Todas');
    setSearchQuery('');
  };

  return (
    <div className="max-w-[1520px] mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white dark:hover:text-zinc-900 ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Principal de la Bitácora */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Sistema · Trazabilidad Transversal
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Audit Trail Enterprise
              </span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              Bitácora del Sistema
            </h1>
            <p className="text-xs text-zinc-500 max-w-2xl mt-0.5">
              Consulta cambios importantes, aprobaciones y movimientos realizados en la plataforma con justificación y trazabilidad de origen.
            </p>
          </div>

          {/* Toggle de Modo de Vista */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('cronologia')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cronologia'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Cronología</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('modulo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'modulo'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Por módulo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 KPIs Discretos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Movimientos Registrados
            </span>
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-white mt-0.5 block">
              {totalMovements}
            </span>
            <span className="text-[10px] text-zinc-500">trazabilidad global</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Aprobaciones & Firmas
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {approvalsCount}
            </span>
            <span className="text-[10px] text-zinc-500">liberaciones formales</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Cambios de Estado
            </span>
            <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">
              {stateChangesCount}
            </span>
            <span className="text-[10px] text-zinc-500">con antes vs ahora</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Ajustes con Motivo
            </span>
            <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5 block">
              {withReasonCount}
            </span>
            <span className="text-[10px] text-zinc-500">justificados en piso</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              Eventos de Atención
            </span>
            <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-0.5 block">
              {attentionCount}
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">reaperturas / retenciones</span>
          </div>
        </div>
      </div>

      {/* BLOQUE MORADO: SUGERENCIAS DEL SISTEMA */}
      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-200">
                  Sugerencias del Sistema
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200">
                  ✦ Patrones Detectados
                </span>
              </div>
              <p className="text-xs text-purple-900/70 dark:text-purple-300/70">
                Observaciones cruzadas basadas en la frecuencia de reprogramaciones, reaperturas y justificaciones registradas.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 md:grid-cols-3">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-200/80 dark:border-purple-900/50 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  {sug.badge}
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{sug.title}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (sug.targetModuleFilter) setSelectedModule(sug.targetModuleFilter);
                    if (sug.searchQuery) setSearchQuery(sug.searchQuery);
                    setViewMode('cronologia');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 text-xs font-bold hover:bg-purple-200 transition-colors cursor-pointer"
                >
                  {sug.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTROS AVANZADOS */}
      <AuditTrailFilters
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        selectedModule={selectedModule}
        onSelectModule={setSelectedModule}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        selectedActionType={selectedActionType}
        onSelectActionType={setSelectedActionType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetFilters={handleResetFilters}
        onExportAudit={handleExport}
        availableUsers={availableUsers}
      />

      {/* VISTA PRINCIPAL (CRONOLOGÍA O POR MÓDULO) */}
      {viewMode === 'cronologia' ? (
        <AuditTimeline
          events={filteredEvents}
          onOpenEventDetail={(ev) => setSelectedEventForDetail(ev)}
          onNavigateToOrigin={(mod, q) => onNavigateToOrigin?.(mod, q)}
        />
      ) : (
        <AuditModuleSummary
          events={filteredEvents}
          onSelectModuleFilter={(mod) => {
            setSelectedModule(mod);
            setViewMode('cronologia');
          }}
          onOpenEventDetail={(ev) => setSelectedEventForDetail(ev)}
        />
      )}

      {/* DRAWER DETALLE HUMANO DEL CAMBIO */}
      {selectedEventForDetail && (
        <AuditEventDetailDrawer
          event={selectedEventForDetail}
          onClose={() => setSelectedEventForDetail(null)}
          onNavigateToOrigin={(mod, q) => onNavigateToOrigin?.(mod, q)}
        />
      )}
    </div>
  );
};
