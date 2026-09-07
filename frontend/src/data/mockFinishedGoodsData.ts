import { ShippingOutboundOrder, ShippingOrderItem, RouteStop } from './mockShippingData';

export interface FinishedGoodsRelease {
  id: string;
  opId: string;
  opFolio: string;
  pedido: string;
  client: string;
  partNumber: string;
  revision: string;
  area: 'Offset' | 'Flexografía' | 'Acabados';
  finishedQty: number;
  lotNumber: string;
  packageCount?: number;
  unitsPerPackage?: number;
  warehouseId: 'alm-rtm-pt';
  warehouseName: 'Almacén Producto Terminado';
  location: string;
  qualityReleaseId?: string;
  releasedBy: string;
  releasedAt: string;
  status:
    | 'Pendiente de QA'
    | 'Liberado para PT'
    | 'Disponible para embarque'
    | 'Asignado a salida';
  traceabilityNotes?: string;
  isRecentRelease?: boolean;
}

export const INITIAL_FINISHED_GOODS: FinishedGoodsRelease[] = [
  {
    id: 'pt-rel-042',
    opId: 'op-12',
    opFolio: 'OP-2026-95252',
    pedido: 'PED-RTM-2026-86153',
    client: 'Fresenius Kabi',
    partNumber: 'ETQ-BOPP-4X6',
    revision: 'Rev C',
    area: 'Flexografía',
    finishedQty: 49100,
    lotNumber: 'PT-260907-042',
    packageCount: 50,
    unitsPerPackage: 1000,
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    location: 'PT-A-03',
    qualityReleaseId: 'QA-260907-084',
    releasedBy: 'Alicia Ramírez (Calidad)',
    releasedAt: '07 Sep · 14:38',
    status: 'Disponible para embarque',
    traceabilityNotes: 'Inspección AQL 0.65 conforme. 49,100 etiquetas en 50 cajas corrugadas tarimadas.',
    isRecentRelease: true,
  },
  {
    id: 'pt-rel-038',
    opId: 'op-1',
    opFolio: 'OP-2026-95240',
    pedido: 'PED-RTM-2026-0142',
    client: 'Black & Decker',
    partNumber: 'NA472050',
    revision: 'Rev B',
    area: 'Offset',
    finishedQty: 24500,
    lotNumber: 'PT-260907-038',
    packageCount: 25,
    unitsPerPackage: 1000,
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    location: 'PT-B-02',
    qualityReleaseId: 'QA-260907-079',
    releasedBy: 'Alicia Ramírez (Calidad)',
    releasedAt: '07 Sep · 11:20',
    status: 'Disponible para embarque',
    traceabilityNotes: 'Manuales instructivos grapados. Control dimensional y registro conforme.',
    isRecentRelease: false,
  },
  {
    id: 'pt-rel-031',
    opId: 'op-2',
    opFolio: 'OP-2026-95241',
    pedido: 'PED-RTM-2026-0180',
    client: 'Tyco Electronics',
    partNumber: 'ETQ-TYCO-001',
    revision: 'Rev A',
    area: 'Flexografía',
    finishedQty: 18000,
    lotNumber: 'PT-260906-031',
    packageCount: 18,
    unitsPerPackage: 1000,
    warehouseId: 'alm-rtm-pt',
    warehouseName: 'Almacén Producto Terminado',
    location: 'PT-C-01',
    qualityReleaseId: 'QA-260906-065',
    releasedBy: 'Alicia Ramírez (Calidad)',
    releasedAt: '06 Sep · 17:15',
    status: 'Asignado a salida',
    traceabilityNotes: 'Asignado a despacho matutino ruta Parque Industrial Reynosa.',
    isRecentRelease: false,
  },
];

/**
 * Convierte un FinishedGoodsRelease en una ShippingOutboundOrder compatible
 * con el motor de andenes, transportes y carga de Embarques.
 */
export function finishedGoodToShippingOrder(
  pt: FinishedGoodsRelease,
  index: number = 0
): ShippingOutboundOrder {
  const packageUnits = pt.packageCount || Math.max(1, Math.ceil(pt.finishedQty / 1000));
  const orderId = `sh-ord-pt-${pt.lotNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const folio = `OS-${pt.lotNumber}`;
  const remisionFolio = `REM-${pt.lotNumber}`;

  const item: ShippingOrderItem = {
    sku: pt.partNumber,
    productName: `${pt.client} · ${pt.partNumber} (${pt.finishedQty.toLocaleString()} pzas)`,
    brand: pt.client,
    size: `${pt.finishedQty.toLocaleString()} pzas · ${packageUnits} bultos logísticos`,
    quantity: packageUnits,
    lotNumber: pt.lotNumber,
    uids: [`UID-${pt.lotNumber}-01`, `UID-${pt.lotNumber}-02`, `UID-${pt.lotNumber}-03`],
  };

  const stop: RouteStop = {
    id: `stop-pt-${pt.lotNumber}`,
    sequenceNumber: 1,
    destinationName: `${pt.client} (Planta Principal)`,
    zoneName: 'Parque Industrial Reynosa',
    address: 'Av. Industrial del Norte #420, Reynosa, Tamps.',
    coordinates: { x: 380 + (index * 40) % 180, y: 220 + (index * 30) % 150 },
    totalUnits: packageUnits,
    remisionFolio,
    sourceDocumentFolio: pt.pedido || pt.opFolio,
    customerType: 'Cliente Industrial B2B',
    contactName: 'Mesa de Recibo de Materiales',
    timeWindow: '15:00 - 17:30 h',
    priority: pt.isRecentRelease ? 'Alta' : 'Normal',
    notes: `Entrega de Producto Terminado liberado por QA (${pt.releasedBy}). Lote ${pt.lotNumber}. Almacén PT ubicación ${pt.location}.`,
    items: [item],
  };

  return {
    id: orderId,
    folio,
    type: 'Despacho B2B',
    sourceDocumentFolio: pt.pedido || pt.opFolio,
    sourceDocumentType: 'Pedido',
    originWarehouseId: pt.warehouseId,
    originWarehouseName: `${pt.warehouseName} (Reynosa)`,
    originCoordinates: { x: 260, y: 70, name: 'ALM-PT (Producto Terminado - Nave 1)' },
    destinationName: `${pt.client} (Planta Reynosa)`,
    destinationAddress: 'Parque Industrial Reynosa, Reynosa, Tamps.',
    destinationFacility: 'Andén de Recibo de Materia Prima',
    totalUnits: packageUnits,
    remisionFolio,
    plannedDate: '07 Sep 2026',
    plannedTime: '16:00',
    status: 'Lista para carga',
    createdAt: pt.releasedAt,
    assignedLane: 'EMB-02',
    assignedVehicleId: 'veh-08',
    assignedVehicleName: 'Camión #08 · Isuzu NPR',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Roberto Garza',
    notes: `Orden generada automáticamente tras liberación de calidad. Lote ${pt.lotNumber} (${pt.finishedQty.toLocaleString()} pzas). Ubicación en rack: ${pt.location}.`,
    items: [item],
    stops: [stop],
    routeAlternatives: [
      {
        id: `alt-${orderId}-rec`,
        strategy: 'RECOMMENDED',
        title: 'Ruta directa a planta',
        distanceKm: 14.5,
        estimatedTimeMinutes: 32,
        trafficDelayMinutes: 5,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: [stop.id],
        description: 'Entrega prioritaria directa desde Almacén de Producto Terminado.',
      },
    ],
    selectedStrategy: 'RECOMMENDED',
  };
}
