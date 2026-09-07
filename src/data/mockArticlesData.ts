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
  category: 'Colchones' | 'Bases' | 'Almohadas' | 'Protectores';
  size: 'Individual' | 'Matrimonial' | 'Queen Size' | 'King Size' | 'Estándar';
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

  // Características Técnicas
  characteristics: {
    line: string;
    mattressType: string;
    firmness: 'Suave' | 'Media' | 'Firme' | 'Extra Firme';
    heightCm: number;
    supportTechnology: string;
    packagingType: string;
    isBoxed: boolean;
    isReversible: boolean;
    maxWeightPerPersonKg: number;
    fabricComposition: string;
    warrantyYears: number;
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

  // Resumen de Inventario Multi-CEDIS
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

  // Variantes Relacionadas (mismo modelo en otras medidas)
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
// CLASSIFICATION HIERARCHY
// =========================================================================
export const MOCK_ARTICLE_CLASSES: ArticleClass[] = [
  {
    id: 'cls-col',
    code: 'COL',
    name: 'Colchones',
    description: 'Colchones terminados para descanso residencial e institucional',
    isActive: true,
    totalArticles: 14,
  },
  {
    id: 'cls-bas',
    code: 'BAS',
    name: 'Bases y Somieres',
    description: 'Estructuras de soporte, box spring y bases articuladas',
    isActive: true,
    totalArticles: 3,
  },
  {
    id: 'cls-alm',
    code: 'ALM',
    name: 'Almohadas y Confort',
    description: 'Almohadas viscoelásticas, de gel y microfibra',
    isActive: true,
    totalArticles: 3,
  },
  {
    id: 'cls-pro',
    code: 'PRO',
    name: 'Protectores y Blancos',
    description: 'Protectores impermeables, cubrecolchones y toppers',
    isActive: true,
    totalArticles: 2,
  },
];

export const MOCK_ARTICLE_GROUPS: ArticleGroup[] = [
  {
    id: 'grp-col-esp',
    classId: 'cls-col',
    code: 'COL-ESP',
    name: 'Colchón en Caja / Espuma',
    description: 'Tecnología Roll-Pack y núcleos de espuma de alta resiliencia',
    isActive: true,
    totalArticles: 6,
  },
  {
    id: 'grp-col-res',
    classId: 'cls-col',
    code: 'COL-RES',
    name: 'Colchón Tradicional de Resortes',
    description: 'Unidades con resortes continuos, pocket y Bonnell',
    isActive: true,
    totalArticles: 8,
  },
  {
    id: 'grp-bas-tap',
    classId: 'cls-bas',
    code: 'BAS-TAP',
    name: 'Bases Tapizadas / Box',
    description: 'Estructuras de madera de pino y tapizado antibacterial',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-bas-art',
    classId: 'cls-bas',
    code: 'BAS-ART',
    name: 'Bases Articuladas Motorizadas',
    description: 'Sistemas inteligentes con elevación de cabecera y piecera',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'grp-alm-vis',
    classId: 'cls-alm',
    code: 'ALM-VIS',
    name: 'Almohadas Viscoelásticas / Gel',
    description: 'Memory foam con microcápsulas de refrigeración',
    isActive: true,
    totalArticles: 2,
  },
  {
    id: 'grp-alm-mic',
    classId: 'cls-alm',
    code: 'ALM-MIC',
    name: 'Almohadas de Microfibra',
    description: 'Relleno de fibra tacto pluma hipoalergénica',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'grp-pro-imp',
    classId: 'cls-pro',
    code: 'PRO-IMP',
    name: 'Protectores Impermeables',
    description: 'Membrana de poliuretano transpirable y barrera antiácaros',
    isActive: true,
    totalArticles: 1,
  },
  {
    id: 'grp-pro-cub',
    classId: 'cls-pro',
    code: 'PRO-CUB',
    name: 'Cubrecolchones y Toppers',
    description: 'Acolchados adicionales de confort térmico',
    isActive: true,
    totalArticles: 1,
  },
];

export const MOCK_ARTICLE_SUBGROUPS: ArticleSubgroup[] = [
  {
    id: 'sub-col-esp-hd',
    groupId: 'grp-col-esp',
    code: 'COL-ESP-HD',
    name: 'Foam Core Alta Densidad',
    description: 'Núcleos de 24kg a 30kg de densidad',
    isActive: true,
    totalArticles: 3,
  },
  {
    id: 'sub-col-esp-mem',
    groupId: 'grp-col-esp',
    code: 'COL-ESP-MEM',
    name: 'Gel Memory Foam',
    description: 'Espuma con infusión de gel disipador',
    isActive: true,
    totalArticles: 3,
  },
  {
    id: 'sub-col-res-poc',
    groupId: 'grp-col-res',
    code: 'COL-RES-POC',
    name: 'Resortes Pocket Independientes',
    description: 'Cero transmisión de movimiento',
    isActive: true,
    totalArticles: 4,
  },
  {
    id: 'sub-col-res-bon',
    groupId: 'grp-col-res',
    code: 'COL-RES-BON',
    name: 'Resortes Bonnell / Continuos',
    description: 'Soporte ortopédico tradicional',
    isActive: true,
    totalArticles: 4,
  },
];

// Helper to create fully consistent mock article
const createArticleEntry = (data: {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Colchones' | 'Bases' | 'Almohadas' | 'Protectores';
  size: 'Individual' | 'Matrimonial' | 'Queen Size' | 'King Size' | 'Estándar';
  classCode: string;
  className: string;
  groupCode: string;
  groupName: string;
  subgroupCode?: string;
  subgroupName?: string;
  satCode: string;
  barcode: string;
  isBoxed?: boolean;
  firmness?: 'Suave' | 'Media' | 'Firme' | 'Extra Firme';
  heightCm?: number;
  weightKg?: number;
  imageUrl?: string;
  supplier?: string;
  refCost?: number;
  listPrice?: number;
}): MasterArticle => {
  const isMattress = data.category === 'Colchones';
  const isBoxed = data.isBoxed ?? (data.groupCode === 'COL-ESP');
  const firmness = data.firmness ?? (data.name.includes('Ortopedic') ? 'Firme' : 'Media');
  const heightCm = data.heightCm ?? (isMattress ? 24 : data.category === 'Bases' ? 25 : 15);
  const weightKg = data.weightKg ?? (isMattress ? (data.size === 'King Size' ? 38 : data.size === 'Queen Size' ? 30 : data.size === 'Matrimonial' ? 22 : 15) : 3);
  const supplier = data.supplier ?? `${data.brand} México S.A. de C.V.`;
  const imageUrl = data.imageUrl || (
    data.brand === 'Nayt' ? 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png' :
    data.brand === 'Spring Air' ? 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png' :
    data.brand === 'Restonic' ? 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg' :
    data.brand === 'América' ? 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-halston-colchones-america.jpg' :
    data.brand === 'Sealy' ? 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-celebration-plus-sealy.jpg' :
    'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente_-_theracool.jpg'
  );

  return {
    id: data.id,
    sku: data.sku,
    name: data.name,
    brand: data.brand,
    category: data.category,
    size: data.size,
    baseUnit: 'Pieza (PZA)',
    serialization: isMattress ? 'Por unidad' : 'No serializado',
    isActive: true,
    classCode: data.classCode,
    className: data.className,
    groupCode: data.groupCode,
    groupName: data.groupName,
    subgroupCode: data.subgroupCode,
    subgroupName: data.subgroupName,
    satCode: data.satCode,
    barcode: data.barcode,
    descriptions: {
      internal: `Artículo ${data.name} para catálogo maestro Impresos RTM. Gestión en CEDIS.`,
      commercial: `${data.name} con tecnología de descanso de alto rendimiento garantizado por ${data.brand}.`,
      purchasing: `Unidad terminada ${data.name} ${data.size} empacada con especificación de fábrica.`,
    },
    characteristics: {
      line: `${data.brand} Core Series`,
      mattressType: isBoxed ? 'Colchón en Caja (Bed in a Box)' : isMattress ? 'Colchón Tradicional de Resortes' : data.category,
      firmness: firmness,
      heightCm: heightCm,
      supportTechnology: isBoxed ? 'Núcleo Foam Core HD + Espuma Disipadora' : isMattress ? 'Estructura de Resortes Templados al Horno' : 'Estructura Robusta',
      packagingType: isBoxed ? 'Roll-Pack al alto vacío en caja corrugada' : 'Polietileno calibre 400 termo-sellado',
      isBoxed: isBoxed,
      isReversible: false,
      maxWeightPerPersonKg: 115,
      fabricComposition: 'Tejido Stretch Jacquard Antibacterial y Hipoalergénico',
      warrantyYears: isMattress ? 5 : 2,
    },
    logisticControl: {
      requiresQr: isMattress,
      requiresPhysicalLocation: true,
      individualHandling: isMattress,
      rotationStrategy: 'FIFO',
      fefoEnabled: false,
      maxDaysInWarehouse: 365,
      storageType: isMattress ? 'Racks CEDIS - Bahía Estándar' : 'Mezzanine y Estructuras',
      inspectionLevel: isMattress ? 'Mesa de Verificación (100% Serializado)' : 'Muestreo por Lote',
      weightKg: weightKg,
      dimensionsCm: { width: data.size === 'King Size' ? 200 : data.size === 'Queen Size' ? 150 : data.size === 'Matrimonial' ? 135 : 100, length: 190, height: heightCm },
    },
    inventory: {
      totalPhysical: isMattress ? 48 : 120,
      available: isMattress ? 44 : 115,
      inInspection: isMattress ? 2 : 5,
      committed: isMattress ? 2 : 0,
      byWarehouse: [
        { warehouseId: 'wh-mty-norte', warehouseName: 'CEDIS Monterrey Norte', location: 'A-01-04', stock: isMattress ? 26 : 65, available: isMattress ? 24 : 62, committed: isMattress ? 1 : 0, inTransit: 1 },
        { warehouseId: 'wh-mty-sur', warehouseName: 'CEDIS Monterrey Sur', location: 'A-02-01', stock: isMattress ? 14 : 35, available: isMattress ? 13 : 34, committed: isMattress ? 1 : 0, inTransit: 0 },
        { warehouseId: 'wh-suc-valle-oriente', warehouseName: 'Sucursal Valle Oriente', location: 'SHOW-01', stock: isMattress ? 4 : 10, available: isMattress ? 4 : 10, committed: 0, inTransit: 0 },
        { warehouseId: 'wh-suc-cumbres', warehouseName: 'Sucursal Cumbres', location: 'SHOW-02', stock: isMattress ? 4 : 10, available: isMattress ? 3 : 9, committed: 0, inTransit: 1 },
      ],
      recentSerializedUnits: isMattress ? [
        { uid: `SC-UID-2026-${Math.floor(100000 + Math.random() * 900000)}`, lotNumber: 'LOTE-2026-W34', warehouseName: 'CEDIS Monterrey Norte', location: 'A-01-04', entryDate: '27 Ago 2026', ageDays: 0, status: 'Disponible' },
        { uid: `SC-UID-2026-${Math.floor(100000 + Math.random() * 900000)}`, lotNumber: 'LOTE-2026-W34', warehouseName: 'CEDIS Monterrey Norte', location: 'A-01-04', entryDate: '27 Ago 2026', ageDays: 0, status: 'Disponible' },
        { uid: `SC-UID-2026-${Math.floor(100000 + Math.random() * 900000)}`, lotNumber: 'LOTE-2026-W33', warehouseName: 'CEDIS Monterrey Sur', location: 'A-02-01', entryDate: '24 Ago 2026', ageDays: 3, status: 'Disponible' },
      ] : [],
    },
    relatedVariants: [
      { sku: `${data.sku.replace(/-IND|-MAT|-QS|-KS/, '')}-IND`, size: 'Individual', name: `${data.name} (Individual)`, status: 'Activo' },
      { sku: `${data.sku.replace(/-IND|-MAT|-QS|-KS/, '')}-MAT`, size: 'Matrimonial', name: `${data.name} (Matrimonial)`, status: 'Activo' },
      { sku: `${data.sku.replace(/-IND|-MAT|-QS|-KS/, '')}-QS`, size: 'Queen Size', name: `${data.name} (Queen Size)`, status: 'Activo' },
      { sku: `${data.sku.replace(/-IND|-MAT|-QS|-KS/, '')}-KS`, size: 'King Size', name: `${data.name} (King Size)`, status: 'Activo' },
    ],
    traceabilityEvents: [
      { timestamp: '27 Ago 10:24', event: 'Acomodado', warehouseName: 'CEDIS MTY Norte', location: 'A-01-04', user: 'montacargas02', details: 'Acomodo confirmado en posición asignada' },
      { timestamp: '27 Ago 10:21', event: 'Serializado', warehouseName: 'CEDIS MTY Norte', location: 'Mesa de Verificación', user: 'operador01', details: `Serialización individual de unidad para SKU ${data.sku}` },
      { timestamp: '27 Ago 09:45', event: 'Inspeccionado', warehouseName: 'CEDIS MTY Norte', location: 'Rampa 02', user: 'calidad01', details: 'Recepción e inspección en rampa de recibo' },
    ],
    purchasing: {
      primarySupplier: supplier,
      supplierCode: `PROV-${data.brand.substring(0, 3).toUpperCase()}-01`,
      lastReceptionDate: '27 Ago 2026',
      estimatedLeadTimeDays: 7,
      internalReferenceCost: data.refCost || 1400.00,
      lastReceivedLot: 'LOTE-2026-W34',
      reorderPoint: 25,
      economicOrderQuantity: 80,
    },
    commercial: {
      salesDescription: `${data.name} comercializado en red nacional de sucursales Impresos RTM y tienda en línea.`,
      salesChannel: 'Omnicanal (Tiendas + Digital)',
      commercialStatus: 'Línea Activa',
      season: 'Línea Continua 2026',
      modelYear: '2026',
      introductionDate: '15 Ene 2026',
      referenceListPrice: data.listPrice || 2799.00,
    },
    images: [
      { id: `img-${data.id}-01`, url: imageUrl, caption: `${data.name} - Vista Oficial`, isPrimary: true, resolution: '1200x1200 px' },
      { id: `img-${data.id}-02`, url: imageUrl, caption: `${data.name} - Detalle de Estructura`, isPrimary: false, resolution: '1200x1200 px' },
    ],
    documents: [
      { id: `doc-${data.id}-01`, title: `Ficha Técnica Oficial ${data.sku}.pdf`, type: 'Ficha Técnica', format: 'PDF', date: '15 Ene 2026', version: 'v2.0', sizeKb: 460 },
      { id: `doc-${data.id}-02`, title: `Certificado de Garantía ${data.brand}.pdf`, type: 'Certificado de Garantía', format: 'PDF', date: '01 Ene 2026', version: 'v1.0', sizeKb: 290 },
      { id: `doc-${data.id}-03`, title: `Manual de Operación y Cuidados.pdf`, type: 'Manual de Manejo', format: 'PDF', date: '10 Feb 2026', version: 'v1.1', sizeKb: 310 },
    ],
  };
};

export const MOCK_MASTER_ARTICLES: MasterArticle[] = [
  // 1. Nayt (Top)
  createArticleEntry({
    id: 'art-01',
    sku: 'SC-NAYT-FLOW-IND',
    name: 'Nayt Colchón Flow Basic White Individual',
    brand: 'Nayt',
    category: 'Colchones',
    size: 'Individual',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-ESP',
    groupName: 'Colchón en Caja / Espuma',
    subgroupCode: 'COL-ESP-HD',
    subgroupName: 'Foam Core Alta Densidad',
    satCode: '56101508',
    barcode: '7501941010015',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 20,
    weightKg: 14.5,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 1250,
    listPrice: 2499,
  }),
  createArticleEntry({
    id: 'art-02',
    sku: 'SC-NAYT-FLOW-MAT',
    name: 'Nayt Colchón Flow Basic White Matrimonial',
    brand: 'Nayt',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-ESP',
    groupName: 'Colchón en Caja / Espuma',
    subgroupCode: 'COL-ESP-HD',
    subgroupName: 'Foam Core Alta Densidad',
    satCode: '56101508',
    barcode: '7501941010022',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 20,
    weightKg: 19.2,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 1450,
    listPrice: 2899,
  }),
  createArticleEntry({
    id: 'art-03',
    sku: 'SC-NAYT-PRO-QS',
    name: 'Nayt Colchón Flow Pro Comfort Queen Size',
    brand: 'Nayt',
    category: 'Colchones',
    size: 'Queen Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-ESP',
    groupName: 'Colchón en Caja / Espuma',
    subgroupCode: 'COL-ESP-MEM',
    subgroupName: 'Gel Memory Foam',
    satCode: '56101508',
    barcode: '7501941010039',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 25,
    weightKg: 24.8,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 1850,
    listPrice: 3699,
  }),
  createArticleEntry({
    id: 'art-04',
    sku: 'SC-NAYT-PRO-KS',
    name: 'Nayt Colchón Flow Pro Comfort King Size',
    brand: 'Nayt',
    category: 'Colchones',
    size: 'King Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-ESP',
    groupName: 'Colchón en Caja / Espuma',
    subgroupCode: 'COL-ESP-MEM',
    subgroupName: 'Gel Memory Foam',
    satCode: '56101508',
    barcode: '7501941010046',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 25,
    weightKg: 31.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 2250,
    listPrice: 4499,
  }),

  // 2. Spring Air
  createArticleEntry({
    id: 'art-05',
    sku: 'SC-SPA-REC-IND',
    name: 'Spring Air Colchón Record Individual',
    brand: 'Spring Air',
    category: 'Colchones',
    size: 'Individual',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234590115',
    isBoxed: false,
    firmness: 'Firme',
    heightCm: 24,
    weightKg: 18.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 1600,
    listPrice: 3199,
  }),
  createArticleEntry({
    id: 'art-06',
    sku: 'SC-SPA-REC-MAT',
    name: 'Spring Air Colchón Record Matrimonial',
    brand: 'Spring Air',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234590116',
    isBoxed: false,
    firmness: 'Firme',
    heightCm: 24,
    weightKg: 24.5,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 1850,
    listPrice: 3699,
  }),
  createArticleEntry({
    id: 'art-07',
    sku: 'SC-SPA-VEN-MAT',
    name: 'Spring Air Colchón Vendome Matrimonial',
    brand: 'Spring Air',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-POC',
    subgroupName: 'Resortes Pocket Independientes',
    satCode: '56101508',
    barcode: '7501234590120',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 28,
    weightKg: 28.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 2150,
    listPrice: 4299,
  }),
  createArticleEntry({
    id: 'art-08',
    sku: 'SC-SPA-PAL-QS',
    name: 'Spring Air Colchón Grand Palais Queen Size',
    brand: 'Spring Air',
    category: 'Colchones',
    size: 'Queen Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-POC',
    subgroupName: 'Resortes Pocket Independientes',
    satCode: '56101508',
    barcode: '7501234590125',
    isBoxed: false,
    firmness: 'Suave',
    heightCm: 32,
    weightKg: 34.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 2950,
    listPrice: 5899,
  }),

  // 3. Restonic
  createArticleEntry({
    id: 'art-09',
    sku: 'SC-RES-ORT-MAT',
    name: 'Restonic Colchón Ortopedic Matrimonial',
    brand: 'Restonic',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234589421',
    isBoxed: false,
    firmness: 'Firme',
    heightCm: 23,
    weightKg: 22.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg',
    refCost: 1350,
    listPrice: 2699,
  }),
  createArticleEntry({
    id: 'art-10',
    sku: 'SC-RES-FAN-MAT',
    name: 'Restonic Colchón Fantastic Matrimonial',
    brand: 'Restonic',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234589430',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 25,
    weightKg: 23.5,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg',
    refCost: 1550,
    listPrice: 3099,
  }),
  createArticleEntry({
    id: 'art-11',
    sku: 'SC-RES-MNC-QS',
    name: 'Restonic Colchón Moon Cool Queen Size',
    brand: 'Restonic',
    category: 'Colchones',
    size: 'Queen Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-POC',
    subgroupName: 'Resortes Pocket Independientes',
    satCode: '56101508',
    barcode: '7501234591204',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 30,
    weightKg: 32.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg',
    refCost: 2400,
    listPrice: 4799,
  }),

  // 4. América
  createArticleEntry({
    id: 'art-12',
    sku: 'SC-AME-HAL-QS',
    name: 'América Colchón Halston Queen Size',
    brand: 'América',
    category: 'Colchones',
    size: 'Queen Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234578101',
    isBoxed: false,
    firmness: 'Firme',
    heightCm: 29,
    weightKg: 30.5,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-halston-colchones-america.jpg',
    refCost: 2100,
    listPrice: 4199,
  }),
  createArticleEntry({
    id: 'art-13',
    sku: 'SC-AME-OXF-MAT',
    name: 'América Colchón Oxford Matrimonial',
    brand: 'América',
    category: 'Colchones',
    size: 'Matrimonial',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-BON',
    subgroupName: 'Resortes Bonnell / Continuos',
    satCode: '56101508',
    barcode: '7501234578105',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 26,
    weightKg: 25.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-halston-colchones-america.jpg',
    refCost: 1750,
    listPrice: 3499,
  }),

  // 5. Sealy
  createArticleEntry({
    id: 'art-14',
    sku: 'SC-SEA-CLB-KS',
    name: 'Sealy Colchón Celebration Plus King Size',
    brand: 'Sealy',
    category: 'Colchones',
    size: 'King Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-POC',
    subgroupName: 'Resortes Pocket Independientes',
    satCode: '56101508',
    barcode: '7501234592330',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 34,
    weightKg: 42.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-celebration-plus-sealy.jpg',
    refCost: 3600,
    listPrice: 7199,
  }),
  createArticleEntry({
    id: 'art-15',
    sku: 'SC-SEA-CRW-KS',
    name: 'Sealy Colchón Posturepedic Crown Jewel King Size',
    brand: 'Sealy',
    category: 'Colchones',
    size: 'King Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-RES',
    groupName: 'Colchón Tradicional de Resortes',
    subgroupCode: 'COL-RES-POC',
    subgroupName: 'Resortes Pocket Independientes',
    satCode: '56101508',
    barcode: '7501234592345',
    isBoxed: false,
    firmness: 'Suave',
    heightCm: 38,
    weightKg: 46.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-celebration-plus-sealy.jpg',
    refCost: 4800,
    listPrice: 9599,
  }),

  // 6. Therapedic
  createArticleEntry({
    id: 'art-16',
    sku: 'SC-THE-GEL-KS',
    name: 'Therapedic Colchón Gel Foam King Size',
    brand: 'Therapedic',
    category: 'Colchones',
    size: 'King Size',
    classCode: 'COL',
    className: 'Colchones',
    groupCode: 'COL-ESP',
    groupName: 'Colchón en Caja / Espuma',
    subgroupCode: 'COL-ESP-MEM',
    subgroupName: 'Gel Memory Foam',
    satCode: '56101508',
    barcode: '7501234567890',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 32,
    weightKg: 38.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente_-_theracool.jpg',
    refCost: 3200,
    listPrice: 6399,
  }),

  // 7. Bases y Somieres
  createArticleEntry({
    id: 'art-17',
    sku: 'SC-BAS-SPA-MAT',
    name: 'Base Tapizada Box Spring Air Matrimonial',
    brand: 'Spring Air',
    category: 'Bases',
    size: 'Matrimonial',
    classCode: 'BAS',
    className: 'Bases y Somieres',
    groupCode: 'BAS-TAP',
    groupName: 'Bases Tapizadas / Box',
    satCode: '56101515',
    barcode: '7501234555010',
    isBoxed: false,
    firmness: 'Extra Firme',
    heightCm: 25,
    weightKg: 26.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 950,
    listPrice: 1899,
  }),
  createArticleEntry({
    id: 'art-18',
    sku: 'SC-BAS-NYT-IND',
    name: 'Base Nayt Smart Frame de Ensamble Rápido Individual',
    brand: 'Nayt',
    category: 'Bases',
    size: 'Individual',
    classCode: 'BAS',
    className: 'Bases y Somieres',
    groupCode: 'BAS-TAP',
    groupName: 'Bases Tapizadas / Box',
    satCode: '56101515',
    barcode: '7501941010099',
    isBoxed: true,
    firmness: 'Extra Firme',
    heightCm: 30,
    weightKg: 16.0,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 800,
    listPrice: 1599,
  }),

  // 8. Almohadas
  createArticleEntry({
    id: 'art-19',
    sku: 'SC-ALM-SOG-NUO',
    name: 'Almohada Sognare NUO Firmeza Media Estándar',
    brand: 'Sognare',
    category: 'Almohadas',
    size: 'Estándar',
    classCode: 'ALM',
    className: 'Almohadas y Confort',
    groupCode: 'ALM-MIC',
    groupName: 'Almohadas de Microfibra',
    satCode: '52121503',
    barcode: '7501234544001',
    isBoxed: true,
    firmness: 'Media',
    heightCm: 15,
    weightKg: 1.2,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    refCost: 320,
    listPrice: 649,
  }),
  createArticleEntry({
    id: 'art-20',
    sku: 'SC-ALM-RES-GEL',
    name: 'Almohada Restonic Moon Cool Gel Foam Estándar',
    brand: 'Restonic',
    category: 'Almohadas',
    size: 'Estándar',
    classCode: 'ALM',
    className: 'Almohadas y Confort',
    groupCode: 'ALM-VIS',
    groupName: 'Almohadas Viscoelásticas / Gel',
    satCode: '52121503',
    barcode: '7501234544020',
    isBoxed: false,
    firmness: 'Media',
    heightCm: 14,
    weightKg: 1.8,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg',
    refCost: 390,
    listPrice: 799,
  }),

  // 9. Protectores y Blancos
  createArticleEntry({
    id: 'art-21',
    sku: 'SC-PRO-SOG-QS',
    name: 'Protector de Colchón Cool Proof Sognare Queen Size',
    brand: 'Sognare',
    category: 'Protectores',
    size: 'Queen Size',
    classCode: 'PRO',
    className: 'Protectores y Blancos',
    groupCode: 'PRO-IMP',
    groupName: 'Protectores Impermeables',
    satCode: '52121508',
    barcode: '7501234533010',
    isBoxed: false,
    firmness: 'Suave',
    heightCm: 35,
    weightKg: 0.9,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    refCost: 450,
    listPrice: 899,
  }),
  createArticleEntry({
    id: 'art-22',
    sku: 'SC-PRO-SOG-CUB-MAT',
    name: 'Cubre Colchón Sognare Extra Confort Matrimonial',
    brand: 'Sognare',
    category: 'Protectores',
    size: 'Matrimonial',
    classCode: 'PRO',
    className: 'Protectores y Blancos',
    groupCode: 'PRO-CUB',
    groupName: 'Cubrecolchones y Toppers',
    satCode: '52121508',
    barcode: '7501234533025',
    isBoxed: false,
    firmness: 'Suave',
    heightCm: 8,
    weightKg: 2.4,
    imageUrl: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon-halston-colchones-america.jpg',
    refCost: 650,
    listPrice: 1299,
  }),
];
