import React, { useState } from 'react';
import {
  X,
  Edit3,
  CheckCircle2,
  Calendar,
  Save,
  Users,
  RotateCcw,
  Clock
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { Employee, AttendanceWeek, DayAttendance } from '../../data/mockNominaData';

interface CapturaHorasModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  attendanceWeeks: AttendanceWeek[];
  onSaveAttendance: (updatedWeeks: AttendanceWeek[]) => void;
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CapturaHorasModal: React.FC<CapturaHorasModalProps> = ({
  isOpen,
  onClose,
  employees,
  attendanceWeeks,
  onSaveAttendance,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'masiva'>('individual');

  // Mode 1: Individual
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'RTM-001');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [inputEntrada, setInputEntrada] = useState<string>('07:00');
  const [inputSalida, setInputSalida] = useState<string>('15:00');
  const [inputHorasOrd, setInputHorasOrd] = useState<number>(8.0);
  const [inputHorasExt, setInputHorasExt] = useState<number>(0.0);
  const [inputMotivo, setInputMotivo] = useState<string>('Ajuste manual de supervisor');
  const [inputObservacion, setInputObservacion] = useState<string>('Registro completado en piso');

  // Mode 2: Masiva semanal (empleadoId -> dayIndex -> hours)
  const [gridHours, setGridHours] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    employees.forEach((emp) => {
      const week = attendanceWeeks.find((w) => w.empleadoId === emp.id);
      if (week) {
        init[emp.id] = week.dias.map((d) => d.horasTrabajadas);
      } else {
        init[emp.id] = [8.0, 8.0, 8.0, 8.0, 8.0, 8.0];
      }
    });
    return init;
  });

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const currentWeek = attendanceWeeks.find((w) => w.empleadoId === selectedEmpId);
  const daysList = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Handle individual save
  const handleSaveIndividual = () => {
    if (!currentWeek) return;

    const updatedDays = currentWeek.dias.map((d, idx) => {
      if (idx === selectedDayIdx) {
        return {
          ...d,
          entrada: inputEntrada,
          salida: inputSalida,
          horasTrabajadas: inputHorasOrd,
          horasAdicionales: inputHorasExt,
          tipoDia: (inputHorasExt > 0 ? 'ordinario' : d.tipoDia) as DayAttendance['tipoDia'],
          detalle: `${inputMotivo}: ${inputObservacion}`,
        };
      }
      return d;
    });

    const totalOrd = updatedDays.reduce((acc, d) => acc + d.horasTrabajadas, 0);
    const totalExt = updatedDays.reduce((acc, d) => acc + d.horasAdicionales, 0);

    const updatedWeek: AttendanceWeek = {
      ...currentWeek,
      dias: updatedDays,
      totalHorasOrdinarias: totalOrd,
      totalHorasAdicionales: totalExt,
      estadoRevision: 'completo',
    };

    const newWeeks = attendanceWeeks.map((w) => (w.empleadoId === selectedEmpId ? updatedWeek : w));
    onSaveAttendance(newWeeks);
    onTriggerToast(`Horas actualizadas para ${currentEmp.nombre} (${daysList[selectedDayIdx]})`, 'success');
  };

  // Handle mass save
  const handleSaveMassive = () => {
    const newWeeks = attendanceWeeks.map((w) => {
      const empGrid = gridHours[w.empleadoId];
      if (!empGrid) return w;

      const updatedDays = w.dias.map((d, idx) => ({
        ...d,
        horasTrabajadas: empGrid[idx] !== undefined ? empGrid[idx] : d.horasTrabajadas,
      }));

      const totalOrd = updatedDays.reduce((acc, d) => acc + d.horasTrabajadas, 0);

      return {
        ...w,
        dias: updatedDays,
        totalHorasOrdinarias: totalOrd,
      };
    });

    onSaveAttendance(newWeeks);
    onTriggerToast(`Captura masiva guardada exitosamente para ${employees.length} colaboradores`, 'success');
    onClose();
  };

  const handleCellChange = (empId: string, dayIdx: number, val: string) => {
    const num = parseFloat(val) || 0;
    setGridHours((prev) => {
      const currentArr = prev[empId] ? [...prev[empId]] : [8, 8, 8, 8, 8, 8];
      currentArr[dayIdx] = Math.max(0, Math.min(16, num));
      return {
        ...prev,
        [empId]: currentArr,
      };
    });
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Captura de Horas en Planta</h3>
              <p className="text-xs text-zinc-500">
                Ajustes manuales de entradas, salidas, horas ordinarias y extras por supervisor
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

        {/* Tab switch */}
        <div className="px-6 py-2 bg-zinc-100/70 border-b border-zinc-200 flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('individual')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'individual'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Captura Individual por Colaborador
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('masiva')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'masiva'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Captura Masiva Semanal (Tabla Editable)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'individual' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Colaborador:</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-medium"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre} ({emp.numeroEmpleado} · {emp.departamento})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Día a capturar:</label>
                  <div className="grid grid-cols-6 gap-1">
                    {daysList.map((d, idx) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`py-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          selectedDayIdx === idx
                            ? 'border-theme-primary bg-theme-primary/10 text-theme-primary'
                            : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day values */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Entrada:</label>
                  <input
                    type="time"
                    value={inputEntrada}
                    onChange={(e) => setInputEntrada(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Salida:</label>
                  <input
                    type="time"
                    value={inputSalida}
                    onChange={(e) => setInputSalida(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Horas Ordinarias:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="12"
                    value={inputHorasOrd}
                    onChange={(e) => setInputHorasOrd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Horas Adicionales (Extras):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="8"
                    value={inputHorasExt}
                    onChange={(e) => setInputHorasExt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono font-bold text-amber-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Motivo del registro:</label>
                  <input
                    type="text"
                    value={inputMotivo}
                    onChange={(e) => setInputMotivo(e.target.value)}
                    placeholder="Ej. Checada omitida / Tiempo extra autorizado"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Observaciones adicionales:</label>
                  <input
                    type="text"
                    value={inputObservacion}
                    onChange={(e) => setInputObservacion(e.target.value)}
                    placeholder="Ej. Autorizado por supervisor de turno"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveIndividual}
                  className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Aplicar ajuste a este colaborador</span>
                </button>
              </div>
            </div>
          ) : (
            /* MASIVA SEMANAL */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-600">
                <p className="text-[11px]">
                  Edita directamente las horas diarias de cada colaborador. El total semanal se calcula en tiempo real.
                </p>
                <span className="text-[11px] font-mono text-zinc-500">
                  {employees.length} colaboradores
                </span>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500 sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5">Colaborador</th>
                      <th className="p-2 text-center w-16">Lun</th>
                      <th className="p-2 text-center w-16">Mar</th>
                      <th className="p-2 text-center w-16">Mié</th>
                      <th className="p-2 text-center w-16">Jue</th>
                      <th className="p-2 text-center w-16">Vie</th>
                      <th className="p-2 text-center w-16">Sáb</th>
                      <th className="p-2 text-center w-20">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {employees.map((emp) => {
                      const hours = gridHours[emp.id] || [8, 8, 8, 8, 8, 8];
                      const total = hours.reduce((a, b) => a + b, 0);

                      return (
                        <tr key={emp.id} className="hover:bg-zinc-50/70">
                          <td className="p-2">
                            <div className="font-semibold text-zinc-900 truncate max-w-[180px]">
                              {emp.nombre}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {emp.numeroEmpleado} · {emp.departamento}
                            </div>
                          </td>

                          {hours.map((val, dIdx) => (
                            <td key={dIdx} className="p-1 text-center">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="16"
                                value={val}
                                onChange={(e) => handleCellChange(emp.id, dIdx, e.target.value)}
                                className="w-14 text-center py-1 rounded border border-zinc-200 font-mono text-xs font-semibold focus:bg-blue-50 focus:border-blue-400 outline-none"
                              />
                            </td>
                          ))}

                          <td className="p-2 text-center font-mono font-bold text-zinc-900 bg-zinc-50">
                            {total.toFixed(1)} h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          {activeTab === 'masiva' && (
            <button
              type="button"
              onClick={handleSaveMassive}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar captura masiva</span>
            </button>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
