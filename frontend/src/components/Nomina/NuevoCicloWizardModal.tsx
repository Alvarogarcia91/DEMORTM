import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  FileSpreadsheet,
  Edit3
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { Employee, PayrollPeriod, PayrollFrequency } from '../../data/mockNominaData';

interface NuevoCicloWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onCreateCycle: (newPeriod: PayrollPeriod) => void;
  initialValues?: Partial<PayrollPeriod>;
}

export const NuevoCicloWizardModal: React.FC<NuevoCicloWizardModalProps> = ({
  isOpen,
  onClose,
  employees,
  onCreateCycle,
  initialValues,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Types & Dates
  const [tipoNomina, setTipoNomina] = useState<PayrollFrequency>(initialValues?.tipo || 'Semanal');
  const [fechaInicio, setFechaInicio] = useState<string>(initialValues?.fechaInicio || '2026-09-07');
  const [fechaFin, setFechaFin] = useState<string>(initialValues?.fechaFin || '2026-09-13');
  const [fechaPago, setFechaPago] = useState<string>(initialValues?.fechaPago || '2026-09-14');
  const [nombreInterno, setNombreInterno] = useState<string>(
    initialValues?.nombre || 'Semanal · 07 – 13 sep 2026 · Planta Reynosa'
  );
  const [planta] = useState<string>('Planta Reynosa');

  // Step 2: Employee filter selection
  const [deptFilter, setDeptFilter] = useState<string>('TODOS');
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>(() => {
    // Only employees matching the frequency
    return employees
      .filter((e) => e.tipoNomina === (initialValues?.tipo || 'Semanal') && e.estatus === 'Activo')
      .map((e) => e.id);
  });

  // Step 3: Hours source
  const [horasSource, setHorasSource] = useState<'reloj' | 'manual' | 'cargadas'>('reloj');

  if (!isOpen) return null;

  // Auto-update selected employees when changing tipoNomina
  const handleTipoChange = (newTipo: PayrollFrequency) => {
    setTipoNomina(newTipo);
    if (newTipo === 'Semanal') {
      setFechaInicio('2026-09-07');
      setFechaFin('2026-09-13');
      setFechaPago('2026-09-14');
      setNombreInterno('Semanal · 07 – 13 sep 2026 · Planta Reynosa');
      setSelectedEmpIds(employees.filter((e) => e.tipoNomina === 'Semanal' && e.estatus === 'Activo').map((e) => e.id));
    } else {
      setFechaInicio('2026-09-01');
      setFechaFin('2026-09-15');
      setFechaPago('2026-09-15');
      setNombreInterno('Quincenal · 01 – 15 sep 2026 · Planta Reynosa');
      setSelectedEmpIds(employees.filter((e) => e.tipoNomina === 'Quincenal' && e.estatus === 'Activo').map((e) => e.id));
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const eligibleEmployees = employees.filter((e) => e.tipoNomina === tipoNomina);
  const filteredEligible = eligibleEmployees.filter(
    (e) => deptFilter === 'TODOS' || e.departamento === deptFilter
  );

  const handleFinish = () => {
    const isSemanal = tipoNomina === 'Semanal';
    const newCode = isSemanal ? 'SEM-2026-37' : 'QN-2026-17';
    const newPeriod: PayrollPeriod = {
      id: `per-${Date.now()}`,
      codigo: newCode,
      nombre: nombreInterno,
      tipo: tipoNomina,
      fechaInicio,
      fechaFin,
      fechaPago,
      estado: 'borrador',
      totalEmpleados: selectedEmpIds.length,
      percepcionesTotales: isSemanal ? 115200.00 : 58900.00,
      deduccionesTotales: isSemanal ? 12800.00 : 7820.00,
      netoTotal: isSemanal ? 102400.00 : 51080.00,
      horasExtraTotales: isSemanal ? 24.5 : 0,
      incidenciasTotales: 0,
    };

    onCreateCycle(newPeriod);
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Nuevo Ciclo de Nómina</h3>
              <p className="text-xs text-zinc-500">
                Paso {step} de 4 · {step === 1 ? 'Tipo y Fechas' : step === 2 ? 'Colaboradores Incluidos' : step === 3 ? 'Fuente de Horas' : 'Resumen y Confirmación'}
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

        {/* Stepper indicator */}
        <div className="px-6 py-2.5 bg-zinc-100/70 border-b border-zinc-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-theme-primary' : 'text-zinc-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">1</span>
            <span>Fechas</span>
          </div>
          <span className="text-zinc-300">&rarr;</span>

          <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-theme-primary' : 'text-zinc-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">2</span>
            <span>Colaboradores</span>
          </div>
          <span className="text-zinc-300">&rarr;</span>

          <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-theme-primary' : 'text-zinc-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">3</span>
            <span>Horas</span>
          </div>
          <span className="text-zinc-300">&rarr;</span>

          <div className={`flex items-center gap-1.5 font-bold ${step === 4 ? 'text-theme-primary' : 'text-zinc-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">4</span>
            <span>Resumen</span>
          </div>
        </div>

        {/* Body per Step */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-4 text-xs">
          {/* STEP 1: TIPO Y FECHAS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 block">Tipo de Nómina:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTipoChange('Semanal')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tipoNomina === 'Semanal'
                        ? 'border-theme-primary bg-theme-primary/5 text-theme-primary font-bold shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Semanal (Operativa)</div>
                    <div className="text-[10px] text-zinc-500 font-normal mt-0.5">24 colaboradores de planta</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipoChange('Quincenal')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tipoNomina === 'Quincenal'
                        ? 'border-theme-primary bg-theme-primary/5 text-theme-primary font-bold shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Quincenal (Administrativa)</div>
                    <div className="text-[10px] text-zinc-500 font-normal mt-0.5">6 colaboradores administrativos</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Fecha Inicio:</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white font-mono text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Fecha Fin:</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white font-mono text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 block">Fecha de Pago:</label>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white font-mono text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Planta:</label>
                <input
                  type="text"
                  disabled
                  value={planta}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500 text-xs font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 block">Nombre / Descripción interna:</label>
                <input
                  type="text"
                  value={nombreInterno}
                  onChange={(e) => setNombreInterno(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs focus:ring-2 focus:ring-theme-primary/20 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: EMPLEADOS INCLUIDOS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-blue-900 text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>
                    <strong>{selectedEmpIds.length}</strong> colaboradores {tipoNomina.toLowerCase()}s seleccionados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEmpIds(eligibleEmployees.map((e) => e.id))}
                    className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Seleccionar todos ({eligibleEmployees.length})
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setSelectedEmpIds([])}
                    className="text-[11px] font-bold text-zinc-600 hover:underline cursor-pointer"
                  >
                    Deseleccionar
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-semibold">Filtrar por Departamento:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs bg-white"
                >
                  <option value="TODOS">Todos los departamentos</option>
                  {Array.from(new Set(eligibleEmployees.map((e) => e.departamento))).map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500">
                    <tr>
                      <th className="p-2 w-8 text-center">✓</th>
                      <th className="p-2">Colaborador</th>
                      <th className="p-2">Puesto</th>
                      <th className="p-2">Depto</th>
                      <th className="p-2">Turno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredEligible.map((emp) => {
                      const isChecked = selectedEmpIds.includes(emp.id);
                      return (
                        <tr
                          key={emp.id}
                          onClick={() => toggleEmployeeSelection(emp.id)}
                          className="hover:bg-zinc-50 transition-colors cursor-pointer"
                        >
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleEmployeeSelection(emp.id)}
                              className="rounded border-zinc-300 text-theme-primary focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-2 font-semibold text-zinc-900">{emp.nombre}</td>
                          <td className="p-2 text-zinc-500 text-[11px]">{emp.puesto}</td>
                          <td className="p-2 text-zinc-600">{emp.departamento}</td>
                          <td className="p-2 text-zinc-500 text-[10px]">{emp.turno.split(' ')[0]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: FUENTE DE HORAS */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in">
              <label className="font-bold text-zinc-800 block">
                Selecciona la fuente inicial de horas y checadas para este ciclo:
              </label>

              <div className="space-y-2.5">
                <div
                  onClick={() => setHorasSource('reloj')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    horasSource === 'reloj'
                      ? 'border-theme-primary bg-theme-primary/5 shadow-xs'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fuenteHoras"
                    checked={horasSource === 'reloj'}
                    onChange={() => setHorasSource('reloj')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 text-xs">
                      Importar checadas del reloj biométrico (Planta Reynosa)
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Carga masiva de marcajes de huella/tarjeta para los {selectedEmpIds.length} colaboradores seleccionados.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setHorasSource('manual')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    horasSource === 'manual'
                      ? 'border-theme-primary bg-theme-primary/5 shadow-xs'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fuenteHoras"
                    checked={horasSource === 'manual'}
                    onChange={() => setHorasSource('manual')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 text-xs">
                      Captura manual de horas en piso
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Permite capturar horas ordinarias y extras por empleado o mediante la tabla masiva semanal.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setHorasSource('cargadas')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    horasSource === 'cargadas'
                      ? 'border-theme-primary bg-theme-primary/5 shadow-xs'
                      : 'border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="fuenteHoras"
                    checked={horasSource === 'cargadas'}
                    onChange={() => setHorasSource('cargadas')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 text-xs">
                      Usar checadas precargadas de demostración
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Inicializa el ciclo con las 1,284 checadas y las 5 incidencias documentadas de RTM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESUMEN */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-900 text-sm">{nombreInterno}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-800">
                    Estado Inicial: Borrador
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 pt-1">
                  <div>
                    <span className="text-zinc-400 font-medium">Periodo:</span>{' '}
                    <span className="font-mono font-semibold text-zinc-900">{fechaInicio} al {fechaFin}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Fecha de Pago:</span>{' '}
                    <span className="font-mono font-semibold text-zinc-900">{fechaPago}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Tipo:</span>{' '}
                    <span className="font-semibold text-zinc-900">{tipoNomina}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium">Colaboradores:</span>{' '}
                    <span className="font-mono font-bold text-zinc-900">{selectedEmpIds.length} empleados</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-400 font-medium">Fuente de Horas:</span>{' '}
                    <span className="font-semibold text-zinc-900">
                      {horasSource === 'reloj'
                        ? 'Importación reloj biométrico'
                        : horasSource === 'manual'
                        ? 'Captura manual semanal'
                        : 'Checadas precargadas de demo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Al confirmar se creará el ciclo en estado <strong>Borrador</strong> y se activará para comenzar la captura de horas, resolución de incidencias y conciliación contra producción.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Crear ciclo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
