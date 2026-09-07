export interface HourlyTrafficPoint {
  hour: string;
  inbound: number;
  putaway: number;
  picking: number;
  outbound: number;
  total: number;
}

export interface DayHourHeatmapPoint {
  day: string;
  hour: string;
  intensity: number; // 0-4
  count: number;
}

export type DayHourHeatmapCell = DayHourHeatmapPoint;

export interface TopTrafficArticle {
  sku: string;
  name: string;
  brand: string;
  category: string;
  moves?: number;
  inbound: number;
  putaway: number;
  picking: number;
  outbound: number;
  totalMoves: number;
  percentage: number;
}

export interface TopTrafficLocation {
  code: string;
  label: string;
  type: string;
  moves: number;
  occupancyPercentage: number;
}

export interface OperatorPerformance {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  total: number;
  inbound: number;
  putaway: number;
  picking: number;
  outbound: number;
  movesCount?: number;
  avgTimeMinutes: number;
  errorRatePercentage: number;
  status: 'Activo' | 'En pausa' | 'Inactivo';
}

export interface SlowProcessOrder {
  id: string;
  folio: string;
  type: string;
  stage: string;
  elapsedMinutes: number;
  thresholdMinutes: number;
  responsible: string;
  reason: string;
  progress: string;
  timeActive: string;
  tabTarget: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'incidents';
}

export interface TrafficDataset {
  totalMoves: number;
  pacePerHour: number;
  peakHour: string;
  peakHourOps: number;
  avgProcessMinutes: number;
  activeOrdersCount: number;
  incidentsCount: number;
  incidentsRate: string;
  hourlyPoints: HourlyTrafficPoint[];
  stageVolumes: {
    inbound: number;
    putaway: number;
    picking: number;
    outbound: number;
  };
  stageAvgMinutes: {
    inbound: number;
    putaway: number;
    picking: number;
    outbound: number;
  };
  warehouseMoves: {
    name: string;
    moves: number;
    percentage: number;
  }[];
  topZones: {
    zone: string;
    label: string;
    moves: number;
  }[];
  dayHourHeatmap: DayHourHeatmapPoint[];
  topArticles: TopTrafficArticle[];
  topLocations: TopTrafficLocation[];
  operators: OperatorPerformance[];
  slowOrders: SlowProcessOrder[];
  timeBeforePutawayAvg: string;
  timeBeforePutawayMax: string;
  timeBeforeValidationAvg: string;
  insights: string[];
}

export const CEDIS_TRAFFIC_DATA: Record<string, Record<string, TrafficDataset>> = {
  'wh-mty-norte': {
    today: {
      totalMoves: 184,
      pacePerHour: 23,
      peakHour: '16:00 - 17:00',
      peakHourOps: 31,
      avgProcessMinutes: 18,
      activeOrdersCount: 12,
      incidentsCount: 7,
      incidentsRate: '3.8%',
      hourlyPoints: [
        { hour: '08:00', inbound: 4, putaway: 2, picking: 3, outbound: 1, total: 10 },
        { hour: '10:00', inbound: 10, putaway: 6, picking: 7, outbound: 4, total: 27 },
        { hour: '12:00', inbound: 12, putaway: 9, picking: 11, outbound: 6, total: 38 },
        { hour: '14:00', inbound: 8, putaway: 8, picking: 9, outbound: 5, total: 30 },
        { hour: '16:00', inbound: 18, putaway: 14, picking: 20, outbound: 12, total: 64 },
        { hour: '18:00', inbound: 6, putaway: 8, picking: 10, outbound: 8, total: 32 },
        { hour: '20:00', inbound: 2, putaway: 4, picking: 3, outbound: 2, total: 11 },
      ],
      stageVolumes: {
        inbound: 48,
        putaway: 38,
        picking: 36,
        outbound: 28,
      },
      stageAvgMinutes: {
        inbound: 12,
        putaway: 21,
        picking: 28,
        outbound: 9,
      },
      warehouseMoves: [
        { name: 'CEDIS Monterrey Norte', moves: 184, percentage: 100 },
      ],
      topZones: [
        { zone: 'A-B', label: 'Rack Pasillo A (Nivel B)', moves: 38 },
        { zone: 'B-A', label: 'Rack Pasillo B (Nivel A)', moves: 29 },
        { zone: 'REC-01', label: 'Andén de Recepción Principal', moves: 24 },
        { zone: 'STG-OUT-01', label: 'Zona Staging de Salida', moves: 21 },
        { zone: 'EMB-03', label: 'Carril de Embarque 03', moves: 18 },
      ],
      dayHourHeatmap: [
        { day: 'Lun', hour: '08:00', intensity: 1, count: 12 },
        { day: 'Lun', hour: '10:00', intensity: 3, count: 34 },
        { day: 'Lun', hour: '12:00', intensity: 4, count: 48 },
        { day: 'Lun', hour: '14:00', intensity: 2, count: 28 },
        { day: 'Lun', hour: '16:00', intensity: 4, count: 52 },
        { day: 'Lun', hour: '18:00', intensity: 2, count: 24 },
        { day: 'Lun', hour: '20:00', intensity: 1, count: 10 },
        { day: 'Mar', hour: '08:00', intensity: 2, count: 18 },
        { day: 'Mar', hour: '10:00', intensity: 3, count: 36 },
        { day: 'Mar', hour: '12:00', intensity: 4, count: 50 },
        { day: 'Mar', hour: '14:00', intensity: 3, count: 32 },
        { day: 'Mar', hour: '16:00', intensity: 4, count: 58 },
        { day: 'Mar', hour: '18:00', intensity: 3, count: 30 },
        { day: 'Mar', hour: '20:00', intensity: 1, count: 12 },
        { day: 'Mié', hour: '08:00', intensity: 1, count: 14 },
        { day: 'Mié', hour: '10:00', intensity: 4, count: 42 },
        { day: 'Mié', hour: '12:00', intensity: 4, count: 55 },
        { day: 'Mié', hour: '14:00', intensity: 3, count: 35 },
        { day: 'Mié', hour: '16:00', intensity: 4, count: 64 },
        { day: 'Mié', hour: '18:00', intensity: 2, count: 28 },
        { day: 'Mié', hour: '20:00', intensity: 1, count: 11 },
        { day: 'Jue', hour: '08:00', intensity: 2, count: 20 },
        { day: 'Jue', hour: '10:00', intensity: 3, count: 38 },
        { day: 'Jue', hour: '12:00', intensity: 4, count: 52 },
        { day: 'Jue', hour: '14:00', intensity: 3, count: 34 },
        { day: 'Jue', hour: '16:00', intensity: 4, count: 60 },
        { day: 'Jue', hour: '18:00', intensity: 3, count: 32 },
        { day: 'Jue', hour: '20:00', intensity: 1, count: 14 },
        { day: 'Vie', hour: '08:00', intensity: 3, count: 26 },
        { day: 'Vie', hour: '10:00', intensity: 4, count: 45 },
        { day: 'Vie', hour: '12:00', intensity: 4, count: 58 },
        { day: 'Vie', hour: '14:00', intensity: 4, count: 40 },
        { day: 'Vie', hour: '16:00', intensity: 4, count: 68 },
        { day: 'Vie', hour: '18:00', intensity: 3, count: 36 },
        { day: 'Vie', hour: '20:00', intensity: 2, count: 18 },
        { day: 'Sáb', hour: '08:00', intensity: 2, count: 22 },
        { day: 'Sáb', hour: '10:00', intensity: 4, count: 48 },
        { day: 'Sáb', hour: '12:00', intensity: 4, count: 52 },
        { day: 'Sáb', hour: '14:00', intensity: 2, count: 24 },
        { day: 'Sáb', hour: '16:00', intensity: 2, count: 20 },
      ],
      topArticles: [
        { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', category: 'Colchones', inbound: 18, putaway: 16, picking: 16, outbound: 14, totalMoves: 64, percentage: 35 },
        { sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', category: 'Colchones', inbound: 12, putaway: 10, picking: 12, outbound: 8, totalMoves: 42, percentage: 23 },
        { sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', brand: 'Spring Air', category: 'Colchones', inbound: 10, putaway: 8, picking: 10, outbound: 8, totalMoves: 36, percentage: 20 },
        { sku: 'SC-REST-ORTO-MAT', name: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', category: 'Colchones', inbound: 8, putaway: 6, picking: 6, outbound: 4, totalMoves: 24, percentage: 13 },
        { sku: 'SC-SEAL-POST-QS', name: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', category: 'Colchones', inbound: 6, putaway: 4, picking: 4, outbound: 4, totalMoves: 18, percentage: 9 },
      ],
      topLocations: [
        { code: 'A-A-01', label: 'Pasillo A · Pos 01 · Nivel A', type: 'Rack', moves: 28, occupancyPercentage: 80 },
        { code: 'A-B-03', label: 'Pasillo A · Pos 03 · Nivel B', type: 'Rack', moves: 24, occupancyPercentage: 65 },
        { code: 'B-A-01', label: 'Pasillo B · Pos 01 · Nivel A', type: 'Rack', moves: 22, occupancyPercentage: 90 },
        { code: 'REC-01', label: 'Andén de Recepción Principal', type: 'Recepción', moves: 48, occupancyPercentage: 75 },
        { code: 'EMB-03', label: 'Carril de Embarque 03', type: 'Salida', moves: 18, occupancyPercentage: 60 },
      ],
      operators: [
        { id: 'op-1', name: 'Carlos Medina', role: 'Operador Mesa 01', total: 76, inbound: 24, putaway: 20, picking: 18, outbound: 14, movesCount: 76, avgTimeMinutes: 14, errorRatePercentage: 1.2, status: 'Activo' },
        { id: 'op-2', name: 'Roberto Garza', role: 'Operador Acomodo / Salidas', total: 58, inbound: 16, putaway: 18, picking: 12, outbound: 12, movesCount: 58, avgTimeMinutes: 16, errorRatePercentage: 0.8, status: 'Activo' },
        { id: 'op-3', name: 'Laura Gómez', role: 'Supervisora Mesa', total: 28, inbound: 8, putaway: 0, picking: 10, outbound: 10, movesCount: 28, avgTimeMinutes: 12, errorRatePercentage: 0.0, status: 'Activo' },
        { id: 'op-4', name: 'Admin Demo', role: 'Supervisor General', total: 22, inbound: 0, putaway: 0, picking: 12, outbound: 10, movesCount: 22, avgTimeMinutes: 10, errorRatePercentage: 0.0, status: 'Activo' },
      ],
      slowOrders: [
        { id: 'so-1', folio: 'OA-2026-0031', type: 'Acomodo', stage: 'Acomodo', progress: '3 / 6 unidades estibadas', timeActive: '1 h 18 min', tabTarget: 'putaway', elapsedMinutes: 78, thresholdMinutes: 45, responsible: 'Carlos Medina', reason: 'Retraso por incidencia de etiqueta dañada' },
        { id: 'so-2', folio: 'OR-2026-0118', type: 'Recolección', stage: 'Recolección', progress: '2 / 6 unidades recolectadas', timeActive: '52 min', tabTarget: 'picking', elapsedMinutes: 52, thresholdMinutes: 40, responsible: 'Carlos Medina', reason: 'Unidad SC-UID-2026-000184 no localizada en posición' },
      ],
      timeBeforePutawayAvg: '24 min',
      timeBeforePutawayMax: '1 h 18 min',
      timeBeforeValidationAvg: '18 min',
      insights: [
        'El cuello de botella principal se concentra en Pasillo A Nivel B durante el pico de las 16:00 h.',
        'La tasa de error en salidas se redujo a 1.2% tras la implementación de validación estricta de UID.',
        'Recepción REC-01 opera al 75% de su capacidad con 2 recepciones simultáneas.',
      ],
    },
    yesterday: {
      totalMoves: 165,
      pacePerHour: 21,
      peakHour: '15:00 - 16:00',
      peakHourOps: 28,
      avgProcessMinutes: 16,
      activeOrdersCount: 2,
      incidentsCount: 2,
      incidentsRate: '1.2%',
      hourlyPoints: [
        { hour: '08:00', inbound: 6, putaway: 4, picking: 4, outbound: 2, total: 16 },
        { hour: '10:00', inbound: 12, putaway: 8, picking: 10, outbound: 8, total: 38 },
        { hour: '12:00', inbound: 10, putaway: 10, picking: 12, outbound: 10, total: 42 },
        { hour: '14:00', inbound: 6, putaway: 8, picking: 8, outbound: 8, total: 30 },
        { hour: '16:00', inbound: 6, putaway: 8, picking: 10, outbound: 12, total: 36 },
        { hour: '18:00', inbound: 2, putaway: 4, picking: 4, outbound: 5, total: 15 },
        { hour: '20:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
      ],
      stageVolumes: { inbound: 42, putaway: 42, picking: 48, outbound: 45 },
      stageAvgMinutes: { inbound: 11, putaway: 18, picking: 22, outbound: 8 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Norte', moves: 165, percentage: 100 }],
      topZones: [{ zone: 'A-A', label: 'Rack Pasillo A (Nivel A)', moves: 36 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '21 min',
      timeBeforePutawayMax: '55 min',
      timeBeforeValidationAvg: '15 min',
      insights: ['Jornada completada con cumplimiento del 98% en tiempos de rampa.'],
    },
    '7d': {
      totalMoves: 1180,
      pacePerHour: 22,
      peakHour: '16:00 - 17:00',
      peakHourOps: 195,
      avgProcessMinutes: 17,
      activeOrdersCount: 8,
      incidentsCount: 8,
      incidentsRate: '0.7%',
      hourlyPoints: [
        { hour: '08:00', inbound: 40, putaway: 30, picking: 35, outbound: 20, total: 125 },
        { hour: '10:00', inbound: 80, putaway: 70, picking: 75, outbound: 60, total: 285 },
        { hour: '12:00', inbound: 75, putaway: 70, picking: 70, outbound: 55, total: 270 },
        { hour: '14:00', inbound: 45, putaway: 45, picking: 40, outbound: 45, total: 175 },
        { hour: '16:00', inbound: 35, putaway: 40, picking: 35, outbound: 45, total: 155 },
        { hour: '18:00', inbound: 9, putaway: 13, picking: 5, outbound: 15, total: 42 },
        { hour: '20:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
      ],
      stageVolumes: { inbound: 284, putaway: 268, picking: 260, outbound: 240 },
      stageAvgMinutes: { inbound: 11, putaway: 19, picking: 24, outbound: 8 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Norte', moves: 1180, percentage: 100 }],
      topZones: [{ zone: 'A-B', label: 'Rack Pasillo A (Nivel B)', moves: 240 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '22 min',
      timeBeforePutawayMax: '1 h 25 min',
      timeBeforeValidationAvg: '16 min',
      insights: ['Volumen semanal sostenido por encima de 1,100 movimientos.'],
    },
    '30d': {
      totalMoves: 4890,
      pacePerHour: 22,
      peakHour: '16:00 - 17:00',
      peakHourOps: 820,
      avgProcessMinutes: 18,
      activeOrdersCount: 8,
      incidentsCount: 48,
      incidentsRate: '1.0%',
      hourlyPoints: [
        { hour: '08:00', inbound: 180, putaway: 140, picking: 150, outbound: 90, total: 560 },
        { hour: '10:00', inbound: 350, putaway: 310, picking: 330, outbound: 280, total: 1270 },
        { hour: '12:00', inbound: 320, putaway: 300, picking: 310, outbound: 260, total: 1190 },
        { hour: '14:00', inbound: 200, putaway: 210, picking: 190, outbound: 200, total: 800 },
        { hour: '16:00', inbound: 150, putaway: 180, picking: 160, outbound: 210, total: 700 },
        { hour: '18:00', inbound: 40, putaway: 84, picking: 40, outbound: 70, total: 234 },
        { hour: '20:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
      ],
      stageVolumes: { inbound: 1240, putaway: 1224, picking: 1180, outbound: 1110 },
      stageAvgMinutes: { inbound: 12, putaway: 20, picking: 25, outbound: 9 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Norte', moves: 4890, percentage: 100 }],
      topZones: [{ zone: 'A-B', label: 'Rack Pasillo A (Nivel B)', moves: 980 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '23 min',
      timeBeforePutawayMax: '1 h 40 min',
      timeBeforeValidationAvg: '17 min',
      insights: ['Consolidado mensual con 99.1% de exactitud en inventario serializado.'],
    },
  },
  'wh-mty-sur': {
    today: {
      totalMoves: 82,
      pacePerHour: 12,
      peakHour: '11:00 - 12:00',
      peakHourOps: 18,
      avgProcessMinutes: 15,
      activeOrdersCount: 6,
      incidentsCount: 5,
      incidentsRate: '6.0%',
      hourlyPoints: [
        { hour: '08:00', inbound: 2, putaway: 1, picking: 2, outbound: 1, total: 6 },
        { hour: '10:00', inbound: 8, putaway: 6, picking: 6, outbound: 4, total: 24 },
        { hour: '12:00', inbound: 8, putaway: 5, picking: 5, outbound: 4, total: 22 },
        { hour: '14:00', inbound: 4, putaway: 4, picking: 3, outbound: 3, total: 14 },
        { hour: '16:00', inbound: 2, putaway: 2, picking: 2, outbound: 2, total: 8 },
        { hour: '18:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
        { hour: '20:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
      ],
      stageVolumes: { inbound: 24, putaway: 18, picking: 18, outbound: 14 },
      stageAvgMinutes: { inbound: 9, putaway: 16, picking: 20, outbound: 8 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Sur', moves: 82, percentage: 100 }],
      topZones: [
        { zone: 'B-A', label: 'Rack Pasillo B (Nivel A)', moves: 28 },
        { zone: 'B-B', label: 'Rack Pasillo B (Nivel B)', moves: 19 },
        { zone: 'REC-02', label: 'Andén de Recepción Principal', moves: 24 },
        { zone: 'EMB-01', label: 'Carril de Embarque 01', moves: 11 },
      ],
      dayHourHeatmap: [],
      topArticles: [
        { sku: 'SC-REST-ORTO-MAT', name: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', category: 'Colchones', inbound: 10, putaway: 8, picking: 8, outbound: 6, totalMoves: 32, percentage: 39 },
        { sku: 'SC-SEA-CLB-KS', name: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', category: 'Colchones', inbound: 8, putaway: 6, picking: 8, outbound: 6, totalMoves: 28, percentage: 34 },
        { sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', brand: 'Spring Air', category: 'Colchones', inbound: 6, putaway: 4, picking: 6, outbound: 6, totalMoves: 22, percentage: 27 },
      ],
      topLocations: [
        { code: 'B-A-01', label: 'Pasillo B · Pos 01 · Nivel A', type: 'Rack', moves: 18, occupancyPercentage: 85 },
        { code: 'B-B-01', label: 'Pasillo B · Pos 01 · Nivel B', type: 'Rack', moves: 15, occupancyPercentage: 70 },
        { code: 'REC-02', label: 'Andén Recepción Principal', type: 'Recepción', moves: 24, occupancyPercentage: 80 },
      ],
      operators: [
        { id: 'op-s1', name: 'Valeria Torres', role: 'Operador Mesa 02', total: 48, inbound: 14, putaway: 12, picking: 12, outbound: 10, movesCount: 48, avgTimeMinutes: 14, errorRatePercentage: 0.9, status: 'Activo' },
        { id: 'op-s2', name: 'Miguel Ángel Soto', role: 'Operador Sur', total: 34, inbound: 10, putaway: 6, picking: 10, outbound: 8, movesCount: 34, avgTimeMinutes: 16, errorRatePercentage: 1.1, status: 'Activo' },
      ],
      slowOrders: [
        { id: 'so-s1', folio: 'OA-2026-0033', type: 'Acomodo', stage: 'Acomodo', progress: '1 / 4 unidades estibadas', timeActive: '45 min', tabTarget: 'putaway', elapsedMinutes: 45, thresholdMinutes: 35, responsible: 'Valeria Torres', reason: 'Acomodo de unidades King Size de alto peso' },
      ],
      timeBeforePutawayAvg: '19 min',
      timeBeforePutawayMax: '45 min',
      timeBeforeValidationAvg: '14 min',
      insights: [
        'CEDIS Sur mantiene un flujo ágil con 82 movimientos en jornada matutina.',
        'La ruta Guadalupe #04 fue despachada en tiempo y forma desde EMB-01.',
      ],
    },
    yesterday: {
      totalMoves: 48,
      pacePerHour: 10,
      peakHour: '11:00 - 12:00',
      peakHourOps: 14,
      avgProcessMinutes: 12,
      activeOrdersCount: 2,
      incidentsCount: 1,
      incidentsRate: '2.0%',
      hourlyPoints: [
        { hour: '08:00', inbound: 2, putaway: 1, picking: 1, outbound: 0, total: 4 },
        { hour: '10:00', inbound: 4, putaway: 4, picking: 4, outbound: 2, total: 14 },
        { hour: '12:00', inbound: 4, putaway: 3, picking: 3, outbound: 2, total: 12 },
        { hour: '14:00', inbound: 2, putaway: 2, picking: 2, outbound: 2, total: 8 },
        { hour: '16:00', inbound: 2, putaway: 2, picking: 1, outbound: 2, total: 7 },
        { hour: '18:00', inbound: 1, putaway: 1, picking: 1, outbound: 0, total: 3 },
        { hour: '20:00', inbound: 0, putaway: 0, picking: 0, outbound: 0, total: 0 },
      ],
      stageVolumes: { inbound: 20, putaway: 20, picking: 22, outbound: 20 },
      stageAvgMinutes: { inbound: 8, putaway: 14, picking: 18, outbound: 7 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Sur', moves: 48, percentage: 100 }],
      topZones: [{ zone: 'B-A', label: 'Rack Pasillo B (Nivel A)', moves: 18 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '18 min',
      timeBeforePutawayMax: '45 min',
      timeBeforeValidationAvg: '14 min',
      insights: ['Jornada completada con cero incidencias operativas mayores.'],
    },
    '7d': {
      totalMoves: 340,
      pacePerHour: 11,
      peakHour: '10:00 - 12:00',
      peakHourOps: 62,
      avgProcessMinutes: 13,
      activeOrdersCount: 4,
      incidentsCount: 3,
      incidentsRate: '0.9%',
      hourlyPoints: [
        { hour: '08:00', inbound: 15, putaway: 10, picking: 10, outbound: 5, total: 40 },
        { hour: '10:00', inbound: 30, putaway: 25, picking: 25, outbound: 18, total: 98 },
        { hour: '12:00', inbound: 25, putaway: 22, picking: 22, outbound: 16, total: 85 },
        { hour: '14:00', inbound: 12, putaway: 14, picking: 15, outbound: 12, total: 53 },
        { hour: '16:00', inbound: 10, putaway: 12, picking: 12, outbound: 10, total: 44 },
        { hour: '18:00', inbound: 4, putaway: 6, picking: 5, outbound: 3, total: 18 },
        { hour: '20:00', inbound: 1, putaway: 1, picking: 0, outbound: 0, total: 2 },
      ],
      stageVolumes: { inbound: 140, putaway: 135, picking: 130, outbound: 120 },
      stageAvgMinutes: { inbound: 9, putaway: 15, picking: 19, outbound: 8 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Sur', moves: 340, percentage: 100 }],
      topZones: [{ zone: 'B-A', label: 'Rack Pasillo B (Nivel A)', moves: 95 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '20 min',
      timeBeforePutawayMax: '1 h 15 min',
      timeBeforeValidationAvg: '15 min',
      insights: ['340 movimientos procesados en la semana en CEDIS Sur.'],
    },
    '30d': {
      totalMoves: 1450,
      pacePerHour: 11,
      peakHour: '10:00 - 12:00',
      peakHourOps: 240,
      avgProcessMinutes: 14,
      activeOrdersCount: 4,
      incidentsCount: 12,
      incidentsRate: '0.8%',
      hourlyPoints: [
        { hour: '08:00', inbound: 60, putaway: 45, picking: 40, outbound: 25, total: 170 },
        { hour: '10:00', inbound: 130, putaway: 110, picking: 110, outbound: 80, total: 430 },
        { hour: '12:00', inbound: 110, putaway: 95, picking: 95, outbound: 75, total: 375 },
        { hour: '14:00', inbound: 55, putaway: 65, picking: 65, outbound: 50, total: 235 },
        { hour: '16:00', inbound: 45, putaway: 55, picking: 50, outbound: 40, total: 190 },
        { hour: '18:00', inbound: 15, putaway: 25, picking: 20, outbound: 15, total: 75 },
        { hour: '20:00', inbound: 5, putaway: 5, picking: 0, outbound: 0, total: 10 },
      ],
      stageVolumes: { inbound: 580, putaway: 571, picking: 540, outbound: 510 },
      stageAvgMinutes: { inbound: 9, putaway: 15, picking: 20, outbound: 8 },
      warehouseMoves: [{ name: 'CEDIS Monterrey Sur', moves: 1450, percentage: 100 }],
      topZones: [{ zone: 'B-A', label: 'Rack Pasillo B (Nivel A)', moves: 380 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '21 min',
      timeBeforePutawayMax: '1 h 30 min',
      timeBeforeValidationAvg: '16 min',
      insights: ['Consolidado mensual en CEDIS Sur con alta eficiencia.'],
    },
  },
  'wh-suc-valle-oriente': {
    today: {
      totalMoves: 14,
      pacePerHour: 3,
      peakHour: '11:00 - 12:00',
      peakHourOps: 6,
      avgProcessMinutes: 10,
      activeOrdersCount: 2,
      incidentsCount: 1,
      incidentsRate: '7.1%',
      hourlyPoints: [
        { hour: '10:00', inbound: 2, putaway: 1, picking: 0, outbound: 0, total: 3 },
        { hour: '12:00', inbound: 4, putaway: 3, picking: 1, outbound: 1, total: 9 },
        { hour: '14:00', inbound: 0, putaway: 0, picking: 1, outbound: 1, total: 2 },
      ],
      stageVolumes: { inbound: 6, putaway: 4, picking: 2, outbound: 2 },
      stageAvgMinutes: { inbound: 6, putaway: 10, picking: 12, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Valle Oriente', moves: 14, percentage: 100 }],
      topZones: [
        { zone: 'SHOW-02', label: 'Bahía Secundaria Showroom VO', moves: 4 },
        { zone: 'REC-SUC-VO', label: 'Andén Recepción Traspasos VO', moves: 6 },
      ],
      dayHourHeatmap: [],
      topArticles: [
        { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic Individual', brand: 'Nayt', category: 'Colchones', inbound: 4, putaway: 2, picking: 1, outbound: 1, totalMoves: 8, percentage: 57 },
      ],
      topLocations: [
        { code: 'SHOW-02', label: 'Bahía Showroom 02', type: 'Showroom', moves: 4, occupancyPercentage: 100 },
      ],
      operators: [
        { id: 'op-vo-1', name: 'Brenda Cavazos', role: 'Encargada Sucursal', total: 14, inbound: 6, putaway: 4, picking: 2, outbound: 2, movesCount: 14, avgTimeMinutes: 8, errorRatePercentage: 0.0, status: 'Activo' },
      ],
      slowOrders: [],
      timeBeforePutawayAvg: '12 min',
      timeBeforePutawayMax: '20 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['Recepción y montaje de exhibición completados en piso de venta.'],
    },
    yesterday: {
      totalMoves: 12,
      pacePerHour: 2,
      peakHour: '12:00 - 13:00',
      peakHourOps: 4,
      avgProcessMinutes: 9,
      activeOrdersCount: 0,
      incidentsCount: 0,
      incidentsRate: '0.0%',
      hourlyPoints: [
        { hour: '10:00', inbound: 2, putaway: 2, picking: 1, outbound: 1, total: 6 },
        { hour: '12:00', inbound: 4, putaway: 4, picking: 3, outbound: 3, total: 14 },
      ],
      stageVolumes: { inbound: 6, putaway: 6, picking: 4, outbound: 4 },
      stageAvgMinutes: { inbound: 5, putaway: 8, picking: 10, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Valle Oriente', moves: 12, percentage: 100 }],
      topZones: [{ zone: 'SHOW-01', label: 'Bahía Principal Showroom', moves: 4 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '10 min',
      timeBeforePutawayMax: '18 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['Operación regular de tienda.'],
    },
    '7d': {
      totalMoves: 77,
      pacePerHour: 2,
      peakHour: '11:00 - 13:00',
      peakHourOps: 18,
      avgProcessMinutes: 10,
      activeOrdersCount: 2,
      incidentsCount: 1,
      incidentsRate: '1.3%',
      hourlyPoints: [
        { hour: '10:00', inbound: 10, putaway: 8, picking: 6, outbound: 6, total: 30 },
        { hour: '12:00', inbound: 14, putaway: 13, picking: 10, outbound: 10, total: 47 },
      ],
      stageVolumes: { inbound: 24, putaway: 21, picking: 16, outbound: 16 },
      stageAvgMinutes: { inbound: 6, putaway: 9, picking: 11, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Valle Oriente', moves: 77, percentage: 100 }],
      topZones: [{ zone: 'SHOW-01', label: 'Showroom VO', moves: 32 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '11 min',
      timeBeforePutawayMax: '22 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['Semana con rotación constante de exhibición.'],
    },
    '30d': {
      totalMoves: 341,
      pacePerHour: 2,
      peakHour: '11:00 - 13:00',
      peakHourOps: 75,
      avgProcessMinutes: 10,
      activeOrdersCount: 2,
      incidentsCount: 2,
      incidentsRate: '0.6%',
      hourlyPoints: [
        { hour: '10:00', inbound: 45, putaway: 42, picking: 32, outbound: 32, total: 151 },
        { hour: '12:00', inbound: 53, putaway: 53, picking: 42, outbound: 42, total: 190 },
      ],
      stageVolumes: { inbound: 98, putaway: 95, picking: 74, outbound: 74 },
      stageAvgMinutes: { inbound: 6, putaway: 9, picking: 11, outbound: 6 },
      warehouseMoves: [{ name: 'Sucursal Valle Oriente', moves: 341, percentage: 100 }],
      topZones: [{ zone: 'SHOW-01', label: 'Showroom VO', moves: 140 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '11 min',
      timeBeforePutawayMax: '25 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['341 movimientos mensuales en sucursal Valle Oriente.'],
    },
  },
  'wh-suc-cumbres': {
    today: {
      totalMoves: 11,
      pacePerHour: 2,
      peakHour: '12:00 - 13:00',
      peakHourOps: 5,
      avgProcessMinutes: 9,
      activeOrdersCount: 2,
      incidentsCount: 1,
      incidentsRate: '9.1%',
      hourlyPoints: [
        { hour: '10:00', inbound: 2, putaway: 1, picking: 0, outbound: 0, total: 3 },
        { hour: '12:00', inbound: 2, putaway: 2, picking: 2, outbound: 2, total: 8 },
      ],
      stageVolumes: { inbound: 4, putaway: 3, picking: 2, outbound: 2 },
      stageAvgMinutes: { inbound: 5, putaway: 8, picking: 10, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Cumbres', moves: 11, percentage: 100 }],
      topZones: [
        { zone: 'SHOW-03', label: 'Bahía Showroom Cumbres 03', moves: 3 },
        { zone: 'REC-SUC-CUM', label: 'Andén Recepción Traspasos Cumbres', moves: 4 },
      ],
      dayHourHeatmap: [],
      topArticles: [
        { sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', brand: 'Spring Air', category: 'Colchones', inbound: 2, putaway: 2, picking: 1, outbound: 1, totalMoves: 6, percentage: 55 },
      ],
      topLocations: [
        { code: 'SHOW-03', label: 'Bahía Showroom 03', type: 'Showroom', moves: 3, occupancyPercentage: 100 },
      ],
      operators: [
        { id: 'op-cum-1', name: 'Jorge Villarreal', role: 'Encargado Cumbres', total: 11, inbound: 4, putaway: 3, picking: 2, outbound: 2, movesCount: 11, avgTimeMinutes: 7, errorRatePercentage: 0.0, status: 'Activo' },
      ],
      slowOrders: [],
      timeBeforePutawayAvg: '11 min',
      timeBeforePutawayMax: '25 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['Recepción de traspaso OTP-2026-0045 en proceso.'],
    },
    yesterday: {
      totalMoves: 14,
      pacePerHour: 2,
      peakHour: '12:00 - 13:00',
      peakHourOps: 6,
      avgProcessMinutes: 8,
      activeOrdersCount: 0,
      incidentsCount: 0,
      incidentsRate: '0.0%',
      hourlyPoints: [
        { hour: '10:00', inbound: 2, putaway: 2, picking: 1, outbound: 1, total: 6 },
        { hour: '12:00', inbound: 2, putaway: 2, picking: 2, outbound: 2, total: 8 },
      ],
      stageVolumes: { inbound: 4, putaway: 4, picking: 3, outbound: 3 },
      stageAvgMinutes: { inbound: 5, putaway: 8, picking: 9, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Cumbres', moves: 14, percentage: 100 }],
      topZones: [{ zone: 'SHOW-01', label: 'Showroom Cumbres', moves: 4 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '10 min',
      timeBeforePutawayMax: '15 min',
      timeBeforeValidationAvg: '7 min',
      insights: ['Jornada regular en Sucursal Cumbres.'],
    },
    '7d': {
      totalMoves: 64,
      pacePerHour: 2,
      peakHour: '12:00 - 13:00',
      peakHourOps: 20,
      avgProcessMinutes: 9,
      activeOrdersCount: 2,
      incidentsCount: 1,
      incidentsRate: '1.5%',
      hourlyPoints: [
        { hour: '10:00', inbound: 8, putaway: 7, picking: 6, outbound: 6, total: 27 },
        { hour: '12:00', inbound: 10, putaway: 9, picking: 8, outbound: 8, total: 35 },
      ],
      stageVolumes: { inbound: 18, putaway: 16, picking: 14, outbound: 14 },
      stageAvgMinutes: { inbound: 5, putaway: 8, picking: 10, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Cumbres', moves: 64, percentage: 100 }],
      topZones: [{ zone: 'SHOW-03', label: 'Showroom Cumbres', moves: 25 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '10 min',
      timeBeforePutawayMax: '20 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['Semana con 64 movimientos en tienda Cumbres.'],
    },
    '30d': {
      totalMoves: 270,
      pacePerHour: 2,
      peakHour: '12:00 - 13:00',
      peakHourOps: 68,
      avgProcessMinutes: 9,
      activeOrdersCount: 2,
      incidentsCount: 2,
      incidentsRate: '0.7%',
      hourlyPoints: [
        { hour: '10:00', inbound: 36, putaway: 34, picking: 28, outbound: 28, total: 126 },
        { hour: '12:00', inbound: 40, putaway: 40, picking: 32, outbound: 32, total: 144 },
      ],
      stageVolumes: { inbound: 76, putaway: 74, picking: 60, outbound: 60 },
      stageAvgMinutes: { inbound: 5, putaway: 8, picking: 10, outbound: 5 },
      warehouseMoves: [{ name: 'Sucursal Cumbres', moves: 270, percentage: 100 }],
      topZones: [{ zone: 'SHOW-03', label: 'Showroom Cumbres', moves: 110 }],
      dayHourHeatmap: [],
      topArticles: [],
      topLocations: [],
      operators: [],
      slowOrders: [],
      timeBeforePutawayAvg: '11 min',
      timeBeforePutawayMax: '22 min',
      timeBeforeValidationAvg: '8 min',
      insights: ['270 movimientos consolidados en Sucursal Cumbres.'],
    },
  },
};

export const getTrafficDataForCedis = (period: string, warehouseId: string): TrafficDataset => {
  const cedisMap = CEDIS_TRAFFIC_DATA[warehouseId] || CEDIS_TRAFFIC_DATA['wh-mty-norte'];
  return cedisMap[period] || cedisMap.today;
};

export const PERIOD_TRAFFIC_DATA = CEDIS_TRAFFIC_DATA['wh-mty-norte'];
