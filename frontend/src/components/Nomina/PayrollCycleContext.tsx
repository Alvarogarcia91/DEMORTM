import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { PayrollPeriod } from '../../data/mockNominaData';

interface CycleContextProps {
  period: PayrollPeriod;
  incidenciasPendientes: number;
  empleadosPorRevisar: number;
  isCerrada: boolean;
  isTimbrada: boolean;
  onGoToPrePayroll?: () => void;
}

export const PrePayrollCycleContext: React.FC<CycleContextProps> = ({
  period,
  incidenciasPendientes,
  empleadosPorRevisar,
  isCerrada,
  isTimbrada,
}) => (
  <section className="rounded-2xl border border-theme-subtle bg-theme-surface px-4 py-3 shadow-2xs">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-theme-primary/30 text-theme-primary">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-theme-primary">Preparación de cierre</p>
          <p className="mt-0.5 text-xs font-bold text-theme-main">Ciclo {period.codigo} · {isCerrada ? 'Cerrado' : 'En revisión'}</p>
          <p className="mt-0.5 text-[11px] text-theme-muted">{isTimbrada ? 'CFDI emitidos para este ciclo.' : isCerrada ? 'Validación completada; el ciclo puede pasar a Timbrado.' : 'Revisa los pendientes antes de autorizar el cierre.'}</p>
        </div>
      </div>
      {!isCerrada && <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-theme-surface px-2.5 py-1.5 text-theme-main"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{empleadosPorRevisar} empleados por revisar</span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-theme-surface px-2.5 py-1.5 text-theme-main"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />{incidenciasPendientes} incidencias abiertas</span>
      </div>}
    </div>
  </section>
);

export const StampCycleContext: React.FC<CycleContextProps> = ({ period, isCerrada, isTimbrada, onGoToPrePayroll }) => (
  <section className="rounded-2xl border border-theme-subtle bg-theme-surface px-4 py-3 shadow-2xs">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${isTimbrada ? 'border-emerald-400 text-emerald-700' : isCerrada ? 'border-blue-400 text-blue-700' : 'border-amber-400 text-amber-700'}`}>
          {isTimbrada ? <CheckCircle2 className="h-4 w-4" /> : isCerrada ? <Lock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        </span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-theme-primary">Contexto del ciclo</p>
          <p className="mt-0.5 text-xs font-bold text-theme-main">Ciclo {period.codigo} · {isTimbrada ? 'Timbrado completo' : isCerrada ? 'Cerrado · Listo para timbrar' : 'Requiere cierre'}</p>
        </div>
      </div>
      {!isCerrada && <button onClick={onGoToPrePayroll} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-theme-primary px-3 py-2 text-xs font-bold text-theme-primary transition-colors hover:bg-theme-muted"><span>Ir a Pre-nómina</span><ArrowRight className="h-3.5 w-3.5" /></button>}
    </div>
  </section>
);
