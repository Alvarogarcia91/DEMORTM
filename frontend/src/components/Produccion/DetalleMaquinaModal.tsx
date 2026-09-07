import React, { useState } from 'react';
import {
  X,
  Gauge,
  Clock,
  Sparkles,
  Wrench,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Info,
  Sliders,
  Calendar,
  Zap,
  Printer,
  Scissors,
  Check,
  Building2,
  Activity,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { ProductionMachine, MASTER_RECIPES, MasterManufacturingRecipe } from '../../data/mockProduccionData';
import { StatusBadge } from '../common/StatusBadge';

interface DetalleMaquinaModalProps {
  machine: ProductionMachine | null;
  allMachines: ProductionMachine[];
  initialTab?: 'general' | 'capacidades' | 'estandares' | 'compatibilidad' | 'desempeno';
  onClose: () => void;
  onNavigateTab?: (targetTab: string) => void;
  onNotice?: (msg: string) => void;
  onSelectAlternate?: (machineName: string) => void;
}

export const DetalleMaquinaModal: React.FC<DetalleMaquinaModalProps> = ({
  machine,
  allMachines,
  initialTab = 'general',
  onClose,
  onNavigateTab,
  onNotice,
  onSelectAlternate,
}) => {
  if (!machine) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'capacidades' | 'estandares' | 'compatibilidad' | 'desempeno'>(initialTab);

  // Setup interactivo compuesto para Flexo (P1/P0)
  const [setupBaseActive, setSetupBaseActive] = useState<boolean>(true);
  const [setupPrintActive, setSetupPrintActive] = useState<boolean>(true);
  const [setupDieCutActive, setSetupDieCutActive] = useState<boolean>(machine.features?.dieCut ?? true);
  const [setupVarnishActive, setSetupVarnishActive] = useState<boolean>(machine.features?.varnish ?? false);
  const [setupLaminateActive, setSetupLaminateActive] = useState<boolean>(machine.features?.laminate ?? false);
  const [setupCoronaActive, setSetupCoronaActive] = useState<boolean>(machine.features?.corona ?? false);

  const baseMinutes = machine.baseSetupMinutes || 30;
  const computedSetupMinutes =
    (setupBaseActive ? Math.round(baseMinutes * 0.6) : 0) +
    (setupPrintActive ? 10 : 0) +
    (setupDieCutActive ? 15 : 0) +
    (setupVarnishActive ? 10 : 0) +
    (setupLaminateActive ? 15 : 0) +
    (setupCoronaActive ? 5 : 0);

  // Horas semanales (40h estándar configurable)
  const weeklyHours = machine.weeklyCapacityHours || 40;
  const committedHours = parseFloat(((machine.load / 100) * weeklyHours).toFixed(1));
  const availableHours = parseFloat(Math.max(0, weeklyHours - committedHours).toFixed(1));

  // Recetas compatibles del catálogo MASTER_RECIPES
  const compatibleRecipes = MASTER_RECIPES.filter((r) => {
    if (r.defaultMachine === machine.name) return true;
    if (r.compatibleMachines && r.compatibleMachines.includes(machine.name)) return true;
    return false;
  });

  // Recetas incompatibles con motivos técnicos explícitos
  const incompatibleRecipesList = [
    {
      id: 'incomp-1',
      title: 'Etiqueta 8 colores UV + Estampado',
      client: 'TE CONNECTIVITY · TE-8840',
      reason:
        machine.area !== 'Flexografía'
          ? 'Tecnología incompatible: el producto requiere prensa flexográfica con bobina autoadherible.'
          : (machine.maxColors || 0) < 8
          ? `Límite de tintas: el trabajo exige 8 colores UV y ${machine.name} admite máximo ${machine.maxColors || 0} estaciones.`
          : !machine.features?.laminate
          ? 'Falta estación de laminado en línea requerida para este empaque.'
          : 'Sobrecarga de turno en bahía.',
      isIncompatible: machine.area !== 'Flexografía' || (machine.maxColors || 0) < 8 || !machine.features?.laminate,
    },
    {
      id: 'incomp-2',
      title: 'Manual corporativo 64 páginas (Forma 32 págs)',
      client: 'BLACK & DECKER · BD-64P-ENG',
      reason:
        machine.area !== 'Offset'
          ? 'Tecnología incompatible: el manual exige pliego offset y alzado tipo cuadernillo.'
          : machine.maxFormPages === 16
          ? `Restricción de paginación: ${machine.name} tiene límite de 16 páginas por forma; no admite formas directas de 32 págs sin fraccionar en 2 formas (16+16).`
          : (machine.maxColors || 0) < 2
          ? 'Número de cuerpos de tinta insuficiente.'
          : 'Capacidad saturada.',
      isIncompatible: machine.area !== 'Offset' || machine.maxFormPages === 16,
    },
    {
      id: 'incomp-3',
      title: 'Folleto desplegable en tríptico 150g',
      client: 'FRESENIUS MEDICAL · INS-3P-ESP',
      reason:
        machine.area === 'Flexografía'
          ? 'No compatible: trabajo en pliego plano que debe correr en Offset + Doblado Stahl.'
          : (machine.maxColors || 0) < 4
          ? `Requiere cuatricromía CMYK (4 tintas) y ${machine.name} sólo dispone de ${machine.maxColors || 0} cuerpos.`
          : 'Asignación preferente a Conserver 3-4.',
      isIncompatible: machine.area === 'Flexografía' || (machine.area === 'Offset' && (machine.maxColors || 0) < 4),
    },
  ].filter((item) => item.isIncompatible);

  // Máquinas alternativas compatibles
  const alternateMachineCards = (machine.alternateMachineNames || []).map((altName) => {
    const found = allMachines.find((m) => m.name === altName);
    const altLoad = found ? found.load : 70;
    const altWeekly = found?.weeklyCapacityHours || 40;
    const altFree = parseFloat(Math.max(0, altWeekly - (altLoad / 100) * altWeekly).toFixed(1));
    const isSameArea = found ? found.area === machine.area : true;
    const compatibilityPct = found?.area === machine.area ? (found.maxColors && machine.maxColors && found.maxColors >= machine.maxColors ? 100 : 92) : 75;

    let reason = 'Misma área de proceso con capacidad técnica compatible.';
    if (machine.area === 'Flexografía') {
      if (found && found.supportedWidthInches && machine.supportedWidthInches && found.supportedWidthInches >= machine.supportedWidthInches) {
        reason = `Ancho de banda ${found.supportedWidthInches}" compatible y cuenta con estaciones de acabado inline.`;
      } else {
        reason = 'Misma familia flexográfica con capacidad de troquel rotativo.';
      }
    } else if (machine.area === 'Offset') {
      reason = `Admite formato de pliego y paginación ${found?.maxFormPages || 16} páginas.`;
    }

    return {
      name: altName,
      machine: found,
      compatibilityPct,
      load: altLoad,
      freeHours: altFree,
      reason,
      isAvailable: altLoad < 90,
    };
  });

  // Alternativas NO compatibles explicadas (P0)
  const rejectedAlternates = allMachines
    .filter((m) => m.name !== machine.name && !(machine.alternateMachineNames || []).includes(m.name))
    .slice(0, 2)
    .map((m) => {
      let rejectReason = 'Tecnología o familia de proceso no compatible.';
      if (machine.area === 'Flexografía' && m.area === 'Flexografía') {
        if ((m.supportedWidthInches || 0) < (machine.supportedWidthInches || 0)) {
          rejectReason = `Ancho de banda insuficiente: ${m.supportedWidthInches}" vs ${machine.supportedWidthInches}" requeridos.`;
        } else if ((m.maxColors || 0) < (machine.maxColors || 0)) {
          rejectReason = `Cuerpos de tinta insuficientes: admite ${m.maxColors} tintas (requeridas ${machine.maxColors}).`;
        }
      } else if (machine.area === 'Offset' && m.area === 'Offset') {
        if (machine.maxFormPages === 32 && m.maxFormPages === 16) {
          rejectReason = `Límite de forma de 16 páginas impide formas directas de 32 páginas.`;
        } else if ((m.maxColors || 0) < (machine.maxColors || 0)) {
          rejectReason = `Cuerpos de tinta insuficientes (${m.maxColors} vs ${machine.maxColors}).`;
        }
      } else if (machine.area !== m.area) {
        rejectReason = `Área no compatible: la orden exige tecnología ${machine.area} y este equipo es de ${m.area}.`;
      }
      return {
        name: m.name,
        code: m.code || m.id,
        rejectReason,
      };
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-theme-surface border border-theme-subtle rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-theme-main">
        
        {/* ========================================================================= */}
        {/* 1. HEADER MODAL */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 border-b border-theme-subtle bg-theme-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
              machine.area === 'Flexografía'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                : machine.area === 'Offset'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                : 'bg-gradient-to-br from-amber-500 to-orange-600'
            }`}>
              {machine.area === 'Flexografía' ? (
                <Sliders className="w-6 h-6" />
              ) : machine.area === 'Offset' ? (
                <Printer className="w-6 h-6" />
              ) : (
                <Scissors className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black text-theme-primary px-2 py-0.5 rounded-lg bg-theme-primary/10 border border-theme-primary/20">
                  {machine.code || machine.id}
                </span>
                <span className="text-[10px] uppercase font-bold text-theme-muted">
                  {machine.area} &bull; {machine.location || 'Planta RTM'}
                </span>
                <StatusBadge
                  variant={machine.status === 'Operativa' ? 'success' : 'warning'}
                  label={machine.status}
                  size="sm"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-theme-main tracking-tight">
                {machine.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-theme-muted block">
                Carga Semanal
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-mono font-black ${
                  machine.load > 90 ? 'text-rose-600' : machine.load > 75 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {machine.load}%
                </span>
                <span className="text-xs text-theme-muted font-mono">
                  ({committedHours}h / {weeklyHours}h)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-theme-muted/50 hover:bg-theme-subtle text-theme-muted hover:text-theme-main transition-all cursor-pointer"
              title="Cerrar ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TAB NAVIGATION */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 px-5 pt-3 border-b border-theme-subtle bg-theme-surface overflow-x-auto shrink-0 scrollbar-none">
          {[
            { key: 'general', label: 'General & Datos', icon: Info },
            { key: 'capacidades', label: 'Capacidades Técnicas', icon: Sliders },
            { key: 'estandares', label: 'Estándares & Setup', icon: Clock },
            { key: 'compatibilidad', label: 'Compatibilidad & Alternativas', icon: Layers },
            { key: 'desempeno', label: 'Desempeño & Planeación', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
                  isCurrent
                    ? 'border-theme-primary text-theme-primary bg-theme-primary/5'
                    : 'border-transparent text-theme-muted hover:text-theme-main hover:bg-theme-muted/30'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. TAB CONTENT */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 1: GENERAL */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Fila superior de datos clave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
                  <div className="flex items-center gap-2 text-theme-muted font-bold text-[10px] uppercase">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Fabricante y Ubicación</span>
                  </div>
                  <div className="text-sm font-bold text-theme-main">
                    {machine.manufacturer || 'Fabricante RTM Certificado'}
                  </div>
                  <div className="text-theme-muted text-[11px]">
                    Modelo: <span className="font-mono text-theme-main font-semibold">{machine.modelYear || 'Industrial Standard'}</span>
                  </div>
                  <div className="text-theme-muted text-[11px]">
                    Nave / Bahía: <span className="font-semibold text-theme-main">{machine.location || 'Nave Principal RTM'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
                  <div className="flex items-center gap-2 text-theme-muted font-bold text-[10px] uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Capacidad Semanal Demo</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-black text-theme-main">
                      {weeklyHours} h
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
                      Demo configurable
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-theme-muted">Comprometido: <b className="text-amber-600 font-mono">{committedHours} h</b></span>
                    <span className="text-theme-muted">Disponible: <b className="text-emerald-600 font-mono">{availableHours} h</b></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle space-y-2">
                  <div className="flex items-center gap-2 text-theme-muted font-bold text-[10px] uppercase">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Próxima Asignación</span>
                  </div>
                  <div className="text-sm font-mono font-black text-theme-primary">
                    {machine.next}
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Orden de producción programada en secuencia de corrida.
                  </p>
                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('Planeación');
                      if (onNotice) onNotice(`Navegando a Planeación para inspeccionar cola de ${machine.name}`);
                    }}
                    className="text-[11px] font-bold text-theme-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Ver en Gantt de Planeación</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Especialidad de la máquina */}
              <div className="p-4 rounded-2xl bg-theme-primary/5 border border-theme-primary/20 space-y-1.5">
                <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Especialidad Operativa en Planta</span>
                </div>
                <p className="text-sm font-semibold text-theme-main">
                  {machine.specialty || 'Operación estándar según receta maestra asignada.'}
                </p>
              </div>

              {/* Ventana de Mantenimiento Preventivo */}
              <div className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-theme-muted" />
                    <span className="font-bold text-theme-main text-xs uppercase tracking-wider">
                      Estado en Mantenimiento Preventivo
                    </span>
                    <StatusBadge variant="success" label="Calibración Vigente" size="sm" />
                  </div>
                  <p className="text-theme-muted text-[11px]">
                    Último mantenimiento preventivo: <b className="text-theme-main">Hace 12 días</b> &bull; Próxima inspección programada: <b className="text-theme-main">En 18 días (Fin de mes)</b>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (onNotice) {
                      onNotice(`Mantenimiento Preventivo de ${machine.name} está al día. OT de servicio en Mantenimiento.`);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold border border-theme-subtle transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
                >
                  Ver en Mantenimiento
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 2: CAPACIDADES TÉCNICAS */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'capacidades' && (
            <div className="space-y-6">
              {/* Sección Flexografía */}
              {machine.area === 'Flexografía' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Ancho Máx. Banda</span>
                      <strong className="text-lg font-mono font-black text-theme-main block">
                        {machine.supportedWidthInches ? `${machine.supportedWidthInches} pulgadas` : '10 pulgadas'}
                      </strong>
                      <span className="text-[10px] text-theme-muted">Capacidad de sustrato</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Estaciones de Tinta</span>
                      <strong className="text-lg font-mono font-black text-theme-primary block">
                        {machine.maxColors !== undefined ? `${machine.maxColors} colores` : 'N/A'}
                      </strong>
                      <span className="text-[10px] text-theme-muted">Cuerpos flexo UV</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Tipo de Secado</span>
                      <strong className="text-lg font-mono font-black text-theme-main block">
                        Lámparas UV
                      </strong>
                      <span className="text-[10px] text-theme-muted">Curado instantáneo</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Repetición de Cilindro</span>
                      <strong className="text-lg font-mono font-black text-theme-main block">
                        7” – 14” repeat
                      </strong>
                      <span className="text-[10px] text-theme-muted">Caseteras RTM</span>
                    </div>
                  </div>

                  {/* Operaciones Inline Checklist */}
                  <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-theme-primary" />
                        <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                          Operaciones en Línea Soportadas (Inline Capabilities)
                        </h4>
                      </div>
                      <span className="text-[10px] text-theme-muted">Validado en planta RTM</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {[
                        { label: 'Impresión Flexográfica', supported: (machine.maxColors || 0) > 0, detail: `${machine.maxColors || 0} tintas UV` },
                        { label: 'Troquelado Rotativo', supported: machine.features?.dieCut ?? false, detail: 'Suaje flexible magnético' },
                        { label: 'Barniz UV Sobreimpresión', supported: machine.features?.varnish ?? false, detail: 'Estación de acabado brillo/mate' },
                        { label: 'Laminado Película BOPP', supported: machine.features?.laminate ?? false, detail: 'Torre de laminado autoadherible' },
                        { label: 'Tratamiento Corona', supported: machine.features?.corona ?? false, detail: 'Activación superficial sustrato' },
                        { label: 'Precorte Longitudinal', supported: machine.features?.precut ?? false, detail: 'Navajas refiladoras de orilla' },
                        { label: 'Rebobinado Dual en Línea', supported: machine.features?.rewind ?? false, detail: 'Ejes expansibles para rollos' },
                      ].map((op, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                            op.supported
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                              : 'bg-theme-muted/30 border-theme-subtle text-theme-muted opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {op.supported ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                            )}
                            <div>
                              <span className="font-bold block text-xs">{op.label}</span>
                              <span className="text-[10px] opacity-80 block">{op.detail}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            op.supported ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                          }`}>
                            {op.supported ? 'DISPONIBLE' : 'NO DISP'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sección Offset */}
              {machine.area === 'Offset' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Máx. Tintas / Cuerpos</span>
                      <strong className="text-lg font-mono font-black text-theme-primary block">
                        {machine.maxColors} colores
                      </strong>
                      <span className="text-[10px] text-theme-muted">Impresión pliego</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Límite Forma</span>
                      <strong className="text-lg font-mono font-black text-theme-main block">
                        {machine.maxFormPages ? `${machine.maxFormPages} páginas` : '16 páginas'}
                      </strong>
                      <span className="text-[10px] text-theme-muted">Por cara / tiro</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Formato Pliego</span>
                      <strong className="text-xs font-mono font-bold text-theme-main block">
                        {machine.maxSheetSize || '570 x 870 mm'}
                      </strong>
                      <span className="text-[10px] text-theme-muted">Mín: {machine.minSheetSize || '210 x 297 mm'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted block">Rango Gramajes</span>
                      <strong className="text-xs font-mono font-bold text-theme-main block">
                        {machine.paperWeightRangeGsm || '50 – 150 g/m²'}
                      </strong>
                      <span className="text-[10px] text-theme-muted">Bond, Couche, Sulfatada</span>
                    </div>
                  </div>

                  {/* Matriz de Paginación Offset (Restricción técnica explicada por Iván) */}
                  <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-theme-primary" />
                        <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                          Matriz de Paginación Ligada a Capacidad de Forma
                        </h4>
                      </div>
                      <span className="text-[10px] text-theme-muted">Restricción mecánica documentada</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {[
                        { pages: 8, allowed: true, note: '1 forma estándar de 8 páginas' },
                        { pages: 12, allowed: true, note: 'Forma combinada o tiro/retiro' },
                        { pages: 16, allowed: true, note: '1 forma completa de 16 páginas' },
                        {
                          pages: 24,
                          allowed: true,
                          note: machine.name.includes('DiDDE')
                            ? 'Paginación 16 + 8 permitida'
                            : machine.maxFormPages === 32
                            ? 'Forma de 32 con sobrante o 16 + 8'
                            : 'Requiere 2 formas (16 + 8)',
                        },
                        {
                          pages: 32,
                          allowed: machine.maxFormPages === 32,
                          note: machine.maxFormPages === 32
                            ? 'Forma directa de 32 páginas'
                            : '✕ Requiere fraccionar en 2 formas de 16',
                        },
                        {
                          pages: 64,
                          allowed: true,
                          note: machine.maxFormPages === 32
                            ? '2 formas de 32 páginas'
                            : '4 formas de 16 páginas',
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex flex-col justify-between space-y-1.5 ${
                            item.allowed
                              ? 'bg-theme-muted/30 border-theme-subtle'
                              : 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-sm">
                              {item.pages} págs
                            </span>
                            {item.allowed ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <X className="w-4 h-4 text-rose-600" />
                            )}
                          </div>
                          <span className="text-[10px] text-theme-muted leading-tight">
                            {item.note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sección Acabados */}
              {machine.area === 'Acabados' && (
                <div className="p-5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-4">
                  <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase">
                    <Scissors className="w-4 h-4" />
                    <span>Especificaciones de Acabados & Encarte</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted">Tipo de Equipo</span>
                      <strong className="text-sm font-bold text-theme-main block">
                        {machine.name.includes('Guillotina') ? 'Guillotina Programada' : machine.name.includes('Stahl') ? 'Plegadora de Cuchilla' : 'Alzado y Grapado'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted">Capacidad Nominal</span>
                      <strong className="text-sm font-mono font-bold text-theme-main block">
                        {machine.standardSpeed?.toLocaleString()} {machine.speedUnit}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                      <span className="text-[10px] uppercase font-bold text-theme-muted">Tiempo de Setup Estándar</span>
                      <strong className="text-sm font-mono font-bold text-theme-main block">
                        {machine.baseSetupMinutes} minutos
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 3: ESTÁNDARES & SETUP */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'estandares' && (
            <div className="space-y-6">
              {/* Estándares Operativos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Setup Base Estándar</span>
                  <strong className="text-xl font-mono font-black text-theme-primary block">
                    {machine.baseSetupMinutes || 30} min
                  </strong>
                  <span className="text-[10px] text-theme-muted">Ajuste de máquina</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Velocidad Estándar</span>
                  <strong className="text-xl font-mono font-black text-theme-main block">
                    {machine.standardSpeed?.toLocaleString()} <small className="text-xs font-normal text-theme-muted">{machine.speedUnit}</small>
                  </strong>
                  <span className="text-[10px] text-theme-muted">Rendimiento nominal</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Eficiencia Objetivo</span>
                    <span className="text-[8px] font-bold text-theme-muted bg-theme-muted px-1 rounded">Demo</span>
                  </div>
                  <strong className="text-xl font-mono font-black text-emerald-600 block">
                    {machine.efficiencyTargetPct || 85}%
                  </strong>
                  <span className="text-[10px] text-theme-muted">OEE presupuestado</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-subtle space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Capacidad Semanal</span>
                    <span className="text-[8px] font-bold text-theme-muted bg-theme-muted px-1 rounded">Demo</span>
                  </div>
                  <strong className="text-xl font-mono font-black text-theme-main block">
                    {weeklyHours} h
                  </strong>
                  <span className="text-[10px] text-theme-muted">Turno regular 40h</span>
                </div>
              </div>

              {/* SIMULADOR DE SETUP COMPUESTO INTERACTIVO (P0/P1) */}
              <div className="p-5 rounded-3xl bg-theme-muted/20 border border-theme-subtle space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-theme-primary" />
                    <div>
                      <h4 className="font-black text-theme-main text-sm uppercase tracking-wider">
                        Simulador de Setup Compuesto &bull; Corrida Específica
                      </h4>
                      <p className="text-[11px] text-theme-muted">
                        El tiempo de preparación se calcula sumando los módulos de acabado activados para la orden.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-theme-muted text-theme-muted border border-theme-subtle">
                    Demo configurable
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupBaseActive}
                        onChange={(e) => setSetupBaseActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Preparación base y montaje</span>
                        <span className="text-[10px] text-theme-muted">Carga de bobina/pliego, rasquetas y guías</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+{Math.round(baseMinutes * 0.6)} min</span>
                  </label>

                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupPrintActive}
                        onChange={(e) => setSetupPrintActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Entintado y registro</span>
                        <span className="text-[10px] text-theme-muted">Alineación de clichés / placas y prueba de tono</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+10 min</span>
                  </label>

                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupDieCutActive}
                        onChange={(e) => setSetupDieCutActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Montaje de Suaje / Troquel</span>
                        <span className="text-[10px] text-theme-muted">Montaje en cilindro magnético y calce</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+15 min</span>
                  </label>

                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupVarnishActive}
                        onChange={(e) => setSetupVarnishActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Barnizado UV en línea</span>
                        <span className="text-[10px] text-theme-muted">Carga de barniz gloss/mate y secado UV</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+10 min</span>
                  </label>

                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupLaminateActive}
                        onChange={(e) => setSetupLaminateActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Laminado BOPP</span>
                        <span className="text-[10px] text-theme-muted">Enhebrado de película térmica y tensión</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+15 min</span>
                  </label>

                  <label className="p-3 rounded-2xl bg-theme-surface border border-theme-subtle flex items-center justify-between cursor-pointer hover:border-theme-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={setupCoronaActive}
                        onChange={(e) => setSetupCoronaActive(e.target.checked)}
                        className="rounded text-theme-primary cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs block text-theme-main">Tratamiento Corona & Precorte</span>
                        <span className="text-[10px] text-theme-muted">Calibración de dyna y ajuste de navajas</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-theme-primary">+5 min</span>
                  </label>
                </div>

                {/* Resultado Dinámico */}
                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-primary/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase font-bold block">
                      Setup Total Estimado para Esta Configuración
                    </span>
                    <strong className="text-xl sm:text-2xl font-mono font-black text-theme-primary">
                      {computedSetupMinutes} minutos
                    </strong>
                    <span className="text-[10px] text-theme-muted ml-2">
                      ({(computedSetupMinutes / 60).toFixed(2)} horas de ajuste)
                    </span>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-theme-primary/10 text-theme-primary font-bold text-xs border border-theme-primary/20">
                    Cálculo dinámico en vivo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 4: COMPATIBILIDAD & ALTERNATIVAS */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'compatibilidad' && (
            <div className="space-y-6">
              
              {/* Bloque 1: Recetas / Artículos Compatibles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-theme-primary" />
                    <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                      Recetas y Artículos Compatibles en Catálogo
                    </h4>
                  </div>
                  <span className="text-[10px] text-theme-muted font-mono">
                    {compatibleRecipes.length} recetas soportadas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {compatibleRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="p-3.5 rounded-2xl bg-theme-surface border border-emerald-500/20 space-y-2 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {recipe.partNumber} &bull; {recipe.revision}
                        </span>
                        <StatusBadge variant="success" label="100% Compatible" size="xs" />
                      </div>
                      <h5 className="font-bold text-xs text-theme-main line-clamp-1">
                        {recipe.name}
                      </h5>
                      <p className="text-[11px] text-theme-muted line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-theme-subtle text-[10px] text-theme-muted">
                        <span>Cliente: <b>{recipe.client}</b></span>
                        <span className="font-mono">Setup std: {recipe.standardSetupMinutes}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque 2: Recetas INCOMPATIBLES con Motivo Explícito (P0) */}
              <div className="p-4 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="font-black text-xs uppercase tracking-wider">
                    Recetas No Compatibles &bull; Restricciones Técnicas de Máquina
                  </h4>
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Estas recetas requieren especificaciones que exceden las capacidades mecánicas de {machine.name}.
                </p>

                <div className="space-y-2.5">
                  {incompatibleRecipesList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-theme-surface border border-rose-500/30 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-theme-main font-bold">{item.title}</strong>
                        <span className="font-mono text-[10px] text-theme-muted">{item.client}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400 font-medium text-[11px] pt-0.5">
                        <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{item.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque 3: Máquinas Alternativas Sugeridas (P0) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                      Máquinas Alternativas Compatibles para Nivelación
                    </h4>
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                    Sugerencia del sistema
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {alternateMachineCards.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-theme-surface border border-theme-subtle hover:border-theme-primary/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-theme-main">
                          {alt.name}
                        </strong>
                        <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {alt.compatibilityPct}% Compatibilidad
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-theme-muted/30">
                          <span className="text-[10px] text-theme-muted uppercase font-bold block">Carga Actual</span>
                          <span className={`font-mono font-bold ${alt.load > 85 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {alt.load}%
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-theme-muted/30">
                          <span className="text-[10px] text-theme-muted uppercase font-bold block">Capacidad Libre</span>
                          <span className="font-mono font-bold text-emerald-600">
                            {alt.freeHours} h
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-theme-muted">
                        {alt.reason}
                      </p>

                      <button
                        onClick={() => {
                          if (onSelectAlternate) {
                            onSelectAlternate(alt.name);
                          } else if (onNotice) {
                            onNotice(`Alternativa ${alt.name} seleccionada para balanceo de carga.`);
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Abrir ficha de {alt.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Alternativas Rechazadas con Motivo */}
                <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-2">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">
                    Equipos Evaluados No Viables como Alternativa
                  </span>
                  <div className="space-y-1.5">
                    {rejectedAlternates.map((rej, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] gap-2">
                        <span className="font-bold text-theme-muted line-clamp-1">{rej.name}</span>
                        <span className="text-zinc-500 font-medium text-right shrink-0">{rej.rejectReason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB 5: DESEMPEÑO & PLANEACIÓN */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'desempeno' && (
            <div className="space-y-6">
              
              {/* KPIs de Desempeño Reciente */}
              <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-theme-primary" />
                    <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                      Desempeño Observado en Planta &bull; Últimos Turnos
                    </h4>
                  </div>
                  <span className="text-[10px] text-theme-muted font-mono">Turnos 1 y 2</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Eficiencia Real</span>
                    <strong className="text-xl font-mono font-black text-emerald-600 block">
                      91.6%
                    </strong>
                    <span className="text-[10px] text-theme-muted">Sobre meta 85%</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Setup Real Prom.</span>
                    <strong className="text-xl font-mono font-black text-amber-600 block">
                      34 min
                    </strong>
                    <span className="text-[10px] text-amber-600 font-medium">+13.3% vs estándar</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Tiempo Perdido</span>
                    <strong className="text-xl font-mono font-black text-rose-600 block">
                      47 min
                    </strong>
                    <span className="text-[10px] text-theme-muted">Paros no programados</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-theme-muted/30 border border-theme-subtle space-y-1">
                    <span className="text-[10px] uppercase font-bold text-theme-muted block">Scrap Asociado</span>
                    <strong className="text-xl font-mono font-black text-theme-main block">
                      3.8%
                    </strong>
                    <span className="text-[10px] text-theme-muted">Dentro de tolerancia</span>
                  </div>
                </div>
              </div>

              {/* Impacto en Planeación */}
              <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-theme-main text-xs uppercase tracking-wider">
                      Impacto Directo en Planeación Semanal
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    machine.load > 90 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    Riesgo de Saturación: {machine.load > 90 ? 'Crítico (>90%)' : machine.load > 75 ? 'Medio' : 'Bajo'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-theme-muted/30 border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-theme-muted block">
                      Horas Comprometidas: <b className="text-theme-main font-mono">{committedHours} h</b> de <b className="text-theme-main font-mono">{weeklyHours} h</b> disponibles.
                    </span>
                    <span className="text-xs text-theme-muted block mt-0.5">
                      Próximas órdenes de producción programadas en cola: <b className="text-theme-primary font-mono">4 OPs</b>.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab('Planeación');
                        if (onNotice) onNotice(`Abriendo Gantt de Planeación filtrado por ${machine.name}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-theme-primary text-white font-bold text-xs hover:bg-theme-primary/90 transition-all shadow-xs cursor-pointer"
                    >
                      Ver en Planeación
                    </button>

                    <button
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab('Analítica');
                        if (onNotice) onNotice(`Abriendo Analítica de Rendimiento para ${machine.name}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer"
                    >
                      Abrir Analítica
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 4. FOOTER MODAL */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-theme-subtle bg-theme-muted/20 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-theme-muted font-mono">
            ID: {machine.id} &bull; Catálogo Industrial RTM v11
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
