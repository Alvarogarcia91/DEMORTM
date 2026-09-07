import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';
import { MOCK_STOCK_ITEMS, MOCK_WAREHOUSES_LIST, MOCK_INVENTORY_MOVEMENTS, StockItemRecord } from './mockInventoryData';

export interface NodeDashboardData {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  type: 'CEDIS' | 'SUCURSAL';
  kpis: {
    totalUnits: number;
    inventoryCostValue: number; // in MXN
    costBreakdown: {
      available: number;
      committed: number;
      inTransit: number;
      rework: number;
    };
    availableUnits: number;
    committedUnits: number;
    inTransitUnits: number;
    occupancyPercentage: number;
    reworkUnits: number;
    avgAgeDays: number;
  };
  todayOperations: {
    received: number;
    pendingStaging: number;
    picked: number;
    staged: number;
    transfersInTransit: number;
  };
  alerts: {
    id: string;
    type: 'critical_age' | 'rearrangement' | 'rework' | 'transfer' | 'high_occupancy';
    title: string;
    description: string;
    ctaLabel: string;
    ctaAction: 'stocks' | 'rearrangements' | 'rework' | 'transfers' | 'map';
    severity: 'danger' | 'warning' | 'info';
  }[];
  inventoryHealth: {
    sku: string;
    name: string;
    category: string;
    brand: string;
    available: number;
    committed: number;
    inTransit: number;
    avgAge: number;
    status: 'Alta rotación' | 'Saludable' | 'Cobertura baja' | 'Sin movimiento' | 'En tránsito';
  }[];
  layoutSummary: {
    activeSuggestions: number;
    savedMetersPerDay: number;
    topRecommendations: {
      sku: string;
      productName: string;
      fromLocation: string;
      toLocation: string;
      reason: string;
    }[];
  };
  specialZones: {
    reception: { capacity: number; occupied: number; label: string };
    rework: { capacity: number; occupied: number; label: string };
    shipping: { capacity: number; occupied: number; label: string };
    showroom?: { capacity: number; occupied: number; label: string };
  };
}

// Approximate internal cost per SKU for realistic financial valuation
export const ARTICLE_UNIT_COST: Record<string, number> = {
  'SC-NAYT-FLOW-IND': 2850,
  'SC-NAYT-FLOW-MAT': 3450,
  'SC-NAYT-PRO-QS': 4900,
  'SC-NAYT-PRO-KS': 6200,
  'SC-SPA-REC-IND': 2750,
  'SC-SPA-REC-MAT': 3300,
  'SC-SPA-VEN-MAT': 3900,
  'SC-SPA-PAL-QS': 5100,
  'SC-RES-ORT-MAT': 3650,
  'SC-RES-FAN-MAT': 4100,
  'SC-RES-MNC-QS': 5400,
  'SC-AME-HAL-QS': 4800,
  'SC-AME-OXF-MAT': 3550,
  'SC-SEA-CLB-KS': 7800,
  'SC-SEA-CRW-KS': 8500,
  'SC-THE-GEL-KS': 7200,
  'SC-BAS-SPA-MAT': 1850,
  'SC-BAS-NYT-IND': 1450,
  'SC-ALM-SOG-NUO': 390,
  'SC-ALM-RES-GEL': 480,
  'SC-PRO-SOG-QS': 450,
  'SC-PRO-SOG-CUB-MAT': 520,
};

export function getArticleUnitCost(sku: string): number {
  return ARTICLE_UNIT_COST[sku] || 3200;
}

// Data generator per node for Dashboard
export const NODE_DASHBOARD_DATA: Record<string, NodeDashboardData> = {
  'wh-mty-norte': {
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    warehouseCode: 'CEDIS-NORTE',
    type: 'CEDIS',
    kpis: {
      totalUnits: 1284,
      inventoryCostValue: 3824500,
      costBreakdown: {
        available: 3086000,
        committed: 440500,
        inTransit: 298000,
        rework: 21000,
      },
      availableUnits: 1036,
      committedUnits: 148,
      inTransitUnits: 100,
      occupancyPercentage: 68.2,
      reworkUnits: 7,
      avgAgeDays: 14.2,
    },
    todayOperations: {
      received: 34,
      pendingStaging: 21,
      picked: 46,
      staged: 29,
      transfersInTransit: 15,
    },
    alerts: [
      {
        id: 'alt-1',
        type: 'critical_age',
        title: '6 unidades con antigüedad crítica (>30 días)',
        description: 'Colchones King Size en Pasillo E requieren rotación prioritaria por tiempo en almacén.',
        ctaLabel: 'Ver unidades',
        ctaAction: 'stocks',
        severity: 'warning',
      },
      {
        id: 'alt-2',
        type: 'rearrangement',
        title: '4 reacomodos sugeridos de optimización',
        description: 'Mover SKUs de alta rotación al Pasillo A ahorrará 287 m de recorrido diario.',
        ctaLabel: 'Ver reacomodos',
        ctaAction: 'rearrangements',
        severity: 'info',
      },
      {
        id: 'alt-3',
        type: 'rework',
        title: '2 unidades con más de 48 hrs en retrabajo',
        description: 'Colchones con empaque observado en rampa de recibo pendientes de validación.',
        ctaLabel: 'Ver retrabajo',
        ctaAction: 'rework',
        severity: 'danger',
      },
      {
        id: 'alt-4',
        type: 'transfer',
        title: 'Traspaso OTP-2026-0042 en preparación',
        description: 'Destino Sucursal Valle Oriente (5 unidades Nayt Flow) programado para hoy.',
        ctaLabel: 'Ver traspaso',
        ctaAction: 'transfers',
        severity: 'info',
      },
      {
        id: 'alt-5',
        type: 'high_occupancy',
        title: 'Pasillo A con ocupación del 92%',
        description: 'Espacio de alta rotación cerca del límite de capacidad en nivel A y B.',
        ctaLabel: 'Ver mapa',
        ctaAction: 'map',
        severity: 'warning',
      },
    ],
    inventoryHealth: [
      { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', category: 'Colchones', brand: 'Nayt', available: 24, committed: 8, inTransit: 5, avgAge: 6.4, status: 'Alta rotación' },
      { sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', category: 'Colchones', brand: 'Nayt', available: 19, committed: 4, inTransit: 0, avgAge: 9.1, status: 'Saludable' },
      { sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', category: 'Colchones', brand: 'Spring Air', available: 16, committed: 6, inTransit: 3, avgAge: 8.5, status: 'Alta rotación' },
      { sku: 'SC-RES-ORT-MAT', name: 'Restonic Colchón Ortopédico Matrimonial', category: 'Colchones', brand: 'Restonic', available: 5, committed: 7, inTransit: 0, avgAge: 18.3, status: 'Cobertura baja' },
      { sku: 'SC-SEA-CLB-KS', name: 'Sealy Colchón Crown Jewel King Size', category: 'Colchones', brand: 'Sealy', available: 12, committed: 1, inTransit: 2, avgAge: 38.6, status: 'Sin movimiento' },
      { sku: 'SC-BAS-NYT-IND', name: 'Nayt Base Cama Smart Metal Individual', category: 'Bases', brand: 'Nayt', available: 28, committed: 5, inTransit: 8, avgAge: 11.2, status: 'Saludable' },
      { sku: 'SC-ALM-SOG-NUO', name: 'Sognare Almohada Nuube Estándar', category: 'Almohadas', brand: 'Sognare', available: 65, committed: 14, inTransit: 12, avgAge: 7.8, status: 'Alta rotación' },
    ],
    layoutSummary: {
      activeSuggestions: 4,
      savedMetersPerDay: 287,
      topRecommendations: [
        { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Individual', fromLocation: 'E-C-10', toLocation: 'A-B-03', reason: 'Acercar artículo A de alta rotación al carril de embarque' },
        { sku: 'SC-RES-FAN-MAT', productName: 'Restonic Colchón Fantasy Matrimonial', fromLocation: 'D-C-07', toLocation: 'A-A-06', reason: 'Consolidar espacio vacío en nivel piso para picking rápido' },
      ],
    },
    specialZones: {
      reception: { capacity: 20, occupied: 3, label: 'Rampa de Descarga REC-01 / REC-02' },
      rework: { capacity: 10, occupied: 7, label: 'Zona de Incidencias & Retrabajo' },
      shipping: { capacity: 30, occupied: 12, label: '5 Carriles de Embarque EMB-01..05' },
    },
  },

  'wh-mty-sur': {
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    warehouseCode: 'CEDIS-SUR',
    type: 'CEDIS',
    kpis: {
      totalUnits: 980,
      inventoryCostValue: 2940000,
      costBreakdown: {
        available: 2410000,
        committed: 320000,
        inTransit: 185000,
        rework: 25000,
      },
      availableUnits: 804,
      committedUnits: 108,
      inTransitUnits: 68,
      occupancyPercentage: 54.8,
      reworkUnits: 5,
      avgAgeDays: 16.5,
    },
    todayOperations: {
      received: 22,
      pendingStaging: 14,
      picked: 31,
      staged: 18,
      transfersInTransit: 10,
    },
    alerts: [
      {
        id: 'alt-sur-1',
        type: 'critical_age',
        title: '4 unidades con más de 35 días',
        description: 'Modelos Therapedic King Size en pasillo D.',
        ctaLabel: 'Ver unidades',
        ctaAction: 'stocks',
        severity: 'warning',
      },
      {
        id: 'alt-sur-2',
        type: 'rearrangement',
        title: '2 reacomodos sugeridos',
        description: 'Reacomodar bases Spring Air a nivel de piso.',
        ctaLabel: 'Ver reacomodos',
        ctaAction: 'rearrangements',
        severity: 'info',
      },
      {
        id: 'alt-sur-3',
        type: 'transfer',
        title: 'Traspaso entrante desde CEDIS Norte',
        description: '20 piezas programadas para entrega mañana.',
        ctaLabel: 'Ver traspasos',
        ctaAction: 'transfers',
        severity: 'info',
      },
    ],
    inventoryHealth: [
      { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', category: 'Colchones', brand: 'Nayt', available: 18, committed: 4, inTransit: 0, avgAge: 8.2, status: 'Saludable' },
      { sku: 'SC-SPA-REC-MAT', name: 'Spring Air Colchón Record Matrimonial', category: 'Colchones', brand: 'Spring Air', available: 14, committed: 5, inTransit: 0, avgAge: 12.0, status: 'Saludable' },
      { sku: 'SC-THE-GEL-KS', name: 'Therapedic Colchón Memory Gel King Size', category: 'Colchones', brand: 'Therapedic', available: 8, committed: 0, inTransit: 0, avgAge: 36.2, status: 'Sin movimiento' },
    ],
    layoutSummary: {
      activeSuggestions: 2,
      savedMetersPerDay: 145,
      topRecommendations: [
        { sku: 'SC-SPA-REC-MAT', productName: 'Spring Air Record Matrimonial', fromLocation: 'D-B-04', toLocation: 'A-A-02', reason: 'Optimizar ruta hacia rampa sur' },
      ],
    },
    specialZones: {
      reception: { capacity: 20, occupied: 2, label: 'Rampa de Descarga REC-SUR' },
      rework: { capacity: 10, occupied: 5, label: 'Bahía de Retrabajo Sur' },
      shipping: { capacity: 30, occupied: 8, label: '5 Carriles de Embarque EMB-SUR' },
    },
  },

  'wh-suc-valle-oriente': {
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    warehouseCode: 'SUC-VALLE',
    type: 'SUCURSAL',
    kpis: {
      totalUnits: 86,
      inventoryCostValue: 248600,
      costBreakdown: {
        available: 182000,
        committed: 38000,
        inTransit: 24500,
        rework: 4100,
      },
      availableUnits: 64,
      committedUnits: 14,
      inTransitUnits: 8,
      occupancyPercentage: 71.6,
      reworkUnits: 1,
      avgAgeDays: 9.8,
    },
    todayOperations: {
      received: 8,
      pendingStaging: 2,
      picked: 9,
      staged: 6,
      transfersInTransit: 5,
    },
    alerts: [
      {
        id: 'alt-valle-1',
        type: 'transfer',
        title: 'Traspaso OTP-2026-0044 en camino',
        description: '5 colchones Nayt Flow Individual resurtidos desde CEDIS Norte.',
        ctaLabel: 'Ver traspaso',
        ctaAction: 'transfers',
        severity: 'info',
      },
      {
        id: 'alt-valle-2',
        type: 'critical_age',
        title: 'Showroom: 6 bahías ocupadas al 100%',
        description: 'Exhibición completa de modelos para prueba de confort.',
        ctaLabel: 'Ver showroom',
        ctaAction: 'map',
        severity: 'info',
      },
    ],
    inventoryHealth: [
      { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', category: 'Colchones', brand: 'Nayt', available: 2, committed: 4, inTransit: 5, avgAge: 4.1, status: 'Cobertura baja' },
      { sku: 'SC-SPA-REC-MAT', name: 'Spring Air Colchón Record Matrimonial', category: 'Colchones', brand: 'Spring Air', available: 5, committed: 1, inTransit: 0, avgAge: 7.9, status: 'Saludable' },
      { sku: 'SC-ALM-SOG-NUO', name: 'Sognare Almohada Nuube Estándar', category: 'Almohadas', brand: 'Sognare', available: 16, committed: 3, inTransit: 6, avgAge: 5.4, status: 'Alta rotación' },
    ],
    layoutSummary: {
      activeSuggestions: 1,
      savedMetersPerDay: 48,
      topRecommendations: [
        { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Individual', fromLocation: 'MINI-RACK-02', toLocation: 'ENTR-01', reason: 'Preparar para entrega local a cliente' },
      ],
    },
    specialZones: {
      showroom: { capacity: 6, occupied: 6, label: '6 Bahías SHOW-01..06 de Exhibición' },
      reception: { capacity: 6, occupied: 1, label: 'Recepción y Andén de Descarga' },
      rework: { capacity: 3, occupied: 1, label: 'Incidencias Retail' },
      shipping: { capacity: 4, occupied: 2, label: 'Carriles de Entrega Local' },
    },
  },

  'wh-suc-cumbres': {
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    warehouseCode: 'SUC-CUMBRES',
    type: 'SUCURSAL',
    kpis: {
      totalUnits: 72,
      inventoryCostValue: 209500,
      costBreakdown: {
        available: 154000,
        committed: 32000,
        inTransit: 19500,
        rework: 4000,
      },
      availableUnits: 53,
      committedUnits: 11,
      inTransitUnits: 8,
      occupancyPercentage: 60.0,
      reworkUnits: 1,
      avgAgeDays: 11.4,
    },
    todayOperations: {
      received: 6,
      pendingStaging: 3,
      picked: 7,
      staged: 4,
      transfersInTransit: 6,
    },
    alerts: [
      {
        id: 'alt-cum-1',
        type: 'transfer',
        title: 'Traspaso semanal pendiente de arribo',
        description: 'Resurtido de almohadas y protectores desde CEDIS Norte.',
        ctaLabel: 'Ver traspaso',
        ctaAction: 'transfers',
        severity: 'info',
      },
    ],
    inventoryHealth: [
      { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', category: 'Colchones', brand: 'Nayt', available: 4, committed: 2, inTransit: 3, avgAge: 6.2, status: 'Saludable' },
      { sku: 'SC-RES-FAN-MAT', name: 'Restonic Colchón Fantasy Matrimonial', category: 'Colchones', brand: 'Restonic', available: 3, committed: 1, inTransit: 0, avgAge: 14.5, status: 'Saludable' },
    ],
    layoutSummary: {
      activeSuggestions: 1,
      savedMetersPerDay: 36,
      topRecommendations: [
        { sku: 'SC-RES-FAN-MAT', productName: 'Restonic Fantasy Matrimonial', fromLocation: 'MINI-RACK-01', toLocation: 'SHOW-03', reason: 'Rotar modelo a showroom' },
      ],
    },
    specialZones: {
      showroom: { capacity: 6, occupied: 5, label: '6 Bahías SHOW-01..06 de Exhibición' },
      reception: { capacity: 6, occupied: 1, label: 'Recepción y Andén de Descarga' },
      rework: { capacity: 3, occupied: 1, label: 'Incidencias Retail' },
      shipping: { capacity: 4, occupied: 1, label: 'Carriles de Entrega Local' },
    },
  },
};

// =========================================================================
// ANALYTICS DATASET MODEL
// =========================================================================
export interface AnalyticsDataset {
  period: string; // 'Hoy' | '7 días' | '30 días' | '90 días' | '6 meses' | '12 meses'
  warehouseFilter: string;
  kpis: {
    totalMovements: number;
    avgTurnoverRate: number; // e.g. 8.4x / year
    avgInventoryValue: number; // in MXN
    avgDaysInWarehouse: number;
    avgOccupancyPercentage: number;
  };
  movementTrends: {
    label: string; // e.g. 'Semana 1', 'Semana 2', or Day
    entries: number;
    staging: number;
    rearrangements: number;
    picking: number;
    transfers: number;
    shipping: number;
    total: number;
  }[];
  inventoryByStatus: {
    status: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  topMovedArticles: {
    sku: string;
    name: string;
    brand: string;
    category: string;
    movementsCount: number;
    percentage: number;
  }[];
  idleArticles: {
    sku: string;
    name: string;
    brand: string;
    category: string;
    stockUnits: number;
    daysWithoutMovement: number;
    tiedCapital: number;
  }[];
  zoneOccupancy: {
    zone: string;
    capacity: number;
    occupied: number;
    percentage: number;
  }[];
  brandValueBreakdown: {
    brand: string;
    costValue: number;
    percentage: number;
    unitsCount: number;
  }[];
  ageDistribution: {
    range: string;
    units: number;
    percentage: number;
    valueMxn: number;
  }[];
  rotationClassification: {
    category: 'Alta rotación' | 'Media rotación' | 'Baja rotación' | 'Sin movimiento';
    skusCount: number;
    unitsCount: number;
    percentage: number;
    description: string;
  }[];
  weeklyActivityMatrix: {
    day: string;
    hours: {
      timeSlot: string; // '06-09h', '09-12h', '12-15h', '15-18h', '18-21h'
      activityLevel: number; // 0 to 100
      opsCount: number;
    }[];
  }[];
  topLocations: {
    mostActive: { code: string; name: string; type: string; opsCount: number; status: string }[];
    leastUsed: { code: string; name: string; type: string; opsCount: number; status: string }[];
  };
  insights: {
    id: string;
    title: string;
    description: string;
    metric: string;
    type: 'positive' | 'warning' | 'opportunity';
  }[];
}

export const MOCK_ANALYTICS_DATA_30D: AnalyticsDataset = {
  period: '30 días',
  warehouseFilter: 'all',
  kpis: {
    totalMovements: 1482,
    avgTurnoverRate: 8.4,
    avgInventoryValue: 3942000,
    avgDaysInWarehouse: 14.8,
    avgOccupancyPercentage: 71.4,
  },
  movementTrends: [
    { label: 'Sem 1 (1-7 Ago)', entries: 84, staging: 68, rearrangements: 38, picking: 112, transfers: 42, shipping: 98, total: 442 },
    { label: 'Sem 2 (8-14 Ago)', entries: 62, staging: 54, rearrangements: 44, picking: 98, transfers: 36, shipping: 86, total: 380 },
    { label: 'Sem 3 (15-21 Ago)', entries: 78, staging: 72, rearrangements: 51, picking: 124, transfers: 48, shipping: 104, total: 477 },
    { label: 'Sem 4 (22-28 Ago)', entries: 95, staging: 84, rearrangements: 58, picking: 142, transfers: 56, shipping: 122, total: 557 },
  ],
  inventoryByStatus: [
    { status: 'Disponible', count: 1894, percentage: 78.2, color: 'bg-emerald-500 text-emerald-500 border-emerald-500' },
    { status: 'Comprometido', count: 267, percentage: 11.0, color: 'bg-amber-500 text-amber-500 border-amber-500' },
    { status: 'En tránsito', count: 176, percentage: 7.3, color: 'bg-blue-500 text-blue-500 border-blue-500' },
    { status: 'En retrabajo', count: 14, percentage: 0.6, color: 'bg-rose-500 text-rose-500 border-rose-500' },
    { status: 'En embarque', count: 52, percentage: 2.1, color: 'bg-indigo-500 text-indigo-500 border-indigo-500' },
    { status: 'En exhibición', count: 19, percentage: 0.8, color: 'bg-purple-500 text-purple-500 border-purple-500' },
  ],
  topMovedArticles: [
    { sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', category: 'Colchones', movementsCount: 284, percentage: 19.2 },
    { sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', category: 'Colchones', movementsCount: 218, percentage: 14.7 },
    { sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', brand: 'Spring Air', category: 'Colchones', movementsCount: 176, percentage: 11.9 },
    { sku: 'SC-ALM-SOG-NUO', name: 'Sognare Almohada Nuube Estándar', brand: 'Sognare', category: 'Almohadas', movementsCount: 162, percentage: 10.9 },
    { sku: 'SC-BAS-NYT-IND', name: 'Nayt Base Cama Smart Metal Individual', brand: 'Nayt', category: 'Bases', movementsCount: 134, percentage: 9.0 },
    { sku: 'SC-SPA-REC-MAT', name: 'Spring Air Colchón Record Matrimonial', brand: 'Spring Air', category: 'Colchones', movementsCount: 118, percentage: 8.0 },
    { sku: 'SC-RES-ORT-MAT', name: 'Restonic Colchón Ortopédico Matrimonial', brand: 'Restonic', category: 'Colchones', movementsCount: 96, percentage: 6.5 },
    { sku: 'SC-PRO-SOG-QS', name: 'Sognare Protector Colchón Queen Size', brand: 'Sognare', category: 'Protectores', movementsCount: 88, percentage: 5.9 },
    { sku: 'SC-NAYT-PRO-QS', name: 'Nayt Colchón Flow Pro Queen Size', brand: 'Nayt', category: 'Colchones', movementsCount: 74, percentage: 5.0 },
    { sku: 'SC-AME-HAL-QS', name: 'América Colchón Hall Queen Size', brand: 'América', category: 'Colchones', movementsCount: 68, percentage: 4.6 },
  ],
  idleArticles: [
    { sku: 'SC-SEA-CLB-KS', name: 'Sealy Colchón Crown Jewel King Size', brand: 'Sealy', category: 'Colchones', stockUnits: 18, daysWithoutMovement: 38, tiedCapital: 140400 },
    { sku: 'SC-THE-GEL-KS', name: 'Therapedic Colchón Memory Gel King Size', brand: 'Therapedic', category: 'Colchones', stockUnits: 12, daysWithoutMovement: 34, tiedCapital: 86400 },
    { sku: 'SC-SEA-CRW-KS', name: 'Sealy Colchón Crown Prestige King Size', brand: 'Sealy', category: 'Colchones', stockUnits: 8, daysWithoutMovement: 29, tiedCapital: 68000 },
    { sku: 'SC-SPA-PAL-QS', name: 'Spring Air Colchón Palladium Queen Size', brand: 'Spring Air', category: 'Colchones', stockUnits: 7, daysWithoutMovement: 26, tiedCapital: 35700 },
    { sku: 'SC-RES-MNC-QS', name: 'Restonic Colchón Mónaco Queen Size', brand: 'Restonic', category: 'Colchones', stockUnits: 5, daysWithoutMovement: 24, tiedCapital: 27000 },
  ],
  zoneOccupancy: [
    { zone: 'Pasillo A (Racks de Picking Rápido)', capacity: 70, occupied: 64, percentage: 91.4 },
    { zone: 'Pasillo B (Racks Selectivos)', capacity: 70, occupied: 52, percentage: 74.3 },
    { zone: 'Pasillo C (Racks Medios)', capacity: 70, occupied: 46, percentage: 65.7 },
    { zone: 'Pasillo D (Almacenamiento)', capacity: 70, occupied: 41, percentage: 58.6 },
    { zone: 'Pasillo E (Alta Densidad)', capacity: 70, occupied: 38, percentage: 54.3 },
    { zone: 'Recepción & Descarga', capacity: 20, occupied: 4, percentage: 20.0 },
    { zone: 'Retrabajo & Incidencias', capacity: 10, occupied: 7, percentage: 70.0 },
    { zone: 'Carriles de Embarque', capacity: 30, occupied: 12, percentage: 40.0 },
    { zone: 'Showrooms Retail', capacity: 12, occupied: 11, percentage: 91.7 },
  ],
  brandValueBreakdown: [
    { brand: 'Nayt', costValue: 1284000, percentage: 32.6, unitsCount: 396 },
    { brand: 'Spring Air', costValue: 968000, percentage: 24.6, unitsCount: 264 },
    { brand: 'Restonic', costValue: 642000, percentage: 16.3, unitsCount: 168 },
    { brand: 'Sealy', costValue: 485000, percentage: 12.3, unitsCount: 62 },
    { brand: 'Therapedic', costValue: 288000, percentage: 7.3, unitsCount: 40 },
    { brand: 'Sognare', costValue: 175000, percentage: 4.4, unitsCount: 412 },
    { brand: 'América', costValue: 100000, percentage: 2.5, unitsCount: 26 },
  ],
  ageDistribution: [
    { range: '0 - 7 días (Ingreso reciente)', units: 824, percentage: 34.0, valueMxn: 1345000 },
    { range: '8 - 15 días (Rotación normal)', units: 762, percentage: 31.5, valueMxn: 1210000 },
    { range: '16 - 30 días (Supervisión)', units: 586, percentage: 24.2, valueMxn: 912000 },
    { range: '31 - 60 días (Baja rotación)', units: 198, percentage: 8.2, valueMxn: 368000 },
    { range: '60+ días (Crítico / Envejecido)', units: 52, percentage: 2.1, valueMxn: 107000 },
  ],
  rotationClassification: [
    { category: 'Alta rotación', skusCount: 6, unitsCount: 1042, percentage: 43.0, description: 'Rotación menor a 10 días, representa 58% de las órdenes de despacho.' },
    { category: 'Media rotación', skusCount: 9, unitsCount: 894, percentage: 36.9, description: 'Rotación entre 11 y 25 días, inventario base de amortiguamiento.' },
    { category: 'Baja rotación', skusCount: 5, unitsCount: 386, percentage: 16.0, description: 'Rotación entre 26 y 45 días, requiere seguimiento de cobertura.' },
    { category: 'Sin movimiento', skusCount: 2, unitsCount: 100, percentage: 4.1, description: 'Más de 45 días sin salidas, candidato para promociones o reacomodo.' },
  ],
  weeklyActivityMatrix: [
    { day: 'Lunes', hours: [{ timeSlot: '06-09h', activityLevel: 65, opsCount: 38 }, { timeSlot: '09-12h', activityLevel: 95, opsCount: 62 }, { timeSlot: '12-15h', activityLevel: 70, opsCount: 44 }, { timeSlot: '15-18h', activityLevel: 88, opsCount: 56 }, { timeSlot: '18-21h', activityLevel: 30, opsCount: 18 }] },
    { day: 'Martes', hours: [{ timeSlot: '06-09h', activityLevel: 55, opsCount: 32 }, { timeSlot: '09-12h', activityLevel: 88, opsCount: 58 }, { timeSlot: '12-15h', activityLevel: 60, opsCount: 38 }, { timeSlot: '15-18h', activityLevel: 80, opsCount: 52 }, { timeSlot: '18-21h', activityLevel: 25, opsCount: 14 }] },
    { day: 'Miércoles', hours: [{ timeSlot: '06-09h', activityLevel: 60, opsCount: 35 }, { timeSlot: '09-12h', activityLevel: 92, opsCount: 60 }, { timeSlot: '12-15h', activityLevel: 75, opsCount: 48 }, { timeSlot: '15-18h', activityLevel: 85, opsCount: 54 }, { timeSlot: '18-21h', activityLevel: 35, opsCount: 22 }] },
    { day: 'Jueves', hours: [{ timeSlot: '06-09h', activityLevel: 70, opsCount: 42 }, { timeSlot: '09-12h', activityLevel: 100, opsCount: 68 }, { timeSlot: '12-15h', activityLevel: 80, opsCount: 52 }, { timeSlot: '15-18h', activityLevel: 90, opsCount: 59 }, { timeSlot: '18-21h', activityLevel: 40, opsCount: 26 }] },
    { day: 'Viernes', hours: [{ timeSlot: '06-09h', activityLevel: 85, opsCount: 54 }, { timeSlot: '09-12h', activityLevel: 98, opsCount: 65 }, { timeSlot: '12-15h', activityLevel: 85, opsCount: 55 }, { timeSlot: '15-18h', activityLevel: 95, opsCount: 63 }, { timeSlot: '18-21h', activityLevel: 50, opsCount: 32 }] },
    { day: 'Sábado', hours: [{ timeSlot: '06-09h', activityLevel: 45, opsCount: 26 }, { timeSlot: '09-12h', activityLevel: 75, opsCount: 46 }, { timeSlot: '12-15h', activityLevel: 50, opsCount: 30 }, { timeSlot: '15-18h', activityLevel: 35, opsCount: 20 }, { timeSlot: '18-21h', activityLevel: 15, opsCount: 8 }] },
  ],
  topLocations: {
    mostActive: [
      { code: 'A-B-04', name: 'Pasillo A · Pos 04 · Nivel B', type: 'Rack Picking', opsCount: 142, status: 'Alta Demanda' },
      { code: 'A-A-02', name: 'Pasillo A · Pos 02 · Nivel A (Piso)', type: 'Rack Picking', opsCount: 128, status: 'Alta Demanda' },
      { code: 'B-B-03', name: 'Pasillo B · Pos 03 · Nivel B', type: 'Rack Selectivo', opsCount: 114, status: 'Frecuente' },
      { code: 'EMB-01', name: 'Carril de Embarque 01', type: 'Despacho', opsCount: 98, status: 'Operativo' },
      { code: 'SHOW-01', name: 'Showroom Bahía 01 (Valle Ote)', type: 'Exhibición', opsCount: 86, status: 'Prueba Confort' },
    ],
    leastUsed: [
      { code: 'E-C-10', name: 'Pasillo E · Pos 10 · Nivel C (Superior)', type: 'Rack Alto', opsCount: 4, status: 'Candidato Reacomodo' },
      { code: 'E-C-09', name: 'Pasillo E · Pos 09 · Nivel C (Superior)', type: 'Rack Alto', opsCount: 6, status: 'Baja Demanda' },
      { code: 'D-C-10', name: 'Pasillo D · Pos 10 · Nivel C', type: 'Rack Alto', opsCount: 8, status: 'Baja Demanda' },
      { code: 'D-C-09', name: 'Pasillo D · Pos 09 · Nivel C', type: 'Rack Alto', opsCount: 9, status: 'Baja Demanda' },
    ],
  },
  insights: [
    {
      id: 'ins-1',
      title: 'Nayt Flow Individual incrementó 28% su actividad',
      description: 'El modelo estrella de la marca Nayt lideró los movimientos del mes con 284 operaciones y rotación promedio de 6.4 días.',
      metric: '+28% volumen',
      type: 'positive',
    },
    {
      id: 'ins-2',
      title: 'Pasillo A concentró 34% de los pickings totales',
      description: 'La cercanía directa a los carriles de embarque EMB-01..05 optimizó el tiempo de surtido en un 18% para pedidos de alta prioridad.',
      metric: '34% picking',
      type: 'positive',
    },
    {
      id: 'ins-3',
      title: '4 oportunidades de consolidación detectadas',
      description: 'Existen posiciones semi-ocupadas en los pasillos B y D que permitirían liberar 3 columnas completas de almacenamiento.',
      metric: '3 bahías libres',
      type: 'opportunity',
    },
    {
      id: 'ins-4',
      title: '6 unidades superan 30 días sin movimiento',
      description: 'Principalmente modelos King Size de alta gama (Sealy y Therapedic) en el Pasillo E nivel superior.',
      metric: '6 colchones KS',
      type: 'warning',
    },
    {
      id: 'ins-5',
      title: '$248,300 MXN de inventario inmovilizado',
      description: 'Capital en existencias con más de 30 días de resguardo susceptible de traslado a sucursales retail o estrategia comercial.',
      metric: '$248.3 K MXN',
      type: 'warning',
    },
  ],
};
