import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  Filter, 
  Check, 
  RotateCcw,
  Boxes,
  ShoppingCart,
  TrendingUp,
  Truck,
  Receipt,
  CreditCard,
  Scale,
  Wrench,
  Users
} from 'lucide-react';
import { useAlertas } from '../context/AlertasContext';
import { DemoAlert, AlertPriority } from '../data/mockAlertasData';

interface AlertasQuickPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullCenter: () => void;
  onNavigateAlert: (alert: DemoAlert) => void;
}

const getModuleIcon = (modulo: DemoAlert['modulo']) => {
  switch (modulo) {
    case 'Inventario':
      return Boxes;
    case 'Compras':
      return ShoppingCart;
    case 'Ventas':
      return TrendingUp;
    case 'Órdenes de Salida':
      return Truck;
    case 'Facturación':
      return Receipt;
    case 'Cuentas por Cobrar':
      return CreditCard;
    case 'Cuentas por Pagar':
      return Scale;
    case 'Mantenimiento':
      return Wrench;
    case 'Nómina':
      return Users;
    default:
      return AlertTriangle;
  }
};

const getPriorityBadge = (prioridad: AlertPriority) => {
  switch (prioridad) {
    case 'Crítica':
      return {
        badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400',
        dot: 'bg-rose-500',
      };
    case 'Alta':
      return {
        badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
        dot: 'bg-amber-500',
      };
    case 'Media':
      return {
        badge: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
        dot: 'bg-blue-500',
      };
    case 'Informativa':
    default:
      return {
        badge: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/20 dark:text-zinc-400',
        dot: 'bg-zinc-400',
      };
  }
};

export const AlertasQuickPanel: React.FC<AlertasQuickPanelProps> = ({
  isOpen,
  onClose,
  onOpenFullCenter,
  onNavigateAlert,
}) => {
  const { alerts, pendingCount, markAsAttended, markAllAsAttended } = useAlertas();
  const [quickFilter, setQuickFilter] = useState<'Todas' | 'Críticas' | 'Finanzas' | 'Operación'>('Todas');

  if (!isOpen) return null;

  const filteredAlerts = alerts
    .filter((a) => a.estado !== 'Resuelta')
    .filter((a) => {
      if (quickFilter === 'Críticas') return a.prioridad === 'Crítica';
      if (quickFilter === 'Finanzas') return ['Facturación', 'Cuentas por Cobrar', 'Cuentas por Pagar'].includes(a.modulo);
      if (quickFilter === 'Operación') return ['Inventario', 'Compras', 'Ventas', 'Órdenes de Salida', 'Mantenimiento', 'Nómina'].includes(a.modulo);
      return true;
    })
    .slice(0, 7);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Dropdown Panel */}
      <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] bg-theme-surface border border-theme-subtle rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-theme-subtle flex items-center justify-between gap-2 bg-theme-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-theme-primary/10 text-theme-primary">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-theme-main">Alertas del Sistema</h3>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white leading-none">
                    {pendingCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-theme-muted">Eventos que requieren atención operativa</p>
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={markAllAsAttended}
              className="text-[10px] text-theme-muted hover:text-theme-main transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Marcar todas como atendidas"
            >
              <Check className="w-3 h-3" />
              <span>Marcar vistas</span>
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-theme-subtle/50 bg-theme-surface overflow-x-auto text-[11px]">
          {(['Todas', 'Críticas', 'Finanzas', 'Operación'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setQuickFilter(tab)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                quickFilter === tab
                  ? 'bg-theme-main text-theme-surface font-semibold shadow-2xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-theme-subtle/40 p-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-theme-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <p className="text-xs font-bold text-theme-main">Todo al día</p>
              <p className="text-[11px]">No hay alertas pendientes en esta categoría.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const Icon = getModuleIcon(alert.modulo);
              const styling = getPriorityBadge(alert.prioridad);

              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    markAsAttended(alert.id);
                    onNavigateAlert(alert);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer group flex items-start gap-3 hover:bg-theme-muted/60 ${
                    alert.estado === 'Pendiente' ? 'bg-theme-surface' : 'opacity-80'
                  }`}
                >
                  {/* Module Icon with Priority Ring */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-lg bg-theme-muted border border-theme-subtle flex items-center justify-center text-theme-main group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-zinc-900 ${styling.dot}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider rounded border ${styling.badge}`}>
                          {alert.prioridad}
                        </span>
                        <span className="text-[10px] font-semibold text-theme-muted truncate">
                          {alert.modulo}
                        </span>
                      </div>
                      <span className="text-[10px] text-theme-muted shrink-0 font-mono">
                        {alert.fechaHora}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-theme-main group-hover:text-theme-primary transition-colors line-clamp-1 leading-snug">
                      {alert.titulo}
                    </h4>

                    <p className="text-[11px] text-theme-muted line-clamp-2 mt-0.5 leading-relaxed">
                      {alert.descripcion}
                    </p>

                    {/* Bottom CTA hint */}
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-theme-muted bg-theme-muted px-1.5 py-0.2 rounded border border-theme-subtle/50">
                        Ref: {alert.referencia}
                      </span>
                      <span className="text-theme-primary font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        {alert.ctaPrincipal}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTA: Ver todas las alertas */}
        <div className="p-2.5 border-t border-theme-subtle bg-theme-muted/20 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenFullCenter();
            }}
            className="w-full py-2 px-3 rounded-xl bg-theme-main text-theme-surface hover:opacity-90 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ver todas las alertas ({alerts.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
