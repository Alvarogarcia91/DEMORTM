import React, { useState, useMemo } from 'react';
import {
  Briefcase, Search, Filter, AlertTriangle, ShieldCheck,
  ArrowUpRight, FileText, ChevronRight, RefreshCw, Plus,
  TrendingUp, Calendar, User, DollarSign, Clock, CheckCircle2,
  XCircle, ArrowRight
} from 'lucide-react';
import { CrmOpportunity, CrmStage, CrmLine, formatMxn } from '../../../data/mockCrmData';

interface CrmOpportunitiesProps {
  opportunities: CrmOpportunity[];
  onSelectOpportunity: (opportunity: CrmOpportunity) => void;
  onOpenNewOpportunity?: () => void;
  onUpdateStage: (id: string, stage: CrmStage) => void;
  onStartQuote?: (opp: CrmOpportunity) => void;
  onOpenQuote?: (quoteId: string) => void;
}

export const CrmOpportunities: React.FC<CrmOpportunitiesProps> = ({
  opportunities,
  onSelectOpportunity,
  onOpenNewOpportunity,
  onUpdateStage,
  onStartQuote,
  onOpenQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('Todas Activas');
  const [selectedLine, setSelectedLine] = useState<string>('Todas');
  const [selectedSeller, setSelectedSeller] = useState<string>('Todos');
  const [selectedRisk, setSelectedRisk] = useState<string>('Todos');

  // Filter logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((op) => {
      const matchSearch =
        op.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.quoteFolio && op.quoteFolio.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchStage = true;
      if (selectedStage === 'Todas Activas') {
        matchStage = op.stage !== 'Ganada' && op.stage !== 'Perdida';
      } else if (selectedStage !== 'Todas') {
        matchStage = op.stage === selectedStage;
      }

      const matchLine = selectedLine === 'Todas' || op.line === selectedLine;
      const matchSeller = selectedSeller === 'Todos' || op.seller === selectedSeller;
      const matchRisk = selectedRisk === 'Todos' || op.risk === selectedRisk;

      return matchSearch && matchStage && matchLine && matchSeller && matchRisk;
    });
  }, [opportunities, searchTerm, selectedStage, selectedLine, selectedSeller, selectedRisk]);

  // Sellers
  const sellers = useMemo(() => {
    return Array.from(new Set(opportunities.map((o) => o.seller))).filter(Boolean);
  }, [opportunities]);

  // Summary Metrics
  const summary = useMemo(() => {
    const active = opportunities.filter((o) => o.stage !== 'Ganada' && o.stage !== 'Perdida');
    const pipelineTotal = active.reduce((acc, o) => acc + o.amount, 0);
    const weightedTotal = active.reduce((acc, o) => acc + (o.amount * o.probability) / 100, 0);
    const atRisk = active.filter((o) => o.risk === 'Alto' || o.risk === 'Crítico');
    const atRiskTotal = atRisk.reduce((acc, o) => acc + o.amount, 0);

    return {
      activeCount: active.length,
      pipelineTotal,
      weightedTotal,
      atRiskCount: atRisk.length,
      atRiskTotal,
      totalCount: opportunities.length,
    };
  }, [opportunities]);

  const getStageBadge = (stage: CrmStage) => {
    switch (stage) {
      case 'Calificado':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Levantamiento':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Cotización':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Negociación':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Ganada':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Perdida':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskBadge = (risk: CrmOpportunity['risk']) => {
    switch (risk) {
      case 'Bajo':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200';
      case 'Medio':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200';
      case 'Alto':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200';
      case 'Crítico':
        return 'bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-medium mb-1">
            <span>Pipeline Activo</span>
            <span className="font-bold text-theme-primary">{summary.activeCount} opps</span>
          </div>
          <div className="text-xl font-bold text-theme-primary font-mono">{formatMxn(summary.pipelineTotal)}</div>
          <span className="text-[11px] text-theme-muted mt-1 block">Monto total en negociación activa</span>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-medium mb-1">
            <span>Ponderado por Prob.</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">Expectativa</span>
          </div>
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300 font-mono">
            {formatMxn(summary.weightedTotal)}
          </div>
          <span className="text-[11px] text-theme-muted mt-1 block">Forecast esperado según avance</span>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-medium mb-1">
            <span>En Riesgo Alto/Crítico</span>
            <span className="text-rose-600 font-bold">{summary.atRiskCount} opps</span>
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
            {formatMxn(summary.atRiskTotal)}
          </div>
          <span className="text-[11px] text-rose-500 font-mono mt-1 block">
            {summary.pipelineTotal > 0 ? Math.round((summary.atRiskTotal / summary.pipelineTotal) * 100) : 0}% del pipeline en riesgo
          </span>
        </div>

        <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted font-medium mb-1">
            <span>Total Oportunidades</span>
            <span className="text-emerald-600 font-bold">Histórico</span>
          </div>
          <div className="text-xl font-bold text-theme-primary font-mono">{summary.totalCount}</div>
          <span className="text-[11px] text-theme-muted mt-1 block">Incluye ganadas y perdidas</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
            <input
              type="text"
              placeholder="Buscar por cuenta, proyecto, folio o cotización..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-theme-base border border-theme-subtle rounded-lg text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStage('Todas Activas');
                setSelectedLine('Todas');
                setSelectedSeller('Todos');
                setSelectedRisk('Todos');
              }}
              className="p-2 text-theme-muted hover:text-theme-primary hover:bg-theme-base rounded-lg border border-theme-subtle transition-colors text-xs flex items-center gap-1.5"
              title="Restablecer filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-theme-subtle text-xs">
          {/* Stage filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="text-theme-muted font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Etapa:
            </span>
            {['Todas Activas', 'Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada', 'Perdida', 'Todas'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedStage === st
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-theme-base text-theme-muted hover:text-theme-primary hover:bg-theme-muted/10 border border-theme-subtle'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>

          <div className="h-4 w-px bg-theme-subtle mx-1 hidden lg:block" />

          {/* Line Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Línea:</span>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todas">Todas las líneas</option>
              <option value="Maquinado CNC">Maquinado CNC</option>
              <option value="Fabricación y Soldadura">Fabricación y Soldadura</option>
              <option value="Automatización">Automatización</option>
              <option value="Pintura y Recubrimientos">Pintura y Recubrimientos</option>
              <option value="Ensamble e Integración">Ensamble e Integración</option>
            </select>
          </div>

          {/* Seller Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Vendedor:</span>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todos">Todos</option>
              {sellers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted font-medium">Riesgo:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2 py-1 bg-theme-base border border-theme-subtle rounded-md text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Todos">Todos</option>
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
              <option value="Crítico">Crítico</option>
            </select>
          </div>

          <span className="ml-auto text-xs text-theme-muted font-mono">
            {filteredOpportunities.length} oportunidades
          </span>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-theme-card border border-theme-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-theme-base/60 border-b border-theme-subtle text-theme-muted font-semibold">
                <th className="py-3 px-4">Proyecto / Folio</th>
                <th className="py-3 px-3">Cuenta</th>
                <th className="py-3 px-3">Línea</th>
                <th className="py-3 px-3">Etapa</th>
                <th className="py-3 px-3 text-right">Monto</th>
                <th className="py-3 px-3 text-center">Prob. / Ponderado</th>
                <th className="py-3 px-3">Riesgo</th>
                <th className="py-3 px-3">Cotización</th>
                <th className="py-3 px-3">Vendedor</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-theme-muted">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-sm">No se encontraron oportunidades con los filtros activos</p>
                    <p className="text-xs text-theme-muted mt-1">Prueba cambiando los filtros de etapa o búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opp) => (
                  <tr
                    key={opp.id}
                    className="hover:bg-theme-base/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectOpportunity(opp)}
                  >
                    {/* Proyecto & Folio */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-theme-primary group-hover:text-purple-600 transition-colors">
                            {opp.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-theme-muted font-mono">{opp.folio}</span>
                          <span className="text-[10px] text-theme-muted">· {opp.daysInStage}d en etapa</span>
                        </div>
                      </div>
                    </td>

                    {/* Cuenta */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-theme-primary">{opp.account}</span>
                      <span className="block text-[10px] text-theme-muted">{opp.contactName}</span>
                    </td>

                    {/* Línea */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-theme-base border border-theme-subtle text-theme-primary">
                        {opp.line}
                      </span>
                    </td>

                    {/* Etapa */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStageBadge(opp.stage)}`}>
                        {opp.stage}
                      </span>
                    </td>

                    {/* Monto */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono text-xs text-theme-primary">
                        {formatMxn(opp.amount)}
                      </span>
                      <span className="block text-[10px] text-theme-muted font-mono">{opp.currency}</span>
                    </td>

                    {/* Prob / Ponderado */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-xs text-purple-700 dark:text-purple-300">
                        {opp.probability}%
                      </span>
                      <span className="block text-[10px] text-theme-muted font-mono">
                        {formatMxn((opp.amount * opp.probability) / 100)}
                      </span>
                    </td>

                    {/* Riesgo */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getRiskBadge(opp.risk)}`}>
                        {opp.risk === 'Alto' || opp.risk === 'Crítico' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : null}
                        {opp.risk}
                      </span>
                    </td>

                    {/* Cotización */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      {opp.quoteFolio ? (
                        <button
                          onClick={() => onOpenQuote && opp.quoteId && onOpenQuote(opp.quoteId)}
                          className="inline-flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-700 hover:underline font-mono"
                          title="Abrir cotización vinculada"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{opp.quoteFolio}</span>
                        </button>
                      ) : (
                        opp.stage !== 'Ganada' && opp.stage !== 'Perdida' && onStartQuote && (
                          <button
                            onClick={() => onStartQuote(opp)}
                            className="text-[10px] text-theme-muted hover:text-purple-600 border border-dashed border-theme-subtle hover:border-purple-300 px-1.5 py-0.5 rounded transition-colors"
                          >
                            + Cotizar
                          </button>
                        )
                      )}
                    </td>

                    {/* Vendedor */}
                    <td className="py-3 px-3">
                      <span className="text-theme-primary font-medium">{opp.seller}</span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectOpportunity(opp)}
                        className="p-1.5 text-theme-muted hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg transition-colors inline-flex items-center gap-1 font-medium text-xs"
                      >
                        <span>Detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
