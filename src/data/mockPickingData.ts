import { MOCK_STOCK_ITEMS, StockItemRecord } from './mockInventoryData';

export type PickingStrategyType = 
  | 'RECOMMENDED'
  | 'SUGGESTED' 
  | 'FIFO' 
  | 'FEFO' 
  | 'SHORTEST_PATH' 
  | 'EMPTY_LOCATION'
  | 'SHOWROOM_PRIORITY'
  | 'MANUAL';

export interface PendingPickingDemand {
  id: string;
  referenceFolio: string; // ej. 'OP-2026-0882', 'OP-2026-0891', 'PED-2026-0410'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno' | 'Surtido a Producción';
  warehouseId: string;
  warehouseName: string;
  destinationName: string;
  articlesCount: number;
  totalUnits: number;
  priority: 'Alta' | 'Urgente' | 'Normal';
  requiredDate: string;
  status: 'Pendiente de planeación' | 'En planeación';
  plannedStrategy?: PickingStrategyType;
  itemsSummary: {
    sku: string;
    productName: string;
    brand: string;
    size: string;
    quantity: number;
    serials?: string[];
  }[];
}

export interface PickPlanStop {
  id: string;
  sequence: number; // 1, 2, 3...
  locationCode: string; // ej. 'A-B-03'
  aisle: string; // ej. 'Pasillo A'
  rackPosition: string; // ej. 'Posición 03'
  level: string; // ej. 'Nivel B'
  uid: string; // ej. 'BOB-RTM-2026-00041'
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  ageDays: number;
  strategyReason: string; // ej. 'Bobina con mayor tiempo FIFO para corrida flexográfica.'
  strategyBadge: string;
  status: 'Pendiente' | 'Recolectando' | 'Recolectada';
  pickedAt?: string;
  substitutedFromUid?: string;
  substitutionReason?: string;
  isLocationFreed?: boolean;
}

export interface StrategyMetricComparison {
  type: PickingStrategyType;
  label: string;
  badge: string;
  stopsCount: number;
  estimatedDistanceMeters: number;
  fifoCompliancePercentage: number;
  locationsFreedCount: number;
  fefoCriticalCount: number;
  ratingStars: number;
  reasonTag: string;
  description: string;
  panelTitle: string;
  panelSubtitle: string;
}

export interface PickOrder {
  id: string;
  folio: string; // ej. 'OR-2026-0118'
  referenceFolio: string; // ej. 'OP-2026-0882'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno' | 'Surtido a Producción';
  strategyType: PickingStrategyType;
  strategyName: string;
  warehouseId: string;
  warehouseName: string;
  destinationName: string;
  tempStagingLocation: string; // ej. 'STG-OP-01'
  priority: 'Alta' | 'Urgente' | 'Normal';
  createdAt: string;
  completedAt?: string;
  operatorAssigned: string;
  status: 'Pendiente' | 'En proceso' | 'Completa' | 'Parcial';
  totalUnits: number;
  pickedUnits: number;
  pendingUnits: number;
  estimatedDistanceMeters: number;
  traveledDistanceMeters: number;
  stops: PickPlanStop[];
}

export const STRATEGY_COMPARISONS: Record<PickingStrategyType, StrategyMetricComparison> = {
  RECOMMENDED: {
    type: 'RECOMMENDED',
    label: 'Recomendada',
    badge: 'Recomendada',
    stopsCount: 6,
    estimatedDistanceMeters: 145,
    fifoCompliancePercentage: 88,
    locationsFreedCount: 1,
    fefoCriticalCount: 1,
    ratingStars: 5,
    reasonTag: 'Recomendada',
    description: 'Combina antigüedad FIFO, cercanía entre bahías y accesibilidad en racks para acelerar el suministro a prensas.',
    panelTitle: 'Recomendada — Optimización de Surtido a Línea',
    panelSubtitle: 'Prioriza bobinas y tarimas contiguas para reducir tiempos de traslado a piso de producción sin comprometer rotación.',
  },
  SUGGESTED: {
    type: 'RECOMMENDED',
    label: 'Recomendada',
    badge: 'Recomendada',
    stopsCount: 6,
    estimatedDistanceMeters: 145,
    fifoCompliancePercentage: 88,
    locationsFreedCount: 1,
    fefoCriticalCount: 1,
    ratingStars: 5,
    reasonTag: 'Recomendada',
    description: 'Combina antigüedad FIFO, cercanía entre bahías y accesibilidad en racks para acelerar el suministro a prensas.',
    panelTitle: 'Recomendada — Optimización de Surtido a Línea',
    panelSubtitle: 'Prioriza bobinas y tarimas contiguas para reducir tiempos de traslado a piso de producción sin comprometer rotación.',
  },
  FIFO: {
    type: 'FIFO',
    label: 'FIFO Estricto',
    badge: 'Rotación',
    stopsCount: 8,
    estimatedDistanceMeters: 210,
    fifoCompliancePercentage: 100,
    locationsFreedCount: 0,
    fefoCriticalCount: 0,
    ratingStars: 4,
    reasonTag: 'FIFO Estricto',
    description: 'Primero en entrar, primero en salir. Prioriza sustratos e insumos con mayor tiempo de almacenamiento para evitar envejecimiento de materia prima.',
    panelTitle: 'FIFO Estricto — Rotación de Materia Prima',
    panelSubtitle: 'Prioriza estrictamente las bobinas y tarimas de mayor antigüedad en almacén.',
  },
  FEFO: {
    type: 'FEFO',
    label: 'FEFO / Vigencia',
    badge: 'Vigencia',
    stopsCount: 7,
    estimatedDistanceMeters: 175,
    fifoCompliancePercentage: 70,
    locationsFreedCount: 1,
    fefoCriticalCount: 3,
    ratingStars: 4,
    reasonTag: 'FEFO / Vigencia',
    description: 'Prioriza tintas, adhesivos y sustratos especiales con fecha de caducidad o tiempo de cura objetivo más próximo.',
    panelTitle: 'FEFO / Vigencia — Químicos y Tintas',
    panelSubtitle: 'Prioriza lotes de tintas Pantone, barnices UV y solventes próximos a vencimiento técnico.',
  },
  SHORTEST_PATH: {
    type: 'SHORTEST_PATH',
    label: 'Menor Recorrido',
    badge: 'Velocidad',
    stopsCount: 5,
    estimatedDistanceMeters: 98,
    fifoCompliancePercentage: 55,
    locationsFreedCount: 0,
    fefoCriticalCount: 0,
    ratingStars: 4,
    reasonTag: 'Menor Recorrido',
    description: 'Minimiza la distancia de montacargas agrupando posiciones contiguas en Pasillos A y B de ALM-MP.',
    panelTitle: 'Menor Recorrido — Despacho Urgente a Prensa',
    panelSubtitle: 'Minimiza la distancia recorrida agrupando posiciones adyacentes en racks de acceso rápido.',
  },
  EMPTY_LOCATION: {
    type: 'EMPTY_LOCATION',
    label: 'Vaciar Ubicación',
    badge: 'Liberación',
    stopsCount: 6,
    estimatedDistanceMeters: 165,
    fifoCompliancePercentage: 78,
    locationsFreedCount: 2,
    fefoCriticalCount: 1,
    ratingStars: 5,
    reasonTag: 'Vacía Ubicación',
    description: 'Prioriza tarimas donde el retiro complete la extracción total de la posición para liberar espacio de recepción en ALM-MP.',
    panelTitle: 'Vaciar Ubicación — Consolidación de Espacio',
    panelSubtitle: 'Prioriza posiciones que quedarán libres tras el surtido para habilitar recepción de nuevas bobinas.',
  },
  SHOWROOM_PRIORITY: {
    type: 'SHOWROOM_PRIORITY',
    label: 'Prioridad Muestra / QA',
    badge: 'Muestreo',
    stopsCount: 5,
    estimatedDistanceMeters: 130,
    fifoCompliancePercentage: 65,
    locationsFreedCount: 1,
    fefoCriticalCount: 1,
    ratingStars: 3,
    reasonTag: 'Muestreo QA',
    description: 'Prioriza retiro de pliegos y bobinas para tiro de prueba, calibración de color espectral o validación de suaje.',
    panelTitle: 'Prioridad Muestreo — Calibración de Prensa',
    panelSubtitle: 'Surtido de material para pruebas de tono espectral y aprobación de cliente.',
  },
  MANUAL: {
    type: 'MANUAL',
    label: 'Manual',
    badge: 'Personalizado',
    stopsCount: 6,
    estimatedDistanceMeters: 150,
    fifoCompliancePercentage: 70,
    locationsFreedCount: 0,
    fefoCriticalCount: 1,
    ratingStars: 3,
    reasonTag: 'Manual',
    description: 'Selección libre de bobinas y tarimas por el supervisor de almacén o planeador de producción sin sugerencia automática.',
    panelTitle: 'Manual — Asignación Directa',
    panelSubtitle: 'El supervisor escoge las unidades serializadas libremente conforme al programa de prensas.',
  },
};

export const ORDERED_PICKING_STRATEGIES: PickingStrategyType[] = [
  'RECOMMENDED',
  'FIFO',
  'FEFO',
  'SHORTEST_PATH',
  'EMPTY_LOCATION',
  'MANUAL',
];

export interface StrategyCalculatedUnit {
  uid: string;
  sku: string;
  productName: string;
  brand: string;
  size: string;
  location: string;
  lotNumber: string;
  ageDays: number;
  strategyBadge: string;
  strategyReason: string;
  isLocationFreed?: boolean;
}

export function calculateUnitsForStrategy(
  warehouseId: string,
  sku: string,
  requestedQuantity: number,
  strategy: PickingStrategyType,
  availableStock: StockItemRecord[] = MOCK_STOCK_ITEMS
): StrategyCalculatedUnit[] {
  const stockForSku = availableStock.filter(
    (item) => item.sku === sku && item.warehouseId === warehouseId && item.status === 'Disponible'
  );

  let sortedStock = [...stockForSku];

  switch (strategy) {
    case 'FIFO':
      sortedStock.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0));
      break;
    case 'FEFO':
      sortedStock.sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0));
      break;
    case 'SHORTEST_PATH':
      sortedStock.sort((a, b) => a.location.localeCompare(b.location));
      break;
    case 'EMPTY_LOCATION':
      sortedStock.sort((a, b) => a.location.localeCompare(b.location));
      break;
    case 'RECOMMENDED':
    case 'SUGGESTED':
    default:
      sortedStock.sort((a, b) => {
        const scoreA = (a.ageDays || 0) * 1.5;
        const scoreB = (b.ageDays || 0) * 1.5;
        return scoreB - scoreA;
      });
      break;
  }

  const selected = sortedStock.slice(0, requestedQuantity);

  return selected.map((unit, idx) => {
    let reason = 'Unidad seleccionada según estrategia operativa.';
    let badge = 'Surtido';

    if (strategy === 'FIFO') {
      reason = `Lote ${unit.lotNumber} con ${unit.ageDays} días en almacén. Mayor antigüedad en inventario.`;
      badge = 'FIFO';
    } else if (strategy === 'FEFO') {
      reason = `Lote ${unit.lotNumber} con prioridad de consumo por estabilidad química/curado.`;
      badge = 'FEFO';
    } else if (strategy === 'SHORTEST_PATH') {
      reason = `Ubicación ${unit.location} optimiza el trayecto por pasillos contiguos de ALM-MP.`;
      badge = 'Menor recorrido';
    } else if (strategy === 'EMPTY_LOCATION') {
      reason = `Al retirar esta tarima/bobina se libera la posición ${unit.location}.`;
      badge = 'Vacía Ubicación';
    } else if (strategy === 'RECOMMENDED' || strategy === 'SUGGESTED') {
      reason = idx === 0 
        ? 'Bobina/tarima con mayor antigüedad FIFO y acceso ergonómico en rack.'
        : 'Posición contigua en pasillo para reducir tiempo de maniobra con montacargas.';
      badge = idx === 0 ? 'FIFO' : 'Recomendada';
    }

    return {
      uid: unit.uid,
      sku: unit.sku,
      productName: unit.productName,
      brand: unit.brand,
      size: unit.size,
      location: unit.location,
      lotNumber: unit.lotNumber,
      ageDays: unit.ageDays,
      strategyBadge: badge,
      strategyReason: reason,
      isLocationFreed: strategy === 'EMPTY_LOCATION' && idx === selected.length - 1,
    };
  });
}

export const INITIAL_PENDING_PICKING_DEMANDS: PendingPickingDemand[] = [
  // 1. OP-2026-0882: Surtido a Prensa Flexo 1 (Nilpeter FB-3300)
  {
    id: 'dem-1',
    referenceFolio: 'OP-2026-0882',
    type: 'Surtido a Producción',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Flexo 1 (Prensa Nilpeter FB-3300)',
    articlesCount: 2,
    totalUnits: 4,
    priority: 'Alta',
    requiredDate: '07 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'PEL-BOPP-BLA', productName: 'Película BOPP Blanco Brillante 60 mic', brand: 'Fasson Avery', size: 'Bobina 330mm x 2500m', quantity: 2 },
      { sku: 'TIN-PAN-186C', productName: 'Tinta Gráfica Pantone Red 186 C', brand: 'Sun Chemical', size: 'Cubeta 5 kg', quantity: 2 },
    ],
  },
  // 2. OP-2026-0891: Surtido a Prensa Offset Heidelberg Speedmaster CX 102
  {
    id: 'dem-2',
    referenceFolio: 'OP-2026-0891',
    type: 'Surtido a Producción',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Offset (Heidelberg CX 102 - 6 Colores)',
    articlesCount: 2,
    totalUnits: 6,
    priority: 'Urgente',
    requiredDate: '07 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'PAP-COU-090', productName: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', size: 'Tarima 10,000 pliegos', quantity: 4 },
      { sku: 'TIN-PROC-BLK', productName: 'Tinta Process Black Flexo/Offset', brand: 'Sun Chemical', size: 'Cubeta 5 kg', quantity: 2 },
    ],
  },
  // 3. OP-2026-0904: Surtido a Línea Barniz UV & Troquelado Bobst
  {
    id: 'dem-3',
    referenceFolio: 'OP-2026-0904',
    type: 'Surtido a Producción',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Troquel & Barniz (Bobst Novacut 106)',
    articlesCount: 2,
    totalUnits: 5,
    priority: 'Normal',
    requiredDate: '08 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'CAR-SBS-14P', productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm', brand: 'Bio-Pappel', size: 'Tarima 5,000 hojas', quantity: 3 },
      { sku: 'BAR-UV-GLOSS', productName: 'Barniz UV Alto Brillo Gráfico', brand: 'Siegwerk', size: 'Tambo 200 kg', quantity: 2 },
    ],
  },
  // 4. OP-2026-0912: Surtido a Línea Flexo 2 (Mark Andy 2200)
  {
    id: 'dem-4',
    referenceFolio: 'OP-2026-0912',
    type: 'Surtido a Producción',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Flexo 2 (Mark Andy 2200)',
    articlesCount: 2,
    totalUnits: 4,
    priority: 'Alta',
    requiredDate: '08 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'PAP-TERM-DIR', productName: 'Papel Térmico Directo Autoadhesivo', brand: 'Fasson Avery', size: 'Bobina 250mm x 2000m', quantity: 2 },
      { sku: 'TIN-PROC-BLK', productName: 'Tinta Process Black Flexo/Offset', brand: 'Sun Chemical', size: 'Cubeta 5 kg', quantity: 2 },
    ],
  },
  // 5. PED-2026-0410: Despacho PT a Laboratorios Medifarma
  {
    id: 'dem-5',
    referenceFolio: 'PED-2026-0410',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Laboratorios Medifarma S.A. de C.V. (Parque Industrial Reynosa)',
    articlesCount: 2,
    totalUnits: 5,
    priority: 'Urgente',
    requiredDate: '07 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'ETQ-FAR-VIL', productName: 'Etiqueta Farmacéutica Vial 10ml - PT', brand: 'RTM Packaging', size: 'Rollo 5,000 pzas', quantity: 3 },
      { sku: 'FOL-MED-PLE', productName: 'Folleto Médico Farmacéutico Plegado 4 Cuerpos', brand: 'RTM Packaging', size: 'Caja 1,000 pzas', quantity: 2 },
    ],
  },
];

export const INITIAL_PICK_ORDERS: PickOrder[] = [
  // ==========================================
  // ALMACÉN MATERIA PRIMA (ALM-MP) - NAVE 1
  // ==========================================
  // 1. En proceso · Surtido OP-2026-0882 (Flexo 1)
  {
    id: 'or-1',
    folio: 'OR-2026-0118',
    referenceFolio: 'OP-2026-0882',
    type: 'Surtido a Producción',
    strategyType: 'RECOMMENDED',
    strategyName: 'Recomendada',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Flexo 1 (Prensa Nilpeter FB-3300)',
    tempStagingLocation: 'STG-OP-01',
    priority: 'Alta',
    createdAt: '06 Sep 2026 11:30',
    operatorAssigned: 'Carlos Medina (Operador Montacargas MP)',
    status: 'En proceso',
    totalUnits: 4,
    pickedUnits: 2,
    pendingUnits: 2,
    estimatedDistanceMeters: 142,
    traveledDistanceMeters: 48,
    stops: [
      {
        id: 'stop-1-1',
        sequence: 1,
        locationCode: 'A-A-01',
        aisle: 'Pasillo A',
        rackPosition: 'Posición 01',
        level: 'Nivel A (Piso)',
        uid: 'BOB-RTM-2026-00041',
        sku: 'PEL-BOPP-BLA',
        productName: 'Película BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 330mm x 2500m',
        lotNumber: 'RTM-MP-260902-011',
        ageDays: 5,
        strategyReason: 'Bobina FIFO con liberación de control de calidad lista para tiro.',
        strategyBadge: 'FIFO',
        status: 'Recolectada',
        pickedAt: '06 Sep 11:42',
      },
      {
        id: 'stop-1-2',
        sequence: 2,
        locationCode: 'A-A-02',
        aisle: 'Pasillo A',
        rackPosition: 'Posición 02',
        level: 'Nivel A (Piso)',
        uid: 'BOB-RTM-2026-00042',
        sku: 'PEL-BOPP-BLA',
        productName: 'Película BOPP Blanco Brillante 60 mic',
        brand: 'Fasson Avery',
        size: 'Bobina 330mm x 2500m',
        lotNumber: 'RTM-MP-260902-011',
        ageDays: 5,
        strategyReason: 'Mismo lote en posición contigua para optimizar recorrido.',
        strategyBadge: 'Menor recorrido',
        status: 'Recolectada',
        pickedAt: '06 Sep 11:46',
      },
      {
        id: 'stop-1-3',
        sequence: 3,
        locationCode: 'B-A-01',
        aisle: 'Pasillo B',
        rackPosition: 'Posición 01',
        level: 'Nivel A (Piso)',
        uid: 'CUB-RTM-2026-00018',
        sku: 'TIN-PAN-186C',
        productName: 'Tinta Gráfica Pantone Red 186 C',
        brand: 'Sun Chemical',
        size: 'Cubeta 5 kg',
        lotNumber: 'RTM-MP-260903-008',
        ageDays: 4,
        strategyReason: 'Cubeta con viscosidad verificada en laboratorio de tintas.',
        strategyBadge: 'Recomendada',
        status: 'Pendiente',
      },
      {
        id: 'stop-1-4',
        sequence: 4,
        locationCode: 'B-A-02',
        aisle: 'Pasillo B',
        rackPosition: 'Posición 02',
        level: 'Nivel A (Piso)',
        uid: 'CUB-RTM-2026-00019',
        sku: 'TIN-PAN-186C',
        productName: 'Tinta Gráfica Pantone Red 186 C',
        brand: 'Sun Chemical',
        size: 'Cubeta 5 kg',
        lotNumber: 'RTM-MP-260903-008',
        ageDays: 4,
        strategyReason: 'Posición contigua en Pasillo B (Racks de Tintas).',
        strategyBadge: 'Recomendada',
        status: 'Pendiente',
      },
    ],
  },
  // 2. Parcial · Surtido OP-2026-0891 (Offset Heidelberg)
  {
    id: 'or-4',
    folio: 'OR-2026-0120',
    referenceFolio: 'OP-2026-0891',
    type: 'Surtido a Producción',
    strategyType: 'FIFO',
    strategyName: 'FIFO Estricto',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Offset (Heidelberg CX 102 - 6 Colores)',
    tempStagingLocation: 'STG-OP-02',
    priority: 'Urgente',
    createdAt: '06 Sep 2026 09:00',
    operatorAssigned: 'Carlos Medina (Operador Montacargas MP)',
    status: 'Parcial',
    totalUnits: 4,
    pickedUnits: 2,
    pendingUnits: 2,
    estimatedDistanceMeters: 160,
    traveledDistanceMeters: 95,
    stops: [
      { id: 'stop-4-1', sequence: 1, locationCode: 'A-B-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'TAR-RTM-2026-00101', sku: 'PAP-COU-090', productName: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', size: 'Tarima 10,000 pliegos', lotNumber: 'RTM-MP-260901-004', ageDays: 6, strategyReason: 'Tarima FIFO de mayor antigüedad.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '06 Sep 09:18' },
      { id: 'stop-4-2', sequence: 2, locationCode: 'A-B-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel B', uid: 'TAR-RTM-2026-00102', sku: 'PAP-COU-090', productName: 'Papel Couché Brillante 90g - 70x100 cm', brand: 'Bio-Pappel', size: 'Tarima 10,000 pliegos', lotNumber: 'RTM-MP-260901-004', ageDays: 6, strategyReason: 'Tarima FIFO en misma columna.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '06 Sep 09:25' },
      { id: 'stop-4-3', sequence: 3, locationCode: 'B-B-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'CUB-RTM-2026-00051', sku: 'TIN-PROC-BLK', productName: 'Tinta Process Black Flexo/Offset', brand: 'Sun Chemical', size: 'Cubeta 5 kg', lotNumber: 'RTM-MP-260902-005', ageDays: 5, strategyReason: 'Tinta Process Black para 1er cuerpo impresor.', strategyBadge: 'FIFO', status: 'Pendiente' },
      { id: 'stop-4-4', sequence: 4, locationCode: 'B-B-02', aisle: 'Pasillo B', rackPosition: 'Posición 02', level: 'Nivel B', uid: 'CUB-RTM-2026-00052', sku: 'TIN-PROC-BLK', productName: 'Tinta Process Black Flexo/Offset', brand: 'Sun Chemical', size: 'Cubeta 5 kg', lotNumber: 'RTM-MP-260902-005', ageDays: 5, strategyReason: 'Posición contigua en Pasillo B.', strategyBadge: 'FIFO', status: 'Pendiente' },
    ],
  },
  // 3. Completa · Surtido OP-2026-0904 (Troquel & Barniz)
  {
    id: 'or-5',
    folio: 'OR-2026-0115',
    referenceFolio: 'OP-2026-0904',
    type: 'Surtido a Producción',
    strategyType: 'SHORTEST_PATH',
    strategyName: 'Menor Recorrido',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'ALM-MP (Materia Prima - Nave 1 Reynosa)',
    destinationName: 'Línea Troquel & Barniz (Bobst Novacut 106)',
    tempStagingLocation: 'STG-OP-03',
    priority: 'Normal',
    createdAt: '05 Sep 2026 15:00',
    completedAt: '05 Sep 2026 15:50',
    operatorAssigned: 'Carlos Medina (Operador Montacargas MP)',
    status: 'Completa',
    totalUnits: 3,
    pickedUnits: 3,
    pendingUnits: 0,
    estimatedDistanceMeters: 75,
    traveledDistanceMeters: 75,
    stops: [
      { id: 'stop-5-1', sequence: 1, locationCode: 'C-A-01', aisle: 'Pasillo C', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'TAR-RTM-2026-00151', sku: 'CAR-SBS-14P', productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm', brand: 'Bio-Pappel', size: 'Tarima 5,000 hojas', lotNumber: 'RTM-MP-260904-002', ageDays: 3, strategyReason: 'Posición frontal a rampa de troquelado.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '05 Sep 15:15' },
      { id: 'stop-5-2', sequence: 2, locationCode: 'C-A-02', aisle: 'Pasillo C', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'TAR-RTM-2026-00152', sku: 'CAR-SBS-14P', productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm', brand: 'Bio-Pappel', size: 'Tarima 5,000 hojas', lotNumber: 'RTM-MP-260904-002', ageDays: 3, strategyReason: 'Posición contigua en Pasillo C.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '05 Sep 15:25' },
      { id: 'stop-5-3', sequence: 3, locationCode: 'D-A-01', aisle: 'Pasillo D', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'TAM-RTM-2026-00031', sku: 'BAR-UV-GLOSS', productName: 'Barniz UV Alto Brillo Gráfico', brand: 'Siegwerk', size: 'Tambo 200 kg', lotNumber: 'RTM-MP-260903-014', ageDays: 4, strategyReason: 'Tambo UV listo en área de químicos.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '05 Sep 15:40' },
    ],
  },

  // ==========================================
  // ALMACÉN PRODUCTO TERMINADO (ALM-PT) - NAVE 2
  // ==========================================
  // 4. En proceso · Pedido Cliente Industrial (Laboratorios Medifarma)
  {
    id: 'or-3',
    folio: 'OR-2026-0125',
    referenceFolio: 'PED-2026-0410',
    type: 'Pedido de Cliente',
    strategyType: 'RECOMMENDED',
    strategyName: 'Recomendada',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Laboratorios Medifarma S.A. de C.V. (Parque Industrial Reynosa)',
    tempStagingLocation: 'STG-PT-01',
    priority: 'Alta',
    createdAt: '06 Sep 2026 12:00',
    operatorAssigned: 'Valeria Torres (Operador PT)',
    status: 'En proceso',
    totalUnits: 3,
    pickedUnits: 1,
    pendingUnits: 2,
    estimatedDistanceMeters: 110,
    traveledDistanceMeters: 35,
    stops: [
      { id: 'stop-3-1', sequence: 1, locationCode: 'A-A-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'CJ-RTM-2026-00211', sku: 'ETQ-FAR-VIL', productName: 'Etiqueta Farmacéutica Vial 10ml - PT', brand: 'RTM Packaging', size: 'Rollo 5,000 pzas', lotNumber: 'RTM-PT-260905-001', ageDays: 2, strategyReason: 'Lote PT liberado con certificado de calidad COA.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '06 Sep 12:15' },
      { id: 'stop-3-2', sequence: 2, locationCode: 'A-A-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'CJ-RTM-2026-00212', sku: 'ETQ-FAR-VIL', productName: 'Etiqueta Farmacéutica Vial 10ml - PT', brand: 'RTM Packaging', size: 'Rollo 5,000 pzas', lotNumber: 'RTM-PT-260905-001', ageDays: 2, strategyReason: 'Posición contigua en Pasillo A de ALM-PT.', strategyBadge: 'Menor recorrido', status: 'Pendiente' },
      { id: 'stop-3-3', sequence: 3, locationCode: 'B-A-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'CJ-RTM-2026-00301', sku: 'FOL-MED-PLE', productName: 'Folleto Médico Farmacéutico Plegado 4 Cuerpos', brand: 'RTM Packaging', size: 'Caja 1,000 pzas', lotNumber: 'RTM-PT-260904-003', ageDays: 3, strategyReason: 'Folletos plegados complementarios del lote farmacéutico.', strategyBadge: 'Recomendada', status: 'Pendiente' },
    ],
  },
  // 5. Completa · Despacho Cajas Delphi Technologies
  {
    id: 'or-2',
    folio: 'OR-2026-0117',
    referenceFolio: 'PED-2026-0398',
    type: 'Pedido de Cliente',
    strategyType: 'FIFO',
    strategyName: 'FIFO Estricto',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'ALM-PT (Producto Terminado - Nave 2 Reynosa)',
    destinationName: 'Delphi Technologies Reynosa (Planta 2)',
    tempStagingLocation: 'STG-PT-02',
    priority: 'Normal',
    createdAt: '05 Sep 2026 14:00',
    completedAt: '05 Sep 2026 15:10',
    operatorAssigned: 'Valeria Torres (Operador PT)',
    status: 'Completa',
    totalUnits: 3,
    pickedUnits: 3,
    pendingUnits: 0,
    estimatedDistanceMeters: 96,
    traveledDistanceMeters: 96,
    stops: [
      { id: 'stop-2-1', sequence: 1, locationCode: 'C-A-01', aisle: 'Pasillo C', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'TAR-RTM-2026-00401', sku: 'CJ-EMB-MED', productName: 'Cajas Corrugadas Flauta C 40x30x30 cm', brand: 'RTM Packaging', size: 'Tarima 500 pzas', lotNumber: 'RTM-PT-260903-010', ageDays: 4, strategyReason: 'Lote corrugado liberado para empaque automotriz.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '05 Sep 14:20' },
      { id: 'stop-2-2', sequence: 2, locationCode: 'C-A-02', aisle: 'Pasillo C', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'TAR-RTM-2026-00402', sku: 'CJ-EMB-MED', productName: 'Cajas Corrugadas Flauta C 40x30x30 cm', brand: 'RTM Packaging', size: 'Tarima 500 pzas', lotNumber: 'RTM-PT-260903-010', ageDays: 4, strategyReason: 'Posición contigua.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '05 Sep 14:35' },
      { id: 'stop-2-3', sequence: 3, locationCode: 'C-B-01', aisle: 'Pasillo C', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'TAR-RTM-2026-00403', sku: 'CJ-EMB-MED', productName: 'Cajas Corrugadas Flauta C 40x30x30 cm', brand: 'RTM Packaging', size: 'Tarima 500 pzas', lotNumber: 'RTM-PT-260903-010', ageDays: 4, strategyReason: 'Posición contigua en Pasillo C.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '05 Sep 14:55' },
    ],
  },
];
