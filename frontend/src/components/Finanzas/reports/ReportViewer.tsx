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
  ExternalLink,
  Eye,
  Info,
  AlertTriangle
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
              onClick={() => toast(`Exportando "${reportDef.title}" a formato Excel XLSX · Demo RTM`)}
              className="px-3 py-2 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Excel
            </button>
            <button
              onClick={() => toast(`Generando documento PDF oficial de "${reportDef.title}" · Demo RTM`)}
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

      {/* Reportes Generales restantes con Vista Previa Coherente y Honesta */}
      {![
        'rep-situacion-financiera',
        'rep-estado-resultados',
        'rep-flujo-efectivo',
        'rep-antiguedad-cxc',
        'rep-antiguedad-cxp',
        'rep-activos-catalogo',
        'rep-depreciacion-periodo'
      ].includes(reportId) && (
        <GenericReportView reportDef={reportDef} period={period} toast={toast} />
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
// VISTA: REPORTE GENÉRICO / PLANTILLA PRELIMINAR (VISTA DEMOSTRATIVA)
// ----------------------------------------------------------------------------
interface ReportPreviewModel {
  kpis: { label: string; value: string; subtext: string }[];
  columns: string[];
  rows: (string | number)[][];
  sourceModules: string[];
}

const getReportPreviewModel = (
  reportId: string,
  title: string,
  category: string,
  period: string
): ReportPreviewModel => {
  switch (reportId) {
    case 'rep-ventas-periodo':
      return {
        kpis: [
          { label: 'Facturación Estimada', value: '$3,480,000', subtext: '+8.2% vs mes anterior' },
          { label: 'Margen Bruto Promedio', value: '38.4%', subtext: 'Línea Offset & Flexo combinada' },
          { label: 'Pedidos Entregados', value: '142 órdenes', subtext: '98.5% entrega a tiempo' },
        ],
        columns: ['Línea de Negocio', 'Familia', 'Facturación Mes Actual', 'Facturación Mes Anterior', 'Variación %', 'Margen %', 'Participación'],
        rows: [
          ['Offset Comercial', 'Catálogos y Folletos Farmacéuticos', '$1,850,000', '$1,720,000', '+7.5%', '39.2%', '53.2%'],
          ['Flexografía', 'Etiquetas BoPP y Térmico Directo', '$1,280,000', '$1,190,000', '+7.6%', '41.0%', '36.8%'],
          ['Empaque Plegadizo', 'Cajas Medicamento y Cosmético', '$350,000', '$305,000', '+14.8%', '34.5%', '10.0%'],
        ],
        sourceModules: ['Comercial / Cotizaciones', 'Facturación CFDI 4.0', 'Embarques'],
      };

    case 'rep-rentabilidad-cliente':
      return {
        kpis: [
          { label: 'Cuentas Clave Analizadas', value: '28 clientes', subtext: 'Top 80% facturación' },
          { label: 'Margen de Contribución', value: '41.2%', subtext: 'Promedio cartera activa' },
          { label: 'Cliente Mayor Volumen', value: 'Laboratorios Alpharma', subtext: '$780,000 facturados en el mes' },
        ],
        columns: ['Razón Social / Cliente', 'Segmento', 'Ventas Netas', 'Costo Estimado Producción', 'Margen Contribución', '% Margen', 'Clasificación'],
        rows: [
          ['Laboratorios Alpharma S.A. de C.V.', 'Farmacéutico', '$780,000', '$440,000', '$340,000', '43.6%', 'Tier A+'],
          ['Tyco Electronics México', 'Industrial / Arneses', '$590,000', '$360,000', '$230,000', '39.0%', 'Tier A'],
          ['Kimberly Clark de México', 'Consumo Masivo', '$420,000', '$255,000', '$165,000', '39.3%', 'Tier A'],
        ],
        sourceModules: ['Comercial / CRM', 'Costeo de Producción', 'Contabilidad'],
      };

    case 'rep-rentabilidad-producto':
      return {
        kpis: [
          { label: 'SKUs Fabricados', value: '86 artículos', subtext: 'Producción en planta RTM' },
          { label: 'Familia Más Rentable', value: 'Etiquetas BoPP Metalizado', subtext: '47.5% margen de contribución' },
          { label: 'Volumen Total Tirado', value: '1.85M piezas', subtext: 'Prensas Offset y Flexo' },
        ],
        columns: ['Familia de Artículo', 'Línea Productiva', 'Unidades Producidas', 'Precio Unitario Prom.', 'Costo Directo', 'Margen Bruto', 'Rentabilidad'],
        rows: [
          ['Folleto Prospecto 4x4', 'Offset Heidelberg', '450,000 pzas', '$1.45', '$0.88', '$0.57', '39.3%'],
          ['Etiqueta BoPP Metalizada', 'Flexo Mark Andy', '850,000 pzas', '$0.95', '$0.50', '$0.45', '47.4%'],
          ['Manual Grapado 32pp', 'Offset + Acabados', '85,000 pzas', '$8.20', '$5.10', '$3.10', '37.8%'],
        ],
        sourceModules: ['Piso de Producción', 'Recetas de Material', 'Catálogo de Productos'],
      };

    case 'rep-facturas-pendientes':
      return {
        kpis: [
          { label: 'Documentos Pendientes', value: '9 folios', subtext: 'Por conciliar o timbrar' },
          { label: 'Importe en Aclaración', value: '$186,400', subtext: 'Sujeto a complementos' },
          { label: 'Días Promedio Pendiente', value: '4.2 días', subtext: 'Dentro de umbral operativo' },
        ],
        columns: ['Folio Documento', 'Cliente / Proveedor', 'Fecha Emisión', 'Importe Total', 'Moneda', 'Motivo de Pendiente', 'Estatus'],
        rows: [
          ['FAC-2026-8912', 'Laboratorios Alpharma', '02/09/2026', '$78,400', 'MXN', 'Pendiente de aceptación portal cliente', 'En trámite'],
          ['FAC-2026-8915', 'Distribuidora Gráfica', '04/09/2026', '$45,000', 'MXN', 'Complemento de pago por timbrar', 'Por conciliar'],
          ['NC-2026-0045', 'Envases Farmacéuticos', '05/09/2026', '$12,300', 'MXN', 'Ajuste de volumen en revisión comercial', 'Aprobación'],
        ],
        sourceModules: ['Facturación CFDI', 'Cuentas por Cobrar', 'Tesorería'],
      };

    case 'rep-balanza-comprobacion':
      return {
        kpis: [
          { label: 'Cuentas con Movimiento', value: '118 cuentas', subtext: 'Catálogo contable activo' },
          { label: 'Sumas Iguales', value: '$28,450,120', subtext: 'Debe = Haber cuadrado riguroso' },
          { label: 'Estatus Validación', value: '100% Cuadrada', subtext: 'Sin descuadres de mayor' },
        ],
        columns: ['No. Cuenta', 'Nombre de la Cuenta', 'Saldo Inicial Deudor', 'Saldo Inicial Acreedor', 'Cargos del Mes', 'Abonos del Mes', 'Saldo Final'],
        rows: [
          ['1101-001', 'Bancos Nacionales (BBVA / Banorte)', '$1,850,000', '$0', '$3,420,000', '$2,980,000', '$2,290,000'],
          ['1105-001', 'Clientes Nacionales', '$3,150,000', '$0', '$3,480,000', '$3,210,000', '$3,420,000'],
          ['1150-001', 'Almacén de Materias Primas', '$1,920,000', '$0', '$1,450,000', '$1,290,000', '$2,080,000'],
        ],
        sourceModules: ['Pólizas de Diario, Ingresos y Egresos', 'Mayor General', 'Bancos'],
      };

    case 'rep-mayor-auxiliares':
      return {
        kpis: [
          { label: 'Pólizas Contabilizadas', value: '342 pólizas', subtext: 'Mes de ' + period },
          { label: 'Mayor Movimiento', value: 'Cuenta 1101 Bancos', subtext: '86 transacciones conciliadas' },
          { label: 'Auditoría Fiscal', value: 'SAT Conforme', subtext: 'Código agrupador integrado' },
        ],
        columns: ['Fecha', 'Póliza', 'Cuenta Contable', 'Concepto / Referencia', 'Debe (Cargo)', 'Haber (Abono)', 'Saldo Acumulado'],
        rows: [
          ['01/09/2026', 'PI-0901', '1101-001 Bancos', 'Cobranza Factura FAC-8901 Alpharma', '$150,000', '$0', '$2,000,000'],
          ['03/09/2026', 'PE-0904', '2101-001 Proveedores', 'Liquidación Factura Papelera del Norte', '$0', '$85,000', '$1,915,000'],
          ['05/09/2026', 'PD-0912', '5101-001 Sueldos Fabriles', 'Nómina 1ra Quincena Planta RTM', '$165,000', '$0', '$165,000'],
        ],
        sourceModules: ['Contabilidad General', 'Nómina', 'Tesorería'],
      };

    case 'rep-presupuesto-real':
      return {
        kpis: [
          { label: 'Presupuesto Operativo Mes', value: '$2,450,000', subtext: 'Aprobado para ' + period },
          { label: 'Gasto Real Ejercido', value: '$2,310,000', subtext: '94.3% de ejecución' },
          { label: 'Variación Favorable', value: '$140,000', subtext: 'Eficiencia en consumo de insumos' },
        ],
        columns: ['Centro de Costo', 'Responsable', 'Presupuesto Mensual', 'Gasto Real', 'Variación $', '% Ejercido', 'Semáforo'],
        rows: [
          ['CC-101 Offset Heidelberg', 'Ing. Roberto Méndez', '$680,000', '$655,000', '+$25,000', '96.3%', 'Dentro de rango'],
          ['CC-102 Flexo Mark Andy', 'Ing. Carlos Ortiz', '$540,000', '$520,000', '+$20,000', '96.3%', 'Dentro de rango'],
          ['CC-201 Mantenimiento Industrial', 'Ing. Saúl Estrada', '$180,000', '$168,000', '+$12,000', '93.3%', 'Excelente'],
        ],
        sourceModules: ['Centros de Costo', 'Contabilidad de Costos', 'Presupuestos'],
      };

    case 'rep-oc-abiertas':
      return {
        kpis: [
          { label: 'Órdenes de Compra Vigentes', value: '14 órdenes', subtext: 'En tránsito o suministro' },
          { label: 'Compromiso Financiero', value: '$520,000', subtext: 'Obligaciones estimadas de pago' },
          { label: 'Cumplimiento de Entrega', value: '92.8%', subtext: 'Lead time de proveedores' },
        ],
        columns: ['No. OC', 'Proveedor', 'Material / Descripción', 'Cantidad', 'Fecha Solicitada', 'Importe Estimado', 'Estatus Logístico'],
        rows: [
          ['OC-2026-0412', 'Papelera del Norte S.A.', 'Bobina Couché 130g (100cm)', '12,500 kg', '10/09/2026', '$185,000', 'En tránsito'],
          ['OC-2026-0415', 'Tintas y Barnices Gráficos', 'Tintas Offset Serie Escala Europa', '450 kg', '08/09/2026', '$72,000', 'Entrega parcial'],
          ['OC-2026-0419', 'Adhesivos Especializados', 'Película BoPP Transparente 50µm', '3,200 m²', '12/09/2026', '$94,000', 'Confirmada'],
        ],
        sourceModules: ['Compras & Abastecimiento', 'Recepción de Almacén', 'Cuentas por Pagar'],
      };

    case 'rep-compras-proveedor':
      return {
        kpis: [
          { label: 'Proveedores Activos', value: '36 empresas', subtext: 'Directorio calificado RTM' },
          { label: 'Top 3 Concentración', value: '58.4%', subtext: 'Papelera, Tintas y BoPP' },
          { label: 'Plazo Promedio de Pago', value: '38 días', subtext: 'Negociación comercial sana' },
        ],
        columns: ['Razón Social Proveedor', 'Giro / Insumo Principal', 'Facturas Recibidas', 'Compras Mes', 'Compras Acumuladas', 'Plazo Crédito', 'Desempeño'],
        rows: [
          ['Papelera del Norte S.A. de C.V.', 'Papel Couché y Bond', '12 facturas', '$480,000', '$3,920,000', '45 días', 'Aprobado A+'],
          ['Tintas y Barnices Gráficos', 'Tintas UV y Offset', '8 facturas', '$210,000', '$1,840,000', '30 días', 'Aprobado A'],
          ['Adhesivos Especializados', 'Sustratos Sintéticos y BoPP', '6 facturas', '$175,000', '$1,450,000', '30 días', 'Aprobado A'],
        ],
        sourceModules: ['Compras', 'Facturas de Proveedor', 'Control de Calidad MP'],
      };

    case 'rep-facturas-excepcion':
      return {
        kpis: [
          { label: 'Facturas en Discrepancia', value: '3 facturas', subtext: 'Detenidas por 3-Way Match' },
          { label: 'Monto en Aclaración', value: '$46,800', subtext: 'Diferencias precio/cantidad' },
          { label: 'Tiempo de Resolución', value: '48 horas', subtext: 'Acuerdo con compras' },
        ],
        columns: ['Factura Proveedor', 'Proveedor', 'OC Vinculada', 'Recepción Almacén', 'Diferencia Detectada', 'Importe Diferencia', 'Acción Requerida'],
        rows: [
          ['FP-78192', 'Papelera del Norte S.A.', 'OC-2026-0398', 'REC-0891', 'Precio unitario mayor al cotizado ($14.80 vs $14.20)', '$7,500', 'Solicitar nota de crédito'],
          ['FP-78204', 'Tintas y Barnices', 'OC-2026-0402', 'REC-0905', 'Faltante de 2 cubetas en báscula', '$4,200', 'Ajuste de remisión'],
          ['FP-78211', 'Empaques de Cartón', 'OC-2026-0409', 'REC-0912', 'Cargo no pactado por flete foráneo', '$3,100', 'Revisión comercial'],
        ],
        sourceModules: ['Recepción Almacén', 'Validación 3-Way Match', 'Cuentas por Pagar'],
      };

    case 'rep-valuacion-inventario':
      return {
        kpis: [
          { label: 'Valor en Libros Almacén', value: '$3,890,000', subtext: 'Materia prima, WIP y PT' },
          { label: 'Existencia Total', value: '412 SKUs', subtext: 'Inventario físico auditado' },
          { label: 'Método de Valuación', value: 'Costo Promedio', subtext: 'Norma contable NIF C-4' },
        ],
        columns: ['Clave Material', 'Descripción Insumo', 'Familia', 'Existencia', 'U.M.', 'Costo Promedio', 'Valor en Libros'],
        rows: [
          ['PAP-COU-130', 'Papel Couché 130g Brillante 100cm', 'Bobinas Papel', '24,500', 'kg', '$14.50', '$355,250'],
          ['BOPP-MET-35', 'Película BoPP Metalizada Plata', 'Sintéticos Flexo', '18,200', 'm²', '$8.40', '$152,880'],
          ['TIN-OFF-CYA', 'Tinta Offset Proceso Cyan Euro', 'Tintas y Químicos', '650', 'kg', '$120.00', '$78,000'],
        ],
        sourceModules: ['Módulo Inventarios', 'Kardex de Entradas/Salidas', 'Contabilidad'],
      };

    case 'rep-ajustes-inventario':
      return {
        kpis: [
          { label: 'Ajustes en el Mes', value: '5 incidencias', subtext: 'Conteo físico vs sistema' },
          { label: 'Merma Autorizada', value: '1.4%', subtext: 'Dentro del estándar industrial' },
          { label: 'Impacto Neto', value: '-$14,200', subtext: 'Ajuste contable aplicado' },
        ],
        columns: ['Folio Ajuste', 'Fecha', 'Almacén', 'Material Involucrado', 'Motivo del Ajuste', 'Cantidad Ajustada', 'Impacto Contable'],
        rows: [
          ['AJ-2026-0034', '02/09/2026', 'Almacén Flexo', 'Película BoPP Transparente', 'Merma técnica de calibración máquina', '-120 m²', '-$1,020'],
          ['AJ-2026-0035', '04/09/2026', 'Almacén Central', 'Couché 130g Bobina', 'Diferencia en pesaje de báscula', '-85 kg', '-$1,232'],
          ['AJ-2026-0036', '06/09/2026', 'Tintas y Químicos', 'Solvente Limpiador UV', 'Consumo operativo no registrado', '-15 L', '-$780'],
        ],
        sourceModules: ['Inventarios', 'Calidad en Piso', 'Mantenimiento'],
      };

    case 'rep-rotacion-inventario':
      return {
        kpis: [
          { label: 'Rotación General', value: '5.8 vueltas/año', subtext: 'Salud de inventarios RTM' },
          { label: 'Lento Movimiento', value: '8 artículos', subtext: '> 60 días sin consumo' },
          { label: 'Capital Paralizado', value: '$86,400', subtext: 'Sujeto a reaprovechamiento' },
        ],
        columns: ['Clave Insumo', 'Descripción Material', 'Días sin Movimiento', 'Último Movimiento', 'Stock Inmovilizado', 'Valor Estimado', 'Acción Recomendada'],
        rows: [
          ['PAP-SEG-90', 'Papel Bond Seguridad 90g Fibra Óptica', '84 días', '14/06/2026', '1,400 kg', '$32,200', 'Priorizar en orden Alpharma'],
          ['BOPP-TER-MAT', 'BoPP Térmico Especial Mate 30µm', '72 días', '26/06/2026', '2,800 m²', '$21,500', 'Reasignar a empaque cosmético'],
          ['TIN-PAN-ORANGE', 'Tinta Pantone Especial Orange 021', '65 días', '03/07/2026', '45 kg', '$9,450', 'Consumo en tiraje promocional'],
        ],
        sourceModules: ['Inventarios', 'Planificación de la Producción', 'Ventas'],
      };

    case 'rep-ciclo-documentos':
      return {
        kpis: [
          { label: 'Ciclo Promedio de Orden', value: '6.4 días', subtext: 'Desde pedido hasta remisión' },
          { label: 'Trazabilidad Digital', value: '100% enlazada', subtext: 'Cadena de custodia documental' },
          { label: 'Órdenes en Flujo', value: '34 órdenes', subtext: 'En diversas etapas del ciclo' },
        ],
        columns: ['Pedido Comercial', 'Orden Producción', 'Cliente', 'Liberación QA', 'Remisión Almacén', 'Factura CFDI', 'Cobranza'],
        rows: [
          ['PED-2026-1042', 'OP-2026-95248', 'Laboratorios Alpharma', 'Aprobado QA', 'REM-2026-8812', 'FAC-2026-8912', 'Pendiente crédito'],
          ['PED-2026-1044', 'OP-2026-95250', 'Tyco Electronics', 'En proceso QA', 'Por generar', 'Por timbrar', 'Por vencer'],
          ['PED-2026-1048', 'OP-2026-95252', 'Kimberly Clark', '1ra pieza OK', 'En producción', 'Programada', 'Por vencer'],
        ],
        sourceModules: ['Comercial', 'Piso Producción', 'Calidad QA', 'Facturación'],
      };

    case 'rep-capex-presupuesto':
      return {
        kpis: [
          { label: 'Presupuesto CAPEX 2026', value: '$2,800,000', subtext: 'Aprobado por Dirección General' },
          { label: 'Ejercido Acumulado', value: '$1,940,000', subtext: '69.3% del presupuesto anual' },
          { label: 'Saldo Disponible', value: '$860,000', subtext: 'Para proyectos de 4Q 2026' },
        ],
        columns: ['Proyecto de Inversión', 'Área Destino', 'Presupuesto Asignado', 'Comprometido', 'Ejercido Pagado', 'Saldo Disponible', 'Avance Físico'],
        rows: [
          ['Modernización Guillotina Polar', 'Acabados Planta', '$650,000', '$0', '$620,000', '$30,000', '100% Concluido'],
          ['Renovación Lámparas UV Flexo', 'Flexografía', '$380,000', '$45,000', '$310,000', '$25,000', '90% En pruebas'],
          ['Subestación Eléctrica Nave 2', 'Instalaciones RTM', '$850,000', '$120,000', '$580,000', '$150,000', '75% En ejecución'],
        ],
        sourceModules: ['Activos Fijos', 'Tesorería', 'Ingeniería y Proyectos'],
      };

    case 'rep-mantenimiento-activo':
      return {
        kpis: [
          { label: 'Gasto Mantenimiento Mes', value: '$118,500', subtext: 'Preventivo y correctivo' },
          { label: 'Máquinas Atendidas', value: '14 máquinas', subtext: 'Prensas y equipos de acabado' },
          { label: 'Ratio Preventivo / Correctivo', value: '82% / 18%', subtext: 'Cumplimiento plan de mantenimiento' },
        ],
        columns: ['Clave Activo', 'Nombre del Equipo', 'Área Fabril', 'Mtto. Preventivo', 'Mtto. Correctivo', 'Refacciones', 'Gasto Total Mes'],
        rows: [
          ['ACT-001', 'Prensa Heidelberg Speedmaster CD 102', 'Offset', '$24,500', '$6,200', '$14,000', '$44,700'],
          ['ACT-002', 'Prensa Mark Andy 2200-1 (8 colores)', 'Flexografía', '$18,200', '$0', '$8,500', '$26,700'],
          ['ACT-004', 'Guillotina Polar Mohr 137 ED', 'Acabados', '$8,500', '$0', '$3,200', '$11,700'],
        ],
        sourceModules: ['Mantenimiento Industrial', 'Inventario de Refacciones', 'Activos Fijos'],
      };

    default:
      return {
        kpis: [
          { label: 'Registros Estimados', value: '45 registros', subtext: 'En el período consultado' },
          { label: 'Frecuencia de Corte', value: 'Mensual', subtext: 'Cierre contable ' + period },
          { label: 'Estado de Integración', value: 'Plantilla Oficial', subtext: 'Listo para poblar con BD' },
        ],
        columns: ['Clave / Folio', 'Concepto Principal', 'Referencia Operativa', 'Área / Centro de Costo', 'Importe Estimado', 'Estatus'],
        rows: [
          ['REG-001', title + ' - Muestra A', 'Ref. Op. 95248', 'Planta RTM', '$124,500', 'Vigente'],
          ['REG-002', title + ' - Muestra B', 'Ref. Op. 95250', 'Planta RTM', '$89,200', 'Vigente'],
          ['REG-003', title + ' - Muestra C', 'Ref. Op. 95252', 'Planta RTM', '$45,100', 'Vigente'],
        ],
        sourceModules: ['Módulos Operativos RTM', 'Contabilidad', 'Tesorería'],
      };
  }
};

const GenericReportView: React.FC<{
  reportDef: any;
  period: string;
  toast: (msg: string) => void;
}> = ({ reportDef, period, toast }) => {
  const previewModel = getReportPreviewModel(
    reportDef.id,
    reportDef.title,
    reportDef.category,
    period
  );

  return (
    <div className="space-y-6">
      {/* Banner Superior Prominente: Vista Demostrativa */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:border-amber-500/20 dark:bg-amber-500/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300">
                Vista demostrativa
              </span>
              <span className="text-xs font-bold text-theme-main">
                Plantilla de reporte preliminar · En integración
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-1 max-w-2xl leading-relaxed">
              Los datos y exportables finales se generarán automáticamente con la información real registrada en los módulos de RTM ({previewModel.sourceModules.join(', ')}). A continuación se presenta la estructura de columnas y dimensiones oficiales que adoptará este informe.
            </p>
          </div>
        </div>

        {/* Botones Excel y PDF Demo con Toast */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() =>
              toast(
                `Exportable Excel (XLSX) de muestra para "${reportDef.title}" · Disponible con datos productivos de RTM`
              )
            }
            className="px-3 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Descargar Excel Demo
          </button>
          <button
            type="button"
            onClick={() =>
              toast(
                `Vista previa PDF de muestra para "${reportDef.title}" · Formato institucional en integración`
              )
            }
            className="px-3 py-1.5 rounded-xl border border-theme-subtle bg-theme-surface text-xs font-bold text-theme-main hover:border-theme-primary/40 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            PDF Demo
          </button>
        </div>
      </div>

      {/* Tarjetas de Proyección de Métricas Coherentes con el Reporte */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {previewModel.kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-theme-muted block">{kpi.label}</span>
            <b className="font-mono text-xl text-theme-main block mt-1">{kpi.value}</b>
            <span className="text-[11px] text-theme-muted block mt-0.5">{kpi.subtext}</span>
          </div>
        ))}
      </div>

      {/* Contenedor Tabular con Columnas Específicas y Filas de Muestra */}
      <div className="rounded-3xl border border-theme-subtle bg-theme-surface overflow-hidden shadow-xs">
        <div className="p-5 border-b border-theme-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-theme-main">
                Estructura Tabular Oficial: {reportDef.title}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-muted/30 text-theme-muted">
                {period}
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">
              Campos, dimensiones y agrupaciones estandarizadas para consulta y descarga ejecutiva.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
              3 registros de muestra
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-theme-muted/30 text-[10px] uppercase text-theme-muted">
              <tr>
                {previewModel.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`p-3 text-left ${idx === previewModel.columns.length - 1 ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {previewModel.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-theme-muted/10 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-3 text-theme-main ${cIdx === 0 ? 'font-bold' : ''} ${
                        cIdx === row.length - 1 ? 'text-right font-mono font-bold text-theme-primary' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Informativo */}
        <div className="p-4 bg-theme-muted/10 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between text-[11px] text-theme-muted gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>
              Información en modo plantilla · Al conectar datos productivos de RTM se poblarán todos los folios y movimientos correspondientes.
            </span>
          </div>
          <span className="font-bold text-theme-main">
            Frecuencia programada: {reportDef.frequency}
          </span>
        </div>
      </div>

      {/* Módulos de Origen Integrados */}
      <div className="p-5 rounded-2xl border border-dashed border-theme-subtle bg-theme-surface/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-theme-primary/10 text-theme-primary shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-theme-main block">Módulos de Origen Integrados</span>
            <span className="text-[11px] text-theme-muted">
              Este reporte consumirá en tiempo real los registros de: {previewModel.sourceModules.join(' · ')}
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-theme-muted block">Destinatario Principal</span>
          <span className="text-xs font-bold text-theme-primary">
            {reportDef.targetRole || 'Finanzas & Contraloría'}
          </span>
        </div>
      </div>
    </div>
  );
};
