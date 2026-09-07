import React, { useState, useMemo } from 'react';
import {
  Award,
  Check,
  ChevronRight,
  Filter,
  GraduationCap,
  Info,
  Search,
  SlidersHorizontal,
  Star,
  User,
} from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import {
  CompetencyLevel,
  EmployeeSkillRecord,
  PLANT_SKILLS,
  PlantArea,
  PlantSkill,
} from '../../../data/mockCompetenciasData';

interface SkillsMatrixProps {
  employees: Employee[];
  skills: EmployeeSkillRecord[];
  initialAreaFilter?: string;
  onOpenEmployeeProfile: (employeeId: string) => void;
  onProgramTraining: (employeeId: string, skillId?: string) => void;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  employees,
  skills,
  initialAreaFilter,
  onOpenEmployeeProfile,
  onProgramTraining,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>(initialAreaFilter || 'Todas las áreas');
  const [selectedShift, setSelectedShift] = useState<string>('Todos los turnos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<{
    employeeId: string;
    skillId: string;
    record?: EmployeeSkillRecord;
    skill?: PlantSkill;
  } | null>(null);

  // Filtrar habilidades a mostrar en columnas
  const displayedSkills = useMemo(() => {
    if (selectedArea === 'Todas las áreas') {
      return PLANT_SKILLS;
    }
    return PLANT_SKILLS.filter((s) => s.area === selectedArea);
  }, [selectedArea]);

  // Filtrar empleados en filas
  const displayedEmployees = useMemo(() => {
    return employees
      .filter((e) => e.departamento !== 'RH' && e.departamento !== 'Planeación')
      .filter((e) => {
        const matchArea = selectedArea === 'Todas las áreas' || e.departamento === selectedArea;
        const matchShift =
          selectedShift === 'Todos los turnos' ||
          (selectedShift === 'Turno 1' && e.turno.includes('Turno 1')) ||
          (selectedShift === 'Turno 2' && e.turno.includes('Turno 2')) ||
          (selectedShift === 'Mixto' && (e.turno.includes('Mixto') || e.turno.includes('Administrativo')));
        const matchSearch =
          !searchQuery.trim() ||
          e.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.puesto.toLowerCase().includes(searchQuery.toLowerCase());

        return matchArea && matchShift && matchSearch;
      });
  }, [employees, selectedArea, selectedShift, searchQuery]);

  const renderCellIcon = (level?: CompetencyLevel) => {
    switch (level) {
      case 'Instructor':
        return (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs shadow-2xs border border-purple-300 dark:border-purple-800"
            title="Instructor certificado"
          >
            ★
          </span>
        );
      case 'Autorizado':
        return (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs shadow-2xs border border-emerald-300 dark:border-emerald-800"
            title="Autorizado (Operación autónoma)"
          >
            ●
          </span>
        );
      case 'Competente':
        return (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-xs shadow-2xs border border-blue-300 dark:border-blue-800"
            title="Competente (Acompañado)"
          >
            ●
          </span>
        );
      case 'En entrenamiento':
        return (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-black text-xs shadow-2xs border border-amber-300 dark:border-amber-800"
            title="En entrenamiento activo"
          >
            ◐
          </span>
        );
      default:
        return (
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/40 text-zinc-300 dark:text-zinc-600 text-xs border border-zinc-200/50 dark:border-zinc-800/50"
            title="Sin entrenamiento registrado"
          >
            ○
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Controles y Leyenda */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Matriz de Habilidades de Planta
            </h2>
            <p className="text-xs text-zinc-500">
              Mapeo persona a proceso para identificar respaldos técnicos y brechas de capacitación.
            </p>
          </div>

          {/* Buscador y Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar colaborador..."
                className="pl-8 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none w-48 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

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
              <option value="Almacén">Almacén</option>
            </select>

            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="Todos los turnos">Todos los turnos</option>
              <option value="Turno 1">Turno 1</option>
              <option value="Turno 2">Turno 2</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>
        </div>

        {/* Leyenda Humana */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Niveles:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
              ●
            </span>
            <span className="text-zinc-700 dark:text-zinc-300"><b>Autorizado</b> (Autónomo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
              ●
            </span>
            <span className="text-zinc-700 dark:text-zinc-300"><b>Competente</b> (En dominio)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
              ◐
            </span>
            <span className="text-zinc-700 dark:text-zinc-300"><b>En entrenamiento</b> (En curso)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
              ★
            </span>
            <span className="text-zinc-700 dark:text-zinc-300"><b>Instructor</b> (Capacita a otros)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-zinc-100 text-zinc-400 font-bold flex items-center justify-center text-[10px]">
              ○
            </span>
            <span className="text-zinc-400">Sin entrenamiento registrado</span>
          </div>
        </div>
      </div>

      {/* Grid / Tabla de Matriz */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="p-4 sticky left-0 z-20 bg-zinc-50 dark:bg-zinc-800/95 min-w-[240px] border-r border-zinc-200 dark:border-zinc-800">
                  Colaborador / Puesto
                </th>
                <th className="p-3 text-center min-w-[90px] border-r border-zinc-200 dark:border-zinc-800">
                  Turno
                </th>
                {displayedSkills.map((sk) => (
                  <th
                    key={sk.id}
                    className="p-3 text-center min-w-[120px] max-w-[150px] border-r border-zinc-200 dark:border-zinc-800/60 font-bold"
                  >
                    <span className="text-[9px] text-zinc-400 block font-normal">{sk.area}</span>
                    <span className="text-zinc-800 dark:text-zinc-200 truncate block" title={sk.name}>
                      {sk.name}
                    </span>
                  </th>
                ))}
                <th className="p-3 text-center min-w-[100px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-xs">
              {displayedEmployees.map((emp) => {
                const empSkills = skills.filter((s) => s.employeeId === emp.id);

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Columna Empleado (Sticky) */}
                    <td className="p-4 sticky left-0 z-10 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/50 border-r border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.nombre
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-zinc-400">{emp.id}</span>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white truncate block">
                              {emp.nombre}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500 truncate block">{emp.puesto}</span>
                        </div>
                      </div>
                    </td>

                    {/* Turno */}
                    <td className="p-3 text-center border-r border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {emp.turno.split(' (')[0]}
                    </td>

                    {/* Celdas de Habilidad */}
                    {displayedSkills.map((sk) => {
                      const rec = empSkills.find((s) => s.skillId === sk.id);

                      return (
                        <td
                          key={sk.id}
                          className="p-2 text-center border-r border-zinc-200/60 dark:border-zinc-800/40 relative cursor-pointer"
                          onClick={() => {
                            setActiveTooltip({
                              employeeId: emp.id,
                              skillId: sk.id,
                              record: rec,
                              skill: sk,
                            });
                          }}
                        >
                          <div className="flex items-center justify-center">
                            {renderCellIcon(rec?.level)}
                          </div>
                        </td>
                      );
                    })}

                    {/* Acciones */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenEmployeeProfile(emp.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popover / Tooltip Modal al hacer clic en una celda */}
      {activeTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 space-y-3 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  {activeTooltip.skill?.area} · {activeTooltip.skill?.name}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {employees.find((e) => e.id === activeTooltip.employeeId)?.nombre}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveTooltip(null)}
                className="text-zinc-400 hover:text-zinc-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Nivel de habilidad:</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {activeTooltip.record?.level || 'Sin entrenamiento registrado'}
                </span>
              </div>
              {activeTooltip.record?.lastEvaluationDate && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Última evaluación:</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {activeTooltip.record.lastEvaluationDate}
                  </span>
                </div>
              )}
              {activeTooltip.record?.evaluatorName && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Evaluado por:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{activeTooltip.record.evaluatorName}</span>
                </div>
              )}
              {activeTooltip.record?.instructorName && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Instructor:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{activeTooltip.record.instructorName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const empId = activeTooltip.employeeId;
                  const skId = activeTooltip.skillId;
                  setActiveTooltip(null);
                  onProgramTraining(empId, skId);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800"
              >
                Programar capacitación
              </button>
              <button
                type="button"
                onClick={() => {
                  const empId = activeTooltip.employeeId;
                  setActiveTooltip(null);
                  onOpenEmployeeProfile(empId);
                }}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                Ver perfil 360
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
