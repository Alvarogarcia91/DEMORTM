import React from 'react';
import {
  X,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  ArrowRight,
  Info,
  CheckCircle2,
  Tag,
  Layers,
} from 'lucide-react';
import { GlobalAuditEvent, AuditSeverity } from '../../data/mockAuditTrailData';

interface AuditEventDetailDrawerProps {
  event: GlobalAuditEvent | null;
  onClose: () => void;
  onNavigateToOrigin?: (module: string, query?: string) => void;
}

export const AuditEventDetailDrawer: React.FC<AuditEventDetailDrawerProps> = ({
  event,
  onClose,
  onNavigateToOrigin,
}) => {
  if (!event) return null;

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'danger':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {event.module}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(event.severity)}`}>
                  {event.severity === 'success' ? 'Completado' : event.severity === 'warning' ? 'Ajuste / Advertencia' : event.severity === 'danger' ? 'Alerta Crítica' : 'Registro Informativo'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {event.occurredAt}
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                {event.action}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Por <b>{event.user}</b> · <span className="text-zinc-400">{event.userRole}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Referencia Principal */}
          <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-xs space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              {event.referenceType}
            </span>
            <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <span>{event.reference}</span>
            </div>
            <p className="text-xs text-zinc-300 pt-1 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Motivo Humano del Cambio (si existe) */}
          {event.reason && (
            <div className="p-4 rounded-2xl border border-amber-300/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Motivo y Justificación Registrada</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                "{event.reason}"
              </p>
            </div>
          )}

          {/* QUÉ CAMBIÓ (Antes vs Ahora) */}
          {event.changes && event.changes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Qué Cambió Exactamente (Antes vs Ahora)
              </h3>

              <div className="space-y-2.5">
                {event.changes.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-2 text-xs"
                  >
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[11px]">
                      {ch.label}
                    </span>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Antes
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400 font-medium mt-0.5 block line-through">
                          {ch.before}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                          Ahora
                        </span>
                        <span className="text-emerald-950 dark:text-emerald-200 font-bold mt-0.5 block">
                          {ch.after}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registros Relacionados */}
          {event.related && event.related.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Documentos y Registros Vinculados
              </h3>

              <div className="flex flex-wrap gap-2">
                {event.related.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs flex items-center gap-2 shadow-2xs"
                  >
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {rel.type}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white font-mono text-[11px]">
                      {rel.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-400 font-mono">ID: {event.id}</span>

          {event.originLink && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToOrigin?.(event.originLink!.module, event.originLink!.query);
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{event.originLink.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
