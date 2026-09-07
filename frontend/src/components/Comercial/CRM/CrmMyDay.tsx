import React from 'react';
import {
  CircleAlert,
  Clock3,
  CalendarDays,
  Target,
  CircleDollarSign,
  CheckCircle2,
  Phone,
  Mail,
  Users,
  Eye,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  CrmOpportunity,
  CrmActivity,
  formatMxn,
  getOpportunityHealth,
  getHealthLabel,
} from '../../../data/mockCrmData';

interface CrmMyDayProps {
  opportunities: CrmOpportunity[];
  activities: CrmActivity[];
  onOpenOpportunity: (opp: CrmOpportunity) => void;
  onCompleteActivity: (id: string) => void;
  onRegisterActivityModal?: () => void;
}

export const CrmMyDay: React.FC<CrmMyDayProps> = ({
  opportunities,
  activities,
  onOpenOpportunity,
  onCompleteActivity,
  onRegisterActivityModal,
}) => {
  // Focus list: Open opportunities sorted by lowest health (most urgent attention)
  const focusOpps = opportunities
    .filter((o) => !['Ganada', 'Perdida'].includes(o.stage))
    .sort((a, b) => getOpportunityHealth(a) - getOpportunityHealth(b))
    .slice(0, 5);

  const todayActivities = activities.filter((a) => a.status === 'Hoy');
  const overdueActivities = activities.filter((a) => a.status === 'Vencida');
  const atRiskAmount = focusOpps
    .filter((o) => o.risk === 'Crítico' || o.risk === 'Alto')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-theme-surface p-5 border border-theme-subtle rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Consola Operativa Diaria &middot; Ejecutivo de Ventas
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
              {todayActivities.length} actividades para hoy
            </span>
          </div>
          <h2 className="text-xl font-black text-theme-main">Mi Día Comercial</h2>
          <p className="text-xs text-theme-muted">
            Cadencia de llamadas, compromisos agendados y cuentas priorizadas por riesgo de estancamiento.
          </p>
        </div>

        {onRegisterActivityModal && (
          <button
            type="button"
            onClick={onRegisterActivityModal}
            className="px-4 py-2 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 transition-all shadow-xs w-fit cursor-pointer"
          >
            + Nueva Actividad
          </button>
        )}
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Requieren Atención</span>
            <CircleAlert className="w-4 h-4 text-rose-600" />
          </div>
          <strong className="text-2xl font-mono font-black text-rose-600 block">
            {focusOpps.length}
          </strong>
          <span className="text-[10px] text-theme-muted">Reglas demo activas</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Seguimientos Vencidos</span>
            <Clock3 className="w-4 h-4 text-amber-500" />
          </div>
          <strong className="text-2xl font-mono font-black text-amber-600 block">
            {overdueActivities.length}
          </strong>
          <span className="text-[10px] text-theme-muted">Cadencia expirada</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Actividades de Hoy</span>
            <CalendarDays className="w-4 h-4 text-theme-primary" />
          </div>
          <strong className="text-2xl font-mono font-black text-theme-primary block">
            {todayActivities.length}
          </strong>
          <span className="text-[10px] text-theme-muted">Llamadas y citas</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Pipeline en Riesgo</span>
            <Target className="w-4 h-4 text-rose-600" />
          </div>
          <strong className="text-2xl font-mono font-black text-theme-main block">
            {formatMxn(atRiskAmount)}
          </strong>
          <span className="text-[10px] text-rose-600 font-bold">Salud &lt; 60 pts</span>
        </div>

        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Cotizaciones por Vencer</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <strong className="text-2xl font-mono font-black text-emerald-600 block">
            3
          </strong>
          <span className="text-[10px] text-theme-muted">Requieren contacto</span>
        </div>
      </div>

      {/* 3. Two Columns: Tu Foco de Hoy & Agenda de Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TU FOCO DE HOY */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              Tu Foco de Hoy &middot; Oportunidades Prioritarias
            </h3>
            <p className="text-[11px] text-theme-muted">
              Ordenadas por score de urgencia considerando días en etapa, monto y probabilidad.
            </p>
          </div>

          <div className="space-y-3">
            {focusOpps.map((o) => {
              const h = getOpportunityHealth(o);
              const label = getHealthLabel(h);

              return (
                <div
                  key={o.id}
                  className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2 text-xs hover:border-theme-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            label === 'Riesgo'
                              ? 'bg-rose-500'
                              : label === 'Atención'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <strong className="text-theme-main text-xs">{o.account}</strong>
                        <span className="text-theme-muted">&middot;</span>
                        <span className="font-mono text-theme-primary font-bold">{o.folio}</span>
                      </div>
                      <span className="text-[11px] text-theme-muted block mt-0.5">{o.title}</span>
                    </div>

                    <div className="text-right">
                      <strong className="font-mono text-sm text-theme-main block">
                        {formatMxn(o.amount)}
                      </strong>
                      <span className="text-[10px] text-theme-muted font-mono">
                        Salud: {h} ({label})
                      </span>
                    </div>
                  </div>

                  {/* Siguiente mejor acción explicada */}
                  <div className="p-2 rounded-xl bg-theme-surface border border-theme-subtle flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-theme-muted">Siguiente mejor acción: </span>
                      <strong className="text-theme-main font-semibold">
                        {o.days >= 8 ? 'Confirmar objeción y agendar llamada' : 'Enviar propuesta ajustada'}
                      </strong>
                      <span className="text-theme-muted block text-[10px]">
                        Motivo: {o.days} días en etapa {o.stage} &middot; Cierre {o.close}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenOpportunity(o)}
                      className="px-3 py-1.5 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
                    >
                      Ver oportunidad
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AGENDA DE HOY */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-theme-subtle pb-3">
            <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
              Agenda Comercial de Hoy
            </h3>
            <p className="text-[11px] text-theme-muted">
              Completa o da seguimiento a tus tareas del día.
            </p>
          </div>

          <div className="space-y-2.5">
            {activities
              .filter((a) => a.status === 'Hoy' || a.status === 'Vencida')
              .slice(0, 6)
              .map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-theme-main">{a.when}</span>
                      <span className="text-[10px] text-theme-muted">&middot;</span>
                      <span className="text-[10px] uppercase font-bold text-theme-primary bg-theme-primary/10 px-1.5 py-0.2 rounded">
                        {a.type}
                      </span>
                      {a.status === 'Vencida' && (
                        <span className="text-[10px] text-rose-600 font-bold">(Vencida)</span>
                      )}
                    </div>
                    <strong className="text-theme-main block font-semibold">{a.account}</strong>
                    <span className="text-[11px] text-theme-muted line-clamp-1">{a.subject}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCompleteActivity(a.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Listo</span>
                  </button>
                </div>
              ))}
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-theme-muted italic block text-center">
              * Al marcar completada, las métricas del dashboard se actualizan en vivo.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Señales Comerciales */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
        <div className="space-y-1 border-b border-theme-subtle pb-3">
          <h3 className="text-xs sm:text-sm font-black text-theme-main uppercase tracking-wider">
            Señales Comerciales Tempranas
          </h3>
          <p className="text-[11px] text-theme-muted">
            Monitoreo proactivo de cuentas para prevención de churn y detección de expansión.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700 dark:text-amber-400">Relación Enfriándose</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <strong className="text-theme-main text-sm block">TYCO</strong>
            <p className="text-[11px] text-theme-muted">
              18 días sin actividad registrada ni confirmación de orden de compra.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Expansión de Cuenta</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <strong className="text-theme-main text-sm block">BISSELL</strong>
            <p className="text-[11px] text-theme-muted">
              2 oportunidades nuevas creadas en los últimos 30 días para campaña Q4.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-700 dark:text-rose-400">Validación de Crédito</span>
              <CircleAlert className="w-4 h-4 text-rose-600" />
            </div>
            <strong className="text-theme-main text-sm block">TRICO</strong>
            <p className="text-[11px] text-theme-muted">
              Oportunidad activa de $178k con factura vencida de $22k en finanzas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
