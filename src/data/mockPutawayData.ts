export interface PutawaySuggestionDetails {
  matchedSkuCount: number;
  distanceToShippingMeters: number;
  zoneActivity: 'Alta' | 'Media' | 'Baja';
  freeSlotsInRack: number;
  explanation: string;
}

export interface PendingPutawayUnit {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  category: 'Producto Terminado' | 'Sustratos / Papel' | 'Películas / Flexo' | 'Tintas & Barnices' | 'Empaque';
  size: string;
  lotNumber: string;
  warehouseId: string;
  warehouseName: string;
  sourceLocation: string; // ej. 'REC-01'
  receiptOrderFolio: string; // ej. 'REC-2026-0084'
  receivedAt: string;
  timeInReceiving: string; // ej. '18 min'
  suggestedLocation: string; // ej. 'A-B-03'
  suggestionReason: string; // ej. 'Alta rotación · posición cercana a embarques'
  suggestionDetails: PutawaySuggestionDetails;
  status: 'Pendiente' | 'En orden' | 'Acomodado';
}

export interface PutawayOrderItem {
  id: string;
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  sourceLocation: string; // ej. 'REC-01'
  targetLocation: string; // ej. 'A-B-03'
  suggestedLocation: string;
  status: 'Pendiente' | 'Acomodado' | 'Con incidencia';
  completedAt?: string;
  operator?: string;
  notes?: string;
}

export interface PutawayOrder {
  id: string;
  folio: string;
  warehouseId: string;
  warehouseName: string;
  createdAt: string;
  completedAt?: string;
  operatorAssigned: string;
  status: 'Pendiente' | 'En proceso' | 'Completa' | 'Parcial';
  totalUnits: number;
  completedUnits: number;
  pendingUnits: number;
  notes?: string;
  items: PutawayOrderItem[];
}

export const INITIAL_PENDING_PUTAWAY_UNITS: PendingPutawayUnit[] = [
  // Almacén Materia Prima
  {
    uid: 'TAR-RTM-2026-000184',
    sku: 'PT-MAN-002',
    productName: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0081',
    receivedAt: '27 Ago 09:46',
    timeInReceiving: '18 min',
    suggestedLocation: 'A-B-03',
    suggestionReason: 'Alta rotación · posición cercana a embarques',
    suggestionDetails: {
      matchedSkuCount: 4,
      distanceToShippingMeters: 24,
      zoneActivity: 'Alta',
      freeSlotsInRack: 3,
      explanation: 'El sistema recomienda el Pasillo A Nivel B por alta rotación de materiales prioritarios y cercanía a los carriles de embarque.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000185',
    sku: 'PT-MAN-002',
    productName: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0081',
    receivedAt: '27 Ago 09:48',
    timeInReceiving: '20 min',
    suggestedLocation: 'A-B-04',
    suggestionReason: 'Consolidar con 3 unidades del mismo SKU',
    suggestionDetails: {
      matchedSkuCount: 3,
      distanceToShippingMeters: 26,
      zoneActivity: 'Alta',
      freeSlotsInRack: 2,
      explanation: 'Posición contigua en Pasillo A para agrupar existencias del lote LOTE-2026-W34 en un solo recorrido de picking.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000186',
    sku: 'PT-MAN-002',
    productName: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0081',
    receivedAt: '27 Ago 09:50',
    timeInReceiving: '22 min',
    suggestedLocation: 'A-C-04',
    suggestionReason: 'Ubicación disponible en nivel superior para reserva',
    suggestionDetails: {
      matchedSkuCount: 2,
      distanceToShippingMeters: 26,
      zoneActivity: 'Media',
      freeSlotsInRack: 4,
      explanation: 'Nivel C (Superior) recomendado para inventario de reserva que no requiere despacho inmediato.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000171',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0081',
    receivedAt: '27 Ago 09:12',
    timeInReceiving: '52 min',
    suggestedLocation: 'A-A-02',
    suggestionReason: 'Nivel de piso · picking directo y rápido acceso',
    suggestionDetails: {
      matchedSkuCount: 5,
      distanceToShippingMeters: 18,
      zoneActivity: 'Alta',
      freeSlotsInRack: 2,
      explanation: 'Nivel A (Piso) facilita extracción manual ergonómica sin necesidad de montacargas para alta demanda.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000172',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0081',
    receivedAt: '27 Ago 09:14',
    timeInReceiving: '50 min',
    suggestedLocation: 'A-A-03',
    suggestionReason: 'Consolidar con lote reciente en Pasillo A',
    suggestionDetails: {
      matchedSkuCount: 3,
      distanceToShippingMeters: 22,
      zoneActivity: 'Alta',
      freeSlotsInRack: 3,
      explanation: 'Posición A-A-03 con slot libre inmediato para completar bloque de manuales Black & Decker.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000199',
    sku: 'FLX-BOP-001',
    productName: 'Película BOPP Transparente 35 micras Avery',
    brand: 'Schneider Electric',
    category: 'Producto Terminado',
    size: 'Queen Size',
    lotNumber: 'LOTE-2026-W35',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    sourceLocation: 'REC-01',
    receiptOrderFolio: 'OC-2026-0085',
    receivedAt: '27 Ago 10:05',
    timeInReceiving: '15 min',
    suggestedLocation: 'B-B-01',
    suggestionReason: 'FIFO · Lote de alta rotación en zona de sustratos',
    suggestionDetails: {
      matchedSkuCount: 2,
      distanceToShippingMeters: 30,
      zoneActivity: 'Media',
      freeSlotsInRack: 2,
      explanation: 'Pasillo B dedicado a líneas de sustratos y etiquetas.',
    },
    status: 'Pendiente',
  },

  // Almacén Producto Terminado
  {
    uid: 'TAR-RTM-2026-000301',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W35',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    sourceLocation: 'REC-02',
    receiptOrderFolio: 'OC-2026-0083',
    receivedAt: '27 Ago 10:15',
    timeInReceiving: '45 min',
    suggestedLocation: 'A-A-03',
    suggestionReason: 'Alta rotación en CEDIS Sur · posición baja de fácil acceso',
    suggestionDetails: {
      matchedSkuCount: 3,
      distanceToShippingMeters: 18,
      zoneActivity: 'Alta',
      freeSlotsInRack: 2,
      explanation: 'El sistema recomienda el Pasillo A Nivel A por ergonomía y rotación en zona sur.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000302',
    sku: 'PT-ETQ-002',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    category: 'Producto Terminado',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W35',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    sourceLocation: 'REC-02',
    receiptOrderFolio: 'OC-2026-0083',
    receivedAt: '27 Ago 10:18',
    timeInReceiving: '42 min',
    suggestedLocation: 'A-B-04',
    suggestionReason: 'Posición contigua en Pasillo A',
    suggestionDetails: {
      matchedSkuCount: 3,
      distanceToShippingMeters: 19,
      zoneActivity: 'Alta',
      freeSlotsInRack: 2,
      explanation: 'Continuidad de lote en rack A de CEDIS Sur.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000305',
    sku: 'PT-BLI-001',
    productName: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    category: 'Producto Terminado',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    sourceLocation: 'REC-02',
    receiptOrderFolio: 'OC-2026-0080',
    receivedAt: '27 Ago 09:30',
    timeInReceiving: '90 min',
    suggestedLocation: 'B-A-02',
    suggestionReason: 'Consolidación de modelo Ortopédico en Pasillo B',
    suggestionDetails: {
      matchedSkuCount: 4,
      distanceToShippingMeters: 22,
      zoneActivity: 'Media',
      freeSlotsInRack: 3,
      explanation: 'Posición sugerida para unificar inventario Stanley Tools.',
    },
    status: 'Pendiente',
  },

  // Sucursal Valle Oriente
  {
    uid: 'TAR-RTM-2026-000181',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    sourceLocation: 'REC-SUC-VO',
    receiptOrderFolio: 'OTP-2026-0044',
    receivedAt: '27 Ago 11:32',
    timeInReceiving: '22 min',
    suggestedLocation: 'SHOW-02',
    suggestionReason: 'Bahía de inspección QA disponible para muestras',
    suggestionDetails: {
      matchedSkuCount: 0,
      distanceToShippingMeters: 4,
      zoneActivity: 'Alta',
      freeSlotsInRack: 1,
      explanation: 'Bahía SHOW-02 libre en piso de venta. Acomodo sugerido para exhibición de la línea Flow Basic.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000182',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    sourceLocation: 'REC-SUC-VO',
    receiptOrderFolio: 'OTP-2026-0044',
    receivedAt: '27 Ago 11:34',
    timeInReceiving: '20 min',
    suggestedLocation: 'BOD-VO-01',
    suggestionReason: 'Mini almacén de sucursal · stock para entrega inmediata',
    suggestionDetails: {
      matchedSkuCount: 2,
      distanceToShippingMeters: 8,
      zoneActivity: 'Media',
      freeSlotsInRack: 3,
      explanation: 'Posición BOD-VO-01 en mini almacén de sucursal para entrega a cliente o flete local.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000183',
    sku: 'PT-MAN-001',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    sourceLocation: 'REC-SUC-VO',
    receiptOrderFolio: 'OTP-2026-0044',
    receivedAt: '27 Ago 11:35',
    timeInReceiving: '19 min',
    suggestedLocation: 'BOD-VO-02',
    suggestionReason: 'Mini almacén de sucursal · reserva',
    suggestionDetails: {
      matchedSkuCount: 1,
      distanceToShippingMeters: 8,
      zoneActivity: 'Media',
      freeSlotsInRack: 4,
      explanation: 'Posición BOD-VO-02 en mini almacén de sucursal para reposición.',
    },
    status: 'Pendiente',
  },

  // Sucursal Cumbres
  {
    uid: 'TAR-RTM-2026-000191',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    sourceLocation: 'REC-SUC-CUM',
    receiptOrderFolio: 'OTP-2026-0045',
    receivedAt: '27 Ago 12:48',
    timeInReceiving: '12 min',
    suggestedLocation: 'SHOW-03',
    suggestionReason: 'Bahía de inspección QA disponible para muestras Cumbres',
    suggestionDetails: {
      matchedSkuCount: 0,
      distanceToShippingMeters: 5,
      zoneActivity: 'Media',
      freeSlotsInRack: 1,
      explanation: 'Bahía SHOW-03 libre en showroom Cumbres para muestra técnica de producto.',
    },
    status: 'Pendiente',
  },
  {
    uid: 'TAR-RTM-2026-000192',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    category: 'Producto Terminado',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34',
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    sourceLocation: 'REC-SUC-CUM',
    receiptOrderFolio: 'OTP-2026-0045',
    receivedAt: '27 Ago 12:50',
    timeInReceiving: '10 min',
    suggestedLocation: 'BOD-CUM-01',
    suggestionReason: 'Bodega local Cumbres · Entrega rápida',
    suggestionDetails: {
      matchedSkuCount: 1,
      distanceToShippingMeters: 6,
      zoneActivity: 'Media',
      freeSlotsInRack: 2,
      explanation: 'Bodega local Cumbres para retiro inmediato en mostrador.',
    },
    status: 'Pendiente',
  },
];

export const INITIAL_PUTAWAY_ORDERS: PutawayOrder[] = [
  // 1. CEDIS Norte - En proceso (Ubicación sugerida aceptada + Pendientes)
  {
    id: 'oa-1',
    folio: 'OA-2026-0031',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    createdAt: '27 Ago 2026 10:30',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'En proceso',
    totalUnits: 5,
    completedUnits: 2,
    pendingUnits: 3,
    notes: 'Orden de acomodo prioritaria de lote Black & Decker recién recibido en REC-01. Acomodo en Pasillo A.',
    items: [
      {
        id: 'oai-1-1',
        uid: 'TAR-RTM-2026-000173',
        sku: 'PT-MAN-001',
        productName: 'Manual Instructivo 24 Páginas Black & Decker',
        brand: 'Black & Decker',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W34',
        sourceLocation: 'REC-01',
        targetLocation: 'A-B-01',
        suggestedLocation: 'A-B-01',
        status: 'Acomodado',
        completedAt: '27 Ago 10:42',
        operator: 'Carlos Medina',
        notes: 'Ubicación sugerida aceptada.',
      },
      {
        id: 'oai-1-2',
        uid: 'TAR-RTM-2026-000174',
        sku: 'PT-MAN-001',
        productName: 'Manual Instructivo 24 Páginas Black & Decker',
        brand: 'Black & Decker',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W34',
        sourceLocation: 'REC-01',
        targetLocation: 'A-B-02',
        suggestedLocation: 'A-B-02',
        status: 'Acomodado',
        completedAt: '27 Ago 10:48',
        operator: 'Carlos Medina',
        notes: 'Ubicación sugerida aceptada.',
      },
      {
        id: 'oai-1-3',
        uid: 'TAR-RTM-2026-000184',
        sku: 'PT-MAN-002',
        productName: 'Manual Instructivo 48 Páginas Medifarma',
        brand: 'Black & Decker',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        sourceLocation: 'REC-01',
        targetLocation: 'A-B-03',
        suggestedLocation: 'A-B-03',
        status: 'Pendiente',
      },
      {
        id: 'oai-1-4',
        uid: 'TAR-RTM-2026-000185',
        sku: 'PT-MAN-002',
        productName: 'Manual Instructivo 48 Páginas Medifarma',
        brand: 'Black & Decker',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        sourceLocation: 'REC-01',
        targetLocation: 'A-B-04',
        suggestedLocation: 'A-B-04',
        status: 'Pendiente',
      },
      {
        id: 'oai-1-5',
        uid: 'TAR-RTM-2026-000186',
        sku: 'PT-MAN-002',
        productName: 'Manual Instructivo 48 Páginas Medifarma',
        brand: 'Black & Decker',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        sourceLocation: 'REC-01',
        targetLocation: 'A-C-04',
        suggestedLocation: 'A-C-04',
        status: 'Pendiente',
      },
    ],
  },
  // 2. CEDIS Norte - Pendiente (Consolidación de SKU & FIFO)
  {
    id: 'oa-4',
    folio: 'OA-2026-0034',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    createdAt: '27 Ago 2026 11:45',
    operatorAssigned: 'Roberto Garza (Operador Acomodo)',
    status: 'Pendiente',
    totalUnits: 3,
    completedUnits: 0,
    pendingUnits: 3,
    notes: 'Acomodo de tarimas de manuales Black & Decker en Pasillo A para consolidación de SKU.',
    items: [
      { id: 'oai-4-1', uid: 'TAR-RTM-2026-000171', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-A-02', suggestedLocation: 'A-A-02', status: 'Pendiente' },
      { id: 'oai-4-2', uid: 'TAR-RTM-2026-000172', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-A-03', suggestedLocation: 'A-A-03', status: 'Pendiente' },
      { id: 'oai-4-3', uid: 'TAR-RTM-2026-000199', sku: 'FLX-BOP-001', productName: 'Película BOPP Transparente 35 micras Avery', brand: 'Schneider Electric', size: 'Queen Size', lotNumber: 'LOTE-2026-W35', sourceLocation: 'REC-01', targetLocation: 'B-B-01', suggestedLocation: 'B-B-01', status: 'Pendiente' },
    ],
  },
  // 3. CEDIS Norte - Parcial (Ubicación cambiada por operador + Ubicación bloqueada)
  {
    id: 'oa-5',
    folio: 'OA-2026-0035',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    createdAt: '27 Ago 2026 09:15',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Parcial',
    totalUnits: 4,
    completedUnits: 2,
    pendingUnits: 2,
    notes: 'Operador cambió ubicación sugerida en posición A-A-04 por estar bloqueada temporalmente.',
    items: [
      { id: 'oai-5-1', uid: 'TAR-RTM-2026-000175', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-B-05', suggestedLocation: 'A-A-04', status: 'Acomodado', completedAt: '27 Ago 09:30', operator: 'Carlos Medina', notes: 'Ubicación cambiada: A-A-04 bloqueada por mantenimiento.' },
      { id: 'oai-5-2', uid: 'TAR-RTM-2026-000176', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-B-06', suggestedLocation: 'A-B-06', status: 'Acomodado', completedAt: '27 Ago 09:40', operator: 'Carlos Medina' },
      { id: 'oai-5-3', uid: 'TAR-RTM-2026-000177', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-C-01', suggestedLocation: 'A-C-01', status: 'Pendiente' },
      { id: 'oai-5-4', uid: 'TAR-RTM-2026-000178', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-01', targetLocation: 'A-C-02', suggestedLocation: 'A-C-02', status: 'Pendiente' },
    ],
  },
  // 4. CEDIS Norte - Completa (Retrabajo de unidad dañada + Acomodo final)
  {
    id: 'oa-6',
    folio: 'OA-2026-0029',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'Almacén Materia Prima',
    createdAt: '26 Ago 2026 14:00',
    completedAt: '26 Ago 2026 15:45',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Completa',
    totalUnits: 3,
    completedUnits: 3,
    pendingUnits: 0,
    notes: 'Acomodo de tarimas de sustratos y 1 unidad dirigida a área de Retrabajo RET-NORTE.',
    items: [
      { id: 'oai-6-1', uid: 'TAR-RTM-2026-000141', sku: 'FLX-BOP-001', productName: 'Película BOPP Transparente 35 micras Avery', brand: 'Schneider Electric', size: 'Queen Size', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-01', targetLocation: 'B-A-01', suggestedLocation: 'B-A-01', status: 'Acomodado', completedAt: '26 Ago 14:25', operator: 'Carlos Medina' },
      { id: 'oai-6-2', uid: 'TAR-RTM-2026-000142', sku: 'FLX-BOP-001', productName: 'Película BOPP Transparente 35 micras Avery', brand: 'Schneider Electric', size: 'Queen Size', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-01', targetLocation: 'B-A-02', suggestedLocation: 'B-A-02', status: 'Acomodado', completedAt: '26 Ago 14:40', operator: 'Carlos Medina' },
      { id: 'oai-6-3', uid: 'TAR-RTM-2026-000143', sku: 'FLX-BOP-001', productName: 'Película BOPP Transparente 35 micras Avery', brand: 'Schneider Electric', size: 'Queen Size', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-01', targetLocation: 'RET-NORTE', suggestedLocation: 'RET-NORTE', status: 'Acomodado', completedAt: '26 Ago 15:30', operator: 'Carlos Medina', notes: 'Unidad enviada a Retrabajo para reetiquetado.' },
    ],
  },

  // 5. CEDIS Sur - En proceso
  {
    id: 'oa-3',
    folio: 'OA-2026-0033',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    createdAt: '27 Ago 2026 11:00',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'En proceso',
    totalUnits: 4,
    completedUnits: 1,
    pendingUnits: 3,
    notes: 'Acomodo de recepción de sustratos en Pasillo B de CEDIS Sur.',
    items: [
      { id: 'oai-3-1', uid: 'TAR-RTM-2026-000303', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W35', sourceLocation: 'REC-02', targetLocation: 'A-B-03', suggestedLocation: 'A-B-03', status: 'Acomodado', completedAt: '27 Ago 11:15', operator: 'Valeria Torres' },
      { id: 'oai-3-2', uid: 'TAR-RTM-2026-000304', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W35', sourceLocation: 'REC-02', targetLocation: 'A-B-04', suggestedLocation: 'A-B-04', status: 'Pendiente' },
      { id: 'oai-3-3', uid: 'TAR-RTM-2026-000305', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-02', targetLocation: 'B-A-02', suggestedLocation: 'B-A-02', status: 'Pendiente' },
      { id: 'oai-3-4', uid: 'TAR-RTM-2026-000306', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-02', targetLocation: 'B-A-03', suggestedLocation: 'B-A-03', status: 'Pendiente' },
    ],
  },
  // 6. CEDIS Sur - Pendiente
  {
    id: 'oa-7',
    folio: 'OA-2026-0036',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    createdAt: '27 Ago 2026 12:10',
    operatorAssigned: 'Miguel Ángel Soto (Operador Sur)',
    status: 'Pendiente',
    totalUnits: 2,
    completedUnits: 0,
    pendingUnits: 2,
    notes: 'Acomodo de alta rotación en rack A.',
    items: [
      { id: 'oai-7-1', uid: 'TAR-RTM-2026-000301', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W35', sourceLocation: 'REC-02', targetLocation: 'A-A-03', suggestedLocation: 'A-A-03', status: 'Pendiente' },
      { id: 'oai-7-2', uid: 'TAR-RTM-2026-000302', sku: 'PT-ETQ-002', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Matrimonial', lotNumber: 'LOTE-2026-W35', sourceLocation: 'REC-02', targetLocation: 'A-B-04', suggestedLocation: 'A-B-04', status: 'Pendiente' },
    ],
  },
  // 7. CEDIS Sur - Completa
  {
    id: 'oa-2',
    folio: 'OA-2026-0030',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'Almacén Producto Terminado',
    createdAt: '26 Ago 2026 15:10',
    completedAt: '26 Ago 2026 16:30',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'Completa',
    totalUnits: 4,
    completedUnits: 4,
    pendingUnits: 0,
    notes: 'Acomodo concluido en pasillos A y B de CEDIS Sur.',
    items: [
      { id: 'oai-2-1', uid: 'TAR-RTM-2026-000131', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-02', targetLocation: 'B-A-01', suggestedLocation: 'B-A-01', status: 'Acomodado', completedAt: '26 Ago 15:35', operator: 'Valeria Torres' },
      { id: 'oai-2-2', uid: 'TAR-RTM-2026-000132', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-02', targetLocation: 'B-A-02', suggestedLocation: 'B-A-02', status: 'Acomodado', completedAt: '26 Ago 15:45', operator: 'Valeria Torres' },
      { id: 'oai-2-3', uid: 'TAR-RTM-2026-000133', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-02', targetLocation: 'B-B-01', suggestedLocation: 'B-B-01', status: 'Acomodado', completedAt: '26 Ago 16:05', operator: 'Valeria Torres' },
      { id: 'oai-2-4', uid: 'TAR-RTM-2026-000134', sku: 'PT-BLI-001', productName: 'Blister Card Termosellable Stanley Tools', brand: 'Stanley Tools', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-02', targetLocation: 'B-B-02', suggestedLocation: 'B-B-02', status: 'Acomodado', completedAt: '26 Ago 16:20', operator: 'Valeria Torres' },
    ],
  },

  // 8. Sucursal Valle Oriente - Parcial (Envío a Showroom + Mini Almacén)
  {
    id: 'oa-8',
    folio: 'OA-2026-0037',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    createdAt: '27 Ago 2026 11:40',
    operatorAssigned: 'Brenda Cavazos (Encargada Sucursal)',
    status: 'Parcial',
    totalUnits: 3,
    completedUnits: 1,
    pendingUnits: 2,
    notes: 'Acomodo de unidades traspasadas: 1 a bahía de Showroom SHOW-02 y 2 a bodega local BOD-VO-01.',
    items: [
      { id: 'oai-8-1', uid: 'TAR-RTM-2026-000181', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-SUC-VO', targetLocation: 'SHOW-02', suggestedLocation: 'SHOW-02', status: 'Acomodado', completedAt: '27 Ago 11:55', operator: 'Brenda Cavazos', notes: 'Colocado en bahía SHOW-02 de exhibición.' },
      { id: 'oai-8-2', uid: 'TAR-RTM-2026-000182', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-SUC-VO', targetLocation: 'BOD-VO-01', suggestedLocation: 'BOD-VO-01', status: 'Pendiente' },
      { id: 'oai-8-3', uid: 'TAR-RTM-2026-000183', sku: 'PT-MAN-001', productName: 'Manual Instructivo 24 Páginas Black & Decker', brand: 'Black & Decker', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-SUC-VO', targetLocation: 'BOD-VO-02', suggestedLocation: 'BOD-VO-02', status: 'Pendiente' },
    ],
  },
  // 9. Sucursal Valle Oriente - Completa
  {
    id: 'oa-9',
    folio: 'OA-2026-0028',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    createdAt: '25 Ago 2026 12:00',
    completedAt: '25 Ago 2026 13:10',
    operatorAssigned: 'Brenda Cavazos (Encargada Sucursal)',
    status: 'Completa',
    totalUnits: 2,
    completedUnits: 2,
    pendingUnits: 0,
    notes: 'Acomodo de tarimas de sustratos en showroom y bodega local.',
    items: [
      { id: 'oai-9-1', uid: 'TAR-RTM-2026-000151', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-SUC-VO', targetLocation: 'SHOW-01', suggestedLocation: 'SHOW-01', status: 'Acomodado', completedAt: '25 Ago 12:30', operator: 'Brenda Cavazos' },
      { id: 'oai-9-2', uid: 'TAR-RTM-2026-000152', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W33', sourceLocation: 'REC-SUC-VO', targetLocation: 'BOD-VO-01', suggestedLocation: 'BOD-VO-01', status: 'Acomodado', completedAt: '25 Ago 13:00', operator: 'Brenda Cavazos' },
    ],
  },

  // 10. Sucursal Cumbres - En proceso
  {
    id: 'oa-10',
    folio: 'OA-2026-0038',
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    createdAt: '27 Ago 2026 13:00',
    operatorAssigned: 'Jorge Villarreal (Encargado Sucursal)',
    status: 'En proceso',
    totalUnits: 2,
    completedUnits: 1,
    pendingUnits: 1,
    notes: 'Acomodo de traspaso recién arribado a Cumbres.',
    items: [
      { id: 'oai-10-1', uid: 'TAR-RTM-2026-000191', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-SUC-CUM', targetLocation: 'SHOW-03', suggestedLocation: 'SHOW-03', status: 'Acomodado', completedAt: '27 Ago 13:20', operator: 'Jorge Villarreal', notes: 'Colocado en bahía SHOW-03.' },
      { id: 'oai-10-2', uid: 'TAR-RTM-2026-000192', sku: 'PT-ETQ-001', productName: 'Etiqueta Farmacéutica 4x6" Medifarma', brand: 'Medifarma', size: 'Individual', lotNumber: 'LOTE-2026-W34', sourceLocation: 'REC-SUC-CUM', targetLocation: 'BOD-CUM-01', suggestedLocation: 'BOD-CUM-01', status: 'Pendiente' },
    ],
  },
];
