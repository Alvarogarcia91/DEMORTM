import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Receipt,
  Building2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { SalesQuote } from '../../../data/mockSalesData';
import {
  formatCurrencyMXN,
  formatKpiCurrency,
  formatPercentage,
  formatUnits,
  formatDateMX,
} from '../../../utils/formatters';

interface CotizacionesDashboardProps {
  quotes: SalesQuote[];
  onOpenCreateWizard: () => void;
  onNavigateToList: () => void;
  onOpenDetail: (quote: SalesQuote) => void;
}

export const CotizacionesDashboard: React.FC<CotizacionesDashboardProps> = ({
  quotes,
  onNavigateToList,
  onOpenDetail,
}) => {
  const [period, setPeriod] = useState<'hoy' | '7d' | '30d' | '90d'>('30d');
  const [branchFilter, setBranchFilter] = useState('all');

  const filteredQuotes = quotes.filter((q) => {
    if (branchFilter !== 'all' && q.branchId !== branchFilter) return false;
    return true;
  });

  const openQuotesCount = filteredQuotes.filter((q) => q.status === 'Enviada al cliente' || q.status === 'Borrador').length;
  const pendingAuthCount = filteredQuotes.filter((q) => q.status === 'Pendiente de autorización').length;
  const acceptedQuotesCount = filteredQuotes.filter((q) => q.status === 'Aceptada' || q.status === 'Convertida en pedido').length;
  const totalAmount = filteredQuotes.reduce((acc, q) => acc + q.financials.total, 0);
  const avgTicket = filteredQuotes.length > 0 ? totalAmount / filteredQuotes.length : 0;
  const conversionRate = filteredQuotes.length > 0 ? (acceptedQuotesCount / filteredQuotes.length) * 100 : 0;

  const voQuotes = filteredQuotes.filter((q) => q.branchId === 'wh-suc-valle-oriente');
  const cumbresQuotes = filteredQuotes.filter((q) => q.branchId === 'wh-suc-cumbres');

  const upcomingExpiry = filteredQuotes.filter((q) => q.status === 'Enviada al cliente' || q.status === 'Pendiente de autorización').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar (Strictly filter controls) */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Periodo:</span>
          <div className="flex items-center p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200 text-xs">
            {(['hoy', '7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-white text-rose-600 border border-rose-500/30 shadow-2xs font-black'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'hoy' ? 'Hoy' : p === '7d' ? '7 días' : p === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline-block">Sucursal:</span>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-bold shadow-2xs cursor-pointer focus:outline-none"
          >
            <option value="all">Todas las sucursales</option>
            <option value="wh-suc-valle-oriente">Sucursal Valle Oriente</option>
            <option value="wh-suc-cumbres">Sucursal Cumbres</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid (100% White Backgrounds + Semantic Borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* KPI 1: ABIERTAS */}
        <div className="p-4 rounded-2xl bg-white border border-blue-500/40 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Abiertas
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {openQuotesCount}
          </span>
          <span className="text-[10px] text-zinc-500">En seguimiento</span>
        </div>

        {/* KPI 2: PENDIENTES DE AUTORIZACIÓN */}
        <div className="p-4 rounded-2xl bg-white border border-amber-500/50 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pendientes de Autorización
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {pendingAuthCount}
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">Requiere dictamen</span>
        </div>

        {/* KPI 3: ACEPTADAS */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-600/50 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Aceptadas
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {acceptedQuotesCount}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">Listas para pedido</span>
        </div>

        {/* KPI 4: CONVERSIÓN */}
        <div className="p-4 rounded-2xl bg-white border border-purple-500/50 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              Conversión
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {formatPercentage(conversionRate, 1)}
          </span>
          <span className="text-[10px] text-purple-700 font-semibold">Aceptación a pedido</span>
        </div>

        {/* KPI 5: MONTO TOTAL */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-600 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-rose-600" />
              Monto Total
            </span>
          </div>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(totalAmount, false)}>
            {formatKpiCurrency(totalAmount)}
          </span>
          <span className="text-[10px] text-zinc-500">Total cotizado</span>
        </div>

        {/* KPI 6: TICKET PROMEDIO */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-600 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-zinc-600" />
              Ticket Promedio
            </span>
          </div>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(avgTicket, false)}>
            {formatCurrencyMXN(avgTicket, false)}
          </span>
          <span className="text-[10px] text-zinc-500">Por propuesta</span>
        </div>
      </div>

      {/* Visual Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Actividad por Sucursal */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
            <span>Actividad por Sucursal</span>
            <Building2 className="w-4 h-4 text-zinc-400" />
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Sucursal Valle Oriente</span>
                <span className="font-mono">{voQuotes.length} cotizaciones</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${filteredQuotes.length > 0 ? (voQuotes.length / filteredQuotes.length) * 100 : 50}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-600 pt-0.5">
                <span>Monto: <strong className="font-mono">{formatCurrencyMXN(voQuotes.reduce((acc, q) => acc + q.financials.total, 0), false)}</strong></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-600 shadow-2xs">
                  Líder en volumen
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Sucursal Cumbres</span>
                <span className="font-mono">{cumbresQuotes.length} cotizaciones</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${filteredQuotes.length > 0 ? (cumbresQuotes.length / filteredQuotes.length) * 100 : 50}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-600 pt-0.5">
                <span>Monto: <strong className="font-mono">{formatCurrencyMXN(cumbresQuotes.reduce((acc, q) => acc + q.financials.total, 0), false)}</strong></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-purple-600 shadow-2xs">
                  Ticket promedio alto
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Top Artículos Cotizados */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
            <span>Top Artículos Cotizados</span>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Flow Individual', count: 38, pct: '+45% vs. periodo anterior' },
              { sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Flow Matrimonial', count: 24, pct: '+28% vs. periodo anterior' },
              { sku: 'SC-SEAL-POST-QS', name: 'Sealy Posturepedic Queen', count: 18, pct: '+15% vs. periodo anterior' },
              { sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Mat.', count: 15, pct: '+12% vs. periodo anterior' },
            ].map((art, idx) => (
              <div
                key={art.sku}
                className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-100 font-black text-[10px] text-zinc-800 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-900 block">{art.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{art.sku}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-zinc-900 block">{formatUnits(art.count)}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{art.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: Próximas a Vencer */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
            <span>Próximas a Vencer</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </h3>

          <div className="space-y-2 text-xs">
            {upcomingExpiry.map((q) => (
              <div
                key={q.id}
                onClick={() => onOpenDetail(q)}
                className="p-3 rounded-xl bg-white border border-zinc-200 hover:border-rose-500 shadow-2xs cursor-pointer space-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-600">{q.folio}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-amber-500 text-zinc-900 shadow-2xs">
                    Vence {formatDateMX(q.validUntil)}
                  </span>
                </div>
                <p className="font-semibold text-zinc-900 truncate">{q.customerName}</p>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{q.branchName}</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrencyMXN(q.financials.total, false)}
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onNavigateToList}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Ver todas las cotizaciones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
