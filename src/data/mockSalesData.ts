import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';

// ============================================================================
// 1. TARIFAS Y CONVENIOS COMERCIALES INDUSTRIALES (SALES PRICE LISTS)
// ============================================================================
export interface SalesPriceTier {
  minQty: number;
  maxQty?: number;
  price: number;
}

export interface SalesPriceListItem {
  sku: string;
  partNumber?: string;
  productName?: string;
  listPrice: number;
  volumeTiers?: SalesPriceTier[];
}

export interface SalesPriceList {
  id: string;
  code: string;
  name: string;
  currency: 'MXN' | 'USD';
  validFrom: string;
  validTo: string;
  status: 'Vigente' | 'Programada' | 'Vencida' | 'Inactiva';
  description: string;
  targetType: 'General' | 'Sucursal' | 'Convenio' | 'Promoción';
  branchApplicability?: string[];
  items: SalesPriceListItem[];
}

export const INITIAL_MOCK_SALES_PRICE_LISTS: SalesPriceList[] = [
  {
    id: 'pl-ind-sbd-2026',
    code: 'TAR-IND-2026',
    name: 'Tarifa Corporativa Industrial B2B 2026',
    currency: 'MXN',
    validFrom: '01 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Tarifa preferencial para cuentas industriales de manufactura, empaque y maquila gráfica.',
    targetType: 'Convenio',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas (Rev B)',
        listPrice: 2.85,
        volumeTiers: [
          { minQty: 10000, maxQty: 24999, price: 2.85 },
          { minQty: 25000, maxQty: 49999, price: 2.70 },
          { minQty: 50000, price: 2.55 },
        ],
      },
      {
        sku: 'BD-MAN-048',
        partNumber: 'BD-MAN-048',
        productName: 'Manual instructivo 48 páginas (Rev A)',
        listPrice: 4.20,
        volumeTiers: [
          { minQty: 10000, maxQty: 24999, price: 4.20 },
          { minQty: 25000, price: 3.95 },
        ],
      },
      {
        sku: 'BLI-CRD-001',
        partNumber: 'BLI-CRD-001',
        productName: 'Blister Card Termosellable (Rev C)',
        listPrice: 1.45,
        volumeTiers: [
          { minQty: 20000, maxQty: 39999, price: 1.45 },
          { minQty: 40000, price: 1.35 },
        ],
      },
      {
        sku: 'PT-ETQ-001',
        partNumber: 'PT-ETQ-001',
        productName: 'Etiqueta Autoadherible 4x6" en Rollo',
        listPrice: 0.92,
        volumeTiers: [
          { minQty: 20000, maxQty: 49999, price: 0.92 },
          { minQty: 50000, price: 0.85 },
        ],
      },
      {
        sku: 'TAG-IMP-002',
        partNumber: 'TAG-IMP-002',
        productName: 'Tag Colgante con Barniz UV',
        listPrice: 1.15,
        volumeTiers: [
          { minQty: 10000, maxQty: 29999, price: 1.15 },
          { minQty: 30000, price: 1.05 },
        ],
      },
    ],
  },
  {
    id: 'pl-farmaceutica-2026',
    code: 'TAR-FAR-2026',
    name: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    currency: 'MXN',
    validFrom: '01 Feb 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Tarifa grado farmacéutico con especificación estricta de sustratos, trazabilidad y control AQL.',
    targetType: 'Convenio',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'PT-ETQ-001',
        partNumber: 'PT-ETQ-001',
        productName: 'Etiqueta Autoadherible 4x6" en Rollo',
        listPrice: 0.92,
        volumeTiers: [
          { minQty: 25000, maxQty: 49999, price: 0.92 },
          { minQty: 50000, price: 0.88 },
        ],
      },
      {
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas (Rev B)',
        listPrice: 2.95,
      },
    ],
  },
  {
    id: 'pl-flexo-2026',
    code: 'TAR-FLX-2026',
    name: 'Tarifa General Flexografía & Bobina 2026',
    currency: 'MXN',
    validFrom: '01 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Precios base por millar para rollos de etiquetas autoadheribles, BOPP y películas impresas.',
    targetType: 'General',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'PT-ETQ-001',
        partNumber: 'PT-ETQ-001',
        productName: 'Etiqueta Autoadherible 4x6" en Rollo',
        listPrice: 0.98,
      },
      {
        sku: 'TAG-IMP-002',
        partNumber: 'TAG-IMP-002',
        productName: 'Tag Colgante con Barniz UV',
        listPrice: 1.20,
      },
    ],
  },
  {
    id: 'pl-usd-export-2026',
    code: 'TAR-EXP-2026',
    name: 'Tarifa Maquila Industrial USD 2026',
    currency: 'USD',
    validFrom: '01 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Tarifa en dólares americanos para cuentas corporativas transfronterizas y maquila.',
    targetType: 'Convenio',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas (Rev B)',
        listPrice: 0.15,
      },
      {
        sku: 'BD-MAN-048',
        partNumber: 'BD-MAN-048',
        productName: 'Manual instructivo 48 páginas (Rev A)',
        listPrice: 0.22,
      },
    ],
  },
];

export const getPriceFromList = (
  priceList: SalesPriceList,
  sku: string,
  quantity: number = 1
): { listPrice: number; suggestedPrice: number; hasTier: boolean } => {
  const item = priceList.items.find((i) => i.sku === sku);
  if (!item) {
    const master = MOCK_MASTER_ARTICLES.find((a) => a.sku === sku);
    const fallbackPrice = master?.commercial.referenceListPrice || 2.85;
    return { listPrice: fallbackPrice, suggestedPrice: fallbackPrice, hasTier: false };
  }

  let suggestedPrice = item.listPrice;
  let hasTier = false;

  if (item.volumeTiers && item.volumeTiers.length > 0) {
    const matchingTier = item.volumeTiers.find((tier) => {
      if (tier.maxQty !== undefined) {
        return quantity >= tier.minQty && quantity <= tier.maxQty;
      }
      return quantity >= tier.minQty;
    });

    if (matchingTier) {
      suggestedPrice = matchingTier.price;
      hasTier = matchingTier.price !== item.listPrice;
    }
  }

  return { listPrice: item.listPrice, suggestedPrice, hasTier };
};

// ============================================================================
// 2. REGLAS COMERCIALES Y EVALUACIÓN DE POLÍTICAS
// ============================================================================
export interface PolicyEvaluationResult {
  status: 'Dentro de política' | 'Requiere autorización';
  isAuthorizedAutomatically: boolean;
  requiresCommercialAuth: boolean;
  requiresSpecialAuth: boolean;
  reasons: string[];
  severity: 'normal' | 'warning' | 'critical';
}

export const evaluateCommercialPolicy = (params: {
  maxDiscountPct: number;
  averageDiscountPct: number;
  hasManualPrice: boolean;
  manualPriceReasons?: string[];
  estimatedMarginPct: number;
  totalNet: number;
}): PolicyEvaluationResult => {
  const reasons: string[] = [];
  let requiresCommercialAuth = false;
  let requiresSpecialAuth = false;

  if (params.maxDiscountPct > 12) {
    requiresSpecialAuth = true;
    reasons.push('Descuento de ' + params.maxDiscountPct.toFixed(1) + '% excede el 12% (Requiere Dirección General).');
  } else if (params.maxDiscountPct > 6) {
    requiresCommercialAuth = true;
    reasons.push('Descuento de ' + params.maxDiscountPct.toFixed(1) + '% supera el 6% base (Requiere Gerencia Comercial).');
  }

  if (params.hasManualPrice) {
    requiresCommercialAuth = true;
    reasons.push('Se ingresó precio unitario manual fuera de tarifa comercial estándar.');
  }

  if (params.estimatedMarginPct < 6) {
    requiresSpecialAuth = true;
    reasons.push('Margen comercial estimado de ' + params.estimatedMarginPct.toFixed(1) + '% es inferior al piso operativo del 6%.');
  } else if (params.estimatedMarginPct < 10) {
    requiresCommercialAuth = true;
    reasons.push('Margen comercial de ' + params.estimatedMarginPct.toFixed(1) + '% en rango de revisión técnica (6% - 9.9%).');
  }

  const isRequires = requiresCommercialAuth || requiresSpecialAuth;

  return {
    status: isRequires ? 'Requiere autorización' : 'Dentro de política',
    isAuthorizedAutomatically: !isRequires,
    requiresCommercialAuth,
    requiresSpecialAuth,
    reasons: reasons.length > 0 ? reasons : ['Cotización cumple 100% las políticas de precio, margen y condiciones industriales.'],
    severity: requiresSpecialAuth ? 'critical' : requiresCommercialAuth ? 'warning' : 'normal',
  };
};

// ============================================================================
// 3. CLIENTES INDUSTRIALES B2B (SALES CUSTOMERS)
// ============================================================================
export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isMain: boolean;
}

export interface CustomerAddress {
  id: string;
  type: 'Fiscal' | 'Entrega' | 'Sucursal' | 'Planta';
  street: string;
  extNumber: string;
  intNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  reference?: string;
}

export interface SalesCustomer {
  id: string;
  code: string;
  name: string;
  legalName: string;
  rfc: string;
  type: 'Persona' | 'Empresa' | 'Convenio';
  phone: string;
  email: string;
  preferredBranch: string;
  preferredBranchName: string;
  preferredPriceListId: string;
  preferredPriceListName: string;
  baseDiscountPct: number;
  creditDays: number;
  status: 'Activo' | 'Inactivo';
  addresses: CustomerAddress[];
  contacts: CustomerContact[];
  totalQuotesCount: number;
  totalOrdersCount: number;
  totalSpent: number;
  lastPurchaseDate: string;
  createdAt: string;
  notes?: string;
  industrialSector?: string;
  creditLimit?: number;
}

export const INITIAL_MOCK_SALES_CUSTOMERS: SalesCustomer[] = [
  {
    id: 'cli-001',
    code: 'CLI-SBD-001',
    name: 'Stanley Black & Decker México S.A. de C.V.',
    legalName: 'Stanley Black & Decker México S.A. de C.V.',
    rfc: 'SBD920412R34',
    type: 'Empresa',
    phone: '(81) 8329-7000',
    email: 'carlos.mendoza@sbdinc-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-ind-sbd-2026',
    preferredPriceListName: 'Tarifa Corporativa Industrial B2B 2026',
    baseDiscountPct: 0,
    creditDays: 45,
    creditLimit: 2500000,
    status: 'Activo',
    industrialSector: 'Herramientas & Manufactura Global',
    notes: 'Cuenta clave industrial. Entregas programadas en Parque Industrial Milimex, Apodaca.',
    addresses: [
      {
        id: 'addr-sbd-01',
        type: 'Fiscal',
        street: 'Av. Industria Pesada',
        extNumber: '1000',
        neighborhood: 'Parque Industrial Milimex',
        city: 'Apodaca',
        state: 'Nuevo León',
        postalCode: '66637',
        reference: 'Nave B4 - Acceso Rampa Recibo Materiales',
      },
    ],
    contacts: [
      {
        id: 'con-sbd-01',
        name: 'Ing. Carlos Mendoza',
        role: 'Gerente de Compras y Empaque',
        email: 'carlos.mendoza@sbdinc-demo.com',
        phone: '(81) 8329-7010',
        isMain: true,
      },
    ],
    totalQuotesCount: 8,
    totalOrdersCount: 14,
    totalSpent: 1245000,
    lastPurchaseDate: '01 Sep 2026',
    createdAt: '15 Ene 2024',
  },
  {
    id: 'cli-002',
    code: 'CLI-REX-002',
    name: 'Laboratorios Farmacéuticos Rex S.A. de C.V.',
    legalName: 'Laboratorios Farmacéuticos Rex S.A. de C.V.',
    rfc: 'LFR880315PL1',
    type: 'Empresa',
    phone: '(81) 8150-4400',
    email: 'glozano@labrex-demo.com.mx',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-farmaceutica-2026',
    preferredPriceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    baseDiscountPct: 0,
    creditDays: 30,
    creditLimit: 1200000,
    status: 'Activo',
    industrialSector: 'Farmacéutico & Salud',
    notes: 'Requiere certificado de calidad por lote y reporte de trazabilidad de sustratos.',
    addresses: [
      {
        id: 'addr-rex-01',
        type: 'Fiscal',
        street: 'Av. Sendero Divisorio',
        extNumber: '200',
        neighborhood: 'Zona Industrial Sendero',
        city: 'San Nicolás de los Garza',
        state: 'Nuevo León',
        postalCode: '66410',
        reference: 'Planta San Nicolás - Recepción Farmacéutica',
      },
    ],
    contacts: [
      {
        id: 'con-rex-01',
        name: 'Lic. Gabriela Lozano',
        role: 'Abastecimientos & Calidad',
        email: 'glozano@labrex-demo.com.mx',
        phone: '(81) 8150-4422',
        isMain: true,
      },
    ],
    totalQuotesCount: 5,
    totalOrdersCount: 9,
    totalSpent: 620000,
    lastPurchaseDate: '28 Ago 2026',
    createdAt: '10 Mar 2024',
  },
  {
    id: 'cli-003',
    code: 'CLI-ABN-003',
    name: 'Alimentos y Bebidas del Norte S.A. de C.V.',
    legalName: 'Alimentos y Bebidas del Norte S.A. de C.V.',
    rfc: 'ABN041120TK8',
    type: 'Empresa',
    phone: '(81) 8865-1200',
    email: 'farteaga@abnorte-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-flexo-2026',
    preferredPriceListName: 'Tarifa General Flexografía & Bobina 2026',
    baseDiscountPct: 0,
    creditDays: 30,
    creditLimit: 850000,
    status: 'Activo',
    industrialSector: 'Alimentos & Bebidas',
    notes: 'Demanda continua de etiquetas en bobina para líneas de embotellado de alta velocidad.',
    addresses: [
      {
        id: 'addr-abn-01',
        type: 'Fiscal',
        street: 'Carretera a Laredo',
        extNumber: 'Km 18',
        neighborhood: 'Parque Industrial Nexxus',
        city: 'General Escobedo',
        state: 'Nuevo León',
        postalCode: '66050',
        reference: 'Almacén Central de Materias Primas',
      },
    ],
    contacts: [
      {
        id: 'con-abn-01',
        name: 'Lic. Fernando Arteaga',
        role: 'Compras Empaque y Envasado',
        email: 'farteaga@abnorte-demo.com',
        phone: '(81) 8865-1215',
        isMain: true,
      },
    ],
    totalQuotesCount: 4,
    totalOrdersCount: 7,
    totalSpent: 480000,
    lastPurchaseDate: '25 Ago 2026',
    createdAt: '05 May 2024',
  },
  {
    id: 'cli-004',
    code: 'CLI-EMO-004',
    name: 'Electrodomésticos Monterrey S.A. de C.V.',
    legalName: 'Electrodomésticos Monterrey S.A. de C.V.',
    rfc: 'EMO990708M12',
    type: 'Empresa',
    phone: '(81) 8221-5500',
    email: 'rvillalobos@emty-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-ind-sbd-2026',
    preferredPriceListName: 'Tarifa Corporativa Industrial B2B 2026',
    baseDiscountPct: 0,
    creditDays: 60,
    creditLimit: 1800000,
    status: 'Activo',
    industrialSector: 'Electrodomésticos & Línea Blanca',
    notes: 'Tarjetas blister card y manuales para ensambles de exportación.',
    addresses: [
      {
        id: 'addr-emo-01',
        type: 'Fiscal',
        street: 'Av. Las Torres',
        extNumber: '500',
        neighborhood: 'Parque Industrial Finsa',
        city: 'Guadalupe',
        state: 'Nuevo León',
        postalCode: '67132',
        reference: 'Rampa de Proveedores - Puerta 3',
      },
    ],
    contacts: [
      {
        id: 'con-emo-01',
        name: 'Ing. Ricardo Villalobos',
        role: 'Planeación de Materiales',
        email: 'rvillalobos@emty-demo.com',
        phone: '(81) 8221-5510',
        isMain: true,
      },
    ],
    totalQuotesCount: 6,
    totalOrdersCount: 11,
    totalSpent: 890000,
    lastPurchaseDate: '30 Ago 2026',
    createdAt: '12 Feb 2024',
  },
];

// ============================================================================
// 4. COTIZACIONES INDUSTRIALES (SALES QUOTES)
// ============================================================================
export interface SalesQuoteItem {
  id: string;
  sku: string;
  partNumber?: string;
  productName: string;
  revision?: string;
  technology?: 'Offset' | 'Flexografía';
  specifications?: string;
  brand: string;
  size: string;
  unit?: string;
  quantity: number;
  listPrice: number;
  discountPct: number;
  netPrice: number;
  subtotal: number;
  costReference: number;
  localStock: number;
  isManualPrice: boolean;
  manualPriceReason?: string;
  hasVolumeTierApplied?: boolean;
}

export interface SalesQuoteFinancials {
  subtotalList: number;
  totalDiscountAmount: number;
  subtotalNet: number;
  taxIva: number;
  total: number;
  estimatedCost: number;
  estimatedMarginAmount: number;
  estimatedMarginPct: number;
}

export interface QuoteCostingEstimate {
  materials?: number;
  machineProcess?: number;
  finishes?: number;
  setupAndPlates?: number;
  wasteEstimatedPct?: number;
  wasteEstimatedAmount?: number;
  totalCost?: number;
  marginAmount?: number;
  marginPct?: number;
  proposedPrice?: number;
  materialsCost?: number;
  processMachineCost?: number;
  finishesCost?: number;
  setupCost?: number;
  estimatedWasteCost?: number;
  estimatedTotalCost?: number;
  targetMarginPct?: number;
}

export type SalesQuoteStatus =
  | 'Borrador'
  | 'Pendiente de autorización'
  | 'Autorizada'
  | 'Enviada al cliente'
  | 'Aceptada'
  | 'Rechazada'
  | 'Vencida'
  | 'Convertida en pedido';

export interface SalesQuote {
  id: string;
  folio: string;
  createdAt: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  customerRfc: string;
  customerType: 'Persona' | 'Empresa' | 'Convenio';
  branchId: string;
  branchName: string;
  priceListId: string;
  priceListName: string;
  sellerName: string;
  items: SalesQuoteItem[];
  financials: SalesQuoteFinancials;
  policyStatus: 'Dentro de política' | 'Requiere autorización';
  policyReasons: string[];
  status: SalesQuoteStatus;
  notes?: string;
  paymentConditions?: string;
  estimatedDeliveryDays?: number;
  deliveryAddress?: string;
  partNumber?: string;
  revision?: string;
  technology?: 'Offset' | 'Flexografía';
  specifications?: string;
  specSummary?: string;
  requiredDate?: string;
  costingEstimate?: QuoteCostingEstimate;
  authorizationLog?: {
    authorizedBy?: string;
    authorizedAt?: string;
    notes?: string;
    action: 'Pendiente' | 'Autorizada' | 'Rechazada' | 'Ajuste solicitado';
  };
  generatedOrderFolio?: string;
}

export const INITIAL_MOCK_SALES_QUOTES: SalesQuote[] = [
  // 1. CASO NARRATIVA PRINCIPAL: COT-RTM-2026-0108 (Aceptada -> PED-RTM-2026-0142)
  {
    id: 'cot-rtm-0108',
    folio: 'COT-RTM-2026-0108',
    createdAt: '26 Ago 2026',
    validUntil: '15 Sep 2026',
    customerId: 'cli-001',
    customerName: 'Stanley Black & Decker México S.A. de C.V.',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'BD-MAN-024',
    revision: 'Rev B (Vigente)',
    technology: 'Offset',
    requiredDate: '25 Sep 2026',
    specifications: 'Papel Couché 90 g (MP-COU-090), 24 páginas interiores en grapa a caballo, 2x2 tintas especiales, plecado y doblez automático.',
    paymentConditions: 'Crédito comercial 45 días',
    estimatedDeliveryDays: 15,
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Tiraje industrial para ensamble de herramientas eléctricas. Requiere balance de PT disponible vs producción.',
    status: 'Aceptada',
    generatedOrderFolio: 'PED-RTM-2026-0142',
    costingEstimate: {
      materials: 38400,
      machineProcess: 22500,
      finishes: 9600,
      setupAndPlates: 3200,
      wasteEstimatedPct: 6.0,
      wasteEstimatedAmount: 4380,
      totalCost: 78080,
      marginAmount: 7420,
      marginPct: 8.7,
      proposedPrice: 85500,
    },
    items: [
      {
        id: 'cot-it-01',
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas',
        revision: 'Rev B (Vigente)',
        technology: 'Offset',
        specifications: 'Couché 90 g, 24 págs, 2x2 tintas, grapa a caballo.',
        brand: 'Stanley Black & Decker',
        size: '24 páginas',
        unit: 'pza',
        quantity: 30000,
        listPrice: 2.85,
        discountPct: 0,
        netPrice: 2.85,
        subtotal: 85500,
        costReference: 2.60,
        localStock: 5000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 85500,
      totalDiscountAmount: 0,
      subtotalNet: 85500,
      taxIva: 13680,
      total: 99180,
      estimatedCost: 78080,
      estimatedMarginAmount: 7420,
      estimatedMarginPct: 8.7,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Margen y condiciones cumplen la tarifa corporativa industrial B2B.'],
    authorizationLog: {
      authorizedBy: 'Dirección Comercial RTM',
      authorizedAt: '28 Ago 2026',
      notes: 'Cotización autorizada y aceptada por el cliente. Se generó pedido formal PED-RTM-2026-0142.',
      action: 'Autorizada',
    },
  },

  // 2. COT-RTM-2026-0109: Etiqueta Flexo Farmacéutica (Autorizada)
  {
    id: 'cot-rtm-0109',
    folio: 'COT-RTM-2026-0109',
    createdAt: '28 Ago 2026',
    validUntil: '20 Sep 2026',
    customerId: 'cli-002',
    customerName: 'Laboratorios Farmacéuticos Rex S.A. de C.V.',
    customerRfc: 'LFR880315PL1',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-farmaceutica-2026',
    priceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'PT-ETQ-001',
    revision: 'Rev A (Vigente)',
    technology: 'Flexografía',
    requiredDate: '15 Sep 2026',
    specifications: 'BOPP Blanco 60 mic (MP-BOP-WHT), 4 tintas UV + Barniz sobreimpresión, rollo de 2,500 etiquetas con core de 3".',
    paymentConditions: 'Crédito comercial 30 días',
    estimatedDeliveryDays: 10,
    deliveryAddress: 'Av. Sendero Divisorio #200, Zona Industrial Sendero, San Nicolás de los Garza N.L.',
    notes: 'Etiquetas farmacéuticas de alta durabilidad en bobina para envasado estéril.',
    status: 'Autorizada',
    costingEstimate: {
      materials: 23000,
      machineProcess: 11500,
      finishes: 3500,
      setupAndPlates: 1800,
      wasteEstimatedPct: 5.0,
      wasteEstimatedAmount: 2100,
      totalCost: 41900,
      marginAmount: 4100,
      marginPct: 8.9,
      proposedPrice: 46000,
    },
    items: [
      {
        id: 'cot-it-02',
        sku: 'PT-ETQ-001',
        partNumber: 'PT-ETQ-001',
        productName: 'Etiqueta Autoadherible 4x6" en Rollo',
        revision: 'Rev A (Vigente)',
        technology: 'Flexografía',
        specifications: 'BOPP Blanco 60 mic, 4 tintas UV + Barniz.',
        brand: 'Laboratorios Rex',
        size: 'Rollo 4x6"',
        unit: 'pza',
        quantity: 50000,
        listPrice: 0.92,
        discountPct: 0,
        netPrice: 0.92,
        subtotal: 46000,
        costReference: 0.84,
        localStock: 24000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 46000,
      totalDiscountAmount: 0,
      subtotalNet: 46000,
      taxIva: 7360,
      total: 53360,
      estimatedCost: 41900,
      estimatedMarginAmount: 4100,
      estimatedMarginPct: 8.9,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Tarifa farmacéutica validada con departamento de aseguramiento de calidad.'],
    authorizationLog: {
      authorizedBy: 'Gerencia Técnica RTM',
      authorizedAt: '29 Ago 2026',
      notes: 'Autorizada con especificación de herramentales flexo listos.',
      action: 'Autorizada',
    },
  },

  // 3. COT-RTM-2026-0110: Blister Card (Pendiente de Autorización)
  {
    id: 'cot-rtm-0110',
    folio: 'COT-RTM-2026-0110',
    createdAt: '30 Ago 2026',
    validUntil: '25 Sep 2026',
    customerId: 'cli-004',
    customerName: 'Electrodomésticos Monterrey S.A. de C.V.',
    customerRfc: 'EMO990708M12',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: 'BLI-CRD-001',
    revision: 'Rev C (Vigente)',
    technology: 'Offset',
    requiredDate: '30 Sep 2026',
    specifications: 'Cartulina Sulfatada SBS 240 g / 14 pts (MP-SBS-240), 4x0 tintas proceso + Barniz termosellable base agua.',
    paymentConditions: 'Crédito comercial 60 días',
    estimatedDeliveryDays: 18,
    deliveryAddress: 'Av. Las Torres #500, Parque Industrial Finsa, Guadalupe N.L.',
    notes: 'Solicitud de descuento especial por volumen de 40,000 piezas. Requiere visto bueno de Dirección Comercial.',
    status: 'Pendiente de autorización',
    costingEstimate: {
      materials: 28000,
      machineProcess: 14000,
      finishes: 6500,
      setupAndPlates: 2500,
      wasteEstimatedPct: 5.5,
      wasteEstimatedAmount: 2800,
      totalCost: 53800,
      marginAmount: 4200,
      marginPct: 7.2,
      proposedPrice: 58000,
    },
    items: [
      {
        id: 'cot-it-03',
        sku: 'BLI-CRD-001',
        partNumber: 'BLI-CRD-001',
        productName: 'Blister Card Termosellable',
        revision: 'Rev C (Vigente)',
        technology: 'Offset',
        specifications: 'SBS 240 g, 4x0 tintas + barniz termosellable.',
        brand: 'Electrodomésticos Monterrey',
        size: 'Termosellable',
        unit: 'pza',
        quantity: 40000,
        listPrice: 1.45,
        discountPct: 0,
        netPrice: 1.45,
        subtotal: 58000,
        costReference: 1.345,
        localStock: 10000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 58000,
      totalDiscountAmount: 0,
      subtotalNet: 58000,
      taxIva: 9280,
      total: 67280,
      estimatedCost: 53800,
      estimatedMarginAmount: 4200,
      estimatedMarginPct: 7.2,
    },
    policyStatus: 'Requiere autorización',
    policyReasons: ['Margen comercial de 7.2% está en rango de revisión técnica por costo de cartulina SBS.'],
  },

  // 4. COT-RTM-2026-0111: Manual instructivo 48 páginas (Enviada al cliente)
  {
    id: 'cot-rtm-0111',
    folio: 'COT-RTM-2026-0111',
    createdAt: '01 Sep 2026',
    validUntil: '25 Sep 2026',
    customerId: 'cli-001',
    customerName: 'Stanley Black & Decker México S.A. de C.V.',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'BD-MAN-048',
    revision: 'Rev A (Vigente)',
    technology: 'Offset',
    requiredDate: '05 Oct 2026',
    specifications: 'Papel Bond 75 g (MP-BND-075) interiores 1x1 + Portada Couché 150 g 4x0, lomo cuadrado Hot-melt.',
    paymentConditions: 'Crédito comercial 45 días',
    estimatedDeliveryDays: 20,
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Cotización formal enviada por correo al Ing. Carlos Mendoza. En espera de emisión de Orden de Compra.',
    status: 'Enviada al cliente',
    costingEstimate: {
      materials: 32000,
      machineProcess: 16500,
      finishes: 7200,
      setupAndPlates: 2800,
      wasteEstimatedPct: 5.0,
      wasteEstimatedAmount: 2900,
      totalCost: 61400,
      marginAmount: 1600,
      marginPct: 2.5,
      proposedPrice: 63000,
    },
    items: [
      {
        id: 'cot-it-04',
        sku: 'BD-MAN-048',
        partNumber: 'BD-MAN-048',
        productName: 'Manual instructivo 48 páginas',
        revision: 'Rev A (Vigente)',
        technology: 'Offset',
        specifications: 'Bond 75 g int + Couché 150 g portada, Hotmelt.',
        brand: 'Stanley Black & Decker',
        size: '48 páginas',
        unit: 'pza',
        quantity: 15000,
        listPrice: 4.20,
        discountPct: 0,
        netPrice: 4.20,
        subtotal: 63000,
        costReference: 4.09,
        localStock: 2000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 63000,
      totalDiscountAmount: 0,
      subtotalNet: 63000,
      taxIva: 10080,
      total: 73080,
      estimatedCost: 61400,
      estimatedMarginAmount: 1600,
      estimatedMarginPct: 2.5,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Precio y condiciones validados conforme a tarifa vigente.'],
  },

  // 5. COT-RTM-2026-0112: Tag Colgante UV (Borrador)
  {
    id: 'cot-rtm-0112',
    folio: 'COT-RTM-2026-0112',
    createdAt: '02 Sep 2026',
    validUntil: '30 Sep 2026',
    customerId: 'cli-003',
    customerName: 'Alimentos y Bebidas del Norte S.A. de C.V.',
    customerRfc: 'ABN041120TK8',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-flexo-2026',
    priceListName: 'Tarifa General Flexografía & Bobina 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: 'TAG-IMP-002',
    revision: 'Rev A (Vigente)',
    technology: 'Offset',
    requiredDate: '10 Oct 2026',
    specifications: 'Cartulina SBS 240 g, 4x4 tintas + Barniz UV brillante frente, perforación circular de 5 mm para cordón.',
    paymentConditions: 'Crédito comercial 30 días',
    estimatedDeliveryDays: 12,
    deliveryAddress: 'Carretera a Laredo Km 18, General Escobedo N.L.',
    notes: 'Borrador en preparación técnica por ingeniería de producto.',
    status: 'Borrador',
    items: [
      {
        id: 'cot-it-05',
        sku: 'TAG-IMP-002',
        partNumber: 'TAG-IMP-002',
        productName: 'Tag Colgante con Barniz UV',
        revision: 'Rev A (Vigente)',
        technology: 'Offset',
        specifications: 'SBS 240 g, 4x4 tintas + Barniz UV frente.',
        brand: 'Alimentos y Bebidas del Norte',
        size: 'Colgante UV',
        unit: 'pza',
        quantity: 20000,
        listPrice: 1.15,
        discountPct: 0,
        netPrice: 1.15,
        subtotal: 23000,
        costReference: 0.98,
        localStock: 8000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 23000,
      totalDiscountAmount: 0,
      subtotalNet: 23000,
      taxIva: 3680,
      total: 26680,
      estimatedCost: 19600,
      estimatedMarginAmount: 3400,
      estimatedMarginPct: 14.8,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Borrador en edición.'],
  },
];

// ============================================================================
// 5. PEDIDOS INDUSTRIALES (SALES ORDERS)
// ============================================================================
export interface SalesOrderItem {
  id: string;
  sku: string;
  partNumber?: string;
  productName: string;
  revision?: string;
  technology?: 'Offset' | 'Flexografía';
  isObsoleteRevision?: boolean;
  brand: string;
  size: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  costReference: number;
  localStock: number;
  availablePt?: number;
  reservableQty?: number;
  missingToProduce?: number;
  criticalMaterial?: {
    sku: string;
    name: string;
    isInsufficient: boolean;
    requiredQty: string;
    availableQty: string;
    missingQty: string;
    relatedRequisitionFolio?: string;
    relatedPoFolio?: string;
  };
}

export type SalesOrderStatus =
  | 'Pendiente de autorización'
  | 'Autorizado'
  | 'Pendiente de surtido'
  | 'En preparación'
  | 'Surtido parcial'
  | 'Surtido completo'
  | 'En verificación de salida'
  | 'Lista para carga'
  | 'En ruta'
  | 'Entregado'
  | 'Entrega parcial'
  | 'Con incidencia'
  | 'Cancelado';

export interface SalesOrder {
  id: string;
  folio: string;
  quoteId?: string;
  originQuoteFolio?: string;
  customerPo?: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerRfc: string;
  customerType: 'Persona' | 'Empresa' | 'Convenio';
  branchId: string;
  branchName: string;
  fulfillmentOriginId?: string;
  fulfillmentOriginName?: string;
  priceListName: string;
  sellerName: string;
  partNumber?: string;
  revision?: string;
  technology?: 'Offset' | 'Flexografía';
  isObsoleteRevision?: boolean;
  hasMaterialAlert?: boolean;
  finishedGoodsStock?: number;
  reservableQuantity?: number;
  missingToProduce?: number;
  specSummary?: string;
  requiredDate?: string;
  items: SalesOrderItem[];
  ptAvailability?: {
    orderedQty: number;
    availablePt: number;
    reservableQty: number;
    missingToProduce: number;
  };
  materialStatus?: {
    insufficientMaterial: boolean;
    materialName?: string;
    materialSku?: string;
    alertMessage?: string;
    relatedRequisitionFolio?: string;
    relatedPoFolio?: string;
  };
  financials: {
    subtotal: number;
    discountAmount: number;
    taxIva: number;
    total: number;
    estimatedCost: number;
    estimatedMarginAmount: number;
    estimatedMarginPct: number;
  };
  status: SalesOrderStatus;
  notes?: string;
  paymentConditions: string;
  deliveryAddress: string;
  targetDeliveryDate: string;
  authorizationLog?: {
    authorizedBy?: string;
    authorizedAt?: string;
    notes?: string;
    status: 'Pendiente' | 'Autorizada' | 'Rechazada' | 'Ajuste solicitado';
    policyReason?: string;
  };
  operationalLinks?: {
    pickOrderId?: string;
    pickOrderFolio?: string;
    outboundOrderId?: string;
    outboundOrderFolio?: string;
    remisionFolio?: string;
    routeFolio?: string;
  };
}

export const INITIAL_MOCK_SALES_ORDERS: SalesOrder[] = [
  // 1. CASO NARRATIVA PRINCIPAL: PED-RTM-2026-0142 (Disponibilidad PT + Faltante producción + Material Crítico)
  {
    id: 'ord-rtm-0142',
    folio: 'PED-RTM-2026-0142',
    quoteId: 'cot-rtm-0108',
    originQuoteFolio: 'COT-RTM-2026-0108',
    customerPo: 'PO-SBD-88410',
    createdAt: '28 Ago 2026',
    customerId: 'cli-001',
    customerName: 'Stanley Black & Decker México S.A. de C.V.',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'BD-MAN-024',
    revision: 'Rev B (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '25 Sep 2026',
    targetDeliveryDate: '25 Sep 2026',
    paymentConditions: 'Crédito comercial 45 días',
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Orden de Compra de Cliente confirmada: PO-SBD-88410. Tiraje 30,000 piezas. 5,000 pzas listas en PT; 25,000 por producir.',
    status: 'En preparación',
    ptAvailability: {
      orderedQty: 30000,
      availablePt: 5000,
      reservableQty: 5000,
      missingToProduce: 25000,
    },
    materialStatus: {
      insufficientMaterial: true,
      materialName: 'Papel Couché 90 g',
      materialSku: 'MP-COU-090',
      alertMessage: 'Faltan 4 tarimas de Papel Couché 90 g para completar el tiraje de 25,000 pzas faltantes. Requisición REQ-2026-018 / OC-RTM-2026-0089 en tránsito.',
      relatedRequisitionFolio: 'REQ-2026-018',
      relatedPoFolio: 'OC-RTM-2026-0089',
    },
    items: [
      {
        id: 'ord-it-01',
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas',
        revision: 'Rev B (Vigente)',
        technology: 'Offset',
        brand: 'Stanley Black & Decker',
        size: '24 páginas',
        unit: 'pza',
        quantity: 30000,
        unitPrice: 2.85,
        subtotal: 85500,
        costReference: 2.60,
        localStock: 5000,
        availablePt: 5000,
        reservableQty: 5000,
        missingToProduce: 25000,
        criticalMaterial: {
          sku: 'MP-COU-090',
          name: 'Papel Couché 90 g (Pliegos 70x100 cm)',
          isInsufficient: true,
          requiredQty: '4 tarimas (72,000 pliegos)',
          availableQty: '1 tarima en almacén',
          missingQty: '3 tarimas pendientes',
          relatedRequisitionFolio: 'REQ-2026-018',
          relatedPoFolio: 'OC-RTM-2026-0089',
        },
      },
    ],
    financials: {
      subtotal: 85500,
      discountAmount: 0,
      taxIva: 13680,
      total: 99180,
      estimatedCost: 78080,
      estimatedMarginAmount: 7420,
      estimatedMarginPct: 8.7,
    },
    authorizationLog: {
      authorizedBy: 'Dirección Comercial RTM',
      authorizedAt: '28 Ago 2026',
      notes: 'Pedido aprobado contra PO-SBD-88410. Crédito validado.',
      status: 'Autorizada',
    },
  },

  // 2. PED-RTM-2026-0141: PT 100% Disponible (Lista para carga)
  {
    id: 'ord-rtm-0141',
    folio: 'PED-RTM-2026-0141',
    quoteId: 'cot-rtm-0109',
    originQuoteFolio: 'COT-RTM-2026-0109',
    customerPo: 'PO-REX-2026-991',
    createdAt: '29 Ago 2026',
    customerId: 'cli-002',
    customerName: 'Laboratorios Farmacéuticos Rex S.A. de C.V.',
    customerRfc: 'LFR880315PL1',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'PT-ETQ-001',
    revision: 'Rev A (Vigente)',
    technology: 'Flexografía',
    isObsoleteRevision: false,
    requiredDate: '15 Sep 2026',
    targetDeliveryDate: '15 Sep 2026',
    paymentConditions: 'Crédito comercial 30 días',
    deliveryAddress: 'Av. Sendero Divisorio #200, Zona Industrial Sendero, San Nicolás de los Garza N.L.',
    notes: '24 cajas de etiquetas terminadas (24,000 piezas). Inspeccionadas por QA y listas para entrega.',
    status: 'Lista para carga',
    ptAvailability: {
      orderedQty: 24000,
      availablePt: 24000,
      reservableQty: 24000,
      missingToProduce: 0,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-02',
        sku: 'PT-ETQ-001',
        partNumber: 'PT-ETQ-001',
        productName: 'Etiqueta Autoadherible 4x6" en Rollo',
        revision: 'Rev A (Vigente)',
        technology: 'Flexografía',
        brand: 'Laboratorios Rex',
        size: 'Rollo 4x6"',
        unit: 'pza',
        quantity: 24000,
        unitPrice: 0.92,
        subtotal: 22080,
        costReference: 0.84,
        localStock: 24000,
        availablePt: 24000,
        reservableQty: 24000,
        missingToProduce: 0,
      },
    ],
    financials: {
      subtotal: 22080,
      discountAmount: 0,
      taxIva: 3532.80,
      total: 25612.80,
      estimatedCost: 20160,
      estimatedMarginAmount: 1920,
      estimatedMarginPct: 8.7,
    },
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0312',
      remisionFolio: 'REM-2026-0544',
      routeFolio: 'RUTA-MTY-04',
    },
  },

  // 3. PED-RTM-2026-0140: Pendiente de autorización
  {
    id: 'ord-rtm-0140',
    folio: 'PED-RTM-2026-0140',
    quoteId: 'cot-rtm-0110',
    originQuoteFolio: 'COT-RTM-2026-0110',
    customerPo: 'PO-EMO-44120',
    createdAt: '30 Ago 2026',
    customerId: 'cli-004',
    customerName: 'Electrodomésticos Monterrey S.A. de C.V.',
    customerRfc: 'EMO990708M12',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: 'BLI-CRD-001',
    revision: 'Rev C (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '30 Sep 2026',
    targetDeliveryDate: '30 Sep 2026',
    paymentConditions: 'Crédito comercial 60 días',
    deliveryAddress: 'Av. Las Torres #500, Parque Industrial Finsa, Guadalupe N.L.',
    notes: 'Pedido de 40,000 piezas. PT disponible: 10,000 pzas; Faltante por producir: 30,000 pzas.',
    status: 'Pendiente de autorización',
    ptAvailability: {
      orderedQty: 40000,
      availablePt: 10000,
      reservableQty: 10000,
      missingToProduce: 30000,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-03',
        sku: 'BLI-CRD-001',
        partNumber: 'BLI-CRD-001',
        productName: 'Blister Card Termosellable',
        revision: 'Rev C (Vigente)',
        technology: 'Offset',
        brand: 'Electrodomésticos Monterrey',
        size: 'Termosellable',
        unit: 'pza',
        quantity: 40000,
        unitPrice: 1.45,
        subtotal: 58000,
        costReference: 1.345,
        localStock: 10000,
        availablePt: 10000,
        reservableQty: 10000,
        missingToProduce: 30000,
      },
    ],
    financials: {
      subtotal: 58000,
      discountAmount: 0,
      taxIva: 9280,
      total: 67280,
      estimatedCost: 53800,
      estimatedMarginAmount: 4200,
      estimatedMarginPct: 7.2,
    },
    authorizationLog: {
      notes: 'En revisión de límite de crédito de cliente por Gerencia de Finanzas.',
      status: 'Pendiente',
      policyReason: 'Plazo solicitado de 60 días excede política comercial estándar de 45 días.',
    },
  },

  // 4. PED-RTM-2026-0139: CASO REVISIÓN OBSOLETA (Warning semántico)
  {
    id: 'ord-rtm-0139',
    folio: 'PED-RTM-2026-0139',
    customerPo: 'PO-SBD-87902',
    createdAt: '10 Jul 2026',
    customerId: 'cli-001',
    customerName: 'Stanley Black & Decker México S.A. de C.V.',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'BD-MAN-024',
    revision: 'Rev A (OBSOLETA)',
    technology: 'Offset',
    isObsoleteRevision: true,
    requiredDate: '10 Ago 2026',
    targetDeliveryDate: '10 Ago 2026',
    paymentConditions: 'Crédito comercial 45 días',
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Lote histórico fabricado con versión de arte previa (Rev A). Entregado y liquidado.',
    status: 'Entregado',
    ptAvailability: {
      orderedQty: 10000,
      availablePt: 0,
      reservableQty: 0,
      missingToProduce: 0,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-04',
        sku: 'BD-MAN-024',
        partNumber: 'BD-MAN-024',
        productName: 'Manual instructivo 24 páginas (Rev A)',
        revision: 'Rev A (OBSOLETA)',
        technology: 'Offset',
        isObsoleteRevision: true,
        brand: 'Stanley Black & Decker',
        size: '24 páginas',
        unit: 'pza',
        quantity: 10000,
        unitPrice: 2.85,
        subtotal: 28500,
        costReference: 2.60,
        localStock: 0,
        availablePt: 0,
        reservableQty: 0,
        missingToProduce: 0,
      },
    ],
    financials: {
      subtotal: 28500,
      discountAmount: 0,
      taxIva: 4560,
      total: 33060,
      estimatedCost: 26000,
      estimatedMarginAmount: 2500,
      estimatedMarginPct: 8.8,
    },
  },

  // 5. PED-RTM-2026-0138: En preparación
  {
    id: 'ord-rtm-0138',
    folio: 'PED-RTM-2026-0138',
    quoteId: 'cot-rtm-0112',
    originQuoteFolio: 'COT-RTM-2026-0112',
    customerPo: 'PO-ABN-55109',
    createdAt: '25 Ago 2026',
    customerId: 'cli-003',
    customerName: 'Alimentos y Bebidas del Norte S.A. de C.V.',
    customerRfc: 'ABN041120TK8',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa General Flexografía & Bobina 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: 'TAG-IMP-002',
    revision: 'Rev A (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '18 Sep 2026',
    targetDeliveryDate: '18 Sep 2026',
    paymentConditions: 'Crédito comercial 30 días',
    deliveryAddress: 'Carretera a Laredo Km 18, General Escobedo N.L.',
    notes: '20,000 piezas solicitadas. 8,000 piezas en stock PT, 12,000 en proceso de plecado y barniz UV.',
    status: 'En preparación',
    ptAvailability: {
      orderedQty: 20000,
      availablePt: 8000,
      reservableQty: 8000,
      missingToProduce: 12000,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-05',
        sku: 'TAG-IMP-002',
        partNumber: 'TAG-IMP-002',
        productName: 'Tag Colgante con Barniz UV',
        revision: 'Rev A (Vigente)',
        technology: 'Offset',
        brand: 'Alimentos y Bebidas del Norte',
        size: 'Colgante UV',
        unit: 'pza',
        quantity: 20000,
        unitPrice: 1.15,
        subtotal: 23000,
        costReference: 0.98,
        localStock: 8000,
        availablePt: 8000,
        reservableQty: 8000,
        missingToProduce: 12000,
      },
    ],
    financials: {
      subtotal: 23000,
      discountAmount: 0,
      taxIva: 3680,
      total: 26680,
      estimatedCost: 19600,
      estimatedMarginAmount: 3400,
      estimatedMarginPct: 14.8,
    },
  },
];

// ============================================================================
// 6. BALANCE Y EFECTIVIDAD COMERCIAL INDUSTRIAL (DEMANDA Y PT)
// ============================================================================
export interface ShowroomImpactItem {
  id: string;
  branchId: string;
  branchName: string;
  bayCode: string;
  bayName: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  unitsSoldBefore30d: number;
  unitsSoldAfter30d: number;
  variationPct: number;
  marginPct: number;
  status: 'Alto impacto' | 'Impacto positivo' | 'Neutral' | 'Bajo impacto';
  observation: string;
}

export interface ProductionDemandItem {
  id: string;
  plantId: string;
  plantName: string;
  lineCode: string;
  lineName: string;
  sku: string;
  partNumber: string;
  productName: string;
  technology: 'Offset' | 'Flexografía';
  revision: string;
  clientName: string;
  orderedQty: number;
  availablePt: number;
  missingToProduce: number;
  criticalMaterial: string;
  status: 'Programado' | 'En prensa' | 'PT Disponible' | 'Requiere material';
  observation: string;
}

export const MOCK_SHOWROOM_IMPACT_DATA: ShowroomImpactItem[] = [
  {
    id: 'shw-imp-01',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    bayCode: 'L-OFF-01',
    bayName: 'Prensa Heidelberg Speedmaster 74 (Offset)',
    sku: 'BD-MAN-024',
    productName: 'Manual instructivo 24 páginas (Rev B)',
    brand: 'Stanley Black & Decker',
    size: '24 páginas',
    unitsSoldBefore30d: 15000,
    unitsSoldAfter30d: 30000,
    variationPct: 100.0,
    marginPct: 8.7,
    status: 'Alto impacto',
    observation: 'Alto volumen en firme por pedido PO-SBD-88410. Requiere 4 tarimas de Couché 90 g.',
  },
  {
    id: 'shw-imp-02',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    bayCode: 'L-FLX-01',
    bayName: 'Prensa Mark Andy 2200 8C (Flexo)',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Autoadherible 4x6" en Rollo',
    brand: 'Laboratorios Rex',
    size: 'Rollo 4x6"',
    unitsSoldBefore30d: 20000,
    unitsSoldAfter30d: 50000,
    variationPct: 150.0,
    marginPct: 8.9,
    status: 'Alto impacto',
    observation: '24 cajas listas en PT; lote de 50,000 pzas autorizado para surtido continuo.',
  },
  {
    id: 'shw-imp-03',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    bayCode: 'L-OFF-02',
    bayName: 'Prensa Komori Lithrone 40 (Offset)',
    sku: 'BLI-CRD-001',
    productName: 'Blister Card Termosellable (Rev C)',
    brand: 'Electrodomésticos Monterrey',
    size: 'Termosellable',
    unitsSoldBefore30d: 18000,
    unitsSoldAfter30d: 40000,
    variationPct: 122.2,
    marginPct: 7.2,
    status: 'Impacto positivo',
    observation: 'Tiraje de 40,000 piezas en espera de liberación de crédito comercial.',
  },
  {
    id: 'shw-imp-04',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    bayCode: 'L-OFF-01',
    bayName: 'Prensa Heidelberg Speedmaster 74 (Offset)',
    sku: 'BD-MAN-048',
    productName: 'Manual instructivo 48 páginas (Rev A)',
    brand: 'Stanley Black & Decker',
    size: '48 páginas',
    unitsSoldBefore30d: 5000,
    unitsSoldAfter30d: 15000,
    variationPct: 200.0,
    marginPct: 2.5,
    status: 'Impacto positivo',
    observation: 'Cotización enviada al cliente. Insumos de papel Bond 75 g reservados.',
  },
];

// ============================================================================
// 7. DEMANDA INDUSTRIAL ALTA + MATERIAL CRÍTICO EN ALMACÉN
// ============================================================================
export interface HighDemandLowStockItem {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  branchId: string;
  branchName: string;
  recentSales30d: number;
  availableStock: number;
  coverageDays: number;
  suggestedRequisitionQty: number;
  urgency: 'Alta' | 'Media';
  materialRequired?: string;
}

export const MOCK_HIGH_DEMAND_LOW_STOCK_DATA: HighDemandLowStockItem[] = [
  {
    id: 'hls-01',
    sku: 'BD-MAN-024',
    productName: 'Manual instructivo 24 páginas (Rev B)',
    brand: 'Stanley Black & Decker',
    size: '24 páginas',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 30000,
    availableStock: 5000,
    coverageDays: 5.0,
    suggestedRequisitionQty: 25000,
    urgency: 'Alta',
    materialRequired: 'Papel Couché 90 g (MP-COU-090) - 4 tarimas',
  },
  {
    id: 'hls-02',
    sku: 'BLI-CRD-001',
    productName: 'Blister Card Termosellable (Rev C)',
    brand: 'Electrodomésticos Monterrey',
    size: 'Termosellable',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 40000,
    availableStock: 10000,
    coverageDays: 7.5,
    suggestedRequisitionQty: 30000,
    urgency: 'Alta',
    materialRequired: 'Cartulina Sulfatada SBS 240 g (MP-SBS-240)',
  },
  {
    id: 'hls-03',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Autoadherible 4x6" en Rollo',
    brand: 'Laboratorios Rex',
    size: 'Rollo 4x6"',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 50000,
    availableStock: 12000,
    coverageDays: 7.2,
    suggestedRequisitionQty: 26000,
    urgency: 'Media',
    materialRequired: 'Bobinas BOPP Blanco 60 mic (MP-BOP-WHT)',
  },
  {
    id: 'hls-04',
    sku: 'TAG-IMP-002',
    productName: 'Tag Colgante con Barniz UV',
    brand: 'Alimentos y Bebidas del Norte',
    size: 'Colgante UV',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 20000,
    availableStock: 8000,
    coverageDays: 12.0,
    suggestedRequisitionQty: 12000,
    urgency: 'Media',
    materialRequired: 'Barniz UV Curado Rápido (MP-VAR-UV)',
  },
];
