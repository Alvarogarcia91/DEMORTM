import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import {
  NonConformance,
  PeriodicControl,
  QualityAuditItem,
  QualityDeviation,
} from '../../data/mockCalidadData';
import { CalidadAnaliticaDashboard } from './CalidadAnaliticaDashboard';

interface Props {
  audits: QualityAuditItem[];
  controls: PeriodicControl[];
  nonConformances: NonConformance[];
  deviations?: QualityDeviation[];
  onOpenAudit: (audit: QualityAuditItem) => void;
  onOpenControl: (control: PeriodicControl) => void;
  onStartNewAudit: (type?: QualityAuditItem['type']) => void;
  onOpenDeviation?: (deviation: QualityDeviation) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CalidadDashboard: React.FC<Props> = ({
  audits,
  controls,
  nonConformances,
  deviations = [],
  onOpenAudit,
  onOpenControl,
  onStartNewAudit,
  onOpenDeviation,
  onNavigateTab,
}) => {
  const pendingAudits = audits.filter(
    (a) => a.status === 'Pendiente' || a.status === 'En inspección'
  );
  const pendingFirstPiece = audits.filter(
    (a) => a.type === 'Primera pieza' && a.status === 'Pendiente'
  );
  const pendingFinal = audits.filter(
    (a) => a.type === 'Auditoría final' && a.status === 'Pendiente'
  );
  const outOfRangeControls = controls.filter((c) => c.status === 'Fuera de rango');
  const holdItems = nonConformances.filter((n) => n.status === 'Hold');
  const activeDeviations = deviations.filter((d) => d.status === 'Activa' || d.status === 'En análisis 4M');

  const kpis = [
    {
      label: 'Auditorías Pendientes',
      val: pendingAudits.length,
      note: 'Esperando dictamen',
      tone: pendingAudits.length > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-theme-main',
    },
    {
      label: 'Primeras Piezas (Gate P0)',
      val: pendingFirstPiece.length,
      note: 'Bloqueando inicio de piso',
      tone: pendingFirstPiece.length > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-theme-main',
    },
    {
      label: 'Controles Fuera de Rango',
      val: outOfRangeControls.length,
      note: 'Monitoreo ambiental',
      tone: outOfRangeControls.length > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-theme-main',
    },
    {
      label: 'Desviaciones Activas',
      val: activeDeviations.length,
      note: 'Paro o fuera de secuencia',
      tone: activeDeviations.length > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-theme-main',
    },
    {
      label: 'Material en HOLD',
      val: holdItems.length,
      note: 'En cuarentena / MNC',
      tone: holdItems.length > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-theme-main',
    },
    {
      label: 'Liberaciones Finales PT',
      val: pendingFinal.length,
      note: 'Previo a traspaso almacén',
      tone: 'text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Grid de KPIs principales */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              {k.label}
            </p>
            <b className={`mt-2 block font-mono text-2xl font-black ${k.tone}`}>
              {k.val}
            </b>
            <small className="text-[11px] text-theme-muted block mt-0.5">{k.note}</small>
          </div>
        ))}
      </div>

      {/* BLOQUE PRINCIPAL: PENDIENTE DE MI ATENCIÓN (Sección 3 del documento) */}
      <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-theme-primary" />
                <h2 className="text-base font-black text-theme-main">
                  Pendiente de mi atención inmediata (Auditor: Alicia Ramírez)
                </h2>
              </div>
              <p className="text-xs text-theme-muted mt-0.5">
                Cola activa de trabajo operativo: capturas vencidas, gates de primera pieza y eventos de piso.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              {pendingAudits.length + outOfRangeControls.length} pendientes
            </span>
          </div>

          {/* Lista de filas de acción rápida */}
          <div className="divide-y divide-theme-subtle">
            {/* 1. Temperatura Cuarto Adhesivos (Vencida / Fuera de rango) */}
            {controls[0] && (
              <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-theme-muted/10 transition-colors rounded-xl px-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400 w-12 shrink-0">
                    10:00
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-theme-main text-xs">
                        {controls[0].name}
                      </span>
                      <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2 py-0.2 text-[9px] font-black uppercase text-rose-800 dark:text-rose-300">
                        Vencida / Desviación
                      </span>
                    </div>
                    <p className="text-[11px] text-theme-muted">
                      {controls[0].location} · Última: {controls[0].lastValue} {controls[0].unit} (Rango esperado: {controls[0].minVal}–{controls[0].maxVal} °C)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenControl(controls[0])}
                  className="rounded-xl bg-theme-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
                >
                  [Capturar]
                </button>
              </div>
            )}

            {/* 2. Primera pieza OP-95250 */}
            {pendingAudits.map((audit) => {
              const isFirstPiece = audit.type === 'Primera pieza';
              const isOver2h = audit.type === 'Control > 2 horas';
              const isIncoming = audit.type === 'Incoming';
              const isRemnant = audit.type === 'Validación de remanente';

              return (
                <div
                  key={audit.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-theme-muted/10 transition-colors rounded-xl px-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-theme-muted w-12 shrink-0">
                      {audit.scheduledAt}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-theme-main text-xs">
                          {audit.origin}
                        </span>
                        <span className="text-theme-muted text-xs">·</span>
                        <span className="font-bold text-theme-main text-xs">
                          {audit.type} ({audit.area})
                        </span>
                        <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2 py-0.2 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                          {audit.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-muted">
                        {audit.client} · {audit.part} · {audit.line} (Espera: {audit.waitingMinutes} min)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAudit(audit)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all ${
                      isFirstPiece
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : isIncoming
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : isRemnant
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-theme-primary hover:bg-theme-primary/90 text-white'
                    }`}
                  >
                    {isIncoming
                      ? '[Inspeccionar]'
                      : isRemnant
                      ? '[Validar]'
                      : '[Auditar]'}
                  </button>
                </div>
              );
            })}

            {/* 3. Desviaciones automáticas detectadas por ERP (Sección 13) */}
            {activeDeviations.map((dev) => (
              <div
                key={dev.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-theme-muted/10 transition-colors rounded-xl px-2 border-l-2 border-rose-500 pl-3 bg-rose-50/20 dark:bg-rose-950/10"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400 w-12 shrink-0">
                    {dev.detectedAt.split('·')[1]?.trim() || '11:45'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-theme-main text-xs">
                        {dev.opFolio}
                      </span>
                      <span className="text-theme-muted text-xs">·</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                        {dev.type} ({dev.machine})
                      </span>
                      <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2 py-0.2 text-[9px] font-black uppercase text-rose-800 dark:text-rose-300">
                        ALERTA · {dev.stoppedMinutes} min
                      </span>
                    </div>
                    <p className="text-[11px] text-theme-muted">
                      {dev.client} · Esp: {dev.expected} vs Eje: {dev.actual}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDeviation && onOpenDeviation(dev)}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  [Revisar]
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel lateral: Próximas capturas y eventos automáticos */}
        <div className="space-y-5">
          {/* Próximas capturas / rondas */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-theme-primary" />
                Rondas y Próximas Capturas
              </span>
              <span className="text-[10px] text-theme-muted font-mono">Demo configurable</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {controls.slice(1, 4).map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-theme-subtle p-3 flex items-center justify-between"
                >
                  <div>
                    <b className="text-theme-main block">{c.name}</b>
                    <small className="text-theme-muted block mt-0.5">
                      Próxima: <span className="font-bold text-theme-primary">{c.nextDueAt}</span> · {c.frequency}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenControl(c)}
                    className="rounded-lg border border-theme-subtle px-2.5 py-1 text-[11px] font-bold text-theme-main hover:bg-theme-muted/30"
                  >
                    Capturar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos automáticos de Producción (Sección 7 del documento) */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Eventos Automáticos de Producción
            </span>
            <p className="text-[11px] text-theme-muted">
              Reglas automáticas confirmadas en RTM que generan auditorías sin intervención manual:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { event: 'Producción > 2 horas', desc: 'OP-2026-95252 superó 120 min de tiro continuo en Mark Andy 830.', alert: true },
                { event: 'Cambio de bobina', desc: 'Nuevo rollo empalmado en OP-2026-95250 (Panasonic).', alert: false },
                { event: 'Ajuste de máquina', desc: 'Calibración de tintero y rasqueta en Conserver 3–4.', alert: false },
                { event: 'Cambio de turno', desc: 'Relevo a Turno B en línea Offset Heidelberg.', alert: false },
              ].map((ev, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-2.5 border ${
                    ev.alert
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-theme-subtle bg-theme-muted/10'
                  }`}
                >
                  <b className="text-theme-main block font-bold">{ev.event}</b>
                  <p className="text-[11px] text-theme-muted mt-0.5">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN P1: DESVIACIONES AUTOMÁTICAS DETECTADAS (Ishikawa 4M) */}
      {activeDeviations.length > 0 && (
        <div className="rounded-3xl border border-rose-400/40 bg-theme-surface p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <div>
                <h3 className="font-black text-sm text-theme-main">
                  Desviaciones de Ruta y Paros Detectados en Planta (Acción Requerida)
                </h3>
                <p className="text-xs text-theme-muted">
                  El sistema detectó órdenes detenidas o saltos de secuencia técnica. Requiere análisis 4M y contención antes de continuar tiraje.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 text-xs font-bold font-mono">
              {activeDeviations.length} anomalías
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {activeDeviations.map((dev) => (
              <div
                key={dev.id}
                className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                      {dev.id} · {dev.opFolio}
                    </b>
                    <span className="font-mono text-[10px] text-theme-muted">
                      {dev.stoppedMinutes} min detenido
                    </span>
                  </div>
                  <b className="text-theme-main block text-xs">{dev.type}</b>
                  <p className="text-[11px] text-theme-muted">
                    <b>Máquina:</b> {dev.machine} · <b>Cliente:</b> {dev.client}
                  </p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                    {dev.actual}
                  </p>
                </div>

                <div className="pt-2 border-t border-theme-subtle flex items-center justify-between">
                  <span className="text-[10px] font-bold text-theme-muted uppercase">
                    Factor 4M: {dev.category4M}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDeviation && onOpenDeviation(dev)}
                    className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90 flex items-center gap-1"
                  >
                    [Analizar 4M]
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLEMENTO ANALÍTICO GERENCIAL Y SUGERENCIAS DEL SISTEMA (DOCS V-ANALYTICS) */}
      <CalidadAnaliticaDashboard
        controls={controls}
        deviations={deviations}
        onNavigateTab={onNavigateTab}
        onOpenDeviation={onOpenDeviation}
        onOpenControl={onOpenControl}
        onStartNewAudit={onStartNewAudit}
      />
    </div>
  );
};
