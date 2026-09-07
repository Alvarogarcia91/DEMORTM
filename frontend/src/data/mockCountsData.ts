import { MOCK_MASTER_ARTICLES } from './mockArticlesData';
import { MOCK_STOCK_ITEMS, MOCK_WAREHOUSES_LIST } from './mockInventoryData';

export interface CountPlanRecord {
  id: string;
  folio: string;
  warehouseId: string;
  warehouseName: string;
  type: 'UBICACION' | 'ARTICULO' | 'CICLICO_SUGERIDO' | 'COMPLETO';
  scope: string; // ej. 'Pasillo A (70 posiciones)', 'SC-NAYT-FLOW-IND', 'Zonas de Alta Rotación', 'Inventario General'
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
    locationCode: 'A-C-04',
    locationName: 'Pasillo A · Posición 04 · Nivel C',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    zoneType: 'Rack Picking',
    triggerReason: 'Alta rotación operativa y 21 días sin conteo físico.',
    recentMovementsCount: 26,
    daysSinceLastCount: 21,
    urgency: 'high',
  },
  {
    id: 'sug-2',
    locationCode: 'RET-NORTE',
    locationName: 'Área de Retrabajo & Incidencias',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    zoneType: 'Retrabajo',
    triggerReason: 'Alta actividad de devoluciones e inspecciones en 48 hrs.',
    recentMovementsCount: 14,
    daysSinceLastCount: 9,
    urgency: 'high',
  },
  {
    id: 'sug-3',
    locationCode: 'EMB-02',
    locationName: 'Carril de Embarque 02 (Despacho)',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    zoneType: 'Embarque',
    triggerReason: '22 movimientos recientes y discrepancia en orden anterior.',
    recentMovementsCount: 22,
    daysSinceLastCount: 14,
    urgency: 'medium',
  },
  {
    id: 'sug-4',
    locationCode: 'SHOW-02',
    locationName: 'Showroom Bahía 02 (Valle Oriente)',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    zoneType: 'Showroom',
    triggerReason: 'Rotación reciente de colchón de exhibición para prueba de confort.',
    recentMovementsCount: 8,
    daysSinceLastCount: 15,
    urgency: 'medium',
  },
];

// Initial Mock Count Plans
export const MOCK_COUNT_PLANS: CountPlanRecord[] = [
  {
    id: 'plan-1',
    folio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    type: 'UBICACION',
    scope: 'Pasillo A (Posiciones 01 a 06)',
    method: 'QR_UID',
    isBlindCount: true,
    totalLocations: 18,
    completedLocations: 12,
    totalUnitsEstimated: 54,
    status: 'Activo',
    createdAt: '27 Ago 2026',
    createdBy: 'Supervisor de Almacén (Carlos Medina)',
  },
  {
    id: 'plan-2',
    folio: 'PLC-2026-0019',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    type: 'UBICACION',
    scope: 'Showroom Completo (SHOW-01..06) + Mini Almacén',
    method: 'QR_UID',
    isBlindCount: true,
    totalLocations: 10,
    completedLocations: 4,
    totalUnitsEstimated: 24,
    status: 'Activo',
    createdAt: '28 Ago 2026',
    createdBy: 'Gerente Sucursal (Valle Ote)',
  },
  {
    id: 'plan-3',
    folio: 'PLC-2026-0015',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    type: 'ARTICULO',
    scope: 'SC-NAYT-FLOW-IND (Nayt Flow Individual)',
    method: 'QR_UID',
    isBlindCount: false,
    totalLocations: 6,
    completedLocations: 6,
    totalUnitsEstimated: 28,
    status: 'Completado',
    createdAt: '25 Ago 2026',
    createdBy: 'Auditor de Inventarios',
  },
];

// Initial Mock Count Tasks
export const MOCK_COUNT_TASKS: CountTaskRecord[] = [
  {
    id: 'task-1',
    folio: 'CC-2026-0042',
    planFolio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-C-04',
    locationName: 'Pasillo A · Posición 04 · Nivel C (Superior)',
    zoneType: 'RACK',
    expectedUnitsCount: 4,
    expectedSerials: [
      'SC-UID-2026-000171',
      'SC-UID-2026-000172',
      'SC-UID-2026-000173',
      'SC-UID-2026-000174'
    ],
    countedUnitsCount: 0,
    countedSerials: [],
    isBlindCount: true,
    status: 'Pendiente',
    assignedTo: 'Operador RF Demo (Roberto Garza)',
    hasDifference: false,
  },
  {
    id: 'task-2',
    folio: 'CC-2026-0043',
    planFolio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-B-04',
    locationName: 'Pasillo A · Posición 04 · Nivel B (Medio)',
    zoneType: 'RACK',
    expectedUnitsCount: 3,
    expectedSerials: [
      'SC-UID-2026-000184',
      'SC-UID-2026-000185',
      'SC-UID-2026-000186'
    ],
    countedUnitsCount: 3,
    countedSerials: [
      'SC-UID-2026-000184',
      'SC-UID-2026-000185',
      'SC-UID-2026-000186'
    ],
    isBlindCount: true,
    status: 'Cerrado',
    assignedTo: 'Operador RF Demo (Roberto Garza)',
    hasDifference: false,
    differenceType: 'Sin diferencia',
    completedAt: '28 Ago 2026, 10:15',
  },
  {
    id: 'task-3',
    folio: 'CC-2026-0044',
    planFolio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-A-04',
    locationName: 'Pasillo A · Posición 04 · Nivel A (Piso)',
    zoneType: 'RACK',
    expectedUnitsCount: 3,
    expectedSerials: [
      'SC-UID-2026-000191',
      'SC-UID-2026-000192',
      'SC-UID-2026-000193'
    ],
    countedUnitsCount: 3,
    countedSerials: [
      'SC-UID-2026-000191',
      'SC-UID-2026-000193',
      'SC-UID-2026-000333' // Inesperada
    ],
    isBlindCount: true,
    status: 'Por revisar',
    assignedTo: 'Operador RF Demo (Roberto Garza)',
    hasDifference: true,
    differenceType: 'Diferencia serial',
    notes: 'Cantidad coincide (3 vs 3) pero falta SC-UID-2026-000192 y se encontró SC-UID-2026-000333.',
    completedAt: '28 Ago 2026, 11:30',
  },
  {
    id: 'task-4',
    folio: 'CC-2026-0045',
    planFolio: 'PLC-2026-0019',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    locationCode: 'SHOW-01',
    locationName: 'Showroom Bahía 01 (Exhibición Confort)',
    zoneType: 'SHOWROOM',
    expectedUnitsCount: 1,
    expectedSerials: ['SC-UID-2026-000084'],
    countedUnitsCount: 0,
    countedSerials: [],
    isBlindCount: true,
    status: 'Pendiente',
    assignedTo: 'Asesor Sucursal (Valle Ote)',
    hasDifference: false,
  },
  {
    id: 'task-5',
    folio: 'CC-2026-0046',
    planFolio: 'PLC-2026-0018',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'RET-NORTE',
    locationName: 'Área de Retrabajo & Incidencias',
    zoneType: 'RETRABAJO',
    expectedUnitsCount: 7,
    expectedSerials: [
      'SC-UID-2026-000091',
      'SC-UID-2026-000092',
      'SC-UID-2026-000093',
      'SC-UID-2026-000094',
      'SC-UID-2026-000095',
      'SC-UID-2026-000096',
      'SC-UID-2026-000097'
    ],
    countedUnitsCount: 0,
    countedSerials: [],
    isBlindCount: true,
    status: 'Pendiente',
    assignedTo: 'Supervisor Calidad',
    hasDifference: false,
  },
];

// Initial Mock Differences
export const MOCK_COUNT_DIFFERENCES: CountDifferenceRecord[] = [
  {
    id: 'diff-1',
    folio: 'DIF-2026-0014',
    taskFolio: 'CC-2026-0044',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-A-04',
    locationName: 'Pasillo A · Posición 04 · Nivel A (Piso)',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    uid: 'SC-UID-2026-000192',
    expectedLocation: 'A-A-04',
    actualLocation: 'No localizada',
    expectedCount: 1,
    actualCount: 0,
    differenceType: 'Faltante',
    status: 'Pendiente de revisión',
    lastMovement: {
      date: '26 Ago 2026 16:40',
      type: 'ACOMODO',
      user: 'Operador RF-02',
      location: 'A-A-04',
    },
  },
  {
    id: 'diff-2',
    folio: 'DIF-2026-0015',
    taskFolio: 'CC-2026-0044',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'A-A-04',
    locationName: 'Pasillo A · Posición 04 · Nivel A (Piso)',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    uid: 'SC-UID-2026-000333',
    expectedLocation: 'B-C-06',
    actualLocation: 'A-A-04 (Encontrada físicamente)',
    expectedCount: 0,
    actualCount: 1,
    differenceType: 'UID inesperada',
    status: 'Pendiente de revisión',
    lastMovement: {
      date: '27 Ago 2026 11:20',
      type: 'ACOMODO',
      user: 'Operador RF-01',
      location: 'B-C-06',
    },
  },
  {
    id: 'diff-3',
    folio: 'DIF-2026-0012',
    taskFolio: 'CC-2026-0038',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    locationCode: 'E-C-10',
    locationName: 'Pasillo E · Posición 10 · Nivel C',
    sku: 'SC-SEA-CLB-KS',
    productName: 'Sealy Colchón Crown Jewel King Size',
    uid: 'SC-UID-2026-000078',
    expectedLocation: 'E-C-10',
    actualLocation: 'E-C-10',
    expectedCount: 2,
    actualCount: 1,
    differenceType: 'Cantidad diferente',
    status: 'En recuento',
    recountTaskFolio: 'RC-2026-0012',
    lastMovement: {
      date: '24 Ago 2026 09:15',
      type: 'RETRABAJO',
      user: 'Control de Calidad',
      location: 'E-C-10',
    },
  },
];
