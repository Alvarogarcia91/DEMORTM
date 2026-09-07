import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  ShieldCheck,
  Clock,
  DollarSign,
  History,
  Building2,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Employee, EmployeePayroll, DayAttendance, VacationBalance, VacationRequest, EmployeeLoan } from '../../data/mockNominaData';
import { formatCurrency } from '../../utils/payrollDemoHelpers';

interface EmployeeDrawerProps {
  employee: Employee | null;
  payrollCalc?: EmployeePayroll;
  isOpen: boolean;
  onClose: () => void;
  vacationBalance?: VacationBalance;
  vacationRequests?: VacationRequest[];
  loans?: EmployeeLoan[];
}

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({
  employee,
  payrollCalc,
  isOpen,
  onClose,
  vacationBalance,
  vacationRequests = [],
  loans = [],
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'laboral' | 'fiscal' | 'asistencia' | 'nomina' | 'vacaciones' | 'prestamos' | 'historial'>('general');

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200 text-zinc-900 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary font-bold text-lg font-mono">
              {employee.numeroEmpleado.replace('RTM-', '')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950">{employee.nombre}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{employee.estatus}</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {employee.puesto} · <strong className="text-zinc-800">{employee.departamento}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (6 Tabs) */}
        <div className="flex items-center border-b border-zinc-200 px-6 bg-white overflow-x-auto gap-1">
          {[
            { id: 'general', label: '1. General', icon: User },
            { id: 'laboral', label: '2. Laboral', icon: Briefcase },
            { id: 'fiscal', label: '3. Fiscal', icon: ShieldCheck },
            { id: 'asistencia', label: '4. Asistencia', icon: Clock },
            { id: 'nomina', label: '5. Nómina', icon: DollarSign },
            { id: 'vacaciones', label: '6. Vacaciones', icon: Calendar },
            { id: 'prestamos', label: '7. Préstamos', icon: CreditCard },
            { id: 'historial', label: '8. Historial', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'border-theme-primary text-theme-primary'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Identificación Personal
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Número de Colaborador:</span>
                    <strong className="text-zinc-900 font-mono text-sm">{employee.numeroEmpleado}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Fecha de Ingreso a RTM:</span>
                    <strong className="text-zinc-900">{employee.fechaIngreso}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Correo Electrónico:</span>
                    <span className="text-zinc-900 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-theme-primary" />
                      {employee.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Teléfono Móvil:</span>
                    <span className="text-zinc-900 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-theme-primary" />
                      {employee.telefono}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Planta y Ubicación de Trabajo
                </span>
                <p className="text-zinc-800">
                  <strong>Planta Principal Reynosa</strong> · Av. Industrial del Norte #120, Parque Industrial del Norte, Reynosa, Tamaulipas.
                </p>
                <p className="text-[11px] text-zinc-500">
                  Centro de Costos: <strong>CC-PROD-{employee.departamento.toUpperCase().substring(0, 4)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: LABORAL */}
          {activeTab === 'laboral' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Condiciones Laborales en RTM
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-zinc-500 block">Puesto Actual:</span>
                    <strong className="text-zinc-900">{employee.puesto}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Departamento:</span>
                    <strong className="text-zinc-900">{employee.departamento}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Turno Asignado:</span>
                    <strong className="text-zinc-900">{employee.turno}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Frecuencia de Nómina:</span>
                    <span className="font-bold text-theme-primary">{employee.tipoNomina}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tipo de Contrato:</span>
                    <span className="text-zinc-900">{employee.tipoContrato}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Régimen de Contratación:</span>
                    <span className="text-zinc-900">{employee.regimenContratacion}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FISCAL */}
          {activeTab === 'fiscal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Datos Fiscales SAT & IMSS
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white shadow-2xs ${
                    employee.estadoFiscal === 'Validado SAT'
                      ? 'border border-emerald-500 text-zinc-900'
                      : 'border border-amber-500 text-zinc-900'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${employee.estadoFiscal === 'Validado SAT' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{employee.estadoFiscal}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">RFC con Homoclave:</span>
                    <strong className="text-zinc-900 text-xs">{employee.rfc}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">CURP:</span>
                    <strong className="text-zinc-900 text-xs">{employee.curp}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">NSS (Seguro Social):</span>
                    <strong className="text-zinc-900 text-xs">{employee.nss}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Código Postal Fiscal SAT:</span>
                    <strong className="text-zinc-900 text-xs">{employee.codigoPostalFiscal}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-[11px]">
                <p>
                  <strong>Cumplimiento CFDI Nómina 4.0:</strong> RTM valida automáticamente que el código postal fiscal coincida con la Constancia de Situación Fiscal emitida por el SAT para evitar rechazos en el timbrado.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ASISTENCIA */}
          {activeTab === 'asistencia' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Resumen de Asistencia · Semana 36
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 block">Horas Ordinarias</span>
                    <strong className="text-base font-mono text-zinc-900">48.0 h</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-200">
                    <span className="text-[10px] text-amber-800 block">Horas Extra</span>
                    <strong className="text-base font-mono text-amber-700">
                      {payrollCalc?.horasAdicionales ? `${payrollCalc.horasAdicionales} h` : '0 h'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block">Puntualidad</span>
                    <strong className="text-base font-mono text-emerald-700">100%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NÓMINA */}
          {activeTab === 'nomina' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Percepciones & Cuenta Bancaria
                </span>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Salario Diario (SD):</span>
                    <strong className="text-zinc-900 text-xs">{formatCurrency(employee.salarioDiario)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Salario Diario Integrado (SDI):</span>
                    <strong className="text-zinc-900 text-xs">{formatCurrency(employee.salarioDiarioIntegrado)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Banco Dispersor:</span>
                    <span className="text-zinc-900 font-sans font-semibold text-xs">{employee.banco}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Cuenta / CLABE:</span>
                    <strong className="text-zinc-900 text-xs">{employee.cuentaBancaria}</strong>
                  </div>
                </div>
              </div>

              {payrollCalc && (
                <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Percepciones Brutas:</span>
                    <strong className="font-mono text-zinc-900">{formatCurrency(payrollCalc.totalPercepciones)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Deducciones (ISR + IMSS):</span>
                    <strong className="font-mono text-rose-700">-{formatCurrency(payrollCalc.totalDeducciones)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-100 pt-2">
                    <span className="text-zinc-900">Neto a Pagar Estimado:</span>
                    <strong className="font-mono text-emerald-700 text-base">{formatCurrency(payrollCalc.netoAPagar)}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vacaciones' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">{[['Disponible',(vacationBalance?.assigned||0)-(vacationBalance?.enjoyed||0)-(vacationBalance?.scheduled||0)],['Disfrutado',vacationBalance?.enjoyed||0],['Programado',vacationBalance?.scheduled||0],['Pendiente',vacationBalance?.pending||0]].map(([label,value])=><div key={String(label)} className="p-3 rounded-xl border border-zinc-200 bg-white"><span className="text-[10px] uppercase font-bold text-zinc-500">{label}</span><b className="block font-mono mt-1">{value} días</b></div>)}</div>
              <p className="font-bold">Solicitudes recientes</p>
              {vacationRequests.length ? vacationRequests.map((request)=><div key={request.id} className="p-3 rounded-xl border border-zinc-200 bg-white text-xs"><b>{request.id}</b><span className="ml-2">{request.start} · {request.end} · {request.days} días</span><span className="float-right font-bold">{request.status}</span></div>) : <p className="text-zinc-500">Sin solicitudes registradas.</p>}
              <p className="text-xs text-zinc-500">Las vacaciones autorizadas se reflejan como incidencia en el ciclo activo.</p>
            </div>
          )}

          {activeTab === 'prestamos' && (
            <div className="space-y-4">
              {loans.length ? <>{<div className="grid grid-cols-3 gap-2"><div className="p-3 rounded-xl border border-zinc-200 bg-white"><span className="text-[10px] text-zinc-500">Saldo total</span><b className="block font-mono">{formatCurrency(loans.reduce((sum,loan)=>sum+loan.balance,0))}</b></div><div className="p-3 rounded-xl border border-zinc-200 bg-white"><span className="text-[10px] text-zinc-500">Retención próxima</span><b className="block font-mono">{formatCurrency(loans.filter(x=>x.status==='Activo').reduce((sum,loan)=>sum+loan.deduction,0))}</b></div><div className="p-3 rounded-xl border border-zinc-200 bg-white"><span className="text-[10px] text-zinc-500">Activos</span><b className="block font-mono">{loans.filter(x=>x.status==='Activo').length}</b></div></div>}{loans.map((loan)=><div key={loan.id} className="p-4 rounded-xl border border-zinc-200 bg-white"><b>{loan.id} · {loan.concept}</b><p className="mt-2 text-zinc-500">Original: {formatCurrency(loan.original)} · Saldo: {formatCurrency(loan.balance)} · Retención: {formatCurrency(loan.deduction)} semanal</p><div className="h-1.5 bg-zinc-200 rounded mt-3"><div className="h-full bg-theme-primary rounded" style={{width:`${loan.payments/loan.totalPayments*100}%`}}/></div><small>{loan.payments}/{loan.totalPayments} pagos · {loan.nextCycle}</small></div>)}</> : <div className="p-6 text-center rounded-xl border border-dashed border-zinc-300 text-zinc-500">Este colaborador no tiene préstamos o descuentos recurrentes activos.</div>}
            </div>
          )}

          {/* TAB 8: HISTORIAL */}
          {activeTab === 'historial' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Bitácora de Movimientos del Colaborador
              </span>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="p-3 rounded-xl border border-zinc-200 bg-white flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-400 text-[10px]">01-ene-2026</span>
                    <p className="font-sans font-bold text-zinc-900">Ajuste Salarial Anual Tabulador 2026</p>
                    <p className="font-sans text-zinc-500 text-[10px]">Incremento del 7.5% según tabulador sindical RTM.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 bg-white flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-400 text-[10px]">15-mar-2021</span>
                    <p className="font-sans font-bold text-zinc-900">Alta Inicial en Planta Reynosa</p>
                    <p className="font-sans text-zinc-500 text-[10px]">Contrato por tiempo indeterminado en línea de producción.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
