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
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23)',
        listPrice: 2.85,
        volumeTiers: [
          { minQty: 10000, maxQty: 24999, price: 2.85 },
          { minQty: 25000, maxQty: 49999, price: 2.70 },
          { minQty: 50000, price: 2.55 },
        ],
      },
      {
        sku: 'NA698298',
        partNumber: 'NA698298',
        productName: 'Manual Drill DCD777 NA (Rev 09/24)',
        listPrice: 4.20,
        volumeTiers: [
          { minQty: 10000, maxQty: 24999, price: 4.20 },
          { minQty: 25000, price: 3.95 },
        ],
      },
      {
        sku: '1641301',
        partNumber: '1641301',
        productName: 'User Guide POWERFORCE HELIX (Rev .02/24)',
        listPrice: 1.95,
        volumeTiers: [
          { minQty: 10000, maxQty: 24999, price: 1.95 },
          { minQty: 25000, price: 1.80 },
        ],
      },
      {
        sku: '02-814-556',
        partNumber: '02-814-556',
        productName: 'Instructivo e-Force Seguridad Contra Incendios (Rev B)',
        listPrice: 1.35,
        volumeTiers: [
          { minQty: 20000, maxQty: 39999, price: 1.35 },
          { minQty: 40000, price: 1.25 },
        ],
      },
      {
        sku: 'IS-2420',
        partNumber: 'IS-2420',
        productName: 'Slide-In Label Wiper Blade (Rev I-01)',
        listPrice: 0.92,
        volumeTiers: [
          { minQty: 20000, maxQty: 49999, price: 0.92 },
          { minQty: 50000, price: 0.85 },
        ],
      },
      {
        sku: 'A163833BHA',
        partNumber: 'A163833BHA',
        productName: 'Etiqueta Poliéster Grado Industrial (Rev A)',
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
    description: 'Tarifa grado farmacéutico e industrial estricto con control de sustratos, trazabilidad y AQL.',
    targetType: 'Convenio',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'IS-2420',
        partNumber: 'IS-2420',
        productName: 'Slide-In Label Wiper Blade (Rev I-01)',
        listPrice: 0.92,
        volumeTiers: [
          { minQty: 25000, maxQty: 49999, price: 0.92 },
          { minQty: 50000, price: 0.88 },
        ],
      },
      {
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23)',
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
    description: 'Precios base por millar para rollos de etiquetas autoadheribles, transfer térmico y poliéster.',
    targetType: 'General',
    branchApplicability: ['wh-alm-rtm'],
    items: [
      {
        sku: 'IS-2420',
        partNumber: 'IS-2420',
        productName: 'Slide-In Label Wiper Blade (Rev I-01)',
        listPrice: 0.98,
      },
      {
        sku: 'A163833BHA',
        partNumber: 'A163833BHA',
        productName: 'Etiqueta Poliéster Grado Industrial (Rev A)',
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
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23)',
        listPrice: 0.15,
      },
      {
        sku: 'NA698298',
        partNumber: 'NA698298',
        productName: 'Manual Drill DCD777 NA (Rev 09/24)',
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
    name: 'BLACK & DECKER (Stanley Black & Decker)',
    legalName: 'Stanley Black & Decker México S.A. de C.V. (Demo)',
    rfc: 'SBD920412R34',
    type: 'Empresa',
    phone: '(81) 8329-7000',
    email: 'contacto.compras@sbdinc-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-ind-sbd-2026',
    preferredPriceListName: 'Tarifa Corporativa Industrial B2B 2026',
    baseDiscountPct: 0,
    creditDays: 45,
    creditLimit: 2500000,
    status: 'Activo',
    industrialSector: 'Herramientas & Manufactura Global',
    notes: 'Cliente documentado en RTM. Manuales instructivos Offset (NA472050, NA698298). Entregas en Parque Industrial Milimex, Apodaca.',
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
        name: 'Ing. Carlos Mendoza (Demo)',
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
    code: 'CLI-TRC-002',
    name: 'TRICO TECHNOLOGIES CORPORATION',
    legalName: 'Trico Technologies Corporation (Demo)',
    rfc: 'TTC880315PL1',
    type: 'Empresa',
    phone: '(899) 921-4400',
    email: 'compras@trico-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-farmaceutica-2026',
    preferredPriceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    baseDiscountPct: 0,
    creditDays: 30,
    creditLimit: 1200000,
    status: 'Activo',
    industrialSector: 'Automotriz & Limpiaparabrisas',
    notes: 'Cliente documentado en RTM. Etiquetas flexográficas autoadheribles en bobina (IS-2420) para limpiaparabrisas.',
    addresses: [
      {
        id: 'addr-trc-01',
        type: 'Fiscal',
        street: 'Av. Parque Industrial Reynosa',
        extNumber: '200',
        neighborhood: 'Parque Industrial Reynosa',
        city: 'Reynosa',
        state: 'Tamaulipas',
        postalCode: '88780',
        reference: 'Planta Reynosa - Recepción de Materiales',
      },
    ],
    contacts: [
      {
        id: 'con-trc-01',
        name: 'Lic. Gabriela Lozano (Demo)',
        role: 'Abastecimientos & Calidad',
        email: 'glozano@trico-demo.com',
        phone: '(899) 921-4422',
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
    code: 'CLI-BIS-003',
    name: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    legalName: 'Bissell International Trading Company B.V. (Demo)',
    rfc: 'BIT041120TK8',
    type: 'Empresa',
    phone: '(81) 8865-1200',
    email: 'materials@bissell-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-flexo-2026',
    preferredPriceListName: 'Tarifa General Flexografía & Bobina 2026',
    baseDiscountPct: 0,
    creditDays: 30,
    creditLimit: 850000,
    status: 'Activo',
    industrialSector: 'Electrodomésticos & Cuidado del Hogar',
    notes: 'Cliente documentado en RTM. User Guides y manuales Offset en papel Bond (1641301).',
    addresses: [
      {
        id: 'addr-bis-01',
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
        id: 'con-bis-01',
        name: 'Lic. Fernando Arteaga (Demo)',
        role: 'Compras Empaque e Instructivos',
        email: 'farteaga@bissell-demo.com',
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
    code: 'CLI-TYC-004',
    name: 'TYCO (Johnson Controls)',
    legalName: 'Tyco Fire & Security México S.A. de C.V. (Demo)',
    rfc: 'TYC990708M12',
    type: 'Empresa',
    phone: '(81) 8221-5500',
    email: 'materiales@tyco-demo.com',
    preferredBranch: 'wh-alm-rtm',
    preferredBranchName: 'Planta Principal RTM',
    preferredPriceListId: 'pl-ind-sbd-2026',
    preferredPriceListName: 'Tarifa Corporativa Industrial B2B 2026',
    baseDiscountPct: 0,
    creditDays: 60,
    creditLimit: 1800000,
    status: 'Activo',
    industrialSector: 'Sistemas Contra Incendios & Seguridad Industrial',
    notes: 'Cliente documentado en RTM. Instructivos de seguridad e-Force (02-814-556).',
    addresses: [
      {
        id: 'addr-tyc-01',
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
        id: 'con-tyc-01',
        name: 'Ing. Ricardo Villalobos (Demo)',
        role: 'Planeación de Materiales',
        email: 'rvillalobos@tyco-demo.com',
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
    customerName: 'BLACK & DECKER (Stanley Black & Decker)',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'NA472050',
    revision: 'Rev 08/23 (Vigente)',
    technology: 'Offset',
    requiredDate: '25 Sep 2026',
    specifications: 'Papel Bond 75 g (BOND_75_B17), 24 páginas interiores en grapa al lomo, 1x1 tinta negra, doblado y grapado automático.',
    paymentConditions: 'Crédito comercial 45 días',
    estimatedDeliveryDays: 15,
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Manual Cordless Recip Saw DCS382 NA. Tiraje industrial 30,000 pzas. 5,000 pzas listas en PT; 25,000 por producir.',
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
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA',
        revision: 'Rev 08/23 (Vigente)',
        technology: 'Offset',
        specifications: 'Bond 75 g, 24 págs, 1x1 tinta negra, doblado y grapado al lomo.',
        brand: 'BLACK & DECKER',
        size: '24 páginas (14x21.5 cm)',
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

  // 2. COT-RTM-2026-0109: Etiqueta Flexo Trico (Autorizada)
  {
    id: 'cot-rtm-0109',
    folio: 'COT-RTM-2026-0109',
    createdAt: '28 Ago 2026',
    validUntil: '20 Sep 2026',
    customerId: 'cli-002',
    customerName: 'TRICO TECHNOLOGIES CORPORATION',
    customerRfc: 'TTC880315PL1',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-farmaceutica-2026',
    priceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'IS-2420',
    revision: 'Rev I-01 (Vigente)',
    technology: 'Flexografía',
    requiredDate: '15 Sep 2026',
    specifications: 'Fasson Thermal Transfer, 4 tintas UV Flexo + barniz sobreimpresión, rollo de 1,000 etiquetas con core de 3".',
    paymentConditions: 'Crédito comercial 30 días',
    estimatedDeliveryDays: 10,
    deliveryAddress: 'Av. Parque Industrial Reynosa #200, Reynosa, Tamps.',
    notes: 'Slide-In Label Wiper Blade. Inspeccionadas por QA y listas para entrega.',
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
        sku: 'IS-2420',
        partNumber: 'IS-2420',
        productName: 'Slide-In Label Wiper Blade',
        revision: 'Rev I-01 (Vigente)',
        technology: 'Flexografía',
        specifications: 'Fasson Thermal Transfer, 4 tintas UV + Barniz.',
        brand: 'TRICO',
        size: 'Rollo 4x6" (1,000 etiquetas)',
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
    policyReasons: ['Tarifa industrial validada con departamento de aseguramiento de calidad.'],
    authorizationLog: {
      authorizedBy: 'Gerencia Técnica RTM',
      authorizedAt: '29 Ago 2026',
      notes: 'Autorizada con especificación de herramentales flexo listos.',
      action: 'Autorizada',
    },
  },

  // 3. COT-RTM-2026-0110: TYCO Instructivo (Pendiente de Autorización)
  {
    id: 'cot-rtm-0110',
    folio: 'COT-RTM-2026-0110',
    createdAt: '30 Ago 2026',
    validUntil: '25 Sep 2026',
    customerId: 'cli-004',
    customerName: 'TYCO (Johnson Controls)',
    customerRfc: 'TYC990708M12',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: '02-814-556',
    revision: 'Rev B (Vigente)',
    technology: 'Offset',
    requiredDate: '30 Sep 2026',
    specifications: 'Papel Couché 100g (COUCHE_100_PM2), 4x4 tintas proceso CMYK + Barniz de protección.',
    paymentConditions: 'Crédito comercial 60 días',
    estimatedDeliveryDays: 18,
    deliveryAddress: 'Av. Las Torres #500, Parque Industrial Finsa, Guadalupe N.L.',
    notes: 'Instructivo e-Force Seguridad Contra Incendios. Solicitud de descuento especial por volumen de 40,000 piezas.',
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
        sku: '02-814-556',
        partNumber: '02-814-556',
        productName: 'Instructivo e-Force Seguridad Contra Incendios',
        revision: 'Rev B (Vigente)',
        technology: 'Offset',
        specifications: 'Couché 100g, 4x4 tintas CMYK + Barniz.',
        brand: 'TYCO',
        size: 'Tríptico 21.5x28 cm',
        unit: 'pza',
        quantity: 40000,
        listPrice: 1.35,
        discountPct: 0,
        netPrice: 1.35,
        subtotal: 54000,
        costReference: 1.25,
        localStock: 15000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 54000,
      totalDiscountAmount: 0,
      subtotalNet: 54000,
      taxIva: 8640,
      total: 62640,
      estimatedCost: 50000,
      estimatedMarginAmount: 4000,
      estimatedMarginPct: 7.4,
    },
    policyStatus: 'Requiere autorización',
    policyReasons: ['Plazo solicitado de 60 días supera estándar de 45 días.'],
  },

  // 4. COT-RTM-2026-0111: Manual Drill DCD777 NA 48 páginas (Enviada al cliente)
  {
    id: 'cot-rtm-0111',
    folio: 'COT-RTM-2026-0111',
    createdAt: '01 Sep 2026',
    validUntil: '25 Sep 2026',
    customerId: 'cli-001',
    customerName: 'BLACK & DECKER (Stanley Black & Decker)',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-ind-sbd-2026',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'NA698298',
    revision: 'Rev 09/24 (Vigente)',
    technology: 'Offset',
    requiredDate: '05 Oct 2026',
    specifications: 'Interiores Bond 75g (BOND_75) + Portada Couché 100g (COUCHE_100), lomo cuadrado Hot-melt.',
    paymentConditions: 'Crédito comercial 45 días',
    estimatedDeliveryDays: 20,
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Cotización formal enviada por correo al contacto de compras. En espera de emisión de Orden de Compra.',
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
        sku: 'NA698298',
        partNumber: 'NA698298',
        productName: 'Manual Drill DCD777 NA',
        revision: 'Rev 09/24 (Vigente)',
        technology: 'Offset',
        specifications: 'Bond 75g int + Couché 100g portada, Hotmelt.',
        brand: 'BLACK & DECKER',
        size: '48 páginas (14x21.5 cm)',
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

  // 5. COT-RTM-2026-0112: Bissell User Guide POWERFORCE HELIX (Borrador)
  {
    id: 'cot-rtm-0112',
    folio: 'COT-RTM-2026-0112',
    createdAt: '02 Sep 2026',
    validUntil: '30 Sep 2026',
    customerId: 'cli-003',
    customerName: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    customerRfc: 'BIT041120TK8',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    priceListId: 'pl-flexo-2026',
    priceListName: 'Tarifa General Flexografía & Bobina 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: '1641301',
    revision: 'Rev .02/24 (Vigente)',
    technology: 'Offset',
    requiredDate: '10 Oct 2026',
    specifications: 'Papel Bond 60g (BOND_60_B4), 2 tintas, doblado y grapado.',
    paymentConditions: 'Crédito comercial 30 días',
    estimatedDeliveryDays: 12,
    deliveryAddress: 'Carretera a Laredo Km 18, General Escobedo N.L.',
    notes: 'User Guide POWERFORCE HELIX 16 páginas. Borrador en preparación técnica por ingeniería de producto.',
    status: 'Borrador',
    items: [
      {
        id: 'cot-it-05',
        sku: '1641301',
        partNumber: '1641301',
        productName: 'User Guide POWERFORCE HELIX',
        revision: 'Rev .02/24 (Vigente)',
        technology: 'Offset',
        specifications: 'Bond 60g, 2 tintas, doblado y grapado.',
        brand: 'BISSELL',
        size: '16 páginas (14x21.5 cm)',
        unit: 'pza',
        quantity: 20000,
        listPrice: 1.95,
        discountPct: 0,
        netPrice: 1.95,
        subtotal: 39000,
        costReference: 1.65,
        localStock: 10000,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 39000,
      totalDiscountAmount: 0,
      subtotalNet: 39000,
      taxIva: 6240,
      total: 45240,
      estimatedCost: 33000,
      estimatedMarginAmount: 6000,
      estimatedMarginPct: 15.3,
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
    customerName: 'BLACK & DECKER (Stanley Black & Decker)',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'NA472050',
    revision: 'Rev 08/23 (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '25 Sep 2026',
    targetDeliveryDate: '25 Sep 2026',
    paymentConditions: 'Crédito comercial 45 días',
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Manual Cordless Recip Saw DCS382 NA. Orden de Compra confirmada: PO-SBD-88410. Tiraje 30,000 pzas. 5,000 pzas listas en PT; 25,000 por producir.',
    status: 'En preparación',
    ptAvailability: {
      orderedQty: 30000,
      availablePt: 5000,
      reservableQty: 5000,
      missingToProduce: 25000,
    },
    materialStatus: {
      insufficientMaterial: true,
      materialName: 'Papel Bond 75g Bobina (BOND_75)',
      materialSku: 'BOND-75-B17',
      alertMessage: 'Faltan 4 bobinas de Papel Bond 75g (BOND-75-B17) para completar el tiraje de 25,000 pzas faltantes. Requisición REQ-2026-018 / OC-RTM-2026-0089 en tránsito.',
      relatedRequisitionFolio: 'REQ-2026-018',
      relatedPoFolio: 'OC-RTM-2026-0089',
    },
    items: [
      {
        id: 'ord-it-01',
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA',
        revision: 'Rev 08/23 (Vigente)',
        technology: 'Offset',
        brand: 'BLACK & DECKER',
        size: '24 páginas (14x21.5 cm)',
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
          sku: 'BOND-75-B17',
          name: 'Papel Bond 75g Bobina (BOND_75)',
          isInsufficient: true,
          requiredQty: '4 bobinas (Ancho 17")',
          availableQty: '1 bobina en almacén',
          missingQty: '3 bobinas pendientes',
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
    customerPo: 'PO-TRC-2026-991',
    createdAt: '29 Ago 2026',
    customerId: 'cli-002',
    customerName: 'TRICO TECHNOLOGIES CORPORATION',
    customerRfc: 'TTC880315PL1',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Grado Farmacéutico & Cosmético 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'IS-2420',
    revision: 'Rev I-01 (Vigente)',
    technology: 'Flexografía',
    isObsoleteRevision: false,
    requiredDate: '15 Sep 2026',
    targetDeliveryDate: '15 Sep 2026',
    paymentConditions: 'Crédito comercial 30 días',
    deliveryAddress: 'Av. Parque Industrial Reynosa #200, Reynosa, Tamps.',
    notes: 'Slide-In Label Wiper Blade. 24 rollos de etiquetas terminados (24,000 etiquetas). Inspeccionadas por QA y listas para entrega.',
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
        sku: 'IS-2420',
        partNumber: 'IS-2420',
        productName: 'Slide-In Label Wiper Blade',
        revision: 'Rev I-01 (Vigente)',
        technology: 'Flexografía',
        brand: 'TRICO',
        size: 'Rollo 4x6" (1,000 etiquetas)',
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
    customerPo: 'PO-TYC-44120',
    createdAt: '30 Ago 2026',
    customerId: 'cli-004',
    customerName: 'TYCO (Johnson Controls)',
    customerRfc: 'TYC990708M12',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: '02-814-556',
    revision: 'Rev B (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '30 Sep 2026',
    targetDeliveryDate: '30 Sep 2026',
    paymentConditions: 'Crédito comercial 60 días',
    deliveryAddress: 'Av. Las Torres #500, Parque Industrial Finsa, Guadalupe N.L.',
    notes: 'Instructivo e-Force Seguridad Contra Incendios. Pedido de 40,000 piezas. PT disponible: 15,000 pzas; Faltante por producir: 25,000 pzas.',
    status: 'Pendiente de autorización',
    ptAvailability: {
      orderedQty: 40000,
      availablePt: 15000,
      reservableQty: 15000,
      missingToProduce: 25000,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-03',
        sku: '02-814-556',
        partNumber: '02-814-556',
        productName: 'Instructivo e-Force Seguridad Contra Incendios',
        revision: 'Rev B (Vigente)',
        technology: 'Offset',
        brand: 'TYCO',
        size: 'Tríptico 21.5x28 cm',
        unit: 'pza',
        quantity: 40000,
        unitPrice: 1.35,
        subtotal: 54000,
        costReference: 1.25,
        localStock: 15000,
        availablePt: 15000,
        reservableQty: 15000,
        missingToProduce: 25000,
      },
    ],
    financials: {
      subtotal: 54000,
      discountAmount: 0,
      taxIva: 8640,
      total: 62640,
      estimatedCost: 50000,
      estimatedMarginAmount: 4000,
      estimatedMarginPct: 7.4,
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
    customerName: 'BLACK & DECKER (Stanley Black & Decker)',
    customerRfc: 'SBD920412R34',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa Corporativa Industrial B2B 2026',
    sellerName: 'Ing. Alejandro Garza (Cuentas Industriales)',
    partNumber: 'NA472050',
    revision: 'Rev 01/22 (OBSOLETA)',
    technology: 'Offset',
    isObsoleteRevision: true,
    requiredDate: '10 Ago 2026',
    targetDeliveryDate: '10 Ago 2026',
    paymentConditions: 'Crédito comercial 45 días',
    deliveryAddress: 'Av. Industria Pesada #1000, Parque Industrial Milimex, Apodaca N.L.',
    notes: 'Lote histórico fabricado con versión de arte previa (Rev 01/22). Entregado y liquidado.',
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
        sku: 'NA472050',
        partNumber: 'NA472050',
        productName: 'Manual Cordless Recip Saw DCS382 NA (Rev 01/22)',
        revision: 'Rev 01/22 (OBSOLETA)',
        technology: 'Offset',
        isObsoleteRevision: true,
        brand: 'BLACK & DECKER',
        size: '24 páginas (14x21.5 cm)',
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
    customerPo: 'PO-BIS-55109',
    createdAt: '25 Ago 2026',
    customerId: 'cli-003',
    customerName: 'BISSELL INTERNATIONAL TRADING COMPANY B.V.',
    customerRfc: 'BIT041120TK8',
    customerType: 'Empresa',
    branchId: 'wh-alm-rtm',
    branchName: 'Planta Principal RTM',
    fulfillmentOriginId: 'wh-alm-rtm',
    fulfillmentOriginName: 'Almacén Principal RTM',
    priceListName: 'Tarifa General Flexografía & Bobina 2026',
    sellerName: 'Lic. Claudia Morales (Ejecutiva Comercial)',
    partNumber: '1641301',
    revision: 'Rev .02/24 (Vigente)',
    technology: 'Offset',
    isObsoleteRevision: false,
    requiredDate: '18 Sep 2026',
    targetDeliveryDate: '18 Sep 2026',
    paymentConditions: 'Crédito comercial 30 días',
    deliveryAddress: 'Carretera a Laredo Km 18, General Escobedo N.L.',
    notes: 'User Guide POWERFORCE HELIX. 20,000 piezas solicitadas. 10,000 piezas en stock PT, 10,000 en proceso de doblado y grapado.',
    status: 'En preparación',
    ptAvailability: {
      orderedQty: 20000,
      availablePt: 10000,
      reservableQty: 10000,
      missingToProduce: 10000,
    },
    materialStatus: {
      insufficientMaterial: false,
    },
    items: [
      {
        id: 'ord-it-05',
        sku: '1641301',
        partNumber: '1641301',
        productName: 'User Guide POWERFORCE HELIX',
        revision: 'Rev .02/24 (Vigente)',
        technology: 'Offset',
        brand: 'BISSELL',
        size: '16 páginas (14x21.5 cm)',
        unit: 'pza',
        quantity: 20000,
        unitPrice: 1.95,
        subtotal: 39000,
        costReference: 1.65,
        localStock: 10000,
        availablePt: 10000,
        reservableQty: 10000,
        missingToProduce: 10000,
      },
    ],
    financials: {
      subtotal: 39000,
      discountAmount: 0,
      taxIva: 6240,
      total: 45240,
      estimatedCost: 33000,
      estimatedMarginAmount: 6000,
      estimatedMarginPct: 15.3,
    },
  },
];

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
    sku: 'NA472050',
    productName: 'Manual Cordless Recip Saw DCS382 NA (Rev 08/23)',
    brand: 'BLACK & DECKER',
    size: '24 páginas (14x21.5 cm)',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 30000,
    availableStock: 5000,
    coverageDays: 5.0,
    suggestedRequisitionQty: 25000,
    urgency: 'Alta',
    materialRequired: 'Papel Bond 75g Bobina (BOND-75-B17) - 4 bobinas',
  },
  {
    id: 'hls-02',
    sku: '02-814-556',
    productName: 'Instructivo e-Force Seguridad Contra Incendios (Rev B)',
    brand: 'TYCO',
    size: 'Tríptico 21.5x28 cm',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 40000,
    availableStock: 15000,
    coverageDays: 11.2,
    suggestedRequisitionQty: 25000,
    urgency: 'Media',
    materialRequired: 'Papel Couché 100g (MP-COU-100)',
  },
  {
    id: 'hls-03',
    sku: 'IS-2420',
    productName: 'Slide-In Label Wiper Blade (Rev I-01)',
    brand: 'TRICO',
    size: 'Rollo 4x6" (1,000 etiquetas)',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 50000,
    availableStock: 12000,
    coverageDays: 7.2,
    suggestedRequisitionQty: 26000,
    urgency: 'Alta',
    materialRequired: 'Fasson Thermal Transfer (MP-FAS-TT)',
  },
  {
    id: 'hls-04',
    sku: 'A163833BHA',
    productName: 'Etiqueta Poliéster Grado Industrial (Rev A)',
    brand: 'ENTAIL',
    size: 'Rollo 2x4" (2,000 etiquetas)',
    branchId: 'wh-alm-rtm',
    branchName: 'Almacén Principal RTM',
    recentSales30d: 20000,
    availableStock: 8000,
    coverageDays: 12.0,
    suggestedRequisitionQty: 12000,
    urgency: 'Media',
    materialRequired: '3M 7850 HL Poliéster Autoadherible',
  },
];

