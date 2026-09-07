import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileClock,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileUp,
  History,
  Layers,
  Link as LinkIcon,
  Lock,
  Package,
  Printer,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react';
import {
  PpapCase,
  PpapChecklistItem,
  PpapDocument,
  PpapPfmeaRow,
} from '../../../data/mockPpapData';
import { ModalPortal } from '../../common/ModalPortal';

interface Props {
  ppapCase: PpapCase;
  initialTab?: string;
  onClose: () => void;
  onNavigateToOp?: (opFolio: string) => void;
  onNavigateToTraceability?: (opFolio: string) => void;
  onToast?: (msg: string) => void;
}

type PpapDetailTab =
  | 'Resumen'
  | 'Documentos'
  | 'Resultados'
  | 'Riesgos'
  | 'Plan de Control'
  | 'Muestras'
  | 'Aprobaciones'
  | 'Historial';

export const PpapCase360Modal: React.FC<Props> = ({
  ppapCase,
  initialTab = 'Resumen',
  onClose,
  onNavigateToOp,
  onNavigateToTraceability,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<PpapDetailTab>(initialTab as PpapDetailTab);
  const [selectedDocPreview, setSelectedDocPreview] = useState<PpapDocument | null>(null);
  const [localCase, setLocalCase] = useState<PpapCase>(ppapCase);

  const notify = (msg: string) => {
    if (onToast) onToast(msg);
  };

  const handleUpdatePfmeaDemo = () => {
    setLocalCase((prev) => ({
      ...prev,
      completionPercentage: 88,
      status: 'En revisión con Calidad',
      attentionNote: undefined,
      checklist: prev.checklist.map((c) =>
        c.elementNumber === 6
          ? { ...c, status: 'Completo', notes: 'Actualizado a Rev H incorporando radiómetro UV.' }
          : c
      ),
      documents: prev.documents.map((d) =>
        d.code === 'AMEF-FLX-08'
          ? { ...d, revision: 'H (Actualizada)', status: 'Aprobado', warningNote: undefined }
          : d
      ),
      pfmeaRows: prev.pfmeaRows.map((r) =>
        r.id === 'pfmea-2'
          ? {
              ...r,
              status: 'Implementada',
              revisedRpn: 56,
              actionPriority: 'Baja',
              currentControls: 'Radiómetro UV diario en línea + Monitoreo LED',
            }
          : r
      ),
      history: [
        {
          id: `h-${Date.now()}`,
          date: 'Hoy · Reciente',
          user: 'Alicia Ramírez',
          action: 'PFMEA Actualizado a Rev H',
          details: 'Incorporación de controles de intensidad UV. Expediente elevado a 88% de avance.',
          badgeTone: 'success',
        },
        ...prev.history,
      ],
    }));
    notify('✓ PFMEA actualizado a Rev H. El riesgo fue mitigado y el avance aumentó a 88%.');
  };

  const isComplete = localCase.completionPercentage === 100;

  return (
    <ModalPortal onClose={onClose}>
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header Superior con Datos del Expediente */}
        <div className="sticky top-0 z-20 border-b border-theme-subtle bg-theme-surface p-6 shadow-2xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                  PPAP NIVEL {localCase.submissionLevel} · AIAG 4TH ED.
                </span>
                <span className="font-mono text-xs text-theme-muted font-bold">
                  {localCase.folio} · {localCase.client}
                </span>
                <span className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase bg-theme-muted/20 text-theme-main">
                  {localCase.submissionReason}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-2xl font-black text-theme-main tracking-tight">
                  {localCase.partNumber} · {localCase.revision}
                </h2>
                <span className="text-xs font-semibold text-theme-muted">
                  ({localCase.partName})
                </span>
              </div>

              <p className="text-xs text-theme-muted">
                Proceso: <b className="text-theme-main">{localCase.processArea}</b> · Familia: <b className="text-theme-main">{localCase.family}</b> · Responsable: <b className="text-theme-main">{localCase.owner}</b> · Meta: <b className="text-theme-main">{localCase.targetDate}</b>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Progreso Circular / Badge */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-base p-3 text-right">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-theme-muted/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                          ? 'bg-emerald-500'
                          : localCase.completionPercentage >= 80
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${localCase.completionPercentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-base font-black text-theme-main">
                    {localCase.completionPercentage}%
                  </span>
                </div>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-black ${
                    localCase.status === 'Aprobado'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : localCase.status === 'Pendiente del cliente'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                      : localCase.status === 'En revisión con Calidad'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {localCase.status}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mini Ruta Visual APQP (Planeación avanzada de calidad) */}
          <div className="mt-4 pt-3 border-t border-theme-subtle/60 flex items-center gap-1 overflow-x-auto text-[10px] font-bold text-theme-muted">
            <span className="text-theme-main uppercase tracking-widest font-black text-[9px] mr-2 shrink-0">
              Ruta APQP:
            </span>
            {[
              { step: '1. Requisitos Cliente', done: true },
              { step: '2. Diseño & Proceso', done: true },
              { step: '3. Validación en Piso', done: localCase.completionPercentage >= 70 },
              { step: '4. Sumisión PPAP & PSW', done: isComplete },
              { step: '5. Producción en Serie', done: localCase.status === 'Aprobado' },
            ].map((st, i) => (
              <React.Fragment key={st.step}>
                {i > 0 && <ChevronRight className="h-3 w-3 text-theme-muted/50 shrink-0" />}
                <span
                  className={`rounded-lg px-2 py-0.5 shrink-0 transition-colors ${
                    st.done
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black'
                      : 'bg-theme-muted/10 text-theme-muted'
                  }`}
                >
                  {st.done ? '✓ ' : '○ '}
                  {st.step}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Barra de Tabs Especializadas */}
        <div className="flex overflow-x-auto gap-1 border-b border-theme-subtle p-3 bg-theme-muted/10">
          {(
            [
              'Resumen',
              'Documentos',
              'Resultados',
              'Riesgos',
              'Plan de Control',
              'Muestras',
              'Aprobaciones',
              'Historial',
            ] as PpapDetailTab[]
          ).map((item) => {
            const isSelected = activeTab === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveTab(item)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/30'
                }`}
              >
                {item === 'Riesgos'
                  ? 'Riesgos (PFMEA)'
                  : item === 'Aprobaciones'
                  ? 'Aprobaciones & PSW'
                  : item}
              </button>
            );
          })}
        </div>

        {/* Contenido de las Tabs */}
        <div className="p-6">
          {/* ==================================================== */}
          {/* TAB 1: RESUMEN (Checklist Ejecutivo & Readiness) */}
          {/* ==================================================== */}
          {activeTab === 'Resumen' && (
            <div className="space-y-6">
              {/* Alerta de bloqueo activo si aplica */}
              {localCase.attentionNote && (
                <div className="rounded-3xl border-2 border-amber-400/80 bg-amber-50/70 dark:bg-amber-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                        Bloqueo activo en el expediente:
                      </h4>
                      <p className="text-xs text-amber-900/90 dark:text-amber-300/90 mt-0.5">
                        {localCase.attentionNote}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdatePfmeaDemo}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-xs shrink-0"
                  >
                    ⚡ Actualizar PFMEA a Rev H
                  </button>
                </div>
              )}

              {/* Grid 2 Columnas: Checklist 18 Elementos vs Resumen Ejecutivo */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Columna Izquierda: Checklist de 18 Elementos AIAG */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                    <div>
                      <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                        Elementos Requeridos del PPAP (Nivel {localCase.submissionLevel})
                      </h3>
                      <p className="text-xs text-theme-muted">
                        Checklist con estado de evidencia para sumisión formal al cliente.
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-theme-primary">
                      {localCase.checklist.filter((c) => c.status === 'Completo').length} de {localCase.checklist.length} listos
                    </span>
                  </div>

                  <div className="space-y-2">
                    {localCase.checklist.map((item) => {
                      const isItemComplete = item.status === 'Completo';
                      const isItemWarning = item.status === 'Requiere actualización';
                      const isItemNotApplicable = item.status === 'No aplica';

                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-3.5 text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                            isItemWarning
                              ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                              : isItemComplete
                              ? 'border-theme-subtle bg-theme-surface hover:border-emerald-500/50'
                              : 'border-theme-subtle bg-theme-muted/10 opacity-75'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                                isItemComplete
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : isItemWarning
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-theme-muted/20 text-theme-muted'
                              }`}
                            >
                              {isItemComplete ? '✓' : isItemWarning ? '!' : item.elementNumber}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-theme-main">
                                  #{item.elementNumber} {item.humanLabel}
                                </span>
                                {item.documentRef && (
                                  <span className="font-mono text-[10px] text-theme-primary">
                                    ({item.documentRef})
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-theme-muted mt-0.5">
                                AIAG: {item.name} {item.notes && `· ${item.notes}`}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black shrink-0 self-start sm:self-center ${
                              isItemComplete
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isItemWarning
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : isItemNotApplicable
                                ? 'bg-theme-muted/30 text-theme-muted'
                                : 'bg-theme-muted/20 text-theme-main'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Columna Derecha: Tarjetas de Readiness & OPs vinculadas */}
                <div className="space-y-4">
                  {/* Tarjeta de Readiness / Estado PSW */}
                  <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-theme-main">
                        Dictamen de Preparación (Readiness)
                      </span>
                      <ShieldCheck className="h-4 w-4 text-theme-primary" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Estado del PSW:</span>
                        <b className="text-theme-main">{localCase.pswStatus}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Contacto Cliente:</span>
                        <b className="text-theme-main text-right">{localCase.clientContact || 'No especificado'}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Nivel de Presentación:</span>
                        <b className="text-theme-main">Nivel {localCase.submissionLevel} (Completo)</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Elementos Completos:</span>
                        <b className="font-mono text-emerald-600">
                          {localCase.checklist.filter((c) => c.status === 'Completo').length} / {localCase.checklist.length}
                        </b>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('Aprobaciones')}
                        className="w-full rounded-2xl bg-theme-primary py-2.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs transition-colors"
                      >
                        Ver Carátula Oficial PSW
                      </button>
                    </div>
                  </div>

                  {/* Vínculo a Producción y Trazabilidad 360 */}
                  {localCase.demandingOp && (
                    <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3 shadow-xs">
                      <span className="text-xs font-black uppercase tracking-wider text-theme-main block">
                        Corrida Piloto Vinculada
                      </span>
                      <div className="rounded-2xl border border-theme-subtle bg-theme-base p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-theme-muted">Orden de Producción:</span>
                          <span className="font-mono font-black text-theme-primary">{localCase.demandingOp}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-theme-muted">Lote Producido:</span>
                          <span className="font-mono font-bold text-theme-main">{localCase.validationLot || 'BCH-44951'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-theme-muted">Muestras Retenidas:</span>
                          <span className="font-bold text-emerald-600">300 piezas (Conformes ✓)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {onNavigateToOp && (
                          <button
                            type="button"
                            onClick={() => onNavigateToOp(localCase.demandingOp!)}
                            className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-[11px] font-bold text-theme-main hover:bg-theme-muted/30 transition-colors text-center"
                          >
                            Ir a OP &rarr;
                          </button>
                        )}
                        {onNavigateToTraceability && (
                          <button
                            type="button"
                            onClick={() => onNavigateToTraceability(localCase.demandingOp!)}
                            className="rounded-xl border border-theme-primary/30 bg-theme-primary/10 px-3 py-2 text-[11px] font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors text-center"
                          >
                            Trazabilidad 360 &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: DOCUMENTOS (Cards visuales con estado) */}
          {/* ==================================================== */}
          {activeTab === 'Documentos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
                <div>
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Bóveda Documental del Expediente PPAP
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Entregables de ingeniería, control de cambios y validación de calidad.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Adjuntar nuevo documento habilitado en demo.')}
                  className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 transition-colors shadow-2xs"
                >
                  + Adjuntar Documento
                </button>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {localCase.documents.map((doc) => {
                  const isWarning = doc.status === 'Requiere actualización';
                  const isApproved = doc.status === 'Aprobado';

                  return (
                    <div
                      key={doc.id}
                      className={`rounded-3xl border p-4 text-xs transition-all flex flex-col justify-between ${
                        isWarning
                          ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-theme-subtle bg-theme-surface shadow-xs hover:border-theme-primary'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="rounded-md bg-theme-muted/20 px-2 py-0.5 text-[9px] font-mono font-bold text-theme-muted">
                            {doc.code}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : isWarning
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-theme-main text-sm line-clamp-1">{doc.name}</h4>
                        <p className="text-[11px] text-theme-muted">
                          Revisión: <b className="text-theme-main">{doc.revision}</b> · {doc.category}
                        </p>

                        {doc.warningNote && (
                          <div className="rounded-xl border border-amber-400/80 bg-amber-50 p-2 text-[10px] text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                            <b>Aviso:</b> {doc.warningNote}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
                        <span className="text-[10px] text-theme-muted">{doc.date} · {doc.fileSize}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => notify(`Visualizando ${doc.name} (${doc.code}). Archivo verificado.`)}
                            className="rounded-lg border border-theme-subtle bg-theme-base px-2.5 py-1 text-[11px] font-bold text-theme-main hover:bg-theme-primary hover:text-white transition-colors"
                          >
                            Abrir
                          </button>
                          {isWarning && (
                            <button
                              type="button"
                              onClick={handleUpdatePfmeaDemo}
                              className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 transition-colors shadow-xs"
                            >
                              Actualizar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: RESULTADOS (Dimensionales, Apariencia, SPC) */}
          {/* ==================================================== */}
          {activeTab === 'Resultados' && (
            <div className="space-y-6">
              {/* Resultados Dimensionales */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                  <div>
                    <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                      Resultados Dimensionales de Corrida Inicial
                    </h3>
                    <p className="text-xs text-theme-muted">
                      Evaluación sobre muestra representativa (32 piezas inspeccionadas).
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {localCase.dimensionalResults.filter((d) => d.inSpec).length} de {localCase.dimensionalResults.length} características dentro de especificación ✓
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-theme-muted/15 text-[10px] uppercase font-bold text-theme-muted">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Característica evaluada</th>
                        <th className="p-3">Especificación</th>
                        <th className="p-3">Tolerancia</th>
                        <th className="p-3">Medido (Promedio)</th>
                        <th className="p-3">Instrumento</th>
                        <th className="p-3">Muestra</th>
                        <th className="p-3 text-center">Dictamen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-subtle">
                      {localCase.dimensionalResults.map((dim) => (
                        <tr key={dim.id} className="hover:bg-theme-muted/10">
                          <td className="p-3 font-mono text-theme-muted">{dim.itemNumber}</td>
                          <td className="p-3 font-bold text-theme-main">{dim.characteristic}</td>
                          <td className="p-3 font-mono">{dim.specification}</td>
                          <td className="p-3 font-mono text-theme-muted">{dim.tolerance}</td>
                          <td className="p-3 font-mono font-black text-theme-main">
                            {dim.measured} {dim.unit}
                          </td>
                          <td className="p-3 text-theme-muted">{dim.instrument}</td>
                          <td className="p-3 font-mono">{dim.sampleSize} pzas</td>
                          <td className="p-3 text-center">
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                              Conforme ✓
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Apariencia, Color y Resistencia */}
              <div className="space-y-3">
                <div className="border-b border-theme-subtle pb-2">
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Apariencia Visual, Tono X-Rite y Desempeño
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Inspección espectrofotométrica y pruebas destructivas de adhesión/frote.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {localCase.colorVisualResults.map((col) => (
                    <div key={col.id} className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-theme-main">{col.parameter}</span>
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[9px] font-black text-emerald-800 dark:text-emerald-300">
                          {col.result} ✓
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-muted">
                        Especificación: <b className="text-theme-main">{col.specification}</b>
                      </p>
                      <div className="rounded-xl bg-theme-muted/10 p-2 font-mono text-[11px] text-theme-main">
                        Resultado: <b>{col.measured}</b> ({col.instrument})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Resumen SPC de Capacidad Preliminar */}
              {localCase.spcMetrics && localCase.spcMetrics.length > 0 && (
                <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />
                      <div>
                        <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-xs">
                          SPC · Estudio Preliminar de Capacidad de Proceso
                        </h4>
                        <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                          {localCase.spcMetrics[0].demonstrativeNotice}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black text-white">
                      Proceso Capaz (Cpk ≥ 1.33)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
                    <div className="rounded-xl border border-indigo-200/80 bg-theme-surface p-3 text-center">
                      <span className="text-[10px] text-theme-muted uppercase font-bold block">Índice Cpk</span>
                      <b className="font-mono text-xl text-emerald-600 font-black">{localCase.spcMetrics[0].cpk}</b>
                    </div>
                    <div className="rounded-xl border border-indigo-200/80 bg-theme-surface p-3 text-center">
                      <span className="text-[10px] text-theme-muted uppercase font-bold block">Índice Ppk</span>
                      <b className="font-mono text-xl text-theme-main font-black">{localCase.spcMetrics[0].ppk}</b>
                    </div>
                    <div className="rounded-xl border border-indigo-200/80 bg-theme-surface p-3 text-center">
                      <span className="text-[10px] text-theme-muted uppercase font-bold block">Media (X̄)</span>
                      <b className="font-mono text-xl text-theme-main font-black">{localCase.spcMetrics[0].mean} mm</b>
                    </div>
                    <div className="rounded-xl border border-indigo-200/80 bg-theme-surface p-3 text-center">
                      <span className="text-[10px] text-theme-muted uppercase font-bold block">Desv. Estándar (σ)</span>
                      <b className="font-mono text-xl text-theme-main font-black">{localCase.spcMetrics[0].stdDev}</b>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: RIESGOS (PFMEA · Análisis de Riesgos de Proceso) */}
          {/* ==================================================== */}
          {activeTab === 'Riesgos' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-theme-subtle pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-[9px] font-black uppercase text-purple-800 dark:text-purple-300">
                      CORE TOOL · AIAG PFMEA
                    </span>
                    <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                      PFMEA · Análisis de Riesgos del Proceso de Manufactura
                    </h3>
                  </div>
                  <p className="text-xs text-theme-muted mt-0.5">
                    Evaluación de modos potenciales de falla, severidad, controles y acciones de mitigación.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUpdatePfmeaDemo}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-xs shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Sincronizar AMEF con Rev H
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/15 text-[10px] uppercase font-bold text-theme-muted">
                    <tr>
                      <th className="p-3">Paso / Operación</th>
                      <th className="p-3">Modo de Falla Potencial</th>
                      <th className="p-3">Efecto en Cliente</th>
                      <th className="p-3 text-center">S</th>
                      <th className="p-3 text-center">O</th>
                      <th className="p-3 text-center">D</th>
                      <th className="p-3 text-center">RPN</th>
                      <th className="p-3">Controles Actuales</th>
                      <th className="p-3">Acción Recomendada</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {localCase.pfmeaRows.map((row) => {
                      const isHigh = row.rpn > 100 || row.actionPriority === 'Alta';

                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-theme-muted/10 transition-colors ${
                            isHigh ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                          }`}
                        >
                          <td className="p-3 font-bold text-theme-main">
                            #{row.stepNumber} {row.processStep}
                          </td>
                          <td className="p-3 text-theme-main">{row.failureMode}</td>
                          <td className="p-3 text-theme-muted text-[11px]">{row.failureEffect}</td>
                          <td className="p-3 text-center font-mono font-bold text-theme-main">{row.severity}</td>
                          <td className="p-3 text-center font-mono font-bold text-theme-main">{row.occurrence}</td>
                          <td className="p-3 text-center font-mono font-bold text-theme-main">{row.detection}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-black ${
                                isHigh
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-theme-muted/20 text-theme-main'
                              }`}
                            >
                              {row.rpn}
                            </span>
                          </td>
                          <td className="p-3 text-theme-muted text-[11px]">{row.currentControls}</td>
                          <td className="p-3 font-medium text-theme-main text-[11px]">{row.recommendedAction}</td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[9px] font-black ${
                                row.status === 'Implementada'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: PLAN DE CONTROL (Características y Reacción) */}
          {/* ==================================================== */}
          {activeTab === 'Plan de Control' && (
            <div className="space-y-4">
              <div className="border-b border-theme-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[9px] font-black uppercase text-blue-800 dark:text-blue-300">
                    CORE TOOL · CONTROL PLAN
                  </span>
                  <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                    Plan de Control de Manufactura (PCP)
                  </h3>
                </div>
                <p className="text-xs text-theme-muted mt-0.5">
                  Reutiliza los estándares operativos de Piso QA y configuración de maquinaria de Producción.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-theme-subtle bg-theme-surface">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme-muted/15 text-[10px] uppercase font-bold text-theme-muted">
                    <tr>
                      <th className="p-3">Operación</th>
                      <th className="p-3">Máquina</th>
                      <th className="p-3">Característica Crítica</th>
                      <th className="p-3">Especificación</th>
                      <th className="p-3">Frecuencia / Muestra</th>
                      <th className="p-3">Instrumento</th>
                      <th className="p-3">Plan de Reacción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-subtle">
                    {localCase.controlPlanItems.map((cp) => (
                      <tr key={cp.id} className="hover:bg-theme-muted/10">
                        <td className="p-3 font-bold text-theme-main">{cp.operation}</td>
                        <td className="p-3 text-theme-muted font-mono">{cp.machine}</td>
                        <td className="p-3">
                          <span className="font-bold text-theme-main block">{cp.characteristic}</span>
                          <span className="rounded-full bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 text-[8px] font-black text-rose-700 dark:text-rose-300">
                            {cp.classification}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-theme-main">{cp.specification}</td>
                        <td className="p-3 text-theme-muted">
                          {cp.frequency} ({cp.sampleSize})
                        </td>
                        <td className="p-3 text-theme-main font-medium">{cp.instrument}</td>
                        <td className="p-3 font-bold text-rose-700 dark:text-rose-400 text-[11px]">
                          {cp.reactionPlan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: MUESTRAS (Corrida Piloto y Vínculos a OP) */}
          {/* ==================================================== */}
          {activeTab === 'Muestras' && (
            <div className="space-y-5">
              <div className="border-b border-theme-subtle pb-3">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Muestras de Producción y Liberación de Corrida Piloto
                </h3>
                <p className="text-xs text-theme-muted">
                  Validación física sobre piezas producidas en condiciones normales de manufactura.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                    Orden de Producción Origen
                  </span>
                  <p className="font-mono text-base font-black text-theme-primary">
                    {localCase.validationSample.opFolio}
                  </p>
                  <p className="text-theme-muted">
                    Lote PT: <b className="font-mono text-theme-main">{localCase.validationSample.lotNumber}</b>
                  </p>
                  <p className="text-theme-muted">
                    Fecha de Corrida: <b className="text-theme-main">{localCase.validationSample.runDate}</b>
                  </p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                    Volumen y Muestreo
                  </span>
                  <p className="text-theme-main">
                    Tiraje Total: <b className="font-mono">{localCase.validationSample.producedQuantity.toLocaleString()} piezas</b>
                  </p>
                  <p className="text-theme-main">
                    Muestra Retenida: <b className="font-mono text-emerald-600">{localCase.validationSample.sampleQuantity} piezas</b>
                  </p>
                  <p className="text-theme-muted">
                    Certificado CoA: <b className="font-mono text-theme-main">{localCase.validationSample.coaFolio}</b>
                  </p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                    Dictamen de Liberación QA
                  </span>
                  <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300">
                    {localCase.validationSample.releaseStatus} ✓
                  </span>
                  <p className="text-theme-muted">
                    Inspector: <b className="text-theme-main">{localCase.validationSample.inspectedBy}</b>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/15 p-4 text-xs">
                <span className="font-bold text-theme-main block mb-1">Notas de Custodia y Envío:</span>
                <p className="text-theme-muted">{localCase.validationSample.notes}</p>
              </div>

              {/* Botones de navegación real */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {onNavigateToOp && (
                  <button
                    type="button"
                    onClick={() => onNavigateToOp(localCase.validationSample.opFolio)}
                    className="flex items-center gap-2 rounded-xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs transition-colors"
                  >
                    Ver Orden de Producción ({localCase.validationSample.opFolio}) &rarr;
                  </button>
                )}
                {onNavigateToTraceability && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTraceability(localCase.validationSample.opFolio)}
                    className="flex items-center gap-2 rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-xs transition-colors"
                  >
                    Ver Trazabilidad 360 del Lote ({localCase.validationSample.lotNumber}) &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: APROBACIONES & PSW (Carátula Formal) */}
          {/* ==================================================== */}
          {activeTab === 'Aprobaciones' && (
            <div className="space-y-6">
              {/* Carátula Oficial PSW (Part Submission Warrant) */}
              <div className="rounded-3xl border-2 border-theme-subtle bg-theme-surface p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-theme-subtle pb-4">
                  <div>
                    <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-theme-primary">
                      CF-QA-PSW-01 · AIAG PPAP 4TH EDITION
                    </span>
                    <h3 className="text-lg font-black text-theme-main mt-1">
                      Part Submission Warrant (PSW) · Certificado de Sumisión de Parte
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => notify('Descargando carátula oficial PSW en PDF.')}
                    className="flex items-center gap-2 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white hover:bg-theme-primary/90 shadow-xs shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    Exportar PSW Oficial
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 text-xs">
                  <div>
                    <span className="text-theme-muted block">Cliente:</span>
                    <b className="font-bold text-theme-main">{localCase.client}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Número de Parte:</span>
                    <b className="font-mono text-theme-main">{localCase.partNumber}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Revisión:</span>
                    <b className="font-bold text-theme-main">{localCase.revision}</b>
                  </div>
                  <div>
                    <span className="text-theme-muted block">Nivel PPAP:</span>
                    <b className="font-bold text-theme-primary">Nivel {localCase.submissionLevel}</b>
                  </div>
                </div>

                {/* Declaración del Proveedor */}
                <div className="rounded-2xl border border-theme-subtle p-4 text-xs text-theme-muted leading-relaxed">
                  <p>
                    <b className="text-theme-main">Declaración del Proveedor:</b> Certifico que las muestras representativas cumplen con todos los requerimientos dimensionales, químicos y funcionales especificados en los planos y normas del cliente, habiendo sido producidas a velocidad nominal en la planta de manufactura RTM.
                  </p>
                </div>

                {/* Timeline de Firmas y Aprobaciones */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-theme-main">
                    Cadena de Firmas y Aprobaciones Requeridas
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {localCase.approvals.map((app) => {
                      const isApproved = app.status === 'Aprobado';
                      const isPending = app.status === 'Pendiente';
                      const isChanges = app.status === 'Requiere cambios';

                      return (
                        <div
                          key={app.id}
                          className={`rounded-2xl border p-4 text-xs space-y-2 flex flex-col justify-between ${
                            isApproved
                              ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                              : isChanges
                              ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20'
                              : 'border-theme-subtle bg-theme-surface opacity-80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-theme-muted">{app.role}</span>
                              <span
                                className={`rounded-full px-2 py-0.2 text-[9px] font-black ${
                                  isApproved
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : isChanges
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-theme-muted/20 text-theme-muted'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                            <b className="text-theme-main block">{app.assignedTo}</b>
                            <p className="text-[10px] text-theme-muted mt-0.5">{app.humanTitle}</p>
                          </div>

                          <div className="pt-2 border-t border-theme-subtle text-[10px] text-theme-muted">
                            {app.date ? `Firmado: ${app.date}` : 'Pendiente de firma'}
                            {app.comments && <p className="mt-1 text-theme-main italic font-normal">"{app.comments}"</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: HISTORIAL (Bitácora Cronológica) */}
          {/* ==================================================== */}
          {activeTab === 'Historial' && (
            <div className="space-y-4">
              <div className="border-b border-theme-subtle pb-3">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Bitácora Cronológica del Expediente
                </h3>
                <p className="text-xs text-theme-muted">
                  Registro auditado de modificaciones, revisiones cargadas y firmas emitidas.
                </p>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-theme-subtle">
                {localCase.history.map((hist) => (
                  <div key={hist.id} className="relative space-y-1 text-xs">
                    <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-theme-surface bg-theme-primary" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-theme-main">{hist.action}</span>
                      <span className="text-[10px] font-mono text-theme-muted">{hist.date}</span>
                      <span className="text-[10px] text-theme-muted">por <b>{hist.user}</b></span>
                    </div>
                    <p className="text-theme-muted text-[11px]">{hist.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
