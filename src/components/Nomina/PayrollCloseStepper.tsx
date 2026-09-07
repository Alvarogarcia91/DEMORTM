import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { PayrollPeriod } from '../../data/mockNominaData';

export type StepperStepId = 'checadas' | 'incidencias' | 'prenomina' | 'autorizacion' | 'timbrado';

interface StepConfig {
  id: StepperStepId;
  label: string;
  stepNumber: number;
  status: 'completo' | 'requiere_atencion' | 'pendiente' | 'cerrado';
  badgeText: string;
  targetTab: string;
}

interface PayrollCloseStepperProps {
  period: PayrollPeriod;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  incidenciasPendientesCount: number;
  empleadosRequierenRevisionCount: number;
  isTimbrada: boolean;
  isCerrada: boolean;
}

export const PayrollCloseStepper: React.FC<PayrollCloseStepperProps> = ({
  period,
  activeTab,
  onSelectTab,
  incidenciasPendientesCount,
  empleadosRequierenRevisionCount,
  isTimbrada,
  isCerrada,
}) => {
  const steps: StepConfig[] = [
    {
      id: 'checadas',
      label: '1. Checadas',
      stepNumber: 1,
      status: 'completo',
      badgeText: '1,284 validadas',
      targetTab: 'asistencia',
    },
    {
      id: 'incidencias',
      label: '2. Incidencias',
      stepNumber: 2,
      status: incidenciasPendientesCount > 0 ? 'requiere_atencion' : 'completo',
      badgeText: incidenciasPendientesCount > 0 ? `${incidenciasPendientesCount} abiertas` : '5 resueltas',
      targetTab: 'incidencias',
    },
    {
      id: 'prenomina',
      label: '3. Pre-nómina',
      stepNumber: 3,
      status: empleadosRequierenRevisionCount > 0 ? 'requiere_atencion' : 'completo',
      badgeText: empleadosRequierenRevisionCount > 0 ? `${empleadosRequierenRevisionCount} por revisar` : '30 calculados',
      targetTab: 'prenomina',
    },
    {
      id: 'autorizacion',
      label: '4. Autorización',
      stepNumber: 4,
      status: isCerrada ? 'cerrado' : period.estado === 'autorizada' ? 'completo' : 'pendiente',
      badgeText: isCerrada ? 'Nómina cerrada' : period.estado === 'autorizada' ? 'Autorizada' : 'En revisión',
      targetTab: 'prenomina',
    },
    {
      id: 'timbrado',
      label: '5. Timbrado',
      stepNumber: 5,
      status: isTimbrada ? 'completo' : isCerrada ? 'requiere_atencion' : 'pendiente',
      badgeText: isTimbrada ? '30/30 CFDI' : isCerrada ? 'Listo p/ timbrar' : 'Pendiente cierre',
      targetTab: 'timbrado',
    },
  ];

  const getStatusBadge = (status: StepConfig['status']) => {
    switch (status) {
      case 'completo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Completo</span>
          </span>
        );
      case 'requiere_atencion':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Atención</span>
          </span>
        );
      case 'cerrado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>Cerrado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-700 border border-zinc-300 shadow-2xs">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
      {/* Top row: Period Context & General Status message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              ASISTENTE DE CIERRE DE NÓMINA
            </span>
            <span className="text-xs font-bold text-zinc-950">
              {period.nombre}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Corte: <strong>31 ago – 06 sep 2026</strong> · Fecha de pago programada: <strong>07 sep 2026</strong>
          </p>
        </div>

        {/* State Notice Banner */}
        <div className="flex items-center gap-2 text-xs">
          {isTimbrada ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Nómina timbrada al 100% · Lista para dispersión bancaria</span>
            </div>
          ) : isCerrada ? (
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Nómina cerrada · Lista para ejecución de timbrado CFDI</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>
                {incidenciasPendientesCount > 0
                  ? `${incidenciasPendientesCount} incidencias requieren revisión antes de cerrar la nómina`
                  : 'Validaciones de asistencia listas · Proceder a pre-nómina'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((step) => {
          const isCurrentTab = activeTab === step.targetTab;
          return (
            <div
              key={step.id}
              onClick={() => onSelectTab(step.targetTab)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrentTab
                  ? 'border-2 border-theme-primary bg-white shadow-xs ring-2 ring-theme-primary/10'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-zinc-950">{step.label}</span>
                {getStatusBadge(step.status)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-600 mt-1 pt-1.5 border-t border-zinc-100">
                <span className="font-mono text-[10px] text-zinc-500">{step.badgeText}</span>
                <span className="text-[10px] font-semibold text-theme-primary flex items-center gap-0.5">
                  <span>Ir</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
