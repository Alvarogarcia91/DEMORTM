import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  FileText,
  FileCheck2,
  HelpCircle,
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Truck,
  Eye,
  X,
} from 'lucide-react';
import { SupplierMaster } from '../../../../data/mockSuppliersData';
import { IncomingInspection } from '../../../../data/mockCalidadData';
import {
  SupplierQualityPeriod,
  SupplierEvaluationStatus,
  SupplierScorecardItem,
  SupplierCorrectiveAction,
  SupplierQualitySuggestion,
  calculateSupplierScorecard,
  INITIAL_SUPPLIER_SUGGESTIONS,
} from '../../../../data/mockSupplierQualityData';
import { NuevaAccionCorrectivaModal } from './NuevaAccionCorrectivaModal';

interface Props {
  suppliers: SupplierMaster[];
  incomings: IncomingInspection[];
  correctiveActions: SupplierCorrectiveAction[];
  onAddCorrectiveAction: (action: SupplierCorrectiveAction) => void;
  onSelectSupplierForQuality: (supplier: SupplierMaster) => void;
  onNavigateToPurchases?: () => void;
  onNavigateToIncoming?: (incomingId?: string) => void;
  onToast?: (msg: string) => void;
}

export const CalidadEvaluacionWorkspace: React.FC<Props> = ({
  suppliers,
  incomings,
  correctiveActions,
  onAddCorrectiveAction,
  onSelectSupplierForQuality,
  onNavigateToPurchases,
  onNavigateToIncoming,
  onToast,
}) => {
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<SupplierQualityPeriod>('90d');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Modals
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAcpModalOpen, setIsAcpModalOpen] = useState(false);
  const [acpPreselectedSupplierId, setAcpPreselectedSupplierId] = useState<string | undefined>(undefined);
  const [acpPreselectedIncomingId, setAcpPreselectedIncomingId] = useState<string | undefined>(undefined);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<SupplierQualitySuggestion[]>(INITIAL_SUPPLIER_SUGGESTIONS);

  // Dynamic Scorecard Calculation
  const { scorecards, kpis, paretoRejections, rejectionCauses } = useMemo(() => {
    return calculateSupplierScorecard(suppliers, incomings, correctiveActions, selectedPeriod);
  }, [suppliers, incomings, correctiveActions, selectedPeriod]);

  // Filtered scorecards
  const filteredScorecards = useMemo(() => {
    return scorecards.filter((sc) => {
      const matchQuery =
        sc.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.supplierCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || sc.category === selectedCategory;
      const matchStatus = statusFilter === 'Todos' || sc.status === statusFilter;
      return matchQuery && matchCat && matchStatus;
    });
  }, [scorecards, searchQuery, selectedCategory, statusFilter]);

  // Categories list
  const categories = ['Todas', 'Tintas & Barnices', 'Papel & Cartón', 'Películas & Autoadheribles', 'Empaque & Cartulinas'];

  // Handlers
  const handleOpenNewAcp = (supplierId?: string, incomingId?: string) => {
    setAcpPreselectedSupplierId(supplierId);
    setAcpPreselectedIncomingId(incomingId);
    setIsAcpModalOpen(true);
  };

  const handleSuggestionAction = (sug: SupplierQualitySuggestion, isPrimary: boolean) => {
    const action = isPrimary ? sug.primaryActionType : sug.secondaryActionType;
    const sup = suppliers.find((s) => s.id === sug.supplierId);

    if (action === 'open_acp') {
      handleOpenNewAcp(sug.supplierId, sug.supplierId === 'sup-demo-bopp' ? 'INC-2026-048' : undefined);
    } else if (action === 'view_performance' || action === 'view_docs' || action === 'review_supplier') {
      if (sup) onSelectSupplierForQuality(sup);
    } else if (action === 'view_lots') {
      if (onNavigateToIncoming) onNavigateToIncoming();
      else if (sup) onSelectSupplierForQuality(sup);
    } else if (action === 'view_pos') {
      if (onNavigateToPurchases) onNavigateToPurchases();
      else if (sup) onSelectSupplierForQuality(sup);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Filtros Ejecutivos */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300">
                Scorecard & Homologación de Proveedores
              </span>
              <span className="text-xs text-theme-muted font-mono">Norma ISO 9001 § 8.4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-theme-main tracking-tight">
              Calidad de Proveedores · Evaluación Continua
            </h1>
            <p className="text-xs text-theme-muted">
              Desempeño en andén de recibo, cumplimiento de especificaciones, riesgo de suministro y acciones correctivas (ACP).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsFormulaModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl border border-theme-subtle bg-theme-muted/30 hover:bg-theme-muted text-theme-main text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>¿Cómo se calcula?</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/30 text-theme-main text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-theme-muted" />
              <span>Exportar evaluación</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenNewAcp()}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Acción Correctiva (ACP)</span>
            </button>
          </div>
        </div>

        {/* Toolbar de Filtros: Periodos, Categoría, Estado y Búsqueda */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs">
          {/* Selector de Periodo */}
          <div>
            <label className="text-[11px] font-bold text-theme-muted block mb-1">Periodo de Evaluación:</label>
            <div className="flex rounded-xl bg-theme-muted/40 p-0.5 border border-theme-subtle">
              {(['30d', '60d', '90d', '6m', '12m'] as const).map((per) => (
                <button
                  key={per}
                  type="button"
                  onClick={() => setSelectedPeriod(per)}
                  className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                    selectedPeriod === per
                      ? 'bg-theme-surface text-theme-main shadow-2xs font-black'
                      : 'text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {per === '30d' ? '30 d' : per === '60d' ? '60 d' : per === '90d' ? '90 d' : per === '6m' ? '6 m' : '12 m'}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-[11px] font-bold text-theme-muted block mb-1">Familia / Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Estado de Homologación */}
          <div>
            <label className="text-[11px] font-bold text-theme-muted block mb-1">Estatus del Scorecard:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main focus:ring-2 focus:ring-purple-500"
            >
              <option value="Todos">Todos los estatus</option>
              <option value="Aprobado">Aprobado (≥ 90 pts)</option>
              <option value="Monitoreo">Monitoreo (80 – 89 pts)</option>
              <option value="Condicionado">Condicionado (70 – 79 pts)</option>
              <option value="Bloqueado">Bloqueado (&lt; 70 pts)</option>
            </select>
          </div>

          {/* Buscador de Proveedor */}
          <div>
            <label className="text-[11px] font-bold text-theme-muted block mb-1">Buscar Proveedor / Insumo:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-theme-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre, código o RFC..."
                className="w-full rounded-xl border border-theme-subtle bg-theme-surface pl-8 pr-3 py-1.5 text-xs text-theme-main focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPIs Ejecutivos (6 Cards Limpias y Comparables) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Proveedores Evaluados
          </span>
          <div className="flex items-baseline justify-between">
            <b className="text-xl font-black font-mono text-theme-main">{kpis.evaluatedSuppliersCount}</b>
            <span className="text-[10px] text-emerald-600 font-bold">{kpis.evaluatedSuppliersDiff}</span>
          </div>
          <p className="text-[10px] text-theme-muted">Catálogo activo evaluado</p>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Lotes Inspeccionados
          </span>
          <div className="flex items-baseline justify-between">
            <b className="text-xl font-black font-mono text-theme-main">{kpis.inspectedLotsCount}</b>
            <span className="text-[10px] text-emerald-600 font-bold">{kpis.inspectedLotsDiff}</span>
          </div>
          <p className="text-[10px] text-theme-muted">En andén de recibo</p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Aceptación Incoming
          </span>
          <div className="flex items-baseline justify-between">
            <b className="text-xl font-black font-mono text-emerald-600">{kpis.acceptanceRatePct}%</b>
            <span className="text-[10px] text-emerald-600 font-bold">{kpis.acceptanceRateDiff}</span>
          </div>
          <p className="text-[10px] text-theme-muted">Lotes conformes</p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Lotes Rechazados / HOLD
          </span>
          <div className="flex items-baseline justify-between">
            <b className={`text-xl font-black font-mono ${kpis.rejectedLotsCount > 0 ? 'text-rose-600' : 'text-theme-main'}`}>
              {kpis.rejectedLotsCount}
            </b>
            <span className="text-[10px] text-emerald-600 font-bold">{kpis.rejectedLotsDiff}</span>
          </div>
          <p className="text-[10px] text-theme-muted">En cuarentena física</p>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Entregas a Tiempo (OTD)
          </span>
          <div className="flex items-baseline justify-between">
            <b className="text-xl font-black font-mono text-theme-main">{kpis.onTimeDeliveryPct}%</b>
            <span className="text-[10px] text-emerald-600 font-bold">{kpis.onTimeDeliveryDiff}</span>
          </div>
          <p className="text-[10px] text-theme-muted">Cumplimiento de promesa</p>
        </div>

        {/* KPI 6 */}
        <div className="p-4 rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block truncate">
            Acciones Abiertas (ACP)
          </span>
          <div className="flex items-baseline justify-between">
            <b className={`text-xl font-black font-mono ${kpis.openActionsCount > 0 ? 'text-amber-600' : 'text-theme-main'}`}>
              {kpis.openActionsCount}
            </b>
            <span className="text-[10px] text-rose-600 font-bold">{kpis.criticalActionsCount} críticas</span>
          </div>
          <p className="text-[10px] text-theme-muted">Plan 8D en seguimiento</p>
        </div>
      </div>

      {/* 3. SUGERENCIAS DEL SISTEMA (Morado ERP Nexora · Sección 6 del MD) */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-purple-950 dark:text-purple-100 flex items-center gap-2">
                Sugerencias del Sistema
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                  Inteligencia de Abastecimiento
                </span>
              </h3>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                Reglas automáticas de reincidencia de defectos, riesgos de entrega e integridad documental.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Sugerencias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {suggestions.map((sug) => {
            const isReincidencia = sug.type === 'reincidencia';
            const isDoc = sug.type === 'documento';
            const isEntrega = sug.type === 'entrega';
            const isTop = sug.type === 'sobresaliente';

            return (
              <div
                key={sug.id}
                className="p-4 rounded-2xl bg-theme-surface border border-purple-200/70 dark:border-purple-900/40 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-theme-main text-xs">{sug.supplierName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        isReincidencia
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : isDoc
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : isEntrega
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {sug.badgeText}
                    </span>
                  </div>

                  <p className="text-[11px] text-theme-muted leading-relaxed font-medium">
                    {sug.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30 text-[11px] text-purple-900 dark:text-purple-300 leading-tight">
                    {sug.recommendation}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-theme-subtle">
                  <button
                    type="button"
                    onClick={() => handleSuggestionAction(sug, true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{sug.primaryActionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {sug.secondaryActionLabel && (
                    <button
                      type="button"
                      onClick={() => handleSuggestionAction(sug, false)}
                      className="px-2.5 py-1.5 rounded-xl border border-theme-subtle text-theme-muted hover:text-theme-main hover:bg-theme-muted/30 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      {sug.secondaryActionLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SCORECARD PRINCIPAL — RANKING DE PROVEEDORES (Sección 5 del MD) */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs space-y-4 overflow-hidden">
        <div className="p-5 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-theme-main tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Ranking de Desempeño y Scorecard ({filteredScorecards.length} proveedores)
            </h3>
            <span className="text-[11px] text-theme-muted font-mono hidden sm:inline">
              Fórmula ponderada demo configurable
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-theme-muted">
              Ponderación: <strong className="text-theme-main">40% Calidad · 25% Entrega · 15% Docs · 20% Resp.</strong>
            </span>
          </div>
        </div>

        {/* Tabla Scorecard */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-y border-theme-subtle">
              <tr>
                <th className="p-4 pl-6">Proveedor</th>
                <th className="p-4">Categoría</th>
                <th className="p-4 text-center">Calidad (40%)</th>
                <th className="p-4 text-center">Entrega (25%)</th>
                <th className="p-4 text-center">Docs (15%)</th>
                <th className="p-4 text-center">Resp. (20%)</th>
                <th className="p-4 text-center">Score Total</th>
                <th className="p-4 text-center">Tendencia</th>
                <th className="p-4 text-center">Estatus</th>
                <th className="p-4 pr-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredScorecards.map((sc, idx) => {
                const isApproved = sc.status === 'Aprobado';
                const isMonitoreo = sc.status === 'Monitoreo';
                const isCondicionado = sc.status === 'Condicionado';
                const isBloqueado = sc.status === 'Bloqueado';

                const sup = suppliers.find((s) => s.id === sc.supplierId);

                return (
                  <tr key={sc.supplierId} className="hover:bg-theme-muted/10 transition-colors">
                    {/* Proveedor */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-theme-muted/40 font-mono text-[10px] font-black text-theme-muted flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <b className="text-xs font-bold text-theme-main block hover:text-purple-600 transition-colors cursor-pointer"
                             onClick={() => sup && onSelectSupplierForQuality(sup)}>
                            {sc.supplierName}
                          </b>
                          <span className="text-[10px] text-theme-muted font-mono">{sc.supplierCode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-theme-muted/30 text-theme-muted border border-theme-subtle">
                        {sc.category}
                      </span>
                    </td>

                    {/* Calidad 40% */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <b className={`font-mono text-xs ${sc.qualityScore >= 90 ? 'text-emerald-600' : sc.qualityScore >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {sc.qualityScore}%
                        </b>
                        <span className="text-[9px] text-theme-muted">
                          {sc.rejectedLots > 0 ? `${sc.rejectedLots} rechazos` : '100% conf.'}
                        </span>
                      </div>
                    </td>

                    {/* Entrega 25% */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <b className="font-mono text-xs text-theme-main">{sc.deliveryScore}%</b>
                        <span className="text-[9px] text-theme-muted">OTD</span>
                      </div>
                    </td>

                    {/* Documentos 15% */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <b className="font-mono text-xs text-theme-main">{sc.docsScore}%</b>
                        <span className="text-[9px] text-theme-muted">CoA / ISO</span>
                      </div>
                    </td>

                    {/* Respuesta 20% */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <b className="font-mono text-xs text-theme-main">{sc.responseScore}%</b>
                        <span className="text-[9px] text-theme-muted">
                          {sc.openCorrectiveActions > 0 ? `${sc.openCorrectiveActions} ACP act.` : 'Sin ACP'}
                        </span>
                      </div>
                    </td>

                    {/* Score Total */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-theme-muted/40 border border-theme-subtle">
                        <b className={`font-mono text-sm font-black ${
                          sc.totalScore >= 90
                            ? 'text-emerald-600'
                            : sc.totalScore >= 80
                            ? 'text-blue-600'
                            : sc.totalScore >= 70
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}>
                          {sc.totalScore}
                        </b>
                        <span className="text-[9px] text-theme-muted ml-0.5">/100</span>
                      </div>
                    </td>

                    {/* Tendencia */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-0.5 text-[10px] font-bold font-mono">
                        {sc.trend === 'up' ? (
                          <span className="text-emerald-600 flex items-center">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                            +{sc.trendDiff}
                          </span>
                        ) : sc.trend === 'down' ? (
                          <span className="text-rose-600 flex items-center">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                            {sc.trendDiff}
                          </span>
                        ) : (
                          <span className="text-theme-muted">→ 0.0</span>
                        )}
                      </div>
                    </td>

                    {/* Estatus */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40'
                            : isMonitoreo
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40'
                            : isCondicionado
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40'
                        }`}
                      >
                        ● {sc.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => sup && onSelectSupplierForQuality(sup)}
                          className="px-3 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/30 text-theme-main text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-600" />
                          <span>Ver Calidad</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenNewAcp(sc.supplierId)}
                          className="p-1.5 rounded-xl border border-theme-subtle text-theme-muted hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
                          title="Abrir Acción Correctiva ACP para este proveedor"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ANALÍTICA VISUAL (4 Widgets Fuertes · Sección 7 del MD) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 7.1 Pareto de rechazo por proveedor */}
        <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
            <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              7.1 Pareto de Rechazo por Proveedor
            </h4>
            <span className="text-[10px] text-theme-muted">Metros lineales y piezas afectadas</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {paretoRejections.map((item, i) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-theme-main">{item.name}</span>
                  <span className="font-mono text-theme-muted font-bold">
                    {item.rejectedQty.toLocaleString()} uds ({item.count} lotes HOLD)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-theme-muted/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-rose-600' : 'bg-amber-500'}`}
                    style={{ width: `${i === 0 ? 82 : i === 1 ? 14 : 4}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7.2 Motivos de Rechazo */}
        <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
            <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              7.2 Motivos Técnicos de Rechazo
            </h4>
            <span className="text-[10px] text-theme-muted font-mono">Desviación en laboratorio</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {rejectionCauses.map((c) => (
              <div key={c.cause} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-theme-main">{c.cause}</span>
                  <span className="font-mono font-bold text-theme-muted">{c.percentage}% ({c.count} eventos)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-theme-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7.3 Tendencia de Aceptación */}
        <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
            <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              7.3 Tendencia de Aceptación Incoming (% Lotes Conformes)
            </h4>
            <span className="text-[10px] text-emerald-600 font-bold">Meta corporativa: ≥ 95.0%</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            {[
              { label: 'Sem 33', rate: 93.2 },
              { label: 'Sem 34', rate: 91.5 },
              { label: 'Sem 35', rate: 94.0 },
              { label: 'Sem 36 (Actual)', rate: 96.2 },
            ].map((wk) => (
              <div key={wk.label} className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle space-y-1">
                <span className="text-[10px] text-theme-muted font-mono block">{wk.label}</span>
                <b className={`text-base font-mono font-black ${wk.rate >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {wk.rate}%
                </b>
                <span className="text-[9px] text-theme-muted block">{wk.rate >= 95 ? 'Meta cumplida' : 'Bajo meta'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7.4 Matriz Calidad vs Entrega (Cuadrantes 2x2) */}
        <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
            <h4 className="text-xs font-bold text-theme-main uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              7.4 Matriz de Riesgo: Calidad vs Entrega
            </h4>
            <span className="text-[10px] text-theme-muted font-mono">Segmentación de abastecimiento</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
              <div className="flex items-center justify-between">
                <b className="text-emerald-900 dark:text-emerald-200 text-xs">Cuadrante Líder</b>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">Alta Calidad + Alta OTD</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Bio-Pappel, Sun Chemical México, Fasson Avery Dennison.
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
              <div className="flex items-center justify-between">
                <b className="text-amber-900 dark:text-amber-200 text-xs">Riesgo de Entrega</b>
                <span className="text-[10px] font-mono text-amber-700 font-bold">Buena Calidad + Retrasos</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Copamex (desfase promedio +2.5 días en pedidos carreteros).
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
              <div className="flex items-center justify-between">
                <b className="text-rose-900 dark:text-rose-200 text-xs">Riesgo de Calidad</b>
                <span className="text-[10px] font-mono text-rose-700 font-bold">Puntual + Defectos</span>
              </div>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                Proveedor Demo BOPP (2 rechazos de espesor en 60 días).
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-theme-subtle bg-theme-muted/20 space-y-1">
              <div className="flex items-center justify-between">
                <b className="text-theme-main text-xs">Cuadrante Crítico</b>
                <span className="text-[10px] font-mono text-theme-muted">Bajo en ambas</span>
              </div>
              <p className="text-[11px] text-theme-muted">
                Ningún proveedor activo en cuadrante crítico actual.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ¿CÓMO SE CALCULA EL SCORE? */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Cálculo del Score de Proveedores (Demo Configurable)
              </h3>
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-theme-main leading-relaxed">
              <p className="text-theme-muted">
                El sistema evalúa a los proveedores mediante una fórmula ponderada basada en datos reales de inspección de entrada, órdenes de compra y gestión de no conformidades:
              </p>

              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/30">
                  <div className="flex justify-between font-bold text-purple-950 dark:text-purple-200 mb-0.5">
                    <span>1. Calidad de Lotes</span>
                    <span className="font-mono">Ponderación: 40%</span>
                  </div>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300">
                    Proporción de lotes liberados vs lotes rechazados o puestos en HOLD/Cuarentena durante el periodo.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle">
                  <div className="flex justify-between font-bold mb-0.5">
                    <span>2. Entregas a Tiempo (OTD)</span>
                    <span className="font-mono">Ponderación: 25%</span>
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Cumplimiento de la fecha comprometida en la Orden de Compra vs fecha de recepción física en andén.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle">
                  <div className="flex justify-between font-bold mb-0.5">
                    <span>3. Integridad Documental</span>
                    <span className="font-mono">Ponderación: 15%</span>
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Lotes acompañados de Certificado de Calidad (CoA) válido y certificados de empresa vigentes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle">
                  <div className="flex justify-between font-bold mb-0.5">
                    <span>4. Respuesta & Acciones Correctivas (ACP)</span>
                    <span className="font-mono">Ponderación: 20%</span>
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Tiempo de respuesta y eficacia en el cierre de no conformidades y acciones 8D emitidas.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-theme-subtle flex justify-between text-[11px] text-theme-muted">
                <span>Aprobado: ≥ 90 pts</span>
                <span>Monitoreo: 80–89 pts</span>
                <span>Condicionado: 70–79 pts</span>
                <span>Bloqueado: &lt; 70 pts</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EXPORTAR EVALUACIÓN DEMO (Sección 15 del MD) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4 text-purple-600" />
                Exportar Informe de Evaluación
              </h3>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-900 dark:text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Evaluación de proveedores preparada</span>
              </div>
              <p className="text-xs leading-relaxed">
                Periodo: <b>Últimos {selectedPeriod === '30d' ? '30 días' : selectedPeriod === '60d' ? '60 días' : selectedPeriod === '90d' ? '90 días' : selectedPeriod === '6m' ? '6 meses' : '12 meses'}</b>
                <br />
                Alcance: <b>{filteredScorecards.length} proveedores · {kpis.inspectedLotsCount} lotes inspeccionados</b>
                <br />
                Formato: <b>Excel (.xlsx) / Reporte Ejecutivo PDF · Demo</b>
              </p>
            </div>

            <p className="text-theme-muted text-[11px]">
              El archivo consolidado incluye el desglose de métricas por proveedor, histórico de lotes en andén y acciones correctivas vigentes.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-theme-subtle text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  if (onToast) onToast('✓ Informe de evaluación generado y listo para auditoría ISO 9001.');
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
              >
                Descargar Archivo Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NUEVA ACCIÓN CORRECTIVA (ACP / SCAR) */}
      {isAcpModalOpen && (
        <NuevaAccionCorrectivaModal
          suppliers={suppliers}
          incomings={incomings}
          initialSupplierId={acpPreselectedSupplierId}
          initialIncomingId={acpPreselectedIncomingId}
          onClose={() => setIsAcpModalOpen(false)}
          onSaveAction={(action) => {
            onAddCorrectiveAction(action);
            if (onToast) onToast(`✓ Acción Correctiva ${action.id} emitida para ${action.supplierName}.`);
          }}
        />
      )}
    </div>
  );
};
