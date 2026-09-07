import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Clock,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Wrench,
  UserCheck,
  Sparkles,
  ArrowRight,
  Plus,
  RotateCcw,
  Check,
  X,
  Layers,
  Tag,
  Scissors,
  Disc,
  Thermometer,
  Droplets,
  AlertOctagon,
  ChevronDown,
  Monitor,
  Zap,
  PackageCheck,
  SendHorizontal,
  History,
  Activity,
  Award,
  TrendingDown,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import {
  ProductionOrder,
  OperatorDailyReportEntry,
  OPERATOR_DAILY_REPORTS,
} from '../../data/mockProduccionData';
import {
  OperatorTerminal,
  INITIAL_TERMINALS,
  ProductionScrapEvent,
  INITIAL_SCRAP_EVENTS,
  ProductionDowntimeEvent,
  INITIAL_DOWNTIME_EVENTS,
  ProductionSuggestion,
  INITIAL_PRODUCTION_SUGGESTIONS,
} from '../../data/mockProductionV9Data';
import { formatNumber } from './productionUi';
import { SolicitarMaterialExtraModal } from './SolicitarMaterialExtraModal';
import { ReporteDiarioOperadorModal } from './ReporteDiarioOperadorModal';

interface PisoOperadorWorkspaceProps {
  orders: ProductionOrder[];
  onUpdateOrder: (id: string, patch: Partial<ProductionOrder>) => void;
  onNavigateToProduccion?: () => void;
  onNavigateToCalidad?: () => void;
  initialMachineCode?: string;
}

type OperatorTab = 'trabajo' | 'cola' | 'historial' | 'desempeno';

export const PisoOperadorWorkspace: React.FC<PisoOperadorWorkspaceProps> = ({
  orders,
  onUpdateOrder,
  onNavigateToProduccion,
  onNavigateToCalidad,
  initialMachineCode = 'FLX-03',
}) => {
  // 1. Terminal y Operador activo
  const [terminals, setTerminals] = useState<OperatorTerminal[]>(INITIAL_TERMINALS);
  const [activeMachineCode, setActiveMachineCode] = useState<string>(initialMachineCode);
  const [isMachineSelectorOpen, setIsMachineSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<OperatorTab>('trabajo');

  // 2. Terminal seleccionada
  const activeTerminal = useMemo(() => {
    return (
      terminals.find((t) => t.machineCode === activeMachineCode) ||
      terminals[0]
    );
  }, [terminals, activeMachineCode]);

  // 3. Órdenes filtradas por máquina activa
  const machineOrders = useMemo(() => {
    return orders.filter(
      (ord) =>
        ord.machine.toUpperCase().includes(activeTerminal.machineCode) ||
        ord.machine.toLowerCase().includes(activeTerminal.area.toLowerCase()) ||
        (activeTerminal.area === 'Flexografía' && ord.area === 'Flexografía') ||
        (activeTerminal.area === 'Offset' && ord.area === 'Offset')
    );
  }, [orders, activeTerminal]);

  // Orden activa en la máquina (la primera en proceso o preparación, o la primera de la cola)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const activeOrder = useMemo(() => {
    if (selectedOrderId) {
      const found = orders.find((o) => o.id === selectedOrderId);
      if (found) return found;
    }
    // Buscar orden en proceso o en preparación en esta máquina
    const inProcess = machineOrders.find((o) => o.status === 'En proceso');
    if (inProcess) return inProcess;
    const inPrep = machineOrders.find((o) => o.status === 'En preparación');
    if (inPrep) return inPrep;
    const ready = machineOrders.find(
      (o) => o.status === 'Lista para producir' || o.status === 'Material surtido'
    );
    if (ready) return ready;
    return machineOrders[0] || null;
  }, [orders, machineOrders, selectedOrderId]);

  // 4. Checklist de arranque (FM-PR-003) para la orden activa
  const [checklist, setChecklist] = useState({
    materialsReady: true,
    toolingMounted: true,
    environmentChecked: true,
    cleaningDone: false,
    supervisorSigned: false,
  });

  const isChecklistComplete =
    checklist.materialsReady &&
    checklist.toolingMounted &&
    checklist.environmentChecked &&
    checklist.cleaningDone;

  // 5. Cronómetro de operación / Setup
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(1420);
  const [setupSeconds, setSetupSeconds] = useState<number>(1850);
  const [isSetupActive, setIsSetupActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    let interval: any;
    if (isSetupActive) {
      interval = setInterval(() => {
        setSetupSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSetupActive]);

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs
      .toString()
      .padStart(2, '0')}`;
  };

  // 6. Notificaciones y Sugerencias Inteligentes (morado ERP Nexora)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const suggestions = useMemo(() => {
    return INITIAL_PRODUCTION_SUGGESTIONS.filter(
      (s) => (s.context === 'piso' || s.context === 'scrap') && !dismissedSuggestions.includes(s.id)
    );
  }, [dismissedSuggestions]);

  // 7. Modales de piso
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [isIncidenceModalOpen, setIsIncidenceModalOpen] = useState(false);
  const [isMaterialExtraModalOpen, setIsMaterialExtraModalOpen] = useState(false);
  const [isQuickUnitsModalOpen, setIsQuickUnitsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false);

  // Estados para captura de Scrap
  const [scrapQty, setScrapQty] = useState<number>(350);
  const [scrapType, setScrapType] = useState<ProductionScrapEvent['type']>('Ajuste de registro');
  const [scrapCategory4M, setScrapCategory4M] = useState<ProductionScrapEvent['category4M']>('Máquina');
  const [scrapReason, setScrapReason] = useState<string>('Descalce en estación de color 2 por variación de tensión');
  const [scrapComment, setScrapComment] = useState<string>('Se ajustaron los rodillos tensores y se recuperó el registro.');

  // Estados para remanente Flexo al terminar
  const [flexoRemnantMeters, setFlexoRemnantMeters] = useState<number>(145);
  const [flexoRemnantWeightKg, setFlexoRemnantWeightKg] = useState<number>(12.8);
  const [flexoReturnLocation, setFlexoReturnLocation] = useState<string>('Rack R-04 Bobinas Parciales');

  // Estados para Registro de Producción Rápida
  const [quickGoodQty, setQuickGoodQty] = useState<number>(2500);

  // Estados para Paro 4M
  const [stopCode, setStopCode] = useState<'100' | '200' | '300' | '400'>('200');
  const [stopMinutes, setStopMinutes] = useState<number>(15);
  const [stopReason, setStopReason] = useState<string>('Ajuste de tensión y racleta en unidad 2');
  const [stopCategory4M, setStopCategory4M] = useState<'Máquina' | 'Material' | 'Mano de obra' | 'Método'>('Máquina');

  // Estados locales de reportes y eventos de scrap
  const [scrapEvents, setScrapEvents] = useState<ProductionScrapEvent[]>(INITIAL_SCRAP_EVENTS);
  const [downtimeEvents, setDowntimeEvents] = useState<ProductionDowntimeEvent[]>(INITIAL_DOWNTIME_EVENTS);
  const [dailyReports, setDailyReports] = useState<OperatorDailyReportEntry[]>(OPERATOR_DAILY_REPORTS);

  // Cálculo de scrap y alerta roja de umbral 5%
  const currentScrapPercent = useMemo(() => {
    if (!activeOrder || !activeOrder.quantity) return 0;
    const totalProcessed = (activeOrder.good || 0) + (activeOrder.scrap || 0);
    if (totalProcessed === 0) return 0;
    return Number(((activeOrder.scrap / totalProcessed) * 100).toFixed(2));
  }, [activeOrder]);

  const isScrapExceeded = currentScrapPercent > 5.0;

  // Acciones de Piso
  const handleStartSetup = () => {
    setIsSetupActive(true);
    setToastMessage('Puesta a punto (Setup) iniciada. Cronómetro de alistamiento corriendo.');
  };

  const handleFinishSetup = () => {
    setIsSetupActive(false);
    if (activeOrder) {
      onUpdateOrder(activeOrder.id, {
        status: 'En preparación',
        setupMinutes: Math.round(setupSeconds / 60),
      });
    }
    setToastMessage('Setup finalizado. Realiza el tiraje de prueba y solicita la liberación de Primera Pieza a Calidad.');
  };

  const handleRequestFirstPiece = () => {
    if (!activeOrder) return;
    onUpdateOrder(activeOrder.id, {
      qualityGates: {
        ...(activeOrder.qualityGates ?? {
          prepressReleased: true,
          finalAuditApproved: false,
          firstPieceReleased: false,
        }),
        firstPieceRequested: true,
      },
      traceability: [
        {
          id: `tr-qp-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: `${activeTerminal.assignedOperator.name} (${activeTerminal.machineCode})`,
          station: activeTerminal.machineName,
          event: 'Primera Pieza enviada a inspección de Calidad (FM-CAL-004)',
          notes: 'Esperando dictamen técnico de Alicia Ramírez. La máquina permanece en espera.',
          badgeTone: 'primary',
        },
        ...(activeOrder.traceability ?? []),
      ],
    });
    setToastMessage('✓ Muestra de Primera Pieza enviada a mesa de Calidad. Bloqueada hasta recibir dictamen de Alicia Ramírez.');
  };

  // Simulación para el demo: Alicia aprueba primera pieza
  const handleSimulateCalidadApproval = () => {
    if (!activeOrder) return;
    onUpdateOrder(activeOrder.id, {
      qualityGates: {
        ...(activeOrder.qualityGates ?? { prepressReleased: true, finalAuditApproved: false }),
        firstPieceReleased: true,
        firstPieceRequested: false,
        firstPieceApprover: 'Alicia Ramírez (Calidad)',
      },
      status: 'En proceso',
      traceability: [
        {
          id: `tr-qa-appr-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: 'Alicia Ramírez (Control de Calidad)',
          station: 'Mesa de Inspección QA',
          event: 'Primera Pieza CONFORME y Liberada',
          notes: 'Registro milimétrico, tono Pantone 485C delta E < 1.2, lectura de código de barras grado A. Autorizado tiraje.',
          badgeTone: 'success',
        },
        ...(activeOrder.traceability ?? []),
      ],
    });
    setIsTimerRunning(true);
    setToastMessage('✓ Calidad ha APROBADO la Primera Pieza. Máquina autorizada para arrancar tiraje a velocidad nominal.');
  };

  const handleStartProduction = () => {
    if (!activeOrder) return;
    setIsTimerRunning(true);
    onUpdateOrder(activeOrder.id, {
      status: 'En proceso',
      progress: Math.max(activeOrder.progress, 15),
    });
    setToastMessage(`✓ Tiraje en marcha en ${activeTerminal.machineCode}. Cronómetro de corrida activo.`);
  };

  const handlePauseProduction = () => {
    setIsTimerRunning(false);
    if (activeOrder) {
      onUpdateOrder(activeOrder.id, { status: 'Detenida' });
    }
    setToastMessage('Máquina en pausa operativa.');
  };

  const handleAddQuickGood = () => {
    if (!activeOrder) return;
    const newGood = (activeOrder.good || 0) + quickGoodQty;
    const totalTarget = activeOrder.quantity || 1;
    const newProgress = Math.min(100, Math.round((newGood / totalTarget) * 100));

    onUpdateOrder(activeOrder.id, {
      good: newGood,
      progress: newProgress,
      traceability: [
        {
          id: `tr-good-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: activeTerminal.assignedOperator.name,
          station: activeTerminal.machineCode,
          event: `Registro parcial de tiraje: +${quickGoodQty.toLocaleString()} piezas buenas`,
          notes: `Total acumulado: ${newGood.toLocaleString()} / ${totalTarget.toLocaleString()} ejs (${newProgress}%)`,
          badgeTone: 'success',
        },
        ...(activeOrder.traceability ?? []),
      ],
    });

    setIsQuickUnitsModalOpen(false);
    setToastMessage(`✓ +${quickGoodQty.toLocaleString()} piezas buenas sumadas a ${activeOrder.folio}.`);
  };

  const handleSaveScrapEvent = () => {
    if (!activeOrder) return;
    const prevScrap = activeOrder.scrap || 0;
    const newScrap = prevScrap + scrapQty;
    const totalRun = (activeOrder.good || 0) + newScrap;
    const pctBefore = Number(((prevScrap / (totalRun || 1)) * 100).toFixed(2));
    const pctAfter = Number(((newScrap / (totalRun || 1)) * 100).toFixed(2));

    const newEvent: ProductionScrapEvent = {
      id: `scr-ev-${Date.now()}`,
      opId: activeOrder.id,
      opFolio: activeOrder.folio,
      client: activeOrder.cliente,
      partNumber: activeOrder.partNumber,
      routingStep: activeTerminal.area === 'Flexografía' ? 'Impresión Flexográfica 4 Tintas' : 'Impresión Offset Plana',
      machine: activeTerminal.machineCode,
      operator: activeTerminal.assignedOperator.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quantity: scrapQty,
      unit: activeTerminal.area === 'Flexografía' ? 'Etiquetas' : 'Pliegos',
      type: scrapType,
      category4M: scrapCategory4M,
      reason: scrapReason,
      comment: scrapComment,
      scrapPercentBefore: pctBefore,
      scrapPercentAfter: pctAfter,
    };

    setScrapEvents((prev) => [newEvent, ...prev]);

    onUpdateOrder(activeOrder.id, {
      scrap: newScrap,
      traceability: [
        {
          id: `tr-scr-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: activeTerminal.assignedOperator.name,
          station: activeTerminal.machineCode,
          event: `Reporte de Scrap: +${scrapQty.toLocaleString()} ejs (${scrapType} · 4M: ${scrapCategory4M})`,
          notes: `Razón: ${scrapReason} | Acumulado merma: ${newScrap.toLocaleString()} ejs (${pctAfter}%). ${
            pctAfter > 5.0 ? '¡ALERTA ROJA: Supera límite del 5.0%!' : 'Dentro de tolerancia.'
          }`,
          badgeTone: pctAfter > 5.0 ? 'danger' : 'warning',
        },
        ...(activeOrder.traceability ?? []),
      ],
    });

    setIsScrapModalOpen(false);
    if (pctAfter > 5.0) {
      setToastMessage(
        `⚠️ ALERTA DE MERMA: El scrap de ${activeOrder.folio} subió a ${pctAfter}% (> 5.0%). Alerta enviada a Supervisor y Calidad.`
      );
    } else {
      setToastMessage(`✓ Scrap de ${scrapQty.toLocaleString()} ejs registrado correctamente.`);
    }
  };

  const handleSaveDowntime = () => {
    if (!activeOrder) return;
    const descMap = {
      '100': 'Paro de Máquina / Falla Mecánica',
      '200': 'Ajuste de Proceso / Puesta a Punto',
      '300': 'Materia Prima / Desabasto',
      '400': 'Operacional / Personal',
    };

    const newDt: ProductionDowntimeEvent = {
      id: `dt-ev-${Date.now()}`,
      opId: activeOrder.id,
      opFolio: activeOrder.folio,
      machine: activeTerminal.machineCode,
      operator: activeTerminal.assignedOperator.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: stopMinutes,
      code: stopCode,
      codeDescription: descMap[stopCode],
      category4M: stopCategory4M,
      reason: stopReason,
      comment: 'Reportado desde consola de operador',
    };

    setDowntimeEvents((prev) => [newDt, ...prev]);

    onUpdateOrder(activeOrder.id, {
      status: 'Detenida',
      stopMinutes: (activeOrder.stopMinutes || 0) + stopMinutes,
      traceability: [
        {
          id: `tr-dt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: activeTerminal.assignedOperator.name,
          station: activeTerminal.machineCode,
          event: `Paro Operativo Cód. ${stopCode} (${stopMinutes} min) - 4M: ${stopCategory4M}`,
          notes: `${descMap[stopCode]}: ${stopReason}`,
          badgeTone: 'danger',
        },
        ...(activeOrder.traceability ?? []),
      ],
    });

    setIsTimerRunning(false);
    setIsIncidenceModalOpen(false);
    setToastMessage(`Paro Cód. ${stopCode} (${stopMinutes} min) registrado. Máquina en estado Detenida.`);
  };

  const handleFinishOperation = () => {
    if (!activeOrder) return;
    setIsTimerRunning(false);

    // Si tiene más estaciones en el routing (ej. flexo pasa a inspección, u offset pasa a doblez)
    const routingSteps = activeOrder.routing || [];
    const currentStepIndex = routingSteps.findIndex(
      (s) =>
        s.machine.toLowerCase().includes(activeTerminal.machineCode.toLowerCase()) ||
        s.machine === activeOrder.machine
    );

    const isLastStep =
      activeTerminal.area === 'Acabados' ||
      routingSteps.length === 0 ||
      currentStepIndex === -1 ||
      currentStepIndex >= routingSteps.length - 1;

    if (isLastStep) {
      // Solicitar auditoría final de calidad
      onUpdateOrder(activeOrder.id, {
        status: 'Pendiente de calidad',
        progress: 98,
        traceability: [
          {
            id: `tr-fin-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: activeTerminal.assignedOperator.name,
            station: activeTerminal.machineName,
            event: 'Operación Final de Planta Terminada',
            notes: `Tiraje completado con ${activeOrder.good?.toLocaleString()} piezas buenas. Esperando Auditoría Final de Calidad y Embalaje.`,
            badgeTone: 'primary',
          },
          ...(activeOrder.traceability ?? []),
        ],
      });
      setToastMessage(
        `✓ Operación terminada para ${activeOrder.folio}. Enviada a mesa de Calidad para inspección final de lote.`
      );
    } else {
      // Transferencia al siguiente paso de routing
      const nextStep = routingSteps[currentStepIndex + 1];
      const nextMachine = nextStep ? nextStep.machine : activeOrder.nextJob;

      onUpdateOrder(activeOrder.id, {
        status: 'En preparación',
        machine: nextMachine,
        progress: Math.min(95, (activeOrder.progress || 50) + 25),
        traceability: [
          {
            id: `tr-xfer-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: activeTerminal.assignedOperator.name,
            station: activeTerminal.machineCode,
            event: `Operación finalizada. Transferida a siguiente estación: ${nextMachine}`,
            notes: `${activeOrder.good?.toLocaleString()} unidades entregadas a siguiente etapa del routing. ${
              activeTerminal.area === 'Flexografía'
                ? `Remanente devuelto: ${flexoRemnantMeters} m (${flexoRemnantWeightKg} kg en ${flexoReturnLocation}).`
                : 'Pliegos impresos estibados en tarima con banderilla de identificación.'
            }`,
            badgeTone: 'primary',
          },
          ...(activeOrder.traceability ?? []),
        ],
      });
      setToastMessage(
        `✓ Etapa en ${activeTerminal.machineCode} concluida. ${activeOrder.folio} transferida a ${nextMachine}.`
      );
    }

    setIsFinishModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. HEADER DE TERMINAL OPERATIVA (PISO DE MÁQUINA) */}
      <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Lado izquierdo: Selector de máquina y datos de terminal */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMachineSelectorOpen(!isMachineSelectorOpen)}
                className="flex items-center gap-2.5 rounded-xl border-2 border-theme-primary/40 bg-theme-primary/5 dark:bg-theme-primary/10 px-3.5 py-2.5 hover:border-theme-primary transition-all text-left group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-primary text-white shadow-xs">
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-wider text-theme-primary uppercase">
                      {activeTerminal.machineCode}
                    </span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                      ● {activeTerminal.status}
                    </span>
                  </div>
                  <b className="block text-sm font-black text-theme-main leading-tight group-hover:text-theme-primary transition-colors">
                    {activeTerminal.machineName}
                  </b>
                  <small className="text-[11px] text-theme-muted">
                    Área: {activeTerminal.area} · Toca para cambiar terminal
                  </small>
                </div>
                <ChevronDown className="h-4 w-4 text-theme-muted group-hover:text-theme-primary transition-colors ml-1" />
              </button>

              {/* Menú desplegable para cambiar de terminal */}
              {isMachineSelectorOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-theme-subtle bg-theme-surface p-2 shadow-xl z-30">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-theme-muted border-b border-theme-subtle">
                    Terminales de Piso Disponibles (RTM)
                  </div>
                  <div className="divide-y divide-theme-subtle">
                    {terminals.map((term) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => {
                          setActiveMachineCode(term.machineCode);
                          setIsMachineSelectorOpen(false);
                          setToastMessage(`Cambiado a terminal ${term.machineCode} · ${term.machineName}`);
                        }}
                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors ${
                          term.machineCode === activeMachineCode
                            ? 'bg-theme-primary/10 text-theme-primary font-bold'
                            : 'hover:bg-theme-muted/40 text-theme-main'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black">{term.machineCode}</span>
                            <span className="text-[10px] text-theme-muted">({term.area})</span>
                          </div>
                          <div className="text-xs">{term.machineName}</div>
                          <small className="text-[10px] text-theme-muted">
                            Op: {term.assignedOperator.name} ({term.assignedOperator.shift})
                          </small>
                        </div>
                        {term.machineCode === activeMachineCode && (
                          <Check className="h-4 w-4 text-theme-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Operador asignado */}
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-theme-subtle">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-muted/80 text-theme-main font-black text-sm">
                {activeTerminal.assignedOperator.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <b className="block text-xs font-bold text-theme-main">
                  {activeTerminal.assignedOperator.name}
                </b>
                <span className="block text-[11px] font-mono text-theme-muted">
                  No. Emp: #{activeTerminal.assignedOperator.employeeNumber}
                </span>
                <span className="inline-block rounded-md bg-theme-muted/50 px-1.5 py-0.5 text-[9px] font-bold text-theme-muted">
                  {activeTerminal.assignedOperator.shift}
                </span>
              </div>
            </div>
          </div>

          {/* KPIs del turno del operador */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 px-3 py-2 text-center min-w-20">
              <small className="block text-[10px] text-theme-muted uppercase font-bold">Tiempo Prod.</small>
              <b className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                {activeTerminal.todayMetrics.productiveTime} hrs
              </b>
            </div>

            <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 px-3 py-2 text-center min-w-20">
              <small className="block text-[10px] text-theme-muted uppercase font-bold">Tiempo Muerto</small>
              <b className="font-mono text-xs text-amber-600 dark:text-amber-400">
                {activeTerminal.todayMetrics.lostTime} hrs
              </b>
            </div>

            <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 px-3 py-2 text-center min-w-24">
              <small className="block text-[10px] text-theme-muted uppercase font-bold">Buenas Hoy</small>
              <b className="font-mono text-sm text-theme-main font-black">
                {formatNumber(activeTerminal.todayMetrics.goodUnits)}
              </b>
            </div>

            <div className="rounded-xl border border-theme-subtle bg-theme-muted/20 px-3 py-2 text-center min-w-20">
              <small className="block text-[10px] text-theme-muted uppercase font-bold">Scrap Turno</small>
              <b
                className={`font-mono text-xs font-bold ${
                  activeTerminal.todayMetrics.scrapPercent > 5.0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {activeTerminal.todayMetrics.scrapPercent}%
              </b>
            </div>

            {onNavigateToProduccion && (
              <button
                type="button"
                onClick={onNavigateToProduccion}
                className="hidden xl:flex items-center gap-1 rounded-xl border border-theme-subtle px-3 py-2 text-xs font-bold text-theme-muted hover:text-theme-main hover:bg-theme-muted/40 transition-colors"
                title="Ir a vista de supervisor"
              >
                Vista Supervisor <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notificación Toast rápida */}
        {toastMessage && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/40 bg-emerald-50/80 dark:bg-emerald-950/40 px-3.5 py-2 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="font-bold hover:underline shrink-0"
            >
              Entendido
            </button>
          </div>
        )}
      </div>

      {/* 2. SUGERENCIAS INTELIGENTES MORADAS ERP (PATRÓN SPARKLES) */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.slice(0, 1).map((sug) => (
            <div
              key={sug.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/80 dark:bg-purple-950/30 p-3.5 text-xs text-purple-900 dark:text-purple-200 shadow-2xs animate-in fade-in"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <b className="font-bold text-purple-950 dark:text-purple-100">{sug.title}</b>
                    {sug.estimatedSavingMinutes && (
                      <span className="rounded-md bg-purple-200 dark:bg-purple-900 px-1.5 py-0.5 text-[10px] font-black text-purple-800 dark:text-purple-300">
                        Ahorro est: ~{sug.estimatedSavingMinutes} min
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                    {sug.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage(`✓ Acción aplicada: ${sug.actionLabel}`);
                    setDismissedSuggestions((prev) => [...prev, sug.id]);
                  }}
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  {sug.actionLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedSuggestions((prev) => [...prev, sug.id])}
                  className="text-purple-500 hover:text-purple-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. PESTAÑAS DE LA TERMINAL DE OPERADOR */}
      <div className="flex gap-2 overflow-x-auto border-b border-theme-subtle pb-1">
        {[
          { key: 'trabajo', label: 'Mi Trabajo en Máquina', icon: Gauge, badge: activeOrder ? activeOrder.folio : undefined },
          { key: 'cola', label: 'Mi Cola de Órdenes', icon: Layers, count: machineOrders.length },
          { key: 'historial', label: 'Historial del Turno', icon: History, count: dailyReports.length },
          { key: 'desempeno', label: 'Mi Desempeño', icon: Award },
        ].map((tabItem) => {
          const Icon = tabItem.icon;
          const isActive = activeTab === tabItem.key;
          return (
            <button
              key={tabItem.key}
              type="button"
              onClick={() => setActiveTab(tabItem.key as OperatorTab)}
              className={`flex items-center gap-2 shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/40 border border-theme-subtle'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tabItem.label}</span>
              {tabItem.badge && (
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-theme-primary/10 text-theme-primary'
                  }`}
                >
                  {tabItem.badge}
                </span>
              )}
              {tabItem.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-theme-muted/60 text-theme-muted'
                  }`}
                >
                  {tabItem.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================================= */}
      {/* PESTAÑA 1: MI TRABAJO (ESTACIÓN DE TRABAJO ACTIVA)                       */}
      {/* ======================================================================= */}
      {activeTab === 'trabajo' && (
        <div className="space-y-4">
          {activeOrder ? (
            <>
              {/* Tarjeta de Trabajo Activo */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-xs space-y-5">
                {/* Header de la orden */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-theme-subtle">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-theme-primary/10 px-2.5 py-1 text-xs font-black font-mono tracking-wider text-theme-primary">
                        {activeOrder.folio}
                      </span>
                      <span className="rounded-md bg-theme-muted/50 px-2 py-0.5 text-[11px] font-mono text-theme-muted">
                        Rev. {activeOrder.revision}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          activeOrder.status === 'En proceso'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : activeOrder.status === 'Detenida'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {activeOrder.status}
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-lg font-black text-theme-main">
                      {activeOrder.cliente} · <span className="font-normal text-theme-muted">Pedido {activeOrder.pedido} ({activeOrder.area})</span>
                    </h2>
                    <p className="text-xs text-theme-muted">
                      No. Parte: <b className="font-mono text-theme-main">{activeOrder.partNumber}</b> · Proceso:{' '}
                      <b>{activeOrder.area}</b> · Entrega programada: <b>{activeOrder.due}</b>
                    </p>
                  </div>

                  {/* Cronómetros en vivo */}
                  <div className="flex items-center gap-3">
                    {isTimerRunning && (
                      <div className="rounded-xl border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-right">
                        <small className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                          Tiraje Activo
                        </small>
                        <div className="flex items-center gap-1.5 font-mono text-xl font-black text-emerald-700 dark:text-emerald-200">
                          <Clock className="h-5 w-5 animate-spin-slow" />
                          {formatTimer(elapsedSeconds)}
                        </div>
                      </div>
                    )}

                    {isSetupActive && (
                      <div className="rounded-xl border border-amber-500/50 bg-amber-50 dark:bg-amber-950/40 p-3 text-right">
                        <small className="block text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                          Setup en Curso (Est. {activeOrder.setupMinutes || 45}m)
                        </small>
                        <div className="flex items-center gap-1.5 font-mono text-xl font-black text-amber-700 dark:text-amber-200">
                          <Wrench className="h-5 w-5 animate-pulse" />
                          {formatTimer(setupSeconds)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 1.1 RECIPE CARD CONTEXTUAL (OFFSET VS FLEXO) */}
                <div className="rounded-xl border border-theme-subtle bg-theme-muted/15 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-theme-primary flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Ficha de Fabricación / Receta ({activeOrder.area})
                    </span>
                    <span className="text-[10px] font-mono text-theme-muted">
                      Paso actual en routing: <b>{activeOrder.machine}</b>
                    </span>
                  </div>

                  {activeOrder.area === 'Flexografía' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Sustrato / Bobina</small>
                        <b className="font-mono text-theme-main text-[11px]">Semigloss 2.4 mil</b>
                        <span className="block text-[10px] text-emerald-600 font-bold">Bobina BOB-7410 asignada</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Tintas / Colores</small>
                        <b className="text-theme-main text-[11px]">Pantone 485C + Black + UV</b>
                        <span className="block text-[10px] text-theme-muted">Viscosidad Zahn #2: 24 seg</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Herramental / Suaje</small>
                        <b className="font-mono text-theme-main text-[11px]">{activeOrder.tooling}</b>
                        <span className="block text-[10px] text-theme-muted">Cilindro magnético 84T</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Estaciones en Línea</small>
                        <b className="text-theme-main text-[11px]">T1 → T2 → Barniz → Suajado</b>
                        <span className="block text-[10px] text-theme-muted">Core 3" · 1,000 etiq/rollo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Papel / Formato</small>
                        <b className="font-mono text-theme-main text-[11px]">Couché brillante 150g</b>
                        <span className="block text-[10px] text-theme-muted">Pliegos 70x95 cm</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Tintas</small>
                        <b className="text-theme-main text-[11px]">CMYK 4 tintas offset</b>
                        <span className="block text-[10px] text-emerald-600 font-bold">4 placas CTP confirmadas</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Paginación / Pliegos</small>
                        <b className="font-mono text-theme-main text-[11px]">24 págs (16 + 8)</b>
                        <span className="block text-[10px] text-theme-muted">Entrada Heidelberg SM 74</span>
                      </div>
                      <div className="rounded-lg bg-theme-surface p-2.5 border border-theme-subtle">
                        <small className="text-theme-muted block">Acabado Posterior</small>
                        <b className="text-theme-main text-[11px]">Doblado + Grapado lomo</b>
                        <span className="block text-[10px] text-theme-muted">Ruta: Offset → Stahlfolder</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1.2 CHECKLIST DE ARRANQUE (FM-PR-003) */}
                <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-theme-main flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-theme-primary" />
                      Checklist de Arranque y Condiciones de Máquina (FM-PR-003)
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isChecklistComplete
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {isChecklistComplete ? '✓ Checklist Completo' : 'Pendiente de Validar'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-theme-subtle bg-theme-muted/10 cursor-pointer hover:bg-theme-muted/20">
                      <input
                        type="checkbox"
                        checked={checklist.materialsReady}
                        onChange={(e) => setChecklist({ ...checklist, materialsReady: e.target.checked })}
                        className="rounded text-theme-primary focus:ring-theme-primary"
                      />
                      <span>Insumos a pie de máquina</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-theme-subtle bg-theme-muted/10 cursor-pointer hover:bg-theme-muted/20">
                      <input
                        type="checkbox"
                        checked={checklist.toolingMounted}
                        onChange={(e) => setChecklist({ ...checklist, toolingMounted: e.target.checked })}
                        className="rounded text-theme-primary focus:ring-theme-primary"
                      />
                      <span>Herramental/suaje montado</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-theme-subtle bg-theme-muted/10 cursor-pointer hover:bg-theme-muted/20">
                      <input
                        type="checkbox"
                        checked={checklist.environmentChecked}
                        onChange={(e) => setChecklist({ ...checklist, environmentChecked: e.target.checked })}
                        className="rounded text-theme-primary focus:ring-theme-primary"
                      />
                      <span className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-rose-500" /> 21.5°C ·{' '}
                        <Droplets className="h-3 w-3 text-blue-500" /> 52% HR
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-theme-subtle bg-theme-muted/10 cursor-pointer hover:bg-theme-muted/20">
                      <input
                        type="checkbox"
                        checked={checklist.cleaningDone}
                        onChange={(e) => setChecklist({ ...checklist, cleaningDone: e.target.checked })}
                        className="rounded text-theme-primary focus:ring-theme-primary"
                      />
                      <span>Limpieza rodillos y tintero</span>
                    </label>
                  </div>
                </div>

                {/* 1.3 QUALITY GATE: SOLICITUD Y DICTAMEN DE PRIMERA PIEZA (CALIDAD) */}
                <div className="rounded-xl border border-theme-subtle bg-theme-surface p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          activeOrder.qualityGates?.firstPieceReleased
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : activeOrder.qualityGates?.firstPieceRequested
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 animate-pulse'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-theme-main flex items-center gap-1.5">
                          Quality Gate: Liberación de Primera Pieza (FM-CAL-004)
                        </div>
                        <p className="text-[11px] text-theme-muted">
                          {activeOrder.qualityGates?.firstPieceReleased ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ Primera pieza Aprobada y Liberada por{' '}
                              {activeOrder.qualityGates.firstPieceApprover || 'Alicia Ramírez (Calidad)'}.
                            </span>
                          ) : activeOrder.qualityGates?.firstPieceRequested ? (
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                              ⏳ Muestra enviada a mesa de Calidad. Esperando dictamen técnico de Alicia Ramírez...
                            </span>
                          ) : (
                            <span>
                              Termina el alistamiento y envía la primera muestra a Calidad antes de iniciar tiraje.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción del gate */}
                    <div className="flex items-center gap-2">
                      {!activeOrder.qualityGates?.firstPieceReleased && !activeOrder.qualityGates?.firstPieceRequested && (
                        <button
                          type="button"
                          onClick={handleRequestFirstPiece}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                        >
                          <SendHorizontal className="h-4 w-4" /> Solicitar Auditoría QA (1ra Pieza)
                        </button>
                      )}

                      {!activeOrder.qualityGates?.firstPieceReleased && activeOrder.qualityGates?.firstPieceRequested && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                            <Clock className="h-3.5 w-3.5 animate-spin" /> En revisión por Alicia Ramírez
                          </span>
                          {/* Botón rápido de demo para simular aprobación de Calidad */}
                          <button
                            type="button"
                            onClick={handleSimulateCalidadApproval}
                            className="rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                            title="Simular dictamen conforme de Calidad"
                          >
                            [Demo: Aprobar QA]
                          </button>
                        </div>
                      )}

                      {activeOrder.qualityGates?.firstPieceReleased && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" /> Autorizado para Tiraje
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1.4 CONTADORES TÁCTILES Y PROGRESO DE PRODUCCIÓN */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Objetivo */}
                    <div className="rounded-xl border border-theme-subtle bg-theme-muted/10 p-3.5">
                      <span className="text-[10px] font-bold uppercase text-theme-muted block">Objetivo OP</span>
                      <b className="font-mono text-2xl font-black text-theme-main">
                        {formatNumber(activeOrder.quantity)}
                      </b>
                      <small className="text-[10px] text-theme-muted block">piezas programadas</small>
                    </div>

                    {/* Buenas Producidas */}
                    <div className="rounded-xl border border-theme-subtle bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">
                        Buenas Producidas
                      </span>
                      <b className="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-200">
                        {formatNumber(activeOrder.good || 0)}
                      </b>
                      <small className="text-[10px] text-emerald-600 block">
                        {Math.round(((activeOrder.good || 0) / (activeOrder.quantity || 1)) * 100)}% del objetivo
                      </small>
                    </div>

                    {/* Scrap Acumulado */}
                    <div
                      className={`rounded-xl border p-3.5 ${
                        isScrapExceeded
                          ? 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                          : 'border-theme-subtle bg-theme-muted/10'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase block ${
                          isScrapExceeded ? 'text-rose-700 dark:text-rose-300' : 'text-theme-muted'
                        }`}
                      >
                        Scrap Acumulado
                      </span>
                      <b
                        className={`font-mono text-2xl font-black ${
                          isScrapExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-theme-main'
                        }`}
                      >
                        {formatNumber(activeOrder.scrap || 0)}
                      </b>
                      <small
                        className={`text-[10px] font-bold block ${
                          isScrapExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-theme-muted'
                        }`}
                      >
                        {currentScrapPercent}% ({isScrapExceeded ? '⚠️ Supera 5.0%' : 'Meta <= 5.0%'})
                      </small>
                    </div>

                    {/* Velocidad / Tiempo */}
                    <div className="rounded-xl border border-theme-subtle bg-theme-muted/10 p-3.5">
                      <span className="text-[10px] font-bold uppercase text-theme-muted block">Velocidad / OEE</span>
                      <b className="font-mono text-2xl font-black text-theme-main">
                        {activeOrder.area === 'Flexografía' ? '125 m/m' : '8,400 p/h'}
                      </b>
                      <small className="text-[10px] text-theme-muted block">
                        Estándar: {activeOrder.area === 'Flexografía' ? '130 m/min' : '9,000 p/h'}
                      </small>
                    </div>
                  </div>

                  {/* Barra de progreso de producción */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-theme-muted">Avance del Tiraje</span>
                      <span className="font-bold text-theme-main">
                        {activeOrder.good?.toLocaleString()} / {activeOrder.quantity?.toLocaleString()} ejs (
                        {Math.round(((activeOrder.good || 0) / (activeOrder.quantity || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                      <div
                        className="h-full bg-theme-primary transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((activeOrder.good || 0) / (activeOrder.quantity || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Barra de Control de Scrap (Límite 5.0%) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isScrapExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-theme-muted'
                        }`}
                      >
                        {isScrapExceeded && <AlertTriangle className="h-3.5 w-3.5" />}
                        Control de Merma Acumulada: {currentScrapPercent}% (Umbral máximo: 5.0%)
                      </span>
                      <span className={isScrapExceeded ? 'text-rose-600 font-bold' : 'text-theme-muted'}>
                        {activeOrder.scrap} ejs merma
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          currentScrapPercent > 5.0
                            ? 'bg-rose-600'
                            : currentScrapPercent > 3.5
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (currentScrapPercent / 5.0) * 80)}%` }}
                      />
                      {/* Marca del límite del 5% */}
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-rose-500 z-10" />
                    </div>

                    {/* Alerta roja llamativa si se rebasó el 5% */}
                    {isScrapExceeded && (
                      <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-200 animate-in fade-in">
                        <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <b className="font-bold">¡ALERTA DE DESPERDICIO! El scrap ha superado el 5.0%</b>
                          <p className="text-[11px] mt-0.5">
                            La merma actual es de <b>{currentScrapPercent}%</b> ({activeOrder.scrap} unidades). Se ha
                            enviado notificación a la mesa de Alicia Ramírez (Calidad) y a Planeación. Se sugiere
                            verificar tensión de sustrato y alineación de troquel.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 1.5 BOTONERA TÁCTIL DE PISO (ACCIONES OPERATIVAS) */}
                <div className="pt-3 border-t border-theme-subtle flex flex-wrap gap-2.5">
                  {/* Iniciar / Pausar tiraje */}
                  {activeOrder.status === 'En proceso' ? (
                    <button
                      type="button"
                      onClick={handlePauseProduction}
                      className="flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 px-4 py-2.5 text-xs font-bold text-amber-800 dark:text-amber-200 transition-colors"
                    >
                      <Pause className="h-4 w-4" /> Pausar Máquina
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!activeOrder.qualityGates?.firstPieceReleased}
                      onClick={handleStartProduction}
                      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
                        activeOrder.qualityGates?.firstPieceReleased
                          ? 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02]'
                          : 'bg-zinc-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Play className="h-4 w-4" /> Iniciar Tiraje en Vivo
                    </button>
                  )}

                  {/* + Producción Rápida */}
                  <button
                    type="button"
                    onClick={() => setIsQuickUnitsModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-3.5 py-2.5 text-xs font-bold text-white hover:bg-theme-primary/90 transition-colors shadow-2xs"
                  >
                    <Plus className="h-4 w-4" /> Registrar Buenas (+ ejs)
                  </button>

                  {/* Reportar Scrap / Merma (P0 CRÍTICO) */}
                  <button
                    type="button"
                    onClick={() => setIsScrapModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border-2 border-rose-500/50 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> Reportar Scrap / Merma
                  </button>

                  {/* Paro 4M / Incidencia */}
                  <button
                    type="button"
                    onClick={() => setIsIncidenceModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface hover:bg-theme-muted/30 px-3.5 py-2.5 text-xs font-bold text-theme-main transition-colors"
                  >
                    <AlertOctagon className="h-4 w-4 text-amber-500" /> Reportar Paro 4M
                  </button>

                  {/* Solicitar Material Extra */}
                  <button
                    type="button"
                    onClick={() => setIsMaterialExtraModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-400/80 bg-amber-50/40 dark:bg-amber-950/20 px-3.5 py-2.5 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-amber-600" /> Material Extra
                  </button>

                  {/* Terminar Operación / Transferir */}
                  <button
                    type="button"
                    onClick={() => setIsFinishModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-800 dark:bg-zinc-700 hover:bg-black px-4 py-2.5 text-xs font-bold text-white transition-colors ml-auto shadow-xs"
                  >
                    <Check className="h-4 w-4 text-emerald-400" /> Terminar Etapa / Transferir
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-theme-subtle p-12 text-center text-theme-muted bg-theme-surface">
              <Monitor className="h-10 w-10 mx-auto mb-2 text-theme-muted" />
              <b className="block text-theme-main">No hay ninguna orden cargada en esta máquina</b>
              <p className="text-xs">
                Selecciona una orden de la pestaña "Mi Cola de Órdenes" para iniciar el alistamiento en{' '}
                {activeTerminal.machineName}.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* PESTAÑA 2: MI COLA DE TRABAJO (ÓRDENES ASIGNADAS A LA MÁQUINA)          */}
      {/* ======================================================================= */}
      {activeTab === 'cola' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                Cola de Producción Asignada a {activeTerminal.machineName} ({activeTerminal.machineCode})
              </h3>
              <p className="text-xs text-theme-muted">
                Secuencia programada por Planeación con validación de materiales y herramental.
              </p>
            </div>
            <span className="rounded-full bg-theme-primary/10 px-3 py-1 font-mono text-xs font-bold text-theme-primary">
              {machineOrders.length} OPs programadas
            </span>
          </div>

          <div className="grid gap-3">
            {machineOrders.map((order, idx) => {
              const isSelected = activeOrder?.id === order.id;
              const hasMaterialAlert = order.materialAlert;
              const hasToolingAlert = order.toolingAlert;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-4.5 transition-all bg-theme-surface ${
                    isSelected
                      ? 'border-theme-primary ring-2 ring-theme-primary/20 shadow-sm'
                      : 'border-theme-subtle hover:border-theme-muted'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-theme-primary">#{idx + 1}</span>
                        <span className="font-mono text-xs font-bold text-theme-main bg-theme-muted/40 px-2 py-0.5 rounded-md">
                          {order.folio}
                        </span>
                        <span className="text-xs font-bold text-theme-main">{order.cliente}</span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            order.priority === 'Alta'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-theme-muted/40 text-theme-muted'
                          }`}
                        >
                          {order.priority}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-theme-muted">
                        <b>Pedido {order.pedido} ({order.area})</b> (Parte: <span className="font-mono">{order.partNumber}</span>) ·{' '}
                        Cantidad: <b className="font-mono text-theme-main">{order.quantity.toLocaleString()} ejs</b>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                        {/* Gate de Material */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold ${
                            hasMaterialAlert
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {hasMaterialAlert ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Material: {hasMaterialAlert ? 'Faltante / Pendiente' : 'Surtido a pie de máquina'}
                        </span>

                        {/* Gate de Herramental */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold ${
                            hasToolingAlert
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          <Wrench className="h-3 w-3" />
                          Herramental: {hasToolingAlert ? 'En preparación taller' : 'Disponible en máquina'}
                        </span>

                        <span className="text-theme-muted">Setup est: {order.setupMinutes}m</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="rounded-xl bg-theme-primary/10 px-3 py-2 text-xs font-bold text-theme-primary">
                          ● Cargada en Terminal
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setActiveTab('trabajo');
                            setToastMessage(`✓ Orden ${order.folio} cargada en la terminal de ${activeTerminal.machineCode}`);
                          }}
                          className="rounded-xl bg-theme-primary hover:bg-theme-primary/90 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                        >
                          Cargar en Máquina
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PESTAÑA 3: HISTORIAL DEL TURNO (REPORTE DIARIO DE OPERADOR RTM)         */}
      {/* ======================================================================= */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div>
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                Digitalización del Reporte Diario de Operador (FM-PR-012)
              </h3>
              <p className="text-xs text-theme-muted">
                Registro horario de horas productivas, tiempos muertos y códigos oficiales RTM 100/200/300/400.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDailyReportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
            >
              <Plus className="h-4 w-4" /> Capturar Turno / Bloque Horario
            </button>
          </div>

          {/* Timeline de eventos del turno actual */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
              <History className="h-4 w-4 text-theme-primary" />
              Línea de Tiempo del Turno ({activeTerminal.assignedOperator.shift})
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-theme-subtle">
              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                <div>
                  <span className="font-mono text-xs font-bold text-theme-muted">07:00</span>
                  <p className="text-xs font-bold text-theme-main">Inicio de Turno y Entrega de Máquina</p>
                  <small className="text-[11px] text-theme-muted">
                    {activeTerminal.assignedOperator.name} tomó el relevo en {activeTerminal.machineName}.
                  </small>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-950" />
                <div>
                  <span className="font-mono text-xs font-bold text-theme-muted">07:30</span>
                  <p className="text-xs font-bold text-theme-main">Alistamiento y Montaje de Suaje OP-95321</p>
                  <small className="text-[11px] text-theme-muted">
                    Cilindro magnético 84T y ajuste de tintas Pantone 485C.
                  </small>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950" />
                <div>
                  <span className="font-mono text-xs font-bold text-theme-muted">08:15</span>
                  <p className="text-xs font-bold text-theme-main">Muestra de 1ra Pieza enviada a Calidad</p>
                  <small className="text-[11px] text-theme-muted">
                    Inspección por Alicia Ramírez (Mesa de Calidad). Dictamen Conforme.
                  </small>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                <div>
                  <span className="font-mono text-xs font-bold text-theme-muted">08:45</span>
                  <p className="text-xs font-bold text-theme-main">Arranque de Tiraje a 125 m/min</p>
                  <small className="text-[11px] text-theme-muted">
                    Corrida estable sin variaciones de registro.
                  </small>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950" />
                <div>
                  <span className="font-mono text-xs font-bold text-theme-muted">10:20</span>
                  <p className="text-xs font-bold text-theme-main">
                    Paro 15 min (Cód. 200) y reporte de scrap (350 ejs)
                  </p>
                  <small className="text-[11px] text-theme-muted">
                    Ajuste de tensión por cambio de empalme en bobina de Semigloss.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de reportes diarios registrados */}
          <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-theme-main">
              Reportes Diarios de Producción Guardados
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-theme-muted/40 text-[10px] uppercase text-theme-muted">
                  <tr>
                    <th className="p-2.5 text-left">Horario</th>
                    <th className="p-2.5 text-left">Máquina</th>
                    <th className="p-2.5 text-left">Código RTM</th>
                    <th className="p-2.5 text-left">OP / Cliente</th>
                    <th className="p-2.5 text-right">Cant. Producida</th>
                    <th className="p-2.5 text-left">Notas Técnicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {dailyReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-theme-muted/20">
                      <td className="p-2.5 font-mono text-[11px]">
                        {rep.startTime} - {rep.endTime}
                      </td>
                      <td className="p-2.5 font-bold">{rep.areaMachine}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            rep.code === '100'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rep.code === '200'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rep.code}
                        </span>{' '}
                        <span className="text-[10px] text-theme-muted">{rep.codeDescription}</span>
                      </td>
                      <td className="p-2.5">
                        <b className="font-mono text-theme-primary">{rep.opFolio}</b>
                        <small className="block text-theme-muted truncate max-w-28">{rep.client}</small>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        {rep.producedQuantity.toLocaleString()} ejs
                      </td>
                      <td className="p-2.5 text-theme-muted truncate max-w-xs">{rep.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PESTAÑA 4: MI DESEMPEÑO (OEE, SETUP REAL VS META, SCRAP PERSONAL)       */}
      {/* ======================================================================= */}
      {activeTab === 'desempeno' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* OEE Global */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-center">
              <span className="text-[10px] font-bold uppercase text-theme-muted block">OEE Personal / Máquina</span>
              <b className="font-mono text-3xl font-black text-theme-primary block mt-1">84.6%</b>
              <span className="inline-block mt-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                ● Clase Mundial (Meta &gt;= 80%)
              </span>
            </div>

            {/* Disponibilidad */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-center">
              <span className="text-[10px] font-bold uppercase text-theme-muted block">Disponibilidad</span>
              <b className="font-mono text-2xl font-black text-theme-main block mt-1">92.4%</b>
              <small className="text-[10px] text-theme-muted">Tiempo productivo vs tiempo disponible</small>
            </div>

            {/* Rendimiento / Velocidad */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-center">
              <span className="text-[10px] font-bold uppercase text-theme-muted block">Rendimiento</span>
              <b className="font-mono text-2xl font-black text-theme-main block mt-1">94.1%</b>
              <small className="text-[10px] text-theme-muted">Velocidad real vs estándar de ficha</small>
            </div>

            {/* Calidad */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-center">
              <span className="text-[10px] font-bold uppercase text-theme-muted block">Índice de Calidad</span>
              <b className="font-mono text-2xl font-black text-emerald-600 block mt-1">97.3%</b>
              <small className="text-[10px] text-theme-muted">Piezas buenas vs scrap acumulado</small>
            </div>
          </div>

          {/* Comparativas de Puesta a Punto y Desperdicio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Setup real vs estándar */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
                <Wrench className="h-4 w-4 text-theme-primary" />
                Eficiencia en Tiempos de Setup (Puesta a Punto)
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-theme-muted">Tiempo Estándar de Receta</span>
                  <b className="font-mono text-theme-main">45 min</b>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-theme-muted">Tu Promedio en Mark Andy Scout</span>
                  <b className="font-mono text-emerald-600 font-bold">42 min (-3 min de ahorro)</b>
                </div>
                <div className="h-2.5 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '93%' }} />
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Estás completando los cambios de herramental y entintado 7% más rápido que el estándar de planta.
                </p>
              </div>
            </div>

            {/* Histórico de Scrap del Operador */}
            <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                Control de Scrap Personal del Operador
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-theme-muted">Tu promedio de merma mensual</span>
                  <b className="font-mono text-emerald-600 font-bold">2.4%</b>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-theme-muted">Meta límite de planta RTM</span>
                  <b className="font-mono text-theme-main">&lt;= 3.0%</b>
                </div>
                <div className="h-2.5 w-full rounded-full bg-theme-muted/40 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  Excelente control en arranques de bobina. Tu merma está 0.6 puntos porcentuales debajo de la meta.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: REGISTRAR PRODUCCIÓN RÁPIDA (+ PIEZAS BUENAS)                  */}
      {/* ======================================================================= */}
      {isQuickUnitsModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <Plus className="h-4 w-4 text-theme-primary" /> Registrar Buenas (+ Unidades)
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickUnitsModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-theme-muted block">OP en curso:</span>
                <b className="text-theme-main font-mono text-sm">{activeOrder.folio}</b> · {activeOrder.cliente}
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">
                  Cantidad de piezas buenas producidas:
                </label>
                <input
                  type="number"
                  value={quickGoodQty}
                  onChange={(e) => setQuickGoodQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-muted/20 px-3.5 py-2.5 font-mono text-lg font-bold text-theme-main focus:ring-2 focus:ring-theme-primary"
                />
              </div>

              {/* Botones rápidos de incremento */}
              <div className="flex gap-2">
                {[1000, 2500, 5000, 10000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setQuickGoodQty(inc)}
                    className="flex-1 rounded-lg border border-theme-subtle bg-theme-muted/30 py-1.5 font-mono text-xs font-bold hover:bg-theme-muted text-theme-main"
                  >
                    +{inc.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setIsQuickUnitsModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddQuickGood}
                className="rounded-xl bg-theme-primary hover:bg-theme-primary/90 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Confirmar Suma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: REPORTAR SCRAP / MERMA CON CATEGORIZACIÓN 4M (P0 CRÍTICO)      */}
      {/* ======================================================================= */}
      {isScrapModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-rose-600 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Reportar Scrap / Merma de Producción
              </h3>
              <button
                type="button"
                onClick={() => setIsScrapModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-theme-muted/20 border border-theme-subtle flex justify-between">
                <div>
                  <span className="text-theme-muted text-[10px] block">Orden / Cliente</span>
                  <b className="font-mono text-theme-main">{activeOrder.folio}</b> · {activeOrder.cliente}
                </div>
                <div className="text-right">
                  <span className="text-theme-muted text-[10px] block">Merma Actual</span>
                  <b className="font-mono text-theme-main">{activeOrder.scrap} ejs ({currentScrapPercent}%)</b>
                </div>
              </div>

              {/* Cantidad de Scrap */}
              <div>
                <label className="text-theme-muted block font-bold mb-1">
                  Cantidad desperdiciada (unidades/etiquetas):
                </label>
                <input
                  type="number"
                  value={scrapQty}
                  onChange={(e) => setScrapQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-rose-300 bg-rose-50/20 dark:bg-rose-950/20 px-3.5 py-2 font-mono text-base font-bold text-theme-main focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Categoría 4M */}
              <div>
                <label className="text-theme-muted block font-bold mb-1">
                  Causa Raíz Ishikawa (Categoría 4M):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Máquina', 'Material', 'Mano de obra', 'Método'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setScrapCategory4M(cat)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                        scrapCategory4M === cat
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 shadow-2xs'
                          : 'border-theme-subtle bg-theme-surface text-theme-muted hover:bg-theme-muted/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Merma */}
              <div>
                <label className="text-theme-muted block font-bold mb-1">Tipo de Evento:</label>
                <select
                  value={scrapType}
                  onChange={(e) => setScrapType(e.target.value as any)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs font-bold text-theme-main"
                >
                  <option value="Ajuste de registro">Ajuste de registro (descalce)</option>
                  <option value="Merma de arranque">Merma de arranque (pruebas de color)</option>
                  <option value="Merma de proceso">Merma de proceso en tiraje</option>
                  <option value="Variación de tono">Variación de tono / viscosidad de tinta</option>
                  <option value="Materia prima defectuosa">Materia prima defectuosa (burbuja/ondulación)</option>
                  <option value="Falla mecánica">Falla mecánica / desajuste de racleta</option>
                </select>
              </div>

              {/* Motivo específico */}
              <div>
                <label className="text-theme-muted block font-bold mb-1">Razón Técnica Detallada:</label>
                <input
                  type="text"
                  value={scrapReason}
                  onChange={(e) => setScrapReason(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
                />
              </div>

              {/* Comentarios del operador */}
              <div>
                <label className="text-theme-muted block font-bold mb-1">Acción Correctiva en Máquina:</label>
                <textarea
                  value={scrapComment}
                  onChange={(e) => setScrapComment(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setIsScrapModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveScrapEvent}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Registrar Scrap 4M
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: REPORTAR PARO 4M (CÓDIGOS 100, 200, 300, 400)                  */}
      {/* ======================================================================= */}
      {isIncidenceModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-amber-600 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="h-4 w-4" /> Reportar Paro Operativo (Códigos RTM)
              </h3>
              <button
                type="button"
                onClick={() => setIsIncidenceModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-theme-muted block font-bold mb-1">Código RTM Oficial:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: '100', label: '100 - Falla Máquina' },
                    { code: '200', label: '200 - Ajuste Proceso' },
                    { code: '300', label: '300 - Materia Prima' },
                    { code: '400', label: '400 - Operador/Personal' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setStopCode(item.code as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        stopCode === item.code
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold'
                          : 'border-theme-subtle bg-theme-surface text-theme-muted hover:bg-theme-muted/30'
                      }`}
                    >
                      <b className="block text-xs font-mono">{item.code}</b>
                      <span className="text-[10px] block truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Duración estimada del paro (min):</label>
                <input
                  type="number"
                  value={stopMinutes}
                  onChange={(e) => setStopMinutes(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 font-mono text-sm font-bold text-theme-main"
                />
              </div>

              <div>
                <label className="text-theme-muted block font-bold mb-1">Motivo / Causa:</label>
                <input
                  type="text"
                  value={stopReason}
                  onChange={(e) => setStopReason(e.target.value)}
                  className="w-full rounded-xl border border-theme-subtle bg-theme-surface px-3 py-2 text-xs text-theme-main"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setIsIncidenceModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDowntime}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Registrar Paro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: TERMINAR OPERACIÓN / TRANSFERENCIA Y REMANENTE                  */}
      {/* ======================================================================= */}
      {isFinishModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-theme-subtle bg-theme-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-theme-subtle">
              <h3 className="text-sm font-black text-theme-main uppercase tracking-wider flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Finalizar Etapa en {activeTerminal.machineName}
              </h3>
              <button
                type="button"
                onClick={() => setIsFinishModalOpen(false)}
                className="text-theme-muted hover:text-theme-main"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-theme-muted/20 border border-theme-subtle">
                <span className="text-theme-muted text-[10px] block">Resumen del Tiraje</span>
                <div className="flex justify-between mt-1">
                  <span>
                    Buenas: <b className="font-mono text-emerald-600">{activeOrder.good?.toLocaleString()} ejs</b>
                  </span>
                  <span>
                    Scrap: <b className="font-mono text-rose-600">{activeOrder.scrap} ejs ({currentScrapPercent}%)</b>
                  </span>
                </div>
              </div>

              {/* Si es Flexografía: captura de remanente de bobina (P0 CRÍTICO) */}
              {activeTerminal.area === 'Flexografía' && (
                <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
                  <b className="text-purple-950 dark:text-purple-200 text-xs block font-bold flex items-center gap-1.5">
                    <Disc className="h-4 w-4 text-purple-600" /> Control de Remanente de Bobina (Flexo)
                  </b>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300">
                    Registra el sobrante del rollo matriz para reingreso a Almacén de Materia Prima y costeo real:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-purple-900 dark:text-purple-200 block">
                        Metros Lineales Sobrantes:
                      </label>
                      <input
                        type="number"
                        value={flexoRemnantMeters}
                        onChange={(e) => setFlexoRemnantMeters(parseInt(e.target.value, 10) || 0)}
                        className="w-full rounded-lg border border-purple-300 bg-theme-surface px-2.5 py-1.5 font-mono text-xs font-bold text-theme-main"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-purple-900 dark:text-purple-200 block">
                        Peso Restante (kg):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={flexoRemnantWeightKg}
                        onChange={(e) => setFlexoRemnantWeightKg(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-purple-300 bg-theme-surface px-2.5 py-1.5 font-mono text-xs font-bold text-theme-main"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-900 dark:text-purple-200 block">
                      Ubicación de Devolución / Staging:
                    </label>
                    <input
                      type="text"
                      value={flexoReturnLocation}
                      onChange={(e) => setFlexoReturnLocation(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 bg-theme-surface px-2.5 py-1.5 text-xs text-theme-main"
                    />
                  </div>
                </div>
              )}

              {/* Transferencia de Routing */}
              <div className="p-3 rounded-xl border border-theme-subtle bg-theme-surface">
                <span className="text-[10px] font-bold text-theme-muted uppercase block">
                  Destino siguiente en Routing de Fabricación:
                </span>
                <b className="text-sm text-theme-primary block mt-0.5 font-mono">
                  {activeOrder.nextJob || 'Mesa de Inspección / Empaque Final'}
                </b>
                <p className="text-[11px] text-theme-muted mt-0.5">
                  Las unidades producidas quedarán disponibles inmediatamente en la cola de la siguiente máquina.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-theme-subtle">
              <button
                type="button"
                onClick={() => setIsFinishModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinishOperation}
                className="rounded-xl bg-theme-primary hover:bg-theme-primary/90 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Confirmar Cierre y Transferencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 5: SOLICITAR MATERIAL EXTRA (REUTILIZACIÓN V5)                    */}
      {/* ======================================================================= */}
      {isMaterialExtraModalOpen && activeOrder && (
        <SolicitarMaterialExtraModal
          order={activeOrder}
          onClose={() => setIsMaterialExtraModalOpen(false)}
          onConfirm={(materialName, quantity, reason, category4M, comment) => {
            const extraNum = parseInt(quantity.replace(/[^0-9]/g, ''), 10) || 500;
            const isFaltante = reason.toLowerCase().includes('faltante') || reason.toLowerCase().includes('almacén');
            const isDefectOrMerma =
              (category4M === 'Material' ||
                category4M === 'Mano de obra' ||
                reason.toLowerCase().includes('merma') ||
                reason.toLowerCase().includes('desperdicio')) &&
              !isFaltante;
            const scrapIncrement = isDefectOrMerma ? Math.min(extraNum, 200) : 0;

            const updatedMaterials = (activeOrder.materials ?? []).map((m) => {
              if (m.item === materialName) {
                const currentNum = parseInt(m.delivered.replace(/[^0-9]/g, ''), 10) || 0;
                const newTotal = currentNum + extraNum;
                return {
                  ...m,
                  delivered: `${newTotal.toLocaleString('es-MX')} (+${extraNum.toLocaleString('es-MX')} extra)`,
                };
              }
              return m;
            });

            onUpdateOrder(activeOrder.id, {
              materials: updatedMaterials,
              scrap: activeOrder.scrap + scrapIncrement,
              traceability: [
                {
                  id: `tr-mat-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  user: activeTerminal.assignedOperator.name,
                  station: activeTerminal.machineCode,
                  event: `Material extra entregado: ${quantity} de ${materialName}`,
                  notes: `Motivo 4M (${category4M}): ${reason} · ${comment}${
                    scrapIncrement > 0
                      ? ` (+${scrapIncrement} ejs sumados a scrap por defecto de proceso)`
                      : ' (Sin incremento de scrap: faltante de surtido de almacén)'
                  }`,
                  badgeTone: 'warning',
                },
                ...(activeOrder.traceability ?? []),
              ],
            });

            setIsMaterialExtraModalOpen(false);
            setToastMessage(`✓ Solicitud de ${quantity} de ${materialName} registrada. Almacén notificado.`);
          }}
        />
      )}

      {/* ======================================================================= */}
      {/* MODAL 6: CAPTURAR REPORTE DIARIO DE OPERADOR (FM-PR-012)                */}
      {/* ======================================================================= */}
      {isDailyReportModalOpen && (
        <ReporteDiarioOperadorModal
          order={activeOrder || machineOrders[0] || orders[0]}
          onClose={() => setIsDailyReportModalOpen(false)}
          onSaveReport={(entry) => {
            setDailyReports((prev) => [entry, ...prev]);
            setIsDailyReportModalOpen(false);
            setToastMessage(`✓ Reporte de turno guardado para OP ${entry.opFolio} (Cód. ${entry.code}).`);
          }}
        />
      )}
    </div>
  );
};
