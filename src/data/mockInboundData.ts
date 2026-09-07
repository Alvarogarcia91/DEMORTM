import { PurchaseOrder } from './mockPurchasesOrdersData';

export interface ReceivedUnitRecord {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  receivedAt: string;
  operator: string;
  locationCode: string;
  status: 'Pendiente de acomodo';
}

export interface InboundReceiptLine {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  category: string;
  size: string;
  serialization: 'Por unidad' | 'No serializado';
  expectedQuantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  lotNumber: string;
  status: 'Pendiente' | 'En proceso' | 'Completo' | 'Con incidencia';
  receivedUnits: ReceivedUnitRecord[];
  incidentReason?: string;
}

export interface InboundReceiptOrder {
  id: string;
  folio: string; // Folio de la Orden de Compra (ej. OC-2026-0081)
  type: 'Recepción de proveedor' | 'Recepción de traspaso' | 'Ingreso de Producción';
  originName: string;
  supplierRfc?: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  receivingAreaCode: string;
  expectedDate: string;
  referenceFolio: string; // Referencia de Requisición o Factura
  carrierName?: string;
  truckPlates?: string;
  status: 'Pendiente' | 'En recepción' | 'Parcial' | 'Completa' | 'Con incidencia' | 'Atrasada';
  totalExpectedUnits: number;
  totalReceivedUnits: number;
  totalPendingUnits: number;
  totalIncidents: number;
  operatorAssigned?: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  lines: InboundReceiptLine[];
}

export const INITIAL_INBOUND_RECEIPT_ORDERS: InboundReceiptOrder[] = [
  // 1. OC-2026-0081: Bio-Pappel - Papel Couché 90g (En recepción / Parcial)
  {
    id: 'inbound-oc-81',
    folio: 'OC-2026-0081',
    type: 'Recepción de proveedor',
    originName: 'Bio-Pappel S.A.B. de C.V.',
    supplierRfc: 'BPA-820415-KT9',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    receivingAreaCode: 'REC-01',
    expectedDate: '06 Sep 2026',
    referenceFolio: 'Factura FAC-2026-9912 / Remisión BP-4418',
    carrierName: 'Transportes Industriales Fronterizos',
    truckPlates: 'TM-3312-A',
    status: 'Parcial',
    totalExpectedUnits: 6,
    totalReceivedUnits: 4,
    totalPendingUnits: 2,
    totalIncidents: 0,
    operatorAssigned: 'Carlos Medina (Operador Mesa MP)',
    createdAt: '06 Sep 2026, 08:30',
    notes: 'Descarga de tarimas de papel couché para tirajes offset. Muestreo de gramaje y humedad aprobado por QA en andén 1.',
    lines: [
      {
        id: 'line-81-1',
        sku: 'PAP-COU-090',
        productName: 'Papel Couché Brillante 90g - 70x100 cm',
        brand: 'Bio-Pappel',
        category: 'Papel Couché / Offset',
        size: 'Tarima 10,000 pliegos',
        serialization: 'Por unidad',
        expectedQuantity: 4,
        receivedQuantity: 4,
        pendingQuantity: 0,
        lotNumber: 'RTM-MP-260901-004',
        status: 'Completo',
        receivedUnits: [
          {
            uid: 'TAR-RTM-2026-00101',
            sku: 'PAP-COU-090',
            productName: 'Papel Couché Brillante 90g - 70x100 cm',
            brand: 'Bio-Pappel',
            size: 'Tarima 10,000 pliegos',
            lotNumber: 'RTM-MP-260901-004',
            receivedAt: '06 Sep 09:15',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'TAR-RTM-2026-00102',
            sku: 'PAP-COU-090',
            productName: 'Papel Couché Brillante 90g - 70x100 cm',
            brand: 'Bio-Pappel',
            size: 'Tarima 10,000 pliegos',
            lotNumber: 'RTM-MP-260901-004',
            receivedAt: '06 Sep 09:22',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'TAR-RTM-2026-00103',
            sku: 'PAP-COU-090',
            productName: 'Papel Couché Brillante 90g - 70x100 cm',
            brand: 'Bio-Pappel',
            size: 'Tarima 10,000 pliegos',
            lotNumber: 'RTM-MP-260901-004',
            receivedAt: '06 Sep 09:30',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'TAR-RTM-2026-00104',
            sku: 'PAP-COU-090',
            productName: 'Papel Couché Brillante 90g - 70x100 cm',
            brand: 'Bio-Pappel',
            size: 'Tarima 10,000 pliegos',
            lotNumber: 'RTM-MP-260901-004',
            receivedAt: '06 Sep 09:38',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
        ],
      },
      {
        id: 'line-81-2',
        sku: 'PAP-BND-075',
        productName: 'Papel Bond Alta Blancura 75g - Bobina 85cm',
        brand: 'Bio-Pappel',
        category: 'Bobinas Flexo',
        size: 'Bobina 85cm x 1500m',
        serialization: 'Por unidad',
        expectedQuantity: 2,
        receivedQuantity: 0,
        pendingQuantity: 2,
        lotNumber: 'RTM-MP-260901-005',
        status: 'Pendiente',
        receivedUnits: [],
      },
    ],
  },
  // 2. OC-2026-0082: Avery Dennison Fasson - Bobinas BOPP Blanco (En recepción / QA activo)
  {
    id: 'inbound-oc-82',
    folio: 'OC-2026-0082',
    type: 'Recepción de proveedor',
    originName: 'Avery Dennison Fasson de México',
    supplierRfc: 'ADF-940321-LM4',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    receivingAreaCode: 'REC-01',
    expectedDate: '06 Sep 2026',
    referenceFolio: 'Remisión FASSON-88319',
    carrierName: 'Logística Especializada Norte',
    truckPlates: 'NL-8841-B',
    status: 'En recepción',
    totalExpectedUnits: 4,
    totalReceivedUnits: 2,
    totalPendingUnits: 2,
    totalIncidents: 0,
    operatorAssigned: 'Carlos Medina (Operador Mesa MP)',
    createdAt: '06 Sep 2026, 10:15',
    notes: 'Bobinas autoadhesivas de alta velocidad para etiquetas farmacéuticas y de alimentos. Certificado de liberación del fabricante adjunto.',
    lines: [
      {
        id: 'line-82-1',
        sku: 'PEL-BOPP-BLA',
        productName: 'Película BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        category: 'Bobinas Flexo',
        size: 'Bobina 330mm x 2500m',
        serialization: 'Por unidad',
        expectedQuantity: 4,
        receivedQuantity: 2,
        pendingQuantity: 2,
        lotNumber: 'RTM-MP-260902-011',
        status: 'En proceso',
        receivedUnits: [
          {
            uid: 'BOB-RTM-2026-00041',
            sku: 'PEL-BOPP-BLA',
            productName: 'Película BOPP Blanco Brillante 60 mic',
            brand: 'Fasson Avery',
            size: 'Bobina 330mm x 2500m',
            lotNumber: 'RTM-MP-260902-011',
            receivedAt: '06 Sep 10:30',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'BOB-RTM-2026-00042',
            sku: 'PEL-BOPP-BLA',
            productName: 'Película BOPP Blanco Brillante 60 mic',
            brand: 'Fasson Avery',
            size: 'Bobina 330mm x 2500m',
            lotNumber: 'RTM-MP-260902-011',
            receivedAt: '06 Sep 10:45',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
        ],
      },
    ],
  },
  // 3. OC-2026-0083: Sun Chemical - Tintas Pantone & Process (Completa)
  {
    id: 'inbound-oc-83',
    folio: 'OC-2026-0083',
    type: 'Recepción de proveedor',
    originName: 'Sun Chemical S.A. de C.V.',
    supplierRfc: 'SCH-710920-RA8',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    receivingAreaCode: 'REC-02',
    expectedDate: '05 Sep 2026',
    referenceFolio: 'Factura SUN-110294',
    carrierName: 'Química Express del Norte',
    truckPlates: 'TAM-1902-X',
    status: 'Completa',
    totalExpectedUnits: 4,
    totalReceivedUnits: 4,
    totalPendingUnits: 0,
    totalIncidents: 0,
    operatorAssigned: 'Carlos Medina (Operador Mesa MP)',
    createdAt: '05 Sep 2026, 11:00',
    completedAt: '05 Sep 2026, 12:45',
    notes: 'Recepción completa de tintas de proceso y formulación Pantone. Aprobado test de viscosidad Ford #4.',
    lines: [
      {
        id: 'line-83-1',
        sku: 'TIN-PAN-186C',
        productName: 'Tinta Gráfica Pantone Red 186 C',
        brand: 'Sun Chemical',
        category: 'Tintas y Barnices',
        size: 'Cubeta 5 kg',
        serialization: 'Por unidad',
        expectedQuantity: 2,
        receivedQuantity: 2,
        pendingQuantity: 0,
        lotNumber: 'RTM-MP-260903-008',
        status: 'Completo',
        receivedUnits: [
          {
            uid: 'CUB-RTM-2026-00018',
            sku: 'TIN-PAN-186C',
            productName: 'Tinta Gráfica Pantone Red 186 C',
            brand: 'Sun Chemical',
            size: 'Cubeta 5 kg',
            lotNumber: 'RTM-MP-260903-008',
            receivedAt: '05 Sep 11:30',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-02',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'CUB-RTM-2026-00019',
            sku: 'TIN-PAN-186C',
            productName: 'Tinta Gráfica Pantone Red 186 C',
            brand: 'Sun Chemical',
            size: 'Cubeta 5 kg',
            lotNumber: 'RTM-MP-260903-008',
            receivedAt: '05 Sep 11:40',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-02',
            status: 'Pendiente de acomodo',
          },
        ],
      },
      {
        id: 'line-83-2',
        sku: 'TIN-PROC-BLK',
        productName: 'Tinta Process Black Flexo/Offset',
        brand: 'Sun Chemical',
        category: 'Tintas y Barnices',
        size: 'Cubeta 5 kg',
        serialization: 'Por unidad',
        expectedQuantity: 2,
        receivedQuantity: 2,
        pendingQuantity: 0,
        lotNumber: 'RTM-MP-260902-005',
        status: 'Completo',
        receivedUnits: [
          {
            uid: 'CUB-RTM-2026-00051',
            sku: 'TIN-PROC-BLK',
            productName: 'Tinta Process Black Flexo/Offset',
            brand: 'Sun Chemical',
            size: 'Cubeta 5 kg',
            lotNumber: 'RTM-MP-260902-005',
            receivedAt: '05 Sep 12:00',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-02',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'CUB-RTM-2026-00052',
            sku: 'TIN-PROC-BLK',
            productName: 'Tinta Process Black Flexo/Offset',
            brand: 'Sun Chemical',
            size: 'Cubeta 5 kg',
            lotNumber: 'RTM-MP-260902-005',
            receivedAt: '05 Sep 12:15',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-02',
            status: 'Pendiente de acomodo',
          },
        ],
      },
    ],
  },
  // 4. OC-2026-0085: Smurfit Westrock - Cajas Corrugadas Flauta C (Con incidencia)
  {
    id: 'inbound-oc-85',
    folio: 'OC-2026-0085',
    type: 'Recepción de proveedor',
    originName: 'Smurfit Westrock México',
    supplierRfc: 'SWM-990812-HJ1',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    receivingAreaCode: 'REC-01',
    expectedDate: '06 Sep 2026',
    referenceFolio: 'Remisión SW-77120',
    carrierName: 'Fletes Reynosa Directo',
    truckPlates: 'TM-9944-E',
    status: 'Con incidencia',
    totalExpectedUnits: 3,
    totalReceivedUnits: 2,
    totalPendingUnits: 1,
    totalIncidents: 1,
    operatorAssigned: 'Carlos Medina (Operador Mesa MP)',
    createdAt: '06 Sep 2026, 13:00',
    notes: 'Incidencia en andén: Tarima con flejes rotos y esquineros deformados por estiba indebida durante transporte. Se mantiene en área de retención QA.',
    lines: [
      {
        id: 'line-85-1',
        sku: 'CJ-EMB-MED',
        productName: 'Cajas Corrugadas Flauta C 40x30x30 cm',
        brand: 'Smurfit Westrock',
        category: 'Empaque Corrugado',
        size: 'Tarima 500 pzas',
        serialization: 'Por unidad',
        expectedQuantity: 3,
        receivedQuantity: 2,
        pendingQuantity: 1,
        lotNumber: 'RTM-MP-260904-019',
        status: 'Con incidencia',
        incidentReason: 'Tarima con flejes rotos y esquineros deformados por estiba indebida durante transporte.',
        receivedUnits: [
          {
            uid: 'TAR-RTM-2026-00401',
            sku: 'CJ-EMB-MED',
            productName: 'Cajas Corrugadas Flauta C 40x30x30 cm',
            brand: 'Smurfit Westrock',
            size: 'Tarima 500 pzas',
            lotNumber: 'RTM-MP-260904-019',
            receivedAt: '06 Sep 13:20',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
          {
            uid: 'TAR-RTM-2026-00402',
            sku: 'CJ-EMB-MED',
            productName: 'Cajas Corrugadas Flauta C 40x30x30 cm',
            brand: 'Smurfit Westrock',
            size: 'Tarima 500 pzas',
            lotNumber: 'RTM-MP-260904-019',
            receivedAt: '06 Sep 13:35',
            operator: 'Carlos Medina (Mesa MP)',
            locationCode: 'REC-01',
            status: 'Pendiente de acomodo',
          },
        ],
      },
    ],
  },
  // 5. OC-2026-0084: Siegwerk México - Barniz UV Gráfico (Pendiente de arribo)
  {
    id: 'inbound-oc-84',
    folio: 'OC-2026-0084',
    type: 'Recepción de proveedor',
    originName: 'Siegwerk México S. de R.L.',
    supplierRfc: 'SME-980115-TP2',
    destinationWarehouseId: 'wh-mty-norte',
    destinationWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    receivingAreaCode: 'REC-02',
    expectedDate: '07 Sep 2026',
    referenceFolio: 'Pedido Proveedor SIG-55410',
    carrierName: 'Transportes Químicos Especializados',
    truckPlates: 'NL-1149-D',
    status: 'Pendiente',
    totalExpectedUnits: 2,
    totalReceivedUnits: 0,
    totalPendingUnits: 2,
    totalIncidents: 0,
    operatorAssigned: 'Carlos Medina (Operador Mesa MP)',
    createdAt: '06 Sep 2026, 14:00',
    notes: 'Arribo programado para el 07 Sep. Tambos de barniz UV con control de temperatura ambiental.',
    lines: [
      {
        id: 'line-84-1',
        sku: 'BAR-UV-GLOSS',
        productName: 'Barniz UV Alto Brillo Gráfico',
        brand: 'Siegwerk',
        category: 'Tintas y Barnices',
        size: 'Tambo 200 kg',
        serialization: 'Por unidad',
        expectedQuantity: 2,
        receivedQuantity: 0,
        pendingQuantity: 2,
        lotNumber: 'RTM-MP-260905-003',
        status: 'Pendiente',
        receivedUnits: [],
      },
    ],
  },
];

export function buildInboundOrderFromPurchaseOrder(
  po: PurchaseOrder,
  existingUnitsBySku?: Record<string, ReceivedUnitRecord[]>
): InboundReceiptOrder {
  const isPT = po.targetWarehouseId === 'wh-mty-sur';
  const receivingAreaCode = isPT ? 'REC-02' : 'REC-01';
  const hasIncident = Boolean(
    po.notes &&
    (po.notes.toLowerCase().includes('incidencia') ||
      po.notes.toLowerCase().includes('dañado') ||
      po.notes.toLowerCase().includes('incorrecta') ||
      po.notes.toLowerCase().includes('roto') ||
      po.notes.toLowerCase().includes('ilegible'))
  );

  const poNumber = parseInt(po.folio.replace(/\D/g, ''), 10) || 81;

  const lines: InboundReceiptLine[] = po.items.map((item, itemIdx) => {
    let units = existingUnitsBySku?.[item.sku] || [];

    if (units.length === 0 && item.receivedQuantity > 0) {
      units = Array.from({ length: item.receivedQuantity }, (_, i) => ({
        uid: `TAR-RTM-2026-${(poNumber * 100 + itemIdx * 10 + i + 1).toString().padStart(6, '0')}`,
        sku: item.sku,
        productName: item.name,
        brand: item.brand,
        size: item.size,
        lotNumber: `RTM-MP-26090${(itemIdx + 1)}-00${i + 1}`,
        receivedAt: `06 Sep 10:${(10 + i * 2).toString().padStart(2, '0')}`,
        operator: isPT ? 'Valeria Torres (Mesa PT)' : 'Carlos Medina (Mesa MP)',
        locationCode: receivingAreaCode,
        status: 'Pendiente de acomodo',
      }));
    }

    const pendingQty = Math.max(0, item.orderedQuantity - item.receivedQuantity);

    let lineStatus: InboundReceiptLine['status'] = 'Pendiente';
    if (pendingQty === 0 && item.receivedQuantity > 0) {
      lineStatus = 'Completo';
    } else if (item.receivedQuantity > 0) {
      lineStatus = hasIncident ? 'Con incidencia' : 'En proceso';
    }

    return {
      id: `line-${po.id}-${item.id}`,
      sku: item.sku,
      productName: item.name,
      brand: item.brand,
      category: 'Materia Prima Industrial',
      size: item.size,
      serialization: 'Por unidad',
      expectedQuantity: item.orderedQuantity,
      receivedQuantity: item.receivedQuantity,
      pendingQuantity: pendingQty,
      lotNumber: `RTM-MP-26090${(itemIdx + 1)}-001`,
      status: lineStatus,
      receivedUnits: units,
      incidentReason: hasIncident ? po.notes : undefined,
    };
  });

  const totalExpectedUnits = lines.reduce((s, l) => s + l.expectedQuantity, 0);
  const totalReceivedUnits = lines.reduce((s, l) => s + l.receivedQuantity, 0);
  const totalPendingUnits = lines.reduce((s, l) => s + l.pendingQuantity, 0);

  let status: InboundReceiptOrder['status'] = 'Pendiente';
  if (hasIncident) {
    status = 'Con incidencia';
  } else if (po.status === 'Atrasada') {
    status = 'Atrasada';
  } else if (totalPendingUnits === 0 && totalReceivedUnits > 0) {
    status = 'Completa';
  } else if (totalReceivedUnits > 0) {
    status = 'Parcial';
  } else if (po.status === 'En tránsito') {
    status = 'En recepción';
  }

  return {
    id: `inbound-${po.id}`,
    folio: po.folio,
    type: 'Recepción de proveedor',
    originName: po.supplierTradeName,
    supplierRfc: po.supplierRfc,
    destinationWarehouseId: po.targetWarehouseId,
    destinationWarehouseName: po.targetWarehouseName,
    receivingAreaCode,
    expectedDate: po.expectedDeliveryDate,
    referenceFolio: po.requisitionFolio ? `Requisición #${po.requisitionFolio}` : po.folio,
    carrierName: 'Transportes Rápidos del Norte',
    truckPlates: isPT ? 'NL-4412-C' : 'NL-9921-B',
    status,
    totalExpectedUnits,
    totalReceivedUnits,
    totalPendingUnits,
    totalIncidents: hasIncident ? 1 : 0,
    operatorAssigned: isPT ? 'Valeria Torres (Operador PT)' : 'Carlos Medina (Operador MP)',
    createdAt: po.emissionDate || '06 Sep 2026',
    completedAt: po.status === 'Recibida' ? '06 Sep 2026, 18:45' : undefined,
    notes: po.notes || `Recepción directa de proveedor vinculada a la Orden de Compra ${po.folio}.`,
    lines,
  };
}
