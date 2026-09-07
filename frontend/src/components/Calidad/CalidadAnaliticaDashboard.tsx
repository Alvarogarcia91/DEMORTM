import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  RotateCcw,
  X,
  FileSpreadsheet,
  HelpCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PeriodOption,
  IncidenceTab,
  IncidenceItem,
  ANALYTICS_DATA_BY_PERIOD,
  SmartQualitySuggestion,
} from '../../data/mockCalidadAnaliticaData';
import { PeriodicControl, QualityDeviation } from '../../data/mockCalidadData';

interface CalidadAnaliticaDashboardProps {
  controls?: PeriodicControl[];
  deviations?: QualityDeviation[];
  onNavigateTab?: (tab: string) => void;
  onOpenDeviation?: (deviation: QualityDeviation) => void;
  onOpenControl?: (control: PeriodicControl) => void;
  onStartNewAudit?: (type?: any) => void;
}

export const CalidadAnaliticaDashboard: React.FC<CalidadAnaliticaDashboardProps> = ({
  controls = [],
  deviations = [],
  onNavigateTab,
  onOpenDeviation,
  onOpenControl,
  onStartNewAudit,
}) => {
  // 1. Estados de Filtro
  const [period, setPeriod] = useState<PeriodOption>('30d');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedProcess, setSelectedProcess] = useState<string>('Todos');
  const [selectedClient, setSelectedClient] = useState<string>('Todos');
  const [comparePrevious, setComparePrevious] = useState<boolean>(true);
  const [selectedDefectFilter, setSelectedDefectFilter] = useState<string | null>(null);

  // 2. Modal de Rango Personalizado
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState('2026-09-07');

  // 3. Notificación Toast / Feedback demo
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 4. Drawer de detalle de Mayor Incidencia
  const [selectedIncidenceDetail, setSelectedIncidenceDetail] = useState<IncidenceItem | null>(null);
  const [activeIncidenceTab, setActiveIncidenceTab] = useState<IncidenceTab>('clientes');

  // 5. Sugerencias inteligentes descartadas por el usuario
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  // Dataset según el periodo seleccionado
  const rawData = useMemo(() => {
    return ANALYTICS_DATA_BY_PERIOD[period] || ANALYTICS_DATA_BY_PERIOD['30d'];
  }, [period]);

  // Sugerencias activas filtradas
  const activeSuggestions = useMemo(() => {
    return rawData.suggestions.filter((s) => !dismissedSuggestions.includes(s.id)).slice(0, 3);
  }, [rawData.suggestions, dismissedSuggestions]);

  // KPIs con multiplicadores reactivos según filtros de área/proceso/cliente
  const kpis = useMemo(() => {
    let multiplier = 1.0;
    if (selectedArea !== 'Todas') multiplier *= 0.55;
    if (selectedProcess !== 'Todos') multiplier *= 0.65;
    if (selectedClient !== 'Todos') multiplier *= 0.45;
    if (selectedDefectFilter) multiplier *= 0.35;

    return {
      auditCompliancePercent: Math.min(
        99.4,
        Number((rawData.kpis.auditCompliancePercent + (selectedArea === 'Flexografía' ? 1.4 : 0)).toFixed(1))
      ),
      auditComplianceDiff: rawData.kpis.auditComplianceDiff,
      auditsExecuted: Math.max(8, Math.round(rawData.kpis.auditsExecuted * multiplier)),
      conformingAudits: Math.max(7, Math.round(rawData.kpis.conformingAudits * multiplier)),
      nonConformances: Math.max(1, Math.round(rawData.kpis.nonConformances * multiplier)),
      nonConformancesDiff: rawData.kpis.nonConformancesDiff,
      holdItemsCount: Math.max(0, Math.round(rawData.kpis.holdItemsCount * multiplier)),
      holdPiecesCount: Math.max(1200, Math.round(rawData.kpis.holdPiecesCount * multiplier)),
      deviationsCount: Math.max(1, Math.round(rawData.kpis.deviationsCount * multiplier)),
      deviationsRequireAction: Math.max(1, Math.round(rawData.kpis.deviationsRequireAction * multiplier)),
      avgReleaseMinutes: rawData.kpis.avgReleaseMinutes,
      avgReleaseDiff: rawData.kpis.avgReleaseDiff,
    };
  }, [rawData, selectedArea, selectedProcess, selectedClient, selectedDefectFilter]);

  // Mayor Incidencia filtrada
  const incidenceItems = useMemo(() => {
    let items = rawData.incidence[activeIncidenceTab] || [];
    if (selectedArea !== 'Todas' && activeIncidenceTab === 'procesos') {
      items = items.filter((i) => i.name.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (selectedClient !== 'Todos' && activeIncidenceTab === 'clientes') {
      items = items.filter((i) => i.name.toLowerCase().includes(selectedClient.toLowerCase()));
    }
    return items;
  }, [rawData, activeIncidenceTab, selectedArea, selectedClient]);

  // Pareto con filtro interactivo
  const paretoItems = useMemo(() => {
    return rawData.pareto.map((p) => ({
      ...p,
      isSelected: selectedDefectFilter === p.defect,
    }));
  }, [rawData.pareto, selectedDefectFilter]);

  // Acciones de las Sugerencias Inteligentes
  const handleExecuteSuggestionAction = (sug: SmartQualitySuggestion, actionType: string) => {
    if (actionType === 'filter-area') {
      if (sug.targetFilter?.area) setSelectedArea(sug.targetFilter.area);
      setToastMessage(`✓ Filtro aplicado: Área ${sug.targetFilter?.area}`);
    } else if (actionType === 'filter-client') {
      if (sug.targetFilter?.client) setSelectedClient(sug.targetFilter.client);
      setToastMessage(`✓ Filtro aplicado: Cliente ${sug.targetFilter?.client}`);
    } else if (actionType === 'view-pareto') {
      const targetElement = document.getElementById('calidad-pareto-section');
      if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'view-audits') {
      if (onNavigateTab) onNavigateTab('Auditorías');
    } else if (actionType === 'view-plan') {
      if (onNavigateTab) onNavigateTab('Gestión SGC');
    } else if (actionType === 'open-icar') {
      if (onNavigateTab) onNavigateTab('Gestión SGC');
    }
  };

  const handleExportData = () => {
    setToastMessage(
      `✓ Reporte analítico (${period}, Área: ${selectedArea}, Cliente: ${selectedClient}) exportado a CSV/Excel exitosamente.`
    );
  };

  const handleResetFilters = () => {
    setSelectedArea('Todas');
    setSelectedProcess('Todos');
    setSelectedClient('Todos');
    setSelectedDefectFilter(null);
    setToastMessage('Filtros restablecidos a valores iniciales.');
  };

  return (
    <div className="pt-6 border-t-2 border-dashed border-theme-subtle space-y-6 animate-in fade-in duration-300">
      {/* ===================================================================== */}
      {/* 1. HEADER Y BARRA GLOBAL DE FILTROS ANALÍTICOS                        */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider text-theme-primary uppercase">
                MÓDULO ANALÍTICO GERENCIAL
              </span>
              <span className="text-[11px] font-mono text-theme-muted">RTM QA Intelligence</span>
            </div>
            <h2 className="text-lg font-black text-theme-main mt-1">
              Analítica de Calidad, Tendencias y Sugerencias del Sistema
            </h2>
            <p className="text-xs text-theme-muted">
              Capa de análisis histórico de defectos, cumplimiento de auditorías por proceso y detección temprana de reincidencias.
            </p>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2">
            {(selectedArea !== 'Todas' ||
              selectedProcess !== 'Todos' ||
              selectedClient !== 'Todos' ||
              selectedDefectFilter) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 rounded-xl border border-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-muted hover:text-theme-main hover:bg-theme-muted/40 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Limpiar filtros
              </button>
            )}

            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/40 px-3.5 py-1.5 text-xs font-bold text-theme-main shadow-2xs transition-colors"
            >
              <Download className="h-4 w-4 text-theme-primary" />
              Exportar
            </button>
          </div>
        </div>

        {/* Barra de Filtros compacta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-theme-subtle">
          {/* Selector de Periodos */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-bold text-theme-muted mr-1.5">Periodo:</span>
            {(
              [
                { key: '7d', label: '7 días' },
                { key: '30d', label: '30 días' },
                { key: '60d', label: '60 días' },
                { key: '90d', label: '90 días' },
                { key: 'custom', label: 'Personalizado' },
              ] as const
            ).map((p) => {
              const isSelected = period === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setPeriod(p.key);
                    if (p.key === 'custom') setIsCustomDateModalOpen(true);
                  }}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-theme-primary text-white shadow-xs'
                      : 'border border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/40'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Filtros desplegables: Área, Proceso, Cliente */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Área */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-theme-muted">Área:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1 text-xs font-bold text-theme-main"
              >
                <option value="Todas">Todas</option>
                <option value="Offset">Offset</option>
                <option value="Flexografía">Flexografía</option>
                <option value="Acabados">Acabados</option>
                <option value="Serigrafía">Serigrafía</option>
              </select>
            </div>

            {/* Proceso */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-theme-muted">Proceso:</span>
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1 text-xs font-bold text-theme-main"
              >
                <option value="Todos">Todos</option>
                <option value="Impresión">Impresión</option>
                <option value="Corte">Corte</option>
                <option value="Doblado">Doblado</option>
                <option value="Troquelado">Troquelado</option>
                <option value="Rebobinado">Rebobinado</option>
                <option value="Incoming">Incoming</option>
              </select>
            </div>

            {/* Cliente */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-theme-muted">Cliente:</span>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-2.5 py-1 text-xs font-bold text-theme-main"
              >
                <option value="Todos">Todos</option>
                <option value="Panasonic">Panasonic Industrial</option>
                <option value="BLACK & DECKER">BLACK & DECKER</option>
                <option value="TYCO">TYCO Electronics</option>
                <option value="Fresenius">Fresenius Medical</option>
                <option value="Pentair">Pentair Water</option>
              </select>
            </div>

            {/* Checkbox Comparativa */}
            <label className="flex items-center gap-1.5 text-xs text-theme-muted cursor-pointer pl-2">
              <input
                type="checkbox"
                checked={comparePrevious}
                onChange={(e) => setComparePrevious(e.target.checked)}
                className="rounded text-theme-primary focus:ring-theme-primary"
              />
              <span className="hidden sm:inline">Comparar vs periodo ant.</span>
            </label>
          </div>
        </div>

        {/* Toast Notificación */}
        {toastMessage && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/40 bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-2 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="font-bold hover:underline shrink-0"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. KPIS GERENCIALES COMPLEMENTARIOS (MÁXIMO 6 CARDS)                  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Cumplimiento de auditorías */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-theme-muted block">
            Cumplimiento Auditorías
          </small>
          <b className="font-mono text-2xl font-black text-emerald-600 block">
            {kpis.auditCompliancePercent}%
          </b>
          {comparePrevious && (
            <span className="text-[10px] font-bold text-emerald-600 block truncate">
              {kpis.auditComplianceDiff}
            </span>
          )}
        </div>

        {/* Auditorías realizadas */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-theme-muted block">
            Auditorías Realizadas
          </small>
          <b className="font-mono text-2xl font-black text-theme-main block">
            {kpis.auditsExecuted}
          </b>
          <span className="text-[10px] text-theme-muted block truncate">
            {kpis.conformingAudits} conformes
          </span>
        </div>

        {/* No conformidades */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300 block">
            No Conformidades (NC)
          </small>
          <b className="font-mono text-2xl font-black text-rose-600 block">
            {kpis.nonConformances}
          </b>
          {comparePrevious && (
            <span className="text-[10px] font-bold text-emerald-600 block truncate">
              {kpis.nonConformancesDiff}
            </span>
          )}
        </div>

        {/* Material en HOLD */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300 block">
            Material en HOLD
          </small>
          <b className="font-mono text-2xl font-black text-rose-600 block">
            {kpis.holdItemsCount}
          </b>
          <span className="text-[10px] text-theme-muted block truncate">
            {kpis.holdPiecesCount.toLocaleString()} pzas en cuarentena
          </span>
        </div>

        {/* Desviaciones */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 block">
            Desviaciones Planta
          </small>
          <b className="font-mono text-2xl font-black text-amber-600 block">
            {kpis.deviationsCount}
          </b>
          <span className="text-[10px] text-amber-600 font-bold block truncate">
            {kpis.deviationsRequireAction} requieren acción
          </span>
        </div>

        {/* Tiempo prom. liberación */}
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-3.5 space-y-1 shadow-2xs">
          <small className="text-[10px] font-bold uppercase text-theme-muted block">
            Tiempo Prom. Liberación
          </small>
          <b className="font-mono text-2xl font-black text-theme-main block">
            {kpis.avgReleaseMinutes} <span className="text-xs font-normal">min</span>
          </b>
          <span className="text-[10px] text-emerald-600 font-bold block truncate">
            {kpis.avgReleaseDiff}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. SUGERENCIAS DEL SISTEMA (ACENTO MORADO SMART TIPO REQUISICIONES)   */}
      {/* ===================================================================== */}
      {activeSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Sugerencias del Sistema (Diagnóstico Inteligente QA)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-theme-muted">
              {activeSuggestions.length} recomendaciones activas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-3xl bg-theme-surface border border-purple-500/35 hover:border-purple-500/60 shadow-2xs space-y-3 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin-slow" />
                      Sugerencia QA
                    </span>
                    <span className="rounded-full border border-purple-400 bg-white dark:bg-purple-950/60 px-2 py-0.2 text-[9px] font-bold text-purple-800 dark:text-purple-300 font-mono shadow-2xs">
                      ● SMART
                    </span>
                  </div>

                  <b className="text-xs font-bold text-theme-main block leading-snug">
                    {sug.title}
                  </b>

                  <p className="text-[11px] text-theme-muted leading-relaxed">
                    {sug.reason}
                  </p>

                  {sug.impactNote && (
                    <div className="inline-block rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 text-[10px] font-mono text-purple-800 dark:text-purple-300 font-bold">
                      {sug.impactNote}
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-theme-subtle flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleExecuteSuggestionAction(sug, sug.primaryActionType)}
                      className="rounded-xl bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      {sug.primaryActionLabel}
                    </button>

                    {sug.secondaryActionLabel && (
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteSuggestionAction(sug, sug.secondaryActionType || 'view-pareto')
                        }
                        className="rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/40 px-2.5 py-1.5 text-xs font-bold text-theme-main transition-colors"
                      >
                        {sug.secondaryActionLabel}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDismissedSuggestions((prev) => [...prev, sug.id])}
                    className="text-[11px] text-theme-muted hover:text-rose-600 transition-colors"
                    title="Descartar esta recomendación"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MAYOR INCIDENCIA (TABS: CLIENTES, PARTES, PROCESOS, LÍNEAS, DEFECTOS)*/}
      {/* ===================================================================== */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-theme-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Mayor Incidencia ({period.toUpperCase()})
              </h3>
            </div>
            <p className="text-xs text-theme-muted">
              Entidades que concentran la mayor recurrencia de no conformidades. Haz click en una fila para ver el desglose.
            </p>
          </div>

          {/* Tabs Internas de Mayor Incidencia */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-theme-subtle p-1 bg-theme-muted/20">
            {(
              [
                { key: 'clientes', label: 'Clientes' },
                { key: 'partes', label: 'Partes' },
                { key: 'procesos', label: 'Procesos' },
                { key: 'lineas', label: 'Líneas' },
                { key: 'defectos', label: 'Defectos' },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveIncidenceTab(t.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeIncidenceTab === t.key
                    ? 'bg-theme-surface text-theme-primary shadow-xs'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Incidencia */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-2.5 text-left">#</th>
                <th className="p-2.5 text-left">Entidad / Detalle</th>
                <th className="p-2.5 text-right">No Conformidades</th>
                <th className="p-2.5 text-right">% del Total</th>
                <th className="p-2.5 text-center">Tendencia</th>
                <th className="p-2.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {incidenceItems.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedIncidenceDetail(item)}
                  className="hover:bg-theme-muted/20 cursor-pointer transition-colors group"
                >
                  <td className="p-2.5 font-mono font-bold text-theme-muted">#{idx + 1}</td>
                  <td className="p-2.5">
                    <b className="font-bold text-theme-main group-hover:text-theme-primary transition-colors block">
                      {item.name}
                    </b>
                    {item.subtitle && (
                      <small className="text-theme-muted block truncate max-w-xs">
                        {item.subtitle}
                      </small>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-mono font-black text-rose-600">
                    {item.ncCount} NC
                  </td>
                  <td className="p-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-theme-muted/40 overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${item.totalPercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-theme-main">{item.totalPercent}%</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[11px]">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 font-bold ${
                        item.trend === 'up'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : item.trend === 'down'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-theme-muted/40 text-theme-muted'
                      }`}
                    >
                      {item.trendVal}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncidenceDetail(item);
                      }}
                      className="font-bold text-theme-primary hover:underline"
                    >
                      Ver Detalle &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. PARETO DE DEFECTOS Y 6. TENDENCIA TEMPORAL                         */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="calidad-pareto-section">
        {/* 5. Pareto de Defectos */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-theme-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                  Pareto de Defectos ({period.toUpperCase()})
                </h3>
              </div>
              <p className="text-[11px] text-theme-muted">
                Toca cualquier barra para filtrar los demás indicadores analíticos.
              </p>
            </div>
            {selectedDefectFilter && (
              <button
                type="button"
                onClick={() => setSelectedDefectFilter(null)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Quitar filtro ({selectedDefectFilter})
              </button>
            )}
          </div>

          <div className="space-y-3">
            {paretoItems.map((p) => {
              const isSelected = selectedDefectFilter === p.defect;
              return (
                <div
                  key={p.defect}
                  onClick={() =>
                    setSelectedDefectFilter(isSelected ? null : p.defect)
                  }
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-theme-primary bg-theme-primary/10 shadow-xs'
                      : 'border-theme-subtle bg-theme-muted/10 hover:border-theme-muted'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <b className="font-bold text-theme-main">{p.defect}</b>
                      {isSelected && (
                        <span className="rounded bg-theme-primary text-white text-[9px] font-bold px-1.5 py-0.2">
                          Filtrado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-theme-muted">
                        {p.count} eventos ({p.percent}%)
                      </span>
                      <span className="font-bold text-theme-primary">
                        Acum: {p.cumulativePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Pareto */}
                  <div className="relative h-2 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.percent > 25 ? 'bg-rose-500' : p.percent > 15 ? 'bg-amber-500' : 'bg-theme-primary'
                      }`}
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-theme-muted">
                    <span>{p.diffVsPrev}</span>
                    <span>Toca para aislar este defecto</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Tendencia Temporal de Conformidad y Hallazgos */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                  Tendencia de Conformidad y Hallazgos
                </h3>
              </div>
              <p className="text-[11px] text-theme-muted">
                Evolución de % de auditorías conformes y tiempo promedio de liberación en planta.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 font-mono">
              Objetivo &ge; 95%
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {rawData.trend.map((point) => (
              <div
                key={point.label}
                className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/10 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <b className="text-theme-main">{point.label}</b>
                    <small className="text-theme-muted ml-2 font-mono">({point.date})</small>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span
                      className={`font-black ${
                        point.conformityPercent >= 95.0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600'
                      }`}
                    >
                      {point.conformityPercent}% Conforme
                    </span>
                    <span className="text-rose-600 font-bold">{point.ncCount} NC</span>
                    <span className="text-theme-muted hidden sm:inline">
                      {point.avgReleaseMinutes} min lib.
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      point.conformityPercent >= 95.0 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${point.conformityPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 p-3 text-xs text-theme-muted flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <b>Diagnóstico de Tendencia:</b> La conformidad global creció de forma constante a lo largo del periodo (+4.3 pts), impulsada por la contención estricta en primera pieza antes del arranque de tiraje.
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 7. DESEMPEÑO POR PROCESO Y 8. HEATMAP PROCESO × DEFECTO              */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 7. Desempeño por Proceso */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-theme-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                  Desempeño Comparativo por Proceso
                </h3>
              </div>
              <p className="text-[11px] text-theme-muted">
                Auditorías, nivel de conformidad y tiempo promedio de liberación.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                <tr>
                  <th className="p-2 text-left">Proceso</th>
                  <th className="p-2 text-right">Auditorías</th>
                  <th className="p-2 text-right">Conformidad</th>
                  <th className="p-2 text-right">NC</th>
                  <th className="p-2 text-right">Tiempo Lib.</th>
                  <th className="p-2 text-center">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {rawData.processes.map((proc) => (
                  <tr
                    key={proc.process}
                    onClick={() => {
                      setSelectedArea(proc.process);
                      setToastMessage(`✓ Filtro de Área aplicado: ${proc.process}`);
                    }}
                    className="hover:bg-theme-muted/20 cursor-pointer transition-colors"
                  >
                    <td className="p-2">
                      <b className="text-theme-main block">{proc.process}</b>
                      <small className="text-theme-muted font-mono">{proc.area}</small>
                    </td>
                    <td className="p-2 text-right font-mono">{proc.auditsCount}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-600">
                      {proc.conformityPercent}%
                    </td>
                    <td className="p-2 text-right font-mono text-rose-600 font-bold">{proc.ncCount}</td>
                    <td className="p-2 text-right font-mono text-theme-muted">{proc.avgReleaseMinutes}m</td>
                    <td className="p-2 text-center font-mono">
                      {proc.trend === 'up' ? (
                        <span className="text-emerald-600 font-bold">↑ Mejora</span>
                      ) : proc.trend === 'down' ? (
                        <span className="text-rose-600 font-bold">↓ Caída</span>
                      ) : (
                        <span className="text-theme-muted">→ Estable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Matriz Proceso × Defecto (Heatmap Compacto) */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-theme-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Matriz Proceso &times; Defecto (Concentración de Hallazgos)
              </h3>
            </div>
            <p className="text-[11px] text-theme-muted">
              Identifica rápidamente en qué estación se genera cada tipo de defecto.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
                <tr>
                  <th className="p-2 text-left">Defecto \ Estación</th>
                  <th className="p-2 text-center">Impresión</th>
                  <th className="p-2 text-center">Corte</th>
                  <th className="p-2 text-center">Doblado</th>
                  <th className="p-2 text-center">Troquel</th>
                  <th className="p-2 text-center">Rebobinado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {rawData.heatmap.map((row) => (
                  <tr key={row.defect} className="hover:bg-theme-muted/20">
                    <td className="p-2 font-bold text-theme-main">{row.defect}</td>
                    {['Impresión', 'Corte', 'Doblado', 'Troquel', 'Rebobinado'].map((st) => {
                      const count = row.counts[st] || 0;
                      return (
                        <td key={st} className="p-2 text-center">
                          {count > 0 ? (
                            <span
                              className={`inline-block rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                                count >= 8
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                  : count >= 4
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-theme-muted/40 text-theme-main'
                              }`}
                            >
                              {count}
                            </span>
                          ) : (
                            <span className="text-theme-muted font-mono">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 9. REINCIDENCIAS Y 10. CONTROLES PERIÓDICOS (CUMPLIMIENTO CAPTURAS)    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 9. Reincidencias y Problemas Repetitivos */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Reincidencias y Problemas Repetitivos
              </h3>
            </div>
            <span className="text-[10px] font-mono text-theme-muted">
              {rawData.reincidencias.length} alertas abiertas
            </span>
          </div>

          <div className="space-y-3">
            {rawData.reincidencias.map((reinc) => (
              <div
                key={reinc.id}
                className="p-3.5 rounded-2xl border border-amber-400/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <b className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {reinc.title}
                    </b>
                    {reinc.icarId && (
                      <span className="font-mono text-[10px] font-bold text-theme-primary bg-theme-surface px-1.5 py-0.2 rounded border border-theme-subtle">
                        {reinc.icarId}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-theme-muted mt-1 leading-relaxed">
                    {reinc.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-300/40 flex items-center justify-between">
                  <span className="text-[10px] text-theme-muted font-mono">
                    {reinc.eventsCount} eventos · {reinc.opsCount} OP · {reinc.clientsCount} clientes
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (reinc.deviationId && onOpenDeviation && deviations.length > 0) {
                        const dev = deviations.find((d) => d.id === reinc.deviationId) || deviations[0];
                        onOpenDeviation(dev);
                      } else if (onNavigateTab) {
                        onNavigateTab('Gestión SGC');
                      }
                    }}
                    className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90 flex items-center gap-1"
                  >
                    [{reinc.actionLabel}]
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10. Controles Periódicos (Cumplimiento de Capturas) */}
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-theme-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-theme-main">
                Cumplimiento de Controles Periódicos
              </h3>
            </div>
            <b className="font-mono text-sm text-emerald-600">97.4% al corriente</b>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-theme-muted/20 p-2.5">
              <small className="text-[10px] text-theme-muted uppercase font-bold block">En Tiempo</small>
              <b className="font-mono text-lg font-black text-emerald-600">146</b>
            </div>
            <div className="rounded-xl bg-theme-muted/20 p-2.5">
              <small className="text-[10px] text-theme-muted uppercase font-bold block">Vencidas</small>
              <b className="font-mono text-lg font-black text-amber-600">4</b>
            </div>
            <div className="rounded-xl bg-theme-muted/20 p-2.5">
              <small className="text-[10px] text-rose-700 dark:text-rose-300 uppercase font-bold block">
                Fuera de Rango
              </small>
              <b className="font-mono text-lg font-black text-rose-600">3</b>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-theme-muted uppercase block">
              Últimos Parámetros Fuera de Rango:
            </span>
            <div className="rounded-xl border border-rose-300 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 flex items-center justify-between text-xs">
              <div>
                <b className="text-theme-main block">Temperatura cuarto de adhesivos</b>
                <span className="text-[10px] text-theme-muted">Prensa Flexo Mark Andy Scout</span>
              </div>
              <div className="text-right">
                <b className="font-mono text-rose-600">25.8 °C</b>
                <small className="block text-[10px] text-theme-muted">máx: 24.0 °C</small>
              </div>
            </div>

            <div className="rounded-xl border border-rose-300 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 flex items-center justify-between text-xs">
              <div>
                <b className="text-theme-main block">Humedad almacén sensible</b>
                <span className="text-[10px] text-theme-muted">Almacén MP Bobinas BoPP</span>
              </div>
              <div className="text-right">
                <b className="font-mono text-rose-600">64 %RH</b>
                <small className="block text-[10px] text-theme-muted">máx: 60 %RH</small>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-theme-subtle flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('Captura')}
              className="rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/30 px-3.5 py-1.5 text-xs font-bold text-theme-main shadow-2xs"
            >
              Ver Todas las Capturas
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenControl && controls.length > 0) {
                  onOpenControl(controls[0]);
                } else if (onNavigateTab) {
                  onNavigateTab('Captura');
                }
              }}
              className="rounded-xl bg-theme-primary hover:bg-theme-primary/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              Capturar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DRAWER / MODAL DE DETALLE DE MAYOR INCIDENCIA                         */}
      {/* ===================================================================== */}
      {selectedIncidenceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <div>
                <span className="text-[10px] uppercase font-bold text-theme-muted">
                  Detalle de Incidencia
                </span>
                <h3 className="text-sm font-black text-theme-main">{selectedIncidenceDetail.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncidenceDetail(null)}
                className="text-theme-muted hover:text-theme-main p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-theme-muted/20 flex justify-between items-center">
                <span>Total No Conformidades:</span>
                <b className="font-mono text-base text-rose-600 font-black">
                  {selectedIncidenceDetail.ncCount} NC ({selectedIncidenceDetail.totalPercent}% del total)
                </b>
              </div>

              {selectedIncidenceDetail.topDefects && (
                <div className="space-y-1.5">
                  <span className="font-bold text-theme-main block">Principales Defectos:</span>
                  <div className="space-y-1">
                    {selectedIncidenceDetail.topDefects.map((d) => (
                      <div
                        key={d.defect}
                        className="flex justify-between p-2 rounded-xl bg-theme-muted/10 text-[11px]"
                      >
                        <span className="text-theme-main">{d.defect}</span>
                        <b className="font-mono text-rose-600">{d.count} eventos</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncidenceDetail.affectedParts && (
                <div className="space-y-1.5">
                  <span className="font-bold text-theme-main block">Partes más Afectadas:</span>
                  <div className="space-y-1">
                    {selectedIncidenceDetail.affectedParts.map((p) => (
                      <div
                        key={p.part}
                        className="flex justify-between p-2 rounded-xl bg-theme-muted/10 text-[11px]"
                      >
                        <span className="font-mono font-bold text-theme-primary">{p.part}</span>
                        <b className="font-mono text-theme-main">{p.count} NCs</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-theme-subtle flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeIncidenceTab === 'clientes') {
                    setSelectedClient(selectedIncidenceDetail.name);
                  } else if (activeIncidenceTab === 'procesos') {
                    setSelectedProcess(selectedIncidenceDetail.name);
                  }
                  setSelectedIncidenceDetail(null);
                  setToastMessage(`✓ Filtro aplicado: ${selectedIncidenceDetail.name}`);
                }}
                className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
              >
                Filtrar por esta Entidad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL DE RANGO PERSONALIZADO                                          */}
      {/* ===================================================================== */}
      {isCustomDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-xs font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-theme-primary" /> Periodo Personalizado
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomDateModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Fecha Inicial:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
                />
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Fecha Final:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-theme-subtle flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomDateModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-3 py-1.5 text-xs font-bold text-theme-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomDateModalOpen(false);
                  setToastMessage(`✓ Periodo personalizado aplicado: ${customStartDate} al ${customEndDate}`);
                }}
                className="rounded-xl bg-theme-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                Aplicar Rango
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
