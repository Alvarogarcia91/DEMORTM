import { INITIAL_MOCK_SUPPLIERS, SupplierMaster, getSupplierArticleActivePrice } from './mockSuppliersData';

export type PurchaseOrderStatus =
  | 'Borrador'
  | 'Emitida'
  | 'Confirmada por proveedor'
  | 'En tránsito'
  | 'Parcialmente recibida'
  | 'Recibida'
  | 'Atrasada'
  | 'Cancelada';

export interface SupplierInfo {
  id: string;
  name: string;
  tradeName: string;
  rfc: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  paymentCondition: 'Crédito' | 'Contado' | 'Contra entrega' | 'Anticipo' | 'Otra';
  creditDays: number;
  leadTimeDays: number;
  currency: 'MXN' | 'USD';
  associatedBrands: string[];
}

export interface PurchaseOrderItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  size: string;
  requestedQuantity: number;
  orderedQuantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  unit: string;
  unitPrice: number;
  lastPrice: number;
  discountPercent?: number;
  subtotal: number;
}

export interface PurchaseOrderTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  action: string;
  comment?: string;
  type: 'created' | 'emitted' | 'confirmed' | 'in_transit' | 'partially_received' | 'received' | 'delayed' | 'cancelled' | 'updated';
}

export interface PurchaseOrder {
  id: string;
  folio: string; // ej. 'OC-2026-0081'
  supplierId: string;
  supplierName: string;
  supplierTradeName: string;
  supplierRfc: string;
  contactName: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  targetWarehouseType: 'CEDIS' | 'Sucursal';
  emissionDate?: string;
  expectedDeliveryDate: string;
  requisitionFolio?: string;
  requisitionId?: string;
  paymentCondition: 'Crédito' | 'Contado' | 'Contra entrega' | 'Anticipo' | 'Otra';
  creditDays: number;
  currency: 'MXN' | 'USD';
  subtotal: number;
  tax: number; // 16% IVA
  total: number;
  status: PurchaseOrderStatus;
  delayDays?: number;
  cancellationReason?: string;
  notes?: string;
  items: PurchaseOrderItem[];
  timeline: PurchaseOrderTimelineEntry[];
}

// Derive MOCK_SUPPLIERS from INITIAL_MOCK_SUPPLIERS to avoid duplicates
export const MOCK_SUPPLIERS: SupplierInfo[] = INITIAL_MOCK_SUPPLIERS.map((s) => ({
  id: s.id,
  name: s.legalName,
  tradeName: s.tradeName,
  rfc: s.rfc,
  contactName: s.contacts.find((c) => c.isPrimary)?.name || s.contacts[0]?.name || 'Contacto Comercial',
  contactPhone: s.contacts.find((c) => c.isPrimary)?.phone || s.contacts[0]?.phone || '+52 81 0000 0000',
  contactEmail: s.contacts.find((c) => c.isPrimary)?.email || s.contacts[0]?.email || 'comercial@demo-proveedor.mx',
  paymentCondition: s.paymentCondition,
  creditDays: s.creditDays,
  leadTimeDays: s.estimatedLeadDays,
  currency: s.preferredCurrency,
  associatedBrands: Array.from(new Set(s.articles.map((a) => a.brand))),
}));

// Helper to calculate pricing checking supplier reference first
export function getMockArticlePrice(sku: string, supplierId?: string): {
  unitPrice: number;
  lastPrice: number;
  priceVariationPercent: number;
  priceListName?: string;
  hasActivePriceList: boolean;
} {
  if (supplierId) {
    const sup = INITIAL_MOCK_SUPPLIERS.find((s) => s.id === supplierId);
    if (sup) {
      const activePriceInfo = getSupplierArticleActivePrice(sup, sku);
      if (activePriceInfo) {
        return {
          unitPrice: activePriceInfo.price,
          lastPrice: activePriceInfo.previousPrice || Math.round(activePriceInfo.price * 0.98),
          priceVariationPercent: activePriceInfo.variationPercent || 0,
          priceListName: activePriceInfo.priceListName,
          hasActivePriceList: activePriceInfo.hasActivePrice,
        };
      }
    }
  }

  for (const s of INITIAL_MOCK_SUPPLIERS) {
    const activePriceInfo = getSupplierArticleActivePrice(s, sku);
    if (activePriceInfo && activePriceInfo.hasActivePrice) {
      return {
        unitPrice: activePriceInfo.price,
        lastPrice: activePriceInfo.previousPrice || Math.round(activePriceInfo.price * 0.98),
        priceVariationPercent: activePriceInfo.variationPercent || 0,
        priceListName: activePriceInfo.priceListName,
        hasActivePriceList: true,
      };
    }
  }

  const hash = sku.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const unitPrice = 3500 + (hash % 50) * 100;
  const lastPrice = Math.round(unitPrice * (1 - (hash % 7 - 3) / 100));
  const priceVariationPercent = +(((unitPrice - lastPrice) / lastPrice) * 100).toFixed(1);

  return { unitPrice, lastPrice, priceVariationPercent, hasActivePriceList: false };
}

// Initial Mock Purchase Orders (Complete & Rich)
export const INITIAL_MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  // ==========================================
  // CEDIS MONTERREY NORTE
  // ==========================================
  // 1. En recepción (En tránsito)
  {
    id: 'oc-0081',
    folio: 'OC-2026-0081',
    supplierId: 'sup-nayt',
    supplierName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    supplierTradeName: 'Nayt México',
    supplierRfc: 'DEMO-NAYT-001',
    contactName: 'Laura Martínez',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '24 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0038',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 86500,
    tax: 13840,
    total: 100340,
    status: 'En tránsito',
    notes: 'Entrega programada para descarga en rampa REC-01 CEDIS Monterrey Norte hoy.',
    items: [
      { id: 'item-81-1', sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', requestedQuantity: 10, orderedQuantity: 10, receivedQuantity: 0, pendingQuantity: 10, unit: 'Colchón', unitPrice: 4200, lastPrice: 4150, subtotal: 42000 },
      { id: 'item-81-2', sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 0, pendingQuantity: 8, unit: 'Colchón', unitPrice: 4900, lastPrice: 4850, subtotal: 39200 },
      { id: 'item-81-3', sku: 'SC-NAYT-FLOW-QS', name: 'Nayt Colchón Flow Basic White Queen Size', brand: 'Nayt', size: 'Queen Size', requestedQuantity: 1, orderedQuantity: 1, receivedQuantity: 0, pendingQuantity: 1, unit: 'Colchón', unitPrice: 5300, lastPrice: 5300, subtotal: 5300 },
    ],
    timeline: [
      { id: 't-81-1', occurredAt: '24 Ago 09:30', actor: 'Admin Demo', role: 'Comprador', action: 'Generó la Orden de Compra desde REQ-2026-0038', type: 'created' },
      { id: 't-81-2', occurredAt: '24 Ago 10:15', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió la Orden de Compra formalmente al proveedor', type: 'emitted' },
      { id: 't-81-3', occurredAt: '24 Ago 14:00', actor: 'Nayt México', role: 'Proveedor', action: 'Confirmó recepción y fecha de entrega para el 27 Ago', type: 'confirmed' },
      { id: 't-81-4', occurredAt: '26 Ago 16:30', actor: 'Transportes Rápidos del Norte', role: 'Transportista', action: 'Embarque en ruta hacia CEDIS Monterrey Norte', type: 'in_transit' },
    ],
  },
  // 2. En recepción (En tránsito)
  {
    id: 'oc-0085',
    folio: 'OC-2026-0085',
    supplierId: 'sup-sealy',
    supplierName: 'Sealy Corporation México S.A. de C.V. (Demo)',
    supplierTradeName: 'Sealy México',
    supplierRfc: 'DEMO-SEA-005',
    contactName: 'Lic. Mariana Villarreal',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '25 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0041',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 78000,
    tax: 12480,
    total: 90480,
    status: 'En tránsito',
    notes: 'Arribo de tractocamión en andén REC-01. Operador Carlos Medina asignado.',
    items: [
      { id: 'item-85-1', sku: 'SC-SEAL-POST-QS', name: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', size: 'Queen Size', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 0, pendingQuantity: 6, unit: 'Colchón', unitPrice: 7500, lastPrice: 7400, subtotal: 45000 },
      { id: 'item-85-2', sku: 'SC-SEAL-POST-KS', name: 'Sealy Posturepedic Crown Jewel King Size', brand: 'Sealy', size: 'King Size', requestedQuantity: 3, orderedQuantity: 3, receivedQuantity: 0, pendingQuantity: 3, unit: 'Colchón', unitPrice: 11000, lastPrice: 10900, subtotal: 33000 },
    ],
    timeline: [
      { id: 't-85-1', occurredAt: '25 Ago 11:00', actor: 'Carlos Medina', role: 'Comprador', action: 'Emitió orden Sealy', type: 'emitted' },
      { id: 't-85-2', occurredAt: '26 Ago 09:00', actor: 'Sealy México', role: 'Proveedor', action: 'Confirmó despacho con placas NL-7832-A', type: 'confirmed' },
      { id: 't-85-3', occurredAt: '27 Ago 08:30', actor: 'Mesa de Tráfico', role: 'Recepción', action: 'Unidad en patio de maniobras lista para descarga', type: 'in_transit' },
    ],
  },
  // 3. Pendiente (Confirmada por proveedor)
  {
    id: 'oc-0084',
    folio: 'OC-2026-0084',
    supplierId: 'sup-nayt',
    supplierName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    supplierTradeName: 'Nayt México',
    supplierRfc: 'DEMO-NAYT-001',
    contactName: 'Laura Martínez',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '26 Ago 2026',
    expectedDeliveryDate: '28 Ago 2026',
    requisitionFolio: 'REQ-2026-0042',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 98000,
    tax: 15680,
    total: 113680,
    status: 'Confirmada por proveedor',
    notes: 'Reabastecimiento quincenal programado para descarga mañana a primera hora.',
    items: [
      { id: 'item-84-1', sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 0, pendingQuantity: 12, unit: 'Colchón', unitPrice: 4900, lastPrice: 4850, subtotal: 58800 },
      { id: 'item-84-2', sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 0, pendingQuantity: 8, unit: 'Colchón', unitPrice: 4200, lastPrice: 4150, subtotal: 33600 },
      { id: 'item-84-3', sku: 'SC-NAYT-FLOW-KS', name: 'Nayt Colchón Flow Basic White King Size', brand: 'Nayt', size: 'King Size', requestedQuantity: 1, orderedQuantity: 1, receivedQuantity: 0, pendingQuantity: 1, unit: 'Colchón', unitPrice: 5600, lastPrice: 5500, subtotal: 5600 },
    ],
    timeline: [
      { id: 't-84-1', occurredAt: '26 Ago 10:00', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-84-2', occurredAt: '26 Ago 14:00', actor: 'Nayt México', role: 'Proveedor', action: 'Confirmó entrega para 28 Ago', type: 'confirmed' },
    ],
  },
  // 4. Pendiente (Confirmada por proveedor)
  {
    id: 'oc-0087',
    folio: 'OC-2026-0087',
    supplierId: 'sup-tempur',
    supplierName: 'Tempur-Sealy International México (Demo)',
    supplierTradeName: 'Tempur-Pedic',
    supplierRfc: 'DEMO-TEM-008',
    contactName: 'Lic. Andrés Saldaña',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '27 Ago 2026',
    expectedDeliveryDate: '29 Ago 2026',
    requisitionFolio: 'REQ-2026-0045',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 125000,
    tax: 20000,
    total: 145000,
    status: 'Confirmada por proveedor',
    notes: 'Línea Premium LuxeAdapt para cobertura de pedidos especiales y showroom.',
    items: [
      { id: 'item-87-1', sku: 'SC-TEMP-LUX-KS', name: 'Tempur-Pedic LuxeAdapt Soft King Size', brand: 'Tempur-Pedic', size: 'King Size', requestedQuantity: 4, orderedQuantity: 4, receivedQuantity: 0, pendingQuantity: 4, unit: 'Colchón', unitPrice: 18500, lastPrice: 18200, subtotal: 74000 },
      { id: 'item-87-2', sku: 'SC-TEMP-LUX-QS', name: 'Tempur-Pedic LuxeAdapt Soft Queen Size', brand: 'Tempur-Pedic', size: 'Queen Size', requestedQuantity: 3, orderedQuantity: 3, receivedQuantity: 0, pendingQuantity: 3, unit: 'Colchón', unitPrice: 17000, lastPrice: 16800, subtotal: 51000 },
    ],
    timeline: [
      { id: 't-87-1', occurredAt: '27 Ago 09:15', actor: 'Laura Gómez', role: 'Comprador', action: 'Generó orden de gama alta', type: 'emitted' },
      { id: 't-87-2', occurredAt: '27 Ago 11:45', actor: 'Tempur México', role: 'Proveedor', action: 'Confirmó embarque', type: 'confirmed' },
    ],
  },
  // 5. Parcial (Parcialmente recibida)
  {
    id: 'oc-0079',
    folio: 'OC-2026-0079',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '21 Ago 2026',
    expectedDeliveryDate: '28 Ago 2026',
    requisitionFolio: 'REQ-2026-0035',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 58000,
    tax: 9280,
    total: 67280,
    status: 'Parcialmente recibida',
    notes: 'Recepción parcial de 10 colchones en Mesa de Verificación (REC-01). Restan 5 piezas.',
    items: [
      { id: 'item-79-1', sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', requestedQuantity: 15, orderedQuantity: 15, receivedQuantity: 10, pendingQuantity: 5, unit: 'Colchón', unitPrice: 3866.67, lastPrice: 3800, subtotal: 58000 },
    ],
    timeline: [
      { id: 't-79-1', occurredAt: '21 Ago 10:00', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió la Orden de Compra', type: 'emitted' },
      { id: 't-79-2', occurredAt: '22 Ago 11:30', actor: 'Restonic México', role: 'Proveedor', action: 'Confirmó entrega en dos entregas parciales', type: 'confirmed' },
      { id: 't-79-3', occurredAt: '26 Ago 14:15', actor: 'Carlos Medina', role: 'Mesa de Verificación', action: 'Registró recepción parcial de 10 unidades en REC-01 (Remisión #5512)', type: 'partially_received' },
    ],
  },
  // 6. Parcial (No serializado: Protectores y Almohadas)
  {
    id: 'oc-0089',
    folio: 'OC-2026-0089',
    supplierId: 'sup-protectores',
    supplierName: 'Protectores y Blancos Industriales S.A. (Demo)',
    supplierTradeName: 'Blancos del Norte',
    supplierRfc: 'DEMO-BLA-009',
    contactName: 'Lic. Fernando Garza',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '23 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0043',
    paymentCondition: 'Contado',
    creditDays: 0,
    currency: 'MXN',
    subtotal: 32000,
    tax: 5120,
    total: 37120,
    status: 'Parcialmente recibida',
    notes: 'Recepción por bulto/caja sin serialización unitaria. Se recibieron 25 almohadas y 20 protectores.',
    items: [
      { id: 'item-89-1', sku: 'SC-ALM-MEM-STD', name: 'Almohada Memory Foam Confort Estándar', brand: 'Nayt Confort', size: 'Estándar', requestedQuantity: 40, orderedQuantity: 40, receivedQuantity: 25, pendingQuantity: 15, unit: 'Caja (2 pzas)', unitPrice: 450, lastPrice: 440, subtotal: 18000 },
      { id: 'item-89-2', sku: 'SC-PROT-IMP-MAT', name: 'Protector Impermeable Respira Matrimonial', brand: 'Sognare Tech', size: 'Matrimonial', requestedQuantity: 30, orderedQuantity: 30, receivedQuantity: 20, pendingQuantity: 10, unit: 'Pieza', unitPrice: 466.67, lastPrice: 450, subtotal: 14000 },
    ],
    timeline: [
      { id: 't-89-1', occurredAt: '23 Ago 12:00', actor: 'Carlos Medina', role: 'Comprador', action: 'Emitió orden de accesorios', type: 'emitted' },
      { id: 't-89-2', occurredAt: '27 Ago 11:20', actor: 'Operador Mesa 01', role: 'Mesa de Verificación', action: 'Recepción por conteo ciego de 45 bultos en REC-01', type: 'partially_received' },
    ],
  },
  // 7. Completa (Recibida)
  {
    id: 'oc-0075',
    folio: 'OC-2026-0075',
    supplierId: 'sup-therapedic',
    supplierName: 'Therapedic International de México S.A. (Demo)',
    supplierTradeName: 'Therapedic México',
    supplierRfc: 'DEMO-THE-007',
    contactName: 'Ing. Daniel Cantú',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '14 Ago 2026',
    expectedDeliveryDate: '19 Ago 2026',
    requisitionFolio: 'REQ-2026-0028',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 51200,
    tax: 8192,
    total: 59392,
    status: 'Recibida',
    notes: 'Orden recibida en su totalidad en Mesa de Verificación y acomodada en Pasillo C.',
    items: [
      { id: 'item-75-1', sku: 'SC-THE-COM-IND', name: 'Therapedic Colchón Comfort Deluxe Individual', brand: 'Therapedic', size: 'Individual', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 12, pendingQuantity: 0, unit: 'Colchón', unitPrice: 4266.67, lastPrice: 4200, subtotal: 51200 },
    ],
    timeline: [
      { id: 't-75-1', occurredAt: '14 Ago 10:00', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió la Orden de Compra', type: 'emitted' },
      { id: 't-75-2', occurredAt: '19 Ago 09:40', actor: 'Carlos Medina', role: 'Mesa de Verificación', action: 'Completó la recepción y serialización de las 12 unidades (REC-2026-0072)', type: 'received' },
    ],
  },
  // 8. Completa (Recibida)
  {
    id: 'oc-0077',
    folio: 'OC-2026-0077',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '16 Ago 2026',
    expectedDeliveryDate: '22 Ago 2026',
    requisitionFolio: 'REQ-2026-0030',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 62000,
    tax: 9920,
    total: 71920,
    status: 'Recibida',
    notes: 'Recepción completa de 13 unidades sin discrepancias.',
    items: [
      { id: 'item-77-1', sku: 'SC-REST-ORTO-KS', name: 'Restonic Ortopédico Extra Firme King Size', brand: 'Restonic', size: 'King Size', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 6, pendingQuantity: 0, unit: 'Colchón', unitPrice: 5800, lastPrice: 5800, subtotal: 34800 },
      { id: 'item-77-2', sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', requestedQuantity: 7, orderedQuantity: 7, receivedQuantity: 7, pendingQuantity: 0, unit: 'Colchón', unitPrice: 3885.71, lastPrice: 3850, subtotal: 27200 },
    ],
    timeline: [
      { id: 't-77-1', occurredAt: '16 Ago 11:00', actor: 'Carlos Medina', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-77-2', occurredAt: '22 Ago 17:30', actor: 'Carlos Medina', role: 'Mesa de Verificación', action: 'Recepción total completada en REC-01', type: 'received' },
    ],
  },
  // 9. Con incidencia (Empaque dañado)
  {
    id: 'oc-0091',
    folio: 'OC-2026-0091',
    supplierId: 'sup-america',
    supplierName: 'Colchones América Industrial S.A. de C.V. (Demo)',
    supplierTradeName: 'Colchones América',
    supplierRfc: 'DEMO-AME-004',
    contactName: 'Lic. Héctor Morales',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '22 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0046',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 55000,
    tax: 8800,
    total: 63800,
    status: 'Parcialmente recibida',
    notes: 'Recepción con incidencia: 1 bulto reportado con empaque dañado y plástico rasgado en descarga (INC-2026-0041).',
    items: [
      { id: 'item-91-1', sku: 'SC-AME-MON-IND', name: 'América Colchón Monaco Individual', brand: 'América', size: 'Individual', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 7, pendingQuantity: 1, unit: 'Colchón', unitPrice: 3800, lastPrice: 3800, subtotal: 30400 },
      { id: 'item-91-2', sku: 'SC-AME-MON-MAT', name: 'América Colchón Monaco Matrimonial', brand: 'América', size: 'Matrimonial', requestedQuantity: 5, orderedQuantity: 5, receivedQuantity: 4, pendingQuantity: 1, unit: 'Colchón', unitPrice: 4920, lastPrice: 4900, subtotal: 24600 },
    ],
    timeline: [
      { id: 't-91-1', occurredAt: '22 Ago 14:00', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-91-2', occurredAt: '27 Ago 10:15', actor: 'Carlos Medina', role: 'Mesa de Verificación', action: 'Detectó rasgadura en empaque de bulto #8. Registró incidencia INC-2026-0041.', type: 'partially_received' },
    ],
  },
  // 10. Con incidencia (SKU incorrecto en tarima)
  {
    id: 'oc-0092',
    folio: 'OC-2026-0092',
    supplierId: 'sup-spring-air',
    supplierName: 'Spring Air de México S.A. de C.V.',
    supplierTradeName: 'Spring Air México',
    supplierRfc: 'DEMO-SPA-002',
    contactName: 'Ing. Valeria Treviño',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '24 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0047',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 62400,
    tax: 9984,
    total: 72384,
    status: 'Parcialmente recibida',
    notes: 'Recepción con incidencia: Proveedor envió 1 unidad incorrecta (SC-SPRI-PERF-MAT en lugar de SC-SPRI-PERF-IND) (INC-2026-0042).',
    items: [
      { id: 'item-92-1', sku: 'SC-SPRI-PERF-IND', name: 'Spring Air Performance Confort Individual', brand: 'Spring Air', size: 'Individual', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 10, pendingQuantity: 2, unit: 'Colchón', unitPrice: 5200, lastPrice: 5150, subtotal: 62400 },
    ],
    timeline: [
      { id: 't-92-1', occurredAt: '24 Ago 11:30', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-92-2', occurredAt: '27 Ago 12:40', actor: 'Carlos Medina', role: 'Mesa de Verificación', action: 'Reportó artículo no solicitado en tarima. Generó INC-2026-0042.', type: 'partially_received' },
    ],
  },
  // 11. Atrasada
  {
    id: 'oc-0074',
    folio: 'OC-2026-0074',
    supplierId: 'sup-spring-air',
    supplierName: 'Spring Air de México S.A. de C.V.',
    supplierTradeName: 'Spring Air México',
    supplierRfc: 'DEMO-SPA-002',
    contactName: 'Ing. Valeria Treviño',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '15 Ago 2026',
    expectedDeliveryDate: '24 Ago 2026',
    requisitionFolio: 'REQ-2026-0026',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 75000,
    tax: 12000,
    total: 87000,
    status: 'Atrasada',
    delayDays: 3,
    notes: 'Proveedor reportó retraso en línea de acolchado. Nueva fecha tentativa de entrega: 28 Ago.',
    items: [
      { id: 'item-74-1', sku: 'SC-SPRI-PERF-MAT', name: 'Spring Air Performance Confort Matrimonial', brand: 'Spring Air', size: 'Matrimonial', requestedQuantity: 10, orderedQuantity: 10, receivedQuantity: 0, pendingQuantity: 10, unit: 'Colchón', unitPrice: 7500, lastPrice: 7400, subtotal: 75000 },
    ],
    timeline: [
      { id: 't-74-1', occurredAt: '15 Ago 10:00', actor: 'Admin Demo', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-74-2', occurredAt: '25 Ago 09:00', actor: 'Sistema', role: 'Monitoreo', action: 'Marcó orden como Atrasada (3 días de retraso)', type: 'delayed' },
    ],
  },
  // 12. Atrasada
  {
    id: 'oc-0073',
    folio: 'OC-2026-0073',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-norte',
    targetWarehouseName: 'CEDIS Monterrey Norte',
    targetWarehouseType: 'CEDIS',
    emissionDate: '16 Ago 2026',
    expectedDeliveryDate: '25 Ago 2026',
    requisitionFolio: 'REQ-2026-0027',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 54000,
    tax: 8640,
    total: 62640,
    status: 'Atrasada',
    delayDays: 2,
    notes: 'Transportista tuvo falla mecánica en trayecto Guadalajara-Monterrey.',
    items: [
      { id: 'item-73-1', sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', requestedQuantity: 14, orderedQuantity: 14, receivedQuantity: 0, pendingQuantity: 14, unit: 'Colchón', unitPrice: 3857.14, lastPrice: 3850, subtotal: 54000 },
    ],
    timeline: [
      { id: 't-73-1', occurredAt: '16 Ago 14:00', actor: 'Carlos Medina', role: 'Comprador', action: 'Emitió orden', type: 'emitted' },
      { id: 't-73-2', occurredAt: '26 Ago 09:00', actor: 'Sistema', role: 'Monitoreo', action: 'Marcó como atrasada', type: 'delayed' },
    ],
  },

  // ==========================================
  // CEDIS MONTERREY SUR
  // ==========================================
  // 13. En recepción (En tránsito)
  {
    id: 'oc-0083',
    folio: 'OC-2026-0083',
    supplierId: 'sup-spring-air',
    supplierName: 'Spring Air de México S.A. de C.V.',
    supplierTradeName: 'Spring Air México',
    supplierRfc: 'DEMO-SPA-002',
    contactName: 'Ing. Valeria Treviño',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '24 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0039',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 98000,
    tax: 15680,
    total: 113680,
    status: 'En tránsito',
    notes: 'Descarga en rampa REC-02 CEDIS Sur. Placas NL-4412-C.',
    items: [
      { id: 'item-83s-1', sku: 'SC-SPA-REC-IND', name: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', requestedQuantity: 14, orderedQuantity: 14, receivedQuantity: 0, pendingQuantity: 14, unit: 'Colchón', unitPrice: 3500, lastPrice: 3450, subtotal: 49000 },
      { id: 'item-83s-2', sku: 'SC-SPA-REC-MAT', name: 'Spring Air Colchón Record Matrimonial', brand: 'Spring Air', size: 'Matrimonial', requestedQuantity: 10, orderedQuantity: 10, receivedQuantity: 0, pendingQuantity: 10, unit: 'Colchón', unitPrice: 4900, lastPrice: 4850, subtotal: 49000 },
    ],
    timeline: [
      { id: 't-83s-1', occurredAt: '24 Ago 10:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-83s-2', occurredAt: '27 Ago 09:00', actor: 'Mesa de Tráfico Sur', role: 'Recepción', action: 'Unidad en rampa REC-02 iniciando descarga', type: 'in_transit' },
    ],
  },
  // 14. En recepción (En tránsito)
  {
    id: 'oc-0086',
    folio: 'OC-2026-0086',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '25 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0044',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 68000,
    tax: 10880,
    total: 78880,
    status: 'En tránsito',
    notes: 'Descarga activa en andén REC-02.',
    items: [
      { id: 'item-86-1', sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 0, pendingQuantity: 8, unit: 'Colchón', unitPrice: 4250, lastPrice: 4200, subtotal: 34000 },
      { id: 'item-86-2', sku: 'SC-REST-ORTO-IND', name: 'Restonic Ortopédico Extra Firme Individual', brand: 'Restonic', size: 'Individual', requestedQuantity: 10, orderedQuantity: 10, receivedQuantity: 0, pendingQuantity: 10, unit: 'Colchón', unitPrice: 3400, lastPrice: 3350, subtotal: 34000 },
    ],
    timeline: [
      { id: 't-86-1', occurredAt: '25 Ago 11:30', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-86-2', occurredAt: '27 Ago 08:45', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Tractocamión posicionado en andén REC-02', type: 'in_transit' },
    ],
  },
  // 15. Pendiente
  {
    id: 'oc-0093',
    folio: 'OC-2026-0093',
    supplierId: 'sup-sealy',
    supplierName: 'Sealy Corporation México S.A. de C.V. (Demo)',
    supplierTradeName: 'Sealy México',
    supplierRfc: 'DEMO-SEA-005',
    contactName: 'Lic. Mariana Villarreal',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '26 Ago 2026',
    expectedDeliveryDate: '28 Ago 2026',
    requisitionFolio: 'REQ-2026-0048',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 89000,
    tax: 14240,
    total: 103240,
    status: 'Confirmada por proveedor',
    notes: 'Programado para entrega mañana turno matutino.',
    items: [
      { id: 'item-93-1', sku: 'SC-SEAL-POST-QS', name: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', size: 'Queen Size', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 0, pendingQuantity: 6, unit: 'Colchón', unitPrice: 7500, lastPrice: 7500, subtotal: 45000 },
      { id: 'item-93-2', sku: 'SC-SEAL-POST-KS', name: 'Sealy Posturepedic Crown Jewel King Size', brand: 'Sealy', size: 'King Size', requestedQuantity: 4, orderedQuantity: 4, receivedQuantity: 0, pendingQuantity: 4, unit: 'Colchón', unitPrice: 11000, lastPrice: 11000, subtotal: 44000 },
    ],
    timeline: [
      { id: 't-93-1', occurredAt: '26 Ago 10:30', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-93-2', occurredAt: '26 Ago 15:00', actor: 'Sealy México', role: 'Proveedor', action: 'Confirmó entrega para 28 Ago', type: 'confirmed' },
    ],
  },
  // 16. Pendiente
  {
    id: 'oc-0094',
    folio: 'OC-2026-0094',
    supplierId: 'sup-nayt',
    supplierName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    supplierTradeName: 'Nayt México',
    supplierRfc: 'DEMO-NAYT-001',
    contactName: 'Laura Martínez',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '27 Ago 2026',
    expectedDeliveryDate: '29 Ago 2026',
    requisitionFolio: 'REQ-2026-0049',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 58000,
    tax: 9280,
    total: 67280,
    status: 'Confirmada por proveedor',
    notes: 'Reabastecimiento de modelos King Size para zona sur.',
    items: [
      { id: 'item-94-1', sku: 'SC-NAYT-FLOW-KS', name: 'Nayt Colchón Flow Basic White King Size', brand: 'Nayt', size: 'King Size', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 0, pendingQuantity: 8, unit: 'Colchón', unitPrice: 7250, lastPrice: 7200, subtotal: 58000 },
    ],
    timeline: [
      { id: 't-94-1', occurredAt: '27 Ago 09:45', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
    ],
  },
  // 17. Parcial
  {
    id: 'oc-0080',
    folio: 'OC-2026-0080',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '20 Ago 2026',
    expectedDeliveryDate: '26 Ago 2026',
    requisitionFolio: 'REQ-2026-0034',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 51000,
    tax: 8160,
    total: 59160,
    status: 'Parcialmente recibida',
    notes: 'Entregadas 8 de 12 unidades en REC-02. Restan 4 colchones por recibir.',
    items: [
      { id: 'item-80-1', sku: 'SC-REST-ORTO-MAT', name: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 8, pendingQuantity: 4, unit: 'Colchón', unitPrice: 4250, lastPrice: 4200, subtotal: 51000 },
    ],
    timeline: [
      { id: 't-80-1', occurredAt: '20 Ago 10:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-80-2', occurredAt: '26 Ago 15:30', actor: 'Valeria Torres', role: 'Mesa de Verificación', action: 'Recepción parcial de 8 piezas', type: 'partially_received' },
    ],
  },
  // 18. Parcial
  {
    id: 'oc-0095',
    folio: 'OC-2026-0095',
    supplierId: 'sup-america',
    supplierName: 'Colchones América Industrial S.A. de C.V. (Demo)',
    supplierTradeName: 'Colchones América',
    supplierRfc: 'DEMO-AME-004',
    contactName: 'Lic. Héctor Morales',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '23 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0050',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 49200,
    tax: 7872,
    total: 57072,
    status: 'Parcialmente recibida',
    notes: 'Recibidas 5 de 10 unidades. Segundo viaje programado para la tarde.',
    items: [
      { id: 'item-95-1', sku: 'SC-AME-MON-MAT', name: 'América Colchón Monaco Matrimonial', brand: 'América', size: 'Matrimonial', requestedQuantity: 10, orderedQuantity: 10, receivedQuantity: 5, pendingQuantity: 5, unit: 'Colchón', unitPrice: 4920, lastPrice: 4900, subtotal: 49200 },
    ],
    timeline: [
      { id: 't-95-1', occurredAt: '23 Ago 12:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-95-2', occurredAt: '27 Ago 11:00', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Primer viaje descargado (5 piezas)', type: 'partially_received' },
    ],
  },
  // 19. Completa
  {
    id: 'oc-0072',
    folio: 'OC-2026-0072',
    supplierId: 'sup-spring-air',
    supplierName: 'Spring Air de México S.A. de C.V.',
    supplierTradeName: 'Spring Air México',
    supplierRfc: 'DEMO-SPA-002',
    contactName: 'Ing. Valeria Treviño',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '15 Ago 2026',
    expectedDeliveryDate: '21 Ago 2026',
    requisitionFolio: 'REQ-2026-0025',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 66000,
    tax: 10560,
    total: 76560,
    status: 'Recibida',
    notes: 'Recepción 100% completada y unidades acomodadas en racks de CEDIS Sur.',
    items: [
      { id: 'item-72-1', sku: 'SC-SPA-REC-KS', name: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 6, pendingQuantity: 0, unit: 'Colchón', unitPrice: 6500, lastPrice: 6450, subtotal: 39000 },
      { id: 'item-72-2', sku: 'SC-SPA-REC-QS', name: 'Spring Air Colchón Record Queen Size', brand: 'Spring Air', size: 'Queen Size', requestedQuantity: 5, orderedQuantity: 5, receivedQuantity: 5, pendingQuantity: 0, unit: 'Colchón', unitPrice: 5400, lastPrice: 5350, subtotal: 27000 },
    ],
    timeline: [
      { id: 't-72-1', occurredAt: '15 Ago 10:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-72-2', occurredAt: '21 Ago 16:30', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Descarga y validación serial completada en REC-02', type: 'received' },
    ],
  },
  // 20. Completa
  {
    id: 'oc-0071',
    folio: 'OC-2026-0071',
    supplierId: 'sup-nayt',
    supplierName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    supplierTradeName: 'Nayt México',
    supplierRfc: 'DEMO-NAYT-001',
    contactName: 'Laura Martínez',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '14 Ago 2026',
    expectedDeliveryDate: '20 Ago 2026',
    requisitionFolio: 'REQ-2026-0024',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 50400,
    tax: 8064,
    total: 58464,
    status: 'Recibida',
    notes: 'Recepción completa sin incidencias.',
    items: [
      { id: 'item-71-1', sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 12, pendingQuantity: 0, unit: 'Colchón', unitPrice: 4200, lastPrice: 4200, subtotal: 50400 },
    ],
    timeline: [
      { id: 't-71-1', occurredAt: '14 Ago 11:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-71-2', occurredAt: '20 Ago 15:00', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Recepción completada', type: 'received' },
    ],
  },
  // 21. Con incidencia (QR ilegible)
  {
    id: 'oc-0096',
    folio: 'OC-2026-0096',
    supplierId: 'sup-restonic',
    supplierName: 'Fábricas de Colchones Restonic de México S.A. (Demo)',
    supplierTradeName: 'Restonic México',
    supplierRfc: 'DEMO-RES-003',
    contactName: 'C.P. Mauricio Elizondo',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '23 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0051',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 46400,
    tax: 7424,
    total: 53824,
    status: 'Parcialmente recibida',
    notes: 'Recepción con incidencia: 1 etiqueta con QR ilegible por roce de tarima (INC-2026-0043). Se envió a Reimpresión.',
    items: [
      { id: 'item-96-1', sku: 'SC-REST-ORTO-KS', name: 'Restonic Ortopédico Extra Firme King Size', brand: 'Restonic', size: 'King Size', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 7, pendingQuantity: 1, unit: 'Colchón', unitPrice: 5800, lastPrice: 5800, subtotal: 46400 },
    ],
    timeline: [
      { id: 't-96-1', occurredAt: '23 Ago 14:30', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-96-2', occurredAt: '27 Ago 10:00', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Reportó QR ilegible en bulto #4. Generó INC-2026-0043.', type: 'partially_received' },
    ],
  },
  // 22. Con incidencia (Daño operativo en descarga)
  {
    id: 'oc-0097',
    folio: 'OC-2026-0097',
    supplierId: 'sup-sealy',
    supplierName: 'Sealy Corporation México S.A. de C.V. (Demo)',
    supplierTradeName: 'Sealy México',
    supplierRfc: 'DEMO-SEA-005',
    contactName: 'Lic. Mariana Villarreal',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '24 Ago 2026',
    expectedDeliveryDate: '27 Ago 2026',
    requisitionFolio: 'REQ-2026-0052',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 44000,
    tax: 7040,
    total: 51040,
    status: 'Parcialmente recibida',
    notes: 'Recepción con incidencia: Daño operativo al deslizar bulto en rampa de descarga (INC-2026-0044).',
    items: [
      { id: 'item-97-1', sku: 'SC-SEAL-POST-KS', name: 'Sealy Posturepedic Crown Jewel King Size', brand: 'Sealy', size: 'King Size', requestedQuantity: 4, orderedQuantity: 4, receivedQuantity: 3, pendingQuantity: 1, unit: 'Colchón', unitPrice: 11000, lastPrice: 11000, subtotal: 44000 },
    ],
    timeline: [
      { id: 't-97-1', occurredAt: '24 Ago 16:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-97-2', occurredAt: '27 Ago 11:45', actor: 'Operador Mesa 02', role: 'Recepción', action: 'Registró daño operativo. Generó INC-2026-0044.', type: 'partially_received' },
    ],
  },
  // 23. Atrasada
  {
    id: 'oc-0078',
    folio: 'OC-2026-0078',
    supplierId: 'sup-spring-air',
    supplierName: 'Spring Air de México S.A. de C.V.',
    supplierTradeName: 'Spring Air México',
    supplierRfc: 'DEMO-SPA-002',
    contactName: 'Ing. Valeria Treviño',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '18 Ago 2026',
    expectedDeliveryDate: '25 Ago 2026',
    requisitionFolio: 'REQ-2026-0032',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    subtotal: 112000,
    tax: 17920,
    total: 129920,
    status: 'Atrasada',
    delayDays: 2,
    notes: 'Proveedor reportó demora en fabricación de lotes ortopédicos. Se contactó a ejecutiva comercial.',
    items: [
      { id: 'item-78-1', sku: 'SC-SPA-POST-KS', name: 'Spring Air Colchón Posture Comfort King Size', brand: 'Spring Air', size: 'King Size', requestedQuantity: 12, orderedQuantity: 12, receivedQuantity: 0, pendingQuantity: 12, unit: 'Colchón', unitPrice: 6500, lastPrice: 6400, subtotal: 78000 },
      { id: 'item-78-2', sku: 'SC-SPA-POST-QS', name: 'Spring Air Colchón Posture Comfort Queen Size', brand: 'Spring Air', size: 'Queen Size', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 0, pendingQuantity: 6, unit: 'Colchón', unitPrice: 5666.67, lastPrice: 5600, subtotal: 34000 },
    ],
    timeline: [
      { id: 't-78-1', occurredAt: '18 Ago 11:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-78-2', occurredAt: '19 Ago 09:00', actor: 'Spring Air México', role: 'Proveedor', action: 'Confirmó entrega 25 Ago', type: 'confirmed' },
      { id: 't-78-3', occurredAt: '26 Ago 09:00', actor: 'Sistema', role: 'Monitoreo', action: 'Marcó como Atrasada (2 días)', type: 'delayed' },
    ],
  },
  // 24. Atrasada
  {
    id: 'oc-0076',
    folio: 'OC-2026-0076',
    supplierId: 'sup-nayt',
    supplierName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    supplierTradeName: 'Nayt México',
    supplierRfc: 'DEMO-NAYT-001',
    contactName: 'Laura Martínez',
    targetWarehouseId: 'wh-mty-sur',
    targetWarehouseName: 'CEDIS Monterrey Sur',
    targetWarehouseType: 'CEDIS',
    emissionDate: '19 Ago 2026',
    expectedDeliveryDate: '26 Ago 2026',
    requisitionFolio: 'REQ-2026-0033',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    subtotal: 63000,
    tax: 10080,
    total: 73080,
    status: 'Atrasada',
    delayDays: 1,
    notes: 'Retraso de 24 h en despacho desde planta Saltillo.',
    items: [
      { id: 'item-76-1', sku: 'SC-NAYT-FLOW-IND', name: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', requestedQuantity: 8, orderedQuantity: 8, receivedQuantity: 0, pendingQuantity: 8, unit: 'Colchón', unitPrice: 4200, lastPrice: 4150, subtotal: 33600 },
      { id: 'item-76-2', sku: 'SC-NAYT-FLOW-MAT', name: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', requestedQuantity: 6, orderedQuantity: 6, receivedQuantity: 0, pendingQuantity: 6, unit: 'Colchón', unitPrice: 4900, lastPrice: 4850, subtotal: 29400 },
    ],
    timeline: [
      { id: 't-76-1', occurredAt: '19 Ago 12:00', actor: 'Valeria Torres', role: 'Comprador Sur', action: 'Emitió orden', type: 'emitted' },
      { id: 't-76-2', occurredAt: '27 Ago 09:00', actor: 'Sistema', role: 'Monitoreo', action: 'Marcó como atrasada (1 día)', type: 'delayed' },
    ],
  },
];
