// =========================================================================
// RTM INDUSTRIAL GRAPHIC ARTS — MASTER ARTICLES CATALOG
// Domain: Impresos RTM (Offset, Flexografía, Sustratos, Tintas y Empaque)
// =========================================================================

export interface SerializedUnitTrace {
  uid: string;
  lotNumber: string;
  warehouseName: string;
  location: string;
  entryDate: string;
  ageDays: number;
  status: 'Disponible' | 'En inspección' | 'Comprometido' | 'En rampa';
}

export interface TraceEvent {
  timestamp: string;
  event: 'Serializado' | 'Acomodado' | 'Inspeccionado' | 'Asignado a Ruta' | 'Verificado en Rampa';
  warehouseName: string;
  location: string;
  user: string;
  details: string;
}

export interface ArticleDocument {
  id: string;
  title: string;
  type: 'Ficha Técnica' | 'Certificado de Garantía' | 'Manual de Manejo' | 'Especificación de Insumos';
  format: 'PDF' | 'DOCX';
  date: string;
  version: string;
  sizeKb: number;
}

export interface ArticleImageItem {
  id: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  resolution: string;
}

export interface MasterArticle {
  id: string;
  sku: string;
  name: string;
  brand: string;
  customer?: string;
  revision?: string;
  technology?: 'Offset' | 'Flexografía' | 'Serigrafía' | 'Digital / Acabados' | 'N/A' | string;
  specificationSummary?: string;
  category: 'Producto Terminado' | 'Sustratos / Papel' | 'Películas / Flexo' | 'Tintas & Barnices' | 'Empaque' | 'Consumibles' | string;
  size: string;
  baseUnit: string;
  serialization: 'Por unidad' | 'No serializado';
  isActive: boolean;
  classCode: string;
  className: string;
  groupCode: string;
  groupName: string;
  subgroupCode?: string;
  subgroupName?: string;
  satCode: string;
  barcode: string;
  
  // Taxonomía & Descripciones
  descriptions: {
    internal: string;
    commercial: string;
    purchasing: string;
  };

  // Características Técnicas Industriales RTM
  characteristics: {
    line: string;
    technology?: string;
    substrate?: string;
    caliperGsm?: string;
    colors?: string;
    finishes?: string;
    formatDimensions?: string;
    unitPresentation?: string;
    qaApproved?: boolean;

    // Backward-compatibility deprecated fields
    mattressType?: string;
    firmness?: 'Suave' | 'Media' | 'Firme' | 'Extra Firme' | string;
    heightCm?: number;
    supportTechnology?: string;
    packagingType?: string;
    isBoxed?: boolean;
    isReversible?: boolean;
    maxWeightPerPersonKg?: number;
    fabricComposition?: string;
    warrantyYears?: number;
  };

  // Control Logístico y de Almacén
  logisticControl: {
    requiresQr: boolean;
    requiresPhysicalLocation: boolean;
    individualHandling: boolean;
    rotationStrategy: 'FIFO' | 'FEFO';
    fefoEnabled: boolean;
    maxDaysInWarehouse: number;
    storageType: string;
    inspectionLevel: string;
    weightKg: number;
    dimensionsCm: { width: number; length: number; height: number };
  };

  // Resumen de Inventario RTM
  inventory: {
    totalPhysical: number;
    available: number;
    inInspection: number;
    committed: number;
    byWarehouse: {
      warehouseId: string;
      warehouseName: string;
      location: string;
      stock: number;
      available: number;
      committed: number;
      inTransit: number;
    }[];
    recentSerializedUnits: SerializedUnitTrace[];
  };

  // Variantes Relacionadas
  relatedVariants: {
    sku: string;
    size: string;
    name: string;
    status: string;
  }[];

  // Trazabilidad
  traceabilityEvents: TraceEvent[];

  // Compras & Proveedor
  purchasing: {
    primarySupplier: string;
    supplierCode: string;
    lastReceptionDate: string;
    estimatedLeadTimeDays: number;
    internalReferenceCost: number;
    lastReceivedLot: string;
    reorderPoint: number;
    economicOrderQuantity: number;
  };

  // Comercial
  commercial: {
    salesDescription: string;
    salesChannel: string;
    commercialStatus: string;
    season: string;
    modelYear: string;
    introductionDate: string;
    referenceListPrice: number;
  };

  // Galería de Imágenes
  images: ArticleImageItem[];

  // Documentos
  documents: ArticleDocument[];
}

export interface ArticleClass {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  totalArticles: number;
}

export interface ArticleGroup {
  id: string;
  classId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  totalArticles: number;
}

export interface ArticleSubgroup {
  id: string;
  groupId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  totalArticles: number;
}

// =========================================================================
// CLASSIFICATION HIERARCHY — IMPRESOS RTM
// =========================================================================
export const MOCK_ARTICLE_CLASSES: ArticleClass[] = [
  {
    id: 'cls-pt',
    code: 'PT',
    name: 'Producto Terminado',
    description: 'Material impreso final terminado, inspeccionado y liberado por QA para entrega a clientes industriales.',
    isActive: true,
    totalArticles: 6,
  },
  {
    id: 'cls-sus',
    code: 'SUS',
    name: 'Sustratos y Papeles',
    description: 'Bobinas de papel couché, bond, cartón plegadizo caple y sustratos para prensa offset.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'cls-flx',
    code: 'FLX',
    name: 'Películas Flexográficas',
    description: 'Películas sintéticas BOPP, poliéster, polietileno y sustratos autoadheribles en bobina.',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'cls-tnt',
    code: 'TNT',
    name: 'Tintas & Barnices',
    description: 'Tintas offset cuatricromía, colores especiales Pantone, barniz UV y solventes.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'cls-emp',
    code: 'EMP',
    name: 'Material de Empaque & Embalaje',
    description: 'Cajas corrugadas, esquineros, fleje y tarimas para despacho industrial.',
    isActive: true,
    totalArticles: 1,
  },
];

export const MOCK_ARTICLE_GROUPS: ArticleGroup[] = [
  {
    id: 'grp-pt-man',
    classId: 'cls-pt',
    code: 'PT-MAN',
    name: 'Manuales e Instructivos',
    description: 'Instructivos plegados y grapados en prensa offset plana para manufactura y electrónica.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-pt-etq',
    classId: 'cls-pt',
    code: 'PT-ETQ',
    name: 'Etiquetas Autoadheribles',
    description: 'Rollos de etiquetas impresas en flexografía hasta 6 tintas UV.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-pt-bli',
    classId: 'cls-pt',
    code: 'PT-BLI',
    name: 'Blister Cards & Tags',
    description: 'Tarjetas termosellables y tags colgantes con acabados UV y troquel de precisión.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-sus-pap',
    classId: 'cls-sus',
    code: 'SUS-PAP',
    name: 'Papel Couché & Bond',
    description: 'Bobinas y pliegos de papel grado editorial y comercial.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-flx-bop',
    classId: 'cls-flx',
    code: 'FLX-BOP',
    name: 'Películas BOPP Flexo',
    description: 'Rollos de película transparente y blanca para laminación y flexografía.',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'grp-tnt-ofs',
    classId: 'cls-tnt',
    code: 'TNT-OFS',
    name: 'Tintas Offset & Químicos',
    description: 'Tintas de proceso CMYK, tintas directas Pantone y barnices sobreimpresión.',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-emp-cor',
    classId: 'cls-emp',
    code: 'EMP-COR',
    name: 'Cajas Corrugadas & Tarimas',
    description: 'Insumos de empaque secundario y tarimas de madera tratada para embarque.',
    isActive: true,
    totalArticles: 1,
  },
];

export const MOCK_ARTICLE_SUBGROUPS: ArticleSubgroup[] = [
  {
    id: 'sub-pt-man-ofs',
    groupId: 'grp-pt-man',
    code: 'PT-MAN-OFS',
    name: 'Manuales Offset Cosido / Grapa',
    description: 'Formato instructivo 24 a 48 páginas con grapa omega o al lomo',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'sub-pt-etq-rol',
    groupId: 'grp-pt-etq',
    code: 'PT-ETQ-ROL',
    name: 'Etiquetas en Rollo Flexo',
    description: 'Núcleo 3 pulgadas para dispensador automático de línea',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'sub-pt-bli-ter',
    groupId: 'grp-pt-bli',
    code: 'PT-BLI-TER',
    name: 'Tarjetas Blister Termosellables',
    description: 'Cartulina SBS con barniz termosellable para burbuja plástica',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'sub-sus-cou-bob',
    groupId: 'grp-sus-pap',
    code: 'SUS-COU-BOB',
    name: 'Bobinas Couché Industrial',
    description: 'Ancho 100 cm a 120 cm para convertidora y rotativa',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'sub-flx-bop-rol',
    groupId: 'grp-flx-bop',
    code: 'FLX-BOP-ROL',
    name: 'Rollos BOPP 35 micras',
    description: 'Sustrato sintético con tratamiento corona',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'sub-tnt-cmyk',
    groupId: 'grp-tnt-ofs',
    code: 'TNT-CMYK',
    name: 'Tintas Offset Proceso CMYK',
    description: 'Curado oxidativo y UV para prensa rápida',
    isActive: true,
    totalArticles: 2,
  },
];

// Helper to create industrial article entries
const createIndustrialArticle = (data: {
  id: string;
  sku: string;
  name: string;
  brand: string;
  customer?: string;
  category: string;
  size: string;
  baseUnit: string;
  technology: 'Offset' | 'Flexografía' | 'Serigrafía' | 'N/A';
  revision: string;
  specificationSummary?: string;
  classCode: string;
  className: string;
  groupCode: string;
  groupName: string;
  satCode: string;
  barcode: string;
  refCost: number;
  listPrice: number;
  totalPhysical: number;
  available: number;
  committed: number;
  location: string;
  supplier?: string;
  imageUrl?: string;
}): MasterArticle => {
  const imageUrl = data.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800';
  const supplier = data.supplier || (data.category === 'Producto Terminado' ? 'Impresos RTM (Manufactura Interna)' : `${data.brand} México`);

  return {
    id: data.id,
    sku: data.sku,
    name: data.name,
    brand: data.brand,
    customer: data.customer || (data.category === 'Producto Terminado' ? data.brand : undefined),
    revision: data.revision,
    technology: data.technology,
    specificationSummary: data.specificationSummary || `${data.name} — ${data.technology} — ${data.revision}`,
    category: data.category,
    size: data.size,
    baseUnit: data.baseUnit,
    serialization: 'No serializado',
    isActive: true,
    classCode: data.classCode,
    className: data.className,
    groupCode: data.groupCode,
    groupName: data.groupName,
    satCode: data.satCode,
    barcode: data.barcode,
    descriptions: {
      internal: `${data.name} — ${data.technology} — ${data.revision}. Control de tiraje y balance en Almacén Principal RTM.`,
      commercial: `${data.name} fabricado con especificación técnica oficial para ${data.brand}.`,
      purchasing: `Insumos para producción de ${data.sku} según requerimiento de tiraje.`,
    },
    characteristics: {
      line: data.technology === 'Offset' ? 'Línea Offset Comercial' : data.technology === 'Flexografía' ? 'Línea Flexografía Bobina' : 'Línea Insumos & Empaque',
      technology: data.technology,
      substrate: data.technology === 'Offset' ? 'Papel Couché 300g / Caple SBS 24 pts' : 'Película BOPP Transparente 35 micras',
      caliperGsm: data.technology === 'Offset' ? '300 g/m² (14 pts)' : '35 micras',
      colors: data.technology === 'Offset' ? '4 Tintas CMYK' : '6 Tintas UV Flexo',
      finishes: data.technology === 'Offset' ? 'Barniz UV Brillante Sobreimpresión + Pleca / Doblez' : 'Laminación BOPP + Pleca de corte',
      formatDimensions: data.size,
      unitPresentation: data.baseUnit,
      qaApproved: true,

      // Deprecated fields preserved for backward compatibility
      mattressType: data.technology,
      firmness: 'Media',
      heightCm: 1,
      supportTechnology: data.technology,
      packagingType: 'Empaque corrugado flejado / Tarima protegida',
      isBoxed: false,
      isReversible: false,
      maxWeightPerPersonKg: 0,
      fabricComposition: data.technology === 'Offset' ? 'Sustrato celulósico / Papel / Cartulina' : 'Película sintética / BOPP autoadherible',
      warrantyYears: 1,
    },
    logisticControl: {
      requiresQr: false,
      requiresPhysicalLocation: true,
      individualHandling: false,
      rotationStrategy: 'FIFO',
      fefoEnabled: false,
      maxDaysInWarehouse: 180,
      storageType: 'Racks Almacén Principal RTM',
      inspectionLevel: 'Muestreo AQL por Lote de Producción',
      weightKg: 15,
      dimensionsCm: { width: 40, length: 60, height: 30 },
    },
    inventory: {
      totalPhysical: data.totalPhysical,
      available: data.available,
      inInspection: 0,
      committed: data.committed,
      byWarehouse: [
        {
          warehouseId: 'wh-alm-rtm',
          warehouseName: 'Almacén Principal RTM',
          location: data.location,
          stock: data.totalPhysical,
          available: data.available,
          committed: data.committed,
          inTransit: 0,
        },
      ],
      recentSerializedUnits: [],
    },
    relatedVariants: [],
    traceabilityEvents: [
      {
        timestamp: '01 Sep 08:30',
        event: 'Acomodado',
        warehouseName: 'Almacén Principal RTM',
        location: data.location,
        user: 'operador_pt',
        details: `Entrada a almacén de PT desde Prensa ${data.technology}`,
      },
    ],
    purchasing: {
      primarySupplier: supplier,
      supplierCode: data.category === 'Producto Terminado' ? 'PROV-RTM-INT' : `PROV-${data.brand.substring(0, 3).toUpperCase()}-01`,
      lastReceptionDate: '01 Sep 2026',
      estimatedLeadTimeDays: 5,
      internalReferenceCost: data.refCost,
      lastReceivedLot: 'RTM-PT-2026-09',
      reorderPoint: Math.round(data.totalPhysical * 0.2),
      economicOrderQuantity: data.totalPhysical,
    },
    commercial: {
      salesDescription: `${data.name} para cliente corporativo ${data.brand}.`,
      salesChannel: 'B2B Industrial',
      commercialStatus: 'Línea Activa',
      season: '2026',
      modelYear: '2026',
      introductionDate: '01 Ene 2026',
      referenceListPrice: data.listPrice,
    },
    images: [
      {
        id: `img-${data.id}-01`,
        url: imageUrl,
        caption: `${data.name} - Vista Oficial`,
        isPrimary: true,
        resolution: '1200x800 px',
      },
    ],
    documents: [
      {
        id: `doc-${data.id}-01`,
        title: `Ficha Técnica ${data.sku} ${data.revision}.pdf`,
        type: 'Ficha Técnica',
        format: 'PDF',
        date: '01 Ago 2026',
        version: data.revision,
        sizeKb: 340,
      },
      {
        id: `doc-${data.id}-02`,
        title: `Especificación de Insumos ${data.sku}.pdf`,
        type: 'Especificación de Insumos',
        format: 'PDF',
        date: '15 Ago 2026',
        version: 'v1.0',
        sizeKb: 280,
      },
    ],
  };
};

// =========================================================================
// MOCK MASTER ARTICLES — CATÁLOGO MAESTRO RTM
// =========================================================================
export const MOCK_MASTER_ARTICLES: MasterArticle[] = [
  createIndustrialArticle({
    id: 'art-rtm-01',
    sku: 'BD-MAN-024',
    name: 'Manual instructivo 24 páginas',
    brand: 'Stanley Black & Decker',
    customer: 'Stanley Black & Decker de México',
    category: 'Producto Terminado',
    size: '24 páginas (14x21.5 cm)',
    baseUnit: 'pza',
    technology: 'Offset',
    revision: 'Rev B (Vigente)',
    specificationSummary: 'Papel Bond 75g, 1 tinta negra, doblado y grapa al lomo',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-MAN',
    groupName: 'Manuales e Instructivos',
    satCode: '55101500',
    barcode: '7501002401082',
    refCost: 1.85,
    listPrice: 2.85,
    totalPhysical: 5000,
    available: 5000,
    committed: 0,
    location: 'PT-02',
  }),
  createIndustrialArticle({
    id: 'art-rtm-02',
    sku: 'BD-MAN-048',
    name: 'Manual instructivo 48 páginas',
    brand: 'Stanley Black & Decker',
    customer: 'Stanley Black & Decker de México',
    category: 'Producto Terminado',
    size: '48 páginas (14x21.5 cm)',
    baseUnit: 'pza',
    technology: 'Offset',
    revision: 'Rev A (Vigente)',
    specificationSummary: 'Papel Bond 75g, interiores B/N + portada Couché 150g color',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-MAN',
    groupName: 'Manuales e Instructivos',
    satCode: '55101500',
    barcode: '7501004801099',
    refCost: 2.90,
    listPrice: 4.20,
    totalPhysical: 2000,
    available: 2000,
    committed: 0,
    location: 'PT-02',
  }),
  createIndustrialArticle({
    id: 'art-rtm-03',
    sku: 'BLI-CRD-001',
    name: 'Blister Card Termosellable',
    brand: 'Electrodomésticos Monterrey',
    customer: 'Electrodomésticos Monterrey S.A.',
    category: 'Producto Terminado',
    size: '12x18 cm (SBS 14 pts)',
    baseUnit: 'pza',
    technology: 'Offset',
    revision: 'Rev C (Vigente)',
    specificationSummary: 'Cartulina SBS 14 pts, 4 tintas CMYK + Barniz Termosellable',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-BLI',
    groupName: 'Blister Cards & Tags',
    satCode: '55121600',
    barcode: '7501000101105',
    refCost: 0.95,
    listPrice: 1.45,
    totalPhysical: 10000,
    available: 10000,
    committed: 0,
    location: 'PT-04',
  }),
  createIndustrialArticle({
    id: 'art-rtm-04',
    sku: 'PT-ETQ-001',
    name: 'Etiqueta Farmacéutica 4x6" en Rollo',
    brand: 'Laboratorios Medifarma',
    customer: 'Laboratorios Medifarma S.A. de C.V.',
    category: 'Producto Terminado',
    size: 'Rollo 4x6" (1,000 etiquetas)',
    baseUnit: 'rollo',
    technology: 'Flexografía',
    revision: 'Rev 04 (Vigente)',
    specificationSummary: 'BOPP Blanco Térmico, 6 tintas UV + Barniz sobreimpresión',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-ETQ',
    groupName: 'Etiquetas Autoadheribles',
    satCode: '55121600',
    barcode: '7501000101112',
    refCost: 0.58,
    listPrice: 0.92,
    totalPhysical: 24000,
    available: 12000,
    committed: 12000,
    location: 'EMB-01 / PT-01',
  }),
  createIndustrialArticle({
    id: 'art-rtm-05',
    sku: 'TAG-IMP-002',
    name: 'Tag Colgante con Barniz UV',
    brand: 'Alimentos y Bebidas del Norte',
    customer: 'Alimentos y Bebidas del Norte S.A.',
    category: 'Producto Terminado',
    size: 'Tag 5x10 cm con ojillo',
    baseUnit: 'pza',
    technology: 'Offset',
    revision: 'Rev A (Vigente)',
    specificationSummary: 'Couché 300g, 4 tintas CMYK + Barniz UV Brillante a registro + Perforación',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-BLI',
    groupName: 'Blister Cards & Tags',
    satCode: '55101500',
    barcode: '7501000201129',
    refCost: 0.75,
    listPrice: 1.15,
    totalPhysical: 8000,
    available: 8000,
    committed: 0,
    location: 'PT-03',
  }),
  createIndustrialArticle({
    id: 'art-rtm-06',
    sku: 'PT-ETQ-002',
    name: 'Etiqueta Flexo 6 Tintas UV',
    brand: 'Empaques Modernos del Norte',
    customer: 'Empaques Modernos del Norte S.A.',
    category: 'Producto Terminado',
    size: 'Rollo 3x5" (1,500 etiquetas)',
    baseUnit: 'rollo',
    technology: 'Flexografía',
    revision: 'Rev 02 (Vigente)',
    specificationSummary: 'Papel Semigloss Autoadherible, adhesivo acrílico permanente',
    classCode: 'PT',
    className: 'Producto Terminado',
    groupCode: 'PT-ETQ',
    groupName: 'Etiquetas Autoadheribles',
    satCode: '55121600',
    barcode: '7501000301136',
    refCost: 0.42,
    listPrice: 0.72,
    totalPhysical: 15000,
    available: 15000,
    committed: 0,
    location: 'PT-01',
  }),
  createIndustrialArticle({
    id: 'art-rtm-07',
    sku: 'MP-COU-300',
    name: 'Papel Couché Brillante 300g',
    brand: 'BioPapel / Fedrigoni',
    category: 'Sustratos / Papel',
    size: 'Bobina 100cm x 1500m',
    baseUnit: 'bobina',
    technology: 'Offset',
    revision: 'N/A',
    specificationSummary: 'Couché dos caras brillante 300 g/m², grado litográfico',
    classCode: 'SUS',
    className: 'Sustratos y Papeles',
    groupCode: 'SUS-PAP',
    groupName: 'Papel Couché & Bond',
    satCode: '14111500',
    barcode: '7502000101201',
    refCost: 8500.00,
    listPrice: 9800.00,
    totalPhysical: 18,
    available: 14,
    committed: 4,
    location: 'A-01-04',
    supplier: 'BioPapel S.A. de C.V.',
  }),
  createIndustrialArticle({
    id: 'art-rtm-08',
    sku: 'MP-BOP-035',
    name: 'Película BOPP Transparente 35 micras',
    brand: 'Avery Dennison',
    category: 'Películas / Flexo',
    size: 'Rollo 60cm x 2000m',
    baseUnit: 'rollo',
    technology: 'Flexografía',
    revision: 'N/A',
    specificationSummary: 'Polipropileno Biorientado 35 micras con tratamiento corona',
    classCode: 'FLX',
    className: 'Películas Flexográficas',
    groupCode: 'FLX-BOP',
    groupName: 'Películas BOPP Flexo',
    satCode: '14111500',
    barcode: '7502000201218',
    refCost: 4200.00,
    listPrice: 5100.00,
    totalPhysical: 12,
    available: 10,
    committed: 2,
    location: 'B-01-02',
    supplier: 'Avery Dennison México',
  }),
  createIndustrialArticle({
    id: 'art-rtm-09',
    sku: 'MP-TIN-CYN',
    name: 'Tinta Offset ProPrint Cyan Intenso',
    brand: 'Sun Chemical',
    category: 'Tintas & Barnices',
    size: 'Cubeta 20 Kg',
    baseUnit: 'cubeta',
    technology: 'Offset',
    revision: 'N/A',
    specificationSummary: 'Tinta base vegetal curado rápido cuatricromía Cyan',
    classCode: 'TNT',
    className: 'Tintas & Barnices',
    groupCode: 'TNT-OFS',
    groupName: 'Tintas Offset & Químicos',
    satCode: '12171500',
    barcode: '7502000301225',
    refCost: 1950.00,
    listPrice: 2450.00,
    totalPhysical: 25,
    available: 20,
    committed: 5,
    location: 'C-01-01',
    supplier: 'Sun Chemical México',
  }),
  createIndustrialArticle({
    id: 'art-rtm-10',
    sku: 'MP-BAR-UVB',
    name: 'Barniz UV Brillante Sobreimpresión',
    brand: 'Flint Group',
    category: 'Tintas & Barnices',
    size: 'Tambor 200 Litros',
    baseUnit: 'tambor',
    technology: 'Offset',
    revision: 'N/A',
    specificationSummary: 'Barniz UV curado radical alta reactividad y brillo',
    classCode: 'TNT',
    className: 'Tintas & Barnices',
    groupCode: 'TNT-OFS',
    groupName: 'Tintas Offset & Químicos',
    satCode: '12171500',
    barcode: '7502000401232',
    refCost: 14800.00,
    listPrice: 17500.00,
    totalPhysical: 6,
    available: 4,
    committed: 2,
    location: 'C-02-03',
    supplier: 'Flint Group México',
  }),
  createIndustrialArticle({
    id: 'art-rtm-11',
    sku: 'EMP-CAJ-COR',
    name: 'Cajas Corrugadas 30x20x25 cm',
    brand: 'Smurfit Kappa',
    category: 'Empaque',
    size: 'Paquete 50 pzas',
    baseUnit: 'paquete',
    technology: 'N/A',
    revision: 'N/A',
    specificationSummary: 'Cartón corrugado flauta C resistencia ECT 32',
    classCode: 'EMP',
    className: 'Material de Empaque & Embalaje',
    groupCode: 'EMP-COR',
    groupName: 'Cajas Corrugadas & Tarimas',
    satCode: '24121500',
    barcode: '7502000501249',
    refCost: 480.00,
    listPrice: 650.00,
    totalPhysical: 40,
    available: 35,
    committed: 5,
    location: 'D-01-01',
    supplier: 'Smurfit Kappa México',
  }),
];
