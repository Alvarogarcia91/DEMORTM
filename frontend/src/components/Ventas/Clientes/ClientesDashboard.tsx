import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  FileText,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { SalesCustomer } from '../../../data/mockSalesData';
import {
  formatCurrencyMXN,
  formatKpiCurrency,
  formatPercentage,
} from '../../../utils/formatters';

interface ClientesDashboardProps {
  customers: SalesCustomer[];
  onOpenQuickForm: () => void;
  onNavigateToList: () => void;
  onOpenDetail: (customer: SalesCustomer) => void;
}

export const ClientesDashboard: React.FC<ClientesDashboardProps> = ({
  customers,
  onOpenQuickForm,
  onNavigateToList,
  onOpenDetail,
}) => {
  const [branchFilter, setBranchFilter] = useState('all');

  const filteredCustomers = customers.filter((c) => {
    if (branchFilter !== 'all' && c.preferredBranch !== branchFilter) return false;
    return true;
  });

  const totalActiveCustomers = filteredCustomers.length;
  const newCustomersCount = filteredCustomers.filter((c) => c.totalOrdersCount <= 1).length;
  const recurringCustomersCount = filteredCustomers.filter((c) => c.totalOrdersCount > 1).length;
  const totalSpent = filteredCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgTicketCustomer = totalActiveCustomers > 0 ? totalSpent / totalActiveCustomers : 0;

  const voCustomers = filteredCustomers.filter((c) => c.preferredBranch === 'wh-suc-valle-oriente');
  const cumbresCustomers = filteredCustomers.filter((c) => c.preferredBranch === 'wh-suc-cumbres');

  const topSalesCustomers = [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Sucursal:</span>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="p-2 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold shadow-2xs focus:outline-none"
        >
          <option value="all">Todas las sucursales</option>
          <option value="wh-suc-valle-oriente">Sucursal Valle Oriente</option>
          <option value="wh-suc-cumbres">Sucursal Cumbres</option>
        </select>
      </div>

      {/* KPIs 6 Grid (100% White + Semantic Borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Clientes Activos</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{totalActiveCustomers}</span>
          <span className="text-[10px] text-zinc-500">Cartera registrada</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Nuevos (Mes)</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{newCustomersCount}</span>
          <span className="text-[10px] text-emerald-600 font-bold">+2 nuevas altas</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Recurrentes</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">{recurringCustomersCount}</span>
          <span className="text-[10px] text-purple-600 font-bold">Recompra activa</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Con Cotización</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {filteredCustomers.filter((c) => c.totalQuotesCount > 0).length}
          </span>
          <span className="text-[10px] text-zinc-500">En seguimiento</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Con Pedido</span>
          <span className="text-2xl font-black font-mono text-zinc-900 block">
            {filteredCustomers.filter((c) => c.totalOrdersCount > 0).length}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">Compradores activos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Ticket Promedio</span>
          <span className="text-lg font-black font-mono text-zinc-900 block truncate" title={formatCurrencyMXN(avgTicketCustomer, false)}>
            {formatCurrencyMXN(avgTicketCustomer, false)}
          </span>
          <span className="text-[10px] text-zinc-500">Valor promedio de cuenta</span>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
            <span>Top Clientes por Facturación</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </h3>

          <div className="space-y-2 text-xs">
            {topSalesCustomers.map((cust, idx) => (
              <div
                key={cust.id}
                onClick={() => onOpenDetail(cust)}
                className="p-3 rounded-xl bg-white border border-zinc-200 hover:border-rose-500 shadow-2xs flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-zinc-100 font-black text-[11px] text-zinc-800 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-900 block">{cust.name}</span>
                    <span className="text-[10px] text-zinc-500">{cust.type} &bull; {cust.preferredBranchName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-rose-600 block">
                    {formatCurrencyMXN(cust.totalSpent, false)}
                  </span>
                  <span className="text-[10px] text-zinc-500">{cust.totalOrdersCount} pedidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center justify-between">
            <span>Distribución de Cartera por Sucursal</span>
            <Building2 className="w-4 h-4 text-zinc-400" />
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Sucursal Valle Oriente</span>
                <span className="font-mono">{voCustomers.length} clientes</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${(voCustomers.length / totalActiveCustomers) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-600">
                <span>Facturado: <strong className="font-mono">{formatCurrencyMXN(voCustomers.reduce((acc, c) => acc + c.totalSpent, 0), false)}</strong></span>
                <span className="text-emerald-600 font-bold">58% de cartera</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Sucursal Cumbres</span>
                <span className="font-mono">{cumbresCustomers.length} clientes</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(cumbresCustomers.length / totalActiveCustomers) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-600">
                <span>Facturado: <strong className="font-mono">{formatCurrencyMXN(cumbresCustomers.reduce((acc, c) => acc + c.totalSpent, 0), false)}</strong></span>
                <span className="text-purple-600 font-bold">42% de cartera</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToList}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Ver listado completo de clientes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
