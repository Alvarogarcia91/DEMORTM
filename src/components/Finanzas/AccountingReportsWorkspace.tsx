import React, { useState, useMemo } from 'react';
import {
  FileText,
  Building2,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  Download,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { SalesInvoice, AccountReceivable, SupplierInvoice } from '../../data/mockFinanzasData';
import {
  MOCK_BALANCE_SHEET,
  MOCK_INCOME_STATEMENT,
  INITIAL_FIXED_ASSETS
} from '../../data/mockAccountingReportsData';
import { AccountingGeneral } from './AccountingGeneral';
import { AssetsWorkspace } from './AssetsWorkspace';
import { FinancialReports } from './FinancialReports';

interface AccountingReportsWorkspaceProps {
  initialTab?: 'resumen' | 'contabilidad' | 'activos' | 'reportes' | 'cierre';
  salesInvoices: SalesInvoice[];
  cxc: AccountReceivable[];
  cxp: SupplierInvoice[];
  onNavigateToInvoice?: (folio: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const AccountingReportsWorkspace: React.FC<AccountingReportsWorkspaceProps> = ({
  initialTab = 'resumen',
  salesInvoices,
  cxc,
  cxp,
  onNavigateToInvoice,
  onNavigateToMaintenance
}) => {
  const [tab, setTab] = useState<'resumen' | 'contabilidad' | 'activos' | 'reportes' | 'cierre'>(initialTab);
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Datos financieros calculados y consistentes
  const d = useMemo(() => {
    const income = salesInvoices.reduce((s, x) => s + x.total, 0) || 3850000;
    const ar = cxc.reduce((s, x) => s + x.saldoPendiente, 0) || 1280450;
    const ap = cxp.reduce((s, x) => s + x.saldoPendiente, 0) || 1840650;
    const overdue = cxc.filter((x) => x.status === 'vencida').reduce((s, x) => s + x.saldoPendiente, 0);
    return {
      income,
      ar,
      ap,
      overdue,
      cash: 1485200,
      expenses: ap * 0.42 + 128460
    };
  }, [salesInvoices, cxc, cxp]);

  const balance = MOCK_BALANCE_SHEET;
  const pnl = MOCK_INCOME_STATEMENT;

  // Cierre mensual checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Conciliación de Bancos y Tesorería', completed: true, detail: 'Cuenta Operativa Banorte y BBVA conciliadas al centavo ($1,485,200)' },
    { id: 'c2', label: 'Cuentas por Cobrar (CxC) conciliadas con Mayor', completed: true, detail: 'Cartera comercial por $1,280,450 verificada sin partidas en tránsito' },
    { id: 'c3', label: 'Cuentas por Pagar (CxP) y 3-Way Match validados', completed: true, detail: 'Facturas de proveedores conciliadas con recepción de almacén' },
    { id: 'c4', label: 'Depreciación Fabril y Ordinaria Contabilizada', completed: true, detail: 'Póliza PDF-2026-009 ($115,400) generada y aplicada a costos y gastos' },
    { id: 'c5', label: 'Valuación de Inventarios y Mermas de Producción', completed: true, detail: 'Corte de almacén de materia prima, WIP y PT ($2,450,000)' },
    { id: 'c6', label: 'Provisiones de Nómina e Impuestos (IMSS / SAT)', completed: false, detail: 'Pendiente confirmación de retenciones ISR nómina semanal' },
    { id: 'c7', label: 'Balanza de Comprobación Cuadrada al 100%', completed: true, detail: 'Total Cargos = Total Abonos ($14,760,150)' }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    showToast('Estado de tarea de cierre actualizado');
  };

  const completedCount = checklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 text-white shadow-2xl border border-zinc-700 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-theme-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-theme-primary uppercase">
              FINANZAS & CONTROL CORPORATIVO · RTM
            </span>
            <span className="text-xs text-theme-muted">· Ejercicio 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-theme-main tracking-tight">
            Contabilidad & Reportes
          </h1>
          <p className="text-xs text-theme-muted mt-1 max-w-2xl">
            Gestión contable integral, control patrimonial de activos fijos, estados financieros auditados y cierre de periodo.
          </p>
        </div>

        {/* Tabs Principales */}
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-theme-muted/40 w-fit overflow-x-auto">
          {[
            { key: 'resumen', label: 'Resumen' },
            { key: 'contabilidad', label: 'Contabilidad' },
            { key: 'activos', label: 'Activos Fijos' },
            { key: 'reportes', label: 'Reportes' },
            { key: 'cierre', label: 'Cierre' }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                tab === t.key
                  ? 'bg-theme-surface text-theme-main shadow-xs'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: RESUMEN EJECUTIVO */}
      {tab === 'resumen' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Fila 1: KPIs Ejecutivos Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Activo Total</span>
              <b className="font-mono text-base text-theme-main block mt-1">{mx(balance.summary.totalAssets)}</b>
              <span className="text-[10px] text-emerald-600 font-bold">100% Cuadrado</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Pasivo Total</span>
              <b className="font-mono text-base text-theme-main block mt-1">{mx(balance.summary.totalLiabilities)}</b>
              <span className="text-[10px] text-theme-muted">Proveedores y créditos</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Capital Contable</span>
              <b className="font-mono text-base text-emerald-600 block mt-1">{mx(balance.summary.totalEquity)}</b>
              <span className="text-[10px] text-theme-muted">Patrimonio neto</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Activo Fijo Neto</span>
              <b className="font-mono text-base text-theme-primary block mt-1">{mx(balance.summary.fixedAssetsNet)}</b>
              <span className="text-[10px] text-theme-muted">20 máquinas RTM</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Deprec. Mes</span>
              <b className="font-mono text-base text-theme-main block mt-1">{mx(115400)}</b>
              <span className="text-[10px] text-theme-muted">Póliza PDF-2026-009</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Utilidad Operativa</span>
              <b className="font-mono text-base text-theme-main block mt-1">{mx(pnl.totals.operatingProfit)}</b>
              <span className="text-[10px] text-emerald-600 font-bold">{pnl.totals.operatingMarginPct}% margen</span>
            </div>

            <div className="p-4 rounded-2xl border border-theme-subtle bg-theme-surface shadow-2xs col-span-2 lg:col-span-1">
              <span className="text-[10px] font-black uppercase text-theme-muted block">Cierre Mensual</span>
              <b className="font-mono text-base text-amber-600 block mt-1">{completedCount} de 7 tareas</b>
              <span className="text-[10px] text-amber-600 font-bold">En proceso de cierre</span>
            </div>
          </div>

          {/* Fila 2: Cuadrante de Navegación Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta 1: Acceso a Reportes Clave */}
            <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-theme-main">Estados Financieros</h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Consulta el Balance General, Estado de Resultados y Flujo de Efectivo con trazabilidad hasta el comprobante fiscal.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-theme-subtle">
                <button
                  onClick={() => setTab('reportes')}
                  className="w-full flex items-center justify-between text-xs font-bold text-theme-primary hover:underline"
                >
                  <span>Abrir Estado de Situación Financiera</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTab('reportes')}
                  className="w-full flex items-center justify-between text-xs font-bold text-theme-primary hover:underline"
                >
                  <span>Abrir Estado de Resultados (P&L)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Acceso a Activos Fijos */}
            <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-theme-main">Control de Activos Fijos</h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Padrón de 20 máquinas de planta RTM por $14.8M de costo histórico y $8.9M de valor neto en libros.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-theme-subtle">
                <button
                  onClick={() => setTab('activos')}
                  className="w-full flex items-center justify-between text-xs font-bold text-emerald-600 hover:underline"
                >
                  <span>Gestionar inventario de maquinaria</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTab('activos')}
                  className="w-full flex items-center justify-between text-xs font-bold text-emerald-600 hover:underline"
                >
                  <span>Ver póliza mensual de depreciación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tarjeta 3: Estado de Cierre y Balanza */}
            <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-theme-main">Cierre Contable Mensual</h3>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                  Balanza de comprobación cuadrada al 100%. 6 de 7 controles de cierre verificados para Septiembre 2026.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-theme-subtle">
                <button
                  onClick={() => setTab('cierre')}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-600 hover:underline"
                >
                  <span>Revisar checklist de cierre</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTab('contabilidad')}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-600 hover:underline"
                >
                  <span>Ver Balanza de Comprobación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONTABILIDAD GENERAL */}
      {tab === 'contabilidad' && (
        <div className="animate-fadeIn">
          <AccountingGeneral d={d} toast={showToast} />
        </div>
      )}

      {/* TAB: ACTIVOS FIJOS */}
      {tab === 'activos' && (
        <div className="animate-fadeIn">
          <AssetsWorkspace
            toast={showToast}
            onNavigateToMaintenance={onNavigateToMaintenance}
          />
        </div>
      )}

      {/* TAB: REPORTES FINANCIEROS (CARDS & VIEWER) */}
      {tab === 'reportes' && (
        <div className="animate-fadeIn">
          <FinancialReports
            cxc={cxc}
            cxp={cxp}
            toast={showToast}
            onNavigateToAsset={(assetId) => {
              setTab('activos');
            }}
            onNavigateToMaintenance={onNavigateToMaintenance}
            onNavigateToInvoice={onNavigateToInvoice}
          />
        </div>
      )}

      {/* TAB: CIERRE CONTABLE MENSUAL */}
      {tab === 'cierre' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl border border-theme-subtle bg-theme-surface space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-theme-subtle">
              <div>
                <h3 className="font-bold text-base text-theme-main">Checklist Operativo de Cierre Mensual</h3>
                <p className="text-xs text-theme-muted">
                  Septiembre 2026 · Validaciones cruzadas entre Tesorería, Almacén, Producción y Mayor Contable.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-theme-main">
                  Progreso: {Math.round((completedCount / checklist.length) * 100)}%
                </span>
                <div className="w-32 h-2.5 rounded-full bg-theme-muted/20 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    item.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-theme-surface border-theme-subtle hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-theme-muted bg-theme-surface'
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <b className={`text-xs block ${item.completed ? 'text-emerald-900 dark:text-emerald-300' : 'text-theme-main'}`}>
                        {item.label}
                      </b>
                      <small className="text-theme-muted text-[11px] block mt-0.5">{item.detail}</small>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      item.completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {item.completed ? 'Validado' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-xs text-theme-muted">
                Al completar el checklist, se podrá emitir el cierre formal del ejercicio y candados de edición.
              </span>
              <button
                onClick={() => showToast('Simulación de cierre registrada en bitácora · Balanza resguardada')}
                className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary/90 transition-colors shadow-xs"
              >
                Ejecutar Simulación de Cierre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
