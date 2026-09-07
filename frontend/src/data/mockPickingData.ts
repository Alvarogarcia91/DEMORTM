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
  referenceFolio: string; // ej. 'OTP-2026-0044' o 'PED-2026-0184'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno';
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
  uid: string; // ej. 'SC-UID-2026-000184'
  sku: string;
  productName: string;
  brand: string;
  size: string;
  lotNumber: string;
  ageDays: number;
  strategyReason: string; // ej. 'Unidad más antigua del SKU y de fácil acceso en piso.'
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
  referenceFolio: string; // ej. 'OTP-2026-0044'
  type: 'Orden de Traspaso' | 'Pedido de Cliente' | 'Surtido Interno';
  strategyType: PickingStrategyType;
  strategyName: string;
  warehouseId: string;
  warehouseName: string;
  destinationName: string;
  tempStagingLocation: string; // ej. 'STG-OUT-01'
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
    stopsCount: 9,
    estimatedDistanceMeters: 238,
    fifoCompliancePercentage: 82,
    locationsFreedCount: 1,
    fefoCriticalCount: 2,
    ratingStars: 5,
    reasonTag: 'Recomendada',
    description: 'Combina antigüedad, prioridad de salida, distancia y aprovechamiento de ubicaciones para generar una propuesta equilibrada.',
    panelTitle: 'Recomendada — Análisis de recorrido',
    panelSubtitle: 'Combina antigüedad FIFO, cercanía de recorrido y disponibilidad inmediata para reducir tiempo operativo sin perder rotación.',
  },
  SUGGESTED: {
    type: 'RECOMMENDED',
    label: 'Recomendada',
    badge: 'Recomendada',
    stopsCount: 9,
    estimatedDistanceMeters: 238,
    fifoCompliancePercentage: 82,
    locationsFreedCount: 1,
    fefoCriticalCount: 2,
    ratingStars: 5,
    reasonTag: 'Recomendada',
    description: 'Combina antigüedad, prioridad de salida, distancia y aprovechamiento de ubicaciones para generar una propuesta equilibrada.',
    panelTitle: 'Recomendada — Análisis de recorrido',
    panelSubtitle: 'Combina antigüedad FIFO, cercanía de recorrido y disponibilidad inmediata para reducir tiempo operativo sin perder rotación.',
  },
  FIFO: {
    type: 'FIFO',
    label: 'FIFO Estricto',
    badge: 'Rotación',
    stopsCount: 12,
    estimatedDistanceMeters: 312,
    fifoCompliancePercentage: 100,
    locationsFreedCount: 0,
    fefoCriticalCount: 0,
    ratingStars: 4,
    reasonTag: 'FIFO Estricto',
    description: 'Primero en entrar, primero en salir. Se priorizan estrictamente los colchones con mayor tiempo en almacén para asegurar la rotación natural del inventario.',
    panelTitle: 'FIFO Estricto — Rotación por Antigüedad',
    panelSubtitle: 'Prioriza estrictamente los colchones con mayor tiempo en almacén para asegurar la rotación natural.',
  },
  FEFO: {
    type: 'FEFO',
    label: 'FEFO / Vigencia',
    badge: 'Vigencia',
    stopsCount: 10,
    estimatedDistanceMeters: 256,
    fifoCompliancePercentage: 65,
    locationsFreedCount: 1,
    fefoCriticalCount: 3,
    ratingStars: 4,
    reasonTag: 'FEFO / Vigencia',
    description: 'Prioriza unidades con fecha objetivo de rotación más próxima o modelos de cambio de catálogo para acelerar su salida comercial.',
    panelTitle: 'FEFO / Vigencia — Prioridad de Catálogo',
    panelSubtitle: 'Prioriza fechas, lotes con vencimiento objetivo o modelos próximos a cambio de catálogo.',
  },
  SHORTEST_PATH: {
    type: 'SHORTEST_PATH',
    label: 'Menor Recorrido',
    badge: 'Velocidad',
    stopsCount: 7,
    estimatedDistanceMeters: 184,
    fifoCompliancePercentage: 45,
    locationsFreedCount: 0,
    fefoCriticalCount: 0,
    ratingStars: 4,
    reasonTag: 'Menor Recorrido',
    description: 'Minimiza la distancia recorrida en pasillos agrupando las posiciones contiguas y niveles ergonómicos sin priorizar antigüedad.',
    panelTitle: 'Menor Recorrido — Optimización de Pasillos',
    panelSubtitle: 'Minimiza la distancia recorrida en pasillos agrupando posiciones contiguas.',
  },
  EMPTY_LOCATION: {
    type: 'EMPTY_LOCATION',
    label: 'Vaciar Ubicación',
    badge: 'Liberación',
    stopsCount: 8,
    estimatedDistanceMeters: 274,
    fifoCompliancePercentage: 76,
    locationsFreedCount: 2,
    fefoCriticalCount: 1,
    ratingStars: 5,
    reasonTag: 'Vacía Ubicación',
    description: 'Prioriza posiciones donde la selección puede retirar todas las unidades disponibles del artículo, liberando espacio y reduciendo inventario fragmentado.',
    panelTitle: 'Vaciar Ubicación — Consolidación de Espacio',
    panelSubtitle: 'La selección prioriza posiciones que pueden quedar sin existencias del artículo al completar esta recolección.',
  },
  SHOWROOM_PRIORITY: {
    type: 'SHOWROOM_PRIORITY',
    label: 'Prioridad Showroom',
    badge: 'Exhibición',
    stopsCount: 8,
    estimatedDistanceMeters: 210,
    fifoCompliancePercentage: 70,
    locationsFreedCount: 1,
    fefoCriticalCount: 1,
    ratingStars: 3,
    reasonTag: 'Showroom',
    description: 'Prioriza unidades de reposición para renovar exhibición en piso de venta o transferir piezas para montaje en tienda.',
    panelTitle: 'Prioridad Showroom — Renovación de Exhibición',
    panelSubtitle: 'Prioriza unidades destinadas a muestra y rotación en piso de venta.',
  },
  MANUAL: {
    type: 'MANUAL',
    label: 'Manual',
    badge: 'Personalizado',
    stopsCount: 9,
    estimatedDistanceMeters: 240,
    fifoCompliancePercentage: 70,
    locationsFreedCount: 0,
    fefoCriticalCount: 1,
    ratingStars: 3,
    reasonTag: 'Manual',
    description: 'Selección libre de unidades físicas por el supervisor o planeador de operaciones sin sugerencia prioritaria.',
    panelTitle: 'Manual — Selección Libre',
    panelSubtitle: 'El supervisor o planeador escoge las unidades serializadas libremente sin sugerencia del sistema.',
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
      sortedStock.sort((a, b) => {
        if (a.lotNumber.includes('W31') && !b.lotNumber.includes('W31')) return -1;
        if (!a.lotNumber.includes('W31') && b.lotNumber.includes('W31')) return 1;
        return (b.ageDays || 0) - (a.ageDays || 0);
      });
      break;
    case 'SHORTEST_PATH':
      sortedStock.sort((a, b) => a.location.localeCompare(b.location));
      break;
    case 'EMPTY_LOCATION':
      sortedStock.sort((a, b) => {
        const countA = availableStock.filter((i) => i.location === a.location && i.sku === sku).length;
        const countB = availableStock.filter((i) => i.location === b.location && i.sku === sku).length;
        return countA - countB;
      });
      break;
    case 'RECOMMENDED':
    case 'SUGGESTED':
    default:
      sortedStock.sort((a, b) => {
        const scoreA = (a.ageDays || 0) * 1.5 - (a.location.startsWith('A-A') ? 0 : 10);
        const scoreB = (b.ageDays || 0) * 1.5 - (b.location.startsWith('A-A') ? 0 : 10);
        return scoreB - scoreA;
      });
      break;
  }

  const selected = sortedStock.slice(0, requestedQuantity);

  return selected.map((unit, idx) => {
    let reason = 'Unidad seleccionada por algoritmo de optimización.';
    let badge = 'Recomendada';

    if (strategy === 'FIFO') {
      reason = `Unidad con ${unit.ageDays} días de antigüedad en almacén. Cumple regla FIFO estricta.`;
      badge = 'FIFO';
    } else if (strategy === 'FEFO') {
      reason = `Lote ${unit.lotNumber} próximo a cambio de catálogo comercial.`;
      badge = 'FEFO';
    } else if (strategy === 'SHORTEST_PATH') {
      reason = `Ubicación ${unit.location} optimiza el trayecto por pasillos contiguos.`;
      badge = 'Menor recorrido';
    } else if (strategy === 'EMPTY_LOCATION') {
      reason = `Al retirar esta unidad se libera la posición ${unit.location}.`;
      badge = 'Vacía Ubicación';
    } else if (strategy === 'RECOMMENDED' || strategy === 'SUGGESTED') {
      reason = idx === 0 
        ? 'Unidad más antigua del SKU y de fácil acceso en nivel ergonómico.'
        : 'Posición contigua en pasillo para reducir tiempo de recorrido.';
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
  // 1. CEDIS Norte - Traspaso Sucursal Valle Oriente
  {
    id: 'dem-1',
    referenceFolio: 'OTP-2026-0044',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    articlesCount: 3,
    totalUnits: 6,
    priority: 'Alta',
    requiredDate: '27 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', quantity: 2 },
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', quantity: 2 },
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', quantity: 2 },
    ],
  },
  // 2. CEDIS Norte - Pedido Hotel Boutique Las Lomas
  {
    id: 'dem-2',
    referenceFolio: 'PED-2026-0184',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Hotel Boutique Las Lomas S.A. de C.V.',
    articlesCount: 2,
    totalUnits: 14,
    priority: 'Urgente',
    requiredDate: '28 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 10 },
      { sku: 'SC-REST-ORTO-KS', productName: 'Restonic Ortopédico Extra Firme King Size', brand: 'Restonic', size: 'King Size', quantity: 4 },
    ],
  },
  // 3. CEDIS Norte - Pedido Corporativo Desarrollos Residenciales
  {
    id: 'dem-3',
    referenceFolio: 'PED-2026-0185',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Desarrollos Residenciales del Norte S.A.',
    articlesCount: 2,
    totalUnits: 8,
    priority: 'Normal',
    requiredDate: '29 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-SEAL-POST-QS', productName: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', size: 'Queen Size', quantity: 4 },
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', quantity: 4 },
    ],
  },
  // 4. CEDIS Sur - Reabastecimiento Sucursal Cumbres
  {
    id: 'dem-4',
    referenceFolio: 'OTP-2026-0045',
    type: 'Orden de Traspaso',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    articlesCount: 2,
    totalUnits: 8,
    priority: 'Alta',
    requiredDate: '27 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', quantity: 5 },
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 3 },
    ],
  },
  // 5. CEDIS Sur - Pedido Cliente Particular Carretera Nacional
  {
    id: 'dem-5',
    referenceFolio: 'PED-2026-0186',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Roberto Cantú Garza (Ruta Carretera Nacional)',
    articlesCount: 2,
    totalUnits: 3,
    priority: 'Urgente',
    requiredDate: '27 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', quantity: 1 },
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 2 },
    ],
  },
  // 6. Sucursal Valle Oriente - Surtido Entrega Domicilio
  {
    id: 'dem-6',
    referenceFolio: 'PED-2026-0187',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-suc-valle-oriente',
    warehouseName: 'Sucursal Valle Oriente',
    destinationName: 'Dra. Gabriela Morales (Entrega San Pedro)',
    articlesCount: 1,
    totalUnits: 2,
    priority: 'Normal',
    requiredDate: '28 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', quantity: 2 },
    ],
  },
  // 7. Sucursal Cumbres - Surtido Cliente Local
  {
    id: 'dem-7',
    referenceFolio: 'PED-2026-0188',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-suc-cumbres',
    warehouseName: 'Sucursal Cumbres',
    destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
    articlesCount: 1,
    totalUnits: 2,
    priority: 'Normal',
    requiredDate: '28 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', quantity: 2 },
    ],
  },
  // 8. CEDIS Norte - Pedido Inmobiliaria & Rentas Cumbres
  {
    id: 'dem-8',
    referenceFolio: 'PED-2026-0101',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
    articlesCount: 1,
    totalUnits: 4,
    priority: 'Alta',
    requiredDate: '29 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', quantity: 4 },
    ],
  },
  // 9. CEDIS Norte - Pedido Hotel Boutique Las Lomas
  {
    id: 'dem-9',
    referenceFolio: 'PED-2026-0107',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Hotel Boutique Las Lomas',
    articlesCount: 2,
    totalUnits: 8,
    priority: 'Alta',
    requiredDate: '30 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-REST-ORTO-KS', productName: 'Restonic Ortopédico Extra Firme King Size', brand: 'Restonic', size: 'King Size', quantity: 4 },
      { sku: 'SC-SPA-REC-MAT', productName: 'Spring Air Colchón Record Matrimonial', brand: 'Spring Air', size: 'Matrimonial', quantity: 4 },
    ],
  },
  // 10. CEDIS Norte - Pedido Residencial Roberto Cantú
  {
    id: 'dem-10',
    referenceFolio: 'PED-2026-0124',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Roberto Cantú Garza (San Pedro)',
    articlesCount: 1,
    totalUnits: 1,
    priority: 'Normal',
    requiredDate: '29 Ago 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-SPA-REC-KS', productName: 'Spring Air Colchón Record King Size', brand: 'Spring Air', size: 'King Size', quantity: 1 },
    ],
  },
  // 11. CEDIS Norte - Pedido Corporativo Valle Real
  {
    id: 'dem-11',
    referenceFolio: 'PED-2026-0125',
    type: 'Pedido de Cliente',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Corporativo Valle Real S.A.',
    articlesCount: 1,
    totalUnits: 20,
    priority: 'Urgente',
    requiredDate: '01 Sep 2026',
    status: 'Pendiente de planeación',
    itemsSummary: [
      { sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', quantity: 20 },
    ],
  },
];

export const INITIAL_PICK_ORDERS: PickOrder[] = [
  // ==========================================
  // CEDIS MONTERREY NORTE
  // ==========================================
  // 1. En proceso · Estrategia Recomendada
  {
    id: 'or-1',
    folio: 'OR-2026-0118',
    referenceFolio: 'OTP-2026-0044',
    type: 'Orden de Traspaso',
    strategyType: 'RECOMMENDED',
    strategyName: 'Recomendada',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Alta',
    createdAt: '27 Ago 2026 11:30',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'En proceso',
    totalUnits: 6,
    pickedUnits: 2,
    pendingUnits: 4,
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
        uid: 'SC-UID-2026-000101',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W31',
        ageDays: 28,
        strategyReason: 'Unidad más antigua del SKU y de fácil acceso en piso.',
        strategyBadge: 'FIFO',
        status: 'Recolectada',
        pickedAt: '27 Ago 11:42',
      },
      {
        id: 'stop-1-2',
        sequence: 2,
        locationCode: 'A-A-02',
        aisle: 'Pasillo A',
        rackPosition: 'Posición 02',
        level: 'Nivel A (Piso)',
        uid: 'SC-UID-2026-000102',
        sku: 'SC-NAYT-FLOW-IND',
        productName: 'Nayt Colchón Flow Basic White Individual',
        brand: 'Nayt',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W31',
        ageDays: 28,
        strategyReason: 'Posición contigua en Pasillo A para reducir recorrido.',
        strategyBadge: 'Menor recorrido',
        status: 'Recolectada',
        pickedAt: '27 Ago 11:46',
      },
      {
        id: 'stop-1-3',
        sequence: 3,
        locationCode: 'A-B-03',
        aisle: 'Pasillo A',
        rackPosition: 'Posición 03',
        level: 'Nivel B (Medio)',
        uid: 'SC-UID-2026-000184',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        ageDays: 24,
        strategyReason: 'Alta demanda y cercanía inmediata a salida de pasillo.',
        strategyBadge: 'Recomendada',
        status: 'Pendiente',
      },
      {
        id: 'stop-1-4',
        sequence: 4,
        locationCode: 'A-B-04',
        aisle: 'Pasillo A',
        rackPosition: 'Posición 04',
        level: 'Nivel B (Medio)',
        uid: 'SC-UID-2026-000185',
        sku: 'SC-NAYT-FLOW-MAT',
        productName: 'Nayt Colchón Flow Basic White Matrimonial',
        brand: 'Nayt',
        size: 'Matrimonial',
        lotNumber: 'LOTE-2026-W34',
        ageDays: 24,
        strategyReason: 'Mismo lote y bahía contigua.',
        strategyBadge: 'Recomendada',
        status: 'Pendiente',
      },
      {
        id: 'stop-1-5',
        sequence: 5,
        locationCode: 'B-A-01',
        aisle: 'Pasillo B',
        rackPosition: 'Posición 01',
        level: 'Nivel A (Piso)',
        uid: 'SC-UID-2026-000121',
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W32',
        ageDays: 22,
        strategyReason: 'Unidad FIFO en entrada de Pasillo B.',
        strategyBadge: 'FIFO',
        status: 'Pendiente',
      },
      {
        id: 'stop-1-6',
        sequence: 6,
        locationCode: 'B-A-02',
        aisle: 'Pasillo B',
        rackPosition: 'Posición 02',
        level: 'Nivel A (Piso)',
        uid: 'SC-UID-2026-000122',
        sku: 'SC-SPA-REC-IND',
        productName: 'Spring Air Colchón Record Individual',
        brand: 'Spring Air',
        size: 'Individual',
        lotNumber: 'LOTE-2026-W32',
        ageDays: 22,
        strategyReason: 'Última parada antes de rampa STG-OUT-01.',
        strategyBadge: 'Menor recorrido',
        status: 'Pendiente',
      },
    ],
  },
  // 2. Parcial · Estrategia FIFO Estricto con Sustitución
  {
    id: 'or-4',
    folio: 'OR-2026-0120',
    referenceFolio: 'PED-2026-0180',
    type: 'Pedido de Cliente',
    strategyType: 'FIFO',
    strategyName: 'FIFO Estricto',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Grupo Hotelero Sierra Madre S.A.',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Urgente',
    createdAt: '27 Ago 2026 09:00',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Parcial',
    totalUnits: 5,
    pickedUnits: 3,
    pendingUnits: 2,
    estimatedDistanceMeters: 160,
    traveledDistanceMeters: 95,
    stops: [
      { id: 'stop-4-1', sequence: 1, locationCode: 'A-A-03', aisle: 'Pasillo A', rackPosition: 'Posición 03', level: 'Nivel A', uid: 'SC-UID-2026-000103', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', ageDays: 28, strategyReason: 'Mayor antigüedad FIFO.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '27 Ago 09:18' },
      { id: 'stop-4-2', sequence: 2, locationCode: 'A-A-04', aisle: 'Pasillo A', rackPosition: 'Posición 04', level: 'Nivel A', uid: 'SC-UID-2026-000104', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W31', ageDays: 28, strategyReason: 'Mayor antigüedad FIFO.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '27 Ago 09:25' },
      { id: 'stop-4-3', sequence: 3, locationCode: 'A-B-05', aisle: 'Pasillo A', rackPosition: 'Posición 05', level: 'Nivel B', uid: 'SC-UID-2026-000105', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 25, strategyReason: 'Sustitución aprobada por empaque dañado en posición original.', strategyBadge: 'Sustitución', status: 'Recolectada', pickedAt: '27 Ago 09:40', substitutedFromUid: 'SC-UID-2026-000106', substitutionReason: 'Empaque dañado en posición previa.' },
      { id: 'stop-4-4', sequence: 4, locationCode: 'B-A-03', aisle: 'Pasillo B', rackPosition: 'Posición 03', level: 'Nivel A', uid: 'SC-UID-2026-000123', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 22, strategyReason: 'FIFO en Pasillo B.', strategyBadge: 'FIFO', status: 'Pendiente' },
      { id: 'stop-4-5', sequence: 5, locationCode: 'B-A-04', aisle: 'Pasillo B', rackPosition: 'Posición 04', level: 'Nivel A', uid: 'SC-UID-2026-000124', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 22, strategyReason: 'FIFO en Pasillo B.', strategyBadge: 'FIFO', status: 'Pendiente' },
    ],
  },
  // 3. Completa · Estrategia Menor Recorrido
  {
    id: 'or-5',
    folio: 'OR-2026-0115',
    referenceFolio: 'OTP-2026-0040',
    type: 'Orden de Traspaso',
    strategyType: 'SHORTEST_PATH',
    strategyName: 'Menor Recorrido',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Sucursal Valle Oriente',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Normal',
    createdAt: '26 Ago 2026 15:00',
    completedAt: '26 Ago 2026 15:50',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Completa',
    totalUnits: 4,
    pickedUnits: 4,
    pendingUnits: 0,
    estimatedDistanceMeters: 75,
    traveledDistanceMeters: 75,
    stops: [
      { id: 'stop-5-1', sequence: 1, locationCode: 'A-A-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'SC-UID-2026-000151', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '26 Ago 15:15' },
      { id: 'stop-5-2', sequence: 2, locationCode: 'A-A-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'SC-UID-2026-000152', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '26 Ago 15:25' },
      { id: 'stop-5-3', sequence: 3, locationCode: 'A-A-03', aisle: 'Pasillo A', rackPosition: 'Posición 03', level: 'Nivel A', uid: 'SC-UID-2026-000153', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '26 Ago 15:35' },
      { id: 'stop-5-4', sequence: 4, locationCode: 'A-A-04', aisle: 'Pasillo A', rackPosition: 'Posición 04', level: 'Nivel A', uid: 'SC-UID-2026-000154', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '26 Ago 15:45' },
    ],
  },
  // 4. Pendiente · Estrategia Vaciar Ubicación
  {
    id: 'or-6',
    folio: 'OR-2026-0122',
    referenceFolio: 'PED-2026-0181',
    type: 'Pedido de Cliente',
    strategyType: 'EMPTY_LOCATION',
    strategyName: 'Vaciar Ubicación',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Inmobiliaria & Rentas Cumbres S.A.',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Normal',
    createdAt: '27 Ago 2026 12:30',
    operatorAssigned: 'Roberto Garza (Operador Picking)',
    status: 'Pendiente',
    totalUnits: 3,
    pickedUnits: 0,
    pendingUnits: 3,
    estimatedDistanceMeters: 120,
    traveledDistanceMeters: 0,
    stops: [
      { id: 'stop-6-1', sequence: 1, locationCode: 'B-C-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel C', uid: 'SC-UID-2026-000161', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 20, strategyReason: 'Al retirar esta unidad se vacía la posición B-C-01.', strategyBadge: 'Vacía Ubicación', status: 'Pendiente', isLocationFreed: true },
      { id: 'stop-6-2', sequence: 2, locationCode: 'B-C-02', aisle: 'Pasillo B', rackPosition: 'Posición 02', level: 'Nivel C', uid: 'SC-UID-2026-000162', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 20, strategyReason: 'Al retirar esta unidad se vacía la posición B-C-02.', strategyBadge: 'Vacía Ubicación', status: 'Pendiente', isLocationFreed: true },
      { id: 'stop-6-3', sequence: 3, locationCode: 'B-C-03', aisle: 'Pasillo B', rackPosition: 'Posición 03', level: 'Nivel C', uid: 'SC-UID-2026-000163', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Ortopédico Extra Firme Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 20, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Pendiente' },
    ],
  },
  // 5. Pendiente · Estrategia FEFO / Vigencia
  {
    id: 'or-7',
    folio: 'OR-2026-0123',
    referenceFolio: 'PED-2026-0182',
    type: 'Pedido de Cliente',
    strategyType: 'FEFO',
    strategyName: 'FEFO / Vigencia',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Desarrollos Residenciales del Norte S.A.',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Alta',
    createdAt: '27 Ago 2026 13:00',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Pendiente',
    totalUnits: 2,
    pickedUnits: 0,
    pendingUnits: 2,
    estimatedDistanceMeters: 90,
    traveledDistanceMeters: 0,
    stops: [
      { id: 'stop-7-1', sequence: 1, locationCode: 'A-B-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'SC-UID-2026-000164', sku: 'SC-SEAL-POST-QS', productName: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', size: 'Queen Size', lotNumber: 'LOTE-2026-W31', ageDays: 32, strategyReason: 'Lote de edición previa próximo a cambio de catálogo comercial.', strategyBadge: 'FEFO', status: 'Pendiente' },
      { id: 'stop-7-2', sequence: 2, locationCode: 'A-B-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel B', uid: 'SC-UID-2026-000165', sku: 'SC-SEAL-POST-QS', productName: 'Sealy Posturepedic Crown Jewel Queen Size', brand: 'Sealy', size: 'Queen Size', lotNumber: 'LOTE-2026-W31', ageDays: 32, strategyReason: 'Mismo lote FEFO.', strategyBadge: 'FEFO', status: 'Pendiente' },
    ],
  },
  // 6. Completa · Estrategia Manual
  {
    id: 'or-8',
    folio: 'OR-2026-0114',
    referenceFolio: 'PED-2026-0178',
    type: 'Pedido de Cliente',
    strategyType: 'MANUAL',
    strategyName: 'Manual',
    warehouseId: 'wh-mty-norte',
    warehouseName: 'CEDIS Monterrey Norte',
    destinationName: 'Cliente Particular Zona Cumbres',
    tempStagingLocation: 'STG-OUT-01',
    priority: 'Normal',
    createdAt: '26 Ago 2026 10:00',
    completedAt: '26 Ago 2026 10:45',
    operatorAssigned: 'Carlos Medina (Operador Mesa 01)',
    status: 'Completa',
    totalUnits: 2,
    pickedUnits: 2,
    pendingUnits: 0,
    estimatedDistanceMeters: 60,
    traveledDistanceMeters: 60,
    stops: [
      { id: 'stop-8-1', sequence: 1, locationCode: 'A-A-05', aisle: 'Pasillo A', rackPosition: 'Posición 05', level: 'Nivel A', uid: 'SC-UID-2026-000141', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 16, strategyReason: 'Selección manual por supervisor.', strategyBadge: 'Manual', status: 'Recolectada', pickedAt: '26 Ago 10:20' },
      { id: 'stop-8-2', sequence: 2, locationCode: 'A-A-06', aisle: 'Pasillo A', rackPosition: 'Posición 06', level: 'Nivel A', uid: 'SC-UID-2026-000142', sku: 'SC-NAYT-FLOW-MAT', productName: 'Nayt Colchón Flow Basic White Matrimonial', brand: 'Nayt', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 16, strategyReason: 'Selección manual por supervisor.', strategyBadge: 'Manual', status: 'Recolectada', pickedAt: '26 Ago 10:35' },
    ],
  },

  // ==========================================
  // CEDIS MONTERREY SUR
  // ==========================================
  // 7. En proceso · Estrategia Recomendada
  {
    id: 'or-3',
    folio: 'OR-2026-0125',
    referenceFolio: 'OTP-2026-0048',
    type: 'Orden de Traspaso',
    strategyType: 'RECOMMENDED',
    strategyName: 'Recomendada',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Alta',
    createdAt: '27 Ago 2026 12:00',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'En proceso',
    totalUnits: 4,
    pickedUnits: 1,
    pendingUnits: 3,
    estimatedDistanceMeters: 110,
    traveledDistanceMeters: 35,
    stops: [
      { id: 'stop-3-1', sequence: 1, locationCode: 'B-A-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'SC-UID-2026-000135', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 15, strategyReason: 'Lote más antiguo disponible en piso.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '27 Ago 12:15' },
      { id: 'stop-3-2', sequence: 2, locationCode: 'B-A-02', aisle: 'Pasillo B', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'SC-UID-2026-000136', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 15, strategyReason: 'Posición contigua en Pasillo B.', strategyBadge: 'Menor recorrido', status: 'Pendiente' },
      { id: 'stop-3-3', sequence: 3, locationCode: 'B-B-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'SC-UID-2026-000301', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35', ageDays: 2, strategyReason: 'Prioridad de salida King Size.', strategyBadge: 'Recomendada', status: 'Pendiente' },
      { id: 'stop-3-4', sequence: 4, locationCode: 'B-B-02', aisle: 'Pasillo B', rackPosition: 'Posición 02', level: 'Nivel B', uid: 'SC-UID-2026-000302', sku: 'SC-SEA-CLB-KS', productName: 'Sealy Colchón Celebration Plus King Size', brand: 'Sealy', size: 'King Size', lotNumber: 'LOTE-2026-W35', ageDays: 2, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Pendiente' },
    ],
  },
  // 8. Completa · Estrategia FIFO Estricto
  {
    id: 'or-2',
    folio: 'OR-2026-0117',
    referenceFolio: 'PED-2026-0179',
    type: 'Pedido de Cliente',
    strategyType: 'FIFO',
    strategyName: 'FIFO Estricto',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Ruta Guadalupe #04',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Normal',
    createdAt: '26 Ago 2026 14:00',
    completedAt: '26 Ago 2026 15:10',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'Completa',
    totalUnits: 3,
    pickedUnits: 3,
    pendingUnits: 0,
    estimatedDistanceMeters: 96,
    traveledDistanceMeters: 96,
    stops: [
      { id: 'stop-2-1', sequence: 1, locationCode: 'B-A-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'SC-UID-2026-000131', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 19, strategyReason: 'Lote más antiguo.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '26 Ago 14:20' },
      { id: 'stop-2-2', sequence: 2, locationCode: 'B-A-02', aisle: 'Pasillo B', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'SC-UID-2026-000132', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 19, strategyReason: 'Lote más antiguo.', strategyBadge: 'FIFO', status: 'Recolectada', pickedAt: '26 Ago 14:35' },
      { id: 'stop-2-3', sequence: 3, locationCode: 'B-B-01', aisle: 'Pasillo B', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'SC-UID-2026-000133', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 19, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '26 Ago 14:55' },
    ],
  },
  // 9. Pendiente · Estrategia FEFO / Vigencia
  {
    id: 'or-9',
    folio: 'OR-2026-0126',
    referenceFolio: 'PED-2026-0183',
    type: 'Pedido de Cliente',
    strategyType: 'FEFO',
    strategyName: 'FEFO / Vigencia',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Ruta Santiago #01',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Normal',
    createdAt: '27 Ago 2026 13:15',
    operatorAssigned: 'Miguel Ángel Soto (Operador Sur)',
    status: 'Pendiente',
    totalUnits: 2,
    pickedUnits: 0,
    pendingUnits: 2,
    estimatedDistanceMeters: 80,
    traveledDistanceMeters: 0,
    stops: [
      { id: 'stop-9-1', sequence: 1, locationCode: 'A-A-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel A', uid: 'SC-UID-2026-000191', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 24, strategyReason: 'FEFO catálogo anterior.', strategyBadge: 'FEFO', status: 'Pendiente' },
      { id: 'stop-9-2', sequence: 2, locationCode: 'A-A-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel A', uid: 'SC-UID-2026-000192', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 24, strategyReason: 'FEFO catálogo anterior.', strategyBadge: 'FEFO', status: 'Pendiente' },
    ],
  },
  // 10. Parcial · Estrategia Vaciar Ubicación
  {
    id: 'or-10',
    folio: 'OR-2026-0127',
    referenceFolio: 'OTP-2026-0049',
    type: 'Orden de Traspaso',
    strategyType: 'EMPTY_LOCATION',
    strategyName: 'Vaciar Ubicación',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'CEDIS Monterrey Norte',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Normal',
    createdAt: '27 Ago 2026 10:45',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'Parcial',
    totalUnits: 3,
    pickedUnits: 1,
    pendingUnits: 2,
    estimatedDistanceMeters: 105,
    traveledDistanceMeters: 30,
    stops: [
      { id: 'stop-10-1', sequence: 1, locationCode: 'A-B-01', aisle: 'Pasillo A', rackPosition: 'Posición 01', level: 'Nivel B', uid: 'SC-UID-2026-000193', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 18, strategyReason: 'Ubicación vaciada con éxito.', strategyBadge: 'Vacía Ubicación', status: 'Recolectada', pickedAt: '27 Ago 11:10', isLocationFreed: true },
      { id: 'stop-10-2', sequence: 2, locationCode: 'A-B-02', aisle: 'Pasillo A', rackPosition: 'Posición 02', level: 'Nivel B', uid: 'SC-UID-2026-000194', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 18, strategyReason: 'Al retirar se liberará A-B-02.', strategyBadge: 'Vacía Ubicación', status: 'Pendiente', isLocationFreed: true },
      { id: 'stop-10-3', sequence: 3, locationCode: 'A-B-03', aisle: 'Pasillo A', rackPosition: 'Posición 03', level: 'Nivel B', uid: 'SC-UID-2026-000195', sku: 'SC-SPA-REC-IND', productName: 'Spring Air Colchón Record Individual', brand: 'Spring Air', size: 'Individual', lotNumber: 'LOTE-2026-W33', ageDays: 18, strategyReason: 'Posición contigua.', strategyBadge: 'Menor recorrido', status: 'Pendiente' },
    ],
  },
  // 11. Completa · Estrategia Manual
  {
    id: 'or-11',
    folio: 'OR-2026-0116',
    referenceFolio: 'PED-2026-0177',
    type: 'Pedido de Cliente',
    strategyType: 'MANUAL',
    strategyName: 'Manual',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Cliente Local Sur',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Normal',
    createdAt: '25 Ago 2026 16:00',
    completedAt: '25 Ago 2026 16:40',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'Completa',
    totalUnits: 2,
    pickedUnits: 2,
    pendingUnits: 0,
    estimatedDistanceMeters: 55,
    traveledDistanceMeters: 55,
    stops: [
      { id: 'stop-11-1', sequence: 1, locationCode: 'B-A-03', aisle: 'Pasillo B', rackPosition: 'Posición 03', level: 'Nivel A', uid: 'SC-UID-2026-000137', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Selección manual.', strategyBadge: 'Manual', status: 'Recolectada', pickedAt: '25 Ago 16:15' },
      { id: 'stop-11-2', sequence: 2, locationCode: 'B-A-04', aisle: 'Pasillo B', rackPosition: 'Posición 04', level: 'Nivel A', uid: 'SC-UID-2026-000138', sku: 'SC-REST-ORTO-MAT', productName: 'Restonic Colchón Ortopedic Matrimonial', brand: 'Restonic', size: 'Matrimonial', lotNumber: 'LOTE-2026-W33', ageDays: 14, strategyReason: 'Selección manual.', strategyBadge: 'Manual', status: 'Recolectada', pickedAt: '25 Ago 16:30' },
    ],
  },
  // 12. Completa · Estrategia Menor Recorrido
  {
    id: 'or-12',
    folio: 'OR-2026-0113',
    referenceFolio: 'OTP-2026-0038',
    type: 'Orden de Traspaso',
    strategyType: 'SHORTEST_PATH',
    strategyName: 'Menor Recorrido',
    warehouseId: 'wh-mty-sur',
    warehouseName: 'CEDIS Monterrey Sur',
    destinationName: 'Sucursal Cumbres',
    tempStagingLocation: 'STG-OUT-02',
    priority: 'Normal',
    createdAt: '25 Ago 2026 11:00',
    completedAt: '25 Ago 2026 11:45',
    operatorAssigned: 'Valeria Torres (Operador Mesa 02)',
    status: 'Completa',
    totalUnits: 2,
    pickedUnits: 2,
    pendingUnits: 0,
    estimatedDistanceMeters: 50,
    traveledDistanceMeters: 50,
    stops: [
      { id: 'stop-12-1', sequence: 1, locationCode: 'A-A-03', aisle: 'Pasillo A', rackPosition: 'Posición 03', level: 'Nivel A', uid: 'SC-UID-2026-000145', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 20, strategyReason: 'Recorrido mínimo.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '25 Ago 11:20' },
      { id: 'stop-12-2', sequence: 2, locationCode: 'A-A-04', aisle: 'Pasillo A', rackPosition: 'Posición 04', level: 'Nivel A', uid: 'SC-UID-2026-000146', sku: 'SC-NAYT-FLOW-IND', productName: 'Nayt Colchón Flow Basic White Individual', brand: 'Nayt', size: 'Individual', lotNumber: 'LOTE-2026-W32', ageDays: 20, strategyReason: 'Recorrido mínimo.', strategyBadge: 'Menor recorrido', status: 'Recolectada', pickedAt: '25 Ago 11:35' },
    ],
  },
];
