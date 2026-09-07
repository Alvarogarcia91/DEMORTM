import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  MOCK_BALANCE_SHEET,
  MOCK_INCOME_STATEMENT,
  MOCK_CASH_FLOW,
  REPORT_DEFINITIONS,
  FinancialLine,
  calculateRealAgingBuckets,
  INITIAL_FIXED_ASSETS
} from '../../../data/mockAccountingReportsData';
import { AccountReceivable, SupplierInvoice } from '../../../data/mockFinanzasData';
import { ReportDrillDownModal } from './ReportDrillDownModal';

interface ReportViewerProps {
  reportId: string;
  onBack: () => void;
  cxc: AccountReceivable[];
  cxp: SupplierInvoice[];
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
  onNavigateToInvoice?: (folio: string) => void;
  toast: (msg: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reportId,
  onBack,
  cxc,
  cxp,
  onNavigateToAsset,
  onNavigateToMaintenance,
  onNavigateToInvoice,
  toast
}) => {
  const [period, setPeriod] = useState('Septiembre 2026');
  const [comparisonMode, setComparisonMode] = useState<'anterior' | 'presupuesto' | 'ninguno'>('anterior');
  const [selectedDrillLine, setSelectedDrillLine] = useState<FinancialLine | null>(null);

  const reportDef = REPORT_DEFINITIONS.find((r) => r.id === reportId) || REPORT_DEFINITIONS[0];

  // Cálculos dinámicos de aging
  const cxcBuckets = calculateRealAgingBuckets(cxc);
  const cxpBuckets = calculateRealAgingBuckets(cxp);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header del Reporte */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-muted hover:text-theme-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Biblioteca de Reportes
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-theme-main tracking-tight">
              {reportDef.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-theme-primary/10 text-theme-primary">
              {reportDef.categoryLabel}
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            {reportDef.description}
          </p>
        </div>

        {/* Barra de Controles y Acciones */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Periodo */}
          <div className="flex items-center gap-1.5 bg-theme-surface border border-theme-subtle rounded-xl px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-theme-muted" />
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                toast(`Periodo actualizado a ${e.target.value}`);
              }}
              className="bg-transparent border-none focus:outline-none text-xs font-bold text-theme-main cursor-pointer"
            >
              <option>Septiembre 2026</option>
              <option>Agosto 2026</option>
              <option>Julio 2026</option>
              <option>2Q 2026</option>
              <option>Año 2026 YTD</option>
            </select>
          </div>

          {/* Comparativo */}
          <div className="flex items-center gap-1.5 bg-theme-surface border border-theme-subtle rounded-xl px-3 py-1.5 text-xs">
            <span className="text-theme-muted">Comparar:</span>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as any)}
              className="bg-transparent border-none focus:outline-none text-xs font-bold text-theme-main cursor-pointer"
            >
              <option value="anterior">Mes anterior real</option>
              <option value="presupuesto">Presupuesto anual</option>
              <option value="ninguno">Sin comparativo</option>
            </select>
          </div>

          {/* Botones de Exportación */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => toast('Exportando reporte a formato Excel XLSX · Demo RTM')}
              className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Excel
            </button>
            <button
              onClick={() => toast('Generando documento PDF oficial de alta resolución · Demo RTM')}
              className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              PDF
            </button>
            <button
              onClick={() => toast('Preparando vista de impresión preliminar · Demo RTM')}
              className="p-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main hover:border-theme-primary/40 transition-colors"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast('Reporte actualizado en tiempo real con datos de piso y almacén')}
              className="p-2 rounded-xl border border-theme-subtle bg-theme-surface text-theme-muted hover:text-theme-main hover:border-theme-primary/40 transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Renderizado Específico según Reporte */}
      {reportId === 'rep-situacion-financiera' && (
        <BalanceSheetView
          onSelectLine={setSelectedDrillLine}
          comparisonMode={comparisonMode}
          onNavigateToAsset={onNavigateToAsset}
        />
      )}

      {reportId === 'rep-estado-resultados' && (
        <IncomeStatementView
          onSelectLine={setSelectedDrillLine}
          comparisonMode={comparisonMode}
        />
      )}

      {reportId === 'rep-flujo-efectivo' && (
        <CashFlowView
          onSelectLine={setSelectedDrillLine}
          comparisonMode={comparisonMode}
        />
      )}

      {reportId === 'rep-antiguedad-cxc' && (
        <AgingView
          title="Antigüedad de Saldos por Cobrar (CxC)"
          type="cxc"
          buckets={cxcBuckets}
          rows={cxc}
          onSelectLine={setSelectedDrillLine}
          onNavigateToInvoice={onNavigateToInvoice}
        />
      )}

      {reportId === 'rep-antiguedad-cxp' && (
        <AgingView
          title="Antigüedad de Obligaciones con Proveedores (CxP)"
          type="cxp"
          buckets={cxpBuckets}
          rows={cxp}
          onSelectLine={setSelectedDrillLine}
        />
      )}

      {reportId === 'rep-activos-catalogo' && (
        <FixedAssetsReportView
          onNavigateToAsset={onNavigateToAsset}
          onNavigateToMaintenance={onNavigateToMaintenance}
        />
      )}

      {reportId === 'rep-depreciacion-periodo' && (
        <DepreciationReportView
          onNavigateToAsset={onNavigateToAsset}
        />
      )}

      {/* Reportes Generales restantes con Vistas Operativas Cuadradas */}
      {![
        'rep-situacion-financiera',
        'rep-estado-resultados',
        'rep-flujo-efectivo',
        'rep-antiguedad-cxc',
        'rep-antiguedad-cxp',
        'rep-activos-catalogo',
        'rep-depreciacion-periodo'
      ].includes(reportId) && (
        <GenericReportView reportDef={reportDef} onSelectLine={setSelectedDrillLine} />
      )}

      {/* Modal de Drill-Down */}
      {selectedDrillLine && (
        <ReportDrillDownModal
          line={selectedDrillLine}
          onClose={() => setSelectedDrillLine(null)}
          onNavigateToAsset={onNavigateToAsset}
          onNavigateToMaintenance={onNavigateToMaintenance}
          onNavigateToInvoice={onNavigateToInvoice}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL)
// ----------------------------------------------------------------------------
const BalanceSheetView: React.FC<{
  onSelectLine: (l: FinancialLine) => void;
  comparisonMode: string;
  onNavigateToAsset?: (id: string) => void;
}> = ({ onSelectLine, comparisonMode, onNavigateToAsset }) => {
  const data = MOCK_BALANCE_SHEET;

  return (
    <div className="space-y-5">
      {/* Tarjetas Ejecutivas de Salud Financiera */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Activo Total</span>
          <b className="font-mono text-xl text-theme-main block mt-1">{mx(data.summary.totalAssets)}</b>
          <span className="text-[11px] text-emerald-600 font-bold">100% Cuadrado</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Activo No Circulante Neto</span>
          <b className="font-mono text-xl text-theme-primary block mt-1">{mx(data.summary.fixedAssetsNet)}</b>
          <span className="text-[11px] text-theme-muted">20 activos fabriles RTM</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Pasivo Total</span>
          <b className="font-mono text-xl text-theme-main block mt-1">{mx(data.summary.totalLiabilities)}</b>
          <span className="text-[11px] text-theme-muted">32.2% apalancamiento</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Capital Contable</span>
          <b className="font-mono text-xl text-emerald-600 block mt-1">{mx(data.summary.totalEquity)}</b>
          <span className="text-[11px] text-theme-muted">67.8% patrimonio neto</span>
        </div>
      </div>

      {/* Tabla Contable Detallada */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-theme-main">Estado de Situación Financiera Comparativo</h3>
            <p className="text-xs text-theme-muted">
              Haz clic en cualquier renglón para abrir la trazabilidad contable multinivel.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Balance Cuadrado
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-3.5 text-left">Código</th>
                <th className="p-3.5 text-left">Rubro / Cuenta Contable</th>
                <th className="p-3.5 text-right font-mono">Saldo Actual</th>
                {comparisonMode !== 'ninguno' && (
                  <>
                    <th className="p-3.5 text-right font-mono">Mes Anterior</th>
                    <th className="p-3.5 text-right font-mono">Variación ($)</th>
                    <th className="p-3.5 text-right font-mono">Var. (%)</th>
                  </>
                )}
                <th className="p-3.5 text-center">Trazabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {data.lines.map((line) => {
                if (line.isHeader) {
                  return (
                    <tr key={line.id} className="bg-theme-muted/20 font-black text-theme-main">
                      <td colSpan={comparisonMode !== 'ninguno' ? 7 : 4} className="p-3 text-[11px] uppercase tracking-wider">
                        {line.label}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={line.id}
                    onClick={() => !line.isTotal && onSelectLine(line)}
                    className={`transition-colors ${
                      line.isTotal
                        ? 'font-black bg-theme-muted/10 text-theme-main border-y-2 border-theme-subtle'
                        : 'hover:bg-theme-muted/30 cursor-pointer'
                    }`}
                  >
                    <td className="p-3 font-mono text-[11px] text-theme-muted">{line.code || '—'}</td>
                    <td className={`p-3 ${line.indent === 1 ? 'pl-8' : line.indent === 2 ? 'pl-12' : ''}`}>
                      <span className={line.isTotal ? 'font-black text-theme-main' : 'font-medium text-theme-main'}>
                        {line.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-theme-main">
                      {line.currentAmount !== 0 ? mx(line.currentAmount) : '—'}
                    </td>
                    {comparisonMode !== 'ninguno' && (
                      <>
                        <td className="p-3 text-right font-mono text-theme-muted">
                          {line.previousAmount !== 0 ? mx(line.previousAmount) : '—'}
                        </td>
                        <td
                          className={`p-3 text-right font-mono ${
                            line.varianceAmount > 0
                              ? 'text-emerald-600 font-bold'
                              : line.varianceAmount < 0
                              ? 'text-rose-600 font-bold'
                              : 'text-theme-muted'
                          }`}
                        >
                          {line.varianceAmount !== 0
                            ? (line.varianceAmount > 0 ? '+' : '') + mx(line.varianceAmount)
                            : '—'}
                        </td>
                        <td
                          className={`p-3 text-right font-mono ${
                            line.variancePercent > 0
                              ? 'text-emerald-600'
                              : line.variancePercent < 0
                              ? 'text-rose-600'
                              : 'text-theme-muted'
                          }`}
                        >
                          {line.variancePercent !== 0
                            ? (line.variancePercent > 0 ? '+' : '') + line.variancePercent + '%'
                            : '—'}
                        </td>
                      </>
                    )}
                    <td className="p-3 text-center">
                      {!line.isTotal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-theme-primary">
                          Ver origen
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-theme-muted">Total</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: ESTADO DE RESULTADOS (P&L)
// ----------------------------------------------------------------------------
const IncomeStatementView: React.FC<{
  onSelectLine: (l: FinancialLine) => void;
  comparisonMode: string;
}> = ({ onSelectLine, comparisonMode }) => {
  const data = MOCK_INCOME_STATEMENT;

  return (
    <div className="space-y-5">
      {/* Tarjetas de Desempeño */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Ventas Netas</span>
          <b className="font-mono text-xl text-theme-main block mt-1">{mx(data.totals.totalRevenue)}</b>
          <span className="text-[11px] text-emerald-600 font-bold">+6.2% vs mes anterior</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Utilidad Bruta</span>
          <b className="font-mono text-xl text-theme-primary block mt-1">{mx(data.totals.grossProfit)}</b>
          <span className="text-[11px] text-theme-muted">{data.totals.grossMarginPct}% de margen</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">EBIT Operativo</span>
          <b className="font-mono text-xl text-theme-main block mt-1">{mx(data.totals.operatingProfit)}</b>
          <span className="text-[11px] text-theme-muted">{data.totals.operatingMarginPct}% de margen</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Utilidad Neta</span>
          <b className="font-mono text-xl text-emerald-600 block mt-1">{mx(data.totals.netProfit)}</b>
          <span className="text-[11px] text-emerald-600 font-bold">{data.totals.netMarginPct}% margen neto</span>
        </div>
      </div>

      {/* Tabla P&L */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle">
          <h3 className="font-bold text-sm text-theme-main">Estado de Pérdidas y Ganancias (P&L)</h3>
          <p className="text-xs text-theme-muted">
            Desglose de ingresos fabriles, costos directos y gastos operativos con comparativo del mes anterior.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-3.5 text-left">Código</th>
                <th className="p-3.5 text-left">Concepto</th>
                <th className="p-3.5 text-right font-mono">Actual</th>
                {comparisonMode !== 'ninguno' && (
                  <>
                    <th className="p-3.5 text-right font-mono">Mes Anterior</th>
                    <th className="p-3.5 text-right font-mono">Variación</th>
                    <th className="p-3.5 text-right font-mono">%</th>
                  </>
                )}
                <th className="p-3.5 text-center">Trazabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {data.lines.map((line) => {
                if (line.isHeader) {
                  return (
                    <tr key={line.id} className="bg-theme-muted/20 font-black text-theme-main">
                      <td colSpan={comparisonMode !== 'ninguno' ? 7 : 4} className="p-3 text-[11px] uppercase tracking-wider">
                        {line.label}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={line.id}
                    onClick={() => !line.isTotal && onSelectLine(line)}
                    className={`transition-colors ${
                      line.isTotal
                        ? 'font-black bg-theme-muted/10 text-theme-main border-y-2 border-theme-subtle'
                        : 'hover:bg-theme-muted/30 cursor-pointer'
                    }`}
                  >
                    <td className="p-3 font-mono text-[11px] text-theme-muted">{line.code || '—'}</td>
                    <td className={`p-3 ${line.indent === 1 ? 'pl-8' : ''}`}>
                      <span className={line.isTotal ? 'font-black text-theme-main' : 'font-medium text-theme-main'}>
                        {line.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-theme-main">
                      {line.currentAmount !== 0 ? mx(line.currentAmount) : '—'}
                    </td>
                    {comparisonMode !== 'ninguno' && (
                      <>
                        <td className="p-3 text-right font-mono text-theme-muted">
                          {line.previousAmount !== 0 ? mx(line.previousAmount) : '—'}
                        </td>
                        <td
                          className={`p-3 text-right font-mono ${
                            line.varianceAmount > 0
                              ? 'text-emerald-600 font-bold'
                              : line.varianceAmount < 0
                              ? 'text-rose-600 font-bold'
                              : 'text-theme-muted'
                          }`}
                        >
                          {line.varianceAmount !== 0
                            ? (line.varianceAmount > 0 ? '+' : '') + mx(line.varianceAmount)
                            : '—'}
                        </td>
                        <td
                          className={`p-3 text-right font-mono ${
                            line.variancePercent > 0
                              ? 'text-emerald-600'
                              : line.variancePercent < 0
                              ? 'text-rose-600'
                              : 'text-theme-muted'
                          }`}
                        >
                          {line.variancePercent !== 0
                            ? (line.variancePercent > 0 ? '+' : '') + line.variancePercent + '%'
                            : '—'}
                        </td>
                      </>
                    )}
                    <td className="p-3 text-center">
                      {!line.isTotal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-theme-primary">
                          Auditar
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-theme-muted">Total</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: FLUJO DE EFECTIVO
// ----------------------------------------------------------------------------
const CashFlowView: React.FC<{
  onSelectLine: (l: FinancialLine) => void;
  comparisonMode: string;
}> = ({ onSelectLine, comparisonMode }) => {
  const data = MOCK_CASH_FLOW;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Flujo Operativo</span>
          <b className="font-mono text-xl text-emerald-600 block mt-1">{mx(data.summary.operatingCashFlow)}</b>
          <span className="text-[11px] text-theme-muted">Cobranza - Pagos</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Flujo de Inversión</span>
          <b className="font-mono text-xl text-rose-600 block mt-1">{mx(data.summary.investingCashFlow)}</b>
          <span className="text-[11px] text-theme-muted">CAPEX Maquinaria</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Variación Neta</span>
          <b className="font-mono text-xl text-theme-primary block mt-1">+{mx(data.summary.netChangeInCash)}</b>
          <span className="text-[11px] text-theme-muted">Incremento de caja</span>
        </div>
        <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface">
          <span className="text-[10px] font-bold uppercase text-theme-muted block">Saldo Final Bancos</span>
          <b className="font-mono text-xl text-theme-main block mt-1">{mx(data.summary.finalCash)}</b>
          <span className="text-[11px] text-emerald-600 font-bold">100% Conciliado</span>
        </div>
      </div>

      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle">
          <h3 className="font-bold text-sm text-theme-main">Estado de Flujo de Efectivo por Actividades</h3>
        </div>
        <table className="w-full text-xs">
          <tbody className="divide-y divide-theme-subtle">
            {data.lines.map((l) => (
              <tr
                key={l.id}
                onClick={() => !l.isHeader && !l.isTotal && onSelectLine(l)}
                className={
                  l.isHeader
                    ? 'bg-theme-muted/20 font-black'
                    : l.isTotal
                    ? 'bg-theme-muted/10 font-bold'
                    : 'hover:bg-theme-muted/30 cursor-pointer'
                }
              >
                <td className={`p-3.5 ${l.indent ? 'pl-8' : ''}`}>{l.label}</td>
                <td className="p-3.5 text-right font-mono font-bold">{mx(l.currentAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: ANTIGÜEDAD CXC / CXP (REAL Y MATEMÁTICAMENTE COHERENTE)
// ----------------------------------------------------------------------------
const AgingView: React.FC<{
  title: string;
  type: 'cxc' | 'cxp';
  buckets: any[];
  rows: any[];
  onSelectLine: (l: FinancialLine) => void;
  onNavigateToInvoice?: (folio: string) => void;
}> = ({ title, type, buckets, rows, onSelectLine, onNavigateToInvoice }) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('todos');

  const filteredRows = rows.filter((r) => {
    if (selectedBucket === 'todos') return true;
    return r.bucket === selectedBucket;
  });

  const totalSaldo = rows.reduce((s, r) => s + (r.saldoPendiente || 0), 0);

  return (
    <div className="space-y-6">
      {/* Buckets Visuales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {buckets.map((b) => (
          <div
            key={b.name}
            onClick={() => setSelectedBucket(selectedBucket === b.name ? 'todos' : b.name)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedBucket === b.name ? 'ring-2 ring-theme-primary shadow-md' : ''
            } ${b.bgLightClass}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase ${b.textClass}`}>{b.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/40">
                {b.count} doc.
              </span>
            </div>
            <b className="font-mono text-lg text-theme-main block mt-2">{mx(b.amount)}</b>
            <span className="text-[11px] text-theme-muted font-medium">{b.percentage}% del total</span>
          </div>
        ))}
      </div>

      {/* Gráfica de Distribución por Bucket */}
      <div className="p-5 rounded-3xl border border-theme-subtle bg-theme-surface">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-theme-muted">
            Distribución de Saldos Pendientes ({mx(totalSaldo)})
          </h3>
          {selectedBucket !== 'todos' && (
            <button
              onClick={() => setSelectedBucket('todos')}
              className="text-xs font-bold text-theme-primary hover:underline"
            >
              Ver todos los buckets
            </button>
          )}
        </div>

        <div className="h-4 rounded-full overflow-hidden flex bg-theme-muted/30">
          {buckets.map((b) => (
            <div
              key={b.name}
              style={{ width: `${b.percentage}%` }}
              className={`${b.colorClass} transition-all duration-300`}
              title={`${b.label}: ${mx(b.amount)} (${b.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Tabla de Documentos Reales */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-theme-main">{title}</h3>
            <p className="text-xs text-theme-muted">
              Mostrando {filteredRows.length} documentos con saldo pendiente de pago.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-3.5 text-left">Documento</th>
                <th className="p-3.5 text-left">{type === 'cxc' ? 'Cliente' : 'Proveedor'}</th>
                <th className="p-3.5 text-left">Vencimiento</th>
                <th className="p-3.5 text-right font-mono">Importe Original</th>
                <th className="p-3.5 text-right font-mono">Saldo Pendiente</th>
                <th className="p-3.5 text-center">Bucket Real</th>
                <th className="p-3.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-theme-muted/20 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-theme-primary">
                    {row.folio || row.folioProveedor || row.facturaFolio}
                  </td>
                  <td className="p-3.5 font-medium text-theme-main">
                    {row.clienteNombre || row.proveedorNombre}
                  </td>
                  <td className="p-3.5 text-theme-muted">
                    {row.fechaVencimiento
                      ? new Date(row.fechaVencimiento).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td className="p-3.5 text-right font-mono text-theme-muted">
                    {mx(row.total || row.montoOriginal || 0)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-theme-main">
                    {mx(row.saldoPendiente || 0)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'vencida' || (row.diasMora && row.diasMora > 0)
                          ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700'
                          : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700'
                      }`}
                    >
                      {row.bucket || (row.diasMora > 0 ? `${row.diasMora} días mora` : 'Vigente')}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {type === 'cxc' && onNavigateToInvoice && (
                      <button
                        onClick={() => onNavigateToInvoice(row.folio || row.facturaFolio)}
                        className="text-xs font-bold text-theme-primary hover:underline flex items-center justify-center gap-1 mx-auto"
                      >
                        Ver factura
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: CATÁLOGO Y VALUACIÓN DE ACTIVOS FIJOS
// ----------------------------------------------------------------------------
const FixedAssetsReportView: React.FC<{
  onNavigateToAsset?: (id: string) => void;
  onNavigateToMaintenance?: (code: string) => void;
}> = ({ onNavigateToAsset, onNavigateToMaintenance }) => {
  const assets = INITIAL_FIXED_ASSETS;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-theme-main">Catálogo Oficial de Activos Fijos RTM</h3>
            <p className="text-xs text-theme-muted">
              Costo de adquisición, depreciación acumulada y valor en libros cuadrado con el Balance General ($8,930,000).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                <th className="p-3 text-left">Clave</th>
                <th className="p-3 text-left">Máquina / Equipo</th>
                <th className="p-3 text-left">Área</th>
                <th className="p-3 text-right font-mono">Costo Histórico</th>
                <th className="p-3 text-right font-mono">Deprec. Acum.</th>
                <th className="p-3 text-right font-mono">Valor Neto</th>
                <th className="p-3 text-center">Deprec. Mensual</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-theme-muted/20 transition-colors">
                  <td className="p-3 font-mono font-bold text-theme-primary">{asset.id}</td>
                  <td className="p-3">
                    <b className="text-theme-main block">{asset.name}</b>
                    <small className="text-theme-muted">{asset.brand} {asset.model}</small>
                  </td>
                  <td className="p-3 text-theme-muted">{asset.area}</td>
                  <td className="p-3 text-right font-mono">{mx(asset.historicalCost)}</td>
                  <td className="p-3 text-right font-mono text-theme-muted">{mx(asset.accumulatedDepreciation)}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">{mx(asset.netBookValue)}</td>
                  <td className="p-3 text-center font-mono">{mx(asset.monthlyDepreciation)}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {asset.operatingStatus}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {onNavigateToAsset && (
                      <button
                        onClick={() => onNavigateToAsset(asset.id)}
                        className="text-theme-primary font-bold hover:underline"
                      >
                        Ver ficha
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: DEPRECIACIÓN DEL PERÍODO
// ----------------------------------------------------------------------------
const DepreciationReportView: React.FC<{
  onNavigateToAsset?: (id: string) => void;
}> = ({ onNavigateToAsset }) => {
  return (
    <div className="space-y-5">
      <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface">
        <h3 className="font-bold text-base text-theme-main mb-2">Póliza Mensual de Depreciación · Septiembre 2026</h3>
        <p className="text-xs text-theme-muted mb-4">
          Cálculo ordinario bajo método de línea recta (10% anual maquinaria, 33% equipo de cómputo).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-muted/10">
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Depreciación Fabril (Offset + Flexo)</span>
            <b className="font-mono text-xl text-theme-main block mt-1">$106,500 / mes</b>
            <small className="text-theme-muted">Se aplica al Costo de Ventas (Cuenta 5103)</small>
          </div>
          <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-muted/10">
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Depreciación No Fabril (TI + Admin)</span>
            <b className="font-mono text-xl text-theme-main block mt-1">$8,900 / mes</b>
            <small className="text-theme-muted">Se aplica a Gastos de Operación (Cuenta 6103)</small>
          </div>
          <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-muted/10">
            <span className="text-[10px] uppercase font-bold text-theme-muted block">Total Depreciación Mensual</span>
            <b className="font-mono text-xl text-theme-primary block mt-1">$115,400 / mes</b>
            <small className="text-emerald-600 font-bold">Póliza PDF-2026-009 cuadrada</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// VISTA: REPORTE GENÉRICO OPERATIVO
// ----------------------------------------------------------------------------
const GenericReportView: React.FC<{
  reportDef: any;
  onSelectLine: (l: FinancialLine) => void;
}> = ({ reportDef, onSelectLine }) => {
  return (
    <div className="p-8 rounded-3xl border border-theme-subtle bg-theme-surface space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-theme-subtle">
        <div>
          <h3 className="font-bold text-base text-theme-main">{reportDef.title}</h3>
          <p className="text-xs text-theme-muted">{reportDef.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-primary/10 text-theme-primary">
          Frecuencia: {reportDef.frequency}
        </span>
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-theme-subtle bg-theme-muted/10 text-center space-y-2">
        <FileSpreadsheet className="w-8 h-8 text-theme-primary mx-auto mb-2" />
        <h4 className="font-bold text-sm text-theme-main">Datos Consolidados para Demostración</h4>
        <p className="text-xs text-theme-muted max-w-lg mx-auto">
          Este reporte operativo se alimenta dinámicamente de los módulos de Ventas, Compras, Inventario y Producción de RTM.
        </p>
        <button
          onClick={() =>
            onSelectLine({
              id: 'gen-01',
              label: reportDef.title,
              currentAmount: 485000,
              previousAmount: 460000,
              varianceAmount: 25000,
              variancePercent: 5.4,
              category: 'ingresos'
            })
          }
          className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-theme-primary text-white"
        >
          Explorar Trazabilidad de Muestra
        </button>
      </div>
    </div>
  );
};
