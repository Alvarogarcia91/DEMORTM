import { MasterArticle } from './mockArticlesData';

export type ShowroomBayStatus =
  | 'Disponible'
  | 'En exhibición'
  | 'Pendiente de montaje'
  | 'Pendiente de retiro'
  | 'Bloqueado';

export interface ShowroomBayHistoryRecord {
  id: string;
  action: 'MONTAJE' | 'RETIRO' | 'BLOQUEO' | 'MANTENIMIENTO';
  uid: string;
  sku: string;
  productName: string;
  timestamp: string;
  user: string;
  originOrDestinationLocation: string;
  conditionNotes?: string;
}

export interface ShowroomBayRecord {
  id: string; // e.g. 'show-vo-01'
  code: string; // 'SHOW-01'
  name: string; // 'Bahía de Showroom 01'
  branchId: 'wh-reynosa' | 'wh-matamoros';
  branchName: 'Planta Principal Reynosa' | 'Almacén Satélite Matamoros';
  branchCode: 'PLT-REY' | 'ALM-MAT';
  status: ShowroomBayStatus;
  currentArticle?: {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    category: string;
    priceMxn: number;
    rotationTier: 'Alta' | 'Media' | 'Baja';
  };
  currentUnit?: {
    uid: string;
    lotNumber: string;
    mountedAt: string;
    daysInExhibition: number;
    originLocation: string;
    mountedBy: string;
    condition: 'Excelente' | 'Bueno' | 'Observado';
  };
  pendingOrderFolio?: string;
  pendingOrderType?: 'Montaje' | 'Retiro';
  suggestedReplacementSku?: string;
  history: ShowroomBayHistoryRecord[];
}

export type ShowroomPickOrderStatus =
  | 'Pendiente'
  | 'En proceso'
  | 'Parcial'
  | 'Completa'
  | 'Con incidencia'
  | 'Cancelada';

export type ShowroomPickOrderType =
  | 'Montaje de showroom'
  | 'Retiro de showroom'
  | 'Salida a exposición'
  | 'Retorno de exposición';

export interface ShowroomPickOrderItem {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  suggestedUid: string;
  scannedUid?: string;
  fromLocation: string;
  toLocation: string;
  status: 'Pendiente' | 'Recolectada' | 'Montada' | 'Incidencia';
  rejectionReason?: string;
}

export interface ShowroomPickOrder {
  id: string;
  folio: string; // 'OR-SHOW-2026-0021' o 'OR-EXPO-2026-0005'
  category: 'Showroom' | 'Expo';
  type: ShowroomPickOrderType;
  branchId: string;
  branchName: string;
  sourceLocation: string;
  destinationLocation: string;
  bayCode?: string;
  expoId?: string;
  expoFolio?: string;
  expoName?: string;
  totalUnits: number;
  completedUnits: number;
  priority: 'Alta' | 'Urgente' | 'Normal';
  createdAt: string;
  scheduledDate: string;
  operatorName?: string;
  status: ShowroomPickOrderStatus;
  items: ShowroomPickOrderItem[];
  notes?: string;
  outboundOrderFolio?: string;
}

export type ExpoStatus =
  | 'Planeada'
  | 'Preparando'
  | 'En tránsito'
  | 'En exposición externa'
  | 'Por regresar'
  | 'En retorno'
  | 'Cerrada';

export interface ExpoUnitItem {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  originLocation: string;
  status: 'Apartada para exposición' | 'En tránsito' | 'En exposición externa' | 'En retorno' | 'Reingresada' | 'Incidencia';
  scannedAtEvent?: string;
  returnCondition?: 'Excelente' | 'Buen estado' | 'Empaque dañado' | 'Producto dañado';
  inspectedAt?: string;
  inspectionNotes?: string;
}

export interface ExpoRecord {
  id: string;
  folio: string; // 'EXPO-2026-0008'
  name: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  originFacilityId: string;
  originFacilityName: string;
  responsiblePerson: string;
  contactPhone: string;
  status: ExpoStatus;
  totalUnits: number;
  items: {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    quantity: number;
    uids: string[];
  }[];
  uidsData: ExpoUnitItem[];
  operationalLinks: {
    pickOrderFolio: string;
    outboundOrderFolio?: string;
    remisionFolio?: string;
    returnOrderFolio?: string;
  };
  notes?: string;
  createdAt: string;
}

export interface CommercialShowroomSuggestion {
  sku: string;
  productName: string;
  brand: string;
  size: string;
  category: string;
  branchId: string;
  branchName: string;
  availableStock: number;
  monthlySalesUnits: number;
  rotationSpeed: 'Alta' | 'Muy Alta' | 'Media';
  currentlyExhibited: boolean;
  score: number; // 1-100
  reasons: string[];
  suggestedUid: {
    uid: string;
    location: string;
    ageDays: number;
    reason: string;
  };
  alternatives: {
    sku: string;
    name: string;
    availableStock: number;
    reason: string;
  }[];
}

// =========================================================================
// 1. DATASET DE 12 BAHÍAS DE SHOWROOM (6 Planta Reynosa + 6 Almacén Matamoros)
// =========================================================================
export const MOCK_SHOWROOM_BAYS: ShowroomBayRecord[] = [
  // SUCURSAL Planta Reynosa (6 BAHÍAS)
  {
    id: 'show-vo-01',
    code: 'SHOW-01',
    name: 'Bahía de Showroom 01',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-MUE-001',
      productName: 'Muestrario Cajas Plegadizas Caple',
      brand: 'Impresos RTM',
      size: 'Individual',
      category: 'Muestrarios Industriales',
      priceMxn: 7499,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000201',
      lotNumber: 'LT-2026-N01',
      mountedAt: '15 Ago 2026',
      daysInExhibition: 13,
      originLocation: 'A-B-02',
      mountedBy: 'Carlos Mendoza (Piso de Venta)',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-vo-01-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000201',
        sku: 'RTM-MUE-001',
        productName: 'Muestrario Cajas Plegadizas Caple',
        timestamp: '15 Ago 2026 · 10:15',
        user: 'Carlos Mendoza',
        originOrDestinationLocation: 'A-B-02',
        conditionNotes: 'Montaje inicial exitoso verificado por QR.',
      },
    ],
  },
  {
    id: 'show-vo-02',
    code: 'SHOW-02',
    name: 'Bahía de Showroom 02',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-MUE-001',
      productName: 'Muestrario Etiquetas Farmacéuticas Flexo',
      brand: 'Impresos RTM',
      size: 'Matrimonial',
      category: 'Muestrarios Industriales',
      priceMxn: 9299,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000202',
      lotNumber: 'LT-2026-N02',
      mountedAt: '16 Ago 2026',
      daysInExhibition: 12,
      originLocation: 'A-A-04',
      mountedBy: 'Carlos Mendoza (Piso de Venta)',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-vo-02-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000202',
        sku: 'RTM-MUE-001',
        productName: 'Muestrario Etiquetas Farmacéuticas Flexo',
        timestamp: '16 Ago 2026 · 11:30',
        user: 'Carlos Mendoza',
        originOrDestinationLocation: 'A-A-04',
        conditionNotes: 'Puesto en exhibición para campaña de confort.',
      },
    ],
  },
  {
    id: 'show-vo-03',
    code: 'SHOW-03',
    name: 'Bahía de Showroom 03',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'Pendiente de montaje',
    suggestedReplacementSku: 'RTM-RES-MNC-QS',
    pendingOrderFolio: 'OR-SHOW-2026-0021',
    pendingOrderType: 'Montaje',
    currentArticle: {
      sku: 'RTM-RES-MNC-QS',
      productName: 'Muestrario de Barnices UV y Foil Stamping',
      brand: 'Impresos RTM',
      size: 'Queen Size',
      category: 'Muestrarios Industriales',
      priceMxn: 13999,
      rotationTier: 'Alta',
    },
    history: [
      {
        id: 'hist-vo-03-0',
        action: 'RETIRO',
        uid: 'RTM-UID-2026-000140',
        sku: 'RTM-RES-ORT-MAT',
        productName: 'Muestrario de Plegadizos Farmacéuticos',
        timestamp: '26 Ago 2026 · 18:00',
        user: 'Mauricio Ramos',
        originOrDestinationLocation: 'MINI-RACK-01',
        conditionNotes: 'Retirado por rotación programada.',
      },
    ],
  },
  {
    id: 'show-vo-04',
    code: 'SHOW-04',
    name: 'Bahía de Showroom 04',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-SPA-REC-IND',
      productName: 'Catálogo de Cajas Rígidas para Cosméticos',
      brand: 'Impresos RTM',
      size: 'Individual',
      category: 'Muestrarios Industriales',
      priceMxn: 6899,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000204',
      lotNumber: 'LT-2026-S04',
      mountedAt: '18 Ago 2026',
      daysInExhibition: 10,
      originLocation: 'B-A-02',
      mountedBy: 'Mauricio Ramos',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-vo-04-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000204',
        sku: 'RTM-SPA-REC-IND',
        productName: 'Catálogo de Cajas Rígidas para Cosméticos',
        timestamp: '18 Ago 2026 · 09:20',
        user: 'Mauricio Ramos',
        originOrDestinationLocation: 'B-A-02',
      },
    ],
  },
  {
    id: 'show-vo-05',
    code: 'SHOW-05',
    name: 'Bahía de Showroom 05',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'Pendiente de retiro',
    pendingOrderFolio: 'OR-SHOW-2026-0022',
    pendingOrderType: 'Retiro',
    currentArticle: {
      sku: 'RTM-MUE-001',
      productName: 'Catálogo de Empaque Microcorrugado',
      brand: 'Impresos RTM',
      size: 'Queen Size',
      category: 'Muestrarios Industriales',
      priceMxn: 12499,
      rotationTier: 'Media',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000205',
      lotNumber: 'LT-2026-N05',
      mountedAt: '01 Jul 2026',
      daysInExhibition: 58,
      originLocation: 'B-B-01',
      mountedBy: 'Carlos Mendoza',
      condition: 'Bueno',
    },
    history: [
      {
        id: 'hist-vo-05-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000205',
        sku: 'RTM-MUE-001',
        productName: 'Catálogo de Empaque Microcorrugado',
        timestamp: '01 Jul 2026 · 14:00',
        user: 'Carlos Mendoza',
        originOrDestinationLocation: 'B-B-01',
        conditionNotes: 'Exhibición extendida.',
      },
    ],
  },
  {
    id: 'show-vo-06',
    code: 'SHOW-06',
    name: 'Bahía de Showroom 06',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    branchCode: 'PLT-REY',
    status: 'Disponible',
    history: [
      {
        id: 'hist-vo-06-1',
        action: 'RETIRO',
        uid: 'RTM-UID-2026-000190',
        sku: 'RTM-ALM-SOG-NUO',
        productName: 'Muestrario de Tintas Offset y Pantone',
        timestamp: '20 Ago 2026 · 16:30',
        user: 'Mauricio Ramos',
        originOrDestinationLocation: 'A-A-01',
        conditionNotes: 'Retiro para reacomodo de espacio disponible.',
      },
    ],
  },

  // SUCURSAL Almacén Matamoros (6 BAHÍAS)
  {
    id: 'show-cum-01',
    code: 'SHOW-01',
    name: 'Bahía de Showroom 01',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-MUE-001',
      productName: 'Catálogo de Empaque Microcorrugado',
      brand: 'Impresos RTM',
      size: 'Queen Size',
      category: 'Muestrarios Industriales',
      priceMxn: 12499,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000211',
      lotNumber: 'LT-2026-N08',
      mountedAt: '14 Ago 2026',
      daysInExhibition: 14,
      originLocation: 'A-A-02',
      mountedBy: 'Luis Fernando Garza (Almacén Satélite Matamoros)',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-cum-01-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000211',
        sku: 'RTM-MUE-001',
        productName: 'Catálogo de Empaque Microcorrugado',
        timestamp: '14 Ago 2026 · 10:00',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'A-A-02',
      },
    ],
  },
  {
    id: 'show-cum-02',
    code: 'SHOW-02',
    name: 'Bahía de Showroom 02',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-SPA-REC-IND',
      productName: 'Catálogo de Cajas Rígidas para Cosméticos',
      brand: 'Impresos RTM',
      size: 'Individual',
      category: 'Muestrarios Industriales',
      priceMxn: 6899,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000212',
      lotNumber: 'LT-2026-S12',
      mountedAt: '17 Ago 2026',
      daysInExhibition: 11,
      originLocation: 'B-A-01',
      mountedBy: 'Luis Fernando Garza',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-cum-02-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000212',
        sku: 'RTM-SPA-REC-IND',
        productName: 'Catálogo de Cajas Rígidas para Cosméticos',
        timestamp: '17 Ago 2026 · 11:45',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'B-A-01',
      },
    ],
  },
  {
    id: 'show-cum-03',
    code: 'SHOW-03',
    name: 'Bahía de Showroom 03',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'Disponible',
    history: [
      {
        id: 'hist-cum-03-1',
        action: 'RETIRO',
        uid: 'RTM-UID-2026-000213',
        sku: 'RTM-RES-FAN-MAT',
        productName: 'RTM Offset Muestrario Industrial RTM',
        timestamp: '25 Ago 2026 · 17:00',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'MINI-RACK-01',
        conditionNotes: 'Retiro por rotación de producto.',
      },
    ],
  },
  {
    id: 'show-cum-04',
    code: 'SHOW-04',
    name: 'Bahía de Showroom 04',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'Pendiente de montaje',
    suggestedReplacementSku: 'RTM-SEA-CLB-KS',
    pendingOrderFolio: 'OR-SHOW-2026-0023',
    pendingOrderType: 'Montaje',
    currentArticle: {
      sku: 'RTM-SEA-CLB-KS',
      productName: 'Muestrario de Blister Cards y Termosellables',
      brand: 'Impresos RTM',
      size: 'King Size',
      category: 'Muestrarios Industriales',
      priceMxn: 19899,
      rotationTier: 'Media',
    },
    history: [
      {
        id: 'hist-cum-04-0',
        action: 'RETIRO',
        uid: 'RTM-UID-2026-000155',
        sku: 'RTM-AME-OXF-MAT',
        productName: 'RTM Gráficos Muestrario Industrial RTM',
        timestamp: '26 Ago 2026 · 15:30',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'A-B-01',
      },
    ],
  },
  {
    id: 'show-cum-05',
    code: 'SHOW-05',
    name: 'Bahía de Showroom 05',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'Pendiente de retiro',
    pendingOrderFolio: 'OR-SHOW-2026-0024',
    pendingOrderType: 'Retiro',
    currentArticle: {
      sku: 'RTM-RES-ORT-MAT',
      productName: 'Muestrario de Plegadizos Farmacéuticos',
      brand: 'Impresos RTM',
      size: 'Matrimonial',
      category: 'Muestrarios Industriales',
      priceMxn: 8799,
      rotationTier: 'Media',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000215',
      lotNumber: 'LT-2026-R07',
      mountedAt: '12 Jul 2026',
      daysInExhibition: 47,
      originLocation: 'C-A-01',
      mountedBy: 'Luis Fernando Garza',
      condition: 'Bueno',
    },
    history: [
      {
        id: 'hist-cum-05-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000215',
        sku: 'RTM-RES-ORT-MAT',
        productName: 'Muestrario de Plegadizos Farmacéuticos',
        timestamp: '12 Jul 2026 · 12:00',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'C-A-01',
      },
    ],
  },
  {
    id: 'show-cum-06',
    code: 'SHOW-06',
    name: 'Bahía de Showroom 06',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    branchCode: 'ALM-MAT',
    status: 'En exhibición',
    currentArticle: {
      sku: 'RTM-MUE-001',
      productName: 'Muestrario Cajas Plegadizas Caple',
      brand: 'Impresos RTM',
      size: 'Individual',
      category: 'Muestrarios Industriales',
      priceMxn: 7499,
      rotationTier: 'Alta',
    },
    currentUnit: {
      uid: 'RTM-UID-2026-000216',
      lotNumber: 'LT-2026-N11',
      mountedAt: '20 Ago 2026',
      daysInExhibition: 8,
      originLocation: 'B-B-02',
      mountedBy: 'Luis Fernando Garza',
      condition: 'Excelente',
    },
    history: [
      {
        id: 'hist-cum-06-1',
        action: 'MONTAJE',
        uid: 'RTM-UID-2026-000216',
        sku: 'RTM-MUE-001',
        productName: 'Muestrario Cajas Plegadizas Caple',
        timestamp: '20 Ago 2026 · 10:30',
        user: 'Luis Fernando Garza',
        originOrDestinationLocation: 'B-B-02',
      },
    ],
  },
];

// =========================================================================
// 2. DATASET DE ÓRDENES DE RECOLECCIÓN (SHOWROOM & EXPOS)
// =========================================================================
export const MOCK_SHOWROOM_PICK_ORDERS: ShowroomPickOrder[] = [
  // 1. Showroom Pendiente Montaje
  {
    id: 'pick-show-01',
    folio: 'OR-SHOW-2026-0021',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa · A-B-03',
    destinationLocation: 'SHOW-03 (Showroom Planta Reynosa)',
    bayCode: 'SHOW-03',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Alta',
    createdAt: '28 Ago 2026 · 09:15',
    scheduledDate: '28 Ago 2026',
    operatorName: 'Carlos Mendoza',
    status: 'Pendiente',
    items: [
      {
        id: 'it-pick-01',
        sku: 'RTM-RES-MNC-QS',
        productName: 'Muestrario de Barnices UV y Foil Stamping',
        brand: 'Impresos RTM',
        size: 'Queen Size',
        suggestedUid: 'RTM-UID-2026-000184',
        fromLocation: 'A-B-03',
        toLocation: 'SHOW-03',
        status: 'Pendiente',
      },
    ],
    notes: 'Montaje prioritario de modelo insignia Moon Cool para fin de semana.',
  },
  // 2. Showroom En Proceso Retiro
  {
    id: 'pick-show-02',
    folio: 'OR-SHOW-2026-0022',
    category: 'Showroom',
    type: 'Retiro de showroom',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'SHOW-05 (Showroom Planta Reynosa)',
    destinationLocation: 'Almacén Planta Reynosa · MINI-RACK-02',
    bayCode: 'SHOW-05',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Normal',
    createdAt: '28 Ago 2026 · 10:30',
    scheduledDate: '28 Ago 2026',
    operatorName: 'Mauricio Ramos',
    status: 'En proceso',
    items: [
      {
        id: 'it-pick-02',
        sku: 'RTM-MUE-001',
        productName: 'Catálogo de Empaque Microcorrugado',
        brand: 'Impresos RTM',
        size: 'Queen Size',
        suggestedUid: 'RTM-UID-2026-000205',
        fromLocation: 'SHOW-05',
        toLocation: 'MINI-RACK-02',
        status: 'Pendiente',
      },
    ],
    notes: 'Retiro por rotación de antigüedad (>50 días en piso).',
  },
  // 3. Showroom Pendiente Montaje Almacén Matamoros
  {
    id: 'pick-show-03',
    folio: 'OR-SHOW-2026-0023',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    sourceLocation: 'Almacén Almacén Matamoros · A-C-02',
    destinationLocation: 'SHOW-04 (Showroom Almacén Matamoros)',
    bayCode: 'SHOW-04',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Alta',
    createdAt: '28 Ago 2026 · 11:00',
    scheduledDate: '28 Ago 2026',
    operatorName: 'Luis Fernando Garza',
    status: 'Pendiente',
    items: [
      {
        id: 'it-pick-03',
        sku: 'RTM-SEA-CLB-KS',
        productName: 'Muestrario de Blister Cards y Termosellables',
        brand: 'Impresos RTM',
        size: 'King Size',
        suggestedUid: 'RTM-UID-2026-000186',
        fromLocation: 'A-C-02',
        toLocation: 'SHOW-04',
        status: 'Pendiente',
      },
    ],
    notes: 'Montar modelo King Size RTM Packaging para exhibición principal.',
  },
  // 4. Showroom En Proceso Retiro Almacén Matamoros
  {
    id: 'pick-show-04',
    folio: 'OR-SHOW-2026-0024',
    category: 'Showroom',
    type: 'Retiro de showroom',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    sourceLocation: 'SHOW-05 (Showroom Almacén Matamoros)',
    destinationLocation: 'Almacén Almacén Matamoros · C-A-01',
    bayCode: 'SHOW-05',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Normal',
    createdAt: '28 Ago 2026 · 11:30',
    scheduledDate: '28 Ago 2026',
    operatorName: 'Luis Fernando Garza',
    status: 'En proceso',
    items: [
      {
        id: 'it-pick-04',
        sku: 'RTM-RES-ORT-MAT',
        productName: 'Muestrario de Plegadizos Farmacéuticos',
        brand: 'Impresos RTM',
        size: 'Matrimonial',
        suggestedUid: 'RTM-UID-2026-000215',
        fromLocation: 'SHOW-05',
        toLocation: 'C-A-01',
        status: 'Pendiente',
      },
    ],
  },
  // 5. Showroom Completa
  {
    id: 'pick-show-05',
    folio: 'OR-SHOW-2026-0018',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa · A-B-02',
    destinationLocation: 'SHOW-01',
    bayCode: 'SHOW-01',
    totalUnits: 1,
    completedUnits: 1,
    priority: 'Normal',
    createdAt: '15 Ago 2026 · 09:40',
    scheduledDate: '15 Ago 2026',
    operatorName: 'Carlos Mendoza',
    status: 'Completa',
    items: [
      {
        id: 'it-pick-05',
        sku: 'RTM-MUE-001',
        productName: 'Muestrario Cajas Plegadizas Caple',
        brand: 'Impresos RTM',
        size: 'Individual',
        suggestedUid: 'RTM-UID-2026-000201',
        scannedUid: 'RTM-UID-2026-000201',
        fromLocation: 'A-B-02',
        toLocation: 'SHOW-01',
        status: 'Montada',
      },
    ],
  },
  // 6. Showroom Completa
  {
    id: 'pick-show-06',
    folio: 'OR-SHOW-2026-0019',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa · A-A-04',
    destinationLocation: 'SHOW-02',
    bayCode: 'SHOW-02',
    totalUnits: 1,
    completedUnits: 1,
    priority: 'Normal',
    createdAt: '16 Ago 2026 · 10:50',
    scheduledDate: '16 Ago 2026',
    operatorName: 'Carlos Mendoza',
    status: 'Completa',
    items: [
      {
        id: 'it-pick-06',
        sku: 'RTM-MUE-001',
        productName: 'Muestrario Etiquetas Farmacéuticas Flexo',
        brand: 'Impresos RTM',
        size: 'Matrimonial',
        suggestedUid: 'RTM-UID-2026-000202',
        scannedUid: 'RTM-UID-2026-000202',
        fromLocation: 'A-A-04',
        toLocation: 'SHOW-02',
        status: 'Montada',
      },
    ],
  },
  // 7. Showroom Con Incidencia
  {
    id: 'pick-show-07',
    folio: 'OR-SHOW-2026-0020',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa · B-C-01',
    destinationLocation: 'SHOW-06',
    bayCode: 'SHOW-06',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Alta',
    createdAt: '22 Ago 2026 · 14:15',
    scheduledDate: '22 Ago 2026',
    operatorName: 'Mauricio Ramos',
    status: 'Con incidencia',
    items: [
      {
        id: 'it-pick-07',
        sku: 'RTM-AME-HAL-QS',
        productName: 'RTM Gráficos Muestrario Industrial RTM',
        brand: 'Impresos RTM',
        size: 'Queen Size',
        suggestedUid: 'RTM-UID-2026-000164',
        scannedUid: 'RTM-UID-2026-000164',
        fromLocation: 'B-C-01',
        toLocation: 'SHOW-06',
        status: 'Incidencia',
        rejectionReason: 'Empaque plástico exterior desgarrado al bajar de nivel C. Enviado a retrabajo.',
      },
    ],
    notes: 'Incidencia reportada INC-2026-0038 en Mesa de Verificación.',
  },
  // 8. Showroom Cancelada
  {
    id: 'pick-show-08',
    folio: 'OR-SHOW-2026-0015',
    category: 'Showroom',
    type: 'Montaje de showroom',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    sourceLocation: 'Almacén Almacén Matamoros · A-B-04',
    destinationLocation: 'SHOW-03',
    bayCode: 'SHOW-03',
    totalUnits: 1,
    completedUnits: 0,
    priority: 'Normal',
    createdAt: '18 Ago 2026 · 09:00',
    scheduledDate: '18 Ago 2026',
    operatorName: 'Luis Fernando Garza',
    status: 'Cancelada',
    items: [
      {
        id: 'it-pick-08',
        sku: 'RTM-BAS-NYT-IND',
        productName: 'RTM Impresos Exhibidor de Muestras Gráficas Individual',
        brand: 'Impresos RTM',
        size: 'Individual',
        suggestedUid: 'RTM-UID-2026-000171',
        fromLocation: 'A-B-04',
        toLocation: 'SHOW-03',
        status: 'Pendiente',
        rejectionReason: 'Cancelada por cambio de layout de sucursal.',
      },
    ],
  },
  // 9. Expo En Proceso Salida
  {
    id: 'pick-expo-01',
    folio: 'OR-EXPO-2026-0005',
    category: 'Expo',
    type: 'Salida a exposición',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa',
    destinationLocation: 'Cintermex - Sala C (Expo Hogar 2026)',
    expoId: 'expo-0008',
    expoFolio: 'EXPO-2026-0008',
    expoName: 'Expo Hogar & Confort Monterrey 2026',
    totalUnits: 8,
    completedUnits: 6,
    priority: 'Urgente',
    createdAt: '28 Ago 2026 · 08:30',
    scheduledDate: '28 Ago 2026',
    operatorName: 'Carlos Mendoza',
    status: 'En proceso',
    outboundOrderFolio: 'OS-2026-0056',
    items: [
      { id: 'it-pe-1', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Individual', suggestedUid: 'RTM-UID-2026-000301', scannedUid: 'RTM-UID-2026-000301', fromLocation: 'A-A-01', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-2', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Individual', suggestedUid: 'RTM-UID-2026-000302', scannedUid: 'RTM-UID-2026-000302', fromLocation: 'A-A-02', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-3', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', suggestedUid: 'RTM-UID-2026-000303', scannedUid: 'RTM-UID-2026-000303', fromLocation: 'A-B-01', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-4', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', suggestedUid: 'RTM-UID-2026-000304', scannedUid: 'RTM-UID-2026-000304', fromLocation: 'A-B-02', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-5', sku: 'RTM-SPA-REC-IND', productName: 'Catálogo de Cajas Rígidas para Cosméticos', brand: 'Impresos RTM', size: 'Individual', suggestedUid: 'RTM-UID-2026-000305', scannedUid: 'RTM-UID-2026-000305', fromLocation: 'B-A-01', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-6', sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', suggestedUid: 'RTM-UID-2026-000306', scannedUid: 'RTM-UID-2026-000306', fromLocation: 'B-A-03', toLocation: 'RAMPA-EMB-01', status: 'Recolectada' },
      { id: 'it-pe-7', sku: 'RTM-RES-ORT-MAT', productName: 'Muestrario de Plegadizos Farmacéuticos', brand: 'Impresos RTM', size: 'Matrimonial', suggestedUid: 'RTM-UID-2026-000307', fromLocation: 'B-B-02', toLocation: 'RAMPA-EMB-01', status: 'Pendiente' },
      { id: 'it-pe-8', sku: 'RTM-SEA-CLB-KS', productName: 'Muestrario de Blister Cards y Termosellables', brand: 'Impresos RTM', size: 'King Size', suggestedUid: 'RTM-UID-2026-000308', fromLocation: 'B-C-02', toLocation: 'RAMPA-EMB-01', status: 'Pendiente' },
    ],
    notes: 'Carga programada para embarque hoy 14:00 h en Camión #03.',
  },
  // 10. Expo Pendiente
  {
    id: 'pick-expo-02',
    folio: 'OR-EXPO-2026-0006',
    category: 'Expo',
    type: 'Salida a exposición',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Almacén Planta Reynosa',
    destinationLocation: 'Showcenter Complex (Expo Diseño 2026)',
    expoId: 'expo-0009',
    expoFolio: 'EXPO-2026-0009',
    expoName: 'Expo Arquitectura & Diseño San Pedro 2026',
    totalUnits: 6,
    completedUnits: 0,
    priority: 'Normal',
    createdAt: '28 Ago 2026 · 11:20',
    scheduledDate: '04 Sep 2026',
    status: 'Pendiente',
    items: [
      { id: 'it-pe2-1', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', suggestedUid: 'RTM-UID-2026-000321', fromLocation: 'A-C-01', toLocation: 'RAMPA-EMB-01', status: 'Pendiente' },
      { id: 'it-pe2-2', sku: 'RTM-SPA-PAL-QS', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', suggestedUid: 'RTM-UID-2026-000322', fromLocation: 'A-C-02', toLocation: 'RAMPA-EMB-01', status: 'Pendiente' },
      { id: 'it-pe2-3', sku: 'RTM-THE-GEL-KS', productName: 'RTM Cartón Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', suggestedUid: 'RTM-UID-2026-000323', fromLocation: 'B-C-03', toLocation: 'RAMPA-EMB-01', status: 'Pendiente' },
    ],
  },
  // 11. Expo Completa (Pabellón M)
  {
    id: 'pick-expo-03',
    folio: 'OR-EXPO-2026-0004',
    category: 'Expo',
    type: 'Salida a exposición',
    branchId: 'wh-mty-norte',
    branchName: 'Almacén Principal Reynosa Norte',
    sourceLocation: 'Almacén Principal Reynosa Norte · Pasillo A y B',
    destinationLocation: 'Pabellón M Auditorio (Expo Mueble 2026)',
    expoId: 'expo-0007',
    expoFolio: 'EXPO-2026-0007',
    expoName: 'Expo Mueble & Descanso Pabellón M 2026',
    totalUnits: 10,
    completedUnits: 10,
    priority: 'Alta',
    createdAt: '24 Ago 2026 · 10:00',
    scheduledDate: '24 Ago 2026',
    operatorName: 'Rodrigo Benítez',
    status: 'Completa',
    outboundOrderFolio: 'OS-2026-0048',
    items: [
      { id: 'it-pe3-1', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', suggestedUid: 'RTM-UID-2026-000251', scannedUid: 'RTM-UID-2026-000251', fromLocation: 'A-A-01', toLocation: 'EMB-01', status: 'Montada' },
      { id: 'it-pe3-2', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', suggestedUid: 'RTM-UID-2026-000252', scannedUid: 'RTM-UID-2026-000252', fromLocation: 'A-A-03', toLocation: 'EMB-01', status: 'Montada' },
    ],
  },
  // 12. Expo Retorno En Retrabajo
  {
    id: 'pick-expo-04',
    folio: 'OR-EXPO-2026-0003',
    category: 'Expo',
    type: 'Retorno de exposición',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    sourceLocation: 'Santiago N.L. Centro',
    destinationLocation: 'Mesa de Verificación · Retrabajo Planta Reynosa',
    expoId: 'expo-0001',
    expoFolio: 'EXPO-2026-0001',
    expoName: 'Feria Inmobiliaria Santiago 2026',
    totalUnits: 4,
    completedUnits: 3,
    priority: 'Normal',
    createdAt: '06 Ago 2026 · 11:00',
    scheduledDate: '06 Ago 2026',
    operatorName: 'Carlos Mendoza',
    status: 'Con incidencia',
    items: [
      { id: 'it-pe4-1', sku: 'RTM-RES-ORT-MAT', productName: 'Muestrario de Plegadizos Farmacéuticos', brand: 'Impresos RTM', size: 'Matrimonial', suggestedUid: 'RTM-UID-2026-000112', scannedUid: 'RTM-UID-2026-000112', fromLocation: 'SANTIAGO-01', toLocation: 'INC-VO', status: 'Incidencia', rejectionReason: 'Esquina inferior descosida durante maniobra de desmontaje.' },
    ],
  },
];

// =========================================================================
// 3. DATASET DE EXPOSICIONES EXTERNAS (8 EXPOS)
// =========================================================================
export const MOCK_EXPOS: ExpoRecord[] = [
  // 1. Preparando / Activa próxima
  {
    id: 'expo-0008',
    folio: 'EXPO-2026-0008',
    name: 'Expo Hogar & Confort Monterrey 2026',
    venue: 'Cintermex - Sala C & Pasillo Central',
    address: 'Av. Fundidora #501, Col. Obrera, Monterrey, N.L.',
    startDate: '29 Ago 2026',
    endDate: '01 Sep 2026',
    originFacilityId: 'wh-reynosa',
    originFacilityName: 'Planta Principal Reynosa',
    responsiblePerson: 'Lic. Sofía Garza (Mkt & Eventos)',
    contactPhone: '81 8399 2000',
    status: 'Preparando',
    totalUnits: 8,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Individual', quantity: 2, uids: ['RTM-UID-2026-000301', 'RTM-UID-2026-000302'] },
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 1, uids: ['RTM-UID-2026-000303'] },
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', quantity: 1, uids: ['RTM-UID-2026-000304'] },
      { sku: 'RTM-SPA-REC-IND', productName: 'Catálogo de Cajas Rígidas para Cosméticos', brand: 'Impresos RTM', size: 'Individual', quantity: 1, uids: ['RTM-UID-2026-000305'] },
      { sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 1, uids: ['RTM-UID-2026-000306'] },
      { sku: 'RTM-RES-ORT-MAT', productName: 'Muestrario de Plegadizos Farmacéuticos', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 1, uids: ['RTM-UID-2026-000307'] },
      { sku: 'RTM-SEA-CLB-KS', productName: 'Muestrario de Blister Cards y Termosellables', brand: 'Impresos RTM', size: 'King Size', quantity: 1, uids: ['RTM-UID-2026-000308'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000301', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Individual', originLocation: 'A-A-01', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000302', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Individual', originLocation: 'A-A-02', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000303', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'A-B-01', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000304', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'A-B-02', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000305', sku: 'RTM-SPA-REC-IND', productName: 'Catálogo de Cajas Rígidas para Cosméticos', brand: 'Impresos RTM', size: 'Individual', originLocation: 'B-A-01', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000306', sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'B-A-03', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000307', sku: 'RTM-RES-ORT-MAT', productName: 'Muestrario de Plegadizos Farmacéuticos', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'B-B-02', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000308', sku: 'RTM-SEA-CLB-KS', productName: 'Muestrario de Blister Cards y Termosellables', brand: 'Impresos RTM', size: 'King Size', originLocation: 'B-C-02', status: 'Apartada para exposición' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0005',
      outboundOrderFolio: 'OS-2026-0056',
      remisionFolio: 'REM-2026-0098',
    },
    notes: 'Stand 42-B Cintermex. Salida de transporte programada para hoy 14:00 hrs.',
    createdAt: '26 Ago 2026',
  },

  // 2. Planeada
  {
    id: 'expo-0009',
    folio: 'EXPO-2026-0009',
    name: 'Expo Arquitectura & Diseño San Pedro 2026',
    venue: 'Showcenter Complex - Nivel 2',
    address: 'Av. Diego Rivera #1000, Planta Reynosa, Reynosa, Tamps.',
    startDate: '05 Sep 2026',
    endDate: '08 Sep 2026',
    originFacilityId: 'wh-reynosa',
    originFacilityName: 'Planta Principal Reynosa',
    responsiblePerson: 'Arq. Roberto Cantú (Convenios)',
    contactPhone: '81 1234 5678',
    status: 'Planeada',
    totalUnits: 6,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', quantity: 2, uids: ['RTM-UID-2026-000321', 'RTM-UID-2026-000322'] },
      { sku: 'RTM-SPA-PAL-QS', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', quantity: 2, uids: ['RTM-UID-2026-000323', 'RTM-UID-2026-000324'] },
      { sku: 'RTM-THE-GEL-KS', productName: 'RTM Cartón Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', quantity: 2, uids: ['RTM-UID-2026-000325', 'RTM-UID-2026-000326'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000321', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', originLocation: 'A-C-01', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000322', sku: 'RTM-MUE-001', productName: 'RTM Impresos Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', originLocation: 'A-C-02', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000323', sku: 'RTM-SPA-PAL-QS', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'B-C-03', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000324', sku: 'RTM-SPA-PAL-QS', productName: 'RTM Flexo Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'B-C-04', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000325', sku: 'RTM-THE-GEL-KS', productName: 'RTM Cartón Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', originLocation: 'C-A-01', status: 'Apartada para exposición' },
      { uid: 'RTM-UID-2026-000326', sku: 'RTM-THE-GEL-KS', productName: 'RTM Cartón Muestrario Industrial RTM', brand: 'Impresos RTM', size: 'King Size', originLocation: 'C-A-02', status: 'Apartada para exposición' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0006',
    },
    notes: 'Evento premium enfocado a interioristas y desarrolladores residenciales.',
    createdAt: '28 Ago 2026',
  },

  // 3. Activa en Sede Externa
  {
    id: 'expo-0007',
    folio: 'EXPO-2026-0007',
    name: 'Expo Mueble & Descanso Pabellón M 2026',
    venue: 'Pabellón M Auditorio - Mezzanine Comercial',
    address: 'Av. Constitución #1100, Centro, Monterrey, N.L.',
    startDate: '25 Ago 2026',
    endDate: '29 Ago 2026',
    originFacilityId: 'wh-mty-norte',
    originFacilityName: 'Almacén Principal Reynosa Norte',
    responsiblePerson: 'Ing. Alejandro Torres (Logística)',
    contactPhone: '81 8150 4000',
    status: 'En exposición externa',
    totalUnits: 10,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', quantity: 4, uids: ['RTM-UID-2026-000251', 'RTM-UID-2026-000252', 'RTM-UID-2026-000253', 'RTM-UID-2026-000254'] },
      { sku: 'RTM-RES-MNC-QS', productName: 'RTM Offset Moon Cool Queen', brand: 'Impresos RTM', size: 'Queen Size', quantity: 3, uids: ['RTM-UID-2026-000255', 'RTM-UID-2026-000256', 'RTM-UID-2026-000257'] },
      { sku: 'RTM-SEA-CLB-KS', productName: 'RTM Packaging Crown Jewel King Size', brand: 'Impresos RTM', size: 'King Size', quantity: 3, uids: ['RTM-UID-2026-000258', 'RTM-UID-2026-000259', 'RTM-UID-2026-000260'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000251', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'Almacén Central-NORTE', status: 'En exposición externa', scannedAtEvent: '25 Ago 2026 · 09:00' },
      { uid: 'RTM-UID-2026-000252', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'Almacén Central-NORTE', status: 'En exposición externa', scannedAtEvent: '25 Ago 2026 · 09:05' },
      { uid: 'RTM-UID-2026-000255', sku: 'RTM-RES-MNC-QS', productName: 'RTM Offset Moon Cool Queen', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'Almacén Central-NORTE', status: 'En exposición externa', scannedAtEvent: '25 Ago 2026 · 09:12' },
      { uid: 'RTM-UID-2026-000258', sku: 'RTM-SEA-CLB-KS', productName: 'RTM Packaging Crown Jewel King Size', brand: 'Impresos RTM', size: 'King Size', originLocation: 'Almacén Central-NORTE', status: 'En exposición externa', scannedAtEvent: '25 Ago 2026 · 09:20' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0004',
      outboundOrderFolio: 'OS-2026-0048',
      remisionFolio: 'REM-2026-0089',
    },
    notes: 'Exhibición activa en Pabellón M. Desmontaje programado para mañana 29 Ago a las 20:00 hrs.',
    createdAt: '22 Ago 2026',
  },

  // 4. Activa en Sede Externa
  {
    id: 'expo-0006',
    folio: 'EXPO-2026-0006',
    name: 'Feria del Hogar Plaza Fiesta San Agustín',
    venue: 'Plaza Fiesta San Agustín - Domo Principal',
    address: 'Av. Real San Agustín #222, Reynosa, Tamps.',
    startDate: '26 Ago 2026',
    endDate: '30 Ago 2026',
    originFacilityId: 'wh-matamoros',
    originFacilityName: 'Almacén Satélite Matamoros',
    responsiblePerson: 'Lic. Mariana Lozano (Ventas)',
    contactPhone: '81 8363 5000',
    status: 'En exposición externa',
    totalUnits: 4,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Pro Queen Size', brand: 'Impresos RTM', size: 'Queen Size', quantity: 2, uids: ['RTM-UID-2026-000271', 'RTM-UID-2026-000272'] },
      { sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Record Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 2, uids: ['RTM-UID-2026-000273', 'RTM-UID-2026-000274'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000271', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Pro Queen Size', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'ALM-MAT', status: 'En exposición externa', scannedAtEvent: '26 Ago 2026 · 10:30' },
      { uid: 'RTM-UID-2026-000272', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Pro Queen Size', brand: 'Impresos RTM', size: 'Queen Size', originLocation: 'ALM-MAT', status: 'En exposición externa', scannedAtEvent: '26 Ago 2026 · 10:35' },
      { uid: 'RTM-UID-2026-000273', sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Record Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'ALM-MAT', status: 'En exposición externa', scannedAtEvent: '26 Ago 2026 · 10:40' },
      { uid: 'RTM-UID-2026-000274', sku: 'RTM-SPA-REC-MAT', productName: 'RTM Flexo Record Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'ALM-MAT', status: 'En exposición externa', scannedAtEvent: '26 Ago 2026 · 10:45' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0003',
      outboundOrderFolio: 'OS-2026-0051',
      remisionFolio: 'REM-2026-0092',
    },
    notes: 'Excelente afluencia en centro comercial.',
    createdAt: '24 Ago 2026',
  },

  // 5. Por regresar (Termina hoy)
  {
    id: 'expo-0005',
    folio: 'EXPO-2026-0005',
    name: 'Expo Franquicias & Hotelería Valle Real',
    venue: 'Hotel Safi Royal Luxury Valle - Gran Salón',
    address: 'Av. Diego Rivera #555, Planta Reynosa, Reynosa, Tamps.',
    startDate: '22 Ago 2026',
    endDate: '28 Ago 2026',
    originFacilityId: 'wh-reynosa',
    originFacilityName: 'Planta Principal Reynosa',
    responsiblePerson: 'Lic. Sofía Garza',
    contactPhone: '81 8100 7000',
    status: 'Por regresar',
    totalUnits: 6,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', quantity: 3, uids: ['RTM-UID-2026-000281', 'RTM-UID-2026-000282', 'RTM-UID-2026-000283'] },
      { sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 3, uids: ['RTM-UID-2026-000284', 'RTM-UID-2026-000285', 'RTM-UID-2026-000286'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000281', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'PLT-REY', status: 'En exposición externa' },
      { uid: 'RTM-UID-2026-000282', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'PLT-REY', status: 'En exposición externa' },
      { uid: 'RTM-UID-2026-000283', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'PLT-REY', status: 'En exposición externa' },
      { uid: 'RTM-UID-2026-000284', sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'PLT-REY', status: 'En exposición externa' },
      { uid: 'RTM-UID-2026-000285', sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'PLT-REY', status: 'En exposición externa' },
      { uid: 'RTM-UID-2026-000286', sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'PLT-REY', status: 'En exposición externa' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0002',
      outboundOrderFolio: 'OS-2026-0044',
      remisionFolio: 'REM-2026-0081',
      returnOrderFolio: 'RET-EXPO-2026-0002',
    },
    notes: 'El evento concluye hoy a las 18:00 h. Camión #04 pasará por el retorno.',
    createdAt: '20 Ago 2026',
  },

  // 6. En Retorno
  {
    id: 'expo-0004',
    folio: 'EXPO-2026-0004',
    name: 'Muestra Comercial Residencial Almacén Matamoros',
    venue: 'Almacén Matamoros Elite Club House',
    address: 'Av. Paseo de los Leones #3400, Almacén Matamoros Elite, Monterrey, N.L.',
    startDate: '20 Ago 2026',
    endDate: '27 Ago 2026',
    originFacilityId: 'wh-matamoros',
    originFacilityName: 'Almacén Satélite Matamoros',
    responsiblePerson: 'Luis Fernando Garza',
    contactPhone: '81 8300 2200',
    status: 'En retorno',
    totalUnits: 5,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 3, uids: ['RTM-UID-2026-000291', 'RTM-UID-2026-000292', 'RTM-UID-2026-000293'] },
      { sku: 'RTM-SPA-REC-IND', productName: 'RTM Flexo Record Individual', brand: 'Impresos RTM', size: 'Individual', quantity: 2, uids: ['RTM-UID-2026-000294', 'RTM-UID-2026-000295'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000291', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'ALM-MAT', status: 'En retorno' },
      { uid: 'RTM-UID-2026-000292', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'ALM-MAT', status: 'En retorno' },
      { uid: 'RTM-UID-2026-000293', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'ALM-MAT', status: 'En retorno' },
      { uid: 'RTM-UID-2026-000294', sku: 'RTM-SPA-REC-IND', productName: 'RTM Flexo Record Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'ALM-MAT', status: 'En retorno' },
      { uid: 'RTM-UID-2026-000295', sku: 'RTM-SPA-REC-IND', productName: 'RTM Flexo Record Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'ALM-MAT', status: 'En retorno' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0001',
      outboundOrderFolio: 'OS-2026-0041',
      returnOrderFolio: 'RET-EXPO-2026-0001',
    },
    notes: 'Unidades en tránsito de regreso hacia sucursal Almacén Matamoros.',
    createdAt: '18 Ago 2026',
  },

  // 7. Cerrada
  {
    id: 'expo-0002',
    folio: 'EXPO-2026-0002',
    name: 'Expo Verano Confort 2026',
    venue: 'Convex Monterrey - Sala B',
    address: 'Av. Morones Prieto #1500, Monterrey, N.L.',
    startDate: '10 Ago 2026',
    endDate: '15 Ago 2026',
    originFacilityId: 'wh-mty-norte',
    originFacilityName: 'Almacén Principal Reynosa Norte',
    responsiblePerson: 'Rodrigo Benítez',
    contactPhone: '81 8345 6789',
    status: 'Cerrada',
    totalUnits: 12,
    items: [
      { sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', quantity: 6, uids: ['RTM-UID-2026-000101', 'RTM-UID-2026-000102', 'RTM-UID-2026-000103', 'RTM-UID-2026-000104', 'RTM-UID-2026-000105', 'RTM-UID-2026-000106'] },
      { sku: 'RTM-RES-FAN-MAT', productName: 'RTM Offset Fantasy Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 6, uids: ['RTM-UID-2026-000107', 'RTM-UID-2026-000108', 'RTM-UID-2026-000109', 'RTM-UID-2026-000110', 'RTM-UID-2026-000111', 'RTM-UID-2026-000112'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000101', sku: 'RTM-MUE-001', productName: 'RTM Impresos Flow Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'Almacén Central-NORTE', status: 'Reingresada', returnCondition: 'Excelente', inspectedAt: '16 Ago 2026' },
      { uid: 'RTM-UID-2026-000107', sku: 'RTM-RES-FAN-MAT', productName: 'RTM Offset Fantasy Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'Almacén Central-NORTE', status: 'Reingresada', returnCondition: 'Excelente', inspectedAt: '16 Ago 2026' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0000',
      outboundOrderFolio: 'OS-2026-0030',
      returnOrderFolio: 'RET-EXPO-2026-0000',
    },
    notes: 'Evento finalizado con 100% de unidades reingresadas con éxito.',
    createdAt: '08 Ago 2026',
  },

  // 8. Cerrada con Incidencia Retrabajada
  {
    id: 'expo-0001',
    folio: 'EXPO-2026-0001',
    name: 'Feria Inmobiliaria Santiago 2026',
    venue: 'Santiago N.L. Centro Cívico',
    address: 'Calle Juárez #100, Santiago, N.L.',
    startDate: '01 Ago 2026',
    endDate: '05 Ago 2026',
    originFacilityId: 'wh-reynosa',
    originFacilityName: 'Planta Principal Reynosa',
    responsiblePerson: 'Lic. Sofía Garza',
    contactPhone: '81 8399 2000',
    status: 'Cerrada',
    totalUnits: 4,
    items: [
      { sku: 'RTM-SPA-REC-IND', productName: 'RTM Flexo Record Individual', brand: 'Impresos RTM', size: 'Individual', quantity: 2, uids: ['RTM-UID-2026-000091', 'RTM-UID-2026-000092'] },
      { sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', quantity: 2, uids: ['RTM-UID-2026-000093', 'RTM-UID-2026-000094'] },
    ],
    uidsData: [
      { uid: 'RTM-UID-2026-000091', sku: 'RTM-SPA-REC-IND', productName: 'RTM Flexo Record Individual', brand: 'Impresos RTM', size: 'Individual', originLocation: 'PLT-REY', status: 'Reingresada', returnCondition: 'Excelente', inspectedAt: '06 Ago 2026' },
      { uid: 'RTM-UID-2026-000093', sku: 'RTM-RES-ORT-MAT', productName: 'RTM Offset Ortopédico Matrimonial', brand: 'Impresos RTM', size: 'Matrimonial', originLocation: 'PLT-REY', status: 'Reingresada', returnCondition: 'Empaque dañado', inspectedAt: '06 Ago 2026', inspectionNotes: 'Reempacado en zona de retrabajo.' },
    ],
    operationalLinks: {
      pickOrderFolio: 'OR-EXPO-2026-0003',
      outboundOrderFolio: 'OS-2026-0022',
      returnOrderFolio: 'RET-EXPO-2026-0003',
    },
    notes: 'Evento cerrado.',
    createdAt: '28 Jul 2026',
  },
];

// =========================================================================
// 4. SUGERENCIAS COMERCIALES PARA SHOWROOM (INTEGRACIÓN CON VENTAS)
// =========================================================================
export const MOCK_COMMERCIAL_SUGGESTIONS: CommercialShowroomSuggestion[] = [
  {
    sku: 'RTM-MUE-001',
    productName: 'Muestrario Cajas Plegadizas Caple',
    brand: 'Impresos RTM',
    size: 'Individual',
    category: 'Muestrarios Industriales',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    availableStock: 18,
    monthlySalesUnits: 42,
    rotationSpeed: 'Muy Alta',
    currentlyExhibited: false,
    score: 96,
    reasons: [
      'Alta demanda comercial observada en zona poniente / Almacén Matamoros.',
      '18 unidades disponibles en almacén de sucursal para entrega inmediata.',
      'Actualmente la bahía SHOW-03 de Almacén Matamoros se encuentra disponible.',
      'Excelente rotación comercial y margen del 38.4%.',
    ],
    suggestedUid: {
      uid: 'RTM-UID-2026-000284',
      location: 'A-B-03',
      ageDays: 47,
      reason: 'Unidad disponible con mayor antigüedad en almacén y cercana al pasillo de maniobra.',
    },
    alternatives: [
      { sku: 'RTM-RES-MNC-QS', name: 'Muestrario de Barnices UV y Foil Stamping', availableStock: 12, reason: 'Modelo en tendencia con alta consulta de clientes.' },
      { sku: 'RTM-SPA-REC-MAT', name: 'RTM Flexo Muestrario Industrial RTM', availableStock: 14, reason: 'Excelente rotación en línea de resortes tradicionales.' },
      { sku: 'RTM-SEA-CLB-KS', name: 'Muestrario de Blister Cards y Termosellables', availableStock: 6, reason: 'Mayor margen comercial ($7,400 MXN / unidad).' },
    ],
  },
  {
    sku: 'RTM-RES-MNC-QS',
    productName: 'Muestrario de Barnices UV y Foil Stamping',
    brand: 'Impresos RTM',
    size: 'Queen Size',
    category: 'Muestrarios Industriales',
    branchId: 'wh-reynosa',
    branchName: 'Planta Principal Reynosa',
    availableStock: 14,
    monthlySalesUnits: 28,
    rotationSpeed: 'Alta',
    currentlyExhibited: false,
    score: 92,
    reasons: [
      'Crecimiento comercial del +24% en cotizaciones de Planta Reynosa.',
      '14 unidades físicas en existencia listas para surtido.',
      'Bahía SHOW-03 de Planta Reynosa pendiente de montaje.',
    ],
    suggestedUid: {
      uid: 'RTM-UID-2026-000184',
      location: 'A-B-03',
      ageDays: 32,
      reason: 'Unidad en nivel piso de fácil recolección y óptima conservación de empaque.',
    },
    alternatives: [
      { sku: 'RTM-MUE-001', name: 'RTM Impresos Muestrario Industrial RTM', availableStock: 19, reason: 'Líder en volumen de ventas retail.' },
      { sku: 'RTM-SPA-PAL-QS', name: 'RTM Flexo Palace Luxury Queen Size', availableStock: 8, reason: 'Línea premium con alta conversión.' },
    ],
  },
  {
    sku: 'RTM-SEA-CLB-KS',
    productName: 'Muestrario de Blister Cards y Termosellables',
    brand: 'Impresos RTM',
    size: 'King Size',
    category: 'Muestrarios Industriales',
    branchId: 'wh-matamoros',
    branchName: 'Almacén Satélite Matamoros',
    availableStock: 8,
    monthlySalesUnits: 15,
    rotationSpeed: 'Media',
    currentlyExhibited: false,
    score: 88,
    reasons: [
      'Mayor ticket promedio cotizado en la categoría King Size.',
      'Sugerido para exhibición premium en bahía SHOW-04 de Almacén Matamoros.',
      'Impulsa venta de bases y protectores en paquete.',
    ],
    suggestedUid: {
      uid: 'RTM-UID-2026-000186',
      location: 'A-C-02',
      ageDays: 38,
      reason: 'Unidad física en nivel medio con inspección de calidad aprobada.',
    },
    alternatives: [
      { sku: 'RTM-THE-GEL-KS', name: 'RTM Cartón Memory Gel King Size', availableStock: 7, reason: 'Confort viscoelástico para prueba de cliente.' },
      { sku: 'RTM-MUE-001', name: 'RTM Impresos Pro Plus Hybrid King Size', availableStock: 9, reason: 'Modelo híbrido de alta satisfacción.' },
    ],
  },
];
