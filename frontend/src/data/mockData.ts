export interface ColchonProduct {
  id: string;
  sku: string;
  name: string;
  brand: 'Nayt' | 'Spring Air' | 'Restonic' | 'América' | 'Sealy' | 'Therapedic' | 'Magnus' | 'Stearns & Foster';
  size: 'Individual' | 'Matrimonial' | 'Queen Size' | 'King Size';
  firmness: 'Suave' | 'Media' | 'Firme' | 'Extra Firme';
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  comfortSystem: string;
  warrantyYears: number;
  stockTotal: number;
}

export interface SerializedItem {
  serialNumber: string; // ej. SN-SC-2026-NAYT-89421-IND
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  manufactureDate: string;
  barcode: string;
  qrCode: string;
  status: 'en_planta' | 'recepcionado' | 'en_rack' | 'en_embarque' | 'entregado';
  locationRack?: string; // ej. A-12-N2
  assignedTruckOrder?: string;
  rawMaterials: {
    springs: string;
    foam: string;
    fabric: string;
  };
}

export interface ReceiptOrder {
  id: string;
  orderNumber: string; // ej. REC-2026-0814
  origin: string;      // ej. Planta Central - Línea Nayt
  targetWarehouse: string; // ej. CEDIS Monterrey Central
  date: string;
  status: 'pendiente' | 'en_verificacion' | 'completada';
  totalItems: number;
  scannedItems: number;
  items: {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    quantity: number;
    scanned: number;
    serials: string[];
  }[];
}

export interface TruckOutboundOrder {
  id: string;
  orderNumber: string; // ej. EMB-2026-042
  routeNumber: string; // ej. RUTA-MTY-CUMBRES-03
  destination: string; // ej. Sucursal Impresos RTM Cumbres + Gonzalitos
  truckPlate: string;  // ej. NL-8492-B (Rabón 14T)
  driverName: string;  // ej. Carlos Mendoza (Chofer)
  scheduledDate: string;
  status: 'en_carga' | 'completo' | 'despachado';
  totalExpected: number;
  scannedCount: number;
  items: {
    sku: string;
    productName: string;
    size: string;
    expected: number;
    scannedSerials: string[];
  }[];
}

// =========================================================================
// REAL CATALOG PRODUCTS (supercolchones.com.mx) - NAYT AT TOP
// =========================================================================
export const MOCK_PRODUCTS: ColchonProduct[] = [
  {
    id: 'prod-01',
    sku: 'SC-NYT-FLW-IND',
    name: 'Nayt Colchón Flow Basic White (Individual)',
    brand: 'Nayt',
    size: 'Individual',
    firmness: 'Media',
    price: 2499,
    originalPrice: 3899,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    description: 'Estructura ergonómica con espuma de alta resiliencia y tela transpirable fresca.',
    comfortSystem: 'Núcleo Foam Core HD + Acolchado Fresh Touch',
    warrantyYears: 5,
    stockTotal: 120,
  },
  {
    id: 'prod-02',
    sku: 'SC-NYT-FLW-MAT',
    name: 'Nayt Colchón Flow Basic White (Matrimonial)',
    brand: 'Nayt',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 2899,
    originalPrice: 4299,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    description: 'Soporte ortopédico equilibrado con tecnología de empaque al alto vacío.',
    comfortSystem: 'Estructura Bi-Confort + Espuma ViscoSoft',
    warrantyYears: 5,
    stockTotal: 85,
  },
  {
    id: 'prod-03',
    sku: 'SC-NYT-FLW-QS',
    name: 'Nayt Colchón Flow Pro Comfort (Queen Size)',
    brand: 'Nayt',
    size: 'Queen Size',
    firmness: 'Suave',
    price: 3499,
    originalPrice: 5199,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/n/a/nayt-flow-white-ambiente-1.png',
    description: 'Línea estelar Nayt con gel refrescante para disipación de temperatura y confort prolongado.',
    comfortSystem: 'CoolGel Infused Memory Layer + Respaldo Ortopédico',
    warrantyYears: 10,
    stockTotal: 60,
  },
  {
    id: 'prod-04',
    sku: 'SC-RES-ORT-MAT',
    name: 'Restonic Colchón Ortopedic',
    brand: 'Restonic',
    size: 'Matrimonial',
    firmness: 'Firme',
    price: 2699,
    originalPrice: 4299,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/amb_-_ortopedic_frontal.jpg',
    description: 'Soporte ortopédico integral con resortes continuos que alinean la columna vertebral.',
    comfortSystem: 'Resortes Continuos ContinuousWire + Aislante Shoddy Pad',
    warrantyYears: 5,
    stockTotal: 64,
  },
  {
    id: 'prod-05',
    sku: 'SC-RES-FAN-MAT',
    name: 'Restonic Colchón Fantastic',
    brand: 'Restonic',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 2699,
    originalPrice: 4199,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/2/_/2._fantastic-ambiente_6.jpg',
    description: 'Equilibrio perfecto entre firmeza y suavidad con acolchado Euro Top antibacteriano.',
    comfortSystem: 'Sistema Worry Free (No vuelta) + Resortes Bonnell',
    warrantyYears: 5,
    stockTotal: 32,
  },
  {
    id: 'prod-06',
    sku: 'SC-RES-MNC-QS',
    name: 'Restonic Colchón Moon Cool + Almohada',
    brand: 'Restonic',
    size: 'Queen Size',
    firmness: 'Suave',
    price: 2699,
    originalPrice: 4599,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/c/o/colchon_moon_cool_restonic_frontal_v2_1almohada.jpg',
    description: 'Tecnología térmica de descanso fresco con microcápsulas de gel disipadoras de calor.',
    comfortSystem: 'Gel Infused Memory Foam + Resortes encapsulados Pocket',
    warrantyYears: 10,
    stockTotal: 52,
  },
  {
    id: 'prod-07',
    sku: 'SC-SPA-REC-IND',
    name: 'Spring Air Colchón Record',
    brand: 'Spring Air',
    size: 'Individual',
    firmness: 'Firme',
    price: 3199,
    originalPrice: 4999,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/a/m/ambiente-colchon.-record-spring_air.png',
    description: 'Avalado por el Colegio de Profesionistas en Quiropráctica de México para el máximo descanso.',
    comfortSystem: 'Resortes Performance Bonnell + Never Turn System',
    warrantyYears: 5,
    stockTotal: 75,
  },
  {
    id: 'prod-08',
    sku: 'SC-SPA-VEN-MAT',
    name: 'Spring Air Colchón Vendome',
    brand: 'Spring Air',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 4299,
    originalPrice: 6899,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/c/o/colchon-y-box-spring-air-vendome_blancos.png',
    description: 'Acolchado Tack & Jump de alta densidad que se adapta a los puntos de presión corporal.',
    comfortSystem: 'Sistema Back Supporter + Resortes independientes Pocket Springs',
    warrantyYears: 10,
    stockTotal: 40,
  },
  {
    id: 'prod-09',
    sku: 'SC-AME-HAL-QS',
    name: 'América Colchón Halston',
    brand: 'América',
    size: 'Queen Size',
    firmness: 'Extra Firme',
    price: 4599,
    originalPrice: 7499,
    image: 'https://www.supercolchones.com.mx/media/wysiwyg/halston-america.png',
    description: 'Refuerzo perimetral Foam Encasement que maximiza el área útil para dormir de borde a borde.',
    comfortSystem: 'Unidad de resortes Infinity + Marco perimetral HD',
    warrantyYears: 10,
    stockTotal: 38,
  },
  {
    id: 'prod-10',
    sku: 'SC-SEA-CLB-KS',
    name: 'Sealy Colchón Celebration Plus',
    brand: 'Sealy',
    size: 'King Size',
    firmness: 'Media',
    price: 5299,
    originalPrice: 8999,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/c/e/celebration-plus-ambiente-op.png',
    description: 'Tecnología Posturepedic desarrollada junto a cirujanos ortopedistas para la postura ideal.',
    comfortSystem: 'Posturepedic Core Support + Espuma viscoelástica Sealy Foam',
    warrantyYears: 10,
    stockTotal: 26,
  },
  {
    id: 'prod-11',
    sku: 'SC-THE-GEL-KS',
    name: 'Therapedic Colchón Gel Foam',
    brand: 'Therapedic',
    size: 'King Size',
    firmness: 'Suave',
    price: 6499,
    originalPrice: 10999,
    image: 'https://www.supercolchones.com.mx/media/catalog/product/cache/7ebeb6ef5d1f03c9ec7b9673c6f4cd5b/g/e/gel-foam-ambiente-comp.png',
    description: 'Refrigeración pasiva constante y alivio total de tensiones musculares con gel termorregulador.',
    comfortSystem: 'TheraCool Gel Memory Foam + Núcleo aislante HighDensity',
    warrantyYears: 15,
    stockTotal: 18,
  },
];

// =========================================================================
// SERIALIZED INDIVIDUAL MATTRESSES (NAYT AT TOP)
// =========================================================================
export const INITIAL_SERIALIZED_ITEMS: SerializedItem[] = [
  {
    serialNumber: 'SN-SC-2026-NAYT-94101-IND',
    sku: 'SC-NYT-FLW-IND',
    productName: 'Nayt Colchón Flow Basic White (Individual)',
    brand: 'Nayt',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34-01',
    manufactureDate: '2026-08-27',
    barcode: '7501941010015',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-SC-2026-NAYT-94101-IND',
    status: 'recepcionado',
    locationRack: 'A-01-N1 (Rápido Despacho)',
    rawMaterials: {
      springs: 'Núcleo Foam Core HD',
      foam: 'Poliuretano Confort D24 rebajado de inventario',
      fabric: 'Tela Fresca Tratada Antibacterial rebajada',
    },
  },
  {
    serialNumber: 'SN-SC-2026-NAYT-94102-MAT',
    sku: 'SC-NYT-FLW-MAT',
    productName: 'Nayt Colchón Flow Basic White (Matrimonial)',
    brand: 'Nayt',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34-01',
    manufactureDate: '2026-08-27',
    barcode: '7501941010022',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-SC-2026-NAYT-94102-MAT',
    status: 'en_rack',
    locationRack: 'A-01-N2',
    rawMaterials: {
      springs: 'Núcleo Foam Core HD',
      foam: 'Poliuretano Confort D24 rebajado de inventario',
      fabric: 'Tela Fresca Tratada Antibacterial rebajada',
    },
  },
  {
    serialNumber: 'SN-SC-2026-89421-MAT',
    sku: 'SC-RES-ORT-MAT',
    productName: 'Restonic Colchón Ortopedic',
    brand: 'Restonic',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34-02',
    manufactureDate: '2026-08-25',
    barcode: '7501234589421',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-SC-2026-89421-MAT',
    status: 'en_rack',
    locationRack: 'A-12-N2',
    rawMaterials: {
      springs: '312 Resortes Bonnell Calibre 13',
      foam: 'Poliuretano 24kg/m³ D24',
      fabric: 'Jacquard Antibacterial Tratado',
    },
  },
  {
    serialNumber: 'SN-SC-2026-90115-IND',
    sku: 'SC-SPA-REC-IND',
    productName: 'Spring Air Colchón Record',
    brand: 'Spring Air',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34-03',
    manufactureDate: '2026-08-26',
    barcode: '7501234590115',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-SC-2026-90115-IND',
    status: 'recepcionado',
    locationRack: 'Área de Acomodo Temporal',
    rawMaterials: {
      springs: '250 Resortes Performance Spring Air',
      foam: 'Espuma Confort Never Turn',
      fabric: 'Poliéster Tejido de Punto Suave',
    },
  },
  {
    serialNumber: 'SN-SC-2026-91204-QS',
    sku: 'SC-RES-MNC-QS',
    productName: 'Restonic Colchón Moon Cool + Almohada',
    brand: 'Restonic',
    size: 'Queen Size',
    lotNumber: 'LOTE-2026-W34-04',
    manufactureDate: '2026-08-26',
    barcode: '7501234591204',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-SC-2026-91204-QS',
    status: 'en_rack',
    locationRack: 'B-04-N1',
    rawMaterials: {
      springs: '510 Resortes Independientes Pocket',
      foam: 'Memory Foam con Gel Fresh',
      fabric: 'Strech Cooling Ice Touch',
    },
  },
];

// =========================================================================
// MOCK RECEIPT ORDERS
// =========================================================================
export const INITIAL_RECEIPT_ORDERS: ReceiptOrder[] = [
  {
    id: 'rec-01',
    orderNumber: 'REC-2026-0814',
    origin: 'Planta de Fabricación - Línea Nayt',
    targetWarehouse: 'CEDIS Monterrey Central',
    date: '2026-08-27',
    status: 'en_verificacion',
    totalItems: 30,
    scannedItems: 18,
    items: [
      {
        sku: 'SC-NYT-FLW-IND',
        productName: 'Nayt Colchón Flow Basic White (Individual)',
        brand: 'Nayt',
        size: 'Individual',
        quantity: 15,
        scanned: 10,
        serials: ['SN-SC-2026-NAYT-94101-IND'],
      },
      {
        sku: 'SC-NYT-FLW-MAT',
        productName: 'Nayt Colchón Flow Basic White (Matrimonial)',
        brand: 'Nayt',
        size: 'Matrimonial',
        quantity: 15,
        scanned: 8,
        serials: ['SN-SC-2026-NAYT-94102-MAT'],
      },
    ],
  },
  {
    id: 'rec-02',
    orderNumber: 'REC-2026-0815',
    origin: 'Planta Ensambladora Regiomontana',
    targetWarehouse: 'CEDIS Monterrey Central',
    date: '2026-08-27',
    status: 'pendiente',
    totalItems: 20,
    scannedItems: 0,
    items: [
      {
        sku: 'SC-RES-MNC-QS',
        productName: 'Restonic Colchón Moon Cool + Almohada (Queen)',
        brand: 'Restonic',
        size: 'Queen Size',
        quantity: 10,
        scanned: 0,
        serials: [],
      },
      {
        sku: 'SC-SEA-CLB-KS',
        productName: 'Sealy Colchón Celebration Plus (King)',
        brand: 'Sealy',
        size: 'King Size',
        quantity: 10,
        scanned: 0,
        serials: [],
      },
    ],
  },
];

// =========================================================================
// MOCK TRUCK OUTBOUND ORDERS
// =========================================================================
export const INITIAL_TRUCK_ORDERS: TruckOutboundOrder[] = [
  {
    id: 'emb-01',
    orderNumber: 'EMB-2026-042',
    routeNumber: 'RUTA-MTY-CUMBRES-03',
    destination: 'Sucursal Impresos RTM Cumbres + Gonzalitos',
    truckPlate: 'NL-8492-B (Rabón 14T)',
    driverName: 'Carlos Mendoza',
    scheduledDate: '2026-08-27',
    status: 'en_carga',
    totalExpected: 50,
    scannedCount: 40, // Faltan 10 colchones por cargar
    items: [
      {
        sku: 'SC-NYT-FLW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        size: 'Individual',
        expected: 25,
        scannedSerials: [
          'SN-SC-2026-NAYT-94101-IND',
          'SN-SC-2026-NAYT-94102-IND',
          'SN-SC-2026-NAYT-94103-IND',
          'SN-SC-2026-NAYT-94104-IND',
          'SN-SC-2026-NAYT-94105-IND',
          'SN-SC-2026-NAYT-94106-IND',
          'SN-SC-2026-NAYT-94107-IND',
          'SN-SC-2026-NAYT-94108-IND',
          'SN-SC-2026-NAYT-94109-IND',
          'SN-SC-2026-NAYT-94110-IND',
          'SN-SC-2026-NAYT-94111-IND',
          'SN-SC-2026-NAYT-94112-IND',
          'SN-SC-2026-NAYT-94113-IND',
          'SN-SC-2026-NAYT-94114-IND',
          'SN-SC-2026-NAYT-94115-IND',
        ], // 15 cargados de 25 (faltan 10)
      },
      {
        sku: 'SC-RES-ORT-MAT',
        productName: 'Restonic Colchón Ortopedic Matrimonial',
        size: 'Matrimonial',
        expected: 25,
        scannedSerials: Array.from({ length: 25 }, (_, i) => `SN-SC-2026-894${i + 20}-MAT`), // 25 completos
      },
    ],
  },
  {
    id: 'emb-02',
    orderNumber: 'EMB-2026-043',
    routeNumber: 'RUTA-SALTILLO-EXPRESS',
    destination: 'CEDIS Regional Saltillo Coahuila',
    truckPlate: 'COAH-3190-C (Tráiler 53ft)',
    driverName: 'Roberto Garza Treviño',
    scheduledDate: '2026-08-28',
    status: 'en_carga',
    totalExpected: 80,
    scannedCount: 80, // Completo
    items: [
      {
        sku: 'SC-NYT-FLW-MAT',
        productName: 'Nayt Colchón Flow Matrimonial',
        size: 'Matrimonial',
        expected: 40,
        scannedSerials: Array.from({ length: 40 }, (_, i) => `SN-SC-2026-NAYT-942${i + 10}-MAT`),
      },
      {
        sku: 'SC-RES-MNC-QS',
        productName: 'Restonic Colchón Moon Cool Queen',
        size: 'Queen Size',
        expected: 40,
        scannedSerials: Array.from({ length: 40 }, (_, i) => `SN-SC-2026-912${i + 10}-QS`),
      },
    ],
  },
];
