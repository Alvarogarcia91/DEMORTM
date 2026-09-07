import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import {
  COMPETENCY_SYSTEM_SUGGESTIONS,
  CompetencyLevel,
  CompetencySystemSuggestion,
  EMPLOYEE_SKILL_RECORDS,
  EmployeeSkillRecord,
  INITIAL_MACHINE_COVERAGES,
  INITIAL_PLANT_TRAININGS,
  MachineShiftCoverage,
  PLANT_SKILLS,
  PlantSkill,
  PlantTraining,
} from '../../../data/mockCompetenciasData';
import { CompetenciasDashboard } from './CompetenciasDashboard';
import { SkillsMatrix } from './SkillsMatrix';
import { PlantCoverage } from './PlantCoverage';
import { TrainingWorkspace } from './TrainingWorkspace';
import { EmployeeCompetencyDrawer } from './EmployeeCompetencyDrawer';
import { TrainingFormModal } from './TrainingFormModal';
import { TrainingProgressModal } from './TrainingProgressModal';

interface CompetenciasWorkspaceProps {
  employees: Employee[];
  onNotice?: (msg: string) => void;
}

export type CompetenciasSubView = 'resumen' | 'matriz' | 'cobertura' | 'capacitacion';

export const CompetenciasWorkspace: React.FC<CompetenciasWorkspaceProps> = ({
  employees,
  onNotice,
}) => {
  const [activeSubView, setActiveSubView] = useState<CompetenciasSubView>('resumen');
  const [selectedShift, setSelectedShift] = useState<string>('Toda la planta');
  const [selectedArea, setSelectedArea] = useState<string>('Todas las áreas');

  // Estado reactivo local
  const [skills, setSkills] = useState<EmployeeSkillRecord[]>(EMPLOYEE_SKILL_RECORDS);
  const [coverages, setCoverages] = useState<MachineShiftCoverage[]>(INITIAL_MACHINE_COVERAGES);
  const [trainings, setTrainings] = useState<PlantTraining[]>(INITIAL_PLANT_TRAININGS);
  const [suggestions, setSuggestions] = useState<CompetencySystemSuggestion[]>(COMPETENCY_SYSTEM_SUGGESTIONS);

  // Estados de modales y drawers
  const [activeDrawerEmployeeId, setActiveDrawerEmployeeId] = useState<string | null>(null);
  const [isTrainingFormOpen, setIsTrainingFormOpen] = useState(false);
  const [trainingFormInitialEmployeeId, setTrainingFormInitialEmployeeId] = useState<string | undefined>(undefined);
  const [trainingFormInitialSkillId, setTrainingFormInitialSkillId] = useState<string | undefined>(undefined);
  const [activeTrainingForProgress, setActiveTrainingForProgress] = useState<PlantTraining | null>(null);

  // Notificación local toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    onNotice?.(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Guardar nueva capacitación
  const handleSaveNewTraining = (newTraining: PlantTraining) => {
    setTrainings((prev) => [newTraining, ...prev]);

    // Actualizar registro de habilidad del empleado si estaba sin entrenamiento
    setSkills((prev) => {
      const existing = prev.find(
        (s) => s.employeeId === newTraining.employeeId && s.skillId === newTraining.skillId
      );
      if (existing) {
        return prev.map((s) =>
          s.employeeId === newTraining.employeeId && s.skillId === newTraining.skillId
            ? { ...s, level: 'En entrenamiento', instructorId: newTraining.instructorId, instructorName: newTraining.instructorName }
            : s
        );
      } else {
        return [
          ...prev,
          {
            employeeId: newTraining.employeeId,
            skillId: newTraining.skillId,
            level: 'En entrenamiento',
            instructorId: newTraining.instructorId,
            instructorName: newTraining.instructorName,
            totalActivitiesCount: newTraining.activities.length,
            authorizedActivitiesCount: 0,
          },
        ];
      }
    });

    setIsTrainingFormOpen(false);
    notify(`✓ Capacitación ${newTraining.code} programada con éxito para ${newTraining.employeeName}.`);
  };

  // Guardar avance o dictamen final de capacitación
  const handleSaveTrainingProgress = (updated: PlantTraining) => {
    setTrainings((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    // Si fue completada y cuenta con evaluación formal
    if (updated.status === 'Completada' && updated.evaluationResult) {
      setSkills((prev) =>
        prev.map((s) =>
          s.employeeId === updated.employeeId && s.skillId === updated.skillId
            ? {
                ...s,
                level: updated.evaluationResult as CompetencyLevel,
                lastEvaluationDate: updated.evaluationDate,
                evaluatorName: updated.evaluatedBy,
                notes: updated.evaluationNotes,
              }
            : s
        )
      );

      // Si fue para Carlos Mendoza en Mark Andy Scout, mejorar la cobertura de planta
      if (updated.employeeId === 'RTM-001' && updated.skillId === 'SKILL-MA-SCOUT-10') {
        setCoverages((prev) =>
          prev.map((cov) =>
            cov.machineId === 'SKILL-MA-SCOUT-10'
              ? {
                  ...cov,
                  overallStatus: 'Cobertura suficiente',
                  criticalAlert: undefined,
                  turnos: cov.turnos.map((t) =>
                    t.shift === 'Turno 1'
                      ? { ...t, authorizedCount: t.authorizedCount + 1, authorizedEmployeeIds: [...t.authorizedEmployeeIds, 'RTM-001'] }
                      : t
                  ),
                }
              : cov
          )
        );
      }

      notify(`🎉 Evaluación registrada: ${updated.employeeName} dictaminado como "${updated.evaluationResult}" en ${updated.skillName}.`);
    } else {
      notify(`✓ Avance guardado para ${updated.title}.`);
    }

    setActiveTrainingForProgress(null);
  };

  // Empleado seleccionado para el drawer
  const selectedDrawerEmployee = employees.find((e) => e.id === activeDrawerEmployeeId) || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white dark:hover:text-zinc-900 ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Subnavegación de 4 Vistas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            { id: 'matriz', label: 'Matriz de habilidades', icon: <Layers className="w-3.5 h-3.5" /> },
            {
              id: 'cobertura',
              label: 'Cobertura de planta',
              icon: <ShieldCheck className="w-3.5 h-3.5" />,
              badge: coverages.filter((c) => c.overallStatus !== 'Cobertura suficiente').length,
            },
            {
              id: 'capacitacion',
              label: 'Capacitación',
              icon: <GraduationCap className="w-3.5 h-3.5" />,
              badge: trainings.filter((t) => t.status === 'En curso').length,
            },
          ].map((tab) => {
            const isActive = activeSubView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubView(tab.id as CompetenciasSubView)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setTrainingFormInitialEmployeeId(undefined);
            setTrainingFormInitialSkillId(undefined);
            setIsTrainingFormOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Programar capacitación</span>
        </button>
      </div>

      {/* RENDER DE SUBVISTA ACTIVA */}
      {activeSubView === 'resumen' && (
        <CompetenciasDashboard
          employees={employees}
          skills={skills}
          coverages={coverages}
          trainings={trainings}
          suggestions={suggestions}
          selectedShift={selectedShift}
          selectedArea={selectedArea}
          onSelectShift={setSelectedShift}
          onSelectArea={setSelectedArea}
          onNavigateToCoverage={(machineId) => {
            setActiveSubView('cobertura');
          }}
          onNavigateToSkillsMatrix={(areaFilter) => {
            if (areaFilter) setSelectedArea(areaFilter);
            setActiveSubView('matriz');
          }}
          onNavigateToTrainings={(filter) => {
            setActiveSubView('capacitacion');
          }}
          onOpenEmployeeProfile={(empId) => setActiveDrawerEmployeeId(empId)}
          onOpenTrainingForm={(empId, skillId) => {
            setTrainingFormInitialEmployeeId(empId);
            setTrainingFormInitialSkillId(skillId);
            setIsTrainingFormOpen(true);
          }}
          onOpenTrainingProgress={(tr) => setActiveTrainingForProgress(tr)}
        />
      )}

      {activeSubView === 'matriz' && (
        <SkillsMatrix
          employees={employees}
          skills={skills}
          initialAreaFilter={selectedArea}
          onOpenEmployeeProfile={(empId) => setActiveDrawerEmployeeId(empId)}
          onProgramTraining={(empId, skillId) => {
            setTrainingFormInitialEmployeeId(empId);
            setTrainingFormInitialSkillId(skillId);
            setIsTrainingFormOpen(true);
          }}
        />
      )}

      {activeSubView === 'cobertura' && (
        <PlantCoverage
          employees={employees}
          coverages={coverages}
          onOpenEmployeeProfile={(empId) => setActiveDrawerEmployeeId(empId)}
          onProgramTrainingForMachine={(machineId) => {
            setTrainingFormInitialEmployeeId(undefined);
            setTrainingFormInitialSkillId(machineId);
            setIsTrainingFormOpen(true);
          }}
        />
      )}

      {activeSubView === 'capacitacion' && (
        <TrainingWorkspace
          trainings={trainings}
          onOpenTrainingForm={() => {
            setTrainingFormInitialEmployeeId(undefined);
            setTrainingFormInitialSkillId(undefined);
            setIsTrainingFormOpen(true);
          }}
          onOpenTrainingProgress={(tr) => setActiveTrainingForProgress(tr)}
        />
      )}

      {/* DRAWER PERFIL 360 DEL EMPLEADO */}
      {selectedDrawerEmployee && (
        <EmployeeCompetencyDrawer
          employee={selectedDrawerEmployee}
          skills={skills}
          trainings={trainings}
          onClose={() => setActiveDrawerEmployeeId(null)}
          onProgramTraining={(empId, skillId) => {
            setActiveDrawerEmployeeId(null);
            setTrainingFormInitialEmployeeId(empId);
            setTrainingFormInitialSkillId(skillId);
            setIsTrainingFormOpen(true);
          }}
          onOpenTrainingProgress={(tr) => {
            setActiveDrawerEmployeeId(null);
            setActiveTrainingForProgress(tr);
          }}
        />
      )}

      {/* MODAL PROGRAMAR CAPACITACIÓN */}
      {isTrainingFormOpen && (
        <TrainingFormModal
          employees={employees}
          initialEmployeeId={trainingFormInitialEmployeeId}
          initialSkillId={trainingFormInitialSkillId}
          onClose={() => setIsTrainingFormOpen(false)}
          onSave={handleSaveNewTraining}
        />
      )}

      {/* MODAL REGISTRAR AVANCE Y DICTAMEN */}
      {activeTrainingForProgress && (
        <TrainingProgressModal
          training={activeTrainingForProgress}
          onClose={() => setActiveTrainingForProgress(null)}
          onSaveProgress={handleSaveTrainingProgress}
        />
      )}
    </div>
  );
};
