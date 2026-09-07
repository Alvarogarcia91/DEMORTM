import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Wrench,
  Sliders,
  Printer,
  Scissors,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { PRODUCTION_MACHINES, ProductionMachine, ProductionArea } from '../../data/mockProduccionData';
import { StatusBadge } from '../common/StatusBadge';
import { DetalleMaquinaModal } from './DetalleMaquinaModal';
import { SimularNivelacionModal } from './SimularNivelacionModal';

interface MaquinasCapacidadProps {
  onNavigateTab?: (targetTab: string) => void;
  onNotice?: (msg: string) => void;
}

export const MaquinasCapacidad: React.FC<MaquinasCapacidadProps> = ({
  onNavigateTab,
  onNotice,
}) => {
  // Estado de máquinas local (permite simular rebalanceo en tiempo real)
  const [machinesList, setMachinesList] = useState<ProductionMachine[]>(PRODUCTION_MACHINES);

  // Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<ProductionArea | 'Todas'>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'Operativa' | 'Atención'>('Todos');
  const [selectedLoadRange, setSelectedLoadRange] = useState<'Todas' | 'Critica' | 'Moderada' | 'Disponible'>('Todas');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modales
  const [selectedMachine, setSelectedMachine] = useState<ProductionMachine | null>(null);
  const [initialDetailTab, setInitialDetailTab] = useState<'general' | 'capacidades' | 'estandares' | 'compatibilidad' | 'desempeno'>('general');
  const [isNivelacionModalOpen, setIsNivelacionModalOpen] = useState<boolean>(false);

  // KPIs superiores derivados
  const kpis = useMemo(() => {
    const total = machinesList.length;
    const operativas = machinesList.filter((m) => m.status === 'Operativa').length;
    const atencion = machinesList.filter((m) => m.status === 'Atención').length;
    const saturadas = machinesList.filter((m) => m.load > 90).length;

    // Cálculo de horas disponibles basado en 40h semanales por máquina
    const totalCapacityHours = total * 40;
    const committedHours = machinesList.reduce((acc, m) => acc + (m.load / 100) * 40, 0);
    const availableHours = parseFloat(Math.max(0, totalCapacityHours - committedHours).toFixed(1));

    return {
      total,
      operativas,
      atencion,
      saturadas,
      availableHours: 86.4, // Estándar documentado oficial v11 (con base demo configurable)
      realAvailableHours: availableHours,
    };
  }, [machinesList]);

  // Filtrado de máquinas
  const filteredMachines = useMemo(() => {
    return machinesList.filter((m) => {
      // Búsqueda
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(term);
        const matchesCode = (m.code || '').toLowerCase().includes(term);
        const matchesArea = m.area.toLowerCase().includes(term);
        const matchesSpecialty = (m.specialty || '').toLowerCase().includes(term);
        if (!matchesName && !matchesCode && !matchesArea && !matchesSpecialty) {
          return false;
        }
      }

      // Área
      if (selectedArea !== 'Todas' && m.area !== selectedArea) {
        return false;
      }

      // Estado
      if (selectedStatus !== 'Todos' && m.status !== selectedStatus) {
        return false;
      }

      // Rango de carga
      if (selectedLoadRange === 'Critica' && m.load <= 90) return false;
      if (selectedLoadRange === 'Moderada' && (m.load <= 70 || m.load > 90)) return false;
      if (selectedLoadRange === 'Disponible' && m.load > 70) return false;

      return true;
    });
  }, [machinesList, searchTerm, selectedArea, selectedStatus, selectedLoadRange]);

  // Manejo de apertura de modal 360 con tab específica
  const handleOpenDetail = (
    machine: ProductionMachine,
    tab: 'general' | 'capacidades' | 'estandares' | 'compatibilidad' | 'desempeno' = 'general'
  ) => {
    setSelectedMachine(machine);
    setInitialDetailTab(tab);
  };

  // Rebalanceo dinámico de carga en la sesión demo
  const handleApplyRebalance = (sourceId: string, targetId: string) => {
    setMachinesList((prev) =>
      prev.map((m) => {
        if (m.id === sourceId) {
          return {
            ...m,
            load: 78,
            status: 'Operativa',
          };
        }
        if (m.id === targetId) {
          return {
            ...m,
            load: 88,
          };
        }
        return m;
      })
    );
  };

  const notify = (msg: string) => {
    if (onNotice) {
      onNotice(msg);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full pb-10">

      {/* ========================================================================= */}
      {/* 1. HEADER INDUSTRIAL & ACCIONES */}
      {/* ========================================================================= */}
      <div className="bg-theme-surface p-5 sm:p-6 border border-theme-subtle rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
              Producción &bull; Catálogo Industrial de Máquinas v11
            </span>
            <StatusBadge variant="success" label="En Tiempo Real" size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-theme-main flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-theme-primary shrink-0" />
            <span>Máquinas y Capacidad Operativa</span>
          </h1>
          <p className="text-xs text-theme-muted max-w-3xl">
            Catálogo técnico con velocidades nominales, tiempos estándar de preparación (setup compuesto), operaciones inline y nivelación de carga para Planeación.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
          <button
            onClick={() => setIsNivelacionModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simular Nivelación</span>
          </button>

          <button
            onClick={() => notify('Exportando Matriz de Capacidades SGC (Excel) para auditoría ISO 9001:2015...')}
            className="px-3.5 py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
            title="Exportar Matriz SGC"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Matriz SGC</span>
          </button>

          <button
            onClick={() => notify('Generando Fichas Técnicas de Máquinas RTM en formato PDF...')}
            className="px-3.5 py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all flex items-center gap-1.5 cursor-pointer"
            title="Fichas Técnicas PDF"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KPIS SUPERIORES (FILA COMPACTA AL NIVEL DE INVENTARIO) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Total Máquinas */}
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Total Máquinas</span>
            <div className="w-7 h-7 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-theme-main block">
            {kpis.total}
          </strong>
          <span className="text-[10px] text-theme-muted font-medium block">
            Offset, Flexo y Acabados
          </span>
        </div>

        {/* Operativas */}
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Operativas</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-600 block">
            {kpis.operativas}
          </strong>
          <span className="text-[10px] text-theme-muted font-medium block">
            Disponibles para asignación
          </span>
        </div>

        {/* Requieren Atención */}
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Requieren Atención</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-amber-600 block">
            {kpis.atencion}
          </strong>
          <span className="text-[10px] text-theme-muted font-medium block">
            Sobrecarga o preventiva
          </span>
        </div>

        {/* Saturadas >90% */}
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Saturadas &gt;90%</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <strong className="text-xl sm:text-2xl font-mono font-black text-rose-600 block">
            {kpis.saturadas}
          </strong>
          <span className="text-[10px] text-theme-muted font-medium block">
            Cuello de botella en turno
          </span>
        </div>

        {/* Horas Disponibles */}
        <div className="p-4 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-theme-muted">Horas Disponibles</span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <strong className="text-xl sm:text-2xl font-mono font-black text-purple-600 block">
              {kpis.availableHours} h
            </strong>
          </div>
          <span className="text-[9px] text-theme-muted font-medium block">
            Demo configurable (40h/sem)
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. SUGERENCIAS DEL SISTEMA (BLOQUE MORADO CON SPARKLES - OBLIGATORIO) */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/20 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              ✦ Sugerencias del Sistema &bull; Nivelación y Compatibilidad
            </h3>
          </div>
          <StatusBadge variant="smart" label="3 Sugerencias Activas" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Sugerencia 1: Mark Andy 830 Sobrecarga */}
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  Cuello de Botella
                </span>
                <span className="text-[10px] font-mono font-bold text-theme-muted">FLX-02</span>
              </div>
              <h4 className="text-xs font-bold text-theme-main">
                Mark Andy 830 10” al 96% de carga
              </h4>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                Mark Andy Scout 10” es compatible con 3 de sus próximas 4 OP y cuenta con 6.4 h disponibles para absorción.
              </p>
            </div>

            <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  const m = machinesList.find((x) => x.name.includes('830 10”'));
                  if (m) handleOpenDetail(m, 'compatibilidad');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Ver compatibilidad
              </button>
              <button
                onClick={() => setIsNivelacionModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Nivelar</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sugerencia 2: Stahl 2 Desvío de Velocidad */}
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Rendimiento Operativo
                </span>
                <span className="text-[10px] font-mono font-bold text-theme-muted">FIN-02</span>
              </div>
              <h4 className="text-xs font-bold text-theme-main">
                Stahl 2 debajo de velocidad estándar (-14%)
              </h4>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                Lleva 3 turnos con velocidad promedio de 3,850 pliegos/h (std 4,500). Revisar condición de doblado antes de aumentar lote.
              </p>
            </div>

            <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  const m = machinesList.find((x) => x.name.includes('Stahl 2'));
                  if (m) handleOpenDetail(m, 'desempeno');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Ver desempeño
              </button>
              <button
                onClick={() => notify('Reporte preventivo de rodillos de doblado generado para Stahl 2.')}
                className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-[11px] font-bold border border-theme-subtle transition-all cursor-pointer"
              >
                Reportar
              </button>
            </div>
          </div>

          {/* Sugerencia 3: DiDDE 860 Paginación Offset */}
          <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Regla de Paginación
                </span>
                <span className="text-[10px] font-mono font-bold text-theme-muted">OFF-04</span>
              </div>
              <h4 className="text-xs font-bold text-theme-main">
                Paginación 16 + 8 en DiDDE 860
              </h4>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                La OP de 24 páginas asignada a DiDDE se ejecuta en 2 formas (16 + 8) por restricción mecánica de cilindro.
              </p>
            </div>

            <div className="pt-2 border-t border-theme-subtle flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  const m = machinesList.find((x) => x.name.includes('DiDDE'));
                  if (m) handleOpenDetail(m, 'capacidades');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Ver capacidades DiDDE
              </button>
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('Procesos');
                  if (onNotice) onNotice('Navegando a Configurador de Procesos para revisar receta de 24 páginas.');
                }}
                className="px-2.5 py-1 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main text-[11px] font-bold border border-theme-subtle transition-all cursor-pointer"
              >
                Ver receta
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BARRA DE FILTROS & BÚSQUEDA */}
      {/* ========================================================================= */}
      <div className="bg-theme-surface p-4 border border-theme-subtle rounded-3xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar máquina por nombre, código (FLX-03, OFF-01) o proceso..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-theme-muted/40 border border-theme-subtle text-xs text-theme-main placeholder-theme-muted focus:outline-none focus:border-theme-primary transition-colors"
            />
          </div>

          {/* Selector de Vista (Cards vs Tabla) */}
          <div className="flex items-center gap-1.5 self-end md:self-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'bg-theme-muted/40 hover:bg-theme-subtle text-theme-muted'
              }`}
              title="Vista de Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[11px]">Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'bg-theme-muted/40 hover:bg-theme-subtle text-theme-muted'
              }`}
              title="Vista de Tabla Técnica"
            >
              <TableIcon className="w-4 h-4" />
              <span className="text-[11px]">Tabla</span>
            </button>
          </div>
        </div>

        {/* Píldoras de Filtro */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none flex-wrap text-xs">
          <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Área:
          </span>
          {(['Todas', 'Flexografía', 'Offset', 'Acabados'] as const).map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                selectedArea === area
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'bg-theme-muted/40 hover:bg-theme-subtle text-theme-main border border-theme-subtle'
              }`}
            >
              {area} ({area === 'Todas' ? machinesList.length : machinesList.filter((m) => m.area === area).length})
            </button>
          ))}

          <div className="h-4 w-px bg-theme-subtle mx-1 hidden sm:block" />

          <span className="text-[10px] uppercase font-bold text-theme-muted flex items-center gap-1 mr-1">
            Carga:
          </span>
          {[
            { key: 'Todas', label: 'Todas las cargas' },
            { key: 'Critica', label: 'Crítica >90%' },
            { key: 'Moderada', label: '70% – 90%' },
            { key: 'Disponible', label: '< 70%' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedLoadRange(item.key as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                selectedLoadRange === item.key
                  ? 'bg-theme-main text-theme-surface shadow-xs'
                  : 'bg-theme-muted/40 hover:bg-theme-subtle text-theme-muted border border-theme-subtle'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. VISTA DE CATÁLOGO (CARDS VS TABLA) */}
      {/* ========================================================================= */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((m) => {
            const isFlexo = m.area === 'Flexografía';
            const isOffset = m.area === 'Offset';
            const isAcabados = m.area === 'Acabados';

            const committedHours = parseFloat(((m.load / 100) * (m.weeklyCapacityHours || 40)).toFixed(1));
            const availableHours = parseFloat(Math.max(0, (m.weeklyCapacityHours || 40) - committedHours).toFixed(1));
            const altSugerida = (m.alternateMachineNames && m.alternateMachineNames[0]) || 'N/A';

            return (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
              >
                {/* Header de Card */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black text-theme-primary px-2 py-0.5 rounded-md bg-theme-primary/10 border border-theme-primary/20">
                        {m.code || m.id}
                      </span>
                      <span className="text-[10px] font-bold text-theme-muted uppercase">
                        {m.area}
                      </span>
                    </div>

                    <StatusBadge
                      variant={m.status === 'Operativa' ? 'success' : 'warning'}
                      label={m.status}
                      size="xs"
                    />
                  </div>

                  <h3 className="text-base font-black text-theme-main line-clamp-1">
                    {m.name}
                  </h3>

                  <p className="text-[11px] text-theme-muted line-clamp-1">
                    {m.specialty || 'Capacidad industrial estándar para corrida.'}
                  </p>
                </div>

                {/* Barra de Carga Semanal */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-theme-muted/20 border border-theme-subtle">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase text-theme-muted">
                      Carga Semanal
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-black ${
                        m.load > 90 ? 'text-rose-600' : m.load > 75 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {m.load}%
                      </span>
                      <span className="text-[10px] text-theme-muted font-mono">
                        ({committedHours}h / 40h)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-theme-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        m.load > 90 ? 'bg-rose-500' : m.load > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, m.load)}%` }}
                    />
                  </div>
                </div>

                {/* Parámetros Operativos Clave */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-theme-muted block">Velocidad Std</span>
                    <strong className="font-mono font-bold text-theme-main block">
                      {m.standardSpeed?.toLocaleString()} <small className="text-[9px] text-theme-muted font-normal">{m.speedUnit}</small>
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-theme-muted block">Setup Base</span>
                    <strong className="font-mono font-bold text-theme-primary block">
                      {m.baseSetupMinutes} min
                    </strong>
                  </div>
                </div>

                {/* Especificaciones Específicas por Tecnología */}
                {isFlexo && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-theme-muted">Ancho útil: <b className="text-theme-main font-mono">{m.supportedWidthInches}”</b></span>
                      <span className="text-theme-muted">Tintas máx: <b className="text-theme-primary font-mono">{m.maxColors} col</b></span>
                    </div>

                    {/* Inlines badges */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: 'Impresión', ok: (m.maxColors || 0) > 0 },
                        { label: 'Troquel', ok: m.features?.dieCut },
                        { label: 'Barniz', ok: m.features?.varnish },
                        { label: 'Laminado', ok: m.features?.laminate },
                        { label: 'Corona', ok: m.features?.corona },
                        { label: 'Precorte', ok: m.features?.precut },
                      ].filter((x) => x.ok).map((f, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                        >
                          &bull; {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isOffset && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-theme-muted">Cuerpos: <b className="text-theme-primary font-mono">{m.maxColors} tintas</b></span>
                      <span className="text-theme-muted">Forma: <b className="text-theme-main font-mono">{m.maxFormPages || 16} págs</b></span>
                    </div>

                    <div className="p-2 rounded-xl bg-theme-muted/30 text-[10px] text-theme-muted flex items-center justify-between">
                      <span>Paginación:</span>
                      <span className="font-mono font-bold text-theme-main">
                        {m.name.includes('DiDDE') ? '24p &rarr; 16 + 8' : m.maxFormPages === 32 ? 'Hasta 32p directas' : 'Hasta 16p por forma'}
                      </span>
                    </div>
                  </div>
                )}

                {isAcabados && (
                  <div className="p-2 rounded-xl bg-theme-muted/30 text-[10px] text-theme-muted flex items-center justify-between">
                    <span>Especialidad:</span>
                    <span className="font-bold text-theme-main">
                      {m.name.includes('Guillotina') ? 'Corte Polar Memorizado' : m.name.includes('Stahl') ? 'Doblado Farmacéutico' : 'Alzado & Grapado Libro'}
                    </span>
                  </div>
                )}

                {/* Próxima OP y Alternativa */}
                <div className="pt-2 border-t border-theme-subtle space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-theme-muted">Próxima en cola:</span>
                    <span className="font-mono font-bold text-theme-primary">{m.next}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-theme-muted">Alt. sugerida:</span>
                    <span className="font-bold text-theme-main">{altSugerida}</span>
                  </div>
                </div>

                {/* Botón Acción Detalle 360 */}
                <button
                  onClick={() => handleOpenDetail(m, 'general')}
                  className="w-full py-2.5 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Ver ficha técnica 360</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA TABLA TÉCNICA */
        <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-theme-muted/40 border-b border-theme-subtle text-theme-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Código / Máquina</th>
                  <th className="py-3 px-3">Área</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-4">Carga Semanal</th>
                  <th className="py-3 px-3">Velocidad Std</th>
                  <th className="py-3 px-3">Setup Base</th>
                  <th className="py-3 px-4">Capacidades Clave / Inlines</th>
                  <th className="py-3 px-3">Alt. Sugerida</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {filteredMachines.map((m) => {
                  const committedHours = parseFloat(((m.load / 100) * (m.weeklyCapacityHours || 40)).toFixed(1));
                  const altSugerida = (m.alternateMachineNames && m.alternateMachineNames[0]) || 'N/A';

                  return (
                    <tr key={m.id} className="hover:bg-theme-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black text-theme-primary px-1.5 py-0.5 rounded bg-theme-primary/10">
                            {m.code || m.id}
                          </span>
                          <div>
                            <span className="font-bold text-theme-main block">{m.name}</span>
                            <span className="text-[10px] text-theme-muted">{m.location || 'Nave RTM'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-theme-muted">
                        {m.area}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <StatusBadge
                          variant={m.status === 'Operativa' ? 'success' : 'warning'}
                          label={m.status}
                          size="xs"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className={`font-bold ${m.load > 90 ? 'text-rose-600' : 'text-theme-main'}`}>{m.load}%</span>
                            <span className="text-theme-muted">{committedHours}h</span>
                          </div>
                          <div className="w-full bg-theme-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${m.load > 90 ? 'bg-rose-500' : m.load > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, m.load)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-theme-main">
                        {m.standardSpeed?.toLocaleString()} <span className="text-[10px] font-normal text-theme-muted">{m.speedUnit}</span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-theme-primary">
                        {m.baseSetupMinutes} min
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-theme-muted block line-clamp-1">
                          {m.area === 'Flexografía'
                            ? `${m.supportedWidthInches}” · ${m.maxColors} col · troquel/barniz`
                            : m.area === 'Offset'
                            ? `${m.maxColors} col · ${m.maxFormPages || 16} págs/forma`
                            : m.specialty || 'Acabado estándar'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-theme-main text-[11px]">
                        {altSugerida}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(m, 'general')}
                          className="px-3 py-1.5 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-bold text-xs transition-colors cursor-pointer"
                        >
                          Ficha 360
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALES INTEGRADOS */}
      {/* ========================================================================= */}
      {selectedMachine && (
        <DetalleMaquinaModal
          machine={selectedMachine}
          allMachines={machinesList}
          initialTab={initialDetailTab}
          onClose={() => setSelectedMachine(null)}
          onNavigateTab={onNavigateTab}
          onNotice={onNotice}
          onSelectAlternate={(altName) => {
            const found = machinesList.find((x) => x.name === altName);
            if (found) {
              setSelectedMachine(found);
              setInitialDetailTab('general');
              notify(`Abriendo ficha técnica de ${altName}`);
            }
          }}
        />
      )}

      {isNivelacionModalOpen && (
        <SimularNivelacionModal
          machines={machinesList}
          onClose={() => setIsNivelacionModalOpen(false)}
          onApplyRebalance={handleApplyRebalance}
          onNotice={onNotice}
        />
      )}

    </div>
  );
};
