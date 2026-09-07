import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';
import { PurchaseOrder, INITIAL_MOCK_PURCHASE_ORDERS } from './mockPurchasesOrdersData';

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
  category: 'Colchones' | 'Bases' | 'Almohadas' | 'Protectores';
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
  type: 'Recepción de proveedor' | 'Recepción de traspaso';
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

/**
 * Convierte y sincroniza una PurchaseOrder compartida hacia el formato operativo InboundReceiptOrder.
 */
export function buildInboundOrderFromPurchaseOrder(
  po: PurchaseOrder,
  existingUnitsBySku?: Record<string, ReceivedUnitRecord[]>
): InboundReceiptOrder {
  const isSur = po.targetWarehouseId === 'wh-mty-sur';
  const receivingAreaCode = isSur ? 'REC-02' : 'REC-01';
  const hasIncident = Boolean(
    po.notes &&
    (po.notes.toLowerCase().includes('incidencia') ||
      po.notes.toLowerCase().includes('dañado') ||
      po.notes.toLowerCase().includes('incorrecta') ||
      po.notes.toLowerCase().includes('ilegible'))
  );

  const poNumber = parseInt(po.folio.replace(/\D/g, ''), 10) || 81;

  const lines: InboundReceiptLine[] = po.items.map((item, itemIdx) => {
    const isNonSerialized = item.sku.includes('ALM') || item.sku.includes('PROT');
    let units = existingUnitsBySku?.[item.sku] || [];

    if (!isNonSerialized && units.length === 0 && item.receivedQuantity > 0) {
      units = Array.from({ length: item.receivedQuantity }, (_, i) => ({
        uid: `SC-UID-2026-${(poNumber * 100 + itemIdx * 10 + i + 1).toString().padStart(6, '0')}`,
        sku: item.sku,
        productName: item.name,
        brand: item.brand,
        size: item.size,
        lotNumber: 'LOTE-2026-W34',
        receivedAt: `27 Ago 10:${(10 + i * 2).toString().padStart(2, '0')}`,
        operator: isSur ? 'Valeria Torres (Mesa 02)' : 'Carlos Medina (Mesa 01)',
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
      category: item.sku.includes('ALM') ? 'Almohadas' : item.sku.includes('PROT') ? 'Protectores' : 'Colchones',
      size: item.size,
      serialization: isNonSerialized ? 'No serializado' : 'Por unidad',
      expectedQuantity: item.orderedQuantity,
      receivedQuantity: item.receivedQuantity,
      pendingQuantity: pendingQty,
      lotNumber: 'LOTE-2026-W34',
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
  } else if (po.status === 'Confirmada por proveedor' || po.status === 'Emitida') {
    status = 'Pendiente';
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
    truckPlates: isSur ? 'NL-4412-C' : 'NL-9921-B',
    status,
    totalExpectedUnits,
    totalReceivedUnits,
    totalPendingUnits,
    totalIncidents: hasIncident ? 1 : 0,
    operatorAssigned: isSur ? 'Valeria Torres (Operador Mesa 02)' : 'Carlos Medina (Operador Mesa 01)',
    createdAt: po.emissionDate || '27 Ago 2026',
    completedAt: po.status === 'Recibida' ? '27 Ago 2026, 18:45' : undefined,
    notes: po.notes || `Recepción directa de proveedor vinculada a la Orden de Compra ${po.folio}.`,
    lines,
  };
}

/**
 * Inicialización de órdenes de recepción generadas 100% a partir de las Órdenes de Compra compartidas.
 */
export const INITIAL_INBOUND_RECEIPT_ORDERS: InboundReceiptOrder[] = INITIAL_MOCK_PURCHASE_ORDERS
  .filter((po) => po.targetWarehouseType === 'CEDIS')
  .map((po) => buildInboundOrderFromPurchaseOrder(po));
