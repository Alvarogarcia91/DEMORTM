export interface IndustrialProduct {
  id: string;
  sku: string;
  name: string;
  brand: 'Black & Decker' | 'Spring Air' | 'Restonic' | 'América' | 'Sealy' | 'Therapedic' | 'Magnus' | 'Stearns & Foster' | 'Stanley Tools' | 'Medifarma' | 'Avery Dennison' | 'Schneider Electric' | 'Sun Chemical' | 'Bio-Pappel';
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
  serialNumber: string; // ej. SN-RTM-2026-BD-89421-IND
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
  origin: string;      // ej. Planta Principal RTM
  targetWarehouse: string; // ej. Almacén Principal RTM
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
  routeNumber: string; // ej. RUTA-RTM-MAT-01
  destination: string; // ej. Almacén Satélite Matamoros
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
// REAL INDUSTRIAL PRODUCTS CATALOG
// =========================================================================
export const MOCK_PRODUCTS: IndustrialProduct[] = [
  {
    id: 'prod-01',
    sku: 'SC-NYT-FLW-IND',
    name: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    firmness: 'Media',
    price: 2499,
    originalPrice: 3899,
    image: '/assets/placeholder-product.svgte-ambiente-1.png',
    description: 'Estructura ergonómica con espuma de alta resiliencia y tela transpirable fresca.',
    comfortSystem: 'Papel bond 75g de alta blancura y opacidad para interiores de manuales',
    warrantyYears: 5,
    stockTotal: 120,
  },
  {
    id: 'prod-02',
    sku: 'SC-NYT-FLW-MAT',
    name: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 2899,
    originalPrice: 4299,
    image: '/assets/placeholder-product.svgte-ambiente-1.png',
    description: 'Soporte ortopédico equilibrado con tecnología de empaque al alto vacío.',
    comfortSystem: 'Estructura Bi-Confort + Espuma ViscoSoft',
    warrantyYears: 5,
    stockTotal: 85,
  },
  {
    id: 'prod-03',
    sku: 'SC-NYT-FLW-QS',
    name: 'Folleto Plegable Médico 48 Páginas Medifarma',
    brand: 'Black & Decker',
    size: 'Queen Size',
    firmness: 'Suave',
    price: 3499,
    originalPrice: 5199,
    image: '/assets/placeholder-product.svgte-ambiente-1.png',
    description: 'Manual técnico especializado de alta durabilidad para empaque industrial.',
    comfortSystem: 'CoolGel Infused Memory Layer + Respaldo Ortopédico',
    warrantyYears: 10,
    stockTotal: 60,
  },
  {
    id: 'prod-04',
    sku: 'PT-BLI-001',
    name: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Matrimonial',
    firmness: 'Firme',
    price: 2699,
    originalPrice: 4299,
    image: '/assets/placeholder-product.svgic_frontal.jpg',
    description: 'Soporte ortopédico integral con resortes continuos que alinean la columna vertebral.',
    comfortSystem: 'Resortes Continuos ContinuousWire + Aislante Shoddy Pad',
    warrantyYears: 5,
    stockTotal: 64,
  },
  {
    id: 'prod-05',
    sku: 'PT-BLI-003',
    name: 'Blister Card 14 pts Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 2699,
    originalPrice: 4199,
    image: '/assets/placeholder-product.svgambiente_6.jpg',
    description: 'Tarjetas blister termosellables con barniz termosellante de alta resistencia.',
    comfortSystem: 'Sistema Worry Free (No vuelta) + Resortes Bonnell',
    warrantyYears: 5,
    stockTotal: 32,
  },
  {
    id: 'prod-06',
    sku: 'PT-CAJ-001',
    name: 'Caja Plegadiza Medicamento Medifarma',
    brand: 'Stanley Tools',
    size: 'Queen Size',
    firmness: 'Suave',
    price: 2699,
    originalPrice: 4599,
    image: '/assets/placeholder-product.svgplaceholder-product.svg',
    description: 'Tecnología térmica de descanso fresco con microcápsulas de gel disipadoras de calor.',
    comfortSystem: 'Gel Infused Memory Foam + Resortes encapsulados Pocket',
    warrantyYears: 10,
    stockTotal: 52,
  },
  {
    id: 'prod-07',
    sku: 'PT-ETQ-001',
    name: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    firmness: 'Firme',
    price: 3199,
    originalPrice: 4999,
    image: '/assets/placeholder-product.svghon.-record-spring_air.png',
    description: 'Avalado por el Colegio de Profesionistas en Quiropráctica de México para el máximo descanso.',
    comfortSystem: 'Resortes Performance Bonnell + Never Turn System',
    warrantyYears: 5,
    stockTotal: 75,
  },
  {
    id: 'prod-08',
    sku: 'SC-SPA-VEN-MAT',
    name: 'Etiqueta en Rollo Térmica Directa',
    brand: 'Medifarma',
    size: 'Matrimonial',
    firmness: 'Media',
    price: 4299,
    originalPrice: 6899,
    image: '/assets/placeholder-product.svg-spring-air-vendome_blancos.png',
    description: 'Etiquetas autoadheribles en bobina para línea de envasado automatizado.',
    comfortSystem: 'Sistema Back Supporter + Resortes independientes Pocket Springs',
    warrantyYears: 10,
    stockTotal: 40,
  },
  {
    id: 'prod-09',
    sku: 'EMP-COR-001',
    name: 'Cartón Plegadizo Caple 24 pts Sultana',
    brand: 'Avery Dennison',
    size: 'Queen Size',
    firmness: 'Extra Firme',
    price: 4599,
    originalPrice: 7499,
    image: '/assets/placeholder-product.svg',
    description: 'Refuerzo perimetral Foam Encasement que maximiza el área útil para dormir de borde a borde.',
    comfortSystem: 'Unidad de resortes Infinity + Marco perimetral HD',
    warrantyYears: 10,
    stockTotal: 38,
  },
  {
    id: 'prod-10',
    sku: 'SUS-PAP-001',
    name: 'Papel Couché 90 g Pliegos BioPapel',
    brand: 'Schneider Electric',
    size: 'King Size',
    firmness: 'Media',
    price: 5299,
    originalPrice: 8999,
    image: '/assets/placeholder-product.svglus-ambiente-op.png',
    description: 'Tecnología Posturepedic desarrollada junto a cirujanos ortopedistas para la postura ideal.',
    comfortSystem: 'Sustrato sulfatado SBS calibre 14 pts de alta rigidez',
    warrantyYears: 10,
    stockTotal: 26,
  },
  {
    id: 'prod-11',
    sku: 'SC-THE-GEL-KS',
    name: 'Tinta Process Black Offset Sun Chemical',
    brand: 'Sun Chemical',
    size: 'King Size',
    firmness: 'Suave',
    price: 6499,
    originalPrice: 10999,
    image: '/assets/placeholder-product.svgente-comp.png',
    description: 'Refrigeración pasiva constante y alivio total de tensiones musculares con gel termorregulador.',
    comfortSystem: 'TheraCool Gel Memory Foam + Núcleo aislante HighDensity',
    warrantyYears: 15,
    stockTotal: 18,
  },
];

// =========================================================================
// SERIALIZED INDUSTRIAL UNITS
// =========================================================================
export const INITIAL_SERIALIZED_ITEMS: SerializedItem[] = [
  {
    serialNumber: 'SN-RTM-2026-BD-94101-IND',
    sku: 'SC-NYT-FLW-IND',
    productName: 'Manual Instructivo 24 Páginas Black & Decker',
    brand: 'Black & Decker',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34-01',
    manufactureDate: '2026-08-27',
    barcode: '7501941010015',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-RTM-2026-BD-94101-IND',
    status: 'recepcionado',
    locationRack: 'A-01-N1 (Rápido Despacho)',
    rawMaterials: {
      springs: 'Núcleo Foam Core HD',
      foam: 'Poliuretano Confort D24 rebajado de inventario',
      fabric: 'Tela Fresca Tratada Antibacterial rebajada',
    },
  },
  {
    serialNumber: 'SN-RTM-2026-BD-94102-MAT',
    sku: 'SC-NYT-FLW-MAT',
    productName: 'Manual Instructivo 48 Páginas Medifarma',
    brand: 'Black & Decker',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34-01',
    manufactureDate: '2026-08-27',
    barcode: '7501941010022',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-RTM-2026-BD-94102-MAT',
    status: 'en_rack',
    locationRack: 'A-01-N2',
    rawMaterials: {
      springs: 'Núcleo Foam Core HD',
      foam: 'Poliuretano Confort D24 rebajado de inventario',
      fabric: 'Tela Fresca Tratada Antibacterial rebajada',
    },
  },
  {
    serialNumber: 'SN-RTM-2026-89421-MAT',
    sku: 'PT-BLI-001',
    productName: 'Blister Card Termosellable Stanley Tools',
    brand: 'Stanley Tools',
    size: 'Matrimonial',
    lotNumber: 'LOTE-2026-W34-02',
    manufactureDate: '2026-08-25',
    barcode: '7501234589421',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-RTM-2026-89421-MAT',
    status: 'en_rack',
    locationRack: 'A-12-N2',
    rawMaterials: {
      springs: '312 Resortes Bonnell Calibre 13',
      foam: 'Poliuretano 24kg/m³ D24',
      fabric: 'Jacquard Antibacterial Tratado',
    },
  },
  {
    serialNumber: 'SN-RTM-2026-90115-IND',
    sku: 'PT-ETQ-001',
    productName: 'Etiqueta Farmacéutica 4x6" Medifarma',
    brand: 'Medifarma',
    size: 'Individual',
    lotNumber: 'LOTE-2026-W34-03',
    manufactureDate: '2026-08-26',
    barcode: '7501234590115',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-RTM-2026-90115-IND',
    status: 'recepcionado',
    locationRack: 'Área de Acomodo Temporal',
    rawMaterials: {
      springs: 'Bobina Suaje Gráfico',
      foam: 'Espuma Confort Never Turn',
      fabric: 'Poliéster Tejido de Punto Suave',
    },
  },
  {
    serialNumber: 'SN-RTM-2026-91204-QS',
    sku: 'PT-CAJ-001',
    productName: 'Caja Plegadiza Medicamento Medifarma',
    brand: 'Stanley Tools',
    size: 'Queen Size',
    lotNumber: 'LOTE-2026-W34-04',
    manufactureDate: '2026-08-26',
    barcode: '7501234591204',
    qrCode: 'https://erp.rtmimpresos.com.mx/trace/SN-RTM-2026-91204-QS',
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
    origin: 'Planta Principal Impresos RTM',
    targetWarehouse: 'Almacén Principal RTM',
    date: '2026-08-27',
    status: 'en_verificacion',
    totalItems: 30,
    scannedItems: 18,
    items: [
      {
        sku: 'SC-NYT-FLW-IND',
        productName: 'Manual Instructivo 24 Páginas Black & Decker',
        brand: 'Black & Decker',
        size: 'Individual',
        quantity: 15,
        scanned: 10,
        serials: ['SN-RTM-2026-BD-94101-IND'],
      },
      {
        sku: 'SC-NYT-FLW-MAT',
        productName: 'Manual Instructivo 48 Páginas Medifarma',
        brand: 'Black & Decker',
        size: 'Matrimonial',
        quantity: 15,
        scanned: 8,
        serials: ['SN-RTM-2026-BD-94102-MAT'],
      },
    ],
  },
  {
    id: 'rec-02',
    orderNumber: 'REC-2026-0815',
    origin: 'Planta Ensambladora Regiomontana',
    targetWarehouse: 'Almacén Principal RTM',
    date: '2026-08-27',
    status: 'pendiente',
    totalItems: 20,
    scannedItems: 0,
    items: [
      {
        sku: 'PT-CAJ-001',
        productName: 'Caja Plegadiza Medicamento Medifarma',
        brand: 'Stanley Tools',
        size: 'Queen Size',
        quantity: 10,
        scanned: 0,
        serials: [],
      },
      {
        sku: 'SUS-PAP-001',
        productName: 'Papel Couché 90 g Pliegos BioPapel',
        brand: 'Schneider Electric',
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
    routeNumber: 'RUTA-RTM-MAT-01',
    destination: 'Almacén Satélite Matamoros',
    truckPlate: 'NL-8492-B (Rabón 14T)',
    driverName: 'Carlos Mendoza',
    scheduledDate: '2026-08-27',
    status: 'en_carga',
    totalExpected: 50,
    scannedCount: 40, // Faltan 10 tarimas por cargar
    items: [
      {
        sku: 'SC-NYT-FLW-IND',
        productName: 'Manual Instructivo 24 Páginas Black & Decker',
        size: 'Individual',
        expected: 25,
        scannedSerials: [
          'SN-RTM-2026-BD-94101-IND',
          'SN-RTM-2026-BD-94102-IND',
          'SN-RTM-2026-BD-94103-IND',
          'SN-RTM-2026-BD-94104-IND',
          'SN-RTM-2026-BD-94105-IND',
          'SN-RTM-2026-BD-94106-IND',
          'SN-RTM-2026-BD-94107-IND',
          'SN-RTM-2026-BD-94108-IND',
          'SN-RTM-2026-BD-94109-IND',
          'SN-RTM-2026-BD-94110-IND',
          'SN-RTM-2026-BD-94111-IND',
          'SN-RTM-2026-BD-94112-IND',
          'SN-RTM-2026-BD-94113-IND',
          'SN-RTM-2026-BD-94114-IND',
          'SN-RTM-2026-BD-94115-IND',
        ], // 15 cargados de 25 (faltan 10)
      },
      {
        sku: 'PT-BLI-001',
        productName: 'Blister Card Termosellable Stanley Tools',
        size: 'Matrimonial',
        expected: 25,
        scannedSerials: Array.from({ length: 25 }, (_, i) => `SN-RTM-2026-894${i + 20}-MAT`), // 25 completos
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
        productName: 'Manual Instructivo 48 Páginas Medifarma',
        size: 'Matrimonial',
        expected: 40,
        scannedSerials: Array.from({ length: 40 }, (_, i) => `SN-RTM-2026-BD-942${i + 10}-MAT`),
      },
      {
        sku: 'PT-CAJ-001',
        productName: 'Caja Plegadiza Medicamento Medifarma',
        size: 'Queen Size',
        expected: 40,
        scannedSerials: Array.from({ length: 40 }, (_, i) => `SN-RTM-2026-912${i + 10}-QS`),
      },
    ],
  },
];
