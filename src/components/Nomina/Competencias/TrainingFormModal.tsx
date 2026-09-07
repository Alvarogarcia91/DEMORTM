import React, { useState } from 'react';
import { X, GraduationCap, Calendar, User, ShieldCheck, CheckSquare, Sparkles } from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import { PLANT_SKILLS, PlantSkill, PlantTraining } from '../../../data/mockCompetenciasData';

interface TrainingFormModalProps {
  employees: Employee[];
  initialEmployeeId?: string;
  initialSkillId?: string;
  onClose: () => void;
  onSave: (newTraining: PlantTraining) => void;
}

export const TrainingFormModal: React.FC<TrainingFormModalProps> = ({
  employees,
  initialEmployeeId,
  initialSkillId,
  onClose,
  onSave,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId || employees[0]?.id || 'RTM-001');
  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId || PLANT_SKILLS[2]?.id || 'SKILL-MA-SCOUT-10');
  
  // Buscar instructor por defecto (ej. María Ríos RTM-003 o Miguel Ángel Torres RTM-007)
  const [selectedInstructorId, setSelectedInstructorId] = useState('RTM-003');
  const [targetObjective, setTargetObjective] = useState<PlantTraining['targetObjective']>('Operación autónoma');
  const [estimatedDate, setEstimatedDate] = useState('2026-09-21');
  const [notes, setNotes] = useState('');

  // Actividades dinámicas
  const [activityList, setActivityList] = useState<string[]>([
    'Seguridad de equipo y protocolo de paros de emergencia',
    'Preparación de herramental y calibración inicial',
    'Corrida supervisada con registro de tolerancia',
    'Evaluación práctica con supervisor de turno',
  ]);
  const [newActivityText, setNewActivityText] = useState('');

  const targetEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  const targetSkill = PLANT_SKILLS.find((s) => s.id === selectedSkillId) || PLANT_SKILLS[0];
  const targetInstructor = employees.find((e) => e.id === selectedInstructorId) || employees[2];

  const handleAddActivity = () => {
    if (!newActivityText.trim()) return;
    setActivityList([...activityList, newActivityText.trim()]);
    setNewActivityText('');
  };

  const handleRemoveActivity = (idx: number) => {
    setActivityList(activityList.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trainingId = `CAP-2026-0${Math.floor(25 + Math.random() * 70)}`;
    const newTraining: PlantTraining = {
      id: trainingId,
      code: trainingId,
      title: `Capacitación en ${targetSkill.name}`,
      employeeId: targetEmployee.id,
      employeeName: targetEmployee.nombre,
      employeeDepartment: targetEmployee.departamento,
      employeeShift: targetEmployee.turno.split(' (')[0],
      skillId: targetSkill.id,
      skillName: targetSkill.name,
      machineOrProcess: `${targetSkill.name} · ${targetSkill.area}`,
      instructorId: targetInstructor.id,
      instructorName: targetInstructor.nombre,
      targetObjective,
      estimatedCompletionDate: estimatedDate,
      status: 'En curso',
      activities: activityList.map((act, index) => ({
        id: `act-${index + 1}`,
        name: act,
        completed: false,
      })),
      notes: notes.trim() || 'Entrenamiento formal programado desde el panel de Competencias RTM.',
    };

    onSave(newTraining);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Programar Capacitación de Planta</h2>
              <p className="text-xs text-zinc-500">
                Plan de desarrollo técnico y respaldo operativo para colaboradores.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Colaborador */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Colaborador a capacitar
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} · {emp.nombre} ({emp.puesto} — {emp.departamento})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Habilidad / Máquina */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Máquina o Proceso Objetivo
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer"
              >
                {PLANT_SKILLS.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Instructor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Instructor o Supervisor de Acompañamiento
              </label>
              <select
                value={selectedInstructorId}
                onChange={(e) => setSelectedInstructorId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer"
              >
                {employees
                  .filter((e) => e.departamento === 'Manufactura' || e.departamento === 'Calidad' || e.puesto.includes('Senior') || e.puesto.includes('Operador') || e.puesto.includes('Prensista'))
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} ({emp.puesto})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Objetivo formativo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Objetivo Formativo
              </label>
              <select
                value={targetObjective}
                onChange={(e) => setTargetObjective(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer"
              >
                <option value="Operación autónoma">Operación autónoma</option>
                <option value="Ajuste y preparación">Ajuste y preparación (Setup)</option>
                <option value="Inspección de calidad">Inspección de calidad</option>
                <option value="Respaldo operativo">Respaldo operativo de turno</option>
              </select>
            </div>

            {/* Fecha estimada */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Fecha Estimada de Conclusión
              </label>
              <input
                type="date"
                value={estimatedDate}
                onChange={(e) => setEstimatedDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 outline-none"
              />
            </div>
          </div>

          {/* Actividades sugeridas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Actividades Prácticas Requeridas ({activityList.length})
              </label>
              <span className="text-[10px] text-zinc-400">Evaluadas por el instructor</span>
            </div>

            <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              {activityList.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(idx)}
                    className="text-zinc-400 hover:text-rose-500 text-[11px] px-1"
                  >
                    Quitar
                  </button>
                </div>
              ))}

              {/* Agregar actividad */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar otra actividad práctica..."
                  value={newActivityText}
                  onChange={(e) => setNewActivityText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddActivity();
                    }
                  }}
                  className="flex-1 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs font-bold rounded-xl text-zinc-800 dark:text-white transition-colors"
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Notas y Justificación de Planta
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Capacitación prioritaria para reducir dependencia de un solo operador en Turno 2..."
              className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Programar Capacitación</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
