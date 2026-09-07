import { OutboundVerificationOrder } from './mockOutboundVerificationData';

export type RemisionType = 'Venta' | 'Traspaso' | 'Exposición' | 'Despacho B2B';
export type RemisionStatus = 
  | 'Pendiente de remisión' 
  | 'Remisión generada' 
  | 'Impresa' 
  | 'Entregada' 
  | 'Entrega parcial';

export interface DeliveryProof {
  deliveredAt: string; // ej. '06 Sep 2026 · 14:48'
  recipientName: string; // ej. 'Ing. Roberto Cantú'
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
  folio: string; // ej. 'REM-2026-0061'
  type: RemisionType;
  status: RemisionStatus;
  outboundOrderFolio: string; // ej. 'VS-2026-0040'
  sourceDocumentFolio: string; // ej. 'PED-2026-0410'
  sourceDocumentType: 'Pedido' | 'OTP' | 'Exposición';
  createdAt: string;
  printedAt?: string;
  originWarehouseId: string;
  originWarehouseName: string; // ej. 'ALM-PT (Producto Terminado - Nave 2 Reynosa)'
  destinationName: string; // ej. 'Laboratorios Medifarma S.A. de C.V.'
  destinationAddress?: string;
  destinationFacility?: string;
  assignedLane?: string; // ej. 'EMB-01'
  operatorAssigned: string; // ej. 'Valeria Torres (Operador PT)'
  totalUnits: number;
  observations?: string;
  qrPayload: string;
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
  // REMISIÓN 1 (Laboratorios Medifarma - PT Farmacéutico / 100% validada)
  // =========================================================================
  {
    id: 'rem-1',
    folio: 'REM-2026-0061',
    type: 'Venta',
    status: 'Remisión generada',
    outboundOrderFolio: 'VS-2026-0040',
    sourceDocumentFolio: 'PED-2026-0410',
    sourceDocumentType: 'Pedido',
    createdAt: '06 Sep 2026, 11:45',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Laboratorios Medifarma S.A. de C.V.',
    destinationAddress: 'Av. Industrial Falcon 1200, Parque Industrial Reynosa, Reynosa, Tamps.',
    assignedLane: 'EMB-01',
    operatorAssigned: 'Valeria Torres (Operador PT)',
    totalUnits: 3,
    observations: 'Entrega en área de almacén de empaque primario. Requiere certificado de análisis COA y verificación de sello de caja.',
    qrPayload: 'REM=REM-2026-0061|TYPE=SALE|REF=PED-2026-0410',
    carrierInfo: {
      driverName: 'Mario Cantú',
      unitPlate: 'TM-8492-B',
      vehicleType: 'Camioneta Isuzu 3.5 Ton',
    },
    items: [
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'Etiqueta Farmacéutica Vial 10ml - PT',
        brand: 'RTM Packaging',
        size: 'Rollo 5,000 pzas',
        quantity: 3,
        lotNumber: 'RTM-PT-260905-001',
        uids: [
          'CJ-RTM-2026-00211',
          'CJ-RTM-2026-00212',
          'CJ-RTM-2026-00213',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida PT)',
      deliveredByName: 'Mario Cantú (Transporte RTM)',
      receivedByLabel: 'Recibió de conformidad (QA Cliente)',
      receivedByName: 'Lic. Roberto Cantú',
      signeeNameLabel: 'Nombre del Receptor',
      signeeName: 'Lic. Roberto Cantú',
      dateTimeLabel: 'Fecha y hora de entrega',
    },
  },

  // =========================================================================
  // REMISIÓN 2 (Delphi Technologies - Cajas Corrugadas / En proceso)
  // =========================================================================
  {
    id: 'rem-2',
    folio: 'REM-2026-0062',
    type: 'Venta',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0044',
    sourceDocumentFolio: 'PED-2026-0398',
    sourceDocumentType: 'Pedido',
    createdAt: '06 Sep 2026, 13:50',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Delphi Technologies Reynosa (Planta 2)',
    destinationAddress: 'Av. Las Palmas 500, Parque Industrial Villa Florida, Reynosa, Tamps.',
    assignedLane: 'EMB-02',
    operatorAssigned: 'Valeria Torres (Operador PT)',
    totalUnits: 3,
    observations: 'Entrega por rampa 4 de recepción de componentes. Solicitar pase de acceso en caseta norte.',
    qrPayload: 'REM=REM-2026-0062|TYPE=SALE|REF=PED-2026-0398',
    items: [
      {
        sku: 'CJ-EMB-MED',
        productName: 'Cajas Corrugadas Flauta C 40x30x30 cm',
        brand: 'RTM Packaging',
        size: 'Tarima 500 pzas',
        quantity: 3,
        lotNumber: 'RTM-PT-260903-010',
        uids: [
          'TAR-RTM-2026-00401',
          'TAR-RTM-2026-00402',
          'TAR-RTM-2026-00403',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida PT)',
      receivedByLabel: 'Recibió de conformidad',
      signeeNameLabel: 'Nombre del Receptor',
      dateTimeLabel: 'Fecha y hora de entrega',
    },
  },

  // =========================================================================
  // REMISIÓN 3 (Empacadora del Golfo - Folletos y Plegadizos)
  // =========================================================================
  {
    id: 'rem-3',
    folio: 'REM-2026-0063',
    type: 'Venta',
    status: 'Pendiente de remisión',
    outboundOrderFolio: 'VS-2026-0042',
    sourceDocumentFolio: 'PED-2026-0402',
    sourceDocumentType: 'Pedido',
    createdAt: '06 Sep 2026, 14:00',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Empacadora del Golfo S.A. de C.V.',
    destinationAddress: 'Km 8.5 Carretera Matamoros-Reynosa, Reynosa, Tamps.',
    assignedLane: 'EMB-03',
    operatorAssigned: 'Valeria Torres (Operador PT)',
    totalUnits: 2,
    observations: 'Lote de folletos médicos plegados y estuches de cartulina.',
    qrPayload: 'REM=REM-2026-0063|TYPE=SALE|REF=PED-2026-0402',
    items: [
      {
        sku: 'FOL-MED-PLE',
        productName: 'Folleto Médico Farmacéutico Plegado 4 Cuerpos',
        brand: 'RTM Packaging',
        size: 'Caja 1,000 pzas',
        quantity: 2,
        lotNumber: 'RTM-PT-260904-003',
        uids: [
          'CJ-RTM-2026-00301',
          'CJ-RTM-2026-00302',
        ],
      },
    ],
    signatures: {
      deliveredByLabel: 'Entregó (Chofer / Mesa de Salida PT)',
      receivedByLabel: 'Recibió de conformidad',
      signeeNameLabel: 'Nombre del Receptor',
      dateTimeLabel: 'Fecha y hora de entrega',
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
    if (order.status === 'Lista para carga' && existing.status === 'Pendiente de remisión') {
      existing.status = 'Remisión generada';
    }
    return existing;
  }

  const isTransfer = order.type === 'Orden de Traspaso' || order.referenceFolio.startsWith('OTP');
  const type: RemisionType = isTransfer ? 'Traspaso' : 'Venta';
  
  const orderNumber = order.folio.replace(/\D/g, '') || '0050';
  const folio = isTransfer 
    ? `REM-TR-2026-00${(parseInt(orderNumber, 10) % 50 + 20).toString().padStart(2, '0')}`
    : `REM-2026-00${(parseInt(orderNumber, 10) % 50 + 60).toString().padStart(2, '0')}`;

  const isComplete = order.status === 'Lista para carga';
  const refType = isTransfer ? 'TRANSFER' : 'SALE';
  const qrPayload = `REM=${folio}|TYPE=${refType}|REF=${order.referenceFolio}`;

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
    createdAt: order.createdAt || '06 Sep 2026, 12:00',
    originWarehouseId: order.warehouseId,
    originWarehouseName: order.warehouseName,
    destinationName: order.destinationName,
    destinationAddress: isTransfer ? undefined : 'Parque Industrial Reynosa, Tamps.',
    destinationFacility: isTransfer ? `${order.destinationName} - Planta RTM` : undefined,
    assignedLane: order.assignedLane,
    operatorAssigned: order.operatorAssigned,
    totalUnits: order.totalUnits,
    observations: isTransfer 
      ? 'Traspaso interno de bobinas/materiales entre naves operativas de Impresos RTM.'
      : 'Despacho de producto terminado industrial con liberación de calidad.',
    qrPayload,
    items: Object.values(groupedItemsMap),
    signatures: {
      deliveredByLabel: isTransfer ? 'Entregó (Nave Emisora)' : 'Entregó (Chofer / Mesa PT)',
      deliveredByName: order.operatorAssigned,
      receivedByLabel: isTransfer ? 'Recibió en nave' : 'Recibió de conformidad',
      receivedByName: order.destinationName,
      signeeNameLabel: isTransfer ? 'Responsable de Nave' : 'Nombre del Receptor',
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
    rem.printedAt = `06 Sep 2026, ${timeStr}`;
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
