import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  History,
  ShieldCheck,
  Sparkles,
  User,
  X,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import {
  CompetencyLevel,
  EmployeeSkillRecord,
  PLANT_SKILLS,
  PlantSkill,
  PlantTraining,
} from '../../../data/mockCompetenciasData';

interface EmployeeCompetencyDrawerProps {
  employee: Employee | null;
  skills: EmployeeSkillRecord[];
  trainings: PlantTraining[];
  onClose: () => void;
  onProgramTraining?: (employeeId: string, skillId?: string) => void;
  onOpenTrainingProgress?: (training: PlantTraining) => void;
}

export const EmployeeCompetencyDrawer: React.FC<EmployeeCompetencyDrawerProps> = ({
  employee,
  skills,
  trainings,
  onClose,
  onProgramTraining,
  onOpenTrainingProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'habilidades' | 'capacitacion' | 'historial'>('resumen');

  if (!employee) return null;

  // Filtrar habilidades del empleado
  const employeeSkills = skills.filter((s) => s.employeeId === employee.id);
  const employeeTrainings = trainings.filter((t) => t.employeeId === employee.id);

  // Mapear con el catálogo de habilidades
  const skillsWithDetails = employeeSkills.map((es) => {
    const detail = PLANT_SKILLS.find((ps) => ps.id === es.skillId);
    return { ...es, skillDetail: detail };
  });

  const authorizedSkills = skillsWithDetails.filter((s) => s.level === 'Autorizado' || s.level === 'Instructor');
  const competentSkills = skillsWithDetails.filter((s) => s.level === 'Competente');
  const inTrainingSkills = skillsWithDetails.filter((s) => s.level === 'En entrenamiento');

  const getLevelBadgeClass = (level: CompetencyLevel) => {
    switch (level) {
      case 'Instructor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      case 'Autorizado':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'Competente':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'En entrenamiento':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Header Superior */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-zinc-700">
                {employee.nombre
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                    {employee.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      employee.estatus === 'Activo'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {employee.estatus}
                  </span>
                </div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-1 leading-snug">
                  {employee.nombre}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {employee.puesto} · <b className="text-zinc-700 dark:text-zinc-300">{employee.departamento}</b> · {employee.turno.split(' (')[0]}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="Cerrar perfil"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subnavegación de 4 pestañas */}
          <div className="flex gap-2 mt-5 border-b border-zinc-200 dark:border-zinc-800 -mb-6">
            {[
              { id: 'resumen', label: 'Resumen' },
              { id: 'habilidades', label: `Habilidades (${employeeSkills.length})` },
              { id: 'capacitacion', label: `Capacitación (${employeeTrainings.length})` },
              { id: 'historial', label: 'Historial' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === t.id
                    ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo del Drawer */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="space-y-6">
              {/* Cobertura Principal */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 font-bold">
                    Cobertura Principal de Planta
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Personal Preparado
                  </span>
                </div>
                <h3 className="text-sm font-bold">{employee.departamento} · {employee.puesto}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Colaborador con base operativa en <b className="text-white">{employee.turno.split(' (')[0]}</b>. Autorizado formalmente para operar equipos clave de su área y habilitado como respaldo en procesos afines.
                </p>
              </div>

              {/* KPIs de Habilidades del Colaborador */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase">Autorizadas</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {authorizedSkills.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase">Competente</span>
                  <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {competentSkills.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase">En Entrenamiento</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {inTrainingSkills.length}
                  </span>
                </div>
              </div>

              {/* Máquinas y Procesos Autorizados */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Máquinas y Procesos con Autorización Vigente
                </h4>
                {authorizedSkills.length > 0 ? (
                  <div className="space-y-2">
                    {authorizedSkills.map((sk) => (
                      <div
                        key={sk.skillId}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                              {sk.skillDetail?.name || sk.skillId}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {sk.skillDetail?.area} · Exp: {sk.internalExperienceMonths || 12} meses
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadgeClass(sk.level)}`}>
                          {sk.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No registra autorizaciones formales concluidas aún.</p>
                )}
              </div>

              {/* Entrenamientos en curso */}
              {inTrainingSkills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                    <span>Entrenamientos en Curso</span>
                    <span className="text-amber-600 dark:text-amber-400 font-normal normal-case">
                      {inTrainingSkills.length} activo(s)
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {inTrainingSkills.map((sk) => (
                      <div
                        key={sk.skillId}
                        className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {sk.skillDetail?.name || sk.skillId}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            {sk.authorizedActivitiesCount || 0} de {sk.totalActivitiesCount || 4} actividades
                          </span>
                        </div>
                        {sk.instructorName && (
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                            Instructor asignado: <b className="text-zinc-800 dark:text-zinc-200">{sk.instructorName}</b>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de acción rápida */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onProgramTraining?.(employee.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Programar nueva capacitación para este colaborador</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HABILIDADES */}
          {activeTab === 'habilidades' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Inventario de habilidades registradas en planta para este colaborador con fecha de última evaluación y dictamen.
              </p>

              <div className="grid gap-3">
                {skillsWithDetails.map((sk) => (
                  <div
                    key={sk.skillId}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          {sk.skillDetail?.category || 'Habilidad de planta'}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                          {sk.skillDetail?.name || sk.skillId}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {sk.skillDetail?.description || 'Operación técnica en planta.'}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getLevelBadgeClass(sk.level)}`}>
                        {sk.level}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 flex-wrap gap-2">
                      <div>
                        {sk.lastEvaluationDate ? (
                          <span>Última evaluación: <b className="text-zinc-700 dark:text-zinc-300">{sk.lastEvaluationDate}</b></span>
                        ) : (
                          <span className="italic text-zinc-400">Sin evaluación registrada</span>
                        )}
                        {sk.evaluatorName && <span className="block text-[10px] text-zinc-400">Por: {sk.evaluatorName}</span>}
                      </div>
                      {sk.internalExperienceMonths && (
                        <span className="text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                          {sk.internalExperienceMonths} meses experiencia
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITACIÓN */}
          {activeTab === 'capacitacion' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">Programas de entrenamiento y avance práctico.</p>
                <button
                  type="button"
                  onClick={() => onProgramTraining?.(employee.id)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  + Programar
                </button>
              </div>

              {employeeTrainings.length > 0 ? (
                <div className="space-y-3">
                  {employeeTrainings.map((tr) => {
                    const completedCount = tr.activities.filter((a) => a.completed).length;
                    const totalCount = tr.activities.length;
                    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                    return (
                      <div
                        key={tr.id}
                        className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-zinc-400">{tr.code}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  tr.status === 'Completada'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : tr.status === 'Requiere revisión'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                }`}
                              >
                                {tr.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{tr.title}</h4>
                            <p className="text-[11px] text-zinc-500">Instructor: {tr.instructorName}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenTrainingProgress?.(tr)}
                            className="text-xs font-bold text-zinc-900 dark:text-white hover:underline shrink-0"
                          >
                            Ver avance →
                          </button>
                        </div>

                        {/* Barra de progreso de actividades */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] text-zinc-500">
                            <span>Avance de actividades prácticas</span>
                            <span className="font-bold">{completedCount} de {totalCount} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {tr.evaluationResult && (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>
                              Evaluación formal: <b>{tr.evaluationResult}</b> por {tr.evaluatedBy} ({tr.evaluationDate}).
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
                  <BookOpen className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                  <p className="text-xs text-zinc-500">No hay capacitaciones asignadas actualmente.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORIAL */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">Bitácora de autorizaciones y evaluaciones internas en planta.</p>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                <div className="relative space-y-1 text-xs">
                  <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">Autorización Operativa Confirmada</span>
                    <span className="text-[10px] font-mono text-zinc-400">12 Ago 2026</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Evaluación práctica de Mark Andy 830 aprobada por Ing. Daniel Torres. Operador autónomo.
                  </p>
                </div>

                <div className="relative space-y-1 text-xs">
                  <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-amber-500" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">Inicio de Capacitación Cruzada</span>
                    <span className="text-[10px] font-mono text-zinc-400">22 Ago 2026</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Asignación a programa CAP-2026-018 (Mark Andy Scout 10”) con María Ríos Garza como instructora.
                  </p>
                </div>

                <div className="relative space-y-1 text-xs">
                  <span className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-400" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">Ingreso a Planta RTM</span>
                    <span className="text-[10px] font-mono text-zinc-400">{employee.fechaIngreso}</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Alta en departamento {employee.departamento} ({employee.turno.split(' (')[0]}). Inducción de seguridad general.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
