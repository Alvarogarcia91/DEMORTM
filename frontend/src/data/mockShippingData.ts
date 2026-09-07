import { OutboundRemision, DeliveryProof, markRemisionAsDelivered } from './mockRemisionesData';

export type ShippingOrderStatus = 
  | 'Lista para carga' 
  | 'Transporte asignado' 
  | 'Preparando carga' 
  | 'En ruta' 
  | 'Completada' 
  | 'Cancelada';

export type ShippingOrderType = 'Venta' | 'Traspaso' | 'Exposición';

export interface ShippingVehicle {
  id: string;
  code: string; // ej. 'Camión #08'
  name: string; // ej. 'Camión #08 · Isuzu NPR'
  brandModel: string; // ej. 'Isuzu NPR 4.5 Ton'
  plate: string; // ej. 'NL-8492-B'
  maxUnitsCapacity: number; // ej. 32
  maxWeightKg: number; // ej. 4500
  status: 'Disponible' | 'En ruta' | 'Mantenimiento';
  currentDriverName?: string;
  warehouseId: string;
}

export interface ShippingDriver {
  id: string;
  name: string;
  licenseType: string;
  phone: string;
  status: 'Disponible' | 'En ruta' | 'Descanso';
  assignedVehicleName?: string;
  warehouseId: string;
}

export interface ShippingOrderItem {
  sku: string;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  lotNumber?: string;
  uids: string[];
}

export interface RouteStop {
  id: string;
  sequenceNumber: number;
  destinationName: string;
  zoneName: string; // ej. 'San Pedro Garza García', 'Valle Oriente', 'Cumbres', 'Zona Sur'
  address: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  totalUnits: number;
  remisionFolio: string;
  sourceDocumentFolio: string;
  customerType?: string;
  contactName?: string;
  timeWindow: string; // ej. '09:00 - 10:30 h'
  priority: 'Alta' | 'Normal' | 'Urgente';
  notes?: string;
  items: ShippingOrderItem[];
}

export type RouteStrategyType = 
  | 'RECOMMENDED' 
  | 'SHORTEST_DISTANCE' 
  | 'PRIORITY_WINDOW' 
  | 'MANUAL' 
  | 'DIRECT';

export interface RouteAlternative {
  id: string;
  strategy: RouteStrategyType;
  title: string; // 'Recomendada' | 'Menor distancia' | 'Prioridad de entrega' | 'Personalizada' | 'Ruta directa'
  badge?: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  trafficDelayMinutes: number;
  stopsCount: number;
  windowsMetCount: number;
  totalWindowsCount: number;
  stopsSequence: string[]; // IDs de paradas en orden
  description: string;
}

export interface LoadingZone {
  id: string;
  zoneCode: string; // ej. 'ZONA A', 'ZONA B', 'ZONA C'
  zonePosition: 'Fondo' | 'Intermedio' | 'Puertas' | 'Caja completa';
  loadingOrderNumber: number; // 1 (primero en cargar), 2, 3...
  stopId: string;
  stopSequenceNumber: number; // e.g. 3, 2, 1 (orden de entrega)
  destinationName: string;
  zoneName: string;
  address: string;
  remisionFolio: string;
  totalUnits: number;
  items: ShippingOrderItem[];
  uids: string[];
  colorAccent?: string;
}

export function generateRecommendedLoadingZones(stops: RouteStop[]): LoadingZone[] {
  if (!stops || stops.length === 0) return [];

  if (stops.length === 1) {
    const single = stops[0];
    const allUids = single.items.flatMap((it) => it.uids);
    return [
      {
        id: `zone-single-${single.id}`,
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: single.id,
        stopSequenceNumber: 1,
        destinationName: single.destinationName,
        zoneName: single.zoneName,
        address: single.address,
        remisionFolio: single.remisionFolio,
        totalUnits: single.totalUnits,
        items: single.items,
        uids: allUids,
        colorAccent: 'rose',
      },
    ];
  }

  // Multi-stop: LIFO loading sequence (Reversed order of stops)
  // Last stop (Parada N) is loaded 1st (Frente/Fondo de la caja)
  // First stop (Parada 1) is loaded last (Puertas de descarga)
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const reversedStops = [...stops].reverse();

  return reversedStops.map((stop, idx) => {
    const position =
      idx === 0
        ? 'Fondo'
        : idx === reversedStops.length - 1
        ? 'Puertas'
        : 'Intermedio';

    const allUids = stop.items.flatMap((it) => it.uids);
    const accents = ['indigo', 'amber', 'emerald', 'sky', 'rose'];

    return {
      id: `zone-${stop.id}`,
      zoneCode: `ZONA ${letters[idx] || (idx + 1)}`,
      zonePosition: position,
      loadingOrderNumber: idx + 1,
      stopId: stop.id,
      stopSequenceNumber: stop.sequenceNumber,
      destinationName: stop.destinationName,
      zoneName: stop.zoneName,
      address: stop.address,
      remisionFolio: stop.remisionFolio,
      totalUnits: stop.totalUnits,
      items: stop.items,
      uids: allUids,
      colorAccent: accents[idx % accents.length],
    };
  });
}

export interface ShippingOutboundOrder {
  id: string;
  folio: string; // ej. 'OS-2026-0048'
  type: ShippingOrderType;
  sourceDocumentFolio: string; // ej. 'PED-2026-0103' o 'OTP-2026-0044'
  sourceDocumentType: 'Pedido' | 'OTP' | 'Exposición';
  originWarehouseId: string;
  originWarehouseName: string; // ej. 'ALM-MP (Materia Prima - Nave 1 Reynosa)'
  originCoordinates: { x: number; y: number; name: string };
  destinationName: string; // ej. 'Roberto Cantú Garza' o 'Laboratorios Medifarma (Parque Industrial)'
  destinationAddress?: string;
  destinationFacility?: string;
  totalUnits: number;
  remisionFolio: string; // ej. 'REM-2026-0061'
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  plannedDate?: string;
  plannedTime?: string;
  status: ShippingOrderStatus;
  createdAt: string;
  assignedLane?: string;
  notes?: string;
  items: ShippingOrderItem[];
  stops: RouteStop[];
  routeAlternatives: RouteAlternative[];
  selectedStrategy: RouteStrategyType;
}

export const MOCK_SHIPPING_VEHICLES: ShippingVehicle[] = [
  {
    id: 'veh-08',
    code: 'Camión #08',
    name: 'Camión #08 · Isuzu NPR',
    brandModel: 'Isuzu NPR 4.5 Ton',
    plate: 'NL-8492-B',
    maxUnitsCapacity: 32,
    maxWeightKg: 4500,
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'veh-12',
    code: 'Camión #12',
    name: 'Camión #12 · Hino 300',
    brandModel: 'Hino Serie 300 4.0 Ton',
    plate: 'NL-3910-C',
    maxUnitsCapacity: 28,
    maxWeightKg: 4000,
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'veh-04',
    code: 'Unidad #04',
    name: 'Unidad #04 · Nissan Cabstar',
    brandModel: 'Nissan Cabstar 2.5 Ton',
    plate: 'NL-7721-A',
    maxUnitsCapacity: 16,
    maxWeightKg: 2500,
    status: 'Disponible',
    warehouseId: 'wh-mty-sur',
  },
  {
    id: 'veh-15',
    code: 'Unidad #15',
    name: 'Unidad #15 · Freightliner M2',
    brandModel: 'Freightliner M2 106 8.0 Ton',
    plate: 'NL-5520-C',
    maxUnitsCapacity: 45,
    maxWeightKg: 8000,
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'veh-05',
    code: 'Camión #05',
    name: 'Camión #05 · Isuzu Forward',
    brandModel: 'Isuzu Forward 800 6.0 Ton',
    plate: 'NL-1104-D',
    maxUnitsCapacity: 50,
    maxWeightKg: 6000,
    status: 'En ruta',
    currentDriverName: 'Raúl Morales',
    warehouseId: 'wh-mty-sur',
  },
  {
    id: 'veh-02',
    code: 'Unidad #02',
    name: 'Unidad #02 · Ram 4000',
    brandModel: 'Ram 4000 Heavy Duty',
    plate: 'NL-9022-X',
    maxUnitsCapacity: 12,
    maxWeightKg: 3000,
    status: 'Mantenimiento',
    warehouseId: 'wh-mty-sur',
  },
];

export const MOCK_SHIPPING_DRIVERS: ShippingDriver[] = [
  {
    id: 'drv-1',
    name: 'Roberto Garza',
    licenseType: 'Federal Tipo B (Transporte de Carga)',
    phone: '81-1234-5678',
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'drv-2',
    name: 'Carlos Medina',
    licenseType: 'Estatal Tipo Chofer Particular y Comercial',
    phone: '81-2345-6789',
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'drv-3',
    name: 'Luis Herrera',
    licenseType: 'Federal Tipo B (Carga General)',
    phone: '81-3456-7890',
    status: 'Disponible',
    warehouseId: 'wh-mty-norte',
  },
  {
    id: 'drv-4',
    name: 'Javier Salinas',
    licenseType: 'Federal Tipo B (Carga y Maniobras)',
    phone: '81-4567-8901',
    status: 'Disponible',
    warehouseId: 'wh-mty-sur',
  },
  {
    id: 'drv-5',
    name: 'Raúl Morales',
    licenseType: 'Federal Tipo B (Rutas Inter-sucursales)',
    phone: '81-5678-9012',
    status: 'En ruta',
    assignedVehicleName: 'Camión #05 · Isuzu Forward',
    warehouseId: 'wh-mty-sur',
  },
];

export const INITIAL_MOCK_SHIPPING_ORDERS: ShippingOutboundOrder[] = [
  // =========================================================================
  // 1. VENTA MULTI-PARADA (3 Entregas · 14 Unidades · San Pedro, Valle Oriente, Sur)
  // =========================================================================
  {
    id: 'sh-ord-1',
    folio: 'OS-2026-0048',
    type: 'Venta',
    sourceDocumentFolio: 'PED-2026-0103',
    sourceDocumentType: 'Pedido',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    destinationName: 'Ruta Metropolitana San Pedro - Valle Ote. (3 Clientes)',
    destinationAddress: 'Circuito San Pedro & Zona Valle Oriente',
    totalUnits: 14,
    remisionFolio: 'REM-2026-0061',
    assignedVehicleId: 'veh-08',
    assignedVehicleName: 'Camión #08 · Isuzu NPR',
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Roberto Garza',
    plannedDate: '28 Ago 2026',
    plannedTime: '08:30',
    status: 'Transporte asignado',
    createdAt: '26 Ago 2026, 15:45',
    assignedLane: 'EMB-01',
    notes: 'Ruta consolidada con 3 entregas comerciales y residenciales. Se programó inicio a las 08:30 h para evitar hora pico en Gonzalitos.',
    selectedStrategy: 'RECOMMENDED',
    items: [
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 4,
        lotNumber: 'LOTE-2026-W33',
        uids: ['CJ-RTM-2026-000131', 'CJ-RTM-2026-000132', 'CJ-RTM-2026-000133', 'CJ-RTM-2026-000134'],
      },
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 3,
        lotNumber: 'LOTE-2026-W31',
        uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000103'],
      },
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 7,
        lotNumber: 'LOTE-2026-W34',
        uids: ['CJ-RTM-2026-000241', 'CJ-RTM-2026-000242', 'CJ-RTM-2026-000243', 'CJ-RTM-2026-000244', 'CJ-RTM-2026-000245', 'CJ-RTM-2026-000246', 'CJ-RTM-2026-000247'],
      },
    ],
    stops: [
      {
        id: 'stop-48-1',
        sequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Roble 600, Col. Valle del Campestre, San Pedro Garza García, N.L.',
        coordinates: { x: 330, y: 310 },
        totalUnits: 4,
        remisionFolio: 'REM-2026-0061',
        sourceDocumentFolio: 'PED-2026-0103',
        customerType: 'Persona física',
        contactName: 'Lic. Roberto Cantú',
        timeWindow: '09:00 - 10:30 h',
        priority: 'Normal',
        notes: 'Entrega en residencia particular. Maniobra en 2do piso autorizada.',
        items: [
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 4,
            uids: ['CJ-RTM-2026-000131', 'CJ-RTM-2026-000132', 'CJ-RTM-2026-000133', 'CJ-RTM-2026-000134'],
          },
        ],
      },
      {
        id: 'stop-48-2',
        sequenceNumber: 2,
        destinationName: 'Hotel Boutique Las Lomas',
        zoneName: 'Valle Oriente',
        address: 'Av. Frida Kahlo 195, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0063',
        sourceDocumentFolio: 'PED-2026-0107',
        customerType: 'Hotel / Corporativo',
        contactName: 'Ing. Fernando Morales (Compras)',
        timeWindow: '10:30 - 12:00 h',
        priority: 'Urgente',
        notes: 'Descarga en andén de servicio posterior. Requiere remisión firmada con sello.',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 3,
            uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000103'],
          },
        ],
      },
      {
        id: 'stop-48-3',
        sequenceNumber: 3,
        destinationName: 'Grupo Hotelero Sierra Madre S.A.',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        coordinates: { x: 500, y: 350 },
        totalUnits: 7,
        remisionFolio: 'REM-2026-0064',
        sourceDocumentFolio: 'PED-2026-0180',
        customerType: 'Cadena Hotelera',
        contactName: 'Lic. Marcela Lozano',
        timeWindow: '12:00 - 13:30 h',
        priority: 'Alta',
        notes: 'Recepción en área de blancos y equipamiento hotelero.',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 7,
            uids: ['CJ-RTM-2026-000241', 'CJ-RTM-2026-000242', 'CJ-RTM-2026-000243', 'CJ-RTM-2026-000244', 'CJ-RTM-2026-000245', 'CJ-RTM-2026-000246', 'CJ-RTM-2026-000247'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-48-rec',
        strategy: 'RECOMMENDED',
        title: 'Ruta recomendada',
        badge: 'Óptima',
        distanceKm: 43.8,
        estimatedTimeMinutes: 97, // 1h 37min
        trafficDelayMinutes: 24,
        stopsCount: 3,
        windowsMetCount: 3,
        totalWindowsCount: 3,
        stopsSequence: ['stop-48-1', 'stop-48-2', 'stop-48-3'],
        description: 'Mejor equilibrio global: minimiza tiempo en congestión matutina en Gonzalitos y cumple el 100% de las ventanas horarias.',
      },
      {
        id: 'alt-48-dist',
        strategy: 'SHORTEST_DISTANCE',
        title: 'Menor distancia',
        distanceKm: 39.2,
        estimatedTimeMinutes: 114, // 1h 54min
        trafficDelayMinutes: 41,
        stopsCount: 3,
        windowsMetCount: 2,
        totalWindowsCount: 3,
        stopsSequence: ['stop-48-2', 'stop-48-1', 'stop-48-3'],
        description: 'Reduce 4.6 km de recorrido físico pero atraviesa zonas con mayor congestión en Av. Vasconcelos y semáforos continuos.',
      },
      {
        id: 'alt-48-prio',
        strategy: 'PRIORITY_WINDOW',
        title: 'Prioridad de entrega',
        distanceKm: 47.1,
        estimatedTimeMinutes: 102, // 1h 42min
        trafficDelayMinutes: 28,
        stopsCount: 3,
        windowsMetCount: 3,
        totalWindowsCount: 3,
        stopsSequence: ['stop-48-2', 'stop-48-3', 'stop-48-1'],
        description: 'Prioriza la entrega de alta urgencia en Hotel Boutique Las Lomas como primera parada garantizada antes de las 10:00 h.',
      },
    ],
  },

  // =========================================================================
  // 2. VENTA MULTI-PARADA (2 Entregas · 8 Unidades · Cumbres & Santa Catarina)
  // =========================================================================
  {
    id: 'sh-ord-2',
    folio: 'OS-2026-0050',
    type: 'Venta',
    sourceDocumentFolio: 'PED-2026-0107',
    sourceDocumentType: 'Pedido',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    destinationName: 'Ruta Poniente Cumbres - Santa Catarina (2 Clientes)',
    destinationAddress: 'Av. Paseo de los Leones & Carretera a Saltillo',
    totalUnits: 8,
    remisionFolio: 'REM-2026-0062',
    assignedVehicleId: 'veh-12',
    assignedVehicleName: 'Camión #12 · Hino 300',
    assignedDriverId: 'drv-3',
    assignedDriverName: 'Luis Herrera',
    plannedDate: '28 Ago 2026',
    plannedTime: '09:00',
    status: 'Transporte asignado',
    createdAt: '27 Ago 2026, 11:30',
    assignedLane: 'EMB-02',
    notes: 'Ruta poniente para desarrollos residenciales en preventa y cliente corporativo.',
    selectedStrategy: 'RECOMMENDED',
    items: [
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 4,
        lotNumber: 'LOTE-2026-W31',
        uids: ['CJ-RTM-2026-000103', 'CJ-RTM-2026-000104', 'CJ-RTM-2026-000105', 'CJ-RTM-2026-000106'],
      },
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 4,
        lotNumber: 'LOTE-2026-W34',
        uids: ['CJ-RTM-2026-000186', 'CJ-RTM-2026-000187', 'CJ-RTM-2026-000188', 'CJ-RTM-2026-000189'],
      },
    ],
    stops: [
      {
        id: 'stop-50-1',
        sequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'Cumbres 5to Sector',
        address: 'Av. Paseo de los Leones 3300, Cumbres, Monterrey, N.L.',
        coordinates: { x: 170, y: 190 },
        totalUnits: 5,
        remisionFolio: 'REM-2026-0062',
        sourceDocumentFolio: 'PED-2026-0107',
        customerType: 'Desarrolladora',
        contactName: 'Arq. Esteban Morales',
        timeWindow: '09:30 - 11:00 h',
        priority: 'Alta',
        notes: 'Entrega para departamento muestra.',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 3,
            uids: ['CJ-RTM-2026-000103', 'CJ-RTM-2026-000104', 'CJ-RTM-2026-000105'],
          },
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000186', 'CJ-RTM-2026-000187'],
          },
        ],
      },
      {
        id: 'stop-50-2',
        sequenceNumber: 2,
        destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
        zoneName: 'Santa Catarina Poniente',
        address: 'Av. Manuel Ordóñez 720, Santa Catarina, N.L.',
        coordinates: { x: 110, y: 310 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0065',
        sourceDocumentFolio: 'PED-2026-0112',
        customerType: 'Empresa',
        contactName: 'Lic. Claudia Villarreal',
        timeWindow: '11:30 - 13:00 h',
        priority: 'Normal',
        notes: 'Equipamiento de casas en renta ejecutiva.',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 1,
            uids: ['CJ-RTM-2026-000106'],
          },
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000188', 'CJ-RTM-2026-000189'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-50-rec',
        strategy: 'RECOMMENDED',
        title: 'Ruta recomendada',
        badge: 'Óptima',
        distanceKm: 31.4,
        estimatedTimeMinutes: 72, // 1h 12min
        trafficDelayMinutes: 18,
        stopsCount: 2,
        windowsMetCount: 2,
        totalWindowsCount: 2,
        stopsSequence: ['stop-50-1', 'stop-50-2'],
        description: 'Recorrido fluido por Av. Sendero y Anillo Periférico Poniente evitando el cuello de botella de Gonzalitos.',
      },
      {
        id: 'alt-50-dist',
        strategy: 'SHORTEST_DISTANCE',
        title: 'Menor distancia',
        distanceKm: 28.6,
        estimatedTimeMinutes: 85, // 1h 25min
        trafficDelayMinutes: 32,
        stopsCount: 2,
        windowsMetCount: 2,
        totalWindowsCount: 2,
        stopsSequence: ['stop-50-1', 'stop-50-2'],
        description: 'Toma Av. Fidel Velázquez; menor distancia pero con alta fricción de semáforos y obras viales.',
      },
      {
        id: 'alt-50-prio',
        strategy: 'PRIORITY_WINDOW',
        title: 'Prioridad de entrega',
        distanceKm: 34.2,
        estimatedTimeMinutes: 78,
        trafficDelayMinutes: 20,
        stopsCount: 2,
        windowsMetCount: 2,
        totalWindowsCount: 2,
        stopsSequence: ['stop-50-1', 'stop-50-2'],
        description: 'Llegada anticipada a Cumbres 5to Sector para entrega con cita de obra matutina.',
      },
    ],
  },

  // =========================================================================
  // 3. VENTA PARADA ÚNICA (Ruta Directa · 6 Unidades · San Pedro Garza García)
  // =========================================================================
  {
    id: 'sh-ord-5',
    folio: 'OS-2026-0052',
    type: 'Venta',
    sourceDocumentFolio: 'PED-2026-0180',
    sourceDocumentType: 'Pedido',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    destinationName: 'Desarrollos Residenciales del Norte S.A.',
    destinationAddress: 'Av. Ricardo Margáin 555, Santa Engracia, San Pedro Garza García, N.L.',
    totalUnits: 6,
    remisionFolio: 'REM-2026-0064',
    assignedVehicleId: 'veh-15',
    assignedVehicleName: 'Unidad #15 · Freightliner M2',
    assignedDriverId: 'drv-4',
    assignedDriverName: 'Javier Salinas',
    plannedDate: '28 Ago 2026',
    plannedTime: '08:30',
    status: 'Preparando carga',
    createdAt: '27 Ago 2026, 14:00',
    assignedLane: 'EMB-04',
    notes: 'Entrega corporativa en torre residencial. Maniobra en rampa subterránea con altura libre 3.80m.',
    selectedStrategy: 'DIRECT',
    items: [
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 3,
        lotNumber: 'LOTE-2026-W34',
        uids: ['CJ-RTM-2026-000261', 'CJ-RTM-2026-000262', 'CJ-RTM-2026-000263'],
      },
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopedic King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 3,
        lotNumber: 'LOTE-2026-W34',
        uids: ['CJ-RTM-2026-000246', 'CJ-RTM-2026-000247', 'CJ-RTM-2026-000248'],
      },
    ],
    stops: [
      {
        id: 'stop-52-1',
        sequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Ricardo Margáin 555, Santa Engracia, San Pedro Garza García, N.L.',
        coordinates: { x: 330, y: 310 },
        totalUnits: 6,
        remisionFolio: 'REM-2026-0064',
        sourceDocumentFolio: 'PED-2026-0180',
        customerType: 'Desarrolladora',
        contactName: 'Lic. Javier Cantú',
        timeWindow: '08:30 - 10:00 h',
        priority: 'Alta',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 3,
            uids: ['CJ-RTM-2026-000261', 'CJ-RTM-2026-000262', 'CJ-RTM-2026-000263'],
          },
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 3,
            uids: ['CJ-RTM-2026-000246', 'CJ-RTM-2026-000247', 'CJ-RTM-2026-000248'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-52-dir',
        strategy: 'DIRECT',
        title: 'Ruta directa',
        badge: 'Destino único',
        distanceKm: 22.5,
        estimatedTimeMinutes: 38,
        trafficDelayMinutes: 8,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: ['stop-52-1'],
        description: 'Trayecto punto a punto directo desde ALM-MP (Materia Prima - Nave 1 Reynosa) hacia San Pedro Garza García vía Túnel de la Loma Larga.',
      },
    ],
  },

  // =========================================================================
  // 4. VENTA PARADA ÚNICA (Ruta Directa · 3 Unidades · Zona Contry Sur)
  // =========================================================================
  {
    id: 'sh-ord-4b',
    folio: 'OS-2026-0054',
    type: 'Venta',
    sourceDocumentFolio: 'PED-2026-0186',
    sourceDocumentType: 'Pedido',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    destinationName: 'Roberto Cantú Garza',
    destinationAddress: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
    totalUnits: 3,
    remisionFolio: 'REM-2026-0066',
    assignedVehicleId: 'veh-04',
    assignedVehicleName: 'Unidad #04 · Nissan Cabstar',
    assignedDriverId: 'drv-2',
    assignedDriverName: 'Carlos Medina',
    plannedDate: '28 Ago 2026',
    plannedTime: '10:00',
    status: 'Transporte asignado',
    createdAt: '27 Ago 2026, 14:15',
    assignedLane: 'EMB-02',
    notes: 'Entrega local sur a cliente particular.',
    selectedStrategy: 'DIRECT',
    items: [
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 1,
        lotNumber: 'LOTE-2026-W34',
        uids: ['CJ-RTM-2026-000137'],
      },
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 2,
        lotNumber: 'LOTE-2026-W33',
        uids: ['CJ-RTM-2026-000138', 'CJ-RTM-2026-000139'],
      },
    ],
    stops: [
      {
        id: 'stop-54-1',
        sequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        coordinates: { x: 500, y: 350 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0066',
        sourceDocumentFolio: 'PED-2026-0186',
        customerType: 'Persona física',
        timeWindow: '10:00 - 11:30 h',
        priority: 'Normal',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 1,
            uids: ['CJ-RTM-2026-000137'],
          },
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000138', 'CJ-RTM-2026-000139'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-54-dir',
        strategy: 'DIRECT',
        title: 'Ruta directa',
        badge: 'Destino único',
        distanceKm: 12.3,
        estimatedTimeMinutes: 22,
        trafficDelayMinutes: 5,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: ['stop-54-1'],
        description: 'Trayecto corto por Carretera Nacional hacia Av. Garza Sada con tráfico fluido.',
      },
    ],
  },

  // =========================================================================
  // 5. TRASPASO DIRECTO (CEDIS Norte -> Laboratorios Medifarma (Parque Industrial) · 14 Unidades)
  // =========================================================================
  {
    id: 'sh-ord-3',
    folio: 'OS-2026-0049',
    type: 'Traspaso',
    sourceDocumentFolio: 'OTP-2026-0044',
    sourceDocumentType: 'OTP',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    destinationName: 'Laboratorios Medifarma (Parque Industrial)',
    destinationFacility: 'Laboratorios Medifarma (Parque Industrial) · Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
    totalUnits: 14,
    remisionFolio: 'REM-TR-2026-0021',
    assignedVehicleId: 'veh-08',
    assignedVehicleName: 'Camión #08 · Isuzu NPR',
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Roberto Garza',
    plannedDate: '28 Ago 2026',
    plannedTime: '09:00',
    status: 'Transporte asignado',
    createdAt: '26 Ago 2026, 16:25',
    assignedLane: 'EMB-01',
    notes: 'Reabastecimiento prioritario de piso de venta para fin de semana.',
    selectedStrategy: 'DIRECT',
    items: [
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 4,
        lotNumber: 'LOTE-2026-W33',
        uids: ['CJ-RTM-2026-000151', 'CJ-RTM-2026-000152', 'CJ-RTM-2026-000153', 'CJ-RTM-2026-000154'],
      },
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 6,
        lotNumber: 'LOTE-2026-W31',
        uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000107', 'CJ-RTM-2026-000108', 'CJ-RTM-2026-000109', 'CJ-RTM-2026-000110'],
      },
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 4,
        lotNumber: 'LOTE-2026-W33',
        uids: ['CJ-RTM-2026-000211', 'CJ-RTM-2026-000212', 'CJ-RTM-2026-000213', 'CJ-RTM-2026-000214'],
      },
    ],
    stops: [
      {
        id: 'stop-49-1',
        sequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 14,
        remisionFolio: 'REM-TR-2026-0021',
        sourceDocumentFolio: 'OTP-2026-0044',
        customerType: 'Instalación Operativa',
        contactName: 'Brenda Cavazos (Encargada VO)',
        timeWindow: '09:00 - 11:00 h',
        priority: 'Alta',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 4,
            uids: ['CJ-RTM-2026-000151', 'CJ-RTM-2026-000152', 'CJ-RTM-2026-000153', 'CJ-RTM-2026-000154'],
          },
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 6,
            uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000107', 'CJ-RTM-2026-000108', 'CJ-RTM-2026-000109', 'CJ-RTM-2026-000110'],
          },
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 4,
            uids: ['CJ-RTM-2026-000211', 'CJ-RTM-2026-000212', 'CJ-RTM-2026-000213', 'CJ-RTM-2026-000214'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-49-dir',
        strategy: 'DIRECT',
        title: 'Ruta directa',
        badge: 'Destino único',
        distanceKm: 24.8,
        estimatedTimeMinutes: 42,
        trafficDelayMinutes: 12,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: ['stop-49-1'],
        description: 'Traspaso inter-instalaciones directo vía Av. Morones Prieto y Av. Lázaro Cárdenas.',
      },
    ],
  },

  // =========================================================================
  // 6. TRASPASO DIRECTO (CEDIS Sur -> Delphi Technologies (Parque Villa Florida) · 9 Unidades)
  // =========================================================================
  {
    id: 'sh-ord-4',
    folio: 'OS-2026-0051',
    type: 'Traspaso',
    sourceDocumentFolio: 'OTP-2026-0047',
    sourceDocumentType: 'OTP',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    destinationName: 'Delphi Technologies (Parque Villa Florida)',
    destinationFacility: 'Delphi Technologies (Parque Villa Florida) · Av. Paseo de los Leones 1200, Cumbres 1er Sector, Monterrey, N.L.',
    totalUnits: 9,
    remisionFolio: 'REM-TR-2026-0022',
    assignedVehicleId: 'veh-08',
    assignedVehicleName: 'Camión #08 · Isuzu NPR',
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Roberto Garza',
    plannedDate: '28 Ago 2026',
    plannedTime: '10:30',
    status: 'Transporte asignado',
    createdAt: '27 Ago 2026, 13:00',
    assignedLane: 'EMB-03',
    notes: 'Traspaso programado de alta rotación para exhibición en Showroom Cumbres.',
    selectedStrategy: 'DIRECT',
    items: [
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 5,
        lotNumber: 'LOTE-2026-W33',
        uids: ['CJ-RTM-2026-000135', 'CJ-RTM-2026-000136', 'CJ-RTM-2026-000215', 'CJ-RTM-2026-000216', 'CJ-RTM-2026-000217'],
      },
      {
        sku: 'EST-COS-PLE',
        productName: 'RTM Packaging Colchón Celebration Plus King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 4,
        lotNumber: 'LOTE-2026-W35',
        uids: ['CJ-RTM-2026-000301', 'CJ-RTM-2026-000302', 'CJ-RTM-2026-000303', 'CJ-RTM-2026-000304'],
      },
    ],
    stops: [
      {
        id: 'stop-51-1',
        sequenceNumber: 1,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        coordinates: { x: 170, y: 190 },
        totalUnits: 9,
        remisionFolio: 'REM-TR-2026-0022',
        sourceDocumentFolio: 'OTP-2026-0047',
        customerType: 'Instalación Operativa',
        contactName: 'Jorge Villarreal (Encargado Cumbres)',
        timeWindow: '10:30 - 12:00 h',
        priority: 'Normal',
        items: [
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 5,
            uids: ['CJ-RTM-2026-000135', 'CJ-RTM-2026-000136', 'CJ-RTM-2026-000215', 'CJ-RTM-2026-000216', 'CJ-RTM-2026-000217'],
          },
          {
            sku: 'EST-COS-PLE',
            productName: 'RTM Packaging Colchón Celebration Plus King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 4,
            uids: ['CJ-RTM-2026-000301', 'CJ-RTM-2026-000302', 'CJ-RTM-2026-000303', 'CJ-RTM-2026-000304'],
          },
        ],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-51-dir',
        strategy: 'DIRECT',
        title: 'Ruta directa',
        badge: 'Destino único',
        distanceKm: 26.2,
        estimatedTimeMinutes: 48,
        trafficDelayMinutes: 16,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: ['stop-51-1'],
        description: 'Recorrido directo conectando ALM-PT (Producto Terminado - Nave 2 Reynosa) con Delphi Technologies (Parque Villa Florida) vía Av. Gonzalitos y Av. Paseo de los Leones.',
      },
    ],
  },
  // =========================================================================
  // EXPOSICIÓN EXTERNA (Expo Hogar & Confort Cintermex)
  // =========================================================================
  {
    id: 'sh-ord-expo-56',
    folio: 'OS-2026-0056',
    type: 'Exposición',
    sourceDocumentFolio: 'EXPO-2026-0008',
    sourceDocumentType: 'Exposición',
    originWarehouseId: 'wh-suc-valle-oriente',
    originWarehouseName: 'Laboratorios Medifarma (Parque Industrial)',
    originCoordinates: { x: 440, y: 340, name: 'Laboratorios Medifarma (Parque Industrial)' },
    destinationName: 'Cintermex - Sala C (Expo Hogar Monterrey 2026)',
    destinationAddress: 'Av. Fundidora #501, Col. Obrera, Monterrey, N.L.',
    totalUnits: 8,
    remisionFolio: 'REM-2026-0098',
    assignedVehicleId: 'veh-04',
    assignedVehicleName: 'Unidad #04 · Nissan Cabstar',
    assignedDriverId: 'drv-2',
    assignedDriverName: 'Carlos Mendoza',
    plannedDate: '28 Ago 2026',
    plannedTime: '14:00',
    status: 'Transporte asignado',
    createdAt: '28 Ago 2026, 08:30',
    assignedLane: 'EMB-01',
    notes: 'Exhibición comercial externa en Cintermex Stand 42-B. Maniobra de montaje autorizada.',
    selectedStrategy: 'DIRECT',
    items: [
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 2,
        lotNumber: 'LT-2026-N01',
        uids: ['CJ-RTM-2026-000301', 'CJ-RTM-2026-000302'],
      },
      {
        sku: 'ETQ-FAR-VIL',
        productName: 'RTM Packaging Colchón Flow Basic White Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 1,
        lotNumber: 'LT-2026-N02',
        uids: ['CJ-RTM-2026-000303'],
      },
      {
        sku: 'SC-NAYT-PRO-QS',
        productName: 'RTM Packaging Colchón Flow Pro Comfort Queen Size',
        brand: 'RTM Packaging',
        size: 'Queen Size',
        quantity: 1,
        lotNumber: 'LT-2026-N05',
        uids: ['CJ-RTM-2026-000304'],
      },
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record Individual',
        brand: 'RTM Packaging',
        size: 'Individual',
        quantity: 1,
        lotNumber: 'LT-2026-S04',
        uids: ['CJ-RTM-2026-000305'],
      },
      {
        sku: 'FOL-MED-PLE',
        productName: 'RTM Packaging Colchón Record Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 1,
        lotNumber: 'LT-2026-S05',
        uids: ['CJ-RTM-2026-000306'],
      },
      {
        sku: 'CJ-EMB-MED',
        productName: 'RTM Packaging Colchón Ortopédico Matrimonial',
        brand: 'RTM Packaging',
        size: 'Matrimonial',
        quantity: 1,
        lotNumber: 'LT-2026-R07',
        uids: ['CJ-RTM-2026-000307'],
      },
      {
        sku: 'EST-COS-PLE',
        productName: 'RTM Packaging Colchón Crown Jewel King Size',
        brand: 'RTM Packaging',
        size: 'King Size',
        quantity: 1,
        lotNumber: 'LT-2026-S09',
        uids: ['CJ-RTM-2026-000308'],
      },
    ],
    routeAlternatives: [
      {
        id: 'alt-56-dir',
        strategy: 'DIRECT',
        title: 'Ruta directa a Cintermex',
        badge: 'Ruta Directa',
        distanceKm: 9.4,
        estimatedTimeMinutes: 22,
        trafficDelayMinutes: 4,
        stopsCount: 1,
        windowsMetCount: 1,
        totalWindowsCount: 1,
        stopsSequence: ['stop-56-1'],
        description: 'Trayecto directo desde Valle Oriente a Cintermex por Av. Fundidora.',
      },
    ],
    stops: [
      {
        id: 'stop-56-1',
        sequenceNumber: 1,
        destinationName: 'Cintermex - Sala C',
        zoneName: 'Parque Fundidora / Obrera',
        address: 'Av. Fundidora #501, Col. Obrera, Monterrey, N.L.',
        coordinates: { x: 520, y: 180 },
        totalUnits: 8,
        remisionFolio: 'REM-2026-0098',
        sourceDocumentFolio: 'EXPO-2026-0008',
        customerType: 'Exposición Externa',
        contactName: 'Lic. Sofía Garza',
        timeWindow: '14:00 - 15:30 h',
        priority: 'Urgente',
        items: [],
      },
    ],
  },
];

export type StopDeliveryStatus = 
  | 'Pendiente' 
  | 'Próxima' 
  | 'En atención' 
  | 'Completada' 
  | 'Con incidencia';

export interface ArrivalRecord {
  registeredAt: string; // ej. '28 Ago 2026 · 14:42'
  coordinates: {
    lat: number;
    lng: number;
    label: string; // ej. '25.6573, -100.3668 (San Pedro Garza García)'
  };
  driverName: string;
  routeFolio: string;
  isSimulatedGps: boolean;
}

export interface ActiveRouteStop extends RouteStop {
  status: StopDeliveryStatus;
  completedAt?: string;
  statusNotes?: string;
  arrivalRecord?: ArrivalRecord;
}

export interface ActiveShippingRoute {
  id: string;
  folio: string; // ej. 'RT-2026-0031'
  type: ShippingOrderType; // 'Venta' | 'Traspaso'
  outboundOrderFolio: string; // ej. 'OS-2026-0048'
  outboundOrderId: string;
  sourceDocumentFolio: string; // ej. 'PED-2026-0103' o 'OTP-2026-0044'
  sourceDocumentType: 'Pedido' | 'OTP' | 'Exposición';
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  originWarehouseId: string;
  originWarehouseName: string;
  originCoordinates: { x: number; y: number; name: string };
  departureTime: string; // ej. '08:30' o '14:20'
  departureDate: string; // ej. '28 Ago 2026'
  estimatedDurationMinutes: number;
  estimatedRemainingMinutes?: number;
  trafficStatusText?: string; // ej. 'En tiempo' | 'Retraso estimado: 12 min'
  totalDistanceKm: number;
  totalUnits: number;
  remisionesFolios: string[];
  stops: ActiveRouteStop[];
  loadingZones: LoadingZone[];
  status: 'En ruta' | 'Completada' | 'Con incidencia';
  currentStopIndex: number;
  selectedStrategy: RouteStrategyType;
}

export const INITIAL_MOCK_ACTIVE_ROUTES: ActiveShippingRoute[] = [
  // =========================================================================
  // 1. RUTA VENTA MULTI-PARADA (3 Paradas · 0/3 · San Pedro, Valle Ote, Sur)
  // =========================================================================
  {
    id: 'rt-2026-0031',
    folio: 'RT-2026-0031',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0048',
    outboundOrderId: 'sh-ord-1',
    sourceDocumentFolio: 'PED-2026-0103',
    sourceDocumentType: 'Pedido',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    departureTime: '08:30',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 97, // 1h 37min
    totalDistanceKm: 43.8,
    totalUnits: 14,
    remisionesFolios: ['REM-2026-0061', 'REM-2026-0063', 'REM-2026-0064'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'RECOMMENDED',
    loadingZones: [
      {
        id: 'lz-48-3',
        zoneCode: 'ZONA A',
        zonePosition: 'Fondo',
        loadingOrderNumber: 1,
        stopId: 'stop-48-3',
        stopSequenceNumber: 3,
        destinationName: 'Grupo Hotelero Sierra Madre S.A.',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        remisionFolio: 'REM-2026-0064',
        totalUnits: 7,
        items: [],
        uids: ['CJ-RTM-2026-000241', 'CJ-RTM-2026-000242', 'CJ-RTM-2026-000243', 'CJ-RTM-2026-000244', 'CJ-RTM-2026-000245', 'CJ-RTM-2026-000246', 'CJ-RTM-2026-000247'],
        colorAccent: 'indigo',
      },
      {
        id: 'lz-48-2',
        zoneCode: 'ZONA B',
        zonePosition: 'Intermedio',
        loadingOrderNumber: 2,
        stopId: 'stop-48-2',
        stopSequenceNumber: 2,
        destinationName: 'Hotel Boutique Las Lomas',
        zoneName: 'Valle Oriente',
        address: 'Av. Frida Kahlo 195, Valle Oriente, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-2026-0063',
        totalUnits: 3,
        items: [],
        uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000103'],
        colorAccent: 'amber',
      },
      {
        id: 'lz-48-1',
        zoneCode: 'ZONA C',
        zonePosition: 'Puertas',
        loadingOrderNumber: 3,
        stopId: 'stop-48-1',
        stopSequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Roble 600, Col. Valle del Campestre, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-2026-0061',
        totalUnits: 4,
        items: [],
        uids: ['CJ-RTM-2026-000131', 'CJ-RTM-2026-000132', 'CJ-RTM-2026-000133', 'CJ-RTM-2026-000134'],
        colorAccent: 'rose',
      },
    ],
    stops: [
      {
        id: 'stop-48-1',
        sequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Roble 600, Col. Valle del Campestre, San Pedro Garza García, N.L.',
        coordinates: { x: 330, y: 310 },
        totalUnits: 4,
        remisionFolio: 'REM-2026-0061',
        sourceDocumentFolio: 'PED-2026-0103',
        customerType: 'Persona física',
        contactName: 'Lic. Roberto Cantú',
        timeWindow: '09:00 - 10:30 h',
        priority: 'Normal',
        status: 'Próxima',
        statusNotes: 'Unidad en trayecto por Gonzalitos hacia punto de entrega.',
        items: [
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 4,
            uids: ['CJ-RTM-2026-000131', 'CJ-RTM-2026-000132', 'CJ-RTM-2026-000133', 'CJ-RTM-2026-000134'],
          },
        ],
      },
      {
        id: 'stop-48-2',
        sequenceNumber: 2,
        destinationName: 'Hotel Boutique Las Lomas',
        zoneName: 'Valle Oriente',
        address: 'Av. Frida Kahlo 195, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0063',
        sourceDocumentFolio: 'PED-2026-0107',
        customerType: 'Hotel / Corporativo',
        contactName: 'Ing. Fernando Morales (Compras)',
        timeWindow: '10:30 - 12:00 h',
        priority: 'Urgente',
        status: 'Pendiente',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 3,
            uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000103'],
          },
        ],
      },
      {
        id: 'stop-48-3',
        sequenceNumber: 3,
        destinationName: 'Grupo Hotelero Sierra Madre S.A.',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        coordinates: { x: 500, y: 350 },
        totalUnits: 7,
        remisionFolio: 'REM-2026-0064',
        sourceDocumentFolio: 'PED-2026-0180',
        customerType: 'Cadena Hotelera',
        contactName: 'Lic. Marcela Lozano',
        timeWindow: '12:00 - 13:30 h',
        priority: 'Alta',
        status: 'Pendiente',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 7,
            uids: ['CJ-RTM-2026-000241', 'CJ-RTM-2026-000242', 'CJ-RTM-2026-000243', 'CJ-RTM-2026-000244', 'CJ-RTM-2026-000245', 'CJ-RTM-2026-000246', 'CJ-RTM-2026-000247'],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. RUTA VENTA MULTI-PARADA (4 Paradas · 2/4 Completadas · En Atención)
  // =========================================================================
  {
    id: 'rt-2026-0033',
    folio: 'RT-2026-0033',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0055',
    outboundOrderId: 'sh-ord-55',
    sourceDocumentFolio: 'PED-2026-0120',
    sourceDocumentType: 'Pedido',
    vehicleId: 'veh-12',
    vehicleName: 'Camión #12 · Hino 300',
    driverId: 'drv-3',
    driverName: 'Luis Herrera',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    departureTime: '09:15',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 105, // 1h 45min
    totalDistanceKm: 48.2,
    totalUnits: 9,
    remisionesFolios: ['REM-2026-0071', 'REM-2026-0072', 'REM-2026-0073', 'REM-2026-0074'],
    status: 'En ruta',
    currentStopIndex: 2,
    selectedStrategy: 'RECOMMENDED',
    loadingZones: [
      {
        id: 'lz-55-4',
        zoneCode: 'ZONA A',
        zonePosition: 'Fondo',
        loadingOrderNumber: 1,
        stopId: 'stop-55-4',
        stopSequenceNumber: 4,
        destinationName: 'Residencial Las Lajas S.A.',
        zoneName: 'Cumbres 6to Sector',
        address: 'Paseo de los Leones 4500, Cumbres, Monterrey, N.L.',
        remisionFolio: 'REM-2026-0074',
        totalUnits: 2,
        items: [],
        uids: ['CJ-RTM-2026-000321', 'CJ-RTM-2026-000322'],
      },
      {
        id: 'lz-55-3',
        zoneCode: 'ZONA B',
        zonePosition: 'Intermedio',
        loadingOrderNumber: 2,
        stopId: 'stop-55-3',
        stopSequenceNumber: 3,
        destinationName: 'Arquitectura & Hábitat Monterrey',
        zoneName: 'Cumbres 4to Sector',
        address: 'Av. Paseo de los Conquistadores 800, Cumbres, N.L.',
        remisionFolio: 'REM-2026-0073',
        totalUnits: 2,
        items: [],
        uids: ['CJ-RTM-2026-000319', 'CJ-RTM-2026-000320'],
      },
      {
        id: 'lz-55-2',
        zoneCode: 'ZONA C',
        zonePosition: 'Intermedio',
        loadingOrderNumber: 3,
        stopId: 'stop-55-2',
        stopSequenceNumber: 2,
        destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
        zoneName: 'Santa Catarina Poniente',
        address: 'Av. Manuel Ordóñez 720, Santa Catarina, N.L.',
        remisionFolio: 'REM-2026-0072',
        totalUnits: 2,
        items: [],
        uids: ['CJ-RTM-2026-000317', 'CJ-RTM-2026-000318'],
      },
      {
        id: 'lz-55-1',
        zoneCode: 'ZONA D',
        zonePosition: 'Puertas',
        loadingOrderNumber: 4,
        stopId: 'stop-55-1',
        stopSequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1500, Monterrey, N.L.',
        remisionFolio: 'REM-2026-0071',
        totalUnits: 3,
        items: [],
        uids: ['CJ-RTM-2026-000314', 'CJ-RTM-2026-000315', 'CJ-RTM-2026-000316'],
      },
    ],
    stops: [
      {
        id: 'stop-55-1',
        sequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1500, Monterrey, N.L.',
        coordinates: { x: 220, y: 195 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0071',
        sourceDocumentFolio: 'PED-2026-0120',
        customerType: 'Desarrolladora',
        timeWindow: '09:30 - 10:30 h',
        priority: 'Normal',
        status: 'Completada',
        completedAt: '10:05',
        statusNotes: 'Entrega recibida por Ing. Rogelio Garza con firma en remisión.',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Individual',
            brand: 'RTM Packaging',
            size: 'Individual',
            quantity: 3,
            uids: ['CJ-RTM-2026-000314', 'CJ-RTM-2026-000315', 'CJ-RTM-2026-000316'],
          },
        ],
      },
      {
        id: 'stop-55-2',
        sequenceNumber: 2,
        destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
        zoneName: 'Santa Catarina Poniente',
        address: 'Av. Manuel Ordóñez 720, Santa Catarina, N.L.',
        coordinates: { x: 110, y: 310 },
        totalUnits: 2,
        remisionFolio: 'REM-2026-0072',
        sourceDocumentFolio: 'PED-2026-0122',
        customerType: 'Empresa',
        timeWindow: '10:30 - 11:30 h',
        priority: 'Normal',
        status: 'Completada',
        completedAt: '11:10',
        statusNotes: 'Entrega finalizada en caseta de obra.',
        items: [
          {
            sku: 'ETQ-FAR-VIL',
            productName: 'RTM Packaging Colchón Flow Basic White Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000317', 'CJ-RTM-2026-000318'],
          },
        ],
      },
      {
        id: 'stop-55-3',
        sequenceNumber: 3,
        destinationName: 'Arquitectura & Hábitat Monterrey',
        zoneName: 'Cumbres 4to Sector',
        address: 'Av. Paseo de los Conquistadores 800, Cumbres, N.L.',
        coordinates: { x: 170, y: 190 },
        totalUnits: 2,
        remisionFolio: 'REM-2026-0073',
        sourceDocumentFolio: 'PED-2026-0125',
        customerType: 'Desarrolladora',
        timeWindow: '11:30 - 12:30 h',
        priority: 'Alta',
        status: 'En atención',
        statusNotes: 'Unidad descargando paquetes / tarimas en departamento muestra.',
        items: [
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000319', 'CJ-RTM-2026-000320'],
          },
        ],
      },
      {
        id: 'stop-55-4',
        sequenceNumber: 4,
        destinationName: 'Residencial Las Lajas S.A.',
        zoneName: 'Cumbres 6to Sector',
        address: 'Paseo de los Leones 4500, Cumbres, Monterrey, N.L.',
        coordinates: { x: 140, y: 170 },
        totalUnits: 2,
        remisionFolio: 'REM-2026-0074',
        sourceDocumentFolio: 'PED-2026-0128',
        customerType: 'Desarrolladora',
        timeWindow: '12:30 - 13:30 h',
        priority: 'Normal',
        status: 'Pendiente',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 2,
            uids: ['CJ-RTM-2026-000321', 'CJ-RTM-2026-000322'],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. RUTA TRASPASO DIRECTO (1 Parada · 0/1 Completada · En Tránsito)
  // =========================================================================
  {
    id: 'rt-2026-0032',
    folio: 'RT-2026-0032',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0049',
    outboundOrderId: 'sh-ord-3',
    sourceDocumentFolio: 'OTP-2026-0044',
    sourceDocumentType: 'OTP',
    vehicleId: 'veh-04',
    vehicleName: 'Unidad #04 · Nissan Cabstar',
    driverId: 'drv-2',
    driverName: 'Carlos Medina',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    departureTime: '09:00',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 42,
    totalDistanceKm: 24.8,
    totalUnits: 14,
    remisionesFolios: ['REM-TR-2026-0021'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'DIRECT',
    loadingZones: [
      {
        id: 'lz-49-1',
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: 'stop-49-1',
        stopSequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-TR-2026-0021',
        totalUnits: 14,
        items: [],
        uids: ['CJ-RTM-2026-000151', 'CJ-RTM-2026-000152', 'CJ-RTM-2026-000153', 'CJ-RTM-2026-000154', 'CJ-RTM-2026-000101', 'CJ-RTM-2026-000102', 'CJ-RTM-2026-000107', 'CJ-RTM-2026-000108', 'CJ-RTM-2026-000109', 'CJ-RTM-2026-000110', 'CJ-RTM-2026-000211', 'CJ-RTM-2026-000212', 'CJ-RTM-2026-000213', 'CJ-RTM-2026-000214'],
      },
    ],
    stops: [
      {
        id: 'stop-49-1',
        sequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 14,
        remisionFolio: 'REM-TR-2026-0021',
        sourceDocumentFolio: 'OTP-2026-0044',
        customerType: 'Instalación Operativa',
        contactName: 'Brenda Cavazos (Encargada VO)',
        timeWindow: '09:00 - 11:00 h',
        priority: 'Alta',
        status: 'Próxima',
        statusNotes: 'En trayecto inter-instalaciones vía Morones Prieto.',
        items: [],
      },
    ],
  },

  // =========================================================================
  // 4. RUTA TRASPASO ENTREGADO FÍSICAMENTE (1 Parada · 1/1 pero Pendiente Recepción)
  // =========================================================================
  {
    id: 'rt-2026-0034',
    folio: 'RT-2026-0034',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0051',
    outboundOrderId: 'sh-ord-4',
    sourceDocumentFolio: 'OTP-2026-0047',
    sourceDocumentType: 'OTP',
    vehicleId: 'veh-05',
    vehicleName: 'Camión #05 · Isuzu Forward',
    driverId: 'drv-5',
    driverName: 'Raúl Morales',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    departureTime: '10:30',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 48,
    totalDistanceKm: 26.2,
    totalUnits: 9,
    remisionesFolios: ['REM-TR-2026-0022'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'DIRECT',
    loadingZones: [
      {
        id: 'lz-51-1',
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: 'stop-51-1',
        stopSequenceNumber: 1,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        remisionFolio: 'REM-TR-2026-0022',
        totalUnits: 9,
        items: [],
        uids: ['CJ-RTM-2026-000135', 'CJ-RTM-2026-000136', 'CJ-RTM-2026-000215', 'CJ-RTM-2026-000216', 'CJ-RTM-2026-000217', 'CJ-RTM-2026-000301', 'CJ-RTM-2026-000302', 'CJ-RTM-2026-000303', 'CJ-RTM-2026-000304'],
      },
    ],
    stops: [
      {
        id: 'stop-51-1',
        sequenceNumber: 1,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        coordinates: { x: 170, y: 190 },
        totalUnits: 9,
        remisionFolio: 'REM-TR-2026-0022',
        sourceDocumentFolio: 'OTP-2026-0047',
        customerType: 'Instalación Operativa',
        contactName: 'Jorge Villarreal (Encargado Cumbres)',
        timeWindow: '10:30 - 12:00 h',
        priority: 'Normal',
        status: 'Completada',
        completedAt: '11:25',
        statusNotes: 'Unidades descargadas físicamente en andén de Cumbres. Pendiente de ingreso/recepción en Mesa de Verificación.',
        arrivalRecord: {
          registeredAt: '28 Ago 2026 · 11:20',
          coordinates: { lat: 25.7145, lng: -100.3872, label: '25.7145, -100.3872 (Delphi Technologies (Parque Villa Florida))' },
          driverName: 'Raúl Morales',
          routeFolio: 'RT-2026-0034',
          isSimulatedGps: true,
        },
        items: [],
      },
    ],
  },

  // =========================================================================
  // 5. RUTA VENTA PARADA ÚNICA (Próxima llegada · En tiempo)
  // =========================================================================
  {
    id: 'rt-2026-0036',
    folio: 'RT-2026-0036',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0052',
    outboundOrderId: 'sh-ord-5',
    sourceDocumentFolio: 'PED-2026-0180',
    sourceDocumentType: 'Pedido',
    vehicleId: 'veh-15',
    vehicleName: 'Unidad #15 · Freightliner M2',
    driverId: 'drv-4',
    driverName: 'Javier Salinas',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    departureTime: '11:00',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 38,
    estimatedRemainingMinutes: 18,
    trafficStatusText: 'En tiempo',
    totalDistanceKm: 22.5,
    totalUnits: 6,
    remisionesFolios: ['REM-2026-0064'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'DIRECT',
    loadingZones: [
      {
        id: 'lz-52-1',
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: 'stop-52-1',
        stopSequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Ricardo Margáin 555, Santa Engracia, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-2026-0064',
        totalUnits: 6,
        items: [],
        uids: ['CJ-RTM-2026-000261', 'CJ-RTM-2026-000262', 'CJ-RTM-2026-000263', 'CJ-RTM-2026-000246', 'CJ-RTM-2026-000247', 'CJ-RTM-2026-000248'],
      },
    ],
    stops: [
      {
        id: 'stop-52-1',
        sequenceNumber: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        zoneName: 'San Pedro Garza García',
        address: 'Av. Ricardo Margáin 555, Santa Engracia, San Pedro Garza García, N.L.',
        coordinates: { x: 330, y: 310 },
        totalUnits: 6,
        remisionFolio: 'REM-2026-0064',
        sourceDocumentFolio: 'PED-2026-0180',
        customerType: 'Desarrolladora',
        contactName: 'Lic. Javier Cantú',
        timeWindow: '11:00 - 12:30 h',
        priority: 'Alta',
        status: 'Próxima',
        statusNotes: 'Unidad circulando por Calzada San Pedro hacia torre residencial.',
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 3,
            uids: ['CJ-RTM-2026-000261', 'CJ-RTM-2026-000262', 'CJ-RTM-2026-000263'],
          },
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 3,
            uids: ['CJ-RTM-2026-000246', 'CJ-RTM-2026-000247', 'CJ-RTM-2026-000248'],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. RUTA VENTA PARADA ÚNICA (Llegada registrada · En atención)
  // =========================================================================
  {
    id: 'rt-2026-0037',
    folio: 'RT-2026-0037',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0054',
    outboundOrderId: 'sh-ord-4b',
    sourceDocumentFolio: 'PED-2026-0186',
    sourceDocumentType: 'Pedido',
    vehicleId: 'veh-04',
    vehicleName: 'Unidad #04 · Nissan Cabstar',
    driverId: 'drv-2',
    driverName: 'Carlos Medina',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    departureTime: '10:00',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 22,
    estimatedRemainingMinutes: 10,
    trafficStatusText: 'En tiempo',
    totalDistanceKm: 12.3,
    totalUnits: 3,
    remisionesFolios: ['REM-2026-0066'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'DIRECT',
    loadingZones: [
      {
        id: 'lz-54-1',
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: 'stop-54-1',
        stopSequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        remisionFolio: 'REM-2026-0066',
        totalUnits: 3,
        items: [],
        uids: ['CJ-RTM-2026-000137', 'CJ-RTM-2026-000138', 'CJ-RTM-2026-000139'],
      },
    ],
    stops: [
      {
        id: 'stop-54-1',
        sequenceNumber: 1,
        destinationName: 'Roberto Cantú Garza',
        zoneName: 'Zona Sur / Contry',
        address: 'Av. Eugenio Garza Sada 3820, Col. Contry, Monterrey, N.L.',
        coordinates: { x: 500, y: 350 },
        totalUnits: 3,
        remisionFolio: 'REM-2026-0066',
        sourceDocumentFolio: 'PED-2026-0186',
        customerType: 'Persona física',
        timeWindow: '10:00 - 11:30 h',
        priority: 'Normal',
        status: 'En atención',
        statusNotes: 'Llegada registrada a las 10:18 h. Chofer en sitio coordinando acceso con cliente.',
        arrivalRecord: {
          registeredAt: '28 Ago 2026 · 10:18',
          coordinates: { lat: 25.6321, lng: -100.2845, label: '25.6321, -100.2845 (Contry Sur)' },
          driverName: 'Carlos Medina',
          routeFolio: 'RT-2026-0037',
          isSimulatedGps: true,
        },
        items: [
          {
            sku: 'FOL-MED-PLE',
            productName: 'RTM Packaging Colchón Record King Size',
            brand: 'RTM Packaging',
            size: 'King Size',
            quantity: 1,
            uids: ['CJ-RTM-2026-000137'],
          },
          {
            sku: 'CJ-EMB-MED',
            productName: 'RTM Packaging Colchón Ortopedic Matrimonial',
            brand: 'RTM Packaging',
            size: 'Matrimonial',
            quantity: 2,
            uids: ['CJ-RTM-2026-000138', 'CJ-RTM-2026-000139'],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 7. RUTA TRASPASO MULTI-SUCURSAL (Llegada pendiente · Retraso leve)
  // =========================================================================
  {
    id: 'rt-2026-0038',
    folio: 'RT-2026-0038',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0056',
    outboundOrderId: 'sh-ord-56',
    sourceDocumentFolio: 'OTP-2026-0050',
    sourceDocumentType: 'OTP',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    departureTime: '11:15',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 65,
    estimatedRemainingMinutes: 45,
    trafficStatusText: 'Retraso estimado: 12 min',
    totalDistanceKm: 34.0,
    totalUnits: 12,
    remisionesFolios: ['REM-TR-2026-0024', 'REM-TR-2026-0025'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'RECOMMENDED',
    loadingZones: [
      {
        id: 'lz-56-2',
        zoneCode: 'ZONA A',
        zonePosition: 'Fondo',
        loadingOrderNumber: 1,
        stopId: 'stop-56-2',
        stopSequenceNumber: 2,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        remisionFolio: 'REM-TR-2026-0025',
        totalUnits: 6,
        items: [],
        uids: ['CJ-RTM-2026-000305', 'CJ-RTM-2026-000306'],
      },
      {
        id: 'lz-56-1',
        zoneCode: 'ZONA B',
        zonePosition: 'Puertas',
        loadingOrderNumber: 2,
        stopId: 'stop-56-1',
        stopSequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-TR-2026-0024',
        totalUnits: 6,
        items: [],
        uids: ['CJ-RTM-2026-000307', 'CJ-RTM-2026-000308'],
      },
    ],
    stops: [
      {
        id: 'stop-56-1',
        sequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 6,
        remisionFolio: 'REM-TR-2026-0024',
        sourceDocumentFolio: 'OTP-2026-0050',
        customerType: 'Instalación Operativa',
        contactName: 'Brenda Cavazos',
        timeWindow: '11:30 - 12:30 h',
        priority: 'Alta',
        status: 'Próxima',
        statusNotes: 'En ruta por Av. Eugenio Garza Sada; tráfico pesado en entronque con Morones Prieto.',
        items: [],
      },
      {
        id: 'stop-56-2',
        sequenceNumber: 2,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        zoneName: 'Cumbres 1er Sector',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        coordinates: { x: 170, y: 190 },
        totalUnits: 6,
        remisionFolio: 'REM-TR-2026-0025',
        sourceDocumentFolio: 'OTP-2026-0051',
        customerType: 'Instalación Operativa',
        contactName: 'Jorge Villarreal',
        timeWindow: '12:45 - 13:45 h',
        priority: 'Normal',
        status: 'Pendiente',
        items: [],
      },
    ],
  },

  // =========================================================================
  // 8. RUTA TRASPASO DIRECTO (Llegada registrada en andén · En atención)
  // =========================================================================
  {
    id: 'rt-2026-0039',
    folio: 'RT-2026-0039',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0057',
    outboundOrderId: 'sh-ord-57',
    sourceDocumentFolio: 'OTP-2026-0052',
    sourceDocumentType: 'OTP',
    vehicleId: 'veh-15',
    vehicleName: 'Unidad #15 · Freightliner M2',
    driverId: 'drv-4',
    driverName: 'Javier Salinas',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    departureTime: '12:00',
    departureDate: '28 Ago 2026',
    estimatedDurationMinutes: 40,
    estimatedRemainingMinutes: 5,
    trafficStatusText: 'En tiempo',
    totalDistanceKm: 25.0,
    totalUnits: 10,
    remisionesFolios: ['REM-TR-2026-0026'],
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: 'DIRECT',
    loadingZones: [
      {
        id: 'lz-57-1',
        zoneCode: 'ZONA ÚNICA',
        zonePosition: 'Caja completa',
        loadingOrderNumber: 1,
        stopId: 'stop-57-1',
        stopSequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        remisionFolio: 'REM-TR-2026-0026',
        totalUnits: 10,
        items: [],
        uids: ['CJ-RTM-2026-000351', 'CJ-RTM-2026-000352'],
      },
    ],
    stops: [
      {
        id: 'stop-57-1',
        sequenceNumber: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        zoneName: 'Valle Oriente / San Pedro',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        coordinates: { x: 440, y: 340 },
        totalUnits: 10,
        remisionFolio: 'REM-TR-2026-0026',
        sourceDocumentFolio: 'OTP-2026-0052',
        customerType: 'Instalación Operativa',
        contactName: 'Brenda Cavazos',
        timeWindow: '12:00 - 13:00 h',
        priority: 'Alta',
        status: 'En atención',
        statusNotes: 'Llegada registrada a las 12:40 h en andén de descarga de Valle Oriente.',
        arrivalRecord: {
          registeredAt: '28 Ago 2026 · 12:40',
          coordinates: { lat: 25.6480, lng: -100.3270, label: '25.6480, -100.3270 (Laboratorios Medifarma (Parque Industrial))' },
          driverName: 'Javier Salinas',
          routeFolio: 'RT-2026-0039',
          isSimulatedGps: true,
        },
        items: [],
      },
    ],
  },
];

let shippingOrdersStore: ShippingOutboundOrder[] = [...INITIAL_MOCK_SHIPPING_ORDERS];
let activeRoutesStore: ActiveShippingRoute[] = [...INITIAL_MOCK_ACTIVE_ROUTES];

export function getShippingOrdersList(): ShippingOutboundOrder[] {
  return shippingOrdersStore;
}

export function getActiveRoutesList(): ActiveShippingRoute[] {
  return activeRoutesStore;
}

export function assignTransportToOrder(
  orderId: string,
  vehicleId: string,
  driverId: string,
  plannedDate: string,
  plannedTime: string,
  notes?: string
): ShippingOutboundOrder | undefined {
  const order = shippingOrdersStore.find((o) => o.id === orderId);
  const vehicle = MOCK_SHIPPING_VEHICLES.find((v) => v.id === vehicleId);
  const driver = MOCK_SHIPPING_DRIVERS.find((d) => d.id === driverId);

  if (order && vehicle && driver) {
    order.assignedVehicleId = vehicle.id;
    order.assignedVehicleName = vehicle.name;
    order.assignedDriverId = driver.id;
    order.assignedDriverName = driver.name;
    order.plannedDate = plannedDate;
    order.plannedTime = plannedTime;
    if (notes) order.notes = notes;
    if (order.status === 'Lista para carga') {
      order.status = 'Transporte asignado';
    }
  }

  return order;
}

export function updateOrderRouteStrategy(
  orderId: string,
  strategy: RouteStrategyType,
  customStops?: RouteStop[]
): ShippingOutboundOrder | undefined {
  const order = shippingOrdersStore.find((o) => o.id === orderId);
  if (!order) return undefined;

  order.selectedStrategy = strategy;
  if (customStops) {
    order.stops = customStops;
  }
  return order;
}

let routeSequenceCounter = 35;

export function confirmOrderLoadAndStartRoute(
  order: ShippingOutboundOrder,
  loadingZones: LoadingZone[],
  selectedStrategy: RouteStrategyType,
  departureTime?: string,
  departureDate?: string
): ActiveShippingRoute {
  // Update order in store
  const storedOrder = shippingOrdersStore.find((o) => o.id === order.id);
  if (storedOrder) {
    storedOrder.status = 'En ruta';
  } else {
    order.status = 'En ruta';
    shippingOrdersStore.push(order);
  }

  routeSequenceCounter += 1;
  const newFolio = `RT-2026-00${routeSequenceCounter}`;

  // Find active alternative metrics
  const activeAlt = order.routeAlternatives.find((a) => a.strategy === selectedStrategy) || order.routeAlternatives[0];

  const activeStops: ActiveRouteStop[] = order.stops.map((stop, idx) => ({
    ...stop,
    status: idx === 0 ? 'Próxima' : 'Pendiente',
    statusNotes: idx === 0 ? 'Primer destino en ruta tras salida de CEDIS.' : undefined,
  }));

  const remisionesList = Array.from(new Set(order.stops.map((s) => s.remisionFolio || order.remisionFolio)));

  const newRoute: ActiveShippingRoute = {
    id: `rt-dyn-${Date.now()}`,
    folio: newFolio,
    type: order.type,
    outboundOrderFolio: order.folio,
    outboundOrderId: order.id,
    sourceDocumentFolio: order.sourceDocumentFolio,
    sourceDocumentType: order.sourceDocumentType,
    vehicleId: order.assignedVehicleId || 'veh-08',
    vehicleName: order.assignedVehicleName || 'Camión #08 · Isuzu NPR',
    driverId: order.assignedDriverId || 'drv-1',
    driverName: order.assignedDriverName || 'Roberto Garza',
    originWarehouseId: order.originWarehouseId,
    originWarehouseName: order.originWarehouseName,
    originCoordinates: order.originCoordinates || { x: 260, y: 70, name: order.originWarehouseName },
    departureTime: departureTime || order.plannedTime || '14:20',
    departureDate: departureDate || order.plannedDate || '28 Ago 2026',
    estimatedDurationMinutes: activeAlt?.estimatedTimeMinutes || 90,
    totalDistanceKm: activeAlt?.distanceKm || 40,
    totalUnits: order.totalUnits,
    remisionesFolios: remisionesList,
    stops: activeStops,
    loadingZones: loadingZones,
    status: 'En ruta',
    currentStopIndex: 0,
    selectedStrategy: selectedStrategy,
  };

  activeRoutesStore = [newRoute, ...activeRoutesStore];

  return newRoute;
}

export function confirmStopArrival(
  routeId: string,
  stopId: string,
  arrivalCoordinates?: { lat: number; lng: number }
): { route: ActiveShippingRoute; stop: ActiveRouteStop } | undefined {
  const route = activeRoutesStore.find((r) => r.id === routeId || r.folio === routeId);
  if (!route) return undefined;

  const stop = route.stops.find((s) => s.id === stopId);
  if (!stop) return undefined;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `28 Ago 2026 · ${timeStr}`;

  const coords = arrivalCoordinates || {
    lat: stop.coordinates.lat || 25.6573,
    lng: stop.coordinates.lng || -100.3668,
  };

  stop.status = 'En atención';
  stop.arrivalRecord = {
    registeredAt: dateStr,
    coordinates: {
      lat: coords.lat,
      lng: coords.lng,
      label: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
    },
    driverName: route.driverName,
    routeFolio: route.folio,
    isSimulatedGps: true,
  };
  stop.statusNotes = `Llegada registrada a las ${timeStr} h. Ubicación capturada.`;

  return { route, stop };
}

export interface StopDeliveryPayload {
  routeId: string;
  stopId: string;
  recipientName: string;
  observations?: string;
  acceptedTerms: boolean;
  validatedUids: string[];
  missingUids?: string[];
  incident?: {
    type: string;
    notes: string;
  };
}

export function confirmStopDelivery(payload: StopDeliveryPayload): {
  route: ActiveShippingRoute;
  stop: ActiveRouteStop;
  remision?: OutboundRemision;
} | undefined {
  const route = activeRoutesStore.find((r) => r.id === payload.routeId || r.folio === payload.routeId);
  if (!route) return undefined;

  const stop = route.stops.find((s) => s.id === payload.stopId);
  if (!stop) return undefined;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = `28 Ago 2026 · ${timeStr}`;

  const isPartial = (payload.missingUids && payload.missingUids.length > 0) || payload.validatedUids.length < stop.totalUnits;
  const isIncident = Boolean(payload.incident);

  const resultType: 'Entrega completa' | 'Entrega parcial' | 'Con incidencia' = isIncident 
    ? 'Con incidencia'
    : isPartial 
    ? 'Entrega parcial' 
    : 'Entrega completa';

  stop.status = 'Completada';
  stop.completedAt = timeStr;
  
  if (route.type === 'Venta') {
    stop.statusNotes = isPartial 
      ? `Entrega parcial confirmada (${payload.validatedUids.length}/${stop.totalUnits} u.). Recibió: ${payload.recipientName}.`
      : `Entrega completa confirmada. Recibió de conformidad: ${payload.recipientName}.`;
  } else {
    stop.statusNotes = `Entregado físicamente en destino. Pendiente de recepción en Mesa de Verificación.`;
  }

  // Update remision
  const defaultCoords = stop.arrivalRecord?.coordinates || {
    lat: stop.coordinates.lat || 25.6573,
    lng: stop.coordinates.lng || -100.3668,
    label: `${(stop.coordinates.lat || 25.6573).toFixed(4)}, ${(stop.coordinates.lng || -100.3668).toFixed(4)} (${stop.zoneName})`
  };

  const deliveryProof: DeliveryProof = {
    deliveredAt: dateStr,
    recipientName: payload.recipientName,
    driverName: route.driverName,
    vehicleName: route.vehicleName,
    coordinates: {
      lat: defaultCoords.lat,
      lng: defaultCoords.lng,
      label: defaultCoords.label || `${defaultCoords.lat.toFixed(4)}, ${defaultCoords.lng.toFixed(4)}`,
    },
    result: resultType,
    validatedUidsCount: payload.validatedUids.length,
    expectedUnitsCount: stop.totalUnits,
    observations: payload.observations,
    signaturePlaceholder: 'Firma de recibido registrada en remisión',
    incidentType: payload.incident?.type,
    incidentNotes: payload.incident?.notes,
  };

  const updatedRemision = markRemisionAsDelivered(stop.remisionFolio, deliveryProof);

  // Advance route to next stop if any
  const currentStopIndex = route.stops.findIndex((s) => s.id === stop.id);
  const nextPendingStop = route.stops.slice(currentStopIndex + 1).find((s) => s.status === 'Pendiente');
  if (nextPendingStop) {
    nextPendingStop.status = 'Próxima';
    nextPendingStop.statusNotes = 'Próximo destino en ruta tras entrega anterior.';
  }

  const allStopsCompleted = route.stops.every((s) => s.status === 'Completada');
  if (allStopsCompleted) {
    route.status = 'Completada';
  }

  return { route, stop, remision: updatedRemision };
}

// ===========================================================================
// SECCIÓN DE HISTORIAL DE EMBARQUES & ENTREGAS
// ===========================================================================

export type ShippingHistoryResult = 
  | 'Entrega completa' 
  | 'Entrega parcial' 
  | 'Con incidencia' 
  | 'Entregado físicamente en destino'
  | 'Recepción confirmada en sucursal'
  | 'Cancelada';

export interface TimelineTraceEvent {
  stepName: string;
  timestamp: string;
  responsibleUser: string;
  referenceFolio?: string;
  notes?: string;
}

export interface ShippingHistoryStopDetail {
  stopSequence: number;
  destinationName: string;
  customerType: string;
  address: string;
  zoneName: string;
  remisionFolio: string;
  sourceDocumentFolio: string;
  totalUnits: number;
  validatedUnits: number;
  result: ShippingHistoryResult;
  arrivalDateTime: string;
  deliveryDateTime: string;
  coordinates: {
    lat: number;
    lng: number;
    label: string;
  };
  recipientName: string;
  incidentType?: string;
  incidentNotes?: string;
  items: ShippingOrderItem[];
  branchReceiptConfirmed?: boolean;
  branchReceiptDateTime?: string;
  branchReceiptOperator?: string;
}

export interface ShippingHistoryRecord {
  id: string;
  routeFolio: string;
  type: ShippingOrderType;
  outboundOrderFolio: string;
  sourceDocumentFolio: string;
  sourceDocumentType: 'Pedido' | 'OTP' | 'Exposición';
  destinationSummary: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  originWarehouseId: string;
  originWarehouseName: string;
  originCoordinates: { x: number; y: number; name: string };
  stopsCount: number;
  totalUnits: number;
  result: ShippingHistoryResult;
  status: 'Completada' | 'Con incidencia' | 'Cancelada';
  departureDateTime: string;
  closingDateTime: string;
  estimatedDistanceKm: number;
  estimatedTimeText: string;
  realTimeText: string;
  remisionesFolios: string[];
  stops: ShippingHistoryStopDetail[];
  timeline: TimelineTraceEvent[];
  cancelReason?: string;
}

export const INITIAL_MOCK_SHIPPING_HISTORY: ShippingHistoryRecord[] = [
  // =========================================================================
  // 1. VENTA MULTI-PARADA COMPLETA (3 Paradas · 14 u. · Roberto Garza)
  // =========================================================================
  {
    id: 'hist-rt-0025',
    routeFolio: 'RT-2026-0025',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0041',
    sourceDocumentFolio: 'PED-2026-0098',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Roberto Cantú Garza + 2 destinos',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 3,
    totalUnits: 14,
    result: 'Entrega completa',
    status: 'Completada',
    departureDateTime: '27 Ago 2026 · 14:20',
    closingDateTime: '27 Ago 2026 · 17:08',
    estimatedDistanceKm: 43.8,
    estimatedTimeText: '1 h 37 min',
    realTimeText: '1 h 48 min',
    remisionesFolios: ['REM-2026-0061', 'REM-2026-0063', 'REM-2026-0064'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Roberto Cantú Garza',
        customerType: 'Persona física',
        address: 'Av. Roble 600, Col. Valle del Campestre, San Pedro Garza García, N.L.',
        zoneName: 'San Pedro Garza García',
        remisionFolio: 'REM-2026-0061',
        sourceDocumentFolio: 'PED-2026-0098',
        totalUnits: 4,
        validatedUnits: 4,
        result: 'Entrega completa',
        arrivalDateTime: '27 Ago 2026 · 14:42',
        deliveryDateTime: '27 Ago 2026 · 14:48',
        coordinates: { lat: 25.6573, lng: -100.3668, label: '25.6573, -100.3668 (San Pedro Garza García)' },
        recipientName: 'Roberto Cantú Garza',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 2, uids: ['CJ-RTM-2026-000101', 'CJ-RTM-2026-000102'] },
          { sku: 'CJ-EMB-MED', productName: 'RTM Packaging Colchón Ortopedic Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 2, uids: ['CJ-RTM-2026-000107', 'CJ-RTM-2026-000108'] },
        ],
      },
      {
        stopSequence: 2,
        destinationName: 'Hotel Boutique Las Lomas',
        customerType: 'Corporativo Hotelero',
        address: 'Av. Lázaro Cárdenas 2225, Valle Oriente, San Pedro Garza García, N.L.',
        zoneName: 'Valle Oriente',
        remisionFolio: 'REM-2026-0063',
        sourceDocumentFolio: 'PED-2026-0098',
        totalUnits: 3,
        validatedUnits: 3,
        result: 'Entrega completa',
        arrivalDateTime: '27 Ago 2026 · 15:30',
        deliveryDateTime: '27 Ago 2026 · 15:40',
        coordinates: { lat: 25.6482, lng: -100.3275, label: '25.6482, -100.3275 (Valle Oriente)' },
        recipientName: 'Ing. Fernando Lozano (Recepción Hotel)',
        items: [
          { sku: 'SC-SEA-POST-QS', productName: 'RTM Packaging Colchón Posturepedic Queen Size', brand: 'RTM Packaging', size: 'Queen Size', quantity: 3, uids: ['CJ-RTM-2026-000109', 'CJ-RTM-2026-000110', 'CJ-RTM-2026-000111'] },
        ],
      },
      {
        stopSequence: 3,
        destinationName: 'Grupo Hotelero Sierra Madre',
        customerType: 'Corporativo',
        address: 'Av. Eugenio Garza Sada 4500, Col. Las Brisas, Monterrey, N.L.',
        zoneName: 'Zona Sur / Las Brisas',
        remisionFolio: 'REM-2026-0064',
        sourceDocumentFolio: 'PED-2026-0098',
        totalUnits: 7,
        validatedUnits: 7,
        result: 'Entrega completa',
        arrivalDateTime: '27 Ago 2026 · 16:35',
        deliveryDateTime: '27 Ago 2026 · 16:55',
        coordinates: { lat: 25.6210, lng: -100.2830, label: '25.6210, -100.2830 (Zona Sur)' },
        recipientName: 'Lic. Mónica Treviño (Compras GH)',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 4, uids: ['CJ-RTM-2026-000112', 'CJ-RTM-2026-000113', 'CJ-RTM-2026-000114', 'CJ-RTM-2026-000115'] },
          { sku: 'SC-AMER-CONF-IND', productName: 'America Colchón Confort Individual', brand: 'America', size: 'Individual', quantity: 3, uids: ['CJ-RTM-2026-000116', 'CJ-RTM-2026-000117', 'CJ-RTM-2026-000118'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Pedido comercial confirmado', timestamp: '27 Ago 2026 · 09:30', responsibleUser: 'Claudia Morales (Ventas)', referenceFolio: 'PED-2026-0098' },
      { stepName: 'Remisiones oficiales generadas', timestamp: '27 Ago 2026 · 11:15', responsibleUser: 'Sistema de Remisiones', referenceFolio: 'REM-2026-0061' },
      { stepName: 'Verificación de salida validada 100%', timestamp: '27 Ago 2026 · 12:45', responsibleUser: 'Valeria Torres (Mesa 02)', referenceFolio: 'OS-2026-0041' },
      { stepName: 'Carga secuenciada en camión', timestamp: '27 Ago 2026 · 13:50', responsibleUser: 'Estiba CEDIS Norte', referenceFolio: 'Camión #08' },
      { stepName: 'Ruta iniciada en tránsito', timestamp: '27 Ago 2026 · 14:20', responsibleUser: 'Roberto Garza (Chofer)', referenceFolio: 'RT-2026-0025' },
      { stepName: 'Parada 1: Arribo y entrega confirmada', timestamp: '27 Ago 2026 · 14:48', responsibleUser: 'Roberto Garza (Chofer)', referenceFolio: 'REM-2026-0061', notes: 'Recibió de conformidad Roberto Cantú Garza.' },
      { stepName: 'Parada 2: Arribo y entrega confirmada', timestamp: '27 Ago 2026 · 15:40', responsibleUser: 'Roberto Garza (Chofer)', referenceFolio: 'REM-2026-0063', notes: 'Recibió Ing. Fernando Lozano.' },
      { stepName: 'Parada 3: Arribo y entrega confirmada', timestamp: '27 Ago 2026 · 16:55', responsibleUser: 'Roberto Garza (Chofer)', referenceFolio: 'REM-2026-0064', notes: 'Recibió Lic. Mónica Treviño.' },
      { stepName: 'Cierre oficial de ruta de despacho', timestamp: '27 Ago 2026 · 17:08', responsibleUser: 'Roberto Garza (Chofer)', referenceFolio: 'RT-2026-0025', notes: '100% de piezas entregadas de conformidad.' },
    ],
  },

  // =========================================================================
  // 2. VENTA PARADA ÚNICA COMPLETA (6 u. · Javier Salinas)
  // =========================================================================
  {
    id: 'hist-rt-0028',
    routeFolio: 'RT-2026-0028',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0044',
    sourceDocumentFolio: 'PED-2026-0100',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Desarrollos Residenciales del Norte S.A.',
    vehicleId: 'veh-15',
    vehicleName: 'Unidad #15 · Freightliner M2',
    driverId: 'drv-4',
    driverName: 'Javier Salinas',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 6,
    result: 'Entrega completa',
    status: 'Completada',
    departureDateTime: '27 Ago 2026 · 10:00',
    closingDateTime: '27 Ago 2026 · 10:42',
    estimatedDistanceKm: 22.5,
    estimatedTimeText: '38 min',
    realTimeText: '42 min',
    remisionesFolios: ['REM-2026-0060'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Desarrollos Residenciales del Norte S.A.',
        customerType: 'Desarrolladora',
        address: 'Av. Ricardo Margáin 555, Santa Engracia, San Pedro Garza García, N.L.',
        zoneName: 'San Pedro Garza García',
        remisionFolio: 'REM-2026-0060',
        sourceDocumentFolio: 'PED-2026-0100',
        totalUnits: 6,
        validatedUnits: 6,
        result: 'Entrega completa',
        arrivalDateTime: '27 Ago 2026 · 10:28',
        deliveryDateTime: '27 Ago 2026 · 10:38',
        coordinates: { lat: 25.6540, lng: -100.3620, label: '25.6540, -100.3620 (Santa Engracia)' },
        recipientName: 'Lic. Javier Cantú (Superintendente)',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 3, uids: ['CJ-RTM-2026-000121', 'CJ-RTM-2026-000122', 'CJ-RTM-2026-000123'] },
          { sku: 'CJ-EMB-MED', productName: 'RTM Packaging Colchón Ortopedic King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 3, uids: ['CJ-RTM-2026-000124', 'CJ-RTM-2026-000125', 'CJ-RTM-2026-000126'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Pedido registrado', timestamp: '27 Ago 2026 · 08:15', responsibleUser: 'Claudia Morales', referenceFolio: 'PED-2026-0100' },
      { stepName: 'Remisión generada', timestamp: '27 Ago 2026 · 09:00', responsibleUser: 'Mesa de Salida', referenceFolio: 'REM-2026-0060' },
      { stepName: 'Verificación de salida completada', timestamp: '27 Ago 2026 · 09:35', responsibleUser: 'Valeria Torres', referenceFolio: 'OS-2026-0044' },
      { stepName: 'Ruta iniciada', timestamp: '27 Ago 2026 · 10:00', responsibleUser: 'Javier Salinas (Chofer)', referenceFolio: 'RT-2026-0028' },
      { stepName: 'Llegada registrada en sitio', timestamp: '27 Ago 2026 · 10:28', responsibleUser: 'Javier Salinas (Chofer)', referenceFolio: 'REM-2026-0060' },
      { stepName: 'Entrega confirmada y remisión firmada', timestamp: '27 Ago 2026 · 10:38', responsibleUser: 'Javier Salinas (Chofer)', referenceFolio: 'REM-2026-0060', notes: 'Recibió Lic. Javier Cantú.' },
      { stepName: 'Cierre de ruta', timestamp: '27 Ago 2026 · 10:42', responsibleUser: 'Javier Salinas', referenceFolio: 'RT-2026-0028' },
    ],
  },

  // =========================================================================
  // 3. VENTA MULTI-PARADA PARCIAL (Faltante 1 u. no localizada en andén)
  // =========================================================================
  {
    id: 'hist-rt-0022',
    routeFolio: 'RT-2026-0022',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0038',
    sourceDocumentFolio: 'PED-2026-0085',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Inmobiliaria & Rentas Cumbres',
    vehicleId: 'veh-12',
    vehicleName: 'Camión #12 · Hino 300',
    driverId: 'drv-3',
    driverName: 'Luis Herrera',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 4,
    result: 'Entrega parcial',
    status: 'Completada',
    departureDateTime: '26 Ago 2026 · 11:30',
    closingDateTime: '26 Ago 2026 · 13:20',
    estimatedDistanceKm: 28.4,
    estimatedTimeText: '52 min',
    realTimeText: '1 h 10 min',
    remisionesFolios: ['REM-2026-0058'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
        customerType: 'Inmobiliaria',
        address: 'Av. Paseo de los Leones 2800, Cumbres 4to Sector, Monterrey, N.L.',
        zoneName: 'Cumbres Poniente',
        remisionFolio: 'REM-2026-0058',
        sourceDocumentFolio: 'PED-2026-0085',
        totalUnits: 4,
        validatedUnits: 3,
        result: 'Entrega parcial',
        arrivalDateTime: '26 Ago 2026 · 12:15',
        deliveryDateTime: '26 Ago 2026 · 12:35',
        coordinates: { lat: 25.7280, lng: -100.4120, label: '25.7280, -100.4120 (Cumbres Poniente)' },
        recipientName: 'Arq. Gerardo Salinas (Residente de Obra)',
        incidentType: 'Unidad no localizada',
        incidentNotes: 'Se entregaron 3 de 4 paquetes / tarimas. Faltó 1 pieza SKU SC-AMER-CONF-IND (CJ-RTM-2026-000084). Pendiente reenvío en ruta vespertina.',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 2, uids: ['CJ-RTM-2026-000081', 'CJ-RTM-2026-000082'] },
          { sku: 'SC-AMER-CONF-IND', productName: 'America Colchón Confort Individual', brand: 'America', size: 'Individual', quantity: 1, uids: ['CJ-RTM-2026-000083'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Pedido registrado', timestamp: '26 Ago 2026 · 09:00', responsibleUser: 'Ventas Corporativas', referenceFolio: 'PED-2026-0085' },
      { stepName: 'Remisión emitida', timestamp: '26 Ago 2026 · 10:20', responsibleUser: 'Mesa de Salida', referenceFolio: 'REM-2026-0058' },
      { stepName: 'Salida de CEDIS Norte', timestamp: '26 Ago 2026 · 11:30', responsibleUser: 'Luis Herrera', referenceFolio: 'RT-2026-0022' },
      { stepName: 'Llegada a destino', timestamp: '26 Ago 2026 · 12:15', responsibleUser: 'Luis Herrera', referenceFolio: 'REM-2026-0058' },
      { stepName: 'Entrega parcial registrada (3/4 u.)', timestamp: '26 Ago 2026 · 12:35', responsibleUser: 'Luis Herrera', referenceFolio: 'REM-2026-0058', notes: 'Incidencia por unidad faltante asentada en remisión.' },
      { stepName: 'Cierre de ruta', timestamp: '26 Ago 2026 · 13:20', responsibleUser: 'Luis Herrera', referenceFolio: 'RT-2026-0022' },
    ],
  },

  // =========================================================================
  // 4. VENTA PARCIAL (1 u. rechazada por empaque dañado)
  // =========================================================================
  {
    id: 'hist-rt-0026',
    routeFolio: 'RT-2026-0026',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0042',
    sourceDocumentFolio: 'PED-2026-0095',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Hotel Boutique Las Lomas',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 6,
    result: 'Entrega parcial',
    status: 'Completada',
    departureDateTime: '27 Ago 2026 · 15:00',
    closingDateTime: '27 Ago 2026 · 16:15',
    estimatedDistanceKm: 24.0,
    estimatedTimeText: '40 min',
    realTimeText: '48 min',
    remisionesFolios: ['REM-2026-0059'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Hotel Boutique Las Lomas',
        customerType: 'Corporativo Hotelero',
        address: 'Av. Lázaro Cárdenas 2225, Valle Oriente, San Pedro Garza García, N.L.',
        zoneName: 'Valle Oriente',
        remisionFolio: 'REM-2026-0059',
        sourceDocumentFolio: 'PED-2026-0095',
        totalUnits: 6,
        validatedUnits: 5,
        result: 'Entrega parcial',
        arrivalDateTime: '27 Ago 2026 · 15:35',
        deliveryDateTime: '27 Ago 2026 · 15:55',
        coordinates: { lat: 25.6482, lng: -100.3275, label: '25.6482, -100.3275 (Valle Oriente)' },
        recipientName: 'Ing. Fernando Lozano',
        incidentType: 'Cliente rechaza unidad',
        incidentNotes: 'Cliente aceptó 5 paquetes / tarimas y rechazó 1 pieza (CJ-RTM-2026-000095) por plástico protector rasgado durante la maniobra.',
        items: [
          { sku: 'SC-SEA-POST-QS', productName: 'RTM Packaging Colchón Posturepedic Queen Size', brand: 'RTM Packaging', size: 'Queen Size', quantity: 5, uids: ['CJ-RTM-2026-000091', 'CJ-RTM-2026-000092', 'CJ-RTM-2026-000093', 'CJ-RTM-2026-000094', 'CJ-RTM-2026-000096'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS', timestamp: '27 Ago 2026 · 15:00', responsibleUser: 'Roberto Garza', referenceFolio: 'RT-2026-0026' },
      { stepName: 'Llegada a destino', timestamp: '27 Ago 2026 · 15:35', responsibleUser: 'Roberto Garza', referenceFolio: 'REM-2026-0059' },
      { stepName: 'Entrega parcial confirmada (5/6 u.)', timestamp: '27 Ago 2026 · 15:55', responsibleUser: 'Roberto Garza', referenceFolio: 'REM-2026-0059' },
      { stepName: 'Cierre de ruta', timestamp: '27 Ago 2026 · 16:15', responsibleUser: 'Roberto Garza', referenceFolio: 'RT-2026-0026' },
    ],
  },

  // =========================================================================
  // 5. VENTA CON INCIDENCIA (Firma bajo reserva por raspadura)
  // =========================================================================
  {
    id: 'hist-rt-0020',
    routeFolio: 'RT-2026-0020',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0035',
    sourceDocumentFolio: 'PED-2026-0078',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Arquitectura & Hábitat Monterrey',
    vehicleId: 'veh-04',
    vehicleName: 'Unidad #04 · Nissan Cabstar',
    driverId: 'drv-2',
    driverName: 'Carlos Medina',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    stopsCount: 1,
    totalUnits: 3,
    result: 'Con incidencia',
    status: 'Con incidencia',
    departureDateTime: '25 Ago 2026 · 09:15',
    closingDateTime: '25 Ago 2026 · 10:25',
    estimatedDistanceKm: 18.2,
    estimatedTimeText: '35 min',
    realTimeText: '45 min',
    remisionesFolios: ['REM-2026-0055'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Arquitectura & Hábitat Monterrey',
        customerType: 'Despacho de Diseño',
        address: 'Av. Gonzalitos 450, Mitras Sur, Monterrey, N.L.',
        zoneName: 'Mitras / Gonzalitos',
        remisionFolio: 'REM-2026-0055',
        sourceDocumentFolio: 'PED-2026-0078',
        totalUnits: 3,
        validatedUnits: 3,
        result: 'Con incidencia',
        arrivalDateTime: '25 Ago 2026 · 09:45',
        deliveryDateTime: '25 Ago 2026 · 10:10',
        coordinates: { lat: 25.6820, lng: -100.3510, label: '25.6820, -100.3510 (Mitras Sur)' },
        recipientName: 'Lic. Marcela Elizondo',
        incidentType: 'Producto dañado',
        incidentNotes: 'El cliente recibió las 3 piezas pero firmó bajo reserva por leve raspadura en esquina inferior del colchón CJ-RTM-2026-000072.',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 3, uids: ['CJ-RTM-2026-000071', 'CJ-RTM-2026-000072', 'CJ-RTM-2026-000073'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS Sur', timestamp: '25 Ago 2026 · 09:15', responsibleUser: 'Carlos Medina', referenceFolio: 'RT-2026-0020' },
      { stepName: 'Llegada a destino', timestamp: '25 Ago 2026 · 09:45', responsibleUser: 'Carlos Medina', referenceFolio: 'REM-2026-0055' },
      { stepName: 'Entrega con incidencia asentada', timestamp: '25 Ago 2026 · 10:10', responsibleUser: 'Carlos Medina', referenceFolio: 'REM-2026-0055' },
      { stepName: 'Cierre con incidencia', timestamp: '25 Ago 2026 · 10:25', responsibleUser: 'Carlos Medina', referenceFolio: 'RT-2026-0020' },
    ],
  },

  // =========================================================================
  // 6. VENTA CON INCIDENCIA (Acceso denegado por horario de caseta)
  // =========================================================================
  {
    id: 'hist-rt-0024',
    routeFolio: 'RT-2026-0024',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0040',
    sourceDocumentFolio: 'PED-2026-0092',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Residencial Las Lajas',
    vehicleId: 'veh-05',
    vehicleName: 'Camión #05 · Isuzu Forward',
    driverId: 'drv-5',
    driverName: 'Raúl Morales',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    stopsCount: 1,
    totalUnits: 2,
    result: 'Con incidencia',
    status: 'Con incidencia',
    departureDateTime: '26 Ago 2026 · 16:30',
    closingDateTime: '26 Ago 2026 · 17:45',
    estimatedDistanceKm: 14.5,
    estimatedTimeText: '30 min',
    realTimeText: '45 min',
    remisionesFolios: ['REM-2026-0057'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Residencial Las Lajas (Sra. Patricia Benavides)',
        customerType: 'Persona física',
        address: 'Paseo de las Lajas 1420, Col. Las Lajas, San Pedro Garza García, N.L.',
        zoneName: 'San Pedro / Las Lajas',
        remisionFolio: 'REM-2026-0057',
        sourceDocumentFolio: 'PED-2026-0092',
        totalUnits: 2,
        validatedUnits: 0,
        result: 'Con incidencia',
        arrivalDateTime: '26 Ago 2026 · 17:05',
        deliveryDateTime: '26 Ago 2026 · 17:30',
        coordinates: { lat: 25.6420, lng: -100.3850, label: '25.6420, -100.3850 (Las Lajas)' },
        recipientName: 'Seguridad Privada Caseta Las Lajas',
        incidentType: 'Otro',
        incidentNotes: 'Acceso denegado por administración del fraccionamiento después de las 17:00 h. Cliente no contestó llamada. Mercancía retornó a CEDIS para reprogramación.',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 2, uids: ['CJ-RTM-2026-000076', 'CJ-RTM-2026-000077'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS Sur', timestamp: '26 Ago 2026 · 16:30', responsibleUser: 'Raúl Morales', referenceFolio: 'RT-2026-0024' },
      { stepName: 'Llegada a caseta de acceso', timestamp: '26 Ago 2026 · 17:05', responsibleUser: 'Raúl Morales', referenceFolio: 'REM-2026-0057' },
      { stepName: 'Incidencia por restricción de acceso', timestamp: '26 Ago 2026 · 17:30', responsibleUser: 'Raúl Morales', referenceFolio: 'REM-2026-0057' },
      { stepName: 'Cierre con incidencia / Retorno a CEDIS', timestamp: '26 Ago 2026 · 17:45', responsibleUser: 'Raúl Morales', referenceFolio: 'RT-2026-0024' },
    ],
  },

  // =========================================================================
  // 7. TRASPASO ENTREGADO FÍSICAMENTE (Pendiente Recepción MdeV)
  // =========================================================================
  {
    id: 'hist-rt-0029',
    routeFolio: 'RT-2026-0029',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0045',
    sourceDocumentFolio: 'OTP-2026-0041',
    sourceDocumentType: 'OTP',
    destinationSummary: 'Laboratorios Medifarma (Parque Industrial)',
    vehicleId: 'veh-12',
    vehicleName: 'Camión #12 · Hino 300',
    driverId: 'drv-2',
    driverName: 'Carlos Medina',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 14,
    result: 'Entregado físicamente en destino',
    status: 'Completada',
    departureDateTime: '28 Ago 2026 · 08:30',
    closingDateTime: '28 Ago 2026 · 09:18',
    estimatedDistanceKm: 24.8,
    estimatedTimeText: '42 min',
    realTimeText: '48 min',
    remisionesFolios: ['REM-TR-2026-0019'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        customerType: 'Instalación Operativa',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        zoneName: 'Valle Oriente / San Pedro',
        remisionFolio: 'REM-TR-2026-0019',
        sourceDocumentFolio: 'OTP-2026-0041',
        totalUnits: 14,
        validatedUnits: 14,
        result: 'Entregado físicamente en destino',
        arrivalDateTime: '28 Ago 2026 · 09:05',
        deliveryDateTime: '28 Ago 2026 · 09:15',
        coordinates: { lat: 25.6480, lng: -100.3270, label: '25.6480, -100.3270 (Laboratorios Medifarma (Parque Industrial))' },
        recipientName: 'Brenda Cavazos (Encargada VO)',
        branchReceiptConfirmed: false,
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 6, uids: ['CJ-RTM-2026-000051', 'CJ-RTM-2026-000052', 'CJ-RTM-2026-000053', 'CJ-RTM-2026-000054', 'CJ-RTM-2026-000055', 'CJ-RTM-2026-000056'] },
          { sku: 'CJ-EMB-MED', productName: 'RTM Packaging Colchón Ortopedic Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 8, uids: ['CJ-RTM-2026-000061', 'CJ-RTM-2026-000062', 'CJ-RTM-2026-000063', 'CJ-RTM-2026-000064', 'CJ-RTM-2026-000065', 'CJ-RTM-2026-000066', 'CJ-RTM-2026-000067', 'CJ-RTM-2026-000068'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Orden de Traspaso autorizada', timestamp: '28 Ago 2026 · 07:30', responsibleUser: 'Planeación de Inventarios', referenceFolio: 'OTP-2026-0041' },
      { stepName: 'Remisión de traspaso emitida', timestamp: '28 Ago 2026 · 08:00', responsibleUser: 'CEDIS Norte Mesa', referenceFolio: 'REM-TR-2026-0019' },
      { stepName: 'Salida de unidad en tránsito', timestamp: '28 Ago 2026 · 08:30', responsibleUser: 'Carlos Medina (Chofer)', referenceFolio: 'RT-2026-0029' },
      { stepName: 'Llegada a andén de Laboratorios Medifarma (Parque Industrial)', timestamp: '28 Ago 2026 · 09:05', responsibleUser: 'Carlos Medina', referenceFolio: 'REM-TR-2026-0019' },
      { stepName: 'Descarga física completa en andén', timestamp: '28 Ago 2026 · 09:15', responsibleUser: 'Carlos Medina', referenceFolio: 'REM-TR-2026-0019', notes: 'Entregado a Brenda Cavazos. Pendiente validación en Mesa de Verificación > Entradas.' },
      { stepName: 'Cierre de viaje de transporte', timestamp: '28 Ago 2026 · 09:18', responsibleUser: 'Carlos Medina', referenceFolio: 'RT-2026-0029' },
    ],
  },

  // =========================================================================
  // 8. TRASPASO ENTREGADO FÍSICAMENTE (Delphi Technologies (Parque Villa Florida) · Pendiente Recepción)
  // =========================================================================
  {
    id: 'hist-rt-0030',
    routeFolio: 'RT-2026-0030',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0046',
    sourceDocumentFolio: 'OTP-2026-0042',
    sourceDocumentType: 'OTP',
    destinationSummary: 'Delphi Technologies (Parque Villa Florida)',
    vehicleId: 'veh-05',
    vehicleName: 'Camión #05 · Isuzu Forward',
    driverId: 'drv-5',
    driverName: 'Raúl Morales',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    stopsCount: 1,
    totalUnits: 9,
    result: 'Entregado físicamente en destino',
    status: 'Completada',
    departureDateTime: '28 Ago 2026 · 09:30',
    closingDateTime: '28 Ago 2026 · 10:22',
    estimatedDistanceKm: 26.2,
    estimatedTimeText: '48 min',
    realTimeText: '52 min',
    remisionesFolios: ['REM-TR-2026-0020'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        customerType: 'Instalación Operativa',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        zoneName: 'Cumbres 1er Sector',
        remisionFolio: 'REM-TR-2026-0020',
        sourceDocumentFolio: 'OTP-2026-0042',
        totalUnits: 9,
        validatedUnits: 9,
        result: 'Entregado físicamente en destino',
        arrivalDateTime: '28 Ago 2026 · 10:12',
        deliveryDateTime: '28 Ago 2026 · 10:20',
        coordinates: { lat: 25.7145, lng: -100.3872, label: '25.7145, -100.3872 (Delphi Technologies (Parque Villa Florida))' },
        recipientName: 'Jorge Villarreal (Encargado Cumbres)',
        branchReceiptConfirmed: false,
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 5, uids: ['CJ-RTM-2026-000041', 'CJ-RTM-2026-000042', 'CJ-RTM-2026-000043', 'CJ-RTM-2026-000044', 'CJ-RTM-2026-000045'] },
          { sku: 'SC-SEA-POST-QS', productName: 'RTM Packaging Colchón Posturepedic Queen Size', brand: 'RTM Packaging', size: 'Queen Size', quantity: 4, uids: ['CJ-RTM-2026-000046', 'CJ-RTM-2026-000047', 'CJ-RTM-2026-000048', 'CJ-RTM-2026-000049'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS Sur', timestamp: '28 Ago 2026 · 09:30', responsibleUser: 'Raúl Morales', referenceFolio: 'RT-2026-0030' },
      { stepName: 'Llegada a Delphi Technologies (Parque Villa Florida)', timestamp: '28 Ago 2026 · 10:12', responsibleUser: 'Raúl Morales', referenceFolio: 'REM-TR-2026-0020' },
      { stepName: 'Descarga física completa en andén', timestamp: '28 Ago 2026 · 10:20', responsibleUser: 'Raúl Morales', referenceFolio: 'REM-TR-2026-0020' },
      { stepName: 'Cierre de viaje', timestamp: '28 Ago 2026 · 10:22', responsibleUser: 'Raúl Morales', referenceFolio: 'RT-2026-0030' },
    ],
  },

  // =========================================================================
  // 9. TRASPASO CON RECEPCIÓN CONFIRMADA EN MdeV (Valle Oriente)
  // =========================================================================
  {
    id: 'hist-rt-0018',
    routeFolio: 'RT-2026-0018',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0031',
    sourceDocumentFolio: 'OTP-2026-0035',
    sourceDocumentType: 'OTP',
    destinationSummary: 'Laboratorios Medifarma (Parque Industrial)',
    vehicleId: 'veh-15',
    vehicleName: 'Unidad #15 · Freightliner M2',
    driverId: 'drv-4',
    driverName: 'Javier Salinas',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 12,
    result: 'Recepción confirmada en sucursal',
    status: 'Completada',
    departureDateTime: '25 Ago 2026 · 10:00',
    closingDateTime: '25 Ago 2026 · 11:15',
    estimatedDistanceKm: 24.8,
    estimatedTimeText: '42 min',
    realTimeText: '45 min',
    remisionesFolios: ['REM-TR-2026-0018'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        customerType: 'Instalación Operativa',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        zoneName: 'Valle Oriente / San Pedro',
        remisionFolio: 'REM-TR-2026-0018',
        sourceDocumentFolio: 'OTP-2026-0035',
        totalUnits: 12,
        validatedUnits: 12,
        result: 'Recepción confirmada en sucursal',
        arrivalDateTime: '25 Ago 2026 · 10:45',
        deliveryDateTime: '25 Ago 2026 · 11:05',
        coordinates: { lat: 25.6480, lng: -100.3270, label: '25.6480, -100.3270 (Laboratorios Medifarma (Parque Industrial))' },
        recipientName: 'Brenda Cavazos (Encargada VO)',
        branchReceiptConfirmed: true,
        branchReceiptDateTime: '25 Ago 2026 · 11:35',
        branchReceiptOperator: 'Brenda Cavazos (Mesa de Verificación VO)',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record King Size', brand: 'RTM Packaging', size: 'King Size', quantity: 6, uids: ['CJ-RTM-2026-000031', 'CJ-RTM-2026-000032', 'CJ-RTM-2026-000033', 'CJ-RTM-2026-000034', 'CJ-RTM-2026-000035', 'CJ-RTM-2026-000036'] },
          { sku: 'CJ-EMB-MED', productName: 'RTM Packaging Colchón Ortopedic Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 6, uids: ['CJ-RTM-2026-000037', 'CJ-RTM-2026-000038', 'CJ-RTM-2026-000039', 'CJ-RTM-2026-000040', 'CJ-RTM-2026-000021', 'CJ-RTM-2026-000022'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS Norte', timestamp: '25 Ago 2026 · 10:00', responsibleUser: 'Javier Salinas', referenceFolio: 'RT-2026-0018' },
      { stepName: 'Descarga en andén de sucursal', timestamp: '25 Ago 2026 · 11:05', responsibleUser: 'Javier Salinas', referenceFolio: 'REM-TR-2026-0018' },
      { stepName: 'Cierre de viaje de chofer', timestamp: '25 Ago 2026 · 11:15', responsibleUser: 'Javier Salinas', referenceFolio: 'RT-2026-0018' },
      { stepName: 'Recepción y validación 100% en Mesa de Verificación', timestamp: '25 Ago 2026 · 11:35', responsibleUser: 'Brenda Cavazos (MdeV)', referenceFolio: 'ENT-2026-0018', notes: '12 UIDs escaneadas e ingresadas a inventario de Laboratorios Medifarma (Parque Industrial).' },
    ],
  },

  // =========================================================================
  // 10. TRASPASO CON RECEPCIÓN CONFIRMADA EN MdeV (Cumbres)
  // =========================================================================
  {
    id: 'hist-rt-0021',
    routeFolio: 'RT-2026-0021',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0036',
    sourceDocumentFolio: 'OTP-2026-0038',
    sourceDocumentType: 'OTP',
    destinationSummary: 'Delphi Technologies (Parque Villa Florida)',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-sur',
    originWarehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    originCoordinates: { x: 580, y: 410, name: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)' },
    stopsCount: 1,
    totalUnits: 8,
    result: 'Recepción confirmada en sucursal',
    status: 'Completada',
    departureDateTime: '26 Ago 2026 · 14:00',
    closingDateTime: '26 Ago 2026 · 15:10',
    estimatedDistanceKm: 26.2,
    estimatedTimeText: '48 min',
    realTimeText: '50 min',
    remisionesFolios: ['REM-TR-2026-0017'],
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Delphi Technologies (Parque Villa Florida)',
        customerType: 'Instalación Operativa',
        address: 'Av. Paseo de los Leones 1200, Cumbres, Monterrey, N.L.',
        zoneName: 'Cumbres 1er Sector',
        remisionFolio: 'REM-TR-2026-0017',
        sourceDocumentFolio: 'OTP-2026-0038',
        totalUnits: 8,
        validatedUnits: 8,
        result: 'Recepción confirmada en sucursal',
        arrivalDateTime: '26 Ago 2026 · 14:50',
        deliveryDateTime: '26 Ago 2026 · 15:05',
        coordinates: { lat: 25.7145, lng: -100.3872, label: '25.7145, -100.3872 (Delphi Technologies (Parque Villa Florida))' },
        recipientName: 'Jorge Villarreal (Encargado Cumbres)',
        branchReceiptConfirmed: true,
        branchReceiptDateTime: '26 Ago 2026 · 15:30',
        branchReceiptOperator: 'Jorge Villarreal (Mesa de Verificación Cumbres)',
        items: [
          { sku: 'FOL-MED-PLE', productName: 'RTM Packaging Colchón Record Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 4, uids: ['CJ-RTM-2026-000011', 'CJ-RTM-2026-000012', 'CJ-RTM-2026-000013', 'CJ-RTM-2026-000014'] },
          { sku: 'CJ-EMB-MED', productName: 'RTM Packaging Colchón Ortopedic Matrimonial', brand: 'RTM Packaging', size: 'Matrimonial', quantity: 4, uids: ['CJ-RTM-2026-000015', 'CJ-RTM-2026-000016', 'CJ-RTM-2026-000017', 'CJ-RTM-2026-000018'] },
        ],
      },
    ],
    timeline: [
      { stepName: 'Salida de CEDIS Sur', timestamp: '26 Ago 2026 · 14:00', responsibleUser: 'Roberto Garza', referenceFolio: 'RT-2026-0021' },
      { stepName: 'Descarga en andén de sucursal', timestamp: '26 Ago 2026 · 15:05', responsibleUser: 'Roberto Garza', referenceFolio: 'REM-TR-2026-0017' },
      { stepName: 'Cierre de viaje', timestamp: '26 Ago 2026 · 15:10', responsibleUser: 'Roberto Garza', referenceFolio: 'RT-2026-0021' },
      { stepName: 'Recepción confirmada en Mesa de Verificación', timestamp: '26 Ago 2026 · 15:30', responsibleUser: 'Jorge Villarreal (MdeV)', referenceFolio: 'ENT-2026-0021', notes: '8 UIDs verificadas e ingresadas a inventario disponible de Delphi Technologies (Parque Villa Florida).' },
    ],
  },

  // =========================================================================
  // 11. RUTA CANCELADA (Venta · Falla mecánica en unidad de transporte)
  // =========================================================================
  {
    id: 'hist-rt-0019',
    routeFolio: 'RT-2026-0019',
    type: 'Venta',
    outboundOrderFolio: 'OS-2026-0033',
    sourceDocumentFolio: 'PED-2026-0080',
    sourceDocumentType: 'Pedido',
    destinationSummary: 'Grupo Hotelero Sierra Madre',
    vehicleId: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    driverId: 'drv-1',
    driverName: 'Roberto Garza',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 5,
    result: 'Cancelada',
    status: 'Cancelada',
    departureDateTime: '25 Ago 2026 · 11:00',
    closingDateTime: '25 Ago 2026 · 11:20',
    estimatedDistanceKm: 32.0,
    estimatedTimeText: '50 min',
    realTimeText: '20 min',
    remisionesFolios: ['REM-2026-0054'],
    cancelReason: 'Falla mecánica imprevista en sistema hidráulico de rampa previo a salida de patio. Orden de salida retornada a andén para reasignación de unidad.',
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Grupo Hotelero Sierra Madre',
        customerType: 'Corporativo',
        address: 'Av. Eugenio Garza Sada 4500, Col. Las Brisas, Monterrey, N.L.',
        zoneName: 'Zona Sur / Las Brisas',
        remisionFolio: 'REM-2026-0054',
        sourceDocumentFolio: 'PED-2026-0080',
        totalUnits: 5,
        validatedUnits: 0,
        result: 'Cancelada',
        arrivalDateTime: 'No arribó',
        deliveryDateTime: 'Cancelada',
        coordinates: { lat: 25.6210, lng: -100.2830, label: '25.6210, -100.2830 (Zona Sur)' },
        recipientName: 'N/A',
        items: [],
      },
    ],
    timeline: [
      { stepName: 'Ruta despachada en patio', timestamp: '25 Ago 2026 · 11:00', responsibleUser: 'Roberto Garza', referenceFolio: 'RT-2026-0019' },
      { stepName: 'Reporte de falla mecánica', timestamp: '25 Ago 2026 · 11:15', responsibleUser: 'Roberto Garza', notes: 'Falla en bomba hidráulica.' },
      { stepName: 'Cancelación de ruta y reasignación', timestamp: '25 Ago 2026 · 11:20', responsibleUser: 'Supervisión de Patio CEDIS Norte', referenceFolio: 'OS-2026-0033' },
    ],
  },

  // =========================================================================
  // 12. RUTA CANCELADA (Traspaso · Requerimiento urgente reasignado en CEDIS)
  // =========================================================================
  {
    id: 'hist-rt-0023',
    routeFolio: 'RT-2026-0023',
    type: 'Traspaso',
    outboundOrderFolio: 'OS-2026-0039',
    sourceDocumentFolio: 'OTP-2026-0039',
    sourceDocumentType: 'OTP',
    destinationSummary: 'Laboratorios Medifarma (Parque Industrial)',
    vehicleId: 'veh-04',
    vehicleName: 'Unidad #04 · Nissan Cabstar',
    driverId: 'drv-2',
    driverName: 'Carlos Medina',
    originWarehouseId: 'wh-mty-norte',
    originWarehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    originCoordinates: { x: 260, y: 70, name: 'ALM-MP (Materia Prima - Nave 1 Reynosa)' },
    stopsCount: 1,
    totalUnits: 4,
    result: 'Cancelada',
    status: 'Cancelada',
    departureDateTime: '26 Ago 2026 · 12:00',
    closingDateTime: '26 Ago 2026 · 12:15',
    estimatedDistanceKm: 24.8,
    estimatedTimeText: '42 min',
    realTimeText: '15 min',
    remisionesFolios: ['REM-TR-2026-0016'],
    cancelReason: 'Cancelación administrativa por reasignación prioritaria de stock a pedido foráneo hospitalario antes de salir a vialidad.',
    stops: [
      {
        stopSequence: 1,
        destinationName: 'Laboratorios Medifarma (Parque Industrial)',
        customerType: 'Instalación Operativa',
        address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.',
        zoneName: 'Valle Oriente / San Pedro',
        remisionFolio: 'REM-TR-2026-0016',
        sourceDocumentFolio: 'OTP-2026-0039',
        totalUnits: 4,
        validatedUnits: 0,
        result: 'Cancelada',
        arrivalDateTime: 'No arribó',
        deliveryDateTime: 'Cancelada',
        coordinates: { lat: 25.6480, lng: -100.3270, label: '25.6480, -100.3270 (Laboratorios Medifarma (Parque Industrial))' },
        recipientName: 'N/A',
        items: [],
      },
    ],
    timeline: [
      { stepName: 'Ruta preparada', timestamp: '26 Ago 2026 · 12:00', responsibleUser: 'Carlos Medina', referenceFolio: 'RT-2026-0023' },
      { stepName: 'Cancelación y reintegro a andén', timestamp: '26 Ago 2026 · 12:15', responsibleUser: 'Planeación de Inventarios', referenceFolio: 'OTP-2026-0039' },
    ],
  },
];

let shippingHistoryStore: ShippingHistoryRecord[] = [...INITIAL_MOCK_SHIPPING_HISTORY];

export function getShippingHistoryList(): ShippingHistoryRecord[] {
  // Convert any dynamically completed routes into history records if not already in store
  const dynamicallyCompleted = activeRoutesStore.filter((r) => r.status === 'Completada');
  const dynamicHistoryRecords: ShippingHistoryRecord[] = dynamicallyCompleted.map((r) => {
    const existing = shippingHistoryStore.find((h) => h.routeFolio === r.folio);
    if (existing) return existing;

    const allUnitsDelivered = r.stops.every((s) => s.status === 'Completada');
    const resultType: ShippingHistoryResult = r.type === 'Traspaso'
      ? 'Entregado físicamente en destino'
      : allUnitsDelivered ? 'Entrega completa' : 'Entrega parcial';

    const historyStops: ShippingHistoryStopDetail[] = r.stops.map((s, idx) => ({
      stopSequence: idx + 1,
      destinationName: s.destinationName,
      customerType: s.customerType || 'Cliente',
      address: s.address,
      zoneName: s.zoneName,
      remisionFolio: s.remisionFolio,
      sourceDocumentFolio: s.sourceDocumentFolio || r.sourceDocumentFolio,
      totalUnits: s.totalUnits,
      validatedUnits: s.totalUnits,
      result: resultType,
      arrivalDateTime: s.arrivalRecord?.registeredAt || `${r.departureDate} · ${r.departureTime}`,
      deliveryDateTime: `${r.departureDate} · ${s.completedAt || '14:48'}`,
      coordinates: s.arrivalRecord?.coordinates || { lat: 25.6573, lng: -100.3668, label: '25.6573, -100.3668' },
      recipientName: s.contactName || s.destinationName,
      items: s.items || [],
      branchReceiptConfirmed: false,
    }));

    return {
      id: `hist-${r.id}`,
      routeFolio: r.folio,
      type: r.type,
      outboundOrderFolio: r.outboundOrderFolio,
      sourceDocumentFolio: r.sourceDocumentFolio,
      sourceDocumentType: r.sourceDocumentType,
      destinationSummary: r.stops.length > 1 ? `${r.stops[0].destinationName} + ${r.stops.length - 1} destinos` : r.stops[0]?.destinationName || '',
      vehicleId: r.vehicleId,
      vehicleName: r.vehicleName,
      driverId: r.driverId,
      driverName: r.driverName,
      originWarehouseId: r.originWarehouseId,
      originWarehouseName: r.originWarehouseName,
      originCoordinates: r.originCoordinates,
      stopsCount: r.stops.length,
      totalUnits: r.totalUnits,
      result: resultType,
      status: 'Completada',
      departureDateTime: `${r.departureDate} · ${r.departureTime}`,
      closingDateTime: `${r.departureDate} · 17:08`,
      estimatedDistanceKm: r.totalDistanceKm,
      estimatedTimeText: `${r.estimatedDurationMinutes} min`,
      realTimeText: `${r.estimatedDurationMinutes + 10} min`,
      remisionesFolios: r.remisionesFolios,
      stops: historyStops,
      timeline: [
        { stepName: 'Salida de CEDIS', timestamp: `${r.departureDate} · ${r.departureTime}`, responsibleUser: r.driverName, referenceFolio: r.folio },
        { stepName: 'Entregas validadas y completadas', timestamp: `${r.departureDate} · 17:08`, responsibleUser: r.driverName, referenceFolio: r.folio },
      ],
    };
  });

  return [...shippingHistoryStore, ...dynamicHistoryRecords.filter((d) => !shippingHistoryStore.some((h) => h.routeFolio === d.routeFolio))];
}

// ===========================================================================
// SECCIÓN DE FLOTA, DESEMPEÑO & ANALÍTICA DE DASHBOARD
// ===========================================================================

export interface FleetVehicleItem {
  id: string;
  vehicleName: string;
  plate: string;
  status: 'En ruta' | 'Disponible' | 'Pendiente de carga' | 'Mantenimiento';
  assignedRouteFolio?: string;
  driverName?: string;
  capacityUnits: number;
  loadedUnits: number;
  occupancyPercentage: number;
  facilityName: string;
  lastActivityText: string;
}

export const INITIAL_MOCK_FLEET: FleetVehicleItem[] = [
  {
    id: 'veh-08',
    vehicleName: 'Camión #08 · Isuzu NPR',
    plate: 'NL-8492-B',
    status: 'En ruta',
    assignedRouteFolio: 'RT-2026-0031',
    driverName: 'Roberto Garza',
    capacityUnits: 32,
    loadedUnits: 14,
    occupancyPercentage: 44,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'En ruta · Parada 1 en atención',
  },
  {
    id: 'veh-15',
    vehicleName: 'Unidad #15 · Freightliner M2',
    plate: 'NL-1590-C',
    status: 'En ruta',
    assignedRouteFolio: 'RT-2026-0032',
    driverName: 'Javier Salinas',
    capacityUnits: 40,
    loadedUnits: 24,
    occupancyPercentage: 60,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'En ruta · En tránsito a Santa Engracia',
  },
  {
    id: 'veh-04',
    vehicleName: 'Unidad #04 · Nissan Cabstar',
    plate: 'NL-4421-A',
    status: 'En ruta',
    assignedRouteFolio: 'RT-2026-0034',
    driverName: 'Carlos Medina',
    capacityUnits: 18,
    loadedUnits: 9,
    occupancyPercentage: 50,
    facilityName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    lastActivityText: 'En ruta · Arribo en Delphi Technologies (Parque Villa Florida)',
  },
  {
    id: 'veh-05',
    vehicleName: 'Camión #05 · Isuzu Forward',
    plate: 'NL-5510-D',
    status: 'En ruta',
    assignedRouteFolio: 'RT-2026-0037',
    driverName: 'Raúl Morales',
    capacityUnits: 30,
    loadedUnits: 12,
    occupancyPercentage: 40,
    facilityName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    lastActivityText: 'En ruta · Retraso de tráfico en Av. Morones Prieto',
  },
  {
    id: 'veh-12',
    vehicleName: 'Camión #12 · Hino 300',
    plate: 'NL-1288-E',
    status: 'Disponible',
    driverName: 'Luis Herrera',
    capacityUnits: 26,
    loadedUnits: 0,
    occupancyPercentage: 0,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'Disponible · Última ruta finalizada 13:38',
  },
  {
    id: 'veh-02',
    vehicleName: 'Camioneta #02 · Toyota Hilux',
    plate: 'NL-2201-F',
    status: 'Disponible',
    capacityUnits: 6,
    loadedUnits: 0,
    occupancyPercentage: 0,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'Disponible en patio CEDIS Norte',
  },
  {
    id: 'veh-09',
    vehicleName: 'Camión #09 · Isuzu NPR',
    plate: 'NL-9912-G',
    status: 'Disponible',
    capacityUnits: 32,
    loadedUnits: 0,
    occupancyPercentage: 0,
    facilityName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    lastActivityText: 'Disponible en patio CEDIS Sur',
  },
  {
    id: 'veh-14',
    vehicleName: 'Camión #14 · Hino 300',
    plate: 'NL-1433-H',
    status: 'Disponible',
    capacityUnits: 26,
    loadedUnits: 0,
    occupancyPercentage: 0,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'Disponible en patio CEDIS Norte',
  },
  {
    id: 'veh-07',
    vehicleName: 'Camión #07 · Isuzu Forward',
    plate: 'NL-7720-J',
    status: 'Pendiente de carga',
    capacityUnits: 30,
    loadedUnits: 18,
    occupancyPercentage: 60,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'Andén 3 · Cargando OS-2026-0050',
  },
  {
    id: 'veh-11',
    vehicleName: 'Unidad #11 · Nissan Cabstar',
    plate: 'NL-1144-K',
    status: 'Pendiente de carga',
    capacityUnits: 18,
    loadedUnits: 10,
    occupancyPercentage: 55,
    facilityName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    lastActivityText: 'Andén 1 · Cargando OS-2026-0051',
  },
  {
    id: 'veh-03',
    vehicleName: 'Camión #03 · Hino 300',
    plate: 'NL-3301-L',
    status: 'Pendiente de carga',
    capacityUnits: 26,
    loadedUnits: 14,
    occupancyPercentage: 54,
    facilityName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    lastActivityText: 'Andén 4 · Cargando OS-2026-0053',
  },
  {
    id: 'veh-06',
    vehicleName: 'Camión #06 · Freightliner M2',
    plate: 'NL-6619-M',
    status: 'Mantenimiento',
    capacityUnits: 40,
    loadedUnits: 0,
    occupancyPercentage: 0,
    facilityName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    lastActivityText: 'Mantenimiento preventivo · Taller CEDIS Sur',
  },
];

export interface DriverPerformanceSummary {
  driverId: string;
  driverName: string;
  deliveriesCount: number;
  completedPercentage: number;
  incidentCount: number;
  partialCount: number;
  avgDelayText: string;
}

export function getDriverPerformanceByPeriod(period: 'Hoy' | '7 días' | '30 días'): DriverPerformanceSummary[] {
  if (period === 'Hoy') {
    return [
      { driverId: 'drv-1', driverName: 'Roberto Garza', deliveriesCount: 12, completedPercentage: 100.0, incidentCount: 0, partialCount: 0, avgDelayText: '+2 min' },
      { driverId: 'drv-2', driverName: 'Carlos Medina', deliveriesCount: 9, completedPercentage: 88.9, incidentCount: 1, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-3', driverName: 'Luis Herrera', deliveriesCount: 8, completedPercentage: 87.5, incidentCount: 0, partialCount: 1, avgDelayText: '+6 min' },
      { driverId: 'drv-4', driverName: 'Javier Salinas', deliveriesCount: 7, completedPercentage: 100.0, incidentCount: 0, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-5', driverName: 'Raúl Morales', deliveriesCount: 6, completedPercentage: 83.3, incidentCount: 1, partialCount: 0, avgDelayText: '+12 min' },
    ];
  } else if (period === '7 días') {
    return [
      { driverId: 'drv-1', driverName: 'Roberto Garza', deliveriesCount: 48, completedPercentage: 97.9, incidentCount: 1, partialCount: 0, avgDelayText: '+1 min' },
      { driverId: 'drv-4', driverName: 'Javier Salinas', deliveriesCount: 39, completedPercentage: 100.0, incidentCount: 0, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-2', driverName: 'Carlos Medina', deliveriesCount: 42, completedPercentage: 95.2, incidentCount: 2, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-3', driverName: 'Luis Herrera', deliveriesCount: 36, completedPercentage: 94.4, incidentCount: 0, partialCount: 2, avgDelayText: '+4 min' },
      { driverId: 'drv-5', driverName: 'Raúl Morales', deliveriesCount: 31, completedPercentage: 90.3, incidentCount: 3, partialCount: 0, avgDelayText: '+8 min' },
    ];
  } else {
    return [
      { driverId: 'drv-1', driverName: 'Roberto Garza', deliveriesCount: 184, completedPercentage: 98.4, incidentCount: 3, partialCount: 0, avgDelayText: '+1 min' },
      { driverId: 'drv-4', driverName: 'Javier Salinas', deliveriesCount: 155, completedPercentage: 99.4, incidentCount: 1, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-2', driverName: 'Carlos Medina', deliveriesCount: 168, completedPercentage: 96.4, incidentCount: 6, partialCount: 0, avgDelayText: 'a tiempo' },
      { driverId: 'drv-3', driverName: 'Luis Herrera', deliveriesCount: 142, completedPercentage: 95.1, incidentCount: 0, partialCount: 7, avgDelayText: '+5 min' },
      { driverId: 'drv-5', driverName: 'Raúl Morales', deliveriesCount: 128, completedPercentage: 92.2, incidentCount: 10, partialCount: 0, avgDelayText: '+9 min' },
    ];
  }
}

export interface ActivityTimePoint {
  label: string;
  salidas: number;
  llegadas: number;
  entregas: number;
}

export function getDeliveryActivityData(period: 'Hoy' | '7 días' | '30 días'): ActivityTimePoint[] {
  if (period === 'Hoy') {
    return [
      { label: '08:00', salidas: 4, llegadas: 0, entregas: 0 },
      { label: '09:00', salidas: 6, llegadas: 2, entregas: 1 },
      { label: '10:00', salidas: 5, llegadas: 4, entregas: 4 },
      { label: '11:00', salidas: 3, llegadas: 5, entregas: 5 },
      { label: '12:00', salidas: 2, llegadas: 4, entregas: 4 },
      { label: '13:00', salidas: 1, llegadas: 3, entregas: 2 },
      { label: '14:00', salidas: 3, llegadas: 2, entregas: 1 },
      { label: '15:00', salidas: 2, llegadas: 1, entregas: 1 },
      { label: '16:00', salidas: 0, llegadas: 0, entregas: 0 },
      { label: '17:00', salidas: 0, llegadas: 0, entregas: 0 },
    ];
  } else if (period === '7 días') {
    return [
      { label: 'Lun 22', salidas: 18, llegadas: 18, entregas: 17 },
      { label: 'Mar 23', salidas: 22, llegadas: 22, entregas: 21 },
      { label: 'Mié 24', salidas: 20, llegadas: 20, entregas: 19 },
      { label: 'Jue 25', salidas: 24, llegadas: 23, entregas: 22 },
      { label: 'Vie 26', salidas: 26, llegadas: 25, entregas: 24 },
      { label: 'Sáb 27', salidas: 19, llegadas: 19, entregas: 18 },
      { label: 'Hoy 28', salidas: 26, llegadas: 21, entregas: 18 },
    ];
  } else {
    return [
      { label: 'Semana 1', salidas: 110, llegadas: 108, entregas: 104 },
      { label: 'Semana 2', salidas: 125, llegadas: 124, entregas: 119 },
      { label: 'Semana 3', salidas: 130, llegadas: 128, entregas: 123 },
      { label: 'Semana 4', salidas: 142, llegadas: 138, entregas: 132 },
    ];
  }
}

export interface DashboardAttentionItem {
  id: string;
  type: 'delay' | 'incident' | 'partial' | 'on_time';
  categoryTitle: string;
  routeFolio: string;
  remisionFolio?: string;
  vehicleName: string;
  driverName: string;
  stopSequenceText?: string;
  destinationName: string;
  detailText: string;
  actionLabel: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
}

export const INITIAL_MOCK_ATTENTION_ITEMS: DashboardAttentionItem[] = [
  // 2 Retrasos
  {
    id: 'att-1',
    type: 'delay',
    categoryTitle: 'Retraso de Ruta',
    routeFolio: 'RT-2026-0033',
    vehicleName: 'Camión #08',
    driverName: 'Roberto Garza',
    stopSequenceText: 'Parada 2 de 4',
    destinationName: 'Hotel Boutique Las Lomas',
    detailText: 'Retraso estimado: 18 min (tráfico en Av. Lázaro Cárdenas)',
    actionLabel: 'Abrir ruta',
    severity: 'warning',
  },
  {
    id: 'att-2',
    type: 'delay',
    categoryTitle: 'Retraso de Ruta',
    routeFolio: 'RT-2026-0037',
    vehicleName: 'Camión #05',
    driverName: 'Raúl Morales',
    stopSequenceText: 'Parada 3 de 3',
    destinationName: 'Residencial Las Lajas',
    detailText: 'Retraso estimado: 25 min (maniobras en Av. Morones Prieto)',
    actionLabel: 'Abrir ruta',
    severity: 'warning',
  },
  // 2 Incidencias
  {
    id: 'att-3',
    type: 'incident',
    categoryTitle: 'Validación de Pieza',
    routeFolio: 'RT-2026-0041',
    vehicleName: 'Unidad #15',
    driverName: 'Javier Salinas',
    stopSequenceText: 'Parada 1 de 3',
    destinationName: 'Desarrollos Residenciales del Norte',
    detailText: '1 UID pendiente de validar contra remisión',
    actionLabel: 'Revisar',
    severity: 'danger',
  },
  {
    id: 'att-4',
    type: 'incident',
    categoryTitle: 'Diferencia en Andén',
    routeFolio: 'RT-2026-0038',
    vehicleName: 'Camión #12',
    driverName: 'Luis Herrera',
    stopSequenceText: 'Parada 2 de 2',
    destinationName: 'Inmobiliaria & Rentas Cumbres',
    detailText: 'Diferencia de bultos reportada al cargar en patio',
    actionLabel: 'Revisar',
    severity: 'danger',
  },
  // 2 En tiempo
  {
    id: 'att-5',
    type: 'on_time',
    categoryTitle: 'En Tiempo',
    routeFolio: 'RT-2026-0031',
    vehicleName: 'Camión #08',
    driverName: 'Roberto Garza',
    stopSequenceText: 'Parada 1 de 3',
    destinationName: 'Roberto Cantú Garza',
    detailText: 'En tiempo · Arribo programado 14:45 h',
    actionLabel: 'Abrir ruta',
    severity: 'success',
  },
  {
    id: 'att-6',
    type: 'on_time',
    categoryTitle: 'En Tiempo',
    routeFolio: 'RT-2026-0034',
    vehicleName: 'Unidad #04',
    driverName: 'Carlos Medina',
    stopSequenceText: 'Parada 1 de 1',
    destinationName: 'Delphi Technologies (Parque Villa Florida)',
    detailText: 'En tiempo · Descarga en andén de sucursal',
    actionLabel: 'Abrir ruta',
    severity: 'success',
  },
];


