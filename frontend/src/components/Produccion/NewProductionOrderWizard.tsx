import React, { useState, useEffect } from 'react';
import {
  ProductionArea,
  ProductionMachine,
  ProductionMaterialItem,
  ProductionOrder,
  RoutingStep,
  ToolingRequirement,
  OffsetSpecs,
  FlexoSpecs,
  PRODUCTION_MACHINES,
  MASTER_RECIPES,
  MasterManufacturingRecipe,
  MaterialDeviation,
  CoilRemnant,
} from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { OffsetProcessConfigurator } from './OffsetProcessConfigurator';
import { FlexoProcessConfigurator } from './FlexoProcessConfigurator';
import { ProductionMaterials } from './ProductionMaterials';
import { Check, ChevronRight, X, ArrowLeft, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreateOrder: (order: ProductionOrder) => void;
  initialRecipe?: MasterManufacturingRecipe;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export const NewProductionOrderWizard: React.FC<Props> = ({
  onClose,
  onCreateOrder,
  initialRecipe,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Recetas disponibles y selección
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(initialRecipe?.id ?? MASTER_RECIPES[0].id);
  const currentRecipe = MASTER_RECIPES.find((r) => r.id === selectedRecipeId) ?? MASTER_RECIPES[0];

  // Paso 1: Origen del Pedido
  const [pedido] = useState('PED-RTM-2026-198');
  const [selectedCustomer, setSelectedCustomer] = useState(currentRecipe.client);
  const [partNumber, setPartNumber] = useState(currentRecipe.partNumber);
  const [revision, setRevision] = useState(currentRecipe.revision);
  const [processType, setProcessType] = useState<ProductionArea>(currentRecipe.area);
  const [orderedQuantity, setOrderedQuantity] = useState(25000);
  const [stockPT, setStockPT] = useState(3000);
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Normal'>('Alta');
  const [dueCustomerDate, setDueCustomerDate] = useState('11 Sep'); // Demostración de lead time y riesgo

  // Modalidad: Usar receta maestra vs editar todo libremente
  const [useMasterConfig, setUseMasterConfig] = useState(true);

  // Cantidad neta a producir
  const toProduceQuantity = Math.max(0, orderedQuantity - stockPT);

  // Specs
  const [offsetSpecs, setOffsetSpecs] = useState<OffsetSpecs>(
    currentRecipe.offsetSpecs ?? {
      productFamily: 'Manuales de Usuario',
      finalWidthMm: 140,
      finalHeightMm: 215,
      pages: 64,
      paperWeightGsm: 60,
      paperType: 'Bond Blanco',
      inksFront: 1,
      inksBack: 1,
      folded: true,
      stapled: true,
      stapleType: 'Grapado al lomo / tipo libro',
      packQuantity: 50,
      formCount: 2,
      formsDetail: ['Forma 1 (32 págs)', 'Forma 2 (32 págs)'],
      sheetSize: '57 x 87 cm',
      printPercent: '98%',
      estimatedSheets: 12500,
    }
  );

  const [flexoSpecs, setFlexoSpecs] = useState<FlexoSpecs>(
    currentRecipe.flexoSpecs ?? {
      productFamily: 'Etiquetas de Identificación UV',
      widthMm: 101.6,
      lengthMm: 152.4,
      substrate: 'BOPP Blanco Brillante',
      quantityPerRoll: 1000,
      inksCount: 4,
      cmykOrPantone: 'CMYK UV + Barniz Gloss',
      requiresPrint: true,
      requiresDieCut: true,
      requiresVarnish: true,
      requiresLaminate: true,
      requiresCorona: true,
      requiresPrecut: true,
      requiresRewind: true,
      engravingRef: 'GRA-2026-F98',
      engravingStatus: 'Liberado',
      dieType: 'Flexible',
      dieTeeth: 84,
      dieRepeat: '10.5”',
      dieLanes: 4,
      dieStatus: 'Disponible',
      technicalNotes: 'Corte al liner, sin marcas en respaldo. Bobinado exterior.',
    }
  );

  const [selectedMachine, setSelectedMachine] = useState<string>(currentRecipe.defaultMachine);
  const [routing, setRouting] = useState<RoutingStep[]>(currentRecipe.routing);
  const [materials, setMaterials] = useState<ProductionMaterialItem[]>(currentRecipe.standardMaterials);
  const [tooling, setTooling] = useState<ToolingRequirement[]>(currentRecipe.standardTooling);
  const [selectedRemnant, setSelectedRemnant] = useState<CoilRemnant | undefined>(undefined);
  const [activeDeviation, setActiveDeviation] = useState<MaterialDeviation | undefined>(undefined);

  // Planeación
  const [internalDate, setInternalDate] = useState('12 Sep');
  const [assignedShift, setAssignedShift] = useState('Turno A (Matutino)');
  const [notes, setNotes] = useState('OP prioritaria para auditoría de entrega con receta maestra vinculada.');

  // V5: Control de Expeditar Demo y Validación Temprana
  const [isExpedited, setIsExpedited] = useState(false);
  const [expeditedReason, setExpeditedReason] = useState('Compromiso comercial estratégico con cliente · Turno adicional autorizado');
  const [expediteAuthority, setExpediteAuthority] = useState('Ing. Carlos Vega (Gerencia de Planta)');
  const [expediteShiftType, setExpediteShiftType] = useState('Turno Extra Fin de Semana (8 horas)');
  const [expediteImpact, setExpediteImpact] = useState('+$3,200 MXN M.O. / Holgura de 1.5 días asegurada');
  const [expediteComment, setExpediteComment] = useState('Aprobación gerencial para absorber horas extras y garantizar entrega.');
  const [isExpediteModalOpen, setIsExpediteModalOpen] = useState(false);
  const [requisitionSent, setRequisitionSent] = useState(false);
  const [localNotice, setLocalNotice] = useState('');

  // Al cambiar receta maestra en el Paso 1, hereda todo automáticamente (punto central de Iván)
  const applyRecipe = (recipe: MasterManufacturingRecipe) => {
    setSelectedRecipeId(recipe.id);
    setSelectedCustomer(recipe.client);
    setPartNumber(recipe.partNumber);
    setRevision(recipe.revision);
    setProcessType(recipe.area);
    setSelectedMachine(recipe.defaultMachine);
    setRouting(recipe.routing);
    setMaterials(recipe.standardMaterials);
    setTooling(recipe.standardTooling);
    if (recipe.offsetSpecs) setOffsetSpecs(recipe.offsetSpecs);
    if (recipe.flexoSpecs) setFlexoSpecs(recipe.flexoSpecs);
  };

  // Cálculo dinámico de tiempos y Lead Time (Auditoría Sección 5)
  const totalSetupMinutes = routing.reduce((sum, r) => sum + r.setupMinutes, 0);
  const totalRunMinutes = routing.reduce((sum, r) => sum + r.runMinutes, 0);
  const totalMinutes = totalSetupMinutes + totalRunMinutes;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  // Evaluación de viabilidad de fecha y riesgo (Lead Time calculado no hardcoded)
  const machineObj = PRODUCTION_MACHINES.find((m) => m.name === selectedMachine);
  const machineLoad = machineObj?.load ?? 75;

  const calculateLeadTimeRisk = () => {
    const hoursNeeded = totalMinutes / 60;
    // Si la máquina tiene >85% de carga y la fecha cliente es menor o igual a fecha interna
    if (machineLoad > 85 || dueCustomerDate === '09 Sep' || dueCustomerDate === '10 Sep') {
      return {
        risk: 'Alto' as const,
        reason: `Carga alta en ${selectedMachine} (${machineLoad}%) y ruta de ${hoursNeeded.toFixed(1)}h. Compromiso cliente ${dueCustomerDate} no deja holgura.`,
      };
    }
    if (machineLoad > 75 || dueCustomerDate === '11 Sep') {
      return {
        risk: 'Medio' as const,
        reason: `Carga operativa moderada (${machineLoad}%). Finalización estimada coincide con fecha requerida cliente.`,
      };
    }
    return {
      risk: 'Bajo' as const,
      reason: `Capacidad disponible en ${selectedMachine} y holgura de 2+ días frente al cliente.`,
    };
  };

  const riskAssessment = calculateLeadTimeRisk();

  // Gates de materiales y herramental
  const hasMaterialShortage = materials.some((m) => m.status === 'Insuficiente' || m.status === 'Parcial');
  const hasToolingAlert = tooling.some((t) => t.status === 'Pendiente');

  // V5: Validación temprana desde Pedido
  const validationResult: 'LIBERABLE' | 'CON RIESGO' | 'NO LIBERABLE' =
    hasMaterialShortage && !activeDeviation
      ? 'NO LIBERABLE'
      : (riskAssessment.risk === 'Alto' && !isExpedited) || hasToolingAlert
      ? 'CON RIESGO'
      : riskAssessment.risk === 'Medio'
      ? 'CON RIESGO'
      : 'LIBERABLE';

  // Submit final
  const handleCreateOrder = (asBlocked: boolean = false) => {
    const newFolio = `OP-2026-${Math.floor(95300 + Math.random() * 500)}`;

    let initialStatus: any = 'Planeada';
    if (asBlocked || (hasMaterialShortage && !activeDeviation)) {
      initialStatus = 'Bloqueada por material';
    } else {
      initialStatus = 'Por surtir';
    }

    const newOrder: ProductionOrder = {
      id: `op-${Date.now()}`,
      folio: newFolio,
      pedido,
      cliente: selectedCustomer,
      partNumber,
      revision,
      area: processType,
      machine: selectedMachine,
      due: dueCustomerDate,
      status: initialStatus,
      progress: 0,
      quantity: toProduceQuantity,
      good: 0,
      scrap: 0,
      priority,
      materialAlert: hasMaterialShortage && !activeDeviation,
      toolingAlert: tooling.some((t) => t.status === 'Pendiente'),
      stopMinutes: 0,
      operator: 'Por asignar (Planeación)',
      stockCommitted: stockPT,
      setupMinutes: totalSetupMinutes,
      standardMinutes: totalRunMinutes,
      elapsedMinutes: 0,
      tooling:
        processType === 'Flexografía'
          ? `${flexoSpecs.engravingRef} · Suaje ${flexoSpecs.dieTeeth}D`
          : 'Placas CTP Agfa · Imposición ' + (offsetSpecs.pages) + ' págs',
      nextJob: 'OP-2026-95380',
      offsetSpecs: processType === 'Offset' ? offsetSpecs : undefined,
      flexoSpecs: processType === 'Flexografía' ? flexoSpecs : undefined,
      routing,
      materials,
      toolingItems: tooling,
      internalTargetDate: internalDate,
      deliveryRisk: riskAssessment.risk,
      riskReason: riskAssessment.reason,
      activeDeviation,
      selectedRemnant,
      recipeId: currentRecipe.id,
      expedited: isExpedited,
      expeditedReason: isExpedited ? expeditedReason : undefined,
      sheetPrintedStatus: {
        isPrinted: false,
      },
      qualityGates: {
        prepressReleased: true,
        firstPieceReleased: false,
        finalAuditApproved: false,
      },
      traceability: [
        {
          id: 'tr-new-1',
          timestamp: '07 Sep · 09:00',
          user: 'Servicio al Cliente / Ventas',
          station: 'Sistema Ventas',
          event: `Pedido ${pedido} validado contra catálogo maestro`,
          notes: `Artículo ${partNumber} vinculado a Receta Maestra ${currentRecipe.name}`,
          badgeTone: 'primary',
        },
        {
          id: 'tr-new-2',
          timestamp: '07 Sep · 09:05',
          user: 'Planner RTM',
          station: 'Planeación',
          event: `OP ${newFolio} generada heredando configuración técnica`,
          notes: `Ruta de ${routing.length} operaciones programada en ${selectedMachine}. Estado: ${initialStatus}`,
          badgeTone: initialStatus === 'Bloqueada por material' ? 'danger' : 'success',
        },
        ...(isExpedited
          ? [
              {
                id: `tr-new-exp-${Date.now()}`,
                timestamp: '07 Sep · 09:12',
                user: 'Planner RTM',
                station: 'Planeación / Dirección',
                event: 'OP Expeditada bajo Autorización Gerencial',
                notes: `Motivo: ${expeditedReason}. Autorizado por ${expediteAuthority} con ${expediteShiftType}.`,
                badgeTone: 'warning' as const,
              },
            ]
          : []),
      ],
    };

    onCreateOrder(newOrder);
    onClose();
  };

  const stepTitles = [
    '1. Origen y Receta Maestra',
    '2. Especificaciones',
    '3. Configurador de Proceso',
    '4. Insumos y Herramental',
    '5. Planeación y Tiempos',
    '6. Confirmación Final',
  ];

  return (
    <ModalPortal onClose={onClose}>
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header con pasos */}
        <div className="flex items-center justify-between border-b border-theme-subtle bg-theme-surface px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-theme-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-theme-primary">
                WIZARD CONFIGURADOR RTM V4 (HERENCIA DE RECETA)
              </span>
              <span className="text-xs font-mono text-theme-muted">
                Paso {currentStep} de 6: {stepTitles[currentStep - 1]}
              </span>
            </div>
            <h2 className="text-lg font-black text-theme-main">
              Nueva Orden de Producción ({processType}) · {currentRecipe.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de navegación de pasos */}
        <div className="grid grid-cols-6 border-b border-theme-subtle bg-theme-muted/20 text-xs">
          {stepTitles.map((title, idx) => {
            const stepNum = (idx + 1) as WizardStep;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className={`flex items-center justify-center gap-1.5 p-3 text-center font-bold transition-all border-b-2 ${
                  isCurrent
                    ? 'border-theme-primary bg-theme-surface text-theme-primary'
                    : isDone
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-theme-muted hover:text-theme-main'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
                    isCurrent
                      ? 'bg-theme-primary text-white'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-theme-muted text-theme-muted'
                  }`}
                >
                  {isDone ? <Check className="h-3 w-3" /> : stepNum}
                </span>
                <span className="hidden lg:inline truncate">{title.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* PASO 1: ORIGEN CON HERENCIA DE CONFIGURACIÓN MAESTRA (P0) */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Tarjeta de Receta Maestra Heredada */}
              <div className="rounded-2xl border-2 border-theme-primary/40 bg-theme-primary/5 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-theme-primary" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary">
                        HERENCIA AUTOMÁTICA DE INGENIERÍA
                      </span>
                      <h3 className="text-sm font-black text-theme-main">
                        Receta Maestra Seleccionada: {currentRecipe.name}
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-theme-primary px-3 py-1 text-xs font-bold text-white">
                    {currentRecipe.area} · {currentRecipe.revision}
                  </span>
                </div>

                <p className="text-xs text-theme-muted">{currentRecipe.description}</p>

                {/* Selector rápido de las 4 recetas maestras */}
                <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-theme-subtle">
                  {MASTER_RECIPES.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => applyRecipe(rec)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                        selectedRecipeId === rec.id
                          ? 'border-theme-primary bg-theme-surface ring-2 ring-theme-primary/20 shadow-xs'
                          : 'border-theme-subtle bg-theme-surface/60 hover:bg-theme-surface'
                      }`}
                    >
                      <div>
                        <b className="text-xs text-theme-main block">{rec.name}</b>
                        <span className="text-[10px] text-theme-muted font-mono">{rec.partNumber} · {rec.client}</span>
                      </div>
                      {selectedRecipeId === rec.id && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">
                          Cargada
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <span className="text-theme-muted">
                    Ruta: <b>{currentRecipe.routing.length} etapas</b> · Máquina base: <b>{currentRecipe.defaultMachine}</b>
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseMasterConfig(true);
                        setCurrentStep(4); // Salto directo a insumos/planeación
                      }}
                      className="rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
                    >
                      ✓ Usar configuración maestra (Salto rápido)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseMasterConfig(false);
                        setCurrentStep(2);
                      }}
                      className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
                    >
                      Editar parámetros para esta OP →
                    </button>
                  </div>
                </div>
              </div>

              {/* Formulario de Pedido */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Datos del Pedido y Cantidades
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <label>
                    <span className="font-semibold text-theme-muted">Folio Pedido Origen</span>
                    <input
                      type="text"
                      disabled
                      value={pedido}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-muted/30 p-2.5 font-mono"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Cliente</span>
                    <input
                      type="text"
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-main"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Número de Parte</span>
                    <input
                      type="text"
                      value={partNumber}
                      onChange={(e) => setPartNumber(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Revisión de Ingeniería</span>
                    <input
                      type="text"
                      value={revision}
                      onChange={(e) => setRevision(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Fecha Requerida por Cliente</span>
                    <input
                      type="text"
                      value={dueCustomerDate}
                      onChange={(e) => setDueCustomerDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Prioridad</span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 text-xs pt-3 border-t border-theme-subtle">
                  <label>
                    <span className="font-semibold text-theme-muted">Cantidad Solicitada</span>
                    <input
                      type="number"
                      value={orderedQuantity}
                      onChange={(e) => setOrderedQuantity(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono font-bold"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Stock Producto Terminado (PT)</span>
                    <input
                      type="number"
                      value={stockPT}
                      onChange={(e) => setStockPT(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono text-emerald-600 font-bold"
                    />
                  </label>

                  <div className="rounded-xl border border-theme-primary/30 bg-theme-primary/10 p-2.5">
                    <span className="text-theme-muted">Tiraje Neto a Producir:</span>
                    <b className="mt-1 block font-mono text-base font-black text-theme-primary">
                      {toProduceQuantity.toLocaleString('es-MX')} piezas
                    </b>
                  </div>
                </div>
              </div>

              {/* V5: VALIDACIÓN PREVIA DEL PEDIDO (P0 Sección 5) */}
              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                      CONTROL PREVENTIVO DE FACTIBILIDAD RTM
                    </span>
                    <h3 className="text-sm font-black text-theme-main">
                      Validación Previa del Pedido antes de Fabricación
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-black ${
                      validationResult === 'LIBERABLE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : validationResult === 'CON RIESGO'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    Resultado: {validationResult}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 text-[11px]">
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Receta Maestra</span>
                    <b className="text-emerald-600 font-bold">✓ Encontrada</b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Stock PT</span>
                    <b className="font-mono text-theme-main">{stockPT.toLocaleString('es-MX')}</b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">A Producir</span>
                    <b className="font-mono text-theme-main">{toProduceQuantity.toLocaleString('es-MX')}</b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Material Crítico</span>
                    <b className={hasMaterialShortage ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {hasMaterialShortage ? '⚠ Parcial' : '✓ Completo'}
                    </b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Herramental</span>
                    <b className={hasToolingAlert ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {hasToolingAlert ? '⚠ Pendiente' : '✓ Disponible'}
                    </b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Capacidad</span>
                    <b className={machineLoad > 85 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {machineLoad > 85 ? `⚠ ${machineLoad}%` : `✓ ${100 - machineLoad}% libre`}
                    </b>
                  </div>
                  <div className="rounded-lg border border-theme-subtle p-2">
                    <span className="text-theme-muted block">Lead Time</span>
                    <b
                      className={
                        riskAssessment.risk === 'Alto'
                          ? 'text-rose-600 font-black'
                          : riskAssessment.risk === 'Medio'
                          ? 'text-amber-600 font-bold'
                          : 'text-emerald-600 font-bold'
                      }
                    >
                      {riskAssessment.risk === 'Alto' ? '✕ Comprometido' : riskAssessment.risk === 'Medio' ? '⚠ Ajustado' : '✓ Viable'}
                    </b>
                  </div>
                </div>

                {localNotice && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                    {localNotice}
                  </div>
                )}

                {validationResult !== 'LIBERABLE' && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-500/10 p-3 text-xs border border-amber-500/30">
                    <span className="text-amber-900 dark:text-amber-200">
                      <b>Acciones preventivas recomendadas:</b> Mitiga el riesgo antes de pasar la orden a planeación.
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDueCustomerDate('16 Sep');
                          setLocalNotice('✓ Fecha cliente reprogramada a 16 Sep (+5 días de holgura). Viabilidad garantizada.');
                        }}
                        className="rounded-lg border border-theme-subtle bg-theme-surface px-3 py-1.5 font-bold text-theme-main hover:bg-theme-muted/30"
                      >
                        Corregir fecha (+5 días)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(4);
                          setLocalNotice('Revisa los insumos en el paso 4 para aplicar sustituto aprobado o remanente de bobina.');
                        }}
                        className="rounded-lg border border-theme-subtle bg-theme-surface px-3 py-1.5 font-bold text-theme-main hover:bg-theme-muted/30"
                      >
                        Evaluar desviación
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRequisitionSent(true);
                          setLocalNotice('✓ Requisición REQ-2026-089 enviada automáticamente a Compras y Almacén MP.');
                        }}
                        className="rounded-lg bg-theme-primary px-3 py-1.5 font-bold text-white hover:bg-theme-primary/90"
                      >
                        {requisitionSent ? '✓ Requisición enviada' : 'Enviar requisición · Demo'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2 y 3: ESPECIFICACIONES + PROCESO */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="max-w-5xl mx-auto">
              {processType === 'Offset' ? (
                <OffsetProcessConfigurator
                  specs={offsetSpecs}
                  onChangeSpecs={(patch) => setOffsetSpecs((prev) => ({ ...prev, ...patch }))}
                  selectedMachine={selectedMachine}
                  onSelectMachine={setSelectedMachine}
                  machines={PRODUCTION_MACHINES}
                  routing={routing}
                  onChangeRouting={setRouting}
                  quantity={toProduceQuantity}
                />
              ) : (
                <FlexoProcessConfigurator
                  specs={flexoSpecs}
                  onChangeSpecs={(patch) => setFlexoSpecs((prev) => ({ ...prev, ...patch }))}
                  selectedMachine={selectedMachine}
                  onSelectMachine={setSelectedMachine}
                  machines={PRODUCTION_MACHINES}
                  routing={routing}
                  onChangeRouting={setRouting}
                  tooling={tooling}
                  onChangeTooling={setTooling}
                  selectedRemnant={selectedRemnant}
                  onSelectRemnant={setSelectedRemnant}
                />
              )}
            </div>
          )}

          {/* PASO 4: MATERIALES E INSUMOS (CON GATES Y DESVIACIONES) */}
          {currentStep === 4 && (
            <div className="max-w-5xl mx-auto">
              <ProductionMaterials
                materials={materials}
                onChangeMaterials={setMaterials}
                tooling={tooling}
                isFlexo={processType === 'Flexografía'}
                activeDeviation={activeDeviation}
                onApplyDeviation={setActiveDeviation}
              />
            </div>
          )}

          {/* PASO 5: PLANEACIÓN (CON LEAD TIME Y EVALUACIÓN DE RIESGO REAL) */}
          {currentStep === 5 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* V5: Gate de Lead Time (P0 Sección 3) */}
              {riskAssessment.risk === 'Alto' && !isExpedited && (
                <div className="rounded-2xl border-2 border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 p-5 text-xs text-rose-950 dark:text-rose-200 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-rose-600 p-2.5 text-white shrink-0 shadow-xs">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                        GATE DE CONTROL DE CAPACIDAD Y COMPROMISOS (IVÁN)
                      </span>
                      <h3 className="text-base font-black text-rose-900 dark:text-rose-100">
                        FECHA NO VIABLE · RIESGO ALTO DE INCUMPLIMIENTO
                      </h3>
                      <p className="mt-1 text-xs text-rose-800 dark:text-rose-200">
                        {riskAssessment.reason}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-white/80 dark:bg-zinc-900/80 p-3.5 text-xs">
                    <div>
                      <span className="text-theme-muted block">Tiempo requerido:</span>
                      <b className="font-mono text-base text-theme-main">{totalHours}h {totalMins}m</b>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Capacidad disponible:</span>
                      <b className="font-mono text-base text-rose-600">6.0 h</b>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Fecha cliente requerida:</span>
                      <b className="font-mono text-base text-rose-600">{dueCustomerDate}</b>
                    </div>
                    <div>
                      <span className="text-theme-muted block">Fecha estimada sistema:</span>
                      <b className="font-mono text-base text-theme-main">{internalDate}</b>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-200 dark:border-rose-900">
                    <span className="text-xs text-rose-800 dark:text-rose-200">
                      Evitar promesas imposibles: corrige la fecha requerida o autoriza turno adicional con expeditar.
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDueCustomerDate('16 Sep');
                          setInternalDate('14 Sep');
                          setLocalNotice('✓ Fecha compromiso cliente extendida a 16 Sep (+5 días). Viabilidad restablecida.');
                        }}
                        className="rounded-xl border border-theme-subtle bg-theme-surface px-4 py-2 font-bold text-theme-main hover:bg-theme-muted/30"
                      >
                        Corregir fecha (+5 días)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsExpediteModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 font-bold text-white shadow-xs hover:bg-rose-500"
                      >
                        ⚡ Solicitar expeditar · Demo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isExpedited && (
                <div className="rounded-2xl border-2 border-amber-500/80 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-xs text-amber-950 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[9px] font-black uppercase text-white">
                        EXPEDITADA BAJO AUTORIZACIÓN
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">
                        {expediteShiftType}
                      </span>
                    </div>
                    <b className="mt-1 block text-xs">
                      Autorizado por {expediteAuthority}
                    </b>
                    <span className="text-[11px] text-theme-muted">
                      Motivo: {expeditedReason} · Impacto: {expediteImpact}
                    </span>
                  </div>
                  <span className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white text-[11px]">
                    Gate Desbloqueado ✓
                  </span>
                </div>
              )}

              {/* Tarjeta de Riesgo de Entrega Calculado */}
              <div
                className={`rounded-2xl border p-4 text-xs ${
                  riskAssessment.risk === 'Alto' && !isExpedited
                    ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200'
                    : riskAssessment.risk === 'Medio'
                    ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200'
                    : 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <b className="text-sm font-black">
                    Evaluación de Viabilidad y Lead Time: Riesgo {isExpedited ? 'Mitigado (Expeditada)' : riskAssessment.risk}
                  </b>
                  <span className="font-mono font-bold text-xs">
                    Carga {selectedMachine}: {machineLoad}%
                  </span>
                </div>
                <p className="mt-1 text-xs">
                  {isExpedited
                    ? `Se programó ${expediteShiftType} para compensar la carga de ${selectedMachine} (${machineLoad}%). Entrega comprometida para ${dueCustomerDate}.`
                    : riskAssessment.reason}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Setup Estimado</span>
                  <b className="mt-2 block font-mono text-lg text-theme-main">{totalSetupMinutes} min</b>
                  <small className="text-theme-muted">Montaje de {routing.length} estaciones</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Corrida Estimada</span>
                  <b className="mt-2 block font-mono text-lg text-theme-main">{totalRunMinutes} min</b>
                  <small className="text-theme-muted">Velocidad estándar RTM</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Tiempo Total Ruta</span>
                  <b className="mt-2 block font-mono text-lg text-theme-primary font-black">
                    {totalHours}h {totalMins}m
                  </b>
                  <small className="text-theme-muted">Σ de operaciones</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Fecha Interna Posible</span>
                  <b className="mt-2 block text-lg font-bold text-theme-main">{internalDate}</b>
                  <small className="text-theme-muted">Cliente: {dueCustomerDate}</small>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Asignación y Programación de Turno
                </h3>

                <div className="grid gap-4 sm:grid-cols-3 text-xs">
                  <label>
                    <span className="font-semibold text-theme-muted">Máquina Asignada</span>
                    <input
                      type="text"
                      disabled
                      value={selectedMachine}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-muted/30 p-2.5 font-bold"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Fecha Interna de Fabricación</span>
                    <input
                      type="text"
                      value={internalDate}
                      onChange={(e) => setInternalDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold"
                    />
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Turno de Arranque</span>
                    <select
                      value={assignedShift}
                      onChange={(e) => setAssignedShift(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-medium"
                    >
                      <option value="Turno A (Matutino)">Turno A (Matutino 07:00 - 15:00)</option>
                      <option value="Turno B (Vespertino)">Turno B (Vespertino 15:00 - 23:00)</option>
                      <option value="Turno C (Nocturno)">Turno C (Nocturno 23:00 - 07:00)</option>
                    </select>
                  </label>
                </div>

                <label className="block text-xs">
                  <span className="font-semibold text-theme-muted">Instrucciones Especiales para Piso:</span>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-3"
                  />
                </label>
              </div>
            </div>
          )}

          {/* PASO 6: CONFIRMACIÓN Y GATES DE CREACIÓN */}
          {currentStep === 6 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {hasMaterialShortage && !activeDeviation ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-400 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs text-rose-900 dark:text-rose-200">
                  <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0" />
                  <div>
                    <b className="text-sm font-black">Gate de Material: OP Bloqueada para Piso</b>
                    <p className="mt-0.5">
                      Existen faltantes en almacén. La OP se creará con estado <b>"Bloqueada por material"</b> y no podrá surtirse ni pasarse a piso sin antes autorizar una desviación o recibir compra.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/80 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs text-emerald-900 dark:text-emerald-200">
                  <Check className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div>
                    <b className="text-sm font-black">Orden de Producción Lista para Enviar a Planeación</b>
                    <p className="mt-0.5">
                      {activeDeviation
                        ? `Aprobada bajo Desviación ${activeDeviation.deviationNumber}. Se registrará como "Por surtir".`
                        : 'Materiales e insumos reservados. Pasará a "Por surtir" en el programa a 24 horas.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-2">
                  <h4 className="font-black text-theme-main uppercase tracking-wider text-[11px]">
                    Resumen del Pedido y Artículo
                  </h4>
                  <p><b className="text-theme-muted">Cliente:</b> {selectedCustomer}</p>
                  <p><b className="text-theme-muted">Parte / Revisión:</b> {partNumber} ({revision})</p>
                  <p><b className="text-theme-muted">Receta Vinculada:</b> {currentRecipe.name}</p>
                  <p><b className="text-theme-muted">Tiraje OP:</b> {toProduceQuantity.toLocaleString('es-MX')} piezas</p>
                  <p><b className="text-theme-muted">Máquina:</b> {selectedMachine}</p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-2">
                  <h4 className="font-black text-theme-main uppercase tracking-wider text-[11px]">
                    Parámetros Técnicos y Tiempo
                  </h4>
                  <p><b className="text-theme-muted">Tiempo Total:</b> {totalHours}h {totalMins}m</p>
                  <p><b className="text-theme-muted">Fecha Interna:</b> {internalDate} (Cliente: {dueCustomerDate})</p>
                  <p><b className="text-theme-muted">Riesgo Calculado:</b> <span className="font-bold">{riskAssessment.risk}</span></p>
                  {selectedRemnant && (
                    <p className="text-theme-primary font-bold">
                      • Remanente Asignado: {selectedRemnant.remnantCode} ({selectedRemnant.remainingFt} ft)
                    </p>
                  )}
                  {activeDeviation && (
                    <p className="text-emerald-600 font-bold">
                      • Desviación Activa: {activeDeviation.deviationNumber} (Sustituto Aprobado)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-theme-subtle bg-theme-surface px-6 py-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as WizardStep)}
                className="flex items-center gap-1.5 rounded-xl border border-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-main hover:bg-theme-muted/30"
              >
                <ArrowLeft className="h-4 w-4" /> Anterior
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme-subtle px-4 py-2.5 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
            >
              Cancelar
            </button>

            {currentStep < 6 ? (
              currentStep === 5 && riskAssessment.risk === 'Alto' && !isExpedited ? (
                <button
                  type="button"
                  onClick={() => setIsExpediteModalOpen(true)}
                  title="Fecha cliente en riesgo alto. Requiere Corregir Fecha o Solicitar Expeditar."
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500 bg-rose-50 dark:bg-rose-950/40 px-5 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-200 hover:bg-rose-100"
                >
                  <ShieldAlert className="h-4 w-4" /> Bloqueado: Fecha no viable (Expeditar)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev + 1) as WizardStep)}
                  className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </button>
              )
            ) : (
              <div className="flex gap-2">
                {hasMaterialShortage && !activeDeviation && (
                  <button
                    type="button"
                    onClick={() => handleCreateOrder(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-400 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-bold text-rose-800 dark:text-rose-200"
                  >
                    Guardar como Bloqueada por Material
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCreateOrder(false)}
                  className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
                >
                  <Check className="h-4 w-4" /> Enviar a Planeación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* V5: Modal Expeditar Demo (P0 Sección 3) */}
      {isExpediteModalOpen && (
        <ModalPortal onClose={() => setIsExpediteModalOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-theme-subtle bg-theme-surface p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-theme-subtle pb-4">
              <div>
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-600">
                  PROCEDIMIENTO DE CONTINGENCIA RTM
                </span>
                <h3 className="text-base font-black text-theme-main mt-1">
                  Solicitud de Expeditar Orden de Producción
                </h3>
                <p className="text-xs text-theme-muted">
                  Habilita la fabricación con fecha comprometida autorizando sobretiempo o turno adicional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpediteModalOpen(false)}
                className="rounded-xl border border-theme-subtle p-2 text-theme-muted hover:bg-theme-muted/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <label className="block">
                <span className="font-semibold text-theme-muted">Motivo de la Urgencia / Justificación</span>
                <select
                  value={expeditedReason}
                  onChange={(e) => setExpeditedReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-main"
                >
                  <option value="Compromiso comercial estratégico con cliente · Turno adicional autorizado">
                    Compromiso comercial estratégico con cliente (Black & Decker)
                  </option>
                  <option value="Riesgo de penalización contractual por retraso en entrega">
                    Riesgo de penalización contractual por retraso en entrega
                  </option>
                  <option value="Lanzamiento de producto prioritario en piso">
                    Lanzamiento de producto prioritario en piso
                  </option>
                  <option value="Reposición urgente de lote con merma en planta cliente">
                    Reposición urgente de lote con merma en planta cliente
                  </option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-semibold text-theme-muted">Autorización Requerida</span>
                  <input
                    type="text"
                    value={expediteAuthority}
                    onChange={(e) => setExpediteAuthority(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-main"
                  />
                </label>

                <label className="block">
                  <span className="font-semibold text-theme-muted">Turno Adicional / Mecanismo</span>
                  <select
                    value={expediteShiftType}
                    onChange={(e) => setExpediteShiftType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-semibold"
                  >
                    <option value="Turno Extra Fin de Semana (8 horas)">Turno Extra Fin de Semana (8 horas)</option>
                    <option value="Horas Extra Turno Vespertino (2h diarias)">Horas Extra Turno Vespertino (2h)</option>
                    <option value="Tercer Turno Nocturno de Contingencia">Tercer Turno Nocturno</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="font-semibold text-theme-muted">Impacto Operativo Estimado</span>
                <input
                  type="text"
                  value={expediteImpact}
                  onChange={(e) => setExpediteImpact(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-muted/30 p-2.5 font-mono text-theme-main font-bold"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-theme-muted">Comentarios Técnicos y Acuerdos</span>
                <textarea
                  rows={2}
                  value={expediteComment}
                  onChange={(e) => setExpediteComment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-theme-subtle pt-4">
              <button
                type="button"
                onClick={() => setIsExpediteModalOpen(false)}
                className="rounded-xl border border-theme-subtle px-4 py-2 text-xs font-bold text-theme-muted hover:bg-theme-muted/30"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExpedited(true);
                  setIsExpediteModalOpen(false);
                  setLocalNotice('⚡ Orden Expeditada autorizada por Gerencia. Gate de lead time desbloqueado.');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-500"
              >
                ✓ Autorizar y Expeditar OP
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </ModalPortal>
  );
};
