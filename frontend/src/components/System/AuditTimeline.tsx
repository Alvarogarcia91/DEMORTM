import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Info,
  ShieldCheck,
  Tag,
  User,
} from 'lucide-react';
import { GlobalAuditEvent } from '../../data/mockAuditTrailData';

interface AuditTimelineProps {
  events: GlobalAuditEvent[];
  onOpenEventDetail: (event: GlobalAuditEvent) => void;
  onNavigateToOrigin: (module: string, query?: string) => void;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({
  events,
  onOpenEventDetail,
  onNavigateToOrigin,
}) => {
  if (events.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl bg-white dark:bg-zinc-900">
        <Clock className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          No se encontraron eventos en la bitácora
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
          Ajusta los filtros temporales, de usuario o de módulo para consultar otros periodos.
        </p>
      </div>
    );
  }

  const getModuleBadgeColor = (mod: string) => {
    switch (mod) {
      case 'Producción':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'Calidad':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'Nómina':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';
      case 'Compras':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
      case 'Inventario':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200';
      case 'Finanzas':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'Comercial':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200';
      case 'Mantenimiento':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300';
    }
  };

  const getDotColor = (sev: string) => {
    switch (sev) {
      case 'danger':
        return 'bg-rose-500 ring-rose-200 dark:ring-rose-950';
      case 'warning':
        return 'bg-amber-500 ring-amber-200 dark:ring-amber-950';
      case 'success':
        return 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-950';
      default:
        return 'bg-blue-500 ring-blue-200 dark:ring-blue-950';
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800 animate-in fade-in">
      {events.map((event) => {
        return (
          <div key={event.id} className="relative group">
            {/* Dot indicador en el eje vertical */}
            <span
              className={`absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full ring-4 bg-white dark:bg-zinc-900 ${getDotColor(
                event.severity
              )} transition-transform group-hover:scale-125`}
            />

            {/* Tarjeta de Evento */}
            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3">
              {/* Header de la tarjeta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-zinc-400">
                    {event.occurredAt}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${getModuleBadgeColor(
                      event.module
                    )}`}
                  >
                    {event.module}
                  </span>
                  <span className="text-xs text-zinc-500">
                    por <b className="text-zinc-800 dark:text-zinc-200">{event.user}</b> ({event.userRole})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                    {event.reference}
                  </span>
                </div>
              </div>

              {/* Título de la acción y descripción humana */}
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                  {event.action}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Motivo Humano Destacado (si existe) */}
              {event.reason && (
                <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Motivo Registrado
                    </span>
                    <p className="leading-snug">{event.reason}</p>
                  </div>
                </div>
              )}

              {/* Vista rápida de Qué Cambió (Antes vs Ahora) */}
              {event.changes && event.changes.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {event.changes.slice(0, 2).map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 text-[11px] flex items-center justify-between gap-2"
                    >
                      <span className="text-zinc-500 font-medium truncate">{ch.label}:</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-zinc-400 line-through truncate max-w-[90px]">{ch.before}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate max-w-[120px]">
                          {ch.after}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer con CTAs */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenEventDetail(event)}
                  className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:underline cursor-pointer"
                >
                  Ver detalle completo →
                </button>

                {event.originLink && (
                  <button
                    type="button"
                    onClick={() => onNavigateToOrigin(event.originLink!.module, event.originLink!.query)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{event.originLink.actionLabel}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
