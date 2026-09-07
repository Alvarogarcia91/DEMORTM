import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';

export interface PositionSerializedMattress {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  levelCode: 'C' | 'B' | 'A';
  locationCode: string; // ej. 'B-C-09', 'SHOW-01'
  lotNumber: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'Comprometido' | 'En inspección' | 'En retrabajo' | 'En embarque' | 'En acomodo' | 'En tránsito' | 'En exhibición';
  classification: string;
  notes?: string;
}

export interface LevelItem {
  levelCode: 'C' | 'B' | 'A';
  levelName: string; // 'Nivel C · Superior', 'Nivel B · Medio', 'Nivel A · Piso'
  locationCode: string; // ej. 'A-C-01', 'A-B-01', 'A-A-01'
  capacity: number; // 2 para C, 2 para B, 3 para A
  count: number;
  isOccupied: boolean;
  units: PositionSerializedMattress[];
}

export interface PositionRack {
  positionNumber: string; // ej. '01', '02', '09'
  positionId: string; // ej. 'A-01', 'B-09'
  aisle: string; // ej. 'A', 'B', 'C'
  capacity: number; // Máximo 7 colchones
  currentUnitsCount: number; // 0 a 7
  availableCount: number;
  committedCount: number;
  freeSlotsCount: number; // 7 - currentUnitsCount
  avgAgeDays: number;
  totalLevels: number; // 3 (C, B, A)
  levelsDistribution: {
    levelC: number;
    levelB: number;
    levelA: number;
  };
  levels: LevelItem[];
  units: PositionSerializedMattress[];
}

export interface AisleData {
  aisleCode: string; // ej. 'Pasillo A'
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
  code: string; // ej. 'SHOW-01', 'SHOW-02', etc.
  name: string; // ej. 'Bahía de Showroom 01'
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
    totalLocations: number; // Racks * 7 capacidad
    usedLocations: number;  // Racks ocupados
    freeLocations: number;  // Racks libres
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
  movementType: 'ENTRADA' | 'ACOMODO' | 'TRASPASO' | 'RETRABAJO' | 'SURTIDO' | 'PICKING' | 'TRASLADO A EXHIBICIÓN' | 'RETIRO DE EXHIBICIÓN';
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
// HELPER FOR SEEDING POSITION RACKS
// =========================================================================
function buildAisle(
  aisleLetter: string,
  numPositions: number,
  densityBias: number, // 0 to 1
  whCode: string
): AisleData {
  const positions: PositionRack[] = [];

  for (let i = 1; i <= numPositions; i++) {
    const posNum = i < 10 ? `0${i}` : `${i}`;
    const posId = `${aisleLetter}-${posNum}`;
    
    const seed = (aisleLetter.charCodeAt(0) * 19 + i * 37) % 100;
    let occupancy = 0;

    if (seed < 12) {
      occupancy = 0; // Empty
    } else if (seed < 28) {
      occupancy = Math.floor(1 + (seed % 2)); // 1 or 2 (Low)
    } else if (seed < 70) {
      occupancy = Math.floor(3 + (seed % 3)); // 3, 4 or 5 (Medium)
    } else if (seed < 90) {
      occupancy = 6; // High
    } else {
      occupancy = 7; // Full (7/7)
    }

    if (densityBias < 0.5 && occupancy > 4) {
      occupancy = Math.max(0, occupancy - 2);
    }

    // Capacity standard per level: C=2, B=2, A=3 (Total=7)
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
      const artIndex = (aisleLetter.charCodeAt(0) + i * 3 + indexInLevel * 2 + (level === 'C' ? 1 : level === 'B' ? 2 : 0)) % MOCK_MASTER_ARTICLES.length;
      const art = MOCK_MASTER_ARTICLES[artIndex] || MOCK_MASTER_ARTICLES[0];
      const age = (i * 2 + indexInLevel * 3) % 15;
      totalAge += age;

      const isCommitted = (seed + indexInLevel * 7 + (level === 'C' ? 1 : 0)) % 5 === 0;
      if (isCommitted) committed++;

      const levelOffset = level === 'C' ? 300000 : level === 'B' ? 200000 : 100000;
      const serialSuffix = levelOffset + ((aisleLetter.charCodeAt(0) * 8923 + i * 451 + indexInLevel * 179) % 89999);
      const uid = `SC-UID-2026-${serialSuffix}`;
      const locationCode = `${aisleLetter}-${level}-${posNum}`;

      return {
        uid,
        sku: art.sku,
        productName: art.name,
        brand: art.brand,
        size: art.size,
        levelCode: level,
        locationCode,
        lotNumber: `LOTE-2026-W${30 + ((i + indexInLevel) % 5)}`,
        entryDate: `${Math.max(1, 27 - age)} Ago 2026`,
        ageDays: age,
        status: (isCommitted ? 'Comprometido' : 'Disponible') as any,
        classification: 'Colchón Terminado / Calidad A',
        notes: `Inspección de empaque aprobada en rampa de recibo ${whCode}.`,
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
      units.push(u);
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

    const avgAgeDays = occupancy > 0 ? parseFloat((totalAge / occupancy).toFixed(1)) : 0;

    positions.push({
      positionNumber: posNum,
      positionId: posId,
      aisle: aisleLetter,
      capacity: 7,
      currentUnitsCount: occupancy,
      availableCount: occupancy - committed,
      committedCount: committed,
      freeSlotsCount: 7 - occupancy,
      avgAgeDays,
      totalLevels: 3,
      levelsDistribution: {
        levelC: countC,
        levelB: countB,
        levelA: countA,
      },
      levels,
      units,
    });
  }

  return {
    aisleCode: `Pasillo ${aisleLetter}`,
    zoneName: `Zona Racks Principal`,
    positions,
  };
}

// =========================================================================
// WAREHOUSE 1: CEDIS MONTERREY NORTE (MTY-N)
// =========================================================================
const mtyNorthAisles: AisleData[] = [
  buildAisle('A', 12, 0.85, 'MTY-N'),
  buildAisle('B', 12, 0.75, 'MTY-N'),
  buildAisle('C', 12, 0.65, 'MTY-N'),
  buildAisle('D', 10, 0.55, 'MTY-N'),
  buildAisle('E', 10, 0.45, 'MTY-N'),
];

let mtyNTotalCap = 0;
let mtyNUsedUnits = 0;
let mtyNOccupiedPositions = 0;
let mtyNTotalPositions = 0;

mtyNorthAisles.forEach((a) => {
  a.positions.forEach((p) => {
    mtyNTotalPositions++;
    mtyNTotalCap += p.capacity;
    mtyNUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) mtyNOccupiedPositions++;
  });
});

export const MOCK_CEDIS_MONTERREY_NORTE: WarehouseLayout = {
  id: 'wh-mty-norte',
  code: 'MTY-N',
  name: 'CEDIS Monterrey Norte',
  type: 'Centro de Distribución Primario',
  address: 'Av. Manuel L. Barragán #4500, San Nicolás de los Garza, N.L.',
  isActive: true,
  kpis: {
    totalLocations: mtyNTotalPositions,
    usedLocations: mtyNOccupiedPositions,
    freeLocations: mtyNTotalPositions - mtyNOccupiedPositions,
    occupancyPercentage: Math.round((mtyNUsedUnits / mtyNTotalCap) * 1000) / 10,
    physicalUnits: mtyNUsedUnits + 22,
  },
  aisles: mtyNorthAisles,
  receptionAreas: [
    {
      code: 'REC-01',
      name: 'Rampa de Recibo R-01',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 4,
      status: 'Operativa',
      units: [
        { uid: 'SC-UID-2026-000182', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', entryDate: '27 Ago 2026' },
        { uid: 'SC-UID-2026-000183', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', entryDate: '27 Ago 2026' },
      ],
    },
    {
      code: 'REC-02',
      name: 'Rampa de Recibo R-02',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 2,
      status: 'Operativa',
      units: [
        { uid: 'SC-UID-2026-000184', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', entryDate: '27 Ago 2026' },
      ],
    },
  ],
  stagingAreas: [
    {
      code: 'ACO-01',
      name: 'Acomodo Temporal Bloque Norte',
      type: 'acomodo',
      capacity: 15,
      currentUnits: 6,
      status: 'En proceso de asignación de racks',
      units: [
        { uid: 'SC-UID-2026-000165', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', entryDate: '27 Ago 2026' },
      ],
    },
    {
      code: 'ACO-02',
      name: 'Acomodo Temporal Bloque Sur',
      type: 'acomodo',
      capacity: 15,
      currentUnits: 3,
      status: 'Libre para recepción de tarde',
      units: [],
    },
  ],
  reworkZone: {
    code: 'RET-NORTE',
    name: 'Zona de Retrabajo & Calidad Norte',
    type: 'retrabajo',
    capacity: 12,
    currentUnits: 4,
    status: 'Operativa',
    units: [
      { uid: 'SC-UID-2026-000091', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', reason: 'Funda plástica con micro-rasgadura en rampa', entryDate: '26 Ago 2026' },
      { uid: 'SC-UID-2026-000092', sku: 'SC-RES-ORT-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', reason: 'Reetiquetado de código QR defectuoso', entryDate: '26 Ago 2026' },
      { uid: 'SC-UID-2026-000093', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', reason: 'Inspección de costura perimetral', entryDate: '25 Ago 2026' },
      { uid: 'SC-UID-2026-000094', sku: 'SC-AME-HAL-QS', productName: 'América Colchón Halston Queen Size', reason: 'Devolución de sucursal en verificación', entryDate: '24 Ago 2026' },
    ],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Carril de Embarque 01',
      type: 'embarque',
      capacity: 20,
      currentUnits: 14,
      status: 'Secuenciando Ruta MTY-Centro #402',
      units: [],
    },
    {
      code: 'EMB-02',
      name: 'Carril de Embarque 02',
      type: 'embarque',
      capacity: 20,
      currentUnits: 18,
      status: 'Listo para carga Camión Unidad C-12',
      units: [],
    },
    {
      code: 'EMB-03',
      name: 'Carril de Embarque 03',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible para consolidación',
      units: [],
    },
    {
      code: 'EMB-04',
      name: 'Carril de Embarque 04',
      type: 'embarque',
      capacity: 20,
      currentUnits: 8,
      status: 'Secuenciando Ruta Traspaso Saltillo',
      units: [],
    },
    {
      code: 'EMB-05',
      name: 'Carril de Embarque 05',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible para consolidación',
      units: [],
    },
  ],
};

// =========================================================================
// WAREHOUSE 2: CEDIS MONTERREY SUR (MTY-S)
// =========================================================================
const mtySouthAisles: AisleData[] = [
  buildAisle('A', 14, 0.65, 'MTY-S'),
  buildAisle('B', 14, 0.55, 'MTY-S'),
  buildAisle('C', 14, 0.45, 'MTY-S'),
  buildAisle('D', 14, 0.35, 'MTY-S'),
];

let mtySTotalCap = 0;
let mtySUsedUnits = 0;
let mtySOccupiedPositions = 0;
let mtySTotalPositions = 0;

mtySouthAisles.forEach((a) => {
  a.positions.forEach((p) => {
    mtySTotalPositions++;
    mtySTotalCap += p.capacity;
    mtySUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) mtySOccupiedPositions++;
  });
});

export const MOCK_CEDIS_MONTERREY_SUR: WarehouseLayout = {
  id: 'wh-mty-sur',
  code: 'MTY-S',
  name: 'CEDIS Monterrey Sur',
  type: 'Centro de Distribución Regional',
  address: 'Carretera Nacional Km 268, Villa de Santiago / Monterrey Sur, N.L.',
  isActive: true,
  kpis: {
    totalLocations: mtySTotalPositions,
    usedLocations: mtySOccupiedPositions,
    freeLocations: mtySTotalPositions - mtySOccupiedPositions,
    occupancyPercentage: Math.round((mtySUsedUnits / mtySTotalCap) * 1000) / 10,
    physicalUnits: mtySUsedUnits + 15,
  },
  aisles: mtySouthAisles,
  receptionAreas: [
    {
      code: 'REC-S1',
      name: 'Rampa de Recibo Sur R-01',
      type: 'recepcion',
      capacity: 8,
      currentUnits: 3,
      status: 'Operativa',
      units: [
        { uid: 'SC-UID-2026-000179', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', entryDate: '24 Ago 2026' },
      ],
    },
  ],
  stagingAreas: [
    {
      code: 'ACO-S1',
      name: 'Acomodo Temporal Sur',
      type: 'acomodo',
      capacity: 12,
      currentUnits: 2,
      status: 'Operativo',
      units: [],
    },
  ],
  reworkZone: {
    code: 'RET-SUR',
    name: 'Zona de Retrabajo Sur',
    type: 'retrabajo',
    capacity: 8,
    currentUnits: 2,
    status: 'Operativa',
    units: [
      { uid: 'SC-UID-2026-000088', sku: 'SC-RES-MNC-QS', productName: 'Restonic Colchón Moon Cool Queen Size', reason: 'Inspección de empaque plástico', entryDate: '25 Ago 2026' },
      { uid: 'SC-UID-2026-000089', sku: 'SC-SPA-VEN-MAT', productName: 'Spring Air Colchón Vendome Matrimonial', reason: 'Reetiquetado de código de barras', entryDate: '24 Ago 2026' },
    ],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Carril de Embarque 01',
      type: 'embarque',
      capacity: 20,
      currentUnits: 12,
      status: 'Secuenciando Ruta Valle Oriente',
      units: [],
    },
    {
      code: 'EMB-02',
      name: 'Carril de Embarque 02',
      type: 'embarque',
      capacity: 20,
      currentUnits: 6,
      status: 'Secuenciando Ruta Carretera Nacional',
      units: [],
    },
    {
      code: 'EMB-03',
      name: 'Carril de Embarque 03',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible',
      units: [],
    },
    {
      code: 'EMB-04',
      name: 'Carril de Embarque 04',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible',
      units: [],
    },
    {
      code: 'EMB-05',
      name: 'Carril de Embarque 05',
      type: 'embarque',
      capacity: 20,
      currentUnits: 0,
      status: 'Disponible',
      units: [],
    },
  ],
};

// =========================================================================
// SHOWROOM BAYS: SUCURSAL VALLE ORIENTE (6 BAHÍAS · MÍNIMO 2 NAYT)
// =========================================================================
export const MOCK_SHOWROOM_VALLE_ORIENTE: ShowroomBay[] = [
  {
    code: 'SHOW-01',
    name: 'Bahía de Showroom 01',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000201',
      sku: 'SC-NAYT-FLOW-IND',
      productName: 'Nayt Colchón Flow Basic White Individual',
      brand: 'Nayt',
      size: 'Individual',
      levelCode: 'A',
      locationCode: 'SHOW-01',
      lotNumber: 'LT-2026-N01',
      entryDate: '15 Ago 2026',
      ageDays: 12,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Colchón de demostración en piso de venta',
    },
  },
  {
    code: 'SHOW-02',
    name: 'Bahía de Showroom 02',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000202',
      sku: 'SC-NAYT-FLOW-MAT',
      productName: 'Nayt Colchón Flow Basic White Matrimonial',
      brand: 'Nayt',
      size: 'Matrimonial',
      levelCode: 'A',
      locationCode: 'SHOW-02',
      lotNumber: 'LT-2026-N02',
      entryDate: '16 Ago 2026',
      ageDays: 11,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Colchón de demostración en piso de venta',
    },
  },
  {
    code: 'SHOW-03',
    name: 'Bahía de Showroom 03',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000203',
      sku: 'SC-RES-ORT-MAT',
      productName: 'Restonic Colchón Ortopedic Matrimonial',
      brand: 'Restonic',
      size: 'Matrimonial',
      levelCode: 'A',
      locationCode: 'SHOW-03',
      lotNumber: 'LT-2026-R03',
      entryDate: '10 Ago 2026',
      ageDays: 17,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Exhibición línea tradicional ortopédica',
    },
  },
  {
    code: 'SHOW-04',
    name: 'Bahía de Showroom 04',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000204',
      sku: 'SC-SPA-REC-IND',
      productName: 'Spring Air Colchón Record Individual',
      brand: 'Spring Air',
      size: 'Individual',
      levelCode: 'A',
      locationCode: 'SHOW-04',
      lotNumber: 'LT-2026-S04',
      entryDate: '18 Ago 2026',
      ageDays: 9,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Exhibición individual juvenil',
    },
  },
  {
    code: 'SHOW-05',
    name: 'Bahía de Showroom 05',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000205',
      sku: 'SC-NAYT-FLOW-QS',
      productName: 'Nayt Colchón Flow Pro Comfort Queen Size',
      brand: 'Nayt',
      size: 'Queen Size',
      levelCode: 'A',
      locationCode: 'SHOW-05',
      lotNumber: 'LT-2026-N05',
      entryDate: '12 Ago 2026',
      ageDays: 15,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Modelo insignia en exhibición principal',
    },
  },
  {
    code: 'SHOW-06',
    name: 'Bahía de Showroom 06',
    status: 'Libre',
    mattress: undefined,
  },
];

// =========================================================================
// SHOWROOM BAYS: SUCURSAL CUMBRES (6 BAHÍAS · MÍNIMO 2 NAYT)
// =========================================================================
export const MOCK_SHOWROOM_CUMBRES: ShowroomBay[] = [
  {
    code: 'SHOW-01',
    name: 'Bahía de Showroom 01',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000211',
      sku: 'SC-NAYT-FLOW-QS',
      productName: 'Nayt Colchón Flow Pro Comfort Queen Size',
      brand: 'Nayt',
      size: 'Queen Size',
      levelCode: 'A',
      locationCode: 'SHOW-01',
      lotNumber: 'LT-2026-N08',
      entryDate: '14 Ago 2026',
      ageDays: 13,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Exhibición premium frontal Cumbres',
    },
  },
  {
    code: 'SHOW-02',
    name: 'Bahía de Showroom 02',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000212',
      sku: 'SC-SPA-REC-IND',
      productName: 'Spring Air Colchón Record Individual',
      brand: 'Spring Air',
      size: 'Individual',
      levelCode: 'A',
      locationCode: 'SHOW-02',
      lotNumber: 'LT-2026-S12',
      entryDate: '17 Ago 2026',
      ageDays: 10,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Exhibición para prueba de confort',
    },
  },
  {
    code: 'SHOW-03',
    name: 'Bahía de Showroom 03',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000213',
      sku: 'SC-NAYT-FLOW-MAT',
      productName: 'Nayt Colchón Flow Basic White Matrimonial',
      brand: 'Nayt',
      size: 'Matrimonial',
      levelCode: 'A',
      locationCode: 'SHOW-03',
      lotNumber: 'LT-2026-N09',
      entryDate: '13 Ago 2026',
      ageDays: 14,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Modelo de alta rotación en piso de venta',
    },
  },
  {
    code: 'SHOW-04',
    name: 'Bahía de Showroom 04',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000214',
      sku: 'SC-SEA-CLB-KS',
      productName: 'Sealy Colchón Celebration Plus King Size',
      brand: 'Sealy',
      size: 'King Size',
      levelCode: 'A',
      locationCode: 'SHOW-04',
      lotNumber: 'LT-2026-E02',
      entryDate: '11 Ago 2026',
      ageDays: 16,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Exhibición King Size alta gama',
    },
  },
  {
    code: 'SHOW-05',
    name: 'Bahía de Showroom 05',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000215',
      sku: 'SC-RES-ORT-MAT',
      productName: 'Restonic Colchón Ortopedic Matrimonial',
      brand: 'Restonic',
      size: 'Matrimonial',
      levelCode: 'A',
      locationCode: 'SHOW-05',
      lotNumber: 'LT-2026-R07',
      entryDate: '19 Ago 2026',
      ageDays: 8,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Línea ortopédica tradicional',
    },
  },
  {
    code: 'SHOW-06',
    name: 'Bahía de Showroom 06',
    status: 'Ocupada',
    mattress: {
      uid: 'SC-UID-2026-000216',
      sku: 'SC-NAYT-FLOW-IND',
      productName: 'Nayt Colchón Flow Basic White Individual',
      brand: 'Nayt',
      size: 'Individual',
      levelCode: 'A',
      locationCode: 'SHOW-06',
      lotNumber: 'LT-2026-N11',
      entryDate: '20 Ago 2026',
      ageDays: 7,
      status: 'En exhibición',
      classification: 'Exhibición Retail',
      notes: 'Nayt individual para pruebas de cliente',
    },
  },
];

// =========================================================================
// SUCURSAL 1: SUCURSAL VALLE ORIENTE (SUC-VO) - MINI ALMACÉN RETAIL
// =========================================================================
const valleOrienteAisles: AisleData[] = [
  buildAisle('A', 6, 0.70, 'SUC-VO'),
  buildAisle('B', 6, 0.60, 'SUC-VO'),
];

let voTotalCap = 0;
let voUsedUnits = 0;
let voOccupiedPositions = 0;
let voTotalPositions = 0;

valleOrienteAisles.forEach((a) => {
  a.positions.forEach((p) => {
    voTotalPositions++;
    voTotalCap += p.capacity;
    voUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) voOccupiedPositions++;
  });
});

export const MOCK_SUCURSAL_VALLE_ORIENTE: WarehouseLayout = {
  id: 'wh-suc-valle-oriente',
  code: 'SUC-VO',
  name: 'Sucursal Valle Oriente',
  type: 'Sucursal Retail',
  address: 'Av. Lázaro Cárdenas #1000, Valle Oriente, San Pedro Garza García, N.L.',
  isActive: true,
  kpis: {
    totalLocations: voTotalPositions,
    usedLocations: voOccupiedPositions,
    freeLocations: voTotalPositions - voOccupiedPositions,
    occupancyPercentage: Math.round((voUsedUnits / voTotalCap) * 1000) / 10,
    physicalUnits: 28,
  },
  aisles: valleOrienteAisles,
  receptionAreas: [
    {
      code: 'REC-VO',
      name: 'Área de Recepción',
      type: 'recepcion',
      capacity: 4,
      currentUnits: 1,
      status: 'Disponible para descarga',
      units: [],
    },
  ],
  stagingAreas: [
    {
      code: 'ENT-VO',
      name: 'Área de Entrega a Clientes',
      type: 'acomodo',
      capacity: 4,
      currentUnits: 1,
      status: 'Operativo para entrega inmediata',
      units: [],
    },
  ],
  reworkZone: {
    code: 'INC-VO',
    name: 'Zona de Incidencias',
    type: 'retrabajo',
    capacity: 3,
    currentUnits: 0,
    status: 'Sin incidencias',
    units: [],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Carril de Entrega / Despacho 01',
      type: 'embarque',
      capacity: 4,
      currentUnits: 1,
      status: 'Secuenciando reparto local San Pedro',
      units: [],
    },
  ],
  showroomBays: MOCK_SHOWROOM_VALLE_ORIENTE,
};

// =========================================================================
// SUCURSAL 2: SUCURSAL CUMBRES (SUC-CUM) - MINI ALMACÉN RETAIL
// =========================================================================
const cumbresAisles: AisleData[] = [
  buildAisle('A', 4, 0.65, 'SUC-CUM'),
  buildAisle('B', 4, 0.50, 'SUC-CUM'),
  buildAisle('C', 4, 0.40, 'SUC-CUM'),
];

let cumTotalCap = 0;
let cumUsedUnits = 0;
let cumOccupiedPositions = 0;
let cumTotalPositions = 0;

cumbresAisles.forEach((a) => {
  a.positions.forEach((p) => {
    cumTotalPositions++;
    cumTotalCap += p.capacity;
    cumUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) cumOccupiedPositions++;
  });
});

export const MOCK_SUCURSAL_CUMBRES: WarehouseLayout = {
  id: 'wh-suc-cumbres',
  code: 'SUC-CUM',
  name: 'Sucursal Cumbres',
  type: 'Sucursal Retail',
  address: 'Av. Paseo de los Leones #2800, Cumbres 5to Sector, Monterrey, N.L.',
  isActive: true,
  kpis: {
    totalLocations: cumTotalPositions,
    usedLocations: cumOccupiedPositions,
    freeLocations: cumTotalPositions - cumOccupiedPositions,
    occupancyPercentage: Math.round((cumUsedUnits / cumTotalCap) * 1000) / 10,
    physicalUnits: 21,
  },
  aisles: cumbresAisles,
  receptionAreas: [
    {
      code: 'REC-CUM',
      name: 'Área de Recepción',
      type: 'recepcion',
      capacity: 5,
      currentUnits: 1,
      status: 'Operativa',
      units: [],
    },
  ],
  stagingAreas: [
    {
      code: 'RES-CUM',
      name: 'Zona de Reserva / Staging',
      type: 'acomodo',
      capacity: 5,
      currentUnits: 2,
      status: 'Operativa para resurtido',
      units: [],
    },
    {
      code: 'ENT-CUM',
      name: 'Área de Entrega a Clientes',
      type: 'acomodo',
      capacity: 4,
      currentUnits: 1,
      status: 'Operativa para entrega mostrador',
      units: [],
    },
  ],
  reworkZone: {
    code: 'INC-CUM',
    name: 'Zona de Incidencias',
    type: 'retrabajo',
    capacity: 3,
    currentUnits: 0,
    status: 'Sin incidencias',
    units: [],
  },
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Carril de Entrega / Despacho 01',
      type: 'embarque',
      capacity: 4,
      currentUnits: 1,
      status: 'Secuenciando ruta Cumbres',
      units: [],
    },
    {
      code: 'EMB-02',
      name: 'Carril de Entrega / Despacho 02',
      type: 'embarque',
      capacity: 4,
      currentUnits: 0,
      status: 'Libre y disponible',
      units: [],
    },
  ],
  showroomBays: MOCK_SHOWROOM_CUMBRES,
};

export const MOCK_WAREHOUSES_LIST = [
  MOCK_CEDIS_MONTERREY_NORTE,
  MOCK_CEDIS_MONTERREY_SUR,
  MOCK_SUCURSAL_VALLE_ORIENTE,
  MOCK_SUCURSAL_CUMBRES,
];

// =========================================================================
// FULL STOCK ITEMS (EXISTENCIAS SERIALIZADAS REALES)
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

// Generate an authentic, consistent stock dataset spanning all SKUs and statuses
function generateFullStockItems(): StockItemRecord[] {
  const stockList: StockItemRecord[] = [];

  // Specification for each article to match exact totals across CEDIS and Sucursales
  const articleStockConfig = [
    {
      sku: 'SC-NAYT-FLOW-IND',
      name: 'Nayt Colchón Flow Basic White Individual',
      brand: 'Nayt',
      size: 'Individual',
      north: { disp: 18, comp: 3, acomodo: 1, embarque: 2, retrabajo: 0, transito: 0 },
      south: { disp: 11, comp: 1, acomodo: 1, embarque: 0, retrabajo: 1, transito: 0 },
      valleOriente: { disp: 2, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 3, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-NAYT-FLOW-MAT',
      name: 'Nayt Colchón Flow Basic White Matrimonial',
      brand: 'Nayt',
      size: 'Matrimonial',
      north: { disp: 12, comp: 2, acomodo: 1, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 7, comp: 1, acomodo: 1, embarque: 1, retrabajo: 0, transito: 0 },
      valleOriente: { disp: 3, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 2, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-NAYT-PRO-QS',
      name: 'Nayt Colchón Flow Pro Comfort Queen Size',
      brand: 'Nayt',
      size: 'Queen Size',
      north: { disp: 8, comp: 1, acomodo: 0, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 6, comp: 1, acomodo: 0, embarque: 0, retrabajo: 1, transito: 0 },
      valleOriente: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-NAYT-PRO-KS',
      name: 'Nayt Colchón Flow Pro Comfort King Size',
      brand: 'Nayt',
      size: 'King Size',
      north: { disp: 5, comp: 1, acomodo: 0, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 4, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 1 },
      valleOriente: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-SPA-REC-IND',
      name: 'Spring Air Colchón Record Individual',
      brand: 'Spring Air',
      size: 'Individual',
      north: { disp: 15, comp: 2, acomodo: 1, embarque: 1, retrabajo: 1, transito: 0 },
      south: { disp: 9, comp: 1, acomodo: 1, embarque: 1, retrabajo: 0, transito: 0 },
      valleOriente: { disp: 3, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-SPA-VEN-MAT',
      name: 'Spring Air Colchón Vendome Matrimonial',
      brand: 'Spring Air',
      size: 'Matrimonial',
      north: { disp: 10, comp: 2, acomodo: 1, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 7, comp: 0, acomodo: 0, embarque: 0, retrabajo: 1, transito: 1 },
      valleOriente: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-RES-ORT-MAT',
      name: 'Restonic Colchón Ortopedic Matrimonial',
      brand: 'Restonic',
      size: 'Matrimonial',
      north: { disp: 14, comp: 2, acomodo: 1, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 7, comp: 1, acomodo: 1, embarque: 0, retrabajo: 1, transito: 0 },
      valleOriente: { disp: 3, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-RES-MNC-QS',
      name: 'Restonic Colchón Moon Cool Queen Size',
      brand: 'Restonic',
      size: 'Queen Size',
      north: { disp: 8, comp: 1, acomodo: 0, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 4, comp: 1, acomodo: 0, embarque: 0, retrabajo: 1, transito: 0 },
      valleOriente: { disp: 2, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-AME-HAL-QS',
      name: 'América Colchón Halston Queen Size',
      brand: 'América',
      size: 'Queen Size',
      north: { disp: 6, comp: 1, acomodo: 0, embarque: 0, retrabajo: 1, transito: 0 },
      south: { disp: 4, comp: 1, acomodo: 0, embarque: 0, retrabajo: 0, transito: 1 },
      valleOriente: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
    {
      sku: 'SC-SEA-CLB-KS',
      name: 'Sealy Colchón Celebration Plus King Size',
      brand: 'Sealy',
      size: 'King Size',
      north: { disp: 4, comp: 1, acomodo: 0, embarque: 1, retrabajo: 0, transito: 0 },
      south: { disp: 3, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 1 },
      valleOriente: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
      cumbres: { disp: 1, comp: 0, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 },
    },
  ];

  let serialCounter = 100;

  articleStockConfig.forEach((art, artIdx) => {
    // Generate units for a specific location
    const addUnits = (
      whId: string,
      whName: string,
      whPrefix: string,
      statusCounts: { disp: number; comp: number; acomodo: number; embarque: number; retrabajo: number; transito: number }
    ) => {
      const statuses: Array<{ type: StockItemRecord['status']; count: number }> = [
        { type: 'Disponible', count: statusCounts.disp },
        { type: 'Comprometido', count: statusCounts.comp },
        { type: 'En acomodo', count: statusCounts.acomodo },
        { type: 'En embarque', count: statusCounts.embarque },
        { type: 'En retrabajo', count: statusCounts.retrabajo },
        { type: 'En tránsito', count: statusCounts.transito },
      ];

      statuses.forEach((st) => {
        for (let c = 0; c < st.count; c++) {
          serialCounter++;
          const uid = `SC-UID-2026-00${serialCounter}`;
          const age = (artIdx * 2 + c * 3) % 15;
          const entryDate = `${Math.max(1, 27 - age)} Ago 2026`;
          const lotNumber = `LOTE-2026-W${31 + ((artIdx + c) % 4)}`;

          let location = '';
          if (st.type === 'En acomodo') {
            location = whId === 'wh-mty-norte' ? 'ACO-01' : whId === 'wh-mty-sur' ? 'ACO-S1' : 'ENT-VO';
          } else if (st.type === 'En embarque') {
            location = whId === 'wh-mty-norte' ? 'EMB-02' : whId === 'wh-mty-sur' ? 'EMB-01' : 'DESP-VO';
          } else if (st.type === 'En retrabajo') {
            location = whId === 'wh-mty-norte' ? 'RET-NORTE' : whId === 'wh-mty-sur' ? 'RET-SUR' : 'INC-VO';
          } else if (st.type === 'En tránsito') {
            location = 'OTP-2026-0042 (En camión)';
          } else {
            // In racks (e.g. A-C-06, B-B-04)
            const aisle = String.fromCharCode(65 + ((artIdx + c) % 2));
            const level = c % 3 === 0 ? 'A' : c % 3 === 1 ? 'B' : 'C';
            const pos = ((c + artIdx) % 4) + 1;
            const posStr = pos < 10 ? `0${pos}` : `${pos}`;
            location = `${aisle}-${level}-${posStr}`;
          }

          stockList.push({
            uid,
            sku: art.sku,
            productName: art.name,
            brand: art.brand,
            size: art.size,
            warehouseId: whId,
            warehouseName: whName,
            location,
            lotNumber,
            entryDate,
            ageDays: age,
            status: st.type,
          });
        }
      });
    };

    addUnits('wh-mty-norte', 'CEDIS Monterrey Norte', 'MTY-N', art.north);
    addUnits('wh-mty-sur', 'CEDIS Monterrey Sur', 'MTY-S', art.south);
    addUnits('wh-suc-valle-oriente', 'Sucursal Valle Oriente', 'SUC-VO', { ...art.valleOriente, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 });
    addUnits('wh-suc-cumbres', 'Sucursal Cumbres', 'SUC-CUM', { ...art.cumbres, acomodo: 0, embarque: 0, retrabajo: 0, transito: 0 });
  });

  // Add Showroom items for Valle Oriente
  MOCK_SHOWROOM_VALLE_ORIENTE.forEach((b) => {
    if (b.mattress) {
      stockList.push({
        uid: b.mattress.uid,
        sku: b.mattress.sku,
        productName: b.mattress.productName,
        brand: b.mattress.brand,
        size: b.mattress.size,
        warehouseId: 'wh-suc-valle-oriente',
        warehouseName: 'Sucursal Valle Oriente',
        location: b.code,
        lotNumber: b.mattress.lotNumber,
        entryDate: b.mattress.entryDate,
        ageDays: b.mattress.ageDays,
        status: 'En exhibición',
      });
    }
  });

  // Add Showroom items for Cumbres
  MOCK_SHOWROOM_CUMBRES.forEach((b) => {
    if (b.mattress) {
      stockList.push({
        uid: b.mattress.uid,
        sku: b.mattress.sku,
        productName: b.mattress.productName,
        brand: b.mattress.brand,
        size: b.mattress.size,
        warehouseId: 'wh-suc-cumbres',
        warehouseName: 'Sucursal Cumbres',
        location: b.code,
        lotNumber: b.mattress.lotNumber,
        entryDate: b.mattress.entryDate,
        ageDays: b.mattress.ageDays,
        status: 'En exhibición',
      });
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
    id: 'mov-103',
    timestamp: '27 Ago 11:15',
    uid: 'SC-UID-2026-000201',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    movementType: 'TRASLADO A EXHIBICIÓN',
    origin: 'Recepción Sucursal VO',
    destination: 'SHOW-01',
    user: 'supervisor_vo',
    notes: 'Montaje de exhibición en Showroom Valle Oriente',
  },
  {
    id: 'mov-102',
    timestamp: '27 Ago 10:50',
    uid: 'SC-UID-2026-000213',
    sku: 'SC-NAYT-FLOW-MAT',
    productName: 'Nayt Colchón Flow Basic White Matrimonial',
    movementType: 'TRASLADO A EXHIBICIÓN',
    origin: 'Zona de Reserva Cumbres',
    destination: 'SHOW-03',
    user: 'asesor_cum',
    notes: 'Exhibición de modelo Nayt Matrimonial en Showroom',
  },
  {
    id: 'mov-101',
    timestamp: '27 Ago 10:24',
    uid: 'SC-UID-2026-000184',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    movementType: 'ACOMODO',
    origin: 'Recepción (Mesa Verificación)',
    destination: 'Rack A-C-04',
    user: 'montacargas02',
    notes: 'Acomodo confirmado en posición sugerida',
  },
  {
    id: 'mov-100',
    timestamp: '27 Ago 10:21',
    uid: 'SC-UID-2026-000184',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    movementType: 'ENTRADA',
    origin: 'Línea de Ensamble / Rampa',
    destination: 'Recepción (Mesa Verificación)',
    user: 'operador01',
    notes: 'Escaneo y serialización individual de pieza',
  },
  {
    id: 'mov-099',
    timestamp: '27 Ago 09:40',
    uid: 'SC-UID-2026-000149',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record Individual',
    movementType: 'SURTIDO',
    origin: 'Rack B-B-02',
    destination: 'Carril EMB-02',
    user: 'picker03',
    notes: 'Secuenciación para carga de camión Ruta MTY-402',
  },
  {
    id: 'mov-098',
    timestamp: '26 Ago 16:15',
    uid: 'SC-UID-2026-000091',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    movementType: 'RETRABAJO',
    origin: 'Rampa REC-01',
    destination: 'Zona Retrabajo Norte',
    user: 'calidad01',
    notes: 'Aislado por rasgadura en empaque plástico',
  },
  {
    id: 'mov-097',
    timestamp: '26 Ago 11:30',
    uid: 'SC-UID-2026-000122',
    sku: 'SC-RES-ORT-MAT',
    productName: 'Restonic Colchón Ortopedic Matrimonial',
    movementType: 'ACOMODO',
    origin: 'Área de Acomodo Temporal',
    destination: 'Rack A-A-08',
    user: 'montacargas01',
    notes: 'Acomodo estándar en bahía alta rotación',
  },
  {
    id: 'mov-096',
    timestamp: '25 Ago 15:45',
    uid: 'SC-UID-2026-000075',
    sku: 'SC-AME-HAL-QS',
    productName: 'América Colchón Halston Queen Size',
    movementType: 'TRASPASO',
    origin: 'CEDIS Monterrey Norte',
    destination: 'CEDIS Monterrey Sur (En tránsito)',
    user: 'logistica02',
    notes: 'Orden de traspaso OTP-2026-0042',
  },
];

// =========================================================================
// TRANSFERS
// =========================================================================
export const MOCK_TRANSFERS: InventoryTransferOrder[] = [
  {
    id: 'trf-01',
    folio: 'OTP-2026-0042',
    sourceWarehouseId: 'wh-mty-norte',
    sourceWarehouseName: 'CEDIS Monterrey Norte',
    destinationWarehouseId: 'wh-mty-sur',
    destinationWarehouseName: 'CEDIS Monterrey Sur',
    totalUnits: 15,
    status: 'En tránsito',
    plannedDate: '27 Ago 2026',
    departureDate: '27 Ago 08:30',
    arrivalDate: '27 Ago 14:00 (Estimada)',
    driver: 'Roberto Garza (Unidad Camión #08)',
    truckPlates: 'NL-8842-A',
    items: [
      { 
        sku: 'SC-NAYT-FLOW-IND', 
        productName: 'Nayt Colchón Flow Basic White Individual', 
        quantity: 10, 
        serials: [
          'SC-UID-2026-000171',
          'SC-UID-2026-000172',
          'SC-UID-2026-000173',
          'SC-UID-2026-000174',
          'SC-UID-2026-000175',
          'SC-UID-2026-000176',
          'SC-UID-2026-000177',
          'SC-UID-2026-000178',
          'SC-UID-2026-000179',
          'SC-UID-2026-000180'
        ] 
      },
      { 
        sku: 'SC-RES-ORT-MAT', 
        productName: 'Restonic Colchón Ortopedic Matrimonial', 
        quantity: 5, 
        serials: [
          'SC-UID-2026-000161',
          'SC-UID-2026-000162',
          'SC-UID-2026-000163',
          'SC-UID-2026-000164',
          'SC-UID-2026-000165'
        ] 
      },
    ],
  },
  {
    id: 'trf-02',
    folio: 'OTP-2026-0041',
    sourceWarehouseId: 'wh-mty-sur',
    sourceWarehouseName: 'CEDIS Monterrey Sur',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'CEDIS Monterrey Norte',
    totalUnits: 8,
    status: 'Recibido',
    plannedDate: '25 Ago 2026',
    departureDate: '25 Ago 09:00',
    arrivalDate: '25 Ago 13:20',
    driver: 'Manuel Treviño (Unidad #03)',
    truckPlates: 'NL-3319-B',
    items: [
      { 
        sku: 'SC-SPA-REC-IND', 
        productName: 'Spring Air Colchón Record Individual', 
        quantity: 8, 
        serials: [
          'SC-UID-2026-000110',
          'SC-UID-2026-000111',
          'SC-UID-2026-000112',
          'SC-UID-2026-000113',
          'SC-UID-2026-000114',
          'SC-UID-2026-000115',
          'SC-UID-2026-000116',
          'SC-UID-2026-000117'
        ] 
      },
    ],
  },
  {
    id: 'trf-03',
    folio: 'OTP-2026-0043',
    sourceWarehouseId: 'wh-mty-norte',
    sourceWarehouseName: 'CEDIS Monterrey Norte',
    destinationWarehouseId: 'wh-mty-sur',
    destinationWarehouseName: 'CEDIS Monterrey Sur',
    totalUnits: 20,
    status: 'Preparando',
    plannedDate: '28 Ago 2026',
    items: [
      { 
        sku: 'SC-NAYT-FLOW-MAT', 
        productName: 'Nayt Colchón Flow Basic White Matrimonial', 
        quantity: 12, 
        serials: [
          'SC-UID-2026-000121',
          'SC-UID-2026-000122',
          'SC-UID-2026-000123',
          'SC-UID-2026-000124',
          'SC-UID-2026-000125',
          'SC-UID-2026-000126',
          'SC-UID-2026-000127',
          'SC-UID-2026-000128',
          'SC-UID-2026-000129',
          'SC-UID-2026-000130',
          'SC-UID-2026-000131',
          'SC-UID-2026-000132'
        ] 
      },
      { 
        sku: 'SC-SEA-CLB-KS', 
        productName: 'Sealy Colchón Celebration Plus King Size', 
        quantity: 8, 
        serials: [
          'SC-UID-2026-000141',
          'SC-UID-2026-000142',
          'SC-UID-2026-000143',
          'SC-UID-2026-000144',
          'SC-UID-2026-000145',
          'SC-UID-2026-000146',
          'SC-UID-2026-000147',
          'SC-UID-2026-000148'
        ] 
      },
    ],
  },
  {
    id: 'trf-04',
    folio: 'OTP-2026-0044',
    sourceWarehouseId: 'wh-mty-norte',
    sourceWarehouseName: 'CEDIS Monterrey Norte',
    destinationWarehouseId: 'wh-suc-valle-oriente',
    destinationWarehouseName: 'Sucursal Valle Oriente',
    totalUnits: 10,
    receivedUnits: 6,
    receivedSerials: [
      'SC-UID-2026-000181',
      'SC-UID-2026-000182',
      'SC-UID-2026-000183',
      'SC-UID-2026-000184',
      'SC-UID-2026-000185',
      'SC-UID-2026-000186'
    ],
    status: 'Parcial',
    plannedDate: '27 Ago 2026',
    departureDate: '27 Ago 09:15',
    arrivalDate: '27 Ago 11:30',
    driver: 'Arturo Elizondo (Unidad #05)',
    truckPlates: 'NL-4412-C',
    items: [
      {
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        quantity: 6,
        serials: [
          'SC-UID-2026-000181',
          'SC-UID-2026-000182',
          'SC-UID-2026-000183',
          'SC-UID-2026-000184',
          'SC-UID-2026-000185',
          'SC-UID-2026-000186'
        ],
        receivedSerials: [
          'SC-UID-2026-000181',
          'SC-UID-2026-000182',
          'SC-UID-2026-000183',
          'SC-UID-2026-000184',
          'SC-UID-2026-000185',
          'SC-UID-2026-000186'
        ]
      },
      {
        sku: 'SC-RES-ORT-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        quantity: 4,
        serials: [
          'SC-UID-2026-000187',
          'SC-UID-2026-000188',
          'SC-UID-2026-000189',
          'SC-UID-2026-000190'
        ],
        receivedSerials: []
      }
    ]
  },
  {
    id: 'trf-05',
    folio: 'OTP-2026-0045',
    sourceWarehouseId: 'wh-mty-sur',
    sourceWarehouseName: 'CEDIS Monterrey Sur',
    destinationWarehouseId: 'wh-suc-cumbres',
    destinationWarehouseName: 'Sucursal Cumbres',
    totalUnits: 8,
    receivedUnits: 0,
    receivedSerials: [],
    status: 'En tránsito',
    plannedDate: '27 Ago 2026',
    departureDate: '27 Ago 10:00',
    arrivalDate: '27 Ago 12:45 (Estimada)',
    driver: 'Gerardo Cantú (Unidad #09)',
    truckPlates: 'NL-9921-A',
    items: [
      {
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        quantity: 5,
        serials: [
          'SC-UID-2026-000191',
          'SC-UID-2026-000192',
          'SC-UID-2026-000193',
          'SC-UID-2026-000194',
          'SC-UID-2026-000195'
        ],
        receivedSerials: []
      },
      {
        sku: 'SC-AME-HAL-QS',
        productName: 'América Colchón Halston Queen Size',
        quantity: 3,
        serials: [
          'SC-UID-2026-000196',
          'SC-UID-2026-000197',
          'SC-UID-2026-000198'
        ],
        receivedSerials: []
      }
    ]
  },
  {
    id: 'trf-06',
    folio: 'OTP-2026-0040',
    sourceWarehouseId: 'wh-mty-norte',
    sourceWarehouseName: 'CEDIS Monterrey Norte',
    destinationWarehouseId: 'wh-suc-valle-oriente',
    destinationWarehouseName: 'Sucursal Valle Oriente',
    totalUnits: 6,
    receivedUnits: 6,
    receivedSerials: [
      'SC-UID-2026-000151',
      'SC-UID-2026-000152',
      'SC-UID-2026-000153',
      'SC-UID-2026-000154',
      'SC-UID-2026-000155',
      'SC-UID-2026-000156'
    ],
    status: 'Recibido',
    plannedDate: '24 Ago 2026',
    departureDate: '24 Ago 08:00',
    arrivalDate: '24 Ago 10:45',
    driver: 'Arturo Elizondo (Unidad #05)',
    truckPlates: 'NL-4412-C',
    items: [
      {
        sku: 'SC-SEA-CLB-KS',
        productName: 'Sealy Colchón Celebration Plus King Size',
        quantity: 6,
        serials: [
          'SC-UID-2026-000151',
          'SC-UID-2026-000152',
          'SC-UID-2026-000153',
          'SC-UID-2026-000154',
          'SC-UID-2026-000155',
          'SC-UID-2026-000156'
        ],
        receivedSerials: [
          'SC-UID-2026-000151',
          'SC-UID-2026-000152',
          'SC-UID-2026-000153',
          'SC-UID-2026-000154',
          'SC-UID-2026-000155',
          'SC-UID-2026-000156'
        ]
      }
    ]
  }
];
