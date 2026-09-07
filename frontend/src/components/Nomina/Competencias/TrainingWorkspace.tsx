import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  Plus,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { PlantTraining } from '../../../data/mockCompetenciasData';

interface TrainingWorkspaceProps {
  trainings: PlantTraining[];
  initialStatusFilter?: string;
  onOpenTrainingForm: () => void;
  onOpenTrainingProgress: (training: PlantTraining) => void;
}

export const TrainingWorkspace: React.FC<TrainingWorkspaceProps> = ({
  trainings,
  initialStatusFilter,
  onOpenTrainingForm,
  onOpenTrainingProgress,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrainings = trainings.filter((t) => {
    const matchStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'En curso' && (t.status === 'En curso' || t.status === 'Programada')) ||
      (statusFilter === 'Requiere revisión' && t.status === 'Requiere revisión') ||
      (statusFilter === 'Completada' && t.status === 'Completada');

    const matchSearch =
      !searchQuery.trim() ||
      t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const inCourseTrainings = filteredTrainings.filter((t) => t.status === 'En curso' || t.status === 'Programada');
  const reviewDueTrainings = filteredTrainings.filter((t) => t.status === 'Requiere revisión');
  const completedTrainings = filteredTrainings.filter((t) => t.status === 'Completada');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Cabecera y Acciones */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Plan de Capacitación y Desarrollo Técnico de Planta
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Acompañamiento en piso, prácticas supervisadas y dictámenes de habilitación para operadores.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenTrainingForm}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Programar capacitación</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            {['Todos', 'En curso', 'Requiere revisión', 'Completada'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {st === 'Requiere revisión' ? 'Próximas revisiones' : st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar entrenamiento..."
              className="pl-8 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none w-56 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 1: EN CURSO Y PROGRAMADAS */}
      {(statusFilter === 'Todos' || statusFilter === 'En curso') && inCourseTrainings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Capacitaciones en Curso y Prácticas Supervisadas ({inCourseTrainings.length})
            </h3>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {inCourseTrainings.map((tr) => {
              const completedCount = tr.activities.filter((a) => a.completed).length;
              const totalCount = tr.activities.length;
              const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={tr.id}
                  className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {tr.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {tr.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{tr.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Colaborador: <b className="text-zinc-800 dark:text-zinc-200">{tr.employeeName}</b> ({tr.employeeDepartment}) · Instructor: <b>{tr.instructorName}</b>
                      </p>
                    </div>

                    {/* Barra de progreso */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Avance del checklist práctico</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {completedCount} de {totalCount} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 italic">
                      Objetivo: {tr.targetObjective} · Conclusión estimada: {tr.estimatedCompletionDate}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">Evaluación en piso</span>
                    <button
                      type="button"
                      onClick={() => onOpenTrainingProgress(tr)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
                    >
                      Registrar avance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BLOQUE 2: PRÓXIMAS REVISIONES / RENOVACIONES */}
      {(statusFilter === 'Todos' || statusFilter === 'Requiere revisión') && reviewDueTrainings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Entrenamientos que Requieren Revisión o Renovación Interna ({reviewDueTrainings.length})
            </h3>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {reviewDueTrainings.map((tr) => (
              <div
                key={tr.id}
                className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      {tr.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      ⚠ Revisión Anual
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{tr.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Colaborador: <b className="text-zinc-900 dark:text-white">{tr.employeeName}</b> ({tr.employeeDepartment}) · Evaluadora: <b>{tr.instructorName}</b>
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {tr.notes}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    Vencimiento estimado: {tr.estimatedCompletionDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenTrainingProgress(tr)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    Revisar y renovar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOQUE 3: COMPLETADAS RECIENTEMENTE */}
      {(statusFilter === 'Todos' || statusFilter === 'Completada') && completedTrainings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Capacitaciones Completadas y Dictaminadas ({completedTrainings.length})
            </h3>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {completedTrainings.map((tr) => (
              <div
                key={tr.id}
                className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/15 dark:bg-emerald-950/10 shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {tr.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ Dictamen: {tr.evaluationResult}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{tr.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Colaborador: <b className="text-zinc-900 dark:text-white">{tr.employeeName}</b> · Evaluado por: <b>{tr.evaluatedBy}</b> ({tr.evaluationDate})
                  </p>

                  {tr.evaluationNotes && (
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/30 text-xs text-zinc-600 dark:text-zinc-400 italic">
                      "{tr.evaluationNotes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
