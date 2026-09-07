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
  variationPercent?: number; // ((current - previous) / previous) * 100
  minQuantity: number;
  status: 'Activo' | 'Inactivo';
  tiers?: PriceListTier[];
  notes?: string;
  lastUpdatedAt?: string;
}

export interface SupplierPriceList {
  id: string;
  supplierId: string;
  name: string; // e.g. "Lista General 2026", "Lista Promoción Agosto"
  currency: PriceListCurrency; // MXN | USD
  startDate: string; // e.g. "01 Ago 2026"
  endDate: string; // e.g. "31 Dic 2026"
  status: PriceListStatus; // 'Vigente' | 'Programada' | 'Vencida' | 'Inactiva'
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
  extNumber: string;
  intNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SupplierArticleRelation {
  id: string;
  articleSku: string;
  articleName: string;
  brand: string;
  size?: string;
  supplierSku: string;
  supplierArticleName: string;
  purchaseUnit: string;
  referencePrice: number;
  estimatedLeadDays: number;
  isPreferred: boolean;
  status: 'Activo' | 'Inactivo';
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: 'Constancia Fiscal' | 'Datos Bancarios' | 'Convenio Comercial' | 'Certificación' | 'Identificación' | 'Otro';
  uploadedAt: string;
  expiresAt?: string;
  status: DocumentStatus;
  notes?: string;
}

export interface SupplierTimelineEntry {
  id: string;
  occurredAt: string;
  actor: string;
  role: string;
  action: string;
  comment?: string;
  type: 'created' | 'contact_updated' | 'article_linked' | 'terms_updated' | 'doc_uploaded' | 'status_changed' | 'order_emitted' | 'price_list_updated';
}

export interface SupplierMaster {
  id: string;
  tradeName: string;
  legalName: string;
  rfc: string; // Ficticios mock: 'DEMO-NAYT-001', 'DEMO-SPA-002', etc.
  type: SupplierType;
  status: SupplierStatus;
  preferredCurrency: 'MXN' | 'USD';
  
  // Condiciones comerciales
  paymentCondition: PaymentCondition;
  creditDays: number;
  estimatedLeadDays: number;
  minimumOrderAmount: number;
  commercialNotes?: string;
  lastUpdatedTerms?: string;

  // Colecciones
  contacts: SupplierContact[];
  addresses: SupplierAddress[];
  articles: SupplierArticleRelation[];
  priceLists: SupplierPriceList[];
  documents: SupplierDocument[];
  timeline: SupplierTimelineEntry[];
}

// Initial Mock Suppliers Master Dataset
export const INITIAL_MOCK_SUPPLIERS: SupplierMaster[] = [
  {
    id: 'sup-nayt',
    tradeName: 'Nayt México',
    legalName: 'Distribuidora Nayt de México S.A. de C.V. (Demo)',
    rfc: 'DEMO-NAYT-001',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 30,
    estimatedLeadDays: 4,
    minimumOrderAmount: 25000,
    commercialNotes: 'Proveedor estratégico de línea Flow, Hybrid y Ortopédicos Nayt. Entregas directas en CEDIS Monterrey Norte.',
    lastUpdatedTerms: '15 Ago 2026',
    contacts: [
      {
        id: 'c-nayt-1',
        name: 'Laura Martínez',
        position: 'Ejecutiva de Cuentas Clave',
        email: 'laura.martinez@demo-nayt.mx',
        phone: '+52 81 8320 4401',
        isPrimary: true,
        status: 'Activo',
      },
      {
        id: 'c-nayt-2',
        name: 'Ing. Roberto Garza',
        position: 'Gerente de Logística y Embarques',
        email: 'logistica@demo-nayt.mx',
        phone: '+52 81 8320 4402',
        isPrimary: false,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'a-nayt-1',
        type: 'Fiscal',
        street: 'Av. Industrial Monterrey',
        extNumber: '4500',
        neighborhood: 'Parque Industrial Mitras',
        city: 'García',
        state: 'Nuevo León',
        postalCode: '66000',
        country: 'México',
      },
      {
        id: 'a-nayt-2',
        type: 'Planta',
        street: 'Carretera a Saltillo Km 14',
        extNumber: '120',
        neighborhood: 'Zona Industrial',
        city: 'Santa Catarina',
        state: 'Nuevo León',
        postalCode: '66350',
        country: 'México',
      },
    ],
    articles: [
      {
        id: 'ar-nayt-1',
        articleSku: 'SC-NAYT-FLOW-IND',
        articleName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        supplierSku: 'NYT-FLW-IND-01',
        supplierArticleName: 'Flow Basic Individual 1.00x1.90m',
        purchaseUnit: 'pza',
        referencePrice: 4850,
        estimatedLeadDays: 4,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-nayt-2',
        articleSku: 'SC-NAYT-FLOW-MAT',
        articleName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        supplierSku: 'NYT-FLW-MAT-01',
        supplierArticleName: 'Flow Basic Matrimonial 1.35x1.90m',
        purchaseUnit: 'pza',
        referencePrice: 4900,
        estimatedLeadDays: 4,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-nayt-3',
        articleSku: 'SC-NAYT-FLOW-QS',
        articleName: 'Nayt Colchón Flow Basic White Queen Size',
        brand: 'Nayt',
        size: 'Queen Size',
        supplierSku: 'NYT-FLW-QS-01',
        supplierArticleName: 'Flow Basic Queen Size 1.50x1.90m',
        purchaseUnit: 'pza',
        referencePrice: 5300,
        estimatedLeadDays: 4,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-nayt-4',
        articleSku: 'SC-NAYT-FLOW-KS',
        articleName: 'Nayt Colchón Flow Basic White King Size',
        brand: 'Nayt',
        size: 'King Size',
        supplierSku: 'NYT-FLW-KS-01',
        supplierArticleName: 'Flow Basic King Size 2.00x1.90m',
        purchaseUnit: 'pza',
        referencePrice: 6200,
        estimatedLeadDays: 4,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    priceLists: [
      {
        id: 'pl-nayt-2026',
        supplierId: 'sup-nayt',
        name: 'Lista General 2026',
        currency: 'MXN',
        startDate: '01 Ago 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Lista general de precios pactada para la red Impresos RTM con escalas por volumen.',
        createdAt: '15 Jul 2026',
        updatedAt: '20 Ago 2026',
        items: [
          {
            id: 'pli-nayt-1',
            articleSku: 'SC-NAYT-FLOW-IND',
            articleName: 'Nayt Colchón Flow Basic White Individual',
            supplierSku: 'NYT-FLW-IND-01',
            unit: 'pza',
            currentPrice: 4850,
            previousPrice: 4790,
            variationPercent: 1.25,
            minQuantity: 1,
            status: 'Activo',
            tiers: [
              { minQuantity: 1, maxQuantity: 9, unitPrice: 4850 },
              { minQuantity: 10, maxQuantity: 19, unitPrice: 4750 },
              { minQuantity: 20, unitPrice: 4650 },
            ],
            notes: 'Precio preferencial con escala para compras consolidadas.',
            lastUpdatedAt: '20 Ago 2026',
          },
          {
            id: 'pli-nayt-2',
            articleSku: 'SC-NAYT-FLOW-MAT',
            articleName: 'Nayt Colchón Flow Basic White Matrimonial',
            supplierSku: 'NYT-FLW-MAT-01',
            unit: 'pza',
            currentPrice: 4900,
            previousPrice: 4900,
            variationPercent: 0.0,
            minQuantity: 1,
            status: 'Activo',
            tiers: [
              { minQuantity: 1, maxQuantity: 9, unitPrice: 4900 },
              { minQuantity: 10, maxQuantity: 19, unitPrice: 4800 },
              { minQuantity: 20, unitPrice: 4700 },
            ],
            lastUpdatedAt: '15 Ago 2026',
          },
          {
            id: 'pli-nayt-3',
            articleSku: 'SC-NAYT-FLOW-QS',
            articleName: 'Nayt Colchón Flow Basic White Queen Size',
            supplierSku: 'NYT-FLW-QS-01',
            unit: 'pza',
            currentPrice: 5300,
            previousPrice: 5200,
            variationPercent: 1.92,
            minQuantity: 1,
            status: 'Activo',
            lastUpdatedAt: '15 Ago 2026',
          },
          {
            id: 'pli-nayt-4',
            articleSku: 'SC-NAYT-FLOW-KS',
            articleName: 'Nayt Colchón Flow Basic White King Size',
            supplierSku: 'NYT-FLW-KS-01',
            unit: 'pza',
            currentPrice: 6200,
            previousPrice: 6100,
            variationPercent: 1.64,
            minQuantity: 1,
            status: 'Activo',
            lastUpdatedAt: '15 Ago 2026',
          },
        ],
      },
      {
        id: 'pl-nayt-promo',
        supplierId: 'sup-nayt',
        name: 'Lista Promoción Agosto 2026',
        currency: 'MXN',
        startDate: '15 Ago 2026',
        endDate: '31 Ago 2026',
        status: 'Vigente',
        description: 'Descuentos temporales por campaña de volumen individual y matrimonial.',
        createdAt: '10 Ago 2026',
        updatedAt: '15 Ago 2026',
        items: [
          {
            id: 'pli-promo-1',
            articleSku: 'SC-NAYT-FLOW-IND',
            articleName: 'Nayt Colchón Flow Basic White Individual',
            supplierSku: 'NYT-FLW-IND-01',
            unit: 'pza',
            currentPrice: 4650,
            previousPrice: 4850,
            variationPercent: -4.12,
            minQuantity: 5,
            status: 'Activo',
            notes: 'Precio promocional agosto aplicable a pedidos de min 5 pzas.',
            lastUpdatedAt: '15 Ago 2026',
          },
          {
            id: 'pli-promo-2',
            articleSku: 'SC-NAYT-FLOW-MAT',
            articleName: 'Nayt Colchón Flow Basic White Matrimonial',
            supplierSku: 'NYT-FLW-MAT-01',
            unit: 'pza',
            currentPrice: 4700,
            previousPrice: 4900,
            variationPercent: -4.08,
            minQuantity: 5,
            status: 'Activo',
            lastUpdatedAt: '15 Ago 2026',
          },
        ],
      },
      {
        id: 'pl-nayt-2025',
        supplierId: 'sup-nayt',
        name: 'Lista 2025',
        currency: 'MXN',
        startDate: '01 Ene 2025',
        endDate: '31 Dic 2025',
        status: 'Vencida',
        description: 'Lista del ejercicio 2025 archivada.',
        createdAt: '15 Dic 2024',
        updatedAt: '31 Dic 2025',
        items: [
          {
            id: 'pli-old-1',
            articleSku: 'SC-NAYT-FLOW-IND',
            articleName: 'Nayt Colchón Flow Basic White Individual',
            supplierSku: 'NYT-FLW-IND-01',
            unit: 'pza',
            currentPrice: 4500,
            previousPrice: 4350,
            variationPercent: 3.45,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-old-2',
            articleSku: 'SC-NAYT-FLOW-MAT',
            articleName: 'Nayt Colchón Flow Basic White Matrimonial',
            supplierSku: 'NYT-FLW-MAT-01',
            unit: 'pza',
            currentPrice: 4600,
            previousPrice: 4450,
            variationPercent: 3.37,
            minQuantity: 1,
            status: 'Activo',
          },
        ],
      },
      {
        id: 'pl-nayt-q4-2026',
        supplierId: 'sup-nayt',
        name: 'Lista General Q4 2026',
        currency: 'MXN',
        startDate: '01 Oct 2026',
        endDate: '31 Dic 2026',
        status: 'Programada',
        description: 'Actualización proyectada de fin de año sujeta a volumen comercial.',
        createdAt: '22 Ago 2026',
        updatedAt: '22 Ago 2026',
        items: [
          {
            id: 'pli-q4-1',
            articleSku: 'SC-NAYT-FLOW-IND',
            articleName: 'Nayt Colchón Flow Basic White Individual',
            supplierSku: 'NYT-FLW-IND-01',
            unit: 'pza',
            currentPrice: 5000,
            previousPrice: 4850,
            variationPercent: 3.09,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-q4-2',
            articleSku: 'SC-NAYT-FLOW-MAT',
            articleName: 'Nayt Colchón Flow Basic White Matrimonial',
            supplierSku: 'NYT-FLW-MAT-01',
            unit: 'pza',
            currentPrice: 5100,
            previousPrice: 4900,
            variationPercent: 4.08,
            minQuantity: 1,
            status: 'Activo',
          },
        ],
      },
    ],
    documents: [
      {
        id: 'doc-nayt-1',
        name: 'Constancia de Situación Fiscal 2026',
        type: 'Constancia Fiscal',
        uploadedAt: '10 Ene 2026',
        expiresAt: '08 Sep 2026',
        status: 'Por vencer',
        notes: 'Requiere actualización anual en portal SAT.',
      },
      {
        id: 'doc-nayt-2',
        name: 'Carátula Bancaria Banorte (MXN)',
        type: 'Datos Bancarios',
        uploadedAt: '10 Ene 2026',
        status: 'Vigente',
      },
      {
        id: 'doc-nayt-3',
        name: 'Convenio Comercial de Suministro Impresos RTM',
        type: 'Convenio Comercial',
        uploadedAt: '15 Ene 2026',
        expiresAt: '31 Dic 2026',
        status: 'Vigente',
      },
    ],
    timeline: [
      {
        id: 't-nayt-1',
        occurredAt: '15 Ene 2026 10:00',
        actor: 'Admin Demo',
        role: 'Gerencia de Compras',
        action: 'Alta formal de proveedor Nayt México en catálogo maestro',
        type: 'created',
      },
      {
        id: 't-nayt-2',
        occurredAt: '15 Ago 2026 14:30',
        actor: 'Carlos Medina',
        role: 'Comprador',
        action: 'Actualizó condiciones de crédito a 30 días con 4 días de tiempo de entrega',
        type: 'terms_updated',
      },
      {
        id: 't-nayt-3',
        occurredAt: '24 Ago 2026 10:15',
        actor: 'Admin Demo',
        role: 'Comprador',
        action: 'OC-2026-0081 emitida por $100,340 MXN',
        type: 'order_emitted',
      },
    ],
  },
  {
    id: 'sup-spring-air',
    tradeName: 'Spring Air México',
    legalName: 'Consorcio Spring Air de México S.A. de C.V. (Demo)',
    rfc: 'DEMO-SPA-002',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 45,
    estimatedLeadDays: 6,
    minimumOrderAmount: 40000,
    commercialNotes: 'Fabricante de sistemas Posture Comfort y Record. Aplica flete incluido en compras mayores a $50k.',
    lastUpdatedTerms: '01 Jul 2026',
    contacts: [
      {
        id: 'c-spa-1',
        name: 'Lic. Fernando Morales',
        position: 'Director Comercial Cuentas Especiales',
        email: 'f.morales@demo-springair.mx',
        phone: '+52 55 5729 8800',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'a-spa-1',
        type: 'Fiscal',
        street: 'Av. Circunvalación Poniente',
        extNumber: '890',
        neighborhood: 'Zona Industrial Tlalnepantla',
        city: 'Tlalnepantla',
        state: 'Estado de México',
        postalCode: '54000',
        country: 'México',
      },
    ],
    articles: [
      {
        id: 'ar-spa-1',
        articleSku: 'SC-SPA-POST-KS',
        articleName: 'Spring Air Colchón Posture Comfort King Size',
        brand: 'Spring Air',
        size: 'King Size',
        supplierSku: 'SPA-PST-KS-01',
        supplierArticleName: 'Posture Comfort KS Ortopédico',
        purchaseUnit: 'pza',
        referencePrice: 6500,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-spa-2',
        articleSku: 'SC-SPA-REC-IND',
        articleName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        supplierSku: 'SPA-REC-IND-01',
        supplierArticleName: 'Record Individual Semi-firme',
        purchaseUnit: 'pza',
        referencePrice: 5950,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-spa-3',
        articleSku: 'SC-SPA-POST-MAT',
        articleName: 'Spring Air Colchón Posture Comfort Matrimonial',
        brand: 'Spring Air',
        size: 'Matrimonial',
        supplierSku: 'SPA-PST-MAT-01',
        supplierArticleName: 'Posture Comfort Matrimonial',
        purchaseUnit: 'pza',
        referencePrice: 5800,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-spa-4',
        articleSku: 'SC-SPA-REC-QS',
        articleName: 'Spring Air Colchón Record Queen Size',
        brand: 'Spring Air',
        size: 'Queen Size',
        supplierSku: 'SPA-REC-QS-01',
        supplierArticleName: 'Record Queen Size',
        purchaseUnit: 'pza',
        referencePrice: 7400,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    priceLists: [
      {
        id: 'pl-spa-2026',
        supplierId: 'sup-spring-air',
        name: 'Lista Nacional 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Lista de precios nacional de distribución mayorista Spring Air 2026.',
        createdAt: '05 Ene 2026',
        updatedAt: '01 Jul 2026',
        items: [
          {
            id: 'pli-spa-1',
            articleSku: 'SC-SPA-POST-KS',
            articleName: 'Spring Air Colchón Posture Comfort King Size',
            supplierSku: 'SPA-PST-KS-01',
            unit: 'pza',
            currentPrice: 6500,
            previousPrice: 6400,
            variationPercent: 1.56,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-spa-2',
            articleSku: 'SC-SPA-REC-IND',
            articleName: 'Spring Air Colchón Record Individual',
            supplierSku: 'SPA-REC-IND-01',
            unit: 'pza',
            currentPrice: 5950,
            previousPrice: 6200,
            variationPercent: -4.03,
            minQuantity: 1,
            status: 'Activo',
            notes: 'Ajuste de precio a la baja negociado en convenio semestral.',
          },
          {
            id: 'pli-spa-3',
            articleSku: 'SC-SPA-POST-MAT',
            articleName: 'Spring Air Colchón Posture Comfort Matrimonial',
            supplierSku: 'SPA-PST-MAT-01',
            unit: 'pza',
            currentPrice: 5800,
            previousPrice: 5800,
            variationPercent: 0.0,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-spa-4',
            articleSku: 'SC-SPA-REC-QS',
            articleName: 'Spring Air Colchón Record Queen Size',
            supplierSku: 'SPA-REC-QS-01',
            unit: 'pza',
            currentPrice: 7400,
            previousPrice: 7200,
            variationPercent: 2.78,
            minQuantity: 1,
            status: 'Activo',
          },
        ],
      },
    ],
    documents: [
      {
        id: 'doc-spa-1',
        name: 'Opinión de Cumplimiento SAT 32-D Positiva',
        type: 'Constancia Fiscal',
        uploadedAt: '01 Jul 2026',
        expiresAt: '01 Oct 2026',
        status: 'Vigente',
      },
      {
        id: 'doc-spa-2',
        name: 'Certificación ISO 9001:2015 Planta Toluca',
        type: 'Certificación',
        uploadedAt: '10 Ene 2026',
        expiresAt: '15 Dic 2027',
        status: 'Vigente',
      },
    ],
    timeline: [
      {
        id: 't-spa-1',
        occurredAt: '10 Ene 2026 09:30',
        actor: 'Admin Demo',
        role: 'Gerencia',
        action: 'Actualización de expediente y convenio mayorista',
        type: 'created',
      },
    ],
  },
  {
    id: 'sup-restonic',
    tradeName: 'Restonic México',
    legalName: 'Fábrica de Colchones Restonic de México S.A. de C.V. (Demo)',
    rfc: 'DEMO-RES-003',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 30,
    estimatedLeadDays: 5,
    minimumOrderAmount: 20000,
    commercialNotes: 'Línea Ortopedic y Moon. Descuento pronto pago del 3% si se liquida en 10 días.',
    lastUpdatedTerms: '20 Jul 2026',
    contacts: [
      {
        id: 'c-res-1',
        name: 'Lic. Claudia Salinas',
        position: 'Atención a Cadenas',
        email: 'claudia.salinas@demo-restonic.mx',
        phone: '+52 81 8355 1200',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [
      {
        id: 'a-res-1',
        type: 'Fiscal',
        street: 'Calzada San Pedro',
        extNumber: '250',
        neighborhood: 'Del Valle',
        city: 'San Pedro Garza García',
        state: 'Nuevo León',
        postalCode: '66220',
        country: 'México',
      },
    ],
    articles: [
      {
        id: 'ar-res-1',
        articleSku: 'SC-RES-ORT-MAT',
        articleName: 'Restonic Colchón Ortopedic Matrimonial',
        brand: 'Restonic',
        size: 'Matrimonial',
        supplierSku: 'RES-ORT-MAT-01',
        supplierArticleName: 'Ortopedic Matrimonial Continuo',
        purchaseUnit: 'pza',
        referencePrice: 5300,
        estimatedLeadDays: 5,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-res-2',
        articleSku: 'SC-RES-ORT-IND',
        articleName: 'Restonic Colchón Ortopedic Individual',
        brand: 'Restonic',
        size: 'Individual',
        supplierSku: 'RES-ORT-IND-01',
        supplierArticleName: 'Ortopedic Individual',
        purchaseUnit: 'pza',
        referencePrice: 4400,
        estimatedLeadDays: 5,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-res-3',
        articleSku: 'SC-RES-MOON-KS',
        articleName: 'Restonic Colchón Moon Care King Size',
        brand: 'Restonic',
        size: 'King Size',
        supplierSku: 'RES-MOON-KS-01',
        supplierArticleName: 'Moon Care King Size Premium',
        purchaseUnit: 'pza',
        referencePrice: 8900,
        estimatedLeadDays: 5,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    priceLists: [
      {
        id: 'pl-res-2026',
        supplierId: 'sup-restonic',
        name: 'Lista Distribuidores 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Lista exclusiva de distribuidores autorizados Restonic.',
        createdAt: '02 Ene 2026',
        updatedAt: '20 Jul 2026',
        items: [
          {
            id: 'pli-res-1',
            articleSku: 'SC-RES-ORT-MAT',
            articleName: 'Restonic Colchón Ortopedic Matrimonial',
            supplierSku: 'RES-ORT-MAT-01',
            unit: 'pza',
            currentPrice: 5300,
            previousPrice: 5300,
            variationPercent: 0.0,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-res-2',
            articleSku: 'SC-RES-ORT-IND',
            articleName: 'Restonic Colchón Ortopedic Individual',
            supplierSku: 'RES-ORT-IND-01',
            unit: 'pza',
            currentPrice: 4400,
            previousPrice: 4300,
            variationPercent: 2.33,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-res-3',
            articleSku: 'SC-RES-MOON-KS',
            articleName: 'Restonic Colchón Moon Care King Size',
            supplierSku: 'RES-MOON-KS-01',
            unit: 'pza',
            currentPrice: 8900,
            previousPrice: 9200,
            variationPercent: -3.26,
            minQuantity: 1,
            status: 'Activo',
          },
        ],
      },
    ],
    documents: [
      {
        id: 'doc-res-1',
        name: 'Opinión de Cumplimiento SAT 32-D',
        type: 'Constancia Fiscal',
        uploadedAt: '01 Ene 2026',
        expiresAt: '31 Ago 2026',
        status: 'Por vencer',
        notes: 'Vence en 4 días, se solicitó renovación a ejecutiva comercial.',
      },
    ],
    timeline: [
      {
        id: 't-res-1',
        occurredAt: '20 Jul 2026 11:00',
        actor: 'Admin Demo',
        role: 'Gerencia',
        action: 'Renovación de condiciones de crédito',
        type: 'terms_updated',
      },
    ],
  },
  {
    id: 'sup-sealy',
    tradeName: 'Sealy México',
    legalName: 'Sealy Mattress Company de México S. de R.L. de C.V. (Demo)',
    rfc: 'DEMO-SEA-005',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 30,
    estimatedLeadDays: 6,
    minimumOrderAmount: 35000,
    commercialNotes: 'Fabricante de gama premium Hybrid y Posture Premier.',
    lastUpdatedTerms: '01 Feb 2026',
    contacts: [
      {
        id: 'c-sea-1',
        name: 'Patricia Domínguez',
        position: 'Gerente Comercial Retail',
        email: 'patricia@demo-sealy.mx',
        phone: '+52 55 5280 4000',
        isPrimary: true,
        status: 'Activo',
      },
    ],
    addresses: [],
    articles: [
      {
        id: 'ar-sea-1',
        articleSku: 'SC-SEA-HYB-KS',
        articleName: 'Sealy Colchón Hybrid Posture Premier King Size',
        brand: 'Sealy',
        size: 'King Size',
        supplierSku: 'SEA-HYB-KS-01',
        supplierArticleName: 'Hybrid Posture Premier KS',
        purchaseUnit: 'pza',
        referencePrice: 12900,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
      {
        id: 'ar-sea-2',
        articleSku: 'SC-SEA-POST-MAT',
        articleName: 'Sealy Colchón Posture Premier Matrimonial',
        brand: 'Sealy',
        size: 'Matrimonial',
        supplierSku: 'SEA-PST-MAT-01',
        supplierArticleName: 'Posture Premier Matrimonial',
        purchaseUnit: 'pza',
        referencePrice: 9800,
        estimatedLeadDays: 6,
        isPreferred: true,
        status: 'Activo',
      },
    ],
    priceLists: [
      {
        id: 'pl-sea-2026',
        supplierId: 'sup-sealy',
        name: 'Lista General 2026',
        currency: 'MXN',
        startDate: '01 Feb 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Tarifario de distribución oficial Sealy México.',
        createdAt: '01 Feb 2026',
        updatedAt: '01 Feb 2026',
        items: [
          {
            id: 'pli-sea-1',
            articleSku: 'SC-SEA-HYB-KS',
            articleName: 'Sealy Colchón Hybrid Posture Premier King Size',
            supplierSku: 'SEA-HYB-KS-01',
            unit: 'pza',
            currentPrice: 12900,
            previousPrice: 12400,
            variationPercent: 4.03,
            minQuantity: 1,
            status: 'Activo',
          },
          {
            id: 'pli-sea-2',
            articleSku: 'SC-SEA-POST-MAT',
            articleName: 'Sealy Colchón Posture Premier Matrimonial',
            supplierSku: 'SEA-PST-MAT-01',
            unit: 'pza',
            currentPrice: 9800,
            previousPrice: 9500,
            variationPercent: 3.16,
            minQuantity: 1,
            status: 'Activo',
          },
        ],
      },
    ],
    documents: [],
    timeline: [],
  },
  {
    id: 'sup-america',
    tradeName: 'Colchones América',
    legalName: 'Fábricas Agripino de México S.A. de C.V. (Demo)',
    rfc: 'DEMO-AME-004',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Contado',
    creditDays: 0,
    estimatedLeadDays: 5,
    minimumOrderAmount: 15000,
    commercialNotes: 'Línea de alta rotación institucional.',
    contacts: [],
    addresses: [],
    articles: [],
    priceLists: [
      {
        id: 'pl-ame-2026',
        supplierId: 'sup-america',
        name: 'Lista Comercial América 2026',
        currency: 'MXN',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Lista general para compras de contado.',
        createdAt: '05 Ene 2026',
        updatedAt: '05 Ene 2026',
        items: [],
      },
    ],
    documents: [],
    timeline: [],
  },
  {
    id: 'sup-dist-norte',
    tradeName: 'Distribuidora del Norte',
    legalName: 'Distribuciones Comerciales del Norte S.A. de C.V. (Demo)',
    rfc: 'DEMO-DIS-006',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 15,
    estimatedLeadDays: 3,
    minimumOrderAmount: 10000,
    contacts: [],
    addresses: [],
    articles: [],
    priceLists: [],
    documents: [],
    timeline: [],
  },
  {
    id: 'sup-therapedic',
    tradeName: 'Therapedic México',
    legalName: 'Sistemas Therapedic de México S.A. de C.V. (Demo)',
    rfc: 'DEMO-THE-007',
    type: 'Nacional',
    status: 'Activo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Crédito',
    creditDays: 30,
    estimatedLeadDays: 7,
    minimumOrderAmount: 30000,
    contacts: [],
    addresses: [],
    articles: [],
    priceLists: [],
    documents: [],
    timeline: [],
  },
  {
    id: 'sup-import-usa',
    tradeName: 'Sleep Tech Logistics USA',
    legalName: 'Sleep Tech International Logistics LLC (Demo)',
    rfc: 'DEMO-USA-008',
    type: 'Extranjero',
    status: 'Activo',
    preferredCurrency: 'USD',
    paymentCondition: 'Anticipo',
    creditDays: 0,
    estimatedLeadDays: 15,
    minimumOrderAmount: 5000,
    contacts: [],
    addresses: [],
    articles: [],
    priceLists: [
      {
        id: 'pl-usa-usd-2026',
        supplierId: 'sup-import-usa',
        name: 'Lista Importación USD 2026',
        currency: 'USD',
        startDate: '01 Ene 2026',
        endDate: '31 Dic 2026',
        status: 'Vigente',
        description: 'Precios FOB Laredo Texas en Dólares Americanos (USD).',
        createdAt: '15 Ene 2026',
        updatedAt: '15 Ene 2026',
        items: [],
      },
    ],
    documents: [],
    timeline: [],
  },
  {
    id: 'sup-inactivo-ejemplo',
    tradeName: 'Antiguo Proveedor de Insumos',
    legalName: 'Insumos y Cintas del Norte S.A. (Demo Inactivo)',
    rfc: 'DEMO-INACT-009',
    type: 'Nacional',
    status: 'Inactivo',
    preferredCurrency: 'MXN',
    paymentCondition: 'Contado',
    creditDays: 0,
    estimatedLeadDays: 10,
    minimumOrderAmount: 5000,
    commercialNotes: 'Proveedor dado de baja por reiterados retrasos de entrega.',
    lastUpdatedTerms: '10 Ene 2025',
    contacts: [],
    addresses: [],
    articles: [],
    priceLists: [],
    documents: [],
    timeline: [],
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

  // Fallback to relation referencePrice if exists
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
