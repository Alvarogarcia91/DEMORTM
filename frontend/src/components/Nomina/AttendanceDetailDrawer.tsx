import React from 'react';
import { X, Clock, Calendar, User, CheckCircle2, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { Employee, DayAttendance } from '../../data/mockNominaData';

interface AttendanceDetailDrawerProps {
  employee: Employee | null;
  dayAttendance: DayAttendance | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceDetailDrawer: React.FC<AttendanceDetailDrawerProps> = ({
  employee,
  dayAttendance,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !employee || !dayAttendance) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200 text-zinc-900 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
                REGISTRO DIARIO DE ASISTENCIA
              </span>
              <span className="text-xs font-mono font-bold text-zinc-500">
                {dayAttendance.dia} {dayAttendance.fecha}
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-950 mt-1">{employee.nombre}</h3>
            <p className="text-xs text-zinc-500">
              {employee.puesto} · <strong>{employee.departamento}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Daily Timeline */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Marcajes Registrados en Reloj Biométrico (Planta Reynosa)
            </span>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {/* Entrada */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="p-3 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Entrada Turno</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">
                      {dayAttendance.entrada || 'Sin registro'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Torniquete Principal Acceso Planta</span>
                </div>
              </div>

              {/* Salida comida */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="p-3 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Salida Comedor</span>
                    <span className="font-mono font-bold text-zinc-700 text-xs">
                      {dayAttendance.salidaComida || '12:30'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Terminal Comedor Industrial RTM</span>
                </div>
              </div>

              {/* Regreso comida */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="p-3 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Regreso de Comida</span>
                    <span className="font-mono font-bold text-zinc-700 text-xs">
                      {dayAttendance.regresoComida || '13:00'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Terminal Comedor Industrial RTM</span>
                </div>
              </div>

              {/* Salida */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 ring-4 ring-white" />
                <div className="p-3 rounded-xl border border-zinc-200 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900">Salida Turno</span>
                    <span className={`font-mono font-bold text-xs ${dayAttendance.salida ? 'text-zinc-900' : 'text-rose-600 font-black'}`}>
                      {dayAttendance.salida || 'Sin checada (Omitida)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Torniquete Principal Salida Planta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculations Breakdown */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Desglose de Horas Computadas
            </span>
            <div className="flex justify-between text-zinc-600">
              <span>Jornada Programada:</span>
              <strong className="font-mono text-zinc-900">8.00 h</strong>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Horas Efectivas Reloj:</span>
              <strong className="font-mono text-zinc-900">{dayAttendance.horasTrabajadas.toFixed(2)} h</strong>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Horas Ordinarias Reconocidas:</span>
              <strong className="font-mono text-emerald-700">{Math.min(8, dayAttendance.horasTrabajadas).toFixed(2)} h</strong>
            </div>
            {dayAttendance.horasAdicionales > 0 && (
              <div className="flex justify-between text-amber-800">
                <span>Horas Adicionales / Extra:</span>
                <strong className="font-mono">+{dayAttendance.horasAdicionales.toFixed(2)} h</strong>
              </div>
            )}
            {dayAttendance.retardoMinutos > 0 && (
              <div className="flex justify-between text-rose-700">
                <span>Retardo Registrado:</span>
                <strong className="font-mono">-{dayAttendance.retardoMinutos} minutos</strong>
              </div>
            )}
          </div>

          {dayAttendance.detalle && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
              <strong>Incidencia o Detalle:</strong> {dayAttendance.detalle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
