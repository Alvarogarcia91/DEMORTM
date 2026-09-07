import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Award,
} from 'lucide-react';
import { PlantTraining, PlantTrainingActivity } from '../../../data/mockCompetenciasData';

interface TrainingProgressModalProps {
  training: PlantTraining;
  onClose: () => void;
  onSaveProgress: (updatedTraining: PlantTraining) => void;
}

export const TrainingProgressModal: React.FC<TrainingProgressModalProps> = ({
  training,
  onClose,
  onSaveProgress,
}) => {
  const [activities, setActivities] = useState<PlantTrainingActivity[]>(training.activities);
  const [evaluationResult, setEvaluationResult] = useState<'Competente' | 'Autorizado'>(
    training.evaluationResult || 'Autorizado'
  );
  const [evaluatedBy, setEvaluatedBy] = useState(
    training.evaluatedBy || `${training.instructorName} / Supervisor de Turno`
  );
  const [evaluationNotes, setEvaluationNotes] = useState(
    training.evaluationNotes || 'Demostró competencia técnica y apego a tolerancias en la corrida práctica.'
  );

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;
  const pct = Math.round((completedCount / totalCount) * 100);

  const handleToggleActivity = (actId: string) => {
    const todayStr = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === actId) {
          const nextState = !act.completed;
          return {
            ...act,
            completed: nextState,
            completedDate: nextState ? todayStr : undefined,
          };
        }
        return act;
      })
    );
  };

  const handleSave = () => {
    const isNowCompleted = allCompleted;
    const updatedTraining: PlantTraining = {
      ...training,
      activities,
      status: isNowCompleted ? 'Completada' : training.status,
      evaluationResult: isNowCompleted ? evaluationResult : undefined,
      evaluatedBy: isNowCompleted ? evaluatedBy : undefined,
      evaluationDate: isNowCompleted
        ? new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
        : undefined,
      evaluationNotes: isNowCompleted ? evaluationNotes : undefined,
    };

    onSaveProgress(updatedTraining);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between bg-zinc-50/80 dark:bg-zinc-900/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                {training.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  training.status === 'Completada'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {training.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{training.title}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Colaborador: <b className="text-zinc-700 dark:text-zinc-300">{training.employeeName}</b> ({training.employeeDepartment}) · Instructor: <b>{training.instructorName}</b>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Barra de progreso visual */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Avance de Actividades Prácticas</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">
                {completedCount} de {totalCount} ({pct}%)
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  allCompleted ? 'bg-emerald-500' : 'bg-zinc-900 dark:bg-white'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Objetivo: <b className="text-zinc-700 dark:text-zinc-300">{training.targetObjective}</b> · Fecha estimada: {training.estimatedCompletionDate}
            </p>
          </div>

          {/* Checklist de Actividades */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Checklist de Verificación en Piso
            </h3>

            <div className="space-y-2">
              {activities.map((act) => (
                <label
                  key={act.id}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    act.completed
                      ? 'border-emerald-300/80 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={act.completed}
                    onChange={() => handleToggleActivity(act.id)}
                    className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <span
                      className={`font-semibold block ${
                        act.completed ? 'text-emerald-900 dark:text-emerald-200' : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {act.name}
                    </span>
                    {act.completedDate && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                        ✓ Verificado el {act.completedDate}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bloque de Evaluación Formal Humana (visible cuando todas están completas o ya completado) */}
          {allCompleted && (
            <div className="p-4 rounded-2xl border border-purple-300/80 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-3.5 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                  Evaluación y Dictamen Humano Requerido
                </h4>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                Todas las actividades prácticas fueron completadas. Registra el veredicto formal de supervisión para otorgar el nivel de competencia al colaborador.
              </p>

              {/* Selector de Resultado */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Dictamen de Habilidad
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEvaluationResult('Competente')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      evaluationResult === 'Competente'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300'
                    }`}
                  >
                    Competente (Acompañado)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvaluationResult('Autorizado')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      evaluationResult === 'Autorizado'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300'
                    }`}
                  >
                    Autorizado (Operación Autónoma)
                  </button>
                </div>
              </div>

              {/* Evaluado por */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Evaluado por (Supervisor / Instructor)
                </label>
                <input
                  type="text"
                  value={evaluatedBy}
                  onChange={(e) => setEvaluatedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white"
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Observaciones Técnicas de Piso
                </label>
                <textarea
                  rows={2}
                  value={evaluationNotes}
                  onChange={(e) => setEvaluationNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <span className="text-xs text-zinc-500">
            {allCompleted ? 'Listo para certificar evaluación' : 'Avance guardable en cualquier momento'}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
            >
              {allCompleted ? 'Guardar y Dictaminar' : 'Guardar Avance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
