import React, { useState, useMemo } from 'react';
import {
  Building2, Search, Phone, Mail, User, DollarSign,
  TrendingUp, FileText, ShoppingBag, Clock, CheckCircle2,
  AlertTriangle, Calendar, ChevronRight, ArrowUpRight,
  ShieldCheck, Award, Layers
} from 'lucide-react';
import { CrmOpportunity, CrmActivity, formatMxn } from '../../../data/mockCrmData';

interface CrmAccounts360Props {
  customers: any[];
  opportunities: CrmOpportunity[];
  activities: CrmActivity[];
  quotes?: any[];
  orders?: any[];
  onSelectOpportunity: (opportunity: CrmOpportunity) => void;
  onOpenQuote?: (quoteId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const CrmAccounts360: React.FC<CrmAccounts360Props> = ({
  customers,
  opportunities,
  activities,
  quotes = [],
  orders = [],
  onSelectOpportunity,
  onOpenQuote,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers.length > 0 ? String(customers[0].id) : ''
  );
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'opportunities' | 'activities' | 'quotes' | 'orders'>('timeline');

  // Filter customers list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const name = (c.nombre || c.name || c.razonSocial || '').toLowerCase();
      const code = (c.codigo || c.code || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
    });
  }, [customers, searchTerm]);

  // Current active customer object
  const currentCustomer = useMemo(() => {
    return customers.find((c) => String(c.id) === selectedCustomerId) || customers[0] || null;
  }, [customers, selectedCustomerId]);

  const customerName = currentCustomer
    ? currentCustomer.nombre || currentCustomer.name || currentCustomer.razonSocial || 'Cuenta'
    : '';

  // Account opportunities
  const accountOpportunities = useMemo(() => {
    if (!customerName) return [];
    return opportunities.filter(
      (o) => o.account.toLowerCase().includes(customerName.toLowerCase()) ||
             customerName.toLowerCase().includes(o.account.toLowerCase())
    );
  }, [opportunities, customerName]);

  // Account activities
  const accountActivities = useMemo(() => {
    if (!customerName) return [];
    return activities.filter(
      (a) => a.account.toLowerCase().includes(customerName.toLowerCase()) ||
             customerName.toLowerCase().includes(a.account.toLowerCase())
    );
  }, [activities, customerName]);

  // Account quotes
  const accountQuotes = useMemo(() => {
    if (!customerName) return [];
    return quotes.filter(
      (q) => (q.cliente || q.customer || '').toLowerCase().includes(customerName.toLowerCase())
    );
  }, [quotes, customerName]);

  // Account orders
  const accountOrders = useMemo(() => {
    if (!customerName) return [];
    return orders.filter(
      (o) => (o.cliente || o.customer || '').toLowerCase().includes(customerName.toLowerCase())
    );
  }, [orders, customerName]);

  // Financial aggregates
  const accountKpis = useMemo(() => {
    const activePipeline = accountOpportunities
      .filter((o) => o.stage !== 'Ganada' && o.stage !== 'Perdida')
      .reduce((sum, o) => sum + o.amount, 0);

    const wonTotal = accountOpportunities
      .filter((o) => o.stage === 'Ganada')
      .reduce((sum, o) => sum + o.amount, 0);

    const closedCount = accountOpportunities.filter((o) => o.stage === 'Ganada' || o.stage === 'Perdida').length;
    const wonCount = accountOpportunities.filter((o) => o.stage === 'Ganada').length;
    const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 65;

    // Simulated / fallback billed if orders exist
    const ordersTotal = accountOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const historicalRevenue = ordersTotal > 0 ? ordersTotal : (wonTotal > 0 ? wonTotal : 1850000);

    return {
      activePipeline,
      wonTotal,
      historicalRevenue,
      winRate,
      oppCount: accountOpportunities.length,
      quoteCount: accountQuotes.length,
      orderCount: accountOrders.length,
    };
  }, [accountOpportunities, accountQuotes, accountOrders]);

  if (!currentCustomer) {
    return (
      <div className="bg-theme-card border border-theme-subtle rounded-xl p-12 text-center text-theme-muted">
        <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-sm">No hay cuentas disponibles en el sistema</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2-Column Layout: Account Directory (Left) + 360 Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Accounts Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-theme-card border border-theme-subtle rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-theme-primary flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" /> Directorio de Cuentas
              </h3>
              <span className="text-[10px] text-theme-muted font-mono">{filteredCustomers.length} cuentas</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                placeholder="Buscar por cliente o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-theme-base border border-theme-subtle rounded-lg text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* List */}
            <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1">
              {filteredCustomers.map((cust) => {
                const name = cust.nombre || cust.name || cust.razonSocial;
                const isSelected = String(cust.id) === String(currentCustomer.id);
                const custOpps = opportunities.filter((o) =>
                  o.account.toLowerCase().includes(name.toLowerCase())
                );
                const activeTotal = custOpps
                  .filter((o) => o.stage !== 'Ganada' && o.stage !== 'Perdida')
                  .reduce((sum, o) => sum + o.amount, 0);

                return (
                  <button
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(String(cust.id))}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between group ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-900 dark:text-purple-200 shadow-xs'
                        : 'bg-theme-base border-theme-subtle hover:bg-theme-card hover:border-purple-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="font-bold block truncate text-theme-primary group-hover:text-purple-600 transition-colors">
                        {name}
                      </span>
                      <span className="text-[10px] text-theme-muted font-mono block">
                        {cust.codigo || cust.rfc || 'CLI-00' + cust.id} · {cust.tipo || 'Industrial'}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      {activeTotal > 0 ? (
                        <span className="text-[11px] font-mono font-bold text-emerald-600 block">
                          {formatMxn(activeTotal)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-theme-muted block font-mono">Sin pipe</span>
                      )}
                      <span className="text-[9px] text-theme-muted block">
                        {custOpps.length} opp{custOpps.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Account 360 Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Account Banner */}
          <div className="bg-theme-card border border-theme-subtle rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-theme-primary">{customerName}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Tier 1 OEM
                    </span>
                  </div>
                  <p className="text-xs text-theme-muted mt-0.5">
                    {currentCustomer.codigo || 'RFC: ' + (currentCustomer.rfc || 'XAXX010101000')} · {currentCustomer.direccion || 'Querétaro, Qro.'}
                  </p>
                </div>
              </div>

              {/* Quick Contacts Actions */}
              <div className="flex items-center gap-2">
                {currentCustomer.telefono && (
                  <a
                    href={`tel:${currentCustomer.telefono}`}
                    className="p-2 bg-theme-base border border-theme-subtle hover:text-purple-600 rounded-lg text-xs flex items-center gap-1 text-theme-muted transition-colors"
                    title={currentCustomer.telefono}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Llamar</span>
                  </a>
                )}
                {currentCustomer.email && (
                  <a
                    href={`mailto:${currentCustomer.email}`}
                    className="p-2 bg-theme-base border border-theme-subtle hover:text-purple-600 rounded-lg text-xs flex items-center gap-1 text-theme-muted transition-colors"
                    title={currentCustomer.email}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Correo</span>
                  </a>
                )}
              </div>
            </div>

            {/* 4 Financial & Pipeline KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-theme-subtle text-xs">
              <div className="p-3 bg-theme-base rounded-xl border border-theme-subtle">
                <span className="text-theme-muted block text-[11px]">Facturado Histórico</span>
                <span className="text-base font-bold font-mono text-theme-primary block mt-0.5">
                  {formatMxn(accountKpis.historicalRevenue)}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">Cartera sana</span>
              </div>

              <div className="p-3 bg-theme-base rounded-xl border border-theme-subtle">
                <span className="text-theme-muted block text-[11px]">Pipeline en Negociación</span>
                <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400 block mt-0.5">
                  {formatMxn(accountKpis.activePipeline)}
                </span>
                <span className="text-[10px] text-purple-500 font-mono mt-0.5 block">
                  {accountOpportunities.filter((o) => o.stage !== 'Ganada' && o.stage !== 'Perdida').length} proyectos activos
                </span>
              </div>

              <div className="p-3 bg-theme-base rounded-xl border border-theme-subtle">
                <span className="text-theme-muted block text-[11px]">Win Rate Cuenta</span>
                <span className="text-base font-bold font-mono text-theme-primary block mt-0.5">
                  {accountKpis.winRate}%
                </span>
                <span className="text-[10px] text-theme-muted font-mono mt-0.5 block">Ratio de bateo</span>
              </div>

              <div className="p-3 bg-theme-base rounded-xl border border-theme-subtle">
                <span className="text-theme-muted block text-[11px]">Ventas Ganadas</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {formatMxn(accountKpis.wonTotal)}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">
                  {accountOpportunities.filter((o) => o.stage === 'Ganada').length} proyectos cerrados
                </span>
              </div>
            </div>
          </div>

          {/* Subtabs Selector */}
          <div className="bg-theme-card border border-theme-subtle rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b border-theme-subtle overflow-x-auto text-xs bg-theme-base/40">
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={`py-3 px-4 font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === 'timeline'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-theme-card'
                    : 'border-transparent text-theme-muted hover:text-theme-primary'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Resumen & Timeline</span>
              </button>

              <button
                onClick={() => setActiveSubTab('opportunities')}
                className={`py-3 px-4 font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === 'opportunities'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-theme-card'
                    : 'border-transparent text-theme-muted hover:text-theme-primary'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Oportunidades ({accountOpportunities.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('activities')}
                className={`py-3 px-4 font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === 'activities'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-theme-card'
                    : 'border-transparent text-theme-muted hover:text-theme-primary'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Actividades ({accountActivities.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('quotes')}
                className={`py-3 px-4 font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === 'quotes'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-theme-card'
                    : 'border-transparent text-theme-muted hover:text-theme-primary'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cotizaciones ({accountQuotes.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('orders')}
                className={`py-3 px-4 font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeSubTab === 'orders'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-theme-card'
                    : 'border-transparent text-theme-muted hover:text-theme-primary'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedidos ({accountOrders.length})</span>
              </button>
            </div>

            {/* Subtab Content */}
            <div className="p-5 text-xs">
              {/* TIMELINE */}
              {activeSubTab === 'timeline' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-theme-primary text-xs">Historial Comercial Reciente</h4>
                  <div className="relative pl-6 space-y-4 border-l-2 border-theme-subtle ml-2">
                    {accountActivities.length === 0 ? (
                      <p className="text-theme-muted italic">No hay interacciones registradas para esta cuenta.</p>
                    ) : (
                      accountActivities.map((act) => (
                        <div key={act.id} className="relative group">
                          <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-purple-100 dark:ring-purple-950" />
                          <div className="bg-theme-base border border-theme-subtle rounded-xl p-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-theme-primary">{act.subject}</span>
                              <span className="text-[10px] text-theme-muted font-mono">{act.scheduledDate}</span>
                            </div>
                            <p className="text-theme-muted text-[11px] mt-1">{act.notes}</p>
                            <div className="mt-2 flex items-center gap-2 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-theme-card border border-theme-subtle text-theme-primary">
                                {act.type}
                              </span>
                              <span className="text-theme-muted font-mono">Por: {act.seller}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* OPPORTUNITIES */}
              {activeSubTab === 'opportunities' && (
                <div className="space-y-3">
                  {accountOpportunities.length === 0 ? (
                    <p className="text-theme-muted italic py-4 text-center">No hay oportunidades registradas para esta cuenta.</p>
                  ) : (
                    accountOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => onSelectOpportunity(opp)}
                        className="bg-theme-base border border-theme-subtle hover:border-purple-400 rounded-xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-theme-primary">{opp.title}</span>
                            <span className="text-[10px] text-theme-muted font-mono">{opp.folio}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-theme-muted">
                            <span className="px-1.5 py-0.5 rounded bg-theme-card border border-theme-subtle">{opp.line}</span>
                            <span>{opp.seller}</span>
                            <span>· {opp.stage}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-sm text-theme-primary block">
                            {formatMxn(opp.amount)}
                          </span>
                          <span className="text-[11px] text-purple-600 font-bold block">{opp.probability}% prob.</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ACTIVITIES */}
              {activeSubTab === 'activities' && (
                <div className="space-y-2">
                  {accountActivities.length === 0 ? (
                    <p className="text-theme-muted italic py-4 text-center">No hay actividades agendadas.</p>
                  ) : (
                    accountActivities.map((act) => (
                      <div key={act.id} className="p-3 bg-theme-base border border-theme-subtle rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-theme-primary block">{act.subject}</span>
                          <span className="text-[11px] text-theme-muted">{act.type} · {act.scheduledDate} {act.time}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          act.status === 'Completada' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {act.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* QUOTES */}
              {activeSubTab === 'quotes' && (
                <div className="space-y-2">
                  {accountQuotes.length === 0 ? (
                    <p className="text-theme-muted italic py-4 text-center">No hay cotizaciones vinculadas a este cliente.</p>
                  ) : (
                    accountQuotes.map((q, i) => (
                      <div key={i} className="p-3 bg-theme-base border border-theme-subtle rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-theme-primary block font-mono">{q.folio || q.code || 'COT-' + i}</span>
                          <span className="text-[11px] text-theme-muted">{q.fecha || q.date || 'Reciente'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-theme-primary">{formatMxn(q.total || 0)}</span>
                          {onOpenQuote && q.id && (
                            <button
                              onClick={() => onOpenQuote(q.id)}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-medium"
                            >
                              Ver
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ORDERS */}
              {activeSubTab === 'orders' && (
                <div className="space-y-2">
                  {accountOrders.length === 0 ? (
                    <p className="text-theme-muted italic py-4 text-center">No hay pedidos registrados para este cliente.</p>
                  ) : (
                    accountOrders.map((ord, i) => (
                      <div key={i} className="p-3 bg-theme-base border border-theme-subtle rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-theme-primary block font-mono">{ord.folio || ord.code || 'PED-' + i}</span>
                          <span className="text-[11px] text-theme-muted">Estado: {ord.estado || ord.status || 'En proceso'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-600">{formatMxn(ord.total || 0)}</span>
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('pedidos')}
                              className="px-2 py-1 bg-theme-card border border-theme-subtle hover:text-purple-600 rounded text-[10px] font-medium"
                            >
                              Ir a Pedidos
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
