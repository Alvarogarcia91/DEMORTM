import { OutboundVerificationOrder } from './mockOutboundVerificationData';

export type RemisionType = 'Venta' | 'Traspaso' | 'Exposición';
export type RemisionStatus = 
  | 'Pendiente de remisión' 
  | 'Remisión generada' 
  | 'Impresa' 
  | 'Entregada' 
  | 'Entrega parcial';

export interface DeliveryProof {
  deliveredAt: string; // ej. '28 Ago 2026 · 14:48'
  recipientName: string; // ej. 'Roberto Cantú Garza'
  driverName: string;
  vehicleName?: string;
  coordinates: {
    lat: number;
    lng: number;
    label: string;
  };
  result: 'Entrega completa' | 'Entrega parcial' | 'Con incidencia';
  validatedUidsCount: number;
  expectedUnitsCount: number;
  observations?: string;
  signaturePlaceholder?: string;
  incidentType?: string;
  incidentNotes?: string;
}

export interface RemisionItem {
  sku: string;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  lotNumber?: string;
  uids: string[];
}

export interface OutboundRemision {
  id: string;
  folio: string; // ej. 'REM-2026-0061' (Venta) o 'REM-TR-2026-0021' (Traspaso)
  type: RemisionType;
  status: RemisionStatus;
  outboundOrderFolio: string; // ej. 'VS-2026-0040'
  sourceDocumentFolio: string; // ej. 'PED-2026-0103' o 'OTP-2026-0044'
  sourceDocumentType: 'Pedido' | 'OTP' | 'Exposición';
  createdAt: string;
  printedAt?: string;
  originWarehouseId: string;
  originWarehouseName: string; // ej. 'CEDIS Monterrey Norte'
  destinationName: string; // ej. 'Roberto Cantú Garza' o 'Sucursal Valle Oriente'
  destinationAddress?: string; // para Venta
  destinationFacility?: string; // para Traspaso
  assignedLane?: string; // ej. 'EMB-01'
  operatorAssigned: string; // ej. 'Valeria Torres (Operador Mesa 02)'
  totalUnits: number;
  observations?: string;
  qrPayload: string; // ej. 'REM=REM-2026-0061|TYPE=SALE|REF=PED-2026-0103'
  items: RemisionItem[];
  carrierInfo?: {
    driverName: string;
    unitPlate: string;
    vehicleType: string;
  };
  signatures: {
    deliveredByLabel: string;
    deliveredByName?: string;
    receivedByLabel: string;
    receivedByName?: string;
    signeeNameLabel: string;
    signeeName?: string;
    dateTimeLabel: string;
  };
  deliveryProof?: DeliveryProof;
}

export const INITIAL_MOCK_REMISSIONES: OutboundRemision[] = [
  // =========================================================================
  // VENTA 1 (100% validada / Lista para carga / Lista para imprimir)
  // =========================================================================
  {
    id: 'rem-1',
    folio: 'REM-2026-0061',
    type: 'Venta',
    status: 'Remisión generada',
    outboundOrderFolio: 'VS-2026-0040',
    sourceDocumentFolio: 'PED-2026-0103',
    sourceDocumentType: 'Pedido',
    createdAt: '26 Ago 2026, 15:45',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Roberto Cantú Garza',
    destinationAddress: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L., C.P. 64860',
    assignedLane: 'EMB-01',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 3,
    observations: 'Entrega a domicilio residencial en planta alta. Incluye maniobra autorizada y retiro de empaque.',
    qrPayload: 'REM=REM-2026-0061|TYPE=SALE|REF=PED-2026-0103',
    carrierInfo: {
      driverName: 'Mario Cantú',
      unitPlate: 'NL-8492-B',
      vehicleType: 'Camioneta Isuzu 3.5 Ton',
    },
    items: [
      {
        sku: 'SC-RES-ORT-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 3,
        lotNumber: 'LOTE-2026-W33',
        uids: [
          'SC-UID-2026-000131',
          'SC-UID-2026-000132',
          'SC-UID-2026-000133',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida)',
      deliveredByName: 'Mario Cantú (Chofer Ruta Guadalupe)',
      receivedByLabel: 'Recibió de conformidad',
      receivedByName: 'Roberto Cantú Garza',
      signeeNameLabel: 'Nombre del Receptor',
      signeeName: 'Roberto Cantú Garza',
      dateTimeLabel: 'Fecha y hora de entrega',
    },
  },

  // =========================================================================
  // VENTA 2 (Pendiente de validación 100% / No disponible para impresión definitiva)
  // =========================================================================
  {
    id: 'rem-2',
    folio: 'REM-2026-0062',
    type: 'Venta',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0044',
    sourceDocumentFolio: 'PED-2026-0107',
    sourceDocumentType: 'Pedido',
    createdAt: '27 Ago 2026, 13:50',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Hotel Boutique Las Lomas S.A. de C.V.',
    destinationAddress: 'Av. Vasconcelos 1400, Col. Del Valle, San Pedro Garza García, N.L., C.P. 66220',
    assignedLane: 'EMB-05',
    operatorAssigned: 'Roberto Garza (Operador Salidas)',
    totalUnits: 4,
    observations: 'Recepción en bahía de proveedores de 09:00 a 17:00 h. Solicitar acceso con Jefe de Compras.',
    qrPayload: 'REM=REM-2026-0062|TYPE=SALE|REF=PED-2026-0107',
    items: [
      {
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 2,
        lotNumber: 'LOTE-2026-W33',
        uids: [
          'SC-UID-2026-000211',
          'SC-UID-2026-000212',
        ],
      },
      {
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Colchón Ortopedic King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 2,
        lotNumber: 'LOTE-2026-W34',
        uids: [
          'SC-UID-2026-000244',
          'SC-UID-2026-000245',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida)',
      receivedByLabel: 'Recibió de conformidad',
      signeeNameLabel: 'Nombre del Receptor',
      dateTimeLabel: 'Fecha y hora de entrega',
    },
  },

  // =========================================================================
  // VENTA 3 (Con diferencia / En atención)
  // =========================================================================
  {
    id: 'rem-3',
    folio: 'REM-2026-0063',
    type: 'Venta',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0042',
    sourceDocumentFolio: 'PED-2026-0180',
    sourceDocumentType: 'Pedido',
    createdAt: '27 Ago 2026, 10:00',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Grupo Hotelero Sierra Madre S.A.',
    destinationAddress: 'Av. Constitución 2050 Pte., Centro, Monterrey, N.L., C.P. 64000',
    assignedLane: 'EMB-02',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 3,
    observations: 'Discrepancia serial registrada. Documento en espera de validación de supervisor.',
    qrPayload: 'REM=REM-2026-0063|TYPE=SALE|REF=PED-2026-0180',
    items: [
      {
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 3,
        lotNumber: 'LOTE-2026-W31',
        uids: [
          'SC-UID-2026-000103',
          'SC-UID-2026-000104',
          'SC-UID-2026-000105',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida)',
      receivedByLabel: 'Recibió de conformidad',
      signeeNameLabel: 'Nombre del Receptor',
      dateTimeLabel: 'Fecha y hora de entrega',
    },
  },

  // =========================================================================
  // TRASPASO 1 (100% validada / Lista para carga / Lista para imprimir)
  // =========================================================================
  {
    id: 'rem-4',
    folio: 'REM-TR-2026-0021',
    type: 'Traspaso',
    status: 'Remisión generada',
    outboundOrderFolio: 'VS-2026-0039',
    sourceDocumentFolio: 'OTP-2026-0044',
    sourceDocumentType: 'OTP',
    createdAt: '26 Ago 2026, 16:25',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    destinationFacility: 'Sucursal Valle Oriente · Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
    assignedLane: 'EMB-01',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 4,
    observations: 'Reabastecimiento regular de inventario para piso de venta y showroom.',
    qrPayload: 'REM=REM-TR-2026-0021|TYPE=TRANSFER|REF=OTP-2026-0044',
    carrierInfo: {
      driverName: 'Raúl Morales (Ruta CEDIS-Sucursales)',
      unitPlate: 'NL-5520-C',
      vehicleType: 'Torton Freightliner M2',
    },
    items: [
      {
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        quantity: 4,
        lotNumber: 'LOTE-2026-W33',
        uids: [
          'SC-UID-2026-000151',
          'SC-UID-2026-000152',
          'SC-UID-2026-000153',
          'SC-UID-2026-000154',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (CEDIS Emisor)',
      deliveredByName: 'Carlos Medina (Operador Mesa 01)',
      receivedByLabel: 'Recibió en instalación',
      receivedByName: 'Brenda Cavazos (Encargada Sucursal VO)',
      signeeNameLabel: 'Responsable de Sucursal',
      signeeName: 'Brenda Cavazos',
      dateTimeLabel: 'Fecha y hora de recepción',
    },
  },

  // =========================================================================
  // TRASPASO 2 (En validación / No disponible para impresión definitiva)
  // =========================================================================
  {
    id: 'rem-5',
    folio: 'REM-TR-2026-0022',
    type: 'Traspaso',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0043',
    sourceDocumentFolio: 'OTP-2026-0047',
    sourceDocumentType: 'OTP',
    createdAt: '27 Ago 2026, 12:55',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    destinationFacility: 'Sucursal Cumbres · Av. Paseo de los Leones 1200, Cumbres 1er Sector, Monterrey, N.L.',
    assignedLane: 'EMB-01',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    totalUnits: 4,
    observations: 'Traspaso inter-sucursales de alta prioridad para exhibición en tienda.',
    qrPayload: 'REM=REM-TR-2026-0022|TYPE=TRANSFER|REF=OTP-2026-0047',
    items: [
      {
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 2,
        lotNumber: 'LOTE-2026-W33',
        uids: [
          'SC-UID-2026-000135',
          'SC-UID-2026-000136',
        ],
      },
      {
        sku: 'SC-SEA-CLB-KS',
        productName: 'Sealy Colchón Celebration Plus King Size',
        brand: 'Sealy',
        size: 'King Size',
        quantity: 2,
        lotNumber: 'LOTE-2026-W35',
        uids: [
          'SC-UID-2026-000301',
          'SC-UID-2026-000302',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (CEDIS Emisor)',
      receivedByLabel: 'Recibió en instalación',
      signeeNameLabel: 'Responsable de Sucursal',
      dateTimeLabel: 'Fecha y hora de recepción',
    },
  },

  // =========================================================================
  // TRASPASO 3 (En validación / Traspaso Norte a VO)
  // =========================================================================
  {
    id: 'rem-6',
    folio: 'REM-TR-2026-0023',
    type: 'Traspaso',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0041',
    sourceDocumentFolio: 'OTP-2026-0044',
    sourceDocumentType: 'OTP',
    createdAt: '27 Ago 2026, 12:30',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    destinationFacility: 'Sucursal Valle Oriente · Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
    assignedLane: 'EMB-03',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    totalUnits: 6,
    observations: 'Validación en rampa en proceso (4 de 6 unidades confirmadas).',
    qrPayload: 'REM=REM-TR-2026-0023|TYPE=TRANSFER|REF=OTP-2026-0044',
    items: [
      {
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 2,
        lotNumber: 'LOTE-2026-W31',
        uids: [
          'SC-UID-2026-000101',
          'SC-UID-2026-000102',
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 2,
        lotNumber: 'LOTE-2026-W34',
        uids: [
          'SC-UID-2026-000184',
          'SC-UID-2026-000185',
        ],
      },
      {
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        quantity: 2,
        lotNumber: 'LOTE-2026-W32',
        uids: [
          'SC-UID-2026-000121',
          'SC-UID-2026-000122',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (CEDIS Emisor)',
      receivedByLabel: 'Recibió en instalación',
      signeeNameLabel: 'Responsable de Sucursal',
      dateTimeLabel: 'Fecha y hora de recepción',
    },
  },
];

// In-memory store for session persistence
let remisionesStore: OutboundRemision[] = [...INITIAL_MOCK_REMISSIONES];

export function getRemisionesList(): OutboundRemision[] {
  return remisionesStore;
}

export function getRemisionForOutboundOrder(outboundOrderFolio: string): OutboundRemision | undefined {
  return remisionesStore.find((r) => r.outboundOrderFolio === outboundOrderFolio);
}

export function getRemisionByFolio(folio: string): OutboundRemision | undefined {
  return remisionesStore.find((r) => r.folio === folio);
}

export function getOrCreateRemisionForOrder(order: OutboundVerificationOrder): OutboundRemision {
  const existing = remisionesStore.find((r) => r.outboundOrderFolio === order.folio);
  if (existing) {
    // If order became 'Lista para carga', update remision status if it was pending
    if (order.status === 'Lista para carga' && existing.status === 'Pendiente de remisión') {
      existing.status = 'Remisión generada';
    }
    return existing;
  }

  const isTransfer = order.type === 'Orden de Traspaso' || order.referenceFolio.startsWith('OTP');
  const type: RemisionType = isTransfer ? 'Traspaso' : 'Venta';
  
  // Deterministic numbering based on order folio
  const orderNumber = order.folio.replace(/\D/g, '') || '0050';
  const folio = isTransfer 
    ? `REM-TR-2026-00${(parseInt(orderNumber, 10) % 50 + 20).toString().padStart(2, '0')}`
    : `REM-2026-00${(parseInt(orderNumber, 10) % 50 + 60).toString().padStart(2, '0')}`;

  const isComplete = order.status === 'Lista para carga';
  const refType = isTransfer ? 'TRANSFER' : 'SALE';
  const qrPayload = `REM=${folio}|TYPE=${refType}|REF=${order.referenceFolio}`;

  // Group items by SKU for remision lines
  const groupedItemsMap: Record<string, RemisionItem> = {};
  order.items.forEach((it) => {
    if (!groupedItemsMap[it.sku]) {
      groupedItemsMap[it.sku] = {
        sku: it.sku,
        productName: it.productName,
        brand: it.brand,
        size: it.size,
        quantity: 0,
        lotNumber: it.lotNumber,
        uids: [],
      };
    }
    groupedItemsMap[it.sku].quantity += 1;
    groupedItemsMap[it.sku].uids.push(it.uid);
  });

  const newRemision: OutboundRemision = {
    id: `rem-gen-${order.id}`,
    folio,
    type,
    status: isComplete ? 'Remisión generada' : 'Pendiente de remisión',
    outboundOrderFolio: order.folio,
    sourceDocumentFolio: order.referenceFolio,
    sourceDocumentType: isTransfer ? 'OTP' : 'Pedido',
    createdAt: order.createdAt || '27 Ago 2026, 12:00',
    originWarehouseId: order.warehouseId,
    originWarehouseName: order.warehouseName,
    destinationName: order.destinationName,
    destinationAddress: isTransfer ? undefined : 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
    destinationFacility: isTransfer ? `${order.destinationName} - Instalación Operativa` : undefined,
    assignedLane: order.assignedLane,
    operatorAssigned: order.operatorAssigned,
    totalUnits: order.totalUnits,
    observations: isTransfer 
      ? 'Traspaso de mercancía entre instalaciones de Impresos RTM.'
      : 'Entrega de pedido comercial con productos verificados en rampa de salida.',
    qrPayload,
    items: Object.values(groupedItemsMap),
    signatures: {
      deliveredByLabel: isTransfer ? 'Entregó (CEDIS Emisor)' : 'Entregó (Chofer / Mesa de Salida)',
      deliveredByName: order.operatorAssigned,
      receivedByLabel: isTransfer ? 'Recibió en instalación' : 'Recibió de conformidad',
      receivedByName: order.destinationName,
      signeeNameLabel: isTransfer ? 'Responsable de Sucursal' : 'Nombre del Receptor',
      signeeName: order.destinationName,
      dateTimeLabel: isTransfer ? 'Fecha y hora de recepción' : 'Fecha y hora de entrega',
    },
  };

  remisionesStore.push(newRemision);
  return newRemision;
}

export function markRemisionAsPrinted(folio: string): OutboundRemision | undefined {
  const rem = remisionesStore.find((r) => r.folio === folio);
  if (rem) {
    rem.status = 'Impresa';
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    rem.printedAt = `27 Ago 2026, ${timeStr}`;
  }
  return rem;
}

export function markRemisionAsDelivered(
  folio: string,
  proof: DeliveryProof
): OutboundRemision | undefined {
  const rem = remisionesStore.find((r) => r.folio === folio);
  if (rem) {
    rem.status = proof.result === 'Entrega parcial' ? 'Entrega parcial' : 'Entregada';
    rem.deliveryProof = proof;
    rem.signatures.receivedByName = proof.recipientName;
    rem.signatures.signeeName = proof.recipientName;
  }
  return rem;
}
