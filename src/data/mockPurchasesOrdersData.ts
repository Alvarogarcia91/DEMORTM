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
  folio: string;
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
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  iva?: number;
  total: number;
  status: PurchaseOrderStatus;
  delayDays?: number;
  cancellationReason?: string;
  carrier?: string;
  trackingNumber?: string;
  inboundFolio?: string;
  notes?: string;
  supplierNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: PurchaseOrderTimelineEntry[];
}

export const INITIAL_MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  // 1. CASO PARCIALMENTE RECIBIDA: OC-RTM-2026-0088 (Sun Chemical - 16 pedidas, 12 recibidas, 4 pendientes)
  {
    id: 'oc-rtm-0088',
    folio: 'OC-RTM-2026-0088',
    supplierId: 'sup-sunchem',
    supplierName: 'Sun Chemical México S.A. de C.V.',
    supplierTradeName: 'Sun Chemical México',
    supplierRfc: 'SCM920415TY9',
    contactName: 'Ing. Fernando Valdés',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '24 Ago 2026',
    expectedDeliveryDate: '30 Ago 2026',
    requisitionFolio: 'REQ-2026-016',
    requisitionId: 'req-016',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    status: 'Parcialmente recibida',
    carrier: 'Transportes Industriales del Norte',
    trackingNumber: 'TRN-8841-SC',
    inboundFolio: 'REC-2026-0188',
    notes: 'Recepción parcial en Mesa de Verificación: 12 cubetas recibidas con sello y certificado QA; 4 cubetas pendientes por reprogramación de lote del proveedor.',
    supplierNotes: 'Entrega en dos fases convenida con compras.',
    createdAt: '24 Ago 2026',
    updatedAt: '30 Ago 2026',
    items: [
      {
        id: 'oc-it-88-01',
        sku: 'MP-VAR-UV',
        name: 'Barniz UV Ultra Brillo Curado Rápido',
        brand: 'Sun Chemical',
        size: 'Cubeta 20 kg',
        requestedQuantity: 16,
        orderedQuantity: 16,
        receivedQuantity: 12,
        pendingQuantity: 4,
        unit: 'cubeta',
        unitPrice: 1850.00,
        lastPrice: 1780.00,
        subtotal: 29600.00,
      },
    ],
    subtotal: 29600.00,
    tax: 4736.00,
    iva: 4736.00,
    total: 34336.00,
    timeline: [
      {
        id: 'tl-88-01',
        occurredAt: '24 Ago 09:00',
        actor: 'Lic. Roberto Morales',
        role: 'Comprador Senior',
        action: 'Orden Emitida',
        comment: 'OC generada desde Requisición REQ-2026-016.',
        type: 'emitted',
      },
      {
        id: 'tl-88-02',
        occurredAt: '30 Ago 11:30',
        actor: 'operador_recibo',
        role: 'Mesa de Verificación',
        action: 'Recepción Parcial (12/16)',
        comment: '12 cubetas recibidas, muestreadas por QA y acomodadas en TNT-C-05. Pendientes 4 cubetas.',
        type: 'partially_received',
      },
    ],
  },

  // 2. CASO EN TRÁNSITO / VINCULADO A PED-RTM-2026-0142: OC-RTM-2026-0089 (Bio-Pappel - 4 tarimas Couché 90g)
  {
    id: 'oc-rtm-0089',
    folio: 'OC-RTM-2026-0089',
    supplierId: 'sup-biopappel',
    supplierName: 'Bio-Pappel S.A.B. de C.V.',
    supplierTradeName: 'Bio-Pappel',
    supplierRfc: 'BPA820618MN4',
    contactName: 'Lic. Marcela Treviño',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '28 Ago 2026',
    expectedDeliveryDate: '10 Sep 2026',
    requisitionFolio: 'REQ-2026-018',
    requisitionId: 'req-018',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    status: 'En tránsito',
    carrier: 'Líneas de Carga Monterrey',
    trackingNumber: 'LCM-BIO-9921',
    notes: 'Insumo crítico para completar tiraje de 25,000 manuales instructivos (PED-RTM-2026-0142 / Stanley Black & Decker). Tarimas flejadas con película stretch y testigo de humedad.',
    supplierNotes: 'Embarque confirmado desde planta Escobedo para entrega 10 Sep.',
    createdAt: '28 Ago 2026',
    updatedAt: '01 Sep 2026',
    items: [
      {
        id: 'oc-it-89-01',
        sku: 'MP-COU-090',
        name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
        brand: 'Bio-Pappel',
        size: 'Tarima 18,000 pliegos',
        requestedQuantity: 4,
        orderedQuantity: 4,
        receivedQuantity: 0,
        pendingQuantity: 4,
        unit: 'tarima',
        unitPrice: 18000.00,
        lastPrice: 17500.00,
        subtotal: 72000.00,
      },
    ],
    subtotal: 72000.00,
    tax: 11520.00,
    iva: 11520.00,
    total: 83520.00,
    timeline: [
      {
        id: 'tl-89-01',
        occurredAt: '28 Ago 14:00',
        actor: 'Lic. Roberto Morales',
        role: 'Comprador Senior',
        action: 'Orden Emitida',
        comment: 'Asignada a Bio-Pappel por requerimiento urgente de producción.',
        type: 'emitted',
      },
      {
        id: 'tl-89-02',
        occurredAt: '01 Sep 10:00',
        actor: 'Lic. Marcela Treviño',
        role: 'Proveedor Bio-Pappel',
        action: 'Confirmación y Envío',
        comment: 'Embarque programado en tránsito con entrega estimada 10 Sep.',
        type: 'in_transit',
      },
    ],
  },

  // 3. CASO RECIBIDA TOTAL: OC-RTM-2026-0090 (Copamex - 2 tarimas Bond 75g)
  {
    id: 'oc-rtm-0090',
    folio: 'OC-RTM-2026-0090',
    supplierId: 'sup-copamex',
    supplierName: 'Copamex Industrias S.A. de C.V.',
    supplierTradeName: 'Copamex',
    supplierRfc: 'CIN780911KL2',
    contactName: 'Ing. Rodrigo Salinas',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '20 Ago 2026',
    expectedDeliveryDate: '26 Ago 2026',
    requisitionFolio: 'REQ-2026-015',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    status: 'Recibida',
    carrier: 'Fletes y Maniobras Express',
    trackingNumber: 'FME-COP-4410',
    inboundFolio: 'REC-2026-0175',
    notes: '2 tarimas de papel Bond 75 g pliegos 61x90 cm recibidas conformes y acomodadas en posición PAP-A-02.',
    createdAt: '20 Ago 2026',
    updatedAt: '26 Ago 2026',
    items: [
      {
        id: 'oc-it-90-01',
        sku: 'MP-BND-075',
        name: 'Papel Bond 75 g (Pliegos 61x90 cm)',
        brand: 'Copamex',
        size: 'Tarima 20,000 pliegos',
        requestedQuantity: 2,
        orderedQuantity: 2,
        receivedQuantity: 2,
        pendingQuantity: 0,
        unit: 'tarima',
        unitPrice: 16500.00,
        lastPrice: 15900.00,
        subtotal: 33000.00,
      },
    ],
    subtotal: 33000.00,
    tax: 5280.00,
    iva: 5280.00,
    total: 38280.00,
    timeline: [],
  },

  // 4. CASO EMITIDA: OC-RTM-2026-0087 (Avery Dennison / Fasson - BOPP Blanco)
  {
    id: 'oc-rtm-0087',
    folio: 'OC-RTM-2026-0087',
    supplierId: 'sup-fasson',
    supplierName: 'Avery Dennison México S. de R.L. de C.V.',
    supplierTradeName: 'Fasson Avery Dennison',
    supplierRfc: 'FAS910320AB1',
    contactName: 'Lic. Laura Elizondo',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '31 Ago 2026',
    expectedDeliveryDate: '08 Sep 2026',
    requisitionFolio: 'REQ-2026-019',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    status: 'Emitida',
    notes: '10 bobinas de BOPP blanco 60 mic para tirajes continuos de flexografía farmacéutica.',
    createdAt: '31 Ago 2026',
    updatedAt: '31 Ago 2026',
    items: [
      {
        id: 'oc-it-87-01',
        sku: 'MP-BOP-WHT',
        name: 'Sustrato BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 2,500 m',
        requestedQuantity: 10,
        orderedQuantity: 10,
        receivedQuantity: 0,
        pendingQuantity: 10,
        unit: 'bobina',
        unitPrice: 6200.00,
        lastPrice: 6000.00,
        subtotal: 62000.00,
      },
    ],
    subtotal: 62000.00,
    tax: 9920.00,
    iva: 9920.00,
    total: 71920.00,
    timeline: [],
  },

  // 5. CASO CONFIRMADA: OC-RTM-2026-0086 (WestRock - Cartulina SBS 240g)
  {
    id: 'oc-rtm-0086',
    folio: 'OC-RTM-2026-0086',
    supplierId: 'sup-westrock',
    supplierName: 'WestRock Empaques México S.A. de C.V.',
    supplierTradeName: 'WestRock México',
    supplierRfc: 'WRM850722PQ8',
    contactName: 'Ing. Javier Cantú',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '27 Ago 2026',
    expectedDeliveryDate: '06 Sep 2026',
    requisitionFolio: 'REQ-2026-017',
    paymentCondition: 'Crédito',
    creditDays: 45,
    currency: 'MXN',
    status: 'Confirmada por proveedor',
    notes: '3 tarimas de cartulina SBS para pedidos de blister card.',
    createdAt: '27 Ago 2026',
    updatedAt: '28 Ago 2026',
    items: [
      {
        id: 'oc-it-86-01',
        sku: 'MP-SBS-240',
        name: 'Cartulina Sulfatada SBS 240 g / 14 pts',
        brand: 'WestRock',
        size: 'Tarima 8,000 pliegos',
        requestedQuantity: 3,
        orderedQuantity: 3,
        receivedQuantity: 0,
        pendingQuantity: 3,
        unit: 'tarima',
        unitPrice: 22000.00,
        lastPrice: 21500.00,
        subtotal: 66000.00,
      },
    ],
    subtotal: 66000.00,
    tax: 10560.00,
    iva: 10560.00,
    total: 76560.00,
    timeline: [],
  },

  // 6. CASO ATRASADA: OC-RTM-2026-0085 (Siegwerk - Tinta Pantone PMS 186 C)
  {
    id: 'oc-rtm-0085',
    folio: 'OC-RTM-2026-0085',
    supplierId: 'sup-siegwerk',
    supplierName: 'Siegwerk México S.A. de C.V.',
    supplierTradeName: 'Siegwerk',
    supplierRfc: 'SME990115LK9',
    contactName: 'Lic. Adriana Benavides',
    targetWarehouseId: 'wh-alm-rtm',
    targetWarehouseName: 'Almacén Principal RTM',
    targetWarehouseType: 'CEDIS',
    emissionDate: '15 Ago 2026',
    expectedDeliveryDate: '25 Ago 2026',
    paymentCondition: 'Crédito',
    creditDays: 30,
    currency: 'MXN',
    status: 'Atrasada',
    delayDays: 4,
    notes: 'Retraso de pigmento especial importado en aduana de Laredo. Proveedor notificó entrega reprogramada para 05 Sep.',
    createdAt: '15 Ago 2026',
    updatedAt: '26 Ago 2026',
    items: [
      {
        id: 'oc-it-85-01',
        sku: 'MP-INK-186',
        name: 'Tinta Especial Pantone PMS 186 C',
        brand: 'Siegwerk',
        size: 'Cubeta 10 kg',
        requestedQuantity: 8,
        orderedQuantity: 8,
        receivedQuantity: 0,
        pendingQuantity: 8,
        unit: 'cubeta',
        unitPrice: 2400.00,
        lastPrice: 2300.00,
        subtotal: 19200.00,
      },
    ],
    subtotal: 19200.00,
    tax: 3072.00,
    iva: 3072.00,
    total: 22272.00,
    timeline: [],
  },
];

// Compatibility exports
export const MOCK_SUPPLIERS: SupplierInfo[] = INITIAL_MOCK_SUPPLIERS.map((s) => ({
  id: s.id,
  name: s.tradeName || s.legalName,
  tradeName: s.tradeName,
  rfc: s.rfc,
  contactName: s.contacts[0]?.name || 'Contacto Comercial',
  contactPhone: s.contacts[0]?.phone || '(81) 8000-0000',
  contactEmail: s.contacts[0]?.email || 'contacto@proveedor.com',
  paymentCondition: s.paymentCondition,
  creditDays: s.creditDays,
  leadTimeDays: s.leadTimeDays || s.estimatedLeadDays || 5,
  currency: s.preferredCurrency,
  associatedBrands: s.associatedBrands || [],
}));

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
  const unitPrice = 1200 + (hash % 20) * 100;
  return {
    unitPrice,
    lastPrice: Math.round(unitPrice * 0.95),
    priceVariationPercent: 5.0,
    priceListName: 'Precio base catálogo',
    hasActivePriceList: false,
  };
}
