import { ProductionOrder, ProductionArea } from './mockProduccionData';

export type DashboardPeriod = 'Hoy' | 'Ayer' | 'Semana actual' | 'Últimos 7 días' | 'Mes actual';
export type DashboardAreaFilter = 'Todas' | 'Offset' | 'Flexografía' | 'Acabados';
export type DashboardShift = 'Todos' | 'Turno A (06:00 - 14:00)' | 'Turno B (14:00 - 21:30)' | 'Turno C (21:30 - 06:00)';

export interface PlanVsActualArea {
  area: ProductionArea;
  plan: number;
  real: number;
  compliancePercent: number;
  status: 'Conforme' | 'Atención' | 'Crítico';
}

export interface MachineCapacityV8 {
  id: string;
  name: string;
  area: ProductionArea;
  plannedHours: number;
  availableHours: number;
  weeklyCapacityHours: number; // Standard 40h/semana
  utilizationPercent: number;
  status: 'Normal' | 'Atención' | 'Saturada' | 'Detenida';
  activeOpFolio?: string;
  stopReason?: string;
  stopMinutes?: number;
}

export interface DeliveryRiskItem {
  id: string;
  opFolio: string;
  client: string;
  partNumber: string;
  rtmDueDate: string;
  clientDueDate: string;
  estimatedDeliveryDate: string;
  riskLevel: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  cause: string;
  area: ProductionArea;
  machine: string;
}

export interface ActionCenterItem {
  id: string;
  opFolio?: string;
  title: string;
  subtitle: string;
  severity: 'red' | 'amber' | 'blue';
  impactDescription: string;
  actionPrimary: { label: string; action: 'open_op' | 'reprogram' | 'view_impact' | 'review_scrap' | 'view_supply' };
  actionSecondary?: { label: string; action: 'open_op' | 'reprogram' };
  targetOpFolio?: string;
  targetMachine?: string;
}

export interface TrafficNodeDetail {
  id: string;
  stageName: string;
  area: ProductionArea;
  activeMachine: string;
  currentOpFolio: string;
  client: string;
  partNumber: string;
  startTime: string;
  estimatedEndTime: string;
  progressPercent: number;
  standardMinutes: number;
  actualEstimatedMinutes: number;
  deviationMinutes: number; // positive = delay
  queueOrders: { folio: string; client: string; quantity: number; priority: string }[];
  remainingCapacityToday: string;
  totalOpsInStage: number;
  isStopped?: boolean;
  hasQueueAlert?: boolean;
}

export interface StandardVsActualMetric {
  id: string;
  machineOrProcess: string;
  area: ProductionArea;
  standardSpeed: string;
  actualSpeed: string;
  efficiencyPercent: number;
  trend: 'up' | 'stable' | 'down';
  sampleType: 'ft/h' | 'pliegos/h' | 'min';
  operationName?: string;
  standardMinutes?: number;
  actualMinutes?: number;
  deviationMinutes?: number;
}

// ------------------------------------------------------------------
// DATASET COHERENTE POR PERIODO (Sin números mágicos en componentes)
// ------------------------------------------------------------------

export const DASHBOARD_V8_SNAPSHOTS = {
  Hoy: {
    planTotal: 205000,
    goodProduced: 184250,
    lostMinutesTotal: 209, // 3h 29m
    scrapTotalUnits: 6140,
    incidentsCount: 5,
    topLostCause: 'Máquina · 93 min',
    criticalOpsCount: 4,
    criticalOpsUrgent: 2,
    criticalMachinesCount: 2, // 1 detenida, 1 saturada
    
    // Plan vs Real por área
    areaPlanReal: [
      { area: 'Offset' as ProductionArea, plan: 98000, real: 91400, compliancePercent: 93.3, status: 'Conforme' as const },
      { area: 'Flexografía' as ProductionArea, plan: 72000, real: 59800, compliancePercent: 83.1, status: 'Atención' as const },
      { area: 'Acabados' as ProductionArea, plan: 35000, real: 33050, compliancePercent: 94.4, status: 'Conforme' as const },
    ],

    // Desglose 4M exacto: 93 + 58 + 37 + 21 = 209 min (3h 29m)
    losses4M: [
      { category: 'Máquina', minutes: 93, percent: 44.5, color: 'bg-rose-500', note: 'Ajuste de registro Mark Andy 830' },
      { category: 'Material', minutes: 58, percent: 27.8, color: 'bg-amber-500', note: 'Espera de bobina BOPP en andén' },
      { category: 'Método', minutes: 37, percent: 17.7, color: 'bg-blue-500', note: 'Aclaración de orden de doblado' },
      { category: 'Mano de obra', minutes: 21, percent: 10.0, color: 'bg-purple-500', note: 'Relevo de turno y setup de suaje' },
    ],

    // Merma por área
    scrapByArea: [
      { area: 'Offset', scrapPercent: 2.4, status: 'Sano' },
      { area: 'Flexografía', scrapPercent: 4.2, status: 'Alerta' }, // 4.2% cercano al límite de 5%
      { area: 'Acabados', scrapPercent: 1.1, status: 'Sano' },
    ],
    topScrapContributor: {
      opFolio: 'OP-2026-95333',
      client: 'FRESENIUS Medical',
      units: 1240,
      reason: 'Ajuste de tensión en película transparente',
    },

    // Producción acumulada hora por hora (07:00 a 17:00)
    hourlyAccumulation: [
      { hour: '07:00', planAccum: 18000, realAccum: 16500 },
      { hour: '09:00', planAccum: 55000, realAccum: 49200 },
      { hour: '11:00', planAccum: 95000, realAccum: 84000 },
      { hour: '13:00', planAccum: 135000, realAccum: 119800 },
      { hour: '15:00', planAccum: 175000, realAccum: 154000 },
      { hour: '17:00', planAccum: 205000, realAccum: 184250 },
    ],
  },
  'Semana actual': {
    planTotal: 1025000,
    goodProduced: 948000,
    lostMinutesTotal: 840, // 14h 00m
    scrapTotalUnits: 29500,
    incidentsCount: 18,
    topLostCause: 'Máquina · 410 min',
    criticalOpsCount: 6,
    criticalOpsUrgent: 3,
    criticalMachinesCount: 2,
    areaPlanReal: [
      { area: 'Offset' as ProductionArea, plan: 490000, real: 462000, compliancePercent: 94.3, status: 'Conforme' as const },
      { area: 'Flexografía' as ProductionArea, plan: 360000, real: 318000, compliancePercent: 88.3, status: 'Atención' as const },
      { area: 'Acabados' as ProductionArea, plan: 175000, real: 168000, compliancePercent: 96.0, status: 'Conforme' as const },
    ],
    losses4M: [
      { category: 'Máquina', minutes: 410, percent: 48.8, color: 'bg-rose-500', note: 'Paros mecánicos acumulados' },
      { category: 'Material', minutes: 220, percent: 26.2, color: 'bg-amber-500', note: 'Demoras de surtido de sustrato' },
      { category: 'Método', minutes: 130, percent: 15.5, color: 'bg-blue-500', note: 'Consultas de ingeniería' },
      { category: 'Mano de obra', minutes: 80, percent: 9.5, color: 'bg-purple-500', note: 'Curva de aprendizaje nuevos operadores' },
    ],
    scrapByArea: [
      { area: 'Offset', scrapPercent: 2.1, status: 'Sano' },
      { area: 'Flexografía', scrapPercent: 3.8, status: 'Sano' },
      { area: 'Acabados', scrapPercent: 1.0, status: 'Sano' },
    ],
    topScrapContributor: {
      opFolio: 'OP-2026-95333',
      client: 'FRESENIUS Medical',
      units: 3400,
      reason: 'Arranques de bobina nueva',
    },
    hourlyAccumulation: [
      { hour: 'Lun', planAccum: 205000, realAccum: 198000 },
      { hour: 'Mar', planAccum: 410000, realAccum: 382000 },
      { hour: 'Mié', planAccum: 615000, realAccum: 569000 },
      { hour: 'Jue', planAccum: 820000, realAccum: 755000 },
      { hour: 'Vie', planAccum: 1025000, realAccum: 948000 },
    ],
  },
};

// ------------------------------------------------------------------
// CAPACIDAD SEMANAL EN HORAS POR MÁQUINA (Sección 8 del MD)
// Capacidad base 40h/semana · Demo configurable
// ------------------------------------------------------------------
export const WEEKLY_MACHINES_CAPACITY_V8: MachineCapacityV8[] = [
  {
    id: 'maq-cap-1',
    name: 'Mark Andy 830 10"',
    area: 'Flexografía',
    plannedHours: 38.5,
    availableHours: 1.5,
    weeklyCapacityHours: 40.0,
    utilizationPercent: 96,
    status: 'Saturada',
    activeOpFolio: 'OP-2026-95321',
    stopReason: 'Problema mecánico en tornillo micrométrico',
    stopMinutes: 47,
  },
  {
    id: 'maq-cap-2',
    name: 'Heidelberg XL 75',
    area: 'Offset',
    plannedHours: 32.8,
    availableHours: 7.2,
    weeklyCapacityHours: 40.0,
    utilizationPercent: 82,
    status: 'Normal',
    activeOpFolio: 'OP-2026-95318',
  },
  {
    id: 'maq-cap-3',
    name: 'DiDDE 860',
    area: 'Offset',
    plannedHours: 27.4,
    availableHours: 12.6,
    weeklyCapacityHours: 40.0,
    utilizationPercent: 69,
    status: 'Normal',
    activeOpFolio: 'OP-2026-95325',
  },
  {
    id: 'maq-cap-4',
    name: 'Stahl TH-82 (Plegadora 2)',
    area: 'Acabados',
    plannedHours: 35.2,
    availableHours: 4.8,
    weeklyCapacityHours: 40.0,
    utilizationPercent: 88,
    status: 'Atención',
    activeOpFolio: 'OP-2026-95318',
    stopReason: 'Cola acumulada de 3 órdenes en espera',
  },
  {
    id: 'maq-cap-5',
    name: 'Muller Martini Presto II',
    area: 'Acabados',
    plannedHours: 24.1,
    availableHours: 15.9,
    weeklyCapacityHours: 40.0,
    utilizationPercent: 60,
    status: 'Normal',
    activeOpFolio: 'OP-2026-95310',
  },
];

// ------------------------------------------------------------------
// RIESGO DE ENTREGA (Sección 9 del MD)
// Cada orden con fecha RTM, fecha cliente y causa raíz concreta
// ------------------------------------------------------------------
export const DELIVERY_RISK_ORDERS_V8: DeliveryRiskItem[] = [
  {
    id: 'risk-1',
    opFolio: 'OP-2026-95321',
    client: 'TYCO Electronics',
    partNumber: 'IS-2420 | Rev I-01',
    rtmDueDate: '08 Sep',
    clientDueDate: '09 Sep',
    estimatedDeliveryDate: '10 Sep (+1 día)',
    riskLevel: 'Crítico',
    cause: 'Mark Andy 830 saturada (96%) + 2.3 h de atraso acumulado',
    area: 'Flexografía',
    machine: 'Mark Andy 830 10"',
  },
  {
    id: 'risk-2',
    opFolio: 'OP-2026-95362',
    client: 'Panasonic Industrial',
    partNumber: '526412 | Rev G',
    rtmDueDate: '11 Sep',
    clientDueDate: '12 Sep',
    estimatedDeliveryDate: '13 Sep (+1 día)',
    riskLevel: 'Alto',
    cause: 'Bobina BOPP 10" pendiente de surtir en andén por almacén',
    area: 'Flexografía',
    machine: 'Mark Andy Scout 10”',
  },
  {
    id: 'risk-3',
    opFolio: 'OP-2026-95351',
    client: 'FRESENIUS Medical',
    partNumber: 'ET-MED-992 | Rev C',
    rtmDueDate: '10 Sep',
    clientDueDate: '11 Sep',
    estimatedDeliveryDate: '11 Sep (En límite)',
    riskLevel: 'Medio',
    cause: 'Merma acumulada 4.6% requiere autorización de bobina extra',
    area: 'Flexografía',
    machine: 'Allied Gear',
  },
  {
    id: 'risk-4',
    opFolio: 'OP-2026-95344',
    client: 'BLACK & DECKER',
    partNumber: 'NA472050 | Rev 08/23',
    rtmDueDate: '09 Sep',
    clientDueDate: '10 Sep',
    estimatedDeliveryDate: '09 Sep (A tiempo)',
    riskLevel: 'Bajo',
    cause: 'Operación de doblado en cola en Plegadora Stahl TH-82',
    area: 'Offset',
    machine: 'Heidelberg XL 75',
  },
];

// ------------------------------------------------------------------
// ACTION CENTER · REQUIERE TU ATENCIÓN (Sección 10 del MD)
// Priorizado por severidad de impacto
// ------------------------------------------------------------------
export const ACTION_CENTER_ITEMS_V8: ActionCenterItem[] = [
  {
    id: 'act-1',
    title: 'OP-2026-95321 · TYCO Electronics',
    subtitle: 'Fecha de entrega comprometida con cliente (+1 día estimado)',
    severity: 'red',
    impactDescription: 'Atraso de 2.3 h en Mark Andy 830 compromete entrega del 09 Sep.',
    actionPrimary: { label: 'Reprogramar', action: 'reprogram' },
    actionSecondary: { label: 'Abrir OP', action: 'open_op' },
    targetOpFolio: 'OP-2026-95321',
  },
  {
    id: 'act-2',
    title: 'Mark Andy 830 10" · Máquina Detenida',
    subtitle: 'Detenida 47 min por problema mecánico de ajuste',
    severity: 'red',
    impactDescription: 'Paro técnico no programado impacta a 3 órdenes en cola.',
    actionPrimary: { label: 'Ver impacto', action: 'view_impact' },
    targetMachine: 'Mark Andy 830 10"',
  },
  {
    id: 'act-3',
    title: 'OP-2026-95333 · FRESENIUS Medical',
    subtitle: 'Solicitud de +1,000 ft de sustrato BOPP (Merma 4.6%)',
    severity: 'amber',
    impactDescription: 'Merma acumulada cerca del límite estándar (5.0%).',
    actionPrimary: { label: 'Revisar merma', action: 'review_scrap' },
    actionSecondary: { label: 'Abrir OP', action: 'open_op' },
    targetOpFolio: 'OP-2026-95333',
  },
  {
    id: 'act-4',
    title: 'OP-2026-95342 · BLACK & DECKER',
    subtitle: 'Material por surtir para arranque programado mañana 07:30',
    severity: 'amber',
    impactDescription: 'Pliegos Bond 75g y placas CTP pendientes en estación.',
    actionPrimary: { label: 'Ver surtido', action: 'view_supply' },
    targetOpFolio: 'OP-2026-95342',
  },
];

// ------------------------------------------------------------------
// TRÁFICO DE PLANTA / WIP DETALLE (Sección 6 del MD)
// Offset: Impresión -> Guillotina -> Doblado -> Intercalado -> Grapado -> Empaque
// Flexo: Prensa Flexo (inline) -> Rebobinado/Inspección -> Empaque
// ------------------------------------------------------------------
export const PLANT_TRAFFIC_NODES_V8: Record<string, TrafficNodeDetail> = {
  // OFFSET NODES
  'offset-impresion': {
    id: 'offset-impresion',
    stageName: 'Impresión Offset',
    area: 'Offset',
    activeMachine: 'Heidelberg Speedmaster XL 75',
    currentOpFolio: 'OP-2026-95318',
    client: 'BLACK & DECKER',
    partNumber: 'NA472050 (Manual 64p)',
    startTime: '08:15',
    estimatedEndTime: '10:45',
    progressPercent: 78,
    standardMinutes: 150,
    actualEstimatedMinutes: 150,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95325', client: 'Pentair', quantity: 15000, priority: 'Normal' },
      { folio: 'OP-2026-95330', client: 'Truper', quantity: 8000, priority: 'Normal' },
      { folio: 'OP-2026-95335', client: 'Black & Decker', quantity: 12000, priority: 'Alta' },
    ],
    remainingCapacityToday: '2h 15m',
    totalOpsInStage: 4,
    isStopped: false,
    hasQueueAlert: false,
  },
  'offset-corte': {
    id: 'offset-corte',
    stageName: 'Guillotina / Corte',
    area: 'Offset',
    activeMachine: 'Guillotina Polar 115',
    currentOpFolio: 'OP-2026-95325',
    client: 'Pentair',
    partNumber: 'A163833BHA (Folleto)',
    startTime: '09:00',
    estimatedEndTime: '10:15',
    progressPercent: 55,
    standardMinutes: 75,
    actualEstimatedMinutes: 80,
    deviationMinutes: +5,
    queueOrders: [
      { folio: 'OP-2026-95318', client: 'BLACK & DECKER', quantity: 20000, priority: 'Alta' },
      { folio: 'OP-2026-95340', client: 'Truper', quantity: 10000, priority: 'Normal' },
    ],
    remainingCapacityToday: '3h 30m',
    totalOpsInStage: 3,
    isStopped: false,
    hasQueueAlert: false,
  },
  'offset-doblado': {
    id: 'offset-doblado',
    stageName: 'Doblado',
    area: 'Offset',
    activeMachine: 'Plegadora Stahl TH-82',
    currentOpFolio: 'OP-2026-95318',
    client: 'BLACK & DECKER',
    partNumber: 'NA472050 (Forma 16p)',
    startTime: '09:14',
    estimatedEndTime: '11:32',
    progressPercent: 68,
    standardMinutes: 85,
    actualEstimatedMinutes: 102,
    deviationMinutes: +17, // Desviación en curso
    queueOrders: [
      { folio: 'OP-2026-95324', client: 'BLACK & DECKER', quantity: 15000, priority: 'Alta' },
      { folio: 'OP-2026-95331', client: 'Pentair', quantity: 12000, priority: 'Normal' },
      { folio: 'OP-2026-95337', client: 'Truper', quantity: 9500, priority: 'Normal' },
      { folio: 'OP-2026-95342', client: 'BLACK & DECKER', quantity: 22000, priority: 'Alta' },
    ],
    remainingCapacityToday: '1h 42m',
    totalOpsInStage: 5,
    isStopped: false,
    hasQueueAlert: true, // ⚠ Cola acumulada
  },
  'offset-intercalado': {
    id: 'offset-intercalado',
    stageName: 'Intercalado',
    area: 'Offset',
    activeMachine: 'Alzadora Automática 12 Estaciones',
    currentOpFolio: 'OP-2026-95310',
    client: 'Truper',
    partNumber: 'CAT-2026 (64p)',
    startTime: '09:30',
    estimatedEndTime: '11:00',
    progressPercent: 40,
    standardMinutes: 90,
    actualEstimatedMinutes: 90,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95318', client: 'BLACK & DECKER', quantity: 20000, priority: 'Alta' },
    ],
    remainingCapacityToday: '4h 00m',
    totalOpsInStage: 2,
    isStopped: false,
    hasQueueAlert: false,
  },
  'offset-grapado': {
    id: 'offset-grapado',
    stageName: 'Grapado al lomo',
    area: 'Offset',
    activeMachine: 'Muller Martini Presto II',
    currentOpFolio: 'OP-2026-95310',
    client: 'Truper',
    partNumber: 'CAT-2026 (Manual)',
    startTime: '10:00',
    estimatedEndTime: '11:45',
    progressPercent: 30,
    standardMinutes: 105,
    actualEstimatedMinutes: 105,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95315', client: 'Truper', quantity: 14000, priority: 'Normal' },
      { folio: 'OP-2026-95322', client: 'BLACK & DECKER', quantity: 18000, priority: 'Alta' },
    ],
    remainingCapacityToday: '3h 15m',
    totalOpsInStage: 3,
    isStopped: false,
    hasQueueAlert: false,
  },
  'offset-empaque': {
    id: 'offset-empaque',
    stageName: 'Empaque & Liberación Final',
    area: 'Offset',
    activeMachine: 'Mesa de Empaque y Paletizado',
    currentOpFolio: 'OP-2026-95308',
    client: 'Pentair',
    partNumber: 'MAN-PENT-01',
    startTime: '08:30',
    estimatedEndTime: '10:00',
    progressPercent: 90,
    standardMinutes: 90,
    actualEstimatedMinutes: 90,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95310', client: 'Truper', quantity: 10000, priority: 'Normal' },
    ],
    remainingCapacityToday: '5h 00m',
    totalOpsInStage: 2,
    isStopped: false,
    hasQueueAlert: false,
  },

  // FLEXO NODES
  'flexo-prensa': {
    id: 'flexo-prensa',
    stageName: 'Prensa Flexo (En Línea)',
    area: 'Flexografía',
    activeMachine: 'Mark Andy 830 10"',
    currentOpFolio: 'OP-2026-95321',
    client: 'TYCO Electronics',
    partNumber: 'IS-2420 (Etiqueta Poliéster)',
    startTime: '08:30',
    estimatedEndTime: '12:15',
    progressPercent: 42,
    standardMinutes: 180,
    actualEstimatedMinutes: 227,
    deviationMinutes: +47, // Paro mecánico 47 min
    queueOrders: [
      { folio: 'OP-2026-95328', client: 'Panasonic', quantity: 25000, priority: 'Alta' },
      { folio: 'OP-2026-95333', client: 'FRESENIUS', quantity: 30000, priority: 'Media' },
      { folio: 'OP-2026-95345', client: 'TYCO', quantity: 18000, priority: 'Alta' },
      { folio: 'OP-2026-95350', client: 'Panasonic', quantity: 20000, priority: 'Normal' },
    ],
    remainingCapacityToday: '0h 45m',
    totalOpsInStage: 5,
    isStopped: true, // 🔴 Máquina detenida 47 min
    hasQueueAlert: true,
  },
  'flexo-rebobinado': {
    id: 'flexo-rebobinado',
    stageName: 'Rebobinado / Inspección',
    area: 'Flexografía',
    activeMachine: 'Rotoflex I / BGM 2',
    currentOpFolio: 'OP-2026-95319',
    client: 'Panasonic Industrial',
    partNumber: '526412 | G | (Rollos 1,000 pz)',
    startTime: '09:15',
    estimatedEndTime: '10:45',
    progressPercent: 60,
    standardMinutes: 90,
    actualEstimatedMinutes: 90,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95320', client: 'Truper', quantity: 15000, priority: 'Normal' },
      { folio: 'OP-2026-95321', client: 'TYCO', quantity: 22000, priority: 'Alta' },
    ],
    remainingCapacityToday: '3h 45m',
    totalOpsInStage: 3,
    isStopped: false,
    hasQueueAlert: false,
  },
  'flexo-empaque': {
    id: 'flexo-empaque',
    stageName: 'Empaque de Rollos',
    area: 'Flexografía',
    activeMachine: 'Mesa de Empaque Etiqueta Zebra',
    currentOpFolio: 'OP-2026-95315',
    client: 'Truper',
    partNumber: 'ET-TRU-88',
    startTime: '09:00',
    estimatedEndTime: '10:30',
    progressPercent: 85,
    standardMinutes: 90,
    actualEstimatedMinutes: 90,
    deviationMinutes: 0,
    queueOrders: [
      { folio: 'OP-2026-95319', client: 'Panasonic', quantity: 25000, priority: 'Normal' },
    ],
    remainingCapacityToday: '4h 30m',
    totalOpsInStage: 2,
    isStopped: false,
    hasQueueAlert: false,
  },
};

// ------------------------------------------------------------------
// DESEMPEÑO CONTRA ESTÁNDAR (Sección 13 del MD · Catálogos V6)
// ------------------------------------------------------------------
export const STANDARD_VS_ACTUAL_METRICS_V8: StandardVsActualMetric[] = [
  {
    id: 'sva-1',
    machineOrProcess: 'Mark Andy Scout 10"',
    area: 'Flexografía',
    standardSpeed: '9,000 ft/h',
    actualSpeed: '7,840 ft/h',
    efficiencyPercent: 87,
    trend: 'down',
    sampleType: 'ft/h',
    operationName: 'Tirada flexo 4 tintas UV',
  },
  {
    id: 'sva-2',
    machineOrProcess: 'DiDDE 860',
    area: 'Offset',
    standardSpeed: '8,500 pliegos/h',
    actualSpeed: '8,190 pliegos/h',
    efficiencyPercent: 96,
    trend: 'stable',
    sampleType: 'pliegos/h',
    operationName: 'Impresión forma continua',
  },
  {
    id: 'sva-3',
    machineOrProcess: 'Plegadora Stahl TH-82',
    area: 'Acabados',
    standardSpeed: '3,500 pliegos/h',
    actualSpeed: '3,020 pliegos/h',
    efficiencyPercent: 86,
    trend: 'down',
    sampleType: 'pliegos/h',
    operationName: 'Doblado 16 páginas al lomo',
  },
  {
    id: 'sva-4',
    machineOrProcess: 'Muller Martini Presto II',
    area: 'Acabados',
    standardSpeed: '3,500 folletos/h',
    actualSpeed: '3,620 folletos/h',
    efficiencyPercent: 103,
    trend: 'up',
    sampleType: 'pliegos/h',
    operationName: 'Grapado y refile trilateral',
  },
  {
    id: 'sva-5',
    machineOrProcess: 'Setup Prensa Flexo (Mark Andy 830)',
    area: 'Flexografía',
    standardSpeed: '30 min',
    actualSpeed: '44 min (+14 min)',
    efficiencyPercent: 68,
    trend: 'down',
    sampleType: 'min',
    operationName: 'Montaje de grabado y ajuste de suaje',
    standardMinutes: 30,
    actualMinutes: 44,
    deviationMinutes: +14,
  },
  {
    id: 'sva-6',
    machineOrProcess: 'Corrida Doblado (Stahl 2)',
    area: 'Acabados',
    standardSpeed: '180 min',
    actualSpeed: '211 min (+31 min)',
    efficiencyPercent: 85,
    trend: 'down',
    sampleType: 'min',
    operationName: 'Tiro de 20,000 folletos 64 páginas',
    standardMinutes: 180,
    actualMinutes: 211,
    deviationMinutes: +31,
  },
];

// ------------------------------------------------------------------
// TRABAJOS COMPLETADOS (Sección 14 del MD)
// ------------------------------------------------------------------
export const COMPLETED_JOBS_SUMMARY_V8 = {
  today: {
    completedOpsCount: 12,
    goodUnitsProduced: 184250,
  },
  week: {
    completedOpsCount: 52,
    onTimePercent: 91,
    delayedCount: 6,
    aheadCount: 3,
  },
};

// ------------------------------------------------------------------
// ARRANQUES PRÓXIMAS 24 H (Sección 15 del MD)
// ------------------------------------------------------------------
export const NEXT_STARTS_SUMMARY_V8 = {
  scheduledTotal: 9,
  materialReady: 7,
  materialPending: 2,
  toolingPending: 1,
  items: [
    { opFolio: 'OP-2026-95342', client: 'BLACK & DECKER', machine: 'Heidelberg XL 75', startTime: 'Mañana 07:30', status: 'Material por surtir', statusTone: 'amber' as const },
    { opFolio: 'OP-2026-95345', client: 'TYCO Electronics', machine: 'Mark Andy Scout', startTime: 'Mañana 08:00', status: 'Listo para producir', statusTone: 'emerald' as const },
    { opFolio: 'OP-2026-95348', client: 'Panasonic', machine: 'Rotoflex I', startTime: 'Mañana 08:30', status: 'Listo para producir', statusTone: 'emerald' as const },
    { opFolio: 'OP-2026-95350', client: 'Truper', machine: 'DiDDE 860', startTime: 'Mañana 09:00', status: 'Herramental pendiente', statusTone: 'amber' as const },
  ],
};
