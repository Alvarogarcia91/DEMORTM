import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Employee } from '../../../data/mockNominaData';
import {
  CompetencySystemSuggestion,
  EmployeeSkillRecord,
  MachineShiftCoverage,
  PLANT_SKILLS,
  PlantArea,
  PlantSkill,
  PlantTraining,
} from '../../../data/mockCompetenciasData';

interface CompetenciasDashboardProps {
  employees: Employee[];
  skills: EmployeeSkillRecord[];
  coverages: MachineShiftCoverage[];
  trainings: PlantTraining[];
  suggestions: CompetencySystemSuggestion[];
  selectedShift: string;
  selectedArea: string;
  onSelectShift: (shift: string) => void;
  onSelectArea: (area: string) => void;
  onNavigateToCoverage: (machineId?: string) => void;
  onNavigateToSkillsMatrix: (areaFilter?: string) => void;
  onNavigateToTrainings: (filter?: string) => void;
  onOpenEmployeeProfile: (employeeId: string) => void;
  onOpenTrainingForm: (employeeId?: string, skillId?: string) => void;
  onOpenTrainingProgress: (training: PlantTraining) => void;
}

export const CompetenciasDashboard: React.FC<CompetenciasDashboardProps> = ({
  employees,
  skills,
  coverages,
  trainings,
  suggestions,
  selectedShift,
  selectedArea,
  onSelectShift,
  onSelectArea,
  onNavigateToCoverage,
  onNavigateToSkillsMatrix,
  onNavigateToTrainings,
  onOpenEmployeeProfile,
  onOpenTrainingForm,
  onOpenTrainingProgress,
}) => {
  // Filtrar según filtros globales
  const operativeEmployees = employees.filter(
    (e) => e.departamento !== 'RH' && e.departamento !== 'Planeación'
  );

  const filteredEmployees = operativeEmployees.filter((e) => {
    const matchShift =
      selectedShift === 'Toda la planta' ||
      (selectedShift === 'Turno 1' && e.turno.includes('Turno 1')) ||
      (selectedShift === 'Turno 2' && e.turno.includes('Turno 2')) ||
      (selectedShift === 'Mixto' && (e.turno.includes('Mixto') || e.turno.includes('Administrativo')));
    const matchArea = selectedArea === 'Todas las áreas' || e.departamento === selectedArea;
    return matchShift && matchArea;
  });

  // KPIs
  const totalOperativosActivos = filteredEmployees.filter((e) => e.estatus === 'Activo').length;
  const authorizedCount = skills.filter((s) => s.level === 'Autorizado' || s.level === 'Instructor').length;
  const inTrainingCount = trainings.filter((t) => t.status === 'En curso').length;
  const openTrainingNeedsCount = coverages.filter((c) => c.overallStatus !== 'Cobertura suficiente').length;
  const criticalCoveragesCount = coverages.filter((c) => c.overallStatus === 'Cobertura limitada' || c.overallStatus === 'Crítica sin respaldo').length;
  const renewalDueCount = trainings.filter((t) => t.status === 'Requiere revisión').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Filtros Ejecutivos */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Competencias & Capacitación · RTM
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Aseguramiento Operativo
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
              Cobertura de Habilidades de Planta
            </h2>
            <p className="text-xs text-zinc-500 max-w-2xl mt-0.5">
              Conoce quién está preparado para cada proceso y dónde conviene reforzar capacitación para prevenir paros por ausencia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Selector de Turno */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              {['Toda la planta', 'Turno 1', 'Turno 2', 'Mixto'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSelectShift(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedShift === s
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Selector de Área */}
            <select
              value={selectedArea}
              onChange={(e) => onSelectArea(e.target.value)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="Todas las áreas">Todas las áreas</option>
              <option value="Flexografía">Flexografía</option>
              <option value="Offset">Offset</option>
              <option value="Acabados">Acabados</option>
              <option value="Calidad">Calidad</option>
              <option value="Almacén">Almacén</option>
            </select>
          </div>
        </div>

        {/* 6 KPIs Ejecutivos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Personal Activo</span>
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white mt-1 block">
              {totalOperativosActivos}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">operativos en planta</span>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Autorizados</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
              {authorizedCount}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">habilitaciones activas</span>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">En Entrenamiento</span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 block">
              {inTrainingCount}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">capacitaciones vivas</span>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Necesidades</span>
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 block">
              {openTrainingNeedsCount}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">líneas por reforzar</span>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Coberturas Críticas
            </span>
            <span className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-300 mt-1 block">
              {criticalCoveragesCount}
            </span>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-0.5 block">requieren atención</span>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Renovaciones
            </span>
            <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1 block">
              {renewalDueCount}
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5 block">revisión este mes</span>
          </div>
        </div>
      </div>

      {/* BLOQUE PROTAGONISTA: COBERTURA QUE REQUIERE ATENCIÓN */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Cobertura que Requiere Atención Inmediata
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Riesgos de continuidad operativa derivados de turnos dependientes de una sola persona autorizada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToCoverage()}
            className="text-xs font-bold text-zinc-900 dark:text-white hover:underline flex items-center gap-1"
          >
            <span>Ver toda la planta</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid gap-3.5 md:grid-cols-3">
          {/* Card 1: Turno 2 · Mark Andy Scout 10" */}
          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  🔴 Cobertura limitada
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Turno 2</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Mark Andy Scout 10” · Flexo
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Solo hay <b>1 operador autorizado disponible</b> (Roberto Garza). La ausencia de esa persona dejaría la máquina sin respaldo preparado en el turno vespertino.
              </p>
            </div>

            <div className="pt-2 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400">1 de 2 autorizados meta</span>
              <button
                type="button"
                onClick={() => onNavigateToCoverage('SKILL-MA-SCOUT-10')}
                className="text-xs font-bold text-zinc-900 dark:text-white hover:underline"
              >
                Ver cobertura →
              </button>
            </div>
          </div>

          {/* Card 2: Offset · Heidelberg Speedmaster */}
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  🟠 Respaldo de arranque
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Offset</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Heidelberg Speedmaster · Offset
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                2 operadores pueden ejecutar la impresión, pero solo <b>1 tiene autorización interna vigente</b> para ajustes de arranque finos y curvas CIP3 (Miguel Ángel Torres).
              </p>
            </div>

            <div className="pt-2 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Capacitación CIP3 sugerida</span>
              <button
                type="button"
                onClick={() => onNavigateToSkillsMatrix('Offset')}
                className="text-xs font-bold text-zinc-900 dark:text-white hover:underline"
              >
                Ver equipo →
              </button>
            </div>
          </div>

          {/* Card 3: Calidad · Primera pieza Flexo */}
          <div className="p-4 rounded-2xl border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/20 dark:bg-yellow-950/10 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                  🟡 Renovación requerida
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Calidad</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Primera Pieza Flexo (QA Gate)
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Hay 2 inspectores habilitados y uno tiene <b>renovación de entrenamiento anual requerida este mes</b> (Jorge Márquez, Turno 2) para calibración de espectro.
              </p>
            </div>

            <div className="pt-2 border-t border-yellow-100 dark:border-yellow-900/30 flex items-center justify-between">
              <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400">Vence en 4 días</span>
              <button
                type="button"
                onClick={() => onNavigateToTrainings('Requiere revisión')}
                className="text-xs font-bold text-zinc-900 dark:text-white hover:underline"
              >
                Revisar capacitación →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE MORADO: SUGERENCIAS SMART DEL SISTEMA */}
      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-200">
                  Sugerencias del Sistema
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200">
                  ✦ Inteligencia Operativa
                </span>
              </div>
              <p className="text-xs text-purple-900/70 dark:text-purple-300/70">
                Recomendaciones automáticas de capacitación cruzada y balance de turnos basadas en la matriz viva de planta.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 md:grid-cols-2">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-200/80 dark:border-purple-900/50 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                    {sug.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{sug.title}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
                {sug.targetEmployeeId && (
                  <button
                    type="button"
                    onClick={() => onOpenEmployeeProfile(sug.targetEmployeeId!)}
                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Ver perfil
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {sug.type === 'capacitacion_cruzada' && (
                    <button
                      type="button"
                      onClick={() => onNavigateToCoverage(sug.targetMachineId)}
                      className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 text-xs font-bold hover:bg-purple-200 transition-colors"
                    >
                      {sug.actionLabel}
                    </button>
                  )}

                  {sug.type === 'respaldo_proceso' && (
                    <button
                      type="button"
                      onClick={() => {
                        const carlosTraining = trainings.find((t) => t.employeeId === 'RTM-001');
                        if (carlosTraining) onOpenTrainingProgress(carlosTraining);
                        else onOpenTrainingForm('RTM-001', 'SKILL-MA-SCOUT-10');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 transition-colors shadow-2xs"
                    >
                      Registrar avance de práctica
                    </button>
                  )}

                  {sug.type === 'renovacion_proxima' && (
                    <button
                      type="button"
                      onClick={() => onNavigateToTrainings('Requiere revisión')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-2xs"
                    >
                      {sug.actionLabel}
                    </button>
                  )}

                  {sug.type === 'balance_turnos' && (
                    <button
                      type="button"
                      onClick={() => onNavigateToSkillsMatrix('Offset')}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 transition-colors"
                    >
                      {sug.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ANALÍTICA LIGERA: COBERTURA POR ÁREA Y BALANCE */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cobertura por Área Técnica */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Cobertura por Área de Manufactura
              </h3>
              <p className="text-xs text-zinc-500">Porcentaje de personal habilitado con autorización formal</p>
            </div>
            <span className="text-xs font-bold text-zinc-400">Meta: &gt; 80%</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { area: 'Flexografía', pct: 85, color: 'bg-emerald-500', note: '8 prensistas y rebobinadores' },
              { area: 'Offset', pct: 72, color: 'bg-amber-500', note: '5 operadores (ajustes por reforzar)' },
              { area: 'Acabados', pct: 88, color: 'bg-emerald-500', note: '4 operadores calificados' },
              { area: 'Calidad', pct: 75, color: 'bg-blue-500', note: '3 inspectores (1 renovación próxima)' },
              { area: 'Almacén', pct: 90, color: 'bg-emerald-500', note: '2 operadores de sustrato' },
            ].map((row) => (
              <div key={row.area} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{row.area}</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{row.pct}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-[10px] text-zinc-400">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habilidades con Menor Respaldo */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Máquinas con Mayor Dependencia
              </h3>
              <p className="text-xs text-zinc-500">Equipos donde la ausencia de 1 persona detendría la línea</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenTrainingForm()}
              className="text-xs font-bold text-zinc-900 dark:text-white hover:underline"
            >
              + Capacitar
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                machine: 'Mark Andy Scout 10”',
                area: 'Flexo',
                authorized: '1 en Turno 2',
                risk: 'Alto',
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
              },
              {
                machine: 'Ajustes de Arranque CIP3',
                area: 'Offset',
                authorized: '1 en Turno 1',
                risk: 'Medio',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
              },
              {
                machine: 'Encuadernación Muller Martini',
                area: 'Acabado',
                authorized: '1 en Turno 2',
                risk: 'Medio',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
              },
              {
                machine: 'Primera Pieza Flexo (QA)',
                area: 'Calidad',
                authorized: '1 en Turno 2 (renovación)',
                risk: 'Medio',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200',
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between text-xs"
              >
                <div>
                  <b className="text-zinc-900 dark:text-white block">{m.machine}</b>
                  <span className="text-[11px] text-zinc-500">
                    Área: {m.area} · Respaldos: {m.authorized}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${m.color}`}>
                  Riesgo {m.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
