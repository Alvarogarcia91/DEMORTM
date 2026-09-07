import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileClock,
  Layers,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  PpapCase,
  PpapSystemSuggestion,
} from '../../../data/mockPpapData';

interface Props {
  cases: PpapCase[];
  suggestions: PpapSystemSuggestion[];
  onOpenCase: (ppapCase: PpapCase, initialTab?: string) => void;
  onNewCase: () => void;
  onSelectSuggestionAction?: (suggestion: PpapSystemSuggestion) => void;
}

export const PpapDashboard: React.FC<Props> = ({
  cases,
  suggestions,
  onOpenCase,
  onNewCase,
  onSelectSuggestionAction,
}) => {
  // Métricas ejecutivas
  const activeCases = cases.length;
  const readyForReview = cases.filter(
    (c) => c.status === 'En revisión con Calidad' || c.completionPercentage >= 90
  ).length;
  const pendingClient = cases.filter((c) => c.status === 'Pendiente del cliente').length;
  const missingInfo = cases.filter(
    (c) => c.status === 'Pendiente de información' || c.status === 'Requiere actualización'
  ).length;
  const approved = cases.filter((c) => c.status === 'Aprobado').length + 1; // 1 cerrado demo
  const requireAttention = cases.filter(
    (c) => c.status === 'En preparación' || c.attentionNote
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
              ASEGURAMIENTO DE CALIDAD · AIAG PPAP 4TH ED.
            </span>
            <span className="text-[11px] text-theme-muted font-medium">Core Tools Integradas</span>
          </div>
          <h1 className="text-2xl font-black text-theme-main tracking-tight">PPAP & Core Tools</h1>
          <p className="text-xs text-theme-muted max-w-3xl mt-0.5">
            Seguimiento de expedientes de aprobación de parte, evidencias de proceso y documentación de calidad por cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewCase}
          className="flex items-center gap-2 rounded-2xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="h-4 w-4" />
          + Nuevo expediente PPAP
        </button>
      </div>

      {/* 6 KPIs Ejecutivos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 text-xs">
        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-[11px] font-semibold">Expedientes activos</span>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <p className="font-mono text-2xl font-black text-theme-main">{activeCases}</p>
          <p className="text-[10px] text-theme-muted mt-1">4 clientes clave</p>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-[11px] font-semibold">Listos para revisión</span>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">{readyForReview}</p>
          <p className="text-[10px] text-theme-muted mt-1">≥ 90% de evidencia</p>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-[11px] font-semibold">Pendientes cliente</span>
            <FileClock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400">{pendingClient}</p>
          <p className="text-[10px] text-theme-muted mt-1">PSW en dictamen</p>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-[11px] font-semibold">Info faltante</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400">{missingInfo}</p>
          <p className="text-[10px] text-theme-muted mt-1">Requiere acción</p>
        </div>

        <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-theme-muted mb-2">
            <span className="text-[11px] font-semibold">Aprobados periodo</span>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="font-mono text-2xl font-black text-theme-main">{approved}</p>
          <p className="text-[10px] text-theme-muted mt-1">Con PSW emitido</p>
        </div>

        <div className="rounded-2xl border border-amber-400/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 mb-2">
            <span className="text-[11px] font-black">Requieren atención</span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <p className="font-mono text-2xl font-black text-amber-700 dark:text-amber-300">{requireAttention}</p>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-400 mt-1">Desfases de AMEF/medición</p>
        </div>
      </div>

      {/* Bloque: Requieren tu atención */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-theme-main">
              Requieren tu atención inmediata
            </h2>
          </div>
          <span className="text-[11px] text-theme-muted">
            Casos con bloqueos técnicos o listos para firma
          </span>
        </div>

        <div className="grid gap-3.5 md:grid-cols-3">
          {/* Card 1: Panasonic */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-md bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-black text-amber-800 dark:text-amber-300">
                  PFMEA DESACTUALIZADO
                </span>
                <span className="text-[11px] font-mono font-bold text-theme-muted">78% completo</span>
              </div>
              <h3 className="font-bold text-theme-main text-sm">Panasonic · 526412 · Rev H</h3>
              <p className="text-[11px] text-theme-muted mt-1 line-clamp-2">
                El PFMEA sigue ligado a la Rev G anterior. Requiere actualización técnica antes de completar el expediente.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-medium">Meta: 18 Sep</span>
              <button
                type="button"
                onClick={() => {
                  const target = cases.find((c) => c.id === 'ppap-panasonic-526412');
                  if (target) onOpenCase(target, 'Riesgos');
                }}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Revisar expediente <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: TRICO */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-black text-blue-800 dark:text-blue-300">
                  FALTA MEDICIÓN
                </span>
                <span className="text-[11px] font-mono font-bold text-theme-muted">92% completo</span>
              </div>
              <h3 className="font-bold text-theme-main text-sm">TRICO · IS-2420 · Rev I-01</h3>
              <p className="text-[11px] text-theme-muted mt-1 line-clamp-2">
                Falta evidencia dimensional de la corrida inicial (5 lecturas de espesor de doblez plegado).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-medium">Meta: 15 Sep</span>
              <button
                type="button"
                onClick={() => {
                  const target = cases.find((c) => c.id === 'ppap-trico-is2420');
                  if (target) onOpenCase(target, 'Resultados');
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
              >
                Agregar resultados <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Stanley Black & Decker */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                  100% COMPLETO
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600">PSW Firmado</span>
              </div>
              <h3 className="font-bold text-theme-main text-sm">BLACK & DECKER · NA472050 · Rev 08/23</h3>
              <p className="text-[11px] text-theme-muted mt-1 line-clamp-2">
                Expediente completo y firmado internamente. Esperando acuse de recibo y dictamen del cliente.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-[10px] text-theme-muted font-medium">Meta: 12 Sep</span>
              <button
                type="button"
                onClick={() => {
                  const target = cases.find((c) => c.id === 'ppap-blackdecker-na472050');
                  if (target) onOpenCase(target, 'Aprobaciones');
                }}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Revisar para envío <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque: Sugerencias SMART Moradas del Sistema */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 animate-spin-slow" />
            <h2 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
              Sugerencias del sistema · Integridad Core Tools
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {suggestions.map((sug) => {
              const matchingCase = cases.find((c) => c.id === sug.caseId);
              return (
                <div
                  key={sug.id}
                  className="rounded-3xl border-2 border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/40 dark:from-purple-950/20 dark:via-theme-surface dark:to-purple-950/10 p-5 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 dark:text-purple-400">
                          ✦ SUGERENCIA DEL SISTEMA
                        </span>
                        <h4 className="font-bold text-theme-main text-xs">{sug.title}</h4>
                      </div>
                    </div>
                    {matchingCase && (
                      <span className="rounded-full bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300 shrink-0">
                        {matchingCase.partNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-theme-muted leading-relaxed">{sug.description}</p>

                  <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-purple-50/80 dark:bg-purple-950/30 p-3 text-[11px] text-purple-950 dark:text-purple-200">
                    <span className="font-bold">Acción preventiva sugerida:</span> {sug.recommendation}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (matchingCase) {
                          onOpenCase(matchingCase, sug.actionTabTarget || 'Resumen');
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 shadow-xs transition-colors"
                    >
                      {sug.actionLabel} &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
