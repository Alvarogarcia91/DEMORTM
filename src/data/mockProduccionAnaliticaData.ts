// ============================================================================
// MODELO DE DATOS Y MOCKS V10 — ANALÍTICA DE PRODUCCIÓN E INTELIGENCIA OPERATIVA
// ============================================================================

export type ProductionPeriod =
  | 'Hoy'
  | '7 días'
  | '30 días'
  | '90 días'
  | 'Mes actual'
  | 'Q3 2026';

export type ProductionAnalyticsArea = 'Todas' | 'Offset' | 'Flexografía' | 'Acabados';

export type ProductionAnalyticsShift = 'Todos' | 'Turno A' | 'Turno B' | 'Turno C';

export type ProductionAnalyticsSubView = 'Resumen' | 'Máquinas' | 'Operadores' | 'Scrap y paros';

// ----------------------------------------------------------------------------
// 1. KPIS GLOBALES
// ----------------------------------------------------------------------------
export interface GlobalAnalyticsKpis {
  planCompliance: number; // 91.8%
  planComplianceDelta: number; // +3.1 pts
  productiveEfficiency: number; // 89.4%
  productiveEfficiencyDelta: number; // +1.7 pts
  scrapRate: number; // 3.4%
  scrapRateDelta: number; // -0.6 pts
  scrapTarget: number; // 5.0%
  lostTimeFormatted: string; // 18h 42m
  lostTimeDeltaFormatted: string; // -2h 14m
  lostTimeIncidents: number; // 31 incidencias
  onTimeOpsRate: number; // 88%
  onTimeOpsCount: number; // 44
  totalOpsCount: number; // 50
  onTimeOpsDelta: number; // +4 pts
  setupVariationRate: number; // +7.8%
  setupAvgMinutesOver: number; // 12 min
}

// ----------------------------------------------------------------------------
// 2. SUGERENCIAS DEL SISTEMA (SMART - ACENTO MORADO ERP NEXORA)
// ----------------------------------------------------------------------------
export interface ProductionSmartSuggestion {
  id: string;
  category: 'machine' | 'efficiency' | 'sequence' | 'scrap' | 'operator' | 'setup';
  title: string;
  reason: string;
  impactNote: string;
  primaryActionLabel: string;
  primaryActionTarget: 'maquinas' | 'planeacion' | 'scrap' | 'operador' | 'orden';
  primaryActionPayload?: string;
  secondaryActionLabel?: string;
}

// ----------------------------------------------------------------------------
// 3. PLAN VS REAL TENDENCIA
// ----------------------------------------------------------------------------
export interface PlanVsActualPoint {
  label: string; // e.g. "Semana 1", "Semana 2", etc.
  planned: number; // unidades
  actual: number; // unidades
  compliancePercent: number;
}

export interface PlanVsActualDataset {
  area: ProductionAnalyticsArea;
  totalPlanned: number;
  totalActual: number;
  compliancePercent: number;
  points: PlanVsActualPoint[];
}

// ----------------------------------------------------------------------------
// 4. MÁQUINAS: HORAS PRODUCTIVAS Y EFICIENCIA
// ----------------------------------------------------------------------------
export interface MachineProductiveHours {
  id: string;
  machineName: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  productiveHours: number;
  totalAvailableHours: number;
  utilizationPercent: number;
}

export interface MachineEfficiencyItem {
  id: string;
  machineName: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  standardSpeed: string; // e.g. "9,000 ft/h"
  realSpeed: string; // e.g. "8,240 ft/h"
  efficiencyPercent: number; // e.g. 91.6%
  status: 'saludable' | 'atencion' | 'critico';
  isDemoConfigurable: boolean;
}

// ----------------------------------------------------------------------------
// 5. PAROS Y DOWNTIME POR MÁQUINA
// ----------------------------------------------------------------------------
export interface MachineDowntimeSummary {
  id: string;
  machineName: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  totalDowntimeMinutes: number;
  stopsCount: number;
  avgDurationMinutes: number;
  mainCauses: { cause: string; minutes: number; category4M: string }[];
  affectedOps: string[];
}

export interface DowntimeCauseItem {
  cause: string;
  minutes: number;
  percentage: number;
  code: string;
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
}

// ----------------------------------------------------------------------------
// 6. SCRAP / MERMA COMPLETO
// ----------------------------------------------------------------------------
export interface ScrapWeeklyTrendPoint {
  period: string; // "S1", "S2", "S3", "S4"
  rate: number; // 4.0, 4.4, 3.7, 3.4
  target: number; // 5.0
}

export interface ScrapByProcessItem {
  process: string;
  rate: number;
  volumeUnits: number;
  costMxn: number;
}

export interface ScrapCauseItem {
  cause: string;
  percentage: number;
  category4M: 'Máquina' | 'Material' | 'Mano de obra' | 'Método';
}

export interface TopScrapOpItem {
  opFolio: string;
  client: string;
  partNumber: string;
  scrapUnits: number;
  scrapPercent: number;
  alertLevel: 'critico' | 'atencion' | 'normal';
  mainReason: string;
}

// ----------------------------------------------------------------------------
// 7. SETUP ESTÁNDAR VS REAL
// ----------------------------------------------------------------------------
export interface SetupComparisonItem {
  processFamily: string;
  standardMinutes: number;
  realMinutes: number;
  variationPercent: number;
  samplesCount: number;
  trend: 'arriba' | 'abajo' | 'estable';
}

// ----------------------------------------------------------------------------
// 8. DESEMPEÑO POR OPERADOR Y DISTRIBUCIÓN DE TIEMPO
// ----------------------------------------------------------------------------
export interface OperatorPerformanceItem {
  id: string;
  name: string;
  employeeNo: string;
  primaryMachine: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  efficiencyPercent: number;
  scrapPercent: number;
  productiveTimePercent: number;
  shiftsCount: number;
  completedOps: number;
  setupVsStdMinutes: number;
  reportedStopsCount: number;
  contextNotes: string;
}

export interface OperatorTimeDistributionItem {
  concept: string;
  percentage: number;
  hours: number;
  colorClass: string;
}

// ----------------------------------------------------------------------------
// 9. CLIENTES Y CAPACIDAD CONSUMIDA
// ----------------------------------------------------------------------------
export interface ClientCapacityItem {
  client: string;
  plantHours: number;
  producedVolume: number;
  opsCount: number;
  percentOfTotalCapacity: number;
}

// ----------------------------------------------------------------------------
// 10. LEAD TIME Y CUMPLIMIENTO DE ENTREGA
// ----------------------------------------------------------------------------
export interface DeliveryComplianceSummary {
  onTimePercent: number;
  onTimeOpsCount: number;
  oneDayLateCount: number;
  twoToThreeDaysLateCount: number;
  moreThanThreeDaysLateCount: number;
}

export interface DelayedOpItem {
  opFolio: string;
  client: string;
  partNumber: string;
  promisedDate: string;
  targetRtmDate: string;
  actualDate: string;
  deviationDays: number;
  causes: { description: string; impact: string }[];
}

// ----------------------------------------------------------------------------
// 11. HEATMAP MÁQUINA X DÍA
// ----------------------------------------------------------------------------
export interface MachineDayPerformanceRow {
  machineName: string;
  area: 'Flexografía' | 'Offset' | 'Acabados';
  days: {
    day: 'LUN' | 'MAR' | 'MIÉ' | 'JUE' | 'VIE';
    efficiencyPercent: number;
    status: 'verde' | 'ambar' | 'rojo';
  }[];
}

// ----------------------------------------------------------------------------
// 12. PARETO 4M + TENDENCIA SEMANAL
// ----------------------------------------------------------------------------
export interface Pareto4MSummary {
  category: 'Material' | 'Máquina' | 'Método' | 'Mano de obra';
  percentage: number;
  minutes: number;
  weeklyTrend: number[]; // [S1, S2, S3, S4]
}

// ============================================================================
// DATASET COMPLETO ANALÍTICA (30 DÍAS CANÓNICO)
// ============================================================================

export interface ProductionAnalyticsDataset {
  period: ProductionPeriod;
  kpis: GlobalAnalyticsKpis;
  smartSuggestions: ProductionSmartSuggestion[];
  planVsActual: Record<ProductionAnalyticsArea, PlanVsActualDataset>;
  topProductiveMachines: MachineProductiveHours[];
  machineEfficiency: MachineEfficiencyItem[];
  machineDowntime: MachineDowntimeSummary[];
  downtimeCauses: DowntimeCauseItem[];
  scrapWeeklyTrend: ScrapWeeklyTrendPoint[];
  scrapByProcess: ScrapByProcessItem[];
  scrapCauses: ScrapCauseItem[];
  topScrapOps: TopScrapOpItem[];
  setupComparison: SetupComparisonItem[];
  operatorPerformance: OperatorPerformanceItem[];
  operatorTimeDistribution: OperatorTimeDistributionItem[];
  clientCapacity: ClientCapacityItem[];
  deliveryCompliance: DeliveryComplianceSummary;
  topDelayedOps: DelayedOpItem[];
  machineHeatmap: MachineDayPerformanceRow[];
  pareto4M: Pareto4MSummary[];
}

export const MOCK_PRODUCTION_ANALYTICS_30D: ProductionAnalyticsDataset = {
  period: '30 días',
  kpis: {
    planCompliance: 91.8,
    planComplianceDelta: 3.1,
    productiveEfficiency: 89.4,
    productiveEfficiencyDelta: 1.7,
    scrapRate: 3.4,
    scrapRateDelta: -0.6,
    scrapTarget: 5.0,
    lostTimeFormatted: '18h 42m',
    lostTimeDeltaFormatted: '-2h 14m',
    lostTimeIncidents: 31,
    onTimeOpsRate: 88.0,
    onTimeOpsCount: 44,
    totalOpsCount: 50,
    onTimeOpsDelta: 4.0,
    setupVariationRate: 7.8,
    setupAvgMinutesOver: 12,
  },
  smartSuggestions: [
    {
      id: 'sug-prod-01',
      category: 'machine',
      title: 'Mark Andy 830 concentra 31% de los minutos perdidos del periodo',
      reason: 'Se detectaron 9 eventos de paro acumulando 268 min. Principal causa raíz identificada: ajustes reiterados de registro micrométrico en cilindro 3.',
      impactNote: 'Ajustar la holgura de tensión de desbobinador evitaría ~140 min/mes.',
      primaryActionLabel: 'Analizar máquina',
      primaryActionTarget: 'maquinas',
      primaryActionPayload: 'Mark Andy 830',
      secondaryActionLabel: 'Ver paros',
    },
    {
      id: 'sug-prod-02',
      category: 'efficiency',
      title: 'Stahl 2 lleva 3 turnos consecutivos debajo del estándar',
      reason: 'Velocidad real de 3,020 pliegos/h frente a estándar configurado de 3,500/h (86.3% eficiencia). Atascos intermitentes en doblez cruzado.',
      impactNote: 'Calibrar rodillos de plegado recuperaría ~480 pliegos/hora.',
      primaryActionLabel: 'Ver desempeño',
      primaryActionTarget: 'maquinas',
      primaryActionPayload: 'Stahl 2',
      secondaryActionLabel: 'Solicitar Mtto',
    },
    {
      id: 'sug-prod-03',
      category: 'sequence',
      title: 'OP Fresenius 95321 y 95329 comparten sustrato y troquel',
      reason: 'Ambas órdenes están programadas en días separados. Emplean BoPP blanco 60# y troquel magnético de 4 cavidades.',
      impactNote: 'Agruparlas consecutivamente en cola ahorraría ~35 min de preparación (Demo configurable).',
      primaryActionLabel: 'Ver secuencia',
      primaryActionTarget: 'planeacion',
      primaryActionPayload: 'OP-95321',
      secondaryActionLabel: 'Agrupar OPs',
    },
    {
      id: 'sug-prod-04',
      category: 'scrap',
      title: 'Scrap Flexo subió de 3.2% a 4.4% en las últimas 3 semanas',
      reason: 'La mayor contribución proviene de descalce al acelerar y desprendimiento de liner en arranques de tiraje.',
      impactNote: 'Inspección de tensión previa en rebobinador reduciría la merma en 1.1 pts.',
      primaryActionLabel: 'Analizar scrap',
      primaryActionTarget: 'scrap',
      secondaryActionLabel: 'Ver Pareto',
    },
    {
      id: 'sug-prod-05',
      category: 'operator',
      title: 'Alerta de contexto: Aumento de scrap coincide con uso del suaje #TR-402',
      reason: '3 OPs con merma elevada coincidieron con el mismo herramental de troquelado. Antes de atribuirlo al operador de turno, validar desgaste de cuchillas.',
      impactNote: 'Previene reportes punitivos infundados en piso y acelera el diagnóstico de herramental.',
      primaryActionLabel: 'Ver herramental',
      primaryActionTarget: 'maquinas',
      primaryActionPayload: 'TR-402',
      secondaryActionLabel: 'Descartar',
    },
  ],
  planVsActual: {
    Todas: {
      area: 'Todas',
      totalPlanned: 1245000,
      totalActual: 1143000,
      compliancePercent: 91.8,
      points: [
        { label: 'Semana 1', planned: 290000, actual: 278000, compliancePercent: 95.8 },
        { label: 'Semana 2', planned: 315000, actual: 286000, compliancePercent: 90.7 },
        { label: 'Semana 3', planned: 310000, actual: 282000, compliancePercent: 90.9 },
        { label: 'Semana 4', planned: 330000, actual: 297000, compliancePercent: 90.0 },
      ],
    },
    Offset: {
      area: 'Offset',
      totalPlanned: 420000,
      totalActual: 395000,
      compliancePercent: 94.0,
      points: [
        { label: 'Semana 1', planned: 100000, actual: 97000, compliancePercent: 97.0 },
        { label: 'Semana 2', planned: 105000, actual: 98000, compliancePercent: 93.3 },
        { label: 'Semana 3', planned: 105000, actual: 99000, compliancePercent: 94.2 },
        { label: 'Semana 4', planned: 110000, actual: 101000, compliancePercent: 91.8 },
      ],
    },
    Flexografía: {
      area: 'Flexografía',
      totalPlanned: 545000,
      totalActual: 492000,
      compliancePercent: 90.2,
      points: [
        { label: 'Semana 1', planned: 130000, actual: 122000, compliancePercent: 93.8 },
        { label: 'Semana 2', planned: 140000, actual: 124000, compliancePercent: 88.5 },
        { label: 'Semana 3', planned: 135000, actual: 121000, compliancePercent: 89.6 },
        { label: 'Semana 4', planned: 140000, actual: 125000, compliancePercent: 89.2 },
      ],
    },
    Acabados: {
      area: 'Acabados',
      totalPlanned: 280000,
      totalActual: 256000,
      compliancePercent: 91.4,
      points: [
        { label: 'Semana 1', planned: 60000, actual: 59000, compliancePercent: 98.3 },
        { label: 'Semana 2', planned: 70000, actual: 64000, compliancePercent: 91.4 },
        { label: 'Semana 3', planned: 70000, actual: 62000, compliancePercent: 88.5 },
        { label: 'Semana 4', planned: 80000, actual: 71000, compliancePercent: 88.7 },
      ],
    },
  },
  topProductiveMachines: [
    {
      id: 'maq-scout',
      machineName: 'Mark Andy Scout 10”',
      area: 'Flexografía',
      productiveHours: 176.4,
      totalAvailableHours: 192.0,
      utilizationPercent: 91.8,
    },
    {
      id: 'maq-heidelberg',
      machineName: 'Heidelberg SM 74',
      area: 'Offset',
      productiveHours: 164.8,
      totalAvailableHours: 192.0,
      utilizationPercent: 85.8,
    },
    {
      id: 'maq-didde',
      machineName: 'DiDDE 860',
      area: 'Offset',
      productiveHours: 148.2,
      totalAvailableHours: 192.0,
      utilizationPercent: 77.1,
    },
    {
      id: 'maq-stahl',
      machineName: 'Stahl 2',
      area: 'Acabados',
      productiveHours: 132.7,
      totalAvailableHours: 192.0,
      utilizationPercent: 69.1,
    },
    {
      id: 'maq-muller',
      machineName: 'Muller Martini',
      area: 'Acabados',
      productiveHours: 118.1,
      totalAvailableHours: 192.0,
      utilizationPercent: 61.5,
    },
  ],
  machineEfficiency: [
    {
      id: 'eff-1',
      machineName: 'Mark Andy Scout 10”',
      area: 'Flexografía',
      standardSpeed: '9,000 ft/h',
      realSpeed: '8,240 ft/h',
      efficiencyPercent: 91.6,
      status: 'atencion',
      isDemoConfigurable: true,
    },
    {
      id: 'eff-2',
      machineName: 'Heidelberg SM 74',
      area: 'Offset',
      standardSpeed: '3,500 pl/h',
      realSpeed: '3,380 pl/h',
      efficiencyPercent: 96.6,
      status: 'saludable',
      isDemoConfigurable: true,
    },
    {
      id: 'eff-3',
      machineName: 'DiDDE 860',
      area: 'Offset',
      standardSpeed: '8,500 pl/h',
      realSpeed: '8,190 pl/h',
      efficiencyPercent: 96.4,
      status: 'saludable',
      isDemoConfigurable: true,
    },
    {
      id: 'eff-4',
      machineName: 'Stahl 2',
      area: 'Acabados',
      standardSpeed: '3,500 pl/h',
      realSpeed: '3,020 pl/h',
      efficiencyPercent: 86.3,
      status: 'atencion',
      isDemoConfigurable: true,
    },
    {
      id: 'eff-5',
      machineName: 'Muller Martini',
      area: 'Acabados',
      standardSpeed: '3,500 ejs/h',
      realSpeed: '3,620 ejs/h',
      efficiencyPercent: 103.4,
      status: 'saludable',
      isDemoConfigurable: true,
    },
  ],
  machineDowntime: [
    {
      id: 'dt-1',
      machineName: 'Mark Andy 830',
      area: 'Flexografía',
      totalDowntimeMinutes: 268,
      stopsCount: 9,
      avgDurationMinutes: 29.8,
      mainCauses: [
        { cause: 'Ajuste de registro fino', minutes: 120, category4M: 'Método' },
        { cause: 'Cambio de suaje rotativo', minutes: 84, category4M: 'Método' },
        { cause: 'Atasco en sensor de tensión', minutes: 64, category4M: 'Máquina' },
      ],
      affectedOps: ['OP-95321', 'OP-95326', 'OP-95341'],
    },
    {
      id: 'dt-2',
      machineName: 'Stahl 2',
      area: 'Acabados',
      totalDowntimeMinutes: 174,
      stopsCount: 7,
      avgDurationMinutes: 24.9,
      mainCauses: [
        { cause: 'Atasco en doblez cruzado', minutes: 95, category4M: 'Máquina' },
        { cause: 'Espera de pliegos impresos', minutes: 45, category4M: 'Material' },
        { cause: 'Ajuste de guías laterales', minutes: 34, category4M: 'Método' },
      ],
      affectedOps: ['OP-95345', 'OP-95348'],
    },
    {
      id: 'dt-3',
      machineName: 'Heidelberg SM 74',
      area: 'Offset',
      totalDowntimeMinutes: 112,
      stopsCount: 4,
      avgDurationMinutes: 28.0,
      mainCauses: [
        { cause: 'Entonación y ajuste de tinta', minutes: 62, category4M: 'Método' },
        { cause: 'Lavado preventivo de mantillas', minutes: 50, category4M: 'Máquina' },
      ],
      affectedOps: ['OP-95344', 'OP-95340'],
    },
    {
      id: 'dt-4',
      machineName: 'DiDDE 860',
      area: 'Offset',
      totalDowntimeMinutes: 81,
      stopsCount: 3,
      avgDurationMinutes: 27.0,
      mainCauses: [
        { cause: 'Cambio de bobina offset', minutes: 52, category4M: 'Material' },
        { cause: 'Ajuste de corte', minutes: 29, category4M: 'Método' },
      ],
      affectedOps: ['OP-95337'],
    },
    {
      id: 'dt-5',
      machineName: 'Muller Martini',
      area: 'Acabados',
      totalDowntimeMinutes: 49,
      stopsCount: 2,
      avgDurationMinutes: 24.5,
      mainCauses: [
        { cause: 'Atasco de grapas', minutes: 31, category4M: 'Máquina' },
        { cause: 'Reabastecimiento de alambre', minutes: 18, category4M: 'Material' },
      ],
      affectedOps: ['OP-95350'],
    },
  ],
  downtimeCauses: [
    { cause: 'Ajuste de registro', minutes: 184, percentage: 27.2, code: '200', category4M: 'Método' },
    { cause: 'Material no surtido', minutes: 146, percentage: 21.6, code: '300', category4M: 'Material' },
    { cause: 'Problema mecánico', minutes: 121, percentage: 17.9, code: '200', category4M: 'Máquina' },
    { cause: 'Cambio de herramental', minutes: 83, percentage: 12.3, code: '100', category4M: 'Método' },
    { cause: 'Esperando Calidad (liberación QA)', minutes: 51, percentage: 7.5, code: '400', category4M: 'Método' },
    { cause: 'No hay trabajo / transición', minutes: 42, percentage: 6.2, code: '400', category4M: 'Método' },
    { cause: 'Otras incidencias menores', minutes: 49, percentage: 7.3, code: '100', category4M: 'Mano de obra' },
  ],
  scrapWeeklyTrend: [
    { period: 'Semana 1', rate: 4.0, target: 5.0 },
    { period: 'Semana 2', rate: 4.4, target: 5.0 },
    { period: 'Semana 3', rate: 3.7, target: 5.0 },
    { period: 'Semana 4', rate: 3.4, target: 5.0 },
  ],
  scrapByProcess: [
    { process: 'Flexografía impresión', rate: 4.4, volumeUnits: 21600, costMxn: 32400 },
    { process: 'Offset impresión', rate: 3.3, volumeUnits: 13000, costMxn: 19500 },
    { process: 'Doblado de pliegos', rate: 2.7, volumeUnits: 6900, costMxn: 6200 },
    { process: 'Guillotina lineal', rate: 1.9, volumeUnits: 4800, costMxn: 4300 },
    { process: 'Grapado al lomo', rate: 1.5, volumeUnits: 3800, costMxn: 3400 },
    { process: 'Rebobinado e inspección', rate: 1.3, volumeUnits: 3200, costMxn: 2800 },
  ],
  scrapCauses: [
    { cause: 'Registro fuera de posición', percentage: 28, category4M: 'Método' },
    { cause: 'Ajuste inicial de máquina', percentage: 21, category4M: 'Método' },
    { cause: 'Materia prima / bobina defectuosa', percentage: 18, category4M: 'Material' },
    { cause: 'Troquel / desgaste de cuchilla', percentage: 14, category4M: 'Máquina' },
    { cause: 'Doblado desalineado', percentage: 9, category4M: 'Método' },
    { cause: 'Otros factores', percentage: 10, category4M: 'Mano de obra' },
  ],
  topScrapOps: [
    {
      opFolio: 'OP-95321',
      client: 'Fresenius Medical Care',
      partNumber: 'ET-FMC-001',
      scrapUnits: 2900,
      scrapPercent: 5.58,
      alertLevel: 'critico',
      mainReason: 'Desprendimiento de liner en sustrato BoPP y descalce en aceleración',
    },
    {
      opFolio: 'OP-95344',
      client: 'Black & Decker',
      partNumber: 'MN-BD-4402',
      scrapUnits: 920,
      scrapPercent: 3.88,
      alertLevel: 'normal',
      mainReason: 'Entonación y equilibrio agua-tinta en pliegos iniciales',
    },
    {
      opFolio: 'OP-95318',
      client: 'TYCO Electronics',
      partNumber: 'ET-TYC-99',
      scrapUnits: 840,
      scrapPercent: 3.52,
      alertLevel: 'normal',
      mainReason: 'Variación de viscosidad en tinta Pantone Black C',
    },
    {
      opFolio: 'OP-95333',
      client: 'Panasonic Automotive',
      partNumber: 'ET-PAN-7721',
      scrapUnits: 720,
      scrapPercent: 4.80,
      alertLevel: 'atencion',
      mainReason: 'Prueba de adherencia de barniz UV en estación 5',
    },
  ],
  setupComparison: [
    {
      processFamily: 'Flexo + barniz + troquel',
      standardMinutes: 45,
      realMinutes: 58,
      variationPercent: 28.9,
      samplesCount: 14,
      trend: 'arriba',
    },
    {
      processFamily: 'Manual Offset 64 pág.',
      standardMinutes: 40,
      realMinutes: 46,
      variationPercent: 15.0,
      samplesCount: 11,
      trend: 'arriba',
    },
    {
      processFamily: 'Doblado Stahl Ti-52',
      standardMinutes: 25,
      realMinutes: 28,
      variationPercent: 12.0,
      samplesCount: 16,
      trend: 'arriba',
    },
    {
      processFamily: 'Rebobinado Rotoflex I',
      standardMinutes: 15,
      realMinutes: 14,
      variationPercent: -6.7,
      samplesCount: 22,
      trend: 'abajo',
    },
    {
      processFamily: 'Grapado Muller Martini',
      standardMinutes: 30,
      realMinutes: 27,
      variationPercent: -10.0,
      samplesCount: 9,
      trend: 'abajo',
    },
  ],
  operatorPerformance: [
    {
      id: 'op-01',
      name: 'M. Ríos',
      employeeNo: '0142',
      primaryMachine: 'Mark Andy Scout 10”',
      area: 'Flexografía',
      efficiencyPercent: 96.0,
      scrapPercent: 2.4,
      productiveTimePercent: 91.0,
      shiftsCount: 22,
      completedOps: 18,
      setupVsStdMinutes: -4,
      reportedStopsCount: 3,
      contextNotes: 'Excelente consistencia en corrida continua. Mantiene la mejor tasa de scrap de la planta flexográfica.',
    },
    {
      id: 'op-02',
      name: 'J. Salinas',
      employeeNo: '0089',
      primaryMachine: 'Heidelberg SM 74',
      area: 'Offset',
      efficiencyPercent: 94.0,
      scrapPercent: 2.7,
      productiveTimePercent: 89.0,
      shiftsCount: 24,
      completedOps: 15,
      setupVsStdMinutes: 2,
      reportedStopsCount: 4,
      contextNotes: 'Dominio de balance agua-tinta en manuales de alto tiraje. Preparación limpia de placas.',
    },
    {
      id: 'op-03',
      name: 'C. Medina',
      employeeNo: '0115',
      primaryMachine: 'DiDDE 860',
      area: 'Offset',
      efficiencyPercent: 92.0,
      scrapPercent: 3.1,
      productiveTimePercent: 88.0,
      shiftsCount: 21,
      completedOps: 16,
      setupVsStdMinutes: 5,
      reportedStopsCount: 3,
      contextNotes: 'Operador versátil en rotativa comercial con buen control de tensión de pliego.',
    },
    {
      id: 'op-04',
      name: 'A. Torres',
      employeeNo: '0211',
      primaryMachine: 'Stahl 2',
      area: 'Acabados',
      efficiencyPercent: 87.0,
      scrapPercent: 2.8,
      productiveTimePercent: 83.0,
      shiftsCount: 20,
      completedOps: 14,
      setupVsStdMinutes: 8,
      reportedStopsCount: 6,
      contextNotes: 'Afectado por atascos mecánicos en la estación de doblez cruzado. Requiere soporte de Mtto.',
    },
    {
      id: 'op-05',
      name: 'H. Vargas',
      employeeNo: '0174',
      primaryMachine: 'Mark Andy 830',
      area: 'Flexografía',
      efficiencyPercent: 84.0,
      scrapPercent: 4.6,
      productiveTimePercent: 79.0,
      shiftsCount: 22,
      completedOps: 12,
      setupVsStdMinutes: 14,
      reportedStopsCount: 8,
      contextNotes: 'Asignado a OPs con herramental rotativo desgastado (TR-402). El tiempo de ajuste de registro impactó su indicador.',
    },
  ],
  operatorTimeDistribution: [
    { concept: 'Producción / Tiraje activo', percentage: 71, hours: 136.3, colorClass: 'bg-emerald-500' },
    { concept: 'Setup y preparación de máquina', percentage: 14, hours: 26.9, colorClass: 'bg-theme-primary' },
    { concept: 'Problemas mecánicos / paros', percentage: 6, hours: 11.5, colorClass: 'bg-rose-500' },
    { concept: 'Esperando material / insumos', percentage: 4, hours: 7.7, colorClass: 'bg-amber-500' },
    { concept: 'No hay trabajo / transición', percentage: 3, hours: 5.8, colorClass: 'bg-purple-500' },
    { concept: 'Junta de 5 min / entrenamiento', percentage: 2, hours: 3.8, colorClass: 'bg-zinc-400' },
  ],
  clientCapacity: [
    {
      client: 'Black & Decker',
      plantHours: 142.0,
      producedVolume: 380000,
      opsCount: 16,
      percentOfTotalCapacity: 28.5,
    },
    {
      client: 'Fresenius Medical Care',
      plantHours: 118.0,
      producedVolume: 295000,
      opsCount: 12,
      percentOfTotalCapacity: 23.7,
    },
    {
      client: 'TYCO Electronics',
      plantHours: 97.0,
      producedVolume: 240000,
      opsCount: 10,
      percentOfTotalCapacity: 19.5,
    },
    {
      client: 'Panasonic Automotive',
      plantHours: 84.0,
      producedVolume: 185000,
      opsCount: 8,
      percentOfTotalCapacity: 16.9,
    },
    {
      client: 'ILSCO de México',
      plantHours: 68.0,
      producedVolume: 140000,
      opsCount: 4,
      percentOfTotalCapacity: 11.4,
    },
  ],
  deliveryCompliance: {
    onTimePercent: 88.0,
    onTimeOpsCount: 44,
    oneDayLateCount: 4,
    twoToThreeDaysLateCount: 2,
    moreThanThreeDaysLateCount: 0,
  },
  topDelayedOps: [
    {
      opFolio: 'OP-95321',
      client: 'TYCO Electronics',
      partNumber: 'IS-2420',
      promisedDate: '09 Sep 2026',
      targetRtmDate: '08 Sep 2026',
      actualDate: '10 Sep 2026',
      deviationDays: 2,
      causes: [
        { description: 'Paro por ajuste de registro en Mark Andy', impact: '1h 48m de tiempo muerto' },
        { description: 'Suministro de bobina BoPP fuera de ventana', impact: '+1 día de retraso en piso' },
        { description: 'Calibración de suaje rotativo adicional', impact: '+22 min de setup' },
      ],
    },
    {
      opFolio: 'OP-95344',
      client: 'Black & Decker',
      partNumber: 'NA472050',
      promisedDate: '11 Sep 2026',
      targetRtmDate: '10 Sep 2026',
      actualDate: '11 Sep 2026',
      deviationDays: 1,
      causes: [
        { description: 'Liberación de primera pieza por Calidad', impact: '+35 min en espera de Alicia' },
        { description: 'Reemplazo preventivo de mantilla Offset', impact: '+25 min de paro' },
      ],
    },
  ],
  machineHeatmap: [
    {
      machineName: 'Mark Andy 830',
      area: 'Flexografía',
      days: [
        { day: 'LUN', efficiencyPercent: 84, status: 'ambar' },
        { day: 'MAR', efficiencyPercent: 72, status: 'rojo' },
        { day: 'MIÉ', efficiencyPercent: 91, status: 'verde' },
        { day: 'JUE', efficiencyPercent: 76, status: 'rojo' },
        { day: 'VIE', efficiencyPercent: 88, status: 'ambar' },
      ],
    },
    {
      machineName: 'Mark Andy Scout 10”',
      area: 'Flexografía',
      days: [
        { day: 'LUN', efficiencyPercent: 96, status: 'verde' },
        { day: 'MAR', efficiencyPercent: 94, status: 'verde' },
        { day: 'MIÉ', efficiencyPercent: 89, status: 'ambar' },
        { day: 'JUE', efficiencyPercent: 92, status: 'verde' },
        { day: 'VIE', efficiencyPercent: 95, status: 'verde' },
      ],
    },
    {
      machineName: 'DiDDE 860',
      area: 'Offset',
      days: [
        { day: 'LUN', efficiencyPercent: 93, status: 'verde' },
        { day: 'MAR', efficiencyPercent: 97, status: 'verde' },
        { day: 'MIÉ', efficiencyPercent: 92, status: 'verde' },
        { day: 'JUE', efficiencyPercent: 96, status: 'verde' },
        { day: 'VIE', efficiencyPercent: 94, status: 'verde' },
      ],
    },
    {
      machineName: 'Stahl 2',
      area: 'Acabados',
      days: [
        { day: 'LUN', efficiencyPercent: 82, status: 'ambar' },
        { day: 'MAR', efficiencyPercent: 79, status: 'rojo' },
        { day: 'MIÉ', efficiencyPercent: 86, status: 'ambar' },
        { day: 'JUE', efficiencyPercent: 84, status: 'ambar' },
        { day: 'VIE', efficiencyPercent: 87, status: 'ambar' },
      ],
    },
    {
      machineName: 'Heidelberg SM 74',
      area: 'Offset',
      days: [
        { day: 'LUN', efficiencyPercent: 95, status: 'verde' },
        { day: 'MAR', efficiencyPercent: 96, status: 'verde' },
        { day: 'MIÉ', efficiencyPercent: 94, status: 'verde' },
        { day: 'JUE', efficiencyPercent: 97, status: 'verde' },
        { day: 'VIE', efficiencyPercent: 95, status: 'verde' },
      ],
    },
  ],
  pareto4M: [
    {
      category: 'Material',
      percentage: 34,
      minutes: 231,
      weeklyTrend: [72, 85, 61, 48],
    },
    {
      category: 'Máquina',
      percentage: 29,
      minutes: 197,
      weeklyTrend: [44, 51, 83, 93],
    },
    {
      category: 'Método',
      percentage: 23,
      minutes: 156,
      weeklyTrend: [39, 33, 30, 37],
    },
    {
      category: 'Mano de obra',
      percentage: 14,
      minutes: 95,
      weeklyTrend: [28, 22, 19, 21],
    },
  ],
};

// Generador de snapshots mock coherentes para otros periodos demo
export function getProductionAnalyticsForPeriod(period: ProductionPeriod): ProductionAnalyticsDataset {
  if (period === '7 días') {
    return {
      ...MOCK_PRODUCTION_ANALYTICS_30D,
      period: '7 días',
      kpis: {
        ...MOCK_PRODUCTION_ANALYTICS_30D.kpis,
        planCompliance: 92.4,
        productiveEfficiency: 90.1,
        scrapRate: 3.2,
        lostTimeFormatted: '4h 15m',
        lostTimeIncidents: 7,
        onTimeOpsRate: 91.6,
        onTimeOpsCount: 11,
        totalOpsCount: 12,
      },
      planVsActual: {
        ...MOCK_PRODUCTION_ANALYTICS_30D.planVsActual,
        Todas: {
          ...MOCK_PRODUCTION_ANALYTICS_30D.planVsActual.Todas,
          points: [
            { label: 'Lun', planned: 55000, actual: 52000, compliancePercent: 94.5 },
            { label: 'Mar', planned: 58000, actual: 54000, compliancePercent: 93.1 },
            { label: 'Mié', planned: 60000, actual: 57000, compliancePercent: 95.0 },
            { label: 'Jue', planned: 62000, actual: 56000, compliancePercent: 90.3 },
            { label: 'Vie', planned: 59000, actual: 55000, compliancePercent: 93.2 },
          ],
        },
      },
    };
  }

  if (period === '90 días' || period === 'Q3 2026') {
    return {
      ...MOCK_PRODUCTION_ANALYTICS_30D,
      period,
      kpis: {
        ...MOCK_PRODUCTION_ANALYTICS_30D.kpis,
        planCompliance: 90.5,
        productiveEfficiency: 88.2,
        scrapRate: 3.8,
        lostTimeFormatted: '58h 10m',
        lostTimeIncidents: 94,
        onTimeOpsRate: 86.4,
        onTimeOpsCount: 133,
        totalOpsCount: 154,
      },
    };
  }

  if (period === 'Hoy') {
    return {
      ...MOCK_PRODUCTION_ANALYTICS_30D,
      period: 'Hoy',
      kpis: {
        ...MOCK_PRODUCTION_ANALYTICS_30D.kpis,
        planCompliance: 93.5,
        productiveEfficiency: 91.2,
        scrapRate: 2.8,
        lostTimeFormatted: '0h 45m',
        lostTimeIncidents: 2,
        onTimeOpsRate: 100.0,
        onTimeOpsCount: 6,
        totalOpsCount: 6,
      },
      planVsActual: {
        ...MOCK_PRODUCTION_ANALYTICS_30D.planVsActual,
        Todas: {
          ...MOCK_PRODUCTION_ANALYTICS_30D.planVsActual.Todas,
          points: [
            { label: '07:00-10:00', planned: 18000, actual: 17200, compliancePercent: 95.5 },
            { label: '10:00-13:00', planned: 21000, actual: 19800, compliancePercent: 94.2 },
            { label: '13:00-16:00', planned: 20000, actual: 18400, compliancePercent: 92.0 },
          ],
        },
      },
    };
  }

  return MOCK_PRODUCTION_ANALYTICS_30D;
}
