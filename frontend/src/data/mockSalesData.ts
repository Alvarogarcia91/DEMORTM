import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';

// ============================================================================
// 1. LISTAS DE PRECIOS DE VENTA (SALES PRICE LISTS)
// ============================================================================
export interface SalesPriceTier {
  minQty: number;
  maxQty?: number;
  price: number;
}

export interface SalesPriceListItem {
  sku: string;
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
    id: 'pl-general-2026',
    code: 'PL-RET-2026',
    name: 'Lista General Retail 2026',
    currency: 'MXN',
    validFrom: '01 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Precios sugeridos de venta al público en general para piso de venta y sucursales.',
    targetType: 'General',
    items: [
      {
        sku: 'SC-NAYT-FLOW-IND',
        listPrice: 7499,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 7499 },
          { minQty: 5, maxQty: 9, price: 7249 },
          { minQty: 10, price: 6999 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-MAT',
        listPrice: 9499,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 9499 },
          { minQty: 5, maxQty: 9, price: 9199 },
          { minQty: 10, price: 8899 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-QS',
        listPrice: 11299,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 11299 },
          { minQty: 5, maxQty: 9, price: 10899 },
          { minQty: 10, price: 10499 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-KS',
        listPrice: 13999,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 13999 },
          { minQty: 5, maxQty: 9, price: 13499 },
          { minQty: 10, price: 12999 },
        ],
      },
      {
        sku: 'SC-REST-ORTO-MAT',
        listPrice: 8899,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 8899 },
          { minQty: 5, maxQty: 9, price: 8599 },
          { minQty: 10, price: 8299 },
        ],
      },
      {
        sku: 'SC-REST-ORTO-KS',
        listPrice: 12499,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 12499 },
          { minQty: 5, maxQty: 9, price: 11999 },
          { minQty: 10, price: 11499 },
        ],
      },
      {
        sku: 'SC-SPRI-PERF-IND',
        listPrice: 6899,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 6899 },
          { minQty: 5, maxQty: 9, price: 6599 },
          { minQty: 10, price: 6299 },
        ],
      },
      {
        sku: 'SC-SPRI-PERF-MAT',
        listPrice: 8499,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 8499 },
          { minQty: 5, maxQty: 9, price: 8199 },
          { minQty: 10, price: 7899 },
        ],
      },
      {
        sku: 'SC-SEAL-POST-QS',
        listPrice: 16999,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 16999 },
          { minQty: 5, maxQty: 9, price: 16299 },
          { minQty: 10, price: 15599 },
        ],
      },
      {
        sku: 'SC-AMER-HALS-KS',
        listPrice: 14599,
        volumeTiers: [
          { minQty: 1, maxQty: 4, price: 14599 },
          { minQty: 5, maxQty: 9, price: 13999 },
          { minQty: 10, price: 13399 },
        ],
      },
    ],
  },
  {
    id: 'pl-suc-norte-2026',
    code: 'PL-NORTE-2026',
    name: 'Lista Sucursales Norte 2026',
    currency: 'MXN',
    validFrom: '15 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Tarifario regional con flete consolidado para sucursales de Nuevo León y Coahuila.',
    targetType: 'Sucursal',
    branchApplicability: ['wh-suc-valle-oriente', 'wh-suc-cumbres'],
    items: [
      { sku: 'SC-NAYT-FLOW-IND', listPrice: 7299 },
      { sku: 'SC-NAYT-FLOW-MAT', listPrice: 9299 },
      { sku: 'SC-NAYT-FLOW-QS', listPrice: 10999 },
      { sku: 'SC-NAYT-FLOW-KS', listPrice: 13699 },
      { sku: 'SC-REST-ORTO-MAT', listPrice: 8699 },
      { sku: 'SC-REST-ORTO-KS', listPrice: 12199 },
      { sku: 'SC-SPRI-PERF-IND', listPrice: 6699 },
      { sku: 'SC-SPRI-PERF-MAT', listPrice: 8299 },
      { sku: 'SC-SEAL-POST-QS', listPrice: 16499 },
      { sku: 'SC-AMER-HALS-KS', listPrice: 14199 },
    ],
  },
  {
    id: 'pl-promo-agosto',
    code: 'PL-PROMO-AGO',
    name: 'Lista Promoción Agosto',
    currency: 'MXN',
    validFrom: '01 Ago 2026',
    validTo: '31 Ago 2026',
    status: 'Vigente',
    description: 'Campaña especial de descanso de verano con bonificación comercial directa.',
    targetType: 'Promoción',
    items: [
      { sku: 'SC-NAYT-FLOW-IND', listPrice: 6999 },
      { sku: 'SC-NAYT-FLOW-MAT', listPrice: 8799 },
      { sku: 'SC-NAYT-FLOW-QS', listPrice: 10499 },
      { sku: 'SC-NAYT-FLOW-KS', listPrice: 12999 },
      { sku: 'SC-REST-ORTO-MAT', listPrice: 8199 },
      { sku: 'SC-REST-ORTO-KS', listPrice: 11499 },
      { sku: 'SC-SPRI-PERF-IND', listPrice: 6299 },
      { sku: 'SC-SPRI-PERF-MAT', listPrice: 7799 },
      { sku: 'SC-SEAL-POST-QS', listPrice: 15499 },
      { sku: 'SC-AMER-HALS-KS', listPrice: 13299 },
    ],
  },
  {
    id: 'pl-convenio-empresas',
    code: 'PL-CONV-EMP',
    name: 'Lista Convenio Empresas',
    currency: 'MXN',
    validFrom: '01 Ene 2026',
    validTo: '31 Dic 2026',
    status: 'Vigente',
    description: 'Precios preferenciales para corporativos, cadenas hoteleras y desarrolladoras inmobiliarias.',
    targetType: 'Convenio',
    items: [
      {
        sku: 'SC-NAYT-FLOW-IND',
        listPrice: 6699,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 6699 },
          { minQty: 10, price: 6299 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-MAT',
        listPrice: 8499,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 8499 },
          { minQty: 10, price: 7999 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-QS',
        listPrice: 9999,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 9999 },
          { minQty: 10, price: 9499 },
        ],
      },
      {
        sku: 'SC-NAYT-FLOW-KS',
        listPrice: 12499,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 12499 },
          { minQty: 10, price: 11899 },
        ],
      },
      {
        sku: 'SC-REST-ORTO-MAT',
        listPrice: 7799,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 7799 },
          { minQty: 10, price: 7399 },
        ],
      },
      {
        sku: 'SC-REST-ORTO-KS',
        listPrice: 10999,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 10999 },
          { minQty: 10, price: 10399 },
        ],
      },
      {
        sku: 'SC-SPRI-PERF-IND',
        listPrice: 5999,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 5999 },
          { minQty: 10, price: 5699 },
        ],
      },
      {
        sku: 'SC-SPRI-PERF-MAT',
        listPrice: 7399,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 7399 },
          { minQty: 10, price: 6999 },
        ],
      },
      {
        sku: 'SC-SEAL-POST-QS',
        listPrice: 14799,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 14799 },
          { minQty: 10, price: 13999 },
        ],
      },
      {
        sku: 'SC-AMER-HALS-KS',
        listPrice: 12699,
        volumeTiers: [
          { minQty: 1, maxQty: 9, price: 12699 },
          { minQty: 10, price: 11999 },
        ],
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
    const fallbackPrice = master?.commercial.referenceListPrice || 6999;
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

  if (params.maxDiscountPct > 10) {
    requiresSpecialAuth = true;
    reasons.push('Descuento máximo de ' + params.maxDiscountPct.toFixed(1) + '% excede el 10% (Requiere Gerencia General).');
  } else if (params.maxDiscountPct > 5) {
    requiresCommercialAuth = true;
    reasons.push('Descuento de ' + params.maxDiscountPct.toFixed(1) + '% supera el 5% de piso (Requiere Gerencia Comercial).');
  }

  if (params.hasManualPrice) {
    requiresCommercialAuth = true;
    reasons.push('Se ingresó uno o más precios unitarios manuales fuera de lista estándar.');
  }

  if (params.estimatedMarginPct < 20) {
    requiresSpecialAuth = true;
    reasons.push('Margen comercial estimado de ' + params.estimatedMarginPct.toFixed(1) + '% es inferior al umbral crítico del 20%.');
  } else if (params.estimatedMarginPct < 30) {
    requiresCommercialAuth = true;
    reasons.push('Margen comercial de ' + params.estimatedMarginPct.toFixed(1) + '% está en rango de atención (20% - 29.9%).');
  }

  const isRequires = requiresCommercialAuth || requiresSpecialAuth;

  return {
    status: isRequires ? 'Requiere autorización' : 'Dentro de política',
    isAuthorizedAutomatically: !isRequires,
    requiresCommercialAuth,
    requiresSpecialAuth,
    reasons: reasons.length > 0 ? reasons : ['Cotización cumple 100% las políticas de precio, descuento y margen.'],
    severity: requiresSpecialAuth ? 'critical' : requiresCommercialAuth ? 'warning' : 'normal',
  };
};

// ============================================================================
// 3. CLIENTES (SALES CUSTOMERS)
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
  type: 'Fiscal' | 'Entrega' | 'Sucursal';
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
}

export const INITIAL_MOCK_SALES_CUSTOMERS: SalesCustomer[] = [
  {
    id: 'cli-001',
    code: 'CLI-2026-001',
    name: 'Roberto Cantú Garza',
    legalName: 'Roberto Cantú Garza',
    rfc: 'CAGR850412H89',
    type: 'Persona',
    phone: '(81) 8345-8921',
    email: 'roberto.cantu@gmail.com',
    preferredBranch: 'wh-suc-valle-oriente',
    preferredBranchName: 'Sucursal Valle Oriente',
    preferredPriceListId: 'pl-general-2026',
    preferredPriceListName: 'Lista General Retail 2026',
    baseDiscountPct: 0,
    creditDays: 0,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-01',
        type: 'Entrega',
        street: 'Av. Vasconcelos',
        extNumber: '1420',
        neighborhood: 'Del Valle',
        city: 'San Pedro Garza García',
        state: 'Nuevo León',
        postalCode: '66220',
        reference: 'Residencia portón negro',
      },
    ],
    contacts: [
      {
        id: 'con-01',
        name: 'Roberto Cantú',
        role: 'Titular',
        email: 'roberto.cantu@gmail.com',
        phone: '(81) 8345-8921',
        isMain: true,
      },
    ],
    totalQuotesCount: 4,
    totalOrdersCount: 3,
    totalSpent: 48990,
    lastPurchaseDate: '18 Ago 2026',
    createdAt: '10 Feb 2025',
    notes: 'Cliente frecuente de San Pedro. Prefiere colchones firmes y entrega sábado por la mañana.',
  },
  {
    id: 'cli-002',
    code: 'CLI-2026-002',
    name: 'Desarrollos Residenciales del Norte S.A.',
    legalName: 'Desarrollos Residenciales del Norte S.A. de C.V.',
    rfc: 'DRN120315KJ8',
    type: 'Empresa',
    phone: '(81) 8122-9000',
    email: 'compras@desarrollosnorte.mx',
    preferredBranch: 'wh-suc-valle-oriente',
    preferredBranchName: 'Sucursal Valle Oriente',
    preferredPriceListId: 'pl-convenio-empresas',
    preferredPriceListName: 'Lista Convenio Empresas',
    baseDiscountPct: 5,
    creditDays: 30,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-02',
        type: 'Fiscal',
        street: 'Calzada San Pedro',
        extNumber: '250',
        intNumber: 'Piso 8',
        neighborhood: 'Miravalle',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64660',
      },
      {
        id: 'addr-03',
        type: 'Entrega',
        street: 'Av. Eugenio Garza Sada',
        extNumber: '3800',
        neighborhood: 'Contry',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64860',
        reference: 'Edificio Torre Albasur (Descarga en sótano 1)',
      },
    ],
    contacts: [
      {
        id: 'con-02',
        name: 'Lic. Mariana Villarreal',
        role: 'Gerente de Compras & Proyectos',
        email: 'mariana.villarreal@desarrollosnorte.mx',
        phone: '(81) 8122-9014',
        isMain: true,
      },
      {
        id: 'con-03',
        name: 'Ing. Carlos Elizondo',
        role: 'Residente de Obra',
        email: 'carlos.elizondo@desarrollosnorte.mx',
        phone: '(81) 8122-9055',
        isMain: false,
      },
    ],
    totalQuotesCount: 7,
    totalOrdersCount: 5,
    totalSpent: 342500,
    lastPurchaseDate: '24 Ago 2026',
    createdAt: '14 May 2024',
    notes: 'Equipamiento de departamentos amueblados. Requiere entregas programadas con maniobra a piso.',
  },
  {
    id: 'cli-003',
    code: 'CLI-2026-003',
    name: 'Grupo Hotelero Sierra Madre',
    legalName: 'Grupo Hotelero Sierra Madre S.A.P.I. de C.V.',
    rfc: 'HSM1809204A2',
    type: 'Convenio',
    phone: '(81) 8299-4400',
    email: 'adquisiciones@hotelsierramadre.com',
    preferredBranch: 'wh-suc-cumbres',
    preferredBranchName: 'Sucursal Cumbres',
    preferredPriceListId: 'pl-convenio-empresas',
    preferredPriceListName: 'Lista Convenio Empresas',
    baseDiscountPct: 7,
    creditDays: 45,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-04',
        type: 'Entrega',
        street: 'Av. Paseo de los Leones',
        extNumber: '2800',
        neighborhood: 'Cumbres 4to Sector',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64610',
        reference: 'Recepción de Proveedores Hotel Cumbres Grand',
      },
    ],
    contacts: [
      {
        id: 'con-04',
        name: 'Lic. Fernando Benavides',
        role: 'Director de Adquisiciones',
        email: 'fbenavides@hotelsierramadre.com',
        phone: '(81) 8299-4412',
        isMain: true,
      },
    ],
    totalQuotesCount: 9,
    totalOrdersCount: 6,
    totalSpent: 520000,
    lastPurchaseDate: '26 Ago 2026',
    createdAt: '20 Ene 2024',
    notes: 'Convenio corporativo de renovación anual de colchones King Size y Matrimoniales.',
  },
  {
    id: 'cli-004',
    code: 'CLI-2026-004',
    name: 'Dra. Gabriela Morales Hinojosa',
    legalName: 'Gabriela Morales Hinojosa',
    rfc: 'MOHG791102TY1',
    type: 'Persona',
    phone: '(81) 8115-3210',
    email: 'gaby.morales@clinicadesalud.com',
    preferredBranch: 'wh-suc-cumbres',
    preferredBranchName: 'Sucursal Cumbres',
    preferredPriceListId: 'pl-general-2026',
    preferredPriceListName: 'Lista General Retail 2026',
    baseDiscountPct: 0,
    creditDays: 0,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-05',
        type: 'Entrega',
        street: 'Paseo de la Cima',
        extNumber: '112',
        neighborhood: 'Cumbres Elite',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64619',
      },
    ],
    contacts: [
      {
        id: 'con-05',
        name: 'Gabriela Morales',
        role: 'Titular',
        email: 'gaby.morales@clinicadesalud.com',
        phone: '(81) 8115-3210',
        isMain: true,
      },
    ],
    totalQuotesCount: 2,
    totalOrdersCount: 2,
    totalSpent: 31498,
    lastPurchaseDate: '12 Ago 2026',
    createdAt: '05 Mar 2026',
    notes: 'Especial interés en línea viscoelástica Nayt Flow y protectores impermeables.',
  },
  {
    id: 'cli-005',
    code: 'CLI-2026-005',
    name: 'Inmobiliaria & Rentas Cumbres S.A.',
    legalName: 'Inmobiliaria & Rentas Cumbres S.A. de C.V.',
    rfc: 'IRC1904107F3',
    type: 'Empresa',
    phone: '(81) 8370-1122',
    email: 'contacto@rentascumbres.com',
    preferredBranch: 'wh-suc-cumbres',
    preferredBranchName: 'Sucursal Cumbres',
    preferredPriceListId: 'pl-suc-norte-2026',
    preferredPriceListName: 'Lista Sucursales Norte 2026',
    baseDiscountPct: 3,
    creditDays: 15,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-06',
        type: 'Entrega',
        street: 'Alejandro de Rodas',
        extNumber: '310',
        neighborhood: 'Cumbres 5to Sector',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64610',
      },
    ],
    contacts: [
      {
        id: 'con-06',
        name: 'Arq. Esteban Treviño',
        role: 'Administrador de Inmuebles',
        email: 'esteban@rentascumbres.com',
        phone: '(81) 8370-1125',
        isMain: true,
      },
    ],
    totalQuotesCount: 5,
    totalOrdersCount: 4,
    totalSpent: 124800,
    lastPurchaseDate: '21 Ago 2026',
    createdAt: '08 Nov 2025',
    notes: 'Compra lotes de 4 a 8 colchones para casas de renta temporal.',
  },
  {
    id: 'cli-006',
    code: 'CLI-2026-006',
    name: 'Hotel Boutique Las Lomas',
    legalName: 'Operadora Hotelera Las Lomas S.A. de C.V.',
    rfc: 'OHL1806149L2',
    type: 'Convenio',
    phone: '(81) 8335-9000',
    email: 'compras@hotellaslomas.mx',
    preferredBranch: 'wh-suc-valle-oriente',
    preferredBranchName: 'Sucursal Valle Oriente',
    preferredPriceListId: 'pl-convenio-empresas',
    preferredPriceListName: 'Lista Convenio Empresas',
    baseDiscountPct: 6,
    creditDays: 30,
    status: 'Activo',
    addresses: [
      {
        id: 'addr-07',
        type: 'Fiscal',
        street: 'Av. Eugenio Garza Lagüera',
        extNumber: '2100',
        neighborhood: 'Valle Oriente',
        city: 'San Pedro Garza García',
        state: 'Nuevo León',
        postalCode: '66260',
      },
    ],
    contacts: [
      {
        id: 'con-07',
        name: 'Lic. Mariana Morales Hinojosa',
        role: 'Gerente de Compras & Hospitalidad',
        email: 'mmorales@hotellaslomas.mx',
        phone: '(81) 8335-9010',
        isMain: true,
      },
    ],
    totalQuotesCount: 6,
    totalOrdersCount: 4,
    totalSpent: 289400,
    lastPurchaseDate: '15 Ago 2026',
    createdAt: '12 Feb 2025',
    notes: 'Renovación anual de suites y equipamiento de colchones hoteleros de alta gama.',
  },
];

// ============================================================================
// 4. COTIZACIONES (SALES QUOTES)
// ============================================================================
export interface SalesQuoteItem {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
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
  authorizationLog?: {
    authorizedBy?: string;
    authorizedAt?: string;
    notes?: string;
    action: 'Pendiente' | 'Autorizada' | 'Rechazada' | 'Ajuste solicitado';
  };
  generatedOrderFolio?: string;
}

export const INITIAL_MOCK_SALES_QUOTES: SalesQuote[] = [
  {
    id: 'cot-001',
    folio: 'COT-2026-0041',
    createdAt: '26 Ago 2026',
    validUntil: '10 Sep 2026',
    customerId: 'cli-002',
    customerName: 'Desarrollos Residenciales del Norte S.A.',
    customerRfc: 'DRN120315KJ8',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    priceListId: 'pl-convenio-empresas',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'item-01',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 8,
        listPrice: 6699,
        discountPct: 5,
        netPrice: 6364.05,
        subtotal: 50912.4,
        costReference: 2950,
        localStock: 12,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
      {
        id: 'item-02',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 6,
        listPrice: 8499,
        discountPct: 5,
        netPrice: 8074.05,
        subtotal: 48444.3,
        costReference: 3800,
        localStock: 9,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 104584,
      totalDiscountAmount: 5227.3,
      subtotalNet: 99356.7,
      taxIva: 15897.07,
      total: 115253.77,
      estimatedCost: 46400,
      estimatedMarginAmount: 52956.7,
      estimatedMarginPct: 53.3,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Descuento de 5% dentro del convenio autorizado.', 'Margen estimado de 53.3% excede el umbral del 30%.'],
    status: 'Aceptada',
    notes: 'Equipamiento de Torre Albasur departamentos tipo A y B. Entrega con maniobra.',
    paymentConditions: 'Crédito a 30 días.',
    estimatedDeliveryDays: 4,
    authorizationLog: {
      authorizedBy: 'Gerencia Comercial Norte',
      authorizedAt: '26 Ago 2026 11:30',
      notes: 'Aprobado conforme al tabulador de convenio corporativo 2026.',
      action: 'Autorizada',
    },
  },
  {
    id: 'cot-002',
    folio: 'COT-2026-0042',
    createdAt: '27 Ago 2026',
    validUntil: '11 Sep 2026',
    customerId: 'cli-003',
    customerName: 'Grupo Hotelero Sierra Madre',
    customerRfc: 'HSM1809204A2',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    priceListId: 'pl-convenio-empresas',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'item-03',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        quantity: 12,
        listPrice: 14799,
        discountPct: 8,
        netPrice: 12879.08,
        subtotal: 154548.96,
        costReference: 7800,
        localStock: 4,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
      {
        id: 'item-04',
        sku: 'SC-AMER-HALS-KS',
        productName: 'América Halston Ortopédico King Size',
        brand: 'América',
        size: 'King Size',
        quantity: 10,
        listPrice: 12699,
        discountPct: 8,
        netPrice: 11039.08,
        subtotal: 110390.8,
        costReference: 6200,
        localStock: 3,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 298976,
      totalDiscountAmount: 34036.24,
      subtotalNet: 264939.76,
      taxIva: 42390.36,
      total: 307330.12,
      estimatedCost: 155600,
      estimatedMarginAmount: 109339.76,
      estimatedMarginPct: 41.3,
    },
    policyStatus: 'Requiere autorización',
    policyReasons: [
      'Descuento solicitado de 8% supera el 5% estándar de piso (Requiere Gerencia Comercial).',
      'Disponibilidad local insuficiente en Sucursal Cumbres (requerirá traspaso desde CEDIS MTY Sur).',
    ],
    status: 'Pendiente de autorización',
    notes: 'Renovación de suites ejecutivas Cumbres Grand. Entrega escalonada en 2 etapas.',
    paymentConditions: 'Crédito 45 días corporativo.',
    estimatedDeliveryDays: 7,
  },
  {
    id: 'cot-003',
    folio: 'COT-2026-0043',
    createdAt: '27 Ago 2026',
    validUntil: '05 Sep 2026',
    customerId: 'cli-001',
    customerName: 'Roberto Cantú Garza',
    customerRfc: 'CAGR850412H89',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    priceListId: 'pl-general-2026',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'item-05',
        sku: 'SC-NAYT-FLOW-KS',
        productName: 'Nayt Colchón Flow Basic White King Size',
        brand: 'Nayt',
        size: 'King Size',
        quantity: 1,
        listPrice: 13999,
        discountPct: 0,
        netPrice: 13999,
        subtotal: 13999,
        costReference: 5900,
        localStock: 5,
        isManualPrice: false,
      },
    ],
    financials: {
      subtotalList: 13999,
      totalDiscountAmount: 0,
      subtotalNet: 13999,
      taxIva: 2239.84,
      total: 16238.84,
      estimatedCost: 5900,
      estimatedMarginAmount: 8099,
      estimatedMarginPct: 57.8,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Venta a precio de lista general sin descuento aplicado.'],
    status: 'Enviada al cliente',
    notes: 'Cliente probó el colchón en Bahía SHOW-02 de Valle Oriente.',
    paymentConditions: 'Pago de contado / Tarjeta bancaria 6 MSI.',
    estimatedDeliveryDays: 2,
  },
  {
    id: 'cot-004',
    folio: 'COT-2026-0038',
    createdAt: '22 Ago 2026',
    validUntil: '01 Sep 2026',
    customerId: 'cli-005',
    customerName: 'Inmobiliaria & Rentas Cumbres S.A.',
    customerRfc: 'IRC1904107F3',
    customerType: 'Empresa',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    priceListId: 'pl-suc-norte-2026',
    priceListName: 'Lista Sucursales Norte 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'item-06',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Ortopédico Extra Firme Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 4,
        listPrice: 8699,
        discountPct: 3,
        netPrice: 8438.03,
        subtotal: 33752.12,
        costReference: 3950,
        localStock: 6,
        isManualPrice: false,
      },
    ],
    financials: {
      subtotalList: 34796,
      totalDiscountAmount: 1043.88,
      subtotalNet: 33752.12,
      taxIva: 5400.34,
      total: 39152.46,
      estimatedCost: 15800,
      estimatedMarginAmount: 17952.12,
      estimatedMarginPct: 53.2,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Descuento del 3% dentro del margen permitido para compras multi-unidad.'],
    status: 'Convertida en pedido',
    generatedOrderFolio: 'PED-2026-0101',
    notes: 'Cotización cerrada satisfactoriamente.',
    paymentConditions: 'Transferencia bancaria SPEI contra entrega.',
    estimatedDeliveryDays: 3,
  },
  {
    id: 'cot-005',
    folio: 'COT-2026-0035',
    createdAt: '18 Ago 2026',
    validUntil: '25 Ago 2026',
    customerId: 'cli-004',
    customerName: 'Dra. Gabriela Morales Hinojosa',
    customerRfc: 'MOHG791102TY1',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    priceListId: 'pl-general-2026',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'item-07',
        sku: 'SC-SPRI-PERF-MAT',
        productName: 'Spring Air Performance Confort Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 2,
        listPrice: 8499,
        discountPct: 0,
        netPrice: 8499,
        subtotal: 16998,
        costReference: 3750,
        localStock: 4,
        isManualPrice: false,
      },
    ],
    financials: {
      subtotalList: 16998,
      totalDiscountAmount: 0,
      subtotalNet: 16998,
      taxIva: 2719.68,
      total: 19717.68,
      estimatedCost: 7500,
      estimatedMarginAmount: 9498,
      estimatedMarginPct: 55.9,
    },
    policyStatus: 'Dentro de política',
    policyReasons: ['Precio regular de lista.'],
    status: 'Vencida',
    notes: 'Vigencia de 7 días expiró sin confirmación del cliente.',
    paymentConditions: 'Contado.',
    estimatedDeliveryDays: 2,
  },
  {
    id: 'cot-006',
    folio: 'COT-2026-0044',
    createdAt: '28 Ago 2026',
    validUntil: '12 Sep 2026',
    customerId: 'cli-006',
    customerName: 'Hotel Boutique Las Lomas',
    customerRfc: 'OHL1806149L2',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    priceListId: 'pl-convenio-empresas',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'item-08',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 15,
        listPrice: 6699,
        discountPct: 6,
        netPrice: 5921.06,
        subtotal: 88815.9,
        costReference: 2950,
        localStock: 12,
        isManualPrice: false,
        hasVolumeTierApplied: true,
      },
    ],
    financials: {
      subtotalList: 94485,
      totalDiscountAmount: 5669.1,
      subtotalNet: 88815.9,
      taxIva: 14210.54,
      total: 103026.44,
      estimatedCost: 44250,
      estimatedMarginAmount: 44565.9,
      estimatedMarginPct: 50.2,
    },
    policyStatus: 'Requiere autorización',
    policyReasons: ['Descuento de 6% requiere visto bueno comercial por volumen mayor a 10 unidades.'],
    status: 'Pendiente de autorización',
    notes: 'Lote de 15 piezas individuales para suites hoteleras.',
    paymentConditions: 'Crédito comercial convenio 30 días.',
    estimatedDeliveryDays: 5,
  },
];

// ============================================================================
// 5. PEDIDOS (SALES ORDERS)
// ============================================================================
export interface SalesOrderItem {
  id: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  costReference: number;
  localStock: number;
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
  items: SalesOrderItem[];
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
  // 1. PENDIENTE DE AUTORIZACIÓN (5 casos con motivos explícitos)
  {
    id: 'ord-005',
    folio: 'PED-2026-0105',
    quoteId: 'cot-002',
    originQuoteFolio: 'COT-2026-0042',
    createdAt: '28 Ago 2026',
    customerId: 'cli-002',
    customerName: 'Desarrollos Residenciales del Norte S.A.',
    customerRfc: 'DRN120315KJ8',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-05-1',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        quantity: 10,
        unitPrice: 11425.86,
        subtotal: 114258.6,
        costReference: 7800,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 130000,
      discountAmount: 15741.4,
      taxIva: 18281.38,
      total: 132539.98,
      estimatedCost: 78000,
      estimatedMarginAmount: 36258.6,
      estimatedMarginPct: 31.7,
    },
    status: 'Pendiente de autorización',
    notes: 'Descuento especial de 12% solicitado para equipamiento de Torre Residencial Albasur.',
    paymentConditions: 'Crédito comercial a 30 días.',
    deliveryAddress: 'Av. Eugenio Garza Sada #3800, Contry, Monterrey N.L.',
    targetDeliveryDate: '02 Sep 2026',
    authorizationLog: {
      status: 'Pendiente',
      notes: 'Descuento del 12% excede el umbral del 5% de piso de venta.',
      policyReason: 'Descuento comercial de 12% excede política estándar del 5%',
    },
  },
  {
    id: 'ord-018',
    folio: 'PED-2026-0118',
    quoteId: 'cot-006',
    originQuoteFolio: 'COT-2026-0044',
    createdAt: '28 Ago 2026',
    customerId: 'cli-003',
    customerName: 'Grupo Hotelero Sierra Madre',
    customerRfc: 'HSM1809204A2',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-18-1',
        sku: 'SC-SPA-REC-MAT',
        productName: 'Spring Air Colchón Record Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 8,
        unitPrice: 7999,
        subtotal: 63992,
        costReference: 3800,
        localStock: 5,
      },
      {
        id: 'ord-it-18-2',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 8,
        unitPrice: 5899,
        subtotal: 47192,
        costReference: 2950,
        localStock: 8,
      },
    ],
    financials: {
      subtotal: 122800,
      discountAmount: 11616,
      taxIva: 17790.08,
      total: 128974.08,
      estimatedCost: 54000,
      estimatedMarginAmount: 57184,
      estimatedMarginPct: 51.4,
    },
    status: 'Pendiente de autorización',
    notes: 'Volumen para suites ejecutivas Cumbres Grand. Se solicita autorización por descuento de convenio superior.',
    paymentConditions: 'Crédito corporativo 45 días.',
    deliveryAddress: 'Av. Paseo de los Leones #2800, Cumbres 4to Sector, Monterrey N.L.',
    targetDeliveryDate: '04 Sep 2026',
    authorizationLog: {
      status: 'Pendiente',
      notes: 'Descuento aplicado de 9.5% requiere aprobación de Dirección Comercial.',
      policyReason: 'Descuento de 9.5% superior a política estándar de convenio',
    },
  },
  {
    id: 'ord-019',
    folio: 'PED-2026-0119',
    createdAt: '28 Ago 2026',
    customerId: 'cli-005',
    customerName: 'Inmobiliaria & Rentas Cumbres S.A.',
    customerRfc: 'IRC1904107F3',
    customerType: 'Empresa',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Sucursales Norte 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-19-1',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Ortopédico Extra Firme Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 6,
        unitPrice: 5999,
        subtotal: 35994,
        costReference: 4900,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 52194,
      discountAmount: 16200,
      taxIva: 5759.04,
      total: 41753.04,
      estimatedCost: 29400,
      estimatedMarginAmount: 6594,
      estimatedMarginPct: 18.3,
    },
    status: 'Pendiente de autorización',
    notes: 'Precio pactado en paquete residencial. Margen resultante en rango crítico.',
    paymentConditions: 'Transferencia bancaria contra entrega.',
    deliveryAddress: 'Alejandro de Rodas #310, Cumbres 5to Sector, Monterrey N.L.',
    targetDeliveryDate: '31 Ago 2026',
    authorizationLog: {
      status: 'Pendiente',
      notes: 'Margen comercial de 18.3% es menor al 20% obligatorio.',
      policyReason: 'Margen comercial estimado de 18.3% es inferior al umbral mínimo del 20%',
    },
  },
  {
    id: 'ord-020',
    folio: 'PED-2026-0120',
    createdAt: '28 Ago 2026',
    customerId: 'cli-011',
    customerName: 'Ing. Mauricio Fernández Zambrano',
    customerRfc: 'FEZM760914GH3',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-20-1',
        sku: 'SC-SEAL-POST-KS',
        productName: 'Sealy Posturepedic Crown Jewel King Size',
        brand: 'Sealy',
        size: 'King Size',
        quantity: 2,
        unitPrice: 15750,
        subtotal: 31500,
        costReference: 8900,
        localStock: 2,
      },
    ],
    financials: {
      subtotal: 35998,
      discountAmount: 4498,
      taxIva: 5040,
      total: 36540,
      estimatedCost: 17800,
      estimatedMarginAmount: 13700,
      estimatedMarginPct: 43.5,
    },
    status: 'Pendiente de autorización',
    notes: 'Precio manual cerrado en piso con cliente de alta recomendación.',
    paymentConditions: 'Tarjeta bancaria 12 MSI.',
    deliveryAddress: 'Privada San Alberto #105, San Agustín, San Pedro Garza García N.L.',
    targetDeliveryDate: '30 Ago 2026',
    authorizationLog: {
      status: 'Pendiente',
      notes: 'Se ingresó precio unitario manual fuera de catálogo.',
      policyReason: 'Precio unitario manual asignado fuera de catálogo de lista',
    },
  },
  {
    id: 'ord-021',
    folio: 'PED-2026-0121',
    createdAt: '28 Ago 2026',
    customerId: 'cli-006',
    customerName: 'Hotel Boutique Las Lomas',
    customerRfc: 'OHL1806149L2',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-21-1',
        sku: 'SC-THER-BALA-KS',
        productName: 'Therapedic Balance Firm Confort King Size',
        brand: 'Therapedic',
        size: 'King Size',
        quantity: 8,
        unitPrice: 10400,
        subtotal: 83200,
        costReference: 5200,
        localStock: 3,
      },
    ],
    financials: {
      subtotal: 94400,
      discountAmount: 11200,
      taxIva: 13312,
      total: 96512,
      estimatedCost: 41600,
      estimatedMarginAmount: 41600,
      estimatedMarginPct: 50.0,
    },
    status: 'Pendiente de autorización',
    notes: 'Cliente solicita plazo de crédito excepcional a 60 días sin aval hipotecario.',
    paymentConditions: 'Crédito excepcional a 60 días.',
    deliveryAddress: 'Av. Eugenio Garza Lagüera #2100, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '03 Sep 2026',
    authorizationLog: {
      status: 'Pendiente',
      notes: 'Plazo mayor a 30 días requiere visto bueno de Tesorería.',
      policyReason: 'Plazo de crédito excepcional a 60 días sin garantía hipotecaria',
    },
  },

  // 2. AUTORIZADO (3 casos listos para programación de surtido)
  {
    id: 'ord-006',
    folio: 'PED-2026-0106',
    quoteId: 'cot-002',
    originQuoteFolio: 'COT-2026-0042',
    createdAt: '27 Ago 2026',
    customerId: 'cli-003',
    customerName: 'Grupo Hotelero Sierra Madre',
    customerRfc: 'HSM1809204A2',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-06-1',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        quantity: 12,
        unitPrice: 12879.08,
        subtotal: 154548.96,
        costReference: 7800,
        localStock: 4,
      },
      {
        id: 'ord-it-06-2',
        sku: 'SC-AMER-HALS-KS',
        productName: 'América Halston Ortopédico King Size',
        brand: 'América',
        size: 'King Size',
        quantity: 10,
        unitPrice: 11039.08,
        subtotal: 110390.8,
        costReference: 6200,
        localStock: 3,
      },
    ],
    financials: {
      subtotal: 298976,
      discountAmount: 34036.24,
      taxIva: 42390.36,
      total: 307330.12,
      estimatedCost: 155600,
      estimatedMarginAmount: 109339.76,
      estimatedMarginPct: 41.3,
    },
    status: 'Autorizado',
    notes: 'Autorizado por Dirección Comercial. En espera de liberación de orden de recolección.',
    paymentConditions: 'Crédito corporativo 45 días.',
    deliveryAddress: 'Av. Paseo de los Leones #2800, Cumbres 4to Sector, Monterrey N.L.',
    targetDeliveryDate: '01 Sep 2026',
    authorizationLog: {
      authorizedBy: 'Lic. Armando Garza (Director Comercial)',
      authorizedAt: '27 Ago 2026 17:30',
      notes: 'Aprobado descuento corporativo por volumen de suites.',
      status: 'Autorizada',
    },
  },
  {
    id: 'ord-022',
    folio: 'PED-2026-0122',
    createdAt: '27 Ago 2026',
    customerId: 'cli-012',
    customerName: 'Dra. Mónica Villarreal Treviño',
    customerRfc: 'VITM820311TY9',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-22-1',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        quantity: 2,
        unitPrice: 12757.76,
        subtotal: 25515.52,
        costReference: 7800,
        localStock: 2,
      },
    ],
    financials: {
      subtotal: 29598,
      discountAmount: 4082.48,
      taxIva: 4082.48,
      total: 29598,
      estimatedCost: 15600,
      estimatedMarginAmount: 9915.52,
      estimatedMarginPct: 38.9,
    },
    status: 'Autorizado',
    notes: 'Pago con tarjeta confirmado. Pendiente de programar en recolección de fin de semana.',
    paymentConditions: 'Tarjeta bancaria de crédito.',
    deliveryAddress: 'Paseo de los Leones #1850, Cumbres 2do Sector, Monterrey N.L.',
    targetDeliveryDate: '30 Ago 2026',
    authorizationLog: {
      authorizedBy: 'Gerencia Comercial Cumbres',
      authorizedAt: '27 Ago 2026 18:20',
      notes: 'Validación bancaria acreditada.',
      status: 'Autorizada',
    },
  },
  {
    id: 'ord-023',
    folio: 'PED-2026-0123',
    createdAt: '28 Ago 2026',
    customerId: 'cli-010',
    customerName: 'Hospital Cumbres Ángeles',
    customerRfc: 'HCA1510114F5',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-23-1',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 5,
        unitPrice: 6000,
        subtotal: 30000,
        costReference: 2950,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 37495,
      discountAmount: 7495,
      taxIva: 4800,
      total: 34800,
      estimatedCost: 14750,
      estimatedMarginAmount: 15250,
      estimatedMarginPct: 50.8,
    },
    status: 'Autorizado',
    notes: 'Lote de reposición para área de descanso médico.',
    paymentConditions: 'Crédito institucional 30 días.',
    deliveryAddress: 'Av. Hacienda Peñuelas #670, Hacienda Mitras, Monterrey N.L.',
    targetDeliveryDate: '31 Ago 2026',
    authorizationLog: {
      authorizedBy: 'Gerencia Administrativa',
      authorizedAt: '28 Ago 2026 09:15',
      notes: 'Convenio activo y sin saldo vencido.',
      status: 'Autorizada',
    },
  },

  // 3. PENDIENTE DE SURTIDO (4 casos vinculados a Mesa > Recolección)
  {
    id: 'ord-001',
    folio: 'PED-2026-0101',
    quoteId: 'cot-004',
    originQuoteFolio: 'COT-2026-0038',
    createdAt: '24 Ago 2026',
    customerId: 'cli-005',
    customerName: 'Inmobiliaria & Rentas Cumbres S.A.',
    customerRfc: 'IRC1904107F3',
    customerType: 'Empresa',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Sucursales Norte 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-item-01',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Ortopédico Extra Firme Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 4,
        unitPrice: 8438.03,
        subtotal: 33752.12,
        costReference: 3950,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 34796,
      discountAmount: 1043.88,
      taxIva: 5400.34,
      total: 39152.46,
      estimatedCost: 15800,
      estimatedMarginAmount: 17952.12,
      estimatedMarginPct: 53.2,
    },
    status: 'Pendiente de surtido',
    notes: 'Pedido autorizado por gerencia. Listo para asignación de ruta de recolección.',
    paymentConditions: 'Transferencia bancaria SPEI contra entrega.',
    deliveryAddress: 'Alejandro de Rodas #310, Cumbres 5to Sector, Monterrey N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0090',
    },
  },
  {
    id: 'ord-007',
    folio: 'PED-2026-0107',
    createdAt: '26 Ago 2026',
    customerId: 'cli-006',
    customerName: 'Hotel Boutique Las Lomas',
    customerRfc: 'OHL1806149L2',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-07-1',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 4,
        unitPrice: 11400,
        subtotal: 45600,
        costReference: 5800,
        localStock: 5,
      },
      {
        id: 'ord-it-07-2',
        sku: 'SC-SPA-REC-MAT',
        productName: 'Spring Air Colchón Record Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 4,
        unitPrice: 8200,
        subtotal: 32800,
        costReference: 3800,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 89000,
      discountAmount: 10600,
      taxIva: 12544,
      total: 90944,
      estimatedCost: 38400,
      estimatedMarginAmount: 40000,
      estimatedMarginPct: 51.0,
    },
    status: 'Pendiente de surtido',
    notes: 'Demanda de recolección generada en CEDIS Monterrey Norte.',
    paymentConditions: 'Crédito convenio 30 días.',
    deliveryAddress: 'Av. Eugenio Garza Lagüera #2100, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '30 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0091',
    },
  },
  {
    id: 'ord-024',
    folio: 'PED-2026-0124',
    createdAt: '28 Ago 2026',
    customerId: 'cli-001',
    customerName: 'Roberto Cantú Garza',
    customerRfc: 'CAGR850412H89',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-24-1',
        sku: 'SC-SPA-REC-KS',
        productName: 'Spring Air Colchón Record King Size',
        brand: 'Spring Air',
        size: 'King Size',
        quantity: 1,
        unitPrice: 14999,
        subtotal: 14999,
        costReference: 6400,
        localStock: 3,
      },
    ],
    financials: {
      subtotal: 14999,
      discountAmount: 0,
      taxIva: 2399.84,
      total: 17398.84,
      estimatedCost: 6400,
      estimatedMarginAmount: 8599,
      estimatedMarginPct: 57.3,
    },
    status: 'Pendiente de surtido',
    notes: 'Pedido residencial directo en mostrador.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Av. Vasconcelos #1420, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0094',
    },
  },
  {
    id: 'ord-025',
    folio: 'PED-2026-0125',
    createdAt: '27 Ago 2026',
    customerId: 'cli-008',
    customerName: 'Corporativo Valle Real S.A.',
    customerRfc: 'CVR1408226K9',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-25-1',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 20,
        unitPrice: 7200,
        subtotal: 144000,
        costReference: 3800,
        localStock: 9,
      },
    ],
    financials: {
      subtotal: 169980,
      discountAmount: 25980,
      taxIva: 23040,
      total: 167040,
      estimatedCost: 76000,
      estimatedMarginAmount: 68000,
      estimatedMarginPct: 47.2,
    },
    status: 'Pendiente de surtido',
    notes: 'Lote mayor de 20 colchones en preparación en CEDIS Monterrey Norte.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Av. Lázaro Cárdenas #2400, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '01 Sep 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0095',
    },
  },

  // 4. EN PREPARACIÓN (3 casos con recolección en curso)
  {
    id: 'ord-002',
    folio: 'PED-2026-0102',
    createdAt: '25 Ago 2026',
    customerId: 'cli-002',
    customerName: 'Desarrollos Residenciales del Norte S.A.',
    customerRfc: 'DRN120315KJ8',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-item-02',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 10,
        unitPrice: 6299,
        subtotal: 62990,
        costReference: 2950,
        localStock: 12,
      },
      {
        id: 'ord-item-03',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 5,
        unitPrice: 7999,
        subtotal: 39995,
        costReference: 3800,
        localStock: 9,
      },
    ],
    financials: {
      subtotal: 102985,
      discountAmount: 0,
      taxIva: 16477.6,
      total: 119462.6,
      estimatedCost: 48500,
      estimatedMarginAmount: 54485,
      estimatedMarginPct: 52.9,
    },
    status: 'En preparación',
    notes: 'Operador escaneando piezas en Pasillo A y B.',
    paymentConditions: 'Crédito comercial 30 días.',
    deliveryAddress: 'Av. Eugenio Garza Sada #3800, Contry, Monterrey N.L.',
    targetDeliveryDate: '28 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0088',
    },
  },
  {
    id: 'ord-008',
    folio: 'PED-2026-0108',
    createdAt: '26 Ago 2026',
    customerId: 'cli-007',
    customerName: 'Arquitectura & Diseño San Pedro S.A.',
    customerRfc: 'ADS1705128T1',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-08-1',
        sku: 'SC-AMER-HALS-KS',
        productName: 'América Halston Ortopédico King Size',
        brand: 'América',
        size: 'King Size',
        quantity: 3,
        unitPrice: 11500,
        subtotal: 34500,
        costReference: 6200,
        localStock: 4,
      },
      {
        id: 'ord-it-08-2',
        sku: 'SC-NAYT-FLOW-QS',
        productName: 'Nayt Colchón Flow Basic White Queen Size',
        brand: 'Nayt',
        size: 'Queen Size',
        quantity: 3,
        unitPrice: 10200,
        subtotal: 30600,
        costReference: 4800,
        localStock: 5,
      },
    ],
    financials: {
      subtotal: 71994,
      discountAmount: 6894,
      taxIva: 10416,
      total: 75516,
      estimatedCost: 33000,
      estimatedMarginAmount: 32100,
      estimatedMarginPct: 49.3,
    },
    status: 'En preparación',
    notes: 'Recolección activa con estrategia FIFO en CEDIS Monterrey Sur.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Calzada del Valle #400, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0092',
    },
  },
  {
    id: 'ord-026',
    folio: 'PED-2026-0126',
    createdAt: '27 Ago 2026',
    customerId: 'cli-009',
    customerName: 'Condominios Privada del Rey',
    customerRfc: 'CPR2003189J2',
    customerType: 'Empresa',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Sucursales Norte 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-26-1',
        sku: 'SC-AMER-HALS-MAT',
        productName: 'América Halston Ortopédico Matrimonial',
        brand: 'América',
        size: 'Matrimonial',
        quantity: 12,
        unitPrice: 8200,
        subtotal: 98400,
        costReference: 4500,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 113988,
      discountAmount: 15588,
      taxIva: 15744,
      total: 114144,
      estimatedCost: 54000,
      estimatedMarginAmount: 44400,
      estimatedMarginPct: 45.1,
    },
    status: 'En preparación',
    notes: '8 de 12 piezas recolectadas en andén norte.',
    paymentConditions: 'Crédito 15 días.',
    deliveryAddress: 'Paseo de los Leones #3200, Cumbres 6to Sector, Monterrey N.L.',
    targetDeliveryDate: '30 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0096',
    },
  },

  // 5. SURTIDO PARCIAL (2 casos con picking incompleto/sustitución)
  {
    id: 'ord-009',
    folio: 'PED-2026-0109',
    createdAt: '26 Ago 2026',
    customerId: 'cli-004',
    customerName: 'Dra. Gabriela Morales Hinojosa',
    customerRfc: 'MOHG791102TY1',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-09-1',
        sku: 'SC-SPRI-PERF-MAT',
        productName: 'Spring Air Performance Confort Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 2,
        unitPrice: 8499,
        subtotal: 16998,
        costReference: 3750,
        localStock: 1,
      },
    ],
    financials: {
      subtotal: 16998,
      discountAmount: 0,
      taxIva: 2719.68,
      total: 19717.68,
      estimatedCost: 7500,
      estimatedMarginAmount: 9498,
      estimatedMarginPct: 55.9,
    },
    status: 'Surtido parcial',
    notes: '1 de 2 colchones recolectados. Segunda unidad en traspaso inter-CEDIS.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Paseo de la Cima #112, Cumbres Elite, Monterrey N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0089',
    },
  },
  {
    id: 'ord-027',
    folio: 'PED-2026-0127',
    createdAt: '27 Ago 2026',
    customerId: 'cli-007',
    customerName: 'Arquitectura & Diseño San Pedro S.A.',
    customerRfc: 'ADS1705128T1',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-27-1',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 3,
        unitPrice: 11999,
        subtotal: 35997,
        costReference: 5800,
        localStock: 2,
      },
    ],
    financials: {
      subtotal: 37497,
      discountAmount: 1500,
      taxIva: 5759.52,
      total: 41756.52,
      estimatedCost: 17400,
      estimatedMarginAmount: 18597,
      estimatedMarginPct: 51.7,
    },
    status: 'Surtido parcial',
    notes: '2 de 3 piezas surtidas en bahía STG-OUT-02. Falta 1 pieza por acomodar.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Calzada del Valle #400, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '30 Ago 2026',
    operationalLinks: {
      pickOrderFolio: 'OR-2026-0097',
    },
  },

  // 6. SURTIDO COMPLETO (3 casos listos para verificación)
  {
    id: 'ord-003',
    folio: 'PED-2026-0103',
    createdAt: '22 Ago 2026',
    customerId: 'cli-001',
    customerName: 'Roberto Cantú Garza',
    customerRfc: 'CAGR850412H89',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-item-04',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 1,
        unitPrice: 12499,
        subtotal: 12499,
        costReference: 5800,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 12499,
      discountAmount: 0,
      taxIva: 1999.84,
      total: 14498.84,
      estimatedCost: 5800,
      estimatedMarginAmount: 6699,
      estimatedMarginPct: 53.6,
    },
    status: 'Surtido completo',
    notes: 'Surtido 100% en andén 2. Listo para verificación de salida.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Av. Vasconcelos #1420, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '23 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0048',
    },
  },
  {
    id: 'ord-010',
    folio: 'PED-2026-0110',
    createdAt: '26 Ago 2026',
    customerId: 'cli-008',
    customerName: 'Corporativo Valle Real S.A.',
    customerRfc: 'CVR1408226K9',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-10-1',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 14,
        unitPrice: 6200,
        subtotal: 86800,
        costReference: 2950,
        localStock: 12,
      },
      {
        id: 'ord-it-10-2',
        sku: 'SC-SEAL-POST-QS',
        productName: 'Sealy Posturepedic Crown Jewel Queen Size',
        brand: 'Sealy',
        size: 'Queen Size',
        quantity: 10,
        unitPrice: 12800,
        subtotal: 128000,
        costReference: 7800,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 234900,
      discountAmount: 20100,
      taxIva: 34368,
      total: 249168,
      estimatedCost: 119300,
      estimatedMarginAmount: 95500,
      estimatedMarginPct: 44.5,
    },
    status: 'Surtido completo',
    notes: '24 colchones recolectados y ubicados en carril de embarque 3.',
    paymentConditions: 'Crédito corporativo 45 días.',
    deliveryAddress: 'Av. Lázaro Cárdenas #2400, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '30 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0050',
    },
  },
  {
    id: 'ord-028',
    folio: 'PED-2026-0128',
    createdAt: '27 Ago 2026',
    customerId: 'cli-003',
    customerName: 'Grupo Hotelero Sierra Madre',
    customerRfc: 'HSM1809204A2',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-28-1',
        sku: 'SC-SEAL-POST-KS',
        productName: 'Sealy Posturepedic Crown Jewel King Size',
        brand: 'Sealy',
        size: 'King Size',
        quantity: 8,
        unitPrice: 15600,
        subtotal: 124800,
        costReference: 8900,
        localStock: 5,
      },
    ],
    financials: {
      subtotal: 143992,
      discountAmount: 19192,
      taxIva: 19968,
      total: 144768,
      estimatedCost: 71200,
      estimatedMarginAmount: 53600,
      estimatedMarginPct: 43.0,
    },
    status: 'Surtido completo',
    notes: 'Lote de 8 piezas King Size consolidado en STG-OUT-01.',
    paymentConditions: 'Crédito 45 días.',
    deliveryAddress: 'Av. Paseo de los Leones #2800, Cumbres 4to Sector, Monterrey N.L.',
    targetDeliveryDate: '31 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0053',
    },
  },

  // 7. EN VERIFICACIÓN DE SALIDA (2 casos en Mesa de Verificación > Salidas)
  {
    id: 'ord-011',
    folio: 'PED-2026-0111',
    quoteId: 'cot-003',
    originQuoteFolio: 'COT-2026-0043',
    createdAt: '27 Ago 2026',
    customerId: 'cli-001',
    customerName: 'Roberto Cantú Garza',
    customerRfc: 'CAGR850412H89',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-11-1',
        sku: 'SC-NAYT-FLOW-KS',
        productName: 'Nayt Colchón Flow Basic White King Size',
        brand: 'Nayt',
        size: 'King Size',
        quantity: 1,
        unitPrice: 13999,
        subtotal: 13999,
        costReference: 5900,
        localStock: 5,
      },
    ],
    financials: {
      subtotal: 13999,
      discountAmount: 0,
      taxIva: 2239.84,
      total: 16238.84,
      estimatedCost: 5900,
      estimatedMarginAmount: 8099,
      estimatedMarginPct: 57.8,
    },
    status: 'En verificación de salida',
    notes: 'Escaneo de UID en Mesa 02 de CEDIS Monterrey Norte.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Av. Vasconcelos #1420, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0051',
    },
  },
  {
    id: 'ord-029',
    folio: 'PED-2026-0129',
    createdAt: '28 Ago 2026',
    customerId: 'cli-007',
    customerName: 'Arquitectura & Diseño San Pedro S.A.',
    customerRfc: 'ADS1705128T1',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-29-1',
        sku: 'SC-THER-BALA-MAT',
        productName: 'Therapedic Balance Firm Confort Matrimonial',
        brand: 'Therapedic',
        size: 'Matrimonial',
        quantity: 6,
        unitPrice: 8500,
        subtotal: 51000,
        costReference: 4300,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 58000,
      discountAmount: 7000,
      taxIva: 8160,
      total: 59160,
      estimatedCost: 25800,
      estimatedMarginAmount: 25200,
      estimatedMarginPct: 49.4,
    },
    status: 'En verificación de salida',
    notes: '4 de 6 UIDs validadas con escáner óptico.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Calzada del Valle #400, Del Valle, San Pedro Garza García N.L.',
    targetDeliveryDate: '30 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0054',
    },
  },

  // 8. LISTA PARA CARGA (2 casos en Embarques & Entregas > Órdenes de salida)
  {
    id: 'ord-012',
    folio: 'PED-2026-0112',
    createdAt: '27 Ago 2026',
    customerId: 'cli-009',
    customerName: 'Condominios Privada del Rey',
    customerRfc: 'CPR2003189J2',
    customerType: 'Empresa',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Sucursales Norte 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-12-1',
        sku: 'SC-SPA-REC-MAT',
        productName: 'Spring Air Colchón Record Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 10,
        unitPrice: 8200,
        subtotal: 82000,
        costReference: 3800,
        localStock: 6,
      },
      {
        id: 'ord-it-12-2',
        sku: 'SC-SPA-REC-KS',
        productName: 'Spring Air Colchón Record King Size',
        brand: 'Spring Air',
        size: 'King Size',
        quantity: 8,
        unitPrice: 14200,
        subtotal: 113600,
        costReference: 6400,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 219980,
      discountAmount: 24380,
      taxIva: 31296,
      total: 226896,
      estimatedCost: 89200,
      estimatedMarginAmount: 106400,
      estimatedMarginPct: 54.4,
    },
    status: 'Lista para carga',
    notes: 'Remisión REM-2026-0071 emitida. Pendiente de asignación de camión y chofer.',
    paymentConditions: 'Crédito 15 días.',
    deliveryAddress: 'Paseo de los Leones #3200, Cumbres 6to Sector, Monterrey N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0052',
      remisionFolio: 'REM-2026-0071',
    },
  },
  {
    id: 'ord-030',
    folio: 'PED-2026-0130',
    createdAt: '28 Ago 2026',
    customerId: 'cli-010',
    customerName: 'Hospital Cumbres Ángeles',
    customerRfc: 'HCA1510114F5',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-30-1',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 14,
        unitPrice: 6000,
        subtotal: 84000,
        costReference: 2950,
        localStock: 8,
      },
    ],
    financials: {
      subtotal: 104986,
      discountAmount: 20986,
      taxIva: 13440,
      total: 97440,
      estimatedCost: 41300,
      estimatedMarginAmount: 42700,
      estimatedMarginPct: 50.8,
    },
    status: 'Lista para carga',
    notes: 'Remisión REM-2026-0072 validada. Vehículo Unidad #15 asignado.',
    paymentConditions: 'Crédito institucional 30 días.',
    deliveryAddress: 'Av. Hacienda Peñuelas #670, Hacienda Mitras, Monterrey N.L.',
    targetDeliveryDate: '29 Ago 2026',
    operationalLinks: {
      outboundOrderFolio: 'OS-2026-0055',
      remisionFolio: 'REM-2026-0072',
    },
  },

  // 9. EN RUTA (2 casos en tránsito)
  {
    id: 'ord-004',
    folio: 'PED-2026-0104',
    quoteId: 'cot-001',
    originQuoteFolio: 'COT-2026-0041',
    createdAt: '26 Ago 2026',
    customerId: 'cli-002',
    customerName: 'Desarrollos Residenciales del Norte S.A.',
    customerRfc: 'DRN120315KJ8',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-04-1',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 8,
        unitPrice: 6364.05,
        subtotal: 50912.4,
        costReference: 2950,
        localStock: 12,
      },
      {
        id: 'ord-it-04-2',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 6,
        unitPrice: 8074.05,
        subtotal: 48444.3,
        costReference: 3800,
        localStock: 9,
      },
    ],
    financials: {
      subtotal: 104584,
      discountAmount: 5227.3,
      taxIva: 15897.07,
      total: 115253.77,
      estimatedCost: 46400,
      estimatedMarginAmount: 52956.7,
      estimatedMarginPct: 53.3,
    },
    status: 'En ruta',
    notes: 'Ruta RT-2026-0032 despachada en Camión #08 (Chofer: Roberto Garza).',
    paymentConditions: 'Crédito a 30 días.',
    deliveryAddress: 'Av. Eugenio Garza Sada #3800, Contry, Monterrey N.L.',
    targetDeliveryDate: '28 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0062',
      routeFolio: 'RT-2026-0032',
    },
  },
  {
    id: 'ord-013',
    folio: 'PED-2026-0113',
    createdAt: '28 Ago 2026',
    customerId: 'cli-011',
    customerName: 'Ing. Mauricio Fernández Zambrano',
    customerRfc: 'FEZM760914GH3',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-13-1',
        sku: 'SC-SEAL-POST-KS',
        productName: 'Sealy Posturepedic Crown Jewel King Size',
        brand: 'Sealy',
        size: 'King Size',
        quantity: 3,
        unitPrice: 16600,
        subtotal: 49800,
        costReference: 8900,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 53997,
      discountAmount: 4197,
      taxIva: 7968,
      total: 57768,
      estimatedCost: 26700,
      estimatedMarginAmount: 23100,
      estimatedMarginPct: 46.4,
    },
    status: 'En ruta',
    notes: 'Camión en tránsito hacia San Agustín (Parada 2 de ruta RT-2026-0031).',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Privada San Alberto #105, San Agustín, San Pedro Garza García N.L.',
    targetDeliveryDate: '28 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0063',
      routeFolio: 'RT-2026-0031',
    },
  },

  // 10. ENTREGADO (3 casos finalizados satisfactoriamente)
  {
    id: 'ord-014',
    folio: 'PED-2026-0114',
    createdAt: '25 Ago 2026',
    customerId: 'cli-012',
    customerName: 'Dra. Mónica Villarreal Treviño',
    customerRfc: 'VITM820311TY9',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-14-1',
        sku: 'SC-SPA-REC-MAT',
        productName: 'Spring Air Colchón Record Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        quantity: 2,
        unitPrice: 8500,
        subtotal: 17000,
        costReference: 3800,
        localStock: 4,
      },
      {
        id: 'ord-it-14-2',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 2,
        unitPrice: 12800,
        subtotal: 25600,
        costReference: 5800,
        localStock: 3,
      },
    ],
    financials: {
      subtotal: 44996,
      discountAmount: 2396,
      taxIva: 6816,
      total: 49416,
      estimatedCost: 19200,
      estimatedMarginAmount: 23400,
      estimatedMarginPct: 54.9,
    },
    status: 'Entregado',
    notes: 'Entrega 100% completada y firmada en destino (REM-2026-0065).',
    paymentConditions: 'Tarjeta bancaria de crédito.',
    deliveryAddress: 'Paseo de los Leones #1850, Cumbres 2do Sector, Monterrey N.L.',
    targetDeliveryDate: '27 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0065',
      routeFolio: 'RT-2026-0030',
    },
  },
  {
    id: 'ord-015',
    folio: 'PED-2026-0184',
    createdAt: '24 Ago 2026',
    customerId: 'cli-006',
    customerName: 'Hotel Boutique Las Lomas',
    customerRfc: 'OHL1806149L2',
    customerType: 'Convenio',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-184-1',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Ortopédico Extra Firme Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 10,
        unitPrice: 7990,
        subtotal: 79900,
        costReference: 3950,
        localStock: 8,
      },
      {
        id: 'ord-it-184-2',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 4,
        unitPrice: 11200,
        subtotal: 44800,
        costReference: 5800,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 136986,
      discountAmount: 12286,
      taxIva: 19952,
      total: 144652,
      estimatedCost: 62700,
      estimatedMarginAmount: 62000,
      estimatedMarginPct: 49.7,
    },
    status: 'Entregado',
    notes: 'Lote de 14 piezas entregado en suites ejecutivas con constancia física.',
    paymentConditions: 'Crédito convenio 30 días.',
    deliveryAddress: 'Av. Eugenio Garza Lagüera #2100, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '26 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0066',
      routeFolio: 'RT-2026-0028',
    },
  },
  {
    id: 'ord-016',
    folio: 'PED-2026-0186',
    createdAt: '23 Ago 2026',
    customerId: 'cli-001',
    customerName: 'Roberto Cantú Garza',
    customerRfc: 'CAGR850412H89',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-186-1',
        sku: 'SC-SPA-REC-KS',
        productName: 'Spring Air Colchón Record King Size',
        brand: 'Spring Air',
        size: 'King Size',
        quantity: 1,
        unitPrice: 14999,
        subtotal: 14999,
        costReference: 6400,
        localStock: 2,
      },
      {
        id: 'ord-it-186-2',
        sku: 'SC-REST-ORTO-MAT',
        productName: 'Restonic Ortopédico Extra Firme Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        quantity: 2,
        unitPrice: 8699,
        subtotal: 17398,
        costReference: 3950,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 32397,
      discountAmount: 0,
      taxIva: 5183.52,
      total: 37580.52,
      estimatedCost: 14300,
      estimatedMarginAmount: 18097,
      estimatedMarginPct: 55.9,
    },
    status: 'Entregado',
    notes: 'Entregado en residencia Carretera Nacional sin observaciones.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Camino al Diente #400, Valle Alto, Monterrey N.L.',
    targetDeliveryDate: '25 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0067',
      routeFolio: 'RT-2026-0029',
    },
  },

  // 11. ENTREGA PARCIAL & CON INCIDENCIA (2 casos operativos)
  {
    id: 'ord-015-inc',
    folio: 'PED-2026-0115',
    createdAt: '26 Ago 2026',
    customerId: 'cli-011',
    customerName: 'Lic. Patricio Zambrano Gómez',
    customerRfc: 'ZAGP800214H88',
    customerType: 'Persona',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-15-1',
        sku: 'SC-REST-ORTO-KS',
        productName: 'Restonic Ortopédico Extra Firme King Size',
        brand: 'Restonic',
        size: 'King Size',
        quantity: 2,
        unitPrice: 12499,
        subtotal: 24998,
        costReference: 5800,
        localStock: 4,
      },
    ],
    financials: {
      subtotal: 24998,
      discountAmount: 0,
      taxIva: 3999.68,
      total: 28997.68,
      estimatedCost: 11600,
      estimatedMarginAmount: 13398,
      estimatedMarginPct: 53.6,
    },
    status: 'Entrega parcial',
    notes: 'Cliente recibió 1 de 2 piezas. Faltante pendiente por reprogramar en siguiente ruta.',
    paymentConditions: 'Transferencia SPEI.',
    deliveryAddress: 'Av. Roble #660, Valle del Campestre, San Pedro Garza García N.L.',
    targetDeliveryDate: '28 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0068',
      routeFolio: 'RT-2026-0033',
    },
  },
  {
    id: 'ord-016-inc',
    folio: 'PED-2026-0116',
    createdAt: '25 Ago 2026',
    customerId: 'cli-010',
    customerName: 'Hospital Cumbres Ángeles',
    customerRfc: 'HCA1510114F5',
    customerType: 'Convenio',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-16-1',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 10,
        unitPrice: 6200,
        subtotal: 62000,
        costReference: 2950,
        localStock: 6,
      },
    ],
    financials: {
      subtotal: 74990,
      discountAmount: 12990,
      taxIva: 9920,
      total: 71920,
      estimatedCost: 29500,
      estimatedMarginAmount: 32500,
      estimatedMarginPct: 52.4,
    },
    status: 'Con incidencia',
    notes: 'Incidencia INC-2026-0014 registrada en andén: 2 piezas con empaque roto en descarga.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Av. Hacienda Peñuelas #670, Hacienda Mitras, Monterrey N.L.',
    targetDeliveryDate: '28 Ago 2026',
    operationalLinks: {
      remisionFolio: 'REM-2026-0069',
      routeFolio: 'RT-2026-0037',
    },
  },

  // 12. CANCELADO (2 casos con motivos comerciales/proyectos)
  {
    id: 'ord-017',
    folio: 'PED-2026-0117',
    createdAt: '24 Ago 2026',
    customerId: 'cli-004',
    customerName: 'Dra. Gabriela Morales Hinojosa',
    customerRfc: 'MOHG791102TY1',
    customerType: 'Persona',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    fulfillmentOriginId: 'wh-mty-sur',
    fulfillmentOriginName: 'CEDIS Monterrey Sur',
    priceListName: 'Lista General Retail 2026',
    sellerName: 'Ing. Sofía Garza (Ejecutiva Cumbres)',
    items: [
      {
        id: 'ord-it-17-1',
        sku: 'SC-AMER-HALS-MAT',
        productName: 'América Halston Ortopédico Matrimonial',
        brand: 'América',
        size: 'Matrimonial',
        quantity: 1,
        unitPrice: 9499,
        subtotal: 9499,
        costReference: 4500,
        localStock: 2,
      },
    ],
    financials: {
      subtotal: 9499,
      discountAmount: 0,
      taxIva: 1519.84,
      total: 11018.84,
      estimatedCost: 4500,
      estimatedMarginAmount: 4999,
      estimatedMarginPct: 52.6,
    },
    status: 'Cancelado',
    notes: 'Cancelado por solicitud del cliente: cambió de opinión por medida King Size.',
    paymentConditions: 'Contado.',
    deliveryAddress: 'Paseo de la Cima #112, Cumbres Elite, Monterrey N.L.',
    targetDeliveryDate: '26 Ago 2026',
    authorizationLog: {
      authorizedBy: 'Gerencia Comercial Cumbres',
      authorizedAt: '24 Ago 2026 16:40',
      notes: 'Cancelación autorizada y reembolso procesado.',
      status: 'Rechazada',
    },
  },
  {
    id: 'ord-031',
    folio: 'PED-2026-0131',
    createdAt: '25 Ago 2026',
    customerId: 'cli-008',
    customerName: 'Corporativo Valle Real S.A.',
    customerRfc: 'CVR1408226K9',
    customerType: 'Empresa',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    fulfillmentOriginId: 'wh-mty-norte',
    fulfillmentOriginName: 'CEDIS Monterrey Norte',
    priceListName: 'Lista Convenio Empresas',
    sellerName: 'Lic. Alejandro Morales (Ventas Retail VO)',
    items: [
      {
        id: 'ord-it-31-1',
        sku: 'SC-SPRI-PERF-KS',
        productName: 'Spring Air Performance Confort King Size',
        brand: 'Spring Air',
        size: 'King Size',
        quantity: 2,
        unitPrice: 11400,
        subtotal: 22800,
        costReference: 5800,
        localStock: 2,
      },
    ],
    financials: {
      subtotal: 25998,
      discountAmount: 3198,
      taxIva: 3648,
      total: 26448,
      estimatedCost: 11600,
      estimatedMarginAmount: 11200,
      estimatedMarginPct: 49.1,
    },
    status: 'Cancelado',
    notes: 'Cancelado por modificación de planos de recámaras en proyecto inmobiliario.',
    paymentConditions: 'Crédito 30 días.',
    deliveryAddress: 'Av. Lázaro Cárdenas #2400, Valle Oriente, San Pedro Garza García N.L.',
    targetDeliveryDate: '28 Ago 2026',
    authorizationLog: {
      authorizedBy: 'Gerencia Administrativa VO',
      authorizedAt: '25 Ago 2026 15:10',
      notes: 'Proyecto suspendido temporalmente por el cliente.',
      status: 'Rechazada',
    },
  },
];

// ============================================================================
// 6. SHOWROOM — EFECTIVIDAD & DESEMPEÑO OBSERVADO
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

export const MOCK_SHOWROOM_IMPACT_DATA: ShowroomImpactItem[] = [
  {
    id: 'shw-imp-01',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    bayCode: 'SHOW-02',
    bayName: 'Bahía de Showroom 02',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    unitsSoldBefore30d: 8,
    unitsSoldAfter30d: 14,
    variationPct: 75.0,
    marginPct: 53.3,
    status: 'Alto impacto',
    observation: 'Desempeño observado sobresaliente tras exhibición física. Clientes prueban firmeza y compran en la misma visita.',
  },
  {
    id: 'shw-imp-02',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    bayCode: 'SHOW-01',
    bayName: 'Bahía de Showroom 01',
    sku: 'SC-REST-ORTO-MAT',
    productName: 'Restonic Ortopédico Extra Firme Matrimonial',
    brand: 'Restonic',
    size: 'Matrimonial',
    unitsSoldBefore30d: 10,
    unitsSoldAfter30d: 15,
    variationPct: 50.0,
    marginPct: 53.2,
    status: 'Alto impacto',
    observation: 'Alta conversión de prueba en piso a cotización formal.',
  },
  {
    id: 'shw-imp-03',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    bayCode: 'SHOW-03',
    bayName: 'Bahía de Showroom 03',
    sku: 'SC-SEAL-POST-QS',
    productName: 'Sealy Posturepedic Crown Jewel Queen Size',
    brand: 'Sealy',
    size: 'Queen Size',
    unitsSoldBefore30d: 6,
    unitsSoldAfter30d: 9,
    variationPct: 50.0,
    marginPct: 41.3,
    status: 'Impacto positivo',
    observation: 'Mayor interés en segmento Premium cuando está exhibido con almohadas de cortesía.',
  },
  {
    id: 'shw-imp-04',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    bayCode: 'SHOW-04',
    bayName: 'Bahía de Showroom 04',
    sku: 'SC-SPRI-PERF-IND',
    productName: 'Spring Air Performance Confort Individual',
    brand: 'Spring Air',
    size: 'Individual',
    unitsSoldBefore30d: 7,
    unitsSoldAfter30d: 8,
    variationPct: 14.3,
    marginPct: 48.2,
    status: 'Neutral',
    observation: 'Demanda estable pero sin repunte marcado en ventas.',
  },
  {
    id: 'shw-imp-05',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    bayCode: 'SHOW-05',
    bayName: 'Bahía de Showroom 05',
    sku: 'SC-AMER-HALS-KS',
    productName: 'América Halston Ortopédico King Size',
    brand: 'América',
    size: 'King Size',
    unitsSoldBefore30d: 5,
    unitsSoldAfter30d: 7,
    variationPct: 40.0,
    marginPct: 45.0,
    status: 'Impacto positivo',
    observation: 'Buena tracción en parejas que visitan la sucursal buscando modelos King Size.',
  },
  {
    id: 'shw-imp-06',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    bayCode: 'SHOW-06',
    bayName: 'Bahía de Showroom 06',
    sku: 'SC-NAYT-FLOW-MAT',
    productName: 'Nayt Colchón Flow Basic White Matrimonial',
    brand: 'Nayt',
    size: 'Matrimonial',
    unitsSoldBefore30d: 9,
    unitsSoldAfter30d: 13,
    variationPct: 44.4,
    marginPct: 52.9,
    status: 'Alto impacto',
    observation: 'Excelente sinergia con la campaña de Bed-in-a-Box y facilidad de transporte.',
  },
];

// ============================================================================
// 7. BUENA VENTA + BAJA EXISTENCIA (DIAGNÓSTICO COMERCIAL & INVENTARIO)
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
}

export const MOCK_HIGH_DEMAND_LOW_STOCK_DATA: HighDemandLowStockItem[] = [
  {
    id: 'hls-01',
    sku: 'SC-NAYT-FLOW-IND',
    productName: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    size: 'Individual',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    recentSales30d: 22,
    availableStock: 3,
    coverageDays: 4.1,
    suggestedRequisitionQty: 15,
    urgency: 'Alta',
  },
  {
    id: 'hls-02',
    sku: 'SC-SEAL-POST-QS',
    productName: 'Sealy Posturepedic Crown Jewel Queen Size',
    brand: 'Sealy',
    size: 'Queen Size',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    recentSales30d: 14,
    availableStock: 2,
    coverageDays: 4.3,
    suggestedRequisitionQty: 10,
    urgency: 'Alta',
  },
  {
    id: 'hls-03',
    sku: 'SC-REST-ORTO-MAT',
    productName: 'Restonic Ortopédico Extra Firme Matrimonial',
    brand: 'Restonic',
    size: 'Matrimonial',
    branchId: 'wh-suc-valle-oriente',
    branchName: 'Sucursal Valle Oriente',
    recentSales30d: 18,
    availableStock: 4,
    coverageDays: 6.7,
    suggestedRequisitionQty: 12,
    urgency: 'Media',
  },
  {
    id: 'hls-04',
    sku: 'SC-AMER-HALS-KS',
    productName: 'América Halston Ortopédico King Size',
    brand: 'América',
    size: 'King Size',
    branchId: 'wh-suc-cumbres',
    branchName: 'Sucursal Cumbres',
    recentSales30d: 11,
    availableStock: 2,
    coverageDays: 5.5,
    suggestedRequisitionQty: 8,
    urgency: 'Media',
  },
];
