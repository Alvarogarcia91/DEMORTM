import React, { useState, useMemo, useCallback } from 'react';
import {
  Briefcase, LayoutDashboard, Calendar, Users, Layers,
  Building2, BarChart3, Clock, CheckCircle2, UserPlus,
  Plus, Sparkles, Filter, RefreshCw, X, ArrowRight
} from 'lucide-react';
import { SalesCustomer, SalesOrder, SalesQuote } from '../../data/mockSalesData';
import {
  CrmOpportunity, CrmProspect, CrmActivity, CrmStage,
  initialProspects, initialOpportunities, initialActivities
} from '../../data/mockCrmData';
import { CrmDashboard } from './CRM/CrmDashboard';
import { CrmMyDay } from './CRM/CrmMyDay';
import { CrmProspects } from './CRM/CrmProspects';
import { CrmOpportunities } from './CRM/CrmOpportunities';
import { CrmPipeline } from './CRM/CrmPipeline';
import { CrmAccounts360 } from './CRM/CrmAccounts360';
import { CrmActivities } from './CRM/CrmActivities';
import { CrmAnalytics } from './CRM/CrmAnalytics';
import { ProspectFormModal } from './CRM/ProspectFormModal';
import { ActivityFormModal } from './CRM/ActivityFormModal';
import { OpportunityDetailModal } from './CRM/OpportunityDetailModal';

export type CrmTabKey =
  | 'dashboard'
  | 'today'
  | 'prospects'
  | 'opportunities'
  | 'pipeline'
  | 'accounts'
  | 'activities'
  | 'analytics';

export interface CrmPageProps {
  customers: SalesCustomer[];
  quotes: SalesQuote[];
  orders: SalesOrder[];
  onNavigate: (tab: 'cotizaciones' | 'pedidos' | 'clientes', customerId?: string) => void;
  onStartQuote: (customerId: string, opportunity: { id: string; folio: string }) => void;
  onOpenQuote: (folio: string) => void;
}

export const CrmPage: React.FC<CrmPageProps> = ({
  customers,
  quotes,
  orders,
  onNavigate,
  onStartQuote,
  onOpenQuote,
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<CrmTabKey>('dashboard');

  // Core CRM collections (initialized from enterprise mock data)
  const [prospects, setProspects] = useState<CrmProspect[]>(initialProspects);
  const [baseOpportunities, setBaseOpportunities] = useState<CrmOpportunity[]>(initialOpportunities);
  const [activities, setActivities] = useState<CrmActivity[]>(initialActivities);

  // Modals & Selected items
  const [selectedOpportunity, setSelectedOpportunity] = useState<CrmOpportunity | null>(null);
  const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Enriched opportunities with active quotes from Ventas Básico
  const opportunities = useMemo(() => {
    return baseOpportunities.map((opp) => {
      const linkedQuote = quotes.find(
        (q) =>
          q.crmOpportunityId === opp.id ||
          q.crmOpportunityFolio === opp.folio ||
          (q.folio && opp.quoteFolio && q.folio === opp.quoteFolio)
      );

      if (linkedQuote) {
        return {
          ...opp,
          quoteId: String(linkedQuote.id),
          quoteFolio: linkedQuote.folio,
          stage: ['Calificado', 'Levantamiento'].includes(opp.stage)
            ? ('Cotización' as CrmStage)
            : opp.stage,
        };
      }
      return opp;
    });
  }, [baseOpportunities, quotes]);

  // Update opportunity patch
  const handleUpdateOpportunity = useCallback((id: string, patch: Partial<CrmOpportunity>) => {
    setBaseOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
    );
    setSelectedOpportunity((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  }, []);

  // Stage change handler
  const handleUpdateStage = useCallback((id: string, newStage: CrmStage) => {
    setBaseOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== id) return opp;
        let newProb = opp.probability;
        if (newStage === 'Calificado') newProb = 25;
        if (newStage === 'Levantamiento') newProb = 45;
        if (newStage === 'Cotización') newProb = 65;
        if (newStage === 'Negociación') newProb = 85;
        if (newStage === 'Ganada') newProb = 100;
        if (newStage === 'Perdida') newProb = 0;

        return {
          ...opp,
          stage: newStage,
          probability: newProb,
          daysInStage: 0,
          risk: newStage === 'Ganada' ? 'Bajo' : opp.risk,
        };
      })
    );
    showToast(`Oportunidad movida a: ${newStage}`);
  }, [showToast]);

  // Prospect handlers
  const handleAddProspect = useCallback((newProspect: CrmProspect) => {
    setProspects((prev) => [newProspect, ...prev]);
    setIsProspectModalOpen(false);
    showToast(`Prospecto registrado: ${newProspect.company}`);
  }, [showToast]);

  const handleUpdateProspectStatus = useCallback((id: string, status: CrmProspect['status']) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showToast(`Estado de prospecto actualizado a: ${status}`);
  }, [showToast]);

  const handleConvertToOpportunity = useCallback((prospect: CrmProspect) => {
    const existingCust = customers.find(
      (c) =>
        c.name.toLowerCase().includes(prospect.company.toLowerCase()) ||
        prospect.company.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
    );

    const newFolio = `OPP-2026-${String(Date.now()).slice(-4)}`;
    const newOpp: CrmOpportunity = {
      id: `opp-${Date.now()}`,
      folio: newFolio,
      account: prospect.company,
      customerId: existingCust ? String(existingCust.id) : undefined,
      title: `${prospect.interest} · Proyecto formal`,
      line: prospect.line,
      stage: 'Calificado',
      amount: 145000,
      currency: 'MXN',
      probability: 30,
      close: '15 Oct',
      seller: prospect.seller,
      contactName: prospect.contact || prospect.contactName,
      contactEmail: prospect.email,
      contactPhone: prospect.phone,
      days: 0,
      daysInStage: 0,
      createdAt: 'Hoy',
      risk: 'Bajo',
      next: 'Agendar levantamiento técnico en planta',
    };

    setBaseOpportunities((prev) => [newOpp, ...prev]);
    setProspects((prev) =>
      prev.map((p) => (p.id === prospect.id ? { ...p, status: 'Convertido' as const } : p))
    );
    setSelectedOpportunity(newOpp);
    showToast(`Prospecto convertido en oportunidad ${newFolio}`);
  }, [customers, showToast]);

  // Activity handlers
  const handleAddActivity = useCallback((newActivity: CrmActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
    setIsActivityModalOpen(false);
    showToast(`Actividad agendada: ${newActivity.subject}`);
  }, [showToast]);

  const handleCompleteActivity = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Completada' as const } : a))
    );
    showToast('Actividad comercial completada.');
  }, [showToast]);

  // Quote redirection helper
  const handleStartQuote = useCallback((opp: CrmOpportunity) => {
    const custId = opp.customerId || (customers.length > 0 ? String(customers[0].id) : 'cli-001');
    onStartQuote(custId, { id: opp.id, folio: opp.folio });
  }, [customers, onStartQuote]);

  // Tabs configuration matching Inventory design system
  const tabsConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Mi Día', icon: Clock },
    { id: 'prospects', label: 'Prospectos', icon: UserPlus, badge: prospects.filter(p => p.status === 'Nuevo').length },
    { id: 'opportunities', label: 'Oportunidades', icon: Briefcase },
    { id: 'pipeline', label: 'Pipeline Kanban', icon: Layers },
    { id: 'accounts', label: 'Cuentas 360', icon: Building2 },
    { id: 'activities', label: 'Actividades', icon: Calendar, badge: activities.filter(a => a.status === 'Hoy' || a.status === 'Vencida').length },
    { id: 'analytics', label: 'Analítica Enterprise', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-[1520px] w-full mx-auto pb-16 animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Briefcase className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-theme-main tracking-tight">
                  CRM Comercial
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  Enterprise v2
                </span>
              </div>
              <p className="text-xs text-theme-muted">
                Pipeline B2B, cuentas 360, agenda de seguimiento y analítica de conversión para manufactura industrial RTM.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActivityModalOpen(true)}
            className="px-3.5 py-2 bg-theme-card border border-theme-subtle hover:border-purple-300 rounded-xl text-xs font-semibold text-theme-primary flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.01]"
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Agendar actividad</span>
          </button>

          <button
            onClick={() => setIsProspectModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-purple-600/20 transition-all hover:scale-[1.01]"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nuevo prospecto</span>
          </button>
        </div>
      </div>

      {/* Horizontal Navigation Tabs (Level 1 Module Tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-theme-subtle pb-3 text-xs font-semibold overflow-x-auto">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CrmTabKey)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB CONTENTS */}
      {activeTab === 'dashboard' && (
        <CrmDashboard
          opportunities={opportunities}
          activities={activities}
          onOpenOpportunity={setSelectedOpportunity}
          onNavigateTab={(tabKey) => setActiveTab(tabKey as CrmTabKey)}
          onNotice={showToast}
        />
      )}

      {activeTab === 'today' && (
        <CrmMyDay
          opportunities={opportunities}
          activities={activities}
          onOpenOpportunity={setSelectedOpportunity}
          onCompleteActivity={handleCompleteActivity}
        />
      )}

      {activeTab === 'prospects' && (
        <CrmProspects
          prospects={prospects}
          onOpenNewProspect={() => setIsProspectModalOpen(true)}
          onUpdateProspectStatus={handleUpdateProspectStatus}
          onConvertToOpportunity={handleConvertToOpportunity}
        />
      )}

      {activeTab === 'opportunities' && (
        <CrmOpportunities
          opportunities={opportunities}
          onSelectOpportunity={setSelectedOpportunity}
          onOpenNewOpportunity={() => setIsProspectModalOpen(true)}
          onUpdateStage={handleUpdateStage}
          onStartQuote={handleStartQuote}
          onOpenQuote={onOpenQuote}
        />
      )}

      {activeTab === 'pipeline' && (
        <CrmPipeline
          opportunities={opportunities}
          onSelectOpportunity={setSelectedOpportunity}
          onUpdateStage={handleUpdateStage}
          onStartQuote={handleStartQuote}
          onOpenQuote={onOpenQuote}
        />
      )}

      {activeTab === 'accounts' && (
        <CrmAccounts360
          customers={customers}
          opportunities={opportunities}
          activities={activities}
          quotes={quotes}
          orders={orders}
          onSelectOpportunity={setSelectedOpportunity}
          onOpenQuote={onOpenQuote}
          onNavigate={(t) => onNavigate(t as any)}
        />
      )}

      {activeTab === 'activities' && (
        <CrmActivities
          activities={activities}
          onOpenNewActivity={() => setIsActivityModalOpen(true)}
          onCompleteActivity={handleCompleteActivity}
        />
      )}

      {activeTab === 'analytics' && (
        <CrmAnalytics
          opportunities={opportunities}
          prospects={prospects}
          activities={activities}
          onSelectOpportunity={setSelectedOpportunity}
          onNavigateTab={(tabKey) => setActiveTab(tabKey as CrmTabKey)}
          onShowToast={showToast}
        />
      )}

      {/* MODALS */}
      {/* 1. Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          customers={customers}
          onClose={() => setSelectedOpportunity(null)}
          onUpdate={handleUpdateOpportunity}
          onNavigate={onNavigate}
          onStartQuote={onStartQuote}
          onOpenQuote={onOpenQuote}
        />
      )}

      {/* 2. New Prospect Modal */}
      {isProspectModalOpen && (
        <ProspectFormModal
          onClose={() => setIsProspectModalOpen(false)}
          onSave={handleAddProspect}
        />
      )}

      {/* 3. New Activity Modal */}
      {isActivityModalOpen && (
        <ActivityFormModal
          onClose={() => setIsActivityModalOpen(false)}
          onSave={handleAddActivity}
        />
      )}
    </div>
  );
};
