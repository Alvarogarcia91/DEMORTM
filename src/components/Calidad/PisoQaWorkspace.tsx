import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, MapPin,
  Sparkles, ArrowRight, Activity, Building2, Layers,
  ChevronRight, Thermometer, Filter, AlertOctagon, User,
  Check, RefreshCw, Eye, Printer, Play, Flag
} from 'lucide-react';
import {
  QualityAuditItem,
  PeriodicControl,
  QualityRelease,
  NonConformance,
  BatchSample,
  ZebraLabelConfig
} from '../../data/mockCalidadData';
import { ProductionOrder } from '../../data/mockProduccionData';
import { PisoQaAuditModal } from './PisoQaAuditModal';

interface PisoQaWorkspaceProps {
  orders: ProductionOrder[];
  audits: QualityAuditItem[];
  controls: PeriodicControl[];
  onUpdateProductionOrder: (id: string, patch: Partial<ProductionOrder>) => void;
  onCompleteAudit: (audit: QualityAuditItem, effect: 'approve' | 'reject' | 'draft', reason?: string) => void;
  onOpenControl: (ctrl: PeriodicControl) => void;
  onOpenLabelPreview?: (op: string, client: string, part: string, lot: string) => void;
  onNavigateTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
}

export const PisoQaWorkspace: React.FC<PisoQaWorkspaceProps> = ({
  orders,
  audits,
  controls,
  onUpdateProductionOrder,
  onCompleteAudit,
  onOpenControl,
  onOpenLabelPreview,
  onNavigateTab,
  onToast,
}) => {
  // Navigation & View mode
  const [viewMode, setViewMode] = useState<'route' | 'radar'>('route');
  const [selectedArea, setSelectedArea] = useState<string>('Toda planta');
  const [activeAuditor, setActiveAuditor] = useState<string>('Alicia Ramírez');

  // Active execution modal
  const [executingAudit, setExecutingAudit] = useState<QualityAuditItem | null>(null);
  const [routeStepIndex, setRouteStepIndex] = useState<number>(0);

  // Filtered queue of pending audits
  const pendingAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchArea =
        selectedArea === 'Toda planta' ||
        a.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
        (selectedArea === 'Flexo' && a.area === 'Flexografía');
      return matchArea && a.status === 'Pendiente';
    });
  }, [audits, selectedArea]);

  // Prioritized Route Order
  // 1. Bloquea producción (Primera pieza)
  // 2. Vencida (waitingMinutes > 15)
  // 3. Auditoría final
  // 4. Control > 2h
  // 5. Otros
  const prioritizedRoute = useMemo(() => {
    const list = [...pendingAudits];
    return list.sort((a, b) => {
      const scoreA =
        (a.type === 'Primera pieza' ? 100 : 0) +
        (a.waitingMinutes > 15 ? 50 : 0) +
        (a.type === 'Auditoría final' ? 40 : 0) +
        (a.type === 'Control > 2 horas' ? 30 : 0);
      const scoreB =
        (b.type === 'Primera pieza' ? 100 : 0) +
        (b.waitingMinutes > 15 ? 50 : 0) +
        (b.type === 'Auditoría final' ? 40 : 0) +
        (b.type === 'Control > 2 horas' ? 30 : 0);
      return scoreB - scoreA;
    });
  }, [pendingAudits]);

  // Next audit in suggested route
  const nextAuditInRoute = useMemo(() => {
    if (!executingAudit) return prioritizedRoute[0] || null;
    const currIdx = prioritizedRoute.findIndex((a) => a.id === executingAudit.id);
    if (currIdx >= 0 && currIdx < prioritizedRoute.length - 1) {
      return prioritizedRoute[currIdx + 1];
    }
    return null;
  }, [prioritizedRoute, executingAudit]);

  // Quick stats
  const stats = useMemo(() => {
    const pendingCount = audits.filter((a) => a.status === 'Pendiente').length;
    const overdueCount = audits.filter((a) => a.status === 'Pendiente' && a.waitingMinutes >= 15).length;
    const blockingCount = audits.filter(
      (a) => a.status === 'Pendiente' && (a.type === 'Primera pieza' || a.waitingMinutes > 20)
    ).length;
    const environmentalCount = controls.filter((c) => c.status === 'Fuera de rango' || c.status === 'Vencida').length;
    const finalAuditCount = audits.filter((a) => a.type === 'Auditoría final').length;

    return {
      pendingCount,
      overdueCount,
      blockingCount,
      environmentalCount,
      finalAuditCount,
    };
  }, [audits, controls]);

  // Helper to start suggested route
  const handleStartSuggestedRoute = () => {
    if (prioritizedRoute.length > 0) {
      setExecutingAudit(prioritizedRoute[0]);
    } else if (onToast) {
      onToast('No hay auditorías pendientes en la ruta sugerida.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header de Piso QA */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                Consola Diaria de Planta &middot; Piso QA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300">
                Turno A (06:00 - 14:00)
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-theme-main mt-1">
              Piso QA · {activeAuditor}
            </h1>
            <p className="text-xs text-theme-muted">
              Ruta activa de auditorías en piso, desbloqueo de corridas y controles de calidad por máquina.
            </p>
          </div>

          {/* Top Auditor and View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex bg-theme-muted/50 p-1 rounded-2xl border border-theme-subtle text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('route')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'route'
                    ? 'bg-theme-surface text-theme-main shadow-xs'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Mi ruta ({prioritizedRoute.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('radar')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'radar'
                    ? 'bg-theme-surface text-theme-main shadow-xs'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                Radar de planta
              </button>
            </div>

            {/* Auditor Selector */}
            <select
              value={activeAuditor}
              onChange={(e) => setActiveAuditor(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-theme-subtle bg-theme-surface text-xs font-semibold text-theme-main focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Alicia Ramírez">Alicia Ramírez (Líder QA)</option>
              <option value="Jorge Márquez">Jorge Márquez (Inspector)</option>
              <option value="Carlos Morales">Carlos Morales (Turno B)</option>
            </select>
          </div>
        </div>

        {/* Status Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="p-3 bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xs">
            <span className="text-[11px] text-theme-muted block font-medium">Total Pendientes</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black font-mono text-theme-main">{stats.pendingCount}</span>
              <span className="text-[10px] text-theme-muted">en cola</span>
            </div>
          </div>

          <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl shadow-2xs">
            <span className="text-[11px] text-rose-700 dark:text-rose-300 block font-medium">Bloquean Producción</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400">{stats.blockingCount}</span>
              <span className="text-[10px] text-rose-600 font-semibold">1ra pieza / HOLD</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl shadow-2xs">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 block font-medium">Esperando &gt; 15 min</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">{stats.overdueCount}</span>
              <span className="text-[10px] text-amber-600 font-semibold">Urgencia alta</span>
            </div>
          </div>

          <div className="p-3 bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xs">
            <span className="text-[11px] text-theme-muted block font-medium">Control Ambiental</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black font-mono text-purple-600 dark:text-purple-400">{stats.environmentalCount}</span>
              <span className="text-[10px] text-theme-muted font-mono">Cuarto adhesivos</span>
            </div>
          </div>

          <div className="p-3 bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xs">
            <span className="text-[11px] text-theme-muted block font-medium">Auditorías Finales</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">{stats.finalAuditCount}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Liberación PT</span>
            </div>
          </div>
        </div>

        {/* Area Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-theme-subtle text-xs font-semibold">
          <span className="text-theme-muted mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Área:
          </span>
          {['Toda planta', 'Flexografía', 'Offset', 'Acabados', 'Almacén MP'].map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedArea === area
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'bg-theme-muted/40 text-theme-muted hover:text-theme-main'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sugerencia del Sistema SMART — Ruta Inteligente (Sección 4 del MD) */}
      <div className="bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 border border-purple-500/30 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                Ruta Sugerida del Sistema
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                  Secuencia Prioritaria
                </span>
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                El sistema calculó el orden óptimo de inspección para minimizar paros de máquina y riesgos de calidad.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartSuggestedRoute}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
          >
            <span>Iniciar ruta sugerida</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Prioritized Stations in Suggested Route */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-theme-surface border border-purple-200/60 dark:border-purple-900/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                1
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                Bloquea producción
              </span>
            </div>
            <strong className="block text-theme-main">OP-2026-95250 · Panasonic</strong>
            <p className="text-[11px] text-theme-muted">Primera Pieza · Mark Andy Scout</p>
            <span className="text-[10px] text-rose-600 font-bold block">18 min esperando arranque</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-surface border border-purple-200/60 dark:border-purple-900/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                2
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Corrida &gt; 2h
              </span>
            </div>
            <strong className="block text-theme-main">OP-2026-95252 · TYCO</strong>
            <p className="text-[11px] text-theme-muted">Control &gt; 2 horas · Mark Andy 830</p>
            <span className="text-[10px] text-amber-600 font-bold block">Auditoría mandatoria activa</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-surface border border-purple-200/60 dark:border-purple-900/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                3
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                Ronda 10:00
              </span>
            </div>
            <strong className="block text-theme-main">Cuarto de Adhesivos</strong>
            <p className="text-[11px] text-theme-muted">Temperatura fuera de rango (25.8 °C)</p>
            <span className="text-[10px] text-purple-600 font-bold block">Captura de verificación requerida</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-surface border border-purple-200/60 dark:border-purple-900/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                4
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Liberación PT
              </span>
            </div>
            <strong className="block text-theme-main">OP-2026-95249 · BLACK & DECKER</strong>
            <p className="text-[11px] text-theme-muted">Bache BCH-44947 (145 folletos)</p>
            <span className="text-[10px] text-emerald-600 font-bold block">Muestreo final para entrega</span>
          </div>
        </div>
      </div>

      {/* 3. VISTA "MI RUTA": Cards operativas grandes y táctiles */}
      {viewMode === 'route' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Cola Operativa Priorizada ({prioritizedRoute.length} estaciones)
            </h3>
            <span className="text-xs text-theme-muted font-mono">
              Orden automático por impacto en planta
            </span>
          </div>

          <div className="space-y-3.5">
            {prioritizedRoute.map((audit, index) => {
              const isFirstPiece = audit.type === 'Primera pieza';
              const isOverdue = audit.waitingMinutes >= 15;
              const isFinal = audit.type === 'Auditoría final';

              return (
                <div
                  key={audit.id}
                  className={`p-5 rounded-3xl border bg-theme-surface shadow-xs transition-all hover:shadow-md ${
                    isFirstPiece
                      ? 'border-l-6 border-l-rose-500 border-theme-subtle'
                      : isOverdue
                      ? 'border-l-6 border-l-amber-500 border-theme-subtle'
                      : 'border-theme-subtle'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isFirstPiece
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : isOverdue
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-theme-muted text-theme-muted'
                          }`}
                        >
                          PRIORIDAD {index + 1} &middot; Esperando {audit.waitingMinutes} min
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200">
                          {audit.type.toUpperCase()}
                        </span>

                        <span className="text-xs font-mono font-bold text-theme-muted">{audit.folio}</span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-base font-black text-theme-main font-mono">
                            {audit.origin} &middot; {audit.client}
                          </h4>
                        </div>
                        <p className="text-xs text-theme-muted mt-0.5 font-medium">
                          {audit.part} &middot; {audit.revision} &middot; Línea: <strong className="text-theme-main">{audit.line}</strong> ({audit.area})
                        </p>
                      </div>

                      {/* Motivo & Checklist preview */}
                      <div className="p-3 bg-theme-muted/30 rounded-2xl border border-theme-subtle text-xs space-y-1.5">
                        <div className="flex items-center gap-2 text-theme-main">
                          <span className="font-bold">Motivo del evento:</span>
                          <span className={`${isFirstPiece ? 'text-rose-600 font-bold' : 'text-theme-muted'}`}>
                            {isFirstPiece
                              ? 'Inicio de corrida · PRODUCCIÓN BLOQUEADA'
                              : audit.type === 'Control > 2 horas'
                              ? 'Producción continua > 2 horas sin control'
                              : audit.type === 'Auditoría final'
                              ? 'Lote terminado listo para liberación a PT'
                              : audit.notes || 'Auditoría operativa de proceso'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-theme-muted">
                          <span>Debes revisar:</span>
                          <span className="font-semibold text-purple-700 dark:text-purple-300">
                            {audit.operationType === 'Impresión + Troquel'
                              ? 'Registro · Color · Texto · Troquel · Dimensiones'
                              : audit.operationType === 'Corte'
                              ? 'Escuadra · Ancho · Largo · Hilo de fibra'
                              : audit.operationType === 'Doblado'
                              ? 'Secuencia de paginado · Doblez · Paginado'
                              : 'Atributos generales · Especificación técnica'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right action button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                      <span className="text-[11px] text-theme-muted font-mono">
                        Operador: {audit.operator}
                      </span>

                      <button
                        type="button"
                        onClick={() => setExecutingAudit(audit)}
                        className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer ${
                          isFirstPiece
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                        }`}
                      >
                        <span>{isFinal ? 'Auditar muestra PT' : 'Ir a auditar'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* In-between card: Captura ambiental programada en Cuarto de Adhesivos */}
            <div className="p-5 rounded-3xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/20 dark:bg-purple-950/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                    RONDA PROGRAMADA &middot; Vence 10:00
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600">Fuera de rango (25.8 °C)</span>
                </div>
                <h4 className="font-bold text-sm text-theme-main">
                  Temperatura Cuarto de Adhesivos y Sustratos Sensibles
                </h4>
                <p className="text-xs text-theme-muted">
                  Instrumento: Termohigrómetro Digital QA-HG-004 · Rango esperado: 20.0–24.0 °C
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenControl(controls[0])}
                className="px-4 py-2.5 bg-theme-surface border border-purple-300 rounded-2xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 flex items-center gap-1.5 shrink-0"
              >
                <Activity className="w-4 h-4" />
                <span>Capturar medición</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VISTA "RADAR DE PLANTA": Agrupación visual por área y máquinas */}
      {viewMode === 'radar' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-theme-main flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Radar de Planta &middot; Estado QA por Máquina
            </h3>
            <span className="text-xs text-theme-muted font-mono">
              Haz clic en cualquier estación para atender su pendiente
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* FLEXOGRAFÍA */}
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <h4 className="font-extrabold text-sm text-theme-main">FLEXOGRAFÍA</h4>
                <span className="text-xs text-rose-600 font-bold">2 pendientes</span>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const match = audits.find((a) => a.line.includes('Scout'));
                    if (match) setExecutingAudit(match);
                  }}
                  className="w-full p-3 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 text-left hover:border-rose-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-theme-main group-hover:text-rose-600">Mark Andy Scout 10"</strong>
                    <span className="text-[11px] text-theme-muted">OP-95250 · Panasonic</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                    🔴 Primera pieza
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const match = audits.find((a) => a.line.includes('830'));
                    if (match) setExecutingAudit(match);
                  }}
                  className="w-full p-3 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-left hover:border-amber-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-theme-main group-hover:text-amber-600">Mark Andy 830 10"</strong>
                    <span className="text-[11px] text-theme-muted">OP-95252 · TYCO</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                    🟠 Control &gt;2h
                  </span>
                </button>

                <div className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 text-left flex items-center justify-between">
                  <div>
                    <strong className="block text-theme-muted">Mark Andy 4120</strong>
                    <span className="text-[11px] text-theme-muted">En corrida estable</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                    ✓ Sin pendientes
                  </span>
                </div>
              </div>
            </div>

            {/* OFFSET */}
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <h4 className="font-extrabold text-sm text-theme-main">OFFSET</h4>
                <span className="text-xs text-amber-600 font-bold">1 en proceso</span>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const match = audits.find((a) => a.origin.includes('95249'));
                    if (match) setExecutingAudit(match);
                  }}
                  className="w-full p-3 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-left hover:border-amber-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-theme-main group-hover:text-amber-600">Heidelberg Speedmaster</strong>
                    <span className="text-[11px] text-theme-muted">OP-95249 · BLACK & DECKER</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                    🟡 Muestra Final
                  </span>
                </button>

                <div className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 text-left flex items-center justify-between">
                  <div>
                    <strong className="block text-theme-muted">Conserver 3-4</strong>
                    <span className="text-[11px] text-theme-muted">Turno cubierto</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                    ✓ Sin pendientes
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 text-left flex items-center justify-between">
                  <div>
                    <strong className="block text-theme-muted">Ryobi 524HX</strong>
                    <span className="text-[11px] text-theme-muted">Programada 14:00</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                    ✓ Sin pendientes
                  </span>
                </div>
              </div>
            </div>

            {/* ACABADOS & ALMACÉN */}
            <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
                <h4 className="font-extrabold text-sm text-theme-main">ACABADOS & ALMACÉN</h4>
                <span className="text-xs text-purple-600 font-bold">2 acciones</span>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenControl(controls[0])}
                  className="w-full p-3 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 text-left hover:border-rose-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-theme-main group-hover:text-rose-600">Cuarto de Adhesivos</strong>
                    <span className="text-[11px] text-theme-muted">25.8 °C (Límite 24.0 °C)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                    🔴 Ambiental
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const match = audits.find((a) => a.type === 'Incoming');
                    if (match) setExecutingAudit(match);
                  }}
                  className="w-full p-3 rounded-2xl border border-purple-300 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 text-left hover:border-purple-500 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-theme-main group-hover:text-purple-600">Andén de Recibo</strong>
                    <span className="text-[11px] text-theme-muted">OC-1402 · Avery Dennison</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white">
                    🟣 Incoming
                  </span>
                </button>

                <div className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 text-left flex items-center justify-between">
                  <div>
                    <strong className="block text-theme-muted">Guillotina Polar 115</strong>
                    <span className="text-[11px] text-theme-muted">Cuchilla afilada</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                    ✓ Sin pendientes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DE AUDITORÍA EN PISO */}
      {executingAudit && (
        <PisoQaAuditModal
          audit={executingAudit}
          nextAudit={nextAuditInRoute}
          onClose={() => setExecutingAudit(null)}
          onCompleteAudit={(completedAudit, effect, reason) => {
            onCompleteAudit(completedAudit, effect, reason);
          }}
          onContinueNext={(next) => {
            setExecutingAudit(next);
          }}
          onOpenLabelPreview={onOpenLabelPreview}
        />
      )}
    </div>
  );
};
