import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { SalesInvoice, AccountReceivable, SupplierInvoice } from '../../data/mockFinanzasData';
import { AccountingReportsWorkspace } from './AccountingReportsWorkspace';
import { TreasuryWorkspace } from './TreasuryWorkspace';
import { BudgetWorkspace } from './BudgetWorkspace';
import { FinancialDashboard } from './FinancialDashboard';

export type FinanceArea =
  | 'dashboard'
  | 'treasury'
  | 'accounting'
  | 'budgets'
  | 'assets'
  | 'reports'
  | 'contabilidad-reportes';

interface FinanceWorkspaceProps {
  area: FinanceArea;
  salesInvoices: SalesInvoice[];
  cxc: AccountReceivable[];
  cxp: SupplierInvoice[];
  onNavigateToInvoice?: (folio: string) => void;
  onNavigateToMaintenance?: (machineCode: string) => void;
}

const mx = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const FinanceWorkspace: React.FC<FinanceWorkspaceProps> = ({
  area,
  salesInvoices,
  cxc,
  cxp,
  onNavigateToInvoice,
  onNavigateToMaintenance
}) => {
  const [period, setPeriod] = useState('Mes actual');
  const [toast, setToast] = useState('');

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

  // Si la ruta es el workspace unificado Contabilidad & Reportes (o sus accesos directos heredados)
  if (area === 'contabilidad-reportes') {
    return (
      <AccountingReportsWorkspace
        initialTab="resumen"
        salesInvoices={salesInvoices}
        cxc={cxc}
        cxp={cxp}
        onNavigateToInvoice={onNavigateToInvoice}
        onNavigateToMaintenance={onNavigateToMaintenance}
      />
    );
  }

  if (area === 'accounting') {
    return (
      <AccountingReportsWorkspace
        initialTab="contabilidad"
        salesInvoices={salesInvoices}
        cxc={cxc}
        cxp={cxp}
        onNavigateToInvoice={onNavigateToInvoice}
        onNavigateToMaintenance={onNavigateToMaintenance}
      />
    );
  }

  if (area === 'assets') {
    return (
      <AccountingReportsWorkspace
        initialTab="activos"
        salesInvoices={salesInvoices}
        cxc={cxc}
        cxp={cxp}
        onNavigateToInvoice={onNavigateToInvoice}
        onNavigateToMaintenance={onNavigateToMaintenance}
      />
    );
  }

  if (area === 'reports') {
    return (
      <AccountingReportsWorkspace
        initialTab="reportes"
        salesInvoices={salesInvoices}
        cxc={cxc}
        cxp={cxp}
        onNavigateToInvoice={onNavigateToInvoice}
        onNavigateToMaintenance={onNavigateToMaintenance}
      />
    );
  }

  const titles: Record<string, [string, string]> = {
    dashboard: ['Dashboard Financiero', 'Liquidez, cartera, obligaciones, rentabilidad y desempeño financiero.'],
    treasury: ['Tesorería & Bancos', 'Posición, pagos, conciliación y flujo de caja.'],
    budgets: ['Presupuestos', 'Planeación y consumo por centro de costo.']
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-widest text-theme-primary">FINANZAS · RTM</p>
          <h1 className="text-2xl font-black">{titles[area] ? titles[area][0] : 'Finanzas'}</h1>
          <p className="text-xs text-theme-muted">{titles[area] ? titles[area][1] : ''}</p>
        </div>

        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setToast('Periodo actualizado · Datos demostrativos');
            }}
            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs"
          >
            {['Hoy', 'Semana', 'Mes actual', 'Últimos 3 meses', 'Año actual'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <button
            onClick={() => setToast('Exportación preparada · Demo')}
            className="flex gap-1 rounded-xl border border-theme-subtle px-3 py-2 text-xs font-bold"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex justify-between rounded-xl border border-emerald-300 bg-theme-surface p-3 text-xs">
          <span>{toast}</span>
          <button onClick={() => setToast('')}>Cerrar</button>
        </div>
      )}

      {area === 'dashboard' && (
        <FinancialDashboard d={d} cxc={cxc} cxp={cxp} onToast={setToast} />
      )}
      {area === 'treasury' && (
        <TreasuryWorkspace cxc={cxc} cxp={cxp} toast={setToast} />
      )}
      {area === 'budgets' && (
        <BudgetWorkspace toast={(text) => setToast(text)} />
      )}
    </div>
  );
};
