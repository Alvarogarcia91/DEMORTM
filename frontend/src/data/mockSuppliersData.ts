import { MOCK_MASTER_ARTICLES, MasterArticle } from './mockArticlesData';

export type SupplierType = 'Nacional' | 'Extranjero';
export type SupplierStatus = 'Activo' | 'Inactivo';
export type PaymentCondition = 'Crédito' | 'Contado' | 'Contra entrega' | 'Anticipo' | 'Otra';
export type DocumentStatus = 'Vigente' | 'Por vencer' | 'Vencido';

export type PriceListStatus = 'Vigente' | 'Programada' | 'Vencida' | 'Inactiva';
export type PriceListCurrency = 'MXN' | 'USD';

export interface PriceListTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface PriceListItem {
  id: string;
  articleSku: string;
  articleName: string;
  supplierSku: string;
  unit: string;
  currentPrice: number;
  previousPrice?: number;
  variationPercent?: number;
  minQuantity: number;
  status: 'Activo' | 'Inactivo';
  tiers?: PriceListTier[];
  notes?: string;
  lastUpdatedAt?: string;
}

export interface SupplierPriceList {
  id: string;
  supplierId: string;
  name: string;
  currency: PriceListCurrency;
  startDate: string;
  endDate: string;
  status: PriceListStatus;
  description?: string;
  items: PriceListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SupplierContact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  status: 'Activo' | 'Inactivo';
}

export interface SupplierAddress {
  id: string;
  type: 'Fiscal' | 'Planta' | 'Entrega' | 'Oficina';
  street: string;
  exteriorNumber?: string;
  extNumber?: string;
  interiorNumber?: string;
  intNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface SupplierArticleRelation {
  id: string;
  articleSku: string;
  articleName?: string;
  supplierArticleName?: string;
  brand?: string;
  size?: string;
  purchaseUnit?: string;
  supplierSku: string;
  leadTimeDays?: number;
  estimatedLeadDays?: number;
  referencePrice: number;
  currency: 'MXN' | 'USD';
  minOrderQuantity: number;
  isPreferred: boolean;
  lastPurchaseDate?: string;
  lastPurchasePrice?: number;
  status: 'Activo' | 'Inactivo';
}

export interface SupplierDocument {
  id: string;
  name: string;
  type:
    | 'Constancia Fiscal'
    | 'Comprobante Domicilio'
    | 'Estado Cuenta'
    | 'Opinión Cumplimiento'
    | 'Ficha Técnica'
    | 'Certificado Calidad'
    | 'Datos Bancarios'
    | 'Convenio Comercial'
    | 'Certificación'
    | 'Identificación'
    | 'Otro'
    | string;
  fileName?: string;
  fileSizeKb?: number;
  uploadDate?: string;
  uploadedAt?: string;
  expirationDate?: string;
  expiresAt?: string;
  status: DocumentStatus;
  url?: string;
}

export interface SupplierTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  action: string;
  comment?: string;
  type:
    | 'creation'
    | 'created'
    | 'update'
    | 'status_change'
    | 'status_changed'
    | 'doc_upload'
    | 'doc_uploaded'
    | 'order_placed'
    | 'price_update'
    | 'price_list_updated'
    | 'contact_updated'
    | 'article_linked'
    | 'terms_updated'
    | string;
}

export interface SupplierMaster {
  id: string;
  code?: string;
  legalName: string;
  tradeName: string;
  rfc: string;
  type: SupplierType;
  status: SupplierStatus;
  paymentCondition: PaymentCondition;
  creditDays: number;
  creditLimit?: number;
  leadTimeDays?: number;
  estimatedLeadDays?: number;
  minimumOrderAmount?: number;
  commercialNotes?: string;
  lastUpdatedTerms?: string;
  associatedBrands?: string[];
  preferredCurrency: 'MXN' | 'USD';
  contacts: SupplierContact[];
  addresses: SupplierAddress[];
  articles: SupplierArticleRelation[];
  documents: SupplierDocument[];
  timeline: SupplierTimelineEntry[];
  priceLists?: SupplierPriceList[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_MOCK_SUPPLIERS: SupplierMaster[] = [
  // 1. Sun Chemical México
  {
    id: 'sup-sunchem',
    code: 'PROV-RTM-001',
    legalName: 'Sun Chemical México S.A. de C.V.',
    tradeName: 'Sun Chemical México',
    rfc: 'SCM920415TY9',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 30,
    creditLimit: 1500000,
    leadTimeDays: 5,
    estimatedLeadDays: 5,
    minimumOrderAmount: 10000,
    commercialNotes: 'Proveedor principal de tintas cuatricromía offset, tintas UV y barnices especiales de sobreimpresión.',
    associatedBrands: ['Sun Chemical', 'Dic Color', 'Flint Group'],
    preferredCurrency: 'MXN',
    notes: 'Proveedor principal de tintas cuatricromía offset, tintas UV y barnices especiales de sobreimpresión.',
    createdAt: '10 Ene 2024',
    updatedAt: '20 Ago 2026',
    contacts: [
      {
        id: 'con-sun-01',
        name: 'Ing. Fernando Valdés',
        position: 'Asesor Técnico Industrial',
        email: 'fvaldes@sunchem-demo.com.mx',
        phone: '(81) 8312-4000',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'addr-sun-01',
        type: 'Fiscal',
        street: 'Av. San Jerónimo',
        exteriorNumber: '310',
        extNumber: '310',
        neighborhood: 'San Jerónimo',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64640',
        country: 'México',
        isPrimary: true,
      },
    ],
    articles: [
      {
        id: 'rel-sun-01',
        articleSku: 'MP-VAR-UV',
        articleName: 'Barniz UV Ultra Brillo Curado Rápido',
        brand: 'Sun Chemical',
        size: 'Cubeta 20 kg',
        purchaseUnit: 'cubeta',
        supplierSku: 'SUN-VAR-UV-01',
        leadTimeDays: 4,
        estimatedLeadDays: 4,
        referencePrice: 1850.00,
        currency: 'MXN',
        minOrderQuantity: 4,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'rel-sun-02',
        articleSku: 'MP-INK-BLK',
        articleName: 'Tinta Process Black Offset Intensa',
        brand: 'Sun Chemical',
        size: 'Lata 5 kg',
        purchaseUnit: 'lata',
        supplierSku: 'SUN-INK-BLK-02',
        leadTimeDays: 3,
        estimatedLeadDays: 3,
        referencePrice: 420.00,
        currency: 'MXN',
        minOrderQuantity: 10,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [
      {
        id: 'doc-sun-01',
        name: 'Constancia de Situación Fiscal 2026',
        type: 'Constancia Fiscal',
        fileName: 'CSF_SunChemical_2026.pdf',
        fileSizeKb: 185,
        uploadDate: '15 Ene 2026',
        uploadedAt: '15 Ene 2026',
        expirationDate: '31 Dic 2026',
        expiresAt: '31 Dic 2026',
        status: 'Vigente',
      },
    ],
    timeline: [],
    priceLists: [
      {
        id: 'pl-sun-2026',
        supplierId: 'sup-sunchem',
        name: 'Tarifa Tintas & Químicos 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        createdAt: '01 Ene 2026',
        updatedAt: '01 Ago 2026',
        items: [
          {
            id: 'it-sun-01',
            articleSku: 'MP-VAR-UV',
            articleName: 'Barniz UV Ultra Brillo Curado Rápido',
            supplierSku: 'SUN-VAR-UV-01',
            unit: 'cubeta',
            currentPrice: 1850.00,
            previousPrice: 1780.00,
            variationPercent: 3.9,
            minQuantity: 4,
            status: 'Activo',
          },
          {
            id: 'it-sun-02',
            articleSku: 'MP-INK-BLK',
            articleName: 'Tinta Process Black Offset Intensa',
            supplierSku: 'SUN-INK-BLK-02',
            unit: 'lata',
            currentPrice: 420.00,
            previousPrice: 400.00,
            variationPercent: 5.0,
            minQuantity: 10,
            status: 'Activo',
          },
        ],
      },
    ],
  },

  // 2. Bio-Pappel
  {
    id: 'sup-biopappel',
    code: 'PROV-RTM-002',
    legalName: 'Bio-Pappel S.A.B. de C.V.',
    tradeName: 'Bio-Pappel',
    rfc: 'BPA820618MN4',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 45,
    creditLimit: 3500000,
    leadTimeDays: 7,
    estimatedLeadDays: 7,
    minimumOrderAmount: 25000,
    commercialNotes: 'Proveedor estratégico de papel Couché 90 g y 150 g en tarimas de pliegos 70x100 cm.',
    associatedBrands: ['Bio-Pappel', 'Titan', 'Scribe'],
    preferredCurrency: 'MXN',
    notes: 'Proveedor estratégico de papel Couché 90 g y 150 g en tarimas de pliegos 70x100 cm.',
    createdAt: '15 Feb 2024',
    updatedAt: '25 Ago 2026',
    contacts: [
      {
        id: 'con-bio-01',
        name: 'Lic. Marcela Treviño',
        position: 'Ejecutiva Cuentas Editoriales',
        email: 'mtrevino@biopappel-demo.com',
        phone: '(81) 8155-2200',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'addr-bio-01',
        type: 'Fiscal',
        street: 'Carretera a Colombia',
        exteriorNumber: 'Km 6.5',
        extNumber: 'Km 6.5',
        neighborhood: 'Zona Industrial Escobedo',
        city: 'General Escobedo',
        state: 'Nuevo León',
        postalCode: '66050',
        country: 'México',
        isPrimary: true,
      },
    ],
    articles: [
      {
        id: 'rel-bio-01',
        articleSku: 'MP-COU-090',
        articleName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
        brand: 'Bio-Pappel',
        size: 'Tarima 18,000 pliegos',
        purchaseUnit: 'tarima',
        supplierSku: 'BIO-COU-090-70100',
        leadTimeDays: 7,
        estimatedLeadDays: 7,
        referencePrice: 18000.00,
        currency: 'MXN',
        minOrderQuantity: 2,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'rel-bio-02',
        articleSku: 'MP-COU-150',
        articleName: 'Papel Couché 150 g (Pliegos 70x100 cm)',
        brand: 'Bio-Pappel',
        size: 'Tarima 12,000 pliegos',
        purchaseUnit: 'tarima',
        supplierSku: 'BIO-COU-150-70100',
        leadTimeDays: 7,
        estimatedLeadDays: 7,
        referencePrice: 21500.00,
        currency: 'MXN',
        minOrderQuantity: 2,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [
      {
        id: 'pl-bio-2026',
        supplierId: 'sup-biopappel',
        name: 'Tarifa Papeles Gráficos 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        createdAt: '01 Ene 2026',
        updatedAt: '15 Jul 2026',
        items: [
          {
            id: 'it-bio-01',
            articleSku: 'MP-COU-090',
            articleName: 'Papel Couché 90 g (Pliegos 70x100 cm)',
            supplierSku: 'BIO-COU-090-70100',
            unit: 'tarima',
            currentPrice: 18000.00,
            previousPrice: 17500.00,
            variationPercent: 2.9,
            minQuantity: 2,
            status: 'Activo',
          },
          {
            id: 'it-bio-02',
            articleSku: 'MP-COU-150',
            articleName: 'Papel Couché 150 g (Pliegos 70x100 cm)',
            supplierSku: 'BIO-COU-150-70100',
            unit: 'tarima',
            currentPrice: 21500.00,
            previousPrice: 20800.00,
            variationPercent: 3.4,
            minQuantity: 2,
            status: 'Activo',
          },
        ],
      },
    ],
  },

  // 3. Copamex Industrias
  {
    id: 'sup-copamex',
    code: 'PROV-RTM-003',
    legalName: 'Copamex Industrias S.A. de C.V.',
    tradeName: 'Copamex',
    rfc: 'CIN780911KL2',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 30,
    creditLimit: 2000000,
    leadTimeDays: 6,
    estimatedLeadDays: 6,
    minimumOrderAmount: 20000,
    commercialNotes: 'Suministro de papel Bond 75 g para manuales instructivos e interiores editoriales.',
    associatedBrands: ['Copamex', 'Facilis', 'PrintSpeed'],
    preferredCurrency: 'MXN',
    notes: 'Suministro de papel Bond 75 g para manuales instructivos e interiores editoriales.',
    createdAt: '20 Feb 2024',
    updatedAt: '10 Ago 2026',
    contacts: [
      {
        id: 'con-cop-01',
        name: 'Ing. Rodrigo Salinas',
        position: 'Gerente Ventas Industriales',
        email: 'rsalinas@copamex-demo.com',
        phone: '(81) 8399-5000',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'addr-cop-01',
        type: 'Fiscal',
        street: 'Av. Montes Rocallosos',
        exteriorNumber: '505',
        extNumber: '505',
        neighborhood: 'Residencial San Agustín',
        city: 'Monterrey, N.L.',
        state: 'Nuevo León',
        postalCode: '66260',
        country: 'México',
        isPrimary: true,
      },
    ],
    articles: [
      {
        id: 'rel-cop-01',
        articleSku: 'MP-BND-075',
        articleName: 'Papel Bond 75 g (Pliegos 61x90 cm)',
        brand: 'Copamex',
        size: 'Tarima 20,000 pliegos',
        purchaseUnit: 'tarima',
        supplierSku: 'COP-BND-075-6190',
        leadTimeDays: 6,
        estimatedLeadDays: 6,
        referencePrice: 16500.00,
        currency: 'MXN',
        minOrderQuantity: 2,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [
      {
        id: 'pl-cop-2026',
        supplierId: 'sup-copamex',
        name: 'Tarifa Papel Bond Offset 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        createdAt: '01 Ene 2026',
        updatedAt: '01 Jul 2026',
        items: [
          {
            id: 'it-cop-01',
            articleSku: 'MP-BND-075',
            articleName: 'Papel Bond 75 g (Pliegos 61x90 cm)',
            supplierSku: 'COP-BND-075-6190',
            unit: 'tarima',
            currentPrice: 16500.00,
            previousPrice: 15900.00,
            variationPercent: 3.8,
            minQuantity: 2,
            status: 'Activo',
          },
        ],
      },
    ],
  },

  // 4. Avery Dennison / Fasson
  {
    id: 'sup-fasson',
    code: 'PROV-RTM-004',
    legalName: 'Avery Dennison México S. de R.L. de C.V.',
    tradeName: 'Fasson Avery Dennison',
    rfc: 'FAS910320AB1',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 30,
    creditLimit: 2500000,
    leadTimeDays: 8,
    estimatedLeadDays: 8,
    minimumOrderAmount: 18000,
    associatedBrands: ['Fasson', 'Avery Dennison'],
    preferredCurrency: 'MXN',
    notes: 'Bobinas de BOPP blanco brillante y películas transparentes autoadheribles para flexografía.',
    createdAt: '01 Mar 2024',
    updatedAt: '22 Ago 2026',
    contacts: [
      {
        id: 'con-fas-01',
        name: 'Lic. Laura Elizondo',
        position: 'Especialista Materiales Autoadheribles',
        email: 'lelizondo@avery-demo.com',
        phone: '(81) 8122-8800',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [],
    articles: [
      {
        id: 'rel-fas-01',
        articleSku: 'MP-BOP-WHT',
        articleName: 'Sustrato BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 2,500 m',
        purchaseUnit: 'bobina',
        supplierSku: 'FAS-BOP-WHT-2500',
        leadTimeDays: 8,
        estimatedLeadDays: 8,
        referencePrice: 6200.00,
        currency: 'MXN',
        minOrderQuantity: 4,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'rel-fas-02',
        articleSku: 'MP-BOP-TRP',
        articleName: 'Sustrato BOPP Transparente Ultra-Clear',
        brand: 'Fasson Avery',
        size: 'Bobina 2,000 m',
        purchaseUnit: 'bobina',
        supplierSku: 'FAS-BOP-TRP-2000',
        leadTimeDays: 8,
        estimatedLeadDays: 8,
        referencePrice: 5800.00,
        currency: 'MXN',
        minOrderQuantity: 4,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [],
  },

  // 5. WestRock Empaques México
  {
    id: 'sup-westrock',
    code: 'PROV-RTM-005',
    legalName: 'WestRock Empaques México S.A. de C.V.',
    tradeName: 'WestRock México',
    rfc: 'WRM850722PQ8',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 45,
    creditLimit: 2200000,
    leadTimeDays: 10,
    estimatedLeadDays: 10,
    minimumOrderAmount: 20000,
    associatedBrands: ['WestRock', 'Tango SBS'],
    preferredCurrency: 'MXN',
    notes: 'Cartulina Sulfatada SBS 240 g / 14 pts para empaque plegadizo y tarjetas blister card.',
    createdAt: '15 Mar 2024',
    updatedAt: '12 Ago 2026',
    contacts: [
      {
        id: 'con-wst-01',
        name: 'Ing. Javier Cantú',
        position: 'Asesor Técnico Cartulinas',
        email: 'jcantu@westrock-demo.com',
        phone: '(81) 8888-3300',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [],
    articles: [
      {
        id: 'rel-wst-01',
        articleSku: 'MP-SBS-240',
        articleName: 'Cartulina Sulfatada SBS 240 g / 14 pts',
        brand: 'WestRock',
        size: 'Tarima 8,000 pliegos',
        purchaseUnit: 'tarima',
        supplierSku: 'WR-SBS-240-8000',
        leadTimeDays: 10,
        estimatedLeadDays: 10,
        referencePrice: 22000.00,
        currency: 'MXN',
        minOrderQuantity: 2,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [],
  },

  // 6. Siegwerk México
  {
    id: 'sup-siegwerk',
    code: 'PROV-RTM-006',
    legalName: 'Siegwerk México S.A. de C.V.',
    tradeName: 'Siegwerk',
    rfc: 'SME990115LK9',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 30,
    creditLimit: 1200000,
    leadTimeDays: 7,
    estimatedLeadDays: 7,
    minimumOrderAmount: 8000,
    associatedBrands: ['Siegwerk', 'Pantone Special'],
    preferredCurrency: 'MXN',
    notes: 'Tintas especiales directas Pantone, formulaciones bajo pedido para clientes industriales.',
    createdAt: '01 Abr 2024',
    updatedAt: '18 Ago 2026',
    contacts: [
      {
        id: 'con-sieg-01',
        name: 'Lic. Adriana Benavides',
        position: 'Atención Clientes Laboratorio Color',
        email: 'abenavides@siegwerk-demo.com',
        phone: '(81) 8234-9900',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [],
    articles: [
      {
        id: 'rel-sieg-01',
        articleSku: 'MP-INK-186',
        articleName: 'Tinta Especial Pantone PMS 186 C',
        brand: 'Siegwerk',
        size: 'Cubeta 10 kg',
        purchaseUnit: 'cubeta',
        supplierSku: 'SW-PMS-186C-10K',
        leadTimeDays: 7,
        estimatedLeadDays: 7,
        referencePrice: 2400.00,
        currency: 'MXN',
        minOrderQuantity: 2,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [],
  },

  // 7. Smurfit Kappa México
  {
    id: 'sup-smurfit',
    code: 'PROV-RTM-007',
    legalName: 'Smurfit Kappa México S.A. de C.V.',
    tradeName: 'Smurfit Kappa',
    rfc: 'SKM730412XZ1',
    type: 'Nacional',
    status: 'Activo',
    paymentCondition: 'Crédito',
    creditDays: 30,
    creditLimit: 900000,
    leadTimeDays: 4,
    estimatedLeadDays: 4,
    minimumOrderAmount: 5000,
    associatedBrands: ['Smurfit Kappa'],
    preferredCurrency: 'MXN',
    notes: 'Cajas corrugadas reforzadas para empaque de rollos y tarimas de producto terminado.',
    createdAt: '20 Abr 2024',
    updatedAt: '05 Ago 2026',
    contacts: [],
    addresses: [],
    articles: [
      {
        id: 'rel-smurf-01',
        articleSku: 'EMP-CAJ-COR',
        articleName: 'Cajas Corrugadas 30x20x25 cm para Etiquetas',
        brand: 'Smurfit Kappa',
        size: 'Paquete 50 pzas',
        purchaseUnit: 'paquete',
        supplierSku: 'SK-BOX-302025',
        leadTimeDays: 4,
        estimatedLeadDays: 4,
        referencePrice: 380.00,
        currency: 'MXN',
        minOrderQuantity: 10,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    documents: [],
    timeline: [],
    priceLists: [],
  },
];

// Helper to get preferred supplier for a SKU
export function getPreferredSupplierForSku(sku: string, suppliers: SupplierMaster[]): SupplierMaster | null {
  for (const sup of suppliers) {
    if (sup.status !== 'Activo') continue;
    const rel = sup.articles.find((a) => a.articleSku === sku && a.isPreferred && a.status === 'Activo');
    if (rel) return sup;
  }
  for (const sup of suppliers) {
    if (sup.status !== 'Activo') continue;
    const rel = sup.articles.find((a) => a.articleSku === sku && a.status === 'Activo');
    if (rel) return sup;
  }
  return null;
}

// Helper to get active price list for a supplier
export function getSupplierActivePriceList(supplier: SupplierMaster, currency: PriceListCurrency = 'MXN'): SupplierPriceList | undefined {
  return supplier.priceLists?.find((pl) => pl.status === 'Vigente' && pl.currency === currency);
}

// Helper to retrieve the current active price for a specific SKU from supplier's price lists
export function getSupplierArticleActivePrice(supplier: SupplierMaster, sku: string): {
  price: number;
  previousPrice?: number;
  variationPercent?: number;
  priceListName: string;
  minQuantity: number;
  tiers?: PriceListTier[];
  hasActivePrice: boolean;
} | null {
  const activeList = getSupplierActivePriceList(supplier, supplier.preferredCurrency);
  if (activeList) {
    const item = activeList.items.find((it) => it.articleSku === sku && it.status === 'Activo');
    if (item) {
      const varPct = item.variationPercent !== undefined
        ? item.variationPercent
        : item.previousPrice
        ? +(((item.currentPrice - item.previousPrice) / item.previousPrice) * 100).toFixed(1)
        : 0;
      return {
        price: item.currentPrice,
        previousPrice: item.previousPrice,
        variationPercent: varPct,
        priceListName: activeList.name,
        minQuantity: item.minQuantity || 1,
        tiers: item.tiers,
        hasActivePrice: true,
      };
    }
  }

  const rel = supplier.articles.find((a) => a.articleSku === sku && a.status === 'Activo');
  if (rel) {
    return {
      price: rel.referencePrice,
      previousPrice: Math.round(rel.referencePrice * 0.98),
      variationPercent: 2.0,
      priceListName: 'Precio base de catálogo',
      minQuantity: 1,
      hasActivePrice: false,
    };
  }

  return null;
}

// Helper to get article match count for a supplier
export function getSupplierArticleMatchCount(supplierId: string, itemSkus: string[], suppliers: SupplierMaster[]): {
  matchedCount: number;
  totalCount: number;
  unmatchedSkus: string[];
} {
  const supplier = suppliers.find((s) => s.id === supplierId);
  if (!supplier) return { matchedCount: 0, totalCount: itemSkus.length, unmatchedSkus: itemSkus };

  const supplierSkus = new Set(supplier.articles.map((a) => a.articleSku));
  const unmatchedSkus: string[] = [];
  let matchedCount = 0;

  for (const sku of itemSkus) {
    if (supplierSkus.has(sku)) {
      matchedCount++;
    } else {
      unmatchedSkus.push(sku);
    }
  }

  return {
    matchedCount,
    totalCount: itemSkus.length,
    unmatchedSkus,
  };
}
