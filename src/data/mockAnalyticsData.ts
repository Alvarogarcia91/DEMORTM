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

// Costos unitarios de materiales e insumos gráficos RTM (MXN)
export const ARTICLE_UNIT_COST: Record<string, number> = {
  'PAP-COU-090': 18500, // Tarima 10,000 pliegos
  'PAP-BND-075': 12400, // Bobina 85cm
  'CAR-SBS-14P': 24500, // Tarima 5,000 hojas
  'PEL-BOPP-BLA': 8900,  // Bobina 330mm x 2500m
  'PEL-BOPP-TRA': 7800,  // Bobina 330mm x 2500m
  'PAP-TERM-DIR': 6400,  // Bobina 250mm
  'TIN-PAN-186C': 1850,  // Cubeta 5 kg
  'TIN-PROC-BLK': 950,   // Cubeta 5 kg
  'BAR-UV-GLOSS': 28500, // Tambo 200 kg
  'CJ-EMB-MED': 4200,    // Tarima 500 pzas
  'ETQ-FAR-VIL': 1450,   // Rollo 5,000 pzas PT
  'FOL-MED-PLE': 850,    // Caja 1,000 pzas PT
  'CJ-ALM-CAR': 3600,    // Tarima 1,000 cajas plegadizas
};

export function getArticleUnitCost(sku: string): number {
  return ARTICLE_UNIT_COST[sku] || 4500;
}

// Datos de Dashboard por Nave Industrial
export const NODE_DASHBOARD_DATA: Record<string, NodeDashboardData> = {
  'wh-alm-virtual': {
    warehouseId: 'wh-alm-virtual',
    warehouseName: 'Almacén Virtual / Control',
    warehouseCode: 'ALM-VIRTUAL',
    type: 'SUCURSAL',
    kpis: {
      totalUnits: 5,
      inventoryCostValue: 125000,
      costBreakdown: {
        available: 0,
        committed: 0,
        inTransit: 0,
        rework: 125000,
      },
      availableUnits: 0,
      committedUnits: 0,
      inTransitUnits: 0,
      occupancyPercentage: 50.0,
      reworkUnits: 5,
      avgAgeDays: 14.2,
    },
    todayOperations: {
      received: 0,
      pendingStaging: 0,
      picked: 0,
      staged: 0,
      transfersInTransit: 0,
    },
    alerts: [
      {
        id: 'alt-virt-1',
        type: 'rework',
        title: 'Auditoría en proceso: Ajuste de inventario -19,500 pliegos',
        description: 'Caso demo en investigación de auditoría antes de autorización contable.',
        ctaLabel: 'Ver auditoría',
        ctaAction: 'stocks',
        severity: 'warning',
      },
    ],
    inventoryHealth: [],
    layoutSummary: {
      activeSuggestions: 0,
      savedMetersPerDay: 0,
      topRecommendations: [],
    },
    specialZones: {
      reception: { capacity: 20, occupied: 2, label: 'Entradas Lógicas' },
      rework: { capacity: 20, occupied: 3, label: 'Ajustes Administrativos' },
      shipping: { capacity: 0, occupied: 0, label: 'Sin Carril Físico' },
    },
  },
  'wh-alm-rtm': {
    warehouseId: 'wh-alm-rtm',
    warehouseName: 'Almacén Principal RTM',
    warehouseCode: 'ALM-RTM',
    type: 'CEDIS',
    kpis: {
      totalUnits: 158400,
      inventoryCostValue: 4850000,
      costBreakdown: {
        available: 3820000,
        committed: 740000,
        inTransit: 210000,
        rework: 80000,
      },
      availableUnits: 124600,
      committedUnits: 28200,
      inTransitUnits: 5600,
      occupancyPercentage: 74.5,
      reworkUnits: 1,
      avgAgeDays: 8.4,
    },
    todayOperations: {
      received: 6,
      pendingStaging: 4,
      picked: 8,
      staged: 6,
      transfersInTransit: 0,
    },
    alerts: [
      {
        id: 'alt-1',
        type: 'critical_age',
        title: 'Diferencia en conteo cíclico A-B-03 (-19,500 pliegos Couché 90g)',
        description: 'Auditoría interna y supervisión de almacén investigando ajuste de inventario.',
        ctaLabel: 'Ver conteo',
        ctaAction: 'stocks',
        severity: 'danger',
      },
      {
        id: 'alt-2',
        type: 'rearrangement',
        title: '3 reacomodos de bobinas sugeridos para Línea Flexo 1',
        description: 'Mover bobinas BOPP blanco al Pasillo A ahorrará 140 m de recorrido de montacargas por tiraje.',
        ctaLabel: 'Ver reacomodos',
        ctaAction: 'rearrangements',
        severity: 'info',
      },
      {
        id: 'alt-3',
        type: 'rework',
        title: 'Tarima de cartulina SBS con liberación pendiente QA',
        description: 'Muestreo de calibre y absorción de tinta en laboratorio de calidad de sustratos.',
        ctaLabel: 'Ver cuarentena',
        ctaAction: 'rework',
        severity: 'warning',
      },
      {
        id: 'alt-4',
        type: 'high_occupancy',
        title: 'Pasillo A (Sustratos y Bobinas) al 88% de capacidad',
        description: 'Alta ocupación por arribo simultáneo de bobinas BOPP y papel couché.',
        ctaLabel: 'Ver mapa de calor',
        ctaAction: 'map',
        severity: 'warning',
      },
    ],
    inventoryHealth: [
      { sku: 'PAP-COU-090', name: 'Papel Couché Brillante 90g - 70x100 cm', category: 'Papel Couché / Offset', brand: 'Bio-Pappel', available: 2500, committed: 10000, inTransit: 0, avgAge: 6.2, status: 'Alta rotación' },
      { sku: 'PEL-BOPP-BLA', name: 'Película BOPP Blanco Brillante 60 mic', category: 'Bobinas Flexo', brand: 'Fasson Avery', available: 16, committed: 4, inTransit: 2, avgAge: 5.4, status: 'Alta rotación' },
      { sku: 'TIN-PAN-186C', name: 'Tinta Gráfica Pantone Red 186 C', category: 'Tintas y Barnices', brand: 'Sun Chemical', available: 24, committed: 6, inTransit: 0, avgAge: 4.8, status: 'Saludable' },
      { sku: 'TIN-PROC-BLK', name: 'Tinta Process Black Flexo/Offset', category: 'Tintas y Barnices', brand: 'Sun Chemical', available: 32, committed: 8, inTransit: 0, avgAge: 5.1, status: 'Saludable' },
      { sku: 'CAR-SBS-14P', name: 'Cartulina SBS Calibre 14 pts - 70x95 cm', category: 'Cartulinas y Plegadizos', brand: 'Bio-Pappel', available: 8, committed: 3, inTransit: 2, avgAge: 7.5, status: 'Saludable' },
      { sku: 'BAR-UV-GLOSS', name: 'Barniz UV Alto Brillo Gráfico', category: 'Tintas y Barnices', brand: 'Siegwerk', available: 6, committed: 2, inTransit: 2, avgAge: 9.2, status: 'Saludable' },
    ],
    layoutSummary: {
      activeSuggestions: 3,
      savedMetersPerDay: 195,
      topRecommendations: [
        { sku: 'PEL-BOPP-BLA', productName: 'Película BOPP Blanco Brillante', fromLocation: 'D-A-04', toLocation: 'A-A-02', reason: 'Acercar sustrato de alta frecuencia a rampa de prensas flexo' },
        { sku: 'TIN-PROC-BLK', productName: 'Tinta Process Black 5kg', fromLocation: 'C-B-02', toLocation: 'B-A-01', reason: 'Consolidar en rack frontal de tintas para surtido rápido' },
      ],
    },
    specialZones: {
      reception: { capacity: 10, occupied: 4, label: 'Andenes Descarga REC-01 / REC-02' },
      rework: { capacity: 6, occupied: 2, label: 'Área de Retención y Muestreo QA' },
      shipping: { capacity: 8, occupied: 3, label: 'Rampas de Surtido a Planta STG-OP' },
    },
  },

  'wh-mty-sur': {
    warehouseId: 'wh-mty-sur',
    warehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    warehouseCode: 'ALM-PT',
    type: 'CEDIS',
    kpis: {
      totalUnits: 48600,
      inventoryCostValue: 2640000,
      costBreakdown: {
        available: 2180000,
        committed: 380000,
        inTransit: 80000,
        rework: 0,
      },
      availableUnits: 38200,
      committedUnits: 9800,
      inTransitUnits: 600,
      occupancyPercentage: 62.4,
      reworkUnits: 0,
      avgAgeDays: 3.8,
    },
    todayOperations: {
      received: 12,
      pendingStaging: 3,
      picked: 8,
      staged: 6,
      transfersInTransit: 0,
    },
    alerts: [
      {
        id: 'alt-sur-1',
        type: 'rework',
        title: 'Tarima de etiquetas farmacéuticas en reempaque secundario',
        description: 'Retrabajo de caja exterior para Laboratorios Medifarma.',
        ctaLabel: 'Ver retrabajo',
        ctaAction: 'rework',
        severity: 'warning',
      },
      {
        id: 'alt-sur-2',
        type: 'high_occupancy',
        title: 'Área de producto terminado de alta demanda al 72%',
        description: 'Lotes de folletos médicos listos para liberación y despacho.',
        ctaLabel: 'Ver mapa',
        ctaAction: 'map',
        severity: 'info',
      },
    ],
    inventoryHealth: [
      { sku: 'ETQ-FAR-VIL', name: 'Etiqueta Farmacéutica Vial 10ml - PT', category: 'Producto Terminado', brand: 'RTM Packaging', available: 18000, committed: 8000, inTransit: 0, avgAge: 2.4, status: 'Alta rotación' },
      { sku: 'FOL-MED-PLE', name: 'Folleto Médico Farmacéutico Plegado 4 Cuerpos', category: 'Producto Terminado', brand: 'RTM Packaging', available: 12000, committed: 4000, inTransit: 0, avgAge: 3.1, status: 'Alta rotación' },
      { sku: 'CJ-EMB-MED', name: 'Cajas Corrugadas Flauta C 40x30x30 cm', category: 'Empaque Corrugado', brand: 'RTM Packaging', available: 1500, committed: 500, inTransit: 0, avgAge: 4.2, status: 'Saludable' },
    ],
    layoutSummary: {
      activeSuggestions: 2,
      savedMetersPerDay: 110,
      topRecommendations: [
        { sku: 'ETQ-FAR-VIL', productName: 'Etiqueta Farmacéutica Vial 10ml', fromLocation: 'B-A-03', toLocation: 'A-A-01', reason: 'Posición contigua a carril de despacho EMB-01' },
      ],
    },
    specialZones: {
      reception: { capacity: 8, occupied: 2, label: 'Recepción de Líneas de Empaque REC-PT' },
      rework: { capacity: 4, occupied: 1, label: 'Área de Reempaque e Inspección QA' },
      shipping: { capacity: 6, occupied: 3, label: 'Carriles de Embarque B2B EMB-01..03' },
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
    avgTurnoverRate: number;
    avgInventoryValue: number; // in MXN
    avgDaysInWarehouse: number;
    avgOccupancyPercentage: number;
  };
  movementTrends: {
    label: string;
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
      timeSlot: string;
      activityLevel: number;
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
    totalMovements: 1642,
    avgTurnoverRate: 11.2,
    avgInventoryValue: 7490000,
    avgDaysInWarehouse: 8.6,
    avgOccupancyPercentage: 71.8,
  },
  movementTrends: [
    { label: 'Sem 1 (1-7 Sep)', entries: 92, staging: 78, rearrangements: 42, picking: 134, transfers: 0, shipping: 118, total: 464 },
    { label: 'Sem 2 (8-14 Sep)', entries: 85, staging: 68, rearrangements: 38, picking: 122, transfers: 0, shipping: 104, total: 417 },
    { label: 'Sem 3 (15-21 Sep)', entries: 98, staging: 84, rearrangements: 46, picking: 145, transfers: 0, shipping: 128, total: 501 },
    { label: 'Sem 4 (22-28 Sep)', entries: 105, staging: 92, rearrangements: 52, picking: 156, transfers: 0, shipping: 136, total: 541 },
  ],
  inventoryByStatus: [
    { status: 'Disponible', count: 132400, percentage: 80.5, color: 'bg-emerald-500 text-emerald-500 border-emerald-500' },
    { status: 'Reservado OP', count: 22400, percentage: 13.6, color: 'bg-amber-500 text-amber-500 border-amber-500' },
    { status: 'En Cuarentena QA', count: 5600, percentage: 3.4, color: 'bg-rose-500 text-rose-500 border-rose-500' },
    { status: 'En despacho B2B', count: 4100, percentage: 2.5, color: 'bg-blue-500 text-blue-500 border-blue-500' },
  ],
  topMovedArticles: [
    { sku: 'PAP-COU-090', name: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', category: 'Papel Couché / Offset', movementsCount: 342, percentage: 20.8 },
    { sku: 'PEL-BOPP-BLA', name: 'Película BOPP Blanco Brillante 60 mic', brand: 'Fasson Avery', category: 'Bobinas Flexo', movementsCount: 286, percentage: 17.4 },
    { sku: 'TIN-PAN-186C', name: 'Tinta Gráfica Pantone Red 186 C', brand: 'Sun Chemical', category: 'Tintas y Barnices', movementsCount: 218, percentage: 13.3 },
    { sku: 'TIN-PROC-BLK', name: 'Tinta Process Black Flexo/Offset', brand: 'Sun Chemical', category: 'Tintas y Barnices', movementsCount: 194, percentage: 11.8 },
    { sku: 'ETQ-FAR-VIL', name: 'Etiqueta Farmacéutica Vial 10ml - PT', brand: 'RTM Packaging', category: 'Producto Terminado', movementsCount: 176, percentage: 10.7 },
    { sku: 'CAR-SBS-14P', name: 'Cartulina SBS Calibre 14 pts - 70x95 cm', brand: 'Bio-Pappel', category: 'Cartulinas y Plegadizos', movementsCount: 148, percentage: 9.0 },
    { sku: 'BAR-UV-GLOSS', name: 'Barniz UV Alto Brillo Gráfico', brand: 'Siegwerk', category: 'Tintas y Barnices', movementsCount: 124, percentage: 7.6 },
    { sku: 'CJ-EMB-MED', name: 'Cajas Corrugadas Flauta C 40x30x30 cm', brand: 'RTM Packaging', category: 'Empaque Corrugado', movementsCount: 94, percentage: 5.7 },
  ],
  idleArticles: [
    { sku: 'PAP-TERM-DIR', name: 'Papel Térmico Directo Autoadhesivo', brand: 'Fasson Avery', category: 'Bobinas Flexo', stockUnits: 4, daysWithoutMovement: 26, tiedCapital: 25600 },
    { sku: 'PEL-BOPP-TRA', name: 'Película BOPP Transparente 50 mic', brand: 'Fasson Avery', category: 'Bobinas Flexo', stockUnits: 3, daysWithoutMovement: 22, tiedCapital: 23400 },
  ],
  zoneOccupancy: [
    { zone: 'Pasillo A (Sustratos y Bobinas Flexo)', capacity: 80, occupied: 72, percentage: 90.0 },
    { zone: 'Pasillo B (Racks de Tintas y Químicos)', capacity: 60, occupied: 44, percentage: 73.3 },
    { zone: 'Pasillo C (Cartulinas y Plegadizos)', capacity: 60, occupied: 40, percentage: 66.7 },
    { zone: 'Pasillo D (Almacenamiento y Solventes)', capacity: 50, occupied: 31, percentage: 62.0 },
    { zone: 'Nave 2 ALM-PT (Producto Terminado)', capacity: 90, occupied: 56, percentage: 62.2 },
    { zone: 'Recepción MP & Andenes', capacity: 20, occupied: 6, percentage: 30.0 },
    { zone: 'Área Cuarentena y Retención QA', capacity: 10, occupied: 3, percentage: 30.0 },
    { zone: 'Rampas de Despacho B2B', capacity: 15, occupied: 6, percentage: 40.0 },
  ],
  brandValueBreakdown: [
    { brand: 'Bio-Pappel', costValue: 2880000, percentage: 38.5, unitsCount: 42 },
    { brand: 'Fasson Avery', costValue: 2110000, percentage: 28.2, unitsCount: 54 },
    { brand: 'Sun Chemical', costValue: 1110000, percentage: 14.8, unitsCount: 120 },
    { brand: 'Siegwerk', costValue: 704000, percentage: 9.4, unitsCount: 18 },
    { brand: 'RTM Packaging (PT)', costValue: 686000, percentage: 9.1, unitsCount: 84 },
  ],
  ageDistribution: [
    { range: '0 - 7 días (Ingreso reciente / En rotación)', units: 98400, percentage: 62.1, valueMxn: 4650000 },
    { range: '8 - 15 días (Rotación programada OP)', units: 42200, percentage: 26.6, valueMxn: 1980000 },
    { range: '16 - 30 días (Supervisión técnica)', units: 14600, percentage: 9.2, valueMxn: 690000 },
    { range: '30+ días (Alerta de envejecimiento de bobina)', units: 3200, percentage: 2.1, valueMxn: 170000 },
  ],
  rotationClassification: [
    { category: 'Alta rotación', skusCount: 5, unitsCount: 96400, percentage: 60.9, description: 'Sustratos y tintas con consumo diario continuo en prensas Nilpeter y Heidelberg.' },
    { category: 'Media rotación', skusCount: 6, unitsCount: 48200, percentage: 30.4, description: 'Materiales de soporte, barnices UV y empaque secundario.' },
    { category: 'Baja rotación', skusCount: 2, unitsCount: 13800, percentage: 8.7, description: 'Sustratos especiales y papeles térmicos de pedidos esporádicos.' },
    { category: 'Sin movimiento', skusCount: 0, unitsCount: 0, percentage: 0.0, description: 'Sin existencias obsoletas o sin movimiento registradas este mes.' },
  ],
  weeklyActivityMatrix: [
    { day: 'Lunes', hours: [{ timeSlot: '06-09h', activityLevel: 75, opsCount: 42 }, { timeSlot: '09-12h', activityLevel: 98, opsCount: 68 }, { timeSlot: '12-15h', activityLevel: 80, opsCount: 52 }, { timeSlot: '15-18h', activityLevel: 90, opsCount: 61 }, { timeSlot: '18-21h', activityLevel: 45, opsCount: 28 }] },
    { day: 'Martes', hours: [{ timeSlot: '06-09h', activityLevel: 68, opsCount: 38 }, { timeSlot: '09-12h', activityLevel: 92, opsCount: 64 }, { timeSlot: '12-15h', activityLevel: 75, opsCount: 48 }, { timeSlot: '15-18h', activityLevel: 86, opsCount: 56 }, { timeSlot: '18-21h', activityLevel: 40, opsCount: 24 }] },
    { day: 'Miércoles', hours: [{ timeSlot: '06-09h', activityLevel: 72, opsCount: 40 }, { timeSlot: '09-12h', activityLevel: 95, opsCount: 66 }, { timeSlot: '12-15h', activityLevel: 82, opsCount: 54 }, { timeSlot: '15-18h', activityLevel: 88, opsCount: 58 }, { timeSlot: '18-21h', activityLevel: 42, opsCount: 26 }] },
    { day: 'Jueves', hours: [{ timeSlot: '06-09h', activityLevel: 80, opsCount: 48 }, { timeSlot: '09-12h', activityLevel: 100, opsCount: 72 }, { timeSlot: '12-15h', activityLevel: 85, opsCount: 58 }, { timeSlot: '15-18h', activityLevel: 94, opsCount: 65 }, { timeSlot: '18-21h', activityLevel: 48, opsCount: 30 }] },
    { day: 'Viernes', hours: [{ timeSlot: '06-09h', activityLevel: 88, opsCount: 56 }, { timeSlot: '09-12h', activityLevel: 99, opsCount: 70 }, { timeSlot: '12-15h', activityLevel: 88, opsCount: 62 }, { timeSlot: '15-18h', activityLevel: 96, opsCount: 68 }, { timeSlot: '18-21h', activityLevel: 55, opsCount: 36 }] },
    { day: 'Sábado', hours: [{ timeSlot: '06-09h', activityLevel: 55, opsCount: 32 }, { timeSlot: '09-12h', activityLevel: 82, opsCount: 50 }, { timeSlot: '12-15h', activityLevel: 60, opsCount: 36 }, { timeSlot: '15-18h', activityLevel: 40, opsCount: 22 }, { timeSlot: '18-21h', activityLevel: 20, opsCount: 10 }] },
  ],
  topLocations: {
    mostActive: [
      { code: 'A-A-01', name: 'Pasillo A · Bahía 01 (Bobinas BOPP)', type: 'Rack Bobinas', opsCount: 154, status: 'Alta Demanda' },
      { code: 'A-B-01', name: 'Pasillo A · Bahía 01 Nivel B (Couché)', type: 'Tarimas Offset', opsCount: 138, status: 'Alta Demanda' },
      { code: 'B-A-01', name: 'Pasillo B · Bahía 01 (Tintas Pantone)', type: 'Rack Tintas', opsCount: 122, status: 'Frecuente' },
      { code: 'REC-01', name: 'Andén de Descarga Materia Prima', type: 'Recepción', opsCount: 110, status: 'Operativo' },
      { code: 'EMB-01', name: 'Carril de Embarque Producto Terminado', type: 'Despacho B2B', opsCount: 96, status: 'Operativo' },
    ],
    leastUsed: [
      { code: 'D-C-05', name: 'Pasillo D · Bahía 05 Nivel C', type: 'Rack Alto', opsCount: 4, status: 'Baja Demanda' },
      { code: 'D-C-04', name: 'Pasillo D · Bahía 04 Nivel C', type: 'Rack Alto', opsCount: 6, status: 'Baja Demanda' },
    ],
  },
  insights: [
    {
      id: 'ins-1',
      title: 'Papel Couché 90g lideró el consumo industrial',
      description: 'El sustrato principal concentró 342 movimientos en el mes abasteciendo tirajes masivos en la prensa Heidelberg Speedmaster CX 102.',
      metric: '342 movimientos',
      type: 'positive',
    },
    {
      id: 'ins-2',
      title: 'Pasillo A concentró 38% del surtido a prensas',
      description: 'La cercanía directa a las rampas de producción redujo en 22% los tiempos de traslado en montacargas.',
      metric: '38% del surtido',
      type: 'positive',
    },
    {
      id: 'ins-3',
      title: 'Diferencia en conteo cíclico A-B-03 en investigación',
      description: 'Se detectó discrepancia física (-19,500 pliegos) frente al sistema. Auditoría de planta mantiene congelada la ubicación.',
      metric: '-19,500 pliegos',
      type: 'warning',
    },
    {
      id: 'ins-4',
      title: 'Rotación acelerada en Producto Terminado (3.8 días)',
      description: 'Los despachos de etiquetas farmacéuticas y empaques hacia parques industriales de Reynosa mantuvieron flujo ágil de salida.',
      metric: '3.8 días rotación',
      type: 'positive',
    },
  ],
};

// Backward-compatible fallback
NODE_DASHBOARD_DATA['wh-mty-norte'] = NODE_DASHBOARD_DATA['wh-alm-rtm'];
NODE_DASHBOARD_DATA['wh-mty-sur'] = NODE_DASHBOARD_DATA['wh-alm-rtm'];
