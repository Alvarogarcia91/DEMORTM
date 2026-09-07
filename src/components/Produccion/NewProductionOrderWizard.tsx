import React, { useState } from 'react';
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
} from '../../data/mockProduccionData';
import { ModalPortal } from '../common/ModalPortal';
import { OffsetProcessConfigurator } from './OffsetProcessConfigurator';
import { FlexoProcessConfigurator } from './FlexoProcessConfigurator';
import { ProductionMaterials } from './ProductionMaterials';
import { Check, ChevronRight, X, ArrowLeft, Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreateOrder: (order: ProductionOrder) => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export const NewProductionOrderWizard: React.FC<Props> = ({ onClose, onCreateOrder }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Paso 1: Origen
  const [selectedCustomer, setSelectedCustomer] = useState<'BLACK & DECKER' | 'TYCO' | 'PANASONIC' | 'FRESENIUS'>('BLACK & DECKER');
  const [pedido] = useState('PED-RTM-2026-198');
  const [partNumber, setPartNumber] = useState('NA472050');
  const [revision, setRevision] = useState('Rev 08/23');
  const [orderedQuantity, setOrderedQuantity] = useState(25000);
  const [stockPT, setStockPT] = useState(3000);
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Normal'>('Alta');
  const [dueCustomerDate, setDueCustomerDate] = useState('14 Sep');
  const [processType, setProcessType] = useState<ProductionArea>('Offset');

  // Cantidad neta a producir
  const toProduceQuantity = Math.max(0, orderedQuantity - stockPT);

  // Offset Specs State (Default Black & Decker Manual)
  const [offsetSpecs, setOffsetSpecs] = useState<OffsetSpecs>({
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
  });

  // Flexo Specs State (Default TYCO / Fresenius Etiqueta)
  const [flexoSpecs, setFlexoSpecs] = useState<FlexoSpecs>({
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
  });

  // Máquina seleccionada
  const [selectedMachine, setSelectedMachine] = useState<string>('Heidelberg Speedmaster XL 75');

  // Routing State
  const [routing, setRouting] = useState<RoutingStep[]>([
    {
      stepNumber: 1,
      process: 'Preimpresión CTP',
      machine: 'CTP Agfa',
      setupMinutes: 20,
      runMinutes: 30,
      status: 'Pendiente',
      requiresFirstPieceQuality: true,
    },
    {
      stepNumber: 2,
      process: 'Impresión Offset',
      machine: 'Heidelberg Speedmaster XL 75',
      alternativeMachine: 'Conserver 8 colores',
      setupMinutes: 40,
      runMinutes: 160,
      status: 'Pendiente',
      requiresFirstPieceQuality: true,
    },
    {
      stepNumber: 3,
      process: 'Guillotina',
      machine: 'Guillotina 2',
      setupMinutes: 15,
      runMinutes: 45,
      status: 'Pendiente',
      requiresFirstPieceQuality: false,
    },
    {
      stepNumber: 4,
      process: 'Doblado',
      machine: 'Stahl 2',
      setupMinutes: 25,
      runMinutes: 60,
      status: 'Pendiente',
      requiresFirstPieceQuality: false,
    },
    {
      stepNumber: 5,
      process: 'Grapado y Alzado',
      machine: 'Muller Martini',
      setupMinutes: 30,
      runMinutes: 70,
      status: 'Pendiente',
      requiresFirstPieceQuality: true,
    },
    {
      stepNumber: 6,
      process: 'Calidad Final',
      machine: 'Mesa de Calidad',
      setupMinutes: 10,
      runMinutes: 20,
      status: 'Pendiente',
      requiresFirstPieceQuality: true,
    },
    {
      stepNumber: 7,
      process: 'Empaque',
      machine: 'Mesa Empaque',
      setupMinutes: 10,
      runMinutes: 30,
      status: 'Pendiente',
      requiresFirstPieceQuality: false,
    },
  ]);

  // Materiales State
  const [materials, setMaterials] = useState<ProductionMaterialItem[]>([
    {
      id: 'mat-1',
      item: 'Papel Bond 60g 57x87 cm',
      type: 'Papel/Bobina',
      required: '12,500 pliegos',
      reserved: '12,500 pliegos',
      delivered: '12,500 pliegos',
      available: '85,000 pliegos',
      lot: 'LOT-BOND60-2026',
      status: 'Disponible',
    },
    {
      id: 'mat-2',
      item: 'Tinta Offset Negra Alta Densidad',
      type: 'Tinta',
      required: '6.8 kg',
      reserved: '6.8 kg',
      delivered: '6.8 kg',
      available: '45 kg',
      lot: 'LOT-INK-BK-09',
      status: 'Disponible',
    },
    {
      id: 'mat-3',
      item: 'Placas CTP Térmicas Agfa',
      type: 'Placa/Cliché',
      required: '8 placas',
      reserved: '8 placas',
      delivered: '8 placas',
      available: '32 placas',
      lot: 'LOT-PL-CTP',
      status: 'Disponible',
    },
    {
      id: 'mat-4',
      item: 'Alambre para grapa 25 gauge',
      type: 'Empaque',
      required: '1 rollo',
      reserved: '1 rollo',
      delivered: '1 rollo',
      available: '12 rollos',
      lot: 'LOT-ALAM-02',
      status: 'Disponible',
    },
  ]);

  // Herramental State
  const [tooling, setTooling] = useState<ToolingRequirement[]>([
    {
      id: 't-1',
      name: 'Juego de Placas Offset CTP',
      type: 'Placas Offset',
      status: 'Liberado',
      details: 'Forma 1 y Forma 2 (Frente y Vuelta) · Calibración lineal aprobada',
    },
    {
      id: 't-2',
      name: 'Cabezal Grapador Muller Martini',
      type: 'Grapador',
      status: 'Disponible',
      details: 'Doble cabezal calibrado a lomo manual 64 páginas',
    },
  ]);

  // Paso 5: Planeación State
  const [internalDate, setInternalDate] = useState('11 Sep');
  const [assignedShift, setAssignedShift] = useState('Turno A (Matutino)');
  const [notes, setNotes] = useState('OP prioritaria para auditoría de entrega Black & Decker.');

  // Pre-load demo presets when changing customer / area in Step 1
  const handleSelectCustomerPreset = (customer: 'BLACK & DECKER' | 'TYCO' | 'PANASONIC' | 'FRESENIUS') => {
    setSelectedCustomer(customer);
    if (customer === 'BLACK & DECKER') {
      setProcessType('Offset');
      setPartNumber('NA472050');
      setRevision('Rev 08/23');
      setOrderedQuantity(25000);
      setStockPT(3000);
      setSelectedMachine('Heidelberg Speedmaster XL 75');
      setOffsetSpecs({
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
      });
      setRouting([
        {
          stepNumber: 1,
          process: 'Preimpresión CTP',
          machine: 'CTP Agfa',
          setupMinutes: 20,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 2,
          process: 'Impresión Offset',
          machine: 'Heidelberg Speedmaster XL 75',
          alternativeMachine: 'Conserver 8 colores',
          setupMinutes: 40,
          runMinutes: 160,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 3,
          process: 'Guillotina',
          machine: 'Guillotina 2',
          setupMinutes: 15,
          runMinutes: 45,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 4,
          process: 'Doblado',
          machine: 'Stahl 2',
          setupMinutes: 25,
          runMinutes: 60,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
        {
          stepNumber: 5,
          process: 'Grapado y Alzado',
          machine: 'Muller Martini',
          setupMinutes: 30,
          runMinutes: 70,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 6,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 7,
          process: 'Empaque',
          machine: 'Mesa Empaque',
          setupMinutes: 10,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ]);
      setMaterials([
        {
          id: 'mat-1',
          item: 'Papel Bond 60g 57x87 cm',
          type: 'Papel/Bobina',
          required: '12,500 pliegos',
          reserved: '12,500 pliegos',
          delivered: '12,500 pliegos',
          available: '85,000 pliegos',
          lot: 'LOT-BOND60-2026',
          status: 'Disponible',
        },
        {
          id: 'mat-2',
          item: 'Tinta Offset Negra Alta Densidad',
          type: 'Tinta',
          required: '6.8 kg',
          reserved: '6.8 kg',
          delivered: '6.8 kg',
          available: '45 kg',
          lot: 'LOT-INK-BK-09',
          status: 'Disponible',
        },
        {
          id: 'mat-3',
          item: 'Placas CTP Térmicas Agfa',
          type: 'Placa/Cliché',
          required: '8 placas',
          reserved: '8 placas',
          delivered: '8 placas',
          available: '32 placas',
          lot: 'LOT-PL-CTP',
          status: 'Disponible',
        },
        {
          id: 'mat-4',
          item: 'Alambre para grapa 25 gauge',
          type: 'Empaque',
          required: '1 rollo',
          reserved: '1 rollo',
          delivered: '1 rollo',
          available: '12 rollos',
          lot: 'LOT-ALAM-02',
          status: 'Disponible',
        },
      ]);
      setTooling([
        {
          id: 't-1',
          name: 'Juego de Placas Offset CTP',
          type: 'Placas Offset',
          status: 'Liberado',
          details: 'Forma 1 y Forma 2 (Frente y Vuelta) · Calibración lineal aprobada',
        },
        {
          id: 't-2',
          name: 'Cabezal Grapador Muller Martini',
          type: 'Grapador',
          status: 'Disponible',
          details: 'Doble cabezal calibrado a lomo manual 64 páginas',
        },
      ]);
    } else {
      // Flexo (TYCO, Fresenius, Panasonic)
      setProcessType('Flexografía');
      setPartNumber('IS-2420');
      setRevision('Rev I-01');
      setOrderedQuantity(50000);
      setStockPT(5000);
      setSelectedMachine('Mark Andy Scout 10”');
      setFlexoSpecs({
        productFamily: 'Etiquetas Autoadheribles Industriales',
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
      });
      setRouting([
        {
          stepNumber: 1,
          process: 'Prensa Flexográfica Scout 10”',
          machine: 'Mark Andy Scout 10”',
          alternativeMachine: 'Mark Andy 4120 17”',
          setupMinutes: 35,
          runMinutes: 180,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
          subOperations: [
            'Impresión (4 tintas UV)',
            'Barniz UV sobreimpresión',
            'Troquelado rotativo',
            'Laminado BOPP',
            'Tratamiento Corona',
            'Precorte',
          ],
        },
        {
          stepNumber: 2,
          process: 'Rebobinado e Inspección',
          machine: 'Rotoflex I',
          alternativeMachine: 'BGM 2',
          setupMinutes: 15,
          runMinutes: 60,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
          subOperations: ['Corte longitudinal', 'Conteo y revisión estroboscópica'],
        },
        {
          stepNumber: 3,
          process: 'Calidad Final',
          machine: 'Mesa de Calidad',
          setupMinutes: 10,
          runMinutes: 20,
          status: 'Pendiente',
          requiresFirstPieceQuality: true,
        },
        {
          stepNumber: 4,
          process: 'Empaque y Embalaje',
          machine: 'Estación Empaque',
          setupMinutes: 10,
          runMinutes: 30,
          status: 'Pendiente',
          requiresFirstPieceQuality: false,
        },
      ]);
      setMaterials([
        {
          id: 'mat-f1',
          item: 'Bobina BOPP Blanco Brillante 7”',
          type: 'Papel/Bobina',
          required: '3,800 m',
          reserved: '3,800 m',
          delivered: '3,800 m',
          available: '24,000 m',
          lot: 'LOT-BOPP-892',
          status: 'Disponible',
        },
        {
          id: 'mat-f2',
          item: 'Juego de Tintas UV Flexo (CMYK)',
          type: 'Tinta',
          required: '5.2 kg',
          reserved: '5.2 kg',
          delivered: '5.2 kg',
          available: '38 kg',
          lot: 'LOT-UV-CMYK',
          status: 'Disponible',
        },
        {
          id: 'mat-f3',
          item: 'Barniz UV Sobreimpresión Gloss',
          type: 'Barniz',
          required: '3.5 kg',
          reserved: '3.5 kg',
          delivered: '3.5 kg',
          available: '18 kg',
          lot: 'LOT-BAR-UV3',
          status: 'Disponible',
        },
        {
          id: 'mat-f4',
          item: 'Cliché Fotopolímero 1.14mm (4 juegos)',
          type: 'Placa/Cliché',
          required: '4 juegos',
          reserved: '4 juegos',
          delivered: '4 juegos',
          available: 'Casetera Flexo',
          lot: 'GRA-2026-F98',
          status: 'Disponible',
        },
        {
          id: 'mat-f5',
          item: 'Suaje Rotativo Flexible 84 Dientes (4 salidas)',
          type: 'Suaje',
          required: '1 cilindro',
          reserved: '1 cilindro',
          delivered: '1 cilindro',
          available: 'Rack B-3',
          lot: 'SUA-ROT-84D',
          status: 'Disponible',
        },
      ]);
      setTooling([
        {
          id: 't-f1',
          name: 'Grabado / Clichés Digitales Flexo',
          type: 'Grabado/Cliché',
          status: 'Liberado',
          details: '4 tintas UV · Fotopolímero 1.14 mm · Casetera GRA-2026-F98',
          teethOrRepeat: 'Repeat 10.5”',
        },
        {
          id: 't-f2',
          name: 'Suaje Rotativo Flexible RTM',
          type: 'Suaje Rotativo',
          status: 'Disponible',
          details: 'Corte al liner · 4 cavidades/salidas · Rack B-3',
          teethOrRepeat: '84 dientes · 10.5” repeat',
        },
      ]);
    }
  };

  // Cálculos de setup y corrida totales
  const totalSetupMinutes = routing.reduce((sum, r) => sum + r.setupMinutes, 0);
  const totalRunMinutes = routing.reduce((sum, r) => sum + r.runMinutes, 0);
  const totalMinutes = totalSetupMinutes + totalRunMinutes;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  // Final confirmation to submit order
  const handleCreateOrder = () => {
    const newFolio = `OP-2026-${Math.floor(95300 + Math.random() * 500)}`;
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
      status: 'Planeada',
      progress: 0,
      quantity: toProduceQuantity,
      good: 0,
      scrap: 0,
      priority,
      materialAlert: materials.some((m) => m.status === 'Insuficiente' || m.status === 'Parcial'),
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
          : 'Placas CTP Agfa · Imposición 64 págs',
      nextJob: 'OP-2026-95380',
      offsetSpecs: processType === 'Offset' ? offsetSpecs : undefined,
      flexoSpecs: processType === 'Flexografía' ? flexoSpecs : undefined,
      routing,
      materials,
      toolingItems: tooling,
      internalTargetDate: internalDate,
      deliveryRisk: 'Bajo',
      qualityGates: {
        prepressReleased: true,
        firstPieceReleased: false,
        finalAuditApproved: false,
      },
      traceability: [
        {
          id: 'tr-new-1',
          timestamp: '07 Sep · 09:00',
          user: 'Asesor Técnico RTM',
          station: 'Configurador Técnico',
          event: `OP configurada como ${processType}`,
          notes:
            processType === 'Offset'
              ? `Manual ${offsetSpecs.pages} páginas optimizado en 2 formas de 32`
              : `Etiqueta ${flexoSpecs.substrate} en ${selectedMachine}`,
          badgeTone: 'primary',
        },
        {
          id: 'tr-new-2',
          timestamp: '07 Sep · 09:05',
          user: 'Ingeniería de Planta',
          station: 'Planeación',
          event: 'Enviada a planeación y cola de máquina',
          notes: `Programada en ${selectedMachine} con entrega interna ${internalDate}`,
          badgeTone: 'success',
        },
      ],
    };

    onCreateOrder(newOrder);
    onClose();
  };

  const stepTitles = [
    '1. Origen del Pedido',
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
                WIZARD CONFIGURADOR RTM V3
              </span>
              <span className="text-xs font-mono text-theme-muted">
                Paso {currentStep} de 6: {stepTitles[currentStep - 1]}
              </span>
            </div>
            <h2 className="text-lg font-black text-theme-main">
              Nueva Orden de Producción ({processType})
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

        {/* Barra de progreso de pasos */}
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

        {/* Contenido del paso actual (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* PASO 1: ORIGEN */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4">
                <span className="text-xs font-bold text-theme-main">Selecciona un Pedido / Cliente Ejemplo para Demo:</span>
                <p className="text-[11px] text-theme-muted mb-3">
                  Carga automática de especificaciones preconfiguradas de RTM.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(['BLACK & DECKER', 'TYCO', 'PANASONIC', 'FRESENIUS'] as const).map((cust) => (
                    <button
                      key={cust}
                      type="button"
                      onClick={() => handleSelectCustomerPreset(cust)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        selectedCustomer === cust
                          ? 'border-theme-primary bg-theme-primary/10 ring-2 ring-theme-primary/20'
                          : 'border-theme-subtle bg-theme-surface hover:bg-theme-muted/20'
                      }`}
                    >
                      <b className="block text-xs font-black text-theme-main">{cust}</b>
                      <span className="text-[10px] text-theme-muted">
                        {cust === 'BLACK & DECKER' ? 'Manual Offset' : 'Etiqueta Flexo'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Datos Generales del Pedido y Artículo
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
                      onChange={(e) => setSelectedCustomer(e.target.value as any)}
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
                    <span className="font-semibold text-theme-muted">Tipo de Proceso / Tecnología</span>
                    <select
                      value={processType}
                      onChange={(e) => {
                        const val = e.target.value as ProductionArea;
                        setProcessType(val);
                        if (val === 'Offset') {
                          handleSelectCustomerPreset('BLACK & DECKER');
                        } else {
                          handleSelectCustomerPreset('TYCO');
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-bold text-theme-primary"
                    >
                      <option value="Offset">OFFSET (Manuales, Libros, Instructivos)</option>
                      <option value="Flexografía">FLEXOGRAFÍA (Etiquetas Autoadheribles)</option>
                    </select>
                  </label>

                  <label>
                    <span className="font-semibold text-theme-muted">Prioridad de Producción</span>
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
                    <span className="font-semibold text-theme-muted">Cantidad Pedida</span>
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
                      className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-2.5 font-mono text-emerald-600"
                    />
                  </label>

                  <div className="rounded-xl border border-theme-primary/30 bg-theme-primary/10 p-2.5">
                    <span className="text-theme-muted">Cantidad Neta a Producir:</span>
                    <b className="mt-1 block font-mono text-base font-black text-theme-primary">
                      {toProduceQuantity.toLocaleString('es-MX')} piezas
                    </b>
                  </div>
                </div>
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
                />
              )}
            </div>
          )}

          {/* PASO 4: MATERIALES E INSUMOS */}
          {currentStep === 4 && (
            <div className="max-w-5xl mx-auto">
              <ProductionMaterials
                materials={materials}
                onChangeMaterials={setMaterials}
                tooling={tooling}
                isFlexo={processType === 'Flexografía'}
              />
            </div>
          )}

          {/* PASO 5: PLANEACIÓN */}
          {currentStep === 5 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Setup Estimado</span>
                  <b className="mt-2 block font-mono text-lg text-theme-main">{totalSetupMinutes} min</b>
                  <small className="text-theme-muted">Calibración y montaje</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Corrida Estimada</span>
                  <b className="mt-2 block font-mono text-lg text-theme-main">{totalRunMinutes} min</b>
                  <small className="text-theme-muted">Velocidad estándar</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Tiempo Total</span>
                  <b className="mt-2 block font-mono text-lg text-theme-primary font-black">
                    {totalHours}h {totalMins}m
                  </b>
                  <small className="text-theme-muted">Ciclo completo</small>
                </div>
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4">
                  <span className="text-theme-muted">Riesgo de Entrega</span>
                  <b className="mt-2 block text-lg font-bold text-emerald-600">Bajo (Holgura 3 días)</b>
                  <small className="text-theme-muted">Fecha cliente: {dueCustomerDate}</small>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
                <h3 className="text-sm font-black text-theme-main uppercase tracking-wider">
                  Programación en Turno y Carga de Máquina
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
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme-subtle bg-theme-surface p-3"
                  />
                </label>
              </div>
            </div>
          )}

          {/* PASO 6: CONFIRMACIÓN RESUMEN */}
          {currentStep === 6 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/80 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs text-emerald-900 dark:text-emerald-200">
                <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <b className="text-sm font-black">Orden de Producción Lista para Enviar a Planeación</b>
                  <p className="mt-0.5">
                    Especificaciones, routing, insumos y cálculo técnico validados con éxito.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-2">
                  <h4 className="font-black text-theme-main uppercase tracking-wider text-[11px]">
                    Resumen del Pedido y Producto
                  </h4>
                  <p><b className="text-theme-muted">Cliente:</b> {selectedCustomer}</p>
                  <p><b className="text-theme-muted">Parte / Revisión:</b> {partNumber} ({revision})</p>
                  <p><b className="text-theme-muted">Tecnología:</b> <span className="font-bold text-theme-primary">{processType}</span></p>
                  <p><b className="text-theme-muted">Tiraje OP:</b> {toProduceQuantity.toLocaleString('es-MX')} piezas</p>
                  <p><b className="text-theme-muted">Stock PT Comprometido:</b> {stockPT.toLocaleString('es-MX')} piezas</p>
                </div>

                <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-5 space-y-2">
                  <h4 className="font-black text-theme-main uppercase tracking-wider text-[11px]">
                    Parámetros Técnicos Clave
                  </h4>
                  {processType === 'Offset' ? (
                    <>
                      <p><b className="text-theme-muted">Paginación:</b> {offsetSpecs.pages} páginas ({offsetSpecs.formCount} Formas)</p>
                      <p><b className="text-theme-muted">Papel:</b> {offsetSpecs.paperWeightGsm}g {offsetSpecs.paperType}</p>
                      <p><b className="text-theme-muted">Acabado:</b> {offsetSpecs.stapleType}</p>
                      <p><b className="text-theme-muted">Pliegos Calculados:</b> {offsetSpecs.estimatedSheets?.toLocaleString('es-MX')}</p>
                    </>
                  ) : (
                    <>
                      <p><b className="text-theme-muted">Sustrato:</b> {flexoSpecs.substrate}</p>
                      <p><b className="text-theme-muted">Tintas:</b> {flexoSpecs.inksCount} Colores ({flexoSpecs.cmykOrPantone})</p>
                      <p><b className="text-theme-muted">Suaje:</b> {flexoSpecs.dieTeeth} Dientes ({flexoSpecs.dieType})</p>
                      <p><b className="text-theme-muted">Operaciones en Prensa:</b> Troquelado, Barniz UV, Laminado</p>
                    </>
                  )}
                  <p><b className="text-theme-muted">Máquina Principal:</b> <span className="font-bold text-theme-main">{selectedMachine}</span></p>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 text-xs">
                <span className="font-bold text-theme-main">Routing a programar ({routing.length} etapas):</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {routing.map((r, i) => (
                    <span key={i} className="rounded-lg border border-theme-subtle bg-theme-muted/20 px-2.5 py-1">
                      #{r.stepNumber} {r.process} ({r.machine})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con navegación de botones */}
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
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as WizardStep)}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateOrder}
                className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90"
              >
                <Check className="h-4 w-4" /> Crear OP y enviar a Planeación
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
