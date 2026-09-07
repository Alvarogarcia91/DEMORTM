export interface PositionSerializedMattress {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  levelCode: 'C' | 'B' | 'A';
  locationCode: string; // ej. 'B-C-09', 'A-B-03'
  lotNumber: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'Comprometido' | 'En inspección' | 'En retrabajo' | 'En embarque' | 'En acomodo' | 'En tránsito' | 'En exhibición';
  classification: string;
  notes?: string;
}

export type PositionSerializedItem = PositionSerializedMattress;

export interface LevelItem {
  levelCode: 'C' | 'B' | 'A';
  levelName: string;
  locationCode: string;
  capacity: number;
  count: number;
  isOccupied: boolean;
  units: PositionSerializedMattress[];
}

export interface PositionRack {
  positionNumber: string;
  positionId: string;
  aisle: string;
  capacity: number;
  currentUnitsCount: number;
  availableCount: number;
  committedCount: number;
  freeSlotsCount: number;
  avgAgeDays: number;
  totalLevels: number;
  levelsDistribution: {
    levelC: number;
    levelB: number;
    levelA: number;
  };
  levels: LevelItem[];
  units: PositionSerializedMattress[];
}

export interface AisleData {
  aisleCode: string;
  zoneName: string;
  positions: PositionRack[];
}

export interface SpecialAreaSlot {
  code: string;
  name: string;
  type: 'recepcion' | 'acomodo' | 'retrabajo' | 'embarque';
  capacity: number;
  currentUnits: number;
  status: string;
  units: {
    uid: string;
    sku: string;
    productName: string;
    reason?: string;
    entryDate: string;
  }[];
}

export interface ShowroomBay {
  code: string;
  name: string;
  status: 'Ocupada' | 'Libre';
  mattress?: PositionSerializedMattress;
}

export interface WarehouseLayout {
  id: string;
  code: string;
  name: string;
  type: string;
  address: string;
  isActive: boolean;
  kpis: {
    totalLocations: number;
    usedLocations: number;
    freeLocations: number;
    occupancyPercentage: number;
    physicalUnits: number;
  };
  aisles: AisleData[];
  receptionAreas: SpecialAreaSlot[];
  stagingAreas: SpecialAreaSlot[];
  reworkZone: SpecialAreaSlot;
  shippingLanes: SpecialAreaSlot[];
  showroomBays?: ShowroomBay[];
}

export interface InventoryMovement {
  id: string;
  timestamp: string;
  uid: string;
  sku: string;
  productName: string;
  movementType: 'RECEPCIÓN' | 'ACOMODO' | 'REUBICACIÓN' | 'RESERVA' | 'SURTIDO OP' | 'DEVOLUCIÓN PRODUCCIÓN' | 'SCRAP' | 'AJUSTE' | 'LIBERACIÓN QA' | 'CUARENTENA' | 'PT GENERADO' | 'EMBARQUE' | 'ENTRADA' | 'TRASPASO' | 'RETRABAJO' | 'SURTIDO' | 'PICKING';
  origin: string;
  destination: string;
  user: string;
  notes?: string;
}

export interface InventoryTransferOrder {
  id: string;
  folio: string;
  collectionFolio?: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  totalUnits: number;
  receivedUnits?: number;
  receivedSerials?: string[];
  status: 'Borrador' | 'Preparando' | 'Listo para salida' | 'En tránsito' | 'Parcial' | 'Recibido' | 'Con incidencia';
  plannedDate: string;
  departureDate?: string;
  arrivalDate?: string;
  driver?: string;
  truckPlates?: string;
  items: {
    sku: string;
    productName: string;
    quantity: number;
    serials: string[];
    receivedSerials?: string[];
  }[];
}

// =========================================================================
// RTM INDUSTRIAL ITEMS MOCK CATALOG
// =========================================================================
export interface IndustrialItemDefinition {
  sku: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  prefix: 'TAR' | 'BOB' | 'CJ' | 'ROL';
  classification: string;
}

export const RTM_INDUSTRIAL_ITEMS: IndustrialItemDefinition[] = [
  {
    sku: 'PAP-COU-090',
    name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    brand: 'Bio-Pappel',
    size: 'Tarima 18,000 pliegos',
    category: 'Papel Offset',
    prefix: 'TAR',
    classification: 'Sustrato Offset / Grado Editorial',
  },
  {
    sku: 'PAP-BND-075',
    name: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    brand: 'Copamex',
    size: 'Tarima 20,000 pliegos',
    category: 'Papel Offset',
    prefix: 'TAR',
    classification: 'Sustrato Offset / Grado Comercial',
  },
  {
    sku: 'PAP-SBS-14',
    name: 'Cartulina Sulfatada SBS 14 pts',
    brand: 'WestRock',
    size: 'Tarima 12,000 pliegos',
    category: 'Papel Offset',
    prefix: 'TAR',
    classification: 'Cartulina SBS / Empaque Plegadizo',
  },
  {
    sku: 'FLX-BOPP-WHT',
    name: 'Sustrato BOPP Blanco Brillante 60 mic',
    brand: 'Fasson Avery',
    size: 'Bobina 2,500 m',
    category: 'Sustratos Flexo',
    prefix: 'BOB',
    classification: 'Película Autoadherible Flexo',
  },
  {
    sku: 'FLX-BOPP-CLR',
    name: 'Sustrato BOPP Transparente Ultra-Clear',
    brand: 'Fasson Avery',
    size: 'Bobina 2,000 m',
    category: 'Sustratos Flexo',
    prefix: 'BOB',
    classification: 'Película Transparente Flexo',
  },
  {
    sku: 'FLX-THM-DIR',
    name: 'Papel Térmico Directo Top-Coated',
    brand: 'UPM Raflatac',
    size: 'Bobina 3,000 m',
    category: 'Sustratos Flexo',
    prefix: 'BOB',
    classification: 'Papel Térmico / Código de Barras',
  },
  {
    sku: 'TNT-PMS-186C',
    name: 'Tinta Especial Rojo Corporativo PMS 186 C',
    brand: 'Siegwerk',
    size: 'Cubeta 10 kg',
    category: 'Tintas & Barnices',
    prefix: 'CJ',
    classification: 'Tinta Directa Pantone Especial',
  },
  {
    sku: 'TNT-PROC-BLK',
    name: 'Tinta Offset Proceso Black Intensa',
    brand: 'Sun Chemical',
    size: 'Lata 5 kg',
    category: 'Tintas & Barnices',
    prefix: 'CJ',
    classification: 'Tinta Proceso Cuatricromía',
  },
  {
    sku: 'BRN-UV-GLS',
    name: 'Barniz UV Ultra Brillo Curado Rápido',
    brand: 'Flint Group',
    size: 'Cubeta 20 kg',
    category: 'Tintas & Barnices',
    prefix: 'CJ',
    classification: 'Barniz y Químicos de Acabado',
  },
  {
    sku: 'EMP-CAJ-COR',
    name: 'Cajas Corrugadas 30x20x25 cm para Etiquetas',
    brand: 'Smurfit Kappa',
    size: 'Paquete 50 pzas',
    category: 'Empaque & Insumos',
    prefix: 'CJ',
    classification: 'Material de Empaque & Protección',
  },
  {
    sku: 'PT-ETIQ-FAR',
    name: 'Etiqueta Farmacéutica 4x6" (Rollo 1,000 u)',
    brand: 'Impresos RTM',
    size: 'Caja 12 rollos',
    category: 'Producto Terminado',
    prefix: 'ROL',
    classification: 'Producto Terminado / Aprobado QA',
  },
  {
    sku: 'PT-FOL-MED',
    name: 'Folleto Plegado Cuatricromía Laboratorio',
    brand: 'Impresos RTM',
    size: 'Caja 2,500 u',
    category: 'Producto Terminado',
    prefix: 'CJ',
    classification: 'Producto Terminado / Aprobado QA',
  },
  {
    sku: 'PT-EMP-ALM',
    name: 'Caja Plegadiza Alimentos 6 Tintas + UV',
    brand: 'Impresos RTM',
    size: 'Tarima 15,000 u',
    category: 'Producto Terminado',
    prefix: 'TAR',
    classification: 'Producto Terminado / Aprobado QA',
  },
];

// =========================================================================
// HELPER FOR SEEDING AISLE POSITION RACKS
// =========================================================================
function buildIndustrialAisle(
  aisleLetter: string,
  zoneName: string,
  numPositions: number,
  densityBias: number,
  whCode: string
): AisleData {
  const positions: PositionRack[] = [];

  for (let i = 1; i <= numPositions; i++) {
    const posNum = i < 10 ? `0${i}` : `${i}`;
    const posId = `${aisleLetter}-${posNum}`;
    
    const seed = (aisleLetter.charCodeAt(0) * 19 + i * 37) % 100;
    let occupancy = 0;

    if (seed < 15) {
      occupancy = 0;
    } else if (seed < 30) {
      occupancy = Math.floor(1 + (seed % 2));
    } else if (seed < 70) {
      occupancy = Math.floor(3 + (seed % 3));
    } else if (seed < 90) {
      occupancy = 6;
    } else {
      occupancy = 7;
    }

    if (densityBias < 0.5 && occupancy > 4) {
      occupancy = Math.max(0, occupancy - 2);
    }

    let countA = 0;
    let countB = 0;
    let countC = 0;

    if (occupancy === 7) {
      countA = 3; countB = 2; countC = 2;
    } else if (occupancy === 6) {
      countA = 3; countB = 2; countC = 1;
    } else if (occupancy === 5) {
      countA = 2; countB = 2; countC = 1;
    } else if (occupancy === 4) {
      countA = 2; countB = 1; countC = 1;
    } else if (occupancy === 3) {
      countA = 1; countB = 1; countC = 1;
    } else if (occupancy === 2) {
      countA = 1; countB = 1; countC = 0;
    } else if (occupancy === 1) {
      countA = 1; countB = 0; countC = 0;
    }

    const units: PositionSerializedMattress[] = [];
    let totalAge = 0;
    let committed = 0;

    const generateUnit = (level: 'C' | 'B' | 'A', indexInLevel: number) => {
      const artIndex = (aisleLetter.charCodeAt(0) + i * 3 + indexInLevel * 2 + (level === 'C' ? 1 : level === 'B' ? 2 : 0)) % RTM_INDUSTRIAL_ITEMS.length;
      const art = RTM_INDUSTRIAL_ITEMS[artIndex];
      const age = (i * 2 + indexInLevel * 3) % 15;
      totalAge += age;

      const isCommitted = (seed + indexInLevel * 7 + (level === 'C' ? 1 : 0)) % 5 === 0;
      if (isCommitted) committed++;

      const serialSuffix = ((aisleLetter.charCodeAt(0) * 100 + i * 10 + indexInLevel + 1) % 900 + 100);
      const uid = `${art.prefix}-RTM-260906-${serialSuffix.toString().padStart(3, '0')}`;
      const locationCode = `${aisleLetter}-${level}-${posNum}`;

      const lotNumber = art.sku.startsWith('PT-')
        ? `RTM-PT-260905-${(10 + ((i + indexInLevel) % 5)).toString().padStart(3, '0')}`
        : `RTM-MP-260901-${(10 + ((i + indexInLevel) % 5)).toString().padStart(3, '0')}`;

      return {
        uid,
        sku: art.sku,
        productName: art.name,
        brand: art.brand,
        size: art.size,
        levelCode: level,
        locationCode,
        lotNumber,
        entryDate: `${Math.max(1, 27 - age)} Ago 2026`,
        ageDays: age,
        status: (isCommitted ? 'Comprometido' : 'Disponible') as any,
        classification: art.classification,
        notes: `Inspección de calidad aprobada en recepción ${whCode}.`,
      };
    };

    const unitsC: PositionSerializedMattress[] = [];
    for (let c = 0; c < countC; c++) {
      const u = generateUnit('C', c);
      unitsC.push(u);
      units.push(u);
    }

    const unitsB: PositionSerializedMattress[] = [];
    for (let b = 0; b < countB; b++) {
      const u = generateUnit('B', b);
      unitsB.push(u);
      units.push(u);
    }

    const unitsA: PositionSerializedMattress[] = [];
    for (let a = 0; a < countA; a++) {
      const u = generateUnit('A', a);
      unitsA.push(u);
      unitsA.push(u);
    }

    const levels: LevelItem[] = [
      {
        levelCode: 'C',
        levelName: 'Nivel C · Superior',
        locationCode: `${aisleLetter}-C-${posNum}`,
        capacity: 2,
        count: countC,
        isOccupied: countC > 0,
        units: unitsC,
      },
      {
        levelCode: 'B',
        levelName: 'Nivel B · Medio',
        locationCode: `${aisleLetter}-B-${posNum}`,
        capacity: 2,
        count: countB,
        isOccupied: countB > 0,
        units: unitsB,
      },
      {
        levelCode: 'A',
        levelName: 'Nivel A · Piso',
        locationCode: `${aisleLetter}-A-${posNum}`,
        capacity: 3,
        count: countA,
        isOccupied: countA > 0,
        units: unitsA,
      },
    ];

    positions.push({
      positionNumber: posNum,
      positionId: posId,
      aisle: aisleLetter,
      capacity: 7,
      currentUnitsCount: occupancy,
      availableCount: Math.max(0, occupancy - committed),
      committedCount: committed,
      freeSlotsCount: 7 - occupancy,
      avgAgeDays: occupancy > 0 ? Math.round(totalAge / occupancy) : 0,
      totalLevels: 3,
      levelsDistribution: { levelC: countC, levelB: countB, levelA: countA },
      levels,
      units,
    });
  }

  return {
    aisleCode: `Pasillo ${aisleLetter}`,
    zoneName,
    positions,
  };
}

// =========================================================================
// WAREHOUSE 1: ALMACÉN MATERIA PRIMA (ALM-MP)
// =========================================================================
const mpAisles: AisleData[] = [
  buildIndustrialAisle('A', 'Zona Papel Offset & Pliegos', 12, 0.85, 'ALM-MP'),
  buildIndustrialAisle('B', 'Zona Bobinas Flexo & Térmico', 12, 0.75, 'ALM-MP'),
  buildIndustrialAisle('C', 'Zona Tintas Especiales & Químicos', 12, 0.65, 'ALM-MP'),
  buildIndustrialAisle('D', 'Zona Empaque & Corrugados', 10, 0.55, 'ALM-MP'),
  buildIndustrialAisle('E', 'Zona Staging & Remanentes Producción', 10, 0.45, 'ALM-MP'),
];

let mpTotalCap = 0;
let mpUsedUnits = 0;
let mpOccupiedPositions = 0;
let mpTotalPositions = 0;

mpAisles.forEach((a) => {
  a.positions.forEach((p) => {
    mpTotalPositions++;
    mpTotalCap += p.capacity;
    mpUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) mpOccupiedPositions++;
  });
});

export const MOCK_CEDIS_MONTERREY_NORTE: WarehouseLayout = {
  id: 'wh-mty-norte',
  code: 'ALM-MP',
  name: 'Almacén Materia Prima',
  type: 'Almacén Principal de Materias Primas',
  address: 'Planta Principal Reynosa, Tamps. (Nave 1)',
  isActive: true,
  kpis: {
    totalLocations: mpTotalPositions,
    usedLocations: mpOccupiedPositions,
    freeLocations: mpTotalPositions - mpOccupiedPositions,
    occupancyPercentage: Math.round((mpUsedUnits / mpTotalCap) * 1000) / 10,
    physicalUnits: mpUsedUnits + 22,
  },
  aisles: mpAisles,
  receptionAreas: [
    {
      code: 'REC-01',
      name: 'Rampa de Descarga de Sustratos R-01',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 4,
      status: 'Operativa',
      units: [
        { uid: 'TAR-RTM-260906-182', sku: 'PAP-COU-090', productName: 'Papel Couché 90 g (Pliegos 70x100 cm)', entryDate: '27 Ago 2026' },
        { uid: 'TAR-RTM-260906-183', sku: 'PAP-COU-090', productName: 'Papel Couché 90 g (Pliegos 70x100 cm)', entryDate: '27 Ago 2026' },
      ],
    },
    {
      code: 'REC-02',
      name: 'Rampa de Químicos & Tintas R-02',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 2,
      status: 'Operativa',
      units: [
        { uid: 'CJ-RTM-260906-184', sku: 'TNT-PMS-186C', productName: 'Tinta Especial Rojo PMS 186 C', entryDate: '27 Ago 2026' },
      ],
    },
  ],
  stagingAreas: [
    {
      code: 'ACO-01',
      name: 'Staging Acomodo Sustratos Offset',
      type: 'acomodo',
      capacity: 15,
      currentUnits: 6,
      status: 'En proceso de asignación de racks',
      units: [
        { uid: 'TAR-RTM-260906-165', sku: 'PAP-BND-075', productName: 'Papel Bond 75 g (Pliegos 61x90 cm)', entryDate: '27 Ago 2026' },
      ],
    },
    {
      code: 'ACO-02',
      name: 'Staging Acomodo Bobinas Flexo',
      type: 'acomodo',
      capacity: 15,
      currentUnits: 3,
      status: 'Libre para recepción de turno vespertino',
      units: [],
    },
  ],
  reworkZone: {
    code: 'RET-NORTE',
    name: 'Zona de Cuarentena & Calidad QA',
    type: 'retrabajo',
    capacity: 12,
    currentUnits: 4,
    status: 'Operativa',
    units: [
      { uid: 'BOB-RTM-260906-091', sku: 'FLX-BOPP-WHT', productName: 'Sustrato BOPP Blanco Brillante 60 mic', reason: 'Tensión irregular en bobina de proveedor', entryDate: '26 Ago 2026' },
      { uid: 'CJ-RTM-260906-092', sku: 'TNT-PMS-186C', productName: 'Tinta Especial Rojo PMS 186 C', reason: 'Revisión de viscosidad y tono en laboratorio QA', entryDate: '26 Ago 2026' },
      { uid: 'TAR-RTM-260906-093', sku: 'PAP-COU-090', productName: 'Papel Couché 90 g (Pliegos 70x100 cm)', reason: 'Pliegos con humedad en esquinas de tarima', entryDate: '25 Ago 2026' },
      { uid: 'TAR-RTM-260906-094', sku: 'PAP-SBS-14', productName: 'Cartulina Sulfatada SBS 14 pts', reason: 'Inspección de calibre por variación de lote', entryDate: '24 Ago 2026' },
    ],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Bahía Surtido Offset Heidelberg #01',
      type: 'embarque',
      capacity: 20,
      currentUnits: 14,
      status: 'Surtido programado OP-2026-0891',
      units: [],
    },
    {
      code: 'EMB-02',
      name: 'Bahía Surtido Flexo Mark Andy #02',
      type: 'embarque',
      capacity: 20,
      currentUnits: 18,
      status: 'Surtido en proceso OP-2026-0882',
      units: [],
    },
    {
      code: 'EMB-03',
      name: 'Bahía Surtido Acabados & Suajes #03',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible para staging',
      units: [],
    },
    {
      code: 'EMB-04',
      name: 'Bahía Retorno de Remanentes #04',
      type: 'embarque',
      capacity: 20,
      currentUnits: 8,
      status: 'En verificación de metros devueltos',
      units: [],
    },
    {
      code: 'EMB-05',
      name: 'Bahía Consumibles Generales #05',
      type: 'embarque',
      capacity: 20,
      currentUnits: 6,
      status: 'Surtido de cajas y cores',
      units: [],
    },
  ],
};

// =========================================================================
// WAREHOUSE 2: ALMACÉN PRODUCTO TERMINADO (ALM-PT)
// =========================================================================
const ptAisles: AisleData[] = [
  buildIndustrialAisle('A', 'Zona Etiquetas en Rollo (Farma / Industria)', 10, 0.70, 'ALM-PT'),
  buildIndustrialAisle('B', 'Zona Folletería & Plegados Offset', 10, 0.60, 'ALM-PT'),
  buildIndustrialAisle('C', 'Zona Empaque Plegadizo & Cajas', 10, 0.50, 'ALM-PT'),
  buildIndustrialAisle('D', 'Zona Tarimas Completas Listas para Despacho', 8, 0.40, 'ALM-PT'),
];

let ptTotalCap = 0;
let ptUsedUnits = 0;
let ptOccupiedPositions = 0;
let ptTotalPositions = 0;

ptAisles.forEach((a) => {
  a.positions.forEach((p) => {
    ptTotalPositions++;
    ptTotalCap += p.capacity;
    ptUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) ptOccupiedPositions++;
  });
});

export const MOCK_CEDIS_MONTERREY_SUR: WarehouseLayout = {
  id: 'wh-mty-sur',
  code: 'ALM-PT',
  name: 'Almacén Producto Terminado',
  type: 'Almacén de Producto Terminado & Despacho',
  address: 'Planta Principal Reynosa, Tamps. (Nave 2)',
  isActive: true,
  kpis: {
    totalLocations: ptTotalPositions,
    usedLocations: ptOccupiedPositions,
    freeLocations: ptTotalPositions - ptOccupiedPositions,
    occupancyPercentage: Math.round((ptUsedUnits / ptTotalCap) * 1000) / 10,
    physicalUnits: ptUsedUnits + 15,
  },
  aisles: ptAisles,
  receptionAreas: [
    {
      code: 'REC-PT',
      name: 'Entrada de Líneas de Empaque Final',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 3,
      status: 'Operativa',
      units: [
        { uid: 'ROL-RTM-260906-501', sku: 'PT-ETIQ-FAR', productName: 'Etiqueta Farmacéutica 4x6" (Rollo 1,000 u)', entryDate: '27 Ago 2026' },
      ],
    },
  ],
  stagingAreas: [
    {
      code: 'ACO-PT',
      name: 'Staging Inspección QA de PT',
      type: 'acomodo',
      capacity: 12,
      currentUnits: 4,
      status: 'Pendiente de liberación de lote',
      units: [],
    },
  ],
  reworkZone: {
    code: 'RET-PT',
    name: 'Cuarentena PT / Re-empaque',
    type: 'retrabajo',
    capacity: 10,
    currentUnits: 2,
    status: 'Operativa',
    units: [
      { uid: 'CJ-RTM-260906-520', sku: 'PT-FOL-MED', productName: 'Folleto Plegado Cuatricromía Laboratorio', reason: 'Re-empaque por caja dañada en tarima', entryDate: '26 Ago 2026' },
    ],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Rampa de Despacho Cliente Farmacéutica',
      type: 'embarque',
      capacity: 20,
      currentUnits: 12,
      status: 'Consolidando Remisión REM-2026-0044',
      units: [],
    },
    {
      code: 'EMB-02',
      name: 'Rampa de Despacho Local Reynosa',
      type: 'embarque',
      capacity: 20,
      currentUnits: 8,
      status: 'Listo para carga Camión Unidad C-04',
      units: [],
    },
  ],
};

// Backward compatible aliases
export const MOCK_ALMACEN_MATERIA_PRIMA = MOCK_CEDIS_MONTERREY_NORTE;
export const MOCK_ALMACEN_PRODUCTO_TERMINADO = MOCK_CEDIS_MONTERREY_SUR;
export const MOCK_SUCURSAL_VALLE_ORIENTE = MOCK_CEDIS_MONTERREY_NORTE;
export const MOCK_SUCURSAL_CUMBRES = MOCK_CEDIS_MONTERREY_SUR;
export const MOCK_SHOWROOM_VALLE_ORIENTE: ShowroomBay[] = [];
export const MOCK_SHOWROOM_CUMBRES: ShowroomBay[] = [];

export const MOCK_WAREHOUSES_LIST = [
  MOCK_CEDIS_MONTERREY_NORTE,
  MOCK_CEDIS_MONTERREY_SUR,
];

// =========================================================================
// FULL STOCK ITEMS (EXISTENCIAS REALES COHERENTES)
// =========================================================================
export interface StockItemRecord {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  lotNumber: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'Comprometido' | 'En acomodo' | 'En retrabajo' | 'En embarque' | 'En tránsito' | 'En exhibición';
}

function generateFullStockItems(): StockItemRecord[] {
  const stockList: StockItemRecord[] = [];

  const articleStockConfig = [
    {
      sku: 'PAP-COU-090',
      name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
      brand: 'Bio-Pappel',
      size: 'Tarima 18,000 pliegos',
      prefix: 'TAR',
      lot: 'RTM-MP-260901-004',
      north: { disp: 22, comp: 8, acomodo: 2, embarque: 0, retrabajo: 2, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'PAP-BND-075',
      name: 'Papel Bond 75 g (Pliegos 61x90 cm)',
      brand: 'Copamex',
      size: 'Tarima 20,000 pliegos',
      prefix: 'TAR',
      lot: 'RTM-MP-260901-001',
      north: { disp: 18, comp: 5, acomodo: 1, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'PAP-SBS-14',
      name: 'Cartulina Sulfatada SBS 14 pts',
      brand: 'WestRock',
      size: 'Tarima 12,000 pliegos',
      prefix: 'TAR',
      lot: 'RTM-MP-260902-005',
      north: { disp: 14, comp: 4, acomodo: 2, embarque: 0, retrabajo: 1, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'FLX-BOPP-WHT',
      name: 'Sustrato BOPP Blanco Brillante 60 mic',
      brand: 'Fasson Avery',
      size: 'Bobina 2,500 m',
      prefix: 'BOB',
      lot: 'RTM-MP-260902-011',
      north: { disp: 25, comp: 6, acomodo: 3, embarque: 0, retrabajo: 1, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'FLX-BOPP-CLR',
      name: 'Sustrato BOPP Transparente Ultra-Clear',
      brand: 'Fasson Avery',
      size: 'Bobina 2,000 m',
      prefix: 'BOB',
      lot: 'RTM-MP-260903-008',
      north: { disp: 16, comp: 4, acomodo: 1, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'FLX-THM-DIR',
      name: 'Papel Térmico Directo Top-Coated',
      brand: 'UPM Raflatac',
      size: 'Bobina 3,000 m',
      prefix: 'BOB',
      lot: 'RTM-MP-260904-012',
      north: { disp: 20, comp: 5, acomodo: 2, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'TNT-PMS-186C',
      name: 'Tinta Especial Rojo Corporativo PMS 186 C',
      brand: 'Siegwerk',
      size: 'Cubeta 10 kg',
      prefix: 'CJ',
      lot: 'RTM-MP-260903-002',
      north: { disp: 30, comp: 8, acomodo: 2, embarque: 0, retrabajo: 1, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'TNT-PROC-BLK',
      name: 'Tinta Offset Proceso Black Intensa',
      brand: 'Sun Chemical',
      size: 'Lata 5 kg',
      prefix: 'CJ',
      lot: 'RTM-MP-260902-003',
      north: { disp: 40, comp: 12, acomodo: 4, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'BRN-UV-GLS',
      name: 'Barniz UV Ultra Brillo Curado Rápido',
      brand: 'Flint Group',
      size: 'Cubeta 20 kg',
      prefix: 'CJ',
      lot: 'RTM-MP-260904-006',
      north: { disp: 15, comp: 3, acomodo: 1, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'EMP-CAJ-COR',
      name: 'Cajas Corrugadas 30x20x25 cm para Etiquetas',
      brand: 'Smurfit Kappa',
      size: 'Paquete 50 pzas',
      prefix: 'CJ',
      lot: 'RTM-MP-260905-018',
      north: { disp: 50, comp: 10, acomodo: 5, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'PT-ETIQ-FAR',
      name: 'Etiqueta Farmacéutica 4x6" (Rollo 1,000 u)',
      brand: 'Impresos RTM',
      size: 'Caja 12 rollos',
      prefix: 'ROL',
      lot: 'RTM-PT-260905-001',
      north: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 35, comp: 12, acomodo: 4, embarque: 8, retrabajo: 1, transito: 0 },
    },
    {
      sku: 'PT-FOL-MED',
      name: 'Folleto Plegado Cuatricromía Laboratorio',
      brand: 'Impresos RTM',
      size: 'Caja 2,500 u',
      prefix: 'CJ',
      lot: 'RTM-PT-260906-007',
      north: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 28, comp: 10, acomodo: 2, embarque: 6, retrabajo: 1, transito: 0 },
    },
    {
      sku: 'PT-EMP-ALM',
      name: 'Caja Plegadiza Alimentos 6 Tintas + UV',
      brand: 'Impresos RTM',
      size: 'Tarima 15,000 u',
      prefix: 'TAR',
      lot: 'RTM-PT-260906-015',
      north: { disp: 0, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      south: { disp: 20, comp: 8, acomodo: 2, embarque: 4, retrabajo: 0, transito: 0 },
    },
  ];

  let seqCounter = 100;

  articleStockConfig.forEach((cfg) => {
    const addBatch = (
      whId: string,
      whName: string,
      counts: { disp: number; comp: number; acomodo: number; embarque: number; retrabajo: number; transito: number },
      aisleBase: string
    ) => {
      const statuses: Array<{ count: number; status: StockItemRecord['status']; locPrefix: string }> = [
        { count: counts.disp, status: 'Disponible', locPrefix: `${aisleBase}-A` },
        { count: counts.comp, status: 'Comprometido', locPrefix: `${aisleBase}-B` },
        { count: counts.acomodo, status: 'En acomodo', locPrefix: 'ACO-01' },
        { count: counts.embarque, status: 'En embarque', locPrefix: 'EMB-01' },
        { count: counts.retrabajo, status: 'En retrabajo', locPrefix: 'RET-NORTE' },
      ];

      statuses.forEach(({ count, status, locPrefix }) => {
        for (let i = 0; i < count; i++) {
          seqCounter++;
          const pos = (i % 12) + 1;
          const posStr = pos < 10 ? `0${pos}` : `${pos}`;
          const location = locPrefix.startsWith('ACO') || locPrefix.startsWith('EMB') || locPrefix.startsWith('RET')
            ? locPrefix
            : `${locPrefix}-${posStr}`;
          const age = 3 + (seqCounter % 14);

          stockList.push({
            uid: `${cfg.prefix}-RTM-260906-${seqCounter}`,
            sku: cfg.sku,
            productName: cfg.name,
            brand: cfg.brand,
            size: cfg.size,
            warehouseId: whId,
            warehouseName: whName,
            location,
            lotNumber: cfg.lot,
            entryDate: `${Math.max(1, 27 - age)} Ago 2026`,
            ageDays: age,
            status,
          });
        }
      });
    };

    if (cfg.north.disp + cfg.north.comp > 0) {
      const aisle = cfg.sku.startsWith('PAP') ? 'A' : cfg.sku.startsWith('FLX') ? 'B' : cfg.sku.startsWith('TNT') ? 'C' : 'D';
      addBatch('wh-mty-norte', 'Almacén Materia Prima', cfg.north, aisle);
    }

    if (cfg.south.disp + cfg.south.comp > 0) {
      const aisle = cfg.sku.startsWith('PT-ETIQ') ? 'A' : cfg.sku.startsWith('PT-FOL') ? 'B' : 'C';
      addBatch('wh-mty-sur', 'Almacén Producto Terminado', cfg.south, aisle);
    }
  });

  return stockList;
}

export const MOCK_STOCK_ITEMS: StockItemRecord[] = generateFullStockItems();

// =========================================================================
// MOVEMENTS / KARDEX LOG
// =========================================================================
export const MOCK_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-105',
    timestamp: '27 Ago 11:30',
    uid: 'BOB-RTM-260906-014',
    sku: 'FLX-BOPP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    movementType: 'DEVOLUCIÓN PRODUCCIÓN',
    origin: 'Línea Flexo Mark Andy #02',
    destination: 'Rack B-A-04 (ALM-MP)',
    user: 'operador_flexo',
    notes: 'Devolución de remanente 680 m de bobina surtida con 2,500 m (Lote RTM-MP-260902-011)',
  },
  {
    id: 'mov-104',
    timestamp: '27 Ago 10:45',
    uid: 'ROL-RTM-260906-501',
    sku: 'PT-ETIQ-FAR',
    productName: 'Etiqueta Farmacéutica 4x6" (Rollo 1,000 u)',
    movementType: 'LIBERACIÓN QA',
    origin: 'Staging Inspección QA (ALM-PT)',
    destination: 'Rack PT-B-01 (PT Liberado)',
    user: 'calidad_reynosa',
    notes: 'Inspección de registro de color y código de barras aprobada 100% (Lote RTM-PT-260905-001)',
  },
  {
    id: 'mov-103',
    timestamp: '27 Ago 10:15',
    uid: 'TAR-RTM-260906-182',
    sku: 'PAP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    movementType: 'SURTIDO OP',
    origin: 'Rack A-B-03 (ALM-MP)',
    destination: 'Línea Offset Heidelberg Speedmaster',
    user: 'almacenista_offset',
    notes: 'Surtido de 4,200 pliegos para OP-2026-0891 (Folleto Corporativo Cuatricromía)',
  },
  {
    id: 'mov-102',
    timestamp: '27 Ago 09:30',
    uid: 'TAR-RTM-260906-183',
    sku: 'PAP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    movementType: 'ACOMODO',
    origin: 'Rampa de Descarga REC-01',
    destination: 'Rack A-B-03 (ALM-MP)',
    user: 'montacargas01',
    notes: 'Acomodo de tarima completa 18,000 pliegos lote RTM-MP-260901-004',
  },
  {
    id: 'mov-101',
    timestamp: '27 Ago 09:00',
    uid: 'TAR-RTM-260906-183',
    sku: 'PAP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    movementType: 'RECEPCIÓN',
    origin: 'Proveedor Bio-Pappel (OC-2026-0081)',
    destination: 'Rampa de Descarga REC-01',
    user: 'recibo_almacen',
    notes: 'Recepción conforme contra remisión de proveedor. Factura BP-88912',
  },
  {
    id: 'mov-100',
    timestamp: '26 Ago 16:30',
    uid: 'BOB-RTM-260906-091',
    sku: 'FLX-BOPP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    movementType: 'CUARENTENA',
    origin: 'Rampa de Descarga REC-01',
    destination: 'Zona de Cuarentena QA (RET-NORTE)',
    user: 'calidad_reynosa',
    notes: 'Lote retenido preventivamente por tensión irregular en bobina de lote proveedor',
  },
  {
    id: 'mov-099',
    timestamp: '26 Ago 14:15',
    uid: 'TAR-RTM-260906-165',
    sku: 'PAP-BND-075',
    productName: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    movementType: 'RESERVA',
    origin: 'Rack A-A-02',
    destination: 'Staging Producción (Staging OP)',
    user: 'planeacion_prod',
    notes: 'Reserva automática para OP-2026-0904 programada para turno nocturno',
  },
  {
    id: 'mov-098',
    timestamp: '26 Ago 11:20',
    uid: 'CJ-RTM-260906-520',
    sku: 'PT-FOL-MED',
    productName: 'Folleto Plegado Cuatricromía Corporativo',
    movementType: 'EMBARQUE',
    origin: 'Rack PT-B-02 (ALM-PT)',
    destination: 'Rampa de Despacho EMB-01',
    user: 'despacho_pt',
    notes: 'Despacho de 10 cajas con remisión REM-2026-0039 a cliente industrial de Reynosa',
  },
];

// =========================================================================
// TRANSFERS (TRANSFERENCIAS ENTRE ÁREAS RTM)
// =========================================================================
export const MOCK_TRANSFERS: InventoryTransferOrder[] = [
  {
    id: 'trf-01',
    folio: 'TRF-2026-0012',
    sourceWarehouseId: 'wh-mty-norte',
    sourceWarehouseName: 'Almacén Materia Prima',
    destinationWarehouseId: 'wh-mty-sur',
    destinationWarehouseName: 'Almacén Producto Terminado',
    totalUnits: 10,
    status: 'Listo para salida',
    plannedDate: '27 Ago 2026',
    departureDate: '27 Ago 12:00',
    arrivalDate: '27 Ago 12:30 (Estimada)',
    driver: 'Transfer Interno Montacargas C-02',
    truckPlates: 'INT-RTM-02',
    items: [
      {
        sku: 'EMP-CAJ-COR',
        productName: 'Cajas Corrugadas 30x20x25 cm para Etiquetas',
        quantity: 10,
        serials: ['CJ-RTM-260906-110', 'CJ-RTM-260906-111'],
      },
    ],
  },
];
