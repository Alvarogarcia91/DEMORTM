import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import {
  MachineShiftCoverage,
  PLANT_SKILLS,
  PlantSkill,
  ShiftCoverageDetail,
} from '../../../data/mockCompetenciasData';

interface PlantCoverageProps {
  employees: Employee[];
  coverages: MachineShiftCoverage[];
  onOpenEmployeeProfile: (employeeId: string) => void;
  onProgramTrainingForMachine: (machineId: string) => void;
}

export const PlantCoverage: React.FC<PlantCoverageProps> = ({
  employees,
  coverages,
  onOpenEmployeeProfile,
  onProgramTrainingForMachine,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('Todas las áreas');
  const [selectedMachineModal, setSelectedMachineModal] = useState<MachineShiftCoverage | null>(null);

  const filteredCoverages = coverages.filter((c) => {
    return selectedArea === 'Todas las áreas' || c.area === selectedArea;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Cabecera y Filtros */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Cobertura de Planta por Máquina y Proceso
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Identifica disponibilidad de operadores autorizados y turnos con riesgo de falta de respaldo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400">Área:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="Todas las áreas">Todas las áreas</option>
              <option value="Flexografía">Flexografía</option>
              <option value="Offset">Offset</option>
              <option value="Acabados">Acabados</option>
              <option value="Calidad">Calidad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Máquinas / Procesos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCoverages.map((cov) => {
          const isCritical = cov.overallStatus === 'Crítica sin respaldo';
          const isLimited = cov.overallStatus === 'Cobertura limitada';

          return (
            <div
              key={cov.machineId}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : isLimited
                  ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/15 dark:bg-amber-950/10'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="space-y-3">
                {/* Header de la Card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      {cov.area}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">{cov.machineName}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      cov.overallStatus === 'Cobertura suficiente'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isCritical
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {cov.overallStatus}
                  </span>
                </div>

                {cov.criticalAlert && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <p className="leading-snug">{cov.criticalAlert}</p>
                  </div>
                )}

                {/* Desglose por Turno */}
                <div className="space-y-2 pt-1">
                  {cov.turnos.map((t) => (
                    <div
                      key={t.shift}
                      className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{t.shift}</span>
                        <span className="text-[10px] text-zinc-500">
                          {t.authorizedCount} autorizado(s) · {t.inTrainingCount} en entrenamiento
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold ${
                          t.status === 'Cobertura suficiente'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {t.status === 'Cobertura suficiente' ? '✓ Cobertura suficiente' : '⚠ Cobertura limitada'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMachineModal(cov)}
                  className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1"
                >
                  <span>Ver personal disponible</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onProgramTrainingForMachine(cov.machineId)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-2xs"
                >
                  + Capacitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle de Personal Disponible */}
      {selectedMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  {selectedMachineModal.area}
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {selectedMachineModal.machineName} · Personal Disponible
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Operadores autorizados y en formación según turno y estatus actual.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMachineModal(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedMachineModal.turnos.map((t) => {
                const authorizedEmployees = employees.filter((e) => t.authorizedEmployeeIds.includes(e.id));
                const inTrainingEmployees = employees.filter((e) => t.inTrainingEmployeeIds.includes(e.id));

                return (
                  <div key={t.shift} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{t.shift}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          t.status === 'Cobertura suficiente'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    {/* Autorizados */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Autorizados para Operar ({authorizedEmployees.length})
                      </span>
                      {authorizedEmployees.length > 0 ? (
                        <div className="space-y-1">
                          {authorizedEmployees.map((emp) => (
                            <div
                              key={emp.id}
                              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-zinc-900 dark:text-white block">{emp.nombre}</span>
                                <span className="text-[10px] text-zinc-500">{emp.puesto}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMachineModal(null);
                                  onOpenEmployeeProfile(emp.id);
                                }}
                                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:underline"
                              >
                                Ver perfil
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-rose-500 italic">No hay operadores autorizados en este turno.</p>
                      )}
                    </div>

                    {/* En entrenamiento */}
                    {inTrainingEmployees.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                          En Entrenamiento ({inTrainingEmployees.length})
                        </span>
                        <div className="space-y-1">
                          {inTrainingEmployees.map((emp) => (
                            <div
                              key={emp.id}
                              className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-zinc-900 dark:text-white block">{emp.nombre}</span>
                                <span className="text-[10px] text-zinc-500">{emp.puesto} · Práctica en curso</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMachineModal(null);
                                  onOpenEmployeeProfile(emp.id);
                                }}
                                className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
                              >
                                Ver avance
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMachineModal(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
