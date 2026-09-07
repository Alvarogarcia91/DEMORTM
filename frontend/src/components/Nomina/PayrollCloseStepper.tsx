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


  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-3 sm:p-3.5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2.5 mb-2.5 border-b border-zinc-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
            Flujo de Cierre
          </span>
          <span className="text-xs font-semibold text-zinc-900">
            {period.nombre}
          </span>
          <span className="text-[11px] text-zinc-400">·</span>
          <span className="text-[11px] text-zinc-500">
            Corte: <span className="font-medium text-zinc-700">31 ago – 06 sep</span> · Pago: <span className="font-medium text-zinc-700">07 sep</span>
          </span>
        </div>

        {/* State Notice Pill */}
        <div className="flex items-center text-xs">
          {isTimbrada ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Timbrada al 100% · Dispersión lista</span>
            </div>
          ) : isCerrada ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-medium border border-blue-200/70">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Nómina cerrada · Lista para timbrado</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-medium border border-amber-200/70">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                {incidenciasPendientesCount > 0
                  ? `${incidenciasPendientesCount} incidencias pendientes antes de cerrar`
                  : 'Asistencia validada · Proceder a pre-nómina'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const isCurrentTab = activeTab === step.targetTab;
          return (
            <div
              key={step.id}
              onClick={() => onSelectTab(step.targetTab)}
              className={`group px-2.5 py-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrentTab
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-100/70 text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span className={`text-[11px] font-bold truncate ${isCurrentTab ? 'text-white' : 'text-zinc-900'}`}>
                  {step.label}
                </span>
                <div>
                  {step.status === 'completo' && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCurrentTab ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Listo</span>
                    </span>
                  )}
                  {step.status === 'requiere_atencion' && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCurrentTab ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Atención</span>
                    </span>
                  )}
                  {step.status === 'cerrado' && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCurrentTab ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                      <span>Cerrado</span>
                    </span>
                  )}
                  {step.status === 'pendiente' && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-medium ${
                      isCurrentTab ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white text-zinc-500 border border-zinc-200'
                    }`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>Pendiente</span>
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                isCurrentTab ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200/70 text-zinc-500'
              }`}>
                <span className="font-mono truncate">{step.badgeText}</span>
                <span className={`flex items-center gap-0.5 font-medium shrink-0 ${
                  isCurrentTab ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-800'
                }`}>
                  <span>Ver</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
