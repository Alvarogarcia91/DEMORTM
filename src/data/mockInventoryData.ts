// =========================================================================
// RTM INDUSTRIAL INVENTORY DATASET (CENTRAL MOCK)
// Single physical warehouse: Almacén Principal RTM (ALM-RTM)
// Single logical warehouse: Almacén Virtual / Control (ALM-VIRTUAL)
// =========================================================================

export interface PositionSerializedItem {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  category?: string;
  uom?: string;
  levelCode: 'C' | 'B' | 'A';
  locationCode: string; // ej. 'PAP-A-03', 'FLX-B-04', 'RET-QA'
  lotNumber: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'Comprometido' | 'En inspección' | 'En retrabajo' | 'En embarque' | 'En acomodo' | 'En tránsito' | 'Cuarentena' | 'Rechazado' | 'En exhibición';
  qaStatus?: 'Pendiente QA' | 'Liberado' | 'Cuarentena' | 'Rechazado';
  physicalQuantity?: number;
  reservedQuantity?: number;
  qaBlockedQuantity?: number;
  availableQuantity?: number;
  relatedOp?: string;
  classification: string;
  notes?: string;
}

export type PositionSerializedMattress = PositionSerializedItem;
export type PositionSerializedUnitItem = PositionSerializedItem;

export interface LevelItem {
  levelCode: 'C' | 'B' | 'A';
  levelName: string;
  locationCode: string;
  capacity: number;
  count: number;
  isOccupied: boolean;
  units: PositionSerializedItem[];
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
  units: PositionSerializedItem[];
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
    lotNumber?: string;
    qaStatus?: string;
  }[];
}

export interface ShowroomBay {
  code: string;
  name: string;
  status: 'Ocupada' | 'Libre';
  unitItem?: PositionSerializedItem;
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
  lotNumber?: string;
  quantity?: number;
  uom?: string;
  movementType: 
    | 'RECEPCIÓN'
    | 'ACOMODO'
    | 'REUBICACIÓN'
    | 'RESERVA'
    | 'LIBERACIÓN DE RESERVA'
    | 'SURTIDO OP'
    | 'DEVOLUCIÓN PRODUCCIÓN'
    | 'REMANENTE'
    | 'SCRAP'
    | 'AJUSTE +'
    | 'AJUSTE -'
    | 'CUARENTENA QA'
    | 'LIBERACIÓN QA'
    | 'PRODUCTO TERMINADO'
    | 'EMBARQUE'
    | 'ENTRADA'
    | 'TRASPASO'
    | 'RETRABAJO'
    | 'SURTIDO'
    | 'PICKING';
  origin: string;
  destination: string;
  user: string;
  reference?: string; // e.g. OP-2026-0891, OC-2026-0081, PLC-2026-0020
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
  uom: string;
  prefix: 'TAR' | 'BOB' | 'CJ' | 'ROL' | 'REM';
  classification: string;
  mainLocation: string;
  defaultLot: string;
  totalPhysical: number;
  reserved: number;
  qaBlocked: number;
  available: number;
  relatedOp?: string;
}

export const RTM_INDUSTRIAL_ITEMS: IndustrialItemDefinition[] = [
  {
    sku: 'MP-COU-090',
    name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    brand: 'Bio-Pappel',
    size: 'Tarima 18,000 pliegos',
    category: 'Papel Offset',
    uom: 'pliego',
    prefix: 'TAR',
    classification: 'Sustrato Offset / Grado Editorial',
    mainLocation: 'PAP-A-03',
    defaultLot: 'RTM-MP-260901-004',
    totalPhysical: 18000,
    reserved: 4200,
    qaBlocked: 0,
    available: 13800,
    relatedOp: 'OP-2026-0891',
  },
  {
    sku: 'MP-COU-150',
    name: 'Papel Couché 150 g (Pliegos 70x100 cm)',
    brand: 'Bio-Pappel',
    size: 'Tarima 12,000 pliegos',
    category: 'Papel Offset',
    uom: 'pliego',
    prefix: 'TAR',
    classification: 'Sustrato Offset / Grado Publicitario',
    mainLocation: 'PAP-A-05',
    defaultLot: 'RTM-MP-260901-008',
    totalPhysical: 12000,
    reserved: 2000,
    qaBlocked: 0,
    available: 10000,
    relatedOp: 'OP-2026-0882',
  },
  {
    sku: 'MP-BND-075',
    name: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    brand: 'Copamex',
    size: 'Tarima 20,000 pliegos',
    category: 'Papel Offset',
    uom: 'pliego',
    prefix: 'TAR',
    classification: 'Sustrato Offset / Grado Comercial',
    mainLocation: 'PAP-A-02',
    defaultLot: 'RTM-MP-260901-001',
    totalPhysical: 20000,
    reserved: 5000,
    qaBlocked: 0,
    available: 15000,
    relatedOp: 'OP-2026-0904',
  },
  {
    sku: 'MP-SBS-240',
    name: 'Cartulina Sulfatada SBS 240 g / 14 pts',
    brand: 'WestRock',
    size: 'Tarima 8,000 pliegos',
    category: 'Papel Offset',
    uom: 'pliego',
    prefix: 'TAR',
    classification: 'Cartulina SBS / Empaque Plegadizo',
    mainLocation: 'PAP-A-07',
    defaultLot: 'RTM-MP-260902-005',
    totalPhysical: 8000,
    reserved: 0,
    qaBlocked: 2000,
    available: 6000,
  },
  {
    sku: 'MP-BOP-WHT',
    name: 'Sustrato BOPP Blanco Brillante 60 mic',
    brand: 'Fasson Avery',
    size: 'Bobina 2,500 m',
    category: 'Sustratos Flexo',
    uom: 'bobina',
    prefix: 'BOB',
    classification: 'Película Autoadherible Flexo',
    mainLocation: 'FLX-B-04',
    defaultLot: 'RTM-MP-260902-011',
    totalPhysical: 29, // 25 liberadas + 4 en cuarentena QA
    reserved: 6,
    qaBlocked: 4, // 4 bobinas bloqueadas en QA (Caso B)
    available: 19,
    relatedOp: 'OP-2026-0882',
  },
  {
    sku: 'MP-BOP-TRP',
    name: 'Sustrato BOPP Transparente Ultra-Clear',
    brand: 'Fasson Avery',
    size: 'Bobina 2,000 m',
    category: 'Sustratos Flexo',
    uom: 'bobina',
    prefix: 'BOB',
    classification: 'Película Transparente Flexo',
    mainLocation: 'FLX-B-02',
    defaultLot: 'RTM-MP-260903-008',
    totalPhysical: 16,
    reserved: 4,
    qaBlocked: 0,
    available: 12,
  },
  {
    sku: 'MP-THM-ADH',
    name: 'Papel Térmico Autoadherible Top-Coated',
    brand: 'UPM Raflatac',
    size: 'Bobina 3,000 m',
    category: 'Sustratos Flexo',
    uom: 'bobina',
    prefix: 'BOB',
    classification: 'Papel Térmico / Código de Barras',
    mainLocation: 'FLX-B-06',
    defaultLot: 'RTM-MP-260904-012',
    totalPhysical: 20,
    reserved: 5,
    qaBlocked: 0,
    available: 15,
  },
  {
    sku: 'MP-INK-186',
    name: 'Tinta Especial Pantone PMS 186 C',
    brand: 'Siegwerk',
    size: 'Cubeta 10 kg',
    category: 'Tintas & Consumibles',
    uom: 'cubeta',
    prefix: 'CJ',
    classification: 'Tinta Directa Pantone Especial',
    mainLocation: 'TNT-C-03',
    defaultLot: 'RTM-MP-260903-002',
    totalPhysical: 30,
    reserved: 8,
    qaBlocked: 2,
    available: 20,
    relatedOp: 'OP-2026-0891',
  },
  {
    sku: 'MP-INK-BLK',
    name: 'Tinta Process Black Offset Intensa',
    brand: 'Sun Chemical',
    size: 'Lata 5 kg',
    category: 'Tintas & Consumibles',
    uom: 'lata',
    prefix: 'CJ',
    classification: 'Tinta Proceso Cuatricromía',
    mainLocation: 'TNT-C-01',
    defaultLot: 'RTM-MP-260902-003',
    totalPhysical: 40,
    reserved: 12,
    qaBlocked: 0,
    available: 28,
  },
  {
    sku: 'MP-VAR-UV',
    name: 'Barniz UV Ultra Brillo Curado Rápido',
    brand: 'Flint Group',
    size: 'Cubeta 20 kg',
    category: 'Tintas & Consumibles',
    uom: 'cubeta',
    prefix: 'CJ',
    classification: 'Barniz y Químicos de Acabado',
    mainLocation: 'TNT-C-05',
    defaultLot: 'RTM-MP-260904-006',
    totalPhysical: 15,
    reserved: 3,
    qaBlocked: 0,
    available: 12,
  },
  {
    sku: 'EMP-CAJ-COR',
    name: 'Cajas Corrugadas 30x20x25 cm para Etiquetas',
    brand: 'Smurfit Kappa',
    size: 'Paquete 50 pzas',
    category: 'Tintas & Consumibles',
    uom: 'paquete',
    prefix: 'CJ',
    classification: 'Material de Empaque & Protección',
    mainLocation: 'D-02',
    defaultLot: 'RTM-MP-260905-018',
    totalPhysical: 50,
    reserved: 10,
    qaBlocked: 0,
    available: 40,
  },
  {
    sku: 'PT-ETQ-001',
    name: 'Etiqueta Farmacéutica 4x6" en Rollo',
    brand: 'Impresos RTM',
    size: 'Caja 12 rollos (12,000 etiquetas)',
    category: 'Producto Terminado',
    uom: 'caja',
    prefix: 'ROL',
    classification: 'Producto Terminado / Aprobado QA',
    mainLocation: 'PT-01',
    defaultLot: 'RTM-PT-260905-001',
    totalPhysical: 48,
    reserved: 24, // reservado para despacho
    qaBlocked: 0,
    available: 12, // 12 cajas listas en EMB-01 y 12 disponibles en rack
    relatedOp: 'OP-2026-0882',
  },
  {
    sku: 'PT-ETQ-002',
    name: 'Etiqueta Promocional Flexo 6 Tintas',
    brand: 'Impresos RTM',
    size: 'Caja 2,500 u',
    category: 'Producto Terminado',
    uom: 'caja',
    prefix: 'CJ',
    classification: 'Producto Terminado / Aprobado QA',
    mainLocation: 'PT-03',
    defaultLot: 'RTM-PT-260906-007',
    totalPhysical: 35,
    reserved: 20,
    qaBlocked: 2,
    available: 13,
    relatedOp: 'OP-2026-0891',
  },
];

// Backwards compatibility alias
export const RTM_INDUSTRIAL_ITEMS_CATALOG = RTM_INDUSTRIAL_ITEMS;

// =========================================================================
// HELPER FOR SEEDING AISLE POSITION RACKS
// =========================================================================
function buildIndustrialAisle(
  aisleLetter: string,
  zoneName: string,
  numPositions: number,
  densityBias: number
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

    const units: PositionSerializedItem[] = [];
    let totalAge = 0;
    let committed = 0;

    const generateUnit = (level: 'C' | 'B' | 'A', indexInLevel: number): PositionSerializedItem => {
      // Pick appropriate industrial item based on aisle
      let artList = RTM_INDUSTRIAL_ITEMS;
      if (aisleLetter === 'A') {
        artList = RTM_INDUSTRIAL_ITEMS.filter(item => item.category === 'Papel Offset');
      } else if (aisleLetter === 'B') {
        artList = RTM_INDUSTRIAL_ITEMS.filter(item => item.category === 'Sustratos Flexo');
      } else if (aisleLetter === 'C') {
        artList = RTM_INDUSTRIAL_ITEMS.filter(item => item.category === 'Tintas & Consumibles');
      } else if (aisleLetter === 'D') {
        artList = RTM_INDUSTRIAL_ITEMS.filter(item => item.sku === 'EMP-CAJ-COR' || item.category === 'Tintas & Consumibles');
      } else if (aisleLetter === 'E') {
        artList = RTM_INDUSTRIAL_ITEMS.filter(item => item.category === 'Producto Terminado');
      }

      const artIndex = (i + indexInLevel * 2) % artList.length;
      const art = artList[artIndex];
      const age = (i * 2 + indexInLevel * 3) % 15;
      totalAge += age;

      // Special case: Couché 90g in A-03 (Level B) -> OP-2026-0891
      const isCoucheFlagship = aisleLetter === 'A' && i === 3 && level === 'B';
      const isCommitted = isCoucheFlagship || (seed + indexInLevel * 7) % 4 === 0;
      if (isCommitted) committed++;

      const serialSuffix = ((aisleLetter.charCodeAt(0) * 100 + i * 10 + indexInLevel + 1) % 900 + 100);
      const uid = isCoucheFlagship && indexInLevel === 0
        ? 'TAR-RTM-260906-182'
        : isCoucheFlagship && indexInLevel === 1
        ? 'TAR-RTM-260906-183'
        : `${art.prefix}-RTM-260906-${serialSuffix.toString().padStart(3, '0')}`;

      const locationCode = `${aisleLetter}-${level}-${posNum}`;
      const lotNumber = isCoucheFlagship
        ? 'RTM-MP-260901-004'
        : art.defaultLot;

      const qaStatus = 'Liberado';
      const physicalQty = art.uom === 'pliego' ? 6000 : art.uom === 'm lineal' ? 2500 : 1;
      const reservedQty = isCommitted ? (art.uom === 'pliego' ? 2100 : 1) : 0;
      const availableQty = physicalQty - reservedQty;

      return {
        uid,
        sku: art.sku,
        productName: art.name,
        brand: art.brand,
        size: art.size,
        category: art.category,
        uom: art.uom,
        levelCode: level,
        locationCode,
        lotNumber,
        entryDate: `${Math.max(1, 27 - age)} Ago 2026`,
        ageDays: age,
        status: (isCommitted ? 'Comprometido' : 'Disponible'),
        qaStatus,
        physicalQuantity: physicalQty,
        reservedQuantity: reservedQty,
        qaBlockedQuantity: 0,
        availableQuantity: availableQty,
        relatedOp: isCommitted ? (art.relatedOp || 'OP-2026-0891') : undefined,
        classification: art.classification,
        notes: `Material inspeccionado y liberado en Almacén Principal RTM.`,
      };
    };

    const unitsC: PositionSerializedItem[] = [];
    for (let c = 0; c < countC; c++) {
      const u = generateUnit('C', c);
      unitsC.push(u);
      units.push(u);
    }

    const unitsB: PositionSerializedItem[] = [];
    for (let b = 0; b < countB; b++) {
      const u = generateUnit('B', b);
      unitsB.push(u);
      units.push(u);
    }

    const unitsA: PositionSerializedItem[] = [];
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
// WAREHOUSE 1: ALMACÉN PRINCIPAL RTM (ALM-RTM) - ÚNICO ALMACÉN FÍSICO
// =========================================================================
const rtmAisles: AisleData[] = [
  buildIndustrialAisle('A', 'Zona Papel & Sustratos Offset', 12, 0.85),
  buildIndustrialAisle('B', 'Zona Bobinas & Sustratos Flexo', 12, 0.75),
  buildIndustrialAisle('C', 'Zona Tintas & Consumibles', 12, 0.65),
  buildIndustrialAisle('D', 'Zona Empaque & Insumos', 10, 0.55),
  buildIndustrialAisle('E', 'Zona Producto Terminado', 10, 0.45),
];

let rtmTotalCap = 0;
let rtmUsedUnits = 0;
let rtmOccupiedPositions = 0;
let rtmTotalPositions = 0;

rtmAisles.forEach((a) => {
  a.positions.forEach((p) => {
    rtmTotalPositions++;
    rtmTotalCap += p.capacity;
    rtmUsedUnits += p.currentUnitsCount;
    if (p.currentUnitsCount > 0) rtmOccupiedPositions++;
  });
});

export const MOCK_ALMACEN_PRINCIPAL_RTM: WarehouseLayout = {
  id: 'wh-alm-rtm',
  code: 'ALM-RTM',
  name: 'Almacén Principal RTM',
  type: 'Almacén Central Industrial & Producción',
  address: 'Planta Principal Impresos RTM · Reynosa, Tamps. (Nave Industrial 1)',
  isActive: true,
  kpis: {
    totalLocations: rtmTotalPositions,
    usedLocations: rtmOccupiedPositions,
    freeLocations: rtmTotalPositions - rtmOccupiedPositions,
    occupancyPercentage: Math.round((rtmUsedUnits / rtmTotalCap) * 1000) / 10,
    physicalUnits: rtmUsedUnits + 22,
  },
  aisles: rtmAisles,
  receptionAreas: [
    {
      code: 'REC-01',
      name: 'Rampa de Descarga de Sustratos y Químicos',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 4,
      status: 'Operativa',
      units: [
        { 
          uid: 'TAR-RTM-260906-182', 
          sku: 'MP-COU-090', 
          productName: 'Papel Couché 90 g (Pliegos 70x100 cm)', 
          lotNumber: 'RTM-MP-260901-004',
          qaStatus: 'Liberado',
          entryDate: '27 Ago 2026' 
        },
        { 
          uid: 'TAR-RTM-260906-183', 
          sku: 'MP-COU-090', 
          productName: 'Papel Couché 90 g (Pliegos 70x100 cm)', 
          lotNumber: 'RTM-MP-260901-004',
          qaStatus: 'Liberado',
          entryDate: '27 Ago 2026' 
        },
      ],
    },
    {
      code: 'REC-02',
      name: 'Rampa de Descarga de Químicos & Tintas',
      type: 'recepcion',
      capacity: 10,
      currentUnits: 2,
      status: 'Operativa',
      units: [
        { 
          uid: 'CJ-RTM-260906-184', 
          sku: 'MP-INK-186', 
          productName: 'Tinta Especial Pantone PMS 186 C', 
          lotNumber: 'RTM-MP-260903-002',
          qaStatus: 'Liberado',
          entryDate: '27 Ago 2026' 
        },
      ],
    },
  ],
  stagingAreas: [
    {
      code: 'ACO-01',
      name: 'Staging Producción / Reserva OP',
      type: 'acomodo',
      capacity: 15,
      currentUnits: 6,
      status: 'Surtido preparado para OP-2026-0891 (Offset)',
      units: [
        { 
          uid: 'TAR-RTM-260906-165', 
          sku: 'MP-BND-075', 
          productName: 'Papel Bond 75 g (Pliegos 61x90 cm)', 
          lotNumber: 'RTM-MP-260901-001',
          qaStatus: 'Liberado',
          entryDate: '27 Ago 2026' 
        },
      ],
    },
  ],
  reworkZone: {
    code: 'RET-QA',
    name: 'Zona de Cuarentena & Calidad QA',
    type: 'retrabajo',
    capacity: 12,
    currentUnits: 4,
    status: 'Operativa (Retención de Lotes para Inspección)',
    units: [
      { 
        uid: 'BOB-RTM-260906-091', 
        sku: 'MP-BOP-WHT', 
        productName: 'Sustrato BOPP Blanco Brillante 60 mic', 
        lotNumber: 'RTM-MP-260906-091',
        qaStatus: 'Cuarentena',
        reason: 'Tensión irregular en bobina de proveedor (Caso B: Físico existe, disponible = 0)', 
        entryDate: '26 Ago 2026' 
      },
      { 
        uid: 'CJ-RTM-260906-092', 
        sku: 'MP-INK-186', 
        productName: 'Tinta Especial Pantone PMS 186 C', 
        lotNumber: 'RTM-MP-260903-002',
        qaStatus: 'Cuarentena',
        reason: 'Revisión preventiva de viscosidad y tono en laboratorio QA', 
        entryDate: '26 Ago 2026' 
      },
      { 
        uid: 'TAR-RTM-260906-094', 
        sku: 'MP-SBS-240', 
        productName: 'Cartulina Sulfatada SBS 240 g / 14 pts', 
        lotNumber: 'RTM-MP-260902-005',
        qaStatus: 'Cuarentena',
        reason: 'Inspección de calibre por variación en tarima de proveedor', 
        entryDate: '24 Ago 2026' 
      },
    ],
  },
  // Exactamente UN SOLO carril según sección 2.3 de la especificación
  shippingLanes: [
    {
      code: 'EMB-01',
      name: 'Carril de Embarque 01',
      type: 'embarque',
      capacity: 20,
      currentUnits: 12,
      status: 'Consolidando Producto Terminado PT-ETQ-001 (OP-2026-0882)',
      units: [
        {
          uid: 'ROL-RTM-260906-501',
          sku: 'PT-ETQ-001',
          productName: 'Etiqueta Farmacéutica 4x6" en Rollo',
          lotNumber: 'RTM-PT-260905-001',
          qaStatus: 'Liberado',
          entryDate: '27 Ago 2026',
        }
      ],
    },
  ],
};

// =========================================================================
// WAREHOUSE 2: ALMACÉN VIRTUAL / CONTROL (ALM-VIRTUAL) - CONTROL LÓGICO
// =========================================================================
export const MOCK_ALMACEN_VIRTUAL: WarehouseLayout = {
  id: 'wh-alm-virtual',
  code: 'ALM-VIRTUAL',
  name: 'Almacén Virtual / Control',
  type: 'Almacén Virtual / Control Lógico',
  address: 'Control Administrativo y Conciliación RTM (Demo Lógica)',
  isActive: true,
  kpis: {
    totalLocations: 4,
    usedLocations: 2,
    freeLocations: 2,
    occupancyPercentage: 50.0,
    physicalUnits: 5,
  },
  aisles: [],
  receptionAreas: [
    {
      code: 'VIRT-REC',
      name: 'Entradas Pendientes de Validación Lógica',
      type: 'recepcion',
      capacity: 20,
      currentUnits: 2,
      status: 'Pendiente de Conciliación',
      units: [],
    }
  ],
  stagingAreas: [
    {
      code: 'VIRT-INV',
      name: 'Material en Investigación de Auditoría',
      type: 'acomodo',
      capacity: 30,
      currentUnits: 3,
      status: 'Bloqueado por Discrepancia',
      units: [],
    }
  ],
  reworkZone: {
    code: 'VIRT-ADJ',
    name: 'Ajustes Administrativos Temporales',
    type: 'retrabajo',
    capacity: 20,
    currentUnits: 0,
    status: 'Libre',
    units: [],
  },
  shippingLanes: [],
};

// Backward-compatible exports
export const MOCK_CEDIS_MONTERREY_NORTE = MOCK_ALMACEN_PRINCIPAL_RTM;
export const MOCK_CEDIS_MONTERREY_SUR = MOCK_ALMACEN_PRINCIPAL_RTM;
export const MOCK_ALMACEN_MATERIA_PRIMA = MOCK_ALMACEN_PRINCIPAL_RTM;
export const MOCK_ALMACEN_PRODUCTO_TERMINADO = MOCK_ALMACEN_PRINCIPAL_RTM;
export const MOCK_SUCURSAL_VALLE_ORIENTE = MOCK_ALMACEN_VIRTUAL;
export const MOCK_ALMACEN_MATAMOROS = MOCK_ALMACEN_VIRTUAL;
export const MOCK_SHOWROOM_VALLE_ORIENTE: ShowroomBay[] = [];
export const MOCK_STAGING_MATAMOROS: ShowroomBay[] = [];

export const MOCK_WAREHOUSES_LIST: WarehouseLayout[] = [
  MOCK_ALMACEN_PRINCIPAL_RTM,
  MOCK_ALMACEN_VIRTUAL,
];

// =========================================================================
// FULL STOCK ITEMS (EXISTENCIAS REALES COHERENTES CON RTM)
// =========================================================================
export interface StockItemRecord {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  category: string;
  uom: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  lotNumber: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'Comprometido' | 'En acomodo' | 'En retrabajo' | 'En embarque' | 'En tránsito' | 'Cuarentena' | 'Rechazado' | 'En exhibición';
  qaStatus: 'Pendiente QA' | 'Liberado' | 'Cuarentena' | 'Rechazado';
  physicalQuantity: number;
  reservedQuantity: number;
  qaBlockedQuantity: number;
  availableQuantity: number;
  relatedOp?: string;
}

function generateFullStockItems(): StockItemRecord[] {
  const stockList: StockItemRecord[] = [];
  let seqCounter = 100;

  RTM_INDUSTRIAL_ITEMS.forEach((cfg) => {
    // 1. Available physical units
    const dispUnits = cfg.uom === 'pliego' ? 2 : Math.max(1, Math.min(8, Math.floor(cfg.available / (cfg.uom === 'bobina' ? 3 : 4))));
    for (let i = 0; i < dispUnits; i++) {
      seqCounter++;
      const pos = (i % 10) + 1;
      const posStr = pos < 10 ? `0${pos}` : `${pos}`;
      const aisle = cfg.category === 'Papel Offset' ? 'A' : cfg.category === 'Sustratos Flexo' ? 'B' : cfg.category === 'Tintas & Consumibles' ? 'C' : 'E';
      const location = `${aisle}-A-${posStr}`;
      const age = 3 + (seqCounter % 14);

      const unitPhys = cfg.uom === 'pliego' ? Math.round(cfg.available / dispUnits) : (cfg.uom === 'bobina' ? 3 : 1);

      stockList.push({
        uid: `${cfg.prefix}-RTM-260906-${seqCounter}`,
        sku: cfg.sku,
        productName: cfg.name,
        brand: cfg.brand,
        size: cfg.size,
        category: cfg.category,
        uom: cfg.uom,
        warehouseId: 'wh-alm-rtm',
        warehouseName: 'Almacén Principal RTM',
        location: i === 0 ? cfg.mainLocation : location,
        lotNumber: cfg.defaultLot,
        entryDate: `${Math.max(1, 27 - age)} Ago 2026`,
        ageDays: age,
        status: 'Disponible',
        qaStatus: 'Liberado',
        physicalQuantity: unitPhys,
        reservedQuantity: 0,
        qaBlockedQuantity: 0,
        availableQuantity: unitPhys,
      });
    }

    // 2. Reserved units (for OP)
    if (cfg.reserved > 0) {
      seqCounter++;
      const aisle = cfg.category === 'Papel Offset' ? 'A' : cfg.category === 'Sustratos Flexo' ? 'B' : cfg.category === 'Tintas & Consumibles' ? 'C' : 'E';
      const reservedUid = cfg.sku === 'MP-COU-090' ? 'TAR-RTM-260906-182' : `${cfg.prefix}-RTM-260906-${seqCounter}`;

      stockList.push({
        uid: reservedUid,
        sku: cfg.sku,
        productName: cfg.name,
        brand: cfg.brand,
        size: cfg.size,
        category: cfg.category,
        uom: cfg.uom,
        warehouseId: 'wh-alm-rtm',
        warehouseName: 'Almacén Principal RTM',
        location: cfg.mainLocation,
        lotNumber: cfg.defaultLot,
        entryDate: '26 Ago 2026',
        ageDays: 2,
        status: 'Comprometido',
        qaStatus: 'Liberado',
        physicalQuantity: cfg.reserved,
        reservedQuantity: cfg.reserved,
        qaBlockedQuantity: 0,
        availableQuantity: 0,
        relatedOp: cfg.relatedOp || 'OP-2026-0891',
      });
    }

    // 3. QA Blocked units (Caso B)
    if (cfg.qaBlocked > 0) {
      seqCounter++;
      const blockedUid = cfg.sku === 'MP-BOP-WHT' 
        ? 'BOB-RTM-260906-091' 
        : `${cfg.prefix}-RTM-260906-${seqCounter}`;

      stockList.push({
        uid: blockedUid,
        sku: cfg.sku,
        productName: cfg.name,
        brand: cfg.brand,
        size: cfg.size,
        category: cfg.category,
        uom: cfg.uom,
        warehouseId: 'wh-alm-rtm',
        warehouseName: 'Almacén Principal RTM',
        location: 'RET-QA',
        lotNumber: cfg.sku === 'MP-BOP-WHT' ? 'RTM-MP-260906-091' : cfg.defaultLot,
        entryDate: '26 Ago 2026',
        ageDays: 3,
        status: 'Cuarentena',
        qaStatus: 'Cuarentena',
        physicalQuantity: cfg.qaBlocked,
        reservedQuantity: 0,
        qaBlockedQuantity: cfg.qaBlocked,
        availableQuantity: 0, // Regla de negocio: Disponible = 0
      });
    }

    // 4. Staging / Embarque unit for PT (Caso E)
    if (cfg.sku === 'PT-ETQ-001') {
      seqCounter++;
      stockList.push({
        uid: 'ROL-RTM-260906-501',
        sku: cfg.sku,
        productName: cfg.name,
        brand: cfg.brand,
        size: cfg.size,
        category: cfg.category,
        uom: cfg.uom,
        warehouseId: 'wh-alm-rtm',
        warehouseName: 'Almacén Principal RTM',
        location: 'EMB-01',
        lotNumber: 'RTM-PT-260905-001',
        entryDate: '27 Ago 2026',
        ageDays: 1,
        status: 'En embarque',
        qaStatus: 'Liberado',
        physicalQuantity: 12,
        reservedQuantity: 12,
        qaBlockedQuantity: 0,
        availableQuantity: 0,
        relatedOp: 'OP-2026-0882',
      });
    }
  });

  return stockList;
}

export const MOCK_STOCK_ITEMS: StockItemRecord[] = generateFullStockItems();

// =========================================================================
// MOVEMENTS / KARDEX LOG (APPEND-ONLY)
// =========================================================================
export const MOCK_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-108',
    timestamp: '27 Ago 12:45',
    uid: 'ROL-RTM-260906-501',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" en Rollo',
    lotNumber: 'RTM-PT-260905-001',
    quantity: 12,
    uom: 'caja',
    movementType: 'EMBARQUE',
    origin: 'Rack PT-01 (ALM-RTM)',
    destination: 'Carril de Embarque 01 (EMB-01)',
    user: 'despacho_pt',
    reference: 'REM-2026-0044',
    notes: 'Consolidación de 12 cajas de producto terminado para entrega a cliente Farmacéutica del Norte.',
  },
  {
    id: 'mov-107',
    timestamp: '27 Ago 12:00',
    uid: 'ROL-RTM-260906-501',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" en Rollo',
    lotNumber: 'RTM-PT-260905-001',
    quantity: 48,
    uom: 'caja',
    movementType: 'PRODUCTO TERMINADO',
    origin: 'Línea de Empaque & Rebobinado Flexo',
    destination: 'Rack PT-01 (ALM-RTM)',
    user: 'operador_flexo',
    reference: 'OP-2026-0882',
    notes: 'Entrada a inventario de lote completo de 48 cajas aprobado por aseguramiento de calidad.',
  },
  {
    id: 'mov-106',
    timestamp: '27 Ago 11:45',
    uid: 'ROL-RTM-260906-501',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" en Rollo',
    lotNumber: 'RTM-PT-260905-001',
    quantity: 48,
    uom: 'caja',
    movementType: 'LIBERACIÓN QA',
    origin: 'Staging Inspección QA (ALM-RTM)',
    destination: 'Rack PT-01 (PT Liberado)',
    user: 'calidad_rtm',
    reference: 'QA-LIB-2026-0092',
    notes: 'Inspección de registro de color, lectura de código de barras y adhesión aprobada 100%.',
  },
  {
    id: 'mov-105',
    timestamp: '27 Ago 11:30',
    uid: 'BOB-RTM-260906-014',
    sku: 'MP-BOP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    lotNumber: 'RTM-MP-260902-011',
    quantity: 680,
    uom: 'metro lineal',
    movementType: 'DEVOLUCIÓN PRODUCCIÓN',
    origin: 'Línea Flexo Mark Andy #02',
    destination: 'Rack B-04 (ALM-RTM)',
    user: 'operador_flexo',
    reference: 'OP-2026-0882',
    notes: 'Devolución de remanente 680 m de bobina surtida con 2,500 m (Lote RTM-MP-260902-011). Etiqueta REM-RTM-0041 colocada.',
  },
  {
    id: 'mov-104',
    timestamp: '27 Ago 10:45',
    uid: 'TAR-RTM-260906-182',
    sku: 'MP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    lotNumber: 'RTM-MP-260901-004',
    quantity: 4200,
    uom: 'pliego',
    movementType: 'SURTIDO OP',
    origin: 'PAP-A-03 (ALM-RTM)',
    destination: 'Línea Offset Heidelberg Speedmaster',
    user: 'almacenista_offset',
    reference: 'OP-2026-0891',
    notes: 'Surtido de 4,200 pliegos para OP-2026-0891 (Folleto Corporativo Cuatricromía).',
  },
  {
    id: 'mov-103',
    timestamp: '27 Ago 10:15',
    uid: 'TAR-RTM-260906-182',
    sku: 'MP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    lotNumber: 'RTM-MP-260901-004',
    quantity: 4200,
    uom: 'pliego',
    movementType: 'RESERVA',
    origin: 'PAP-A-03 (ALM-RTM)',
    destination: 'Staging Producción (Staging OP)',
    user: 'planeacion_prod',
    reference: 'OP-2026-0891',
    notes: 'Reserva automática de sustrato para orden de producción OP-2026-0891.',
  },
  {
    id: 'mov-102',
    timestamp: '27 Ago 09:30',
    uid: 'TAR-RTM-260906-183',
    sku: 'MP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    lotNumber: 'RTM-MP-260901-004',
    quantity: 18000,
    uom: 'pliego',
    movementType: 'ACOMODO',
    origin: 'Rampa de Descarga REC-01',
    destination: 'PAP-A-03 (ALM-RTM)',
    user: 'montacargas01',
    reference: 'ACM-2026-0045',
    notes: 'Acomodo de tarima completa 18,000 pliegos lote RTM-MP-260901-004 en rack de papel offset.',
  },
  {
    id: 'mov-101',
    timestamp: '27 Ago 09:00',
    uid: 'TAR-RTM-260906-183',
    sku: 'MP-COU-090',
    productName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
    lotNumber: 'RTM-MP-260901-004',
    quantity: 18000,
    uom: 'pliego',
    movementType: 'RECEPCIÓN',
    origin: 'Proveedor Bio-Pappel',
    destination: 'Rampa de Descarga REC-01',
    user: 'recibo_almacen',
    reference: 'OC-2026-0081',
    notes: 'Recepción conforme contra remisión y factura BP-88912 de proveedor Bio-Pappel.',
  },
  {
    id: 'mov-100',
    timestamp: '26 Ago 16:30',
    uid: 'BOB-RTM-260906-091',
    sku: 'MP-BOP-WHT',
    productName: 'Sustrato BOPP Blanco Brillante 60 mic',
    lotNumber: 'RTM-MP-260906-091',
    quantity: 4,
    uom: 'bobina',
    movementType: 'CUARENTENA QA',
    origin: 'Rampa de Descarga REC-01',
    destination: 'Zona de Cuarentena QA (RET-QA)',
    user: 'calidad_rtm',
    reference: 'NC-2026-0012',
    notes: 'Lote retenido preventivamente por tensión irregular en bobina de proveedor (Caso B: disponible = 0).',
  },
  {
    id: 'mov-099',
    timestamp: '26 Ago 14:15',
    uid: 'TAR-RTM-260906-165',
    sku: 'MP-BND-075',
    productName: 'Papel Bond 75 g (Pliegos 61x90 cm)',
    lotNumber: 'RTM-MP-260901-001',
    quantity: 5000,
    uom: 'pliego',
    movementType: 'RESERVA',
    origin: 'PAP-A-02 (ALM-RTM)',
    destination: 'Staging Producción (Staging OP)',
    user: 'planeacion_prod',
    reference: 'OP-2026-0904',
    notes: 'Reserva automática para OP-2026-0904 programada para turno nocturno.',
  },
];

// =========================================================================
// TRANSFERS (TRANSFERENCIAS INTERNAS RTM)
// =========================================================================
export const MOCK_TRANSFERS: InventoryTransferOrder[] = [
  {
    id: 'trf-01',
    folio: 'TRF-2026-0012',
    sourceWarehouseId: 'wh-alm-rtm',
    sourceWarehouseName: 'Almacén Principal RTM',
    destinationWarehouseId: 'wh-alm-virtual',
    destinationWarehouseName: 'Almacén Virtual / Control',
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
