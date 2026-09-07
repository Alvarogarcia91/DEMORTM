import React, { useState, useMemo } from 'react';
import {
  TrendingUp, BarChart3, PieChart, Calendar, FileSpreadsheet,
  Download, Sparkles, DollarSign, ArrowUpRight, CheckCircle2,
  AlertTriangle, ChevronRight, Layers, Users, Clock,
  Briefcase, Percent, RefreshCw, Filter, Target, ArrowRight,
  ShieldAlert, XCircle, Award
} from 'lucide-react';
import {
  CrmOpportunity, CrmProspect, CrmActivity, CrmPeriod,
  filterOpportunities, calculateCrmKpis, getTopAccountsByPipeline,
  getSellerPerformanceData, getPipelineByLineData, getSmartSuggestions,
  formatMxn
} from '../../../data/mockCrmData';

interface CrmAnalyticsProps {
  opportunities: CrmOpportunity[];
  prospects: CrmProspect[];
  activities: CrmActivity[];
  onSelectOpportunity?: (opportunity: CrmOpportunity) => void;
  onNavigateTab?: (tab: string) => void;
  onShowToast?: (msg: string) => void;
}

export const CrmAnalytics: React.FC<CrmAnalyticsProps> = ({
  opportunities,
  prospects,
  activities,
  onSelectOpportunity,
  onNavigateTab,
  onShowToast,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<CrmPeriod>('30d');
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [selectedLine, setSelectedLine] = useState('Todas');
  const [exportSuccessMessage, setExportSuccessMessage] = useState<{ filename: string; subtitle: string } | null>(null);

  // Filtered dataset according to period, seller, line
  const filteredOpps = useMemo(() => {
    return filterOpportunities(opportunities, selectedPeriod, selectedSeller, selectedLine);
  }, [opportunities, selectedPeriod, selectedSeller, selectedLine]);

  // Derived KPIs
  const kpis = useMemo(() => {
    return calculateCrmKpis(filteredOpps, selectedPeriod);
  }, [filteredOpps, selectedPeriod]);

  // Top accounts Pareto
  const topAccounts = useMemo(() => {
    return getTopAccountsByPipeline(filteredOpps, 6);
  }, [filteredOpps]);

  // Seller performance
  const sellerPerformance = useMemo(() => {
    return getSellerPerformanceData(filteredOpps);
  }, [filteredOpps]);

  // Pipeline by manufacturing line
  const pipelineByLine = useMemo(() => {
    return getPipelineByLineData(filteredOpps);
  }, [filteredOpps]);

  // Smart suggestions
  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions(opportunities, kpis);
  }, [opportunities, kpis]);

  // Aging breakdown
  const agingData = useMemo(() => {
    const active = filteredOpps.filter((o) => o.stage !== 'Ganada' && o.stage !== 'Perdida');
    const b1 = active.filter((o) => (o.daysInStage ?? o.days ?? 0) <= 15);
    const b2 = active.filter((o) => (o.daysInStage ?? o.days ?? 0) > 15 && (o.daysInStage ?? o.days ?? 0) <= 30);
    const b3 = active.filter((o) => (o.daysInStage ?? o.days ?? 0) > 30 && (o.daysInStage ?? o.days ?? 0) <= 60);
    const b4 = active.filter((o) => (o.daysInStage ?? o.days ?? 0) > 60);

    return [
      { label: '< 15 días (Recientes)', count: b1.length, amount: b1.reduce((s, o) => s + o.amount, 0), color: 'bg-emerald-500' },
      { label: '16 - 30 días (Normal)', count: b2.length, amount: b2.reduce((s, o) => s + o.amount, 0), color: 'bg-blue-500' },
      { label: '31 - 60 días (Atención)', count: b3.length, amount: b3.reduce((s, o) => s + o.amount, 0), color: 'bg-amber-500' },
      { label: '> 60 días (Estancado)', count: b4.length, amount: b4.reduce((s, o) => s + o.amount, 0), color: 'bg-rose-500' },
    ];
  }, [filteredOpps]);

  // Loss reasons breakdown
  const lossReasonsData = useMemo(() => {
    const lost = filteredOpps.filter((o) => o.stage === 'Perdida');
    const reasonsMap: Record<string, { count: number; amount: number }> = {};

    lost.forEach((o) => {
      const reason = o.lostReason || o.lossReason || 'Otro motivo / No especificado';
      if (!reasonsMap[reason]) {
        reasonsMap[reason] = { count: 0, amount: 0 };
      }
      reasonsMap[reason].count += 1;
      reasonsMap[reason].amount += o.amount;
    });

    const totalLost = lost.reduce((s, o) => s + o.amount, 0);

    return Object.entries(reasonsMap)
      .map(([reason, data]) => ({
        reason,
        count: data.count,
        amount: data.amount,
        percent: totalLost > 0 ? Math.round((data.amount / totalLost) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredOpps]);

  // Time in stage
  const stageTimeData = useMemo(() => {
    const stages = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación'];
    return stages.map((st) => {
      const inSt = filteredOpps.filter((o) => o.stage === st);
      const avgDays = inSt.length > 0 ? Math.round(inSt.reduce((s, o) => s + (o.daysInStage ?? o.days ?? 0), 0) / inSt.length) : 0;
      return { stage: st, avgDays, count: inSt.length };
    });
  }, [filteredOpps]);

  // Lead sources
  const leadSourceData = useMemo(() => {
    const map: Record<string, number> = {};
    prospects.forEach((p) => {
      const src = p.source || 'Directo';
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).map(([source, count]) => ({
      source,
      count,
      percent: prospects.length > 0 ? Math.round((count / prospects.length) * 100) : 0,
    }));
  }, [prospects]);

  // Handlers
  const handlePeriodChange = (p: CrmPeriod) => {
    setSelectedPeriod(p);
    if (onShowToast) {
      onShowToast(`Analítica recalculada para el período: últimos ${p}`);
    }
  };

  const handleExportExcel = () => {
    const filename = `crm_analitica_comercial_${selectedPeriod}_2026-09-07.xlsx`;
    const subtitle = `Reporte Ejecutivo Comercial · Período ${selectedPeriod} · Vendedor: ${selectedSeller}`;
    setExportSuccessMessage({ filename, subtitle });
    if (onShowToast) {
      onShowToast(`Reporte analítico exportado con éxito: ${filename}`);
    }
    setTimeout(() => {
      setExportSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full pb-12">
      {/* 1. Header & Controls Bar */}
      <div className="bg-theme-card p-5 border border-theme-subtle rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Inteligencia Comercial &middot; Nexora CRM v2
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-2xs">
              Analítica Enterprise
            </span>
          </div>
          <h1 className="text-xl font-bold text-theme-primary tracking-tight">
            Tablero de Inteligencia & Desempeño Comercial
          </h1>
          <p className="text-xs text-theme-muted">
            Conversión de embudo, velocidad de ventas, análisis causal de pérdidas y rendimiento por línea RTM.
          </p>
        </div>

        {/* Period & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-theme-base p-1 rounded-xl border border-theme-subtle text-xs">
            {(['7d', '30d', '60d', '90d', '6m', '12m'] as CrmPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Line filter */}
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-xl text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todas">Todas las líneas</option>
            <option value="Maquinado CNC">Maquinado CNC</option>
            <option value="Fabricación y Soldadura">Fabricación y Soldadura</option>
            <option value="Automatización">Automatización</option>
            <option value="Pintura y Recubrimientos">Pintura y Recubrimientos</option>
            <option value="Ensamble e Integración">Ensamble e Integración</option>
          </select>

          {/* Seller filter */}
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="px-2.5 py-1.5 bg-theme-base border border-theme-subtle rounded-xl text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Todos">Todos los vendedores</option>
            <option value="Carlos Morales">Carlos Morales</option>
            <option value="Lucía Peña">Lucía Peña</option>
            <option value="Mariana Garza">Mariana Garza</option>
            <option value="Roberto Sánchez">Roberto Sánchez</option>
          </select>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-1.5 bg-theme-base hover:bg-theme-card border border-theme-subtle rounded-xl text-xs font-semibold text-theme-primary flex items-center gap-1.5 shadow-2xs hover:border-purple-300 transition-colors"
            title="Exportar analítica a Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Export Success Banner */}
      {exportSuccessMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Archivo listo para descargar: <span className="font-mono">{exportSuccessMessage.filename}</span>
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                {exportSuccessMessage.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExportSuccessMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 p-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top Analytical KPIs (7 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Pipeline Activo */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-theme-muted font-medium block">Pipeline Activo</span>
          <span className="text-base font-bold font-mono text-theme-primary block mt-1">
            {formatMxn(kpis.pipelineValue)}
          </span>
          <span className="text-[10px] text-theme-muted mt-0.5 block">{kpis.activeCount} oportunidades</span>
        </div>

        {/* Ponderado */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium block">Ponderado Prob.</span>
          <span className="text-base font-bold font-mono text-purple-700 dark:text-purple-300 block mt-1">
            {formatMxn(kpis.weightedValue)}
          </span>
          <span className="text-[10px] text-purple-600 font-mono mt-0.5 block">Expectativa neta</span>
        </div>

        {/* Ventas Ganadas */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">Ventas Ganadas</span>
          <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
            {formatMxn(kpis.wonValue)}
          </span>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">{kpis.wonCount} cerradas</span>
        </div>

        {/* Win Rate */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-theme-muted font-medium block">Win Rate</span>
          <span className="text-base font-bold font-mono text-theme-primary block mt-1">
            {kpis.winRate}%
          </span>
          <span className="text-[10px] text-theme-muted mt-0.5 block">Bateo global</span>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-theme-muted font-medium block">Ticket Promedio</span>
          <span className="text-base font-bold font-mono text-theme-primary block mt-1">
            {formatMxn(kpis.averageDealSize)}
          </span>
          <span className="text-[10px] text-theme-muted mt-0.5 block">Por opp ganada</span>
        </div>

        {/* Ciclo de Venta */}
        <div className="bg-theme-card border border-theme-subtle rounded-xl p-3.5 shadow-sm">
          <span className="text-[11px] text-theme-muted font-medium block">Ciclo Promedio</span>
          <span className="text-base font-bold font-mono text-theme-primary block mt-1">
            {kpis.salesCycleDays} días
          </span>
          <span className="text-[10px] text-theme-muted mt-0.5 block">Lead a cierre</span>
        </div>

        {/* En Riesgo */}
        <div className="bg-theme-card border border-rose-200 dark:border-rose-900/40 rounded-xl p-3.5 shadow-sm bg-rose-50/20 dark:bg-rose-950/10">
          <span className="text-[11px] text-rose-600 font-medium block">En Riesgo</span>
          <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400 block mt-1">
            {formatMxn(kpis.atRiskValue)}
          </span>
          <span className="text-[10px] text-rose-500 mt-0.5 block">{kpis.atRiskCount} opps estancadas</span>
        </div>
      </div>

      {/* 3. Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Envejecimiento / Aging del Pipeline */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-theme-primary">Matriz de Envejecimiento (Aging de Oportunidades)</h3>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Días en etapa actual</span>
          </div>

          <div className="space-y-3 pt-2">
            {agingData.map((item, idx) => {
              const maxAmount = Math.max(...agingData.map((x) => x.amount), 1);
              const barWidth = Math.max(8, Math.round((item.amount / maxAmount) * 100));

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-theme-primary">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-theme-muted font-mono">{item.count} opps</span>
                      <span className="font-bold font-mono text-theme-primary">{formatMxn(item.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-theme-base rounded-full overflow-hidden border border-theme-subtle">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-theme-muted pt-2 border-t border-theme-subtle">
            Las oportunidades con más de 60 días representan capital detenido y requieren intervención o replanteamiento de alcance.
          </p>
        </div>

        {/* Chart 2: Análisis Causal de Pérdidas */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-theme-primary">Análisis Causal de Pérdidas (Win/Loss Reasons)</h3>
            </div>
            <span className="text-[10px] text-rose-600 font-bold font-mono">
              Total: {formatMxn(lossReasonsData.reduce((s, x) => s + x.amount, 0))}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {lossReasonsData.length === 0 ? (
              <p className="text-xs text-theme-muted py-6 text-center">No hay registros de pérdidas en este período.</p>
            ) : (
              lossReasonsData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="font-semibold text-theme-primary">{item.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-theme-muted">({item.count})</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{item.percent}%</span>
                      <span className="font-bold text-theme-primary">{formatMxn(item.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-theme-base rounded-full overflow-hidden border border-theme-subtle">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="text-[11px] text-theme-muted pt-2 border-t border-theme-subtle">
            Principal causa de pérdida: <b className="text-theme-primary">{lossReasonsData[0]?.reason || 'N/A'}</b> ({lossReasonsData[0]?.percent || 0}% del volumen).
          </p>
        </div>

        {/* Chart 3: Permanencia Promedio por Etapa */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-theme-primary">Tiempo Promedio de Permanencia por Etapa</h3>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Días promedio</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {stageTimeData.map((st, idx) => (
              <div key={idx} className="p-3 bg-theme-base rounded-xl border border-theme-subtle text-center">
                <span className="text-[11px] text-theme-muted block">{st.stage}</span>
                <span className="text-xl font-bold font-mono text-theme-primary block mt-1">
                  {st.avgDays} <span className="text-xs font-normal">días</span>
                </span>
                <span className="text-[10px] text-purple-600 block mt-0.5">{st.count} activas</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300">
            <p className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Hallazgo de Cuello de Botella:
            </p>
            <p className="text-[11px] mt-0.5 text-theme-muted">
              La etapa de <b>Cotización</b> concentra el mayor tiempo promedio de espera ({stageTimeData.find(s => s.stage === 'Cotización')?.avgDays || 12} días). La integración directa con Ingeniería agilizaría 3.5 días.
            </p>
          </div>
        </div>

        {/* Chart 4: Origen de Prospectos y Rendimiento por Canal */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-theme-primary">Origen de Prospectos & Canales de Adquisición</h3>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">{prospects.length} leads totales</span>
          </div>

          <div className="space-y-3 pt-2">
            {leadSourceData.map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-theme-primary">{src.source}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-theme-muted">{src.count} leads</span>
                    <span className="font-bold text-purple-600">{src.percent}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-theme-base rounded-full overflow-hidden border border-theme-subtle">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.max(5, src.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-theme-muted pt-2 border-t border-theme-subtle">
            Los <b>Referidos</b> tienen la tasa de conversión más alta a proyecto formal (72% vs 38% en prospección fría).
          </p>
        </div>
      </div>

      {/* 4. Deep Performance Tables: Pareto Accounts & Seller League */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Accounts Pareto */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-theme-primary">Pareto de Clientes (Top Cuentas por Pipeline)</h3>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">80/20 Comercial</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-theme-subtle text-theme-muted">
                  <th className="py-2 px-2 font-semibold">Cliente / Cuenta</th>
                  <th className="py-2 px-2 font-semibold text-center">Opps</th>
                  <th className="py-2 px-2 font-semibold text-right">Pipeline</th>
                  <th className="py-2 px-2 font-semibold text-right">% Mix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {topAccounts.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-theme-base/50">
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-theme-primary truncate max-w-[170px]">{acc.account}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-theme-muted font-mono">{acc.oppCount}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-theme-primary">{formatMxn(acc.amount)}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-purple-600 font-bold">{acc.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seller Performance League */}
        <div className="bg-theme-card border border-theme-subtle rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-theme-primary">Rendimiento por Vendedor (Cuota vs Real)</h3>
            </div>
            <span className="text-[10px] text-theme-muted font-mono">Equipo Comercial</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-theme-subtle text-theme-muted">
                  <th className="py-2 px-2 font-semibold">Vendedor</th>
                  <th className="py-2 px-2 font-semibold text-right">Pipeline</th>
                  <th className="py-2 px-2 font-semibold text-right">Ganadas</th>
                  <th className="py-2 px-2 font-semibold text-center">Win Rate</th>
                  <th className="py-2 px-2 font-semibold text-right">Cumpl.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {sellerPerformance.map((s, idx) => (
                  <tr key={idx} className="hover:bg-theme-base/50">
                    <td className="py-2.5 px-2">
                      <span className="font-semibold text-theme-primary">{s.seller}</span>
                      <span className="block text-[10px] text-theme-muted">{s.activeOpps} activas</span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-theme-primary">{formatMxn(s.pipeline)}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600">{formatMxn(s.wonAmount)}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-theme-primary">{s.winRate}%</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-purple-600">{s.quotaAttainment}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Purple SMART System Suggestions (Bottom Section matching Requisiciones) */}
      <div className="bg-gradient-to-br from-purple-900/10 via-purple-600/5 to-indigo-900/10 border border-purple-500/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                Sugerencias del Sistema Comercial SMART
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                  Accionables
                </span>
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                Recomendaciones automáticas basadas en probabilidades, envejecimiento de cotizaciones y margen proyectado.
              </p>
            </div>
          </div>
          <span className="text-xs text-purple-700 dark:text-purple-300 font-mono font-semibold">
            {smartSuggestions.length} alertas identificadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {smartSuggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-theme-card border border-purple-200 dark:border-purple-900/50 rounded-xl p-4 shadow-xs space-y-3 hover:border-purple-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-theme-primary">{sug.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  sug.impact === 'Alto'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  Impacto {sug.impact}
                </span>
              </div>

              <p className="text-xs text-theme-muted leading-relaxed">{sug.description}</p>

              <div className="p-2.5 bg-purple-50/50 dark:bg-purple-950/30 rounded-lg border border-purple-200/60 dark:border-purple-900/30 text-[11px] text-purple-900 dark:text-purple-200">
                <span className="font-semibold block mb-0.5">¿Por qué aparece esta sugerencia?</span>
                <span className="text-purple-800/90 dark:text-purple-300/90">{sug.reason}</span>
              </div>

              <div className="pt-2 border-t border-theme-subtle flex items-center justify-between">
                <span className="text-[10px] font-mono text-theme-muted">{sug.account}</span>
                <button
                  onClick={() => {
                    if (sug.opportunityId && onSelectOpportunity) {
                      const found = opportunities.find((o) => o.id === sug.opportunityId);
                      if (found) {
                        onSelectOpportunity(found);
                        return;
                      }
                    }
                    if (onNavigateTab) {
                      onNavigateTab('opportunities');
                    }
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>{sug.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
