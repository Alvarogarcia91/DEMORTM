import { MOCK_STOCK_ITEMS, MOCK_WAREHOUSES_LIST } from './mockInventoryData';

export interface CountPlanRecord {
  id: string;
  folio: string;
  warehouseId: string;
  warehouseName: string;
  type: 'UBICACION' | 'ARTICULO' | 'CICLICO_SUGERIDO' | 'COMPLETO';
  scope: string; // ej. 'Pasillo A (Sustratos Offset)', 'PAP-COU-090', 'Zona Cuarentena QA'
  method: 'QR_UID' | 'MANUAL';
  isBlindCount: boolean;
  totalLocations: number;
  completedLocations: number;
  totalUnitsEstimated: number;
  status: 'Activo' | 'Completado' | 'En revisión';
  createdAt: string;
  createdBy: string;
}

export interface CountTaskRecord {
  id: string;
  folio: string;
  planFolio: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  locationName: string;
  zoneType: 'RACK' | 'SHOWROOM' | 'RECEPCION' | 'RETRABAJO' | 'EMBARQUE';
  expectedUnitsCount: number;
  expectedSerials: string[];
  countedUnitsCount: number;
  countedSerials: string[];
  isBlindCount: boolean;
  status: 'Pendiente' | 'En proceso' | 'Por revisar' | 'Cerrado';
  assignedTo: string;
  hasDifference: boolean;
  differenceType?: 'Faltante' | 'Sobrante' | 'UID inesperada' | 'Diferencia serial' | 'Sin diferencia';
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CountDifferenceRecord {
  id: string;
  folio: string;
  taskFolio: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  locationName: string;
  sku: string;
  productName: string;
  uid: string;
  expectedLocation: string;
  actualLocation: string;
  expectedCount: number;
  actualCount: number;
  differenceType: 'Faltante' | 'Sobrante' | 'UID inesperada' | 'Ubicación incorrecta' | 'Cantidad diferente';
  status: 'Pendiente de revisión' | 'En recuento' | 'Investigación' | 'Aclarada';
  lastMovement: {
    date: string;
    type: string;
    user: string;
    location: string;
  };
  recountTaskFolio?: string;
  notes?: string;
}

export interface SuggestedCyclicCount {
  id: string;
  locationCode: string;
  locationName: string;
  warehouseId: string;
  warehouseName: string;
  zoneType: string;
  triggerReason: string;
  recentMovementsCount: number;
  daysSinceLastCount: number;
  urgency: 'high' | 'medium';
}

// Initial Mock Suggested Cyclic Counts
export const MOCK_SUGGESTED_COUNTS: SuggestedCyclicCount[] = [
  {
    id: 'sug-1',
    locationCode: 'A-B-03',
    locationName: 'Pasillo A · Posición 03 · Nivel B (Papel Offset)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    zoneType: 'Rack Picking',
    triggerReason: 'Alta rotación de pliegos y 18 días sin conteo físico.',
    recentMovementsCount: 34,
    daysSinceLastCount: 18,
    urgency: 'high',
  },
  {
    id: 'sug-2',
    locationCode: 'RET-NORTE',
    locationName: 'Zona de Cuarentena & Calidad QA',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    zoneType: 'Cuarentena',
    triggerReason: 'Lotes retenidos en inspección con más de 7 días.',
    recentMovementsCount: 12,
    daysSinceLastCount: 7,
    urgency: 'high',
  },
  {
    id: 'sug-3',
    locationCode: 'B-A-02',
    locationName: 'Pasillo B · Posición 02 · Nivel A (Bobinas Flexo)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    zoneType: 'Rack Bobinas',
    triggerReason: '20 movimientos de surtido y devolución de remanentes.',
    recentMovementsCount: 20,
    daysSinceLastCount: 14,
    urgency: 'medium',
  },
];

// Initial Mock Count Plans
export const MOCK_COUNT_PLANS: CountPlanRecord[] = [
  {
    id: 'plan-1',
    folio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    type: 'UBICACION',
    scope: 'Pasillo A (Sustratos Offset & Pliegos)',
    method: 'QR_UID',
    isBlindCount: true,
    totalLocations: 24,
    completedLocations: 18,
    totalUnitsEstimated: 120,
    status: 'Activo',
    createdAt: '27 Ago 2026',
    createdBy: 'Supervisor de Almacén (Carlos Medina)',
  },
  {
    id: 'plan-2',
    folio: 'PLC-2026-0020',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    type: 'ARTICULO',
    scope: 'PAP-COU-090 · Auditoría Papel Couché 90 g',
    method: 'QR_UID',
    isBlindCount: true,
    totalLocations: 8,
    completedLocations: 8,
    totalUnitsEstimated: 22000,
    status: 'En revisión',
    createdAt: '27 Ago 2026',
    createdBy: 'Auditoría de Operaciones RTM',
  },
  {
    id: 'plan-3',
    folio: 'PLC-2026-0022',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    type: 'UBICACION',
    scope: 'Zona PT-A (Etiquetas Farmacéuticas Liberadas)',
    method: 'QR_UID',
    isBlindCount: false,
    totalLocations: 12,
    completedLocations: 10,
    totalUnitsEstimated: 45,
    status: 'Activo',
    createdAt: '26 Ago 2026',
    createdBy: 'Aseguramiento de Calidad QA',
  },
];

// Initial Mock Tasks
export const MOCK_COUNT_TASKS: CountTaskRecord[] = [
  {
    id: 'task-1',
    folio: 'CC-2026-0044',
    planFolio: 'PLC-2026-0020',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-B-03',
    locationName: 'Pasillo A · Posición 03 · Nivel B',
    zoneType: 'RACK',
    expectedUnitsCount: 22000,
    expectedSerials: ['TAR-RTM-260906-182', 'TAR-RTM-260906-183'],
    countedUnitsCount: 2500,
    countedSerials: ['TAR-RTM-260906-182'],
    isBlindCount: true,
    status: 'Por revisar',
    assignedTo: 'Carlos Medina (Almacén)',
    hasDifference: true,
    differenceType: 'Faltante',
    notes: 'Discrepancia crítica demo: Sistema indicaba 22,000 pliegos pero físico arrojó 2,500 pliegos.',
    startedAt: '27 Ago 10:15',
    completedAt: '27 Ago 10:40',
  },
  {
    id: 'task-2',
    folio: 'CC-2026-0045',
    planFolio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'B-A-02',
    locationName: 'Pasillo B · Posición 02 · Nivel A (Bobinas)',
    zoneType: 'RACK',
    expectedUnitsCount: 3,
    expectedSerials: ['BOB-RTM-260906-014', 'BOB-RTM-260906-015', 'BOB-RTM-260906-016'],
    countedUnitsCount: 3,
    countedSerials: ['BOB-RTM-260906-014', 'BOB-RTM-260906-015', 'BOB-RTM-260906-016'],
    isBlindCount: true,
    status: 'Cerrado',
    assignedTo: 'Operador RF-01',
    hasDifference: false,
    notes: 'Conteo conforme 100% de bobinas identificadas.',
    startedAt: '27 Ago 09:30',
    completedAt: '27 Ago 09:48',
  },
];

// Initial Mock Differences
export const MOCK_COUNT_DIFFERENCES: CountDifferenceRecord[] = [
  {
    id: 'diff-1',
    folio: 'DIF-2026-0014',
    taskFolio: 'CC-2026-0044',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'A-B-03',
    locationName: 'Pasillo A · Posición 03 · Nivel B (Papel Offset)',
    sku: 'PAP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    uid: 'TAR-RTM-260906-183',
    expectedLocation: 'A-B-03',
    actualLocation: 'Físico en tarima parcial',
    expectedCount: 22000,
    actualCount: 2500,
    differenceType: 'Faltante',
    status: 'Investigación',
    notes: 'Escenario DEMO RTM: El sistema reflejaba 22,000 pliegos pero el conteo físico registró 2,500 pliegos (-19,500 pliegos). Se investiga posible consumo no descargado en OP previa.',
    lastMovement: {
      date: '26 Ago 2026 14:30',
      type: 'SURTIDO OP',
      user: 'Operador Offset',
      location: 'A-B-03',
    },
  },
  {
    id: 'diff-2',
    folio: 'DIF-2026-0015',
    taskFolio: 'CC-2026-0044',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    locationCode: 'B-A-04',
    locationName: 'Pasillo B · Posición 04 · Nivel A (Bobinas Flexo)',
    sku: 'FLX-BOPP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    uid: 'BOB-RTM-260906-091',
    expectedLocation: 'RET-NORTE',
    actualLocation: 'B-A-04 (Localizada físicamente)',
    expectedCount: 0,
    actualCount: 1,
    differenceType: 'UID inesperada',
    status: 'Pendiente de revisión',
    notes: 'Bobina en cuarentena QA localizada en rack operativo sin liberar.',
    lastMovement: {
      date: '26 Ago 2026 16:30',
      type: 'CUARENTENA',
      user: 'calidad_reynosa',
      location: 'RET-NORTE',
    },
  },
];
