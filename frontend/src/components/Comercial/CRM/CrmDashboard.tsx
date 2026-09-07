import React, { useState, useMemo } from 'react';
import {
  CircleDollarSign,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileSpreadsheet,
  Building2,
  Users,
  Layers,
  Calendar,
  X,
} from 'lucide-react';
import {
  CrmOpportunity,
  CrmActivity,
  CrmPeriod,
  CrmTab,
  formatMxn,
  calculateCrmKpis,
  getTopAccountsByPipeline,
  getSellerPerformanceData,
  getPipelineByLineData,
  getSmartSuggestions,
  getOpportunityHealth,
} from '../../../data/mockCrmData';
import { OpportunityFunnel, ForecastChart, PipelineStageChart } from './CrmCharts';

interface CrmDashboardProps {
  opportunities: CrmOpportunity[];
  activities: CrmActivity[];
  onOpenOpportunity: (opp: CrmOpportunity) => void;
  onNavigateTab: (tab: CrmTab) => void;
  onNotice: (msg: string) => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  opportunities,
  activities,
  onOpenOpportunity,
  onNavigateTab,
  onNotice,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<CrmPeriod>('30 días');
  const [selectedSeller, setSelectedSeller] = useState('Todos');
  const [selectedLine, setSelectedLine] = useState('Todas');
  const [comparePrevious, setComparePrevious] = useState(true);
  const [exportBanner, setExportBanner] = useState<{ filename: string } | null>(null);

  // Filtered opportunities according to controls
  const filteredOpps = useMemo(() => {
    return opportunities.filter((o) => {
      if (selectedSeller !== 'Todos' && o.seller !== selectedSeller) return false;
      if (selectedLine !== 'Todas' && o.line !== selectedLine) return false;
      return true;
    });
  }, [opportunities, selectedSeller, selectedLine]);

  // Derived KPIs
  const kpis = useMemo(() => {
    return calculateCrmKpis(filteredOpps, activities, selectedPeriod);
  }, [filteredOpps, activities, selectedPeriod]);

  // Dynamic Top Accounts and Sellers
  const topAccounts = useMemo(() => getTopAccountsByPipeline(filteredOpps), [filteredOpps]);
  const sellerPerformance = useMemo(() => getSellerPerformanceData(filteredOpps, activities), [filteredOpps, activities]);
  const lineDistribution = useMemo(() => getPipelineByLineData(filteredOpps), [filteredOpps]);
  const smartSuggestions = useMemo(() => getSmartSuggestions(filteredOpps, activities), [filteredOpps, activities]);

  // Critical items requiring attention
  const attentionItems = useMemo(() => {
    return filteredOpps
      .filter((o) => (o.risk === 'Crítico' || o.risk === 'Alto' || o.days >= 8) && !['Ganada', 'Perdida'].includes(o.stage))
      .slice(0, 4);
  }, [filteredOpps]);

  const handleExport = () => {
    const filename = `crm_pipeline_${selectedSeller.replace(/\s+/g, '_')}_${selectedPeriod.replace(/\s+/g, '_')}_2026-09-07.xlsx`;
    setExportBanner({ filename });
    onNotice(`✓ Exportación comercial preparada: ${filename}`);
    setTimeout(() => setExportBanner(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Card with Filters */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Pipeline Comercial &middot; Ventas Industriales RTM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-400/40 shadow-2xs">
              Dashboard Enterprise
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2">
            <CircleDollarSign className="w-6 h-6 text-theme-primary" />
            <span>Centro de Control Comercial</span>
          </h2>
          <p className="text-xs text-theme-muted">
            Monitoreo en tiempo real de cuentas vivas, forecast ponderado, alertas de riesgo y sugerencias SMART.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2.5 flex-wrap justify-start xl:justify-end text-xs">
          {/* Period */}
          <div className="flex items-center gap-1 bg-theme-muted/50 border border-theme-subtle rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-theme-muted" />
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value as CrmPeriod);
                onNotice(`Periodo comercial: ${e.target.value}`);
              }}
              className="bg-transparent border-none text-xs font-bold text-theme-main focus:outline-none cursor-pointer pr-1"
            >
              <option value="Hoy">Hoy</option>
              <option value="7 días">Últimos 7 días</option>
              <option value="30 días">Últimos 30 días</option>
              <option value="60 días">Últimos 60 días</option>
              <option value="90 días">Últimos 90 días</option>
              <option value="6 meses">Últimos 6 meses</option>
              <option value="12 meses">Últimos 12 meses</option>
            </select>
          </div>

          {/* Seller */}
          <select
            value={selectedSeller}
            onChange={(e) => {
              setSelectedSeller(e.target.value);
              onNotice(`Filtrando por ejecutivo: ${e.target.value}`);
            }}
            className="bg-theme-muted/50 border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="Todos">Todos los ejecutivos</option>
            <option value="Lucía Torres">Lucía Torres</option>
            <option value="Marco Salinas">Marco Salinas</option>
            <option value="Andrea Peña">Andrea Peña</option>
          </select>

          {/* Line */}
          <select
            value={selectedLine}
            onChange={(e) => {
              setSelectedLine(e.target.value);
              onNotice(`Línea: ${e.target.value}`);
            }}
            className="bg-theme-muted/50 border border-theme-subtle text-xs font-bold text-theme-main py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="Todas">Todas las líneas</option>
            <option value="Offset">Offset</option>
            <option value="Flexografía">Flexografía</option>
            <option value="Serigrafía">Serigrafía</option>
            <option value="Acabados / conversión">Acabados / Conversión</option>
          </select>

          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => setComparePrevious(!comparePrevious)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              comparePrevious
                ? 'bg-theme-primary/10 border-theme-primary text-theme-primary'
                : 'bg-theme-surface border-theme-subtle text-theme-muted hover:text-theme-main'
            }`}
          >
            Comparar vs anterior
          </button>

          {/* Export button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Export feedback banner */}
      {exportBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>✓ Reporte descargado correctamente: <strong className="font-mono">{exportBanner.filename}</strong></span>
          <button type="button" onClick={() => setExportBanner(null)} className="font-bold hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* 2. 6 KPIs Ejecutivos Principales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Pipeline Abierto */}
        <div
          onClick={() => onNavigateTab('opportunities')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-theme-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">Pipeline Abierto</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block mt-1">
              {formatMxn(kpis.openPipeline)}
            </strong>
          </div>
          {comparePrevious ? (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{kpis.openPipelineDelta}% vs periodo ant.</span>
            </span>
          ) : (
            <span className="text-[10px] text-theme-muted">Oportunidades activas</span>
          )}
        </div>

        {/* Pipeline Ponderado */}
        <div
          onClick={() => onNavigateTab('pipeline')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-theme-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">Ponderado</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-blue-600 block mt-1">
              {formatMxn(kpis.weightedPipeline)}
            </strong>
          </div>
          {comparePrevious ? (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{kpis.weightedPipelineDelta}% ajustado</span>
            </span>
          ) : (
            <span className="text-[10px] text-theme-muted">Probabilidad ajustada</span>
          )}
        </div>

        {/* Forecast del Periodo */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-theme-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">Forecast Cierre</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-purple-600 block mt-1">
              {formatMxn(kpis.forecastAmount)}
            </strong>
          </div>
          <span className="text-[10px] text-theme-muted font-medium">Ponderado + Ganado</span>
        </div>

        {/* Ganado */}
        <div
          onClick={() => onNavigateTab('opportunities')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-theme-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">Cerrado Ganado</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block mt-1">
              {formatMxn(kpis.wonAmount)}
            </strong>
          </div>
          {comparePrevious ? (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{kpis.wonAmountDelta}% de meta</span>
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600 font-semibold">100% de conversión</span>
          )}
        </div>

        {/* Win Rate */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-theme-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">Win Rate</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block mt-1">
              {kpis.winRate}%
            </strong>
          </div>
          <span className="text-[10px] text-theme-muted font-medium">Ganadas / Cerradas</span>
        </div>

        {/* Oportunidades en Riesgo */}
        <div
          onClick={() => onNavigateTab('today')}
          className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 cursor-pointer hover:border-rose-400 transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-theme-muted tracking-wider block">En Riesgo</span>
            <strong className="text-xl sm:text-2xl font-mono font-black text-rose-600 block mt-1">
              {kpis.riskCount} OPs
            </strong>
          </div>
          <span className="text-[10px] text-rose-600 font-bold">
            {formatMxn(kpis.riskAmount)} en juego
          </span>
        </div>
      </div>

      {/* 3. SUGERENCIAS DEL SISTEMA — PROTAGONISTA MORADO */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-purple-500/35 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-subtle pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/25 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-theme-main tracking-wider uppercase flex items-center gap-2">
                <span>Sugerencias del sistema</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-400/40">
                  ● SMART COMMERCIAL
                </span>
              </h3>
              <p className="text-[11px] text-theme-muted">
                Detección inteligente de riesgos de cierre, cotizaciones estancadas y ventas cruzadas.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-300/40 w-fit">
            {smartSuggestions.length} alertas estratégicas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {smartSuggestions.slice(0, 3).map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-2xl bg-theme-surface border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  {sug.category === 'recovery' && 'Recuperación de Oportunidad'}
                  {sug.category === 'cross-sell' && 'Venta Cruzada / Expansión'}
                  {sug.category === 'stale-quote' && 'Cotización sin Respuesta'}
                  {sug.category === 'seller-balance' && 'Cadencia de Vendedor'}
                </span>
                <h4 className="text-xs font-black text-theme-main leading-snug">
                  {sug.title}
                </h4>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  <strong className="text-theme-main font-semibold">Diagnóstico: </strong>
                  {sug.reason}
                </p>
                <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                  {sug.impactNote}
                </div>
              </div>

              <div className="pt-2 border-t border-theme-subtle flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigateTab(sug.targetTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <span>{sug.primaryActionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {sug.secondaryActionLabel && (
                  <span className="text-[11px] text-theme-muted font-medium">
                    {sug.secondaryActionLabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two Columns: Embudo Comercial & Atención Requerida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* EMBUDO COMERCIAL */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
          <div className="flex items-start justify-between border-b border-theme-subtle pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
                Embudo Comercial &middot; Conversión por Etapa
              </h3>
              <p className="text-[11px] text-theme-muted">
                Haz clic en una etapa para abrir y filtrar el Pipeline Kanban.
              </p>
            </div>
            <Filter className="w-5 h-5 text-theme-primary" />
          </div>

          <OpportunityFunnel
            opportunities={filteredOpps}
            onStage={() => onNavigateTab('pipeline')}
          />
        </div>

        {/* ATENCIÓN REQUERIDA */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Atención Requerida</span>
              </h3>
              <span className="text-[10px] font-bold text-rose-600">
                {attentionItems.length} críticas
              </span>
            </div>
            <p className="text-[11px] text-theme-muted">
              Oportunidades con alta probabilidad de pérdida por estancamiento o falta de cadencia.
            </p>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map((opp) => (
              <div
                key={opp.id}
                onClick={() => onOpenOpportunity(opp)}
                className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/60 border border-theme-subtle transition-all cursor-pointer space-y-1.5 group text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-theme-main group-hover:text-theme-primary transition-colors">
                    {opp.account} &middot; <span className="font-mono">{opp.folio}</span>
                  </span>
                  <span className="font-mono text-rose-600 font-black">
                    {formatMxn(opp.amount)}
                  </span>
                </div>

                <p className="text-[11px] text-theme-muted line-clamp-1">{opp.title}</p>

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-amber-600 font-bold">
                    {opp.days} días en {opp.stage} &middot; {opp.next}
                  </span>
                  <span className="text-theme-primary font-semibold flex items-center gap-0.5">
                    <span>Revisar</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('today')}
              className="w-full py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Ver Todas en Mi Día &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 5. Two Columns: Pipeline por Etapa & Forecast vs Objetivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              Pipeline por Etapa
            </h3>
            <p className="text-[11px] text-theme-muted">
              Distribución de monto acumulado en cada fase comercial.
            </p>
          </div>
          <PipelineStageChart
            opportunities={filteredOpps}
            onStage={() => onNavigateTab('pipeline')}
          />
        </div>

        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              Forecast vs Objetivo Comercial
            </h3>
            <p className="text-[11px] text-theme-muted">
              Proyección acumulada de cierre frente a meta de $1.2M MXN mensuales.
            </p>
          </div>
          <ForecastChart />
        </div>
      </div>

      {/* 6. Two Columns: Top Cuentas por Pipeline & Desempeño por Vendedor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Cuentas */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-theme-primary" />
                <span>Top Cuentas por Pipeline</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('accounts')}
                className="text-[11px] text-theme-primary font-bold hover:underline cursor-pointer"
              >
                Ver Cuentas 360 &rarr;
              </button>
            </div>
            <p className="text-[11px] text-theme-muted">
              Cuentas empresariales que concentran mayor volumen comercial en el periodo.
            </p>
          </div>

          <div className="space-y-3">
            {topAccounts.map((acc, idx) => {
              const maxVal = Math.max(...topAccounts.map((a) => a.pipeline), 1);
              const percent = (acc.pipeline / maxVal) * 100;

              return (
                <div
                  key={acc.account}
                  onClick={() => onNavigateTab('accounts')}
                  className="p-3 rounded-2xl bg-theme-muted/30 hover:bg-theme-muted/60 border border-theme-subtle transition-all cursor-pointer space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-theme-surface border border-theme-subtle flex items-center justify-center font-bold text-[10px] text-theme-muted">
                        0{idx + 1}
                      </span>
                      <strong className="text-theme-main">{acc.account}</strong>
                    </div>
                    <span className="font-mono font-bold text-theme-primary">
                      {formatMxn(acc.pipeline)}
                    </span>
                  </div>

                  <div className="w-full bg-theme-subtle h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-theme-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-theme-muted">
                    <span>{acc.oppsCount} oportunidades vivas</span>
                    <span className="text-emerald-600 font-bold">Salud media: {acc.health}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desempeño por Vendedor */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-theme-primary" />
              <span>Desempeño de Vendedores (Derivado de Mocks)</span>
            </h3>
            <p className="text-[11px] text-theme-muted">
              Pipeline gestionado, tasa de éxito y actividades vencidas por ejecutivo.
            </p>
          </div>

          <div className="space-y-3">
            {sellerPerformance.map((sp) => (
              <div
                key={sp.seller}
                className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-theme-main block font-semibold">{sp.seller}</strong>
                    <span className="text-[10px] text-theme-muted">
                      {sp.openCount} activas &middot; Win Rate: <strong className="text-emerald-600">{sp.winRate}%</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-theme-primary block text-sm">
                      {formatMxn(sp.pipeline)}
                    </span>
                    <span className="text-[10px] text-theme-muted">
                      Ganado: {formatMxn(sp.won)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-theme-subtle/60 text-theme-muted">
                  <span>Ticket Promedio: <strong className="font-mono text-theme-main">{formatMxn(sp.avgTicket)}</strong></span>
                  <span className={sp.overdueCount > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                    {sp.overdueCount} actividades vencidas
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle text-[11px] text-theme-muted flex items-center justify-between">
            <span>Fórmula Win Rate: Ganadas / (Ganadas + Perdidas)</span>
            <span className="font-bold text-theme-main">100% derivado</span>
          </div>
        </div>
      </div>

      {/* 7. Pipeline por Línea Productiva RTM */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
        <div className="space-y-1 border-b border-theme-subtle pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-theme-primary" />
              <span>Pipeline por Línea Productiva (Conexión Operativa RTM)</span>
            </h3>
            <span className="text-[10px] text-theme-muted font-mono font-bold">
              Total: {formatMxn(kpis.openPipeline)}
            </span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Volumen comercial segmentado por taller de manufactura en planta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lineDistribution.map((item) => (
            <div
              key={item.line}
              className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1.5 text-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-theme-main block">{item.line}</span>
                <span className="text-[10px] text-theme-muted">{item.count} oportunidades</span>
              </div>
              <div>
                <strong className="font-mono text-base font-bold text-theme-primary block">
                  {formatMxn(item.amount)}
                </strong>
                <div className="w-full bg-theme-subtle h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-theme-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-theme-muted font-mono mt-1 block">
                  {item.percentage}% del total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
